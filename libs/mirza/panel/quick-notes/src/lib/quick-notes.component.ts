import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'mz-quick-notes',
  templateUrl: './quick-notes.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet],
})
export class QuickNotesComponent {}
