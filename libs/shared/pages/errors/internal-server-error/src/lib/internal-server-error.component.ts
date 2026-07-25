import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'msk-internal-server-error',
  templateUrl: './internal-server-error.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, TranslocoDirective],
})
export class InternalServerErrorComponent {}
