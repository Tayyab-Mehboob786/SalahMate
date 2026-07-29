# Design System

# SalahMate
### UI/UX Design Guidelines

---

# Overview

This document defines the visual identity and design principles for SalahMate.

The primary goals are:

- Clean interface
- Minimal design
- Calm user experience
- Accessibility
- Consistency
- Modern mobile design
- Islamic-inspired aesthetics without excessive decoration

The application should feel peaceful, motivating, and distraction-free.

---

# Design Principles

Every screen should follow these principles:

- Minimal
- Simple
- Spacious
- Modern
- Consistent
- Easy to read
- Easy to navigate
- Focus on content

Avoid visual clutter.

Every screen should have one clear primary action.

---

# Theme

## Default Theme

Light Theme

Primary theme for Version 1.

---

## Supported Themes

- Light
- Dark

Future:

- Forest
- Emerald
- Midnight
- Sand

---

# Color Palette

## Primary

Emerald Green

```
#2E7D32
```

Used for:

- Primary buttons
- Active states
- Success indicators
- Progress bars
- Icons

---

## Secondary

Teal

```
#00897B
```

Used for:

- Highlights
- Secondary actions
- Charts

---

## Accent

Gold

```
#D4AF37
```

Used sparingly for:

- Streak badges
- Premium features
- Achievement indicators

---

## Success

```
#4CAF50
```

---

## Warning

```
#FB8C00
```

---

## Error

```
#E53935
```

---

## Info

```
#2196F3
```

---

# Neutral Colors

## Background

Light

```
#F8F9FA
```

Dark

```
#121212
```

---

## Surface

Light

```
#FFFFFF
```

Dark

```
#1E1E1E
```

---

## Divider

```
#E0E0E0
```

Dark

```
#333333
```

---

## Text

Primary

```
#212121
```

Secondary

```
#616161
```

Disabled

```
#9E9E9E
```

Dark Mode Text

```
#FFFFFF
```

---

# Typography

## Font Family

Primary

```
Poppins
```

Fallback

```
System Default
```

---

# Font Weights

Light

```
300
```

Regular

```
400
```

Medium

```
500
```

Semi Bold

```
600
```

Bold

```
700
```

---

# Typography Scale

## Heading 1

32

Bold

---

## Heading 2

28

Bold

---

## Heading 3

24

SemiBold

---

## Heading 4

20

SemiBold

---

## Title

18

Medium

---

## Body

16

Regular

---

## Small Text

14

Regular

---

## Caption

12

Regular

---

# Spacing System

Base Unit

```
8px
```

Common spacing

```
4
8
12
16
20
24
32
40
48
```

Never use random spacing values.

---

# Border Radius

Small

```
8
```

Medium

```
12
```

Large

```
16
```

Extra Large

```
24
```

Cards

```
16
```

Buttons

```
12
```

---

# Elevation

Use subtle shadows only.

Cards

```
Elevation 2-4
```

Floating Button

```
Elevation 6
```

Avoid heavy shadows.

---

# Icons

Library

```
react-native-vector-icons
```

Preferred Style

Outlined

Rounded

Simple

Consistent stroke width

---

# Button Design

Primary Button

- Emerald background
- White text
- Rounded corners
- Medium elevation

Secondary Button

- White background
- Emerald border
- Emerald text

Danger Button

- Red background

Disabled

- Gray background

---

# Input Fields

Style

Rounded

Filled white background

Soft border

Height

```
52
```

States

- Default
- Focused
- Error
- Disabled

---

# Cards

Cards should be used for:

- Prayer Summary
- Analytics
- Motivation
- Statistics
- Profile

Style

- White background
- Rounded corners
- Soft shadow
- Consistent padding

---

# Navigation

Bottom Tab Navigation

Main tabs

- Home
- Prayer
- Analytics
- Profile

Top navigation only where necessary.

---

# Screen Layout

General layout

```
Safe Area

↓

Header

↓

Scrollable Content

↓

Bottom Navigation
```

---

# Animations

Keep animations subtle.

Allowed

- Fade
- Slide
- Scale
- Progress animation

Avoid

- Excessive bouncing
- Flashing effects
- Long animations

Maximum duration

```
300ms
```

---

# Charts

Charts should use:

- Emerald
- Teal
- Gold

Avoid more than five colors.

Keep charts simple.

---

# Illustrations

Style

Flat

Minimal

Modern

Friendly

Avoid cartoonish illustrations.

---

# Images

Use optimized assets.

Preferred formats

- PNG
- SVG
- WebP

Avoid oversized images.

---

# Empty States

Every empty screen should include:

- Illustration
- Short explanation
- Primary action

Example

"No prayer history yet."

"Start tracking today's prayers."

---

# Loading States

Use:

- Skeleton loaders
- ActivityIndicator

Avoid blank screens.

---

# Error States

Should include:

- Friendly message
- Retry button

Example

"Something went wrong."

"Please try again."

---

# Accessibility

Minimum touch target

```
48 x 48
```

Minimum font size

```
14
```

Support:

- Dynamic font scaling
- Screen readers
- High contrast
- Dark mode

Never rely only on color to communicate status.

---

# Responsive Design

Support

- Small phones
- Large phones
- Tablets (future)

Avoid fixed widths.

Use:

- Flexbox
- Percentage widths
- Responsive spacing

---

# Component Consistency

Every reusable component should have consistent:

- Border radius
- Padding
- Margin
- Typography
- Colors
- Icon size

---

# Design Language

The application should communicate:

- Peace
- Focus
- Consistency
- Motivation
- Simplicity
- Trust

Users should feel encouraged rather than pressured.

---

# Design Inspiration

The UI should take inspiration from:

- Material Design 3
- Apple Human Interface Guidelines
- Modern fitness & habit tracking apps

Examples:

- Calm
- Headspace
- Duolingo (progress visualization only)
- Google Fit
- Habitify

---

# Version 1 Design Scope

Screens

- Splash
- Welcome
- Login
- Register
- Home Dashboard
- Prayer Tracking
- Prayer Timings
- Analytics
- AI Motivation
- Profile
- Settings

All screens should use the same design system defined in this document.

---

# Final Design Principles

Every UI decision should answer **YES** to these questions:

- Is it simple?
- Is it readable?
- Is it consistent?
- Is it accessible?
- Is it modern?
- Does it reduce cognitive load?
- Does it encourage users without distracting them?

If the answer is **NO**, redesign the component before implementation.