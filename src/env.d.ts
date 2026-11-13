// src/env.d.ts
/// <reference types="astro/client" />
/// <reference types="unplugin-icons/types/react" />

declare module '*.bones.json' {
  const value: any;
  export default value;
}

/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    cspNonce?: string;
  }
}
