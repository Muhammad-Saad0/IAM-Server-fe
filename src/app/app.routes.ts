import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'docs',
    title: 'IAM Server Docs',
    loadComponent: () => import('./docs/docs.component').then((module) => module.DocsComponent),
  },
];
