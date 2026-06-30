import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { provideTestMskAppConfig } from '@msk/shared/utils/app-config';
import { MskUtilsService } from '@msk/shared/services/utils';
import { StoreService } from './store.service';

describe('StoreService', () => {
  let service: StoreService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideTestMskAppConfig(),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: MskUtilsService,
          useValue: {
            encodeBase64Json: (value: unknown) => btoa(JSON.stringify(value)),
            decodeBase64Json: (value: string) => JSON.parse(atob(value)),
          },
        },
      ],
    });

    service = TestBed.inject(StoreService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear();
  });

  it('creates a store and sets it as the current store', async () => {
    const response = firstValueFrom(service.create({ name: 'Cafe Mirza' }));

    const request = httpTestingController.expectOne('/store');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ name: 'Cafe Mirza' });
    request.flush({ id: 1, name: 'Cafe Mirza', status: true });

    await expect(response).resolves.toEqual(
      expect.objectContaining({
        id: 1,
        name: 'Cafe Mirza',
        isActive: true,
      }),
    );
    expect(service.currentStore).toEqual(expect.objectContaining({ id: 1, name: 'Cafe Mirza' }));
    expect(service.storesSnapshot).toEqual([expect.objectContaining({ id: 1, name: 'Cafe Mirza' })]);
    expect(service.storesLoaded).toBe(true);
    expect(service.hasStores).toBe(true);
  });
});
