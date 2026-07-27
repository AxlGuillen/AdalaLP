import type { APIRoute } from 'astro';
import { FAQS } from '~/data/adala';
import { json } from '~/utils/api';

export const prerender = false;

export const GET: APIRoute = () => json({ faqs: FAQS });
