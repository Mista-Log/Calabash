# Calabash Material 3 Implementation Plan

## Product Vision
**Calabash** is a university Learning & Knowledge Management System that bridges traditional academic archives with modern, always-on learning. It serves students and lecturers with role-specific dashboards and features.

---

## Design System Principles

### Material 3 Expressive Design
- **Use ONLY established M3 components** from `@/components/core/md-*`
- **No custom Tailwind styling** - use M3 tokens: `var(--md-sys-color-*)`, `var(--md-sys-typescale-*)`
- **Proper component hierarchy**: Cards, Lists, Chips, Badges as per M3 spec
- **Consistent spacing**: Use M3 layout grid (4px base unit)
- **Motion**: Use M3 motion tokens (`--md-sys-motion-duration-*`)

### Layout Standards
- **Navigation Rail**: 88px collapsed, 360px expanded (desktop)
- **Navigation Bar**: Bottom bar for mobile
- **Toolbar**: Top app bar with search, gamification, user menu
- **Content padding**: `px-3 py-5 sm:px-5 sm:py-7 lg:px-7 lg:py-9`
- **Max content width**: `max-w-[1360px]` centered

---

## Current State Assessment

### ✅ Implemented & Working
1. **Authentication Flow**
   - `/auth` - Role selection
   - `/auth/login/student` & `/auth/login/lecturer`
   - `/auth/student` & `/auth/lecturer` - Signup

2. **Student Dashboard** (`/dashboard`)
   - Focus course card
   - Deadlines section
   - Recent materials
   - Gamification (XP, streaks)

3. **Lecturer Dashboard** (`/dashboard`)
   - Content health metrics
   - Action hub
   - Performance analytics preview

4. **Course Management**
   - `/courses` - Course list
   - `/courses/[id]` - Course detail (student view)
   - `/courses/add` - Course creation wizard (lecturer)

5. **Library/Materials**
   - `/library` - Material catalog with filters
   - `/library/[id]` - Material viewer (PDF/video)

6. **Settings** - Profile, Account, Privacy, Preferences
7. **Support** - Help center with categories
8. **Calendar** - Academic calendar
9. **Notes** - Personal notes (UI only)
10. **Exams** - Assessment tracking (UI only)
11. **Analytics** - Lecturer performance analytics

### ⚠️ Needs Backend Integration
- Notes CRUD operations
- Exams real data
- Support live chat
- All API calls currently use mock data

### ❌ Missing/Incomplete
1. **Forgot Password flows** - Routes exist but empty
2. **Email verification** - Not implemented
3. **Course Q&A** - Referenced but not built
4. **Announcements** - Referenced but not built
5. **Student roster view** (lecturer) - Partial
6. **Material batch operations** - Partial

---

## Implementation Phases

### Phase 1: Layout & Navigation Refinement (CURRENT)
**Goal**: Ensure all screens use proper M3 layout with navigation

#### Tasks:
- [x] Fix Navigation Rail with filled/outlined icons
- [x] Add user dropdown menu to Toolbar
- [x] Fix search bar conflicts
- [ ] Add breadcrumbs to all pages
- [ ] Ensure consistent padding across all screens
- [ ] Add loading skeletons for all pages

#### Components Needed:
```typescript
import { MdBreadcrumb } from '@/components/core/md-breadcrumb'; // Create
import { MdSkeleton } from '@/components/core/md-skeleton'; // Create
```

---

### Phase 2: Student Dashboard Enhancement
**Goal**: Create comprehensive student experience

#### 2.1 Dashboard Widgets
**File**: `src/components/features/dashboard/StudentDashboard.tsx`

**Current**: Basic cards with deadlines and recent materials

**Enhanced Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│  Welcome back, [Name]!                          [Gamification] │
│  [Level 5] • [XP 2,450/3,000] • [Streak 🔥 12]              │
├─────────────────┬─────────────────┬─────────────────────────┤
│  Focus Course   │  Today's Tasks  │  Quick Stats            │
│  [Course Card]  │  [Task List]    │  - Materials Viewed     │
│  Progress: 65%  │  - 3 Deadlines  │  - Notes Created        │
│  [Continue →]   │  - 1 Exam       │  - Current Streak       │
├─────────────────┴─────────────────┴─────────────────────────┤
│  Recent Materials                                            │
│  [Material Card] [Material Card] [Material Card]            │
├─────────────────────────────────────────────────────────────┤
│  Upcoming Deadlines                                          │
│  [Deadline Chip] [Deadline Chip] [Deadline Chip]            │
└─────────────────────────────────────────────────────────────┘
```

**M3 Components to Use**:
- `MdCard` for focus course
- `MdList` / `MdListItem` for tasks
- `MdChip` for deadlines
- `MdLinearProgress` for course progress
- `MdBadge` for notifications

#### 2.2 Course Detail Page Enhancement
**File**: `src/components/features/courses/StudentCourseView.tsx`

**Tabs Structure**:
```typescript
const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'modules', label: 'Modules' },
  { id: 'materials', label: 'Materials' },
  { id: 'notes', label: 'My Notes' },
  { id: 'qa', label: 'Q&A' }, // TODO: Implement
];
```

**Sections to Add**:
- [ ] **Q&A Tab**: Use `MdList` with questions, upvote buttons
- [ ] **Announcements**: Use `MdCard` with pinned styling
- [ ] **Course Progress**: Use `MdCircularProgress` with percentage

---

### Phase 3: Lecturer Dashboard Enhancement
**Goal**: Create comprehensive lecturer command center

#### 3.1 Dashboard Widgets
**File**: `src/components/features/dashboard/LecturerDashboard.tsx`

**Enhanced Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│  Faculty Dashboard                              [Quick Actions] │
│  [Create Course] [Upload Material] [View Analytics]          │
├─────────────────┬─────────────────┬─────────────────────────┤
│  Content Health │  Engagement     │  Quick Stats            │
│  - 24 Materials │  - 1,245 Views  │  - Total Courses        │
│  - 18 Published │  - 342 Downloads│  - Total Students       │
│  - 6 Drafts     │  - 4.8★ Rating  │  - Avg. Performance     │
├─────────────────┴─────────────────┴─────────────────────────┤
│  Recent Activity                                             │
│  [Activity Timeline with MdList]                            │
├─────────────────────────────────────────────────────────────┤
│  Top Performing Materials                                    │
│  [Material Card] [Material Card] [Material Card]            │
└─────────────────────────────────────────────────────────────┘
```

#### 3.2 Course Management Enhancement
**File**: `src/components/features/courses/LecturerCourseView.tsx`

**Tabs Structure**:
```typescript
const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'modules', label: 'Modules' },
  { id: 'materials', label: 'Materials' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'students', label: 'Students' }, // TODO: Implement
];
```

**Sections to Add**:
- [ ] **Student Roster**: Use `MdList` with student cards, engagement metrics
- [ ] **Material Analytics**: Use `MdCard` with view/download stats
- [ ] **Bulk Operations**: Use `MdCheckbox` for selection, `MdChip` for actions

---

### Phase 4: Missing Screens Implementation

#### 4.1 Forgot Password Flow
**Files**: 
- `/auth/login/student/forgot-password/page.tsx`
- `/auth/login/lecturer/forgot-password/page.tsx`

**Layout**:
```tsx
<MdCard className="max-w-md mx-auto">
  <MdIcon>lock_reset</MdIcon>
  <h2>Reset Password</h2>
  <MdTextField label="Email" type="email" fullWidth />
  <MdFilledButton fullWidth>Send Reset Link</MdFilledButton>
</MdCard>
```

#### 4.2 Notes Full Implementation
**File**: `src/components/features/notes/NotesView.tsx`

**Features to Add**:
- [ ] Rich text editor (Tiptap integration exists)
- [ ] Link notes to courses/materials
- [ ] Search and filter notes
- [ ] CRUD operations with backend

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│  My Notes                              [+ New Note]          │
├──────────────┬──────────────────────────────────────────────┤
│  Filters     │  Notes Grid                                  │
│  - Course    │  [Note Card] [Note Card] [Note Card]        │
│  - Date      │  [Note Card] [Note Card] [Note Card]        │
│  - Tag       │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

#### 4.3 Exams Full Implementation
**File**: `src/components/features/exams/ExamsView.tsx`

**Features to Add**:
- [ ] Exam schedule calendar
- [ ] Past questions browser
- [ ] Results view with grades
- [ ] Exam reminders

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│  Exams & Assessments                                         │
├─────────────────┬───────────────────────────────────────────┤
│  Upcoming       │  Past Results                             │
│  [Exam Card]    │  [Result Card] [Result Card]              │
│  [Exam Card]    │  [Result Card] [Result Card]              │
├─────────────────┼───────────────────────────────────────────┤
│  Past Questions  │                                           │
│  [Browse by Course] [Browse by Year]                        │
└─────────────────┴───────────────────────────────────────────┘
```

#### 4.4 Student Roster (Lecturer)
**File**: `src/components/features/courses/StudentRoster.tsx`

**Features**:
- [ ] List of enrolled students
- [ ] Engagement metrics (views, downloads)
- [ ] Performance indicators
- [ ] Email contact

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│  Students - [Course Name]                          [Export]  │
├─────────────────────────────────────────────────────────────┤
│  [Search Student...]                                         │
├─────────────────────────────────────────────────────────────┤
│  [Student Row]                                               │
│  [Avatar] [Name] [Email] [Views] [Downloads] [Last Active]  │
│  [Student Row]                                               │
└─────────────────────────────────────────────────────────────┘
```

---

### Phase 5: Shared Components Enhancement

#### 5.1 Create Missing M3 Components

**MdBreadcrumb** (`src/components/core/md-breadcrumb.tsx`):
```typescript
export function MdBreadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={item.href || item.label}>
          {index > 0 && <MdIcon>chevron_right</MdIcon>}
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span className="current">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
```

**MdSkeleton** (`src/components/core/md-skeleton.tsx`):
```typescript
export function MdSkeleton({ variant = 'rectangular', width, height }: SkeletonProps) {
  return (
    <div 
      className="md-skeleton"
      style={{ width, height }}
    />
  );
}
```

**CSS in globals.css**:
```css
.md-skeleton {
  background: linear-gradient(
    90deg,
    var(--md-sys-color-surface-container-high) 0%,
    var(--md-sys-color-surface-container-highest) 50%,
    var(--md-sys-color-surface-container-high) 100%
  );
  background-size: 200% 100%;
  animation: md-skeleton-loading 1.5s infinite;
  border-radius: var(--md-sys-shape-corner-medium);
}

@keyframes md-skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

### Phase 6: Responsive Design Audit

Ensure all screens work on:
- **Desktop** (≥1024px): Navigation rail visible, full layout
- **Tablet** (768px - 1023px): Navigation rail collapsed or hidden
- **Mobile** (≤767px): Bottom navigation bar, hamburger menu

**Breakpoint Utilities**:
```css
/* Use Tailwind breakpoints with M3 tokens */
.hidden lg:block  /* Desktop only */
lg:hidden          /* Mobile/Tablet only */
md:hidden          /* Mobile only */
```

---

## Component Usage Guidelines

### ✅ DO - Use M3 Components
```tsx
// Good
<MdFilledButton onClick={handleSave}>Save</MdFilledButton>
<MdCard className="p-6">Content</MdCard>
<MdTextField label="Email" fullWidth />
```

### ❌ DON'T - Use Custom Styling
```tsx
// Bad - Don't do this
<button className="bg-primary text-white px-4 py-2 rounded-lg">Save</button>
<div className="bg-white shadow-lg rounded-xl p-6">Content</div>
<input className="border border-gray-300 rounded-lg px-4 py-2" />
```

### ✅ DO - Use M3 Tokens
```tsx
// Good
<div style={{ color: 'var(--md-sys-color-on-surface)' }}>
<div className="bg-[color:var(--md-sys-color-surface-container)]">
```

### ❌ DON'T - Use Arbitrary Colors
```tsx
// Bad
<div className="text-gray-900">
<div className="bg-white">
```

---

## File Organization

### Feature-Based Structure
```
src/components/features/
├── dashboard/
│   ├── StudentDashboard.tsx
│   ├── LecturerDashboard.tsx
│   └── components/
│       ├── FocusCourseCard.tsx
│       ├── DeadlinesList.tsx
│       └── GamificationStats.tsx
├── courses/
│   ├── StudentCourseView.tsx
│   ├── LecturerCourseView.tsx
│   └── components/
│       ├── CourseCard.tsx
│       ├── ModuleList.tsx
│       └── StudentRoster.tsx
├── library/
│   ├── MaterialCard.tsx
│   ├── MaterialViewer.tsx
│   └── components/
│       ├── MaterialFilters.tsx
│       └── MaterialPreview.tsx
├── notes/
│   ├── NotesView.tsx
│   └── components/
│       ├── NoteCard.tsx
│       └── NoteEditor.tsx
└── exams/
    ├── ExamsView.tsx
    └── components/
        ├── ExamCard.tsx
        └── ResultsTable.tsx
```

---

## Success Metrics

### Layout Quality
- [ ] All pages use consistent padding
- [ ] Navigation rail/bar on all authenticated pages
- [ ] Toolbar with proper search and user menu
- [ ] Breadcrumbs on all nested pages

### Component Usage
- [ ] 100% M3 components (no custom Tailwind buttons/cards)
- [ ] All colors use M3 tokens
- [ ] All typography uses M3 typescale
- [ ] All motion uses M3 motion tokens

### Responsiveness
- [ ] Desktop (≥1024px): Full layout with expanded rail
- [ ] Tablet (768-1023px): Collapsed rail or bottom bar
- [ ] Mobile (≤767px): Bottom navigation bar

### Accessibility
- [ ] All interactive elements have aria-labels
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Focus states on all buttons/inputs
- [ ] Keyboard navigation works

---

## Next Immediate Actions

1. **Add breadcrumbs to all pages** - Create `MdBreadcrumb` component
2. **Add loading skeletons** - Create `MdSkeleton` component
3. **Enhance Student Dashboard** - Add gamification widgets
4. **Enhance Lecturer Dashboard** - Add content health metrics
5. **Implement Q&A tab** - For course detail pages
6. **Implement Student Roster** - For lecturer course view
7. **Complete forgot password flows** - Both student and lecturer
8. **Backend integration** - Connect real API endpoints

---

## Design Review Checklist

Before marking any screen as complete:
- [ ] Uses only M3 components from `@/components/core/md-*`
- [ ] Uses M3 color tokens (`var(--md-sys-color-*)`)
- [ ] Uses M3 typography tokens (`m3-title-large`, etc.)
- [ ] Has proper navigation (rail or bar)
- [ ] Has toolbar with search (if applicable)
- [ ] Has breadcrumbs for nested pages
- [ ] Has loading state with skeletons
- [ ] Has error state handling
- [ ] Responsive on all breakpoints
- [ ] Accessible (aria-labels, keyboard nav)
