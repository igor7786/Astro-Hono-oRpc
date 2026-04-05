import { atom } from 'nanostores';

export const $testData = atom<{ name: string } | undefined>(undefined);
