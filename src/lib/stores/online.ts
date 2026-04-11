// src/lib/stores/online.ts
import { atom } from 'nanostores';

export const $isOnline = atom<boolean>(true); // ← assume online initially

// only run in browser
if (typeof window !== 'undefined') {
  // set initial value
  $isOnline.set(navigator.onLine);

  // listen for changes
  window.addEventListener('online', () => $isOnline.set(true));
  window.addEventListener('offline', () => $isOnline.set(false));
}
