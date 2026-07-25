import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'mz-payment-types',
  templateUrl: './payment-types.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet],
})
export class PaymentTypesComponent {}
