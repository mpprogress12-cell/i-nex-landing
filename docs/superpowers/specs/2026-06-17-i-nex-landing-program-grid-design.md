# I-NEX Landing — Program Grid Design

**Date:** 2026-06-17  
**Project:** `projects/i-nex-landing`  
**Scope:** Add 11-session overview to the landing page and update pricing heading.

---

## Goal

Integrate the content from `I-NEX_Огляд_11_сесій.html` into the existing I-NEX landing page as a compact program grid, plus update the pricing section heading.

---

## Changes

### 1. MAP Section (`#program`)

**Current state:** Section shows 3 methodology cards — Mine, Assemble, Perform.

**New state:** Replace those 3 cards with a compact grid of 11 session cards.

**Card content per session:**
- Session number (01–11)
- Ukrainian title
- Duration

**No phase grouping:** Sessions appear as a flat grid, not grouped by Foundation/Documentation/Implementation.

**Grid layout:**
- Desktop: 4 columns
- Tablet (≤900px): 2 columns
- Mobile (≤600px): 1 column

**Session 11 note:** It keeps the same card size as the others (no special spanning).

**Keep below the grid:** The existing 3 info blocks remain:
- Start date
- Participation (up to 2 people)
- Special conditions (first 5)

### 2. Pricing Section (`#pricing`)

**Current heading:** `Спецумови для тих, хто долучиться сьогодні`

**New heading:** `Спецумови для перших, хто долучиться`

Removes the word "сьогодні" and leads with "перших".

---

## Visual Design

- Use the existing dark navy MAP section background (`--navy: #0A0E1A`).
- Cards use the existing secondary navy (`--navy-soft: #161B2B`) with navy-line border.
- Session number in orange (`--orange: #FF6B00`), Montserrat 800.
- Title in white, Montserrat 700, ~15px.
- Duration in gray (`--gray-l: #9AA3B2`), Lato 13px.
- Card border-radius: 14px, padding: 20px.
- Gap between cards: 16px.
- Hover state: subtle border-color change to orange or lighter navy line.

---

## Files to Modify

- `index.html` — replace MAP cards with session grid; update pricing heading text.
- `css/styles.css` — add styles for `.session-grid` and `.session-card`.

---

## Out of Scope

- No click-to-expand behavior on session cards.
- No separate detail page for each session.
- No changes to registration form or other sections.
- No changes to the source PDF/HTML review document.
