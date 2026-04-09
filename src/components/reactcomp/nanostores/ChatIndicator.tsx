// src/components/reactcomp/ChatIndicator.tsx
import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $isOnline } from '@/lib/stores/online';
import { toast } from 'sonner';

export default function ChatIndicator() {
  const [mounted, setMounted] = useState(false);
  const isOnline = useStore($isOnline);

  // ✅ avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isOnline) {
      toast.error('🔌 You are offline', {
        id: 'online-status',
        duration: Infinity,
        className: 'bg-red-50 border border-red-200 text-red-900',
        description: 'Some features may be unavailable',
      });
    } else {
      toast.success('✨ Connected', {
        id: 'online-status',
        duration: 2000,
        className: 'bg-green-50 border border-green-200 text-green-900',
      });
    }
  }, [isOnline, mounted]);

  // ✅ server and first client render always match
  if (!mounted) {
    return (
      <div className="inline-flex items-center gap-2.5 rounded-full border border-gray-200/50 bg-gray-700 px-3 py-1.5 backdrop-blur-sm">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
        </span>
        <span className="text-sm font-medium text-green-400">Connecting…</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2.5 rounded-full border px-3 py-1.5 transition-all duration-300 ease-out ${
        isOnline
          ? 'border-green-200/50 bg-green-50/80 backdrop-blur-sm hover:border-green-300'
          : 'border-red-200/50 bg-red-50/80 backdrop-blur-sm hover:border-red-300'
      } `}
      role="status"
      aria-live="polite"
      aria-label={isOnline ? 'Online' : 'Disconnected'}
    >
      {/* Animated status dot */}
      <span className="relative flex h-2.5 w-2.5">
        {/* Pulse animation when offline */}
        {!isOnline && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
        )}
        {/* Main dot with glow */}
        <span
          className={`relative inline-flex h-2.5 w-2.5 rounded-full transition-colors duration-300 ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'} `}
        />
      </span>

      {/* Status text */}
      <span
        className={`text-sm font-medium transition-colors duration-300 ${isOnline ? 'text-green-800' : 'text-red-800'} `}
      >
        {isOnline ? 'Online' : 'Disconnected'}
      </span>

      {/* Optional: subtle tooltip hint on hover */}
      <span
        className={`hidden text-xs text-gray-500 transition-opacity duration-200 group-hover:inline`}
      >
        {isOnline ? '✓ Ready' : '✗ Reconnecting…'}
      </span>
    </div>
  );
}
