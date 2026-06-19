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

The config selector reads one value from `.env` or the shell:

```env
IAM_CONFIG_ENV=local
```

It copies one of the static config files to `public/iam-config.js` before Angular starts:

- `local` -> `public/iam-config.local.js`
- `sandbox` -> `public/iam-config.sandbox.js`

If `IAM_CONFIG_ENV` is not set, it defaults to `local`.

```bash
npm start
IAM_CONFIG_ENV=sandbox npm start
```

Convenience scripts are also available:

```bash
npm run start:local
npm run start:sandbox
npm run build:local
npm run build:sandbox
```

For local machine defaults, copy `.env.example` to `.env` and set:

```env
IAM_CONFIG_ENV=local
```

Set `IAM_CONFIG_ENV=sandbox` in `.env` for sandbox.

`npm start` and `npm run build` copy the selected static config file to
`public/iam-config.js`. Restart the dev server after changing config selection. Do not
use plain `ng serve`, because it bypasses config selection.

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
