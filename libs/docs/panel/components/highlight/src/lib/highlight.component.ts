import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { MskHighlightComponent } from '@msk/shared/ui/highlight';

@Component({
  selector: 'doc-highlight',
  templateUrl: './highlight.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MskHighlightComponent],
})
export class DocHighlightComponent {}
