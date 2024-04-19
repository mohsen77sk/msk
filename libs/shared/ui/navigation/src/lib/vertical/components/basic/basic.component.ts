import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { IsActiveMatchOptions, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MskUtilsService } from '@msk/shared/services/utils';
import { MskVerticalNavigationComponent } from '../../vertical-navigation.component';
import { MskNavigationService } from '../../../navigation.service';
import { MskNavigationItem } from '../../../navigation.types';

@Component({
  standalone: true,
  selector: 'msk-vertical-navigation-basic-item',
  templateUrl: './basic.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, NgIf, RouterLink, RouterLinkActive, MatTooltipModule, NgTemplateOutlet, MatIconModule],
})
export class MskVerticalNavigationBasicItemComponent implements OnInit {
  destroyRef = inject(DestroyRef);

  @Input() item!: MskNavigationItem;
  @Input() name!: string;

  isActiveMatchOptions!: IsActiveMatchOptions;
  private _mskVerticalNavigationComponent!: MskVerticalNavigationComponent;

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _mskNavigationService: MskNavigationService,
    private _mskUtilsService: MskUtilsService
  ) {
    // Set the equivalent of {exact: false} as default for active match options.
    // We are not assigning the item.isActiveMatchOptions directly to the
    // [routerLinkActiveOptions] because if it's "undefined" initially, the router
    // will throw an error and stop working.
    this.isActiveMatchOptions = this._mskUtilsService.subsetMatchOptions;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Set the "isActiveMatchOptions" either from item's
    // "isActiveMatchOptions" or the equivalent form of
    // item's "exactMatch" option
    this.isActiveMatchOptions =
      this.item.isActiveMatchOptions ?? this.item.exactMatch
        ? this._mskUtilsService.exactMatchOptions
        : this._mskUtilsService.subsetMatchOptions;

    // Get the parent navigation component
    this._mskVerticalNavigationComponent = this._mskNavigationService.getComponent(this.name);

    // Mark for check
    this._changeDetectorRef.markForCheck();

    // Subscribe to onRefreshed on the navigation component
    this._mskVerticalNavigationComponent.onRefreshed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      // Mark for check
      this._changeDetectorRef.markForCheck();
    });
  }
}
