import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwPush } from '@angular/service-worker';
import { BehaviorSubject, of } from 'rxjs';
import { AuthService } from '@msk/mirza/shell/core/auth';
import { StoreService } from '@msk/mirza/shell/core/store';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  const swPush = { isEnabled: false, subscription: of(null) };
  const http = { get: jest.fn(), post: jest.fn(), delete: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: http },
        { provide: Router, useValue: { navigateByUrl: jest.fn() } },
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
        { provide: SwPush, useValue: swPush },
        { provide: AuthService, useValue: { accessToken: '', needsRefresh: () => false } },
        { provide: StoreService, useValue: { currentStore$: new BehaviorSubject(null) } },
        { provide: MSK_APP_CONFIG, useValue: { production: false, apiEndpoint: 'http://api.test' } },
      ],
    });
  });

  it('reports push as unsupported when the service worker is disabled', async () => {
    const service = TestBed.inject(NotificationsService);
    expect(service.pushSupported()).toBe(false);
    await service.refreshPushState();
    expect(service.pushEnabled()).toBe(false);
  });

  it('does not throw when audio is unavailable', () => {
    const service = TestBed.inject(NotificationsService);
    expect(() => service.playSound()).not.toThrow();
  });

  it('does not open a socket while no store is selected', () => {
    const service = TestBed.inject(NotificationsService);
    expect(() => service.start()).not.toThrow();
  });
});
