import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { provideTestMskAppConfig } from '@msk/shared/utils/app-config';
import { AUTH_TOKEN, REFRESH_TOKEN } from './auth.types';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideTestMskAppConfig(), provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear();
  });

  it('requests registration OTP with a normalized phone number', async () => {
    const response = firstValueFrom(
      service.requestRegistrationOtp({
        firstName: 'Sahand',
        lastName: 'Z',
        username: 'sahand',
        phone: '+989121234567',
        password: 'secret',
        confirmPassword: 'secret',
      }),
    );

    const request = httpTestingController.expectOne('/auth/register/request-otp');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ phone: '09121234567' });
    request.flush({ success: true });

    await expect(response).resolves.toEqual({ success: true });
  });

  it('verifies registration OTP and stores returned tokens', async () => {
    const response = firstValueFrom(
      service.verifyRegistrationOtp({
        phone: '989121234567',
        otp: '123456',
        username: 'sahand',
        password: 'secret',
        firstName: 'Sahand',
        lastName: 'Z',
      }),
    );

    const request = httpTestingController.expectOne('/auth/register/verify');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      phone: '09121234567',
      code: '123456',
      username: 'sahand',
      password: 'secret',
      firstName: 'Sahand',
      lastName: 'Z',
    });
    request.flush({ accessToken: 'access-token', refreshToken: 'refresh-token', user: { id: 1 }, expires: 31536000 });

    await expect(response).resolves.toEqual(
      expect.objectContaining({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      }),
    );
    expect(localStorage.getItem(AUTH_TOKEN)).toBe('access-token');
    expect(localStorage.getItem(REFRESH_TOKEN)).toBe('refresh-token');
  });

  it('requests password reset OTP with a normalized phone number', async () => {
    const response = firstValueFrom(service.requestPasswordResetOtp({ phone: '+989121234567' }));

    const request = httpTestingController.expectOne('/auth/forgot-password/request-otp');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ phone: '09121234567' });
    request.flush({ success: true });

    await expect(response).resolves.toEqual({ success: true });
  });

  it('resets password with OTP mapped to the backend payload', async () => {
    const response = firstValueFrom(
      service.resetPassword({
        phone: '989121234567',
        otp: '654321',
        password: 'new-secret',
        confirmPassword: 'new-secret',
      }),
    );

    const request = httpTestingController.expectOne('/auth/forgot-password/reset');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      phone: '09121234567',
      code: '654321',
      newPassword: 'new-secret',
    });
    request.flush({ success: true });

    await expect(response).resolves.toEqual({ success: true });
  });
});
