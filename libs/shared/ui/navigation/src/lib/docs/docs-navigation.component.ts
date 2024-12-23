import { Component, ViewEncapsulation } from '@angular/core';
import { MskAlertComponent } from '@msk/shared/ui/alert';
import { MskHighlightComponent } from '@msk/shared/ui/highlight';

@Component({
  selector: 'msk-docs-navigation',
  templateUrl: './docs-navigation.component.html',
  styleUrl: './docs-navigation.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [MskAlertComponent, MskHighlightComponent],
})
export class MskDocsNavigationComponent {}
