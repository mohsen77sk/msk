import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormRoot, FormField, FieldTree, form, required } from '@angular/forms/signals';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MskAlertComponent, MskAlertType } from '@msk/shared/ui/alert';
import { MskAvatarComponent } from '@msk/shared/ui/avatar';
import { MskFormFieldErrorDirective } from '@msk/shared/directives/form-field-error';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { parseSubmissionError } from '@msk/shared/utils/error-handler';
import { Store, StoreService } from '@msk/mirza/shell/core/store';

interface StoreProfileOnboardingForm {
  name: string;
}

@Component({
  selector: 'mz-store-profile-onboarding',
  templateUrl: './store-profile-onboarding.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormRoot,
    FormField,
    TranslocoDirective,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MskAlertComponent,
    MskAvatarComponent,
    MskFormFieldErrorDirective,
    MskSpinnerDirective,
  ],
})
export class StoreProfileOnboardingComponent {
  private _router = inject(Router);
  private _storeService = inject(StoreService);
  private _translocoService = inject(TranslocoService);

  alert = signal<{ type: MskAlertType; message: string } | null>(null);
  logoFile = signal<File | null>(null);
  currentStore = signal<Store | null>(this._storeService.currentStore);

  profileForm = form(
    signal<StoreProfileOnboardingForm>({
      name: this._storeService.currentStore?.name ?? '',
    }),
    (schemaPath) => {
      required(schemaPath.name);
    },
    {
      submission: {
        action: (form) => this.saveProfile(form),
      },
    },
  );

  selectLogo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    input.value = '';

    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      this.alert.set({ type: 'error', message: this._translocoService.translate('onboarding.logo-type-error') });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.alert.set({ type: 'error', message: this._translocoService.translate('onboarding.logo-size-error') });
      return;
    }

    this.alert.set(null);
    this.logoFile.set(file);
  }

  async saveProfile(form?: FieldTree<StoreProfileOnboardingForm>): Promise<void> {
    this.alert.set(null);
    const store = this._storeService.currentStore;

    if (!store) {
      await this._router.navigateByUrl('/onboarding/store');
      return;
    }

    const fieldTree = form ?? this.profileForm;
    const name = fieldTree().value().name.trim();

    if (!name) {
      this.alert.set({ type: 'error', message: this._translocoService.translate('onboarding.store-name-required') });
      fieldTree().focusBoundControl();
      return;
    }

    try {
      const updatedStore = await firstValueFrom(this._storeService.update(store.id, { name }));
      this.currentStore.set(updatedStore);

      const logoFile = this.logoFile();
      if (logoFile) {
        const storeWithLogo = await firstValueFrom(this._storeService.uploadStoreLogo(updatedStore.id, logoFile));
        this.currentStore.set(storeWithLogo);
      }

      await this._router.navigateByUrl('/onboarding/catalog');
    } catch (error) {
      const result = parseSubmissionError(error, fieldTree);
      this.alert.set({ type: 'error', message: result.alertMessage });
    }
  }

  async skip(): Promise<void> {
    await this._router.navigateByUrl('/onboarding/catalog');
  }
}
