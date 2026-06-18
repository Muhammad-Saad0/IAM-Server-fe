import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrl: './docs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsComponent {}
