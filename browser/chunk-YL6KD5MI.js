import{a as I}from"./chunk-XXBMWX7F.js";import{d as h}from"./chunk-CVOAFRV5.js";import{a as g,b as d,c as b,d as w}from"./chunk-ND2AKWSC.js";import{D as T,X as p,_,ba as m,h as k,ha as i,ka as x,l as n,m as l}from"./chunk-7YKTGSEM.js";var v=(()=>{class o{constructor(){this._httpClient=i(d),this._user=new k(1)}set user(t){this._user.next(t)}get user$(){return this._user.asObservable()}get(){return this._httpClient.get("assets/api/user.json").pipe(_(t=>{this._user.next(t)}))}static{this.\u0275fac=function(e){return new(e||o)}}static{this.\u0275prov=m({token:o,factory:o.\u0275fac,providedIn:"root"})}}return o})();var f=class{static isTokenExpired(r,t){if(!r||r==="")return!0;let e=this._getTokenExpirationDate(r);return t=t||0,e===null?!0:!(e.valueOf()>new Date().valueOf()+t*1e3)}static _b64decode(r){let t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",e="";if(r=String(r).replace(/=+$/,""),r.length%4===1)throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");for(let a=0,s,u,E=0;u=r.charAt(E++);~u&&(s=a%4?s*64+u:u,a++%4)?e+=String.fromCharCode(255&s>>(-2*a&6)):0)u=t.indexOf(u);return e}static _b64DecodeUnicode(r){return decodeURIComponent(Array.prototype.map.call(this._b64decode(r),t=>"%"+("00"+t.charCodeAt(0).toString(16)).slice(-2)).join(""))}static _urlBase64Decode(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:{t+="==";break}case 3:{t+="=";break}default:throw Error("Illegal base64url string!")}return this._b64DecodeUnicode(t)}static _decodeToken(r){if(!r)return null;let t=r.split(".");if(t.length!==3)throw new Error("The inspected token doesn't appear to be a JWT. Check to make sure it has three parts and see https://jwt.io for more.");let e=this._urlBase64Decode(t[1]);if(!e)throw new Error("Cannot decode the token.");return JSON.parse(e)}static _getTokenExpirationDate(r){let t=this._decodeToken(r);if(!Object.prototype.hasOwnProperty.call(t,"exp"))return null;let e=new Date(0);return e.setUTCSeconds(Object(t).exp),e}};var c=(()=>{class o{constructor(){this._authenticated=!1,this._appConfig=i(I),this._httpClient=i(d),this._userService=i(v)}set accessToken(t){localStorage.setItem("accessToken",t)}get accessToken(){return localStorage.getItem("accessToken")??""}signIn(t){return this._authenticated?l(()=>"User is already logged in."):this._httpClient.post(`${this._appConfig.apiEndpoint}/auth/login`,t).pipe(p(e=>(e.requiresTwoFactor||(this.accessToken=e.accessToken,this._authenticated=!0),n(e))))}signOut(){return this._authenticated?this._httpClient.post(`${this._appConfig.apiEndpoint}/auth/logout`,null).pipe(p(()=>(localStorage.removeItem("accessToken"),this._authenticated=!1,n(!0)))):(localStorage.removeItem("accessToken"),this._authenticated=!1,n(!0))}check(){return this._authenticated?n(!0):this.accessToken?f.isTokenExpired(this.accessToken)?n(!1):n(!0):n(!1)}static{this.\u0275fac=function(e){return new(e||o)}}static{this.\u0275prov=m({token:o,factory:o.\u0275fac,providedIn:"root"})}}return o})();var Z=(o,r)=>{let t=i(h);return i(c).check().pipe(p(e=>e?n(t.parseUrl("")):n(!0)))};var et=(o,r)=>{let t=i(h);return i(c).check().pipe(p(e=>{if(!e){let a=r.url==="/sign-out"?"":`redirectURL=${r.url}`,s=t.parseUrl(`sign-in?${a}`);return n(s)}return n(!0)}))};var C=(o,r)=>{let t=i(h),e=i(c),a=o.clone();return e.accessToken&&!f.isTokenExpired(e.accessToken)&&(a=o.clone({headers:o.headers.set("Authorization","Bearer "+e.accessToken)})),r(a).pipe(T(s=>(s instanceof g&&s.status===401&&(e.signOut(),location.reload()),s instanceof g&&s.status===503&&t.navigate(["/maintenance"]),l(()=>s))))};var mt=()=>[b(w([C])),{provide:x,useValue:()=>i(c),multi:!0}];export{v as a,c as b,Z as c,et as d,mt as e};
