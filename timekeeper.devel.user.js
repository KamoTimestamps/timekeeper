// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      5.3.8.708
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

(()=>{var kd=Object.defineProperty;var Ad=(e,t)=>{for(var n in t)kd(e,n,{get:t[n],enumerable:!0})};var Lo=class extends Error{},Ze=(e,t)=>{throw new Lo(`${e||"value"}: expected ${t}`)};function Et(e){let t={run:e,parse:n=>e(n,""),safeParse:n=>{try{return{success:!0,data:e(n,"")}}catch(o){if(o instanceof Lo)return{success:!1,error:o};throw o}},array:()=>Ed(t)};return t}var Ms=e=>typeof e=="object"&&e!==null&&!Array.isArray(e);function j(){return Et((e,t)=>typeof e=="string"?e:Ze(t,"string"))}function Ot(){return Et((e,t)=>typeof e=="boolean"?e:Ze(t,"boolean"))}function Be(e={}){return Et((t,n)=>typeof t!="number"||Number.isNaN(t)?Ze(n,"number"):(e.finite&&!Number.isFinite(t)&&Ze(n,"finite number"),e.int&&!Number.isInteger(t)&&Ze(n,"integer"),e.nonnegative&&t<0&&Ze(n,"number >= 0"),e.positive&&t<=0&&Ze(n,"number > 0"),e.min!==void 0&&t<e.min&&Ze(n,`number >= ${e.min}`),e.max!==void 0&&t>e.max&&Ze(n,`number <= ${e.max}`),t))}function fe(e){return Et((t,n)=>t===void 0?void 0:e.run(t,n))}function et(e){return Et((t,n)=>t===null?null:e.run(t,n))}function Qe(e,t){return Et((n,o)=>{try{return e.run(n,o)}catch(a){if(a instanceof Lo)return t;throw a}})}function Ed(e){return Et((t,n)=>Array.isArray(t)?t.map((o,a)=>e.run(o,`${n}[${a}]`)):Ze(n,"array"))}function Md(e){return Et((t,n)=>{if(!Ms(t))return Ze(n,"object");let o={};for(let a of Object.keys(t))o[a]=e.run(t[a],n?`${n}.${a}`:a);return o})}function xe(e){let t=Et((n,o)=>{if(!Ms(n))return Ze(o,"object");let a={};for(let r of Object.keys(e)){let l=e[r].run(n[r],o?`${o}.${r}`:r);l!==void 0&&(a[r]=l)}return a});return Object.assign(t,{extend:n=>xe({...e,...n}),partial:()=>{let n={};for(let o of Object.keys(e))n[o]=fe(e[o]);return xe(n)}})}var Id=Et((e,t)=>typeof e=="string"&&e.length>0?e:Ze(t,"non-empty string")),Pr=xe({guid:Id,start:Be({finite:!0,nonnegative:!0}),comment:j(),write_counter:fe(Be({int:!0,positive:!0})),deleted_at:Qe(fe(Be()),void 0)}),Co=Pr.array(),hn=Pr.extend({video_id:j(),device_id:fe(j())}),Is=xe({x:Be({finite:!0}),y:Be({finite:!0}),width:fe(Be({finite:!0,positive:!0})),height:fe(Be({finite:!0,positive:!0}))}),Rr=xe({video_id:j(),timestamps:Co}),Ls=Md(Rr),Es=xe({isSignedIn:Qe(Ot(),!1),accessToken:Qe(et(j()),null),userName:Qe(et(j()),null),email:Qe(et(j()),null)}),Ei=Qe(Et((e,t)=>{if(typeof e=="string"){let n;try{n=JSON.parse(e)}catch{return Ze(t,"valid JSON string for auth state")}return Es.run(n,t)}return Es.run(e,t)}),{isSignedIn:!1,accessToken:null,userName:null,email:null}),Xn={isSignedIn:!1,accessToken:null,accessTokenExpiresAt:null,refreshToken:null,userId:null,userName:null,email:null},Mi=Qe(xe({isSignedIn:Qe(Ot(),!1),accessToken:Qe(et(j()),null),accessTokenExpiresAt:Qe(et(Be({finite:!0})),null),refreshToken:Qe(et(j()),null),userId:Qe(et(j()),null),userName:Qe(et(j()),null),email:Qe(et(j()),null)}),Xn),Ld=xe({autoBackupEnabled:Ot(),autoBackupIntervalMinutes:Be({int:!0,min:5,max:1440}),lastAutoBackupAt:fe(et(Be({int:!0,positive:!0})))}),Ii=Ld;var Cs=`<svg
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-minus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 12l14 0" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-plus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
  <path d="M9 12h6" />
  <path d="M12 9v6" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-minus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M9 12l6 0" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-trash"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M4 7l16 0" />
  <path d="M10 11l0 6" />
  <path d="M14 11l0 6" />
  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-clipboard"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
  <path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-settings"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065" />
  <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-x"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M10 10l4 4m0 -4l-4 4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-import"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M5 13v-8a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5.5m-9.5 -2h7m-3 -3l3 3l-3 3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-users"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
  <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-star"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-alert-triangle"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 9v4" />
  <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0" />
  <path d="M12 16h.01" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-database"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M4 6a8 3 0 1 0 16 0a8 3 0 1 0 -16 0" />
  <path d="M4 6v6a8 3 0 0 0 16 0v-6" />
  <path d="M4 12v6a8 3 0 0 0 16 0v-6" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-server"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 7a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-2" />
  <path d="M3 15a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -2" />
  <path d="M7 8l0 .01" />
  <path d="M7 16l0 .01" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-world"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
  <path d="M3.6 9h16.8" />
  <path d="M3.6 15h16.8" />
  <path d="M11.5 3a17 17 0 0 0 0 18" />
  <path d="M12.5 3a17 17 0 0 1 0 18" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-plug-connected"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M7 12l5 5l-1.5 1.5a3.536 3.536 0 1 1 -5 -5l1.5 -1.5" />
  <path d="M17 12l-5 -5l1.5 -1.5a3.536 3.536 0 1 1 5 5l-1.5 1.5" />
  <path d="M3 21l2.5 -2.5" />
  <path d="M18.5 5.5l2.5 -2.5" />
  <path d="M10 11l-2 2" />
  <path d="M13 14l-2 2" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-key"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0" />
  <path d="M15 9h.01" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-x"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M18 6l-12 12" />
  <path d="M6 6l12 12" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-indent-increase"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 6l-11 0" />
  <path d="M20 12l-7 0" />
  <path d="M20 18l-11 0" />
  <path d="M4 8l4 4l-4 4" />
</svg>`;var cl=`<svg
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
</svg>`;var up={plus:Cs,"alarm-plus":Bs,minus:Ps,"circle-plus":Rs,"circle-minus":Ds,trash:Os,clipboard:_s,settings:Ns,"clock-plus":Hs,"current-location":zs,"player-record":Gs,"circle-x":Fs,"circle-check":Us,"adjustments-horizontal":Vs,cloud:qs,"device-floppy":js,"folder-open":$s,"file-export":Ws,"file-import":Ys,"file-spreadsheet":Ks,login:Xs,logout:Js,refresh:Qs,users:Zs,star:el,"alert-triangle":tl,database:nl,server:ol,world:rl,"plug-connected":il,key:al,x:sl,"indent-increase":ll,"indent-decrease":cl},ul="http://www.w3.org/2000/svg",dp=/^\s*<svg\s+([^>]*)>([\s\S]*?)<\/svg>\s*$/,pp=/<([a-zA-Z][\w:-]*)([^>]*)\/>/g,mp=/([a-zA-Z_:][\w:.-]*)="([^"]*)"/g,dl=new Map;function pl(e){let t={};for(let n of e.matchAll(mp))t[n[1]]=n[2];return t}function fp(e){return e.startsWith("data:image/svg+xml;base64,")?atob(e.slice(26)):e.startsWith("data:image/svg+xml,")?decodeURIComponent(e.slice(19)):e}function hp(e){let t=fp(e).match(dp);if(!t)throw new Error("Invalid Tabler SVG source");let[,n,o]=t,a=document.createElementNS(ul,"svg"),r=pl(n);for(let[l,s]of Object.entries(r))l!=="class"&&a.setAttribute(l,s);for(let l of o.matchAll(pp)){let[,s,f]=l,m=document.createElementNS(ul,s),y=pl(f);for(let[h,v]of Object.entries(y))m.setAttribute(h,v);a.appendChild(m)}return a}function gp(e){let t=dl.get(e);if(t)return t;let n=hp(up[e]);return dl.set(e,n),n}function Rn(e,t=20){let n=gp(e).cloneNode(!0);return n.setAttribute("width",String(t)),n.setAttribute("height",String(t)),n.setAttribute("aria-hidden","true"),n.style.pointerEvents="none",n.style.flexShrink="0",n.style.verticalAlign="middle",n}function Fe(e,t,n){e.replaceChildren(Rn(t,n))}function W(e,t,n,o){e.replaceChildren(Rn(t,o),document.createTextNode("\xA0"+n))}var ml="5.3.8";var Dr=ml+"+0f905dd";function c(e,...t){let n="debug",o=[...t];t.length>0&&typeof t[t.length-1]=="string"&&["debug","info","warn","error"].includes(t[t.length-1])&&(n=o.pop());let a=`[Timekeeper v${Dr}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[n](`${a} ${e}`,...o)}var Or=e=>String(e).padStart(2,"0");function gn(e,t=e){let n=Math.floor(e/3600),o=Math.floor(e%3600/60),a=Or(e%60);return t<3600?`${t>=600?Or(o):o}:${a}`:`${t>=36e3?Or(n):n}:${Or(o)}:${a}`}function _r(e,t,n){let o=gn(e,Math.max(e,n));if(t.length===0)return o;let a=(Math.max(...t)-Math.min(...t))/60,r=(t.length/Math.max(1,a)).toFixed(2);return parseFloat(r)>0?`${o} (${r}/min)`:o}function Li(e,t){let n=Math.max(0,...e.map(o=>o.start));return e.map(o=>{let a=gn(o.start,n),r=t?`${o.comment} <!-- guid:${o.guid} -->`.trimStart():o.comment;return`${a} ${r}`}).join(`
`)}function fl(e,t=window.location.href){try{let n=new URL(t);return n.searchParams.set("t",`${e}s`),n.toString()}catch{return`https://www.youtube.com/watch?v=${t.search(/[?&]v=/)>=0?t.split(/[?&]v=/)[1].split(/&/)[0]:t.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${e}s`}}function Dn(){let e=new Date;return e.getUTCFullYear()+"-"+String(e.getUTCMonth()+1).padStart(2,"0")+"-"+String(e.getUTCDate()).padStart(2,"0")+"--"+String(e.getUTCHours()).padStart(2,"0")+"-"+String(e.getUTCMinutes()).padStart(2,"0")+"-"+String(e.getUTCSeconds()).padStart(2,"0")}var hl=`#ytls-pane {
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
`;var Nr="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kKGhISKNpo4IcAAAL9UExURQAAAP/abf7Zaf/Yaf7Ya//XaP/WZv/VZf/VY//UYf/SYv/SYPvTZf/QZ//ObP7QYPzRYP7QXfjRZv7Kdv7PW/3OX//FgPnOXv7MVv/ChP3LWPzLWv7Bhf3EeP++jfXJZPXKW/rIWPvIVffIWv+4lvvGVfPIXvHJXvrFV/vFU/61nPvFUP6zn/i5ivrCU/2yl/6vovvBTP+tp/6upPjBUPbBVPPCVfG8ee3EWOnEXvm+UPu0fvq+SO/AV/m9TPq1cvm9Svq9Req/YPm1Zva7Tvi6Tfi6S/m3V/G8T+e/Vvi5R+20ePi3Sui3bvi3RPe2S/Snn/a1R/e0R/G3ReW6Uve0QOm5Seu3Tei4T/eyRvaySOC6VvaxPuyzSuO1V+W1T922Udi0UuCvS+WtRuqrPNSwU+SbldiqZ+epP9mpSNamT86qT96kP82pSuKhOsemStifPdedN8OiTMufQtGOidaaOMKhSNmYNMyVRb2cR9OUM+yFLuuEL+iDLcWSOM+NLbaVQ8iMMrqQPON+K72Be99/KMaGNK2QQcGFOsmEI9h7JdV7IaiLP9l2KMd+HLCFNKyAVdVyJc14Gr97LqKHPLx6Ms1zJ8Z4GMJ4Hrx6Icd2Fqpyb89tI5yAOJ17SaV7MsNtJrhwKqB5NJd8Npd6O7xsHsRlHpt1MaVyJbZnJJB1MbljII11NZtwI5ZmX7BhIYZvL41rKohpLoJqLZBkIKJaHp9eEKpVGXhjLXthL5hUHHxdIo9RFnRaJnBcJnFYKXNVJ3RSG2lWI4JIF25PJWlON2ZPJmpOGmFRIWVNHGhKImNKHXNCC1hIHVxAHlRDIWg5EVc9HU5AGGM1D0w8HlA8E1I5HEc6Fkw3EFcxEEo0GkQ2G0UxGT8tGDswEUwoCzsuFj8oJj0tDDsrGDksFzgpFkMkCjQnFjMpDTAjFS0lDC0iFDEiCDcdCSoiCikgFCYeByQcEzAYBSoaBSQcByIbBykUBBwVBRcSBBoLAhQNAw8JBAsKAwcGAgAAAN3XOCgAAAABdFJOUwBA5thmAAAGaElEQVR42u2WW2wUVRjH/2dmdy7doduy7S6XQltaIaCiYlJEhYpRo1aMJEbxQgQvRI0YNPESjVGjiS/qiz5ojEEfBKOEgNJQQKRcWy6FSmtoramlpVCWUsre5rI75ziXLXTd1t2++eAvk8zszPl+5/+d3cke/E9eUG3g1KnuYTqxIoygtWx5b+3qVatf/7pZQ54YHU17mzpUW5Jq/uiJCtlnE3ri81PZKQiy6T16IAqPVH7dnLLwroZ6nUOa0keenJ+HYOjbAyd0MxCUA5U1xzb2ArhiUN553pNTQPd8+asKQA755ye3XQYg6SDpcc++Ozm3oH7teQ4UIN6SQT09Kp3C88qbUk4BTm5sPa4RQCVgsCjSNYDYBu/y1bdzuQV08LdDejIZ3X2OgALFD+CPvmEYrHDBkqU1HPIgun7da+tWVImCIHi9XqFq5RtvrXvpmZfe+j5KkYUHWcQ3f9kBDRQu7MzuRcUFPh9ie3335yMY+v6rVgCUEZaWDP4SmFkIPh7TTU1CrjUI//DZ6XQ9dR8zcIQUlCjVYnhq3TI5h2Bow2e9DIwBjIJQBhAOjCMAJ1dVqoG6B6V/FWg/fmjVAxSM2uU8YFoK20AImXK9NnX5gxxGk/mJ7tpw/oaVL668SWB2FzxM0wTPKCxY+ZPLr5nd/1MjxbjQ5tUVrzZ09bQ3vDqZ9xAPcbGueK/y3KYTPV1H1z+6toWOm6Bn855VTy8qEv3VD6+SKUy4mDwFfezxGwu9hRV314V/Do8nMA7+sHTZDAMwUHTH9YyHRXGxbWCkujZEYSEuKGvelxpbQA9sIPNnUlDrSE5eAAt+5esfvGArcGtZEoxSIFTZ1dBCxxR0bj1ZNUWABQMEkQf4NXUlqaVrLAMt8Jj2vBSeKeaeHUNjCeL128qJRmEnSJmGblr1dw/0hDtuXsGDGHa5AYsBdfjQQZotoLt2+xTS3g+XoePEXLLw4gUGrbf2cR7tEYCCAv2dMeNwwymaJWja3l5skiOHNWeiRGMb56vx9jAAl6ILp6OtMQELqh/ewUvKtl19/3yZPvz2SDBmsvB36m0loOf3fqOzaTNQCiAFzKrdaNSLd8zg6aXWLVqZADSe+eq5jJ/yAriQC+TOciV2+kcDTHykelIhgAii2w+Dk+pC05LdJ+MCHGZuGVMA2qd5oRJQgEzni+DAulSOEUiMmCFLmWFwW1hzDCMUaLptJQyQjSgceEFnBETnrCuMEBy9iPfORBp2GZwjIIDqh4MCw663x5IYuZLgtCuHzdNNdh0IjYaTsCDOkZRkCbxpSoNR+wYHgBqU4+yRBr2n9v0raxD7uH5yKpVCt2FQWDAGZp+kgH/SsIFoXHPnt/EwLy/AMLkVr8y6Imj+OOIDPK1nMQJ1DBAFwdInqVufyfRP6ri0gK7/oowwmC3DGGVwFJl/TJm8/LaS/hbCrToBYcN6xltKyVUBwRi0tlPONfecs1WImhiNtVjEqXbP2RzvgpuA1p9wliOGNDlmHiHWFoGbIKy5XRuYGOFeV8DCEGEhC5gYHYPUEZg6bLgiHhNjwG3BPnQJgFKKCSGo0bSgxCAMgFhZNKF6GYYrQJkvBhEE4jUC8kcMQUgLpsyNwaF02gQMAUMuSrdQUa1qOkCQmpe/QQ7SuaWuAMEa6kQgMG+qkJEXQkjWZldwrgA3LPndgLMMiWtr/HmFKC4fDt0VHHmd6aZPL84RbIOGAv3Pc1HkoqhK6nrqxSDSCbi7Hk5aGYiuiWLCc+3i2TlSCP5ysfeBZSVu3w7dmzf1zSuFBkAEePRcvGAaGBMZQkkonlr0WA03SoDhxq37uIpSDbaCMGjxATUO0BRggocJWwt4Aij2KHpf5ZKH5nAYLQA9Ub+tv6BCIbZBBwOFCg9sItbJElk+HzwFnH5+XmXtYplDpgCJxo5zvX9FBMVXwIEwgJqwMWCjSdAcTUycNfXOW0q47F3a/iYieiODQ7HuqMmbsmLPByLoloyAOQFi0/xKYaFfmbVYRJYgsaMFRBJEyYwkEqoaMxXE7KbBCJO0y6UQZNnr9yrQotrU+yqzt7opA4wlVAJJUAKAMDeYTCZHOoj0x2Xwmg71EhgbZ6PZ2nla19P3hMDshZNwFb2tsz+pwSklk4JVNSLG4GLb/p31Djv3tyWQgdF59VnrWXPcrS5lFBYc4ZBFisHdOfP4b/E301Ck7f/BFa8AAAAASUVORK5CYII=",gl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kKGhISFPUHnAAAAAMAUExURQAAAAAAAAcGARIMAhkNAR0OABgRAx4SAyMRASEVAyMVAigXAiEZBicYAiMbBiwZASsaAzAZACkbBC0cAi0dBjAdAjMeAykhCTIfAzQfAzAhBzUgAjghAy0kCzkiAzQkBzwkAz0kAzklBz8lA0AmBEEmAz4nBUEnBEQoBEUpAz0rCzgtD0ErCUcqA0EsB0crBEkrA0YsB0osAksuBU0uA08vBEQyD0E0E0kyDlExBVIxBFQzB1U0BUg3Ek83D0o6Flc5DFQ6DlQ8E1Y9E08/GFo/EF4+Dlw/EVVBF2U+CFtBFWg/CFxFGGVEEllHHGRGFmJHF2BKGpg7BGBOHmlMGWxNGG1NGZ1BCGhQHWZRIaJGDZ9ID3NWHnNYIXpXHW9aJJ5NE4VWGadOEntbIIBbH6RRFXlhKKhWFn9iJbBWGIJlKItjI39nKoZmJq9cGohsK5RqJqxjI7lgHYhuL41tK7ZjH5xxKpF0L7dqIJV0LsFqI5R4M7FxHbRwKpd7NJx7MqZ5LclvJcN1D5t/N8F1Jql9MKOBNK9+LsJ6G6GCOM54KreAKsl8GL9+Mr+AM7OEM8CBJ7iEMqqKPMyCH9h+Lq+KO82DLa+MO7GMO86GJMGLM8iJN7GQP9yFMeGFMMeOObeTPuWIMsOSOsiRN+SLNLqXQteRMb2YQdmTLtCWOsGaQ76bRe2ONeqRN9aYOcidRO+SONqZM8WeRdWbO9ScP/CUOcahRuGbNu+XOtuePMikSOGeNtSiQ92gOtiiRdqiQM6oSuGlPuelP9KrS9iqSemmPOepQe6oPdavTe6rQeqsROGvS+iuRvGtQfKtQNy0UOWyTfevQ/awQfOxRfexRPezQ/O0R/ezReq3UPe0RvG2SeO6Uvm1R/i2R++5TPi4SOe9VO28Uvm6TPO+Ufq9TezBV/q+T+/BVvHBVfrAUPDFWPvDUvzEU/fGV/PHWvXHWfzGVvXKW/3IWPrLWfrLXPjMXP3LWf7NWvzOXf/PXP/PXv3QXv7QXP7RXf/RXf/SYIi9XXwAAAABdFJOUwBA5thmAAAHkUlEQVR42sXWa3BU5R3H8e//eZ6zt+wlIQRqsBIC4w2QqKhAA52K1tYqqKjIiDpUHd60HaszHX3hdCo6tbXSVvFSBtsyjFqsoJVRvLWK4WLjpWhBAcWgYGgIm012N7vZ3XPpZmOCyW6ovupnzvNiz5z/7/znOf/ds/zfyXFOeowk5SelYrkeF+g74oA34kIRtyy6jEj99b9ct37d729ZOFZk8JyEv33Dbb9as+aBFbctmioio3cgfGfhOTUUZXr3bH31MB4I82bOmjIu7NeQtxMHWt7ahDdqwGm3zBatMNguibe2/S0P8y648LSwYkhm39PPfoBXMUD40XURpUMhH3Yu7WS7tr+x9+LFZ0QZLvnyui+aMIxgNdbahMZaQDDc6wvnZcn8ekaKXlpnbazcgbprQVDXxCjxcuntdadHhXK5N+5s9SruwcIl04OhGmvwus5qn49KkvevwKsUwNxZcyfXhz3D//DKjYc8UIzg0XLfxpYXt73Xdqgr7XIcwShFinJzJnTs2/LCxhe2HnYYlOvKeQz32cGKT0E4b3nz0XgPsWjduGM1hV00jrf4kvYtqUoBwvxl33MlBj5/OHCsIvTN1j2nnlLtH5qlznVPUOEpCNcvm57tczDBUvkx2QOff8KUSbEqjE12b+uODQWPkQGCumXppEQe7YuGLIbJd2eOtHXmIpGqMOm25173KoyycOKy66qTNiYcsQwjpLod92gy3pkD7JYX8BgZIJy+/CqVtrUOR32U8ZIJF+jJUbR11WdlAcX6n17iZj10JOKjgkImWYBMBhNy0xse7BtIkGH1dg5UTVSoyOs7tHdXR5rw+Gnjcusfdb3hgzRu+SV2QWGNWk+qdfXKlY+uXbtqxX1P9iy4FvlygFjLF/bf34qGhMo616547PPmm2699Yez339wzac/uBI5NkjCvMaPsoQj442mMndva/D65qZYFb2fbt3xamLRhfHXhvZAaI5lMviC0bqJjVMmRP1UkPyECTWGonz8o+2vsjh+f9xDvpjfn0QOHT2cTXa0dwVObpg+qzHK8WS7Ejufjl3294fxFP1OvPzUk5ovunrxtTfe+uPv8tLKX6zc2n38b3J4zpUdR+cvGNhEUUvP07ndzzyy6pHn/hW9+o475vesv/t3H7uMLhyh6Romnn+CKBBuvqKm46nf3veXzdv+8czqNYcW3PnzxXVv/uEgo5NIMDTn7NDMy9EI1yyt73jqz/vdgPGJLrS3cfYp585qijVEGJ02GTTBQIcgly5rSm9YnTBaa6u4jJy05KoQ2Ibj8eJJGzu9Wcm5S8/OH2iJC57SopSI6Xj+30DlejvZncy4gJRedNHzlXXFzGz+nR0K19BfrtGqbXM3FSV3Pr7ynhWrXmq3IRDWWlGnllzkudlP8qItRBRaDMIHB6jk44fueXD9sxseuffX2zIQtChSi8bkVbZHA0qDFrQS2vfYlHF3PrDxY1sE9j/5m2cz+MKiQJ2ZBTel0BqlBHyA5NvylDn4xx0oAYXQsm6bTdDv9te4aJD+BWhxUUCqvIPM5nfppwW0r+XxA/gCFqg+lNSMpxSslItWfEmudyip8+28IPgosV7ZksMn2MoB9Y1atBlsBAR8hqLet59c3TL4QPYNTKaLiFLQ1RrHqCJwdfjkEB4lPgQs6wQN9n/++tCmrY/9qWOgl4/SFpS2jSLP+vAgwsAnE5o7B0pDhFs6W9vkx9798CY1Y0b0n4+XEpwjMvxneP9BlKa4lKWl8VsxpQWUKIUYpjVi71y7u6F56tRZE97Z1EvZO8iQ6rW1AoNGE1185Glb9WeIgN1wca27+4lPG2bEIDaDHZPnGjz/8ATXb5mCAiWIgYlLL6tVRotPizDpqrPUkQ0D9RCb5t+0H8wYxBIYeqNFajAaDCgFNP3s1C17+3wCVdMXnRPqfXFfw1k1lIyZ+u7zdWP8U2sSlLilg9NOAAfMYGP1181678N2zz/ujNkTDB9uH3PWWAboE+PvnjnXTDnlTfAGW/C8qRNBg2JQVdO1t9979123XznRkNuVnBRkUGBy9LU4Y+fViBFXycDQTZsfG+jAKuAywFRXD960zuzpDAdr8QehirGTdr59kWne9XIO7fQfYC6cqXBdlDF5ypnZ+dZEuw064A8GIN132DE1N/B6wiOQsRy37vKb68Bxwdi4BcqEzmzIdSe6u0g7pHO4tVGg/qYpr+8/6lKITrvg+/WA64C0ORKuE0ZwjhTvBXm84lK2E5g8hqJc/L2dPU7VyefWhyhKddrIfk/839CMlO3opUQUSkt46K9rxsb4DP28zpSDySvtFsoDAhE37zD4oKzIYD0hhhQKDpjicgqBCm8OUnlc5SrQvuoAFWRz4Mr7+E2FTQAvney/A6JCUWMol+/sc3ANFCjkAlTowZ/LFdC6SltUbqBY7xQ7wG9iMUMlno0RKuvrzAIFo1wKZKoqB4jFaPKJPOCiguC6haTD15PvzjhQcETfmQbE1X7ha+jrSTngQpWqCpVmMpH0+Mq8VLzbwXUhUGMCkT4HBxJ21OIrse10Mo8LikAsZCSaS1LkpJxogK/A6Un1gSPGpao6LP8Fy8nbmCTqYikAAAAASUVORK5CYII=";var tt=null,Jn=null,vp=250,_t=null,Qn=!1,nt=null,Bo=[];function yp(){return(!tt||!document.body.contains(tt))&&(tt=document.createElement("div"),tt.className="ytls-tooltip",tt.style.pointerEvents="none",document.body.appendChild(tt),window.addEventListener("scroll",vl,!0),window.addEventListener("resize",vl,!0)),tt}function wp(e,t,n){let a=window.innerWidth,r=window.innerHeight,l=e.getBoundingClientRect(),s=l.width,f=l.height,m=t+10,y=n+10;m+s>a-10&&(m=t-s-10),y+f>r-10&&(y=n-f-10),m=Math.max(10,Math.min(m,a-s-10)),y=Math.max(10,Math.min(y,r-f-10)),e.style.left=`${m}px`,e.style.top=`${y}px`}function yl(e,t){let o=window.innerWidth,a=window.innerHeight,r=t.getBoundingClientRect(),l=e.getBoundingClientRect(),s=l.width,f=l.height,m=Math.round(r.left+r.width/2-s/2),y=Math.round(r.top-f-8);y<8&&(y=Math.round(r.bottom+8)),m<8&&(m=Math.round(r.left)),m+s>o-8&&(m=Math.round(r.right-s)),m=Math.max(8,Math.min(m,o-s-8)),y=Math.max(8,Math.min(y,a-f-8)),e.style.left=`${m}px`,e.style.top=`${y}px`}function vl(){if(!(!tt||!_t)&&tt.classList.contains("ytls-tooltip-visible"))try{yl(tt,_t)}catch{}}function bp(e=50){nt&&(clearTimeout(nt),nt=null),!Qn&&(nt=setTimeout(()=>{Po(),nt=null},e))}function Sp(e,t,n,o){nt&&(clearTimeout(nt),nt=null),_t&&o&&_t!==o&&tt?.classList.contains("ytls-tooltip-visible")&&tt.classList.remove("ytls-tooltip-visible"),Jn&&clearTimeout(Jn),o&&(_t=o,Qn=!0),Jn=setTimeout(()=>{let a=yp();a.textContent=e,a.classList.remove("ytls-tooltip-visible"),o?requestAnimationFrame(()=>{yl(a,o),requestAnimationFrame(()=>{a.classList.add("ytls-tooltip-visible")})}):(wp(a,t,n),requestAnimationFrame(()=>{a.classList.add("ytls-tooltip-visible")}))},vp)}function Po(){Jn&&(clearTimeout(Jn),Jn=null),nt&&(clearTimeout(nt),nt=null),tt&&tt.classList.remove("ytls-tooltip-visible"),_t=null,Qn=!1}function Ci(){Po()}function ze(e,t){let n=0,o=0,a=m=>{n=m.clientX,o=m.clientY,nt&&(clearTimeout(nt),nt=null),Qn=!0,_t=e;let y=typeof t=="function"?t():t;y&&Sp(y,n,o,e)},r=m=>{n=m.clientX,o=m.clientY},l=()=>{_t===e&&(Qn=!1,bp())};e.addEventListener("mouseenter",a),e.addEventListener("mousemove",r),e.addEventListener("mouseleave",l);let s=m=>{Qn=!1,_t===e&&Po()};e.addEventListener("click",s,!0);let f=new MutationObserver(()=>{if(_t===e)try{let m=window.getComputedStyle(e);(m.display==="none"||m.visibility==="hidden"||m.opacity==="0")&&Po()}catch{}});try{f.observe(e,{attributes:!0,attributeFilter:["class","style"]})}catch{}Bo.push(f),e.__tooltipCleanup=()=>{e.removeEventListener("mouseenter",a),e.removeEventListener("mousemove",r),e.removeEventListener("mouseleave",l),e.removeEventListener("click",s,!0);try{f.disconnect()}catch{}let m=Bo.indexOf(f);m!==-1&&Bo.splice(m,1),delete e.__tooltipObserver},e.__tooltipObserver=f}function wl(){for(let e of Bo)try{e.disconnect()}catch{}Bo.length=0,Po()}var Fr={};Ad(Fr,{addTimestamp:()=>Mp,buildExportCsvPayload:()=>Op,buildExportPayload:()=>Rp,deleteSingleTimestampFromIndexedDB:()=>Bp,exportAllTimestamps:()=>Dp,exportAllTimestampsCsv:()=>_p,getRecordsChangedSince:()=>Hi,loadFromIndexedDB:()=>Ni,loadGlobalSettings:()=>Kt,mergeBackupData:()=>Np,mergeRemoteRecords:()=>zi,onTimestampsWritten:()=>Gi,removeFromIndexedDB:()=>Pp,saveGlobalSettings:()=>wn,saveRowsToIndexedDB:()=>Ip,saveSingleTimestampToIndexedDB:()=>Cp,saveToIndexedDB:()=>Lp});var xp="ytls-timestamps-db",Tp=5,Zn="timestamps",mt="timestamps_v2",yn="settings",vn=null,eo=null;function Hr(){if(vn)try{return vn.objectStoreNames,Promise.resolve(vn)}catch(e){c("IndexedDB connection is no longer usable:",e,"warn"),vn=null}return eo||(eo=kp().then(e=>(vn=e,eo=null,e.onclose=()=>{c("IndexedDB connection closed unexpectedly","warn"),vn=null},e.onversionchange=()=>{c("IndexedDB upgrade requested by another tab; closing this connection",null,"warn"),e.close(),vn===e&&(vn=null)},e.onerror=t=>{c("IndexedDB connection error:",t,"error")},e)).catch(e=>{throw eo=null,e}),eo)}function bl(e,t){let n=crypto.randomUUID(),o=0,a=e.openCursor();a.onsuccess=r=>{let l=r.target.result;l?(o++,l.update({...l.value,write_counter:o,device_id:n}),l.continue()):(t.put({key:"write_counter",value:o}),t.put({key:"device_id",value:n}),c(`Lamport migration: backfilled ${o} records, device_id=${n}`))},a.onerror=()=>{c("Lamport migration: cursor error during backfill",a.error,"error")}}function kp(){return new Promise((e,t)=>{let n=indexedDB.open(xp,Tp);n.onupgradeneeded=o=>{let a=o.target.result,r=o.oldVersion,l=o.target.transaction;if(r<1&&a.createObjectStore(Zn,{keyPath:"video_id"}),r<2&&!a.objectStoreNames.contains(yn)&&a.createObjectStore(yn,{keyPath:"key"}),r<3){if(a.objectStoreNames.contains(Zn)){c("Exporting backup before v2 migration...");let y=l.objectStore(Zn).getAll();y.onsuccess=()=>{let h=Rr.array().safeParse(y.result);if(h.success&&h.data.length>0)try{let v={},E=0;h.data.forEach(q=>{if(q.timestamps.length>0){let ee=Co.parse(q.timestamps);v[`ytls-${q.video_id}`]={video_id:q.video_id,timestamps:[...ee].sort((_,$)=>_.start-$.start)},E+=ee.length}});let I=new Blob([JSON.stringify(v,null,2)],{type:"application/json"}),O=URL.createObjectURL(I),G=document.createElement("a");G.href=O,G.download=`timekeeper-data-${Dn()}.json`,G.click(),URL.revokeObjectURL(O),c(`Pre-migration backup exported: ${h.data.length} videos, ${E} timestamps`)}catch(v){c("Failed to export pre-migration backup:",v,"error")}else h.success||c("Skipping pre-migration backup: legacy data failed validation",h.error.message,"warn")}}let f=a.createObjectStore(mt,{keyPath:"guid"});if(f.createIndex("video_id","video_id",{unique:!1}),f.createIndex("video_start",["video_id","start"],{unique:!1}),a.objectStoreNames.contains(Zn)){let y=l.objectStore(Zn).getAll();y.onsuccess=()=>{let h=Rr.array().safeParse(y.result);if(h.success&&h.data.length>0){let v=0;h.data.forEach(E=>{E.timestamps.length>0&&E.timestamps.forEach(I=>{f.put({guid:I.guid,video_id:E.video_id,start:I.start,comment:I.comment}),v++})}),c(`Migrated ${v} timestamps from ${h.data.length} videos to v2 store`)}else h.success||c("Skipping v1 \u2192 v2 migration: legacy data failed validation",h.error.message,"warn");r<4&&bl(l.objectStore(mt),l.objectStore(yn))},a.deleteObjectStore(Zn),c("Deleted old timestamps store after migration to v2")}}r===3&&bl(l.objectStore(mt),l.objectStore(yn));let s=l.objectStore(mt);s.indexNames.contains("write_counter")||s.createIndex("write_counter","write_counter",{unique:!1})},n.onsuccess=o=>{e(o.target.result)},n.onerror=o=>{let a=o.target.error;t(a??new Error("Failed to open IndexedDB"))},n.onblocked=()=>{c("IndexedDB open is blocked by another tab holding an older connection; waiting",null,"warn")}})}function zr(e,t,n){return Hr().then(o=>new Promise((a,r)=>{let l;try{l=o.transaction(e,t)}catch(m){r(new Error(`Failed to create transaction for ${e}: ${m}`));return}let s=l.objectStore(e),f;try{f=n(s)}catch(m){r(new Error(`Failed to execute operation on ${e}: ${m}`));return}f&&(f.onsuccess=()=>a(f.result),f.onerror=()=>r(f.error??new Error(`IndexedDB ${t} operation failed`))),l.oncomplete=()=>{f||a(void 0)},l.onerror=()=>r(l.error??new Error("IndexedDB transaction failed")),l.onabort=()=>r(l.error??new Error("IndexedDB transaction aborted"))}))}var Bi=new Set;function Sl(e){return Bi.add(e),()=>Bi.delete(e)}function Ap(){for(let e of Bi)try{e()}catch(t){c("Timestamp write listener failed:",t,"error")}}function Ro(e,{silent:t=!1}={}){return Hr().then(n=>new Promise((o,a)=>{let r;try{r=n.transaction([mt,yn],"readwrite")}catch(l){a(new Error(`Failed to create transaction: ${l}`));return}r.oncomplete=()=>{o(),t||Ap()},r.onerror=()=>a(new Error(`IndexedDB write failed: ${r.error?.message??"unknown"}`)),r.onabort=()=>a(new Error(`IndexedDB transaction aborted: ${r.error?.message??"unknown"}`));try{e(r.objectStore(mt),r.objectStore(yn))}catch(l){try{r.abort()}catch{}a(l instanceof Error?l:new Error(String(l)))}}))}function Do(e,t){let n=e.get("write_counter");n.onsuccess=()=>{let o=typeof n.result?.value=="number"?n.result.value:0;e.put({key:"write_counter",value:t(o)})}}function xl(e,t){let n=Co.safeParse(t);if(!n.success)return Promise.reject(new Error(`Invalid timestamp payload for ${e}`));let o=n.data;return Ro((a,r)=>{let l=a.index("video_id").getAll(IDBKeyRange.only(e));l.onsuccess=()=>{let s=l.result??[],f=new Map(s.map(h=>[h.guid,h])),m=new Set(o.map(h=>h.guid)),y=Date.now();Do(r,h=>{let v=h;return s.forEach(E=>{!m.has(E.guid)&&!E.deleted_at&&(v++,a.put({...E,deleted_at:y,write_counter:v}))}),o.forEach(E=>{let I=f.get(E.guid);I&&!I.deleted_at&&!E.deleted_at&&I.start===E.start&&I.comment===E.comment||(v++,a.put({guid:E.guid,video_id:e,start:E.start,comment:E.comment,write_counter:v,deleted_at:E.deleted_at??I?.deleted_at??void 0}))}),v})}})}function Pi(e,t){let n=Co.safeParse(t);if(!n.success)return Promise.reject(new Error(`Invalid timestamp payload for ${e}`));let o=n.data;return o.length===0?Promise.resolve():Ro((a,r)=>{Do(r,l=>{let s=l;return o.forEach(f=>{s++,a.put({guid:f.guid,video_id:e,start:f.start,comment:f.comment,write_counter:s,deleted_at:f.deleted_at})}),s})})}function Tl(e,t){return Pi(e,[t])}function Ri(e,t={}){return e.length===0?Promise.resolve():Ro((n,o)=>{Do(o,a=>{let r=a;return e.forEach(l=>{l.write_counter!==void 0&&l.write_counter>r&&(r=l.write_counter)}),e.forEach(l=>{let s={guid:l.guid,video_id:l.video_id,start:l.start,comment:l.comment,deleted_at:l.deleted_at,write_counter:l.write_counter??++r};n.put(s)}),r+1})},t)}function kl(e){return c(`Soft-deleting timestamp ${e}`),Ro((t,n)=>{let o=t.get(e);o.onsuccess=()=>{let a=o.result;a&&Do(n,r=>(t.put({...a,deleted_at:Date.now(),write_counter:r+1}),r+1))}})}function Al(e){return Hr().then(t=>new Promise((n,o)=>{let a;try{a=t.transaction([mt],"readonly")}catch(l){let s=`Failed to create read transaction: ${l}`;c(s,l,"error"),o(new Error(s));return}a.onabort=()=>{let l=`Transaction aborted during load: ${a.error?.message??"unknown"}`;c(l,a.error,"error"),o(new Error(l))};let r=a.objectStore(mt).index("video_id").getAll(IDBKeyRange.only(e));r.onsuccess=()=>{try{let l=r.result.filter(m=>!m.deleted_at),s=[],f=0;for(let m of l){let y=Pr.safeParse({guid:m.guid,start:m.start,comment:m.comment});y.success?s.push(y.data):f++}if(f>0&&c(`Skipped ${f} stored timestamps for ${e} that failed validation`,null,"warn"),s.length===0){f>0?o(new Error(`Stored timestamps for this video failed validation (${f} rows)`)):n(null);return}n(s.sort((m,y)=>m.start-y.start))}catch(l){o(l)}},r.onerror=()=>{let l=`Failed to load timestamps from IndexedDB: ${r.error?.message??"unknown error"}`;c(l,r.error,"error"),o(new Error(l))}}))}function El(e){return Ro((t,n)=>{let o=t.index("video_id").getAll(IDBKeyRange.only(e));o.onsuccess=()=>{let a=o.result??[],r=Date.now();Do(n,l=>{let s=l;return a.forEach(f=>{f.deleted_at||(s++,t.put({...f,deleted_at:r,write_counter:s}))}),s})}})}function Gr(){return zr(mt,"readonly",e=>e.getAll()).then(e=>Array.isArray(e)?e:[])}function Ml(e){return zr(mt,"readonly",t=>t.index("write_counter").getAll(IDBKeyRange.lowerBound(e,!0))).then(t=>Array.isArray(t)?t:[])}function Il(e){return e.length===0?Promise.resolve([]):Hr().then(t=>new Promise((n,o)=>{let a=[],r=t.transaction(mt,"readonly"),l=r.objectStore(mt);for(let s of e)l.get(s).onsuccess=f=>{let m=f.target.result;m&&a.push(m)};r.oncomplete=()=>n(a),r.onerror=()=>o(r.error??new Error("IndexedDB read failed")),r.onabort=()=>o(r.error??new Error("IndexedDB read aborted"))}))}function Ll(e,t){return zr(yn,"readwrite",n=>{n.put({key:e,value:t})}).then(()=>{}).catch(n=>{c(`Failed to save setting '${e}' to IndexedDB:`,n,"error")})}function Cl(e){return zr(yn,"readonly",t=>t.get(e)).then(t=>t?.value).catch(t=>{c(`Failed to load setting '${e}' from IndexedDB:`,t,"error")})}async function Di({includeDeleted:e=!1}={}){let t={},n=await Gr(),o=[],a=0;for(let h of n){let v=hn.safeParse(h);v.success?o.push(v.data):a++}a>0&&c(`Skipped ${a} timestamp rows that failed validation during export`,null,"warn");let l=[...e?o:o.filter(h=>!h.deleted_at)].sort((h,v)=>{let E=h.video_id.localeCompare(v.video_id);if(E!==0)return E;let I=h.start-v.start;return I!==0?I:h.guid.localeCompare(v.guid)}),s=new Map;for(let h of l)s.has(h.video_id)||s.set(h.video_id,[]),s.get(h.video_id).push({guid:h.guid,start:h.start,comment:h.comment,write_counter:h.write_counter,deleted_at:h.deleted_at});let f=Array.from(s.keys()).sort((h,v)=>h.localeCompare(v));for(let h of f){let v=s.get(h);t[`ytls-${h}`]={video_id:h,timestamps:v}}return{json:JSON.stringify(t,null,2),filename:"timekeeper-data.json",totalVideos:s.size,totalTimestamps:l.length,invalidRows:a}}async function Rl(){try{let{json:e,filename:t,totalVideos:n,totalTimestamps:o}=await Di(),a=new Blob([e],{type:"application/json"}),r=URL.createObjectURL(a),l=document.createElement("a");l.href=r,l.download=t,l.click(),URL.revokeObjectURL(r),c(`Exported ${n} videos with ${o} timestamps`)}catch(e){throw c("Failed to export data:",e,"error"),e}}async function Oi(){let e=hn.array().safeParse((await Gr()).filter(m=>!m.deleted_at));if(!e.success||e.data.length===0){e.success||c("Failed to parse timestamp rows for CSV export:",e.error.message,"warn");let m=`Tag,Timestamp,URL
`,y=`timestamps-${Dn()}.csv`;return{csv:m,filename:y,totalVideos:0,totalTimestamps:0}}let t=e.data,n=new Map;for(let m of t)n.has(m.video_id)||n.set(m.video_id,[]),n.get(m.video_id).push({start:m.start,comment:m.comment});let o=[];o.push("Tag,Timestamp,URL");let a=0,r=m=>`"${String(m).replace(/"/g,'""')}"`,l=Array.from(n.keys()).sort();for(let m of l){let y=n.get(m).sort((h,v)=>h.start-v.start);for(let h of y){let v=h.comment,E=gn(h.start,36e3),I=fl(h.start,`https://www.youtube.com/watch?v=${m}`);o.push([r(v),r(E),r(I)].join(",")),a++}}let s=o.join(`
`),f=`timestamps-${Dn()}.csv`;return{csv:s,filename:f,totalVideos:n.size,totalTimestamps:a}}async function Dl(){try{let{csv:e,filename:t,totalVideos:n,totalTimestamps:o}=await Oi(),a=new Blob([e],{type:"text/csv;charset=utf-8;"}),r=URL.createObjectURL(a),l=document.createElement("a");l.href=r,l.download=t,l.click(),URL.revokeObjectURL(r),c(`Exported ${n} videos with ${o} timestamps (CSV)`)}catch(e){throw c("Failed to export CSV data:",e,"error"),e}}async function _i(e,t){if(!e)throw new Error("Video ID is required");if(!t.guid||t.start==null)throw new Error("Timestamp must have GUID and start time");return Tl(e,t)}async function Ol(e,t){if(!e)throw new Error("Video ID is required");return Pi(e,t)}async function _l(e,t){if(!e)throw new Error("Video ID is required");if(!Array.isArray(t))throw new Error("Timestamps must be an array");return xl(e,t)}async function Nl(e){if(!e)throw new Error("GUID is required");return kl(e)}async function Hl(e){if(!e)throw new Error("Video ID is required");return El(e)}async function zl(e){if(!e)throw new Error("Video ID is required");return Al(e)}async function Gl(e){let t;try{t=JSON.parse(e)}catch{return c("mergeBackupData: failed to parse JSON",null,"warn"),{mergedVideos:0,mergedTimestamps:0}}let n=Ls.safeParse(t);if(!n.success)return c("mergeBackupData: data failed validation",n.error.message,"warn"),{mergedVideos:0,mergedTimestamps:0};let o=await Gr(),a=new Map;for(let f of o)a.set(f.guid,f);let r=0,l=0,s=[];for(let[,f]of Object.entries(n.data)){let{video_id:m,timestamps:y}=f,h=0;for(let v of y){let E=a.get(v.guid);Fl(E,m,v)&&(s.push({guid:v.guid,video_id:m,start:v.start,comment:v.comment,write_counter:v.write_counter,deleted_at:v.deleted_at}),a.set(v.guid,{...E??{},guid:v.guid,video_id:m,start:v.start,comment:v.comment,write_counter:v.write_counter,deleted_at:v.deleted_at}),h++,l++)}h>0&&r++}return await Ri(s),{mergedVideos:r,mergedTimestamps:l}}function Pl(e,t){return JSON.stringify([e,t.start,t.comment,t.deleted_at??null])}function Fl(e,t,n){return e?e.write_counter===void 0||n.write_counter===void 0?!1:n.write_counter!==e.write_counter?n.write_counter>e.write_counter:Pl(t,n)>Pl(e.video_id,e):!0}async function Ul(e){let t=[];for(let n of await Ml(e)){let o=hn.safeParse(n);if(!o.success||o.data.write_counter===void 0)continue;let{guid:a,video_id:r,start:l,comment:s,write_counter:f,deleted_at:m}=o.data;t.push({guid:a,video_id:r,start:l,comment:s,write_counter:f,...m!==void 0?{deleted_at:m}:{}})}return t}async function Vl(e){let t=new Map;for(let a of await Il(e.map(r=>r.guid)))t.set(a.guid,a);let n=[],o=new Set;for(let a of e)Fl(t.get(a.guid),a.video_id,a)&&(n.push(a),o.add(a.video_id));return await Ri(n,{silent:!0}),{mergedVideos:o.size,mergedTimestamps:n.length}}function ql(e,t){if(!e)throw new Error("Setting key is required");return Ll(e,t)}async function jl(e){if(!e)throw new Error("Setting key is required");return Cl(e)}function Mp(e,t){return _i(e,t)}function Ip(e,t){return Ol(e,t)}function Lp(e,t){return _l(e,t)}function Cp(e,t){return _i(e,t)}function Ni(e){return zl(e)}function Bp(e,t){return Nl(t)}function Pp(e){return Hl(e)}function wn(e,t){return ql(e,t)}function Kt(e){return jl(e)}function Rp(e){return Di(e)}function Dp(){return Rl()}function Op(){return Oi()}function _p(){return Dl()}function Np(e){return Gl(e)}function Hi(e){return Ul(e)}function zi(e){return Vl(e)}function Gi(e){return Sl(e)}function Ur(e){return e?Array.from(e.querySelectorAll("li:not(.ytls-placeholder):not(.ytls-error-message)")):[]}function Vr(e){if(!e)return;e.replaceChildren();let t=e.querySelector(".ytls-error-message");t&&t.remove()}function Fi(e,t){if(!e)return;Vr(e);let n=document.createElement("li");n.className="ytls-placeholder",n.textContent=t,e.appendChild(n),e.style.overflowY="hidden"}function $l(e){if(!e)return;let t=e.querySelector(".ytls-placeholder");t&&t.remove(),e.style.overflowY=""}function Oo(e){return e?e.querySelector(".ytls-error-message")!==null:!1}function Wl(e,t){if(!e)return;Vr(e);let n=document.createElement("li");n.className="ytls-error-message",n.style.cssText=`
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
  `,n.innerHTML=`<div style="margin-bottom:8px">\u26A0\uFE0F ${Hp(t)}</div><div style="font-size:12px;font-weight:normal;color:#aaa">Check the console for details or refresh the page.</div>`,e.appendChild(n),e.style.overflowY="hidden"}function Yl(e){if(!e)return;let t=e.querySelector(".ytls-error-message");t&&t.remove()}function Hp(e){let t=document.createElement("div");return t.textContent=e,t.innerHTML}function Kl(e,t){if(!e||t||Oo(e))return;Array.from(e.children).some(o=>!o.classList.contains("ytls-placeholder")&&!o.classList.contains("ytls-error-message"))||Fi(e,"No timestamps for this video")}function Xl(e){if(!e)return[];let t=Ur(e),n=[];return t.forEach(o=>{let a=o.querySelector("[data-time]"),r=o.querySelector("input"),l=o.dataset.guid;if(!a||!r||!l)return;let s=a.dataset.time;if(!s)return;let f=Number.parseInt(s,10);Number.isFinite(f)&&n.push({guid:l,start:f,comment:r.value})}),n.sort((o,a)=>o.start-a.start)}function Jl(e){if(!e)return 0;let t=Ur(e),n=0;return t.forEach(o=>{let r=o.querySelector("[data-time]")?.dataset.time;if(r){let l=Number.parseInt(r,10);Number.isFinite(l)&&(n=Math.max(n,l))}}),n}var Gp={auth:{googleAuthState:{isSignedIn:!1,accessToken:null,userName:null,email:null},syncAuthState:Xn,autoBackupEnabled:!0,autoBackupIntervalMinutes:30,autoBackupRetryAttempts:0,autoBackupBackoffMs:null,lastAutoBackupAt:null,isAutoBackupRunning:!1},ui:{panePosition:null,currentVideoId:"",minPaneHeight:250,lastHandledUrl:null,urlChangeHandlersSetup:!1},timestamps:{items:[],currentIndex:null,dbError:null}},lt=JSON.parse(JSON.stringify(Gp));function $e(){return lt}function qr(e){lt={...lt,...e,auth:{...lt.auth,...e.auth||{}},ui:{...lt.ui,...e.ui||{}},timestamps:{...lt.timestamps,...e.timestamps||{}}}}function bn(e,t){qr({auth:{...lt.auth,[e]:t}})}function jr(e,t){qr({ui:{...lt.ui,[e]:t}})}function Nt(){return lt.auth.googleAuthState}function Mt(e){bn("googleAuthState",e)}function Ql(){return lt.auth.syncAuthState}function to(e){bn("syncAuthState",e)}function Ui(e){bn("autoBackupEnabled",e)}function Vi(e){bn("autoBackupIntervalMinutes",e)}function qi(e){bn("isAutoBackupRunning",e)}function $r(e){bn("autoBackupRetryAttempts",e)}function no(e){bn("autoBackupBackoffMs",e)}function ji(e){bn("lastAutoBackupAt",e)}function Zl(e){jr("minPaneHeight",e)}function ec(e){jr("panePosition",e)}function tc(e){jr("lastHandledUrl",e)}function nc(e){jr("urlChangeHandlersSetup",e)}function oc(e){qr({timestamps:{...lt.timestamps,items:e}})}function $i(e){qr({timestamps:{...lt.timestamps,dbError:e}})}function rc(){return lt.timestamps.dbError}var On=typeof unsafeWindow<"u"?unsafeWindow:window,uc=43200*14,ic="html5_max_live_dvr_window_plus_margin_secs";function Xt(e){return e!=null&&typeof e=="object"}function ac(e){let{streamingData:t,videoDetails:n,playerConfig:o,microformat:a}=e;if(!Xt(n)||!n.isLive)return;let r=n.isLiveDvrEnabled===!0;if(n.isLiveDvrEnabled=!0,!r&&Xt(o)){let l=o.mediaCommonConfig;if(Xt(l)){l.useServerDrivenAbr=!1;let s=l.serverPlaybackStartConfig;Xt(s)&&(s.enable=!1)}}if(Xt(t)){let l=t;if(Array.isArray(l.adaptiveFormats)&&Fp(a))for(let s of l.adaptiveFormats)s.maxDvrDurationSec=uc}}function Fp(e){if(!Xt(e))return!1;let t=e.playerMicroformatRenderer;if(!Xt(t))return!1;let n=t.liveBroadcastDetails;if(!Xt(n))return!1;let o=n.startTimestamp;return!o||typeof o!="string"?!1:(Date.now()-new Date(o).getTime())/1e3>43200}function Yi(e){if(!e||typeof e!="object")return!1;let t=e;return t.videoDetails?(ac(t),!0):t.playerResponse&&Xt(t.playerResponse)&&t.playerResponse.videoDetails?(ac(t.playerResponse),!0):!1}function Up(){let e=Object.getOwnPropertyDescriptor(On,"ytInitialPlayerResponse"),t=e&&e.set,n=On.ytInitialPlayerResponse;if(!Yi(n))try{Object.defineProperty(On,"ytInitialPlayerResponse",{configurable:!0,get(){return n},set(o){t&&t.call(this,o),n=o,Yi(o)&&Object.defineProperty(On,"ytInitialPlayerResponse",{configurable:!0,writable:!0,value:o})}})}catch{}}var sc=!1;function Vp(){if(sc)return;sc=!0;let e=JSON.parse;JSON.parse=function(t,n){let o=e.call(this,t,n);try{Yi(o)}catch{}return o}}function lc(e){if(e.__dvrCapLifted)return;let n=(typeof e.d=="function"?e.d():void 0)?.WEB_PLAYER_CONTEXT_CONFIGS;if(!n)return;let o=n;for(let a in o){let r=o[a];if(r&&typeof r.serializedExperimentFlags=="string"){let l=r.serializedExperimentFlags,s=l.replace(new RegExp(`${ic}=[\\d.]+`),`${ic}=${uc}`);s!==l&&(r.serializedExperimentFlags=s)}}e.__dvrCapLifted=!0}function cc(e){if(!e||e.__dvrHooked)return e;e.__dvrHooked=!0;let t=e.set;typeof t=="function"&&(e.set=function(...n){let o=t.apply(this,n);try{lc(e)}catch{}return o});try{lc(e)}catch{}return e}function qp(){let e={};On.ytcfg&&(e=cc(On.ytcfg));try{Object.defineProperty(On,"ytcfg",{configurable:!0,get(){return e},set(t){e=cc(t)}})}catch{}}function dc(){Up(),Vp(),qp(),c("[Timekeeper] DVR/Rewind enablement initialized for live streams")}var jp="BADGE_STYLE_TYPE_MEMBERS_ONLY";function _o(e){return typeof e=="object"&&e!==null}function pc(e,t=0){return!_o(e)||t>8?!1:e.style===jp?!0:Object.values(e).some(n=>pc(n,t+1))}function mc(e,t){let n=_o(t)?t.videoDetails:void 0;if(!_o(n)||typeof n.videoId!="string"||typeof n.channelId!="string")return null;let o=e?.contents?.twoColumnWatchNextResults?.results?.results?.contents;if(!Array.isArray(o))return null;let a=o.find(r=>_o(r)&&_o(r.videoPrimaryInfoRenderer));return a?{videoId:n.videoId,channelId:n.channelId,membersOnly:pc(a.videoPrimaryInfoRenderer)}:null}var Ki="#author-name, #author-text";function fc(){return window.top!==window.self&&window.location.pathname.startsWith("/live_chat")}function Xi(e){let t=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);for(let n=t.nextNode();n;n=t.nextNode()){let o=n.nodeValue??"";if(o.trim()){/^\s*@/.test(o)&&(n.nodeValue=o.replace(/^(\s*)@/,"$1"));return}}}function Ji(e){if(e.nodeType===Node.TEXT_NODE){let t=e.parentElement?.closest(Ki);t&&Xi(t);return}e instanceof Element&&(e.matches(Ki)&&Xi(e),e.querySelectorAll(Ki).forEach(Xi))}function hc(){let e=new MutationObserver(t=>{for(let n of t)n.type==="characterData"?Ji(n.target):n.addedNodes.forEach(Ji)});document.documentElement&&Ji(document.documentElement),e.observe(document,{childList:!0,subtree:!0,characterData:!0})}var ve=Uint8Array,ct=Uint16Array,la=Int32Array,Wr=new ve([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Yr=new ve([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),na=new ve([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),xc=function(e,t){for(var n=new ct(31),o=0;o<31;++o)n[o]=t+=1<<e[o-1];for(var a=new la(n[30]),o=1;o<30;++o)for(var r=n[o];r<n[o+1];++r)a[r]=r-n[o]<<5|o;return{b:n,r:a}},Tc=xc(Wr,2),kc=Tc.b,oa=Tc.r;kc[28]=258,oa[258]=28;var Ac=xc(Yr,0),$p=Ac.b,gc=Ac.r,ra=new ct(32768);for(J=0;J<32768;++J)Jt=(J&43690)>>1|(J&21845)<<1,Jt=(Jt&52428)>>2|(Jt&13107)<<2,Jt=(Jt&61680)>>4|(Jt&3855)<<4,ra[J]=((Jt&65280)>>8|(Jt&255)<<8)>>1;var Jt,J,zt=(function(e,t,n){for(var o=e.length,a=0,r=new ct(t);a<o;++a)e[a]&&++r[e[a]-1];var l=new ct(t);for(a=1;a<t;++a)l[a]=l[a-1]+r[a-1]<<1;var s;if(n){s=new ct(1<<t);var f=15-t;for(a=0;a<o;++a)if(e[a])for(var m=a<<4|e[a],y=t-e[a],h=l[e[a]-1]++<<y,v=h|(1<<y)-1;h<=v;++h)s[ra[h]>>f]=m}else for(s=new ct(o),a=0;a<o;++a)e[a]&&(s[a]=ra[l[e[a]-1]++]>>15-e[a]);return s}),Sn=new ve(288);for(J=0;J<144;++J)Sn[J]=8;var J;for(J=144;J<256;++J)Sn[J]=9;var J;for(J=256;J<280;++J)Sn[J]=7;var J;for(J=280;J<288;++J)Sn[J]=8;var J,zo=new ve(32);for(J=0;J<32;++J)zo[J]=5;var J,Wp=zt(Sn,9,0),Yp=zt(Sn,9,1),Kp=zt(zo,5,0),Xp=zt(zo,5,1),Qi=function(e){for(var t=e[0],n=1;n<e.length;++n)e[n]>t&&(t=e[n]);return t},It=function(e,t,n){var o=t/8|0;return(e[o]|e[o+1]<<8)>>(t&7)&n},Zi=function(e,t){var n=t/8|0;return(e[n]|e[n+1]<<8|e[n+2]<<16)>>(t&7)},ca=function(e){return(e+7)/8|0},Go=function(e,t,n){return(t==null||t<0)&&(t=0),(n==null||n>e.length)&&(n=e.length),new ve(e.subarray(t,n))};var Jp=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],Ue=function(e,t,n){var o=new Error(t||Jp[e]);if(o.code=e,Error.captureStackTrace&&Error.captureStackTrace(o,Ue),!n)throw o;return o},Qp=function(e,t,n,o){var a=e.length,r=o?o.length:0;if(!a||t.f&&!t.l)return n||new ve(0);var l=!n,s=l||t.i!=2,f=t.i;l&&(n=new ve(a*3));var m=function(it){var K=n.length;if(it>K){var Ft=new ve(Math.max(K*2,it));Ft.set(n),n=Ft}},y=t.f||0,h=t.p||0,v=t.b||0,E=t.l,I=t.d,O=t.m,G=t.n,q=a*8;do{if(!E){y=It(e,h,1);var ee=It(e,h+1,3);if(h+=3,ee)if(ee==1)E=Yp,I=Xp,O=9,G=5;else if(ee==2){var ye=It(e,h,31)+257,pe=It(e,h+10,15)+4,F=ye+It(e,h+5,31)+1;h+=14;for(var P=new ve(F),he=new ve(19),ae=0;ae<pe;++ae)he[na[ae]]=It(e,h+ae*3,7);h+=pe*3;for(var Te=Qi(he),Ke=(1<<Te)-1,De=zt(he,Te,1),ae=0;ae<F;){var Oe=De[It(e,h,Ke)];h+=Oe&15;var _=Oe>>4;if(_<16)P[ae++]=_;else{var Ae=0,le=0;for(_==16?(le=3+It(e,h,3),h+=2,Ae=P[ae-1]):_==17?(le=3+It(e,h,7),h+=3):_==18&&(le=11+It(e,h,127),h+=7);le--;)P[ae++]=Ae}}var _e=P.subarray(0,ye),Ee=P.subarray(ye);O=Qi(_e),G=Qi(Ee),E=zt(_e,O,1),I=zt(Ee,G,1)}else Ue(1);else{var _=ca(h)+4,$=e[_-4]|e[_-3]<<8,se=_+$;if(se>a){f&&Ue(0);break}s&&m(v+$),n.set(e.subarray(_,se),v),t.b=v+=$,t.p=h=se*8,t.f=y;continue}if(h>q){f&&Ue(0);break}}s&&m(v+131072);for(var Lt=(1<<O)-1,Me=(1<<G)-1,we=h;;we=h){var Ae=E[Zi(e,h)&Lt],be=Ae>>4;if(h+=Ae&15,h>q){f&&Ue(0);break}if(Ae||Ue(2),be<256)n[v++]=be;else if(be==256){we=h,E=null;break}else{var ce=be-254;if(be>264){var ae=be-257,ue=Wr[ae];ce=It(e,h,(1<<ue)-1)+kc[ae],h+=ue}var rt=I[Zi(e,h)&Me],tn=rt>>4;rt||Ue(3),h+=rt&15;var Ee=$p[tn];if(tn>3){var ue=Yr[tn];Ee+=Zi(e,h)&(1<<ue)-1,h+=ue}if(h>q){f&&Ue(0);break}s&&m(v+131072);var nn=v+ce;if(v<Ee){var An=r-Ee,Pe=Math.min(Ee,nn);for(An+v<0&&Ue(3);v<Pe;++v)n[v]=o[An+v]}for(;v<nn;++v)n[v]=n[v-Ee]}}t.l=E,t.p=we,t.b=v,t.f=y,E&&(y=1,t.m=O,t.d=I,t.n=G)}while(!y);return v!=n.length&&l?Go(n,0,v):n.subarray(0,v)},Qt=function(e,t,n){n<<=t&7;var o=t/8|0;e[o]|=n,e[o+1]|=n>>8},No=function(e,t,n){n<<=t&7;var o=t/8|0;e[o]|=n,e[o+1]|=n>>8,e[o+2]|=n>>16},ea=function(e,t){for(var n=[],o=0;o<e.length;++o)e[o]&&n.push({s:o,f:e[o]});var a=n.length,r=n.slice();if(!a)return{t:Mc,l:0};if(a==1){var l=new ve(n[0].s+1);return l[n[0].s]=1,{t:l,l:1}}n.sort(function(se,ye){return se.f-ye.f}),n.push({s:-1,f:25001});var s=n[0],f=n[1],m=0,y=1,h=2;for(n[0]={s:-1,f:s.f+f.f,l:s,r:f};y!=a-1;)s=n[n[m].f<n[h].f?m++:h++],f=n[m!=y&&n[m].f<n[h].f?m++:h++],n[y++]={s:-1,f:s.f+f.f,l:s,r:f};for(var v=r[0].s,o=1;o<a;++o)r[o].s>v&&(v=r[o].s);var E=new ct(v+1),I=ia(n[y-1],E,0);if(I>t){var o=0,O=0,G=I-t,q=1<<G;for(r.sort(function(ye,pe){return E[pe.s]-E[ye.s]||ye.f-pe.f});o<a;++o){var ee=r[o].s;if(E[ee]>t)O+=q-(1<<I-E[ee]),E[ee]=t;else break}for(O>>=G;O>0;){var _=r[o].s;E[_]<t?O-=1<<t-E[_]++-1:++o}for(;o>=0&&O;--o){var $=r[o].s;E[$]==t&&(--E[$],++O)}I=t}return{t:new ve(E),l:I}},ia=function(e,t,n){return e.s==-1?Math.max(ia(e.l,t,n+1),ia(e.r,t,n+1)):t[e.s]=n},vc=function(e){for(var t=e.length;t&&!e[--t];);for(var n=new ct(++t),o=0,a=e[0],r=1,l=function(f){n[o++]=f},s=1;s<=t;++s)if(e[s]==a&&s!=t)++r;else{if(!a&&r>2){for(;r>138;r-=138)l(32754);r>2&&(l(r>10?r-11<<5|28690:r-3<<5|12305),r=0)}else if(r>3){for(l(a),--r;r>6;r-=6)l(8304);r>2&&(l(r-3<<5|8208),r=0)}for(;r--;)l(a);r=1,a=e[s]}return{c:n.subarray(0,o),n:t}},Ho=function(e,t){for(var n=0,o=0;o<t.length;++o)n+=e[o]*t[o];return n},Ec=function(e,t,n){var o=n.length,a=ca(t+2);e[a]=o&255,e[a+1]=o>>8,e[a+2]=e[a]^255,e[a+3]=e[a+1]^255;for(var r=0;r<o;++r)e[a+r+4]=n[r];return(a+4+o)*8},yc=function(e,t,n,o,a,r,l,s,f,m,y){Qt(t,y++,n),++a[256];for(var h=ea(a,15),v=h.t,E=h.l,I=ea(r,15),O=I.t,G=I.l,q=vc(v),ee=q.c,_=q.n,$=vc(O),se=$.c,ye=$.n,pe=new ct(19),F=0;F<ee.length;++F)++pe[ee[F]&31];for(var F=0;F<se.length;++F)++pe[se[F]&31];for(var P=ea(pe,7),he=P.t,ae=P.l,Te=19;Te>4&&!he[na[Te-1]];--Te);var Ke=m+5<<3,De=Ho(a,Sn)+Ho(r,zo)+l,Oe=Ho(a,v)+Ho(r,O)+l+14+3*Te+Ho(pe,he)+2*pe[16]+3*pe[17]+7*pe[18];if(f>=0&&Ke<=De&&Ke<=Oe)return Ec(t,y,e.subarray(f,f+m));var Ae,le,_e,Ee;if(Qt(t,y,1+(Oe<De)),y+=2,Oe<De){Ae=zt(v,E,0),le=v,_e=zt(O,G,0),Ee=O;var Lt=zt(he,ae,0);Qt(t,y,_-257),Qt(t,y+5,ye-1),Qt(t,y+10,Te-4),y+=14;for(var F=0;F<Te;++F)Qt(t,y+3*F,he[na[F]]);y+=3*Te;for(var Me=[ee,se],we=0;we<2;++we)for(var be=Me[we],F=0;F<be.length;++F){var ce=be[F]&31;Qt(t,y,Lt[ce]),y+=he[ce],ce>15&&(Qt(t,y,be[F]>>5&127),y+=be[F]>>12)}}else Ae=Wp,le=Sn,_e=Kp,Ee=zo;for(var F=0;F<s;++F){var ue=o[F];if(ue>255){var ce=ue>>18&31;No(t,y,Ae[ce+257]),y+=le[ce+257],ce>7&&(Qt(t,y,ue>>23&31),y+=Wr[ce]);var rt=ue&31;No(t,y,_e[rt]),y+=Ee[rt],rt>3&&(No(t,y,ue>>5&8191),y+=Yr[rt])}else No(t,y,Ae[ue]),y+=le[ue]}return No(t,y,Ae[256]),y+le[256]},Zp=new la([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),Mc=new ve(0),em=function(e,t,n,o,a,r){var l=r.z||e.length,s=new ve(o+l+5*(1+Math.ceil(l/7e3))+a),f=s.subarray(o,s.length-a),m=r.l,y=(r.r||0)&7;if(t){y&&(f[0]=r.r>>3);for(var h=Zp[t-1],v=h>>13,E=h&8191,I=(1<<n)-1,O=r.p||new ct(32768),G=r.h||new ct(I+1),q=Math.ceil(n/3),ee=2*q,_=function(po){return(e[po]^e[po+1]<<q^e[po+2]<<ee)&I},$=new la(25e3),se=new ct(288),ye=new ct(32),pe=0,F=0,P=r.i||0,he=0,ae=r.w||0,Te=0;P+2<l;++P){var Ke=_(P),De=P&32767,Oe=G[Ke];if(O[De]=Oe,G[Ke]=De,ae<=P){var Ae=l-P;if((pe>7e3||he>24576)&&(Ae>423||!m)){y=yc(e,f,0,$,se,ye,F,he,Te,P-Te,y),he=pe=F=0,Te=P;for(var le=0;le<286;++le)se[le]=0;for(var le=0;le<30;++le)ye[le]=0}var _e=2,Ee=0,Lt=E,Me=De-Oe&32767;if(Ae>2&&Ke==_(P-Me))for(var we=Math.min(v,Ae)-1,be=Math.min(32767,P),ce=Math.min(258,Ae);Me<=be&&--Lt&&De!=Oe;){if(e[P+_e]==e[P+_e-Me]){for(var ue=0;ue<ce&&e[P+ue]==e[P+ue-Me];++ue);if(ue>_e){if(_e=ue,Ee=Me,ue>we)break;for(var rt=Math.min(Me,ue-2),tn=0,le=0;le<rt;++le){var nn=P-Me+le&32767,An=O[nn],Pe=nn-An&32767;Pe>tn&&(tn=Pe,Oe=nn)}}}De=Oe,Oe=O[De],Me+=De-Oe&32767}if(Ee){$[he++]=268435456|oa[_e]<<18|gc[Ee];var it=oa[_e]&31,K=gc[Ee]&31;F+=Wr[it]+Yr[K],++se[257+it],++ye[K],ae=P+_e,++pe}else $[he++]=e[P],++se[e[P]]}}for(P=Math.max(P,ae);P<l;++P)$[he++]=e[P],++se[e[P]];y=yc(e,f,m,$,se,ye,F,he,Te,P-Te,y),m||(r.r=y&7|f[y/8|0]<<3,y-=7,r.h=G,r.p=O,r.i=P,r.w=ae)}else{for(var P=r.w||0;P<l+m;P+=65535){var Ft=P+65535;Ft>=l&&(f[y/8|0]=m,Ft=l),y=Ec(f,y+1,e.subarray(P,Ft))}r.i=l}return Go(s,0,o+ca(y)+a)},tm=(function(){for(var e=new Int32Array(256),t=0;t<256;++t){for(var n=t,o=9;--o;)n=(n&1&&-306674912)^n>>>1;e[t]=n}return e})(),nm=function(){var e=-1;return{p:function(t){for(var n=e,o=0;o<t.length;++o)n=tm[n&255^t[o]]^n>>>8;e=n},d:function(){return~e}}};var om=function(e,t,n,o,a){if(!a&&(a={l:1},t.dictionary)){var r=t.dictionary.subarray(-32768),l=new ve(r.length+e.length);l.set(r),l.set(e,r.length),e=l,a.w=r.length}return em(e,t.level==null?6:t.level,t.mem==null?a.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+t.mem,n,o,a)},Ic=function(e,t){var n={};for(var o in e)n[o]=e[o];for(var o in t)n[o]=t[o];return n};var Ht=function(e,t){return e[t]|e[t+1]<<8},ft=function(e,t){return(e[t]|e[t+1]<<8|e[t+2]<<16|e[t+3]<<24)>>>0},ta=function(e,t){return ft(e,t)+ft(e,t+4)*4294967296},Ge=function(e,t,n){for(;n;++t)e[t]=n,n>>>=8};function rm(e,t){return om(e,t||{},0,0)}function im(e,t){return Qp(e,{i:2},t&&t.out,t&&t.dictionary)}var Lc=function(e,t,n,o){for(var a in e){var r=e[a],l=t+a,s=o;Array.isArray(r)&&(s=Ic(o,r[1]),r=r[0]),ArrayBuffer.isView(r)?n[l]=[r,s]:(n[l+="/"]=[new ve(0),s],Lc(r,l,n,o))}},wc=typeof TextEncoder<"u"&&new TextEncoder,aa=typeof TextDecoder<"u"&&new TextDecoder,am=0;try{aa.decode(Mc,{stream:!0}),am=1}catch{}var sm=function(e){for(var t="",n=0;;){var o=e[n++],a=(o>127)+(o>223)+(o>239);if(n+a>e.length)return{s:t,r:Go(e,n-1)};a?a==3?(o=((o&15)<<18|(e[n++]&63)<<12|(e[n++]&63)<<6|e[n++]&63)-65536,t+=String.fromCharCode(55296|o>>10,56320|o&1023)):a&1?t+=String.fromCharCode((o&31)<<6|e[n++]&63):t+=String.fromCharCode((o&15)<<12|(e[n++]&63)<<6|e[n++]&63):t+=String.fromCharCode(o)}};function bc(e,t){if(t){for(var n=new ve(e.length),o=0;o<e.length;++o)n[o]=e.charCodeAt(o);return n}if(wc)return wc.encode(e);for(var a=e.length,r=new ve(e.length+(e.length>>1)),l=0,s=function(y){r[l++]=y},o=0;o<a;++o){if(l+5>r.length){var f=new ve(l+8+(a-o<<1));f.set(r),r=f}var m=e.charCodeAt(o);m<128||t?s(m):m<2048?(s(192|m>>6),s(128|m&63)):m>55295&&m<57344?(m=65536+(m&1047552)|e.charCodeAt(++o)&1023,s(240|m>>18),s(128|m>>12&63),s(128|m>>6&63),s(128|m&63)):(s(224|m>>12),s(128|m>>6&63),s(128|m&63))}return Go(r,0,l)}function lm(e,t){if(t){for(var n="",o=0;o<e.length;o+=16384)n+=String.fromCharCode.apply(null,e.subarray(o,o+16384));return n}else{if(aa)return aa.decode(e);var a=sm(e),r=a.s,n=a.r;return n.length&&Ue(8),r}}var cm=function(e,t){return t+30+Ht(e,t+26)+Ht(e,t+28)},um=function(e,t,n){var o=Ht(e,t+28),a=Ht(e,t+30),r=lm(e.subarray(t+46,t+46+o),!(Ht(e,t+8)&2048)),l=t+46+o,s=dm(e,l,a,n,ft(e,t+20),ft(e,t+24),ft(e,t+42)),f=s[0],m=s[1],y=s[2];return[Ht(e,t+10),f,m,r,l+a+Ht(e,t+32),y]},dm=function(e,t,n,o,a,r,l){var s=a==4294967295,f=r==4294967295,m=l==4294967295,y=t+n,h=s+f+m;if(o&&h){for(;t+4<y;t+=4+Ht(e,t+2))if(Ht(e,t)==1)return[s?ta(e,t+4+8*f):a,f?ta(e,t+4):r,m?ta(e,t+4+8*(f+s)):l,1];o<2&&Ue(13)}return[a,r,l,0]},sa=function(e){var t=0;if(e)for(var n in e){var o=e[n].length;o>65535&&Ue(9),t+=o+4}return t},Sc=function(e,t,n,o,a,r,l,s){var f=o.length,m=n.extra,y=s&&s.length,h=sa(m);Ge(e,t,l!=null?33639248:67324752),t+=4,l!=null&&(e[t++]=20,e[t++]=n.os),e[t]=20,t+=2,e[t++]=n.flag<<1|(r<0&&8),e[t++]=a&&8,e[t++]=n.compression&255,e[t++]=n.compression>>8;var v=new Date(n.mtime==null?Date.now():n.mtime),E=v.getFullYear()-1980;if((E<0||E>119)&&Ue(10),Ge(e,t,E<<25|v.getMonth()+1<<21|v.getDate()<<16|v.getHours()<<11|v.getMinutes()<<5|v.getSeconds()>>1),t+=4,r!=-1&&(Ge(e,t,n.crc),Ge(e,t+4,r<0?-r-2:r),Ge(e,t+8,n.size)),Ge(e,t+12,f),Ge(e,t+14,h),t+=16,l!=null&&(Ge(e,t,y),Ge(e,t+6,n.attrs),Ge(e,t+10,l),t+=14),e.set(o,t),t+=f,h)for(var I in m){var O=m[I],G=O.length;Ge(e,t,+I),Ge(e,t+2,G),e.set(O,t+4),t+=4+G}return y&&(e.set(s,t),t+=y),t},pm=function(e,t,n,o,a){Ge(e,t,101010256),Ge(e,t+8,n),Ge(e,t+10,n),Ge(e,t+12,o),Ge(e,t+16,a)};function Cc(e,t){t||(t={});var n={},o=[];Lc(e,"",n,t);var a=0,r=0;for(var l in n){var s=n[l],f=s[0],m=s[1],y=m.level==0?0:8,h=bc(l),v=h.length,E=m.comment,I=E&&bc(E),O=I&&I.length,G=sa(m.extra);v>65535&&Ue(11);var q=y?rm(f,m):f,ee=q.length,_=nm();_.p(f),o.push(Ic(m,{size:f.length,crc:_.d(),c:q,f:h,m:I,u:v!=l.length||I&&E.length!=O,o:a,compression:y})),a+=30+v+G+ee,r+=76+2*(v+G)+(O||0)+ee}for(var $=new ve(r+22),se=a,ye=r-a,pe=0;pe<o.length;++pe){var h=o[pe];Sc($,h.o,h,h.f,h.u,h.c.length);var F=30+h.f.length+sa(h.extra);$.set(h.c,h.o+F),Sc($,a,h,h.f,h.u,h.c.length,h.o,h.m),a+=16+F+(h.m?h.m.length:0)}return pm($,a,o.length,ye,se),$}function Bc(e,t){for(var n={},o=e.length-22;ft(e,o)!=101010256;--o)(!o||e.length-o>65558)&&Ue(13);var a=Ht(e,o+8);if(!a)return{};var r=ft(e,o+16),l=ft(e,o-20)==117853008;if(l){var s=ft(e,o-12);l=ft(e,s)==101075792,l&&(a=ft(e,s+32),r=ft(e,s+48))}for(var f=t&&t.filter,m=0;m<a;++m){var y=um(e,r,l),h=y[0],v=y[1],E=y[2],I=y[3],O=y[4],G=y[5],q=cm(e,G);r=O,(!f||f({name:I,size:v,originalSize:E,compression:h}))&&(h?h==8?n[I]=im(e.subarray(q,q+v),{out:new ve(E)}):Ue(14,"unknown compression type "+h):n[I]=Go(e,q,q+v))}return n}var ti="https://devel.kamotimestamps.com",va="308989572223-cdnvpn65mc51oqneu7po3og51uf5ahsb.apps.googleusercontent.com",Nc="https://www.youtube.com/",Hc="timekeeper_sync_auth",ya="timekeeper_sync_oauth",zc="timekeeper_sync_subs:",mm="https://www.googleapis.com/auth/youtube.readonly",_n="syncAuthState",Gc="syncCursors",fm=500,hm=5e3,Pc=200,gm=500,vm=60*1e3,ym=60*1e3,Fc=300*1e3;function Hn(){return!!(ti&&va)}var Uc=xe({accessToken:j(),accessTokenExpiresAt:Be({finite:!0}),refreshToken:j(),user:xe({id:j(),email:j(),displayName:et(j())})}),wm=xe({records:hn.array(),seq:Be({int:!0,nonnegative:!0}),hasMore:Ot()}),bm=xe({known:Ot(),membersOnly:et(Ot()),channelId:et(j())}),Sm=xe({rejected:hn.array(),fromSeq:Be({int:!0,nonnegative:!0}),seq:Be({int:!0,nonnegative:!0})}),xm=xe({type:j(),seq:fe(Be({int:!0,nonnegative:!0})),fromSeq:fe(Be({int:!0,nonnegative:!0})),records:fe(hn.array())}),Vc=xe({type:j(),idToken:fe(j()),accessToken:fe(j()),state:fe(j()),error:fe(j())}),Tn=class extends Error{},Vo=class extends Error{constructor(n,o){super(o);this.httpStatus=n}},Tm=e=>e instanceof Vo&&e.httpStatus>=400&&e.httpStatus<500&&e.httpStatus!==408&&e.httpStatus!==429,Fo="signed-out",Xr="",Nn=!1,pa=null,io=new Set,ua=!1,qc=new Map,qo=new Map,ut=!0,Zt=null,xn=null,ni=0,oo=null,Rc=0,en=!0,Uo=null,wa=0,ma=null,Dc=!1,We={pushCounter:0,pullSeq:0},ba=new Map,Oc=Promise.resolve(),Jr=!1,Kr=null,Zr="",da=!1,oi=null,jc=null,fa=null,Qr=null,$c=null;function Ve(){return Ql()}function Wc(e){jc=e}function Yc(e){fa=e}function Kc(e){Qr=e}function Xc(e){$c=e}var Jc="#52c41a",Qc="#ff4d4f",ro="#ffa500";function ao(){let e=Ve();if(fa){let t=fa;if(t.style.fontWeight="bold",t.onmouseenter=null,t.onmouseleave=null,!Hn())W(t,"alert-triangle","Sync backend is not configured in this build"),t.style.color=ro;else if(!e.isSignedIn)W(t,"circle-x","Not signed in"),t.style.color=Qc;else{W(t,"circle-check","Signed in"),t.style.color=Jc;let n=e.userName;n&&(t.onmouseenter=()=>W(t,"circle-check",`Signed in as ${n}`),t.onmouseleave=()=>W(t,"circle-check","Signed in"))}}if(Qr){let{text:t,color:n}=Zc(e);Qr.textContent=t,Qr.style.color=n}$c?.(),eu?.()}function Zc(e=Ve()){if(Fo==="error")return{text:Xr||"Sync error",color:Qc,busy:!1};if(Fo==="connecting")return{text:Xr||"Connecting\u2026",color:ro,busy:!0};if(e.isSignedIn&&Fo==="offline")return{text:Xr||"Offline. Retrying\u2026",color:ro,busy:!1};if(e.isSignedIn&&Fo==="online"){let t=Nn?"Syncing\u2026":"Live sync on";return!Nn&&pa&&(t+=` \xB7 last synced ${new Date(pa).toLocaleTimeString()}`),!Nn&&io.size>0?(t+=` \xB7 ${io.size} timestamp${io.size===1?"":"s"} could not be synced`,{text:t,color:ro,busy:!1}):{text:t,color:Nn?ro:Jc,busy:Nn}}return{text:"",color:"#aaa",busy:!1}}var km="#4285f4";function jo(){if(!Hn()||!Ve().isSignedIn)return null;let{text:e,color:t,busy:n}=Zc();return e?{color:n?km:t,tooltip:`Sync: ${e}`}:{color:ro,tooltip:"Sync: starting\u2026"}}var eu=null;function tu(e){eu=e}function ht(e,t=""){Fo=e,Xr=t,ao()}function nu(){return typeof GM<"u"&&GM&&typeof GM.getValue=="function"&&typeof GM.setValue=="function"?GM:null}async function ou(){let e=nu();if(!e)return Kt(_n);let t=await e.getValue(_n);if(t!=null)return t;let n=await Kt(_n);return n&&(await e.setValue(_n,n),await wn(_n,null)),n??void 0}async function ri(){try{let e=nu();e?await e.setValue(_n,Ve()):await wn(_n,Ve())}catch(e){c("Failed to save sync auth state:",e,"error")}}function $o(){wn(Gc,{userId:Ve().userId,...We})}async function Am(){let e=await Kt(Gc);e&&e.userId===Ve().userId&&typeof e.pushCounter=="number"&&typeof e.pullSeq=="number"?We={pushCounter:e.pushCounter,pullSeq:e.pullSeq}:We={pushCounter:0,pullSeq:0}}function Sa(e,t){return fetch(`${ti}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)})}function ru(e){oi=null,to({isSignedIn:!0,accessToken:e.accessToken,accessTokenExpiresAt:e.accessTokenExpiresAt,refreshToken:e.refreshToken,userId:e.user.id,userName:e.user.displayName,email:e.user.email})}var iu=e=>!!e.accessToken&&e.accessToken!==oi&&!!e.accessTokenExpiresAt&&e.accessTokenExpiresAt-Date.now()>vm;async function Em(e){return typeof navigator<"u"&&navigator.locks?await navigator.locks.request("timekeeper-sync-refresh",e):e()}async function Mm(){let e=await ou();if(e==null)return;let t=Mi.safeParse(e);t.success&&to(t.data)}function Im(){return Kr??(Kr=Em(async()=>{await Mm();let e=Ve();if(!e.isSignedIn||!e.refreshToken)throw new Tn("Not signed in");if(iu(e))return e.accessToken;let t=await Sa("/auth/refresh",{refreshToken:e.refreshToken});if(t.status===401)throw new Tn("Session expired");if(!t.ok)throw new Error(`Token refresh failed (HTTP ${t.status})`);let n=Uc.safeParse(await t.json());if(!n.success)throw new Error("Unexpected token refresh response");return ru(n.data),await ri(),n.data.accessToken}).finally(()=>{Kr=null})),Kr}async function au(){let e=Ve();if(!e.isSignedIn||!e.refreshToken)throw new Tn("Not signed in");return iu(e)?e.accessToken:Im()}async function xa(e,t,n=!0){let o=await au(),a=await fetch(`${ti}${e}`,{method:t.method,headers:{Authorization:`Bearer ${o}`,"Content-Type":"application/json"},body:t.body===void 0?void 0:JSON.stringify(t.body)});if(a.status===401){if(!n)throw new Tn("Session expired");return oi=o,xa(e,t,!1)}return a}async function ei(e,t,n){let o=await xa(e,t);if(!o.ok)throw new Vo(o.status,`${t.method} ${e} failed (HTTP ${o.status})`);let a=n.safeParse(await o.json());if(!a.success)throw new Error(`Unexpected response from ${e}`);return a.data}function Lm(e){try{let t=e.split(".")[1].replace(/-/g,"+").replace(/_/g,"/");return JSON.parse(atob(t.padEnd(Math.ceil(t.length/4)*4,"=")))}catch{return null}}function Cm(e,t,n){return new Promise((o,a)=>{let r=()=>{clearTimeout(l),e.close();try{t.close()}catch{}},l=setTimeout(()=>{r(),a(new Error("Sign-in timed out"))},Fc);e.onmessage=s=>{let f=Vc.safeParse(s.data);if(f.success){if(f.data.type==="timekeeper_sync_oauth_error")r(),a(new Error(f.data.error||"Google sign-in failed"));else if(f.data.type==="timekeeper_sync_oauth_token"&&f.data.idToken){if(Lm(f.data.idToken)?.nonce!==n)return;r(),o(f.data.idToken)}}}})}function Bm(e,t,n){return new Promise((o,a)=>{let r=()=>{clearTimeout(l),e.close();try{t.close()}catch{}},l=setTimeout(()=>{r(),a(new Error("Google sign-in timed out"))},Fc);e.onmessage=s=>{let f=Vc.safeParse(s.data);!f.success||f.data.state!==n||(f.data.type==="timekeeper_sync_oauth_error"?(r(),a(new Error(f.data.error||"Google authorization failed"))):f.data.type==="timekeeper_sync_oauth_access"&&f.data.accessToken&&(r(),o(f.data.accessToken)))}})}function su(){let e=window.location.hash;if(!e||e.length<=1)return!1;let t=new URLSearchParams(e.substring(1)),n=t.get("state")??"",o=n.startsWith(zc);if(n!==Hc&&!o)return!1;let a=t.get("id_token"),r=t.get("access_token"),l=t.get("error_description")||t.get("error");if(!a&&!r&&!l)return!1;try{let s=new BroadcastChannel(ya);s.postMessage(l?{type:"timekeeper_sync_oauth_error",error:l,state:n}:o?{type:"timekeeper_sync_oauth_access",accessToken:r,state:n}:{type:"timekeeper_sync_oauth_token",idToken:a}),s.close()}catch(s){console.error("[Timekeeper] Failed to hand sync sign-in result to the opener:",s)}return history.replaceState&&history.replaceState(null,"",window.location.pathname+window.location.search),window.close(),!0}async function lu(){if(!Hn()){ht("error","Sync backend is not configured in this build");return}if(Ve().isSignedIn||da)return;da=!0,ht("connecting","Opening Google sign-in\u2026");let e=crypto.randomUUID(),t=new BroadcastChannel(ya);try{let n=new URL("https://accounts.google.com/o/oauth2/v2/auth");n.searchParams.set("client_id",va),n.searchParams.set("redirect_uri",Nc),n.searchParams.set("response_type","id_token"),n.searchParams.set("scope","openid email profile"),n.searchParams.set("nonce",e),n.searchParams.set("state",Hc),n.searchParams.set("prompt","select_account");let o=window.open(n.toString(),"TimekeeperSyncAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!o)throw new Error("Popup blocked. Please enable popups for YouTube.");ht("connecting","Waiting for Google sign-in\u2026");let a=await Cm(t,o,e);ht("connecting","Signing in to Timekeeper Sync\u2026");let r=await Sa("/auth/google",{idToken:a});if(!r.ok)throw new Error(r.status===401?"Google sign-in was rejected by the server":`Sign-in failed (HTTP ${r.status})`);let l=Uc.safeParse(await r.json());if(!l.success)throw new Error("Unexpected response from the sync server");ru(l.data),await ri(),We={pushCounter:0,pullSeq:0},$o(),c(`Signed in to Timekeeper Sync as ${l.data.user.displayName??"an account with no display name"}`),await gu()}catch(n){t.close(),c("Sync sign-in failed:",n,"error"),ht("error",n instanceof Error?n.message:"Sign-in failed")}finally{da=!1}}async function cu(){let e=Ve();if(!e.isSignedIn||ua)return;ua=!0;let t=zc+crypto.randomUUID(),n=new BroadcastChannel(ya);try{let o=new URL("https://accounts.google.com/o/oauth2/v2/auth");o.searchParams.set("client_id",va),o.searchParams.set("redirect_uri",Nc),o.searchParams.set("response_type","token"),o.searchParams.set("scope",mm),o.searchParams.set("state",t),e.email&&o.searchParams.set("login_hint",e.email);let a=window.open(o.toString(),"TimekeeperSyncAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!a)throw new Error("Popup blocked. Please enable popups for YouTube.");let r=await Bm(n,a,t),l=await xa("/subscriptions/sync",{method:"POST",body:{accessToken:r}});if(!l.ok)throw new Vo(l.status,`Sharing subscriptions failed (HTTP ${l.status})`);let{count:s}=await l.json();c(`Shared ${s} YouTube subscriptions with Timekeeper Sync`)}catch(o){throw n.close(),c("Sharing YouTube subscriptions failed:",o,"error"),o}finally{ua=!1}}var ha=e=>`${e.channelId}:${e.membersOnly}`;function uu(e){qc.set(e.videoId,e),ut||Pm(e)}async function Pm(e){let t=ha(e);if(qo.get(e.videoId)!==t)try{if(!(await Ni(e.videoId))?.some(a=>!a.deleted_at))return;let o=await ei(`/videos/${encodeURIComponent(e.videoId)}/access`,{method:"GET"},bm);(!o.known||o.membersOnly!==e.membersOnly||o.channelId!==e.channelId)&&await ei("/videos/access",{method:"POST",body:{videos:[e]}},xe({ok:Ot()})),qo.set(e.videoId,t)}catch(n){c("Reporting the members-only status failed:",n,"warn")}}async function du(){let{refreshToken:e}=Ve();if(vu(),to(Xn),We={pushCounter:0,pullSeq:0},ba.clear(),io.clear(),qo.clear(),await ri(),$o(),ht("signed-out"),e&&Hn())try{await Sa("/auth/logout",{refreshToken:e})}catch(t){c("Sync logout request failed:",t,"warn")}}function pu(){vu(),to(Xn),ri(),ht("error","Session expired. Please sign in again.")}function mu(e){let t=Oc.then(e);return Oc=t.catch(()=>{}),t}function so(){ut||Jr||(Jr=!0,mu(async()=>{Jr=!1,await Om()}).catch(e=>c("Sync: cycle crashed:",e,"error")))}async function Ta(e){if(e.length!==0){for(let t of e)ba.set(t.guid,t.write_counter??0);await zi(e),jc?.([...new Set(e.map(t=>t.video_id))])}}function fu(e,t){return e>We.pullSeq?(en=!0,!1):(t>We.pullSeq&&(We.pullSeq=t,$o()),!0)}async function Rm(){for(;;){let e=await ei(`/sync/pull?since=${We.pullSeq}&limit=${gm}`,{method:"GET"},wm);await Ta(e.records);let t=e.seq!==We.pullSeq;if(We.pullSeq=e.seq,$o(),!e.hasMore||!t)return}}async function ga(e){try{let t=[...new Set(e.map(o=>o.video_id))].map(o=>qc.get(o)).filter(o=>!!o&&qo.get(o.videoId)!==ha(o)),n=await ei("/sync/push",{method:"POST",body:{deviceId:Zr,records:e,videos:t}},Sm);for(let o of t)qo.set(o.videoId,ha(o));await Ta(n.rejected);for(let o of e)io.delete(o.guid);fu(n.fromSeq,n.seq)||so()}catch(t){if(!Tm(t))throw t;if(e.length>1){let n=e.length>>1;await ga(e.slice(0,n)),await ga(e.slice(n));return}io.add(e[0].guid),c(`Sync: server refused timestamp ${e[0].guid}; leaving it local-only:`,t,"warn")}}async function Dm(){let e=await Hi(We.pushCounter);if(e.length===0)return;let t=e.filter(n=>(ba.get(n.guid)??0)<n.write_counter);for(let n=0;n<t.length;n+=Pc)await ga(t.slice(n,n+Pc));We.pushCounter=Math.max(We.pushCounter,e[e.length-1].write_counter),$o()}async function Om(){if(!ut){Nn=!0,ao();try{(en||!Zt)&&(await Rm(),en=!1),await Dm(),pa=Date.now(),wa=0}catch(e){if(e instanceof Tn){pu();return}c("Sync cycle failed:",e,"warn"),en=!0,_m()}finally{Nn=!1,ao()}}}function hu(e){return Math.min(ym,1e3*2**e)*(.5+Math.random()/2)}function _m(){ut||Uo||(Uo=setTimeout(()=>{Uo=null,so()},hu(wa++)))}function Nm(){if(ut)return;let e=Date.now();oo?clearTimeout(oo):Rc=e;let t=Math.max(0,Math.min(fm,Rc+hm-e));oo=setTimeout(()=>{oo=null,so()},t)}function ka(){ut||(en=!0,Zt||(ni=0,xn&&clearTimeout(xn),xn=null,Aa()),so())}function _c(){ut||xn||(xn=setTimeout(()=>{xn=null,Aa()},hu(ni++)))}async function Aa(){if(ut||Zt)return;ht("connecting");let e;try{e=await au()}catch(n){return n instanceof Tn?pu():(c("Sync: could not get an access token:",n,"warn"),ht("offline"),_c())}if(ut||Zt)return;let t=new WebSocket(`${ti.replace(/^http/,"ws")}/sync/ws`);Zt=t,t.onopen=()=>t.send(JSON.stringify({type:"auth",token:e,deviceId:Zr})),t.onmessage=n=>{let o;try{o=JSON.parse(String(n.data))}catch{return}let a=xm.safeParse(o);if(a.success){if(a.data.type==="ready")ni=0,ht("online"),(a.data.seq===void 0||a.data.seq!==We.pullSeq)&&(en=!0),so();else if(a.data.type==="changes"&&a.data.records){let{fromSeq:r,seq:l,records:s}=a.data;mu(async()=>{await Ta(s),(r===void 0||l===void 0)&&(en=!0),(en||!fu(r,l))&&so()}).catch(f=>c("Sync: failed to apply live changes:",f,"error"))}}},t.onclose=n=>{Zt===t&&(Zt=null),en=!0,!ut&&(n.code===4401&&(oi=e),ht("offline"),_c())},t.onerror=()=>{}}async function gu(){if(ut){if(!Zr){let e=await Kt("device_id");Zr=typeof e=="string"&&e?e:crypto.randomUUID()}ut=!1,wa=0,ni=0,ma=Gi(Nm),Dc||(Dc=!0,window.addEventListener("online",()=>ka())),await Aa()}}function vu(){ut=!0,ma?.(),ma=null;for(let t of[oo,Uo,xn])t&&clearTimeout(t);oo=Uo=xn=null,Jr=!1;let e=Zt;Zt=null;try{e?.close()}catch{}}async function yu(){if(!Hn()){ao();return}try{let e=Mi.safeParse(await ou());e.success&&to(e.data);let t=Ve();t.isSignedIn&&t.refreshToken?(await Am(),await gu()):ht("signed-out")}catch(e){c("Failed to load sync auth state:",e,"error")}}function gt(){return Nt()}var vt={get isSignedIn(){return Nt().isSignedIn},get accessToken(){return Nt().accessToken},get userName(){return Nt().userName},get email(){return Nt().email},set isSignedIn(e){let t=Nt();Mt({...t,isSignedIn:e})},set accessToken(e){let t=Nt();Mt({...t,accessToken:e})},set userName(e){let t=Nt();Mt({...t,userName:e})},set email(e){let t=Nt();Mt({...t,email:e})}};function Xo(){return $e().auth.autoBackupEnabled}function Gt(){return $e().auth.autoBackupIntervalMinutes}var Ia=null,ie=null,te=null,Gn=null;function xu(e){Ia=e}function Tu(e){ie=e}function ku(e){te=e}function Au(e){Gn=e}var wu=!1;function Eu(){if(!wu)try{let e=document.createElement("style");e.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(e),wu=!0}catch{}}var Mu=null,La=null,Wo=null,Yo=null,Ca=null;function Iu(e){Mu=e}function Lu(e){La=e}function Ba(e){Wo=e}function Pa(e){Yo=e}function Cu(e){Ca=e}var ai="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",Bu="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",Pu="https://www.youtube.com/",zm=new Date(Date.UTC(2e3,0,1,0,0,0)),Gm=30*1e3,Fm=1800*1e3,bu=5,ii=null,Ye=null;async function Ra(){try{let e=await Yo("googleAuthState"),t=e&&typeof e=="object"?{...e,accessToken:e.accessToken?"[REDACTED]":null}:e;c("Loading Google auth state from IndexedDB:",t);let n=Ei.safeParse(e);if(n.success){let o=gt();Mt({...o,...n.data});let a=gt();a.isSignedIn&&a.accessToken&&c(`Reusing stored Google auth token for ${a.userName||a.email||"user"}`),uo();let r=gt();r.isSignedIn&&r.accessToken&&await kn(!0)}else if(e!==void 0){let o=e&&typeof e=="object"?{...e,accessToken:e.accessToken?"[REDACTED]":null}:e;c("Google auth state failed validation:",{stored:o,errors:n.error.message},"warn")}}catch(e){c("Failed to load Google auth state:",e,"error")}}async function Jo(){try{let e=gt(),t=Ei.safeParse(e);if(!t.success){let n={...e,accessToken:e.accessToken?"[REDACTED]":null};c("Invalid auth state, cannot save",{state:n,errors:t.error.message},"error");return}await Wo("googleAuthState",e),e.isSignedIn&&e.accessToken?c(`Saved Google auth state to IndexedDB for ${e.userName||e.email||"user"}`):c("Cleared Google auth state in IndexedDB (signed out)")}catch(e){c("Failed to save Google auth state:",e,"error")}}function uo(){Ia&&(Ia.style.display="none")}function ot(e,t){if(!te)return;if(te.style.fontWeight="bold",e==="authenticating"){Eu(),te.style.color="#ffa500",te.replaceChildren();let o=document.createElement("span");o.className="tk-auth-spinner";let a=document.createTextNode(` ${t||"Authorizing with Google\u2026"}`);te.appendChild(o),te.appendChild(a);return}if(e==="error"){W(te,"circle-x",t||"Authorization failed"),te.style.color="#ff4d4f",ke();return}let n=gt();n.isSignedIn?(W(te,"circle-check","Signed in"),te.style.color="#52c41a",te.removeAttribute("title"),n.userName?(te.onmouseenter=()=>{W(te,"circle-check",`Signed in as ${n.userName}`)},te.onmouseleave=()=>{W(te,"circle-check","Signed in")}):(te.onmouseenter=null,te.onmouseleave=null)):(W(te,"circle-x","Not signed in"),te.style.color="#ff4d4f",te.removeAttribute("title"),te.onmouseenter=null,te.onmouseleave=null),ke()}function Um(){te&&(Eu(),te.classList.remove("tk-auth-blink"),te.offsetWidth,te.classList.add("tk-auth-blink"),setTimeout(()=>{te.classList.remove("tk-auth-blink")},1200))}function Ru(e,t=300*1e3){return new Promise((n,o)=>{if(!e){c&&c("OAuth monitor: popup is null",null,"error"),o(new Error("Failed to open popup"));return}c&&c("OAuth monitor: starting to monitor popup for token");let a=Date.now(),r="timekeeper_oauth",l=null,s=null,f=null,m=()=>{if(l){try{l.close()}catch{}l=null}s&&(clearInterval(s),s=null),f&&(clearInterval(f),f=null)};try{l=new BroadcastChannel(r),c&&c("OAuth monitor: BroadcastChannel created successfully"),l.onmessage=v=>{let E=v.data?.token?{...v.data,token:"[REDACTED]"}:v.data;c&&c("OAuth monitor: received BroadcastChannel message",E);let I=xe({type:j(),token:fe(j()),error:fe(j())}).safeParse(v.data);if(!I.success){c&&c("OAuth monitor: invalid message format",I.error,"warn");return}if(I.data.type==="timekeeper_oauth_token"&&I.data.token){c&&c("OAuth monitor: token received via BroadcastChannel"),m();try{e.close()}catch{}n(I.data.token)}else if(I.data.type==="timekeeper_oauth_error"){c&&c("OAuth monitor: error received via BroadcastChannel",I.data.error,"error"),m();try{e.close()}catch{}o(new Error(I.data.error||"OAuth failed"))}}}catch(v){c&&c("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",v)}c&&c("OAuth monitor: setting up IndexedDB polling");let y=Date.now();s=setInterval(async()=>{try{let v=indexedDB.open("ytls-timestamps-db",4);v.onsuccess=()=>{let E=v.result,G=E.transaction("settings","readonly").objectStore("settings").get("oauth_message");G.onsuccess=()=>{let q=G.result;if(q&&q.value){let ee=q.value,_=xe({type:j(),token:fe(j()),error:fe(j()),timestamp:fe(Be())}).safeParse(ee);if(!_.success){c&&c("OAuth monitor: invalid IndexedDB message format",_.error,"warn");return}if(_.data.timestamp&&_.data.timestamp>y){let $=_.data.token?{..._.data,token:"[REDACTED]"}:_.data;if(c&&c("OAuth monitor: received IndexedDB message",$),_.data.type==="timekeeper_oauth_token"&&_.data.token){c&&c("OAuth monitor: token received via IndexedDB"),m();try{e.close()}catch{}E.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),n(_.data.token)}else if(_.data.type==="timekeeper_oauth_error"){c&&c("OAuth monitor: error received via IndexedDB",_.data.error,"error"),m();try{e.close()}catch{}E.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),o(new Error(_.data.error||"OAuth failed"))}y=_.data.timestamp||Date.now()}}E.close()}}}catch(v){c&&c("OAuth monitor: IndexedDB polling error",v,"error")}},500),f=setInterval(()=>{if(Date.now()-a>t){c&&c("OAuth monitor: popup timed out after 5 minutes",null,"error"),m();try{e.close()}catch{}o(new Error("OAuth popup timed out"));return}},1e3)})}async function Du(){if(!ai){ot("error","Google Client ID not configured");return}try{c&&c("OAuth signin: starting OAuth flow"),ot("authenticating","Opening authentication window...");let e=new URL("https://accounts.google.com/o/oauth2/v2/auth");e.searchParams.set("client_id",ai),e.searchParams.set("redirect_uri",Pu),e.searchParams.set("response_type","token"),e.searchParams.set("scope",Bu),e.searchParams.set("include_granted_scopes","true"),e.searchParams.set("state","timekeeper_auth"),c&&c("OAuth signin: opening popup");let t=window.open(e.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!t){c&&c("OAuth signin: popup blocked by browser",null,"error"),ot("error","Popup blocked. Please enable popups for YouTube.");return}c&&c("OAuth signin: popup opened successfully"),ot("authenticating","Waiting for authentication...");try{let n=await Ru(t),o=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${n}`}});if(o.ok){let a=await o.json(),r=xe({name:fe(j()),email:fe(j())}).safeParse(a);if(!r.success)throw c&&c("Failed to validate user info response",r.error,"error"),new Error("Invalid user info response");let l=r.data;Mt({isSignedIn:!0,accessToken:n,userName:l.name||null,email:l.email||null}),await Jo(),uo(),ot(),ke(),await kn(),c?c(`Successfully authenticated as ${l.name}`):console.log(`[Timekeeper] Successfully authenticated as ${l.name}`)}else throw new Error("Failed to fetch user info")}catch(n){let o=n instanceof Error?n.message:"Authentication failed";c?c("OAuth failed:",n,"error"):console.error("[Timekeeper] OAuth failed:",n),ot("error",o);return}}catch(e){let t=e instanceof Error?e.message:"Sign in failed";c?c("Failed to sign in to Google:",e,"error"):console.error("[Timekeeper] Failed to sign in to Google:",e),ot("error",`Failed to sign in: ${t}`)}}async function Vm(){let e=gt(),t=e.email;if(!ai||!t)return!1;c("Silent OAuth: attempting silent token refresh for "+t);let n=new URL("https://accounts.google.com/o/oauth2/v2/auth");n.searchParams.set("client_id",ai),n.searchParams.set("redirect_uri",Pu),n.searchParams.set("response_type","token"),n.searchParams.set("scope",Bu),n.searchParams.set("include_granted_scopes","true"),n.searchParams.set("state","timekeeper_auth"),n.searchParams.set("prompt","none"),n.searchParams.set("login_hint",t);let o=window.open(n.toString(),"TimekeeperGoogleAuthSilent","width=1,height=1,left=-2000,top=-2000,menubar=no,toolbar=no,location=no");if(!o)return c("Silent OAuth: popup blocked",null,"warn"),!1;try{let a=await Ru(o,15e3);return Mt({...e,isSignedIn:!0,accessToken:a}),await Jo(),uo(),ot(),c("Silent OAuth: token refreshed successfully for "+t),!0}catch(a){c("Silent OAuth: silent refresh failed",a,"warn");try{o.close()}catch{}return!1}}async function Ou(){if(!window.opener||window.opener===window)return!1;c&&c("OAuth popup: detected popup window, checking for OAuth response");let e=window.location.hash;if(!e||e.length<=1)return c&&c("OAuth popup: no hash params found"),!1;let t=e.startsWith("#")?e.substring(1):e,n=new URLSearchParams(t),o=n.get("state");if(c&&c("OAuth popup: hash params found, state="+o),o!=="timekeeper_auth")return c&&c("OAuth popup: not our OAuth flow (wrong state)"),!1;let a=n.get("error"),r=n.get("access_token"),l="timekeeper_oauth";if(a){try{let s=new BroadcastChannel(l);s.postMessage({type:"timekeeper_oauth_error",error:n.get("error_description")||a}),s.close(),c&&c("OAuth popup: error broadcast via BroadcastChannel")}catch{let f={type:"timekeeper_oauth_error",error:n.get("error_description")||a,timestamp:Date.now()};c&&c("OAuth popup: writing error to IndexedDB",f);let m=indexedDB.open("ytls-timestamps-db",4);m.onsuccess=()=>{let y=m.result,v=y.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:f});v.onsuccess=()=>{c&&c("OAuth popup: error written to IndexedDB successfully")},v.onerror=()=>{c&&c("OAuth popup: failed to write error to IndexedDB",v.error,"error")},y.close()},m.onerror=()=>{c&&c("OAuth popup: failed to open IndexedDB",m.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(r){c&&c("OAuth popup: access token found, broadcasting to opener");try{let s=new BroadcastChannel(l);s.postMessage({type:"timekeeper_oauth_token",token:r}),s.close(),c&&c("OAuth popup: token broadcast via BroadcastChannel")}catch(s){c&&c("OAuth popup: BroadcastChannel failed, using IndexedDB",s);let f={type:"timekeeper_oauth_token",token:r,timestamp:Date.now()},m={...f,token:"[REDACTED]"};c&&c("OAuth popup: writing token to IndexedDB",m);let y=indexedDB.open("ytls-timestamps-db",4);y.onsuccess=()=>{let h=y.result,E=h.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:f});E.onsuccess=()=>{c&&c("OAuth popup: token written to IndexedDB successfully")},E.onerror=()=>{c&&c("OAuth popup: failed to write token to IndexedDB",E.error,"error")},h.close()},y.onerror=()=>{c&&c("OAuth popup: failed to open IndexedDB",y.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function _u(){Mt({isSignedIn:!1,accessToken:null,userName:null,email:null}),await Jo(),await kn(),uo(),ot(),ke()}async function Nu(){let e=gt();if(!e.isSignedIn||!e.accessToken)return!1;try{let t=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${e.accessToken}`}});return t.status===401?(await Gu({silent:!0}),!1):t.ok}catch(t){return c("Failed to verify auth state:",t,"error"),!1}}function si(){let e=gt();return e.isSignedIn&&!!e.accessToken}function co(){return si()}function qm(){let e=[];return si()&&e.push("Google Drive"),e}function jm(e){let t=Bc(new Uint8Array(e)),n=Object.values(t)[0];return n?new TextDecoder().decode(n):null}async function Hu(e){let t={Authorization:`Bearer ${e}`},o=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,a=await fetch(o,{headers:t});if(a.status===401)throw new Error("unauthorized");if(!a.ok)throw new Error("drive search failed");let r=await a.json();if(Array.isArray(r.files)&&r.files.length>0)return r.files[0].id;let l=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...t,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(l.status===401)throw new Error("unauthorized");if(!l.ok)throw new Error("drive folder create failed");return(await l.json()).id}async function zu(e,t,n){let o=`name='${e}' and '${t}' in parents and trashed=false`,a=encodeURIComponent(o),r=encodeURIComponent("modifiedTime desc"),l=await fetch(`https://www.googleapis.com/drive/v3/files?q=${a}&orderBy=${r}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${n}`}});if(l.status===401)throw new Error("unauthorized");if(!l.ok)throw new Error(`drive search failed (${l.status})`);let s=await l.json();return s.files&&s.files.length>0?s.files[0].id:null}async function Su(e){let t=await Hu(e),n=await zu("timekeeper-data.zip",t,e);if(!n)return null;let o=await fetch(`https://www.googleapis.com/drive/v3/files/${n}?alt=media`,{headers:{Authorization:`Bearer ${e}`}});if(o.status===401)throw new Error("unauthorized");if(!o.ok)throw new Error(`drive download failed (${o.status})`);let a=await o.arrayBuffer();try{return jm(a)}catch(r){return c("Remote backup could not be decoded; the next upload will replace it:",r,"warn"),null}}async function $m(){if(!La)return;let e=gt();if(!e.isSignedIn||!e.accessToken)return;let t;try{t=await Su(e.accessToken)}catch(a){if(a.message!=="unauthorized")throw a;await Gu({silent:!0});let r=gt();if(!r.isSignedIn||!r.accessToken)throw a;t=await Su(r.accessToken)}if(!t)return;let{mergedVideos:n,mergedTimestamps:o}=await La(t);o>0&&(c(`Pre-backup merge: added ${o} timestamps from ${n} videos from remote`),Ca&&Ca())}function Wm(e,t){let n=new TextEncoder().encode(e),o=t.replace(/\\/g,"/").replace(/^\/+/,"");return o.endsWith(".json")||(o+=".json"),Cc({[o]:[n,{level:6,mtime:zm,os:0}]})}async function Ym(e,t,n,o){let a=e.replace(/\.json$/,".zip"),r=await zu(a,n,o),l=new TextEncoder().encode(t).length,s=Wm(t,e),f=s.length;c(`Compressing data: ${l} bytes -> ${f} bytes (${Math.round(100-f/l*100)}% reduction)`);let m="-------314159265358979",y=`\r
--${m}\r
`,h=`\r
--${m}--`,v=r?{name:a,mimeType:"application/zip"}:{name:a,mimeType:"application/zip",parents:[n]},E=8192,I="";for(let $=0;$<s.length;$+=E){let se=s.subarray($,Math.min($+E,s.length));I+=String.fromCharCode.apply(null,Array.from(se))}let O=btoa(I),G=y+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify(v)+y+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+O+h,q,ee;r?(q=`https://www.googleapis.com/upload/drive/v3/files/${r}?uploadType=multipart&fields=id,name`,ee="PATCH"):(q="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",ee="POST");let _=await fetch(q,{method:ee,headers:{Authorization:`Bearer ${o}`,"Content-Type":`multipart/related; boundary=${m}`},body:G});if(_.status===401)throw new Error("unauthorized");if(!_.ok)throw new Error("drive upload failed")}async function Gu(e){c("Auth expired, attempting silent token refresh",null,"warn"),!await Vm()&&(c("Silent OAuth: falling back to sign-out",null,"warn"),Mt({isSignedIn:!1,accessToken:null,userName:null,email:null}),await Jo(),await kn(),ot("error","Authorization expired. Please sign in again."),ke())}async function Km(e){if(!si())throw e?.silent||ot("error","Configure a backup destination first"),new Error("no-backup-destination");await $m();let t=await Mu({includeDeleted:!0});if(t.totalTimestamps===0){if(t.invalidRows>0)throw new Error(`export-invalid-data: ${t.invalidRows} stored rows failed validation`);return e?.silent||c("Skipping export: no timestamps to back up"),"skipped"}let n=gt();if(!n.accessToken)throw new Error("unauthorized");let o=await Hu(n.accessToken);return await Ym(t.filename,t.json,o,n.accessToken),c(`Exported backup to Google Drive (${t.filename}) with ${t.totalVideos} videos / ${t.totalTimestamps} timestamps.`),"uploaded"}async function Fu(){try{let[e,t,n]=await Promise.all([Yo("lastAutoBackupAt"),Yo("autoBackupEnabled"),Yo("autoBackupIntervalMinutes")]),o=Ii.partial().safeParse({autoBackupEnabled:t,autoBackupIntervalMinutes:n,lastAutoBackupAt:typeof e=="number"&&e>0?e:null});o.success?(typeof o.data.autoBackupEnabled=="boolean"&&Ui(o.data.autoBackupEnabled),typeof o.data.autoBackupIntervalMinutes=="number"&&Vi(o.data.autoBackupIntervalMinutes),typeof o.data.lastAutoBackupAt=="number"&&ji(o.data.lastAutoBackupAt)):c("Failed to validate auto backup settings:",o.error.message,"warn")}catch(e){c("Failed to load auto backup settings:",e,"error")}}async function Da(){try{let e=$e().auth,t={autoBackupEnabled:e.autoBackupEnabled,autoBackupIntervalMinutes:e.autoBackupIntervalMinutes,lastAutoBackupAt:e.lastAutoBackupAt},n=Ii.safeParse(t);if(!n.success){c("Invalid auto backup settings, cannot save",{settings:t,errors:n.error.message},"error");return}await Promise.all([Wo("autoBackupEnabled",e.autoBackupEnabled),Wo("autoBackupIntervalMinutes",e.autoBackupIntervalMinutes),Wo("lastAutoBackupAt",e.lastAutoBackupAt)])}catch(e){c("Failed to save auto backup settings:",e,"error")}}function Xm(){ii&&(clearInterval(ii),ii=null),Ye&&(clearTimeout(Ye),Ye=null)}function zn(e){try{let t=new Date(e),n=new Date,o=t.toDateString()===n.toDateString(),a=t.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return o?a:`${t.toLocaleDateString()} ${a}`}catch{return""}}function Ea(){let e=qm();return e.length>0?`Destinations: ${e.join(", ")}`:"No backup destination configured"}function Uu(){let e=$e().auth;return e.autoBackupEnabled?e.isAutoBackupRunning?"#4285f4":e.autoBackupBackoffMs&&e.autoBackupBackoffMs>0?"#ffa500":co()&&e.lastAutoBackupAt?"#52c41a":co()?"#ffa500":"#ff4d4f":"#ff4d4f"}function ke(){if(li(),!ie)return;let e=$e().auth;if(!e.autoBackupEnabled)W(ie,"refresh","Backup: Off"),ie.onmouseenter=null,ie.onmouseleave=null;else if(e.isAutoBackupRunning)W(ie,"refresh","Backing up\u2026"),ie.onmouseenter=null,ie.onmouseleave=null;else if(e.autoBackupBackoffMs&&e.autoBackupBackoffMs>0){let n=Math.ceil(e.autoBackupBackoffMs/6e4);W(ie,"alert-triangle",`Retry in ${n}m`),ie.onmouseenter=null,ie.onmouseleave=null}else if(!co())W(ie,"alert-triangle","Backup target missing"),ie.onmouseenter=null,ie.onmouseleave=null;else if(e.lastAutoBackupAt){let n=e.lastAutoBackupAt,o=n+Math.max(1,Gt())*60*1e3,a=zn(o);ie.onmouseenter=()=>{W(ie,"database",`Next backup: ${a}`)},ie.onmouseleave=()=>{W(ie,"database",`Last backup: ${zn(n)}`)},W(ie,"database",`Last backup: ${zn(n)}`)}else{let n=Date.now()+Math.max(1,Gt())*60*1e3,o=zn(n);ie.onmouseenter=()=>{W(ie,"database",`Next backup: ${o}`)},ie.onmouseleave=()=>{W(ie,"database","Last backup: never")},W(ie,"database","Last backup: never")}ie.style.display="inline";let t=Uu();ie.style.color=t}var Ma="ytls-backup-indicator--pulsing",Jm="#4285f4",lo=null;function Qm(e,t){lo&&(e.removeEventListener("animationiteration",lo),lo=null),t===Jm?(e.style.backgroundColor=t,e.classList.add(Ma)):e.classList.contains(Ma)?(lo=()=>{Gn&&(Gn.classList.remove(Ma),Gn.style.backgroundColor=t,lo=null)},e.addEventListener("animationiteration",lo,{once:!0})):e.style.backgroundColor=t}function li(){if(!Gn)return;let e=jo()?.color??Uu();Qm(Gn,e),ze(Gn,()=>{let t=jo();if(t)return t.tooltip;let n=$e().auth,o="";if(!n.autoBackupEnabled)o="Auto backup is disabled";else if(n.isAutoBackupRunning)o="Backup in progress";else if(n.autoBackupBackoffMs&&n.autoBackupBackoffMs>0)o=`Retrying backup in ${Math.ceil(n.autoBackupBackoffMs/6e4)}m`;else if(!co())o=Ea();else if(n.lastAutoBackupAt){let a=n.lastAutoBackupAt+Math.max(1,Gt())*60*1e3,r=zn(a);o=`Last backup: ${zn(n.lastAutoBackupAt)}
Next backup: ${r}
${Ea()}`}else{let a=Date.now()+Math.max(1,Gt())*60*1e3;o=`No backup yet
Next backup: ${zn(a)}
${Ea()}`}return o})}async function Ko(e={}){let{silent:t=!0,skipBackoff:n=!1}=e;if(!co()){t||(ke(),si()||Um());return}if(Ye){if(!n){c("Auto backup: backoff in progress, skipping scheduled run");return}clearTimeout(Ye),Ye=null,no(null),c("Auto backup: manual run cleared backoff and will proceed immediately")}if(!$e().auth.isAutoBackupRunning){qi(!0),ke();try{await Km({silent:t})==="uploaded"&&ji(Date.now()),$r(0),no(null),Ye&&(clearTimeout(Ye),Ye=null),await Da()}catch(o){if(c("Auto backup failed:",o,"error"),o.message==="unauthorized"){c("Auth error detected, clearing token and stopping retries",null,"warn");let r=gt();Mt({...r,accessToken:null,isSignedIn:!1}),await Jo(),ot("error","Authorization expired. Please sign in again."),ke(),$r(0),no(null),Ye&&(clearTimeout(Ye),Ye=null)}else if($e().auth.autoBackupRetryAttempts<bu){let r=$e().auth.autoBackupRetryAttempts+1;$r(r);let s=Math.min(Gm*Math.pow(2,r-1),Fm);no(s),Ye&&clearTimeout(Ye),Ye=setTimeout(()=>{Ko({silent:!0})},s),c(`Scheduling backup retry ${r}/${bu} in ${Math.round(s/1e3)}s`),ke()}else no(null)}finally{qi(!1),ke()}}}async function kn(e=!1){if(Xm(),!!Xo()&&co()){if(ii=setInterval(()=>{Ko({silent:!0})},Math.max(1,Gt())*60*1e3),!e){let t=Date.now(),n=Math.max(1,Gt())*60*1e3,o=$e().auth.lastAutoBackupAt;(!o||t-o>=n)&&Ko({silent:!0})}ke()}}async function Vu(){let e=Xo();Ui(!e),await Da(),await kn(),ke()}async function qu(){let e=Gt(),t=prompt("Set Auto Backup interval (minutes):",String(e));if(t===null)return;let n=Math.floor(Number(t));if(!Number.isFinite(n)||n<5||n>1440){alert("Please enter a number between 5 and 1440 minutes.");return}Vi(n),await Da(),await kn(),ke()}function Oa(e,t){return Kt(e).then(n=>n!==void 0?n:t)}function _a(e,t){return wn(e,t),Promise.resolve()}var Na=window.location.hash;if(Na&&Na.length>1){let e=new URLSearchParams(Na.substring(1));if(e.get("state")==="timekeeper_auth"){let n=e.get("access_token");if(n){console.log("[Timekeeper] Auth token detected in URL, broadcasting token"),console.log("[Timekeeper] Token length:",n.length,"characters");try{let o=new BroadcastChannel("timekeeper_oauth"),a={type:"timekeeper_oauth_token",token:n};console.log("[Timekeeper] Sending auth message via BroadcastChannel:",{type:a.type,tokenLength:n.length}),o.postMessage(a),o.close(),console.log("[Timekeeper] Token broadcast via BroadcastChannel completed")}catch(o){console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",o);let a={type:"timekeeper_oauth_token",token:n,timestamp:Date.now()},r=indexedDB.open("ytls-timestamps-db",4);r.onsuccess=()=>{let l=r.result,s=l.transaction("settings","readwrite");s.objectStore("settings").put({key:"oauth_message",value:a}),s.oncomplete=()=>{console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",a.timestamp),l.close()}}}if(history.replaceState){let o=window.location.pathname+window.location.search;history.replaceState(null,"",o)}throw console.log("[Timekeeper] Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}if(su())throw new Error("OAuth window closed");hc();fc()||dc();(async function(){"use strict";if(window.top!==window.self)return;function e(i){return Oa(i,void 0)}function t(i,u){return _a(i,u)}Pa(e),Ba(t);try{let i=await Kt("device_id"),u=typeof i=="string"&&i.length>0?i:crypto.randomUUID();await wn("device_id",u),c(`Lamport: device_id = ${u}`)}catch(i){c("Lamport: failed to initialize device_id:",i,"warn")}if(await Ou()){c("OAuth popup detected, broadcasting token and closing");return}await Ra();let o=["/watch","/live"];function a(i=window.location.href){try{let u=new URL(i);return u.origin!=="https://www.youtube.com"?!1:o.some(d=>u.pathname===d||u.pathname.startsWith(`${d}/`))}catch(u){return c("Timekeeper failed to parse URL for support check:",u,"error"),!1}}let r=null,l=null,s=null,f=null,m=null,y=null,h=null,v=null,E=(()=>{try{let i=parseFloat(localStorage.getItem("ytls-last-speed")??"");return Number.isFinite(i)&&i>0&&i!==1?Math.min(i,4):2}catch{return 2}})(),I=!1,O=null,G=null,q=250,ee=null;function _(){return $e().ui.minPaneHeight}function $(i){Zl(i)}function se(i){tc(i)}function ye(){return $e().ui.urlChangeHandlersSetup}function pe(i){nc(i)}function F(){return $e().ui.panePosition}function P(i){ec(i)}function he(i){oc(i)}function ae(){return r?r.getBoundingClientRect():null}function Te(i,u,d){i&&P({x:Math.round(typeof u=="number"?u:i.left),y:Math.round(typeof d=="number"?d:i.top),width:Math.round(i.width),height:Math.round(i.height)})}function Ke(i=!0){if(!r)return;Vn();let u=ae();if(u&&(u.width||u.height)&&(Te(u),i)){let d=F();vr("windowPosition",d),En({type:"window_position_updated",position:d,timestamp:Date.now()})}}function De(){if(!r||!l||!f||!s)return;let i=40,u=Re();if(u.length>0)i=u[0].offsetHeight;else{let d=document.createElement("li");d.style.visibility="hidden",d.style.position="absolute",d.textContent="00:00 Example",s.appendChild(d),i=d.offsetHeight,s.removeChild(d)}q=l.offsetHeight+f.offsetHeight+i,$(q),r.style.minHeight=_()+"px"}function Oe(){requestAnimationFrame(()=>{Ne?.(),De(),Ke(!0)})}function Ae(i=450){Le&&(clearTimeout(Le),Le=null),Le=setTimeout(()=>{Lt(),Oe(),Le=null},i)}function le(){Le&&(clearTimeout(Le),Le=null)}function _e(){s&&(s.style.visibility="hidden",c("Hiding timestamps during show animation")),Oe(),Ae()}function Ee(){Lt(),le(),yt&&(clearTimeout(yt),yt=null),yt=setTimeout(()=>{r&&(r.style.display="none",ls(),yt=null)},400)}function Lt(){if(!s){at&&(at(),at=null,Vt=null,In=null);return}if(!In){s.style.visibility==="hidden"&&(s.style.visibility="",c("Restoring timestamp visibility (no deferred fragment)")),at&&(at(),at=null,Vt=null);return}c("Appending deferred timestamps after animation"),s.appendChild(In),In=null,sn(),ln(),s.style.visibility==="hidden"&&(s.style.visibility="",c("Restoring timestamp visibility after append")),at&&(at(),at=null,Vt=null),Bt(),qe(),Ne&&requestAnimationFrame(Ne),xt(!0)}let Me=null,we=!1,be="ytls-timestamp-pending-delete",ce="ytls-timestamp-highlight";async function ue(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(i=>setTimeout(i,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(i=>setTimeout(i,100));await new Promise(i=>setTimeout(i,200))}let rt=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],tn=5e3,nn=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function An(i){return nn.has(i)}function Pe(){return document.querySelector("video")}let it=null;function K(){if(it&&document.contains(it))return it;let i=document.getElementById("movie_player");return i&&document.contains(i)?i:null}function Ft(i){return(Math.round(i*100)/100).toFixed(2).replace(/\.0+?$|(?<=\.[0-9])0+$/g,"")}function po(i){let u=i===1?2:i;E=u;try{localStorage.setItem("ytls-last-speed",String(u))}catch{}}function ci(i){if(!v)return;let u=typeof i=="number"?i:Pe()?.playbackRate??1,d=Ft(u);v.dataset.speed!==d&&(v.dataset.speed=d,v.textContent=`${d}x`,v.setAttribute("aria-label",`Playback speed ${d}x`)),Math.abs(u-1)>.01?v.classList.add("ytls-playback-speed-active"):v.classList.remove("ytls-playback-speed-active")}function ju(i){let u=K(),d=Pe();if(I=!0,u&&typeof u.setPlaybackRate=="function")u.setPlaybackRate(i);else if(d)d.playbackRate=i;else return I=!1,!1;return ci(i),!0}function Ha(){let i=Pe()?.playbackRate;return Number.isFinite(i)?ju(Math.abs(i-1)<=.001?E:1):!1}function $u(i){return i instanceof Element?!!i.closest('input, textarea, select, [contenteditable], [role="textbox"]'):!1}function ui(i){return rt.every(u=>typeof i?.[u]=="function"?!0:An(u)?!!Pe():!1)}function Wu(i){return rt.filter(u=>typeof i?.[u]=="function"?!1:An(u)?!Pe():!0)}async function Yu(i=tn){let u=Date.now();for(;Date.now()-u<i;){let w=K();if(ui(w))return w;await new Promise(S=>setTimeout(S,100))}let d=K();return ui(d),d}let za="timestampOffsetSeconds",Ku=-5,Ga="shiftClickTimeSkipSeconds",Xu=10,di=300,pi=300,Ct=null;function Fa(){try{return new URL(window.location.href).origin==="https://www.youtube.com"}catch{return!1}}function Ua(){if(Fa()&&!Ct)try{Ct=new BroadcastChannel("ytls_timestamp_channel"),Ct.onmessage=Va}catch(i){c("Failed to create BroadcastChannel:",i,"warn"),Ct=null}}function En(i){if(!Fa()){c("Skipping BroadcastChannel message: not on https://www.youtube.com","warn");return}if(Ua(),!Ct){c("No BroadcastChannel available to post message","warn");return}try{Ct.postMessage(i)}catch(u){c("BroadcastChannel error, reopening:",u,"warn");try{Ct=new BroadcastChannel("ytls_timestamp_channel"),Ct.onmessage=Va,Ct.postMessage(i)}catch(d){c("Failed to reopen BroadcastChannel:",d,"error")}}}function Va(i){if(c("Received message from another tab:",i.data),!(!a()||!s||!r)&&i.data){if(i.data.type==="timestamps_updated"&&i.data.videoId===Ie)c("Debouncing timestamp load due to external update for video:",i.data.videoId),clearTimeout(fo),fo=setTimeout(()=>{c("Reloading timestamps due to external update for video:",i.data.videoId),gr()},500);else if(i.data.type==="window_position_updated"&&r){let u=i.data.position;if(u&&typeof u.x=="number"&&typeof u.y=="number"){r.style.left=`${u.x}px`,r.style.top=`${u.y}px`,r.style.right="auto",r.style.bottom="auto",typeof u.width=="number"&&u.width>0&&(r.style.width=`${u.width}px`),typeof u.height=="number"&&u.height>0&&(r.style.height=`${u.height}px`);let d=r.getBoundingClientRect();P({x:Math.round(u.x),y:Math.round(u.y),width:Math.round(d.width),height:Math.round(d.height)});let w=document.documentElement.clientWidth,S=document.documentElement.clientHeight;(d.left<0||d.top<0||d.right>w||d.bottom>S)&&Vn()}}}}Ua();let Fn=await Oa(za);(typeof Fn!="number"||Number.isNaN(Fn))&&(Fn=Ku,await _a(za,Fn));let mo=await Oa(Ga);(typeof mo!="number"||Number.isNaN(mo))&&(mo=Xu,await _a(Ga,mo));let fo=null,Ut=new Map,Mn=!1,N=null,Qo=null,Ie=null,yt=null,Le=null,wt=null,Xe=null,on=null,mi=!1,Ne=null,In=null,Vt=null,at=null,rn=null,Zo=!1,fi=!1,er=null,tr=null,nr=null,or=null,rr=null,ir=null,ar=null,sr=null,ho=null,go=null,vo=null,bt=null,St=null,qa=0,yo=!1,Ln=null,wo=null,Un=null,ja=null,bo=null;function Cn(){if(!s)return{items:[],starts:[],rawTimes:[]};if(ja!==s||!bo?(bo?.disconnect(),bo=new MutationObserver(()=>{Un=null}),bo.observe(s,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-time"]}),ja=s,Un=null):bo.takeRecords().length>0&&(Un=null),!Un){let i=Ur(s),u=new Array(i.length),d=new Array(i.length);for(let w=0;w<i.length;w++){let S=i[w].querySelector("[data-time]")?.dataset.time;u[w]=S?Number.parseInt(S,10):NaN,d[w]=S?parseFloat(S):0}Un={items:i,starts:u,rawTimes:d}}return Un}function Re(){return Cn().items}function hi(){return Xl(s)}function an(){return wo!==null||(wo=Jl(s)),wo}function sn(){wo=null}function lr(i=K(),u=Pe()){let d=i?.getDuration?.();return Number.isFinite(d)&&d>0?d:Number.isFinite(u?.duration)&&u.duration>0?u.duration:0}function $a(){return lr()||an()}function Ju(i){let u=i.querySelector(".time-diff");return u?(u.textContent?.trim()||"").startsWith("-"):!1}let Qu="\u251C\u2500 ",Wa="\u2514\u2500 ",Ya=/^[├└]─\s/;function cr(i){return Ya.test(i)}function Ka(i){return i.replace(Ya,"")}function Xa(i){let u=Re();if(i>=u.length-1)return Wa;let S=u[i+1].querySelector("input");return S&&cr(S.value)?Qu:Wa}function Zu(i,u){return`${Xa(u)}${i}`}function Bt(){if(!s)return;Re().forEach((u,d)=>{let w=u.querySelector("input");if(!w||!cr(w.value))return;let S=Ka(w.value),A=Zu(S,d);w.value!==A&&(w.value=A)})}function So(){Vr(s),In&&(In=null),at&&(at(),at=null,Vt=null)}function xo(){Kl(s,we)}function Ja(i){Fi(s,i)}function gi(){$l(s)}function vi(i){if(!(!r||!s)){if(we=i,i)r.style.display="",r.classList.remove("ytls-fade-out"),r.classList.add("ytls-fade-in"),Ja("Loading timestamps...");else if(gi(),r.style.display="",r.classList.remove("ytls-fade-out"),r.classList.add("ytls-fade-in"),m){let u=K();if(u){let d=u.getCurrentTime(),w=Number.isFinite(d)?Math.max(0,Math.floor(d)):Math.max(0,an()),S=s?Cn().rawTimes:[];m.textContent=_r(w,S,lr(u))}}!we&&s&&!Oo(s)&&xo(),qt()}}function ur(i,u){i.dataset.time=String(u),i.textContent=gn(u,$a())}let dr=null,pr=null,Pt=!1;function Qa(i,u){if(!i||typeof i.getVideoData!="function"||!(u!==void 0?u:!!i.getVideoData()?.isLive))return!1;if(typeof i.getProgressState=="function"){let w=i.getProgressState(),S=Number(w?.seekableEnd??w?.liveHead??w?.head??w?.duration),A=Number(w?.current??i.getCurrentTime?.());if(Number.isFinite(S)&&Number.isFinite(A))return S-A>2}return!1}function ed(i,u){if(!Number.isFinite(i))return;let d=Za(i);yi(d,u)}function xt(i=!1,u){if(Mn&&!i)return;let d;if(typeof u=="number"&&Number.isFinite(u))d=Math.max(0,Math.floor(u));else{let w=K(),S=w?w.getCurrentTime():NaN;d=Number.isFinite(S)?Math.max(0,Math.floor(S)):Math.max(0,an())}Number.isFinite(d)&&ed(d,i)}function Za(i){if(!Number.isFinite(i))return null;let{items:u,starts:d}=Cn(),w=-1,S=-1/0;for(let A=0;A<d.length;A++){let T=d[A];T<=i&&T>S&&(S=T,w=A)}return w>=0?u[w]:null}function yi(i,u=!1){let d=s?s.getElementsByClassName(ce):null;if(!(!!d&&(i?d.length===1&&d[0]===i:d.length===0))&&d)for(let S of Array.from(d))S.classList.contains(be)||S.classList.remove(ce);if(i&&!i.classList.contains(be)&&(i.classList.add(ce),u))try{if(s instanceof HTMLElement){let S=i.getBoundingClientRect(),A=s.getBoundingClientRect();!(S.bottom<A.top||S.top>A.bottom)||i.scrollIntoView({behavior:"smooth",block:"center"})}else i.scrollIntoView({behavior:"smooth",block:"center"})}catch{try{i.scrollIntoView({behavior:"smooth",block:"center"})}catch{}}}function td(i){if(Tt()||!Number.isFinite(i)||i===0)return!1;let u=Re();if(u.length===0)return!1;let d=[];return u.forEach(w=>{let S=w.querySelector("[data-time]"),A=S?.dataset.time;if(!S||!A)return;let T=Number.parseInt(A,10);if(!Number.isFinite(T))return;let x=Math.max(0,T+i);if(x!==T){ur(S,x);let L=w.dataset.guid;L&&d.push({guid:L,start:x,comment:w.querySelector("input")?.value??""})}}),d.length===0?!1:(ln(),Bt(),qe(),wi(),os(Ie,d),Ln=null,!0)}function es(i,u={}){if(!Number.isFinite(i)||i===0)return!1;if(!td(i)){if(u.alertOnNoChange){let T=u.failureMessage??"Offset did not change any timestamps.";alert(T)}return!1}let w=u.logLabel??"bulk offset";c(`Timestamps changed: Offset all timestamps by ${i>0?"+":""}${i} seconds (${w})`);let S=K(),A=S?Math.floor(S.getCurrentTime()):0;if(Number.isFinite(A)){let T=Za(A);yi(T,!1)}return!0}function ts(i){if(!s||we)return;let u=i.target instanceof Element?i.target:null;if(!u)return;let d=u.closest("[data-time]"),w=u.closest("[data-increment]"),S=u.closest("[data-action]");if(d?.dataset.time){i.preventDefault();let A=Number(d.dataset.time);if(Number.isFinite(A)){c(`Seeking to timestamp ${A}`),Pt=!0;let x=K();x&&x.seekTo(A),setTimeout(()=>{Pt=!1},500)}let T=d.closest("li");T&&(Re().forEach(x=>{x.classList.contains(be)||x.classList.remove(ce)}),T.classList.contains(be)||(T.classList.add(ce),T.scrollIntoView({behavior:"smooth",block:"center"})))}else if(w?.dataset.increment){i.preventDefault();let A=w.closest("li"),T=A?.querySelector("[data-time]");if(!T||!T.dataset.time)return;let x=parseInt(T.dataset.time,10),L=parseInt(w.dataset.increment,10);if("shiftKey"in i&&i.shiftKey&&(L*=mo),"altKey"in i?i.altKey:!1){es(L,{logLabel:"Alt adjust"});return}let U=Math.max(0,x+L);if(c(`Timestamps changed: Timestamp time incremented from ${x} to ${U}`),sn(),ur(T,U),pr=U,dr&&clearTimeout(dr),Pt=!0,dr=setTimeout(()=>{if(pr!==null){let ne=K();ne&&ne.seekTo(pr)}dr=null,pr=null,setTimeout(()=>{Pt=!1},500)},500),ln(),Bt(),qe(),A){let ne=A.querySelector("input"),Se=A.dataset.guid;ne&&Se&&(hr(Ie,Se,U,ne.value),Ln=Se)}}else S?.dataset.action==="clear"&&(i.preventDefault(),c("Timestamps changed: All timestamps cleared from UI"),s.textContent="",sn(),qe(),mr(),rd(),he([]),od(Ie),Ln=null,xo())}function To(i,u="",d=!1,w=null,S=!0){if(!s)return null;let A=Math.max(0,i),T=w??crypto.randomUUID(),x=document.createElement("li"),L=document.createElement("div"),C=document.createElement("span"),R=document.createElement("span"),U=document.createElement("span"),ne=document.createElement("div"),Se=document.createElement("span"),dt=document.createElement("span"),Q=document.createElement("input"),oe=document.createElement("button");x.dataset.guid=T,L.className="time-row",ne.className="ytls-row-controls";let He=document.createElement("div");He.style.cssText="position:absolute;left:0;top:0;width:20px;height:20px;display:flex;align-items:center;justify-content:center;cursor:pointer;",ze(He,"Click to toggle indent");let st=document.createElement("span");st.style.cssText="color:#f4ba78;pointer-events:none;display:none;line-height:0;";let kt=()=>{let V=Q.offsetTop,H=Q.offsetHeight||20;He.style.top=`${V}px`,He.style.height=`${H}px`},Rt=()=>{Fe(st,cr(Q.value)?"indent-decrease":"indent-increase",18)},qn="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",cn=V=>{let H=st.querySelector("svg");H&&(H.style.transition="filter 0.15s ease",H.style.filter=V?qn:"none")},jn=V=>{V.stopPropagation();let H=cr(Q.value),de=Ka(Q.value),Z="";if(!H){let pt=Re().indexOf(x);Z=Xa(pt)}Q.value=Z?`${Z}${de}`:de,Rt(),Bt();let ge=Number.parseInt(Se.dataset.time??"0",10);hr(Ie,T,ge,Q.value)};He.onclick=jn,He.append(st),He.addEventListener("mouseenter",()=>{cn(!0)}),He.addEventListener("mouseleave",()=>{cn(!1)}),x.style.cssText="position:relative;padding-left:20px;",x.addEventListener("mouseenter",()=>{kt(),Rt(),st.style.display="inline"}),x.addEventListener("mouseleave",()=>{cn(!1),st.style.display="none"}),x.addEventListener("mouseleave",()=>{x.dataset.guid===Ln&&Ju(x)&&ns()}),Q.value=u||"",Q.style.cssText="width:100%;margin-top:5px;display:block;",Q.type="text",Q.setAttribute("inputmode","text"),Q.autocapitalize="off",Q.autocomplete="off",Q.spellcheck=!1,requestAnimationFrame(kt);let Eo=!1;Q.addEventListener("focusin",()=>{yo=!1,Eo=!1}),Q.addEventListener("focusout",V=>{let H=V.relatedTarget,de=Date.now()-qa<250,Z=!!H&&!!r&&r.contains(H);!de&&!Z&&!Eo&&(yo=!0,setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(Q.focus({preventScroll:!0}),yo=!1)},0))}),Q.addEventListener("keydown",V=>{(V.key==="Escape"||V.key==="Esc")&&(V.preventDefault(),Eo=!0,Q.blur())});let Mo=V=>{let H=Ut.get(T);H&&clearTimeout(H.timeoutId);let de=Ie,Z=()=>{let ge=Ut.get(T);ge&&(clearTimeout(ge.timeoutId),Ut.delete(T)),rs(de,T,Number.parseInt(Se.dataset.time??"0",10),Q.value)};Ut.set(T,{timeoutId:setTimeout(Z,V),flush:Z})};Q.addEventListener("input",V=>{let H=V;H&&(H.isComposing||H.inputType==="insertCompositionText")||Mo(500)}),Q.addEventListener("compositionend",()=>{Mo(50)});let jt="#f4ba78",yr="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",wr="#c8452d",br="drop-shadow(0 0 4px #e36a52) drop-shadow(0 0 8px #e36a52)",Pn=(V,H=jt,de=yr)=>{V.style.color=H;let Z=V.querySelector("svg");Z&&(Z.style.transition="filter 0.15s ease"),V.addEventListener("mouseenter",()=>{Z&&(Z.style.filter=de)}),V.addEventListener("mouseleave",()=>{Z&&(Z.style.filter="none")})};Fe(C,"circle-minus",18),C.classList.add("ytls-row-control"),C.dataset.increment="-1",C.style.cursor="pointer",C.style.margin="0px",Pn(C),Fe(U,"circle-plus",18),U.classList.add("ytls-row-control"),U.dataset.increment="1",U.style.cursor="pointer",U.style.margin="0px",Pn(U),Fe(R,"current-location",18),R.classList.add("ytls-row-control"),R.style.cursor="pointer",R.style.margin="0px",ze(R,"Set to current playback time"),Pn(R),R.onclick=()=>{let V=K(),H=V?Math.floor(V.getCurrentTime()):0;Number.isFinite(H)&&(c(`Timestamps changed: set to current playback time ${H}`),sn(),ur(Se,H),ln(),Bt(),hr(Ie,T,H,Q.value),Ln=T)},sn(),ur(Se,A),Se.addEventListener("click",V=>{V.preventDefault(),V.stopPropagation();let H=Number(Se.dataset.time);if(!Number.isFinite(H))return;c(`Seeking to timestamp ${H}`),Pt=!0;let de=K();de&&de.seekTo(H);let Z=Pe();Z?.paused&&Z.play(),setTimeout(()=>{Pt=!1},500),s?.querySelectorAll(`.${ce}`).forEach(ge=>ge.classList.remove(ce)),x.classList.contains(be)||(x.classList.add(ce),x.scrollIntoView({behavior:"smooth",block:"center"}))}),Fe(oe,"trash",16),oe.classList.add("ytls-row-control"),oe.style.cssText="background:transparent;border:none;cursor:pointer;margin-left:5px;display:inline-flex;align-items:center;",Pn(oe,wr,br),oe.onclick=()=>{let V=null,H=null,de=null,Z=()=>{try{x.removeEventListener("click",H,!0)}catch{}try{document.removeEventListener("click",H,!0)}catch{}if(s)try{s.removeEventListener("mouseleave",de)}catch{}V&&(clearTimeout(V),V=null)};if(x.dataset.deleteConfirmed==="true"){c("Timestamps changed: Timestamp deleted");let ge=x.dataset.guid??"",je=Ut.get(ge);je&&(clearTimeout(je.timeoutId),Ut.delete(ge)),Z(),x.remove(),sn(),ln(),Bt(),qe(),mr(),id(Ie,ge),Ln=null,xo()}else{x.dataset.deleteConfirmed="true",x.classList.add(be),x.classList.remove(ce);let ge=()=>{x.dataset.deleteConfirmed="false",x.classList.remove(be);let je=K(),pt=je?je.getCurrentTime():0,Dt=Number.parseInt(x.querySelector("[data-time]")?.dataset.time??"0",10);Number.isFinite(pt)&&Number.isFinite(Dt)&&pt>=Dt&&x.classList.add(ce),Z()};H=je=>{je.target!==oe&&ge()},de=()=>{x.dataset.deleteConfirmed==="true"&&ge()},x.addEventListener("click",H,!0),document.addEventListener("click",H,!0),s&&s.addEventListener("mouseleave",de),V=setTimeout(()=>{x.dataset.deleteConfirmed==="true"&&ge(),Z()},5e3)}},dt.className="time-diff",dt.style.color="#888",dt.style.marginLeft="5px",ne.append(C,R,U,oe),L.append(Se,ne,dt),x.append(He,L,Q);let Sr=Number.parseInt(Se.dataset.time??"0",10);if(S){gi();let V=!1,H=Re();for(let de=0;de<H.length;de++){let Z=H[de],je=Z.querySelector("[data-time]")?.dataset.time;if(!je)continue;let pt=Number.parseInt(je,10);if(Number.isFinite(pt)&&Sr<pt){s.insertBefore(x,Z),V=!0;break}}V||s.appendChild(x),x.scrollIntoView({behavior:"smooth",block:"center"}),sn(),ln(),mr(),Bt(),qe(),d||(hr(Ie,T,A,u),Ln=T,yi(x,!1))}else Q.__ytls_li=x;return Q}function ln(){if(Tt())return;let i=$a(),u=Re();u.forEach((d,w)=>{let S=d.querySelector(".time-diff"),A=d.querySelector("[data-time]"),T=A?.dataset.time;if(A&&T){let dt=Number.parseInt(T,10);Number.isFinite(dt)&&(A.textContent=gn(dt,i))}if(!S)return;if(!T){S.textContent="";return}let x=Number.parseInt(T,10);if(!Number.isFinite(x)){S.textContent="";return}if(w===0){S.textContent="";return}let R=u[w-1].querySelector("[data-time]")?.dataset.time;if(!R){S.textContent="";return}let U=Number.parseInt(R,10);if(!Number.isFinite(U)){S.textContent="";return}let ne=x-U,Se=ne<0?"-":"";S.textContent=` ${Se}${gn(Math.abs(ne))}`})}function ns(){if(Tt())return;let i=null;if(document.activeElement instanceof HTMLInputElement&&s.contains(document.activeElement)){let T=document.activeElement,L=T.closest("li")?.dataset.guid;if(L){let C=T.selectionStart??T.value.length,R=T.selectionEnd??C,U=T.scrollLeft;i={guid:L,start:C,end:R,scroll:U}}}let u=Re();if(u.length===0)return;let d=u.map(T=>T.dataset.guid),w=u.map(T=>{let x=T.querySelector("[data-time]"),L=x?.dataset.time;if(!x||!L)return null;let C=Number.parseInt(L,10);if(!Number.isFinite(C))return null;let R=T.dataset.guid??"";return{time:C,guid:R,element:T}}).filter(T=>T!==null).sort((T,x)=>{let L=T.time-x.time;return L!==0?L:T.guid.localeCompare(x.guid)}),S=w.map(T=>T.guid),A=d.length!==S.length||d.some((T,x)=>T!==S[x]);if(s.replaceChildren(),w.forEach(T=>{s.appendChild(T.element)}),ln(),Bt(),qe(),i){let x=Re().find(L=>L.dataset.guid===i.guid)?.querySelector("input");if(x)try{x.focus({preventScroll:!0})}catch{}}A&&(c("Timestamps changed: Timestamps sorted"),wi())}function mr(){if(!s||!r||!l||!f)return;let i=Re().length;Ne?.();let u=r.getBoundingClientRect(),d=l.getBoundingClientRect(),w=f.getBoundingClientRect(),S=Math.max(0,u.height-(d.height+w.height));i===0?(xo(),s.style.overflowY="hidden"):s.style.overflowY=s.scrollHeight>S?"auto":"hidden"}function qe(){if(!s)return;let i=Pe(),u=document.querySelector(".ytp-progress-bar"),d=K(),w=d?d.getVideoData():null,S=!!w&&!!w.isLive;if(!i||!u||!isFinite(i.duration)||S)return;as();let{items:A,starts:T}=Cn(),x=i.duration,L=document.createDocumentFragment();A.forEach((C,R)=>{let U=T[R];if(!Number.isFinite(U))return;C.dataset.guid||(C.dataset.guid=crypto.randomUUID());let ne=document.createElement("div");ne.className="ytls-marker",ne.style.left=U/x*100+"%",ne.dataset.time=String(U),L.appendChild(ne)}),u.appendChild(L),nd(u)}function nd(i){i.dataset.ytlsMarkerClicks||(i.dataset.ytlsMarkerClicks="1",i.addEventListener("click",u=>{let d=u.target?.closest?.(".ytls-marker");if(!d)return;let w=Number(d.dataset.time),S=K();S&&Number.isFinite(w)&&S.seekTo(w)}))}function wi(){he(hi().sort((i,u)=>i.start-u.start))}function os(i,u){!i||u.length===0||we||Tt()||(pd(i,u).then(()=>{c(`Saved ${u.length} timestamps for ${i} to IndexedDB`),s&&ko()}).catch(d=>{let w=`Failed to save timestamps: ${d.message}`;c(`Failed to save timestamps for ${i} to IndexedDB:`,d,"error"),Bn(w)}),En({type:"timestamps_updated",videoId:i,action:"saved"}))}function od(i){!i||we||Tt()||(ss(i).then(()=>{s&&ko()}).catch(u=>{let d=`Failed to clear timestamps: ${u.message}`;c(`Failed to clear timestamps for ${i}:`,u,"error"),Bn(d)}),En({type:"timestamps_updated",videoId:i,action:"saved"}))}function fr(){for(let{flush:i}of[...Ut.values()])i()}function rd(){Ut.forEach(({timeoutId:i})=>clearTimeout(i)),Ut.clear()}function hr(i,u,d,w){!i||we||Tt()||rs(i,u,d,w)}function rs(i,u,d,w){if(!i)return;let S={guid:u,start:d,comment:w};c(`Saving timestamp: guid=${u}, start=${d}, comment="${w}"`),md(i,S).then(()=>{s&&ko()}).catch(A=>{let T=`Failed to save timestamp: ${A.message}`;c(`Failed to save timestamp ${u}:`,A,"error"),Bn(T)}),En({type:"timestamps_updated",videoId:i,action:"saved"})}function id(i,u){!i||we||Tt()||(fd(i,u).then(()=>{s&&ko()}).catch(d=>{let w=`Failed to delete timestamp: ${d.message}`;c(`Failed to delete timestamp ${u}:`,d,"error"),Bn(w)}),En({type:"timestamps_updated",videoId:i,action:"saved"}))}async function is(i){if(Tt()){alert("Cannot export timestamps while an error is being displayed.");return}let u=Ie;if(!u)return;c(`Exporting timestamps for video ID: ${u}`);let d=hi(),w=Dn();if(i==="json"){let S=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),A=URL.createObjectURL(S),T=document.createElement("a");T.href=A,T.download=`timestamps-${u}-${w}.json`,T.click(),URL.revokeObjectURL(A)}else if(i==="text"){let S=Li(d,!0),A=new Blob([S],{type:"text/plain"}),T=URL.createObjectURL(A),x=document.createElement("a");x.href=T,x.download=`timestamps-${u}-${w}.txt`,x.click(),URL.revokeObjectURL(T)}}function Bn(i){if(!r||!s){c("Timekeeper error:",i,"error");return}Wl(s,i),$i(i),qe()}function ko(){s&&(Yl(s),$i(null))}function Tt(){return!!(!s||Oo(s)||we||rc()!==null)}function as(){document.querySelectorAll(".ytls-marker").forEach(i=>i.remove())}function Vn(){if(!r||!document.body.contains(r))return;let i=r.getBoundingClientRect(),u=document.documentElement.clientWidth,d=document.documentElement.clientHeight,w=i.width,S=i.height;if(i.left<0&&(r.style.left="0",r.style.right="auto"),i.right>u){let A=Math.max(0,u-w);r.style.left=`${A}px`,r.style.right="auto"}if(i.top<0&&(r.style.top="0",r.style.bottom="auto"),i.bottom>d){let A=Math.max(0,d-S);r.style.top=`${A}px`,r.style.bottom="auto"}}function ad(){if(er&&(document.removeEventListener("mousemove",er),er=null),tr&&(document.removeEventListener("mouseup",tr),tr=null),ho&&(document.removeEventListener("keydown",ho),ho=null),nr&&(window.removeEventListener("resize",nr),nr=null),go&&(document.removeEventListener("pointerdown",go,!0),go=null),vo&&(document.removeEventListener("pointerup",vo,!0),vo=null),bt){try{bt.disconnect()}catch{}bt=null}if(St){try{St.disconnect()}catch{}St=null}let i=Pe();i&&(or&&(i.removeEventListener("timeupdate",or),or=null),rr&&(i.removeEventListener("pause",rr),rr=null),ir&&(i.removeEventListener("play",ir),ir=null),ar&&(i.removeEventListener("seeking",ar),ar=null),sr&&(i.removeEventListener("ratechange",sr),sr=null))}function sd(){as(),fr(),fo&&(clearTimeout(fo),fo=null),Me&&(clearInterval(Me),Me=null),yt&&(clearTimeout(yt),yt=null),ad(),wl();try{Ct.close()}catch{}if(N&&N.parentNode===document.body&&document.body.removeChild(N),N=null,Qo=null,Mn=!1,Ie=null,bt){try{bt.disconnect()}catch{}bt=null}if(St){try{St.disconnect()}catch{}St=null}r&&r.parentNode&&r.remove();let i=document.getElementById("ytls-header-button");i&&i.parentNode&&i.remove(),rn=null,Zo=!1,P(null),So(),r=null,l=null,s=null,f=null,Xe=null,on=null,Ne=null,m=null,y=null,v=null,O=null,it=null}async function ld(){let i=Ao();if(!i)return it=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let u=await Yu();if(!ui(u)){let d=Wu(u),w=d.length?` Missing methods: ${d.join(", ")}.`:"",S=u?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return it=null,{ok:!1,message:`${S}${w} Try refreshing once playback is ready.`}}return it=u,{ok:!0,player:u,videoId:i}}async function gr(){if(!r||!s)return;let i=s.scrollTop,u=!0,d=()=>{if(!s||!u)return;let w=Math.max(0,s.scrollHeight-s.clientHeight);s.scrollTop=Math.min(i,w)};try{let w=await ld();if(!w.ok){Bn(w.message),So(),qe();return}let{videoId:S}=w,A=[];try{let T=await hd(S);T?(A=T.map(x=>({...x,guid:x.guid||crypto.randomUUID()})),c(`Loaded ${A.length} timestamps from IndexedDB for ${S}`),ko()):c(`No timestamps found in IndexedDB for ${S}`)}catch(T){let x=`Failed to load timestamps: ${T.message}`;c(`Failed to load timestamps from IndexedDB for ${S}:`,T,"error"),Bn(x),qe();return}if(A.length>0){A.sort((L,C)=>L.start-C.start),So(),gi();let T=document.createDocumentFragment();A.forEach(L=>{let R=To(L.start,L.comment,!0,L.guid,!1).__ytls_li;R&&T.appendChild(R)}),r&&r.classList.contains("ytls-zoom-in")&&Le!=null?(c("Deferring timestamp DOM append until show animation completes"),In=T,Vt||(Vt=new Promise(L=>{at=L})),await Vt):s&&(s.appendChild(T),sn(),ln(),Bt(),qe(),Ne&&requestAnimationFrame(Ne)),he(A),xt(!0),u=!1}else So(),Ja("No timestamps for this video"),qe(),he([]),Ne&&requestAnimationFrame(Ne)}catch(w){c("Unexpected error while loading timestamps:",w,"error"),Bn("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{Vt&&await Vt,requestAnimationFrame(d),Ne&&requestAnimationFrame(Ne),s&&!Oo(s)&&xo()}}function Ao(){let u=new URLSearchParams(location.search).get("v");if(u)return u;let d=document.querySelector('meta[itemprop="identifier"]');return d?.content?d.content:null}function cd(i=null,u=null){if(!m)return;let d=Pe(),w=u||K();if(!d&&!w)return;let S=i!==null?i:w?w.getCurrentTime():0,A=Number.isFinite(S)?Math.max(0,Math.floor(S)):Math.max(0,an()),{isLive:T}=w?w.getVideoData()||{isLive:!1}:{isLive:!1},x=w?Qa(w,!!T):!1,L=s?Cn().rawTimes:[];m.textContent=_r(A,L,lr(w,d)),m.style.color=x?"#ff4d4f":""}function ud(){let i=Pe();if(!i)return;let u=NaN,d=null,w=()=>{if(!s)return;let C=K(),R=C?Math.floor(C.getCurrentTime()):0;if(!Number.isFinite(R))return;let U=Cn();if(R===u&&U===d)return;let ne=!!m&&!we&&!Pt;ne&&cd(R,C),xt(!1,R),ne&&!Mn&&(u=R,d=U)},S=C=>{try{let R=new URL(window.location.href);C!==null&&Number.isFinite(C)?R.searchParams.set("t",`${Math.floor(C)}s`):R.searchParams.delete("t"),window.history.replaceState(window.history.state,"",R.toString())}catch{}},A=()=>{let C=K(),R=C?C.getCurrentTime():NaN,U=Number.isFinite(R)?Math.max(0,Math.floor(R)):Math.max(0,an());if(Number.isFinite(U)){S(U);try{xt(!0)}catch(ne){c("Failed to highlight nearest timestamp on pause:",ne,"warn")}}},T=()=>{S(null);try{let C=K(),R=C?C.getCurrentTime():NaN,U=Number.isFinite(R)?Math.max(0,Math.floor(R)):Math.max(0,an());Number.isFinite(U)&&xt(!0)}catch(C){c("Failed to highlight nearest timestamp on play:",C,"warn")}},x=()=>{let C=Pe();if(!C)return;let R=K(),U=R?Math.floor(R.getCurrentTime()):0;Number.isFinite(U)&&(C.paused&&S(U),xt(!0,U))},L=()=>{let C=i.playbackRate;I?I=!1:po(C),ci(C)};or=w,rr=A,ir=T,ar=x,sr=L,i.addEventListener("timeupdate",w),i.addEventListener("pause",A),i.addEventListener("play",T),i.addEventListener("seeking",x),i.addEventListener("ratechange",L)}let{saveToIndexedDB:dd,saveRowsToIndexedDB:pd,saveSingleTimestampToIndexedDB:md,deleteSingleTimestampFromIndexedDB:fd,loadFromIndexedDB:hd,removeFromIndexedDB:ss,saveGlobalSettings:vr,loadGlobalSettings:bi,buildExportPayload:gd,mergeBackupData:vd,exportAllTimestamps:yd,exportAllTimestampsCsv:wd}=Fr;function ls(){if(!r)return;let i=r.style.display!=="none";vr("uiVisible",i)}function qt(i){let u=typeof i=="boolean"?i:!!r&&r.style.display!=="none",d=document.getElementById("ytls-header-button");d instanceof HTMLButtonElement&&d.setAttribute("aria-pressed",String(u)),rn&&!Zo&&rn.src!==Nr&&(rn.src=Nr)}function bd(){r&&bi("uiVisible").then(i=>{let u=Ot().safeParse(i),d=u.success?u.data:void 0;typeof d=="boolean"?(d?(r.style.display="flex",r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in")):r.style.display="none",qt(d)):(!u.success&&i!==void 0&&c("UI visibility state failed validation, defaulting to visible",u.error.message,"warn"),r.style.display="flex",r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in"),qt(!0))}).catch(i=>{c("Failed to load UI visibility state:",i,"error"),r.style.display="flex",r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in"),qt(!0)})}function Si(i){if(!r){c("ERROR: togglePaneVisibility called but pane is null");return}document.body.contains(r)||(c("Pane not in DOM during toggle, appending it"),document.querySelectorAll("#ytls-pane").forEach(S=>{S!==r&&S.remove()}),document.body.appendChild(r));let u=document.querySelectorAll("#ytls-pane");u.length>1&&(c(`ERROR: Multiple panes detected in togglePaneVisibility (${u.length}), cleaning up`),u.forEach(S=>{S!==r&&S.remove()})),yt&&(clearTimeout(yt),yt=null);let d=r.style.display==="none";(typeof i=="boolean"?i:d)?(r.style.display="flex",r.classList.remove("ytls-fade-out"),r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in"),qt(!0),ls(),_e(),Le&&(clearTimeout(Le),Le=null),Le=setTimeout(()=>{Lt(),Ne?.(),De(),Ke(!0);try{xt(!0)}catch(S){c("Failed to scroll to nearest timestamp after toggle:",S,"warn")}Le=null},450)):(r.classList.remove("ytls-fade-in"),r.classList.remove("ytls-zoom-in"),r.classList.add("ytls-zoom-out"),qt(!1),Ee())}function cs(i){if(!s){c("UI is not initialized; cannot import timestamps.","warn");return}let u=!1,d=[],w=(S,A)=>{let T=S.querySelector("input");if(!T)return;T.value=A;let x=S.dataset.guid,L=Number.parseInt(S.querySelector("[data-time]")?.dataset.time??"",10);x&&Number.isFinite(L)&&d.push({guid:x,start:L,comment:A})};try{let S=JSON.parse(i),A=null;if(Array.isArray(S))A=S;else if(typeof S=="object"&&S!==null){let T=Ie;if(T){let x=`timekeeper-${T}`;S[x]&&Array.isArray(S[x].timestamps)&&(A=S[x].timestamps,c(`Found timestamps for current video (${T}) in export format`,"info"))}if(!A){let x=Object.keys(S).filter(L=>L.startsWith("ytls-"));if(x.length===1&&Array.isArray(S[x[0]].timestamps)){A=S[x[0]].timestamps;let L=S[x[0]].video_id;c(`Found timestamps for video ${L} in export format`,"info")}}}A&&Array.isArray(A)?A.every(x=>typeof x.start=="number"&&typeof x.comment=="string")?(A.forEach(x=>{if(x.guid){let L=Re().find(C=>C.dataset.guid===x.guid);L?w(L,x.comment):To(x.start,x.comment,!1,x.guid)}else To(x.start,x.comment,!1,crypto.randomUUID())}),u=!0):c("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):c("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!u){let S=i.split(`
`).map(A=>A.trim()).filter(A=>A);if(S.length>0){let A=!1;S.forEach(T=>{let x=T.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(x){A=!0;let L=parseInt(x[1])||0,C=parseInt(x[2]),R=parseInt(x[3]),U=L*3600+C*60+R,ne=x[4]?x[4].trim():"",Se=null,dt=ne,Q=ne.match(/<!--\s*guid:([^>]+?)\s*-->/);Q&&(Se=Q[1].trim(),dt=ne.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let oe;Se&&(oe=Re().find(He=>He.dataset.guid===Se)),!oe&&!Se&&(oe=Re().find(He=>{if(He.dataset.guid)return!1;let kt=He.querySelector("[data-time]")?.dataset.time;if(!kt)return!1;let Rt=Number.parseInt(kt,10);return Number.isFinite(Rt)&&Rt===U})),oe?w(oe,dt):To(U,dt,!1,Se||crypto.randomUUID())}}),A&&(u=!0)}}u?(c("Timestamps changed: Imported timestamps from file/clipboard"),Bt(),wi(),os(Ie,d),qe(),mr()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function Sd(){if(fi){c("Pane initialization already in progress, skipping duplicate call");return}if(!(r&&document.body.contains(r))){fi=!0;try{let S=function(p=null,g=null){if(!m)return;let b=Pe(),k=g||K();if(!b&&!k)return;let M=p!==null?p:k?k.getCurrentTime():0,Y=Number.isFinite(M)?Math.max(0,Math.floor(M)):Math.max(0,an()),{isLive:D}=k?k.getVideoData()||{isLive:!1}:{isLive:!1},z=k?Qa(k,!!D):!1,B=s?Cn().rawTimes:[];m.textContent=_r(Y,B,lr(k,b)),m.style.color=z?"#ff4d4f":"",w(!!D);try{ci()}catch{}},A=function(){if(we||Pt)return;let p=K();if(!p)return;let g=p.getCurrentTime(),b=Number.isFinite(g)?Math.max(0,Math.floor(g)):Math.max(0,an());S(b,p),(s?Re():[]).length>0&&xt(!1,b)},oe=function(p,g,b,k){let M=document.createElement("button");return k?W(M,k,p):M.textContent=p,ze(M,g),M.classList.add("ytls-settings-modal-button"),M.onclick=b,M},He=function(p="general"){if(N&&N.parentNode===document.body){let re=document.getElementById("ytls-save-modal"),fn=document.getElementById("ytls-load-modal"),Yt=document.getElementById("ytls-delete-all-modal");re&&document.body.contains(re)&&document.body.removeChild(re),fn&&document.body.contains(fn)&&document.body.removeChild(fn),Yt&&document.body.contains(Yt)&&document.body.removeChild(Yt),N.classList.remove("ytls-fade-in"),N.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(N)&&document.body.removeChild(N),N=null,document.removeEventListener("click",kt,!0),document.removeEventListener("keydown",st)},300);return}N=document.createElement("div"),N.id="ytls-settings-modal",N.classList.remove("ytls-fade-out"),N.classList.add("ytls-fade-in");let g=document.createElement("div");g.className="ytls-modal-header";let b=document.createElement("div");b.id="ytls-settings-nav";let k=document.createElement("button");k.className="ytls-modal-close-button",Fe(k,"x",14),k.onclick=()=>{if(N&&N.parentNode===document.body){let re=document.getElementById("ytls-save-modal"),fn=document.getElementById("ytls-load-modal"),Yt=document.getElementById("ytls-delete-all-modal");re&&document.body.contains(re)&&document.body.removeChild(re),fn&&document.body.contains(fn)&&document.body.removeChild(fn),Yt&&document.body.contains(Yt)&&document.body.removeChild(Yt),N.classList.remove("ytls-fade-in"),N.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(N)&&document.body.removeChild(N),N=null,document.removeEventListener("click",kt,!0),document.removeEventListener("keydown",st)},300)}};let M=document.createElement("div");M.id="ytls-settings-content";let Y=document.createElement("h3");Y.className="ytls-section-heading",Y.textContent="General",Y.style.display="none";let D=document.createElement("div"),z=document.createElement("div");z.className="ytls-button-grid";let B=document.createElement("div");B.className="ytls-button-grid";function X(re){D.style.display=re==="general"?"block":"none",z.style.display=re==="google"?"block":"none",B.style.display=re==="sync"?"block":"none",me.classList.toggle("active",re==="general"),Je.classList.toggle("active",re==="google"),At.classList.toggle("active",re==="sync"),Y.textContent=re==="general"?"General":re==="google"?"Google":"Sync"}let me=document.createElement("button");me.appendChild(Rn("adjustments-horizontal",16));let Ce=document.createElement("span");Ce.className="ytls-tab-text",Ce.textContent=" General",me.appendChild(Ce),ze(me,"General settings"),me.classList.add("ytls-settings-modal-button"),me.onclick=()=>X("general");let Je=document.createElement("button");Je.appendChild(Rn("cloud",16));let dn=document.createElement("span");dn.className="ytls-tab-text",dn.textContent=" Google",Je.appendChild(dn),ze(Je,"Google Drive backup settings"),Je.classList.add("ytls-settings-modal-button"),Je.onclick=async()=>{vt.isSignedIn&&await Nu(),X("google")};let At=document.createElement("button");At.appendChild(Rn("server",16));let pn=document.createElement("span");pn.className="ytls-tab-text",pn.textContent=" Sync",At.appendChild(pn),ze(At,"Live sync across devices"),At.classList.add("ytls-settings-modal-button"),At.onclick=()=>X("sync"),b.appendChild(me),b.appendChild(Je),b.appendChild(At),g.appendChild(b),g.appendChild(k),N.appendChild(g),D.className="ytls-button-grid",D.appendChild(oe("Save","Save As...",Rt.onclick,"device-floppy")),D.appendChild(oe("Load","Load",qn.onclick,"folder-open")),D.appendChild(oe("Export All","Export All Data",cn.onclick,"file-export")),D.appendChild(oe("Import All","Import All Data",jn.onclick,"file-import")),D.appendChild(oe("Export All (CSV)","Export All Timestamps to CSV",async()=>{try{await wd()}catch{alert("Failed to export CSV: Could not read from database.")}},"file-spreadsheet"));let $t=oe(vt.isSignedIn?"Sign Out":"Sign In",vt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{vt.isSignedIn?await _u():await Du(),W($t,vt.isSignedIn?"logout":"login",vt.isSignedIn?"Sign Out":"Sign In"),ze($t,vt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),ke()},vt.isSignedIn?"logout":"login"),Io=oe(Xo()?"Auto Backup: On":"Auto Backup: Off","Toggle Auto Backup",async()=>{await Vu(),Ir(),ke()},"refresh"),Ss=oe(`Backup Interval: ${Gt()}min`,"Set periodic backup interval (minutes)",async()=>{await qu(),Ir(),ke()},"clock-plus"),Ir=()=>{W($t,vt.isSignedIn?"logout":"login",vt.isSignedIn?"Sign Out":"Sign In"),ze($t,vt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),W(Io,"refresh",Xo()?"Auto Backup: On":"Auto Backup: Off"),W(Ss,"clock-plus",`Backup Interval: ${Gt()}min`),typeof ke=="function"&&ke()};z.appendChild($t),z.appendChild(Io),z.appendChild(Ss),z.appendChild(oe("Backup Now","Run a backup immediately",async()=>{await Ko({silent:!1,skipBackoff:!0}),Ir()},"database"));let Wt=document.createElement("div");Wt.style.marginTop="15px",Wt.style.paddingTop="10px",Wt.style.borderTop="1px solid #555",Wt.style.fontSize="12px",Wt.style.color="#aaa";let Lr=document.createElement("div");Lr.style.marginBottom="8px",Lr.style.fontWeight="bold",Wt.appendChild(Lr),ku(Lr);let Ai=document.createElement("div");Ai.style.marginBottom="8px",xu(Ai),Wt.appendChild(Ai);let xs=document.createElement("div");Tu(xs),Wt.appendChild(xs),z.appendChild(Wt),ot(),uo(),ke(),Ir();let Cr=oe("Sign In","Sign in to Timekeeper Sync with Google",async()=>{Ve().isSignedIn?await du():await lu()},"login"),Ts=oe("Sync Now","Sync with the server immediately",()=>ka(),"refresh"),ks=oe("Share Subscriptions","Let Timekeeper Sync read which channels you subscribe to (read-only), to work out which members-only videos you can access",async()=>{try{await cu()}catch{}},"users");Xc(()=>{let re=Ve().isSignedIn;W(Cr,re?"logout":"login",re?"Sign Out":"Sign In"),ze(Cr,re?"Sign out of Timekeeper Sync":"Sign in to Timekeeper Sync with Google"),Cr.disabled=!re&&!Hn(),Ts.disabled=!re,ks.disabled=!re}),B.appendChild(Cr),B.appendChild(Ts),B.appendChild(ks);let mn=document.createElement("div");mn.style.marginTop="15px",mn.style.paddingTop="10px",mn.style.borderTop="1px solid #555",mn.style.fontSize="12px",mn.style.color="#aaa";let Br=document.createElement("div");Br.style.marginBottom="8px",Br.style.fontWeight="bold",mn.appendChild(Br),Yc(Br);let As=document.createElement("div");mn.appendChild(As),Kc(As),B.appendChild(mn),ao(),M.appendChild(Y),M.appendChild(D),M.appendChild(z),M.appendChild(B),X(p==="drive"?"google":p),N.appendChild(M),document.body.appendChild(N),requestAnimationFrame(()=>{let re=N.getBoundingClientRect(),Yt=(window.innerHeight-re.height)/2;N.style.top=`${Math.max(20,Yt)}px`,N.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",kt,!0),document.addEventListener("keydown",st)},0)},st=function(p){if(p.key==="Escape"&&N&&N.parentNode===document.body){let g=document.getElementById("ytls-save-modal"),b=document.getElementById("ytls-load-modal"),k=document.getElementById("ytls-delete-all-modal");if(g||b||k)return;p.preventDefault(),g&&document.body.contains(g)&&document.body.removeChild(g),b&&document.body.contains(b)&&document.body.removeChild(b),k&&document.body.contains(k)&&document.body.removeChild(k),N.classList.remove("ytls-fade-in"),N.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(N)&&document.body.removeChild(N),N=null,document.removeEventListener("click",kt,!0),document.removeEventListener("keydown",st)},300)}},kt=function(p){if(Qo&&Qo.contains(p.target))return;let g=document.getElementById("ytls-save-modal"),b=document.getElementById("ytls-load-modal"),k=document.getElementById("ytls-delete-all-modal");g&&g.contains(p.target)||b&&b.contains(p.target)||k&&k.contains(p.target)||N&&N.contains(p.target)||(g&&document.body.contains(g)&&document.body.removeChild(g),b&&document.body.contains(b)&&document.body.removeChild(b),k&&document.body.contains(k)&&document.body.removeChild(k),N&&N.parentNode===document.body&&(N.classList.remove("ytls-fade-in"),N.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(N)&&document.body.removeChild(N),N=null,document.removeEventListener("click",kt,!0),document.removeEventListener("keydown",st)},300)))},Eo=function(){r&&(c("Loading window position from IndexedDB"),bi("windowPosition").then(p=>{let g=Is.safeParse(p);if(g.success){let k=g.data;r.style.left=`${k.x}px`,r.style.top=`${k.y}px`,r.style.right="auto",r.style.bottom="auto",typeof k.width=="number"&&k.width>0?r.style.width=`${k.width}px`:(r.style.width=`${di}px`,c(`No stored window width found, using default width ${di}px`)),typeof k.height=="number"&&k.height>0?r.style.height=`${k.height}px`:(r.style.height=`${pi}px`,c(`No stored window height found, using default height ${pi}px`));let M=ae();Te(M,k.x,k.y),c("Restored window position from IndexedDB:",F())}else g.success?c("No window position found in IndexedDB, applying default size and leaving default position"):c("Window position in IndexedDB failed validation:",g.error.message,"warn"),r.style.width=`${di}px`,r.style.height=`${pi}px`,P(null);Vn();let b=ae();b&&(b.width||b.height)&&Te(b),Ne?.()}).catch(p=>{c("failed to load pane position from IndexedDB:",p,"warn"),Vn();let g=ae();g&&(g.width||g.height)&&P({x:Math.max(0,Math.round(g.left)),y:0,width:Math.round(g.width),height:Math.round(g.height)}),Ne?.()}))},Mo=function(){if(!r)return;let p=ae();if(!p)return;let g={x:Math.max(0,Math.round(p.left)),y:Math.max(0,Math.round(p.top)),width:Math.round(p.width),height:Math.round(p.height)},b=F();if(b&&b.x===g.x&&b.y===g.y&&b.width===g.width&&b.height===g.height){c("Skipping window position save; position and size unchanged");return}P({...g}),c(`Saving window position and size to IndexedDB: x=${g.x}, y=${g.y}, width=${g.width}, height=${g.height}`),vr("windowPosition",g),En({type:"window_position_updated",position:g,timestamp:Date.now()})},kr=function(p,g){p.addEventListener("dblclick",b=>{b.preventDefault(),b.stopPropagation(),r&&(r.style.width="300px",r.style.height="300px",Mo(),Mr())}),p.addEventListener("mousedown",b=>{b.preventDefault(),b.stopPropagation(),Dt=!0,un=g,fs=b.clientX,hs=b.clientY;let k=r.getBoundingClientRect();$n=k.width,Wn=k.height,xr=k.left,Tr=k.top,gs=document.documentElement.clientWidth,vs=document.documentElement.clientHeight,g==="top-left"||g==="bottom-right"?document.body.style.cursor="nwse-resize":document.body.style.cursor="nesw-resize"})},ws=function(){if(!s||!on)return;let{scrollTop:p,scrollHeight:g,clientHeight:b}=s;if(g<=b)return;let k=Math.max(30,b/g*b),M=p/(g-b)*(b-k);on.style.height=`${k}px`,on.style.top=`${M}px`},bs=function(){Xe&&(ki===null&&(ki=requestAnimationFrame(()=>{ki=null,ws()})),Xe.classList.add("ytls-scrollbar-visible"),wt&&clearTimeout(wt),wt=setTimeout(()=>{Xe?.classList.remove("ytls-scrollbar-visible"),wt=null},500))},Mr=function(){if(r&&l&&f&&s){let p=r.getBoundingClientRect(),g=l.getBoundingClientRect(),b=f.getBoundingClientRect(),k=p.height-(g.height+b.height);s.style.maxHeight=k>0?k+"px":"0px",s.style.overflowY=k>0?"auto":"hidden"}};if(document.querySelectorAll("#ytls-pane").forEach(p=>p.remove()),!document.getElementById("ytls-styles")){let p=document.createElement("style");p.id="ytls-styles",p.textContent=hl,document.head.appendChild(p)}r=document.createElement("div"),l=document.createElement("div"),s=document.createElement("ul"),f=document.createElement("div"),m=document.createElement("span"),O=document.createElement("span"),G=document.createElement("span"),G.classList.add("ytls-backup-indicator"),G.style.cursor="pointer",G.style.backgroundColor="#666",G.onclick=p=>{p.stopPropagation(),He(jo()?"sync":"drive")},s.addEventListener("mouseenter",()=>{Mn=!0,yo=!1}),s.addEventListener("mouseleave",()=>{Mn=!1;try{Ci()}catch{}if(yo)return;xt(!1);let p=null;if(document.activeElement instanceof HTMLInputElement&&s.contains(document.activeElement)&&(p=document.activeElement.closest("li")?.dataset.guid??null),ns(),p){let b=Re().find(k=>k.dataset.guid===p)?.querySelector("input");if(b)try{b.focus({preventScroll:!0})}catch{}}}),r.id="ytls-pane",l.id="ytls-pane-header",l.addEventListener("dblclick",p=>{let g=p.target instanceof Element?p.target:null;if(g){let b=g;for(;b&&b!==r;){if(window.getComputedStyle(b).cursor==="pointer")return;b=b.parentElement}}p.preventDefault(),Si(!1)});let i=p=>{try{p.stopPropagation()}catch{}};["click","dblclick","mousedown","pointerdown","touchstart","wheel"].forEach(p=>{r.addEventListener(p,i)}),r.addEventListener("keydown",p=>{try{p.stopPropagation()}catch{}}),r.addEventListener("keyup",p=>{try{p.stopPropagation()}catch{}}),r.addEventListener("focus",p=>{try{p.stopPropagation()}catch{}},!0),r.addEventListener("blur",p=>{try{p.stopPropagation()}catch{}},!0),O.textContent=`v${Dr}`,O.classList.add("ytls-version-display");let u=document.createElement("span");u.style.display="inline-flex",u.style.alignItems="center",u.style.gap="6px",u.appendChild(O),u.appendChild(G),y=document.createElement("span"),y.id="ytls-members-badge",y.appendChild(Rn("star",14)),ze(y,"Members-only stream"),ms(),m.id="ytls-current-time",m.textContent="\u2014",m.style.cursor="default",ze(m,()=>{let p=K(),{isLive:g}=p?p.getVideoData()||{isLive:!1}:{isLive:!1};return g?"Skip to live":""}),v=document.createElement("span"),v.id="ytls-playback-speed",v.textContent="1x",v.style.cursor="pointer",v.style.userSelect="none",ze(v,()=>`Current playback speed. Click to toggle between 1x and ${Ft(E)}x.`),v.onclick=()=>{Ha()},v.addEventListener("mousedown",p=>{p.stopPropagation()}),v.addEventListener("click",p=>{p.stopPropagation()}),m.onclick=()=>{let p=K();if(!p)return;let{isLive:g}=p.getVideoData()||{isLive:!1};g&&(Pt=!0,p.seekToLiveHead(),setTimeout(()=>{Pt=!1},500))};let w=p=>{m.style.cursor=p?"pointer":"default"};A(),Me&&clearInterval(Me),Me=setInterval(A,1e3),f.id="ytls-buttons";let T=(p,g)=>()=>{p.classList.remove("ytls-fade-in"),p.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(p)&&document.body.removeChild(p),g&&g()},300)},x=p=>g=>{g.key==="Escape"&&(g.preventDefault(),g.stopPropagation(),p())},L=p=>{setTimeout(()=>{document.addEventListener("keydown",p)},0)},C=(p,g)=>b=>{p.contains(b.target)||g()},R=p=>{setTimeout(()=>{document.addEventListener("click",p,!0)},0)};[{id:"add",icon:"alarm-plus",title:"Add timestamp",action:()=>{if(Tt())return;let p=typeof Fn<"u"?Fn:0,g=K(),b=g?Math.floor(g.getCurrentTime()+p):0;if(!Number.isFinite(b))return;let k=To(b,"");k&&k.focus()}},{id:"settings",icon:"settings",title:"Settings",action:()=>He()},{id:"copy",icon:"clipboard",title:"Copy timestamps to clipboard",action:function(p){if(Tt()){Fe(this,"circle-x",20),setTimeout(()=>{Fe(this,"clipboard",20)},2e3);return}let g=hi();if(g.length===0){Fe(this,"circle-x",20),setTimeout(()=>{Fe(this,"clipboard",20)},2e3);return}let b=p.ctrlKey,k=Li(g,b);navigator.clipboard.writeText(k).then(()=>{Fe(this,"circle-check",20),setTimeout(()=>{Fe(this,"clipboard",20)},2e3)}).catch(M=>{c("Failed to copy timestamps: ",M,"error"),Fe(this,"circle-x",20),setTimeout(()=>{Fe(this,"clipboard",20)},2e3)})}},{id:"offset",icon:"clock-plus",title:"Offset all timestamps",action:()=>{if(Tt())return;if(Re().length===0){alert("No timestamps available to offset.");return}let g=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(g===null)return;let b=g.trim();if(b.length===0)return;let k=Number.parseInt(b,10);if(!Number.isFinite(k)){alert("Please enter a valid integer number of seconds.");return}k!==0&&es(k,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{id:"delete",icon:"trash",title:"Delete all timestamps for current video",action:async()=>{let p=Ao();if(!p){alert("Unable to determine current video ID.");return}let g=document.createElement("div");g.id="ytls-delete-all-modal",g.classList.remove("ytls-fade-out"),g.classList.add("ytls-fade-in");let b=document.createElement("p");b.textContent="Hold the button to delete all timestamps for:",b.style.marginBottom="10px";let k=document.createElement("p");k.textContent=p,k.style.fontFamily="monospace",k.style.fontSize="12px",k.style.marginBottom="15px",k.style.color="#aaa";let M=document.createElement("button");M.classList.add("ytls-save-modal-button"),M.style.background="#d32f2f",M.style.position="relative",M.style.overflow="hidden";let Y=null,D=0,z=null,B=document.createElement("div");B.style.position="absolute",B.style.left="0",B.style.top="0",B.style.height="100%",B.style.width="0%",B.style.background="#ff6b6b",B.style.transition="none",B.style.pointerEvents="none",M.appendChild(B);let X=document.createElement("span");X.textContent="Hold to Delete All",X.style.position="relative",X.style.zIndex="1",M.appendChild(X);let me=()=>{if(!D)return;let $t=Date.now()-D,Io=Math.min($t/5e3*100,100);B.style.width=`${Io}%`,Io<100&&(z=requestAnimationFrame(me))},Ce=()=>{Y&&(clearTimeout(Y),Y=null),z&&(cancelAnimationFrame(z),z=null),D=0,B.style.width="0%",X.textContent="Hold to Delete All"};M.onmousedown=()=>{D=Date.now(),X.textContent="Deleting...",z=requestAnimationFrame(me),Y=setTimeout(async()=>{Ce(),g.classList.remove("ytls-fade-in"),g.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(g)&&document.body.removeChild(g);try{await ss(p),xi()}catch($t){c("Failed to delete all timestamps:",$t,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},M.onmouseup=Ce,M.onmouseleave=Ce;let Je=null,dn=null,At=T(g,()=>{Ce(),Je&&document.removeEventListener("keydown",Je),dn&&document.removeEventListener("click",dn,!0)});Je=x(At),dn=C(g,At);let pn=document.createElement("button");pn.textContent="Cancel",pn.classList.add("ytls-save-modal-cancel-button"),pn.onclick=At,g.appendChild(b),g.appendChild(k),g.appendChild(M),g.appendChild(pn),document.body.appendChild(g),L(Je),R(dn)}}].forEach(p=>{let g=document.createElement("button");Fe(g,p.icon,20),ze(g,p.title),g.classList.add("ytls-main-button"),p.id==="copy"?g.onclick=function(b){p.action.call(this,b)}:g.onclick=p.action,p.id==="settings"&&(Qo=g),f.appendChild(g)});let Rt=document.createElement("button");W(Rt,"device-floppy","Save"),Rt.classList.add("ytls-file-operation-button"),Rt.onclick=()=>{let p=document.createElement("div");p.id="ytls-save-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let g=document.createElement("p");g.textContent="Save as:";let b=null,k=null,M=T(p,()=>{b&&document.removeEventListener("keydown",b),k&&document.removeEventListener("click",k,!0)});b=x(M),k=C(p,M);let Y=document.createElement("button");Y.textContent="JSON",Y.classList.add("ytls-save-modal-button"),Y.onclick=()=>{b&&document.removeEventListener("keydown",b),k&&document.removeEventListener("click",k,!0),T(p,()=>is("json"))()};let D=document.createElement("button");D.textContent="Plain Text",D.classList.add("ytls-save-modal-button"),D.onclick=()=>{b&&document.removeEventListener("keydown",b),k&&document.removeEventListener("click",k,!0),T(p,()=>is("text"))()};let z=document.createElement("button");z.textContent="Cancel",z.classList.add("ytls-save-modal-cancel-button"),z.onclick=M,p.appendChild(g),p.appendChild(Y),p.appendChild(D),p.appendChild(z),document.body.appendChild(p),L(b),R(k)};let qn=document.createElement("button");W(qn,"folder-open","Load"),qn.classList.add("ytls-file-operation-button"),qn.onclick=()=>{let p=document.createElement("div");p.id="ytls-load-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let g=document.createElement("p");g.textContent="Load from:";let b=null,k=null,M=T(p,()=>{b&&document.removeEventListener("keydown",b),k&&document.removeEventListener("click",k,!0)});b=x(M),k=C(p,M);let Y=document.createElement("button");Y.textContent="File",Y.classList.add("ytls-save-modal-button"),Y.onclick=()=>{let B=document.createElement("input");B.type="file",B.accept=".json,.txt",B.classList.add("ytls-hidden-file-input"),B.onchange=X=>{let me=X.target.files?.[0];if(!me)return;b&&document.removeEventListener("keydown",b),k&&document.removeEventListener("click",k,!0),M();let Ce=new FileReader;Ce.onload=()=>{let Je=String(Ce.result).trim();cs(Je)},Ce.readAsText(me)},B.click()};let D=document.createElement("button");D.textContent="Clipboard",D.classList.add("ytls-save-modal-button"),D.onclick=async()=>{b&&document.removeEventListener("keydown",b),k&&document.removeEventListener("click",k,!0),T(p,async()=>{try{let B=await navigator.clipboard.readText();B?cs(B.trim()):alert("Clipboard is empty.")}catch(B){c("Failed to read from clipboard: ",B,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let z=document.createElement("button");z.textContent="Cancel",z.classList.add("ytls-save-modal-cancel-button"),z.onclick=M,p.appendChild(g),p.appendChild(Y),p.appendChild(D),p.appendChild(z),document.body.appendChild(p),L(b),R(k)};let cn=document.createElement("button");W(cn,"file-export","Export"),cn.classList.add("ytls-file-operation-button"),cn.onclick=async()=>{try{await yd()}catch{alert("Failed to export data: Could not read from database.")}};let jn=document.createElement("button");W(jn,"file-import","Import"),jn.classList.add("ytls-file-operation-button"),jn.onclick=()=>{let p=document.createElement("input");p.type="file",p.accept=".json",p.classList.add("ytls-hidden-file-input"),p.onchange=g=>{let b=g.target.files?.[0];if(!b)return;let k=new FileReader;k.onload=()=>{try{let M=JSON.parse(String(k.result)),Y=[];for(let D in M)if(Object.prototype.hasOwnProperty.call(M,D)&&D.startsWith("ytls-")){let z=D.substring(5),B=M[D];if(B&&typeof B.video_id=="string"&&Array.isArray(B.timestamps)){let X=B.timestamps.map(Ce=>({...Ce,guid:Ce.guid||crypto.randomUUID()})),me=dd(z,X).then(()=>c(`Imported ${z} to IndexedDB`)).catch(Ce=>c(`Failed to import ${z} to IndexedDB:`,Ce,"error"));Y.push(me)}else c(`Skipping key ${D} during import due to unexpected data format.`,"warn")}Promise.all(Y).then(()=>{xi()}).catch(D=>{alert("An error occurred during import to IndexedDB. Check console for details."),c("Overall import error:",D,"error")})}catch(M){alert(`Failed to import data. Please ensure the file is in the correct format.
`+M.message),c("Import error:",M,"error")}},k.readAsText(b)},p.click()},s.onclick=p=>{ts(p)},s.ontouchstart=p=>{ts(p)},r.style.position="fixed",r.style.bottom="0",r.style.right="0",r.style.transition="none",Eo(),setTimeout(()=>Vn(),10);let jt=!1,yr=0,wr=0,br=0,Pn=0,Sr=0,V=0,H=null,de=!1;r.addEventListener("mousedown",p=>{let g=p.target;if(!(g instanceof Element)||g instanceof HTMLInputElement||g instanceof HTMLTextAreaElement||g instanceof Element&&(g.closest("#ytls-playback-speed-group")||g.closest("#ytls-playback-speed"))||g!==l&&!l.contains(g)&&window.getComputedStyle(g).cursor==="pointer")return;jt=!0,de=!1;let b=r.getBoundingClientRect();yr=p.clientX-b.left,wr=p.clientY-b.top,br=b.width,Pn=b.height,Sr=document.documentElement.clientWidth,V=document.documentElement.clientHeight,r.style.transition="none"}),document.addEventListener("mousemove",er=p=>{if(!jt)return;de=!0;let g=p.clientX,b=p.clientY;H===null&&(H=requestAnimationFrame(()=>{if(H=null,!jt)return;let k=Math.max(0,Math.min(g-yr,Sr-br)),M=Math.max(0,Math.min(b-wr,V-Pn));r.style.left=`${k}px`,r.style.top=`${M}px`,r.style.right="auto",r.style.bottom="auto"}))}),document.addEventListener("mouseup",tr=()=>{if(!jt)return;jt=!1,H!==null&&(cancelAnimationFrame(H),H=null);let p=de;setTimeout(()=>{de=!1},50),Vn(),setTimeout(()=>{p&&Mo()},200)}),r.addEventListener("dragstart",p=>p.preventDefault());let Z=document.createElement("div"),ge=document.createElement("div"),je=document.createElement("div"),pt=document.createElement("div");Z.id="ytls-resize-tl",ge.id="ytls-resize-tr",je.id="ytls-resize-bl",pt.id="ytls-resize-br";let Dt=!1,fs=0,hs=0,$n=0,Wn=0,xr=0,Tr=0,gs=0,vs=0,Yn=null,un=null;kr(Z,"top-left"),kr(ge,"top-right"),kr(je,"bottom-left"),kr(pt,"bottom-right"),document.addEventListener("mousemove",p=>{if(!Dt||!r||!un)return;let g=p.clientX,b=p.clientY;Yn===null&&(Yn=requestAnimationFrame(()=>{if(Yn=null,!Dt||!r||!un)return;let k=g-fs,M=b-hs,Y=gs,D=vs,z=$n,B=Wn,X=xr,me=Tr;un==="bottom-right"?(z=Math.max(200,Math.min(800,$n+k)),B=Math.max(250,Math.min(D,Wn+M))):un==="top-left"?(z=Math.max(200,Math.min(800,$n-k)),X=xr+k,B=Math.max(250,Math.min(D,Wn-M)),me=Tr+M):un==="top-right"?(z=Math.max(200,Math.min(800,$n+k)),B=Math.max(250,Math.min(D,Wn-M)),me=Tr+M):un==="bottom-left"&&(z=Math.max(200,Math.min(800,$n-k)),X=xr+k,B=Math.max(250,Math.min(D,Wn+M))),X=Math.max(0,Math.min(X,Y-z)),me=Math.max(0,Math.min(me,D-B)),r.style.width=`${z}px`,r.style.height=`${B}px`,r.style.left=`${X}px`,r.style.top=`${me}px`,r.style.right="auto",r.style.bottom="auto"}))}),document.addEventListener("mouseup",()=>{Dt&&(Dt=!1,Yn!==null&&(cancelAnimationFrame(Yn),Yn=null),un=null,document.body.style.cursor="",Ke(!0))});let Ar=null;window.addEventListener("resize",nr=()=>{Ar&&clearTimeout(Ar),Ar=setTimeout(()=>{Ke(!0),Ne?.(),Ar=null},200)}),l.appendChild(y),l.appendChild(m);let Kn=document.createElement("span");Kn.id="ytls-playback-speed-group",Kn.style.display="inline-flex",Kn.style.alignItems="center",Kn.style.marginLeft="4px",v&&Kn.appendChild(v),l.appendChild(Kn),l.appendChild(u);let Ti=document.createElement("div");Ti.id="ytls-list-wrapper",Xe=document.createElement("div"),Xe.className="ytls-scrollbar-track",on=document.createElement("div"),on.className="ytls-scrollbar-thumb",Xe.append(on),Ti.append(s,Xe);let Er=document.createElement("div");Er.id="ytls-content",Er.append(Ti),Er.append(f),r.append(l,Er,Z,ge,je,pt);let ys="";r.addEventListener("mousemove",p=>{if(jt||Dt)return;let g=r.getBoundingClientRect(),b=20,k=p.clientX,M=p.clientY,Y=k-g.left<=b,D=g.right-k<=b,z=M-g.top<=b,B=g.bottom-M<=b,X="";z&&Y||B&&D?X="nwse-resize":(z&&D||B&&Y)&&(X="nesw-resize"),X!==ys&&(ys=X,document.body.style.cursor=X)});let ki=null;if(Xe.addEventListener("mouseenter",()=>{wt&&(clearTimeout(wt),wt=null),Xe.classList.add("ytls-scrollbar-visible")}),Xe.addEventListener("mouseleave",()=>{mi||(wt=setTimeout(()=>{Xe?.classList.remove("ytls-scrollbar-visible"),wt=null},500))}),on.addEventListener("mousedown",p=>{if(!s)return;p.preventDefault(),p.stopPropagation(),mi=!0;let g=p.clientY,b=s.scrollTop,{scrollHeight:k,clientHeight:M}=s,Y=Math.max(30,M/k*M),D=k-M,z=M-Y;function B(me){if(!s)return;let Ce=me.clientY-g;s.scrollTop=Math.max(0,Math.min(D,b+Ce*(D/z))),ws()}function X(){mi=!1,document.removeEventListener("mousemove",B),document.removeEventListener("mouseup",X),Xe?.matches(":hover")||(wt=setTimeout(()=>{Xe?.classList.remove("ytls-scrollbar-visible"),wt=null},500))}document.addEventListener("mousemove",B),document.addEventListener("mouseup",X)}),r.addEventListener("mouseenter",()=>{Mn=!0,bs()}),s.addEventListener("scroll",bs),r.addEventListener("mouseleave",()=>{!Dt&&!jt&&(document.body.style.cursor=""),Mn=!1;try{Ci()}catch{}try{xt(!1)}catch{}}),Ne=Mr,setTimeout(()=>{if(Mr(),r&&l&&f&&s){let p=40,g=Re();if(g.length>0)p=g[0].offsetHeight;else{let b=document.createElement("li");b.style.visibility="hidden",b.style.position="absolute",b.textContent="00:00 Example",s.appendChild(b),p=b.offsetHeight,s.removeChild(b)}$(l.offsetHeight+f.offsetHeight+p),r.style.minHeight=_()+"px"}},0),St){try{St.disconnect()}catch{}St=null}St=new ResizeObserver(Mr),St.observe(r),go||document.addEventListener("pointerdown",go=()=>{qa=Date.now()},!0),vo||document.addEventListener("pointerup",vo=()=>{},!0)}finally{fi=!1}}}async function xd(){if(!r)return;if(document.querySelectorAll("#ytls-pane").forEach(d=>{d!==r&&(c("Removing duplicate pane element from DOM"),d.remove())}),document.body.contains(r)){c("Pane already in DOM, skipping append");return}await bd(),Iu(gd),Lu(vd),Ba(vr),Pa(bi),Cu(gr),Au(G),tu(()=>li()),await Ra(),await Fu(),await kn(),li();let u=document.querySelectorAll("#ytls-pane");if(u.length>0&&(c(`WARNING: Found ${u.length} existing pane(s) in DOM, removing all`),u.forEach(d=>d.remove())),document.body.contains(r)){c("ERROR: Pane already in body, aborting append");return}if(document.body.appendChild(r),c("Pane successfully appended to DOM"),_e(),Le&&(clearTimeout(Le),Le=null),Le=setTimeout(()=>{Lt(),Ne?.(),De(),Ke(!0),Le=null},450),bt){try{bt.disconnect()}catch{}bt=null}bt=new MutationObserver(()=>{let d=document.querySelectorAll("#ytls-pane");d.length>1&&(c(`CRITICAL: Multiple panes detected (${d.length}), removing duplicates`),d.forEach((w,S)=>{(S>0||r&&w!==r)&&w.remove()}))}),bt.observe(document.body,{childList:!0})}function us(i=0){if(document.getElementById("ytls-header-button")){qt();return}let u=document.querySelector("#logo");if(!u||!u.parentElement){i<10&&setTimeout(()=>us(i+1),300);return}let d=document.createElement("button");d.id="ytls-header-button",d.type="button",d.className="ytls-header-button",ze(d,"Toggle Timekeeper UI"),d.setAttribute("aria-label","Toggle Timekeeper UI");let w=document.createElement("img");w.src=Nr,w.alt="",w.decoding="async",d.appendChild(w),rn=w,d.addEventListener("mouseenter",()=>{rn&&(Zo=!0,rn.src=gl)}),d.addEventListener("mouseleave",()=>{rn&&(Zo=!1,qt())}),d.addEventListener("click",()=>{r&&!document.body.contains(r)&&(c("Pane not in DOM, re-appending before toggle"),document.body.appendChild(r)),Si()}),u.insertAdjacentElement("afterend",d),qt(),c("Timekeeper header button added next to YouTube logo")}function ds(){if(ye())return;pe(!0);let i=history.pushState,u=history.replaceState;function d(){try{let w=new Event("locationchange");window.dispatchEvent(w)}catch{}}history.pushState=function(){let w=i.apply(this,arguments);return d(),w},history.replaceState=function(){let w=u.apply(this,arguments);return d(),w},window.addEventListener("popstate",d),window.addEventListener("locationchange",()=>{window.location.href!==ee&&c("Location changed (locationchange event) \u2014 deferring UI update until navigation finish")})}async function xi(){if(!a()){sd();return}se(window.location.href),document.querySelectorAll("#ytls-pane").forEach((u,d)=>{(d>0||r&&u!==r)&&u.remove()}),await ue(),await Sd(),Ie=Ao(),h?.videoId!==Ie&&ps(null);let i=document.title;c("Page Title:",i),c("Video ID:",Ie),c("Current URL:",window.location.href),vi(!0),So(),qe(),await gr(),qe(),vi(!1),c("Timestamps loaded and UI unlocked for video:",Ie),await xd();try{xt(!0)}catch{}us(),ud()}ds(),window.addEventListener("yt-navigate-start",()=>{c("Navigation started (yt-navigate-start event fired)"),fr(),a()&&r&&s&&(c("Locking UI and showing loading state for navigation"),vi(!0))}),ho=i=>{if(!i.repeat&&!i.ctrlKey&&!i.altKey&&!i.metaKey&&!i.shiftKey&&(i.key==="z"||i.key==="Z")){if($u(i.target))return;Ha()&&(i.preventDefault(),c("Playback speed toggled via keyboard shortcut (Z)"));return}i.ctrlKey&&i.altKey&&i.shiftKey&&(i.key==="T"||i.key==="t")&&(i.preventDefault(),Si(),c("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",ho),window.addEventListener("pagehide",fr),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&fr()});function ps(i){let u=typeof unsafeWindow<"u"?unsafeWindow:window,d=mc(i?.response??u.ytInitialData,i?.playerResponse??u.ytInitialPlayerResponse);h=d,ms(),d&&uu(d)}function ms(){if(!y)return;let i=null;try{i=Ao()}catch{}let u=!!h?.membersOnly&&h.videoId===i;y.style.display=u?"inline-flex":"none"}window.addEventListener("yt-navigate-finish",i=>{c("Navigation finished (yt-navigate-finish event fired)"),ps(i.detail?.response),window.location.href!==ee?xi():c("Navigation finished but URL already handled, skipping.")});function Td(i){let u=/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(i);if(u&&(u[1]||u[2]||u[3]))return Number(u[1]||0)*3600+Number(u[2]||0)*60+Number(u[3]||0);let d=Number(i);return Number.isFinite(d)?d:null}document.addEventListener("click",i=>{if(i.button!==0||i.ctrlKey||i.metaKey||i.shiftKey||i.altKey)return;let u=i.target?.closest?.("ytd-comments a[href]");if(!u)return;let d=new URL(u.href,location.href),w=d.searchParams.get("t");if(d.pathname!=="/watch"||!w||d.searchParams.get("v")!==Ao())return;let S=Td(w),A=K();S===null||!A||(i.preventDefault(),i.stopImmediatePropagation(),A.seekTo(S))},!0),Wc(i=>{for(let u of i)En({type:"timestamps_updated",videoId:u,action:"synced"});Ie&&i.includes(Ie)&&gr()}),yu(),ds(),c("Timekeeper initialized and waiting for navigation events")})();})();

