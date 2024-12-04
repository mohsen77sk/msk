import { NgClass } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  standalone: true,
  selector: 'main-accounts-status',
  templateUrl: './status.component.html',
  styles: 'main-accounts-status { display: flex }',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, MatIconModule, MatTooltipModule, TranslocoDirective],
})
export class AccountsStatusComponent {
  value = input(true, { transform: booleanAttribute });
}