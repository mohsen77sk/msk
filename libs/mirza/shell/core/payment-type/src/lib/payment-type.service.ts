import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { MskPageData, MskPagingRequest, MskLookupItem } from '@msk/shared/data-access';
import { PaymentType } from './payment-type.types';

@Injectable({ providedIn: 'root' })
export class PaymentTypeService {
  private _translocoService = inject(TranslocoService);

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get lookup paymentTypes
   */
  getLookupPaymentTypes(
    params: MskPagingRequest = {
      page: 1,
      pageSize: 10,
      sortBy: '',
    },
  ): Observable<MskPageData<MskLookupItem>> {
    const allItems = Object.values(PaymentType).map(
      (x) => ({ id: x, name: this._translocoService.translate('paymentTypes.' + x) }) as MskLookupItem,
    );
    const startIndex = (params.page - 1) * params.pageSize;
    const endIndex = startIndex + params.pageSize;
    const pagedItems = allItems.slice(startIndex, endIndex);

    return of(
      new MskPageData({
        page: params.page,
        pageSize: params.pageSize,
        total: allItems.length,
        items: pagedItems,
      }),
    );
  }
}
