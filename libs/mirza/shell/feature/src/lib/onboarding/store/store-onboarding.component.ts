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
import { MskFormFieldErrorDirective } from '@msk/shared/directives/form-field-error';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { parseSubmissionError } from '@msk/shared/utils/error-handler';
import { StoreService } from '@msk/mirza/shell/core/store';

interface StoreOnboardingForm {
  name: string;
}

@Component({
  selector: 'mz-store-onboarding',
  templateUrl: './store-onboarding.component.html',
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
    MskFormFieldErrorDirective,
    MskSpinnerDirective,
  ],
})
export class StoreOnboardingComponent {
  private _router = inject(Router);
  private _storeService = inject(StoreService);
  private _translocoService = inject(TranslocoService);

  alert = signal<{ type: MskAlertType; message: string } | null>(null);

  storeForm = form(
    signal<StoreOnboardingForm>({
      name: '',
    }),
    (schemaPath) => {
      required(schemaPath.name);
    },
    {
      submission: {
        action: (form) => this.createStore(form),
      },
    },
  );

  async createStore(form?: FieldTree<StoreOnboardingForm>): Promise<void> {
    this.alert.set(null);
    const fieldTree = form ?? this.storeForm;
    const name = fieldTree().value().name.trim();

    if (!name) {
      this.alert.set({ type: 'error', message: this._translocoService.translate('onboarding.store-name-required') });
      fieldTree().focusBoundControl();
      return;
    }

    try {
      await firstValueFrom(this._storeService.create({ name }));
      await this._router.navigateByUrl('/panel/dashboard');
    } catch (error) {
      const result = parseSubmissionError(error, fieldTree);
      this.alert.set({ type: 'error', message: result.alertMessage });
    }
  }
}
