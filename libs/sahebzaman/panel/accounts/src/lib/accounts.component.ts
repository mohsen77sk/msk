import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'sz-accounts',
  templateUrl: './accounts.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet],
})
export class AccountsComponent {}
