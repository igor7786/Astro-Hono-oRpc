// src/env.d.ts
/// <reference types="astro/client" />
/// <reference types="unplugin-icons/types/react" />

declare module '*.bones.json' {
  const value: any;
  export default value;
}
declare namespace App {
  interface Locals {
    cspNonce?: string;
  }
}
