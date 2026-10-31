import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import { PosCatalog } from './pos.types';

@Injectable({ providedIn: 'root' })
export class PosService {
  private _appConfig = inject(MSK_APP_CONFIG);
  private _httpClient = inject(HttpClient);

  /**
   * Everything the POS sells, loaded once per visit
   */
  getCatalog(): Observable<PosCatalog> {
    return this._httpClient.get<PosCatalog>(`${this._appConfig.apiEndpoint}/product/catalog`);
  }
}
