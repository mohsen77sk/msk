import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, UrlTree, provideRouter } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';
import { StoreService } from '@msk/mirza/shell/core/store';
import { OnboardingStoreGuard, StoreRequiredGuard } from './store-onboarding.guard';

describe('store onboarding guards', () => {
  let storeService: {
    storesLoaded: boolean;
    hasStores: boolean;
    getAll: jest.Mock;
  };
  let router: Router;

  beforeEach(() => {
    storeService = {
      storesLoaded: true,
      hasStores: false,
      getAll: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: StoreService, useValue: storeService }],
    });

    router = TestBed.inject(Router);
  });

  const runGuard = async (guard: CanActivateFn, url: string) =>
    firstValueFrom(TestBed.runInInjectionContext(() => guard({} as never, { url } as never)) as never);

  it('redirects panel access to store onboarding when no store exists', async () => {
    const result = (await runGuard(StoreRequiredGuard as CanActivateFn, '/panel/dashboard')) as UrlTree;

    expect(router.serializeUrl(result)).toBe('/onboarding/store');
  });

  it('allows panel access when a store exists', async () => {
    storeService.hasStores = true;

    await expect(runGuard(StoreRequiredGuard as CanActivateFn, '/panel/dashboard')).resolves.toBe(true);
  });

  it('redirects onboarding route to dashboard when a store already exists', async () => {
    storeService.hasStores = true;

    const result = (await runGuard(OnboardingStoreGuard as CanActivateFn, '/onboarding/store')) as UrlTree;

    expect(router.serializeUrl(result)).toBe('/panel/dashboard');
  });

  it('loads stores before deciding when store state is not loaded', async () => {
    storeService.storesLoaded = false;
    storeService.getAll.mockReturnValue(of([{ id: 1, name: 'Cafe Mirza', isActive: true }]));

    await expect(runGuard(StoreRequiredGuard as CanActivateFn, '/panel/dashboard')).resolves.toBe(true);
    expect(storeService.getAll).toHaveBeenCalled();
  });
});
