# Admin UI Visual Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply professional typography and sleeker admin-console styling to the dashboard and management forms.

**Architecture:** Keep Angular behavior unchanged and polish presentation through global CSS variables plus component-level SCSS. Add only minimal template classes for technical values.

**Tech Stack:** Angular standalone components, Taiga UI, SCSS, Google Fonts.

---

### Task 1: Add typography foundation

**Files:**

- Modify: `src/index.html`
- Modify: `src/styles.scss`

- [ ] Load `Inter` and `JetBrains Mono` from Google Fonts.
- [ ] Add global font variables and body text rendering.

### Task 2: Polish dashboard

**Files:**

- Modify: `src/app/home/home.component.html`
- Modify: `src/app/home/home.component.scss`

- [ ] Add a professional dashboard header hierarchy and technical text classes.
- [ ] Improve dashboard card, identity panel, and management action card styling.

### Task 3: Polish management pages

**Files:**

- Modify: `src/app/management/create-account.component.html`
- Modify: `src/app/management/create-oauth-client.component.html`
- Modify: `src/app/management/management-form.scss`

- [ ] Improve page shell, card, input, checkbox, feedback, and technical-value styling.

### Task 4: Verify and commit

**Files:**

- All changed frontend files.

- [ ] Run Prettier over changed files.
- [ ] Run `npm run build`.
- [ ] Commit the frontend visual polish changes.
