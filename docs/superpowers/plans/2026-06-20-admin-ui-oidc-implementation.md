# Admin UI OIDC Authentication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Protect the Angular admin UI with IAM Authorization Code + PKCE login while keeping `/docs` public and leaving management API integration out of scope.

**Architecture:** `angular-oauth2-oidc` provides protocol handling, backed by `sessionStorage`. A focused `AuthService` owns initialization and redirects; a functional route guard protects application routes; public callback and error components complete the browser flow. The backend bootstrap updates the existing `admin-ui` registration in place with local and production callback/logout URLs.

**Tech Stack:** Angular 19 standalone APIs, Angular Router, Taiga UI, `angular-oauth2-oidc` 19, Spring Authorization Server, Maven.

---

## File Structure

- `src/app/auth/iam-runtime-config.ts`: typed runtime IAM issuer configuration.
- `src/app/auth/auth.service.ts`: OIDC initialization, session state, login, claims, and logout.
- `src/app/auth/auth.guard.ts`: protects non-public routes and starts login.
- `src/app/auth/oauth-callback.component.ts`: completes authorization response and routes home.
- `src/app/auth/auth-error.component.ts`: renders authentication failures and retry action.
- `src/app/home/home.component.{ts,html,scss}`: minimal protected admin home.
- `src/app/app.config.ts`: provides HTTP, OAuth client, and blocking initial router navigation.
- `src/app/app.routes.ts`: declares public and protected route boundaries.
- `public/iam-config.js`: deployment-overridable issuer default.
- `vercel.json`: SPA fallback for direct callback and route navigation.
- `angular.json`: development server port `3000`.
- `src/main/java/.../OAuth2ClientBootstrap.java`: preserves and augments `admin-ui`.
- `src/test/java/.../OAuth2ClientBootstrapTest.java`: verifies backend registration augmentation.

### Task 1: Install and configure the OIDC client dependency

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/index.html`
- Create: `public/iam-config.js`
- Create: `src/app/auth/iam-runtime-config.ts`

- [ ] **Step 1: Install the Angular 19-compatible OIDC library**

Run:

```bash
npm install angular-oauth2-oidc@19.0.0
```

Expected: `package.json` and `package-lock.json` include `angular-oauth2-oidc` version `^19.0.0`.

- [ ] **Step 2: Add runtime issuer configuration**

Create `public/iam-config.js`:

```js
window.__IAM_CONFIG__ = {
  issuer: 'http://localhost:8080',
};
```

Load it before Angular in `src/index.html`:

```html
<script src="iam-config.js"></script>
```

Create `src/app/auth/iam-runtime-config.ts`:

```ts
export interface IamRuntimeConfig {
  readonly issuer: string;
}

declare global {
  interface Window {
    __IAM_CONFIG__?: Partial<IamRuntimeConfig>;
  }
}

export function iamRuntimeConfig(): IamRuntimeConfig {
  return {
    issuer: window.__IAM_CONFIG__?.issuer ?? 'http://localhost:8080',
  };
}
```

- [ ] **Step 3: Format changed frontend files**

Run:

```bash
npx prettier --write package.json src/index.html public/iam-config.js src/app/auth/iam-runtime-config.ts
```

Expected: command exits successfully.

### Task 2: Implement the authentication service

**Files:**
- Create: `src/app/auth/auth.service.ts`

- [ ] **Step 1: Implement single-flight OIDC initialization and session storage**

Create an injectable service that:

```ts
const origin = window.location.origin;

this.oauthService.setStorage(sessionStorage);
this.oauthService.configure({
  issuer: iamRuntimeConfig().issuer,
  redirectUri: `${origin}/oauth/callback`,
  postLogoutRedirectUri: `${origin}/`,
  clientId: 'admin-ui',
  responseType: 'code',
  scope: 'openid email iam.manage',
  requireHttps: 'remoteOnly',
  strictDiscoveryDocumentValidation: true,
  clearHashAfterLogin: true,
});
```

Its public interface is:

```ts
initialize(): Promise<boolean>;
login(targetUrl?: string): void;
logout(): void;
hasValidSession(): boolean;
email(): string | null;
roles(): readonly string[];
errorMessage(): string | null;
```

`initialize()` caches its active promise, runs `loadDiscoveryDocumentAndTryLogin()`,
returns whether an access token is valid, and records a concise message on failure.
`login()` calls `initCodeFlow(targetUrl ?? '/')`. `logout()` calls `logOut()`.
Claims are read from `getIdentityClaims()` and safely handle absent or malformed values.

- [ ] **Step 2: Format the service**

Run:

```bash
npx prettier --write src/app/auth/auth.service.ts
```

Expected: command exits successfully.

### Task 3: Add callback, error, and guard flow

**Files:**
- Create: `src/app/auth/auth.guard.ts`
- Create: `src/app/auth/oauth-callback.component.ts`
- Create: `src/app/auth/auth-error.component.ts`

- [ ] **Step 1: Implement the protected-route guard**

Create a functional `CanActivateFn` that awaits `AuthService.initialize()`. If valid,
return `true`. If initialization failed, return `router.createUrlTree(['/auth/error'])`.
Otherwise call `auth.login(state.url)` and return `false`.

- [ ] **Step 2: Implement the callback component**

Create a standalone component with a small “Completing sign in…” view. On initialization:

1. Await `AuthService.initialize()`.
2. If authenticated, navigate to `/` with `replaceUrl: true`.
3. Otherwise navigate to `/auth/error` with `replaceUrl: true`.

- [ ] **Step 3: Implement the public error component**

Create a standalone Taiga UI error card that displays `AuthService.errorMessage()` and a
retry button calling `AuthService.login('/')`.

- [ ] **Step 4: Format auth flow files**

Run:

```bash
npx prettier --write src/app/auth/auth.guard.ts src/app/auth/oauth-callback.component.ts src/app/auth/auth-error.component.ts
```

Expected: command exits successfully.

### Task 4: Add the protected admin home and route boundaries

**Files:**
- Create: `src/app/home/home.component.ts`
- Create: `src/app/home/home.component.html`
- Create: `src/app/home/home.component.scss`
- Modify: `src/app/app.routes.ts`
- Modify: `src/app/app.config.ts`

- [ ] **Step 1: Create the protected home**

Create a standalone Taiga UI component that renders:

- “Admin UI”
- `AuthService.email()`
- role badges from `AuthService.roles()`
- a logout button calling `AuthService.logout()`
- a link to `/docs`

Do not add HTTP calls or management API models.

- [ ] **Step 2: Configure route boundaries**

Set routes in this order:

```ts
[
  { path: 'docs', loadComponent: ... },
  { path: 'oauth/callback', loadComponent: ... },
  { path: 'auth/error', loadComponent: ... },
  { path: '', pathMatch: 'full', canActivate: [authGuard], loadComponent: ... },
  { path: '**', redirectTo: '' },
]
```

- [ ] **Step 3: Provide OAuth and HTTP support**

Update `app.config.ts` providers:

```ts
provideHttpClient(),
provideOAuthClient(),
provideRouter(routes, withEnabledBlockingInitialNavigation()),
provideTaiga(),
```

- [ ] **Step 4: Format application files**

Run:

```bash
npx prettier --write src/app/app.config.ts src/app/app.routes.ts src/app/home
```

Expected: command exits successfully.

### Task 5: Configure local and production routing

**Files:**
- Modify: `angular.json`
- Create: `vercel.json`
- Modify: `README.md`

- [ ] **Step 1: Set Angular development port**

Add `"port": 3000` under `projects.iam-server-fe.architect.serve.options`.

- [ ] **Step 2: Add Vercel SPA fallback**

Create:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- [ ] **Step 3: Document runtime configuration**

Update the README to use `http://localhost:3000`, explain `public/iam-config.js`, and
state that production deployment must set the IAM issuer in the deployed runtime config.

- [ ] **Step 4: Format configuration**

Run:

```bash
npx prettier --write angular.json vercel.json README.md
```

Expected: command exits successfully.

### Task 6: Update the backend `admin-ui` registration in place

**Files:**
- Modify: `../iam-Server-be/src/main/java/com/example/iam/auth/adapter/in/bootstrap/OAuth2ClientBootstrap.java`
- Modify: `../iam-Server-be/src/test/java/com/example/iam/auth/adapter/in/bootstrap/OAuth2ClientBootstrapTest.java`

- [ ] **Step 1: Extend the existing backend test**

Assert an existing client keeps its original redirect URI and settings while gaining:

```text
http://localhost:3000/oauth/callback
https://iam-server-fe.vercel.app/oauth/callback
http://localhost:3000/
https://iam-server-fe.vercel.app/
iam.manage
```

- [ ] **Step 2: Verify the backend test fails**

Run:

```bash
cd ../iam-Server-be
./mvnw -Dtest=OAuth2ClientBootstrapTest test
```

Expected: failure because callback and post-logout URLs are absent.

- [ ] **Step 3: Augment the client registration**

Replace the scope-only helper with a helper that builds from the existing client and adds
all missing scopes, redirect URIs, and post-logout redirect URIs. Save only when the
augmented registration differs. New registrations include all local and production URLs.

- [ ] **Step 4: Verify the backend test passes**

Run:

```bash
./mvnw -Dtest=OAuth2ClientBootstrapTest test
```

Expected: one passing test.

### Task 7: Build and integrated verification

**Files:**
- No additional files required.

- [ ] **Step 1: Build the Angular application**

Run:

```bash
cd ../iam-Server-fe
npm run build
```

Expected: production build succeeds. Frontend unit tests are intentionally not run per
the user requirement.

- [ ] **Step 2: Run the backend suite**

Run:

```bash
cd ../iam-Server-be
OAUTH2_JWK_PRIVATE_KEY_PATH="$PWD/secrets/iam-oauth-private.pem" \
OAUTH2_JWK_PUBLIC_KEY_PATH="$PWD/secrets/iam-oauth-public.pem" \
./mvnw clean test
```

Expected: all backend tests pass while preserving pre-existing uncommitted docs-removal
changes.

- [ ] **Step 3: Verify persisted client registration**

Start the backend once or run its context test, then inspect `admin-ui` and confirm all
four redirect/logout URLs and `iam.manage` are present without changing its ID or settings.

- [ ] **Step 4: Manual browser verification**

Run Angular on port `3000` and verify:

1. `/docs` opens without authentication.
2. `/` redirects to IAM login.
3. Mixed-case email login succeeds.
4. IAM returns to `/oauth/callback`, then `/`.
5. Refreshing `/` remains authenticated.
6. The home page shows email and roles.
7. Logout passes through IAM and returns to `/`.

