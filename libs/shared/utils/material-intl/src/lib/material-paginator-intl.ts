import { Injectable, inject } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslocoService } from '@jsverse/transloco';

@Injectable()
export class MskPaginatorIntl extends MatPaginatorIntl {
  private _translocoService = inject(TranslocoService);

  /** A label for the page size selector. */
  override itemsPerPageLabel = this._translocoService.translate('paginator.items-per-page-label');

  /** A label for the button that increments the current page. */
  override nextPageLabel = this._translocoService.translate('paginator.next-page-label');

  /** A label for the button that decrements the current page. */
  override previousPageLabel = this._translocoService.translate('paginator.previous-page-label');

  /** A label for the button that moves to the first page. */
  override firstPageLabel = this._translocoService.translate('paginator.first-page-label');

  /** A label for the button that moves to the last page. */
  override lastPageLabel = this._translocoService.translate('paginator.last-page-label');

  /**
   * A label for the range of items within the current page and the length of the whole list.
   *
   * @param page
   * @param pageSize
   * @param length
   */
  override getRangeLabel: (page: number, pageSize: number, length: number) => string = (
    page: number,
    pageSize: number,
    length: number
  ) => {
    if (length == 0 || pageSize == 0) {
      return this._translocoService.translate('paginator.range-page-label-1', {
        length,
      });
    }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;

    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

    return this._translocoService.translate('paginator.range-page-label-2', {
      startIndex: startIndex + 1,
      endIndex,
      length,
    });
  };
}
