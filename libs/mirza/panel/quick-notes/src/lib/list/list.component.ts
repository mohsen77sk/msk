import { Component, DestroyRef, OnInit, ViewEncapsulation, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MskAvatarComponent } from '@msk/shared/ui/avatar';
import { MskEmptyStateComponent } from '@msk/shared/ui/empty-state';
import { MskSnackbarService } from '@msk/shared/services/snack-bar';
import { MskFabExtendedCollapseDirective } from '@msk/shared/directives/fab-extended-collapse';
import { ProductCategory } from '@msk/mirza/panel/product-categories';
import { Subject, auditTime, catchError, of, startWith, switchMap } from 'rxjs';
import { QuickNote } from '../quick-notes.types';
import { QuickNotesService } from '../quick-notes.service';

@Component({
  selector: 'mz-quick-notes-list',
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterLink,
    RouterOutlet,
    DragDropModule,
    MatIconModule,
    MatRippleModule,
    MatButtonModule,
    TranslocoDirective,
    MskAvatarComponent,
    MskEmptyStateComponent,
    MskFabExtendedCollapseDirective,
  ],
})
export class QuickNotesListComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _quickNotesService = inject(QuickNotesService);
  private _translocoService = inject(TranslocoService);
  private _mskSnackbarService = inject(MskSnackbarService);

  private _reload = new Subject<void>();

  // In chip order; not paged, a store has a handful
  quickNotes = signal<QuickNote[] | null>(null);
  saving = signal(false);

  private _categories = toSignal(
    this._quickNotesService.getAllCategories().pipe(catchError(() => of([] as ProductCategory[]))),
    { initialValue: [] as ProductCategory[] },
  );
  private _categoryNames = computed(
    () => new Map(this._categories().map((category) => [category.id, category.name] as const)),
  );

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._reload
      .pipe(
        startWith(undefined),
        switchMap(() => this._quickNotesService.getQuickNotes().pipe(catchError(() => of([] as QuickNote[])))),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((quickNotes) => this.quickNotes.set(quickNotes));

    // A reorder emits one change per note: reload once
    this._quickNotesService.changes$
      .pipe(auditTime(0), takeUntilDestroyed(this._destroyRef))
      .subscribe(() => this._reload.next());
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Category names a note is limited to; empty = all products
   * @param quickNote
   */
  scopeNames(quickNote: QuickNote): string[] {
    const names = this._categoryNames();
    return quickNote.categoryIds.map((id) => names.get(id)).filter((name): name is string => !!name);
  }

  /**
   * Save the order after a drag; put it back if saving fails
   * @param event
   */
  drop(event: CdkDragDrop<QuickNote[]>): void {
    const previous = this.quickNotes();
    if (!previous || event.previousIndex === event.currentIndex) return;

    const next = [...previous];
    moveItemInArray(next, event.previousIndex, event.currentIndex);
    this.quickNotes.set(next);
    this.saving.set(true);

    this._quickNotesService
      .reorderQuickNotes(next.map((quickNote) => quickNote.id))
      .pipe(
        catchError(() => {
          this.quickNotes.set(previous);
          this._mskSnackbarService.error(this._translocoService.translate('quickNotes.list.reorderFailed'));
          return of(null);
        }),
      )
      .subscribe(() => this.saving.set(false));
  }
}
