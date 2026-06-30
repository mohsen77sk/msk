import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { MskTranslocoTestingModule } from '@msk/shared/utils/transloco';
import { StoreService } from '@msk/mirza/shell/core/store';
import { StoreOnboardingComponent } from './store-onboarding.component';

describe('StoreOnboardingComponent', () => {
  let component: StoreOnboardingComponent;
  let fixture: ComponentFixture<StoreOnboardingComponent>;
  let storeService: {
    create: jest.Mock;
  };

  beforeEach(async () => {
    storeService = {
      create: jest.fn().mockReturnValue(of({ id: 1, name: 'Cafe Mirza', isActive: true })),
    };

    await TestBed.configureTestingModule({
      imports: [MskTranslocoTestingModule(), StoreOnboardingComponent],
      providers: [provideRouter([]), { provide: StoreService, useValue: storeService }],
    }).compileComponents();

    fixture = TestBed.createComponent(StoreOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('creates the first store and redirects to store profile onboarding', async () => {
    const router = TestBed.inject(Router);
    const navigateByUrl = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    component.storeForm().value.set({ name: ' Cafe Mirza ' });

    await component.createStore();

    expect(storeService.create).toHaveBeenCalledWith({ name: 'Cafe Mirza' });
    expect(navigateByUrl).toHaveBeenCalledWith('/onboarding/store-profile');
  });

  it('requires a store name before submitting', async () => {
    component.storeForm().value.set({ name: '   ' });

    await component.createStore();

    expect(storeService.create).not.toHaveBeenCalled();
    expect(component.alert()).toEqual(expect.objectContaining({ type: 'error' }));
  });
});
