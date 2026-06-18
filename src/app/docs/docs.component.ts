import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiButton, TuiIcon, TuiNotification, TuiTitle } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader, TuiSurface } from '@taiga-ui/layout';

@Component({
  selector: 'app-docs',
  imports: [
    TuiBadge,
    TuiButton,
    TuiCardLarge,
    TuiHeader,
    TuiIcon,
    TuiNotification,
    TuiSurface,
    TuiTitle,
  ],
  templateUrl: './docs.component.html',
  styleUrl: './docs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsComponent {}
