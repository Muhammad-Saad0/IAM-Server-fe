import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiButton, TuiIcon, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth-error',
  imports: [TuiButton, TuiCardLarge, TuiHeader, TuiIcon, TuiTitle],
  template: `
    <main class="error-shell">
      <section tuiCardLarge>
        <div class="error-icon"><tui-icon icon="@tui.circle-alert" /></div>
        <div tuiHeader="h3">
          <div tuiTitle>
            Sign-in could not be completed
            <span tuiSubtitle>{{
              auth.errorMessage() ?? 'Authentication was not completed.'
            }}</span>
          </div>
        </div>
        <button iconStart="@tui.refresh-cw" tuiButton type="button" (click)="auth.login('/')">
          Try again
        </button>
      </section>
    </main>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100dvh;
      background: var(--tui-background-base);
    }

    .error-shell {
      display: grid;
      min-height: 100dvh;
      padding: 1.5rem;
      place-items: center;
    }

    section {
      width: min(100%, 32rem);
      text-align: center;
    }

    .error-icon {
      display: grid;
      width: 4rem;
      height: 4rem;
      margin: 0 auto 1rem;
      place-items: center;
      color: var(--tui-status-negative);
      border-radius: 50%;
      background: var(--tui-status-negative-pale);
      font-size: 1.75rem;
    }

    button {
      margin-top: 1.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthErrorComponent {
  constructor(readonly auth: AuthService) {}
}
