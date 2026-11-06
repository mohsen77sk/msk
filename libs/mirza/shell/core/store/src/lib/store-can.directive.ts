import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { StoreAccessService } from './store-access.service';
import { StorePermission } from './store-access.types';

/**
 * Renders its content only when the caller has the permission in the current store.
 *
 * <button *mzStoreCan="'sales.delete'">...</button>
 */
@Directive({ selector: '[mzStoreCan]' })
export class StoreCanDirective {
  private _templateRef = inject(TemplateRef<unknown>);
  private _viewContainer = inject(ViewContainerRef);
  private _storeAccessService = inject(StoreAccessService);

  mzStoreCan = input.required<StorePermission>();

  private _shown = false;

  constructor() {
    effect(() => {
      const allowed = this._storeAccessService.permissions().has(this.mzStoreCan());
      if (allowed && !this._shown) {
        this._viewContainer.createEmbeddedView(this._templateRef);
      } else if (!allowed && this._shown) {
        this._viewContainer.clear();
      }
      this._shown = allowed;
    });
  }
}
