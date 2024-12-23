import { JsonPipe } from '@angular/common';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MskHighlightComponent } from '@msk/shared/ui/highlight';
import { MskConfirmationService } from '../confirmation.service';

@Component({
  selector: 'msk-docs-confirmation',
  templateUrl: './docs-confirmation.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    JsonPipe,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MskHighlightComponent,
  ],
})
export class MskDocsConfirmationComponent implements OnInit {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _mskConfirmationService: MskConfirmationService = inject(MskConfirmationService);

  configForm!: FormGroup;

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Build the config form
    this.configForm = this._formBuilder.group({
      title: 'Remove contact',
      message:
        'Are you sure you want to remove this contact permanently? <br> <span class="font-medium">This action cannot be undone!</span>',
      icon: this._formBuilder.group({
        show: false,
        name: 'delete',
      }),
      actions: this._formBuilder.group({
        confirm: this._formBuilder.group({
          show: true,
          label: 'Remove',
        }),
        cancel: this._formBuilder.group({
          show: true,
          label: 'Cancel',
        }),
      }),
      dismissible: true,
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Open confirmation dialog
   */
  openConfirmationDialog(): void {
    // Open the dialog and save the reference of it
    const dialogRef = this._mskConfirmationService.open(this.configForm.value);

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }
}
