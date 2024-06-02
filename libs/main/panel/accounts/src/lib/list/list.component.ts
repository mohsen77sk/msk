import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { mskAnimations } from '@msk/shared/animations';
import { MskPageNameDirective } from '@msk/shared/directives/page-name';

@Component({
  standalone: true,
  selector: 'main-accounts-list',
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: mskAnimations,
  imports: [TranslocoDirective, MskPageNameDirective],
})
export class AccountsListComponent {}
