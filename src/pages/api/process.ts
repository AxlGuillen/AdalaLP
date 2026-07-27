import type { APIRoute } from 'astro';
import { CONTACT, DISCLAIMER, PROCESS_STEPS } from '~/data/adala';
import { json } from '~/utils/api';

export const prerender = false;

export const GET: APIRoute = () =>
  json({
    steps: PROCESS_STEPS,
    howToStart: CONTACT.formUrl,
    consentNotice: CONTACT.consentNotice,
    disclaimer: DISCLAIMER,
  });
