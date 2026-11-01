// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      5.3.8.715
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

(()=>{var vd=Object.defineProperty;var yd=(e,t)=>{for(var n in t)vd(e,n,{get:t[n],enumerable:!0})};var Io=class extends Error{},Ze=(e,t)=>{throw new Io(`${e||"value"}: expected ${t}`)};function Et(e){let t={run:e,parse:n=>e(n,""),safeParse:n=>{try{return{success:!0,data:e(n,"")}}catch(o){if(o instanceof Io)return{success:!1,error:o};throw o}},array:()=>wd(t)};return t}var Ts=e=>typeof e=="object"&&e!==null&&!Array.isArray(e);function Y(){return Et((e,t)=>typeof e=="string"?e:Ze(t,"string"))}function _t(){return Et((e,t)=>typeof e=="boolean"?e:Ze(t,"boolean"))}function Ce(e={}){return Et((t,n)=>typeof t!="number"||Number.isNaN(t)?Ze(n,"number"):(e.finite&&!Number.isFinite(t)&&Ze(n,"finite number"),e.int&&!Number.isInteger(t)&&Ze(n,"integer"),e.nonnegative&&t<0&&Ze(n,"number >= 0"),e.positive&&t<=0&&Ze(n,"number > 0"),e.min!==void 0&&t<e.min&&Ze(n,`number >= ${e.min}`),e.max!==void 0&&t>e.max&&Ze(n,`number <= ${e.max}`),t))}function Se(e){return Et((t,n)=>t===void 0?void 0:e.run(t,n))}function et(e){return Et((t,n)=>t===null?null:e.run(t,n))}function Qe(e,t){return Et((n,o)=>{try{return e.run(n,o)}catch(a){if(a instanceof Io)return t;throw a}})}function wd(e){return Et((t,n)=>Array.isArray(t)?t.map((o,a)=>e.run(o,`${n}[${a}]`)):Ze(n,"array"))}function bd(e){return Et((t,n)=>{if(!Ts(t))return Ze(n,"object");let o={};for(let a of Object.keys(t))o[a]=e.run(t[a],n?`${n}.${a}`:a);return o})}function xe(e){let t=Et((n,o)=>{if(!Ts(n))return Ze(o,"object");let a={};for(let r of Object.keys(e)){let c=e[r].run(n[r],o?`${o}.${r}`:r);c!==void 0&&(a[r]=c)}return a});return Object.assign(t,{extend:n=>xe({...e,...n}),partial:()=>{let n={};for(let o of Object.keys(e))n[o]=Se(e[o]);return xe(n)}})}var Sd=Et((e,t)=>typeof e=="string"&&e.length>0?e:Ze(t,"non-empty string")),Cr=xe({guid:Sd,start:Ce({finite:!0,nonnegative:!0}),comment:Y(),write_counter:Se(Ce({int:!0,positive:!0})),deleted_at:Qe(Se(Ce()),void 0)}),Lo=Cr.array(),hn=Cr.extend({video_id:Y(),device_id:Se(Y())}),ks=xe({x:Ce({finite:!0}),y:Ce({finite:!0}),width:Se(Ce({finite:!0,positive:!0})),height:Se(Ce({finite:!0,positive:!0}))}),Rr=xe({video_id:Y(),timestamps:Lo}),As=bd(Rr),xs=xe({isSignedIn:Qe(_t(),!1),accessToken:Qe(et(Y()),null),userName:Qe(et(Y()),null),email:Qe(et(Y()),null)}),Ei=Qe(Et((e,t)=>{if(typeof e=="string"){let n;try{n=JSON.parse(e)}catch{return Ze(t,"valid JSON string for auth state")}return xs.run(n,t)}return xs.run(e,t)}),{isSignedIn:!1,accessToken:null,userName:null,email:null}),Kn={isSignedIn:!1,accessToken:null,accessTokenExpiresAt:null,refreshToken:null,userId:null,userName:null,email:null},Mi=Qe(xe({isSignedIn:Qe(_t(),!1),accessToken:Qe(et(Y()),null),accessTokenExpiresAt:Qe(et(Ce({finite:!0})),null),refreshToken:Qe(et(Y()),null),userId:Qe(et(Y()),null),userName:Qe(et(Y()),null),email:Qe(et(Y()),null)}),Kn),xd=xe({autoBackupEnabled:_t(),autoBackupIntervalMinutes:Ce({int:!0,min:5,max:1440}),lastAutoBackupAt:Se(et(Ce({int:!0,positive:!0})))}),Ii=xd;var Es=`<svg
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
</svg>`;var Ms=`<svg
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
</svg>`;var Is=`<svg
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
</svg>`;var Ls=`<svg
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-minus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M9 12l6 0" />
</svg>`;var Cs=`<svg
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-clipboard"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
  <path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-settings"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065" />
  <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-clock-plus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20.984 12.535a9 9 0 1 0 -8.468 8.45" />
  <path d="M16 19h6" />
  <path d="M19 16v6" />
  <path d="M12 7v5l3 3" />
</svg>`;var _s=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="currentColor"
  class="icon icon-tabler icons-tabler-filled icon-tabler-current-location"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 1a1 1 0 0 1 1 1v1.055a9.004 9.004 0 0 1 7.946 7.945h1.054a1 1 0 0 1 0 2h-1.055a9.004 9.004 0 0 1 -7.944 7.945l-.001 1.055a1 1 0 0 1 -2 0v-1.055a9.004 9.004 0 0 1 -7.945 -7.944l-1.055 -.001a1 1 0 0 1 0 -2h1.055a9.004 9.004 0 0 1 7.945 -7.945v-1.055a1 1 0 0 1 1 -1m0 4a7 7 0 1 0 0 14a7 7 0 0 0 0 -14m0 3a4 4 0 1 1 -4 4l.005 -.2a4 4 0 0 1 3.995 -3.8" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-player-record"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 12a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-x"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M10 10l4 4m0 -4l-4 4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-check"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M9 12l2 2l4 -4" />
</svg>`;var zs=`<svg
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-cloud"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M6.657 18c-2.572 0 -4.657 -2.007 -4.657 -4.483c0 -2.475 2.085 -4.482 4.657 -4.482c.393 -1.762 1.794 -3.2 3.675 -3.773c1.88 -.572 3.956 -.193 5.444 1c1.488 1.19 2.162 3.007 1.77 4.769h.99c1.913 0 3.464 1.56 3.464 3.486c0 1.927 -1.551 3.487 -3.465 3.487h-11.878" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-device-floppy"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
  <path d="M10 14a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M14 4l0 4l-6 0l0 -4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-folder-open"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-export"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v5m-5 6h7m-3 -3l3 3l-3 3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-import"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M5 13v-8a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5.5m-9.5 -2h7m-3 -3l3 3l-3 3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-spreadsheet"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
  <path d="M8 11h8v7h-8l0 -7" />
  <path d="M8 15h8" />
  <path d="M11 11v7" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-login"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
  <path d="M21 12h-13l3 -3" />
  <path d="M11 15l-3 -3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-logout"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
  <path d="M9 12h12l-3 -3" />
  <path d="M18 15l3 -3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-refresh"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
  <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-star"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-alert-triangle"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 9v4" />
  <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0" />
  <path d="M12 16h.01" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-database"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M4 6a8 3 0 1 0 16 0a8 3 0 1 0 -16 0" />
  <path d="M4 6v6a8 3 0 0 0 16 0v-6" />
  <path d="M4 12v6a8 3 0 0 0 16 0v-6" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-server"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 7a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-2" />
  <path d="M3 15a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -2" />
  <path d="M7 8l0 .01" />
  <path d="M7 16l0 .01" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-world"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
  <path d="M3.6 9h16.8" />
  <path d="M3.6 15h16.8" />
  <path d="M11.5 3a17 17 0 0 0 0 18" />
  <path d="M12.5 3a17 17 0 0 1 0 18" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-plug-connected"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M7 12l5 5l-1.5 1.5a3.536 3.536 0 1 1 -5 -5l1.5 -1.5" />
  <path d="M17 12l-5 -5l1.5 -1.5a3.536 3.536 0 1 1 5 5l-1.5 1.5" />
  <path d="M3 21l2.5 -2.5" />
  <path d="M18.5 5.5l2.5 -2.5" />
  <path d="M10 11l-2 2" />
  <path d="M13 14l-2 2" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-key"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0" />
  <path d="M15 9h.01" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-x"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M18 6l-12 12" />
  <path d="M6 6l12 12" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-indent-increase"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 6l-11 0" />
  <path d="M20 12l-7 0" />
  <path d="M20 18l-11 0" />
  <path d="M4 8l4 4l-4 4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-indent-decrease"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 6l-7 0" />
  <path d="M20 12l-9 0" />
  <path d="M20 18l-7 0" />
  <path d="M8 8l-4 4l4 4" />
</svg>`;var np={plus:Es,"alarm-plus":Ms,minus:Is,"circle-plus":Ls,"circle-minus":Bs,trash:Cs,clipboard:Rs,settings:Ds,"clock-plus":Ps,"current-location":_s,"player-record":Os,"circle-x":Ns,"circle-check":Hs,"adjustments-horizontal":zs,cloud:Gs,"device-floppy":Us,"folder-open":Fs,"file-export":Vs,"file-import":qs,"file-spreadsheet":js,login:$s,logout:Ws,refresh:Ys,star:Ks,"alert-triangle":Xs,database:Js,server:Qs,world:Zs,"plug-connected":el,key:tl,x:nl,"indent-increase":ol,"indent-decrease":rl},il="http://www.w3.org/2000/svg",op=/^\s*<svg\s+([^>]*)>([\s\S]*?)<\/svg>\s*$/,rp=/<([a-zA-Z][\w:-]*)([^>]*)\/>/g,ip=/([a-zA-Z_:][\w:.-]*)="([^"]*)"/g,al=new Map;function sl(e){let t={};for(let n of e.matchAll(ip))t[n[1]]=n[2];return t}function ap(e){return e.startsWith("data:image/svg+xml;base64,")?atob(e.slice(26)):e.startsWith("data:image/svg+xml,")?decodeURIComponent(e.slice(19)):e}function sp(e){let t=ap(e).match(op);if(!t)throw new Error("Invalid Tabler SVG source");let[,n,o]=t,a=document.createElementNS(il,"svg"),r=sl(n);for(let[c,s]of Object.entries(r))c!=="class"&&a.setAttribute(c,s);for(let c of o.matchAll(rp)){let[,s,h]=c,m=document.createElementNS(il,s),y=sl(h);for(let[f,v]of Object.entries(y))m.setAttribute(f,v);a.appendChild(m)}return a}function lp(e){let t=al.get(e);if(t)return t;let n=sp(np[e]);return al.set(e,n),n}function Rn(e,t=20){let n=lp(e).cloneNode(!0);return n.setAttribute("width",String(t)),n.setAttribute("height",String(t)),n.setAttribute("aria-hidden","true"),n.style.pointerEvents="none",n.style.flexShrink="0",n.style.verticalAlign="middle",n}function Ue(e,t,n){e.replaceChildren(Rn(t,n))}function $(e,t,n,o){e.replaceChildren(Rn(t,o),document.createTextNode("\xA0"+n))}var ll="5.3.8";var Dr=ll+"+b15efa8",Li=null;function l(e,...t){let n="debug",o=[...t];t.length>0&&typeof t[t.length-1]=="string"&&["debug","info","warn","error"].includes(t[t.length-1])&&(n=o.pop());let a=`[Timekeeper v${Dr}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[n](`${a} ${e}`,...o)}var Pr=e=>String(e).padStart(2,"0");function gn(e,t=e){let n=Math.floor(e/3600),o=Math.floor(e%3600/60),a=Pr(e%60);return t<3600?`${t>=600?Pr(o):o}:${a}`:`${t>=36e3?Pr(n):n}:${Pr(o)}:${a}`}function _r(e,t){return gn(e,Math.max(e,t))}function Bi(e,t){let n=Math.max(0,...e.map(o=>o.start));return e.map(o=>{let a=gn(o.start,n),r=t?`${o.comment} <!-- guid:${o.guid} -->`.trimStart():o.comment;return`${a} ${r}`}).join(`
`)}function cl(e,t=window.location.href){try{let n=new URL(t);return n.searchParams.set("t",`${e}s`),n.toString()}catch{return`https://www.youtube.com/watch?v=${t.search(/[?&]v=/)>=0?t.split(/[?&]v=/)[1].split(/&/)[0]:t.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${e}s`}}function Dn(){let e=new Date;return e.getUTCFullYear()+"-"+String(e.getUTCMonth()+1).padStart(2,"0")+"-"+String(e.getUTCDate()).padStart(2,"0")+"--"+String(e.getUTCHours()).padStart(2,"0")+"-"+String(e.getUTCMinutes()).padStart(2,"0")+"-"+String(e.getUTCSeconds()).padStart(2,"0")}var ul=`#ytls-pane {
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
`;var Or="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kKGhISKNpo4IcAAAL9UExURQAAAP/abf7Zaf/Yaf7Ya//XaP/WZv/VZf/VY//UYf/SYv/SYPvTZf/QZ//ObP7QYPzRYP7QXfjRZv7Kdv7PW/3OX//FgPnOXv7MVv/ChP3LWPzLWv7Bhf3EeP++jfXJZPXKW/rIWPvIVffIWv+4lvvGVfPIXvHJXvrFV/vFU/61nPvFUP6zn/i5ivrCU/2yl/6vovvBTP+tp/6upPjBUPbBVPPCVfG8ee3EWOnEXvm+UPu0fvq+SO/AV/m9TPq1cvm9Svq9Req/YPm1Zva7Tvi6Tfi6S/m3V/G8T+e/Vvi5R+20ePi3Sui3bvi3RPe2S/Snn/a1R/e0R/G3ReW6Uve0QOm5Seu3Tei4T/eyRvaySOC6VvaxPuyzSuO1V+W1T922Udi0UuCvS+WtRuqrPNSwU+SbldiqZ+epP9mpSNamT86qT96kP82pSuKhOsemStifPdedN8OiTMufQtGOidaaOMKhSNmYNMyVRb2cR9OUM+yFLuuEL+iDLcWSOM+NLbaVQ8iMMrqQPON+K72Be99/KMaGNK2QQcGFOsmEI9h7JdV7IaiLP9l2KMd+HLCFNKyAVdVyJc14Gr97LqKHPLx6Ms1zJ8Z4GMJ4Hrx6Icd2Fqpyb89tI5yAOJ17SaV7MsNtJrhwKqB5NJd8Npd6O7xsHsRlHpt1MaVyJbZnJJB1MbljII11NZtwI5ZmX7BhIYZvL41rKohpLoJqLZBkIKJaHp9eEKpVGXhjLXthL5hUHHxdIo9RFnRaJnBcJnFYKXNVJ3RSG2lWI4JIF25PJWlON2ZPJmpOGmFRIWVNHGhKImNKHXNCC1hIHVxAHlRDIWg5EVc9HU5AGGM1D0w8HlA8E1I5HEc6Fkw3EFcxEEo0GkQ2G0UxGT8tGDswEUwoCzsuFj8oJj0tDDsrGDksFzgpFkMkCjQnFjMpDTAjFS0lDC0iFDEiCDcdCSoiCikgFCYeByQcEzAYBSoaBSQcByIbBykUBBwVBRcSBBoLAhQNAw8JBAsKAwcGAgAAAN3XOCgAAAABdFJOUwBA5thmAAAGaElEQVR42u2WW2wUVRjH/2dmdy7doduy7S6XQltaIaCiYlJEhYpRo1aMJEbxQgQvRI0YNPESjVGjiS/qiz5ojEEfBKOEgNJQQKRcWy6FSmtoramlpVCWUsre5rI75ziXLXTd1t2++eAvk8zszPl+5/+d3cke/E9eUG3g1KnuYTqxIoygtWx5b+3qVatf/7pZQ54YHU17mzpUW5Jq/uiJCtlnE3ri81PZKQiy6T16IAqPVH7dnLLwroZ6nUOa0keenJ+HYOjbAyd0MxCUA5U1xzb2ArhiUN553pNTQPd8+asKQA755ye3XQYg6SDpcc++Ozm3oH7teQ4UIN6SQT09Kp3C88qbUk4BTm5sPa4RQCVgsCjSNYDYBu/y1bdzuQV08LdDejIZ3X2OgALFD+CPvmEYrHDBkqU1HPIgun7da+tWVImCIHi9XqFq5RtvrXvpmZfe+j5KkYUHWcQ3f9kBDRQu7MzuRcUFPh9ie3335yMY+v6rVgCUEZaWDP4SmFkIPh7TTU1CrjUI//DZ6XQ9dR8zcIQUlCjVYnhq3TI5h2Bow2e9DIwBjIJQBhAOjCMAJ1dVqoG6B6V/FWg/fmjVAxSM2uU8YFoK20AImXK9NnX5gxxGk/mJ7tpw/oaVL668SWB2FzxM0wTPKCxY+ZPLr5nd/1MjxbjQ5tUVrzZ09bQ3vDqZ9xAPcbGueK/y3KYTPV1H1z+6toWOm6Bn855VTy8qEv3VD6+SKUy4mDwFfezxGwu9hRV314V/Do8nMA7+sHTZDAMwUHTH9YyHRXGxbWCkujZEYSEuKGvelxpbQA9sIPNnUlDrSE5eAAt+5esfvGArcGtZEoxSIFTZ1dBCxxR0bj1ZNUWABQMEkQf4NXUlqaVrLAMt8Jj2vBSeKeaeHUNjCeL128qJRmEnSJmGblr1dw/0hDtuXsGDGHa5AYsBdfjQQZotoLt2+xTS3g+XoePEXLLw4gUGrbf2cR7tEYCCAv2dMeNwwymaJWja3l5skiOHNWeiRGMb56vx9jAAl6ILp6OtMQELqh/ewUvKtl19/3yZPvz2SDBmsvB36m0loOf3fqOzaTNQCiAFzKrdaNSLd8zg6aXWLVqZADSe+eq5jJ/yAriQC+TOciV2+kcDTHykelIhgAii2w+Dk+pC05LdJ+MCHGZuGVMA2qd5oRJQgEzni+DAulSOEUiMmCFLmWFwW1hzDCMUaLptJQyQjSgceEFnBETnrCuMEBy9iPfORBp2GZwjIIDqh4MCw663x5IYuZLgtCuHzdNNdh0IjYaTsCDOkZRkCbxpSoNR+wYHgBqU4+yRBr2n9v0raxD7uH5yKpVCt2FQWDAGZp+kgH/SsIFoXHPnt/EwLy/AMLkVr8y6Imj+OOIDPK1nMQJ1DBAFwdInqVufyfRP6ri0gK7/oowwmC3DGGVwFJl/TJm8/LaS/hbCrToBYcN6xltKyVUBwRi0tlPONfecs1WImhiNtVjEqXbP2RzvgpuA1p9wliOGNDlmHiHWFoGbIKy5XRuYGOFeV8DCEGEhC5gYHYPUEZg6bLgiHhNjwG3BPnQJgFKKCSGo0bSgxCAMgFhZNKF6GYYrQJkvBhEE4jUC8kcMQUgLpsyNwaF02gQMAUMuSrdQUa1qOkCQmpe/QQ7SuaWuAMEa6kQgMG+qkJEXQkjWZldwrgA3LPndgLMMiWtr/HmFKC4fDt0VHHmd6aZPL84RbIOGAv3Pc1HkoqhK6nrqxSDSCbi7Hk5aGYiuiWLCc+3i2TlSCP5ysfeBZSVu3w7dmzf1zSuFBkAEePRcvGAaGBMZQkkonlr0WA03SoDhxq37uIpSDbaCMGjxATUO0BRggocJWwt4Aij2KHpf5ZKH5nAYLQA9Ub+tv6BCIbZBBwOFCg9sItbJElk+HzwFnH5+XmXtYplDpgCJxo5zvX9FBMVXwIEwgJqwMWCjSdAcTUycNfXOW0q47F3a/iYieiODQ7HuqMmbsmLPByLoloyAOQFi0/xKYaFfmbVYRJYgsaMFRBJEyYwkEqoaMxXE7KbBCJO0y6UQZNnr9yrQotrU+yqzt7opA4wlVAJJUAKAMDeYTCZHOoj0x2Xwmg71EhgbZ6PZ2nla19P3hMDshZNwFb2tsz+pwSklk4JVNSLG4GLb/p31Djv3tyWQgdF59VnrWXPcrS5lFBYc4ZBFisHdOfP4b/E301Ck7f/BFa8AAAAASUVORK5CYII=",dl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kKGhISFPUHnAAAAAMAUExURQAAAAAAAAcGARIMAhkNAR0OABgRAx4SAyMRASEVAyMVAigXAiEZBicYAiMbBiwZASsaAzAZACkbBC0cAi0dBjAdAjMeAykhCTIfAzQfAzAhBzUgAjghAy0kCzkiAzQkBzwkAz0kAzklBz8lA0AmBEEmAz4nBUEnBEQoBEUpAz0rCzgtD0ErCUcqA0EsB0crBEkrA0YsB0osAksuBU0uA08vBEQyD0E0E0kyDlExBVIxBFQzB1U0BUg3Ek83D0o6Flc5DFQ6DlQ8E1Y9E08/GFo/EF4+Dlw/EVVBF2U+CFtBFWg/CFxFGGVEEllHHGRGFmJHF2BKGpg7BGBOHmlMGWxNGG1NGZ1BCGhQHWZRIaJGDZ9ID3NWHnNYIXpXHW9aJJ5NE4VWGadOEntbIIBbH6RRFXlhKKhWFn9iJbBWGIJlKItjI39nKoZmJq9cGohsK5RqJqxjI7lgHYhuL41tK7ZjH5xxKpF0L7dqIJV0LsFqI5R4M7FxHbRwKpd7NJx7MqZ5LclvJcN1D5t/N8F1Jql9MKOBNK9+LsJ6G6GCOM54KreAKsl8GL9+Mr+AM7OEM8CBJ7iEMqqKPMyCH9h+Lq+KO82DLa+MO7GMO86GJMGLM8iJN7GQP9yFMeGFMMeOObeTPuWIMsOSOsiRN+SLNLqXQteRMb2YQdmTLtCWOsGaQ76bRe2ONeqRN9aYOcidRO+SONqZM8WeRdWbO9ScP/CUOcahRuGbNu+XOtuePMikSOGeNtSiQ92gOtiiRdqiQM6oSuGlPuelP9KrS9iqSemmPOepQe6oPdavTe6rQeqsROGvS+iuRvGtQfKtQNy0UOWyTfevQ/awQfOxRfexRPezQ/O0R/ezReq3UPe0RvG2SeO6Uvm1R/i2R++5TPi4SOe9VO28Uvm6TPO+Ufq9TezBV/q+T+/BVvHBVfrAUPDFWPvDUvzEU/fGV/PHWvXHWfzGVvXKW/3IWPrLWfrLXPjMXP3LWf7NWvzOXf/PXP/PXv3QXv7QXP7RXf/RXf/SYIi9XXwAAAABdFJOUwBA5thmAAAHkUlEQVR42sXWa3BU5R3H8e//eZ6zt+wlIQRqsBIC4w2QqKhAA52K1tYqqKjIiDpUHd60HaszHX3hdCo6tbXSVvFSBtsyjFqsoJVRvLWK4WLjpWhBAcWgYGgIm012N7vZ3XPpZmOCyW6ovupnzvNiz5z/7/znOf/ds/zfyXFOeowk5SelYrkeF+g74oA34kIRtyy6jEj99b9ct37d729ZOFZk8JyEv33Dbb9as+aBFbctmioio3cgfGfhOTUUZXr3bH31MB4I82bOmjIu7NeQtxMHWt7ahDdqwGm3zBatMNguibe2/S0P8y648LSwYkhm39PPfoBXMUD40XURpUMhH3Yu7WS7tr+x9+LFZ0QZLvnyui+aMIxgNdbahMZaQDDc6wvnZcn8ekaKXlpnbazcgbprQVDXxCjxcuntdadHhXK5N+5s9SruwcIl04OhGmvwus5qn49KkvevwKsUwNxZcyfXhz3D//DKjYc8UIzg0XLfxpYXt73Xdqgr7XIcwShFinJzJnTs2/LCxhe2HnYYlOvKeQz32cGKT0E4b3nz0XgPsWjduGM1hV00jrf4kvYtqUoBwvxl33MlBj5/OHCsIvTN1j2nnlLtH5qlznVPUOEpCNcvm57tczDBUvkx2QOff8KUSbEqjE12b+uODQWPkQGCumXppEQe7YuGLIbJd2eOtHXmIpGqMOm25173KoyycOKy66qTNiYcsQwjpLod92gy3pkD7JYX8BgZIJy+/CqVtrUOR32U8ZIJF+jJUbR11WdlAcX6n17iZj10JOKjgkImWYBMBhNy0xse7BtIkGH1dg5UTVSoyOs7tHdXR5rw+Gnjcusfdb3hgzRu+SV2QWGNWk+qdfXKlY+uXbtqxX1P9iy4FvlygFjLF/bf34qGhMo616547PPmm2699Yez339wzac/uBI5NkjCvMaPsoQj442mMndva/D65qZYFb2fbt3xamLRhfHXhvZAaI5lMviC0bqJjVMmRP1UkPyECTWGonz8o+2vsjh+f9xDvpjfn0QOHT2cTXa0dwVObpg+qzHK8WS7Ejufjl3294fxFP1OvPzUk5ovunrxtTfe+uPv8tLKX6zc2n38b3J4zpUdR+cvGNhEUUvP07ndzzyy6pHn/hW9+o475vesv/t3H7uMLhyh6Romnn+CKBBuvqKm46nf3veXzdv+8czqNYcW3PnzxXVv/uEgo5NIMDTn7NDMy9EI1yyt73jqz/vdgPGJLrS3cfYp585qijVEGJ02GTTBQIcgly5rSm9YnTBaa6u4jJy05KoQ2Ibj8eJJGzu9Wcm5S8/OH2iJC57SopSI6Xj+30DlejvZncy4gJRedNHzlXXFzGz+nR0K19BfrtGqbXM3FSV3Pr7ynhWrXmq3IRDWWlGnllzkudlP8qItRBRaDMIHB6jk44fueXD9sxseuffX2zIQtChSi8bkVbZHA0qDFrQS2vfYlHF3PrDxY1sE9j/5m2cz+MKiQJ2ZBTel0BqlBHyA5NvylDn4xx0oAYXQsm6bTdDv9te4aJD+BWhxUUCqvIPM5nfppwW0r+XxA/gCFqg+lNSMpxSslItWfEmudyip8+28IPgosV7ZksMn2MoB9Y1atBlsBAR8hqLet59c3TL4QPYNTKaLiFLQ1RrHqCJwdfjkEB4lPgQs6wQN9n/++tCmrY/9qWOgl4/SFpS2jSLP+vAgwsAnE5o7B0pDhFs6W9vkx9798CY1Y0b0n4+XEpwjMvxneP9BlKa4lKWl8VsxpQWUKIUYpjVi71y7u6F56tRZE97Z1EvZO8iQ6rW1AoNGE1185Glb9WeIgN1wca27+4lPG2bEIDaDHZPnGjz/8ATXb5mCAiWIgYlLL6tVRotPizDpqrPUkQ0D9RCb5t+0H8wYxBIYeqNFajAaDCgFNP3s1C17+3wCVdMXnRPqfXFfw1k1lIyZ+u7zdWP8U2sSlLilg9NOAAfMYGP1181678N2zz/ujNkTDB9uH3PWWAboE+PvnjnXTDnlTfAGW/C8qRNBg2JQVdO1t9979123XznRkNuVnBRkUGBy9LU4Y+fViBFXycDQTZsfG+jAKuAywFRXD960zuzpDAdr8QehirGTdr59kWne9XIO7fQfYC6cqXBdlDF5ypnZ+dZEuw064A8GIN132DE1N/B6wiOQsRy37vKb68Bxwdi4BcqEzmzIdSe6u0g7pHO4tVGg/qYpr+8/6lKITrvg+/WA64C0ORKuE0ZwjhTvBXm84lK2E5g8hqJc/L2dPU7VyefWhyhKddrIfk/839CMlO3opUQUSkt46K9rxsb4DP28zpSDySvtFsoDAhE37zD4oKzIYD0hhhQKDpjicgqBCm8OUnlc5SrQvuoAFWRz4Mr7+E2FTQAvney/A6JCUWMol+/sc3ANFCjkAlTowZ/LFdC6SltUbqBY7xQ7wG9iMUMlno0RKuvrzAIFo1wKZKoqB4jFaPKJPOCiguC6haTD15PvzjhQcETfmQbE1X7ha+jrSTngQpWqCpVmMpH0+Mq8VLzbwXUhUGMCkT4HBxJ21OIrse10Mo8LikAsZCSaS1LkpJxogK/A6Un1gSPGpao6LP8Fy8nbmCTqYikAAAAASUVORK5CYII=";var tt=null,Xn=null,cp=250,Ot=null,Jn=!1,nt=null,Bo=[];function up(){return(!tt||!document.body.contains(tt))&&(tt=document.createElement("div"),tt.className="ytls-tooltip",tt.style.pointerEvents="none",document.body.appendChild(tt),window.addEventListener("scroll",pl,!0),window.addEventListener("resize",pl,!0)),tt}function dp(e,t,n){let a=window.innerWidth,r=window.innerHeight,c=e.getBoundingClientRect(),s=c.width,h=c.height,m=t+10,y=n+10;m+s>a-10&&(m=t-s-10),y+h>r-10&&(y=n-h-10),m=Math.max(10,Math.min(m,a-s-10)),y=Math.max(10,Math.min(y,r-h-10)),e.style.left=`${m}px`,e.style.top=`${y}px`}function ml(e,t){let o=window.innerWidth,a=window.innerHeight,r=t.getBoundingClientRect(),c=e.getBoundingClientRect(),s=c.width,h=c.height,m=Math.round(r.left+r.width/2-s/2),y=Math.round(r.top-h-8);y<8&&(y=Math.round(r.bottom+8)),m<8&&(m=Math.round(r.left)),m+s>o-8&&(m=Math.round(r.right-s)),m=Math.max(8,Math.min(m,o-s-8)),y=Math.max(8,Math.min(y,a-h-8)),e.style.left=`${m}px`,e.style.top=`${y}px`}function pl(){if(!(!tt||!Ot)&&tt.classList.contains("ytls-tooltip-visible"))try{ml(tt,Ot)}catch{}}function pp(e=50){nt&&(clearTimeout(nt),nt=null),!Jn&&(nt=setTimeout(()=>{Co(),nt=null},e))}function mp(e,t,n,o){nt&&(clearTimeout(nt),nt=null),Ot&&o&&Ot!==o&&tt?.classList.contains("ytls-tooltip-visible")&&tt.classList.remove("ytls-tooltip-visible"),Xn&&clearTimeout(Xn),o&&(Ot=o,Jn=!0),Xn=setTimeout(()=>{let a=up();a.textContent=e,a.classList.remove("ytls-tooltip-visible"),o?requestAnimationFrame(()=>{ml(a,o),requestAnimationFrame(()=>{a.classList.add("ytls-tooltip-visible")})}):(dp(a,t,n),requestAnimationFrame(()=>{a.classList.add("ytls-tooltip-visible")}))},cp)}function Co(){Xn&&(clearTimeout(Xn),Xn=null),nt&&(clearTimeout(nt),nt=null),tt&&tt.classList.remove("ytls-tooltip-visible"),Ot=null,Jn=!1}function Ci(){Co()}function Pe(e,t){let n=0,o=0,a=m=>{n=m.clientX,o=m.clientY,nt&&(clearTimeout(nt),nt=null),Jn=!0,Ot=e;let y=typeof t=="function"?t():t;y&&mp(y,n,o,e)},r=m=>{n=m.clientX,o=m.clientY},c=()=>{Ot===e&&(Jn=!1,pp())};e.addEventListener("mouseenter",a),e.addEventListener("mousemove",r),e.addEventListener("mouseleave",c);let s=m=>{Jn=!1,Ot===e&&Co()};e.addEventListener("click",s,!0);let h=new MutationObserver(()=>{if(Ot===e)try{let m=window.getComputedStyle(e);(m.display==="none"||m.visibility==="hidden"||m.opacity==="0")&&Co()}catch{}});try{h.observe(e,{attributes:!0,attributeFilter:["class","style"]})}catch{}Bo.push(h),e.__tooltipCleanup=()=>{e.removeEventListener("mouseenter",a),e.removeEventListener("mousemove",r),e.removeEventListener("mouseleave",c),e.removeEventListener("click",s,!0);try{h.disconnect()}catch{}let m=Bo.indexOf(h);m!==-1&&Bo.splice(m,1),delete e.__tooltipObserver},e.__tooltipObserver=h}function fl(){for(let e of Bo)try{e.disconnect()}catch{}Bo.length=0,Co()}var Gr={};yd(Gr,{addTimestamp:()=>wp,buildExportCsvPayload:()=>Mp,buildExportPayload:()=>Ap,deleteSingleTimestampFromIndexedDB:()=>Tp,exportAllTimestamps:()=>Ep,exportAllTimestampsCsv:()=>Ip,getRecordsChangedSince:()=>zi,loadFromIndexedDB:()=>Hi,loadGlobalSettings:()=>Kt,mergeBackupData:()=>Lp,mergeRemoteRecords:()=>Gi,onTimestampsWritten:()=>Ui,removeFromIndexedDB:()=>kp,saveGlobalSettings:()=>wn,saveRowsToIndexedDB:()=>bp,saveSingleTimestampToIndexedDB:()=>xp,saveToIndexedDB:()=>Sp});var fp="ytls-timestamps-db",hp=5,Qn="timestamps",mt="timestamps_v2",yn="settings",vn=null,Zn=null;function Nr(){if(vn)try{return vn.objectStoreNames,Promise.resolve(vn)}catch(e){l("IndexedDB connection is no longer usable:",e,"warn"),vn=null}return Zn||(Zn=gp().then(e=>(vn=e,Zn=null,e.onclose=()=>{l("IndexedDB connection closed unexpectedly","warn"),vn=null},e.onversionchange=()=>{l("IndexedDB upgrade requested by another tab; closing this connection",null,"warn"),e.close(),vn===e&&(vn=null)},e.onerror=t=>{l("IndexedDB connection error:",t,"error")},e)).catch(e=>{throw Zn=null,e}),Zn)}function hl(e,t){let n=crypto.randomUUID(),o=0,a=e.openCursor();a.onsuccess=r=>{let c=r.target.result;c?(o++,c.update({...c.value,write_counter:o,device_id:n}),c.continue()):(t.put({key:"write_counter",value:o}),t.put({key:"device_id",value:n}),l(`Lamport migration: backfilled ${o} records, device_id=${n}`))},a.onerror=()=>{l("Lamport migration: cursor error during backfill",a.error,"error")}}function gp(){return new Promise((e,t)=>{let n=indexedDB.open(fp,hp);n.onupgradeneeded=o=>{let a=o.target.result,r=o.oldVersion,c=o.target.transaction;if(r<1&&a.createObjectStore(Qn,{keyPath:"video_id"}),r<2&&!a.objectStoreNames.contains(yn)&&a.createObjectStore(yn,{keyPath:"key"}),r<3){if(a.objectStoreNames.contains(Qn)){l("Exporting backup before v2 migration...");let y=c.objectStore(Qn).getAll();y.onsuccess=()=>{let f=Rr.array().safeParse(y.result);if(f.success&&f.data.length>0)try{let v={},E=0;f.data.forEach(q=>{if(q.timestamps.length>0){let ee=Lo.parse(q.timestamps);v[`ytls-${q.video_id}`]={video_id:q.video_id,timestamps:[...ee].sort((O,j)=>O.start-j.start)},E+=ee.length}});let I=new Blob([JSON.stringify(v,null,2)],{type:"application/json"}),P=URL.createObjectURL(I),G=document.createElement("a");G.href=P,G.download=`timekeeper-data-${Dn()}.json`,G.click(),URL.revokeObjectURL(P),l(`Pre-migration backup exported: ${f.data.length} videos, ${E} timestamps`)}catch(v){l("Failed to export pre-migration backup:",v,"error")}else f.success||l("Skipping pre-migration backup: legacy data failed validation",f.error.message,"warn")}}let h=a.createObjectStore(mt,{keyPath:"guid"});if(h.createIndex("video_id","video_id",{unique:!1}),h.createIndex("video_start",["video_id","start"],{unique:!1}),a.objectStoreNames.contains(Qn)){let y=c.objectStore(Qn).getAll();y.onsuccess=()=>{let f=Rr.array().safeParse(y.result);if(f.success&&f.data.length>0){let v=0;f.data.forEach(E=>{E.timestamps.length>0&&E.timestamps.forEach(I=>{h.put({guid:I.guid,video_id:E.video_id,start:I.start,comment:I.comment}),v++})}),l(`Migrated ${v} timestamps from ${f.data.length} videos to v2 store`)}else f.success||l("Skipping v1 \u2192 v2 migration: legacy data failed validation",f.error.message,"warn");r<4&&hl(c.objectStore(mt),c.objectStore(yn))},a.deleteObjectStore(Qn),l("Deleted old timestamps store after migration to v2")}}r===3&&hl(c.objectStore(mt),c.objectStore(yn));let s=c.objectStore(mt);s.indexNames.contains("write_counter")||s.createIndex("write_counter","write_counter",{unique:!1})},n.onsuccess=o=>{e(o.target.result)},n.onerror=o=>{let a=o.target.error;t(a??new Error("Failed to open IndexedDB"))},n.onblocked=()=>{l("IndexedDB open is blocked by another tab holding an older connection; waiting",null,"warn")}})}function Hr(e,t,n){return Nr().then(o=>new Promise((a,r)=>{let c;try{c=o.transaction(e,t)}catch(m){r(new Error(`Failed to create transaction for ${e}: ${m}`));return}let s=c.objectStore(e),h;try{h=n(s)}catch(m){r(new Error(`Failed to execute operation on ${e}: ${m}`));return}h&&(h.onsuccess=()=>a(h.result),h.onerror=()=>r(h.error??new Error(`IndexedDB ${t} operation failed`))),c.oncomplete=()=>{h||a(void 0)},c.onerror=()=>r(c.error??new Error("IndexedDB transaction failed")),c.onabort=()=>r(c.error??new Error("IndexedDB transaction aborted"))}))}var Ri=new Set;function gl(e){return Ri.add(e),()=>Ri.delete(e)}function vp(){for(let e of Ri)try{e()}catch(t){l("Timestamp write listener failed:",t,"error")}}function Ro(e,{silent:t=!1}={}){return Nr().then(n=>new Promise((o,a)=>{let r;try{r=n.transaction([mt,yn],"readwrite")}catch(c){a(new Error(`Failed to create transaction: ${c}`));return}r.oncomplete=()=>{o(),t||vp()},r.onerror=()=>a(new Error(`IndexedDB write failed: ${r.error?.message??"unknown"}`)),r.onabort=()=>a(new Error(`IndexedDB transaction aborted: ${r.error?.message??"unknown"}`));try{e(r.objectStore(mt),r.objectStore(yn))}catch(c){try{r.abort()}catch{}a(c instanceof Error?c:new Error(String(c)))}}))}function Do(e,t){let n=e.get("write_counter");n.onsuccess=()=>{let o=typeof n.result?.value=="number"?n.result.value:0;e.put({key:"write_counter",value:t(o)})}}function vl(e,t){let n=Lo.safeParse(t);if(!n.success)return Promise.reject(new Error(`Invalid timestamp payload for ${e}`));let o=n.data;return Ro((a,r)=>{let c=a.index("video_id").getAll(IDBKeyRange.only(e));c.onsuccess=()=>{let s=c.result??[],h=new Map(s.map(f=>[f.guid,f])),m=new Set(o.map(f=>f.guid)),y=Date.now();Do(r,f=>{let v=f;return s.forEach(E=>{!m.has(E.guid)&&!E.deleted_at&&(v++,a.put({...E,deleted_at:y,write_counter:v}))}),o.forEach(E=>{let I=h.get(E.guid);I&&!I.deleted_at&&!E.deleted_at&&I.start===E.start&&I.comment===E.comment||(v++,a.put({guid:E.guid,video_id:e,start:E.start,comment:E.comment,write_counter:v,deleted_at:E.deleted_at??I?.deleted_at??void 0}))}),v})}})}function Di(e,t){let n=Lo.safeParse(t);if(!n.success)return Promise.reject(new Error(`Invalid timestamp payload for ${e}`));let o=n.data;return o.length===0?Promise.resolve():Ro((a,r)=>{Do(r,c=>{let s=c;return o.forEach(h=>{s++,a.put({guid:h.guid,video_id:e,start:h.start,comment:h.comment,write_counter:s,deleted_at:h.deleted_at})}),s})})}function yl(e,t){return Di(e,[t])}function Pi(e,t={}){return e.length===0?Promise.resolve():Ro((n,o)=>{Do(o,a=>{let r=a;return e.forEach(c=>{c.write_counter!==void 0&&c.write_counter>r&&(r=c.write_counter)}),e.forEach(c=>{let s={guid:c.guid,video_id:c.video_id,start:c.start,comment:c.comment,deleted_at:c.deleted_at,write_counter:c.write_counter??++r};n.put(s)}),r+1})},t)}function wl(e){return l(`Soft-deleting timestamp ${e}`),Ro((t,n)=>{let o=t.get(e);o.onsuccess=()=>{let a=o.result;a&&Do(n,r=>(t.put({...a,deleted_at:Date.now(),write_counter:r+1}),r+1))}})}function bl(e){return Nr().then(t=>new Promise((n,o)=>{let a;try{a=t.transaction([mt],"readonly")}catch(c){let s=`Failed to create read transaction: ${c}`;l(s,c,"error"),o(new Error(s));return}a.onabort=()=>{let c=`Transaction aborted during load: ${a.error?.message??"unknown"}`;l(c,a.error,"error"),o(new Error(c))};let r=a.objectStore(mt).index("video_id").getAll(IDBKeyRange.only(e));r.onsuccess=()=>{try{let c=r.result.filter(m=>!m.deleted_at),s=[],h=0;for(let m of c){let y=Cr.safeParse({guid:m.guid,start:m.start,comment:m.comment});y.success?s.push(y.data):h++}if(h>0&&l(`Skipped ${h} stored timestamps for ${e} that failed validation`,null,"warn"),s.length===0){h>0?o(new Error(`Stored timestamps for this video failed validation (${h} rows)`)):n(null);return}n(s.sort((m,y)=>m.start-y.start))}catch(c){o(c)}},r.onerror=()=>{let c=`Failed to load timestamps from IndexedDB: ${r.error?.message??"unknown error"}`;l(c,r.error,"error"),o(new Error(c))}}))}function Sl(e){return Ro((t,n)=>{let o=t.index("video_id").getAll(IDBKeyRange.only(e));o.onsuccess=()=>{let a=o.result??[],r=Date.now();Do(n,c=>{let s=c;return a.forEach(h=>{h.deleted_at||(s++,t.put({...h,deleted_at:r,write_counter:s}))}),s})}})}function zr(){return Hr(mt,"readonly",e=>e.getAll()).then(e=>Array.isArray(e)?e:[])}function xl(e){return Hr(mt,"readonly",t=>t.index("write_counter").getAll(IDBKeyRange.lowerBound(e,!0))).then(t=>Array.isArray(t)?t:[])}function Tl(e){return e.length===0?Promise.resolve([]):Nr().then(t=>new Promise((n,o)=>{let a=[],r=t.transaction(mt,"readonly"),c=r.objectStore(mt);for(let s of e)c.get(s).onsuccess=h=>{let m=h.target.result;m&&a.push(m)};r.oncomplete=()=>n(a),r.onerror=()=>o(r.error??new Error("IndexedDB read failed")),r.onabort=()=>o(r.error??new Error("IndexedDB read aborted"))}))}function kl(e,t){return Hr(yn,"readwrite",n=>{n.put({key:e,value:t})}).then(()=>{}).catch(n=>{l(`Failed to save setting '${e}' to IndexedDB:`,n,"error")})}function Al(e){return Hr(yn,"readonly",t=>t.get(e)).then(t=>t?.value).catch(t=>{l(`Failed to load setting '${e}' from IndexedDB:`,t,"error")})}async function _i({includeDeleted:e=!1}={}){let t={},n=await zr(),o=[],a=0;for(let f of n){let v=hn.safeParse(f);v.success?o.push(v.data):a++}a>0&&l(`Skipped ${a} timestamp rows that failed validation during export`,null,"warn");let c=[...e?o:o.filter(f=>!f.deleted_at)].sort((f,v)=>{let E=f.video_id.localeCompare(v.video_id);if(E!==0)return E;let I=f.start-v.start;return I!==0?I:f.guid.localeCompare(v.guid)}),s=new Map;for(let f of c)s.has(f.video_id)||s.set(f.video_id,[]),s.get(f.video_id).push({guid:f.guid,start:f.start,comment:f.comment,write_counter:f.write_counter,deleted_at:f.deleted_at});let h=Array.from(s.keys()).sort((f,v)=>f.localeCompare(v));for(let f of h){let v=s.get(f);t[`ytls-${f}`]={video_id:f,timestamps:v}}return{json:JSON.stringify(t,null,2),filename:"timekeeper-data.json",totalVideos:s.size,totalTimestamps:c.length,invalidRows:a}}async function Il(){try{let{json:e,filename:t,totalVideos:n,totalTimestamps:o}=await _i(),a=new Blob([e],{type:"application/json"}),r=URL.createObjectURL(a),c=document.createElement("a");c.href=r,c.download=t,c.click(),URL.revokeObjectURL(r),l(`Exported ${n} videos with ${o} timestamps`)}catch(e){throw l("Failed to export data:",e,"error"),e}}async function Oi(){let e=hn.array().safeParse((await zr()).filter(m=>!m.deleted_at));if(!e.success||e.data.length===0){e.success||l("Failed to parse timestamp rows for CSV export:",e.error.message,"warn");let m=`Tag,Timestamp,URL
`,y=`timestamps-${Dn()}.csv`;return{csv:m,filename:y,totalVideos:0,totalTimestamps:0}}let t=e.data,n=new Map;for(let m of t)n.has(m.video_id)||n.set(m.video_id,[]),n.get(m.video_id).push({start:m.start,comment:m.comment});let o=[];o.push("Tag,Timestamp,URL");let a=0,r=m=>`"${String(m).replace(/"/g,'""')}"`,c=Array.from(n.keys()).sort();for(let m of c){let y=n.get(m).sort((f,v)=>f.start-v.start);for(let f of y){let v=f.comment,E=gn(f.start,36e3),I=cl(f.start,`https://www.youtube.com/watch?v=${m}`);o.push([r(v),r(E),r(I)].join(",")),a++}}let s=o.join(`
`),h=`timestamps-${Dn()}.csv`;return{csv:s,filename:h,totalVideos:n.size,totalTimestamps:a}}async function Ll(){try{let{csv:e,filename:t,totalVideos:n,totalTimestamps:o}=await Oi(),a=new Blob([e],{type:"text/csv;charset=utf-8;"}),r=URL.createObjectURL(a),c=document.createElement("a");c.href=r,c.download=t,c.click(),URL.revokeObjectURL(r),l(`Exported ${n} videos with ${o} timestamps (CSV)`)}catch(e){throw l("Failed to export CSV data:",e,"error"),e}}async function Ni(e,t){if(!e)throw new Error("Video ID is required");if(!t.guid||t.start==null)throw new Error("Timestamp must have GUID and start time");return yl(e,t)}async function Bl(e,t){if(!e)throw new Error("Video ID is required");return Di(e,t)}async function Cl(e,t){if(!e)throw new Error("Video ID is required");if(!Array.isArray(t))throw new Error("Timestamps must be an array");return vl(e,t)}async function Rl(e){if(!e)throw new Error("GUID is required");return wl(e)}async function Dl(e){if(!e)throw new Error("Video ID is required");return Sl(e)}async function Pl(e){if(!e)throw new Error("Video ID is required");return bl(e)}async function _l(e){let t;try{t=JSON.parse(e)}catch{return l("mergeBackupData: failed to parse JSON",null,"warn"),{mergedVideos:0,mergedTimestamps:0}}let n=As.safeParse(t);if(!n.success)return l("mergeBackupData: data failed validation",n.error.message,"warn"),{mergedVideos:0,mergedTimestamps:0};let o=await zr(),a=new Map;for(let h of o)a.set(h.guid,h);let r=0,c=0,s=[];for(let[,h]of Object.entries(n.data)){let{video_id:m,timestamps:y}=h,f=0;for(let v of y){let E=a.get(v.guid);Ol(E,m,v)&&(s.push({guid:v.guid,video_id:m,start:v.start,comment:v.comment,write_counter:v.write_counter,deleted_at:v.deleted_at}),a.set(v.guid,{...E??{},guid:v.guid,video_id:m,start:v.start,comment:v.comment,write_counter:v.write_counter,deleted_at:v.deleted_at}),f++,c++)}f>0&&r++}return await Pi(s),{mergedVideos:r,mergedTimestamps:c}}function Ml(e,t){return JSON.stringify([e,t.start,t.comment,t.deleted_at??null])}function Ol(e,t,n){return e?e.write_counter===void 0||n.write_counter===void 0?!1:n.write_counter!==e.write_counter?n.write_counter>e.write_counter:Ml(t,n)>Ml(e.video_id,e):!0}async function Nl(e){let t=[];for(let n of await xl(e)){let o=hn.safeParse(n);if(!o.success||o.data.write_counter===void 0)continue;let{guid:a,video_id:r,start:c,comment:s,write_counter:h,deleted_at:m}=o.data;t.push({guid:a,video_id:r,start:c,comment:s,write_counter:h,...m!==void 0?{deleted_at:m}:{}})}return t}async function Hl(e){let t=new Map;for(let a of await Tl(e.map(r=>r.guid)))t.set(a.guid,a);let n=[],o=new Set;for(let a of e)Ol(t.get(a.guid),a.video_id,a)&&(n.push(a),o.add(a.video_id));return await Pi(n,{silent:!0}),{mergedVideos:o.size,mergedTimestamps:n.length}}function zl(e,t){if(!e)throw new Error("Setting key is required");return kl(e,t)}async function Gl(e){if(!e)throw new Error("Setting key is required");return Al(e)}function wp(e,t){return Ni(e,t)}function bp(e,t){return Bl(e,t)}function Sp(e,t){return Cl(e,t)}function xp(e,t){return Ni(e,t)}function Hi(e){return Pl(e)}function Tp(e,t){return Rl(t)}function kp(e){return Dl(e)}function wn(e,t){return zl(e,t)}function Kt(e){return Gl(e)}function Ap(e){return _i(e)}function Ep(){return Il()}function Mp(){return Oi()}function Ip(){return Ll()}function Lp(e){return _l(e)}function zi(e){return Nl(e)}function Gi(e){return Hl(e)}function Ui(e){return gl(e)}function Ur(e){return e?Array.from(e.querySelectorAll("li:not(.ytls-placeholder):not(.ytls-error-message)")):[]}function Fr(e){if(!e)return;e.replaceChildren();let t=e.querySelector(".ytls-error-message");t&&t.remove()}function Fi(e,t){if(!e)return;Fr(e);let n=document.createElement("li");n.className="ytls-placeholder",n.textContent=t,e.appendChild(n),e.style.overflowY="hidden"}function Ul(e){if(!e)return;let t=e.querySelector(".ytls-placeholder");t&&t.remove(),e.style.overflowY=""}function Po(e){return e?e.querySelector(".ytls-error-message")!==null:!1}function Fl(e,t){if(!e)return;Fr(e);let n=document.createElement("li");n.className="ytls-error-message",n.style.cssText=`
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
  `,n.innerHTML=`<div style="margin-bottom:8px">\u26A0\uFE0F ${Bp(t)}</div><div style="font-size:12px;font-weight:normal;color:#aaa">Check the console for details or refresh the page.</div>`,e.appendChild(n),e.style.overflowY="hidden"}function Vl(e){if(!e)return;let t=e.querySelector(".ytls-error-message");t&&t.remove()}function Bp(e){let t=document.createElement("div");return t.textContent=e,t.innerHTML}function ql(e,t){if(!e||t||Po(e))return;Array.from(e.children).some(o=>!o.classList.contains("ytls-placeholder")&&!o.classList.contains("ytls-error-message"))||Fi(e,"No timestamps for this video")}function jl(e){if(!e)return[];let t=Ur(e),n=[];return t.forEach(o=>{let a=o.querySelector("[data-time]"),r=o.querySelector("input"),c=o.dataset.guid;if(!a||!r||!c)return;let s=a.dataset.time;if(!s)return;let h=Number.parseInt(s,10);Number.isFinite(h)&&n.push({guid:c,start:h,comment:r.value})}),n.sort((o,a)=>o.start-a.start)}function $l(e){if(!e)return 0;let t=Ur(e),n=0;return t.forEach(o=>{let r=o.querySelector("[data-time]")?.dataset.time;if(r){let c=Number.parseInt(r,10);Number.isFinite(c)&&(n=Math.max(n,c))}}),n}var Rp={auth:{googleAuthState:{isSignedIn:!1,accessToken:null,userName:null,email:null},syncAuthState:Kn,autoBackupEnabled:!0,autoBackupIntervalMinutes:30,autoBackupRetryAttempts:0,autoBackupBackoffMs:null,lastAutoBackupAt:null,isAutoBackupRunning:!1},ui:{panePosition:null,currentVideoId:"",minPaneHeight:250,lastHandledUrl:null,urlChangeHandlersSetup:!1},timestamps:{items:[],currentIndex:null,dbError:null}},lt=JSON.parse(JSON.stringify(Rp));function je(){return lt}function Vr(e){lt={...lt,...e,auth:{...lt.auth,...e.auth||{}},ui:{...lt.ui,...e.ui||{}},timestamps:{...lt.timestamps,...e.timestamps||{}}}}function bn(e,t){Vr({auth:{...lt.auth,[e]:t}})}function qr(e,t){Vr({ui:{...lt.ui,[e]:t}})}function Nt(){return lt.auth.googleAuthState}function Mt(e){bn("googleAuthState",e)}function Wl(){return lt.auth.syncAuthState}function eo(e){bn("syncAuthState",e)}function Vi(e){bn("autoBackupEnabled",e)}function qi(e){bn("autoBackupIntervalMinutes",e)}function ji(e){bn("isAutoBackupRunning",e)}function jr(e){bn("autoBackupRetryAttempts",e)}function to(e){bn("autoBackupBackoffMs",e)}function $i(e){bn("lastAutoBackupAt",e)}function Yl(e){qr("minPaneHeight",e)}function Kl(e){qr("panePosition",e)}function Xl(e){qr("lastHandledUrl",e)}function Jl(e){qr("urlChangeHandlersSetup",e)}function Ql(e){Vr({timestamps:{...lt.timestamps,items:e}})}function Wi(e){Vr({timestamps:{...lt.timestamps,dbError:e}})}function Zl(){return lt.timestamps.dbError}var Pn=typeof unsafeWindow<"u"?unsafeWindow:window,ic=43200*14,ec="html5_max_live_dvr_window_plus_margin_secs";function Xt(e){return e!=null&&typeof e=="object"}function tc(e){let{streamingData:t,videoDetails:n,playerConfig:o,microformat:a}=e;if(!Xt(n)||!n.isLive)return;let r=n.isLiveDvrEnabled===!0;if(n.isLiveDvrEnabled=!0,!r&&Xt(o)){let c=o.mediaCommonConfig;if(Xt(c)){c.useServerDrivenAbr=!1;let s=c.serverPlaybackStartConfig;Xt(s)&&(s.enable=!1)}}if(Xt(t)){let c=t;if(Array.isArray(c.adaptiveFormats)&&Dp(a))for(let s of c.adaptiveFormats)s.maxDvrDurationSec=ic}}function Dp(e){if(!Xt(e))return!1;let t=e.playerMicroformatRenderer;if(!Xt(t))return!1;let n=t.liveBroadcastDetails;if(!Xt(n))return!1;let o=n.startTimestamp;return!o||typeof o!="string"?!1:(Date.now()-new Date(o).getTime())/1e3>43200}function Ki(e){if(!e||typeof e!="object")return!1;let t=e;return t.videoDetails?(tc(t),!0):t.playerResponse&&Xt(t.playerResponse)&&t.playerResponse.videoDetails?(tc(t.playerResponse),!0):!1}function Pp(){let e=Object.getOwnPropertyDescriptor(Pn,"ytInitialPlayerResponse"),t=e&&e.set,n=Pn.ytInitialPlayerResponse;if(!Ki(n))try{Object.defineProperty(Pn,"ytInitialPlayerResponse",{configurable:!0,get(){return n},set(o){t&&t.call(this,o),n=o,Ki(o)&&Object.defineProperty(Pn,"ytInitialPlayerResponse",{configurable:!0,writable:!0,value:o})}})}catch{}}var nc=!1;function _p(){if(nc)return;nc=!0;let e=JSON.parse;JSON.parse=function(t,n){let o=e.call(this,t,n);try{Ki(o)}catch{}return o}}function oc(e){if(e.__dvrCapLifted)return;let n=(typeof e.d=="function"?e.d():void 0)?.WEB_PLAYER_CONTEXT_CONFIGS;if(!n)return;let o=n;for(let a in o){let r=o[a];if(r&&typeof r.serializedExperimentFlags=="string"){let c=r.serializedExperimentFlags,s=c.replace(new RegExp(`${ec}=[\\d.]+`),`${ec}=${ic}`);s!==c&&(r.serializedExperimentFlags=s)}}e.__dvrCapLifted=!0}function rc(e){if(!e||e.__dvrHooked)return e;e.__dvrHooked=!0;let t=e.set;typeof t=="function"&&(e.set=function(...n){let o=t.apply(this,n);try{oc(e)}catch{}return o});try{oc(e)}catch{}return e}function Op(){let e={};Pn.ytcfg&&(e=rc(Pn.ytcfg));try{Object.defineProperty(Pn,"ytcfg",{configurable:!0,get(){return e},set(t){e=rc(t)}})}catch{}}function ac(){Pp(),_p(),Op(),l("[Timekeeper] DVR/Rewind enablement initialized for live streams")}var Np="BADGE_STYLE_TYPE_MEMBERS_ONLY";function _o(e){return typeof e=="object"&&e!==null}function sc(e,t=0){return!_o(e)||t>8?!1:e.style===Np?!0:Object.values(e).some(n=>sc(n,t+1))}function lc(e,t){let n=_o(t)?t.videoDetails:void 0;if(!_o(n)||typeof n.videoId!="string"||typeof n.channelId!="string")return null;let o=e?.contents?.twoColumnWatchNextResults?.results?.results?.contents;if(!Array.isArray(o))return null;let a=o.find(r=>_o(r)&&_o(r.videoPrimaryInfoRenderer));return a?{videoId:n.videoId,channelId:n.channelId,membersOnly:sc(a.videoPrimaryInfoRenderer)}:null}var Xi="#author-name, #author-text";function cc(){return window.top!==window.self&&window.location.pathname.startsWith("/live_chat")}function Ji(e){let t=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);for(let n=t.nextNode();n;n=t.nextNode()){let o=n.nodeValue??"";if(o.trim()){/^\s*@/.test(o)&&(n.nodeValue=o.replace(/^(\s*)@/,"$1"));return}}}function Qi(e){if(e.nodeType===Node.TEXT_NODE){let t=e.parentElement?.closest(Xi);t&&Ji(t);return}e instanceof Element&&(e.matches(Xi)&&Ji(e),e.querySelectorAll(Xi).forEach(Ji))}function uc(){let e=new MutationObserver(t=>{for(let n of t)n.type==="characterData"?Qi(n.target):n.addedNodes.forEach(Qi)});document.documentElement&&Qi(document.documentElement),e.observe(document,{childList:!0,subtree:!0,characterData:!0})}var ge=Uint8Array,ct=Uint16Array,ca=Int32Array,$r=new ge([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Wr=new ge([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),oa=new ge([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),vc=function(e,t){for(var n=new ct(31),o=0;o<31;++o)n[o]=t+=1<<e[o-1];for(var a=new ca(n[30]),o=1;o<30;++o)for(var r=n[o];r<n[o+1];++r)a[r]=r-n[o]<<5|o;return{b:n,r:a}},yc=vc($r,2),wc=yc.b,ra=yc.r;wc[28]=258,ra[258]=28;var bc=vc(Wr,0),Hp=bc.b,dc=bc.r,ia=new ct(32768);for(X=0;X<32768;++X)Jt=(X&43690)>>1|(X&21845)<<1,Jt=(Jt&52428)>>2|(Jt&13107)<<2,Jt=(Jt&61680)>>4|(Jt&3855)<<4,ia[X]=((Jt&65280)>>8|(Jt&255)<<8)>>1;var Jt,X,zt=(function(e,t,n){for(var o=e.length,a=0,r=new ct(t);a<o;++a)e[a]&&++r[e[a]-1];var c=new ct(t);for(a=1;a<t;++a)c[a]=c[a-1]+r[a-1]<<1;var s;if(n){s=new ct(1<<t);var h=15-t;for(a=0;a<o;++a)if(e[a])for(var m=a<<4|e[a],y=t-e[a],f=c[e[a]-1]++<<y,v=f|(1<<y)-1;f<=v;++f)s[ia[f]>>h]=m}else for(s=new ct(o),a=0;a<o;++a)e[a]&&(s[a]=ia[c[e[a]-1]++]>>15-e[a]);return s}),Sn=new ge(288);for(X=0;X<144;++X)Sn[X]=8;var X;for(X=144;X<256;++X)Sn[X]=9;var X;for(X=256;X<280;++X)Sn[X]=7;var X;for(X=280;X<288;++X)Sn[X]=8;var X,Ho=new ge(32);for(X=0;X<32;++X)Ho[X]=5;var X,zp=zt(Sn,9,0),Gp=zt(Sn,9,1),Up=zt(Ho,5,0),Fp=zt(Ho,5,1),Zi=function(e){for(var t=e[0],n=1;n<e.length;++n)e[n]>t&&(t=e[n]);return t},It=function(e,t,n){var o=t/8|0;return(e[o]|e[o+1]<<8)>>(t&7)&n},ea=function(e,t){var n=t/8|0;return(e[n]|e[n+1]<<8|e[n+2]<<16)>>(t&7)},ua=function(e){return(e+7)/8|0},zo=function(e,t,n){return(t==null||t<0)&&(t=0),(n==null||n>e.length)&&(n=e.length),new ge(e.subarray(t,n))};var Vp=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],Fe=function(e,t,n){var o=new Error(t||Vp[e]);if(o.code=e,Error.captureStackTrace&&Error.captureStackTrace(o,Fe),!n)throw o;return o},qp=function(e,t,n,o){var a=e.length,r=o?o.length:0;if(!a||t.f&&!t.l)return n||new ge(0);var c=!n,s=c||t.i!=2,h=t.i;c&&(n=new ge(a*3));var m=function(it){var K=n.length;if(it>K){var Ut=new ge(Math.max(K*2,it));Ut.set(n),n=Ut}},y=t.f||0,f=t.p||0,v=t.b||0,E=t.l,I=t.d,P=t.m,G=t.n,q=a*8;do{if(!E){y=It(e,f,1);var ee=It(e,f+1,3);if(f+=3,ee)if(ee==1)E=Gp,I=Fp,P=9,G=5;else if(ee==2){var ve=It(e,f,31)+257,pe=It(e,f+10,15)+4,U=ve+It(e,f+5,31)+1;f+=14;for(var R=new ge(U),fe=new ge(19),re=0;re<pe;++re)fe[oa[re]]=It(e,f+re*3,7);f+=pe*3;for(var Te=Zi(fe),Ke=(1<<Te)-1,_e=zt(fe,Te,1),re=0;re<U;){var Oe=_e[It(e,f,Ke)];f+=Oe&15;var O=Oe>>4;if(O<16)R[re++]=O;else{var Ae=0,le=0;for(O==16?(le=3+It(e,f,3),f+=2,Ae=R[re-1]):O==17?(le=3+It(e,f,7),f+=3):O==18&&(le=11+It(e,f,127),f+=7);le--;)R[re++]=Ae}}var Ne=R.subarray(0,ve),Ee=R.subarray(ve);P=Zi(Ne),G=Zi(Ee),E=zt(Ne,P,1),I=zt(Ee,G,1)}else Fe(1);else{var O=ua(f)+4,j=e[O-4]|e[O-3]<<8,se=O+j;if(se>a){h&&Fe(0);break}s&&m(v+j),n.set(e.subarray(O,se),v),t.b=v+=j,t.p=f=se*8,t.f=y;continue}if(f>q){h&&Fe(0);break}}s&&m(v+131072);for(var Lt=(1<<P)-1,Me=(1<<G)-1,ye=f;;ye=f){var Ae=E[ea(e,f)&Lt],we=Ae>>4;if(f+=Ae&15,f>q){h&&Fe(0);break}if(Ae||Fe(2),we<256)n[v++]=we;else if(we==256){ye=f,E=null;break}else{var ce=we-254;if(we>264){var re=we-257,ue=$r[re];ce=It(e,f,(1<<ue)-1)+wc[re],f+=ue}var rt=I[ea(e,f)&Me],tn=rt>>4;rt||Fe(3),f+=rt&15;var Ee=Hp[tn];if(tn>3){var ue=Wr[tn];Ee+=ea(e,f)&(1<<ue)-1,f+=ue}if(f>q){h&&Fe(0);break}s&&m(v+131072);var nn=v+ce;if(v<Ee){var An=r-Ee,Re=Math.min(Ee,nn);for(An+v<0&&Fe(3);v<Re;++v)n[v]=o[An+v]}for(;v<nn;++v)n[v]=n[v-Ee]}}t.l=E,t.p=ye,t.b=v,t.f=y,E&&(y=1,t.m=P,t.d=I,t.n=G)}while(!y);return v!=n.length&&c?zo(n,0,v):n.subarray(0,v)},Qt=function(e,t,n){n<<=t&7;var o=t/8|0;e[o]|=n,e[o+1]|=n>>8},Oo=function(e,t,n){n<<=t&7;var o=t/8|0;e[o]|=n,e[o+1]|=n>>8,e[o+2]|=n>>16},ta=function(e,t){for(var n=[],o=0;o<e.length;++o)e[o]&&n.push({s:o,f:e[o]});var a=n.length,r=n.slice();if(!a)return{t:xc,l:0};if(a==1){var c=new ge(n[0].s+1);return c[n[0].s]=1,{t:c,l:1}}n.sort(function(se,ve){return se.f-ve.f}),n.push({s:-1,f:25001});var s=n[0],h=n[1],m=0,y=1,f=2;for(n[0]={s:-1,f:s.f+h.f,l:s,r:h};y!=a-1;)s=n[n[m].f<n[f].f?m++:f++],h=n[m!=y&&n[m].f<n[f].f?m++:f++],n[y++]={s:-1,f:s.f+h.f,l:s,r:h};for(var v=r[0].s,o=1;o<a;++o)r[o].s>v&&(v=r[o].s);var E=new ct(v+1),I=aa(n[y-1],E,0);if(I>t){var o=0,P=0,G=I-t,q=1<<G;for(r.sort(function(ve,pe){return E[pe.s]-E[ve.s]||ve.f-pe.f});o<a;++o){var ee=r[o].s;if(E[ee]>t)P+=q-(1<<I-E[ee]),E[ee]=t;else break}for(P>>=G;P>0;){var O=r[o].s;E[O]<t?P-=1<<t-E[O]++-1:++o}for(;o>=0&&P;--o){var j=r[o].s;E[j]==t&&(--E[j],++P)}I=t}return{t:new ge(E),l:I}},aa=function(e,t,n){return e.s==-1?Math.max(aa(e.l,t,n+1),aa(e.r,t,n+1)):t[e.s]=n},pc=function(e){for(var t=e.length;t&&!e[--t];);for(var n=new ct(++t),o=0,a=e[0],r=1,c=function(h){n[o++]=h},s=1;s<=t;++s)if(e[s]==a&&s!=t)++r;else{if(!a&&r>2){for(;r>138;r-=138)c(32754);r>2&&(c(r>10?r-11<<5|28690:r-3<<5|12305),r=0)}else if(r>3){for(c(a),--r;r>6;r-=6)c(8304);r>2&&(c(r-3<<5|8208),r=0)}for(;r--;)c(a);r=1,a=e[s]}return{c:n.subarray(0,o),n:t}},No=function(e,t){for(var n=0,o=0;o<t.length;++o)n+=e[o]*t[o];return n},Sc=function(e,t,n){var o=n.length,a=ua(t+2);e[a]=o&255,e[a+1]=o>>8,e[a+2]=e[a]^255,e[a+3]=e[a+1]^255;for(var r=0;r<o;++r)e[a+r+4]=n[r];return(a+4+o)*8},mc=function(e,t,n,o,a,r,c,s,h,m,y){Qt(t,y++,n),++a[256];for(var f=ta(a,15),v=f.t,E=f.l,I=ta(r,15),P=I.t,G=I.l,q=pc(v),ee=q.c,O=q.n,j=pc(P),se=j.c,ve=j.n,pe=new ct(19),U=0;U<ee.length;++U)++pe[ee[U]&31];for(var U=0;U<se.length;++U)++pe[se[U]&31];for(var R=ta(pe,7),fe=R.t,re=R.l,Te=19;Te>4&&!fe[oa[Te-1]];--Te);var Ke=m+5<<3,_e=No(a,Sn)+No(r,Ho)+c,Oe=No(a,v)+No(r,P)+c+14+3*Te+No(pe,fe)+2*pe[16]+3*pe[17]+7*pe[18];if(h>=0&&Ke<=_e&&Ke<=Oe)return Sc(t,y,e.subarray(h,h+m));var Ae,le,Ne,Ee;if(Qt(t,y,1+(Oe<_e)),y+=2,Oe<_e){Ae=zt(v,E,0),le=v,Ne=zt(P,G,0),Ee=P;var Lt=zt(fe,re,0);Qt(t,y,O-257),Qt(t,y+5,ve-1),Qt(t,y+10,Te-4),y+=14;for(var U=0;U<Te;++U)Qt(t,y+3*U,fe[oa[U]]);y+=3*Te;for(var Me=[ee,se],ye=0;ye<2;++ye)for(var we=Me[ye],U=0;U<we.length;++U){var ce=we[U]&31;Qt(t,y,Lt[ce]),y+=fe[ce],ce>15&&(Qt(t,y,we[U]>>5&127),y+=we[U]>>12)}}else Ae=zp,le=Sn,Ne=Up,Ee=Ho;for(var U=0;U<s;++U){var ue=o[U];if(ue>255){var ce=ue>>18&31;Oo(t,y,Ae[ce+257]),y+=le[ce+257],ce>7&&(Qt(t,y,ue>>23&31),y+=$r[ce]);var rt=ue&31;Oo(t,y,Ne[rt]),y+=Ee[rt],rt>3&&(Oo(t,y,ue>>5&8191),y+=Wr[rt])}else Oo(t,y,Ae[ue]),y+=le[ue]}return Oo(t,y,Ae[256]),y+le[256]},jp=new ca([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),xc=new ge(0),$p=function(e,t,n,o,a,r){var c=r.z||e.length,s=new ge(o+c+5*(1+Math.ceil(c/7e3))+a),h=s.subarray(o,s.length-a),m=r.l,y=(r.r||0)&7;if(t){y&&(h[0]=r.r>>3);for(var f=jp[t-1],v=f>>13,E=f&8191,I=(1<<n)-1,P=r.p||new ct(32768),G=r.h||new ct(I+1),q=Math.ceil(n/3),ee=2*q,O=function(uo){return(e[uo]^e[uo+1]<<q^e[uo+2]<<ee)&I},j=new ca(25e3),se=new ct(288),ve=new ct(32),pe=0,U=0,R=r.i||0,fe=0,re=r.w||0,Te=0;R+2<c;++R){var Ke=O(R),_e=R&32767,Oe=G[Ke];if(P[_e]=Oe,G[Ke]=_e,re<=R){var Ae=c-R;if((pe>7e3||fe>24576)&&(Ae>423||!m)){y=mc(e,h,0,j,se,ve,U,fe,Te,R-Te,y),fe=pe=U=0,Te=R;for(var le=0;le<286;++le)se[le]=0;for(var le=0;le<30;++le)ve[le]=0}var Ne=2,Ee=0,Lt=E,Me=_e-Oe&32767;if(Ae>2&&Ke==O(R-Me))for(var ye=Math.min(v,Ae)-1,we=Math.min(32767,R),ce=Math.min(258,Ae);Me<=we&&--Lt&&_e!=Oe;){if(e[R+Ne]==e[R+Ne-Me]){for(var ue=0;ue<ce&&e[R+ue]==e[R+ue-Me];++ue);if(ue>Ne){if(Ne=ue,Ee=Me,ue>ye)break;for(var rt=Math.min(Me,ue-2),tn=0,le=0;le<rt;++le){var nn=R-Me+le&32767,An=P[nn],Re=nn-An&32767;Re>tn&&(tn=Re,Oe=nn)}}}_e=Oe,Oe=P[_e],Me+=_e-Oe&32767}if(Ee){j[fe++]=268435456|ra[Ne]<<18|dc[Ee];var it=ra[Ne]&31,K=dc[Ee]&31;U+=$r[it]+Wr[K],++se[257+it],++ve[K],re=R+Ne,++pe}else j[fe++]=e[R],++se[e[R]]}}for(R=Math.max(R,re);R<c;++R)j[fe++]=e[R],++se[e[R]];y=mc(e,h,m,j,se,ve,U,fe,Te,R-Te,y),m||(r.r=y&7|h[y/8|0]<<3,y-=7,r.h=G,r.p=P,r.i=R,r.w=re)}else{for(var R=r.w||0;R<c+m;R+=65535){var Ut=R+65535;Ut>=c&&(h[y/8|0]=m,Ut=c),y=Sc(h,y+1,e.subarray(R,Ut))}r.i=c}return zo(s,0,o+ua(y)+a)},Wp=(function(){for(var e=new Int32Array(256),t=0;t<256;++t){for(var n=t,o=9;--o;)n=(n&1&&-306674912)^n>>>1;e[t]=n}return e})(),Yp=function(){var e=-1;return{p:function(t){for(var n=e,o=0;o<t.length;++o)n=Wp[n&255^t[o]]^n>>>8;e=n},d:function(){return~e}}};var Kp=function(e,t,n,o,a){if(!a&&(a={l:1},t.dictionary)){var r=t.dictionary.subarray(-32768),c=new ge(r.length+e.length);c.set(r),c.set(e,r.length),e=c,a.w=r.length}return $p(e,t.level==null?6:t.level,t.mem==null?a.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+t.mem,n,o,a)},Tc=function(e,t){var n={};for(var o in e)n[o]=e[o];for(var o in t)n[o]=t[o];return n};var Ht=function(e,t){return e[t]|e[t+1]<<8},ft=function(e,t){return(e[t]|e[t+1]<<8|e[t+2]<<16|e[t+3]<<24)>>>0},na=function(e,t){return ft(e,t)+ft(e,t+4)*4294967296},Ge=function(e,t,n){for(;n;++t)e[t]=n,n>>>=8};function Xp(e,t){return Kp(e,t||{},0,0)}function Jp(e,t){return qp(e,{i:2},t&&t.out,t&&t.dictionary)}var kc=function(e,t,n,o){for(var a in e){var r=e[a],c=t+a,s=o;Array.isArray(r)&&(s=Tc(o,r[1]),r=r[0]),ArrayBuffer.isView(r)?n[c]=[r,s]:(n[c+="/"]=[new ge(0),s],kc(r,c,n,o))}},fc=typeof TextEncoder<"u"&&new TextEncoder,sa=typeof TextDecoder<"u"&&new TextDecoder,Qp=0;try{sa.decode(xc,{stream:!0}),Qp=1}catch{}var Zp=function(e){for(var t="",n=0;;){var o=e[n++],a=(o>127)+(o>223)+(o>239);if(n+a>e.length)return{s:t,r:zo(e,n-1)};a?a==3?(o=((o&15)<<18|(e[n++]&63)<<12|(e[n++]&63)<<6|e[n++]&63)-65536,t+=String.fromCharCode(55296|o>>10,56320|o&1023)):a&1?t+=String.fromCharCode((o&31)<<6|e[n++]&63):t+=String.fromCharCode((o&15)<<12|(e[n++]&63)<<6|e[n++]&63):t+=String.fromCharCode(o)}};function hc(e,t){if(t){for(var n=new ge(e.length),o=0;o<e.length;++o)n[o]=e.charCodeAt(o);return n}if(fc)return fc.encode(e);for(var a=e.length,r=new ge(e.length+(e.length>>1)),c=0,s=function(y){r[c++]=y},o=0;o<a;++o){if(c+5>r.length){var h=new ge(c+8+(a-o<<1));h.set(r),r=h}var m=e.charCodeAt(o);m<128||t?s(m):m<2048?(s(192|m>>6),s(128|m&63)):m>55295&&m<57344?(m=65536+(m&1047552)|e.charCodeAt(++o)&1023,s(240|m>>18),s(128|m>>12&63),s(128|m>>6&63),s(128|m&63)):(s(224|m>>12),s(128|m>>6&63),s(128|m&63))}return zo(r,0,c)}function em(e,t){if(t){for(var n="",o=0;o<e.length;o+=16384)n+=String.fromCharCode.apply(null,e.subarray(o,o+16384));return n}else{if(sa)return sa.decode(e);var a=Zp(e),r=a.s,n=a.r;return n.length&&Fe(8),r}}var tm=function(e,t){return t+30+Ht(e,t+26)+Ht(e,t+28)},nm=function(e,t,n){var o=Ht(e,t+28),a=Ht(e,t+30),r=em(e.subarray(t+46,t+46+o),!(Ht(e,t+8)&2048)),c=t+46+o,s=om(e,c,a,n,ft(e,t+20),ft(e,t+24),ft(e,t+42)),h=s[0],m=s[1],y=s[2];return[Ht(e,t+10),h,m,r,c+a+Ht(e,t+32),y]},om=function(e,t,n,o,a,r,c){var s=a==4294967295,h=r==4294967295,m=c==4294967295,y=t+n,f=s+h+m;if(o&&f){for(;t+4<y;t+=4+Ht(e,t+2))if(Ht(e,t)==1)return[s?na(e,t+4+8*h):a,h?na(e,t+4):r,m?na(e,t+4+8*(h+s)):c,1];o<2&&Fe(13)}return[a,r,c,0]},la=function(e){var t=0;if(e)for(var n in e){var o=e[n].length;o>65535&&Fe(9),t+=o+4}return t},gc=function(e,t,n,o,a,r,c,s){var h=o.length,m=n.extra,y=s&&s.length,f=la(m);Ge(e,t,c!=null?33639248:67324752),t+=4,c!=null&&(e[t++]=20,e[t++]=n.os),e[t]=20,t+=2,e[t++]=n.flag<<1|(r<0&&8),e[t++]=a&&8,e[t++]=n.compression&255,e[t++]=n.compression>>8;var v=new Date(n.mtime==null?Date.now():n.mtime),E=v.getFullYear()-1980;if((E<0||E>119)&&Fe(10),Ge(e,t,E<<25|v.getMonth()+1<<21|v.getDate()<<16|v.getHours()<<11|v.getMinutes()<<5|v.getSeconds()>>1),t+=4,r!=-1&&(Ge(e,t,n.crc),Ge(e,t+4,r<0?-r-2:r),Ge(e,t+8,n.size)),Ge(e,t+12,h),Ge(e,t+14,f),t+=16,c!=null&&(Ge(e,t,y),Ge(e,t+6,n.attrs),Ge(e,t+10,c),t+=14),e.set(o,t),t+=h,f)for(var I in m){var P=m[I],G=P.length;Ge(e,t,+I),Ge(e,t+2,G),e.set(P,t+4),t+=4+G}return y&&(e.set(s,t),t+=y),t},rm=function(e,t,n,o,a){Ge(e,t,101010256),Ge(e,t+8,n),Ge(e,t+10,n),Ge(e,t+12,o),Ge(e,t+16,a)};function Ac(e,t){t||(t={});var n={},o=[];kc(e,"",n,t);var a=0,r=0;for(var c in n){var s=n[c],h=s[0],m=s[1],y=m.level==0?0:8,f=hc(c),v=f.length,E=m.comment,I=E&&hc(E),P=I&&I.length,G=la(m.extra);v>65535&&Fe(11);var q=y?Xp(h,m):h,ee=q.length,O=Yp();O.p(h),o.push(Tc(m,{size:h.length,crc:O.d(),c:q,f,m:I,u:v!=c.length||I&&E.length!=P,o:a,compression:y})),a+=30+v+G+ee,r+=76+2*(v+G)+(P||0)+ee}for(var j=new ge(r+22),se=a,ve=r-a,pe=0;pe<o.length;++pe){var f=o[pe];gc(j,f.o,f,f.f,f.u,f.c.length);var U=30+f.f.length+la(f.extra);j.set(f.c,f.o+U),gc(j,a,f,f.f,f.u,f.c.length,f.o,f.m),a+=16+U+(f.m?f.m.length:0)}return rm(j,a,o.length,ve,se),j}function Ec(e,t){for(var n={},o=e.length-22;ft(e,o)!=101010256;--o)(!o||e.length-o>65558)&&Fe(13);var a=Ht(e,o+8);if(!a)return{};var r=ft(e,o+16),c=ft(e,o-20)==117853008;if(c){var s=ft(e,o-12);c=ft(e,s)==101075792,c&&(a=ft(e,s+32),r=ft(e,s+48))}for(var h=t&&t.filter,m=0;m<a;++m){var y=nm(e,r,c),f=y[0],v=y[1],E=y[2],I=y[3],P=y[4],G=y[5],q=tm(e,G);r=P,(!h||h({name:I,size:v,originalSize:E,compression:f}))&&(f?f==8?n[I]=Jp(e.subarray(q,q+v),{out:new ge(E)}):Fe(14,"unknown compression type "+f):n[I]=zo(e,q,q+v))}return n}var ti="https://devel.kamotimestamps.com",Rc="308989572223-cdnvpn65mc51oqneu7po3og51uf5ahsb.apps.googleusercontent.com",im="https://www.youtube.com/",Dc="timekeeper_sync_auth",Pc="timekeeper_sync_oauth",_n="syncAuthState",_c="syncCursors",am=500,sm=5e3,Mc=200,lm=500,cm=60*1e3,um=60*1e3,dm=300*1e3;function Nn(){return!!(ti&&Rc)}var Oc=xe({accessToken:Y(),accessTokenExpiresAt:Ce({finite:!0}),refreshToken:Y(),user:xe({id:Y(),email:Y(),displayName:et(Y())})}),pm=xe({records:hn.array(),seq:Ce({int:!0,nonnegative:!0}),hasMore:_t()}),mm=xe({known:_t(),membersOnly:et(_t()),channelId:et(Y())}),fm=xe({rejected:hn.array(),fromSeq:Ce({int:!0,nonnegative:!0}),seq:Ce({int:!0,nonnegative:!0})}),hm=xe({type:Y(),seq:Se(Ce({int:!0,nonnegative:!0})),fromSeq:Se(Ce({int:!0,nonnegative:!0})),records:Se(hn.array())}),gm=xe({type:Y(),idToken:Se(Y()),error:Se(Y())}),Tn=class extends Error{},Qr=class extends Error{constructor(n,o){super(o);this.httpStatus=n}},vm=e=>e instanceof Qr&&e.httpStatus>=400&&e.httpStatus<500&&e.httpStatus!==408&&e.httpStatus!==429,Go="signed-out",Kr="",On=!1,pa=null,ro=new Set,Nc=new Map,Fo=new Map,ut=!0,Zt=null,xn=null,ni=0,no=null,Ic=0,en=!0,Uo=null,va=0,ma=null,Lc=!1,$e={pushCounter:0,pullSeq:0},ya=new Map,Bc=Promise.resolve(),Xr=!1,Yr=null,Zr="",da=!1,oi=null,Hc=null,fa=null,Jr=null,zc=null;function We(){return Wl()}function Gc(e){Hc=e}function Uc(e){fa=e}function Fc(e){Jr=e}function Vc(e){zc=e}var qc="#52c41a",jc="#ff4d4f",oo="#ffa500";function io(){let e=We();if(fa){let t=fa;if(t.style.fontWeight="bold",t.onmouseenter=null,t.onmouseleave=null,!Nn())$(t,"alert-triangle","Sync backend is not configured in this build"),t.style.color=oo;else if(!e.isSignedIn)$(t,"circle-x","Not signed in"),t.style.color=jc;else{$(t,"circle-check","Signed in"),t.style.color=qc;let n=e.userName;n&&(t.onmouseenter=()=>$(t,"circle-check",`Signed in as ${n}`),t.onmouseleave=()=>$(t,"circle-check","Signed in"))}}if(Jr){let{text:t,color:n}=$c(e);Jr.textContent=t,Jr.style.color=n}zc?.(),Wc?.()}function $c(e=We()){if(Go==="error")return{text:Kr||"Sync error",color:jc,busy:!1};if(Go==="connecting")return{text:Kr||"Connecting\u2026",color:oo,busy:!0};if(e.isSignedIn&&Go==="offline")return{text:Kr||"Offline. Retrying\u2026",color:oo,busy:!1};if(e.isSignedIn&&Go==="online"){let t=On?"Syncing\u2026":"Live sync on";return!On&&pa&&(t+=` \xB7 last synced ${new Date(pa).toLocaleTimeString()}`),!On&&ro.size>0?(t+=` \xB7 ${ro.size} timestamp${ro.size===1?"":"s"} could not be synced`,{text:t,color:oo,busy:!1}):{text:t,color:On?oo:qc,busy:On}}return{text:"",color:"#aaa",busy:!1}}var ym="#4285f4";function Vo(){if(!Nn()||!We().isSignedIn)return null;let{text:e,color:t,busy:n}=$c();return e?{color:n?ym:t,tooltip:`Sync: ${e}`}:{color:oo,tooltip:"Sync: starting\u2026"}}var Wc=null;function Yc(e){Wc=e}function ht(e,t=""){Go=e,Kr=t,io()}function Kc(){return typeof GM<"u"&&GM&&typeof GM.getValue=="function"&&typeof GM.setValue=="function"?GM:null}async function Xc(){let e=Kc();if(!e)return Kt(_n);let t=await e.getValue(_n);if(t!=null)return t;let n=await Kt(_n);return n&&(await e.setValue(_n,n),await wn(_n,null)),n??void 0}async function ri(){try{let e=Kc();e?await e.setValue(_n,We()):await wn(_n,We())}catch(e){l("Failed to save sync auth state:",e,"error")}}function qo(){wn(_c,{userId:We().userId,...$e})}async function wm(){let e=await Kt(_c);e&&e.userId===We().userId&&typeof e.pushCounter=="number"&&typeof e.pullSeq=="number"?$e={pushCounter:e.pushCounter,pullSeq:e.pullSeq}:$e={pushCounter:0,pullSeq:0}}function wa(e,t){return fetch(`${ti}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)})}function Jc(e){oi=null,eo({isSignedIn:!0,accessToken:e.accessToken,accessTokenExpiresAt:e.accessTokenExpiresAt,refreshToken:e.refreshToken,userId:e.user.id,userName:e.user.displayName,email:e.user.email})}var Qc=e=>!!e.accessToken&&e.accessToken!==oi&&!!e.accessTokenExpiresAt&&e.accessTokenExpiresAt-Date.now()>cm;async function bm(e){return typeof navigator<"u"&&navigator.locks?await navigator.locks.request("timekeeper-sync-refresh",e):e()}async function Sm(){let e=await Xc();if(e==null)return;let t=Mi.safeParse(e);t.success&&eo(t.data)}function xm(){return Yr??(Yr=bm(async()=>{await Sm();let e=We();if(!e.isSignedIn||!e.refreshToken)throw new Tn("Not signed in");if(Qc(e))return e.accessToken;let t=await wa("/auth/refresh",{refreshToken:e.refreshToken});if(t.status===401)throw new Tn("Session expired");if(!t.ok)throw new Error(`Token refresh failed (HTTP ${t.status})`);let n=Oc.safeParse(await t.json());if(!n.success)throw new Error("Unexpected token refresh response");return Jc(n.data),await ri(),n.data.accessToken}).finally(()=>{Yr=null})),Yr}async function Zc(){let e=We();if(!e.isSignedIn||!e.refreshToken)throw new Tn("Not signed in");return Qc(e)?e.accessToken:xm()}async function eu(e,t,n=!0){let o=await Zc(),a=await fetch(`${ti}${e}`,{method:t.method,headers:{Authorization:`Bearer ${o}`,"Content-Type":"application/json"},body:t.body===void 0?void 0:JSON.stringify(t.body)});if(a.status===401){if(!n)throw new Tn("Session expired");return oi=o,eu(e,t,!1)}return a}async function ei(e,t,n){let o=await eu(e,t);if(!o.ok)throw new Qr(o.status,`${t.method} ${e} failed (HTTP ${o.status})`);let a=n.safeParse(await o.json());if(!a.success)throw new Error(`Unexpected response from ${e}`);return a.data}function Tm(e){try{let t=e.split(".")[1].replace(/-/g,"+").replace(/_/g,"/");return JSON.parse(atob(t.padEnd(Math.ceil(t.length/4)*4,"=")))}catch{return null}}function km(e,t,n){return new Promise((o,a)=>{let r=()=>{clearTimeout(c),e.close();try{t.close()}catch{}},c=setTimeout(()=>{r(),a(new Error("Sign-in timed out"))},dm);e.onmessage=s=>{let h=gm.safeParse(s.data);if(h.success){if(h.data.type==="timekeeper_sync_oauth_error")r(),a(new Error(h.data.error||"Google sign-in failed"));else if(h.data.type==="timekeeper_sync_oauth_token"&&h.data.idToken){if(Tm(h.data.idToken)?.nonce!==n)return;r(),o(h.data.idToken)}}}})}function tu(){let e=window.location.hash;if(!e||e.length<=1)return!1;let t=new URLSearchParams(e.substring(1));if(t.get("state")!==Dc)return!1;let n=t.get("id_token"),o=t.get("error_description")||t.get("error");if(!n&&!o)return!1;try{let a=new BroadcastChannel(Pc);a.postMessage(o?{type:"timekeeper_sync_oauth_error",error:o}:{type:"timekeeper_sync_oauth_token",idToken:n}),a.close()}catch(a){console.error("[Timekeeper] Failed to hand sync sign-in result to the opener:",a)}return history.replaceState&&history.replaceState(null,"",window.location.pathname+window.location.search),window.close(),!0}async function nu(){if(!Nn()){ht("error","Sync backend is not configured in this build");return}if(We().isSignedIn||da)return;da=!0,ht("connecting","Opening Google sign-in\u2026");let e=crypto.randomUUID(),t=new BroadcastChannel(Pc);try{let n=new URL("https://accounts.google.com/o/oauth2/v2/auth");n.searchParams.set("client_id",Rc),n.searchParams.set("redirect_uri",im),n.searchParams.set("response_type","id_token"),n.searchParams.set("scope","openid email profile"),n.searchParams.set("nonce",e),n.searchParams.set("state",Dc),n.searchParams.set("prompt","select_account");let o=window.open(n.toString(),"TimekeeperSyncAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!o)throw new Error("Popup blocked. Please enable popups for YouTube.");ht("connecting","Waiting for Google sign-in\u2026");let a=await km(t,o,e);ht("connecting","Signing in to Timekeeper Sync\u2026");let r=await wa("/auth/google",{idToken:a});if(!r.ok)throw new Error(r.status===401?"Google sign-in was rejected by the server":`Sign-in failed (HTTP ${r.status})`);let c=Oc.safeParse(await r.json());if(!c.success)throw new Error("Unexpected response from the sync server");Jc(c.data),await ri(),$e={pushCounter:0,pullSeq:0},qo(),l(`Signed in to Timekeeper Sync as ${c.data.user.displayName??"an account with no display name"}`),await cu()}catch(n){t.close(),l("Sync sign-in failed:",n,"error"),ht("error",n instanceof Error?n.message:"Sign-in failed")}finally{da=!1}}var ha=e=>`${e.channelId}:${e.membersOnly}`;function ou(e){Nc.set(e.videoId,e),ut||Am(e)}async function Am(e){let t=ha(e);if(Fo.get(e.videoId)!==t)try{if(!(await Hi(e.videoId))?.some(a=>!a.deleted_at))return;let o=await ei(`/videos/${encodeURIComponent(e.videoId)}/access`,{method:"GET"},mm);(!o.known||o.membersOnly!==e.membersOnly||o.channelId!==e.channelId)&&await ei("/videos/access",{method:"POST",body:{videos:[e]}},xe({ok:_t()})),Fo.set(e.videoId,t)}catch(n){l("Reporting the members-only status failed:",n,"warn")}}async function ru(){let{refreshToken:e}=We();if(uu(),eo(Kn),$e={pushCounter:0,pullSeq:0},ya.clear(),ro.clear(),Fo.clear(),await ri(),qo(),ht("signed-out"),e&&Nn())try{await wa("/auth/logout",{refreshToken:e})}catch(t){l("Sync logout request failed:",t,"warn")}}function iu(){uu(),eo(Kn),ri(),ht("error","Session expired. Please sign in again.")}function au(e){let t=Bc.then(e);return Bc=t.catch(()=>{}),t}function ao(){ut||Xr||(Xr=!0,au(async()=>{Xr=!1,await Im()}).catch(e=>l("Sync: cycle crashed:",e,"error")))}async function ba(e){if(e.length!==0){for(let t of e)ya.set(t.guid,t.write_counter??0);await Gi(e),Hc?.([...new Set(e.map(t=>t.video_id))])}}function su(e,t){return e>$e.pullSeq?(en=!0,!1):(t>$e.pullSeq&&($e.pullSeq=t,qo()),!0)}async function Em(){for(;;){let e=await ei(`/sync/pull?since=${$e.pullSeq}&limit=${lm}`,{method:"GET"},pm);await ba(e.records);let t=e.seq!==$e.pullSeq;if($e.pullSeq=e.seq,qo(),!e.hasMore||!t)return}}async function ga(e){try{let t=[...new Set(e.map(o=>o.video_id))].map(o=>Nc.get(o)).filter(o=>!!o&&Fo.get(o.videoId)!==ha(o)),n=await ei("/sync/push",{method:"POST",body:{deviceId:Zr,records:e,videos:t}},fm);for(let o of t)Fo.set(o.videoId,ha(o));await ba(n.rejected);for(let o of e)ro.delete(o.guid);su(n.fromSeq,n.seq)||ao()}catch(t){if(!vm(t))throw t;if(e.length>1){let n=e.length>>1;await ga(e.slice(0,n)),await ga(e.slice(n));return}ro.add(e[0].guid),l(`Sync: server refused timestamp ${e[0].guid}; leaving it local-only:`,t,"warn")}}async function Mm(){let e=await zi($e.pushCounter);if(e.length===0)return;let t=e.filter(n=>(ya.get(n.guid)??0)<n.write_counter);for(let n=0;n<t.length;n+=Mc)await ga(t.slice(n,n+Mc));$e.pushCounter=Math.max($e.pushCounter,e[e.length-1].write_counter),qo()}async function Im(){if(!ut){On=!0,io();try{(en||!Zt)&&(await Em(),en=!1),await Mm(),pa=Date.now(),va=0}catch(e){if(e instanceof Tn){iu();return}l("Sync cycle failed:",e,"warn"),en=!0,Lm()}finally{On=!1,io()}}}function lu(e){return Math.min(um,1e3*2**e)*(.5+Math.random()/2)}function Lm(){ut||Uo||(Uo=setTimeout(()=>{Uo=null,ao()},lu(va++)))}function Bm(){if(ut)return;let e=Date.now();no?clearTimeout(no):Ic=e;let t=Math.max(0,Math.min(am,Ic+sm-e));no=setTimeout(()=>{no=null,ao()},t)}function Sa(){ut||(en=!0,Zt||(ni=0,xn&&clearTimeout(xn),xn=null,xa()),ao())}function Cc(){ut||xn||(xn=setTimeout(()=>{xn=null,xa()},lu(ni++)))}async function xa(){if(ut||Zt)return;ht("connecting");let e;try{e=await Zc()}catch(n){return n instanceof Tn?iu():(l("Sync: could not get an access token:",n,"warn"),ht("offline"),Cc())}if(ut||Zt)return;let t=new WebSocket(`${ti.replace(/^http/,"ws")}/sync/ws`);Zt=t,t.onopen=()=>t.send(JSON.stringify({type:"auth",token:e,deviceId:Zr})),t.onmessage=n=>{let o;try{o=JSON.parse(String(n.data))}catch{return}let a=hm.safeParse(o);if(a.success){if(a.data.type==="ready")ni=0,ht("online"),(a.data.seq===void 0||a.data.seq!==$e.pullSeq)&&(en=!0),ao();else if(a.data.type==="changes"&&a.data.records){let{fromSeq:r,seq:c,records:s}=a.data;au(async()=>{await ba(s),(r===void 0||c===void 0)&&(en=!0),(en||!su(r,c))&&ao()}).catch(h=>l("Sync: failed to apply live changes:",h,"error"))}}},t.onclose=n=>{Zt===t&&(Zt=null),en=!0,!ut&&(n.code===4401&&(oi=e),ht("offline"),Cc())},t.onerror=()=>{}}async function cu(){if(ut){if(!Zr){let e=await Kt("device_id");Zr=typeof e=="string"&&e?e:crypto.randomUUID()}ut=!1,va=0,ni=0,ma=Ui(Bm),Lc||(Lc=!0,window.addEventListener("online",()=>Sa())),await xa()}}function uu(){ut=!0,ma?.(),ma=null;for(let t of[no,Uo,xn])t&&clearTimeout(t);no=Uo=xn=null,Xr=!1;let e=Zt;Zt=null;try{e?.close()}catch{}}async function du(){if(!Nn()){io();return}try{let e=Mi.safeParse(await Xc());e.success&&eo(e.data);let t=We();t.isSignedIn&&t.refreshToken?(await wm(),await cu()):ht("signed-out")}catch(e){l("Failed to load sync auth state:",e,"error")}}function gt(){return Nt()}var vt={get isSignedIn(){return Nt().isSignedIn},get accessToken(){return Nt().accessToken},get userName(){return Nt().userName},get email(){return Nt().email},set isSignedIn(e){let t=Nt();Mt({...t,isSignedIn:e})},set accessToken(e){let t=Nt();Mt({...t,accessToken:e})},set userName(e){let t=Nt();Mt({...t,userName:e})},set email(e){let t=Nt();Mt({...t,email:e})}};function Yo(){return je().auth.autoBackupEnabled}function Gt(){return je().auth.autoBackupIntervalMinutes}var Aa=null,oe=null,te=null,zn=null;function hu(e){Aa=e}function gu(e){oe=e}function vu(e){te=e}function yu(e){zn=e}var pu=!1;function wu(){if(!pu)try{let e=document.createElement("style");e.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(e),pu=!0}catch{}}var bu=null,Ea=null,jo=null,$o=null,Ma=null;function Su(e){bu=e}function xu(e){Ea=e}function Ia(e){jo=e}function La(e){$o=e}function Tu(e){Ma=e}var ai="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",ku="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",Au="https://www.youtube.com/",Rm=new Date(Date.UTC(2e3,0,1,0,0,0)),Dm=30*1e3,Pm=1800*1e3,mu=5,ii=null,Ye=null;async function Ba(){try{let e=await $o("googleAuthState"),t=e&&typeof e=="object"?{...e,accessToken:e.accessToken?"[REDACTED]":null}:e;l("Loading Google auth state from IndexedDB:",t);let n=Ei.safeParse(e);if(n.success){let o=gt();Mt({...o,...n.data});let a=gt();a.isSignedIn&&a.accessToken&&l(`Reusing stored Google auth token for ${a.userName||a.email||"user"}`),co();let r=gt();r.isSignedIn&&r.accessToken&&await kn(!0)}else if(e!==void 0){let o=e&&typeof e=="object"?{...e,accessToken:e.accessToken?"[REDACTED]":null}:e;l("Google auth state failed validation:",{stored:o,errors:n.error.message},"warn")}}catch(e){l("Failed to load Google auth state:",e,"error")}}async function Ko(){try{let e=gt(),t=Ei.safeParse(e);if(!t.success){let n={...e,accessToken:e.accessToken?"[REDACTED]":null};l("Invalid auth state, cannot save",{state:n,errors:t.error.message},"error");return}await jo("googleAuthState",e),e.isSignedIn&&e.accessToken?l(`Saved Google auth state to IndexedDB for ${e.userName||e.email||"user"}`):l("Cleared Google auth state in IndexedDB (signed out)")}catch(e){l("Failed to save Google auth state:",e,"error")}}function co(){Aa&&(Aa.style.display="none")}function ot(e,t){if(!te)return;if(te.style.fontWeight="bold",e==="authenticating"){wu(),te.style.color="#ffa500",te.replaceChildren();let o=document.createElement("span");o.className="tk-auth-spinner";let a=document.createTextNode(` ${t||"Authorizing with Google\u2026"}`);te.appendChild(o),te.appendChild(a);return}if(e==="error"){$(te,"circle-x",t||"Authorization failed"),te.style.color="#ff4d4f",ke();return}let n=gt();n.isSignedIn?($(te,"circle-check","Signed in"),te.style.color="#52c41a",te.removeAttribute("title"),n.userName?(te.onmouseenter=()=>{$(te,"circle-check",`Signed in as ${n.userName}`)},te.onmouseleave=()=>{$(te,"circle-check","Signed in")}):(te.onmouseenter=null,te.onmouseleave=null)):($(te,"circle-x","Not signed in"),te.style.color="#ff4d4f",te.removeAttribute("title"),te.onmouseenter=null,te.onmouseleave=null),ke()}function _m(){te&&(wu(),te.classList.remove("tk-auth-blink"),te.offsetWidth,te.classList.add("tk-auth-blink"),setTimeout(()=>{te.classList.remove("tk-auth-blink")},1200))}function Eu(e,t=300*1e3){return new Promise((n,o)=>{if(!e){l&&l("OAuth monitor: popup is null",null,"error"),o(new Error("Failed to open popup"));return}l&&l("OAuth monitor: starting to monitor popup for token");let a=Date.now(),r="timekeeper_oauth",c=null,s=null,h=null,m=()=>{if(c){try{c.close()}catch{}c=null}s&&(clearInterval(s),s=null),h&&(clearInterval(h),h=null)};try{c=new BroadcastChannel(r),l&&l("OAuth monitor: BroadcastChannel created successfully"),c.onmessage=v=>{let E=v.data?.token?{...v.data,token:"[REDACTED]"}:v.data;l&&l("OAuth monitor: received BroadcastChannel message",E);let I=xe({type:Y(),token:Se(Y()),error:Se(Y())}).safeParse(v.data);if(!I.success){l&&l("OAuth monitor: invalid message format",I.error,"warn");return}if(I.data.type==="timekeeper_oauth_token"&&I.data.token){l&&l("OAuth monitor: token received via BroadcastChannel"),m();try{e.close()}catch{}n(I.data.token)}else if(I.data.type==="timekeeper_oauth_error"){l&&l("OAuth monitor: error received via BroadcastChannel",I.data.error,"error"),m();try{e.close()}catch{}o(new Error(I.data.error||"OAuth failed"))}}}catch(v){l&&l("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",v)}l&&l("OAuth monitor: setting up IndexedDB polling");let y=Date.now();s=setInterval(async()=>{try{let v=indexedDB.open("ytls-timestamps-db",4);v.onsuccess=()=>{let E=v.result,G=E.transaction("settings","readonly").objectStore("settings").get("oauth_message");G.onsuccess=()=>{let q=G.result;if(q&&q.value){let ee=q.value,O=xe({type:Y(),token:Se(Y()),error:Se(Y()),timestamp:Se(Ce())}).safeParse(ee);if(!O.success){l&&l("OAuth monitor: invalid IndexedDB message format",O.error,"warn");return}if(O.data.timestamp&&O.data.timestamp>y){let j=O.data.token?{...O.data,token:"[REDACTED]"}:O.data;if(l&&l("OAuth monitor: received IndexedDB message",j),O.data.type==="timekeeper_oauth_token"&&O.data.token){l&&l("OAuth monitor: token received via IndexedDB"),m();try{e.close()}catch{}E.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),n(O.data.token)}else if(O.data.type==="timekeeper_oauth_error"){l&&l("OAuth monitor: error received via IndexedDB",O.data.error,"error"),m();try{e.close()}catch{}E.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),o(new Error(O.data.error||"OAuth failed"))}y=O.data.timestamp||Date.now()}}E.close()}}}catch(v){l&&l("OAuth monitor: IndexedDB polling error",v,"error")}},500),h=setInterval(()=>{if(Date.now()-a>t){l&&l("OAuth monitor: popup timed out after 5 minutes",null,"error"),m();try{e.close()}catch{}o(new Error("OAuth popup timed out"));return}},1e3)})}async function Mu(){if(!ai){ot("error","Google Client ID not configured");return}try{l&&l("OAuth signin: starting OAuth flow"),ot("authenticating","Opening authentication window...");let e=new URL("https://accounts.google.com/o/oauth2/v2/auth");e.searchParams.set("client_id",ai),e.searchParams.set("redirect_uri",Au),e.searchParams.set("response_type","token"),e.searchParams.set("scope",ku),e.searchParams.set("include_granted_scopes","true"),e.searchParams.set("state","timekeeper_auth"),l&&l("OAuth signin: opening popup");let t=window.open(e.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!t){l&&l("OAuth signin: popup blocked by browser",null,"error"),ot("error","Popup blocked. Please enable popups for YouTube.");return}l&&l("OAuth signin: popup opened successfully"),ot("authenticating","Waiting for authentication...");try{let n=await Eu(t),o=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${n}`}});if(o.ok){let a=await o.json(),r=xe({name:Se(Y()),email:Se(Y())}).safeParse(a);if(!r.success)throw l&&l("Failed to validate user info response",r.error,"error"),new Error("Invalid user info response");let c=r.data;Mt({isSignedIn:!0,accessToken:n,userName:c.name||null,email:c.email||null}),await Ko(),co(),ot(),ke(),await kn(),l?l(`Successfully authenticated as ${c.name}`):console.log(`[Timekeeper] Successfully authenticated as ${c.name}`)}else throw new Error("Failed to fetch user info")}catch(n){let o=n instanceof Error?n.message:"Authentication failed";l?l("OAuth failed:",n,"error"):console.error("[Timekeeper] OAuth failed:",n),ot("error",o);return}}catch(e){let t=e instanceof Error?e.message:"Sign in failed";l?l("Failed to sign in to Google:",e,"error"):console.error("[Timekeeper] Failed to sign in to Google:",e),ot("error",`Failed to sign in: ${t}`)}}async function Om(){let e=gt(),t=e.email;if(!ai||!t)return!1;l("Silent OAuth: attempting silent token refresh for "+t);let n=new URL("https://accounts.google.com/o/oauth2/v2/auth");n.searchParams.set("client_id",ai),n.searchParams.set("redirect_uri",Au),n.searchParams.set("response_type","token"),n.searchParams.set("scope",ku),n.searchParams.set("include_granted_scopes","true"),n.searchParams.set("state","timekeeper_auth"),n.searchParams.set("prompt","none"),n.searchParams.set("login_hint",t);let o=window.open(n.toString(),"TimekeeperGoogleAuthSilent","width=1,height=1,left=-2000,top=-2000,menubar=no,toolbar=no,location=no");if(!o)return l("Silent OAuth: popup blocked",null,"warn"),!1;try{let a=await Eu(o,15e3);return Mt({...e,isSignedIn:!0,accessToken:a}),await Ko(),co(),ot(),l("Silent OAuth: token refreshed successfully for "+t),!0}catch(a){l("Silent OAuth: silent refresh failed",a,"warn");try{o.close()}catch{}return!1}}async function Iu(){if(!window.opener||window.opener===window)return!1;l&&l("OAuth popup: detected popup window, checking for OAuth response");let e=window.location.hash;if(!e||e.length<=1)return l&&l("OAuth popup: no hash params found"),!1;let t=e.startsWith("#")?e.substring(1):e,n=new URLSearchParams(t),o=n.get("state");if(l&&l("OAuth popup: hash params found, state="+o),o!=="timekeeper_auth")return l&&l("OAuth popup: not our OAuth flow (wrong state)"),!1;let a=n.get("error"),r=n.get("access_token"),c="timekeeper_oauth";if(a){try{let s=new BroadcastChannel(c);s.postMessage({type:"timekeeper_oauth_error",error:n.get("error_description")||a}),s.close(),l&&l("OAuth popup: error broadcast via BroadcastChannel")}catch{let h={type:"timekeeper_oauth_error",error:n.get("error_description")||a,timestamp:Date.now()};l&&l("OAuth popup: writing error to IndexedDB",h);let m=indexedDB.open("ytls-timestamps-db",4);m.onsuccess=()=>{let y=m.result,v=y.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:h});v.onsuccess=()=>{l&&l("OAuth popup: error written to IndexedDB successfully")},v.onerror=()=>{l&&l("OAuth popup: failed to write error to IndexedDB",v.error,"error")},y.close()},m.onerror=()=>{l&&l("OAuth popup: failed to open IndexedDB",m.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(r){l&&l("OAuth popup: access token found, broadcasting to opener");try{let s=new BroadcastChannel(c);s.postMessage({type:"timekeeper_oauth_token",token:r}),s.close(),l&&l("OAuth popup: token broadcast via BroadcastChannel")}catch(s){l&&l("OAuth popup: BroadcastChannel failed, using IndexedDB",s);let h={type:"timekeeper_oauth_token",token:r,timestamp:Date.now()},m={...h,token:"[REDACTED]"};l&&l("OAuth popup: writing token to IndexedDB",m);let y=indexedDB.open("ytls-timestamps-db",4);y.onsuccess=()=>{let f=y.result,E=f.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:h});E.onsuccess=()=>{l&&l("OAuth popup: token written to IndexedDB successfully")},E.onerror=()=>{l&&l("OAuth popup: failed to write token to IndexedDB",E.error,"error")},f.close()},y.onerror=()=>{l&&l("OAuth popup: failed to open IndexedDB",y.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function Lu(){Mt({isSignedIn:!1,accessToken:null,userName:null,email:null}),await Ko(),await kn(),co(),ot(),ke()}async function Bu(){let e=gt();if(!e.isSignedIn||!e.accessToken)return!1;try{let t=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${e.accessToken}`}});return t.status===401?(await Du({silent:!0}),!1):t.ok}catch(t){return l("Failed to verify auth state:",t,"error"),!1}}function si(){let e=gt();return e.isSignedIn&&!!e.accessToken}function lo(){return si()}function Nm(){let e=[];return si()&&e.push("Google Drive"),e}function Hm(e){let t=Ec(new Uint8Array(e)),n=Object.values(t)[0];return n?new TextDecoder().decode(n):null}async function Cu(e){let t={Authorization:`Bearer ${e}`},o=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,a=await fetch(o,{headers:t});if(a.status===401)throw new Error("unauthorized");if(!a.ok)throw new Error("drive search failed");let r=await a.json();if(Array.isArray(r.files)&&r.files.length>0)return r.files[0].id;let c=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...t,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(c.status===401)throw new Error("unauthorized");if(!c.ok)throw new Error("drive folder create failed");return(await c.json()).id}async function Ru(e,t,n){let o=`name='${e}' and '${t}' in parents and trashed=false`,a=encodeURIComponent(o),r=encodeURIComponent("modifiedTime desc"),c=await fetch(`https://www.googleapis.com/drive/v3/files?q=${a}&orderBy=${r}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${n}`}});if(c.status===401)throw new Error("unauthorized");if(!c.ok)throw new Error(`drive search failed (${c.status})`);let s=await c.json();return s.files&&s.files.length>0?s.files[0].id:null}async function fu(e){let t=await Cu(e),n=await Ru("timekeeper-data.zip",t,e);if(!n)return null;let o=await fetch(`https://www.googleapis.com/drive/v3/files/${n}?alt=media`,{headers:{Authorization:`Bearer ${e}`}});if(o.status===401)throw new Error("unauthorized");if(!o.ok)throw new Error(`drive download failed (${o.status})`);let a=await o.arrayBuffer();try{return Hm(a)}catch(r){return l("Remote backup could not be decoded; the next upload will replace it:",r,"warn"),null}}async function zm(){if(!Ea)return;let e=gt();if(!e.isSignedIn||!e.accessToken)return;let t;try{t=await fu(e.accessToken)}catch(a){if(a.message!=="unauthorized")throw a;await Du({silent:!0});let r=gt();if(!r.isSignedIn||!r.accessToken)throw a;t=await fu(r.accessToken)}if(!t)return;let{mergedVideos:n,mergedTimestamps:o}=await Ea(t);o>0&&(l(`Pre-backup merge: added ${o} timestamps from ${n} videos from remote`),Ma&&Ma())}function Gm(e,t){let n=new TextEncoder().encode(e),o=t.replace(/\\/g,"/").replace(/^\/+/,"");return o.endsWith(".json")||(o+=".json"),Ac({[o]:[n,{level:6,mtime:Rm,os:0}]})}async function Um(e,t,n,o){let a=e.replace(/\.json$/,".zip"),r=await Ru(a,n,o),c=new TextEncoder().encode(t).length,s=Gm(t,e),h=s.length;l(`Compressing data: ${c} bytes -> ${h} bytes (${Math.round(100-h/c*100)}% reduction)`);let m="-------314159265358979",y=`\r
--${m}\r
`,f=`\r
--${m}--`,v=r?{name:a,mimeType:"application/zip"}:{name:a,mimeType:"application/zip",parents:[n]},E=8192,I="";for(let j=0;j<s.length;j+=E){let se=s.subarray(j,Math.min(j+E,s.length));I+=String.fromCharCode.apply(null,Array.from(se))}let P=btoa(I),G=y+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify(v)+y+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+P+f,q,ee;r?(q=`https://www.googleapis.com/upload/drive/v3/files/${r}?uploadType=multipart&fields=id,name`,ee="PATCH"):(q="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",ee="POST");let O=await fetch(q,{method:ee,headers:{Authorization:`Bearer ${o}`,"Content-Type":`multipart/related; boundary=${m}`},body:G});if(O.status===401)throw new Error("unauthorized");if(!O.ok)throw new Error("drive upload failed")}async function Du(e){l("Auth expired, attempting silent token refresh",null,"warn"),!await Om()&&(l("Silent OAuth: falling back to sign-out",null,"warn"),Mt({isSignedIn:!1,accessToken:null,userName:null,email:null}),await Ko(),await kn(),ot("error","Authorization expired. Please sign in again."),ke())}async function Fm(e){if(!si())throw e?.silent||ot("error","Configure a backup destination first"),new Error("no-backup-destination");await zm();let t=await bu({includeDeleted:!0});if(t.totalTimestamps===0){if(t.invalidRows>0)throw new Error(`export-invalid-data: ${t.invalidRows} stored rows failed validation`);return e?.silent||l("Skipping export: no timestamps to back up"),"skipped"}let n=gt();if(!n.accessToken)throw new Error("unauthorized");let o=await Cu(n.accessToken);return await Um(t.filename,t.json,o,n.accessToken),l(`Exported backup to Google Drive (${t.filename}) with ${t.totalVideos} videos / ${t.totalTimestamps} timestamps.`),"uploaded"}async function Pu(){try{let[e,t,n]=await Promise.all([$o("lastAutoBackupAt"),$o("autoBackupEnabled"),$o("autoBackupIntervalMinutes")]),o=Ii.partial().safeParse({autoBackupEnabled:t,autoBackupIntervalMinutes:n,lastAutoBackupAt:typeof e=="number"&&e>0?e:null});o.success?(typeof o.data.autoBackupEnabled=="boolean"&&Vi(o.data.autoBackupEnabled),typeof o.data.autoBackupIntervalMinutes=="number"&&qi(o.data.autoBackupIntervalMinutes),typeof o.data.lastAutoBackupAt=="number"&&$i(o.data.lastAutoBackupAt)):l("Failed to validate auto backup settings:",o.error.message,"warn")}catch(e){l("Failed to load auto backup settings:",e,"error")}}async function Ca(){try{let e=je().auth,t={autoBackupEnabled:e.autoBackupEnabled,autoBackupIntervalMinutes:e.autoBackupIntervalMinutes,lastAutoBackupAt:e.lastAutoBackupAt},n=Ii.safeParse(t);if(!n.success){l("Invalid auto backup settings, cannot save",{settings:t,errors:n.error.message},"error");return}await Promise.all([jo("autoBackupEnabled",e.autoBackupEnabled),jo("autoBackupIntervalMinutes",e.autoBackupIntervalMinutes),jo("lastAutoBackupAt",e.lastAutoBackupAt)])}catch(e){l("Failed to save auto backup settings:",e,"error")}}function Vm(){ii&&(clearInterval(ii),ii=null),Ye&&(clearTimeout(Ye),Ye=null)}function Hn(e){try{let t=new Date(e),n=new Date,o=t.toDateString()===n.toDateString(),a=t.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return o?a:`${t.toLocaleDateString()} ${a}`}catch{return""}}function Ta(){let e=Nm();return e.length>0?`Destinations: ${e.join(", ")}`:"No backup destination configured"}function _u(){let e=je().auth;return e.autoBackupEnabled?e.isAutoBackupRunning?"#4285f4":e.autoBackupBackoffMs&&e.autoBackupBackoffMs>0?"#ffa500":lo()&&e.lastAutoBackupAt?"#52c41a":lo()?"#ffa500":"#ff4d4f":"#ff4d4f"}function ke(){if(li(),!oe)return;let e=je().auth;if(!e.autoBackupEnabled)$(oe,"refresh","Backup: Off"),oe.onmouseenter=null,oe.onmouseleave=null;else if(e.isAutoBackupRunning)$(oe,"refresh","Backing up\u2026"),oe.onmouseenter=null,oe.onmouseleave=null;else if(e.autoBackupBackoffMs&&e.autoBackupBackoffMs>0){let n=Math.ceil(e.autoBackupBackoffMs/6e4);$(oe,"alert-triangle",`Retry in ${n}m`),oe.onmouseenter=null,oe.onmouseleave=null}else if(!lo())$(oe,"alert-triangle","Backup target missing"),oe.onmouseenter=null,oe.onmouseleave=null;else if(e.lastAutoBackupAt){let n=e.lastAutoBackupAt,o=n+Math.max(1,Gt())*60*1e3,a=Hn(o);oe.onmouseenter=()=>{$(oe,"database",`Next backup: ${a}`)},oe.onmouseleave=()=>{$(oe,"database",`Last backup: ${Hn(n)}`)},$(oe,"database",`Last backup: ${Hn(n)}`)}else{let n=Date.now()+Math.max(1,Gt())*60*1e3,o=Hn(n);oe.onmouseenter=()=>{$(oe,"database",`Next backup: ${o}`)},oe.onmouseleave=()=>{$(oe,"database","Last backup: never")},$(oe,"database","Last backup: never")}oe.style.display="inline";let t=_u();oe.style.color=t}var ka="ytls-backup-indicator--pulsing",qm="#4285f4",so=null;function jm(e,t){so&&(e.removeEventListener("animationiteration",so),so=null),t===qm?(e.style.backgroundColor=t,e.classList.add(ka)):e.classList.contains(ka)?(so=()=>{zn&&(zn.classList.remove(ka),zn.style.backgroundColor=t,so=null)},e.addEventListener("animationiteration",so,{once:!0})):e.style.backgroundColor=t}function li(){if(!zn)return;let e=Vo()?.color??_u();jm(zn,e),Pe(zn,()=>{let t=Vo();if(t)return t.tooltip;let n=je().auth,o="";if(!n.autoBackupEnabled)o="Auto backup is disabled";else if(n.isAutoBackupRunning)o="Backup in progress";else if(n.autoBackupBackoffMs&&n.autoBackupBackoffMs>0)o=`Retrying backup in ${Math.ceil(n.autoBackupBackoffMs/6e4)}m`;else if(!lo())o=Ta();else if(n.lastAutoBackupAt){let a=n.lastAutoBackupAt+Math.max(1,Gt())*60*1e3,r=Hn(a);o=`Last backup: ${Hn(n.lastAutoBackupAt)}
Next backup: ${r}
${Ta()}`}else{let a=Date.now()+Math.max(1,Gt())*60*1e3;o=`No backup yet
Next backup: ${Hn(a)}
${Ta()}`}return o})}async function Wo(e={}){let{silent:t=!0,skipBackoff:n=!1}=e;if(!lo()){t||(ke(),si()||_m());return}if(Ye){if(!n){l("Auto backup: backoff in progress, skipping scheduled run");return}clearTimeout(Ye),Ye=null,to(null),l("Auto backup: manual run cleared backoff and will proceed immediately")}if(!je().auth.isAutoBackupRunning){ji(!0),ke();try{await Fm({silent:t})==="uploaded"&&$i(Date.now()),jr(0),to(null),Ye&&(clearTimeout(Ye),Ye=null),await Ca()}catch(o){if(l("Auto backup failed:",o,"error"),o.message==="unauthorized"){l("Auth error detected, clearing token and stopping retries",null,"warn");let r=gt();Mt({...r,accessToken:null,isSignedIn:!1}),await Ko(),ot("error","Authorization expired. Please sign in again."),ke(),jr(0),to(null),Ye&&(clearTimeout(Ye),Ye=null)}else if(je().auth.autoBackupRetryAttempts<mu){let r=je().auth.autoBackupRetryAttempts+1;jr(r);let s=Math.min(Dm*Math.pow(2,r-1),Pm);to(s),Ye&&clearTimeout(Ye),Ye=setTimeout(()=>{Wo({silent:!0})},s),l(`Scheduling backup retry ${r}/${mu} in ${Math.round(s/1e3)}s`),ke()}else to(null)}finally{ji(!1),ke()}}}async function kn(e=!1){if(Vm(),!!Yo()&&lo()){if(ii=setInterval(()=>{Wo({silent:!0})},Math.max(1,Gt())*60*1e3),!e){let t=Date.now(),n=Math.max(1,Gt())*60*1e3,o=je().auth.lastAutoBackupAt;(!o||t-o>=n)&&Wo({silent:!0})}ke()}}async function Ou(){let e=Yo();Vi(!e),await Ca(),await kn(),ke()}async function Nu(){let e=Gt(),t=prompt("Set Auto Backup interval (minutes):",String(e));if(t===null)return;let n=Math.floor(Number(t));if(!Number.isFinite(n)||n<5||n>1440){alert("Please enter a number between 5 and 1440 minutes.");return}qi(n),await Ca(),await kn(),ke()}function Ra(e,t){return Kt(e).then(n=>n!==void 0?n:t)}function Da(e,t){return wn(e,t),Promise.resolve()}var Pa=window.location.hash;if(Pa&&Pa.length>1){let e=new URLSearchParams(Pa.substring(1));if(e.get("state")==="timekeeper_auth"){let n=e.get("access_token");if(n){console.log("[Timekeeper] Auth token detected in URL, broadcasting token"),console.log("[Timekeeper] Token length:",n.length,"characters");try{let o=new BroadcastChannel("timekeeper_oauth"),a={type:"timekeeper_oauth_token",token:n};console.log("[Timekeeper] Sending auth message via BroadcastChannel:",{type:a.type,tokenLength:n.length}),o.postMessage(a),o.close(),console.log("[Timekeeper] Token broadcast via BroadcastChannel completed")}catch(o){console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",o);let a={type:"timekeeper_oauth_token",token:n,timestamp:Date.now()},r=indexedDB.open("ytls-timestamps-db",4);r.onsuccess=()=>{let c=r.result,s=c.transaction("settings","readwrite");s.objectStore("settings").put({key:"oauth_message",value:a}),s.oncomplete=()=>{console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",a.timestamp),c.close()}}}if(history.replaceState){let o=window.location.pathname+window.location.search;history.replaceState(null,"",o)}throw console.log("[Timekeeper] Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}if(tu())throw new Error("OAuth window closed");uc();cc()||ac();(async function(){"use strict";if(window.top!==window.self)return;function e(i){return Ra(i,void 0)}function t(i,u){return Da(i,u)}La(e),Ia(t);try{let i=await Kt("device_id"),u=typeof i=="string"&&i.length>0?i:crypto.randomUUID();await wn("device_id",u),l(`Lamport: device_id = ${u}`)}catch(i){l("Lamport: failed to initialize device_id:",i,"warn")}if(await Iu()){l("OAuth popup detected, broadcasting token and closing");return}await Ba();let o=["/watch","/live"];function a(i=window.location.href){try{let u=new URL(i);return u.origin!=="https://www.youtube.com"?!1:o.some(d=>u.pathname===d||u.pathname.startsWith(`${d}/`))}catch(u){return l("Timekeeper failed to parse URL for support check:",u,"error"),!1}}let r=null,c=null,s=null,h=null,m=null,y=null,f=null,v=null,E=(()=>{try{let i=parseFloat(localStorage.getItem("ytls-last-speed")??"");return Number.isFinite(i)&&i>0&&i!==1?Math.min(i,4):2}catch{return 2}})(),I=!1,P=null,G=null,q=250,ee=null;function O(){return je().ui.minPaneHeight}function j(i){Yl(i)}function se(i){Xl(i)}function ve(){return je().ui.urlChangeHandlersSetup}function pe(i){Jl(i)}function U(){return je().ui.panePosition}function R(i){Kl(i)}function fe(i){Ql(i)}function re(){return r?r.getBoundingClientRect():null}function Te(i,u,d){i&&R({x:Math.round(typeof u=="number"?u:i.left),y:Math.round(typeof d=="number"?d:i.top),width:Math.round(i.width),height:Math.round(i.height)})}function Ke(i=!0){if(!r)return;Fn();let u=re();if(u&&(u.width||u.height)&&(Te(u),i)){let d=U();gr("windowPosition",d),En({type:"window_position_updated",position:d,timestamp:Date.now()})}}function _e(){if(!r||!c||!h||!s)return;let i=40,u=De();if(u.length>0)i=u[0].offsetHeight;else{let d=document.createElement("li");d.style.visibility="hidden",d.style.position="absolute",d.textContent="00:00 Example",s.appendChild(d),i=d.offsetHeight,s.removeChild(d)}q=c.offsetHeight+h.offsetHeight+i,j(q),r.style.minHeight=O()+"px"}function Oe(){requestAnimationFrame(()=>{He?.(),_e(),Ke(!0)})}function Ae(i=450){Le&&(clearTimeout(Le),Le=null),Le=setTimeout(()=>{Lt(),Oe(),Le=null},i)}function le(){Le&&(clearTimeout(Le),Le=null)}function Ne(){s&&(s.style.visibility="hidden",l("Hiding timestamps during show animation")),Oe(),Ae()}function Ee(){Lt(),le(),yt&&(clearTimeout(yt),yt=null),yt=setTimeout(()=>{r&&(r.style.display="none",is(),yt=null)},400)}function Lt(){if(!s){at&&(at(),at=null,Vt=null,In=null);return}if(!In){s.style.visibility==="hidden"&&(s.style.visibility="",l("Restoring timestamp visibility (no deferred fragment)")),at&&(at(),at=null,Vt=null);return}l("Appending deferred timestamps after animation"),s.appendChild(In),In=null,sn(),ln(),s.style.visibility==="hidden"&&(s.style.visibility="",l("Restoring timestamp visibility after append")),at&&(at(),at=null,Vt=null),Ct(),Ve(),He&&requestAnimationFrame(He),xt(!0)}let Me=null,ye=!1,we="ytls-timestamp-pending-delete",ce="ytls-timestamp-highlight";async function ue(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(i=>setTimeout(i,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(i=>setTimeout(i,100));await new Promise(i=>setTimeout(i,200))}let rt=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],tn=5e3,nn=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function An(i){return nn.has(i)}function Re(){return document.querySelector("video")}let it=null;function K(){if(it&&document.contains(it))return it;let i=document.getElementById("movie_player");return i&&document.contains(i)?i:null}function Ut(i){return(Math.round(i*100)/100).toFixed(2).replace(/\.0+?$|(?<=\.[0-9])0+$/g,"")}function uo(i){let u=i===1?2:i;E=u;try{localStorage.setItem("ytls-last-speed",String(u))}catch{}}function ci(i){if(!v)return;let u=typeof i=="number"?i:Re()?.playbackRate??1,d=Ut(u);v.dataset.speed!==d&&(v.dataset.speed=d,v.textContent=`${d}x`,v.setAttribute("aria-label",`Playback speed ${d}x`)),Math.abs(u-1)>.01?v.classList.add("ytls-playback-speed-active"):v.classList.remove("ytls-playback-speed-active")}function Hu(i){let u=K(),d=Re();if(I=!0,u&&typeof u.setPlaybackRate=="function")u.setPlaybackRate(i);else if(d)d.playbackRate=i;else return I=!1,!1;return ci(i),!0}function _a(){let i=Re()?.playbackRate;return Number.isFinite(i)?Hu(Math.abs(i-1)<=.001?E:1):!1}function zu(i){return i instanceof Element?!!i.closest('input, textarea, select, [contenteditable], [role="textbox"]'):!1}function ui(i){return rt.every(u=>typeof i?.[u]=="function"?!0:An(u)?!!Re():!1)}function Gu(i){return rt.filter(u=>typeof i?.[u]=="function"?!1:An(u)?!Re():!0)}async function Uu(i=tn){let u=Date.now();for(;Date.now()-u<i;){let b=K();if(ui(b))return b;await new Promise(x=>setTimeout(x,100))}let d=K();return ui(d),d}let Oa="timestampOffsetSeconds",Fu=-5,Na="shiftClickTimeSkipSeconds",Vu=10,di=300,pi=300,Bt=null;function Ha(){try{return new URL(window.location.href).origin==="https://www.youtube.com"}catch{return!1}}function za(){if(Ha()&&!Bt)try{Bt=new BroadcastChannel("ytls_timestamp_channel"),Bt.onmessage=Ga}catch(i){l("Failed to create BroadcastChannel:",i,"warn"),Bt=null}}function En(i){if(!Ha()){l("Skipping BroadcastChannel message: not on https://www.youtube.com","warn");return}if(za(),!Bt){l("No BroadcastChannel available to post message","warn");return}try{Bt.postMessage(i)}catch(u){l("BroadcastChannel error, reopening:",u,"warn");try{Bt=new BroadcastChannel("ytls_timestamp_channel"),Bt.onmessage=Ga,Bt.postMessage(i)}catch(d){l("Failed to reopen BroadcastChannel:",d,"error")}}}function Ga(i){if(l("Received message from another tab:",i.data),!(!a()||!s||!r)&&i.data){if(i.data.type==="timestamps_updated"&&i.data.videoId===Ie)l("Debouncing timestamp load due to external update for video:",i.data.videoId),clearTimeout(mo),mo=setTimeout(()=>{l("Reloading timestamps due to external update for video:",i.data.videoId),hr()},500);else if(i.data.type==="window_position_updated"&&r){let u=i.data.position;if(u&&typeof u.x=="number"&&typeof u.y=="number"){r.style.left=`${u.x}px`,r.style.top=`${u.y}px`,r.style.right="auto",r.style.bottom="auto",typeof u.width=="number"&&u.width>0&&(r.style.width=`${u.width}px`),typeof u.height=="number"&&u.height>0&&(r.style.height=`${u.height}px`);let d=r.getBoundingClientRect();R({x:Math.round(u.x),y:Math.round(u.y),width:Math.round(d.width),height:Math.round(d.height)});let b=document.documentElement.clientWidth,x=document.documentElement.clientHeight;(d.left<0||d.top<0||d.right>b||d.bottom>x)&&Fn()}}}}za();let Gn=await Ra(Oa);(typeof Gn!="number"||Number.isNaN(Gn))&&(Gn=Fu,await Da(Oa,Gn));let po=await Ra(Na);(typeof po!="number"||Number.isNaN(po))&&(po=Vu,await Da(Na,po));let mo=null,Ft=new Map,Mn=!1,N=null,Xo=null,Ie=null,yt=null,Le=null,wt=null,Xe=null,on=null,mi=!1,He=null,In=null,Vt=null,at=null,rn=null,Jo=!1,fi=!1,Qo=null,Zo=null,er=null,tr=null,nr=null,or=null,rr=null,ir=null,fo=null,ho=null,go=null,bt=null,St=null,Ua=0,vo=!1,Ln=null,yo=null,Un=null,Fa=null,wo=null;function ar(){if(!s)return{items:[],starts:[]};if(Fa!==s||!wo?(wo?.disconnect(),wo=new MutationObserver(()=>{Un=null}),wo.observe(s,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-time"]}),Fa=s,Un=null):wo.takeRecords().length>0&&(Un=null),!Un){let i=Ur(s),u=new Array(i.length);for(let d=0;d<i.length;d++){let b=i[d].querySelector("[data-time]")?.dataset.time;u[d]=b?Number.parseInt(b,10):NaN}Un={items:i,starts:u}}return Un}function De(){return ar().items}function hi(){return jl(s)}function an(){return yo!==null||(yo=$l(s)),yo}function sn(){yo=null}function sr(i=K(),u=Re()){let d=i?.getDuration?.();return Number.isFinite(d)&&d>0?d:Number.isFinite(u?.duration)&&u.duration>0?u.duration:0}function Va(){return sr()||an()}function qu(i){let u=i.querySelector(".time-diff");return u?(u.textContent?.trim()||"").startsWith("-"):!1}let ju="\u251C\u2500 ",qa="\u2514\u2500 ",ja=/^[├└]─\s/;function lr(i){return ja.test(i)}function $a(i){return i.replace(ja,"")}function Wa(i){let u=De();if(i>=u.length-1)return qa;let x=u[i+1].querySelector("input");return x&&lr(x.value)?ju:qa}function $u(i,u){return`${Wa(u)}${i}`}function Ct(){if(!s)return;De().forEach((u,d)=>{let b=u.querySelector("input");if(!b||!lr(b.value))return;let x=$a(b.value),A=$u(x,d);b.value!==A&&(b.value=A)})}function bo(){Fr(s),In&&(In=null),at&&(at(),at=null,Vt=null)}function So(){ql(s,ye)}function Ya(i){Fi(s,i)}function gi(){Ul(s)}function vi(i){if(!(!r||!s)){if(ye=i,i)r.style.display="",r.classList.remove("ytls-fade-out"),r.classList.add("ytls-fade-in"),Ya("Loading timestamps...");else if(gi(),r.style.display="",r.classList.remove("ytls-fade-out"),r.classList.add("ytls-fade-in"),m){let u=K();if(u){let d=u.getCurrentTime(),b=Number.isFinite(d)?Math.max(0,Math.floor(d)):Math.max(0,an());m.textContent=_r(b,sr(u))}}!ye&&s&&!Po(s)&&So(),qt()}}function cr(i,u){i.dataset.time=String(u),i.textContent=gn(u,Va())}let ur=null,dr=null,Rt=!1;function Ka(i,u){if(!i||typeof i.getVideoData!="function"||!(u!==void 0?u:!!i.getVideoData()?.isLive))return!1;if(typeof i.getProgressState=="function"){let b=i.getProgressState(),x=Number(b?.seekableEnd??b?.liveHead??b?.head??b?.duration),A=Number(b?.current??i.getCurrentTime?.());if(Number.isFinite(x)&&Number.isFinite(A))return x-A>2}return!1}function Wu(i,u){if(!Number.isFinite(i))return;let d=Xa(i);yi(d,u)}function xt(i=!1,u){if(Mn&&!i)return;let d;if(typeof u=="number"&&Number.isFinite(u))d=Math.max(0,Math.floor(u));else{let b=K(),x=b?b.getCurrentTime():NaN;d=Number.isFinite(x)?Math.max(0,Math.floor(x)):Math.max(0,an())}Number.isFinite(d)&&Wu(d,i)}function Xa(i){if(!Number.isFinite(i))return null;let{items:u,starts:d}=ar(),b=-1,x=-1/0;for(let A=0;A<d.length;A++){let T=d[A];T<=i&&T>x&&(x=T,b=A)}return b>=0?u[b]:null}function yi(i,u=!1){let d=s?s.getElementsByClassName(ce):null;if(!(!!d&&(i?d.length===1&&d[0]===i:d.length===0))&&d)for(let x of Array.from(d))x.classList.contains(we)||x.classList.remove(ce);if(i&&!i.classList.contains(we)&&(i.classList.add(ce),u))try{if(s instanceof HTMLElement){let x=i.getBoundingClientRect(),A=s.getBoundingClientRect();!(x.bottom<A.top||x.top>A.bottom)||i.scrollIntoView({behavior:"smooth",block:"center"})}else i.scrollIntoView({behavior:"smooth",block:"center"})}catch{try{i.scrollIntoView({behavior:"smooth",block:"center"})}catch{}}}function Yu(i){if(Tt()||!Number.isFinite(i)||i===0)return!1;let u=De();if(u.length===0)return!1;let d=[];return u.forEach(b=>{let x=b.querySelector("[data-time]"),A=x?.dataset.time;if(!x||!A)return;let T=Number.parseInt(A,10);if(!Number.isFinite(T))return;let S=Math.max(0,T+i);if(S!==T){cr(x,S);let L=b.dataset.guid;L&&d.push({guid:L,start:S,comment:b.querySelector("input")?.value??""})}}),d.length===0?!1:(ln(),Ct(),Ve(),wi(),es(Ie,d),Ln=null,!0)}function Ja(i,u={}){if(!Number.isFinite(i)||i===0)return!1;if(!Yu(i)){if(u.alertOnNoChange){let T=u.failureMessage??"Offset did not change any timestamps.";alert(T)}return!1}let b=u.logLabel??"bulk offset";l(`Timestamps changed: Offset all timestamps by ${i>0?"+":""}${i} seconds (${b})`);let x=K(),A=x?Math.floor(x.getCurrentTime()):0;if(Number.isFinite(A)){let T=Xa(A);yi(T,!1)}return!0}function Qa(i){if(!s||ye)return;let u=i.target instanceof Element?i.target:null;if(!u)return;let d=u.closest("[data-time]"),b=u.closest("[data-increment]"),x=u.closest("[data-action]");if(d?.dataset.time){i.preventDefault();let A=Number(d.dataset.time);if(Number.isFinite(A)){l(`Seeking to timestamp ${A}`),Rt=!0;let S=K();S&&S.seekTo(A),setTimeout(()=>{Rt=!1},500)}let T=d.closest("li");T&&(De().forEach(S=>{S.classList.contains(we)||S.classList.remove(ce)}),T.classList.contains(we)||(T.classList.add(ce),T.scrollIntoView({behavior:"smooth",block:"center"})))}else if(b?.dataset.increment){i.preventDefault();let A=b.closest("li"),T=A?.querySelector("[data-time]");if(!T||!T.dataset.time)return;let S=parseInt(T.dataset.time,10),L=parseInt(b.dataset.increment,10);if("shiftKey"in i&&i.shiftKey&&(L*=po),"altKey"in i?i.altKey:!1){Ja(L,{logLabel:"Alt adjust"});return}let F=Math.max(0,S+L);if(l(`Timestamps changed: Timestamp time incremented from ${S} to ${F}`),sn(),cr(T,F),dr=F,ur&&clearTimeout(ur),Rt=!0,ur=setTimeout(()=>{if(dr!==null){let ne=K();ne&&ne.seekTo(dr)}ur=null,dr=null,setTimeout(()=>{Rt=!1},500)},500),ln(),Ct(),Ve(),A){let ne=A.querySelector("input"),be=A.dataset.guid;ne&&be&&(fr(Ie,be,F,ne.value),Ln=be)}}else x?.dataset.action==="clear"&&(i.preventDefault(),l("Timestamps changed: All timestamps cleared from UI"),s.textContent="",sn(),Ve(),pr(),Ju(),fe([]),Xu(Ie),Ln=null,So())}function xo(i,u="",d=!1,b=null,x=!0){if(!s)return null;let A=Math.max(0,i),T=b??crypto.randomUUID(),S=document.createElement("li"),L=document.createElement("div"),B=document.createElement("span"),D=document.createElement("span"),F=document.createElement("span"),ne=document.createElement("div"),be=document.createElement("span"),dt=document.createElement("span"),J=document.createElement("input"),ie=document.createElement("button");S.dataset.guid=T,L.className="time-row",ne.className="ytls-row-controls";let ze=document.createElement("div");ze.style.cssText="position:absolute;left:0;top:0;width:20px;height:20px;display:flex;align-items:center;justify-content:center;cursor:pointer;",Pe(ze,"Click to toggle indent");let st=document.createElement("span");st.style.cssText="color:#f4ba78;pointer-events:none;display:none;line-height:0;";let kt=()=>{let V=J.offsetTop,H=J.offsetHeight||20;ze.style.top=`${V}px`,ze.style.height=`${H}px`},Dt=()=>{Ue(st,lr(J.value)?"indent-decrease":"indent-increase",18)},Vn="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",cn=V=>{let H=st.querySelector("svg");H&&(H.style.transition="filter 0.15s ease",H.style.filter=V?Vn:"none")},qn=V=>{V.stopPropagation();let H=lr(J.value),de=$a(J.value),Z="";if(!H){let pt=De().indexOf(S);Z=Wa(pt)}J.value=Z?`${Z}${de}`:de,Dt(),Ct();let he=Number.parseInt(be.dataset.time??"0",10);fr(Ie,T,he,J.value)};ze.onclick=qn,ze.append(st),ze.addEventListener("mouseenter",()=>{cn(!0)}),ze.addEventListener("mouseleave",()=>{cn(!1)}),S.style.cssText="position:relative;padding-left:20px;",S.addEventListener("mouseenter",()=>{kt(),Dt(),st.style.display="inline"}),S.addEventListener("mouseleave",()=>{cn(!1),st.style.display="none"}),S.addEventListener("mouseleave",()=>{S.dataset.guid===Ln&&qu(S)&&Za()}),J.value=u||"",J.style.cssText="width:100%;margin-top:5px;display:block;",J.type="text",J.setAttribute("inputmode","text"),J.autocapitalize="off",J.autocomplete="off",J.spellcheck=!1,requestAnimationFrame(kt);let Ao=!1;J.addEventListener("focusin",()=>{vo=!1,Ao=!1}),J.addEventListener("focusout",V=>{let H=V.relatedTarget,de=Date.now()-Ua<250,Z=!!H&&!!r&&r.contains(H);!de&&!Z&&!Ao&&(vo=!0,setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(J.focus({preventScroll:!0}),vo=!1)},0))}),J.addEventListener("keydown",V=>{(V.key==="Escape"||V.key==="Esc")&&(V.preventDefault(),Ao=!0,J.blur())});let Eo=V=>{let H=Ft.get(T);H&&clearTimeout(H.timeoutId);let de=Ie,Z=()=>{let he=Ft.get(T);he&&(clearTimeout(he.timeoutId),Ft.delete(T)),ts(de,T,Number.parseInt(be.dataset.time??"0",10),J.value)};Ft.set(T,{timeoutId:setTimeout(Z,V),flush:Z})};J.addEventListener("input",V=>{let H=V;H&&(H.isComposing||H.inputType==="insertCompositionText")||Eo(500)}),J.addEventListener("compositionend",()=>{Eo(50)});let jt="#f4ba78",vr="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",yr="#c8452d",wr="drop-shadow(0 0 4px #e36a52) drop-shadow(0 0 8px #e36a52)",Cn=(V,H=jt,de=vr)=>{V.style.color=H;let Z=V.querySelector("svg");Z&&(Z.style.transition="filter 0.15s ease"),V.addEventListener("mouseenter",()=>{Z&&(Z.style.filter=de)}),V.addEventListener("mouseleave",()=>{Z&&(Z.style.filter="none")})};Ue(B,"circle-minus",18),B.classList.add("ytls-row-control"),B.dataset.increment="-1",B.style.cursor="pointer",B.style.margin="0px",Cn(B),Ue(F,"circle-plus",18),F.classList.add("ytls-row-control"),F.dataset.increment="1",F.style.cursor="pointer",F.style.margin="0px",Cn(F),Ue(D,"current-location",18),D.classList.add("ytls-row-control"),D.style.cursor="pointer",D.style.margin="0px",Pe(D,"Set to current playback time"),Cn(D),D.onclick=()=>{let V=K(),H=V?Math.floor(V.getCurrentTime()):0;Number.isFinite(H)&&(l(`Timestamps changed: set to current playback time ${H}`),sn(),cr(be,H),ln(),Ct(),fr(Ie,T,H,J.value),Ln=T)},sn(),cr(be,A),be.addEventListener("click",V=>{V.preventDefault(),V.stopPropagation();let H=Number(be.dataset.time);if(!Number.isFinite(H))return;l(`Seeking to timestamp ${H}`),Rt=!0;let de=K();de&&de.seekTo(H);let Z=Re();Z?.paused&&Z.play(),setTimeout(()=>{Rt=!1},500),s?.querySelectorAll(`.${ce}`).forEach(he=>he.classList.remove(ce)),S.classList.contains(we)||(S.classList.add(ce),S.scrollIntoView({behavior:"smooth",block:"center"}))}),Ue(ie,"trash",16),ie.classList.add("ytls-row-control"),ie.style.cssText="background:transparent;border:none;cursor:pointer;margin-left:5px;display:inline-flex;align-items:center;",Cn(ie,yr,wr),ie.onclick=()=>{let V=null,H=null,de=null,Z=()=>{try{S.removeEventListener("click",H,!0)}catch{}try{document.removeEventListener("click",H,!0)}catch{}if(s)try{s.removeEventListener("mouseleave",de)}catch{}V&&(clearTimeout(V),V=null)};if(S.dataset.deleteConfirmed==="true"){l("Timestamps changed: Timestamp deleted");let he=S.dataset.guid??"",qe=Ft.get(he);qe&&(clearTimeout(qe.timeoutId),Ft.delete(he)),Z(),S.remove(),sn(),ln(),Ct(),Ve(),pr(),Qu(Ie,he),Ln=null,So()}else{S.dataset.deleteConfirmed="true",S.classList.add(we),S.classList.remove(ce);let he=()=>{S.dataset.deleteConfirmed="false",S.classList.remove(we);let qe=K(),pt=qe?qe.getCurrentTime():0,Pt=Number.parseInt(S.querySelector("[data-time]")?.dataset.time??"0",10);Number.isFinite(pt)&&Number.isFinite(Pt)&&pt>=Pt&&S.classList.add(ce),Z()};H=qe=>{qe.target!==ie&&he()},de=()=>{S.dataset.deleteConfirmed==="true"&&he()},S.addEventListener("click",H,!0),document.addEventListener("click",H,!0),s&&s.addEventListener("mouseleave",de),V=setTimeout(()=>{S.dataset.deleteConfirmed==="true"&&he(),Z()},5e3)}},dt.className="time-diff",dt.style.color="#888",dt.style.marginLeft="5px",ne.append(B,D,F,ie),L.append(be,ne,dt),S.append(ze,L,J);let br=Number.parseInt(be.dataset.time??"0",10);if(x){gi();let V=!1,H=De();for(let de=0;de<H.length;de++){let Z=H[de],qe=Z.querySelector("[data-time]")?.dataset.time;if(!qe)continue;let pt=Number.parseInt(qe,10);if(Number.isFinite(pt)&&br<pt){s.insertBefore(S,Z),V=!0;break}}V||s.appendChild(S),S.scrollIntoView({behavior:"smooth",block:"center"}),sn(),ln(),pr(),Ct(),Ve(),d||(fr(Ie,T,A,u),Ln=T,yi(S,!1))}else J.__ytls_li=S;return J}function ln(){if(Tt())return;let i=Va(),u=De();u.forEach((d,b)=>{let x=d.querySelector(".time-diff"),A=d.querySelector("[data-time]"),T=A?.dataset.time;if(A&&T){let dt=Number.parseInt(T,10);Number.isFinite(dt)&&(A.textContent=gn(dt,i))}if(!x)return;if(!T){x.textContent="";return}let S=Number.parseInt(T,10);if(!Number.isFinite(S)){x.textContent="";return}if(b===0){x.textContent="";return}let D=u[b-1].querySelector("[data-time]")?.dataset.time;if(!D){x.textContent="";return}let F=Number.parseInt(D,10);if(!Number.isFinite(F)){x.textContent="";return}let ne=S-F,be=ne<0?"-":"";x.textContent=` ${be}${gn(Math.abs(ne))}`})}function Za(){if(Tt())return;let i=null;if(document.activeElement instanceof HTMLInputElement&&s.contains(document.activeElement)){let T=document.activeElement,L=T.closest("li")?.dataset.guid;if(L){let B=T.selectionStart??T.value.length,D=T.selectionEnd??B,F=T.scrollLeft;i={guid:L,start:B,end:D,scroll:F}}}let u=De();if(u.length===0)return;let d=u.map(T=>T.dataset.guid),b=u.map(T=>{let S=T.querySelector("[data-time]"),L=S?.dataset.time;if(!S||!L)return null;let B=Number.parseInt(L,10);if(!Number.isFinite(B))return null;let D=T.dataset.guid??"";return{time:B,guid:D,element:T}}).filter(T=>T!==null).sort((T,S)=>{let L=T.time-S.time;return L!==0?L:T.guid.localeCompare(S.guid)}),x=b.map(T=>T.guid),A=d.length!==x.length||d.some((T,S)=>T!==x[S]);if(s.replaceChildren(),b.forEach(T=>{s.appendChild(T.element)}),ln(),Ct(),Ve(),i){let S=De().find(L=>L.dataset.guid===i.guid)?.querySelector("input");if(S)try{S.focus({preventScroll:!0})}catch{}}A&&(l("Timestamps changed: Timestamps sorted"),wi())}function pr(){if(!s||!r||!c||!h)return;let i=De().length;He?.();let u=r.getBoundingClientRect(),d=c.getBoundingClientRect(),b=h.getBoundingClientRect(),x=Math.max(0,u.height-(d.height+b.height));i===0?(So(),s.style.overflowY="hidden"):s.style.overflowY=s.scrollHeight>x?"auto":"hidden"}function Ve(){if(!s)return;let i=Re(),u=document.querySelector(".ytp-progress-bar"),d=K(),b=d?d.getVideoData():null,x=!!b&&!!b.isLive;if(!i||!u||!isFinite(i.duration)||x)return;os();let{items:A,starts:T}=ar(),S=i.duration,L=document.createDocumentFragment();A.forEach((B,D)=>{let F=T[D];if(!Number.isFinite(F))return;B.dataset.guid||(B.dataset.guid=crypto.randomUUID());let ne=document.createElement("div");ne.className="ytls-marker",ne.style.left=F/S*100+"%",ne.dataset.time=String(F),L.appendChild(ne)}),u.appendChild(L),Ku(u)}function Ku(i){i.dataset.ytlsMarkerClicks||(i.dataset.ytlsMarkerClicks="1",i.addEventListener("click",u=>{let d=u.target?.closest?.(".ytls-marker");if(!d)return;let b=Number(d.dataset.time),x=K();x&&Number.isFinite(b)&&x.seekTo(b)}))}function wi(){fe(hi().sort((i,u)=>i.start-u.start))}function es(i,u){!i||u.length===0||ye||Tt()||(id(i,u).then(()=>{l(`Saved ${u.length} timestamps for ${i} to IndexedDB`),s&&To()}).catch(d=>{let b=`Failed to save timestamps: ${d.message}`;l(`Failed to save timestamps for ${i} to IndexedDB:`,d,"error"),Bn(b)}),En({type:"timestamps_updated",videoId:i,action:"saved"}))}function Xu(i){!i||ye||Tt()||(rs(i).then(()=>{s&&To()}).catch(u=>{let d=`Failed to clear timestamps: ${u.message}`;l(`Failed to clear timestamps for ${i}:`,u,"error"),Bn(d)}),En({type:"timestamps_updated",videoId:i,action:"saved"}))}function mr(){for(let{flush:i}of[...Ft.values()])i()}function Ju(){Ft.forEach(({timeoutId:i})=>clearTimeout(i)),Ft.clear()}function fr(i,u,d,b){!i||ye||Tt()||ts(i,u,d,b)}function ts(i,u,d,b){if(!i)return;let x={guid:u,start:d,comment:b};l(`Saving timestamp: guid=${u}, start=${d}, comment="${b}"`),ad(i,x).then(()=>{s&&To()}).catch(A=>{let T=`Failed to save timestamp: ${A.message}`;l(`Failed to save timestamp ${u}:`,A,"error"),Bn(T)}),En({type:"timestamps_updated",videoId:i,action:"saved"})}function Qu(i,u){!i||ye||Tt()||(sd(i,u).then(()=>{s&&To()}).catch(d=>{let b=`Failed to delete timestamp: ${d.message}`;l(`Failed to delete timestamp ${u}:`,d,"error"),Bn(b)}),En({type:"timestamps_updated",videoId:i,action:"saved"}))}async function ns(i){if(Tt()){alert("Cannot export timestamps while an error is being displayed.");return}let u=Ie;if(!u)return;l(`Exporting timestamps for video ID: ${u}`);let d=hi(),b=Dn();if(i==="json"){let x=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),A=URL.createObjectURL(x),T=document.createElement("a");T.href=A,T.download=`timestamps-${u}-${b}.json`,T.click(),URL.revokeObjectURL(A)}else if(i==="text"){let x=Bi(d,!0),A=new Blob([x],{type:"text/plain"}),T=URL.createObjectURL(A),S=document.createElement("a");S.href=T,S.download=`timestamps-${u}-${b}.txt`,S.click(),URL.revokeObjectURL(T)}}function Bn(i){if(!r||!s){l("Timekeeper error:",i,"error");return}Fl(s,i),Wi(i),Ve()}function To(){s&&(Vl(s),Wi(null))}function Tt(){return!!(!s||Po(s)||ye||Zl()!==null)}function os(){document.querySelectorAll(".ytls-marker").forEach(i=>i.remove())}function Fn(){if(!r||!document.body.contains(r))return;let i=r.getBoundingClientRect(),u=document.documentElement.clientWidth,d=document.documentElement.clientHeight,b=i.width,x=i.height;if(i.left<0&&(r.style.left="0",r.style.right="auto"),i.right>u){let A=Math.max(0,u-b);r.style.left=`${A}px`,r.style.right="auto"}if(i.top<0&&(r.style.top="0",r.style.bottom="auto"),i.bottom>d){let A=Math.max(0,d-x);r.style.top=`${A}px`,r.style.bottom="auto"}}function Zu(){if(Qo&&(document.removeEventListener("mousemove",Qo),Qo=null),Zo&&(document.removeEventListener("mouseup",Zo),Zo=null),fo&&(document.removeEventListener("keydown",fo),fo=null),er&&(window.removeEventListener("resize",er),er=null),ho&&(document.removeEventListener("pointerdown",ho,!0),ho=null),go&&(document.removeEventListener("pointerup",go,!0),go=null),bt){try{bt.disconnect()}catch{}bt=null}if(St){try{St.disconnect()}catch{}St=null}let i=Re();i&&(tr&&(i.removeEventListener("timeupdate",tr),tr=null),nr&&(i.removeEventListener("pause",nr),nr=null),or&&(i.removeEventListener("play",or),or=null),rr&&(i.removeEventListener("seeking",rr),rr=null),ir&&(i.removeEventListener("ratechange",ir),ir=null))}function ed(){os(),mr(),mo&&(clearTimeout(mo),mo=null),Me&&(clearInterval(Me),Me=null),yt&&(clearTimeout(yt),yt=null),Zu(),fl();try{Bt.close()}catch{}if(N&&N.parentNode===document.body&&document.body.removeChild(N),N=null,Xo=null,Mn=!1,Ie=null,bt){try{bt.disconnect()}catch{}bt=null}if(St){try{St.disconnect()}catch{}St=null}r&&r.parentNode&&r.remove();let i=document.getElementById("ytls-header-button");i&&i.parentNode&&i.remove(),rn=null,Jo=!1,R(null),bo(),r=null,c=null,s=null,h=null,Xe=null,on=null,He=null,m=null,y=null,v=null,P=null,it=null}async function td(){let i=ko();if(!i)return it=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let u=await Uu();if(!ui(u)){let d=Gu(u),b=d.length?` Missing methods: ${d.join(", ")}.`:"",x=u?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return it=null,{ok:!1,message:`${x}${b} Try refreshing once playback is ready.`}}return it=u,{ok:!0,player:u,videoId:i}}async function hr(){if(!r||!s)return;let i=s.scrollTop,u=!0,d=()=>{if(!s||!u)return;let b=Math.max(0,s.scrollHeight-s.clientHeight);s.scrollTop=Math.min(i,b)};try{let b=await td();if(!b.ok){Bn(b.message),bo(),Ve();return}let{videoId:x}=b,A=[];try{let T=await ld(x);T?(A=T.map(S=>({...S,guid:S.guid||crypto.randomUUID()})),l(`Loaded ${A.length} timestamps from IndexedDB for ${x}`),To()):l(`No timestamps found in IndexedDB for ${x}`)}catch(T){let S=`Failed to load timestamps: ${T.message}`;l(`Failed to load timestamps from IndexedDB for ${x}:`,T,"error"),Bn(S),Ve();return}if(A.length>0){A.sort((L,B)=>L.start-B.start),bo(),gi();let T=document.createDocumentFragment();A.forEach(L=>{let D=xo(L.start,L.comment,!0,L.guid,!1).__ytls_li;D&&T.appendChild(D)}),r&&r.classList.contains("ytls-zoom-in")&&Le!=null?(l("Deferring timestamp DOM append until show animation completes"),In=T,Vt||(Vt=new Promise(L=>{at=L})),await Vt):s&&(s.appendChild(T),sn(),ln(),Ct(),Ve(),He&&requestAnimationFrame(He)),fe(A),xt(!0),u=!1}else bo(),Ya("No timestamps for this video"),Ve(),fe([]),He&&requestAnimationFrame(He)}catch(b){l("Unexpected error while loading timestamps:",b,"error"),Bn("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{Vt&&await Vt,requestAnimationFrame(d),He&&requestAnimationFrame(He),s&&!Po(s)&&So()}}function ko(){let u=new URLSearchParams(location.search).get("v");if(u)return u;let d=document.querySelector('meta[itemprop="identifier"]');return d?.content?d.content:null}function nd(i=null,u=null){if(!m)return;let d=Re(),b=u||K();if(!d&&!b)return;let x=i!==null?i:b?b.getCurrentTime():0,A=Number.isFinite(x)?Math.max(0,Math.floor(x)):Math.max(0,an()),{isLive:T}=b?b.getVideoData()||{isLive:!1}:{isLive:!1},S=b?Ka(b,!!T):!1;m.textContent=_r(A,sr(b,d)),m.style.color=S?"#ff4d4f":""}function od(){let i=Re();if(!i)return;let u=NaN,d=null,b=()=>{if(!s)return;let B=K(),D=B?Math.floor(B.getCurrentTime()):0;if(!Number.isFinite(D))return;let F=ar();if(D===u&&F===d)return;let ne=!!m&&!ye&&!Rt;ne&&nd(D,B),xt(!1,D),ne&&!Mn&&(u=D,d=F)},x=B=>{try{let D=new URL(window.location.href);B!==null&&Number.isFinite(B)?D.searchParams.set("t",`${Math.floor(B)}s`):D.searchParams.delete("t"),window.history.replaceState(window.history.state,"",D.toString())}catch{}},A=()=>{let B=K(),D=B?B.getCurrentTime():NaN,F=Number.isFinite(D)?Math.max(0,Math.floor(D)):Math.max(0,an());if(Number.isFinite(F)){x(F);try{xt(!0)}catch(ne){l("Failed to highlight nearest timestamp on pause:",ne,"warn")}}},T=()=>{x(null);try{let B=K(),D=B?B.getCurrentTime():NaN,F=Number.isFinite(D)?Math.max(0,Math.floor(D)):Math.max(0,an());Number.isFinite(F)&&xt(!0)}catch(B){l("Failed to highlight nearest timestamp on play:",B,"warn")}},S=()=>{let B=Re();if(!B)return;let D=K(),F=D?Math.floor(D.getCurrentTime()):0;Number.isFinite(F)&&(B.paused&&x(F),xt(!0,F))},L=()=>{let B=i.playbackRate;I?I=!1:uo(B),ci(B)};tr=b,nr=A,or=T,rr=S,ir=L,i.addEventListener("timeupdate",b),i.addEventListener("pause",A),i.addEventListener("play",T),i.addEventListener("seeking",S),i.addEventListener("ratechange",L)}let{saveToIndexedDB:rd,saveRowsToIndexedDB:id,saveSingleTimestampToIndexedDB:ad,deleteSingleTimestampFromIndexedDB:sd,loadFromIndexedDB:ld,removeFromIndexedDB:rs,saveGlobalSettings:gr,loadGlobalSettings:bi,buildExportPayload:cd,mergeBackupData:ud,exportAllTimestamps:dd,exportAllTimestampsCsv:pd}=Gr;function is(){if(!r)return;let i=r.style.display!=="none";gr("uiVisible",i)}function qt(i){let u=typeof i=="boolean"?i:!!r&&r.style.display!=="none",d=document.getElementById("ytls-header-button");d instanceof HTMLButtonElement&&d.setAttribute("aria-pressed",String(u)),rn&&!Jo&&rn.src!==Or&&(rn.src=Or)}function md(){r&&bi("uiVisible").then(i=>{let u=_t().safeParse(i),d=u.success?u.data:void 0;typeof d=="boolean"?(d?(r.style.display="flex",r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in")):r.style.display="none",qt(d)):(!u.success&&i!==void 0&&l("UI visibility state failed validation, defaulting to visible",u.error.message,"warn"),r.style.display="flex",r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in"),qt(!0))}).catch(i=>{l("Failed to load UI visibility state:",i,"error"),r.style.display="flex",r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in"),qt(!0)})}function Si(i){if(!r){l("ERROR: togglePaneVisibility called but pane is null");return}document.body.contains(r)||(l("Pane not in DOM during toggle, appending it"),document.querySelectorAll("#ytls-pane").forEach(x=>{x!==r&&x.remove()}),document.body.appendChild(r));let u=document.querySelectorAll("#ytls-pane");u.length>1&&(l(`ERROR: Multiple panes detected in togglePaneVisibility (${u.length}), cleaning up`),u.forEach(x=>{x!==r&&x.remove()})),yt&&(clearTimeout(yt),yt=null);let d=r.style.display==="none";(typeof i=="boolean"?i:d)?(r.style.display="flex",r.classList.remove("ytls-fade-out"),r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in"),qt(!0),is(),Ne(),Le&&(clearTimeout(Le),Le=null),Le=setTimeout(()=>{Lt(),He?.(),_e(),Ke(!0);try{xt(!0)}catch(x){l("Failed to scroll to nearest timestamp after toggle:",x,"warn")}Le=null},450)):(r.classList.remove("ytls-fade-in"),r.classList.remove("ytls-zoom-in"),r.classList.add("ytls-zoom-out"),qt(!1),Ee())}function as(i){if(!s){l("UI is not initialized; cannot import timestamps.","warn");return}let u=!1,d=[],b=(x,A)=>{let T=x.querySelector("input");if(!T)return;T.value=A;let S=x.dataset.guid,L=Number.parseInt(x.querySelector("[data-time]")?.dataset.time??"",10);S&&Number.isFinite(L)&&d.push({guid:S,start:L,comment:A})};try{let x=JSON.parse(i),A=null;if(Array.isArray(x))A=x;else if(typeof x=="object"&&x!==null){let T=Ie;if(T){let S=`timekeeper-${T}`;x[S]&&Array.isArray(x[S].timestamps)&&(A=x[S].timestamps,l(`Found timestamps for current video (${T}) in export format`,"info"))}if(!A){let S=Object.keys(x).filter(L=>L.startsWith("ytls-"));if(S.length===1&&Array.isArray(x[S[0]].timestamps)){A=x[S[0]].timestamps;let L=x[S[0]].video_id;l(`Found timestamps for video ${L} in export format`,"info")}}}A&&Array.isArray(A)?A.every(S=>typeof S.start=="number"&&typeof S.comment=="string")?(A.forEach(S=>{if(S.guid){let L=De().find(B=>B.dataset.guid===S.guid);L?b(L,S.comment):xo(S.start,S.comment,!1,S.guid)}else xo(S.start,S.comment,!1,crypto.randomUUID())}),u=!0):l("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):l("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!u){let x=i.split(`
`).map(A=>A.trim()).filter(A=>A);if(x.length>0){let A=!1;x.forEach(T=>{let S=T.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(S){A=!0;let L=parseInt(S[1])||0,B=parseInt(S[2]),D=parseInt(S[3]),F=L*3600+B*60+D,ne=S[4]?S[4].trim():"",be=null,dt=ne,J=ne.match(/<!--\s*guid:([^>]+?)\s*-->/);J&&(be=J[1].trim(),dt=ne.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let ie;be&&(ie=De().find(ze=>ze.dataset.guid===be)),!ie&&!be&&(ie=De().find(ze=>{if(ze.dataset.guid)return!1;let kt=ze.querySelector("[data-time]")?.dataset.time;if(!kt)return!1;let Dt=Number.parseInt(kt,10);return Number.isFinite(Dt)&&Dt===F})),ie?b(ie,dt):xo(F,dt,!1,be||crypto.randomUUID())}}),A&&(u=!0)}}u?(l("Timestamps changed: Imported timestamps from file/clipboard"),Ct(),wi(),es(Ie,d),Ve(),pr()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function fd(){if(fi){l("Pane initialization already in progress, skipping duplicate call");return}if(!(r&&document.body.contains(r))){fi=!0;try{let x=function(p=null,g=null){if(!m)return;let w=Re(),k=g||K();if(!w&&!k)return;let M=p!==null?p:k?k.getCurrentTime():0,W=Number.isFinite(M)?Math.max(0,Math.floor(M)):Math.max(0,an()),{isLive:_}=k?k.getVideoData()||{isLive:!1}:{isLive:!1},z=k?Ka(k,!!_):!1;m.textContent=_r(W,sr(k,w)),m.style.color=z?"#ff4d4f":"",b(!!_);try{ci()}catch{}},A=function(){if(ye||Rt)return;let p=K();if(!p)return;let g=p.getCurrentTime(),w=Number.isFinite(g)?Math.max(0,Math.floor(g)):Math.max(0,an());x(w,p),(s?De():[]).length>0&&xt(!1,w)},ie=function(p,g,w,k){let M=document.createElement("button");return k?$(M,k,p):M.textContent=p,Pe(M,g),M.classList.add("ytls-settings-modal-button"),M.onclick=w,M},ze=function(p="general"){if(N&&N.parentNode===document.body){let ae=document.getElementById("ytls-save-modal"),fn=document.getElementById("ytls-load-modal"),Yt=document.getElementById("ytls-delete-all-modal");ae&&document.body.contains(ae)&&document.body.removeChild(ae),fn&&document.body.contains(fn)&&document.body.removeChild(fn),Yt&&document.body.contains(Yt)&&document.body.removeChild(Yt),N.classList.remove("ytls-fade-in"),N.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(N)&&document.body.removeChild(N),N=null,document.removeEventListener("click",kt,!0),document.removeEventListener("keydown",st)},300);return}N=document.createElement("div"),N.id="ytls-settings-modal",N.classList.remove("ytls-fade-out"),N.classList.add("ytls-fade-in");let g=document.createElement("div");g.className="ytls-modal-header";let w=document.createElement("div");w.id="ytls-settings-nav";let k=document.createElement("button");k.className="ytls-modal-close-button",Ue(k,"x",14),k.onclick=()=>{if(N&&N.parentNode===document.body){let ae=document.getElementById("ytls-save-modal"),fn=document.getElementById("ytls-load-modal"),Yt=document.getElementById("ytls-delete-all-modal");ae&&document.body.contains(ae)&&document.body.removeChild(ae),fn&&document.body.contains(fn)&&document.body.removeChild(fn),Yt&&document.body.contains(Yt)&&document.body.removeChild(Yt),N.classList.remove("ytls-fade-in"),N.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(N)&&document.body.removeChild(N),N=null,document.removeEventListener("click",kt,!0),document.removeEventListener("keydown",st)},300)}};let M=document.createElement("div");M.id="ytls-settings-content";let W=document.createElement("h3");W.className="ytls-section-heading",W.textContent="General",W.style.display="none";let _=document.createElement("div"),z=document.createElement("div");z.className="ytls-button-grid";let C=document.createElement("div");C.className="ytls-button-grid";function Q(ae){_.style.display=ae==="general"?"block":"none",z.style.display=ae==="google"?"block":"none",C.style.display=ae==="sync"?"block":"none",me.classList.toggle("active",ae==="general"),Je.classList.toggle("active",ae==="google"),At.classList.toggle("active",ae==="sync"),W.textContent=ae==="general"?"General":ae==="google"?"Google":"Sync"}let me=document.createElement("button");me.appendChild(Rn("adjustments-horizontal",16));let Be=document.createElement("span");Be.className="ytls-tab-text",Be.textContent=" General",me.appendChild(Be),Pe(me,"General settings"),me.classList.add("ytls-settings-modal-button"),me.onclick=()=>Q("general");let Je=document.createElement("button");Je.appendChild(Rn("cloud",16));let dn=document.createElement("span");dn.className="ytls-tab-text",dn.textContent=" Google",Je.appendChild(dn),Pe(Je,"Google Drive backup settings"),Je.classList.add("ytls-settings-modal-button"),Je.onclick=async()=>{vt.isSignedIn&&await Bu(),Q("google")};let At=document.createElement("button");At.appendChild(Rn("server",16));let pn=document.createElement("span");pn.className="ytls-tab-text",pn.textContent=" Sync",At.appendChild(pn),Pe(At,"Live sync across devices"),At.classList.add("ytls-settings-modal-button"),At.onclick=()=>Q("sync"),w.appendChild(me),w.appendChild(Je),w.appendChild(At),g.appendChild(w),g.appendChild(k),N.appendChild(g),_.className="ytls-button-grid",_.appendChild(ie("Save","Save As...",Dt.onclick,"device-floppy")),_.appendChild(ie("Load","Load",Vn.onclick,"folder-open")),_.appendChild(ie("Export All","Export All Data",cn.onclick,"file-export")),_.appendChild(ie("Import All","Import All Data",qn.onclick,"file-import")),_.appendChild(ie("Export All (CSV)","Export All Timestamps to CSV",async()=>{try{await pd()}catch{alert("Failed to export CSV: Could not read from database.")}},"file-spreadsheet"));let $t=ie(vt.isSignedIn?"Sign Out":"Sign In",vt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{vt.isSignedIn?await Lu():await Mu(),$($t,vt.isSignedIn?"logout":"login",vt.isSignedIn?"Sign Out":"Sign In"),Pe($t,vt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),ke()},vt.isSignedIn?"logout":"login"),Mo=ie(Yo()?"Auto Backup: On":"Auto Backup: Off","Toggle Auto Backup",async()=>{await Ou(),Mr(),ke()},"refresh"),ys=ie(`Backup Interval: ${Gt()}min`,"Set periodic backup interval (minutes)",async()=>{await Nu(),Mr(),ke()},"clock-plus"),Mr=()=>{$($t,vt.isSignedIn?"logout":"login",vt.isSignedIn?"Sign Out":"Sign In"),Pe($t,vt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),$(Mo,"refresh",Yo()?"Auto Backup: On":"Auto Backup: Off"),$(ys,"clock-plus",`Backup Interval: ${Gt()}min`),typeof ke=="function"&&ke()};z.appendChild($t),z.appendChild(Mo),z.appendChild(ys),z.appendChild(ie("Backup Now","Run a backup immediately",async()=>{await Wo({silent:!1,skipBackoff:!0}),Mr()},"database"));let Wt=document.createElement("div");Wt.style.marginTop="15px",Wt.style.paddingTop="10px",Wt.style.borderTop="1px solid #555",Wt.style.fontSize="12px",Wt.style.color="#aaa";let Ir=document.createElement("div");Ir.style.marginBottom="8px",Ir.style.fontWeight="bold",Wt.appendChild(Ir),vu(Ir);let Ai=document.createElement("div");Ai.style.marginBottom="8px",hu(Ai),Wt.appendChild(Ai);let ws=document.createElement("div");gu(ws),Wt.appendChild(ws),z.appendChild(Wt),ot(),co(),ke(),Mr();let Lr=ie("Sign In","Sign in to Timekeeper Sync with Google",async()=>{We().isSignedIn?await ru():await nu()},"login"),bs=ie("Sync Now","Sync with the server immediately",()=>Sa(),"refresh");Vc(()=>{let ae=We().isSignedIn;$(Lr,ae?"logout":"login",ae?"Sign Out":"Sign In"),Pe(Lr,ae?"Sign out of Timekeeper Sync":"Sign in to Timekeeper Sync with Google"),Lr.disabled=!ae&&!Nn(),bs.disabled=!ae}),C.appendChild(Lr),C.appendChild(bs);let mn=document.createElement("div");mn.style.marginTop="15px",mn.style.paddingTop="10px",mn.style.borderTop="1px solid #555",mn.style.fontSize="12px",mn.style.color="#aaa";let Br=document.createElement("div");Br.style.marginBottom="8px",Br.style.fontWeight="bold",mn.appendChild(Br),Uc(Br);let Ss=document.createElement("div");mn.appendChild(Ss),Fc(Ss),C.appendChild(mn),io(),M.appendChild(W),M.appendChild(_),M.appendChild(z),M.appendChild(C),Q(p==="drive"?"google":p),N.appendChild(M),document.body.appendChild(N),requestAnimationFrame(()=>{let ae=N.getBoundingClientRect(),Yt=(window.innerHeight-ae.height)/2;N.style.top=`${Math.max(20,Yt)}px`,N.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",kt,!0),document.addEventListener("keydown",st)},0)},st=function(p){if(p.key==="Escape"&&N&&N.parentNode===document.body){let g=document.getElementById("ytls-save-modal"),w=document.getElementById("ytls-load-modal"),k=document.getElementById("ytls-delete-all-modal");if(g||w||k)return;p.preventDefault(),g&&document.body.contains(g)&&document.body.removeChild(g),w&&document.body.contains(w)&&document.body.removeChild(w),k&&document.body.contains(k)&&document.body.removeChild(k),N.classList.remove("ytls-fade-in"),N.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(N)&&document.body.removeChild(N),N=null,document.removeEventListener("click",kt,!0),document.removeEventListener("keydown",st)},300)}},kt=function(p){if(Xo&&Xo.contains(p.target))return;let g=document.getElementById("ytls-save-modal"),w=document.getElementById("ytls-load-modal"),k=document.getElementById("ytls-delete-all-modal");g&&g.contains(p.target)||w&&w.contains(p.target)||k&&k.contains(p.target)||N&&N.contains(p.target)||(g&&document.body.contains(g)&&document.body.removeChild(g),w&&document.body.contains(w)&&document.body.removeChild(w),k&&document.body.contains(k)&&document.body.removeChild(k),N&&N.parentNode===document.body&&(N.classList.remove("ytls-fade-in"),N.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(N)&&document.body.removeChild(N),N=null,document.removeEventListener("click",kt,!0),document.removeEventListener("keydown",st)},300)))},Ao=function(){r&&(l("Loading window position from IndexedDB"),bi("windowPosition").then(p=>{let g=ks.safeParse(p);if(g.success){let k=g.data;r.style.left=`${k.x}px`,r.style.top=`${k.y}px`,r.style.right="auto",r.style.bottom="auto",typeof k.width=="number"&&k.width>0?r.style.width=`${k.width}px`:(r.style.width=`${di}px`,l(`No stored window width found, using default width ${di}px`)),typeof k.height=="number"&&k.height>0?r.style.height=`${k.height}px`:(r.style.height=`${pi}px`,l(`No stored window height found, using default height ${pi}px`));let M=re();Te(M,k.x,k.y),l("Restored window position from IndexedDB:",U())}else g.success?l("No window position found in IndexedDB, applying default size and leaving default position"):l("Window position in IndexedDB failed validation:",g.error.message,"warn"),r.style.width=`${di}px`,r.style.height=`${pi}px`,R(null);Fn();let w=re();w&&(w.width||w.height)&&Te(w),He?.()}).catch(p=>{l("failed to load pane position from IndexedDB:",p,"warn"),Fn();let g=re();g&&(g.width||g.height)&&R({x:Math.max(0,Math.round(g.left)),y:0,width:Math.round(g.width),height:Math.round(g.height)}),He?.()}))},Eo=function(){if(!r)return;let p=re();if(!p)return;let g={x:Math.max(0,Math.round(p.left)),y:Math.max(0,Math.round(p.top)),width:Math.round(p.width),height:Math.round(p.height)},w=U();if(w&&w.x===g.x&&w.y===g.y&&w.width===g.width&&w.height===g.height){l("Skipping window position save; position and size unchanged");return}R({...g}),l(`Saving window position and size to IndexedDB: x=${g.x}, y=${g.y}, width=${g.width}, height=${g.height}`),gr("windowPosition",g),En({type:"window_position_updated",position:g,timestamp:Date.now()})},Tr=function(p,g){p.addEventListener("dblclick",w=>{w.preventDefault(),w.stopPropagation(),r&&(r.style.width="300px",r.style.height="300px",Eo(),Er())}),p.addEventListener("mousedown",w=>{w.preventDefault(),w.stopPropagation(),Pt=!0,un=g,ds=w.clientX,ps=w.clientY;let k=r.getBoundingClientRect();jn=k.width,$n=k.height,Sr=k.left,xr=k.top,ms=document.documentElement.clientWidth,fs=document.documentElement.clientHeight,g==="top-left"||g==="bottom-right"?document.body.style.cursor="nwse-resize":document.body.style.cursor="nesw-resize"})},gs=function(){if(!s||!on)return;let{scrollTop:p,scrollHeight:g,clientHeight:w}=s;if(g<=w)return;let k=Math.max(30,w/g*w),M=p/(g-w)*(w-k);on.style.height=`${k}px`,on.style.top=`${M}px`},vs=function(){Xe&&(ki===null&&(ki=requestAnimationFrame(()=>{ki=null,gs()})),Xe.classList.add("ytls-scrollbar-visible"),wt&&clearTimeout(wt),wt=setTimeout(()=>{Xe?.classList.remove("ytls-scrollbar-visible"),wt=null},500))},Er=function(){if(r&&c&&h&&s){let p=r.getBoundingClientRect(),g=c.getBoundingClientRect(),w=h.getBoundingClientRect(),k=p.height-(g.height+w.height);s.style.maxHeight=k>0?k+"px":"0px",s.style.overflowY=k>0?"auto":"hidden"}};if(document.querySelectorAll("#ytls-pane").forEach(p=>p.remove()),!document.getElementById("ytls-styles")){let p=document.createElement("style");p.id="ytls-styles",p.textContent=ul,document.head.appendChild(p)}r=document.createElement("div"),c=document.createElement("div"),s=document.createElement("ul"),h=document.createElement("div"),m=document.createElement("span"),P=document.createElement("span"),G=document.createElement("span"),G.classList.add("ytls-backup-indicator"),G.style.cursor="pointer",G.style.backgroundColor="#666",G.onclick=p=>{p.stopPropagation(),ze(Vo()?"sync":"drive")},s.addEventListener("mouseenter",()=>{Mn=!0,vo=!1}),s.addEventListener("mouseleave",()=>{Mn=!1;try{Ci()}catch{}if(vo)return;xt(!1);let p=null;if(document.activeElement instanceof HTMLInputElement&&s.contains(document.activeElement)&&(p=document.activeElement.closest("li")?.dataset.guid??null),Za(),p){let w=De().find(k=>k.dataset.guid===p)?.querySelector("input");if(w)try{w.focus({preventScroll:!0})}catch{}}}),r.id="ytls-pane",c.id="ytls-pane-header",c.addEventListener("dblclick",p=>{let g=p.target instanceof Element?p.target:null;if(g){let w=g;for(;w&&w!==r;){if(window.getComputedStyle(w).cursor==="pointer")return;w=w.parentElement}}p.preventDefault(),Si(!1)});let i=p=>{try{p.stopPropagation()}catch{}};["click","dblclick","mousedown","pointerdown","touchstart","wheel"].forEach(p=>{r.addEventListener(p,i)}),r.addEventListener("keydown",p=>{try{p.stopPropagation()}catch{}}),r.addEventListener("keyup",p=>{try{p.stopPropagation()}catch{}}),r.addEventListener("focus",p=>{try{p.stopPropagation()}catch{}},!0),r.addEventListener("blur",p=>{try{p.stopPropagation()}catch{}},!0),P.textContent=`v${Dr}`,P.classList.add("ytls-version-display"),Li&&Pe(P,`Built ${Li.toLocaleString()}`);let u=document.createElement("span");u.style.display="inline-flex",u.style.alignItems="center",u.style.gap="6px",u.appendChild(P),u.appendChild(G),y=document.createElement("span"),y.id="ytls-members-badge",y.appendChild(Rn("star",14)),Pe(y,"Members-only stream"),us(),m.id="ytls-current-time",m.textContent="\u2014",m.style.cursor="default",Pe(m,()=>{let p=K(),{isLive:g}=p?p.getVideoData()||{isLive:!1}:{isLive:!1};return g?"Skip to live":""}),v=document.createElement("span"),v.id="ytls-playback-speed",v.textContent="1x",v.style.cursor="pointer",v.style.userSelect="none",Pe(v,()=>`Current playback speed. Click to toggle between 1x and ${Ut(E)}x.`),v.onclick=()=>{_a()},v.addEventListener("mousedown",p=>{p.stopPropagation()}),v.addEventListener("click",p=>{p.stopPropagation()}),m.onclick=()=>{let p=K();if(!p)return;let{isLive:g}=p.getVideoData()||{isLive:!1};g&&(Rt=!0,p.seekToLiveHead(),setTimeout(()=>{Rt=!1},500))};let b=p=>{m.style.cursor=p?"pointer":"default"};A(),Me&&clearInterval(Me),Me=setInterval(A,1e3),h.id="ytls-buttons";let T=(p,g)=>()=>{p.classList.remove("ytls-fade-in"),p.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(p)&&document.body.removeChild(p),g&&g()},300)},S=p=>g=>{g.key==="Escape"&&(g.preventDefault(),g.stopPropagation(),p())},L=p=>{setTimeout(()=>{document.addEventListener("keydown",p)},0)},B=(p,g)=>w=>{p.contains(w.target)||g()},D=p=>{setTimeout(()=>{document.addEventListener("click",p,!0)},0)};[{id:"add",icon:"alarm-plus",title:"Add timestamp",action:()=>{if(Tt())return;let p=typeof Gn<"u"?Gn:0,g=K(),w=g?Math.floor(g.getCurrentTime()+p):0;if(!Number.isFinite(w))return;let k=xo(w,"");k&&k.focus()}},{id:"settings",icon:"settings",title:"Settings",action:()=>ze()},{id:"copy",icon:"clipboard",title:"Copy timestamps to clipboard",action:function(p){if(Tt()){Ue(this,"circle-x",20),setTimeout(()=>{Ue(this,"clipboard",20)},2e3);return}let g=hi();if(g.length===0){Ue(this,"circle-x",20),setTimeout(()=>{Ue(this,"clipboard",20)},2e3);return}let w=p.ctrlKey,k=Bi(g,w);navigator.clipboard.writeText(k).then(()=>{Ue(this,"circle-check",20),setTimeout(()=>{Ue(this,"clipboard",20)},2e3)}).catch(M=>{l("Failed to copy timestamps: ",M,"error"),Ue(this,"circle-x",20),setTimeout(()=>{Ue(this,"clipboard",20)},2e3)})}},{id:"offset",icon:"clock-plus",title:"Offset all timestamps",action:()=>{if(Tt())return;if(De().length===0){alert("No timestamps available to offset.");return}let g=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(g===null)return;let w=g.trim();if(w.length===0)return;let k=Number.parseInt(w,10);if(!Number.isFinite(k)){alert("Please enter a valid integer number of seconds.");return}k!==0&&Ja(k,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{id:"delete",icon:"trash",title:"Delete all timestamps for current video",action:async()=>{let p=ko();if(!p){alert("Unable to determine current video ID.");return}let g=document.createElement("div");g.id="ytls-delete-all-modal",g.classList.remove("ytls-fade-out"),g.classList.add("ytls-fade-in");let w=document.createElement("p");w.textContent="Hold the button to delete all timestamps for:",w.style.marginBottom="10px";let k=document.createElement("p");k.textContent=p,k.style.fontFamily="monospace",k.style.fontSize="12px",k.style.marginBottom="15px",k.style.color="#aaa";let M=document.createElement("button");M.classList.add("ytls-save-modal-button"),M.style.background="#d32f2f",M.style.position="relative",M.style.overflow="hidden";let W=null,_=0,z=null,C=document.createElement("div");C.style.position="absolute",C.style.left="0",C.style.top="0",C.style.height="100%",C.style.width="0%",C.style.background="#ff6b6b",C.style.transition="none",C.style.pointerEvents="none",M.appendChild(C);let Q=document.createElement("span");Q.textContent="Hold to Delete All",Q.style.position="relative",Q.style.zIndex="1",M.appendChild(Q);let me=()=>{if(!_)return;let $t=Date.now()-_,Mo=Math.min($t/5e3*100,100);C.style.width=`${Mo}%`,Mo<100&&(z=requestAnimationFrame(me))},Be=()=>{W&&(clearTimeout(W),W=null),z&&(cancelAnimationFrame(z),z=null),_=0,C.style.width="0%",Q.textContent="Hold to Delete All"};M.onmousedown=()=>{_=Date.now(),Q.textContent="Deleting...",z=requestAnimationFrame(me),W=setTimeout(async()=>{Be(),g.classList.remove("ytls-fade-in"),g.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(g)&&document.body.removeChild(g);try{await rs(p),xi()}catch($t){l("Failed to delete all timestamps:",$t,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},M.onmouseup=Be,M.onmouseleave=Be;let Je=null,dn=null,At=T(g,()=>{Be(),Je&&document.removeEventListener("keydown",Je),dn&&document.removeEventListener("click",dn,!0)});Je=S(At),dn=B(g,At);let pn=document.createElement("button");pn.textContent="Cancel",pn.classList.add("ytls-save-modal-cancel-button"),pn.onclick=At,g.appendChild(w),g.appendChild(k),g.appendChild(M),g.appendChild(pn),document.body.appendChild(g),L(Je),D(dn)}}].forEach(p=>{let g=document.createElement("button");Ue(g,p.icon,20),Pe(g,p.title),g.classList.add("ytls-main-button"),p.id==="copy"?g.onclick=function(w){p.action.call(this,w)}:g.onclick=p.action,p.id==="settings"&&(Xo=g),h.appendChild(g)});let Dt=document.createElement("button");$(Dt,"device-floppy","Save"),Dt.classList.add("ytls-file-operation-button"),Dt.onclick=()=>{let p=document.createElement("div");p.id="ytls-save-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let g=document.createElement("p");g.textContent="Save as:";let w=null,k=null,M=T(p,()=>{w&&document.removeEventListener("keydown",w),k&&document.removeEventListener("click",k,!0)});w=S(M),k=B(p,M);let W=document.createElement("button");W.textContent="JSON",W.classList.add("ytls-save-modal-button"),W.onclick=()=>{w&&document.removeEventListener("keydown",w),k&&document.removeEventListener("click",k,!0),T(p,()=>ns("json"))()};let _=document.createElement("button");_.textContent="Plain Text",_.classList.add("ytls-save-modal-button"),_.onclick=()=>{w&&document.removeEventListener("keydown",w),k&&document.removeEventListener("click",k,!0),T(p,()=>ns("text"))()};let z=document.createElement("button");z.textContent="Cancel",z.classList.add("ytls-save-modal-cancel-button"),z.onclick=M,p.appendChild(g),p.appendChild(W),p.appendChild(_),p.appendChild(z),document.body.appendChild(p),L(w),D(k)};let Vn=document.createElement("button");$(Vn,"folder-open","Load"),Vn.classList.add("ytls-file-operation-button"),Vn.onclick=()=>{let p=document.createElement("div");p.id="ytls-load-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let g=document.createElement("p");g.textContent="Load from:";let w=null,k=null,M=T(p,()=>{w&&document.removeEventListener("keydown",w),k&&document.removeEventListener("click",k,!0)});w=S(M),k=B(p,M);let W=document.createElement("button");W.textContent="File",W.classList.add("ytls-save-modal-button"),W.onclick=()=>{let C=document.createElement("input");C.type="file",C.accept=".json,.txt",C.classList.add("ytls-hidden-file-input"),C.onchange=Q=>{let me=Q.target.files?.[0];if(!me)return;w&&document.removeEventListener("keydown",w),k&&document.removeEventListener("click",k,!0),M();let Be=new FileReader;Be.onload=()=>{let Je=String(Be.result).trim();as(Je)},Be.readAsText(me)},C.click()};let _=document.createElement("button");_.textContent="Clipboard",_.classList.add("ytls-save-modal-button"),_.onclick=async()=>{w&&document.removeEventListener("keydown",w),k&&document.removeEventListener("click",k,!0),T(p,async()=>{try{let C=await navigator.clipboard.readText();C?as(C.trim()):alert("Clipboard is empty.")}catch(C){l("Failed to read from clipboard: ",C,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let z=document.createElement("button");z.textContent="Cancel",z.classList.add("ytls-save-modal-cancel-button"),z.onclick=M,p.appendChild(g),p.appendChild(W),p.appendChild(_),p.appendChild(z),document.body.appendChild(p),L(w),D(k)};let cn=document.createElement("button");$(cn,"file-export","Export"),cn.classList.add("ytls-file-operation-button"),cn.onclick=async()=>{try{await dd()}catch{alert("Failed to export data: Could not read from database.")}};let qn=document.createElement("button");$(qn,"file-import","Import"),qn.classList.add("ytls-file-operation-button"),qn.onclick=()=>{let p=document.createElement("input");p.type="file",p.accept=".json",p.classList.add("ytls-hidden-file-input"),p.onchange=g=>{let w=g.target.files?.[0];if(!w)return;let k=new FileReader;k.onload=()=>{try{let M=JSON.parse(String(k.result)),W=[];for(let _ in M)if(Object.prototype.hasOwnProperty.call(M,_)&&_.startsWith("ytls-")){let z=_.substring(5),C=M[_];if(C&&typeof C.video_id=="string"&&Array.isArray(C.timestamps)){let Q=C.timestamps.map(Be=>({...Be,guid:Be.guid||crypto.randomUUID()})),me=rd(z,Q).then(()=>l(`Imported ${z} to IndexedDB`)).catch(Be=>l(`Failed to import ${z} to IndexedDB:`,Be,"error"));W.push(me)}else l(`Skipping key ${_} during import due to unexpected data format.`,"warn")}Promise.all(W).then(()=>{xi()}).catch(_=>{alert("An error occurred during import to IndexedDB. Check console for details."),l("Overall import error:",_,"error")})}catch(M){alert(`Failed to import data. Please ensure the file is in the correct format.
`+M.message),l("Import error:",M,"error")}},k.readAsText(w)},p.click()},s.onclick=p=>{Qa(p)},s.ontouchstart=p=>{Qa(p)},r.style.position="fixed",r.style.bottom="0",r.style.right="0",r.style.transition="none",Ao(),setTimeout(()=>Fn(),10);let jt=!1,vr=0,yr=0,wr=0,Cn=0,br=0,V=0,H=null,de=!1;r.addEventListener("mousedown",p=>{let g=p.target;if(!(g instanceof Element)||g instanceof HTMLInputElement||g instanceof HTMLTextAreaElement||g instanceof Element&&(g.closest("#ytls-playback-speed-group")||g.closest("#ytls-playback-speed"))||g!==c&&!c.contains(g)&&window.getComputedStyle(g).cursor==="pointer")return;jt=!0,de=!1;let w=r.getBoundingClientRect();vr=p.clientX-w.left,yr=p.clientY-w.top,wr=w.width,Cn=w.height,br=document.documentElement.clientWidth,V=document.documentElement.clientHeight,r.style.transition="none"}),document.addEventListener("mousemove",Qo=p=>{if(!jt)return;de=!0;let g=p.clientX,w=p.clientY;H===null&&(H=requestAnimationFrame(()=>{if(H=null,!jt)return;let k=Math.max(0,Math.min(g-vr,br-wr)),M=Math.max(0,Math.min(w-yr,V-Cn));r.style.left=`${k}px`,r.style.top=`${M}px`,r.style.right="auto",r.style.bottom="auto"}))}),document.addEventListener("mouseup",Zo=()=>{if(!jt)return;jt=!1,H!==null&&(cancelAnimationFrame(H),H=null);let p=de;setTimeout(()=>{de=!1},50),Fn(),setTimeout(()=>{p&&Eo()},200)}),r.addEventListener("dragstart",p=>p.preventDefault());let Z=document.createElement("div"),he=document.createElement("div"),qe=document.createElement("div"),pt=document.createElement("div");Z.id="ytls-resize-tl",he.id="ytls-resize-tr",qe.id="ytls-resize-bl",pt.id="ytls-resize-br";let Pt=!1,ds=0,ps=0,jn=0,$n=0,Sr=0,xr=0,ms=0,fs=0,Wn=null,un=null;Tr(Z,"top-left"),Tr(he,"top-right"),Tr(qe,"bottom-left"),Tr(pt,"bottom-right"),document.addEventListener("mousemove",p=>{if(!Pt||!r||!un)return;let g=p.clientX,w=p.clientY;Wn===null&&(Wn=requestAnimationFrame(()=>{if(Wn=null,!Pt||!r||!un)return;let k=g-ds,M=w-ps,W=ms,_=fs,z=jn,C=$n,Q=Sr,me=xr;un==="bottom-right"?(z=Math.max(200,Math.min(800,jn+k)),C=Math.max(250,Math.min(_,$n+M))):un==="top-left"?(z=Math.max(200,Math.min(800,jn-k)),Q=Sr+k,C=Math.max(250,Math.min(_,$n-M)),me=xr+M):un==="top-right"?(z=Math.max(200,Math.min(800,jn+k)),C=Math.max(250,Math.min(_,$n-M)),me=xr+M):un==="bottom-left"&&(z=Math.max(200,Math.min(800,jn-k)),Q=Sr+k,C=Math.max(250,Math.min(_,$n+M))),Q=Math.max(0,Math.min(Q,W-z)),me=Math.max(0,Math.min(me,_-C)),r.style.width=`${z}px`,r.style.height=`${C}px`,r.style.left=`${Q}px`,r.style.top=`${me}px`,r.style.right="auto",r.style.bottom="auto"}))}),document.addEventListener("mouseup",()=>{Pt&&(Pt=!1,Wn!==null&&(cancelAnimationFrame(Wn),Wn=null),un=null,document.body.style.cursor="",Ke(!0))});let kr=null;window.addEventListener("resize",er=()=>{kr&&clearTimeout(kr),kr=setTimeout(()=>{Ke(!0),He?.(),kr=null},200)}),c.appendChild(y),c.appendChild(m);let Yn=document.createElement("span");Yn.id="ytls-playback-speed-group",Yn.style.display="inline-flex",Yn.style.alignItems="center",Yn.style.marginLeft="4px",v&&Yn.appendChild(v),c.appendChild(Yn),c.appendChild(u);let Ti=document.createElement("div");Ti.id="ytls-list-wrapper",Xe=document.createElement("div"),Xe.className="ytls-scrollbar-track",on=document.createElement("div"),on.className="ytls-scrollbar-thumb",Xe.append(on),Ti.append(s,Xe);let Ar=document.createElement("div");Ar.id="ytls-content",Ar.append(Ti),Ar.append(h),r.append(c,Ar,Z,he,qe,pt);let hs="";r.addEventListener("mousemove",p=>{if(jt||Pt)return;let g=r.getBoundingClientRect(),w=20,k=p.clientX,M=p.clientY,W=k-g.left<=w,_=g.right-k<=w,z=M-g.top<=w,C=g.bottom-M<=w,Q="";z&&W||C&&_?Q="nwse-resize":(z&&_||C&&W)&&(Q="nesw-resize"),Q!==hs&&(hs=Q,document.body.style.cursor=Q)});let ki=null;if(Xe.addEventListener("mouseenter",()=>{wt&&(clearTimeout(wt),wt=null),Xe.classList.add("ytls-scrollbar-visible")}),Xe.addEventListener("mouseleave",()=>{mi||(wt=setTimeout(()=>{Xe?.classList.remove("ytls-scrollbar-visible"),wt=null},500))}),on.addEventListener("mousedown",p=>{if(!s)return;p.preventDefault(),p.stopPropagation(),mi=!0;let g=p.clientY,w=s.scrollTop,{scrollHeight:k,clientHeight:M}=s,W=Math.max(30,M/k*M),_=k-M,z=M-W;function C(me){if(!s)return;let Be=me.clientY-g;s.scrollTop=Math.max(0,Math.min(_,w+Be*(_/z))),gs()}function Q(){mi=!1,document.removeEventListener("mousemove",C),document.removeEventListener("mouseup",Q),Xe?.matches(":hover")||(wt=setTimeout(()=>{Xe?.classList.remove("ytls-scrollbar-visible"),wt=null},500))}document.addEventListener("mousemove",C),document.addEventListener("mouseup",Q)}),r.addEventListener("mouseenter",()=>{Mn=!0,vs()}),s.addEventListener("scroll",vs),r.addEventListener("mouseleave",()=>{!Pt&&!jt&&(document.body.style.cursor=""),Mn=!1;try{Ci()}catch{}try{xt(!1)}catch{}}),He=Er,setTimeout(()=>{if(Er(),r&&c&&h&&s){let p=40,g=De();if(g.length>0)p=g[0].offsetHeight;else{let w=document.createElement("li");w.style.visibility="hidden",w.style.position="absolute",w.textContent="00:00 Example",s.appendChild(w),p=w.offsetHeight,s.removeChild(w)}j(c.offsetHeight+h.offsetHeight+p),r.style.minHeight=O()+"px"}},0),St){try{St.disconnect()}catch{}St=null}St=new ResizeObserver(Er),St.observe(r),ho||document.addEventListener("pointerdown",ho=()=>{Ua=Date.now()},!0),go||document.addEventListener("pointerup",go=()=>{},!0)}finally{fi=!1}}}async function hd(){if(!r)return;if(document.querySelectorAll("#ytls-pane").forEach(d=>{d!==r&&(l("Removing duplicate pane element from DOM"),d.remove())}),document.body.contains(r)){l("Pane already in DOM, skipping append");return}await md(),Su(cd),xu(ud),Ia(gr),La(bi),Tu(hr),yu(G),Yc(()=>li()),await Ba(),await Pu(),await kn(),li();let u=document.querySelectorAll("#ytls-pane");if(u.length>0&&(l(`WARNING: Found ${u.length} existing pane(s) in DOM, removing all`),u.forEach(d=>d.remove())),document.body.contains(r)){l("ERROR: Pane already in body, aborting append");return}if(document.body.appendChild(r),l("Pane successfully appended to DOM"),Ne(),Le&&(clearTimeout(Le),Le=null),Le=setTimeout(()=>{Lt(),He?.(),_e(),Ke(!0),Le=null},450),bt){try{bt.disconnect()}catch{}bt=null}bt=new MutationObserver(()=>{let d=document.querySelectorAll("#ytls-pane");d.length>1&&(l(`CRITICAL: Multiple panes detected (${d.length}), removing duplicates`),d.forEach((b,x)=>{(x>0||r&&b!==r)&&b.remove()}))}),bt.observe(document.body,{childList:!0})}function ss(i=0){if(document.getElementById("ytls-header-button")){qt();return}let u=document.querySelector("#logo");if(!u||!u.parentElement){i<10&&setTimeout(()=>ss(i+1),300);return}let d=document.createElement("button");d.id="ytls-header-button",d.type="button",d.className="ytls-header-button",Pe(d,"Toggle Timekeeper UI"),d.setAttribute("aria-label","Toggle Timekeeper UI");let b=document.createElement("img");b.src=Or,b.alt="",b.decoding="async",d.appendChild(b),rn=b,d.addEventListener("mouseenter",()=>{rn&&(Jo=!0,rn.src=dl)}),d.addEventListener("mouseleave",()=>{rn&&(Jo=!1,qt())}),d.addEventListener("click",()=>{r&&!document.body.contains(r)&&(l("Pane not in DOM, re-appending before toggle"),document.body.appendChild(r)),Si()}),u.insertAdjacentElement("afterend",d),qt(),l("Timekeeper header button added next to YouTube logo")}function ls(){if(ve())return;pe(!0);let i=history.pushState,u=history.replaceState;function d(){try{let b=new Event("locationchange");window.dispatchEvent(b)}catch{}}history.pushState=function(){let b=i.apply(this,arguments);return d(),b},history.replaceState=function(){let b=u.apply(this,arguments);return d(),b},window.addEventListener("popstate",d),window.addEventListener("locationchange",()=>{window.location.href!==ee&&l("Location changed (locationchange event) \u2014 deferring UI update until navigation finish")})}async function xi(){if(!a()){ed();return}se(window.location.href),document.querySelectorAll("#ytls-pane").forEach((u,d)=>{(d>0||r&&u!==r)&&u.remove()}),await ue(),await fd(),Ie=ko(),f?.videoId!==Ie&&cs(null);let i=document.title;l("Page Title:",i),l("Video ID:",Ie),l("Current URL:",window.location.href),vi(!0),bo(),Ve(),await hr(),Ve(),vi(!1),l("Timestamps loaded and UI unlocked for video:",Ie),await hd();try{xt(!0)}catch{}ss(),od()}ls(),window.addEventListener("yt-navigate-start",()=>{l("Navigation started (yt-navigate-start event fired)"),mr(),a()&&r&&s&&(l("Locking UI and showing loading state for navigation"),vi(!0))}),fo=i=>{if(!i.repeat&&!i.ctrlKey&&!i.altKey&&!i.metaKey&&!i.shiftKey&&(i.key==="z"||i.key==="Z")){if(zu(i.target))return;_a()&&(i.preventDefault(),l("Playback speed toggled via keyboard shortcut (Z)"));return}i.ctrlKey&&i.altKey&&i.shiftKey&&(i.key==="T"||i.key==="t")&&(i.preventDefault(),Si(),l("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",fo),window.addEventListener("pagehide",mr),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&mr()});function cs(i){let u=typeof unsafeWindow<"u"?unsafeWindow:window,d=lc(i?.response??u.ytInitialData,i?.playerResponse??u.ytInitialPlayerResponse);f=d,us(),d&&ou(d)}function us(){if(!y)return;let i=null;try{i=ko()}catch{}let u=!!f?.membersOnly&&f.videoId===i;y.style.display=u?"inline-flex":"none"}window.addEventListener("yt-navigate-finish",i=>{l("Navigation finished (yt-navigate-finish event fired)"),cs(i.detail?.response),window.location.href!==ee?xi():l("Navigation finished but URL already handled, skipping.")});function gd(i){let u=/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(i);if(u&&(u[1]||u[2]||u[3]))return Number(u[1]||0)*3600+Number(u[2]||0)*60+Number(u[3]||0);let d=Number(i);return Number.isFinite(d)?d:null}document.addEventListener("click",i=>{if(i.button!==0||i.ctrlKey||i.metaKey||i.shiftKey||i.altKey)return;let u=i.target?.closest?.("ytd-comments a[href]");if(!u)return;let d=new URL(u.href,location.href),b=d.searchParams.get("t");if(d.pathname!=="/watch"||!b||d.searchParams.get("v")!==ko())return;let x=gd(b),A=K();x===null||!A||(i.preventDefault(),i.stopImmediatePropagation(),A.seekTo(x))},!0),Gc(i=>{for(let u of i)En({type:"timestamps_updated",videoId:u,action:"synced"});Ie&&i.includes(Ie)&&hr()}),du(),ls(),l("Timekeeper initialized and waiting for navigation events")})();})();

