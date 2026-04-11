// src/components/reactcomp/ChatIndicator.tsx
import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $isOnline } from '@/lib/stores/online';
import { toast } from 'sonner';

export default function ChatIndicator() {
  const [mounted, setMounted] = useState(false);
  const isOnline = useStore($isOnline);

  // avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // toast only after mount + on state change
  useEffect(() => {
    if (!mounted) return;

    if (!isOnline) {
      toast.error('🔌 You are offline', {
        id: 'online-status',
        duration: Infinity,
        description: 'Some features may be unavailable',
        className: 'bg-red-50 border border-red-200 text-red-900 shadow-lg',
      });
    } else {
      toast.success('✨ Connected', {
        id: 'online-status',
        duration: 2000,
        className: 'bg-green-50 border border-green-200 text-green-900 shadow-lg',
      });
    }
  }, [isOnline, mounted]);

  // SSR-safe placeholder (no flicker)
  if (!mounted) {
    return (
      <div className="inline-flex items-center gap-3 rounded-full border border-gray-200/60 bg-white/70 px-3 py-1.5 shadow-sm backdrop-blur-md">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
        </span>

        <span className="text-sm font-medium text-gray-600">Connecting…</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={isOnline ? 'Online' : 'Disconnected'}
      className={`group inline-flex items-center gap-3 rounded-full border px-3 py-1.5 shadow-sm backdrop-blur-md transition-all duration-300 ease-out ${
        isOnline
          ? 'border-green-200/60 bg-green-50/80 hover:border-green-300'
          : 'border-red-200/60 bg-red-50/80 hover:border-red-300'
      }`}
    >
      {/* STATUS DOT */}
      <span className="relative flex h-2.5 w-2.5">
        {/* pulse only when offline */}
        {!isOnline && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
        )}

        {/* main dot */}
        <span
          className={`relative inline-flex h-2.5 w-2.5 rounded-full transition-all duration-300 ${
            isOnline
              ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.45)]'
              : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.45)]'
          }`}
        />
      </span>

      {/* STATUS TEXT */}
      <span
        className={`text-sm font-semibold transition-colors duration-300 ${
          isOnline ? 'text-green-800' : 'text-red-800'
        }`}
      >
        {isOnline ? 'Online' : 'Disconnected'}
      </span>

      {/* HOVER HINT (FIXED: group + opacity animation) */}
      <span className="text-xs text-gray-500 opacity-0 transition-all duration-200 group-hover:opacity-100">
        {isOnline ? '✓ Ready' : '✗ Reconnecting…'}
      </span>
    </div>
  );
}
