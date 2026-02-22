# Calabash Frontend Remaining Implementation Plan

Date: 2026-02-19  
Scope: full remaining stabilization pass after app-shell + Material ESM migration.

## 1. Scan Summary (Current State)

1. Build status:
- `npm run build` passes.
- Route generation succeeds for top-level pages and dynamic routes.

2. Lint status:
- `npm run lint` fails with `140 errors` and `15 warnings`.
- Main error clusters:
  - `no-unused-vars`
  - `no-explicit-any`
  - `react-hooks/refs` and `react-hooks/purity`
  - `react-hooks/exhaustive-deps`
  - `no-console`

3. Material runtime:
- Material ESM runtime imports are centralized in `src/lib/material-web.ts`.
- No `esm.sh` runtime imports remain in `src`.

4. Theming:
- `src/app/globals.css` imports `src/styles/css/light.css` and `src/styles/css/dark.css`.
- Token source is mostly correct, but many feature pages still use non-token utility colors and shadow-heavy styling.

5. Nav/shell:
- Shared app shell is in place (`src/app/(app-shell)/layout.tsx` + `MainLayout`).
- Remaining issues are behavioral polish: active-state consistency, hover feedback, refresh stability, and `md-nav-rail` update warning tuning.

6. Mock/store behavior:
- Dashboard repository is mock-first unless `NEXT_PUBLIC_ENABLE_REAL_DASHBOARD_API === "true"`.
- API service still contains dashboard fallback + warning path, which can still emit 404/fallback noise in some flows.

7. Type declaration duplication:
- Material web JSX declarations exist in 3 places:
  - `src/material-web.d.ts`
  - `src/types/material-web.d.ts`
  - `src/types/global.d.ts`
- These should be consolidated into one canonical declaration file.

8. Route/link integrity:
- Some in-app links point to pages that do not exist (`/profile`, `/privacy`, `/terms`, `/cookies`).

## 2. Execution Priorities

1. Stabilize runtime behavior first (mock-data reliability + nav consistency).
2. Enforce Material token styling consistency (remove remaining hardcoded colors/shadows).
3. Clean lint/type baseline in focused batches until `npm run lint` is green.

## 3. Phase Plan

## Phase A: Mock-First Runtime Stabilization

Goal: no dashboard 404 noise, predictable mock data display, stable role hydration.

1. Dashboard data source hardening
- File: `src/services/dashboard.repository.ts`
- Keep mock-first behavior as default.
- Add explicit fallback mode enum (`mock-only`, `api-with-fallback`) for clarity.

2. Remove duplicate dashboard fallback responsibilities
- File: `src/services/api.ts`
- Stop dashboard fallback logic here (or gate it behind explicit opt-in).
- Repository should remain the single fallback authority.

3. Mock bootstrap behavior
- Files:
  - `src/store/useUserStore.ts`
  - `src/app/(app-shell)/dashboard/page.tsx`
- Add deterministic mock-user bootstrap in dev/test mode if user is missing (or clear empty-state contract with role switch CTA).
- Prevent transient undefined profile reads during hydration.

4. Mock data schema hardening
- File: `src/store/useMockDataStore.ts`
- Replace broad `any` fields for lecturer analytics arrays with typed interfaces.
- Validate and normalize semester/course matching in one helper path.

Acceptance for Phase A:
- No repeated `/dashboard` 404 logs during normal mock-mode usage.
- Dashboard reliably renders mock data after auth/hydration.
- No undefined-profile runtime errors in dashboard header/content.

## Phase B: Nav Rail + Shell Behavior Cleanup

Goal: static shell feel, correct active tab, and proper Material hover/active behavior.

1. Rail active-state synchronization
- File: `src/components/layout/NavigationRail.tsx`
- Keep `pathname` matching logic as source of truth.
- Update only `rail.activeIndex` (remove redundant attribute mutation if not needed).
- Ensure active index updates only when value changes.

2. Nav bar parity
- File: `src/components/layout/NavBar.tsx`
- Mirror the same active-index update pattern as rail.

3. Hydration flicker/jump reduction
- Files:
  - `src/components/layout/MainLayout.tsx`
  - `src/components/layout/Toolbar.tsx`
  - `src/contexts/MaterialUIContext.tsx`
- Keep fixed offsets (`96/220`) and remove any remaining post-hydration layout jitter paths.

4. Hover/active visual state tuning
- File: `src/app/globals.css`
- Keep token-based nav item vars only.
- Remove conflicting overrides that suppress expected `md-nav-item` interaction feedback.

Acceptance for Phase B:
- Refreshing `/library` keeps Library active.
- Desktop rail hover feedback is visible.
- No rail/header overlap or jump on first paint.
- `md-nav-rail` redundant-update warnings are eliminated or reduced to non-repeating edge cases.

## Phase C: Material Token Compliance Pass (Cards/Surfaces)

Goal: remove non-token visual drift and shadow-heavy patterns.

1. Remove hardcoded accent colors and non-token classes from course/library feature set
- Primary files:
  - `src/components/features/courses/DigitalLibrary.tsx`
  - `src/components/features/courses/LecturerCourseView.tsx`
  - `src/components/features/courses/ModuleEditor.tsx`
  - `src/components/features/courses/CourseAnalytics.tsx`
  - `src/components/features/courses/CourseAnnouncements.tsx`
  - `src/components/features/courses/CourseNotes.tsx`
  - `src/components/features/courses/CourseQA.tsx`
  - `src/components/features/courses/StudentCourseView.tsx`
  - `src/components/features/courses/StudentRoster.tsx`

2. Remove excessive shadows from cards/modals/surfaces
- Primary files:
  - `src/components/features/library/MaterialCard.tsx`
  - `src/components/features/library/DocumentViewer.tsx`
  - `src/components/features/library/EditMaterialModal.tsx`
  - `src/components/features/calendar/EventModal.tsx`
  - `src/components/layout/Toolbar.tsx` (menu container)
  - `src/app/globals.css` (utility blocks using heavy shadows)

3. Keep Material semantics
- Use only token roles:
  - `primary/on-primary`
  - `primary-container/on-primary-container`
  - `secondary-container/on-secondary-container`
  - `surface-container*` + `on-surface*`
  - `error/on-error` for destructive/error states

Acceptance for Phase C:
- No hardcoded hex color styles in app-shell routes/features except truly external media contexts.
- No `shadow-xl` / `shadow-2xl` on dashboard/library/course cards.
- Visual hierarchy relies on surface/container + outline, not deep shadow.

## Phase D: Lint + Type Baseline Recovery

Goal: clean `npm run lint` and keep build green.

1. Consolidate custom-element typings
- Keep one declaration file only:
  - preferred: `src/types/material-web.d.ts`
- Remove duplicates:
  - `src/material-web.d.ts`
  - `src/types/global.d.ts` (or keep only non-material global declarations if needed)

2. Remove triple-slash type refs
- File: `src/components/core/m3-button.tsx`
- Replace with module import-based typing only.

3. Eliminate `any` in core Material wrappers
- Primary files:
  - `src/components/core/md-button.tsx`
  - `src/components/core/md-checkbox.tsx`
  - `src/components/core/md-chip.tsx`
  - `src/components/core/md-divider.tsx`
  - `src/components/core/md-icon.tsx`
  - `src/components/core/md-progress.tsx`
  - `src/components/core/md-radio.tsx`
  - `src/components/core/md-slider.tsx`
  - `src/components/core/md-snackbar.tsx`
  - `src/components/core/md-switch.tsx`
  - `src/components/core/md-text-field.tsx`
  - `src/components/core/md-menu.tsx`

4. Fix React hook/lifecycle lint errors
- Remove ref usage patterns flagged by `react-hooks/refs`.
- Fix missing dependency arrays flagged by `react-hooks/exhaustive-deps`.
- Replace impure render-time patterns (`Math.random`) in stateful helpers.

5. Sweep unused imports/vars and console policy
- High-volume cleanup across auth/core/features/services files.
- Keep only `console.warn/error` where intentionally needed.

Acceptance for Phase D:
- `npm run lint` passes with zero errors.
- `npm run build` remains green.

## Phase E: Route Integrity and IA Consistency

Goal: remove dead links and isolated navigation paths.

1. Fix or remove links to non-existent routes
- Files:
  - `src/components/layout/Toolbar.tsx` (`/profile`)
  - `src/components/layout/MainLayout.tsx` footer links (`/privacy`, `/terms`, `/cookies`) if footer is ever re-enabled.

2. Maintain nav parity across rail and mobile nav bar
- Ensure both use same role route model and no orphan top-level tabs.

Acceptance for Phase E:
- No top-level navigation link resolves to 404.
- Route discoverability is consistent on mobile and desktop.

## 4. Quality Gates

1. Static checks
- `cd frontend && npm run lint`
- `cd frontend && npm run build`

2. Runtime checks
- `cd frontend && npm run dev`
- Validate:
  - `/dashboard`, `/library`, `/courses`, `/notes`, `/calendar`, `/exams`, `/settings`, `/support`, `/upload`, `/analytics`
  - refresh active-tab correctness on `/library` and `/courses/[id]`
  - no repeated dashboard 404 fallback warnings in mock mode
  - no nav rail overlap/flicker during first paint

3. Theme checks
- Validate light/dark + system switching with tokenized surfaces and nav states.

## 5. Suggested Delivery Sequence

1. Complete Phase A + B together (runtime stability first).
2. Complete Phase C visual token cleanup for core user-visible pages.
3. Complete Phase D lint/type cleanup in batches (core wrappers first, then feature sweeps).
4. Finish with Phase E IA/link hygiene and final regression run.

