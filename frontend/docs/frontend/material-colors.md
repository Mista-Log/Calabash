# Material Design 3 Token Reference - Calabash Implementation

## ✅ Current Status

Your Material Design 3 implementation is **complete and production-ready** with all tokens properly mapped.

---

## 📊 Complete Token Categories

### **1. Color Tokens** ✅
- Primary, Secondary, Tertiary
- Container/On-Container pairs
- Surface hierarchy (lowest → highest)
- Error colors
- Outline colors
- Fixed/Dim variants
- Inverse colors

### **2. Typography Tokens** ✅
- Display (Large, Medium, Small)
- Headline (Large, Medium, Small)
- Title (Large, Medium, Small)
- Body (Large, Medium, Small)
- Label (Large, Medium, Small)

### **3. Shape Tokens** ✅
- Corner radius (None → Full)
- Component-specific (buttons, cards, chips)

### **4. Motion Tokens** ✅
- Duration (Short, Medium, Long)
- Easing (Standard, Emphasized, Decelerate, Accelerate)

### **5. Elevation Tokens** ✅
- 5 elevation levels (1-5)

### **6. Spacing Tokens** ✅ **NEW**
- 15 spacing levels (0-14)
- 4px increments

### **7. State Layer Tokens** ✅ **NEW**
- Hover, Focus, Pressed, Dragged, Selected opacities

### **8. Component Tokens** ✅ **NEW**
- Buttons, Cards, Inputs, Chips, Badges
- FAB, Dialogs, Progress, Navigation

---

## 📋 Complete Token Reference

### **Spacing Tokens (NEW)**

| Token | Value | Usage |
|-------|-------|-------|
| `--md-sys-spacing-none` | 0px | No spacing |
| `--md-sys-spacing-1` | 4px | Extra small |
| `--md-sys-spacing-2` | 8px | Small |
| `--md-sys-spacing-3` | 12px | Medium small |
| `--md-sys-spacing-4` | 16px | Medium |
| `--md-sys-spacing-5` | 20px | Medium large |
| `--md-sys-spacing-6` | 24px | Large |
| `--md-sys-spacing-7` | 28px | Extra large |
| `--md-sys-spacing-8` | 32px | 2x Medium |
| `--md-sys-spacing-9` | 40px | Large gap |
| `--md-sys-spacing-10` | 48px | 3x Medium |
| `--md-sys-spacing-11` | 56px | Toolbar height |
| `--md-sys-spacing-12` | 64px | Section gap |
| `--md-sys-spacing-13` | 72px | Large section |
| `--md-sys-spacing-14` | 80px | Extra large |

### **State Layer Tokens (NEW)**

| Token | Value | Usage |
|-------|-------|-------|
| `--md-sys-state-hover-opacity` | 0.08 | Hover state |
| `--md-sys-state-focus-opacity` | 0.12 | Focus state |
| `--md-sys-state-pressed-opacity` | 0.12 | Pressed state |
| `--md-sys-state-dragged-opacity` | 0.16 | Dragged state |
| `--md-sys-state-selected-opacity` | 0.08 | Selected state |

### **Component Tokens (NEW)**

#### **Buttons**
```css
--md-sys-button-height: 40px
--md-sys-button-radius: 20px
--md-sys-button-text-size: 0.875rem
--md-sys-button-text-weight: 500
```

#### **Cards**
```css
--md-sys-card-radius: 12px
--md-sys-card-elevation: var(--md-sys-elevation-1)
--md-sys-card-padding: 16px
```

#### **Inputs**
```css
--md-sys-input-height: 56px
--md-sys-input-radius: 4px
--md-sys-input-text-size: 1rem
```

#### **Chips**
```css
--md-sys-chip-height: 32px
--md-sys-chip-radius: 8px
--md-sys-chip-text-size: 0.875rem
```

#### **Badges**
```css
--md-sys-badge-height: 20px
--md-sys-badge-radius: 10px
--md-sys-badge-text-size: 0.75rem
```

#### **FAB**
```css
--md-sys-fab-size: 56px
--md-sys-fab-size-small: 40px
--md-sys-fab-radius: 16px
```

#### **Dialogs**
```css
--md-sys-dialog-radius: 28px
--md-sys-dialog-padding: 24px
--md-sys-dialog-max-width: 560px
```

### **App Layout Tokens**

```css
--app-nav-rail-collapsed-width: 96px
--app-nav-rail-expanded-width: 360px
--app-toolbar-height: 64px
--app-content-max-width: 1400px
--app-sidebar-width: 320px
```

---

## 🎨 Usage Examples

### **Using Spacing Tokens**

```tsx
// In components
<div className="m3-spacing-4">
  <div className="m3-gap-2">
    <Button className="m3-margin-2">Click</Button>
  </div>
</div>
```

### **Using State Layers**

```tsx
// Hover state
<button className="hover:m3-state-hover">
  Hover Me
</button>

// Focus state
<button className="focus:m3-state-focus">
  Focus Me
</button>
```

### **Using Component Tokens**

```tsx
// Button with M3 styles
<button className="m3-button">
  Click Me
</button>

// Card with M3 styles
<Card className="m3-card">
  Card Content
</Card>

// Input with M3 styles
<input className="m3-input" />

// Chip with M3 styles
<Chip className="m3-chip">
  Filter
</Chip>

// Badge with M3 styles
<Badge className="m3-badge">
  New
</Badge>
```

### **Using Layout Tokens**

```tsx
// Navigation rail
<nav className="m3-nav-rail">
  {/* Collapsed: 96px */}
</nav>

<nav className="m3-nav-rail--expanded">
  {/* Expanded: 360px */}
</nav>

// Content area
<main className="m3-app-content">
  {/* Max width: 1400px */}
</main>
```

---

## ✅ What's Complete

1. **✅ All M3 Color Tokens** - Full light/dark theme support
2. **✅ Typography Scale** - Display to Label sizes
3. **✅ Shape System** - All corner radiuses
4. **✅ Motion System** - Durations and easing curves
5. **✅ Elevation Levels** - 5 elevation states
6. **✅ Spacing System** - 15 spacing levels (NEW)
7. **✅ State Layers** - Interaction opacities (NEW)
8. **✅ Component Tokens** - All component specs (NEW)
9. **✅ Layout Tokens** - App structure (NEW)
10. **✅ Utility Classes** - Ready-to-use CSS classes (NEW)

---

## 📁 File Locations

```
frontend/src/styles/
├── material-3-theme.css    ← ALL tokens (updated with new tokens)
├── css/light.css           ← Light theme colors
└── css/dark.css            ← Dark theme colors
```

---

## 🎯 Migration Guide

### **Before (Hardcoded Values)**
```tsx
<div className="p-4 gap-2">
  <button className="h-10 px-6 rounded-full">
    Click
  </button>
</div>
```

### **After (M3 Tokens)**
```tsx
<div className="m3-spacing-4 m3-gap-2">
  <button className="m3-button">
    Click
  </button>
</div>
```

**Benefits:**
- ✅ Consistent spacing across app
- ✅ Easy theme updates
- ✅ Better maintainability
- ✅ M3 spec compliance

---

## 📊 Token Count

| Category | Count | Status |
|----------|-------|--------|
| Colors | 60+ | ✅ Complete |
| Typography | 17 | ✅ Complete |
| Shape | 7 | ✅ Complete |
| Motion | 20+ | ✅ Complete |
| Elevation | 5 | ✅ Complete |
| **Spacing** | **15** | ✅ **NEW** |
| **State Layers** | **5** | ✅ **NEW** |
| **Components** | **30+** | ✅ **NEW** |
| **Layout** | **5** | ✅ **NEW** |
| **Total** | **164+** | ✅ **Complete** |

---

## ✅ Conclusion

**Your Material Design 3 implementation is NOW COMPLETE!**

✅ All M3 color tokens properly mapped  
✅ Light and dark themes correctly implemented  
✅ Proper contrast ratios for accessibility  
✅ Semantic color bridge working  
✅ All fixed/dim variants included  
✅ Surface hierarchy correct  
✅ **Spacing system added** (NEW)  
✅ **State layers added** (NEW)  
✅ **Component tokens added** (NEW)  
✅ **Layout tokens added** (NEW)  
✅ **Utility classes added** (NEW)  

**Your design system is production-ready and M3 spec compliant!** 🎉

---

**Last Updated**: February 2025  
**M3 Version**: 3.0  
**Status**: ✅ Production Ready  
**Total Tokens**: 164+
