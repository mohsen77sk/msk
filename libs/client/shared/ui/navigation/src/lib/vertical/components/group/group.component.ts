import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { BooleanInput } from '@angular/cdk/coercion';

import { MskVerticalNavigationComponent } from '@msk/client/shared/ui/navigation';
import { MskNavigationService } from '@msk/client/shared/ui/navigation';
import { MskNavigationItem } from '@msk/client/shared/ui/navigation';

import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'msk-vertical-navigation-group-item',
  templateUrl: './group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MskVerticalNavigationGroupItemComponent
  implements OnInit, OnDestroy
{
  /* eslint-disable @typescript-eslint/naming-convention */
  static ngAcceptInputType_autoCollapse: BooleanInput;
  /* eslint-enable @typescript-eslint/naming-convention */

  @Input() autoCollapse!: boolean;
  @Input() item!: MskNavigationItem;
  @Input() name!: string;

  private _mskVerticalNavigationComponent!: MskVerticalNavigationComponent;
  private _unsubscribeAll: Subject<void> = new Subject();

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _mskNavigationService: MskNavigationService,
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Get the parent navigation component
    this._mskVerticalNavigationComponent =
      this._mskNavigationService.getComponent(this.name);

    // Subscribe to onRefreshed on the navigation component
    this._mskVerticalNavigationComponent.onRefreshed
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
