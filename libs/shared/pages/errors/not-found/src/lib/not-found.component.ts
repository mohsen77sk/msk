import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'msk-not-found',
  templateUrl: './not-found.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, TranslocoDirective],
})
export class NotFoundComponent {}
