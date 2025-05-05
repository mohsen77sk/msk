import { JsonPipe } from '@angular/common';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MskHighlightComponent } from '@msk/shared/ui/highlight';
import { MskSnackbarService } from '@msk/shared/services/snack-bar';

@Component({
  selector: 'doc-snack-bar',
  templateUrl: './snack-bar.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    JsonPipe,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MskHighlightComponent,
  ],
})
export class DocsSnackBarComponent implements OnInit {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _mskSnackBarService: MskSnackbarService = inject(MskSnackbarService);

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
      type: 'error',
      title: 'Error',
      message: '500 Internal Server Error',
      dismissible: true,
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Open snackbar
   */
  openSnackbar(): void {
    // Open the snackbar and save the reference of it
    const snackRef = this._mskSnackBarService.open(this.configForm.value);
  }
}
