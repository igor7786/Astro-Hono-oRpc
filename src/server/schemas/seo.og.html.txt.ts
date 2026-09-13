import { decode } from 'he';
import { z } from 'zod';

// decodes HTML entities, e.g. &amp; → &

// --------------------------------------------------------------------
// STEP 1: Define the regex used to validate the "id" field.
// This checks that the string only contains lowercase hex characters
// (0-9, a-f) — e.g. an MD5 hash like "411f78ba1ae6ee4cfd216f39f8d62a2f".
// --------------------------------------------------------------------
const hex = /^[0-9a-f]+$/;

// --------------------------------------------------------------------
// STEP 2: A small helper function that decodes a single field's value.
//
// - If the value is a string, run it through two decode passes:
//     1. `decode()` from the "he" library — undoes HTML entity encoding
//        (e.g. "&amp;" → "&")
//     2. `decodeURIComponent()` — undoes percent-encoding
//        (e.g. "%3A" → ":")
// - If the value is NOT a string (e.g. undefined, a number), leave it
//   untouched and return it as-is. This avoids crashing on fields that
//   aren't strings.
// --------------------------------------------------------------------
function decodeField(value: unknown): unknown {
  return typeof value === 'string' ? decodeURIComponent(decode(value)) : value;
}

// --------------------------------------------------------------------
// STEP 3: Build the schema using `z.preprocess()`.
//
// `z.preprocess(transformFn, schema)` runs `transformFn` on the RAW
// input FIRST, before `schema` does any validation. This is different
// from `.transform()`, which runs AFTER validation succeeds.
//
// We need "before" here, because the raw id/format values might still
// contain encoded characters (&amp;, %XX) — and the validation rules
// below (.length(32), .regex(hex)) need to run against the CLEAN,
// decoded value, not the raw encoded one.
// --------------------------------------------------------------------
export const ogIdTokenSchema = z.preprocess(
  // ------------------------------------------------------------------
  // STEP 3a: This is the preprocessing function. It receives whatever
  // raw value was passed in (ideally an object like { id, format }),
  // and must return a new value for the schema below to validate.
  // ------------------------------------------------------------------
  (raw) => {
    // Guard: if what we received isn't a plain object (e.g. it's null,
    // a string, or undefined), just return it unchanged. Let the
    // schema below fail validation naturally rather than crashing here.
    if (typeof raw !== 'object' || raw === null) return raw;

    // Cast to a generic string-keyed object so TypeScript lets us
    // access arbitrary properties like `obj.id` and `obj.format`.
    const obj = raw as Record<string, unknown>;

    // Return a NEW object (spread the original first, so any other
    // fields survive untouched), overwriting `id` and `format` with
    // their decoded versions.
    return {
      ...obj,
      id: decodeField(obj.id),
      format: decodeField(obj.format),
    };
  },

  // ------------------------------------------------------------------
  // STEP 3b: This is the actual validation schema — identical to what
  // you already had. It runs AFTER the preprocessing step above, so by
  // the time these checks run, `id` and `format` are already decoded.
  // ------------------------------------------------------------------
  z
    .object({
      id: z.string().trim().length(32).regex(hex), // must be exactly 32 hex chars
      format: z.enum(['webp', 'png']).optional(), // optional, one of two values
    })
    .strip() // strips any extra/unknown fields from the final result
);

export type OgIdToken = z.infer<typeof ogIdTokenSchema>;
export const outputOgSchema = z.object({
  body: z.file(),
  headers: z.object({
    'Content-Type': z.string(),
    'Cache-Control': z.string(),
    'Content-Disposition': z.string(),
    'X-Cache': z.string(),
    'X-Cache-Tier': z.string(),
  }),
});

export type OutputOgSchema = z.infer<typeof outputOgSchema>;

export const llmsHtmlOutputSchema = z.object({
  body: z.instanceof(Blob),
  headers: z.object({
    'Content-Type': z.string(),
    'Cache-Control': z.string(),
    'Content-Disposition': z.string(),
  }),
});

export type LlmsHtmlSchema = z.infer<typeof llmsHtmlOutputSchema>;

export const llmsTxtOutputSchema = z.object({
  body: z.file(),
  headers: z.object({
    'Content-Type': z.string(),
    'Cache-Control': z.string(),
    'Content-Disposition': z.string(),
  }),
});

export type LlmsTxtSchema = z.infer<typeof llmsTxtOutputSchema>;
