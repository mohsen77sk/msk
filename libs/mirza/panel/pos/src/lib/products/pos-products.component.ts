import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MskCurrencyPipe } from '@msk/shared/pipes/currency';
import { MskAutoFocusDirective } from '@msk/shared/directives/autoFocus';
import { PosCartStore } from '../pos-cart.store';
import { PosCatalog, PosCategoryTab, PosProduct, normalizePosSearch } from '../pos.types';

@Component({
  selector: 'mz-pos-products',
  templateUrl: './pos-products.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatRippleModule, TranslocoDirective, MskCurrencyPipe, MskAutoFocusDirective],
})
export class PosProductsComponent {
  private _translocoService = inject(TranslocoService);
  readonly cart = inject(PosCartStore);

  readonly catalog = input.required<PosCatalog>();

  readonly query = signal('');
  readonly message = signal('');
  readonly tab = signal<PosCategoryTab>('all');

  private _input = viewChild.required<ElementRef<HTMLInputElement>>('codeInput');

  private _productsByCode = computed(
    () =>
      new Map(
        this.catalog()
          .products.filter((product) => product.code !== null)
          .map((product) => [product.code as number, product]),
      ),
  );

  private _searchTerm = computed(() => normalizePosSearch(this.query()));

  /**
   * A search looks across all categories; otherwise the selected tab
   */
  readonly visibleProducts = computed<PosProduct[]>(() => {
    const term = this._searchTerm();
    const { products, topProductIds } = this.catalog();
    if (term) return this._match(term);

    const tab = this.tab();
    if (tab === 'all') return products;
    if (tab === 'top') {
      const byId = new Map(products.map((product) => [product.id, product]));
      return topProductIds.map((id) => byId.get(id)).filter((product): product is PosProduct => !!product);
    }
    return products.filter((product) => product.categoryId === tab);
  });

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  focus(): void {
    this._input().nativeElement.focus();
  }

  /**
   * @param product
   */
  addProduct(product: PosProduct): void {
    this.cart.add(product);
    this.message.set('');
  }

  /**
   * @param tab
   */
  selectTab(tab: PosCategoryTab): void {
    this.tab.set(tab);
  }

  /**
   * @param event
   */
  onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.message.set('');
  }

  /**
   * Shortcuts on the code/search input
   * @param event
   */
  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        this._addFromInput();
        break;
      case '*':
      case '×':
        event.preventDefault();
        this._setSelectedQuantity();
        break;
      case '+':
        event.preventDefault();
        this._changeSelectedQuantity(1);
        break;
      case '-':
        event.preventDefault();
        this._changeSelectedQuantity(-1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.cart.moveSelection(-1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.cart.moveSelection(1);
        break;
      case 'Escape':
        event.preventDefault();
        this._clearInput();
        this.message.set('');
        break;
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Name substring, or code prefix when the term is digits
   * @param term normalized search term
   */
  private _match(term: string): PosProduct[] {
    const isDigits = /^\d+$/.test(term);
    return this.catalog().products.filter(
      (product) =>
        normalizePosSearch(product.name).includes(term) ||
        (isDigits && product.code !== null && String(product.code).startsWith(term)),
    );
  }

  /**
   * Digits: the product with that code. Text: the only match.
   */
  private _addFromInput(): void {
    const term = this._searchTerm();
    if (!term) return;

    if (/^\d+$/.test(term)) {
      const product = this._productsByCode().get(Number(term));
      if (!product) {
        this._error('unknown-code', { code: term });
        return;
      }
      this.addProduct(product);
      this._clearInput();
      return;
    }

    const matches = this._match(term);
    if (matches.length === 1) {
      this.addProduct(matches[0]);
      this._clearInput();
    } else if (matches.length === 0) {
      this._error('no-match');
    } else {
      this._error('many-matches', { count: matches.length });
    }
  }

  private _setSelectedQuantity(): void {
    const line = this.cart.selectedLine();
    if (!line) {
      this._error('no-selected-line');
      return;
    }
    const term = this._searchTerm();
    const quantity = /^\d+$/.test(term) ? Number(term) : NaN;
    if (!quantity) {
      this._error('quantity-needed');
      return;
    }
    this.cart.setQuantity(line.productId, quantity);
    this._clearInput();
    this.message.set('');
  }

  /**
   * @param delta
   */
  private _changeSelectedQuantity(delta: number): void {
    const line = this.cart.selectedLine();
    if (!line) {
      this._error('no-selected-line');
      return;
    }
    this.cart.changeQuantity(line.productId, delta);
    this.message.set('');
  }

  private _clearInput(): void {
    this._input().nativeElement.value = '';
    this.query.set('');
  }

  /**
   * @param key pos.errors.<key>
   * @param params
   */
  private _error(key: string, params?: Record<string, unknown>): void {
    this.message.set(this._translocoService.translate(`pos.errors.${key}`, params));
  }
}
