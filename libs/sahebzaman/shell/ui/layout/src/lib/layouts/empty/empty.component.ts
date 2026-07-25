import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'sz-layout-empty',
  templateUrl: './empty.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet],
})
export class LayoutEmptyComponent {}
