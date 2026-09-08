# UI/UX Product Standards — Read This Before Touching Any Screen

> **To the AI assistant working in this repo:** this file is not a style suggestion, it's the bar. Before writing or editing any component, screen, or CSS, read the relevant section below. If a change you're about to make conflicts with something here, follow this file, not the path of least resistance. When in doubt, ask "would a senior product designer sign off on this?" — if the honest answer is no, don't ship it.

This project's biggest risk right now isn't bugs — it's **"vibe-coded" UI**: interfaces that technically work but feel default, templated, and interchangeable with every other AI-generated product on the internet. Every instruction below exists to close that gap between "it works" and "it feels like a real product."

---

## 1. The standard we're building to

- Nothing should look like it was accepted on the first suggestion. Every screen gets at least one deliberate design decision that ties back to *this specific product* — not a decision that would apply equally well to any generic app.
- Consistency beats novelty. A reusable component used correctly everywhere beats five one-off components that are each "pretty good."
- Every interactive element earns its place through feedback: hover, focus, pressed, loading, disabled, and error states are not optional extras — they're part of the component, not an afterthought bolted on later.
- Performance is part of design. A beautiful screen that jitters, reflows, or blocks on load fails the design brief just as much as an ugly one.
- Full reference for the underlying design philosophy: [Anthropic's frontend-design skill](https://www.ui-skills.com/skills/anthropics/frontend-design). Read this when starting any new screen or major redesign — it explains *why*, this file mostly covers *what* and *how*.

---

## 2. Ground every screen in what it actually is

Before styling anything, answer: who uses this screen, under what pressure, and what's the one thing they came here to do? A dense data table scanned under time pressure needs different visual priorities than a form filled out once a quarter. Design decisions — density, color use, motion, copy tone — should trace back to that answer, not to "what apps in this category usually look like."

- Identify whether a screen is primarily **data-dense** (tables, dashboards, analytics), **task-focused** (forms, settings, checkout), or **content-first** (marketing pages, articles, media). Each calls for a different balance of density, whitespace, and visual noise.
- Don't import one surface's visual language into another wholesale. A heavy, decorative treatment that works on a marketing landing page will look out of place bolted onto a data table, and vice versa.
- If you're unsure what a screen's job is, ask before styling it — a guess baked into code is expensive to unwind later.

---

## 3. Design tokens — define once, reuse everywhere

Before adding a new color, spacing value, radius, or shadow anywhere, check if a token already exists for it. If it doesn't, add it to the shared token source (CSS variables, a theme file, a design-system config — whichever this codebase already uses) instead of hardcoding a one-off value in a component file.

- **Color:** define a small, named palette (base background, surface, border, primary accent, 1–2 semantic colors for success/warning/danger) — not raw hex codes scattered through components. Every color used more than once must be a variable.
- **Type scale:** a fixed set of sizes (e.g. 12/14/16/20/24/32/40px) with defined line-heights and weights per level — not ad hoc `font-size: 15px` sprinkled in component CSS.
- **Spacing:** an 8px (or 4px) base unit system. If a margin doesn't divide evenly into the base unit, that's a sign it was eyeballed, not designed.
- **Radius:** pick 2–3 radius values max (e.g. 6px for inputs/buttons, 12px for cards, full-round for pills/avatars) and use them consistently — mismatched radii on nested elements (a 12px card holding an 8px button) read as sloppy.
- **Shadow / elevation:** define 2–4 elevation levels (resting, hover, dropdown/modal) rather than reusing the same generic `0 2px 4px rgba(0,0,0,.1)` everywhere regardless of context. On dark backgrounds, lean on subtle border/glow contrast rather than drop shadows, which read poorly there.

---

## 4. Typography

- Pick **one primary typeface family**, and a second only if it's clearly distinct in purpose (e.g. a geometric sans for UI chrome + a monospace for tabular/numeric data). Do not default to the system font stack "because it's fine" — type carries more of a product's personality than almost anything else.
- Good, easy-to-license options worth evaluating: **Inter** or **Geist** (UI text, excellent at small sizes), **Manrope** or **Sora** (slightly more character for headings), and a proper tabular-numeral font (both Inter and Geist support `font-variant-numeric: tabular-nums`) for any numbers in tables or stat cards — this alone noticeably upgrades a data-heavy screen.
- Avoid the AI-generated tells: don't put a single word of every heading in italic/bold/a different color out of habit, don't put every label in ALL CAPS by default, and don't add a small eyebrow label above every section just because it "looks designed." Use these devices only when they encode real structure (e.g. a numbered step actually is a step in a sequence).
- Keep body/paragraph line length under ~80 characters for readability.

---

## 5. Icons

- Standardize on **one icon set** across the whole product. Mixing icon libraries or dropping in random inline SVGs alongside them is one of the fastest ways to look unfinished. Recommended: **Lucide** (consistent stroke weight, huge coverage, tree-shakeable, has both React components and static SVGs) or **Tabler Icons** as an alternative.
- Reserve **animated icons** for moments that mean something — a successful save, a sync-in-progress state, an empty state that benefits from a little life — not for decoration on static nav items. Good options: **Lottie** (`lottie-react` or the framework-agnostic Lottie web player) for pre-built micro-animations, or hand-rolled SVG stroke-draw animations via CSS for simple cases (a checkmark drawing itself on success is worth the effort; a wiggling sidebar icon usually isn't).
- Icon size and stroke weight must be consistent with the type scale next to it — an icon that's visibly heavier or lighter than the text it sits beside looks like a mismatched import.

---

## 6. Component architecture

- Before building a new component, check if an existing one can be made prop-driven instead of duplicated. If you find two components doing near-identical things with small variations, refactor into one reusable component before adding a third.
- Every component that renders data needs to explicitly handle: **loading, empty, error, and populated** states. A component that only renders the happy path isn't done.
- Form components (inputs, selects, filters) should share one visual and behavioral contract across the product — the same focus ring, the same error message placement and tone, the same disabled treatment — regardless of which page they appear on.
- Buttons: define primary / secondary / destructive / ghost variants once and reuse them. A destructive action (delete, remove) should always look visually distinct from a primary action, not just have different text.

---

## 7. Motion — deliberate, not decorative

- Motion should always answer a question the user just asked by acting: "did my click register," "what changed," "where did this element come from." Motion that plays automatically on page load or scroll on every section (fade-up-on-scroll on every card) is one of the most common AI-generated tells — avoid it as a default.
- Where motion earns its place: a panel expanding/collapsing, a row highlighting briefly after a bulk action, a modal entering/exiting with a short scale+fade rather than a hard cut, a button showing a brief press-scale (`transform: scale(0.97)`) on click.
- Keep durations short — 120–250ms for most UI transitions, easing with a standard ease-out curve. Longer feels laggy, not luxurious.
- Respect `prefers-reduced-motion` — wrap non-essential animation in a media query check so users who've opted out don't get it.
- Library recommendations: **Framer Motion** (`motion` package) for React projects — it gives you layout animations, gestures, and exit transitions without fighting the DOM. For non-React or lightweight pages, plain CSS transitions plus the Web Animations API is usually enough — don't pull in a heavy animation library for a handful of transitions.

---

## 8. Loading states & skeletons

- Never show a blank screen or a lone spinner for content that has a known shape (a table, a card grid, a chart). Build a **skeleton** that mirrors the actual layout — matching column widths, avatar circles, line counts — so the transition from loading to loaded doesn't cause a layout jump.
- Skeletons should use a subtle shimmer/pulse animation, not a static gray block — it communicates "still working" rather than "stuck."
- Reserve full-page spinners for true blocking operations (initial auth check, full page navigation) — never for a single card or table refreshing in place; that should have a localized, small loading indicator instead so the rest of the screen stays usable.
- Reserve space with fixed aspect ratios / dimensions for anything that loads asynchronously (images, charts, embeds) so nothing shifts once it resolves.

---

## 9. Empty states & errors

- An empty state is not "no data" text and nothing else — it's a chance to tell the user what to do next (e.g. no results matching filters → show the active filters and a clear way to reset them, not just "No results").
- Error messages speak in the product's voice, state exactly what happened, and give the next step. Never a raw error code or stack trace surfaced to the end user in a production screen.
- Match the tone of success/error/empty copy — plain, direct, no exclamation marks doing the emotional work that the design should be doing.

---

## 10. Accessibility & responsiveness — this is the floor, not a stretch goal

- Every interactive element needs a visible keyboard focus state — don't strip `outline` without replacing it with an equally visible custom focus ring.
- Touch targets on any screen that could be viewed on mobile/tablet should be at least 44×44px.
- Color is never the only signal for state (error, success, active row) — pair it with an icon, label, or weight change so it still reads for colorblind users.
- Every screen and component must be checked at mobile width before it's considered done — mobile QA is mandatory, not optional.
- Numeric/tabular data should use `font-variant-numeric: tabular-nums` so columns of numbers align vertically — small detail, disproportionate credibility gain on any data-driven screen.

---

## 11. The small-click checklist

Every one of these is cheap to implement and disproportionately improves how "finished" a product feels. Apply by default, not only when asked:

- Buttons and clickable rows have a hover state *and* a distinct pressed/active state.
- Disabled buttons look genuinely inert (reduced opacity + `cursor: not-allowed`), not just slightly duller.
- Copy actions, filters applying, and saves all confirm themselves (a toast, an inline checkmark, a brief highlight) — never leave the user guessing whether a click did anything.
- Long-running actions (export, bulk update) show progress or at least a busy state on the triggering element itself, not just a page-level spinner.
- Toasts/notifications: use one consistent library and placement across the app. `sonner` or `react-hot-toast` are lightweight, unopinionated choices for React projects.
- Tooltips on icon-only buttons — an icon-only action without a tooltip is a guessing game for new users.

---

## 12. Libraries worth evaluating

Pick libraries that layer cleanly onto the existing stack rather than ones that assume a full framework rewrite. Adjust to whatever this project is actually built on:

- **Icons:** `lucide-react` (React) or Lucide's static SVGs / Tabler Icons (framework-agnostic)
- **Motion:** `framer-motion` / `motion` (React); native CSS transitions + Web Animations API (framework-agnostic)
- **Toasts/notifications:** `sonner` or `react-hot-toast`
- **Animated icons / illustrated empty states:** `lottie-react` (or the framework-agnostic Lottie player) for Lottie files; undraw.co or storyset for free illustrated empty-state art
- **Skeleton loading:** `react-loading-skeleton`, or hand-rolled CSS shimmer classes if you want zero extra dependency weight
- **Command palette / power-user search** (for tools with many sections/pages): `cmdk`
- **Accessible unstyled primitives** (dropdowns, dialogs, popovers): **Radix Primitives** — full control of styling while getting correct focus management and keyboard behavior for free
- **Charting:** `recharts` or `visx` for React dashboards; `d3` directly for custom/geo visualizations that off-the-shelf chart libraries can't handle

---

## 13. Anti-patterns — the fastest tells of an unfinished/AI-default UI

Actively check for and remove these before calling a screen done:

- Every card sharing the exact same border-radius, the exact same soft gray shadow, regardless of hierarchy or content type.
- A tracked-out ALL-CAPS label above every section heading "because it looks designed."
- Fade-and-slide-up animation on every section as it scrolls into view.
- A single word in every headline randomly bolded or recolored.
- Generic stock icon + heading + one-line description in a 3-column grid as the default way to present any list of features.
- Inconsistent icon sets or icon weights across the same screen.
- A loading state that's just a blank white/dark rectangle with no shimmer or shape.

---

## 14. Before calling any screen "done" — self-review checklist

- [ ] Does this screen make at least one deliberate choice specific to this product, or could it be dropped into any other app unchanged?
- [ ] Loading, empty, error, and populated states all designed — not just the happy path?
- [ ] Every interactive element has hover, focus, active, and disabled states?
- [ ] Checked at mobile width, not just desktop?
- [ ] Keyboard-only navigation works and focus is always visible?
- [ ] Any new color, spacing, radius, or shadow value reuses an existing token — no hardcoded one-offs?
- [ ] Copy reviewed for tone — plain, active voice, no filler?
- [ ] Motion used only where it answers a user action, not decoration on load?

---

*This file should evolve. When a new pattern proves itself in this project, add it here so it becomes the default the next time — for you and for whoever (human or AI) works on this repo next.*