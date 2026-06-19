import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TuiLoader } from '@taiga-ui/core';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-oauth-callback',
  imports: [TuiLoader],
  template: `
    <main class="callback-shell">
      <tui-loader size="xl" />
      <h1>Completing sign in…</h1>
      <p>IAM Server is validating your authorization response.</p>
    </main>
  `,
  styles: `
    :host {
      display: grid;
      min-height: 100dvh;
      place-items: center;
      background: var(--tui-background-base);
    }

    .callback-shell {
      display: grid;
      justify-items: center;
      gap: 1rem;
      padding: 2rem;
      text-align: center;
    }

    h1,
    p {
      margin: 0;
    }

    p {
      color: var(--tui-text-secondary);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OAuthCallbackComponent implements OnInit {
  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    const authenticated = await this.auth.initialize();
    await this.router.navigateByUrl(authenticated ? '/' : '/auth/error', { replaceUrl: true });
  }
}
