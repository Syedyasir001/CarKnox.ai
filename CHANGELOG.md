# Changelog

## 11 June 2026

### Project Rebuild & Server Management
- Killed existing process on port 3000
- Cleaned `.next` build cache
- Ran `npm run build` — zero errors, all 11 pages generated
- Restarted dev server at `http://localhost:3000`

### Navbar: Restored Missing Navigation Buttons

**File:** `components/Navbar.tsx`

**Issue:** The top-right navigation buttons (Dealerships, Owner Portal) were absent from the homepage navbar, leaving only the logo.

**Changes:**
- Added two pill-style anchor links in a flex container on the right side of the navbar
- **Dealerships** (`href="/dealerships"`) — links to the public dealership directory
- **Owner Portal** (`href="/dealerships/dashboard"`) — links to the dealership owner dashboard

**Styling:**
- Dark pill background: `bg-[#1a1a2e]`
- White text: `text-white text-sm font-medium`
- Rounded full shape: `rounded-full`
- Hover transition: `hover:bg-[#252545]`

**No other page content was modified.**

---

### Top Dealerships Banner: Infinite Auto-Scroll Marquee

**File:** `components/TopDealershipsBanner.tsx`  
**Related:** `app/globals.css` (keyframes removed)

**Issue:** The premium partner cards in the dealerships page rendered statically — no scrolling animation occurred despite the animation CSS being present.

**Root Cause Analysis:**
The banner was designed to scroll using CSS `@keyframes dealership-scroll` with `translateX(-50%)`, but three approaches failed sequentially:

| Attempt | Approach | Failure Reason |
|---------|----------|----------------|
| 1 | `<style>` tag in JSX with `@keyframes` | Next.js App Router strips inline `<style>` JSX elements |
| 2 | `useEffect` injects `<style>` into `<head>` | Dynamic injection worked but didn't resolve the issue |
| 3 | CSS `@keyframes` in `globals.css` | Keyframes likely purged/altered by Tailwind build process |
| 4 | Standalone `animate()` from framer-motion | TypeScript ESLint errors (`no-unused-expressions`, missing deps) |
| 5 | `motion.div` with variants | Type error: `repeatType` inferred as `string`, incompatible with framer-motion's `RepeatType` union |

**Final Solution:** `motion.div` + `useAnimationControls` (framer-motion)

Replaced all CSS-based animation with framer-motion's JS animation engine:

```tsx
const scrollTransition = {
  duration: 28,
  ease: 'linear' as const,
  repeat: Infinity,
  repeatType: 'loop' as const,
};

const controls = useAnimationControls();

useEffect(() => {
  controls.start({ x: '-50%', transition: scrollTransition });
}, [controls]);
```

**Behavior:**
- **Continuous left scroll:** `repeat: Infinity` with `repeatType: 'loop'` scrolls the full set width every 28 seconds
- **Pause on hover:** `controls.stop()` freezes the track at its current position
- **Resume on hover leave:** `controls.start(...)` restarts from the current frozen position to `-50%`, then loops naturally
- **Seamless loop:** The dealer array is doubled (`[...dealers, ...dealers]`), so when the animation resets from `-50%` to `0%`, the second copy's first card occupies the same visual position as the first copy's first card — the snap is invisible
- **Track width:** `width: max-content` ensures the flex container sizes to fit all 16 cards (8 original × 2)

**Lint Errors Fixed During Implementation:**
1. `@typescript-eslint/no-unused-expressions` — Ternary expression as standalone statement replaced with `if/else` block in the pause `useEffect`
2. `@typescript-eslint/no-unused-vars` — `isPaused` state variable removed after switching to imperative `controls.stop()`/`controls.start()` pattern
3. `react-hooks/exhaustive-deps` — Added `controls` to `useEffect` dependency array
4. `repeatType` type error — Used `as const` assertion on `'linear'` and `'loop'` literal types to satisfy framer-motion's `RepeatType` union type

**Cleanup:**
- Removed `@keyframes dealership-scroll` from `app/globals.css` (no longer needed)
- Removed all CSS animation properties from the track div
- Removed `useEffect`-based keyframe injection
- No conflicting Tailwind animation classes on the element
- Reduced bundle size on dealerships page from 7.01 kB (with `animate()` standalone import) to 4.42 kB

---

### Build Verification

Each change was verified with `npm run build`:
- `next build` compiled successfully with zero errors
- All 11 routes generated: 5 static, 6 dynamic (API routes)
- Only pre-existing warning: `@next/next/no-img-element` in `ResultsPanel.tsx` (unrelated)
