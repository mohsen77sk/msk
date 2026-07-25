import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'mz-customers',
  templateUrl: './customers.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet],
})
export class CustomersComponent {}
