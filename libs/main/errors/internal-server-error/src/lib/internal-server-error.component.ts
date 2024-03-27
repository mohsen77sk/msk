import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@ngneat/transloco';

@Component({
  standalone: true,
  selector: 'main-internal-server-error',
  templateUrl: './internal-server-error.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslocoDirective],
})
export class InternalServerErrorComponent {}
