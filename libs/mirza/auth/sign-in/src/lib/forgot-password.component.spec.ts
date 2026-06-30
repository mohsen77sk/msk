import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { MskTranslocoTestingModule } from '@msk/shared/utils/transloco';
import { AuthService } from '@msk/mirza/shell/core/auth';
import { ForgotPasswordComponent } from './forgot-password.component';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let authService: {
    requestPasswordResetOtp: jest.Mock;
    resetPassword: jest.Mock;
  };

  beforeEach(async () => {
    sessionStorage.clear();
    jest.useFakeTimers();
    authService = {
      requestPasswordResetOtp: jest.fn().mockReturnValue(of({ success: true })),
      resetPassword: jest.fn().mockReturnValue(of({ success: true })),
    };

    await TestBed.configureTestingModule({
      imports: [MskTranslocoTestingModule(), ForgotPasswordComponent],
      providers: [provideRouter([]), { provide: AuthService, useValue: authService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    sessionStorage.clear();
    jest.useRealTimers();
  });

  it('requests a password reset OTP with a normalized phone number', async () => {
    component.phoneForm().value.set({ phone: '+989121234567' });

    await component.requestOtp();

    expect(authService.requestPasswordResetOtp).toHaveBeenCalledWith({ phone: '09121234567' });
    expect(component.pendingPhone()).toBe('09121234567');
    expect(component.currentStep()).toBe('verify');
  });

  it('moves from OTP entry to reset without calling the backend verification endpoint', async () => {
    component.phoneForm().value.set({ phone: '09121234567' });
    await component.requestOtp();
    component.otpCode.set('123456');

    await component.verifyOtp();

    expect(component.currentStep()).toBe('reset');
    expect(component.resetForm().value()).toEqual({
      phone: '09121234567',
      otp: '123456',
      password: '',
      confirmPassword: '',
    });
    expect(authService.resetPassword).not.toHaveBeenCalled();
  });

  it('resets the password with phone, OTP, and new password', async () => {
    const router = TestBed.inject(Router);
    const navigateByUrl = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    component.phoneForm().value.set({ phone: '09121234567' });
    await component.requestOtp();
    component.otpCode.set('123456');
    await component.verifyOtp();
    component.resetForm().value.set({
      phone: '09121234567',
      otp: '123456',
      password: 'new-secret',
      confirmPassword: 'new-secret',
    });

    await component.resetPassword();
    jest.runOnlyPendingTimers();

    expect(authService.resetPassword).toHaveBeenCalledWith({
      phone: '09121234567',
      otp: '123456',
      password: 'new-secret',
      confirmPassword: 'new-secret',
    });
    expect(component.currentStep()).toBe('success');
    expect(navigateByUrl).toHaveBeenCalledWith('/sign-in');
  });

  it('does not reset when password confirmation does not match', async () => {
    component.resetForm().value.set({
      phone: '09121234567',
      otp: '123456',
      password: 'new-secret',
      confirmPassword: 'different',
    });

    await component.resetPassword();

    expect(authService.resetPassword).not.toHaveBeenCalled();
    expect(component.alert()).toEqual(expect.objectContaining({ type: 'error' }));
  });

  it('resends the code only after the countdown is available', async () => {
    component.phoneForm().value.set({ phone: '09121234567' });
    await component.requestOtp();

    await component.resendCode();
    expect(authService.requestPasswordResetOtp).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(120000);
    await component.resendCode();

    expect(authService.requestPasswordResetOtp).toHaveBeenCalledTimes(2);
    expect(authService.requestPasswordResetOtp).toHaveBeenLastCalledWith({ phone: '09121234567' });
  });
});
