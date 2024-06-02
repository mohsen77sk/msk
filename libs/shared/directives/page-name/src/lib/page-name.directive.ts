import { Directive, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MskNavigationService, MskVerticalNavigationComponent } from '@msk/shared/ui/navigation';

@Directive({
  standalone: true,
  selector: '[mskPageName]',
  exportAs: 'mskPageName',
})
export class MskPageNameDirective implements OnInit {
  /**
   * Constructor
   */
  constructor(
    private _elementRef: ElementRef,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _mskNavigationService: MskNavigationService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Segment on path url
    const segment = this._router.url.split('/');
    // Remove root path segment
    segment.shift();
    // Remove params from path segment
    Object.values(this._activatedRoute.snapshot.params).forEach(() => segment.pop());
    // Convert path to id of navigation item
    const idPath = segment.join('.');
    // Get the navigation
    const navigation = this._mskNavigationService.getComponent<MskVerticalNavigationComponent>('mainNavigation');
    // Set title of current navigation in element
    this._elementRef.nativeElement.innerText = this._mskNavigationService.getItem(idPath, navigation.navigation)?.title;
  }
}
