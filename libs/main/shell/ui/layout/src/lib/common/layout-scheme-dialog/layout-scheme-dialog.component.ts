import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslocoDirective } from '@ngneat/transloco';
import { LayoutScheme, MskLayoutConfigService } from '@msk/shared/services/config';

@Component({
  standalone: true,
  selector: 'main-layout-scheme-dialog',
  templateUrl: './layout-scheme-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, MatRadioModule, MatDialogModule, TranslocoDirective],
})
export class MainLayoutSchemeDialogComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  layoutConfigService = inject(MskLayoutConfigService);

  layoutScheme!: LayoutScheme;

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to config changes
    this.layoutConfigService.config$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((config) => {
      // Get the config
      this.layoutScheme = config.scheme;
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Set the active schema
   *
   * @param event
   */
  setActiveSchema(event: MatRadioChange): void {
    // Set the active schema in config
    this.layoutConfigService.config = {
      scheme: event.value,
    };
  }
}
