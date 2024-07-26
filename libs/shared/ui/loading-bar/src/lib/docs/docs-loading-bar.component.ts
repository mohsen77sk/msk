import { Component, ViewEncapsulation } from '@angular/core';
import { MskHighlightComponent } from '@msk/shared/ui/highlight';

@Component({
  standalone: true,
  selector: 'msk-docs-loading-bar',
  templateUrl: './docs-loading-bar.component.html',
  styleUrl: './docs-loading-bar.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [MskHighlightComponent],
})
export class MskDocsLoadingBarComponent {}
