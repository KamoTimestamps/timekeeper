// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      5.0.27
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

(()=>{var Nl=Object.defineProperty;var Gl=(e,t)=>{for(var n in t)Nl(e,n,{get:t[n],enumerable:!0})};var no=class extends Error{},Xe=(e,t)=>{throw new no(`${e||"value"}: expected ${t}`)};function kt(e){let t={run:e,parse:n=>e(n,""),safeParse:n=>{try{return{success:!0,data:e(n,"")}}catch(r){if(r instanceof no)return{success:!1,error:r};throw r}},array:()=>Ul(t)};return t}var Qi=e=>typeof e=="object"&&e!==null&&!Array.isArray(e);function ze(){return kt((e,t)=>typeof e=="string"?e:Xe(t,"string"))}function Ko(){return kt((e,t)=>typeof e=="boolean"?e:Xe(t,"boolean"))}function wt(e={}){return kt((t,n)=>typeof t!="number"||Number.isNaN(t)?Xe(n,"number"):(e.finite&&!Number.isFinite(t)&&Xe(n,"finite number"),e.int&&!Number.isInteger(t)&&Xe(n,"integer"),e.nonnegative&&t<0&&Xe(n,"number >= 0"),e.positive&&t<=0&&Xe(n,"number > 0"),e.min!==void 0&&t<e.min&&Xe(n,`number >= ${e.min}`),e.max!==void 0&&t>e.max&&Xe(n,`number <= ${e.max}`),t))}function qe(e){return kt((t,n)=>t===void 0?void 0:e.run(t,n))}function Wo(e){return kt((t,n)=>t===null?null:e.run(t,n))}function Cn(e,t){return kt((n,r)=>{try{return e.run(n,r)}catch(a){if(a instanceof no)return t;throw a}})}function Ul(e){return kt((t,n)=>Array.isArray(t)?t.map((r,a)=>e.run(r,`${n}[${a}]`)):Xe(n,"array"))}function _l(e){return kt((t,n)=>{if(!Qi(t))return Xe(n,"object");let r={};for(let a of Object.keys(t))r[a]=e.run(t[a],n?`${n}.${a}`:a);return r})}function xt(e){let t=kt((n,r)=>{if(!Qi(n))return Xe(r,"object");let a={};for(let o of Object.keys(e)){let c=e[o].run(n[o],r?`${r}.${o}`:o);c!==void 0&&(a[o]=c)}return a});return Object.assign(t,{extend:n=>xt({...e,...n}),partial:()=>{let n={};for(let r of Object.keys(e))n[r]=qe(e[r]);return xt(n)}})}var Vl=kt((e,t)=>typeof e=="string"&&e.length>0?e:Xe(t,"non-empty string")),Yo=xt({guid:Vl,start:wt({finite:!0,nonnegative:!0}),comment:ze(),write_counter:qe(wt({int:!0,positive:!0})),deleted_at:Cn(qe(wt()),void 0)}),oo=Yo.array(),Ir=Yo.extend({video_id:ze(),device_id:qe(ze())}),Xi=xt({x:wt({finite:!0}),y:wt({finite:!0}),width:qe(wt({finite:!0,positive:!0})),height:qe(wt({finite:!0,positive:!0}))}),Qo=xt({video_id:ze(),timestamps:oo}),Ji=_l(Qo),Yi=xt({isSignedIn:Cn(Ko(),!1),accessToken:Cn(Wo(ze()),null),userName:Cn(Wo(ze()),null),email:Cn(Wo(ze()),null)}),Br=Cn(kt((e,t)=>{if(typeof e=="string"){let n;try{n=JSON.parse(e)}catch{return Xe(t,"valid JSON string for auth state")}return Yi.run(n,t)}return Yi.run(e,t)}),{isSignedIn:!1,accessToken:null,userName:null,email:null}),jl=xt({autoBackupEnabled:Ko(),autoBackupIntervalMinutes:wt({int:!0,min:5,max:1440}),lastAutoBackupAt:qe(Wo(wt({int:!0,positive:!0})))}),Dr=jl;var Zi=`<svg
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
</svg>`;var ea=`<svg
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
</svg>`;var ta=`<svg
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
</svg>`;var na=`<svg
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
</svg>`;var oa=`<svg
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
</svg>`;var ra=`<svg
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
</svg>`;var ia=`<svg
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-settings"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065" />
  <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-clock-plus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20.984 12.535a9 9 0 1 0 -8.468 8.45" />
  <path d="M16 19h6" />
  <path d="M19 16v6" />
  <path d="M12 7v5l3 3" />
</svg>`;var la=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="currentColor"
  class="icon icon-tabler icons-tabler-filled icon-tabler-current-location"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 1a1 1 0 0 1 1 1v1.055a9.004 9.004 0 0 1 7.946 7.945h1.054a1 1 0 0 1 0 2h-1.055a9.004 9.004 0 0 1 -7.944 7.945l-.001 1.055a1 1 0 0 1 -2 0v-1.055a9.004 9.004 0 0 1 -7.945 -7.944l-1.055 -.001a1 1 0 0 1 0 -2h1.055a9.004 9.004 0 0 1 7.945 -7.945v-1.055a1 1 0 0 1 1 -1m0 4a7 7 0 1 0 0 14a7 7 0 0 0 0 -14m0 3a4 4 0 1 1 -4 4l.005 -.2a4 4 0 0 1 3.995 -3.8" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-player-record"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 12a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-x"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M10 10l4 4m0 -4l-4 4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-check"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M9 12l2 2l4 -4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-cloud"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M6.657 18c-2.572 0 -4.657 -2.007 -4.657 -4.483c0 -2.475 2.085 -4.482 4.657 -4.482c.393 -1.762 1.794 -3.2 3.675 -3.773c1.88 -.572 3.956 -.193 5.444 1c1.488 1.19 2.162 3.007 1.77 4.769h.99c1.913 0 3.464 1.56 3.464 3.486c0 1.927 -1.551 3.487 -3.465 3.487h-11.878" />
</svg>`;var fa=`<svg
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-folder-open"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-export"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v5m-5 6h7m-3 -3l3 3l-3 3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-import"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M5 13v-8a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5.5m-9.5 -2h7m-3 -3l3 3l-3 3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-spreadsheet"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
  <path d="M8 11h8v7h-8l0 -7" />
  <path d="M8 15h8" />
  <path d="M11 11v7" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-login"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
  <path d="M21 12h-13l3 -3" />
  <path d="M11 15l-3 -3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-logout"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
  <path d="M9 12h12l-3 -3" />
  <path d="M18 15l3 -3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-refresh"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
  <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-alert-triangle"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 9v4" />
  <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0" />
  <path d="M12 16h.01" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-database"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M4 6a8 3 0 1 0 16 0a8 3 0 1 0 -16 0" />
  <path d="M4 6v6a8 3 0 0 0 16 0v-6" />
  <path d="M4 12v6a8 3 0 0 0 16 0v-6" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-server"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 7a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3" />
  <path d="M3 15a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -2" />
  <path d="M7 8l0 .01" />
  <path d="M7 16l0 .01" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-world"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
  <path d="M3.6 9h16.8" />
  <path d="M3.6 15h16.8" />
  <path d="M11.5 3a17 17 0 0 0 0 18" />
  <path d="M12.5 3a17 17 0 0 1 0 18" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-plug-connected"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M7 12l5 5l-1.5 1.5a3.536 3.536 0 1 1 -5 -5l1.5 -1.5" />
  <path d="M17 12l-5 -5l1.5 -1.5a3.536 3.536 0 1 1 5 5l-1.5 1.5" />
  <path d="M3 21l2.5 -2.5" />
  <path d="M18.5 5.5l2.5 -2.5" />
  <path d="M10 11l-2 2" />
  <path d="M13 14l-2 2" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-key"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0" />
  <path d="M15 9h.01" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-x"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M18 6l-12 12" />
  <path d="M6 6l12 12" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-indent-increase"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 6l-11 0" />
  <path d="M20 12l-7 0" />
  <path d="M20 18l-11 0" />
  <path d="M4 8l4 4l-4 4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-indent-decrease"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 6l-7 0" />
  <path d="M20 12l-9 0" />
  <path d="M20 18l-7 0" />
  <path d="M8 8l-4 4l4 4" />
</svg>`;var Tc={plus:Zi,"alarm-plus":ea,minus:ta,"circle-plus":na,"circle-minus":oa,trash:ra,clipboard:ia,settings:aa,"clock-plus":sa,"current-location":la,"player-record":ca,"circle-x":ua,"circle-check":da,"adjustments-horizontal":pa,cloud:ma,"device-floppy":fa,"folder-open":ha,"file-export":ga,"file-import":va,"file-spreadsheet":ya,login:ba,logout:wa,refresh:xa,"alert-triangle":ka,database:Ta,server:Sa,world:Aa,"plug-connected":Ea,key:Ma,x:La,"indent-increase":Ia,"indent-decrease":Ba},Da="http://www.w3.org/2000/svg",Sc=/^\s*<svg\s+([^>]*)>([\s\S]*?)<\/svg>\s*$/,Ac=/<([a-zA-Z][\w:-]*)([^>]*)\/>/g,Ec=/([a-zA-Z_:][\w:.-]*)="([^"]*)"/g,Ca=new Map;function Pa(e){let t={};for(let n of e.matchAll(Ec))t[n[1]]=n[2];return t}function Mc(e){return e.startsWith("data:image/svg+xml;base64,")?atob(e.slice(26)):e.startsWith("data:image/svg+xml,")?decodeURIComponent(e.slice(19)):e}function Lc(e){let t=Mc(e).match(Sc);if(!t)throw new Error("Invalid Tabler SVG source");let[,n,r]=t,a=document.createElementNS(Da,"svg"),o=Pa(n);for(let[c,s]of Object.entries(o))c!=="class"&&a.setAttribute(c,s);for(let c of r.matchAll(Ac)){let[,s,h]=c,p=document.createElementNS(Da,s),u=Pa(h);for(let[v,y]of Object.entries(u))p.setAttribute(v,y);a.appendChild(p)}return a}function Ic(e){let t=Ca.get(e);if(t)return t;let n=Lc(Tc[e]);return Ca.set(e,n),n}function ro(e,t=20){let n=Ic(e).cloneNode(!0);return n.setAttribute("width",String(t)),n.setAttribute("height",String(t)),n.setAttribute("aria-hidden","true"),n.style.pointerEvents="none",n.style.flexShrink="0",n.style.verticalAlign="middle",n}function He(e,t,n){e.replaceChildren(ro(t,n))}function ae(e,t,n,r){e.replaceChildren(ro(t,r),document.createTextNode("\xA0"+n))}var Xo="5.0.27";function l(e,...t){let n="debug",r=[...t];t.length>0&&typeof t[t.length-1]=="string"&&["debug","info","warn","error"].includes(t[t.length-1])&&(n=r.pop());let a=`[Timekeeper v${Xo}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[n](`${a} ${e}`,...r)}function Gt(e,t=e){let n=Math.floor(e/3600),r=Math.floor(e%3600/60),a=String(e%60).padStart(2,"0");return t<3600?`${t>=600?String(r).padStart(2,"0"):r}:${a}`:`${t>=36e3?String(n).padStart(2,"0"):n}:${String(r).padStart(2,"0")}:${a}`}function Ra(e,t=window.location.href){try{let n=new URL(t);return n.searchParams.set("t",`${e}s`),n.toString()}catch{return`https://www.youtube.com/watch?v=${t.search(/[?&]v=/)>=0?t.split(/[?&]v=/)[1].split(/&/)[0]:t.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${e}s`}}function mn(){let e=new Date;return e.getUTCFullYear()+"-"+String(e.getUTCMonth()+1).padStart(2,"0")+"-"+String(e.getUTCDate()).padStart(2,"0")+"--"+String(e.getUTCHours()).padStart(2,"0")+"-"+String(e.getUTCMinutes()).padStart(2,"0")+"-"+String(e.getUTCSeconds()).padStart(2,"0")}var za=`#ytls-pane {
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
`;var Jo="data:image/png;base64,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",Ha="data:image/png;base64,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";var Je=null,Pn=null,Bc=250,Bt=null,Rn=!1,Ze=null,io=[];function Dc(){return(!Je||!document.body.contains(Je))&&(Je=document.createElement("div"),Je.className="ytls-tooltip",Je.style.pointerEvents="none",document.body.appendChild(Je),window.addEventListener("scroll",Oa,!0),window.addEventListener("resize",Oa,!0)),Je}function Cc(e,t,n){let a=window.innerWidth,o=window.innerHeight,c=e.getBoundingClientRect(),s=c.width,h=c.height,p=t+10,u=n+10;p+s>a-10&&(p=t-s-10),u+h>o-10&&(u=n-h-10),p=Math.max(10,Math.min(p,a-s-10)),u=Math.max(10,Math.min(u,o-h-10)),e.style.left=`${p}px`,e.style.top=`${u}px`}function Fa(e,t){let r=window.innerWidth,a=window.innerHeight,o=t.getBoundingClientRect(),c=e.getBoundingClientRect(),s=c.width,h=c.height,p=Math.round(o.left+o.width/2-s/2),u=Math.round(o.top-h-8);u<8&&(u=Math.round(o.bottom+8)),p<8&&(p=Math.round(o.left)),p+s>r-8&&(p=Math.round(o.right-s)),p=Math.max(8,Math.min(p,r-s-8)),u=Math.max(8,Math.min(u,a-h-8)),e.style.left=`${p}px`,e.style.top=`${u}px`}function Oa(){if(!(!Je||!Bt)&&Je.classList.contains("ytls-tooltip-visible"))try{Fa(Je,Bt)}catch{}}function Pc(e=50){Ze&&(clearTimeout(Ze),Ze=null),!Rn&&(Ze=setTimeout(()=>{ao(),Ze=null},e))}function Rc(e,t,n,r){Ze&&(clearTimeout(Ze),Ze=null),Bt&&r&&Bt!==r&&Je?.classList.contains("ytls-tooltip-visible")&&Je.classList.remove("ytls-tooltip-visible"),Pn&&clearTimeout(Pn),r&&(Bt=r,Rn=!0),Pn=setTimeout(()=>{let a=Dc();a.textContent=e,a.classList.remove("ytls-tooltip-visible"),r?requestAnimationFrame(()=>{Fa(a,r),requestAnimationFrame(()=>{a.classList.add("ytls-tooltip-visible")})}):(Cc(a,t,n),requestAnimationFrame(()=>{a.classList.add("ytls-tooltip-visible")}))},Bc)}function ao(){Pn&&(clearTimeout(Pn),Pn=null),Ze&&(clearTimeout(Ze),Ze=null),Je&&Je.classList.remove("ytls-tooltip-visible"),Bt=null,Rn=!1}function Cr(){ao()}function et(e,t){let n=0,r=0,a=p=>{n=p.clientX,r=p.clientY,Ze&&(clearTimeout(Ze),Ze=null),Rn=!0,Bt=e;let u=typeof t=="function"?t():t;u&&Rc(u,n,r,e)},o=p=>{n=p.clientX,r=p.clientY},c=()=>{Bt===e&&(Rn=!1,Pc())};e.addEventListener("mouseenter",a),e.addEventListener("mousemove",o),e.addEventListener("mouseleave",c);let s=p=>{Rn=!1,Bt===e&&ao()};e.addEventListener("click",s,!0);let h=new MutationObserver(()=>{if(Bt===e)try{let p=window.getComputedStyle(e);(p.display==="none"||p.visibility==="hidden"||p.opacity==="0")&&ao()}catch{}});try{h.observe(e,{attributes:!0,attributeFilter:["class","style"]})}catch{}io.push(h),e.__tooltipCleanup=()=>{e.removeEventListener("mouseenter",a),e.removeEventListener("mousemove",o),e.removeEventListener("mouseleave",c),e.removeEventListener("click",s,!0);try{h.disconnect()}catch{}let p=io.indexOf(h);p!==-1&&io.splice(p,1),delete e.__tooltipObserver},e.__tooltipObserver=h}function Na(){for(let e of io)try{e.disconnect()}catch{}io.length=0,ao()}var Or={};Gl(Or,{addTimestamp:()=>Gc,buildExportCsvPayload:()=>Kc,buildExportPayload:()=>qc,deleteSingleTimestampFromIndexedDB:()=>jc,exportAllTimestamps:()=>Wc,exportAllTimestampsCsv:()=>Yc,loadFromIndexedDB:()=>Vc,loadGlobalSettings:()=>tr,mergeBackupData:()=>Qc,removeFromIndexedDB:()=>$c,saveGlobalSettings:()=>er,saveSingleTimestampToIndexedDB:()=>_c,saveToIndexedDB:()=>Uc});var zc="ytls-timestamps-db",Hc=4,zn="timestamps",Fe="timestamps_v2",Oe="settings",Hn=null,On=null;function fn(){if(Hn)try{return Hn.objectStoreNames,Promise.resolve(Hn)}catch(e){l("IndexedDB connection is no longer usable:",e,"warn"),Hn=null}return On||(On=Oc().then(e=>(Hn=e,On=null,e.onclose=()=>{l("IndexedDB connection closed unexpectedly","warn"),Hn=null},e.onerror=t=>{l("IndexedDB connection error:",t,"error")},e)).catch(e=>{throw On=null,e}),On)}function Ga(e,t){let n=crypto.randomUUID(),r=0,a=e.openCursor();a.onsuccess=o=>{let c=o.target.result;c?(r++,c.update({...c.value,write_counter:r,device_id:n}),c.continue()):(t.put({key:"write_counter",value:r}),t.put({key:"device_id",value:n}),l(`Lamport migration: backfilled ${r} records, device_id=${n}`))},a.onerror=()=>{l("Lamport migration: cursor error during backfill",a.error,"error")}}function Oc(){return new Promise((e,t)=>{let n=indexedDB.open(zc,Hc);n.onupgradeneeded=r=>{let a=r.target.result,o=r.oldVersion,c=r.target.transaction;if(o<1&&a.createObjectStore(zn,{keyPath:"video_id"}),o<2&&!a.objectStoreNames.contains(Oe)&&a.createObjectStore(Oe,{keyPath:"key"}),o<3){if(a.objectStoreNames.contains(zn)){l("Exporting backup before v2 migration...");let p=c.objectStore(zn).getAll();p.onsuccess=()=>{let u=Qo.array().safeParse(p.result);if(u.success&&u.data.length>0)try{let v={},y=0;u.data.forEach(z=>{if(z.timestamps.length>0){let V=oo.parse(z.timestamps);v[`ytls-${z.video_id}`]={video_id:z.video_id,timestamps:[...V].sort((M,D)=>M.start-D.start)},y+=V.length}});let E=new Blob([JSON.stringify(v,null,2)],{type:"application/json"}),B=URL.createObjectURL(E),O=document.createElement("a");O.href=B,O.download=`timekeeper-data-${mn()}.json`,O.click(),URL.revokeObjectURL(B),l(`Pre-migration backup exported: ${u.data.length} videos, ${y} timestamps`)}catch(v){l("Failed to export pre-migration backup:",v,"error")}else u.success||l("Skipping pre-migration backup: legacy data failed validation",u.error.message,"warn")}}let s=a.createObjectStore(Fe,{keyPath:"guid"});if(s.createIndex("video_id","video_id",{unique:!1}),s.createIndex("video_start",["video_id","start"],{unique:!1}),a.objectStoreNames.contains(zn)){let p=c.objectStore(zn).getAll();p.onsuccess=()=>{let u=Qo.array().safeParse(p.result);if(u.success&&u.data.length>0){let v=0;u.data.forEach(y=>{y.timestamps.length>0&&y.timestamps.forEach(E=>{s.put({guid:E.guid,video_id:y.video_id,start:E.start,comment:E.comment}),v++})}),l(`Migrated ${v} timestamps from ${u.data.length} videos to v2 store`)}else u.success||l("Skipping v1 \u2192 v2 migration: legacy data failed validation",u.error.message,"warn");o<4&&Ga(c.objectStore(Fe),c.objectStore(Oe))},a.deleteObjectStore(zn),l("Deleted old timestamps store after migration to v2")}}o===3&&Ga(c.objectStore(Fe),c.objectStore(Oe))},n.onsuccess=r=>{e(r.target.result)},n.onerror=r=>{let a=r.target.error;t(a??new Error("Failed to open IndexedDB"))}})}function Pr(e,t,n){return fn().then(r=>new Promise((a,o)=>{let c;try{c=r.transaction(e,t)}catch(p){o(new Error(`Failed to create transaction for ${e}: ${p}`));return}let s=c.objectStore(e),h;try{h=n(s)}catch(p){o(new Error(`Failed to execute operation on ${e}: ${p}`));return}h&&(h.onsuccess=()=>a(h.result),h.onerror=()=>o(h.error??new Error(`IndexedDB ${t} operation failed`))),c.oncomplete=()=>{h||a(void 0)},c.onerror=()=>o(c.error??new Error("IndexedDB transaction failed")),c.onabort=()=>o(c.error??new Error("IndexedDB transaction aborted"))}))}function Ua(e,t){let n=oo.safeParse(t);if(!n.success)return Promise.reject(new Error(`Invalid timestamp payload for ${e}`));let r=n.data;return fn().then(a=>new Promise((o,c)=>{let s;try{s=a.transaction([Fe,Oe],"readwrite")}catch(y){c(new Error(`Failed to create transaction: ${y}`));return}s.oncomplete=()=>o(),s.onerror=()=>c(new Error(`IndexedDB save failed: ${s.error?.message??"unknown"}`)),s.onabort=()=>c(new Error("IndexedDB transaction aborted"));let h=s.objectStore(Fe),p=s.objectStore(Oe),v=h.index("video_id").getAll(IDBKeyRange.only(e));v.onsuccess=()=>{try{let y=v.result??[],E=new Map(y.map(M=>[M.guid,M])),B=new Set(r.map(M=>M.guid)),O=Date.now(),z,V=p.get("write_counter");V.onsuccess=()=>{try{z=typeof V.result?.value=="number"?V.result.value:0}catch{z=0}y.forEach(M=>{!B.has(M.guid)&&!M.deleted_at&&(z++,h.put({...M,deleted_at:O,write_counter:z}))}),r.forEach(M=>{let D=E.get(M.guid);if(D&&!D.deleted_at&&D.start===M.start&&D.comment===M.comment&&D.deleted_at===M.deleted_at)h.put({guid:M.guid,video_id:e,start:M.start,comment:M.comment,write_counter:D.write_counter,deleted_at:M.deleted_at,device_id:D.device_id});else{z++;let Z=M.deleted_at??D?.deleted_at??void 0;h.put({guid:M.guid,video_id:e,start:M.start,comment:M.comment,write_counter:z,deleted_at:Z})}}),p.put({key:"write_counter",value:z})},V.onerror=()=>{l("Failed to read write_counter during save, proceeding with counter=0",V.error,"warn"),z=0,y.forEach(M=>{!B.has(M.guid)&&!M.deleted_at&&(z++,h.put({...M,deleted_at:O,write_counter:z}))}),r.forEach(M=>{let D=E.get(M.guid);if(D&&!D.deleted_at&&D.start===M.start&&D.comment===M.comment&&D.deleted_at===M.deleted_at)h.put({guid:M.guid,video_id:e,start:M.start,comment:M.comment,write_counter:D.write_counter,deleted_at:M.deleted_at,device_id:D.device_id});else{z++;let Z=M.deleted_at??D?.deleted_at??void 0;h.put({guid:M.guid,video_id:e,start:M.start,comment:M.comment,write_counter:z,deleted_at:Z})}}),p.put({key:"write_counter",value:z})}}catch(y){c(y instanceof Error?y:new Error(String(y)))}},v.onerror=()=>{let y=`Failed to load existing records for save: ${v.error?.message??"unknown"}`;l(y,v.error,"error"),c(new Error(y))}}))}function _a(e,t){let n=Yo.safeParse(t);if(!n.success)return Promise.reject(new Error(`Invalid timestamp: ${n.error.message}`));let r=n.data;return fn().then(a=>new Promise((o,c)=>{let s;try{s=a.transaction([Fe,Oe],"readwrite")}catch(v){c(new Error(`Failed to create transaction: ${v}`));return}s.oncomplete=()=>o(),s.onerror=()=>c(new Error(`IndexedDB save failed: ${s.error?.message??"unknown"}`)),s.onabort=()=>c(new Error("IndexedDB transaction aborted"));let h=s.objectStore(Fe),p=s.objectStore(Oe);h.put({guid:r.guid,video_id:e,start:r.start,comment:r.comment,write_counter:0,deleted_at:r.deleted_at});let u=p.get("write_counter");u.onsuccess=()=>{try{let v=typeof u.result?.value=="number"?u.result.value:0;h.put({guid:r.guid,video_id:e,start:r.start,comment:r.comment,write_counter:v+1,deleted_at:r.deleted_at}),p.put({key:"write_counter",value:v+1})}catch(v){c(v instanceof Error?v:new Error(String(v)))}},u.onerror=()=>{h.put({guid:r.guid,video_id:e,start:r.start,comment:r.comment,write_counter:1,deleted_at:r.deleted_at}),p.put({key:"write_counter",value:1})}}))}function Va(e){return e.length===0?Promise.resolve():fn().then(t=>new Promise((n,r)=>{let a;try{a=t.transaction([Fe,Oe],"readwrite")}catch(p){r(new Error(`Failed to create transaction: ${p}`));return}a.oncomplete=()=>n(),a.onerror=()=>r(new Error(`IndexedDB batch save failed: ${a.error?.message??"unknown"}`)),a.onabort=()=>r(new Error("IndexedDB transaction aborted"));let o=a.objectStore(Fe),c=a.objectStore(Oe),s=0;e.forEach(p=>{p.write_counter!==void 0&&p.write_counter>s&&(s=p.write_counter)}),e.forEach(p=>{let u={guid:p.guid,video_id:p.video_id,start:p.start,comment:p.comment,deleted_at:p.deleted_at};p.write_counter===void 0?(s++,u.write_counter=s):u.write_counter=p.write_counter,o.put(u)});let h=c.get("write_counter");h.onsuccess=()=>{try{let p=typeof h.result?.value=="number"?h.result.value:0,u=Math.max(s,p)+1;c.put({key:"write_counter",value:u})}catch(p){r(p instanceof Error?p:new Error(String(p)))}},h.onerror=()=>{c.put({key:"write_counter",value:s+1})}}))}function ja(e){return l(`Soft-deleting timestamp ${e}`),fn().then(t=>new Promise((n,r)=>{let a;try{a=t.transaction([Fe,Oe],"readwrite")}catch(h){r(new Error(`Failed to create transaction: ${h}`));return}a.oncomplete=()=>n(),a.onerror=()=>r(new Error(`IndexedDB delete failed: ${a.error?.message??"unknown"}`)),a.onabort=()=>r(new Error("IndexedDB transaction aborted"));let o=a.objectStore(Fe),c=a.objectStore(Oe),s=o.get(e);s.onsuccess=()=>{try{let h=s.result;if(h){let p=c.get("write_counter");p.onsuccess=()=>{try{let u=typeof p.result?.value=="number"?p.result.value:0;o.put({...h,deleted_at:Date.now(),write_counter:u+1}),c.put({key:"write_counter",value:u+1})}catch(u){r(u instanceof Error?u:new Error(String(u)))}},p.onerror=()=>{o.put({...h,deleted_at:Date.now(),write_counter:1}),c.put({key:"write_counter",value:1})}}}catch(h){r(h instanceof Error?h:new Error(String(h)))}},s.onerror=()=>{let h=`Failed to load record for deletion: ${s.error?.message??"unknown"}`;l(h,s.error,"error"),r(new Error(h))}}))}function $a(e){return fn().then(t=>new Promise((n,r)=>{let a;try{a=t.transaction([Fe],"readonly")}catch(c){let s=`Failed to create read transaction: ${c}`;l(s,c,"error"),r(new Error(s));return}a.onabort=()=>{let c=`Transaction aborted during load: ${a.error?.message??"unknown"}`;l(c,a.error,"error"),r(new Error(c))};let o=a.objectStore(Fe).index("video_id").getAll(IDBKeyRange.only(e));o.onsuccess=()=>{try{let c=o.result.filter(p=>!p.deleted_at);if(c.length===0){n(null);return}let s=c.map(p=>({guid:p.guid,start:p.start,comment:p.comment})),h=oo.safeParse(s);if(!h.success){l("Failed to parse timestamps from IndexedDB:",h.error.message,"warn"),n(null);return}n([...h.data].sort((p,u)=>p.start-u.start))}catch(c){r(c)}},o.onerror=()=>{let c=`Failed to load timestamps from IndexedDB: ${o.error?.message??"unknown error"}`;l(c,o.error,"error"),r(new Error(c))}}))}function qa(e){return fn().then(t=>new Promise((n,r)=>{let a;try{a=t.transaction([Fe,Oe],"readwrite")}catch(p){r(new Error(`Failed to create transaction: ${p}`));return}a.oncomplete=()=>n(),a.onerror=()=>r(new Error(`IndexedDB delete failed: ${a.error?.message??"unknown"}`)),a.onabort=()=>r(new Error("IndexedDB transaction aborted"));let o=a.objectStore(Fe),c=a.objectStore(Oe),h=o.index("video_id").getAll(IDBKeyRange.only(e));h.onsuccess=()=>{try{let p=h.result??[],u=Date.now(),v=c.get("write_counter");v.onsuccess=()=>{try{let y;y=typeof v.result?.value=="number"?v.result.value:0,p.forEach(E=>{E.deleted_at||(y++,o.put({...E,deleted_at:u,write_counter:y}))}),c.put({key:"write_counter",value:y})}catch(y){r(y instanceof Error?y:new Error(String(y)))}},v.onerror=()=>{let y=0;p.forEach(E=>{E.deleted_at||(y++,o.put({...E,deleted_at:u,write_counter:y}))}),c.put({key:"write_counter",value:y})}}catch(p){r(p instanceof Error?p:new Error(String(p)))}},h.onerror=()=>{let p=`Failed to load records for deletion: ${h.error?.message??"unknown"}`;l(p,h.error,"error"),r(new Error(p))}}))}function Zo(){return Pr(Fe,"readonly",e=>e.getAll()).then(e=>Array.isArray(e)?e:[])}function Wa(e,t){return Pr(Oe,"readwrite",n=>{n.put({key:e,value:t})}).then(()=>{}).catch(n=>{l(`Failed to save setting '${e}' to IndexedDB:`,n,"error")})}function Ka(e){return Pr(Oe,"readonly",t=>t.get(e)).then(t=>t?.value).catch(t=>{l(`Failed to load setting '${e}' from IndexedDB:`,t,"error")})}async function Rr({includeDeleted:e=!1}={}){let t={},n=await Zo(),r=Ir.array().safeParse(n);if(!r.success)return l("Failed to parse timestamp rows for export:",r.error.message,"warn"),{json:"{}",filename:"timekeeper-data.json",totalVideos:0,totalTimestamps:0};let o=[...e?r.data:r.data.filter(u=>!u.deleted_at)].sort((u,v)=>{let y=u.video_id.localeCompare(v.video_id);if(y!==0)return y;let E=u.start-v.start;return E!==0?E:u.guid.localeCompare(v.guid)}),c=new Map;for(let u of o)c.has(u.video_id)||c.set(u.video_id,[]),c.get(u.video_id).push({guid:u.guid,start:u.start,comment:u.comment,write_counter:u.write_counter,deleted_at:u.deleted_at});let s=Array.from(c.keys()).sort((u,v)=>u.localeCompare(v));for(let u of s){let v=c.get(u);t[`ytls-${u}`]={video_id:u,timestamps:v}}return{json:JSON.stringify(t,null,2),filename:"timekeeper-data.json",totalVideos:c.size,totalTimestamps:o.length}}async function Ya(){try{let{json:e,filename:t,totalVideos:n,totalTimestamps:r}=await Rr(),a=new Blob([e],{type:"application/json"}),o=URL.createObjectURL(a),c=document.createElement("a");c.href=o,c.download=t,c.click(),URL.revokeObjectURL(o),l(`Exported ${n} videos with ${r} timestamps`)}catch(e){throw l("Failed to export data:",e,"error"),e}}async function zr(){let e=Ir.array().safeParse((await Zo()).filter(u=>!u.deleted_at));if(!e.success||e.data.length===0){e.success||l("Failed to parse timestamp rows for CSV export:",e.error.message,"warn");let u=`Tag,Timestamp,URL
`,v=`timestamps-${mn()}.csv`;return{csv:u,filename:v,totalVideos:0,totalTimestamps:0}}let t=e.data,n=new Map;for(let u of t)n.has(u.video_id)||n.set(u.video_id,[]),n.get(u.video_id).push({start:u.start,comment:u.comment});let r=[];r.push("Tag,Timestamp,URL");let a=0,o=u=>`"${String(u).replace(/"/g,'""')}"`,c=u=>{let v=Math.floor(u/3600),y=Math.floor(u%3600/60),E=String(u%60).padStart(2,"0");return`${String(v).padStart(2,"0")}:${String(y).padStart(2,"0")}:${E}`},s=Array.from(n.keys()).sort();for(let u of s){let v=n.get(u).sort((y,E)=>y.start-E.start);for(let y of v){let E=y.comment,B=c(y.start),O=Ra(y.start,`https://www.youtube.com/watch?v=${u}`);r.push([o(E),o(B),o(O)].join(",")),a++}}let h=r.join(`
`),p=`timestamps-${mn()}.csv`;return{csv:h,filename:p,totalVideos:n.size,totalTimestamps:a}}async function Qa(){try{let{csv:e,filename:t,totalVideos:n,totalTimestamps:r}=await zr(),a=new Blob([e],{type:"text/csv;charset=utf-8;"}),o=URL.createObjectURL(a),c=document.createElement("a");c.href=o,c.download=t,c.click(),URL.revokeObjectURL(o),l(`Exported ${n} videos with ${r} timestamps (CSV)`)}catch(e){throw l("Failed to export CSV data:",e,"error"),e}}async function Hr(e,t){if(!e)throw new Error("Video ID is required");if(!t.guid||t.start==null)throw new Error("Timestamp must have GUID and start time");return _a(e,t)}async function Xa(e,t){if(!e)throw new Error("Video ID is required");if(!Array.isArray(t))throw new Error("Timestamps must be an array");return Ua(e,t)}async function Ja(e){if(!e)throw new Error("GUID is required");return ja(e)}async function Za(e){if(!e)throw new Error("Video ID is required");return qa(e)}async function es(e){if(!e)throw new Error("Video ID is required");return $a(e)}async function ts(e){let t;try{t=JSON.parse(e)}catch{return l("mergeBackupData: failed to parse JSON",null,"warn"),{mergedVideos:0,mergedTimestamps:0}}let n=Ji.safeParse(t);if(!n.success)return l("mergeBackupData: data failed validation",n.error.message,"warn"),{mergedVideos:0,mergedTimestamps:0};let r=await Zo(),a=new Map;for(let h of r)a.set(h.guid,h);let o=0,c=0,s=[];for(let[,h]of Object.entries(n.data)){let{video_id:p,timestamps:u}=h,v=0;for(let y of u){let E=a.get(y.guid),B=!1;E?E.write_counter!==void 0&&y.write_counter!==void 0&&y.write_counter>E.write_counter&&(B=!0):B=!0,B&&(s.push({guid:y.guid,video_id:p,start:y.start,comment:y.comment,write_counter:y.write_counter,deleted_at:y.deleted_at}),a.set(y.guid,{...E??{},guid:y.guid,video_id:p,start:y.start,comment:y.comment,write_counter:y.write_counter,deleted_at:y.deleted_at}),v++,c++)}v>0&&o++}return await Va(s),{mergedVideos:o,mergedTimestamps:c}}function ns(e,t){if(!e)throw new Error("Setting key is required");return Wa(e,t)}async function os(e){if(!e)throw new Error("Setting key is required");return Ka(e)}function Gc(e,t){return Hr(e,t)}function Uc(e,t){return Xa(e,t)}function _c(e,t){return Hr(e,t)}function Vc(e){return es(e)}function jc(e,t){return Ja(t)}function $c(e){return Za(e)}function er(e,t){ns(e,t)}function tr(e){return os(e)}function qc(e){return Rr(e)}function Wc(){return Ya()}function Kc(){return zr()}function Yc(){return Qa()}function Qc(e){return ts(e)}function nr(e){return e?Array.from(e.querySelectorAll("li:not(.ytls-placeholder):not(.ytls-error-message)")):[]}function or(e){if(!e)return;e.replaceChildren();let t=e.querySelector(".ytls-error-message");t&&t.remove()}function Fr(e,t){if(!e)return;or(e);let n=document.createElement("li");n.className="ytls-placeholder",n.textContent=t,e.appendChild(n),e.style.overflowY="hidden"}function rs(e){if(!e)return;let t=e.querySelector(".ytls-placeholder");t&&t.remove(),e.style.overflowY=""}function so(e){return e?e.querySelector(".ytls-error-message")!==null:!1}function is(e,t){if(!e)return;or(e);let n=document.createElement("li");n.className="ytls-error-message",n.style.cssText=`
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
  `,n.innerHTML=`<div style="margin-bottom:8px">\u26A0\uFE0F ${Xc(t)}</div><div style="font-size:12px;font-weight:normal;color:#aaa">Check the console for details or refresh the page.</div>`,e.appendChild(n),e.style.overflowY="hidden"}function as(e){if(!e)return;let t=e.querySelector(".ytls-error-message");t&&t.remove()}function Xc(e){let t=document.createElement("div");return t.textContent=e,t.innerHTML}function ss(e,t){if(!e||t||so(e))return;Array.from(e.children).some(r=>!r.classList.contains("ytls-placeholder")&&!r.classList.contains("ytls-error-message"))||Fr(e,"No timestamps for this video")}function ls(e){if(!e)return[];let t=nr(e),n=[];return t.forEach(r=>{let a=r.querySelector("[data-time]"),o=r.querySelector("input"),c=r.dataset.guid;if(!a||!o||!c)return;let s=a.dataset.time;if(!s)return;let h=Number.parseInt(s,10);Number.isFinite(h)&&n.push({guid:c,start:h,comment:o.value})}),n.sort((r,a)=>r.start-a.start)}function cs(e){if(!e)return 0;let t=nr(e),n=0;return t.forEach(r=>{let o=r.querySelector("[data-time]")?.dataset.time;if(o){let c=Number.parseInt(o,10);Number.isFinite(c)&&(n=Math.max(n,c))}}),n}var Zc={auth:{googleAuthState:{isSignedIn:!1,accessToken:null,userName:null,email:null},autoBackupEnabled:!0,autoBackupIntervalMinutes:30,autoBackupRetryAttempts:0,autoBackupBackoffMs:null,lastAutoBackupAt:null,isAutoBackupRunning:!1},ui:{panePosition:null,currentVideoId:"",minPaneHeight:250,lastHandledUrl:null,urlChangeHandlersSetup:!1},timestamps:{items:[],currentIndex:null,dbError:null}},ct=JSON.parse(JSON.stringify(Zc));function We(){return ct}function rr(e){ct={...ct,...e,auth:{...ct.auth,...e.auth||{}},ui:{...ct.ui,...e.ui||{}},timestamps:{...ct.timestamps,...e.timestamps||{}}}}function hn(e,t){rr({auth:{...ct.auth,[e]:t}})}function ir(e,t){rr({ui:{...ct.ui,[e]:t}})}function Dt(){return ct.auth.googleAuthState}function Tt(e){hn("googleAuthState",e)}function Nr(e){hn("autoBackupEnabled",e)}function Gr(e){hn("autoBackupIntervalMinutes",e)}function Ur(e){hn("isAutoBackupRunning",e)}function ar(e){hn("autoBackupRetryAttempts",e)}function Fn(e){hn("autoBackupBackoffMs",e)}function _r(e){hn("lastAutoBackupAt",e)}function us(e){ir("minPaneHeight",e)}function ds(e){ir("panePosition",e)}function ps(e){ir("lastHandledUrl",e)}function ms(e){ir("urlChangeHandlersSetup",e)}function fs(e){rr({timestamps:{...ct.timestamps,items:e}})}function Vr(e){rr({timestamps:{...ct.timestamps,dbError:e}})}function hs(){return ct.timestamps.dbError}var gn=typeof unsafeWindow<"u"?unsafeWindow:window,ks=43200*14,vs="html5_max_live_dvr_window_plus_margin_secs";function Ut(e){return e!=null&&typeof e=="object"}function ys(e){let{streamingData:t,videoDetails:n,playerConfig:r,microformat:a}=e;if(!(!Ut(n)||!n.isLive)){if(n.isLiveDvrEnabled=!0,Ut(r)){let o=r.mediaCommonConfig;if(Ut(o)){o.useServerDrivenAbr=!1;let c=o.serverPlaybackStartConfig;Ut(c)&&(c.enable=!1)}}if(Ut(t)){let o=t;if(o.serverAbrStreamingUrl&&(o.hlsManifestUrl||o.dashManifestUrl)&&delete o.serverAbrStreamingUrl,Array.isArray(o.adaptiveFormats)&&eu(a))for(let c of o.adaptiveFormats)c.maxDvrDurationSec=ks}}}function eu(e){if(!Ut(e))return!1;let t=e.playerMicroformatRenderer;if(!Ut(t))return!1;let n=t.liveBroadcastDetails;if(!Ut(n))return!1;let r=n.startTimestamp;return!r||typeof r!="string"?!1:(Date.now()-new Date(r).getTime())/1e3>43200}function jr(e){if(!e||typeof e!="object")return!1;let t=e;return t.videoDetails?(ys(t),!0):t.playerResponse&&Ut(t.playerResponse)&&t.playerResponse.videoDetails?(ys(t.playerResponse),!0):!1}function tu(){let e=Object.getOwnPropertyDescriptor(gn,"ytInitialPlayerResponse"),t=e&&e.set,n=gn.ytInitialPlayerResponse;if(!jr(n))try{Object.defineProperty(gn,"ytInitialPlayerResponse",{configurable:!0,get(){return n},set(r){t&&t.call(this,r),n=r,jr(r)&&Object.defineProperty(gn,"ytInitialPlayerResponse",{configurable:!0,writable:!0,value:r})}})}catch{}}var bs=!1;function nu(){if(bs)return;bs=!0;let e=JSON.parse;JSON.parse=function(t,n){let r=e.call(this,t,n);try{jr(r)}catch{}return r}}function ws(e){if(e.__dvrCapLifted)return;let n=(typeof e.d=="function"?e.d():void 0)?.WEB_PLAYER_CONTEXT_CONFIGS;if(!n)return;let r=n;for(let a in r){let o=r[a];if(o&&typeof o.serializedExperimentFlags=="string"){let c=o.serializedExperimentFlags,s=c.replace(new RegExp(`${vs}=[\\d.]+`),`${vs}=${ks}`);s!==c&&(o.serializedExperimentFlags=s)}}e.__dvrCapLifted=!0}function xs(e){if(!e||e.__dvrHooked)return e;e.__dvrHooked=!0;let t=e.set;typeof t=="function"&&(e.set=function(...n){let r=t.apply(this,n);try{ws(e)}catch{}return r});try{ws(e)}catch{}return e}function ou(){let e={};gn.ytcfg&&(e=xs(gn.ytcfg));try{Object.defineProperty(gn,"ytcfg",{configurable:!0,get(){return e},set(t){e=xs(t)}})}catch{}}function Ts(){tu(),nu(),ou(),l("[Timekeeper] DVR/Rewind enablement initialized for live streams")}var fe=Uint8Array,rt=Uint16Array,ti=Int32Array,sr=new fe([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),lr=new fe([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Yr=new fe([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Bs=function(e,t){for(var n=new rt(31),r=0;r<31;++r)n[r]=t+=1<<e[r-1];for(var a=new ti(n[30]),r=1;r<30;++r)for(var o=n[r];o<n[r+1];++o)a[o]=o-n[r]<<5|r;return{b:n,r:a}},Ds=Bs(sr,2),Cs=Ds.b,Qr=Ds.r;Cs[28]=258,Qr[258]=28;var Ps=Bs(lr,0),ru=Ps.b,Ss=Ps.r,Xr=new rt(32768);for(X=0;X<32768;++X)_t=(X&43690)>>1|(X&21845)<<1,_t=(_t&52428)>>2|(_t&13107)<<2,_t=(_t&61680)>>4|(_t&3855)<<4,Xr[X]=((_t&65280)>>8|(_t&255)<<8)>>1;var _t,X,Pt=(function(e,t,n){for(var r=e.length,a=0,o=new rt(t);a<r;++a)e[a]&&++o[e[a]-1];var c=new rt(t);for(a=1;a<t;++a)c[a]=c[a-1]+o[a-1]<<1;var s;if(n){s=new rt(1<<t);var h=15-t;for(a=0;a<r;++a)if(e[a])for(var p=a<<4|e[a],u=t-e[a],v=c[e[a]-1]++<<u,y=v|(1<<u)-1;v<=y;++v)s[Xr[v]>>h]=p}else for(s=new rt(r),a=0;a<r;++a)e[a]&&(s[a]=Xr[c[e[a]-1]++]>>15-e[a]);return s}),en=new fe(288);for(X=0;X<144;++X)en[X]=8;var X;for(X=144;X<256;++X)en[X]=9;var X;for(X=256;X<280;++X)en[X]=7;var X;for(X=280;X<288;++X)en[X]=8;var X,uo=new fe(32);for(X=0;X<32;++X)uo[X]=5;var X,iu=Pt(en,9,0),au=Pt(en,9,1),su=Pt(uo,5,0),lu=Pt(uo,5,1),$r=function(e){for(var t=e[0],n=1;n<e.length;++n)e[n]>t&&(t=e[n]);return t},St=function(e,t,n){var r=t/8|0;return(e[r]|e[r+1]<<8)>>(t&7)&n},qr=function(e,t){var n=t/8|0;return(e[n]|e[n+1]<<8|e[n+2]<<16)>>(t&7)},ni=function(e){return(e+7)/8|0},po=function(e,t,n){return(t==null||t<0)&&(t=0),(n==null||n>e.length)&&(n=e.length),new fe(e.subarray(t,n))};var cu=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],Ne=function(e,t,n){var r=new Error(t||cu[e]);if(r.code=e,Error.captureStackTrace&&Error.captureStackTrace(r,Ne),!n)throw r;return r},uu=function(e,t,n,r){var a=e.length,o=r?r.length:0;if(!a||t.f&&!t.l)return n||new fe(0);var c=!n,s=c||t.i!=2,h=t.i;c&&(n=new fe(a*3));var p=function(jt){var nn=n.length;if(jt>nn){var Et=new fe(Math.max(nn*2,jt));Et.set(n),n=Et}},u=t.f||0,v=t.p||0,y=t.b||0,E=t.l,B=t.d,O=t.m,z=t.n,V=a*8;do{if(!E){u=St(e,v,1);var M=St(e,v+1,3);if(v+=3,M)if(M==1)E=au,B=lu,O=9,z=5;else if(M==2){var pe=St(e,v,31)+257,ee=St(e,v+10,15)+4,j=pe+St(e,v+5,31)+1;v+=14;for(var N=new fe(j),he=new fe(19),le=0;le<ee;++le)he[Yr[le]]=St(e,v+le*3,7);v+=ee*3;for(var ve=$r(he),pt=(1<<ve)-1,Ge=Pt(he,ve,1),le=0;le<j;){var De=Ge[St(e,v,pt)];v+=De&15;var D=De>>4;if(D<16)N[le++]=D;else{var ye=0,ce=0;for(D==16?(ce=3+St(e,v,3),v+=2,ye=N[le-1]):D==17?(ce=3+St(e,v,7),v+=3):D==18&&(ce=11+St(e,v,127),v+=7);ce--;)N[le++]=ye}}var ke=N.subarray(0,pe),ue=N.subarray(pe);O=$r(ke),z=$r(ue),E=Pt(ke,O,1),B=Pt(ue,z,1)}else Ne(1);else{var D=ni(v)+4,Q=e[D-4]|e[D-3]<<8,Z=D+Q;if(Z>a){h&&Ne(0);break}s&&p(y+Q),n.set(e.subarray(D,Z),y),t.b=y+=Q,t.p=v=Z*8,t.f=u;continue}if(v>V){h&&Ne(0);break}}s&&p(y+131072);for(var Ce=(1<<O)-1,be=(1<<z)-1,we=v;;we=v){var ye=E[qr(e,v)&Ce],Ue=ye>>4;if(v+=ye&15,v>V){h&&Ne(0);break}if(ye||Ne(2),Ue<256)n[y++]=Ue;else if(Ue==256){we=v,E=null;break}else{var Pe=Ue-254;if(Ue>264){var le=Ue-257,de=sr[le];Pe=St(e,v,(1<<de)-1)+Cs[le],v+=de}var it=B[qr(e,v)&be],zt=it>>4;it||Ne(3),v+=it&15;var ue=ru[zt];if(zt>3){var de=lr[zt];ue+=qr(e,v)&(1<<de)-1,v+=de}if(v>V){h&&Ne(0);break}s&&p(y+131072);var Te=y+Pe;if(y<ue){var at=o-ue,te=Math.min(ue,Te);for(at+y<0&&Ne(3);y<te;++y)n[y]=r[at+y]}for(;y<Te;++y)n[y]=n[y-ue]}}t.l=E,t.p=we,t.b=y,t.f=u,E&&(u=1,t.m=O,t.d=B,t.n=z)}while(!u);return y!=n.length&&c?po(n,0,y):n.subarray(0,y)},Vt=function(e,t,n){n<<=t&7;var r=t/8|0;e[r]|=n,e[r+1]|=n>>8},lo=function(e,t,n){n<<=t&7;var r=t/8|0;e[r]|=n,e[r+1]|=n>>8,e[r+2]|=n>>16},Wr=function(e,t){for(var n=[],r=0;r<e.length;++r)e[r]&&n.push({s:r,f:e[r]});var a=n.length,o=n.slice();if(!a)return{t:zs,l:0};if(a==1){var c=new fe(n[0].s+1);return c[n[0].s]=1,{t:c,l:1}}n.sort(function(Z,pe){return Z.f-pe.f}),n.push({s:-1,f:25001});var s=n[0],h=n[1],p=0,u=1,v=2;for(n[0]={s:-1,f:s.f+h.f,l:s,r:h};u!=a-1;)s=n[n[p].f<n[v].f?p++:v++],h=n[p!=u&&n[p].f<n[v].f?p++:v++],n[u++]={s:-1,f:s.f+h.f,l:s,r:h};for(var y=o[0].s,r=1;r<a;++r)o[r].s>y&&(y=o[r].s);var E=new rt(y+1),B=Jr(n[u-1],E,0);if(B>t){var r=0,O=0,z=B-t,V=1<<z;for(o.sort(function(pe,ee){return E[ee.s]-E[pe.s]||pe.f-ee.f});r<a;++r){var M=o[r].s;if(E[M]>t)O+=V-(1<<B-E[M]),E[M]=t;else break}for(O>>=z;O>0;){var D=o[r].s;E[D]<t?O-=1<<t-E[D]++-1:++r}for(;r>=0&&O;--r){var Q=o[r].s;E[Q]==t&&(--E[Q],++O)}B=t}return{t:new fe(E),l:B}},Jr=function(e,t,n){return e.s==-1?Math.max(Jr(e.l,t,n+1),Jr(e.r,t,n+1)):t[e.s]=n},As=function(e){for(var t=e.length;t&&!e[--t];);for(var n=new rt(++t),r=0,a=e[0],o=1,c=function(h){n[r++]=h},s=1;s<=t;++s)if(e[s]==a&&s!=t)++o;else{if(!a&&o>2){for(;o>138;o-=138)c(32754);o>2&&(c(o>10?o-11<<5|28690:o-3<<5|12305),o=0)}else if(o>3){for(c(a),--o;o>6;o-=6)c(8304);o>2&&(c(o-3<<5|8208),o=0)}for(;o--;)c(a);o=1,a=e[s]}return{c:n.subarray(0,r),n:t}},co=function(e,t){for(var n=0,r=0;r<t.length;++r)n+=e[r]*t[r];return n},Rs=function(e,t,n){var r=n.length,a=ni(t+2);e[a]=r&255,e[a+1]=r>>8,e[a+2]=e[a]^255,e[a+3]=e[a+1]^255;for(var o=0;o<r;++o)e[a+o+4]=n[o];return(a+4+r)*8},Es=function(e,t,n,r,a,o,c,s,h,p,u){Vt(t,u++,n),++a[256];for(var v=Wr(a,15),y=v.t,E=v.l,B=Wr(o,15),O=B.t,z=B.l,V=As(y),M=V.c,D=V.n,Q=As(O),Z=Q.c,pe=Q.n,ee=new rt(19),j=0;j<M.length;++j)++ee[M[j]&31];for(var j=0;j<Z.length;++j)++ee[Z[j]&31];for(var N=Wr(ee,7),he=N.t,le=N.l,ve=19;ve>4&&!he[Yr[ve-1]];--ve);var pt=p+5<<3,Ge=co(a,en)+co(o,uo)+c,De=co(a,y)+co(o,O)+c+14+3*ve+co(ee,he)+2*ee[16]+3*ee[17]+7*ee[18];if(h>=0&&pt<=Ge&&pt<=De)return Rs(t,u,e.subarray(h,h+p));var ye,ce,ke,ue;if(Vt(t,u,1+(De<Ge)),u+=2,De<Ge){ye=Pt(y,E,0),ce=y,ke=Pt(O,z,0),ue=O;var Ce=Pt(he,le,0);Vt(t,u,D-257),Vt(t,u+5,pe-1),Vt(t,u+10,ve-4),u+=14;for(var j=0;j<ve;++j)Vt(t,u+3*j,he[Yr[j]]);u+=3*ve;for(var be=[M,Z],we=0;we<2;++we)for(var Ue=be[we],j=0;j<Ue.length;++j){var Pe=Ue[j]&31;Vt(t,u,Ce[Pe]),u+=he[Pe],Pe>15&&(Vt(t,u,Ue[j]>>5&127),u+=Ue[j]>>12)}}else ye=iu,ce=en,ke=su,ue=uo;for(var j=0;j<s;++j){var de=r[j];if(de>255){var Pe=de>>18&31;lo(t,u,ye[Pe+257]),u+=ce[Pe+257],Pe>7&&(Vt(t,u,de>>23&31),u+=sr[Pe]);var it=de&31;lo(t,u,ke[it]),u+=ue[it],it>3&&(lo(t,u,de>>5&8191),u+=lr[it])}else lo(t,u,ye[de]),u+=ce[de]}return lo(t,u,ye[256]),u+ce[256]},du=new ti([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),zs=new fe(0),pu=function(e,t,n,r,a,o){var c=o.z||e.length,s=new fe(r+c+5*(1+Math.ceil(c/7e3))+a),h=s.subarray(r,s.length-a),p=o.l,u=(o.r||0)&7;if(t){u&&(h[0]=o.r>>3);for(var v=du[t-1],y=v>>13,E=v&8191,B=(1<<n)-1,O=o.p||new rt(32768),z=o.h||new rt(B+1),V=Math.ceil(n/3),M=2*V,D=function(_n){return(e[_n]^e[_n+1]<<V^e[_n+2]<<M)&B},Q=new ti(25e3),Z=new rt(288),pe=new rt(32),ee=0,j=0,N=o.i||0,he=0,le=o.w||0,ve=0;N+2<c;++N){var pt=D(N),Ge=N&32767,De=z[pt];if(O[Ge]=De,z[pt]=Ge,le<=N){var ye=c-N;if((ee>7e3||he>24576)&&(ye>423||!p)){u=Es(e,h,0,Q,Z,pe,j,he,ve,N-ve,u),he=ee=j=0,ve=N;for(var ce=0;ce<286;++ce)Z[ce]=0;for(var ce=0;ce<30;++ce)pe[ce]=0}var ke=2,ue=0,Ce=E,be=Ge-De&32767;if(ye>2&&pt==D(N-be))for(var we=Math.min(y,ye)-1,Ue=Math.min(32767,N),Pe=Math.min(258,ye);be<=Ue&&--Ce&&Ge!=De;){if(e[N+ke]==e[N+ke-be]){for(var de=0;de<Pe&&e[N+de]==e[N+de-be];++de);if(de>ke){if(ke=de,ue=be,de>we)break;for(var it=Math.min(be,de-2),zt=0,ce=0;ce<it;++ce){var Te=N-be+ce&32767,at=O[Te],te=Te-at&32767;te>zt&&(zt=te,De=Te)}}}Ge=De,De=O[Ge],be+=Ge-De&32767}if(ue){Q[he++]=268435456|Qr[ke]<<18|Ss[ue];var jt=Qr[ke]&31,nn=Ss[ue]&31;j+=sr[jt]+lr[nn],++Z[257+jt],++pe[nn],le=N+ke,++ee}else Q[he++]=e[N],++Z[e[N]]}}for(N=Math.max(N,le);N<c;++N)Q[he++]=e[N],++Z[e[N]];u=Es(e,h,p,Q,Z,pe,j,he,ve,N-ve,u),p||(o.r=u&7|h[u/8|0]<<3,u-=7,o.h=z,o.p=O,o.i=N,o.w=le)}else{for(var N=o.w||0;N<c+p;N+=65535){var Et=N+65535;Et>=c&&(h[u/8|0]=p,Et=c),u=Rs(h,u+1,e.subarray(N,Et))}o.i=c}return po(s,0,r+ni(u)+a)},mu=(function(){for(var e=new Int32Array(256),t=0;t<256;++t){for(var n=t,r=9;--r;)n=(n&1&&-306674912)^n>>>1;e[t]=n}return e})(),fu=function(){var e=-1;return{p:function(t){for(var n=e,r=0;r<t.length;++r)n=mu[n&255^t[r]]^n>>>8;e=n},d:function(){return~e}}};var hu=function(e,t,n,r,a){if(!a&&(a={l:1},t.dictionary)){var o=t.dictionary.subarray(-32768),c=new fe(o.length+e.length);c.set(o),c.set(e,o.length),e=c,a.w=o.length}return pu(e,t.level==null?6:t.level,t.mem==null?a.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+t.mem,n,r,a)},Hs=function(e,t){var n={};for(var r in e)n[r]=e[r];for(var r in t)n[r]=t[r];return n};var Ct=function(e,t){return e[t]|e[t+1]<<8},ut=function(e,t){return(e[t]|e[t+1]<<8|e[t+2]<<16|e[t+3]<<24)>>>0},Kr=function(e,t){return ut(e,t)+ut(e,t+4)*4294967296},Be=function(e,t,n){for(;n;++t)e[t]=n,n>>>=8};function gu(e,t){return hu(e,t||{},0,0)}function vu(e,t){return uu(e,{i:2},t&&t.out,t&&t.dictionary)}var Os=function(e,t,n,r){for(var a in e){var o=e[a],c=t+a,s=r;Array.isArray(o)&&(s=Hs(r,o[1]),o=o[0]),ArrayBuffer.isView(o)?n[c]=[o,s]:(n[c+="/"]=[new fe(0),s],Os(o,c,n,r))}},Ms=typeof TextEncoder<"u"&&new TextEncoder,Zr=typeof TextDecoder<"u"&&new TextDecoder,yu=0;try{Zr.decode(zs,{stream:!0}),yu=1}catch{}var bu=function(e){for(var t="",n=0;;){var r=e[n++],a=(r>127)+(r>223)+(r>239);if(n+a>e.length)return{s:t,r:po(e,n-1)};a?a==3?(r=((r&15)<<18|(e[n++]&63)<<12|(e[n++]&63)<<6|e[n++]&63)-65536,t+=String.fromCharCode(55296|r>>10,56320|r&1023)):a&1?t+=String.fromCharCode((r&31)<<6|e[n++]&63):t+=String.fromCharCode((r&15)<<12|(e[n++]&63)<<6|e[n++]&63):t+=String.fromCharCode(r)}};function Ls(e,t){if(t){for(var n=new fe(e.length),r=0;r<e.length;++r)n[r]=e.charCodeAt(r);return n}if(Ms)return Ms.encode(e);for(var a=e.length,o=new fe(e.length+(e.length>>1)),c=0,s=function(u){o[c++]=u},r=0;r<a;++r){if(c+5>o.length){var h=new fe(c+8+(a-r<<1));h.set(o),o=h}var p=e.charCodeAt(r);p<128||t?s(p):p<2048?(s(192|p>>6),s(128|p&63)):p>55295&&p<57344?(p=65536+(p&1047552)|e.charCodeAt(++r)&1023,s(240|p>>18),s(128|p>>12&63),s(128|p>>6&63),s(128|p&63)):(s(224|p>>12),s(128|p>>6&63),s(128|p&63))}return po(o,0,c)}function wu(e,t){if(t){for(var n="",r=0;r<e.length;r+=16384)n+=String.fromCharCode.apply(null,e.subarray(r,r+16384));return n}else{if(Zr)return Zr.decode(e);var a=bu(e),o=a.s,n=a.r;return n.length&&Ne(8),o}}var xu=function(e,t){return t+30+Ct(e,t+26)+Ct(e,t+28)},ku=function(e,t,n){var r=Ct(e,t+28),a=Ct(e,t+30),o=wu(e.subarray(t+46,t+46+r),!(Ct(e,t+8)&2048)),c=t+46+r,s=Tu(e,c,a,n,ut(e,t+20),ut(e,t+24),ut(e,t+42)),h=s[0],p=s[1],u=s[2];return[Ct(e,t+10),h,p,o,c+a+Ct(e,t+32),u]},Tu=function(e,t,n,r,a,o,c){var s=a==4294967295,h=o==4294967295,p=c==4294967295,u=t+n,v=s+h+p;if(r&&v){for(;t+4<u;t+=4+Ct(e,t+2))if(Ct(e,t)==1)return[s?Kr(e,t+4+8*h):a,h?Kr(e,t+4):o,p?Kr(e,t+4+8*(h+s)):c,1];r<2&&Ne(13)}return[a,o,c,0]},ei=function(e){var t=0;if(e)for(var n in e){var r=e[n].length;r>65535&&Ne(9),t+=r+4}return t},Is=function(e,t,n,r,a,o,c,s){var h=r.length,p=n.extra,u=s&&s.length,v=ei(p);Be(e,t,c!=null?33639248:67324752),t+=4,c!=null&&(e[t++]=20,e[t++]=n.os),e[t]=20,t+=2,e[t++]=n.flag<<1|(o<0&&8),e[t++]=a&&8,e[t++]=n.compression&255,e[t++]=n.compression>>8;var y=new Date(n.mtime==null?Date.now():n.mtime),E=y.getFullYear()-1980;if((E<0||E>119)&&Ne(10),Be(e,t,E<<25|y.getMonth()+1<<21|y.getDate()<<16|y.getHours()<<11|y.getMinutes()<<5|y.getSeconds()>>1),t+=4,o!=-1&&(Be(e,t,n.crc),Be(e,t+4,o<0?-o-2:o),Be(e,t+8,n.size)),Be(e,t+12,h),Be(e,t+14,v),t+=16,c!=null&&(Be(e,t,u),Be(e,t+6,n.attrs),Be(e,t+10,c),t+=14),e.set(r,t),t+=h,v)for(var B in p){var O=p[B],z=O.length;Be(e,t,+B),Be(e,t+2,z),e.set(O,t+4),t+=4+z}return u&&(e.set(s,t),t+=u),t},Su=function(e,t,n,r,a){Be(e,t,101010256),Be(e,t+8,n),Be(e,t+10,n),Be(e,t+12,r),Be(e,t+16,a)};function Fs(e,t){t||(t={});var n={},r=[];Os(e,"",n,t);var a=0,o=0;for(var c in n){var s=n[c],h=s[0],p=s[1],u=p.level==0?0:8,v=Ls(c),y=v.length,E=p.comment,B=E&&Ls(E),O=B&&B.length,z=ei(p.extra);y>65535&&Ne(11);var V=u?gu(h,p):h,M=V.length,D=fu();D.p(h),r.push(Hs(p,{size:h.length,crc:D.d(),c:V,f:v,m:B,u:y!=c.length||B&&E.length!=O,o:a,compression:u})),a+=30+y+z+M,o+=76+2*(y+z)+(O||0)+M}for(var Q=new fe(o+22),Z=a,pe=o-a,ee=0;ee<r.length;++ee){var v=r[ee];Is(Q,v.o,v,v.f,v.u,v.c.length);var j=30+v.f.length+ei(v.extra);Q.set(v.c,v.o+j),Is(Q,a,v,v.f,v.u,v.c.length,v.o,v.m),a+=16+j+(v.m?v.m.length:0)}return Su(Q,a,r.length,pe,Z),Q}function Ns(e,t){for(var n={},r=e.length-22;ut(e,r)!=101010256;--r)(!r||e.length-r>65558)&&Ne(13);var a=Ct(e,r+8);if(!a)return{};var o=ut(e,r+16),c=ut(e,r-20)==117853008;if(c){var s=ut(e,r-12);c=ut(e,s)==101075792,c&&(a=ut(e,s+32),o=ut(e,s+48))}for(var h=t&&t.filter,p=0;p<a;++p){var u=ku(e,o,c),v=u[0],y=u[1],E=u[2],B=u[3],O=u[4],z=u[5],V=xu(e,z);o=O,(!h||h({name:B,size:y,originalSize:E,compression:v}))&&(v?v==8?n[B]=vu(e.subarray(V,V+y),{out:new fe(E)}):Ne(14,"unknown compression type "+v):n[B]=po(e,V,V+y))}return n}function At(){return Dt()}var dt={get isSignedIn(){return Dt().isSignedIn},get accessToken(){return Dt().accessToken},get userName(){return Dt().userName},get email(){return Dt().email},set isSignedIn(e){let t=Dt();Tt({...t,isSignedIn:e})},set accessToken(e){let t=Dt();Tt({...t,accessToken:e})},set userName(e){let t=Dt();Tt({...t,userName:e})},set email(e){let t=Dt();Tt({...t,email:e})}};function go(){return We().auth.autoBackupEnabled}function Rt(){return We().auth.autoBackupIntervalMinutes}var ii=null,se=null,oe=null,yn=null;function _s(e){ii=e}function Vs(e){se=e}function js(e){oe=e}function $s(e){yn=e}var Gs=!1;function qs(){if(!Gs)try{let e=document.createElement("style");e.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(e),Gs=!0}catch{}}var Ws=null,ai=null,mo=null,fo=null,si=null;function Ks(e){Ws=e}function Ys(e){ai=e}function li(e){mo=e}function ci(e){fo=e}function Qs(e){si=e}var ur="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",Xs="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",Js="https://www.youtube.com/",Au=new Date(Date.UTC(2e3,0,1,0,0,0)),Eu=30*1e3,Mu=1800*1e3,Us=5,cr=null,Ke=null;async function ui(){try{let e=await fo("googleAuthState"),t=e&&typeof e=="object"?{...e,accessToken:e.accessToken?"[REDACTED]":null}:e;l("Loading Google auth state from IndexedDB:",t);let n=Br.safeParse(e);if(n.success){let r=At();Tt({...r,...n.data});let a=At();a.isSignedIn&&a.accessToken&&l(`Reusing stored Google auth token for ${a.userName||a.email||"user"}`),Un();let o=At();o.isSignedIn&&o.accessToken&&await tn(!0)}else if(e!==void 0){let r=e&&typeof e=="object"?{...e,accessToken:e.accessToken?"[REDACTED]":null}:e;l("Google auth state failed validation:",{stored:r,errors:n.error.message},"warn")}}catch(e){l("Failed to load Google auth state:",e,"error")}}async function vo(){try{let e=At(),t=Br.safeParse(e);if(!t.success){let n={...e,accessToken:e.accessToken?"[REDACTED]":null};l("Invalid auth state, cannot save",{state:n,errors:t.error.message},"error");return}await mo("googleAuthState",e),e.isSignedIn&&e.accessToken?l(`Saved Google auth state to IndexedDB for ${e.userName||e.email||"user"}`):l("Cleared Google auth state in IndexedDB (signed out)")}catch(e){l("Failed to save Google auth state:",e,"error")}}function Un(){ii&&(ii.style.display="none")}function tt(e,t){if(!oe)return;if(oe.style.fontWeight="bold",e==="authenticating"){qs(),oe.style.color="#ffa500",oe.replaceChildren();let r=document.createElement("span");r.className="tk-auth-spinner";let a=document.createTextNode(` ${t||"Authorizing with Google\u2026"}`);oe.appendChild(r),oe.appendChild(a);return}if(e==="error"){ae(oe,"circle-x",t||"Authorization failed"),oe.style.color="#ff4d4f",xe();return}let n=At();n.isSignedIn?(ae(oe,"circle-check","Signed in"),oe.style.color="#52c41a",oe.removeAttribute("title"),n.userName?(oe.onmouseenter=()=>{ae(oe,"circle-check",`Signed in as ${n.userName}`)},oe.onmouseleave=()=>{ae(oe,"circle-check","Signed in")}):(oe.onmouseenter=null,oe.onmouseleave=null)):(ae(oe,"circle-x","Not signed in"),oe.style.color="#ff4d4f",oe.removeAttribute("title"),oe.onmouseenter=null,oe.onmouseleave=null),xe()}function Lu(){oe&&(qs(),oe.classList.remove("tk-auth-blink"),oe.offsetWidth,oe.classList.add("tk-auth-blink"),setTimeout(()=>{oe.classList.remove("tk-auth-blink")},1200))}function Zs(e,t=300*1e3){return new Promise((n,r)=>{if(!e){l&&l("OAuth monitor: popup is null",null,"error"),r(new Error("Failed to open popup"));return}l&&l("OAuth monitor: starting to monitor popup for token");let a=Date.now(),o="timekeeper_oauth",c=null,s=null,h=null,p=()=>{if(c){try{c.close()}catch{}c=null}s&&(clearInterval(s),s=null),h&&(clearInterval(h),h=null)};try{c=new BroadcastChannel(o),l&&l("OAuth monitor: BroadcastChannel created successfully"),c.onmessage=y=>{let E=y.data?.token?{...y.data,token:"[REDACTED]"}:y.data;l&&l("OAuth monitor: received BroadcastChannel message",E);let B=xt({type:ze(),token:qe(ze()),error:qe(ze())}).safeParse(y.data);if(!B.success){l&&l("OAuth monitor: invalid message format",B.error,"warn");return}if(B.data.type==="timekeeper_oauth_token"&&B.data.token){l&&l("OAuth monitor: token received via BroadcastChannel"),p();try{e.close()}catch{}n(B.data.token)}else if(B.data.type==="timekeeper_oauth_error"){l&&l("OAuth monitor: error received via BroadcastChannel",B.data.error,"error"),p();try{e.close()}catch{}r(new Error(B.data.error||"OAuth failed"))}}}catch(y){l&&l("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",y)}l&&l("OAuth monitor: setting up IndexedDB polling");let u=Date.now();s=setInterval(async()=>{try{let y=indexedDB.open("ytls-timestamps-db",4);y.onsuccess=()=>{let E=y.result,z=E.transaction("settings","readonly").objectStore("settings").get("oauth_message");z.onsuccess=()=>{let V=z.result;if(V&&V.value){let M=V.value,D=xt({type:ze(),token:qe(ze()),error:qe(ze()),timestamp:qe(wt())}).safeParse(M);if(!D.success){l&&l("OAuth monitor: invalid IndexedDB message format",D.error,"warn");return}if(D.data.timestamp&&D.data.timestamp>u){let Q=D.data.token?{...D.data,token:"[REDACTED]"}:D.data;if(l&&l("OAuth monitor: received IndexedDB message",Q),D.data.type==="timekeeper_oauth_token"&&D.data.token){l&&l("OAuth monitor: token received via IndexedDB"),p();try{e.close()}catch{}E.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),n(D.data.token)}else if(D.data.type==="timekeeper_oauth_error"){l&&l("OAuth monitor: error received via IndexedDB",D.data.error,"error"),p();try{e.close()}catch{}E.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),r(new Error(D.data.error||"OAuth failed"))}u=D.data.timestamp||Date.now()}}E.close()}}}catch(y){l&&l("OAuth monitor: IndexedDB polling error",y,"error")}},500),h=setInterval(()=>{if(Date.now()-a>t){l&&l("OAuth monitor: popup timed out after 5 minutes",null,"error"),p();try{e.close()}catch{}r(new Error("OAuth popup timed out"));return}},1e3)})}async function el(){if(!ur){tt("error","Google Client ID not configured");return}try{l&&l("OAuth signin: starting OAuth flow"),tt("authenticating","Opening authentication window...");let e=new URL("https://accounts.google.com/o/oauth2/v2/auth");e.searchParams.set("client_id",ur),e.searchParams.set("redirect_uri",Js),e.searchParams.set("response_type","token"),e.searchParams.set("scope",Xs),e.searchParams.set("include_granted_scopes","true"),e.searchParams.set("state","timekeeper_auth"),l&&l("OAuth signin: opening popup");let t=window.open(e.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!t){l&&l("OAuth signin: popup blocked by browser",null,"error"),tt("error","Popup blocked. Please enable popups for YouTube.");return}l&&l("OAuth signin: popup opened successfully"),tt("authenticating","Waiting for authentication...");try{let n=await Zs(t),r=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${n}`}});if(r.ok){let a=await r.json(),o=xt({name:qe(ze()),email:qe(ze())}).safeParse(a);if(!o.success)throw l&&l("Failed to validate user info response",o.error,"error"),new Error("Invalid user info response");let c=o.data;Tt({isSignedIn:!0,accessToken:n,userName:c.name||null,email:c.email||null}),await vo(),Un(),tt(),xe(),await tn(),l?l(`Successfully authenticated as ${c.name}`):console.log(`[Timekeeper] Successfully authenticated as ${c.name}`)}else throw new Error("Failed to fetch user info")}catch(n){let r=n instanceof Error?n.message:"Authentication failed";l?l("OAuth failed:",n,"error"):console.error("[Timekeeper] OAuth failed:",n),tt("error",r);return}}catch(e){let t=e instanceof Error?e.message:"Sign in failed";l?l("Failed to sign in to Google:",e,"error"):console.error("[Timekeeper] Failed to sign in to Google:",e),tt("error",`Failed to sign in: ${t}`)}}async function Iu(){let e=At(),t=e.email;if(!ur||!t)return!1;l("Silent OAuth: attempting silent token refresh for "+t);let n=new URL("https://accounts.google.com/o/oauth2/v2/auth");n.searchParams.set("client_id",ur),n.searchParams.set("redirect_uri",Js),n.searchParams.set("response_type","token"),n.searchParams.set("scope",Xs),n.searchParams.set("include_granted_scopes","true"),n.searchParams.set("state","timekeeper_auth"),n.searchParams.set("prompt","none"),n.searchParams.set("login_hint",t);let r=window.open(n.toString(),"TimekeeperGoogleAuthSilent","width=1,height=1,left=-2000,top=-2000,menubar=no,toolbar=no,location=no");if(!r)return l("Silent OAuth: popup blocked",null,"warn"),!1;try{let a=await Zs(r,15e3);return Tt({...e,isSignedIn:!0,accessToken:a}),await vo(),Un(),tt(),l("Silent OAuth: token refreshed successfully for "+t),!0}catch(a){l("Silent OAuth: silent refresh failed",a,"warn");try{r.close()}catch{}return!1}}async function tl(){if(!window.opener||window.opener===window)return!1;l&&l("OAuth popup: detected popup window, checking for OAuth response");let e=window.location.hash;if(!e||e.length<=1)return l&&l("OAuth popup: no hash params found"),!1;let t=e.startsWith("#")?e.substring(1):e,n=new URLSearchParams(t),r=n.get("state");if(l&&l("OAuth popup: hash params found, state="+r),r!=="timekeeper_auth")return l&&l("OAuth popup: not our OAuth flow (wrong state)"),!1;let a=n.get("error"),o=n.get("access_token"),c="timekeeper_oauth";if(a){try{let s=new BroadcastChannel(c);s.postMessage({type:"timekeeper_oauth_error",error:n.get("error_description")||a}),s.close(),l&&l("OAuth popup: error broadcast via BroadcastChannel")}catch{let h={type:"timekeeper_oauth_error",error:n.get("error_description")||a,timestamp:Date.now()};l&&l("OAuth popup: writing error to IndexedDB",h);let p=indexedDB.open("ytls-timestamps-db",4);p.onsuccess=()=>{let u=p.result,y=u.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:h});y.onsuccess=()=>{l&&l("OAuth popup: error written to IndexedDB successfully")},y.onerror=()=>{l&&l("OAuth popup: failed to write error to IndexedDB",y.error,"error")},u.close()},p.onerror=()=>{l&&l("OAuth popup: failed to open IndexedDB",p.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(o){l&&l("OAuth popup: access token found, broadcasting to opener");try{let s=new BroadcastChannel(c);s.postMessage({type:"timekeeper_oauth_token",token:o}),s.close(),l&&l("OAuth popup: token broadcast via BroadcastChannel")}catch(s){l&&l("OAuth popup: BroadcastChannel failed, using IndexedDB",s);let h={type:"timekeeper_oauth_token",token:o,timestamp:Date.now()},p={...h,token:"[REDACTED]"};l&&l("OAuth popup: writing token to IndexedDB",p);let u=indexedDB.open("ytls-timestamps-db",4);u.onsuccess=()=>{let v=u.result,E=v.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:h});E.onsuccess=()=>{l&&l("OAuth popup: token written to IndexedDB successfully")},E.onerror=()=>{l&&l("OAuth popup: failed to write token to IndexedDB",E.error,"error")},v.close()},u.onerror=()=>{l&&l("OAuth popup: failed to open IndexedDB",u.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function nl(){Tt({isSignedIn:!1,accessToken:null,userName:null,email:null}),await vo(),await tn(),Un(),tt(),xe()}async function ol(){let e=At();if(!e.isSignedIn||!e.accessToken)return!1;try{let t=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${e.accessToken}`}});return t.status===401?(await al({silent:!0}),!1):t.ok}catch(t){return l("Failed to verify auth state:",t,"error"),!1}}function dr(){let e=At();return e.isSignedIn&&!!e.accessToken}function Gn(){return dr()}function Bu(){let e=[];return dr()&&e.push("Google Drive"),e}function Du(e){let t=Ns(new Uint8Array(e)),n=Object.values(t)[0];return n?new TextDecoder().decode(n):null}async function rl(e){let t={Authorization:`Bearer ${e}`},r=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,a=await fetch(r,{headers:t});if(a.status===401)throw new Error("unauthorized");if(!a.ok)throw new Error("drive search failed");let o=await a.json();if(Array.isArray(o.files)&&o.files.length>0)return o.files[0].id;let c=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...t,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(c.status===401)throw new Error("unauthorized");if(!c.ok)throw new Error("drive folder create failed");return(await c.json()).id}async function il(e,t,n){let r=`name='${e}' and '${t}' in parents and trashed=false`,a=encodeURIComponent(r),o=await fetch(`https://www.googleapis.com/drive/v3/files?q=${a}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${n}`}});if(o.status===401)throw new Error("unauthorized");if(!o.ok)return null;let c=await o.json();return c.files&&c.files.length>0?c.files[0].id:null}async function Cu(e){try{let t=await rl(e),n=await il("timekeeper-data.zip",t,e);if(!n)return null;let r=await fetch(`https://www.googleapis.com/drive/v3/files/${n}?alt=media`,{headers:{Authorization:`Bearer ${e}`}});if(r.status===401)throw new Error("unauthorized");return r.ok?Du(await r.arrayBuffer()):null}catch(t){if(t.message==="unauthorized")throw t;return l("Failed to fetch latest Drive backup for merge:",t,"warn"),null}}async function Pu(){if(!ai)return;let e=At();if(!e.isSignedIn||!e.accessToken)return;let t=await Cu(e.accessToken).catch(async a=>a.message==="unauthorized"?(await al({silent:!0}),null):(l("Failed to fetch latest Drive backup for merge:",a,"warn"),null)),n=t?[t]:[],r=0;for(let a of n)if(a)try{let{mergedVideos:o,mergedTimestamps:c}=await ai(a);c>0&&(l(`Pre-backup merge: added ${c} timestamps from ${o} videos from remote`),r+=c)}catch(o){l("Failed to merge remote backup data:",o,"warn")}r>0&&si&&si()}function Ru(e,t){let n=new TextEncoder().encode(e),r=t.replace(/\\/g,"/").replace(/^\/+/,"");return r.endsWith(".json")||(r+=".json"),Fs({[r]:[n,{level:6,mtime:Au,os:0}]})}async function zu(e,t,n,r){let a=e.replace(/\.json$/,".zip"),o=await il(a,n,r),c=new TextEncoder().encode(t).length,s=Ru(t,e),h=s.length;l(`Compressing data: ${c} bytes -> ${h} bytes (${Math.round(100-h/c*100)}% reduction)`);let p="-------314159265358979",u=`\r
--${p}\r
`,v=`\r
--${p}--`,y=o?{name:a,mimeType:"application/zip"}:{name:a,mimeType:"application/zip",parents:[n]},E=8192,B="";for(let Q=0;Q<s.length;Q+=E){let Z=s.subarray(Q,Math.min(Q+E,s.length));B+=String.fromCharCode.apply(null,Array.from(Z))}let O=btoa(B),z=u+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify(y)+u+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+O+v,V,M;o?(V=`https://www.googleapis.com/upload/drive/v3/files/${o}?uploadType=multipart&fields=id,name`,M="PATCH"):(V="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",M="POST");let D=await fetch(V,{method:M,headers:{Authorization:`Bearer ${r}`,"Content-Type":`multipart/related; boundary=${p}`},body:z});if(D.status===401)throw new Error("unauthorized");if(!D.ok)throw new Error("drive upload failed")}async function al(e){l("Auth expired, attempting silent token refresh",null,"warn"),!await Iu()&&(l("Silent OAuth: falling back to sign-out",null,"warn"),Tt({isSignedIn:!1,accessToken:null,userName:null,email:null}),await vo(),await tn(),tt("error","Authorization expired. Please sign in again."),xe())}async function Hu(e){if(!dr())throw e?.silent||tt("error","Configure a backup destination first"),new Error("no-backup-destination");await Pu();let t=await Ws({includeDeleted:!0});if(t.totalTimestamps===0){e?.silent||l("Skipping export: no timestamps to back up");return}let n=At();if(!n.accessToken)throw new Error("unauthorized");let r=await rl(n.accessToken);await zu(t.filename,t.json,r,n.accessToken),l(`Exported backup to Google Drive (${t.filename}) with ${t.totalVideos} videos / ${t.totalTimestamps} timestamps.`)}async function sl(){try{let[e,t,n]=await Promise.all([fo("lastAutoBackupAt"),fo("autoBackupEnabled"),fo("autoBackupIntervalMinutes")]),r=Dr.partial().safeParse({autoBackupEnabled:t,autoBackupIntervalMinutes:n,lastAutoBackupAt:typeof e=="number"&&e>0?e:null});r.success?(typeof r.data.autoBackupEnabled=="boolean"&&Nr(r.data.autoBackupEnabled),typeof r.data.autoBackupIntervalMinutes=="number"&&Gr(r.data.autoBackupIntervalMinutes),typeof r.data.lastAutoBackupAt=="number"&&_r(r.data.lastAutoBackupAt)):l("Failed to validate auto backup settings:",r.error.message,"warn")}catch(e){l("Failed to load auto backup settings:",e,"error")}}async function di(){try{let e=We().auth,t={autoBackupEnabled:e.autoBackupEnabled,autoBackupIntervalMinutes:e.autoBackupIntervalMinutes,lastAutoBackupAt:e.lastAutoBackupAt},n=Dr.safeParse(t);if(!n.success){l("Invalid auto backup settings, cannot save",{settings:t,errors:n.error.message},"error");return}await Promise.all([mo("autoBackupEnabled",e.autoBackupEnabled),mo("autoBackupIntervalMinutes",e.autoBackupIntervalMinutes),mo("lastAutoBackupAt",e.lastAutoBackupAt)])}catch(e){l("Failed to save auto backup settings:",e,"error")}}function Ou(){cr&&(clearInterval(cr),cr=null),Ke&&(clearTimeout(Ke),Ke=null)}function vn(e){try{let t=new Date(e),n=new Date,r=t.toDateString()===n.toDateString(),a=t.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return r?a:`${t.toLocaleDateString()} ${a}`}catch{return""}}function oi(){let e=Bu();return e.length>0?`Destinations: ${e.join(", ")}`:"No backup destination configured"}function ll(){let e=We().auth;return e.autoBackupEnabled?e.isAutoBackupRunning?"#4285f4":e.autoBackupBackoffMs&&e.autoBackupBackoffMs>0?"#ffa500":Gn()&&e.lastAutoBackupAt?"#52c41a":Gn()?"#ffa500":"#ff4d4f":"#ff4d4f"}function xe(){if(pi(),!se)return;let e=We().auth;if(!e.autoBackupEnabled)ae(se,"refresh","Backup: Off"),se.onmouseenter=null,se.onmouseleave=null;else if(e.isAutoBackupRunning)ae(se,"refresh","Backing up\u2026"),se.onmouseenter=null,se.onmouseleave=null;else if(e.autoBackupBackoffMs&&e.autoBackupBackoffMs>0){let n=Math.ceil(e.autoBackupBackoffMs/6e4);ae(se,"alert-triangle",`Retry in ${n}m`),se.onmouseenter=null,se.onmouseleave=null}else if(!Gn())ae(se,"alert-triangle","Backup target missing"),se.onmouseenter=null,se.onmouseleave=null;else if(e.lastAutoBackupAt){let n=e.lastAutoBackupAt,r=n+Math.max(1,Rt())*60*1e3,a=vn(r);se.onmouseenter=()=>{ae(se,"database",`Next backup: ${a}`)},se.onmouseleave=()=>{ae(se,"database",`Last backup: ${vn(n)}`)},ae(se,"database",`Last backup: ${vn(n)}`)}else{let n=Date.now()+Math.max(1,Rt())*60*1e3,r=vn(n);se.onmouseenter=()=>{ae(se,"database",`Next backup: ${r}`)},se.onmouseleave=()=>{ae(se,"database","Last backup: never")},ae(se,"database","Last backup: never")}se.style.display="inline";let t=ll();se.style.color=t}var ri="ytls-backup-indicator--pulsing",Fu="#4285f4",Nn=null;function Nu(e,t){Nn&&(e.removeEventListener("animationiteration",Nn),Nn=null),t===Fu?(e.style.backgroundColor=t,e.classList.add(ri)):e.classList.contains(ri)?(Nn=()=>{yn&&(yn.classList.remove(ri),yn.style.backgroundColor=t,Nn=null)},e.addEventListener("animationiteration",Nn,{once:!0})):e.style.backgroundColor=t}function pi(){if(!yn)return;let e=ll();Nu(yn,e),et(yn,()=>{let t=We().auth,n="";if(!t.autoBackupEnabled)n="Auto backup is disabled";else if(t.isAutoBackupRunning)n="Backup in progress";else if(t.autoBackupBackoffMs&&t.autoBackupBackoffMs>0)n=`Retrying backup in ${Math.ceil(t.autoBackupBackoffMs/6e4)}m`;else if(!Gn())n=oi();else if(t.lastAutoBackupAt){let r=t.lastAutoBackupAt+Math.max(1,Rt())*60*1e3,a=vn(r);n=`Last backup: ${vn(t.lastAutoBackupAt)}
Next backup: ${a}
${oi()}`}else{let r=Date.now()+Math.max(1,Rt())*60*1e3;n=`No backup yet
Next backup: ${vn(r)}
${oi()}`}return n})}async function ho(e={}){let{silent:t=!0,skipBackoff:n=!1}=e;if(!Gn()){t||(xe(),dr()||Lu());return}if(Ke){if(!n){l("Auto backup: backoff in progress, skipping scheduled run");return}clearTimeout(Ke),Ke=null,Fn(null),l("Auto backup: manual run cleared backoff and will proceed immediately")}if(!We().auth.isAutoBackupRunning){Ur(!0),xe();try{await Hu({silent:t}),_r(Date.now()),ar(0),Fn(null),Ke&&(clearTimeout(Ke),Ke=null),await di()}catch(r){if(l("Auto backup failed:",r,"error"),r.message==="unauthorized"){l("Auth error detected, clearing token and stopping retries",null,"warn");let o=At();Tt({...o,accessToken:null,isSignedIn:!1}),await vo(),tt("error","Authorization expired. Please sign in again."),xe(),ar(0),Fn(null),Ke&&(clearTimeout(Ke),Ke=null)}else if(We().auth.autoBackupRetryAttempts<Us){let o=We().auth.autoBackupRetryAttempts+1;ar(o);let s=Math.min(Eu*Math.pow(2,o-1),Mu);Fn(s),Ke&&clearTimeout(Ke),Ke=setTimeout(()=>{ho({silent:!0})},s),l(`Scheduling backup retry ${o}/${Us} in ${Math.round(s/1e3)}s`),xe()}else Fn(null)}finally{Ur(!1),xe()}}}async function tn(e=!1){if(Ou(),!!go()&&Gn()){if(cr=setInterval(()=>{ho({silent:!0})},Math.max(1,Rt())*60*1e3),!e){let t=Date.now(),n=Math.max(1,Rt())*60*1e3,r=We().auth.lastAutoBackupAt;(!r||t-r>=n)&&ho({silent:!0})}xe()}}async function cl(){let e=go();Nr(!e),await di(),await tn(),xe()}async function ul(){let e=Rt(),t=prompt("Set Auto Backup interval (minutes):",String(e));if(t===null)return;let n=Math.floor(Number(t));if(!Number.isFinite(n)||n<5||n>1440){alert("Please enter a number between 5 and 1440 minutes.");return}Gr(n),await di(),await tn(),xe()}function mi(e,t){return tr(e).then(n=>n!==void 0?n:t)}function fi(e,t){return er(e,t),Promise.resolve()}var hi=window.location.hash;if(hi&&hi.length>1){let e=new URLSearchParams(hi.substring(1));if(e.get("state")==="timekeeper_auth"){let n=e.get("access_token");if(n){console.log("[Timekeeper] Auth token detected in URL, broadcasting token"),console.log("[Timekeeper] Token length:",n.length,"characters");try{let r=new BroadcastChannel("timekeeper_oauth"),a={type:"timekeeper_oauth_token",token:n};console.log("[Timekeeper] Sending auth message via BroadcastChannel:",{type:a.type,tokenLength:n.length}),r.postMessage(a),r.close(),console.log("[Timekeeper] Token broadcast via BroadcastChannel completed")}catch(r){console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",r);let a={type:"timekeeper_oauth_token",token:n,timestamp:Date.now()},o=indexedDB.open("ytls-timestamps-db",4);o.onsuccess=()=>{let c=o.result,s=c.transaction("settings","readwrite");s.objectStore("settings").put({key:"oauth_message",value:a}),s.oncomplete=()=>{console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",a.timestamp),c.close()}}}if(history.replaceState){let r=window.location.pathname+window.location.search;history.replaceState(null,"",r)}throw console.log("[Timekeeper] Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}Ts();(async function(){"use strict";if(window.top!==window.self)return;function e(i){return mi(i,void 0)}function t(i,d){return fi(i,d)}ci(e),li(t);try{let i=await tr("device_id"),d=typeof i=="string"&&i.length>0?i:crypto.randomUUID();await er("device_id",d),l(`Lamport: device_id = ${d}`)}catch(i){l("Lamport: failed to initialize device_id:",i,"warn")}if(await tl()){l("OAuth popup detected, broadcasting token and closing");return}await ui();let r=["/watch","/live"];function a(i=window.location.href){try{let d=new URL(i);return d.origin!=="https://www.youtube.com"?!1:r.some(m=>d.pathname===m||d.pathname.startsWith(`${m}/`))}catch(d){return l("Timekeeper failed to parse URL for support check:",d,"error"),!1}}let o=null,c=null,s=null,h=null,p=null,u=null,v=(()=>{try{let i=parseFloat(localStorage.getItem("ytls-last-speed")??"");return Number.isFinite(i)&&i>0&&i!==1?Math.min(i,4):2}catch{return 2}})(),y=!1,E=null,B=null,O=250,z=null;function V(){return We().ui.minPaneHeight}function M(i){us(i)}function D(i){ps(i)}function Q(){return We().ui.urlChangeHandlersSetup}function Z(i){ms(i)}function pe(){return We().ui.panePosition}function ee(i){ds(i)}function j(i){fs(i)}function N(){return o?o.getBoundingClientRect():null}function he(i,d,m){i&&ee({x:Math.round(typeof d=="number"?d:i.left),y:Math.round(typeof m=="number"?m:i.top),width:Math.round(i.width),height:Math.round(i.height)})}function le(i=!0){if(!o)return;Tn();let d=N();if(d&&(d.width||d.height)&&(he(d),i)){let m=pe();zo("windowPosition",m),Vn({type:"window_position_updated",position:m,timestamp:Date.now()})}}function ve(){if(!o||!c||!h||!s)return;let i=40,d=Ee();if(d.length>0)i=d[0].offsetHeight;else{let m=document.createElement("li");m.style.visibility="hidden",m.style.position="absolute",m.textContent="00:00 Example",s.appendChild(m),i=m.offsetHeight,s.removeChild(m)}O=c.offsetHeight+h.offsetHeight+i,M(O),o.style.minHeight=V()+"px"}function pt(){requestAnimationFrame(()=>{Le?.(),ve(),le(!0)})}function Ge(i=450){Se&&(clearTimeout(Se),Se=null),Se=setTimeout(()=>{ke(),pt(),Se=null},i)}function De(){Se&&(clearTimeout(Se),Se=null)}function ye(){s&&(s.style.visibility="hidden",l("Hiding timestamps during show animation")),pt(),Ge()}function ce(){ke(),De(),mt&&(clearTimeout(mt),mt=null),mt=setTimeout(()=>{o&&(o.style.display="none",Oi(),mt=null)},400)}function ke(){if(!s){nt&&(nt(),nt=null,Ht=null,an=null);return}if(!an){s.style.visibility==="hidden"&&(s.style.visibility="",l("Restoring timestamp visibility (no deferred fragment)")),nt&&(nt(),nt=null,Ht=null);return}l("Appending deferred timestamps after animation"),s.appendChild(an),an=null,Wt(),Kt(),s.style.visibility==="hidden"&&(s.style.visibility="",l("Restoring timestamp visibility after append")),nt&&(nt(),nt=null,Ht=null),yt(),_e(),Le&&requestAnimationFrame(Le),bt(!0)}let ue=null,Ce=!1,be="ytls-timestamp-pending-delete",we="ytls-timestamp-highlight";async function Ue(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(i=>setTimeout(i,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(i=>setTimeout(i,100));await new Promise(i=>setTimeout(i,200))}let Pe=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],de=5e3,it=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function zt(i){return it.has(i)}function Te(){return document.querySelector("video")}let at=null;function te(){if(at&&document.contains(at))return at;let i=document.getElementById("movie_player");return i&&document.contains(i)?i:null}function jt(i){return(Math.round(i*100)/100).toFixed(2).replace(/\.0+?$|(?<=\.[0-9])0+$/g,"")}function nn(i){let d=i===1?2:i;v=d;try{localStorage.setItem("ytls-last-speed",String(d))}catch{}}function Et(i){if(!u)return;let d=typeof i=="number"?i:Te()?.playbackRate??1,m=jt(d);u.dataset.speed!==m&&(u.dataset.speed=m,u.textContent=`${m}x`,u.setAttribute("aria-label",`Playback speed ${m}x`)),Math.abs(d-1)>.01?u.classList.add("ytls-playback-speed-active"):u.classList.remove("ytls-playback-speed-active")}function _n(i){let d=te(),m=Te();if(y=!0,d&&typeof d.setPlaybackRate=="function")d.setPlaybackRate(i);else if(m)m.playbackRate=i;else return y=!1,!1;return Et(i),!0}function gi(){let i=Te()?.playbackRate;return Number.isFinite(i)?_n(Math.abs(i-1)<=.001?v:1):!1}function dl(i){return i instanceof Element?!!i.closest('input, textarea, select, [contenteditable], [role="textbox"]'):!1}function pr(i){return Pe.every(d=>typeof i?.[d]=="function"?!0:zt(d)?!!Te():!1)}function pl(i){return Pe.filter(d=>typeof i?.[d]=="function"?!1:zt(d)?!Te():!0)}async function ml(i=de){let d=Date.now();for(;Date.now()-d<i;){let b=te();if(pr(b))return b;await new Promise(T=>setTimeout(T,100))}let m=te();return pr(m),m}let vi="timestampOffsetSeconds",fl=-5,yi="shiftClickTimeSkipSeconds",hl=10,mr=300,fr=300,Mt=null;function bi(){try{return new URL(window.location.href).origin==="https://www.youtube.com"}catch{return!1}}function wi(){if(bi()&&!Mt)try{Mt=new BroadcastChannel("ytls_timestamp_channel"),Mt.onmessage=xi}catch(i){l("Failed to create BroadcastChannel:",i,"warn"),Mt=null}}function Vn(i){if(!bi()){l("Skipping BroadcastChannel message: not on https://www.youtube.com","warn");return}if(wi(),!Mt){l("No BroadcastChannel available to post message","warn");return}try{Mt.postMessage(i)}catch(d){l("BroadcastChannel error, reopening:",d,"warn");try{Mt=new BroadcastChannel("ytls_timestamp_channel"),Mt.onmessage=xi,Mt.postMessage(i)}catch(m){l("Failed to reopen BroadcastChannel:",m,"error")}}}function xi(i){if(l("Received message from another tab:",i.data),!(!a()||!s||!o)&&i.data){if(i.data.type==="timestamps_updated"&&i.data.videoId===Ae)l("Debouncing timestamp load due to external update for video:",i.data.videoId),clearTimeout($n),$n=setTimeout(()=>{l("Reloading timestamps due to external update for video:",i.data.videoId),xr()},500);else if(i.data.type==="window_position_updated"&&o){let d=i.data.position;if(d&&typeof d.x=="number"&&typeof d.y=="number"){o.style.left=`${d.x}px`,o.style.top=`${d.y}px`,o.style.right="auto",o.style.bottom="auto",typeof d.width=="number"&&d.width>0&&(o.style.width=`${d.width}px`),typeof d.height=="number"&&d.height>0&&(o.style.height=`${d.height}px`);let m=o.getBoundingClientRect();ee({x:Math.round(d.x),y:Math.round(d.y),width:Math.round(m.width),height:Math.round(m.height)});let b=document.documentElement.clientWidth,T=document.documentElement.clientHeight;(m.left<0||m.top<0||m.right>b||m.bottom>T)&&Tn()}}}}wi();let bn=await mi(vi);(typeof bn!="number"||Number.isNaN(bn))&&(bn=fl,await fi(vi,bn));let jn=await mi(yi);(typeof jn!="number"||Number.isNaN(jn))&&(jn=hl,await fi(yi,jn));let $n=null,on=new Map,rn=!1,G=null,yo=null,Ae=null,mt=null,Se=null,ft=null,Ye=null,$t=null,hr=!1,Le=null,an=null,Ht=null,nt=null,qt=null,bo=!1,gr=!1,wo=null,xo=null,ko=null,To=null,So=null,Ao=null,Eo=null,Mo=null,qn=null,Wn=null,Kn=null,ht=null,gt=null,ki=0,Yn=!1,sn=null,Qn=null,wn=null,Ti=null,Xn=null;function ln(){if(!s)return{items:[],starts:[],rawTimes:[]};if(Ti!==s||!Xn?(Xn?.disconnect(),Xn=new MutationObserver(()=>{wn=null}),Xn.observe(s,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-time"]}),Ti=s,wn=null):Xn.takeRecords().length>0&&(wn=null),!wn){let i=nr(s),d=new Array(i.length),m=new Array(i.length);for(let b=0;b<i.length;b++){let T=i[b].querySelector("[data-time]")?.dataset.time;d[b]=T?Number.parseInt(T,10):NaN,m[b]=T?parseFloat(T):0}wn={items:i,starts:d,rawTimes:m}}return wn}function Ee(){return ln().items}function vr(){return ls(s)}function vt(){return Qn!==null||(Qn=cs(s)),Qn}function Wt(){Qn=null}function gl(i){let d=i.querySelector(".time-diff");return d?(d.textContent?.trim()||"").startsWith("-"):!1}let vl="\u251C\u2500 ",Si="\u2514\u2500 ",Ai=/^[├└]─\s/;function Lo(i){return Ai.test(i)}function Ei(i){return i.replace(Ai,"")}function Mi(i){let d=Ee();if(i>=d.length-1)return Si;let T=d[i+1].querySelector("input");return T&&Lo(T.value)?vl:Si}function yl(i,d){return`${Mi(d)}${i}`}function yt(){if(!s)return;Ee().forEach((d,m)=>{let b=d.querySelector("input");if(!b||!Lo(b.value))return;let T=Ei(b.value),S=yl(T,m);b.value!==S&&(b.value=S)})}function Jn(){or(s),an&&(an=null),nt&&(nt(),nt=null,Ht=null)}function Zn(){ss(s,Ce)}function Li(i){Fr(s,i)}function yr(){rs(s)}function br(i){if(!(!o||!s)){if(Ce=i,i)o.style.display="",o.classList.remove("ytls-fade-out"),o.classList.add("ytls-fade-in"),Li("Loading timestamps...");else if(yr(),o.style.display="",o.classList.remove("ytls-fade-out"),o.classList.add("ytls-fade-in"),p){let d=te();if(d){let m=d.getCurrentTime(),b=Number.isFinite(m)?Math.max(0,Math.floor(m)):Math.max(0,vt()),{isLive:T}=d.getVideoData()||{isLive:!1},S=s?ln().rawTimes:[],x="";if(S.length>0)if(T){let A=Math.max(1,b/60),P=S.filter(I=>I<=b);if(P.length>0){let I=(P.length/A).toFixed(2);parseFloat(I)>0&&(x=` (${I}/min)`)}}else{let A=d.getDuration(),P=Number.isFinite(A)&&A>0?A:0,I=Math.max(1,P/60),C=(S.length/I).toFixed(1);parseFloat(C)>0&&(x=` (${C}/min)`)}p.textContent=`${Gt(b)}${x}`}}!Ce&&s&&!so(s)&&Zn(),Ot()}}function Io(i,d){i.dataset.time=String(d),i.textContent=Gt(d,vt())}let Bo=null,Do=null,Lt=!1;function Ii(i,d){if(!i||typeof i.getVideoData!="function"||!(d!==void 0?d:!!i.getVideoData()?.isLive))return!1;if(typeof i.getProgressState=="function"){let b=i.getProgressState(),T=Number(b?.seekableEnd??b?.liveHead??b?.head??b?.duration),S=Number(b?.current??i.getCurrentTime?.());if(Number.isFinite(T)&&Number.isFinite(S))return T-S>2}return!1}function bl(i,d){if(!Number.isFinite(i))return;let m=Bi(i);wr(m,d)}function bt(i=!1,d){if(rn&&!i)return;let m;if(typeof d=="number"&&Number.isFinite(d))m=Math.max(0,Math.floor(d));else{let b=te(),T=b?b.getCurrentTime():NaN;m=Number.isFinite(T)?Math.max(0,Math.floor(T)):Math.max(0,vt())}Number.isFinite(m)&&bl(m,i)}function Bi(i){if(!Number.isFinite(i))return null;let{items:d,starts:m}=ln(),b=-1,T=-1/0;for(let S=0;S<m.length;S++){let x=m[S];x<=i&&x>T&&(T=x,b=S)}return b>=0?d[b]:null}function wr(i,d=!1){let m=s?s.getElementsByClassName(we):null;if(!(!!m&&(i?m.length===1&&m[0]===i:m.length===0))&&m)for(let T of Array.from(m))T.classList.contains(be)||T.classList.remove(we);if(i&&!i.classList.contains(be)&&(i.classList.add(we),d))try{if(s instanceof HTMLElement){let T=i.getBoundingClientRect(),S=s.getBoundingClientRect();!(T.bottom<S.top||T.top>S.bottom)||i.scrollIntoView({behavior:"smooth",block:"center"})}else i.scrollIntoView({behavior:"smooth",block:"center"})}catch{try{i.scrollIntoView({behavior:"smooth",block:"center"})}catch{}}}function wl(i){if(It()||!Number.isFinite(i)||i===0)return!1;let d=Ee();if(d.length===0)return!1;let m=!1;return d.forEach(b=>{let T=b.querySelector("[data-time]"),S=T?.dataset.time;if(!T||!S)return;let x=Number.parseInt(S,10);if(!Number.isFinite(x))return;let A=Math.max(0,x+i);A!==x&&(Io(T,A),m=!0)}),m?(Kt(),yt(),_e(),Po(Ae),sn=null,!0):!1}function Di(i,d={}){if(!Number.isFinite(i)||i===0)return!1;if(!wl(i)){if(d.alertOnNoChange){let x=d.failureMessage??"Offset did not change any timestamps.";alert(x)}return!1}let b=d.logLabel??"bulk offset";l(`Timestamps changed: Offset all timestamps by ${i>0?"+":""}${i} seconds (${b})`);let T=te(),S=T?Math.floor(T.getCurrentTime()):0;if(Number.isFinite(S)){let x=Bi(S);wr(x,!1)}return!0}function Ci(i){if(!s||Ce)return;let d=i.target instanceof Element?i.target:null;if(!d)return;let m=d.closest("[data-time]"),b=d.closest("[data-increment]"),T=d.closest("[data-action]");if(m?.dataset.time){i.preventDefault();let S=Number(m.dataset.time);if(Number.isFinite(S)){l(`Seeking to timestamp ${S}`),Lt=!0;let A=te();A&&A.seekTo(S),setTimeout(()=>{Lt=!1},500)}let x=m.closest("li");x&&(Ee().forEach(A=>{A.classList.contains(be)||A.classList.remove(we)}),x.classList.contains(be)||(x.classList.add(we),x.scrollIntoView({behavior:"smooth",block:"center"})))}else if(b?.dataset.increment){i.preventDefault();let S=b.closest("li"),x=S?.querySelector("[data-time]");if(!x||!x.dataset.time)return;let A=parseInt(x.dataset.time,10),P=parseInt(b.dataset.increment,10);if("shiftKey"in i&&i.shiftKey&&(P*=jn),"altKey"in i?i.altKey:!1){Di(P,{logLabel:"Alt adjust"});return}let F=Math.max(0,A+P);if(l(`Timestamps changed: Timestamp time incremented from ${A} to ${F}`),Wt(),Io(x,F),Do=F,Bo&&clearTimeout(Bo),Lt=!0,Bo=setTimeout(()=>{if(Do!==null){let Y=te();Y&&Y.seekTo(Do)}Bo=null,Do=null,setTimeout(()=>{Lt=!1},500)},500),Kt(),yt(),_e(),S){let Y=S.querySelector("input"),me=S.dataset.guid;Y&&me&&(xn(Ae,me,F,Y.value),sn=me)}}else T?.dataset.action==="clear"&&(i.preventDefault(),l("Timestamps changed: All timestamps cleared from UI"),s.textContent="",Wt(),_e(),Co(),Po(Ae,{allowEmpty:!0}),sn=null,Zn())}function eo(i,d="",m=!1,b=null,T=!0){if(!s)return null;let S=Math.max(0,i),x=b??crypto.randomUUID(),A=document.createElement("li"),P=document.createElement("div"),I=document.createElement("span"),C=document.createElement("span"),F=document.createElement("span"),Y=document.createElement("div"),me=document.createElement("span"),Qe=document.createElement("span"),K=document.createElement("input"),Me=document.createElement("button");A.dataset.guid=x,P.className="time-row",Y.className="ytls-row-controls";let Ve=document.createElement("div");Ve.style.cssText="position:absolute;left:0;top:0;width:20px;height:20px;display:flex;align-items:center;justify-content:center;cursor:pointer;",et(Ve,"Click to toggle indent");let je=document.createElement("span");je.style.cssText="color:#f4ba78;pointer-events:none;display:none;line-height:0;";let Yt=()=>{let $=K.offsetTop,q=K.offsetHeight||20;Ve.style.top=`${$}px`,Ve.style.height=`${q}px`},cn=()=>{He(je,Lo(K.value)?"indent-decrease":"indent-increase",18)},Sn="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",Qt=$=>{let q=je.querySelector("svg");q&&(q.style.transition="filter 0.15s ease",q.style.filter=$?Sn:"none")},An=$=>{$.stopPropagation();let q=Lo(K.value),re=Ei(K.value),J="";if(!q){let st=Ee().indexOf(A);J=Mi(st)}K.value=J?`${J}${re}`:re,cn(),yt();let ge=Number.parseInt(me.dataset.time??"0",10);xn(Ae,x,ge,K.value)};Ve.onclick=An,Ve.append(je),Ve.addEventListener("mouseenter",()=>{Qt(!0)}),Ve.addEventListener("mouseleave",()=>{Qt(!1)}),A.style.cssText="position:relative;padding-left:20px;",A.addEventListener("mouseenter",()=>{Yt(),cn(),je.style.display="inline"}),A.addEventListener("mouseleave",()=>{Qt(!1),je.style.display="none"}),A.addEventListener("mouseleave",()=>{A.dataset.guid===sn&&gl(A)&&Pi()}),K.value=d||"",K.style.cssText="width:100%;margin-top:5px;display:block;",K.type="text",K.setAttribute("inputmode","text"),K.autocapitalize="off",K.autocomplete="off",K.spellcheck=!1,requestAnimationFrame(Yt);let to=!1;K.addEventListener("focusin",()=>{Yn=!1,to=!1}),K.addEventListener("focusout",$=>{let q=$.relatedTarget,re=Date.now()-ki<250,J=!!q&&!!o&&o.contains(q);!re&&!J&&!to&&(Yn=!0,setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(K.focus({preventScroll:!0}),Yn=!1)},0))}),K.addEventListener("keydown",$=>{($.key==="Escape"||$.key==="Esc")&&($.preventDefault(),to=!0,K.blur())}),K.addEventListener("input",$=>{let q=$;if(q&&(q.isComposing||q.inputType==="insertCompositionText"))return;let re=on.get(x);re&&clearTimeout(re);let J=setTimeout(()=>{let ge=Number.parseInt(me.dataset.time??"0",10);xn(Ae,x,ge,K.value),on.delete(x)},500);on.set(x,J)}),K.addEventListener("compositionend",()=>{let $=Number.parseInt(me.dataset.time??"0",10);setTimeout(()=>{xn(Ae,x,$,K.value)},50)});let Ho="#f4ba78",Ft="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",Oo="#c8452d",Fo="drop-shadow(0 0 4px #e36a52) drop-shadow(0 0 8px #e36a52)",un=($,q=Ho,re=Ft)=>{$.style.color=q;let J=$.querySelector("svg");J&&(J.style.transition="filter 0.15s ease"),$.addEventListener("mouseenter",()=>{J&&(J.style.filter=re)}),$.addEventListener("mouseleave",()=>{J&&(J.style.filter="none")})};He(I,"circle-minus",18),I.classList.add("ytls-row-control"),I.dataset.increment="-1",I.style.cursor="pointer",I.style.margin="0px",un(I),He(F,"circle-plus",18),F.classList.add("ytls-row-control"),F.dataset.increment="1",F.style.cursor="pointer",F.style.margin="0px",un(F),He(C,"current-location",18),C.classList.add("ytls-row-control"),C.style.cursor="pointer",C.style.margin="0px",et(C,"Set to current playback time"),un(C),C.onclick=()=>{let $=te(),q=$?Math.floor($.getCurrentTime()):0;Number.isFinite(q)&&(l(`Timestamps changed: set to current playback time ${q}`),Wt(),Io(me,q),Kt(),yt(),xn(Ae,x,q,K.value),sn=x)},Wt(),Io(me,S),me.addEventListener("click",$=>{$.preventDefault(),$.stopPropagation();let q=Number(me.dataset.time);if(!Number.isFinite(q))return;l(`Seeking to timestamp ${q}`),Lt=!0;let re=te();re&&re.seekTo(q);let J=Te();J?.paused&&J.play(),setTimeout(()=>{Lt=!1},500),s?.querySelectorAll(`.${we}`).forEach(ge=>ge.classList.remove(we)),A.classList.contains(be)||(A.classList.add(we),A.scrollIntoView({behavior:"smooth",block:"center"}))}),He(Me,"trash",16),Me.classList.add("ytls-row-control"),Me.style.cssText="background:transparent;border:none;cursor:pointer;margin-left:5px;display:inline-flex;align-items:center;",un(Me,Oo,Fo),Me.onclick=()=>{let $=null,q=null,re=null,J=()=>{try{A.removeEventListener("click",q,!0)}catch{}try{document.removeEventListener("click",q,!0)}catch{}if(s)try{s.removeEventListener("mouseleave",re)}catch{}$&&(clearTimeout($),$=null)};if(A.dataset.deleteConfirmed==="true"){l("Timestamps changed: Timestamp deleted");let ge=A.dataset.guid??"",$e=on.get(ge);$e&&(clearTimeout($e),on.delete(ge)),J(),A.remove(),Wt(),Kt(),yt(),_e(),Co(),kl(Ae,ge),sn=null,Zn()}else{A.dataset.deleteConfirmed="true",A.classList.add(be),A.classList.remove(we);let ge=()=>{A.dataset.deleteConfirmed="false",A.classList.remove(be);let $e=te(),st=$e?$e.getCurrentTime():0,En=Number.parseInt(A.querySelector("[data-time]")?.dataset.time??"0",10);Number.isFinite(st)&&Number.isFinite(En)&&st>=En&&A.classList.add(we),J()};q=$e=>{$e.target!==Me&&ge()},re=()=>{A.dataset.deleteConfirmed==="true"&&ge()},A.addEventListener("click",q,!0),document.addEventListener("click",q,!0),s&&s.addEventListener("mouseleave",re),$=setTimeout(()=>{A.dataset.deleteConfirmed==="true"&&ge(),J()},5e3)}},Qe.className="time-diff",Qe.style.color="#888",Qe.style.marginLeft="5px",Y.append(I,C,F,Me),P.append(me,Y,Qe),A.append(Ve,P,K);let No=Number.parseInt(me.dataset.time??"0",10);if(T){yr();let $=!1,q=Ee();for(let re=0;re<q.length;re++){let J=q[re],$e=J.querySelector("[data-time]")?.dataset.time;if(!$e)continue;let st=Number.parseInt($e,10);if(Number.isFinite(st)&&No<st){s.insertBefore(A,J),$=!0;break}}$||s.appendChild(A),A.scrollIntoView({behavior:"smooth",block:"center"}),Wt(),Kt(),Co(),yt(),_e(),m||(xn(Ae,x,S,d),sn=x,wr(A,!1))}else K.__ytls_li=A;return K}function Kt(){if(It())return;let i=vt(),d=Ee();d.forEach((m,b)=>{let T=m.querySelector(".time-diff"),S=m.querySelector("[data-time]"),x=S?.dataset.time;if(S&&x){let Qe=Number.parseInt(x,10);Number.isFinite(Qe)&&(S.textContent=Gt(Qe,i))}if(!T)return;if(!x){T.textContent="";return}let A=Number.parseInt(x,10);if(!Number.isFinite(A)){T.textContent="";return}if(b===0){T.textContent="";return}let C=d[b-1].querySelector("[data-time]")?.dataset.time;if(!C){T.textContent="";return}let F=Number.parseInt(C,10);if(!Number.isFinite(F)){T.textContent="";return}let Y=A-F,me=Y<0?"-":"";T.textContent=` ${me}${Gt(Math.abs(Y))}`})}function Pi(){if(It())return;let i=null;if(document.activeElement instanceof HTMLInputElement&&s.contains(document.activeElement)){let x=document.activeElement,P=x.closest("li")?.dataset.guid;if(P){let I=x.selectionStart??x.value.length,C=x.selectionEnd??I,F=x.scrollLeft;i={guid:P,start:I,end:C,scroll:F}}}let d=Ee();if(d.length===0)return;let m=d.map(x=>x.dataset.guid),b=d.map(x=>{let A=x.querySelector("[data-time]"),P=A?.dataset.time;if(!A||!P)return null;let I=Number.parseInt(P,10);if(!Number.isFinite(I))return null;let C=x.dataset.guid??"";return{time:I,guid:C,element:x}}).filter(x=>x!==null).sort((x,A)=>{let P=x.time-A.time;return P!==0?P:x.guid.localeCompare(A.guid)}),T=b.map(x=>x.guid),S=m.length!==T.length||m.some((x,A)=>x!==T[A]);if(s.replaceChildren(),b.forEach(x=>{s.appendChild(x.element)}),Kt(),yt(),_e(),i){let A=Ee().find(P=>P.dataset.guid===i.guid)?.querySelector("input");if(A)try{A.focus({preventScroll:!0})}catch{}}S&&(l("Timestamps changed: Timestamps sorted"),Po(Ae))}function Co(){if(!s||!o||!c||!h)return;let i=Ee().length;Le?.();let d=o.getBoundingClientRect(),m=c.getBoundingClientRect(),b=h.getBoundingClientRect(),T=Math.max(0,d.height-(m.height+b.height));i===0?(Zn(),s.style.overflowY="hidden"):s.style.overflowY=s.scrollHeight>T?"auto":"hidden"}function _e(){if(!s)return;let i=Te(),d=document.querySelector(".ytp-progress-bar"),m=te(),b=m?m.getVideoData():null,T=!!b&&!!b.isLive;if(!i||!d||!isFinite(i.duration)||T)return;zi();let{items:S,starts:x}=ln(),A=i.duration,P=document.createDocumentFragment();S.forEach((I,C)=>{let F=x[C];if(!Number.isFinite(F))return;I.dataset.guid||(I.dataset.guid=crypto.randomUUID());let Y=document.createElement("div");Y.className="ytls-marker",Y.style.left=F/A*100+"%",Y.dataset.time=String(F),P.appendChild(Y)}),d.appendChild(P),xl(d)}function xl(i){i.dataset.ytlsMarkerClicks||(i.dataset.ytlsMarkerClicks="1",i.addEventListener("click",d=>{let m=d.target?.closest?.(".ytls-marker");if(!m)return;let b=Number(m.dataset.time),T=te();T&&Number.isFinite(b)&&T.seekTo(b)}))}function Po(i,d={}){if(!s||It()||!i)return;if(Ce){l("Save blocked: timestamps are currently loading");return}yt();let m=vr().sort((b,T)=>b.start-T.start);if(m.length===0&&!d.allowEmpty){l("Save skipped: no timestamps to save");return}j(m),Hi(i,m).then(()=>{l(`Successfully saved ${m.length} timestamps for ${i} to IndexedDB`),Ro()}).catch(b=>{let T=`Failed to save timestamps: ${b.message}`;l(`Failed to save timestamps for ${i} to IndexedDB:`,b,"error"),kn(T)}),Vn({type:"timestamps_updated",videoId:i,action:"saved"})}function xn(i,d,m,b){if(!i||Ce||It())return;let T={guid:d,start:m,comment:b};l(`Saving timestamp: guid=${d}, start=${m}, comment="${b}"`),Ll(i,T).then(()=>{s&&Ro()}).catch(S=>{let x=`Failed to save timestamp: ${S.message}`;l(`Failed to save timestamp ${d}:`,S,"error"),kn(x)}),Vn({type:"timestamps_updated",videoId:i,action:"saved"})}function kl(i,d){!i||Ce||It()||(Il(i,d).then(()=>{s&&Ro()}).catch(m=>{let b=`Failed to delete timestamp: ${m.message}`;l(`Failed to delete timestamp ${d}:`,m,"error"),kn(b)}),Vn({type:"timestamps_updated",videoId:i,action:"saved"}))}async function Ri(i){if(It()){alert("Cannot export timestamps while an error is being displayed.");return}let d=Ae;if(!d)return;l(`Exporting timestamps for video ID: ${d}`);let m=vr(),b=Math.max(vt(),0),T=mn();if(i==="json"){let S=new Blob([JSON.stringify(m,null,2)],{type:"application/json"}),x=URL.createObjectURL(S),A=document.createElement("a");A.href=x,A.download=`timestamps-${d}-${T}.json`,A.click(),URL.revokeObjectURL(x)}else if(i==="text"){let S=m.map(I=>{let C=Gt(I.start,b),F=`${I.comment} <!-- guid:${I.guid} -->`.trimStart();return`${C} ${F}`}).join(`
`),x=new Blob([S],{type:"text/plain"}),A=URL.createObjectURL(x),P=document.createElement("a");P.href=A,P.download=`timestamps-${d}-${T}.txt`,P.click(),URL.revokeObjectURL(A)}}function kn(i){if(!o||!s){l("Timekeeper error:",i,"error");return}is(s,i),Vr(i),_e()}function Ro(){s&&(as(s),Vr(null))}function It(){return!!(!s||so(s)||Ce||hs()!==null)}function zi(){document.querySelectorAll(".ytls-marker").forEach(i=>i.remove())}function Tn(){if(!o||!document.body.contains(o))return;let i=o.getBoundingClientRect(),d=document.documentElement.clientWidth,m=document.documentElement.clientHeight,b=i.width,T=i.height;if(i.left<0&&(o.style.left="0",o.style.right="auto"),i.right>d){let S=Math.max(0,d-b);o.style.left=`${S}px`,o.style.right="auto"}if(i.top<0&&(o.style.top="0",o.style.bottom="auto"),i.bottom>m){let S=Math.max(0,m-T);o.style.top=`${S}px`,o.style.bottom="auto"}}function Tl(){if(wo&&(document.removeEventListener("mousemove",wo),wo=null),xo&&(document.removeEventListener("mouseup",xo),xo=null),qn&&(document.removeEventListener("keydown",qn),qn=null),ko&&(window.removeEventListener("resize",ko),ko=null),Wn&&(document.removeEventListener("pointerdown",Wn,!0),Wn=null),Kn&&(document.removeEventListener("pointerup",Kn,!0),Kn=null),ht){try{ht.disconnect()}catch{}ht=null}if(gt){try{gt.disconnect()}catch{}gt=null}let i=Te();i&&(To&&(i.removeEventListener("timeupdate",To),To=null),So&&(i.removeEventListener("pause",So),So=null),Ao&&(i.removeEventListener("play",Ao),Ao=null),Eo&&(i.removeEventListener("seeking",Eo),Eo=null),Mo&&(i.removeEventListener("ratechange",Mo),Mo=null))}function Sl(){zi(),on.forEach(d=>clearTimeout(d)),on.clear(),$n&&(clearTimeout($n),$n=null),ue&&(clearInterval(ue),ue=null),mt&&(clearTimeout(mt),mt=null),Tl(),Na();try{Mt.close()}catch{}if(G&&G.parentNode===document.body&&document.body.removeChild(G),G=null,yo=null,rn=!1,Ae=null,ht){try{ht.disconnect()}catch{}ht=null}if(gt){try{gt.disconnect()}catch{}gt=null}o&&o.parentNode&&o.remove();let i=document.getElementById("ytls-header-button");i&&i.parentNode&&i.remove(),qt=null,bo=!1,ee(null),Jn(),o=null,c=null,s=null,h=null,Ye=null,$t=null,Le=null,p=null,u=null,E=null,at=null}async function Al(){let i=kr();if(!i)return at=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let d=await ml();if(!pr(d)){let m=pl(d),b=m.length?` Missing methods: ${m.join(", ")}.`:"",T=d?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return at=null,{ok:!1,message:`${T}${b} Try refreshing once playback is ready.`}}return at=d,{ok:!0,player:d,videoId:i}}async function xr(){if(!o||!s)return;let i=s.scrollTop,d=!0,m=()=>{if(!s||!d)return;let b=Math.max(0,s.scrollHeight-s.clientHeight);s.scrollTop=Math.min(i,b)};try{let b=await Al();if(!b.ok){kn(b.message),Jn(),_e();return}let{videoId:T}=b,S=[];try{let x=await Bl(T);x?(S=x.map(A=>({...A,guid:A.guid||crypto.randomUUID()})),l(`Loaded ${S.length} timestamps from IndexedDB for ${T}`),Ro()):l(`No timestamps found in IndexedDB for ${T}`)}catch(x){let A=`Failed to load timestamps: ${x.message}`;l(`Failed to load timestamps from IndexedDB for ${T}:`,x,"error"),kn(A),_e();return}if(S.length>0){S.sort((P,I)=>P.start-I.start),Jn(),yr();let x=document.createDocumentFragment();S.forEach(P=>{let C=eo(P.start,P.comment,!0,P.guid,!1).__ytls_li;C&&x.appendChild(C)}),o&&o.classList.contains("ytls-zoom-in")&&Se!=null?(l("Deferring timestamp DOM append until show animation completes"),an=x,Ht||(Ht=new Promise(P=>{nt=P})),await Ht):s&&(s.appendChild(x),Wt(),Kt(),yt(),_e(),Le&&requestAnimationFrame(Le)),j(S),bt(!0),d=!1}else Jn(),Li("No timestamps for this video"),_e(),j([]),Le&&requestAnimationFrame(Le)}catch(b){l("Unexpected error while loading timestamps:",b,"error"),kn("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{Ht&&await Ht,requestAnimationFrame(m),Le&&requestAnimationFrame(Le),s&&!so(s)&&Zn()}}function kr(){let d=new URLSearchParams(location.search).get("v");if(d)return d;let m=document.querySelector('meta[itemprop="identifier"]');return m?.content?m.content:null}function El(i=null,d=null){if(!p)return;let m=Te(),b=d||te();if(!m&&!b)return;let T=i!==null?i:b?b.getCurrentTime():0,S=Number.isFinite(T)?Math.max(0,Math.floor(T)):Math.max(0,vt()),{isLive:x}=b?b.getVideoData()||{isLive:!1}:{isLive:!1},A=b?Ii(b,!!x):!1,P=s?ln().rawTimes:[],I="";if(P.length>0)if(x){let C=Math.max(1,S/60),F=P.filter(Y=>Y<=S);if(F.length>0){let Y=(F.length/C).toFixed(2);parseFloat(Y)>0&&(I=` (${Y}/min)`)}}else{let C=b?b.getDuration():0,F=Number.isFinite(C)&&C>0?C:m&&Number.isFinite(m.duration)&&m.duration>0?m.duration:0,Y=Math.max(1,F/60),me=(P.length/Y).toFixed(1);parseFloat(me)>0&&(I=` (${me}/min)`)}p.textContent=`${Gt(S)}${I}`,p.style.color=A?"#ff4d4f":""}function Ml(){let i=Te();if(!i)return;let d=NaN,m=null,b=()=>{if(!s)return;let I=te(),C=I?Math.floor(I.getCurrentTime()):0;if(!Number.isFinite(C))return;let F=ln();if(C===d&&F===m)return;let Y=!!p&&!Ce&&!Lt;Y&&El(C,I),bt(!1,C),Y&&!rn&&(d=C,m=F)},T=I=>{try{let C=new URL(window.location.href);I!==null&&Number.isFinite(I)?C.searchParams.set("t",`${Math.floor(I)}s`):C.searchParams.delete("t"),window.history.replaceState(window.history.state,"",C.toString())}catch{}},S=()=>{let I=te(),C=I?I.getCurrentTime():NaN,F=Number.isFinite(C)?Math.max(0,Math.floor(C)):Math.max(0,vt());if(Number.isFinite(F)){T(F);try{bt(!0)}catch(Y){l("Failed to highlight nearest timestamp on pause:",Y,"warn")}}},x=()=>{T(null);try{let I=te(),C=I?I.getCurrentTime():NaN,F=Number.isFinite(C)?Math.max(0,Math.floor(C)):Math.max(0,vt());Number.isFinite(F)&&bt(!0)}catch(I){l("Failed to highlight nearest timestamp on play:",I,"warn")}},A=()=>{let I=Te();if(!I)return;let C=te(),F=C?Math.floor(C.getCurrentTime()):0;Number.isFinite(F)&&(I.paused&&T(F),bt(!0,F))},P=()=>{let I=i.playbackRate;y?y=!1:nn(I),Et(I)};To=b,So=S,Ao=x,Eo=A,Mo=P,i.addEventListener("timeupdate",b),i.addEventListener("pause",S),i.addEventListener("play",x),i.addEventListener("seeking",A),i.addEventListener("ratechange",P)}let{saveToIndexedDB:Hi,saveSingleTimestampToIndexedDB:Ll,deleteSingleTimestampFromIndexedDB:Il,loadFromIndexedDB:Bl,removeFromIndexedDB:Dl,saveGlobalSettings:zo,loadGlobalSettings:Tr,buildExportPayload:Cl,mergeBackupData:Pl,exportAllTimestamps:Rl,exportAllTimestampsCsv:zl}=Or;function Oi(){if(!o)return;let i=o.style.display!=="none";zo("uiVisible",i)}function Ot(i){let d=typeof i=="boolean"?i:!!o&&o.style.display!=="none",m=document.getElementById("ytls-header-button");m instanceof HTMLButtonElement&&m.setAttribute("aria-pressed",String(d)),qt&&!bo&&qt.src!==Jo&&(qt.src=Jo)}function Hl(){o&&Tr("uiVisible").then(i=>{let d=Ko().safeParse(i),m=d.success?d.data:void 0;typeof m=="boolean"?(m?(o.style.display="flex",o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in")):o.style.display="none",Ot(m)):(!d.success&&i!==void 0&&l("UI visibility state failed validation, defaulting to visible",d.error.message,"warn"),o.style.display="flex",o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in"),Ot(!0))}).catch(i=>{l("Failed to load UI visibility state:",i,"error"),o.style.display="flex",o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in"),Ot(!0)})}function Sr(i){if(!o){l("ERROR: togglePaneVisibility called but pane is null");return}document.body.contains(o)||(l("Pane not in DOM during toggle, appending it"),document.querySelectorAll("#ytls-pane").forEach(T=>{T!==o&&T.remove()}),document.body.appendChild(o));let d=document.querySelectorAll("#ytls-pane");d.length>1&&(l(`ERROR: Multiple panes detected in togglePaneVisibility (${d.length}), cleaning up`),d.forEach(T=>{T!==o&&T.remove()})),mt&&(clearTimeout(mt),mt=null);let m=o.style.display==="none";(typeof i=="boolean"?i:m)?(o.style.display="flex",o.classList.remove("ytls-fade-out"),o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in"),Ot(!0),Oi(),ye(),Se&&(clearTimeout(Se),Se=null),Se=setTimeout(()=>{ke(),Le?.(),ve(),le(!0);try{bt(!0)}catch(T){l("Failed to scroll to nearest timestamp after toggle:",T,"warn")}Se=null},450)):(o.classList.remove("ytls-fade-in"),o.classList.remove("ytls-zoom-in"),o.classList.add("ytls-zoom-out"),Ot(!1),ce())}function Fi(i){if(!s){l("UI is not initialized; cannot import timestamps.","warn");return}let d=!1;try{let m=JSON.parse(i),b=null;if(Array.isArray(m))b=m;else if(typeof m=="object"&&m!==null){let T=Ae;if(T){let S=`timekeeper-${T}`;m[S]&&Array.isArray(m[S].timestamps)&&(b=m[S].timestamps,l(`Found timestamps for current video (${T}) in export format`,"info"))}if(!b){let S=Object.keys(m).filter(x=>x.startsWith("ytls-"));if(S.length===1&&Array.isArray(m[S[0]].timestamps)){b=m[S[0]].timestamps;let x=m[S[0]].video_id;l(`Found timestamps for video ${x} in export format`,"info")}}}b&&Array.isArray(b)?b.every(S=>typeof S.start=="number"&&typeof S.comment=="string")?(b.forEach(S=>{if(S.guid){let x=Ee().find(A=>A.dataset.guid===S.guid);if(x){let A=x.querySelector("input");A&&(A.value=S.comment)}else eo(S.start,S.comment,!1,S.guid)}else eo(S.start,S.comment,!1,crypto.randomUUID())}),d=!0):l("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):l("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!d){let m=i.split(`
`).map(b=>b.trim()).filter(b=>b);if(m.length>0){let b=!1;m.forEach(T=>{let S=T.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(S){b=!0;let x=parseInt(S[1])||0,A=parseInt(S[2]),P=parseInt(S[3]),I=x*3600+A*60+P,C=S[4]?S[4].trim():"",F=null,Y=C,me=C.match(/<!--\s*guid:([^>]+?)\s*-->/);me&&(F=me[1].trim(),Y=C.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let Qe;if(F&&(Qe=Ee().find(K=>K.dataset.guid===F)),!Qe&&!F&&(Qe=Ee().find(K=>{if(K.dataset.guid)return!1;let Ve=K.querySelector("[data-time]")?.dataset.time;if(!Ve)return!1;let je=Number.parseInt(Ve,10);return Number.isFinite(je)&&je===I})),Qe){let K=Qe.querySelector("input");K&&(K.value=Y)}else eo(I,Y,!1,F||crypto.randomUUID())}}),b&&(d=!0)}}d?(l("Timestamps changed: Imported timestamps from file/clipboard"),yt(),Po(Ae),_e(),Co()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function Ol(){if(gr){l("Pane initialization already in progress, skipping duplicate call");return}if(!(o&&document.body.contains(o))){gr=!0;try{let T=function(f=null,g=null){if(!p)return;let w=Te(),k=g||te();if(!w&&!k)return;let L=f!==null?f:k?k.getCurrentTime():0,_=Number.isFinite(L)?Math.max(0,Math.floor(L)):Math.max(0,vt()),{isLive:R}=k?k.getVideoData()||{isLive:!1}:{isLive:!1},U=k?Ii(k,!!R):!1,H=s?ln().rawTimes:[],W="";if(H.length>0)if(R){let ie=Math.max(1,_/60),ne=H.filter(Ie=>Ie<=_);if(ne.length>0){let Ie=(ne.length/ie).toFixed(2);parseFloat(Ie)>0&&(W=` (${Ie}/min)`)}}else{let ie=k?k.getDuration():0,ne=Number.isFinite(ie)&&ie>0?ie:w&&Number.isFinite(w.duration)&&w.duration>0?w.duration:0,Ie=Math.max(1,ne/60),ot=(H.length/Ie).toFixed(1);parseFloat(ot)>0&&(W=` (${ot}/min)`)}p.textContent=`${Gt(_)}${W}`,p.style.color=U?"#ff4d4f":"",b(!!R);try{Et()}catch{}},S=function(){if(Ce||Lt)return;let f=te();if(!f)return;let g=f.getCurrentTime(),w=Number.isFinite(g)?Math.max(0,Math.floor(g)):Math.max(0,vt());T(w,f),(s?Ee():[]).length>0&&bt(!1,w)},Me=function(f,g,w,k){let L=document.createElement("button");return k?ae(L,k,f):L.textContent=f,et(L,g),L.classList.add("ytls-settings-modal-button"),L.onclick=w,L},Ve=function(f="general"){if(G&&G.parentNode===document.body){let Re=document.getElementById("ytls-save-modal"),Zt=document.getElementById("ytls-load-modal"),Nt=document.getElementById("ytls-delete-all-modal");Re&&document.body.contains(Re)&&document.body.removeChild(Re),Zt&&document.body.contains(Zt)&&document.body.removeChild(Zt),Nt&&document.body.contains(Nt)&&document.body.removeChild(Nt),G.classList.remove("ytls-fade-in"),G.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(G)&&document.body.removeChild(G),G=null,document.removeEventListener("click",Yt,!0),document.removeEventListener("keydown",je)},300);return}G=document.createElement("div"),G.id="ytls-settings-modal",G.classList.remove("ytls-fade-out"),G.classList.add("ytls-fade-in");let g=document.createElement("div");g.className="ytls-modal-header";let w=document.createElement("div");w.id="ytls-settings-nav";let k=document.createElement("button");k.className="ytls-modal-close-button",He(k,"x",14),k.onclick=()=>{if(G&&G.parentNode===document.body){let Re=document.getElementById("ytls-save-modal"),Zt=document.getElementById("ytls-load-modal"),Nt=document.getElementById("ytls-delete-all-modal");Re&&document.body.contains(Re)&&document.body.removeChild(Re),Zt&&document.body.contains(Zt)&&document.body.removeChild(Zt),Nt&&document.body.contains(Nt)&&document.body.removeChild(Nt),G.classList.remove("ytls-fade-in"),G.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(G)&&document.body.removeChild(G),G=null,document.removeEventListener("click",Yt,!0),document.removeEventListener("keydown",je)},300)}};let L=document.createElement("div");L.id="ytls-settings-content";let _=document.createElement("h3");_.className="ytls-section-heading",_.textContent="General",_.style.display="none";let R=document.createElement("div"),U=document.createElement("div");U.className="ytls-button-grid";function H(Re){R.style.display=Re==="general"?"block":"none",U.style.display=Re==="google"?"block":"none",W.classList.toggle("active",Re==="general"),ne.classList.toggle("active",Re==="google"),_.textContent=Re==="general"?"General":"Google"}let W=document.createElement("button");W.appendChild(ro("adjustments-horizontal",16));let ie=document.createElement("span");ie.className="ytls-tab-text",ie.textContent=" General",W.appendChild(ie),et(W,"General settings"),W.classList.add("ytls-settings-modal-button"),W.onclick=()=>H("general");let ne=document.createElement("button");ne.appendChild(ro("cloud",16));let Ie=document.createElement("span");Ie.className="ytls-tab-text",Ie.textContent=" Google",ne.appendChild(Ie),et(ne,"Google Drive backup settings"),ne.classList.add("ytls-settings-modal-button"),ne.onclick=async()=>{dt.isSignedIn&&await ol(),H("google")},w.appendChild(W),w.appendChild(ne),g.appendChild(w),g.appendChild(k),G.appendChild(g),R.className="ytls-button-grid",R.appendChild(Me("Save","Save As...",cn.onclick,"device-floppy")),R.appendChild(Me("Load","Load",Sn.onclick,"folder-open")),R.appendChild(Me("Export All","Export All Data",Qt.onclick,"file-export")),R.appendChild(Me("Import All","Import All Data",An.onclick,"file-import")),R.appendChild(Me("Export All (CSV)","Export All Timestamps to CSV",async()=>{try{await zl()}catch{alert("Failed to export CSV: Could not read from database.")}},"file-spreadsheet"));let ot=Me(dt.isSignedIn?"Sign Out":"Sign In",dt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{dt.isSignedIn?await nl():await el(),ae(ot,dt.isSignedIn?"logout":"login",dt.isSignedIn?"Sign Out":"Sign In"),et(ot,dt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),xe()},dt.isSignedIn?"logout":"login"),Dn=Me(go()?"Auto Backup: On":"Auto Backup: Off","Toggle Auto Backup",async()=>{await cl(),Jt(),xe()},"refresh"),pn=Me(`Backup Interval: ${Rt()}min`,"Set periodic backup interval (minutes)",async()=>{await ul(),Jt(),xe()},"clock-plus"),Jt=()=>{ae(ot,dt.isSignedIn?"logout":"login",dt.isSignedIn?"Sign Out":"Sign In"),et(ot,dt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),ae(Dn,"refresh",go()?"Auto Backup: On":"Auto Backup: Off"),ae(pn,"clock-plus",`Backup Interval: ${Rt()}min`),typeof xe=="function"&&xe()};U.appendChild(ot),U.appendChild(Dn),U.appendChild(pn),U.appendChild(Me("Backup Now","Run a backup immediately",async()=>{await ho({silent:!1,skipBackoff:!0}),Jt()},"database"));let lt=document.createElement("div");lt.style.marginTop="15px",lt.style.paddingTop="10px",lt.style.borderTop="1px solid #555",lt.style.fontSize="12px",lt.style.color="#aaa";let qo=document.createElement("div");qo.style.marginBottom="8px",qo.style.fontWeight="bold",lt.appendChild(qo),js(qo);let Lr=document.createElement("div");Lr.style.marginBottom="8px",_s(Lr),lt.appendChild(Lr);let Ki=document.createElement("div");Vs(Ki),lt.appendChild(Ki),U.appendChild(lt),tt(),Un(),xe(),Jt(),L.appendChild(_),L.appendChild(R),L.appendChild(U),H(f==="drive"?"google":f),G.appendChild(L),document.body.appendChild(G),requestAnimationFrame(()=>{let Re=G.getBoundingClientRect(),Nt=(window.innerHeight-Re.height)/2;G.style.top=`${Math.max(20,Nt)}px`,G.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",Yt,!0),document.addEventListener("keydown",je)},0)},je=function(f){if(f.key==="Escape"&&G&&G.parentNode===document.body){let g=document.getElementById("ytls-save-modal"),w=document.getElementById("ytls-load-modal"),k=document.getElementById("ytls-delete-all-modal");if(g||w||k)return;f.preventDefault(),g&&document.body.contains(g)&&document.body.removeChild(g),w&&document.body.contains(w)&&document.body.removeChild(w),k&&document.body.contains(k)&&document.body.removeChild(k),G.classList.remove("ytls-fade-in"),G.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(G)&&document.body.removeChild(G),G=null,document.removeEventListener("click",Yt,!0),document.removeEventListener("keydown",je)},300)}},Yt=function(f){if(yo&&yo.contains(f.target))return;let g=document.getElementById("ytls-save-modal"),w=document.getElementById("ytls-load-modal"),k=document.getElementById("ytls-delete-all-modal");g&&g.contains(f.target)||w&&w.contains(f.target)||k&&k.contains(f.target)||G&&G.contains(f.target)||(g&&document.body.contains(g)&&document.body.removeChild(g),w&&document.body.contains(w)&&document.body.removeChild(w),k&&document.body.contains(k)&&document.body.removeChild(k),G&&G.parentNode===document.body&&(G.classList.remove("ytls-fade-in"),G.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(G)&&document.body.removeChild(G),G=null,document.removeEventListener("click",Yt,!0),document.removeEventListener("keydown",je)},300)))},to=function(){o&&(l("Loading window position from IndexedDB"),Tr("windowPosition").then(f=>{let g=Xi.safeParse(f);if(g.success){let k=g.data;o.style.left=`${k.x}px`,o.style.top=`${k.y}px`,o.style.right="auto",o.style.bottom="auto",typeof k.width=="number"&&k.width>0?o.style.width=`${k.width}px`:(o.style.width=`${mr}px`,l(`No stored window width found, using default width ${mr}px`)),typeof k.height=="number"&&k.height>0?o.style.height=`${k.height}px`:(o.style.height=`${fr}px`,l(`No stored window height found, using default height ${fr}px`));let L=N();he(L,k.x,k.y),l("Restored window position from IndexedDB:",pe())}else g.success?l("No window position found in IndexedDB, applying default size and leaving default position"):l("Window position in IndexedDB failed validation:",g.error.message,"warn"),o.style.width=`${mr}px`,o.style.height=`${fr}px`,ee(null);Tn();let w=N();w&&(w.width||w.height)&&he(w),Le?.()}).catch(f=>{l("failed to load pane position from IndexedDB:",f,"warn"),Tn();let g=N();g&&(g.width||g.height)&&ee({x:Math.max(0,Math.round(g.left)),y:0,width:Math.round(g.width),height:Math.round(g.height)}),Le?.()}))},Ho=function(){if(!o)return;let f=N();if(!f)return;let g={x:Math.max(0,Math.round(f.left)),y:Math.max(0,Math.round(f.top)),width:Math.round(f.width),height:Math.round(f.height)},w=pe();if(w&&w.x===g.x&&w.y===g.y&&w.width===g.width&&w.height===g.height){l("Skipping window position save; position and size unchanged");return}ee({...g}),l(`Saving window position and size to IndexedDB: x=${g.x}, y=${g.y}, width=${g.width}, height=${g.height}`),zo("windowPosition",g),Vn({type:"window_position_updated",position:g,timestamp:Date.now()})},_o=function(f,g){f.addEventListener("dblclick",w=>{w.preventDefault(),w.stopPropagation(),o&&(o.style.width="300px",o.style.height="300px",Ho(),$o())}),f.addEventListener("mousedown",w=>{w.preventDefault(),w.stopPropagation(),dn=!0,Xt=g,Ui=w.clientX,_i=w.clientY;let k=o.getBoundingClientRect();Mn=k.width,Ln=k.height,Go=k.left,Uo=k.top,Vi=document.documentElement.clientWidth,ji=document.documentElement.clientHeight,g==="top-left"||g==="bottom-right"?document.body.style.cursor="nwse-resize":document.body.style.cursor="nesw-resize"})},qi=function(){if(!s||!$t)return;let{scrollTop:f,scrollHeight:g,clientHeight:w}=s;if(g<=w)return;let k=Math.max(30,w/g*w),L=f/(g-w)*(w-k);$t.style.height=`${k}px`,$t.style.top=`${L}px`},Wi=function(){Ye&&(Mr===null&&(Mr=requestAnimationFrame(()=>{Mr=null,qi()})),Ye.classList.add("ytls-scrollbar-visible"),ft&&clearTimeout(ft),ft=setTimeout(()=>{Ye?.classList.remove("ytls-scrollbar-visible"),ft=null},500))},$o=function(){if(o&&c&&h&&s){let f=o.getBoundingClientRect(),g=c.getBoundingClientRect(),w=h.getBoundingClientRect(),k=f.height-(g.height+w.height);s.style.maxHeight=k>0?k+"px":"0px",s.style.overflowY=k>0?"auto":"hidden"}};if(document.querySelectorAll("#ytls-pane").forEach(f=>f.remove()),!document.getElementById("ytls-styles")){let f=document.createElement("style");f.id="ytls-styles",f.textContent=za,document.head.appendChild(f)}o=document.createElement("div"),c=document.createElement("div"),s=document.createElement("ul"),h=document.createElement("div"),p=document.createElement("span"),E=document.createElement("span"),B=document.createElement("span"),B.classList.add("ytls-backup-indicator"),B.style.cursor="pointer",B.style.backgroundColor="#666",B.onclick=f=>{f.stopPropagation(),Ve("drive")},s.addEventListener("mouseenter",()=>{rn=!0,Yn=!1}),s.addEventListener("mouseleave",()=>{rn=!1;try{Cr()}catch{}if(Yn)return;bt(!1);let f=null;if(document.activeElement instanceof HTMLInputElement&&s.contains(document.activeElement)&&(f=document.activeElement.closest("li")?.dataset.guid??null),Pi(),f){let w=Ee().find(k=>k.dataset.guid===f)?.querySelector("input");if(w)try{w.focus({preventScroll:!0})}catch{}}}),o.id="ytls-pane",c.id="ytls-pane-header",c.addEventListener("dblclick",f=>{let g=f.target instanceof Element?f.target:null;if(g){let w=g;for(;w&&w!==o;){if(window.getComputedStyle(w).cursor==="pointer")return;w=w.parentElement}}f.preventDefault(),Sr(!1)});let i=f=>{try{f.stopPropagation()}catch{}};["click","dblclick","mousedown","pointerdown","touchstart","wheel"].forEach(f=>{o.addEventListener(f,i)}),o.addEventListener("keydown",f=>{try{f.stopPropagation()}catch{}}),o.addEventListener("keyup",f=>{try{f.stopPropagation()}catch{}}),o.addEventListener("focus",f=>{try{f.stopPropagation()}catch{}},!0),o.addEventListener("blur",f=>{try{f.stopPropagation()}catch{}},!0),E.textContent=`v${Xo}`,E.classList.add("ytls-version-display");let d=document.createElement("span");d.style.display="inline-flex",d.style.alignItems="center",d.style.gap="6px",d.appendChild(E),d.appendChild(B),p.id="ytls-current-time",p.textContent="\u2014",p.style.cursor="default",et(p,()=>{let f=te(),{isLive:g}=f?f.getVideoData()||{isLive:!1}:{isLive:!1};return g?"Skip to live":""}),u=document.createElement("span"),u.id="ytls-playback-speed",u.textContent="1x",u.style.cursor="pointer",u.style.userSelect="none",et(u,()=>`Current playback speed. Click to toggle between 1x and ${jt(v)}x.`),u.onclick=()=>{gi()},u.addEventListener("mousedown",f=>{f.stopPropagation()}),u.addEventListener("click",f=>{f.stopPropagation()}),p.onclick=()=>{let f=te();if(!f)return;let{isLive:g}=f.getVideoData()||{isLive:!1};g&&(Lt=!0,f.seekToLiveHead(),setTimeout(()=>{Lt=!1},500))};let b=f=>{p.style.cursor=f?"pointer":"default"};S(),ue&&clearInterval(ue),ue=setInterval(S,1e3),h.id="ytls-buttons";let x=(f,g)=>()=>{f.classList.remove("ytls-fade-in"),f.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(f)&&document.body.removeChild(f),g&&g()},300)},A=f=>g=>{g.key==="Escape"&&(g.preventDefault(),g.stopPropagation(),f())},P=f=>{setTimeout(()=>{document.addEventListener("keydown",f)},0)},I=(f,g)=>w=>{f.contains(w.target)||g()},C=f=>{setTimeout(()=>{document.addEventListener("click",f,!0)},0)};[{id:"add",icon:"alarm-plus",title:"Add timestamp",action:()=>{if(It())return;let f=typeof bn<"u"?bn:0,g=te(),w=g?Math.floor(g.getCurrentTime()+f):0;if(!Number.isFinite(w))return;let k=eo(w,"");k&&k.focus()}},{id:"settings",icon:"settings",title:"Settings",action:()=>Ve()},{id:"copy",icon:"clipboard",title:"Copy timestamps to clipboard",action:function(f){if(It()){He(this,"circle-x",20),setTimeout(()=>{He(this,"clipboard",20)},2e3);return}let g=vr(),w=Math.max(vt(),0);if(g.length===0){He(this,"circle-x",20),setTimeout(()=>{He(this,"clipboard",20)},2e3);return}let k=f.ctrlKey,L=g.map(_=>{let R=Gt(_.start,w);return k?`${R} ${_.comment} <!-- guid:${_.guid} -->`.trimStart():`${R} ${_.comment}`}).join(`
`);navigator.clipboard.writeText(L).then(()=>{He(this,"circle-check",20),setTimeout(()=>{He(this,"clipboard",20)},2e3)}).catch(_=>{l("Failed to copy timestamps: ",_,"error"),He(this,"circle-x",20),setTimeout(()=>{He(this,"clipboard",20)},2e3)})}},{id:"offset",icon:"clock-plus",title:"Offset all timestamps",action:()=>{if(It())return;if(Ee().length===0){alert("No timestamps available to offset.");return}let g=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(g===null)return;let w=g.trim();if(w.length===0)return;let k=Number.parseInt(w,10);if(!Number.isFinite(k)){alert("Please enter a valid integer number of seconds.");return}k!==0&&Di(k,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{id:"delete",icon:"trash",title:"Delete all timestamps for current video",action:async()=>{let f=kr();if(!f){alert("Unable to determine current video ID.");return}let g=document.createElement("div");g.id="ytls-delete-all-modal",g.classList.remove("ytls-fade-out"),g.classList.add("ytls-fade-in");let w=document.createElement("p");w.textContent="Hold the button to delete all timestamps for:",w.style.marginBottom="10px";let k=document.createElement("p");k.textContent=f,k.style.fontFamily="monospace",k.style.fontSize="12px",k.style.marginBottom="15px",k.style.color="#aaa";let L=document.createElement("button");L.classList.add("ytls-save-modal-button"),L.style.background="#d32f2f",L.style.position="relative",L.style.overflow="hidden";let _=null,R=0,U=null,H=document.createElement("div");H.style.position="absolute",H.style.left="0",H.style.top="0",H.style.height="100%",H.style.width="0%",H.style.background="#ff6b6b",H.style.transition="none",H.style.pointerEvents="none",L.appendChild(H);let W=document.createElement("span");W.textContent="Hold to Delete All",W.style.position="relative",W.style.zIndex="1",L.appendChild(W);let ie=()=>{if(!R)return;let Jt=Date.now()-R,lt=Math.min(Jt/5e3*100,100);H.style.width=`${lt}%`,lt<100&&(U=requestAnimationFrame(ie))},ne=()=>{_&&(clearTimeout(_),_=null),U&&(cancelAnimationFrame(U),U=null),R=0,H.style.width="0%",W.textContent="Hold to Delete All"};L.onmousedown=()=>{R=Date.now(),W.textContent="Deleting...",U=requestAnimationFrame(ie),_=setTimeout(async()=>{ne(),g.classList.remove("ytls-fade-in"),g.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(g)&&document.body.removeChild(g);try{await Dl(f),Ar()}catch(Jt){l("Failed to delete all timestamps:",Jt,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},L.onmouseup=ne,L.onmouseleave=ne;let Ie=null,ot=null,Dn=x(g,()=>{ne(),Ie&&document.removeEventListener("keydown",Ie),ot&&document.removeEventListener("click",ot,!0)});Ie=A(Dn),ot=I(g,Dn);let pn=document.createElement("button");pn.textContent="Cancel",pn.classList.add("ytls-save-modal-cancel-button"),pn.onclick=Dn,g.appendChild(w),g.appendChild(k),g.appendChild(L),g.appendChild(pn),document.body.appendChild(g),P(Ie),C(ot)}}].forEach(f=>{let g=document.createElement("button");He(g,f.icon,20),et(g,f.title),g.classList.add("ytls-main-button"),f.id==="copy"?g.onclick=function(w){f.action.call(this,w)}:g.onclick=f.action,f.id==="settings"&&(yo=g),h.appendChild(g)});let cn=document.createElement("button");ae(cn,"device-floppy","Save"),cn.classList.add("ytls-file-operation-button"),cn.onclick=()=>{let f=document.createElement("div");f.id="ytls-save-modal",f.classList.remove("ytls-fade-out"),f.classList.add("ytls-fade-in");let g=document.createElement("p");g.textContent="Save as:";let w=null,k=null,L=x(f,()=>{w&&document.removeEventListener("keydown",w),k&&document.removeEventListener("click",k,!0)});w=A(L),k=I(f,L);let _=document.createElement("button");_.textContent="JSON",_.classList.add("ytls-save-modal-button"),_.onclick=()=>{w&&document.removeEventListener("keydown",w),k&&document.removeEventListener("click",k,!0),x(f,()=>Ri("json"))()};let R=document.createElement("button");R.textContent="Plain Text",R.classList.add("ytls-save-modal-button"),R.onclick=()=>{w&&document.removeEventListener("keydown",w),k&&document.removeEventListener("click",k,!0),x(f,()=>Ri("text"))()};let U=document.createElement("button");U.textContent="Cancel",U.classList.add("ytls-save-modal-cancel-button"),U.onclick=L,f.appendChild(g),f.appendChild(_),f.appendChild(R),f.appendChild(U),document.body.appendChild(f),P(w),C(k)};let Sn=document.createElement("button");ae(Sn,"folder-open","Load"),Sn.classList.add("ytls-file-operation-button"),Sn.onclick=()=>{let f=document.createElement("div");f.id="ytls-load-modal",f.classList.remove("ytls-fade-out"),f.classList.add("ytls-fade-in");let g=document.createElement("p");g.textContent="Load from:";let w=null,k=null,L=x(f,()=>{w&&document.removeEventListener("keydown",w),k&&document.removeEventListener("click",k,!0)});w=A(L),k=I(f,L);let _=document.createElement("button");_.textContent="File",_.classList.add("ytls-save-modal-button"),_.onclick=()=>{let H=document.createElement("input");H.type="file",H.accept=".json,.txt",H.classList.add("ytls-hidden-file-input"),H.onchange=W=>{let ie=W.target.files?.[0];if(!ie)return;w&&document.removeEventListener("keydown",w),k&&document.removeEventListener("click",k,!0),L();let ne=new FileReader;ne.onload=()=>{let Ie=String(ne.result).trim();Fi(Ie)},ne.readAsText(ie)},H.click()};let R=document.createElement("button");R.textContent="Clipboard",R.classList.add("ytls-save-modal-button"),R.onclick=async()=>{w&&document.removeEventListener("keydown",w),k&&document.removeEventListener("click",k,!0),x(f,async()=>{try{let H=await navigator.clipboard.readText();H?Fi(H.trim()):alert("Clipboard is empty.")}catch(H){l("Failed to read from clipboard: ",H,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let U=document.createElement("button");U.textContent="Cancel",U.classList.add("ytls-save-modal-cancel-button"),U.onclick=L,f.appendChild(g),f.appendChild(_),f.appendChild(R),f.appendChild(U),document.body.appendChild(f),P(w),C(k)};let Qt=document.createElement("button");ae(Qt,"file-export","Export"),Qt.classList.add("ytls-file-operation-button"),Qt.onclick=async()=>{try{await Rl()}catch{alert("Failed to export data: Could not read from database.")}};let An=document.createElement("button");ae(An,"file-import","Import"),An.classList.add("ytls-file-operation-button"),An.onclick=()=>{let f=document.createElement("input");f.type="file",f.accept=".json",f.classList.add("ytls-hidden-file-input"),f.onchange=g=>{let w=g.target.files?.[0];if(!w)return;let k=new FileReader;k.onload=()=>{try{let L=JSON.parse(String(k.result)),_=[];for(let R in L)if(Object.prototype.hasOwnProperty.call(L,R)&&R.startsWith("ytls-")){let U=R.substring(5),H=L[R];if(H&&typeof H.video_id=="string"&&Array.isArray(H.timestamps)){let W=H.timestamps.map(ne=>({...ne,guid:ne.guid||crypto.randomUUID()})),ie=Hi(U,W).then(()=>l(`Imported ${U} to IndexedDB`)).catch(ne=>l(`Failed to import ${U} to IndexedDB:`,ne,"error"));_.push(ie)}else l(`Skipping key ${R} during import due to unexpected data format.`,"warn")}Promise.all(_).then(()=>{Ar()}).catch(R=>{alert("An error occurred during import to IndexedDB. Check console for details."),l("Overall import error:",R,"error")})}catch(L){alert(`Failed to import data. Please ensure the file is in the correct format.
`+L.message),l("Import error:",L,"error")}},k.readAsText(w)},f.click()},s.onclick=f=>{Ci(f)},s.ontouchstart=f=>{Ci(f)},o.style.position="fixed",o.style.bottom="0",o.style.right="0",o.style.transition="none",to(),setTimeout(()=>Tn(),10);let Ft=!1,Oo=0,Fo=0,un=0,No=0,$=0,q=0,re=null,J=!1;o.addEventListener("mousedown",f=>{let g=f.target;if(!(g instanceof Element)||g instanceof HTMLInputElement||g instanceof HTMLTextAreaElement||g instanceof Element&&(g.closest("#ytls-playback-speed-group")||g.closest("#ytls-playback-speed"))||g!==c&&!c.contains(g)&&window.getComputedStyle(g).cursor==="pointer")return;Ft=!0,J=!1;let w=o.getBoundingClientRect();Oo=f.clientX-w.left,Fo=f.clientY-w.top,un=w.width,No=w.height,$=document.documentElement.clientWidth,q=document.documentElement.clientHeight,o.style.transition="none"}),document.addEventListener("mousemove",wo=f=>{if(!Ft)return;J=!0;let g=f.clientX,w=f.clientY;re===null&&(re=requestAnimationFrame(()=>{if(re=null,!Ft)return;let k=Math.max(0,Math.min(g-Oo,$-un)),L=Math.max(0,Math.min(w-Fo,q-No));o.style.left=`${k}px`,o.style.top=`${L}px`,o.style.right="auto",o.style.bottom="auto"}))}),document.addEventListener("mouseup",xo=()=>{if(!Ft)return;Ft=!1,re!==null&&(cancelAnimationFrame(re),re=null);let f=J;setTimeout(()=>{J=!1},50),Tn(),setTimeout(()=>{f&&Ho()},200)}),o.addEventListener("dragstart",f=>f.preventDefault());let ge=document.createElement("div"),$e=document.createElement("div"),st=document.createElement("div"),En=document.createElement("div");ge.id="ytls-resize-tl",$e.id="ytls-resize-tr",st.id="ytls-resize-bl",En.id="ytls-resize-br";let dn=!1,Ui=0,_i=0,Mn=0,Ln=0,Go=0,Uo=0,Vi=0,ji=0,In=null,Xt=null;_o(ge,"top-left"),_o($e,"top-right"),_o(st,"bottom-left"),_o(En,"bottom-right"),document.addEventListener("mousemove",f=>{if(!dn||!o||!Xt)return;let g=f.clientX,w=f.clientY;In===null&&(In=requestAnimationFrame(()=>{if(In=null,!dn||!o||!Xt)return;let k=g-Ui,L=w-_i,_=Vi,R=ji,U=Mn,H=Ln,W=Go,ie=Uo;Xt==="bottom-right"?(U=Math.max(200,Math.min(800,Mn+k)),H=Math.max(250,Math.min(R,Ln+L))):Xt==="top-left"?(U=Math.max(200,Math.min(800,Mn-k)),W=Go+k,H=Math.max(250,Math.min(R,Ln-L)),ie=Uo+L):Xt==="top-right"?(U=Math.max(200,Math.min(800,Mn+k)),H=Math.max(250,Math.min(R,Ln-L)),ie=Uo+L):Xt==="bottom-left"&&(U=Math.max(200,Math.min(800,Mn-k)),W=Go+k,H=Math.max(250,Math.min(R,Ln+L))),W=Math.max(0,Math.min(W,_-U)),ie=Math.max(0,Math.min(ie,R-H)),o.style.width=`${U}px`,o.style.height=`${H}px`,o.style.left=`${W}px`,o.style.top=`${ie}px`,o.style.right="auto",o.style.bottom="auto"}))}),document.addEventListener("mouseup",()=>{dn&&(dn=!1,In!==null&&(cancelAnimationFrame(In),In=null),Xt=null,document.body.style.cursor="",le(!0))});let Vo=null;window.addEventListener("resize",ko=()=>{Vo&&clearTimeout(Vo),Vo=setTimeout(()=>{le(!0),Le?.(),Vo=null},200)}),c.appendChild(p);let Bn=document.createElement("span");Bn.id="ytls-playback-speed-group",Bn.style.display="inline-flex",Bn.style.alignItems="center",Bn.style.marginLeft="4px",u&&Bn.appendChild(u),c.appendChild(Bn),c.appendChild(d);let Er=document.createElement("div");Er.id="ytls-list-wrapper",Ye=document.createElement("div"),Ye.className="ytls-scrollbar-track",$t=document.createElement("div"),$t.className="ytls-scrollbar-thumb",Ye.append($t),Er.append(s,Ye);let jo=document.createElement("div");jo.id="ytls-content",jo.append(Er),jo.append(h),o.append(c,jo,ge,$e,st,En);let $i="";o.addEventListener("mousemove",f=>{if(Ft||dn)return;let g=o.getBoundingClientRect(),w=20,k=f.clientX,L=f.clientY,_=k-g.left<=w,R=g.right-k<=w,U=L-g.top<=w,H=g.bottom-L<=w,W="";U&&_||H&&R?W="nwse-resize":(U&&R||H&&_)&&(W="nesw-resize"),W!==$i&&($i=W,document.body.style.cursor=W)});let Mr=null;if(Ye.addEventListener("mouseenter",()=>{ft&&(clearTimeout(ft),ft=null),Ye.classList.add("ytls-scrollbar-visible")}),Ye.addEventListener("mouseleave",()=>{hr||(ft=setTimeout(()=>{Ye?.classList.remove("ytls-scrollbar-visible"),ft=null},500))}),$t.addEventListener("mousedown",f=>{if(!s)return;f.preventDefault(),f.stopPropagation(),hr=!0;let g=f.clientY,w=s.scrollTop,{scrollHeight:k,clientHeight:L}=s,_=Math.max(30,L/k*L),R=k-L,U=L-_;function H(ie){if(!s)return;let ne=ie.clientY-g;s.scrollTop=Math.max(0,Math.min(R,w+ne*(R/U))),qi()}function W(){hr=!1,document.removeEventListener("mousemove",H),document.removeEventListener("mouseup",W),Ye?.matches(":hover")||(ft=setTimeout(()=>{Ye?.classList.remove("ytls-scrollbar-visible"),ft=null},500))}document.addEventListener("mousemove",H),document.addEventListener("mouseup",W)}),o.addEventListener("mouseenter",()=>{rn=!0,Wi()}),s.addEventListener("scroll",Wi),o.addEventListener("mouseleave",()=>{!dn&&!Ft&&(document.body.style.cursor=""),rn=!1;try{Cr()}catch{}try{bt(!1)}catch{}}),Le=$o,setTimeout(()=>{if($o(),o&&c&&h&&s){let f=40,g=Ee();if(g.length>0)f=g[0].offsetHeight;else{let w=document.createElement("li");w.style.visibility="hidden",w.style.position="absolute",w.textContent="00:00 Example",s.appendChild(w),f=w.offsetHeight,s.removeChild(w)}M(c.offsetHeight+h.offsetHeight+f),o.style.minHeight=V()+"px"}},0),gt){try{gt.disconnect()}catch{}gt=null}gt=new ResizeObserver($o),gt.observe(o),Wn||document.addEventListener("pointerdown",Wn=()=>{ki=Date.now()},!0),Kn||document.addEventListener("pointerup",Kn=()=>{},!0)}finally{gr=!1}}}async function Fl(){if(!o)return;if(document.querySelectorAll("#ytls-pane").forEach(m=>{m!==o&&(l("Removing duplicate pane element from DOM"),m.remove())}),document.body.contains(o)){l("Pane already in DOM, skipping append");return}await Hl(),Ks(Cl),Ys(Pl),li(zo),ci(Tr),Qs(xr),$s(B),await ui(),await sl(),await tn(),pi();let d=document.querySelectorAll("#ytls-pane");if(d.length>0&&(l(`WARNING: Found ${d.length} existing pane(s) in DOM, removing all`),d.forEach(m=>m.remove())),document.body.contains(o)){l("ERROR: Pane already in body, aborting append");return}if(document.body.appendChild(o),l("Pane successfully appended to DOM"),ye(),Se&&(clearTimeout(Se),Se=null),Se=setTimeout(()=>{ke(),Le?.(),ve(),le(!0),Se=null},450),ht){try{ht.disconnect()}catch{}ht=null}ht=new MutationObserver(()=>{let m=document.querySelectorAll("#ytls-pane");m.length>1&&(l(`CRITICAL: Multiple panes detected (${m.length}), removing duplicates`),m.forEach((b,T)=>{(T>0||o&&b!==o)&&b.remove()}))}),ht.observe(document.body,{childList:!0})}function Ni(i=0){if(document.getElementById("ytls-header-button")){Ot();return}let d=document.querySelector("#logo");if(!d||!d.parentElement){i<10&&setTimeout(()=>Ni(i+1),300);return}let m=document.createElement("button");m.id="ytls-header-button",m.type="button",m.className="ytls-header-button",et(m,"Toggle Timekeeper UI"),m.setAttribute("aria-label","Toggle Timekeeper UI");let b=document.createElement("img");b.src=Jo,b.alt="",b.decoding="async",m.appendChild(b),qt=b,m.addEventListener("mouseenter",()=>{qt&&(bo=!0,qt.src=Ha)}),m.addEventListener("mouseleave",()=>{qt&&(bo=!1,Ot())}),m.addEventListener("click",()=>{o&&!document.body.contains(o)&&(l("Pane not in DOM, re-appending before toggle"),document.body.appendChild(o)),Sr()}),d.insertAdjacentElement("afterend",m),Ot(),l("Timekeeper header button added next to YouTube logo")}function Gi(){if(Q())return;Z(!0);let i=history.pushState,d=history.replaceState;function m(){try{let b=new Event("locationchange");window.dispatchEvent(b)}catch{}}history.pushState=function(){let b=i.apply(this,arguments);return m(),b},history.replaceState=function(){let b=d.apply(this,arguments);return m(),b},window.addEventListener("popstate",m),window.addEventListener("locationchange",()=>{window.location.href!==z&&l("Location changed (locationchange event) \u2014 deferring UI update until navigation finish")})}async function Ar(){if(!a()){Sl();return}D(window.location.href),document.querySelectorAll("#ytls-pane").forEach((d,m)=>{(m>0||o&&d!==o)&&d.remove()}),await Ue(),await Ol(),Ae=kr();let i=document.title;l("Page Title:",i),l("Video ID:",Ae),l("Current URL:",window.location.href),br(!0),Jn(),_e(),await xr(),_e(),br(!1),l("Timestamps loaded and UI unlocked for video:",Ae),await Fl();try{bt(!0)}catch{}Ni(),Ml()}Gi(),window.addEventListener("yt-navigate-start",()=>{l("Navigation started (yt-navigate-start event fired)"),a()&&o&&s&&(l("Locking UI and showing loading state for navigation"),br(!0))}),qn=i=>{if(!i.repeat&&!i.ctrlKey&&!i.altKey&&!i.metaKey&&!i.shiftKey&&(i.key==="z"||i.key==="Z")){if(dl(i.target))return;gi()&&(i.preventDefault(),l("Playback speed toggled via keyboard shortcut (Z)"));return}i.ctrlKey&&i.altKey&&i.shiftKey&&(i.key==="T"||i.key==="t")&&(i.preventDefault(),Sr(),l("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",qn),window.addEventListener("yt-navigate-finish",()=>{l("Navigation finished (yt-navigate-finish event fired)"),window.location.href!==z?Ar():l("Navigation finished but URL already handled, skipping.")}),Gi(),l("Timekeeper initialized and waiting for navigation events")})();})();

