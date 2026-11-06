import { AfterViewInit, Component, ViewEncapsulation, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MskAlertComponent } from '@msk/shared/ui/alert';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { MskSnackbarService } from '@msk/shared/services/snack-bar';
import { MskValidateFormFields } from '@msk/shared/utils/error-handler';
import { MskHttpErrorResponse } from '@msk/shared/data-access';
import {
  MENU_SLUG_MAX_LENGTH,
  MENU_SLUG_MIN_LENGTH,
  MENU_SLUG_PATTERN,
  MenuConfig,
  RESERVED_MENU_SLUGS,
} from '../menu.types';
import { MenuService } from '../menu.service';

function reservedSlugValidator(control: AbstractControl<string>): ValidationErrors | null {
  return RESERVED_MENU_SLUGS.includes(control.value) ? { reserved: true } : null;
}

export interface MenuSettingsDialogData {
  menu: MenuConfig;
  // Preset the toggle (the settings page opens the dialog when a menu without a slug is switched on)
  enabled?: boolean;
}

/**
 * Enable/disable the public menu and set its address (slug). Closes with the saved MenuConfig.
 */
@Component({
  selector: 'mz-menu-settings-dialog',
  templateUrl: './menu-settings-dialog.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatDialogModule,
    TranslocoDirective,
    MskAlertComponent,
    MskSpinnerDirective,
  ],
})
export class MenuSettingsDialogComponent implements AfterViewInit {
  readonly data = inject<MenuSettingsDialogData>(MAT_DIALOG_DATA);
  private _dialogRef = inject(MatDialogRef<MenuSettingsDialogComponent>);
  private _formBuilder = inject(FormBuilder);
  private _menuService = inject(MenuService);
  private _snackbarService = inject(MskSnackbarService);
  private _translocoService = inject(TranslocoService);

  readonly slugMinLength = MENU_SLUG_MIN_LENGTH;
  readonly slugMaxLength = MENU_SLUG_MAX_LENGTH;
  readonly saving = signal(false);
  readonly alert = signal<string | null>(null);

  form = this._formBuilder.nonNullable.group({
    enabled: [this.data.enabled ?? this.data.menu.enabled],
    slug: [
      this.data.menu.slug ?? '',
      [
        Validators.required,
        Validators.minLength(MENU_SLUG_MIN_LENGTH),
        Validators.maxLength(MENU_SLUG_MAX_LENGTH),
        Validators.pattern(MENU_SLUG_PATTERN),
        reservedSlugValidator,
      ],
    ],
  });

  get slugControl(): FormControl<string> {
    return this.form.controls.slug;
  }

  ngAfterViewInit(): void {
    this._dialogRef.updateSize('560px');
  }

  /**
   * Trim and lowercase the slug, matching the backend normalization
   */
  normalizeSlug(): void {
    const normalized = this.slugControl.value.trim().toLowerCase();
    if (normalized !== this.slugControl.value) {
      this.slugControl.setValue(normalized);
    }
  }

  save(): void {
    this.normalizeSlug();
    MskValidateFormFields(this.form);
    if (this.form.invalid) {
      return;
    }

    const payload = this.form.getRawValue();
    this.form.disable();
    this.saving.set(true);
    this.alert.set(null);

    this._menuService.updateMenu(payload).subscribe({
      next: (menu) => {
        this._snackbarService.success(this._translocoService.translate('menu.settings.saved'));
        this._dialogRef.close(menu);
      },
      error: (response: MskHttpErrorResponse) => {
        this.saving.set(false);
        // Enable first: enable() re-runs validation and would clear the server error below
        this.form.enable();
        if (response.status === 409) {
          this.slugControl.setErrors({ taken: true });
          this.slugControl.markAsTouched();
          return;
        }
        const message: unknown = response.error?.message;
        this.alert.set(
          Array.isArray(message) ? message.join('\n') : typeof message === 'string' ? message : response.message,
        );
      },
    });
  }
}
