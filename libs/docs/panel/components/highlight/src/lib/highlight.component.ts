import { Component, ViewEncapsulation } from '@angular/core';
import { MskHighlightComponent } from '@msk/shared/ui/highlight';

@Component({
  selector: 'doc-highlight',
  templateUrl: './highlight.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [MskHighlightComponent],
})
export class DocHighlightComponent {}
