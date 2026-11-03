// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      5.3.8.752
// @description  Enhanced timestamp tool for YouTube videos with DVR/rewind enablement for live streams
// @author       Silent Shout
// @match        https://www.youtube.com/*
// @run-at       document-start
// @icon         https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/client/assets/Kamo_64px_Indexed.png
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.setClipboard
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @connect      *
// @homepageURL  https://github.com/KamoTimestamps/timekeeper
// @supportURL   https://github.com/KamoTimestamps/timekeeper/issues
// @downloadURL  https://raw.githubusercontent.com/KamoTimestamps/timekeeper/devel/timekeeper.devel.user.js
// @updateURL    https://raw.githubusercontent.com/KamoTimestamps/timekeeper/devel/timekeeper.devel.user.js
// @license MIT
// ==/UserScript==

(()=>{var Bd=Object.defineProperty;var Dd=(e,t)=>{for(var n in t)Bd(e,n,{get:t[n],enumerable:!0})};var Ao=class extends Error{},Qe=(e,t)=>{throw new Ao(`${e||"value"}: expected ${t}`)};function Tt(e){let t={run:e,parse:n=>e(n,""),safeParse:n=>{try{return{success:!0,data:e(n,"")}}catch(o){if(o instanceof Ao)return{success:!1,error:o};throw o}},array:()=>Pd(t)};return t}var Is=e=>typeof e=="object"&&e!==null&&!Array.isArray(e);function K(){return Tt((e,t)=>typeof e=="string"?e:Qe(t,"string"))}function Dt(){return Tt((e,t)=>typeof e=="boolean"?e:Qe(t,"boolean"))}function Me(e={}){return Tt((t,n)=>typeof t!="number"||Number.isNaN(t)?Qe(n,"number"):(e.finite&&!Number.isFinite(t)&&Qe(n,"finite number"),e.int&&!Number.isInteger(t)&&Qe(n,"integer"),e.nonnegative&&t<0&&Qe(n,"number >= 0"),e.positive&&t<=0&&Qe(n,"number > 0"),e.min!==void 0&&t<e.min&&Qe(n,`number >= ${e.min}`),e.max!==void 0&&t>e.max&&Qe(n,`number <= ${e.max}`),t))}function be(e){return Tt((t,n)=>t===void 0?void 0:e.run(t,n))}function Ze(e){return Tt((t,n)=>t===null?null:e.run(t,n))}function Je(e,t){return Tt((n,o)=>{try{return e.run(n,o)}catch(a){if(a instanceof Ao)return t;throw a}})}function Pd(e){return Tt((t,n)=>Array.isArray(t)?t.map((o,a)=>e.run(o,`${n}[${a}]`)):Qe(n,"array"))}function Rd(e){return Tt((t,n)=>{if(!Is(t))return Qe(n,"object");let o={};for(let a of Object.keys(t))o[a]=e.run(t[a],n?`${n}.${a}`:a);return o})}function Se(e){let t=Tt((n,o)=>{if(!Is(n))return Qe(o,"object");let a={};for(let r of Object.keys(e)){let c=e[r].run(n[r],o?`${o}.${r}`:r);c!==void 0&&(a[r]=c)}return a});return Object.assign(t,{extend:n=>Se({...e,...n}),partial:()=>{let n={};for(let o of Object.keys(e))n[o]=be(e[o]);return Se(n)}})}var _d=Tt((e,t)=>typeof e=="string"&&e.length>0?e:Qe(t,"non-empty string")),Lr=Se({guid:_d,start:Me({finite:!0,nonnegative:!0}),comment:K(),write_counter:be(Me({int:!0,positive:!0})),deleted_at:Je(be(Me()),void 0)}),Eo=Lr.array(),dn=Lr.extend({video_id:K(),device_id:be(K())}),Ms=Se({x:Me({finite:!0}),y:Me({finite:!0}),width:be(Me({finite:!0,positive:!0})),height:be(Me({finite:!0,positive:!0}))}),Cr=Se({video_id:K(),timestamps:Eo}),Ls=Rd(Cr),Es=Se({isSignedIn:Je(Dt(),!1),accessToken:Je(Ze(K()),null),userName:Je(Ze(K()),null),email:Je(Ze(K()),null)}),Ei=Je(Tt((e,t)=>{if(typeof e=="string"){let n;try{n=JSON.parse(e)}catch{return Qe(t,"valid JSON string for auth state")}return Es.run(n,t)}return Es.run(e,t)}),{isSignedIn:!1,accessToken:null,userName:null,email:null}),Xn={isSignedIn:!1,accessToken:null,accessTokenExpiresAt:null,refreshToken:null,userId:null,userName:null,email:null},Ii=Je(Se({isSignedIn:Je(Dt(),!1),accessToken:Je(Ze(K()),null),accessTokenExpiresAt:Je(Ze(Me({finite:!0})),null),refreshToken:Je(Ze(K()),null),userId:Je(Ze(K()),null),userName:Je(Ze(K()),null),email:Je(Ze(K()),null)}),Xn),Od=Se({autoBackupEnabled:Dt(),autoBackupIntervalMinutes:Me({int:!0,min:5,max:1440}),lastAutoBackupAt:be(Ze(Me({int:!0,positive:!0})))}),Mi=Od;var Cs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-plus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 5l0 14" />
  <path d="M5 12l14 0" />
</svg>`;var Bs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-alarm-plus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 13a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
  <path d="M7 4l-2.75 2" />
  <path d="M17 4l2.75 2" />
  <path d="M10 13h4" />
  <path d="M12 11v4" />
</svg>`;var Ds=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-minus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 12l14 0" />
</svg>`;var Ps=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-plus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
  <path d="M9 12h6" />
  <path d="M12 9v6" />
</svg>`;var Rs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-minus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M9 12l6 0" />
</svg>`;var _s=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-trash"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M4 7l16 0" />
  <path d="M10 11l0 6" />
  <path d="M14 11l0 6" />
  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
</svg>`;var Os=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-clipboard"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
  <path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" />
</svg>`;var Hs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-settings"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065" />
  <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
</svg>`;var Ns=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-clock-plus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20.984 12.535a9 9 0 1 0 -8.468 8.45" />
  <path d="M16 19h6" />
  <path d="M19 16v6" />
  <path d="M12 7v5l3 3" />
</svg>`;var zs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="currentColor"
  class="icon icon-tabler icons-tabler-filled icon-tabler-current-location"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 1a1 1 0 0 1 1 1v1.055a9.004 9.004 0 0 1 7.946 7.945h1.054a1 1 0 0 1 0 2h-1.055a9.004 9.004 0 0 1 -7.944 7.945l-.001 1.055a1 1 0 0 1 -2 0v-1.055a9.004 9.004 0 0 1 -7.945 -7.944l-1.055 -.001a1 1 0 0 1 0 -2h1.055a9.004 9.004 0 0 1 7.945 -7.945v-1.055a1 1 0 0 1 1 -1m0 4a7 7 0 1 0 0 14a7 7 0 0 0 0 -14m0 3a4 4 0 1 1 -4 4l.005 -.2a4 4 0 0 1 3.995 -3.8" />
</svg>`;var Gs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-player-record"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 12a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
</svg>`;var Us=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-x"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M10 10l4 4m0 -4l-4 4" />
</svg>`;var Fs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-check"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M9 12l2 2l4 -4" />
</svg>`;var Vs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-adjustments-horizontal"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M4 6l8 0" />
  <path d="M16 6l4 0" />
  <path d="M6 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M4 12l2 0" />
  <path d="M10 12l10 0" />
  <path d="M15 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M4 18l11 0" />
  <path d="M19 18l1 0" />
</svg>`;var qs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-cloud"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M6.657 18c-2.572 0 -4.657 -2.007 -4.657 -4.483c0 -2.475 2.085 -4.482 4.657 -4.482c.393 -1.762 1.794 -3.2 3.675 -3.773c1.88 -.572 3.956 -.193 5.444 1c1.488 1.19 2.162 3.007 1.77 4.769h.99c1.913 0 3.464 1.56 3.464 3.486c0 1.927 -1.551 3.487 -3.465 3.487h-11.878" />
</svg>`;var js=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-device-floppy"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
  <path d="M10 14a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M14 4l0 4l-6 0l0 -4" />
</svg>`;var $s=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-folder-open"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2" />
</svg>`;var Ws=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-export"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v5m-5 6h7m-3 -3l3 3l-3 3" />
</svg>`;var Ks=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-import"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M5 13v-8a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5.5m-9.5 -2h7m-3 -3l3 3l-3 3" />
</svg>`;var Ys=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-spreadsheet"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
  <path d="M8 11h8v7h-8l0 -7" />
  <path d="M8 15h8" />
  <path d="M11 11v7" />
</svg>`;var Xs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-login"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
  <path d="M21 12h-13l3 -3" />
  <path d="M11 15l-3 -3" />
</svg>`;var Js=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-logout"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
  <path d="M9 12h12l-3 -3" />
  <path d="M18 15l3 -3" />
</svg>`;var Qs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-refresh"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
  <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
</svg>`;var Zs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-star"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245" />
</svg>`;var el=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-alert-triangle"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 9v4" />
  <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0" />
  <path d="M12 16h.01" />
</svg>`;var tl=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-database"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M4 6a8 3 0 1 0 16 0a8 3 0 1 0 -16 0" />
  <path d="M4 6v6a8 3 0 0 0 16 0v-6" />
  <path d="M4 12v6a8 3 0 0 0 16 0v-6" />
</svg>`;var nl=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-server"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 7a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-2" />
  <path d="M3 15a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -2" />
  <path d="M7 8l0 .01" />
  <path d="M7 16l0 .01" />
</svg>`;var ol=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-world"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
  <path d="M3.6 9h16.8" />
  <path d="M3.6 15h16.8" />
  <path d="M11.5 3a17 17 0 0 0 0 18" />
  <path d="M12.5 3a17 17 0 0 1 0 18" />
</svg>`;var rl=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-plug-connected"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M7 12l5 5l-1.5 1.5a3.536 3.536 0 1 1 -5 -5l1.5 -1.5" />
  <path d="M17 12l-5 -5l1.5 -1.5a3.536 3.536 0 1 1 5 5l-1.5 1.5" />
  <path d="M3 21l2.5 -2.5" />
  <path d="M18.5 5.5l2.5 -2.5" />
  <path d="M10 11l-2 2" />
  <path d="M13 14l-2 2" />
</svg>`;var il=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-key"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0" />
  <path d="M15 9h.01" />
</svg>`;var al=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-x"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M18 6l-12 12" />
  <path d="M6 6l12 12" />
</svg>`;var sl=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-indent-increase"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 6l-11 0" />
  <path d="M20 12l-7 0" />
  <path d="M20 18l-11 0" />
  <path d="M4 8l4 4l-4 4" />
</svg>`;var ll=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-indent-decrease"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 6l-7 0" />
  <path d="M20 12l-9 0" />
  <path d="M20 18l-7 0" />
  <path d="M8 8l-4 4l4 4" />
</svg>`;var gp={plus:Cs,"alarm-plus":Bs,minus:Ds,"circle-plus":Ps,"circle-minus":Rs,trash:_s,clipboard:Os,settings:Hs,"clock-plus":Ns,"current-location":zs,"player-record":Gs,"circle-x":Us,"circle-check":Fs,"adjustments-horizontal":Vs,cloud:qs,"device-floppy":js,"folder-open":$s,"file-export":Ws,"file-import":Ks,"file-spreadsheet":Ys,login:Xs,logout:Js,refresh:Qs,star:Zs,"alert-triangle":el,database:tl,server:nl,world:ol,"plug-connected":rl,key:il,x:al,"indent-increase":sl,"indent-decrease":ll},cl="http://www.w3.org/2000/svg",yp=/^\s*<svg\s+([^>]*)>([\s\S]*?)<\/svg>\s*$/,vp=/<([a-zA-Z][\w:-]*)([^>]*)\/>/g,wp=/([a-zA-Z_:][\w:.-]*)="([^"]*)"/g,ul=new Map;function dl(e){let t={};for(let n of e.matchAll(wp))t[n[1]]=n[2];return t}function bp(e){return e.startsWith("data:image/svg+xml;base64,")?atob(e.slice(26)):e.startsWith("data:image/svg+xml,")?decodeURIComponent(e.slice(19)):e}function Sp(e){let t=bp(e).match(yp);if(!t)throw new Error("Invalid Tabler SVG source");let[,n,o]=t,a=document.createElementNS(cl,"svg"),r=dl(n);for(let[c,s]of Object.entries(r))c!=="class"&&a.setAttribute(c,s);for(let c of o.matchAll(vp)){let[,s,h]=c,m=document.createElementNS(cl,s),v=dl(h);for(let[f,y]of Object.entries(v))m.setAttribute(f,y);a.appendChild(m)}return a}function xp(e){let t=ul.get(e);if(t)return t;let n=Sp(gp[e]);return ul.set(e,n),n}function Rn(e,t=20){let n=xp(e).cloneNode(!0);return n.setAttribute("width",String(t)),n.setAttribute("height",String(t)),n.setAttribute("aria-hidden","true"),n.style.pointerEvents="none",n.style.flexShrink="0",n.style.verticalAlign="middle",n}function Ge(e,t,n){e.replaceChildren(Rn(t,n))}function Y(e,t,n,o){e.replaceChildren(Rn(t,o),document.createTextNode("\xA0"+n))}var pl="5.3.8";var Br=pl+"+3d3835e",Li=null;function l(e,...t){let n="debug",o=[...t];t.length>0&&typeof t[t.length-1]=="string"&&["debug","info","warn","error"].includes(t[t.length-1])&&(n=o.pop());let a=`[Timekeeper v${Br}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[n](`${a} ${e}`,...o)}var Dr=e=>String(e).padStart(2,"0");function pn(e,t=e){let n=Math.floor(e/3600),o=Math.floor(e%3600/60),a=Dr(e%60);return t<3600?`${t>=600?Dr(o):o}:${a}`:`${t>=36e3?Dr(n):n}:${Dr(o)}:${a}`}function Pr(e,t){return pn(e,Math.max(e,t))}function Ci(e,t){let n=Math.max(0,...e.map(o=>o.start));return e.map(o=>{let a=pn(o.start,n),r=t?`${o.comment} <!-- guid:${o.guid} -->`.trimStart():o.comment;return`${a} ${r}`}).join(`
`)}function ml(e,t=window.location.href){try{let n=new URL(t);return n.searchParams.set("t",`${e}s`),n.toString()}catch{return`https://www.youtube.com/watch?v=${t.search(/[?&]v=/)>=0?t.split(/[?&]v=/)[1].split(/&/)[0]:t.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${e}s`}}function _n(){let e=new Date;return e.getUTCFullYear()+"-"+String(e.getUTCMonth()+1).padStart(2,"0")+"-"+String(e.getUTCDate()).padStart(2,"0")+"--"+String(e.getUTCHours()).padStart(2,"0")+"-"+String(e.getUTCMinutes()).padStart(2,"0")+"-"+String(e.getUTCSeconds()).padStart(2,"0")}async function fl(e,t){let n=new Map,o=new TextEncoder;return Promise.all(t.map(async a=>{if(a.guid)return a;let r=`${e}\0${a.start}\0${a.comment}`,c=n.get(r)??0;n.set(r,c+1);let s=await crypto.subtle.digest("SHA-256",o.encode(`${r}\0${c}`)),h=Array.from(new Uint8Array(s),m=>m.toString(16).padStart(2,"0")).join("");return{...a,guid:h}}))}var hl=`#ytls-pane {
  background: rgba(19, 19, 19, 0.8);
  text-align: left;
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 0;
  margin: 0;
  border-radius: 12px;
  /* Add rounded corners */
  border: 1px solid rgba(85, 85, 85, 0.8);
  /* Add a thin grey border */
  opacity: 0.9;
  z-index: 5000;
  font-family: Arial, sans-serif;
  width: 300px;
  height: 90vh;
  min-width: 300px;
  max-width: 800px;
  min-height: 400px;
  max-height: 90vh;
  user-select: none;
  /* Prevent text selection in pane */
  display: flex;
  flex-direction: column;
  will-change: width, height;
  transform: translateZ(0);
  backface-visibility: hidden;
  contain: layout style paint;
  overflow: hidden;
}

#ytls-pane:hover {
  opacity: 1;
}

/* Legacy corner handle: keep element for resize behavior but hide visual indicator */
/* Legacy corner handle kept for compatibility but hidden visually */
#ytls-resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  cursor: auto;
  /* no visible corner cursor */
  z-index: 10;
  pointer-events: none;
  /* legacy handle inactive, corners handle events */
  background: transparent;
  margin: 0;
  padding: 0;
}

#ytls-resize-handle::before {
  display: none;
  /* remove the triangular corner indicator */
  content: none;
}

/* Corner handles for diagonal resize */
#ytls-resize-tl,
#ytls-resize-tr,
#ytls-resize-bl,
#ytls-resize-br {
  position: absolute;
  /* Use 16px click areas for corner resize handlers to match touch targets and reduce accidental drags */
  width: 16px;
  height: 16px;
  z-index: 11;
  background: transparent;
  pointer-events: auto;
}

#ytls-resize-tl {
  top: 0;
  left: 0;
  cursor: nwse-resize;
}

#ytls-resize-tr {
  top: 0;
  right: 0;
  cursor: nesw-resize;
}

#ytls-resize-bl {
  bottom: 0;
  left: 0;
  cursor: nesw-resize;
}

#ytls-resize-br {
  bottom: 0;
  right: 0;
  cursor: nwse-resize;
}

#ytls-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  position: relative;
}

/* Wrapper that gives the custom scrollbar a positioned ancestor covering only the list area */
#ytls-list-wrapper {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
}

#ytls-content ul {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 !important;
  border: none !important;
  box-sizing: border-box;
  scrollbar-width: none;
  /* Firefox: hide native scrollbar */
}

#ytls-content ul::-webkit-scrollbar {
  display: none;
  /* WebKit: hide native scrollbar */
}

/* Custom overlay scrollbar track */
.ytls-scrollbar-track {
  --ytls-scrollbar-size: 10px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: var(--ytls-scrollbar-size);
  pointer-events: auto;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 2;
}

.ytls-scrollbar-track.ytls-scrollbar-visible {
  opacity: 1;
}

/* Custom overlay scrollbar thumb */
.ytls-scrollbar-thumb {
  position: absolute;
  right: 2px;
  width: calc(var(--ytls-scrollbar-size) - 4px);
  min-height: 30px;
  background: rgba(255, 255, 255, 0.42);
  border-radius: 999px;
  transition: background 0.15s ease;
}

.ytls-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.62);
}

/* Placeholder message shown centered in the list area while loading or when empty */
#ytls-content ul li.ytls-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  color: #bfbfbf;
  font-size: 14px;
  font-style: italic;
  padding: 12px;
  text-align: center;
  box-sizing: border-box;
}

#ytls-pane-header {
  position: relative;
  z-index: 2;
}

#ytls-buttons {
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding: 10px 18px 10px 16px;
  background: #131313;
  border-radius: 0 0 12px 12px;
  border-top: 1px solid #23272b;
  margin-top: auto;
}

#ytls-pane li {
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  margin: 0 !important;
  border: none;
  border-top: 1px solid rgba(85, 85, 85, 0.8);
  user-select: none;
  /* Prevent text selection in timestamp items */
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
}

#ytls-pane li:first-child {
  border-top: none;
}

#ytls-pane li.ytls-timestamp-highlight {
  background: rgba(35, 48, 36, 0.8);
}

#ytls-pane li.ytls-timestamp-pending-delete {
  background: rgba(128, 0, 0, 0.8);
}

#ytls-pane .time-row {
  display: flex;
  gap: 5px;
  align-items: center;
}

#ytls-pane .time-row a {
  flex: 0 0 8ch;
  /* Reserve fixed hh:mm:ss width so controls don't shift */
  width: 8ch;
  min-width: 8ch;
  max-width: 8ch;
  display: inline-block;
  text-align: left;
  /* Align the text to the left */
  overflow: hidden;
  /* Prevent overflow */
  text-overflow: ellipsis;
  /* Add ellipsis for long text */
  white-space: nowrap;
  /* Prevent wrapping */
  font-variant-numeric: tabular-nums;
}

#ytls-pane .time-row .time-diff {
  flex-grow: 1;
  /* Allow time-diff to fill remaining space */
  text-align: right;
  /* Align time diff text to the right, next to trash icon */
}

#ytls-pane .time-row .ytls-row-controls {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-left: 5px;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

#ytls-pane li:hover .time-row .ytls-row-controls {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.ytp-progress-bar .ytls-marker {
  position: absolute;
  height: 100%;
  width: 2px;
  background-color: #ff0000;
  cursor: pointer;
}

#ytls-pane [data-time] {
  cursor: pointer;
}

#ytls-pane span,
#ytls-pane a,
#ytls-pane input {
  background: none;
  color: white;
  font-family: inherit;
  font-size: 14px;
  text-decoration: none;
  border: none;
  outline: none;
}

/* Ensure editing controls behave like editable fields despite parent user-select:none */
#ytls-pane input,
#ytls-pane textarea {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
  caret-color: white;
}

#ytls-buttons {
  flex-shrink: 0;
  display: flex;
  gap: 5px;
  justify-content: space-between;
  padding: 8px 12px;
  background: #131313;
  border-radius: 0 0 12px 12px;
  border-top: 1px solid rgba(85, 85, 85, 0.8);
  z-index: 2;
  /* Ensure it stays at the bottom */
}

#ytls-buttons button:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Styles for main control buttons */
.ytls-main-button {
  background: rgb(39, 39, 39);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px;
  min-width: 36px;
  min-height: 36px;
  cursor: pointer;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  touch-action: manipulation;
}

.ytls-main-button:hover {
  background: rgb(63, 63, 63);
}

.ytls-main-button svg {
  display: block;
  width: 24px;
  height: 24px;
}

/* Pane header and utility styles */
#ytls-pane-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 18px 10px 16px;
  white-space: nowrap;
  cursor: default;
  border-radius: 12px 12px 0 0;
  border: none;
  background: linear-gradient(180deg, #23272b 0%, #212121 100%);
  box-shadow: 0 1px 0 0 #23272b;
  flex-shrink: 0;
  color: #fafafa;
}

#ytls-pane .ytls-version-display {
  font-size: 14px;
  color: #666;
  margin-left: auto;
  padding-right: 5px;
  cursor: default;
}

#ytls-pane .ytls-google-user-display {
  font-size: 12px;
  color: #4285f4;
  margin-left: 8px;
  padding: 2px 6px;
  cursor: default;
  background: rgba(66, 133, 244, 0.1);
  border-radius: 4px;
}

#ytls-pane .ytls-backup-status-display {
  font-size: 12px;
  color: #9acd32;
  /* yellowgreen */
  margin-left: 8px;
  padding: 2px 6px;
  cursor: default;
  background: rgba(154, 205, 50, 0.12);
  border-radius: 4px;
}

#ytls-members-badge {
  display: none;
  align-items: center;
  margin-right: 4px;
  color: #52c41a;
}

#ytls-members-badge svg {
  fill: currentColor;
}

#ytls-current-time {
  color: white;
  font-size: 14px;
  cursor: pointer;
  position: relative;
}

#ytls-playback-speed {
  color: white;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  padding: 0 2px;
  border-radius: 3px;
  outline: none;
  display: inline-block;
  width: 5ch;
  text-align: center;
  transition: filter 0.2s ease;
}

#ytls-playback-speed:hover {
  text-decoration: underline;
}

#ytls-playback-speed.ytls-playback-speed-active {
  color: #f4ba78;
}

#ytls-playback-speed-group {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
  align-self: center;
}

/* Backup status indicator (colored dot) */
.ytls-backup-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #666;
  cursor: help;
  flex-shrink: 0;
}

@keyframes ytls-pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.25;
  }
}

.ytls-backup-indicator--pulsing {
  animation: ytls-pulse 1.6s ease-in-out infinite;
}

/* Shared modal container styles */
#ytls-settings-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #1a1a1a;
  padding: 8px;
  border-radius: 10px;
  z-index: 10000;
  color: white;
  text-align: center;
  width: 200px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

#ytls-save-modal,
#ytls-load-modal,
#ytls-delete-all-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #333;
  padding: 8px;
  border-radius: 10px;
  z-index: 10000;
  color: white;
  text-align: center;
  width: fit-content;
  max-width: 90vw;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

/* Modal header with tabs and close button */
.ytls-modal-header {
  display: flex;
  align-items: flex-end;
  margin-bottom: 0;
  gap: 10px;
}

/* Modal close button (X in header) */
.ytls-modal-close-button {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  flex-shrink: 0;
  z-index: 1;
}

.ytls-modal-close-button:hover {
  background: #ff6666;
}

/* Styles for settings modal */
#ytls-settings-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  background: #2a2a2a;
  border: 2px solid #3a3a3a;
  border-radius: 0 4px 4px 4px;
  padding: 10px;
  margin-top: -2px;
  position: relative;
  z-index: 1;
}

/* Section heading */
.ytls-section-heading {
  margin: 0 0 10px 0;
  padding: 0;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  text-align: center;
}

/* Settings nav (tabs) */
#ytls-settings-nav {
  display: flex;
  gap: 6px;
  flex: 0;
}

#ytls-settings-nav .ytls-settings-modal-button {
  flex: 0;
  width: auto;
  height: 24px;
  margin-bottom: 0;
  background: #2a2a2a;
  font-size: 13px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border: 2px solid transparent;
  border-radius: 4px 4px 0 0;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  position: relative;
}

#ytls-settings-nav .ytls-settings-modal-button .ytls-tab-text {
  display: none;
}

#ytls-settings-nav .ytls-settings-modal-button.active .ytls-tab-text {
  display: inline;
}

#ytls-settings-nav .ytls-settings-modal-button:hover {
  background: #3a3a3a;
}

#ytls-settings-nav .ytls-settings-modal-button.active {
  background: #2a2a2a;
  border: 2px solid #3a3a3a;
  border-bottom: 2px solid #2a2a2a;
  z-index: 2;
}

/* Button grid container */
.ytls-button-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 5px;
  width: 100%;
}

/* Styles for buttons in the settings modal */
.ytls-settings-modal-button {
  width: 100%;
  height: 32px;
  background: #555;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
  padding: 0 8px;
  gap: 4px;
}

.ytls-settings-modal-button:hover {
  background: #777;
  /* Example hover effect */
}

/* Tabler icon sizing in pane controls */
#ytls-pane .time-row span svg,
#ytls-pane .time-row button svg {
  display: block;
  flex-shrink: 0;
  pointer-events: none;
}

/* Route SVG clicks to their parent controls for consistent interaction */
.ytls-main-button svg,
.ytls-settings-modal-button svg,
.ytls-save-modal-button svg,
.ytls-save-modal-cancel-button svg,
.ytls-modal-close-button svg,
#ytls-header-button svg {
  pointer-events: none;
}

/* Reduce mobile tap delay for button-like controls */
.ytls-row-control,
.ytls-settings-modal-button,
.ytls-save-modal-button,
.ytls-save-modal-cancel-button,
.ytls-modal-close-button,
#ytls-header-button,
#ytls-buttons button {
  touch-action: manipulation;
}

/* Shared styles for modal copy */
#ytls-save-modal p,
#ytls-load-modal p,
#ytls-delete-all-modal p {
  margin-bottom: 15px;
  font-size: 16px;
}

.ytls-save-modal-button {
  background: #555;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  /* Applied to both JSON and Text buttons, last one will have extra margin if not overridden */
}

.ytls-save-modal-button:last-of-type {
  /* Remove margin from the last button of this type in the modal */
  margin-right: 0;
}

.ytls-save-modal-cancel-button {
  background: #444;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
  display: block;
  width: 100%;
}

/* Styles for file operation buttons (Save, Load, Export, Import) if they were to be displayed directly */
/* Note: These buttons (saveBtn, loadBtn, etc.) are not directly added to the UI with these styles. */
/* Their onclick handlers are used by the settings modal buttons which use .ytls-settings-modal-button. */
.ytls-file-operation-button {
  background: #555;
  color: white;
  font-size: 12px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.ytls-file-operation-button:hover {
  background: #777;
  /* Example hover effect */
}

.ytls-hidden-file-input {
  display: none;
}

#ytls-header-button {
  align-items: center;
  background: transparent;
  border: none;
  color: var(--yt-spec-text-primary, currentColor);
  cursor: pointer;
  display: inline-flex;
  font-size: 20px;
  height: 40px;
  margin-left: 6px;
  padding: 0 6px;
  text-decoration: none;
}

#ytls-header-button:hover {
  color: var(--yt-spec-call-to-action, #3ea6ff);
}

#ytls-header-button:focus-visible {
  outline: 2px solid var(--yt-spec-call-to-action, #3ea6ff);
  outline-offset: 2px;
}

#ytls-header-button img {
  display: block;
  height: 32px;
  max-width: 48px;
  pointer-events: none;
  width: auto;
}

/* Shared fade animations for pane and modals */
.ytls-fade-in {
  animation: fadeIn 0.3s ease-in-out forwards;
}

.ytls-fade-out {
  animation: fadeOut 0.3s ease-in-out forwards;
}

/* Zoom animations for pane expand/collapse */
.ytls-zoom-in {
  animation: zoomIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  transform-origin: center center;
}

.ytls-zoom-out {
  animation: zoomOut 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  transform-origin: center center;
}

/* Fade-in animation for modals */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* Fade-out animation for modals */
@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

/* Zoom-in animation - expand from point */
@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.1);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Zoom-out animation - collapse to point */
@keyframes zoomOut {
  from {
    opacity: 1;
    transform: scale(1);
  }

  to {
    opacity: 0;
    transform: scale(0.1);
  }
}

/* Custom tooltip styles */
.ytls-tooltip {
  position: fixed;
  background: rgba(97, 97, 97, 0.92);
  color: #fff;
  padding: 8px 10px;
  border-radius: 2px;
  font-size: 12px;
  font-family: "Roboto", "Arial", sans-serif;
  font-weight: normal;
  line-height: 1.4;
  letter-spacing: 0.2px;
  z-index: 10001;
  pointer-events: none;
  white-space: pre-line;
  max-width: 300px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transition: opacity 0.2s cubic-bezier(0.0, 0.0, 0.2, 1);
}

.ytls-tooltip.ytls-tooltip-visible {
  opacity: 1;
}
`;var gl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kKGhISKNpo4IcAAAL9UExURQAAAP/abf7Zaf/Yaf7Ya//XaP/WZv/VZf/VY//UYf/SYv/SYPvTZf/QZ//ObP7QYPzRYP7QXfjRZv7Kdv7PW/3OX//FgPnOXv7MVv/ChP3LWPzLWv7Bhf3EeP++jfXJZPXKW/rIWPvIVffIWv+4lvvGVfPIXvHJXvrFV/vFU/61nPvFUP6zn/i5ivrCU/2yl/6vovvBTP+tp/6upPjBUPbBVPPCVfG8ee3EWOnEXvm+UPu0fvq+SO/AV/m9TPq1cvm9Svq9Req/YPm1Zva7Tvi6Tfi6S/m3V/G8T+e/Vvi5R+20ePi3Sui3bvi3RPe2S/Snn/a1R/e0R/G3ReW6Uve0QOm5Seu3Tei4T/eyRvaySOC6VvaxPuyzSuO1V+W1T922Udi0UuCvS+WtRuqrPNSwU+SbldiqZ+epP9mpSNamT86qT96kP82pSuKhOsemStifPdedN8OiTMufQtGOidaaOMKhSNmYNMyVRb2cR9OUM+yFLuuEL+iDLcWSOM+NLbaVQ8iMMrqQPON+K72Be99/KMaGNK2QQcGFOsmEI9h7JdV7IaiLP9l2KMd+HLCFNKyAVdVyJc14Gr97LqKHPLx6Ms1zJ8Z4GMJ4Hrx6Icd2Fqpyb89tI5yAOJ17SaV7MsNtJrhwKqB5NJd8Npd6O7xsHsRlHpt1MaVyJbZnJJB1MbljII11NZtwI5ZmX7BhIYZvL41rKohpLoJqLZBkIKJaHp9eEKpVGXhjLXthL5hUHHxdIo9RFnRaJnBcJnFYKXNVJ3RSG2lWI4JIF25PJWlON2ZPJmpOGmFRIWVNHGhKImNKHXNCC1hIHVxAHlRDIWg5EVc9HU5AGGM1D0w8HlA8E1I5HEc6Fkw3EFcxEEo0GkQ2G0UxGT8tGDswEUwoCzsuFj8oJj0tDDsrGDksFzgpFkMkCjQnFjMpDTAjFS0lDC0iFDEiCDcdCSoiCikgFCYeByQcEzAYBSoaBSQcByIbBykUBBwVBRcSBBoLAhQNAw8JBAsKAwcGAgAAAN3XOCgAAAABdFJOUwBA5thmAAAGaElEQVR42u2WW2wUVRjH/2dmdy7doduy7S6XQltaIaCiYlJEhYpRo1aMJEbxQgQvRI0YNPESjVGjiS/qiz5ojEEfBKOEgNJQQKRcWy6FSmtoramlpVCWUsre5rI75ziXLXTd1t2++eAvk8zszPl+5/+d3cke/E9eUG3g1KnuYTqxIoygtWx5b+3qVatf/7pZQ54YHU17mzpUW5Jq/uiJCtlnE3ri81PZKQiy6T16IAqPVH7dnLLwroZ6nUOa0keenJ+HYOjbAyd0MxCUA5U1xzb2ArhiUN553pNTQPd8+asKQA755ye3XQYg6SDpcc++Ozm3oH7teQ4UIN6SQT09Kp3C88qbUk4BTm5sPa4RQCVgsCjSNYDYBu/y1bdzuQV08LdDejIZ3X2OgALFD+CPvmEYrHDBkqU1HPIgun7da+tWVImCIHi9XqFq5RtvrXvpmZfe+j5KkYUHWcQ3f9kBDRQu7MzuRcUFPh9ie3335yMY+v6rVgCUEZaWDP4SmFkIPh7TTU1CrjUI//DZ6XQ9dR8zcIQUlCjVYnhq3TI5h2Bow2e9DIwBjIJQBhAOjCMAJ1dVqoG6B6V/FWg/fmjVAxSM2uU8YFoK20AImXK9NnX5gxxGk/mJ7tpw/oaVL668SWB2FzxM0wTPKCxY+ZPLr5nd/1MjxbjQ5tUVrzZ09bQ3vDqZ9xAPcbGueK/y3KYTPV1H1z+6toWOm6Bn855VTy8qEv3VD6+SKUy4mDwFfezxGwu9hRV314V/Do8nMA7+sHTZDAMwUHTH9YyHRXGxbWCkujZEYSEuKGvelxpbQA9sIPNnUlDrSE5eAAt+5esfvGArcGtZEoxSIFTZ1dBCxxR0bj1ZNUWABQMEkQf4NXUlqaVrLAMt8Jj2vBSeKeaeHUNjCeL128qJRmEnSJmGblr1dw/0hDtuXsGDGHa5AYsBdfjQQZotoLt2+xTS3g+XoePEXLLw4gUGrbf2cR7tEYCCAv2dMeNwwymaJWja3l5skiOHNWeiRGMb56vx9jAAl6ILp6OtMQELqh/ewUvKtl19/3yZPvz2SDBmsvB36m0loOf3fqOzaTNQCiAFzKrdaNSLd8zg6aXWLVqZADSe+eq5jJ/yAriQC+TOciV2+kcDTHykelIhgAii2w+Dk+pC05LdJ+MCHGZuGVMA2qd5oRJQgEzni+DAulSOEUiMmCFLmWFwW1hzDCMUaLptJQyQjSgceEFnBETnrCuMEBy9iPfORBp2GZwjIIDqh4MCw663x5IYuZLgtCuHzdNNdh0IjYaTsCDOkZRkCbxpSoNR+wYHgBqU4+yRBr2n9v0raxD7uH5yKpVCt2FQWDAGZp+kgH/SsIFoXHPnt/EwLy/AMLkVr8y6Imj+OOIDPK1nMQJ1DBAFwdInqVufyfRP6ri0gK7/oowwmC3DGGVwFJl/TJm8/LaS/hbCrToBYcN6xltKyVUBwRi0tlPONfecs1WImhiNtVjEqXbP2RzvgpuA1p9wliOGNDlmHiHWFoGbIKy5XRuYGOFeV8DCEGEhC5gYHYPUEZg6bLgiHhNjwG3BPnQJgFKKCSGo0bSgxCAMgFhZNKF6GYYrQJkvBhEE4jUC8kcMQUgLpsyNwaF02gQMAUMuSrdQUa1qOkCQmpe/QQ7SuaWuAMEa6kQgMG+qkJEXQkjWZldwrgA3LPndgLMMiWtr/HmFKC4fDt0VHHmd6aZPL84RbIOGAv3Pc1HkoqhK6nrqxSDSCbi7Hk5aGYiuiWLCc+3i2TlSCP5ysfeBZSVu3w7dmzf1zSuFBkAEePRcvGAaGBMZQkkonlr0WA03SoDhxq37uIpSDbaCMGjxATUO0BRggocJWwt4Aij2KHpf5ZKH5nAYLQA9Ub+tv6BCIbZBBwOFCg9sItbJElk+HzwFnH5+XmXtYplDpgCJxo5zvX9FBMVXwIEwgJqwMWCjSdAcTUycNfXOW0q47F3a/iYieiODQ7HuqMmbsmLPByLoloyAOQFi0/xKYaFfmbVYRJYgsaMFRBJEyYwkEqoaMxXE7KbBCJO0y6UQZNnr9yrQotrU+yqzt7opA4wlVAJJUAKAMDeYTCZHOoj0x2Xwmg71EhgbZ6PZ2nla19P3hMDshZNwFb2tsz+pwSklk4JVNSLG4GLb/p31Djv3tyWQgdF59VnrWXPcrS5lFBYc4ZBFisHdOfP4b/E301Ck7f/BFa8AAAAASUVORK5CYII=",yl="assets/Kamo_64px_Indexed.png",vl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kKGhISFPUHnAAAAAMAUExURQAAAAAAAAcGARIMAhkNAR0OABgRAx4SAyMRASEVAyMVAigXAiEZBicYAiMbBiwZASsaAzAZACkbBC0cAi0dBjAdAjMeAykhCTIfAzQfAzAhBzUgAjghAy0kCzkiAzQkBzwkAz0kAzklBz8lA0AmBEEmAz4nBUEnBEQoBEUpAz0rCzgtD0ErCUcqA0EsB0crBEkrA0YsB0osAksuBU0uA08vBEQyD0E0E0kyDlExBVIxBFQzB1U0BUg3Ek83D0o6Flc5DFQ6DlQ8E1Y9E08/GFo/EF4+Dlw/EVVBF2U+CFtBFWg/CFxFGGVEEllHHGRGFmJHF2BKGpg7BGBOHmlMGWxNGG1NGZ1BCGhQHWZRIaJGDZ9ID3NWHnNYIXpXHW9aJJ5NE4VWGadOEntbIIBbH6RRFXlhKKhWFn9iJbBWGIJlKItjI39nKoZmJq9cGohsK5RqJqxjI7lgHYhuL41tK7ZjH5xxKpF0L7dqIJV0LsFqI5R4M7FxHbRwKpd7NJx7MqZ5LclvJcN1D5t/N8F1Jql9MKOBNK9+LsJ6G6GCOM54KreAKsl8GL9+Mr+AM7OEM8CBJ7iEMqqKPMyCH9h+Lq+KO82DLa+MO7GMO86GJMGLM8iJN7GQP9yFMeGFMMeOObeTPuWIMsOSOsiRN+SLNLqXQteRMb2YQdmTLtCWOsGaQ76bRe2ONeqRN9aYOcidRO+SONqZM8WeRdWbO9ScP/CUOcahRuGbNu+XOtuePMikSOGeNtSiQ92gOtiiRdqiQM6oSuGlPuelP9KrS9iqSemmPOepQe6oPdavTe6rQeqsROGvS+iuRvGtQfKtQNy0UOWyTfevQ/awQfOxRfexRPezQ/O0R/ezReq3UPe0RvG2SeO6Uvm1R/i2R++5TPi4SOe9VO28Uvm6TPO+Ufq9TezBV/q+T+/BVvHBVfrAUPDFWPvDUvzEU/fGV/PHWvXHWfzGVvXKW/3IWPrLWfrLXPjMXP3LWf7NWvzOXf/PXP/PXv3QXv7QXP7RXf/RXf/SYIi9XXwAAAABdFJOUwBA5thmAAAHkUlEQVR42sXWa3BU5R3H8e//eZ6zt+wlIQRqsBIC4w2QqKhAA52K1tYqqKjIiDpUHd60HaszHX3hdCo6tbXSVvFSBtsyjFqsoJVRvLWK4WLjpWhBAcWgYGgIm012N7vZ3XPpZmOCyW6ovupnzvNiz5z/7/znOf/ds/zfyXFOeowk5SelYrkeF+g74oA34kIRtyy6jEj99b9ct37d729ZOFZk8JyEv33Dbb9as+aBFbctmioio3cgfGfhOTUUZXr3bH31MB4I82bOmjIu7NeQtxMHWt7ahDdqwGm3zBatMNguibe2/S0P8y648LSwYkhm39PPfoBXMUD40XURpUMhH3Yu7WS7tr+x9+LFZ0QZLvnyui+aMIxgNdbahMZaQDDc6wvnZcn8ekaKXlpnbazcgbprQVDXxCjxcuntdadHhXK5N+5s9SruwcIl04OhGmvwus5qn49KkvevwKsUwNxZcyfXhz3D//DKjYc8UIzg0XLfxpYXt73Xdqgr7XIcwShFinJzJnTs2/LCxhe2HnYYlOvKeQz32cGKT0E4b3nz0XgPsWjduGM1hV00jrf4kvYtqUoBwvxl33MlBj5/OHCsIvTN1j2nnlLtH5qlznVPUOEpCNcvm57tczDBUvkx2QOff8KUSbEqjE12b+uODQWPkQGCumXppEQe7YuGLIbJd2eOtHXmIpGqMOm25173KoyycOKy66qTNiYcsQwjpLod92gy3pkD7JYX8BgZIJy+/CqVtrUOR32U8ZIJF+jJUbR11WdlAcX6n17iZj10JOKjgkImWYBMBhNy0xse7BtIkGH1dg5UTVSoyOs7tHdXR5rw+Gnjcusfdb3hgzRu+SV2QWGNWk+qdfXKlY+uXbtqxX1P9iy4FvlygFjLF/bf34qGhMo616547PPmm2699Yez339wzac/uBI5NkjCvMaPsoQj442mMndva/D65qZYFb2fbt3xamLRhfHXhvZAaI5lMviC0bqJjVMmRP1UkPyECTWGonz8o+2vsjh+f9xDvpjfn0QOHT2cTXa0dwVObpg+qzHK8WS7Ejufjl3294fxFP1OvPzUk5ovunrxtTfe+uPv8tLKX6zc2n38b3J4zpUdR+cvGNhEUUvP07ndzzyy6pHn/hW9+o475vesv/t3H7uMLhyh6Romnn+CKBBuvqKm46nf3veXzdv+8czqNYcW3PnzxXVv/uEgo5NIMDTn7NDMy9EI1yyt73jqz/vdgPGJLrS3cfYp585qijVEGJ02GTTBQIcgly5rSm9YnTBaa6u4jJy05KoQ2Ibj8eJJGzu9Wcm5S8/OH2iJC57SopSI6Xj+30DlejvZncy4gJRedNHzlXXFzGz+nR0K19BfrtGqbXM3FSV3Pr7ynhWrXmq3IRDWWlGnllzkudlP8qItRBRaDMIHB6jk44fueXD9sxseuffX2zIQtChSi8bkVbZHA0qDFrQS2vfYlHF3PrDxY1sE9j/5m2cz+MKiQJ2ZBTel0BqlBHyA5NvylDn4xx0oAYXQsm6bTdDv9te4aJD+BWhxUUCqvIPM5nfppwW0r+XxA/gCFqg+lNSMpxSslItWfEmudyip8+28IPgosV7ZksMn2MoB9Y1atBlsBAR8hqLet59c3TL4QPYNTKaLiFLQ1RrHqCJwdfjkEB4lPgQs6wQN9n/++tCmrY/9qWOgl4/SFpS2jSLP+vAgwsAnE5o7B0pDhFs6W9vkx9798CY1Y0b0n4+XEpwjMvxneP9BlKa4lKWl8VsxpQWUKIUYpjVi71y7u6F56tRZE97Z1EvZO8iQ6rW1AoNGE1185Glb9WeIgN1wca27+4lPG2bEIDaDHZPnGjz/8ATXb5mCAiWIgYlLL6tVRotPizDpqrPUkQ0D9RCb5t+0H8wYxBIYeqNFajAaDCgFNP3s1C17+3wCVdMXnRPqfXFfw1k1lIyZ+u7zdWP8U2sSlLilg9NOAAfMYGP1181678N2zz/ujNkTDB9uH3PWWAboE+PvnjnXTDnlTfAGW/C8qRNBg2JQVdO1t9979123XznRkNuVnBRkUGBy9LU4Y+fViBFXycDQTZsfG+jAKuAywFRXD960zuzpDAdr8QehirGTdr59kWne9XIO7fQfYC6cqXBdlDF5ypnZ+dZEuw064A8GIN132DE1N/B6wiOQsRy37vKb68Bxwdi4BcqEzmzIdSe6u0g7pHO4tVGg/qYpr+8/6lKITrvg+/WA64C0ORKuE0ZwjhTvBXm84lK2E5g8hqJc/L2dPU7VyefWhyhKddrIfk/839CMlO3opUQUSkt46K9rxsb4DP28zpSDySvtFsoDAhE37zD4oKzIYD0hhhQKDpjicgqBCm8OUnlc5SrQvuoAFWRz4Mr7+E2FTQAvney/A6JCUWMol+/sc3ANFCjkAlTowZ/LFdC6SltUbqBY7xQ7wG9iMUMlno0RKuvrzAIFo1wKZKoqB4jFaPKJPOCiguC6haTD15PvzjhQcETfmQbE1X7ha+jrSTngQpWqCpVmMpH0+Mq8VLzbwXUhUGMCkT4HBxJ21OIrse10Mo8LikAsZCSaS1LkpJxogK/A6Un1gSPGpao6LP8Fy8nbmCTqYikAAAAASUVORK5CYII=",wl="assets/Kamo_Eyebrow_64px_Indexed.png";var kp="data-tk-extension-base";function Bi(e){let t=document.documentElement?.getAttribute(kp);return t?t+e:null}var et=null,Jn=null,Tp=250,Pt=null,Qn=!1,tt=null,Io=[];function Ap(){return(!et||!document.body.contains(et))&&(et=document.createElement("div"),et.className="ytls-tooltip",et.style.pointerEvents="none",document.body.appendChild(et),window.addEventListener("scroll",bl,!0),window.addEventListener("resize",bl,!0)),et}function Ep(e,t,n){let a=window.innerWidth,r=window.innerHeight,c=e.getBoundingClientRect(),s=c.width,h=c.height,m=t+10,v=n+10;m+s>a-10&&(m=t-s-10),v+h>r-10&&(v=n-h-10),m=Math.max(10,Math.min(m,a-s-10)),v=Math.max(10,Math.min(v,r-h-10)),e.style.left=`${m}px`,e.style.top=`${v}px`}function Sl(e,t){let o=window.innerWidth,a=window.innerHeight,r=t.getBoundingClientRect(),c=e.getBoundingClientRect(),s=c.width,h=c.height,m=Math.round(r.left+r.width/2-s/2),v=Math.round(r.top-h-8);v<8&&(v=Math.round(r.bottom+8)),m<8&&(m=Math.round(r.left)),m+s>o-8&&(m=Math.round(r.right-s)),m=Math.max(8,Math.min(m,o-s-8)),v=Math.max(8,Math.min(v,a-h-8)),e.style.left=`${m}px`,e.style.top=`${v}px`}function bl(){if(!(!et||!Pt)&&et.classList.contains("ytls-tooltip-visible"))try{Sl(et,Pt)}catch{}}function Ip(e=50){tt&&(clearTimeout(tt),tt=null),!Qn&&(tt=setTimeout(()=>{Mo(),tt=null},e))}function Mp(e,t,n,o){tt&&(clearTimeout(tt),tt=null),Pt&&o&&Pt!==o&&et?.classList.contains("ytls-tooltip-visible")&&et.classList.remove("ytls-tooltip-visible"),Jn&&clearTimeout(Jn),o&&(Pt=o,Qn=!0),Jn=setTimeout(()=>{let a=Ap();a.textContent=e,a.classList.remove("ytls-tooltip-visible"),o?requestAnimationFrame(()=>{Sl(a,o),requestAnimationFrame(()=>{a.classList.add("ytls-tooltip-visible")})}):(Ep(a,t,n),requestAnimationFrame(()=>{a.classList.add("ytls-tooltip-visible")}))},Tp)}function Mo(){Jn&&(clearTimeout(Jn),Jn=null),tt&&(clearTimeout(tt),tt=null),et&&et.classList.remove("ytls-tooltip-visible"),Pt=null,Qn=!1}function Di(){Mo()}function Be(e,t){let n=0,o=0,a=m=>{n=m.clientX,o=m.clientY,tt&&(clearTimeout(tt),tt=null),Qn=!0,Pt=e;let v=typeof t=="function"?t():t;v&&Mp(v,n,o,e)},r=m=>{n=m.clientX,o=m.clientY},c=()=>{Pt===e&&(Qn=!1,Ip())};e.addEventListener("mouseenter",a),e.addEventListener("mousemove",r),e.addEventListener("mouseleave",c);let s=m=>{Qn=!1,Pt===e&&Mo()};e.addEventListener("click",s,!0);let h=new MutationObserver(()=>{if(Pt===e)try{let m=window.getComputedStyle(e);(m.display==="none"||m.visibility==="hidden"||m.opacity==="0")&&Mo()}catch{}});try{h.observe(e,{attributes:!0,attributeFilter:["class","style"]})}catch{}Io.push(h),e.__tooltipCleanup=()=>{e.removeEventListener("mouseenter",a),e.removeEventListener("mousemove",r),e.removeEventListener("mouseleave",c),e.removeEventListener("click",s,!0);try{h.disconnect()}catch{}let m=Io.indexOf(h);m!==-1&&Io.splice(m,1),delete e.__tooltipObserver},e.__tooltipObserver=h}function xl(){for(let e of Io)try{e.disconnect()}catch{}Io.length=0,Mo()}var Hr={};Dd(Hr,{addTimestamp:()=>Rp,buildExportCsvPayload:()=>Fp,buildExportPayload:()=>Gp,deleteSingleTimestampFromIndexedDB:()=>Np,exportAllTimestamps:()=>Up,exportAllTimestampsCsv:()=>Vp,getRecordsChangedSince:()=>Gi,loadFromIndexedDB:()=>zi,loadGlobalSettings:()=>jt,mergeBackupData:()=>qp,mergeRemoteRecords:()=>Ui,onTimestampsWritten:()=>Fi,removeFromIndexedDB:()=>zp,saveGlobalSettings:()=>hn,saveRowsToIndexedDB:()=>_p,saveSingleTimestampToIndexedDB:()=>Hp,saveToIndexedDB:()=>Op});var Lp="ytls-timestamps-db",Cp=5,Zn="timestamps",dt="timestamps_v2",fn="settings",mn=null,eo=null;function Rr(){if(mn)try{return mn.objectStoreNames,Promise.resolve(mn)}catch(e){l("IndexedDB connection is no longer usable:",e,"warn"),mn=null}return eo||(eo=Bp().then(e=>(mn=e,eo=null,e.onclose=()=>{l("IndexedDB connection closed unexpectedly","warn"),mn=null},e.onversionchange=()=>{l("IndexedDB upgrade requested by another tab; closing this connection",null,"warn"),e.close(),mn===e&&(mn=null)},e.onerror=t=>{l("IndexedDB connection error:",t,"error")},e)).catch(e=>{throw eo=null,e}),eo)}function kl(e,t){let n=crypto.randomUUID(),o=0,a=e.openCursor();a.onsuccess=r=>{let c=r.target.result;c?(o++,c.update({...c.value,write_counter:o,device_id:n}),c.continue()):(t.put({key:"write_counter",value:o}),t.put({key:"device_id",value:n}),l(`Lamport migration: backfilled ${o} records, device_id=${n}`))},a.onerror=()=>{l("Lamport migration: cursor error during backfill",a.error,"error")}}function Bp(){return new Promise((e,t)=>{let n=indexedDB.open(Lp,Cp);n.onupgradeneeded=o=>{let a=o.target.result,r=o.oldVersion,c=o.target.transaction;if(r<1&&a.createObjectStore(Zn,{keyPath:"video_id"}),r<2&&!a.objectStoreNames.contains(fn)&&a.createObjectStore(fn,{keyPath:"key"}),r<3){if(a.objectStoreNames.contains(Zn)){l("Exporting backup before v2 migration...");let v=c.objectStore(Zn).getAll();v.onsuccess=()=>{let f=Cr.array().safeParse(v.result);if(f.success&&f.data.length>0)try{let y={},E=0;f.data.forEach(q=>{if(q.timestamps.length>0){let te=Eo.parse(q.timestamps);y[`ytls-${q.video_id}`]={video_id:q.video_id,timestamps:[...te].sort((O,j)=>O.start-j.start)},E+=te.length}});let M=new Blob([JSON.stringify(y,null,2)],{type:"application/json"}),R=URL.createObjectURL(M),U=document.createElement("a");U.href=R,U.download=`timekeeper-data-${_n()}.json`,U.click(),URL.revokeObjectURL(R),l(`Pre-migration backup exported: ${f.data.length} videos, ${E} timestamps`)}catch(y){l("Failed to export pre-migration backup:",y,"error")}else f.success||l("Skipping pre-migration backup: legacy data failed validation",f.error.message,"warn")}}let h=a.createObjectStore(dt,{keyPath:"guid"});if(h.createIndex("video_id","video_id",{unique:!1}),h.createIndex("video_start",["video_id","start"],{unique:!1}),a.objectStoreNames.contains(Zn)){let v=c.objectStore(Zn).getAll();v.onsuccess=()=>{let f=Cr.array().safeParse(v.result);if(f.success&&f.data.length>0){let y=0;f.data.forEach(E=>{E.timestamps.length>0&&E.timestamps.forEach(M=>{h.put({guid:M.guid,video_id:E.video_id,start:M.start,comment:M.comment}),y++})}),l(`Migrated ${y} timestamps from ${f.data.length} videos to v2 store`)}else f.success||l("Skipping v1 \u2192 v2 migration: legacy data failed validation",f.error.message,"warn");r<4&&kl(c.objectStore(dt),c.objectStore(fn))},a.deleteObjectStore(Zn),l("Deleted old timestamps store after migration to v2")}}r===3&&kl(c.objectStore(dt),c.objectStore(fn));let s=c.objectStore(dt);s.indexNames.contains("write_counter")||s.createIndex("write_counter","write_counter",{unique:!1})},n.onsuccess=o=>{e(o.target.result)},n.onerror=o=>{let a=o.target.error;t(a??new Error("Failed to open IndexedDB"))},n.onblocked=()=>{l("IndexedDB open is blocked by another tab holding an older connection; waiting",null,"warn")}})}function _r(e,t,n){return Rr().then(o=>new Promise((a,r)=>{let c;try{c=o.transaction(e,t)}catch(m){r(new Error(`Failed to create transaction for ${e}: ${m}`));return}let s=c.objectStore(e),h;try{h=n(s)}catch(m){r(new Error(`Failed to execute operation on ${e}: ${m}`));return}h&&(h.onsuccess=()=>a(h.result),h.onerror=()=>r(h.error??new Error(`IndexedDB ${t} operation failed`))),c.oncomplete=()=>{h||a(void 0)},c.onerror=()=>r(c.error??new Error("IndexedDB transaction failed")),c.onabort=()=>r(c.error??new Error("IndexedDB transaction aborted"))}))}var Pi=new Set;function Tl(e){return Pi.add(e),()=>Pi.delete(e)}function Dp(){for(let e of Pi)try{e()}catch(t){l("Timestamp write listener failed:",t,"error")}}function Lo(e,{silent:t=!1}={}){return Rr().then(n=>new Promise((o,a)=>{let r;try{r=n.transaction([dt,fn],"readwrite")}catch(c){a(new Error(`Failed to create transaction: ${c}`));return}r.oncomplete=()=>{o(),t||Dp()},r.onerror=()=>a(new Error(`IndexedDB write failed: ${r.error?.message??"unknown"}`)),r.onabort=()=>a(new Error(`IndexedDB transaction aborted: ${r.error?.message??"unknown"}`));try{e(r.objectStore(dt),r.objectStore(fn))}catch(c){try{r.abort()}catch{}a(c instanceof Error?c:new Error(String(c)))}}))}function Co(e,t){let n=e.get("write_counter");n.onsuccess=()=>{let o=typeof n.result?.value=="number"?n.result.value:0;e.put({key:"write_counter",value:t(o)})}}function Al(e,t){let n=Eo.safeParse(t);if(!n.success)return Promise.reject(new Error(`Invalid timestamp payload for ${e}`));let o=n.data;return Lo((a,r)=>{let c=a.index("video_id").getAll(IDBKeyRange.only(e));c.onsuccess=()=>{let s=c.result??[],h=new Map(s.map(f=>[f.guid,f])),m=new Set(o.map(f=>f.guid)),v=Date.now();Co(r,f=>{let y=f;return s.forEach(E=>{!m.has(E.guid)&&!E.deleted_at&&(y++,a.put({...E,deleted_at:v,write_counter:y}))}),o.forEach(E=>{let M=h.get(E.guid);M&&!M.deleted_at&&!E.deleted_at&&M.start===E.start&&M.comment===E.comment||(y++,a.put({guid:E.guid,video_id:e,start:E.start,comment:E.comment,write_counter:y,deleted_at:E.deleted_at??M?.deleted_at??void 0}))}),y})}})}function Ri(e,t){let n=Eo.safeParse(t);if(!n.success)return Promise.reject(new Error(`Invalid timestamp payload for ${e}`));let o=n.data;return o.length===0?Promise.resolve():Lo((a,r)=>{Co(r,c=>{let s=c;return o.forEach(h=>{s++,a.put({guid:h.guid,video_id:e,start:h.start,comment:h.comment,write_counter:s,deleted_at:h.deleted_at})}),s})})}function El(e,t){return Ri(e,[t])}function _i(e,t={}){return e.length===0?Promise.resolve():Lo((n,o)=>{Co(o,a=>{let r=a;return e.forEach(c=>{c.write_counter!==void 0&&c.write_counter>r&&(r=c.write_counter)}),e.forEach(c=>{let s={guid:c.guid,video_id:c.video_id,start:c.start,comment:c.comment,deleted_at:c.deleted_at,write_counter:c.write_counter??++r};n.put(s)}),r+1})},t)}function Il(e){return l(`Soft-deleting timestamp ${e}`),Lo((t,n)=>{let o=t.get(e);o.onsuccess=()=>{let a=o.result;a&&Co(n,r=>(t.put({...a,deleted_at:Date.now(),write_counter:r+1}),r+1))}})}function Ml(e){return Rr().then(t=>new Promise((n,o)=>{let a;try{a=t.transaction([dt],"readonly")}catch(c){let s=`Failed to create read transaction: ${c}`;l(s,c,"error"),o(new Error(s));return}a.onabort=()=>{let c=`Transaction aborted during load: ${a.error?.message??"unknown"}`;l(c,a.error,"error"),o(new Error(c))};let r=a.objectStore(dt).index("video_id").getAll(IDBKeyRange.only(e));r.onsuccess=()=>{try{let c=r.result.filter(m=>!m.deleted_at),s=[],h=0;for(let m of c){let v=Lr.safeParse({guid:m.guid,start:m.start,comment:m.comment});v.success?s.push(v.data):h++}if(h>0&&l(`Skipped ${h} stored timestamps for ${e} that failed validation`,null,"warn"),s.length===0){h>0?o(new Error(`Stored timestamps for this video failed validation (${h} rows)`)):n(null);return}n(s.sort((m,v)=>m.start-v.start))}catch(c){o(c)}},r.onerror=()=>{let c=`Failed to load timestamps from IndexedDB: ${r.error?.message??"unknown error"}`;l(c,r.error,"error"),o(new Error(c))}}))}function Ll(e){return Lo((t,n)=>{let o=t.index("video_id").getAll(IDBKeyRange.only(e));o.onsuccess=()=>{let a=o.result??[],r=Date.now();Co(n,c=>{let s=c;return a.forEach(h=>{h.deleted_at||(s++,t.put({...h,deleted_at:r,write_counter:s}))}),s})}})}function Or(){return _r(dt,"readonly",e=>e.getAll()).then(e=>Array.isArray(e)?e:[])}function Cl(e){return _r(dt,"readonly",t=>t.index("write_counter").getAll(IDBKeyRange.lowerBound(e,!0))).then(t=>Array.isArray(t)?t:[])}function Bl(e){return e.length===0?Promise.resolve([]):Rr().then(t=>new Promise((n,o)=>{let a=[],r=t.transaction(dt,"readonly"),c=r.objectStore(dt);for(let s of e)c.get(s).onsuccess=h=>{let m=h.target.result;m&&a.push(m)};r.oncomplete=()=>n(a),r.onerror=()=>o(r.error??new Error("IndexedDB read failed")),r.onabort=()=>o(r.error??new Error("IndexedDB read aborted"))}))}function Dl(e,t){return _r(fn,"readwrite",n=>{n.put({key:e,value:t})}).then(()=>{}).catch(n=>{l(`Failed to save setting '${e}' to IndexedDB:`,n,"error")})}function Pl(e){return _r(fn,"readonly",t=>t.get(e)).then(t=>t?.value).catch(t=>{l(`Failed to load setting '${e}' from IndexedDB:`,t,"error")})}async function Oi({includeDeleted:e=!1}={}){let t={},n=await Or(),o=[],a=0;for(let f of n){let y=dn.safeParse(f);y.success?o.push(y.data):a++}a>0&&l(`Skipped ${a} timestamp rows that failed validation during export`,null,"warn");let c=[...e?o:o.filter(f=>!f.deleted_at)].sort((f,y)=>{let E=f.video_id.localeCompare(y.video_id);if(E!==0)return E;let M=f.start-y.start;return M!==0?M:f.guid.localeCompare(y.guid)}),s=new Map;for(let f of c)s.has(f.video_id)||s.set(f.video_id,[]),s.get(f.video_id).push({guid:f.guid,start:f.start,comment:f.comment,write_counter:f.write_counter,deleted_at:f.deleted_at});let h=Array.from(s.keys()).sort((f,y)=>f.localeCompare(y));for(let f of h){let y=s.get(f);t[`ytls-${f}`]={video_id:f,timestamps:y}}return{json:JSON.stringify(t,null,2),filename:"timekeeper-data.json",totalVideos:s.size,totalTimestamps:c.length,invalidRows:a}}async function Ol(){try{let{json:e,filename:t,totalVideos:n,totalTimestamps:o}=await Oi(),a=new Blob([e],{type:"application/json"}),r=URL.createObjectURL(a),c=document.createElement("a");c.href=r,c.download=t,c.click(),URL.revokeObjectURL(r),l(`Exported ${n} videos with ${o} timestamps`)}catch(e){throw l("Failed to export data:",e,"error"),e}}async function Hi(){let e=dn.array().safeParse((await Or()).filter(m=>!m.deleted_at));if(!e.success||e.data.length===0){e.success||l("Failed to parse timestamp rows for CSV export:",e.error.message,"warn");let m=`Tag,Timestamp,URL
`,v=`timestamps-${_n()}.csv`;return{csv:m,filename:v,totalVideos:0,totalTimestamps:0}}let t=e.data,n=new Map;for(let m of t)n.has(m.video_id)||n.set(m.video_id,[]),n.get(m.video_id).push({start:m.start,comment:m.comment});let o=[];o.push("Tag,Timestamp,URL");let a=0,r=m=>`"${String(m).replace(/"/g,'""')}"`,c=Array.from(n.keys()).sort();for(let m of c){let v=n.get(m).sort((f,y)=>f.start-y.start);for(let f of v){let y=f.comment,E=pn(f.start,36e3),M=ml(f.start,`https://www.youtube.com/watch?v=${m}`);o.push([r(y),r(E),r(M)].join(",")),a++}}let s=o.join(`
`),h=`timestamps-${_n()}.csv`;return{csv:s,filename:h,totalVideos:n.size,totalTimestamps:a}}async function Hl(){try{let{csv:e,filename:t,totalVideos:n,totalTimestamps:o}=await Hi(),a=new Blob([e],{type:"text/csv;charset=utf-8;"}),r=URL.createObjectURL(a),c=document.createElement("a");c.href=r,c.download=t,c.click(),URL.revokeObjectURL(r),l(`Exported ${n} videos with ${o} timestamps (CSV)`)}catch(e){throw l("Failed to export CSV data:",e,"error"),e}}async function Ni(e,t){if(!e)throw new Error("Video ID is required");if(!t.guid||t.start==null)throw new Error("Timestamp must have GUID and start time");return El(e,t)}async function Nl(e,t){if(!e)throw new Error("Video ID is required");return Ri(e,t)}async function zl(e,t){if(!e)throw new Error("Video ID is required");if(!Array.isArray(t))throw new Error("Timestamps must be an array");return Al(e,t)}async function Gl(e){if(!e)throw new Error("GUID is required");return Il(e)}async function Ul(e){if(!e)throw new Error("Video ID is required");return Ll(e)}async function Fl(e){if(!e)throw new Error("Video ID is required");return Ml(e)}async function Vl(e){let t;try{t=JSON.parse(e)}catch{return l("mergeBackupData: failed to parse JSON",null,"warn"),{mergedVideos:0,mergedTimestamps:0}}let n=Ls.safeParse(t);if(!n.success)return l("mergeBackupData: data failed validation",n.error.message,"warn"),{mergedVideos:0,mergedTimestamps:0};let o=await Or(),a=new Map;for(let h of o)a.set(h.guid,h);let r=0,c=0,s=[];for(let[,h]of Object.entries(n.data)){let{video_id:m,timestamps:v}=h,f=0;for(let y of v){let E=a.get(y.guid);ql(E,m,y)&&(s.push({guid:y.guid,video_id:m,start:y.start,comment:y.comment,write_counter:y.write_counter,deleted_at:y.deleted_at}),a.set(y.guid,{...E??{},guid:y.guid,video_id:m,start:y.start,comment:y.comment,write_counter:y.write_counter,deleted_at:y.deleted_at}),f++,c++)}f>0&&r++}return await _i(s),{mergedVideos:r,mergedTimestamps:c}}function _l(e,t){return JSON.stringify([e,t.start,t.comment,t.deleted_at??null])}function ql(e,t,n){return e?e.write_counter===void 0||n.write_counter===void 0?!1:n.write_counter!==e.write_counter?n.write_counter>e.write_counter:_l(t,n)>_l(e.video_id,e):!0}async function jl(e){let t=[];for(let n of await Cl(e)){let o=dn.safeParse(n);if(!o.success||o.data.write_counter===void 0)continue;let{guid:a,video_id:r,start:c,comment:s,write_counter:h,deleted_at:m}=o.data;t.push({guid:a,video_id:r,start:c,comment:s,write_counter:h,...m!==void 0?{deleted_at:m}:{}})}return t}async function $l(e){let t=new Map;for(let a of await Bl(e.map(r=>r.guid)))t.set(a.guid,a);let n=[],o=new Set;for(let a of e)ql(t.get(a.guid),a.video_id,a)&&(n.push(a),o.add(a.video_id));return await _i(n,{silent:!0}),{mergedVideos:o.size,mergedTimestamps:n.length}}function Wl(e,t){if(!e)throw new Error("Setting key is required");return Dl(e,t)}async function Kl(e){if(!e)throw new Error("Setting key is required");return Pl(e)}function Rp(e,t){return Ni(e,t)}function _p(e,t){return Nl(e,t)}function Op(e,t){return zl(e,t)}function Hp(e,t){return Ni(e,t)}function zi(e){return Fl(e)}function Np(e,t){return Gl(t)}function zp(e){return Ul(e)}function hn(e,t){return Wl(e,t)}function jt(e){return Kl(e)}function Gp(e){return Oi(e)}function Up(){return Ol()}function Fp(){return Hi()}function Vp(){return Hl()}function qp(e){return Vl(e)}function Gi(e){return jl(e)}function Ui(e){return $l(e)}function Fi(e){return Tl(e)}function Nr(e){return e?Array.from(e.querySelectorAll("li:not(.ytls-placeholder):not(.ytls-error-message)")):[]}function zr(e){if(!e)return;e.replaceChildren();let t=e.querySelector(".ytls-error-message");t&&t.remove()}function Vi(e,t){if(!e)return;zr(e);let n=document.createElement("li");n.className="ytls-placeholder",n.textContent=t,e.appendChild(n),e.style.overflowY="hidden"}function Yl(e){if(!e)return;let t=e.querySelector(".ytls-placeholder");t&&t.remove(),e.style.overflowY=""}function Bo(e){return e?e.querySelector(".ytls-error-message")!==null:!1}function Xl(e,t){if(!e)return;zr(e);let n=document.createElement("li");n.className="ytls-error-message",n.style.cssText=`
    color: #ff4d4f;
    text-align: center;
    padding: 16px;
    background: rgba(255, 0, 0, 0.08);
    border: 1px solid rgba(255, 77, 79, 0.3);
    border-radius: 6px;
    margin: 8px;
    font-weight: 600;
    font-size: 14px;
    line-height: 1.5;
  `;let o=document.createElement("div");o.style.marginBottom="8px",o.textContent=`\u26A0\uFE0F ${t}`;let a=document.createElement("div");a.style.cssText="font-size:12px;font-weight:normal;color:#aaa",a.textContent="Check the console for details or refresh the page.",n.append(o,a),e.appendChild(n),e.style.overflowY="hidden"}function Jl(e){if(!e)return;let t=e.querySelector(".ytls-error-message");t&&t.remove()}function Ql(e,t){if(!e||t||Bo(e))return;Array.from(e.children).some(o=>!o.classList.contains("ytls-placeholder")&&!o.classList.contains("ytls-error-message"))||Vi(e,"No timestamps for this video")}function Zl(e){if(!e)return[];let t=Nr(e),n=[];return t.forEach(o=>{let a=o.querySelector("[data-time]"),r=o.querySelector("input"),c=o.dataset.guid;if(!a||!r||!c)return;let s=a.dataset.time;if(!s)return;let h=Number.parseInt(s,10);Number.isFinite(h)&&n.push({guid:c,start:h,comment:r.value})}),n.sort((o,a)=>o.start-a.start)}function ec(e){if(!e)return 0;let t=Nr(e),n=0;return t.forEach(o=>{let r=o.querySelector("[data-time]")?.dataset.time;if(r){let c=Number.parseInt(r,10);Number.isFinite(c)&&(n=Math.max(n,c))}}),n}var $p={auth:{googleAuthState:{isSignedIn:!1,accessToken:null,userName:null,email:null},syncAuthState:Xn,autoBackupEnabled:!0,autoBackupIntervalMinutes:30,autoBackupRetryAttempts:0,autoBackupBackoffMs:null,lastAutoBackupAt:null,isAutoBackupRunning:!1,autoBackupFailed:!1},ui:{panePosition:null,currentVideoId:"",minPaneHeight:250,lastHandledUrl:null,urlChangeHandlersSetup:!1},timestamps:{items:[],currentIndex:null,dbError:null}},it=JSON.parse(JSON.stringify($p));function at(){return it}function Gr(e){it={...it,...e,auth:{...it.auth,...e.auth||{}},ui:{...it.ui,...e.ui||{}},timestamps:{...it.timestamps,...e.timestamps||{}}}}function $t(e,t){Gr({auth:{...it.auth,[e]:t}})}function Ur(e,t){Gr({ui:{...it.ui,[e]:t}})}function Rt(){return it.auth.googleAuthState}function At(e){$t("googleAuthState",e)}function tc(){return it.auth.syncAuthState}function to(e){$t("syncAuthState",e)}function qi(e){$t("autoBackupEnabled",e)}function ji(e){$t("autoBackupIntervalMinutes",e)}function $i(e){$t("isAutoBackupRunning",e)}function Fr(e){$t("autoBackupFailed",e)}function Wi(e){$t("autoBackupRetryAttempts",e)}function Ki(e){$t("autoBackupBackoffMs",e)}function Yi(e){$t("lastAutoBackupAt",e)}function nc(e){Ur("minPaneHeight",e)}function oc(e){Ur("panePosition",e)}function rc(e){Ur("lastHandledUrl",e)}function ic(e){Ur("urlChangeHandlersSetup",e)}function ac(e){Gr({timestamps:{...it.timestamps,items:e}})}function Xi(e){Gr({timestamps:{...it.timestamps,dbError:e}})}function sc(){return it.timestamps.dbError}var On=typeof unsafeWindow<"u"?unsafeWindow:window,mc=43200*14,lc="html5_max_live_dvr_window_plus_margin_secs";function Wt(e){return e!=null&&typeof e=="object"}function cc(e){let{streamingData:t,videoDetails:n,playerConfig:o,microformat:a}=e;if(!Wt(n)||!n.isLive)return;let r=n.isLiveDvrEnabled===!0;if(n.isLiveDvrEnabled=!0,!r&&Wt(o)){let c=o.mediaCommonConfig;if(Wt(c)){c.useServerDrivenAbr=!1;let s=c.serverPlaybackStartConfig;Wt(s)&&(s.enable=!1)}}if(Wt(t)){let c=t;if(Array.isArray(c.adaptiveFormats)&&Wp(a))for(let s of c.adaptiveFormats)s.maxDvrDurationSec=mc}}function Wp(e){if(!Wt(e))return!1;let t=e.playerMicroformatRenderer;if(!Wt(t))return!1;let n=t.liveBroadcastDetails;if(!Wt(n))return!1;let o=n.startTimestamp;return!o||typeof o!="string"?!1:(Date.now()-new Date(o).getTime())/1e3>43200}function Qi(e){if(!e||typeof e!="object")return!1;let t=e;return t.videoDetails?(cc(t),!0):t.playerResponse&&Wt(t.playerResponse)&&t.playerResponse.videoDetails?(cc(t.playerResponse),!0):!1}function Kp(){let e=Object.getOwnPropertyDescriptor(On,"ytInitialPlayerResponse"),t=e&&e.set,n=On.ytInitialPlayerResponse;if(!Qi(n))try{Object.defineProperty(On,"ytInitialPlayerResponse",{configurable:!0,get(){return n},set(o){t&&t.call(this,o),n=o,Qi(o)&&Object.defineProperty(On,"ytInitialPlayerResponse",{configurable:!0,writable:!0,value:o})}})}catch{}}var uc=!1;function Yp(){if(uc)return;uc=!0;let e=JSON.parse;JSON.parse=function(t,n){let o=e.call(this,t,n);try{Qi(o)}catch{}return o}}function dc(e){if(e.__dvrCapLifted)return;let n=(typeof e.d=="function"?e.d():void 0)?.WEB_PLAYER_CONTEXT_CONFIGS;if(!n)return;let o=n;for(let a in o){let r=o[a];if(r&&typeof r.serializedExperimentFlags=="string"){let c=r.serializedExperimentFlags,s=c.replace(new RegExp(`${lc}=[\\d.]+`),`${lc}=${mc}`);s!==c&&(r.serializedExperimentFlags=s)}}e.__dvrCapLifted=!0}function pc(e){if(!e||e.__dvrHooked)return e;e.__dvrHooked=!0;let t=e.set;typeof t=="function"&&(e.set=function(...n){let o=t.apply(this,n);try{dc(e)}catch{}return o});try{dc(e)}catch{}return e}function Xp(){let e={};On.ytcfg&&(e=pc(On.ytcfg));try{Object.defineProperty(On,"ytcfg",{configurable:!0,get(){return e},set(t){e=pc(t)}})}catch{}}function fc(){Kp(),Yp(),Xp(),l("[Timekeeper] DVR/Rewind enablement initialized for live streams")}var Jp="BADGE_STYLE_TYPE_MEMBERS_ONLY";function Do(e){return typeof e=="object"&&e!==null}function hc(e,t=0){return!Do(e)||t>8?!1:e.style===Jp?!0:Object.values(e).some(n=>hc(n,t+1))}function gc(e,t){let n=Do(t)?t.videoDetails:void 0;if(!Do(n)||typeof n.videoId!="string"||typeof n.channelId!="string")return null;let o=e?.contents?.twoColumnWatchNextResults?.results?.results?.contents;if(!Array.isArray(o))return null;let a=o.find(r=>Do(r)&&Do(r.videoPrimaryInfoRenderer));return a?{videoId:n.videoId,channelId:n.channelId,membersOnly:hc(a.videoPrimaryInfoRenderer)}:null}var Zi="#author-name, #author-text";function yc(){return window.top!==window.self&&window.location.pathname.startsWith("/live_chat")}function ea(e){let t=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);for(let n=t.nextNode();n;n=t.nextNode()){let o=n.nodeValue??"";if(o.trim()){/^\s*@/.test(o)&&(n.nodeValue=o.replace(/^(\s*)@/,"$1"));return}}}function ta(e){if(e.nodeType===Node.TEXT_NODE){let t=e.parentElement?.closest(Zi);t&&ea(t);return}e instanceof Element&&(e.matches(Zi)&&ea(e),e.querySelectorAll(Zi).forEach(ea))}function vc(){let e=new MutationObserver(t=>{for(let n of t)n.type==="characterData"?ta(n.target):n.addedNodes.forEach(ta)});document.documentElement&&ta(document.documentElement),e.observe(document,{childList:!0,subtree:!0,characterData:!0})}var ye=Uint8Array,st=Uint16Array,pa=Int32Array,Vr=new ye([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),qr=new ye([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),aa=new ye([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Ac=function(e,t){for(var n=new st(31),o=0;o<31;++o)n[o]=t+=1<<e[o-1];for(var a=new pa(n[30]),o=1;o<30;++o)for(var r=n[o];r<n[o+1];++r)a[r]=r-n[o]<<5|o;return{b:n,r:a}},Ec=Ac(Vr,2),Ic=Ec.b,sa=Ec.r;Ic[28]=258,sa[258]=28;var Mc=Ac(qr,0),Qp=Mc.b,wc=Mc.r,la=new st(32768);for(X=0;X<32768;++X)Kt=(X&43690)>>1|(X&21845)<<1,Kt=(Kt&52428)>>2|(Kt&13107)<<2,Kt=(Kt&61680)>>4|(Kt&3855)<<4,la[X]=((Kt&65280)>>8|(Kt&255)<<8)>>1;var Kt,X,Ot=(function(e,t,n){for(var o=e.length,a=0,r=new st(t);a<o;++a)e[a]&&++r[e[a]-1];var c=new st(t);for(a=1;a<t;++a)c[a]=c[a-1]+r[a-1]<<1;var s;if(n){s=new st(1<<t);var h=15-t;for(a=0;a<o;++a)if(e[a])for(var m=a<<4|e[a],v=t-e[a],f=c[e[a]-1]++<<v,y=f|(1<<v)-1;f<=y;++f)s[la[f]>>h]=m}else for(s=new st(o),a=0;a<o;++a)e[a]&&(s[a]=la[c[e[a]-1]++]>>15-e[a]);return s}),gn=new ye(288);for(X=0;X<144;++X)gn[X]=8;var X;for(X=144;X<256;++X)gn[X]=9;var X;for(X=256;X<280;++X)gn[X]=7;var X;for(X=280;X<288;++X)gn[X]=8;var X,_o=new ye(32);for(X=0;X<32;++X)_o[X]=5;var X,Zp=Ot(gn,9,0),em=Ot(gn,9,1),tm=Ot(_o,5,0),nm=Ot(_o,5,1),na=function(e){for(var t=e[0],n=1;n<e.length;++n)e[n]>t&&(t=e[n]);return t},Et=function(e,t,n){var o=t/8|0;return(e[o]|e[o+1]<<8)>>(t&7)&n},oa=function(e,t){var n=t/8|0;return(e[n]|e[n+1]<<8|e[n+2]<<16)>>(t&7)},ma=function(e){return(e+7)/8|0},Oo=function(e,t,n){return(t==null||t<0)&&(t=0),(n==null||n>e.length)&&(n=e.length),new ye(e.subarray(t,n))};var om=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],Ue=function(e,t,n){var o=new Error(t||om[e]);if(o.code=e,Error.captureStackTrace&&Error.captureStackTrace(o,Ue),!n)throw o;return o},rm=function(e,t,n,o){var a=e.length,r=o?o.length:0;if(!a||t.f&&!t.l)return n||new ye(0);var c=!n,s=c||t.i!=2,h=t.i;c&&(n=new ye(a*3));var m=function(An){var En=n.length;if(An>En){var Ht=new ye(Math.max(En*2,An));Ht.set(n),n=Ht}},v=t.f||0,f=t.p||0,y=t.b||0,E=t.l,M=t.d,R=t.m,U=t.n,q=a*8;do{if(!E){v=Et(e,f,1);var te=Et(e,f+1,3);if(f+=3,te)if(te==1)E=em,M=nm,R=9,U=5;else if(te==2){var ve=Et(e,f,31)+257,de=Et(e,f+10,15)+4,F=ve+Et(e,f+5,31)+1;f+=14;for(var D=new ye(F),pe=new ye(19),me=0;me<de;++me)pe[aa[me]]=Et(e,f+me*3,7);f+=de*3;for(var fe=na(pe),lt=(1<<fe)-1,Ee=Ot(pe,fe,1),me=0;me<F;){var Le=Ee[Et(e,f,lt)];f+=Le&15;var O=Le>>4;if(O<16)D[me++]=O;else{var xe=0,ce=0;for(O==16?(ce=3+Et(e,f,3),f+=2,xe=D[me-1]):O==17?(ce=3+Et(e,f,7),f+=3):O==18&&(ce=11+Et(e,f,127),f+=7);ce--;)D[me++]=xe}}var Ne=D.subarray(0,ve),ke=D.subarray(ve);R=na(Ne),U=na(ke),E=Ot(Ne,R,1),M=Ot(ke,U,1)}else Ue(1);else{var O=ma(f)+4,j=e[O-4]|e[O-3]<<8,le=O+j;if(le>a){h&&Ue(0);break}s&&m(y+j),n.set(e.subarray(O,le),y),t.b=y+=j,t.p=f=le*8,t.f=v;continue}if(f>q){h&&Ue(0);break}}s&&m(y+131072);for(var kn=(1<<R)-1,De=(1<<U)-1,ze=f;;ze=f){var xe=E[oa(e,f)&kn],Te=xe>>4;if(f+=xe&15,f>q){h&&Ue(0);break}if(xe||Ue(2),Te<256)n[y++]=Te;else if(Te==256){ze=f,E=null;break}else{var he=Te-254;if(Te>264){var me=Te-257,$=Vr[me];he=Et(e,f,(1<<$)-1)+Ic[me],f+=$}var Z=M[oa(e,f)&De],We=Z>>4;Z||Ue(3),f+=Z&15;var ke=Qp[We];if(We>3){var $=qr[We];ke+=oa(e,f)&(1<<$)-1,f+=$}if(f>q){h&&Ue(0);break}s&&m(y+131072);var Pe=y+he;if(y<ke){var Gn=r-ke,Tn=Math.min(ke,Pe);for(Gn+y<0&&Ue(3);y<Tn;++y)n[y]=o[Gn+y]}for(;y<Pe;++y)n[y]=n[y-ke]}}t.l=E,t.p=ze,t.b=y,t.f=v,E&&(v=1,t.m=R,t.d=M,t.n=U)}while(!v);return y!=n.length&&c?Oo(n,0,y):n.subarray(0,y)},Yt=function(e,t,n){n<<=t&7;var o=t/8|0;e[o]|=n,e[o+1]|=n>>8},Po=function(e,t,n){n<<=t&7;var o=t/8|0;e[o]|=n,e[o+1]|=n>>8,e[o+2]|=n>>16},ra=function(e,t){for(var n=[],o=0;o<e.length;++o)e[o]&&n.push({s:o,f:e[o]});var a=n.length,r=n.slice();if(!a)return{t:Cc,l:0};if(a==1){var c=new ye(n[0].s+1);return c[n[0].s]=1,{t:c,l:1}}n.sort(function(le,ve){return le.f-ve.f}),n.push({s:-1,f:25001});var s=n[0],h=n[1],m=0,v=1,f=2;for(n[0]={s:-1,f:s.f+h.f,l:s,r:h};v!=a-1;)s=n[n[m].f<n[f].f?m++:f++],h=n[m!=v&&n[m].f<n[f].f?m++:f++],n[v++]={s:-1,f:s.f+h.f,l:s,r:h};for(var y=r[0].s,o=1;o<a;++o)r[o].s>y&&(y=r[o].s);var E=new st(y+1),M=ca(n[v-1],E,0);if(M>t){var o=0,R=0,U=M-t,q=1<<U;for(r.sort(function(ve,de){return E[de.s]-E[ve.s]||ve.f-de.f});o<a;++o){var te=r[o].s;if(E[te]>t)R+=q-(1<<M-E[te]),E[te]=t;else break}for(R>>=U;R>0;){var O=r[o].s;E[O]<t?R-=1<<t-E[O]++-1:++o}for(;o>=0&&R;--o){var j=r[o].s;E[j]==t&&(--E[j],++R)}M=t}return{t:new ye(E),l:M}},ca=function(e,t,n){return e.s==-1?Math.max(ca(e.l,t,n+1),ca(e.r,t,n+1)):t[e.s]=n},bc=function(e){for(var t=e.length;t&&!e[--t];);for(var n=new st(++t),o=0,a=e[0],r=1,c=function(h){n[o++]=h},s=1;s<=t;++s)if(e[s]==a&&s!=t)++r;else{if(!a&&r>2){for(;r>138;r-=138)c(32754);r>2&&(c(r>10?r-11<<5|28690:r-3<<5|12305),r=0)}else if(r>3){for(c(a),--r;r>6;r-=6)c(8304);r>2&&(c(r-3<<5|8208),r=0)}for(;r--;)c(a);r=1,a=e[s]}return{c:n.subarray(0,o),n:t}},Ro=function(e,t){for(var n=0,o=0;o<t.length;++o)n+=e[o]*t[o];return n},Lc=function(e,t,n){var o=n.length,a=ma(t+2);e[a]=o&255,e[a+1]=o>>8,e[a+2]=e[a]^255,e[a+3]=e[a+1]^255;for(var r=0;r<o;++r)e[a+r+4]=n[r];return(a+4+o)*8},Sc=function(e,t,n,o,a,r,c,s,h,m,v){Yt(t,v++,n),++a[256];for(var f=ra(a,15),y=f.t,E=f.l,M=ra(r,15),R=M.t,U=M.l,q=bc(y),te=q.c,O=q.n,j=bc(R),le=j.c,ve=j.n,de=new st(19),F=0;F<te.length;++F)++de[te[F]&31];for(var F=0;F<le.length;++F)++de[le[F]&31];for(var D=ra(de,7),pe=D.t,me=D.l,fe=19;fe>4&&!pe[aa[fe-1]];--fe);var lt=m+5<<3,Ee=Ro(a,gn)+Ro(r,_o)+c,Le=Ro(a,y)+Ro(r,R)+c+14+3*fe+Ro(de,pe)+2*de[16]+3*de[17]+7*de[18];if(h>=0&&lt<=Ee&&lt<=Le)return Lc(t,v,e.subarray(h,h+m));var xe,ce,Ne,ke;if(Yt(t,v,1+(Le<Ee)),v+=2,Le<Ee){xe=Ot(y,E,0),ce=y,Ne=Ot(R,U,0),ke=R;var kn=Ot(pe,me,0);Yt(t,v,O-257),Yt(t,v+5,ve-1),Yt(t,v+10,fe-4),v+=14;for(var F=0;F<fe;++F)Yt(t,v+3*F,pe[aa[F]]);v+=3*fe;for(var De=[te,le],ze=0;ze<2;++ze)for(var Te=De[ze],F=0;F<Te.length;++F){var he=Te[F]&31;Yt(t,v,kn[he]),v+=pe[he],he>15&&(Yt(t,v,Te[F]>>5&127),v+=Te[F]>>12)}}else xe=Zp,ce=gn,Ne=tm,ke=_o;for(var F=0;F<s;++F){var $=o[F];if($>255){var he=$>>18&31;Po(t,v,xe[he+257]),v+=ce[he+257],he>7&&(Yt(t,v,$>>23&31),v+=Vr[he]);var Z=$&31;Po(t,v,Ne[Z]),v+=ke[Z],Z>3&&(Po(t,v,$>>5&8191),v+=qr[Z])}else Po(t,v,xe[$]),v+=ce[$]}return Po(t,v,xe[256]),v+ce[256]},im=new pa([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),Cc=new ye(0),am=function(e,t,n,o,a,r){var c=r.z||e.length,s=new ye(o+c+5*(1+Math.ceil(c/7e3))+a),h=s.subarray(o,s.length-a),m=r.l,v=(r.r||0)&7;if(t){v&&(h[0]=r.r>>3);for(var f=im[t-1],y=f>>13,E=f&8191,M=(1<<n)-1,R=r.p||new st(32768),U=r.h||new st(M+1),q=Math.ceil(n/3),te=2*q,O=function(Re){return(e[Re]^e[Re+1]<<q^e[Re+2]<<te)&M},j=new pa(25e3),le=new st(288),ve=new st(32),de=0,F=0,D=r.i||0,pe=0,me=r.w||0,fe=0;D+2<c;++D){var lt=O(D),Ee=D&32767,Le=U[lt];if(R[Ee]=Le,U[lt]=Ee,me<=D){var xe=c-D;if((de>7e3||pe>24576)&&(xe>423||!m)){v=Sc(e,h,0,j,le,ve,F,pe,fe,D-fe,v),pe=de=F=0,fe=D;for(var ce=0;ce<286;++ce)le[ce]=0;for(var ce=0;ce<30;++ce)ve[ce]=0}var Ne=2,ke=0,kn=E,De=Ee-Le&32767;if(xe>2&&lt==O(D-De))for(var ze=Math.min(y,xe)-1,Te=Math.min(32767,D),he=Math.min(258,xe);De<=Te&&--kn&&Ee!=Le;){if(e[D+Ne]==e[D+Ne-De]){for(var $=0;$<he&&e[D+$]==e[D+$-De];++$);if($>Ne){if(Ne=$,ke=De,$>ze)break;for(var Z=Math.min(De,$-2),We=0,ce=0;ce<Z;++ce){var Pe=D-De+ce&32767,Gn=R[Pe],Tn=Pe-Gn&32767;Tn>We&&(We=Tn,Le=Pe)}}}Ee=Le,Le=R[Ee],De+=Ee-Le&32767}if(ke){j[pe++]=268435456|sa[Ne]<<18|wc[ke];var An=sa[Ne]&31,En=wc[ke]&31;F+=Vr[An]+qr[En],++le[257+An],++ve[En],me=D+Ne,++de}else j[pe++]=e[D],++le[e[D]]}}for(D=Math.max(D,me);D<c;++D)j[pe++]=e[D],++le[e[D]];v=Sc(e,h,m,j,le,ve,F,pe,fe,D-fe,v),m||(r.r=v&7|h[v/8|0]<<3,v-=7,r.h=U,r.p=R,r.i=D,r.w=me)}else{for(var D=r.w||0;D<c+m;D+=65535){var Ht=D+65535;Ht>=c&&(h[v/8|0]=m,Ht=c),v=Lc(h,v+1,e.subarray(D,Ht))}r.i=c}return Oo(s,0,o+ma(v)+a)},sm=(function(){for(var e=new Int32Array(256),t=0;t<256;++t){for(var n=t,o=9;--o;)n=(n&1&&-306674912)^n>>>1;e[t]=n}return e})(),lm=function(){var e=-1;return{p:function(t){for(var n=e,o=0;o<t.length;++o)n=sm[n&255^t[o]]^n>>>8;e=n},d:function(){return~e}}};var cm=function(e,t,n,o,a){if(!a&&(a={l:1},t.dictionary)){var r=t.dictionary.subarray(-32768),c=new ye(r.length+e.length);c.set(r),c.set(e,r.length),e=c,a.w=r.length}return am(e,t.level==null?6:t.level,t.mem==null?a.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+t.mem,n,o,a)},Bc=function(e,t){var n={};for(var o in e)n[o]=e[o];for(var o in t)n[o]=t[o];return n};var _t=function(e,t){return e[t]|e[t+1]<<8},pt=function(e,t){return(e[t]|e[t+1]<<8|e[t+2]<<16|e[t+3]<<24)>>>0},ia=function(e,t){return pt(e,t)+pt(e,t+4)*4294967296},He=function(e,t,n){for(;n;++t)e[t]=n,n>>>=8};function um(e,t){return cm(e,t||{},0,0)}function dm(e,t){return rm(e,{i:2},t&&t.out,t&&t.dictionary)}var Dc=function(e,t,n,o){for(var a in e){var r=e[a],c=t+a,s=o;Array.isArray(r)&&(s=Bc(o,r[1]),r=r[0]),ArrayBuffer.isView(r)?n[c]=[r,s]:(n[c+="/"]=[new ye(0),s],Dc(r,c,n,o))}},xc=typeof TextEncoder<"u"&&new TextEncoder,ua=typeof TextDecoder<"u"&&new TextDecoder,pm=0;try{ua.decode(Cc,{stream:!0}),pm=1}catch{}var mm=function(e){for(var t="",n=0;;){var o=e[n++],a=(o>127)+(o>223)+(o>239);if(n+a>e.length)return{s:t,r:Oo(e,n-1)};a?a==3?(o=((o&15)<<18|(e[n++]&63)<<12|(e[n++]&63)<<6|e[n++]&63)-65536,t+=String.fromCharCode(55296|o>>10,56320|o&1023)):a&1?t+=String.fromCharCode((o&31)<<6|e[n++]&63):t+=String.fromCharCode((o&15)<<12|(e[n++]&63)<<6|e[n++]&63):t+=String.fromCharCode(o)}};function kc(e,t){if(t){for(var n=new ye(e.length),o=0;o<e.length;++o)n[o]=e.charCodeAt(o);return n}if(xc)return xc.encode(e);for(var a=e.length,r=new ye(e.length+(e.length>>1)),c=0,s=function(v){r[c++]=v},o=0;o<a;++o){if(c+5>r.length){var h=new ye(c+8+(a-o<<1));h.set(r),r=h}var m=e.charCodeAt(o);m<128||t?s(m):m<2048?(s(192|m>>6),s(128|m&63)):m>55295&&m<57344?(m=65536+(m&1047552)|e.charCodeAt(++o)&1023,s(240|m>>18),s(128|m>>12&63),s(128|m>>6&63),s(128|m&63)):(s(224|m>>12),s(128|m>>6&63),s(128|m&63))}return Oo(r,0,c)}function fm(e,t){if(t){for(var n="",o=0;o<e.length;o+=16384)n+=String.fromCharCode.apply(null,e.subarray(o,o+16384));return n}else{if(ua)return ua.decode(e);var a=mm(e),r=a.s,n=a.r;return n.length&&Ue(8),r}}var hm=function(e,t){return t+30+_t(e,t+26)+_t(e,t+28)},gm=function(e,t,n){var o=_t(e,t+28),a=_t(e,t+30),r=fm(e.subarray(t+46,t+46+o),!(_t(e,t+8)&2048)),c=t+46+o,s=ym(e,c,a,n,pt(e,t+20),pt(e,t+24),pt(e,t+42)),h=s[0],m=s[1],v=s[2];return[_t(e,t+10),h,m,r,c+a+_t(e,t+32),v]},ym=function(e,t,n,o,a,r,c){var s=a==4294967295,h=r==4294967295,m=c==4294967295,v=t+n,f=s+h+m;if(o&&f){for(;t+4<v;t+=4+_t(e,t+2))if(_t(e,t)==1)return[s?ia(e,t+4+8*h):a,h?ia(e,t+4):r,m?ia(e,t+4+8*(h+s)):c,1];o<2&&Ue(13)}return[a,r,c,0]},da=function(e){var t=0;if(e)for(var n in e){var o=e[n].length;o>65535&&Ue(9),t+=o+4}return t},Tc=function(e,t,n,o,a,r,c,s){var h=o.length,m=n.extra,v=s&&s.length,f=da(m);He(e,t,c!=null?33639248:67324752),t+=4,c!=null&&(e[t++]=20,e[t++]=n.os),e[t]=20,t+=2,e[t++]=n.flag<<1|(r<0&&8),e[t++]=a&&8,e[t++]=n.compression&255,e[t++]=n.compression>>8;var y=new Date(n.mtime==null?Date.now():n.mtime),E=y.getFullYear()-1980;if((E<0||E>119)&&Ue(10),He(e,t,E<<25|y.getMonth()+1<<21|y.getDate()<<16|y.getHours()<<11|y.getMinutes()<<5|y.getSeconds()>>1),t+=4,r!=-1&&(He(e,t,n.crc),He(e,t+4,r<0?-r-2:r),He(e,t+8,n.size)),He(e,t+12,h),He(e,t+14,f),t+=16,c!=null&&(He(e,t,v),He(e,t+6,n.attrs),He(e,t+10,c),t+=14),e.set(o,t),t+=h,f)for(var M in m){var R=m[M],U=R.length;He(e,t,+M),He(e,t+2,U),e.set(R,t+4),t+=4+U}return v&&(e.set(s,t),t+=v),t},vm=function(e,t,n,o,a){He(e,t,101010256),He(e,t+8,n),He(e,t+10,n),He(e,t+12,o),He(e,t+16,a)};function Pc(e,t){t||(t={});var n={},o=[];Dc(e,"",n,t);var a=0,r=0;for(var c in n){var s=n[c],h=s[0],m=s[1],v=m.level==0?0:8,f=kc(c),y=f.length,E=m.comment,M=E&&kc(E),R=M&&M.length,U=da(m.extra);y>65535&&Ue(11);var q=v?um(h,m):h,te=q.length,O=lm();O.p(h),o.push(Bc(m,{size:h.length,crc:O.d(),c:q,f,m:M,u:y!=c.length||M&&E.length!=R,o:a,compression:v})),a+=30+y+U+te,r+=76+2*(y+U)+(R||0)+te}for(var j=new ye(r+22),le=a,ve=r-a,de=0;de<o.length;++de){var f=o[de];Tc(j,f.o,f,f.f,f.u,f.c.length);var F=30+f.f.length+da(f.extra);j.set(f.c,f.o+F),Tc(j,a,f,f.f,f.u,f.c.length,f.o,f.m),a+=16+F+(f.m?f.m.length:0)}return vm(j,a,o.length,ve,le),j}function Rc(e,t){for(var n={},o=e.length-22;pt(e,o)!=101010256;--o)(!o||e.length-o>65558)&&Ue(13);var a=_t(e,o+8);if(!a)return{};var r=pt(e,o+16),c=pt(e,o-20)==117853008;if(c){var s=pt(e,o-12);c=pt(e,s)==101075792,c&&(a=pt(e,s+32),r=pt(e,s+48))}for(var h=t&&t.filter,m=0;m<a;++m){var v=gm(e,r,c),f=v[0],y=v[1],E=v[2],M=v[3],R=v[4],U=v[5],q=hm(e,U);r=R,(!h||h({name:M,size:y,originalSize:E,compression:f}))&&(f?f==8?n[M]=dm(e.subarray(q,q+y),{out:new ye(E)}):Ue(14,"unknown compression type "+f):n[M]=Oo(e,q,q+y))}return n}var Zr="https://ash.kamotimestamps.com",Fc="308989572223-cdnvpn65mc51oqneu7po3og51uf5ahsb.apps.googleusercontent.com",wm="https://www.youtube.com/",Vc="timekeeper_sync_auth",qc="timekeeper_sync_oauth",Hn="syncAuthState",jc="syncCursors",bm=500,Sm=5e3,_c=200,xm=500,km=60*1e3,Tm=60*1e3,Am=300*1e3;function Nn(){return!!(Zr&&Fc)}var $c=Se({accessToken:K(),accessTokenExpiresAt:Me({finite:!0}),refreshToken:K(),user:Se({id:K(),email:K(),displayName:Ze(K())})}),Em=Se({records:dn.array(),seq:Me({int:!0,nonnegative:!0}),hasMore:Dt()}),Im=Se({known:Dt(),membersOnly:Ze(Dt()),channelId:Ze(K())}),Mm=Se({rejected:dn.array(),fromSeq:Me({int:!0,nonnegative:!0}),seq:Me({int:!0,nonnegative:!0})}),Lm=Se({type:K(),seq:be(Me({int:!0,nonnegative:!0})),fromSeq:be(Me({int:!0,nonnegative:!0})),records:be(dn.array())}),Cm=Se({type:K(),idToken:be(K()),error:be(K())}),wn=class extends Error{},Yr=class extends Error{constructor(n,o){super(o);this.httpStatus=n}},Bm=e=>e instanceof Yr&&e.httpStatus>=400&&e.httpStatus<500&&e.httpStatus!==408&&e.httpStatus!==429,oo={kind:"signed-out"},Xr="idle",fa=null,ro=new Set,Wc=new Map,No=new Map,Xt=null,vn=null,ei=0,no=null,Oc=0,Qt=!0,Ho=null,wa=0,ha=null,Hc=!1,je={pushCounter:0,pullSeq:0},ba=new Map,Nc=Promise.resolve(),Wr=!1,jr=null,Jr="",ti=null,Kc=null,ga=null,Kr=null,Yc=null;function $e(){return tc()}function Xc(e){Kc=e}function Jc(e){ga=e}function Qc(e){Kr=e}function Zc(e){Yc=e}var eu="#52c41a",tu="#ff4d4f",yn="#ffa500";function zo(){let e=$e();if(ga){let t=ga;if(t.style.fontWeight="bold",t.onmouseenter=null,t.onmouseleave=null,!Nn())Y(t,"alert-triangle","Sync backend is not configured in this build"),t.style.color=yn;else if(!e.isSignedIn)Y(t,"circle-x","Not signed in"),t.style.color=tu;else{Y(t,"circle-check","Signed in"),t.style.color=eu;let n=e.userName;n&&(t.onmouseenter=()=>Y(t,"circle-check",`Signed in as ${n}`),t.onmouseleave=()=>Y(t,"circle-check","Signed in"))}}if(Kr){let{text:t,color:n}=nu(e);Kr.textContent=t,Kr.style.color=n}Yc?.(),ou?.()}function nu(e=$e()){let t=oo;if(t.kind==="error")return{text:t.message||"Sync error",color:tu,busy:!1};if(t.kind==="signing-in")return{text:t.step,color:yn,busy:!0};if(t.kind==="connecting")return{text:"Connecting\u2026",color:yn,busy:!0};if(e.isSignedIn&&t.kind==="offline")return{text:"Offline. Retrying\u2026",color:yn,busy:!1};if(e.isSignedIn&&t.kind==="online"){if(Xr==="failed")return{text:"Sync failed. Retrying\u2026",color:yn,busy:!1};let n=Xr==="running",o=n?"Syncing\u2026":"Live sync on";return!n&&fa&&(o+=` \xB7 last synced ${new Date(fa).toLocaleTimeString()}`),!n&&ro.size>0?(o+=` \xB7 ${ro.size} timestamp${ro.size===1?"":"s"} could not be synced`,{text:o,color:yn,busy:!1}):{text:o,color:n?yn:eu,busy:n}}return{text:"",color:"#aaa",busy:!1}}var Dm="#4285f4";function ni(){if(!Nn()||!$e().isSignedIn)return null;let{text:e,color:t,busy:n}=nu();return e?{color:n?Dm:t,tooltip:`Sync: ${e}`}:{color:yn,tooltip:"Sync: starting\u2026"}}var ou=null;function ru(e){ou=e}function Jt(e){oo=e,zo()}function mt(){return oo.kind==="connecting"||oo.kind==="online"||oo.kind==="offline"}function $r(e){mt()&&Jt({kind:e})}function zc(e){Xr=e,zo()}function iu(){return typeof GM<"u"&&GM&&typeof GM.getValue=="function"&&typeof GM.setValue=="function"?GM:null}var Gc="ytls-install-id";function Pm(){try{let e=localStorage.getItem(Gc);return e||localStorage.setItem(Gc,e=crypto.randomUUID()),e}catch{return"default"}}var au=()=>`${Hn}:${Pm()}`;async function su(){let e=iu();if(!e)return jt(Hn);let t=au(),n=await e.getValue(t);if(n!=null)return n;let o=await e.getValue(Hn);return o!=null?(await e.setValue(t,o),await e.setValue(Hn,null),o):(o=await jt(Hn),o&&(await e.setValue(t,o),await hn(Hn,null)),o??void 0)}async function oi(){try{let e=iu();e?await e.setValue(au(),$e()):await hn(Hn,$e())}catch(e){l("Failed to save sync auth state:",e,"error")}}function Go(){hn(jc,{userId:$e().userId,...je})}async function Rm(){let e=await jt(jc);e&&e.userId===$e().userId&&typeof e.pushCounter=="number"&&typeof e.pullSeq=="number"?je={pushCounter:e.pushCounter,pullSeq:e.pullSeq}:je={pushCounter:0,pullSeq:0}}function Sa(e,t){return fetch(`${Zr}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)})}function lu(e){ti=null,to({isSignedIn:!0,accessToken:e.accessToken,accessTokenExpiresAt:e.accessTokenExpiresAt,refreshToken:e.refreshToken,userId:e.user.id,userName:e.user.displayName,email:e.user.email})}var cu=e=>!!e.accessToken&&e.accessToken!==ti&&!!e.accessTokenExpiresAt&&e.accessTokenExpiresAt-Date.now()>km;async function _m(e){return typeof navigator<"u"&&navigator.locks?await navigator.locks.request("timekeeper-sync-refresh",e):e()}async function Om(){let e=await su();if(e==null)return;let t=Ii.safeParse(e);t.success&&to(t.data)}function Hm(){return jr??(jr=_m(async()=>{await Om();let e=$e();if(!e.isSignedIn||!e.refreshToken)throw new wn("Not signed in");if(cu(e))return e.accessToken;let t=await Sa("/auth/refresh",{refreshToken:e.refreshToken});if(t.status===401)throw new wn("Session expired");if(!t.ok)throw new Error(`Token refresh failed (HTTP ${t.status})`);let n=$c.safeParse(await t.json());if(!n.success)throw new Error("Unexpected token refresh response");return lu(n.data),await oi(),n.data.accessToken}).finally(()=>{jr=null})),jr}async function uu(){let e=$e();if(!e.isSignedIn||!e.refreshToken)throw new wn("Not signed in");return cu(e)?e.accessToken:Hm()}async function du(e,t,n=!0){let o=await uu(),a=await fetch(`${Zr}${e}`,{method:t.method,headers:{Authorization:`Bearer ${o}`,"Content-Type":"application/json"},body:t.body===void 0?void 0:JSON.stringify(t.body)});if(a.status===401){if(!n)throw new wn("Session expired");return ti=o,du(e,t,!1)}return a}async function Qr(e,t,n){let o=await du(e,t);if(!o.ok)throw new Yr(o.status,`${t.method} ${e} failed (HTTP ${o.status})`);let a=n.safeParse(await o.json());if(!a.success)throw new Error(`Unexpected response from ${e}`);return a.data}function Nm(e){try{let t=e.split(".")[1].replace(/-/g,"+").replace(/_/g,"/");return JSON.parse(atob(t.padEnd(Math.ceil(t.length/4)*4,"=")))}catch{return null}}function zm(e,t,n){return new Promise((o,a)=>{let r=()=>{clearTimeout(c),e.close();try{t.close()}catch{}},c=setTimeout(()=>{r(),a(new Error("Sign-in timed out"))},Am);e.onmessage=s=>{let h=Cm.safeParse(s.data);if(h.success){if(h.data.type==="timekeeper_sync_oauth_error")r(),a(new Error(h.data.error||"Google sign-in failed"));else if(h.data.type==="timekeeper_sync_oauth_token"&&h.data.idToken){if(Nm(h.data.idToken)?.nonce!==n)return;r(),o(h.data.idToken)}}}})}function pu(){let e=window.location.hash;if(!e||e.length<=1)return!1;let t=new URLSearchParams(e.substring(1));if(t.get("state")!==Vc)return!1;let n=t.get("id_token"),o=t.get("error_description")||t.get("error");if(!n&&!o)return!1;try{let a=new BroadcastChannel(qc);a.postMessage(o?{type:"timekeeper_sync_oauth_error",error:o}:{type:"timekeeper_sync_oauth_token",idToken:n}),a.close()}catch(a){l("Failed to hand sync sign-in result to the opener:",a,"error")}return history.replaceState&&history.replaceState(null,"",window.location.pathname+window.location.search),window.close(),!0}async function mu(){if(!Nn()){Jt({kind:"error",message:"Sync backend is not configured in this build"});return}if($e().isSignedIn||oo.kind==="signing-in")return;Jt({kind:"signing-in",step:"Opening Google sign-in\u2026"});let e=crypto.randomUUID(),t=new BroadcastChannel(qc);try{let n=new URL("https://accounts.google.com/o/oauth2/v2/auth");n.searchParams.set("client_id",Fc),n.searchParams.set("redirect_uri",wm),n.searchParams.set("response_type","id_token"),n.searchParams.set("scope","openid email profile"),n.searchParams.set("nonce",e),n.searchParams.set("state",Vc),n.searchParams.set("prompt","select_account");let o=window.open(n.toString(),"TimekeeperSyncAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!o)throw new Error("Popup blocked. Please enable popups for YouTube.");Jt({kind:"signing-in",step:"Waiting for Google sign-in\u2026"});let a=await zm(t,o,e);Jt({kind:"signing-in",step:"Signing in to Timekeeper Sync\u2026"});let r=await Sa("/auth/google",{idToken:a});if(!r.ok)throw new Error(r.status===401?"Google sign-in was rejected by the server":`Sign-in failed (HTTP ${r.status})`);let c=$c.safeParse(await r.json());if(!c.success)throw new Error("Unexpected response from the sync server");lu(c.data),await oi(),je={pushCounter:0,pullSeq:0},Go(),l(`Signed in to Timekeeper Sync as ${c.data.user.displayName??"an account with no display name"}`),await bu()}catch(n){t.close(),l("Sync sign-in failed:",n,"error"),Jt({kind:"error",message:n instanceof Error?n.message:"Sign-in failed"})}}var ya=e=>`${e.channelId}:${e.membersOnly}`;function fu(e){Wc.set(e.videoId,e),mt()&&Gm(e)}async function Gm(e){let t=ya(e);if(No.get(e.videoId)!==t)try{if(!(await zi(e.videoId))?.some(a=>!a.deleted_at))return;let o=await Qr(`/videos/${encodeURIComponent(e.videoId)}/access`,{method:"GET"},Im);(!o.known||o.membersOnly!==e.membersOnly||o.channelId!==e.channelId)&&await Qr("/videos/access",{method:"POST",body:{videos:[e]}},Se({ok:Dt()})),No.set(e.videoId,t)}catch(n){l("Reporting the members-only status failed:",n,"warn")}}async function hu(){let{refreshToken:e}=$e();if(Su({kind:"signed-out"}),to(Xn),je={pushCounter:0,pullSeq:0},ba.clear(),ro.clear(),No.clear(),await oi(),Go(),e&&Nn())try{await Sa("/auth/logout",{refreshToken:e})}catch(t){l("Sync logout request failed:",t,"warn")}}function gu(){Su({kind:"error",message:"Session expired. Please sign in again."}),to(Xn),oi()}function yu(e){let t=Nc.then(e);return Nc=t.catch(()=>{}),t}function io(){!mt()||Wr||(Wr=!0,yu(async()=>{Wr=!1,await Vm()}).catch(e=>l("Sync: cycle crashed:",e,"error")))}async function xa(e){if(e.length!==0){for(let t of e)ba.set(t.guid,t.write_counter??0);await Ui(e),Kc?.([...new Set(e.map(t=>t.video_id))])}}function vu(e,t){return e>je.pullSeq?(Qt=!0,!1):(t>je.pullSeq&&(je.pullSeq=t,Go()),!0)}async function Um(){for(;;){let e=await Qr(`/sync/pull?since=${je.pullSeq}&limit=${xm}`,{method:"GET"},Em);await xa(e.records);let t=e.seq!==je.pullSeq;if(je.pullSeq=e.seq,Go(),!e.hasMore||!t)return}}async function va(e){try{let t=[...new Set(e.map(o=>o.video_id))].map(o=>Wc.get(o)).filter(o=>!!o&&No.get(o.videoId)!==ya(o)),n=await Qr("/sync/push",{method:"POST",body:{deviceId:Jr,records:e,videos:t}},Mm);for(let o of t)No.set(o.videoId,ya(o));await xa(n.rejected);for(let o of e)ro.delete(o.guid);vu(n.fromSeq,n.seq)||io()}catch(t){if(!Bm(t))throw t;if(e.length>1){let n=e.length>>1;await va(e.slice(0,n)),await va(e.slice(n));return}ro.add(e[0].guid),l(`Sync: server refused timestamp ${e[0].guid}; leaving it local-only:`,t,"warn")}}async function Fm(){let e=await Gi(je.pushCounter);if(e.length===0)return;let t=e.filter(n=>(ba.get(n.guid)??0)<n.write_counter);for(let n=0;n<t.length;n+=_c)await va(t.slice(n,n+_c));je.pushCounter=Math.max(je.pushCounter,e[e.length-1].write_counter),Go()}async function Vm(){if(!mt())return;zc("running");let e="idle";try{(Qt||!Xt)&&(await Um(),Qt=!1),await Fm(),fa=Date.now(),wa=0}catch(t){if(t instanceof wn){gu();return}l("Sync cycle failed:",t,"warn"),Qt=!0,e="failed",qm()}finally{zc(e)}}function wu(e){return Math.min(Tm,1e3*2**e)*(.5+Math.random()/2)}function qm(){!mt()||Ho||(Ho=setTimeout(()=>{Ho=null,io()},wu(wa++)))}function jm(){if(!mt())return;let e=Date.now();no?clearTimeout(no):Oc=e;let t=Math.max(0,Math.min(bm,Oc+Sm-e));no=setTimeout(()=>{no=null,io()},t)}function ka(){mt()&&(Qt=!0,Xt||(ei=0,vn&&clearTimeout(vn),vn=null,Ta()),io())}function Uc(){!mt()||vn||(vn=setTimeout(()=>{vn=null,Ta()},wu(ei++)))}async function Ta(){if(!mt()||Xt)return;$r("connecting");let e;try{e=await uu()}catch(n){return n instanceof wn?gu():(l("Sync: could not get an access token:",n,"warn"),$r("offline"),Uc())}if(!mt()||Xt)return;let t=new WebSocket(`${Zr.replace(/^http/,"ws")}/sync/ws`);Xt=t,t.onopen=()=>t.send(JSON.stringify({type:"auth",token:e,deviceId:Jr})),t.onmessage=n=>{let o;try{o=JSON.parse(String(n.data))}catch{return}let a=Lm.safeParse(o);if(a.success){if(a.data.type==="ready")ei=0,$r("online"),(a.data.seq===void 0||a.data.seq!==je.pullSeq)&&(Qt=!0),io();else if(a.data.type==="changes"&&a.data.records){let{fromSeq:r,seq:c,records:s}=a.data;yu(async()=>{await xa(s),(r===void 0||c===void 0)&&(Qt=!0),(Qt||!vu(r,c))&&io()}).catch(h=>l("Sync: failed to apply live changes:",h,"error"))}}},t.onclose=n=>{Xt===t&&(Xt=null),Qt=!0,mt()&&(n.code===4401&&(ti=e),$r("offline"),Uc())},t.onerror=()=>{}}async function bu(){if(!mt()){if(!Jr){let e=await jt("device_id");Jr=typeof e=="string"&&e?e:crypto.randomUUID()}Xr="idle",Jt({kind:"connecting"}),wa=0,ei=0,ha=Fi(jm),Hc||(Hc=!0,window.addEventListener("online",()=>ka())),await Ta()}}function Su(e){Jt(e),ha?.(),ha=null;for(let n of[no,Ho,vn])n&&clearTimeout(n);no=Ho=vn=null,Wr=!1;let t=Xt;Xt=null;try{t?.close()}catch{}}async function xu(){if(!Nn()){zo();return}try{let e=Ii.safeParse(await su());e.success&&to(e.data);let t=$e();t.isSignedIn&&t.refreshToken?(await Rm(),await bu()):Jt({kind:"signed-out"})}catch(e){l("Failed to load sync auth state:",e,"error")}}function ft(){return Rt()}var ht={get isSignedIn(){return Rt().isSignedIn},get accessToken(){return Rt().accessToken},get userName(){return Rt().userName},get email(){return Rt().email},set isSignedIn(e){let t=Rt();At({...t,isSignedIn:e})},set accessToken(e){let t=Rt();At({...t,accessToken:e})},set userName(e){let t=Rt();At({...t,userName:e})},set email(e){let t=Rt();At({...t,email:e})}};function $o(){return at().auth.autoBackupEnabled}function Sn(){return at().auth.autoBackupIntervalMinutes}var Ea=null,Fe=null,ne=null,zn=null;function Iu(e){Ea=e}function Mu(e){Fe=e}function Lu(e){ne=e}function Cu(e){zn=e}var ku=!1;function Bu(){if(!ku)try{let e=document.createElement("style");e.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(e),ku=!0}catch{}}var Du=null,Ia=null,Fo=null,Vo=null,Ma=null;function Pu(e){Du=e}function Ru(e){Ia=e}function La(e){Fo=e}function Ca(e){Vo=e}function _u(e){Ma=e}var ai="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",Ou="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",Hu="https://www.youtube.com/",Wm=new Date(Date.UTC(2e3,0,1,0,0,0)),Km=30*1e3,Ym=1800*1e3,Tu=5,ii=null,bn=null;async function Ba(){try{let e=await Vo("googleAuthState"),t=e&&typeof e=="object"?{...e,accessToken:e.accessToken?"[REDACTED]":null}:e;l("Loading Google auth state from IndexedDB:",t);let n=Ei.safeParse(e);if(n.success){let o=ft();At({...o,...n.data});let a=ft();a.isSignedIn&&a.accessToken&&l(`Reusing stored Google auth token for ${a.userName||a.email||"user"}`),so();let r=ft();r.isSignedIn&&r.accessToken&&await xn(!0)}else if(e!==void 0){let o=e&&typeof e=="object"?{...e,accessToken:e.accessToken?"[REDACTED]":null}:e;l("Google auth state failed validation:",{stored:o,errors:n.error.message},"warn")}}catch(e){l("Failed to load Google auth state:",e,"error")}}async function Wo(){try{let e=ft(),t=Ei.safeParse(e);if(!t.success){let n={...e,accessToken:e.accessToken?"[REDACTED]":null};l("Invalid auth state, cannot save",{state:n,errors:t.error.message},"error");return}await Fo("googleAuthState",e),e.isSignedIn&&e.accessToken?l(`Saved Google auth state to IndexedDB for ${e.userName||e.email||"user"}`):l("Cleared Google auth state in IndexedDB (signed out)")}catch(e){l("Failed to save Google auth state:",e,"error")}}function so(){Ea&&(Ea.style.display="none")}function nt(e,t){if(!ne)return;if(ne.style.fontWeight="bold",e==="authenticating"){Bu(),ne.style.color="#ffa500",ne.replaceChildren();let o=document.createElement("span");o.className="tk-auth-spinner";let a=document.createTextNode(` ${t||"Authorizing with Google\u2026"}`);ne.appendChild(o),ne.appendChild(a);return}if(e==="error"){Y(ne,"circle-x",t||"Authorization failed"),ne.style.color="#ff4d4f",Ae();return}let n=ft();n.isSignedIn?(Y(ne,"circle-check","Signed in"),ne.style.color="#52c41a",ne.removeAttribute("title"),n.userName?(ne.onmouseenter=()=>{Y(ne,"circle-check",`Signed in as ${n.userName}`)},ne.onmouseleave=()=>{Y(ne,"circle-check","Signed in")}):(ne.onmouseenter=null,ne.onmouseleave=null)):(Y(ne,"circle-x","Not signed in"),ne.style.color="#ff4d4f",ne.removeAttribute("title"),ne.onmouseenter=null,ne.onmouseleave=null),Ae()}function Xm(){ne&&(Bu(),ne.classList.remove("tk-auth-blink"),ne.offsetWidth,ne.classList.add("tk-auth-blink"),setTimeout(()=>{ne.classList.remove("tk-auth-blink")},1200))}function Nu(e,t=300*1e3){return new Promise((n,o)=>{if(!e){l&&l("OAuth monitor: popup is null",null,"error"),o(new Error("Failed to open popup"));return}l&&l("OAuth monitor: starting to monitor popup for token");let a=Date.now(),r="timekeeper_oauth",c=null,s=null,h=null,m=()=>{if(c){try{c.close()}catch{}c=null}s&&(clearInterval(s),s=null),h&&(clearInterval(h),h=null)};try{c=new BroadcastChannel(r),l&&l("OAuth monitor: BroadcastChannel created successfully"),c.onmessage=y=>{let E=y.data?.token?{...y.data,token:"[REDACTED]"}:y.data;l&&l("OAuth monitor: received BroadcastChannel message",E);let M=Se({type:K(),token:be(K()),error:be(K())}).safeParse(y.data);if(!M.success){l&&l("OAuth monitor: invalid message format",M.error,"warn");return}if(M.data.type==="timekeeper_oauth_token"&&M.data.token){l&&l("OAuth monitor: token received via BroadcastChannel"),m();try{e.close()}catch{}n(M.data.token)}else if(M.data.type==="timekeeper_oauth_error"){l&&l("OAuth monitor: error received via BroadcastChannel",M.data.error,"error"),m();try{e.close()}catch{}o(new Error(M.data.error||"OAuth failed"))}}}catch(y){l&&l("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",y)}l&&l("OAuth monitor: setting up IndexedDB polling");let v=Date.now();s=setInterval(async()=>{try{let y=indexedDB.open("ytls-timestamps-db",4);y.onsuccess=()=>{let E=y.result,U=E.transaction("settings","readonly").objectStore("settings").get("oauth_message");U.onsuccess=()=>{let q=U.result;if(q&&q.value){let te=q.value,O=Se({type:K(),token:be(K()),error:be(K()),timestamp:be(Me())}).safeParse(te);if(!O.success){l&&l("OAuth monitor: invalid IndexedDB message format",O.error,"warn");return}if(O.data.timestamp&&O.data.timestamp>v){let j=O.data.token?{...O.data,token:"[REDACTED]"}:O.data;if(l&&l("OAuth monitor: received IndexedDB message",j),O.data.type==="timekeeper_oauth_token"&&O.data.token){l&&l("OAuth monitor: token received via IndexedDB"),m();try{e.close()}catch{}E.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),n(O.data.token)}else if(O.data.type==="timekeeper_oauth_error"){l&&l("OAuth monitor: error received via IndexedDB",O.data.error,"error"),m();try{e.close()}catch{}E.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),o(new Error(O.data.error||"OAuth failed"))}v=O.data.timestamp||Date.now()}}E.close()}}}catch(y){l&&l("OAuth monitor: IndexedDB polling error",y,"error")}},500),h=setInterval(()=>{if(Date.now()-a>t){l&&l("OAuth monitor: popup timed out after 5 minutes",null,"error"),m();try{e.close()}catch{}o(new Error("OAuth popup timed out"));return}},1e3)})}async function zu(){if(!ai){nt("error","Google Client ID not configured");return}try{l&&l("OAuth signin: starting OAuth flow"),nt("authenticating","Opening authentication window...");let e=new URL("https://accounts.google.com/o/oauth2/v2/auth");e.searchParams.set("client_id",ai),e.searchParams.set("redirect_uri",Hu),e.searchParams.set("response_type","token"),e.searchParams.set("scope",Ou),e.searchParams.set("include_granted_scopes","true"),e.searchParams.set("state","timekeeper_auth"),l&&l("OAuth signin: opening popup");let t=window.open(e.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!t){l&&l("OAuth signin: popup blocked by browser",null,"error"),nt("error","Popup blocked. Please enable popups for YouTube.");return}l&&l("OAuth signin: popup opened successfully"),nt("authenticating","Waiting for authentication...");try{let n=await Nu(t),o=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${n}`}});if(o.ok){let a=await o.json(),r=Se({name:be(K()),email:be(K())}).safeParse(a);if(!r.success)throw l&&l("Failed to validate user info response",r.error,"error"),new Error("Invalid user info response");let c=r.data;At({isSignedIn:!0,accessToken:n,userName:c.name||null,email:c.email||null}),await Wo(),so(),nt(),Ae(),await xn(),l(`Successfully authenticated as ${c.name}`)}else throw new Error("Failed to fetch user info")}catch(n){let o=n instanceof Error?n.message:"Authentication failed";l("OAuth failed:",n,"error"),nt("error",o);return}}catch(e){let t=e instanceof Error?e.message:"Sign in failed";l("Failed to sign in to Google:",e,"error"),nt("error",`Failed to sign in: ${t}`)}}async function Jm(){let e=ft(),t=e.email;if(!ai||!t)return!1;l("Silent OAuth: attempting silent token refresh for "+t);let n=new URL("https://accounts.google.com/o/oauth2/v2/auth");n.searchParams.set("client_id",ai),n.searchParams.set("redirect_uri",Hu),n.searchParams.set("response_type","token"),n.searchParams.set("scope",Ou),n.searchParams.set("include_granted_scopes","true"),n.searchParams.set("state","timekeeper_auth"),n.searchParams.set("prompt","none"),n.searchParams.set("login_hint",t);let o=window.open(n.toString(),"TimekeeperGoogleAuthSilent","width=1,height=1,left=-2000,top=-2000,menubar=no,toolbar=no,location=no");if(!o)return l("Silent OAuth: popup blocked",null,"warn"),!1;try{let a=await Nu(o,15e3);return At({...e,isSignedIn:!0,accessToken:a}),await Wo(),so(),nt(),l("Silent OAuth: token refreshed successfully for "+t),!0}catch(a){l("Silent OAuth: silent refresh failed",a,"warn");try{o.close()}catch{}return!1}}async function Gu(){if(!window.opener||window.opener===window)return!1;l&&l("OAuth popup: detected popup window, checking for OAuth response");let e=window.location.hash;if(!e||e.length<=1)return l&&l("OAuth popup: no hash params found"),!1;let t=e.startsWith("#")?e.substring(1):e,n=new URLSearchParams(t),o=n.get("state");if(l&&l("OAuth popup: hash params found, state="+o),o!=="timekeeper_auth")return l&&l("OAuth popup: not our OAuth flow (wrong state)"),!1;let a=n.get("error"),r=n.get("access_token"),c="timekeeper_oauth";if(a){try{let s=new BroadcastChannel(c);s.postMessage({type:"timekeeper_oauth_error",error:n.get("error_description")||a}),s.close(),l&&l("OAuth popup: error broadcast via BroadcastChannel")}catch{let h={type:"timekeeper_oauth_error",error:n.get("error_description")||a,timestamp:Date.now()};l&&l("OAuth popup: writing error to IndexedDB",h);let m=indexedDB.open("ytls-timestamps-db",4);m.onsuccess=()=>{let v=m.result,y=v.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:h});y.onsuccess=()=>{l&&l("OAuth popup: error written to IndexedDB successfully")},y.onerror=()=>{l&&l("OAuth popup: failed to write error to IndexedDB",y.error,"error")},v.close()},m.onerror=()=>{l&&l("OAuth popup: failed to open IndexedDB",m.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(r){l&&l("OAuth popup: access token found, broadcasting to opener");try{let s=new BroadcastChannel(c);s.postMessage({type:"timekeeper_oauth_token",token:r}),s.close(),l&&l("OAuth popup: token broadcast via BroadcastChannel")}catch(s){l&&l("OAuth popup: BroadcastChannel failed, using IndexedDB",s);let h={type:"timekeeper_oauth_token",token:r,timestamp:Date.now()},m={...h,token:"[REDACTED]"};l&&l("OAuth popup: writing token to IndexedDB",m);let v=indexedDB.open("ytls-timestamps-db",4);v.onsuccess=()=>{let f=v.result,E=f.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:h});E.onsuccess=()=>{l&&l("OAuth popup: token written to IndexedDB successfully")},E.onerror=()=>{l&&l("OAuth popup: failed to write token to IndexedDB",E.error,"error")},f.close()},v.onerror=()=>{l&&l("OAuth popup: failed to open IndexedDB",v.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function Uu(){At({isSignedIn:!1,accessToken:null,userName:null,email:null}),await Wo(),await xn(),so(),nt(),Ae()}async function Fu(){let e=ft();if(!e.isSignedIn||!e.accessToken)return!1;try{let t=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${e.accessToken}`}});return t.status===401?(await ju({silent:!0}),!1):t.ok}catch(t){return l("Failed to verify auth state:",t,"error"),!1}}function si(){let e=ft();return e.isSignedIn&&!!e.accessToken}function Da(){return si()}function Qm(){let e=[];return si()&&e.push("Google Drive"),e}function Zm(e){let t=Rc(new Uint8Array(e)),n=Object.values(t)[0];return n?new TextDecoder().decode(n):null}async function Vu(e){let t={Authorization:`Bearer ${e}`},o=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,a=await fetch(o,{headers:t});if(a.status===401)throw new Error("unauthorized");if(!a.ok)throw new Error("drive search failed");let r=await a.json();if(Array.isArray(r.files)&&r.files.length>0)return r.files[0].id;let c=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...t,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(c.status===401)throw new Error("unauthorized");if(!c.ok)throw new Error("drive folder create failed");return(await c.json()).id}async function qu(e,t,n){let o=`name='${e}' and '${t}' in parents and trashed=false`,a=encodeURIComponent(o),r=encodeURIComponent("modifiedTime desc"),c=await fetch(`https://www.googleapis.com/drive/v3/files?q=${a}&orderBy=${r}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${n}`}});if(c.status===401)throw new Error("unauthorized");if(!c.ok)throw new Error(`drive search failed (${c.status})`);let s=await c.json();return s.files&&s.files.length>0?s.files[0].id:null}async function Au(e){let t=await Vu(e),n=await qu("timekeeper-data.zip",t,e);if(!n)return null;let o=await fetch(`https://www.googleapis.com/drive/v3/files/${n}?alt=media`,{headers:{Authorization:`Bearer ${e}`}});if(o.status===401)throw new Error("unauthorized");if(!o.ok)throw new Error(`drive download failed (${o.status})`);let a=await o.arrayBuffer();try{return Zm(a)}catch(r){return l("Remote backup could not be decoded; the next upload will replace it:",r,"warn"),null}}async function ef(){if(!Ia)return;let e=ft();if(!e.isSignedIn||!e.accessToken)return;let t;try{t=await Au(e.accessToken)}catch(a){if(a.message!=="unauthorized")throw a;await ju({silent:!0});let r=ft();if(!r.isSignedIn||!r.accessToken)throw a;t=await Au(r.accessToken)}if(!t)return;let{mergedVideos:n,mergedTimestamps:o}=await Ia(t);o>0&&(l(`Pre-backup merge: added ${o} timestamps from ${n} videos from remote`),Ma&&Ma())}function tf(e,t){let n=new TextEncoder().encode(e),o=t.replace(/\\/g,"/").replace(/^\/+/,"");return o.endsWith(".json")||(o+=".json"),Pc({[o]:[n,{level:6,mtime:Wm,os:0}]})}async function nf(e,t,n,o){let a=e.replace(/\.json$/,".zip"),r=await qu(a,n,o),c=new TextEncoder().encode(t).length,s=tf(t,e),h=s.length;l(`Compressing data: ${c} bytes -> ${h} bytes (${Math.round(100-h/c*100)}% reduction)`);let m="-------314159265358979",v=`\r
--${m}\r
`,f=`\r
--${m}--`,y=r?{name:a,mimeType:"application/zip"}:{name:a,mimeType:"application/zip",parents:[n]},E=8192,M="";for(let j=0;j<s.length;j+=E){let le=s.subarray(j,Math.min(j+E,s.length));M+=String.fromCharCode.apply(null,Array.from(le))}let R=btoa(M),U=v+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify(y)+v+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+R+f,q,te;r?(q=`https://www.googleapis.com/upload/drive/v3/files/${r}?uploadType=multipart&fields=id,name`,te="PATCH"):(q="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",te="POST");let O=await fetch(q,{method:te,headers:{Authorization:`Bearer ${o}`,"Content-Type":`multipart/related; boundary=${m}`},body:U});if(O.status===401)throw new Error("unauthorized");if(!O.ok)throw new Error("drive upload failed")}async function ju(e){l("Auth expired, attempting silent token refresh",null,"warn"),!await Jm()&&(l("Silent OAuth: falling back to sign-out",null,"warn"),At({isSignedIn:!1,accessToken:null,userName:null,email:null}),await Wo(),await xn(),nt("error","Authorization expired. Please sign in again."),Ae())}async function of(e){if(!si())throw e?.silent||nt("error","Configure a backup destination first"),new Error("no-backup-destination");await ef();let t=await Du({includeDeleted:!0});if(t.totalTimestamps===0){if(t.invalidRows>0)throw new Error(`export-invalid-data: ${t.invalidRows} stored rows failed validation`);return e?.silent||l("Skipping export: no timestamps to back up"),"skipped"}let n=ft();if(!n.accessToken)throw new Error("unauthorized");let o=await Vu(n.accessToken);return await nf(t.filename,t.json,o,n.accessToken),l(`Exported backup to Google Drive (${t.filename}) with ${t.totalVideos} videos / ${t.totalTimestamps} timestamps.`),"uploaded"}async function $u(){try{let[e,t,n]=await Promise.all([Vo("lastAutoBackupAt"),Vo("autoBackupEnabled"),Vo("autoBackupIntervalMinutes")]),o=Mi.partial().safeParse({autoBackupEnabled:t,autoBackupIntervalMinutes:n,lastAutoBackupAt:typeof e=="number"&&e>0?e:null});o.success?(typeof o.data.autoBackupEnabled=="boolean"&&qi(o.data.autoBackupEnabled),typeof o.data.autoBackupIntervalMinutes=="number"&&ji(o.data.autoBackupIntervalMinutes),typeof o.data.lastAutoBackupAt=="number"&&Yi(o.data.lastAutoBackupAt)):l("Failed to validate auto backup settings:",o.error.message,"warn")}catch(e){l("Failed to load auto backup settings:",e,"error")}}async function Pa(){try{let e=at().auth,t={autoBackupEnabled:e.autoBackupEnabled,autoBackupIntervalMinutes:e.autoBackupIntervalMinutes,lastAutoBackupAt:e.lastAutoBackupAt},n=Mi.safeParse(t);if(!n.success){l("Invalid auto backup settings, cannot save",{settings:t,errors:n.error.message},"error");return}await Promise.all([Fo("autoBackupEnabled",e.autoBackupEnabled),Fo("autoBackupIntervalMinutes",e.autoBackupIntervalMinutes),Fo("lastAutoBackupAt",e.lastAutoBackupAt)])}catch(e){l("Failed to save auto backup settings:",e,"error")}}function Uo(){bn&&(clearTimeout(bn),bn=null),Wi(0),Ki(null)}function rf(){ii&&(clearInterval(ii),ii=null),Uo()}function qo(e){try{let t=new Date(e),n=new Date,o=t.toDateString()===n.toDateString(),a=t.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return o?a:`${t.toLocaleDateString()} ${a}`}catch{return""}}function ri(){let e=Qm();return e.length>0?`Destinations: ${e.join(", ")}`:"No backup destination configured"}function Ra(){let e=at().auth;return e.autoBackupEnabled?e.isAutoBackupRunning?{kind:"running"}:e.autoBackupBackoffMs&&e.autoBackupBackoffMs>0?{kind:"retrying",backoffMs:e.autoBackupBackoffMs}:Da()?e.autoBackupFailed?{kind:"failed"}:e.lastAutoBackupAt?{kind:"healthy",lastAt:e.lastAutoBackupAt}:{kind:"never"}:{kind:"no-destination"}:{kind:"off"}}function Wu(){switch(Ra().kind){case"running":return"#4285f4";case"retrying":case"never":return"#ffa500";case"healthy":return"#52c41a";case"off":case"no-destination":case"failed":return"#ff4d4f"}}function Ae(){if(li(),!Fe)return;let e=Ra();switch(Fe.onmouseenter=null,Fe.onmouseleave=null,e.kind){case"off":Y(Fe,"refresh","Backup: Off");break;case"running":Y(Fe,"refresh","Backing up\u2026");break;case"retrying":Y(Fe,"alert-triangle",`Retry in ${Math.ceil(e.backoffMs/6e4)}m`);break;case"no-destination":Y(Fe,"alert-triangle","Backup target missing");break;case"failed":Y(Fe,"alert-triangle","Backup failed");break;case"healthy":case"never":{let n=e.kind==="healthy"?`Last backup: ${qo(e.lastAt)}`:"Last backup: never",o=(e.kind==="healthy"?e.lastAt:Date.now())+Math.max(1,Sn())*60*1e3,a=`Next backup: ${qo(o)}`;Fe.onmouseenter=()=>{Y(Fe,"database",a)},Fe.onmouseleave=()=>{Y(Fe,"database",n)},Y(Fe,"database",n);break}}Fe.style.display="inline";let t=Wu();Fe.style.color=t}var Aa="ytls-backup-indicator--pulsing",af="#4285f4",ao=null;function sf(e,t){ao&&(e.removeEventListener("animationiteration",ao),ao=null),t===af?(e.style.backgroundColor=t,e.classList.add(Aa)):e.classList.contains(Aa)?(ao=()=>{zn&&(zn.classList.remove(Aa),zn.style.backgroundColor=t,ao=null)},e.addEventListener("animationiteration",ao,{once:!0})):e.style.backgroundColor=t}function lf(){let e=Ra(),t=Math.max(1,Sn())*60*1e3;switch(e.kind){case"off":return"Auto backup is disabled";case"running":return"Backup in progress";case"retrying":return`Retrying backup in ${Math.ceil(e.backoffMs/6e4)}m`;case"no-destination":return ri();case"failed":return`Backup failed. Will try again at the next scheduled backup
${ri()}`;case"healthy":return`Last backup: ${qo(e.lastAt)}
Next backup: ${qo(e.lastAt+t)}
${ri()}`;case"never":return`No backup yet
Next backup: ${qo(Date.now()+t)}
${ri()}`}}function Eu(){return ni()??{color:Wu(),tooltip:lf()}}function li(){zn&&(sf(zn,Eu().color),Be(zn,()=>Eu().tooltip))}async function jo(e={}){let{silent:t=!0,skipBackoff:n=!1}=e;if(!Da()){t||(Ae(),si()||Xm());return}if(bn){if(!n){l("Auto backup: backoff in progress, skipping scheduled run");return}Uo(),l("Auto backup: manual run cleared backoff and will proceed immediately")}if(!at().auth.isAutoBackupRunning){$i(!0),Ae();try{await of({silent:t})==="uploaded"&&Yi(Date.now()),Uo(),Fr(!1),await Pa()}catch(o){if(l("Auto backup failed:",o,"error"),o.message==="unauthorized"){l("Auth error detected, clearing token and stopping retries",null,"warn");let r=ft();At({...r,accessToken:null,isSignedIn:!1}),await Wo(),nt("error","Authorization expired. Please sign in again."),Ae(),Uo(),Fr(!1)}else if(at().auth.autoBackupRetryAttempts<Tu){let r=at().auth.autoBackupRetryAttempts+1;Wi(r);let s=Math.min(Km*Math.pow(2,r-1),Ym);Ki(s),bn&&clearTimeout(bn),bn=setTimeout(()=>{bn=null,jo({silent:!0})},s),l(`Scheduling backup retry ${r}/${Tu} in ${Math.round(s/1e3)}s`),Ae()}else Uo(),Fr(!0)}finally{$i(!1),Ae()}}}async function xn(e=!1){if(rf(),!!$o()&&Da()){if(ii=setInterval(()=>{jo({silent:!0})},Math.max(1,Sn())*60*1e3),!e){let t=Date.now(),n=Math.max(1,Sn())*60*1e3,o=at().auth.lastAutoBackupAt;(!o||t-o>=n)&&jo({silent:!0})}Ae()}}async function Ku(){let e=$o();qi(!e),await Pa(),await xn(),Ae()}async function Yu(){let e=Sn(),t=prompt("Set Auto Backup interval (minutes):",String(e));if(t===null)return;let n=Math.floor(Number(t));if(!Number.isFinite(n)||n<5||n>1440){alert("Please enter a number between 5 and 1440 minutes.");return}ji(n),await Pa(),await xn(),Ae()}var Xu=()=>Bi(yl)??gl,uf=()=>Bi(wl)??vl;function _a(e,t){return jt(e).then(n=>n!==void 0?n:t)}function Oa(e,t){return hn(e,t),Promise.resolve()}var Ha=window.location.hash;if(Ha&&Ha.length>1){let e=new URLSearchParams(Ha.substring(1));if(e.get("state")==="timekeeper_auth"){let n=e.get("access_token");if(n){l("Auth token detected in URL, broadcasting token"),l("Token length:",n.length,"characters");try{let o=new BroadcastChannel("timekeeper_oauth"),a={type:"timekeeper_oauth_token",token:n};l("Sending auth message via BroadcastChannel:",{type:a.type,tokenLength:n.length}),o.postMessage(a),o.close(),l("Token broadcast via BroadcastChannel completed")}catch(o){l("BroadcastChannel failed, using IndexedDB fallback:",o,"warn");let a={type:"timekeeper_oauth_token",token:n,timestamp:Date.now()},r=indexedDB.open("ytls-timestamps-db",4);r.onsuccess=()=>{let c=r.result,s=c.transaction("settings","readwrite");s.objectStore("settings").put({key:"oauth_message",value:a}),s.oncomplete=()=>{l("Token broadcast via IndexedDB completed, timestamp:",a.timestamp),c.close()}}}if(history.replaceState){let o=window.location.pathname+window.location.search;history.replaceState(null,"",o)}throw l("Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}if(pu())throw new Error("OAuth window closed");vc();yc()||fc();(async function(){"use strict";if(window.top!==window.self)return;function e(i){return _a(i,void 0)}function t(i,u){return Oa(i,u)}Ca(e),La(t);try{let i=await jt("device_id"),u=typeof i=="string"&&i.length>0?i:crypto.randomUUID();await hn("device_id",u),l(`Lamport: device_id = ${u}`)}catch(i){l("Lamport: failed to initialize device_id:",i,"warn")}if(await Gu()){l("OAuth popup detected, broadcasting token and closing");return}await Ba();let o=["/watch","/live"];function a(i=window.location.href){try{let u=new URL(i);return u.origin!=="https://www.youtube.com"?!1:o.some(d=>u.pathname===d||u.pathname.startsWith(`${d}/`))}catch(u){return l("Timekeeper failed to parse URL for support check:",u,"error"),!1}}let r=null,c=null,s=null,h=null,m=null,v=null,f=null,y=null,E=(()=>{try{let i=parseFloat(localStorage.getItem("ytls-last-speed")??"");return Number.isFinite(i)&&i>0&&i!==1?Math.min(i,4):2}catch{return 2}})(),M=!1,R=null,U=null,q=250,te=null;function O(){return at().ui.minPaneHeight}function j(i){nc(i)}function le(i){rc(i)}function ve(){return at().ui.urlChangeHandlersSetup}function de(i){ic(i)}function F(){return at().ui.panePosition}function D(i){oc(i)}function pe(i){ac(i)}function me(i,u,d){return Math.max(0,i.offsetHeight-(u.offsetHeight+d.offsetHeight))}function fe(){return r?r.getBoundingClientRect():null}function lt(i,u,d){i&&D({x:Math.round(typeof u=="number"?u:i.left),y:Math.round(typeof d=="number"?d:i.top),width:Math.round(i.width),height:Math.round(i.height)})}function Ee(i=!0){if(!r)return;Vn();let u=fe();if(u&&(u.width||u.height)&&(lt(u),i)){let d=F();fr("windowPosition",d),Mn({type:"window_position_updated",position:d,timestamp:Date.now()})}}function Le(){if(!r||!c||!h||!s)return;let i=40,u=Ce();if(u.length>0)i=u[0].offsetHeight;else{let d=document.createElement("li");d.style.visibility="hidden",d.style.position="absolute",d.textContent="00:00 Example",s.appendChild(d),i=d.offsetHeight,s.removeChild(d)}q=c.offsetHeight+h.offsetHeight+i,j(q),r.style.minHeight=O()+"px"}function xe(){requestAnimationFrame(()=>{_e?.(),Le(),Ee(!0)})}function ce(i=450){Ie&&(clearTimeout(Ie),Ie=null),Ie=setTimeout(()=>{De(),xe(),Ie=null},i)}function Ne(){Ie&&(clearTimeout(Ie),Ie=null)}function ke(){s&&(s.style.visibility="hidden",l("Hiding timestamps during show animation")),xe(),ce()}function kn(){De(),Ne(),gt&&(clearTimeout(gt),gt=null),gt=setTimeout(()=>{r&&(r.style.display="none",cs(),gt=null)},400)}function De(){if(!s){ot&&(ot(),ot=null,zt=null,Cn=null);return}if(!Cn){s.style.visibility==="hidden"&&(s.style.visibility="",l("Restoring timestamp visibility (no deferred fragment)")),ot&&(ot(),ot=null,zt=null);return}l("Appending deferred timestamps after animation"),s.appendChild(Cn),Cn=null,nn(),on(),s.style.visibility==="hidden"&&(s.style.visibility="",l("Restoring timestamp visibility after append")),ot&&(ot(),ot=null,zt=null),Mt(),Ve(),_e&&requestAnimationFrame(_e),bt(!0)}let ze=null,Te={phase:"unloaded"},he=0;function $(){return Te.phase==="loading"}function Z(){return Te.phase==="unloaded"?null:Te.videoId}let We="ytls-timestamp-pending-delete",Pe="ytls-timestamp-highlight";async function Gn(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(i=>setTimeout(i,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(i=>setTimeout(i,100));await new Promise(i=>setTimeout(i,200))}let Tn=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],An=5e3,En=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function Ht(i){return En.has(i)}function Re(){return document.querySelector("video")}let In=null;function re(){if(In&&document.contains(In))return In;let i=document.getElementById("movie_player");return i&&document.contains(i)?i:null}function Na(i){return(Math.round(i*100)/100).toFixed(2).replace(/\.0+?$|(?<=\.[0-9])0+$/g,"")}function Ju(i){let u=i===1?2:i;E=u;try{localStorage.setItem("ytls-last-speed",String(u))}catch{}}function ci(i){if(!y)return;let u=typeof i=="number"?i:Re()?.playbackRate??1,d=Na(u);y.dataset.speed!==d&&(y.dataset.speed=d,y.textContent=`${d}x`,y.setAttribute("aria-label",`Playback speed ${d}x`)),Math.abs(u-1)>.01?y.classList.add("ytls-playback-speed-active"):y.classList.remove("ytls-playback-speed-active")}function Qu(i){let u=re(),d=Re();if(M=!0,u&&typeof u.setPlaybackRate=="function")u.setPlaybackRate(i);else if(d)d.playbackRate=i;else return M=!1,!1;return ci(i),!0}function za(){let i=Re()?.playbackRate;return Number.isFinite(i)?Qu(Math.abs(i-1)<=.001?E:1):!1}function Zu(i){return i instanceof Element?!!i.closest('input, textarea, select, [contenteditable], [role="textbox"]'):!1}function ui(i){return Tn.every(u=>typeof i?.[u]=="function"?!0:Ht(u)?!!Re():!1)}function ed(i){return Tn.filter(u=>typeof i?.[u]=="function"?!1:Ht(u)?!Re():!0)}async function td(i=An){let u=Date.now();for(;Date.now()-u<i;){let S=re();if(ui(S))return S;await new Promise(x=>setTimeout(x,100))}let d=re();return ui(d),d}let Ga="timestampOffsetSeconds",nd=-5,Ua="shiftClickTimeSkipSeconds",od=10,di=300,pi=300,It=null;function Fa(){try{return new URL(window.location.href).origin==="https://www.youtube.com"}catch{return!1}}function Va(){if(Fa()&&!It)try{It=new BroadcastChannel("ytls_timestamp_channel"),It.onmessage=qa}catch(i){l("Failed to create BroadcastChannel:",i,"warn"),It=null}}function Mn(i){if(!Fa()){l("Skipping BroadcastChannel message: not on https://www.youtube.com","warn");return}if(Va(),!It){l("No BroadcastChannel available to post message","warn");return}try{It.postMessage(i)}catch(u){l("BroadcastChannel error, reopening:",u,"warn");try{It=new BroadcastChannel("ytls_timestamp_channel"),It.onmessage=qa,It.postMessage(i)}catch(d){l("Failed to reopen BroadcastChannel:",d,"error")}}}function qa(i){if(l("Received message from another tab:",i.data),!(!a()||!s||!r)&&i.data){if(i.data.type==="timestamps_updated"&&i.data.videoId===Z())l("Debouncing timestamp load due to external update for video:",i.data.videoId),clearTimeout(co),co=setTimeout(()=>{l("Reloading timestamps due to external update for video:",i.data.videoId),mr()},500);else if(i.data.type==="window_position_updated"&&r){let u=i.data.position;if(u&&typeof u.x=="number"&&typeof u.y=="number"){r.style.left=`${u.x}px`,r.style.top=`${u.y}px`,r.style.right="auto",r.style.bottom="auto",typeof u.width=="number"&&u.width>0&&(r.style.width=`${u.width}px`),typeof u.height=="number"&&u.height>0&&(r.style.height=`${u.height}px`);let d=r.getBoundingClientRect();D({x:Math.round(u.x),y:Math.round(u.y),width:Math.round(d.width),height:Math.round(d.height)});let S=document.documentElement.clientWidth,x=document.documentElement.clientHeight;(d.left<0||d.top<0||d.right>S||d.bottom>x)&&Vn()}}}}Va();let Un=await _a(Ga);(typeof Un!="number"||Number.isNaN(Un))&&(Un=nd,await Oa(Ga,Un));let lo=await _a(Ua);(typeof lo!="number"||Number.isNaN(lo))&&(lo=od,await Oa(Ua,lo));let co=null,Nt=new Map,Ln=!1,H=null,Ko=null,gt=null,Ie=null,yt=null,Ke=null,Zt=null,mi=!1,_e=null,Cn=null,zt=null,ot=null,en=null,Yo=!1,fi=!1,Xo=null,Jo=null,Qo=null,Zo=null,er=null,tr=null,nr=null,or=null,uo=null,po=null,mo=null,vt=null,wt=null,ja=0,fo=!1,Bn=null,ho=null,Fn=null,$a=null,go=null;function rr(){if(!s)return{items:[],starts:[]};if($a!==s||!go?(go?.disconnect(),go=new MutationObserver(()=>{Fn=null}),go.observe(s,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-time"]}),$a=s,Fn=null):go.takeRecords().length>0&&(Fn=null),!Fn){let i=Nr(s),u=new Array(i.length);for(let d=0;d<i.length;d++){let S=i[d].querySelector("[data-time]")?.dataset.time;u[d]=S?Number.parseInt(S,10):NaN}Fn={items:i,starts:u}}return Fn}function Ce(){return rr().items}function hi(){return Zl(s)}function tn(){return ho!==null||(ho=ec(s)),ho}function nn(){ho=null}function ir(i=re(),u=Re()){let d=i?.getDuration?.();return Number.isFinite(d)&&d>0?d:Number.isFinite(u?.duration)&&u.duration>0?u.duration:0}function Wa(){return ir()||tn()}function rd(i){let u=i.querySelector(".time-diff");return u?(u.textContent?.trim()||"").startsWith("-"):!1}let id="\u251C\u2500 ",Ka="\u2514\u2500 ",Ya=/^[├└]─\s/;function ar(i){return Ya.test(i)}function Xa(i){return i.replace(Ya,"")}function Ja(i){let u=Ce();if(i>=u.length-1)return Ka;let x=u[i+1].querySelector("input");return x&&ar(x.value)?id:Ka}function ad(i,u){return`${Ja(u)}${i}`}function Mt(){if(!s)return;Ce().forEach((u,d)=>{let S=u.querySelector("input");if(!S||!ar(S.value))return;let x=Xa(S.value),A=ad(x,d);S.value!==A&&(S.value=A)})}function yo(){zr(s),Cn&&(Cn=null),ot&&(ot(),ot=null,zt=null)}function vo(){Ql(s,$())}function Qa(i){Vi(s,i)}function gi(){Yl(s)}function yi(i){if(Te={phase:i?"loading":"ready",videoId:Z()},!(!r||!s)){if(i)r.style.display="",r.classList.remove("ytls-fade-out"),r.classList.add("ytls-fade-in"),Qa("Loading timestamps...");else if(gi(),r.style.display="",r.classList.remove("ytls-fade-out"),r.classList.add("ytls-fade-in"),m){let u=re();if(u){let d=u.getCurrentTime(),S=Number.isFinite(d)?Math.max(0,Math.floor(d)):Math.max(0,tn());m.textContent=Pr(S,ir(u))}}!$()&&s&&!Bo(s)&&vo(),Gt()}}function sr(i,u){i.dataset.time=String(u),i.textContent=pn(u,Wa())}let lr=null,cr=null,Lt=!1;function Za(i,u){if(!i||typeof i.getVideoData!="function"||!(u!==void 0?u:!!i.getVideoData()?.isLive))return!1;if(typeof i.getProgressState=="function"){let S=i.getProgressState(),x=Number(S?.seekableEnd??S?.liveHead??S?.head??S?.duration),A=Number(S?.current??i.getCurrentTime?.());if(Number.isFinite(x)&&Number.isFinite(A))return x-A>2}return!1}function sd(i,u){if(!Number.isFinite(i))return;let d=es(i);vi(d,u)}function bt(i=!1,u){if(Ln&&!i)return;let d;if(typeof u=="number"&&Number.isFinite(u))d=Math.max(0,Math.floor(u));else{let S=re(),x=S?S.getCurrentTime():NaN;d=Number.isFinite(x)?Math.max(0,Math.floor(x)):Math.max(0,tn())}Number.isFinite(d)&&sd(d,i)}function es(i){if(!Number.isFinite(i))return null;let{items:u,starts:d}=rr(),S=-1,x=-1/0;for(let A=0;A<d.length;A++){let k=d[A];k<=i&&k>x&&(x=k,S=A)}return S>=0?u[S]:null}function vi(i,u=!1){let d=s?s.getElementsByClassName(Pe):null;if(!(!!d&&(i?d.length===1&&d[0]===i:d.length===0))&&d)for(let x of Array.from(d))x.classList.contains(We)||x.classList.remove(Pe);if(i&&!i.classList.contains(We)&&(i.classList.add(Pe),u))try{if(s instanceof HTMLElement){let x=i.getBoundingClientRect(),A=s.getBoundingClientRect();!(x.bottom<A.top||x.top>A.bottom)||i.scrollIntoView({behavior:"smooth",block:"center"})}else i.scrollIntoView({behavior:"smooth",block:"center"})}catch{try{i.scrollIntoView({behavior:"smooth",block:"center"})}catch{}}}function ld(i){if(St()||!Number.isFinite(i)||i===0)return!1;let u=Ce();if(u.length===0)return!1;let d=[];return u.forEach(S=>{let x=S.querySelector("[data-time]"),A=x?.dataset.time;if(!x||!A)return;let k=Number.parseInt(A,10);if(!Number.isFinite(k))return;let b=Math.max(0,k+i);if(b!==k){sr(x,b);let C=S.dataset.guid;C&&d.push({guid:C,start:b,comment:S.querySelector("input")?.value??""})}}),d.length===0?!1:(on(),Mt(),Ve(),wi(),rs(Z(),d),Bn=null,!0)}function ts(i,u={}){if(!Number.isFinite(i)||i===0)return!1;if(!ld(i)){if(u.alertOnNoChange){let k=u.failureMessage??"Offset did not change any timestamps.";alert(k)}return!1}let S=u.logLabel??"bulk offset";l(`Timestamps changed: Offset all timestamps by ${i>0?"+":""}${i} seconds (${S})`);let x=re(),A=x?Math.floor(x.getCurrentTime()):0;if(Number.isFinite(A)){let k=es(A);vi(k,!1)}return!0}function ns(i){if(!s||$())return;let u=i.target instanceof Element?i.target:null;if(!u)return;let d=u.closest("[data-time]"),S=u.closest("[data-increment]"),x=u.closest("[data-action]");if(d?.dataset.time){i.preventDefault();let A=Number(d.dataset.time);if(Number.isFinite(A)){l(`Seeking to timestamp ${A}`),Lt=!0;let b=re();b&&b.seekTo(A),setTimeout(()=>{Lt=!1},500)}let k=d.closest("li");k&&(Ce().forEach(b=>{b.classList.contains(We)||b.classList.remove(Pe)}),k.classList.contains(We)||(k.classList.add(Pe),k.scrollIntoView({behavior:"smooth",block:"center"})))}else if(S?.dataset.increment){i.preventDefault();let A=S.closest("li"),k=A?.querySelector("[data-time]");if(!k||!k.dataset.time)return;let b=parseInt(k.dataset.time,10),C=parseInt(S.dataset.increment,10);if("shiftKey"in i&&i.shiftKey&&(C*=lo),"altKey"in i?i.altKey:!1){ts(C,{logLabel:"Alt adjust"});return}let G=Math.max(0,b+C);if(l(`Timestamps changed: Timestamp time incremented from ${b} to ${G}`),nn(),sr(k,G),cr=G,lr&&clearTimeout(lr),Lt=!0,lr=setTimeout(()=>{if(cr!==null){let oe=re();oe&&oe.seekTo(cr)}lr=null,cr=null,setTimeout(()=>{Lt=!1},500)},500),on(),Mt(),Ve(),A){let oe=A.querySelector("input"),we=A.dataset.guid;oe&&we&&(pr(Z(),we,G,oe.value),Bn=we)}}else x?.dataset.action==="clear"&&(i.preventDefault(),l("Timestamps changed: All timestamps cleared from UI"),s.textContent="",nn(),Ve(),ur(),dd(),pe([]),ud(Z()),Bn=null,vo())}function wo(i,u="",d=!1,S=null,x=!0){if(!s)return null;let A=Math.max(0,i),k=S??crypto.randomUUID(),b=document.createElement("li"),C=document.createElement("div"),L=document.createElement("span"),P=document.createElement("span"),G=document.createElement("span"),oe=document.createElement("div"),we=document.createElement("span"),ct=document.createElement("span"),J=document.createElement("input"),ie=document.createElement("button");b.dataset.guid=k,C.className="time-row",oe.className="ytls-row-controls";let Oe=document.createElement("div");Oe.style.cssText="position:absolute;left:0;top:0;width:20px;height:20px;display:flex;align-items:center;justify-content:center;cursor:pointer;",Be(Oe,"Click to toggle indent");let rt=document.createElement("span");rt.style.cssText="color:#f4ba78;pointer-events:none;display:none;line-height:0;";let xt=()=>{let V=J.offsetTop,N=J.offsetHeight||20;Oe.style.top=`${V}px`,Oe.style.height=`${N}px`},Ct=()=>{Ge(rt,ar(J.value)?"indent-decrease":"indent-increase",18)},qn="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",rn=V=>{let N=rt.querySelector("svg");N&&(N.style.transition="filter 0.15s ease",N.style.filter=V?qn:"none")},jn=V=>{V.stopPropagation();let N=ar(J.value),ue=Xa(J.value),ee="";if(!N){let ut=Ce().indexOf(b);ee=Ja(ut)}J.value=ee?`${ee}${ue}`:ue,Ct(),Mt();let ge=Number.parseInt(we.dataset.time??"0",10);pr(Z(),k,ge,J.value)};Oe.onclick=jn,Oe.append(rt),Oe.addEventListener("mouseenter",()=>{rn(!0)}),Oe.addEventListener("mouseleave",()=>{rn(!1)}),b.style.cssText="position:relative;padding-left:20px;",b.addEventListener("mouseenter",()=>{xt(),Ct(),rt.style.display="inline"}),b.addEventListener("mouseleave",()=>{rn(!1),rt.style.display="none"}),b.addEventListener("mouseleave",()=>{b.dataset.guid===Bn&&rd(b)&&os()}),J.value=u||"",J.style.cssText="width:100%;margin-top:5px;display:block;",J.type="text",J.setAttribute("inputmode","text"),J.autocapitalize="off",J.autocomplete="off",J.spellcheck=!1,requestAnimationFrame(xt);let xo=!1;J.addEventListener("focusin",()=>{fo=!1,xo=!1}),J.addEventListener("focusout",V=>{let N=V.relatedTarget,ue=Date.now()-ja<250,ee=!!N&&!!r&&r.contains(N);!ue&&!ee&&!xo&&(fo=!0,setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(J.focus({preventScroll:!0}),fo=!1)},0))}),J.addEventListener("keydown",V=>{(V.key==="Escape"||V.key==="Esc")&&(V.preventDefault(),xo=!0,J.blur())});let ko=V=>{let N=Nt.get(k);N&&clearTimeout(N.timeoutId);let ue=Z(),ee=()=>{let ge=Nt.get(k);ge&&(clearTimeout(ge.timeoutId),Nt.delete(k)),is(ue,k,Number.parseInt(we.dataset.time??"0",10),J.value)};Nt.set(k,{timeoutId:setTimeout(ee,V),flush:ee})};J.addEventListener("input",V=>{let N=V;N&&(N.isComposing||N.inputType==="insertCompositionText")||ko(500)}),J.addEventListener("compositionend",()=>{ko(50)});let Ut="#f4ba78",hr="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",gr="#c8452d",yr="drop-shadow(0 0 4px #e36a52) drop-shadow(0 0 8px #e36a52)",Pn=(V,N=Ut,ue=hr)=>{V.style.color=N;let ee=V.querySelector("svg");ee&&(ee.style.transition="filter 0.15s ease"),V.addEventListener("mouseenter",()=>{ee&&(ee.style.filter=ue)}),V.addEventListener("mouseleave",()=>{ee&&(ee.style.filter="none")})};Ge(L,"circle-minus",18),L.classList.add("ytls-row-control"),L.dataset.increment="-1",L.style.cursor="pointer",L.style.margin="0px",Pn(L),Ge(G,"circle-plus",18),G.classList.add("ytls-row-control"),G.dataset.increment="1",G.style.cursor="pointer",G.style.margin="0px",Pn(G),Ge(P,"current-location",18),P.classList.add("ytls-row-control"),P.style.cursor="pointer",P.style.margin="0px",Be(P,"Set to current playback time"),Pn(P),P.onclick=()=>{let V=re(),N=V?Math.floor(V.getCurrentTime()):0;Number.isFinite(N)&&(l(`Timestamps changed: set to current playback time ${N}`),nn(),sr(we,N),on(),Mt(),pr(Z(),k,N,J.value),Bn=k)},nn(),sr(we,A),we.addEventListener("click",V=>{V.preventDefault(),V.stopPropagation();let N=Number(we.dataset.time);if(!Number.isFinite(N))return;l(`Seeking to timestamp ${N}`),Lt=!0;let ue=re();ue&&ue.seekTo(N);let ee=Re();ee?.paused&&ee.play(),setTimeout(()=>{Lt=!1},500),s?.querySelectorAll(`.${Pe}`).forEach(ge=>ge.classList.remove(Pe)),b.classList.contains(We)||(b.classList.add(Pe),b.scrollIntoView({behavior:"smooth",block:"center"}))}),Ge(ie,"trash",16),ie.classList.add("ytls-row-control"),ie.style.cssText="background:transparent;border:none;cursor:pointer;margin-left:5px;display:inline-flex;align-items:center;",Pn(ie,gr,yr),ie.onclick=()=>{let V=null,N=null,ue=null,ee=()=>{try{b.removeEventListener("click",N,!0)}catch{}try{document.removeEventListener("click",N,!0)}catch{}if(s)try{s.removeEventListener("mouseleave",ue)}catch{}V&&(clearTimeout(V),V=null)};if(b.dataset.deleteConfirmed==="true"){l("Timestamps changed: Timestamp deleted");let ge=b.dataset.guid??"",qe=Nt.get(ge);qe&&(clearTimeout(qe.timeoutId),Nt.delete(ge)),ee(),b.remove(),nn(),on(),Mt(),Ve(),ur(),pd(Z(),ge),Bn=null,vo()}else{b.dataset.deleteConfirmed="true",b.classList.add(We),b.classList.remove(Pe);let ge=()=>{b.dataset.deleteConfirmed="false",b.classList.remove(We);let qe=re(),ut=qe?qe.getCurrentTime():0,Bt=Number.parseInt(b.querySelector("[data-time]")?.dataset.time??"0",10);Number.isFinite(ut)&&Number.isFinite(Bt)&&ut>=Bt&&b.classList.add(Pe),ee()};N=qe=>{qe.target!==ie&&ge()},ue=()=>{b.dataset.deleteConfirmed==="true"&&ge()},b.addEventListener("click",N,!0),document.addEventListener("click",N,!0),s&&s.addEventListener("mouseleave",ue),V=setTimeout(()=>{b.dataset.deleteConfirmed==="true"&&ge(),ee()},5e3)}},ct.className="time-diff",ct.style.color="#888",ct.style.marginLeft="5px",oe.append(L,P,G,ie),C.append(we,oe,ct),b.append(Oe,C,J);let vr=Number.parseInt(we.dataset.time??"0",10);if(x){gi();let V=!1,N=Ce();for(let ue=0;ue<N.length;ue++){let ee=N[ue],qe=ee.querySelector("[data-time]")?.dataset.time;if(!qe)continue;let ut=Number.parseInt(qe,10);if(Number.isFinite(ut)&&vr<ut){s.insertBefore(b,ee),V=!0;break}}V||s.appendChild(b),b.scrollIntoView({behavior:"smooth",block:"center"}),nn(),on(),ur(),Mt(),Ve(),d||(pr(Z(),k,A,u),Bn=k,vi(b,!1))}else J.__ytls_li=b;return J}function on(){if(St())return;let i=Wa(),u=Ce();u.forEach((d,S)=>{let x=d.querySelector(".time-diff"),A=d.querySelector("[data-time]"),k=A?.dataset.time;if(A&&k){let ct=Number.parseInt(k,10);Number.isFinite(ct)&&(A.textContent=pn(ct,i))}if(!x)return;if(!k){x.textContent="";return}let b=Number.parseInt(k,10);if(!Number.isFinite(b)){x.textContent="";return}if(S===0){x.textContent="";return}let P=u[S-1].querySelector("[data-time]")?.dataset.time;if(!P){x.textContent="";return}let G=Number.parseInt(P,10);if(!Number.isFinite(G)){x.textContent="";return}let oe=b-G,we=oe<0?"-":"";x.textContent=` ${we}${pn(Math.abs(oe))}`})}function os(){if(St())return;let i=null;if(document.activeElement instanceof HTMLInputElement&&s.contains(document.activeElement)){let k=document.activeElement,C=k.closest("li")?.dataset.guid;if(C){let L=k.selectionStart??k.value.length,P=k.selectionEnd??L,G=k.scrollLeft;i={guid:C,start:L,end:P,scroll:G}}}let u=Ce();if(u.length===0)return;let d=u.map(k=>k.dataset.guid),S=u.map(k=>{let b=k.querySelector("[data-time]"),C=b?.dataset.time;if(!b||!C)return null;let L=Number.parseInt(C,10);if(!Number.isFinite(L))return null;let P=k.dataset.guid??"";return{time:L,guid:P,element:k}}).filter(k=>k!==null).sort((k,b)=>{let C=k.time-b.time;return C!==0?C:k.guid.localeCompare(b.guid)}),x=S.map(k=>k.guid),A=d.length!==x.length||d.some((k,b)=>k!==x[b]);if(s.replaceChildren(),S.forEach(k=>{s.appendChild(k.element)}),on(),Mt(),Ve(),i){let b=Ce().find(C=>C.dataset.guid===i.guid)?.querySelector("input");if(b)try{b.focus({preventScroll:!0})}catch{}}A&&(l("Timestamps changed: Timestamps sorted"),wi())}function ur(){if(!s||!r||!c||!h)return;let i=Ce().length;_e?.();let u=me(r,c,h);i===0?(vo(),s.style.overflowY="hidden"):s.style.overflowY=s.scrollHeight>u?"auto":"hidden"}function Ve(){if(!s)return;let i=Re(),u=document.querySelector(".ytp-progress-bar"),d=re(),S=d?d.getVideoData():null,x=!!S&&!!S.isLive;if(!i||!u||!isFinite(i.duration)||x)return;ss();let{items:A,starts:k}=rr(),b=i.duration,C=document.createDocumentFragment();A.forEach((L,P)=>{let G=k[P];if(!Number.isFinite(G))return;L.dataset.guid||(L.dataset.guid=crypto.randomUUID());let oe=document.createElement("div");oe.className="ytls-marker",oe.style.left=G/b*100+"%",oe.dataset.time=String(G),C.appendChild(oe)}),u.appendChild(C),cd(u)}function cd(i){i.dataset.ytlsMarkerClicks||(i.dataset.ytlsMarkerClicks="1",i.addEventListener("click",u=>{let d=u.target?.closest?.(".ytls-marker");if(!d)return;let S=Number(d.dataset.time),x=re();x&&Number.isFinite(S)&&x.seekTo(S)}))}function wi(){pe(hi().sort((i,u)=>i.start-u.start))}function rs(i,u){!i||u.length===0||$()||St()||(wd(i,u).then(()=>{l(`Saved ${u.length} timestamps for ${i} to IndexedDB`),s&&bo()}).catch(d=>{let S=`Failed to save timestamps: ${d.message}`;l(`Failed to save timestamps for ${i} to IndexedDB:`,d,"error"),Dn(S)}),Mn({type:"timestamps_updated",videoId:i,action:"saved"}))}function ud(i){!i||$()||St()||(ls(i).then(()=>{s&&bo()}).catch(u=>{let d=`Failed to clear timestamps: ${u.message}`;l(`Failed to clear timestamps for ${i}:`,u,"error"),Dn(d)}),Mn({type:"timestamps_updated",videoId:i,action:"saved"}))}function dr(){for(let{flush:i}of[...Nt.values()])i()}function dd(){Nt.forEach(({timeoutId:i})=>clearTimeout(i)),Nt.clear()}function pr(i,u,d,S){!i||$()||St()||is(i,u,d,S)}function is(i,u,d,S){if(!i)return;let x={guid:u,start:d,comment:S};l(`Saving timestamp: guid=${u}, start=${d}, comment="${S}"`),bd(i,x).then(()=>{s&&bo()}).catch(A=>{let k=`Failed to save timestamp: ${A.message}`;l(`Failed to save timestamp ${u}:`,A,"error"),Dn(k)}),Mn({type:"timestamps_updated",videoId:i,action:"saved"})}function pd(i,u){!i||$()||St()||(Sd(i,u).then(()=>{s&&bo()}).catch(d=>{let S=`Failed to delete timestamp: ${d.message}`;l(`Failed to delete timestamp ${u}:`,d,"error"),Dn(S)}),Mn({type:"timestamps_updated",videoId:i,action:"saved"}))}async function as(i){if(St()){alert("Cannot export timestamps while an error is being displayed.");return}let u=Z();if(!u)return;l(`Exporting timestamps for video ID: ${u}`);let d=hi(),S=_n();if(i==="json"){let x=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),A=URL.createObjectURL(x),k=document.createElement("a");k.href=A,k.download=`timestamps-${u}-${S}.json`,k.click(),URL.revokeObjectURL(A)}else if(i==="text"){let x=Ci(d,!0),A=new Blob([x],{type:"text/plain"}),k=URL.createObjectURL(A),b=document.createElement("a");b.href=k,b.download=`timestamps-${u}-${S}.txt`,b.click(),URL.revokeObjectURL(k)}}function Dn(i){if(!r||!s){l("Timekeeper error:",i,"error");return}Xl(s,i),Xi(i),Ve()}function bo(){s&&(Jl(s),Xi(null))}function St(){return!!(!s||Bo(s)||$()||sc()!==null)}function ss(){document.querySelectorAll(".ytls-marker").forEach(i=>i.remove())}function Vn(){if(!r||!document.body.contains(r))return;let i=r.getBoundingClientRect(),u=document.documentElement.clientWidth,d=document.documentElement.clientHeight,S=i.width,x=i.height;if(i.left<0&&(r.style.left="0",r.style.right="auto"),i.right>u){let A=Math.max(0,u-S);r.style.left=`${A}px`,r.style.right="auto"}if(i.top<0&&(r.style.top="0",r.style.bottom="auto"),i.bottom>d){let A=Math.max(0,d-x);r.style.top=`${A}px`,r.style.bottom="auto"}}function md(){if(Xo&&(document.removeEventListener("mousemove",Xo),Xo=null),Jo&&(document.removeEventListener("mouseup",Jo),Jo=null),uo&&(document.removeEventListener("keydown",uo),uo=null),Qo&&(window.removeEventListener("resize",Qo),Qo=null),po&&(document.removeEventListener("pointerdown",po,!0),po=null),mo&&(document.removeEventListener("pointerup",mo,!0),mo=null),vt){try{vt.disconnect()}catch{}vt=null}if(wt){try{wt.disconnect()}catch{}wt=null}let i=Re();i&&(Zo&&(i.removeEventListener("timeupdate",Zo),Zo=null),er&&(i.removeEventListener("pause",er),er=null),tr&&(i.removeEventListener("play",tr),tr=null),nr&&(i.removeEventListener("seeking",nr),nr=null),or&&(i.removeEventListener("ratechange",or),or=null))}function fd(){ss(),dr(),co&&(clearTimeout(co),co=null),ze&&(clearInterval(ze),ze=null),gt&&(clearTimeout(gt),gt=null),md(),xl();try{It.close()}catch{}if(H&&H.parentNode===document.body&&document.body.removeChild(H),H=null,Ko=null,Ln=!1,he++,Te={phase:"unloaded"},vt){try{vt.disconnect()}catch{}vt=null}if(wt){try{wt.disconnect()}catch{}wt=null}r&&r.parentNode&&r.remove();let i=document.getElementById("ytls-header-button");i&&i.parentNode&&i.remove(),en=null,Yo=!1,D(null),yo(),r=null,c=null,s=null,h=null,Ke=null,Zt=null,_e=null,m=null,v=null,y=null,R=null,In=null}async function hd(){let i=So();if(!i)return In=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let u=await td();if(!ui(u)){let d=ed(u),S=d.length?` Missing methods: ${d.join(", ")}.`:"",x=u?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return In=null,{ok:!1,message:`${x}${S} Try refreshing once playback is ready.`}}return In=u,{ok:!0,player:u,videoId:i}}async function mr(){if(!r||!s)return;let i=he,u=s.scrollTop,d=!0,S=()=>{if(!s||!d)return;let x=Math.max(0,s.scrollHeight-s.clientHeight);s.scrollTop=Math.min(u,x)};try{let x=await hd();if(i!==he)return;if(!x.ok){Dn(x.message),yo(),Ve();return}let{videoId:A}=x,k=[];try{let b=await xd(A);if(i!==he)return;b?(k=b.map(C=>({...C,guid:C.guid||crypto.randomUUID()})),l(`Loaded ${k.length} timestamps from IndexedDB for ${A}`),bo()):l(`No timestamps found in IndexedDB for ${A}`)}catch(b){let C=`Failed to load timestamps: ${b.message}`;l(`Failed to load timestamps from IndexedDB for ${A}:`,b,"error"),Dn(C),Ve();return}if(k.length>0){k.sort((L,P)=>L.start-P.start),yo(),gi();let b=document.createDocumentFragment();k.forEach(L=>{let G=wo(L.start,L.comment,!0,L.guid,!1).__ytls_li;G&&b.appendChild(G)}),r&&r.classList.contains("ytls-zoom-in")&&Ie!=null?(l("Deferring timestamp DOM append until show animation completes"),Cn=b,zt||(zt=new Promise(L=>{ot=L})),await zt):s&&(s.appendChild(b),nn(),on(),Mt(),Ve(),_e&&requestAnimationFrame(_e)),pe(k),bt(!0),d=!1}else yo(),Qa("No timestamps for this video"),Ve(),pe([]),_e&&requestAnimationFrame(_e)}catch(x){l("Unexpected error while loading timestamps:",x,"error"),Dn("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{zt&&await zt,requestAnimationFrame(S),_e&&requestAnimationFrame(_e),s&&!Bo(s)&&vo()}}function So(){let u=new URLSearchParams(location.search).get("v");if(u)return u;let d=document.querySelector('meta[itemprop="identifier"]');return d?.content?d.content:null}function gd(i=null,u=null){if(!m)return;let d=Re(),S=u||re();if(!d&&!S)return;let x=i!==null?i:S?S.getCurrentTime():0,A=Number.isFinite(x)?Math.max(0,Math.floor(x)):Math.max(0,tn()),{isLive:k}=S?S.getVideoData()||{isLive:!1}:{isLive:!1},b=S?Za(S,!!k):!1;m.textContent=Pr(A,ir(S,d)),m.style.color=b?"#ff4d4f":""}function yd(){let i=Re();if(!i)return;let u=NaN,d=null,S=()=>{if(!s)return;let L=re(),P=L?Math.floor(L.getCurrentTime()):0;if(!Number.isFinite(P))return;let G=rr();if(P===u&&G===d)return;let oe=!!m&&!$()&&!Lt;oe&&gd(P,L),bt(!1,P),oe&&!Ln&&(u=P,d=G)},x=L=>{try{let P=new URL(window.location.href);L!==null&&Number.isFinite(L)?P.searchParams.set("t",`${Math.floor(L)}s`):P.searchParams.delete("t"),window.history.replaceState(window.history.state,"",P.toString())}catch{}},A=()=>{let L=re(),P=L?L.getCurrentTime():NaN,G=Number.isFinite(P)?Math.max(0,Math.floor(P)):Math.max(0,tn());if(Number.isFinite(G)){x(G);try{bt(!0)}catch(oe){l("Failed to highlight nearest timestamp on pause:",oe,"warn")}}},k=()=>{x(null);try{let L=re(),P=L?L.getCurrentTime():NaN,G=Number.isFinite(P)?Math.max(0,Math.floor(P)):Math.max(0,tn());Number.isFinite(G)&&bt(!0)}catch(L){l("Failed to highlight nearest timestamp on play:",L,"warn")}},b=()=>{let L=Re();if(!L)return;let P=re(),G=P?Math.floor(P.getCurrentTime()):0;Number.isFinite(G)&&(L.paused&&x(G),bt(!0,G))},C=()=>{let L=i.playbackRate;M?M=!1:Ju(L),ci(L)};Zo=S,er=A,tr=k,nr=b,or=C,i.addEventListener("timeupdate",S),i.addEventListener("pause",A),i.addEventListener("play",k),i.addEventListener("seeking",b),i.addEventListener("ratechange",C)}let{saveToIndexedDB:vd,saveRowsToIndexedDB:wd,saveSingleTimestampToIndexedDB:bd,deleteSingleTimestampFromIndexedDB:Sd,loadFromIndexedDB:xd,removeFromIndexedDB:ls,saveGlobalSettings:fr,loadGlobalSettings:bi,buildExportPayload:kd,mergeBackupData:Td,exportAllTimestamps:Ad,exportAllTimestampsCsv:Ed}=Hr;function cs(){if(!r)return;let i=r.style.display!=="none";fr("uiVisible",i)}function Gt(i){let u=typeof i=="boolean"?i:!!r&&r.style.display!=="none",d=document.getElementById("ytls-header-button");if(d instanceof HTMLButtonElement&&d.setAttribute("aria-pressed",String(u)),en&&!Yo){let S=Xu();en.src!==S&&(en.src=S)}}function Id(){r&&bi("uiVisible").then(i=>{let u=Dt().safeParse(i),d=u.success?u.data:void 0;typeof d=="boolean"?(d?(r.style.display="flex",r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in")):r.style.display="none",Gt(d)):(!u.success&&i!==void 0&&l("UI visibility state failed validation, defaulting to visible",u.error.message,"warn"),r.style.display="flex",r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in"),Gt(!0))}).catch(i=>{l("Failed to load UI visibility state:",i,"error"),r.style.display="flex",r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in"),Gt(!0)})}function Si(i){if(!r){l("ERROR: togglePaneVisibility called but pane is null");return}document.body.contains(r)||(l("Pane not in DOM during toggle, appending it"),document.querySelectorAll("#ytls-pane").forEach(x=>{x!==r&&x.remove()}),document.body.appendChild(r));let u=document.querySelectorAll("#ytls-pane");u.length>1&&(l(`ERROR: Multiple panes detected in togglePaneVisibility (${u.length}), cleaning up`),u.forEach(x=>{x!==r&&x.remove()})),gt&&(clearTimeout(gt),gt=null);let d=r.style.display==="none";(typeof i=="boolean"?i:d)?(r.style.display="flex",r.classList.remove("ytls-fade-out"),r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in"),Gt(!0),cs(),ke(),Ie&&(clearTimeout(Ie),Ie=null),Ie=setTimeout(()=>{De(),_e?.(),Le(),Ee(!0);try{bt(!0)}catch(x){l("Failed to scroll to nearest timestamp after toggle:",x,"warn")}Ie=null},450)):(r.classList.remove("ytls-fade-in"),r.classList.remove("ytls-zoom-in"),r.classList.add("ytls-zoom-out"),Gt(!1),kn())}function us(i){if(!s){l("UI is not initialized; cannot import timestamps.","warn");return}let u=!1,d=[],S=(x,A)=>{let k=x.querySelector("input");if(!k)return;k.value=A;let b=x.dataset.guid,C=Number.parseInt(x.querySelector("[data-time]")?.dataset.time??"",10);b&&Number.isFinite(C)&&d.push({guid:b,start:C,comment:A})};try{let x=JSON.parse(i),A=null;if(Array.isArray(x))A=x;else if(typeof x=="object"&&x!==null){let k=Z();if(k){let b=`timekeeper-${k}`;x[b]&&Array.isArray(x[b].timestamps)&&(A=x[b].timestamps,l(`Found timestamps for current video (${k}) in export format`,"info"))}if(!A){let b=Object.keys(x).filter(C=>C.startsWith("ytls-"));if(b.length===1&&Array.isArray(x[b[0]].timestamps)){A=x[b[0]].timestamps;let C=x[b[0]].video_id;l(`Found timestamps for video ${C} in export format`,"info")}}}A&&Array.isArray(A)?A.every(b=>typeof b.start=="number"&&typeof b.comment=="string")?(A.forEach(b=>{if(b.guid){let C=Ce().find(L=>L.dataset.guid===b.guid);C?S(C,b.comment):wo(b.start,b.comment,!1,b.guid)}else wo(b.start,b.comment,!1,crypto.randomUUID())}),u=!0):l("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):l("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!u){let x=i.split(`
`).map(A=>A.trim()).filter(A=>A);if(x.length>0){let A=!1;x.forEach(k=>{let b=k.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(b){A=!0;let C=parseInt(b[1])||0,L=parseInt(b[2]),P=parseInt(b[3]),G=C*3600+L*60+P,oe=b[4]?b[4].trim():"",we=null,ct=oe,J=oe.match(/<!--\s*guid:([^>]+?)\s*-->/);J&&(we=J[1].trim(),ct=oe.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let ie;we&&(ie=Ce().find(Oe=>Oe.dataset.guid===we)),!ie&&!we&&(ie=Ce().find(Oe=>{if(Oe.dataset.guid)return!1;let xt=Oe.querySelector("[data-time]")?.dataset.time;if(!xt)return!1;let Ct=Number.parseInt(xt,10);return Number.isFinite(Ct)&&Ct===G})),ie?S(ie,ct):wo(G,ct,!1,we||crypto.randomUUID())}}),A&&(u=!0)}}u?(l("Timestamps changed: Imported timestamps from file/clipboard"),Mt(),wi(),rs(Z(),d),Ve(),ur()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function Md(){if(fi){l("Pane initialization already in progress, skipping duplicate call");return}if(!(r&&document.body.contains(r))){fi=!0;try{let x=function(p=null,g=null){if(!m)return;let w=Re(),T=g||re();if(!w&&!T)return;let I=p!==null?p:T?T.getCurrentTime():0,W=Number.isFinite(I)?Math.max(0,Math.floor(I)):Math.max(0,tn()),{isLive:_}=T?T.getVideoData()||{isLive:!1}:{isLive:!1},z=T?Za(T,!!_):!1;m.textContent=Pr(W,ir(T,w)),m.style.color=z?"#ff4d4f":"",S(!!_);try{ci()}catch{}},A=function(){if($()||Lt)return;let p=re();if(!p)return;let g=p.getCurrentTime(),w=Number.isFinite(g)?Math.max(0,Math.floor(g)):Math.max(0,tn());x(w,p),(s?Ce():[]).length>0&&bt(!1,w)},ie=function(p,g,w,T){let I=document.createElement("button");return T?Y(I,T,p):I.textContent=p,Be(I,g),I.classList.add("ytls-settings-modal-button"),I.onclick=w,I},Oe=function(p="general"){if(H&&H.parentNode===document.body){let se=document.getElementById("ytls-save-modal"),un=document.getElementById("ytls-load-modal"),qt=document.getElementById("ytls-delete-all-modal");se&&document.body.contains(se)&&document.body.removeChild(se),un&&document.body.contains(un)&&document.body.removeChild(un),qt&&document.body.contains(qt)&&document.body.removeChild(qt),H.classList.remove("ytls-fade-in"),H.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(H)&&document.body.removeChild(H),H=null,document.removeEventListener("click",xt,!0),document.removeEventListener("keydown",rt)},300);return}H=document.createElement("div"),H.id="ytls-settings-modal",H.classList.remove("ytls-fade-out"),H.classList.add("ytls-fade-in");let g=document.createElement("div");g.className="ytls-modal-header";let w=document.createElement("div");w.id="ytls-settings-nav";let T=document.createElement("button");T.className="ytls-modal-close-button",Ge(T,"x",14),T.onclick=()=>{if(H&&H.parentNode===document.body){let se=document.getElementById("ytls-save-modal"),un=document.getElementById("ytls-load-modal"),qt=document.getElementById("ytls-delete-all-modal");se&&document.body.contains(se)&&document.body.removeChild(se),un&&document.body.contains(un)&&document.body.removeChild(un),qt&&document.body.contains(qt)&&document.body.removeChild(qt),H.classList.remove("ytls-fade-in"),H.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(H)&&document.body.removeChild(H),H=null,document.removeEventListener("click",xt,!0),document.removeEventListener("keydown",rt)},300)}};let I=document.createElement("div");I.id="ytls-settings-content";let W=document.createElement("h3");W.className="ytls-section-heading",W.textContent="General",W.style.display="none";let _=document.createElement("div"),z=document.createElement("div");z.className="ytls-button-grid";let B=document.createElement("div");B.className="ytls-button-grid";function Q(se){_.style.display=se==="general"?"block":"none",z.style.display=se==="google"?"block":"none",B.style.display=se==="sync"?"block":"none",ae.classList.toggle("active",se==="general"),Xe.classList.toggle("active",se==="google"),kt.classList.toggle("active",se==="sync"),W.textContent=se==="general"?"General":se==="google"?"Google":"Sync"}let ae=document.createElement("button");ae.appendChild(Rn("adjustments-horizontal",16));let Ye=document.createElement("span");Ye.className="ytls-tab-text",Ye.textContent=" General",ae.appendChild(Ye),Be(ae,"General settings"),ae.classList.add("ytls-settings-modal-button"),ae.onclick=()=>Q("general");let Xe=document.createElement("button");Xe.appendChild(Rn("cloud",16));let sn=document.createElement("span");sn.className="ytls-tab-text",sn.textContent=" Google",Xe.appendChild(sn),Be(Xe,"Google Drive backup settings"),Xe.classList.add("ytls-settings-modal-button"),Xe.onclick=async()=>{ht.isSignedIn&&await Fu(),Q("google")};let kt=document.createElement("button");kt.appendChild(Rn("server",16));let ln=document.createElement("span");ln.className="ytls-tab-text",ln.textContent=" Sync",kt.appendChild(ln),Be(kt,"Live sync across devices"),kt.classList.add("ytls-settings-modal-button"),kt.onclick=()=>Q("sync"),w.appendChild(ae),w.appendChild(Xe),w.appendChild(kt),g.appendChild(w),g.appendChild(T),H.appendChild(g),_.className="ytls-button-grid",_.appendChild(ie("Save","Save As...",Ct.onclick,"device-floppy")),_.appendChild(ie("Load","Load",qn.onclick,"folder-open")),_.appendChild(ie("Export All","Export All Data",rn.onclick,"file-export")),_.appendChild(ie("Import All","Import All Data",jn.onclick,"file-import")),_.appendChild(ie("Export All (CSV)","Export All Timestamps to CSV",async()=>{try{await Ed()}catch{alert("Failed to export CSV: Could not read from database.")}},"file-spreadsheet"));let Ft=ie(ht.isSignedIn?"Sign Out":"Sign In",ht.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{ht.isSignedIn?await Uu():await zu(),Y(Ft,ht.isSignedIn?"logout":"login",ht.isSignedIn?"Sign Out":"Sign In"),Be(Ft,ht.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),Ae()},ht.isSignedIn?"logout":"login"),To=ie($o()?"Auto Backup: On":"Auto Backup: Off","Toggle Auto Backup",async()=>{await Ku(),Ar(),Ae()},"refresh"),xs=ie(`Backup Interval: ${Sn()}min`,"Set periodic backup interval (minutes)",async()=>{await Yu(),Ar(),Ae()},"clock-plus"),Ar=()=>{Y(Ft,ht.isSignedIn?"logout":"login",ht.isSignedIn?"Sign Out":"Sign In"),Be(Ft,ht.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),Y(To,"refresh",$o()?"Auto Backup: On":"Auto Backup: Off"),Y(xs,"clock-plus",`Backup Interval: ${Sn()}min`),typeof Ae=="function"&&Ae()};z.appendChild(Ft),z.appendChild(To),z.appendChild(xs),z.appendChild(ie("Backup Now","Run a backup immediately",async()=>{await jo({silent:!1,skipBackoff:!0}),Ar()},"database"));let Vt=document.createElement("div");Vt.style.marginTop="15px",Vt.style.paddingTop="10px",Vt.style.borderTop="1px solid #555",Vt.style.fontSize="12px",Vt.style.color="#aaa";let Er=document.createElement("div");Er.style.marginBottom="8px",Er.style.fontWeight="bold",Vt.appendChild(Er),Lu(Er);let Ai=document.createElement("div");Ai.style.marginBottom="8px",Iu(Ai),Vt.appendChild(Ai);let ks=document.createElement("div");Mu(ks),Vt.appendChild(ks),z.appendChild(Vt),nt(),so(),Ae(),Ar();let Ir=ie("Sign In","Sign in to Timekeeper Sync with Google",async()=>{$e().isSignedIn?await hu():await mu()},"login"),Ts=ie("Sync Now","Sync with the server immediately",()=>ka(),"refresh");Zc(()=>{let se=$e().isSignedIn;Y(Ir,se?"logout":"login",se?"Sign Out":"Sign In"),Be(Ir,se?"Sign out of Timekeeper Sync":"Sign in to Timekeeper Sync with Google"),Ir.disabled=!se&&!Nn(),Ts.disabled=!se}),B.appendChild(Ir),B.appendChild(Ts);let cn=document.createElement("div");cn.style.marginTop="15px",cn.style.paddingTop="10px",cn.style.borderTop="1px solid #555",cn.style.fontSize="12px",cn.style.color="#aaa";let Mr=document.createElement("div");Mr.style.marginBottom="8px",Mr.style.fontWeight="bold",cn.appendChild(Mr),Jc(Mr);let As=document.createElement("div");cn.appendChild(As),Qc(As),B.appendChild(cn),zo(),I.appendChild(W),I.appendChild(_),I.appendChild(z),I.appendChild(B),Q(p==="drive"?"google":p),H.appendChild(I),document.body.appendChild(H),requestAnimationFrame(()=>{let se=H.getBoundingClientRect(),qt=(window.innerHeight-se.height)/2;H.style.top=`${Math.max(20,qt)}px`,H.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",xt,!0),document.addEventListener("keydown",rt)},0)},rt=function(p){if(p.key==="Escape"&&H&&H.parentNode===document.body){let g=document.getElementById("ytls-save-modal"),w=document.getElementById("ytls-load-modal"),T=document.getElementById("ytls-delete-all-modal");if(g||w||T)return;p.preventDefault(),g&&document.body.contains(g)&&document.body.removeChild(g),w&&document.body.contains(w)&&document.body.removeChild(w),T&&document.body.contains(T)&&document.body.removeChild(T),H.classList.remove("ytls-fade-in"),H.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(H)&&document.body.removeChild(H),H=null,document.removeEventListener("click",xt,!0),document.removeEventListener("keydown",rt)},300)}},xt=function(p){if(Ko&&Ko.contains(p.target))return;let g=document.getElementById("ytls-save-modal"),w=document.getElementById("ytls-load-modal"),T=document.getElementById("ytls-delete-all-modal");g&&g.contains(p.target)||w&&w.contains(p.target)||T&&T.contains(p.target)||H&&H.contains(p.target)||(g&&document.body.contains(g)&&document.body.removeChild(g),w&&document.body.contains(w)&&document.body.removeChild(w),T&&document.body.contains(T)&&document.body.removeChild(T),H&&H.parentNode===document.body&&(H.classList.remove("ytls-fade-in"),H.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(H)&&document.body.removeChild(H),H=null,document.removeEventListener("click",xt,!0),document.removeEventListener("keydown",rt)},300)))},xo=function(){r&&(l("Loading window position from IndexedDB"),bi("windowPosition").then(p=>{let g=Ms.safeParse(p);if(g.success){let T=g.data;r.style.left=`${T.x}px`,r.style.top=`${T.y}px`,r.style.right="auto",r.style.bottom="auto",typeof T.width=="number"&&T.width>0?r.style.width=`${T.width}px`:(r.style.width=`${di}px`,l(`No stored window width found, using default width ${di}px`)),typeof T.height=="number"&&T.height>0?r.style.height=`${T.height}px`:(r.style.height=`${pi}px`,l(`No stored window height found, using default height ${pi}px`));let I=fe();lt(I,T.x,T.y),l("Restored window position from IndexedDB:",F())}else g.success?l("No window position found in IndexedDB, applying default size and leaving default position"):l("Window position in IndexedDB failed validation:",g.error.message,"warn"),r.style.width=`${di}px`,r.style.height=`${pi}px`,D(null);Vn();let w=fe();w&&(w.width||w.height)&&lt(w),_e?.()}).catch(p=>{l("failed to load pane position from IndexedDB:",p,"warn"),Vn();let g=fe();g&&(g.width||g.height)&&D({x:Math.max(0,Math.round(g.left)),y:0,width:Math.round(g.width),height:Math.round(g.height)}),_e?.()}))},ko=function(){if(!r)return;let p=fe();if(!p)return;let g={x:Math.max(0,Math.round(p.left)),y:Math.max(0,Math.round(p.top)),width:Math.round(p.width),height:Math.round(p.height)},w=F();if(w&&w.x===g.x&&w.y===g.y&&w.width===g.width&&w.height===g.height){l("Skipping window position save; position and size unchanged");return}D({...g}),l(`Saving window position and size to IndexedDB: x=${g.x}, y=${g.y}, width=${g.width}, height=${g.height}`),fr("windowPosition",g),Mn({type:"window_position_updated",position:g,timestamp:Date.now()})},Sr=function(p,g){p.addEventListener("dblclick",w=>{w.preventDefault(),w.stopPropagation(),r&&(r.style.width="300px",r.style.height="300px",ko(),Tr())}),p.addEventListener("mousedown",w=>{w.preventDefault(),w.stopPropagation(),Bt=!0,an=g,hs=w.clientX,gs=w.clientY;let T=r.getBoundingClientRect();$n=T.width,Wn=T.height,wr=T.left,br=T.top,ys=document.documentElement.clientWidth,vs=document.documentElement.clientHeight,g==="top-left"||g==="bottom-right"?document.body.style.cursor="nwse-resize":document.body.style.cursor="nesw-resize"})},bs=function(){if(!s||!Zt)return;let{scrollTop:p,scrollHeight:g,clientHeight:w}=s;if(g<=w)return;let T=Math.max(30,w/g*w),I=p/(g-w)*(w-T);Zt.style.height=`${T}px`,Zt.style.top=`${I}px`},Ss=function(){Ke&&(Ti===null&&(Ti=requestAnimationFrame(()=>{Ti=null,bs()})),Ke.classList.add("ytls-scrollbar-visible"),yt&&clearTimeout(yt),yt=setTimeout(()=>{Ke?.classList.remove("ytls-scrollbar-visible"),yt=null},500))},Tr=function(){if(r&&c&&h&&s){let p=me(r,c,h);s.style.maxHeight=p>0?p+"px":"0px",s.style.overflowY=p>0?"auto":"hidden"}};if(document.querySelectorAll("#ytls-pane").forEach(p=>p.remove()),!document.getElementById("ytls-styles")){let p=document.createElement("style");p.id="ytls-styles",p.textContent=hl,document.head.appendChild(p)}r=document.createElement("div"),c=document.createElement("div"),s=document.createElement("ul"),h=document.createElement("div"),m=document.createElement("span"),R=document.createElement("span"),U=document.createElement("span"),U.classList.add("ytls-backup-indicator"),U.style.cursor="pointer",U.style.backgroundColor="#666",U.onclick=p=>{p.stopPropagation(),Oe(ni()?"sync":"drive")},s.addEventListener("mouseenter",()=>{Ln=!0,fo=!1}),s.addEventListener("mouseleave",()=>{Ln=!1;try{Di()}catch{}if(fo)return;bt(!1);let p=null;if(document.activeElement instanceof HTMLInputElement&&s.contains(document.activeElement)&&(p=document.activeElement.closest("li")?.dataset.guid??null),os(),p){let w=Ce().find(T=>T.dataset.guid===p)?.querySelector("input");if(w)try{w.focus({preventScroll:!0})}catch{}}}),r.id="ytls-pane",c.id="ytls-pane-header",c.addEventListener("dblclick",p=>{let g=p.target instanceof Element?p.target:null;if(g){let w=g;for(;w&&w!==r;){if(window.getComputedStyle(w).cursor==="pointer")return;w=w.parentElement}}p.preventDefault(),Si(!1)});let i=p=>{try{p.stopPropagation()}catch{}};["click","dblclick","mousedown","pointerdown","touchstart","wheel"].forEach(p=>{r.addEventListener(p,i)}),r.addEventListener("keydown",p=>{try{p.stopPropagation()}catch{}}),r.addEventListener("keyup",p=>{try{p.stopPropagation()}catch{}}),r.addEventListener("focus",p=>{try{p.stopPropagation()}catch{}},!0),r.addEventListener("blur",p=>{try{p.stopPropagation()}catch{}},!0),R.textContent=`v${Br}`,R.classList.add("ytls-version-display"),Li&&Be(R,`Built ${Li.toLocaleString()}`);let u=document.createElement("span");u.style.display="inline-flex",u.style.alignItems="center",u.style.gap="6px",u.appendChild(R),u.appendChild(U),v=document.createElement("span"),v.id="ytls-members-badge",v.appendChild(Rn("star",14)),Be(v,"Members-only stream"),fs(),m.id="ytls-current-time",m.textContent="\u2014",m.style.cursor="default",Be(m,()=>{let p=re(),{isLive:g}=p?p.getVideoData()||{isLive:!1}:{isLive:!1};return g?"Skip to live":""}),y=document.createElement("span"),y.id="ytls-playback-speed",y.textContent="1x",y.style.cursor="pointer",y.style.userSelect="none",Be(y,()=>`Current playback speed. Click to toggle between 1x and ${Na(E)}x.`),y.onclick=()=>{za()},y.addEventListener("mousedown",p=>{p.stopPropagation()}),y.addEventListener("click",p=>{p.stopPropagation()}),m.onclick=()=>{let p=re();if(!p)return;let{isLive:g}=p.getVideoData()||{isLive:!1};g&&(Lt=!0,p.seekToLiveHead(),setTimeout(()=>{Lt=!1},500))};let S=p=>{m.style.cursor=p?"pointer":"default"};A(),ze&&clearInterval(ze),ze=setInterval(A,1e3),h.id="ytls-buttons";let k=(p,g)=>()=>{p.classList.remove("ytls-fade-in"),p.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(p)&&document.body.removeChild(p),g&&g()},300)},b=p=>g=>{g.key==="Escape"&&(g.preventDefault(),g.stopPropagation(),p())},C=p=>{setTimeout(()=>{document.addEventListener("keydown",p)},0)},L=(p,g)=>w=>{p.contains(w.target)||g()},P=p=>{setTimeout(()=>{document.addEventListener("click",p,!0)},0)};[{id:"add",icon:"alarm-plus",title:"Add timestamp",action:()=>{if(St())return;let p=typeof Un<"u"?Un:0,g=re(),w=g?Math.floor(g.getCurrentTime()+p):0;if(!Number.isFinite(w))return;let T=wo(w,"");T&&T.focus()}},{id:"settings",icon:"settings",title:"Settings",action:()=>Oe()},{id:"copy",icon:"clipboard",title:"Copy timestamps to clipboard",action:function(p){if(St()){Ge(this,"circle-x",20),setTimeout(()=>{Ge(this,"clipboard",20)},2e3);return}let g=hi();if(g.length===0){Ge(this,"circle-x",20),setTimeout(()=>{Ge(this,"clipboard",20)},2e3);return}let w=p.ctrlKey,T=Ci(g,w);navigator.clipboard.writeText(T).then(()=>{Ge(this,"circle-check",20),setTimeout(()=>{Ge(this,"clipboard",20)},2e3)}).catch(I=>{l("Failed to copy timestamps: ",I,"error"),Ge(this,"circle-x",20),setTimeout(()=>{Ge(this,"clipboard",20)},2e3)})}},{id:"offset",icon:"clock-plus",title:"Offset all timestamps",action:()=>{if(St())return;if(Ce().length===0){alert("No timestamps available to offset.");return}let g=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(g===null)return;let w=g.trim();if(w.length===0)return;let T=Number.parseInt(w,10);if(!Number.isFinite(T)){alert("Please enter a valid integer number of seconds.");return}T!==0&&ts(T,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{id:"delete",icon:"trash",title:"Delete all timestamps for current video",action:async()=>{let p=So();if(!p){alert("Unable to determine current video ID.");return}let g=document.createElement("div");g.id="ytls-delete-all-modal",g.classList.remove("ytls-fade-out"),g.classList.add("ytls-fade-in");let w=document.createElement("p");w.textContent="Hold the button to delete all timestamps for:",w.style.marginBottom="10px";let T=document.createElement("p");T.textContent=p,T.style.fontFamily="monospace",T.style.fontSize="12px",T.style.marginBottom="15px",T.style.color="#aaa";let I=document.createElement("button");I.classList.add("ytls-save-modal-button"),I.style.background="#d32f2f",I.style.position="relative",I.style.overflow="hidden";let W=null,_=0,z=null,B=document.createElement("div");B.style.position="absolute",B.style.left="0",B.style.top="0",B.style.height="100%",B.style.width="0%",B.style.background="#ff6b6b",B.style.transition="none",B.style.pointerEvents="none",I.appendChild(B);let Q=document.createElement("span");Q.textContent="Hold to Delete All",Q.style.position="relative",Q.style.zIndex="1",I.appendChild(Q);let ae=()=>{if(!_)return;let Ft=Date.now()-_,To=Math.min(Ft/5e3*100,100);B.style.width=`${To}%`,To<100&&(z=requestAnimationFrame(ae))},Ye=()=>{W&&(clearTimeout(W),W=null),z&&(cancelAnimationFrame(z),z=null),_=0,B.style.width="0%",Q.textContent="Hold to Delete All"};I.onmousedown=()=>{_=Date.now(),Q.textContent="Deleting...",z=requestAnimationFrame(ae),W=setTimeout(async()=>{Ye(),g.classList.remove("ytls-fade-in"),g.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(g)&&document.body.removeChild(g);try{await ls(p),xi()}catch(Ft){l("Failed to delete all timestamps:",Ft,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},I.onmouseup=Ye,I.onmouseleave=Ye;let Xe=null,sn=null,kt=k(g,()=>{Ye(),Xe&&document.removeEventListener("keydown",Xe),sn&&document.removeEventListener("click",sn,!0)});Xe=b(kt),sn=L(g,kt);let ln=document.createElement("button");ln.textContent="Cancel",ln.classList.add("ytls-save-modal-cancel-button"),ln.onclick=kt,g.appendChild(w),g.appendChild(T),g.appendChild(I),g.appendChild(ln),document.body.appendChild(g),C(Xe),P(sn)}}].forEach(p=>{let g=document.createElement("button");Ge(g,p.icon,20),Be(g,p.title),g.classList.add("ytls-main-button"),p.id==="copy"?g.onclick=function(w){p.action.call(this,w)}:g.onclick=p.action,p.id==="settings"&&(Ko=g),h.appendChild(g)});let Ct=document.createElement("button");Y(Ct,"device-floppy","Save"),Ct.classList.add("ytls-file-operation-button"),Ct.onclick=()=>{let p=document.createElement("div");p.id="ytls-save-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let g=document.createElement("p");g.textContent="Save as:";let w=null,T=null,I=k(p,()=>{w&&document.removeEventListener("keydown",w),T&&document.removeEventListener("click",T,!0)});w=b(I),T=L(p,I);let W=document.createElement("button");W.textContent="JSON",W.classList.add("ytls-save-modal-button"),W.onclick=()=>{w&&document.removeEventListener("keydown",w),T&&document.removeEventListener("click",T,!0),k(p,()=>as("json"))()};let _=document.createElement("button");_.textContent="Plain Text",_.classList.add("ytls-save-modal-button"),_.onclick=()=>{w&&document.removeEventListener("keydown",w),T&&document.removeEventListener("click",T,!0),k(p,()=>as("text"))()};let z=document.createElement("button");z.textContent="Cancel",z.classList.add("ytls-save-modal-cancel-button"),z.onclick=I,p.appendChild(g),p.appendChild(W),p.appendChild(_),p.appendChild(z),document.body.appendChild(p),C(w),P(T)};let qn=document.createElement("button");Y(qn,"folder-open","Load"),qn.classList.add("ytls-file-operation-button"),qn.onclick=()=>{let p=document.createElement("div");p.id="ytls-load-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let g=document.createElement("p");g.textContent="Load from:";let w=null,T=null,I=k(p,()=>{w&&document.removeEventListener("keydown",w),T&&document.removeEventListener("click",T,!0)});w=b(I),T=L(p,I);let W=document.createElement("button");W.textContent="File",W.classList.add("ytls-save-modal-button"),W.onclick=()=>{let B=document.createElement("input");B.type="file",B.accept=".json,.txt",B.classList.add("ytls-hidden-file-input"),B.onchange=Q=>{let ae=Q.target.files?.[0];if(!ae)return;w&&document.removeEventListener("keydown",w),T&&document.removeEventListener("click",T,!0),I();let Ye=new FileReader;Ye.onload=()=>{let Xe=String(Ye.result).trim();us(Xe)},Ye.readAsText(ae)},B.click()};let _=document.createElement("button");_.textContent="Clipboard",_.classList.add("ytls-save-modal-button"),_.onclick=async()=>{w&&document.removeEventListener("keydown",w),T&&document.removeEventListener("click",T,!0),k(p,async()=>{try{let B=await navigator.clipboard.readText();B?us(B.trim()):alert("Clipboard is empty.")}catch(B){l("Failed to read from clipboard: ",B,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let z=document.createElement("button");z.textContent="Cancel",z.classList.add("ytls-save-modal-cancel-button"),z.onclick=I,p.appendChild(g),p.appendChild(W),p.appendChild(_),p.appendChild(z),document.body.appendChild(p),C(w),P(T)};let rn=document.createElement("button");Y(rn,"file-export","Export"),rn.classList.add("ytls-file-operation-button"),rn.onclick=async()=>{try{await Ad()}catch{alert("Failed to export data: Could not read from database.")}};let jn=document.createElement("button");Y(jn,"file-import","Import"),jn.classList.add("ytls-file-operation-button"),jn.onclick=()=>{let p=document.createElement("input");p.type="file",p.accept=".json",p.classList.add("ytls-hidden-file-input"),p.onchange=g=>{let w=g.target.files?.[0];if(!w)return;let T=new FileReader;T.onload=()=>{try{let I=JSON.parse(String(T.result)),W=[];for(let _ in I)if(Object.prototype.hasOwnProperty.call(I,_)&&_.startsWith("ytls-")){let z=_.substring(5),B=I[_];if(B&&typeof B.video_id=="string"&&Array.isArray(B.timestamps)){let Q=fl(z,B.timestamps).then(ae=>vd(z,ae)).then(()=>l(`Imported ${z} to IndexedDB`)).catch(ae=>l(`Failed to import ${z} to IndexedDB:`,ae,"error"));W.push(Q)}else l(`Skipping key ${_} during import due to unexpected data format.`,"warn")}Promise.all(W).then(()=>{xi()}).catch(_=>{alert("An error occurred during import to IndexedDB. Check console for details."),l("Overall import error:",_,"error")})}catch(I){alert(`Failed to import data. Please ensure the file is in the correct format.
`+I.message),l("Import error:",I,"error")}},T.readAsText(w)},p.click()},s.onclick=p=>{ns(p)},s.ontouchstart=p=>{ns(p)},r.style.position="fixed",r.style.bottom="0",r.style.right="0",r.style.transition="none",xo(),setTimeout(()=>Vn(),10);let Ut=!1,hr=0,gr=0,yr=0,Pn=0,vr=0,V=0,N=null,ue=!1;r.addEventListener("mousedown",p=>{let g=p.target;if(!(g instanceof Element)||g instanceof HTMLInputElement||g instanceof HTMLTextAreaElement||g instanceof Element&&(g.closest("#ytls-playback-speed-group")||g.closest("#ytls-playback-speed"))||g!==c&&!c.contains(g)&&window.getComputedStyle(g).cursor==="pointer")return;Ut=!0,ue=!1;let w=r.getBoundingClientRect();hr=p.clientX-w.left,gr=p.clientY-w.top,yr=w.width,Pn=w.height,vr=document.documentElement.clientWidth,V=document.documentElement.clientHeight,r.style.transition="none"}),document.addEventListener("mousemove",Xo=p=>{if(!Ut)return;ue=!0;let g=p.clientX,w=p.clientY;N===null&&(N=requestAnimationFrame(()=>{if(N=null,!Ut)return;let T=Math.max(0,Math.min(g-hr,vr-yr)),I=Math.max(0,Math.min(w-gr,V-Pn));r.style.left=`${T}px`,r.style.top=`${I}px`,r.style.right="auto",r.style.bottom="auto"}))}),document.addEventListener("mouseup",Jo=()=>{if(!Ut)return;Ut=!1,N!==null&&(cancelAnimationFrame(N),N=null);let p=ue;setTimeout(()=>{ue=!1},50),Vn(),setTimeout(()=>{p&&ko()},200)}),r.addEventListener("dragstart",p=>p.preventDefault());let ee=document.createElement("div"),ge=document.createElement("div"),qe=document.createElement("div"),ut=document.createElement("div");ee.id="ytls-resize-tl",ge.id="ytls-resize-tr",qe.id="ytls-resize-bl",ut.id="ytls-resize-br";let Bt=!1,hs=0,gs=0,$n=0,Wn=0,wr=0,br=0,ys=0,vs=0,Kn=null,an=null;Sr(ee,"top-left"),Sr(ge,"top-right"),Sr(qe,"bottom-left"),Sr(ut,"bottom-right"),document.addEventListener("mousemove",p=>{if(!Bt||!r||!an)return;let g=p.clientX,w=p.clientY;Kn===null&&(Kn=requestAnimationFrame(()=>{if(Kn=null,!Bt||!r||!an)return;let T=g-hs,I=w-gs,W=ys,_=vs,z=$n,B=Wn,Q=wr,ae=br;an==="bottom-right"?(z=Math.max(200,Math.min(800,$n+T)),B=Math.max(250,Math.min(_,Wn+I))):an==="top-left"?(z=Math.max(200,Math.min(800,$n-T)),Q=wr+T,B=Math.max(250,Math.min(_,Wn-I)),ae=br+I):an==="top-right"?(z=Math.max(200,Math.min(800,$n+T)),B=Math.max(250,Math.min(_,Wn-I)),ae=br+I):an==="bottom-left"&&(z=Math.max(200,Math.min(800,$n-T)),Q=wr+T,B=Math.max(250,Math.min(_,Wn+I))),Q=Math.max(0,Math.min(Q,W-z)),ae=Math.max(0,Math.min(ae,_-B)),r.style.width=`${z}px`,r.style.height=`${B}px`,r.style.left=`${Q}px`,r.style.top=`${ae}px`,r.style.right="auto",r.style.bottom="auto"}))}),document.addEventListener("mouseup",()=>{Bt&&(Bt=!1,Kn!==null&&(cancelAnimationFrame(Kn),Kn=null),an=null,document.body.style.cursor="",Ee(!0))});let xr=null;window.addEventListener("resize",Qo=()=>{xr&&clearTimeout(xr),xr=setTimeout(()=>{Ee(!0),_e?.(),xr=null},200)}),c.appendChild(v),c.appendChild(m);let Yn=document.createElement("span");Yn.id="ytls-playback-speed-group",Yn.style.display="inline-flex",Yn.style.alignItems="center",Yn.style.marginLeft="4px",y&&Yn.appendChild(y),c.appendChild(Yn),c.appendChild(u);let ki=document.createElement("div");ki.id="ytls-list-wrapper",Ke=document.createElement("div"),Ke.className="ytls-scrollbar-track",Zt=document.createElement("div"),Zt.className="ytls-scrollbar-thumb",Ke.append(Zt),ki.append(s,Ke);let kr=document.createElement("div");kr.id="ytls-content",kr.append(ki),kr.append(h),r.append(c,kr,ee,ge,qe,ut);let ws="";r.addEventListener("mousemove",p=>{if(Ut||Bt)return;let g=r.getBoundingClientRect(),w=20,T=p.clientX,I=p.clientY,W=T-g.left<=w,_=g.right-T<=w,z=I-g.top<=w,B=g.bottom-I<=w,Q="";z&&W||B&&_?Q="nwse-resize":(z&&_||B&&W)&&(Q="nesw-resize"),Q!==ws&&(ws=Q,document.body.style.cursor=Q)});let Ti=null;if(Ke.addEventListener("mouseenter",()=>{yt&&(clearTimeout(yt),yt=null),Ke.classList.add("ytls-scrollbar-visible")}),Ke.addEventListener("mouseleave",()=>{mi||(yt=setTimeout(()=>{Ke?.classList.remove("ytls-scrollbar-visible"),yt=null},500))}),Zt.addEventListener("mousedown",p=>{if(!s)return;p.preventDefault(),p.stopPropagation(),mi=!0;let g=p.clientY,w=s.scrollTop,{scrollHeight:T,clientHeight:I}=s,W=Math.max(30,I/T*I),_=T-I,z=I-W;function B(ae){if(!s)return;let Ye=ae.clientY-g;s.scrollTop=Math.max(0,Math.min(_,w+Ye*(_/z))),bs()}function Q(){mi=!1,document.removeEventListener("mousemove",B),document.removeEventListener("mouseup",Q),Ke?.matches(":hover")||(yt=setTimeout(()=>{Ke?.classList.remove("ytls-scrollbar-visible"),yt=null},500))}document.addEventListener("mousemove",B),document.addEventListener("mouseup",Q)}),r.addEventListener("mouseenter",()=>{Ln=!0,Ss()}),s.addEventListener("scroll",Ss),r.addEventListener("mouseleave",()=>{!Bt&&!Ut&&(document.body.style.cursor=""),Ln=!1;try{Di()}catch{}try{bt(!1)}catch{}}),_e=Tr,setTimeout(()=>{if(Tr(),r&&c&&h&&s){let p=40,g=Ce();if(g.length>0)p=g[0].offsetHeight;else{let w=document.createElement("li");w.style.visibility="hidden",w.style.position="absolute",w.textContent="00:00 Example",s.appendChild(w),p=w.offsetHeight,s.removeChild(w)}j(c.offsetHeight+h.offsetHeight+p),r.style.minHeight=O()+"px"}},0),wt){try{wt.disconnect()}catch{}wt=null}wt=new ResizeObserver(Tr),wt.observe(r),po||document.addEventListener("pointerdown",po=()=>{ja=Date.now()},!0),mo||document.addEventListener("pointerup",mo=()=>{},!0)}finally{fi=!1}}}async function Ld(){if(!r)return;if(document.querySelectorAll("#ytls-pane").forEach(d=>{d!==r&&(l("Removing duplicate pane element from DOM"),d.remove())}),document.body.contains(r)){l("Pane already in DOM, skipping append");return}await Id(),Pu(kd),Ru(Td),La(fr),Ca(bi),_u(mr),Cu(U),ru(()=>li()),await Ba(),await $u(),await xn(),li();let u=document.querySelectorAll("#ytls-pane");if(u.length>0&&(l(`WARNING: Found ${u.length} existing pane(s) in DOM, removing all`),u.forEach(d=>d.remove())),document.body.contains(r)){l("ERROR: Pane already in body, aborting append");return}if(document.body.appendChild(r),l("Pane successfully appended to DOM"),ke(),Ie&&(clearTimeout(Ie),Ie=null),Ie=setTimeout(()=>{De(),_e?.(),Le(),Ee(!0),Ie=null},450),vt){try{vt.disconnect()}catch{}vt=null}vt=new MutationObserver(()=>{let d=document.querySelectorAll("#ytls-pane");d.length>1&&(l(`CRITICAL: Multiple panes detected (${d.length}), removing duplicates`),d.forEach((S,x)=>{(x>0||r&&S!==r)&&S.remove()}))}),vt.observe(document.body,{childList:!0})}function ds(i=0){if(document.getElementById("ytls-header-button")){Gt();return}let u=document.querySelector("#logo");if(!u||!u.parentElement){i<10&&setTimeout(()=>ds(i+1),300);return}let d=document.createElement("button");d.id="ytls-header-button",d.type="button",d.className="ytls-header-button",Be(d,"Toggle Timekeeper UI"),d.setAttribute("aria-label","Toggle Timekeeper UI");let S=document.createElement("img");S.src=Xu(),S.alt="",S.decoding="async",d.appendChild(S),en=S,d.addEventListener("mouseenter",()=>{en&&(Yo=!0,en.src=uf())}),d.addEventListener("mouseleave",()=>{en&&(Yo=!1,Gt())}),d.addEventListener("click",()=>{r&&!document.body.contains(r)&&(l("Pane not in DOM, re-appending before toggle"),document.body.appendChild(r)),Si()}),u.insertAdjacentElement("afterend",d),Gt(),l("Timekeeper header button added next to YouTube logo")}function ps(){if(ve())return;de(!0);let i=history.pushState,u=history.replaceState;function d(){try{let S=new Event("locationchange");window.dispatchEvent(S)}catch{}}history.pushState=function(){let S=i.apply(this,arguments);return d(),S},history.replaceState=function(){let S=u.apply(this,arguments);return d(),S},window.addEventListener("popstate",d),window.addEventListener("locationchange",()=>{window.location.href!==te&&l("Location changed (locationchange event) \u2014 deferring UI update until navigation finish")})}async function xi(){if(!a()){fd();return}le(window.location.href);let i=++he;if(document.querySelectorAll("#ytls-pane").forEach((d,S)=>{(S>0||r&&d!==r)&&d.remove()}),await Gn(),await Md(),i!==he)return;Te={phase:"loading",videoId:So()},f?.videoId!==Z()&&ms(null);let u=document.title;if(l("Page Title:",u),l("Video ID:",Z()),l("Current URL:",window.location.href),yi(!0),yo(),Ve(),await mr(),i===he&&(Ve(),yi(!1),l("Timestamps loaded and UI unlocked for video:",Z()),await Ld(),i===he)){try{bt(!0)}catch{}ds(),yd()}}ps(),window.addEventListener("yt-navigate-start",()=>{l("Navigation started (yt-navigate-start event fired)"),dr(),a()&&r&&s&&(l("Locking UI and showing loading state for navigation"),yi(!0))}),uo=i=>{if(!i.repeat&&!i.ctrlKey&&!i.altKey&&!i.metaKey&&!i.shiftKey&&(i.key==="z"||i.key==="Z")){if(Zu(i.target))return;za()&&(i.preventDefault(),l("Playback speed toggled via keyboard shortcut (Z)"));return}i.ctrlKey&&i.altKey&&i.shiftKey&&(i.key==="T"||i.key==="t")&&(i.preventDefault(),Si(),l("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",uo),window.addEventListener("pagehide",dr),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&dr()});function ms(i){let u=typeof unsafeWindow<"u"?unsafeWindow:window,d=gc(i?.response??u.ytInitialData,i?.playerResponse??u.ytInitialPlayerResponse);f=d,fs(),d&&fu(d)}function fs(){if(!v)return;let i=null;try{i=So()}catch{}let u=!!f?.membersOnly&&f.videoId===i;v.style.display=u?"inline-flex":"none"}window.addEventListener("yt-navigate-finish",i=>{l("Navigation finished (yt-navigate-finish event fired)"),ms(i.detail?.response),window.location.href!==te?xi():l("Navigation finished but URL already handled, skipping.")});function Cd(i){let u=/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(i);if(u&&(u[1]||u[2]||u[3]))return Number(u[1]||0)*3600+Number(u[2]||0)*60+Number(u[3]||0);let d=Number(i);return Number.isFinite(d)?d:null}document.addEventListener("click",i=>{if(i.button!==0||i.ctrlKey||i.metaKey||i.shiftKey||i.altKey)return;let u=i.target?.closest?.("ytd-comments a[href]");if(!u)return;let d=new URL(u.href,location.href),S=d.searchParams.get("t");if(d.pathname!=="/watch"||!S||d.searchParams.get("v")!==So())return;let x=Cd(S),A=re();x===null||!A||(i.preventDefault(),i.stopImmediatePropagation(),A.seekTo(x))},!0),Xc(i=>{for(let u of i)Mn({type:"timestamps_updated",videoId:u,action:"synced"});Z()&&i.includes(Z())&&mr()}),xu(),ps(),l("Timekeeper initialized and waiting for navigation events")})();})();

