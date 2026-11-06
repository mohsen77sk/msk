import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  OnInit,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoDirective } from '@jsverse/transloco';
import { MskCurrencyPipe } from '@msk/shared/pipes/currency';
import { MskAvatarComponent } from '@msk/shared/ui/avatar';
import { Subject, catchError, map, of, startWith, switchMap } from 'rxjs';
import { PublicMenuService } from './public-menu.service';
import { PublicMenu } from './public-menu.types';

type PublicMenuState = 'loading' | 'ready' | 'unavailable' | 'error';

@Component({
  selector: 'mz-public-menu',
  templateUrl: './public-menu.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatButtonModule, MatProgressSpinnerModule, TranslocoDirective, MskCurrencyPipe, MskAvatarComponent],
})
export class PublicMenuComponent implements OnInit {
  private _title = inject(Title);
  private _document = inject(DOCUMENT);
  private _destroyRef = inject(DestroyRef);
  private _activatedRoute = inject(ActivatedRoute);
  private _publicMenuService = inject(PublicMenuService);
  private _retry = new Subject<void>();

  readonly state = signal<PublicMenuState>('loading');
  readonly menu = signal<PublicMenu | null>(null);
  readonly logoFailed = signal(false);

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._activatedRoute.paramMap
      .pipe(
        map((params) => params.get('slug') ?? ''),
        switchMap((slug) =>
          this._retry.pipe(
            startWith(undefined),
            switchMap(() => {
              this.state.set('loading');
              return this._publicMenuService.getMenu(slug).pipe(
                map((menu) => ({ menu, state: 'ready' as const })),
                catchError((error: unknown) =>
                  of({
                    menu: null,
                    state:
                      error instanceof HttpErrorResponse && error.status === 404
                        ? ('unavailable' as const)
                        : ('error' as const),
                  }),
                ),
              );
            }),
          ),
        ),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(({ menu, state }) => {
        this.menu.set(menu);
        this.logoFailed.set(false);
        this.state.set(state);
        if (menu) {
          this._title.setTitle(menu.store.name);
        }
      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Retry loading the menu after a request error
   */
  retry(): void {
    this._retry.next();
  }

  /**
   * Scroll to a category section
   *
   * @param index
   */
  scrollToSection(index: number): void {
    this._document.getElementById(`menu-section-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
