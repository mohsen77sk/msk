import { AfterViewInit, ChangeDetectionStrategy, Component, ViewEncapsulation, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormRoot, FormField, form, required, FieldTree, disabled } from '@angular/forms/signals';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { parseSubmissionError } from '@msk/shared/utils/error-handler';
import { MskAlertComponent, MskAlertType } from '@msk/shared/ui/alert';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { MskFormFieldErrorDirective } from '@msk/shared/directives/form-field-error';
import { firstValueFrom } from 'rxjs';
import { CreateStoreRequest, StoreService } from '@msk/mirza/shell/core/store';

@Component({
  selector: 'mz-onboarding',
  templateUrl: './onboarding.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormRoot,
    FormField,
    TranslocoDirective,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MskAlertComponent,
    MskSpinnerDirective,
    MskFormFieldErrorDirective,
  ],
})
export class OnboardingComponent implements AfterViewInit {
  private _router = inject(Router);
  private _storeService = inject(StoreService);
  private _activatedRoute = inject(ActivatedRoute);

  alert = signal<{ type: MskAlertType; message: string } | null>(null);

  onboardingForm = form(
    signal<CreateStoreRequest>({
      name: '',
    }),
    (schemaPath) => {
      required(schemaPath.name);
      disabled(schemaPath.name, () => this.onboardingForm().submitting());
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
    this.onboardingForm().focusBoundControl();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Handle submit api call
   * @param form
   */
  private async _handleSubmit(form: FieldTree<CreateStoreRequest>) {
    // Hide the alert
    this.alert.set(null);

    try {
      await firstValueFrom(this._storeService.create(form().value()));

      // Set the redirect url.
      // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
      // to the correct page after a successful sign in. This way, that url can be set via
      // routing file and we don't have to touch here.
      const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

      // Navigate to the redirect url
      this._router.navigateByUrl(redirectURL);
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
