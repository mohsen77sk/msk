import{b as wt,d as Ot,g as St,j as F,l as B,n as H}from"./chunk-Y6LNULTR.js";import{I as T,K as bt,a as R,e as vt,h as D,i as j,j as mt,m as I,n as f}from"./chunk-HKIA5WVT.js";import{d as b,i as yt}from"./chunk-4RPD53QL.js";import{B as Q,Bb as ft,Cb as pt,Da as ht,Ga as O,Ha as S,Ic as ut,La as x,Qc as k,Ra as lt,Tc as gt,Y as tt,Z as et,a as w,ba as m,ca as it,ea as st,f as v,ga as d,ha as Y,hb as E,jb as at,lb as ct,na as ot,oa as X,ob as dt,ta as nt,wa as rt,xb as _t,z as J}from"./chunk-7YKTGSEM.js";import{a as P,b as U}from"./chunk-2R6CW7ES.js";var Et=vt(),V=class{constructor(t,e){this._viewportRuler=t,this._previousHTMLStyles={top:"",left:""},this._isEnabled=!1,this._document=e}attach(){}enable(){if(this._canBeEnabled()){let t=this._document.documentElement;this._previousScrollPosition=this._viewportRuler.getViewportScrollPosition(),this._previousHTMLStyles.left=t.style.left||"",this._previousHTMLStyles.top=t.style.top||"",t.style.left=f(-this._previousScrollPosition.left),t.style.top=f(-this._previousScrollPosition.top),t.classList.add("cdk-global-scrollblock"),this._isEnabled=!0}}disable(){if(this._isEnabled){let t=this._document.documentElement,e=this._document.body,i=t.style,s=e.style,n=i.scrollBehavior||"",r=s.scrollBehavior||"";this._isEnabled=!1,i.left=this._previousHTMLStyles.left,i.top=this._previousHTMLStyles.top,t.classList.remove("cdk-global-scrollblock"),Et&&(i.scrollBehavior=s.scrollBehavior="auto"),window.scroll(this._previousScrollPosition.left,this._previousScrollPosition.top),Et&&(i.scrollBehavior=n,s.scrollBehavior=r)}}_canBeEnabled(){if(this._document.documentElement.classList.contains("cdk-global-scrollblock")||this._isEnabled)return!1;let e=this._document.body,i=this._viewportRuler.getViewportSize();return e.scrollHeight>i.height||e.scrollWidth>i.width}};var N=class{constructor(t,e,i,s){this._scrollDispatcher=t,this._ngZone=e,this._viewportRuler=i,this._config=s,this._scrollSubscription=null,this._detach=()=>{this.disable(),this._overlayRef.hasAttached()&&this._ngZone.run(()=>this._overlayRef.detach())}}attach(t){this._overlayRef,this._overlayRef=t}enable(){if(this._scrollSubscription)return;let t=this._scrollDispatcher.scrolled(0).pipe(Q(e=>!e||!this._overlayRef.overlayElement.contains(e.getElementRef().nativeElement)));this._config&&this._config.threshold&&this._config.threshold>1?(this._initialScrollPosition=this._viewportRuler.getViewportScrollPosition().top,this._scrollSubscription=t.subscribe(()=>{let e=this._viewportRuler.getViewportScrollPosition().top;Math.abs(e-this._initialScrollPosition)>this._config.threshold?this._detach():this._overlayRef.updatePosition()})):this._scrollSubscription=t.subscribe(this._detach)}disable(){this._scrollSubscription&&(this._scrollSubscription.unsubscribe(),this._scrollSubscription=null)}detach(){this.disable(),this._overlayRef=null}},M=class{enable(){}disable(){}attach(){}};function W(o,t){return t.some(e=>{let i=o.bottom<e.top,s=o.top>e.bottom,n=o.right<e.left,r=o.left>e.right;return i||s||n||r})}function kt(o,t){return t.some(e=>{let i=o.top<e.top,s=o.bottom>e.bottom,n=o.left<e.left,r=o.right>e.right;return i||s||n||r})}var z=class{constructor(t,e,i,s){this._scrollDispatcher=t,this._viewportRuler=e,this._ngZone=i,this._config=s,this._scrollSubscription=null}attach(t){this._overlayRef,this._overlayRef=t}enable(){if(!this._scrollSubscription){let t=this._config?this._config.scrollThrottle:0;this._scrollSubscription=this._scrollDispatcher.scrolled(t).subscribe(()=>{if(this._overlayRef.updatePosition(),this._config&&this._config.autoClose){let e=this._overlayRef.overlayElement.getBoundingClientRect(),{width:i,height:s}=this._viewportRuler.getViewportSize();W(e,[{width:i,height:s,bottom:s,right:i,top:0,left:0}])&&(this.disable(),this._ngZone.run(()=>this._overlayRef.detach()))}})}}disable(){this._scrollSubscription&&(this._scrollSubscription.unsubscribe(),this._scrollSubscription=null)}detach(){this.disable(),this._overlayRef=null}},Xt=(()=>{class o{constructor(e,i,s,n){this._scrollDispatcher=e,this._viewportRuler=i,this._ngZone=s,this.noop=()=>new M,this.close=r=>new N(this._scrollDispatcher,this._ngZone,this._viewportRuler,r),this.block=()=>new V(this._viewportRuler,this._document),this.reposition=r=>new z(this._scrollDispatcher,this._viewportRuler,this._ngZone,r),this._document=n}static{this.\u0275fac=function(i){return new(i||o)(d(F),d(B),d(S),d(b))}}static{this.\u0275prov=m({token:o,factory:o.\u0275fac,providedIn:"root"})}}return o})(),L=class{constructor(t){if(this.scrollStrategy=new M,this.panelClass="",this.hasBackdrop=!1,this.backdropClass="cdk-overlay-dark-backdrop",this.disposeOnNavigation=!1,t){let e=Object.keys(t);for(let i of e)t[i]!==void 0&&(this[i]=t[i])}}};var Z=class{constructor(t,e){this.connectionPair=t,this.scrollableViewProperties=e}};var Mt=(()=>{class o{constructor(e){this._attachedOverlays=[],this._document=e}ngOnDestroy(){this.detach()}add(e){this.remove(e),this._attachedOverlays.push(e)}remove(e){let i=this._attachedOverlays.indexOf(e);i>-1&&this._attachedOverlays.splice(i,1),this._attachedOverlays.length===0&&this.detach()}static{this.\u0275fac=function(i){return new(i||o)(d(b))}}static{this.\u0275prov=m({token:o,factory:o.\u0275fac,providedIn:"root"})}}return o})(),jt=(()=>{class o extends Mt{constructor(e,i){super(e),this._ngZone=i,this._keydownListener=s=>{let n=this._attachedOverlays;for(let r=n.length-1;r>-1;r--)if(n[r]._keydownEvents.observers.length>0){let h=n[r]._keydownEvents;this._ngZone?this._ngZone.run(()=>h.next(s)):h.next(s);break}}}add(e){super.add(e),this._isAttached||(this._ngZone?this._ngZone.runOutsideAngular(()=>this._document.body.addEventListener("keydown",this._keydownListener)):this._document.body.addEventListener("keydown",this._keydownListener),this._isAttached=!0)}detach(){this._isAttached&&(this._document.body.removeEventListener("keydown",this._keydownListener),this._isAttached=!1)}static{this.\u0275fac=function(i){return new(i||o)(d(b),d(S,8))}}static{this.\u0275prov=m({token:o,factory:o.\u0275fac,providedIn:"root"})}}return o})(),It=(()=>{class o extends Mt{constructor(e,i,s){super(e),this._platform=i,this._ngZone=s,this._cursorStyleIsSet=!1,this._pointerDownListener=n=>{this._pointerDownEventTarget=D(n)},this._clickListener=n=>{let r=D(n),h=n.type==="click"&&this._pointerDownEventTarget?this._pointerDownEventTarget:r;this._pointerDownEventTarget=null;let a=this._attachedOverlays.slice();for(let c=a.length-1;c>-1;c--){let l=a[c];if(l._outsidePointerEvents.observers.length<1||!l.hasAttached())continue;if(Ct(l.overlayElement,r)||Ct(l.overlayElement,h))break;let _=l._outsidePointerEvents;this._ngZone?this._ngZone.run(()=>_.next(n)):_.next(n)}}}add(e){if(super.add(e),!this._isAttached){let i=this._document.body;this._ngZone?this._ngZone.runOutsideAngular(()=>this._addEventListeners(i)):this._addEventListeners(i),this._platform.IOS&&!this._cursorStyleIsSet&&(this._cursorOriginalValue=i.style.cursor,i.style.cursor="pointer",this._cursorStyleIsSet=!0),this._isAttached=!0}}detach(){if(this._isAttached){let e=this._document.body;e.removeEventListener("pointerdown",this._pointerDownListener,!0),e.removeEventListener("click",this._clickListener,!0),e.removeEventListener("auxclick",this._clickListener,!0),e.removeEventListener("contextmenu",this._clickListener,!0),this._platform.IOS&&this._cursorStyleIsSet&&(e.style.cursor=this._cursorOriginalValue,this._cursorStyleIsSet=!1),this._isAttached=!1}}_addEventListeners(e){e.addEventListener("pointerdown",this._pointerDownListener,!0),e.addEventListener("click",this._clickListener,!0),e.addEventListener("auxclick",this._clickListener,!0),e.addEventListener("contextmenu",this._clickListener,!0)}static{this.\u0275fac=function(i){return new(i||o)(d(b),d(R),d(S,8))}}static{this.\u0275prov=m({token:o,factory:o.\u0275fac,providedIn:"root"})}}return o})();function Ct(o,t){let e=typeof ShadowRoot<"u"&&ShadowRoot,i=t;for(;i;){if(i===o)return!0;i=e&&i instanceof ShadowRoot?i.host:i.parentNode}return!1}var Lt=(()=>{class o{constructor(e,i){this._platform=i,this._document=e}ngOnDestroy(){this._containerElement?.remove()}getContainerElement(){return this._containerElement||this._createContainer(),this._containerElement}_createContainer(){let e="cdk-overlay-container";if(this._platform.isBrowser||j()){let s=this._document.querySelectorAll(`.${e}[platform="server"], .${e}[platform="test"]`);for(let n=0;n<s.length;n++)s[n].remove()}let i=this._document.createElement("div");i.classList.add(e),j()?i.setAttribute("platform","test"):this._platform.isBrowser||i.setAttribute("platform","server"),this._document.body.appendChild(i),this._containerElement=i}static{this.\u0275fac=function(i){return new(i||o)(d(b),d(R))}}static{this.\u0275prov=m({token:o,factory:o.\u0275fac,providedIn:"root"})}}return o})(),$=class{constructor(t,e,i,s,n,r,h,a,c,l=!1,_){this._portalOutlet=t,this._host=e,this._pane=i,this._config=s,this._ngZone=n,this._keyboardDispatcher=r,this._document=h,this._location=a,this._outsideClickDispatcher=c,this._animationsDisabled=l,this._injector=_,this._backdropElement=null,this._backdropClick=new v,this._attachments=new v,this._detachments=new v,this._locationChanges=w.EMPTY,this._backdropClickHandler=u=>this._backdropClick.next(u),this._backdropTransitionendHandler=u=>{this._disposeBackdrop(u.target)},this._keydownEvents=new v,this._outsidePointerEvents=new v,this._renders=new v,s.scrollStrategy&&(this._scrollStrategy=s.scrollStrategy,this._scrollStrategy.attach(this)),this._positionStrategy=s.positionStrategy,this._afterRenderRef=gt(()=>ft(()=>{this._renders.next()},{injector:this._injector}))}get overlayElement(){return this._pane}get backdropElement(){return this._backdropElement}get hostElement(){return this._host}attach(t){!this._host.parentElement&&this._previousHostParent&&this._previousHostParent.appendChild(this._host);let e=this._portalOutlet.attach(t);return this._positionStrategy&&this._positionStrategy.attach(this),this._updateStackingOrder(),this._updateElementSize(),this._updateElementDirection(),this._scrollStrategy&&this._scrollStrategy.enable(),this._afterNextRenderRef?.destroy(),this._afterNextRenderRef=pt(()=>{this.hasAttached()&&this.updatePosition()},{injector:this._injector}),this._togglePointerEvents(!0),this._config.hasBackdrop&&this._attachBackdrop(),this._config.panelClass&&this._toggleClasses(this._pane,this._config.panelClass,!0),this._attachments.next(),this._keyboardDispatcher.add(this),this._config.disposeOnNavigation&&(this._locationChanges=this._location.subscribe(()=>this.dispose())),this._outsideClickDispatcher.add(this),typeof e?.onDestroy=="function"&&e.onDestroy(()=>{this.hasAttached()&&this._ngZone.runOutsideAngular(()=>Promise.resolve().then(()=>this.detach()))}),e}detach(){if(!this.hasAttached())return;this.detachBackdrop(),this._togglePointerEvents(!1),this._positionStrategy&&this._positionStrategy.detach&&this._positionStrategy.detach(),this._scrollStrategy&&this._scrollStrategy.disable();let t=this._portalOutlet.detach();return this._detachments.next(),this._keyboardDispatcher.remove(this),this._detachContentWhenEmpty(),this._locationChanges.unsubscribe(),this._outsideClickDispatcher.remove(this),t}dispose(){let t=this.hasAttached();this._positionStrategy&&this._positionStrategy.dispose(),this._disposeScrollStrategy(),this._disposeBackdrop(this._backdropElement),this._locationChanges.unsubscribe(),this._keyboardDispatcher.remove(this),this._portalOutlet.dispose(),this._attachments.complete(),this._backdropClick.complete(),this._keydownEvents.complete(),this._outsidePointerEvents.complete(),this._outsideClickDispatcher.remove(this),this._host?.remove(),this._afterNextRenderRef?.destroy(),this._previousHostParent=this._pane=this._host=null,t&&this._detachments.next(),this._detachments.complete(),this._afterRenderRef.destroy(),this._renders.complete()}hasAttached(){return this._portalOutlet.hasAttached()}backdropClick(){return this._backdropClick}attachments(){return this._attachments}detachments(){return this._detachments}keydownEvents(){return this._keydownEvents}outsidePointerEvents(){return this._outsidePointerEvents}getConfig(){return this._config}updatePosition(){this._positionStrategy&&this._positionStrategy.apply()}updatePositionStrategy(t){t!==this._positionStrategy&&(this._positionStrategy&&this._positionStrategy.dispose(),this._positionStrategy=t,this.hasAttached()&&(t.attach(this),this.updatePosition()))}updateSize(t){this._config=P(P({},this._config),t),this._updateElementSize()}setDirection(t){this._config=U(P({},this._config),{direction:t}),this._updateElementDirection()}addPanelClass(t){this._pane&&this._toggleClasses(this._pane,t,!0)}removePanelClass(t){this._pane&&this._toggleClasses(this._pane,t,!1)}getDirection(){let t=this._config.direction;return t?typeof t=="string"?t:t.value:"ltr"}updateScrollStrategy(t){t!==this._scrollStrategy&&(this._disposeScrollStrategy(),this._scrollStrategy=t,this.hasAttached()&&(t.attach(this),t.enable()))}_updateElementDirection(){this._host.setAttribute("dir",this.getDirection())}_updateElementSize(){if(!this._pane)return;let t=this._pane.style;t.width=f(this._config.width),t.height=f(this._config.height),t.minWidth=f(this._config.minWidth),t.minHeight=f(this._config.minHeight),t.maxWidth=f(this._config.maxWidth),t.maxHeight=f(this._config.maxHeight)}_togglePointerEvents(t){this._pane.style.pointerEvents=t?"":"none"}_attachBackdrop(){let t="cdk-overlay-backdrop-showing";this._backdropElement=this._document.createElement("div"),this._backdropElement.classList.add("cdk-overlay-backdrop"),this._animationsDisabled&&this._backdropElement.classList.add("cdk-overlay-backdrop-noop-animation"),this._config.backdropClass&&this._toggleClasses(this._backdropElement,this._config.backdropClass,!0),this._host.parentElement.insertBefore(this._backdropElement,this._host),this._backdropElement.addEventListener("click",this._backdropClickHandler),!this._animationsDisabled&&typeof requestAnimationFrame<"u"?this._ngZone.runOutsideAngular(()=>{requestAnimationFrame(()=>{this._backdropElement&&this._backdropElement.classList.add(t)})}):this._backdropElement.classList.add(t)}_updateStackingOrder(){this._host.nextSibling&&this._host.parentNode.appendChild(this._host)}detachBackdrop(){let t=this._backdropElement;if(t){if(this._animationsDisabled){this._disposeBackdrop(t);return}t.classList.remove("cdk-overlay-backdrop-showing"),this._ngZone.runOutsideAngular(()=>{t.addEventListener("transitionend",this._backdropTransitionendHandler)}),t.style.pointerEvents="none",this._backdropTimeout=this._ngZone.runOutsideAngular(()=>setTimeout(()=>{this._disposeBackdrop(t)},500))}}_toggleClasses(t,e,i){let s=I(e||[]).filter(n=>!!n);s.length&&(i?t.classList.add(...s):t.classList.remove(...s))}_detachContentWhenEmpty(){this._ngZone.runOutsideAngular(()=>{let t=this._renders.pipe(tt(J(this._attachments,this._detachments))).subscribe(()=>{(!this._pane||!this._host||this._pane.children.length===0)&&(this._pane&&this._config.panelClass&&this._toggleClasses(this._pane,this._config.panelClass,!1),this._host&&this._host.parentElement&&(this._previousHostParent=this._host.parentElement,this._host.remove()),t.unsubscribe())})})}_disposeScrollStrategy(){let t=this._scrollStrategy;t&&(t.disable(),t.detach&&t.detach())}_disposeBackdrop(t){t&&(t.removeEventListener("click",this._backdropClickHandler),t.removeEventListener("transitionend",this._backdropTransitionendHandler),t.remove(),this._backdropElement===t&&(this._backdropElement=null)),this._backdropTimeout&&(clearTimeout(this._backdropTimeout),this._backdropTimeout=void 0)}},xt="cdk-overlay-connected-position-bounding-box",Tt=/([A-Za-z%]+)$/,K=class{get positions(){return this._preferredPositions}constructor(t,e,i,s,n){this._viewportRuler=e,this._document=i,this._platform=s,this._overlayContainer=n,this._lastBoundingBoxSize={width:0,height:0},this._isPushed=!1,this._canPush=!0,this._growAfterOpen=!1,this._hasFlexibleDimensions=!0,this._positionLocked=!1,this._viewportMargin=0,this._scrollables=[],this._preferredPositions=[],this._positionChanges=new v,this._resizeSubscription=w.EMPTY,this._offsetX=0,this._offsetY=0,this._appliedPanelClasses=[],this.positionChanges=this._positionChanges,this.setOrigin(t)}attach(t){this._overlayRef&&this._overlayRef,this._validatePositions(),t.hostElement.classList.add(xt),this._overlayRef=t,this._boundingBox=t.hostElement,this._pane=t.overlayElement,this._isDisposed=!1,this._isInitialRender=!0,this._lastPosition=null,this._resizeSubscription.unsubscribe(),this._resizeSubscription=this._viewportRuler.change().subscribe(()=>{this._isInitialRender=!0,this.apply()})}apply(){if(this._isDisposed||!this._platform.isBrowser)return;if(!this._isInitialRender&&this._positionLocked&&this._lastPosition){this.reapplyLastPosition();return}this._clearPanelClasses(),this._resetOverlayElementStyles(),this._resetBoundingBoxStyles(),this._viewportRect=this._getNarrowedViewportRect(),this._originRect=this._getOriginRect(),this._overlayRect=this._pane.getBoundingClientRect(),this._containerRect=this._overlayContainer.getContainerElement().getBoundingClientRect();let t=this._originRect,e=this._overlayRect,i=this._viewportRect,s=this._containerRect,n=[],r;for(let h of this._preferredPositions){let a=this._getOriginPoint(t,s,h),c=this._getOverlayPoint(a,e,h),l=this._getOverlayFit(c,e,i,h);if(l.isCompletelyWithinViewport){this._isPushed=!1,this._applyPosition(h,a);return}if(this._canFitWithFlexibleDimensions(l,c,i)){n.push({position:h,origin:a,overlayRect:e,boundingBoxRect:this._calculateBoundingBoxRect(a,h)});continue}(!r||r.overlayFit.visibleArea<l.visibleArea)&&(r={overlayFit:l,overlayPoint:c,originPoint:a,position:h,overlayRect:e})}if(n.length){let h=null,a=-1;for(let c of n){let l=c.boundingBoxRect.width*c.boundingBoxRect.height*(c.position.weight||1);l>a&&(a=l,h=c)}this._isPushed=!1,this._applyPosition(h.position,h.origin);return}if(this._canPush){this._isPushed=!0,this._applyPosition(r.position,r.originPoint);return}this._applyPosition(r.position,r.originPoint)}detach(){this._clearPanelClasses(),this._lastPosition=null,this._previousPushAmount=null,this._resizeSubscription.unsubscribe()}dispose(){this._isDisposed||(this._boundingBox&&C(this._boundingBox.style,{top:"",left:"",right:"",bottom:"",height:"",width:"",alignItems:"",justifyContent:""}),this._pane&&this._resetOverlayElementStyles(),this._overlayRef&&this._overlayRef.hostElement.classList.remove(xt),this.detach(),this._positionChanges.complete(),this._overlayRef=this._boundingBox=null,this._isDisposed=!0)}reapplyLastPosition(){if(this._isDisposed||!this._platform.isBrowser)return;let t=this._lastPosition;if(t){this._originRect=this._getOriginRect(),this._overlayRect=this._pane.getBoundingClientRect(),this._viewportRect=this._getNarrowedViewportRect(),this._containerRect=this._overlayContainer.getContainerElement().getBoundingClientRect();let e=this._getOriginPoint(this._originRect,this._containerRect,t);this._applyPosition(t,e)}else this.apply()}withScrollableContainers(t){return this._scrollables=t,this}withPositions(t){return this._preferredPositions=t,t.indexOf(this._lastPosition)===-1&&(this._lastPosition=null),this._validatePositions(),this}withViewportMargin(t){return this._viewportMargin=t,this}withFlexibleDimensions(t=!0){return this._hasFlexibleDimensions=t,this}withGrowAfterOpen(t=!0){return this._growAfterOpen=t,this}withPush(t=!0){return this._canPush=t,this}withLockedPosition(t=!0){return this._positionLocked=t,this}setOrigin(t){return this._origin=t,this}withDefaultOffsetX(t){return this._offsetX=t,this}withDefaultOffsetY(t){return this._offsetY=t,this}withTransformOriginOn(t){return this._transformOriginSelector=t,this}_getOriginPoint(t,e,i){let s;if(i.originX=="center")s=t.left+t.width/2;else{let r=this._isRtl()?t.right:t.left,h=this._isRtl()?t.left:t.right;s=i.originX=="start"?r:h}e.left<0&&(s-=e.left);let n;return i.originY=="center"?n=t.top+t.height/2:n=i.originY=="top"?t.top:t.bottom,e.top<0&&(n-=e.top),{x:s,y:n}}_getOverlayPoint(t,e,i){let s;i.overlayX=="center"?s=-e.width/2:i.overlayX==="start"?s=this._isRtl()?-e.width:0:s=this._isRtl()?0:-e.width;let n;return i.overlayY=="center"?n=-e.height/2:n=i.overlayY=="top"?0:-e.height,{x:t.x+s,y:t.y+n}}_getOverlayFit(t,e,i,s){let n=Rt(e),{x:r,y:h}=t,a=this._getOffset(s,"x"),c=this._getOffset(s,"y");a&&(r+=a),c&&(h+=c);let l=0-r,_=r+n.width-i.width,u=0-h,p=h+n.height-i.height,g=this._subtractOverflows(n.width,l,_),y=this._subtractOverflows(n.height,u,p),G=g*y;return{visibleArea:G,isCompletelyWithinViewport:n.width*n.height===G,fitsInViewportVertically:y===n.height,fitsInViewportHorizontally:g==n.width}}_canFitWithFlexibleDimensions(t,e,i){if(this._hasFlexibleDimensions){let s=i.bottom-e.y,n=i.right-e.x,r=Pt(this._overlayRef.getConfig().minHeight),h=Pt(this._overlayRef.getConfig().minWidth),a=t.fitsInViewportVertically||r!=null&&r<=s,c=t.fitsInViewportHorizontally||h!=null&&h<=n;return a&&c}return!1}_pushOverlayOnScreen(t,e,i){if(this._previousPushAmount&&this._positionLocked)return{x:t.x+this._previousPushAmount.x,y:t.y+this._previousPushAmount.y};let s=Rt(e),n=this._viewportRect,r=Math.max(t.x+s.width-n.width,0),h=Math.max(t.y+s.height-n.height,0),a=Math.max(n.top-i.top-t.y,0),c=Math.max(n.left-i.left-t.x,0),l=0,_=0;return s.width<=n.width?l=c||-r:l=t.x<this._viewportMargin?n.left-i.left-t.x:0,s.height<=n.height?_=a||-h:_=t.y<this._viewportMargin?n.top-i.top-t.y:0,this._previousPushAmount={x:l,y:_},{x:t.x+l,y:t.y+_}}_applyPosition(t,e){if(this._setTransformOrigin(t),this._setOverlayElementStyles(e,t),this._setBoundingBoxStyles(e,t),t.panelClass&&this._addPanelClasses(t.panelClass),this._positionChanges.observers.length){let i=this._getScrollVisibility();if(t!==this._lastPosition||!this._lastScrollVisibility||!Ft(this._lastScrollVisibility,i)){let s=new Z(t,i);this._positionChanges.next(s)}this._lastScrollVisibility=i}this._lastPosition=t,this._isInitialRender=!1}_setTransformOrigin(t){if(!this._transformOriginSelector)return;let e=this._boundingBox.querySelectorAll(this._transformOriginSelector),i,s=t.overlayY;t.overlayX==="center"?i="center":this._isRtl()?i=t.overlayX==="start"?"right":"left":i=t.overlayX==="start"?"left":"right";for(let n=0;n<e.length;n++)e[n].style.transformOrigin=`${i} ${s}`}_calculateBoundingBoxRect(t,e){let i=this._viewportRect,s=this._isRtl(),n,r,h;if(e.overlayY==="top")r=t.y,n=i.height-r+this._viewportMargin;else if(e.overlayY==="bottom")h=i.height-t.y+this._viewportMargin*2,n=i.height-h+this._viewportMargin;else{let p=Math.min(i.bottom-t.y+i.top,t.y),g=this._lastBoundingBoxSize.height;n=p*2,r=t.y-p,n>g&&!this._isInitialRender&&!this._growAfterOpen&&(r=t.y-g/2)}let a=e.overlayX==="start"&&!s||e.overlayX==="end"&&s,c=e.overlayX==="end"&&!s||e.overlayX==="start"&&s,l,_,u;if(c)u=i.width-t.x+this._viewportMargin*2,l=t.x-this._viewportMargin;else if(a)_=t.x,l=i.right-t.x;else{let p=Math.min(i.right-t.x+i.left,t.x),g=this._lastBoundingBoxSize.width;l=p*2,_=t.x-p,l>g&&!this._isInitialRender&&!this._growAfterOpen&&(_=t.x-g/2)}return{top:r,left:_,bottom:h,right:u,width:l,height:n}}_setBoundingBoxStyles(t,e){let i=this._calculateBoundingBoxRect(t,e);!this._isInitialRender&&!this._growAfterOpen&&(i.height=Math.min(i.height,this._lastBoundingBoxSize.height),i.width=Math.min(i.width,this._lastBoundingBoxSize.width));let s={};if(this._hasExactPosition())s.top=s.left="0",s.bottom=s.right=s.maxHeight=s.maxWidth="",s.width=s.height="100%";else{let n=this._overlayRef.getConfig().maxHeight,r=this._overlayRef.getConfig().maxWidth;s.height=f(i.height),s.top=f(i.top),s.bottom=f(i.bottom),s.width=f(i.width),s.left=f(i.left),s.right=f(i.right),e.overlayX==="center"?s.alignItems="center":s.alignItems=e.overlayX==="end"?"flex-end":"flex-start",e.overlayY==="center"?s.justifyContent="center":s.justifyContent=e.overlayY==="bottom"?"flex-end":"flex-start",n&&(s.maxHeight=f(n)),r&&(s.maxWidth=f(r))}this._lastBoundingBoxSize=i,C(this._boundingBox.style,s)}_resetBoundingBoxStyles(){C(this._boundingBox.style,{top:"0",left:"0",right:"0",bottom:"0",height:"",width:"",alignItems:"",justifyContent:""})}_resetOverlayElementStyles(){C(this._pane.style,{top:"",left:"",bottom:"",right:"",position:"",transform:""})}_setOverlayElementStyles(t,e){let i={},s=this._hasExactPosition(),n=this._hasFlexibleDimensions,r=this._overlayRef.getConfig();if(s){let l=this._viewportRuler.getViewportScrollPosition();C(i,this._getExactOverlayY(e,t,l)),C(i,this._getExactOverlayX(e,t,l))}else i.position="static";let h="",a=this._getOffset(e,"x"),c=this._getOffset(e,"y");a&&(h+=`translateX(${a}px) `),c&&(h+=`translateY(${c}px)`),i.transform=h.trim(),r.maxHeight&&(s?i.maxHeight=f(r.maxHeight):n&&(i.maxHeight="")),r.maxWidth&&(s?i.maxWidth=f(r.maxWidth):n&&(i.maxWidth="")),C(this._pane.style,i)}_getExactOverlayY(t,e,i){let s={top:"",bottom:""},n=this._getOverlayPoint(e,this._overlayRect,t);if(this._isPushed&&(n=this._pushOverlayOnScreen(n,this._overlayRect,i)),t.overlayY==="bottom"){let r=this._document.documentElement.clientHeight;s.bottom=`${r-(n.y+this._overlayRect.height)}px`}else s.top=f(n.y);return s}_getExactOverlayX(t,e,i){let s={left:"",right:""},n=this._getOverlayPoint(e,this._overlayRect,t);this._isPushed&&(n=this._pushOverlayOnScreen(n,this._overlayRect,i));let r;if(this._isRtl()?r=t.overlayX==="end"?"left":"right":r=t.overlayX==="end"?"right":"left",r==="right"){let h=this._document.documentElement.clientWidth;s.right=`${h-(n.x+this._overlayRect.width)}px`}else s.left=f(n.x);return s}_getScrollVisibility(){let t=this._getOriginRect(),e=this._pane.getBoundingClientRect(),i=this._scrollables.map(s=>s.getElementRef().nativeElement.getBoundingClientRect());return{isOriginClipped:kt(t,i),isOriginOutsideView:W(t,i),isOverlayClipped:kt(e,i),isOverlayOutsideView:W(e,i)}}_subtractOverflows(t,...e){return e.reduce((i,s)=>i-Math.max(s,0),t)}_getNarrowedViewportRect(){let t=this._document.documentElement.clientWidth,e=this._document.documentElement.clientHeight,i=this._viewportRuler.getViewportScrollPosition();return{top:i.top+this._viewportMargin,left:i.left+this._viewportMargin,right:i.left+t-this._viewportMargin,bottom:i.top+e-this._viewportMargin,width:t-2*this._viewportMargin,height:e-2*this._viewportMargin}}_isRtl(){return this._overlayRef.getDirection()==="rtl"}_hasExactPosition(){return!this._hasFlexibleDimensions||this._isPushed}_getOffset(t,e){return e==="x"?t.offsetX==null?this._offsetX:t.offsetX:t.offsetY==null?this._offsetY:t.offsetY}_validatePositions(){}_addPanelClasses(t){this._pane&&I(t).forEach(e=>{e!==""&&this._appliedPanelClasses.indexOf(e)===-1&&(this._appliedPanelClasses.push(e),this._pane.classList.add(e))})}_clearPanelClasses(){this._pane&&(this._appliedPanelClasses.forEach(t=>{this._pane.classList.remove(t)}),this._appliedPanelClasses=[])}_getOriginRect(){let t=this._origin;if(t instanceof x)return t.nativeElement.getBoundingClientRect();if(t instanceof Element)return t.getBoundingClientRect();let e=t.width||0,i=t.height||0;return{top:t.y,bottom:t.y+i,left:t.x,right:t.x+e,height:i,width:e}}};function C(o,t){for(let e in t)t.hasOwnProperty(e)&&(o[e]=t[e]);return o}function Pt(o){if(typeof o!="number"&&o!=null){let[t,e]=o.split(Tt);return!e||e==="px"?parseFloat(t):null}return o||null}function Rt(o){return{top:Math.floor(o.top),right:Math.floor(o.right),bottom:Math.floor(o.bottom),left:Math.floor(o.left),width:Math.floor(o.width),height:Math.floor(o.height)}}function Ft(o,t){return o===t?!0:o.isOriginClipped===t.isOriginClipped&&o.isOriginOutsideView===t.isOriginOutsideView&&o.isOverlayClipped===t.isOverlayClipped&&o.isOverlayOutsideView===t.isOverlayOutsideView}var Dt="cdk-global-overlay-wrapper",q=class{constructor(){this._cssPosition="static",this._topOffset="",this._bottomOffset="",this._alignItems="",this._xPosition="",this._xOffset="",this._width="",this._height="",this._isDisposed=!1}attach(t){let e=t.getConfig();this._overlayRef=t,this._width&&!e.width&&t.updateSize({width:this._width}),this._height&&!e.height&&t.updateSize({height:this._height}),t.hostElement.classList.add(Dt),this._isDisposed=!1}top(t=""){return this._bottomOffset="",this._topOffset=t,this._alignItems="flex-start",this}left(t=""){return this._xOffset=t,this._xPosition="left",this}bottom(t=""){return this._topOffset="",this._bottomOffset=t,this._alignItems="flex-end",this}right(t=""){return this._xOffset=t,this._xPosition="right",this}start(t=""){return this._xOffset=t,this._xPosition="start",this}end(t=""){return this._xOffset=t,this._xPosition="end",this}width(t=""){return this._overlayRef?this._overlayRef.updateSize({width:t}):this._width=t,this}height(t=""){return this._overlayRef?this._overlayRef.updateSize({height:t}):this._height=t,this}centerHorizontally(t=""){return this.left(t),this._xPosition="center",this}centerVertically(t=""){return this.top(t),this._alignItems="center",this}apply(){if(!this._overlayRef||!this._overlayRef.hasAttached())return;let t=this._overlayRef.overlayElement.style,e=this._overlayRef.hostElement.style,i=this._overlayRef.getConfig(),{width:s,height:n,maxWidth:r,maxHeight:h}=i,a=(s==="100%"||s==="100vw")&&(!r||r==="100%"||r==="100vw"),c=(n==="100%"||n==="100vh")&&(!h||h==="100%"||h==="100vh"),l=this._xPosition,_=this._xOffset,u=this._overlayRef.getConfig().direction==="rtl",p="",g="",y="";a?y="flex-start":l==="center"?(y="center",u?g=_:p=_):u?l==="left"||l==="end"?(y="flex-end",p=_):(l==="right"||l==="start")&&(y="flex-start",g=_):l==="left"||l==="start"?(y="flex-start",p=_):(l==="right"||l==="end")&&(y="flex-end",g=_),t.position=this._cssPosition,t.marginLeft=a?"0":p,t.marginTop=c?"0":this._topOffset,t.marginBottom=this._bottomOffset,t.marginRight=a?"0":g,e.justifyContent=y,e.alignItems=c?"flex-start":this._alignItems}dispose(){if(this._isDisposed||!this._overlayRef)return;let t=this._overlayRef.overlayElement.style,e=this._overlayRef.hostElement,i=e.style;e.classList.remove(Dt),i.justifyContent=i.alignItems=t.marginTop=t.marginBottom=t.marginLeft=t.marginRight=t.position="",this._overlayRef=null,this._isDisposed=!0}},Ht=(()=>{class o{constructor(e,i,s,n){this._viewportRuler=e,this._document=i,this._platform=s,this._overlayContainer=n}global(){return new q}flexibleConnectedTo(e){return new K(e,this._viewportRuler,this._document,this._platform,this._overlayContainer)}static{this.\u0275fac=function(i){return new(i||o)(d(B),d(b),d(R),d(Lt))}}static{this.\u0275prov=m({token:o,factory:o.\u0275fac,providedIn:"root"})}}return o})(),Vt=0,A=(()=>{class o{constructor(e,i,s,n,r,h,a,c,l,_,u,p){this.scrollStrategies=e,this._overlayContainer=i,this._componentFactoryResolver=s,this._positionBuilder=n,this._keyboardDispatcher=r,this._injector=h,this._ngZone=a,this._document=c,this._directionality=l,this._location=_,this._outsideClickDispatcher=u,this._animationsModuleType=p}create(e){let i=this._createHostElement(),s=this._createPaneElement(i),n=this._createPortalOutlet(s),r=new L(e);return r.direction=r.direction||this._directionality.value,new $(n,i,s,r,this._ngZone,this._keyboardDispatcher,this._document,this._location,this._outsideClickDispatcher,this._animationsModuleType==="NoopAnimations",this._injector.get(nt))}position(){return this._positionBuilder}_createPaneElement(e){let i=this._document.createElement("div");return i.id=`cdk-overlay-${Vt++}`,i.classList.add("cdk-overlay-pane"),e.appendChild(i),i}_createHostElement(){let e=this._document.createElement("div");return this._overlayContainer.getContainerElement().appendChild(e),e}_createPortalOutlet(e){return this._appRef||(this._appRef=this._injector.get(ut)),new Ot(e,this._componentFactoryResolver,this._appRef,this._injector,this._document)}static{this.\u0275fac=function(i){return new(i||o)(d(Xt),d(Lt),d(ct),d(Ht),d(jt),d(ht),d(S),d(b),d(T),d(yt),d(It),d(lt,8))}}static{this.\u0275prov=m({token:o,factory:o.\u0275fac,providedIn:"root"})}}return o})(),Nt=[{originX:"start",originY:"bottom",overlayX:"start",overlayY:"top"},{originX:"start",originY:"top",overlayX:"start",overlayY:"bottom"},{originX:"end",originY:"top",overlayX:"end",overlayY:"bottom"},{originX:"end",originY:"bottom",overlayX:"end",overlayY:"top"}],At=new st("cdk-connected-overlay-scroll-strategy",{providedIn:"root",factory:()=>{let o=Y(A);return()=>o.scrollStrategies.reposition()}}),Bt=(()=>{class o{constructor(e){this.elementRef=e}static{this.\u0275fac=function(i){return new(i||o)(E(x))}}static{this.\u0275dir=X({type:o,selectors:[["","cdk-overlay-origin",""],["","overlay-origin",""],["","cdkOverlayOrigin",""]],exportAs:["cdkOverlayOrigin"],standalone:!0})}}return o})(),ue=(()=>{class o{get offsetX(){return this._offsetX}set offsetX(e){this._offsetX=e,this._position&&this._updatePositionStrategy(this._position)}get offsetY(){return this._offsetY}set offsetY(e){this._offsetY=e,this._position&&this._updatePositionStrategy(this._position)}get disposeOnNavigation(){return this._disposeOnNavigation}set disposeOnNavigation(e){this._disposeOnNavigation=e}constructor(e,i,s,n,r){this._overlay=e,this._dir=r,this._backdropSubscription=w.EMPTY,this._attachSubscription=w.EMPTY,this._detachSubscription=w.EMPTY,this._positionSubscription=w.EMPTY,this._disposeOnNavigation=!1,this._ngZone=Y(S),this.viewportMargin=0,this.open=!1,this.disableClose=!1,this.hasBackdrop=!1,this.lockPosition=!1,this.flexibleDimensions=!1,this.growAfterOpen=!1,this.push=!1,this.backdropClick=new O,this.positionChange=new O,this.attach=new O,this.detach=new O,this.overlayKeydown=new O,this.overlayOutsideClick=new O,this._templatePortal=new wt(i,s),this._scrollStrategyFactory=n,this.scrollStrategy=this._scrollStrategyFactory()}get overlayRef(){return this._overlayRef}get dir(){return this._dir?this._dir.value:"ltr"}ngOnDestroy(){this._attachSubscription.unsubscribe(),this._detachSubscription.unsubscribe(),this._backdropSubscription.unsubscribe(),this._positionSubscription.unsubscribe(),this._overlayRef&&this._overlayRef.dispose()}ngOnChanges(e){this._position&&(this._updatePositionStrategy(this._position),this._overlayRef.updateSize({width:this.width,minWidth:this.minWidth,height:this.height,minHeight:this.minHeight}),e.origin&&this.open&&this._position.apply()),e.open&&(this.open?this._attachOverlay():this._detachOverlay())}_createOverlay(){(!this.positions||!this.positions.length)&&(this.positions=Nt);let e=this._overlayRef=this._overlay.create(this._buildConfig());this._attachSubscription=e.attachments().subscribe(()=>this.attach.emit()),this._detachSubscription=e.detachments().subscribe(()=>this.detach.emit()),e.keydownEvents().subscribe(i=>{this.overlayKeydown.next(i),i.keyCode===27&&!this.disableClose&&!mt(i)&&(i.preventDefault(),this._detachOverlay())}),this._overlayRef.outsidePointerEvents().subscribe(i=>{let s=this._getOriginElement(),n=D(i);(!s||s!==n&&!s.contains(n))&&this.overlayOutsideClick.next(i)})}_buildConfig(){let e=this._position=this.positionStrategy||this._createPositionStrategy(),i=new L({direction:this._dir,positionStrategy:e,scrollStrategy:this.scrollStrategy,hasBackdrop:this.hasBackdrop,disposeOnNavigation:this.disposeOnNavigation});return(this.width||this.width===0)&&(i.width=this.width),(this.height||this.height===0)&&(i.height=this.height),(this.minWidth||this.minWidth===0)&&(i.minWidth=this.minWidth),(this.minHeight||this.minHeight===0)&&(i.minHeight=this.minHeight),this.backdropClass&&(i.backdropClass=this.backdropClass),this.panelClass&&(i.panelClass=this.panelClass),i}_updatePositionStrategy(e){let i=this.positions.map(s=>({originX:s.originX,originY:s.originY,overlayX:s.overlayX,overlayY:s.overlayY,offsetX:s.offsetX||this.offsetX,offsetY:s.offsetY||this.offsetY,panelClass:s.panelClass||void 0}));return e.setOrigin(this._getOrigin()).withPositions(i).withFlexibleDimensions(this.flexibleDimensions).withPush(this.push).withGrowAfterOpen(this.growAfterOpen).withViewportMargin(this.viewportMargin).withLockedPosition(this.lockPosition).withTransformOriginOn(this.transformOriginSelector)}_createPositionStrategy(){let e=this._overlay.position().flexibleConnectedTo(this._getOrigin());return this._updatePositionStrategy(e),e}_getOrigin(){return this.origin instanceof Bt?this.origin.elementRef:this.origin}_getOriginElement(){return this.origin instanceof Bt?this.origin.elementRef.nativeElement:this.origin instanceof x?this.origin.nativeElement:typeof Element<"u"&&this.origin instanceof Element?this.origin:null}_attachOverlay(){this._overlayRef?this._overlayRef.getConfig().hasBackdrop=this.hasBackdrop:this._createOverlay(),this._overlayRef.hasAttached()||this._overlayRef.attach(this._templatePortal),this.hasBackdrop?this._backdropSubscription=this._overlayRef.backdropClick().subscribe(e=>{this.backdropClick.emit(e)}):this._backdropSubscription.unsubscribe(),this._positionSubscription.unsubscribe(),this.positionChange.observers.length>0&&(this._positionSubscription=this._position.positionChanges.pipe(et(()=>this.positionChange.observers.length>0)).subscribe(e=>{this._ngZone.run(()=>this.positionChange.emit(e)),this.positionChange.observers.length===0&&this._positionSubscription.unsubscribe()}))}_detachOverlay(){this._overlayRef&&this._overlayRef.detach(),this._backdropSubscription.unsubscribe(),this._positionSubscription.unsubscribe()}static{this.\u0275fac=function(i){return new(i||o)(E(A),E(at),E(dt),E(At),E(T,8))}}static{this.\u0275dir=X({type:o,selectors:[["","cdk-connected-overlay",""],["","connected-overlay",""],["","cdkConnectedOverlay",""]],inputs:{origin:[0,"cdkConnectedOverlayOrigin","origin"],positions:[0,"cdkConnectedOverlayPositions","positions"],positionStrategy:[0,"cdkConnectedOverlayPositionStrategy","positionStrategy"],offsetX:[0,"cdkConnectedOverlayOffsetX","offsetX"],offsetY:[0,"cdkConnectedOverlayOffsetY","offsetY"],width:[0,"cdkConnectedOverlayWidth","width"],height:[0,"cdkConnectedOverlayHeight","height"],minWidth:[0,"cdkConnectedOverlayMinWidth","minWidth"],minHeight:[0,"cdkConnectedOverlayMinHeight","minHeight"],backdropClass:[0,"cdkConnectedOverlayBackdropClass","backdropClass"],panelClass:[0,"cdkConnectedOverlayPanelClass","panelClass"],viewportMargin:[0,"cdkConnectedOverlayViewportMargin","viewportMargin"],scrollStrategy:[0,"cdkConnectedOverlayScrollStrategy","scrollStrategy"],open:[0,"cdkConnectedOverlayOpen","open"],disableClose:[0,"cdkConnectedOverlayDisableClose","disableClose"],transformOriginSelector:[0,"cdkConnectedOverlayTransformOriginOn","transformOriginSelector"],hasBackdrop:[2,"cdkConnectedOverlayHasBackdrop","hasBackdrop",k],lockPosition:[2,"cdkConnectedOverlayLockPosition","lockPosition",k],flexibleDimensions:[2,"cdkConnectedOverlayFlexibleDimensions","flexibleDimensions",k],growAfterOpen:[2,"cdkConnectedOverlayGrowAfterOpen","growAfterOpen",k],push:[2,"cdkConnectedOverlayPush","push",k],disposeOnNavigation:[2,"cdkConnectedOverlayDisposeOnNavigation","disposeOnNavigation",k]},outputs:{backdropClick:"backdropClick",positionChange:"positionChange",attach:"attach",detach:"detach",overlayKeydown:"overlayKeydown",overlayOutsideClick:"overlayOutsideClick"},exportAs:["cdkConnectedOverlay"],standalone:!0,features:[_t,rt]})}}return o})();function Wt(o){return()=>o.scrollStrategies.reposition()}var zt={provide:At,deps:[A],useFactory:Wt},ge=(()=>{class o{static{this.\u0275fac=function(i){return new(i||o)}}static{this.\u0275mod=ot({type:o})}static{this.\u0275inj=it({providers:[A,zt],imports:[bt,St,H,H]})}}return o})();export{Xt as a,L as b,Lt as c,$ as d,K as e,A as f,Bt as g,ue as h,ge as i};
