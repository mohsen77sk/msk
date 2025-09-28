import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoDirective } from '@jsverse/transloco';
import { MskSort } from '@msk/shared/data-access';
import { SortMenuItem } from './sort-menu.types';

@Component({
  selector: 'msk-sort-menu',
  templateUrl: './sort-menu.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, MatIconModule, MatMenuModule, MatButtonModule],
})
export class MskSortMenuComponent {
  // Inputs
  sortData = input.required<MskSort>();
  sortItems = input.required<SortMenuItem[]>();

  /**
   * Returns the label for the given sort key.
   * @param key - The key of the sort item.
   * @returns The label corresponding to the key, or an empty string if not found.
   */
  getLabel(key: string): string {
    return this.sortItems().find((x) => x.key === key)?.label ?? '';
  }

  /**
   * Handles sort change by updating the active sort key.
   * @param active - The new active sort key.
   */
  onSortChange(active: string): void {
    this.sortData().sort({ active });
  }
}
