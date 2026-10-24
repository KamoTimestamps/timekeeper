// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      5.1.0
// @description  Enhanced timestamp tool for YouTube videos with DVR/rewind enablement for live streams
// @author       Silent Shout
// @match        https://www.youtube.com/*
// @run-at       document-start
// @noframes
// @icon         https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_64px_Indexed.png
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.setClipboard
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @connect      *
// @homepageURL  https://github.com/KamoTimestamps/timekeeper
// @supportURL   https://github.com/KamoTimestamps/timekeeper/issues
// @downloadURL  https://raw.githubusercontent.com/KamoTimestamps/timekeeper/main/timekeeper.user.js
// @updateURL    https://raw.githubusercontent.com/KamoTimestamps/timekeeper/main/timekeeper.user.js
// @license MIT
// ==/UserScript==

(()=>{var Ql=Object.defineProperty;var Xl=(e,t)=>{for(var n in t)Ql(e,n,{get:t[n],enumerable:!0})};var to=class extends Error{},We=(e,t)=>{throw new to(`${e||"value"}: expected ${t}`)};function kt(e){let t={run:e,parse:n=>e(n,""),safeParse:n=>{try{return{success:!0,data:e(n,"")}}catch(i){if(i instanceof to)return{success:!1,error:i};throw i}},array:()=>Jl(t)};return t}var na=e=>typeof e=="object"&&e!==null&&!Array.isArray(e);function He(){return kt((e,t)=>typeof e=="string"?e:We(t,"string"))}function Yo(){return kt((e,t)=>typeof e=="boolean"?e:We(t,"boolean"))}function wt(e={}){return kt((t,n)=>typeof t!="number"||Number.isNaN(t)?We(n,"number"):(e.finite&&!Number.isFinite(t)&&We(n,"finite number"),e.int&&!Number.isInteger(t)&&We(n,"integer"),e.nonnegative&&t<0&&We(n,"number >= 0"),e.positive&&t<=0&&We(n,"number > 0"),e.min!==void 0&&t<e.min&&We(n,`number >= ${e.min}`),e.max!==void 0&&t>e.max&&We(n,`number <= ${e.max}`),t))}function je(e){return kt((t,n)=>t===void 0?void 0:e.run(t,n))}function Ko(e){return kt((t,n)=>t===null?null:e.run(t,n))}function Cn(e,t){return kt((n,i)=>{try{return e.run(n,i)}catch(a){if(a instanceof to)return t;throw a}})}function Jl(e){return kt((t,n)=>Array.isArray(t)?t.map((i,a)=>e.run(i,`${n}[${a}]`)):We(n,"array"))}function Zl(e){return kt((t,n)=>{if(!na(t))return We(n,"object");let i={};for(let a of Object.keys(t))i[a]=e.run(t[a],n?`${n}.${a}`:a);return i})}function xt(e){let t=kt((n,i)=>{if(!na(n))return We(i,"object");let a={};for(let o of Object.keys(e)){let u=e[o].run(n[o],i?`${i}.${o}`:o);u!==void 0&&(a[o]=u)}return a});return Object.assign(t,{extend:n=>xt({...e,...n}),partial:()=>{let n={};for(let i of Object.keys(e))n[i]=je(e[i]);return xt(n)}})}var ec=kt((e,t)=>typeof e=="string"&&e.length>0?e:We(t,"non-empty string")),Qo=xt({guid:ec,start:wt({finite:!0,nonnegative:!0}),comment:He(),write_counter:je(wt({int:!0,positive:!0})),deleted_at:Cn(je(wt()),void 0)}),no=Qo.array(),Ci=Qo.extend({video_id:He(),device_id:je(He())}),oa=xt({x:wt({finite:!0}),y:wt({finite:!0}),width:je(wt({finite:!0,positive:!0})),height:je(wt({finite:!0,positive:!0}))}),Xo=xt({video_id:He(),timestamps:no}),ia=Zl(Xo),ta=xt({isSignedIn:Cn(Yo(),!1),accessToken:Cn(Ko(He()),null),userName:Cn(Ko(He()),null),email:Cn(Ko(He()),null)}),Di=Cn(kt((e,t)=>{if(typeof e=="string"){let n;try{n=JSON.parse(e)}catch{return We(t,"valid JSON string for auth state")}return ta.run(n,t)}return ta.run(e,t)}),{isSignedIn:!1,accessToken:null,userName:null,email:null}),tc=xt({autoBackupEnabled:Yo(),autoBackupIntervalMinutes:wt({int:!0,min:5,max:1440}),lastAutoBackupAt:je(Ko(wt({int:!0,positive:!0})))}),Ri=tc;var ra=`<svg
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
</svg>`;var aa=`<svg
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
</svg>`;var sa=`<svg
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
</svg>`;var la=`<svg
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
</svg>`;var ca=`<svg
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
</svg>`;var ua=`<svg
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
</svg>`;var da=`<svg
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
</svg>`;var pa=`<svg
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
</svg>`;var ma=`<svg
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
</svg>`;var fa=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="currentColor"
  class="icon icon-tabler icons-tabler-filled icon-tabler-current-location"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 1a1 1 0 0 1 1 1v1.055a9.004 9.004 0 0 1 7.946 7.945h1.054a1 1 0 0 1 0 2h-1.055a9.004 9.004 0 0 1 -7.944 7.945l-.001 1.055a1 1 0 0 1 -2 0v-1.055a9.004 9.004 0 0 1 -7.945 -7.944l-1.055 -.001a1 1 0 0 1 0 -2h1.055a9.004 9.004 0 0 1 7.945 -7.945v-1.055a1 1 0 0 1 1 -1m0 4a7 7 0 1 0 0 14a7 7 0 0 0 0 -14m0 3a4 4 0 1 1 -4 4l.005 -.2a4 4 0 0 1 3.995 -3.8" />
</svg>`;var ha=`<svg
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
</svg>`;var ga=`<svg
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
</svg>`;var va=`<svg
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
</svg>`;var ya=`<svg
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
</svg>`;var ba=`<svg
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
</svg>`;var wa=`<svg
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
</svg>`;var xa=`<svg
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
</svg>`;var ka=`<svg
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
</svg>`;var Ta=`<svg
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
</svg>`;var Sa=`<svg
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
</svg>`;var Aa=`<svg
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
</svg>`;var Ea=`<svg
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
</svg>`;var Ma=`<svg
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
</svg>`;var La=`<svg
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
</svg>`;var Ia=`<svg
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
</svg>`;var Ba=`<svg
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
</svg>`;var Ca=`<svg
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
</svg>`;var Da=`<svg
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
</svg>`;var Ra=`<svg
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
</svg>`;var Pa=`<svg
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
</svg>`;var za=`<svg
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
</svg>`;var Ha=`<svg
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
</svg>`;var Pc={plus:ra,"alarm-plus":aa,minus:sa,"circle-plus":la,"circle-minus":ca,trash:ua,clipboard:da,settings:pa,"clock-plus":ma,"current-location":fa,"player-record":ha,"circle-x":ga,"circle-check":va,"adjustments-horizontal":ya,cloud:ba,"device-floppy":wa,"folder-open":xa,"file-export":ka,"file-import":Ta,"file-spreadsheet":Sa,login:Aa,logout:Ea,refresh:Ma,"alert-triangle":La,database:Ia,server:Ba,world:Ca,"plug-connected":Da,key:Ra,x:Pa,"indent-increase":za,"indent-decrease":Ha},Oa="http://www.w3.org/2000/svg",zc=/^\s*<svg\s+([^>]*)>([\s\S]*?)<\/svg>\s*$/,Hc=/<([a-zA-Z][\w:-]*)([^>]*)\/>/g,Oc=/([a-zA-Z_:][\w:.-]*)="([^"]*)"/g,Fa=new Map;function Na(e){let t={};for(let n of e.matchAll(Oc))t[n[1]]=n[2];return t}function Fc(e){return e.startsWith("data:image/svg+xml;base64,")?atob(e.slice(26)):e.startsWith("data:image/svg+xml,")?decodeURIComponent(e.slice(19)):e}function Nc(e){let t=Fc(e).match(zc);if(!t)throw new Error("Invalid Tabler SVG source");let[,n,i]=t,a=document.createElementNS(Oa,"svg"),o=Na(n);for(let[u,s]of Object.entries(o))u!=="class"&&a.setAttribute(u,s);for(let u of i.matchAll(Hc)){let[,s,v]=u,f=document.createElementNS(Oa,s),p=Na(v);for(let[g,y]of Object.entries(p))f.setAttribute(g,y);a.appendChild(f)}return a}function Gc(e){let t=Fa.get(e);if(t)return t;let n=Nc(Pc[e]);return Fa.set(e,n),n}function oo(e,t=20){let n=Gc(e).cloneNode(!0);return n.setAttribute("width",String(t)),n.setAttribute("height",String(t)),n.setAttribute("aria-hidden","true"),n.style.pointerEvents="none",n.style.flexShrink="0",n.style.verticalAlign="middle",n}function Oe(e,t,n){e.replaceChildren(oo(t,n))}function ie(e,t,n,i){e.replaceChildren(oo(t,i),document.createTextNode("\xA0"+n))}var Jo="5.1.0";function l(e,...t){let n="debug",i=[...t];t.length>0&&typeof t[t.length-1]=="string"&&["debug","info","warn","error"].includes(t[t.length-1])&&(n=i.pop());let a=`[Timekeeper v${Jo}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[n](`${a} ${e}`,...i)}function Vt(e,t=e){let n=Math.floor(e/3600),i=Math.floor(e%3600/60),a=String(e%60).padStart(2,"0");return t<3600?`${t>=600?String(i).padStart(2,"0"):i}:${a}`:`${t>=36e3?String(n).padStart(2,"0"):n}:${String(i).padStart(2,"0")}:${a}`}function Ga(e,t=window.location.href){try{let n=new URL(t);return n.searchParams.set("t",`${e}s`),n.toString()}catch{return`https://www.youtube.com/watch?v=${t.search(/[?&]v=/)>=0?t.split(/[?&]v=/)[1].split(/&/)[0]:t.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${e}s`}}function hn(){let e=new Date;return e.getUTCFullYear()+"-"+String(e.getUTCMonth()+1).padStart(2,"0")+"-"+String(e.getUTCDate()).padStart(2,"0")+"--"+String(e.getUTCHours()).padStart(2,"0")+"-"+String(e.getUTCMinutes()).padStart(2,"0")+"-"+String(e.getUTCSeconds()).padStart(2,"0")}var Ua=`#ytls-pane {
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
`;var Zo="data:image/png;base64,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",Va="data:image/png;base64,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";var Ke=null,Dn=null,Uc=250,Ct=null,Rn=!1,Ye=null,io=[];function Vc(){return(!Ke||!document.body.contains(Ke))&&(Ke=document.createElement("div"),Ke.className="ytls-tooltip",Ke.style.pointerEvents="none",document.body.appendChild(Ke),window.addEventListener("scroll",ja,!0),window.addEventListener("resize",ja,!0)),Ke}function jc(e,t,n){let a=window.innerWidth,o=window.innerHeight,u=e.getBoundingClientRect(),s=u.width,v=u.height,f=t+10,p=n+10;f+s>a-10&&(f=t-s-10),p+v>o-10&&(p=n-v-10),f=Math.max(10,Math.min(f,a-s-10)),p=Math.max(10,Math.min(p,o-v-10)),e.style.left=`${f}px`,e.style.top=`${p}px`}function _a(e,t){let i=window.innerWidth,a=window.innerHeight,o=t.getBoundingClientRect(),u=e.getBoundingClientRect(),s=u.width,v=u.height,f=Math.round(o.left+o.width/2-s/2),p=Math.round(o.top-v-8);p<8&&(p=Math.round(o.bottom+8)),f<8&&(f=Math.round(o.left)),f+s>i-8&&(f=Math.round(o.right-s)),f=Math.max(8,Math.min(f,i-s-8)),p=Math.max(8,Math.min(p,a-v-8)),e.style.left=`${f}px`,e.style.top=`${p}px`}function ja(){if(!(!Ke||!Ct)&&Ke.classList.contains("ytls-tooltip-visible"))try{_a(Ke,Ct)}catch{}}function _c(e=50){Ye&&(clearTimeout(Ye),Ye=null),!Rn&&(Ye=setTimeout(()=>{ro(),Ye=null},e))}function $c(e,t,n,i){Ye&&(clearTimeout(Ye),Ye=null),Ct&&i&&Ct!==i&&Ke?.classList.contains("ytls-tooltip-visible")&&Ke.classList.remove("ytls-tooltip-visible"),Dn&&clearTimeout(Dn),i&&(Ct=i,Rn=!0),Dn=setTimeout(()=>{let a=Vc();a.textContent=e,a.classList.remove("ytls-tooltip-visible"),i?requestAnimationFrame(()=>{_a(a,i),requestAnimationFrame(()=>{a.classList.add("ytls-tooltip-visible")})}):(jc(a,t,n),requestAnimationFrame(()=>{a.classList.add("ytls-tooltip-visible")}))},Uc)}function ro(){Dn&&(clearTimeout(Dn),Dn=null),Ye&&(clearTimeout(Ye),Ye=null),Ke&&Ke.classList.remove("ytls-tooltip-visible"),Ct=null,Rn=!1}function Pi(){ro()}function Qe(e,t){let n=0,i=0,a=f=>{n=f.clientX,i=f.clientY,Ye&&(clearTimeout(Ye),Ye=null),Rn=!0,Ct=e;let p=typeof t=="function"?t():t;p&&$c(p,n,i,e)},o=f=>{n=f.clientX,i=f.clientY},u=()=>{Ct===e&&(Rn=!1,_c())};e.addEventListener("mouseenter",a),e.addEventListener("mousemove",o),e.addEventListener("mouseleave",u);let s=f=>{Rn=!1,Ct===e&&ro()};e.addEventListener("click",s,!0);let v=new MutationObserver(()=>{if(Ct===e)try{let f=window.getComputedStyle(e);(f.display==="none"||f.visibility==="hidden"||f.opacity==="0")&&ro()}catch{}});try{v.observe(e,{attributes:!0,attributeFilter:["class","style"]})}catch{}io.push(v),e.__tooltipCleanup=()=>{e.removeEventListener("mouseenter",a),e.removeEventListener("mousemove",o),e.removeEventListener("mouseleave",u),e.removeEventListener("click",s,!0);try{v.disconnect()}catch{}let f=io.indexOf(v);f!==-1&&io.splice(f,1),delete e.__tooltipObserver},e.__tooltipObserver=v}function $a(){for(let e of io)try{e.disconnect()}catch{}io.length=0,ro()}var Ui={};Xl(Ui,{addTimestamp:()=>Xc,buildExportCsvPayload:()=>au,buildExportPayload:()=>iu,deleteSingleTimestampFromIndexedDB:()=>nu,exportAllTimestamps:()=>ru,exportAllTimestampsCsv:()=>su,loadFromIndexedDB:()=>tu,loadGlobalSettings:()=>ni,mergeBackupData:()=>lu,removeFromIndexedDB:()=>ou,saveGlobalSettings:()=>ti,saveRowsToIndexedDB:()=>Jc,saveSingleTimestampToIndexedDB:()=>eu,saveToIndexedDB:()=>Zc});var qc="ytls-timestamps-db",Wc=4,Pn="timestamps",on="timestamps_v2",nn="settings",tn=null,zn=null;function zi(){if(tn)try{return tn.objectStoreNames,Promise.resolve(tn)}catch(e){l("IndexedDB connection is no longer usable:",e,"warn"),tn=null}return zn||(zn=Kc().then(e=>(tn=e,zn=null,e.onclose=()=>{l("IndexedDB connection closed unexpectedly","warn"),tn=null},e.onversionchange=()=>{l("IndexedDB upgrade requested by another tab; closing this connection",null,"warn"),e.close(),tn===e&&(tn=null)},e.onerror=t=>{l("IndexedDB connection error:",t,"error")},e)).catch(e=>{throw zn=null,e}),zn)}function qa(e,t){let n=crypto.randomUUID(),i=0,a=e.openCursor();a.onsuccess=o=>{let u=o.target.result;u?(i++,u.update({...u.value,write_counter:i,device_id:n}),u.continue()):(t.put({key:"write_counter",value:i}),t.put({key:"device_id",value:n}),l(`Lamport migration: backfilled ${i} records, device_id=${n}`))},a.onerror=()=>{l("Lamport migration: cursor error during backfill",a.error,"error")}}function Kc(){return new Promise((e,t)=>{let n=indexedDB.open(qc,Wc);n.onupgradeneeded=i=>{let a=i.target.result,o=i.oldVersion,u=i.target.transaction;if(o<1&&a.createObjectStore(Pn,{keyPath:"video_id"}),o<2&&!a.objectStoreNames.contains(nn)&&a.createObjectStore(nn,{keyPath:"key"}),o<3){if(a.objectStoreNames.contains(Pn)){l("Exporting backup before v2 migration...");let f=u.objectStore(Pn).getAll();f.onsuccess=()=>{let p=Xo.array().safeParse(f.result);if(p.success&&p.data.length>0)try{let g={},y=0;p.data.forEach($=>{if($.timestamps.length>0){let W=no.parse($.timestamps);g[`ytls-${$.video_id}`]={video_id:$.video_id,timestamps:[...W].sort((ne,N)=>ne.start-N.start)},y+=W.length}});let E=new Blob([JSON.stringify(g,null,2)],{type:"application/json"}),M=URL.createObjectURL(E),z=document.createElement("a");z.href=M,z.download=`timekeeper-data-${hn()}.json`,z.click(),URL.revokeObjectURL(M),l(`Pre-migration backup exported: ${p.data.length} videos, ${y} timestamps`)}catch(g){l("Failed to export pre-migration backup:",g,"error")}else p.success||l("Skipping pre-migration backup: legacy data failed validation",p.error.message,"warn")}}let s=a.createObjectStore(on,{keyPath:"guid"});if(s.createIndex("video_id","video_id",{unique:!1}),s.createIndex("video_start",["video_id","start"],{unique:!1}),a.objectStoreNames.contains(Pn)){let f=u.objectStore(Pn).getAll();f.onsuccess=()=>{let p=Xo.array().safeParse(f.result);if(p.success&&p.data.length>0){let g=0;p.data.forEach(y=>{y.timestamps.length>0&&y.timestamps.forEach(E=>{s.put({guid:E.guid,video_id:y.video_id,start:E.start,comment:E.comment}),g++})}),l(`Migrated ${g} timestamps from ${p.data.length} videos to v2 store`)}else p.success||l("Skipping v1 \u2192 v2 migration: legacy data failed validation",p.error.message,"warn");o<4&&qa(u.objectStore(on),u.objectStore(nn))},a.deleteObjectStore(Pn),l("Deleted old timestamps store after migration to v2")}}o===3&&qa(u.objectStore(on),u.objectStore(nn))},n.onsuccess=i=>{e(i.target.result)},n.onerror=i=>{let a=i.target.error;t(a??new Error("Failed to open IndexedDB"))},n.onblocked=()=>{l("IndexedDB open is blocked by another tab holding an older connection; waiting",null,"warn")}})}function Hi(e,t,n){return zi().then(i=>new Promise((a,o)=>{let u;try{u=i.transaction(e,t)}catch(f){o(new Error(`Failed to create transaction for ${e}: ${f}`));return}let s=u.objectStore(e),v;try{v=n(s)}catch(f){o(new Error(`Failed to execute operation on ${e}: ${f}`));return}v&&(v.onsuccess=()=>a(v.result),v.onerror=()=>o(v.error??new Error(`IndexedDB ${t} operation failed`))),u.oncomplete=()=>{v||a(void 0)},u.onerror=()=>o(u.error??new Error("IndexedDB transaction failed")),u.onabort=()=>o(u.error??new Error("IndexedDB transaction aborted"))}))}function ao(e){return zi().then(t=>new Promise((n,i)=>{let a;try{a=t.transaction([on,nn],"readwrite")}catch(o){i(new Error(`Failed to create transaction: ${o}`));return}a.oncomplete=()=>n(),a.onerror=()=>i(new Error(`IndexedDB write failed: ${a.error?.message??"unknown"}`)),a.onabort=()=>i(new Error(`IndexedDB transaction aborted: ${a.error?.message??"unknown"}`));try{e(a.objectStore(on),a.objectStore(nn))}catch(o){try{a.abort()}catch{}i(o instanceof Error?o:new Error(String(o)))}}))}function so(e,t){let n=e.get("write_counter");n.onsuccess=()=>{let i=typeof n.result?.value=="number"?n.result.value:0;e.put({key:"write_counter",value:t(i)})}}function Wa(e,t){let n=no.safeParse(t);if(!n.success)return Promise.reject(new Error(`Invalid timestamp payload for ${e}`));let i=n.data;return ao((a,o)=>{let u=a.index("video_id").getAll(IDBKeyRange.only(e));u.onsuccess=()=>{let s=u.result??[],v=new Map(s.map(g=>[g.guid,g])),f=new Set(i.map(g=>g.guid)),p=Date.now();so(o,g=>{let y=g;return s.forEach(E=>{!f.has(E.guid)&&!E.deleted_at&&(y++,a.put({...E,deleted_at:p,write_counter:y}))}),i.forEach(E=>{let M=v.get(E.guid);M&&!M.deleted_at&&!E.deleted_at&&M.start===E.start&&M.comment===E.comment||(y++,a.put({guid:E.guid,video_id:e,start:E.start,comment:E.comment,write_counter:y,deleted_at:E.deleted_at??M?.deleted_at??void 0}))}),y})}})}function Oi(e,t){let n=no.safeParse(t);if(!n.success)return Promise.reject(new Error(`Invalid timestamp payload for ${e}`));let i=n.data;return i.length===0?Promise.resolve():ao((a,o)=>{so(o,u=>{let s=u;return i.forEach(v=>{s++,a.put({guid:v.guid,video_id:e,start:v.start,comment:v.comment,write_counter:s,deleted_at:v.deleted_at})}),s})})}function Ka(e,t){return Oi(e,[t])}function Ya(e){return e.length===0?Promise.resolve():ao((t,n)=>{so(n,i=>{let a=i;return e.forEach(o=>{o.write_counter!==void 0&&o.write_counter>a&&(a=o.write_counter)}),e.forEach(o=>{let u={guid:o.guid,video_id:o.video_id,start:o.start,comment:o.comment,deleted_at:o.deleted_at,write_counter:o.write_counter??++a};t.put(u)}),a+1})})}function Qa(e){return l(`Soft-deleting timestamp ${e}`),ao((t,n)=>{let i=t.get(e);i.onsuccess=()=>{let a=i.result;a&&so(n,o=>(t.put({...a,deleted_at:Date.now(),write_counter:o+1}),o+1))}})}function Xa(e){return zi().then(t=>new Promise((n,i)=>{let a;try{a=t.transaction([on],"readonly")}catch(u){let s=`Failed to create read transaction: ${u}`;l(s,u,"error"),i(new Error(s));return}a.onabort=()=>{let u=`Transaction aborted during load: ${a.error?.message??"unknown"}`;l(u,a.error,"error"),i(new Error(u))};let o=a.objectStore(on).index("video_id").getAll(IDBKeyRange.only(e));o.onsuccess=()=>{try{let u=o.result.filter(f=>!f.deleted_at),s=[],v=0;for(let f of u){let p=Qo.safeParse({guid:f.guid,start:f.start,comment:f.comment});p.success?s.push(p.data):v++}if(v>0&&l(`Skipped ${v} stored timestamps for ${e} that failed validation`,null,"warn"),s.length===0){v>0?i(new Error(`Stored timestamps for this video failed validation (${v} rows)`)):n(null);return}n(s.sort((f,p)=>f.start-p.start))}catch(u){i(u)}},o.onerror=()=>{let u=`Failed to load timestamps from IndexedDB: ${o.error?.message??"unknown error"}`;l(u,o.error,"error"),i(new Error(u))}}))}function Ja(e){return ao((t,n)=>{let i=t.index("video_id").getAll(IDBKeyRange.only(e));i.onsuccess=()=>{let a=i.result??[],o=Date.now();so(n,u=>{let s=u;return a.forEach(v=>{v.deleted_at||(s++,t.put({...v,deleted_at:o,write_counter:s}))}),s})}})}function ei(){return Hi(on,"readonly",e=>e.getAll()).then(e=>Array.isArray(e)?e:[])}function Za(e,t){return Hi(nn,"readwrite",n=>{n.put({key:e,value:t})}).then(()=>{}).catch(n=>{l(`Failed to save setting '${e}' to IndexedDB:`,n,"error")})}function es(e){return Hi(nn,"readonly",t=>t.get(e)).then(t=>t?.value).catch(t=>{l(`Failed to load setting '${e}' from IndexedDB:`,t,"error")})}async function Fi({includeDeleted:e=!1}={}){let t={},n=await ei(),i=[],a=0;for(let g of n){let y=Ci.safeParse(g);y.success?i.push(y.data):a++}a>0&&l(`Skipped ${a} timestamp rows that failed validation during export`,null,"warn");let u=[...e?i:i.filter(g=>!g.deleted_at)].sort((g,y)=>{let E=g.video_id.localeCompare(y.video_id);if(E!==0)return E;let M=g.start-y.start;return M!==0?M:g.guid.localeCompare(y.guid)}),s=new Map;for(let g of u)s.has(g.video_id)||s.set(g.video_id,[]),s.get(g.video_id).push({guid:g.guid,start:g.start,comment:g.comment,write_counter:g.write_counter,deleted_at:g.deleted_at});let v=Array.from(s.keys()).sort((g,y)=>g.localeCompare(y));for(let g of v){let y=s.get(g);t[`ytls-${g}`]={video_id:g,timestamps:y}}return{json:JSON.stringify(t,null,2),filename:"timekeeper-data.json",totalVideos:s.size,totalTimestamps:u.length,invalidRows:a}}async function ts(){try{let{json:e,filename:t,totalVideos:n,totalTimestamps:i}=await Fi(),a=new Blob([e],{type:"application/json"}),o=URL.createObjectURL(a),u=document.createElement("a");u.href=o,u.download=t,u.click(),URL.revokeObjectURL(o),l(`Exported ${n} videos with ${i} timestamps`)}catch(e){throw l("Failed to export data:",e,"error"),e}}async function Ni(){let e=Ci.array().safeParse((await ei()).filter(p=>!p.deleted_at));if(!e.success||e.data.length===0){e.success||l("Failed to parse timestamp rows for CSV export:",e.error.message,"warn");let p=`Tag,Timestamp,URL
`,g=`timestamps-${hn()}.csv`;return{csv:p,filename:g,totalVideos:0,totalTimestamps:0}}let t=e.data,n=new Map;for(let p of t)n.has(p.video_id)||n.set(p.video_id,[]),n.get(p.video_id).push({start:p.start,comment:p.comment});let i=[];i.push("Tag,Timestamp,URL");let a=0,o=p=>`"${String(p).replace(/"/g,'""')}"`,u=p=>{let g=Math.floor(p/3600),y=Math.floor(p%3600/60),E=String(p%60).padStart(2,"0");return`${String(g).padStart(2,"0")}:${String(y).padStart(2,"0")}:${E}`},s=Array.from(n.keys()).sort();for(let p of s){let g=n.get(p).sort((y,E)=>y.start-E.start);for(let y of g){let E=y.comment,M=u(y.start),z=Ga(y.start,`https://www.youtube.com/watch?v=${p}`);i.push([o(E),o(M),o(z)].join(",")),a++}}let v=i.join(`
`),f=`timestamps-${hn()}.csv`;return{csv:v,filename:f,totalVideos:n.size,totalTimestamps:a}}async function ns(){try{let{csv:e,filename:t,totalVideos:n,totalTimestamps:i}=await Ni(),a=new Blob([e],{type:"text/csv;charset=utf-8;"}),o=URL.createObjectURL(a),u=document.createElement("a");u.href=o,u.download=t,u.click(),URL.revokeObjectURL(o),l(`Exported ${n} videos with ${i} timestamps (CSV)`)}catch(e){throw l("Failed to export CSV data:",e,"error"),e}}async function Gi(e,t){if(!e)throw new Error("Video ID is required");if(!t.guid||t.start==null)throw new Error("Timestamp must have GUID and start time");return Ka(e,t)}async function os(e,t){if(!e)throw new Error("Video ID is required");return Oi(e,t)}async function is(e,t){if(!e)throw new Error("Video ID is required");if(!Array.isArray(t))throw new Error("Timestamps must be an array");return Wa(e,t)}async function rs(e){if(!e)throw new Error("GUID is required");return Qa(e)}async function as(e){if(!e)throw new Error("Video ID is required");return Ja(e)}async function ss(e){if(!e)throw new Error("Video ID is required");return Xa(e)}async function ls(e){let t;try{t=JSON.parse(e)}catch{return l("mergeBackupData: failed to parse JSON",null,"warn"),{mergedVideos:0,mergedTimestamps:0}}let n=ia.safeParse(t);if(!n.success)return l("mergeBackupData: data failed validation",n.error.message,"warn"),{mergedVideos:0,mergedTimestamps:0};let i=await ei(),a=new Map;for(let v of i)a.set(v.guid,v);let o=0,u=0,s=[];for(let[,v]of Object.entries(n.data)){let{video_id:f,timestamps:p}=v,g=0;for(let y of p){let E=a.get(y.guid),M=!1;E?E.write_counter!==void 0&&y.write_counter!==void 0&&y.write_counter>E.write_counter&&(M=!0):M=!0,M&&(s.push({guid:y.guid,video_id:f,start:y.start,comment:y.comment,write_counter:y.write_counter,deleted_at:y.deleted_at}),a.set(y.guid,{...E??{},guid:y.guid,video_id:f,start:y.start,comment:y.comment,write_counter:y.write_counter,deleted_at:y.deleted_at}),g++,u++)}g>0&&o++}return await Ya(s),{mergedVideos:o,mergedTimestamps:u}}function cs(e,t){if(!e)throw new Error("Setting key is required");return Za(e,t)}async function us(e){if(!e)throw new Error("Setting key is required");return es(e)}function Xc(e,t){return Gi(e,t)}function Jc(e,t){return os(e,t)}function Zc(e,t){return is(e,t)}function eu(e,t){return Gi(e,t)}function tu(e){return ss(e)}function nu(e,t){return rs(t)}function ou(e){return as(e)}function ti(e,t){cs(e,t)}function ni(e){return us(e)}function iu(e){return Fi(e)}function ru(){return ts()}function au(){return Ni()}function su(){return ns()}function lu(e){return ls(e)}function oi(e){return e?Array.from(e.querySelectorAll("li:not(.ytls-placeholder):not(.ytls-error-message)")):[]}function ii(e){if(!e)return;e.replaceChildren();let t=e.querySelector(".ytls-error-message");t&&t.remove()}function Vi(e,t){if(!e)return;ii(e);let n=document.createElement("li");n.className="ytls-placeholder",n.textContent=t,e.appendChild(n),e.style.overflowY="hidden"}function ds(e){if(!e)return;let t=e.querySelector(".ytls-placeholder");t&&t.remove(),e.style.overflowY=""}function lo(e){return e?e.querySelector(".ytls-error-message")!==null:!1}function ps(e,t){if(!e)return;ii(e);let n=document.createElement("li");n.className="ytls-error-message",n.style.cssText=`
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
  `,n.innerHTML=`<div style="margin-bottom:8px">\u26A0\uFE0F ${cu(t)}</div><div style="font-size:12px;font-weight:normal;color:#aaa">Check the console for details or refresh the page.</div>`,e.appendChild(n),e.style.overflowY="hidden"}function ms(e){if(!e)return;let t=e.querySelector(".ytls-error-message");t&&t.remove()}function cu(e){let t=document.createElement("div");return t.textContent=e,t.innerHTML}function fs(e,t){if(!e||t||lo(e))return;Array.from(e.children).some(i=>!i.classList.contains("ytls-placeholder")&&!i.classList.contains("ytls-error-message"))||Vi(e,"No timestamps for this video")}function hs(e){if(!e)return[];let t=oi(e),n=[];return t.forEach(i=>{let a=i.querySelector("[data-time]"),o=i.querySelector("input"),u=i.dataset.guid;if(!a||!o||!u)return;let s=a.dataset.time;if(!s)return;let v=Number.parseInt(s,10);Number.isFinite(v)&&n.push({guid:u,start:v,comment:o.value})}),n.sort((i,a)=>i.start-a.start)}function gs(e){if(!e)return 0;let t=oi(e),n=0;return t.forEach(i=>{let o=i.querySelector("[data-time]")?.dataset.time;if(o){let u=Number.parseInt(o,10);Number.isFinite(u)&&(n=Math.max(n,u))}}),n}var du={auth:{googleAuthState:{isSignedIn:!1,accessToken:null,userName:null,email:null},autoBackupEnabled:!0,autoBackupIntervalMinutes:30,autoBackupRetryAttempts:0,autoBackupBackoffMs:null,lastAutoBackupAt:null,isAutoBackupRunning:!1},ui:{panePosition:null,currentVideoId:"",minPaneHeight:250,lastHandledUrl:null,urlChangeHandlersSetup:!1},timestamps:{items:[],currentIndex:null,dbError:null}},st=JSON.parse(JSON.stringify(du));function _e(){return st}function ri(e){st={...st,...e,auth:{...st.auth,...e.auth||{}},ui:{...st.ui,...e.ui||{}},timestamps:{...st.timestamps,...e.timestamps||{}}}}function gn(e,t){ri({auth:{...st.auth,[e]:t}})}function ai(e,t){ri({ui:{...st.ui,[e]:t}})}function Dt(){return st.auth.googleAuthState}function Tt(e){gn("googleAuthState",e)}function ji(e){gn("autoBackupEnabled",e)}function _i(e){gn("autoBackupIntervalMinutes",e)}function $i(e){gn("isAutoBackupRunning",e)}function si(e){gn("autoBackupRetryAttempts",e)}function Hn(e){gn("autoBackupBackoffMs",e)}function qi(e){gn("lastAutoBackupAt",e)}function vs(e){ai("minPaneHeight",e)}function ys(e){ai("panePosition",e)}function bs(e){ai("lastHandledUrl",e)}function ws(e){ai("urlChangeHandlersSetup",e)}function xs(e){ri({timestamps:{...st.timestamps,items:e}})}function Wi(e){ri({timestamps:{...st.timestamps,dbError:e}})}function ks(){return st.timestamps.dbError}var vn=typeof unsafeWindow<"u"?unsafeWindow:window,Is=43200*14,Ss="html5_max_live_dvr_window_plus_margin_secs";function jt(e){return e!=null&&typeof e=="object"}function As(e){let{streamingData:t,videoDetails:n,playerConfig:i,microformat:a}=e;if(!(!jt(n)||!n.isLive)){if(n.isLiveDvrEnabled=!0,jt(i)){let o=i.mediaCommonConfig;if(jt(o)){o.useServerDrivenAbr=!1;let u=o.serverPlaybackStartConfig;jt(u)&&(u.enable=!1)}}if(jt(t)){let o=t;if(Array.isArray(o.adaptiveFormats)&&pu(a))for(let u of o.adaptiveFormats)u.maxDvrDurationSec=Is}}}function pu(e){if(!jt(e))return!1;let t=e.playerMicroformatRenderer;if(!jt(t))return!1;let n=t.liveBroadcastDetails;if(!jt(n))return!1;let i=n.startTimestamp;return!i||typeof i!="string"?!1:(Date.now()-new Date(i).getTime())/1e3>43200}function Ki(e){if(!e||typeof e!="object")return!1;let t=e;return t.videoDetails?(As(t),!0):t.playerResponse&&jt(t.playerResponse)&&t.playerResponse.videoDetails?(As(t.playerResponse),!0):!1}function mu(){let e=Object.getOwnPropertyDescriptor(vn,"ytInitialPlayerResponse"),t=e&&e.set,n=vn.ytInitialPlayerResponse;if(!Ki(n))try{Object.defineProperty(vn,"ytInitialPlayerResponse",{configurable:!0,get(){return n},set(i){t&&t.call(this,i),n=i,Ki(i)&&Object.defineProperty(vn,"ytInitialPlayerResponse",{configurable:!0,writable:!0,value:i})}})}catch{}}var Es=!1;function fu(){if(Es)return;Es=!0;let e=JSON.parse;JSON.parse=function(t,n){let i=e.call(this,t,n);try{Ki(i)}catch{}return i}}function Ms(e){if(e.__dvrCapLifted)return;let n=(typeof e.d=="function"?e.d():void 0)?.WEB_PLAYER_CONTEXT_CONFIGS;if(!n)return;let i=n;for(let a in i){let o=i[a];if(o&&typeof o.serializedExperimentFlags=="string"){let u=o.serializedExperimentFlags,s=u.replace(new RegExp(`${Ss}=[\\d.]+`),`${Ss}=${Is}`);s!==u&&(o.serializedExperimentFlags=s)}}e.__dvrCapLifted=!0}function Ls(e){if(!e||e.__dvrHooked)return e;e.__dvrHooked=!0;let t=e.set;typeof t=="function"&&(e.set=function(...n){let i=t.apply(this,n);try{Ms(e)}catch{}return i});try{Ms(e)}catch{}return e}function hu(){let e={};vn.ytcfg&&(e=Ls(vn.ytcfg));try{Object.defineProperty(vn,"ytcfg",{configurable:!0,get(){return e},set(t){e=Ls(t)}})}catch{}}function Bs(){mu(),fu(),hu(),l("[Timekeeper] DVR/Rewind enablement initialized for live streams")}var ge=Uint8Array,tt=Uint16Array,rr=Int32Array,li=new ge([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),ci=new ge([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Zi=new ge([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Os=function(e,t){for(var n=new tt(31),i=0;i<31;++i)n[i]=t+=1<<e[i-1];for(var a=new rr(n[30]),i=1;i<30;++i)for(var o=n[i];o<n[i+1];++o)a[o]=o-n[i]<<5|i;return{b:n,r:a}},Fs=Os(li,2),Ns=Fs.b,er=Fs.r;Ns[28]=258,er[258]=28;var Gs=Os(ci,0),gu=Gs.b,Cs=Gs.r,tr=new tt(32768);for(K=0;K<32768;++K)_t=(K&43690)>>1|(K&21845)<<1,_t=(_t&52428)>>2|(_t&13107)<<2,_t=(_t&61680)>>4|(_t&3855)<<4,tr[K]=((_t&65280)>>8|(_t&255)<<8)>>1;var _t,K,Pt=(function(e,t,n){for(var i=e.length,a=0,o=new tt(t);a<i;++a)e[a]&&++o[e[a]-1];var u=new tt(t);for(a=1;a<t;++a)u[a]=u[a-1]+o[a-1]<<1;var s;if(n){s=new tt(1<<t);var v=15-t;for(a=0;a<i;++a)if(e[a])for(var f=a<<4|e[a],p=t-e[a],g=u[e[a]-1]++<<p,y=g|(1<<p)-1;g<=y;++g)s[tr[g]>>v]=f}else for(s=new tt(i),a=0;a<i;++a)e[a]&&(s[a]=tr[u[e[a]-1]++]>>15-e[a]);return s}),rn=new ge(288);for(K=0;K<144;++K)rn[K]=8;var K;for(K=144;K<256;++K)rn[K]=9;var K;for(K=256;K<280;++K)rn[K]=7;var K;for(K=280;K<288;++K)rn[K]=8;var K,po=new ge(32);for(K=0;K<32;++K)po[K]=5;var K,vu=Pt(rn,9,0),yu=Pt(rn,9,1),bu=Pt(po,5,0),wu=Pt(po,5,1),Yi=function(e){for(var t=e[0],n=1;n<e.length;++n)e[n]>t&&(t=e[n]);return t},St=function(e,t,n){var i=t/8|0;return(e[i]|e[i+1]<<8)>>(t&7)&n},Qi=function(e,t){var n=t/8|0;return(e[n]|e[n+1]<<8|e[n+2]<<16)>>(t&7)},ar=function(e){return(e+7)/8|0},mo=function(e,t,n){return(t==null||t<0)&&(t=0),(n==null||n>e.length)&&(n=e.length),new ge(e.subarray(t,n))};var xu=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],Fe=function(e,t,n){var i=new Error(t||xu[e]);if(i.code=e,Error.captureStackTrace&&Error.captureStackTrace(i,Fe),!n)throw i;return i},ku=function(e,t,n,i){var a=e.length,o=i?i.length:0;if(!a||t.f&&!t.l)return n||new ge(0);var u=!n,s=u||t.i!=2,v=t.i;u&&(n=new ge(a*3));var f=function(qt){var sn=n.length;if(qt>sn){var At=new ge(Math.max(sn*2,qt));At.set(n),n=At}},p=t.f||0,g=t.p||0,y=t.b||0,E=t.l,M=t.d,z=t.m,$=t.n,W=a*8;do{if(!E){p=St(e,g,1);var ne=St(e,g+1,3);if(g+=3,ne)if(ne==1)E=yu,M=wu,z=9,$=5;else if(ne==2){var me=St(e,g,31)+257,J=St(e,g+10,15)+4,V=me+St(e,g+5,31)+1;g+=14;for(var P=new ge(V),ve=new ge(19),ae=0;ae<J;++ae)ve[Zi[ae]]=St(e,g+ae*3,7);g+=J*3;for(var ye=Yi(ve),dt=(1<<ye)-1,Ne=Pt(ve,ye,1),ae=0;ae<V;){var De=Ne[St(e,g,dt)];g+=De&15;var N=De>>4;if(N<16)P[ae++]=N;else{var be=0,le=0;for(N==16?(le=3+St(e,g,3),g+=2,be=P[ae-1]):N==17?(le=3+St(e,g,7),g+=3):N==18&&(le=11+St(e,g,127),g+=7);le--;)P[ae++]=be}}var Te=P.subarray(0,me),ce=P.subarray(me);z=Yi(Te),$=Yi(ce),E=Pt(Te,z,1),M=Pt(ce,$,1)}else Fe(1);else{var N=ar(g)+4,Y=e[N-4]|e[N-3]<<8,se=N+Y;if(se>a){v&&Fe(0);break}s&&f(y+Y),n.set(e.subarray(N,se),y),t.b=y+=Y,t.p=g=se*8,t.f=p;continue}if(g>W){v&&Fe(0);break}}s&&f(y+131072);for(var Me=(1<<z)-1,we=(1<<$)-1,xe=g;;xe=g){var be=E[Qi(e,g)&Me],Ge=be>>4;if(g+=be&15,g>W){v&&Fe(0);break}if(be||Fe(2),Ge<256)n[y++]=Ge;else if(Ge==256){xe=g,E=null;break}else{var Re=Ge-254;if(Ge>264){var ae=Ge-257,ue=li[ae];Re=St(e,g,(1<<ue)-1)+Ns[ae],g+=ue}var nt=M[Qi(e,g)&we],Ht=nt>>4;nt||Fe(3),g+=nt&15;var ce=gu[Ht];if(Ht>3){var ue=ci[Ht];ce+=Qi(e,g)&(1<<ue)-1,g+=ue}if(g>W){v&&Fe(0);break}s&&f(y+131072);var Se=y+Re;if(y<ce){var ot=o-ce,Z=Math.min(ce,Se);for(ot+y<0&&Fe(3);y<Z;++y)n[y]=i[ot+y]}for(;y<Se;++y)n[y]=n[y-ce]}}t.l=E,t.p=xe,t.b=y,t.f=p,E&&(p=1,t.m=z,t.d=M,t.n=$)}while(!p);return y!=n.length&&u?mo(n,0,y):n.subarray(0,y)},$t=function(e,t,n){n<<=t&7;var i=t/8|0;e[i]|=n,e[i+1]|=n>>8},co=function(e,t,n){n<<=t&7;var i=t/8|0;e[i]|=n,e[i+1]|=n>>8,e[i+2]|=n>>16},Xi=function(e,t){for(var n=[],i=0;i<e.length;++i)e[i]&&n.push({s:i,f:e[i]});var a=n.length,o=n.slice();if(!a)return{t:Vs,l:0};if(a==1){var u=new ge(n[0].s+1);return u[n[0].s]=1,{t:u,l:1}}n.sort(function(se,me){return se.f-me.f}),n.push({s:-1,f:25001});var s=n[0],v=n[1],f=0,p=1,g=2;for(n[0]={s:-1,f:s.f+v.f,l:s,r:v};p!=a-1;)s=n[n[f].f<n[g].f?f++:g++],v=n[f!=p&&n[f].f<n[g].f?f++:g++],n[p++]={s:-1,f:s.f+v.f,l:s,r:v};for(var y=o[0].s,i=1;i<a;++i)o[i].s>y&&(y=o[i].s);var E=new tt(y+1),M=nr(n[p-1],E,0);if(M>t){var i=0,z=0,$=M-t,W=1<<$;for(o.sort(function(me,J){return E[J.s]-E[me.s]||me.f-J.f});i<a;++i){var ne=o[i].s;if(E[ne]>t)z+=W-(1<<M-E[ne]),E[ne]=t;else break}for(z>>=$;z>0;){var N=o[i].s;E[N]<t?z-=1<<t-E[N]++-1:++i}for(;i>=0&&z;--i){var Y=o[i].s;E[Y]==t&&(--E[Y],++z)}M=t}return{t:new ge(E),l:M}},nr=function(e,t,n){return e.s==-1?Math.max(nr(e.l,t,n+1),nr(e.r,t,n+1)):t[e.s]=n},Ds=function(e){for(var t=e.length;t&&!e[--t];);for(var n=new tt(++t),i=0,a=e[0],o=1,u=function(v){n[i++]=v},s=1;s<=t;++s)if(e[s]==a&&s!=t)++o;else{if(!a&&o>2){for(;o>138;o-=138)u(32754);o>2&&(u(o>10?o-11<<5|28690:o-3<<5|12305),o=0)}else if(o>3){for(u(a),--o;o>6;o-=6)u(8304);o>2&&(u(o-3<<5|8208),o=0)}for(;o--;)u(a);o=1,a=e[s]}return{c:n.subarray(0,i),n:t}},uo=function(e,t){for(var n=0,i=0;i<t.length;++i)n+=e[i]*t[i];return n},Us=function(e,t,n){var i=n.length,a=ar(t+2);e[a]=i&255,e[a+1]=i>>8,e[a+2]=e[a]^255,e[a+3]=e[a+1]^255;for(var o=0;o<i;++o)e[a+o+4]=n[o];return(a+4+i)*8},Rs=function(e,t,n,i,a,o,u,s,v,f,p){$t(t,p++,n),++a[256];for(var g=Xi(a,15),y=g.t,E=g.l,M=Xi(o,15),z=M.t,$=M.l,W=Ds(y),ne=W.c,N=W.n,Y=Ds(z),se=Y.c,me=Y.n,J=new tt(19),V=0;V<ne.length;++V)++J[ne[V]&31];for(var V=0;V<se.length;++V)++J[se[V]&31];for(var P=Xi(J,7),ve=P.t,ae=P.l,ye=19;ye>4&&!ve[Zi[ye-1]];--ye);var dt=f+5<<3,Ne=uo(a,rn)+uo(o,po)+u,De=uo(a,y)+uo(o,z)+u+14+3*ye+uo(J,ve)+2*J[16]+3*J[17]+7*J[18];if(v>=0&&dt<=Ne&&dt<=De)return Us(t,p,e.subarray(v,v+f));var be,le,Te,ce;if($t(t,p,1+(De<Ne)),p+=2,De<Ne){be=Pt(y,E,0),le=y,Te=Pt(z,$,0),ce=z;var Me=Pt(ve,ae,0);$t(t,p,N-257),$t(t,p+5,me-1),$t(t,p+10,ye-4),p+=14;for(var V=0;V<ye;++V)$t(t,p+3*V,ve[Zi[V]]);p+=3*ye;for(var we=[ne,se],xe=0;xe<2;++xe)for(var Ge=we[xe],V=0;V<Ge.length;++V){var Re=Ge[V]&31;$t(t,p,Me[Re]),p+=ve[Re],Re>15&&($t(t,p,Ge[V]>>5&127),p+=Ge[V]>>12)}}else be=vu,le=rn,Te=bu,ce=po;for(var V=0;V<s;++V){var ue=i[V];if(ue>255){var Re=ue>>18&31;co(t,p,be[Re+257]),p+=le[Re+257],Re>7&&($t(t,p,ue>>23&31),p+=li[Re]);var nt=ue&31;co(t,p,Te[nt]),p+=ce[nt],nt>3&&(co(t,p,ue>>5&8191),p+=ci[nt])}else co(t,p,be[ue]),p+=le[ue]}return co(t,p,be[256]),p+le[256]},Tu=new rr([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),Vs=new ge(0),Su=function(e,t,n,i,a,o){var u=o.z||e.length,s=new ge(i+u+5*(1+Math.ceil(u/7e3))+a),v=s.subarray(i,s.length-a),f=o.l,p=(o.r||0)&7;if(t){p&&(v[0]=o.r>>3);for(var g=Tu[t-1],y=g>>13,E=g&8191,M=(1<<n)-1,z=o.p||new tt(32768),$=o.h||new tt(M+1),W=Math.ceil(n/3),ne=2*W,N=function(Gn){return(e[Gn]^e[Gn+1]<<W^e[Gn+2]<<ne)&M},Y=new rr(25e3),se=new tt(288),me=new tt(32),J=0,V=0,P=o.i||0,ve=0,ae=o.w||0,ye=0;P+2<u;++P){var dt=N(P),Ne=P&32767,De=$[dt];if(z[Ne]=De,$[dt]=Ne,ae<=P){var be=u-P;if((J>7e3||ve>24576)&&(be>423||!f)){p=Rs(e,v,0,Y,se,me,V,ve,ye,P-ye,p),ve=J=V=0,ye=P;for(var le=0;le<286;++le)se[le]=0;for(var le=0;le<30;++le)me[le]=0}var Te=2,ce=0,Me=E,we=Ne-De&32767;if(be>2&&dt==N(P-we))for(var xe=Math.min(y,be)-1,Ge=Math.min(32767,P),Re=Math.min(258,be);we<=Ge&&--Me&&Ne!=De;){if(e[P+Te]==e[P+Te-we]){for(var ue=0;ue<Re&&e[P+ue]==e[P+ue-we];++ue);if(ue>Te){if(Te=ue,ce=we,ue>xe)break;for(var nt=Math.min(we,ue-2),Ht=0,le=0;le<nt;++le){var Se=P-we+le&32767,ot=z[Se],Z=Se-ot&32767;Z>Ht&&(Ht=Z,De=Se)}}}Ne=De,De=z[Ne],we+=Ne-De&32767}if(ce){Y[ve++]=268435456|er[Te]<<18|Cs[ce];var qt=er[Te]&31,sn=Cs[ce]&31;V+=li[qt]+ci[sn],++se[257+qt],++me[sn],ae=P+Te,++J}else Y[ve++]=e[P],++se[e[P]]}}for(P=Math.max(P,ae);P<u;++P)Y[ve++]=e[P],++se[e[P]];p=Rs(e,v,f,Y,se,me,V,ve,ye,P-ye,p),f||(o.r=p&7|v[p/8|0]<<3,p-=7,o.h=$,o.p=z,o.i=P,o.w=ae)}else{for(var P=o.w||0;P<u+f;P+=65535){var At=P+65535;At>=u&&(v[p/8|0]=f,At=u),p=Us(v,p+1,e.subarray(P,At))}o.i=u}return mo(s,0,i+ar(p)+a)},Au=(function(){for(var e=new Int32Array(256),t=0;t<256;++t){for(var n=t,i=9;--i;)n=(n&1&&-306674912)^n>>>1;e[t]=n}return e})(),Eu=function(){var e=-1;return{p:function(t){for(var n=e,i=0;i<t.length;++i)n=Au[n&255^t[i]]^n>>>8;e=n},d:function(){return~e}}};var Mu=function(e,t,n,i,a){if(!a&&(a={l:1},t.dictionary)){var o=t.dictionary.subarray(-32768),u=new ge(o.length+e.length);u.set(o),u.set(e,o.length),e=u,a.w=o.length}return Su(e,t.level==null?6:t.level,t.mem==null?a.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+t.mem,n,i,a)},js=function(e,t){var n={};for(var i in e)n[i]=e[i];for(var i in t)n[i]=t[i];return n};var Rt=function(e,t){return e[t]|e[t+1]<<8},lt=function(e,t){return(e[t]|e[t+1]<<8|e[t+2]<<16|e[t+3]<<24)>>>0},Ji=function(e,t){return lt(e,t)+lt(e,t+4)*4294967296},Ce=function(e,t,n){for(;n;++t)e[t]=n,n>>>=8};function Lu(e,t){return Mu(e,t||{},0,0)}function Iu(e,t){return ku(e,{i:2},t&&t.out,t&&t.dictionary)}var _s=function(e,t,n,i){for(var a in e){var o=e[a],u=t+a,s=i;Array.isArray(o)&&(s=js(i,o[1]),o=o[0]),ArrayBuffer.isView(o)?n[u]=[o,s]:(n[u+="/"]=[new ge(0),s],_s(o,u,n,i))}},Ps=typeof TextEncoder<"u"&&new TextEncoder,or=typeof TextDecoder<"u"&&new TextDecoder,Bu=0;try{or.decode(Vs,{stream:!0}),Bu=1}catch{}var Cu=function(e){for(var t="",n=0;;){var i=e[n++],a=(i>127)+(i>223)+(i>239);if(n+a>e.length)return{s:t,r:mo(e,n-1)};a?a==3?(i=((i&15)<<18|(e[n++]&63)<<12|(e[n++]&63)<<6|e[n++]&63)-65536,t+=String.fromCharCode(55296|i>>10,56320|i&1023)):a&1?t+=String.fromCharCode((i&31)<<6|e[n++]&63):t+=String.fromCharCode((i&15)<<12|(e[n++]&63)<<6|e[n++]&63):t+=String.fromCharCode(i)}};function zs(e,t){if(t){for(var n=new ge(e.length),i=0;i<e.length;++i)n[i]=e.charCodeAt(i);return n}if(Ps)return Ps.encode(e);for(var a=e.length,o=new ge(e.length+(e.length>>1)),u=0,s=function(p){o[u++]=p},i=0;i<a;++i){if(u+5>o.length){var v=new ge(u+8+(a-i<<1));v.set(o),o=v}var f=e.charCodeAt(i);f<128||t?s(f):f<2048?(s(192|f>>6),s(128|f&63)):f>55295&&f<57344?(f=65536+(f&1047552)|e.charCodeAt(++i)&1023,s(240|f>>18),s(128|f>>12&63),s(128|f>>6&63),s(128|f&63)):(s(224|f>>12),s(128|f>>6&63),s(128|f&63))}return mo(o,0,u)}function Du(e,t){if(t){for(var n="",i=0;i<e.length;i+=16384)n+=String.fromCharCode.apply(null,e.subarray(i,i+16384));return n}else{if(or)return or.decode(e);var a=Cu(e),o=a.s,n=a.r;return n.length&&Fe(8),o}}var Ru=function(e,t){return t+30+Rt(e,t+26)+Rt(e,t+28)},Pu=function(e,t,n){var i=Rt(e,t+28),a=Rt(e,t+30),o=Du(e.subarray(t+46,t+46+i),!(Rt(e,t+8)&2048)),u=t+46+i,s=zu(e,u,a,n,lt(e,t+20),lt(e,t+24),lt(e,t+42)),v=s[0],f=s[1],p=s[2];return[Rt(e,t+10),v,f,o,u+a+Rt(e,t+32),p]},zu=function(e,t,n,i,a,o,u){var s=a==4294967295,v=o==4294967295,f=u==4294967295,p=t+n,g=s+v+f;if(i&&g){for(;t+4<p;t+=4+Rt(e,t+2))if(Rt(e,t)==1)return[s?Ji(e,t+4+8*v):a,v?Ji(e,t+4):o,f?Ji(e,t+4+8*(v+s)):u,1];i<2&&Fe(13)}return[a,o,u,0]},ir=function(e){var t=0;if(e)for(var n in e){var i=e[n].length;i>65535&&Fe(9),t+=i+4}return t},Hs=function(e,t,n,i,a,o,u,s){var v=i.length,f=n.extra,p=s&&s.length,g=ir(f);Ce(e,t,u!=null?33639248:67324752),t+=4,u!=null&&(e[t++]=20,e[t++]=n.os),e[t]=20,t+=2,e[t++]=n.flag<<1|(o<0&&8),e[t++]=a&&8,e[t++]=n.compression&255,e[t++]=n.compression>>8;var y=new Date(n.mtime==null?Date.now():n.mtime),E=y.getFullYear()-1980;if((E<0||E>119)&&Fe(10),Ce(e,t,E<<25|y.getMonth()+1<<21|y.getDate()<<16|y.getHours()<<11|y.getMinutes()<<5|y.getSeconds()>>1),t+=4,o!=-1&&(Ce(e,t,n.crc),Ce(e,t+4,o<0?-o-2:o),Ce(e,t+8,n.size)),Ce(e,t+12,v),Ce(e,t+14,g),t+=16,u!=null&&(Ce(e,t,p),Ce(e,t+6,n.attrs),Ce(e,t+10,u),t+=14),e.set(i,t),t+=v,g)for(var M in f){var z=f[M],$=z.length;Ce(e,t,+M),Ce(e,t+2,$),e.set(z,t+4),t+=4+$}return p&&(e.set(s,t),t+=p),t},Hu=function(e,t,n,i,a){Ce(e,t,101010256),Ce(e,t+8,n),Ce(e,t+10,n),Ce(e,t+12,i),Ce(e,t+16,a)};function $s(e,t){t||(t={});var n={},i=[];_s(e,"",n,t);var a=0,o=0;for(var u in n){var s=n[u],v=s[0],f=s[1],p=f.level==0?0:8,g=zs(u),y=g.length,E=f.comment,M=E&&zs(E),z=M&&M.length,$=ir(f.extra);y>65535&&Fe(11);var W=p?Lu(v,f):v,ne=W.length,N=Eu();N.p(v),i.push(js(f,{size:v.length,crc:N.d(),c:W,f:g,m:M,u:y!=u.length||M&&E.length!=z,o:a,compression:p})),a+=30+y+$+ne,o+=76+2*(y+$)+(z||0)+ne}for(var Y=new ge(o+22),se=a,me=o-a,J=0;J<i.length;++J){var g=i[J];Hs(Y,g.o,g,g.f,g.u,g.c.length);var V=30+g.f.length+ir(g.extra);Y.set(g.c,g.o+V),Hs(Y,a,g,g.f,g.u,g.c.length,g.o,g.m),a+=16+V+(g.m?g.m.length:0)}return Hu(Y,a,i.length,me,se),Y}function qs(e,t){for(var n={},i=e.length-22;lt(e,i)!=101010256;--i)(!i||e.length-i>65558)&&Fe(13);var a=Rt(e,i+8);if(!a)return{};var o=lt(e,i+16),u=lt(e,i-20)==117853008;if(u){var s=lt(e,i-12);u=lt(e,s)==101075792,u&&(a=lt(e,s+32),o=lt(e,s+48))}for(var v=t&&t.filter,f=0;f<a;++f){var p=Pu(e,o,u),g=p[0],y=p[1],E=p[2],M=p[3],z=p[4],$=p[5],W=Ru(e,$);o=z,(!v||v({name:M,size:y,originalSize:E,compression:g}))&&(g?g==8?n[M]=Iu(e.subarray(W,W+y),{out:new ge(E)}):Fe(14,"unknown compression type "+g):n[M]=mo(e,W,W+y))}return n}function ct(){return Dt()}var ut={get isSignedIn(){return Dt().isSignedIn},get accessToken(){return Dt().accessToken},get userName(){return Dt().userName},get email(){return Dt().email},set isSignedIn(e){let t=Dt();Tt({...t,isSignedIn:e})},set accessToken(e){let t=Dt();Tt({...t,accessToken:e})},set userName(e){let t=Dt();Tt({...t,userName:e})},set email(e){let t=Dt();Tt({...t,email:e})}};function vo(){return _e().auth.autoBackupEnabled}function zt(){return _e().auth.autoBackupIntervalMinutes}var cr=null,re=null,te=null,bn=null;function Qs(e){cr=e}function Xs(e){re=e}function Js(e){te=e}function Zs(e){bn=e}var Ws=!1;function el(){if(!Ws)try{let e=document.createElement("style");e.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(e),Ws=!0}catch{}}var tl=null,ur=null,fo=null,ho=null,dr=null;function nl(e){tl=e}function ol(e){ur=e}function pr(e){fo=e}function mr(e){ho=e}function il(e){dr=e}var di="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",rl="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",al="https://www.youtube.com/",Ou=new Date(Date.UTC(2e3,0,1,0,0,0)),Fu=30*1e3,Nu=1800*1e3,Ks=5,ui=null,$e=null;async function fr(){try{let e=await ho("googleAuthState"),t=e&&typeof e=="object"?{...e,accessToken:e.accessToken?"[REDACTED]":null}:e;l("Loading Google auth state from IndexedDB:",t);let n=Di.safeParse(e);if(n.success){let i=ct();Tt({...i,...n.data});let a=ct();a.isSignedIn&&a.accessToken&&l(`Reusing stored Google auth token for ${a.userName||a.email||"user"}`),Nn();let o=ct();o.isSignedIn&&o.accessToken&&await an(!0)}else if(e!==void 0){let i=e&&typeof e=="object"?{...e,accessToken:e.accessToken?"[REDACTED]":null}:e;l("Google auth state failed validation:",{stored:i,errors:n.error.message},"warn")}}catch(e){l("Failed to load Google auth state:",e,"error")}}async function yo(){try{let e=ct(),t=Di.safeParse(e);if(!t.success){let n={...e,accessToken:e.accessToken?"[REDACTED]":null};l("Invalid auth state, cannot save",{state:n,errors:t.error.message},"error");return}await fo("googleAuthState",e),e.isSignedIn&&e.accessToken?l(`Saved Google auth state to IndexedDB for ${e.userName||e.email||"user"}`):l("Cleared Google auth state in IndexedDB (signed out)")}catch(e){l("Failed to save Google auth state:",e,"error")}}function Nn(){cr&&(cr.style.display="none")}function Xe(e,t){if(!te)return;if(te.style.fontWeight="bold",e==="authenticating"){el(),te.style.color="#ffa500",te.replaceChildren();let i=document.createElement("span");i.className="tk-auth-spinner";let a=document.createTextNode(` ${t||"Authorizing with Google\u2026"}`);te.appendChild(i),te.appendChild(a);return}if(e==="error"){ie(te,"circle-x",t||"Authorization failed"),te.style.color="#ff4d4f",ke();return}let n=ct();n.isSignedIn?(ie(te,"circle-check","Signed in"),te.style.color="#52c41a",te.removeAttribute("title"),n.userName?(te.onmouseenter=()=>{ie(te,"circle-check",`Signed in as ${n.userName}`)},te.onmouseleave=()=>{ie(te,"circle-check","Signed in")}):(te.onmouseenter=null,te.onmouseleave=null)):(ie(te,"circle-x","Not signed in"),te.style.color="#ff4d4f",te.removeAttribute("title"),te.onmouseenter=null,te.onmouseleave=null),ke()}function Gu(){te&&(el(),te.classList.remove("tk-auth-blink"),te.offsetWidth,te.classList.add("tk-auth-blink"),setTimeout(()=>{te.classList.remove("tk-auth-blink")},1200))}function sl(e,t=300*1e3){return new Promise((n,i)=>{if(!e){l&&l("OAuth monitor: popup is null",null,"error"),i(new Error("Failed to open popup"));return}l&&l("OAuth monitor: starting to monitor popup for token");let a=Date.now(),o="timekeeper_oauth",u=null,s=null,v=null,f=()=>{if(u){try{u.close()}catch{}u=null}s&&(clearInterval(s),s=null),v&&(clearInterval(v),v=null)};try{u=new BroadcastChannel(o),l&&l("OAuth monitor: BroadcastChannel created successfully"),u.onmessage=y=>{let E=y.data?.token?{...y.data,token:"[REDACTED]"}:y.data;l&&l("OAuth monitor: received BroadcastChannel message",E);let M=xt({type:He(),token:je(He()),error:je(He())}).safeParse(y.data);if(!M.success){l&&l("OAuth monitor: invalid message format",M.error,"warn");return}if(M.data.type==="timekeeper_oauth_token"&&M.data.token){l&&l("OAuth monitor: token received via BroadcastChannel"),f();try{e.close()}catch{}n(M.data.token)}else if(M.data.type==="timekeeper_oauth_error"){l&&l("OAuth monitor: error received via BroadcastChannel",M.data.error,"error"),f();try{e.close()}catch{}i(new Error(M.data.error||"OAuth failed"))}}}catch(y){l&&l("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",y)}l&&l("OAuth monitor: setting up IndexedDB polling");let p=Date.now();s=setInterval(async()=>{try{let y=indexedDB.open("ytls-timestamps-db",4);y.onsuccess=()=>{let E=y.result,$=E.transaction("settings","readonly").objectStore("settings").get("oauth_message");$.onsuccess=()=>{let W=$.result;if(W&&W.value){let ne=W.value,N=xt({type:He(),token:je(He()),error:je(He()),timestamp:je(wt())}).safeParse(ne);if(!N.success){l&&l("OAuth monitor: invalid IndexedDB message format",N.error,"warn");return}if(N.data.timestamp&&N.data.timestamp>p){let Y=N.data.token?{...N.data,token:"[REDACTED]"}:N.data;if(l&&l("OAuth monitor: received IndexedDB message",Y),N.data.type==="timekeeper_oauth_token"&&N.data.token){l&&l("OAuth monitor: token received via IndexedDB"),f();try{e.close()}catch{}E.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),n(N.data.token)}else if(N.data.type==="timekeeper_oauth_error"){l&&l("OAuth monitor: error received via IndexedDB",N.data.error,"error"),f();try{e.close()}catch{}E.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),i(new Error(N.data.error||"OAuth failed"))}p=N.data.timestamp||Date.now()}}E.close()}}}catch(y){l&&l("OAuth monitor: IndexedDB polling error",y,"error")}},500),v=setInterval(()=>{if(Date.now()-a>t){l&&l("OAuth monitor: popup timed out after 5 minutes",null,"error"),f();try{e.close()}catch{}i(new Error("OAuth popup timed out"));return}},1e3)})}async function ll(){if(!di){Xe("error","Google Client ID not configured");return}try{l&&l("OAuth signin: starting OAuth flow"),Xe("authenticating","Opening authentication window...");let e=new URL("https://accounts.google.com/o/oauth2/v2/auth");e.searchParams.set("client_id",di),e.searchParams.set("redirect_uri",al),e.searchParams.set("response_type","token"),e.searchParams.set("scope",rl),e.searchParams.set("include_granted_scopes","true"),e.searchParams.set("state","timekeeper_auth"),l&&l("OAuth signin: opening popup");let t=window.open(e.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!t){l&&l("OAuth signin: popup blocked by browser",null,"error"),Xe("error","Popup blocked. Please enable popups for YouTube.");return}l&&l("OAuth signin: popup opened successfully"),Xe("authenticating","Waiting for authentication...");try{let n=await sl(t),i=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${n}`}});if(i.ok){let a=await i.json(),o=xt({name:je(He()),email:je(He())}).safeParse(a);if(!o.success)throw l&&l("Failed to validate user info response",o.error,"error"),new Error("Invalid user info response");let u=o.data;Tt({isSignedIn:!0,accessToken:n,userName:u.name||null,email:u.email||null}),await yo(),Nn(),Xe(),ke(),await an(),l?l(`Successfully authenticated as ${u.name}`):console.log(`[Timekeeper] Successfully authenticated as ${u.name}`)}else throw new Error("Failed to fetch user info")}catch(n){let i=n instanceof Error?n.message:"Authentication failed";l?l("OAuth failed:",n,"error"):console.error("[Timekeeper] OAuth failed:",n),Xe("error",i);return}}catch(e){let t=e instanceof Error?e.message:"Sign in failed";l?l("Failed to sign in to Google:",e,"error"):console.error("[Timekeeper] Failed to sign in to Google:",e),Xe("error",`Failed to sign in: ${t}`)}}async function Uu(){let e=ct(),t=e.email;if(!di||!t)return!1;l("Silent OAuth: attempting silent token refresh for "+t);let n=new URL("https://accounts.google.com/o/oauth2/v2/auth");n.searchParams.set("client_id",di),n.searchParams.set("redirect_uri",al),n.searchParams.set("response_type","token"),n.searchParams.set("scope",rl),n.searchParams.set("include_granted_scopes","true"),n.searchParams.set("state","timekeeper_auth"),n.searchParams.set("prompt","none"),n.searchParams.set("login_hint",t);let i=window.open(n.toString(),"TimekeeperGoogleAuthSilent","width=1,height=1,left=-2000,top=-2000,menubar=no,toolbar=no,location=no");if(!i)return l("Silent OAuth: popup blocked",null,"warn"),!1;try{let a=await sl(i,15e3);return Tt({...e,isSignedIn:!0,accessToken:a}),await yo(),Nn(),Xe(),l("Silent OAuth: token refreshed successfully for "+t),!0}catch(a){l("Silent OAuth: silent refresh failed",a,"warn");try{i.close()}catch{}return!1}}async function cl(){if(!window.opener||window.opener===window)return!1;l&&l("OAuth popup: detected popup window, checking for OAuth response");let e=window.location.hash;if(!e||e.length<=1)return l&&l("OAuth popup: no hash params found"),!1;let t=e.startsWith("#")?e.substring(1):e,n=new URLSearchParams(t),i=n.get("state");if(l&&l("OAuth popup: hash params found, state="+i),i!=="timekeeper_auth")return l&&l("OAuth popup: not our OAuth flow (wrong state)"),!1;let a=n.get("error"),o=n.get("access_token"),u="timekeeper_oauth";if(a){try{let s=new BroadcastChannel(u);s.postMessage({type:"timekeeper_oauth_error",error:n.get("error_description")||a}),s.close(),l&&l("OAuth popup: error broadcast via BroadcastChannel")}catch{let v={type:"timekeeper_oauth_error",error:n.get("error_description")||a,timestamp:Date.now()};l&&l("OAuth popup: writing error to IndexedDB",v);let f=indexedDB.open("ytls-timestamps-db",4);f.onsuccess=()=>{let p=f.result,y=p.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:v});y.onsuccess=()=>{l&&l("OAuth popup: error written to IndexedDB successfully")},y.onerror=()=>{l&&l("OAuth popup: failed to write error to IndexedDB",y.error,"error")},p.close()},f.onerror=()=>{l&&l("OAuth popup: failed to open IndexedDB",f.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(o){l&&l("OAuth popup: access token found, broadcasting to opener");try{let s=new BroadcastChannel(u);s.postMessage({type:"timekeeper_oauth_token",token:o}),s.close(),l&&l("OAuth popup: token broadcast via BroadcastChannel")}catch(s){l&&l("OAuth popup: BroadcastChannel failed, using IndexedDB",s);let v={type:"timekeeper_oauth_token",token:o,timestamp:Date.now()},f={...v,token:"[REDACTED]"};l&&l("OAuth popup: writing token to IndexedDB",f);let p=indexedDB.open("ytls-timestamps-db",4);p.onsuccess=()=>{let g=p.result,E=g.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:v});E.onsuccess=()=>{l&&l("OAuth popup: token written to IndexedDB successfully")},E.onerror=()=>{l&&l("OAuth popup: failed to write token to IndexedDB",E.error,"error")},g.close()},p.onerror=()=>{l&&l("OAuth popup: failed to open IndexedDB",p.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function ul(){Tt({isSignedIn:!1,accessToken:null,userName:null,email:null}),await yo(),await an(),Nn(),Xe(),ke()}async function dl(){let e=ct();if(!e.isSignedIn||!e.accessToken)return!1;try{let t=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${e.accessToken}`}});return t.status===401?(await fl({silent:!0}),!1):t.ok}catch(t){return l("Failed to verify auth state:",t,"error"),!1}}function pi(){let e=ct();return e.isSignedIn&&!!e.accessToken}function Fn(){return pi()}function Vu(){let e=[];return pi()&&e.push("Google Drive"),e}function ju(e){let t=qs(new Uint8Array(e)),n=Object.values(t)[0];return n?new TextDecoder().decode(n):null}async function pl(e){let t={Authorization:`Bearer ${e}`},i=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,a=await fetch(i,{headers:t});if(a.status===401)throw new Error("unauthorized");if(!a.ok)throw new Error("drive search failed");let o=await a.json();if(Array.isArray(o.files)&&o.files.length>0)return o.files[0].id;let u=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...t,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(u.status===401)throw new Error("unauthorized");if(!u.ok)throw new Error("drive folder create failed");return(await u.json()).id}async function ml(e,t,n){let i=`name='${e}' and '${t}' in parents and trashed=false`,a=encodeURIComponent(i),o=encodeURIComponent("modifiedTime desc"),u=await fetch(`https://www.googleapis.com/drive/v3/files?q=${a}&orderBy=${o}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${n}`}});if(u.status===401)throw new Error("unauthorized");if(!u.ok)throw new Error(`drive search failed (${u.status})`);let s=await u.json();return s.files&&s.files.length>0?s.files[0].id:null}async function Ys(e){let t=await pl(e),n=await ml("timekeeper-data.zip",t,e);if(!n)return null;let i=await fetch(`https://www.googleapis.com/drive/v3/files/${n}?alt=media`,{headers:{Authorization:`Bearer ${e}`}});if(i.status===401)throw new Error("unauthorized");if(!i.ok)throw new Error(`drive download failed (${i.status})`);let a=await i.arrayBuffer();try{return ju(a)}catch(o){return l("Remote backup could not be decoded; the next upload will replace it:",o,"warn"),null}}async function _u(){if(!ur)return;let e=ct();if(!e.isSignedIn||!e.accessToken)return;let t;try{t=await Ys(e.accessToken)}catch(a){if(a.message!=="unauthorized")throw a;await fl({silent:!0});let o=ct();if(!o.isSignedIn||!o.accessToken)throw a;t=await Ys(o.accessToken)}if(!t)return;let{mergedVideos:n,mergedTimestamps:i}=await ur(t);i>0&&(l(`Pre-backup merge: added ${i} timestamps from ${n} videos from remote`),dr&&dr())}function $u(e,t){let n=new TextEncoder().encode(e),i=t.replace(/\\/g,"/").replace(/^\/+/,"");return i.endsWith(".json")||(i+=".json"),$s({[i]:[n,{level:6,mtime:Ou,os:0}]})}async function qu(e,t,n,i){let a=e.replace(/\.json$/,".zip"),o=await ml(a,n,i),u=new TextEncoder().encode(t).length,s=$u(t,e),v=s.length;l(`Compressing data: ${u} bytes -> ${v} bytes (${Math.round(100-v/u*100)}% reduction)`);let f="-------314159265358979",p=`\r
--${f}\r
`,g=`\r
--${f}--`,y=o?{name:a,mimeType:"application/zip"}:{name:a,mimeType:"application/zip",parents:[n]},E=8192,M="";for(let Y=0;Y<s.length;Y+=E){let se=s.subarray(Y,Math.min(Y+E,s.length));M+=String.fromCharCode.apply(null,Array.from(se))}let z=btoa(M),$=p+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify(y)+p+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+z+g,W,ne;o?(W=`https://www.googleapis.com/upload/drive/v3/files/${o}?uploadType=multipart&fields=id,name`,ne="PATCH"):(W="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",ne="POST");let N=await fetch(W,{method:ne,headers:{Authorization:`Bearer ${i}`,"Content-Type":`multipart/related; boundary=${f}`},body:$});if(N.status===401)throw new Error("unauthorized");if(!N.ok)throw new Error("drive upload failed")}async function fl(e){l("Auth expired, attempting silent token refresh",null,"warn"),!await Uu()&&(l("Silent OAuth: falling back to sign-out",null,"warn"),Tt({isSignedIn:!1,accessToken:null,userName:null,email:null}),await yo(),await an(),Xe("error","Authorization expired. Please sign in again."),ke())}async function Wu(e){if(!pi())throw e?.silent||Xe("error","Configure a backup destination first"),new Error("no-backup-destination");await _u();let t=await tl({includeDeleted:!0});if(t.totalTimestamps===0){if(t.invalidRows>0)throw new Error(`export-invalid-data: ${t.invalidRows} stored rows failed validation`);return e?.silent||l("Skipping export: no timestamps to back up"),"skipped"}let n=ct();if(!n.accessToken)throw new Error("unauthorized");let i=await pl(n.accessToken);return await qu(t.filename,t.json,i,n.accessToken),l(`Exported backup to Google Drive (${t.filename}) with ${t.totalVideos} videos / ${t.totalTimestamps} timestamps.`),"uploaded"}async function hl(){try{let[e,t,n]=await Promise.all([ho("lastAutoBackupAt"),ho("autoBackupEnabled"),ho("autoBackupIntervalMinutes")]),i=Ri.partial().safeParse({autoBackupEnabled:t,autoBackupIntervalMinutes:n,lastAutoBackupAt:typeof e=="number"&&e>0?e:null});i.success?(typeof i.data.autoBackupEnabled=="boolean"&&ji(i.data.autoBackupEnabled),typeof i.data.autoBackupIntervalMinutes=="number"&&_i(i.data.autoBackupIntervalMinutes),typeof i.data.lastAutoBackupAt=="number"&&qi(i.data.lastAutoBackupAt)):l("Failed to validate auto backup settings:",i.error.message,"warn")}catch(e){l("Failed to load auto backup settings:",e,"error")}}async function hr(){try{let e=_e().auth,t={autoBackupEnabled:e.autoBackupEnabled,autoBackupIntervalMinutes:e.autoBackupIntervalMinutes,lastAutoBackupAt:e.lastAutoBackupAt},n=Ri.safeParse(t);if(!n.success){l("Invalid auto backup settings, cannot save",{settings:t,errors:n.error.message},"error");return}await Promise.all([fo("autoBackupEnabled",e.autoBackupEnabled),fo("autoBackupIntervalMinutes",e.autoBackupIntervalMinutes),fo("lastAutoBackupAt",e.lastAutoBackupAt)])}catch(e){l("Failed to save auto backup settings:",e,"error")}}function Ku(){ui&&(clearInterval(ui),ui=null),$e&&(clearTimeout($e),$e=null)}function yn(e){try{let t=new Date(e),n=new Date,i=t.toDateString()===n.toDateString(),a=t.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return i?a:`${t.toLocaleDateString()} ${a}`}catch{return""}}function sr(){let e=Vu();return e.length>0?`Destinations: ${e.join(", ")}`:"No backup destination configured"}function gl(){let e=_e().auth;return e.autoBackupEnabled?e.isAutoBackupRunning?"#4285f4":e.autoBackupBackoffMs&&e.autoBackupBackoffMs>0?"#ffa500":Fn()&&e.lastAutoBackupAt?"#52c41a":Fn()?"#ffa500":"#ff4d4f":"#ff4d4f"}function ke(){if(gr(),!re)return;let e=_e().auth;if(!e.autoBackupEnabled)ie(re,"refresh","Backup: Off"),re.onmouseenter=null,re.onmouseleave=null;else if(e.isAutoBackupRunning)ie(re,"refresh","Backing up\u2026"),re.onmouseenter=null,re.onmouseleave=null;else if(e.autoBackupBackoffMs&&e.autoBackupBackoffMs>0){let n=Math.ceil(e.autoBackupBackoffMs/6e4);ie(re,"alert-triangle",`Retry in ${n}m`),re.onmouseenter=null,re.onmouseleave=null}else if(!Fn())ie(re,"alert-triangle","Backup target missing"),re.onmouseenter=null,re.onmouseleave=null;else if(e.lastAutoBackupAt){let n=e.lastAutoBackupAt,i=n+Math.max(1,zt())*60*1e3,a=yn(i);re.onmouseenter=()=>{ie(re,"database",`Next backup: ${a}`)},re.onmouseleave=()=>{ie(re,"database",`Last backup: ${yn(n)}`)},ie(re,"database",`Last backup: ${yn(n)}`)}else{let n=Date.now()+Math.max(1,zt())*60*1e3,i=yn(n);re.onmouseenter=()=>{ie(re,"database",`Next backup: ${i}`)},re.onmouseleave=()=>{ie(re,"database","Last backup: never")},ie(re,"database","Last backup: never")}re.style.display="inline";let t=gl();re.style.color=t}var lr="ytls-backup-indicator--pulsing",Yu="#4285f4",On=null;function Qu(e,t){On&&(e.removeEventListener("animationiteration",On),On=null),t===Yu?(e.style.backgroundColor=t,e.classList.add(lr)):e.classList.contains(lr)?(On=()=>{bn&&(bn.classList.remove(lr),bn.style.backgroundColor=t,On=null)},e.addEventListener("animationiteration",On,{once:!0})):e.style.backgroundColor=t}function gr(){if(!bn)return;let e=gl();Qu(bn,e),Qe(bn,()=>{let t=_e().auth,n="";if(!t.autoBackupEnabled)n="Auto backup is disabled";else if(t.isAutoBackupRunning)n="Backup in progress";else if(t.autoBackupBackoffMs&&t.autoBackupBackoffMs>0)n=`Retrying backup in ${Math.ceil(t.autoBackupBackoffMs/6e4)}m`;else if(!Fn())n=sr();else if(t.lastAutoBackupAt){let i=t.lastAutoBackupAt+Math.max(1,zt())*60*1e3,a=yn(i);n=`Last backup: ${yn(t.lastAutoBackupAt)}
Next backup: ${a}
${sr()}`}else{let i=Date.now()+Math.max(1,zt())*60*1e3;n=`No backup yet
Next backup: ${yn(i)}
${sr()}`}return n})}async function go(e={}){let{silent:t=!0,skipBackoff:n=!1}=e;if(!Fn()){t||(ke(),pi()||Gu());return}if($e){if(!n){l("Auto backup: backoff in progress, skipping scheduled run");return}clearTimeout($e),$e=null,Hn(null),l("Auto backup: manual run cleared backoff and will proceed immediately")}if(!_e().auth.isAutoBackupRunning){$i(!0),ke();try{await Wu({silent:t})==="uploaded"&&qi(Date.now()),si(0),Hn(null),$e&&(clearTimeout($e),$e=null),await hr()}catch(i){if(l("Auto backup failed:",i,"error"),i.message==="unauthorized"){l("Auth error detected, clearing token and stopping retries",null,"warn");let o=ct();Tt({...o,accessToken:null,isSignedIn:!1}),await yo(),Xe("error","Authorization expired. Please sign in again."),ke(),si(0),Hn(null),$e&&(clearTimeout($e),$e=null)}else if(_e().auth.autoBackupRetryAttempts<Ks){let o=_e().auth.autoBackupRetryAttempts+1;si(o);let s=Math.min(Fu*Math.pow(2,o-1),Nu);Hn(s),$e&&clearTimeout($e),$e=setTimeout(()=>{go({silent:!0})},s),l(`Scheduling backup retry ${o}/${Ks} in ${Math.round(s/1e3)}s`),ke()}else Hn(null)}finally{$i(!1),ke()}}}async function an(e=!1){if(Ku(),!!vo()&&Fn()){if(ui=setInterval(()=>{go({silent:!0})},Math.max(1,zt())*60*1e3),!e){let t=Date.now(),n=Math.max(1,zt())*60*1e3,i=_e().auth.lastAutoBackupAt;(!i||t-i>=n)&&go({silent:!0})}ke()}}async function vl(){let e=vo();ji(!e),await hr(),await an(),ke()}async function yl(){let e=zt(),t=prompt("Set Auto Backup interval (minutes):",String(e));if(t===null)return;let n=Math.floor(Number(t));if(!Number.isFinite(n)||n<5||n>1440){alert("Please enter a number between 5 and 1440 minutes.");return}_i(n),await hr(),await an(),ke()}function vr(e,t){return ni(e).then(n=>n!==void 0?n:t)}function yr(e,t){return ti(e,t),Promise.resolve()}var br=window.location.hash;if(br&&br.length>1){let e=new URLSearchParams(br.substring(1));if(e.get("state")==="timekeeper_auth"){let n=e.get("access_token");if(n){console.log("[Timekeeper] Auth token detected in URL, broadcasting token"),console.log("[Timekeeper] Token length:",n.length,"characters");try{let i=new BroadcastChannel("timekeeper_oauth"),a={type:"timekeeper_oauth_token",token:n};console.log("[Timekeeper] Sending auth message via BroadcastChannel:",{type:a.type,tokenLength:n.length}),i.postMessage(a),i.close(),console.log("[Timekeeper] Token broadcast via BroadcastChannel completed")}catch(i){console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",i);let a={type:"timekeeper_oauth_token",token:n,timestamp:Date.now()},o=indexedDB.open("ytls-timestamps-db",4);o.onsuccess=()=>{let u=o.result,s=u.transaction("settings","readwrite");s.objectStore("settings").put({key:"oauth_message",value:a}),s.oncomplete=()=>{console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",a.timestamp),u.close()}}}if(history.replaceState){let i=window.location.pathname+window.location.search;history.replaceState(null,"",i)}throw console.log("[Timekeeper] Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}Bs();(async function(){"use strict";if(window.top!==window.self)return;function e(r){return vr(r,void 0)}function t(r,c){return yr(r,c)}mr(e),pr(t);try{let r=await ni("device_id"),c=typeof r=="string"&&r.length>0?r:crypto.randomUUID();await ti("device_id",c),l(`Lamport: device_id = ${c}`)}catch(r){l("Lamport: failed to initialize device_id:",r,"warn")}if(await cl()){l("OAuth popup detected, broadcasting token and closing");return}await fr();let i=["/watch","/live"];function a(r=window.location.href){try{let c=new URL(r);return c.origin!=="https://www.youtube.com"?!1:i.some(m=>c.pathname===m||c.pathname.startsWith(`${m}/`))}catch(c){return l("Timekeeper failed to parse URL for support check:",c,"error"),!1}}let o=null,u=null,s=null,v=null,f=null,p=null,g=(()=>{try{let r=parseFloat(localStorage.getItem("ytls-last-speed")??"");return Number.isFinite(r)&&r>0&&r!==1?Math.min(r,4):2}catch{return 2}})(),y=!1,E=null,M=null,z=250,$=null;function W(){return _e().ui.minPaneHeight}function ne(r){vs(r)}function N(r){bs(r)}function Y(){return _e().ui.urlChangeHandlersSetup}function se(r){ws(r)}function me(){return _e().ui.panePosition}function J(r){ys(r)}function V(r){xs(r)}function P(){return o?o.getBoundingClientRect():null}function ve(r,c,m){r&&J({x:Math.round(typeof c=="number"?c:r.left),y:Math.round(typeof m=="number"?m:r.top),width:Math.round(r.width),height:Math.round(r.height)})}function ae(r=!0){if(!o)return;Tn();let c=P();if(c&&(c.width||c.height)&&(ve(c),r)){let m=me();Ho("windowPosition",m),wn({type:"window_position_updated",position:m,timestamp:Date.now()})}}function ye(){if(!o||!u||!v||!s)return;let r=40,c=Ee();if(c.length>0)r=c[0].offsetHeight;else{let m=document.createElement("li");m.style.visibility="hidden",m.style.position="absolute",m.textContent="00:00 Example",s.appendChild(m),r=m.offsetHeight,s.removeChild(m)}z=u.offsetHeight+v.offsetHeight+r,ne(z),o.style.minHeight=W()+"px"}function dt(){requestAnimationFrame(()=>{Le?.(),ye(),ae(!0)})}function Ne(r=450){Ae&&(clearTimeout(Ae),Ae=null),Ae=setTimeout(()=>{Te(),dt(),Ae=null},r)}function De(){Ae&&(clearTimeout(Ae),Ae=null)}function be(){s&&(s.style.visibility="hidden",l("Hiding timestamps during show animation")),dt(),Ne()}function le(){Te(),De(),pt&&(clearTimeout(pt),pt=null),pt=setTimeout(()=>{o&&(o.style.display="none",jr(),pt=null)},400)}function Te(){if(!s){Je&&(Je(),Je=null,Ft=null,cn=null);return}if(!cn){s.style.visibility==="hidden"&&(s.style.visibility="",l("Restoring timestamp visibility (no deferred fragment)")),Je&&(Je(),Je=null,Ft=null);return}l("Appending deferred timestamps after animation"),s.appendChild(cn),cn=null,Yt(),Qt(),s.style.visibility==="hidden"&&(s.style.visibility="",l("Restoring timestamp visibility after append")),Je&&(Je(),Je=null,Ft=null),Mt(),Ue(),Le&&requestAnimationFrame(Le),vt(!0)}let ce=null,Me=!1,we="ytls-timestamp-pending-delete",xe="ytls-timestamp-highlight";async function Ge(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(r=>setTimeout(r,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(r=>setTimeout(r,100));await new Promise(r=>setTimeout(r,200))}let Re=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],ue=5e3,nt=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function Ht(r){return nt.has(r)}function Se(){return document.querySelector("video")}let ot=null;function Z(){if(ot&&document.contains(ot))return ot;let r=document.getElementById("movie_player");return r&&document.contains(r)?r:null}function qt(r){return(Math.round(r*100)/100).toFixed(2).replace(/\.0+?$|(?<=\.[0-9])0+$/g,"")}function sn(r){let c=r===1?2:r;g=c;try{localStorage.setItem("ytls-last-speed",String(c))}catch{}}function At(r){if(!p)return;let c=typeof r=="number"?r:Se()?.playbackRate??1,m=qt(c);p.dataset.speed!==m&&(p.dataset.speed=m,p.textContent=`${m}x`,p.setAttribute("aria-label",`Playback speed ${m}x`)),Math.abs(c-1)>.01?p.classList.add("ytls-playback-speed-active"):p.classList.remove("ytls-playback-speed-active")}function Gn(r){let c=Z(),m=Se();if(y=!0,c&&typeof c.setPlaybackRate=="function")c.setPlaybackRate(r);else if(m)m.playbackRate=r;else return y=!1,!1;return At(r),!0}function wr(){let r=Se()?.playbackRate;return Number.isFinite(r)?Gn(Math.abs(r-1)<=.001?g:1):!1}function bl(r){return r instanceof Element?!!r.closest('input, textarea, select, [contenteditable], [role="textbox"]'):!1}function mi(r){return Re.every(c=>typeof r?.[c]=="function"?!0:Ht(c)?!!Se():!1)}function wl(r){return Re.filter(c=>typeof r?.[c]=="function"?!1:Ht(c)?!Se():!0)}async function xl(r=ue){let c=Date.now();for(;Date.now()-c<r;){let x=Z();if(mi(x))return x;await new Promise(k=>setTimeout(k,100))}let m=Z();return mi(m),m}let xr="timestampOffsetSeconds",kl=-5,kr="shiftClickTimeSkipSeconds",Tl=10,fi=300,hi=300,Et=null;function Tr(){try{return new URL(window.location.href).origin==="https://www.youtube.com"}catch{return!1}}function Sr(){if(Tr()&&!Et)try{Et=new BroadcastChannel("ytls_timestamp_channel"),Et.onmessage=Ar}catch(r){l("Failed to create BroadcastChannel:",r,"warn"),Et=null}}function wn(r){if(!Tr()){l("Skipping BroadcastChannel message: not on https://www.youtube.com","warn");return}if(Sr(),!Et){l("No BroadcastChannel available to post message","warn");return}try{Et.postMessage(r)}catch(c){l("BroadcastChannel error, reopening:",c,"warn");try{Et=new BroadcastChannel("ytls_timestamp_channel"),Et.onmessage=Ar,Et.postMessage(r)}catch(m){l("Failed to reopen BroadcastChannel:",m,"error")}}}function Ar(r){if(l("Received message from another tab:",r.data),!(!a()||!s||!o)&&r.data){if(r.data.type==="timestamps_updated"&&r.data.videoId===Pe)l("Debouncing timestamp load due to external update for video:",r.data.videoId),clearTimeout(Vn),Vn=setTimeout(()=>{l("Reloading timestamps due to external update for video:",r.data.videoId),Ti()},500);else if(r.data.type==="window_position_updated"&&o){let c=r.data.position;if(c&&typeof c.x=="number"&&typeof c.y=="number"){o.style.left=`${c.x}px`,o.style.top=`${c.y}px`,o.style.right="auto",o.style.bottom="auto",typeof c.width=="number"&&c.width>0&&(o.style.width=`${c.width}px`),typeof c.height=="number"&&c.height>0&&(o.style.height=`${c.height}px`);let m=o.getBoundingClientRect();J({x:Math.round(c.x),y:Math.round(c.y),width:Math.round(m.width),height:Math.round(m.height)});let x=document.documentElement.clientWidth,k=document.documentElement.clientHeight;(m.left<0||m.top<0||m.right>x||m.bottom>k)&&Tn()}}}}Sr();let xn=await vr(xr);(typeof xn!="number"||Number.isNaN(xn))&&(xn=kl,await yr(xr,xn));let Un=await vr(kr);(typeof Un!="number"||Number.isNaN(Un))&&(Un=Tl,await yr(kr,Un));let Vn=null,Ot=new Map,ln=!1,H=null,bo=null,Pe=null,pt=null,Ae=null,mt=null,qe=null,Wt=null,gi=!1,Le=null,cn=null,Ft=null,Je=null,Kt=null,wo=!1,vi=!1,xo=null,ko=null,To=null,So=null,Ao=null,Eo=null,Mo=null,Lo=null,jn=null,_n=null,$n=null,ft=null,ht=null,Er=0,qn=!1,un=null,Wn=null,kn=null,Mr=null,Kn=null;function dn(){if(!s)return{items:[],starts:[],rawTimes:[]};if(Mr!==s||!Kn?(Kn?.disconnect(),Kn=new MutationObserver(()=>{kn=null}),Kn.observe(s,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-time"]}),Mr=s,kn=null):Kn.takeRecords().length>0&&(kn=null),!kn){let r=oi(s),c=new Array(r.length),m=new Array(r.length);for(let x=0;x<r.length;x++){let k=r[x].querySelector("[data-time]")?.dataset.time;c[x]=k?Number.parseInt(k,10):NaN,m[x]=k?parseFloat(k):0}kn={items:r,starts:c,rawTimes:m}}return kn}function Ee(){return dn().items}function yi(){return hs(s)}function gt(){return Wn!==null||(Wn=gs(s)),Wn}function Yt(){Wn=null}function Sl(r){let c=r.querySelector(".time-diff");return c?(c.textContent?.trim()||"").startsWith("-"):!1}let Al="\u251C\u2500 ",Lr="\u2514\u2500 ",Ir=/^[├└]─\s/;function Io(r){return Ir.test(r)}function Br(r){return r.replace(Ir,"")}function Cr(r){let c=Ee();if(r>=c.length-1)return Lr;let k=c[r+1].querySelector("input");return k&&Io(k.value)?Al:Lr}function El(r,c){return`${Cr(c)}${r}`}function Mt(){if(!s)return;Ee().forEach((c,m)=>{let x=c.querySelector("input");if(!x||!Io(x.value))return;let k=Br(x.value),A=El(k,m);x.value!==A&&(x.value=A)})}function Yn(){ii(s),cn&&(cn=null),Je&&(Je(),Je=null,Ft=null)}function Qn(){fs(s,Me)}function Dr(r){Vi(s,r)}function bi(){ds(s)}function wi(r){if(!(!o||!s)){if(Me=r,r)o.style.display="",o.classList.remove("ytls-fade-out"),o.classList.add("ytls-fade-in"),Dr("Loading timestamps...");else if(bi(),o.style.display="",o.classList.remove("ytls-fade-out"),o.classList.add("ytls-fade-in"),f){let c=Z();if(c){let m=c.getCurrentTime(),x=Number.isFinite(m)?Math.max(0,Math.floor(m)):Math.max(0,gt()),{isLive:k}=c.getVideoData()||{isLive:!1},A=s?dn().rawTimes:[],T="";if(A.length>0)if(k){let w=Math.max(1,x/60),B=A.filter(L=>L<=x);if(B.length>0){let L=(B.length/w).toFixed(2);parseFloat(L)>0&&(T=` (${L}/min)`)}}else{let w=c.getDuration(),B=Number.isFinite(w)&&w>0?w:0,L=Math.max(1,B/60),C=(A.length/L).toFixed(1);parseFloat(C)>0&&(T=` (${C}/min)`)}f.textContent=`${Vt(x)}${T}`}}!Me&&s&&!lo(s)&&Qn(),Nt()}}function Bo(r,c){r.dataset.time=String(c),r.textContent=Vt(c,gt())}let Co=null,Do=null,Lt=!1;function Rr(r,c){if(!r||typeof r.getVideoData!="function"||!(c!==void 0?c:!!r.getVideoData()?.isLive))return!1;if(typeof r.getProgressState=="function"){let x=r.getProgressState(),k=Number(x?.seekableEnd??x?.liveHead??x?.head??x?.duration),A=Number(x?.current??r.getCurrentTime?.());if(Number.isFinite(k)&&Number.isFinite(A))return k-A>2}return!1}function Ml(r,c){if(!Number.isFinite(r))return;let m=Pr(r);xi(m,c)}function vt(r=!1,c){if(ln&&!r)return;let m;if(typeof c=="number"&&Number.isFinite(c))m=Math.max(0,Math.floor(c));else{let x=Z(),k=x?x.getCurrentTime():NaN;m=Number.isFinite(k)?Math.max(0,Math.floor(k)):Math.max(0,gt())}Number.isFinite(m)&&Ml(m,r)}function Pr(r){if(!Number.isFinite(r))return null;let{items:c,starts:m}=dn(),x=-1,k=-1/0;for(let A=0;A<m.length;A++){let T=m[A];T<=r&&T>k&&(k=T,x=A)}return x>=0?c[x]:null}function xi(r,c=!1){let m=s?s.getElementsByClassName(xe):null;if(!(!!m&&(r?m.length===1&&m[0]===r:m.length===0))&&m)for(let k of Array.from(m))k.classList.contains(we)||k.classList.remove(xe);if(r&&!r.classList.contains(we)&&(r.classList.add(xe),c))try{if(s instanceof HTMLElement){let k=r.getBoundingClientRect(),A=s.getBoundingClientRect();!(k.bottom<A.top||k.top>A.bottom)||r.scrollIntoView({behavior:"smooth",block:"center"})}else r.scrollIntoView({behavior:"smooth",block:"center"})}catch{try{r.scrollIntoView({behavior:"smooth",block:"center"})}catch{}}}function Ll(r){if(yt()||!Number.isFinite(r)||r===0)return!1;let c=Ee();if(c.length===0)return!1;let m=[];return c.forEach(x=>{let k=x.querySelector("[data-time]"),A=k?.dataset.time;if(!k||!A)return;let T=Number.parseInt(A,10);if(!Number.isFinite(T))return;let w=Math.max(0,T+r);if(w!==T){Bo(k,w);let B=x.dataset.guid;B&&m.push({guid:B,start:w,comment:x.querySelector("input")?.value??""})}}),m.length===0?!1:(Qt(),Mt(),Ue(),ki(),Fr(Pe,m),un=null,!0)}function zr(r,c={}){if(!Number.isFinite(r)||r===0)return!1;if(!Ll(r)){if(c.alertOnNoChange){let T=c.failureMessage??"Offset did not change any timestamps.";alert(T)}return!1}let x=c.logLabel??"bulk offset";l(`Timestamps changed: Offset all timestamps by ${r>0?"+":""}${r} seconds (${x})`);let k=Z(),A=k?Math.floor(k.getCurrentTime()):0;if(Number.isFinite(A)){let T=Pr(A);xi(T,!1)}return!0}function Hr(r){if(!s||Me)return;let c=r.target instanceof Element?r.target:null;if(!c)return;let m=c.closest("[data-time]"),x=c.closest("[data-increment]"),k=c.closest("[data-action]");if(m?.dataset.time){r.preventDefault();let A=Number(m.dataset.time);if(Number.isFinite(A)){l(`Seeking to timestamp ${A}`),Lt=!0;let w=Z();w&&w.seekTo(A),setTimeout(()=>{Lt=!1},500)}let T=m.closest("li");T&&(Ee().forEach(w=>{w.classList.contains(we)||w.classList.remove(xe)}),T.classList.contains(we)||(T.classList.add(xe),T.scrollIntoView({behavior:"smooth",block:"center"})))}else if(x?.dataset.increment){r.preventDefault();let A=x.closest("li"),T=A?.querySelector("[data-time]");if(!T||!T.dataset.time)return;let w=parseInt(T.dataset.time,10),B=parseInt(x.dataset.increment,10);if("shiftKey"in r&&r.shiftKey&&(B*=Un),"altKey"in r?r.altKey:!1){zr(B,{logLabel:"Alt adjust"});return}let O=Math.max(0,w+B);if(l(`Timestamps changed: Timestamp time incremented from ${w} to ${O}`),Yt(),Bo(T,O),Do=O,Co&&clearTimeout(Co),Lt=!0,Co=setTimeout(()=>{if(Do!==null){let q=Z();q&&q.seekTo(Do)}Co=null,Do=null,setTimeout(()=>{Lt=!1},500)},500),Qt(),Mt(),Ue(),A){let q=A.querySelector("input"),de=A.dataset.guid;q&&de&&(zo(Pe,de,O,q.value),un=de)}}else k?.dataset.action==="clear"&&(r.preventDefault(),l("Timestamps changed: All timestamps cleared from UI"),s.textContent="",Yt(),Ue(),Ro(),Cl(),V([]),Bl(Pe),un=null,Qn())}function Xn(r,c="",m=!1,x=null,k=!0){if(!s)return null;let A=Math.max(0,r),T=x??crypto.randomUUID(),w=document.createElement("li"),B=document.createElement("div"),L=document.createElement("span"),C=document.createElement("span"),O=document.createElement("span"),q=document.createElement("div"),de=document.createElement("span"),it=document.createElement("span"),Q=document.createElement("input"),fe=document.createElement("button");w.dataset.guid=T,B.className="time-row",q.className="ytls-row-controls";let Ie=document.createElement("div");Ie.style.cssText="position:absolute;left:0;top:0;width:20px;height:20px;display:flex;align-items:center;justify-content:center;cursor:pointer;",Qe(Ie,"Click to toggle indent");let Ze=document.createElement("span");Ze.style.cssText="color:#f4ba78;pointer-events:none;display:none;line-height:0;";let bt=()=>{let j=Q.offsetTop,F=Q.offsetHeight||20;Ie.style.top=`${j}px`,Ie.style.height=`${F}px`},It=()=>{Oe(Ze,Io(Q.value)?"indent-decrease":"indent-increase",18)},Sn="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",Xt=j=>{let F=Ze.querySelector("svg");F&&(F.style.transition="filter 0.15s ease",F.style.filter=j?Sn:"none")},An=j=>{j.stopPropagation();let F=Io(Q.value),pe=Br(Q.value),X="";if(!F){let rt=Ee().indexOf(w);X=Cr(rt)}Q.value=X?`${X}${pe}`:pe,It(),Mt();let he=Number.parseInt(de.dataset.time??"0",10);zo(Pe,T,he,Q.value)};Ie.onclick=An,Ie.append(Ze),Ie.addEventListener("mouseenter",()=>{Xt(!0)}),Ie.addEventListener("mouseleave",()=>{Xt(!1)}),w.style.cssText="position:relative;padding-left:20px;",w.addEventListener("mouseenter",()=>{bt(),It(),Ze.style.display="inline"}),w.addEventListener("mouseleave",()=>{Xt(!1),Ze.style.display="none"}),w.addEventListener("mouseleave",()=>{w.dataset.guid===un&&Sl(w)&&Or()}),Q.value=c||"",Q.style.cssText="width:100%;margin-top:5px;display:block;",Q.type="text",Q.setAttribute("inputmode","text"),Q.autocapitalize="off",Q.autocomplete="off",Q.spellcheck=!1,requestAnimationFrame(bt);let Zn=!1;Q.addEventListener("focusin",()=>{qn=!1,Zn=!1}),Q.addEventListener("focusout",j=>{let F=j.relatedTarget,pe=Date.now()-Er<250,X=!!F&&!!o&&o.contains(F);!pe&&!X&&!Zn&&(qn=!0,setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(Q.focus({preventScroll:!0}),qn=!1)},0))}),Q.addEventListener("keydown",j=>{(j.key==="Escape"||j.key==="Esc")&&(j.preventDefault(),Zn=!0,Q.blur())});let eo=j=>{let F=Ot.get(T);F&&clearTimeout(F.timeoutId);let pe=Pe,X=()=>{let he=Ot.get(T);he&&(clearTimeout(he.timeoutId),Ot.delete(T)),Nr(pe,T,Number.parseInt(de.dataset.time??"0",10),Q.value)};Ot.set(T,{timeoutId:setTimeout(X,j),flush:X})};Q.addEventListener("input",j=>{let F=j;F&&(F.isComposing||F.inputType==="insertCompositionText")||eo(500)}),Q.addEventListener("compositionend",()=>{eo(50)});let Gt="#f4ba78",Oo="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",Fo="#c8452d",No="drop-shadow(0 0 4px #e36a52) drop-shadow(0 0 8px #e36a52)",mn=(j,F=Gt,pe=Oo)=>{j.style.color=F;let X=j.querySelector("svg");X&&(X.style.transition="filter 0.15s ease"),j.addEventListener("mouseenter",()=>{X&&(X.style.filter=pe)}),j.addEventListener("mouseleave",()=>{X&&(X.style.filter="none")})};Oe(L,"circle-minus",18),L.classList.add("ytls-row-control"),L.dataset.increment="-1",L.style.cursor="pointer",L.style.margin="0px",mn(L),Oe(O,"circle-plus",18),O.classList.add("ytls-row-control"),O.dataset.increment="1",O.style.cursor="pointer",O.style.margin="0px",mn(O),Oe(C,"current-location",18),C.classList.add("ytls-row-control"),C.style.cursor="pointer",C.style.margin="0px",Qe(C,"Set to current playback time"),mn(C),C.onclick=()=>{let j=Z(),F=j?Math.floor(j.getCurrentTime()):0;Number.isFinite(F)&&(l(`Timestamps changed: set to current playback time ${F}`),Yt(),Bo(de,F),Qt(),Mt(),zo(Pe,T,F,Q.value),un=T)},Yt(),Bo(de,A),de.addEventListener("click",j=>{j.preventDefault(),j.stopPropagation();let F=Number(de.dataset.time);if(!Number.isFinite(F))return;l(`Seeking to timestamp ${F}`),Lt=!0;let pe=Z();pe&&pe.seekTo(F);let X=Se();X?.paused&&X.play(),setTimeout(()=>{Lt=!1},500),s?.querySelectorAll(`.${xe}`).forEach(he=>he.classList.remove(xe)),w.classList.contains(we)||(w.classList.add(xe),w.scrollIntoView({behavior:"smooth",block:"center"}))}),Oe(fe,"trash",16),fe.classList.add("ytls-row-control"),fe.style.cssText="background:transparent;border:none;cursor:pointer;margin-left:5px;display:inline-flex;align-items:center;",mn(fe,Fo,No),fe.onclick=()=>{let j=null,F=null,pe=null,X=()=>{try{w.removeEventListener("click",F,!0)}catch{}try{document.removeEventListener("click",F,!0)}catch{}if(s)try{s.removeEventListener("mouseleave",pe)}catch{}j&&(clearTimeout(j),j=null)};if(w.dataset.deleteConfirmed==="true"){l("Timestamps changed: Timestamp deleted");let he=w.dataset.guid??"",Ve=Ot.get(he);Ve&&(clearTimeout(Ve.timeoutId),Ot.delete(he)),X(),w.remove(),Yt(),Qt(),Mt(),Ue(),Ro(),Dl(Pe,he),un=null,Qn()}else{w.dataset.deleteConfirmed="true",w.classList.add(we),w.classList.remove(xe);let he=()=>{w.dataset.deleteConfirmed="false",w.classList.remove(we);let Ve=Z(),rt=Ve?Ve.getCurrentTime():0,Bt=Number.parseInt(w.querySelector("[data-time]")?.dataset.time??"0",10);Number.isFinite(rt)&&Number.isFinite(Bt)&&rt>=Bt&&w.classList.add(xe),X()};F=Ve=>{Ve.target!==fe&&he()},pe=()=>{w.dataset.deleteConfirmed==="true"&&he()},w.addEventListener("click",F,!0),document.addEventListener("click",F,!0),s&&s.addEventListener("mouseleave",pe),j=setTimeout(()=>{w.dataset.deleteConfirmed==="true"&&he(),X()},5e3)}},it.className="time-diff",it.style.color="#888",it.style.marginLeft="5px",q.append(L,C,O,fe),B.append(de,q,it),w.append(Ie,B,Q);let Go=Number.parseInt(de.dataset.time??"0",10);if(k){bi();let j=!1,F=Ee();for(let pe=0;pe<F.length;pe++){let X=F[pe],Ve=X.querySelector("[data-time]")?.dataset.time;if(!Ve)continue;let rt=Number.parseInt(Ve,10);if(Number.isFinite(rt)&&Go<rt){s.insertBefore(w,X),j=!0;break}}j||s.appendChild(w),w.scrollIntoView({behavior:"smooth",block:"center"}),Yt(),Qt(),Ro(),Mt(),Ue(),m||(zo(Pe,T,A,c),un=T,xi(w,!1))}else Q.__ytls_li=w;return Q}function Qt(){if(yt())return;let r=gt(),c=Ee();c.forEach((m,x)=>{let k=m.querySelector(".time-diff"),A=m.querySelector("[data-time]"),T=A?.dataset.time;if(A&&T){let it=Number.parseInt(T,10);Number.isFinite(it)&&(A.textContent=Vt(it,r))}if(!k)return;if(!T){k.textContent="";return}let w=Number.parseInt(T,10);if(!Number.isFinite(w)){k.textContent="";return}if(x===0){k.textContent="";return}let C=c[x-1].querySelector("[data-time]")?.dataset.time;if(!C){k.textContent="";return}let O=Number.parseInt(C,10);if(!Number.isFinite(O)){k.textContent="";return}let q=w-O,de=q<0?"-":"";k.textContent=` ${de}${Vt(Math.abs(q))}`})}function Or(){if(yt())return;let r=null;if(document.activeElement instanceof HTMLInputElement&&s.contains(document.activeElement)){let T=document.activeElement,B=T.closest("li")?.dataset.guid;if(B){let L=T.selectionStart??T.value.length,C=T.selectionEnd??L,O=T.scrollLeft;r={guid:B,start:L,end:C,scroll:O}}}let c=Ee();if(c.length===0)return;let m=c.map(T=>T.dataset.guid),x=c.map(T=>{let w=T.querySelector("[data-time]"),B=w?.dataset.time;if(!w||!B)return null;let L=Number.parseInt(B,10);if(!Number.isFinite(L))return null;let C=T.dataset.guid??"";return{time:L,guid:C,element:T}}).filter(T=>T!==null).sort((T,w)=>{let B=T.time-w.time;return B!==0?B:T.guid.localeCompare(w.guid)}),k=x.map(T=>T.guid),A=m.length!==k.length||m.some((T,w)=>T!==k[w]);if(s.replaceChildren(),x.forEach(T=>{s.appendChild(T.element)}),Qt(),Mt(),Ue(),r){let w=Ee().find(B=>B.dataset.guid===r.guid)?.querySelector("input");if(w)try{w.focus({preventScroll:!0})}catch{}}A&&(l("Timestamps changed: Timestamps sorted"),ki())}function Ro(){if(!s||!o||!u||!v)return;let r=Ee().length;Le?.();let c=o.getBoundingClientRect(),m=u.getBoundingClientRect(),x=v.getBoundingClientRect(),k=Math.max(0,c.height-(m.height+x.height));r===0?(Qn(),s.style.overflowY="hidden"):s.style.overflowY=s.scrollHeight>k?"auto":"hidden"}function Ue(){if(!s)return;let r=Se(),c=document.querySelector(".ytp-progress-bar"),m=Z(),x=m?m.getVideoData():null,k=!!x&&!!x.isLive;if(!r||!c||!isFinite(r.duration)||k)return;Ur();let{items:A,starts:T}=dn(),w=r.duration,B=document.createDocumentFragment();A.forEach((L,C)=>{let O=T[C];if(!Number.isFinite(O))return;L.dataset.guid||(L.dataset.guid=crypto.randomUUID());let q=document.createElement("div");q.className="ytls-marker",q.style.left=O/w*100+"%",q.dataset.time=String(O),B.appendChild(q)}),c.appendChild(B),Il(c)}function Il(r){r.dataset.ytlsMarkerClicks||(r.dataset.ytlsMarkerClicks="1",r.addEventListener("click",c=>{let m=c.target?.closest?.(".ytls-marker");if(!m)return;let x=Number(m.dataset.time),k=Z();k&&Number.isFinite(x)&&k.seekTo(x)}))}function ki(){V(yi().sort((r,c)=>r.start-c.start))}function Fr(r,c){!r||c.length===0||Me||yt()||(Nl(r,c).then(()=>{l(`Saved ${c.length} timestamps for ${r} to IndexedDB`),s&&Jn()}).catch(m=>{let x=`Failed to save timestamps: ${m.message}`;l(`Failed to save timestamps for ${r} to IndexedDB:`,m,"error"),pn(x)}),wn({type:"timestamps_updated",videoId:r,action:"saved"}))}function Bl(r){!r||Me||yt()||(Vr(r).then(()=>{s&&Jn()}).catch(c=>{let m=`Failed to clear timestamps: ${c.message}`;l(`Failed to clear timestamps for ${r}:`,c,"error"),pn(m)}),wn({type:"timestamps_updated",videoId:r,action:"saved"}))}function Po(){for(let{flush:r}of[...Ot.values()])r()}function Cl(){Ot.forEach(({timeoutId:r})=>clearTimeout(r)),Ot.clear()}function zo(r,c,m,x){!r||Me||yt()||Nr(r,c,m,x)}function Nr(r,c,m,x){if(!r)return;let k={guid:c,start:m,comment:x};l(`Saving timestamp: guid=${c}, start=${m}, comment="${x}"`),Gl(r,k).then(()=>{s&&Jn()}).catch(A=>{let T=`Failed to save timestamp: ${A.message}`;l(`Failed to save timestamp ${c}:`,A,"error"),pn(T)}),wn({type:"timestamps_updated",videoId:r,action:"saved"})}function Dl(r,c){!r||Me||yt()||(Ul(r,c).then(()=>{s&&Jn()}).catch(m=>{let x=`Failed to delete timestamp: ${m.message}`;l(`Failed to delete timestamp ${c}:`,m,"error"),pn(x)}),wn({type:"timestamps_updated",videoId:r,action:"saved"}))}async function Gr(r){if(yt()){alert("Cannot export timestamps while an error is being displayed.");return}let c=Pe;if(!c)return;l(`Exporting timestamps for video ID: ${c}`);let m=yi(),x=Math.max(gt(),0),k=hn();if(r==="json"){let A=new Blob([JSON.stringify(m,null,2)],{type:"application/json"}),T=URL.createObjectURL(A),w=document.createElement("a");w.href=T,w.download=`timestamps-${c}-${k}.json`,w.click(),URL.revokeObjectURL(T)}else if(r==="text"){let A=m.map(L=>{let C=Vt(L.start,x),O=`${L.comment} <!-- guid:${L.guid} -->`.trimStart();return`${C} ${O}`}).join(`
`),T=new Blob([A],{type:"text/plain"}),w=URL.createObjectURL(T),B=document.createElement("a");B.href=w,B.download=`timestamps-${c}-${k}.txt`,B.click(),URL.revokeObjectURL(w)}}function pn(r){if(!o||!s){l("Timekeeper error:",r,"error");return}ps(s,r),Wi(r),Ue()}function Jn(){s&&(ms(s),Wi(null))}function yt(){return!!(!s||lo(s)||Me||ks()!==null)}function Ur(){document.querySelectorAll(".ytls-marker").forEach(r=>r.remove())}function Tn(){if(!o||!document.body.contains(o))return;let r=o.getBoundingClientRect(),c=document.documentElement.clientWidth,m=document.documentElement.clientHeight,x=r.width,k=r.height;if(r.left<0&&(o.style.left="0",o.style.right="auto"),r.right>c){let A=Math.max(0,c-x);o.style.left=`${A}px`,o.style.right="auto"}if(r.top<0&&(o.style.top="0",o.style.bottom="auto"),r.bottom>m){let A=Math.max(0,m-k);o.style.top=`${A}px`,o.style.bottom="auto"}}function Rl(){if(xo&&(document.removeEventListener("mousemove",xo),xo=null),ko&&(document.removeEventListener("mouseup",ko),ko=null),jn&&(document.removeEventListener("keydown",jn),jn=null),To&&(window.removeEventListener("resize",To),To=null),_n&&(document.removeEventListener("pointerdown",_n,!0),_n=null),$n&&(document.removeEventListener("pointerup",$n,!0),$n=null),ft){try{ft.disconnect()}catch{}ft=null}if(ht){try{ht.disconnect()}catch{}ht=null}let r=Se();r&&(So&&(r.removeEventListener("timeupdate",So),So=null),Ao&&(r.removeEventListener("pause",Ao),Ao=null),Eo&&(r.removeEventListener("play",Eo),Eo=null),Mo&&(r.removeEventListener("seeking",Mo),Mo=null),Lo&&(r.removeEventListener("ratechange",Lo),Lo=null))}function Pl(){Ur(),Po(),Vn&&(clearTimeout(Vn),Vn=null),ce&&(clearInterval(ce),ce=null),pt&&(clearTimeout(pt),pt=null),Rl(),$a();try{Et.close()}catch{}if(H&&H.parentNode===document.body&&document.body.removeChild(H),H=null,bo=null,ln=!1,Pe=null,ft){try{ft.disconnect()}catch{}ft=null}if(ht){try{ht.disconnect()}catch{}ht=null}o&&o.parentNode&&o.remove();let r=document.getElementById("ytls-header-button");r&&r.parentNode&&r.remove(),Kt=null,wo=!1,J(null),Yn(),o=null,u=null,s=null,v=null,qe=null,Wt=null,Le=null,f=null,p=null,E=null,ot=null}async function zl(){let r=Si();if(!r)return ot=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let c=await xl();if(!mi(c)){let m=wl(c),x=m.length?` Missing methods: ${m.join(", ")}.`:"",k=c?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return ot=null,{ok:!1,message:`${k}${x} Try refreshing once playback is ready.`}}return ot=c,{ok:!0,player:c,videoId:r}}async function Ti(){if(!o||!s)return;let r=s.scrollTop,c=!0,m=()=>{if(!s||!c)return;let x=Math.max(0,s.scrollHeight-s.clientHeight);s.scrollTop=Math.min(r,x)};try{let x=await zl();if(!x.ok){pn(x.message),Yn(),Ue();return}let{videoId:k}=x,A=[];try{let T=await Vl(k);T?(A=T.map(w=>({...w,guid:w.guid||crypto.randomUUID()})),l(`Loaded ${A.length} timestamps from IndexedDB for ${k}`),Jn()):l(`No timestamps found in IndexedDB for ${k}`)}catch(T){let w=`Failed to load timestamps: ${T.message}`;l(`Failed to load timestamps from IndexedDB for ${k}:`,T,"error"),pn(w),Ue();return}if(A.length>0){A.sort((B,L)=>B.start-L.start),Yn(),bi();let T=document.createDocumentFragment();A.forEach(B=>{let C=Xn(B.start,B.comment,!0,B.guid,!1).__ytls_li;C&&T.appendChild(C)}),o&&o.classList.contains("ytls-zoom-in")&&Ae!=null?(l("Deferring timestamp DOM append until show animation completes"),cn=T,Ft||(Ft=new Promise(B=>{Je=B})),await Ft):s&&(s.appendChild(T),Yt(),Qt(),Mt(),Ue(),Le&&requestAnimationFrame(Le)),V(A),vt(!0),c=!1}else Yn(),Dr("No timestamps for this video"),Ue(),V([]),Le&&requestAnimationFrame(Le)}catch(x){l("Unexpected error while loading timestamps:",x,"error"),pn("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{Ft&&await Ft,requestAnimationFrame(m),Le&&requestAnimationFrame(Le),s&&!lo(s)&&Qn()}}function Si(){let c=new URLSearchParams(location.search).get("v");if(c)return c;let m=document.querySelector('meta[itemprop="identifier"]');return m?.content?m.content:null}function Hl(r=null,c=null){if(!f)return;let m=Se(),x=c||Z();if(!m&&!x)return;let k=r!==null?r:x?x.getCurrentTime():0,A=Number.isFinite(k)?Math.max(0,Math.floor(k)):Math.max(0,gt()),{isLive:T}=x?x.getVideoData()||{isLive:!1}:{isLive:!1},w=x?Rr(x,!!T):!1,B=s?dn().rawTimes:[],L="";if(B.length>0)if(T){let C=Math.max(1,A/60),O=B.filter(q=>q<=A);if(O.length>0){let q=(O.length/C).toFixed(2);parseFloat(q)>0&&(L=` (${q}/min)`)}}else{let C=x?x.getDuration():0,O=Number.isFinite(C)&&C>0?C:m&&Number.isFinite(m.duration)&&m.duration>0?m.duration:0,q=Math.max(1,O/60),de=(B.length/q).toFixed(1);parseFloat(de)>0&&(L=` (${de}/min)`)}f.textContent=`${Vt(A)}${L}`,f.style.color=w?"#ff4d4f":""}function Ol(){let r=Se();if(!r)return;let c=NaN,m=null,x=()=>{if(!s)return;let L=Z(),C=L?Math.floor(L.getCurrentTime()):0;if(!Number.isFinite(C))return;let O=dn();if(C===c&&O===m)return;let q=!!f&&!Me&&!Lt;q&&Hl(C,L),vt(!1,C),q&&!ln&&(c=C,m=O)},k=L=>{try{let C=new URL(window.location.href);L!==null&&Number.isFinite(L)?C.searchParams.set("t",`${Math.floor(L)}s`):C.searchParams.delete("t"),window.history.replaceState(window.history.state,"",C.toString())}catch{}},A=()=>{let L=Z(),C=L?L.getCurrentTime():NaN,O=Number.isFinite(C)?Math.max(0,Math.floor(C)):Math.max(0,gt());if(Number.isFinite(O)){k(O);try{vt(!0)}catch(q){l("Failed to highlight nearest timestamp on pause:",q,"warn")}}},T=()=>{k(null);try{let L=Z(),C=L?L.getCurrentTime():NaN,O=Number.isFinite(C)?Math.max(0,Math.floor(C)):Math.max(0,gt());Number.isFinite(O)&&vt(!0)}catch(L){l("Failed to highlight nearest timestamp on play:",L,"warn")}},w=()=>{let L=Se();if(!L)return;let C=Z(),O=C?Math.floor(C.getCurrentTime()):0;Number.isFinite(O)&&(L.paused&&k(O),vt(!0,O))},B=()=>{let L=r.playbackRate;y?y=!1:sn(L),At(L)};So=x,Ao=A,Eo=T,Mo=w,Lo=B,r.addEventListener("timeupdate",x),r.addEventListener("pause",A),r.addEventListener("play",T),r.addEventListener("seeking",w),r.addEventListener("ratechange",B)}let{saveToIndexedDB:Fl,saveRowsToIndexedDB:Nl,saveSingleTimestampToIndexedDB:Gl,deleteSingleTimestampFromIndexedDB:Ul,loadFromIndexedDB:Vl,removeFromIndexedDB:Vr,saveGlobalSettings:Ho,loadGlobalSettings:Ai,buildExportPayload:jl,mergeBackupData:_l,exportAllTimestamps:$l,exportAllTimestampsCsv:ql}=Ui;function jr(){if(!o)return;let r=o.style.display!=="none";Ho("uiVisible",r)}function Nt(r){let c=typeof r=="boolean"?r:!!o&&o.style.display!=="none",m=document.getElementById("ytls-header-button");m instanceof HTMLButtonElement&&m.setAttribute("aria-pressed",String(c)),Kt&&!wo&&Kt.src!==Zo&&(Kt.src=Zo)}function Wl(){o&&Ai("uiVisible").then(r=>{let c=Yo().safeParse(r),m=c.success?c.data:void 0;typeof m=="boolean"?(m?(o.style.display="flex",o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in")):o.style.display="none",Nt(m)):(!c.success&&r!==void 0&&l("UI visibility state failed validation, defaulting to visible",c.error.message,"warn"),o.style.display="flex",o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in"),Nt(!0))}).catch(r=>{l("Failed to load UI visibility state:",r,"error"),o.style.display="flex",o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in"),Nt(!0)})}function Ei(r){if(!o){l("ERROR: togglePaneVisibility called but pane is null");return}document.body.contains(o)||(l("Pane not in DOM during toggle, appending it"),document.querySelectorAll("#ytls-pane").forEach(k=>{k!==o&&k.remove()}),document.body.appendChild(o));let c=document.querySelectorAll("#ytls-pane");c.length>1&&(l(`ERROR: Multiple panes detected in togglePaneVisibility (${c.length}), cleaning up`),c.forEach(k=>{k!==o&&k.remove()})),pt&&(clearTimeout(pt),pt=null);let m=o.style.display==="none";(typeof r=="boolean"?r:m)?(o.style.display="flex",o.classList.remove("ytls-fade-out"),o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in"),Nt(!0),jr(),be(),Ae&&(clearTimeout(Ae),Ae=null),Ae=setTimeout(()=>{Te(),Le?.(),ye(),ae(!0);try{vt(!0)}catch(k){l("Failed to scroll to nearest timestamp after toggle:",k,"warn")}Ae=null},450)):(o.classList.remove("ytls-fade-in"),o.classList.remove("ytls-zoom-in"),o.classList.add("ytls-zoom-out"),Nt(!1),le())}function _r(r){if(!s){l("UI is not initialized; cannot import timestamps.","warn");return}let c=!1,m=[],x=(k,A)=>{let T=k.querySelector("input");if(!T)return;T.value=A;let w=k.dataset.guid,B=Number.parseInt(k.querySelector("[data-time]")?.dataset.time??"",10);w&&Number.isFinite(B)&&m.push({guid:w,start:B,comment:A})};try{let k=JSON.parse(r),A=null;if(Array.isArray(k))A=k;else if(typeof k=="object"&&k!==null){let T=Pe;if(T){let w=`timekeeper-${T}`;k[w]&&Array.isArray(k[w].timestamps)&&(A=k[w].timestamps,l(`Found timestamps for current video (${T}) in export format`,"info"))}if(!A){let w=Object.keys(k).filter(B=>B.startsWith("ytls-"));if(w.length===1&&Array.isArray(k[w[0]].timestamps)){A=k[w[0]].timestamps;let B=k[w[0]].video_id;l(`Found timestamps for video ${B} in export format`,"info")}}}A&&Array.isArray(A)?A.every(w=>typeof w.start=="number"&&typeof w.comment=="string")?(A.forEach(w=>{if(w.guid){let B=Ee().find(L=>L.dataset.guid===w.guid);B?x(B,w.comment):Xn(w.start,w.comment,!1,w.guid)}else Xn(w.start,w.comment,!1,crypto.randomUUID())}),c=!0):l("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):l("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!c){let k=r.split(`
`).map(A=>A.trim()).filter(A=>A);if(k.length>0){let A=!1;k.forEach(T=>{let w=T.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(w){A=!0;let B=parseInt(w[1])||0,L=parseInt(w[2]),C=parseInt(w[3]),O=B*3600+L*60+C,q=w[4]?w[4].trim():"",de=null,it=q,Q=q.match(/<!--\s*guid:([^>]+?)\s*-->/);Q&&(de=Q[1].trim(),it=q.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let fe;de&&(fe=Ee().find(Ie=>Ie.dataset.guid===de)),!fe&&!de&&(fe=Ee().find(Ie=>{if(Ie.dataset.guid)return!1;let bt=Ie.querySelector("[data-time]")?.dataset.time;if(!bt)return!1;let It=Number.parseInt(bt,10);return Number.isFinite(It)&&It===O})),fe?x(fe,it):Xn(O,it,!1,de||crypto.randomUUID())}}),A&&(c=!0)}}c?(l("Timestamps changed: Imported timestamps from file/clipboard"),Mt(),ki(),Fr(Pe,m),Ue(),Ro()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function Kl(){if(vi){l("Pane initialization already in progress, skipping duplicate call");return}if(!(o&&document.body.contains(o))){vi=!0;try{let k=function(d=null,h=null){if(!f)return;let b=Se(),S=h||Z();if(!b&&!S)return;let I=d!==null?d:S?S.getCurrentTime():0,U=Number.isFinite(I)?Math.max(0,Math.floor(I)):Math.max(0,gt()),{isLive:D}=S?S.getVideoData()||{isLive:!1}:{isLive:!1},G=S?Rr(S,!!D):!1,R=s?dn().rawTimes:[],_="";if(R.length>0)if(D){let oe=Math.max(1,U/60),ee=R.filter(Be=>Be<=U);if(ee.length>0){let Be=(ee.length/oe).toFixed(2);parseFloat(Be)>0&&(_=` (${Be}/min)`)}}else{let oe=S?S.getDuration():0,ee=Number.isFinite(oe)&&oe>0?oe:b&&Number.isFinite(b.duration)&&b.duration>0?b.duration:0,Be=Math.max(1,ee/60),et=(R.length/Be).toFixed(1);parseFloat(et)>0&&(_=` (${et}/min)`)}f.textContent=`${Vt(U)}${_}`,f.style.color=G?"#ff4d4f":"",x(!!D);try{At()}catch{}},A=function(){if(Me||Lt)return;let d=Z();if(!d)return;let h=d.getCurrentTime(),b=Number.isFinite(h)?Math.max(0,Math.floor(h)):Math.max(0,gt());k(b,d),(s?Ee():[]).length>0&&vt(!1,b)},fe=function(d,h,b,S){let I=document.createElement("button");return S?ie(I,S,d):I.textContent=d,Qe(I,h),I.classList.add("ytls-settings-modal-button"),I.onclick=b,I},Ie=function(d="general"){if(H&&H.parentNode===document.body){let ze=document.getElementById("ytls-save-modal"),en=document.getElementById("ytls-load-modal"),Ut=document.getElementById("ytls-delete-all-modal");ze&&document.body.contains(ze)&&document.body.removeChild(ze),en&&document.body.contains(en)&&document.body.removeChild(en),Ut&&document.body.contains(Ut)&&document.body.removeChild(Ut),H.classList.remove("ytls-fade-in"),H.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(H)&&document.body.removeChild(H),H=null,document.removeEventListener("click",bt,!0),document.removeEventListener("keydown",Ze)},300);return}H=document.createElement("div"),H.id="ytls-settings-modal",H.classList.remove("ytls-fade-out"),H.classList.add("ytls-fade-in");let h=document.createElement("div");h.className="ytls-modal-header";let b=document.createElement("div");b.id="ytls-settings-nav";let S=document.createElement("button");S.className="ytls-modal-close-button",Oe(S,"x",14),S.onclick=()=>{if(H&&H.parentNode===document.body){let ze=document.getElementById("ytls-save-modal"),en=document.getElementById("ytls-load-modal"),Ut=document.getElementById("ytls-delete-all-modal");ze&&document.body.contains(ze)&&document.body.removeChild(ze),en&&document.body.contains(en)&&document.body.removeChild(en),Ut&&document.body.contains(Ut)&&document.body.removeChild(Ut),H.classList.remove("ytls-fade-in"),H.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(H)&&document.body.removeChild(H),H=null,document.removeEventListener("click",bt,!0),document.removeEventListener("keydown",Ze)},300)}};let I=document.createElement("div");I.id="ytls-settings-content";let U=document.createElement("h3");U.className="ytls-section-heading",U.textContent="General",U.style.display="none";let D=document.createElement("div"),G=document.createElement("div");G.className="ytls-button-grid";function R(ze){D.style.display=ze==="general"?"block":"none",G.style.display=ze==="google"?"block":"none",_.classList.toggle("active",ze==="general"),ee.classList.toggle("active",ze==="google"),U.textContent=ze==="general"?"General":"Google"}let _=document.createElement("button");_.appendChild(oo("adjustments-horizontal",16));let oe=document.createElement("span");oe.className="ytls-tab-text",oe.textContent=" General",_.appendChild(oe),Qe(_,"General settings"),_.classList.add("ytls-settings-modal-button"),_.onclick=()=>R("general");let ee=document.createElement("button");ee.appendChild(oo("cloud",16));let Be=document.createElement("span");Be.className="ytls-tab-text",Be.textContent=" Google",ee.appendChild(Be),Qe(ee,"Google Drive backup settings"),ee.classList.add("ytls-settings-modal-button"),ee.onclick=async()=>{ut.isSignedIn&&await dl(),R("google")},b.appendChild(_),b.appendChild(ee),h.appendChild(b),h.appendChild(S),H.appendChild(h),D.className="ytls-button-grid",D.appendChild(fe("Save","Save As...",It.onclick,"device-floppy")),D.appendChild(fe("Load","Load",Sn.onclick,"folder-open")),D.appendChild(fe("Export All","Export All Data",Xt.onclick,"file-export")),D.appendChild(fe("Import All","Import All Data",An.onclick,"file-import")),D.appendChild(fe("Export All (CSV)","Export All Timestamps to CSV",async()=>{try{await ql()}catch{alert("Failed to export CSV: Could not read from database.")}},"file-spreadsheet"));let et=fe(ut.isSignedIn?"Sign Out":"Sign In",ut.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{ut.isSignedIn?await ul():await ll(),ie(et,ut.isSignedIn?"logout":"login",ut.isSignedIn?"Sign Out":"Sign In"),Qe(et,ut.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),ke()},ut.isSignedIn?"logout":"login"),Bn=fe(vo()?"Auto Backup: On":"Auto Backup: Off","Toggle Auto Backup",async()=>{await vl(),Zt(),ke()},"refresh"),fn=fe(`Backup Interval: ${zt()}min`,"Set periodic backup interval (minutes)",async()=>{await yl(),Zt(),ke()},"clock-plus"),Zt=()=>{ie(et,ut.isSignedIn?"logout":"login",ut.isSignedIn?"Sign Out":"Sign In"),Qe(et,ut.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),ie(Bn,"refresh",vo()?"Auto Backup: On":"Auto Backup: Off"),ie(fn,"clock-plus",`Backup Interval: ${zt()}min`),typeof ke=="function"&&ke()};G.appendChild(et),G.appendChild(Bn),G.appendChild(fn),G.appendChild(fe("Backup Now","Run a backup immediately",async()=>{await go({silent:!1,skipBackoff:!0}),Zt()},"database"));let at=document.createElement("div");at.style.marginTop="15px",at.style.paddingTop="10px",at.style.borderTop="1px solid #555",at.style.fontSize="12px",at.style.color="#aaa";let Wo=document.createElement("div");Wo.style.marginBottom="8px",Wo.style.fontWeight="bold",at.appendChild(Wo),Js(Wo);let Bi=document.createElement("div");Bi.style.marginBottom="8px",Qs(Bi),at.appendChild(Bi);let ea=document.createElement("div");Xs(ea),at.appendChild(ea),G.appendChild(at),Xe(),Nn(),ke(),Zt(),I.appendChild(U),I.appendChild(D),I.appendChild(G),R(d==="drive"?"google":d),H.appendChild(I),document.body.appendChild(H),requestAnimationFrame(()=>{let ze=H.getBoundingClientRect(),Ut=(window.innerHeight-ze.height)/2;H.style.top=`${Math.max(20,Ut)}px`,H.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",bt,!0),document.addEventListener("keydown",Ze)},0)},Ze=function(d){if(d.key==="Escape"&&H&&H.parentNode===document.body){let h=document.getElementById("ytls-save-modal"),b=document.getElementById("ytls-load-modal"),S=document.getElementById("ytls-delete-all-modal");if(h||b||S)return;d.preventDefault(),h&&document.body.contains(h)&&document.body.removeChild(h),b&&document.body.contains(b)&&document.body.removeChild(b),S&&document.body.contains(S)&&document.body.removeChild(S),H.classList.remove("ytls-fade-in"),H.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(H)&&document.body.removeChild(H),H=null,document.removeEventListener("click",bt,!0),document.removeEventListener("keydown",Ze)},300)}},bt=function(d){if(bo&&bo.contains(d.target))return;let h=document.getElementById("ytls-save-modal"),b=document.getElementById("ytls-load-modal"),S=document.getElementById("ytls-delete-all-modal");h&&h.contains(d.target)||b&&b.contains(d.target)||S&&S.contains(d.target)||H&&H.contains(d.target)||(h&&document.body.contains(h)&&document.body.removeChild(h),b&&document.body.contains(b)&&document.body.removeChild(b),S&&document.body.contains(S)&&document.body.removeChild(S),H&&H.parentNode===document.body&&(H.classList.remove("ytls-fade-in"),H.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(H)&&document.body.removeChild(H),H=null,document.removeEventListener("click",bt,!0),document.removeEventListener("keydown",Ze)},300)))},Zn=function(){o&&(l("Loading window position from IndexedDB"),Ai("windowPosition").then(d=>{let h=oa.safeParse(d);if(h.success){let S=h.data;o.style.left=`${S.x}px`,o.style.top=`${S.y}px`,o.style.right="auto",o.style.bottom="auto",typeof S.width=="number"&&S.width>0?o.style.width=`${S.width}px`:(o.style.width=`${fi}px`,l(`No stored window width found, using default width ${fi}px`)),typeof S.height=="number"&&S.height>0?o.style.height=`${S.height}px`:(o.style.height=`${hi}px`,l(`No stored window height found, using default height ${hi}px`));let I=P();ve(I,S.x,S.y),l("Restored window position from IndexedDB:",me())}else h.success?l("No window position found in IndexedDB, applying default size and leaving default position"):l("Window position in IndexedDB failed validation:",h.error.message,"warn"),o.style.width=`${fi}px`,o.style.height=`${hi}px`,J(null);Tn();let b=P();b&&(b.width||b.height)&&ve(b),Le?.()}).catch(d=>{l("failed to load pane position from IndexedDB:",d,"warn"),Tn();let h=P();h&&(h.width||h.height)&&J({x:Math.max(0,Math.round(h.left)),y:0,width:Math.round(h.width),height:Math.round(h.height)}),Le?.()}))},eo=function(){if(!o)return;let d=P();if(!d)return;let h={x:Math.max(0,Math.round(d.left)),y:Math.max(0,Math.round(d.top)),width:Math.round(d.width),height:Math.round(d.height)},b=me();if(b&&b.x===h.x&&b.y===h.y&&b.width===h.width&&b.height===h.height){l("Skipping window position save; position and size unchanged");return}J({...h}),l(`Saving window position and size to IndexedDB: x=${h.x}, y=${h.y}, width=${h.width}, height=${h.height}`),Ho("windowPosition",h),wn({type:"window_position_updated",position:h,timestamp:Date.now()})},jo=function(d,h){d.addEventListener("dblclick",b=>{b.preventDefault(),b.stopPropagation(),o&&(o.style.width="300px",o.style.height="300px",eo(),qo())}),d.addEventListener("mousedown",b=>{b.preventDefault(),b.stopPropagation(),Bt=!0,Jt=h,Wr=b.clientX,Kr=b.clientY;let S=o.getBoundingClientRect();En=S.width,Mn=S.height,Uo=S.left,Vo=S.top,Yr=document.documentElement.clientWidth,Qr=document.documentElement.clientHeight,h==="top-left"||h==="bottom-right"?document.body.style.cursor="nwse-resize":document.body.style.cursor="nesw-resize"})},Jr=function(){if(!s||!Wt)return;let{scrollTop:d,scrollHeight:h,clientHeight:b}=s;if(h<=b)return;let S=Math.max(30,b/h*b),I=d/(h-b)*(b-S);Wt.style.height=`${S}px`,Wt.style.top=`${I}px`},Zr=function(){qe&&(Ii===null&&(Ii=requestAnimationFrame(()=>{Ii=null,Jr()})),qe.classList.add("ytls-scrollbar-visible"),mt&&clearTimeout(mt),mt=setTimeout(()=>{qe?.classList.remove("ytls-scrollbar-visible"),mt=null},500))},qo=function(){if(o&&u&&v&&s){let d=o.getBoundingClientRect(),h=u.getBoundingClientRect(),b=v.getBoundingClientRect(),S=d.height-(h.height+b.height);s.style.maxHeight=S>0?S+"px":"0px",s.style.overflowY=S>0?"auto":"hidden"}};if(document.querySelectorAll("#ytls-pane").forEach(d=>d.remove()),!document.getElementById("ytls-styles")){let d=document.createElement("style");d.id="ytls-styles",d.textContent=Ua,document.head.appendChild(d)}o=document.createElement("div"),u=document.createElement("div"),s=document.createElement("ul"),v=document.createElement("div"),f=document.createElement("span"),E=document.createElement("span"),M=document.createElement("span"),M.classList.add("ytls-backup-indicator"),M.style.cursor="pointer",M.style.backgroundColor="#666",M.onclick=d=>{d.stopPropagation(),Ie("drive")},s.addEventListener("mouseenter",()=>{ln=!0,qn=!1}),s.addEventListener("mouseleave",()=>{ln=!1;try{Pi()}catch{}if(qn)return;vt(!1);let d=null;if(document.activeElement instanceof HTMLInputElement&&s.contains(document.activeElement)&&(d=document.activeElement.closest("li")?.dataset.guid??null),Or(),d){let b=Ee().find(S=>S.dataset.guid===d)?.querySelector("input");if(b)try{b.focus({preventScroll:!0})}catch{}}}),o.id="ytls-pane",u.id="ytls-pane-header",u.addEventListener("dblclick",d=>{let h=d.target instanceof Element?d.target:null;if(h){let b=h;for(;b&&b!==o;){if(window.getComputedStyle(b).cursor==="pointer")return;b=b.parentElement}}d.preventDefault(),Ei(!1)});let r=d=>{try{d.stopPropagation()}catch{}};["click","dblclick","mousedown","pointerdown","touchstart","wheel"].forEach(d=>{o.addEventListener(d,r)}),o.addEventListener("keydown",d=>{try{d.stopPropagation()}catch{}}),o.addEventListener("keyup",d=>{try{d.stopPropagation()}catch{}}),o.addEventListener("focus",d=>{try{d.stopPropagation()}catch{}},!0),o.addEventListener("blur",d=>{try{d.stopPropagation()}catch{}},!0),E.textContent=`v${Jo}`,E.classList.add("ytls-version-display");let c=document.createElement("span");c.style.display="inline-flex",c.style.alignItems="center",c.style.gap="6px",c.appendChild(E),c.appendChild(M),f.id="ytls-current-time",f.textContent="\u2014",f.style.cursor="default",Qe(f,()=>{let d=Z(),{isLive:h}=d?d.getVideoData()||{isLive:!1}:{isLive:!1};return h?"Skip to live":""}),p=document.createElement("span"),p.id="ytls-playback-speed",p.textContent="1x",p.style.cursor="pointer",p.style.userSelect="none",Qe(p,()=>`Current playback speed. Click to toggle between 1x and ${qt(g)}x.`),p.onclick=()=>{wr()},p.addEventListener("mousedown",d=>{d.stopPropagation()}),p.addEventListener("click",d=>{d.stopPropagation()}),f.onclick=()=>{let d=Z();if(!d)return;let{isLive:h}=d.getVideoData()||{isLive:!1};h&&(Lt=!0,d.seekToLiveHead(),setTimeout(()=>{Lt=!1},500))};let x=d=>{f.style.cursor=d?"pointer":"default"};A(),ce&&clearInterval(ce),ce=setInterval(A,1e3),v.id="ytls-buttons";let T=(d,h)=>()=>{d.classList.remove("ytls-fade-in"),d.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(d)&&document.body.removeChild(d),h&&h()},300)},w=d=>h=>{h.key==="Escape"&&(h.preventDefault(),h.stopPropagation(),d())},B=d=>{setTimeout(()=>{document.addEventListener("keydown",d)},0)},L=(d,h)=>b=>{d.contains(b.target)||h()},C=d=>{setTimeout(()=>{document.addEventListener("click",d,!0)},0)};[{id:"add",icon:"alarm-plus",title:"Add timestamp",action:()=>{if(yt())return;let d=typeof xn<"u"?xn:0,h=Z(),b=h?Math.floor(h.getCurrentTime()+d):0;if(!Number.isFinite(b))return;let S=Xn(b,"");S&&S.focus()}},{id:"settings",icon:"settings",title:"Settings",action:()=>Ie()},{id:"copy",icon:"clipboard",title:"Copy timestamps to clipboard",action:function(d){if(yt()){Oe(this,"circle-x",20),setTimeout(()=>{Oe(this,"clipboard",20)},2e3);return}let h=yi(),b=Math.max(gt(),0);if(h.length===0){Oe(this,"circle-x",20),setTimeout(()=>{Oe(this,"clipboard",20)},2e3);return}let S=d.ctrlKey,I=h.map(U=>{let D=Vt(U.start,b);return S?`${D} ${U.comment} <!-- guid:${U.guid} -->`.trimStart():`${D} ${U.comment}`}).join(`
`);navigator.clipboard.writeText(I).then(()=>{Oe(this,"circle-check",20),setTimeout(()=>{Oe(this,"clipboard",20)},2e3)}).catch(U=>{l("Failed to copy timestamps: ",U,"error"),Oe(this,"circle-x",20),setTimeout(()=>{Oe(this,"clipboard",20)},2e3)})}},{id:"offset",icon:"clock-plus",title:"Offset all timestamps",action:()=>{if(yt())return;if(Ee().length===0){alert("No timestamps available to offset.");return}let h=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(h===null)return;let b=h.trim();if(b.length===0)return;let S=Number.parseInt(b,10);if(!Number.isFinite(S)){alert("Please enter a valid integer number of seconds.");return}S!==0&&zr(S,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{id:"delete",icon:"trash",title:"Delete all timestamps for current video",action:async()=>{let d=Si();if(!d){alert("Unable to determine current video ID.");return}let h=document.createElement("div");h.id="ytls-delete-all-modal",h.classList.remove("ytls-fade-out"),h.classList.add("ytls-fade-in");let b=document.createElement("p");b.textContent="Hold the button to delete all timestamps for:",b.style.marginBottom="10px";let S=document.createElement("p");S.textContent=d,S.style.fontFamily="monospace",S.style.fontSize="12px",S.style.marginBottom="15px",S.style.color="#aaa";let I=document.createElement("button");I.classList.add("ytls-save-modal-button"),I.style.background="#d32f2f",I.style.position="relative",I.style.overflow="hidden";let U=null,D=0,G=null,R=document.createElement("div");R.style.position="absolute",R.style.left="0",R.style.top="0",R.style.height="100%",R.style.width="0%",R.style.background="#ff6b6b",R.style.transition="none",R.style.pointerEvents="none",I.appendChild(R);let _=document.createElement("span");_.textContent="Hold to Delete All",_.style.position="relative",_.style.zIndex="1",I.appendChild(_);let oe=()=>{if(!D)return;let Zt=Date.now()-D,at=Math.min(Zt/5e3*100,100);R.style.width=`${at}%`,at<100&&(G=requestAnimationFrame(oe))},ee=()=>{U&&(clearTimeout(U),U=null),G&&(cancelAnimationFrame(G),G=null),D=0,R.style.width="0%",_.textContent="Hold to Delete All"};I.onmousedown=()=>{D=Date.now(),_.textContent="Deleting...",G=requestAnimationFrame(oe),U=setTimeout(async()=>{ee(),h.classList.remove("ytls-fade-in"),h.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(h)&&document.body.removeChild(h);try{await Vr(d),Mi()}catch(Zt){l("Failed to delete all timestamps:",Zt,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},I.onmouseup=ee,I.onmouseleave=ee;let Be=null,et=null,Bn=T(h,()=>{ee(),Be&&document.removeEventListener("keydown",Be),et&&document.removeEventListener("click",et,!0)});Be=w(Bn),et=L(h,Bn);let fn=document.createElement("button");fn.textContent="Cancel",fn.classList.add("ytls-save-modal-cancel-button"),fn.onclick=Bn,h.appendChild(b),h.appendChild(S),h.appendChild(I),h.appendChild(fn),document.body.appendChild(h),B(Be),C(et)}}].forEach(d=>{let h=document.createElement("button");Oe(h,d.icon,20),Qe(h,d.title),h.classList.add("ytls-main-button"),d.id==="copy"?h.onclick=function(b){d.action.call(this,b)}:h.onclick=d.action,d.id==="settings"&&(bo=h),v.appendChild(h)});let It=document.createElement("button");ie(It,"device-floppy","Save"),It.classList.add("ytls-file-operation-button"),It.onclick=()=>{let d=document.createElement("div");d.id="ytls-save-modal",d.classList.remove("ytls-fade-out"),d.classList.add("ytls-fade-in");let h=document.createElement("p");h.textContent="Save as:";let b=null,S=null,I=T(d,()=>{b&&document.removeEventListener("keydown",b),S&&document.removeEventListener("click",S,!0)});b=w(I),S=L(d,I);let U=document.createElement("button");U.textContent="JSON",U.classList.add("ytls-save-modal-button"),U.onclick=()=>{b&&document.removeEventListener("keydown",b),S&&document.removeEventListener("click",S,!0),T(d,()=>Gr("json"))()};let D=document.createElement("button");D.textContent="Plain Text",D.classList.add("ytls-save-modal-button"),D.onclick=()=>{b&&document.removeEventListener("keydown",b),S&&document.removeEventListener("click",S,!0),T(d,()=>Gr("text"))()};let G=document.createElement("button");G.textContent="Cancel",G.classList.add("ytls-save-modal-cancel-button"),G.onclick=I,d.appendChild(h),d.appendChild(U),d.appendChild(D),d.appendChild(G),document.body.appendChild(d),B(b),C(S)};let Sn=document.createElement("button");ie(Sn,"folder-open","Load"),Sn.classList.add("ytls-file-operation-button"),Sn.onclick=()=>{let d=document.createElement("div");d.id="ytls-load-modal",d.classList.remove("ytls-fade-out"),d.classList.add("ytls-fade-in");let h=document.createElement("p");h.textContent="Load from:";let b=null,S=null,I=T(d,()=>{b&&document.removeEventListener("keydown",b),S&&document.removeEventListener("click",S,!0)});b=w(I),S=L(d,I);let U=document.createElement("button");U.textContent="File",U.classList.add("ytls-save-modal-button"),U.onclick=()=>{let R=document.createElement("input");R.type="file",R.accept=".json,.txt",R.classList.add("ytls-hidden-file-input"),R.onchange=_=>{let oe=_.target.files?.[0];if(!oe)return;b&&document.removeEventListener("keydown",b),S&&document.removeEventListener("click",S,!0),I();let ee=new FileReader;ee.onload=()=>{let Be=String(ee.result).trim();_r(Be)},ee.readAsText(oe)},R.click()};let D=document.createElement("button");D.textContent="Clipboard",D.classList.add("ytls-save-modal-button"),D.onclick=async()=>{b&&document.removeEventListener("keydown",b),S&&document.removeEventListener("click",S,!0),T(d,async()=>{try{let R=await navigator.clipboard.readText();R?_r(R.trim()):alert("Clipboard is empty.")}catch(R){l("Failed to read from clipboard: ",R,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let G=document.createElement("button");G.textContent="Cancel",G.classList.add("ytls-save-modal-cancel-button"),G.onclick=I,d.appendChild(h),d.appendChild(U),d.appendChild(D),d.appendChild(G),document.body.appendChild(d),B(b),C(S)};let Xt=document.createElement("button");ie(Xt,"file-export","Export"),Xt.classList.add("ytls-file-operation-button"),Xt.onclick=async()=>{try{await $l()}catch{alert("Failed to export data: Could not read from database.")}};let An=document.createElement("button");ie(An,"file-import","Import"),An.classList.add("ytls-file-operation-button"),An.onclick=()=>{let d=document.createElement("input");d.type="file",d.accept=".json",d.classList.add("ytls-hidden-file-input"),d.onchange=h=>{let b=h.target.files?.[0];if(!b)return;let S=new FileReader;S.onload=()=>{try{let I=JSON.parse(String(S.result)),U=[];for(let D in I)if(Object.prototype.hasOwnProperty.call(I,D)&&D.startsWith("ytls-")){let G=D.substring(5),R=I[D];if(R&&typeof R.video_id=="string"&&Array.isArray(R.timestamps)){let _=R.timestamps.map(ee=>({...ee,guid:ee.guid||crypto.randomUUID()})),oe=Fl(G,_).then(()=>l(`Imported ${G} to IndexedDB`)).catch(ee=>l(`Failed to import ${G} to IndexedDB:`,ee,"error"));U.push(oe)}else l(`Skipping key ${D} during import due to unexpected data format.`,"warn")}Promise.all(U).then(()=>{Mi()}).catch(D=>{alert("An error occurred during import to IndexedDB. Check console for details."),l("Overall import error:",D,"error")})}catch(I){alert(`Failed to import data. Please ensure the file is in the correct format.
`+I.message),l("Import error:",I,"error")}},S.readAsText(b)},d.click()},s.onclick=d=>{Hr(d)},s.ontouchstart=d=>{Hr(d)},o.style.position="fixed",o.style.bottom="0",o.style.right="0",o.style.transition="none",Zn(),setTimeout(()=>Tn(),10);let Gt=!1,Oo=0,Fo=0,No=0,mn=0,Go=0,j=0,F=null,pe=!1;o.addEventListener("mousedown",d=>{let h=d.target;if(!(h instanceof Element)||h instanceof HTMLInputElement||h instanceof HTMLTextAreaElement||h instanceof Element&&(h.closest("#ytls-playback-speed-group")||h.closest("#ytls-playback-speed"))||h!==u&&!u.contains(h)&&window.getComputedStyle(h).cursor==="pointer")return;Gt=!0,pe=!1;let b=o.getBoundingClientRect();Oo=d.clientX-b.left,Fo=d.clientY-b.top,No=b.width,mn=b.height,Go=document.documentElement.clientWidth,j=document.documentElement.clientHeight,o.style.transition="none"}),document.addEventListener("mousemove",xo=d=>{if(!Gt)return;pe=!0;let h=d.clientX,b=d.clientY;F===null&&(F=requestAnimationFrame(()=>{if(F=null,!Gt)return;let S=Math.max(0,Math.min(h-Oo,Go-No)),I=Math.max(0,Math.min(b-Fo,j-mn));o.style.left=`${S}px`,o.style.top=`${I}px`,o.style.right="auto",o.style.bottom="auto"}))}),document.addEventListener("mouseup",ko=()=>{if(!Gt)return;Gt=!1,F!==null&&(cancelAnimationFrame(F),F=null);let d=pe;setTimeout(()=>{pe=!1},50),Tn(),setTimeout(()=>{d&&eo()},200)}),o.addEventListener("dragstart",d=>d.preventDefault());let X=document.createElement("div"),he=document.createElement("div"),Ve=document.createElement("div"),rt=document.createElement("div");X.id="ytls-resize-tl",he.id="ytls-resize-tr",Ve.id="ytls-resize-bl",rt.id="ytls-resize-br";let Bt=!1,Wr=0,Kr=0,En=0,Mn=0,Uo=0,Vo=0,Yr=0,Qr=0,Ln=null,Jt=null;jo(X,"top-left"),jo(he,"top-right"),jo(Ve,"bottom-left"),jo(rt,"bottom-right"),document.addEventListener("mousemove",d=>{if(!Bt||!o||!Jt)return;let h=d.clientX,b=d.clientY;Ln===null&&(Ln=requestAnimationFrame(()=>{if(Ln=null,!Bt||!o||!Jt)return;let S=h-Wr,I=b-Kr,U=Yr,D=Qr,G=En,R=Mn,_=Uo,oe=Vo;Jt==="bottom-right"?(G=Math.max(200,Math.min(800,En+S)),R=Math.max(250,Math.min(D,Mn+I))):Jt==="top-left"?(G=Math.max(200,Math.min(800,En-S)),_=Uo+S,R=Math.max(250,Math.min(D,Mn-I)),oe=Vo+I):Jt==="top-right"?(G=Math.max(200,Math.min(800,En+S)),R=Math.max(250,Math.min(D,Mn-I)),oe=Vo+I):Jt==="bottom-left"&&(G=Math.max(200,Math.min(800,En-S)),_=Uo+S,R=Math.max(250,Math.min(D,Mn+I))),_=Math.max(0,Math.min(_,U-G)),oe=Math.max(0,Math.min(oe,D-R)),o.style.width=`${G}px`,o.style.height=`${R}px`,o.style.left=`${_}px`,o.style.top=`${oe}px`,o.style.right="auto",o.style.bottom="auto"}))}),document.addEventListener("mouseup",()=>{Bt&&(Bt=!1,Ln!==null&&(cancelAnimationFrame(Ln),Ln=null),Jt=null,document.body.style.cursor="",ae(!0))});let _o=null;window.addEventListener("resize",To=()=>{_o&&clearTimeout(_o),_o=setTimeout(()=>{ae(!0),Le?.(),_o=null},200)}),u.appendChild(f);let In=document.createElement("span");In.id="ytls-playback-speed-group",In.style.display="inline-flex",In.style.alignItems="center",In.style.marginLeft="4px",p&&In.appendChild(p),u.appendChild(In),u.appendChild(c);let Li=document.createElement("div");Li.id="ytls-list-wrapper",qe=document.createElement("div"),qe.className="ytls-scrollbar-track",Wt=document.createElement("div"),Wt.className="ytls-scrollbar-thumb",qe.append(Wt),Li.append(s,qe);let $o=document.createElement("div");$o.id="ytls-content",$o.append(Li),$o.append(v),o.append(u,$o,X,he,Ve,rt);let Xr="";o.addEventListener("mousemove",d=>{if(Gt||Bt)return;let h=o.getBoundingClientRect(),b=20,S=d.clientX,I=d.clientY,U=S-h.left<=b,D=h.right-S<=b,G=I-h.top<=b,R=h.bottom-I<=b,_="";G&&U||R&&D?_="nwse-resize":(G&&D||R&&U)&&(_="nesw-resize"),_!==Xr&&(Xr=_,document.body.style.cursor=_)});let Ii=null;if(qe.addEventListener("mouseenter",()=>{mt&&(clearTimeout(mt),mt=null),qe.classList.add("ytls-scrollbar-visible")}),qe.addEventListener("mouseleave",()=>{gi||(mt=setTimeout(()=>{qe?.classList.remove("ytls-scrollbar-visible"),mt=null},500))}),Wt.addEventListener("mousedown",d=>{if(!s)return;d.preventDefault(),d.stopPropagation(),gi=!0;let h=d.clientY,b=s.scrollTop,{scrollHeight:S,clientHeight:I}=s,U=Math.max(30,I/S*I),D=S-I,G=I-U;function R(oe){if(!s)return;let ee=oe.clientY-h;s.scrollTop=Math.max(0,Math.min(D,b+ee*(D/G))),Jr()}function _(){gi=!1,document.removeEventListener("mousemove",R),document.removeEventListener("mouseup",_),qe?.matches(":hover")||(mt=setTimeout(()=>{qe?.classList.remove("ytls-scrollbar-visible"),mt=null},500))}document.addEventListener("mousemove",R),document.addEventListener("mouseup",_)}),o.addEventListener("mouseenter",()=>{ln=!0,Zr()}),s.addEventListener("scroll",Zr),o.addEventListener("mouseleave",()=>{!Bt&&!Gt&&(document.body.style.cursor=""),ln=!1;try{Pi()}catch{}try{vt(!1)}catch{}}),Le=qo,setTimeout(()=>{if(qo(),o&&u&&v&&s){let d=40,h=Ee();if(h.length>0)d=h[0].offsetHeight;else{let b=document.createElement("li");b.style.visibility="hidden",b.style.position="absolute",b.textContent="00:00 Example",s.appendChild(b),d=b.offsetHeight,s.removeChild(b)}ne(u.offsetHeight+v.offsetHeight+d),o.style.minHeight=W()+"px"}},0),ht){try{ht.disconnect()}catch{}ht=null}ht=new ResizeObserver(qo),ht.observe(o),_n||document.addEventListener("pointerdown",_n=()=>{Er=Date.now()},!0),$n||document.addEventListener("pointerup",$n=()=>{},!0)}finally{vi=!1}}}async function Yl(){if(!o)return;if(document.querySelectorAll("#ytls-pane").forEach(m=>{m!==o&&(l("Removing duplicate pane element from DOM"),m.remove())}),document.body.contains(o)){l("Pane already in DOM, skipping append");return}await Wl(),nl(jl),ol(_l),pr(Ho),mr(Ai),il(Ti),Zs(M),await fr(),await hl(),await an(),gr();let c=document.querySelectorAll("#ytls-pane");if(c.length>0&&(l(`WARNING: Found ${c.length} existing pane(s) in DOM, removing all`),c.forEach(m=>m.remove())),document.body.contains(o)){l("ERROR: Pane already in body, aborting append");return}if(document.body.appendChild(o),l("Pane successfully appended to DOM"),be(),Ae&&(clearTimeout(Ae),Ae=null),Ae=setTimeout(()=>{Te(),Le?.(),ye(),ae(!0),Ae=null},450),ft){try{ft.disconnect()}catch{}ft=null}ft=new MutationObserver(()=>{let m=document.querySelectorAll("#ytls-pane");m.length>1&&(l(`CRITICAL: Multiple panes detected (${m.length}), removing duplicates`),m.forEach((x,k)=>{(k>0||o&&x!==o)&&x.remove()}))}),ft.observe(document.body,{childList:!0})}function $r(r=0){if(document.getElementById("ytls-header-button")){Nt();return}let c=document.querySelector("#logo");if(!c||!c.parentElement){r<10&&setTimeout(()=>$r(r+1),300);return}let m=document.createElement("button");m.id="ytls-header-button",m.type="button",m.className="ytls-header-button",Qe(m,"Toggle Timekeeper UI"),m.setAttribute("aria-label","Toggle Timekeeper UI");let x=document.createElement("img");x.src=Zo,x.alt="",x.decoding="async",m.appendChild(x),Kt=x,m.addEventListener("mouseenter",()=>{Kt&&(wo=!0,Kt.src=Va)}),m.addEventListener("mouseleave",()=>{Kt&&(wo=!1,Nt())}),m.addEventListener("click",()=>{o&&!document.body.contains(o)&&(l("Pane not in DOM, re-appending before toggle"),document.body.appendChild(o)),Ei()}),c.insertAdjacentElement("afterend",m),Nt(),l("Timekeeper header button added next to YouTube logo")}function qr(){if(Y())return;se(!0);let r=history.pushState,c=history.replaceState;function m(){try{let x=new Event("locationchange");window.dispatchEvent(x)}catch{}}history.pushState=function(){let x=r.apply(this,arguments);return m(),x},history.replaceState=function(){let x=c.apply(this,arguments);return m(),x},window.addEventListener("popstate",m),window.addEventListener("locationchange",()=>{window.location.href!==$&&l("Location changed (locationchange event) \u2014 deferring UI update until navigation finish")})}async function Mi(){if(!a()){Pl();return}N(window.location.href),document.querySelectorAll("#ytls-pane").forEach((c,m)=>{(m>0||o&&c!==o)&&c.remove()}),await Ge(),await Kl(),Pe=Si();let r=document.title;l("Page Title:",r),l("Video ID:",Pe),l("Current URL:",window.location.href),wi(!0),Yn(),Ue(),await Ti(),Ue(),wi(!1),l("Timestamps loaded and UI unlocked for video:",Pe),await Yl();try{vt(!0)}catch{}$r(),Ol()}qr(),window.addEventListener("yt-navigate-start",()=>{l("Navigation started (yt-navigate-start event fired)"),Po(),a()&&o&&s&&(l("Locking UI and showing loading state for navigation"),wi(!0))}),jn=r=>{if(!r.repeat&&!r.ctrlKey&&!r.altKey&&!r.metaKey&&!r.shiftKey&&(r.key==="z"||r.key==="Z")){if(bl(r.target))return;wr()&&(r.preventDefault(),l("Playback speed toggled via keyboard shortcut (Z)"));return}r.ctrlKey&&r.altKey&&r.shiftKey&&(r.key==="T"||r.key==="t")&&(r.preventDefault(),Ei(),l("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",jn),window.addEventListener("pagehide",Po),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&Po()}),window.addEventListener("yt-navigate-finish",()=>{l("Navigation finished (yt-navigate-finish event fired)"),window.location.href!==$?Mi():l("Navigation finished but URL already handled, skipping.")}),qr(),l("Timekeeper initialized and waiting for navigation events")})();})();

