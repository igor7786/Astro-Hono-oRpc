import { type ReactNode, useEffect, useRef, useState } from 'react';

type Props = {
  children: ReactNode;
  /** Rendered on the server and until the element is near the viewport */
  fallback?: ReactNode;
  /** Start before it is actually visible, like Astro's client:visible rootMargin */
  rootMargin?: string;
  className?: string;
};

export function WhenVisible({ children, fallback = null, rootMargin = '200px', className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || visible) return;

    // Very old browsers: just show it
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // render once, like a hydrated island
        }
      },
      { rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, visible]);

  return (
    <div ref={ref} className={className}>
      {visible ? children : fallback}
    </div>
  );
}
