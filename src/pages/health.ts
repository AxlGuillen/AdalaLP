import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

/** Rutas públicas que deben responder 200 con HTML. */
const PAGES = ['/es', '/en', '/es/contacto', '/en/contacto', '/es/privacy', '/en/privacy', '/es/terms', '/en/terms'];

/** Recursos para agentes que deben seguir publicados. */
const AGENT_ASSETS = ['/robots.txt', '/.well-known/agent-skills/index.json', '/es/index.md'];

type Check = { name: string; ok: boolean; detail?: string; ms?: number };

const timed = async <T>(fn: () => Promise<T>): Promise<[T, number]> => {
  const started = Date.now();
  const value = await fn();
  return [value, Date.now() - started];
};

/** GET a una URL propia; valida status y, opcionalmente, una marca en el cuerpo. */
const checkUrl = async (origin: string, route: string, marker?: string): Promise<Check> => {
  const started = Date.now();
  try {
    const response = await fetch(new URL(route, origin), {
      headers: { 'user-agent': 'adala-healthcheck' },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return { name: route, ok: false, detail: `HTTP ${response.status}`, ms: Date.now() - started };
    }

    if (marker) {
      const body = await response.text();
      if (!body.includes(marker)) {
        return { name: route, ok: false, detail: `falta "${marker}" en el cuerpo`, ms: Date.now() - started };
      }
    }

    return { name: route, ok: true, ms: Date.now() - started };
  } catch (error) {
    return { name: route, ok: false, detail: (error as Error).message, ms: Date.now() - started };
  }
};

/**
 * Prueba la ruta de escritura real del formulario (PostgREST + política RLS)
 * mediante una función que revierte su propio INSERT: no persiste registros.
 */
const checkContactForm = async (): Promise<Check> => {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return { name: 'contact-form', ok: false, detail: 'faltan las variables PUBLIC_SUPABASE_*' };
  }

  const started = Date.now();

  try {
    // Misma llave que usa el navegador: así se evalúa la misma política RLS.
    const supabase = createClient(url, key);
    const { data, error } = await supabase.rpc('adala_form_healthcheck');

    if (error) {
      return { name: 'contact-form', ok: false, detail: error.message, ms: Date.now() - started };
    }

    const ok = Boolean(data?.ok && data?.rolled_back);

    return {
      name: 'contact-form',
      ok,
      detail: ok ? 'INSERT + RLS válidos, revertido sin persistir' : `respuesta inesperada: ${JSON.stringify(data)}`,
      ms: Date.now() - started,
    };
  } catch (error) {
    return { name: 'contact-form', ok: false, detail: (error as Error).message, ms: Date.now() - started };
  }
};

export const GET: APIRoute = async ({ url }) => {
  const origin = url.origin;
  // Por defecto no barre todo el sitio: /health?deep=1 hace el chequeo completo.
  const deep = url.searchParams.get('deep') === '1';

  const [checks, ms] = await timed(async () => {
    const pageChecks = deep
      ? Promise.all(PAGES.map((route) => checkUrl(origin, route, '<main')))
      : Promise.all([checkUrl(origin, '/es', '<main'), checkUrl(origin, '/es/contacto', '<main')]);

    const assetChecks = deep ? Promise.all(AGENT_ASSETS.map((route) => checkUrl(origin, route))) : Promise.resolve([]);

    const [pages, assets, form] = await Promise.all([pageChecks, assetChecks, checkContactForm()]);

    return [...pages, ...assets, form];
  });

  const failed = checks.filter((check) => !check.ok);
  const formOk = checks.find((check) => check.name === 'contact-form')?.ok ?? false;

  // El formulario es la función de negocio crítica: si falla, el sitio está "down".
  const status = failed.length === 0 ? 'ok' : formOk ? 'degraded' : 'down';

  const body = {
    status,
    mode: deep ? 'deep' : 'shallow',
    checkedAt: new Date().toISOString(),
    durationMs: ms,
    checks,
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: status === 'down' ? 503 : 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      // Amortigua ráfagas: /health hace varias peticiones internas por llamada.
      'cache-control': 'public, max-age=0, s-maxage=60',
      // No queremos que un monitor externo indexe esto.
      'x-robots-tag': 'noindex',
    },
  });
};

export const HEAD: APIRoute = async (context) => {
  const response = await GET(context);
  return new Response(null, { status: response.status, headers: response.headers });
};
