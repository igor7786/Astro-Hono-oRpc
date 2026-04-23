import { Skeleton } from 'boneyard-js/react';

import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@rcomp/ui/card';

import { Button } from '@/components/reactcomp/ui/button';
import { getQueryClient } from '@/lib/tanstack-query/mainQuery';
import { type TestInput } from '@/server/schemas/test.schema';
import { clientOrpc as orpc } from '@/server/web.client';

type CardInnerProps = {
  initialData: TestInput['name'] | null;
  input: string;
  imageSrc: string;
};

const CardTopImageDemo = ({ initialData, input, imageSrc }: CardInnerProps) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [manualLoading, setManualLoading] = useState<boolean>(false); // ← add this
  const client = getQueryClient();

  useEffect(() => {
    setMounted(true);
  }, []);
  const { data, isLoading, isFetching, error } = useQuery(
    orpc.testSlow.queryOptions({
      input: { name: input },
      queryKey: ['test', { name: input }],
      initialData: initialData ? { name: initialData } : undefined,
      enabled: mounted && !initialData,
    }),
    client
  );

  const handleRefresh = async () => {
    setManualLoading(true); // ← show skeleton immediately
    await client.invalidateQueries({
      queryKey: ['test', { name: input }],
      refetchType: 'all',
    });
    setManualLoading(false); // ← hide skeleton when done
  };

  const loading = !mounted || isLoading || manualLoading;
  return (
    <Skeleton name="Card" loading={loading}>
      <Card className="max-w-md pt-0">
        <CardContent className="px-0">
          <img src={imageSrc} alt="Banner" className="aspect-video h-70 rounded-t-xl object-cover" />
        </CardContent>
        <CardHeader>
          <CardTitle>Ethereal Swirl Gradient</CardTitle>
          <CardDescription>{initialData || data?.name || error?.message}</CardDescription>
        </CardHeader>
        <CardFooter className="gap-3 max-sm:flex-col max-sm:items-stretch">
          <Button>Explore More</Button>
          <Button variant="outline" onClick={handleRefresh} disabled={isFetching}>
            {isFetching ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </CardFooter>
      </Card>
    </Skeleton>
  );
};

export default CardTopImageDemo;
