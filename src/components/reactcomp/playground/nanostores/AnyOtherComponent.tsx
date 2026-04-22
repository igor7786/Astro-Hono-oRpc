import { useStore } from '@nanostores/react';
import { Button } from '@rcomp/ui/button';
import { $testData } from '@/lib/stores/ssr';

export const AnyOtherComponent = () => {
  const data = useStore($testData);

  return (
    <div className="flex flex-col gap-2 p-4">
      <p className="font-bold">Other Component: {data?.name}</p>
      <Button onClick={() => $testData.set({ name: 'Updated from other component' })}>
        Update Store
      </Button>
    </div>
  );
};
