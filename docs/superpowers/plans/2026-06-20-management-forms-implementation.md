# Management Forms Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build separate authenticated frontend pages for creating IAM accounts and OAuth clients through the management API.

**Architecture:** Add a small typed API service that derives its backend base URL from the configured IAM issuer and attaches the current OIDC access token. Add two standalone protected Angular pages using reactive forms, then link them from the dashboard.

**Tech Stack:** Angular standalone components, Angular reactive forms, Angular HttpClient, angular-oauth2-oidc, Taiga UI cards/buttons/icons.

---

### Task 1: Expose OIDC access token to API services

**Files:**

- Modify: `src/app/auth/auth.service.ts`

- [ ] Add a public `accessToken()` method that returns the current access token only when the OAuth service reports a valid access token.

- [ ] Run `npm run build` after all implementation tasks.

### Task 2: Add typed management API service

**Files:**

- Create: `src/app/management/management-api.service.ts`

- [ ] Define request/response interfaces for account creation, OAuth-client creation, and backend API errors.

- [ ] Implement `createAccount()` and `createOAuthClient()` using `HttpClient.post`.

- [ ] Derive the API base URL as `${iamRuntimeConfig().issuer}/api/management`.

- [ ] Attach `Authorization: Bearer <token>` using `AuthService.accessToken()`.

- [ ] Convert backend error responses into concise user-facing messages while preserving backend error codes.

### Task 3: Add account creation page

**Files:**

- Create: `src/app/management/create-account.component.ts`
- Create: `src/app/management/create-account.component.html`
- Create: `src/app/management/management-form.scss`

- [ ] Build a standalone reactive form for email, password, `USER`, and `ADMIN`.

- [ ] Submit to `ManagementApiService.createAccount()`.

- [ ] Display success response details and backend/client validation errors.

### Task 4: Add OAuth-client creation page

**Files:**

- Create: `src/app/management/create-oauth-client.component.ts`
- Create: `src/app/management/create-oauth-client.component.html`
- Modify: `src/app/management/management-form.scss`

- [ ] Build a standalone reactive form for client name, redirect URIs, and `email` scope.

- [ ] Always include `openid`.

- [ ] Submit to `ManagementApiService.createOAuthClient()`.

- [ ] Display success response details and backend/client validation errors.

### Task 5: Wire protected routes and dashboard links

**Files:**

- Modify: `src/app/app.routes.ts`
- Modify: `src/app/home/home.component.html`
- Modify: `src/app/home/home.component.scss`

- [ ] Add protected routes for `/accounts/new` and `/oauth-clients/new` using the existing `authGuard`.

- [ ] Replace the dashboard “later change” note with action cards linking to the new pages.

### Task 6: Verify and commit

**Files:**

- All modified frontend files.

- [ ] Run Prettier over changed frontend files.

- [ ] Run `npm run build`.

- [ ] Commit only frontend management-form integration changes, leaving backend and unrelated frontend work scoped as appropriate.
