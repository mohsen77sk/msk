import { Component, ViewEncapsulation } from '@angular/core';
import { MskHighlightComponent } from '../highlight.component';

@Component({
  selector: 'msk-docs-highlight',
  templateUrl: './docs-highlight.component.html',
  styleUrl: './docs-highlight.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [MskHighlightComponent],
})
export class MskDocsHighlightComponent {}
