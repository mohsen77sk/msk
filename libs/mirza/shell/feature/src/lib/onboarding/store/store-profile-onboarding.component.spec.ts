import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { MskTranslocoTestingModule } from '@msk/shared/utils/transloco';
import { StoreService } from '@msk/mirza/shell/core/store';
import { StoreProfileOnboardingComponent } from './store-profile-onboarding.component';

describe('StoreProfileOnboardingComponent', () => {
  let component: StoreProfileOnboardingComponent;
  let fixture: ComponentFixture<StoreProfileOnboardingComponent>;
  let storeService: {
    currentStore: { id: number; name: string; isActive: boolean; logoUrl?: string };
    update: jest.Mock;
    uploadStoreLogo: jest.Mock;
  };

  beforeEach(async () => {
    storeService = {
      currentStore: { id: 1, name: 'Old Store', isActive: true },
      update: jest.fn().mockReturnValue(of({ id: 1, name: 'Cafe Mirza', isActive: true })),
      uploadStoreLogo: jest.fn().mockReturnValue(of({ id: 1, name: 'Cafe Mirza', isActive: true })),
    };

    await TestBed.configureTestingModule({
      imports: [MskTranslocoTestingModule(), StoreProfileOnboardingComponent],
      providers: [provideRouter([]), { provide: StoreService, useValue: storeService }],
    }).compileComponents();

    fixture = TestBed.createComponent(StoreProfileOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('updates the current store profile and redirects to catalog onboarding', async () => {
    const router = TestBed.inject(Router);
    const navigateByUrl = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    component.profileForm().value.set({ name: ' Cafe Mirza ' });

    await component.saveProfile();

    expect(storeService.update).toHaveBeenCalledWith(1, { name: 'Cafe Mirza' });
    expect(storeService.uploadStoreLogo).not.toHaveBeenCalled();
    expect(navigateByUrl).toHaveBeenCalledWith('/onboarding/catalog');
  });

  it('uploads the selected logo after updating the store', async () => {
    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const logo = new File(['logo'], 'logo.png', { type: 'image/png' });
    component.profileForm().value.set({ name: 'Cafe Mirza' });
    component.logoFile.set(logo);

    await component.saveProfile();

    expect(storeService.update).toHaveBeenCalledWith(1, { name: 'Cafe Mirza' });
    expect(storeService.uploadStoreLogo).toHaveBeenCalledWith(1, logo);
  });

  it('skips profile completion and redirects to catalog onboarding', async () => {
    const router = TestBed.inject(Router);
    const navigateByUrl = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    await component.skip();

    expect(storeService.update).not.toHaveBeenCalled();
    expect(navigateByUrl).toHaveBeenCalledWith('/onboarding/catalog');
  });

  it('redirects to store creation when no current store exists', async () => {
    const router = TestBed.inject(Router);
    const navigateByUrl = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    storeService.currentStore = null as never;

    await component.saveProfile();

    expect(storeService.update).not.toHaveBeenCalled();
    expect(navigateByUrl).toHaveBeenCalledWith('/onboarding/store');
  });
});
