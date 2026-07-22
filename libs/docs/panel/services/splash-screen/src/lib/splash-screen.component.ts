import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MskHighlightComponent } from '@msk/shared/ui/highlight';

@Component({
  selector: 'doc-splash-screen',
  templateUrl: './splash-screen.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MskHighlightComponent],
})
export class DocsSplashScreenComponent {}
