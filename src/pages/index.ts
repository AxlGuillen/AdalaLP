import type { APIRoute } from 'astro';

export const prerender = false;

/**
 * Raíz del sitio: redirige a /es y negocia Markdown.
 *
 * Antes era una página estática con meta-refresh. Se pasó a on-demand porque
 * los archivos estáticos no pueden leer el header `Accept`, y es la única forma
 * de servir Markdown a quien lo pida (los estáticos los resuelve Vercel en
 * `handle: filesystem`, antes de que corra código nuestro).
 *
 * Es una ruta trivial —redirige o devuelve un archivo ya generado—, así que el
 * coste de que sea una función es mínimo. Las páginas de contenido siguen
 * prerenderizadas.
 */

const HOME_MARKDOWN = '/es/index.md';

/**
 * Sólo si el cliente prefiere Markdown de forma explícita: se exige que
 * `text/markdown` aparezca antes que `text/html`, porque los navegadores mandan
 * `text/html,...` seguido de `*\/*` y no deben recibir Markdown.
 */
const prefersMarkdown = (accept: string | null): boolean => {
  if (!accept) return false;

  const normalized = accept.toLowerCase();
  const markdown = normalized.indexOf('text/markdown');
  if (markdown === -1) return false;

  const html = normalized.indexOf('text/html');
  return html === -1 || markdown < html;
};

export const GET: APIRoute = async ({ request, url }) => {
  if (prefersMarkdown(request.headers.get('accept'))) {
    try {
      const response = await fetch(new URL(HOME_MARKDOWN, url.origin), {
        headers: { 'user-agent': 'adala-markdown-negotiation' },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const markdown = await response.text();

        return new Response(markdown, {
          status: 200,
          headers: {
            'content-type': 'text/markdown; charset=utf-8',
            // Estimación habitual (~4 caracteres por token); es informativa.
            'x-markdown-tokens': String(Math.ceil(markdown.length / 4)),
            'content-location': HOME_MARKDOWN,
            link: '</es>; rel="canonical"; type="text/html"',
            vary: 'Accept',
            'cache-control': 'public, max-age=0, s-maxage=3600',
          },
        });
      }
    } catch {
      // Si el Markdown no está disponible, se cae al redirect normal.
    }
  }

  return new Response(null, {
    status: 307,
    headers: {
      location: '/es',
      vary: 'Accept',
      'cache-control': 'public, max-age=0, s-maxage=3600',
    },
  });
};

export const HEAD: APIRoute = async (context) => {
  const response = await GET(context);
  return new Response(null, { status: response.status, headers: response.headers });
};
