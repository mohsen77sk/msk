import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'mz-expenses',
  templateUrl: './expenses.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet],
})
export class ExpensesComponent {}
