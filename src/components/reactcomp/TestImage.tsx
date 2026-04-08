// src/components/TestImage.tsx
type Props = {
  children?: React.ReactNode; // ✅ Astro passes slot content as children
};

export function TestImage({ children }: Props) {
  return (
    <div className="mx-auto text-center text-2xl">
      <h1>React Component</h1>
      {children} {/* ✅ renders the <Image /> output here */}
    </div>
  );
}
