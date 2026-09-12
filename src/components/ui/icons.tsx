// Shared brand marks. Each was pasted inline in 3-10 places before this file;
// colour comes from the caller via `currentColor`, so pass a text-* class
// (or set one on the parent) rather than hardcoding a fill.

const PLUS_PATH =
  "M7.7896 3.3936V0H6.2104V3.3936C6.2104 4.9504 4.9504 6.2104 3.3936 6.2104H0V7.78959H3.3936C4.9504 7.78959 6.2104 9.0496 6.2104 10.6064V14H7.7896V10.6064C7.7896 9.0496 9.0496 7.78959 10.6064 7.78959H14V6.2104H10.6064C9.0496 6.2104 7.7896 4.9504 7.7896 3.3936Z";

const CLOSE_PATH =
  "M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z";

const STAR_PATH =
  "M12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0Z";

export function PlusIcon({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className={className}>
      <path d={PLUS_PATH} fill="currentColor" />
    </svg>
  );
}

export function CloseIcon({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className={className}>
      <path d={CLOSE_PATH} fill="currentColor" />
    </svg>
  );
}

// Sized by the caller's className (w-*/h-*), not a size prop — every use so far
// fills its container or picks a Tailwind size.
export function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d={STAR_PATH} />
    </svg>
  );
}
