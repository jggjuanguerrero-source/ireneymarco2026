

## Problem

At common laptop resolutions (1366x768 and similar), the Hero text content overflows its `h-[65vh]` container, pushing the countdown into the Venice image zone. The `overflow-hidden` on the parent `section` clips the bottom of the countdown, making labels partially obscured by the overlapping image.

The root cause is:
- The text zone has a fixed `h-[65vh]` but uses `flex-col` without `justify-between` or overflow handling
- Large paddings (`pt-36`/`pt-40`) combined with names, date, location, and countdown don't fit in 65vh on shorter screens
- The image zone (`h-[35vh]`) starts at the bottom and overlaps with the countdown area

## Plan

**Single file change: `src/components/wedding/Hero.tsx`**

1. **Remove the fixed height** from the text container (`h-[65vh]`) and instead use `min-h-[65vh]` or remove it entirely, letting content flow naturally
2. **Add `justify-center`** to the flex column so content stays vertically centered regardless of viewport height
3. **Reduce top padding** slightly at `md` breakpoint (e.g., `md:pt-28` instead of `md:pt-36`) to give more breathing room
4. **Ensure the countdown stays above the image** by giving the countdown wrapper a higher `z-index` relative to the image section

The key fix: change the text zone from `h-[65vh]` to `min-h-[65vh]` with `justify-center`, and slightly reduce `lg:pt-40` → `lg:pt-32` to prevent content from being pushed too low on shorter viewports. This preserves the current look on tall screens while preventing clipping on shorter ones.

