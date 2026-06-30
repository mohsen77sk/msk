import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { MskTranslocoTestingModule } from '@msk/shared/utils/transloco';
import { FirstSaleSuccessComponent } from './first-sale-success.component';

describe('FirstSaleSuccessComponent', () => {
  let component: FirstSaleSuccessComponent;
  let fixture: ComponentFixture<FirstSaleSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MskTranslocoTestingModule({
          langs: {
            en: {
              onboarding: {
                'first-sale-success-title': 'First sale created',
                'first-sale-success-subtitle': 'Your store is ready for daily sales and inventory work.',
                'go-to-dashboard': 'Go to dashboard',
                'create-another-sale': 'Create another sale',
              },
            },
          },
        }),
        FirstSaleSuccessComponent,
      ],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FirstSaleSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('renders the first sale success page', () => {
    expect(fixture.nativeElement.textContent).toContain('First sale created');
    expect(fixture.nativeElement.textContent).toContain('Go to dashboard');
  });

  it('navigates to the dashboard', () => {
    const router = TestBed.inject(Router);
    const navigateByUrl = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    component.goToDashboard();

    expect(navigateByUrl).toHaveBeenCalledWith('/panel/dashboard');
  });

  it('navigates to another onboarding sale', () => {
    const router = TestBed.inject(Router);
    const navigate = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    component.createAnotherSale();

    expect(navigate).toHaveBeenCalledWith(['/panel/sales/card/new'], {
      queryParams: {
        onboarding: true,
        returnTo: '/onboarding/first-sale/success',
      },
    });
  });
});
