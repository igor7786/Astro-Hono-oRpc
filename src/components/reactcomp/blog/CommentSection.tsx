import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/tanstack-query/mainQuery';
import { Button } from '@rcomp/ui/button';
import { Textarea } from '@rcomp/ui/textarea';
import { Avatar, AvatarFallback } from '@rcomp/ui/avatar';
import { Separator } from '@rcomp/ui/separator';
import { MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
}

interface Props {
  postId: string;
}

export default function CommentSection({ postId }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const client = getQueryClient();
  const [comment, setComment] = useState('');
  const [author, setAuthor] = useState('');

  const { data: comments, isLoading } = useQuery(
    {
      queryKey: ['comments', postId],
      queryFn: async (): Promise<Comment[]> => {
        // replace with your oRPC call
        return [
          {
            id: '1',
            author: 'Alice',
            content: 'Great post! Very helpful.',
            date: '11 April 2026',
          },
          {
            id: '2',
            author: 'Bob',
            content: 'Thanks for sharing this pattern.',
            date: '11 April 2026',
          },
        ];
      },
      enabled: mounted,
    },
    client
  );

  const { mutate, isPending } = useMutation(
    {
      mutationFn: async (newComment: { author: string; content: string }) => {
        // replace with your oRPC call
        return { id: Date.now().toString(), ...newComment, date: 'Just now' };
      },
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ['comments', postId] });
        setComment('');
        setAuthor('');
        toast.success('Comment posted!');
      },
      onError: () => {
        toast.error('Failed to post comment.');
      },
    },
    client
  );

  const handleSubmit = () => {
    if (!comment.trim() || !author.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }
    mutate({ author, content: comment });
  };
  if (!mounted || isPending) return <div>Loading...</div>;
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h3 className="font-heading text-xl font-bold">Comments ({comments?.length ?? 0})</h3>
      </div>

      {/* comment list */}
      {isLoading && <div className="text-muted-foreground text-sm">Loading comments...</div>}

      {comments?.map((c) => (
        <div key={c.id} className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{c.author[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{c.author}</span>
              <span className="text-muted-foreground text-xs">{c.date}</span>
            </div>
          </div>
          <p className="text-sm leading-relaxed">{c.content}</p>
          <Separator />
        </div>
      ))}

      {/* comment form */}
      <div className="border-border flex flex-col gap-4 rounded-lg border p-6">
        <h4 className="font-semibold">Leave a comment</h4>
        <input
          type="text"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="bg-background border-border focus:ring-ring rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
        />
        <Textarea
          placeholder="Write your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
        />
        <Button onClick={handleSubmit} disabled={isPending} className="self-end">
          {isPending ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>
    </div>
  );
}
