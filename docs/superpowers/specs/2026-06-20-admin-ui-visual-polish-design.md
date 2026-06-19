# Admin UI Visual Polish Design

## Goal

Make the admin UI feel like a professional IAM management console without changing the underlying OIDC or management API flows.

## Typography

Use `Inter` as the primary interface typeface for clear, modern product UI text. Use `JetBrains Mono` for technical values such as IDs, timestamps, redirect URIs, and client IDs.

Load both font families from Google Fonts in `src/index.html` and define reusable CSS custom properties in `src/styles.scss`.

## Visual Direction

Use a darker, more controlled background treatment with subtle radial gradients, glass-like panels, precise borders, and soft shadows. Cards should have clearer hierarchy, stronger hover states, and tighter spacing.

## Scope

Change only frontend presentation:

- global typography and body rendering
- dashboard layout/card styling
- management form/page styling
- small markup class additions where needed for technical text

No frontend tests are required for this visual-only change.

## Verification

Run `npm run build`.
