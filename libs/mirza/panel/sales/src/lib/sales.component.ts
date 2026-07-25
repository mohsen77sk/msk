import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'mz-sales',
  templateUrl: './sales.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet],
})
export class SalesComponent {}
