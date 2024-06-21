import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MainAuthService } from '@msk/main/shell/core/auth';
import { MskErrorResponse } from '@msk/shared/data-access';
import { MskAlertComponent, MskAlertType } from '@msk/shared/ui/alert';
import { mskAnimations } from '@msk/shared/animations';
import { catchError, map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'main-sign-in',
  templateUrl: './sign-in.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: mskAnimations,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    TranslocoDirective,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MskAlertComponent,
  ],
})
export class SignInComponent implements OnInit {
  private _router = inject(Router);
  private _destroyRef = inject(DestroyRef);
  private _elementRef = inject(ElementRef);
  private _formBuilder = inject(FormBuilder);
  private _activatedRoute = inject(ActivatedRoute);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _authService = inject(MainAuthService);

  @ViewChild('signInNgForm') signInNgForm!: NgForm;

  alert: { type: MskAlertType; message: string } = {
    type: 'error',
    message: '',
  };

  signInForm!: FormGroup;
  showAlert = false;

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Create the form
    this.signInForm = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: false,
    });

    // Set init focus
    setTimeout(() => this.usernameFocus(), 100);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Sign in
   */
  signIn(): void {
    // Return if the form is invalid
    if (this.signInForm.invalid) {
      return;
    }

    // Disable the form
    this.signInForm.disable();

    // Hide the alert
    this.showAlert = false;

    // Sign in
    this._authService
      .signIn(this.signInForm.value)
      .pipe(
        map((response) => {
          // Set the redirect url.
          // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
          // to the correct page after a successful sign in. This way, that url can be set via
          // routing file and we don't have to touch here.
          const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

          if (!response.requiresTwoFactor) {
            // Navigate to the redirect url
            this._router.navigateByUrl(redirectURL);
          } else {
            // Navigate to the two-step-verification url
            this._router.navigate(['/two-step-verification'], { queryParams: { redirectURL } });
          }
        }),
        catchError((response: { error: MskErrorResponse }) => {
          // Re-enable the form
          this.signInForm.enable();

          // Reset the form
          this.signInNgForm.resetForm();

          // Set the alert
          this.alert = {
            type: 'error',
            message: response.error.message,
          };

          // Show the alert
          this.showAlert = true;

          // Mark for check
          this._changeDetectorRef.markForCheck();

          // Set focus in username field
          setTimeout(() => this.usernameFocus());

          // Throw error
          throw response;
        })
      )
      .subscribe();
  }

  /**
   * Set focus in username field
   */
  usernameFocus(): void {
    // Set focus
    this._elementRef.nativeElement.querySelector('[formcontrolname="username"]')?.focus();
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }
}
