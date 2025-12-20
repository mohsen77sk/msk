
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MskSnackBarConfig } from '../snack-bar.types';

@Component({
  selector: 'msk-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatButtonModule, MatSnackBarModule],
})
export class MskSnackbarComponent {
  data: MskSnackBarConfig = inject(MAT_SNACK_BAR_DATA);
  sbRef = inject(MatSnackBarRef<MskSnackbarComponent>);
}
