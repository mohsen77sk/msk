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
export class SignUpComponent implements OnInit, AfterViewInit, OnDestroy {
  private _router = inject(Router);
  private _authService = inject(AuthService);
  private _translocoService = inject(TranslocoService);

  @ViewChild('otpInput') private _otpInput?: ElementRef<HTMLInputElement>;

  private readonly _otpDuration = 120;
  private _otpTimer: ReturnType<typeof window.setInterval> | null = null;
  private readonly _pendingStateKey = 'mirza:onboarding:registration';

  alert = signal<{ type: MskAlertType; message: string } | null>(null);
  currentStep = signal<'details' | 'verify'>('details');
  otpCode = signal('');
  resendCountdown = signal(this._otpDuration);
  canResend = signal(false);
  isSubmitting = signal(false);
  isResending = signal(false);
  pendingRegistration = signal<RegistrationRequest | null>(null);

  registerForm = form(
    signal<RegistrationRequest>({
      firstName: '',
      lastName: '',
      username: '',
      phone: '',
      password: '',
      confirmPassword: '',
      email: '',
    }),
    (schemaPath) => {
      required(schemaPath.firstName);
      required(schemaPath.lastName);
      required(schemaPath.username);
      required(schemaPath.phone);
      required(schemaPath.password);
      required(schemaPath.confirmPassword);
    },
    {
      submission: {
        action: (form) => this.requestOtp(form),
      },
    },
  );

  ngOnInit(): void {
    this._restorePendingState();
  }

  ngAfterViewInit(): void {
    this.registerForm().focusBoundControl();
    if (this.currentStep() === 'verify') {
      this._focusOtpInput();
    }
  }

  ngOnDestroy(): void {
    this._clearOtpTimer();
  }

  async requestOtp(form?: FieldTree<RegistrationRequest>): Promise<void> {
    this.alert.set(null);
    this.isSubmitting.set(true);

    const payload = this._buildPayload(form);
    if (!this._validateStepOne(payload)) {
      this.isSubmitting.set(false);
      return;
    }

    try {
      await firstValueFrom(this._authService.requestRegistrationOtp(payload));
      this.pendingRegistration.set(payload);
      this._persistPendingState(payload);
      this.currentStep.set('verify');
      this.alert.set({ type: 'success', message: this._translocoService.translate('signIn.verification-code-sent') });
      this._startCountdown();
      this._focusOtpInput();
    } catch (error) {
      const result = parseSubmissionError(error, form ?? this.registerForm);
      this.alert.set({ type: 'error', message: result.alertMessage });
      this.registerForm().focusBoundControl();
      return;
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async verifyOtp(): Promise<void> {
    this.alert.set(null);
    this.isSubmitting.set(true);

    const otp = this.otpCode().trim();
    if (!otp) {
      this.alert.set({ type: 'error', message: this._translocoService.translate('signIn.otp-required') });
      this.isSubmitting.set(false);
      return;
    }

    const pending = this.pendingRegistration();
    if (!pending) {
      this.alert.set({ type: 'error', message: this._translocoService.translate('signIn.registration-expired') });
      this.isSubmitting.set(false);
      return;
    }

    try {
      const response = await firstValueFrom(
        this._authService.verifyRegistrationOtp({
          phone: pending.phone,
          otp,
          username: pending.username,
          password: pending.password,
          firstName: pending.firstName,
          lastName: pending.lastName,
        }),
      );
      this._clearPendingState();
      this._clearOtpTimer();

      if ('accessToken' in response && 'refreshToken' in response) {
        const redirectURL =
          this._router.routerState.snapshot.root.queryParamMap.get('redirectURL') || '/signed-in-redirect';
        await this._router.navigateByUrl(redirectURL);
        return;
      }

      await this._router.navigateByUrl('/sign-in');
    } catch (error) {
      const result = parseSubmissionError(error, this.registerForm);
      this.alert.set({ type: 'error', message: result.alertMessage });
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async resendCode(): Promise<void> {
    if (!this.canResend() || !this.pendingRegistration()) {
      return;
    }

    this.isResending.set(true);
    this.alert.set(null);

    try {
      await firstValueFrom(this._authService.requestRegistrationOtp(this.pendingRegistration()!));
      this.otpCode.set('');
      this.alert.set({ type: 'success', message: this._translocoService.translate('signIn.verification-code-sent') });
      this._startCountdown();
    } catch (error) {
      const result = parseSubmissionError(error, this.registerForm);
      this.alert.set({ type: 'error', message: result.alertMessage });
      return;
    } finally {
      this.isResending.set(false);
    }
  }

  goBack(): void {
    this.currentStep.set('details');
    this.alert.set(null);
  }

  handleOtpPaste(event: ClipboardEvent): void {
    const text = event.clipboardData?.getData('text') ?? '';
    const digits = text.replace(/\D/g, '').slice(0, 6);
    this.otpCode.set(digits);
    event.preventDefault();
  }

  private _buildPayload(form?: FieldTree<RegistrationRequest>): RegistrationRequest {
    const values = (form ?? this.registerForm)().value();
    return {
      firstName: values.firstName?.trim() ?? '',
      lastName: values.lastName?.trim() ?? '',
      username: values.username?.trim() ?? '',
      phone: values.phone?.trim() ?? '',
      password: values.password?.trim() ?? '',
      confirmPassword: values.confirmPassword?.trim() ?? '',
      email: values.email?.trim() ?? '',
    };
  }

  private _validateStepOne(payload: RegistrationRequest): boolean {
    if (
      !payload.firstName ||
      !payload.lastName ||
      !payload.username ||
      !payload.phone ||
      !payload.password ||
      !payload.confirmPassword
    ) {
      this.alert.set({ type: 'error', message: this._translocoService.translate('signIn.all-fields-required') });
      return false;
    }

    if (!/^09\d{9}$/.test(payload.phone)) {
      this.alert.set({ type: 'error', message: this._translocoService.translate('signIn.phone-validation') });
      return false;
    }

    if (payload.password !== payload.confirmPassword) {
      this.alert.set({ type: 'error', message: this._translocoService.translate('signIn.passwords-do-not-match') });
      return false;
    }

    if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      this.alert.set({ type: 'error', message: this._translocoService.translate('signIn.email-validation') });
      return false;
    }

    return true;
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

  private _persistPendingState(payload: RegistrationRequest): void {
    sessionStorage.setItem(
      this._pendingStateKey,
      JSON.stringify({ step: 'verify', registration: payload, requestedAt: Date.now() }),
    );
  }

  private _restorePendingState(): void {
    const raw = sessionStorage.getItem(this._pendingStateKey);
    if (!raw) {
      return;
    }

    try {
      const state = JSON.parse(raw) as { step?: string; registration?: RegistrationRequest; requestedAt?: number };
      if (state.step === 'verify' && state.registration) {
        this.pendingRegistration.set(state.registration);
        this.currentStep.set('verify');
        this.registerForm().value.set(state.registration);
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
