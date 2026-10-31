# Private Academy — Design System & Page Specs

Version 1.0 · Reference mockup: https://claude.ai/artifact/Jz5Su8voXY5wXDpM1xa9Qj
Target stack: Next.js (App Router) · TypeScript · Tailwind CSS · Supabase (a React Native app will reuse the same tokens later)

---

## 1. Design intent

**One-line concept: an engineer's notebook.**
Private Academy sells and shares study notes. The interface should feel like a well-kept notebook on graph paper: ruled sheets, margin lines, highlighter marks, and mono-spaced spec labels. It should not look like a generic SaaS template.

### Principles

1. **Show the product, not icons.** Use real-looking note sheets, PDF previews and video chips instead of abstract illustrations and icon bubbles.
2. **Highlighter is the only loud thing.** Yellow is used sparingly, the way a student highlights one line on a page. If everything is yellow, nothing is.
3. **Find notes in three taps.** University → branch → semester is the primary path on every screen that lists notes. Never bury it.
4. **Borders over shadows.** Surfaces are separated by hairlines. Shadows only appear on floating "paper" objects (note sheets, popovers).
5. **Label like a spec sheet.** Metadata (semester, university, counts, prices, statuses) is set in small mono uppercase. Content is set in sans and display type.
6. **Honest and calm.** Students are stressed during exams. No fake urgency, no countdown timers, no dark patterns around unlocking or payouts.
7. **Fast on cheap phones.** Most users are on mid-range Android over mobile data. Keep pages light, use skeletons, avoid heavy animation.

---

## 2. Design tokens

### 2.1 Color

#### Core palette

| Token | Hex | Use |
|---|---|---|
| `ink-900` | `#0B1020` | Primary text, dark sections, primary dark buttons, logo block |
| `ink-700` | `#1B2540` | Cards on dark sections |
| `ink-600` | `#2A3550` | Borders on dark, tier bar 70% |
| `ink-500` | `#3A4A74` | Tier bar 75% |
| `slate-600` | `#4A5468` | Secondary text on light (≈7:1 on paper) |
| `slate-300` | `#B8C1D6` | Secondary text on dark (≈10:1 on ink-900) |
| `line-300` | `#CDD4E2` | Input borders, dividers, table rules |
| `line-200` | `#E3E8F1` | Subtle dividers, skeleton bars |
| `grid-line` | `#E1E6F0` | Graph-paper grid in hero backgrounds |
| `paper` | `#F7F8FB` | Page background |
| `white` | `#FFFFFF` | Cards, sheets, inputs |
| `blue-500` | `#2447F5` | Primary action, links, focus ring, mono eyebrow labels (≈6:1 on white) |
| `blue-600` | `#1B38D1` | Primary hover / pressed |
| `blue-300` | `#C3CEF8` | Notebook margin line, subtle selection |
| `blue-100` | `#E6EBFF` | Tinted backgrounds (info, selected row) |
| `blue-400` | `#5468B8` | Tier bar 82% |
| `hl-400` | `#FFE14D` | **Highlighter**: key-word marks, Legend tier, promo banner, CTA on dark |
| `hl-300` | `#FFEC85` | Highlighter hover |
| `hl-100` | `#FFF8D1` | Soft highlight backgrounds (warnings, "new") |

#### Semantic colors

| Role | Text/icon | Background | Rule |
|---|---|---|---|
| Success | `#0F7B4F` | `#E4F5EC` | Approved, payout paid |
| Error | `#C42B3A` | `#FDE8EA` | Rejected, failed payment, form errors |
| Warning | `#0B1020` | `hl-100` | In review, low balance |
| Info | `blue-500` | `blue-100` | Tips, notices |

Never use color alone to carry meaning. Always pair with an icon or a text label.

#### Usage ratios

- 80% paper, white and ink. 15% blue. 5% yellow.
- Max **one** yellow filled element per viewport (banner or CTA or badge), plus any number of small highlighter marks on words.
- Dark sections (`ink-900`) are used for at most two sections per page (contributor earnings, footers, or a final CTA).

#### Contrast rules

- Body text on paper/white: `ink-900` or `slate-600` only.
- Text on `blue-500`: white only.
- Text on `hl-400`: `ink-900` only.
- Do not put `slate-600` on `ink-900`; use `slate-300`.
- Do not put `blue-500` text on dark backgrounds; use `hl-400` or white.

### 2.2 Typography

| Role | Family | Weight | Notes |
|---|---|---|---|
| Display / headings | **Bricolage Grotesque** | 800 (600 for small headings) | Tracking `-0.03em`, line-height ~1.04 |
| Body / UI | **Inter** | 400, 500, 600 | Line-height 1.55 |
| Labels / metadata | **JetBrains Mono** | 500 | Uppercase, `0.07em` tracking, 12px |

Fallbacks: `'Bricolage Grotesque', 'Inter', system-ui, sans-serif`; `'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif`; `'JetBrains Mono', ui-monospace, 'SF Mono', monospace`.

#### Type scale (desktop → mobile)

| Token | Desktop | Mobile | Use |
|---|---|---|---|
| `display-xl` | 72/74 | 44/46 | Home hero headline only |
| `display-lg` | 56/58 | 38/40 | Page titles (Official Notes, Projects, About) |
| `h2` | 48/50 | 32/34 | Section titles |
| `h3` | 28/32 | 22/26 | Card titles, project rows |
| `h4` | 22/28 | 20/26 | Small card titles |
| `body-lg` | 19/30 | 17/28 | Hero and section intros |
| `body` | 16/26 | 16/26 | Default |
| `small` | 14/22 | 14/22 | Secondary text, helper text |
| `label` (mono) | 12/16 uppercase | 12/16 | Eyebrows, tags, stat captions, table headers |
| `stat` | 52/52 | 36/36 | Big numbers (display font) |

Rules:
- Minimum body size is 16px. Never go below 14px for readable text, 12px only for mono labels.
- Eyebrow above every section title: mono label in `blue-500` (or `hl-400` on dark).
- One highlighter mark per heading maximum, on the 2 to 4 words that carry the meaning.
- Line length: 60 to 75 characters for reading text (articles, legal, descriptions).
- Numbers: use `font-variant-numeric: tabular-nums` in tables, counters and prices. Format with `en-IN` (e.g. `₹2,756`, `50,000`).

### 2.3 Spacing and layout

Base unit 4px. Scale: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 104`.

| Item | Desktop (≥1024) | Tablet (640–1023) | Mobile (<640) |
|---|---|---|---|
| Container max width | 1200 | 100% | 100% |
| Container side padding | 32 | 24 | 20 |
| Section vertical padding | 104 | 72 | 56 |
| Grid | 12 col, gap 24 | 8 col, gap 20 | 4 col, gap 16 |
| Card padding | 28 | 24 | 20 |

Reading column (articles, legal, long descriptions): max 680px.

### 2.4 Shape, borders, elevation

| Token | Value | Use |
|---|---|---|
| `radius-sm` | 8px | Chips, small buttons, tags, thumbnails |
| `radius-md` | 10px | Buttons, inputs |
| `radius-lg` | 14px | Note sheets, small cards, popovers |
| `radius-xl` | 18px | Bento cells, large cards |
| `radius-2xl` | 24px | Promo banners, modals |
| `radius-full` | 999px | Pills, avatars |

- Default surface: `white` + `1px solid #D9DFEB` (or `line-300`). No shadow.
- **Sheet shadow** (floating paper): `0 36px 60px -32px rgba(11,16,32,.4)`.
- **Hover lift** (clickable cards): `0 20px 40px -24px rgba(11,16,32,.3)` + `translateY(-2px)`.
- **Popover/menu**: `0 16px 40px -16px rgba(11,16,32,.35)` + `1px solid line-300`.
- Section dividers are 1px `line-300` lines. Table header underline is 2px `ink-900`.

### 2.5 Signature patterns (the "look")

1. **Graph-paper background** (hero areas only, fades out downward):
   `background-image: linear-gradient(#E1E6F0 1px, transparent 1px), linear-gradient(90deg, #E1E6F0 1px, transparent 1px); background-size: 32px 32px;` with a mask `linear-gradient(#000 55%, transparent)`.
2. **Highlighter mark** on words:
   `background: linear-gradient(transparent 56%, #FFE14D 56% 94%, transparent 94%); padding: 0 .05em;`
3. **Note sheet**: white card, 1px border, `radius-lg`, sheet shadow, left padding larger than right, a 1px `blue-300` margin line running full height at the left. Stack two or three sheets with `rotate(-5deg)` and `rotate(2.5deg)` for hero art. Never rotate sheets that hold interactive controls.
4. **Skeleton text bars** (9px high, `line-200`, radius 5) double as decorative "text" on sheets and as real loading states. One in three bars is highlighter-colored on decorative sheets.
5. **Mono spec labels**: uppercase 12px JetBrains Mono for anything that reads like metadata.
6. **Index tables**: hairline-separated lists with a 2px ink header rule, used for branches, projects, careers, payouts, and admin queues instead of card grids.

### 2.6 Iconography and imagery

- Icon set: **Lucide**, 1.75px stroke, 20px default (16 inline, 24 feature). Color inherits text. Do not use emoji in the UI.
- Brand mark: 30px rounded square (`ink-900`, radius 8) with a 5px `hl-400` bar inset 7px from left, right and bottom. Next to it, the wordmark "Private Academy" in display 800, 20px.
- Play button: 30 to 44px circle in `hl-400` with an `ink-900` triangle. Always sits on `ink-900`.
- Imagery: real note page thumbnails (first page of the PDF, 3:4), contributor avatars, and project screenshots. No stock photos of smiling students. If no thumbnail exists, render a decorative sheet with skeleton bars.
- Avatars: circle, 36 px default; fallback is initials in mono on `blue-100`.

### 2.7 Motion

| Interaction | Duration | Easing | Detail |
|---|---|---|---|
| Hover color/border | 150ms | ease-out | |
| Card hover lift | 200ms | ease-out | `translateY(-2px)` + shadow |
| Hero sheets on load | 500ms | cubic-bezier(.2,.8,.2,1) | Fade in + rise 16px, 80ms stagger |
| Sheets on hover (hero) | 300ms | ease-out | Spread rotation by about 2deg |
| Modal / drawer | 240ms | ease-out | Fade + 12px rise |
| Skeleton shimmer | 1.4s loop | linear | Subtle, opacity 0.6 → 1 |

Respect `prefers-reduced-motion: reduce`: disable translate, rotation animation and shimmer; keep opacity fades only.

---

## 3. Components

All components must have these states: default, hover, focus-visible, active, disabled, loading, error (where relevant).

**Focus ring (global):** `outline: 2px solid #2447F5; outline-offset: 2px;` On dark backgrounds use `#FFE14D`.

### 3.1 Buttons

| Variant | Background | Text | Border | Use |
|---|---|---|---|---|
| Primary | `blue-500` | white | none | Main action (one per view) |
| Dark | `ink-900` | white | none | Login, secondary strong actions |
| Highlighter | `hl-400` | `ink-900` | none | CTA on dark sections only |
| Secondary | white | `ink-900` | 1.5px `line-300` | Alternate actions |
| Ghost | transparent | `ink-900` | none | Tertiary, inline |
| Danger | `#C42B3A` | white | none | Delete, reject |

- Height 48 (default), 44 (compact, nav), 56 (hero only). Radius 10. Padding 0 22. Font Inter 600, 16.
- Hover: primary → `blue-600`; dark → `ink-700`; highlighter → `hl-300`; secondary → border `ink-900`.
- Loading: replace label with a 16px spinner, keep width, disable pointer events.
- Disabled: 45% opacity, `cursor: not-allowed`, still readable.
- Minimum touch target 44×44.

### 3.2 Links

- Inline: `blue-500`, underline on hover, underline always inside long text.
- External/demo links: mono label style with an arrow, e.g. `LIVE DEMO ↗`, in `blue-500`.

### 3.3 Pills and chips

- **Selector chip** (university): 44px high, padding 0 14, radius 8, 1px `line-300`, white, Inter 600 14. Selected: `ink-900` background, white text. Group is a radio group.
- **Filter pill**: 44px high, radius full, 1px `line-300`, white, Inter 500 15. Selected: `blue-100` bg, `blue-500` border and text, plus a check icon.
- **Tag** (non-interactive): mono label, radius 6, `line-200` background, `ink-900` text.
- **Price chip**: mono label. Free → `hl-100` bg, `ink-900` text, text "FREE". Paid → `ink-900` bg, white text, "₹49".

### 3.4 Form fields

- Height 48, radius 10, padding 0 16, background `paper` (inside white cards) or white (on paper), border 1px `line-300`.
- Label above: Inter 600 14, 8px gap. Helper below: 14 `slate-600`. Error below: 14 `#C42B3A` with alert icon; border becomes `#C42B3A`.
- Focus: border `blue-500` + the global ring.
- Search field: leading search icon, clear button when filled, `Enter` submits.
- Select: native `<select>` styled to match on mobile; custom listbox on desktop only if it supports keyboard and screen readers.
- File upload (PDF): dashed 1.5px `line-300` border, radius 14, 40px padding, "Drop a PDF here or choose a file", rules in helper text ("PDF, up to 5MB"). On drag-over: `blue-100` background and `blue-500` border. After upload: file row with name, size, replace and remove buttons.
- Price input: `₹` prefix, integer 0 to 99, helper "₹0 makes the note free".
- UPI ID input: monospace value, validate pattern `name@bank`.

### 3.5 Navigation bar

- Height 76, transparent over paper (becomes white with bottom hairline after 8px scroll).
- Left: brand mark + wordmark. Center: Official Notes, Community Notes, Discussions, Projects, Contribute (Inter 500 15, 26px gap). Right: Log in (dark button, compact), or avatar menu when signed in.
- Active link: 2px `hl-400` underline offset 6px (a highlighter stroke), not a color change.
- Mobile: brand + menu button (44×44). Full-screen sheet menu with large links (display 28), user university chip at the top, Login at the bottom.
- "More" group (Articles, About, Careers, Contact) lives in the footer on desktop and in the mobile menu below a divider.

### 3.6 Note sheet (decorative and real)

Spec in section 2.5. Real previews follow the same shell but render the PDF page image inside with the margin line removed. Lock overlay for page 4+: `ink-900` at 92% with a mono "UNLOCK" label in `hl-400`.

### 3.7 Note card (listing)

```
┌──────────────────────────┐
│ [ page-1 thumbnail 3:4 ] │   radius-lg, 1px border
│  OFFICIAL    ·    PDF    │   tags top-left, overlay on thumbnail
├──────────────────────────┤
│ MU · SEM 4 · COMPUTER    │   mono label, slate-600
│ Subject name — Unit title│   h4 display, max 2 lines
│ 24 pages · 1.2K downloads│   small, slate-600
│ @contributor  [Top Author]│   avatar 24 + handle + tier badge (community only)
│                    ₹49   │   price chip bottom-right
└──────────────────────────┘
```

- Official notes show an "OFFICIAL" tag (`ink-900`) and no contributor row.
- Community notes show the contributor and tier badge.
- Whole card is one link target. Hover lift. Focus ring around the whole card.
- Grid: 4 columns ≥1200, 3 ≥900, 2 ≥600, 1 on small phones (list variant: thumbnail 88px left).

### 3.8 Tier badges

| Tier | Share | Style |
|---|---|---|
| Verified Contributor | 70% | Outline: 1px `ink-900`, transparent, mono label |
| Rising Scholar | 75% | `blue-100` bg, `blue-500` text |
| Top Author | 82% | `blue-500` bg, white text |
| Legend Author | 90% | `hl-400` bg, `ink-900` text |

Requirements to display in tooltips and the contribute page: Rising Scholar 3+ approved notes and 25+ purchases; Top Author 5+ and 50+; Legend Author 10+ and 100+.

### 3.9 Stat cell

Mono label on top (slate-600), `stat` number below in display 800. Cells sit in a row separated by 1px vertical `line-200` rules inside a white strip with top and bottom `line-300` hairlines. Counters animate once when entering the viewport (800ms, tabular-nums), skipped for reduced motion.

### 3.10 Bento cell

White, 1px `#D9DFEB`, radius 18, padding 28, overflow hidden. Title display 24 to 28, one supporting line in `slate-600`, then a small live mock (preview strip, split view). Large cells span 3 of 6 columns, small ones 2 of 6. Mobile: single column.

### 3.11 Index list (branches, careers, payouts)

- Group header: mono label with 2px `ink-900` bottom border, 12px bottom padding.
- Rows: 1px `line-200` bottom border, 9 to 12px padding, Inter 500 16. Hover: row text turns `blue-500` and a `→` appears at the right.
- Grouping used for branches:
  - Computing: Computer Engineering, CSE, Information Technology, AIML, AIDS, Data Science & Analytics, Cyber Security & Forensic Science
  - Electrical & Electronics: EXTC, Electrical, Electronics & Computer, Instrumentation & Control
  - Mechanical & Production: Mechanical, Robotics & Automation, Mechatronics, Automobile, Aerospace & Aeronautical, Production & Industrial
  - Civil & Process: Civil, Chemical, Biomedical, Biotechnology & Bioengineering, Environmental

### 3.12 Project row

Grid: `56px | 1.3fr | 1.2fr | auto`. Index in mono (01, 02), name in display 28, stack in mono slate-600, "LIVE DEMO ↗" in mono blue. 26px vertical padding, 1px `line-300` top border. Mobile: stack to two lines (index + name on line one, stack and link on line two).

### 3.13 Earnings staircase (tier chart)

Four columns anchored to the bottom on an `ink-900` section. Heights 210, 250, 310, 370 px (scale with percentage). Colors: `ink-600`, `ink-500`, `blue-400`, `hl-400`. Big percentage inside the bar (display 36), tier name and requirement below. On mobile, switch to horizontal bars stacked vertically.

### 3.14 Promo/community banner

`hl-400` background, radius 24, padding 48. Large display number (e.g. `2.5K+`), one sentence, and a row of pills for channels (Telegram primary dark button, others as `lk` pills). Use once per page, near the bottom.

### 3.15 Footer

- Top rule 1px `line-300`. Three link columns (Explore, Legal, Support) with mono headings.
- Bottom: huge "Private Academy" wordmark in display 800, 150px, color `line-200`, cropped by the container (no wrap). Under it the copyright line in mono.
- Mobile: wordmark scales to 64px and wraps to two lines.

### 3.16 Feedback components

- **Toast**: bottom-center on mobile, bottom-right desktop. White, 1px border, radius 14, popover shadow, icon + message + optional action. Auto-dismiss 5s, pause on hover. Errors persist until dismissed.
- **Banner (inline)**: radius 14, tinted background from semantic table, icon left, text, optional action right.
- **Modal**: max width 520, radius 24, white, backdrop `ink-900` at 55%. Trap focus, close on Esc, return focus to trigger.
- **Skeleton**: use the note sheet skeleton bars. Mirror the exact layout of the loaded component to avoid layout shift.
- **Empty state**: a single faded note sheet illustration (skeleton bars), display 24 title, one sentence, one primary action.
- **Tooltip**: `ink-900` bg, white text, small, radius 8; only for tier requirements and truncated text. Never the only place a critical instruction lives.

### 3.17 Tabs, accordion, pagination

- **Tabs**: mono labels, 2px `hl-400` bottom bar on the active tab, 1px `line-300` rail beneath.
- **Accordion** (FAQ): row with 1px bottom rule, question Inter 600 17, plus/minus icon right, answer `slate-600`. One open at a time is not required.
- **Pagination**: "Load more" button for notes (no infinite scroll, to keep the footer reachable). Numbered pagination only in admin tables.

### 3.18 Status badges (submissions and payments)

| Status | Style |
|---|---|
| Draft | Tag (gray) |
| In review | `hl-100` bg, `ink-900` text, clock icon |
| Approved / Live | Success tint, check icon |
| Rejected | Error tint, x icon, reason shown beneath |
| Payout requested | `blue-100`, `blue-500` text |
| Paid | Success tint |
| Failed | Error tint |

---

## 4. Page specifications

Routes follow the existing site map. Each page lists its purpose, layout, sections in order, key components, states and SEO notes. Use the same header and footer everywhere unless stated.

### 4.1 Home `/`

Purpose: get a student into the right notes in one step, and build trust.

Sections in order:
1. **Hero** (graph-paper background, two columns). Left: mono eyebrow "Free & paid notes · ₹0–₹99", display-xl headline with highlighter on "your syllabus", body-lg intro, then the **Finder card** (university chips MU/SPPU/NU/AU/DBATU/SUK + search field + "Find notes"). Right: stacked note sheets, "First 3 pages free to preview" pill (`hl-400`, rotated 2deg), video chip bottom-left.
2. **Stats strip**: students helped, downloads, branches, universities, satisfaction. Pull real values from the database where possible; fall back to the numbers on the About page.
3. **Branch index**: 4 grouped columns, each row links to `/notes?branch=…`.
4. **Built for exam week** (bento): preview before unlock, PDF + video on one screen, set your university once, reviewed against syllabus, secure checkout.
5. **Community notes / earnings** (dark): headline, example earnings card, tier staircase, highlighter CTA "Upload your first note".
6. **Projects** (index list).
7. **Community banner** (`hl-400`).
8. Footer.

Behavior: the chosen university is stored (cookie + profile) and pre-selects chips across the site. The Finder card routes to `/notes?university=…&q=…`.

### 4.2 Official Notes `/notes`

Purpose: browse and filter curated notes.

Layout: page header (display-lg title, one-line intro), sticky filter bar, results grid.
- **Filter bar** (sticky under nav): university chips (single select), branch select, semester pills (1 to 8), sort select (Newest, Most downloaded, Price low to high), search input. On mobile, filters collapse into a "Filters" button that opens a bottom sheet with an "Apply" button and active filter count.
- **Active filters row**: removable chips + "Clear all".
- **Results**: note cards (3.7), count in mono ("128 NOTES"), "Load more".
- **Empty**: "No notes for this combination yet" + actions "Clear filters" and "Request a note" (opens contact form with prefilled branch and semester).
- **Right rail (desktop ≥1200, optional)**: "Can't find your subject?" card linking to Discussions and Contribute.
- URL carries all filters so pages are shareable.
- SEO: unique title per filter combination, e.g. "Mumbai University Computer Engineering Semester 4 Notes".

### 4.3 Note detail `/notes/[slug]` (and `/community-notes/[slug]`)

Purpose: let a student judge quality, then unlock with confidence.

Layout (desktop): 7/5 column split.
- **Breadcrumb** (mono): Notes / University / Branch / Semester.
- **Left (7 cols)**: title (display 40), tags row, then the **Preview viewer**: large page with next/prev, thumbnails strip, pages 1 to 3 visible, page 4 onward covered by the lock overlay. Below the viewer: tabs (Overview, Syllabus coverage, Video, Related notes).
- **Right (5 cols, sticky under nav)**: **Purchase card**: price (display 48, or FREE), primary button "Unlock & download" (free notes: "Download"), a short list of what's included (PDF size, pages, video if available), secure checkout line ("Payments by Razorpay"), refund policy link. Below it a **Contributor card** (avatar, @username, tier badge, number of notes, "View profile") for community notes, or an "Official" card for official notes. "Report an issue" ghost link at the bottom.
- **Mobile**: preview first, then a sticky bottom bar with price and the Unlock button. Contributor card moves under the tabs.
- **States**: not signed in (button opens login modal and returns to the same note), processing payment (button loading, page inert), payment success (confetti-free: inline success banner + auto-download button), payment failed (error banner with retry), already owned ("Download" + "Purchased" success tag).

### 4.4 Community Notes `/community-notes`

Same structure as Official Notes with these differences:
- Intro line explains notes are shared by students and reviewed before publishing.
- Extra filter: contributor tier (Any, Top Author and above, Legend).
- Cards show contributor row and tier badge.
- A persistent callout above the grid: "Have good notes? Earn up to 90%" with a secondary button to `/contribute`.

### 4.5 Contributor profile `/u/[username]` (shown as @username)

- Header band on `paper` with the graph paper background: avatar 80, display name, @username (mono), tier badge, join date, short bio.
- Stat cells: approved notes, total unlocks, current tier.
- Tier progress: horizontal bar showing progress to the next tier with the exact remaining counts ("2 more approved notes and 14 more purchases to reach Top Author").
- Notes grid (3.7), sort and filter by university.
- Empty: "No published notes yet."

### 4.6 Contribute `/contribute`

Purpose: convert students and alumni into contributors.

Sections:
1. **Hero** (graph paper): "Turn your semester notes into income." with a highlighter on "income". Primary CTA "Upload your first note", secondary "Calculate earnings".
2. **How it works** (4 numbered steps in an index row): Upload PDF (up to 5MB, price ₹0 to ₹99) → Quality review (12 to 24 hours) → Go live with your @username and badge → Direct UPI payout (minimum ₹100).
3. **Earnings calculator** (white card, two columns): sliders for number of notes (1 to 20), average price (₹0 to ₹99), and unlocks per note (1 to 200). Output: tier name with badge, total unlocks, gross sales, platform commission rate, net earnings in display 60 (`hl-400` highlight behind the number), and a line showing what is needed for the next tier. Default example: 3 notes, ₹49, 25 unlocks, Rising Scholar 75%, net ₹2,756.
4. **Tier staircase** (dark section) with requirements.
5. **FAQ accordion**: who can contribute, file format limits, revenue split and pricing, payouts, review time, managing or deleting notes.
6. **Final CTA** banner.

### 4.7 Contributor dashboard `/dashboard` (signed-in)

Layout: left sidebar (240px, sticky) with Overview, My notes, Upload, Earnings, Payouts, Profile. On mobile, a bottom tab bar (Overview, Notes, Upload, Earnings, Profile).

- **Overview**: four stat cells (Net earnings, Unlocks, Approved notes, Current tier) + tier progress + recent activity list (sales, approvals, payouts).
- **My notes**: index table with thumbnail, title, university/sem, status badge, price, unlocks, earnings, actions (edit price, unpublish, delete). Rejected rows expand to show the admin's reason and a "Fix and resubmit" button.
- **Upload**: 3-step wizard (progress shown as mono step labels): 1) File (PDF upload with 5MB limit), 2) Details (title, university, branch, semester, subject, price 0 to 99, short description), 3) Review & submit (summary + checkbox confirming they own the content). Success state explains review takes 12 to 24 hours.
- **Earnings**: line or bar chart (monthly), per-note table, current share percentage.
- **Payouts**: available balance (display 52), UPI ID field, "Request payout" button disabled below ₹100 with helper "Minimum payout is ₹100", history table with status badges.

### 4.8 Discussions `/discussions`

Purpose: Q&A between students.

- **List page**: header with "Ask a question" primary button, filters (university, branch, semester, solved/unsolved), sort (Latest, Most answered). Each row: title (h4), mono tags (university, branch, semester), author + time, answer count, and a "SOLVED" success tag when an answer is accepted.
- **Thread page** `/discussions/[id]`: question (reading column 680), then answers. An accepted answer has a 4px `hl-400` bar on its left edge and a "Best answer" mono tag. Composer at the bottom with plain text + code block support and attach image. Signed-out users see the composer replaced by "Log in to reply".
- **New question**: single page form with title, details, tags (university, branch, semester), preview tab.
- Moderation states: reported, hidden (collapsed with "Show").

### 4.9 Projects `/projects`

Purpose: showcase live demos and take requests for micro and mini projects.

Sections:
1. Header: display-lg "Micro & mini projects, source included." with highlighter on "source included." Supporting line about branch, semester and stack.
2. **How to get a project** (3 steps): Contact us → Get matched → Receive source code and documentation.
3. **Live demos** as an index list (3.12): Bilix Invoice Generator, Cryptocurrency Dashboard, Easy Health Booking, RunQR, Smart Tools Hub, Submit Portal. Add a screenshot thumbnail (16:10, radius 14) that appears on row hover (desktop) or inside the row (mobile).
4. **Focus areas**: tags row (Web development, Mobile development, Python projects, React & modern JS, Other).
5. **Request a project** card: short form (branch, semester, stack, message) + secondary contact options (Email, WhatsApp). Success state confirms we will reply by email.

### 4.10 Articles `/articles` and `/articles/[slug]`

- **List**: featured article on top (large sheet-style card with cover, mono meta, title), then a 3-column grid of article cards (cover 16:9, mono category and read time, h4 title, 2-line excerpt). Category pill filters. RSS link in the header ("RSS" mono link).
- **Article page**: reading column 680, display-lg title with optional highlighter, mono meta row (author, date, read time), cover image, body typography (body-lg, 1.7 line-height, h2 at 32, blockquote with a 4px `blue-300` left rule, code blocks on `ink-900`), sticky table of contents (desktop right rail), share row, related articles (3 cards), contribute/community banner.

### 4.11 About `/about`

1. Hero: "A study platform built by a student, for students." (highlighter on "for students").
2. Stats strip.
3. **Story** (two columns: text + stacked sheets visual).
4. **Core values** (4 cells in a row, bento style): Excellence, Accessibility, Innovation, Impact, each with a one-line description.
5. **Supported universities** (6 cells) and **branch index**.
6. **Key features** list.
7. **Founder card**: avatar or initials "KG", Karan Gholap, Founder & Software Developer, short bio, links (LinkedIn, X, Peerlist, Portfolio) as pills.
8. **FAQ accordion** (syllabus alignment, previews, secure checkout, uploading notes).
9. Contact CTA.

### 4.12 Careers `/careers`

- Header with short culture note.
- **Open roles** as an index list: title, type (mono: Volunteer, Part-time, Internship, Full-time), location (Remote / Mumbai), "Apply →". Row expands or links to a detail view with responsibilities and an application form.
- **Empty state**: faded sheet + "No open roles right now" + email capture "Tell us how you'd like to help" (name, email, link, message).
- Optional "Volunteer contributors" block linking to `/contribute`.

### 4.13 Contact `/contact`

- Two columns. Left: display-lg "Say hello." plus contact list (email, WhatsApp, Telegram, social pills). Right: form card (name, email, topic select [Note issue, Payment, Contributor payout, Project request, Other], message, optional note link, submit).
- Success: inline banner "Thanks, we'll reply by email" and the form resets. Rate-limit and honeypot spam protection (no CAPTCHA unless abuse appears).

### 4.14 Login / Sign up `/login`

- Split screen on desktop. Left (paper with graph grid): one large rotated note sheet with the line "Your university, your notes." Right: form card (max 420) with tabs Log in / Sign up.
- Fields per the auth methods enabled in Supabase (email + password or magic link, Google if enabled). Show password toggle, forgot password link, terms/privacy links on sign up.
- Sign up asks for university (chips) and branch after account creation as a one-time "Set up your dashboard" step (skippable).
- Errors inline under fields; global errors in a banner above the form.
- Mobile: single column, brand mark on top, no visual panel.

### 4.15 Account `/account`

Tabs: Profile (name, @username, bio, avatar), My purchases (table with re-download buttons), Preferences (default university, branch, semester, email notifications), Security (password, sessions), Danger zone (delete account, with typed confirmation).

### 4.16 Admin `/admin` (admin accounts only)

Utilitarian variant of the system: no graph paper, no decorative sheets, 14px base body and denser rows (44px).
- **Review queue**: table (submitted time, contributor, university/branch/sem, price, file size). Row opens a split view: PDF viewer left (large), metadata and checklist right (legible, matches syllabus, no copyrighted/pirated material, quality of scan) with Approve and Reject (reason required, templated reasons dropdown + free text).
- **Notes, Users, Payout requests** (mark paid with transaction reference), **Reports**, **Analytics** (downloads, revenue, top notes).
- Always show an audit trail line ("Approved by Karan, 31 Oct, 14:02").

### 4.17 Legal pages

Routes: `/privacy-policy`, `/terms-and-condition`, `/refund-policy`, `/shipping-policy`, `/disclaimer`.
- Reading column 680 with a sticky table of contents on desktop, mono "LAST UPDATED 31 OCT 2026" under the title, h2 at 28 for sections, body 16/1.7. No hero art, no highlighter marks. Cross-links to the other legal pages at the bottom. Contact link for questions.

### 4.18 Utility pages

- **404**: large mono "404" in `blue-500` on a torn-corner note sheet, display 40 "This page isn't in the syllabus." Search field + links to Notes, Community Notes, Discussions.
- **500 / error boundary**: same layout, message "Something went wrong on our side", retry button, status link.
- **Maintenance**: centered sheet, expected return time in mono.
- **Offline** (for the future PWA/app): small banner "You're offline. Downloaded notes are still available."
- **Search results `/search?q=`**: combined results grouped by Notes, Community Notes, Discussions, Articles with counts in mono.

---

## 5. Responsive behavior

| Breakpoint | Name | Key changes |
|---|---|---|
| ≥1200 | xl | Full layout, 4-col note grid, sticky rails |
| 1024–1199 | lg | 3-col note grid, rails stack under content |
| 640–1023 | md | 2-col grids, nav collapses to menu, bento becomes 2 columns |
| <640 | sm | Single column, sticky bottom purchase bar on note detail, filters in bottom sheet, tier staircase becomes horizontal bars |

Rules:
- Hero sheets stay visible on mobile but shrink to 70% and sit below the Finder card.
- Never hide critical actions behind hover. All hover reveals need a tap/focus equivalent.
- Tables become stacked cards below 640 (label on the left, value on the right).
- Test at 360px width. No horizontal scroll on the body.
- Keep tap targets at least 44×44 with 8px spacing.

---

## 6. Accessibility checklist

- All text meets WCAG AA (4.5:1; 3:1 for text 24px and larger). The palette above passes when used as specified.
- Real elements: `<button>`, `<a href>`, `<input>` + `<label>`, `<nav>`, `<main>`, `<footer>`. No clickable `div`s.
- The university chip group is a `role="radiogroup"` with arrow-key navigation; filters announce selected state.
- Decorative sheets and SVGs: `aria-hidden="true"`. Informative images have alt text. PDF preview pages have alt "Page N of the note preview".
- Skip link to main content as the first focusable element.
- Visible focus on every interactive element (section 3).
- Forms: errors are associated with fields (`aria-describedby`), and focus moves to the first error on submit.
- Modals and menus trap focus and restore it when closed.
- Do not rely on color alone for status; always show an icon or text.
- Respect `prefers-reduced-motion` and `prefers-color-scheme` (see below).
- Language attribute `lang="en-IN"`.

### Dark mode

Phase 1 ships light only. When adding dark mode, map: `paper` → `#0B1020`, `white` surfaces → `#131B33`, borders → `#2A3550`, text → `#E6E9F2`, secondary text → `#B8C1D6`, `blue-500` → `#7C93FF` for text and focus, highlighter stays `#FFE14D`. Note sheets stay white (they are paper) with the sheet shadow replaced by a 1px border.

---

## 7. Content and voice

- Tone: friendly senior student. Direct, specific, a little dry. No hype words ("revolutionary", "best ever").
- Headlines are short statements with one highlighted phrase. Sentence case everywhere except mono labels (uppercase).
- Use "notes", "semester", "unlock", "contributor". Avoid "premium", "exclusive", "limited time".
- Always show prices as `₹49` and `Free`. Never "₹0".
- Dates: `31 Oct 2026`. Times: 24h or `2:30 pm`, consistent per page. Use `en-IN` number formatting.
- Don't invent numbers, testimonials or logos. Use real counts from the database or omit the block.
- Microcopy examples:
  - Empty search: "Nothing for that yet. Try a different semester or ask in Discussions."
  - Payment failed: "Payment didn't go through. You haven't been charged. Try again."
  - Payout minimum: "Minimum payout is ₹100."
  - Upload hint: "PDF only, up to 5MB."

---

## 8. Implementation guide (Next.js + Tailwind)

### 8.1 Global CSS tokens (`app/globals.css`)

```css
:root {
  --ink-900: #0B1020;
  --ink-700: #1B2540;
  --ink-600: #2A3550;
  --ink-500: #3A4A74;
  --slate-600: #4A5468;
  --slate-300: #B8C1D6;
  --line-300: #CDD4E2;
  --line-200: #E3E8F1;
  --grid-line: #E1E6F0;
  --paper: #F7F8FB;
  --blue-500: #2447F5;
  --blue-600: #1B38D1;
  --blue-400: #5468B8;
  --blue-300: #C3CEF8;
  --blue-100: #E6EBFF;
  --hl-400: #FFE14D;
  --hl-300: #FFEC85;
  --hl-100: #FFF8D1;
  --success: #0F7B4F;
  --success-bg: #E4F5EC;
  --error: #C42B3A;
  --error-bg: #FDE8EA;

  --radius-sm: 8px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 18px;
  --radius-2xl: 24px;

  --shadow-sheet: 0 36px 60px -32px rgba(11, 16, 32, 0.4);
  --shadow-lift: 0 20px 40px -24px rgba(11, 16, 32, 0.3);
  --shadow-pop: 0 16px 40px -16px rgba(11, 16, 32, 0.35);
}

html { background: var(--paper); color: var(--ink-900); }
body { font-family: var(--font-inter), system-ui, sans-serif; line-height: 1.55; }

:focus-visible { outline: 2px solid var(--blue-500); outline-offset: 2px; }
.on-dark :focus-visible { outline-color: var(--hl-400); }

.hl {
  background: linear-gradient(transparent 56%, var(--hl-400) 56% 94%, transparent 94%);
  padding: 0 0.05em;
}

.bg-graph {
  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 32px 32px;
  -webkit-mask-image: linear-gradient(#000 55%, transparent);
          mask-image: linear-gradient(#000 55%, transparent);
}

.sheet {
  position: relative;
  background: #fff;
  border: 1px solid #D5DBE8;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sheet);
  padding: 26px 26px 30px 44px;
}
.sheet::before { /* margin line */
  content: ""; position: absolute; left: 32px; top: 0; bottom: 0;
  width: 1px; background: var(--blue-300);
}

.label-mono {
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 12px; line-height: 16px; letter-spacing: 0.07em;
  text-transform: uppercase; font-weight: 500;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

### 8.2 Fonts (`app/layout.tsx`)

```tsx
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["600", "800"], variable: "--font-display", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500"], variable: "--font-mono", display: "swap" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

### 8.3 Tailwind config (`tailwind.config.ts`)

```ts
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 900: "#0B1020", 700: "#1B2540", 600: "#2A3550", 500: "#3A4A74" },
        slate: { 600: "#4A5468", 300: "#B8C1D6" },
        line: { 300: "#CDD4E2", 200: "#E3E8F1" },
        paper: "#F7F8FB",
        brand: { 600: "#1B38D1", 500: "#2447F5", 400: "#5468B8", 300: "#C3CEF8", 100: "#E6EBFF" },
        hl: { 400: "#FFE14D", 300: "#FFEC85", 100: "#FFF8D1" },
        success: { DEFAULT: "#0F7B4F", bg: "#E4F5EC" },
        danger: { DEFAULT: "#C42B3A", bg: "#FDE8EA" },
      },
      fontFamily: {
        display: ["var(--font-display)", "var(--font-inter)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SF Mono", "monospace"],
      },
      borderRadius: { sm: "8px", md: "10px", lg: "14px", xl: "18px", "2xl": "24px" },
      boxShadow: {
        sheet: "0 36px 60px -32px rgba(11,16,32,.4)",
        lift: "0 20px 40px -24px rgba(11,16,32,.3)",
        pop: "0 16px 40px -16px rgba(11,16,32,.35)",
      },
      fontSize: {
        "display-xl": ["clamp(44px, 6vw, 72px)", { lineHeight: "1.03", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(38px, 4.6vw, 56px)", { lineHeight: "1.04", letterSpacing: "-0.03em" }],
        h2: ["clamp(32px, 4vw, 48px)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        h3: ["clamp(22px, 2.4vw, 28px)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
      },
      maxWidth: { container: "1200px", reading: "680px" },
    },
  },
} satisfies Config;
```

(Tailwind v4: move the same values into an `@theme` block in your CSS.)

### 8.4 Component examples

**Button**

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-150 disabled:opacity-45 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
  {
    variants: {
      variant: {
        primary: "bg-brand-500 text-white hover:bg-brand-600",
        dark: "bg-ink-900 text-white hover:bg-ink-700",
        highlighter: "bg-hl-400 text-ink-900 hover:bg-hl-300",
        secondary: "bg-white text-ink-900 border-[1.5px] border-line-300 hover:border-ink-900",
        ghost: "bg-transparent text-ink-900 hover:bg-line-200",
        danger: "bg-danger text-white hover:opacity-90",
      },
      size: { md: "min-h-12 px-[22px] text-base", sm: "min-h-11 px-4 text-[15px]", lg: "min-h-14 px-7 text-[17px]" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);
export type ButtonProps = VariantProps<typeof button>;
export { button };
```

**University chip group**

```tsx
"use client";
const universities = ["MU", "SPPU", "NU", "AU", "DBATU", "SUK"] as const;

export function UniversityChips({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div role="radiogroup" aria-label="Your university" className="flex flex-wrap gap-2">
      {universities.map((u) => (
        <button
          key={u}
          role="radio"
          aria-checked={value === u}
          onClick={() => onChange(u)}
          className={`min-h-11 rounded-sm border px-3.5 text-sm font-semibold transition-colors ${
            value === u ? "bg-ink-900 border-ink-900 text-white" : "bg-white border-line-300 text-ink-900 hover:border-ink-900"
          }`}
        >
          {u}
        </button>
      ))}
    </div>
  );
}
```

**Note card**

```tsx
export function NoteCard({ note }: { note: Note }) {
  return (
    <a href={`/notes/${note.slug}`} className="group block rounded-lg border border-[#D9DFEB] bg-white transition duration-200 hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg bg-paper">
        <img src={note.thumbUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
        <span className="label-mono absolute left-3 top-3 rounded-[6px] bg-ink-900 px-2 py-1 text-white">{note.official ? "Official" : "PDF"}</span>
      </div>
      <div className="p-5">
        <p className="label-mono text-slate-600">{note.university} · Sem {note.semester} · {note.branchShort}</p>
        <h3 className="mt-2 font-display text-[20px] font-extrabold leading-tight tracking-tight line-clamp-2">{note.title}</h3>
        <p className="mt-2 text-sm text-slate-600 tabular-nums">{note.pages} pages · {note.downloads.toLocaleString("en-IN")} downloads</p>
        <div className="mt-4 flex items-center justify-between">
          {!note.official && <span className="text-sm font-medium">@{note.author}</span>}
          <span className={`label-mono rounded-[6px] px-2 py-1 ${note.price === 0 ? "bg-hl-100 text-ink-900" : "bg-ink-900 text-white"}`}>
            {note.price === 0 ? "Free" : `₹${note.price}`}
          </span>
        </div>
      </div>
    </a>
  );
}
```

### 8.5 Suggested folder structure

```
app/
  (marketing)/page.tsx            # Home
  (marketing)/about/page.tsx
  (marketing)/contribute/page.tsx
  (marketing)/projects/page.tsx
  (marketing)/careers/page.tsx
  (marketing)/contact/page.tsx
  (legal)/privacy-policy/page.tsx ...
  notes/page.tsx
  notes/[slug]/page.tsx
  community-notes/page.tsx
  community-notes/[slug]/page.tsx
  discussions/page.tsx
  discussions/[id]/page.tsx
  articles/page.tsx
  articles/[slug]/page.tsx
  u/[username]/page.tsx
  dashboard/(overview|notes|upload|earnings|payouts)/page.tsx
  account/page.tsx
  admin/...
  login/page.tsx
  not-found.tsx
components/
  ui/            # Button, Chip, Tag, Input, Select, Tabs, Accordion, Modal, Toast, Skeleton
  brand/         # Logo, Sheet, HighlightText, GraphBackground
  notes/         # NoteCard, PreviewViewer, PurchaseCard, FilterBar, UniversityChips
  contributor/   # TierBadge, TierStaircase, EarningsCalculator, UploadWizard
  layout/        # Header, Footer, MobileMenu, Section
styles/tokens.css  # the :root variables above (shared with the mobile app via a tokens.json export)
```

### 8.6 Mobile app parity (React Native)

Export the tokens to a shared `tokens.json` (colors, radii, spacing, type scale) and consume the same file in both apps. Differences on mobile: bottom tab bar replaces the top nav, note sheets use `elevation` instead of CSS shadows, mono labels use JetBrains Mono at 11 to 12px, and haptic feedback on unlock success.

### 8.7 Performance budget

- LCP image/text under 2.5s on a mid-range phone over 4G. Hero sheets are CSS/SVG, not images.
- Use `next/image` for thumbnails with fixed aspect ratios; lazy-load below the fold.
- Load PDF previews page by page (pages 1 to 3 only for locked notes) and never ship the full PDF to the browser before purchase.
- Keep total JS for marketing pages under 150 KB gzipped; load the calculator and wizard code on demand.

---

## 9. Do and don't

**Do**
- Highlight 2 to 4 words per heading, once.
- Use mono labels for metadata, and sans for anything people read.
- Put the university/branch/semester path in reach on every listing page.
- Show real previews, real prices, real counts.
- Keep one primary button per view.

**Don't**
- Don't fill sections with icon-in-circle cards or generic gradients.
- Don't use more than one yellow block per screen.
- Don't rotate or tilt anything interactive.
- Don't use emoji, stock photos, or fabricated stats.
- Don't use shadows to separate ordinary cards.
- Don't put blue text on dark backgrounds or gray text on yellow.
- Don't hide pricing or the refund policy until checkout.

---

## 10. Open decisions for the team

1. Final accent: keep `#2447F5` or test a deeper `#1B38D1` for small text on tinted backgrounds.
2. Dark mode timing (suggested after the mobile app launches).
3. Whether Discussions allow image attachments in v1.
4. Whether Careers shows volunteer roles in v1 or ships as the empty state.
5. Whether payouts stay manual (admin marks paid) or move to an automated UPI payout provider later.