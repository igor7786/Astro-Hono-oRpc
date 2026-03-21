// src/pages/api/[...path].ts
import type { APIRoute } from 'astro';
import app from '@server/app';

export const ALL: APIRoute = ({ request }) => app.fetch(request);
