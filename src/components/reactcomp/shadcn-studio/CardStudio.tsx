import { Button } from '@/components/reactcomp/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
} from '@/components/reactcomp/ui/card';
import { Skeleton } from 'boneyard-js/react';
import { useEffect, useState } from 'react';

const CardTopImageDemo = () => {
  const [mainLoading, setMainLoading] = useState<boolean>(true);
  useEffect(() => {
    const timer = setTimeout(() => setMainLoading(false), 3000);
    return () => clearTimeout(timer); // cleanup
  }, []);
  return (
    <Skeleton name="Card" loading={mainLoading}>
      <div className="flex min-h-screen items-center justify-center" slot="main">
        <Card className="max-w-md pt-0">
          <CardContent className="px-0">
            <img
              src="https://cdn.shadcnstudio.com/ss-assets/components/card/image-2.png?height=280&format=auto"
              alt="Banner"
              className="aspect-video h-70 rounded-t-xl object-cover"
            />
          </CardContent>
          <CardHeader>
            <CardTitle>Ethereal Swirl Gradient</CardTitle>
            <CardDescription>
              Smooth, flowing gradients blending rich reds and blues in an abstract swirl.
            </CardDescription>
          </CardHeader>
          <CardFooter className="gap-3 max-sm:flex-col max-sm:items-stretch">
            <Button>Explore More</Button>
            <Button variant={'outline'}>Download Now</Button>
          </CardFooter>
        </Card>
      </div>
    </Skeleton>
  );
};

export default CardTopImageDemo;
