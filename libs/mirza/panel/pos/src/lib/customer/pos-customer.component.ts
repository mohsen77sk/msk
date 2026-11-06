import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  ViewEncapsulation,
  afterNextRender,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MskHttpErrorResponse } from '@msk/shared/data-access';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import {
  FormError,
  MskHandleFormErrors,
  MskSetServerErrorsFormFields,
  MskValidateFormFields,
} from '@msk/shared/utils/error-handler';
import { normalizeDigits } from '@msk/shared/utils/number';
import { Customer, CustomersService, DefaultCustomersSortData } from '@msk/mirza/panel/customers';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, map, of, switchMap } from 'rxjs';
import { PosCartStore } from '../pos-cart.store';
import { PosSelectedCustomer } from '../pos.types';

const SEARCH_RESULT_COUNT = 5;

/**
 * Optional phone: 11 digits starting with 0 (Persian/Arabic digits allowed)
 * @param control
 */
function phoneValidator(control: AbstractControl): ValidationErrors | null {
  const phone = normalizeDigits(String(control.value ?? '')).trim();
  return !phone || /^0\d{10}$/.test(phone) ? null : { pattern: true };
}

@Component({
  selector: 'mz-pos-customer',
  templateUrl: './pos-customer.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatRippleModule,
    MatTooltipModule,
    MatFormFieldModule,
    TranslocoDirective,
    MskSpinnerDirective,
  ],
})
export class PosCustomerComponent {
  private _destroyRef = inject(DestroyRef);
  private _injector = inject(Injector);
  private _formBuilder = inject(FormBuilder);
  private _customersService = inject(CustomersService);
  private _translocoService = inject(TranslocoService);
  readonly cart = inject(PosCartStore);

  readonly search = signal('');
  readonly results = signal<Customer[]>([]);
  readonly searching = signal(false);
  readonly showForm = signal(false);
  readonly saving = signal(false);
  readonly serverError = signal('');

  readonly form = this._formBuilder.group({
    name: ['', Validators.required],
    contactNumber: ['', phoneValidator],
    address: [''],
  });
  formErrors: FormError = {};

  private _nameInput = viewChild<ElementRef<HTMLInputElement>>('nameInput');

  /**
   * Constructor
   */
  constructor() {
    new MskHandleFormErrors(this.form, this.formErrors, this._translocoService);

    toObservable(this.search)
      .pipe(
        map((text) => normalizeDigits(text).trim()),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((text) => {
          if (!text) return of([] as Customer[]);
          this.searching.set(true);
          return this._customersService
            .getCustomers({
              page: 1,
              pageSize: SEARCH_RESULT_COUNT,
              sortBy: `${DefaultCustomersSortData.active} ${DefaultCustomersSortData.direction}`,
              search: text,
            })
            .pipe(
              map((page) => page.items),
              catchError(() => of([] as Customer[])),
            );
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((customers) => {
        this.searching.set(false);
        this.results.set(customers);
      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * @param event
   */
  onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  /**
   * @param customer
   */
  pick(customer: PosSelectedCustomer): void {
    this.cart.customer.set({ id: customer.id, name: customer.name, contactNumber: customer.contactNumber });
    this.search.set('');
    this.results.set([]);
    this.showForm.set(false);
  }

  remove(): void {
    this.cart.customer.set(null);
  }

  /**
   * Inline new-customer form; digits in the search prefill the phone, text the name
   */
  openForm(): void {
    const text = normalizeDigits(this.search()).trim();
    const isPhone = /^[\d\s+-]+$/.test(text);
    this.form.reset({ name: isPhone ? '' : text, contactNumber: isPhone ? text : '', address: '' });
    this.serverError.set('');
    this.results.set([]);
    this.showForm.set(true);
    afterNextRender(() => this._nameInput()?.nativeElement.focus(), { injector: this._injector });
  }

  closeForm(): void {
    this.showForm.set(false);
  }

  /**
   * POST /customer, then select it
   */
  save(): void {
    MskValidateFormFields(this.form);
    if (this.form.invalid || this.saving()) return;

    const value = this.form.getRawValue();
    const contactNumber = normalizeDigits(value.contactNumber ?? '').trim();
    this.saving.set(true);
    this.serverError.set('');
    this._customersService
      .createCustomer({
        name: (value.name ?? '').trim(),
        contactNumber: contactNumber || undefined,
        address: (value.address ?? '').trim() || undefined,
      } as Customer)
      .pipe(
        catchError((response: MskHttpErrorResponse) => {
          this.saving.set(false);
          this.serverError.set(response.error.message);
          if (response.error.errors) {
            MskSetServerErrorsFormFields(response.error.errors, this.form);
          }
          return EMPTY;
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((customer) => {
        this.saving.set(false);
        this.pick(customer);
      });
  }
}
