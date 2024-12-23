import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { mskAnimations } from '@msk/shared/animations';

@Component({
  selector: 'main-loans-list',
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: mskAnimations,
  imports: [],
})
export class LoansListComponent {}
