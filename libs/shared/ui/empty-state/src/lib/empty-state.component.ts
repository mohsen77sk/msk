import { ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'msk-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.css',
  exportAs: 'mskEmptyState',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatCardModule, MatButtonModule],
})
export class MskEmptyStateComponent {
  private _translocoService = inject(TranslocoService);

  icon = input<string>('inbox');
  title = input<string>(this._translocoService.translate('empty-state.title'));
  desc = input<string>(this._translocoService.translate('empty-state.desc'));
}
