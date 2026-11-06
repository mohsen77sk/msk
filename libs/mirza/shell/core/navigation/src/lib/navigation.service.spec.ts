import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslocoService } from '@jsverse/transloco';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import { StoreAccessService } from '@msk/mirza/shell/core/store';
import { firstValueFrom } from 'rxjs';
import { NavigationService } from './navigation.service';

// Transloco ships ESM this lib's jest setup does not transform; the service only reads the active language
jest.mock('@jsverse/transloco', () => ({ TranslocoService: class TranslocoService {} }));
import { Navigation } from './navigation.types';

describe('NavigationService', () => {
  it('leaves out the pages the caller may not open', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MSK_APP_CONFIG, useValue: { apiEndpoint: 'https://api.test' } },
        { provide: TranslocoService, useValue: { getActiveLang: () => 'fa' } },
      ],
    });
    const http = TestBed.inject(HttpTestingController);
    const service = TestBed.inject(NavigationService);
    const access = TestBed.inject(StoreAccessService);

    const navigation: Navigation = [
      {
        id: 'panel',
        type: 'group',
        children: [
          { id: 'panel.dashboard', type: 'basic', link: '/panel/dashboard' },
          { id: 'panel.sales', type: 'basic', link: '/panel/sales' },
          { id: 'panel.pos', type: 'basic', link: '/pos' },
          { id: 'panel.members', type: 'basic', link: '/panel/members' },
        ],
      },
    ];

    service.get().subscribe();
    http.expectOne('assets/api/fa/navigation.json').flush(navigation);
    access.load().subscribe();
    http.expectOne('https://api.test/store-member/me').flush({
      role: { id: 3, key: 'cashier', name: 'صندوق‌دار' },
      permissions: ['sales.create', 'customers.manage'],
    });

    const visible = await firstValueFrom(service.navigation$);
    expect(visible[0].children?.map((item) => item.id)).toEqual(['panel.sales', 'panel.pos']);
  });
});
