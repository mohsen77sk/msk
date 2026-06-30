import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormRoot, FormField, FieldTree, form, required } from '@angular/forms/signals';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService, ForgotPasswordRequest, PasswordResetRequest } from '@msk/mirza/shell/core/auth';
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
    RouterLink,
    TranslocoDirective,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MskAlertComponent,
    MskSpinnerDirective,
    MskFormFieldErrorDirective,
  ],
})
export class ForgotPasswordComponent implements OnInit, AfterViewInit, OnDestroy {
  private _router = inject(Router);
  private _authService = inject(AuthService);
  private _translocoService = inject(TranslocoService);

  @ViewChild('otpInput') private _otpInput?: ElementRef<HTMLInputElement>;

  private readonly _otpDuration = 120;
  private _otpTimer: ReturnType<typeof window.setInterval> | null = null;
  private readonly _pendingStateKey = 'mirza:onboarding:forgot-password';

  alert = signal<{ type: MskAlertType; message: string } | null>(null);
  currentStep = signal<'phone' | 'verify' | 'reset' | 'success'>('phone');
  otpCode = signal('');
  resendCountdown = signal(this._otpDuration);
  canResend = signal(false);
  isSubmitting = signal(false);
  isResending = signal(false);
  pendingPhone = signal('');

  phoneForm = form(
    signal<ForgotPasswordRequest>({ phone: '' }),
    (schemaPath) => {
      required(schemaPath.phone);
    },
    {
      submission: {
        action: (form) => this.requestOtp(form),
      },
    },
  );

  resetForm = form(
    signal<PasswordResetRequest>({ phone: '', otp: '', password: '', confirmPassword: '' }),
    (schemaPath) => {
      required(schemaPath.phone);
      required(schemaPath.otp);
      required(schemaPath.password);
      required(schemaPath.confirmPassword);
    },
    {
      submission: {
        action: (form) => this.resetPassword(form),
      },
    },
  );

  ngOnInit(): void {
    this._restorePendingState();
  }

  ngAfterViewInit(): void {
    this.phoneForm().focusBoundControl();
    if (this.currentStep() === 'verify') {
      this._focusOtpInput();
    }
  }

  ngOnDestroy(): void {
    this._clearOtpTimer();
  }

  async requestOtp(form?: FieldTree<ForgotPasswordRequest>): Promise<void> {
    this.alert.set(null);
    this.isSubmitting.set(true);

    const payload = this._buildPhonePayload(form);
    if (!payload.phone || !/^09\d{9}$/.test(payload.phone)) {
      this.alert.set({ type: 'error', message: this._translocoService.translate('signIn.phone-validation') });
      this.isSubmitting.set(false);
      return;
    }

    try {
      await firstValueFrom(this._authService.requestPasswordResetOtp(payload));
      this.pendingPhone.set(payload.phone);
      this.currentStep.set('verify');
      this._persistPendingState(payload.phone);
      this.alert.set({ type: 'success', message: this._translocoService.translate('signIn.verification-code-sent') });
      this._startCountdown();
      this._focusOtpInput();
    } catch (error) {
      const result = parseSubmissionError(error, form ?? this.phoneForm);
      this.alert.set({ type: 'error', message: result.alertMessage });
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async verifyOtp(): Promise<void> {
    this.alert.set(null);
    this.otpCode.set(this.otpCode().replace(/\D/g, '').slice(0, 6));
    if (!this.otpCode().trim()) {
      this.alert.set({ type: 'error', message: this._translocoService.translate('signIn.otp-required') });
      return;
    }

    this.resetForm().value.set({ phone: this.pendingPhone(), otp: this.otpCode(), password: '', confirmPassword: '' });
    this.currentStep.set('reset');
  }

  async resendCode(): Promise<void> {
    if (!this.canResend() || !this.pendingPhone()) {
      return;
    }

    this.isResending.set(true);
    try {
      await firstValueFrom(this._authService.requestPasswordResetOtp({ phone: this.pendingPhone() }));
      this.otpCode.set('');
      this.alert.set({ type: 'success', message: this._translocoService.translate('signIn.verification-code-sent') });
      this._startCountdown();
    } catch (error) {
      const result = parseSubmissionError(error, this.phoneForm);
      this.alert.set({ type: 'error', message: result.alertMessage });
    } finally {
      this.isResending.set(false);
    }
  }

  async resetPassword(form?: FieldTree<PasswordResetRequest>): Promise<void> {
    this.alert.set(null);
    this.isSubmitting.set(true);

    const payload = this._buildResetPayload(form);
    if (!payload.phone || !payload.otp || !payload.password || !payload.confirmPassword) {
      this.alert.set({ type: 'error', message: this._translocoService.translate('signIn.all-fields-required') });
      this.isSubmitting.set(false);
      return;
    }

    if (payload.password !== payload.confirmPassword) {
      this.alert.set({ type: 'error', message: this._translocoService.translate('signIn.passwords-do-not-match') });
      this.isSubmitting.set(false);
      return;
    }

    try {
      await firstValueFrom(this._authService.resetPassword(payload));
      this.currentStep.set('success');
      this.alert.set({ type: 'success', message: this._translocoService.translate('signIn.password-reset-success') });
      this._clearPendingState();
      this._clearOtpTimer();
      window.setTimeout(() => this._router.navigateByUrl('/sign-in'), 500);
    } catch (error) {
      const result = parseSubmissionError(error, form ?? this.resetForm);
      this.alert.set({ type: 'error', message: result.alertMessage });
    } finally {
      this.isSubmitting.set(false);
    }
  }

  handleOtpPaste(event: ClipboardEvent): void {
    const text = event.clipboardData?.getData('text') ?? '';
    const digits = text.replace(/\D/g, '').slice(0, 6);
    this.otpCode.set(digits);
    event.preventDefault();
  }

  private _buildPhonePayload(form?: FieldTree<ForgotPasswordRequest>): ForgotPasswordRequest {
    const values = (form ?? this.phoneForm)().value();
    return {
      phone: values.phone?.trim() ?? '',
    };
  }

  private _buildResetPayload(form?: FieldTree<PasswordResetRequest>): PasswordResetRequest {
    const values = (form ?? this.resetForm)().value();
    return {
      phone: values.phone?.trim() ?? '',
      otp: values.otp?.trim() ?? '',
      password: values.password?.trim() ?? '',
      confirmPassword: values.confirmPassword?.trim() ?? '',
    };
  }

  private _startCountdown(): void {
    this._clearOtpTimer();
    this.canResend.set(false);
    this.resendCountdown.set(this._otpDuration);

    this._otpTimer = window.setInterval(() => {
      const nextValue = this.resendCountdown() - 1;
      this.resendCountdown.set(nextValue);
      if (nextValue <= 0) {
        this.canResend.set(true);
        this._clearOtpTimer();
      }
    }, 1000);
  }

  private _clearOtpTimer(): void {
    if (this._otpTimer) {
      window.clearInterval(this._otpTimer);
      this._otpTimer = null;
    }
  }

  private _persistPendingState(phone: string): void {
    sessionStorage.setItem(
      this._pendingStateKey,
      JSON.stringify({ step: this.currentStep(), phone, requestedAt: Date.now() }),
    );
  }

  private _restorePendingState(): void {
    const raw = sessionStorage.getItem(this._pendingStateKey);
    if (!raw) {
      return;
    }

    try {
      const state = JSON.parse(raw) as { step?: string; phone?: string; requestedAt?: number };
      if (state.step && state.phone) {
        this.pendingPhone.set(state.phone);
        this.currentStep.set(state.step as 'phone' | 'verify' | 'reset' | 'success');
        const elapsed = Math.floor((Date.now() - (state.requestedAt ?? Date.now())) / 1000);
        const remaining = Math.max(0, this._otpDuration - elapsed);
        this.resendCountdown.set(remaining);
        this.canResend.set(remaining <= 0);
        if (remaining > 0) {
          this._startCountdown();
        }
      }
    } catch {
      sessionStorage.removeItem(this._pendingStateKey);
    }
  }

  private _clearPendingState(): void {
    sessionStorage.removeItem(this._pendingStateKey);
  }

  private _focusOtpInput(): void {
    window.setTimeout(() => this._otpInput?.nativeElement?.focus(), 0);
  }
}
