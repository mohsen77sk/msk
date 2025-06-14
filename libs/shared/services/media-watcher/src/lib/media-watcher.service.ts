import { inject, Injectable } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MskLayoutConfigService } from '@msk/shared/services/config';
import { map, Observable, ReplaySubject, switchMap } from 'rxjs';
import { fromPairs } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class MskMediaWatcherService {
  private _breakpointObserver = inject(BreakpointObserver);
  private _layoutConfigService = inject(MskLayoutConfigService);

  private _onMediaChange: ReplaySubject<{ matchingAliases: string[]; matchingQueries: { [key: string]: string } }> =
    new ReplaySubject<{
      matchingAliases: string[];
      matchingQueries: { [key: string]: string };
    }>(1);

  /**
   * Constructor
   */
  constructor() {
    this._layoutConfigService.config$
      .pipe(
        map((config) =>
          fromPairs(Object.entries(config.screens).map(([alias, screen]) => [alias, `(min-width: ${screen})`]))
        ),
        switchMap((screens) =>
          this._breakpointObserver.observe(Object.values(screens)).pipe(
            map((state) => {
              // Prepare the observable values and set their defaults
              const matchingAliases: string[] = [];
              const matchingQueries: { [key: string]: string } = {};

              // Get the matching breakpoints and use them to fill the subject
              const matchingBreakpoints = Object.entries(state.breakpoints).filter(([query, matches]) => matches) ?? [];
              for (const [query] of matchingBreakpoints) {
                // Find the alias of the matching query
                const matchingAlias = Object.entries(screens).find(([alias, q]) => q === query)?.[0];

                // Add the matching query to the observable values
                if (matchingAlias) {
                  matchingAliases.push(matchingAlias);
                  matchingQueries[matchingAlias] = query;
                }
              }

              // Execute the observable
              this._onMediaChange.next({
                matchingAliases,
                matchingQueries,
              });
            })
          )
        )
      )
      .subscribe();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for _onMediaChange
   */
  get onMediaChange$(): Observable<{ matchingAliases: string[]; matchingQueries: { [key: string]: string } }> {
    return this._onMediaChange.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * On media query change
   *
   * @param query
   */
  onMediaQueryChange$(query: string | string[]): Observable<BreakpointState> {
    return this._breakpointObserver.observe(query);
  }
}
