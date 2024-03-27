import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

@Component({
  standalone: true,
  selector: 'main-maintenance',
  templateUrl: './maintenance.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective],
})
export class MaintenanceComponent {}
