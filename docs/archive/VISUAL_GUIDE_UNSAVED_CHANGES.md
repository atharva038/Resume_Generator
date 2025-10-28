# Visual Guide - Unsaved Changes UX

## 📸 What Users Will See

This guide shows exactly what the feature looks like in action.

---

## 🎨 Save Button States

### Desktop View (Floating Button - Bottom Right)

#### 1️⃣ Saved State - Everything is Saved ✅
```
┌─────────────────────────────────────────────┐
│                                             │
│                                             │
│                                     ┌────┐  │
│                                     │ 💾 │  │ ← Blue Circle
│                                     │    │  │   "Resume Saved"
│                                     └────┘  │   (on hover)
│                                             │
└─────────────────────────────────────────────┘
```
- **Color:** Blue gradient (from-blue-400 to-blue-600)
- **Icon:** 💾 Save disk
- **Hover:** Shows "Resume Saved" tooltip
- **Animation:** Scales up and rotates on hover

---

#### 2️⃣ Unsaved State - Changes Detected ⚠️
```
┌─────────────────────────────────────────────┐
│                                             │
│                                             │
│                                     ┌────┐  │
│                                   ⚫│ ⚠️ │  │ ← Orange Circle
│                                     │    │  │   "Save Changes*"
│                                     └────┘  │   (on hover)
│                                       ↑     │
│                                  Red pulsing│
│                                  notification│
└─────────────────────────────────────────────┘
```
- **Color:** Orange gradient (from-orange-400 to-orange-600)
- **Icon:** ⚠️ Warning sign
- **Dot:** Red pulsing circle in top-right corner
- **Hover:** Shows "Save Changes*" tooltip
- **Animation:** More noticeable, demands attention

---

#### 3️⃣ Saving State - In Progress ⏳
```
┌─────────────────────────────────────────────┐
│                                             │
│                                             │
│                                     ┌────┐  │
│                                     │ ⏳ │  │ ← Gray Circle
│                                     │    │  │   (disabled)
│                                     └────┘  │
│                                             │
└─────────────────────────────────────────────┘
```
- **Color:** Gray gradient (from-gray-300 to-gray-400)
- **Icon:** ⏳ Hourglass
- **State:** Disabled (can't click)
- **Hover:** No tooltip while saving

---

### Mobile View (Top Action Bar)

#### 1️⃣ Saved State
```
┌─────────────────────────────────────────────┐
│  ┌────────┐  ┌─────────────┐  ┌──────────┐ │
│  │   🎨   │  │   📥        │  │  💾      │ │
│  │ Change │  │  Download   │  │  Saved   │ │
│  │Template│  │             │  │          │ │
│  └────────┘  └─────────────┘  └──────────┘ │
│                                       ↑     │
│                                   Blue bg   │
└─────────────────────────────────────────────┘
```

#### 2️⃣ Unsaved State
```
┌─────────────────────────────────────────────┐
│  ┌────────┐  ┌─────────────┐  ┌──────────┐ │
│  │   🎨   │  │   📥        │⚫│  ⚠️      │ │
│  │ Change │  │  Download   │  │  Save*   │ │
│  │Template│  │             │  │          │ │
│  └────────┘  └─────────────┘  └──────────┘ │
│                                       ↑     │
│                                  Orange bg  │
│                                  + Red dot  │
└─────────────────────────────────────────────┘
```

---

## 🚨 Unsaved Changes Modal

### Modal Appearance
```
┌──────────────────────────────────────────────────────────┐
│                    Dark Backdrop                          │
│           (50% opacity, click to cancel)                  │
│                                                           │
│         ┌────────────────────────────────┐               │
│         │                                │               │
│         │         ┏━━━━━━━━━┓           │               │
│         │         ┃         ┃           │               │
│         │         ┃    ⚠️   ┃           │ ← Yellow circle
│         │         ┃         ┃           │   with warning
│         │         ┗━━━━━━━━━┛           │               │
│         │                                │               │
│         │     Unsaved Changes            │               │
│         │                                │               │
│         │  You have unsaved changes to   │               │
│         │  your resume. What would you   │               │
│         │  like to do?                   │               │
│         │                                │               │
│         │  ┌──────────────────────────┐ │               │
│         │  │                          │ │               │
│         │  │    💾  Save Changes      │ │ ← Blue button
│         │  │                          │ │   (Primary)
│         │  └──────────────────────────┘ │               │
│         │                                │               │
│         │  ┌──────────────────────────┐ │               │
│         │  │                          │ │               │
│         │  │   🗑️  Discard Changes   │ │ ← Red button
│         │  │                          │ │   (Destructive)
│         │  └──────────────────────────┘ │               │
│         │                                │               │
│         │  ┌──────────────────────────┐ │               │
│         │  │                          │ │               │
│         │  │      ❌  Cancel          │ │ ← Gray button
│         │  │                          │ │   (Secondary)
│         │  └──────────────────────────┘ │               │
│         │                                │               │
│         └────────────────────────────────┘               │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Modal Components

#### Warning Icon (Top Center)
```
      ┏━━━━━━━━━┓
      ┃         ┃
      ┃    ⚠️   ┃  ← Triangle warning icon
      ┃         ┃     Yellow background
      ┗━━━━━━━━━┛     Dark mode: darker yellow
```

#### Heading & Message
```
     Unsaved Changes           ← Bold, 20px
     
  You have unsaved changes     ← Gray text, 14px
  to your resume. What would   
  you like to do?
```

#### Button 1: Save Changes (Primary)
```
┌────────────────────────────────┐
│                                │
│      💾  Save Changes          │  ← Blue gradient
│                                │   White text
└────────────────────────────────┘   Hover: darker blue
```
**Action:** Saves resume → Navigates away

#### Button 2: Discard Changes (Destructive)
```
┌────────────────────────────────┐
│                                │
│     🗑️  Discard Changes        │  ← Red solid
│                                │   White text
└────────────────────────────────┘   Hover: darker red
```
**Action:** Navigates away immediately (loses changes)

#### Button 3: Cancel (Secondary)
```
┌────────────────────────────────┐
│                                │
│         ❌  Cancel             │  ← Gray
│                                │   Dark text
└────────────────────────────────┘   Hover: darker gray
```
**Action:** Closes modal, stays on page

---

## 🎬 Animation States

### Pulsing Red Dot Animation
```
Frame 1:  ⚫  ← Small (scale: 1.0)
          ↓
Frame 2:  ⚫  ← Growing (scale: 1.1)
          ↓
Frame 3:  ⚫  ← Large (scale: 1.2)
          ↓
Frame 4:  ⚫  ← Shrinking (scale: 1.1)
          ↓
Frame 1:  ⚫  ← Back to start
(Loops continuously)
```

### Button Hover Animation (Desktop)
```
Normal State:     Hover State:
   ┌────┐            ┌────┐
   │ 💾 │    →       │ 💾 │
   └────┘            └────┘
   (1.0x)           (1.1x + rotate)
```

### Modal Fade In
```
Step 1: Backdrop appears (fade in 200ms)
        ↓
Step 2: Modal slides in from center (transform + fade)
        ↓
Step 3: Content visible, buttons ready
```

---

## 📱 Responsive Behavior

### Desktop (>= 768px)
```
Editor Page
├─ Floating Save Button (bottom-right corner)
├─ Hover tooltips visible
└─ Modal: centered, max-width 28rem

┌─────────────────────────────────────────────┐
│                                             │
│            Resume Editor Content            │
│                                             │
│                                     ┌────┐  │
│                                     │ 💾 │  │ ← Fixed position
│                                     └────┘  │   bottom-right
│                                             │
└─────────────────────────────────────────────┘
```

### Mobile (< 768px)
```
Editor Page
├─ Save button in top action bar
├─ No hover tooltips (tap to activate)
└─ Modal: full-width with padding

┌─────────────────────────────────────────────┐
│  ┌────────┐  ┌─────────────┐  ┌──────────┐ │
│  │   🎨   │  │   📥        │  │  💾      │ │
│  │ Change │  │  Download   │  │  Saved   │ │
│  │Template│  │             │  │          │ │
│  └────────┘  └─────────────┘  └──────────┘ │
├─────────────────────────────────────────────┤
│                                             │
│            Resume Editor Content            │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🌙 Dark Mode

### Light Mode Modal
```
┌────────────────────────────────┐
│   Background: White            │
│   Text: Dark gray (#111827)    │
│   Icon BG: Yellow (#FEF3C7)    │
│   Icon: Dark yellow (#D97706)  │
│   Blue button: #2563EB         │
│   Red button: #DC2626          │
│   Gray button: #E5E7EB         │
└────────────────────────────────┘
```

### Dark Mode Modal
```
┌────────────────────────────────┐
│   Background: Dark gray (#1F2937)│
│   Text: White (#FFFFFF)        │
│   Icon BG: Dark yellow (#78350F)│
│   Icon: Light yellow (#FBBF24) │
│   Blue button: #3B82F6         │
│   Red button: #EF4444          │
│   Gray button: #374151         │
└────────────────────────────────┘
```

Both modes maintain:
- ✅ Clear contrast ratios (WCAG AA)
- ✅ Consistent visual hierarchy
- ✅ Same functionality

---

## 🎭 User Interaction Flow

### Scenario 1: Normal Editing
```
Step 1: Open editor
        ┌──────────────┐
        │ Resume loads │
        │ Button: 💾   │
        │ (Blue)       │
        └──────────────┘
                ↓
Step 2: User types
        ┌──────────────┐
        │ Name changes │
        │ Button: ⚠️   │
        │ (Orange)     │
        └──────────────┘
                ↓
Step 3: User clicks Save
        ┌──────────────┐
        │ Saving...    │
        │ Button: ⏳   │
        │ (Gray)       │
        └──────────────┘
                ↓
Step 4: Save completes
        ┌──────────────┐
        │ Alert shown  │
        │ Button: 💾   │
        │ (Blue)       │
        └──────────────┘
```

### Scenario 2: Leaving Without Saving
```
Step 1: Edit resume
        ┌──────────────┐
        │ Changes made │
        │ Button: ⚠️   │
        └──────────────┘
                ↓
Step 2: Click back button
        ┌──────────────┐
        │ Modal opens  │
        │ 3 options    │
        └──────────────┘
                ↓
        ┌───────┴───────┐
        │               │
┌───────▼──────┐ ┌──────▼──────┐ ┌─────▼──────┐
│ Save Changes │ │ Discard     │ │ Cancel     │
└───────┬──────┘ └──────┬──────┘ └─────┬──────┘
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Saves then   │ │ Loses changes│ │ Stays on     │
│ navigates    │ │ then         │ │ editor       │
│              │ │ navigates    │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
```

---

## 🖼️ Color Palette

### Save Button States
```
Saved (Blue):
  from-blue-400   #60A5FA
  via-blue-500    #3B82F6
  to-blue-600     #2563EB

Unsaved (Orange):
  from-orange-400 #FB923C
  via-orange-500  #F97316
  to-orange-600   #EA580C

Saving (Gray):
  from-gray-300   #D1D5DB
  to-gray-400     #9CA3AF
```

### Modal Elements
```
Warning Icon Background:
  Light: #FEF3C7 (yellow-100)
  Dark:  #78350F (yellow-900)

Warning Icon:
  Light: #D97706 (yellow-600)
  Dark:  #FBBF24 (yellow-400)

Save Button:
  from-blue-600   #2563EB
  to-indigo-600   #4F46E5

Discard Button:
  bg-red-600      #DC2626

Cancel Button:
  Light: #E5E7EB (gray-200)
  Dark:  #374151 (gray-700)
```

### Notification Dot
```
Red pulsing dot:
  bg-red-500      #EF4444
  Border: 2px white
  Size: 12px × 12px
  Position: Top-right corner (-4px, -4px)
```

---

## 🎯 Key Visual Elements

### 1. The Pulsing Dot
- **Purpose:** Immediate visual alert
- **Color:** Bright red (#EF4444)
- **Animation:** Pulses continuously (1s cycle)
- **Position:** Top-right of save button
- **Visibility:** Only when unsaved changes exist

### 2. Button Color Transitions
- **Saved → Unsaved:** Blue fades to orange (instant)
- **Unsaved → Saving:** Orange fades to gray (instant)
- **Saving → Saved:** Gray fades to blue (instant)
- **Smooth:** CSS transitions (300ms duration)

### 3. Modal Backdrop
- **Color:** Black with 50% opacity
- **Effect:** Blurs background content
- **Interactive:** Click to cancel (close modal)
- **Accessibility:** Traps focus inside modal

### 4. Icon Hierarchy
```
Priority 1: Warning icon (⚠️) - Largest, most prominent
Priority 2: Button icons (💾🗑️❌) - Medium size
Priority 3: Pulsing dot - Small but animated
```

---

## ✨ Micro-Interactions

### Save Button Hover (Desktop)
```
Mouse enters → Scale: 1.0 → 1.1
             → Rotate: 0° → -12°
             → Shadow: increases
             → Duration: 300ms

Mouse leaves → Returns to normal
             → Duration: 300ms
```

### Button Click Feedback
```
Click → Brief scale down (95%)
      → Duration: 150ms
      → Returns to normal
```

### Modal Buttons Hover
```
Save Changes:
  Normal → Hover
  #2563EB → #1D4ED8 (darker blue)

Discard Changes:
  Normal → Hover
  #DC2626 → #B91C1C (darker red)

Cancel:
  Normal → Hover
  #E5E7EB → #D1D5DB (darker gray)
```

---

## 📐 Dimensions

### Desktop Save Button
- **Size:** 56px × 56px (3.5rem)
- **Border Radius:** 50% (perfect circle)
- **Position:** Fixed, bottom-right
- **Offset:** 24px from edges
- **Icon Size:** 32px (2rem)
- **Shadow:** 0 20px 25px -5px rgba(0,0,0,0.1)

### Mobile Save Button
- **Height:** 40px (2.5rem)
- **Width:** Flex (1/3 of action bar)
- **Border Radius:** 8px (0.5rem)
- **Icon Size:** 24px (1.5rem)
- **Text Size:** 14px (0.875rem)

### Modal
- **Max Width:** 448px (28rem)
- **Padding:** 24px (1.5rem)
- **Border Radius:** 16px (1rem)
- **Button Height:** 48px (3rem)
- **Button Spacing:** 12px (0.75rem) gap

### Notification Dot
- **Size:** 12px × 12px (0.75rem)
- **Border:** 2px white border
- **Position:** -4px from top and right

---

## 🎪 Complete Visual Journey

### From Opening to Saving
```
1. User Opens Editor
   ┌─────────────────┐
   │ Loading...      │
   └─────────────────┘
           ↓
2. Data Loaded
   ┌─────────────────┐
   │ 💾 Saved (Blue) │
   └─────────────────┘
           ↓
3. User Edits
   ┌─────────────────┐
   │⚫⚠️ Save* (Orange)│
   │   + pulsing dot │
   └─────────────────┘
           ↓
4. User Clicks Save
   ┌─────────────────┐
   │ ⏳ Saving...    │
   │    (Gray)       │
   └─────────────────┘
           ↓
5. Save Complete
   ┌─────────────────┐
   │ 💾 Saved (Blue) │
   │ "Resume updated"│
   └─────────────────┘
```

### From Editing to Navigating Away
```
1. Unsaved Changes
   ┌─────────────────┐
   │⚫⚠️ Save* (Orange)│
   └─────────────────┘
           ↓
2. User Clicks Back
   ┌─────────────────┐
   │  Modal Appears  │
   │                 │
   │  ⚠️ Warning     │
   │                 │
   │ [Save Changes]  │
   │ [Discard]       │
   │ [Cancel]        │
   └─────────────────┘
           ↓
3. User Chooses Action
   (See flow diagram above)
```

---

## 🎨 Design Principles

### 1. Progressive Disclosure
- Don't show modal when no changes
- Only show warning when necessary
- Keep UI clean until action needed

### 2. Clear Affordances
- Buttons look clickable
- Colors indicate action severity
- Icons reinforce meaning

### 3. Consistent Feedback
- Every action has visual response
- State changes are clear
- Loading states are obvious

### 4. Reversible Actions
- Cancel button always available
- Can change mind at any time
- No "destructive" defaults

---

**This is what users will see and experience! 🎉**
