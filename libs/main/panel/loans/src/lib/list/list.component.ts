import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { mskAnimations } from '@msk/shared/animations';

@Component({
  standalone: true,
  selector: 'main-loans-list',
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: mskAnimations,
  imports: [TranslocoDirective],
})
export class LoansListComponent {}
