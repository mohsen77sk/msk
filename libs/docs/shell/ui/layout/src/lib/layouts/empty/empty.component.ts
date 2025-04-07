import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'doc-layout-empty',
  templateUrl: './empty.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet],
})
export class DocsLayoutEmptyComponent {}
