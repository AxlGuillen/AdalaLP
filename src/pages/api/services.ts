import type { APIRoute } from 'astro';
import { DISCLAIMER, LINES_OF_SERVICE, SERVICES } from '~/data/adala';
import { json } from '~/utils/api';

export const prerender = false;

export const GET: APIRoute = () =>
  json({
    linesOfService: LINES_OF_SERVICE,
    services: SERVICES,
    disclaimer: DISCLAIMER,
  });
