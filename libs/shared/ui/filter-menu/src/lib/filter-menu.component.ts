import { ChangeDetectionStrategy, Component, forwardRef, input, signal, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MskDataSource, MskLookupItem } from '@msk/shared/data-access';

@Component({
  selector: 'msk-filter-menu',
  templateUrl: './filter-menu.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollingModule, TranslocoPipe, MatIconModule, MatMenuModule, MatButtonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MskFilterMenuComponent),
      multi: true,
    },
  ],
})
export class MskFilterMenuComponent implements ControlValueAccessor {
  // Inputs
  label = input.required<string>();
  datasource = input.required<MskDataSource<any>>();

  value = signal<any | null>(null);
  isDisabled = signal(false);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string | number | null) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  writeValue(value: any | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: typeof this.onChange): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: typeof this.onTouched): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  updateValue(newValue: any): void {
    this.value.set(newValue);
    this.onChange(newValue?.id);
    this.onTouched();
  }
}
