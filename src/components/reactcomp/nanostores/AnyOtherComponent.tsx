// AnyOtherComponent.tsx
import { useStore } from '@nanostores/react';
import { $testData } from '@/lib/stores/ssr';
import { Button } from '@rcomp/ui/button';

export const AnyOtherComponent = () => {
  const data = useStore($testData); // ← auto-updates when store changes
  const onClick = () => {
    // ✅ update store on button click
    $testData.set({ name: 'Updated Name From other component' });
  };
  return <Button onClick={onClick}>HI from AnyOtherComponent: {data?.name}</Button>;
};
