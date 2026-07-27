/** Respuesta JSON para los endpoints públicos de agentes. */
export const json = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body, null, 2), {
    status: 200,
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      // Contenido de catálogo: cambia poco, se puede cachear en el CDN.
      'cache-control': 'public, max-age=300, s-maxage=3600',
      // Pensados para ser consumidos por agentes desde cualquier origen.
      'access-control-allow-origin': '*',
      ...(init.headers ?? {}),
    },
  });
