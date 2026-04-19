import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rcomp/ui/dropdown-menu';
import { Share2, Link, Check, createLucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { envClient } from '@/lib/env/client.env';
const XIcon = createLucideIcon('X', [
  [
    'path',
    {
      d: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
      stroke: 'none',
      fill: 'currentColor',
    },
  ],
]);

interface Props {
  url: string;
  title?: string;
}

export default function ShareWidget({ url, title = '' }: Props) {
  const [, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const [copied, setCopied] = useState(false);
  const fullUrl = `${envClient.PUBLIC_URL}/blog/${url}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`${title} ${fullUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  return (
    <DropdownMenu>
      {/* ✅ no Button wrapper — trigger renders its own button */}
      <DropdownMenuTrigger className="group/button border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
        <Share2 className="h-4 w-4" />
        <span>Share</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={shareToTwitter} className="flex cursor-pointer items-center gap-2">
          <XIcon className="h-4 w-4" />
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyToClipboard} className="flex cursor-pointer items-center gap-2">
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Link className="h-4 w-4" />}
          {copied ? 'Copied!' : 'Copy link'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
