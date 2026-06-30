import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MskTranslocoTestingModule } from '@msk/shared/utils/transloco';
import { AuthService } from '@msk/mirza/shell/core/auth';
import { StoreService } from '@msk/mirza/shell/core/store';
import { UserService } from '@msk/mirza/shell/core/user';
import { SignUpComponent } from './sign-up.component';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let authService: {
    requestRegistrationOtp: jest.Mock;
    verifyRegistrationOtp: jest.Mock;
  };
  let storeService: {
    getAll: jest.Mock;
  };
  let userService: {
    get: jest.Mock;
  };
  let router: Router;

  const registrationPayload = {
    firstName: 'Sahand',
    lastName: 'Zeynol',
    username: 'sahand',
    phone: '+989121234567',
    password: 'secret',
    confirmPassword: 'secret',
  };

  beforeEach(async () => {
    sessionStorage.clear();
    authService = {
      requestRegistrationOtp: jest.fn().mockReturnValue(of({ success: true })),
      verifyRegistrationOtp: jest
        .fn()
        .mockReturnValue(of({ accessToken: 'access-token', refreshToken: 'refresh-token' })),
    };
    storeService = {
      getAll: jest.fn().mockReturnValue(of([{ id: 1, name: 'Cafe Mirza', isActive: true }])),
    };
    userService = {
      get: jest.fn().mockReturnValue(of({ id: '1', firstName: 'Sahand', lastName: 'Zeynol' })),
    };

    await TestBed.configureTestingModule({
      imports: [MskTranslocoTestingModule(), SignUpComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
        { provide: StoreService, useValue: storeService },
        { provide: UserService, useValue: userService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    sessionStorage.clear();
  });

  it('requests an OTP with normalized registration data', async () => {
    component.registerForm().value.set(registrationPayload);

    await component.requestOtp();

    expect(authService.requestRegistrationOtp).toHaveBeenCalledWith({
      ...registrationPayload,
      phone: '09121234567',
    });
    expect(component.currentStep()).toBe('verify');
    expect(component.pendingRegistration()).toEqual(
      expect.objectContaining({
        phone: '09121234567',
        username: 'sahand',
      }),
    );
  });

  it('does not request an OTP when passwords do not match', async () => {
    component.registerForm().value.set({
      ...registrationPayload,
      password: 'secret',
      confirmPassword: 'different',
    });

    await component.requestOtp();

    expect(authService.requestRegistrationOtp).not.toHaveBeenCalled();
    expect(component.alert()).toEqual(expect.objectContaining({ type: 'error' }));
    expect(component.currentStep()).toBe('details');
  });

  it('verifies OTP and redirects to the requested destination when the user has a store', async () => {
    const navigateByUrl = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    component.registerForm().value.set(registrationPayload);
    await component.requestOtp();
    component.otpCode.set('123456');

    await component.verifyOtp();

    expect(authService.verifyRegistrationOtp).toHaveBeenCalledWith({
      phone: '09121234567',
      otp: '123456',
      username: 'sahand',
      password: 'secret',
      firstName: 'Sahand',
      lastName: 'Zeynol',
    });
    expect(userService.get).toHaveBeenCalled();
    expect(storeService.getAll).toHaveBeenCalled();
    expect(navigateByUrl).toHaveBeenCalledWith('/signed-in-redirect');
  });

  it('redirects to first-store onboarding after registration when the user has no stores', async () => {
    storeService.getAll.mockReturnValue(of([]));
    const navigateByUrl = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    component.registerForm().value.set(registrationPayload);
    await component.requestOtp();
    component.otpCode.set('123456');

    await component.verifyOtp();

    expect(userService.get).toHaveBeenCalled();
    expect(storeService.getAll).toHaveBeenCalled();
    expect(navigateByUrl).toHaveBeenCalledWith('/onboarding/store');
  });

  it('shows a validation error when OTP is missing', async () => {
    component.registerForm().value.set(registrationPayload);
    await component.requestOtp();
    component.otpCode.set('');

    await component.verifyOtp();

    expect(authService.verifyRegistrationOtp).not.toHaveBeenCalled();
    expect(component.alert()).toEqual(expect.objectContaining({ type: 'error' }));
  });

  it('keeps the details step when OTP request fails', async () => {
    authService.requestRegistrationOtp.mockReturnValue(throwError(() => ({ error: { message: 'failed' } })));
    component.registerForm().value.set(registrationPayload);

    await component.requestOtp();

    expect(component.currentStep()).toBe('details');
    expect(component.alert()).toEqual(expect.objectContaining({ type: 'error' }));
  });
});
