// The vertical rule running down the left edge of every section, aligned to the
// same gutter as the page padding. Was duplicated in 11 files.
//
// Position and colour both ride on `className` so that `absolute` and `fixed`
// can never both land on the element (Tailwind would resolve that by source
// order, not intent). Hero keeps its own copy: it animates opacity via a ref and
// starts below the logo rather than at the top.
export default function GridLine({ className = "absolute bg-black" }: { className?: string }) {
  return (
    <div
      className={`hidden md:block top-0 bottom-0 w-[1.5px] z-20 pointer-events-none ${className}`}
      style={{ left: "max(1.5rem, min(5vw, 4rem))" }}
    />
  );
}
