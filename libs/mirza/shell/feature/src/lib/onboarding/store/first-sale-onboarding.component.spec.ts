import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { MskTranslocoTestingModule } from '@msk/shared/utils/transloco';
import { FirstSaleOnboardingComponent } from './first-sale-onboarding.component';

describe('FirstSaleOnboardingComponent', () => {
  let component: FirstSaleOnboardingComponent;
  let fixture: ComponentFixture<FirstSaleOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MskTranslocoTestingModule({
          langs: {
            en: {
              onboarding: {
                'first-sale-title': 'Create your first sale',
                'first-sale-subtitle': 'Use the existing sales form to record your first invoice.',
                'first-sale-products-help': 'You can create products first, or create a sale after adding products.',
                'create-first-sale': 'Create first sale',
                'skip-for-now': 'Skip for now',
              },
            },
          },
        }),
        FirstSaleOnboardingComponent,
      ],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FirstSaleOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('renders the first sale onboarding page', () => {
    expect(fixture.nativeElement.textContent).toContain('Create your first sale');
    expect(fixture.nativeElement.textContent).toContain('Create first sale');
  });

  it('navigates to the existing sale creation route with onboarding query params', () => {
    const router = TestBed.inject(Router);
    const navigate = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    component.createFirstSale();

    expect(navigate).toHaveBeenCalledWith(['/panel/sales/card/new'], {
      queryParams: {
        onboarding: true,
        returnTo: '/onboarding/first-sale/success',
      },
    });
  });

  it('skips to the dashboard', () => {
    const router = TestBed.inject(Router);
    const navigateByUrl = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    component.skip();

    expect(navigateByUrl).toHaveBeenCalledWith('/panel/dashboard');
  });
});
