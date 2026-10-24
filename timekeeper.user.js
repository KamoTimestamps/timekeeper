// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      5.0.26
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

(()=>{var Kl=Object.defineProperty;var Yl=(e,t)=>{for(var n in t)Kl(e,n,{get:t[n],enumerable:!0})};var io=class extends Error{},Je=(e,t)=>{throw new io(`${e||"value"}: expected ${t}`)};function xt(e){let t={run:e,parse:n=>e(n,""),safeParse:n=>{try{return{success:!0,data:e(n,"")}}catch(r){if(r instanceof io)return{success:!1,error:r};throw r}},array:()=>Ql(t)};return t}var na=e=>typeof e=="object"&&e!==null&&!Array.isArray(e);function Oe(){return xt((e,t)=>typeof e=="string"?e:Je(t,"string"))}function Zo(){return xt((e,t)=>typeof e=="boolean"?e:Je(t,"boolean"))}function bt(e={}){return xt((t,n)=>typeof t!="number"||Number.isNaN(t)?Je(n,"number"):(e.finite&&!Number.isFinite(t)&&Je(n,"finite number"),e.int&&!Number.isInteger(t)&&Je(n,"integer"),e.nonnegative&&t<0&&Je(n,"number >= 0"),e.positive&&t<=0&&Je(n,"number > 0"),e.min!==void 0&&t<e.min&&Je(n,`number >= ${e.min}`),e.max!==void 0&&t>e.max&&Je(n,`number <= ${e.max}`),t))}function Ke(e){return xt((t,n)=>t===void 0?void 0:e.run(t,n))}function Jo(e){return xt((t,n)=>t===null?null:e.run(t,n))}function Hn(e,t){return xt((n,r)=>{try{return e.run(n,r)}catch(a){if(a instanceof io)return t;throw a}})}function Ql(e){return xt((t,n)=>Array.isArray(t)?t.map((r,a)=>e.run(r,`${n}[${a}]`)):Je(n,"array"))}function Xl(e){return xt((t,n)=>{if(!na(t))return Je(n,"object");let r={};for(let a of Object.keys(t))r[a]=e.run(t[a],n?`${n}.${a}`:a);return r})}function wt(e){let t=xt((n,r)=>{if(!na(n))return Je(r,"object");let a={};for(let o of Object.keys(e)){let c=e[o].run(n[o],r?`${r}.${o}`:o);c!==void 0&&(a[o]=c)}return a});return Object.assign(t,{extend:n=>wt({...e,...n}),partial:()=>{let n={};for(let r of Object.keys(e))n[r]=Ke(e[r]);return wt(n)}})}var Jl=xt((e,t)=>typeof e=="string"&&e.length>0?e:Je(t,"non-empty string")),zn=wt({guid:Jl,start:bt({finite:!0,nonnegative:!0}),comment:Oe(),write_counter:Ke(bt({int:!0,positive:!0})),deleted_at:Hn(Ke(bt()),void 0)}),ao=zn.array(),Rr=zn.extend({video_id:Oe(),device_id:Ke(Oe())}),oa=wt({x:bt({finite:!0}),y:bt({finite:!0}),width:Ke(bt({finite:!0,positive:!0})),height:Ke(bt({finite:!0,positive:!0}))}),er=wt({video_id:Oe(),timestamps:ao}),ra=Xl(er),ta=wt({isSignedIn:Hn(Zo(),!1),accessToken:Hn(Jo(Oe()),null),userName:Hn(Jo(Oe()),null),email:Hn(Jo(Oe()),null)}),Pr=Hn(xt((e,t)=>{if(typeof e=="string"){let n;try{n=JSON.parse(e)}catch{return Je(t,"valid JSON string for auth state")}return ta.run(n,t)}return ta.run(e,t)}),{isSignedIn:!1,accessToken:null,userName:null,email:null}),Zl=wt({autoBackupEnabled:Zo(),autoBackupIntervalMinutes:bt({int:!0,min:5,max:1440}),lastAutoBackupAt:Ke(Jo(bt({int:!0,positive:!0})))}),Hr=Zl;var ia=`<svg
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-settings"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065" />
  <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-login"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
  <path d="M21 12h-13l3 -3" />
  <path d="M11 15l-3 -3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-world"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
  <path d="M3.6 9h16.8" />
  <path d="M3.6 15h16.8" />
  <path d="M11.5 3a17 17 0 0 0 0 18" />
  <path d="M12.5 3a17 17 0 0 1 0 18" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-indent-increase"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 6l-11 0" />
  <path d="M20 12l-7 0" />
  <path d="M20 18l-11 0" />
  <path d="M4 8l4 4l-4 4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-indent-decrease"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 6l-7 0" />
  <path d="M20 12l-9 0" />
  <path d="M20 18l-7 0" />
  <path d="M8 8l-4 4l4 4" />
</svg>`;var Cc={plus:ia,"alarm-plus":aa,minus:sa,"circle-plus":la,"circle-minus":ca,trash:ua,clipboard:da,settings:ma,"clock-plus":pa,"current-location":fa,"player-record":ha,"circle-x":ga,"circle-check":va,"adjustments-horizontal":ya,cloud:ba,"device-floppy":wa,"folder-open":xa,"file-export":ka,"file-import":Ta,"file-spreadsheet":Sa,login:Ea,logout:Aa,refresh:Ma,"alert-triangle":La,database:Ia,server:Ba,world:Da,"plug-connected":Ca,key:Ra,x:Pa,"indent-increase":Ha,"indent-decrease":za},Oa="http://www.w3.org/2000/svg",Rc=/^\s*<svg\s+([^>]*)>([\s\S]*?)<\/svg>\s*$/,Pc=/<([a-zA-Z][\w:-]*)([^>]*)\/>/g,Hc=/([a-zA-Z_:][\w:.-]*)="([^"]*)"/g,Fa=new Map;function Na(e){let t={};for(let n of e.matchAll(Hc))t[n[1]]=n[2];return t}function zc(e){return e.startsWith("data:image/svg+xml;base64,")?atob(e.slice(26)):e.startsWith("data:image/svg+xml,")?decodeURIComponent(e.slice(19)):e}function Oc(e){let t=zc(e).match(Rc);if(!t)throw new Error("Invalid Tabler SVG source");let[,n,r]=t,a=document.createElementNS(Oa,"svg"),o=Na(n);for(let[c,s]of Object.entries(o))c!=="class"&&a.setAttribute(c,s);for(let c of r.matchAll(Pc)){let[,s,h]=c,m=document.createElementNS(Oa,s),u=Na(h);for(let[v,y]of Object.entries(u))m.setAttribute(v,y);a.appendChild(m)}return a}function Fc(e){let t=Fa.get(e);if(t)return t;let n=Oc(Cc[e]);return Fa.set(e,n),n}function so(e,t=20){let n=Fc(e).cloneNode(!0);return n.setAttribute("width",String(t)),n.setAttribute("height",String(t)),n.setAttribute("aria-hidden","true"),n.style.pointerEvents="none",n.style.flexShrink="0",n.style.verticalAlign="middle",n}function Fe(e,t,n){e.replaceChildren(so(t,n))}function ae(e,t,n,r){e.replaceChildren(so(t,r),document.createTextNode("\xA0"+n))}var tr="5.0.26";function l(e,...t){let n="debug",r=[...t];t.length>0&&typeof t[t.length-1]=="string"&&["debug","info","warn","error"].includes(t[t.length-1])&&(n=r.pop());let a=`[Timekeeper v${tr}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[n](`${a} ${e}`,...r)}function Lt(e,t=e){let n=Math.floor(e/3600),r=Math.floor(e%3600/60),a=String(e%60).padStart(2,"0");return t<3600?`${t>=600?String(r).padStart(2,"0"):r}:${a}`:`${t>=36e3?String(n).padStart(2,"0"):n}:${String(r).padStart(2,"0")}:${a}`}function zr(e,t=window.location.href){try{let n=new URL(t);return n.searchParams.set("t",`${e}s`),n.toString()}catch{return`https://www.youtube.com/watch?v=${t.search(/[?&]v=/)>=0?t.split(/[?&]v=/)[1].split(/&/)[0]:t.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${e}s`}}function hn(){let e=new Date;return e.getUTCFullYear()+"-"+String(e.getUTCMonth()+1).padStart(2,"0")+"-"+String(e.getUTCDate()).padStart(2,"0")+"--"+String(e.getUTCHours()).padStart(2,"0")+"-"+String(e.getUTCMinutes()).padStart(2,"0")+"-"+String(e.getUTCSeconds()).padStart(2,"0")}var Ga=`#ytls-pane {
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
`;var nr="data:image/png;base64,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",Ua="data:image/png;base64,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";var Ze=null,On=null,Nc=250,It=null,Fn=!1,et=null,lo=[];function Gc(){return(!Ze||!document.body.contains(Ze))&&(Ze=document.createElement("div"),Ze.className="ytls-tooltip",Ze.style.pointerEvents="none",document.body.appendChild(Ze),window.addEventListener("scroll",_a,!0),window.addEventListener("resize",_a,!0)),Ze}function Uc(e,t,n){let a=window.innerWidth,o=window.innerHeight,c=e.getBoundingClientRect(),s=c.width,h=c.height,m=t+10,u=n+10;m+s>a-10&&(m=t-s-10),u+h>o-10&&(u=n-h-10),m=Math.max(10,Math.min(m,a-s-10)),u=Math.max(10,Math.min(u,o-h-10)),e.style.left=`${m}px`,e.style.top=`${u}px`}function Va(e,t){let r=window.innerWidth,a=window.innerHeight,o=t.getBoundingClientRect(),c=e.getBoundingClientRect(),s=c.width,h=c.height,m=Math.round(o.left+o.width/2-s/2),u=Math.round(o.top-h-8);u<8&&(u=Math.round(o.bottom+8)),m<8&&(m=Math.round(o.left)),m+s>r-8&&(m=Math.round(o.right-s)),m=Math.max(8,Math.min(m,r-s-8)),u=Math.max(8,Math.min(u,a-h-8)),e.style.left=`${m}px`,e.style.top=`${u}px`}function _a(){if(!(!Ze||!It)&&Ze.classList.contains("ytls-tooltip-visible"))try{Va(Ze,It)}catch{}}function _c(e=50){et&&(clearTimeout(et),et=null),!Fn&&(et=setTimeout(()=>{co(),et=null},e))}function Vc(e,t,n,r){et&&(clearTimeout(et),et=null),It&&r&&It!==r&&Ze?.classList.contains("ytls-tooltip-visible")&&Ze.classList.remove("ytls-tooltip-visible"),On&&clearTimeout(On),r&&(It=r,Fn=!0),On=setTimeout(()=>{let a=Gc();a.textContent=e,a.classList.remove("ytls-tooltip-visible"),r?requestAnimationFrame(()=>{Va(a,r),requestAnimationFrame(()=>{a.classList.add("ytls-tooltip-visible")})}):(Uc(a,t,n),requestAnimationFrame(()=>{a.classList.add("ytls-tooltip-visible")}))},Nc)}function co(){On&&(clearTimeout(On),On=null),et&&(clearTimeout(et),et=null),Ze&&Ze.classList.remove("ytls-tooltip-visible"),It=null,Fn=!1}function Or(){co()}function tt(e,t){let n=0,r=0,a=m=>{n=m.clientX,r=m.clientY,et&&(clearTimeout(et),et=null),Fn=!0,It=e;let u=typeof t=="function"?t():t;u&&Vc(u,n,r,e)},o=m=>{n=m.clientX,r=m.clientY},c=()=>{It===e&&(Fn=!1,_c())};e.addEventListener("mouseenter",a),e.addEventListener("mousemove",o),e.addEventListener("mouseleave",c);let s=m=>{Fn=!1,It===e&&co()};e.addEventListener("click",s,!0);let h=new MutationObserver(()=>{if(It===e)try{let m=window.getComputedStyle(e);(m.display==="none"||m.visibility==="hidden"||m.opacity==="0")&&co()}catch{}});try{h.observe(e,{attributes:!0,attributeFilter:["class","style"]})}catch{}lo.push(h),e.__tooltipCleanup=()=>{e.removeEventListener("mouseenter",a),e.removeEventListener("mousemove",o),e.removeEventListener("mouseleave",c),e.removeEventListener("click",s,!0);try{h.disconnect()}catch{}let m=lo.indexOf(h);m!==-1&&lo.splice(m,1),delete e.__tooltipObserver},e.__tooltipObserver=h}function $a(){for(let e of lo)try{e.disconnect()}catch{}lo.length=0,co()}var _r={};Yl(_r,{addTimestamp:()=>Yc,buildExportCsvPayload:()=>ou,buildExportPayload:()=>tu,deleteSingleTimestampFromIndexedDB:()=>Zc,exportAllTimestamps:()=>nu,exportAllTimestampsCsv:()=>ru,loadFromIndexedDB:()=>Jc,loadGlobalSettings:()=>ir,mergeBackupData:()=>iu,removeFromIndexedDB:()=>eu,saveGlobalSettings:()=>rr,saveSingleTimestampToIndexedDB:()=>Xc,saveToIndexedDB:()=>Qc});var $c="ytls-timestamps-db",jc=4,Nn="timestamps",Ge="timestamps_v2",Ne="settings",Gn=null,Un=null;var Bt=null;function gn(){if(Gn)try{return Gn.objectStoreNames,Promise.resolve(Gn)}catch(e){l("IndexedDB connection is no longer usable:",e,"warn"),Gn=null}return Un||(Un=qc().then(e=>(Gn=e,Un=null,e.onclose=()=>{l("IndexedDB connection closed unexpectedly","warn"),Gn=null},e.onerror=t=>{l("IndexedDB connection error:",t,"error")},e)).catch(e=>{throw Un=null,e}),Un)}function ja(e,t){let n=crypto.randomUUID(),r=0,a=e.openCursor();a.onsuccess=o=>{let c=o.target.result;c?(r++,c.update({...c.value,write_counter:r,device_id:n}),c.continue()):(t.put({key:"write_counter",value:r}),t.put({key:"device_id",value:n}),l(`Lamport migration: backfilled ${r} records, device_id=${n}`))},a.onerror=()=>{l("Lamport migration: cursor error during backfill",a.error,"error")}}function qc(){return new Promise((e,t)=>{let n=indexedDB.open($c,jc);n.onupgradeneeded=r=>{let a=r.target.result,o=r.oldVersion,c=r.target.transaction;if(o<1&&a.createObjectStore(Nn,{keyPath:"video_id"}),o<2&&!a.objectStoreNames.contains(Ne)&&a.createObjectStore(Ne,{keyPath:"key"}),o<3){if(a.objectStoreNames.contains(Nn)){l("Exporting backup before v2 migration...");let m=c.objectStore(Nn).getAll();m.onsuccess=()=>{let u=er.array().safeParse(m.result);if(u.success&&u.data.length>0)try{let v={},y=0;u.data.forEach(P=>{if(P.timestamps.length>0){let V=ao.parse(P.timestamps);v[`ytls-${P.video_id}`]={video_id:P.video_id,timestamps:[...V].sort((M,B)=>M.start-B.start)},y+=V.length}});let A=new Blob([JSON.stringify(v,null,2)],{type:"application/json"}),D=URL.createObjectURL(A),O=document.createElement("a");O.href=D,O.download=`timekeeper-data-${hn()}.json`,O.click(),URL.revokeObjectURL(D),l(`Pre-migration backup exported: ${u.data.length} videos, ${y} timestamps`)}catch(v){l("Failed to export pre-migration backup:",v,"error")}else u.success||l("Skipping pre-migration backup: legacy data failed validation",u.error.message,"warn")}}let s=a.createObjectStore(Ge,{keyPath:"guid"});if(s.createIndex("video_id","video_id",{unique:!1}),s.createIndex("video_start",["video_id","start"],{unique:!1}),a.objectStoreNames.contains(Nn)){let m=c.objectStore(Nn).getAll();m.onsuccess=()=>{let u=er.array().safeParse(m.result);if(u.success&&u.data.length>0){let v=0;u.data.forEach(y=>{y.timestamps.length>0&&y.timestamps.forEach(A=>{s.put({guid:A.guid,video_id:y.video_id,start:A.start,comment:A.comment}),v++})}),l(`Migrated ${v} timestamps from ${u.data.length} videos to v2 store`)}else u.success||l("Skipping v1 \u2192 v2 migration: legacy data failed validation",u.error.message,"warn");o<4&&ja(c.objectStore(Ge),c.objectStore(Ne))},a.deleteObjectStore(Nn),l("Deleted old timestamps store after migration to v2")}}o===3&&ja(c.objectStore(Ge),c.objectStore(Ne))},n.onsuccess=r=>{e(r.target.result)},n.onerror=r=>{let a=r.target.error;t(a??new Error("Failed to open IndexedDB"))}})}function Fr(e,t,n){return gn().then(r=>new Promise((a,o)=>{let c;try{c=r.transaction(e,t)}catch(m){o(new Error(`Failed to create transaction for ${e}: ${m}`));return}let s=c.objectStore(e),h;try{h=n(s)}catch(m){o(new Error(`Failed to execute operation on ${e}: ${m}`));return}h&&(h.onsuccess=()=>a(h.result),h.onerror=()=>o(h.error??new Error(`IndexedDB ${t} operation failed`))),c.oncomplete=()=>{h||a(void 0)},c.onerror=()=>o(c.error??new Error("IndexedDB transaction failed")),c.onabort=()=>o(c.error??new Error("IndexedDB transaction aborted"))}))}function qa(e,t){let n=ao.safeParse(t);if(!n.success)return Promise.reject(new Error(`Invalid timestamp payload for ${e}`));let r=n.data;return gn().then(a=>new Promise((o,c)=>{let s;try{s=a.transaction([Ge,Ne],"readwrite")}catch(y){c(new Error(`Failed to create transaction: ${y}`));return}s.oncomplete=()=>o(),s.onerror=()=>c(new Error(`IndexedDB save failed: ${s.error?.message??"unknown"}`)),s.onabort=()=>c(new Error("IndexedDB transaction aborted"));let h=s.objectStore(Ge),m=s.objectStore(Ne),v=h.index("video_id").getAll(IDBKeyRange.only(e));v.onsuccess=()=>{try{let y=v.result??[],A=new Map(y.map(M=>[M.guid,M])),D=new Set(r.map(M=>M.guid)),O=Date.now(),P,V=m.get("write_counter");V.onsuccess=()=>{try{P=typeof V.result?.value=="number"?V.result.value:0}catch{P=0}y.forEach(M=>{!D.has(M.guid)&&!M.deleted_at&&(P++,h.put({...M,deleted_at:O,write_counter:P}))}),r.forEach(M=>{let B=A.get(M.guid);if(B&&!B.deleted_at&&B.start===M.start&&B.comment===M.comment&&B.deleted_at===M.deleted_at)h.put({guid:M.guid,video_id:e,start:M.start,comment:M.comment,write_counter:B.write_counter,deleted_at:M.deleted_at,device_id:B.device_id});else{P++;let ee=M.deleted_at??B?.deleted_at??void 0;h.put({guid:M.guid,video_id:e,start:M.start,comment:M.comment,write_counter:P,deleted_at:ee})}}),m.put({key:"write_counter",value:P}),Bt=P},V.onerror=()=>{l("Failed to read write_counter during save, proceeding with counter=0",V.error,"warn"),P=0,y.forEach(M=>{!D.has(M.guid)&&!M.deleted_at&&(P++,h.put({...M,deleted_at:O,write_counter:P}))}),r.forEach(M=>{let B=A.get(M.guid);if(B&&!B.deleted_at&&B.start===M.start&&B.comment===M.comment&&B.deleted_at===M.deleted_at)h.put({guid:M.guid,video_id:e,start:M.start,comment:M.comment,write_counter:B.write_counter,deleted_at:M.deleted_at,device_id:B.device_id});else{P++;let ee=M.deleted_at??B?.deleted_at??void 0;h.put({guid:M.guid,video_id:e,start:M.start,comment:M.comment,write_counter:P,deleted_at:ee})}}),m.put({key:"write_counter",value:P}),Bt=P}}catch(y){c(y instanceof Error?y:new Error(String(y)))}},v.onerror=()=>{let y=`Failed to load existing records for save: ${v.error?.message??"unknown"}`;l(y,v.error,"error"),c(new Error(y))}}))}function Wa(e,t){let n=zn.safeParse(t);if(!n.success)return Promise.reject(new Error(`Invalid timestamp: ${n.error.message}`));let r=n.data;return gn().then(a=>new Promise((o,c)=>{let s;try{s=a.transaction([Ge,Ne],"readwrite")}catch(v){c(new Error(`Failed to create transaction: ${v}`));return}s.oncomplete=()=>o(),s.onerror=()=>c(new Error(`IndexedDB save failed: ${s.error?.message??"unknown"}`)),s.onabort=()=>c(new Error("IndexedDB transaction aborted"));let h=s.objectStore(Ge),m=s.objectStore(Ne);h.put({guid:r.guid,video_id:e,start:r.start,comment:r.comment,write_counter:0,deleted_at:r.deleted_at});let u=m.get("write_counter");u.onsuccess=()=>{try{let v=typeof u.result?.value=="number"?u.result.value:0;h.put({guid:r.guid,video_id:e,start:r.start,comment:r.comment,write_counter:v+1,deleted_at:r.deleted_at}),m.put({key:"write_counter",value:v+1}),Bt=v+1}catch(v){c(v instanceof Error?v:new Error(String(v)))}},u.onerror=()=>{h.put({guid:r.guid,video_id:e,start:r.start,comment:r.comment,write_counter:1,deleted_at:r.deleted_at}),m.put({key:"write_counter",value:1}),Bt=1}}))}function Ka(e){return e.length===0?Promise.resolve():gn().then(t=>new Promise((n,r)=>{let a;try{a=t.transaction([Ge,Ne],"readwrite")}catch(m){r(new Error(`Failed to create transaction: ${m}`));return}a.oncomplete=()=>n(),a.onerror=()=>r(new Error(`IndexedDB batch save failed: ${a.error?.message??"unknown"}`)),a.onabort=()=>r(new Error("IndexedDB transaction aborted"));let o=a.objectStore(Ge),c=a.objectStore(Ne),s=0;e.forEach(m=>{m.write_counter!==void 0&&m.write_counter>s&&(s=m.write_counter)}),e.forEach(m=>{let u={guid:m.guid,video_id:m.video_id,start:m.start,comment:m.comment,deleted_at:m.deleted_at};m.write_counter===void 0?(s++,u.write_counter=s):u.write_counter=m.write_counter,o.put(u)});let h=c.get("write_counter");h.onsuccess=()=>{try{let m=typeof h.result?.value=="number"?h.result.value:0,u=Math.max(s,m)+1;c.put({key:"write_counter",value:u}),Bt=u}catch(m){r(m instanceof Error?m:new Error(String(m)))}},h.onerror=()=>{c.put({key:"write_counter",value:s+1}),Bt=s+1}}))}function Ya(e){return l(`Soft-deleting timestamp ${e}`),gn().then(t=>new Promise((n,r)=>{let a;try{a=t.transaction([Ge,Ne],"readwrite")}catch(h){r(new Error(`Failed to create transaction: ${h}`));return}a.oncomplete=()=>n(),a.onerror=()=>r(new Error(`IndexedDB delete failed: ${a.error?.message??"unknown"}`)),a.onabort=()=>r(new Error("IndexedDB transaction aborted"));let o=a.objectStore(Ge),c=a.objectStore(Ne),s=o.get(e);s.onsuccess=()=>{try{let h=s.result;if(h){let m=c.get("write_counter");m.onsuccess=()=>{try{let u=typeof m.result?.value=="number"?m.result.value:0;o.put({...h,deleted_at:Date.now(),write_counter:u+1}),c.put({key:"write_counter",value:u+1}),Bt=u+1}catch(u){r(u instanceof Error?u:new Error(String(u)))}},m.onerror=()=>{o.put({...h,deleted_at:Date.now(),write_counter:1}),c.put({key:"write_counter",value:1}),Bt=1}}}catch(h){r(h instanceof Error?h:new Error(String(h)))}},s.onerror=()=>{let h=`Failed to load record for deletion: ${s.error?.message??"unknown"}`;l(h,s.error,"error"),r(new Error(h))}}))}function Qa(e){return gn().then(t=>new Promise((n,r)=>{let a;try{a=t.transaction([Ge],"readonly")}catch(c){let s=`Failed to create read transaction: ${c}`;l(s,c,"error"),r(new Error(s));return}a.onabort=()=>{let c=`Transaction aborted during load: ${a.error?.message??"unknown"}`;l(c,a.error,"error"),r(new Error(c))};let o=a.objectStore(Ge).index("video_id").getAll(IDBKeyRange.only(e));o.onsuccess=()=>{try{let c=o.result.filter(m=>!m.deleted_at);if(c.length===0){n(null);return}let s=c.map(m=>({guid:m.guid,start:m.start,comment:m.comment})),h=ao.safeParse(s);if(!h.success){l("Failed to parse timestamps from IndexedDB:",h.error.message,"warn"),n(null);return}n([...h.data].sort((m,u)=>m.start-u.start))}catch(c){r(c)}},o.onerror=()=>{let c=`Failed to load timestamps from IndexedDB: ${o.error?.message??"unknown error"}`;l(c,o.error,"error"),r(new Error(c))}}))}function Xa(e){return gn().then(t=>new Promise((n,r)=>{let a;try{a=t.transaction([Ge,Ne],"readwrite")}catch(m){r(new Error(`Failed to create transaction: ${m}`));return}a.oncomplete=()=>n(),a.onerror=()=>r(new Error(`IndexedDB delete failed: ${a.error?.message??"unknown"}`)),a.onabort=()=>r(new Error("IndexedDB transaction aborted"));let o=a.objectStore(Ge),c=a.objectStore(Ne),h=o.index("video_id").getAll(IDBKeyRange.only(e));h.onsuccess=()=>{try{let m=h.result??[],u=Date.now(),v=c.get("write_counter");v.onsuccess=()=>{try{let y;y=typeof v.result?.value=="number"?v.result.value:0,m.forEach(A=>{A.deleted_at||(y++,o.put({...A,deleted_at:u,write_counter:y}))}),c.put({key:"write_counter",value:y}),Bt=y}catch(y){r(y instanceof Error?y:new Error(String(y)))}},v.onerror=()=>{let y=0;m.forEach(A=>{A.deleted_at||(y++,o.put({...A,deleted_at:u,write_counter:y}))}),c.put({key:"write_counter",value:y}),Bt=y}}catch(m){r(m instanceof Error?m:new Error(String(m)))}},h.onerror=()=>{let m=`Failed to load records for deletion: ${h.error?.message??"unknown"}`;l(m,h.error,"error"),r(new Error(m))}}))}function or(){return Fr(Ge,"readonly",e=>e.getAll()).then(e=>Array.isArray(e)?e:[])}function Ja(e,t){return Fr(Ne,"readwrite",n=>{n.put({key:e,value:t})}).then(()=>{}).catch(n=>{l(`Failed to save setting '${e}' to IndexedDB:`,n,"error")})}function Za(e){return Fr(Ne,"readonly",t=>t.get(e)).then(t=>t?.value).catch(t=>{l(`Failed to load setting '${e}' from IndexedDB:`,t,"error")})}async function Nr({includeDeleted:e=!1}={}){let t={},n=await or(),r=Rr.array().safeParse(n);if(!r.success)return l("Failed to parse timestamp rows for export:",r.error.message,"warn"),{json:"{}",filename:"timekeeper-data.json",totalVideos:0,totalTimestamps:0};let o=[...e?r.data:r.data.filter(u=>!u.deleted_at)].sort((u,v)=>{let y=u.video_id.localeCompare(v.video_id);if(y!==0)return y;let A=u.start-v.start;return A!==0?A:u.guid.localeCompare(v.guid)}),c=new Map;for(let u of o)c.has(u.video_id)||c.set(u.video_id,[]),c.get(u.video_id).push({guid:u.guid,start:u.start,comment:u.comment,write_counter:u.write_counter,deleted_at:u.deleted_at});let s=Array.from(c.keys()).sort((u,v)=>u.localeCompare(v));for(let u of s){let v=c.get(u);t[`ytls-${u}`]={video_id:u,timestamps:v}}return{json:JSON.stringify(t,null,2),filename:"timekeeper-data.json",totalVideos:c.size,totalTimestamps:o.length}}async function es(){try{let{json:e,filename:t,totalVideos:n,totalTimestamps:r}=await Nr(),a=new Blob([e],{type:"application/json"}),o=URL.createObjectURL(a),c=document.createElement("a");c.href=o,c.download=t,c.click(),URL.revokeObjectURL(o),l(`Exported ${n} videos with ${r} timestamps`)}catch(e){throw l("Failed to export data:",e,"error"),e}}async function Gr(){let e=Rr.array().safeParse((await or()).filter(u=>!u.deleted_at));if(!e.success||e.data.length===0){e.success||l("Failed to parse timestamp rows for CSV export:",e.error.message,"warn");let u=`Tag,Timestamp,URL
`,v=`timestamps-${hn()}.csv`;return{csv:u,filename:v,totalVideos:0,totalTimestamps:0}}let t=e.data,n=new Map;for(let u of t)n.has(u.video_id)||n.set(u.video_id,[]),n.get(u.video_id).push({start:u.start,comment:u.comment});let r=[];r.push("Tag,Timestamp,URL");let a=0,o=u=>`"${String(u).replace(/"/g,'""')}"`,c=u=>{let v=Math.floor(u/3600),y=Math.floor(u%3600/60),A=String(u%60).padStart(2,"0");return`${String(v).padStart(2,"0")}:${String(y).padStart(2,"0")}:${A}`},s=Array.from(n.keys()).sort();for(let u of s){let v=n.get(u).sort((y,A)=>y.start-A.start);for(let y of v){let A=y.comment,D=c(y.start),O=zr(y.start,`https://www.youtube.com/watch?v=${u}`);r.push([o(A),o(D),o(O)].join(",")),a++}}let h=r.join(`
`),m=`timestamps-${hn()}.csv`;return{csv:h,filename:m,totalVideos:n.size,totalTimestamps:a}}async function ts(){try{let{csv:e,filename:t,totalVideos:n,totalTimestamps:r}=await Gr(),a=new Blob([e],{type:"text/csv;charset=utf-8;"}),o=URL.createObjectURL(a),c=document.createElement("a");c.href=o,c.download=t,c.click(),URL.revokeObjectURL(o),l(`Exported ${n} videos with ${r} timestamps (CSV)`)}catch(e){throw l("Failed to export CSV data:",e,"error"),e}}async function Ur(e,t){if(!e)throw new Error("Video ID is required");if(!t.guid||t.start==null)throw new Error("Timestamp must have GUID and start time");return Wa(e,t)}async function ns(e,t){if(!e)throw new Error("Video ID is required");if(!Array.isArray(t))throw new Error("Timestamps must be an array");return qa(e,t)}async function os(e){if(!e)throw new Error("GUID is required");return Ya(e)}async function rs(e){if(!e)throw new Error("Video ID is required");return Xa(e)}async function is(e){if(!e)throw new Error("Video ID is required");return Qa(e)}async function as(e){let t;try{t=JSON.parse(e)}catch{return l("mergeBackupData: failed to parse JSON",null,"warn"),{mergedVideos:0,mergedTimestamps:0}}let n=ra.safeParse(t);if(!n.success)return l("mergeBackupData: data failed validation",n.error.message,"warn"),{mergedVideos:0,mergedTimestamps:0};let r=await or(),a=new Map;for(let h of r)a.set(h.guid,h);let o=0,c=0,s=[];for(let[,h]of Object.entries(n.data)){let{video_id:m,timestamps:u}=h,v=0;for(let y of u){let A=a.get(y.guid),D=!1;A?A.write_counter!==void 0&&y.write_counter!==void 0&&y.write_counter>A.write_counter&&(D=!0):D=!0,D&&(s.push({guid:y.guid,video_id:m,start:y.start,comment:y.comment,write_counter:y.write_counter,deleted_at:y.deleted_at}),a.set(y.guid,{...A??{},guid:y.guid,video_id:m,start:y.start,comment:y.comment,write_counter:y.write_counter,deleted_at:y.deleted_at}),v++,c++)}v>0&&o++}return await Ka(s),{mergedVideos:o,mergedTimestamps:c}}function ss(e,t){if(!e)throw new Error("Setting key is required");return Ja(e,t)}async function ls(e){if(!e)throw new Error("Setting key is required");return Za(e)}function Yc(e,t){return Ur(e,t)}function Qc(e,t){return ns(e,t)}function Xc(e,t){return Ur(e,t)}function Jc(e){return is(e)}function Zc(e,t){return os(t)}function eu(e){return rs(e)}function rr(e,t){ss(e,t)}function ir(e){return ls(e)}function tu(e){return Nr(e)}function nu(){return es()}function ou(){return Gr()}function ru(){return ts()}function iu(e){return as(e)}var au=!1,su=null;function ar(e){return e?Array.from(e.querySelectorAll("li:not(.ytls-placeholder):not(.ytls-error-message)")):[]}function sr(e){if(!e)return;e.replaceChildren(),su=null;let t=e.querySelector(".ytls-error-message");t&&t.remove()}function Vr(e,t){if(!e)return;sr(e);let n=document.createElement("li");n.className="ytls-placeholder",n.textContent=t,e.appendChild(n),e.style.overflowY="hidden"}function cs(e){if(!e)return;let t=e.querySelector(".ytls-placeholder");t&&t.remove(),e.style.overflowY=""}function uo(e){return e?e.querySelector(".ytls-error-message")!==null:!1}function us(e,t){if(!e)return;sr(e);let n=document.createElement("li");n.className="ytls-error-message",n.style.cssText=`
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
  `,n.innerHTML=`<div style="margin-bottom:8px">\u26A0\uFE0F ${lu(t)}</div><div style="font-size:12px;font-weight:normal;color:#aaa">Check the console for details or refresh the page.</div>`,e.appendChild(n),e.style.overflowY="hidden"}function ds(e){if(!e)return;let t=e.querySelector(".ytls-error-message");t&&t.remove()}function lu(e){let t=document.createElement("div");return t.textContent=e,t.innerHTML}function ms(e,t){if(!e||t||uo(e))return;Array.from(e.children).some(r=>!r.classList.contains("ytls-placeholder")&&!r.classList.contains("ytls-error-message"))||Vr(e,"No timestamps for this video")}function ps(e){if(!e)return[];let t=ar(e),n=[];return t.forEach(r=>{let a=r.querySelector("[data-time]"),o=r.querySelector("input"),c=r.dataset.guid;if(!a||!o||!c)return;let s=a.dataset.time;if(!s)return;let h=Number.parseInt(s,10);Number.isFinite(h)&&n.push({guid:c,start:h,comment:o.value})}),n.sort((r,a)=>r.start-a.start)}function mo(e){au=e}function fs(e){if(!e)return 0;let t=ar(e),n=0;return t.forEach(r=>{let o=r.querySelector("[data-time]")?.dataset.time;if(o){let c=Number.parseInt(o,10);Number.isFinite(c)&&(n=Math.max(n,c))}}),n}var uu={auth:{googleAuthState:{isSignedIn:!1,accessToken:null,userName:null,email:null},autoBackupEnabled:!0,autoBackupIntervalMinutes:30,autoBackupRetryAttempts:0,autoBackupBackoffMs:null,lastAutoBackupAt:null,isAutoBackupRunning:!1},ui:{panePosition:null,currentVideoId:"",minPaneHeight:250,lastHandledUrl:null,urlChangeHandlersSetup:!1},timestamps:{items:[],currentIndex:null,dbError:null}},Ue=JSON.parse(JSON.stringify(uu)),hs=new Set;function Ie(){return Ue}function po(e){let t=hs.size>0?JSON.parse(JSON.stringify(Ue)):Ue;Ue={...Ue,...e,auth:{...Ue.auth,...e.auth||{}},ui:{...Ue.ui,...e.ui||{}},timestamps:{...Ue.timestamps,...e.timestamps||{}}},du(t)}function vn(e,t){po({auth:{...Ue.auth,[e]:t}})}function lr(e,t){po({ui:{...Ue.ui,[e]:t}})}function Dt(){return Ue.auth.googleAuthState}function kt(e){vn("googleAuthState",e)}function $r(e){vn("autoBackupEnabled",e)}function jr(e){vn("autoBackupIntervalMinutes",e)}function qr(e){vn("isAutoBackupRunning",e)}function cr(e){vn("autoBackupRetryAttempts",e)}function _n(e){vn("autoBackupBackoffMs",e)}function Wr(e){vn("lastAutoBackupAt",e)}function gs(e){lr("minPaneHeight",e)}function vs(e){lr("panePosition",e)}function ys(e){lr("lastHandledUrl",e)}function bs(e){lr("urlChangeHandlersSetup",e)}function ws(e){po({timestamps:{...Ue.timestamps,items:e}})}function xs(e){po({timestamps:{...Ue.timestamps,currentIndex:e}})}function Kr(e){po({timestamps:{...Ue.timestamps,dbError:e}})}function ks(){return Ue.timestamps.dbError}function du(e){hs.forEach(t=>{try{t(Ue,e)}catch(n){console.error("Error in state listener:",n)}})}var yn=typeof unsafeWindow<"u"?unsafeWindow:window,Is=43200*14,Ss="html5_max_live_dvr_window_plus_margin_secs";function Gt(e){return e!=null&&typeof e=="object"}function Es(e){let{streamingData:t,videoDetails:n,playerConfig:r,microformat:a}=e;if(!(!Gt(n)||!n.isLive)){if(n.isLiveDvrEnabled=!0,Gt(r)){let o=r.mediaCommonConfig;if(Gt(o)){o.useServerDrivenAbr=!1;let c=o.serverPlaybackStartConfig;Gt(c)&&(c.enable=!1)}}if(Gt(t)){let o=t;if(o.serverAbrStreamingUrl&&(o.hlsManifestUrl||o.dashManifestUrl)&&delete o.serverAbrStreamingUrl,Array.isArray(o.adaptiveFormats)&&mu(a))for(let c of o.adaptiveFormats)c.maxDvrDurationSec=Is}}}function mu(e){if(!Gt(e))return!1;let t=e.playerMicroformatRenderer;if(!Gt(t))return!1;let n=t.liveBroadcastDetails;if(!Gt(n))return!1;let r=n.startTimestamp;return!r||typeof r!="string"?!1:(Date.now()-new Date(r).getTime())/1e3>43200}function Yr(e){if(!e||typeof e!="object")return!1;let t=e;return t.videoDetails?(Es(t),!0):t.playerResponse&&Gt(t.playerResponse)&&t.playerResponse.videoDetails?(Es(t.playerResponse),!0):!1}function pu(){let e=Object.getOwnPropertyDescriptor(yn,"ytInitialPlayerResponse"),t=e&&e.set,n=yn.ytInitialPlayerResponse;if(!Yr(n))try{Object.defineProperty(yn,"ytInitialPlayerResponse",{configurable:!0,get(){return n},set(r){t&&t.call(this,r),n=r,Yr(r)&&Object.defineProperty(yn,"ytInitialPlayerResponse",{configurable:!0,writable:!0,value:r})}})}catch{}}var As=!1;function fu(){if(As)return;As=!0;let e=JSON.parse;JSON.parse=function(t,n){let r=e.call(this,t,n);try{Yr(r)}catch{}return r}}function Ms(e){if(e.__dvrCapLifted)return;let n=(typeof e.d=="function"?e.d():void 0)?.WEB_PLAYER_CONTEXT_CONFIGS;if(!n)return;let r=n;for(let a in r){let o=r[a];if(o&&typeof o.serializedExperimentFlags=="string"){let c=o.serializedExperimentFlags,s=c.replace(new RegExp(`${Ss}=[\\d.]+`),`${Ss}=${Is}`);s!==c&&(o.serializedExperimentFlags=s)}}e.__dvrCapLifted=!0}function Ls(e){if(!e||e.__dvrHooked)return e;e.__dvrHooked=!0;let t=e.set;typeof t=="function"&&(e.set=function(...n){let r=t.apply(this,n);try{Ms(e)}catch{}return r});try{Ms(e)}catch{}return e}function hu(){let e={};yn.ytcfg&&(e=Ls(yn.ytcfg));try{Object.defineProperty(yn,"ytcfg",{configurable:!0,get(){return e},set(t){e=Ls(t)}})}catch{}}function Bs(){pu(),fu(),hu(),l("[Timekeeper] DVR/Rewind enablement initialized for live streams")}var pe=Uint8Array,it=Uint16Array,ai=Int32Array,ur=new pe([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),dr=new pe([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),ei=new pe([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Os=function(e,t){for(var n=new it(31),r=0;r<31;++r)n[r]=t+=1<<e[r-1];for(var a=new ai(n[30]),r=1;r<30;++r)for(var o=n[r];o<n[r+1];++o)a[o]=o-n[r]<<5|r;return{b:n,r:a}},Fs=Os(ur,2),Ns=Fs.b,ti=Fs.r;Ns[28]=258,ti[258]=28;var Gs=Os(dr,0),gu=Gs.b,Ds=Gs.r,ni=new it(32768);for(J=0;J<32768;++J)Ut=(J&43690)>>1|(J&21845)<<1,Ut=(Ut&52428)>>2|(Ut&13107)<<2,Ut=(Ut&61680)>>4|(Ut&3855)<<4,ni[J]=((Ut&65280)>>8|(Ut&255)<<8)>>1;var Ut,J,Rt=(function(e,t,n){for(var r=e.length,a=0,o=new it(t);a<r;++a)e[a]&&++o[e[a]-1];var c=new it(t);for(a=1;a<t;++a)c[a]=c[a-1]+o[a-1]<<1;var s;if(n){s=new it(1<<t);var h=15-t;for(a=0;a<r;++a)if(e[a])for(var m=a<<4|e[a],u=t-e[a],v=c[e[a]-1]++<<u,y=v|(1<<u)-1;v<=y;++v)s[ni[v]>>h]=m}else for(s=new it(r),a=0;a<r;++a)e[a]&&(s[a]=ni[c[e[a]-1]++]>>15-e[a]);return s}),en=new pe(288);for(J=0;J<144;++J)en[J]=8;var J;for(J=144;J<256;++J)en[J]=9;var J;for(J=256;J<280;++J)en[J]=7;var J;for(J=280;J<288;++J)en[J]=8;var J,go=new pe(32);for(J=0;J<32;++J)go[J]=5;var J,vu=Rt(en,9,0),yu=Rt(en,9,1),bu=Rt(go,5,0),wu=Rt(go,5,1),Qr=function(e){for(var t=e[0],n=1;n<e.length;++n)e[n]>t&&(t=e[n]);return t},Tt=function(e,t,n){var r=t/8|0;return(e[r]|e[r+1]<<8)>>(t&7)&n},Xr=function(e,t){var n=t/8|0;return(e[n]|e[n+1]<<8|e[n+2]<<16)>>(t&7)},si=function(e){return(e+7)/8|0},vo=function(e,t,n){return(t==null||t<0)&&(t=0),(n==null||n>e.length)&&(n=e.length),new pe(e.subarray(t,n))};var xu=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],_e=function(e,t,n){var r=new Error(t||xu[e]);if(r.code=e,Error.captureStackTrace&&Error.captureStackTrace(r,_e),!n)throw r;return r},ku=function(e,t,n,r){var a=e.length,o=r?r.length:0;if(!a||t.f&&!t.l)return n||new pe(0);var c=!n,s=c||t.i!=2,h=t.i;c&&(n=new pe(a*3));var m=function(rn){var $t=n.length;if(rn>$t){var we=new pe(Math.max($t*2,rn));we.set(n),n=we}},u=t.f||0,v=t.p||0,y=t.b||0,A=t.l,D=t.d,O=t.m,P=t.n,V=a*8;do{if(!A){u=Tt(e,v,1);var M=Tt(e,v+1,3);if(v+=3,M)if(M==1)A=yu,D=wu,O=9,P=5;else if(M==2){var fe=Tt(e,v,31)+257,le=Tt(e,v+10,15)+4,$=fe+Tt(e,v+5,31)+1;v+=14;for(var F=new pe($),ke=new pe(19),ce=0;ce<le;++ce)ke[ei[ce]]=Tt(e,v+ce*3,7);v+=le*3;for(var Be=Qr(ke),Ht=(1<<Be)-1,ye=Rt(ke,Be,1),ce=0;ce<$;){var Te=ye[Tt(e,v,Ht)];v+=Te&15;var B=Te>>4;if(B<16)F[ce++]=B;else{var ue=0,re=0;for(B==16?(re=3+Tt(e,v,3),v+=2,ue=F[ce-1]):B==17?(re=3+Tt(e,v,7),v+=3):B==18&&(re=11+Tt(e,v,127),v+=7);re--;)F[ce++]=ue}}var De=F.subarray(0,fe),be=F.subarray(fe);O=Qr(De),P=Qr(be),A=Rt(De,O,1),D=Rt(be,P,1)}else _e(1);else{var B=si(v)+4,X=e[B-4]|e[B-3]<<8,ee=B+X;if(ee>a){h&&_e(0);break}s&&m(y+X),n.set(e.subarray(B,ee),y),t.b=y+=X,t.p=v=ee*8,t.f=u;continue}if(v>V){h&&_e(0);break}}s&&m(y+131072);for(var nn=(1<<O)-1,Ve=(1<<P)-1,ut=v;;ut=v){var ue=A[Xr(e,v)&nn],Se=ue>>4;if(v+=ue&15,v>V){h&&_e(0);break}if(ue||_e(2),Se<256)n[y++]=Se;else if(Se==256){ut=v,A=null;break}else{var ge=Se-254;if(Se>264){var ce=Se-257,Q=ur[ce];ge=Tt(e,v,(1<<Q)-1)+Ns[ce],v+=Q}var Ee=D[Xr(e,v)&Ve],Ce=Ee>>4;Ee||_e(3),v+=Ee&15;var be=gu[Ce];if(Ce>3){var Q=dr[Ce];be+=Xr(e,v)&(1<<Q)-1,v+=Q}if(v>V){h&&_e(0);break}s&&m(y+131072);var Vt=y+ge;if(y<be){var on=o-be,xn=Math.min(be,Vt);for(on+y<0&&_e(3);y<xn;++y)n[y]=r[on+y]}for(;y<Vt;++y)n[y]=n[y-be]}}t.l=A,t.p=ut,t.b=y,t.f=u,A&&(u=1,t.m=O,t.d=D,t.n=P)}while(!u);return y!=n.length&&c?vo(n,0,y):n.subarray(0,y)},_t=function(e,t,n){n<<=t&7;var r=t/8|0;e[r]|=n,e[r+1]|=n>>8},fo=function(e,t,n){n<<=t&7;var r=t/8|0;e[r]|=n,e[r+1]|=n>>8,e[r+2]|=n>>16},Jr=function(e,t){for(var n=[],r=0;r<e.length;++r)e[r]&&n.push({s:r,f:e[r]});var a=n.length,o=n.slice();if(!a)return{t:_s,l:0};if(a==1){var c=new pe(n[0].s+1);return c[n[0].s]=1,{t:c,l:1}}n.sort(function(ee,fe){return ee.f-fe.f}),n.push({s:-1,f:25001});var s=n[0],h=n[1],m=0,u=1,v=2;for(n[0]={s:-1,f:s.f+h.f,l:s,r:h};u!=a-1;)s=n[n[m].f<n[v].f?m++:v++],h=n[m!=u&&n[m].f<n[v].f?m++:v++],n[u++]={s:-1,f:s.f+h.f,l:s,r:h};for(var y=o[0].s,r=1;r<a;++r)o[r].s>y&&(y=o[r].s);var A=new it(y+1),D=oi(n[u-1],A,0);if(D>t){var r=0,O=0,P=D-t,V=1<<P;for(o.sort(function(fe,le){return A[le.s]-A[fe.s]||fe.f-le.f});r<a;++r){var M=o[r].s;if(A[M]>t)O+=V-(1<<D-A[M]),A[M]=t;else break}for(O>>=P;O>0;){var B=o[r].s;A[B]<t?O-=1<<t-A[B]++-1:++r}for(;r>=0&&O;--r){var X=o[r].s;A[X]==t&&(--A[X],++O)}D=t}return{t:new pe(A),l:D}},oi=function(e,t,n){return e.s==-1?Math.max(oi(e.l,t,n+1),oi(e.r,t,n+1)):t[e.s]=n},Cs=function(e){for(var t=e.length;t&&!e[--t];);for(var n=new it(++t),r=0,a=e[0],o=1,c=function(h){n[r++]=h},s=1;s<=t;++s)if(e[s]==a&&s!=t)++o;else{if(!a&&o>2){for(;o>138;o-=138)c(32754);o>2&&(c(o>10?o-11<<5|28690:o-3<<5|12305),o=0)}else if(o>3){for(c(a),--o;o>6;o-=6)c(8304);o>2&&(c(o-3<<5|8208),o=0)}for(;o--;)c(a);o=1,a=e[s]}return{c:n.subarray(0,r),n:t}},ho=function(e,t){for(var n=0,r=0;r<t.length;++r)n+=e[r]*t[r];return n},Us=function(e,t,n){var r=n.length,a=si(t+2);e[a]=r&255,e[a+1]=r>>8,e[a+2]=e[a]^255,e[a+3]=e[a+1]^255;for(var o=0;o<r;++o)e[a+o+4]=n[o];return(a+4+r)*8},Rs=function(e,t,n,r,a,o,c,s,h,m,u){_t(t,u++,n),++a[256];for(var v=Jr(a,15),y=v.t,A=v.l,D=Jr(o,15),O=D.t,P=D.l,V=Cs(y),M=V.c,B=V.n,X=Cs(O),ee=X.c,fe=X.n,le=new it(19),$=0;$<M.length;++$)++le[M[$]&31];for(var $=0;$<ee.length;++$)++le[ee[$]&31];for(var F=Jr(le,7),ke=F.t,ce=F.l,Be=19;Be>4&&!ke[ei[Be-1]];--Be);var Ht=m+5<<3,ye=ho(a,en)+ho(o,go)+c,Te=ho(a,y)+ho(o,O)+c+14+3*Be+ho(le,ke)+2*le[16]+3*le[17]+7*le[18];if(h>=0&&Ht<=ye&&Ht<=Te)return Us(t,u,e.subarray(h,h+m));var ue,re,De,be;if(_t(t,u,1+(Te<ye)),u+=2,Te<ye){ue=Rt(y,A,0),re=y,De=Rt(O,P,0),be=O;var nn=Rt(ke,ce,0);_t(t,u,B-257),_t(t,u+5,fe-1),_t(t,u+10,Be-4),u+=14;for(var $=0;$<Be;++$)_t(t,u+3*$,ke[ei[$]]);u+=3*Be;for(var Ve=[M,ee],ut=0;ut<2;++ut)for(var Se=Ve[ut],$=0;$<Se.length;++$){var ge=Se[$]&31;_t(t,u,nn[ge]),u+=ke[ge],ge>15&&(_t(t,u,Se[$]>>5&127),u+=Se[$]>>12)}}else ue=vu,re=en,De=bu,be=go;for(var $=0;$<s;++$){var Q=r[$];if(Q>255){var ge=Q>>18&31;fo(t,u,ue[ge+257]),u+=re[ge+257],ge>7&&(_t(t,u,Q>>23&31),u+=ur[ge]);var Ee=Q&31;fo(t,u,De[Ee]),u+=be[Ee],Ee>3&&(fo(t,u,Q>>5&8191),u+=dr[Ee])}else fo(t,u,ue[Q]),u+=re[Q]}return fo(t,u,ue[256]),u+re[256]},Tu=new ai([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),_s=new pe(0),Su=function(e,t,n,r,a,o){var c=o.z||e.length,s=new pe(r+c+5*(1+Math.ceil(c/7e3))+a),h=s.subarray(r,s.length-a),m=o.l,u=(o.r||0)&7;if(t){u&&(h[0]=o.r>>3);for(var v=Tu[t-1],y=v>>13,A=v&8191,D=(1<<n)-1,O=o.p||new it(32768),P=o.h||new it(D+1),V=Math.ceil(n/3),M=2*V,B=function(dt){return(e[dt]^e[dt+1]<<V^e[dt+2]<<M)&D},X=new ai(25e3),ee=new it(288),fe=new it(32),le=0,$=0,F=o.i||0,ke=0,ce=o.w||0,Be=0;F+2<c;++F){var Ht=B(F),ye=F&32767,Te=P[Ht];if(O[ye]=Te,P[Ht]=ye,ce<=F){var ue=c-F;if((le>7e3||ke>24576)&&(ue>423||!m)){u=Rs(e,h,0,X,ee,fe,$,ke,Be,F-Be,u),ke=le=$=0,Be=F;for(var re=0;re<286;++re)ee[re]=0;for(var re=0;re<30;++re)fe[re]=0}var De=2,be=0,nn=A,Ve=ye-Te&32767;if(ue>2&&Ht==B(F-Ve))for(var ut=Math.min(y,ue)-1,Se=Math.min(32767,F),ge=Math.min(258,ue);Ve<=Se&&--nn&&ye!=Te;){if(e[F+De]==e[F+De-Ve]){for(var Q=0;Q<ge&&e[F+Q]==e[F+Q-Ve];++Q);if(Q>De){if(De=Q,be=Ve,Q>ut)break;for(var Ee=Math.min(Ve,Q-2),Ce=0,re=0;re<Ee;++re){var Vt=F-Ve+re&32767,on=O[Vt],xn=Vt-on&32767;xn>Ce&&(Ce=xn,Te=Vt)}}}ye=Te,Te=O[ye],Ve+=ye-Te&32767}if(be){X[ke++]=268435456|ti[De]<<18|Ds[be];var rn=ti[De]&31,$t=Ds[be]&31;$+=ur[rn]+dr[$t],++ee[257+rn],++fe[$t],ce=F+De,++le}else X[ke++]=e[F],++ee[e[F]]}}for(F=Math.max(F,ce);F<c;++F)X[ke++]=e[F],++ee[e[F]];u=Rs(e,h,m,X,ee,fe,$,ke,Be,F-Be,u),m||(o.r=u&7|h[u/8|0]<<3,u-=7,o.h=P,o.p=O,o.i=F,o.w=ce)}else{for(var F=o.w||0;F<c+m;F+=65535){var we=F+65535;we>=c&&(h[u/8|0]=m,we=c),u=Us(h,u+1,e.subarray(F,we))}o.i=c}return vo(s,0,r+si(u)+a)},Eu=(function(){for(var e=new Int32Array(256),t=0;t<256;++t){for(var n=t,r=9;--r;)n=(n&1&&-306674912)^n>>>1;e[t]=n}return e})(),Au=function(){var e=-1;return{p:function(t){for(var n=e,r=0;r<t.length;++r)n=Eu[n&255^t[r]]^n>>>8;e=n},d:function(){return~e}}};var Mu=function(e,t,n,r,a){if(!a&&(a={l:1},t.dictionary)){var o=t.dictionary.subarray(-32768),c=new pe(o.length+e.length);c.set(o),c.set(e,o.length),e=c,a.w=o.length}return Su(e,t.level==null?6:t.level,t.mem==null?a.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+t.mem,n,r,a)},Vs=function(e,t){var n={};for(var r in e)n[r]=e[r];for(var r in t)n[r]=t[r];return n};var Ct=function(e,t){return e[t]|e[t+1]<<8},lt=function(e,t){return(e[t]|e[t+1]<<8|e[t+2]<<16|e[t+3]<<24)>>>0},Zr=function(e,t){return lt(e,t)+lt(e,t+4)*4294967296},He=function(e,t,n){for(;n;++t)e[t]=n,n>>>=8};function Lu(e,t){return Mu(e,t||{},0,0)}function Iu(e,t){return ku(e,{i:2},t&&t.out,t&&t.dictionary)}var $s=function(e,t,n,r){for(var a in e){var o=e[a],c=t+a,s=r;Array.isArray(o)&&(s=Vs(r,o[1]),o=o[0]),ArrayBuffer.isView(o)?n[c]=[o,s]:(n[c+="/"]=[new pe(0),s],$s(o,c,n,r))}},Ps=typeof TextEncoder<"u"&&new TextEncoder,ri=typeof TextDecoder<"u"&&new TextDecoder,Bu=0;try{ri.decode(_s,{stream:!0}),Bu=1}catch{}var Du=function(e){for(var t="",n=0;;){var r=e[n++],a=(r>127)+(r>223)+(r>239);if(n+a>e.length)return{s:t,r:vo(e,n-1)};a?a==3?(r=((r&15)<<18|(e[n++]&63)<<12|(e[n++]&63)<<6|e[n++]&63)-65536,t+=String.fromCharCode(55296|r>>10,56320|r&1023)):a&1?t+=String.fromCharCode((r&31)<<6|e[n++]&63):t+=String.fromCharCode((r&15)<<12|(e[n++]&63)<<6|e[n++]&63):t+=String.fromCharCode(r)}};function Hs(e,t){if(t){for(var n=new pe(e.length),r=0;r<e.length;++r)n[r]=e.charCodeAt(r);return n}if(Ps)return Ps.encode(e);for(var a=e.length,o=new pe(e.length+(e.length>>1)),c=0,s=function(u){o[c++]=u},r=0;r<a;++r){if(c+5>o.length){var h=new pe(c+8+(a-r<<1));h.set(o),o=h}var m=e.charCodeAt(r);m<128||t?s(m):m<2048?(s(192|m>>6),s(128|m&63)):m>55295&&m<57344?(m=65536+(m&1047552)|e.charCodeAt(++r)&1023,s(240|m>>18),s(128|m>>12&63),s(128|m>>6&63),s(128|m&63)):(s(224|m>>12),s(128|m>>6&63),s(128|m&63))}return vo(o,0,c)}function Cu(e,t){if(t){for(var n="",r=0;r<e.length;r+=16384)n+=String.fromCharCode.apply(null,e.subarray(r,r+16384));return n}else{if(ri)return ri.decode(e);var a=Du(e),o=a.s,n=a.r;return n.length&&_e(8),o}}var Ru=function(e,t){return t+30+Ct(e,t+26)+Ct(e,t+28)},Pu=function(e,t,n){var r=Ct(e,t+28),a=Ct(e,t+30),o=Cu(e.subarray(t+46,t+46+r),!(Ct(e,t+8)&2048)),c=t+46+r,s=Hu(e,c,a,n,lt(e,t+20),lt(e,t+24),lt(e,t+42)),h=s[0],m=s[1],u=s[2];return[Ct(e,t+10),h,m,o,c+a+Ct(e,t+32),u]},Hu=function(e,t,n,r,a,o,c){var s=a==4294967295,h=o==4294967295,m=c==4294967295,u=t+n,v=s+h+m;if(r&&v){for(;t+4<u;t+=4+Ct(e,t+2))if(Ct(e,t)==1)return[s?Zr(e,t+4+8*h):a,h?Zr(e,t+4):o,m?Zr(e,t+4+8*(h+s)):c,1];r<2&&_e(13)}return[a,o,c,0]},ii=function(e){var t=0;if(e)for(var n in e){var r=e[n].length;r>65535&&_e(9),t+=r+4}return t},zs=function(e,t,n,r,a,o,c,s){var h=r.length,m=n.extra,u=s&&s.length,v=ii(m);He(e,t,c!=null?33639248:67324752),t+=4,c!=null&&(e[t++]=20,e[t++]=n.os),e[t]=20,t+=2,e[t++]=n.flag<<1|(o<0&&8),e[t++]=a&&8,e[t++]=n.compression&255,e[t++]=n.compression>>8;var y=new Date(n.mtime==null?Date.now():n.mtime),A=y.getFullYear()-1980;if((A<0||A>119)&&_e(10),He(e,t,A<<25|y.getMonth()+1<<21|y.getDate()<<16|y.getHours()<<11|y.getMinutes()<<5|y.getSeconds()>>1),t+=4,o!=-1&&(He(e,t,n.crc),He(e,t+4,o<0?-o-2:o),He(e,t+8,n.size)),He(e,t+12,h),He(e,t+14,v),t+=16,c!=null&&(He(e,t,u),He(e,t+6,n.attrs),He(e,t+10,c),t+=14),e.set(r,t),t+=h,v)for(var D in m){var O=m[D],P=O.length;He(e,t,+D),He(e,t+2,P),e.set(O,t+4),t+=4+P}return u&&(e.set(s,t),t+=u),t},zu=function(e,t,n,r,a){He(e,t,101010256),He(e,t+8,n),He(e,t+10,n),He(e,t+12,r),He(e,t+16,a)};function js(e,t){t||(t={});var n={},r=[];$s(e,"",n,t);var a=0,o=0;for(var c in n){var s=n[c],h=s[0],m=s[1],u=m.level==0?0:8,v=Hs(c),y=v.length,A=m.comment,D=A&&Hs(A),O=D&&D.length,P=ii(m.extra);y>65535&&_e(11);var V=u?Lu(h,m):h,M=V.length,B=Au();B.p(h),r.push(Vs(m,{size:h.length,crc:B.d(),c:V,f:v,m:D,u:y!=c.length||D&&A.length!=O,o:a,compression:u})),a+=30+y+P+M,o+=76+2*(y+P)+(O||0)+M}for(var X=new pe(o+22),ee=a,fe=o-a,le=0;le<r.length;++le){var v=r[le];zs(X,v.o,v,v.f,v.u,v.c.length);var $=30+v.f.length+ii(v.extra);X.set(v.c,v.o+$),zs(X,a,v,v.f,v.u,v.c.length,v.o,v.m),a+=16+$+(v.m?v.m.length:0)}return zu(X,a,r.length,fe,ee),X}function qs(e,t){for(var n={},r=e.length-22;lt(e,r)!=101010256;--r)(!r||e.length-r>65558)&&_e(13);var a=Ct(e,r+8);if(!a)return{};var o=lt(e,r+16),c=lt(e,r-20)==117853008;if(c){var s=lt(e,r-12);c=lt(e,s)==101075792,c&&(a=lt(e,s+32),o=lt(e,s+48))}for(var h=t&&t.filter,m=0;m<a;++m){var u=Pu(e,o,c),v=u[0],y=u[1],A=u[2],D=u[3],O=u[4],P=u[5],V=Ru(e,P);o=O,(!h||h({name:D,size:y,originalSize:A,compression:v}))&&(v?v==8?n[D]=Iu(e.subarray(V,V+y),{out:new pe(A)}):_e(14,"unknown compression type "+v):n[D]=vo(e,V,V+y))}return n}function St(){return Dt()}var ct={get isSignedIn(){return Dt().isSignedIn},get accessToken(){return Dt().accessToken},get userName(){return Dt().userName},get email(){return Dt().email},set isSignedIn(e){let t=Dt();kt({...t,isSignedIn:e})},set accessToken(e){let t=Dt();kt({...t,accessToken:e})},set userName(e){let t=Dt();kt({...t,userName:e})},set email(e){let t=Dt();kt({...t,email:e})}};function xo(){return Ie().auth.autoBackupEnabled}function Pt(){return Ie().auth.autoBackupIntervalMinutes}var ui=null,se=null,ne=null,wn=null;function Ys(e){ui=e}function Qs(e){se=e}function Xs(e){ne=e}function Js(e){wn=e}var Ws=!1;function Zs(){if(!Ws)try{let e=document.createElement("style");e.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(e),Ws=!0}catch{}}var el=null,di=null,yo=null,bo=null,mi=null;function tl(e){el=e}function nl(e){di=e}function pi(e){yo=e}function fi(e){bo=e}function ol(e){mi=e}var pr="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",rl="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",il="https://www.youtube.com/",Ou=new Date(Date.UTC(2e3,0,1,0,0,0)),Fu=30*1e3,Nu=1800*1e3,Ks=5,mr=null,Ye=null;async function hi(){try{let e=await bo("googleAuthState"),t=e&&typeof e=="object"?{...e,accessToken:e.accessToken?"[REDACTED]":null}:e;l("Loading Google auth state from IndexedDB:",t);let n=Pr.safeParse(e);if(n.success){let r=St();kt({...r,...n.data});let a=St();a.isSignedIn&&a.accessToken&&l(`Reusing stored Google auth token for ${a.userName||a.email||"user"}`),jn();let o=St();o.isSignedIn&&o.accessToken&&await tn(!0)}else if(e!==void 0){let r=e&&typeof e=="object"?{...e,accessToken:e.accessToken?"[REDACTED]":null}:e;l("Google auth state failed validation:",{stored:r,errors:n.error.message},"warn")}}catch(e){l("Failed to load Google auth state:",e,"error")}}async function ko(){try{let e=St(),t=Pr.safeParse(e);if(!t.success){let n={...e,accessToken:e.accessToken?"[REDACTED]":null};l("Invalid auth state, cannot save",{state:n,errors:t.error.message},"error");return}await yo("googleAuthState",e),e.isSignedIn&&e.accessToken?l(`Saved Google auth state to IndexedDB for ${e.userName||e.email||"user"}`):l("Cleared Google auth state in IndexedDB (signed out)")}catch(e){l("Failed to save Google auth state:",e,"error")}}function jn(){ui&&(ui.style.display="none")}function nt(e,t){if(!ne)return;if(ne.style.fontWeight="bold",e==="authenticating"){Zs(),ne.style.color="#ffa500",ne.replaceChildren();let r=document.createElement("span");r.className="tk-auth-spinner";let a=document.createTextNode(` ${t||"Authorizing with Google\u2026"}`);ne.appendChild(r),ne.appendChild(a);return}if(e==="error"){ae(ne,"circle-x",t||"Authorization failed"),ne.style.color="#ff4d4f",ve();return}let n=St();n.isSignedIn?(ae(ne,"circle-check","Signed in"),ne.style.color="#52c41a",ne.removeAttribute("title"),n.userName?(ne.onmouseenter=()=>{ae(ne,"circle-check",`Signed in as ${n.userName}`)},ne.onmouseleave=()=>{ae(ne,"circle-check","Signed in")}):(ne.onmouseenter=null,ne.onmouseleave=null)):(ae(ne,"circle-x","Not signed in"),ne.style.color="#ff4d4f",ne.removeAttribute("title"),ne.onmouseenter=null,ne.onmouseleave=null),ve()}function Gu(){ne&&(Zs(),ne.classList.remove("tk-auth-blink"),ne.offsetWidth,ne.classList.add("tk-auth-blink"),setTimeout(()=>{ne.classList.remove("tk-auth-blink")},1200))}function al(e,t=300*1e3){return new Promise((n,r)=>{if(!e){l&&l("OAuth monitor: popup is null",null,"error"),r(new Error("Failed to open popup"));return}l&&l("OAuth monitor: starting to monitor popup for token");let a=Date.now(),o="timekeeper_oauth",c=null,s=null,h=null,m=()=>{if(c){try{c.close()}catch{}c=null}s&&(clearInterval(s),s=null),h&&(clearInterval(h),h=null)};try{c=new BroadcastChannel(o),l&&l("OAuth monitor: BroadcastChannel created successfully"),c.onmessage=y=>{let A=y.data?.token?{...y.data,token:"[REDACTED]"}:y.data;l&&l("OAuth monitor: received BroadcastChannel message",A);let D=wt({type:Oe(),token:Ke(Oe()),error:Ke(Oe())}).safeParse(y.data);if(!D.success){l&&l("OAuth monitor: invalid message format",D.error,"warn");return}if(D.data.type==="timekeeper_oauth_token"&&D.data.token){l&&l("OAuth monitor: token received via BroadcastChannel"),m();try{e.close()}catch{}n(D.data.token)}else if(D.data.type==="timekeeper_oauth_error"){l&&l("OAuth monitor: error received via BroadcastChannel",D.data.error,"error"),m();try{e.close()}catch{}r(new Error(D.data.error||"OAuth failed"))}}}catch(y){l&&l("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",y)}l&&l("OAuth monitor: setting up IndexedDB polling");let u=Date.now();s=setInterval(async()=>{try{let y=indexedDB.open("ytls-timestamps-db",4);y.onsuccess=()=>{let A=y.result,P=A.transaction("settings","readonly").objectStore("settings").get("oauth_message");P.onsuccess=()=>{let V=P.result;if(V&&V.value){let M=V.value,B=wt({type:Oe(),token:Ke(Oe()),error:Ke(Oe()),timestamp:Ke(bt())}).safeParse(M);if(!B.success){l&&l("OAuth monitor: invalid IndexedDB message format",B.error,"warn");return}if(B.data.timestamp&&B.data.timestamp>u){let X=B.data.token?{...B.data,token:"[REDACTED]"}:B.data;if(l&&l("OAuth monitor: received IndexedDB message",X),B.data.type==="timekeeper_oauth_token"&&B.data.token){l&&l("OAuth monitor: token received via IndexedDB"),m();try{e.close()}catch{}A.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),n(B.data.token)}else if(B.data.type==="timekeeper_oauth_error"){l&&l("OAuth monitor: error received via IndexedDB",B.data.error,"error"),m();try{e.close()}catch{}A.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),r(new Error(B.data.error||"OAuth failed"))}u=B.data.timestamp||Date.now()}}A.close()}}}catch(y){l&&l("OAuth monitor: IndexedDB polling error",y,"error")}},500),h=setInterval(()=>{if(Date.now()-a>t){l&&l("OAuth monitor: popup timed out after 5 minutes",null,"error"),m();try{e.close()}catch{}r(new Error("OAuth popup timed out"));return}},1e3)})}async function sl(){if(!pr){nt("error","Google Client ID not configured");return}try{l&&l("OAuth signin: starting OAuth flow"),nt("authenticating","Opening authentication window...");let e=new URL("https://accounts.google.com/o/oauth2/v2/auth");e.searchParams.set("client_id",pr),e.searchParams.set("redirect_uri",il),e.searchParams.set("response_type","token"),e.searchParams.set("scope",rl),e.searchParams.set("include_granted_scopes","true"),e.searchParams.set("state","timekeeper_auth"),l&&l("OAuth signin: opening popup");let t=window.open(e.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!t){l&&l("OAuth signin: popup blocked by browser",null,"error"),nt("error","Popup blocked. Please enable popups for YouTube.");return}l&&l("OAuth signin: popup opened successfully"),nt("authenticating","Waiting for authentication...");try{let n=await al(t),r=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${n}`}});if(r.ok){let a=await r.json(),o=wt({name:Ke(Oe()),email:Ke(Oe())}).safeParse(a);if(!o.success)throw l&&l("Failed to validate user info response",o.error,"error"),new Error("Invalid user info response");let c=o.data;kt({isSignedIn:!0,accessToken:n,userName:c.name||null,email:c.email||null}),await ko(),jn(),nt(),ve(),await tn(),l?l(`Successfully authenticated as ${c.name}`):console.log(`[Timekeeper] Successfully authenticated as ${c.name}`)}else throw new Error("Failed to fetch user info")}catch(n){let r=n instanceof Error?n.message:"Authentication failed";l?l("OAuth failed:",n,"error"):console.error("[Timekeeper] OAuth failed:",n),nt("error",r);return}}catch(e){let t=e instanceof Error?e.message:"Sign in failed";l?l("Failed to sign in to Google:",e,"error"):console.error("[Timekeeper] Failed to sign in to Google:",e),nt("error",`Failed to sign in: ${t}`)}}async function Uu(){let e=St(),t=e.email;if(!pr||!t)return!1;l("Silent OAuth: attempting silent token refresh for "+t);let n=new URL("https://accounts.google.com/o/oauth2/v2/auth");n.searchParams.set("client_id",pr),n.searchParams.set("redirect_uri",il),n.searchParams.set("response_type","token"),n.searchParams.set("scope",rl),n.searchParams.set("include_granted_scopes","true"),n.searchParams.set("state","timekeeper_auth"),n.searchParams.set("prompt","none"),n.searchParams.set("login_hint",t);let r=window.open(n.toString(),"TimekeeperGoogleAuthSilent","width=1,height=1,left=-2000,top=-2000,menubar=no,toolbar=no,location=no");if(!r)return l("Silent OAuth: popup blocked",null,"warn"),!1;try{let a=await al(r,15e3);return kt({...e,isSignedIn:!0,accessToken:a}),await ko(),jn(),nt(),l("Silent OAuth: token refreshed successfully for "+t),!0}catch(a){l("Silent OAuth: silent refresh failed",a,"warn");try{r.close()}catch{}return!1}}async function ll(){if(!window.opener||window.opener===window)return!1;l&&l("OAuth popup: detected popup window, checking for OAuth response");let e=window.location.hash;if(!e||e.length<=1)return l&&l("OAuth popup: no hash params found"),!1;let t=e.startsWith("#")?e.substring(1):e,n=new URLSearchParams(t),r=n.get("state");if(l&&l("OAuth popup: hash params found, state="+r),r!=="timekeeper_auth")return l&&l("OAuth popup: not our OAuth flow (wrong state)"),!1;let a=n.get("error"),o=n.get("access_token"),c="timekeeper_oauth";if(a){try{let s=new BroadcastChannel(c);s.postMessage({type:"timekeeper_oauth_error",error:n.get("error_description")||a}),s.close(),l&&l("OAuth popup: error broadcast via BroadcastChannel")}catch{let h={type:"timekeeper_oauth_error",error:n.get("error_description")||a,timestamp:Date.now()};l&&l("OAuth popup: writing error to IndexedDB",h);let m=indexedDB.open("ytls-timestamps-db",4);m.onsuccess=()=>{let u=m.result,y=u.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:h});y.onsuccess=()=>{l&&l("OAuth popup: error written to IndexedDB successfully")},y.onerror=()=>{l&&l("OAuth popup: failed to write error to IndexedDB",y.error,"error")},u.close()},m.onerror=()=>{l&&l("OAuth popup: failed to open IndexedDB",m.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(o){l&&l("OAuth popup: access token found, broadcasting to opener");try{let s=new BroadcastChannel(c);s.postMessage({type:"timekeeper_oauth_token",token:o}),s.close(),l&&l("OAuth popup: token broadcast via BroadcastChannel")}catch(s){l&&l("OAuth popup: BroadcastChannel failed, using IndexedDB",s);let h={type:"timekeeper_oauth_token",token:o,timestamp:Date.now()},m={...h,token:"[REDACTED]"};l&&l("OAuth popup: writing token to IndexedDB",m);let u=indexedDB.open("ytls-timestamps-db",4);u.onsuccess=()=>{let v=u.result,A=v.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:h});A.onsuccess=()=>{l&&l("OAuth popup: token written to IndexedDB successfully")},A.onerror=()=>{l&&l("OAuth popup: failed to write token to IndexedDB",A.error,"error")},v.close()},u.onerror=()=>{l&&l("OAuth popup: failed to open IndexedDB",u.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function cl(){kt({isSignedIn:!1,accessToken:null,userName:null,email:null}),await ko(),await tn(),jn(),nt(),ve()}async function ul(){let e=St();if(!e.isSignedIn||!e.accessToken)return!1;try{let t=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${e.accessToken}`}});return t.status===401?(await pl({silent:!0}),!1):t.ok}catch(t){return l("Failed to verify auth state:",t,"error"),!1}}function fr(){let e=St();return e.isSignedIn&&!!e.accessToken}function $n(){return fr()}function _u(){let e=[];return fr()&&e.push("Google Drive"),e}function Vu(e){let t=qs(new Uint8Array(e)),n=Object.values(t)[0];return n?new TextDecoder().decode(n):null}async function dl(e){let t={Authorization:`Bearer ${e}`},r=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,a=await fetch(r,{headers:t});if(a.status===401)throw new Error("unauthorized");if(!a.ok)throw new Error("drive search failed");let o=await a.json();if(Array.isArray(o.files)&&o.files.length>0)return o.files[0].id;let c=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...t,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(c.status===401)throw new Error("unauthorized");if(!c.ok)throw new Error("drive folder create failed");return(await c.json()).id}async function ml(e,t,n){let r=`name='${e}' and '${t}' in parents and trashed=false`,a=encodeURIComponent(r),o=await fetch(`https://www.googleapis.com/drive/v3/files?q=${a}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${n}`}});if(o.status===401)throw new Error("unauthorized");if(!o.ok)return null;let c=await o.json();return c.files&&c.files.length>0?c.files[0].id:null}async function $u(e){try{let t=await dl(e),n=await ml("timekeeper-data.zip",t,e);if(!n)return null;let r=await fetch(`https://www.googleapis.com/drive/v3/files/${n}?alt=media`,{headers:{Authorization:`Bearer ${e}`}});if(r.status===401)throw new Error("unauthorized");return r.ok?Vu(await r.arrayBuffer()):null}catch(t){if(t.message==="unauthorized")throw t;return l("Failed to fetch latest Drive backup for merge:",t,"warn"),null}}async function ju(){if(!di)return;let e=St();if(!e.isSignedIn||!e.accessToken)return;let t=await $u(e.accessToken).catch(async a=>a.message==="unauthorized"?(await pl({silent:!0}),null):(l("Failed to fetch latest Drive backup for merge:",a,"warn"),null)),n=t?[t]:[],r=0;for(let a of n)if(a)try{let{mergedVideos:o,mergedTimestamps:c}=await di(a);c>0&&(l(`Pre-backup merge: added ${c} timestamps from ${o} videos from remote`),r+=c)}catch(o){l("Failed to merge remote backup data:",o,"warn")}r>0&&mi&&mi()}function qu(e,t){let n=new TextEncoder().encode(e),r=t.replace(/\\/g,"/").replace(/^\/+/,"");return r.endsWith(".json")||(r+=".json"),js({[r]:[n,{level:6,mtime:Ou,os:0}]})}async function Wu(e,t,n,r){let a=e.replace(/\.json$/,".zip"),o=await ml(a,n,r),c=new TextEncoder().encode(t).length,s=qu(t,e),h=s.length;l(`Compressing data: ${c} bytes -> ${h} bytes (${Math.round(100-h/c*100)}% reduction)`);let m="-------314159265358979",u=`\r
--${m}\r
`,v=`\r
--${m}--`,y=o?{name:a,mimeType:"application/zip"}:{name:a,mimeType:"application/zip",parents:[n]},A=8192,D="";for(let X=0;X<s.length;X+=A){let ee=s.subarray(X,Math.min(X+A,s.length));D+=String.fromCharCode.apply(null,Array.from(ee))}let O=btoa(D),P=u+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify(y)+u+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+O+v,V,M;o?(V=`https://www.googleapis.com/upload/drive/v3/files/${o}?uploadType=multipart&fields=id,name`,M="PATCH"):(V="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",M="POST");let B=await fetch(V,{method:M,headers:{Authorization:`Bearer ${r}`,"Content-Type":`multipart/related; boundary=${m}`},body:P});if(B.status===401)throw new Error("unauthorized");if(!B.ok)throw new Error("drive upload failed")}async function pl(e){l("Auth expired, attempting silent token refresh",null,"warn"),!await Uu()&&(l("Silent OAuth: falling back to sign-out",null,"warn"),kt({isSignedIn:!1,accessToken:null,userName:null,email:null}),await ko(),await tn(),nt("error","Authorization expired. Please sign in again."),ve())}async function Ku(e){if(!fr())throw e?.silent||nt("error","Configure a backup destination first"),new Error("no-backup-destination");await ju();let t=await el({includeDeleted:!0});if(t.totalTimestamps===0){e?.silent||l("Skipping export: no timestamps to back up");return}let n=St();if(!n.accessToken)throw new Error("unauthorized");let r=await dl(n.accessToken);await Wu(t.filename,t.json,r,n.accessToken),l(`Exported backup to Google Drive (${t.filename}) with ${t.totalVideos} videos / ${t.totalTimestamps} timestamps.`)}async function fl(){try{let[e,t,n]=await Promise.all([bo("lastAutoBackupAt"),bo("autoBackupEnabled"),bo("autoBackupIntervalMinutes")]),r=Hr.partial().safeParse({autoBackupEnabled:t,autoBackupIntervalMinutes:n,lastAutoBackupAt:typeof e=="number"&&e>0?e:null});r.success?(typeof r.data.autoBackupEnabled=="boolean"&&$r(r.data.autoBackupEnabled),typeof r.data.autoBackupIntervalMinutes=="number"&&jr(r.data.autoBackupIntervalMinutes),typeof r.data.lastAutoBackupAt=="number"&&Wr(r.data.lastAutoBackupAt)):l("Failed to validate auto backup settings:",r.error.message,"warn")}catch(e){l("Failed to load auto backup settings:",e,"error")}}async function gi(){try{let e=Ie().auth,t={autoBackupEnabled:e.autoBackupEnabled,autoBackupIntervalMinutes:e.autoBackupIntervalMinutes,lastAutoBackupAt:e.lastAutoBackupAt},n=Hr.safeParse(t);if(!n.success){l("Invalid auto backup settings, cannot save",{settings:t,errors:n.error.message},"error");return}await Promise.all([yo("autoBackupEnabled",e.autoBackupEnabled),yo("autoBackupIntervalMinutes",e.autoBackupIntervalMinutes),yo("lastAutoBackupAt",e.lastAutoBackupAt)])}catch(e){l("Failed to save auto backup settings:",e,"error")}}function Yu(){mr&&(clearInterval(mr),mr=null),Ye&&(clearTimeout(Ye),Ye=null)}function bn(e){try{let t=new Date(e),n=new Date,r=t.toDateString()===n.toDateString(),a=t.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return r?a:`${t.toLocaleDateString()} ${a}`}catch{return""}}function li(){let e=_u();return e.length>0?`Destinations: ${e.join(", ")}`:"No backup destination configured"}function hl(){let e=Ie().auth;return e.autoBackupEnabled?e.isAutoBackupRunning?"#4285f4":e.autoBackupBackoffMs&&e.autoBackupBackoffMs>0?"#ffa500":$n()&&e.lastAutoBackupAt?"#52c41a":$n()?"#ffa500":"#ff4d4f":"#ff4d4f"}function ve(){if(vi(),!se)return;let e=Ie().auth;if(!e.autoBackupEnabled)ae(se,"refresh","Backup: Off"),se.onmouseenter=null,se.onmouseleave=null;else if(e.isAutoBackupRunning)ae(se,"refresh","Backing up\u2026"),se.onmouseenter=null,se.onmouseleave=null;else if(e.autoBackupBackoffMs&&e.autoBackupBackoffMs>0){let n=Math.ceil(e.autoBackupBackoffMs/6e4);ae(se,"alert-triangle",`Retry in ${n}m`),se.onmouseenter=null,se.onmouseleave=null}else if(!$n())ae(se,"alert-triangle","Backup target missing"),se.onmouseenter=null,se.onmouseleave=null;else if(e.lastAutoBackupAt){let n=e.lastAutoBackupAt,r=n+Math.max(1,Pt())*60*1e3,a=bn(r);se.onmouseenter=()=>{ae(se,"database",`Next backup: ${a}`)},se.onmouseleave=()=>{ae(se,"database",`Last backup: ${bn(n)}`)},ae(se,"database",`Last backup: ${bn(n)}`)}else{let n=Date.now()+Math.max(1,Pt())*60*1e3,r=bn(n);se.onmouseenter=()=>{ae(se,"database",`Next backup: ${r}`)},se.onmouseleave=()=>{ae(se,"database","Last backup: never")},ae(se,"database","Last backup: never")}se.style.display="inline";let t=hl();se.style.color=t}var ci="ytls-backup-indicator--pulsing",Qu="#4285f4",Vn=null;function Xu(e,t){Vn&&(e.removeEventListener("animationiteration",Vn),Vn=null),t===Qu?(e.style.backgroundColor=t,e.classList.add(ci)):e.classList.contains(ci)?(Vn=()=>{wn&&(wn.classList.remove(ci),wn.style.backgroundColor=t,Vn=null)},e.addEventListener("animationiteration",Vn,{once:!0})):e.style.backgroundColor=t}function vi(){if(!wn)return;let e=hl();Xu(wn,e),tt(wn,()=>{let t=Ie().auth,n="";if(!t.autoBackupEnabled)n="Auto backup is disabled";else if(t.isAutoBackupRunning)n="Backup in progress";else if(t.autoBackupBackoffMs&&t.autoBackupBackoffMs>0)n=`Retrying backup in ${Math.ceil(t.autoBackupBackoffMs/6e4)}m`;else if(!$n())n=li();else if(t.lastAutoBackupAt){let r=t.lastAutoBackupAt+Math.max(1,Pt())*60*1e3,a=bn(r);n=`Last backup: ${bn(t.lastAutoBackupAt)}
Next backup: ${a}
${li()}`}else{let r=Date.now()+Math.max(1,Pt())*60*1e3;n=`No backup yet
Next backup: ${bn(r)}
${li()}`}return n})}async function wo(e={}){let{silent:t=!0,skipBackoff:n=!1}=e;if(!$n()){t||(ve(),fr()||Gu());return}if(Ye){if(!n){l("Auto backup: backoff in progress, skipping scheduled run");return}clearTimeout(Ye),Ye=null,_n(null),l("Auto backup: manual run cleared backoff and will proceed immediately")}if(!Ie().auth.isAutoBackupRunning){qr(!0),ve();try{await Ku({silent:t}),Wr(Date.now()),cr(0),_n(null),Ye&&(clearTimeout(Ye),Ye=null),await gi()}catch(r){if(l("Auto backup failed:",r,"error"),r.message==="unauthorized"){l("Auth error detected, clearing token and stopping retries",null,"warn");let o=St();kt({...o,accessToken:null,isSignedIn:!1}),await ko(),nt("error","Authorization expired. Please sign in again."),ve(),cr(0),_n(null),Ye&&(clearTimeout(Ye),Ye=null)}else if(Ie().auth.autoBackupRetryAttempts<Ks){let o=Ie().auth.autoBackupRetryAttempts+1;cr(o);let s=Math.min(Fu*Math.pow(2,o-1),Nu);_n(s),Ye&&clearTimeout(Ye),Ye=setTimeout(()=>{wo({silent:!0})},s),l(`Scheduling backup retry ${o}/${Ks} in ${Math.round(s/1e3)}s`),ve()}else _n(null)}finally{qr(!1),ve()}}}async function tn(e=!1){if(Yu(),!!xo()&&$n()){if(mr=setInterval(()=>{wo({silent:!0})},Math.max(1,Pt())*60*1e3),!e){let t=Date.now(),n=Math.max(1,Pt())*60*1e3,r=Ie().auth.lastAutoBackupAt;(!r||t-r>=n)&&wo({silent:!0})}ve()}}async function gl(){let e=xo();$r(!e),await gi(),await tn(),ve()}async function vl(){let e=Pt(),t=prompt("Set Auto Backup interval (minutes):",String(e));if(t===null)return;let n=Math.floor(Number(t));if(!Number.isFinite(n)||n<5||n>1440){alert("Please enter a number between 5 and 1440 minutes.");return}jr(n),await gi(),await tn(),ve()}function yi(e,t){return ir(e).then(n=>n!==void 0?n:t)}function bi(e,t){return rr(e,t),Promise.resolve()}var wi=window.location.hash;if(wi&&wi.length>1){let e=new URLSearchParams(wi.substring(1));if(e.get("state")==="timekeeper_auth"){let n=e.get("access_token");if(n){console.log("[Timekeeper] Auth token detected in URL, broadcasting token"),console.log("[Timekeeper] Token length:",n.length,"characters");try{let r=new BroadcastChannel("timekeeper_oauth"),a={type:"timekeeper_oauth_token",token:n};console.log("[Timekeeper] Sending auth message via BroadcastChannel:",{type:a.type,tokenLength:n.length}),r.postMessage(a),r.close(),console.log("[Timekeeper] Token broadcast via BroadcastChannel completed")}catch(r){console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",r);let a={type:"timekeeper_oauth_token",token:n,timestamp:Date.now()},o=indexedDB.open("ytls-timestamps-db",4);o.onsuccess=()=>{let c=o.result,s=c.transaction("settings","readwrite");s.objectStore("settings").put({key:"oauth_message",value:a}),s.oncomplete=()=>{console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",a.timestamp),c.close()}}}if(history.replaceState){let r=window.location.pathname+window.location.search;history.replaceState(null,"",r)}throw console.log("[Timekeeper] Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}Bs();(async function(){"use strict";if(window.top!==window.self)return;function e(i){return yi(i,void 0)}function t(i,d){return bi(i,d)}fi(e),pi(t);try{let i=await ir("device_id"),d=typeof i=="string"&&i.length>0?i:crypto.randomUUID();await rr("device_id",d),l(`Lamport: device_id = ${d}`)}catch(i){l("Lamport: failed to initialize device_id:",i,"warn")}if(await ll()){l("OAuth popup detected, broadcasting token and closing");return}await hi();let r=["/watch","/live"];function a(i=window.location.href){try{let d=new URL(i);return d.origin!=="https://www.youtube.com"?!1:r.some(p=>d.pathname===p||d.pathname.startsWith(`${p}/`))}catch(d){return l("Timekeeper failed to parse URL for support check:",d,"error"),!1}}let o=null,c=null,s=null,h=null,m=null,u=null,v=(()=>{try{let i=parseFloat(localStorage.getItem("ytls-last-speed")??"");return Number.isFinite(i)&&i>0&&i!==1?Math.min(i,4):2}catch{return 2}})(),y=!1,A=null,D=null,O=250,P=null,V=!1;function M(){return Ie().ui.minPaneHeight}function B(i){gs(i)}function X(){return Ie().ui.lastHandledUrl}function ee(i){ys(i)}function fe(){return Ie().ui.urlChangeHandlersSetup}function le(i){bs(i)}function $(){return Ie().ui.panePosition}function F(i){vs(i)}function ke(){return Ie().timestamps.items}function ce(i){ws(i)}function Be(){return Ie().timestamps.currentIndex}function Ht(i){xs(i)}function ye(){return o?o.getBoundingClientRect():null}function Te(i,d,p){i&&F({x:Math.round(typeof d=="number"?d:i.left),y:Math.round(typeof p=="number"?p:i.top),width:Math.round(i.width),height:Math.round(i.height)})}function ue(i=!0){if(!o)return;An();let d=ye();if(d&&(d.width||d.height)&&(Te(d),i)){let p=$();Go("windowPosition",p),qn({type:"window_position_updated",position:p,timestamp:Date.now()})}}function re(){if(!o||!c||!h||!s)return;let i=40,d=Me();if(d.length>0)i=d[0].offsetHeight;else{let p=document.createElement("li");p.style.visibility="hidden",p.style.position="absolute",p.textContent="00:00 Example",s.appendChild(p),i=p.offsetHeight,s.removeChild(p)}O=c.offsetHeight+h.offsetHeight+i,B(O),o.style.minHeight=M()+"px"}function De(){requestAnimationFrame(()=>{Re?.(),re(),ue(!0)})}function be(i=450){xe&&(clearTimeout(xe),xe=null),xe=setTimeout(()=>{Se(),De(),xe=null},i)}function nn(){xe&&(clearTimeout(xe),xe=null)}function Ve(){s&&(s.style.visibility="hidden",l("Hiding timestamps during show animation")),De(),be()}function ut(){Se(),nn(),mt&&(clearTimeout(mt),mt=null),mt=setTimeout(()=>{o&&(o.style.display="none",Vi(),mt=null)},400)}function Se(){if(!s){ot&&(ot(),ot=null,zt=null,ln=null);return}if(!ln){s.style.visibility==="hidden"&&(s.style.visibility="",l("Restoring timestamp visibility (no deferred fragment)")),ot&&(ot(),ot=null,zt=null);return}l("Appending deferred timestamps after animation"),s.appendChild(ln),ln=null,Wt(),Kt(),s.style.visibility==="hidden"&&(s.style.visibility="",l("Restoring timestamp visibility after append")),ot&&(ot(),ot=null,zt=null),vt(),$e(),Re&&requestAnimationFrame(Re),yt(!0)}let ge=null,Q=!1,Ee="ytls-timestamp-pending-delete",Ce="ytls-timestamp-highlight";async function Vt(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(i=>setTimeout(i,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(i=>setTimeout(i,100));await new Promise(i=>setTimeout(i,200))}let on=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],xn=5e3,rn=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function $t(i){return rn.has(i)}function we(){return document.querySelector("video")}let dt=null;function de(){if(dt&&document.contains(dt))return dt;let i=document.getElementById("movie_player");return i&&document.contains(i)?i:null}function xi(i){return(Math.round(i*100)/100).toFixed(2).replace(/\.0+?$|(?<=\.[0-9])0+$/g,"")}function yl(i){let d=i===1?2:i;v=d;try{localStorage.setItem("ytls-last-speed",String(d))}catch{}}function hr(i){if(!u)return;let d=typeof i=="number"?i:we()?.playbackRate??1,p=xi(d);u.dataset.speed!==p&&(u.dataset.speed=p,u.textContent=`${p}x`,u.setAttribute("aria-label",`Playback speed ${p}x`)),Math.abs(d-1)>.01?u.classList.add("ytls-playback-speed-active"):u.classList.remove("ytls-playback-speed-active")}function bl(i){let d=de(),p=we();if(y=!0,d&&typeof d.setPlaybackRate=="function")d.setPlaybackRate(i);else if(p)p.playbackRate=i;else return y=!1,!1;return hr(i),!0}function ki(){let i=we()?.playbackRate;return Number.isFinite(i)?bl(Math.abs(i-1)<=.001?v:1):!1}function wl(i){return i instanceof Element?!!i.closest('input, textarea, select, [contenteditable], [role="textbox"]'):!1}function gr(i){return on.every(d=>typeof i?.[d]=="function"?!0:$t(d)?!!we():!1)}function xl(i){return on.filter(d=>typeof i?.[d]=="function"?!1:$t(d)?!we():!0)}async function kl(i=xn){let d=Date.now();for(;Date.now()-d<i;){let b=de();if(gr(b))return b;await new Promise(T=>setTimeout(T,100))}let p=de();return gr(p),p}let Ti="timestampOffsetSeconds",Tl=-5,Si="shiftClickTimeSkipSeconds",Sl=10,vr=300,yr=300,Et=null;function Ei(){try{return new URL(window.location.href).origin==="https://www.youtube.com"}catch{return!1}}function Ai(){if(Ei()&&!Et)try{Et=new BroadcastChannel("ytls_timestamp_channel"),Et.onmessage=Mi}catch(i){l("Failed to create BroadcastChannel:",i,"warn"),Et=null}}function qn(i){if(!Ei()){l("Skipping BroadcastChannel message: not on https://www.youtube.com","warn");return}if(Ai(),!Et){l("No BroadcastChannel available to post message","warn");return}try{Et.postMessage(i)}catch(d){l("BroadcastChannel error, reopening:",d,"warn");try{Et=new BroadcastChannel("ytls_timestamp_channel"),Et.onmessage=Mi,Et.postMessage(i)}catch(p){l("Failed to reopen BroadcastChannel:",p,"error")}}}function Mi(i){if(l("Received message from another tab:",i.data),!(!a()||!s||!o)&&i.data){if(i.data.type==="timestamps_updated"&&i.data.videoId===Ae)l("Debouncing timestamp load due to external update for video:",i.data.videoId),clearTimeout(Kn),Kn=setTimeout(()=>{l("Reloading timestamps due to external update for video:",i.data.videoId),Er()},500);else if(i.data.type==="window_position_updated"&&o){let d=i.data.position;if(d&&typeof d.x=="number"&&typeof d.y=="number"){o.style.left=`${d.x}px`,o.style.top=`${d.y}px`,o.style.right="auto",o.style.bottom="auto",typeof d.width=="number"&&d.width>0&&(o.style.width=`${d.width}px`),typeof d.height=="number"&&d.height>0&&(o.style.height=`${d.height}px`);let p=o.getBoundingClientRect();F({x:Math.round(d.x),y:Math.round(d.y),width:Math.round(p.width),height:Math.round(p.height)});let b=document.documentElement.clientWidth,T=document.documentElement.clientHeight;(p.left<0||p.top<0||p.right>b||p.bottom>T)&&An()}}}}Ai();let kn=await yi(Ti);(typeof kn!="number"||Number.isNaN(kn))&&(kn=Tl,await bi(Ti,kn));let Wn=await yi(Si);(typeof Wn!="number"||Number.isNaN(Wn))&&(Wn=Sl,await bi(Si,Wn));let Kn=null,an=new Map,sn=!1,G=null,To=null,Ae=null,mt=null,xe=null,pt=null,Qe=null,jt=null,br=!1,Re=null,ln=null,zt=null,ot=null,qt=null,So=!1,Zu=null,wr=!1,Eo=null,Ao=null,Mo=null,Lo=null,Io=null,Bo=null,Do=null,Co=null,Yn=null,Qn=null,Xn=null,ft=null,ht=null,Li=0,Jn=!1,cn=null,Zn=null,Tn=null,Ii=null,eo=null;function un(){if(!s)return{items:[],starts:[],rawTimes:[]};if(Ii!==s||!eo?(eo?.disconnect(),eo=new MutationObserver(()=>{Tn=null}),eo.observe(s,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-time"]}),Ii=s,Tn=null):eo.takeRecords().length>0&&(Tn=null),!Tn){let i=ar(s),d=new Array(i.length),p=new Array(i.length);for(let b=0;b<i.length;b++){let T=i[b].querySelector("[data-time]")?.dataset.time;d[b]=T?Number.parseInt(T,10):NaN,p[b]=T?parseFloat(T):0}Tn={items:i,starts:d,rawTimes:p}}return Tn}function Me(){return un().items}function xr(){return ps(s)}function gt(){return Zn!==null||(Zn=fs(s)),Zn}function Wt(){Zn=null}function El(i){let d=i.querySelector(".time-diff");return d?(d.textContent?.trim()||"").startsWith("-"):!1}let Al="\u251C\u2500 ",Bi="\u2514\u2500 ",Di=/^[├└]─\s/;function Ro(i){return Di.test(i)}function Ci(i){return i.replace(Di,"")}function Ri(i){let d=Me();if(i>=d.length-1)return Bi;let T=d[i+1].querySelector("input");return T&&Ro(T.value)?Al:Bi}function Ml(i,d){return`${Ri(d)}${i}`}function vt(){if(!s)return;Me().forEach((d,p)=>{let b=d.querySelector("input");if(!b||!Ro(b.value))return;let T=Ci(b.value),S=Ml(T,p);b.value!==S&&(b.value=S)})}function to(){sr(s),ln&&(ln=null),ot&&(ot(),ot=null,zt=null)}function no(){ms(s,Q)}function Pi(i){Vr(s,i)}function kr(){cs(s)}function Tr(i){if(!(!o||!s)){if(Q=i,i)o.style.display="",o.classList.remove("ytls-fade-out"),o.classList.add("ytls-fade-in"),Pi("Loading timestamps...");else if(kr(),o.style.display="",o.classList.remove("ytls-fade-out"),o.classList.add("ytls-fade-in"),m){let d=de();if(d){let p=d.getCurrentTime(),b=Number.isFinite(p)?Math.max(0,Math.floor(p)):Math.max(0,gt()),{isLive:T}=d.getVideoData()||{isLive:!1},S=s?un().rawTimes:[],x="";if(S.length>0)if(T){let E=Math.max(1,b/60),R=S.filter(I=>I<=b);if(R.length>0){let I=(R.length/E).toFixed(2);parseFloat(I)>0&&(x=` (${I}/min)`)}}else{let E=d.getDuration(),R=Number.isFinite(E)&&E>0?E:0,I=Math.max(1,R/60),C=(S.length/I).toFixed(1);parseFloat(C)>0&&(x=` (${C}/min)`)}m.textContent=`${Lt(b)}${x}`}}!Q&&s&&!uo(s)&&no(),Ot()}}function ed(i){return i?zn.safeParse(i).success:!1}function Po(i,d){i.dataset.time=String(d),i.textContent=Lt(d,gt())}let Ho=null,zo=null,At=!1;function Hi(i,d){if(!i||typeof i.getVideoData!="function"||!(d!==void 0?d:!!i.getVideoData()?.isLive))return!1;if(typeof i.getProgressState=="function"){let b=i.getProgressState(),T=Number(b?.seekableEnd??b?.liveHead??b?.head??b?.duration),S=Number(b?.current??i.getCurrentTime?.());if(Number.isFinite(T)&&Number.isFinite(S))return T-S>2}return!1}function Ll(i,d){if(!Number.isFinite(i))return;let p=zi(i);Sr(p,d)}function yt(i=!1,d){if(sn&&!i)return;let p;if(typeof d=="number"&&Number.isFinite(d))p=Math.max(0,Math.floor(d));else{let b=de(),T=b?b.getCurrentTime():NaN;p=Number.isFinite(T)?Math.max(0,Math.floor(T)):Math.max(0,gt())}Number.isFinite(p)&&Ll(p,i)}function zi(i){if(!Number.isFinite(i))return null;let{items:d,starts:p}=un(),b=-1,T=-1/0;for(let S=0;S<p.length;S++){let x=p[S];x<=i&&x>T&&(T=x,b=S)}return b>=0?d[b]:null}function Sr(i,d=!1){let p=s?s.getElementsByClassName(Ce):null;if(!(!!p&&(i?p.length===1&&p[0]===i:p.length===0))&&p)for(let T of Array.from(p))T.classList.contains(Ee)||T.classList.remove(Ce);if(i&&!i.classList.contains(Ee)&&(i.classList.add(Ce),d))try{if(s instanceof HTMLElement){let T=i.getBoundingClientRect(),S=s.getBoundingClientRect();!(T.bottom<S.top||T.top>S.bottom)||i.scrollIntoView({behavior:"smooth",block:"center"})}else i.scrollIntoView({behavior:"smooth",block:"center"})}catch{try{i.scrollIntoView({behavior:"smooth",block:"center"})}catch{}}}function Il(i){if(Mt()||!Number.isFinite(i)||i===0)return!1;let d=Me();if(d.length===0)return!1;let p=!1;return d.forEach(b=>{let T=b.querySelector("[data-time]"),S=T?.dataset.time;if(!T||!S)return;let x=Number.parseInt(S,10);if(!Number.isFinite(x))return;let E=Math.max(0,x+i);E!==x&&(Po(T,E),p=!0)}),p?(Kt(),vt(),$e(),Fo(Ae),cn=null,!0):!1}function Oi(i,d={}){if(!Number.isFinite(i)||i===0)return!1;if(!Il(i)){if(d.alertOnNoChange){let x=d.failureMessage??"Offset did not change any timestamps.";alert(x)}return!1}let b=d.logLabel??"bulk offset";l(`Timestamps changed: Offset all timestamps by ${i>0?"+":""}${i} seconds (${b})`);let T=de(),S=T?Math.floor(T.getCurrentTime()):0;if(Number.isFinite(S)){let x=zi(S);Sr(x,!1)}return!0}function Fi(i){if(!s||Q)return;let d=i.target instanceof Element?i.target:null;if(!d)return;let p=d.closest("[data-time]"),b=d.closest("[data-increment]"),T=d.closest("[data-action]");if(p?.dataset.time){i.preventDefault();let S=Number(p.dataset.time);if(Number.isFinite(S)){l(`Seeking to timestamp ${S}`),At=!0;let E=de();E&&E.seekTo(S),setTimeout(()=>{At=!1},500)}let x=p.closest("li");x&&(Me().forEach(E=>{E.classList.contains(Ee)||E.classList.remove(Ce)}),x.classList.contains(Ee)||(x.classList.add(Ce),x.scrollIntoView({behavior:"smooth",block:"center"})))}else if(b?.dataset.increment){i.preventDefault();let S=b.closest("li"),x=S?.querySelector("[data-time]");if(!x||!x.dataset.time)return;let E=parseInt(x.dataset.time,10),R=parseInt(b.dataset.increment,10);if("shiftKey"in i&&i.shiftKey&&(R*=Wn),"altKey"in i?i.altKey:!1){Oi(R,{logLabel:"Alt adjust"});return}let N=Math.max(0,E+R);if(l(`Timestamps changed: Timestamp time incremented from ${E} to ${N}`),Wt(),Po(x,N),zo=N,Ho&&clearTimeout(Ho),At=!0,Ho=setTimeout(()=>{if(zo!==null){let Y=de();Y&&Y.seekTo(zo)}Ho=null,zo=null,setTimeout(()=>{At=!1},500)},500),Kt(),vt(),$e(),S){let Y=S.querySelector("input"),me=S.dataset.guid;Y&&me&&(Sn(Ae,me,N,Y.value),cn=me)}}else T?.dataset.action==="clear"&&(i.preventDefault(),l("Timestamps changed: All timestamps cleared from UI"),s.textContent="",Wt(),$e(),Oo(),Fo(Ae,{allowEmpty:!0}),cn=null,no())}function oo(i,d="",p=!1,b=null,T=!0){if(!s)return null;let S=Math.max(0,i),x=b??crypto.randomUUID(),E=document.createElement("li"),R=document.createElement("div"),I=document.createElement("span"),C=document.createElement("span"),N=document.createElement("span"),Y=document.createElement("div"),me=document.createElement("span"),Xe=document.createElement("span"),K=document.createElement("input"),Le=document.createElement("button");E.dataset.guid=x,R.className="time-row",Y.className="ytls-row-controls";let je=document.createElement("div");je.style.cssText="position:absolute;left:0;top:0;width:20px;height:20px;display:flex;align-items:center;justify-content:center;cursor:pointer;",tt(je,"Click to toggle indent");let qe=document.createElement("span");qe.style.cssText="color:#f4ba78;pointer-events:none;display:none;line-height:0;";let Yt=()=>{let j=K.offsetTop,q=K.offsetHeight||20;je.style.top=`${j}px`,je.style.height=`${q}px`},dn=()=>{Fe(qe,Ro(K.value)?"indent-decrease":"indent-increase",18)},Mn="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",Qt=j=>{let q=qe.querySelector("svg");q&&(q.style.transition="filter 0.15s ease",q.style.filter=j?Mn:"none")},Ln=j=>{j.stopPropagation();let q=Ro(K.value),oe=Ci(K.value),Z="";if(!q){let at=Me().indexOf(E);Z=Ri(at)}K.value=Z?`${Z}${oe}`:oe,dn(),vt();let he=Number.parseInt(me.dataset.time??"0",10);Sn(Ae,x,he,K.value)};je.onclick=Ln,je.append(qe),je.addEventListener("mouseenter",()=>{Qt(!0)}),je.addEventListener("mouseleave",()=>{Qt(!1)}),E.style.cssText="position:relative;padding-left:20px;",E.addEventListener("mouseenter",()=>{Yt(),dn(),qe.style.display="inline"}),E.addEventListener("mouseleave",()=>{Qt(!1),qe.style.display="none"}),E.addEventListener("mouseleave",()=>{E.dataset.guid===cn&&El(E)&&Ni()}),K.value=d||"",K.style.cssText="width:100%;margin-top:5px;display:block;",K.type="text",K.setAttribute("inputmode","text"),K.autocapitalize="off",K.autocomplete="off",K.spellcheck=!1,requestAnimationFrame(Yt);let ro=!1;K.addEventListener("focusin",()=>{Jn=!1,ro=!1}),K.addEventListener("focusout",j=>{let q=j.relatedTarget,oe=Date.now()-Li<250,Z=!!q&&!!o&&o.contains(q);!oe&&!Z&&!ro&&(Jn=!0,setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(K.focus({preventScroll:!0}),Jn=!1)},0))}),K.addEventListener("keydown",j=>{(j.key==="Escape"||j.key==="Esc")&&(j.preventDefault(),ro=!0,K.blur())}),K.addEventListener("input",j=>{let q=j;if(q&&(q.isComposing||q.inputType==="insertCompositionText"))return;let oe=an.get(x);oe&&clearTimeout(oe);let Z=setTimeout(()=>{let he=Number.parseInt(me.dataset.time??"0",10);Sn(Ae,x,he,K.value),an.delete(x)},500);an.set(x,Z)}),K.addEventListener("compositionend",()=>{let j=Number.parseInt(me.dataset.time??"0",10);setTimeout(()=>{Sn(Ae,x,j,K.value)},50)});let Uo="#f4ba78",Ft="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",_o="#c8452d",Vo="drop-shadow(0 0 4px #e36a52) drop-shadow(0 0 8px #e36a52)",mn=(j,q=Uo,oe=Ft)=>{j.style.color=q;let Z=j.querySelector("svg");Z&&(Z.style.transition="filter 0.15s ease"),j.addEventListener("mouseenter",()=>{Z&&(Z.style.filter=oe)}),j.addEventListener("mouseleave",()=>{Z&&(Z.style.filter="none")})};Fe(I,"circle-minus",18),I.classList.add("ytls-row-control"),I.dataset.increment="-1",I.style.cursor="pointer",I.style.margin="0px",mn(I),Fe(N,"circle-plus",18),N.classList.add("ytls-row-control"),N.dataset.increment="1",N.style.cursor="pointer",N.style.margin="0px",mn(N),Fe(C,"current-location",18),C.classList.add("ytls-row-control"),C.style.cursor="pointer",C.style.margin="0px",tt(C,"Set to current playback time"),mn(C),C.onclick=()=>{let j=de(),q=j?Math.floor(j.getCurrentTime()):0;Number.isFinite(q)&&(l(`Timestamps changed: set to current playback time ${q}`),Wt(),Po(me,q),Kt(),vt(),Sn(Ae,x,q,K.value),cn=x)},Wt(),Po(me,S),me.addEventListener("click",j=>{j.preventDefault(),j.stopPropagation();let q=Number(me.dataset.time);if(!Number.isFinite(q))return;l(`Seeking to timestamp ${q}`),At=!0;let oe=de();oe&&oe.seekTo(q);let Z=we();Z?.paused&&Z.play(),setTimeout(()=>{At=!1},500),s?.querySelectorAll(`.${Ce}`).forEach(he=>he.classList.remove(Ce)),E.classList.contains(Ee)||(E.classList.add(Ce),E.scrollIntoView({behavior:"smooth",block:"center"}))}),Fe(Le,"trash",16),Le.classList.add("ytls-row-control"),Le.style.cssText="background:transparent;border:none;cursor:pointer;margin-left:5px;display:inline-flex;align-items:center;",mn(Le,_o,Vo),Le.onclick=()=>{let j=null,q=null,oe=null,Z=()=>{try{E.removeEventListener("click",q,!0)}catch{}try{document.removeEventListener("click",q,!0)}catch{}if(s)try{s.removeEventListener("mouseleave",oe)}catch{}j&&(clearTimeout(j),j=null)};if(E.dataset.deleteConfirmed==="true"){l("Timestamps changed: Timestamp deleted");let he=E.dataset.guid??"",We=an.get(he);We&&(clearTimeout(We),an.delete(he)),Z(),E.remove(),Wt(),Kt(),vt(),$e(),Oo(),Dl(Ae,he),cn=null,no()}else{E.dataset.deleteConfirmed="true",E.classList.add(Ee),E.classList.remove(Ce);let he=()=>{E.dataset.deleteConfirmed="false",E.classList.remove(Ee);let We=de(),at=We?We.getCurrentTime():0,In=Number.parseInt(E.querySelector("[data-time]")?.dataset.time??"0",10);Number.isFinite(at)&&Number.isFinite(In)&&at>=In&&E.classList.add(Ce),Z()};q=We=>{We.target!==Le&&he()},oe=()=>{E.dataset.deleteConfirmed==="true"&&he()},E.addEventListener("click",q,!0),document.addEventListener("click",q,!0),s&&s.addEventListener("mouseleave",oe),j=setTimeout(()=>{E.dataset.deleteConfirmed==="true"&&he(),Z()},5e3)}},Xe.className="time-diff",Xe.style.color="#888",Xe.style.marginLeft="5px",Y.append(I,C,N,Le),R.append(me,Y,Xe),E.append(je,R,K);let $o=Number.parseInt(me.dataset.time??"0",10);if(T){kr();let j=!1,q=Me();for(let oe=0;oe<q.length;oe++){let Z=q[oe],We=Z.querySelector("[data-time]")?.dataset.time;if(!We)continue;let at=Number.parseInt(We,10);if(Number.isFinite(at)&&$o<at){s.insertBefore(E,Z),j=!0;break}}j||s.appendChild(E),E.scrollIntoView({behavior:"smooth",block:"center"}),Wt(),Kt(),Oo(),vt(),$e(),p||(Sn(Ae,x,S,d),cn=x,Sr(E,!1))}else K.__ytls_li=E;return K}function Kt(){if(Mt())return;let i=gt(),d=Me();d.forEach((p,b)=>{let T=p.querySelector(".time-diff"),S=p.querySelector("[data-time]"),x=S?.dataset.time;if(S&&x){let Xe=Number.parseInt(x,10);Number.isFinite(Xe)&&(S.textContent=Lt(Xe,i))}if(!T)return;if(!x){T.textContent="";return}let E=Number.parseInt(x,10);if(!Number.isFinite(E)){T.textContent="";return}if(b===0){T.textContent="";return}let C=d[b-1].querySelector("[data-time]")?.dataset.time;if(!C){T.textContent="";return}let N=Number.parseInt(C,10);if(!Number.isFinite(N)){T.textContent="";return}let Y=E-N,me=Y<0?"-":"";T.textContent=` ${me}${Lt(Math.abs(Y))}`})}function Ni(){if(Mt())return;let i=null;if(document.activeElement instanceof HTMLInputElement&&s.contains(document.activeElement)){let x=document.activeElement,R=x.closest("li")?.dataset.guid;if(R){let I=x.selectionStart??x.value.length,C=x.selectionEnd??I,N=x.scrollLeft;i={guid:R,start:I,end:C,scroll:N}}}let d=Me();if(d.length===0)return;let p=d.map(x=>x.dataset.guid),b=d.map(x=>{let E=x.querySelector("[data-time]"),R=E?.dataset.time;if(!E||!R)return null;let I=Number.parseInt(R,10);if(!Number.isFinite(I))return null;let C=x.dataset.guid??"";return{time:I,guid:C,element:x}}).filter(x=>x!==null).sort((x,E)=>{let R=x.time-E.time;return R!==0?R:x.guid.localeCompare(E.guid)}),T=b.map(x=>x.guid),S=p.length!==T.length||p.some((x,E)=>x!==T[E]);if(s.replaceChildren(),b.forEach(x=>{s.appendChild(x.element)}),Kt(),vt(),$e(),i){let E=Me().find(R=>R.dataset.guid===i.guid)?.querySelector("input");if(E)try{E.focus({preventScroll:!0})}catch{}}S&&(l("Timestamps changed: Timestamps sorted"),Fo(Ae))}function Oo(){if(!s||!o||!c||!h)return;let i=Me().length;Re?.();let d=o.getBoundingClientRect(),p=c.getBoundingClientRect(),b=h.getBoundingClientRect(),T=Math.max(0,d.height-(p.height+b.height));i===0?(no(),s.style.overflowY="hidden"):s.style.overflowY=s.scrollHeight>T?"auto":"hidden"}function $e(){if(!s)return;let i=we(),d=document.querySelector(".ytp-progress-bar"),p=de(),b=p?p.getVideoData():null,T=!!b&&!!b.isLive;if(!i||!d||!isFinite(i.duration)||T)return;Ui();let{items:S,starts:x}=un(),E=i.duration,R=document.createDocumentFragment();S.forEach((I,C)=>{let N=x[C];if(!Number.isFinite(N))return;I.dataset.guid||(I.dataset.guid=crypto.randomUUID());let Y=document.createElement("div");Y.className="ytls-marker",Y.style.left=N/E*100+"%",Y.dataset.time=String(N),R.appendChild(Y)}),d.appendChild(R),Bl(d)}function Bl(i){i.dataset.ytlsMarkerClicks||(i.dataset.ytlsMarkerClicks="1",i.addEventListener("click",d=>{let p=d.target?.closest?.(".ytls-marker");if(!p)return;let b=Number(p.dataset.time),T=de();T&&Number.isFinite(b)&&T.seekTo(b)}))}function Fo(i,d={}){if(!s||Mt()||!i)return;if(Q){l("Save blocked: timestamps are currently loading");return}vt();let p=xr().sort((b,T)=>b.start-T.start);if(p.length===0&&!d.allowEmpty){l("Save skipped: no timestamps to save");return}ce(p),_i(i,p).then(()=>{l(`Successfully saved ${p.length} timestamps for ${i} to IndexedDB`),No()}).catch(b=>{let T=`Failed to save timestamps: ${b.message}`;l(`Failed to save timestamps for ${i} to IndexedDB:`,b,"error"),En(T)}),qn({type:"timestamps_updated",videoId:i,action:"saved"})}function Sn(i,d,p,b){if(!i||Q||Mt())return;let T={guid:d,start:p,comment:b};l(`Saving timestamp: guid=${d}, start=${p}, comment="${b}"`),Ol(i,T).then(()=>{s&&No()}).catch(S=>{let x=`Failed to save timestamp: ${S.message}`;l(`Failed to save timestamp ${d}:`,S,"error"),En(x)}),qn({type:"timestamps_updated",videoId:i,action:"saved"})}function Dl(i,d){!i||Q||Mt()||(Fl(i,d).then(()=>{s&&No()}).catch(p=>{let b=`Failed to delete timestamp: ${p.message}`;l(`Failed to delete timestamp ${d}:`,p,"error"),En(b)}),qn({type:"timestamps_updated",videoId:i,action:"saved"}))}async function Gi(i){if(Mt()){alert("Cannot export timestamps while an error is being displayed.");return}let d=Ae;if(!d)return;l(`Exporting timestamps for video ID: ${d}`);let p=xr(),b=Math.max(gt(),0),T=hn();if(i==="json"){let S=new Blob([JSON.stringify(p,null,2)],{type:"application/json"}),x=URL.createObjectURL(S),E=document.createElement("a");E.href=x,E.download=`timestamps-${d}-${T}.json`,E.click(),URL.revokeObjectURL(x)}else if(i==="text"){let S=p.map(I=>{let C=Lt(I.start,b),N=`${I.comment} <!-- guid:${I.guid} -->`.trimStart();return`${C} ${N}`}).join(`
`),x=new Blob([S],{type:"text/plain"}),E=URL.createObjectURL(x),R=document.createElement("a");R.href=E,R.download=`timestamps-${d}-${T}.txt`,R.click(),URL.revokeObjectURL(E)}}function En(i){if(!o||!s){l("Timekeeper error:",i,"error");return}us(s,i),Kr(i),$e()}function No(){s&&(ds(s),Kr(null))}function Mt(){return!!(!s||uo(s)||Q||ks()!==null)}function Ui(){document.querySelectorAll(".ytls-marker").forEach(i=>i.remove())}function An(){if(!o||!document.body.contains(o))return;let i=o.getBoundingClientRect(),d=document.documentElement.clientWidth,p=document.documentElement.clientHeight,b=i.width,T=i.height;if(i.left<0&&(o.style.left="0",o.style.right="auto"),i.right>d){let S=Math.max(0,d-b);o.style.left=`${S}px`,o.style.right="auto"}if(i.top<0&&(o.style.top="0",o.style.bottom="auto"),i.bottom>p){let S=Math.max(0,p-T);o.style.top=`${S}px`,o.style.bottom="auto"}}function Cl(){if(Eo&&(document.removeEventListener("mousemove",Eo),Eo=null),Ao&&(document.removeEventListener("mouseup",Ao),Ao=null),Yn&&(document.removeEventListener("keydown",Yn),Yn=null),Mo&&(window.removeEventListener("resize",Mo),Mo=null),Qn&&(document.removeEventListener("pointerdown",Qn,!0),Qn=null),Xn&&(document.removeEventListener("pointerup",Xn,!0),Xn=null),ft){try{ft.disconnect()}catch{}ft=null}if(ht){try{ht.disconnect()}catch{}ht=null}let i=we();i&&(Lo&&(i.removeEventListener("timeupdate",Lo),Lo=null),Io&&(i.removeEventListener("pause",Io),Io=null),Bo&&(i.removeEventListener("play",Bo),Bo=null),Do&&(i.removeEventListener("seeking",Do),Do=null),Co&&(i.removeEventListener("ratechange",Co),Co=null))}function Rl(){Ui(),an.forEach(d=>clearTimeout(d)),an.clear(),Kn&&(clearTimeout(Kn),Kn=null),ge&&(clearInterval(ge),ge=null),mt&&(clearTimeout(mt),mt=null),Cl(),$a();try{Et.close()}catch{}if(G&&G.parentNode===document.body&&document.body.removeChild(G),G=null,To=null,sn=!1,Ae=null,ft){try{ft.disconnect()}catch{}ft=null}if(ht){try{ht.disconnect()}catch{}ht=null}o&&o.parentNode&&o.remove();let i=document.getElementById("ytls-header-button");i&&i.parentNode&&i.remove(),qt=null,So=!1,F(null),to(),o=null,c=null,s=null,h=null,Qe=null,jt=null,Re=null,m=null,u=null,A=null,dt=null}async function Pl(){let i=Ar();if(!i)return dt=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let d=await kl();if(!gr(d)){let p=xl(d),b=p.length?` Missing methods: ${p.join(", ")}.`:"",T=d?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return dt=null,{ok:!1,message:`${T}${b} Try refreshing once playback is ready.`}}return dt=d,{ok:!0,player:d,videoId:i}}async function Er(){if(!o||!s)return;let i=s.scrollTop,d=!0,p=()=>{if(!s||!d)return;let b=Math.max(0,s.scrollHeight-s.clientHeight);s.scrollTop=Math.min(i,b)};try{let b=await Pl();if(!b.ok){En(b.message),to(),$e();return}let{videoId:T}=b,S=[];try{let x=await Nl(T);x?(S=x.map(E=>({...E,guid:E.guid||crypto.randomUUID()})),l(`Loaded ${S.length} timestamps from IndexedDB for ${T}`),No()):l(`No timestamps found in IndexedDB for ${T}`)}catch(x){let E=`Failed to load timestamps: ${x.message}`;l(`Failed to load timestamps from IndexedDB for ${T}:`,x,"error"),En(E),$e();return}if(S.length>0){S.sort((R,I)=>R.start-I.start),to(),kr();let x=document.createDocumentFragment();S.forEach(R=>{let C=oo(R.start,R.comment,!0,R.guid,!1).__ytls_li;C&&x.appendChild(C)}),o&&o.classList.contains("ytls-zoom-in")&&xe!=null?(l("Deferring timestamp DOM append until show animation completes"),ln=x,zt||(zt=new Promise(R=>{ot=R})),await zt):s&&(s.appendChild(x),Wt(),Kt(),vt(),$e(),Re&&requestAnimationFrame(Re)),ce(S),yt(!0),d=!1}else to(),Pi("No timestamps for this video"),$e(),ce([]),Re&&requestAnimationFrame(Re)}catch(b){l("Unexpected error while loading timestamps:",b,"error"),En("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{zt&&await zt,requestAnimationFrame(p),Re&&requestAnimationFrame(Re),s&&!uo(s)&&no()}}function Ar(){let d=new URLSearchParams(location.search).get("v");if(d)return d;let p=document.querySelector('meta[itemprop="identifier"]');return p?.content?p.content:null}function Hl(i=null,d=null){if(!m)return;let p=we(),b=d||de();if(!p&&!b)return;let T=i!==null?i:b?b.getCurrentTime():0,S=Number.isFinite(T)?Math.max(0,Math.floor(T)):Math.max(0,gt()),{isLive:x}=b?b.getVideoData()||{isLive:!1}:{isLive:!1},E=b?Hi(b,!!x):!1,R=s?un().rawTimes:[],I="";if(R.length>0)if(x){let C=Math.max(1,S/60),N=R.filter(Y=>Y<=S);if(N.length>0){let Y=(N.length/C).toFixed(2);parseFloat(Y)>0&&(I=` (${Y}/min)`)}}else{let C=b?b.getDuration():0,N=Number.isFinite(C)&&C>0?C:p&&Number.isFinite(p.duration)&&p.duration>0?p.duration:0,Y=Math.max(1,N/60),me=(R.length/Y).toFixed(1);parseFloat(me)>0&&(I=` (${me}/min)`)}m.textContent=`${Lt(S)}${I}`,m.style.color=E?"#ff4d4f":""}function zl(){let i=we();if(!i)return;let d=NaN,p=null,b=()=>{if(!s)return;let I=de(),C=I?Math.floor(I.getCurrentTime()):0;if(!Number.isFinite(C))return;let N=un();if(C===d&&N===p)return;let Y=!!m&&!Q&&!At;Y&&Hl(C,I),yt(!1,C),Y&&!sn&&(d=C,p=N)},T=I=>{try{let C=new URL(window.location.href);I!==null&&Number.isFinite(I)?C.searchParams.set("t",`${Math.floor(I)}s`):C.searchParams.delete("t"),window.history.replaceState(window.history.state,"",C.toString())}catch{}},S=()=>{let I=de(),C=I?I.getCurrentTime():NaN,N=Number.isFinite(C)?Math.max(0,Math.floor(C)):Math.max(0,gt());if(Number.isFinite(N)){T(N);try{yt(!0)}catch(Y){l("Failed to highlight nearest timestamp on pause:",Y,"warn")}}},x=()=>{T(null);try{let I=de(),C=I?I.getCurrentTime():NaN,N=Number.isFinite(C)?Math.max(0,Math.floor(C)):Math.max(0,gt());Number.isFinite(N)&&yt(!0)}catch(I){l("Failed to highlight nearest timestamp on play:",I,"warn")}},E=()=>{let I=we();if(!I)return;let C=de(),N=C?Math.floor(C.getCurrentTime()):0;Number.isFinite(N)&&(I.paused&&T(N),yt(!0,N))},R=()=>{let I=i.playbackRate;y?y=!1:yl(I),hr(I)};Lo=b,Io=S,Bo=x,Do=E,Co=R,i.addEventListener("timeupdate",b),i.addEventListener("pause",S),i.addEventListener("play",x),i.addEventListener("seeking",E),i.addEventListener("ratechange",R)}let{saveToIndexedDB:_i,saveSingleTimestampToIndexedDB:Ol,deleteSingleTimestampFromIndexedDB:Fl,loadFromIndexedDB:Nl,removeFromIndexedDB:Gl,saveGlobalSettings:Go,loadGlobalSettings:Mr,buildExportPayload:Ul,mergeBackupData:_l,exportAllTimestamps:Vl,buildExportCsvPayload:td,exportAllTimestampsCsv:$l}=_r;function Vi(){if(!o)return;let i=o.style.display!=="none";Go("uiVisible",i)}function Ot(i){let d=typeof i=="boolean"?i:!!o&&o.style.display!=="none",p=document.getElementById("ytls-header-button");p instanceof HTMLButtonElement&&p.setAttribute("aria-pressed",String(d)),qt&&!So&&qt.src!==nr&&(qt.src=nr)}function jl(){o&&Mr("uiVisible").then(i=>{let d=Zo().safeParse(i),p=d.success?d.data:void 0;typeof p=="boolean"?(p?(o.style.display="flex",o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in")):o.style.display="none",Ot(p)):(!d.success&&i!==void 0&&l("UI visibility state failed validation, defaulting to visible",d.error.message,"warn"),o.style.display="flex",o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in"),Ot(!0))}).catch(i=>{l("Failed to load UI visibility state:",i,"error"),o.style.display="flex",o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in"),Ot(!0)})}function Lr(i){if(!o){l("ERROR: togglePaneVisibility called but pane is null");return}document.body.contains(o)||(l("Pane not in DOM during toggle, appending it"),document.querySelectorAll("#ytls-pane").forEach(T=>{T!==o&&T.remove()}),document.body.appendChild(o));let d=document.querySelectorAll("#ytls-pane");d.length>1&&(l(`ERROR: Multiple panes detected in togglePaneVisibility (${d.length}), cleaning up`),d.forEach(T=>{T!==o&&T.remove()})),mt&&(clearTimeout(mt),mt=null);let p=o.style.display==="none";(typeof i=="boolean"?i:p)?(o.style.display="flex",o.classList.remove("ytls-fade-out"),o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in"),Ot(!0),Vi(),Ve(),xe&&(clearTimeout(xe),xe=null),xe=setTimeout(()=>{Se(),Re?.(),re(),ue(!0);try{yt(!0)}catch(T){l("Failed to scroll to nearest timestamp after toggle:",T,"warn")}xe=null},450)):(o.classList.remove("ytls-fade-in"),o.classList.remove("ytls-zoom-in"),o.classList.add("ytls-zoom-out"),Ot(!1),ut())}function $i(i){if(!s){l("UI is not initialized; cannot import timestamps.","warn");return}let d=!1;try{let p=JSON.parse(i),b=null;if(Array.isArray(p))b=p;else if(typeof p=="object"&&p!==null){let T=Ae;if(T){let S=`timekeeper-${T}`;p[S]&&Array.isArray(p[S].timestamps)&&(b=p[S].timestamps,l(`Found timestamps for current video (${T}) in export format`,"info"))}if(!b){let S=Object.keys(p).filter(x=>x.startsWith("ytls-"));if(S.length===1&&Array.isArray(p[S[0]].timestamps)){b=p[S[0]].timestamps;let x=p[S[0]].video_id;l(`Found timestamps for video ${x} in export format`,"info")}}}b&&Array.isArray(b)?b.every(S=>typeof S.start=="number"&&typeof S.comment=="string")?(b.forEach(S=>{if(S.guid){let x=Me().find(E=>E.dataset.guid===S.guid);if(x){let E=x.querySelector("input");E&&(E.value=S.comment)}else oo(S.start,S.comment,!1,S.guid)}else oo(S.start,S.comment,!1,crypto.randomUUID())}),d=!0):l("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):l("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!d){let p=i.split(`
`).map(b=>b.trim()).filter(b=>b);if(p.length>0){let b=!1;p.forEach(T=>{let S=T.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(S){b=!0;let x=parseInt(S[1])||0,E=parseInt(S[2]),R=parseInt(S[3]),I=x*3600+E*60+R,C=S[4]?S[4].trim():"",N=null,Y=C,me=C.match(/<!--\s*guid:([^>]+?)\s*-->/);me&&(N=me[1].trim(),Y=C.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let Xe;if(N&&(Xe=Me().find(K=>K.dataset.guid===N)),!Xe&&!N&&(Xe=Me().find(K=>{if(K.dataset.guid)return!1;let je=K.querySelector("[data-time]")?.dataset.time;if(!je)return!1;let qe=Number.parseInt(je,10);return Number.isFinite(qe)&&qe===I})),Xe){let K=Xe.querySelector("input");K&&(K.value=Y)}else oo(I,Y,!1,N||crypto.randomUUID())}}),b&&(d=!0)}}d?(l("Timestamps changed: Imported timestamps from file/clipboard"),vt(),Fo(Ae),$e(),Oo()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function ql(){if(wr){l("Pane initialization already in progress, skipping duplicate call");return}if(!(o&&document.body.contains(o))){wr=!0;try{let T=function(f=null,g=null){if(!m)return;let w=we(),k=g||de();if(!w&&!k)return;let L=f!==null?f:k?k.getCurrentTime():0,_=Number.isFinite(L)?Math.max(0,Math.floor(L)):Math.max(0,gt()),{isLive:H}=k?k.getVideoData()||{isLive:!1}:{isLive:!1},U=k?Hi(k,!!H):!1,z=s?un().rawTimes:[],W="";if(z.length>0)if(H){let ie=Math.max(1,_/60),te=z.filter(Pe=>Pe<=_);if(te.length>0){let Pe=(te.length/ie).toFixed(2);parseFloat(Pe)>0&&(W=` (${Pe}/min)`)}}else{let ie=k?k.getDuration():0,te=Number.isFinite(ie)&&ie>0?ie:w&&Number.isFinite(w.duration)&&w.duration>0?w.duration:0,Pe=Math.max(1,te/60),rt=(z.length/Pe).toFixed(1);parseFloat(rt)>0&&(W=` (${rt}/min)`)}m.textContent=`${Lt(_)}${W}`,m.style.color=U?"#ff4d4f":"",b(!!H);try{hr()}catch{}},S=function(){if(Q||At)return;let f=de();if(!f)return;let g=f.getCurrentTime(),w=Number.isFinite(g)?Math.max(0,Math.floor(g)):Math.max(0,gt());T(w,f),(s?Me():[]).length>0&&yt(!1,w)},Le=function(f,g,w,k){let L=document.createElement("button");return k?ae(L,k,f):L.textContent=f,tt(L,g),L.classList.add("ytls-settings-modal-button"),L.onclick=w,L},je=function(f="general"){if(G&&G.parentNode===document.body){let ze=document.getElementById("ytls-save-modal"),Zt=document.getElementById("ytls-load-modal"),Nt=document.getElementById("ytls-delete-all-modal");ze&&document.body.contains(ze)&&document.body.removeChild(ze),Zt&&document.body.contains(Zt)&&document.body.removeChild(Zt),Nt&&document.body.contains(Nt)&&document.body.removeChild(Nt),G.classList.remove("ytls-fade-in"),G.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(G)&&document.body.removeChild(G),G=null,document.removeEventListener("click",Yt,!0),document.removeEventListener("keydown",qe)},300);return}G=document.createElement("div"),G.id="ytls-settings-modal",G.classList.remove("ytls-fade-out"),G.classList.add("ytls-fade-in");let g=document.createElement("div");g.className="ytls-modal-header";let w=document.createElement("div");w.id="ytls-settings-nav";let k=document.createElement("button");k.className="ytls-modal-close-button",Fe(k,"x",14),k.onclick=()=>{if(G&&G.parentNode===document.body){let ze=document.getElementById("ytls-save-modal"),Zt=document.getElementById("ytls-load-modal"),Nt=document.getElementById("ytls-delete-all-modal");ze&&document.body.contains(ze)&&document.body.removeChild(ze),Zt&&document.body.contains(Zt)&&document.body.removeChild(Zt),Nt&&document.body.contains(Nt)&&document.body.removeChild(Nt),G.classList.remove("ytls-fade-in"),G.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(G)&&document.body.removeChild(G),G=null,document.removeEventListener("click",Yt,!0),document.removeEventListener("keydown",qe)},300)}};let L=document.createElement("div");L.id="ytls-settings-content";let _=document.createElement("h3");_.className="ytls-section-heading",_.textContent="General",_.style.display="none";let H=document.createElement("div"),U=document.createElement("div");U.className="ytls-button-grid";function z(ze){H.style.display=ze==="general"?"block":"none",U.style.display=ze==="google"?"block":"none",W.classList.toggle("active",ze==="general"),te.classList.toggle("active",ze==="google"),_.textContent=ze==="general"?"General":"Google"}let W=document.createElement("button");W.appendChild(so("adjustments-horizontal",16));let ie=document.createElement("span");ie.className="ytls-tab-text",ie.textContent=" General",W.appendChild(ie),tt(W,"General settings"),W.classList.add("ytls-settings-modal-button"),W.onclick=()=>z("general");let te=document.createElement("button");te.appendChild(so("cloud",16));let Pe=document.createElement("span");Pe.className="ytls-tab-text",Pe.textContent=" Google",te.appendChild(Pe),tt(te,"Google Drive backup settings"),te.classList.add("ytls-settings-modal-button"),te.onclick=async()=>{ct.isSignedIn&&await ul(),z("google")},w.appendChild(W),w.appendChild(te),g.appendChild(w),g.appendChild(k),G.appendChild(g),H.className="ytls-button-grid",H.appendChild(Le("Save","Save As...",dn.onclick,"device-floppy")),H.appendChild(Le("Load","Load",Mn.onclick,"folder-open")),H.appendChild(Le("Export All","Export All Data",Qt.onclick,"file-export")),H.appendChild(Le("Import All","Import All Data",Ln.onclick,"file-import")),H.appendChild(Le("Export All (CSV)","Export All Timestamps to CSV",async()=>{try{await $l()}catch{alert("Failed to export CSV: Could not read from database.")}},"file-spreadsheet"));let rt=Le(ct.isSignedIn?"Sign Out":"Sign In",ct.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{ct.isSignedIn?await cl():await sl(),ae(rt,ct.isSignedIn?"logout":"login",ct.isSignedIn?"Sign Out":"Sign In"),tt(rt,ct.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),ve()},ct.isSignedIn?"logout":"login"),Pn=Le(xo()?"Auto Backup: On":"Auto Backup: Off","Toggle Auto Backup",async()=>{await gl(),Jt(),ve()},"refresh"),fn=Le(`Backup Interval: ${Pt()}min`,"Set periodic backup interval (minutes)",async()=>{await vl(),Jt(),ve()},"clock-plus"),Jt=()=>{ae(rt,ct.isSignedIn?"logout":"login",ct.isSignedIn?"Sign Out":"Sign In"),tt(rt,ct.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),ae(Pn,"refresh",xo()?"Auto Backup: On":"Auto Backup: Off"),ae(fn,"clock-plus",`Backup Interval: ${Pt()}min`),typeof ve=="function"&&ve()};U.appendChild(rt),U.appendChild(Pn),U.appendChild(fn),U.appendChild(Le("Backup Now","Run a backup immediately",async()=>{await wo({silent:!1,skipBackoff:!0}),Jt()},"database"));let st=document.createElement("div");st.style.marginTop="15px",st.style.paddingTop="10px",st.style.borderTop="1px solid #555",st.style.fontSize="12px",st.style.color="#aaa";let Xo=document.createElement("div");Xo.style.marginBottom="8px",Xo.style.fontWeight="bold",st.appendChild(Xo),Xs(Xo);let Cr=document.createElement("div");Cr.style.marginBottom="8px",Ys(Cr),st.appendChild(Cr);let ea=document.createElement("div");Qs(ea),st.appendChild(ea),U.appendChild(st),nt(),jn(),ve(),Jt(),L.appendChild(_),L.appendChild(H),L.appendChild(U),z(f==="drive"?"google":f),G.appendChild(L),document.body.appendChild(G),requestAnimationFrame(()=>{let ze=G.getBoundingClientRect(),Nt=(window.innerHeight-ze.height)/2;G.style.top=`${Math.max(20,Nt)}px`,G.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",Yt,!0),document.addEventListener("keydown",qe)},0)},qe=function(f){if(f.key==="Escape"&&G&&G.parentNode===document.body){let g=document.getElementById("ytls-save-modal"),w=document.getElementById("ytls-load-modal"),k=document.getElementById("ytls-delete-all-modal");if(g||w||k)return;f.preventDefault(),g&&document.body.contains(g)&&document.body.removeChild(g),w&&document.body.contains(w)&&document.body.removeChild(w),k&&document.body.contains(k)&&document.body.removeChild(k),G.classList.remove("ytls-fade-in"),G.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(G)&&document.body.removeChild(G),G=null,document.removeEventListener("click",Yt,!0),document.removeEventListener("keydown",qe)},300)}},Yt=function(f){if(To&&To.contains(f.target))return;let g=document.getElementById("ytls-save-modal"),w=document.getElementById("ytls-load-modal"),k=document.getElementById("ytls-delete-all-modal");g&&g.contains(f.target)||w&&w.contains(f.target)||k&&k.contains(f.target)||G&&G.contains(f.target)||(g&&document.body.contains(g)&&document.body.removeChild(g),w&&document.body.contains(w)&&document.body.removeChild(w),k&&document.body.contains(k)&&document.body.removeChild(k),G&&G.parentNode===document.body&&(G.classList.remove("ytls-fade-in"),G.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(G)&&document.body.removeChild(G),G=null,document.removeEventListener("click",Yt,!0),document.removeEventListener("keydown",qe)},300)))},ro=function(){o&&(l("Loading window position from IndexedDB"),Mr("windowPosition").then(f=>{let g=oa.safeParse(f);if(g.success){let k=g.data;o.style.left=`${k.x}px`,o.style.top=`${k.y}px`,o.style.right="auto",o.style.bottom="auto",typeof k.width=="number"&&k.width>0?o.style.width=`${k.width}px`:(o.style.width=`${vr}px`,l(`No stored window width found, using default width ${vr}px`)),typeof k.height=="number"&&k.height>0?o.style.height=`${k.height}px`:(o.style.height=`${yr}px`,l(`No stored window height found, using default height ${yr}px`));let L=ye();Te(L,k.x,k.y),l("Restored window position from IndexedDB:",$())}else g.success?l("No window position found in IndexedDB, applying default size and leaving default position"):l("Window position in IndexedDB failed validation:",g.error.message,"warn"),o.style.width=`${vr}px`,o.style.height=`${yr}px`,F(null);An();let w=ye();w&&(w.width||w.height)&&Te(w),Re?.()}).catch(f=>{l("failed to load pane position from IndexedDB:",f,"warn"),An();let g=ye();g&&(g.width||g.height)&&F({x:Math.max(0,Math.round(g.left)),y:0,width:Math.round(g.width),height:Math.round(g.height)}),Re?.()}))},Uo=function(){if(!o)return;let f=ye();if(!f)return;let g={x:Math.max(0,Math.round(f.left)),y:Math.max(0,Math.round(f.top)),width:Math.round(f.width),height:Math.round(f.height)},w=$();if(w&&w.x===g.x&&w.y===g.y&&w.width===g.width&&w.height===g.height){l("Skipping window position save; position and size unchanged");return}F({...g}),l(`Saving window position and size to IndexedDB: x=${g.x}, y=${g.y}, width=${g.width}, height=${g.height}`),Go("windowPosition",g),qn({type:"window_position_updated",position:g,timestamp:Date.now()})},Wo=function(f,g){f.addEventListener("dblclick",w=>{w.preventDefault(),w.stopPropagation(),o&&(o.style.width="300px",o.style.height="300px",Uo(),Qo())}),f.addEventListener("mousedown",w=>{w.preventDefault(),w.stopPropagation(),pn=!0,Xt=g,Wi=w.clientX,Ki=w.clientY;let k=o.getBoundingClientRect();Bn=k.width,Dn=k.height,jo=k.left,qo=k.top,Yi=document.documentElement.clientWidth,Qi=document.documentElement.clientHeight,g==="top-left"||g==="bottom-right"?document.body.style.cursor="nwse-resize":document.body.style.cursor="nesw-resize"})},Ji=function(){if(!s||!jt)return;let{scrollTop:f,scrollHeight:g,clientHeight:w}=s;if(g<=w)return;let k=Math.max(30,w/g*w),L=f/(g-w)*(w-k);jt.style.height=`${k}px`,jt.style.top=`${L}px`},Zi=function(){Qe&&(Dr===null&&(Dr=requestAnimationFrame(()=>{Dr=null,Ji()})),Qe.classList.add("ytls-scrollbar-visible"),pt&&clearTimeout(pt),pt=setTimeout(()=>{Qe?.classList.remove("ytls-scrollbar-visible"),pt=null},500))},Qo=function(){if(o&&c&&h&&s){let f=o.getBoundingClientRect(),g=c.getBoundingClientRect(),w=h.getBoundingClientRect(),k=f.height-(g.height+w.height);s.style.maxHeight=k>0?k+"px":"0px",s.style.overflowY=k>0?"auto":"hidden"}};if(document.querySelectorAll("#ytls-pane").forEach(f=>f.remove()),!document.getElementById("ytls-styles")){let f=document.createElement("style");f.id="ytls-styles",f.textContent=Ga,document.head.appendChild(f)}o=document.createElement("div"),c=document.createElement("div"),s=document.createElement("ul"),h=document.createElement("div"),m=document.createElement("span"),A=document.createElement("span"),D=document.createElement("span"),D.classList.add("ytls-backup-indicator"),D.style.cursor="pointer",D.style.backgroundColor="#666",D.onclick=f=>{f.stopPropagation(),je("drive")},s.addEventListener("mouseenter",()=>{sn=!0,mo(!0),Jn=!1}),s.addEventListener("mouseleave",()=>{sn=!1,mo(!1);try{Or()}catch{}if(Jn)return;yt(!1);let f=null;if(document.activeElement instanceof HTMLInputElement&&s.contains(document.activeElement)&&(f=document.activeElement.closest("li")?.dataset.guid??null),Ni(),f){let w=Me().find(k=>k.dataset.guid===f)?.querySelector("input");if(w)try{w.focus({preventScroll:!0})}catch{}}}),o.id="ytls-pane",c.id="ytls-pane-header",c.addEventListener("dblclick",f=>{let g=f.target instanceof Element?f.target:null;if(g){let w=g;for(;w&&w!==o;){if(window.getComputedStyle(w).cursor==="pointer")return;w=w.parentElement}}f.preventDefault(),Lr(!1)});let i=f=>{try{f.stopPropagation()}catch{}};["click","dblclick","mousedown","pointerdown","touchstart","wheel"].forEach(f=>{o.addEventListener(f,i)}),o.addEventListener("keydown",f=>{try{f.stopPropagation()}catch{}}),o.addEventListener("keyup",f=>{try{f.stopPropagation()}catch{}}),o.addEventListener("focus",f=>{try{f.stopPropagation()}catch{}},!0),o.addEventListener("blur",f=>{try{f.stopPropagation()}catch{}},!0),A.textContent=`v${tr}`,A.classList.add("ytls-version-display");let d=document.createElement("span");d.style.display="inline-flex",d.style.alignItems="center",d.style.gap="6px",d.appendChild(A),d.appendChild(D),m.id="ytls-current-time",m.textContent="\u2014",m.style.cursor="default",tt(m,()=>{let f=de(),{isLive:g}=f?f.getVideoData()||{isLive:!1}:{isLive:!1};return g?"Skip to live":""}),u=document.createElement("span"),u.id="ytls-playback-speed",u.textContent="1x",u.style.cursor="pointer",u.style.userSelect="none",tt(u,()=>`Current playback speed. Click to toggle between 1x and ${xi(v)}x.`),u.onclick=()=>{ki()},u.addEventListener("mousedown",f=>{f.stopPropagation()}),u.addEventListener("click",f=>{f.stopPropagation()}),m.onclick=()=>{let f=de();if(!f)return;let{isLive:g}=f.getVideoData()||{isLive:!1};g&&(At=!0,f.seekToLiveHead(),setTimeout(()=>{At=!1},500))};let b=f=>{m.style.cursor=f?"pointer":"default"};S(),ge&&clearInterval(ge),ge=setInterval(S,1e3),h.id="ytls-buttons";let x=(f,g)=>()=>{f.classList.remove("ytls-fade-in"),f.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(f)&&document.body.removeChild(f),g&&g()},300)},E=f=>g=>{g.key==="Escape"&&(g.preventDefault(),g.stopPropagation(),f())},R=f=>{setTimeout(()=>{document.addEventListener("keydown",f)},0)},I=(f,g)=>w=>{f.contains(w.target)||g()},C=f=>{setTimeout(()=>{document.addEventListener("click",f,!0)},0)};[{id:"add",icon:"alarm-plus",title:"Add timestamp",action:()=>{if(Mt())return;let f=typeof kn<"u"?kn:0,g=de(),w=g?Math.floor(g.getCurrentTime()+f):0;if(!Number.isFinite(w))return;let k=oo(w,"");k&&k.focus()}},{id:"settings",icon:"settings",title:"Settings",action:()=>je()},{id:"copy",icon:"clipboard",title:"Copy timestamps to clipboard",action:function(f){if(Mt()){Fe(this,"circle-x",20),setTimeout(()=>{Fe(this,"clipboard",20)},2e3);return}let g=xr(),w=Math.max(gt(),0);if(g.length===0){Fe(this,"circle-x",20),setTimeout(()=>{Fe(this,"clipboard",20)},2e3);return}let k=f.ctrlKey,L=g.map(_=>{let H=Lt(_.start,w);return k?`${H} ${_.comment} <!-- guid:${_.guid} -->`.trimStart():`${H} ${_.comment}`}).join(`
`);navigator.clipboard.writeText(L).then(()=>{Fe(this,"circle-check",20),setTimeout(()=>{Fe(this,"clipboard",20)},2e3)}).catch(_=>{l("Failed to copy timestamps: ",_,"error"),Fe(this,"circle-x",20),setTimeout(()=>{Fe(this,"clipboard",20)},2e3)})}},{id:"offset",icon:"clock-plus",title:"Offset all timestamps",action:()=>{if(Mt())return;if(Me().length===0){alert("No timestamps available to offset.");return}let g=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(g===null)return;let w=g.trim();if(w.length===0)return;let k=Number.parseInt(w,10);if(!Number.isFinite(k)){alert("Please enter a valid integer number of seconds.");return}k!==0&&Oi(k,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{id:"delete",icon:"trash",title:"Delete all timestamps for current video",action:async()=>{let f=Ar();if(!f){alert("Unable to determine current video ID.");return}let g=document.createElement("div");g.id="ytls-delete-all-modal",g.classList.remove("ytls-fade-out"),g.classList.add("ytls-fade-in");let w=document.createElement("p");w.textContent="Hold the button to delete all timestamps for:",w.style.marginBottom="10px";let k=document.createElement("p");k.textContent=f,k.style.fontFamily="monospace",k.style.fontSize="12px",k.style.marginBottom="15px",k.style.color="#aaa";let L=document.createElement("button");L.classList.add("ytls-save-modal-button"),L.style.background="#d32f2f",L.style.position="relative",L.style.overflow="hidden";let _=null,H=0,U=null,z=document.createElement("div");z.style.position="absolute",z.style.left="0",z.style.top="0",z.style.height="100%",z.style.width="0%",z.style.background="#ff6b6b",z.style.transition="none",z.style.pointerEvents="none",L.appendChild(z);let W=document.createElement("span");W.textContent="Hold to Delete All",W.style.position="relative",W.style.zIndex="1",L.appendChild(W);let ie=()=>{if(!H)return;let Jt=Date.now()-H,st=Math.min(Jt/5e3*100,100);z.style.width=`${st}%`,st<100&&(U=requestAnimationFrame(ie))},te=()=>{_&&(clearTimeout(_),_=null),U&&(cancelAnimationFrame(U),U=null),H=0,z.style.width="0%",W.textContent="Hold to Delete All"};L.onmousedown=()=>{H=Date.now(),W.textContent="Deleting...",U=requestAnimationFrame(ie),_=setTimeout(async()=>{te(),g.classList.remove("ytls-fade-in"),g.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(g)&&document.body.removeChild(g);try{await Gl(f),Ir()}catch(Jt){l("Failed to delete all timestamps:",Jt,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},L.onmouseup=te,L.onmouseleave=te;let Pe=null,rt=null,Pn=x(g,()=>{te(),Pe&&document.removeEventListener("keydown",Pe),rt&&document.removeEventListener("click",rt,!0)});Pe=E(Pn),rt=I(g,Pn);let fn=document.createElement("button");fn.textContent="Cancel",fn.classList.add("ytls-save-modal-cancel-button"),fn.onclick=Pn,g.appendChild(w),g.appendChild(k),g.appendChild(L),g.appendChild(fn),document.body.appendChild(g),R(Pe),C(rt)}}].forEach(f=>{let g=document.createElement("button");Fe(g,f.icon,20),tt(g,f.title),g.classList.add("ytls-main-button"),f.id==="copy"?g.onclick=function(w){f.action.call(this,w)}:g.onclick=f.action,f.id==="settings"&&(To=g),h.appendChild(g)});let dn=document.createElement("button");ae(dn,"device-floppy","Save"),dn.classList.add("ytls-file-operation-button"),dn.onclick=()=>{let f=document.createElement("div");f.id="ytls-save-modal",f.classList.remove("ytls-fade-out"),f.classList.add("ytls-fade-in");let g=document.createElement("p");g.textContent="Save as:";let w=null,k=null,L=x(f,()=>{w&&document.removeEventListener("keydown",w),k&&document.removeEventListener("click",k,!0)});w=E(L),k=I(f,L);let _=document.createElement("button");_.textContent="JSON",_.classList.add("ytls-save-modal-button"),_.onclick=()=>{w&&document.removeEventListener("keydown",w),k&&document.removeEventListener("click",k,!0),x(f,()=>Gi("json"))()};let H=document.createElement("button");H.textContent="Plain Text",H.classList.add("ytls-save-modal-button"),H.onclick=()=>{w&&document.removeEventListener("keydown",w),k&&document.removeEventListener("click",k,!0),x(f,()=>Gi("text"))()};let U=document.createElement("button");U.textContent="Cancel",U.classList.add("ytls-save-modal-cancel-button"),U.onclick=L,f.appendChild(g),f.appendChild(_),f.appendChild(H),f.appendChild(U),document.body.appendChild(f),R(w),C(k)};let Mn=document.createElement("button");ae(Mn,"folder-open","Load"),Mn.classList.add("ytls-file-operation-button"),Mn.onclick=()=>{let f=document.createElement("div");f.id="ytls-load-modal",f.classList.remove("ytls-fade-out"),f.classList.add("ytls-fade-in");let g=document.createElement("p");g.textContent="Load from:";let w=null,k=null,L=x(f,()=>{w&&document.removeEventListener("keydown",w),k&&document.removeEventListener("click",k,!0)});w=E(L),k=I(f,L);let _=document.createElement("button");_.textContent="File",_.classList.add("ytls-save-modal-button"),_.onclick=()=>{let z=document.createElement("input");z.type="file",z.accept=".json,.txt",z.classList.add("ytls-hidden-file-input"),z.onchange=W=>{let ie=W.target.files?.[0];if(!ie)return;w&&document.removeEventListener("keydown",w),k&&document.removeEventListener("click",k,!0),L();let te=new FileReader;te.onload=()=>{let Pe=String(te.result).trim();$i(Pe)},te.readAsText(ie)},z.click()};let H=document.createElement("button");H.textContent="Clipboard",H.classList.add("ytls-save-modal-button"),H.onclick=async()=>{w&&document.removeEventListener("keydown",w),k&&document.removeEventListener("click",k,!0),x(f,async()=>{try{let z=await navigator.clipboard.readText();z?$i(z.trim()):alert("Clipboard is empty.")}catch(z){l("Failed to read from clipboard: ",z,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let U=document.createElement("button");U.textContent="Cancel",U.classList.add("ytls-save-modal-cancel-button"),U.onclick=L,f.appendChild(g),f.appendChild(_),f.appendChild(H),f.appendChild(U),document.body.appendChild(f),R(w),C(k)};let Qt=document.createElement("button");ae(Qt,"file-export","Export"),Qt.classList.add("ytls-file-operation-button"),Qt.onclick=async()=>{try{await Vl()}catch{alert("Failed to export data: Could not read from database.")}};let Ln=document.createElement("button");ae(Ln,"file-import","Import"),Ln.classList.add("ytls-file-operation-button"),Ln.onclick=()=>{let f=document.createElement("input");f.type="file",f.accept=".json",f.classList.add("ytls-hidden-file-input"),f.onchange=g=>{let w=g.target.files?.[0];if(!w)return;let k=new FileReader;k.onload=()=>{try{let L=JSON.parse(String(k.result)),_=[];for(let H in L)if(Object.prototype.hasOwnProperty.call(L,H)&&H.startsWith("ytls-")){let U=H.substring(5),z=L[H];if(z&&typeof z.video_id=="string"&&Array.isArray(z.timestamps)){let W=z.timestamps.map(te=>({...te,guid:te.guid||crypto.randomUUID()})),ie=_i(U,W).then(()=>l(`Imported ${U} to IndexedDB`)).catch(te=>l(`Failed to import ${U} to IndexedDB:`,te,"error"));_.push(ie)}else l(`Skipping key ${H} during import due to unexpected data format.`,"warn")}Promise.all(_).then(()=>{Ir()}).catch(H=>{alert("An error occurred during import to IndexedDB. Check console for details."),l("Overall import error:",H,"error")})}catch(L){alert(`Failed to import data. Please ensure the file is in the correct format.
`+L.message),l("Import error:",L,"error")}},k.readAsText(w)},f.click()},s.onclick=f=>{Fi(f)},s.ontouchstart=f=>{Fi(f)},o.style.position="fixed",o.style.bottom="0",o.style.right="0",o.style.transition="none",ro(),setTimeout(()=>An(),10);let Ft=!1,_o=0,Vo=0,mn=0,$o=0,j=0,q=0,oe=null,Z=!1;o.addEventListener("mousedown",f=>{let g=f.target;if(!(g instanceof Element)||g instanceof HTMLInputElement||g instanceof HTMLTextAreaElement||g instanceof Element&&(g.closest("#ytls-playback-speed-group")||g.closest("#ytls-playback-speed"))||g!==c&&!c.contains(g)&&window.getComputedStyle(g).cursor==="pointer")return;Ft=!0,Z=!1;let w=o.getBoundingClientRect();_o=f.clientX-w.left,Vo=f.clientY-w.top,mn=w.width,$o=w.height,j=document.documentElement.clientWidth,q=document.documentElement.clientHeight,o.style.transition="none"}),document.addEventListener("mousemove",Eo=f=>{if(!Ft)return;Z=!0;let g=f.clientX,w=f.clientY;oe===null&&(oe=requestAnimationFrame(()=>{if(oe=null,!Ft)return;let k=Math.max(0,Math.min(g-_o,j-mn)),L=Math.max(0,Math.min(w-Vo,q-$o));o.style.left=`${k}px`,o.style.top=`${L}px`,o.style.right="auto",o.style.bottom="auto"}))}),document.addEventListener("mouseup",Ao=()=>{if(!Ft)return;Ft=!1,oe!==null&&(cancelAnimationFrame(oe),oe=null);let f=Z;setTimeout(()=>{Z=!1},50),An(),setTimeout(()=>{f&&Uo()},200)}),o.addEventListener("dragstart",f=>f.preventDefault());let he=document.createElement("div"),We=document.createElement("div"),at=document.createElement("div"),In=document.createElement("div");he.id="ytls-resize-tl",We.id="ytls-resize-tr",at.id="ytls-resize-bl",In.id="ytls-resize-br";let pn=!1,Wi=0,Ki=0,Bn=0,Dn=0,jo=0,qo=0,Yi=0,Qi=0,Cn=null,Xt=null;Wo(he,"top-left"),Wo(We,"top-right"),Wo(at,"bottom-left"),Wo(In,"bottom-right"),document.addEventListener("mousemove",f=>{if(!pn||!o||!Xt)return;let g=f.clientX,w=f.clientY;Cn===null&&(Cn=requestAnimationFrame(()=>{if(Cn=null,!pn||!o||!Xt)return;let k=g-Wi,L=w-Ki,_=Yi,H=Qi,U=Bn,z=Dn,W=jo,ie=qo;Xt==="bottom-right"?(U=Math.max(200,Math.min(800,Bn+k)),z=Math.max(250,Math.min(H,Dn+L))):Xt==="top-left"?(U=Math.max(200,Math.min(800,Bn-k)),W=jo+k,z=Math.max(250,Math.min(H,Dn-L)),ie=qo+L):Xt==="top-right"?(U=Math.max(200,Math.min(800,Bn+k)),z=Math.max(250,Math.min(H,Dn-L)),ie=qo+L):Xt==="bottom-left"&&(U=Math.max(200,Math.min(800,Bn-k)),W=jo+k,z=Math.max(250,Math.min(H,Dn+L))),W=Math.max(0,Math.min(W,_-U)),ie=Math.max(0,Math.min(ie,H-z)),o.style.width=`${U}px`,o.style.height=`${z}px`,o.style.left=`${W}px`,o.style.top=`${ie}px`,o.style.right="auto",o.style.bottom="auto"}))}),document.addEventListener("mouseup",()=>{pn&&(pn=!1,Cn!==null&&(cancelAnimationFrame(Cn),Cn=null),Xt=null,document.body.style.cursor="",ue(!0))});let Ko=null;window.addEventListener("resize",Mo=()=>{Ko&&clearTimeout(Ko),Ko=setTimeout(()=>{ue(!0),Re?.(),Ko=null},200)}),c.appendChild(m);let Rn=document.createElement("span");Rn.id="ytls-playback-speed-group",Rn.style.display="inline-flex",Rn.style.alignItems="center",Rn.style.marginLeft="4px",u&&Rn.appendChild(u),c.appendChild(Rn),c.appendChild(d);let Br=document.createElement("div");Br.id="ytls-list-wrapper",Qe=document.createElement("div"),Qe.className="ytls-scrollbar-track",jt=document.createElement("div"),jt.className="ytls-scrollbar-thumb",Qe.append(jt),Br.append(s,Qe);let Yo=document.createElement("div");Yo.id="ytls-content",Yo.append(Br),Yo.append(h),o.append(c,Yo,he,We,at,In);let Xi="";o.addEventListener("mousemove",f=>{if(Ft||pn)return;let g=o.getBoundingClientRect(),w=20,k=f.clientX,L=f.clientY,_=k-g.left<=w,H=g.right-k<=w,U=L-g.top<=w,z=g.bottom-L<=w,W="";U&&_||z&&H?W="nwse-resize":(U&&H||z&&_)&&(W="nesw-resize"),W!==Xi&&(Xi=W,document.body.style.cursor=W)});let Dr=null;if(Qe.addEventListener("mouseenter",()=>{pt&&(clearTimeout(pt),pt=null),Qe.classList.add("ytls-scrollbar-visible")}),Qe.addEventListener("mouseleave",()=>{br||(pt=setTimeout(()=>{Qe?.classList.remove("ytls-scrollbar-visible"),pt=null},500))}),jt.addEventListener("mousedown",f=>{if(!s)return;f.preventDefault(),f.stopPropagation(),br=!0;let g=f.clientY,w=s.scrollTop,{scrollHeight:k,clientHeight:L}=s,_=Math.max(30,L/k*L),H=k-L,U=L-_;function z(ie){if(!s)return;let te=ie.clientY-g;s.scrollTop=Math.max(0,Math.min(H,w+te*(H/U))),Ji()}function W(){br=!1,document.removeEventListener("mousemove",z),document.removeEventListener("mouseup",W),Qe?.matches(":hover")||(pt=setTimeout(()=>{Qe?.classList.remove("ytls-scrollbar-visible"),pt=null},500))}document.addEventListener("mousemove",z),document.addEventListener("mouseup",W)}),o.addEventListener("mouseenter",()=>{sn=!0,mo(!0),Zi()}),s.addEventListener("scroll",Zi),o.addEventListener("mouseleave",()=>{!pn&&!Ft&&(document.body.style.cursor=""),sn=!1,mo(!1);try{Or()}catch{}try{yt(!1)}catch{}}),Re=Qo,setTimeout(()=>{if(Qo(),o&&c&&h&&s){let f=40,g=Me();if(g.length>0)f=g[0].offsetHeight;else{let w=document.createElement("li");w.style.visibility="hidden",w.style.position="absolute",w.textContent="00:00 Example",s.appendChild(w),f=w.offsetHeight,s.removeChild(w)}B(c.offsetHeight+h.offsetHeight+f),o.style.minHeight=M()+"px"}},0),ht){try{ht.disconnect()}catch{}ht=null}ht=new ResizeObserver(Qo),ht.observe(o),Qn||document.addEventListener("pointerdown",Qn=()=>{Li=Date.now()},!0),Xn||document.addEventListener("pointerup",Xn=()=>{},!0)}finally{wr=!1}}}async function Wl(){if(!o)return;if(document.querySelectorAll("#ytls-pane").forEach(p=>{p!==o&&(l("Removing duplicate pane element from DOM"),p.remove())}),document.body.contains(o)){l("Pane already in DOM, skipping append");return}await jl(),tl(Ul),nl(_l),pi(Go),fi(Mr),ol(Er),Js(D),await hi(),await fl(),await tn(),vi();let d=document.querySelectorAll("#ytls-pane");if(d.length>0&&(l(`WARNING: Found ${d.length} existing pane(s) in DOM, removing all`),d.forEach(p=>p.remove())),document.body.contains(o)){l("ERROR: Pane already in body, aborting append");return}if(document.body.appendChild(o),l("Pane successfully appended to DOM"),Ve(),xe&&(clearTimeout(xe),xe=null),xe=setTimeout(()=>{Se(),Re?.(),re(),ue(!0),xe=null},450),ft){try{ft.disconnect()}catch{}ft=null}ft=new MutationObserver(()=>{let p=document.querySelectorAll("#ytls-pane");p.length>1&&(l(`CRITICAL: Multiple panes detected (${p.length}), removing duplicates`),p.forEach((b,T)=>{(T>0||o&&b!==o)&&b.remove()}))}),ft.observe(document.body,{childList:!0})}function ji(i=0){if(document.getElementById("ytls-header-button")){Ot();return}let d=document.querySelector("#logo");if(!d||!d.parentElement){i<10&&setTimeout(()=>ji(i+1),300);return}let p=document.createElement("button");p.id="ytls-header-button",p.type="button",p.className="ytls-header-button",tt(p,"Toggle Timekeeper UI"),p.setAttribute("aria-label","Toggle Timekeeper UI");let b=document.createElement("img");b.src=nr,b.alt="",b.decoding="async",p.appendChild(b),qt=b,p.addEventListener("mouseenter",()=>{qt&&(So=!0,qt.src=Ua)}),p.addEventListener("mouseleave",()=>{qt&&(So=!1,Ot())}),p.addEventListener("click",()=>{o&&!document.body.contains(o)&&(l("Pane not in DOM, re-appending before toggle"),document.body.appendChild(o)),Lr()}),d.insertAdjacentElement("afterend",p),Ot(),l("Timekeeper header button added next to YouTube logo")}function qi(){if(fe())return;le(!0);let i=history.pushState,d=history.replaceState;function p(){try{let b=new Event("locationchange");window.dispatchEvent(b)}catch{}}history.pushState=function(){let b=i.apply(this,arguments);return p(),b},history.replaceState=function(){let b=d.apply(this,arguments);return p(),b},window.addEventListener("popstate",p),window.addEventListener("locationchange",()=>{window.location.href!==P&&l("Location changed (locationchange event) \u2014 deferring UI update until navigation finish")})}async function Ir(){if(!a()){Rl();return}ee(window.location.href),document.querySelectorAll("#ytls-pane").forEach((d,p)=>{(p>0||o&&d!==o)&&d.remove()}),await Vt(),await ql(),Ae=Ar();let i=document.title;l("Page Title:",i),l("Video ID:",Ae),l("Current URL:",window.location.href),Tr(!0),to(),$e(),await Er(),$e(),Tr(!1),l("Timestamps loaded and UI unlocked for video:",Ae),await Wl();try{yt(!0)}catch{}ji(),zl()}qi(),window.addEventListener("yt-navigate-start",()=>{l("Navigation started (yt-navigate-start event fired)"),a()&&o&&s&&(l("Locking UI and showing loading state for navigation"),Tr(!0))}),Yn=i=>{if(!i.repeat&&!i.ctrlKey&&!i.altKey&&!i.metaKey&&!i.shiftKey&&(i.key==="z"||i.key==="Z")){if(wl(i.target))return;ki()&&(i.preventDefault(),l("Playback speed toggled via keyboard shortcut (Z)"));return}i.ctrlKey&&i.altKey&&i.shiftKey&&(i.key==="T"||i.key==="t")&&(i.preventDefault(),Lr(),l("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",Yn),window.addEventListener("yt-navigate-finish",()=>{l("Navigation finished (yt-navigate-finish event fired)"),window.location.href!==P?Ir():l("Navigation finished but URL already handled, skipping.")}),qi(),l("Timekeeper initialized and waiting for navigation events")})();})();

