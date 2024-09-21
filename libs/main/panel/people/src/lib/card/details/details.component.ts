import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslocoDirective } from '@jsverse/transloco';
import { MskDialogData } from '@msk/shared/data-access';
import { MskDialogComponent } from '@msk/shared/ui/dialog';
import { MskSpinnerDirective } from '@msk/shared/directives/spinner';
import { MskDateTimePipe } from '@msk/shared/pipes/date-time';
import { mskAnimations } from '@msk/shared/animations';
import { Person } from '../../people.types';

@Component({
  standalone: true,
  selector: 'main-people-details',
  templateUrl: './details.component.html',
  animations: mskAnimations,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatDialogModule,
    TranslocoDirective,
    MskDialogComponent,
    MskSpinnerDirective,
    MskDateTimePipe,
  ],
})
export class PeopleCardDetailsComponent implements OnInit {
  readonly data = inject<MskDialogData<Person | undefined>>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<PeopleCardDetailsComponent>);
  private _formBuilder = inject(FormBuilder);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  form!: FormGroup;
  formErrors: any = {};

  showAlert = false;
  alertMessage = '';

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Create the form
    this.form = this._formBuilder.group({
      id: [0, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      nationalCode: '',
      dateOfBirth: '',
      gender: ['', Validators.required],
      note: '',
    });
    // Patch value form
    this.form.patchValue(this.data.item || {});
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Save and close
   */
  saveAndClose(): void {
    //
    this.form.disable();

    setTimeout(() => {
      this.form.enable();
    }, 5000);
  }
}
