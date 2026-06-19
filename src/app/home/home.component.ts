import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';
import { TuiCardLarge, TuiSurface } from '@taiga-ui/layout';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, TuiBadge, TuiButton, TuiCardLarge, TuiIcon, TuiSurface],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  constructor(readonly auth: AuthService) {}
}
