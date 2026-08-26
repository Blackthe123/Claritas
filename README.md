# Claritas Academics — Website README

> **Clarity. Confidence. Results.**
> A professional HSC tutoring website for Claritas Academics, a student-founded tutoring business based in Sydney, Australia.

---

## Project Overview

This website serves as the primary online presence for Claritas Academics, offering HSC tutoring services to Year 11 and 12 students. It is built with vanilla HTML, CSS, and JavaScript — no frameworks or build tools required.

### File Structure

```
/
├── index.html          # Main landing page
├── tutors.html         # Tutors directory page
├── 404.html            # Custom 404 error page
├── images/
│   ├── logo.png
│   ├── logo-2.png
│   ├── favicon.png
│   ├── banner.png
│   ├── ayush-resize.png
│   ├── ayush-shoulder.png
│   ├── ned-resize.png
│   ├── ned-shoulder.png
│   ├── tarun-resize-fill.png
│   ├── tarun-shoulder.jpg
│   ├── aditya-resize-3.png
│   ├── aditya-shoulder.jpeg
│   ├── clarity-stickman.png
│   ├── confidence-stickman.png
│   └── results-stickman.png
```

---

## Pages & Features

### `index.html` — Main Landing Page

The homepage is a single-page application with smooth scroll navigation. It contains the following sections:

#### Navigation Bar
- Fixed top navbar with blur/frosted glass effect
- Logo with image fallback to text if the image fails to load
- Navigation links: Home, Philosophy, Subjects, Tutors, Pricing, Book Now
- Mobile hamburger menu with toggle functionality
- Fade-in-down entrance animation on page load

#### Hero Section
- Full-viewport-height hero with animated gradient background
- Floating radial gradient orbs (CSS `@keyframes float` animation)
- Main heading: **CLARITAS ACADEMICS** with serif typography
- Tagline: *Clarity. Confidence. Results.*
- Animated scroll indicator with bounce animation

#### Problem Context Section
- Introductory paragraph addressing the HSC challenge
- White card with soft box shadow
- Scroll-reveal fade-in animation

#### Impact Metrics Section
- Three animated counter cards:
  - **4** Expert Tutors
  - **14** Courses Taught
  - **18** Band 6 Achieved
- Counters animate from 0 to their target value when scrolled into view
- Hover lift effect on each card

#### Philosophy Section
- Three-stage animated flow: **Clarity → Confidence → Results**
- Each stage features a circle with a custom illustration, alternating left/right layout:
  - Clarity (circle right, text left)
  - Confidence (circle left, text right)
  - Results (circle right, text left)
- SVG animated arrow that draws itself as the user scrolls through the section (desktop only)
- Glassmorphism-style content cards with `backdrop-filter: blur`
- Mobile responsive: stacks vertically, SVG arrow hidden

#### Subjects Section
- Five expandable subject category cards:
  - **Mathematics** — Math Standard, Advanced, Extension 1 & 2
  - **Science** — Physics, Chemistry, Biology
  - **English** — Standard & Advanced
  - **Humanities** — Legal Studies, Modern & Ancient History, Business Studies
  - **Technology** — Software Engineering
- Each card expands on click to reveal relevant tutors in a mini-grid
- Mini tutor cards link directly to the tutor's profile modal on `tutors.html`
- Only one category can be expanded at a time (accordion behaviour)
- Includes a "View All … Tutors" call-to-action button per category

#### Pricing Section
- Four pricing plan cards:
  - **Foundation** — $40/hr (Offline Group Session)
  - **Excellence** — $60/hr (1:1 Online) — *Recommended badge*
  - **Premium** — $70/hr (1:1 Offline)
  - **Elite** — $100/hr (Everything in Premium + more) — *Top Bands Guaranteed badge*
- Hover scale and lift animation
- Recommended and Elite cards are pre-scaled for visual emphasis

#### Value Proposition Section
- Gold badge: *Our Competitive Advantage*
- Three value cards: Transparency, No Corporate Overhead, Student-First Mission
- Highlight callout box with left gold border accent
- Background radial gradient decorations

#### Booking Section
- Call-to-action to book a free session
- Explains the process: choose a tutor, book free session, sample lesson option
- Button links to `tutors.html`

#### Footer
- ABN, Email, and Phone contact details
- Social media icon links: Instagram, Facebook, LinkedIn, Discord
- Copyright notice

---

### `tutors.html` — Tutors Directory

#### Page Header
- Large page title with subtitle
- Animated fade-in on load

#### Philosophy Intro
- A short paragraph reinforcing the tutor selection philosophy

#### Tutors Grid
- Four tutor cards displayed in a responsive grid:

| Tutor | Subjects | ATAR | Booking Link |
|---|---|---|---|
| Ayush Yajaman | Math Adv/Ext1/Ext2, Physics, Chemistry, Software Eng | 99.30 | cal.com/ayush-yajaman-bf5qw6 |
| Ned Reside | English Std/Adv, Ancient & Modern History, Legal Studies | 97 | cal.com/nedreside |
| Tarun Vakkalagadda | Math Ext1/Ext2, Chemistry | 99.05 | cal.com/tarun-vakkalagadda |
| Aditya Shivakumar | Math Adv/Std, Biology, Business Studies | 98.35 | cal.com/aditya.s1501 |

- Each card has a photo, subject tags, a short bio, a "View Full Profile" button and a "Book Now" button
- `Book Now` opens the tutor's cal.com booking page in a new tab
- Cards animate in sequentially with staggered delays

#### Tutor Profile Modal
- Clicking a card (or the "View Full Profile" button) opens a full-screen modal
- Modal contains:
  - A banner image header
  - Close button (×) — also closeable via Escape key or clicking outside the modal
  - Tutor name and subject tags
  - **About** section
  - **Teaching Approach** section
  - **Credentials & Expertise** list with tick (✓) markers
  - **Book Free Session** CTA button linking to the tutor's cal.com page
- URL hash support: navigating to `tutors.html#tutor1` (or `#tutor2`, `#tutor3`, `#tutor4`) auto-opens the corresponding modal

#### Footer
- Identical to the main page footer

---

### `404.html` — Custom Error Page

- Centred layout with animated floating background orbs
- Large serif **404** display number
- "Page Not Found" heading with friendly message
- Two action buttons: **Return Home** and **Meet Our Tutors**
- Quick links grid: Our Philosophy, Subjects, Pricing, Book a Session
- Logo with image fallback

---

## Design System

### Typography
- **Headings:** Cormorant Garamond (serif) — weights 300, 400, 500, 600, 700
- **Body:** Inter (sans-serif) — weights 300, 400, 500, 600
- Both loaded from Google Fonts

### Colour Palette

| Variable | Hex | Usage |
|---|---|---|
| `--primary` | `#1a1a2e` | Dark navy — headings, navbar |
| `--secondary` | `#16213e` | Darker navy — gradients |
| `--accent` | `#0f4c75` | Mid blue — CTAs, tags, highlights |
| `--gold` | `#c9a961` | Gold — recommended badge, borders |
| `--purple` | `#2F0A61` | Deep purple — Elite badge |
| `--text` | `#2d2d2d` | Body text |
| `--light-text` | `#666` | Muted/secondary text |
| `--bg` | `#fafafa` | Page background |
| `--white` | `#ffffff` | Cards, modals |

### Animations
- `fadeInUp` — elements enter from below on scroll or load
- `fadeInDown` — navbar entrance
- `float` — background radial orbs
- `bounce` — scroll indicator
- Scroll-reveal class: `.scroll-reveal` → `.visible` (triggered by scroll listener)
- Counter animation: counts up from 0 to target value when in viewport
- Philosophy SVG arrow draws progressively as the section scrolls into view

### Responsive Design
- Breakpoint at `max-width: 768px`
- Mobile hamburger menu replacing nav links
- Single-column grid layouts on mobile
- Philosophy stages stack vertically, SVG arrow hidden
- Full-width buttons and links on small screens

---

## Analytics

Google Analytics (GA4) is integrated on all three pages via gtag.js:

```
Measurement ID: G-FMNDRJT0NB
```

---

## Booking Integration

Tutor bookings are handled externally via [cal.com](https://cal.com). Each tutor has their own booking page linked from both the tutor card and the modal. All booking links open in a new tab (`target="_blank"`).

---

## Business Details

| Field | Value |
|---|---|
| Business Name | Claritas Academics |
| ABN | 91 426 380 524 |
| Email | info@claritasacademics.com |
| Phone | +61 406 227 992 |
| Instagram | @claritas_academics |
| Location | Sydney, NSW, Australia |
