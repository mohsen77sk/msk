import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'msk-state-chip',
  templateUrl: './state-chip.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
})
export class MskStateChipComponent {
  private _translocoService = inject(TranslocoService);

  checked = input(false, { transform: booleanAttribute });
  label = input<string | undefined>();

  labelValue = computed(() => {
    const label = this.label();
    const isChecked = !!this.checked();
    if (label && isChecked) {
      return label;
    }

    if (isChecked) {
      return this._translocoService.translate('on');
    } else {
      return this._translocoService.translate('off');
    }
  });
}
