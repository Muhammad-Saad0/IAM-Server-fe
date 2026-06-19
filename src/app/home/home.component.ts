import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiIcon, TuiTitle } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader, TuiSurface } from '@taiga-ui/layout';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    TuiBadge,
    TuiButton,
    TuiCardLarge,
    TuiHeader,
    TuiIcon,
    TuiSurface,
    TuiTitle,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  constructor(readonly auth: AuthService) {}
}
