import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'mz-product-categories',
  templateUrl: './product-categories.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet],
})
export class ProductCategoriesComponent {}
