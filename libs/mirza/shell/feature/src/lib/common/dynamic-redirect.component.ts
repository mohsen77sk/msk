import { Component, inject, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';

export function createRedirectComponent(redirectTo: string): Type<unknown> {
  @Component({
    template: '',
  })
  class DynamicRedirectComponent implements OnInit {
    private _router = inject(Router);

    ngOnInit() {
      this._router.navigate([redirectTo], { replaceUrl: true });
    }
  }

  return DynamicRedirectComponent;
}
