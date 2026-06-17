# I-NEX Landing Program Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a compact 11-session grid to the MAP section and update the pricing heading on the I-NEX landing page.

**Architecture:** Replace the existing 3 MAP methodology cards with a responsive grid of 11 session cards in `index.html`, add corresponding styles in `css/styles.css`, and update one heading string in the pricing section.

**Tech Stack:** Static HTML, CSS.

---

### Task 1: Update pricing section heading

**Files:**
- Modify: `index.html:190`

- [ ] **Step 1: Change heading text**

  Replace:
  ```html
  <h2>Спецумови для тих, хто долучиться сьогодні</h2>
  ```
  With:
  ```html
  <h2>Спецумови для перших, хто долучиться</h2>
  ```

- [ ] **Step 2: Verify the change**

  Run: `grep -n "Спецумови для перших" index.html`
  Expected output: line containing the new heading.

---

### Task 2: Replace MAP cards with session grid HTML

**Files:**
- Modify: `index.html:120-124`

- [ ] **Step 1: Remove existing MAP card grid**

  Delete the `div.map-grid` containing the three `.map-card` elements (Mine, Assemble, Perform).

- [ ] **Step 2: Insert session grid**

  Add the following markup immediately after the `div.section-header` inside `<section class="map" id="program">`:

  ```html
  <div class="session-grid">
    <div class="session-card">
      <div class="session-number">01</div>
      <h3 class="session-title">Технічне налаштування та огляд</h3>
      <div class="session-duration">30–40 хв</div>
    </div>
    <div class="session-card">
      <div class="session-number">02</div>
      <h3 class="session-title">Невидима структура бізнесу</h3>
      <div class="session-duration">40–50 хв</div>
    </div>
    <div class="session-card">
      <div class="session-number">03</div>
      <h3 class="session-title">Операційна система I-NEX</h3>
      <div class="session-duration">60–90 хв</div>
    </div>
    <div class="session-card">
      <div class="session-number">04</div>
      <h3 class="session-title">Здатність до розширення</h3>
      <div class="session-duration">60–90 хв</div>
    </div>
    <div class="session-card">
      <div class="session-number">05</div>
      <h3 class="session-title">Маркетинг і сила бренду</h3>
      <div class="session-duration">60–120 хв</div>
    </div>
    <div class="session-card">
      <div class="session-number">06</div>
      <h3 class="session-title">Метрики прибутковості</h3>
      <div class="session-duration">40–80 хв</div>
    </div>
    <div class="session-card">
      <div class="session-number">07</div>
      <h3 class="session-title">Досконалість пропозиції та продажів</h3>
      <div class="session-duration">75–115 хв</div>
    </div>
    <div class="session-card">
      <div class="session-number">08</div>
      <h3 class="session-title">Персонал і лідерство</h3>
      <div class="session-duration">60–120 хв</div>
    </div>
    <div class="session-card">
      <div class="session-number">09</div>
      <h3 class="session-title">Системи виконання</h3>
      <div class="session-duration">85–125 хв</div>
    </div>
    <div class="session-card">
      <div class="session-number">10</div>
      <h3 class="session-title">Міцна позиція на ринку</h3>
      <div class="session-duration">30–90 хв</div>
    </div>
    <div class="session-card">
      <div class="session-number">11</div>
      <h3 class="session-title">Стійка інтеграція AI</h3>
      <div class="session-duration">30–45 хв</div>
    </div>
  </div>
  ```

- [ ] **Step 3: Verify markup structure**

  Run: `grep -c "session-card" index.html`
  Expected output: `11`

---

### Task 3: Add session grid CSS

**Files:**
- Modify: `css/styles.css`

- [ ] **Step 1: Append session grid styles**

  Add the following CSS block at the end of `css/styles.css` (after the cookie/pricing styles):

  ```css
  /* ====== SESSION GRID ====== */
  .session-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:42px}
  .session-card{background:var(--navy-soft);border:1px solid var(--navy-line);border-radius:14px;padding:20px;transition:border-color .15s ease,transform .15s ease}
  .session-card:hover{border-color:rgba(255,107,0,.5);transform:translateY(-2px)}
  .session-number{font-family:var(--display);font-weight:800;font-size:28px;color:var(--orange);line-height:1}
  .session-title{font-family:var(--display);font-weight:700;font-size:15px;color:#fff;margin-top:12px;line-height:1.25}
  .session-duration{font-size:13px;color:var(--gray-l);margin-top:10px}
  @media (max-width:900px){.session-grid{grid-template-columns:repeat(2,1fr)}}
  @media (max-width:600px){.session-grid{grid-template-columns:1fr}}
  ```

- [ ] **Step 2: Verify styles loaded**

  Run: `grep -n "session-grid" css/styles.css`
  Expected output: line containing `.session-grid`.

---

### Task 4: Visual verification

**Files:**
- Preview: `index.html` in browser

- [ ] **Step 1: Open the landing page**

  Run: `start "" "file:///C:/Users/mppro/projects/i-nex-landing/index.html"` (Windows)
  Or open `http://localhost:51528` if the local preview server is running.

- [ ] **Step 2: Check MAP section**

  Scroll to the MAP / Program section and confirm:
  - 11 session cards are visible in a 4-column grid.
  - Each card shows number, title, and duration.
  - The 3 info blocks (start date, participation, special conditions) remain below the grid.
  - On narrow viewport, cards stack to 2 then 1 column.

- [ ] **Step 3: Check pricing heading**

  Scroll to the pricing section and confirm the heading reads:
  `Спецумови для перших, хто долучиться`

---

## Self-Review

- [ ] Spec coverage: session grid replaces MAP cards, no phase grouping, number+title+duration only, responsive grid, pricing heading update — all covered.
- [ ] Placeholder scan: no TBD/TODO/fill-in details.
- [ ] Type consistency: CSS classes match HTML classes.
