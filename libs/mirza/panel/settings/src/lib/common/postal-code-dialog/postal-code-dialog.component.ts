import { Component, AfterViewInit, ViewEncapsulation, inject, signal } from '@angular/core';
import { FormRoot, FormField, form, required, FieldTree, disabled, pattern, maxLength } from '@angular/forms/signals';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslocoDirective } from '@jsverse/transloco';
import { MskAlertComponent, MskAlertType } from '@msk/shared/ui/alert';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { MskFormFieldErrorDirective } from '@msk/shared/directives/form-field-error';
import { parseSubmissionError } from '@msk/shared/utils/error-handler';
import { StoreService } from '@msk/mirza/shell/core/store';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'mz-postal-code-dialog',
  templateUrl: './postal-code-dialog.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    FormRoot,
    FormField,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogModule,
    TranslocoDirective,
    MskAlertComponent,
    MskSpinnerDirective,
    MskFormFieldErrorDirective,
  ],
})
export class PostalCodeDialogComponent implements AfterViewInit {
  readonly dialogRef = inject(MatDialogRef<PostalCodeDialogComponent>);
  private _storeService = inject(StoreService);

  alert = signal<{ type: MskAlertType; message: string } | null>(null);

  form = form<{ postalCode: string }>(
    signal({
      postalCode: this._storeService.currentStore?.postalCode ?? '',
    }),
    (schemaPath) => {
      required(schemaPath.postalCode);
      maxLength(schemaPath.postalCode, 10);
      pattern(schemaPath.postalCode, /^\d{10}$/);
      disabled(schemaPath.postalCode, { when: () => this.form().submitting() });
    },
    {
      submission: {
        action: (form) => this._handleSubmit(form),
      },
    },
  );

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * After view init
   */
  ngAfterViewInit(): void {
    this.form().focusBoundControl();
    this.dialogRef.updateSize('560px');
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Handle submit api call
   * @param form
   */
  private async _handleSubmit(form: FieldTree<{ postalCode: string }>) {
    // Hide the alert
    this.alert.set(null);

    try {
      const response = await firstValueFrom(
        this._storeService.update(this._storeService.currentStore?.id ?? 0, form().value()),
      );

      // Close dialog
      this.dialogRef.close(response);
      return;
    } catch (error) {
      // Pars errors
      const result = parseSubmissionError(error, form);

      // Show the alert
      this.alert.set({
        type: 'error',
        message: result.alertMessage,
      });

      // Set focus in username field
      form().focusBoundControl();

      // Return
      return result.validationErrors;
    }
  }
}
