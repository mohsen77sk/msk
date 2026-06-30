import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'mz-first-sale-onboarding',
  templateUrl: './first-sale-onboarding.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, MatButtonModule, MatIconModule],
})
export class FirstSaleOnboardingComponent {
  private _router = inject(Router);

  createFirstSale(): void {
    this._router.navigate(['/panel/sales/card/new'], {
      queryParams: {
        onboarding: true,
        returnTo: '/onboarding/first-sale/success',
      },
    });
  }

  skip(): void {
    this._router.navigateByUrl('/panel/dashboard');
  }
}
