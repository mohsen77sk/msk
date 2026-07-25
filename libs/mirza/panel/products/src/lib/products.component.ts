import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'mz-products',
  templateUrl: './products.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet],
})
export class ProductsComponent {}
