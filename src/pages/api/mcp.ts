import type { APIRoute } from 'astro';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { CONTACT, DISCLAIMER, FAQS, LINES_OF_SERVICE, PROCESS_STEPS, SERVICES } from '~/data/adala';

export const prerender = false;

const VERSION = '1.0.0';

/**
 * Las herramientas no reciben parámetros y devuelven el contenido en ambos
 * idiomas (es/en), como los endpoints REST.
 *
 * Además de simplificar el contrato, evita declarar esquemas con Zod: el SDK
 * usa Zod 4 y la raíz del proyecto resuelve Zod 3 (vía @astrojs/sitemap), y esa
 * mezcla rompe la inferencia de tipos de `registerTool` (ts2589).
 */

const asText = (value: unknown) => ({
  content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }],
});

/**
 * El servidor es de SOLO LECTURA a propósito.
 *
 * No se expone una herramienta que envíe el formulario: recoge datos personales
 * y exige aceptar el Aviso de Privacidad, consentimiento que debe dar la persona
 * titular y no un agente en su nombre.
 */
const buildServer = () => {
  const server = new McpServer({ name: 'adala', version: VERSION });

  server.registerTool(
    'get_services',
    {
      title: 'Servicios de ADALA',
      description:
        'Catálogo de servicios de ADALA: líneas de servicio y trámites migratorios con el identificador que usa el formulario de contacto.',
      annotations: { readOnlyHint: true },
    },
    async () =>
      asText({
        linesOfService: LINES_OF_SERVICE,
        services: SERVICES,
        disclaimer: DISCLAIMER,
      })
  );

  server.registerTool(
    'get_process',
    {
      title: 'Proceso de ADALA',
      description: 'Las tres etapas del proceso de ADALA, del diagnóstico de elegibilidad al trámite y la logística.',
      annotations: { readOnlyHint: true },
    },
    async () =>
      asText({
        steps: PROCESS_STEPS,
        howToStart: CONTACT.formUrl,
        disclaimer: DISCLAIMER,
      })
  );

  server.registerTool(
    'get_faqs',
    {
      title: 'Preguntas frecuentes',
      description: 'Preguntas frecuentes sobre ADALA y sus servicios.',
      annotations: { readOnlyHint: true },
    },
    async () => asText({ faqs: FAQS })
  );

  server.registerTool(
    'get_contact_requirements',
    {
      title: 'Cómo contactar a ADALA',
      description:
        'Explica cómo iniciar un caso con ADALA y qué datos pide el formulario. Incluye las restricciones de consentimiento: un agente no debe enviar el formulario ni aceptar el Aviso de Privacidad por la persona.',
      annotations: { readOnlyHint: true },
    },
    async () =>
      asText({
        formUrl: CONTACT.formUrl,
        privacyPolicyUrl: CONTACT.privacyUrl,
        requiredFields: [
          { field: 'full_name', required: true, format: 'texto, máx. 100 caracteres' },
          { field: 'phone', required: true, format: 'exactamente 10 dígitos' },
          { field: 'email', required: false, format: 'correo válido, máx. 150 caracteres' },
          { field: 'state_mx', required: true, format: 'uno de los 32 estados de México' },
          { field: 'city', required: true, format: 'texto, máx. 80 caracteres' },
          { field: 'service_type', required: true, format: `uno de: ${SERVICES.map((s) => s.id).join(', ')}` },
          { field: 'other_description', required: false, format: 'obligatorio solo si service_type = "other"' },
          { field: 'accepts_privacy', required: true, format: 'debe ser true' },
        ],
        areaServed: CONTACT.areaServed,
        languages: CONTACT.languages,
        consentNotice: CONTACT.consentNotice,
      })
  );

  return server;
};

/**
 * Modo stateless: cada petición crea su propio servidor y transporte, que es lo
 * adecuado en serverless (no hay estado compartido entre invocaciones).
 */
const handle: APIRoute = async ({ request }) => {
  const server = buildServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    // Sin sessionIdGenerator = sin sesiones.
    enableJsonResponse: true,
  });

  await server.connect(transport);

  try {
    return await transport.handleRequest(request);
  } finally {
    await transport.close();
    await server.close();
  }
};

export const POST = handle;
export const GET = handle;
export const DELETE = handle;
