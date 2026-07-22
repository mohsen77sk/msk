import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { MskAlertComponent } from '@msk/shared/ui/alert';
import { MskHighlightComponent } from '@msk/shared/ui/highlight';

@Component({
  selector: 'doc-navigation',
  templateUrl: './navigation.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MskAlertComponent, MskHighlightComponent],
})
export class DocNavigationComponent {}
