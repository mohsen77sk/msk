import { Component, ViewEncapsulation } from '@angular/core';
import { MskHighlightComponent } from '@msk/shared/ui/highlight';

@Component({
  standalone: true,
  selector: 'msk-docs-navigation',
  templateUrl: './docs-navigation.component.html',
  styleUrl: './docs-navigation.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [MskHighlightComponent],
})
export class MskDocsNavigationComponent {}
