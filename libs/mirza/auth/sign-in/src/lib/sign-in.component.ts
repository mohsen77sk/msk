import { AfterViewInit, ChangeDetectionStrategy, Component, ViewEncapsulation, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormRoot, FormField, form, required, FieldTree } from '@angular/forms/signals';
import { TranslocoDirective } from '@jsverse/transloco';
import { NgxTouchKeyboardModule } from 'ngx-touch-keyboard';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService, LoginRequest } from '@msk/mirza/shell/core/auth';
import { parseSubmissionError } from '@msk/shared/utils/error-handler';
import { MskAlertComponent, MskAlertType } from '@msk/shared/ui/alert';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { MskFormFieldErrorDirective } from '@msk/shared/directives/form-field-error';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'mz-sign-in',
  templateUrl: './sign-in.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormRoot,
    FormField,
    RouterLink,
    TranslocoDirective,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    NgxTouchKeyboardModule,
    MskAlertComponent,
    MskSpinnerDirective,
    MskFormFieldErrorDirective,
  ],
})
export class SignInComponent implements AfterViewInit {
  private _router = inject(Router);
  private _authService = inject(AuthService);
  private _activatedRoute = inject(ActivatedRoute);

  alert = signal<{ type: MskAlertType; message: string } | null>(null);

  signInForm = form(
    signal<LoginRequest>({
      username: '',
      password: '',
    }),
    (schemaPath) => {
      required(schemaPath.username);
      required(schemaPath.password);
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
    this.signInForm().focusBoundControl();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   *
   * @param form
   */
  private async _handleSubmit(form: FieldTree<LoginRequest>) {
    // Hide the alert
    this.alert.set(null);

    try {
      await firstValueFrom(this._authService.signIn(form().value()));

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
