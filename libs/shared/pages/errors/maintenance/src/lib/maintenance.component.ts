import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'msk-maintenance',
  templateUrl: './maintenance.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective],
})
export class MaintenanceComponent {}
