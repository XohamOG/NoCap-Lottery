# NoCap Lottery - Whiteboard Marker Theme Guide

## 🎨 Design System Overview

Your lottery platform now features a **playful, cartoony whiteboard aesthetic** inspired by hand-drawn sketches, comic books, and retro gaming elements.

---

## 🌈 Color Palette

### Primary Colors
- **Cream Background**: `#f5f3ed` - Main page background
- **Paper White**: `#faf8f3` - Card backgrounds
- **Ink Black**: `#1a1a1a` - Text and borders

### Marker Accent Colors
- **Cyan**: `#00d4ff` - Primary CTA buttons, highlights
- **Pink**: `#ff4d6d` - Secondary buttons, accents
- **Yellow**: `#ffd23f` - Badges, icons, highlights
- **Red**: `#ff6b6b` - Alerts, warnings
- **Green**: `#06d6a0` - Success states

---

## 🖌️ Typography

### Font Families
```css
/* Headers & Titles */
font-family: 'Fredoka', sans-serif;
font-weight: 700-900;

/* Body Text */
font-family: 'Comic Neue', 'Comic Sans MS', cursive;
font-weight: 400-700;

/* Code/Technical */
font-family: 'Space Mono', monospace;
font-weight: 400-700;
```

### Usage
- **H1**: 2.5rem - 4.5rem (responsive)
- **H2**: 1.5rem - 2rem
- **Body**: 1rem - 1.25rem
- **Small**: 0.875rem

---

## 🎯 Key Visual Elements

### 1. Marker-Style Borders
All components use thick, bold borders:
```css
border: 4px solid var(--ink-black);
border-radius: 12px-16px;
```

### 2. Sketch Shadow (Pop-Art Effect)
Solid offset shadows create a 2D comic book feel:
```css
box-shadow: 5px 5px 0 var(--ink-black);
```

Variants:
- Hover: `7-8px 7-8px 0`
- Active/Pressed: `2px 2px 0`
- Large cards: `6-8px 6-8px 0`

### 3. Whiteboard Background
Animated grid with dots pattern:
- Dots: 1.5px circles on 25px grid
- Lines: 1px on 50px grid
- Subtle animation (80s loop)

### 4. Loading Bars (Retro Gaming Style)
```css
.loading-bar-fill {
  background: linear-gradient(
    45deg,
    var(--marker-cyan) 25%,
    transparent 25%,
    transparent 50%,
    var(--marker-cyan) 50%,
    var(--marker-cyan) 75%,
    transparent 75%
  );
  background-size: 20px 20px;
  animation: loading-bar-stripes 1s linear infinite;
}
```

### 5. Icon Badges
```css
.icon-badge {
  width: 64px;
  height: 64px;
  background: var(--marker-yellow);
  border: 4px solid var(--ink-black);
  border-radius: 14px;
  box-shadow: 4px 4px 0 var(--ink-black);
  transform: rotate(-3deg);
}
```

### 6. Highlighter Text Effect
```css
.text-highlight-cyan {
  background: linear-gradient(
    180deg,
    transparent 40%,
    var(--marker-cyan) 40%,
    var(--marker-cyan) 85%,
    transparent 85%
  );
}
```

---

## 🎭 Animations & Interactions

### Button Bounce
```css
.btn-bounce {
  transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.btn-bounce:hover {
  transform: translateY(-3px) rotate(-1deg);
  box-shadow: 7px 7px 0 var(--ink-black);
}

.btn-bounce:active {
  transform: translateY(2px);
  box-shadow: 2px 2px 0 var(--ink-black);
}
```

### Card Squishy
```css
.card-squishy:hover {
  transform: translateY(-5px) rotate(1deg);
  box-shadow: 8px 8px 0 var(--ink-black);
}
```

### Animation Presets
- `animate-fade-in-up`: Slides up with fade
- `animate-scale-in`: Bouncy scale entrance
- `animate-float`: Gentle floating loop
- `animate-wiggle`: Quick shake effect
- `animate-slide-left/right`: Directional slides

### Stagger Delays
Use `stagger-1` through `stagger-6` classes for sequential animations (0.1s - 1s delays)

---

## 🧩 Component Patterns

### Primary Button
```jsx
<button 
  className="btn-bounce"
  style={{
    padding: '1rem 2.5rem',
    fontSize: '1.25rem',
    fontWeight: 700,
    fontFamily: 'Fredoka, sans-serif',
    background: 'var(--marker-pink)',
    color: 'white',
    border: '4px solid var(--ink-black)',
    borderRadius: '16px',
    boxShadow: '5px 5px 0 var(--ink-black)',
    textTransform: 'uppercase',
  }}
>
  START PLAYING!
</button>
```

### Secondary Button
Same as primary but:
- `background: white`
- `color: var(--ink-black)`

### Badge (Yellow)
```jsx
<div className="badge-yellow">
  ⭐ WIN REAL PRIZES! ⭐
</div>
```

### Feature Card
```jsx
<div 
  className="card-squishy"
  style={{
    padding: '2rem',
    background: 'white',
    border: '4px solid var(--marker-cyan)',
    borderRadius: '16px',
    boxShadow: '6px 6px 0 var(--ink-black)',
  }}
>
  <div style={{fontSize: '3rem'}}>🛡️</div>
  <h3 style={{
    fontSize: '1.5rem',
    fontFamily: 'Fredoka, sans-serif',
    fontWeight: 700,
    fontStyle: 'italic',
  }}>
    SUPER SAFE!
  </h3>
  <p style={{
    fontFamily: 'Comic Neue, sans-serif',
    lineHeight: '1.6',
  }}>
    Description text...
  </p>
</div>
```

### Loading Bar
```jsx
<div className="loading-bar">
  <div 
    className="loading-bar-fill" 
    style={{width: '75%'}}
  />
  <div className="loading-percentage">75%</div>
</div>
```

### Pool Card
```jsx
<div 
  className="card-squishy"
  style={{
    background: 'white',
    border: '4px solid var(--ink-black)',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '6px 6px 0 var(--ink-black)',
  }}
>
  {/* Icon badge */}
  <div className="icon-badge" style={{fontSize: '32px'}}>
    $
  </div>
  
  {/* Pool name */}
  <h2 style={{
    fontFamily: 'Fredoka, sans-serif',
    fontSize: '2rem',
    fontWeight: 700,
  }}>
    Cosmic USDC Vault
  </h2>
  
  {/* Badges */}
  <span className="badge-cyan">NO LOSS</span>
  <span className="badge-cyan">WEEKLY DRAW</span>
  
  {/* Stats with loading bars */}
  <div>
    <h3>THE POT!</h3>
    <p style={{
      fontSize: '2.5rem',
      fontFamily: 'Fredoka, sans-serif',
      color: 'var(--marker-cyan)',
    }}>
      $50,000
    </p>
  </div>
  
  {/* CTA */}
  <button className="btn-bounce" style={{
    width: '100%',
    background: 'var(--marker-cyan)',
    color: 'white',
    border: '4px solid var(--ink-black)',
    padding: '1rem',
    fontSize: '1.25rem',
    fontFamily: 'Fredoka, sans-serif',
    borderRadius: '12px',
    boxShadow: '5px 5px 0 var(--ink-black)',
  }}>
    GO PLAY!
  </button>
</div>
```

---

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

Use `hero-grid-responsive` class for 1-column mobile, 2-column desktop layouts.

---

## ✨ Special Effects

### Decorative Elements
- Floating stars/emojis with `animate-float`
- Rotated badges with `transform: rotate(-3deg)`
- Hand-drawn underlines on text highlights

### Hover States
Always include:
1. Slight rotation (-1deg to 2deg)
2. Vertical lift (-3px to -5px)
3. Increased shadow (from 5px to 7-8px)

### Active/Pressed States
1. Translate down (+2px)
2. Reduced shadow (2px 2px)
3. No rotation

---

## 🎮 Interactive Elements

### Connect Button (RainbowKit)
Custom styled in `rainbowkit-custom.css`:
- Cyan background
- Thick black borders
- Bounce animation
- Uppercase Fredoka font

### Scroll to Top
- Circular cyan button
- Bottom right fixed position
- Bounce on hover with rotation

---

## 🚀 Pages Structure

### Home Page
- Hero section with giant title
- "WIN THE POT!" in cyan highlight
- 3 feature cards (Safe, Fast, Big Prizes)
- Floating decorative stars

### Pools Page (Active Pools)
- Grid of pool cards
- Each with: icon badge, title, stats, loading bars, CTA
- Yellow/cyan/pink color-coded borders
- "GO PLAY!" buttons

### Individual Pool Page
- Large pool header with countdown
- Deposit form with MAX button
- Prize stats with retro loading bars
- Rules/Winners/Activity tabs
- Progress indicators with striped animations

---

## 🎯 Brand Voice & Copy

**Tone**: Playful, casual, energetic, slightly irreverent

Examples:
- "SUPER SAFE!" instead of "Secure"
- "FAST AS HECK!" instead of "Quick transactions"
- "BIG PRIZES!" instead of "Large rewards"
- "Someone's gotta win, why not you?" instead of "Competitive prizes"
- "We take the interest and give it to one lucky winner" instead of "Yield redistribution"

---

## 📦 File Structure

```
frontend/
├── index.html (Fredoka, Comic Neue, Space Mono fonts)
├── src/
│   ├── index.css (Global theme, background animation)
│   ├── App.css (Component styles, animations, utilities)
│   ├── rainbowkit-custom.css (Wallet connect theming)
│   ├── main.jsx (Light theme config)
│   ├── App.jsx (Whiteboard background)
│   ├── components/
│   │   ├── Header.jsx (Marker-style nav)
│   │   ├── HeroSection.jsx (Feature cards)
│   │   ├── WinnersBoard.jsx
│   │   └── ... (other components)
│   └── pages/
│       ├── Pools.jsx (Pool cards grid)
│       └── USDCPool.jsx (Individual pool)
```

---

## 🔧 Quick Tips for Replit Agent

1. **Always use these classes**: `btn-bounce`, `card-squishy`, `marker-border`, `sketch-shadow`
2. **Font hierarchy**: Fredoka for titles, Comic Neue for body, Space Mono for code/numbers
3. **Color accents**: Cyan (primary), Pink (secondary), Yellow (badges/icons)
4. **Shadows**: Always use solid offset shadows, never blur
5. **Borders**: Always 4px solid black, 12-16px border radius
6. **Animations**: Use cubic-bezier(0.68, -0.55, 0.265, 1.55) for bouncy feel
7. **Loading bars**: Use striped pattern with animation
8. **Text**: Uppercase for buttons/badges, sentence case for body
9. **Icons**: Use emojis for fun, playful feel (🏆 🛡️ ⚡ ⭐)
10. **Spacing**: Generous padding (1.5-2rem), clear visual hierarchy

---

## 🎨 Example Color Combinations

### Pool Cards
- **USDC Pool**: Yellow icon, cyan border
- **ETH Pool**: 3-lines icon, pink border  
- **BTC Pool**: Bitcoin icon, yellow border
- **SOL Pool**: Circle icon, cyan border

### Feature Cards
- **Safety**: Cyan border, shield emoji
- **Speed**: Pink border, lightning emoji
- **Prizes**: Yellow border, trophy emoji

---

## 📸 Reference Images

Your attachments show:
1. Clean cream/beige background with subtle grid
2. Thick black borders on all elements
3. Bright cyan primary buttons
4. Yellow icon badges (slightly rotated)
5. Loading bars with striped patterns
6. Comic-style "pop" shadows
7. Chunky, friendly typography
8. Floating decorative elements

---

## ✅ Implementation Checklist

- [x] Google Fonts (Fredoka, Comic Neue, Space Mono)
- [x] CSS Variables (colors, spacing, shadows)
- [x] Whiteboard background animation
- [x] Marker-style borders & sketch shadows
- [x] Button bounce animations
- [x] Card squishy hover effects
- [x] Retro loading bars with stripes
- [x] RainbowKit custom theme
- [x] Light theme switch
- [x] Header with marker-style nav
- [x] Hero section with feature cards
- [ ] Pools page with pool cards
- [ ] Individual pool page updates
- [ ] Winners board styling
- [ ] Toast notifications styling
- [ ] Modal/dialog styling

---

**Now you have a complete, cohesive whiteboard marker theme that's playful, engaging, and perfect for a fun lottery DeFi platform!** 🎨✨
