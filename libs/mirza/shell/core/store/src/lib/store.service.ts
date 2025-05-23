import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import { BehaviorSubject, map, Observable, ReplaySubject, tap } from 'rxjs';
import { Store } from './store.types';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private _httpClient = inject(HttpClient);
  private _appConfig = inject(MSK_APP_CONFIG);

  private _stores: ReplaySubject<Store> = new ReplaySubject<Store>(1);
  private _currentStore: BehaviorSubject<Store | null> = new BehaviorSubject<Store | null>(null);
}
