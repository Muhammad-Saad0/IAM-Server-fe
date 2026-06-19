# IamServerFe

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.0.3.

## Development server

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:3000/`.
Unauthenticated visits to `/` start the IAM Authorization Code + PKCE flow. Documentation
remains public at `http://localhost:3000/docs`.

## IAM configuration

The browser loads `public/iam-config.js` before Angular starts:

```js
window.__IAM_CONFIG__ = {
  issuer: 'http://localhost:8080',
  apiBaseUrl: 'http://localhost:8080/api/management',
};
```

For local development, copy `.env.example` to `.env` and set:

```env
IAM_ISSUER=http://localhost:8080
IAM_API_BASE_URL=http://localhost:8080/api/management
```

`npm start` and `npm run build` generate `public/iam-config.js` from `.env`.
Production deployment must publish equivalent runtime config with the deployed IAM issuer
and management API base URL. The admin UI uses these callback URLs:

```text
http://localhost:3000/oauth/callback
https://iam-server-fe.vercel.app/oauth/callback
```

Tokens are stored in `sessionStorage`, so authentication survives refreshes in the same
tab but is cleared when the browser session ends.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
npm run build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
