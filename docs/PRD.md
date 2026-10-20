# Product Requirements Document (PRD) & Product Brief

**Project Name:** Japam (జపం / जपम्)  
**Document Version:** 1.0.0  
**Target Platform:** Mobile (Android & iOS — Primary viewport: 390 × 844)  
**Status:** In Active Design & Prototype Iteration  
**Brand Essence:** Calm, Devotional, Distraction-Free, Sacred Craftsmanship

---

## 1. Executive Summary & Vision

### 1.1 Vision Statement
**Japam** is a modern digital sanctuary designed to accompany devotees through daily japa and mantra sadhana. It bridges timeless Vedic ritual with intuitive, tactile mobile design, replacing complex, ad-cluttered interfaces with an experience as calm and revered as holding a physical mala in a quiet sanctum.

### 1.2 Target Audience
* **Traditional Practitioners & Elders:** Users seeking a frictionless, ultra-legible digital counter that honors traditional counts (108, 54, 27) without technological barriers or overwhelming menus.
* **Modern Sadhakas & Busy Professionals:** Individuals seeking to build a consistent daily chanting habit with subtle reminders, streak tracking, and peaceful night meditation modes.
* **Multi-lingual Users:** Practitioners across linguistic traditions (Sanskrit, Telugu, Hindi, Tamil, English) who revere scripture in its authentic script.

### 1.3 Core Value Propositions
1. **Sacred Tactility:** Haptic feedback tuned to mimic the tactile sensation of sliding a rudraksha bead.
2. **Zero Distraction:** Clean, ad-free canvas designed to deepen focus rather than demand attention.
3. **Accessibility First:** High-contrast serif typography, large tap zones, and multi-script Devanagari and Telugu typographic fidelity.
4. **Circadian Continuity:** Seamless transition between warm dawn sunlight aesthetics and deep maroon-gold night sadhana mode.

---

## 2. Product Architecture & User Journey

```
                        ┌────────────────────────┐
                        │   Splash Screen (ॐ)    │
                        └───────────┬────────────┘
                                    │
                        ┌───────────▼────────────┐
                        │   Language Selection   │
                        │ (EN, TE, HI, TA, etc.) │
                        └───────────┬────────────┘
                                    │
                        ┌───────────▼────────────┐
                        │  Onboarding 1, 2, 3    │
                        │ (Tap, Mala, Streaks)   │
                        └───────────┬────────────┘
                                    │
          ┌─────────────────────────┴────────────────────────┐
          │                                                  │
┌─────────▼─────────┐    ┌───────────────────┐    ┌──────────▼────────┐    ┌───────────────────┐
│  Chanting Counter │◄───┤   Mantra Library  │    │  Progress & Goals │    │     Settings      │
│ (Primary Surface) │    │(Vedic, Devi, Shiva│    │(Streaks, History) │    │ (Mala Size, Theme)│
└─────────┬─────────┘    └───────────────────┘    └──────────┬────────┘    └───────────────────┘
          │                                                  │
          └─────────────────────────┬────────────────────────┘
                                    │
                        ┌───────────▼────────────┐
                        │ Japam Divine (Premium) │
                        │  Paywall & Sadhana Pro │
                        └────────────────────────┘
```

---

## 3. Screen Inventory & Detailed Specifications

### 3.1 Splash Screen (`/splash`)
* **Purpose:** Sets the devotional atmosphere immediately upon app launch.
* **Visual Elements:**
  * Sacred centerpiece: Brass oil diya with lotus petal pedestal, scaled as the focal anchor.
  * Flame element: Luminous teardrop flame seated precisely on the central wick with gentle CSS keyframe flickering.
  * Sacred Om: Authentic Devanagari **ॐ** glyph (`Noto Sans Devanagari`), rendered in deep temple maroon (`#5A1A12`) with subtle golden stroke and radiance.
  * Background: Subtle concentric sacred geometry / yantra line-art with warm dawn sunrise glow.
  * Typography: "Japam" in `Noto Serif`, tagline *"Chant. Count. Grow."* and high-contrast *"Morning Sadhana"* anchor.

### 3.2 Language Selection (`/onboarding/language`)
* **Purpose:** Welcomes diverse regional devotees and configures primary typography and scripture rendering.
* **Options Supported:** English, Telugu (తెలుగు), Hindi (हिन्दी), Tamil (தமிழ்), Kannada (ಕನ್ನಡ), Gujarati (ગુજરાતી), Marathi (मराठी).
* **Key Interaction:** Immediate visual confirmation card with native script sample mantra.

### 3.3 Onboarding Flow (3 Steps)
1. **Screen 1: "Tap to Chant":** Shows realistic tactile hand rolling a warm rudraksha mala bead, explaining full-screen tap-to-count interaction with subtle haptics.
2. **Screen 2: "Complete Your Mala":** Explains the significance of the 108 beads, the Meru bead marker, and automatic round tracking.
3. **Screen 3: "Set Goals & Build Streak":** Introduces daily sankalpa (resolve), gentle morning/evening sandhya reminders, and practice streaks.

### 3.4 The Meditative Counter (`/counter`) — Primary Surface
* **Purpose:** The core interaction loop of the application.
* **Layout & Minimalist Mode:**
  * **Distraction-Free Workspace:** Primary screen dedicated entirely to chanting.
  * **Digital Mala Ring:** Visual circular ring composed of beads with active illuminated glow tracking current count.
  * **Central Metrics:** Focused counter number (e.g. `27 / 108`), round indicator (e.g., `Round 1 of 3`), and active mantra name (*"Om Namah Shivaya"*).
  * **Interaction Design:**
    * Any-screen tap increments the counter.
    * Optional swipe gesture simulating rolling beads downward.
    * Calibrated haptic vibration on each bead; distinct dual-pulse vibration on Meru bead (108 completion).
    * Silent mode & bell chime toggle on completion.

### 3.5 Mantra Library (`/mantras`)
* **Purpose:** Curated and personalized chant repository.
* **Categorization:**
  * Peace & Healing (Mahamrityunjaya, Gayatri Mantra)
  * Focus & Wisdom (Saraswati Vandana, Om Ganeshaya Namah)
  * Devotional & Surrender (Hare Krishna Mahamantra, Om Namo Narayanaya)
  * Custom Mantras: Add personal guru-given mantras with audio recording and custom target count.
* **Detail Card:** Shows Devanagari/Telugu original text, English transliteration, word-by-word meaning, and prescribed auspicious repetition count.

### 3.6 Sadhana Progress & Insights (`/progress`)
* **Purpose:** Encourages disciplined sadhana without vanity metrics or gamification stress.
* **Features:**
  * Total counts completed (Lifetime Malas, Chants).
  * Daily Streak & Sankalpa Tracker with calendar moon-phase indicators (Purnima, Amavasya, Ekadashi markers).
  * Weekly & monthly time invested in meditation.

### 3.7 Settings (`/settings`)
* **Key Configurations:**
  * **Mala Size:** 108 (Standard), 54 (Half), 27 (Quarter), or Custom count.
  * **Haptic Intensity:** Subtle, Medium, Pronounced, or Off.
  * **Chime Audio:** Tibetan Singing Bowl, Temple Bell, Shankha, or Mute.
  * **Theme:** Light (Dawn Temple / Saffron & Cream), Dark (Ratri Sadhana / Maroon-Black & Gold), or System Match.
  * **Data Privacy & Backup:** Local offline storage with encrypted private cloud backup.

### 3.8 Premium Experience: Japam Divine (`/premium`)
* **Value Offering:** Guided sadhana audio sessions, rare Vedic stotras, personalized astrological muhurta alerts, and unlimited cloud journal notes.
* **Tone:** Respectful, dignified, not aggressive. Clear trial options (Annual vs. Lifetime Offering) with quiet dismissal.

---

## 4. Visual Design System & Brand Identity

### 4.1 Color Palettes

| Role | Light Theme (Dawn Sanctuary) | Night Theme (Ratri Sadhana) |
|---|---|---|
| **Background / Canvas** | `#FFF8F0` (Sanctum Cream) | `#1A0908` / `#200E0C` (Deep Temple Maroon-Black) |
| **Card Surface** | `#FCF3E2` (Warm Sandalwood) | `#2A1614` (Burnished Teakwood) |
| **Primary Accent** | `#E8751A` (Sacred Saffron) | `#F5D77F` (Luminous Temple Gold) |
| **Primary Text** | `#4A1510` / `#5A1A12` (Temple Maroon) | `#FFF5E6` (Warm Parchment Ivory) |
| **Secondary Text** | `#8C6556` (Soft Ochre Earth) | `#C4A482` (Muted Sandalwood) |
| **Highlights & Borders** | `#D4AF37` (Auspicious Gold) | `#FFB347` (Glow Amber) |

### 4.2 Typography Hierarchy
* **Title & Headlines:** `Noto Serif` / `Playfair Display` — Dignified, reverent, and classic.
* **Body & UI Controls:** `Noto Sans` — Crystal-clear legibility across small screens and elderly user groups.
* **Sacred Glyphs:** `Noto Sans Devanagari` & `Noto Sans Telugu` — Exact phonetic and traditional ligatures.

---

## 5. Non-Functional & Technical Requirements

* **Zero Latency Tap Response:** Counter must increment with `< 16ms` latency to ensure zero haptic or visual lag during rapid chanting.
* **100% Offline Capability:** Complete chanting, mala tracking, and local progress storage must function seamlessly without internet connectivity.
* **Battery Efficiency (OLED):** Night mode must take full advantage of true dark surfaces (`#1A0908` / `#000000`) for low power drain during extended early-morning or late-night meditation.
* **Accessibility Compliance:** WCAG AAA contrast ratio for core counter figures; minimum tap target of `56x56dp`.

---

## 6. Release Roadmap & Milestones

* **Milestone 1 (MVP Complete):** Core 9 screens designed, splash alignment perfected, high-precision SVG/Unicode Om emblem integrated.
* **Milestone 2 (Interactive Polish):** Audio chanting sync, customizable haptic curves, widget for Android/iOS lock screens.
* **Milestone 3 (Community & Temple Sync):** Group chant pledges (Akhanda Japam) and sacred calendar integration.
