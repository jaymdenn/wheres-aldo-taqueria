# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Where's Aldo? Taqueria" is a static marketing website for a mobile taqueria business serving the Wasatch Front (Utah). The site features an interactive calendar, live location tracker with Leaflet.js maps, photo gallery, menu display, and contact form.

## Tech Stack

- **HTML/CSS/JS** - Static site with no build process
- **Leaflet.js** - Interactive map for location tracking
- **Font Awesome** - Icons
- **Google Fonts** - Fjalla One (display), Source Sans Pro/Lato (body)
- **Netlify** - Hosting with SPA-style redirects

## Development

No build step required. Open `index.html` directly in a browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using npx
npx serve .
```

## Deployment

Auto-deploys to Netlify on push to `main`. The `netlify.toml` configures:
- Publish directory: root (`.`)
- SPA redirect: all routes → `index.html`

## Architecture

### File Structure
```
index.html    - Single-page layout with all sections
styles.css    - CSS with custom properties (Mexican theme colors)
script.js     - All interactive features
images/       - Hero backgrounds, gallery photos, taco images
```

### CSS Design System

Uses CSS custom properties defined in `:root`:
- **Colors**: Mexican flag palette (`--color-primary` red, `--color-green`, `--color-accent` gold)
- **Typography**: `--font-display` for headings, `--font-body`/`--font-secondary` for text
- **Spacing**: `--spacing-xs` through `--spacing-xl`
- **Layout**: `--max-width: 1200px`, `--header-height: 70px`

### JavaScript Features (script.js)

Initialization on `DOMContentLoaded`:
- `initNavigation()` - Mobile menu toggle, header scroll effects
- `initSmoothScroll()` - Anchor link scrolling with header offset
- `initCalendar()` - Interactive event calendar with hardcoded events array
- `initAldoTracker()` - Leaflet map with taco truck locations
- `initConfetti()` - Logo click triggers confetti burst
- `initPapelPicado()` - Decorative banner elements
- `initTacoCounter()` - Animated "tacos served" counter
- `initPinataBurst()` - Random candy burst on button clicks
- `initCookieBanner()` - GDPR cookie consent
- `initContactForm()` - Mailto link generation
- `initScrollEffects()` - Intersection Observer animations

### Data Updates

**Calendar Events**: Edit the `events` array in `initCalendar()` (script.js:346-427). Format:
```javascript
{ date: 'YYYY-MM-DD', events: [{ title, time, location }] }
```

**Live Tracker Locations**: Edit `aldoLocations` array in `initAldoTracker()` (script.js:896-921). Set `isLive: true` for current location.

**Menu Items**: Edit directly in `index.html` within the `#menu` section.

## Social Links

- Facebook: `https://facebook.com/wheres.aldo.taqueria`
- Instagram: `https://instagram.com/wheres.aldo.taqueria/`
- Yelp: `https://yelp.com/biz/FFvNpQFXO-vXgru85XvMJg`
