// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      5.3.1.643
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

(()=>{var Gu=Object.defineProperty;var Fu=(e,t)=>{for(var n in t)Gu(e,n,{get:t[n],enumerable:!0})};var ko=class extends Error{},Je=(e,t)=>{throw new ko(`${e||"value"}: expected ${t}`)};function Et(e){let t={run:e,parse:n=>e(n,""),safeParse:n=>{try{return{success:!0,data:e(n,"")}}catch(o){if(o instanceof ko)return{success:!1,error:o};throw o}},array:()=>Uu(t)};return t}var as=e=>typeof e=="object"&&e!==null&&!Array.isArray(e);function K(){return Et((e,t)=>typeof e=="string"?e:Je(t,"string"))}function Cn(){return Et((e,t)=>typeof e=="boolean"?e:Je(t,"boolean"))}function Le(e={}){return Et((t,n)=>typeof t!="number"||Number.isNaN(t)?Je(n,"number"):(e.finite&&!Number.isFinite(t)&&Je(n,"finite number"),e.int&&!Number.isInteger(t)&&Je(n,"integer"),e.nonnegative&&t<0&&Je(n,"number >= 0"),e.positive&&t<=0&&Je(n,"number > 0"),e.min!==void 0&&t<e.min&&Je(n,`number >= ${e.min}`),e.max!==void 0&&t>e.max&&Je(n,`number <= ${e.max}`),t))}function we(e){return Et((t,n)=>t===void 0?void 0:e.run(t,n))}function dt(e){return Et((t,n)=>t===null?null:e.run(t,n))}function Xe(e,t){return Et((n,o)=>{try{return e.run(n,o)}catch(a){if(a instanceof ko)return t;throw a}})}function Uu(e){return Et((t,n)=>Array.isArray(t)?t.map((o,a)=>e.run(o,`${n}[${a}]`)):Je(n,"array"))}function qu(e){return Et((t,n)=>{if(!as(t))return Je(n,"object");let o={};for(let a of Object.keys(t))o[a]=e.run(t[a],n?`${n}.${a}`:a);return o})}function Ce(e){let t=Et((n,o)=>{if(!as(n))return Je(o,"object");let a={};for(let r of Object.keys(e)){let u=e[r].run(n[r],o?`${o}.${r}`:r);u!==void 0&&(a[r]=u)}return a});return Object.assign(t,{extend:n=>Ce({...e,...n}),partial:()=>{let n={};for(let o of Object.keys(e))n[o]=we(e[o]);return Ce(n)}})}var Vu=Et((e,t)=>typeof e=="string"&&e.length>0?e:Je(t,"non-empty string")),Ar=Ce({guid:Vu,start:Le({finite:!0,nonnegative:!0}),comment:K(),write_counter:we(Le({int:!0,positive:!0})),deleted_at:Xe(we(Le()),void 0)}),To=Ar.array(),un=Ar.extend({video_id:K(),device_id:we(K())}),ss=Ce({x:Le({finite:!0}),y:Le({finite:!0}),width:we(Le({finite:!0,positive:!0})),height:we(Le({finite:!0,positive:!0}))}),Er=Ce({video_id:K(),timestamps:To}),ls=qu(Er),is=Ce({isSignedIn:Xe(Cn(),!1),accessToken:Xe(dt(K()),null),userName:Xe(dt(K()),null),email:Xe(dt(K()),null)}),pi=Xe(Et((e,t)=>{if(typeof e=="string"){let n;try{n=JSON.parse(e)}catch{return Je(t,"valid JSON string for auth state")}return is.run(n,t)}return is.run(e,t)}),{isSignedIn:!1,accessToken:null,userName:null,email:null}),$n={isSignedIn:!1,accessToken:null,accessTokenExpiresAt:null,refreshToken:null,userId:null,userName:null,email:null},cs=Xe(Ce({isSignedIn:Xe(Cn(),!1),accessToken:Xe(dt(K()),null),accessTokenExpiresAt:Xe(dt(Le({finite:!0})),null),refreshToken:Xe(dt(K()),null),userId:Xe(dt(K()),null),userName:Xe(dt(K()),null),email:Xe(dt(K()),null)}),$n),ju=Ce({autoBackupEnabled:Cn(),autoBackupIntervalMinutes:Le({int:!0,min:5,max:1440}),lastAutoBackupAt:we(dt(Le({int:!0,positive:!0})))}),mi=ju;var us=`<svg
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
</svg>`;var ds=`<svg
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
</svg>`;var ps=`<svg
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
</svg>`;var ms=`<svg
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
</svg>`;var fs=`<svg
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
</svg>`;var hs=`<svg
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
</svg>`;var gs=`<svg
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
</svg>`;var vs=`<svg
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-clock-plus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20.984 12.535a9 9 0 1 0 -8.468 8.45" />
  <path d="M16 19h6" />
  <path d="M19 16v6" />
  <path d="M12 7v5l3 3" />
</svg>`;var ws=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="currentColor"
  class="icon icon-tabler icons-tabler-filled icon-tabler-current-location"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 1a1 1 0 0 1 1 1v1.055a9.004 9.004 0 0 1 7.946 7.945h1.054a1 1 0 0 1 0 2h-1.055a9.004 9.004 0 0 1 -7.944 7.945l-.001 1.055a1 1 0 0 1 -2 0v-1.055a9.004 9.004 0 0 1 -7.945 -7.944l-1.055 -.001a1 1 0 0 1 0 -2h1.055a9.004 9.004 0 0 1 7.945 -7.945v-1.055a1 1 0 0 1 1 -1m0 4a7 7 0 1 0 0 14a7 7 0 0 0 0 -14m0 3a4 4 0 1 1 -4 4l.005 -.2a4 4 0 0 1 3.995 -3.8" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-player-record"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 12a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-x"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M10 10l4 4m0 -4l-4 4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-check"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M9 12l2 2l4 -4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-cloud"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M6.657 18c-2.572 0 -4.657 -2.007 -4.657 -4.483c0 -2.475 2.085 -4.482 4.657 -4.482c.393 -1.762 1.794 -3.2 3.675 -3.773c1.88 -.572 3.956 -.193 5.444 1c1.488 1.19 2.162 3.007 1.77 4.769h.99c1.913 0 3.464 1.56 3.464 3.486c0 1.927 -1.551 3.487 -3.465 3.487h-11.878" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-device-floppy"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
  <path d="M10 14a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M14 4l0 4l-6 0l0 -4" />
</svg>`;var Es=`<svg
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-export"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v5m-5 6h7m-3 -3l3 3l-3 3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-import"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M5 13v-8a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5.5m-9.5 -2h7m-3 -3l3 3l-3 3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-spreadsheet"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
  <path d="M8 11h8v7h-8l0 -7" />
  <path d="M8 15h8" />
  <path d="M11 11v7" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-login"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
  <path d="M21 12h-13l3 -3" />
  <path d="M11 15l-3 -3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-logout"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
  <path d="M9 12h12l-3 -3" />
  <path d="M18 15l3 -3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-refresh"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
  <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-alert-triangle"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 9v4" />
  <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0" />
  <path d="M12 16h.01" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-database"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M4 6a8 3 0 1 0 16 0a8 3 0 1 0 -16 0" />
  <path d="M4 6v6a8 3 0 0 0 16 0v-6" />
  <path d="M4 12v6a8 3 0 0 0 16 0v-6" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-server"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 7a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3" />
  <path d="M3 15a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -2" />
  <path d="M7 8l0 .01" />
  <path d="M7 16l0 .01" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-world"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
  <path d="M3.6 9h16.8" />
  <path d="M3.6 15h16.8" />
  <path d="M11.5 3a17 17 0 0 0 0 18" />
  <path d="M12.5 3a17 17 0 0 1 0 18" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-plug-connected"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M7 12l5 5l-1.5 1.5a3.536 3.536 0 1 1 -5 -5l1.5 -1.5" />
  <path d="M17 12l-5 -5l1.5 -1.5a3.536 3.536 0 1 1 5 5l-1.5 1.5" />
  <path d="M3 21l2.5 -2.5" />
  <path d="M18.5 5.5l2.5 -2.5" />
  <path d="M10 11l-2 2" />
  <path d="M13 14l-2 2" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-key"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0" />
  <path d="M15 9h.01" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-x"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M18 6l-12 12" />
  <path d="M6 6l12 12" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-indent-increase"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 6l-11 0" />
  <path d="M20 12l-7 0" />
  <path d="M20 18l-11 0" />
  <path d="M4 8l4 4l-4 4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-indent-decrease"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 6l-7 0" />
  <path d="M20 12l-9 0" />
  <path d="M20 18l-7 0" />
  <path d="M8 8l-4 4l4 4" />
</svg>`;var Td={plus:us,"alarm-plus":ds,minus:ps,"circle-plus":ms,"circle-minus":fs,trash:hs,clipboard:gs,settings:vs,"clock-plus":ys,"current-location":ws,"player-record":bs,"circle-x":xs,"circle-check":Ss,"adjustments-horizontal":ks,cloud:Ts,"device-floppy":As,"folder-open":Es,"file-export":Ms,"file-import":Is,"file-spreadsheet":Ls,login:Cs,logout:Bs,refresh:Rs,"alert-triangle":Ds,database:Ps,server:Os,world:Hs,"plug-connected":Ns,key:zs,x:_s,"indent-increase":Gs,"indent-decrease":Fs},Us="http://www.w3.org/2000/svg",Ad=/^\s*<svg\s+([^>]*)>([\s\S]*?)<\/svg>\s*$/,Ed=/<([a-zA-Z][\w:-]*)([^>]*)\/>/g,Md=/([a-zA-Z_:][\w:.-]*)="([^"]*)"/g,qs=new Map;function Vs(e){let t={};for(let n of e.matchAll(Md))t[n[1]]=n[2];return t}function Id(e){return e.startsWith("data:image/svg+xml;base64,")?atob(e.slice(26)):e.startsWith("data:image/svg+xml,")?decodeURIComponent(e.slice(19)):e}function Ld(e){let t=Id(e).match(Ad);if(!t)throw new Error("Invalid Tabler SVG source");let[,n,o]=t,a=document.createElementNS(Us,"svg"),r=Vs(n);for(let[u,s]of Object.entries(r))u!=="class"&&a.setAttribute(u,s);for(let u of o.matchAll(Ed)){let[,s,g]=u,m=document.createElementNS(Us,s),f=Vs(g);for(let[v,y]of Object.entries(f))m.setAttribute(v,y);a.appendChild(m)}return a}function Cd(e){let t=qs.get(e);if(t)return t;let n=Ld(Td[e]);return qs.set(e,n),n}function Wn(e,t=20){let n=Cd(e).cloneNode(!0);return n.setAttribute("width",String(t)),n.setAttribute("height",String(t)),n.setAttribute("aria-hidden","true"),n.style.pointerEvents="none",n.style.flexShrink="0",n.style.verticalAlign="middle",n}function _e(e,t,n){e.replaceChildren(Wn(t,n))}function j(e,t,n,o){e.replaceChildren(Wn(t,o),document.createTextNode("\xA0"+n))}var js="5.3.1";var Mr=js+"+b34a3ce";function l(e,...t){let n="debug",o=[...t];t.length>0&&typeof t[t.length-1]=="string"&&["debug","info","warn","error"].includes(t[t.length-1])&&(n=o.pop());let a=`[Timekeeper v${Mr}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[n](`${a} ${e}`,...o)}var Ir=e=>String(e).padStart(2,"0");function dn(e,t=e){let n=Math.floor(e/3600),o=Math.floor(e%3600/60),a=Ir(e%60);return t<3600?`${t>=600?Ir(o):o}:${a}`:`${t>=36e3?Ir(n):n}:${Ir(o)}:${a}`}function Lr(e,t,n){let o=dn(e,Math.max(e,n));if(t.length===0)return o;let a=(Math.max(...t)-Math.min(...t))/60,r=(t.length/Math.max(1,a)).toFixed(2);return parseFloat(r)>0?`${o} (${r}/min)`:o}function fi(e,t){let n=Math.max(0,...e.map(o=>o.start));return e.map(o=>{let a=dn(o.start,n),r=t?`${o.comment} <!-- guid:${o.guid} -->`.trimStart():o.comment;return`${a} ${r}`}).join(`
`)}function $s(e,t=window.location.href){try{let n=new URL(t);return n.searchParams.set("t",`${e}s`),n.toString()}catch{return`https://www.youtube.com/watch?v=${t.search(/[?&]v=/)>=0?t.split(/[?&]v=/)[1].split(/&/)[0]:t.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${e}s`}}function Bn(){let e=new Date;return e.getUTCFullYear()+"-"+String(e.getUTCMonth()+1).padStart(2,"0")+"-"+String(e.getUTCDate()).padStart(2,"0")+"--"+String(e.getUTCHours()).padStart(2,"0")+"-"+String(e.getUTCMinutes()).padStart(2,"0")+"-"+String(e.getUTCSeconds()).padStart(2,"0")}var Ws=`#ytls-pane {
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
`;var Cr="data:image/png;base64,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",Ks="data:image/png;base64,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";var Qe=null,Kn=null,Bd=250,Ot=null,Yn=!1,Ze=null,Ao=[];function Rd(){return(!Qe||!document.body.contains(Qe))&&(Qe=document.createElement("div"),Qe.className="ytls-tooltip",Qe.style.pointerEvents="none",document.body.appendChild(Qe),window.addEventListener("scroll",Ys,!0),window.addEventListener("resize",Ys,!0)),Qe}function Dd(e,t,n){let a=window.innerWidth,r=window.innerHeight,u=e.getBoundingClientRect(),s=u.width,g=u.height,m=t+10,f=n+10;m+s>a-10&&(m=t-s-10),f+g>r-10&&(f=n-g-10),m=Math.max(10,Math.min(m,a-s-10)),f=Math.max(10,Math.min(f,r-g-10)),e.style.left=`${m}px`,e.style.top=`${f}px`}function Xs(e,t){let o=window.innerWidth,a=window.innerHeight,r=t.getBoundingClientRect(),u=e.getBoundingClientRect(),s=u.width,g=u.height,m=Math.round(r.left+r.width/2-s/2),f=Math.round(r.top-g-8);f<8&&(f=Math.round(r.bottom+8)),m<8&&(m=Math.round(r.left)),m+s>o-8&&(m=Math.round(r.right-s)),m=Math.max(8,Math.min(m,o-s-8)),f=Math.max(8,Math.min(f,a-g-8)),e.style.left=`${m}px`,e.style.top=`${f}px`}function Ys(){if(!(!Qe||!Ot)&&Qe.classList.contains("ytls-tooltip-visible"))try{Xs(Qe,Ot)}catch{}}function Pd(e=50){Ze&&(clearTimeout(Ze),Ze=null),!Yn&&(Ze=setTimeout(()=>{Eo(),Ze=null},e))}function Od(e,t,n,o){Ze&&(clearTimeout(Ze),Ze=null),Ot&&o&&Ot!==o&&Qe?.classList.contains("ytls-tooltip-visible")&&Qe.classList.remove("ytls-tooltip-visible"),Kn&&clearTimeout(Kn),o&&(Ot=o,Yn=!0),Kn=setTimeout(()=>{let a=Rd();a.textContent=e,a.classList.remove("ytls-tooltip-visible"),o?requestAnimationFrame(()=>{Xs(a,o),requestAnimationFrame(()=>{a.classList.add("ytls-tooltip-visible")})}):(Dd(a,t,n),requestAnimationFrame(()=>{a.classList.add("ytls-tooltip-visible")}))},Bd)}function Eo(){Kn&&(clearTimeout(Kn),Kn=null),Ze&&(clearTimeout(Ze),Ze=null),Qe&&Qe.classList.remove("ytls-tooltip-visible"),Ot=null,Yn=!1}function hi(){Eo()}function Ge(e,t){let n=0,o=0,a=m=>{n=m.clientX,o=m.clientY,Ze&&(clearTimeout(Ze),Ze=null),Yn=!0,Ot=e;let f=typeof t=="function"?t():t;f&&Od(f,n,o,e)},r=m=>{n=m.clientX,o=m.clientY},u=()=>{Ot===e&&(Yn=!1,Pd())};e.addEventListener("mouseenter",a),e.addEventListener("mousemove",r),e.addEventListener("mouseleave",u);let s=m=>{Yn=!1,Ot===e&&Eo()};e.addEventListener("click",s,!0);let g=new MutationObserver(()=>{if(Ot===e)try{let m=window.getComputedStyle(e);(m.display==="none"||m.visibility==="hidden"||m.opacity==="0")&&Eo()}catch{}});try{g.observe(e,{attributes:!0,attributeFilter:["class","style"]})}catch{}Ao.push(g),e.__tooltipCleanup=()=>{e.removeEventListener("mouseenter",a),e.removeEventListener("mousemove",r),e.removeEventListener("mouseleave",u),e.removeEventListener("click",s,!0);try{g.disconnect()}catch{}let m=Ao.indexOf(g);m!==-1&&Ao.splice(m,1),delete e.__tooltipObserver},e.__tooltipObserver=g}function Js(){for(let e of Ao)try{e.disconnect()}catch{}Ao.length=0,Eo()}var Br={};Fu(Br,{addTimestamp:()=>Fd,buildExportCsvPayload:()=>Xd,buildExportPayload:()=>Kd,deleteSingleTimestampFromIndexedDB:()=>$d,exportAllTimestamps:()=>Yd,exportAllTimestampsCsv:()=>Jd,getRecordsChangedSince:()=>Ti,loadFromIndexedDB:()=>jd,loadGlobalSettings:()=>hn,mergeBackupData:()=>Qd,mergeRemoteRecords:()=>Ai,onTimestampsWritten:()=>Ei,removeFromIndexedDB:()=>Wd,saveGlobalSettings:()=>Rn,saveRowsToIndexedDB:()=>Ud,saveSingleTimestampToIndexedDB:()=>Vd,saveToIndexedDB:()=>qd});var Hd="ytls-timestamps-db",Nd=4,Xn="timestamps",fn="timestamps_v2",mn="settings",pn=null,Jn=null;function vi(){if(pn)try{return pn.objectStoreNames,Promise.resolve(pn)}catch(e){l("IndexedDB connection is no longer usable:",e,"warn"),pn=null}return Jn||(Jn=zd().then(e=>(pn=e,Jn=null,e.onclose=()=>{l("IndexedDB connection closed unexpectedly","warn"),pn=null},e.onversionchange=()=>{l("IndexedDB upgrade requested by another tab; closing this connection",null,"warn"),e.close(),pn===e&&(pn=null)},e.onerror=t=>{l("IndexedDB connection error:",t,"error")},e)).catch(e=>{throw Jn=null,e}),Jn)}function Qs(e,t){let n=crypto.randomUUID(),o=0,a=e.openCursor();a.onsuccess=r=>{let u=r.target.result;u?(o++,u.update({...u.value,write_counter:o,device_id:n}),u.continue()):(t.put({key:"write_counter",value:o}),t.put({key:"device_id",value:n}),l(`Lamport migration: backfilled ${o} records, device_id=${n}`))},a.onerror=()=>{l("Lamport migration: cursor error during backfill",a.error,"error")}}function zd(){return new Promise((e,t)=>{let n=indexedDB.open(Hd,Nd);n.onupgradeneeded=o=>{let a=o.target.result,r=o.oldVersion,u=o.target.transaction;if(r<1&&a.createObjectStore(Xn,{keyPath:"video_id"}),r<2&&!a.objectStoreNames.contains(mn)&&a.createObjectStore(mn,{keyPath:"key"}),r<3){if(a.objectStoreNames.contains(Xn)){l("Exporting backup before v2 migration...");let m=u.objectStore(Xn).getAll();m.onsuccess=()=>{let f=Er.array().safeParse(m.result);if(f.success&&f.data.length>0)try{let v={},y=0;f.data.forEach(q=>{if(q.timestamps.length>0){let V=To.parse(q.timestamps);v[`ytls-${q.video_id}`]={video_id:q.video_id,timestamps:[...V].sort((ne,z)=>ne.start-z.start)},y+=V.length}});let E=new Blob([JSON.stringify(v,null,2)],{type:"application/json"}),M=URL.createObjectURL(E),N=document.createElement("a");N.href=M,N.download=`timekeeper-data-${Bn()}.json`,N.click(),URL.revokeObjectURL(M),l(`Pre-migration backup exported: ${f.data.length} videos, ${y} timestamps`)}catch(v){l("Failed to export pre-migration backup:",v,"error")}else f.success||l("Skipping pre-migration backup: legacy data failed validation",f.error.message,"warn")}}let s=a.createObjectStore(fn,{keyPath:"guid"});if(s.createIndex("video_id","video_id",{unique:!1}),s.createIndex("video_start",["video_id","start"],{unique:!1}),a.objectStoreNames.contains(Xn)){let m=u.objectStore(Xn).getAll();m.onsuccess=()=>{let f=Er.array().safeParse(m.result);if(f.success&&f.data.length>0){let v=0;f.data.forEach(y=>{y.timestamps.length>0&&y.timestamps.forEach(E=>{s.put({guid:E.guid,video_id:y.video_id,start:E.start,comment:E.comment}),v++})}),l(`Migrated ${v} timestamps from ${f.data.length} videos to v2 store`)}else f.success||l("Skipping v1 \u2192 v2 migration: legacy data failed validation",f.error.message,"warn");r<4&&Qs(u.objectStore(fn),u.objectStore(mn))},a.deleteObjectStore(Xn),l("Deleted old timestamps store after migration to v2")}}r===3&&Qs(u.objectStore(fn),u.objectStore(mn))},n.onsuccess=o=>{e(o.target.result)},n.onerror=o=>{let a=o.target.error;t(a??new Error("Failed to open IndexedDB"))},n.onblocked=()=>{l("IndexedDB open is blocked by another tab holding an older connection; waiting",null,"warn")}})}function yi(e,t,n){return vi().then(o=>new Promise((a,r)=>{let u;try{u=o.transaction(e,t)}catch(m){r(new Error(`Failed to create transaction for ${e}: ${m}`));return}let s=u.objectStore(e),g;try{g=n(s)}catch(m){r(new Error(`Failed to execute operation on ${e}: ${m}`));return}g&&(g.onsuccess=()=>a(g.result),g.onerror=()=>r(g.error??new Error(`IndexedDB ${t} operation failed`))),u.oncomplete=()=>{g||a(void 0)},u.onerror=()=>r(u.error??new Error("IndexedDB transaction failed")),u.onabort=()=>r(u.error??new Error("IndexedDB transaction aborted"))}))}var gi=new Set;function Zs(e){return gi.add(e),()=>gi.delete(e)}function _d(){for(let e of gi)try{e()}catch(t){l("Timestamp write listener failed:",t,"error")}}function Mo(e){return vi().then(t=>new Promise((n,o)=>{let a;try{a=t.transaction([fn,mn],"readwrite")}catch(r){o(new Error(`Failed to create transaction: ${r}`));return}a.oncomplete=()=>{n(),_d()},a.onerror=()=>o(new Error(`IndexedDB write failed: ${a.error?.message??"unknown"}`)),a.onabort=()=>o(new Error(`IndexedDB transaction aborted: ${a.error?.message??"unknown"}`));try{e(a.objectStore(fn),a.objectStore(mn))}catch(r){try{a.abort()}catch{}o(r instanceof Error?r:new Error(String(r)))}}))}function Io(e,t){let n=e.get("write_counter");n.onsuccess=()=>{let o=typeof n.result?.value=="number"?n.result.value:0;e.put({key:"write_counter",value:t(o)})}}function el(e,t){let n=To.safeParse(t);if(!n.success)return Promise.reject(new Error(`Invalid timestamp payload for ${e}`));let o=n.data;return Mo((a,r)=>{let u=a.index("video_id").getAll(IDBKeyRange.only(e));u.onsuccess=()=>{let s=u.result??[],g=new Map(s.map(v=>[v.guid,v])),m=new Set(o.map(v=>v.guid)),f=Date.now();Io(r,v=>{let y=v;return s.forEach(E=>{!m.has(E.guid)&&!E.deleted_at&&(y++,a.put({...E,deleted_at:f,write_counter:y}))}),o.forEach(E=>{let M=g.get(E.guid);M&&!M.deleted_at&&!E.deleted_at&&M.start===E.start&&M.comment===E.comment||(y++,a.put({guid:E.guid,video_id:e,start:E.start,comment:E.comment,write_counter:y,deleted_at:E.deleted_at??M?.deleted_at??void 0}))}),y})}})}function wi(e,t){let n=To.safeParse(t);if(!n.success)return Promise.reject(new Error(`Invalid timestamp payload for ${e}`));let o=n.data;return o.length===0?Promise.resolve():Mo((a,r)=>{Io(r,u=>{let s=u;return o.forEach(g=>{s++,a.put({guid:g.guid,video_id:e,start:g.start,comment:g.comment,write_counter:s,deleted_at:g.deleted_at})}),s})})}function tl(e,t){return wi(e,[t])}function nl(e){return e.length===0?Promise.resolve():Mo((t,n)=>{Io(n,o=>{let a=o;return e.forEach(r=>{r.write_counter!==void 0&&r.write_counter>a&&(a=r.write_counter)}),e.forEach(r=>{let u={guid:r.guid,video_id:r.video_id,start:r.start,comment:r.comment,deleted_at:r.deleted_at,write_counter:r.write_counter??++a};t.put(u)}),a+1})})}function ol(e){return l(`Soft-deleting timestamp ${e}`),Mo((t,n)=>{let o=t.get(e);o.onsuccess=()=>{let a=o.result;a&&Io(n,r=>(t.put({...a,deleted_at:Date.now(),write_counter:r+1}),r+1))}})}function rl(e){return vi().then(t=>new Promise((n,o)=>{let a;try{a=t.transaction([fn],"readonly")}catch(u){let s=`Failed to create read transaction: ${u}`;l(s,u,"error"),o(new Error(s));return}a.onabort=()=>{let u=`Transaction aborted during load: ${a.error?.message??"unknown"}`;l(u,a.error,"error"),o(new Error(u))};let r=a.objectStore(fn).index("video_id").getAll(IDBKeyRange.only(e));r.onsuccess=()=>{try{let u=r.result.filter(m=>!m.deleted_at),s=[],g=0;for(let m of u){let f=Ar.safeParse({guid:m.guid,start:m.start,comment:m.comment});f.success?s.push(f.data):g++}if(g>0&&l(`Skipped ${g} stored timestamps for ${e} that failed validation`,null,"warn"),s.length===0){g>0?o(new Error(`Stored timestamps for this video failed validation (${g} rows)`)):n(null);return}n(s.sort((m,f)=>m.start-f.start))}catch(u){o(u)}},r.onerror=()=>{let u=`Failed to load timestamps from IndexedDB: ${r.error?.message??"unknown error"}`;l(u,r.error,"error"),o(new Error(u))}}))}function il(e){return Mo((t,n)=>{let o=t.index("video_id").getAll(IDBKeyRange.only(e));o.onsuccess=()=>{let a=o.result??[],r=Date.now();Io(n,u=>{let s=u;return a.forEach(g=>{g.deleted_at||(s++,t.put({...g,deleted_at:r,write_counter:s}))}),s})}})}function Lo(){return yi(fn,"readonly",e=>e.getAll()).then(e=>Array.isArray(e)?e:[])}function al(e,t){return yi(mn,"readwrite",n=>{n.put({key:e,value:t})}).then(()=>{}).catch(n=>{l(`Failed to save setting '${e}' to IndexedDB:`,n,"error")})}function sl(e){return yi(mn,"readonly",t=>t.get(e)).then(t=>t?.value).catch(t=>{l(`Failed to load setting '${e}' from IndexedDB:`,t,"error")})}async function bi({includeDeleted:e=!1}={}){let t={},n=await Lo(),o=[],a=0;for(let v of n){let y=un.safeParse(v);y.success?o.push(y.data):a++}a>0&&l(`Skipped ${a} timestamp rows that failed validation during export`,null,"warn");let u=[...e?o:o.filter(v=>!v.deleted_at)].sort((v,y)=>{let E=v.video_id.localeCompare(y.video_id);if(E!==0)return E;let M=v.start-y.start;return M!==0?M:v.guid.localeCompare(y.guid)}),s=new Map;for(let v of u)s.has(v.video_id)||s.set(v.video_id,[]),s.get(v.video_id).push({guid:v.guid,start:v.start,comment:v.comment,write_counter:v.write_counter,deleted_at:v.deleted_at});let g=Array.from(s.keys()).sort((v,y)=>v.localeCompare(y));for(let v of g){let y=s.get(v);t[`ytls-${v}`]={video_id:v,timestamps:y}}return{json:JSON.stringify(t,null,2),filename:"timekeeper-data.json",totalVideos:s.size,totalTimestamps:u.length,invalidRows:a}}async function cl(){try{let{json:e,filename:t,totalVideos:n,totalTimestamps:o}=await bi(),a=new Blob([e],{type:"application/json"}),r=URL.createObjectURL(a),u=document.createElement("a");u.href=r,u.download=t,u.click(),URL.revokeObjectURL(r),l(`Exported ${n} videos with ${o} timestamps`)}catch(e){throw l("Failed to export data:",e,"error"),e}}async function xi(){let e=un.array().safeParse((await Lo()).filter(m=>!m.deleted_at));if(!e.success||e.data.length===0){e.success||l("Failed to parse timestamp rows for CSV export:",e.error.message,"warn");let m=`Tag,Timestamp,URL
`,f=`timestamps-${Bn()}.csv`;return{csv:m,filename:f,totalVideos:0,totalTimestamps:0}}let t=e.data,n=new Map;for(let m of t)n.has(m.video_id)||n.set(m.video_id,[]),n.get(m.video_id).push({start:m.start,comment:m.comment});let o=[];o.push("Tag,Timestamp,URL");let a=0,r=m=>`"${String(m).replace(/"/g,'""')}"`,u=Array.from(n.keys()).sort();for(let m of u){let f=n.get(m).sort((v,y)=>v.start-y.start);for(let v of f){let y=v.comment,E=dn(v.start,36e3),M=$s(v.start,`https://www.youtube.com/watch?v=${m}`);o.push([r(y),r(E),r(M)].join(",")),a++}}let s=o.join(`
`),g=`timestamps-${Bn()}.csv`;return{csv:s,filename:g,totalVideos:n.size,totalTimestamps:a}}async function ul(){try{let{csv:e,filename:t,totalVideos:n,totalTimestamps:o}=await xi(),a=new Blob([e],{type:"text/csv;charset=utf-8;"}),r=URL.createObjectURL(a),u=document.createElement("a");u.href=r,u.download=t,u.click(),URL.revokeObjectURL(r),l(`Exported ${n} videos with ${o} timestamps (CSV)`)}catch(e){throw l("Failed to export CSV data:",e,"error"),e}}async function Si(e,t){if(!e)throw new Error("Video ID is required");if(!t.guid||t.start==null)throw new Error("Timestamp must have GUID and start time");return tl(e,t)}async function dl(e,t){if(!e)throw new Error("Video ID is required");return wi(e,t)}async function pl(e,t){if(!e)throw new Error("Video ID is required");if(!Array.isArray(t))throw new Error("Timestamps must be an array");return el(e,t)}async function ml(e){if(!e)throw new Error("GUID is required");return ol(e)}async function fl(e){if(!e)throw new Error("Video ID is required");return il(e)}async function hl(e){if(!e)throw new Error("Video ID is required");return rl(e)}async function ki(e){let t;try{t=JSON.parse(e)}catch{return l("mergeBackupData: failed to parse JSON",null,"warn"),{mergedVideos:0,mergedTimestamps:0}}let n=ls.safeParse(t);if(!n.success)return l("mergeBackupData: data failed validation",n.error.message,"warn"),{mergedVideos:0,mergedTimestamps:0};let o=await Lo(),a=new Map;for(let g of o)a.set(g.guid,g);let r=0,u=0,s=[];for(let[,g]of Object.entries(n.data)){let{video_id:m,timestamps:f}=g,v=0;for(let y of f){let E=a.get(y.guid),M=!1;E?E.write_counter!==void 0&&y.write_counter!==void 0&&y.write_counter>E.write_counter&&(M=!0):M=!0,M&&(s.push({guid:y.guid,video_id:m,start:y.start,comment:y.comment,write_counter:y.write_counter,deleted_at:y.deleted_at}),a.set(y.guid,{...E??{},guid:y.guid,video_id:m,start:y.start,comment:y.comment,write_counter:y.write_counter,deleted_at:y.deleted_at}),v++,u++)}v>0&&r++}return await nl(s),{mergedVideos:r,mergedTimestamps:u}}async function gl(e){let t=[];for(let n of await Lo()){let o=un.safeParse(n);if(!o.success||o.data.write_counter===void 0||o.data.write_counter<=e)continue;let{guid:a,video_id:r,start:u,comment:s,write_counter:g,deleted_at:m}=o.data;t.push({guid:a,video_id:r,start:u,comment:s,write_counter:g,...m!==void 0?{deleted_at:m}:{}})}return t.sort((n,o)=>n.write_counter-o.write_counter)}function vl(e){var n;let t={};for(let{video_id:o,...a}of e)(t[n=`ytls-${o}`]??(t[n]={video_id:o,timestamps:[]})).timestamps.push(a);return ki(JSON.stringify(t))}function yl(e,t){if(!e)throw new Error("Setting key is required");return al(e,t)}async function wl(e){if(!e)throw new Error("Setting key is required");return sl(e)}function Fd(e,t){return Si(e,t)}function Ud(e,t){return dl(e,t)}function qd(e,t){return pl(e,t)}function Vd(e,t){return Si(e,t)}function jd(e){return hl(e)}function $d(e,t){return ml(t)}function Wd(e){return fl(e)}function Rn(e,t){yl(e,t)}function hn(e){return wl(e)}function Kd(e){return bi(e)}function Yd(){return cl()}function Xd(){return xi()}function Jd(){return ul()}function Qd(e){return ki(e)}function Ti(e){return gl(e)}function Ai(e){return vl(e)}function Ei(e){return Zs(e)}function Rr(e){return e?Array.from(e.querySelectorAll("li:not(.ytls-placeholder):not(.ytls-error-message)")):[]}function Dr(e){if(!e)return;e.replaceChildren();let t=e.querySelector(".ytls-error-message");t&&t.remove()}function Mi(e,t){if(!e)return;Dr(e);let n=document.createElement("li");n.className="ytls-placeholder",n.textContent=t,e.appendChild(n),e.style.overflowY="hidden"}function bl(e){if(!e)return;let t=e.querySelector(".ytls-placeholder");t&&t.remove(),e.style.overflowY=""}function Co(e){return e?e.querySelector(".ytls-error-message")!==null:!1}function xl(e,t){if(!e)return;Dr(e);let n=document.createElement("li");n.className="ytls-error-message",n.style.cssText=`
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
  `,n.innerHTML=`<div style="margin-bottom:8px">\u26A0\uFE0F ${Zd(t)}</div><div style="font-size:12px;font-weight:normal;color:#aaa">Check the console for details or refresh the page.</div>`,e.appendChild(n),e.style.overflowY="hidden"}function Sl(e){if(!e)return;let t=e.querySelector(".ytls-error-message");t&&t.remove()}function Zd(e){let t=document.createElement("div");return t.textContent=e,t.innerHTML}function kl(e,t){if(!e||t||Co(e))return;Array.from(e.children).some(o=>!o.classList.contains("ytls-placeholder")&&!o.classList.contains("ytls-error-message"))||Mi(e,"No timestamps for this video")}function Tl(e){if(!e)return[];let t=Rr(e),n=[];return t.forEach(o=>{let a=o.querySelector("[data-time]"),r=o.querySelector("input"),u=o.dataset.guid;if(!a||!r||!u)return;let s=a.dataset.time;if(!s)return;let g=Number.parseInt(s,10);Number.isFinite(g)&&n.push({guid:u,start:g,comment:r.value})}),n.sort((o,a)=>o.start-a.start)}function Al(e){if(!e)return 0;let t=Rr(e),n=0;return t.forEach(o=>{let r=o.querySelector("[data-time]")?.dataset.time;if(r){let u=Number.parseInt(r,10);Number.isFinite(u)&&(n=Math.max(n,u))}}),n}var tp={auth:{googleAuthState:{isSignedIn:!1,accessToken:null,userName:null,email:null},syncAuthState:$n,autoBackupEnabled:!0,autoBackupIntervalMinutes:30,autoBackupRetryAttempts:0,autoBackupBackoffMs:null,lastAutoBackupAt:null,isAutoBackupRunning:!1},ui:{panePosition:null,currentVideoId:"",minPaneHeight:250,lastHandledUrl:null,urlChangeHandlersSetup:!1},timestamps:{items:[],currentIndex:null,dbError:null}},it=JSON.parse(JSON.stringify(tp));function $e(){return it}function Pr(e){it={...it,...e,auth:{...it.auth,...e.auth||{}},ui:{...it.ui,...e.ui||{}},timestamps:{...it.timestamps,...e.timestamps||{}}}}function gn(e,t){Pr({auth:{...it.auth,[e]:t}})}function Or(e,t){Pr({ui:{...it.ui,[e]:t}})}function Ht(){return it.auth.googleAuthState}function Mt(e){gn("googleAuthState",e)}function El(){return it.auth.syncAuthState}function Dn(e){gn("syncAuthState",e)}function Ii(e){gn("autoBackupEnabled",e)}function Li(e){gn("autoBackupIntervalMinutes",e)}function Ci(e){gn("isAutoBackupRunning",e)}function Hr(e){gn("autoBackupRetryAttempts",e)}function Qn(e){gn("autoBackupBackoffMs",e)}function Bi(e){gn("lastAutoBackupAt",e)}function Ml(e){Or("minPaneHeight",e)}function Il(e){Or("panePosition",e)}function Ll(e){Or("lastHandledUrl",e)}function Cl(e){Or("urlChangeHandlersSetup",e)}function Bl(e){Pr({timestamps:{...it.timestamps,items:e}})}function Ri(e){Pr({timestamps:{...it.timestamps,dbError:e}})}function Rl(){return it.timestamps.dbError}var Pn=typeof unsafeWindow<"u"?unsafeWindow:window,zl=43200*14,Dl="html5_max_live_dvr_window_plus_margin_secs";function Kt(e){return e!=null&&typeof e=="object"}function Pl(e){let{streamingData:t,videoDetails:n,playerConfig:o,microformat:a}=e;if(!Kt(n)||!n.isLive)return;let r=n.isLiveDvrEnabled===!0;if(n.isLiveDvrEnabled=!0,!r&&Kt(o)){let u=o.mediaCommonConfig;if(Kt(u)){u.useServerDrivenAbr=!1;let s=u.serverPlaybackStartConfig;Kt(s)&&(s.enable=!1)}}if(Kt(t)){let u=t;if(Array.isArray(u.adaptiveFormats)&&np(a))for(let s of u.adaptiveFormats)s.maxDvrDurationSec=zl}}function np(e){if(!Kt(e))return!1;let t=e.playerMicroformatRenderer;if(!Kt(t))return!1;let n=t.liveBroadcastDetails;if(!Kt(n))return!1;let o=n.startTimestamp;return!o||typeof o!="string"?!1:(Date.now()-new Date(o).getTime())/1e3>43200}function Pi(e){if(!e||typeof e!="object")return!1;let t=e;return t.videoDetails?(Pl(t),!0):t.playerResponse&&Kt(t.playerResponse)&&t.playerResponse.videoDetails?(Pl(t.playerResponse),!0):!1}function op(){let e=Object.getOwnPropertyDescriptor(Pn,"ytInitialPlayerResponse"),t=e&&e.set,n=Pn.ytInitialPlayerResponse;if(!Pi(n))try{Object.defineProperty(Pn,"ytInitialPlayerResponse",{configurable:!0,get(){return n},set(o){t&&t.call(this,o),n=o,Pi(o)&&Object.defineProperty(Pn,"ytInitialPlayerResponse",{configurable:!0,writable:!0,value:o})}})}catch{}}var Ol=!1;function rp(){if(Ol)return;Ol=!0;let e=JSON.parse;JSON.parse=function(t,n){let o=e.call(this,t,n);try{Pi(o)}catch{}return o}}function Hl(e){if(e.__dvrCapLifted)return;let n=(typeof e.d=="function"?e.d():void 0)?.WEB_PLAYER_CONTEXT_CONFIGS;if(!n)return;let o=n;for(let a in o){let r=o[a];if(r&&typeof r.serializedExperimentFlags=="string"){let u=r.serializedExperimentFlags,s=u.replace(new RegExp(`${Dl}=[\\d.]+`),`${Dl}=${zl}`);s!==u&&(r.serializedExperimentFlags=s)}}e.__dvrCapLifted=!0}function Nl(e){if(!e||e.__dvrHooked)return e;e.__dvrHooked=!0;let t=e.set;typeof t=="function"&&(e.set=function(...n){let o=t.apply(this,n);try{Hl(e)}catch{}return o});try{Hl(e)}catch{}return e}function ip(){let e={};Pn.ytcfg&&(e=Nl(Pn.ytcfg));try{Object.defineProperty(Pn,"ytcfg",{configurable:!0,get(){return e},set(t){e=Nl(t)}})}catch{}}function _l(){op(),rp(),ip(),l("[Timekeeper] DVR/Rewind enablement initialized for live streams")}var Oi="#author-name, #author-text";function Gl(){return window.top!==window.self&&window.location.pathname.startsWith("/live_chat")}function Hi(e){let t=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);for(let n=t.nextNode();n;n=t.nextNode()){let o=n.nodeValue??"";if(o.trim()){/^\s*@/.test(o)&&(n.nodeValue=o.replace(/^(\s*)@/,"$1"));return}}}function Ni(e){if(e.nodeType===Node.TEXT_NODE){let t=e.parentElement?.closest(Oi);t&&Hi(t);return}e instanceof Element&&(e.matches(Oi)&&Hi(e),e.querySelectorAll(Oi).forEach(Hi))}function Fl(){let e=new MutationObserver(t=>{for(let n of t)n.type==="characterData"?Ni(n.target):n.addedNodes.forEach(Ni)});document.documentElement&&Ni(document.documentElement),e.observe(document,{childList:!0,subtree:!0,characterData:!0})}var ge=Uint8Array,at=Uint16Array,Ki=Int32Array,Nr=new ge([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),zr=new ge([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Ui=new ge([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Kl=function(e,t){for(var n=new at(31),o=0;o<31;++o)n[o]=t+=1<<e[o-1];for(var a=new Ki(n[30]),o=1;o<30;++o)for(var r=n[o];r<n[o+1];++r)a[r]=r-n[o]<<5|o;return{b:n,r:a}},Yl=Kl(Nr,2),Xl=Yl.b,qi=Yl.r;Xl[28]=258,qi[258]=28;var Jl=Kl(zr,0),ap=Jl.b,Ul=Jl.r,Vi=new at(32768);for(Y=0;Y<32768;++Y)Yt=(Y&43690)>>1|(Y&21845)<<1,Yt=(Yt&52428)>>2|(Yt&13107)<<2,Yt=(Yt&61680)>>4|(Yt&3855)<<4,Vi[Y]=((Yt&65280)>>8|(Yt&255)<<8)>>1;var Yt,Y,zt=(function(e,t,n){for(var o=e.length,a=0,r=new at(t);a<o;++a)e[a]&&++r[e[a]-1];var u=new at(t);for(a=1;a<t;++a)u[a]=u[a-1]+r[a-1]<<1;var s;if(n){s=new at(1<<t);var g=15-t;for(a=0;a<o;++a)if(e[a])for(var m=a<<4|e[a],f=t-e[a],v=u[e[a]-1]++<<f,y=v|(1<<f)-1;v<=y;++v)s[Vi[v]>>g]=m}else for(s=new at(o),a=0;a<o;++a)e[a]&&(s[a]=Vi[u[e[a]-1]++]>>15-e[a]);return s}),vn=new ge(288);for(Y=0;Y<144;++Y)vn[Y]=8;var Y;for(Y=144;Y<256;++Y)vn[Y]=9;var Y;for(Y=256;Y<280;++Y)vn[Y]=7;var Y;for(Y=280;Y<288;++Y)vn[Y]=8;var Y,Do=new ge(32);for(Y=0;Y<32;++Y)Do[Y]=5;var Y,sp=zt(vn,9,0),lp=zt(vn,9,1),cp=zt(Do,5,0),up=zt(Do,5,1),zi=function(e){for(var t=e[0],n=1;n<e.length;++n)e[n]>t&&(t=e[n]);return t},It=function(e,t,n){var o=t/8|0;return(e[o]|e[o+1]<<8)>>(t&7)&n},_i=function(e,t){var n=t/8|0;return(e[n]|e[n+1]<<8|e[n+2]<<16)>>(t&7)},Yi=function(e){return(e+7)/8|0},Po=function(e,t,n){return(t==null||t<0)&&(t=0),(n==null||n>e.length)&&(n=e.length),new ge(e.subarray(t,n))};var dp=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],Fe=function(e,t,n){var o=new Error(t||dp[e]);if(o.code=e,Error.captureStackTrace&&Error.captureStackTrace(o,Fe),!n)throw o;return o},pp=function(e,t,n,o){var a=e.length,r=o?o.length:0;if(!a||t.f&&!t.l)return n||new ge(0);var u=!n,s=u||t.i!=2,g=t.i;u&&(n=new ge(a*3));var m=function(Jt){var Sn=n.length;if(Jt>Sn){var Lt=new ge(Math.max(Sn*2,Jt));Lt.set(n),n=Lt}},f=t.f||0,v=t.p||0,y=t.b||0,E=t.l,M=t.d,N=t.m,q=t.n,V=a*8;do{if(!E){f=It(e,v,1);var ne=It(e,v+1,3);if(v+=3,ne)if(ne==1)E=lp,M=up,N=9,q=5;else if(ne==2){var me=It(e,v,31)+257,ee=It(e,v+10,15)+4,G=me+It(e,v+5,31)+1;v+=14;for(var D=new ge(G),ve=new ge(19),ie=0;ie<ee;++ie)ve[Ui[ie]]=It(e,v+ie*3,7);v+=ee*3;for(var be=zi(ve),vt=(1<<be)-1,Ue=zt(ve,be,1),ie=0;ie<G;){var Ne=Ue[It(e,v,vt)];v+=Ne&15;var z=Ne>>4;if(z<16)D[ie++]=z;else{var xe=0,ce=0;for(z==16?(ce=3+It(e,v,3),v+=2,xe=D[ie-1]):z==17?(ce=3+It(e,v,7),v+=3):z==18&&(ce=11+It(e,v,127),v+=7);ce--;)D[ie++]=xe}}var Ee=D.subarray(0,me),ue=D.subarray(me);N=zi(Ee),q=zi(ue),E=zt(Ee,N,1),M=zt(ue,q,1)}else Fe(1);else{var z=Yi(v)+4,X=e[z-4]|e[z-3]<<8,le=z+X;if(le>a){g&&Fe(0);break}s&&m(y+X),n.set(e.subarray(z,le),y),t.b=y+=X,t.p=v=le*8,t.f=f;continue}if(v>V){g&&Fe(0);break}}s&&m(y+131072);for(var De=(1<<N)-1,Se=(1<<q)-1,ke=v;;ke=v){var xe=E[_i(e,v)&De],qe=xe>>4;if(v+=xe&15,v>V){g&&Fe(0);break}if(xe||Fe(2),qe<256)n[y++]=qe;else if(qe==256){ke=v,E=null;break}else{var ze=qe-254;if(qe>264){var ie=qe-257,de=Nr[ie];ze=It(e,v,(1<<de)-1)+Xl[ie],v+=de}var st=M[_i(e,v)&Se],Gt=st>>4;st||Fe(3),v+=st&15;var ue=ap[Gt];if(Gt>3){var de=zr[Gt];ue+=_i(e,v)&(1<<de)-1,v+=de}if(v>V){g&&Fe(0);break}s&&m(y+131072);var Te=y+ze;if(y<ue){var lt=r-ue,J=Math.min(ue,Te);for(lt+y<0&&Fe(3);y<J;++y)n[y]=o[lt+y]}for(;y<Te;++y)n[y]=n[y-ue]}}t.l=E,t.p=ke,t.b=y,t.f=f,E&&(f=1,t.m=N,t.d=M,t.n=q)}while(!f);return y!=n.length&&u?Po(n,0,y):n.subarray(0,y)},Xt=function(e,t,n){n<<=t&7;var o=t/8|0;e[o]|=n,e[o+1]|=n>>8},Bo=function(e,t,n){n<<=t&7;var o=t/8|0;e[o]|=n,e[o+1]|=n>>8,e[o+2]|=n>>16},Gi=function(e,t){for(var n=[],o=0;o<e.length;++o)e[o]&&n.push({s:o,f:e[o]});var a=n.length,r=n.slice();if(!a)return{t:Zl,l:0};if(a==1){var u=new ge(n[0].s+1);return u[n[0].s]=1,{t:u,l:1}}n.sort(function(le,me){return le.f-me.f}),n.push({s:-1,f:25001});var s=n[0],g=n[1],m=0,f=1,v=2;for(n[0]={s:-1,f:s.f+g.f,l:s,r:g};f!=a-1;)s=n[n[m].f<n[v].f?m++:v++],g=n[m!=f&&n[m].f<n[v].f?m++:v++],n[f++]={s:-1,f:s.f+g.f,l:s,r:g};for(var y=r[0].s,o=1;o<a;++o)r[o].s>y&&(y=r[o].s);var E=new at(y+1),M=ji(n[f-1],E,0);if(M>t){var o=0,N=0,q=M-t,V=1<<q;for(r.sort(function(me,ee){return E[ee.s]-E[me.s]||me.f-ee.f});o<a;++o){var ne=r[o].s;if(E[ne]>t)N+=V-(1<<M-E[ne]),E[ne]=t;else break}for(N>>=q;N>0;){var z=r[o].s;E[z]<t?N-=1<<t-E[z]++-1:++o}for(;o>=0&&N;--o){var X=r[o].s;E[X]==t&&(--E[X],++N)}M=t}return{t:new ge(E),l:M}},ji=function(e,t,n){return e.s==-1?Math.max(ji(e.l,t,n+1),ji(e.r,t,n+1)):t[e.s]=n},ql=function(e){for(var t=e.length;t&&!e[--t];);for(var n=new at(++t),o=0,a=e[0],r=1,u=function(g){n[o++]=g},s=1;s<=t;++s)if(e[s]==a&&s!=t)++r;else{if(!a&&r>2){for(;r>138;r-=138)u(32754);r>2&&(u(r>10?r-11<<5|28690:r-3<<5|12305),r=0)}else if(r>3){for(u(a),--r;r>6;r-=6)u(8304);r>2&&(u(r-3<<5|8208),r=0)}for(;r--;)u(a);r=1,a=e[s]}return{c:n.subarray(0,o),n:t}},Ro=function(e,t){for(var n=0,o=0;o<t.length;++o)n+=e[o]*t[o];return n},Ql=function(e,t,n){var o=n.length,a=Yi(t+2);e[a]=o&255,e[a+1]=o>>8,e[a+2]=e[a]^255,e[a+3]=e[a+1]^255;for(var r=0;r<o;++r)e[a+r+4]=n[r];return(a+4+o)*8},Vl=function(e,t,n,o,a,r,u,s,g,m,f){Xt(t,f++,n),++a[256];for(var v=Gi(a,15),y=v.t,E=v.l,M=Gi(r,15),N=M.t,q=M.l,V=ql(y),ne=V.c,z=V.n,X=ql(N),le=X.c,me=X.n,ee=new at(19),G=0;G<ne.length;++G)++ee[ne[G]&31];for(var G=0;G<le.length;++G)++ee[le[G]&31];for(var D=Gi(ee,7),ve=D.t,ie=D.l,be=19;be>4&&!ve[Ui[be-1]];--be);var vt=m+5<<3,Ue=Ro(a,vn)+Ro(r,Do)+u,Ne=Ro(a,y)+Ro(r,N)+u+14+3*be+Ro(ee,ve)+2*ee[16]+3*ee[17]+7*ee[18];if(g>=0&&vt<=Ue&&vt<=Ne)return Ql(t,f,e.subarray(g,g+m));var xe,ce,Ee,ue;if(Xt(t,f,1+(Ne<Ue)),f+=2,Ne<Ue){xe=zt(y,E,0),ce=y,Ee=zt(N,q,0),ue=N;var De=zt(ve,ie,0);Xt(t,f,z-257),Xt(t,f+5,me-1),Xt(t,f+10,be-4),f+=14;for(var G=0;G<be;++G)Xt(t,f+3*G,ve[Ui[G]]);f+=3*be;for(var Se=[ne,le],ke=0;ke<2;++ke)for(var qe=Se[ke],G=0;G<qe.length;++G){var ze=qe[G]&31;Xt(t,f,De[ze]),f+=ve[ze],ze>15&&(Xt(t,f,qe[G]>>5&127),f+=qe[G]>>12)}}else xe=sp,ce=vn,Ee=cp,ue=Do;for(var G=0;G<s;++G){var de=o[G];if(de>255){var ze=de>>18&31;Bo(t,f,xe[ze+257]),f+=ce[ze+257],ze>7&&(Xt(t,f,de>>23&31),f+=Nr[ze]);var st=de&31;Bo(t,f,Ee[st]),f+=ue[st],st>3&&(Bo(t,f,de>>5&8191),f+=zr[st])}else Bo(t,f,xe[de]),f+=ce[de]}return Bo(t,f,xe[256]),f+ce[256]},mp=new Ki([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),Zl=new ge(0),fp=function(e,t,n,o,a,r){var u=r.z||e.length,s=new ge(o+u+5*(1+Math.ceil(u/7e3))+a),g=s.subarray(o,s.length-a),m=r.l,f=(r.r||0)&7;if(t){f&&(g[0]=r.r>>3);for(var v=mp[t-1],y=v>>13,E=v&8191,M=(1<<n)-1,N=r.p||new at(32768),q=r.h||new at(M+1),V=Math.ceil(n/3),ne=2*V,z=function(ao){return(e[ao]^e[ao+1]<<V^e[ao+2]<<ne)&M},X=new Ki(25e3),le=new at(288),me=new at(32),ee=0,G=0,D=r.i||0,ve=0,ie=r.w||0,be=0;D+2<u;++D){var vt=z(D),Ue=D&32767,Ne=q[vt];if(N[Ue]=Ne,q[vt]=Ue,ie<=D){var xe=u-D;if((ee>7e3||ve>24576)&&(xe>423||!m)){f=Vl(e,g,0,X,le,me,G,ve,be,D-be,f),ve=ee=G=0,be=D;for(var ce=0;ce<286;++ce)le[ce]=0;for(var ce=0;ce<30;++ce)me[ce]=0}var Ee=2,ue=0,De=E,Se=Ue-Ne&32767;if(xe>2&&vt==z(D-Se))for(var ke=Math.min(y,xe)-1,qe=Math.min(32767,D),ze=Math.min(258,xe);Se<=qe&&--De&&Ue!=Ne;){if(e[D+Ee]==e[D+Ee-Se]){for(var de=0;de<ze&&e[D+de]==e[D+de-Se];++de);if(de>Ee){if(Ee=de,ue=Se,de>ke)break;for(var st=Math.min(Se,de-2),Gt=0,ce=0;ce<st;++ce){var Te=D-Se+ce&32767,lt=N[Te],J=Te-lt&32767;J>Gt&&(Gt=J,Ne=Te)}}}Ue=Ne,Ne=N[Ue],Se+=Ue-Ne&32767}if(ue){X[ve++]=268435456|qi[Ee]<<18|Ul[ue];var Jt=qi[Ee]&31,Sn=Ul[ue]&31;G+=Nr[Jt]+zr[Sn],++le[257+Jt],++me[Sn],ie=D+Ee,++ee}else X[ve++]=e[D],++le[e[D]]}}for(D=Math.max(D,ie);D<u;++D)X[ve++]=e[D],++le[e[D]];f=Vl(e,g,m,X,le,me,G,ve,be,D-be,f),m||(r.r=f&7|g[f/8|0]<<3,f-=7,r.h=q,r.p=N,r.i=D,r.w=ie)}else{for(var D=r.w||0;D<u+m;D+=65535){var Lt=D+65535;Lt>=u&&(g[f/8|0]=m,Lt=u),f=Ql(g,f+1,e.subarray(D,Lt))}r.i=u}return Po(s,0,o+Yi(f)+a)},hp=(function(){for(var e=new Int32Array(256),t=0;t<256;++t){for(var n=t,o=9;--o;)n=(n&1&&-306674912)^n>>>1;e[t]=n}return e})(),gp=function(){var e=-1;return{p:function(t){for(var n=e,o=0;o<t.length;++o)n=hp[n&255^t[o]]^n>>>8;e=n},d:function(){return~e}}};var vp=function(e,t,n,o,a){if(!a&&(a={l:1},t.dictionary)){var r=t.dictionary.subarray(-32768),u=new ge(r.length+e.length);u.set(r),u.set(e,r.length),e=u,a.w=r.length}return fp(e,t.level==null?6:t.level,t.mem==null?a.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+t.mem,n,o,a)},ec=function(e,t){var n={};for(var o in e)n[o]=e[o];for(var o in t)n[o]=t[o];return n};var Nt=function(e,t){return e[t]|e[t+1]<<8},pt=function(e,t){return(e[t]|e[t+1]<<8|e[t+2]<<16|e[t+3]<<24)>>>0},Fi=function(e,t){return pt(e,t)+pt(e,t+4)*4294967296},He=function(e,t,n){for(;n;++t)e[t]=n,n>>>=8};function yp(e,t){return vp(e,t||{},0,0)}function wp(e,t){return pp(e,{i:2},t&&t.out,t&&t.dictionary)}var tc=function(e,t,n,o){for(var a in e){var r=e[a],u=t+a,s=o;Array.isArray(r)&&(s=ec(o,r[1]),r=r[0]),ArrayBuffer.isView(r)?n[u]=[r,s]:(n[u+="/"]=[new ge(0),s],tc(r,u,n,o))}},jl=typeof TextEncoder<"u"&&new TextEncoder,$i=typeof TextDecoder<"u"&&new TextDecoder,bp=0;try{$i.decode(Zl,{stream:!0}),bp=1}catch{}var xp=function(e){for(var t="",n=0;;){var o=e[n++],a=(o>127)+(o>223)+(o>239);if(n+a>e.length)return{s:t,r:Po(e,n-1)};a?a==3?(o=((o&15)<<18|(e[n++]&63)<<12|(e[n++]&63)<<6|e[n++]&63)-65536,t+=String.fromCharCode(55296|o>>10,56320|o&1023)):a&1?t+=String.fromCharCode((o&31)<<6|e[n++]&63):t+=String.fromCharCode((o&15)<<12|(e[n++]&63)<<6|e[n++]&63):t+=String.fromCharCode(o)}};function $l(e,t){if(t){for(var n=new ge(e.length),o=0;o<e.length;++o)n[o]=e.charCodeAt(o);return n}if(jl)return jl.encode(e);for(var a=e.length,r=new ge(e.length+(e.length>>1)),u=0,s=function(f){r[u++]=f},o=0;o<a;++o){if(u+5>r.length){var g=new ge(u+8+(a-o<<1));g.set(r),r=g}var m=e.charCodeAt(o);m<128||t?s(m):m<2048?(s(192|m>>6),s(128|m&63)):m>55295&&m<57344?(m=65536+(m&1047552)|e.charCodeAt(++o)&1023,s(240|m>>18),s(128|m>>12&63),s(128|m>>6&63),s(128|m&63)):(s(224|m>>12),s(128|m>>6&63),s(128|m&63))}return Po(r,0,u)}function Sp(e,t){if(t){for(var n="",o=0;o<e.length;o+=16384)n+=String.fromCharCode.apply(null,e.subarray(o,o+16384));return n}else{if($i)return $i.decode(e);var a=xp(e),r=a.s,n=a.r;return n.length&&Fe(8),r}}var kp=function(e,t){return t+30+Nt(e,t+26)+Nt(e,t+28)},Tp=function(e,t,n){var o=Nt(e,t+28),a=Nt(e,t+30),r=Sp(e.subarray(t+46,t+46+o),!(Nt(e,t+8)&2048)),u=t+46+o,s=Ap(e,u,a,n,pt(e,t+20),pt(e,t+24),pt(e,t+42)),g=s[0],m=s[1],f=s[2];return[Nt(e,t+10),g,m,r,u+a+Nt(e,t+32),f]},Ap=function(e,t,n,o,a,r,u){var s=a==4294967295,g=r==4294967295,m=u==4294967295,f=t+n,v=s+g+m;if(o&&v){for(;t+4<f;t+=4+Nt(e,t+2))if(Nt(e,t)==1)return[s?Fi(e,t+4+8*g):a,g?Fi(e,t+4):r,m?Fi(e,t+4+8*(g+s)):u,1];o<2&&Fe(13)}return[a,r,u,0]},Wi=function(e){var t=0;if(e)for(var n in e){var o=e[n].length;o>65535&&Fe(9),t+=o+4}return t},Wl=function(e,t,n,o,a,r,u,s){var g=o.length,m=n.extra,f=s&&s.length,v=Wi(m);He(e,t,u!=null?33639248:67324752),t+=4,u!=null&&(e[t++]=20,e[t++]=n.os),e[t]=20,t+=2,e[t++]=n.flag<<1|(r<0&&8),e[t++]=a&&8,e[t++]=n.compression&255,e[t++]=n.compression>>8;var y=new Date(n.mtime==null?Date.now():n.mtime),E=y.getFullYear()-1980;if((E<0||E>119)&&Fe(10),He(e,t,E<<25|y.getMonth()+1<<21|y.getDate()<<16|y.getHours()<<11|y.getMinutes()<<5|y.getSeconds()>>1),t+=4,r!=-1&&(He(e,t,n.crc),He(e,t+4,r<0?-r-2:r),He(e,t+8,n.size)),He(e,t+12,g),He(e,t+14,v),t+=16,u!=null&&(He(e,t,f),He(e,t+6,n.attrs),He(e,t+10,u),t+=14),e.set(o,t),t+=g,v)for(var M in m){var N=m[M],q=N.length;He(e,t,+M),He(e,t+2,q),e.set(N,t+4),t+=4+q}return f&&(e.set(s,t),t+=f),t},Ep=function(e,t,n,o,a){He(e,t,101010256),He(e,t+8,n),He(e,t+10,n),He(e,t+12,o),He(e,t+16,a)};function nc(e,t){t||(t={});var n={},o=[];tc(e,"",n,t);var a=0,r=0;for(var u in n){var s=n[u],g=s[0],m=s[1],f=m.level==0?0:8,v=$l(u),y=v.length,E=m.comment,M=E&&$l(E),N=M&&M.length,q=Wi(m.extra);y>65535&&Fe(11);var V=f?yp(g,m):g,ne=V.length,z=gp();z.p(g),o.push(ec(m,{size:g.length,crc:z.d(),c:V,f:v,m:M,u:y!=u.length||M&&E.length!=N,o:a,compression:f})),a+=30+y+q+ne,r+=76+2*(y+q)+(N||0)+ne}for(var X=new ge(r+22),le=a,me=r-a,ee=0;ee<o.length;++ee){var v=o[ee];Wl(X,v.o,v,v.f,v.u,v.c.length);var G=30+v.f.length+Wi(v.extra);X.set(v.c,v.o+G),Wl(X,a,v,v.f,v.u,v.c.length,v.o,v.m),a+=16+G+(v.m?v.m.length:0)}return Ep(X,a,o.length,me,le),X}function oc(e,t){for(var n={},o=e.length-22;pt(e,o)!=101010256;--o)(!o||e.length-o>65558)&&Fe(13);var a=Nt(e,o+8);if(!a)return{};var r=pt(e,o+16),u=pt(e,o-20)==117853008;if(u){var s=pt(e,o-12);u=pt(e,s)==101075792,u&&(a=pt(e,s+32),r=pt(e,s+48))}for(var g=t&&t.filter,m=0;m<a;++m){var f=Tp(e,r,u),v=f[0],y=f[1],E=f[2],M=f[3],N=f[4],q=f[5],V=kp(e,q);r=N,(!g||g({name:M,size:y,originalSize:E,compression:v}))&&(v?v==8?n[M]=wp(e.subarray(V,V+y),{out:new ge(E)}):Fe(14,"unknown compression type "+v):n[M]=Po(e,V,V+y))}return n}function mt(){return Ht()}var ft={get isSignedIn(){return Ht().isSignedIn},get accessToken(){return Ht().accessToken},get userName(){return Ht().userName},get email(){return Ht().email},set isSignedIn(e){let t=Ht();Mt({...t,isSignedIn:e})},set accessToken(e){let t=Ht();Mt({...t,accessToken:e})},set userName(e){let t=Ht();Mt({...t,userName:e})},set email(e){let t=Ht();Mt({...t,email:e})}};function zo(){return $e().auth.autoBackupEnabled}function _t(){return $e().auth.autoBackupIntervalMinutes}var Qi=null,re=null,te=null,Hn=null;function sc(e){Qi=e}function lc(e){re=e}function cc(e){te=e}function uc(e){Hn=e}var rc=!1;function dc(){if(!rc)try{let e=document.createElement("style");e.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(e),rc=!0}catch{}}var pc=null,Zi=null,Oo=null,Ho=null,ea=null;function mc(e){pc=e}function fc(e){Zi=e}function ta(e){Oo=e}function na(e){Ho=e}function hc(e){ea=e}var Gr="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",gc="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",vc="https://www.youtube.com/",Mp=new Date(Date.UTC(2e3,0,1,0,0,0)),Ip=30*1e3,Lp=1800*1e3,ic=5,_r=null,We=null;async function oa(){try{let e=await Ho("googleAuthState"),t=e&&typeof e=="object"?{...e,accessToken:e.accessToken?"[REDACTED]":null}:e;l("Loading Google auth state from IndexedDB:",t);let n=pi.safeParse(e);if(n.success){let o=mt();Mt({...o,...n.data});let a=mt();a.isSignedIn&&a.accessToken&&l(`Reusing stored Google auth token for ${a.userName||a.email||"user"}`),to();let r=mt();r.isSignedIn&&r.accessToken&&await yn(!0)}else if(e!==void 0){let o=e&&typeof e=="object"?{...e,accessToken:e.accessToken?"[REDACTED]":null}:e;l("Google auth state failed validation:",{stored:o,errors:n.error.message},"warn")}}catch(e){l("Failed to load Google auth state:",e,"error")}}async function _o(){try{let e=mt(),t=pi.safeParse(e);if(!t.success){let n={...e,accessToken:e.accessToken?"[REDACTED]":null};l("Invalid auth state, cannot save",{state:n,errors:t.error.message},"error");return}await Oo("googleAuthState",e),e.isSignedIn&&e.accessToken?l(`Saved Google auth state to IndexedDB for ${e.userName||e.email||"user"}`):l("Cleared Google auth state in IndexedDB (signed out)")}catch(e){l("Failed to save Google auth state:",e,"error")}}function to(){Qi&&(Qi.style.display="none")}function et(e,t){if(!te)return;if(te.style.fontWeight="bold",e==="authenticating"){dc(),te.style.color="#ffa500",te.replaceChildren();let o=document.createElement("span");o.className="tk-auth-spinner";let a=document.createTextNode(` ${t||"Authorizing with Google\u2026"}`);te.appendChild(o),te.appendChild(a);return}if(e==="error"){j(te,"circle-x",t||"Authorization failed"),te.style.color="#ff4d4f",Ae();return}let n=mt();n.isSignedIn?(j(te,"circle-check","Signed in"),te.style.color="#52c41a",te.removeAttribute("title"),n.userName?(te.onmouseenter=()=>{j(te,"circle-check",`Signed in as ${n.userName}`)},te.onmouseleave=()=>{j(te,"circle-check","Signed in")}):(te.onmouseenter=null,te.onmouseleave=null)):(j(te,"circle-x","Not signed in"),te.style.color="#ff4d4f",te.removeAttribute("title"),te.onmouseenter=null,te.onmouseleave=null),Ae()}function Cp(){te&&(dc(),te.classList.remove("tk-auth-blink"),te.offsetWidth,te.classList.add("tk-auth-blink"),setTimeout(()=>{te.classList.remove("tk-auth-blink")},1200))}function yc(e,t=300*1e3){return new Promise((n,o)=>{if(!e){l&&l("OAuth monitor: popup is null",null,"error"),o(new Error("Failed to open popup"));return}l&&l("OAuth monitor: starting to monitor popup for token");let a=Date.now(),r="timekeeper_oauth",u=null,s=null,g=null,m=()=>{if(u){try{u.close()}catch{}u=null}s&&(clearInterval(s),s=null),g&&(clearInterval(g),g=null)};try{u=new BroadcastChannel(r),l&&l("OAuth monitor: BroadcastChannel created successfully"),u.onmessage=y=>{let E=y.data?.token?{...y.data,token:"[REDACTED]"}:y.data;l&&l("OAuth monitor: received BroadcastChannel message",E);let M=Ce({type:K(),token:we(K()),error:we(K())}).safeParse(y.data);if(!M.success){l&&l("OAuth monitor: invalid message format",M.error,"warn");return}if(M.data.type==="timekeeper_oauth_token"&&M.data.token){l&&l("OAuth monitor: token received via BroadcastChannel"),m();try{e.close()}catch{}n(M.data.token)}else if(M.data.type==="timekeeper_oauth_error"){l&&l("OAuth monitor: error received via BroadcastChannel",M.data.error,"error"),m();try{e.close()}catch{}o(new Error(M.data.error||"OAuth failed"))}}}catch(y){l&&l("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",y)}l&&l("OAuth monitor: setting up IndexedDB polling");let f=Date.now();s=setInterval(async()=>{try{let y=indexedDB.open("ytls-timestamps-db",4);y.onsuccess=()=>{let E=y.result,q=E.transaction("settings","readonly").objectStore("settings").get("oauth_message");q.onsuccess=()=>{let V=q.result;if(V&&V.value){let ne=V.value,z=Ce({type:K(),token:we(K()),error:we(K()),timestamp:we(Le())}).safeParse(ne);if(!z.success){l&&l("OAuth monitor: invalid IndexedDB message format",z.error,"warn");return}if(z.data.timestamp&&z.data.timestamp>f){let X=z.data.token?{...z.data,token:"[REDACTED]"}:z.data;if(l&&l("OAuth monitor: received IndexedDB message",X),z.data.type==="timekeeper_oauth_token"&&z.data.token){l&&l("OAuth monitor: token received via IndexedDB"),m();try{e.close()}catch{}E.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),n(z.data.token)}else if(z.data.type==="timekeeper_oauth_error"){l&&l("OAuth monitor: error received via IndexedDB",z.data.error,"error"),m();try{e.close()}catch{}E.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),o(new Error(z.data.error||"OAuth failed"))}f=z.data.timestamp||Date.now()}}E.close()}}}catch(y){l&&l("OAuth monitor: IndexedDB polling error",y,"error")}},500),g=setInterval(()=>{if(Date.now()-a>t){l&&l("OAuth monitor: popup timed out after 5 minutes",null,"error"),m();try{e.close()}catch{}o(new Error("OAuth popup timed out"));return}},1e3)})}async function wc(){if(!Gr){et("error","Google Client ID not configured");return}try{l&&l("OAuth signin: starting OAuth flow"),et("authenticating","Opening authentication window...");let e=new URL("https://accounts.google.com/o/oauth2/v2/auth");e.searchParams.set("client_id",Gr),e.searchParams.set("redirect_uri",vc),e.searchParams.set("response_type","token"),e.searchParams.set("scope",gc),e.searchParams.set("include_granted_scopes","true"),e.searchParams.set("state","timekeeper_auth"),l&&l("OAuth signin: opening popup");let t=window.open(e.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!t){l&&l("OAuth signin: popup blocked by browser",null,"error"),et("error","Popup blocked. Please enable popups for YouTube.");return}l&&l("OAuth signin: popup opened successfully"),et("authenticating","Waiting for authentication...");try{let n=await yc(t),o=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${n}`}});if(o.ok){let a=await o.json(),r=Ce({name:we(K()),email:we(K())}).safeParse(a);if(!r.success)throw l&&l("Failed to validate user info response",r.error,"error"),new Error("Invalid user info response");let u=r.data;Mt({isSignedIn:!0,accessToken:n,userName:u.name||null,email:u.email||null}),await _o(),to(),et(),Ae(),await yn(),l?l(`Successfully authenticated as ${u.name}`):console.log(`[Timekeeper] Successfully authenticated as ${u.name}`)}else throw new Error("Failed to fetch user info")}catch(n){let o=n instanceof Error?n.message:"Authentication failed";l?l("OAuth failed:",n,"error"):console.error("[Timekeeper] OAuth failed:",n),et("error",o);return}}catch(e){let t=e instanceof Error?e.message:"Sign in failed";l?l("Failed to sign in to Google:",e,"error"):console.error("[Timekeeper] Failed to sign in to Google:",e),et("error",`Failed to sign in: ${t}`)}}async function Bp(){let e=mt(),t=e.email;if(!Gr||!t)return!1;l("Silent OAuth: attempting silent token refresh for "+t);let n=new URL("https://accounts.google.com/o/oauth2/v2/auth");n.searchParams.set("client_id",Gr),n.searchParams.set("redirect_uri",vc),n.searchParams.set("response_type","token"),n.searchParams.set("scope",gc),n.searchParams.set("include_granted_scopes","true"),n.searchParams.set("state","timekeeper_auth"),n.searchParams.set("prompt","none"),n.searchParams.set("login_hint",t);let o=window.open(n.toString(),"TimekeeperGoogleAuthSilent","width=1,height=1,left=-2000,top=-2000,menubar=no,toolbar=no,location=no");if(!o)return l("Silent OAuth: popup blocked",null,"warn"),!1;try{let a=await yc(o,15e3);return Mt({...e,isSignedIn:!0,accessToken:a}),await _o(),to(),et(),l("Silent OAuth: token refreshed successfully for "+t),!0}catch(a){l("Silent OAuth: silent refresh failed",a,"warn");try{o.close()}catch{}return!1}}async function bc(){if(!window.opener||window.opener===window)return!1;l&&l("OAuth popup: detected popup window, checking for OAuth response");let e=window.location.hash;if(!e||e.length<=1)return l&&l("OAuth popup: no hash params found"),!1;let t=e.startsWith("#")?e.substring(1):e,n=new URLSearchParams(t),o=n.get("state");if(l&&l("OAuth popup: hash params found, state="+o),o!=="timekeeper_auth")return l&&l("OAuth popup: not our OAuth flow (wrong state)"),!1;let a=n.get("error"),r=n.get("access_token"),u="timekeeper_oauth";if(a){try{let s=new BroadcastChannel(u);s.postMessage({type:"timekeeper_oauth_error",error:n.get("error_description")||a}),s.close(),l&&l("OAuth popup: error broadcast via BroadcastChannel")}catch{let g={type:"timekeeper_oauth_error",error:n.get("error_description")||a,timestamp:Date.now()};l&&l("OAuth popup: writing error to IndexedDB",g);let m=indexedDB.open("ytls-timestamps-db",4);m.onsuccess=()=>{let f=m.result,y=f.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:g});y.onsuccess=()=>{l&&l("OAuth popup: error written to IndexedDB successfully")},y.onerror=()=>{l&&l("OAuth popup: failed to write error to IndexedDB",y.error,"error")},f.close()},m.onerror=()=>{l&&l("OAuth popup: failed to open IndexedDB",m.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(r){l&&l("OAuth popup: access token found, broadcasting to opener");try{let s=new BroadcastChannel(u);s.postMessage({type:"timekeeper_oauth_token",token:r}),s.close(),l&&l("OAuth popup: token broadcast via BroadcastChannel")}catch(s){l&&l("OAuth popup: BroadcastChannel failed, using IndexedDB",s);let g={type:"timekeeper_oauth_token",token:r,timestamp:Date.now()},m={...g,token:"[REDACTED]"};l&&l("OAuth popup: writing token to IndexedDB",m);let f=indexedDB.open("ytls-timestamps-db",4);f.onsuccess=()=>{let v=f.result,E=v.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:g});E.onsuccess=()=>{l&&l("OAuth popup: token written to IndexedDB successfully")},E.onerror=()=>{l&&l("OAuth popup: failed to write token to IndexedDB",E.error,"error")},v.close()},f.onerror=()=>{l&&l("OAuth popup: failed to open IndexedDB",f.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function xc(){Mt({isSignedIn:!1,accessToken:null,userName:null,email:null}),await _o(),await yn(),to(),et(),Ae()}async function Sc(){let e=mt();if(!e.isSignedIn||!e.accessToken)return!1;try{let t=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${e.accessToken}`}});return t.status===401?(await Ac({silent:!0}),!1):t.ok}catch(t){return l("Failed to verify auth state:",t,"error"),!1}}function Fr(){let e=mt();return e.isSignedIn&&!!e.accessToken}function eo(){return Fr()}function Rp(){let e=[];return Fr()&&e.push("Google Drive"),e}function Dp(e){let t=oc(new Uint8Array(e)),n=Object.values(t)[0];return n?new TextDecoder().decode(n):null}async function kc(e){let t={Authorization:`Bearer ${e}`},o=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,a=await fetch(o,{headers:t});if(a.status===401)throw new Error("unauthorized");if(!a.ok)throw new Error("drive search failed");let r=await a.json();if(Array.isArray(r.files)&&r.files.length>0)return r.files[0].id;let u=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...t,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(u.status===401)throw new Error("unauthorized");if(!u.ok)throw new Error("drive folder create failed");return(await u.json()).id}async function Tc(e,t,n){let o=`name='${e}' and '${t}' in parents and trashed=false`,a=encodeURIComponent(o),r=encodeURIComponent("modifiedTime desc"),u=await fetch(`https://www.googleapis.com/drive/v3/files?q=${a}&orderBy=${r}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${n}`}});if(u.status===401)throw new Error("unauthorized");if(!u.ok)throw new Error(`drive search failed (${u.status})`);let s=await u.json();return s.files&&s.files.length>0?s.files[0].id:null}async function ac(e){let t=await kc(e),n=await Tc("timekeeper-data.zip",t,e);if(!n)return null;let o=await fetch(`https://www.googleapis.com/drive/v3/files/${n}?alt=media`,{headers:{Authorization:`Bearer ${e}`}});if(o.status===401)throw new Error("unauthorized");if(!o.ok)throw new Error(`drive download failed (${o.status})`);let a=await o.arrayBuffer();try{return Dp(a)}catch(r){return l("Remote backup could not be decoded; the next upload will replace it:",r,"warn"),null}}async function Pp(){if(!Zi)return;let e=mt();if(!e.isSignedIn||!e.accessToken)return;let t;try{t=await ac(e.accessToken)}catch(a){if(a.message!=="unauthorized")throw a;await Ac({silent:!0});let r=mt();if(!r.isSignedIn||!r.accessToken)throw a;t=await ac(r.accessToken)}if(!t)return;let{mergedVideos:n,mergedTimestamps:o}=await Zi(t);o>0&&(l(`Pre-backup merge: added ${o} timestamps from ${n} videos from remote`),ea&&ea())}function Op(e,t){let n=new TextEncoder().encode(e),o=t.replace(/\\/g,"/").replace(/^\/+/,"");return o.endsWith(".json")||(o+=".json"),nc({[o]:[n,{level:6,mtime:Mp,os:0}]})}async function Hp(e,t,n,o){let a=e.replace(/\.json$/,".zip"),r=await Tc(a,n,o),u=new TextEncoder().encode(t).length,s=Op(t,e),g=s.length;l(`Compressing data: ${u} bytes -> ${g} bytes (${Math.round(100-g/u*100)}% reduction)`);let m="-------314159265358979",f=`\r
--${m}\r
`,v=`\r
--${m}--`,y=r?{name:a,mimeType:"application/zip"}:{name:a,mimeType:"application/zip",parents:[n]},E=8192,M="";for(let X=0;X<s.length;X+=E){let le=s.subarray(X,Math.min(X+E,s.length));M+=String.fromCharCode.apply(null,Array.from(le))}let N=btoa(M),q=f+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify(y)+f+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+N+v,V,ne;r?(V=`https://www.googleapis.com/upload/drive/v3/files/${r}?uploadType=multipart&fields=id,name`,ne="PATCH"):(V="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",ne="POST");let z=await fetch(V,{method:ne,headers:{Authorization:`Bearer ${o}`,"Content-Type":`multipart/related; boundary=${m}`},body:q});if(z.status===401)throw new Error("unauthorized");if(!z.ok)throw new Error("drive upload failed")}async function Ac(e){l("Auth expired, attempting silent token refresh",null,"warn"),!await Bp()&&(l("Silent OAuth: falling back to sign-out",null,"warn"),Mt({isSignedIn:!1,accessToken:null,userName:null,email:null}),await _o(),await yn(),et("error","Authorization expired. Please sign in again."),Ae())}async function Np(e){if(!Fr())throw e?.silent||et("error","Configure a backup destination first"),new Error("no-backup-destination");await Pp();let t=await pc({includeDeleted:!0});if(t.totalTimestamps===0){if(t.invalidRows>0)throw new Error(`export-invalid-data: ${t.invalidRows} stored rows failed validation`);return e?.silent||l("Skipping export: no timestamps to back up"),"skipped"}let n=mt();if(!n.accessToken)throw new Error("unauthorized");let o=await kc(n.accessToken);return await Hp(t.filename,t.json,o,n.accessToken),l(`Exported backup to Google Drive (${t.filename}) with ${t.totalVideos} videos / ${t.totalTimestamps} timestamps.`),"uploaded"}async function Ec(){try{let[e,t,n]=await Promise.all([Ho("lastAutoBackupAt"),Ho("autoBackupEnabled"),Ho("autoBackupIntervalMinutes")]),o=mi.partial().safeParse({autoBackupEnabled:t,autoBackupIntervalMinutes:n,lastAutoBackupAt:typeof e=="number"&&e>0?e:null});o.success?(typeof o.data.autoBackupEnabled=="boolean"&&Ii(o.data.autoBackupEnabled),typeof o.data.autoBackupIntervalMinutes=="number"&&Li(o.data.autoBackupIntervalMinutes),typeof o.data.lastAutoBackupAt=="number"&&Bi(o.data.lastAutoBackupAt)):l("Failed to validate auto backup settings:",o.error.message,"warn")}catch(e){l("Failed to load auto backup settings:",e,"error")}}async function ra(){try{let e=$e().auth,t={autoBackupEnabled:e.autoBackupEnabled,autoBackupIntervalMinutes:e.autoBackupIntervalMinutes,lastAutoBackupAt:e.lastAutoBackupAt},n=mi.safeParse(t);if(!n.success){l("Invalid auto backup settings, cannot save",{settings:t,errors:n.error.message},"error");return}await Promise.all([Oo("autoBackupEnabled",e.autoBackupEnabled),Oo("autoBackupIntervalMinutes",e.autoBackupIntervalMinutes),Oo("lastAutoBackupAt",e.lastAutoBackupAt)])}catch(e){l("Failed to save auto backup settings:",e,"error")}}function zp(){_r&&(clearInterval(_r),_r=null),We&&(clearTimeout(We),We=null)}function On(e){try{let t=new Date(e),n=new Date,o=t.toDateString()===n.toDateString(),a=t.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return o?a:`${t.toLocaleDateString()} ${a}`}catch{return""}}function Xi(){let e=Rp();return e.length>0?`Destinations: ${e.join(", ")}`:"No backup destination configured"}function Mc(){let e=$e().auth;return e.autoBackupEnabled?e.isAutoBackupRunning?"#4285f4":e.autoBackupBackoffMs&&e.autoBackupBackoffMs>0?"#ffa500":eo()&&e.lastAutoBackupAt?"#52c41a":eo()?"#ffa500":"#ff4d4f":"#ff4d4f"}function Ae(){if(ia(),!re)return;let e=$e().auth;if(!e.autoBackupEnabled)j(re,"refresh","Backup: Off"),re.onmouseenter=null,re.onmouseleave=null;else if(e.isAutoBackupRunning)j(re,"refresh","Backing up\u2026"),re.onmouseenter=null,re.onmouseleave=null;else if(e.autoBackupBackoffMs&&e.autoBackupBackoffMs>0){let n=Math.ceil(e.autoBackupBackoffMs/6e4);j(re,"alert-triangle",`Retry in ${n}m`),re.onmouseenter=null,re.onmouseleave=null}else if(!eo())j(re,"alert-triangle","Backup target missing"),re.onmouseenter=null,re.onmouseleave=null;else if(e.lastAutoBackupAt){let n=e.lastAutoBackupAt,o=n+Math.max(1,_t())*60*1e3,a=On(o);re.onmouseenter=()=>{j(re,"database",`Next backup: ${a}`)},re.onmouseleave=()=>{j(re,"database",`Last backup: ${On(n)}`)},j(re,"database",`Last backup: ${On(n)}`)}else{let n=Date.now()+Math.max(1,_t())*60*1e3,o=On(n);re.onmouseenter=()=>{j(re,"database",`Next backup: ${o}`)},re.onmouseleave=()=>{j(re,"database","Last backup: never")},j(re,"database","Last backup: never")}re.style.display="inline";let t=Mc();re.style.color=t}var Ji="ytls-backup-indicator--pulsing",_p="#4285f4",Zn=null;function Gp(e,t){Zn&&(e.removeEventListener("animationiteration",Zn),Zn=null),t===_p?(e.style.backgroundColor=t,e.classList.add(Ji)):e.classList.contains(Ji)?(Zn=()=>{Hn&&(Hn.classList.remove(Ji),Hn.style.backgroundColor=t,Zn=null)},e.addEventListener("animationiteration",Zn,{once:!0})):e.style.backgroundColor=t}function ia(){if(!Hn)return;let e=Mc();Gp(Hn,e),Ge(Hn,()=>{let t=$e().auth,n="";if(!t.autoBackupEnabled)n="Auto backup is disabled";else if(t.isAutoBackupRunning)n="Backup in progress";else if(t.autoBackupBackoffMs&&t.autoBackupBackoffMs>0)n=`Retrying backup in ${Math.ceil(t.autoBackupBackoffMs/6e4)}m`;else if(!eo())n=Xi();else if(t.lastAutoBackupAt){let o=t.lastAutoBackupAt+Math.max(1,_t())*60*1e3,a=On(o);n=`Last backup: ${On(t.lastAutoBackupAt)}
Next backup: ${a}
${Xi()}`}else{let o=Date.now()+Math.max(1,_t())*60*1e3;n=`No backup yet
Next backup: ${On(o)}
${Xi()}`}return n})}async function No(e={}){let{silent:t=!0,skipBackoff:n=!1}=e;if(!eo()){t||(Ae(),Fr()||Cp());return}if(We){if(!n){l("Auto backup: backoff in progress, skipping scheduled run");return}clearTimeout(We),We=null,Qn(null),l("Auto backup: manual run cleared backoff and will proceed immediately")}if(!$e().auth.isAutoBackupRunning){Ci(!0),Ae();try{await Np({silent:t})==="uploaded"&&Bi(Date.now()),Hr(0),Qn(null),We&&(clearTimeout(We),We=null),await ra()}catch(o){if(l("Auto backup failed:",o,"error"),o.message==="unauthorized"){l("Auth error detected, clearing token and stopping retries",null,"warn");let r=mt();Mt({...r,accessToken:null,isSignedIn:!1}),await _o(),et("error","Authorization expired. Please sign in again."),Ae(),Hr(0),Qn(null),We&&(clearTimeout(We),We=null)}else if($e().auth.autoBackupRetryAttempts<ic){let r=$e().auth.autoBackupRetryAttempts+1;Hr(r);let s=Math.min(Ip*Math.pow(2,r-1),Lp);Qn(s),We&&clearTimeout(We),We=setTimeout(()=>{No({silent:!0})},s),l(`Scheduling backup retry ${r}/${ic} in ${Math.round(s/1e3)}s`),Ae()}else Qn(null)}finally{Ci(!1),Ae()}}}async function yn(e=!1){if(zp(),!!zo()&&eo()){if(_r=setInterval(()=>{No({silent:!0})},Math.max(1,_t())*60*1e3),!e){let t=Date.now(),n=Math.max(1,_t())*60*1e3,o=$e().auth.lastAutoBackupAt;(!o||t-o>=n)&&No({silent:!0})}Ae()}}async function Ic(){let e=zo();Ii(!e),await ra(),await yn(),Ae()}async function Lc(){let e=_t(),t=prompt("Set Auto Backup interval (minutes):",String(e));if(t===null)return;let n=Math.floor(Number(t));if(!Number.isFinite(n)||n<5||n>1440){alert("Please enter a number between 5 and 1440 minutes.");return}Li(n),await ra(),await yn(),Ae()}var Wr="https://devel.kamotimestamps.com",Hc="308989572223-cdnvpn65mc51oqneu7po3og51uf5ahsb.apps.googleusercontent.com",Up="https://www.youtube.com/",Nc="timekeeper_sync_auth",zc="timekeeper_sync_oauth",_c="syncAuthState",Gc="syncCursors",qp=1500,Cc=200,Vp=500,jp=60*1e3,$p=60*1e3,Wp=300*1e3;function io(){return!!(Wr&&Hc)}var Fc=Ce({accessToken:K(),accessTokenExpiresAt:Le({finite:!0}),refreshToken:K(),user:Ce({id:K(),email:K(),name:dt(K())})}),Kp=Ce({records:un.array(),seq:Le({int:!0,nonnegative:!0}),hasMore:Cn()}),Yp=Ce({rejected:un.array(),fromSeq:Le({int:!0,nonnegative:!0}),seq:Le({int:!0,nonnegative:!0})}),Xp=Ce({type:K(),seq:we(Le({int:!0,nonnegative:!0})),fromSeq:we(Le({int:!0,nonnegative:!0})),records:we(un.array())}),Jp=Ce({type:K(),idToken:we(K()),error:we(K())}),xn=class extends Error{},Go="signed-out",qr="",Fo=!1,la=null,gt=!0,wn=null,bn=null,Kr=0,no=null,Uo=null,da=0,ca=null,Bc=!1,tt={pushCounter:0,pullSeq:0},pa=new Map,Rc=Promise.resolve(),Vr=!1,aa=null,$r="",sa=!1,Uc=null,ua=null,jr=null,qc=null;function nt(){return El()}function Vc(e){Uc=e}function jc(e){ua=e}function $c(e){jr=e}function Wc(e){qc=e}var Dc="#52c41a",Pc="#ff4d4f",Ur="#ffa500";function oo(){let e=nt();if(ua){let t=ua;if(t.style.fontWeight="bold",t.onmouseenter=null,t.onmouseleave=null,!io())j(t,"alert-triangle","Sync backend is not configured in this build"),t.style.color=Ur;else if(!e.isSignedIn)j(t,"circle-x","Not signed in"),t.style.color=Pc;else{j(t,"circle-check","Signed in"),t.style.color=Dc;let n=e.userName||e.email;n&&(t.onmouseenter=()=>j(t,"circle-check",`Signed in as ${n}`),t.onmouseleave=()=>j(t,"circle-check","Signed in"))}}if(jr){let t="",n="#aaa";Go==="error"?(t=qr||"Sync error",n=Pc):Go==="connecting"?(t=qr||"Connecting\u2026",n=Ur):e.isSignedIn&&Go==="offline"?(t=qr||"Offline. Retrying\u2026",n=Ur):e.isSignedIn&&Go==="online"&&(t=Fo?"Syncing\u2026":"Live sync on",!Fo&&la&&(t+=` \xB7 last synced ${new Date(la).toLocaleTimeString()}`),n=Fo?Ur:Dc),jr.textContent=t,jr.style.color=n}qc?.()}function ht(e,t=""){Go=e,qr=t,oo()}function Yr(){Rn(_c,nt())}function qo(){Rn(Gc,{userId:nt().userId,...tt})}async function Qp(){let e=await hn(Gc);e&&e.userId===nt().userId&&typeof e.pushCounter=="number"&&typeof e.pullSeq=="number"?tt={pushCounter:e.pushCounter,pullSeq:e.pullSeq}:tt={pushCounter:0,pullSeq:0}}function ma(e,t){return fetch(`${Wr}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)})}function Kc(e){Dn({isSignedIn:!0,accessToken:e.accessToken,accessTokenExpiresAt:e.accessTokenExpiresAt,refreshToken:e.refreshToken,userId:e.user.id,userName:e.user.name,email:e.user.email})}function Zp(){return aa??(aa=(async()=>{let{refreshToken:e}=nt();if(!e)throw new xn("Not signed in");let t=await ma("/auth/refresh",{refreshToken:e});if(t.status===401)throw new xn("Session expired");if(!t.ok)throw new Error(`Token refresh failed (HTTP ${t.status})`);let n=Fc.safeParse(await t.json());if(!n.success)throw new Error("Unexpected token refresh response");return Kc(n.data),Yr(),n.data.accessToken})().finally(()=>{aa=null})),aa}async function Yc(){let e=nt();if(!e.isSignedIn||!e.refreshToken)throw new xn("Not signed in");return e.accessToken&&e.accessTokenExpiresAt&&e.accessTokenExpiresAt-Date.now()>jp?e.accessToken:Zp()}async function Xc(e,t,n=!0){let o=await Yc(),a=await fetch(`${Wr}${e}`,{method:t.method,headers:{Authorization:`Bearer ${o}`,"Content-Type":"application/json"},body:t.body===void 0?void 0:JSON.stringify(t.body)});if(a.status===401){if(!n)throw new xn("Session expired");return Dn({...nt(),accessTokenExpiresAt:0}),Xc(e,t,!1)}return a}async function Jc(e,t,n){let o=await Xc(e,t);if(!o.ok)throw new Error(`${t.method} ${e} failed (HTTP ${o.status})`);let a=n.safeParse(await o.json());if(!a.success)throw new Error(`Unexpected response from ${e}`);return a.data}function em(e){try{let t=e.split(".")[1].replace(/-/g,"+").replace(/_/g,"/");return JSON.parse(atob(t.padEnd(Math.ceil(t.length/4)*4,"=")))}catch{return null}}function tm(e,t,n){return new Promise((o,a)=>{let r=()=>{clearTimeout(u),e.close();try{t.close()}catch{}},u=setTimeout(()=>{r(),a(new Error("Sign-in timed out"))},Wp);e.onmessage=s=>{let g=Jp.safeParse(s.data);if(g.success){if(g.data.type==="timekeeper_sync_oauth_error")r(),a(new Error(g.data.error||"Google sign-in failed"));else if(g.data.type==="timekeeper_sync_oauth_token"&&g.data.idToken){if(em(g.data.idToken)?.nonce!==n)return;r(),o(g.data.idToken)}}}})}function Qc(){let e=window.location.hash;if(!e||e.length<=1)return!1;let t=new URLSearchParams(e.substring(1));if(t.get("state")!==Nc)return!1;let n=t.get("id_token"),o=t.get("error_description")||t.get("error");if(!n&&!o)return!1;try{let a=new BroadcastChannel(zc);a.postMessage(n?{type:"timekeeper_sync_oauth_token",idToken:n}:{type:"timekeeper_sync_oauth_error",error:o}),a.close()}catch(a){console.error("[Timekeeper] Failed to hand sync sign-in result to the opener:",a)}return history.replaceState&&history.replaceState(null,"",window.location.pathname+window.location.search),window.close(),!0}async function Zc(){if(!io()){ht("error","Sync backend is not configured in this build");return}if(nt().isSignedIn||sa)return;sa=!0,ht("connecting","Opening Google sign-in\u2026");let e=crypto.randomUUID(),t=new BroadcastChannel(zc);try{let n=new URL("https://accounts.google.com/o/oauth2/v2/auth");n.searchParams.set("client_id",Hc),n.searchParams.set("redirect_uri",Up),n.searchParams.set("response_type","id_token"),n.searchParams.set("scope","openid email profile"),n.searchParams.set("nonce",e),n.searchParams.set("state",Nc),n.searchParams.set("prompt","select_account");let o=window.open(n.toString(),"TimekeeperSyncAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!o)throw new Error("Popup blocked. Please enable popups for YouTube.");ht("connecting","Waiting for Google sign-in\u2026");let a=await tm(t,o,e);ht("connecting","Signing in to Timekeeper Sync\u2026");let r=await ma("/auth/google",{idToken:a});if(!r.ok)throw new Error(r.status===401?"Google sign-in was rejected by the server":`Sign-in failed (HTTP ${r.status})`);let u=Fc.safeParse(await r.json());if(!u.success)throw new Error("Unexpected response from the sync server");Kc(u.data),Yr(),tt={pushCounter:0,pullSeq:0},qo(),l(`Signed in to Timekeeper Sync as ${u.data.user.email}`),await iu()}catch(n){t.close(),l("Sync sign-in failed:",n,"error"),ht("error",n instanceof Error?n.message:"Sign-in failed")}finally{sa=!1}}async function eu(){let{refreshToken:e}=nt();if(au(),Dn($n),tt={pushCounter:0,pullSeq:0},pa.clear(),Yr(),qo(),ht("signed-out"),e&&io())try{await ma("/auth/logout",{refreshToken:e})}catch(t){l("Sync logout request failed:",t,"warn")}}function tu(){au(),Dn($n),Yr(),ht("error","Session expired. Please sign in again.")}function nu(e){let t=Rc.then(e);return Rc=t.catch(()=>{}),t}function ro(){gt||Vr||(Vr=!0,nu(async()=>{Vr=!1,await rm()}).catch(e=>l("Sync: cycle crashed:",e,"error")))}async function fa(e){if(e.length!==0){for(let t of e)pa.set(t.guid,t.write_counter??0);await Ai(e),Uc?.([...new Set(e.map(t=>t.video_id))])}}function ou(e,t){return e>tt.pullSeq?!1:(t>tt.pullSeq&&(tt.pullSeq=t,qo()),!0)}async function nm(){for(;;){let e=await Jc(`/sync/pull?since=${tt.pullSeq}&limit=${Vp}`,{method:"GET"},Kp);await fa(e.records);let t=e.seq!==tt.pullSeq;if(tt.pullSeq=e.seq,qo(),!e.hasMore||!t)return}}async function om(){let e=await Ti(tt.pushCounter);if(e.length===0)return;let t=e.filter(n=>(pa.get(n.guid)??0)<n.write_counter);for(let n=0;n<t.length;n+=Cc){let o=await Jc("/sync/push",{method:"POST",body:{deviceId:$r,records:t.slice(n,n+Cc)}},Yp);await fa(o.rejected),ou(o.fromSeq,o.seq)||ro()}tt.pushCounter=Math.max(tt.pushCounter,e[e.length-1].write_counter),qo()}async function rm(){if(!gt){Fo=!0,oo();try{await nm(),await om(),la=Date.now(),da=0}catch(e){if(e instanceof xn){tu();return}l("Sync cycle failed:",e,"warn"),im()}finally{Fo=!1,oo()}}}function ru(e){return Math.min($p,1e3*2**e)*(.5+Math.random()/2)}function im(){gt||Uo||(Uo=setTimeout(()=>{Uo=null,ro()},ru(da++)))}function am(){gt||(no&&clearTimeout(no),no=setTimeout(()=>{no=null,ro()},qp))}function ha(){gt||(wn||(Kr=0,bn&&clearTimeout(bn),bn=null,ga()),ro())}function Oc(){gt||bn||(bn=setTimeout(()=>{bn=null,ga()},ru(Kr++)))}async function ga(){if(gt||wn)return;ht("connecting");let e;try{e=await Yc()}catch(n){return n instanceof xn?tu():(l("Sync: could not get an access token:",n,"warn"),ht("offline"),Oc())}if(gt||wn)return;let t=new WebSocket(`${Wr.replace(/^http/,"ws")}/sync/ws`);wn=t,t.onopen=()=>t.send(JSON.stringify({type:"auth",token:e,deviceId:$r})),t.onmessage=n=>{let o;try{o=JSON.parse(String(n.data))}catch{return}let a=Xp.safeParse(o);if(a.success){if(a.data.type==="ready")Kr=0,ht("online"),ro();else if(a.data.type==="changes"&&a.data.records){let{fromSeq:r,seq:u,records:s}=a.data;nu(async()=>{await fa(s),(r===void 0||u===void 0||!ou(r,u))&&ro()}).catch(g=>l("Sync: failed to apply live changes:",g,"error"))}}},t.onclose=n=>{wn===t&&(wn=null),!gt&&(n.code===4401&&Dn({...nt(),accessTokenExpiresAt:0}),ht("offline"),Oc())},t.onerror=()=>{}}async function iu(){if(gt){if(!$r){let e=await hn("device_id");$r=typeof e=="string"&&e?e:crypto.randomUUID()}gt=!1,da=0,Kr=0,ca=Ei(am),Bc||(Bc=!0,window.addEventListener("online",()=>ha())),await ga()}}function au(){gt=!0,ca?.(),ca=null;for(let t of[no,Uo,bn])t&&clearTimeout(t);no=Uo=bn=null,Vr=!1;let e=wn;wn=null;try{e?.close()}catch{}}async function su(){if(!io()){oo();return}try{let e=cs.safeParse(await hn(_c));e.success&&Dn(e.data);let t=nt();t.isSignedIn&&t.refreshToken?(await Qp(),await iu()):ht("signed-out")}catch(e){l("Failed to load sync auth state:",e,"error")}}function va(e,t){return hn(e).then(n=>n!==void 0?n:t)}function ya(e,t){return Rn(e,t),Promise.resolve()}var wa=window.location.hash;if(wa&&wa.length>1){let e=new URLSearchParams(wa.substring(1));if(e.get("state")==="timekeeper_auth"){let n=e.get("access_token");if(n){console.log("[Timekeeper] Auth token detected in URL, broadcasting token"),console.log("[Timekeeper] Token length:",n.length,"characters");try{let o=new BroadcastChannel("timekeeper_oauth"),a={type:"timekeeper_oauth_token",token:n};console.log("[Timekeeper] Sending auth message via BroadcastChannel:",{type:a.type,tokenLength:n.length}),o.postMessage(a),o.close(),console.log("[Timekeeper] Token broadcast via BroadcastChannel completed")}catch(o){console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",o);let a={type:"timekeeper_oauth_token",token:n,timestamp:Date.now()},r=indexedDB.open("ytls-timestamps-db",4);r.onsuccess=()=>{let u=r.result,s=u.transaction("settings","readwrite");s.objectStore("settings").put({key:"oauth_message",value:a}),s.oncomplete=()=>{console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",a.timestamp),u.close()}}}if(history.replaceState){let o=window.location.pathname+window.location.search;history.replaceState(null,"",o)}throw console.log("[Timekeeper] Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}if(Qc())throw new Error("OAuth window closed");Fl();Gl()||_l();(async function(){"use strict";if(window.top!==window.self)return;function e(i){return va(i,void 0)}function t(i,c){return ya(i,c)}na(e),ta(t);try{let i=await hn("device_id"),c=typeof i=="string"&&i.length>0?i:crypto.randomUUID();await Rn("device_id",c),l(`Lamport: device_id = ${c}`)}catch(i){l("Lamport: failed to initialize device_id:",i,"warn")}if(await bc()){l("OAuth popup detected, broadcasting token and closing");return}await oa();let o=["/watch","/live"];function a(i=window.location.href){try{let c=new URL(i);return c.origin!=="https://www.youtube.com"?!1:o.some(d=>c.pathname===d||c.pathname.startsWith(`${d}/`))}catch(c){return l("Timekeeper failed to parse URL for support check:",c,"error"),!1}}let r=null,u=null,s=null,g=null,m=null,f=null,v=(()=>{try{let i=parseFloat(localStorage.getItem("ytls-last-speed")??"");return Number.isFinite(i)&&i>0&&i!==1?Math.min(i,4):2}catch{return 2}})(),y=!1,E=null,M=null,N=250,q=null;function V(){return $e().ui.minPaneHeight}function ne(i){Ml(i)}function z(i){Ll(i)}function X(){return $e().ui.urlChangeHandlersSetup}function le(i){Cl(i)}function me(){return $e().ui.panePosition}function ee(i){Il(i)}function G(i){Bl(i)}function D(){return r?r.getBoundingClientRect():null}function ve(i,c,d){i&&ee({x:Math.round(typeof c=="number"?c:i.left),y:Math.round(typeof d=="number"?d:i.top),width:Math.round(i.width),height:Math.round(i.height)})}function ie(i=!0){if(!r)return;_n();let c=D();if(c&&(c.width||c.height)&&(ve(c),i)){let d=me();ur("windowPosition",d),kn({type:"window_position_updated",position:d,timestamp:Date.now()})}}function be(){if(!r||!u||!g||!s)return;let i=40,c=Re();if(c.length>0)i=c[0].offsetHeight;else{let d=document.createElement("li");d.style.visibility="hidden",d.style.position="absolute",d.textContent="00:00 Example",s.appendChild(d),i=d.offsetHeight,s.removeChild(d)}N=u.offsetHeight+g.offsetHeight+i,ne(N),r.style.minHeight=V()+"px"}function vt(){requestAnimationFrame(()=>{Pe?.(),be(),ie(!0)})}function Ue(i=450){Me&&(clearTimeout(Me),Me=null),Me=setTimeout(()=>{Ee(),vt(),Me=null},i)}function Ne(){Me&&(clearTimeout(Me),Me=null)}function xe(){s&&(s.style.visibility="hidden",l("Hiding timestamps during show animation")),vt(),Ue()}function ce(){Ee(),Ne(),yt&&(clearTimeout(yt),yt=null),yt=setTimeout(()=>{r&&(r.style.display="none",Va(),yt=null)},400)}function Ee(){if(!s){ot&&(ot(),ot=null,Ut=null,An=null);return}if(!An){s.style.visibility==="hidden"&&(s.style.visibility="",l("Restoring timestamp visibility (no deferred fragment)")),ot&&(ot(),ot=null,Ut=null);return}l("Appending deferred timestamps after animation"),s.appendChild(An),An=null,tn(),nn(),s.style.visibility==="hidden"&&(s.style.visibility="",l("Restoring timestamp visibility after append")),ot&&(ot(),ot=null,Ut=null),Bt(),Ve(),Pe&&requestAnimationFrame(Pe),St(!0)}let ue=null,De=!1,Se="ytls-timestamp-pending-delete",ke="ytls-timestamp-highlight";async function qe(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(i=>setTimeout(i,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(i=>setTimeout(i,100));await new Promise(i=>setTimeout(i,200))}let ze=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],de=5e3,st=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function Gt(i){return st.has(i)}function Te(){return document.querySelector("video")}let lt=null;function J(){if(lt&&document.contains(lt))return lt;let i=document.getElementById("movie_player");return i&&document.contains(i)?i:null}function Jt(i){return(Math.round(i*100)/100).toFixed(2).replace(/\.0+?$|(?<=\.[0-9])0+$/g,"")}function Sn(i){let c=i===1?2:i;v=c;try{localStorage.setItem("ytls-last-speed",String(c))}catch{}}function Lt(i){if(!f)return;let c=typeof i=="number"?i:Te()?.playbackRate??1,d=Jt(c);f.dataset.speed!==d&&(f.dataset.speed=d,f.textContent=`${d}x`,f.setAttribute("aria-label",`Playback speed ${d}x`)),Math.abs(c-1)>.01?f.classList.add("ytls-playback-speed-active"):f.classList.remove("ytls-playback-speed-active")}function ao(i){let c=J(),d=Te();if(y=!0,c&&typeof c.setPlaybackRate=="function")c.setPlaybackRate(i);else if(d)d.playbackRate=i;else return y=!1,!1;return Lt(i),!0}function ba(){let i=Te()?.playbackRate;return Number.isFinite(i)?ao(Math.abs(i-1)<=.001?v:1):!1}function lu(i){return i instanceof Element?!!i.closest('input, textarea, select, [contenteditable], [role="textbox"]'):!1}function Xr(i){return ze.every(c=>typeof i?.[c]=="function"?!0:Gt(c)?!!Te():!1)}function cu(i){return ze.filter(c=>typeof i?.[c]=="function"?!1:Gt(c)?!Te():!0)}async function uu(i=de){let c=Date.now();for(;Date.now()-c<i;){let w=J();if(Xr(w))return w;await new Promise(x=>setTimeout(x,100))}let d=J();return Xr(d),d}let xa="timestampOffsetSeconds",du=-5,Sa="shiftClickTimeSkipSeconds",pu=10,Jr=300,Qr=300,Ct=null;function ka(){try{return new URL(window.location.href).origin==="https://www.youtube.com"}catch{return!1}}function Ta(){if(ka()&&!Ct)try{Ct=new BroadcastChannel("ytls_timestamp_channel"),Ct.onmessage=Aa}catch(i){l("Failed to create BroadcastChannel:",i,"warn"),Ct=null}}function kn(i){if(!ka()){l("Skipping BroadcastChannel message: not on https://www.youtube.com","warn");return}if(Ta(),!Ct){l("No BroadcastChannel available to post message","warn");return}try{Ct.postMessage(i)}catch(c){l("BroadcastChannel error, reopening:",c,"warn");try{Ct=new BroadcastChannel("ytls_timestamp_channel"),Ct.onmessage=Aa,Ct.postMessage(i)}catch(d){l("Failed to reopen BroadcastChannel:",d,"error")}}}function Aa(i){if(l("Received message from another tab:",i.data),!(!a()||!s||!r)&&i.data){if(i.data.type==="timestamps_updated"&&i.data.videoId===Be)l("Debouncing timestamp load due to external update for video:",i.data.videoId),clearTimeout(lo),lo=setTimeout(()=>{l("Reloading timestamps due to external update for video:",i.data.videoId),lr()},500);else if(i.data.type==="window_position_updated"&&r){let c=i.data.position;if(c&&typeof c.x=="number"&&typeof c.y=="number"){r.style.left=`${c.x}px`,r.style.top=`${c.y}px`,r.style.right="auto",r.style.bottom="auto",typeof c.width=="number"&&c.width>0&&(r.style.width=`${c.width}px`),typeof c.height=="number"&&c.height>0&&(r.style.height=`${c.height}px`);let d=r.getBoundingClientRect();ee({x:Math.round(c.x),y:Math.round(c.y),width:Math.round(d.width),height:Math.round(d.height)});let w=document.documentElement.clientWidth,x=document.documentElement.clientHeight;(d.left<0||d.top<0||d.right>w||d.bottom>x)&&_n()}}}}Ta();let Nn=await va(xa);(typeof Nn!="number"||Number.isNaN(Nn))&&(Nn=du,await ya(xa,Nn));let so=await va(Sa);(typeof so!="number"||Number.isNaN(so))&&(so=pu,await ya(Sa,so));let lo=null,Ft=new Map,Tn=!1,O=null,Vo=null,Be=null,yt=null,Me=null,wt=null,Ke=null,Qt=null,Zr=!1,Pe=null,An=null,Ut=null,ot=null,Zt=null,jo=!1,ei=!1,$o=null,Wo=null,Ko=null,Yo=null,Xo=null,Jo=null,Qo=null,Zo=null,co=null,uo=null,po=null,bt=null,xt=null,Ea=0,mo=!1,En=null,fo=null,zn=null,Ma=null,ho=null;function Mn(){if(!s)return{items:[],starts:[],rawTimes:[]};if(Ma!==s||!ho?(ho?.disconnect(),ho=new MutationObserver(()=>{zn=null}),ho.observe(s,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-time"]}),Ma=s,zn=null):ho.takeRecords().length>0&&(zn=null),!zn){let i=Rr(s),c=new Array(i.length),d=new Array(i.length);for(let w=0;w<i.length;w++){let x=i[w].querySelector("[data-time]")?.dataset.time;c[w]=x?Number.parseInt(x,10):NaN,d[w]=x?parseFloat(x):0}zn={items:i,starts:c,rawTimes:d}}return zn}function Re(){return Mn().items}function ti(){return Tl(s)}function en(){return fo!==null||(fo=Al(s)),fo}function tn(){fo=null}function er(i=J(),c=Te()){let d=i?.getDuration?.();return Number.isFinite(d)&&d>0?d:Number.isFinite(c?.duration)&&c.duration>0?c.duration:0}function Ia(){return er()||en()}function mu(i){let c=i.querySelector(".time-diff");return c?(c.textContent?.trim()||"").startsWith("-"):!1}let fu="\u251C\u2500 ",La="\u2514\u2500 ",Ca=/^[├└]─\s/;function tr(i){return Ca.test(i)}function Ba(i){return i.replace(Ca,"")}function Ra(i){let c=Re();if(i>=c.length-1)return La;let x=c[i+1].querySelector("input");return x&&tr(x.value)?fu:La}function hu(i,c){return`${Ra(c)}${i}`}function Bt(){if(!s)return;Re().forEach((c,d)=>{let w=c.querySelector("input");if(!w||!tr(w.value))return;let x=Ba(w.value),A=hu(x,d);w.value!==A&&(w.value=A)})}function go(){Dr(s),An&&(An=null),ot&&(ot(),ot=null,Ut=null)}function vo(){kl(s,De)}function Da(i){Mi(s,i)}function ni(){bl(s)}function oi(i){if(!(!r||!s)){if(De=i,i)r.style.display="",r.classList.remove("ytls-fade-out"),r.classList.add("ytls-fade-in"),Da("Loading timestamps...");else if(ni(),r.style.display="",r.classList.remove("ytls-fade-out"),r.classList.add("ytls-fade-in"),m){let c=J();if(c){let d=c.getCurrentTime(),w=Number.isFinite(d)?Math.max(0,Math.floor(d)):Math.max(0,en()),x=s?Mn().rawTimes:[];m.textContent=Lr(w,x,er(c))}}!De&&s&&!Co(s)&&vo(),qt()}}function nr(i,c){i.dataset.time=String(c),i.textContent=dn(c,Ia())}let or=null,rr=null,Rt=!1;function Pa(i,c){if(!i||typeof i.getVideoData!="function"||!(c!==void 0?c:!!i.getVideoData()?.isLive))return!1;if(typeof i.getProgressState=="function"){let w=i.getProgressState(),x=Number(w?.seekableEnd??w?.liveHead??w?.head??w?.duration),A=Number(w?.current??i.getCurrentTime?.());if(Number.isFinite(x)&&Number.isFinite(A))return x-A>2}return!1}function gu(i,c){if(!Number.isFinite(i))return;let d=Oa(i);ri(d,c)}function St(i=!1,c){if(Tn&&!i)return;let d;if(typeof c=="number"&&Number.isFinite(c))d=Math.max(0,Math.floor(c));else{let w=J(),x=w?w.getCurrentTime():NaN;d=Number.isFinite(x)?Math.max(0,Math.floor(x)):Math.max(0,en())}Number.isFinite(d)&&gu(d,i)}function Oa(i){if(!Number.isFinite(i))return null;let{items:c,starts:d}=Mn(),w=-1,x=-1/0;for(let A=0;A<d.length;A++){let k=d[A];k<=i&&k>x&&(x=k,w=A)}return w>=0?c[w]:null}function ri(i,c=!1){let d=s?s.getElementsByClassName(ke):null;if(!(!!d&&(i?d.length===1&&d[0]===i:d.length===0))&&d)for(let x of Array.from(d))x.classList.contains(Se)||x.classList.remove(ke);if(i&&!i.classList.contains(Se)&&(i.classList.add(ke),c))try{if(s instanceof HTMLElement){let x=i.getBoundingClientRect(),A=s.getBoundingClientRect();!(x.bottom<A.top||x.top>A.bottom)||i.scrollIntoView({behavior:"smooth",block:"center"})}else i.scrollIntoView({behavior:"smooth",block:"center"})}catch{try{i.scrollIntoView({behavior:"smooth",block:"center"})}catch{}}}function vu(i){if(kt()||!Number.isFinite(i)||i===0)return!1;let c=Re();if(c.length===0)return!1;let d=[];return c.forEach(w=>{let x=w.querySelector("[data-time]"),A=x?.dataset.time;if(!x||!A)return;let k=Number.parseInt(A,10);if(!Number.isFinite(k))return;let S=Math.max(0,k+i);if(S!==k){nr(x,S);let L=w.dataset.guid;L&&d.push({guid:L,start:S,comment:w.querySelector("input")?.value??""})}}),d.length===0?!1:(nn(),Bt(),Ve(),ii(),_a(Be,d),En=null,!0)}function Ha(i,c={}){if(!Number.isFinite(i)||i===0)return!1;if(!vu(i)){if(c.alertOnNoChange){let k=c.failureMessage??"Offset did not change any timestamps.";alert(k)}return!1}let w=c.logLabel??"bulk offset";l(`Timestamps changed: Offset all timestamps by ${i>0?"+":""}${i} seconds (${w})`);let x=J(),A=x?Math.floor(x.getCurrentTime()):0;if(Number.isFinite(A)){let k=Oa(A);ri(k,!1)}return!0}function Na(i){if(!s||De)return;let c=i.target instanceof Element?i.target:null;if(!c)return;let d=c.closest("[data-time]"),w=c.closest("[data-increment]"),x=c.closest("[data-action]");if(d?.dataset.time){i.preventDefault();let A=Number(d.dataset.time);if(Number.isFinite(A)){l(`Seeking to timestamp ${A}`),Rt=!0;let S=J();S&&S.seekTo(A),setTimeout(()=>{Rt=!1},500)}let k=d.closest("li");k&&(Re().forEach(S=>{S.classList.contains(Se)||S.classList.remove(ke)}),k.classList.contains(Se)||(k.classList.add(ke),k.scrollIntoView({behavior:"smooth",block:"center"})))}else if(w?.dataset.increment){i.preventDefault();let A=w.closest("li"),k=A?.querySelector("[data-time]");if(!k||!k.dataset.time)return;let S=parseInt(k.dataset.time,10),L=parseInt(w.dataset.increment,10);if("shiftKey"in i&&i.shiftKey&&(L*=so),"altKey"in i?i.altKey:!1){Ha(L,{logLabel:"Alt adjust"});return}let F=Math.max(0,S+L);if(l(`Timestamps changed: Timestamp time incremented from ${S} to ${F}`),tn(),nr(k,F),rr=F,or&&clearTimeout(or),Rt=!0,or=setTimeout(()=>{if(rr!==null){let oe=J();oe&&oe.seekTo(rr)}or=null,rr=null,setTimeout(()=>{Rt=!1},500)},500),nn(),Bt(),Ve(),A){let oe=A.querySelector("input"),ye=A.dataset.guid;oe&&ye&&(sr(Be,ye,F,oe.value),En=ye)}}else x?.dataset.action==="clear"&&(i.preventDefault(),l("Timestamps changed: All timestamps cleared from UI"),s.textContent="",tn(),Ve(),ir(),bu(),G([]),wu(Be),En=null,vo())}function yo(i,c="",d=!1,w=null,x=!0){if(!s)return null;let A=Math.max(0,i),k=w??crypto.randomUUID(),S=document.createElement("li"),L=document.createElement("div"),C=document.createElement("span"),R=document.createElement("span"),F=document.createElement("span"),oe=document.createElement("div"),ye=document.createElement("span"),ct=document.createElement("span"),Q=document.createElement("input"),ae=document.createElement("button");S.dataset.guid=k,L.className="time-row",oe.className="ytls-row-controls";let Oe=document.createElement("div");Oe.style.cssText="position:absolute;left:0;top:0;width:20px;height:20px;display:flex;align-items:center;justify-content:center;cursor:pointer;",Ge(Oe,"Click to toggle indent");let rt=document.createElement("span");rt.style.cssText="color:#f4ba78;pointer-events:none;display:none;line-height:0;";let Tt=()=>{let U=Q.offsetTop,H=Q.offsetHeight||20;Oe.style.top=`${U}px`,Oe.style.height=`${H}px`},Dt=()=>{_e(rt,tr(Q.value)?"indent-decrease":"indent-increase",18)},Gn="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",on=U=>{let H=rt.querySelector("svg");H&&(H.style.transition="filter 0.15s ease",H.style.filter=U?Gn:"none")},Fn=U=>{U.stopPropagation();let H=tr(Q.value),pe=Ba(Q.value),Z="";if(!H){let ut=Re().indexOf(S);Z=Ra(ut)}Q.value=Z?`${Z}${pe}`:pe,Dt(),Bt();let he=Number.parseInt(ye.dataset.time??"0",10);sr(Be,k,he,Q.value)};Oe.onclick=Fn,Oe.append(rt),Oe.addEventListener("mouseenter",()=>{on(!0)}),Oe.addEventListener("mouseleave",()=>{on(!1)}),S.style.cssText="position:relative;padding-left:20px;",S.addEventListener("mouseenter",()=>{Tt(),Dt(),rt.style.display="inline"}),S.addEventListener("mouseleave",()=>{on(!1),rt.style.display="none"}),S.addEventListener("mouseleave",()=>{S.dataset.guid===En&&mu(S)&&za()}),Q.value=c||"",Q.style.cssText="width:100%;margin-top:5px;display:block;",Q.type="text",Q.setAttribute("inputmode","text"),Q.autocapitalize="off",Q.autocomplete="off",Q.spellcheck=!1,requestAnimationFrame(Tt);let bo=!1;Q.addEventListener("focusin",()=>{mo=!1,bo=!1}),Q.addEventListener("focusout",U=>{let H=U.relatedTarget,pe=Date.now()-Ea<250,Z=!!H&&!!r&&r.contains(H);!pe&&!Z&&!bo&&(mo=!0,setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(Q.focus({preventScroll:!0}),mo=!1)},0))}),Q.addEventListener("keydown",U=>{(U.key==="Escape"||U.key==="Esc")&&(U.preventDefault(),bo=!0,Q.blur())});let xo=U=>{let H=Ft.get(k);H&&clearTimeout(H.timeoutId);let pe=Be,Z=()=>{let he=Ft.get(k);he&&(clearTimeout(he.timeoutId),Ft.delete(k)),Ga(pe,k,Number.parseInt(ye.dataset.time??"0",10),Q.value)};Ft.set(k,{timeoutId:setTimeout(Z,U),flush:Z})};Q.addEventListener("input",U=>{let H=U;H&&(H.isComposing||H.inputType==="insertCompositionText")||xo(500)}),Q.addEventListener("compositionend",()=>{xo(50)});let Vt="#f4ba78",dr="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",pr="#c8452d",mr="drop-shadow(0 0 4px #e36a52) drop-shadow(0 0 8px #e36a52)",Ln=(U,H=Vt,pe=dr)=>{U.style.color=H;let Z=U.querySelector("svg");Z&&(Z.style.transition="filter 0.15s ease"),U.addEventListener("mouseenter",()=>{Z&&(Z.style.filter=pe)}),U.addEventListener("mouseleave",()=>{Z&&(Z.style.filter="none")})};_e(C,"circle-minus",18),C.classList.add("ytls-row-control"),C.dataset.increment="-1",C.style.cursor="pointer",C.style.margin="0px",Ln(C),_e(F,"circle-plus",18),F.classList.add("ytls-row-control"),F.dataset.increment="1",F.style.cursor="pointer",F.style.margin="0px",Ln(F),_e(R,"current-location",18),R.classList.add("ytls-row-control"),R.style.cursor="pointer",R.style.margin="0px",Ge(R,"Set to current playback time"),Ln(R),R.onclick=()=>{let U=J(),H=U?Math.floor(U.getCurrentTime()):0;Number.isFinite(H)&&(l(`Timestamps changed: set to current playback time ${H}`),tn(),nr(ye,H),nn(),Bt(),sr(Be,k,H,Q.value),En=k)},tn(),nr(ye,A),ye.addEventListener("click",U=>{U.preventDefault(),U.stopPropagation();let H=Number(ye.dataset.time);if(!Number.isFinite(H))return;l(`Seeking to timestamp ${H}`),Rt=!0;let pe=J();pe&&pe.seekTo(H);let Z=Te();Z?.paused&&Z.play(),setTimeout(()=>{Rt=!1},500),s?.querySelectorAll(`.${ke}`).forEach(he=>he.classList.remove(ke)),S.classList.contains(Se)||(S.classList.add(ke),S.scrollIntoView({behavior:"smooth",block:"center"}))}),_e(ae,"trash",16),ae.classList.add("ytls-row-control"),ae.style.cssText="background:transparent;border:none;cursor:pointer;margin-left:5px;display:inline-flex;align-items:center;",Ln(ae,pr,mr),ae.onclick=()=>{let U=null,H=null,pe=null,Z=()=>{try{S.removeEventListener("click",H,!0)}catch{}try{document.removeEventListener("click",H,!0)}catch{}if(s)try{s.removeEventListener("mouseleave",pe)}catch{}U&&(clearTimeout(U),U=null)};if(S.dataset.deleteConfirmed==="true"){l("Timestamps changed: Timestamp deleted");let he=S.dataset.guid??"",je=Ft.get(he);je&&(clearTimeout(je.timeoutId),Ft.delete(he)),Z(),S.remove(),tn(),nn(),Bt(),Ve(),ir(),xu(Be,he),En=null,vo()}else{S.dataset.deleteConfirmed="true",S.classList.add(Se),S.classList.remove(ke);let he=()=>{S.dataset.deleteConfirmed="false",S.classList.remove(Se);let je=J(),ut=je?je.getCurrentTime():0,Pt=Number.parseInt(S.querySelector("[data-time]")?.dataset.time??"0",10);Number.isFinite(ut)&&Number.isFinite(Pt)&&ut>=Pt&&S.classList.add(ke),Z()};H=je=>{je.target!==ae&&he()},pe=()=>{S.dataset.deleteConfirmed==="true"&&he()},S.addEventListener("click",H,!0),document.addEventListener("click",H,!0),s&&s.addEventListener("mouseleave",pe),U=setTimeout(()=>{S.dataset.deleteConfirmed==="true"&&he(),Z()},5e3)}},ct.className="time-diff",ct.style.color="#888",ct.style.marginLeft="5px",oe.append(C,R,F,ae),L.append(ye,oe,ct),S.append(Oe,L,Q);let fr=Number.parseInt(ye.dataset.time??"0",10);if(x){ni();let U=!1,H=Re();for(let pe=0;pe<H.length;pe++){let Z=H[pe],je=Z.querySelector("[data-time]")?.dataset.time;if(!je)continue;let ut=Number.parseInt(je,10);if(Number.isFinite(ut)&&fr<ut){s.insertBefore(S,Z),U=!0;break}}U||s.appendChild(S),S.scrollIntoView({behavior:"smooth",block:"center"}),tn(),nn(),ir(),Bt(),Ve(),d||(sr(Be,k,A,c),En=k,ri(S,!1))}else Q.__ytls_li=S;return Q}function nn(){if(kt())return;let i=Ia(),c=Re();c.forEach((d,w)=>{let x=d.querySelector(".time-diff"),A=d.querySelector("[data-time]"),k=A?.dataset.time;if(A&&k){let ct=Number.parseInt(k,10);Number.isFinite(ct)&&(A.textContent=dn(ct,i))}if(!x)return;if(!k){x.textContent="";return}let S=Number.parseInt(k,10);if(!Number.isFinite(S)){x.textContent="";return}if(w===0){x.textContent="";return}let R=c[w-1].querySelector("[data-time]")?.dataset.time;if(!R){x.textContent="";return}let F=Number.parseInt(R,10);if(!Number.isFinite(F)){x.textContent="";return}let oe=S-F,ye=oe<0?"-":"";x.textContent=` ${ye}${dn(Math.abs(oe))}`})}function za(){if(kt())return;let i=null;if(document.activeElement instanceof HTMLInputElement&&s.contains(document.activeElement)){let k=document.activeElement,L=k.closest("li")?.dataset.guid;if(L){let C=k.selectionStart??k.value.length,R=k.selectionEnd??C,F=k.scrollLeft;i={guid:L,start:C,end:R,scroll:F}}}let c=Re();if(c.length===0)return;let d=c.map(k=>k.dataset.guid),w=c.map(k=>{let S=k.querySelector("[data-time]"),L=S?.dataset.time;if(!S||!L)return null;let C=Number.parseInt(L,10);if(!Number.isFinite(C))return null;let R=k.dataset.guid??"";return{time:C,guid:R,element:k}}).filter(k=>k!==null).sort((k,S)=>{let L=k.time-S.time;return L!==0?L:k.guid.localeCompare(S.guid)}),x=w.map(k=>k.guid),A=d.length!==x.length||d.some((k,S)=>k!==x[S]);if(s.replaceChildren(),w.forEach(k=>{s.appendChild(k.element)}),nn(),Bt(),Ve(),i){let S=Re().find(L=>L.dataset.guid===i.guid)?.querySelector("input");if(S)try{S.focus({preventScroll:!0})}catch{}}A&&(l("Timestamps changed: Timestamps sorted"),ii())}function ir(){if(!s||!r||!u||!g)return;let i=Re().length;Pe?.();let c=r.getBoundingClientRect(),d=u.getBoundingClientRect(),w=g.getBoundingClientRect(),x=Math.max(0,c.height-(d.height+w.height));i===0?(vo(),s.style.overflowY="hidden"):s.style.overflowY=s.scrollHeight>x?"auto":"hidden"}function Ve(){if(!s)return;let i=Te(),c=document.querySelector(".ytp-progress-bar"),d=J(),w=d?d.getVideoData():null,x=!!w&&!!w.isLive;if(!i||!c||!isFinite(i.duration)||x)return;Ua();let{items:A,starts:k}=Mn(),S=i.duration,L=document.createDocumentFragment();A.forEach((C,R)=>{let F=k[R];if(!Number.isFinite(F))return;C.dataset.guid||(C.dataset.guid=crypto.randomUUID());let oe=document.createElement("div");oe.className="ytls-marker",oe.style.left=F/S*100+"%",oe.dataset.time=String(F),L.appendChild(oe)}),c.appendChild(L),yu(c)}function yu(i){i.dataset.ytlsMarkerClicks||(i.dataset.ytlsMarkerClicks="1",i.addEventListener("click",c=>{let d=c.target?.closest?.(".ytls-marker");if(!d)return;let w=Number(d.dataset.time),x=J();x&&Number.isFinite(w)&&x.seekTo(w)}))}function ii(){G(ti().sort((i,c)=>i.start-c.start))}function _a(i,c){!i||c.length===0||De||kt()||(Iu(i,c).then(()=>{l(`Saved ${c.length} timestamps for ${i} to IndexedDB`),s&&wo()}).catch(d=>{let w=`Failed to save timestamps: ${d.message}`;l(`Failed to save timestamps for ${i} to IndexedDB:`,d,"error"),In(w)}),kn({type:"timestamps_updated",videoId:i,action:"saved"}))}function wu(i){!i||De||kt()||(qa(i).then(()=>{s&&wo()}).catch(c=>{let d=`Failed to clear timestamps: ${c.message}`;l(`Failed to clear timestamps for ${i}:`,c,"error"),In(d)}),kn({type:"timestamps_updated",videoId:i,action:"saved"}))}function ar(){for(let{flush:i}of[...Ft.values()])i()}function bu(){Ft.forEach(({timeoutId:i})=>clearTimeout(i)),Ft.clear()}function sr(i,c,d,w){!i||De||kt()||Ga(i,c,d,w)}function Ga(i,c,d,w){if(!i)return;let x={guid:c,start:d,comment:w};l(`Saving timestamp: guid=${c}, start=${d}, comment="${w}"`),Lu(i,x).then(()=>{s&&wo()}).catch(A=>{let k=`Failed to save timestamp: ${A.message}`;l(`Failed to save timestamp ${c}:`,A,"error"),In(k)}),kn({type:"timestamps_updated",videoId:i,action:"saved"})}function xu(i,c){!i||De||kt()||(Cu(i,c).then(()=>{s&&wo()}).catch(d=>{let w=`Failed to delete timestamp: ${d.message}`;l(`Failed to delete timestamp ${c}:`,d,"error"),In(w)}),kn({type:"timestamps_updated",videoId:i,action:"saved"}))}async function Fa(i){if(kt()){alert("Cannot export timestamps while an error is being displayed.");return}let c=Be;if(!c)return;l(`Exporting timestamps for video ID: ${c}`);let d=ti(),w=Bn();if(i==="json"){let x=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),A=URL.createObjectURL(x),k=document.createElement("a");k.href=A,k.download=`timestamps-${c}-${w}.json`,k.click(),URL.revokeObjectURL(A)}else if(i==="text"){let x=fi(d,!0),A=new Blob([x],{type:"text/plain"}),k=URL.createObjectURL(A),S=document.createElement("a");S.href=k,S.download=`timestamps-${c}-${w}.txt`,S.click(),URL.revokeObjectURL(k)}}function In(i){if(!r||!s){l("Timekeeper error:",i,"error");return}xl(s,i),Ri(i),Ve()}function wo(){s&&(Sl(s),Ri(null))}function kt(){return!!(!s||Co(s)||De||Rl()!==null)}function Ua(){document.querySelectorAll(".ytls-marker").forEach(i=>i.remove())}function _n(){if(!r||!document.body.contains(r))return;let i=r.getBoundingClientRect(),c=document.documentElement.clientWidth,d=document.documentElement.clientHeight,w=i.width,x=i.height;if(i.left<0&&(r.style.left="0",r.style.right="auto"),i.right>c){let A=Math.max(0,c-w);r.style.left=`${A}px`,r.style.right="auto"}if(i.top<0&&(r.style.top="0",r.style.bottom="auto"),i.bottom>d){let A=Math.max(0,d-x);r.style.top=`${A}px`,r.style.bottom="auto"}}function Su(){if($o&&(document.removeEventListener("mousemove",$o),$o=null),Wo&&(document.removeEventListener("mouseup",Wo),Wo=null),co&&(document.removeEventListener("keydown",co),co=null),Ko&&(window.removeEventListener("resize",Ko),Ko=null),uo&&(document.removeEventListener("pointerdown",uo,!0),uo=null),po&&(document.removeEventListener("pointerup",po,!0),po=null),bt){try{bt.disconnect()}catch{}bt=null}if(xt){try{xt.disconnect()}catch{}xt=null}let i=Te();i&&(Yo&&(i.removeEventListener("timeupdate",Yo),Yo=null),Xo&&(i.removeEventListener("pause",Xo),Xo=null),Jo&&(i.removeEventListener("play",Jo),Jo=null),Qo&&(i.removeEventListener("seeking",Qo),Qo=null),Zo&&(i.removeEventListener("ratechange",Zo),Zo=null))}function ku(){Ua(),ar(),lo&&(clearTimeout(lo),lo=null),ue&&(clearInterval(ue),ue=null),yt&&(clearTimeout(yt),yt=null),Su(),Js();try{Ct.close()}catch{}if(O&&O.parentNode===document.body&&document.body.removeChild(O),O=null,Vo=null,Tn=!1,Be=null,bt){try{bt.disconnect()}catch{}bt=null}if(xt){try{xt.disconnect()}catch{}xt=null}r&&r.parentNode&&r.remove();let i=document.getElementById("ytls-header-button");i&&i.parentNode&&i.remove(),Zt=null,jo=!1,ee(null),go(),r=null,u=null,s=null,g=null,Ke=null,Qt=null,Pe=null,m=null,f=null,E=null,lt=null}async function Tu(){let i=cr();if(!i)return lt=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let c=await uu();if(!Xr(c)){let d=cu(c),w=d.length?` Missing methods: ${d.join(", ")}.`:"",x=c?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return lt=null,{ok:!1,message:`${x}${w} Try refreshing once playback is ready.`}}return lt=c,{ok:!0,player:c,videoId:i}}async function lr(){if(!r||!s)return;let i=s.scrollTop,c=!0,d=()=>{if(!s||!c)return;let w=Math.max(0,s.scrollHeight-s.clientHeight);s.scrollTop=Math.min(i,w)};try{let w=await Tu();if(!w.ok){In(w.message),go(),Ve();return}let{videoId:x}=w,A=[];try{let k=await Bu(x);k?(A=k.map(S=>({...S,guid:S.guid||crypto.randomUUID()})),l(`Loaded ${A.length} timestamps from IndexedDB for ${x}`),wo()):l(`No timestamps found in IndexedDB for ${x}`)}catch(k){let S=`Failed to load timestamps: ${k.message}`;l(`Failed to load timestamps from IndexedDB for ${x}:`,k,"error"),In(S),Ve();return}if(A.length>0){A.sort((L,C)=>L.start-C.start),go(),ni();let k=document.createDocumentFragment();A.forEach(L=>{let R=yo(L.start,L.comment,!0,L.guid,!1).__ytls_li;R&&k.appendChild(R)}),r&&r.classList.contains("ytls-zoom-in")&&Me!=null?(l("Deferring timestamp DOM append until show animation completes"),An=k,Ut||(Ut=new Promise(L=>{ot=L})),await Ut):s&&(s.appendChild(k),tn(),nn(),Bt(),Ve(),Pe&&requestAnimationFrame(Pe)),G(A),St(!0),c=!1}else go(),Da("No timestamps for this video"),Ve(),G([]),Pe&&requestAnimationFrame(Pe)}catch(w){l("Unexpected error while loading timestamps:",w,"error"),In("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{Ut&&await Ut,requestAnimationFrame(d),Pe&&requestAnimationFrame(Pe),s&&!Co(s)&&vo()}}function cr(){let c=new URLSearchParams(location.search).get("v");if(c)return c;let d=document.querySelector('meta[itemprop="identifier"]');return d?.content?d.content:null}function Au(i=null,c=null){if(!m)return;let d=Te(),w=c||J();if(!d&&!w)return;let x=i!==null?i:w?w.getCurrentTime():0,A=Number.isFinite(x)?Math.max(0,Math.floor(x)):Math.max(0,en()),{isLive:k}=w?w.getVideoData()||{isLive:!1}:{isLive:!1},S=w?Pa(w,!!k):!1,L=s?Mn().rawTimes:[];m.textContent=Lr(A,L,er(w,d)),m.style.color=S?"#ff4d4f":""}function Eu(){let i=Te();if(!i)return;let c=NaN,d=null,w=()=>{if(!s)return;let C=J(),R=C?Math.floor(C.getCurrentTime()):0;if(!Number.isFinite(R))return;let F=Mn();if(R===c&&F===d)return;let oe=!!m&&!De&&!Rt;oe&&Au(R,C),St(!1,R),oe&&!Tn&&(c=R,d=F)},x=C=>{try{let R=new URL(window.location.href);C!==null&&Number.isFinite(C)?R.searchParams.set("t",`${Math.floor(C)}s`):R.searchParams.delete("t"),window.history.replaceState(window.history.state,"",R.toString())}catch{}},A=()=>{let C=J(),R=C?C.getCurrentTime():NaN,F=Number.isFinite(R)?Math.max(0,Math.floor(R)):Math.max(0,en());if(Number.isFinite(F)){x(F);try{St(!0)}catch(oe){l("Failed to highlight nearest timestamp on pause:",oe,"warn")}}},k=()=>{x(null);try{let C=J(),R=C?C.getCurrentTime():NaN,F=Number.isFinite(R)?Math.max(0,Math.floor(R)):Math.max(0,en());Number.isFinite(F)&&St(!0)}catch(C){l("Failed to highlight nearest timestamp on play:",C,"warn")}},S=()=>{let C=Te();if(!C)return;let R=J(),F=R?Math.floor(R.getCurrentTime()):0;Number.isFinite(F)&&(C.paused&&x(F),St(!0,F))},L=()=>{let C=i.playbackRate;y?y=!1:Sn(C),Lt(C)};Yo=w,Xo=A,Jo=k,Qo=S,Zo=L,i.addEventListener("timeupdate",w),i.addEventListener("pause",A),i.addEventListener("play",k),i.addEventListener("seeking",S),i.addEventListener("ratechange",L)}let{saveToIndexedDB:Mu,saveRowsToIndexedDB:Iu,saveSingleTimestampToIndexedDB:Lu,deleteSingleTimestampFromIndexedDB:Cu,loadFromIndexedDB:Bu,removeFromIndexedDB:qa,saveGlobalSettings:ur,loadGlobalSettings:ai,buildExportPayload:Ru,mergeBackupData:Du,exportAllTimestamps:Pu,exportAllTimestampsCsv:Ou}=Br;function Va(){if(!r)return;let i=r.style.display!=="none";ur("uiVisible",i)}function qt(i){let c=typeof i=="boolean"?i:!!r&&r.style.display!=="none",d=document.getElementById("ytls-header-button");d instanceof HTMLButtonElement&&d.setAttribute("aria-pressed",String(c)),Zt&&!jo&&Zt.src!==Cr&&(Zt.src=Cr)}function Hu(){r&&ai("uiVisible").then(i=>{let c=Cn().safeParse(i),d=c.success?c.data:void 0;typeof d=="boolean"?(d?(r.style.display="flex",r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in")):r.style.display="none",qt(d)):(!c.success&&i!==void 0&&l("UI visibility state failed validation, defaulting to visible",c.error.message,"warn"),r.style.display="flex",r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in"),qt(!0))}).catch(i=>{l("Failed to load UI visibility state:",i,"error"),r.style.display="flex",r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in"),qt(!0)})}function si(i){if(!r){l("ERROR: togglePaneVisibility called but pane is null");return}document.body.contains(r)||(l("Pane not in DOM during toggle, appending it"),document.querySelectorAll("#ytls-pane").forEach(x=>{x!==r&&x.remove()}),document.body.appendChild(r));let c=document.querySelectorAll("#ytls-pane");c.length>1&&(l(`ERROR: Multiple panes detected in togglePaneVisibility (${c.length}), cleaning up`),c.forEach(x=>{x!==r&&x.remove()})),yt&&(clearTimeout(yt),yt=null);let d=r.style.display==="none";(typeof i=="boolean"?i:d)?(r.style.display="flex",r.classList.remove("ytls-fade-out"),r.classList.remove("ytls-zoom-out"),r.classList.add("ytls-zoom-in"),qt(!0),Va(),xe(),Me&&(clearTimeout(Me),Me=null),Me=setTimeout(()=>{Ee(),Pe?.(),be(),ie(!0);try{St(!0)}catch(x){l("Failed to scroll to nearest timestamp after toggle:",x,"warn")}Me=null},450)):(r.classList.remove("ytls-fade-in"),r.classList.remove("ytls-zoom-in"),r.classList.add("ytls-zoom-out"),qt(!1),ce())}function ja(i){if(!s){l("UI is not initialized; cannot import timestamps.","warn");return}let c=!1,d=[],w=(x,A)=>{let k=x.querySelector("input");if(!k)return;k.value=A;let S=x.dataset.guid,L=Number.parseInt(x.querySelector("[data-time]")?.dataset.time??"",10);S&&Number.isFinite(L)&&d.push({guid:S,start:L,comment:A})};try{let x=JSON.parse(i),A=null;if(Array.isArray(x))A=x;else if(typeof x=="object"&&x!==null){let k=Be;if(k){let S=`timekeeper-${k}`;x[S]&&Array.isArray(x[S].timestamps)&&(A=x[S].timestamps,l(`Found timestamps for current video (${k}) in export format`,"info"))}if(!A){let S=Object.keys(x).filter(L=>L.startsWith("ytls-"));if(S.length===1&&Array.isArray(x[S[0]].timestamps)){A=x[S[0]].timestamps;let L=x[S[0]].video_id;l(`Found timestamps for video ${L} in export format`,"info")}}}A&&Array.isArray(A)?A.every(S=>typeof S.start=="number"&&typeof S.comment=="string")?(A.forEach(S=>{if(S.guid){let L=Re().find(C=>C.dataset.guid===S.guid);L?w(L,S.comment):yo(S.start,S.comment,!1,S.guid)}else yo(S.start,S.comment,!1,crypto.randomUUID())}),c=!0):l("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):l("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!c){let x=i.split(`
`).map(A=>A.trim()).filter(A=>A);if(x.length>0){let A=!1;x.forEach(k=>{let S=k.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(S){A=!0;let L=parseInt(S[1])||0,C=parseInt(S[2]),R=parseInt(S[3]),F=L*3600+C*60+R,oe=S[4]?S[4].trim():"",ye=null,ct=oe,Q=oe.match(/<!--\s*guid:([^>]+?)\s*-->/);Q&&(ye=Q[1].trim(),ct=oe.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let ae;ye&&(ae=Re().find(Oe=>Oe.dataset.guid===ye)),!ae&&!ye&&(ae=Re().find(Oe=>{if(Oe.dataset.guid)return!1;let Tt=Oe.querySelector("[data-time]")?.dataset.time;if(!Tt)return!1;let Dt=Number.parseInt(Tt,10);return Number.isFinite(Dt)&&Dt===F})),ae?w(ae,ct):yo(F,ct,!1,ye||crypto.randomUUID())}}),A&&(c=!0)}}c?(l("Timestamps changed: Imported timestamps from file/clipboard"),Bt(),ii(),_a(Be,d),Ve(),ir()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function Nu(){if(ei){l("Pane initialization already in progress, skipping duplicate call");return}if(!(r&&document.body.contains(r))){ei=!0;try{let x=function(p=null,h=null){if(!m)return;let b=Te(),T=h||J();if(!b&&!T)return;let I=p!==null?p:T?T.getCurrentTime():0,$=Number.isFinite(I)?Math.max(0,Math.floor(I)):Math.max(0,en()),{isLive:P}=T?T.getVideoData()||{isLive:!1}:{isLive:!1},_=T?Pa(T,!!P):!1,B=s?Mn().rawTimes:[];m.textContent=Lr($,B,er(T,b)),m.style.color=_?"#ff4d4f":"",w(!!P);try{Lt()}catch{}},A=function(){if(De||Rt)return;let p=J();if(!p)return;let h=p.getCurrentTime(),b=Number.isFinite(h)?Math.max(0,Math.floor(h)):Math.max(0,en());x(b,p),(s?Re():[]).length>0&&St(!1,b)},ae=function(p,h,b,T){let I=document.createElement("button");return T?j(I,T,p):I.textContent=p,Ge(I,h),I.classList.add("ytls-settings-modal-button"),I.onclick=b,I},Oe=function(p="general"){if(O&&O.parentNode===document.body){let se=document.getElementById("ytls-save-modal"),cn=document.getElementById("ytls-load-modal"),Wt=document.getElementById("ytls-delete-all-modal");se&&document.body.contains(se)&&document.body.removeChild(se),cn&&document.body.contains(cn)&&document.body.removeChild(cn),Wt&&document.body.contains(Wt)&&document.body.removeChild(Wt),O.classList.remove("ytls-fade-in"),O.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(O)&&document.body.removeChild(O),O=null,document.removeEventListener("click",Tt,!0),document.removeEventListener("keydown",rt)},300);return}O=document.createElement("div"),O.id="ytls-settings-modal",O.classList.remove("ytls-fade-out"),O.classList.add("ytls-fade-in");let h=document.createElement("div");h.className="ytls-modal-header";let b=document.createElement("div");b.id="ytls-settings-nav";let T=document.createElement("button");T.className="ytls-modal-close-button",_e(T,"x",14),T.onclick=()=>{if(O&&O.parentNode===document.body){let se=document.getElementById("ytls-save-modal"),cn=document.getElementById("ytls-load-modal"),Wt=document.getElementById("ytls-delete-all-modal");se&&document.body.contains(se)&&document.body.removeChild(se),cn&&document.body.contains(cn)&&document.body.removeChild(cn),Wt&&document.body.contains(Wt)&&document.body.removeChild(Wt),O.classList.remove("ytls-fade-in"),O.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(O)&&document.body.removeChild(O),O=null,document.removeEventListener("click",Tt,!0),document.removeEventListener("keydown",rt)},300)}};let I=document.createElement("div");I.id="ytls-settings-content";let $=document.createElement("h3");$.className="ytls-section-heading",$.textContent="General",$.style.display="none";let P=document.createElement("div"),_=document.createElement("div");_.className="ytls-button-grid";let B=document.createElement("div");B.className="ytls-button-grid";function W(se){P.style.display=se==="general"?"block":"none",_.style.display=se==="google"?"block":"none",B.style.display=se==="sync"?"block":"none",fe.classList.toggle("active",se==="general"),Ye.classList.toggle("active",se==="google"),At.classList.toggle("active",se==="sync"),$.textContent=se==="general"?"General":se==="google"?"Google":"Sync"}let fe=document.createElement("button");fe.appendChild(Wn("adjustments-horizontal",16));let Ie=document.createElement("span");Ie.className="ytls-tab-text",Ie.textContent=" General",fe.appendChild(Ie),Ge(fe,"General settings"),fe.classList.add("ytls-settings-modal-button"),fe.onclick=()=>W("general");let Ye=document.createElement("button");Ye.appendChild(Wn("cloud",16));let an=document.createElement("span");an.className="ytls-tab-text",an.textContent=" Google",Ye.appendChild(an),Ge(Ye,"Google Drive backup settings"),Ye.classList.add("ytls-settings-modal-button"),Ye.onclick=async()=>{ft.isSignedIn&&await Sc(),W("google")};let At=document.createElement("button");At.appendChild(Wn("server",16));let sn=document.createElement("span");sn.className="ytls-tab-text",sn.textContent=" Sync",At.appendChild(sn),Ge(At,"Live sync across devices"),At.classList.add("ytls-settings-modal-button"),At.onclick=()=>W("sync"),b.appendChild(fe),b.appendChild(Ye),b.appendChild(At),h.appendChild(b),h.appendChild(T),O.appendChild(h),P.className="ytls-button-grid",P.appendChild(ae("Save","Save As...",Dt.onclick,"device-floppy")),P.appendChild(ae("Load","Load",Gn.onclick,"folder-open")),P.appendChild(ae("Export All","Export All Data",on.onclick,"file-export")),P.appendChild(ae("Import All","Import All Data",Fn.onclick,"file-import")),P.appendChild(ae("Export All (CSV)","Export All Timestamps to CSV",async()=>{try{await Ou()}catch{alert("Failed to export CSV: Could not read from database.")}},"file-spreadsheet"));let jt=ae(ft.isSignedIn?"Sign Out":"Sign In",ft.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{ft.isSignedIn?await xc():await wc(),j(jt,ft.isSignedIn?"logout":"login",ft.isSignedIn?"Sign Out":"Sign In"),Ge(jt,ft.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),Ae()},ft.isSignedIn?"logout":"login"),So=ae(zo()?"Auto Backup: On":"Auto Backup: Off","Toggle Auto Backup",async()=>{await Ic(),xr(),Ae()},"refresh"),ts=ae(`Backup Interval: ${_t()}min`,"Set periodic backup interval (minutes)",async()=>{await Lc(),xr(),Ae()},"clock-plus"),xr=()=>{j(jt,ft.isSignedIn?"logout":"login",ft.isSignedIn?"Sign Out":"Sign In"),Ge(jt,ft.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),j(So,"refresh",zo()?"Auto Backup: On":"Auto Backup: Off"),j(ts,"clock-plus",`Backup Interval: ${_t()}min`),typeof Ae=="function"&&Ae()};_.appendChild(jt),_.appendChild(So),_.appendChild(ts),_.appendChild(ae("Backup Now","Run a backup immediately",async()=>{await No({silent:!1,skipBackoff:!0}),xr()},"database"));let $t=document.createElement("div");$t.style.marginTop="15px",$t.style.paddingTop="10px",$t.style.borderTop="1px solid #555",$t.style.fontSize="12px",$t.style.color="#aaa";let Sr=document.createElement("div");Sr.style.marginBottom="8px",Sr.style.fontWeight="bold",$t.appendChild(Sr),cc(Sr);let di=document.createElement("div");di.style.marginBottom="8px",sc(di),$t.appendChild(di);let ns=document.createElement("div");lc(ns),$t.appendChild(ns),_.appendChild($t),et(),to(),Ae(),xr();let kr=ae("Sign In","Sign in to Timekeeper Sync with Google",async()=>{nt().isSignedIn?await eu():await Zc()},"login"),os=ae("Sync Now","Sync with the server immediately",()=>ha(),"refresh");Wc(()=>{let se=nt().isSignedIn;j(kr,se?"logout":"login",se?"Sign Out":"Sign In"),Ge(kr,se?"Sign out of Timekeeper Sync":"Sign in to Timekeeper Sync with Google"),kr.disabled=!se&&!io(),os.disabled=!se}),B.appendChild(kr),B.appendChild(os);let ln=document.createElement("div");ln.style.marginTop="15px",ln.style.paddingTop="10px",ln.style.borderTop="1px solid #555",ln.style.fontSize="12px",ln.style.color="#aaa";let Tr=document.createElement("div");Tr.style.marginBottom="8px",Tr.style.fontWeight="bold",ln.appendChild(Tr),jc(Tr);let rs=document.createElement("div");ln.appendChild(rs),$c(rs),B.appendChild(ln),oo(),I.appendChild($),I.appendChild(P),I.appendChild(_),I.appendChild(B),W(p==="drive"?"google":p),O.appendChild(I),document.body.appendChild(O),requestAnimationFrame(()=>{let se=O.getBoundingClientRect(),Wt=(window.innerHeight-se.height)/2;O.style.top=`${Math.max(20,Wt)}px`,O.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",Tt,!0),document.addEventListener("keydown",rt)},0)},rt=function(p){if(p.key==="Escape"&&O&&O.parentNode===document.body){let h=document.getElementById("ytls-save-modal"),b=document.getElementById("ytls-load-modal"),T=document.getElementById("ytls-delete-all-modal");if(h||b||T)return;p.preventDefault(),h&&document.body.contains(h)&&document.body.removeChild(h),b&&document.body.contains(b)&&document.body.removeChild(b),T&&document.body.contains(T)&&document.body.removeChild(T),O.classList.remove("ytls-fade-in"),O.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(O)&&document.body.removeChild(O),O=null,document.removeEventListener("click",Tt,!0),document.removeEventListener("keydown",rt)},300)}},Tt=function(p){if(Vo&&Vo.contains(p.target))return;let h=document.getElementById("ytls-save-modal"),b=document.getElementById("ytls-load-modal"),T=document.getElementById("ytls-delete-all-modal");h&&h.contains(p.target)||b&&b.contains(p.target)||T&&T.contains(p.target)||O&&O.contains(p.target)||(h&&document.body.contains(h)&&document.body.removeChild(h),b&&document.body.contains(b)&&document.body.removeChild(b),T&&document.body.contains(T)&&document.body.removeChild(T),O&&O.parentNode===document.body&&(O.classList.remove("ytls-fade-in"),O.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(O)&&document.body.removeChild(O),O=null,document.removeEventListener("click",Tt,!0),document.removeEventListener("keydown",rt)},300)))},bo=function(){r&&(l("Loading window position from IndexedDB"),ai("windowPosition").then(p=>{let h=ss.safeParse(p);if(h.success){let T=h.data;r.style.left=`${T.x}px`,r.style.top=`${T.y}px`,r.style.right="auto",r.style.bottom="auto",typeof T.width=="number"&&T.width>0?r.style.width=`${T.width}px`:(r.style.width=`${Jr}px`,l(`No stored window width found, using default width ${Jr}px`)),typeof T.height=="number"&&T.height>0?r.style.height=`${T.height}px`:(r.style.height=`${Qr}px`,l(`No stored window height found, using default height ${Qr}px`));let I=D();ve(I,T.x,T.y),l("Restored window position from IndexedDB:",me())}else h.success?l("No window position found in IndexedDB, applying default size and leaving default position"):l("Window position in IndexedDB failed validation:",h.error.message,"warn"),r.style.width=`${Jr}px`,r.style.height=`${Qr}px`,ee(null);_n();let b=D();b&&(b.width||b.height)&&ve(b),Pe?.()}).catch(p=>{l("failed to load pane position from IndexedDB:",p,"warn"),_n();let h=D();h&&(h.width||h.height)&&ee({x:Math.max(0,Math.round(h.left)),y:0,width:Math.round(h.width),height:Math.round(h.height)}),Pe?.()}))},xo=function(){if(!r)return;let p=D();if(!p)return;let h={x:Math.max(0,Math.round(p.left)),y:Math.max(0,Math.round(p.top)),width:Math.round(p.width),height:Math.round(p.height)},b=me();if(b&&b.x===h.x&&b.y===h.y&&b.width===h.width&&b.height===h.height){l("Skipping window position save; position and size unchanged");return}ee({...h}),l(`Saving window position and size to IndexedDB: x=${h.x}, y=${h.y}, width=${h.width}, height=${h.height}`),ur("windowPosition",h),kn({type:"window_position_updated",position:h,timestamp:Date.now()})},vr=function(p,h){p.addEventListener("dblclick",b=>{b.preventDefault(),b.stopPropagation(),r&&(r.style.width="300px",r.style.height="300px",xo(),br())}),p.addEventListener("mousedown",b=>{b.preventDefault(),b.stopPropagation(),Pt=!0,rn=h,Ka=b.clientX,Ya=b.clientY;let T=r.getBoundingClientRect();Un=T.width,qn=T.height,hr=T.left,gr=T.top,Xa=document.documentElement.clientWidth,Ja=document.documentElement.clientHeight,h==="top-left"||h==="bottom-right"?document.body.style.cursor="nwse-resize":document.body.style.cursor="nesw-resize"})},Za=function(){if(!s||!Qt)return;let{scrollTop:p,scrollHeight:h,clientHeight:b}=s;if(h<=b)return;let T=Math.max(30,b/h*b),I=p/(h-b)*(b-T);Qt.style.height=`${T}px`,Qt.style.top=`${I}px`},es=function(){Ke&&(ui===null&&(ui=requestAnimationFrame(()=>{ui=null,Za()})),Ke.classList.add("ytls-scrollbar-visible"),wt&&clearTimeout(wt),wt=setTimeout(()=>{Ke?.classList.remove("ytls-scrollbar-visible"),wt=null},500))},br=function(){if(r&&u&&g&&s){let p=r.getBoundingClientRect(),h=u.getBoundingClientRect(),b=g.getBoundingClientRect(),T=p.height-(h.height+b.height);s.style.maxHeight=T>0?T+"px":"0px",s.style.overflowY=T>0?"auto":"hidden"}};if(document.querySelectorAll("#ytls-pane").forEach(p=>p.remove()),!document.getElementById("ytls-styles")){let p=document.createElement("style");p.id="ytls-styles",p.textContent=Ws,document.head.appendChild(p)}r=document.createElement("div"),u=document.createElement("div"),s=document.createElement("ul"),g=document.createElement("div"),m=document.createElement("span"),E=document.createElement("span"),M=document.createElement("span"),M.classList.add("ytls-backup-indicator"),M.style.cursor="pointer",M.style.backgroundColor="#666",M.onclick=p=>{p.stopPropagation(),Oe("drive")},s.addEventListener("mouseenter",()=>{Tn=!0,mo=!1}),s.addEventListener("mouseleave",()=>{Tn=!1;try{hi()}catch{}if(mo)return;St(!1);let p=null;if(document.activeElement instanceof HTMLInputElement&&s.contains(document.activeElement)&&(p=document.activeElement.closest("li")?.dataset.guid??null),za(),p){let b=Re().find(T=>T.dataset.guid===p)?.querySelector("input");if(b)try{b.focus({preventScroll:!0})}catch{}}}),r.id="ytls-pane",u.id="ytls-pane-header",u.addEventListener("dblclick",p=>{let h=p.target instanceof Element?p.target:null;if(h){let b=h;for(;b&&b!==r;){if(window.getComputedStyle(b).cursor==="pointer")return;b=b.parentElement}}p.preventDefault(),si(!1)});let i=p=>{try{p.stopPropagation()}catch{}};["click","dblclick","mousedown","pointerdown","touchstart","wheel"].forEach(p=>{r.addEventListener(p,i)}),r.addEventListener("keydown",p=>{try{p.stopPropagation()}catch{}}),r.addEventListener("keyup",p=>{try{p.stopPropagation()}catch{}}),r.addEventListener("focus",p=>{try{p.stopPropagation()}catch{}},!0),r.addEventListener("blur",p=>{try{p.stopPropagation()}catch{}},!0),E.textContent=`v${Mr}`,E.classList.add("ytls-version-display");let c=document.createElement("span");c.style.display="inline-flex",c.style.alignItems="center",c.style.gap="6px",c.appendChild(E),c.appendChild(M),m.id="ytls-current-time",m.textContent="\u2014",m.style.cursor="default",Ge(m,()=>{let p=J(),{isLive:h}=p?p.getVideoData()||{isLive:!1}:{isLive:!1};return h?"Skip to live":""}),f=document.createElement("span"),f.id="ytls-playback-speed",f.textContent="1x",f.style.cursor="pointer",f.style.userSelect="none",Ge(f,()=>`Current playback speed. Click to toggle between 1x and ${Jt(v)}x.`),f.onclick=()=>{ba()},f.addEventListener("mousedown",p=>{p.stopPropagation()}),f.addEventListener("click",p=>{p.stopPropagation()}),m.onclick=()=>{let p=J();if(!p)return;let{isLive:h}=p.getVideoData()||{isLive:!1};h&&(Rt=!0,p.seekToLiveHead(),setTimeout(()=>{Rt=!1},500))};let w=p=>{m.style.cursor=p?"pointer":"default"};A(),ue&&clearInterval(ue),ue=setInterval(A,1e3),g.id="ytls-buttons";let k=(p,h)=>()=>{p.classList.remove("ytls-fade-in"),p.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(p)&&document.body.removeChild(p),h&&h()},300)},S=p=>h=>{h.key==="Escape"&&(h.preventDefault(),h.stopPropagation(),p())},L=p=>{setTimeout(()=>{document.addEventListener("keydown",p)},0)},C=(p,h)=>b=>{p.contains(b.target)||h()},R=p=>{setTimeout(()=>{document.addEventListener("click",p,!0)},0)};[{id:"add",icon:"alarm-plus",title:"Add timestamp",action:()=>{if(kt())return;let p=typeof Nn<"u"?Nn:0,h=J(),b=h?Math.floor(h.getCurrentTime()+p):0;if(!Number.isFinite(b))return;let T=yo(b,"");T&&T.focus()}},{id:"settings",icon:"settings",title:"Settings",action:()=>Oe()},{id:"copy",icon:"clipboard",title:"Copy timestamps to clipboard",action:function(p){if(kt()){_e(this,"circle-x",20),setTimeout(()=>{_e(this,"clipboard",20)},2e3);return}let h=ti();if(h.length===0){_e(this,"circle-x",20),setTimeout(()=>{_e(this,"clipboard",20)},2e3);return}let b=p.ctrlKey,T=fi(h,b);navigator.clipboard.writeText(T).then(()=>{_e(this,"circle-check",20),setTimeout(()=>{_e(this,"clipboard",20)},2e3)}).catch(I=>{l("Failed to copy timestamps: ",I,"error"),_e(this,"circle-x",20),setTimeout(()=>{_e(this,"clipboard",20)},2e3)})}},{id:"offset",icon:"clock-plus",title:"Offset all timestamps",action:()=>{if(kt())return;if(Re().length===0){alert("No timestamps available to offset.");return}let h=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(h===null)return;let b=h.trim();if(b.length===0)return;let T=Number.parseInt(b,10);if(!Number.isFinite(T)){alert("Please enter a valid integer number of seconds.");return}T!==0&&Ha(T,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{id:"delete",icon:"trash",title:"Delete all timestamps for current video",action:async()=>{let p=cr();if(!p){alert("Unable to determine current video ID.");return}let h=document.createElement("div");h.id="ytls-delete-all-modal",h.classList.remove("ytls-fade-out"),h.classList.add("ytls-fade-in");let b=document.createElement("p");b.textContent="Hold the button to delete all timestamps for:",b.style.marginBottom="10px";let T=document.createElement("p");T.textContent=p,T.style.fontFamily="monospace",T.style.fontSize="12px",T.style.marginBottom="15px",T.style.color="#aaa";let I=document.createElement("button");I.classList.add("ytls-save-modal-button"),I.style.background="#d32f2f",I.style.position="relative",I.style.overflow="hidden";let $=null,P=0,_=null,B=document.createElement("div");B.style.position="absolute",B.style.left="0",B.style.top="0",B.style.height="100%",B.style.width="0%",B.style.background="#ff6b6b",B.style.transition="none",B.style.pointerEvents="none",I.appendChild(B);let W=document.createElement("span");W.textContent="Hold to Delete All",W.style.position="relative",W.style.zIndex="1",I.appendChild(W);let fe=()=>{if(!P)return;let jt=Date.now()-P,So=Math.min(jt/5e3*100,100);B.style.width=`${So}%`,So<100&&(_=requestAnimationFrame(fe))},Ie=()=>{$&&(clearTimeout($),$=null),_&&(cancelAnimationFrame(_),_=null),P=0,B.style.width="0%",W.textContent="Hold to Delete All"};I.onmousedown=()=>{P=Date.now(),W.textContent="Deleting...",_=requestAnimationFrame(fe),$=setTimeout(async()=>{Ie(),h.classList.remove("ytls-fade-in"),h.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(h)&&document.body.removeChild(h);try{await qa(p),li()}catch(jt){l("Failed to delete all timestamps:",jt,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},I.onmouseup=Ie,I.onmouseleave=Ie;let Ye=null,an=null,At=k(h,()=>{Ie(),Ye&&document.removeEventListener("keydown",Ye),an&&document.removeEventListener("click",an,!0)});Ye=S(At),an=C(h,At);let sn=document.createElement("button");sn.textContent="Cancel",sn.classList.add("ytls-save-modal-cancel-button"),sn.onclick=At,h.appendChild(b),h.appendChild(T),h.appendChild(I),h.appendChild(sn),document.body.appendChild(h),L(Ye),R(an)}}].forEach(p=>{let h=document.createElement("button");_e(h,p.icon,20),Ge(h,p.title),h.classList.add("ytls-main-button"),p.id==="copy"?h.onclick=function(b){p.action.call(this,b)}:h.onclick=p.action,p.id==="settings"&&(Vo=h),g.appendChild(h)});let Dt=document.createElement("button");j(Dt,"device-floppy","Save"),Dt.classList.add("ytls-file-operation-button"),Dt.onclick=()=>{let p=document.createElement("div");p.id="ytls-save-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let h=document.createElement("p");h.textContent="Save as:";let b=null,T=null,I=k(p,()=>{b&&document.removeEventListener("keydown",b),T&&document.removeEventListener("click",T,!0)});b=S(I),T=C(p,I);let $=document.createElement("button");$.textContent="JSON",$.classList.add("ytls-save-modal-button"),$.onclick=()=>{b&&document.removeEventListener("keydown",b),T&&document.removeEventListener("click",T,!0),k(p,()=>Fa("json"))()};let P=document.createElement("button");P.textContent="Plain Text",P.classList.add("ytls-save-modal-button"),P.onclick=()=>{b&&document.removeEventListener("keydown",b),T&&document.removeEventListener("click",T,!0),k(p,()=>Fa("text"))()};let _=document.createElement("button");_.textContent="Cancel",_.classList.add("ytls-save-modal-cancel-button"),_.onclick=I,p.appendChild(h),p.appendChild($),p.appendChild(P),p.appendChild(_),document.body.appendChild(p),L(b),R(T)};let Gn=document.createElement("button");j(Gn,"folder-open","Load"),Gn.classList.add("ytls-file-operation-button"),Gn.onclick=()=>{let p=document.createElement("div");p.id="ytls-load-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let h=document.createElement("p");h.textContent="Load from:";let b=null,T=null,I=k(p,()=>{b&&document.removeEventListener("keydown",b),T&&document.removeEventListener("click",T,!0)});b=S(I),T=C(p,I);let $=document.createElement("button");$.textContent="File",$.classList.add("ytls-save-modal-button"),$.onclick=()=>{let B=document.createElement("input");B.type="file",B.accept=".json,.txt",B.classList.add("ytls-hidden-file-input"),B.onchange=W=>{let fe=W.target.files?.[0];if(!fe)return;b&&document.removeEventListener("keydown",b),T&&document.removeEventListener("click",T,!0),I();let Ie=new FileReader;Ie.onload=()=>{let Ye=String(Ie.result).trim();ja(Ye)},Ie.readAsText(fe)},B.click()};let P=document.createElement("button");P.textContent="Clipboard",P.classList.add("ytls-save-modal-button"),P.onclick=async()=>{b&&document.removeEventListener("keydown",b),T&&document.removeEventListener("click",T,!0),k(p,async()=>{try{let B=await navigator.clipboard.readText();B?ja(B.trim()):alert("Clipboard is empty.")}catch(B){l("Failed to read from clipboard: ",B,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let _=document.createElement("button");_.textContent="Cancel",_.classList.add("ytls-save-modal-cancel-button"),_.onclick=I,p.appendChild(h),p.appendChild($),p.appendChild(P),p.appendChild(_),document.body.appendChild(p),L(b),R(T)};let on=document.createElement("button");j(on,"file-export","Export"),on.classList.add("ytls-file-operation-button"),on.onclick=async()=>{try{await Pu()}catch{alert("Failed to export data: Could not read from database.")}};let Fn=document.createElement("button");j(Fn,"file-import","Import"),Fn.classList.add("ytls-file-operation-button"),Fn.onclick=()=>{let p=document.createElement("input");p.type="file",p.accept=".json",p.classList.add("ytls-hidden-file-input"),p.onchange=h=>{let b=h.target.files?.[0];if(!b)return;let T=new FileReader;T.onload=()=>{try{let I=JSON.parse(String(T.result)),$=[];for(let P in I)if(Object.prototype.hasOwnProperty.call(I,P)&&P.startsWith("ytls-")){let _=P.substring(5),B=I[P];if(B&&typeof B.video_id=="string"&&Array.isArray(B.timestamps)){let W=B.timestamps.map(Ie=>({...Ie,guid:Ie.guid||crypto.randomUUID()})),fe=Mu(_,W).then(()=>l(`Imported ${_} to IndexedDB`)).catch(Ie=>l(`Failed to import ${_} to IndexedDB:`,Ie,"error"));$.push(fe)}else l(`Skipping key ${P} during import due to unexpected data format.`,"warn")}Promise.all($).then(()=>{li()}).catch(P=>{alert("An error occurred during import to IndexedDB. Check console for details."),l("Overall import error:",P,"error")})}catch(I){alert(`Failed to import data. Please ensure the file is in the correct format.
`+I.message),l("Import error:",I,"error")}},T.readAsText(b)},p.click()},s.onclick=p=>{Na(p)},s.ontouchstart=p=>{Na(p)},r.style.position="fixed",r.style.bottom="0",r.style.right="0",r.style.transition="none",bo(),setTimeout(()=>_n(),10);let Vt=!1,dr=0,pr=0,mr=0,Ln=0,fr=0,U=0,H=null,pe=!1;r.addEventListener("mousedown",p=>{let h=p.target;if(!(h instanceof Element)||h instanceof HTMLInputElement||h instanceof HTMLTextAreaElement||h instanceof Element&&(h.closest("#ytls-playback-speed-group")||h.closest("#ytls-playback-speed"))||h!==u&&!u.contains(h)&&window.getComputedStyle(h).cursor==="pointer")return;Vt=!0,pe=!1;let b=r.getBoundingClientRect();dr=p.clientX-b.left,pr=p.clientY-b.top,mr=b.width,Ln=b.height,fr=document.documentElement.clientWidth,U=document.documentElement.clientHeight,r.style.transition="none"}),document.addEventListener("mousemove",$o=p=>{if(!Vt)return;pe=!0;let h=p.clientX,b=p.clientY;H===null&&(H=requestAnimationFrame(()=>{if(H=null,!Vt)return;let T=Math.max(0,Math.min(h-dr,fr-mr)),I=Math.max(0,Math.min(b-pr,U-Ln));r.style.left=`${T}px`,r.style.top=`${I}px`,r.style.right="auto",r.style.bottom="auto"}))}),document.addEventListener("mouseup",Wo=()=>{if(!Vt)return;Vt=!1,H!==null&&(cancelAnimationFrame(H),H=null);let p=pe;setTimeout(()=>{pe=!1},50),_n(),setTimeout(()=>{p&&xo()},200)}),r.addEventListener("dragstart",p=>p.preventDefault());let Z=document.createElement("div"),he=document.createElement("div"),je=document.createElement("div"),ut=document.createElement("div");Z.id="ytls-resize-tl",he.id="ytls-resize-tr",je.id="ytls-resize-bl",ut.id="ytls-resize-br";let Pt=!1,Ka=0,Ya=0,Un=0,qn=0,hr=0,gr=0,Xa=0,Ja=0,Vn=null,rn=null;vr(Z,"top-left"),vr(he,"top-right"),vr(je,"bottom-left"),vr(ut,"bottom-right"),document.addEventListener("mousemove",p=>{if(!Pt||!r||!rn)return;let h=p.clientX,b=p.clientY;Vn===null&&(Vn=requestAnimationFrame(()=>{if(Vn=null,!Pt||!r||!rn)return;let T=h-Ka,I=b-Ya,$=Xa,P=Ja,_=Un,B=qn,W=hr,fe=gr;rn==="bottom-right"?(_=Math.max(200,Math.min(800,Un+T)),B=Math.max(250,Math.min(P,qn+I))):rn==="top-left"?(_=Math.max(200,Math.min(800,Un-T)),W=hr+T,B=Math.max(250,Math.min(P,qn-I)),fe=gr+I):rn==="top-right"?(_=Math.max(200,Math.min(800,Un+T)),B=Math.max(250,Math.min(P,qn-I)),fe=gr+I):rn==="bottom-left"&&(_=Math.max(200,Math.min(800,Un-T)),W=hr+T,B=Math.max(250,Math.min(P,qn+I))),W=Math.max(0,Math.min(W,$-_)),fe=Math.max(0,Math.min(fe,P-B)),r.style.width=`${_}px`,r.style.height=`${B}px`,r.style.left=`${W}px`,r.style.top=`${fe}px`,r.style.right="auto",r.style.bottom="auto"}))}),document.addEventListener("mouseup",()=>{Pt&&(Pt=!1,Vn!==null&&(cancelAnimationFrame(Vn),Vn=null),rn=null,document.body.style.cursor="",ie(!0))});let yr=null;window.addEventListener("resize",Ko=()=>{yr&&clearTimeout(yr),yr=setTimeout(()=>{ie(!0),Pe?.(),yr=null},200)}),u.appendChild(m);let jn=document.createElement("span");jn.id="ytls-playback-speed-group",jn.style.display="inline-flex",jn.style.alignItems="center",jn.style.marginLeft="4px",f&&jn.appendChild(f),u.appendChild(jn),u.appendChild(c);let ci=document.createElement("div");ci.id="ytls-list-wrapper",Ke=document.createElement("div"),Ke.className="ytls-scrollbar-track",Qt=document.createElement("div"),Qt.className="ytls-scrollbar-thumb",Ke.append(Qt),ci.append(s,Ke);let wr=document.createElement("div");wr.id="ytls-content",wr.append(ci),wr.append(g),r.append(u,wr,Z,he,je,ut);let Qa="";r.addEventListener("mousemove",p=>{if(Vt||Pt)return;let h=r.getBoundingClientRect(),b=20,T=p.clientX,I=p.clientY,$=T-h.left<=b,P=h.right-T<=b,_=I-h.top<=b,B=h.bottom-I<=b,W="";_&&$||B&&P?W="nwse-resize":(_&&P||B&&$)&&(W="nesw-resize"),W!==Qa&&(Qa=W,document.body.style.cursor=W)});let ui=null;if(Ke.addEventListener("mouseenter",()=>{wt&&(clearTimeout(wt),wt=null),Ke.classList.add("ytls-scrollbar-visible")}),Ke.addEventListener("mouseleave",()=>{Zr||(wt=setTimeout(()=>{Ke?.classList.remove("ytls-scrollbar-visible"),wt=null},500))}),Qt.addEventListener("mousedown",p=>{if(!s)return;p.preventDefault(),p.stopPropagation(),Zr=!0;let h=p.clientY,b=s.scrollTop,{scrollHeight:T,clientHeight:I}=s,$=Math.max(30,I/T*I),P=T-I,_=I-$;function B(fe){if(!s)return;let Ie=fe.clientY-h;s.scrollTop=Math.max(0,Math.min(P,b+Ie*(P/_))),Za()}function W(){Zr=!1,document.removeEventListener("mousemove",B),document.removeEventListener("mouseup",W),Ke?.matches(":hover")||(wt=setTimeout(()=>{Ke?.classList.remove("ytls-scrollbar-visible"),wt=null},500))}document.addEventListener("mousemove",B),document.addEventListener("mouseup",W)}),r.addEventListener("mouseenter",()=>{Tn=!0,es()}),s.addEventListener("scroll",es),r.addEventListener("mouseleave",()=>{!Pt&&!Vt&&(document.body.style.cursor=""),Tn=!1;try{hi()}catch{}try{St(!1)}catch{}}),Pe=br,setTimeout(()=>{if(br(),r&&u&&g&&s){let p=40,h=Re();if(h.length>0)p=h[0].offsetHeight;else{let b=document.createElement("li");b.style.visibility="hidden",b.style.position="absolute",b.textContent="00:00 Example",s.appendChild(b),p=b.offsetHeight,s.removeChild(b)}ne(u.offsetHeight+g.offsetHeight+p),r.style.minHeight=V()+"px"}},0),xt){try{xt.disconnect()}catch{}xt=null}xt=new ResizeObserver(br),xt.observe(r),uo||document.addEventListener("pointerdown",uo=()=>{Ea=Date.now()},!0),po||document.addEventListener("pointerup",po=()=>{},!0)}finally{ei=!1}}}async function zu(){if(!r)return;if(document.querySelectorAll("#ytls-pane").forEach(d=>{d!==r&&(l("Removing duplicate pane element from DOM"),d.remove())}),document.body.contains(r)){l("Pane already in DOM, skipping append");return}await Hu(),mc(Ru),fc(Du),ta(ur),na(ai),hc(lr),uc(M),await oa(),await Ec(),await yn(),ia();let c=document.querySelectorAll("#ytls-pane");if(c.length>0&&(l(`WARNING: Found ${c.length} existing pane(s) in DOM, removing all`),c.forEach(d=>d.remove())),document.body.contains(r)){l("ERROR: Pane already in body, aborting append");return}if(document.body.appendChild(r),l("Pane successfully appended to DOM"),xe(),Me&&(clearTimeout(Me),Me=null),Me=setTimeout(()=>{Ee(),Pe?.(),be(),ie(!0),Me=null},450),bt){try{bt.disconnect()}catch{}bt=null}bt=new MutationObserver(()=>{let d=document.querySelectorAll("#ytls-pane");d.length>1&&(l(`CRITICAL: Multiple panes detected (${d.length}), removing duplicates`),d.forEach((w,x)=>{(x>0||r&&w!==r)&&w.remove()}))}),bt.observe(document.body,{childList:!0})}function $a(i=0){if(document.getElementById("ytls-header-button")){qt();return}let c=document.querySelector("#logo");if(!c||!c.parentElement){i<10&&setTimeout(()=>$a(i+1),300);return}let d=document.createElement("button");d.id="ytls-header-button",d.type="button",d.className="ytls-header-button",Ge(d,"Toggle Timekeeper UI"),d.setAttribute("aria-label","Toggle Timekeeper UI");let w=document.createElement("img");w.src=Cr,w.alt="",w.decoding="async",d.appendChild(w),Zt=w,d.addEventListener("mouseenter",()=>{Zt&&(jo=!0,Zt.src=Ks)}),d.addEventListener("mouseleave",()=>{Zt&&(jo=!1,qt())}),d.addEventListener("click",()=>{r&&!document.body.contains(r)&&(l("Pane not in DOM, re-appending before toggle"),document.body.appendChild(r)),si()}),c.insertAdjacentElement("afterend",d),qt(),l("Timekeeper header button added next to YouTube logo")}function Wa(){if(X())return;le(!0);let i=history.pushState,c=history.replaceState;function d(){try{let w=new Event("locationchange");window.dispatchEvent(w)}catch{}}history.pushState=function(){let w=i.apply(this,arguments);return d(),w},history.replaceState=function(){let w=c.apply(this,arguments);return d(),w},window.addEventListener("popstate",d),window.addEventListener("locationchange",()=>{window.location.href!==q&&l("Location changed (locationchange event) \u2014 deferring UI update until navigation finish")})}async function li(){if(!a()){ku();return}z(window.location.href),document.querySelectorAll("#ytls-pane").forEach((c,d)=>{(d>0||r&&c!==r)&&c.remove()}),await qe(),await Nu(),Be=cr();let i=document.title;l("Page Title:",i),l("Video ID:",Be),l("Current URL:",window.location.href),oi(!0),go(),Ve(),await lr(),Ve(),oi(!1),l("Timestamps loaded and UI unlocked for video:",Be),await zu();try{St(!0)}catch{}$a(),Eu()}Wa(),window.addEventListener("yt-navigate-start",()=>{l("Navigation started (yt-navigate-start event fired)"),ar(),a()&&r&&s&&(l("Locking UI and showing loading state for navigation"),oi(!0))}),co=i=>{if(!i.repeat&&!i.ctrlKey&&!i.altKey&&!i.metaKey&&!i.shiftKey&&(i.key==="z"||i.key==="Z")){if(lu(i.target))return;ba()&&(i.preventDefault(),l("Playback speed toggled via keyboard shortcut (Z)"));return}i.ctrlKey&&i.altKey&&i.shiftKey&&(i.key==="T"||i.key==="t")&&(i.preventDefault(),si(),l("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",co),window.addEventListener("pagehide",ar),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&ar()}),window.addEventListener("yt-navigate-finish",()=>{l("Navigation finished (yt-navigate-finish event fired)"),window.location.href!==q?li():l("Navigation finished but URL already handled, skipping.")});function _u(i){let c=/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(i);if(c&&(c[1]||c[2]||c[3]))return Number(c[1]||0)*3600+Number(c[2]||0)*60+Number(c[3]||0);let d=Number(i);return Number.isFinite(d)?d:null}document.addEventListener("click",i=>{if(i.button!==0||i.ctrlKey||i.metaKey||i.shiftKey||i.altKey)return;let c=i.target?.closest?.("ytd-comments a[href]");if(!c)return;let d=new URL(c.href,location.href),w=d.searchParams.get("t");if(d.pathname!=="/watch"||!w||d.searchParams.get("v")!==cr())return;let x=_u(w),A=J();x===null||!A||(i.preventDefault(),i.stopImmediatePropagation(),A.seekTo(x))},!0),Vc(i=>{for(let c of i)kn({type:"timestamps_updated",videoId:c,action:"synced"});Be&&i.includes(Be)&&lr()}),su(),Wa(),l("Timekeeper initialized and waiting for navigation events")})();})();

