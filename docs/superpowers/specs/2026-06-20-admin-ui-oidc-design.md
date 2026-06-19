# Admin UI OIDC Authentication Design

## Objective

Add OpenID Connect authentication to the Angular admin UI. Visiting `/` or any future
protected route without a valid session redirects the browser to the IAM login page.
The `/docs` route remains public.

This change covers browser authentication only. It does not call or integrate the
management APIs.

## Architecture

Use `angular-oauth2-oidc` with the OAuth 2.0 Authorization Code flow and PKCE.
The library owns discovery, state and nonce validation, code exchange, token parsing,
expiry checks, and RP-initiated logout.

Authentication state is exposed through a focused Angular service. Route guards depend
on that service rather than directly on the OIDC library.

## Configuration

- Client ID: `admin-ui`
- Requested scopes: `openid email iam.manage`
- Response type: `code`
- Token storage: `sessionStorage`
- Local frontend origin: `http://localhost:3000`
- Local redirect URI: `http://localhost:3000/oauth/callback`
- Production frontend origin: `https://iam-server-fe.vercel.app`
- Production redirect URI: `https://iam-server-fe.vercel.app/oauth/callback`
- Local IAM issuer: `http://localhost:8080`

The frontend selects its redirect URI from `window.location.origin`. The issuer is
provided through frontend configuration, defaulting to the local IAM issuer for
development.

Angular's development server runs on port `3000`.

## Routing and Startup

- `/docs` is public.
- `/oauth/callback` processes the authorization response and returns the user to `/`.
- `/` and all other application routes are protected by an authentication guard.
- On protected navigation, the application first loads discovery metadata and attempts
  to restore or complete an existing login.
- If no valid access token exists, the application starts the authorization-code flow.
- Guard logic avoids starting another redirect while a callback is already being
  processed.

## Session Behavior

Tokens are stored in `sessionStorage`. Authentication therefore survives page refreshes
in the same tab but is not persisted after the tab or browser session is closed.

The authenticated home page reads the email and roles claims from the ID token. It
contains no management data or management API calls.

## Logout

Logout clears local authentication state and starts IAM RP-initiated logout. IAM returns
the browser to the frontend root URL. Because `/` is protected, a user whose IAM session
still exists may authenticate again according to the authorization server's session
state.

## Backend Client Registration

Update the existing `admin-ui` bootstrap in place:

- Preserve its ID, client ID, issue time, name, grants, authentication methods, scopes,
  token settings, and client settings.
- Add both local and production callback URLs.
- Add both local and production post-logout redirect URLs.
- Continue requiring PKCE and no consent prompt.

No management endpoint behavior changes are included.

## User Interface

Add a minimal protected home page that displays:

- A clear Admin UI heading.
- The authenticated user's email.
- The authenticated user's roles when present.
- A logout action.

Existing documentation remains visually and functionally unchanged except for any
configuration text that must reflect port `3000` and the production callback.

## Error Handling

- Discovery or callback failures show a concise authentication error page with a retry
  action.
- Invalid or expired local tokens cause a new authorization redirect.
- Callback query parameters are removed through normal router navigation after the code
  has been processed.
- Redirect loops are prevented by tracking initialization and callback processing in the
  authentication service.

## Verification

No new frontend tests are required.

Verification consists of:

- Running the Angular production build.
- Running the backend Maven suite after updating the client bootstrap.
- Manually verifying unauthenticated `/` redirects to IAM.
- Verifying successful login returns to `/`.
- Verifying refresh preserves login in the same tab.
- Verifying `/docs` remains public.
- Verifying logout passes through IAM and returns to the frontend.
- Verifying the production callback is present in the persisted `admin-ui` registration.
