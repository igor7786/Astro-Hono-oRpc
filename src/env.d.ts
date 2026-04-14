// src/env.d.ts
/// <reference types="astro/client" />

declare module '*.bones.json' {
  const value: any;
  export default value;
}
