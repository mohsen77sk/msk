import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'mz-layout-empty',
  templateUrl: './empty.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterOutlet],
})
export class LayoutEmptyComponent {}
