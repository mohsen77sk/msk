import{b as te,c as ie,d as ne,e as oe}from"./chunk-J2NR4CTG.js";import{b as K,c as Q,d as W,e as X,f as Z,g as $,h as ee}from"./chunk-IJJRE7HG.js";import{c as B}from"./chunk-I3ROGWBB.js";import{A as J,B as q,a as I,g as T,h as N,j as O,n as z,o as H,t as L,u as V,v as P,w as U,z as Y}from"./chunk-AVQDJSHG.js";import{e as j}from"./chunk-VOKD7PTO.js";import{ca as R,da as G,ea as x,ha as C,ja as A}from"./chunk-HKIA5WVT.js";import{d as w,n as y,r as F}from"./chunk-4RPD53QL.js";import{$b as E,Ab as g,Ac as D,Eb as c,Kb as d,Ob as i,Pb as e,Qb as m,ba as v,bb as M,bc as f,gb as r,ha as s,ma as p,mc as t,nc as b,oc as S,uc as h,wc as k,zc as _}from"./chunk-7YKTGSEM.js";var se=n=>({"text-center":n});function ce(n,u){if(n&1&&(i(0,"div",0)(1,"mat-icon"),t(2),e()()),n&2){let o=f();r(2),b(o.data.icon==null?null:o.data.icon.name)}}function de(n,u){if(n&1&&(i(0,"h2",1),t(1),e()),n&2){let o=f();c("ngClass",k(2,se,o.data.icon==null?null:o.data.icon.show)),r(),b(o.data.title)}}function fe(n,u){if(n&1&&(i(0,"button",3),t(1),e()),n&2){let o=f(2);r(),S(" ",o.data.actions==null||o.data.actions.cancel==null?null:o.data.actions.cancel.label," ")}}function ue(n,u){if(n&1&&(i(0,"button",4),t(1),e()),n&2){let o=f(2);r(),S(" ",o.data.actions==null||o.data.actions.confirm==null?null:o.data.actions.confirm.label," ")}}function pe(n,u){if(n&1&&(i(0,"mat-dialog-actions"),g(1,fe,2,1,"button",3)(2,ue,2,1,"button",4),e()),n&2){let o=f();r(),d(!(o.data.actions==null||o.data.actions.cancel==null)&&o.data.actions.cancel.show?1:-1),r(),d(!(o.data.actions==null||o.data.actions.confirm==null)&&o.data.actions.confirm.show?2:-1)}}var le=(()=>{class n{constructor(){this.data=s(K)}static{this.\u0275fac=function(a){return new(a||n)}}static{this.\u0275cmp=p({type:n,selectors:[["msk-confirmation-dialog"]],standalone:!0,features:[h],decls:5,vars:4,consts:[[1,"mat-mdc-dialog-icon"],["mat-dialog-title","",3,"ngClass"],[3,"innerHTML"],["mat-button","","matDialogClose","cancelled"],["mat-button","","matDialogClose","confirmed"]],template:function(a,l){a&1&&(g(0,ce,3,1,"div",0)(1,de,2,4,"h2",1),i(2,"mat-dialog-content"),m(3,"div",2),e(),g(4,pe,3,2,"mat-dialog-actions")),a&2&&(d(l.data.icon!=null&&l.data.icon.show?0:-1),r(),d(l.data.title?1:-1),r(2),c("innerHTML",l.data.message,M),r(),d(!(l.data.actions==null||l.data.actions.confirm==null)&&l.data.actions.confirm.show||!(l.data.actions==null||l.data.actions.cancel==null)&&l.data.actions.cancel.show?4:-1))},dependencies:[y,G,R,C,x,ee,W,X,$,Z],encapsulation:2})}}return n})();var re=(()=>{class n{constructor(){this._document=s(w),this._matDialog=s(Q),this._defaultConfig={title:"",message:"",actions:{confirm:{show:!0,label:"Confirm"},cancel:{show:!0,label:"Cancel"}},dismissible:!1}}open(o={}){let a=B({},this._defaultConfig,o);return this._matDialog.open(le,{autoFocus:!1,direction:this._document.body.getAttribute("dir"),disableClose:!a.dismissible,data:a,panelClass:"msk-confirmation-dialog-panel"})}static{this.\u0275fac=function(a){return new(a||n)}}static{this.\u0275prov=v({token:n,factory:n.\u0275fac,providedIn:"root"})}}return n})();var Qe=(()=>{class n{constructor(){this._formBuilder=s(Y),this._mskConfirmationService=s(re)}ngOnInit(){this.configForm=this._formBuilder.group({title:"Remove contact",message:'Are you sure you want to remove this contact permanently? <br> <span class="font-medium">This action cannot be undone!</span>',icon:this._formBuilder.group({show:!1,name:"delete"}),actions:this._formBuilder.group({confirm:this._formBuilder.group({show:!0,label:"Remove"}),cancel:this._formBuilder.group({show:!0,label:"Cancel"})}),dismissible:!0})}openConfirmationDialog(){this._mskConfirmationService.open(this.configForm.value).afterClosed().subscribe(a=>{console.log(a)})}static{this.\u0275fac=function(a){return new(a||n)}}static{this.\u0275cmp=p({type:n,selectors:[["msk-docs-confirmation"]],standalone:!0,features:[h],decls:128,vars:5,consts:[[1,"page-layout","content-scroll","md:py-4"],[1,"content","prose","max-w-full"],[1,"sticky-header","mt-4","md:mt-0"],["msk-highlight","","lang","typescript"],[1,"sticky-header"],[1,"msk-mat-card-filled","mt-4"],[1,"text-secondary","text-title-small","border-b","px-6","py-3"],[1,"p-6"],["href","https://material.angular.io/components/dialog/api#MatDialogRef","target","_blank","rel","noreferrer"],["msk-highlight","",3,"lang"],[1,"msk-mat-card-filled","flex-shrink-0","overflow-auto","p-4"],[1,"m-0"],[1,"text-md","text-secondary"],[1,"msk-mat-card-outlined","flex-shrink-0","overflow-auto","p-4"],[1,"text-title-medium","mb-6"],[1,"flex","flex-col","items-start",3,"formGroup"],["subscriptSizing","dynamic",1,"w-full"],["matInput","","formControlName","title"],["subscriptSizing","dynamic",1,"mt-4","w-full"],["matInput","","formControlName","message"],[1,"mb-4","mt-6","w-full","border-b"],["formGroupName","icon",1,"flex","w-full","flex-col"],["formControlName","show"],["matInput","","formControlName","name"],["formGroupName","actions",1,"grid","w-full","grid-cols-2","gap-4"],["formGroupName","confirm",1,"flex","w-full","flex-col"],["matInput","","formControlName","label"],["formGroupName","cancel",1,"flex","w-full","flex-col"],["formControlName","dismissible"],[1,"mt-12"],["mat-flat-button","",3,"click"],["msk-highlight","","lang","json",3,"code"],[1,"mb-6"]],template:function(a,l){a&1&&(i(0,"div",0)(1,"div",1)(2,"h3",2),t(3,"Service"),e(),i(4,"textarea",3),t(5,`      import { MskConfirmationService } from '@msk/shared/services/confirmation';
    `),e(),i(6,"p")(7,"strong"),t(8,"MskConfirmationService"),e(),t(9," is a singleton service for creating confirmation and information dialogs. Internally it uses MatDialog to create and show the dialog. "),e(),i(10,"h3",4),t(11,"Confirmation Config"),e(),i(12,"p"),t(13,"Here is the interface for the "),i(14,"em"),t(15,"Confirmation configuration"),e(),t(16,":"),e(),i(17,"textarea",3),t(18,`      export interface MskConfirmationConfig
      {
        title?: string;
        message?: string;
        icon?: {
          show?: boolean;
          name?: string;
        };
        actions?: {
          confirm?: {
            show?: boolean;
            label?: string;
          };
          cancel?: {
            show?: boolean;
            label?: string;
          };
        };
        dismissible?: boolean;
      }
    `),e(),i(19,"h3",4),t(20,"Methods"),e(),i(21,"div",5)(22,"div",6),t(23," open(config: MskConfirmationConfig): MatDialogRef<MskConfirmationDialogComponent> "),e(),i(24,"div",7),t(25,"Opens the confirmation dialog with the given configuration"),e()(),i(26,"h3",4),t(27,"MatDialogRef"),e(),i(28,"p"),t(29," Since "),i(30,"code"),t(31,"MskConfirmationService"),e(),t(32," uses "),i(33,"em"),t(34,"MatDialog"),e(),t(35," behind the scenes, it returns a reference to the created dialog. You can use all available methods from that reference such as "),i(36,"code"),t(37,"updateSize"),e(),t(38," and "),i(39,"code"),t(40,"updatePosition"),e(),t(41," to further customize the dialog. "),e(),i(42,"p"),t(43," See "),i(44,"a",8),t(45," https://material.angular.io/components/dialog/api#MatDialogRef "),e(),t(46," for the complete list of available methods. "),e(),i(47,"p"),t(48,"Using the reference, you can also access to the user input:"),e(),i(49,"textarea",9),t(50,`      // Open the confirmation and save the reference
      const dialogRef = this._mskConfirmationService.open({...});

      // Subscribe to afterClosed from the dialog reference
      dialogRef.afterClosed().subscribe((result) => {
        console.log(result);
      });
    `),e(),i(51,"div",10)(52,"table",11)(53,"thead")(54,"tr")(55,"th"),t(56,"Result"),e(),i(57,"th"),t(58,"Description"),e()()(),i(59,"tbody")(60,"tr")(61,"td",12)(62,"code"),t(63,"'confirmed'"),e()(),i(64,"td"),t(65,"This is the result if the user pressed the Confirm button."),e()(),i(66,"tr")(67,"td",12)(68,"code"),t(69,"'cancelled'"),e()(),i(70,"td"),t(71,"This is the result if the user pressed the Cancel button."),e()(),i(72,"tr")(73,"td",12)(74,"code"),t(75,"undefined"),e()(),i(76,"td"),t(77," This is the result if the confirmation dismissed either using the close button, clicking on the backdrop or pressing the Escape key. "),e()()()()(),i(78,"h3",4),t(79,"Demo"),e(),i(80,"p"),t(81," Below you can configure and preview the confirmation dialog. You can use the generated configuration object within your code to have the exact same dialog. "),e(),i(82,"div",13)(83,"div",14),t(84,"Configure the dialog and preview it"),e(),i(85,"form",15)(86,"mat-form-field",16)(87,"mat-label"),t(88,"Title"),e(),m(89,"input",17),e(),i(90,"mat-form-field",18)(91,"mat-label"),t(92,"Message"),e(),i(93,"textarea",19),t(94," "),e()(),m(95,"div",20),i(96,"div",21)(97,"mat-checkbox",22),t(98," Show Icon "),e(),i(99,"mat-form-field",18)(100,"mat-label"),t(101,"Icon name"),e(),m(102,"input",23),e()(),m(103,"div",20),i(104,"div",24)(105,"div",25)(106,"mat-checkbox",22),t(107," Show Confirm button "),e(),i(108,"mat-form-field",18)(109,"mat-label"),t(110,"Confirm button label"),e(),m(111,"input",26),e()(),i(112,"div",27)(113,"mat-checkbox",22),t(114," Show Cancel button "),e(),i(115,"mat-form-field",18)(116,"mat-label"),t(117,"Cancel button label"),e(),m(118,"input",26),e()()(),m(119,"div",20),i(120,"mat-checkbox",28),t(121," Dismissible "),e(),i(122,"div",29)(123,"button",30),E("click",function(){return l.openConfirmationDialog()}),t(124,"Open Confirmation Dialog"),e()()()(),m(125,"textarea",31),_(126,"json"),m(127,"div",32),e()()),a&2&&(r(49),c("lang","ts"),r(36),c("formGroup",l.configForm),r(40),c("code",D(126,3,l.configForm.value)))},dependencies:[F,J,L,O,z,H,q,V,U,P,j,ie,te,T,I,C,x,oe,ne,N,A],encapsulation:2})}}return n})();export{re as a,Qe as b};
