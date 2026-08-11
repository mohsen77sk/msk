import {o as o_}from'./chunk-uIO-bYv_.js';import {Q as QI,g as gi,h as hD,N as Nc}from'./main-RDLBPNRR.js';var c=class a{static \u0275fac=function(n){return new(n||a)};static \u0275cmp=QI({type:a,selectors:[["doc-media-watcher"]],decls:26,vars:0,consts:[["dir","ltr",1,"page-layout","content-scroll","md:py-4"],[1,"content","prose","max-w-full"],[1,"sticky-header","mt-4","md:mt-0"],["msk-highlight","","lang","typescript"],[1,"sticky-header"]],template:function(n,m){n&1&&(gi(0,"div",0)(1,"div",1)(2,"h3",2),hD(3,"Service"),Nc(),gi(4,"textarea",3),hD(5,`      import { MskMediaWatcherService } from '@msk/shared/services/media-watcher';
    `),Nc(),gi(6,"p")(7,"strong"),hD(8,"MskMediaWatcherService"),Nc(),hD(9," is a singleton service to watch media changes. It automatically registers the breakpoints from layout configuration, so you can use the service without needing to configure it first. "),Nc(),gi(10,"h3",4),hD(11,"Methods"),Nc(),gi(12,"p"),hD(13,"To watch changes on registered breakpoints, you can use the "),gi(14,"code"),hD(15,"onMediaChange$"),Nc(),hD(16," getter:"),Nc(),gi(17,"textarea",3),hD(18,`      import { MskMediaWatcherService } from '@msk/shared/services/media-watcher';

      private _mskMediaWatcherService = inject(MskMediaWatcherService);

      /**
       * On init
       */
      ngOnInit(): void {
        this._mskMediaWatcherService.onMediaChange$.subscribe(({ matchingAliases }) => {
          // Check if the screen is small
          this.isFullScreen.set(!matchingAliases.includes('md'));
        });
      }
    `),Nc(),gi(19,"p"),hD(20,"You can also listen for custom media queries using "),gi(21,"code"),hD(22,"onMediaQueryChange$(query: string)"),Nc(),hD(23," method:"),Nc(),gi(24,"textarea",3),hD(25,`      import { MskMediaWatcherService } from '@msk/shared/services/media-watcher';

      private _mskMediaWatcherService = inject(MskMediaWatcherService);

      /**
       * On init
       */
      ngOnInit(): void {
        this._mskMediaWatcherService.onMediaQueryChange$([
          '(prefers-color-scheme: dark)',
          '(prefers-color-scheme: light)',
        ]).subscribe((mql) => {
          // If the scheme is set to 'auto'...
          if (config.scheme === 'auto') {
            // Decide the scheme using the media query
            options.scheme = mql.breakpoints['(prefers-color-scheme: dark)'] ? 'dark' : 'light';
          }
        });
      }
    `),Nc()()());},dependencies:[o_],encapsulation:2})};export{c as DocsMediaWatcherComponent};