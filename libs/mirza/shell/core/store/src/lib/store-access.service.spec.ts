import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { Router, provideRouter } from '@angular/router';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import { firstValueFrom, isObservable, Observable } from 'rxjs';
import { StoreAccessService } from './store-access.service';
import { StoreAccess } from './store-access.types';
import { storePageResolver } from './store-access.resolver';
import { StoreCanDirective } from './store-can.directive';

const access = (key: StoreAccess['role']['key'], permissions: StoreAccess['permissions']): StoreAccess => ({
  role: { id: 1, key, name: key ?? 'custom' },
  permissions,
});

describe('StoreAccessService', () => {
  let service: StoreAccessService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: MSK_APP_CONFIG, useValue: { apiEndpoint: 'https://api.test' } },
      ],
    });
    service = TestBed.inject(StoreAccessService);
    http = TestBed.inject(HttpTestingController);
  });

  const load = (value: StoreAccess) => {
    service.load().subscribe();
    http.expectOne('https://api.test/store-member/me').flush(value);
  };

  it('loads the current store access', () => {
    load(access('cashier', ['sales.create']));
    expect(service.can('sales.create')).toBe(true);
    expect(service.can('sales.delete')).toBe(false);
  });

  it('opens pages by the permission their link needs', () => {
    load(access('storekeeper', ['products.manage']));
    expect(service.canOpen('/panel/products')).toBe(true);
    expect(service.canOpen('/panel/dashboard')).toBe(false);
    // Not listed: open to every member
    expect(service.canOpen('/panel/sales')).toBe(true);
  });

  it('lands a cashier on the POS and others without reports on the sales list', () => {
    load(access('manager', ['reports.view', 'sales.create']));
    expect(service.homeUrl()).toBe('/panel/dashboard');
    load(access('cashier', ['sales.create']));
    expect(service.homeUrl()).toBe('/pos');
    load(access(null, []));
    expect(service.homeUrl()).toBe('/panel/sales');
  });

  describe('storePageResolver', () => {
    const resolve = (link: string) =>
      TestBed.runInInjectionContext(() => storePageResolver(link)({} as never, {} as never)) as Observable<unknown>;

    it('resolves pages the caller may open', async () => {
      load(access('storekeeper', ['products.manage']));
      const result = resolve('/panel/products');
      expect(isObservable(result)).toBe(true);
      await expect(firstValueFrom(result)).resolves.toEqual(access('storekeeper', ['products.manage']));
    });

    it('sends the caller home instead of a closed page', async () => {
      const router = TestBed.inject(Router);
      const navigate = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
      load(access('cashier', ['sales.create']));

      await expect(firstValueFrom(resolve('/panel/dashboard'), { defaultValue: 'cancelled' })).resolves.toBe(
        'cancelled',
      );
      expect(navigate).toHaveBeenCalledWith('/pos');
    });
  });

  describe('StoreCanDirective', () => {
    @Component({
      imports: [StoreCanDirective],
      template: `<button *mzStoreCan="'sales.delete'">delete</button>`,
    })
    class HostComponent {}

    it('shows its content only with the permission', () => {
      load(access('cashier', ['sales.create']));
      const fixture = TestBed.createComponent(HostComponent);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('button')).toBeNull();

      load(access('manager', ['sales.delete']));
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('button')).not.toBeNull();
    });
  });
});
