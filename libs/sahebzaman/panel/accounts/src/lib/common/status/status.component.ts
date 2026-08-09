import { booleanAttribute, Component, HostBinding, input, ViewEncapsulation } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'sz-accounts-status',
  templateUrl: './status.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [TranslocoDirective],
  host: {
    class: 'flex text-label-small rounded-full px-2 py-0.5',
  },
})
export class AccountsStatusComponent {
  value = input(true, { transform: booleanAttribute });

  @HostBinding('class')
  get hostClass() {
    if (this.value()) {
      return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
    } else {
      return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
    }
  }
}
