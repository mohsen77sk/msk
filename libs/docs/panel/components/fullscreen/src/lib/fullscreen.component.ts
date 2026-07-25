import { Component, ViewEncapsulation } from '@angular/core';
import { MskHighlightComponent } from '@msk/shared/ui/highlight';

@Component({
  selector: 'doc-fullscreen',
  templateUrl: './fullscreen.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [MskHighlightComponent],
})
export class DocFullscreenComponent {}
