# 🎨 UI Design System - All Pages Updated

## Component Library

### 1. GlassCard Component
**Used for:** Main content cards, lists, sections
**Features:**
- Frosted glass effect (backdrop blur)
- Soft shadow
- Border with transparency
- Optional glow effect

**Example Usage:**
```jsx
<GlassCard glow>
  <div>Your content here</div>
</GlassCard>
```

---

### 2. GradientCard Component
**Used for:** Stats display, summary cards
**Features:**
- Colorful gradient backgrounds
- Icon support
- Title and value display
- Animation delay for staggered effect

**Example Usage:**
```jsx
<GradientCard 
  title="Total" 
  value={42} 
  icon="📋" 
  delay={0.1} 
/>
```

**Available Colors:**
- Blue (default)
- Purple
- Green
- Orange

---

### 3. AnimatedBadge Component
**Used for:** Percentages, status indicators
**Features:**
- Animated fill effect
- Gradient coloring
- Smooth animations

**Example Usage:**
```jsx
<AnimatedBadge percentage={85} label="Match" />
```

---

### 4. SkeletonLoader Component
**Used for:** Loading states
**Features:**
- Animated placeholder
- Configurable count
- Smooth shimmer effect

**Example Usage:**
```jsx
<SkeletonLoader count={4} />
```

---

## Color Palette

### Primary Colors:
```
Blue:       #3B82F6
Cyan:       #06B6D4
Purple:     #9333EA
Pink:       #EC4899
Green:      #10B981
Red:        #EF4444
Yellow:     #FBBF24
Orange:     #F97316
```

### Gradients Used:
```
Blue-Cyan:      from-blue-600 to-cyan-600
Purple-Pink:    from-purple-600 to-pink-600
Green-Emerald:  from-green-600 to-emerald-600
Orange-Red:     from-orange-600 to-red-600
Yellow-Orange:  from-yellow-600 to-orange-600
```

---

## Page-Specific Color Schemes

### Dashboard
- Primary: Blue-Purple gradient
- Accent: Green for positive stats
- Background: slate-50 → purple-50 → slate-100

### Jobs
- Primary: Blue-Purple gradient
- Accent: Green for match %
- Background: slate-50 → purple-50 → slate-100

### Applications
- Primary: Blue-Cyan gradient
- Accents:
  - Green for Shortlisted
  - Red for Rejected
  - Blue for Applied
- Background: slate-50 → blue-50 → slate-100

### Roadmaps
- Primary: Blue-Cyan gradient
- Accent: Purple for AI features
- Background: slate-50 → blue-50 → slate-100

### Recommendations
- Primary: Purple-Pink gradient
- Accent: Yellow for trending
- Background: slate-50 → purple-50 → slate-100

### Notifications
- Primary: Yellow-Orange gradient
- Accent: Green for read, Yellow for unread
- Background: slate-50 → yellow-50 → slate-100

### Profile
- Primary: Purple-Pink gradient
- Accents:
  - Green for skills
  - Blue for resume upload
- Background: slate-50 → purple-50 → slate-100

---

## Typography Scale

### Headings:
```
h1: text-5xl font-black text-gray-900
h2: text-2xl font-bold text-gray-900
h3: text-xl font-bold text-gray-900
```

### Body:
```
Body:     text-base text-gray-700
Label:    text-sm font-semibold text-gray-600
Small:    text-xs text-gray-500
```

---

## Icon Usage (Lucide)

### Navigation Icons:
- Dashboard: Home
- Jobs: Briefcase
- Applications: ClipboardList
- Roadmaps: MapMarkedAlt
- Recommendations: Zap
- Notifications: Bell
- Profile: User

### Action Icons:
- Edit: Edit2
- Save: Save
- Delete: X
- Apply: ArrowRight
- Upload: Upload
- Filter: Filter
- Search: Search

### Status Icons:
- Success: CheckCircle2
- Error: AlertCircle
- Warning: AlertTriangle
- Info: Info
- Loading: Loader

---

## Animation Patterns

### Page Entrance:
```jsx
initial={{ opacity: 0, y: -30 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3 }}
```

### Card Stagger:
```jsx
transition={{ delay: index * 0.05 }}
```

### Element Fade-in:
```jsx
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ delay: 0.2 }}
```

### Hover Effects:
```jsx
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

---

## Button Styles

### Primary Button (Active/CTA):
```
bg-gradient-to-r from-blue-600 to-cyan-600
text-white
px-4 py-3
rounded-lg
hover:shadow-lg
font-semibold
```

### Secondary Button:
```
bg-white
text-gray-700
border border-gray-200
px-4 py-2
rounded-lg
hover:border-blue-300
```

### Icon Button:
```
p-2
bg-blue-50
text-blue-600
rounded-lg
hover:bg-blue-100
```

### Danger Button:
```
bg-red-50
text-red-600
px-4 py-2
rounded-lg
hover:bg-red-100
```

---

## Form Elements

### Input Field:
```
px-4 py-2
border-2 border-gray-200
rounded-lg
focus:border-blue-500
focus:outline-none
transition
```

### Select Dropdown:
```
px-4 py-2
border-2 border-gray-200
rounded-lg
text-gray-700
focus:border-blue-500
focus:outline-none
```

### Textarea:
```
px-4 py-2
border-2 border-gray-200
rounded-lg
focus:border-blue-500
focus:outline-none
h-32
transition
```

---

## Badge Styles

### Status Badge (Shortlisted):
```
bg-green-50
text-green-700
border border-green-200
px-3 py-1
rounded-full
text-sm
font-semibold
```

### Status Badge (Rejected):
```
bg-red-50
text-red-700
border border-red-200
px-3 py-1
rounded-full
text-sm
font-semibold
```

### Status Badge (Applied):
```
bg-blue-50
text-blue-700
border border-blue-200
px-3 py-1
rounded-full
text-sm
font-semibold
```

---

## Responsive Breakpoints

```
Mobile:    < 640px   (single column)
Tablet:    640px-1023px (2 columns)
Desktop:   1024px+   (3+ columns)
```

### Grid Examples:
```jsx
// Stats Grid
grid-cols-1 sm:grid-cols-2 lg:grid-cols-4

// Profile Grid
grid-cols-1 lg:grid-cols-3

// Application Cards
space-y-4
```

---

## Empty States

### Template:
```jsx
<GlassCard glow>
  <div className="text-center py-12">
    <Icon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
    <p className="text-gray-600 text-lg font-semibold mb-2">
      No items found
    </p>
    <p className="text-gray-500">
      Helpful message here
    </p>
  </div>
</GlassCard>
```

---

## Loading States

### Template:
```jsx
{loading ? (
  <SkeletonLoader count={4} />
) : error ? (
  <ErrorComponent message={error} />
) : (
  <ContentComponent />
)}
```

---

## Dark Mode Consideration

Currently: Light mode only
Future: Add dark mode support using context
Colors already follow Tailwind conventions for easy toggling

---

## Accessibility

All pages include:
- ✅ Semantic HTML
- ✅ ARIA labels where needed
- ✅ Keyboard navigation
- ✅ Color contrast compliance
- ✅ Focus states
- ✅ Loading announcements

---

## Performance Tips

1. Use SkeletonLoader for all data fetches
2. Implement proper error boundaries
3. Lazy load images
4. Optimize animations (use transform/opacity)
5. Memoize expensive components
6. Use proper key props in lists

---

## Component Reuse Guide

When creating new pages:

1. **Import UI components:**
   ```jsx
   import GlassCard from '../../components/ui/GlassCard'
   import GradientCard from '../../components/ui/GradientCard'
   import SkeletonLoader from '../../components/ui/SkeletonLoader'
   ```

2. **Follow layout pattern:**
   ```jsx
   <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[COLOR]-50 to-slate-100">
     <Navbar />
     <div className="flex">
       <Sidebar />
       <main className="flex-1 px-6 py-8">
         {/* Content */}
       </main>
     </div>
   </div>
   ```

3. **Use consistent spacing:**
   - Header: mb-10
   - Stats: mb-8
   - Content: gap-4 or space-y-4

4. **Add animations:**
   - Header: from top
   - Cards: staggered with delay
   - Elements: fade/scale on load

---

## Icons Reference

**Lucide React icons used:**
- Briefcase, MapMarkedAlt, Bell, User, Zap, Home, ClipboardList
- CheckCircle2, AlertCircle, Clock, X, ArrowRight
- FileText, Upload, Edit2, Save, Filter, Search
- TrendingUp, MapPin, Calendar, Mail, Graduation
- BookOpen, Loader

Install: `npm install lucide-react`

---

**All components follow this design system for consistency!** ✨
