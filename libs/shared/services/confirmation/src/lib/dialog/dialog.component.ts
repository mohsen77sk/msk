import { Component, inject, ViewEncapsulation } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MskConfirmationConfig } from '../confirmation.types';

@Component({
  selector: 'msk-confirmation-dialog',
  templateUrl: './dialog.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [MatIconModule, MatButtonModule, MatDialogModule],
})
export class MskConfirmationDialogComponent {
  data: MskConfirmationConfig = inject(MAT_DIALOG_DATA);
}
