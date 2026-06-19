import { Routes } from '@angular/router';

import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'docs',
    title: 'IAM Server Docs',
    loadComponent: () => import('./docs/docs.component').then((module) => module.DocsComponent),
  },
  {
    path: 'oauth/callback',
    title: 'Completing sign in',
    loadComponent: () =>
      import('./auth/oauth-callback.component').then((module) => module.OAuthCallbackComponent),
  },
  {
    path: 'auth/error',
    title: 'Authentication error',
    loadComponent: () =>
      import('./auth/auth-error.component').then((module) => module.AuthErrorComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    canActivate: [authGuard],
    title: 'Admin UI',
    loadComponent: () => import('./home/home.component').then((module) => module.HomeComponent),
  },
  {
    path: 'accounts/new',
    canActivate: [authGuard],
    title: 'Create account',
    loadComponent: () =>
      import('./management/create-account.component').then(
        (module) => module.CreateAccountComponent,
      ),
  },
  {
    path: 'oauth-clients/new',
    canActivate: [authGuard],
    title: 'Create OAuth client',
    loadComponent: () =>
      import('./management/create-oauth-client.component').then(
        (module) => module.CreateOAuthClientComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
