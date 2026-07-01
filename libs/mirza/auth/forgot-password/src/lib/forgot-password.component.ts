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
import { ActivatedRoute, Router } from '@angular/router';
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
import { AuthService, ResetPasswordRequest } from '@msk/mirza/shell/core/auth';
import { parseSubmissionError } from '@msk/shared/utils/error-handler';
import { MskAlertComponent, MskAlertType } from '@msk/shared/ui/alert';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { MskFormFieldErrorDirective } from '@msk/shared/directives/form-field-error';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'mz-forgot-password',
  templateUrl: './forgot-password.component.html',
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
    NgxTouchKeyboardModule,
    MskAlertComponent,
    MskSpinnerDirective,
    MskFormFieldErrorDirective,
  ],
})
export class ForgotPasswordComponent implements AfterViewInit, OnDestroy {
  private _router = inject(Router);
  private _authService = inject(AuthService);
  private _activatedRoute = inject(ActivatedRoute);

  private otpInterval: any;
  sendedOtp = signal(false);
  otpCountdown = signal(0);
  canResendOtp = computed(() => this.otpCountdown() === 0);
  alert = signal<{ type: MskAlertType; message: string } | null>(null);

  resetPasswordForm = form(
    signal<ResetPasswordRequest>({
      phone: '',
      code: '',
      newPassword: '',
      confirmNewPassword: '',
    }),
    (schemaPath) => {
      required(schemaPath.phone);
      maxLength(schemaPath.phone, 11);
      pattern(schemaPath.phone, /^09\d{9}$/);
      required(schemaPath.code);
      maxLength(schemaPath.code, 6);
      pattern(schemaPath.code, /^\d{6}$/);
      required(schemaPath.newPassword);
      required(schemaPath.confirmNewPassword);
      validate(schemaPath.confirmNewPassword, ({ value, valueOf }) => {
        const password = valueOf(schemaPath.newPassword);
        const confirmPassword = value();
        if (password !== confirmPassword) {
          return { kind: 'passwordMismatch' };
        }
        return null;
      });
      hidden(schemaPath.phone, () => this.sendedOtp());
      hidden(schemaPath.code, () => !this.sendedOtp());
      hidden(schemaPath.newPassword, () => !this.sendedOtp());
      hidden(schemaPath.confirmNewPassword, () => !this.sendedOtp());
      disabled(schemaPath.phone, () => this.resetPasswordForm().submitting());
      disabled(schemaPath.code, () => this.resetPasswordForm().submitting());
      disabled(schemaPath.newPassword, () => this.resetPasswordForm().submitting());
      disabled(schemaPath.confirmNewPassword, () => this.resetPasswordForm().submitting());
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
    this.resetPasswordForm().focusBoundControl();
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
    this._resetPasswordOtp();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Handle submit api call
   * @param form
   */
  private async _handleSubmit(form: FieldTree<ResetPasswordRequest>) {
    // Hide the alert
    this.alert.set(null);

    try {
      if (!this.sendedOtp()) {
        await this._resetPasswordOtp();
      } else {
        await this._resetPasswordVerify();
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
   * Send otp for reset password
   */
  private async _resetPasswordOtp() {
    await firstValueFrom(this._authService.resetPasswordOtp(this.resetPasswordForm().value().phone));

    // Set the sended otp
    this.sendedOtp.update(() => true);
    this._startOtpTimer();

    // Set focus in first field
    setTimeout(() => this.resetPasswordForm().focusBoundControl(), 100);
  }

  /**
   * Reset password
   */
  private async _resetPasswordVerify() {
    await firstValueFrom(this._authService.resetPasswordVerify(this.resetPasswordForm().value()));

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
