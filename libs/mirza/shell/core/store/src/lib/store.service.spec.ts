import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTestMskAppConfig } from '@msk/shared/utils/app-config';
import { StoreService } from './store.service';

describe('StoreService', () => {
  let service: StoreService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideTestMskAppConfig()],
    });

    service = TestBed.inject(StoreService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear();
  });

  it('uploads store logo as FormData to the store logo endpoint', () => {
    const file = new File(['logo'], 'logo.png', { type: 'image/png' });

    service.uploadStoreLogo(7, file).subscribe((store) => {
      expect(store.id).toBe(7);
      expect(store.logoUrl).toBe('https://cdn.example.com/store-logos/logo.png');
    });

    const request = httpTestingController.expectOne('/store/7/logo');
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body instanceof FormData).toBe(true);
    expect(request.request.body.get('logo')).toBe(file);

    request.flush({
      id: 7,
      name: 'Main store',
      status: true,
      logoUrl: 'https://cdn.example.com/store-logos/logo.png',
    });
  });
});
