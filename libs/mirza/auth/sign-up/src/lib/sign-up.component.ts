import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewEncapsulation,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormRoot,
  FormField,
  form,
  required,
  FieldTree,
  pattern,
  validate,
  hidden,
  maxLength,
  disabled,
} from '@angular/forms/signals';
import { TranslocoDirective } from '@jsverse/transloco';
import { NgxTouchKeyboardModule } from 'ngx-touch-keyboard';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService, RegistrationRequest } from '@msk/mirza/shell/core/auth';
import { parseSubmissionError } from '@msk/shared/utils/error-handler';
import { MskAlertComponent, MskAlertType } from '@msk/shared/ui/alert';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { MskFormFieldErrorDirective } from '@msk/shared/directives/form-field-error';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'mz-sign-up',
  templateUrl: './sign-up.component.html',
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
    MatFormFieldModule,
    NgxTouchKeyboardModule,
    MskAlertComponent,
    MskSpinnerDirective,
    MskFormFieldErrorDirective,
  ],
})
export class SignUpComponent implements AfterViewInit, OnDestroy {
  private _router = inject(Router);
  private _authService = inject(AuthService);
  private _activatedRoute = inject(ActivatedRoute);

  private otpInterval: any;
  sendedOtp = signal(false);
  otpCountdown = signal(0);
  canResendOtp = computed(() => this.otpCountdown() === 0);
  alert = signal<{ type: MskAlertType; message: string } | null>(null);

  signUpForm = form(
    signal<RegistrationRequest>({
      firstName: '',
      lastName: '',
      phone: '',
      code: '',
      password: '',
      confirmPassword: '',
    }),
    (schemaPath) => {
      required(schemaPath.firstName);
      required(schemaPath.lastName);
      required(schemaPath.phone);
      maxLength(schemaPath.phone, 11);
      pattern(schemaPath.phone, /^09\d{9}$/);
      required(schemaPath.code);
      maxLength(schemaPath.code, 6);
      pattern(schemaPath.code, /^\d{6}$/);
      required(schemaPath.password);
      required(schemaPath.confirmPassword);
      validate(schemaPath.confirmPassword, ({ value, valueOf }) => {
        const password = valueOf(schemaPath.password);
        const confirmPassword = value();
        if (password !== confirmPassword) {
          return { kind: 'passwordMismatch' };
        }
        return null;
      });
      hidden(schemaPath.firstName, () => this.sendedOtp());
      hidden(schemaPath.lastName, () => this.sendedOtp());
      hidden(schemaPath.phone, () => this.sendedOtp());
      hidden(schemaPath.code, () => !this.sendedOtp());
      hidden(schemaPath.password, () => !this.sendedOtp());
      hidden(schemaPath.confirmPassword, () => !this.sendedOtp());
      disabled(schemaPath.firstName, () => this.signUpForm().submitting());
      disabled(schemaPath.lastName, () => this.signUpForm().submitting());
      disabled(schemaPath.phone, () => this.signUpForm().submitting());
      disabled(schemaPath.code, () => this.signUpForm().submitting());
      disabled(schemaPath.password, () => this.signUpForm().submitting());
      disabled(schemaPath.confirmPassword, () => this.signUpForm().submitting());
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
    this.signUpForm().focusBoundControl();
  }

  /**
   * On destroy
   */
  ngOnDestroy() {
    clearInterval(this.otpInterval);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  /**
   * Resend otp
   */
  resendOtp() {
    this._registrationOtp();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Handle submit api call
   * @param form
   */
  private async _handleSubmit(form: FieldTree<RegistrationRequest>) {
    // Hide the alert
    this.alert.set(null);

    try {
      if (!this.sendedOtp()) {
        await this._registrationOtp();
      } else {
        await this._registerVerify();
      }

      return;
    } catch (error) {
      // Pars errors
      const result = parseSubmissionError(error, form);

      // Show the alert
      this.alert.set({
        type: 'error',
        message: result.alertMessage,
      });

      // Set focus in first field
      form().focusBoundControl();

      // Return
      return result.validationErrors;
    }
  }

  /**
   * Send otp for registration
   */
  private async _registrationOtp() {
    await firstValueFrom(this._authService.registrationOtp(this.signUpForm().value().phone));

    // Set the sended otp
    this.sendedOtp.update(() => true);
    this._startOtpTimer();

    // Set focus in first field
    setTimeout(() => this.signUpForm().focusBoundControl(), 100);
  }

  /**
   * Registration
   */
  private async _registerVerify() {
    await firstValueFrom(this._authService.registrationVerify(this.signUpForm().value()));

    // Set the redirect url.
    // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
    // to the correct page after a successful sign in. This way, that url can be set via
    // routing file and we don't have to touch here.
    const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

    // Navigate to the redirect url
    this._router.navigateByUrl(redirectURL);
  }

  /**
   * Start otp timer
   * @param seconds
   */
  private _startOtpTimer(seconds = 60) {
    this.otpCountdown.set(seconds);

    clearInterval(this.otpInterval);

    this.otpInterval = setInterval(() => {
      if (this.otpCountdown() <= 1) {
        clearInterval(this.otpInterval);
        this.otpCountdown.update(() => 0);
        return;
      }

      this.otpCountdown.update((val) => val - 1);
    }, 1000);
  }
}
