# Management Forms Design

## Goal

Add frontend management flows for creating IAM accounts and OAuth clients from the authenticated admin UI.

## Routing

The existing dashboard at `/` stays protected by OIDC. It links to two new protected pages:

- `/accounts/new`
- `/oauth-clients/new`

`/docs`, `/oauth/callback`, and `/auth/error` remain public.

## API Integration

Create a frontend management API service that calls the backend issuer configured in `public/iam-config.js`.

- `POST {issuer}/api/management/accounts`
- `POST {issuer}/api/management/oauth-clients`

Every request sends the current OIDC access token as `Authorization: Bearer <token>`. If no valid access token exists, the request fails client-side with an authentication message rather than sending an unauthenticated API call.

## Account Creation Page

Fields:

- Email
- Initial password
- Roles: `USER`, `ADMIN`

Client-side validation mirrors the backend at a basic level:

- email is required and email-shaped
- password is required, 8 to 128 characters
- at least one role is selected

On success, show the created account response: `id`, `email`, `status`, `roles`, and `createdAt`. On failure, show the backend API error message and code when present.

## OAuth Client Creation Page

Fields:

- Client name
- Redirect URIs, one per line
- Scopes: `openid`, `email`

Client-side behavior:

- requires at least one redirect URI
- trims and removes duplicate redirect URI lines
- always includes `openid`
- only exposes `openid` and `email`; it does not expose `iam.manage` or `profile`

On success, show `clientId`, `clientName`, `clientIdIssuedAt`, `redirectUris`, and effective `scopes`.

## UI Approach

Use standalone Angular components, reactive forms, the existing Taiga cards/buttons/icons, and native form controls styled with local SCSS. Avoid adding frontend tests per user instruction.

## Verification

Run:

- `npm run build`

Backend verification remains separate from this frontend implementation.
