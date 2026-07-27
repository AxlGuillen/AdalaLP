import type { APIRoute } from 'astro';
import { CONTACT, DISCLAIMER, FAQS, LINES_OF_SERVICE, PROCESS_STEPS, SERVICES } from '~/data/adala';

export const prerender = false;

/**
 * Endpoint A2A (JSON-RPC 2.0) — https://a2a-protocol.org
 *
 * ADALA expone un agente informativo DETERMINISTA: no hay un modelo de lenguaje
 * detrás. Clasifica el mensaje por palabras clave y devuelve información real
 * del sitio. La tarjeta en /.well-known/agent-card.json lo declara así para no
 * prometer capacidades conversacionales que no existen.
 *
 * Las interacciones se resuelven en una sola respuesta, así que se devuelve un
 * `Message` directo en vez de crear un `Task` (permitido por la especificación).
 */

type Part = { kind: 'text'; text: string };

interface IncomingMessage {
  role?: string;
  parts?: Array<{ kind?: string; text?: string }>;
  messageId?: string;
  contextId?: string;
}

const JSONRPC_ERRORS = {
  parse: { code: -32700, message: 'Parse error' },
  invalidRequest: { code: -32600, message: 'Invalid Request' },
  methodNotFound: { code: -32601, message: 'Method not found' },
  invalidParams: { code: -32602, message: 'Invalid params' },
  taskNotFound: { code: -32001, message: 'Task not found' },
} as const;

const rpc = (id: unknown, payload: object) =>
  new Response(JSON.stringify({ jsonrpc: '2.0', id: id ?? null, ...payload }, null, 2), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
    },
  });

const error = (id: unknown, err: { code: number; message: string }, data?: string) =>
  rpc(id, { error: data ? { ...err, data } : err });

const agentMessage = (text: string, contextId?: string) => ({
  kind: 'message' as const,
  role: 'agent' as const,
  messageId: crypto.randomUUID(),
  ...(contextId ? { contextId } : {}),
  parts: [{ kind: 'text', text }] as Part[],
});

/** Une las partes de texto del mensaje entrante. */
const readText = (message: IncomingMessage): string =>
  (message.parts ?? [])
    .filter((part) => part.kind === 'text' && typeof part.text === 'string')
    .map((part) => part.text as string)
    .join(' ')
    .trim();

const SKILL_KEYWORDS: Record<string, RegExp> = {
  'adala-services':
    /servicio|tr[áa]mite|visa|certificac|naturaliza|nacionalidad|perd[óo]n|matrimonio|service|visa|certif/i,
  'adala-process': /proceso|paso|etapa|c[óo]mo funciona|tiempo|process|step|how does/i,
  'adala-contact': /contact|iniciar|empezar|cita|formulario|tel[ée]fono|correo|start|reach/i,
  'adala-faqs': /pregunta|duda|garant[íi]a|faq|question|guarantee/i,
};

const renderServices = () =>
  [
    'ADALA opera tres líneas de servicio:',
    ...LINES_OF_SERVICE.map((line) => `- ${line.es.title}: ${line.es.description}`),
    '',
    'Trámites migratorios atendidos (identificador entre paréntesis):',
    ...SERVICES.filter((service) => service.id !== 'other').map((service) => `- ${service.es} (${service.id})`),
    '',
    DISCLAIMER.es,
  ].join('\n');

const renderProcess = () =>
  [
    'El proceso de ADALA tiene tres etapas:',
    ...PROCESS_STEPS.map((step) => `${step.step}. ${step.es.title}: ${step.es.description}`),
    '',
    `Para iniciar: ${CONTACT.formUrl.es}`,
    DISCLAIMER.es,
  ].join('\n');

const renderFaqs = () =>
  ['Preguntas frecuentes sobre ADALA:', ...FAQS.map((faq) => `P: ${faq.es.q}\nR: ${faq.es.a}`)].join('\n\n');

const renderContact = () =>
  [
    `Para iniciar un caso con ADALA hay que enviar el formulario de solicitud: ${CONTACT.formUrl.es}`,
    '',
    'Datos obligatorios: nombre completo, teléfono de 10 dígitos, estado, ciudad, trámite de interés y aceptación del Aviso de Privacidad. El correo es opcional.',
    '',
    CONTACT.consentNotice,
    `Aviso de Privacidad: ${CONTACT.privacyUrl.es}`,
  ].join('\n');

const renderFallback = () =>
  [
    'Soy el agente informativo de ADALA (agencia de migración, certificación laboral y turismo corporativo entre México, EE.UU. y Canadá).',
    '',
    'Puedo responder sobre:',
    '- Servicios y trámites disponibles',
    '- El proceso paso a paso',
    '- Preguntas frecuentes',
    '- Cómo iniciar un caso',
    '',
    'No tramito solicitudes ni envío formularios: eso lo hace la persona interesada en ' + CONTACT.formUrl.es,
  ].join('\n');

const respondTo = (text: string): string => {
  if (!text) return renderFallback();

  const matched = Object.entries(SKILL_KEYWORDS).find(([, pattern]) => pattern.test(text));

  switch (matched?.[0]) {
    case 'adala-services':
      return renderServices();
    case 'adala-process':
      return renderProcess();
    case 'adala-faqs':
      return renderFaqs();
    case 'adala-contact':
      return renderContact();
    default:
      return renderFallback();
  }
};

export const POST: APIRoute = async ({ request }) => {
  let payload: { jsonrpc?: string; id?: unknown; method?: string; params?: { message?: IncomingMessage } };

  try {
    payload = await request.json();
  } catch {
    return error(null, JSONRPC_ERRORS.parse);
  }

  const { id = null, method, params } = payload ?? {};

  if (payload?.jsonrpc !== '2.0' || typeof method !== 'string') {
    return error(id, JSONRPC_ERRORS.invalidRequest);
  }

  switch (method) {
    case 'message/send': {
      const message = params?.message;

      if (!message || !Array.isArray(message.parts)) {
        return error(id, JSONRPC_ERRORS.invalidParams, 'Se requiere params.message.parts');
      }

      return rpc(id, { result: agentMessage(respondTo(readText(message)), message.contextId) });
    }

    // No se crean tareas: toda interacción se resuelve en una sola respuesta.
    case 'tasks/get':
    case 'tasks/cancel':
      return error(id, JSONRPC_ERRORS.taskNotFound, 'Este agente responde de forma síncrona y no crea tareas.');

    default:
      return error(id, JSONRPC_ERRORS.methodNotFound, `Método no soportado: ${method}`);
  }
};

export const OPTIONS: APIRoute = () =>
  new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
    },
  });
