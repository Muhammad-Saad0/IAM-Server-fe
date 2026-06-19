import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const authenticated = await auth.initialize();

  if (authenticated) {
    return true;
  }

  if (auth.errorMessage()) {
    return router.createUrlTree(['/auth/error']);
  }

  auth.login(state.url);
  return false;
};
