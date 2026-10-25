// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      5.3.3.676
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

(()=>{var od=Object.defineProperty;var rd=(e,t)=>{for(var n in t)od(e,n,{get:t[n],enumerable:!0})};var Io=class extends Error{},Ze=(e,t)=>{throw new Io(`${e||"value"}: expected ${t}`)};function Mt(e){let t={run:e,parse:n=>e(n,""),safeParse:n=>{try{return{success:!0,data:e(n,"")}}catch(r){if(r instanceof Io)return{success:!1,error:r};throw r}},array:()=>id(t)};return t}var fs=e=>typeof e=="object"&&e!==null&&!Array.isArray(e);function Y(){return Mt((e,t)=>typeof e=="string"?e:Ze(t,"string"))}function Rn(){return Mt((e,t)=>typeof e=="boolean"?e:Ze(t,"boolean"))}function Le(e={}){return Mt((t,n)=>typeof t!="number"||Number.isNaN(t)?Ze(n,"number"):(e.finite&&!Number.isFinite(t)&&Ze(n,"finite number"),e.int&&!Number.isInteger(t)&&Ze(n,"integer"),e.nonnegative&&t<0&&Ze(n,"number >= 0"),e.positive&&t<=0&&Ze(n,"number > 0"),e.min!==void 0&&t<e.min&&Ze(n,`number >= ${e.min}`),e.max!==void 0&&t>e.max&&Ze(n,`number <= ${e.max}`),t))}function we(e){return Mt((t,n)=>t===void 0?void 0:e.run(t,n))}function dt(e){return Mt((t,n)=>t===null?null:e.run(t,n))}function Qe(e,t){return Mt((n,r)=>{try{return e.run(n,r)}catch(a){if(a instanceof Io)return t;throw a}})}function id(e){return Mt((t,n)=>Array.isArray(t)?t.map((r,a)=>e.run(r,`${n}[${a}]`)):Ze(n,"array"))}function ad(e){return Mt((t,n)=>{if(!fs(t))return Ze(n,"object");let r={};for(let a of Object.keys(t))r[a]=e.run(t[a],n?`${n}.${a}`:a);return r})}function Ce(e){let t=Mt((n,r)=>{if(!fs(n))return Ze(r,"object");let a={};for(let o of Object.keys(e)){let c=e[o].run(n[o],r?`${r}.${o}`:o);c!==void 0&&(a[o]=c)}return a});return Object.assign(t,{extend:n=>Ce({...e,...n}),partial:()=>{let n={};for(let r of Object.keys(e))n[r]=we(e[r]);return Ce(n)}})}var sd=Mt((e,t)=>typeof e=="string"&&e.length>0?e:Ze(t,"non-empty string")),Lr=Ce({guid:sd,start:Le({finite:!0,nonnegative:!0}),comment:Y(),write_counter:we(Le({int:!0,positive:!0})),deleted_at:Qe(we(Le()),void 0)}),Lo=Lr.array(),fn=Lr.extend({video_id:Y(),device_id:we(Y())}),hs=Ce({x:Le({finite:!0}),y:Le({finite:!0}),width:we(Le({finite:!0,positive:!0})),height:we(Le({finite:!0,positive:!0}))}),Cr=Ce({video_id:Y(),timestamps:Lo}),gs=ad(Cr),ms=Ce({isSignedIn:Qe(Rn(),!1),accessToken:Qe(dt(Y()),null),userName:Qe(dt(Y()),null),email:Qe(dt(Y()),null)}),xi=Qe(Mt((e,t)=>{if(typeof e=="string"){let n;try{n=JSON.parse(e)}catch{return Ze(t,"valid JSON string for auth state")}return ms.run(n,t)}return ms.run(e,t)}),{isSignedIn:!1,accessToken:null,userName:null,email:null}),Yn={isSignedIn:!1,accessToken:null,accessTokenExpiresAt:null,refreshToken:null,userId:null,userName:null,email:null},Ti=Qe(Ce({isSignedIn:Qe(Rn(),!1),accessToken:Qe(dt(Y()),null),accessTokenExpiresAt:Qe(dt(Le({finite:!0})),null),refreshToken:Qe(dt(Y()),null),userId:Qe(dt(Y()),null),userName:Qe(dt(Y()),null),email:Qe(dt(Y()),null)}),Yn),ld=Ce({autoBackupEnabled:Rn(),autoBackupIntervalMinutes:Le({int:!0,min:5,max:1440}),lastAutoBackupAt:we(dt(Le({int:!0,positive:!0})))}),ki=ld;var vs=`<svg
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
</svg>`;var ys=`<svg
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
</svg>`;var ws=`<svg
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
</svg>`;var bs=`<svg
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
</svg>`;var Ss=`<svg
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
</svg>`;var xs=`<svg
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
</svg>`;var Ts=`<svg
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
</svg>`;var ks=`<svg
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
</svg>`;var As=`<svg
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
</svg>`;var Es=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="currentColor"
  class="icon icon-tabler icons-tabler-filled icon-tabler-current-location"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 1a1 1 0 0 1 1 1v1.055a9.004 9.004 0 0 1 7.946 7.945h1.054a1 1 0 0 1 0 2h-1.055a9.004 9.004 0 0 1 -7.944 7.945l-.001 1.055a1 1 0 0 1 -2 0v-1.055a9.004 9.004 0 0 1 -7.945 -7.944l-1.055 -.001a1 1 0 0 1 0 -2h1.055a9.004 9.004 0 0 1 7.945 -7.945v-1.055a1 1 0 0 1 1 -1m0 4a7 7 0 1 0 0 14a7 7 0 0 0 0 -14m0 3a4 4 0 1 1 -4 4l.005 -.2a4 4 0 0 1 3.995 -3.8" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-player-record"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 12a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-x"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M10 10l4 4m0 -4l-4 4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-check"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M9 12l2 2l4 -4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-cloud"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M6.657 18c-2.572 0 -4.657 -2.007 -4.657 -4.483c0 -2.475 2.085 -4.482 4.657 -4.482c.393 -1.762 1.794 -3.2 3.675 -3.773c1.88 -.572 3.956 -.193 5.444 1c1.488 1.19 2.162 3.007 1.77 4.769h.99c1.913 0 3.464 1.56 3.464 3.486c0 1.927 -1.551 3.487 -3.465 3.487h-11.878" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-device-floppy"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
  <path d="M10 14a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M14 4l0 4l-6 0l0 -4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-folder-open"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-export"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v5m-5 6h7m-3 -3l3 3l-3 3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-import"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M5 13v-8a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5.5m-9.5 -2h7m-3 -3l3 3l-3 3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-spreadsheet"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
  <path d="M8 11h8v7h-8l0 -7" />
  <path d="M8 15h8" />
  <path d="M11 11v7" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-login"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
  <path d="M21 12h-13l3 -3" />
  <path d="M11 15l-3 -3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-logout"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
  <path d="M9 12h12l-3 -3" />
  <path d="M18 15l3 -3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-refresh"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
  <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-alert-triangle"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 9v4" />
  <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0" />
  <path d="M12 16h.01" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-database"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M4 6a8 3 0 1 0 16 0a8 3 0 1 0 -16 0" />
  <path d="M4 6v6a8 3 0 0 0 16 0v-6" />
  <path d="M4 12v6a8 3 0 0 0 16 0v-6" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-server"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 7a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-2" />
  <path d="M3 15a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -2" />
  <path d="M7 8l0 .01" />
  <path d="M7 16l0 .01" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-world"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
  <path d="M3.6 9h16.8" />
  <path d="M3.6 15h16.8" />
  <path d="M11.5 3a17 17 0 0 0 0 18" />
  <path d="M12.5 3a17 17 0 0 1 0 18" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-plug-connected"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M7 12l5 5l-1.5 1.5a3.536 3.536 0 1 1 -5 -5l1.5 -1.5" />
  <path d="M17 12l-5 -5l1.5 -1.5a3.536 3.536 0 1 1 5 5l-1.5 1.5" />
  <path d="M3 21l2.5 -2.5" />
  <path d="M18.5 5.5l2.5 -2.5" />
  <path d="M10 11l-2 2" />
  <path d="M13 14l-2 2" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-key"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0" />
  <path d="M15 9h.01" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-x"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M18 6l-12 12" />
  <path d="M6 6l12 12" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-indent-increase"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 6l-11 0" />
  <path d="M20 12l-7 0" />
  <path d="M20 18l-11 0" />
  <path d="M4 8l4 4l-4 4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-indent-decrease"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 6l-7 0" />
  <path d="M20 12l-9 0" />
  <path d="M20 18l-7 0" />
  <path d="M8 8l-4 4l4 4" />
</svg>`;var Fd={plus:vs,"alarm-plus":ys,minus:ws,"circle-plus":bs,"circle-minus":Ss,trash:xs,clipboard:Ts,settings:ks,"clock-plus":As,"current-location":Es,"player-record":Ms,"circle-x":Is,"circle-check":Ls,"adjustments-horizontal":Cs,cloud:Bs,"device-floppy":Rs,"folder-open":Ds,"file-export":Ps,"file-import":Os,"file-spreadsheet":Hs,login:Ns,logout:zs,refresh:_s,"alert-triangle":Gs,database:Fs,server:Us,world:Vs,"plug-connected":qs,key:js,x:$s,"indent-increase":Ws,"indent-decrease":Ks},Ys="http://www.w3.org/2000/svg",Ud=/^\s*<svg\s+([^>]*)>([\s\S]*?)<\/svg>\s*$/,Vd=/<([a-zA-Z][\w:-]*)([^>]*)\/>/g,qd=/([a-zA-Z_:][\w:.-]*)="([^"]*)"/g,Xs=new Map;function Js(e){let t={};for(let n of e.matchAll(qd))t[n[1]]=n[2];return t}function jd(e){return e.startsWith("data:image/svg+xml;base64,")?atob(e.slice(26)):e.startsWith("data:image/svg+xml,")?decodeURIComponent(e.slice(19)):e}function $d(e){let t=jd(e).match(Ud);if(!t)throw new Error("Invalid Tabler SVG source");let[,n,r]=t,a=document.createElementNS(Ys,"svg"),o=Js(n);for(let[c,s]of Object.entries(o))c!=="class"&&a.setAttribute(c,s);for(let c of r.matchAll(Vd)){let[,s,g]=c,m=document.createElementNS(Ys,s),h=Js(g);for(let[f,y]of Object.entries(h))m.setAttribute(f,y);a.appendChild(m)}return a}function Wd(e){let t=Xs.get(e);if(t)return t;let n=$d(Fd[e]);return Xs.set(e,n),n}function Xn(e,t=20){let n=Wd(e).cloneNode(!0);return n.setAttribute("width",String(t)),n.setAttribute("height",String(t)),n.setAttribute("aria-hidden","true"),n.style.pointerEvents="none",n.style.flexShrink="0",n.style.verticalAlign="middle",n}function _e(e,t,n){e.replaceChildren(Xn(t,n))}function j(e,t,n,r){e.replaceChildren(Xn(t,r),document.createTextNode("\xA0"+n))}var Qs="5.3.3";var Br=Qs+"+0136c64";function l(e,...t){let n="debug",r=[...t];t.length>0&&typeof t[t.length-1]=="string"&&["debug","info","warn","error"].includes(t[t.length-1])&&(n=r.pop());let a=`[Timekeeper v${Br}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[n](`${a} ${e}`,...r)}var Rr=e=>String(e).padStart(2,"0");function hn(e,t=e){let n=Math.floor(e/3600),r=Math.floor(e%3600/60),a=Rr(e%60);return t<3600?`${t>=600?Rr(r):r}:${a}`:`${t>=36e3?Rr(n):n}:${Rr(r)}:${a}`}function Dr(e,t,n){let r=hn(e,Math.max(e,n));if(t.length===0)return r;let a=(Math.max(...t)-Math.min(...t))/60,o=(t.length/Math.max(1,a)).toFixed(2);return parseFloat(o)>0?`${r} (${o}/min)`:r}function Ai(e,t){let n=Math.max(0,...e.map(r=>r.start));return e.map(r=>{let a=hn(r.start,n),o=t?`${r.comment} <!-- guid:${r.guid} -->`.trimStart():r.comment;return`${a} ${o}`}).join(`
`)}function Zs(e,t=window.location.href){try{let n=new URL(t);return n.searchParams.set("t",`${e}s`),n.toString()}catch{return`https://www.youtube.com/watch?v=${t.search(/[?&]v=/)>=0?t.split(/[?&]v=/)[1].split(/&/)[0]:t.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${e}s`}}function Dn(){let e=new Date;return e.getUTCFullYear()+"-"+String(e.getUTCMonth()+1).padStart(2,"0")+"-"+String(e.getUTCDate()).padStart(2,"0")+"--"+String(e.getUTCHours()).padStart(2,"0")+"-"+String(e.getUTCMinutes()).padStart(2,"0")+"-"+String(e.getUTCSeconds()).padStart(2,"0")}var el=`#ytls-pane {
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
`;var Pr="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kKGhISKNpo4IcAAAL9UExURQAAAP/abf7Zaf/Yaf7Ya//XaP/WZv/VZf/VY//UYf/SYv/SYPvTZf/QZ//ObP7QYPzRYP7QXfjRZv7Kdv7PW/3OX//FgPnOXv7MVv/ChP3LWPzLWv7Bhf3EeP++jfXJZPXKW/rIWPvIVffIWv+4lvvGVfPIXvHJXvrFV/vFU/61nPvFUP6zn/i5ivrCU/2yl/6vovvBTP+tp/6upPjBUPbBVPPCVfG8ee3EWOnEXvm+UPu0fvq+SO/AV/m9TPq1cvm9Svq9Req/YPm1Zva7Tvi6Tfi6S/m3V/G8T+e/Vvi5R+20ePi3Sui3bvi3RPe2S/Snn/a1R/e0R/G3ReW6Uve0QOm5Seu3Tei4T/eyRvaySOC6VvaxPuyzSuO1V+W1T922Udi0UuCvS+WtRuqrPNSwU+SbldiqZ+epP9mpSNamT86qT96kP82pSuKhOsemStifPdedN8OiTMufQtGOidaaOMKhSNmYNMyVRb2cR9OUM+yFLuuEL+iDLcWSOM+NLbaVQ8iMMrqQPON+K72Be99/KMaGNK2QQcGFOsmEI9h7JdV7IaiLP9l2KMd+HLCFNKyAVdVyJc14Gr97LqKHPLx6Ms1zJ8Z4GMJ4Hrx6Icd2Fqpyb89tI5yAOJ17SaV7MsNtJrhwKqB5NJd8Npd6O7xsHsRlHpt1MaVyJbZnJJB1MbljII11NZtwI5ZmX7BhIYZvL41rKohpLoJqLZBkIKJaHp9eEKpVGXhjLXthL5hUHHxdIo9RFnRaJnBcJnFYKXNVJ3RSG2lWI4JIF25PJWlON2ZPJmpOGmFRIWVNHGhKImNKHXNCC1hIHVxAHlRDIWg5EVc9HU5AGGM1D0w8HlA8E1I5HEc6Fkw3EFcxEEo0GkQ2G0UxGT8tGDswEUwoCzsuFj8oJj0tDDsrGDksFzgpFkMkCjQnFjMpDTAjFS0lDC0iFDEiCDcdCSoiCikgFCYeByQcEzAYBSoaBSQcByIbBykUBBwVBRcSBBoLAhQNAw8JBAsKAwcGAgAAAN3XOCgAAAABdFJOUwBA5thmAAAGaElEQVR42u2WW2wUVRjH/2dmdy7doduy7S6XQltaIaCiYlJEhYpRo1aMJEbxQgQvRI0YNPESjVGjiS/qiz5ojEEfBKOEgNJQQKRcWy6FSmtoramlpVCWUsre5rI75ziXLXTd1t2++eAvk8zszPl+5/+d3cke/E9eUG3g1KnuYTqxIoygtWx5b+3qVatf/7pZQ54YHU17mzpUW5Jq/uiJCtlnE3ri81PZKQiy6T16IAqPVH7dnLLwroZ6nUOa0keenJ+HYOjbAyd0MxCUA5U1xzb2ArhiUN553pNTQPd8+asKQA755ye3XQYg6SDpcc++Ozm3oH7teQ4UIN6SQT09Kp3C88qbUk4BTm5sPa4RQCVgsCjSNYDYBu/y1bdzuQV08LdDejIZ3X2OgALFD+CPvmEYrHDBkqU1HPIgun7da+tWVImCIHi9XqFq5RtvrXvpmZfe+j5KkYUHWcQ3f9kBDRQu7MzuRcUFPh9ie3335yMY+v6rVgCUEZaWDP4SmFkIPh7TTU1CrjUI//DZ6XQ9dR8zcIQUlCjVYnhq3TI5h2Bow2e9DIwBjIJQBhAOjCMAJ1dVqoG6B6V/FWg/fmjVAxSM2uU8YFoK20AImXK9NnX5gxxGk/mJ7tpw/oaVL668SWB2FzxM0wTPKCxY+ZPLr5nd/1MjxbjQ5tUVrzZ09bQ3vDqZ9xAPcbGueK/y3KYTPV1H1z+6toWOm6Bn855VTy8qEv3VD6+SKUy4mDwFfezxGwu9hRV314V/Do8nMA7+sHTZDAMwUHTH9YyHRXGxbWCkujZEYSEuKGvelxpbQA9sIPNnUlDrSE5eAAt+5esfvGArcGtZEoxSIFTZ1dBCxxR0bj1ZNUWABQMEkQf4NXUlqaVrLAMt8Jj2vBSeKeaeHUNjCeL128qJRmEnSJmGblr1dw/0hDtuXsGDGHa5AYsBdfjQQZotoLt2+xTS3g+XoePEXLLw4gUGrbf2cR7tEYCCAv2dMeNwwymaJWja3l5skiOHNWeiRGMb56vx9jAAl6ILp6OtMQELqh/ewUvKtl19/3yZPvz2SDBmsvB36m0loOf3fqOzaTNQCiAFzKrdaNSLd8zg6aXWLVqZADSe+eq5jJ/yAriQC+TOciV2+kcDTHykelIhgAii2w+Dk+pC05LdJ+MCHGZuGVMA2qd5oRJQgEzni+DAulSOEUiMmCFLmWFwW1hzDCMUaLptJQyQjSgceEFnBETnrCuMEBy9iPfORBp2GZwjIIDqh4MCw663x5IYuZLgtCuHzdNNdh0IjYaTsCDOkZRkCbxpSoNR+wYHgBqU4+yRBr2n9v0raxD7uH5yKpVCt2FQWDAGZp+kgH/SsIFoXHPnt/EwLy/AMLkVr8y6Imj+OOIDPK1nMQJ1DBAFwdInqVufyfRP6ri0gK7/oowwmC3DGGVwFJl/TJm8/LaS/hbCrToBYcN6xltKyVUBwRi0tlPONfecs1WImhiNtVjEqXbP2RzvgpuA1p9wliOGNDlmHiHWFoGbIKy5XRuYGOFeV8DCEGEhC5gYHYPUEZg6bLgiHhNjwG3BPnQJgFKKCSGo0bSgxCAMgFhZNKF6GYYrQJkvBhEE4jUC8kcMQUgLpsyNwaF02gQMAUMuSrdQUa1qOkCQmpe/QQ7SuaWuAMEa6kQgMG+qkJEXQkjWZldwrgA3LPndgLMMiWtr/HmFKC4fDt0VHHmd6aZPL84RbIOGAv3Pc1HkoqhK6nrqxSDSCbi7Hk5aGYiuiWLCc+3i2TlSCP5ysfeBZSVu3w7dmzf1zSuFBkAEePRcvGAaGBMZQkkonlr0WA03SoDhxq37uIpSDbaCMGjxATUO0BRggocJWwt4Aij2KHpf5ZKH5nAYLQA9Ub+tv6BCIbZBBwOFCg9sItbJElk+HzwFnH5+XmXtYplDpgCJxo5zvX9FBMVXwIEwgJqwMWCjSdAcTUycNfXOW0q47F3a/iYieiODQ7HuqMmbsmLPByLoloyAOQFi0/xKYaFfmbVYRJYgsaMFRBJEyYwkEqoaMxXE7KbBCJO0y6UQZNnr9yrQotrU+yqzt7opA4wlVAJJUAKAMDeYTCZHOoj0x2Xwmg71EhgbZ6PZ2nla19P3hMDshZNwFb2tsz+pwSklk4JVNSLG4GLb/p31Djv3tyWQgdF59VnrWXPcrS5lFBYc4ZBFisHdOfP4b/E301Ck7f/BFa8AAAAASUVORK5CYII=",tl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kKGhISFPUHnAAAAAMAUExURQAAAAAAAAcGARIMAhkNAR0OABgRAx4SAyMRASEVAyMVAigXAiEZBicYAiMbBiwZASsaAzAZACkbBC0cAi0dBjAdAjMeAykhCTIfAzQfAzAhBzUgAjghAy0kCzkiAzQkBzwkAz0kAzklBz8lA0AmBEEmAz4nBUEnBEQoBEUpAz0rCzgtD0ErCUcqA0EsB0crBEkrA0YsB0osAksuBU0uA08vBEQyD0E0E0kyDlExBVIxBFQzB1U0BUg3Ek83D0o6Flc5DFQ6DlQ8E1Y9E08/GFo/EF4+Dlw/EVVBF2U+CFtBFWg/CFxFGGVEEllHHGRGFmJHF2BKGpg7BGBOHmlMGWxNGG1NGZ1BCGhQHWZRIaJGDZ9ID3NWHnNYIXpXHW9aJJ5NE4VWGadOEntbIIBbH6RRFXlhKKhWFn9iJbBWGIJlKItjI39nKoZmJq9cGohsK5RqJqxjI7lgHYhuL41tK7ZjH5xxKpF0L7dqIJV0LsFqI5R4M7FxHbRwKpd7NJx7MqZ5LclvJcN1D5t/N8F1Jql9MKOBNK9+LsJ6G6GCOM54KreAKsl8GL9+Mr+AM7OEM8CBJ7iEMqqKPMyCH9h+Lq+KO82DLa+MO7GMO86GJMGLM8iJN7GQP9yFMeGFMMeOObeTPuWIMsOSOsiRN+SLNLqXQteRMb2YQdmTLtCWOsGaQ76bRe2ONeqRN9aYOcidRO+SONqZM8WeRdWbO9ScP/CUOcahRuGbNu+XOtuePMikSOGeNtSiQ92gOtiiRdqiQM6oSuGlPuelP9KrS9iqSemmPOepQe6oPdavTe6rQeqsROGvS+iuRvGtQfKtQNy0UOWyTfevQ/awQfOxRfexRPezQ/O0R/ezReq3UPe0RvG2SeO6Uvm1R/i2R++5TPi4SOe9VO28Uvm6TPO+Ufq9TezBV/q+T+/BVvHBVfrAUPDFWPvDUvzEU/fGV/PHWvXHWfzGVvXKW/3IWPrLWfrLXPjMXP3LWf7NWvzOXf/PXP/PXv3QXv7QXP7RXf/RXf/SYIi9XXwAAAABdFJOUwBA5thmAAAHkUlEQVR42sXWa3BU5R3H8e//eZ6zt+wlIQRqsBIC4w2QqKhAA52K1tYqqKjIiDpUHd60HaszHX3hdCo6tbXSVvFSBtsyjFqsoJVRvLWK4WLjpWhBAcWgYGgIm012N7vZ3XPpZmOCyW6ovupnzvNiz5z/7/znOf/ds/zfyXFOeowk5SelYrkeF+g74oA34kIRtyy6jEj99b9ct37d729ZOFZk8JyEv33Dbb9as+aBFbctmioio3cgfGfhOTUUZXr3bH31MB4I82bOmjIu7NeQtxMHWt7ahDdqwGm3zBatMNguibe2/S0P8y648LSwYkhm39PPfoBXMUD40XURpUMhH3Yu7WS7tr+x9+LFZ0QZLvnyui+aMIxgNdbahMZaQDDc6wvnZcn8ekaKXlpnbazcgbprQVDXxCjxcuntdadHhXK5N+5s9SruwcIl04OhGmvwus5qn49KkvevwKsUwNxZcyfXhz3D//DKjYc8UIzg0XLfxpYXt73Xdqgr7XIcwShFinJzJnTs2/LCxhe2HnYYlOvKeQz32cGKT0E4b3nz0XgPsWjduGM1hV00jrf4kvYtqUoBwvxl33MlBj5/OHCsIvTN1j2nnlLtH5qlznVPUOEpCNcvm57tczDBUvkx2QOff8KUSbEqjE12b+uODQWPkQGCumXppEQe7YuGLIbJd2eOtHXmIpGqMOm25173KoyycOKy66qTNiYcsQwjpLod92gy3pkD7JYX8BgZIJy+/CqVtrUOR32U8ZIJF+jJUbR11WdlAcX6n17iZj10JOKjgkImWYBMBhNy0xse7BtIkGH1dg5UTVSoyOs7tHdXR5rw+Gnjcusfdb3hgzRu+SV2QWGNWk+qdfXKlY+uXbtqxX1P9iy4FvlygFjLF/bf34qGhMo616547PPmm2699Yez339wzac/uBI5NkjCvMaPsoQj442mMndva/D65qZYFb2fbt3xamLRhfHXhvZAaI5lMviC0bqJjVMmRP1UkPyECTWGonz8o+2vsjh+f9xDvpjfn0QOHT2cTXa0dwVObpg+qzHK8WS7Ejufjl3294fxFP1OvPzUk5ovunrxtTfe+uPv8tLKX6zc2n38b3J4zpUdR+cvGNhEUUvP07ndzzyy6pHn/hW9+o475vesv/t3H7uMLhyh6Romnn+CKBBuvqKm46nf3veXzdv+8czqNYcW3PnzxXVv/uEgo5NIMDTn7NDMy9EI1yyt73jqz/vdgPGJLrS3cfYp585qijVEGJ02GTTBQIcgly5rSm9YnTBaa6u4jJy05KoQ2Ibj8eJJGzu9Wcm5S8/OH2iJC57SopSI6Xj+30DlejvZncy4gJRedNHzlXXFzGz+nR0K19BfrtGqbXM3FSV3Pr7ynhWrXmq3IRDWWlGnllzkudlP8qItRBRaDMIHB6jk44fueXD9sxseuffX2zIQtChSi8bkVbZHA0qDFrQS2vfYlHF3PrDxY1sE9j/5m2cz+MKiQJ2ZBTel0BqlBHyA5NvylDn4xx0oAYXQsm6bTdDv9te4aJD+BWhxUUCqvIPM5nfppwW0r+XxA/gCFqg+lNSMpxSslItWfEmudyip8+28IPgosV7ZksMn2MoB9Y1atBlsBAR8hqLet59c3TL4QPYNTKaLiFLQ1RrHqCJwdfjkEB4lPgQs6wQN9n/++tCmrY/9qWOgl4/SFpS2jSLP+vAgwsAnE5o7B0pDhFs6W9vkx9798CY1Y0b0n4+XEpwjMvxneP9BlKa4lKWl8VsxpQWUKIUYpjVi71y7u6F56tRZE97Z1EvZO8iQ6rW1AoNGE1185Glb9WeIgN1wca27+4lPG2bEIDaDHZPnGjz/8ATXb5mCAiWIgYlLL6tVRotPizDpqrPUkQ0D9RCb5t+0H8wYxBIYeqNFajAaDCgFNP3s1C17+3wCVdMXnRPqfXFfw1k1lIyZ+u7zdWP8U2sSlLilg9NOAAfMYGP1181678N2zz/ujNkTDB9uH3PWWAboE+PvnjnXTDnlTfAGW/C8qRNBg2JQVdO1t9979123XznRkNuVnBRkUGBy9LU4Y+fViBFXycDQTZsfG+jAKuAywFRXD960zuzpDAdr8QehirGTdr59kWne9XIO7fQfYC6cqXBdlDF5ypnZ+dZEuw064A8GIN132DE1N/B6wiOQsRy37vKb68Bxwdi4BcqEzmzIdSe6u0g7pHO4tVGg/qYpr+8/6lKITrvg+/WA64C0ORKuE0ZwjhTvBXm84lK2E5g8hqJc/L2dPU7VyefWhyhKddrIfk/839CMlO3opUQUSkt46K9rxsb4DP28zpSDySvtFsoDAhE37zD4oKzIYD0hhhQKDpjicgqBCm8OUnlc5SrQvuoAFWRz4Mr7+E2FTQAvney/A6JCUWMol+/sc3ANFCjkAlTowZ/LFdC6SltUbqBY7xQ7wG9iMUMlno0RKuvrzAIFo1wKZKoqB4jFaPKJPOCiguC6haTD15PvzjhQcETfmQbE1X7ha+jrSTngQpWqCpVmMpH0+Mq8VLzbwXUhUGMCkT4HBxJ21OIrse10Mo8LikAsZCSaS1LkpJxogK/A6Un1gSPGpao6LP8Fy8nbmCTqYikAAAAASUVORK5CYII=";var et=null,Jn=null,Kd=250,Ht=null,Qn=!1,tt=null,Co=[];function Yd(){return(!et||!document.body.contains(et))&&(et=document.createElement("div"),et.className="ytls-tooltip",et.style.pointerEvents="none",document.body.appendChild(et),window.addEventListener("scroll",nl,!0),window.addEventListener("resize",nl,!0)),et}function Xd(e,t,n){let a=window.innerWidth,o=window.innerHeight,c=e.getBoundingClientRect(),s=c.width,g=c.height,m=t+10,h=n+10;m+s>a-10&&(m=t-s-10),h+g>o-10&&(h=n-g-10),m=Math.max(10,Math.min(m,a-s-10)),h=Math.max(10,Math.min(h,o-g-10)),e.style.left=`${m}px`,e.style.top=`${h}px`}function ol(e,t){let r=window.innerWidth,a=window.innerHeight,o=t.getBoundingClientRect(),c=e.getBoundingClientRect(),s=c.width,g=c.height,m=Math.round(o.left+o.width/2-s/2),h=Math.round(o.top-g-8);h<8&&(h=Math.round(o.bottom+8)),m<8&&(m=Math.round(o.left)),m+s>r-8&&(m=Math.round(o.right-s)),m=Math.max(8,Math.min(m,r-s-8)),h=Math.max(8,Math.min(h,a-g-8)),e.style.left=`${m}px`,e.style.top=`${h}px`}function nl(){if(!(!et||!Ht)&&et.classList.contains("ytls-tooltip-visible"))try{ol(et,Ht)}catch{}}function Jd(e=50){tt&&(clearTimeout(tt),tt=null),!Qn&&(tt=setTimeout(()=>{Bo(),tt=null},e))}function Qd(e,t,n,r){tt&&(clearTimeout(tt),tt=null),Ht&&r&&Ht!==r&&et?.classList.contains("ytls-tooltip-visible")&&et.classList.remove("ytls-tooltip-visible"),Jn&&clearTimeout(Jn),r&&(Ht=r,Qn=!0),Jn=setTimeout(()=>{let a=Yd();a.textContent=e,a.classList.remove("ytls-tooltip-visible"),r?requestAnimationFrame(()=>{ol(a,r),requestAnimationFrame(()=>{a.classList.add("ytls-tooltip-visible")})}):(Xd(a,t,n),requestAnimationFrame(()=>{a.classList.add("ytls-tooltip-visible")}))},Kd)}function Bo(){Jn&&(clearTimeout(Jn),Jn=null),tt&&(clearTimeout(tt),tt=null),et&&et.classList.remove("ytls-tooltip-visible"),Ht=null,Qn=!1}function Ei(){Bo()}function Ge(e,t){let n=0,r=0,a=m=>{n=m.clientX,r=m.clientY,tt&&(clearTimeout(tt),tt=null),Qn=!0,Ht=e;let h=typeof t=="function"?t():t;h&&Qd(h,n,r,e)},o=m=>{n=m.clientX,r=m.clientY},c=()=>{Ht===e&&(Qn=!1,Jd())};e.addEventListener("mouseenter",a),e.addEventListener("mousemove",o),e.addEventListener("mouseleave",c);let s=m=>{Qn=!1,Ht===e&&Bo()};e.addEventListener("click",s,!0);let g=new MutationObserver(()=>{if(Ht===e)try{let m=window.getComputedStyle(e);(m.display==="none"||m.visibility==="hidden"||m.opacity==="0")&&Bo()}catch{}});try{g.observe(e,{attributes:!0,attributeFilter:["class","style"]})}catch{}Co.push(g),e.__tooltipCleanup=()=>{e.removeEventListener("mouseenter",a),e.removeEventListener("mousemove",o),e.removeEventListener("mouseleave",c),e.removeEventListener("click",s,!0);try{g.disconnect()}catch{}let m=Co.indexOf(g);m!==-1&&Co.splice(m,1),delete e.__tooltipObserver},e.__tooltipObserver=g}function rl(){for(let e of Co)try{e.disconnect()}catch{}Co.length=0,Bo()}var zr={};rd(zr,{addTimestamp:()=>rp,buildExportCsvPayload:()=>mp,buildExportPayload:()=>dp,deleteSingleTimestampFromIndexedDB:()=>cp,exportAllTimestamps:()=>pp,exportAllTimestampsCsv:()=>fp,getRecordsChangedSince:()=>Di,loadFromIndexedDB:()=>lp,loadGlobalSettings:()=>Yt,mergeBackupData:()=>hp,mergeRemoteRecords:()=>Pi,onTimestampsWritten:()=>Oi,removeFromIndexedDB:()=>up,saveGlobalSettings:()=>yn,saveRowsToIndexedDB:()=>ip,saveSingleTimestampToIndexedDB:()=>sp,saveToIndexedDB:()=>ap});var Zd="ytls-timestamps-db",ep=5,Zn="timestamps",pt="timestamps_v2",vn="settings",gn=null,eo=null;function Or(){if(gn)try{return gn.objectStoreNames,Promise.resolve(gn)}catch(e){l("IndexedDB connection is no longer usable:",e,"warn"),gn=null}return eo||(eo=tp().then(e=>(gn=e,eo=null,e.onclose=()=>{l("IndexedDB connection closed unexpectedly","warn"),gn=null},e.onversionchange=()=>{l("IndexedDB upgrade requested by another tab; closing this connection",null,"warn"),e.close(),gn===e&&(gn=null)},e.onerror=t=>{l("IndexedDB connection error:",t,"error")},e)).catch(e=>{throw eo=null,e}),eo)}function il(e,t){let n=crypto.randomUUID(),r=0,a=e.openCursor();a.onsuccess=o=>{let c=o.target.result;c?(r++,c.update({...c.value,write_counter:r,device_id:n}),c.continue()):(t.put({key:"write_counter",value:r}),t.put({key:"device_id",value:n}),l(`Lamport migration: backfilled ${r} records, device_id=${n}`))},a.onerror=()=>{l("Lamport migration: cursor error during backfill",a.error,"error")}}function tp(){return new Promise((e,t)=>{let n=indexedDB.open(Zd,ep);n.onupgradeneeded=r=>{let a=r.target.result,o=r.oldVersion,c=r.target.transaction;if(o<1&&a.createObjectStore(Zn,{keyPath:"video_id"}),o<2&&!a.objectStoreNames.contains(vn)&&a.createObjectStore(vn,{keyPath:"key"}),o<3){if(a.objectStoreNames.contains(Zn)){l("Exporting backup before v2 migration...");let h=c.objectStore(Zn).getAll();h.onsuccess=()=>{let f=Cr.array().safeParse(h.result);if(f.success&&f.data.length>0)try{let y={},E=0;f.data.forEach(V=>{if(V.timestamps.length>0){let ee=Lo.parse(V.timestamps);y[`ytls-${V.video_id}`]={video_id:V.video_id,timestamps:[...ee].sort((N,$)=>N.start-$.start)},E+=ee.length}});let M=new Blob([JSON.stringify(y,null,2)],{type:"application/json"}),z=URL.createObjectURL(M),q=document.createElement("a");q.href=z,q.download=`timekeeper-data-${Dn()}.json`,q.click(),URL.revokeObjectURL(z),l(`Pre-migration backup exported: ${f.data.length} videos, ${E} timestamps`)}catch(y){l("Failed to export pre-migration backup:",y,"error")}else f.success||l("Skipping pre-migration backup: legacy data failed validation",f.error.message,"warn")}}let g=a.createObjectStore(pt,{keyPath:"guid"});if(g.createIndex("video_id","video_id",{unique:!1}),g.createIndex("video_start",["video_id","start"],{unique:!1}),a.objectStoreNames.contains(Zn)){let h=c.objectStore(Zn).getAll();h.onsuccess=()=>{let f=Cr.array().safeParse(h.result);if(f.success&&f.data.length>0){let y=0;f.data.forEach(E=>{E.timestamps.length>0&&E.timestamps.forEach(M=>{g.put({guid:M.guid,video_id:E.video_id,start:M.start,comment:M.comment}),y++})}),l(`Migrated ${y} timestamps from ${f.data.length} videos to v2 store`)}else f.success||l("Skipping v1 \u2192 v2 migration: legacy data failed validation",f.error.message,"warn");o<4&&il(c.objectStore(pt),c.objectStore(vn))},a.deleteObjectStore(Zn),l("Deleted old timestamps store after migration to v2")}}o===3&&il(c.objectStore(pt),c.objectStore(vn));let s=c.objectStore(pt);s.indexNames.contains("write_counter")||s.createIndex("write_counter","write_counter",{unique:!1})},n.onsuccess=r=>{e(r.target.result)},n.onerror=r=>{let a=r.target.error;t(a??new Error("Failed to open IndexedDB"))},n.onblocked=()=>{l("IndexedDB open is blocked by another tab holding an older connection; waiting",null,"warn")}})}function Hr(e,t,n){return Or().then(r=>new Promise((a,o)=>{let c;try{c=r.transaction(e,t)}catch(m){o(new Error(`Failed to create transaction for ${e}: ${m}`));return}let s=c.objectStore(e),g;try{g=n(s)}catch(m){o(new Error(`Failed to execute operation on ${e}: ${m}`));return}g&&(g.onsuccess=()=>a(g.result),g.onerror=()=>o(g.error??new Error(`IndexedDB ${t} operation failed`))),c.oncomplete=()=>{g||a(void 0)},c.onerror=()=>o(c.error??new Error("IndexedDB transaction failed")),c.onabort=()=>o(c.error??new Error("IndexedDB transaction aborted"))}))}var Mi=new Set;function al(e){return Mi.add(e),()=>Mi.delete(e)}function np(){for(let e of Mi)try{e()}catch(t){l("Timestamp write listener failed:",t,"error")}}function Ro(e,{silent:t=!1}={}){return Or().then(n=>new Promise((r,a)=>{let o;try{o=n.transaction([pt,vn],"readwrite")}catch(c){a(new Error(`Failed to create transaction: ${c}`));return}o.oncomplete=()=>{r(),t||np()},o.onerror=()=>a(new Error(`IndexedDB write failed: ${o.error?.message??"unknown"}`)),o.onabort=()=>a(new Error(`IndexedDB transaction aborted: ${o.error?.message??"unknown"}`));try{e(o.objectStore(pt),o.objectStore(vn))}catch(c){try{o.abort()}catch{}a(c instanceof Error?c:new Error(String(c)))}}))}function Do(e,t){let n=e.get("write_counter");n.onsuccess=()=>{let r=typeof n.result?.value=="number"?n.result.value:0;e.put({key:"write_counter",value:t(r)})}}function sl(e,t){let n=Lo.safeParse(t);if(!n.success)return Promise.reject(new Error(`Invalid timestamp payload for ${e}`));let r=n.data;return Ro((a,o)=>{let c=a.index("video_id").getAll(IDBKeyRange.only(e));c.onsuccess=()=>{let s=c.result??[],g=new Map(s.map(f=>[f.guid,f])),m=new Set(r.map(f=>f.guid)),h=Date.now();Do(o,f=>{let y=f;return s.forEach(E=>{!m.has(E.guid)&&!E.deleted_at&&(y++,a.put({...E,deleted_at:h,write_counter:y}))}),r.forEach(E=>{let M=g.get(E.guid);M&&!M.deleted_at&&!E.deleted_at&&M.start===E.start&&M.comment===E.comment||(y++,a.put({guid:E.guid,video_id:e,start:E.start,comment:E.comment,write_counter:y,deleted_at:E.deleted_at??M?.deleted_at??void 0}))}),y})}})}function Ii(e,t){let n=Lo.safeParse(t);if(!n.success)return Promise.reject(new Error(`Invalid timestamp payload for ${e}`));let r=n.data;return r.length===0?Promise.resolve():Ro((a,o)=>{Do(o,c=>{let s=c;return r.forEach(g=>{s++,a.put({guid:g.guid,video_id:e,start:g.start,comment:g.comment,write_counter:s,deleted_at:g.deleted_at})}),s})})}function ll(e,t){return Ii(e,[t])}function Li(e,t={}){return e.length===0?Promise.resolve():Ro((n,r)=>{Do(r,a=>{let o=a;return e.forEach(c=>{c.write_counter!==void 0&&c.write_counter>o&&(o=c.write_counter)}),e.forEach(c=>{let s={guid:c.guid,video_id:c.video_id,start:c.start,comment:c.comment,deleted_at:c.deleted_at,write_counter:c.write_counter??++o};n.put(s)}),o+1})},t)}function cl(e){return l(`Soft-deleting timestamp ${e}`),Ro((t,n)=>{let r=t.get(e);r.onsuccess=()=>{let a=r.result;a&&Do(n,o=>(t.put({...a,deleted_at:Date.now(),write_counter:o+1}),o+1))}})}function ul(e){return Or().then(t=>new Promise((n,r)=>{let a;try{a=t.transaction([pt],"readonly")}catch(c){let s=`Failed to create read transaction: ${c}`;l(s,c,"error"),r(new Error(s));return}a.onabort=()=>{let c=`Transaction aborted during load: ${a.error?.message??"unknown"}`;l(c,a.error,"error"),r(new Error(c))};let o=a.objectStore(pt).index("video_id").getAll(IDBKeyRange.only(e));o.onsuccess=()=>{try{let c=o.result.filter(m=>!m.deleted_at),s=[],g=0;for(let m of c){let h=Lr.safeParse({guid:m.guid,start:m.start,comment:m.comment});h.success?s.push(h.data):g++}if(g>0&&l(`Skipped ${g} stored timestamps for ${e} that failed validation`,null,"warn"),s.length===0){g>0?r(new Error(`Stored timestamps for this video failed validation (${g} rows)`)):n(null);return}n(s.sort((m,h)=>m.start-h.start))}catch(c){r(c)}},o.onerror=()=>{let c=`Failed to load timestamps from IndexedDB: ${o.error?.message??"unknown error"}`;l(c,o.error,"error"),r(new Error(c))}}))}function dl(e){return Ro((t,n)=>{let r=t.index("video_id").getAll(IDBKeyRange.only(e));r.onsuccess=()=>{let a=r.result??[],o=Date.now();Do(n,c=>{let s=c;return a.forEach(g=>{g.deleted_at||(s++,t.put({...g,deleted_at:o,write_counter:s}))}),s})}})}function Nr(){return Hr(pt,"readonly",e=>e.getAll()).then(e=>Array.isArray(e)?e:[])}function pl(e){return Hr(pt,"readonly",t=>t.index("write_counter").getAll(IDBKeyRange.lowerBound(e,!0))).then(t=>Array.isArray(t)?t:[])}function ml(e){return e.length===0?Promise.resolve([]):Or().then(t=>new Promise((n,r)=>{let a=[],o=t.transaction(pt,"readonly"),c=o.objectStore(pt);for(let s of e)c.get(s).onsuccess=g=>{let m=g.target.result;m&&a.push(m)};o.oncomplete=()=>n(a),o.onerror=()=>r(o.error??new Error("IndexedDB read failed")),o.onabort=()=>r(o.error??new Error("IndexedDB read aborted"))}))}function fl(e,t){return Hr(vn,"readwrite",n=>{n.put({key:e,value:t})}).then(()=>{}).catch(n=>{l(`Failed to save setting '${e}' to IndexedDB:`,n,"error")})}function hl(e){return Hr(vn,"readonly",t=>t.get(e)).then(t=>t?.value).catch(t=>{l(`Failed to load setting '${e}' from IndexedDB:`,t,"error")})}async function Ci({includeDeleted:e=!1}={}){let t={},n=await Nr(),r=[],a=0;for(let f of n){let y=fn.safeParse(f);y.success?r.push(y.data):a++}a>0&&l(`Skipped ${a} timestamp rows that failed validation during export`,null,"warn");let c=[...e?r:r.filter(f=>!f.deleted_at)].sort((f,y)=>{let E=f.video_id.localeCompare(y.video_id);if(E!==0)return E;let M=f.start-y.start;return M!==0?M:f.guid.localeCompare(y.guid)}),s=new Map;for(let f of c)s.has(f.video_id)||s.set(f.video_id,[]),s.get(f.video_id).push({guid:f.guid,start:f.start,comment:f.comment,write_counter:f.write_counter,deleted_at:f.deleted_at});let g=Array.from(s.keys()).sort((f,y)=>f.localeCompare(y));for(let f of g){let y=s.get(f);t[`ytls-${f}`]={video_id:f,timestamps:y}}return{json:JSON.stringify(t,null,2),filename:"timekeeper-data.json",totalVideos:s.size,totalTimestamps:c.length,invalidRows:a}}async function yl(){try{let{json:e,filename:t,totalVideos:n,totalTimestamps:r}=await Ci(),a=new Blob([e],{type:"application/json"}),o=URL.createObjectURL(a),c=document.createElement("a");c.href=o,c.download=t,c.click(),URL.revokeObjectURL(o),l(`Exported ${n} videos with ${r} timestamps`)}catch(e){throw l("Failed to export data:",e,"error"),e}}async function Bi(){let e=fn.array().safeParse((await Nr()).filter(m=>!m.deleted_at));if(!e.success||e.data.length===0){e.success||l("Failed to parse timestamp rows for CSV export:",e.error.message,"warn");let m=`Tag,Timestamp,URL
`,h=`timestamps-${Dn()}.csv`;return{csv:m,filename:h,totalVideos:0,totalTimestamps:0}}let t=e.data,n=new Map;for(let m of t)n.has(m.video_id)||n.set(m.video_id,[]),n.get(m.video_id).push({start:m.start,comment:m.comment});let r=[];r.push("Tag,Timestamp,URL");let a=0,o=m=>`"${String(m).replace(/"/g,'""')}"`,c=Array.from(n.keys()).sort();for(let m of c){let h=n.get(m).sort((f,y)=>f.start-y.start);for(let f of h){let y=f.comment,E=hn(f.start,36e3),M=Zs(f.start,`https://www.youtube.com/watch?v=${m}`);r.push([o(y),o(E),o(M)].join(",")),a++}}let s=r.join(`
`),g=`timestamps-${Dn()}.csv`;return{csv:s,filename:g,totalVideos:n.size,totalTimestamps:a}}async function wl(){try{let{csv:e,filename:t,totalVideos:n,totalTimestamps:r}=await Bi(),a=new Blob([e],{type:"text/csv;charset=utf-8;"}),o=URL.createObjectURL(a),c=document.createElement("a");c.href=o,c.download=t,c.click(),URL.revokeObjectURL(o),l(`Exported ${n} videos with ${r} timestamps (CSV)`)}catch(e){throw l("Failed to export CSV data:",e,"error"),e}}async function Ri(e,t){if(!e)throw new Error("Video ID is required");if(!t.guid||t.start==null)throw new Error("Timestamp must have GUID and start time");return ll(e,t)}async function bl(e,t){if(!e)throw new Error("Video ID is required");return Ii(e,t)}async function Sl(e,t){if(!e)throw new Error("Video ID is required");if(!Array.isArray(t))throw new Error("Timestamps must be an array");return sl(e,t)}async function xl(e){if(!e)throw new Error("GUID is required");return cl(e)}async function Tl(e){if(!e)throw new Error("Video ID is required");return dl(e)}async function kl(e){if(!e)throw new Error("Video ID is required");return ul(e)}async function Al(e){let t;try{t=JSON.parse(e)}catch{return l("mergeBackupData: failed to parse JSON",null,"warn"),{mergedVideos:0,mergedTimestamps:0}}let n=gs.safeParse(t);if(!n.success)return l("mergeBackupData: data failed validation",n.error.message,"warn"),{mergedVideos:0,mergedTimestamps:0};let r=await Nr(),a=new Map;for(let g of r)a.set(g.guid,g);let o=0,c=0,s=[];for(let[,g]of Object.entries(n.data)){let{video_id:m,timestamps:h}=g,f=0;for(let y of h){let E=a.get(y.guid);El(E,m,y)&&(s.push({guid:y.guid,video_id:m,start:y.start,comment:y.comment,write_counter:y.write_counter,deleted_at:y.deleted_at}),a.set(y.guid,{...E??{},guid:y.guid,video_id:m,start:y.start,comment:y.comment,write_counter:y.write_counter,deleted_at:y.deleted_at}),f++,c++)}f>0&&o++}return await Li(s),{mergedVideos:o,mergedTimestamps:c}}function vl(e,t){return JSON.stringify([e,t.start,t.comment,t.deleted_at??null])}function El(e,t,n){return e?e.write_counter===void 0||n.write_counter===void 0?!1:n.write_counter!==e.write_counter?n.write_counter>e.write_counter:vl(t,n)>vl(e.video_id,e):!0}async function Ml(e){let t=[];for(let n of await pl(e)){let r=fn.safeParse(n);if(!r.success||r.data.write_counter===void 0)continue;let{guid:a,video_id:o,start:c,comment:s,write_counter:g,deleted_at:m}=r.data;t.push({guid:a,video_id:o,start:c,comment:s,write_counter:g,...m!==void 0?{deleted_at:m}:{}})}return t}async function Il(e){let t=new Map;for(let a of await ml(e.map(o=>o.guid)))t.set(a.guid,a);let n=[],r=new Set;for(let a of e)El(t.get(a.guid),a.video_id,a)&&(n.push(a),r.add(a.video_id));return await Li(n,{silent:!0}),{mergedVideos:r.size,mergedTimestamps:n.length}}function Ll(e,t){if(!e)throw new Error("Setting key is required");return fl(e,t)}async function Cl(e){if(!e)throw new Error("Setting key is required");return hl(e)}function rp(e,t){return Ri(e,t)}function ip(e,t){return bl(e,t)}function ap(e,t){return Sl(e,t)}function sp(e,t){return Ri(e,t)}function lp(e){return kl(e)}function cp(e,t){return xl(t)}function up(e){return Tl(e)}function yn(e,t){return Ll(e,t)}function Yt(e){return Cl(e)}function dp(e){return Ci(e)}function pp(){return yl()}function mp(){return Bi()}function fp(){return wl()}function hp(e){return Al(e)}function Di(e){return Ml(e)}function Pi(e){return Il(e)}function Oi(e){return al(e)}function _r(e){return e?Array.from(e.querySelectorAll("li:not(.ytls-placeholder):not(.ytls-error-message)")):[]}function Gr(e){if(!e)return;e.replaceChildren();let t=e.querySelector(".ytls-error-message");t&&t.remove()}function Hi(e,t){if(!e)return;Gr(e);let n=document.createElement("li");n.className="ytls-placeholder",n.textContent=t,e.appendChild(n),e.style.overflowY="hidden"}function Bl(e){if(!e)return;let t=e.querySelector(".ytls-placeholder");t&&t.remove(),e.style.overflowY=""}function Po(e){return e?e.querySelector(".ytls-error-message")!==null:!1}function Rl(e,t){if(!e)return;Gr(e);let n=document.createElement("li");n.className="ytls-error-message",n.style.cssText=`
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
  `,n.innerHTML=`<div style="margin-bottom:8px">\u26A0\uFE0F ${gp(t)}</div><div style="font-size:12px;font-weight:normal;color:#aaa">Check the console for details or refresh the page.</div>`,e.appendChild(n),e.style.overflowY="hidden"}function Dl(e){if(!e)return;let t=e.querySelector(".ytls-error-message");t&&t.remove()}function gp(e){let t=document.createElement("div");return t.textContent=e,t.innerHTML}function Pl(e,t){if(!e||t||Po(e))return;Array.from(e.children).some(r=>!r.classList.contains("ytls-placeholder")&&!r.classList.contains("ytls-error-message"))||Hi(e,"No timestamps for this video")}function Ol(e){if(!e)return[];let t=_r(e),n=[];return t.forEach(r=>{let a=r.querySelector("[data-time]"),o=r.querySelector("input"),c=r.dataset.guid;if(!a||!o||!c)return;let s=a.dataset.time;if(!s)return;let g=Number.parseInt(s,10);Number.isFinite(g)&&n.push({guid:c,start:g,comment:o.value})}),n.sort((r,a)=>r.start-a.start)}function Hl(e){if(!e)return 0;let t=_r(e),n=0;return t.forEach(r=>{let o=r.querySelector("[data-time]")?.dataset.time;if(o){let c=Number.parseInt(o,10);Number.isFinite(c)&&(n=Math.max(n,c))}}),n}var yp={auth:{googleAuthState:{isSignedIn:!1,accessToken:null,userName:null,email:null},syncAuthState:Yn,autoBackupEnabled:!0,autoBackupIntervalMinutes:30,autoBackupRetryAttempts:0,autoBackupBackoffMs:null,lastAutoBackupAt:null,isAutoBackupRunning:!1},ui:{panePosition:null,currentVideoId:"",minPaneHeight:250,lastHandledUrl:null,urlChangeHandlersSetup:!1},timestamps:{items:[],currentIndex:null,dbError:null}},it=JSON.parse(JSON.stringify(yp));function $e(){return it}function Fr(e){it={...it,...e,auth:{...it.auth,...e.auth||{}},ui:{...it.ui,...e.ui||{}},timestamps:{...it.timestamps,...e.timestamps||{}}}}function wn(e,t){Fr({auth:{...it.auth,[e]:t}})}function Ur(e,t){Fr({ui:{...it.ui,[e]:t}})}function Nt(){return it.auth.googleAuthState}function It(e){wn("googleAuthState",e)}function Nl(){return it.auth.syncAuthState}function to(e){wn("syncAuthState",e)}function Ni(e){wn("autoBackupEnabled",e)}function zi(e){wn("autoBackupIntervalMinutes",e)}function _i(e){wn("isAutoBackupRunning",e)}function Vr(e){wn("autoBackupRetryAttempts",e)}function no(e){wn("autoBackupBackoffMs",e)}function Gi(e){wn("lastAutoBackupAt",e)}function zl(e){Ur("minPaneHeight",e)}function _l(e){Ur("panePosition",e)}function Gl(e){Ur("lastHandledUrl",e)}function Fl(e){Ur("urlChangeHandlersSetup",e)}function Ul(e){Fr({timestamps:{...it.timestamps,items:e}})}function Fi(e){Fr({timestamps:{...it.timestamps,dbError:e}})}function Vl(){return it.timestamps.dbError}var Pn=typeof unsafeWindow<"u"?unsafeWindow:window,Yl=43200*14,ql="html5_max_live_dvr_window_plus_margin_secs";function Xt(e){return e!=null&&typeof e=="object"}function jl(e){let{streamingData:t,videoDetails:n,playerConfig:r,microformat:a}=e;if(!Xt(n)||!n.isLive)return;let o=n.isLiveDvrEnabled===!0;if(n.isLiveDvrEnabled=!0,!o&&Xt(r)){let c=r.mediaCommonConfig;if(Xt(c)){c.useServerDrivenAbr=!1;let s=c.serverPlaybackStartConfig;Xt(s)&&(s.enable=!1)}}if(Xt(t)){let c=t;if(Array.isArray(c.adaptiveFormats)&&wp(a))for(let s of c.adaptiveFormats)s.maxDvrDurationSec=Yl}}function wp(e){if(!Xt(e))return!1;let t=e.playerMicroformatRenderer;if(!Xt(t))return!1;let n=t.liveBroadcastDetails;if(!Xt(n))return!1;let r=n.startTimestamp;return!r||typeof r!="string"?!1:(Date.now()-new Date(r).getTime())/1e3>43200}function Vi(e){if(!e||typeof e!="object")return!1;let t=e;return t.videoDetails?(jl(t),!0):t.playerResponse&&Xt(t.playerResponse)&&t.playerResponse.videoDetails?(jl(t.playerResponse),!0):!1}function bp(){let e=Object.getOwnPropertyDescriptor(Pn,"ytInitialPlayerResponse"),t=e&&e.set,n=Pn.ytInitialPlayerResponse;if(!Vi(n))try{Object.defineProperty(Pn,"ytInitialPlayerResponse",{configurable:!0,get(){return n},set(r){t&&t.call(this,r),n=r,Vi(r)&&Object.defineProperty(Pn,"ytInitialPlayerResponse",{configurable:!0,writable:!0,value:r})}})}catch{}}var $l=!1;function Sp(){if($l)return;$l=!0;let e=JSON.parse;JSON.parse=function(t,n){let r=e.call(this,t,n);try{Vi(r)}catch{}return r}}function Wl(e){if(e.__dvrCapLifted)return;let n=(typeof e.d=="function"?e.d():void 0)?.WEB_PLAYER_CONTEXT_CONFIGS;if(!n)return;let r=n;for(let a in r){let o=r[a];if(o&&typeof o.serializedExperimentFlags=="string"){let c=o.serializedExperimentFlags,s=c.replace(new RegExp(`${ql}=[\\d.]+`),`${ql}=${Yl}`);s!==c&&(o.serializedExperimentFlags=s)}}e.__dvrCapLifted=!0}function Kl(e){if(!e||e.__dvrHooked)return e;e.__dvrHooked=!0;let t=e.set;typeof t=="function"&&(e.set=function(...n){let r=t.apply(this,n);try{Wl(e)}catch{}return r});try{Wl(e)}catch{}return e}function xp(){let e={};Pn.ytcfg&&(e=Kl(Pn.ytcfg));try{Object.defineProperty(Pn,"ytcfg",{configurable:!0,get(){return e},set(t){e=Kl(t)}})}catch{}}function Xl(){bp(),Sp(),xp(),l("[Timekeeper] DVR/Rewind enablement initialized for live streams")}var qi="#author-name, #author-text";function Jl(){return window.top!==window.self&&window.location.pathname.startsWith("/live_chat")}function ji(e){let t=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);for(let n=t.nextNode();n;n=t.nextNode()){let r=n.nodeValue??"";if(r.trim()){/^\s*@/.test(r)&&(n.nodeValue=r.replace(/^(\s*)@/,"$1"));return}}}function $i(e){if(e.nodeType===Node.TEXT_NODE){let t=e.parentElement?.closest(qi);t&&ji(t);return}e instanceof Element&&(e.matches(qi)&&ji(e),e.querySelectorAll(qi).forEach(ji))}function Ql(){let e=new MutationObserver(t=>{for(let n of t)n.type==="characterData"?$i(n.target):n.addedNodes.forEach($i)});document.documentElement&&$i(document.documentElement),e.observe(document,{childList:!0,subtree:!0,characterData:!0})}var ge=Uint8Array,at=Uint16Array,oa=Int32Array,qr=new ge([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),jr=new ge([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Ji=new ge([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),ic=function(e,t){for(var n=new at(31),r=0;r<31;++r)n[r]=t+=1<<e[r-1];for(var a=new oa(n[30]),r=1;r<30;++r)for(var o=n[r];o<n[r+1];++o)a[o]=o-n[r]<<5|r;return{b:n,r:a}},ac=ic(qr,2),sc=ac.b,Qi=ac.r;sc[28]=258,Qi[258]=28;var lc=ic(jr,0),Tp=lc.b,Zl=lc.r,Zi=new at(32768);for(X=0;X<32768;++X)Jt=(X&43690)>>1|(X&21845)<<1,Jt=(Jt&52428)>>2|(Jt&13107)<<2,Jt=(Jt&61680)>>4|(Jt&3855)<<4,Zi[X]=((Jt&65280)>>8|(Jt&255)<<8)>>1;var Jt,X,_t=(function(e,t,n){for(var r=e.length,a=0,o=new at(t);a<r;++a)e[a]&&++o[e[a]-1];var c=new at(t);for(a=1;a<t;++a)c[a]=c[a-1]+o[a-1]<<1;var s;if(n){s=new at(1<<t);var g=15-t;for(a=0;a<r;++a)if(e[a])for(var m=a<<4|e[a],h=t-e[a],f=c[e[a]-1]++<<h,y=f|(1<<h)-1;f<=y;++f)s[Zi[f]>>g]=m}else for(s=new at(r),a=0;a<r;++a)e[a]&&(s[a]=Zi[c[e[a]-1]++]>>15-e[a]);return s}),bn=new ge(288);for(X=0;X<144;++X)bn[X]=8;var X;for(X=144;X<256;++X)bn[X]=9;var X;for(X=256;X<280;++X)bn[X]=7;var X;for(X=280;X<288;++X)bn[X]=8;var X,No=new ge(32);for(X=0;X<32;++X)No[X]=5;var X,kp=_t(bn,9,0),Ap=_t(bn,9,1),Ep=_t(No,5,0),Mp=_t(No,5,1),Wi=function(e){for(var t=e[0],n=1;n<e.length;++n)e[n]>t&&(t=e[n]);return t},Lt=function(e,t,n){var r=t/8|0;return(e[r]|e[r+1]<<8)>>(t&7)&n},Ki=function(e,t){var n=t/8|0;return(e[n]|e[n+1]<<8|e[n+2]<<16)>>(t&7)},ra=function(e){return(e+7)/8|0},zo=function(e,t,n){return(t==null||t<0)&&(t=0),(n==null||n>e.length)&&(n=e.length),new ge(e.subarray(t,n))};var Ip=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],Fe=function(e,t,n){var r=new Error(t||Ip[e]);if(r.code=e,Error.captureStackTrace&&Error.captureStackTrace(r,Fe),!n)throw r;return r},Lp=function(e,t,n,r){var a=e.length,o=r?r.length:0;if(!a||t.f&&!t.l)return n||new ge(0);var c=!n,s=c||t.i!=2,g=t.i;c&&(n=new ge(a*3));var m=function(tn){var kn=n.length;if(tn>kn){var Ct=new ge(Math.max(kn*2,tn));Ct.set(n),n=Ct}},h=t.f||0,f=t.p||0,y=t.b||0,E=t.l,M=t.d,z=t.m,q=t.n,V=a*8;do{if(!E){h=Lt(e,f,1);var ee=Lt(e,f+1,3);if(f+=3,ee)if(ee==1)E=Ap,M=Mp,z=9,q=5;else if(ee==2){var me=Lt(e,f,31)+257,te=Lt(e,f+10,15)+4,G=me+Lt(e,f+5,31)+1;f+=14;for(var D=new ge(G),ve=new ge(19),ie=0;ie<te;++ie)ve[Ji[ie]]=Lt(e,f+ie*3,7);f+=te*3;for(var be=Wi(ve),yt=(1<<be)-1,Ue=_t(ve,be,1),ie=0;ie<G;){var Ne=Ue[Lt(e,f,yt)];f+=Ne&15;var N=Ne>>4;if(N<16)D[ie++]=N;else{var Se=0,ce=0;for(N==16?(ce=3+Lt(e,f,3),f+=2,Se=D[ie-1]):N==17?(ce=3+Lt(e,f,7),f+=3):N==18&&(ce=11+Lt(e,f,127),f+=7);ce--;)D[ie++]=Se}}var Ee=D.subarray(0,me),ue=D.subarray(me);z=Wi(Ee),q=Wi(ue),E=_t(Ee,z,1),M=_t(ue,q,1)}else Fe(1);else{var N=ra(f)+4,$=e[N-4]|e[N-3]<<8,le=N+$;if(le>a){g&&Fe(0);break}s&&m(y+$),n.set(e.subarray(N,le),y),t.b=y+=$,t.p=f=le*8,t.f=h;continue}if(f>V){g&&Fe(0);break}}s&&m(y+131072);for(var De=(1<<z)-1,xe=(1<<q)-1,Te=f;;Te=f){var Se=E[Ki(e,f)&De],Ve=Se>>4;if(f+=Se&15,f>V){g&&Fe(0);break}if(Se||Fe(2),Ve<256)n[y++]=Ve;else if(Ve==256){Te=f,E=null;break}else{var ze=Ve-254;if(Ve>264){var ie=Ve-257,de=qr[ie];ze=Lt(e,f,(1<<de)-1)+sc[ie],f+=de}var st=M[Ki(e,f)&xe],Ft=st>>4;st||Fe(3),f+=st&15;var ue=Tp[Ft];if(Ft>3){var de=jr[Ft];ue+=Ki(e,f)&(1<<de)-1,f+=de}if(f>V){g&&Fe(0);break}s&&m(y+131072);var ke=y+ze;if(y<ue){var lt=o-ue,J=Math.min(ue,ke);for(lt+y<0&&Fe(3);y<J;++y)n[y]=r[lt+y]}for(;y<ke;++y)n[y]=n[y-ue]}}t.l=E,t.p=Te,t.b=y,t.f=h,E&&(h=1,t.m=z,t.d=M,t.n=q)}while(!h);return y!=n.length&&c?zo(n,0,y):n.subarray(0,y)},Qt=function(e,t,n){n<<=t&7;var r=t/8|0;e[r]|=n,e[r+1]|=n>>8},Oo=function(e,t,n){n<<=t&7;var r=t/8|0;e[r]|=n,e[r+1]|=n>>8,e[r+2]|=n>>16},Yi=function(e,t){for(var n=[],r=0;r<e.length;++r)e[r]&&n.push({s:r,f:e[r]});var a=n.length,o=n.slice();if(!a)return{t:uc,l:0};if(a==1){var c=new ge(n[0].s+1);return c[n[0].s]=1,{t:c,l:1}}n.sort(function(le,me){return le.f-me.f}),n.push({s:-1,f:25001});var s=n[0],g=n[1],m=0,h=1,f=2;for(n[0]={s:-1,f:s.f+g.f,l:s,r:g};h!=a-1;)s=n[n[m].f<n[f].f?m++:f++],g=n[m!=h&&n[m].f<n[f].f?m++:f++],n[h++]={s:-1,f:s.f+g.f,l:s,r:g};for(var y=o[0].s,r=1;r<a;++r)o[r].s>y&&(y=o[r].s);var E=new at(y+1),M=ea(n[h-1],E,0);if(M>t){var r=0,z=0,q=M-t,V=1<<q;for(o.sort(function(me,te){return E[te.s]-E[me.s]||me.f-te.f});r<a;++r){var ee=o[r].s;if(E[ee]>t)z+=V-(1<<M-E[ee]),E[ee]=t;else break}for(z>>=q;z>0;){var N=o[r].s;E[N]<t?z-=1<<t-E[N]++-1:++r}for(;r>=0&&z;--r){var $=o[r].s;E[$]==t&&(--E[$],++z)}M=t}return{t:new ge(E),l:M}},ea=function(e,t,n){return e.s==-1?Math.max(ea(e.l,t,n+1),ea(e.r,t,n+1)):t[e.s]=n},ec=function(e){for(var t=e.length;t&&!e[--t];);for(var n=new at(++t),r=0,a=e[0],o=1,c=function(g){n[r++]=g},s=1;s<=t;++s)if(e[s]==a&&s!=t)++o;else{if(!a&&o>2){for(;o>138;o-=138)c(32754);o>2&&(c(o>10?o-11<<5|28690:o-3<<5|12305),o=0)}else if(o>3){for(c(a),--o;o>6;o-=6)c(8304);o>2&&(c(o-3<<5|8208),o=0)}for(;o--;)c(a);o=1,a=e[s]}return{c:n.subarray(0,r),n:t}},Ho=function(e,t){for(var n=0,r=0;r<t.length;++r)n+=e[r]*t[r];return n},cc=function(e,t,n){var r=n.length,a=ra(t+2);e[a]=r&255,e[a+1]=r>>8,e[a+2]=e[a]^255,e[a+3]=e[a+1]^255;for(var o=0;o<r;++o)e[a+o+4]=n[o];return(a+4+r)*8},tc=function(e,t,n,r,a,o,c,s,g,m,h){Qt(t,h++,n),++a[256];for(var f=Yi(a,15),y=f.t,E=f.l,M=Yi(o,15),z=M.t,q=M.l,V=ec(y),ee=V.c,N=V.n,$=ec(z),le=$.c,me=$.n,te=new at(19),G=0;G<ee.length;++G)++te[ee[G]&31];for(var G=0;G<le.length;++G)++te[le[G]&31];for(var D=Yi(te,7),ve=D.t,ie=D.l,be=19;be>4&&!ve[Ji[be-1]];--be);var yt=m+5<<3,Ue=Ho(a,bn)+Ho(o,No)+c,Ne=Ho(a,y)+Ho(o,z)+c+14+3*be+Ho(te,ve)+2*te[16]+3*te[17]+7*te[18];if(g>=0&&yt<=Ue&&yt<=Ne)return cc(t,h,e.subarray(g,g+m));var Se,ce,Ee,ue;if(Qt(t,h,1+(Ne<Ue)),h+=2,Ne<Ue){Se=_t(y,E,0),ce=y,Ee=_t(z,q,0),ue=z;var De=_t(ve,ie,0);Qt(t,h,N-257),Qt(t,h+5,me-1),Qt(t,h+10,be-4),h+=14;for(var G=0;G<be;++G)Qt(t,h+3*G,ve[Ji[G]]);h+=3*be;for(var xe=[ee,le],Te=0;Te<2;++Te)for(var Ve=xe[Te],G=0;G<Ve.length;++G){var ze=Ve[G]&31;Qt(t,h,De[ze]),h+=ve[ze],ze>15&&(Qt(t,h,Ve[G]>>5&127),h+=Ve[G]>>12)}}else Se=kp,ce=bn,Ee=Ep,ue=No;for(var G=0;G<s;++G){var de=r[G];if(de>255){var ze=de>>18&31;Oo(t,h,Se[ze+257]),h+=ce[ze+257],ze>7&&(Qt(t,h,de>>23&31),h+=qr[ze]);var st=de&31;Oo(t,h,Ee[st]),h+=ue[st],st>3&&(Oo(t,h,de>>5&8191),h+=jr[st])}else Oo(t,h,Se[de]),h+=ce[de]}return Oo(t,h,Se[256]),h+ce[256]},Cp=new oa([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),uc=new ge(0),Bp=function(e,t,n,r,a,o){var c=o.z||e.length,s=new ge(r+c+5*(1+Math.ceil(c/7e3))+a),g=s.subarray(r,s.length-a),m=o.l,h=(o.r||0)&7;if(t){h&&(g[0]=o.r>>3);for(var f=Cp[t-1],y=f>>13,E=f&8191,M=(1<<n)-1,z=o.p||new at(32768),q=o.h||new at(M+1),V=Math.ceil(n/3),ee=2*V,N=function(po){return(e[po]^e[po+1]<<V^e[po+2]<<ee)&M},$=new oa(25e3),le=new at(288),me=new at(32),te=0,G=0,D=o.i||0,ve=0,ie=o.w||0,be=0;D+2<c;++D){var yt=N(D),Ue=D&32767,Ne=q[yt];if(z[Ue]=Ne,q[yt]=Ue,ie<=D){var Se=c-D;if((te>7e3||ve>24576)&&(Se>423||!m)){h=tc(e,g,0,$,le,me,G,ve,be,D-be,h),ve=te=G=0,be=D;for(var ce=0;ce<286;++ce)le[ce]=0;for(var ce=0;ce<30;++ce)me[ce]=0}var Ee=2,ue=0,De=E,xe=Ue-Ne&32767;if(Se>2&&yt==N(D-xe))for(var Te=Math.min(y,Se)-1,Ve=Math.min(32767,D),ze=Math.min(258,Se);xe<=Ve&&--De&&Ue!=Ne;){if(e[D+Ee]==e[D+Ee-xe]){for(var de=0;de<ze&&e[D+de]==e[D+de-xe];++de);if(de>Ee){if(Ee=de,ue=xe,de>Te)break;for(var st=Math.min(xe,de-2),Ft=0,ce=0;ce<st;++ce){var ke=D-xe+ce&32767,lt=z[ke],J=ke-lt&32767;J>Ft&&(Ft=J,Ne=ke)}}}Ue=Ne,Ne=z[Ue],xe+=Ue-Ne&32767}if(ue){$[ve++]=268435456|Qi[Ee]<<18|Zl[ue];var tn=Qi[Ee]&31,kn=Zl[ue]&31;G+=qr[tn]+jr[kn],++le[257+tn],++me[kn],ie=D+Ee,++te}else $[ve++]=e[D],++le[e[D]]}}for(D=Math.max(D,ie);D<c;++D)$[ve++]=e[D],++le[e[D]];h=tc(e,g,m,$,le,me,G,ve,be,D-be,h),m||(o.r=h&7|g[h/8|0]<<3,h-=7,o.h=q,o.p=z,o.i=D,o.w=ie)}else{for(var D=o.w||0;D<c+m;D+=65535){var Ct=D+65535;Ct>=c&&(g[h/8|0]=m,Ct=c),h=cc(g,h+1,e.subarray(D,Ct))}o.i=c}return zo(s,0,r+ra(h)+a)},Rp=(function(){for(var e=new Int32Array(256),t=0;t<256;++t){for(var n=t,r=9;--r;)n=(n&1&&-306674912)^n>>>1;e[t]=n}return e})(),Dp=function(){var e=-1;return{p:function(t){for(var n=e,r=0;r<t.length;++r)n=Rp[n&255^t[r]]^n>>>8;e=n},d:function(){return~e}}};var Pp=function(e,t,n,r,a){if(!a&&(a={l:1},t.dictionary)){var o=t.dictionary.subarray(-32768),c=new ge(o.length+e.length);c.set(o),c.set(e,o.length),e=c,a.w=o.length}return Bp(e,t.level==null?6:t.level,t.mem==null?a.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+t.mem,n,r,a)},dc=function(e,t){var n={};for(var r in e)n[r]=e[r];for(var r in t)n[r]=t[r];return n};var zt=function(e,t){return e[t]|e[t+1]<<8},mt=function(e,t){return(e[t]|e[t+1]<<8|e[t+2]<<16|e[t+3]<<24)>>>0},Xi=function(e,t){return mt(e,t)+mt(e,t+4)*4294967296},He=function(e,t,n){for(;n;++t)e[t]=n,n>>>=8};function Op(e,t){return Pp(e,t||{},0,0)}function Hp(e,t){return Lp(e,{i:2},t&&t.out,t&&t.dictionary)}var pc=function(e,t,n,r){for(var a in e){var o=e[a],c=t+a,s=r;Array.isArray(o)&&(s=dc(r,o[1]),o=o[0]),ArrayBuffer.isView(o)?n[c]=[o,s]:(n[c+="/"]=[new ge(0),s],pc(o,c,n,r))}},nc=typeof TextEncoder<"u"&&new TextEncoder,ta=typeof TextDecoder<"u"&&new TextDecoder,Np=0;try{ta.decode(uc,{stream:!0}),Np=1}catch{}var zp=function(e){for(var t="",n=0;;){var r=e[n++],a=(r>127)+(r>223)+(r>239);if(n+a>e.length)return{s:t,r:zo(e,n-1)};a?a==3?(r=((r&15)<<18|(e[n++]&63)<<12|(e[n++]&63)<<6|e[n++]&63)-65536,t+=String.fromCharCode(55296|r>>10,56320|r&1023)):a&1?t+=String.fromCharCode((r&31)<<6|e[n++]&63):t+=String.fromCharCode((r&15)<<12|(e[n++]&63)<<6|e[n++]&63):t+=String.fromCharCode(r)}};function oc(e,t){if(t){for(var n=new ge(e.length),r=0;r<e.length;++r)n[r]=e.charCodeAt(r);return n}if(nc)return nc.encode(e);for(var a=e.length,o=new ge(e.length+(e.length>>1)),c=0,s=function(h){o[c++]=h},r=0;r<a;++r){if(c+5>o.length){var g=new ge(c+8+(a-r<<1));g.set(o),o=g}var m=e.charCodeAt(r);m<128||t?s(m):m<2048?(s(192|m>>6),s(128|m&63)):m>55295&&m<57344?(m=65536+(m&1047552)|e.charCodeAt(++r)&1023,s(240|m>>18),s(128|m>>12&63),s(128|m>>6&63),s(128|m&63)):(s(224|m>>12),s(128|m>>6&63),s(128|m&63))}return zo(o,0,c)}function _p(e,t){if(t){for(var n="",r=0;r<e.length;r+=16384)n+=String.fromCharCode.apply(null,e.subarray(r,r+16384));return n}else{if(ta)return ta.decode(e);var a=zp(e),o=a.s,n=a.r;return n.length&&Fe(8),o}}var Gp=function(e,t){return t+30+zt(e,t+26)+zt(e,t+28)},Fp=function(e,t,n){var r=zt(e,t+28),a=zt(e,t+30),o=_p(e.subarray(t+46,t+46+r),!(zt(e,t+8)&2048)),c=t+46+r,s=Up(e,c,a,n,mt(e,t+20),mt(e,t+24),mt(e,t+42)),g=s[0],m=s[1],h=s[2];return[zt(e,t+10),g,m,o,c+a+zt(e,t+32),h]},Up=function(e,t,n,r,a,o,c){var s=a==4294967295,g=o==4294967295,m=c==4294967295,h=t+n,f=s+g+m;if(r&&f){for(;t+4<h;t+=4+zt(e,t+2))if(zt(e,t)==1)return[s?Xi(e,t+4+8*g):a,g?Xi(e,t+4):o,m?Xi(e,t+4+8*(g+s)):c,1];r<2&&Fe(13)}return[a,o,c,0]},na=function(e){var t=0;if(e)for(var n in e){var r=e[n].length;r>65535&&Fe(9),t+=r+4}return t},rc=function(e,t,n,r,a,o,c,s){var g=r.length,m=n.extra,h=s&&s.length,f=na(m);He(e,t,c!=null?33639248:67324752),t+=4,c!=null&&(e[t++]=20,e[t++]=n.os),e[t]=20,t+=2,e[t++]=n.flag<<1|(o<0&&8),e[t++]=a&&8,e[t++]=n.compression&255,e[t++]=n.compression>>8;var y=new Date(n.mtime==null?Date.now():n.mtime),E=y.getFullYear()-1980;if((E<0||E>119)&&Fe(10),He(e,t,E<<25|y.getMonth()+1<<21|y.getDate()<<16|y.getHours()<<11|y.getMinutes()<<5|y.getSeconds()>>1),t+=4,o!=-1&&(He(e,t,n.crc),He(e,t+4,o<0?-o-2:o),He(e,t+8,n.size)),He(e,t+12,g),He(e,t+14,f),t+=16,c!=null&&(He(e,t,h),He(e,t+6,n.attrs),He(e,t+10,c),t+=14),e.set(r,t),t+=g,f)for(var M in m){var z=m[M],q=z.length;He(e,t,+M),He(e,t+2,q),e.set(z,t+4),t+=4+q}return h&&(e.set(s,t),t+=h),t},Vp=function(e,t,n,r,a){He(e,t,101010256),He(e,t+8,n),He(e,t+10,n),He(e,t+12,r),He(e,t+16,a)};function mc(e,t){t||(t={});var n={},r=[];pc(e,"",n,t);var a=0,o=0;for(var c in n){var s=n[c],g=s[0],m=s[1],h=m.level==0?0:8,f=oc(c),y=f.length,E=m.comment,M=E&&oc(E),z=M&&M.length,q=na(m.extra);y>65535&&Fe(11);var V=h?Op(g,m):g,ee=V.length,N=Dp();N.p(g),r.push(dc(m,{size:g.length,crc:N.d(),c:V,f,m:M,u:y!=c.length||M&&E.length!=z,o:a,compression:h})),a+=30+y+q+ee,o+=76+2*(y+q)+(z||0)+ee}for(var $=new ge(o+22),le=a,me=o-a,te=0;te<r.length;++te){var f=r[te];rc($,f.o,f,f.f,f.u,f.c.length);var G=30+f.f.length+na(f.extra);$.set(f.c,f.o+G),rc($,a,f,f.f,f.u,f.c.length,f.o,f.m),a+=16+G+(f.m?f.m.length:0)}return Vp($,a,r.length,me,le),$}function fc(e,t){for(var n={},r=e.length-22;mt(e,r)!=101010256;--r)(!r||e.length-r>65558)&&Fe(13);var a=zt(e,r+8);if(!a)return{};var o=mt(e,r+16),c=mt(e,r-20)==117853008;if(c){var s=mt(e,r-12);c=mt(e,s)==101075792,c&&(a=mt(e,s+32),o=mt(e,s+48))}for(var g=t&&t.filter,m=0;m<a;++m){var h=Fp(e,o,c),f=h[0],y=h[1],E=h[2],M=h[3],z=h[4],q=h[5],V=Gp(e,q);o=z,(!g||g({name:M,size:y,originalSize:E,compression:f}))&&(f?f==8?n[M]=Hp(e.subarray(V,V+y),{out:new ge(E)}):Fe(14,"unknown compression type "+f):n[M]=zo(e,V,V+y))}return n}var Qr="https://devel.kamotimestamps.com",bc="308989572223-cdnvpn65mc51oqneu7po3og51uf5ahsb.apps.googleusercontent.com",qp="https://www.youtube.com/",Sc="timekeeper_sync_auth",xc="timekeeper_sync_oauth",On="syncAuthState",Tc="syncCursors",jp=500,$p=5e3,hc=200,Wp=500,Kp=60*1e3,Yp=60*1e3,Xp=300*1e3;function Nn(){return!!(Qr&&bc)}var kc=Ce({accessToken:Y(),accessTokenExpiresAt:Le({finite:!0}),refreshToken:Y(),user:Ce({id:Y(),email:Y(),name:dt(Y())})}),Jp=Ce({records:fn.array(),seq:Le({int:!0,nonnegative:!0}),hasMore:Rn()}),Qp=Ce({rejected:fn.array(),fromSeq:Le({int:!0,nonnegative:!0}),seq:Le({int:!0,nonnegative:!0})}),Zp=Ce({type:Y(),seq:we(Le({int:!0,nonnegative:!0})),fromSeq:we(Le({int:!0,nonnegative:!0})),records:we(fn.array())}),em=Ce({type:Y(),idToken:we(Y()),error:we(Y())}),xn=class extends Error{},Xr=class extends Error{constructor(n,r){super(r);this.httpStatus=n}},tm=e=>e instanceof Xr&&e.httpStatus>=400&&e.httpStatus<500&&e.httpStatus!==408&&e.httpStatus!==429,_o="signed-out",Wr="",Hn=!1,aa=null,io=new Set,ht=!0,Zt=null,Sn=null,Zr=0,oo=null,gc=0,en=!0,Go=null,ua=0,sa=null,vc=!1,We={pushCounter:0,pullSeq:0},da=new Map,yc=Promise.resolve(),Kr=!1,$r=null,Jr="",ia=!1,ei=null,Ac=null,la=null,Yr=null,Ec=null;function Ke(){return Nl()}function Mc(e){Ac=e}function Ic(e){la=e}function Lc(e){Yr=e}function Cc(e){Ec=e}var Bc="#52c41a",Rc="#ff4d4f",ro="#ffa500";function ao(){let e=Ke();if(la){let t=la;if(t.style.fontWeight="bold",t.onmouseenter=null,t.onmouseleave=null,!Nn())j(t,"alert-triangle","Sync backend is not configured in this build"),t.style.color=ro;else if(!e.isSignedIn)j(t,"circle-x","Not signed in"),t.style.color=Rc;else{j(t,"circle-check","Signed in"),t.style.color=Bc;let n=e.userName||e.email;n&&(t.onmouseenter=()=>j(t,"circle-check",`Signed in as ${n}`),t.onmouseleave=()=>j(t,"circle-check","Signed in"))}}if(Yr){let{text:t,color:n}=Dc(e);Yr.textContent=t,Yr.style.color=n}Ec?.(),Pc?.()}function Dc(e=Ke()){if(_o==="error")return{text:Wr||"Sync error",color:Rc,busy:!1};if(_o==="connecting")return{text:Wr||"Connecting\u2026",color:ro,busy:!0};if(e.isSignedIn&&_o==="offline")return{text:Wr||"Offline. Retrying\u2026",color:ro,busy:!1};if(e.isSignedIn&&_o==="online"){let t=Hn?"Syncing\u2026":"Live sync on";return!Hn&&aa&&(t+=` \xB7 last synced ${new Date(aa).toLocaleTimeString()}`),!Hn&&io.size>0?(t+=` \xB7 ${io.size} timestamp${io.size===1?"":"s"} could not be synced`,{text:t,color:ro,busy:!1}):{text:t,color:Hn?ro:Bc,busy:Hn}}return{text:"",color:"#aaa",busy:!1}}var nm="#4285f4";function Fo(){if(!Nn()||!Ke().isSignedIn)return null;let{text:e,color:t,busy:n}=Dc();return e?{color:n?nm:t,tooltip:`Sync: ${e}`}:{color:ro,tooltip:"Sync: starting\u2026"}}var Pc=null;function Oc(e){Pc=e}function ft(e,t=""){_o=e,Wr=t,ao()}function Hc(){return typeof GM<"u"&&GM&&typeof GM.getValue=="function"&&typeof GM.setValue=="function"?GM:null}async function Nc(){let e=Hc();if(!e)return Yt(On);let t=await e.getValue(On);if(t!=null)return t;let n=await Yt(On);return n&&(await e.setValue(On,n),await yn(On,null)),n??void 0}async function ti(){try{let e=Hc();e?await e.setValue(On,Ke()):await yn(On,Ke())}catch(e){l("Failed to save sync auth state:",e,"error")}}function Uo(){yn(Tc,{userId:Ke().userId,...We})}async function om(){let e=await Yt(Tc);e&&e.userId===Ke().userId&&typeof e.pushCounter=="number"&&typeof e.pullSeq=="number"?We={pushCounter:e.pushCounter,pullSeq:e.pullSeq}:We={pushCounter:0,pullSeq:0}}function pa(e,t){return fetch(`${Qr}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)})}function zc(e){ei=null,to({isSignedIn:!0,accessToken:e.accessToken,accessTokenExpiresAt:e.accessTokenExpiresAt,refreshToken:e.refreshToken,userId:e.user.id,userName:e.user.name,email:e.user.email})}var _c=e=>!!e.accessToken&&e.accessToken!==ei&&!!e.accessTokenExpiresAt&&e.accessTokenExpiresAt-Date.now()>Kp;async function rm(e){return typeof navigator<"u"&&navigator.locks?await navigator.locks.request("timekeeper-sync-refresh",e):e()}async function im(){let e=await Nc();if(e==null)return;let t=Ti.safeParse(e);t.success&&to(t.data)}function am(){return $r??($r=rm(async()=>{await im();let e=Ke();if(!e.isSignedIn||!e.refreshToken)throw new xn("Not signed in");if(_c(e))return e.accessToken;let t=await pa("/auth/refresh",{refreshToken:e.refreshToken});if(t.status===401)throw new xn("Session expired");if(!t.ok)throw new Error(`Token refresh failed (HTTP ${t.status})`);let n=kc.safeParse(await t.json());if(!n.success)throw new Error("Unexpected token refresh response");return zc(n.data),await ti(),n.data.accessToken}).finally(()=>{$r=null})),$r}async function Gc(){let e=Ke();if(!e.isSignedIn||!e.refreshToken)throw new xn("Not signed in");return _c(e)?e.accessToken:am()}async function Fc(e,t,n=!0){let r=await Gc(),a=await fetch(`${Qr}${e}`,{method:t.method,headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/json"},body:t.body===void 0?void 0:JSON.stringify(t.body)});if(a.status===401){if(!n)throw new xn("Session expired");return ei=r,Fc(e,t,!1)}return a}async function Uc(e,t,n){let r=await Fc(e,t);if(!r.ok)throw new Xr(r.status,`${t.method} ${e} failed (HTTP ${r.status})`);let a=n.safeParse(await r.json());if(!a.success)throw new Error(`Unexpected response from ${e}`);return a.data}function sm(e){try{let t=e.split(".")[1].replace(/-/g,"+").replace(/_/g,"/");return JSON.parse(atob(t.padEnd(Math.ceil(t.length/4)*4,"=")))}catch{return null}}function lm(e,t,n){return new Promise((r,a)=>{let o=()=>{clearTimeout(c),e.close();try{t.close()}catch{}},c=setTimeout(()=>{o(),a(new Error("Sign-in timed out"))},Xp);e.onmessage=s=>{let g=em.safeParse(s.data);if(g.success){if(g.data.type==="timekeeper_sync_oauth_error")o(),a(new Error(g.data.error||"Google sign-in failed"));else if(g.data.type==="timekeeper_sync_oauth_token"&&g.data.idToken){if(sm(g.data.idToken)?.nonce!==n)return;o(),r(g.data.idToken)}}}})}function Vc(){let e=window.location.hash;if(!e||e.length<=1)return!1;let t=new URLSearchParams(e.substring(1));if(t.get("state")!==Sc)return!1;let n=t.get("id_token"),r=t.get("error_description")||t.get("error");if(!n&&!r)return!1;try{let a=new BroadcastChannel(xc);a.postMessage(n?{type:"timekeeper_sync_oauth_token",idToken:n}:{type:"timekeeper_sync_oauth_error",error:r}),a.close()}catch(a){console.error("[Timekeeper] Failed to hand sync sign-in result to the opener:",a)}return history.replaceState&&history.replaceState(null,"",window.location.pathname+window.location.search),window.close(),!0}async function qc(){if(!Nn()){ft("error","Sync backend is not configured in this build");return}if(Ke().isSignedIn||ia)return;ia=!0,ft("connecting","Opening Google sign-in\u2026");let e=crypto.randomUUID(),t=new BroadcastChannel(xc);try{let n=new URL("https://accounts.google.com/o/oauth2/v2/auth");n.searchParams.set("client_id",bc),n.searchParams.set("redirect_uri",qp),n.searchParams.set("response_type","id_token"),n.searchParams.set("scope","openid email profile"),n.searchParams.set("nonce",e),n.searchParams.set("state",Sc),n.searchParams.set("prompt","select_account");let r=window.open(n.toString(),"TimekeeperSyncAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!r)throw new Error("Popup blocked. Please enable popups for YouTube.");ft("connecting","Waiting for Google sign-in\u2026");let a=await lm(t,r,e);ft("connecting","Signing in to Timekeeper Sync\u2026");let o=await pa("/auth/google",{idToken:a});if(!o.ok)throw new Error(o.status===401?"Google sign-in was rejected by the server":`Sign-in failed (HTTP ${o.status})`);let c=kc.safeParse(await o.json());if(!c.success)throw new Error("Unexpected response from the sync server");zc(c.data),await ti(),We={pushCounter:0,pullSeq:0},Uo(),l(`Signed in to Timekeeper Sync as ${c.data.user.email}`),await Xc()}catch(n){t.close(),l("Sync sign-in failed:",n,"error"),ft("error",n instanceof Error?n.message:"Sign-in failed")}finally{ia=!1}}async function jc(){let{refreshToken:e}=Ke();if(Jc(),to(Yn),We={pushCounter:0,pullSeq:0},da.clear(),io.clear(),await ti(),Uo(),ft("signed-out"),e&&Nn())try{await pa("/auth/logout",{refreshToken:e})}catch(t){l("Sync logout request failed:",t,"warn")}}function $c(){Jc(),to(Yn),ti(),ft("error","Session expired. Please sign in again.")}function Wc(e){let t=yc.then(e);return yc=t.catch(()=>{}),t}function so(){ht||Kr||(Kr=!0,Wc(async()=>{Kr=!1,await dm()}).catch(e=>l("Sync: cycle crashed:",e,"error")))}async function ma(e){if(e.length!==0){for(let t of e)da.set(t.guid,t.write_counter??0);await Pi(e),Ac?.([...new Set(e.map(t=>t.video_id))])}}function Kc(e,t){return e>We.pullSeq?(en=!0,!1):(t>We.pullSeq&&(We.pullSeq=t,Uo()),!0)}async function cm(){for(;;){let e=await Uc(`/sync/pull?since=${We.pullSeq}&limit=${Wp}`,{method:"GET"},Jp);await ma(e.records);let t=e.seq!==We.pullSeq;if(We.pullSeq=e.seq,Uo(),!e.hasMore||!t)return}}async function ca(e){try{let t=await Uc("/sync/push",{method:"POST",body:{deviceId:Jr,records:e}},Qp);await ma(t.rejected);for(let n of e)io.delete(n.guid);Kc(t.fromSeq,t.seq)||so()}catch(t){if(!tm(t))throw t;if(e.length>1){let n=e.length>>1;await ca(e.slice(0,n)),await ca(e.slice(n));return}io.add(e[0].guid),l(`Sync: server refused timestamp ${e[0].guid}; leaving it local-only:`,t,"warn")}}async function um(){let e=await Di(We.pushCounter);if(e.length===0)return;let t=e.filter(n=>(da.get(n.guid)??0)<n.write_counter);for(let n=0;n<t.length;n+=hc)await ca(t.slice(n,n+hc));We.pushCounter=Math.max(We.pushCounter,e[e.length-1].write_counter),Uo()}async function dm(){if(!ht){Hn=!0,ao();try{(en||!Zt)&&(await cm(),en=!1),await um(),aa=Date.now(),ua=0}catch(e){if(e instanceof xn){$c();return}l("Sync cycle failed:",e,"warn"),en=!0,pm()}finally{Hn=!1,ao()}}}function Yc(e){return Math.min(Yp,1e3*2**e)*(.5+Math.random()/2)}function pm(){ht||Go||(Go=setTimeout(()=>{Go=null,so()},Yc(ua++)))}function mm(){if(ht)return;let e=Date.now();oo?clearTimeout(oo):gc=e;let t=Math.max(0,Math.min(jp,gc+$p-e));oo=setTimeout(()=>{oo=null,so()},t)}function fa(){ht||(en=!0,Zt||(Zr=0,Sn&&clearTimeout(Sn),Sn=null,ha()),so())}function wc(){ht||Sn||(Sn=setTimeout(()=>{Sn=null,ha()},Yc(Zr++)))}async function ha(){if(ht||Zt)return;ft("connecting");let e;try{e=await Gc()}catch(n){return n instanceof xn?$c():(l("Sync: could not get an access token:",n,"warn"),ft("offline"),wc())}if(ht||Zt)return;let t=new WebSocket(`${Qr.replace(/^http/,"ws")}/sync/ws`);Zt=t,t.onopen=()=>t.send(JSON.stringify({type:"auth",token:e,deviceId:Jr})),t.onmessage=n=>{let r;try{r=JSON.parse(String(n.data))}catch{return}let a=Zp.safeParse(r);if(a.success){if(a.data.type==="ready")Zr=0,ft("online"),(a.data.seq===void 0||a.data.seq!==We.pullSeq)&&(en=!0),so();else if(a.data.type==="changes"&&a.data.records){let{fromSeq:o,seq:c,records:s}=a.data;Wc(async()=>{await ma(s),(o===void 0||c===void 0)&&(en=!0),(en||!Kc(o,c))&&so()}).catch(g=>l("Sync: failed to apply live changes:",g,"error"))}}},t.onclose=n=>{Zt===t&&(Zt=null),en=!0,!ht&&(n.code===4401&&(ei=e),ft("offline"),wc())},t.onerror=()=>{}}async function Xc(){if(ht){if(!Jr){let e=await Yt("device_id");Jr=typeof e=="string"&&e?e:crypto.randomUUID()}ht=!1,ua=0,Zr=0,sa=Oi(mm),vc||(vc=!0,window.addEventListener("online",()=>fa())),await ha()}}function Jc(){ht=!0,sa?.(),sa=null;for(let t of[oo,Go,Sn])t&&clearTimeout(t);oo=Go=Sn=null,Kr=!1;let e=Zt;Zt=null;try{e?.close()}catch{}}async function Qc(){if(!Nn()){ao();return}try{let e=Ti.safeParse(await Nc());e.success&&to(e.data);let t=Ke();t.isSignedIn&&t.refreshToken?(await om(),await Xc()):ft("signed-out")}catch(e){l("Failed to load sync auth state:",e,"error")}}function gt(){return Nt()}var vt={get isSignedIn(){return Nt().isSignedIn},get accessToken(){return Nt().accessToken},get userName(){return Nt().userName},get email(){return Nt().email},set isSignedIn(e){let t=Nt();It({...t,isSignedIn:e})},set accessToken(e){let t=Nt();It({...t,accessToken:e})},set userName(e){let t=Nt();It({...t,userName:e})},set email(e){let t=Nt();It({...t,email:e})}};function $o(){return $e().auth.autoBackupEnabled}function Gt(){return $e().auth.autoBackupIntervalMinutes}var ya=null,re=null,ne=null,_n=null;function nu(e){ya=e}function ou(e){re=e}function ru(e){ne=e}function iu(e){_n=e}var Zc=!1;function au(){if(!Zc)try{let e=document.createElement("style");e.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(e),Zc=!0}catch{}}var su=null,wa=null,Vo=null,qo=null,ba=null;function lu(e){su=e}function cu(e){wa=e}function Sa(e){Vo=e}function xa(e){qo=e}function uu(e){ba=e}var oi="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",du="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",pu="https://www.youtube.com/",hm=new Date(Date.UTC(2e3,0,1,0,0,0)),gm=30*1e3,vm=1800*1e3,eu=5,ni=null,Ye=null;async function Ta(){try{let e=await qo("googleAuthState"),t=e&&typeof e=="object"?{...e,accessToken:e.accessToken?"[REDACTED]":null}:e;l("Loading Google auth state from IndexedDB:",t);let n=xi.safeParse(e);if(n.success){let r=gt();It({...r,...n.data});let a=gt();a.isSignedIn&&a.accessToken&&l(`Reusing stored Google auth token for ${a.userName||a.email||"user"}`),uo();let o=gt();o.isSignedIn&&o.accessToken&&await Tn(!0)}else if(e!==void 0){let r=e&&typeof e=="object"?{...e,accessToken:e.accessToken?"[REDACTED]":null}:e;l("Google auth state failed validation:",{stored:r,errors:n.error.message},"warn")}}catch(e){l("Failed to load Google auth state:",e,"error")}}async function Wo(){try{let e=gt(),t=xi.safeParse(e);if(!t.success){let n={...e,accessToken:e.accessToken?"[REDACTED]":null};l("Invalid auth state, cannot save",{state:n,errors:t.error.message},"error");return}await Vo("googleAuthState",e),e.isSignedIn&&e.accessToken?l(`Saved Google auth state to IndexedDB for ${e.userName||e.email||"user"}`):l("Cleared Google auth state in IndexedDB (signed out)")}catch(e){l("Failed to save Google auth state:",e,"error")}}function uo(){ya&&(ya.style.display="none")}function nt(e,t){if(!ne)return;if(ne.style.fontWeight="bold",e==="authenticating"){au(),ne.style.color="#ffa500",ne.replaceChildren();let r=document.createElement("span");r.className="tk-auth-spinner";let a=document.createTextNode(` ${t||"Authorizing with Google\u2026"}`);ne.appendChild(r),ne.appendChild(a);return}if(e==="error"){j(ne,"circle-x",t||"Authorization failed"),ne.style.color="#ff4d4f",Ae();return}let n=gt();n.isSignedIn?(j(ne,"circle-check","Signed in"),ne.style.color="#52c41a",ne.removeAttribute("title"),n.userName?(ne.onmouseenter=()=>{j(ne,"circle-check",`Signed in as ${n.userName}`)},ne.onmouseleave=()=>{j(ne,"circle-check","Signed in")}):(ne.onmouseenter=null,ne.onmouseleave=null)):(j(ne,"circle-x","Not signed in"),ne.style.color="#ff4d4f",ne.removeAttribute("title"),ne.onmouseenter=null,ne.onmouseleave=null),Ae()}function ym(){ne&&(au(),ne.classList.remove("tk-auth-blink"),ne.offsetWidth,ne.classList.add("tk-auth-blink"),setTimeout(()=>{ne.classList.remove("tk-auth-blink")},1200))}function mu(e,t=300*1e3){return new Promise((n,r)=>{if(!e){l&&l("OAuth monitor: popup is null",null,"error"),r(new Error("Failed to open popup"));return}l&&l("OAuth monitor: starting to monitor popup for token");let a=Date.now(),o="timekeeper_oauth",c=null,s=null,g=null,m=()=>{if(c){try{c.close()}catch{}c=null}s&&(clearInterval(s),s=null),g&&(clearInterval(g),g=null)};try{c=new BroadcastChannel(o),l&&l("OAuth monitor: BroadcastChannel created successfully"),c.onmessage=y=>{let E=y.data?.token?{...y.data,token:"[REDACTED]"}:y.data;l&&l("OAuth monitor: received BroadcastChannel message",E);let M=Ce({type:Y(),token:we(Y()),error:we(Y())}).safeParse(y.data);if(!M.success){l&&l("OAuth monitor: invalid message format",M.error,"warn");return}if(M.data.type==="timekeeper_oauth_token"&&M.data.token){l&&l("OAuth monitor: token received via BroadcastChannel"),m();try{e.close()}catch{}n(M.data.token)}else if(M.data.type==="timekeeper_oauth_error"){l&&l("OAuth monitor: error received via BroadcastChannel",M.data.error,"error"),m();try{e.close()}catch{}r(new Error(M.data.error||"OAuth failed"))}}}catch(y){l&&l("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",y)}l&&l("OAuth monitor: setting up IndexedDB polling");let h=Date.now();s=setInterval(async()=>{try{let y=indexedDB.open("ytls-timestamps-db",4);y.onsuccess=()=>{let E=y.result,q=E.transaction("settings","readonly").objectStore("settings").get("oauth_message");q.onsuccess=()=>{let V=q.result;if(V&&V.value){let ee=V.value,N=Ce({type:Y(),token:we(Y()),error:we(Y()),timestamp:we(Le())}).safeParse(ee);if(!N.success){l&&l("OAuth monitor: invalid IndexedDB message format",N.error,"warn");return}if(N.data.timestamp&&N.data.timestamp>h){let $=N.data.token?{...N.data,token:"[REDACTED]"}:N.data;if(l&&l("OAuth monitor: received IndexedDB message",$),N.data.type==="timekeeper_oauth_token"&&N.data.token){l&&l("OAuth monitor: token received via IndexedDB"),m();try{e.close()}catch{}E.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),n(N.data.token)}else if(N.data.type==="timekeeper_oauth_error"){l&&l("OAuth monitor: error received via IndexedDB",N.data.error,"error"),m();try{e.close()}catch{}E.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),r(new Error(N.data.error||"OAuth failed"))}h=N.data.timestamp||Date.now()}}E.close()}}}catch(y){l&&l("OAuth monitor: IndexedDB polling error",y,"error")}},500),g=setInterval(()=>{if(Date.now()-a>t){l&&l("OAuth monitor: popup timed out after 5 minutes",null,"error"),m();try{e.close()}catch{}r(new Error("OAuth popup timed out"));return}},1e3)})}async function fu(){if(!oi){nt("error","Google Client ID not configured");return}try{l&&l("OAuth signin: starting OAuth flow"),nt("authenticating","Opening authentication window...");let e=new URL("https://accounts.google.com/o/oauth2/v2/auth");e.searchParams.set("client_id",oi),e.searchParams.set("redirect_uri",pu),e.searchParams.set("response_type","token"),e.searchParams.set("scope",du),e.searchParams.set("include_granted_scopes","true"),e.searchParams.set("state","timekeeper_auth"),l&&l("OAuth signin: opening popup");let t=window.open(e.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!t){l&&l("OAuth signin: popup blocked by browser",null,"error"),nt("error","Popup blocked. Please enable popups for YouTube.");return}l&&l("OAuth signin: popup opened successfully"),nt("authenticating","Waiting for authentication...");try{let n=await mu(t),r=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${n}`}});if(r.ok){let a=await r.json(),o=Ce({name:we(Y()),email:we(Y())}).safeParse(a);if(!o.success)throw l&&l("Failed to validate user info response",o.error,"error"),new Error("Invalid user info response");let c=o.data;It({isSignedIn:!0,accessToken:n,userName:c.name||null,email:c.email||null}),await Wo(),uo(),nt(),Ae(),await Tn(),l?l(`Successfully authenticated as ${c.name}`):console.log(`[Timekeeper] Successfully authenticated as ${c.name}`)}else throw new Error("Failed to fetch user info")}catch(n){let r=n instanceof Error?n.message:"Authentication failed";l?l("OAuth failed:",n,"error"):console.error("[Timekeeper] OAuth failed:",n),nt("error",r);return}}catch(e){let t=e instanceof Error?e.message:"Sign in failed";l?l("Failed to sign in to Google:",e,"error"):console.error("[Timekeeper] Failed to sign in to Google:",e),nt("error",`Failed to sign in: ${t}`)}}async function wm(){let e=gt(),t=e.email;if(!oi||!t)return!1;l("Silent OAuth: attempting silent token refresh for "+t);let n=new URL("https://accounts.google.com/o/oauth2/v2/auth");n.searchParams.set("client_id",oi),n.searchParams.set("redirect_uri",pu),n.searchParams.set("response_type","token"),n.searchParams.set("scope",du),n.searchParams.set("include_granted_scopes","true"),n.searchParams.set("state","timekeeper_auth"),n.searchParams.set("prompt","none"),n.searchParams.set("login_hint",t);let r=window.open(n.toString(),"TimekeeperGoogleAuthSilent","width=1,height=1,left=-2000,top=-2000,menubar=no,toolbar=no,location=no");if(!r)return l("Silent OAuth: popup blocked",null,"warn"),!1;try{let a=await mu(r,15e3);return It({...e,isSignedIn:!0,accessToken:a}),await Wo(),uo(),nt(),l("Silent OAuth: token refreshed successfully for "+t),!0}catch(a){l("Silent OAuth: silent refresh failed",a,"warn");try{r.close()}catch{}return!1}}async function hu(){if(!window.opener||window.opener===window)return!1;l&&l("OAuth popup: detected popup window, checking for OAuth response");let e=window.location.hash;if(!e||e.length<=1)return l&&l("OAuth popup: no hash params found"),!1;let t=e.startsWith("#")?e.substring(1):e,n=new URLSearchParams(t),r=n.get("state");if(l&&l("OAuth popup: hash params found, state="+r),r!=="timekeeper_auth")return l&&l("OAuth popup: not our OAuth flow (wrong state)"),!1;let a=n.get("error"),o=n.get("access_token"),c="timekeeper_oauth";if(a){try{let s=new BroadcastChannel(c);s.postMessage({type:"timekeeper_oauth_error",error:n.get("error_description")||a}),s.close(),l&&l("OAuth popup: error broadcast via BroadcastChannel")}catch{let g={type:"timekeeper_oauth_error",error:n.get("error_description")||a,timestamp:Date.now()};l&&l("OAuth popup: writing error to IndexedDB",g);let m=indexedDB.open("ytls-timestamps-db",4);m.onsuccess=()=>{let h=m.result,y=h.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:g});y.onsuccess=()=>{l&&l("OAuth popup: error written to IndexedDB successfully")},y.onerror=()=>{l&&l("OAuth popup: failed to write error to IndexedDB",y.error,"error")},h.close()},m.onerror=()=>{l&&l("OAuth popup: failed to open IndexedDB",m.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(o){l&&l("OAuth popup: access token found, broadcasting to opener");try{let s=new BroadcastChannel(c);s.postMessage({type:"timekeeper_oauth_token",token:o}),s.close(),l&&l("OAuth popup: token broadcast via BroadcastChannel")}catch(s){l&&l("OAuth popup: BroadcastChannel failed, using IndexedDB",s);let g={type:"timekeeper_oauth_token",token:o,timestamp:Date.now()},m={...g,token:"[REDACTED]"};l&&l("OAuth popup: writing token to IndexedDB",m);let h=indexedDB.open("ytls-timestamps-db",4);h.onsuccess=()=>{let f=h.result,E=f.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:g});E.onsuccess=()=>{l&&l("OAuth popup: token written to IndexedDB successfully")},E.onerror=()=>{l&&l("OAuth popup: failed to write token to IndexedDB",E.error,"error")},f.close()},h.onerror=()=>{l&&l("OAuth popup: failed to open IndexedDB",h.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function gu(){It({isSignedIn:!1,accessToken:null,userName:null,email:null}),await Wo(),await Tn(),uo(),nt(),Ae()}async function vu(){let e=gt();if(!e.isSignedIn||!e.accessToken)return!1;try{let t=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${e.accessToken}`}});return t.status===401?(await bu({silent:!0}),!1):t.ok}catch(t){return l("Failed to verify auth state:",t,"error"),!1}}function ri(){let e=gt();return e.isSignedIn&&!!e.accessToken}function co(){return ri()}function bm(){let e=[];return ri()&&e.push("Google Drive"),e}function Sm(e){let t=fc(new Uint8Array(e)),n=Object.values(t)[0];return n?new TextDecoder().decode(n):null}async function yu(e){let t={Authorization:`Bearer ${e}`},r=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,a=await fetch(r,{headers:t});if(a.status===401)throw new Error("unauthorized");if(!a.ok)throw new Error("drive search failed");let o=await a.json();if(Array.isArray(o.files)&&o.files.length>0)return o.files[0].id;let c=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...t,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(c.status===401)throw new Error("unauthorized");if(!c.ok)throw new Error("drive folder create failed");return(await c.json()).id}async function wu(e,t,n){let r=`name='${e}' and '${t}' in parents and trashed=false`,a=encodeURIComponent(r),o=encodeURIComponent("modifiedTime desc"),c=await fetch(`https://www.googleapis.com/drive/v3/files?q=${a}&orderBy=${o}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${n}`}});if(c.status===401)throw new Error("unauthorized");if(!c.ok)throw new Error(`drive search failed (${c.status})`);let s=await c.json();return s.files&&s.files.length>0?s.files[0].id:null}async function tu(e){let t=await yu(e),n=await wu("timekeeper-data.zip",t,e);if(!n)return null;let r=await fetch(`https://www.googleapis.com/drive/v3/files/${n}?alt=media`,{headers:{Authorization:`Bearer ${e}`}});if(r.status===401)throw new Error("unauthorized");if(!r.ok)throw new Error(`drive download failed (${r.status})`);let a=await r.arrayBuffer();try{return Sm(a)}catch(o){return l("Remote backup could not be decoded; the next upload will replace it:",o,"warn"),null}}async function xm(){if(!wa)return;let e=gt();if(!e.isSignedIn||!e.accessToken)return;let t;try{t=await tu(e.accessToken)}catch(a){if(a.message!=="unauthorized")throw a;await bu({silent:!0});let o=gt();if(!o.isSignedIn||!o.accessToken)throw a;t=await tu(o.accessToken)}if(!t)return;let{mergedVideos:n,mergedTimestamps:r}=await wa(t);r>0&&(l(`Pre-backup merge: added ${r} timestamps from ${n} videos from remote`),ba&&ba())}function Tm(e,t){let n=new TextEncoder().encode(e),r=t.replace(/\\/g,"/").replace(/^\/+/,"");return r.endsWith(".json")||(r+=".json"),mc({[r]:[n,{level:6,mtime:hm,os:0}]})}async function km(e,t,n,r){let a=e.replace(/\.json$/,".zip"),o=await wu(a,n,r),c=new TextEncoder().encode(t).length,s=Tm(t,e),g=s.length;l(`Compressing data: ${c} bytes -> ${g} bytes (${Math.round(100-g/c*100)}% reduction)`);let m="-------314159265358979",h=`\r
--${m}\r
`,f=`\r
--${m}--`,y=o?{name:a,mimeType:"application/zip"}:{name:a,mimeType:"application/zip",parents:[n]},E=8192,M="";for(let $=0;$<s.length;$+=E){let le=s.subarray($,Math.min($+E,s.length));M+=String.fromCharCode.apply(null,Array.from(le))}let z=btoa(M),q=h+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify(y)+h+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+z+f,V,ee;o?(V=`https://www.googleapis.com/upload/drive/v3/files/${o}?uploadType=multipart&fields=id,name`,ee="PATCH"):(V="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",ee="POST");let N=await fetch(V,{method:ee,headers:{Authorization:`Bearer ${r}`,"Content-Type":`multipart/related; boundary=${m}`},body:q});if(N.status===401)throw new Error("unauthorized");if(!N.ok)throw new Error("drive upload failed")}async function bu(e){l("Auth expired, attempting silent token refresh",null,"warn"),!await wm()&&(l("Silent OAuth: falling back to sign-out",null,"warn"),It({isSignedIn:!1,accessToken:null,userName:null,email:null}),await Wo(),await Tn(),nt("error","Authorization expired. Please sign in again."),Ae())}async function Am(e){if(!ri())throw e?.silent||nt("error","Configure a backup destination first"),new Error("no-backup-destination");await xm();let t=await su({includeDeleted:!0});if(t.totalTimestamps===0){if(t.invalidRows>0)throw new Error(`export-invalid-data: ${t.invalidRows} stored rows failed validation`);return e?.silent||l("Skipping export: no timestamps to back up"),"skipped"}let n=gt();if(!n.accessToken)throw new Error("unauthorized");let r=await yu(n.accessToken);return await km(t.filename,t.json,r,n.accessToken),l(`Exported backup to Google Drive (${t.filename}) with ${t.totalVideos} videos / ${t.totalTimestamps} timestamps.`),"uploaded"}async function Su(){try{let[e,t,n]=await Promise.all([qo("lastAutoBackupAt"),qo("autoBackupEnabled"),qo("autoBackupIntervalMinutes")]),r=ki.partial().safeParse({autoBackupEnabled:t,autoBackupIntervalMinutes:n,lastAutoBackupAt:typeof e=="number"&&e>0?e:null});r.success?(typeof r.data.autoBackupEnabled=="boolean"&&Ni(r.data.autoBackupEnabled),typeof r.data.autoBackupIntervalMinutes=="number"&&zi(r.data.autoBackupIntervalMinutes),typeof r.data.lastAutoBackupAt=="number"&&Gi(r.data.lastAutoBackupAt)):l("Failed to validate auto backup settings:",r.error.message,"warn")}catch(e){l("Failed to load auto backup settings:",e,"error")}}async function ka(){try{let e=$e().auth,t={autoBackupEnabled:e.autoBackupEnabled,autoBackupIntervalMinutes:e.autoBackupIntervalMinutes,lastAutoBackupAt:e.lastAutoBackupAt},n=ki.safeParse(t);if(!n.success){l("Invalid auto backup settings, cannot save",{settings:t,errors:n.error.message},"error");return}await Promise.all([Vo("autoBackupEnabled",e.autoBackupEnabled),Vo("autoBackupIntervalMinutes",e.autoBackupIntervalMinutes),Vo("lastAutoBackupAt",e.lastAutoBackupAt)])}catch(e){l("Failed to save auto backup settings:",e,"error")}}function Em(){ni&&(clearInterval(ni),ni=null),Ye&&(clearTimeout(Ye),Ye=null)}function zn(e){try{let t=new Date(e),n=new Date,r=t.toDateString()===n.toDateString(),a=t.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return r?a:`${t.toLocaleDateString()} ${a}`}catch{return""}}function ga(){let e=bm();return e.length>0?`Destinations: ${e.join(", ")}`:"No backup destination configured"}function xu(){let e=$e().auth;return e.autoBackupEnabled?e.isAutoBackupRunning?"#4285f4":e.autoBackupBackoffMs&&e.autoBackupBackoffMs>0?"#ffa500":co()&&e.lastAutoBackupAt?"#52c41a":co()?"#ffa500":"#ff4d4f":"#ff4d4f"}function Ae(){if(ii(),!re)return;let e=$e().auth;if(!e.autoBackupEnabled)j(re,"refresh","Backup: Off"),re.onmouseenter=null,re.onmouseleave=null;else if(e.isAutoBackupRunning)j(re,"refresh","Backing up\u2026"),re.onmouseenter=null,re.onmouseleave=null;else if(e.autoBackupBackoffMs&&e.autoBackupBackoffMs>0){let n=Math.ceil(e.autoBackupBackoffMs/6e4);j(re,"alert-triangle",`Retry in ${n}m`),re.onmouseenter=null,re.onmouseleave=null}else if(!co())j(re,"alert-triangle","Backup target missing"),re.onmouseenter=null,re.onmouseleave=null;else if(e.lastAutoBackupAt){let n=e.lastAutoBackupAt,r=n+Math.max(1,Gt())*60*1e3,a=zn(r);re.onmouseenter=()=>{j(re,"database",`Next backup: ${a}`)},re.onmouseleave=()=>{j(re,"database",`Last backup: ${zn(n)}`)},j(re,"database",`Last backup: ${zn(n)}`)}else{let n=Date.now()+Math.max(1,Gt())*60*1e3,r=zn(n);re.onmouseenter=()=>{j(re,"database",`Next backup: ${r}`)},re.onmouseleave=()=>{j(re,"database","Last backup: never")},j(re,"database","Last backup: never")}re.style.display="inline";let t=xu();re.style.color=t}var va="ytls-backup-indicator--pulsing",Mm="#4285f4",lo=null;function Im(e,t){lo&&(e.removeEventListener("animationiteration",lo),lo=null),t===Mm?(e.style.backgroundColor=t,e.classList.add(va)):e.classList.contains(va)?(lo=()=>{_n&&(_n.classList.remove(va),_n.style.backgroundColor=t,lo=null)},e.addEventListener("animationiteration",lo,{once:!0})):e.style.backgroundColor=t}function ii(){if(!_n)return;let e=Fo()?.color??xu();Im(_n,e),Ge(_n,()=>{let t=Fo();if(t)return t.tooltip;let n=$e().auth,r="";if(!n.autoBackupEnabled)r="Auto backup is disabled";else if(n.isAutoBackupRunning)r="Backup in progress";else if(n.autoBackupBackoffMs&&n.autoBackupBackoffMs>0)r=`Retrying backup in ${Math.ceil(n.autoBackupBackoffMs/6e4)}m`;else if(!co())r=ga();else if(n.lastAutoBackupAt){let a=n.lastAutoBackupAt+Math.max(1,Gt())*60*1e3,o=zn(a);r=`Last backup: ${zn(n.lastAutoBackupAt)}
Next backup: ${o}
${ga()}`}else{let a=Date.now()+Math.max(1,Gt())*60*1e3;r=`No backup yet
Next backup: ${zn(a)}
${ga()}`}return r})}async function jo(e={}){let{silent:t=!0,skipBackoff:n=!1}=e;if(!co()){t||(Ae(),ri()||ym());return}if(Ye){if(!n){l("Auto backup: backoff in progress, skipping scheduled run");return}clearTimeout(Ye),Ye=null,no(null),l("Auto backup: manual run cleared backoff and will proceed immediately")}if(!$e().auth.isAutoBackupRunning){_i(!0),Ae();try{await Am({silent:t})==="uploaded"&&Gi(Date.now()),Vr(0),no(null),Ye&&(clearTimeout(Ye),Ye=null),await ka()}catch(r){if(l("Auto backup failed:",r,"error"),r.message==="unauthorized"){l("Auth error detected, clearing token and stopping retries",null,"warn");let o=gt();It({...o,accessToken:null,isSignedIn:!1}),await Wo(),nt("error","Authorization expired. Please sign in again."),Ae(),Vr(0),no(null),Ye&&(clearTimeout(Ye),Ye=null)}else if($e().auth.autoBackupRetryAttempts<eu){let o=$e().auth.autoBackupRetryAttempts+1;Vr(o);let s=Math.min(gm*Math.pow(2,o-1),vm);no(s),Ye&&clearTimeout(Ye),Ye=setTimeout(()=>{jo({silent:!0})},s),l(`Scheduling backup retry ${o}/${eu} in ${Math.round(s/1e3)}s`),Ae()}else no(null)}finally{_i(!1),Ae()}}}async function Tn(e=!1){if(Em(),!!$o()&&co()){if(ni=setInterval(()=>{jo({silent:!0})},Math.max(1,Gt())*60*1e3),!e){let t=Date.now(),n=Math.max(1,Gt())*60*1e3,r=$e().auth.lastAutoBackupAt;(!r||t-r>=n)&&jo({silent:!0})}Ae()}}async function Tu(){let e=$o();Ni(!e),await ka(),await Tn(),Ae()}async function ku(){let e=Gt(),t=prompt("Set Auto Backup interval (minutes):",String(e));if(t===null)return;let n=Math.floor(Number(t));if(!Number.isFinite(n)||n<5||n>1440){alert("Please enter a number between 5 and 1440 minutes.");return}zi(n),await ka(),await Tn(),Ae()}function Aa(e,t){return Yt(e).then(n=>n!==void 0?n:t)}function Ea(e,t){return yn(e,t),Promise.resolve()}var Ma=window.location.hash;if(Ma&&Ma.length>1){let e=new URLSearchParams(Ma.substring(1));if(e.get("state")==="timekeeper_auth"){let n=e.get("access_token");if(n){console.log("[Timekeeper] Auth token detected in URL, broadcasting token"),console.log("[Timekeeper] Token length:",n.length,"characters");try{let r=new BroadcastChannel("timekeeper_oauth"),a={type:"timekeeper_oauth_token",token:n};console.log("[Timekeeper] Sending auth message via BroadcastChannel:",{type:a.type,tokenLength:n.length}),r.postMessage(a),r.close(),console.log("[Timekeeper] Token broadcast via BroadcastChannel completed")}catch(r){console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",r);let a={type:"timekeeper_oauth_token",token:n,timestamp:Date.now()},o=indexedDB.open("ytls-timestamps-db",4);o.onsuccess=()=>{let c=o.result,s=c.transaction("settings","readwrite");s.objectStore("settings").put({key:"oauth_message",value:a}),s.oncomplete=()=>{console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",a.timestamp),c.close()}}}if(history.replaceState){let r=window.location.pathname+window.location.search;history.replaceState(null,"",r)}throw console.log("[Timekeeper] Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}if(Vc())throw new Error("OAuth window closed");Ql();Jl()||Xl();(async function(){"use strict";if(window.top!==window.self)return;function e(i){return Aa(i,void 0)}function t(i,u){return Ea(i,u)}xa(e),Sa(t);try{let i=await Yt("device_id"),u=typeof i=="string"&&i.length>0?i:crypto.randomUUID();await yn("device_id",u),l(`Lamport: device_id = ${u}`)}catch(i){l("Lamport: failed to initialize device_id:",i,"warn")}if(await hu()){l("OAuth popup detected, broadcasting token and closing");return}await Ta();let r=["/watch","/live"];function a(i=window.location.href){try{let u=new URL(i);return u.origin!=="https://www.youtube.com"?!1:r.some(d=>u.pathname===d||u.pathname.startsWith(`${d}/`))}catch(u){return l("Timekeeper failed to parse URL for support check:",u,"error"),!1}}let o=null,c=null,s=null,g=null,m=null,h=null,f=(()=>{try{let i=parseFloat(localStorage.getItem("ytls-last-speed")??"");return Number.isFinite(i)&&i>0&&i!==1?Math.min(i,4):2}catch{return 2}})(),y=!1,E=null,M=null,z=250,q=null;function V(){return $e().ui.minPaneHeight}function ee(i){zl(i)}function N(i){Gl(i)}function $(){return $e().ui.urlChangeHandlersSetup}function le(i){Fl(i)}function me(){return $e().ui.panePosition}function te(i){_l(i)}function G(i){Ul(i)}function D(){return o?o.getBoundingClientRect():null}function ve(i,u,d){i&&te({x:Math.round(typeof u=="number"?u:i.left),y:Math.round(typeof d=="number"?d:i.top),width:Math.round(i.width),height:Math.round(i.height)})}function ie(i=!0){if(!o)return;Un();let u=D();if(u&&(u.width||u.height)&&(ve(u),i)){let d=me();fr("windowPosition",d),An({type:"window_position_updated",position:d,timestamp:Date.now()})}}function be(){if(!o||!c||!g||!s)return;let i=40,u=Re();if(u.length>0)i=u[0].offsetHeight;else{let d=document.createElement("li");d.style.visibility="hidden",d.style.position="absolute",d.textContent="00:00 Example",s.appendChild(d),i=d.offsetHeight,s.removeChild(d)}z=c.offsetHeight+g.offsetHeight+i,ee(z),o.style.minHeight=V()+"px"}function yt(){requestAnimationFrame(()=>{Pe?.(),be(),ie(!0)})}function Ue(i=450){Me&&(clearTimeout(Me),Me=null),Me=setTimeout(()=>{Ee(),yt(),Me=null},i)}function Ne(){Me&&(clearTimeout(Me),Me=null)}function Se(){s&&(s.style.visibility="hidden",l("Hiding timestamps during show animation")),yt(),Ue()}function ce(){Ee(),Ne(),wt&&(clearTimeout(wt),wt=null),wt=setTimeout(()=>{o&&(o.style.display="none",Qa(),wt=null)},400)}function Ee(){if(!s){ot&&(ot(),ot=null,Vt=null,Mn=null);return}if(!Mn){s.style.visibility==="hidden"&&(s.style.visibility="",l("Restoring timestamp visibility (no deferred fragment)")),ot&&(ot(),ot=null,Vt=null);return}l("Appending deferred timestamps after animation"),s.appendChild(Mn),Mn=null,an(),sn(),s.style.visibility==="hidden"&&(s.style.visibility="",l("Restoring timestamp visibility after append")),ot&&(ot(),ot=null,Vt=null),Rt(),qe(),Pe&&requestAnimationFrame(Pe),Tt(!0)}let ue=null,De=!1,xe="ytls-timestamp-pending-delete",Te="ytls-timestamp-highlight";async function Ve(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(i=>setTimeout(i,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(i=>setTimeout(i,100));await new Promise(i=>setTimeout(i,200))}let ze=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],de=5e3,st=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function Ft(i){return st.has(i)}function ke(){return document.querySelector("video")}let lt=null;function J(){if(lt&&document.contains(lt))return lt;let i=document.getElementById("movie_player");return i&&document.contains(i)?i:null}function tn(i){return(Math.round(i*100)/100).toFixed(2).replace(/\.0+?$|(?<=\.[0-9])0+$/g,"")}function kn(i){let u=i===1?2:i;f=u;try{localStorage.setItem("ytls-last-speed",String(u))}catch{}}function Ct(i){if(!h)return;let u=typeof i=="number"?i:ke()?.playbackRate??1,d=tn(u);h.dataset.speed!==d&&(h.dataset.speed=d,h.textContent=`${d}x`,h.setAttribute("aria-label",`Playback speed ${d}x`)),Math.abs(u-1)>.01?h.classList.add("ytls-playback-speed-active"):h.classList.remove("ytls-playback-speed-active")}function po(i){let u=J(),d=ke();if(y=!0,u&&typeof u.setPlaybackRate=="function")u.setPlaybackRate(i);else if(d)d.playbackRate=i;else return y=!1,!1;return Ct(i),!0}function Ia(){let i=ke()?.playbackRate;return Number.isFinite(i)?po(Math.abs(i-1)<=.001?f:1):!1}function Au(i){return i instanceof Element?!!i.closest('input, textarea, select, [contenteditable], [role="textbox"]'):!1}function ai(i){return ze.every(u=>typeof i?.[u]=="function"?!0:Ft(u)?!!ke():!1)}function Eu(i){return ze.filter(u=>typeof i?.[u]=="function"?!1:Ft(u)?!ke():!0)}async function Mu(i=de){let u=Date.now();for(;Date.now()-u<i;){let w=J();if(ai(w))return w;await new Promise(S=>setTimeout(S,100))}let d=J();return ai(d),d}let La="timestampOffsetSeconds",Iu=-5,Ca="shiftClickTimeSkipSeconds",Lu=10,si=300,li=300,Bt=null;function Ba(){try{return new URL(window.location.href).origin==="https://www.youtube.com"}catch{return!1}}function Ra(){if(Ba()&&!Bt)try{Bt=new BroadcastChannel("ytls_timestamp_channel"),Bt.onmessage=Da}catch(i){l("Failed to create BroadcastChannel:",i,"warn"),Bt=null}}function An(i){if(!Ba()){l("Skipping BroadcastChannel message: not on https://www.youtube.com","warn");return}if(Ra(),!Bt){l("No BroadcastChannel available to post message","warn");return}try{Bt.postMessage(i)}catch(u){l("BroadcastChannel error, reopening:",u,"warn");try{Bt=new BroadcastChannel("ytls_timestamp_channel"),Bt.onmessage=Da,Bt.postMessage(i)}catch(d){l("Failed to reopen BroadcastChannel:",d,"error")}}}function Da(i){if(l("Received message from another tab:",i.data),!(!a()||!s||!o)&&i.data){if(i.data.type==="timestamps_updated"&&i.data.videoId===Be)l("Debouncing timestamp load due to external update for video:",i.data.videoId),clearTimeout(fo),fo=setTimeout(()=>{l("Reloading timestamps due to external update for video:",i.data.videoId),pr()},500);else if(i.data.type==="window_position_updated"&&o){let u=i.data.position;if(u&&typeof u.x=="number"&&typeof u.y=="number"){o.style.left=`${u.x}px`,o.style.top=`${u.y}px`,o.style.right="auto",o.style.bottom="auto",typeof u.width=="number"&&u.width>0&&(o.style.width=`${u.width}px`),typeof u.height=="number"&&u.height>0&&(o.style.height=`${u.height}px`);let d=o.getBoundingClientRect();te({x:Math.round(u.x),y:Math.round(u.y),width:Math.round(d.width),height:Math.round(d.height)});let w=document.documentElement.clientWidth,S=document.documentElement.clientHeight;(d.left<0||d.top<0||d.right>w||d.bottom>S)&&Un()}}}}Ra();let Gn=await Aa(La);(typeof Gn!="number"||Number.isNaN(Gn))&&(Gn=Iu,await Ea(La,Gn));let mo=await Aa(Ca);(typeof mo!="number"||Number.isNaN(mo))&&(mo=Lu,await Ea(Ca,mo));let fo=null,Ut=new Map,En=!1,O=null,Ko=null,Be=null,wt=null,Me=null,bt=null,Xe=null,nn=null,ci=!1,Pe=null,Mn=null,Vt=null,ot=null,on=null,Yo=!1,ui=!1,Xo=null,Jo=null,Qo=null,Zo=null,er=null,tr=null,nr=null,or=null,ho=null,go=null,vo=null,St=null,xt=null,Pa=0,yo=!1,In=null,wo=null,Fn=null,Oa=null,bo=null;function Ln(){if(!s)return{items:[],starts:[],rawTimes:[]};if(Oa!==s||!bo?(bo?.disconnect(),bo=new MutationObserver(()=>{Fn=null}),bo.observe(s,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-time"]}),Oa=s,Fn=null):bo.takeRecords().length>0&&(Fn=null),!Fn){let i=_r(s),u=new Array(i.length),d=new Array(i.length);for(let w=0;w<i.length;w++){let S=i[w].querySelector("[data-time]")?.dataset.time;u[w]=S?Number.parseInt(S,10):NaN,d[w]=S?parseFloat(S):0}Fn={items:i,starts:u,rawTimes:d}}return Fn}function Re(){return Ln().items}function di(){return Ol(s)}function rn(){return wo!==null||(wo=Hl(s)),wo}function an(){wo=null}function rr(i=J(),u=ke()){let d=i?.getDuration?.();return Number.isFinite(d)&&d>0?d:Number.isFinite(u?.duration)&&u.duration>0?u.duration:0}function Ha(){return rr()||rn()}function Cu(i){let u=i.querySelector(".time-diff");return u?(u.textContent?.trim()||"").startsWith("-"):!1}let Bu="\u251C\u2500 ",Na="\u2514\u2500 ",za=/^[├└]─\s/;function ir(i){return za.test(i)}function _a(i){return i.replace(za,"")}function Ga(i){let u=Re();if(i>=u.length-1)return Na;let S=u[i+1].querySelector("input");return S&&ir(S.value)?Bu:Na}function Ru(i,u){return`${Ga(u)}${i}`}function Rt(){if(!s)return;Re().forEach((u,d)=>{let w=u.querySelector("input");if(!w||!ir(w.value))return;let S=_a(w.value),A=Ru(S,d);w.value!==A&&(w.value=A)})}function So(){Gr(s),Mn&&(Mn=null),ot&&(ot(),ot=null,Vt=null)}function xo(){Pl(s,De)}function Fa(i){Hi(s,i)}function pi(){Bl(s)}function mi(i){if(!(!o||!s)){if(De=i,i)o.style.display="",o.classList.remove("ytls-fade-out"),o.classList.add("ytls-fade-in"),Fa("Loading timestamps...");else if(pi(),o.style.display="",o.classList.remove("ytls-fade-out"),o.classList.add("ytls-fade-in"),m){let u=J();if(u){let d=u.getCurrentTime(),w=Number.isFinite(d)?Math.max(0,Math.floor(d)):Math.max(0,rn()),S=s?Ln().rawTimes:[];m.textContent=Dr(w,S,rr(u))}}!De&&s&&!Po(s)&&xo(),qt()}}function ar(i,u){i.dataset.time=String(u),i.textContent=hn(u,Ha())}let sr=null,lr=null,Dt=!1;function Ua(i,u){if(!i||typeof i.getVideoData!="function"||!(u!==void 0?u:!!i.getVideoData()?.isLive))return!1;if(typeof i.getProgressState=="function"){let w=i.getProgressState(),S=Number(w?.seekableEnd??w?.liveHead??w?.head??w?.duration),A=Number(w?.current??i.getCurrentTime?.());if(Number.isFinite(S)&&Number.isFinite(A))return S-A>2}return!1}function Du(i,u){if(!Number.isFinite(i))return;let d=Va(i);fi(d,u)}function Tt(i=!1,u){if(En&&!i)return;let d;if(typeof u=="number"&&Number.isFinite(u))d=Math.max(0,Math.floor(u));else{let w=J(),S=w?w.getCurrentTime():NaN;d=Number.isFinite(S)?Math.max(0,Math.floor(S)):Math.max(0,rn())}Number.isFinite(d)&&Du(d,i)}function Va(i){if(!Number.isFinite(i))return null;let{items:u,starts:d}=Ln(),w=-1,S=-1/0;for(let A=0;A<d.length;A++){let T=d[A];T<=i&&T>S&&(S=T,w=A)}return w>=0?u[w]:null}function fi(i,u=!1){let d=s?s.getElementsByClassName(Te):null;if(!(!!d&&(i?d.length===1&&d[0]===i:d.length===0))&&d)for(let S of Array.from(d))S.classList.contains(xe)||S.classList.remove(Te);if(i&&!i.classList.contains(xe)&&(i.classList.add(Te),u))try{if(s instanceof HTMLElement){let S=i.getBoundingClientRect(),A=s.getBoundingClientRect();!(S.bottom<A.top||S.top>A.bottom)||i.scrollIntoView({behavior:"smooth",block:"center"})}else i.scrollIntoView({behavior:"smooth",block:"center"})}catch{try{i.scrollIntoView({behavior:"smooth",block:"center"})}catch{}}}function Pu(i){if(kt()||!Number.isFinite(i)||i===0)return!1;let u=Re();if(u.length===0)return!1;let d=[];return u.forEach(w=>{let S=w.querySelector("[data-time]"),A=S?.dataset.time;if(!S||!A)return;let T=Number.parseInt(A,10);if(!Number.isFinite(T))return;let x=Math.max(0,T+i);if(x!==T){ar(S,x);let L=w.dataset.guid;L&&d.push({guid:L,start:x,comment:w.querySelector("input")?.value??""})}}),d.length===0?!1:(sn(),Rt(),qe(),hi(),Wa(Be,d),In=null,!0)}function qa(i,u={}){if(!Number.isFinite(i)||i===0)return!1;if(!Pu(i)){if(u.alertOnNoChange){let T=u.failureMessage??"Offset did not change any timestamps.";alert(T)}return!1}let w=u.logLabel??"bulk offset";l(`Timestamps changed: Offset all timestamps by ${i>0?"+":""}${i} seconds (${w})`);let S=J(),A=S?Math.floor(S.getCurrentTime()):0;if(Number.isFinite(A)){let T=Va(A);fi(T,!1)}return!0}function ja(i){if(!s||De)return;let u=i.target instanceof Element?i.target:null;if(!u)return;let d=u.closest("[data-time]"),w=u.closest("[data-increment]"),S=u.closest("[data-action]");if(d?.dataset.time){i.preventDefault();let A=Number(d.dataset.time);if(Number.isFinite(A)){l(`Seeking to timestamp ${A}`),Dt=!0;let x=J();x&&x.seekTo(A),setTimeout(()=>{Dt=!1},500)}let T=d.closest("li");T&&(Re().forEach(x=>{x.classList.contains(xe)||x.classList.remove(Te)}),T.classList.contains(xe)||(T.classList.add(Te),T.scrollIntoView({behavior:"smooth",block:"center"})))}else if(w?.dataset.increment){i.preventDefault();let A=w.closest("li"),T=A?.querySelector("[data-time]");if(!T||!T.dataset.time)return;let x=parseInt(T.dataset.time,10),L=parseInt(w.dataset.increment,10);if("shiftKey"in i&&i.shiftKey&&(L*=mo),"altKey"in i?i.altKey:!1){qa(L,{logLabel:"Alt adjust"});return}let F=Math.max(0,x+L);if(l(`Timestamps changed: Timestamp time incremented from ${x} to ${F}`),an(),ar(T,F),lr=F,sr&&clearTimeout(sr),Dt=!0,sr=setTimeout(()=>{if(lr!==null){let oe=J();oe&&oe.seekTo(lr)}sr=null,lr=null,setTimeout(()=>{Dt=!1},500)},500),sn(),Rt(),qe(),A){let oe=A.querySelector("input"),ye=A.dataset.guid;oe&&ye&&(dr(Be,ye,F,oe.value),In=ye)}}else S?.dataset.action==="clear"&&(i.preventDefault(),l("Timestamps changed: All timestamps cleared from UI"),s.textContent="",an(),qe(),cr(),Nu(),G([]),Hu(Be),In=null,xo())}function To(i,u="",d=!1,w=null,S=!0){if(!s)return null;let A=Math.max(0,i),T=w??crypto.randomUUID(),x=document.createElement("li"),L=document.createElement("div"),C=document.createElement("span"),R=document.createElement("span"),F=document.createElement("span"),oe=document.createElement("div"),ye=document.createElement("span"),ct=document.createElement("span"),Q=document.createElement("input"),ae=document.createElement("button");x.dataset.guid=T,L.className="time-row",oe.className="ytls-row-controls";let Oe=document.createElement("div");Oe.style.cssText="position:absolute;left:0;top:0;width:20px;height:20px;display:flex;align-items:center;justify-content:center;cursor:pointer;",Ge(Oe,"Click to toggle indent");let rt=document.createElement("span");rt.style.cssText="color:#f4ba78;pointer-events:none;display:none;line-height:0;";let At=()=>{let U=Q.offsetTop,H=Q.offsetHeight||20;Oe.style.top=`${U}px`,Oe.style.height=`${H}px`},Pt=()=>{_e(rt,ir(Q.value)?"indent-decrease":"indent-increase",18)},Vn="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",ln=U=>{let H=rt.querySelector("svg");H&&(H.style.transition="filter 0.15s ease",H.style.filter=U?Vn:"none")},qn=U=>{U.stopPropagation();let H=ir(Q.value),pe=_a(Q.value),Z="";if(!H){let ut=Re().indexOf(x);Z=Ga(ut)}Q.value=Z?`${Z}${pe}`:pe,Pt(),Rt();let he=Number.parseInt(ye.dataset.time??"0",10);dr(Be,T,he,Q.value)};Oe.onclick=qn,Oe.append(rt),Oe.addEventListener("mouseenter",()=>{ln(!0)}),Oe.addEventListener("mouseleave",()=>{ln(!1)}),x.style.cssText="position:relative;padding-left:20px;",x.addEventListener("mouseenter",()=>{At(),Pt(),rt.style.display="inline"}),x.addEventListener("mouseleave",()=>{ln(!1),rt.style.display="none"}),x.addEventListener("mouseleave",()=>{x.dataset.guid===In&&Cu(x)&&$a()}),Q.value=u||"",Q.style.cssText="width:100%;margin-top:5px;display:block;",Q.type="text",Q.setAttribute("inputmode","text"),Q.autocapitalize="off",Q.autocomplete="off",Q.spellcheck=!1,requestAnimationFrame(At);let Ao=!1;Q.addEventListener("focusin",()=>{yo=!1,Ao=!1}),Q.addEventListener("focusout",U=>{let H=U.relatedTarget,pe=Date.now()-Pa<250,Z=!!H&&!!o&&o.contains(H);!pe&&!Z&&!Ao&&(yo=!0,setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(Q.focus({preventScroll:!0}),yo=!1)},0))}),Q.addEventListener("keydown",U=>{(U.key==="Escape"||U.key==="Esc")&&(U.preventDefault(),Ao=!0,Q.blur())});let Eo=U=>{let H=Ut.get(T);H&&clearTimeout(H.timeoutId);let pe=Be,Z=()=>{let he=Ut.get(T);he&&(clearTimeout(he.timeoutId),Ut.delete(T)),Ka(pe,T,Number.parseInt(ye.dataset.time??"0",10),Q.value)};Ut.set(T,{timeoutId:setTimeout(Z,U),flush:Z})};Q.addEventListener("input",U=>{let H=U;H&&(H.isComposing||H.inputType==="insertCompositionText")||Eo(500)}),Q.addEventListener("compositionend",()=>{Eo(50)});let jt="#f4ba78",hr="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",gr="#c8452d",vr="drop-shadow(0 0 4px #e36a52) drop-shadow(0 0 8px #e36a52)",Bn=(U,H=jt,pe=hr)=>{U.style.color=H;let Z=U.querySelector("svg");Z&&(Z.style.transition="filter 0.15s ease"),U.addEventListener("mouseenter",()=>{Z&&(Z.style.filter=pe)}),U.addEventListener("mouseleave",()=>{Z&&(Z.style.filter="none")})};_e(C,"circle-minus",18),C.classList.add("ytls-row-control"),C.dataset.increment="-1",C.style.cursor="pointer",C.style.margin="0px",Bn(C),_e(F,"circle-plus",18),F.classList.add("ytls-row-control"),F.dataset.increment="1",F.style.cursor="pointer",F.style.margin="0px",Bn(F),_e(R,"current-location",18),R.classList.add("ytls-row-control"),R.style.cursor="pointer",R.style.margin="0px",Ge(R,"Set to current playback time"),Bn(R),R.onclick=()=>{let U=J(),H=U?Math.floor(U.getCurrentTime()):0;Number.isFinite(H)&&(l(`Timestamps changed: set to current playback time ${H}`),an(),ar(ye,H),sn(),Rt(),dr(Be,T,H,Q.value),In=T)},an(),ar(ye,A),ye.addEventListener("click",U=>{U.preventDefault(),U.stopPropagation();let H=Number(ye.dataset.time);if(!Number.isFinite(H))return;l(`Seeking to timestamp ${H}`),Dt=!0;let pe=J();pe&&pe.seekTo(H);let Z=ke();Z?.paused&&Z.play(),setTimeout(()=>{Dt=!1},500),s?.querySelectorAll(`.${Te}`).forEach(he=>he.classList.remove(Te)),x.classList.contains(xe)||(x.classList.add(Te),x.scrollIntoView({behavior:"smooth",block:"center"}))}),_e(ae,"trash",16),ae.classList.add("ytls-row-control"),ae.style.cssText="background:transparent;border:none;cursor:pointer;margin-left:5px;display:inline-flex;align-items:center;",Bn(ae,gr,vr),ae.onclick=()=>{let U=null,H=null,pe=null,Z=()=>{try{x.removeEventListener("click",H,!0)}catch{}try{document.removeEventListener("click",H,!0)}catch{}if(s)try{s.removeEventListener("mouseleave",pe)}catch{}U&&(clearTimeout(U),U=null)};if(x.dataset.deleteConfirmed==="true"){l("Timestamps changed: Timestamp deleted");let he=x.dataset.guid??"",je=Ut.get(he);je&&(clearTimeout(je.timeoutId),Ut.delete(he)),Z(),x.remove(),an(),sn(),Rt(),qe(),cr(),zu(Be,he),In=null,xo()}else{x.dataset.deleteConfirmed="true",x.classList.add(xe),x.classList.remove(Te);let he=()=>{x.dataset.deleteConfirmed="false",x.classList.remove(xe);let je=J(),ut=je?je.getCurrentTime():0,Ot=Number.parseInt(x.querySelector("[data-time]")?.dataset.time??"0",10);Number.isFinite(ut)&&Number.isFinite(Ot)&&ut>=Ot&&x.classList.add(Te),Z()};H=je=>{je.target!==ae&&he()},pe=()=>{x.dataset.deleteConfirmed==="true"&&he()},x.addEventListener("click",H,!0),document.addEventListener("click",H,!0),s&&s.addEventListener("mouseleave",pe),U=setTimeout(()=>{x.dataset.deleteConfirmed==="true"&&he(),Z()},5e3)}},ct.className="time-diff",ct.style.color="#888",ct.style.marginLeft="5px",oe.append(C,R,F,ae),L.append(ye,oe,ct),x.append(Oe,L,Q);let yr=Number.parseInt(ye.dataset.time??"0",10);if(S){pi();let U=!1,H=Re();for(let pe=0;pe<H.length;pe++){let Z=H[pe],je=Z.querySelector("[data-time]")?.dataset.time;if(!je)continue;let ut=Number.parseInt(je,10);if(Number.isFinite(ut)&&yr<ut){s.insertBefore(x,Z),U=!0;break}}U||s.appendChild(x),x.scrollIntoView({behavior:"smooth",block:"center"}),an(),sn(),cr(),Rt(),qe(),d||(dr(Be,T,A,u),In=T,fi(x,!1))}else Q.__ytls_li=x;return Q}function sn(){if(kt())return;let i=Ha(),u=Re();u.forEach((d,w)=>{let S=d.querySelector(".time-diff"),A=d.querySelector("[data-time]"),T=A?.dataset.time;if(A&&T){let ct=Number.parseInt(T,10);Number.isFinite(ct)&&(A.textContent=hn(ct,i))}if(!S)return;if(!T){S.textContent="";return}let x=Number.parseInt(T,10);if(!Number.isFinite(x)){S.textContent="";return}if(w===0){S.textContent="";return}let R=u[w-1].querySelector("[data-time]")?.dataset.time;if(!R){S.textContent="";return}let F=Number.parseInt(R,10);if(!Number.isFinite(F)){S.textContent="";return}let oe=x-F,ye=oe<0?"-":"";S.textContent=` ${ye}${hn(Math.abs(oe))}`})}function $a(){if(kt())return;let i=null;if(document.activeElement instanceof HTMLInputElement&&s.contains(document.activeElement)){let T=document.activeElement,L=T.closest("li")?.dataset.guid;if(L){let C=T.selectionStart??T.value.length,R=T.selectionEnd??C,F=T.scrollLeft;i={guid:L,start:C,end:R,scroll:F}}}let u=Re();if(u.length===0)return;let d=u.map(T=>T.dataset.guid),w=u.map(T=>{let x=T.querySelector("[data-time]"),L=x?.dataset.time;if(!x||!L)return null;let C=Number.parseInt(L,10);if(!Number.isFinite(C))return null;let R=T.dataset.guid??"";return{time:C,guid:R,element:T}}).filter(T=>T!==null).sort((T,x)=>{let L=T.time-x.time;return L!==0?L:T.guid.localeCompare(x.guid)}),S=w.map(T=>T.guid),A=d.length!==S.length||d.some((T,x)=>T!==S[x]);if(s.replaceChildren(),w.forEach(T=>{s.appendChild(T.element)}),sn(),Rt(),qe(),i){let x=Re().find(L=>L.dataset.guid===i.guid)?.querySelector("input");if(x)try{x.focus({preventScroll:!0})}catch{}}A&&(l("Timestamps changed: Timestamps sorted"),hi())}function cr(){if(!s||!o||!c||!g)return;let i=Re().length;Pe?.();let u=o.getBoundingClientRect(),d=c.getBoundingClientRect(),w=g.getBoundingClientRect(),S=Math.max(0,u.height-(d.height+w.height));i===0?(xo(),s.style.overflowY="hidden"):s.style.overflowY=s.scrollHeight>S?"auto":"hidden"}function qe(){if(!s)return;let i=ke(),u=document.querySelector(".ytp-progress-bar"),d=J(),w=d?d.getVideoData():null,S=!!w&&!!w.isLive;if(!i||!u||!isFinite(i.duration)||S)return;Xa();let{items:A,starts:T}=Ln(),x=i.duration,L=document.createDocumentFragment();A.forEach((C,R)=>{let F=T[R];if(!Number.isFinite(F))return;C.dataset.guid||(C.dataset.guid=crypto.randomUUID());let oe=document.createElement("div");oe.className="ytls-marker",oe.style.left=F/x*100+"%",oe.dataset.time=String(F),L.appendChild(oe)}),u.appendChild(L),Ou(u)}function Ou(i){i.dataset.ytlsMarkerClicks||(i.dataset.ytlsMarkerClicks="1",i.addEventListener("click",u=>{let d=u.target?.closest?.(".ytls-marker");if(!d)return;let w=Number(d.dataset.time),S=J();S&&Number.isFinite(w)&&S.seekTo(w)}))}function hi(){G(di().sort((i,u)=>i.start-u.start))}function Wa(i,u){!i||u.length===0||De||kt()||(ju(i,u).then(()=>{l(`Saved ${u.length} timestamps for ${i} to IndexedDB`),s&&ko()}).catch(d=>{let w=`Failed to save timestamps: ${d.message}`;l(`Failed to save timestamps for ${i} to IndexedDB:`,d,"error"),Cn(w)}),An({type:"timestamps_updated",videoId:i,action:"saved"}))}function Hu(i){!i||De||kt()||(Ja(i).then(()=>{s&&ko()}).catch(u=>{let d=`Failed to clear timestamps: ${u.message}`;l(`Failed to clear timestamps for ${i}:`,u,"error"),Cn(d)}),An({type:"timestamps_updated",videoId:i,action:"saved"}))}function ur(){for(let{flush:i}of[...Ut.values()])i()}function Nu(){Ut.forEach(({timeoutId:i})=>clearTimeout(i)),Ut.clear()}function dr(i,u,d,w){!i||De||kt()||Ka(i,u,d,w)}function Ka(i,u,d,w){if(!i)return;let S={guid:u,start:d,comment:w};l(`Saving timestamp: guid=${u}, start=${d}, comment="${w}"`),$u(i,S).then(()=>{s&&ko()}).catch(A=>{let T=`Failed to save timestamp: ${A.message}`;l(`Failed to save timestamp ${u}:`,A,"error"),Cn(T)}),An({type:"timestamps_updated",videoId:i,action:"saved"})}function zu(i,u){!i||De||kt()||(Wu(i,u).then(()=>{s&&ko()}).catch(d=>{let w=`Failed to delete timestamp: ${d.message}`;l(`Failed to delete timestamp ${u}:`,d,"error"),Cn(w)}),An({type:"timestamps_updated",videoId:i,action:"saved"}))}async function Ya(i){if(kt()){alert("Cannot export timestamps while an error is being displayed.");return}let u=Be;if(!u)return;l(`Exporting timestamps for video ID: ${u}`);let d=di(),w=Dn();if(i==="json"){let S=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),A=URL.createObjectURL(S),T=document.createElement("a");T.href=A,T.download=`timestamps-${u}-${w}.json`,T.click(),URL.revokeObjectURL(A)}else if(i==="text"){let S=Ai(d,!0),A=new Blob([S],{type:"text/plain"}),T=URL.createObjectURL(A),x=document.createElement("a");x.href=T,x.download=`timestamps-${u}-${w}.txt`,x.click(),URL.revokeObjectURL(T)}}function Cn(i){if(!o||!s){l("Timekeeper error:",i,"error");return}Rl(s,i),Fi(i),qe()}function ko(){s&&(Dl(s),Fi(null))}function kt(){return!!(!s||Po(s)||De||Vl()!==null)}function Xa(){document.querySelectorAll(".ytls-marker").forEach(i=>i.remove())}function Un(){if(!o||!document.body.contains(o))return;let i=o.getBoundingClientRect(),u=document.documentElement.clientWidth,d=document.documentElement.clientHeight,w=i.width,S=i.height;if(i.left<0&&(o.style.left="0",o.style.right="auto"),i.right>u){let A=Math.max(0,u-w);o.style.left=`${A}px`,o.style.right="auto"}if(i.top<0&&(o.style.top="0",o.style.bottom="auto"),i.bottom>d){let A=Math.max(0,d-S);o.style.top=`${A}px`,o.style.bottom="auto"}}function _u(){if(Xo&&(document.removeEventListener("mousemove",Xo),Xo=null),Jo&&(document.removeEventListener("mouseup",Jo),Jo=null),ho&&(document.removeEventListener("keydown",ho),ho=null),Qo&&(window.removeEventListener("resize",Qo),Qo=null),go&&(document.removeEventListener("pointerdown",go,!0),go=null),vo&&(document.removeEventListener("pointerup",vo,!0),vo=null),St){try{St.disconnect()}catch{}St=null}if(xt){try{xt.disconnect()}catch{}xt=null}let i=ke();i&&(Zo&&(i.removeEventListener("timeupdate",Zo),Zo=null),er&&(i.removeEventListener("pause",er),er=null),tr&&(i.removeEventListener("play",tr),tr=null),nr&&(i.removeEventListener("seeking",nr),nr=null),or&&(i.removeEventListener("ratechange",or),or=null))}function Gu(){Xa(),ur(),fo&&(clearTimeout(fo),fo=null),ue&&(clearInterval(ue),ue=null),wt&&(clearTimeout(wt),wt=null),_u(),rl();try{Bt.close()}catch{}if(O&&O.parentNode===document.body&&document.body.removeChild(O),O=null,Ko=null,En=!1,Be=null,St){try{St.disconnect()}catch{}St=null}if(xt){try{xt.disconnect()}catch{}xt=null}o&&o.parentNode&&o.remove();let i=document.getElementById("ytls-header-button");i&&i.parentNode&&i.remove(),on=null,Yo=!1,te(null),So(),o=null,c=null,s=null,g=null,Xe=null,nn=null,Pe=null,m=null,h=null,E=null,lt=null}async function Fu(){let i=mr();if(!i)return lt=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let u=await Mu();if(!ai(u)){let d=Eu(u),w=d.length?` Missing methods: ${d.join(", ")}.`:"",S=u?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return lt=null,{ok:!1,message:`${S}${w} Try refreshing once playback is ready.`}}return lt=u,{ok:!0,player:u,videoId:i}}async function pr(){if(!o||!s)return;let i=s.scrollTop,u=!0,d=()=>{if(!s||!u)return;let w=Math.max(0,s.scrollHeight-s.clientHeight);s.scrollTop=Math.min(i,w)};try{let w=await Fu();if(!w.ok){Cn(w.message),So(),qe();return}let{videoId:S}=w,A=[];try{let T=await Ku(S);T?(A=T.map(x=>({...x,guid:x.guid||crypto.randomUUID()})),l(`Loaded ${A.length} timestamps from IndexedDB for ${S}`),ko()):l(`No timestamps found in IndexedDB for ${S}`)}catch(T){let x=`Failed to load timestamps: ${T.message}`;l(`Failed to load timestamps from IndexedDB for ${S}:`,T,"error"),Cn(x),qe();return}if(A.length>0){A.sort((L,C)=>L.start-C.start),So(),pi();let T=document.createDocumentFragment();A.forEach(L=>{let R=To(L.start,L.comment,!0,L.guid,!1).__ytls_li;R&&T.appendChild(R)}),o&&o.classList.contains("ytls-zoom-in")&&Me!=null?(l("Deferring timestamp DOM append until show animation completes"),Mn=T,Vt||(Vt=new Promise(L=>{ot=L})),await Vt):s&&(s.appendChild(T),an(),sn(),Rt(),qe(),Pe&&requestAnimationFrame(Pe)),G(A),Tt(!0),u=!1}else So(),Fa("No timestamps for this video"),qe(),G([]),Pe&&requestAnimationFrame(Pe)}catch(w){l("Unexpected error while loading timestamps:",w,"error"),Cn("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{Vt&&await Vt,requestAnimationFrame(d),Pe&&requestAnimationFrame(Pe),s&&!Po(s)&&xo()}}function mr(){let u=new URLSearchParams(location.search).get("v");if(u)return u;let d=document.querySelector('meta[itemprop="identifier"]');return d?.content?d.content:null}function Uu(i=null,u=null){if(!m)return;let d=ke(),w=u||J();if(!d&&!w)return;let S=i!==null?i:w?w.getCurrentTime():0,A=Number.isFinite(S)?Math.max(0,Math.floor(S)):Math.max(0,rn()),{isLive:T}=w?w.getVideoData()||{isLive:!1}:{isLive:!1},x=w?Ua(w,!!T):!1,L=s?Ln().rawTimes:[];m.textContent=Dr(A,L,rr(w,d)),m.style.color=x?"#ff4d4f":""}function Vu(){let i=ke();if(!i)return;let u=NaN,d=null,w=()=>{if(!s)return;let C=J(),R=C?Math.floor(C.getCurrentTime()):0;if(!Number.isFinite(R))return;let F=Ln();if(R===u&&F===d)return;let oe=!!m&&!De&&!Dt;oe&&Uu(R,C),Tt(!1,R),oe&&!En&&(u=R,d=F)},S=C=>{try{let R=new URL(window.location.href);C!==null&&Number.isFinite(C)?R.searchParams.set("t",`${Math.floor(C)}s`):R.searchParams.delete("t"),window.history.replaceState(window.history.state,"",R.toString())}catch{}},A=()=>{let C=J(),R=C?C.getCurrentTime():NaN,F=Number.isFinite(R)?Math.max(0,Math.floor(R)):Math.max(0,rn());if(Number.isFinite(F)){S(F);try{Tt(!0)}catch(oe){l("Failed to highlight nearest timestamp on pause:",oe,"warn")}}},T=()=>{S(null);try{let C=J(),R=C?C.getCurrentTime():NaN,F=Number.isFinite(R)?Math.max(0,Math.floor(R)):Math.max(0,rn());Number.isFinite(F)&&Tt(!0)}catch(C){l("Failed to highlight nearest timestamp on play:",C,"warn")}},x=()=>{let C=ke();if(!C)return;let R=J(),F=R?Math.floor(R.getCurrentTime()):0;Number.isFinite(F)&&(C.paused&&S(F),Tt(!0,F))},L=()=>{let C=i.playbackRate;y?y=!1:kn(C),Ct(C)};Zo=w,er=A,tr=T,nr=x,or=L,i.addEventListener("timeupdate",w),i.addEventListener("pause",A),i.addEventListener("play",T),i.addEventListener("seeking",x),i.addEventListener("ratechange",L)}let{saveToIndexedDB:qu,saveRowsToIndexedDB:ju,saveSingleTimestampToIndexedDB:$u,deleteSingleTimestampFromIndexedDB:Wu,loadFromIndexedDB:Ku,removeFromIndexedDB:Ja,saveGlobalSettings:fr,loadGlobalSettings:gi,buildExportPayload:Yu,mergeBackupData:Xu,exportAllTimestamps:Ju,exportAllTimestampsCsv:Qu}=zr;function Qa(){if(!o)return;let i=o.style.display!=="none";fr("uiVisible",i)}function qt(i){let u=typeof i=="boolean"?i:!!o&&o.style.display!=="none",d=document.getElementById("ytls-header-button");d instanceof HTMLButtonElement&&d.setAttribute("aria-pressed",String(u)),on&&!Yo&&on.src!==Pr&&(on.src=Pr)}function Zu(){o&&gi("uiVisible").then(i=>{let u=Rn().safeParse(i),d=u.success?u.data:void 0;typeof d=="boolean"?(d?(o.style.display="flex",o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in")):o.style.display="none",qt(d)):(!u.success&&i!==void 0&&l("UI visibility state failed validation, defaulting to visible",u.error.message,"warn"),o.style.display="flex",o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in"),qt(!0))}).catch(i=>{l("Failed to load UI visibility state:",i,"error"),o.style.display="flex",o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in"),qt(!0)})}function vi(i){if(!o){l("ERROR: togglePaneVisibility called but pane is null");return}document.body.contains(o)||(l("Pane not in DOM during toggle, appending it"),document.querySelectorAll("#ytls-pane").forEach(S=>{S!==o&&S.remove()}),document.body.appendChild(o));let u=document.querySelectorAll("#ytls-pane");u.length>1&&(l(`ERROR: Multiple panes detected in togglePaneVisibility (${u.length}), cleaning up`),u.forEach(S=>{S!==o&&S.remove()})),wt&&(clearTimeout(wt),wt=null);let d=o.style.display==="none";(typeof i=="boolean"?i:d)?(o.style.display="flex",o.classList.remove("ytls-fade-out"),o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in"),qt(!0),Qa(),Se(),Me&&(clearTimeout(Me),Me=null),Me=setTimeout(()=>{Ee(),Pe?.(),be(),ie(!0);try{Tt(!0)}catch(S){l("Failed to scroll to nearest timestamp after toggle:",S,"warn")}Me=null},450)):(o.classList.remove("ytls-fade-in"),o.classList.remove("ytls-zoom-in"),o.classList.add("ytls-zoom-out"),qt(!1),ce())}function Za(i){if(!s){l("UI is not initialized; cannot import timestamps.","warn");return}let u=!1,d=[],w=(S,A)=>{let T=S.querySelector("input");if(!T)return;T.value=A;let x=S.dataset.guid,L=Number.parseInt(S.querySelector("[data-time]")?.dataset.time??"",10);x&&Number.isFinite(L)&&d.push({guid:x,start:L,comment:A})};try{let S=JSON.parse(i),A=null;if(Array.isArray(S))A=S;else if(typeof S=="object"&&S!==null){let T=Be;if(T){let x=`timekeeper-${T}`;S[x]&&Array.isArray(S[x].timestamps)&&(A=S[x].timestamps,l(`Found timestamps for current video (${T}) in export format`,"info"))}if(!A){let x=Object.keys(S).filter(L=>L.startsWith("ytls-"));if(x.length===1&&Array.isArray(S[x[0]].timestamps)){A=S[x[0]].timestamps;let L=S[x[0]].video_id;l(`Found timestamps for video ${L} in export format`,"info")}}}A&&Array.isArray(A)?A.every(x=>typeof x.start=="number"&&typeof x.comment=="string")?(A.forEach(x=>{if(x.guid){let L=Re().find(C=>C.dataset.guid===x.guid);L?w(L,x.comment):To(x.start,x.comment,!1,x.guid)}else To(x.start,x.comment,!1,crypto.randomUUID())}),u=!0):l("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):l("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!u){let S=i.split(`
`).map(A=>A.trim()).filter(A=>A);if(S.length>0){let A=!1;S.forEach(T=>{let x=T.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(x){A=!0;let L=parseInt(x[1])||0,C=parseInt(x[2]),R=parseInt(x[3]),F=L*3600+C*60+R,oe=x[4]?x[4].trim():"",ye=null,ct=oe,Q=oe.match(/<!--\s*guid:([^>]+?)\s*-->/);Q&&(ye=Q[1].trim(),ct=oe.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let ae;ye&&(ae=Re().find(Oe=>Oe.dataset.guid===ye)),!ae&&!ye&&(ae=Re().find(Oe=>{if(Oe.dataset.guid)return!1;let At=Oe.querySelector("[data-time]")?.dataset.time;if(!At)return!1;let Pt=Number.parseInt(At,10);return Number.isFinite(Pt)&&Pt===F})),ae?w(ae,ct):To(F,ct,!1,ye||crypto.randomUUID())}}),A&&(u=!0)}}u?(l("Timestamps changed: Imported timestamps from file/clipboard"),Rt(),hi(),Wa(Be,d),qe(),cr()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function ed(){if(ui){l("Pane initialization already in progress, skipping duplicate call");return}if(!(o&&document.body.contains(o))){ui=!0;try{let S=function(p=null,v=null){if(!m)return;let b=ke(),k=v||J();if(!b&&!k)return;let I=p!==null?p:k?k.getCurrentTime():0,W=Number.isFinite(I)?Math.max(0,Math.floor(I)):Math.max(0,rn()),{isLive:P}=k?k.getVideoData()||{isLive:!1}:{isLive:!1},_=k?Ua(k,!!P):!1,B=s?Ln().rawTimes:[];m.textContent=Dr(W,B,rr(k,b)),m.style.color=_?"#ff4d4f":"",w(!!P);try{Ct()}catch{}},A=function(){if(De||Dt)return;let p=J();if(!p)return;let v=p.getCurrentTime(),b=Number.isFinite(v)?Math.max(0,Math.floor(v)):Math.max(0,rn());S(b,p),(s?Re():[]).length>0&&Tt(!1,b)},ae=function(p,v,b,k){let I=document.createElement("button");return k?j(I,k,p):I.textContent=p,Ge(I,v),I.classList.add("ytls-settings-modal-button"),I.onclick=b,I},Oe=function(p="general"){if(O&&O.parentNode===document.body){let se=document.getElementById("ytls-save-modal"),mn=document.getElementById("ytls-load-modal"),Kt=document.getElementById("ytls-delete-all-modal");se&&document.body.contains(se)&&document.body.removeChild(se),mn&&document.body.contains(mn)&&document.body.removeChild(mn),Kt&&document.body.contains(Kt)&&document.body.removeChild(Kt),O.classList.remove("ytls-fade-in"),O.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(O)&&document.body.removeChild(O),O=null,document.removeEventListener("click",At,!0),document.removeEventListener("keydown",rt)},300);return}O=document.createElement("div"),O.id="ytls-settings-modal",O.classList.remove("ytls-fade-out"),O.classList.add("ytls-fade-in");let v=document.createElement("div");v.className="ytls-modal-header";let b=document.createElement("div");b.id="ytls-settings-nav";let k=document.createElement("button");k.className="ytls-modal-close-button",_e(k,"x",14),k.onclick=()=>{if(O&&O.parentNode===document.body){let se=document.getElementById("ytls-save-modal"),mn=document.getElementById("ytls-load-modal"),Kt=document.getElementById("ytls-delete-all-modal");se&&document.body.contains(se)&&document.body.removeChild(se),mn&&document.body.contains(mn)&&document.body.removeChild(mn),Kt&&document.body.contains(Kt)&&document.body.removeChild(Kt),O.classList.remove("ytls-fade-in"),O.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(O)&&document.body.removeChild(O),O=null,document.removeEventListener("click",At,!0),document.removeEventListener("keydown",rt)},300)}};let I=document.createElement("div");I.id="ytls-settings-content";let W=document.createElement("h3");W.className="ytls-section-heading",W.textContent="General",W.style.display="none";let P=document.createElement("div"),_=document.createElement("div");_.className="ytls-button-grid";let B=document.createElement("div");B.className="ytls-button-grid";function K(se){P.style.display=se==="general"?"block":"none",_.style.display=se==="google"?"block":"none",B.style.display=se==="sync"?"block":"none",fe.classList.toggle("active",se==="general"),Je.classList.toggle("active",se==="google"),Et.classList.toggle("active",se==="sync"),W.textContent=se==="general"?"General":se==="google"?"Google":"Sync"}let fe=document.createElement("button");fe.appendChild(Xn("adjustments-horizontal",16));let Ie=document.createElement("span");Ie.className="ytls-tab-text",Ie.textContent=" General",fe.appendChild(Ie),Ge(fe,"General settings"),fe.classList.add("ytls-settings-modal-button"),fe.onclick=()=>K("general");let Je=document.createElement("button");Je.appendChild(Xn("cloud",16));let un=document.createElement("span");un.className="ytls-tab-text",un.textContent=" Google",Je.appendChild(un),Ge(Je,"Google Drive backup settings"),Je.classList.add("ytls-settings-modal-button"),Je.onclick=async()=>{vt.isSignedIn&&await vu(),K("google")};let Et=document.createElement("button");Et.appendChild(Xn("server",16));let dn=document.createElement("span");dn.className="ytls-tab-text",dn.textContent=" Sync",Et.appendChild(dn),Ge(Et,"Live sync across devices"),Et.classList.add("ytls-settings-modal-button"),Et.onclick=()=>K("sync"),b.appendChild(fe),b.appendChild(Je),b.appendChild(Et),v.appendChild(b),v.appendChild(k),O.appendChild(v),P.className="ytls-button-grid",P.appendChild(ae("Save","Save As...",Pt.onclick,"device-floppy")),P.appendChild(ae("Load","Load",Vn.onclick,"folder-open")),P.appendChild(ae("Export All","Export All Data",ln.onclick,"file-export")),P.appendChild(ae("Import All","Import All Data",qn.onclick,"file-import")),P.appendChild(ae("Export All (CSV)","Export All Timestamps to CSV",async()=>{try{await Qu()}catch{alert("Failed to export CSV: Could not read from database.")}},"file-spreadsheet"));let $t=ae(vt.isSignedIn?"Sign Out":"Sign In",vt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{vt.isSignedIn?await gu():await fu(),j($t,vt.isSignedIn?"logout":"login",vt.isSignedIn?"Sign Out":"Sign In"),Ge($t,vt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),Ae()},vt.isSignedIn?"logout":"login"),Mo=ae($o()?"Auto Backup: On":"Auto Backup: Off","Toggle Auto Backup",async()=>{await Tu(),Ar(),Ae()},"refresh"),cs=ae(`Backup Interval: ${Gt()}min`,"Set periodic backup interval (minutes)",async()=>{await ku(),Ar(),Ae()},"clock-plus"),Ar=()=>{j($t,vt.isSignedIn?"logout":"login",vt.isSignedIn?"Sign Out":"Sign In"),Ge($t,vt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),j(Mo,"refresh",$o()?"Auto Backup: On":"Auto Backup: Off"),j(cs,"clock-plus",`Backup Interval: ${Gt()}min`),typeof Ae=="function"&&Ae()};_.appendChild($t),_.appendChild(Mo),_.appendChild(cs),_.appendChild(ae("Backup Now","Run a backup immediately",async()=>{await jo({silent:!1,skipBackoff:!0}),Ar()},"database"));let Wt=document.createElement("div");Wt.style.marginTop="15px",Wt.style.paddingTop="10px",Wt.style.borderTop="1px solid #555",Wt.style.fontSize="12px",Wt.style.color="#aaa";let Er=document.createElement("div");Er.style.marginBottom="8px",Er.style.fontWeight="bold",Wt.appendChild(Er),ru(Er);let Si=document.createElement("div");Si.style.marginBottom="8px",nu(Si),Wt.appendChild(Si);let us=document.createElement("div");ou(us),Wt.appendChild(us),_.appendChild(Wt),nt(),uo(),Ae(),Ar();let Mr=ae("Sign In","Sign in to Timekeeper Sync with Google",async()=>{Ke().isSignedIn?await jc():await qc()},"login"),ds=ae("Sync Now","Sync with the server immediately",()=>fa(),"refresh");Cc(()=>{let se=Ke().isSignedIn;j(Mr,se?"logout":"login",se?"Sign Out":"Sign In"),Ge(Mr,se?"Sign out of Timekeeper Sync":"Sign in to Timekeeper Sync with Google"),Mr.disabled=!se&&!Nn(),ds.disabled=!se}),B.appendChild(Mr),B.appendChild(ds);let pn=document.createElement("div");pn.style.marginTop="15px",pn.style.paddingTop="10px",pn.style.borderTop="1px solid #555",pn.style.fontSize="12px",pn.style.color="#aaa";let Ir=document.createElement("div");Ir.style.marginBottom="8px",Ir.style.fontWeight="bold",pn.appendChild(Ir),Ic(Ir);let ps=document.createElement("div");pn.appendChild(ps),Lc(ps),B.appendChild(pn),ao(),I.appendChild(W),I.appendChild(P),I.appendChild(_),I.appendChild(B),K(p==="drive"?"google":p),O.appendChild(I),document.body.appendChild(O),requestAnimationFrame(()=>{let se=O.getBoundingClientRect(),Kt=(window.innerHeight-se.height)/2;O.style.top=`${Math.max(20,Kt)}px`,O.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",At,!0),document.addEventListener("keydown",rt)},0)},rt=function(p){if(p.key==="Escape"&&O&&O.parentNode===document.body){let v=document.getElementById("ytls-save-modal"),b=document.getElementById("ytls-load-modal"),k=document.getElementById("ytls-delete-all-modal");if(v||b||k)return;p.preventDefault(),v&&document.body.contains(v)&&document.body.removeChild(v),b&&document.body.contains(b)&&document.body.removeChild(b),k&&document.body.contains(k)&&document.body.removeChild(k),O.classList.remove("ytls-fade-in"),O.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(O)&&document.body.removeChild(O),O=null,document.removeEventListener("click",At,!0),document.removeEventListener("keydown",rt)},300)}},At=function(p){if(Ko&&Ko.contains(p.target))return;let v=document.getElementById("ytls-save-modal"),b=document.getElementById("ytls-load-modal"),k=document.getElementById("ytls-delete-all-modal");v&&v.contains(p.target)||b&&b.contains(p.target)||k&&k.contains(p.target)||O&&O.contains(p.target)||(v&&document.body.contains(v)&&document.body.removeChild(v),b&&document.body.contains(b)&&document.body.removeChild(b),k&&document.body.contains(k)&&document.body.removeChild(k),O&&O.parentNode===document.body&&(O.classList.remove("ytls-fade-in"),O.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(O)&&document.body.removeChild(O),O=null,document.removeEventListener("click",At,!0),document.removeEventListener("keydown",rt)},300)))},Ao=function(){o&&(l("Loading window position from IndexedDB"),gi("windowPosition").then(p=>{let v=hs.safeParse(p);if(v.success){let k=v.data;o.style.left=`${k.x}px`,o.style.top=`${k.y}px`,o.style.right="auto",o.style.bottom="auto",typeof k.width=="number"&&k.width>0?o.style.width=`${k.width}px`:(o.style.width=`${si}px`,l(`No stored window width found, using default width ${si}px`)),typeof k.height=="number"&&k.height>0?o.style.height=`${k.height}px`:(o.style.height=`${li}px`,l(`No stored window height found, using default height ${li}px`));let I=D();ve(I,k.x,k.y),l("Restored window position from IndexedDB:",me())}else v.success?l("No window position found in IndexedDB, applying default size and leaving default position"):l("Window position in IndexedDB failed validation:",v.error.message,"warn"),o.style.width=`${si}px`,o.style.height=`${li}px`,te(null);Un();let b=D();b&&(b.width||b.height)&&ve(b),Pe?.()}).catch(p=>{l("failed to load pane position from IndexedDB:",p,"warn"),Un();let v=D();v&&(v.width||v.height)&&te({x:Math.max(0,Math.round(v.left)),y:0,width:Math.round(v.width),height:Math.round(v.height)}),Pe?.()}))},Eo=function(){if(!o)return;let p=D();if(!p)return;let v={x:Math.max(0,Math.round(p.left)),y:Math.max(0,Math.round(p.top)),width:Math.round(p.width),height:Math.round(p.height)},b=me();if(b&&b.x===v.x&&b.y===v.y&&b.width===v.width&&b.height===v.height){l("Skipping window position save; position and size unchanged");return}te({...v}),l(`Saving window position and size to IndexedDB: x=${v.x}, y=${v.y}, width=${v.width}, height=${v.height}`),fr("windowPosition",v),An({type:"window_position_updated",position:v,timestamp:Date.now()})},Sr=function(p,v){p.addEventListener("dblclick",b=>{b.preventDefault(),b.stopPropagation(),o&&(o.style.width="300px",o.style.height="300px",Eo(),kr())}),p.addEventListener("mousedown",b=>{b.preventDefault(),b.stopPropagation(),Ot=!0,cn=v,ns=b.clientX,os=b.clientY;let k=o.getBoundingClientRect();jn=k.width,$n=k.height,wr=k.left,br=k.top,rs=document.documentElement.clientWidth,is=document.documentElement.clientHeight,v==="top-left"||v==="bottom-right"?document.body.style.cursor="nwse-resize":document.body.style.cursor="nesw-resize"})},ss=function(){if(!s||!nn)return;let{scrollTop:p,scrollHeight:v,clientHeight:b}=s;if(v<=b)return;let k=Math.max(30,b/v*b),I=p/(v-b)*(b-k);nn.style.height=`${k}px`,nn.style.top=`${I}px`},ls=function(){Xe&&(bi===null&&(bi=requestAnimationFrame(()=>{bi=null,ss()})),Xe.classList.add("ytls-scrollbar-visible"),bt&&clearTimeout(bt),bt=setTimeout(()=>{Xe?.classList.remove("ytls-scrollbar-visible"),bt=null},500))},kr=function(){if(o&&c&&g&&s){let p=o.getBoundingClientRect(),v=c.getBoundingClientRect(),b=g.getBoundingClientRect(),k=p.height-(v.height+b.height);s.style.maxHeight=k>0?k+"px":"0px",s.style.overflowY=k>0?"auto":"hidden"}};if(document.querySelectorAll("#ytls-pane").forEach(p=>p.remove()),!document.getElementById("ytls-styles")){let p=document.createElement("style");p.id="ytls-styles",p.textContent=el,document.head.appendChild(p)}o=document.createElement("div"),c=document.createElement("div"),s=document.createElement("ul"),g=document.createElement("div"),m=document.createElement("span"),E=document.createElement("span"),M=document.createElement("span"),M.classList.add("ytls-backup-indicator"),M.style.cursor="pointer",M.style.backgroundColor="#666",M.onclick=p=>{p.stopPropagation(),Oe(Fo()?"sync":"drive")},s.addEventListener("mouseenter",()=>{En=!0,yo=!1}),s.addEventListener("mouseleave",()=>{En=!1;try{Ei()}catch{}if(yo)return;Tt(!1);let p=null;if(document.activeElement instanceof HTMLInputElement&&s.contains(document.activeElement)&&(p=document.activeElement.closest("li")?.dataset.guid??null),$a(),p){let b=Re().find(k=>k.dataset.guid===p)?.querySelector("input");if(b)try{b.focus({preventScroll:!0})}catch{}}}),o.id="ytls-pane",c.id="ytls-pane-header",c.addEventListener("dblclick",p=>{let v=p.target instanceof Element?p.target:null;if(v){let b=v;for(;b&&b!==o;){if(window.getComputedStyle(b).cursor==="pointer")return;b=b.parentElement}}p.preventDefault(),vi(!1)});let i=p=>{try{p.stopPropagation()}catch{}};["click","dblclick","mousedown","pointerdown","touchstart","wheel"].forEach(p=>{o.addEventListener(p,i)}),o.addEventListener("keydown",p=>{try{p.stopPropagation()}catch{}}),o.addEventListener("keyup",p=>{try{p.stopPropagation()}catch{}}),o.addEventListener("focus",p=>{try{p.stopPropagation()}catch{}},!0),o.addEventListener("blur",p=>{try{p.stopPropagation()}catch{}},!0),E.textContent=`v${Br}`,E.classList.add("ytls-version-display");let u=document.createElement("span");u.style.display="inline-flex",u.style.alignItems="center",u.style.gap="6px",u.appendChild(E),u.appendChild(M),m.id="ytls-current-time",m.textContent="\u2014",m.style.cursor="default",Ge(m,()=>{let p=J(),{isLive:v}=p?p.getVideoData()||{isLive:!1}:{isLive:!1};return v?"Skip to live":""}),h=document.createElement("span"),h.id="ytls-playback-speed",h.textContent="1x",h.style.cursor="pointer",h.style.userSelect="none",Ge(h,()=>`Current playback speed. Click to toggle between 1x and ${tn(f)}x.`),h.onclick=()=>{Ia()},h.addEventListener("mousedown",p=>{p.stopPropagation()}),h.addEventListener("click",p=>{p.stopPropagation()}),m.onclick=()=>{let p=J();if(!p)return;let{isLive:v}=p.getVideoData()||{isLive:!1};v&&(Dt=!0,p.seekToLiveHead(),setTimeout(()=>{Dt=!1},500))};let w=p=>{m.style.cursor=p?"pointer":"default"};A(),ue&&clearInterval(ue),ue=setInterval(A,1e3),g.id="ytls-buttons";let T=(p,v)=>()=>{p.classList.remove("ytls-fade-in"),p.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(p)&&document.body.removeChild(p),v&&v()},300)},x=p=>v=>{v.key==="Escape"&&(v.preventDefault(),v.stopPropagation(),p())},L=p=>{setTimeout(()=>{document.addEventListener("keydown",p)},0)},C=(p,v)=>b=>{p.contains(b.target)||v()},R=p=>{setTimeout(()=>{document.addEventListener("click",p,!0)},0)};[{id:"add",icon:"alarm-plus",title:"Add timestamp",action:()=>{if(kt())return;let p=typeof Gn<"u"?Gn:0,v=J(),b=v?Math.floor(v.getCurrentTime()+p):0;if(!Number.isFinite(b))return;let k=To(b,"");k&&k.focus()}},{id:"settings",icon:"settings",title:"Settings",action:()=>Oe()},{id:"copy",icon:"clipboard",title:"Copy timestamps to clipboard",action:function(p){if(kt()){_e(this,"circle-x",20),setTimeout(()=>{_e(this,"clipboard",20)},2e3);return}let v=di();if(v.length===0){_e(this,"circle-x",20),setTimeout(()=>{_e(this,"clipboard",20)},2e3);return}let b=p.ctrlKey,k=Ai(v,b);navigator.clipboard.writeText(k).then(()=>{_e(this,"circle-check",20),setTimeout(()=>{_e(this,"clipboard",20)},2e3)}).catch(I=>{l("Failed to copy timestamps: ",I,"error"),_e(this,"circle-x",20),setTimeout(()=>{_e(this,"clipboard",20)},2e3)})}},{id:"offset",icon:"clock-plus",title:"Offset all timestamps",action:()=>{if(kt())return;if(Re().length===0){alert("No timestamps available to offset.");return}let v=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(v===null)return;let b=v.trim();if(b.length===0)return;let k=Number.parseInt(b,10);if(!Number.isFinite(k)){alert("Please enter a valid integer number of seconds.");return}k!==0&&qa(k,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{id:"delete",icon:"trash",title:"Delete all timestamps for current video",action:async()=>{let p=mr();if(!p){alert("Unable to determine current video ID.");return}let v=document.createElement("div");v.id="ytls-delete-all-modal",v.classList.remove("ytls-fade-out"),v.classList.add("ytls-fade-in");let b=document.createElement("p");b.textContent="Hold the button to delete all timestamps for:",b.style.marginBottom="10px";let k=document.createElement("p");k.textContent=p,k.style.fontFamily="monospace",k.style.fontSize="12px",k.style.marginBottom="15px",k.style.color="#aaa";let I=document.createElement("button");I.classList.add("ytls-save-modal-button"),I.style.background="#d32f2f",I.style.position="relative",I.style.overflow="hidden";let W=null,P=0,_=null,B=document.createElement("div");B.style.position="absolute",B.style.left="0",B.style.top="0",B.style.height="100%",B.style.width="0%",B.style.background="#ff6b6b",B.style.transition="none",B.style.pointerEvents="none",I.appendChild(B);let K=document.createElement("span");K.textContent="Hold to Delete All",K.style.position="relative",K.style.zIndex="1",I.appendChild(K);let fe=()=>{if(!P)return;let $t=Date.now()-P,Mo=Math.min($t/5e3*100,100);B.style.width=`${Mo}%`,Mo<100&&(_=requestAnimationFrame(fe))},Ie=()=>{W&&(clearTimeout(W),W=null),_&&(cancelAnimationFrame(_),_=null),P=0,B.style.width="0%",K.textContent="Hold to Delete All"};I.onmousedown=()=>{P=Date.now(),K.textContent="Deleting...",_=requestAnimationFrame(fe),W=setTimeout(async()=>{Ie(),v.classList.remove("ytls-fade-in"),v.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(v)&&document.body.removeChild(v);try{await Ja(p),yi()}catch($t){l("Failed to delete all timestamps:",$t,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},I.onmouseup=Ie,I.onmouseleave=Ie;let Je=null,un=null,Et=T(v,()=>{Ie(),Je&&document.removeEventListener("keydown",Je),un&&document.removeEventListener("click",un,!0)});Je=x(Et),un=C(v,Et);let dn=document.createElement("button");dn.textContent="Cancel",dn.classList.add("ytls-save-modal-cancel-button"),dn.onclick=Et,v.appendChild(b),v.appendChild(k),v.appendChild(I),v.appendChild(dn),document.body.appendChild(v),L(Je),R(un)}}].forEach(p=>{let v=document.createElement("button");_e(v,p.icon,20),Ge(v,p.title),v.classList.add("ytls-main-button"),p.id==="copy"?v.onclick=function(b){p.action.call(this,b)}:v.onclick=p.action,p.id==="settings"&&(Ko=v),g.appendChild(v)});let Pt=document.createElement("button");j(Pt,"device-floppy","Save"),Pt.classList.add("ytls-file-operation-button"),Pt.onclick=()=>{let p=document.createElement("div");p.id="ytls-save-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let v=document.createElement("p");v.textContent="Save as:";let b=null,k=null,I=T(p,()=>{b&&document.removeEventListener("keydown",b),k&&document.removeEventListener("click",k,!0)});b=x(I),k=C(p,I);let W=document.createElement("button");W.textContent="JSON",W.classList.add("ytls-save-modal-button"),W.onclick=()=>{b&&document.removeEventListener("keydown",b),k&&document.removeEventListener("click",k,!0),T(p,()=>Ya("json"))()};let P=document.createElement("button");P.textContent="Plain Text",P.classList.add("ytls-save-modal-button"),P.onclick=()=>{b&&document.removeEventListener("keydown",b),k&&document.removeEventListener("click",k,!0),T(p,()=>Ya("text"))()};let _=document.createElement("button");_.textContent="Cancel",_.classList.add("ytls-save-modal-cancel-button"),_.onclick=I,p.appendChild(v),p.appendChild(W),p.appendChild(P),p.appendChild(_),document.body.appendChild(p),L(b),R(k)};let Vn=document.createElement("button");j(Vn,"folder-open","Load"),Vn.classList.add("ytls-file-operation-button"),Vn.onclick=()=>{let p=document.createElement("div");p.id="ytls-load-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let v=document.createElement("p");v.textContent="Load from:";let b=null,k=null,I=T(p,()=>{b&&document.removeEventListener("keydown",b),k&&document.removeEventListener("click",k,!0)});b=x(I),k=C(p,I);let W=document.createElement("button");W.textContent="File",W.classList.add("ytls-save-modal-button"),W.onclick=()=>{let B=document.createElement("input");B.type="file",B.accept=".json,.txt",B.classList.add("ytls-hidden-file-input"),B.onchange=K=>{let fe=K.target.files?.[0];if(!fe)return;b&&document.removeEventListener("keydown",b),k&&document.removeEventListener("click",k,!0),I();let Ie=new FileReader;Ie.onload=()=>{let Je=String(Ie.result).trim();Za(Je)},Ie.readAsText(fe)},B.click()};let P=document.createElement("button");P.textContent="Clipboard",P.classList.add("ytls-save-modal-button"),P.onclick=async()=>{b&&document.removeEventListener("keydown",b),k&&document.removeEventListener("click",k,!0),T(p,async()=>{try{let B=await navigator.clipboard.readText();B?Za(B.trim()):alert("Clipboard is empty.")}catch(B){l("Failed to read from clipboard: ",B,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let _=document.createElement("button");_.textContent="Cancel",_.classList.add("ytls-save-modal-cancel-button"),_.onclick=I,p.appendChild(v),p.appendChild(W),p.appendChild(P),p.appendChild(_),document.body.appendChild(p),L(b),R(k)};let ln=document.createElement("button");j(ln,"file-export","Export"),ln.classList.add("ytls-file-operation-button"),ln.onclick=async()=>{try{await Ju()}catch{alert("Failed to export data: Could not read from database.")}};let qn=document.createElement("button");j(qn,"file-import","Import"),qn.classList.add("ytls-file-operation-button"),qn.onclick=()=>{let p=document.createElement("input");p.type="file",p.accept=".json",p.classList.add("ytls-hidden-file-input"),p.onchange=v=>{let b=v.target.files?.[0];if(!b)return;let k=new FileReader;k.onload=()=>{try{let I=JSON.parse(String(k.result)),W=[];for(let P in I)if(Object.prototype.hasOwnProperty.call(I,P)&&P.startsWith("ytls-")){let _=P.substring(5),B=I[P];if(B&&typeof B.video_id=="string"&&Array.isArray(B.timestamps)){let K=B.timestamps.map(Ie=>({...Ie,guid:Ie.guid||crypto.randomUUID()})),fe=qu(_,K).then(()=>l(`Imported ${_} to IndexedDB`)).catch(Ie=>l(`Failed to import ${_} to IndexedDB:`,Ie,"error"));W.push(fe)}else l(`Skipping key ${P} during import due to unexpected data format.`,"warn")}Promise.all(W).then(()=>{yi()}).catch(P=>{alert("An error occurred during import to IndexedDB. Check console for details."),l("Overall import error:",P,"error")})}catch(I){alert(`Failed to import data. Please ensure the file is in the correct format.
`+I.message),l("Import error:",I,"error")}},k.readAsText(b)},p.click()},s.onclick=p=>{ja(p)},s.ontouchstart=p=>{ja(p)},o.style.position="fixed",o.style.bottom="0",o.style.right="0",o.style.transition="none",Ao(),setTimeout(()=>Un(),10);let jt=!1,hr=0,gr=0,vr=0,Bn=0,yr=0,U=0,H=null,pe=!1;o.addEventListener("mousedown",p=>{let v=p.target;if(!(v instanceof Element)||v instanceof HTMLInputElement||v instanceof HTMLTextAreaElement||v instanceof Element&&(v.closest("#ytls-playback-speed-group")||v.closest("#ytls-playback-speed"))||v!==c&&!c.contains(v)&&window.getComputedStyle(v).cursor==="pointer")return;jt=!0,pe=!1;let b=o.getBoundingClientRect();hr=p.clientX-b.left,gr=p.clientY-b.top,vr=b.width,Bn=b.height,yr=document.documentElement.clientWidth,U=document.documentElement.clientHeight,o.style.transition="none"}),document.addEventListener("mousemove",Xo=p=>{if(!jt)return;pe=!0;let v=p.clientX,b=p.clientY;H===null&&(H=requestAnimationFrame(()=>{if(H=null,!jt)return;let k=Math.max(0,Math.min(v-hr,yr-vr)),I=Math.max(0,Math.min(b-gr,U-Bn));o.style.left=`${k}px`,o.style.top=`${I}px`,o.style.right="auto",o.style.bottom="auto"}))}),document.addEventListener("mouseup",Jo=()=>{if(!jt)return;jt=!1,H!==null&&(cancelAnimationFrame(H),H=null);let p=pe;setTimeout(()=>{pe=!1},50),Un(),setTimeout(()=>{p&&Eo()},200)}),o.addEventListener("dragstart",p=>p.preventDefault());let Z=document.createElement("div"),he=document.createElement("div"),je=document.createElement("div"),ut=document.createElement("div");Z.id="ytls-resize-tl",he.id="ytls-resize-tr",je.id="ytls-resize-bl",ut.id="ytls-resize-br";let Ot=!1,ns=0,os=0,jn=0,$n=0,wr=0,br=0,rs=0,is=0,Wn=null,cn=null;Sr(Z,"top-left"),Sr(he,"top-right"),Sr(je,"bottom-left"),Sr(ut,"bottom-right"),document.addEventListener("mousemove",p=>{if(!Ot||!o||!cn)return;let v=p.clientX,b=p.clientY;Wn===null&&(Wn=requestAnimationFrame(()=>{if(Wn=null,!Ot||!o||!cn)return;let k=v-ns,I=b-os,W=rs,P=is,_=jn,B=$n,K=wr,fe=br;cn==="bottom-right"?(_=Math.max(200,Math.min(800,jn+k)),B=Math.max(250,Math.min(P,$n+I))):cn==="top-left"?(_=Math.max(200,Math.min(800,jn-k)),K=wr+k,B=Math.max(250,Math.min(P,$n-I)),fe=br+I):cn==="top-right"?(_=Math.max(200,Math.min(800,jn+k)),B=Math.max(250,Math.min(P,$n-I)),fe=br+I):cn==="bottom-left"&&(_=Math.max(200,Math.min(800,jn-k)),K=wr+k,B=Math.max(250,Math.min(P,$n+I))),K=Math.max(0,Math.min(K,W-_)),fe=Math.max(0,Math.min(fe,P-B)),o.style.width=`${_}px`,o.style.height=`${B}px`,o.style.left=`${K}px`,o.style.top=`${fe}px`,o.style.right="auto",o.style.bottom="auto"}))}),document.addEventListener("mouseup",()=>{Ot&&(Ot=!1,Wn!==null&&(cancelAnimationFrame(Wn),Wn=null),cn=null,document.body.style.cursor="",ie(!0))});let xr=null;window.addEventListener("resize",Qo=()=>{xr&&clearTimeout(xr),xr=setTimeout(()=>{ie(!0),Pe?.(),xr=null},200)}),c.appendChild(m);let Kn=document.createElement("span");Kn.id="ytls-playback-speed-group",Kn.style.display="inline-flex",Kn.style.alignItems="center",Kn.style.marginLeft="4px",h&&Kn.appendChild(h),c.appendChild(Kn),c.appendChild(u);let wi=document.createElement("div");wi.id="ytls-list-wrapper",Xe=document.createElement("div"),Xe.className="ytls-scrollbar-track",nn=document.createElement("div"),nn.className="ytls-scrollbar-thumb",Xe.append(nn),wi.append(s,Xe);let Tr=document.createElement("div");Tr.id="ytls-content",Tr.append(wi),Tr.append(g),o.append(c,Tr,Z,he,je,ut);let as="";o.addEventListener("mousemove",p=>{if(jt||Ot)return;let v=o.getBoundingClientRect(),b=20,k=p.clientX,I=p.clientY,W=k-v.left<=b,P=v.right-k<=b,_=I-v.top<=b,B=v.bottom-I<=b,K="";_&&W||B&&P?K="nwse-resize":(_&&P||B&&W)&&(K="nesw-resize"),K!==as&&(as=K,document.body.style.cursor=K)});let bi=null;if(Xe.addEventListener("mouseenter",()=>{bt&&(clearTimeout(bt),bt=null),Xe.classList.add("ytls-scrollbar-visible")}),Xe.addEventListener("mouseleave",()=>{ci||(bt=setTimeout(()=>{Xe?.classList.remove("ytls-scrollbar-visible"),bt=null},500))}),nn.addEventListener("mousedown",p=>{if(!s)return;p.preventDefault(),p.stopPropagation(),ci=!0;let v=p.clientY,b=s.scrollTop,{scrollHeight:k,clientHeight:I}=s,W=Math.max(30,I/k*I),P=k-I,_=I-W;function B(fe){if(!s)return;let Ie=fe.clientY-v;s.scrollTop=Math.max(0,Math.min(P,b+Ie*(P/_))),ss()}function K(){ci=!1,document.removeEventListener("mousemove",B),document.removeEventListener("mouseup",K),Xe?.matches(":hover")||(bt=setTimeout(()=>{Xe?.classList.remove("ytls-scrollbar-visible"),bt=null},500))}document.addEventListener("mousemove",B),document.addEventListener("mouseup",K)}),o.addEventListener("mouseenter",()=>{En=!0,ls()}),s.addEventListener("scroll",ls),o.addEventListener("mouseleave",()=>{!Ot&&!jt&&(document.body.style.cursor=""),En=!1;try{Ei()}catch{}try{Tt(!1)}catch{}}),Pe=kr,setTimeout(()=>{if(kr(),o&&c&&g&&s){let p=40,v=Re();if(v.length>0)p=v[0].offsetHeight;else{let b=document.createElement("li");b.style.visibility="hidden",b.style.position="absolute",b.textContent="00:00 Example",s.appendChild(b),p=b.offsetHeight,s.removeChild(b)}ee(c.offsetHeight+g.offsetHeight+p),o.style.minHeight=V()+"px"}},0),xt){try{xt.disconnect()}catch{}xt=null}xt=new ResizeObserver(kr),xt.observe(o),go||document.addEventListener("pointerdown",go=()=>{Pa=Date.now()},!0),vo||document.addEventListener("pointerup",vo=()=>{},!0)}finally{ui=!1}}}async function td(){if(!o)return;if(document.querySelectorAll("#ytls-pane").forEach(d=>{d!==o&&(l("Removing duplicate pane element from DOM"),d.remove())}),document.body.contains(o)){l("Pane already in DOM, skipping append");return}await Zu(),lu(Yu),cu(Xu),Sa(fr),xa(gi),uu(pr),iu(M),Oc(()=>ii()),await Ta(),await Su(),await Tn(),ii();let u=document.querySelectorAll("#ytls-pane");if(u.length>0&&(l(`WARNING: Found ${u.length} existing pane(s) in DOM, removing all`),u.forEach(d=>d.remove())),document.body.contains(o)){l("ERROR: Pane already in body, aborting append");return}if(document.body.appendChild(o),l("Pane successfully appended to DOM"),Se(),Me&&(clearTimeout(Me),Me=null),Me=setTimeout(()=>{Ee(),Pe?.(),be(),ie(!0),Me=null},450),St){try{St.disconnect()}catch{}St=null}St=new MutationObserver(()=>{let d=document.querySelectorAll("#ytls-pane");d.length>1&&(l(`CRITICAL: Multiple panes detected (${d.length}), removing duplicates`),d.forEach((w,S)=>{(S>0||o&&w!==o)&&w.remove()}))}),St.observe(document.body,{childList:!0})}function es(i=0){if(document.getElementById("ytls-header-button")){qt();return}let u=document.querySelector("#logo");if(!u||!u.parentElement){i<10&&setTimeout(()=>es(i+1),300);return}let d=document.createElement("button");d.id="ytls-header-button",d.type="button",d.className="ytls-header-button",Ge(d,"Toggle Timekeeper UI"),d.setAttribute("aria-label","Toggle Timekeeper UI");let w=document.createElement("img");w.src=Pr,w.alt="",w.decoding="async",d.appendChild(w),on=w,d.addEventListener("mouseenter",()=>{on&&(Yo=!0,on.src=tl)}),d.addEventListener("mouseleave",()=>{on&&(Yo=!1,qt())}),d.addEventListener("click",()=>{o&&!document.body.contains(o)&&(l("Pane not in DOM, re-appending before toggle"),document.body.appendChild(o)),vi()}),u.insertAdjacentElement("afterend",d),qt(),l("Timekeeper header button added next to YouTube logo")}function ts(){if($())return;le(!0);let i=history.pushState,u=history.replaceState;function d(){try{let w=new Event("locationchange");window.dispatchEvent(w)}catch{}}history.pushState=function(){let w=i.apply(this,arguments);return d(),w},history.replaceState=function(){let w=u.apply(this,arguments);return d(),w},window.addEventListener("popstate",d),window.addEventListener("locationchange",()=>{window.location.href!==q&&l("Location changed (locationchange event) \u2014 deferring UI update until navigation finish")})}async function yi(){if(!a()){Gu();return}N(window.location.href),document.querySelectorAll("#ytls-pane").forEach((u,d)=>{(d>0||o&&u!==o)&&u.remove()}),await Ve(),await ed(),Be=mr();let i=document.title;l("Page Title:",i),l("Video ID:",Be),l("Current URL:",window.location.href),mi(!0),So(),qe(),await pr(),qe(),mi(!1),l("Timestamps loaded and UI unlocked for video:",Be),await td();try{Tt(!0)}catch{}es(),Vu()}ts(),window.addEventListener("yt-navigate-start",()=>{l("Navigation started (yt-navigate-start event fired)"),ur(),a()&&o&&s&&(l("Locking UI and showing loading state for navigation"),mi(!0))}),ho=i=>{if(!i.repeat&&!i.ctrlKey&&!i.altKey&&!i.metaKey&&!i.shiftKey&&(i.key==="z"||i.key==="Z")){if(Au(i.target))return;Ia()&&(i.preventDefault(),l("Playback speed toggled via keyboard shortcut (Z)"));return}i.ctrlKey&&i.altKey&&i.shiftKey&&(i.key==="T"||i.key==="t")&&(i.preventDefault(),vi(),l("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",ho),window.addEventListener("pagehide",ur),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&ur()}),window.addEventListener("yt-navigate-finish",()=>{l("Navigation finished (yt-navigate-finish event fired)"),window.location.href!==q?yi():l("Navigation finished but URL already handled, skipping.")});function nd(i){let u=/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(i);if(u&&(u[1]||u[2]||u[3]))return Number(u[1]||0)*3600+Number(u[2]||0)*60+Number(u[3]||0);let d=Number(i);return Number.isFinite(d)?d:null}document.addEventListener("click",i=>{if(i.button!==0||i.ctrlKey||i.metaKey||i.shiftKey||i.altKey)return;let u=i.target?.closest?.("ytd-comments a[href]");if(!u)return;let d=new URL(u.href,location.href),w=d.searchParams.get("t");if(d.pathname!=="/watch"||!w||d.searchParams.get("v")!==mr())return;let S=nd(w),A=J();S===null||!A||(i.preventDefault(),i.stopImmediatePropagation(),A.seekTo(S))},!0),Mc(i=>{for(let u of i)An({type:"timestamps_updated",videoId:u,action:"synced"});Be&&i.includes(Be)&&pr()}),Qc(),ts(),l("Timekeeper initialized and waiting for navigation events")})();})();

