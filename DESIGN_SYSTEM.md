# Vietnamese Cultural Design System

## Overview
This design system celebrates Vietnamese heritage for Women's Day while maintaining a sophisticated, soft pastel aesthetic. The design incorporates traditional Vietnamese cultural elements through colors, patterns, and motifs.

## Color Palette

### Primary Vietnamese-Inspired Colors

- **Soft Red** (`#d4a5a5`) - Primary color
  - Represents luck, happiness, and celebration in Vietnamese culture
  - Used for primary buttons, borders, and accents
  
- **Warm Gold** (`#e8c9a0`) - Chart color 4
  - Symbolizes prosperity and wealth
  - Used in decorative patterns and gradients
  
- **Sage Green** (`#a8c9b8`) - Secondary color
  - Represents growth, harmony, and nature
  - Used for secondary elements and success states
  
- **Soft Purple** (`#c9b8d4`) - Accent color
  - Adds elegance and sophistication
  - Used for accent elements and hover states

### Background & Base Colors

- **Background** (`#faf8f5`) - Warm cream base
  - Soft, warm foundation that doesn't compete with content
  - Creates a vintage, elegant feel
  
- **Foreground** (`#3d2f2a`) - Rich brown text
  - Excellent readability while maintaining warmth
  - Softer alternative to pure black

## Visual Elements

### Lotus Flower Motifs
The design features subtle lotus flower patterns created with radial gradients:
- Scattered throughout the background
- Uses soft reds, golds, greens, and purples
- Symbolizes purity, beauty, and enlightenment in Vietnamese culture

### Vietnamese Silk Patterns
Delicate diagonal and crosshatch patterns inspired by traditional Vietnamese silk:
- Very subtle opacity (2-4%)
- Creates texture without overwhelming
- Adds cultural authenticity

### Wavy Paths
Smooth, flowing wavy paths inspired by Vietnamese design:
- Evoke traditional Vietnamese paintings
- Create gentle movement in the background
- Layered at different opacities

### Vintage Dot Pattern
Scattered colored dots in Vietnamese cultural colors:
- Creates a vintage, handcrafted feel
- Very low opacity for subtlety
- Adds visual interest without distraction

## Typography & Spacing

### Fonts
- Sans-serif: "Geist" - Clean, modern, and highly readable
- Monospace: "Geist Mono" - For code and technical elements

### Spacing
- Generous padding and margins for breathing room
- Border radius: `1.5rem` (24px) - Soft, rounded corners throughout
- Consistent use of backdrop blur for layered glass-morphism effect

## Component Styling

### Cards
- Semi-transparent backgrounds (`bg-card/80`)
- Backdrop blur for depth
- 2px borders with primary/accent colors at reduced opacity
- Generous padding (p-6, p-8)
- Shadow with colored glow (shadow-primary/20)

### Buttons
- Gradient backgrounds (from-primary to-accent)
- Smooth hover transitions
- Consistent text color (primary-foreground)
- Rounded corners matching the design system

### Inputs & Forms
- Borders with primary color at 30% opacity
- Focus states with full primary color
- Consistent ring color matching focus

### Tables
- Subtle borders (border-primary/20)
- Hover states with primary color at 5% opacity
- Clean, readable spacing

## Iconography

### Lotus Emoji (🪷)
- Replaced the generic flower emoji (🌸)
- More culturally specific to Vietnamese heritage
- Used consistently across all headers and branding

## Animation

### Floating Background
- 40-second gentle animation cycle
- Subtle movement of background patterns
- Creates a living, breathing feel
- Ease-in-out timing for smoothness

### Card Interactions
- Hover lift effect (-6px on Y-axis)
- Scale transitions on images
- Smooth color transitions
- Duration: 400-700ms for polish

## Accessibility

### Color Contrast
- All text colors meet WCAA AA standards
- Primary text (#3d2f2a) on background (#faf8f5): High contrast
- Muted text colors still maintain readability

### Focus States
- Visible ring on interactive elements
- Color: Primary color (soft red)
- Opacity: 50% for subtlety

## Design Tokens

All design values are defined as CSS custom properties in `app/globals.css`:
- Easy to maintain and update
- Consistent across entire application
- Support for dark mode (defined but not currently active)

## Cultural Significance

This design system honors Vietnamese heritage through:
1. **Colors** - Traditional symbolic colors with modern, soft interpretations
2. **Lotus Motif** - Vietnam's national flower, representing purity and beauty
3. **Silk Patterns** - Reference to Vietnam's rich textile tradition
4. **Warm Aesthetic** - Reflects Vietnamese hospitality and warmth
5. **Celebration of Women** - Designed specifically for Vietnamese Women's Day

## Usage Guidelines

### Do's
✅ Use design tokens (e.g., `bg-card`, `text-foreground`) instead of hardcoded colors  
✅ Maintain consistent spacing using Tailwind's spacing scale  
✅ Keep backdrop blur for depth and layering  
✅ Use the lotus emoji (🪷) for brand consistency  
✅ Apply gentle transitions for polish  

### Don'ts
❌ Don't use hardcoded hex colors  
❌ Don't override border-radius inconsistently  
❌ Don't use pure white or pure black  
❌ Don't ignore the cultural significance of color choices  
❌ Don't create harsh transitions or animations  

## Implementation

All components have been updated to use this design system:
- Main pages (home, redeem, admin)
- All components (cards, modals, forms)
- Consistent application across the entire user experience

The result is a cohesive, culturally meaningful, and visually stunning celebration of Vietnamese Women's Day.
