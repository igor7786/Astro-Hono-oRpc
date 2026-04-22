import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@rcomp/ui/button';
import { getQueryClient } from '@/lib/tanstack-query/mainQuery';

interface Props {
  postId: string;
}

export default function LikeButton({ postId }: Props) {
  const [, setMounted] = useState(false);

  const client = getQueryClient();
  const [optimisticLikes, setOptimisticLikes] = useState<number | null>(null);
  useEffect(() => setMounted(true), []);

  const { data } = useQuery(
    {
      queryKey: ['likes', postId],
      queryFn: async () => {
        // replace with your oRPC call when you have likes procedure
        return { likes: 42, liked: false };
      },
    },
    client
  );

  const { mutate, isPending } = useMutation(
    {
      mutationFn: async () => {
        // replace with your oRPC call
        return { likes: (data?.likes ?? 0) + 1, liked: true };
      },
      onMutate: () => {
        setOptimisticLikes((data?.likes ?? 0) + 1);
      },
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ['likes', postId] });
        setOptimisticLikes(null);
      },
      onError: () => {
        setOptimisticLikes(null);
      },
    },
    client
  );

  const likes = optimisticLikes ?? data?.likes ?? 0;
  const liked = data?.liked ?? false;

  return (
    <Button
      variant={liked ? 'default' : 'outline'}
      size="sm"
      onClick={() => mutate()}
      disabled={isPending || liked}
      className="flex items-center gap-2"
    >
      <Heart className={`h-4 w-4 ${liked ? 'fill-current text-red-500' : ''}`} />
      <span>{likes}</span>
    </Button>
  );
}
