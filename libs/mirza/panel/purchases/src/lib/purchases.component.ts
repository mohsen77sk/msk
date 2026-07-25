import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'mz-purchases',
  templateUrl: './purchases.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet],
})
export class PurchasesComponent {}
