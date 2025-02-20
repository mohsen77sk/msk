import{a as H,c as G}from"./chunk-KRSRM2PD.js";import{a as Z,g as P,h as j}from"./chunk-M4U4SQ7W.js";import{b as U,c as $,d as z,e as B}from"./chunk-YD7KBF2G.js";import{c as b,d as S,f as c,g as x,h as w,i as p}from"./chunk-2WU4DPTY.js";import{b as O,ba as V,ga as L,ja as R,oa as F}from"./chunk-LCK6TC4J.js";import{Eb as s,Nb as l,Tb as u,Xb as e,Yb as i,Zb as M,bc as k,hc as f,jb as r,jc as d,sa as _,ta as g,tc as T,uc as t,xb as D}from"./chunk-RXWBIK5J.js";var C=(()=>{class n{static{this.standard="cubic-bezier(0.4, 0.0, 0.2, 1)"}static{this.deceleration="cubic-bezier(0.0, 0.0, 0.2, 1)"}static{this.acceleration="cubic-bezier(0.4, 0.0, 1, 1)"}static{this.sharp="cubic-bezier(0.4, 0.0, 0.6, 1)"}}return n})(),E=(()=>{class n{static{this.complex="375ms"}static{this.entering="225ms"}static{this.exiting="195ms"}}return n})();var K=b("expandCollapse",[x("void, collapsed",c({height:"0"})),x("*, expanded",c("*")),p("void <=> false, collapsed <=> false, expanded <=> false",[]),p("void <=> *, collapsed <=> expanded",S("{{timings}}"),{params:{timings:`${E.entering} ${C.deceleration}`}})]);var Y=b("fadeIn",[x("void",c({opacity:0})),x("*",c({opacity:1})),p("void => false",[]),p("void => *",S("{{timings}}"),{params:{timings:`${E.entering} ${C.deceleration}`}})]),q=b("fadeInTop",[x("void",c({opacity:0,transform:"translate3d(0, -100%, 0)"})),x("*",c({opacity:1,transform:"translate3d(0, 0, 0)"})),p("void => false",[]),p("void => *",S("{{timings}}"),{params:{timings:`${E.entering} ${C.deceleration}`}})]),J=b("fadeInBottom",[x("void",c({opacity:0,transform:"translate3d(0, 100%, 0)"})),x("*",c({opacity:1,transform:"translate3d(0, 0, 0)"})),p("void => false",[]),p("void => *",S("{{timings}}"),{params:{timings:`${E.entering} ${C.deceleration}`}})]),N=b("fadeInLeft",[x("void",c({opacity:0,transform:"translate3d(-100%, 0, 0)"})),x("*",c({opacity:1,transform:"translate3d(0, 0, 0)"})),p("void => false",[]),p("void => *",S("{{timings}}"),{params:{timings:`${E.entering} ${C.deceleration}`}})]),Q=b("fadeInRight",[x("void",c({opacity:0,transform:"translate3d(100%, 0, 0)"})),x("*",c({opacity:1,transform:"translate3d(0, 0, 0)"})),p("void => false",[]),p("void => *",S("{{timings}}"),{params:{timings:`${E.entering} ${C.deceleration}`}})]),W=b("fadeOut",[x("*",c({opacity:1})),x("void",c({opacity:0})),p("false => void",[]),p("* => void",S("{{timings}}"),{params:{timings:`${E.exiting} ${C.acceleration}`}})]),X=b("fadeOutTop",[x("*",c({opacity:1,transform:"translate3d(0, 0, 0)"})),x("void",c({opacity:0,transform:"translate3d(0, -100%, 0)"})),p("false => void",[]),p("* => void",S("{{timings}}"),{params:{timings:`${E.exiting} ${C.acceleration}`}})]),tt=b("fadeOutBottom",[x("*",c({opacity:1,transform:"translate3d(0, 0, 0)"})),x("void",c({opacity:0,transform:"translate3d(0, 100%, 0)"})),p("false => void",[]),p("* => void",S("{{timings}}"),{params:{timings:`${E.exiting} ${C.acceleration}`}})]),et=b("fadeOutLeft",[x("*",c({opacity:1,transform:"translate3d(0, 0, 0)"})),x("void",c({opacity:0,transform:"translate3d(-100%, 0, 0)"})),p("false => void",[]),p("* => void",S("{{timings}}"),{params:{timings:`${E.exiting} ${C.acceleration}`}})]),it=b("fadeOutRight",[x("*",c({opacity:1,transform:"translate3d(0, 0, 0)"})),x("void",c({opacity:0,transform:"translate3d(100%, 0, 0)"})),p("false => void",[]),p("* => void",S("{{timings}}"),{params:{timings:`${E.exiting} ${C.acceleration}`}})]);var nt=b("shake",[p("void => false",[]),p("void => *, * => true",[S("{{timings}}",w([c({transform:"translate3d(0, 0, 0)",offset:0}),c({transform:"translate3d(-10px, 0, 0)",offset:.1}),c({transform:"translate3d(10px, 0, 0)",offset:.2}),c({transform:"translate3d(-10px, 0, 0)",offset:.3}),c({transform:"translate3d(10px, 0, 0)",offset:.4}),c({transform:"translate3d(-10px, 0, 0)",offset:.5}),c({transform:"translate3d(10px, 0, 0)",offset:.6}),c({transform:"translate3d(-10px, 0, 0)",offset:.7}),c({transform:"translate3d(10px, 0, 0)",offset:.8}),c({transform:"translate3d(-10px, 0, 0)",offset:.9}),c({transform:"translate3d(0, 0, 0)",offset:1})]))],{params:{timings:"0.8s cubic-bezier(0.455, 0.03, 0.515, 0.955)"}})]);var at=b("slideInTop",[x("void",c({transform:"translate3d(0, -100%, 0)"})),x("*",c({transform:"translate3d(0, 0, 0)"})),p("void => false",[]),p("void => *",S("{{timings}}"),{params:{timings:`${E.entering} ${C.deceleration}`}})]),ot=b("slideInBottom",[x("void",c({transform:"translate3d(0, 100%, 0)"})),x("*",c({transform:"translate3d(0, 0, 0)"})),p("void => false",[]),p("void => *",S("{{timings}}"),{params:{timings:`${E.entering} ${C.deceleration}`}})]),lt=b("slideInLeft",[x("void",c({transform:"translate3d(-100%, 0, 0)"})),x("*",c({transform:"translate3d(0, 0, 0)"})),p("void => false",[]),p("void => *",S("{{timings}}"),{params:{timings:`${E.entering} ${C.deceleration}`}})]),mt=b("slideInRight",[x("void",c({transform:"translate3d(100%, 0, 0)"})),x("*",c({transform:"translate3d(0, 0, 0)"})),p("void => false",[]),p("void => *",S("{{timings}}"),{params:{timings:`${E.entering} ${C.deceleration}`}})]),dt=b("slideOutTop",[x("*",c({transform:"translate3d(0, 0, 0)"})),x("void",c({transform:"translate3d(0, -100%, 0)"})),p("false => void",[]),p("* => void",S("{{timings}}"),{params:{timings:`${E.exiting} ${C.acceleration}`}})]),st=b("slideOutBottom",[x("*",c({transform:"translate3d(0, 0, 0)"})),x("void",c({transform:"translate3d(0, 100%, 0)"})),p("false => void",[]),p("* => void",S("{{timings}}"),{params:{timings:`${E.exiting} ${C.acceleration}`}})]),rt=b("slideOutLeft",[x("*",c({transform:"translate3d(0, 0, 0)"})),x("void",c({transform:"translate3d(-100%, 0, 0)"})),p("false => void",[]),p("* => void",S("{{timings}}"),{params:{timings:`${E.exiting} ${C.acceleration}`}})]),ct=b("slideOutRight",[x("*",c({transform:"translate3d(0, 0, 0)"})),x("void",c({transform:"translate3d(100%, 0, 0)"})),p("false => void",[]),p("* => void",S("{{timings}}"),{params:{timings:`${E.exiting} ${C.acceleration}`}})]);var pt=b("zoomIn",[x("void",c({opacity:0,transform:"scale(0.5)"})),x("*",c({opacity:1,transform:"scale(1)"})),p("void => false",[]),p("void => *",S("{{timings}}"),{params:{timings:`${E.entering} ${C.deceleration}`}})]),xt=b("zoomOut",[x("*",c({opacity:1,transform:"scale(1)"})),x("void",c({opacity:0,transform:"scale(0.5)"})),p("false => void",[]),p("* => void",S("{{timings}}"),{params:{timings:`${E.exiting} ${C.acceleration}`}})]);var _t=[K,Y,q,J,N,Q,W,X,tt,et,it,nt,at,ot,lt,mt,dt,st,rt,ct,pt,xt];function gt(n,m){if(n&1&&(e(0,"div",23)(1,"div",24),t(2,"Animated box"),i()()),n&2){let a=d(2);l("@expandCollapse",a.animationStates.expandCollapse)}}function ft(n,m){if(n&1&&s(0,gt,3,1,"div",23),n&2){let a=d();u(a.visibilityStates.expandCollapse?0:-1)}}function vt(n,m){n&1&&(e(0,"textarea",25),t(1,`              <!-- Using state -->
              <div class="animated-box" [@expandCollapse]="state">
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>

              <!-- Using *ngIf -->
              @if (visible) {
              <div class="animated-box" @expandCollapse>
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>
              }
            `),i()),n&2&&l("lang","html")}function ut(n,m){if(n&1&&(e(0,"div",23)(1,"div",24),t(2,"Animated box"),i()()),n&2){let a=d(2);l("@shake",a.animationStates.shake.shake)}}function bt(n,m){if(n&1&&s(0,ut,3,1,"div",23),n&2){let a=d();u(a.visibilityStates.shake.shake?0:-1)}}function St(n,m){n&1&&(e(0,"textarea",25),t(1,`              <!-- Using state -->
              <div class="animated-box" [@shake]="state">
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>

              <!-- Using *ngIf -->
              @if (visible) {
              <div class="animated-box" @shake>
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>
              }
            `),i()),n&2&&l("lang","html")}function Ct(n,m){if(n&1&&(e(0,"div",23)(1,"div",24),t(2,"Animated box"),i()()),n&2){let a=d(3);l("@fadeIn",a.animationStates.fadeIn.in)}}function Et(n,m){if(n&1&&s(0,Ct,3,1,"div",23),n&2){let a=d(2);u(a.visibilityStates.fadeIn.in?0:-1)}}function kt(n,m){n&1&&(e(0,"textarea",25),t(1,`              <!-- Using state -->
              <div class="animated-box" [@fadeIn]="state">
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>

              <!-- Using *ngIf -->
              @if (visible) {
              <div class="animated-box" @fadeIn>
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>
              }
            `),i()),n&2&&l("lang","html")}function At(n,m){if(n&1){let a=k();e(0,"div",10)(1,"div",11)(2,"div",12),t(3,"Fade In"),i(),e(4,"div",13)(5,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleAnimationState("fadeIn.in","void","*"))}),t(6,"Toggle state"),i(),e(7,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleVisibilityState("fadeIn.in"))}),t(8,"Toggle *ngIf"),i()()(),e(9,"mat-tab-group",15)(10,"mat-tab",16),s(11,Et,1,1,"ng-template",17),i(),e(12,"mat-tab",18),s(13,kt,2,1,"ng-template",17),i()()()}n&2&&(r(9),l("animationDuration","0ms"))}function ht(n,m){if(n&1&&(e(0,"div",23)(1,"div",24),t(2,"Animated box"),i()()),n&2){let a=d(3);l("@fadeInTop",a.animationStates.fadeIn.top)}}function Tt(n,m){if(n&1&&s(0,ht,3,1,"div",23),n&2){let a=d(2);u(a.visibilityStates.fadeIn.top?0:-1)}}function yt(n,m){n&1&&(e(0,"textarea",25),t(1,`              <!-- Using state -->
              <div class="animated-box" [@fadeInTop]="state">
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>

              <!-- Using *ngIf -->
              @if (visible) {
              <div class="animated-box" @fadeInTop>
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>
              }
            `),i()),n&2&&l("lang","html")}function It(n,m){if(n&1){let a=k();e(0,"div",10)(1,"div",11)(2,"div",12),t(3,"Fade In Top"),i(),e(4,"div",13)(5,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleAnimationState("fadeIn.top","void","*"))}),t(6,"Toggle state"),i(),e(7,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleVisibilityState("fadeIn.top"))}),t(8,"Toggle *ngIf"),i()()(),e(9,"mat-tab-group",15)(10,"mat-tab",16),s(11,Tt,1,1,"ng-template",17),i(),e(12,"mat-tab",18),s(13,yt,2,1,"ng-template",17),i()()()}n&2&&(r(9),l("animationDuration","0ms"))}function Dt(n,m){if(n&1&&(e(0,"div",23)(1,"div",24),t(2,"Animated box"),i()()),n&2){let a=d(3);l("@fadeInBottom",a.animationStates.fadeIn.bottom)}}function Mt(n,m){if(n&1&&s(0,Dt,3,1,"div",23),n&2){let a=d(2);u(a.visibilityStates.fadeIn.bottom?0:-1)}}function wt(n,m){n&1&&(e(0,"textarea",25),t(1,`              <!-- Using state -->
              <div class="animated-box" [@fadeInBottom]="state">
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>

              <!-- Using *ngIf -->
              @if (visible) {
              <div class="animated-box" @fadeInBottom>
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>
              }
            `),i()),n&2&&l("lang","html")}function Ot(n,m){if(n&1){let a=k();e(0,"div",10)(1,"div",11)(2,"div",12),t(3,"Fade In Bottom"),i(),e(4,"div",13)(5,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleAnimationState("fadeIn.bottom","void","*"))}),t(6,"Toggle state"),i(),e(7,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleVisibilityState("fadeIn.bottom"))}),t(8,"Toggle *ngIf"),i()()(),e(9,"mat-tab-group",15)(10,"mat-tab",16),s(11,Mt,1,1,"ng-template",17),i(),e(12,"mat-tab",18),s(13,wt,2,1,"ng-template",17),i()()()}n&2&&(r(9),l("animationDuration","0ms"))}function Vt(n,m){if(n&1&&(e(0,"div",23)(1,"div",24),t(2,"Animated box"),i()()),n&2){let a=d(3);l("@fadeInLeft",a.animationStates.fadeIn.left)}}function Ut(n,m){if(n&1&&s(0,Vt,3,1,"div",23),n&2){let a=d(2);u(a.visibilityStates.fadeIn.left?0:-1)}}function $t(n,m){n&1&&(e(0,"textarea",25),t(1,`              <!-- Using state -->
              <div class="animated-box" [@fadeInLeft]="state">
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>

              <!-- Using *ngIf -->
              @if (visible) {
              <div class="animated-box" @fadeInLeft>
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>
              }
            `),i()),n&2&&l("lang","html")}function zt(n,m){if(n&1){let a=k();e(0,"div",10)(1,"div",11)(2,"div",12),t(3,"Fade In Left"),i(),e(4,"div",13)(5,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleAnimationState("fadeIn.left","void","*"))}),t(6,"Toggle state"),i(),e(7,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleVisibilityState("fadeIn.left"))}),t(8,"Toggle *ngIf"),i()()(),e(9,"mat-tab-group",15)(10,"mat-tab",16),s(11,Ut,1,1,"ng-template",17),i(),e(12,"mat-tab",18),s(13,$t,2,1,"ng-template",17),i()()()}n&2&&(r(9),l("animationDuration","0ms"))}function Bt(n,m){if(n&1&&(e(0,"div",23)(1,"div",24),t(2,"Animated box"),i()()),n&2){let a=d(3);l("@fadeInRight",a.animationStates.fadeIn.right)}}function Lt(n,m){if(n&1&&s(0,Bt,3,1,"div",23),n&2){let a=d(2);u(a.visibilityStates.fadeIn.right?0:-1)}}function Rt(n,m){n&1&&(e(0,"textarea",25),t(1,`              <!-- Using state -->
              <div class="animated-box" [@fadeInRight]="state">
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>

              <!-- Using *ngIf -->
              @if (visible) {
              <div class="animated-box" @fadeInRight>
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>
              }
            `),i()),n&2&&l("lang","html")}function Ft(n,m){if(n&1){let a=k();e(0,"div",10)(1,"div",11)(2,"div",12),t(3,"Fade In Right"),i(),e(4,"div",13)(5,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleAnimationState("fadeIn.right","void","*"))}),t(6,"Toggle state"),i(),e(7,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleVisibilityState("fadeIn.right"))}),t(8,"Toggle *ngIf"),i()()(),e(9,"mat-tab-group",15)(10,"mat-tab",16),s(11,Lt,1,1,"ng-template",17),i(),e(12,"mat-tab",18),s(13,Rt,2,1,"ng-template",17),i()()()}n&2&&(r(9),l("animationDuration","0ms"))}function Zt(n,m){if(n&1&&(e(0,"div",23)(1,"div",24),t(2,"Animated box"),i()()),n&2){let a=d(3);l("@fadeOut",a.animationStates.fadeOut.out)}}function Pt(n,m){if(n&1&&s(0,Zt,3,1,"div",23),n&2){let a=d(2);u(a.visibilityStates.fadeOut.out?0:-1)}}function jt(n,m){n&1&&(e(0,"textarea",25),t(1,`              <!-- Using state -->
              <div class="animated-box" [@fadeOut]="state">
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>

              <!-- Using *ngIf -->
              @if (visible) {
              <div class="animated-box" @fadeOut>
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>
              }
            `),i()),n&2&&l("lang","html")}function Ht(n,m){if(n&1){let a=k();e(0,"div",10)(1,"div",11)(2,"div",12),t(3,"Fade Out"),i(),e(4,"div",13)(5,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleAnimationState("fadeOut.out","void","*"))}),t(6,"Toggle state"),i(),e(7,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleVisibilityState("fadeOut.out"))}),t(8,"Toggle *ngIf"),i()()(),e(9,"mat-tab-group",15)(10,"mat-tab",16),s(11,Pt,1,1,"ng-template",17),i(),e(12,"mat-tab",18),s(13,jt,2,1,"ng-template",17),i()()()}n&2&&(r(9),l("animationDuration","0ms"))}function Gt(n,m){if(n&1&&(e(0,"div",23)(1,"div",24),t(2,"Animated box"),i()()),n&2){let a=d(3);l("@fadeOutTop",a.animationStates.fadeOut.top)}}function Kt(n,m){if(n&1&&s(0,Gt,3,1,"div",23),n&2){let a=d(2);u(a.visibilityStates.fadeOut.top?0:-1)}}function Yt(n,m){n&1&&(e(0,"textarea",25),t(1,`              <!-- Using state -->
              <div class="animated-box" [@fadeOutTop]="state">
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>

              <!-- Using *ngIf -->
              @if (visible) {
              <div class="animated-box" @fadeOutTop>
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>
              }
            `),i()),n&2&&l("lang","html")}function qt(n,m){if(n&1){let a=k();e(0,"div",10)(1,"div",11)(2,"div",12),t(3,"Fade In Top"),i(),e(4,"div",13)(5,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleAnimationState("fadeOut.top","void","*"))}),t(6,"Toggle state"),i(),e(7,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleVisibilityState("fadeOut.top"))}),t(8,"Toggle *ngIf"),i()()(),e(9,"mat-tab-group",15)(10,"mat-tab",16),s(11,Kt,1,1,"ng-template",17),i(),e(12,"mat-tab",18),s(13,Yt,2,1,"ng-template",17),i()()()}n&2&&(r(9),l("animationDuration","0ms"))}function Jt(n,m){if(n&1&&(e(0,"div",23)(1,"div",24),t(2,"Animated box"),i()()),n&2){let a=d(3);l("@fadeOutBottom",a.animationStates.fadeOut.bottom)}}function Nt(n,m){if(n&1&&s(0,Jt,3,1,"div",23),n&2){let a=d(2);u(a.visibilityStates.fadeOut.bottom?0:-1)}}function Qt(n,m){n&1&&(e(0,"textarea",25),t(1,`              <!-- Using state -->
              <div class="animated-box" [@fadeOutBottom]="state">
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>

              <!-- Using *ngIf -->
              @if (visible) {
              <div class="animated-box" @fadeOutBottom>
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>
              }
            `),i()),n&2&&l("lang","html")}function Wt(n,m){if(n&1){let a=k();e(0,"div",10)(1,"div",11)(2,"div",12),t(3,"Fade In Bottom"),i(),e(4,"div",13)(5,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleAnimationState("fadeOut.bottom","void","*"))}),t(6,"Toggle state"),i(),e(7,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleVisibilityState("fadeOut.bottom"))}),t(8,"Toggle *ngIf"),i()()(),e(9,"mat-tab-group",15)(10,"mat-tab",16),s(11,Nt,1,1,"ng-template",17),i(),e(12,"mat-tab",18),s(13,Qt,2,1,"ng-template",17),i()()()}n&2&&(r(9),l("animationDuration","0ms"))}function Xt(n,m){if(n&1&&(e(0,"div",23)(1,"div",24),t(2,"Animated box"),i()()),n&2){let a=d(3);l("@fadeOutLeft",a.animationStates.fadeOut.left)}}function te(n,m){if(n&1&&s(0,Xt,3,1,"div",23),n&2){let a=d(2);u(a.visibilityStates.fadeOut.left?0:-1)}}function ee(n,m){n&1&&(e(0,"textarea",25),t(1,`              <!-- Using state -->
              <div class="animated-box" [@fadeOutLeft]="state">
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>

              <!-- Using *ngIf -->
              @if (visible) {
              <div class="animated-box" @fadeOutLeft>
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>
              }
            `),i()),n&2&&l("lang","html")}function ie(n,m){if(n&1){let a=k();e(0,"div",10)(1,"div",11)(2,"div",12),t(3,"Fade In Left"),i(),e(4,"div",13)(5,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleAnimationState("fadeOut.left","void","*"))}),t(6,"Toggle state"),i(),e(7,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleVisibilityState("fadeOut.left"))}),t(8,"Toggle *ngIf"),i()()(),e(9,"mat-tab-group",15)(10,"mat-tab",16),s(11,te,1,1,"ng-template",17),i(),e(12,"mat-tab",18),s(13,ee,2,1,"ng-template",17),i()()()}n&2&&(r(9),l("animationDuration","0ms"))}function ne(n,m){if(n&1&&(e(0,"div",23)(1,"div",24),t(2,"Animated box"),i()()),n&2){let a=d(3);l("@fadeOutRight",a.animationStates.fadeOut.right)}}function ae(n,m){if(n&1&&s(0,ne,3,1,"div",23),n&2){let a=d(2);u(a.visibilityStates.fadeOut.right?0:-1)}}function oe(n,m){n&1&&(e(0,"textarea",25),t(1,`              <!-- Using state -->
              <div class="animated-box" [@fadeOutRight]="state">
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>

              <!-- Using *ngIf -->
              @if (visible) {
              <div class="animated-box" @fadeOutRight>
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>
              }
            `),i()),n&2&&l("lang","html")}function le(n,m){if(n&1){let a=k();e(0,"div",10)(1,"div",11)(2,"div",12),t(3,"Fade In Right"),i(),e(4,"div",13)(5,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleAnimationState("fadeOut.right","void","*"))}),t(6,"Toggle state"),i(),e(7,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleVisibilityState("fadeOut.right"))}),t(8,"Toggle *ngIf"),i()()(),e(9,"mat-tab-group",15)(10,"mat-tab",16),s(11,ae,1,1,"ng-template",17),i(),e(12,"mat-tab",18),s(13,oe,2,1,"ng-template",17),i()()()}n&2&&(r(9),l("animationDuration","0ms"))}function me(n,m){if(n&1&&(e(0,"div",23)(1,"div",24),t(2,"Animated box"),i()()),n&2){let a=d(3);l("@slideInTop",a.animationStates.slideIn.top)}}function de(n,m){if(n&1&&s(0,me,3,1,"div",23),n&2){let a=d(2);u(a.visibilityStates.slideIn.top?0:-1)}}function se(n,m){n&1&&(e(0,"textarea",25),t(1,`              <!-- Using state -->
              <div class="animated-box" [@slideInTop]="state">
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>

              <!-- Using *ngIf -->
              @if (visible) {
              <div class="animated-box" @slideInTop>
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>
              }
            `),i()),n&2&&l("lang","html")}function re(n,m){if(n&1){let a=k();e(0,"div",10)(1,"div",11)(2,"div",12),t(3,"Slide In Top"),i(),e(4,"div",13)(5,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleAnimationState("slideIn.top","void","*"))}),t(6,"Toggle state"),i(),e(7,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleVisibilityState("slideIn.top"))}),t(8,"Toggle *ngIf"),i()()(),e(9,"mat-tab-group",15)(10,"mat-tab",16),s(11,de,1,1,"ng-template",17),i(),e(12,"mat-tab",18),s(13,se,2,1,"ng-template",17),i()()()}n&2&&(r(9),l("animationDuration","0ms"))}function ce(n,m){if(n&1&&(e(0,"div",23)(1,"div",24),t(2,"Animated box"),i()()),n&2){let a=d(3);l("@slideInBottom",a.animationStates.slideIn.bottom)}}function pe(n,m){if(n&1&&s(0,ce,3,1,"div",23),n&2){let a=d(2);u(a.visibilityStates.slideIn.bottom?0:-1)}}function xe(n,m){n&1&&(e(0,"textarea",25),t(1,`              <!-- Using state -->
              <div class="animated-box" [@slideInBottom]="state">
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>

              <!-- Using *ngIf -->
              @if (visible) {
              <div class="animated-box" @slideInBottom>
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>
              }
            `),i()),n&2&&l("lang","html")}function _e(n,m){if(n&1){let a=k();e(0,"div",10)(1,"div",11)(2,"div",12),t(3,"Slide In Bottom"),i(),e(4,"div",13)(5,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleAnimationState("slideIn.bottom","void","*"))}),t(6,"Toggle state"),i(),e(7,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleVisibilityState("slideIn.bottom"))}),t(8,"Toggle *ngIf"),i()()(),e(9,"mat-tab-group",15)(10,"mat-tab",16),s(11,pe,1,1,"ng-template",17),i(),e(12,"mat-tab",18),s(13,xe,2,1,"ng-template",17),i()()()}n&2&&(r(9),l("animationDuration","0ms"))}function ge(n,m){if(n&1&&(e(0,"div",23)(1,"div",24),t(2,"Animated box"),i()()),n&2){let a=d(3);l("@slideInLeft",a.animationStates.slideIn.left)}}function fe(n,m){if(n&1&&s(0,ge,3,1,"div",23),n&2){let a=d(2);u(a.visibilityStates.slideIn.left?0:-1)}}function ve(n,m){n&1&&(e(0,"textarea",25),t(1,`              <!-- Using state -->
              <div class="animated-box" [@slideInLeft]="state">
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>

              <!-- Using *ngIf -->
              @if (visible) {
              <div class="animated-box" @slideInLeft>
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>
              }
            `),i()),n&2&&l("lang","html")}function ue(n,m){if(n&1){let a=k();e(0,"div",10)(1,"div",11)(2,"div",12),t(3,"Slide In Left"),i(),e(4,"div",13)(5,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleAnimationState("slideIn.left","void","*"))}),t(6,"Toggle state"),i(),e(7,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleVisibilityState("slideIn.left"))}),t(8,"Toggle *ngIf"),i()()(),e(9,"mat-tab-group",15)(10,"mat-tab",16),s(11,fe,1,1,"ng-template",17),i(),e(12,"mat-tab",18),s(13,ve,2,1,"ng-template",17),i()()()}n&2&&(r(9),l("animationDuration","0ms"))}function be(n,m){if(n&1&&(e(0,"div",23)(1,"div",24),t(2,"Animated box"),i()()),n&2){let a=d(3);l("@slideInRight",a.animationStates.slideIn.right)}}function Se(n,m){if(n&1&&s(0,be,3,1,"div",23),n&2){let a=d(2);u(a.visibilityStates.slideIn.right?0:-1)}}function Ce(n,m){n&1&&(e(0,"textarea",25),t(1,`              <!-- Using state -->
              <div class="animated-box" [@slideInRight]="state">
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>

              <!-- Using *ngIf -->
              @if (visible) {
              <div class="animated-box" @slideInRight>
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>
              }
            `),i()),n&2&&l("lang","html")}function Ee(n,m){if(n&1){let a=k();e(0,"div",10)(1,"div",11)(2,"div",12),t(3,"Slide In Right"),i(),e(4,"div",13)(5,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleAnimationState("slideIn.right","void","*"))}),t(6,"Toggle state"),i(),e(7,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleVisibilityState("slideIn.right"))}),t(8,"Toggle *ngIf"),i()()(),e(9,"mat-tab-group",15)(10,"mat-tab",16),s(11,Se,1,1,"ng-template",17),i(),e(12,"mat-tab",18),s(13,Ce,2,1,"ng-template",17),i()()()}n&2&&(r(9),l("animationDuration","0ms"))}function ke(n,m){if(n&1&&(e(0,"div",23)(1,"div",24),t(2,"Animated box"),i()()),n&2){let a=d(3);l("@slideOutTop",a.animationStates.slideOut.top)}}function Ae(n,m){if(n&1&&s(0,ke,3,1,"div",23),n&2){let a=d(2);u(a.visibilityStates.slideOut.top?0:-1)}}function he(n,m){n&1&&(e(0,"textarea",25),t(1,`              <!-- Using state -->
              <div class="animated-box" [@slideOutTop]="state">
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>

              <!-- Using *ngIf -->
              @if (visible) {
              <div class="animated-box" @slideOutTop>
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>
              }
            `),i()),n&2&&l("lang","html")}function Te(n,m){if(n&1){let a=k();e(0,"div",10)(1,"div",11)(2,"div",12),t(3,"Slide Out Top"),i(),e(4,"div",13)(5,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleAnimationState("slideOut.top","void","*"))}),t(6,"Toggle state"),i(),e(7,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleVisibilityState("slideOut.top"))}),t(8,"Toggle *ngIf"),i()()(),e(9,"mat-tab-group",15)(10,"mat-tab",16),s(11,Ae,1,1,"ng-template",17),i(),e(12,"mat-tab",18),s(13,he,2,1,"ng-template",17),i()()()}n&2&&(r(9),l("animationDuration","0ms"))}function ye(n,m){if(n&1&&(e(0,"div",23)(1,"div",24),t(2,"Animated box"),i()()),n&2){let a=d(3);l("@slideOutBottom",a.animationStates.slideOut.bottom)}}function Ie(n,m){if(n&1&&s(0,ye,3,1,"div",23),n&2){let a=d(2);u(a.visibilityStates.slideOut.bottom?0:-1)}}function De(n,m){n&1&&(e(0,"textarea",25),t(1,`              <!-- Using state -->
              <div class="animated-box" [@slideOutBottom]="state">
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>

              <!-- Using *ngIf -->
              @if (visible) {
              <div class="animated-box" @slideOutBottom>
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>
              }
            `),i()),n&2&&l("lang","html")}function Me(n,m){if(n&1){let a=k();e(0,"div",10)(1,"div",11)(2,"div",12),t(3,"Slide Out Bottom"),i(),e(4,"div",13)(5,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleAnimationState("slideOut.bottom","void","*"))}),t(6,"Toggle state"),i(),e(7,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleVisibilityState("slideOut.bottom"))}),t(8,"Toggle *ngIf"),i()()(),e(9,"mat-tab-group",15)(10,"mat-tab",16),s(11,Ie,1,1,"ng-template",17),i(),e(12,"mat-tab",18),s(13,De,2,1,"ng-template",17),i()()()}n&2&&(r(9),l("animationDuration","0ms"))}function we(n,m){if(n&1&&(e(0,"div",23)(1,"div",24),t(2,"Animated box"),i()()),n&2){let a=d(3);l("@slideOutLeft",a.animationStates.slideOut.left)}}function Oe(n,m){if(n&1&&s(0,we,3,1,"div",23),n&2){let a=d(2);u(a.visibilityStates.slideOut.left?0:-1)}}function Ve(n,m){n&1&&(e(0,"textarea",25),t(1,`              <!-- Using state -->
              <div class="animated-box" [@slideOutLeft]="state">
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>

              <!-- Using *ngIf -->
              @if (visible) {
              <div class="animated-box" @slideOutLeft>
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>
              }
            `),i()),n&2&&l("lang","html")}function Ue(n,m){if(n&1){let a=k();e(0,"div",10)(1,"div",11)(2,"div",12),t(3,"Slide Out Left"),i(),e(4,"div",13)(5,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleAnimationState("slideOut.left","void","*"))}),t(6,"Toggle state"),i(),e(7,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleVisibilityState("slideOut.left"))}),t(8,"Toggle *ngIf"),i()()(),e(9,"mat-tab-group",15)(10,"mat-tab",16),s(11,Oe,1,1,"ng-template",17),i(),e(12,"mat-tab",18),s(13,Ve,2,1,"ng-template",17),i()()()}n&2&&(r(9),l("animationDuration","0ms"))}function $e(n,m){if(n&1&&(e(0,"div",23)(1,"div",24),t(2,"Animated box"),i()()),n&2){let a=d(3);l("@slideOutRight",a.animationStates.slideOut.right)}}function ze(n,m){if(n&1&&s(0,$e,3,1,"div",23),n&2){let a=d(2);u(a.visibilityStates.slideOut.right?0:-1)}}function Be(n,m){n&1&&(e(0,"textarea",25),t(1,`              <!-- Using state -->
              <div class="animated-box" [@slideOutRight]="state">
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>

              <!-- Using *ngIf -->
              @if (visible) {
              <div class="animated-box" @slideOutRight>
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>
              }
            `),i()),n&2&&l("lang","html")}function Le(n,m){if(n&1){let a=k();e(0,"div",10)(1,"div",11)(2,"div",12),t(3,"Slide Out Right"),i(),e(4,"div",13)(5,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleAnimationState("slideOut.right","void","*"))}),t(6,"Toggle state"),i(),e(7,"button",14),f("click",function(){_(a);let o=d();return g(o.toggleVisibilityState("slideOut.right"))}),t(8,"Toggle *ngIf"),i()()(),e(9,"mat-tab-group",15)(10,"mat-tab",16),s(11,ze,1,1,"ng-template",17),i(),e(12,"mat-tab",18),s(13,Be,2,1,"ng-template",17),i()()()}n&2&&(r(9),l("animationDuration","0ms"))}function Re(n,m){if(n&1&&(e(0,"div",23)(1,"div",24),t(2,"Animated box"),i()()),n&2){let a=d(2);l("@zoomIn",a.animationStates.zoomIn.in)}}function Fe(n,m){if(n&1&&s(0,Re,3,1,"div",23),n&2){let a=d();u(a.visibilityStates.zoomIn.in?0:-1)}}function Ze(n,m){n&1&&(e(0,"textarea",25),t(1,`              <!-- Using state -->
              <div class="animated-box" [@zoomIn]="state">
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>

              <!-- Using *ngIf -->
              @if (visible) {
              <div class="animated-box" @zoomIn>
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>
              }
            `),i()),n&2&&l("lang","html")}function Pe(n,m){if(n&1&&(e(0,"div",23)(1,"div",24),t(2,"Animated box"),i()()),n&2){let a=d(2);l("@zoomOut",a.animationStates.zoomOut.out)}}function je(n,m){if(n&1&&s(0,Pe,3,1,"div",23),n&2){let a=d();u(a.visibilityStates.zoomOut.out?0:-1)}}function He(n,m){n&1&&(e(0,"textarea",25),t(1,`              <!-- Using state -->
              <div class="animated-box" [@zoomOut]="state">
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>

              <!-- Using *ngIf -->
              @if (visible) {
              <div class="animated-box" @zoomOut>
                <div class="animated-box-content">
                  Animated box
                </div>
              </div>
              }
            `),i()),n&2&&l("lang","html")}var hi=(()=>{class n{ngOnInit(){this.animationStates={expandCollapse:"expanded",fadeIn:{direction:"in",in:"*",top:"*",bottom:"*",left:"*",right:"*"},fadeOut:{direction:"out",out:"*",top:"*",bottom:"*",left:"*",right:"*"},shake:{shake:!0},slideIn:{direction:"top",top:"*",bottom:"*",left:"*",right:"*"},slideOut:{direction:"top",top:"*",bottom:"*",left:"*",right:"*"},zoomIn:{in:"*"},zoomOut:{out:"*"}},this.visibilityStates={expandCollapse:!0,fadeIn:{in:!0,top:!0,bottom:!0,left:!0,right:!0},fadeOut:{out:!0,top:!0,bottom:!0,left:!0,right:!0},shake:{shake:!0},slideIn:{top:!0,bottom:!0,left:!0,right:!0},slideOut:{top:!0,bottom:!0,left:!0,right:!0},zoomIn:{in:!0},zoomOut:{out:!0}}}toggleAnimationState(a,v,o,h=500){let A=a.split(".");this.animationStates[A[0]][A[1]]=v,setTimeout(()=>{this.animationStates[A[0]][A[1]]=o},h)}toggleVisibilityState(a,v=500){let o=a.split(".");this.visibilityStates[o[0]][o[1]]=!1,this.animationStates[o[0]][o[1]]="void",setTimeout(()=>{this.visibilityStates[o[0]][o[1]]=!0,this.animationStates[o[0]][o[1]]="*"},v)}static{this.\u0275fac=function(v){return new(v||n)}}static{this.\u0275cmp=D({type:n,selectors:[["msk-docs-animation"]],decls:438,vars:44,consts:[["fadeInSelect",""],["fadeOutSelect",""],["slideInSelect",""],["slideOutSelect",""],["dir","ltr",1,"page-layout","content-scroll","md:py-4"],[1,"content","prose","max-w-full"],[1,"sticky-header","mt-4","md:mt-0"],["msk-highlight","","lang","typescript"],[1,"sticky-header"],[1,"mt-4"],[1,"example-viewer"],[1,"header"],[1,"title"],[1,"action"],["mat-button","",3,"click"],["mat-stretch-tabs","false",3,"animationDuration"],["label","Preview"],["matTabContent",""],["label","HTML"],[1,"mt-16"],[1,"w-full"],[3,"value"],[1,"mb-6"],[1,"animated-box"],[1,"animated-box-content"],["msk-highlight","",3,"lang"]],template:function(v,o){if(v&1){let h=k();e(0,"div",4)(1,"div",5)(2,"h3",6),t(3,"Module"),i(),e(4,"textarea",7),t(5,`      import { mskAnimations } from '@msk/shared/animations';
    `),i(),e(6,"h3",8),t(7,"Usage"),i(),e(8,"p"),t(9," MSK provides set of ready-to-use animations for convenience. You can access them by importing the "),e(10,"code"),t(11,"mskAnimations"),i(),t(12," and set it as the "),e(13,"em"),t(14,"animations"),i(),t(15," property of the "),e(16,"em"),t(17,"@Component"),i(),t(18," metadata. "),i(),e(19,"textarea",7),t(20,`      @Component({
        selector   : 'my-component',
        templateUrl: './my-component.component.html',
        styleUrls  : ['./my-component.component.scss'],
        animations : mskAnimations
      })
      export class MyComponent { }
    `),i(),e(21,"h3",8),t(22,"Animations"),i(),e(23,"h4",9),t(24,"Expand / Collapse"),i(),e(25,"p"),t(26,"This animation can be triggered in two ways;"),i(),e(27,"ol")(28,"li"),t(29," Adding "),e(30,"code"),t(31,'[@expandCollapse]="state"'),i(),t(32," to the element and toggling the "),e(33,"code"),t(34,"state"),i(),t(35," between the "),e(36,"code"),t(37,"'collapsed'"),i(),t(38," and "),e(39,"code"),t(40,"'expanded'"),i(),t(41," strings manually. "),i(),e(42,"li"),t(43," Adding "),e(44,"code"),t(45,"@expandCollapse"),i(),t(46," to the element and using "),e(47,"code"),t(48,"*ngIf"),i(),t(49," to toggle the element. "),i()(),e(50,"p"),t(51," The animation can be disabled by setting the state to "),e(52,"b"),t(53,"false"),i(),t(54,"; "),e(55,"code"),t(56,'[@expandCollapse]="false"'),i()(),e(57,"div",10)(58,"div",11)(59,"div",12),t(60,"Expand / Collapse"),i(),e(61,"div",13)(62,"button",14),f("click",function(){return _(h),g(o.animationStates.expandCollapse==="expanded"?o.animationStates.expandCollapse="collapsed":o.animationStates.expandCollapse="expanded")}),t(63," Toggle state "),i(),e(64,"button",14),f("click",function(){return _(h),o.visibilityStates.expandCollapse=!o.visibilityStates.expandCollapse,g(o.animationStates.expandCollapse==="expanded"?o.animationStates.expandCollapse="collapsed":o.animationStates.expandCollapse="expanded")}),t(65," Toggle *ngIf "),i()()(),e(66,"mat-tab-group",15)(67,"mat-tab",16),s(68,ft,1,1,"ng-template",17),i(),e(69,"mat-tab",18),s(70,vt,2,1,"ng-template",17),i()()(),e(71,"h4",19),t(72,"Shake"),i(),e(73,"p"),t(74,"This animation can be triggered in two ways;"),i(),e(75,"ol")(76,"li"),t(77," Adding "),e(78,"code"),t(79,'[@shake]="state"'),i(),t(80," to the element and toggling the "),e(81,"code"),t(82,"state"),i(),t(83," between the "),e(84,"code"),t(85,"false"),i(),t(86," and "),e(87,"code"),t(88,"true"),i(),t(89," manually. "),i(),e(90,"li"),t(91,"Adding "),e(92,"code"),t(93,"@shake"),i(),t(94," to the element and using "),e(95,"code"),t(96,"*ngIf"),i(),t(97," to toggle the element."),i()(),e(98,"p"),t(99," The animation can be disabled by setting the state to "),e(100,"b"),t(101,"false"),i(),t(102,"; "),e(103,"code"),t(104,'[@shake]="false"'),i()(),e(105,"div",10)(106,"div",11)(107,"div",12),t(108,"Shake"),i(),e(109,"div",13)(110,"button",14),f("click",function(){return _(h),g(o.toggleAnimationState("shake.shake",!1,!0,150))}),t(111,"Toggle state"),i(),e(112,"button",14),f("click",function(){return _(h),g(o.toggleVisibilityState("shake.shake"))}),t(113,"Toggle *ngIf"),i()()(),e(114,"mat-tab-group",15)(115,"mat-tab",16),s(116,bt,1,1,"ng-template",17),i(),e(117,"mat-tab",18),s(118,St,2,1,"ng-template",17),i()()(),e(119,"h4",19),t(120,"Fade In"),i(),e(121,"p")(122,"b"),t(123,"Fade In"),i(),t(124," animation can be triggered in two ways;"),i(),e(125,"ol")(126,"li"),t(127," Adding "),e(128,"code"),t(129,'[@fadeIn]="state"'),i(),t(130," to the element and toggling the "),e(131,"code"),t(132,"state"),i(),t(133," between the "),e(134,"code"),t(135,"'void'"),i(),t(136," and "),e(137,"code"),t(138,"'*'"),i(),t(139," strings manually. "),i(),e(140,"li"),t(141,"Adding "),e(142,"code"),t(143,"@fadeIn"),i(),t(144," to the element and using "),e(145,"code"),t(146,"*ngIf"),i(),t(147," to toggle the element."),i()(),e(148,"p"),t(149," The animation can be disabled by setting the state to "),e(150,"b"),t(151,"false"),i(),t(152,"; "),e(153,"code"),t(154,'[@fadeIn]="false"'),i()(),e(155,"mat-form-field",20)(156,"mat-label"),t(157,"Direction"),i(),e(158,"mat-select",21,0)(160,"mat-option",21),t(161,"In"),i(),e(162,"mat-option",21),t(163,"Top"),i(),e(164,"mat-option",21),t(165,"Bottom"),i(),e(166,"mat-option",21),t(167,"Left"),i(),e(168,"mat-option",21),t(169,"Right"),i()()(),s(170,At,14,1,"div",10)(171,It,14,1,"div",10)(172,Ot,14,1,"div",10)(173,zt,14,1,"div",10)(174,Ft,14,1,"div",10),e(175,"h4",19),t(176,"Fade Out"),i(),e(177,"p")(178,"b"),t(179,"Fade Out"),i(),t(180," animation can be triggered in two ways;"),i(),e(181,"ol")(182,"li"),t(183," Adding "),e(184,"code"),t(185,'[@fadeOut]="state"'),i(),t(186," to the element and toggling the "),e(187,"code"),t(188,"state"),i(),t(189," between the "),e(190,"code"),t(191,"'void'"),i(),t(192," and "),e(193,"code"),t(194,"'*'"),i(),t(195," strings manually. "),i(),e(196,"li"),t(197,"Adding "),e(198,"code"),t(199,"@fadeOut"),i(),t(200," to the element and using "),e(201,"code"),t(202,"*ngIf"),i(),t(203," to toggle the element."),i()(),e(204,"p"),t(205," The animation can be disabled by setting the state to "),e(206,"b"),t(207,"false"),i(),t(208,"; "),e(209,"code"),t(210,'[@fadeOut]="false"'),i()(),e(211,"mat-form-field",20)(212,"mat-label"),t(213,"Direction"),i(),e(214,"mat-select",21,1)(216,"mat-option",21),t(217,"Out"),i(),e(218,"mat-option",21),t(219,"Top"),i(),e(220,"mat-option",21),t(221,"Bottom"),i(),e(222,"mat-option",21),t(223,"Left"),i(),e(224,"mat-option",21),t(225,"Right"),i()()(),s(226,Ht,14,1,"div",10)(227,qt,14,1,"div",10)(228,Wt,14,1,"div",10)(229,ie,14,1,"div",10)(230,le,14,1,"div",10),e(231,"h4",19),t(232,"Slide In"),i(),e(233,"p")(234,"b"),t(235,"Slide In"),i(),t(236," animation can be triggered in two ways;"),i(),e(237,"ol")(238,"li"),t(239," Adding "),e(240,"code"),t(241,'[@slideIn]="state"'),i(),t(242," to the element and toggling the "),e(243,"code"),t(244,"state"),i(),t(245," between the "),e(246,"code"),t(247,"'void'"),i(),t(248," and "),e(249,"code"),t(250,"'*'"),i(),t(251," strings manually. "),i(),e(252,"li"),t(253,"Adding "),e(254,"code"),t(255,"@slideIn"),i(),t(256," to the element and using "),e(257,"code"),t(258,"*ngIf"),i(),t(259," to toggle the element."),i()(),e(260,"p"),t(261," The animation can be disabled by setting the state to "),e(262,"b"),t(263,"false"),i(),t(264,"; "),e(265,"code"),t(266,'[@slideIn]="false"'),i()(),e(267,"mat-form-field",20)(268,"mat-label"),t(269,"Direction"),i(),e(270,"mat-select",21,2)(272,"mat-option",21),t(273,"Top"),i(),e(274,"mat-option",21),t(275,"Bottom"),i(),e(276,"mat-option",21),t(277,"Left"),i(),e(278,"mat-option",21),t(279,"Right"),i()()(),s(280,re,14,1,"div",10)(281,_e,14,1,"div",10)(282,ue,14,1,"div",10)(283,Ee,14,1,"div",10),e(284,"h4",19),t(285,"Slide Out"),i(),e(286,"p")(287,"b"),t(288,"Slide Out"),i(),t(289," animation can be triggered in two ways;"),i(),e(290,"ol")(291,"li"),t(292," Adding "),e(293,"code"),t(294,'[@slideOut]="state"'),i(),t(295," to the element and toggling the "),e(296,"code"),t(297,"state"),i(),t(298," between the "),e(299,"code"),t(300,"'void'"),i(),t(301," and "),e(302,"code"),t(303,"'*'"),i(),t(304," strings manually. "),i(),e(305,"li"),t(306,"Adding "),e(307,"code"),t(308,"@slideOut"),i(),t(309," to the element and using "),e(310,"code"),t(311,"*ngIf"),i(),t(312," to toggle the element."),i()(),e(313,"p"),t(314," The animation can be disabled by setting the state to "),e(315,"b"),t(316,"false"),i(),t(317,"; "),e(318,"code"),t(319,'[@slideOut]="false"'),i()(),e(320,"mat-form-field",20)(321,"mat-label"),t(322,"Direction"),i(),e(323,"mat-select",21,3)(325,"mat-option",21),t(326,"Top"),i(),e(327,"mat-option",21),t(328,"Bottom"),i(),e(329,"mat-option",21),t(330,"Left"),i(),e(331,"mat-option",21),t(332,"Right"),i()()(),s(333,Te,14,1,"div",10)(334,Me,14,1,"div",10)(335,Ue,14,1,"div",10)(336,Le,14,1,"div",10),e(337,"h4",19),t(338,"Zoom In"),i(),e(339,"p")(340,"b"),t(341,"Zoom In"),i(),t(342," animation can be triggered in two ways;"),i(),e(343,"ol")(344,"li"),t(345," Adding "),e(346,"code"),t(347,'[@zoomIn]="state"'),i(),t(348," to the element and toggling the "),e(349,"code"),t(350,"state"),i(),t(351," between the "),e(352,"code"),t(353,"'void'"),i(),t(354," and "),e(355,"code"),t(356,"'*'"),i(),t(357," strings manually. "),i(),e(358,"li"),t(359,"Adding "),e(360,"code"),t(361,"@zoomIn"),i(),t(362," to the element and using "),e(363,"code"),t(364,"*ngIf"),i(),t(365," to toggle the element."),i()(),e(366,"p"),t(367," The animation can be disabled by setting the state to "),e(368,"b"),t(369,"false"),i(),t(370,"; "),e(371,"code"),t(372,'[@zoomIn]="false"'),i()(),e(373,"div",10)(374,"div",11)(375,"div",12),t(376,"Zoom In"),i(),e(377,"div",13)(378,"button",14),f("click",function(){return _(h),g(o.toggleAnimationState("zoomIn.in","void","*"))}),t(379,"Toggle state"),i(),e(380,"button",14),f("click",function(){return _(h),g(o.toggleVisibilityState("zoomIn.in"))}),t(381,"Toggle *ngIf"),i()()(),e(382,"mat-tab-group",15)(383,"mat-tab",16),s(384,Fe,1,1,"ng-template",17),i(),e(385,"mat-tab",18),s(386,Ze,2,1,"ng-template",17),i()()(),e(387,"h4",19),t(388,"Zoom Out"),i(),e(389,"p")(390,"b"),t(391,"Zoom Out"),i(),t(392," animation can be triggered in two ways;"),i(),e(393,"ol")(394,"li"),t(395," Adding "),e(396,"code"),t(397,'[@zoomOut]="state"'),i(),t(398," to the element and toggling the "),e(399,"code"),t(400,"state"),i(),t(401," between the "),e(402,"code"),t(403,"'void'"),i(),t(404," and "),e(405,"code"),t(406,"'*'"),i(),t(407," strings manually. "),i(),e(408,"li"),t(409,"Adding "),e(410,"code"),t(411,"@zoomOut"),i(),t(412," to the element and using "),e(413,"code"),t(414,"*ngIf"),i(),t(415," to toggle the element."),i()(),e(416,"p"),t(417," The animation can be disabled by setting the state to "),e(418,"b"),t(419,"false"),i(),t(420,"; "),e(421,"code"),t(422,'[@zoomOut]="false"'),i()(),e(423,"div",10)(424,"div",11)(425,"div",12),t(426,"Zoom Out"),i(),e(427,"div",13)(428,"button",14),f("click",function(){return _(h),g(o.toggleAnimationState("zoomOut.out","void","*"))}),t(429,"Toggle state"),i(),e(430,"button",14),f("click",function(){return _(h),g(o.toggleVisibilityState("zoomOut.out"))}),t(431,"Toggle *ngIf"),i()()(),e(432,"mat-tab-group",15)(433,"mat-tab",16),s(434,je,1,1,"ng-template",17),i(),e(435,"mat-tab",18),s(436,He,2,1,"ng-template",17),i()()(),M(437,"div",22),i()()}if(v&2){let h=T(159),A=T(215),y=T(271),I=T(324);r(66),l("animationDuration","0ms"),r(48),l("animationDuration","0ms"),r(44),l("value","in"),r(2),l("value","in"),r(2),l("value","top"),r(2),l("value","bottom"),r(2),l("value","left"),r(2),l("value","right"),r(2),u(h.value==="in"?170:-1),r(),u(h.value==="top"?171:-1),r(),u(h.value==="bottom"?172:-1),r(),u(h.value==="left"?173:-1),r(),u(h.value==="right"?174:-1),r(40),l("value","out"),r(2),l("value","out"),r(2),l("value","top"),r(2),l("value","bottom"),r(2),l("value","left"),r(2),l("value","right"),r(2),u(A.value==="out"?226:-1),r(),u(A.value==="top"?227:-1),r(),u(A.value==="bottom"?228:-1),r(),u(A.value==="left"?229:-1),r(),u(A.value==="right"?230:-1),r(40),l("value","top"),r(2),l("value","top"),r(2),l("value","bottom"),r(2),l("value","left"),r(2),l("value","right"),r(2),u(y.value==="top"?280:-1),r(),u(y.value==="bottom"?281:-1),r(),u(y.value==="left"?282:-1),r(),u(y.value==="right"?283:-1),r(40),l("value","top"),r(2),l("value","top"),r(2),l("value","bottom"),r(2),l("value","left"),r(2),l("value","right"),r(2),u(I.value==="top"?333:-1),r(),u(I.value==="bottom"?334:-1),r(),u(I.value==="left"?335:-1),r(),u(I.value==="right"?336:-1),r(46),l("animationDuration","0ms"),r(50),l("animationDuration","0ms")}},dependencies:[F,B,O,U,$,z,R,L,G,P,Z,H,V,j],styles:[`msk-docs-animation .mat-mdc-tab-body-wrapper .mat-mdc-tab-body:first-child .mat-mdc-tab-body-content{display:flex;justify-content:center;min-height:152px}.animated-box{width:120px;height:120px;overflow:hidden;border-radius:4px;cursor:pointer;-webkit-user-select:none;user-select:none;--tw-shadow: var(--mat-sys-level2);--tw-shadow-colored: var(--mat-sys-level2);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow);background-color:var(--mat-sys-tertiary-container)}.animated-box .animated-box-content{display:flex;align-items:center;justify-content:center;flex:1 0 auto;height:100%;text-align:center;font-size:12px;font-weight:500;color:var(--mat-sys-on-tertiary-container)}
`],encapsulation:2,data:{animation:_t}})}}return n})();export{_t as a,hi as b};
