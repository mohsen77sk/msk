import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { DragDropModule, Point } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { TranslocoDirective } from '@jsverse/transloco';
import { mskAnimations } from '@msk/shared/animations';
import { MskMediaWatcherService } from '@msk/shared/services/media-watcher';
import { filter, map } from 'rxjs';

@Component({
  selector: 'msk-dialog',
  templateUrl: './dialog.component.html',
  exportAs: 'mskDialog',
  animations: mskAnimations,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    DragDropModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    TranslocoDirective
],
})
export class MskDialogComponent implements OnInit, AfterViewInit {
  private _parent = inject(MatDialogRef);
  private _destroyRef = inject(DestroyRef);
  private _mskMediaWatcherService = inject(MskMediaWatcherService);

  dialogContent = viewChild.required(MatDialogContent, { read: CdkScrollable });

  title = input.required<string>();
  isLoading = input<boolean>(false);
  hasDrag = input<boolean>(false);
  hasAction = input<boolean>(false);
  primaryAction = input<TemplateRef<HTMLElement>>();
  trailing = input<TemplateRef<HTMLElement>>();

  isScrolled = signal<boolean>(false);
  isFullScreen = signal<boolean>(false);
  dragPosition: Point = { x: 0, y: 0 };

  /**
   * Constructor
   */
  constructor() {
    effect(() => {
      if (this.isFullScreen()) {
        this.dragPosition = { x: 0, y: 0 };
        this._parent.addPanelClass('mat-mdc-dialog-fullscreen');
      } else {
        this._parent.removePanelClass('mat-mdc-dialog-fullscreen');
      }
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    this._parent?.addPanelClass('msk-dialog-panel');

    // Subscribe to media changes
    this._mskMediaWatcherService.onMediaChange$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(({ matchingAliases }) => {
        // Check if the screen is small
        this.isFullScreen.set(!matchingAliases.includes('md'));
      });
  }

  /**
   * After view init
   */
  ngAfterViewInit(): void {
    this.dialogContent()
      .elementScrolled()
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        map((data) => (data.target as HTMLElement).scrollTop || 0),
        filter((scrollTop) => this.isScrolled() != scrollTop > 10),
      )
      .subscribe((scrollTop) => {
        // Set the scrolled state
        this.isScrolled.set(scrollTop > 10);
      });
  }
}
