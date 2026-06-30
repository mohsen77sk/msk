import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'mz-first-sale-success',
  templateUrl: './first-sale-success.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, MatButtonModule, MatIconModule],
})
export class FirstSaleSuccessComponent {
  private _router = inject(Router);

  goToDashboard(): void {
    this._router.navigateByUrl('/panel/dashboard');
  }

  createAnotherSale(): void {
    this._router.navigate(['/panel/sales/card/new'], {
      queryParams: {
        onboarding: true,
        returnTo: '/onboarding/first-sale/success',
      },
    });
  }
}
