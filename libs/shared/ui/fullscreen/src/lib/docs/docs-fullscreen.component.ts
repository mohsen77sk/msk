import { Component, ViewEncapsulation } from '@angular/core';
import { MskHighlightComponent } from '@msk/shared/ui/highlight';

@Component({
  standalone: true,
  selector: 'msk-docs-fullscreen',
  templateUrl: './docs-fullscreen.component.html',
  styleUrl: './docs-fullscreen.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [MskHighlightComponent],
})
export class MskDocsFullscreenComponent {}
