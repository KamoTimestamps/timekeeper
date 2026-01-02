// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      4.4.14
// @description  Enhanced timestamp tool for YouTube videos
// @author       Silent Shout
// @match        https://www.youtube.com/*
// @run-at       document-idle
// @noframes
// @icon         https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_64px_Indexed.png
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.setClipboard
// @homepageURL  https://github.com/KamoTimestamps/timekeeper
// @supportURL   https://github.com/KamoTimestamps/timekeeper/issues
// @downloadURL  https://raw.githubusercontent.com/KamoTimestamps/timekeeper/main/timekeeper.user.js
// @updateURL    https://raw.githubusercontent.com/KamoTimestamps/timekeeper/main/timekeeper.user.js
// @license MIT
// ==/UserScript==

(()=>{function u(e,...t){let r="debug",a=[...t];t.length>0&&typeof t[t.length-1]=="string"&&["debug","info","warn","error"].includes(t[t.length-1])&&(r=a.pop());let n=`[Timekeeper v${GM_info.script.version}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[r](`${n} ${e}`,...a)}function xt(e,t=e){let r=Math.floor(e/3600),a=Math.floor(e%3600/60),s=String(e%60).padStart(2,"0");return t<3600?`${a<10?a:String(a).padStart(2,"0")}:${s}`:`${t>=36e3?String(r).padStart(2,"0"):r}:${String(a).padStart(2,"0")}:${s}`}function bo(e,t=window.location.href){try{let r=new URL(t);return r.searchParams.set("t",`${e}s`),r.toString()}catch{return`https://www.youtube.com/watch?v=${t.search(/[?&]v=/)>=0?t.split(/[?&]v=/)[1].split(/&/)[0]:t.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${e}s`}}function Wn(){let e=new Date;return e.getUTCFullYear()+"-"+String(e.getUTCMonth()+1).padStart(2,"0")+"-"+String(e.getUTCDate()).padStart(2,"0")+"--"+String(e.getUTCHours()).padStart(2,"0")+"-"+String(e.getUTCMinutes()).padStart(2,"0")+"-"+String(e.getUTCSeconds()).padStart(2,"0")}var Ar=[{emoji:"\u{1F942}",month:1,day:1,name:"New Year's Day"},{emoji:"\u{1F49D}",month:2,day:14,name:"Valentine's Day"},{emoji:"\u{1F986}",month:5,day:25,name:"Kanna's Debut Anniversary"},{emoji:"\u{1F383}",month:10,day:31,name:"Halloween"},{emoji:"\u{1F382}",month:9,day:15,name:"Kanna's Birthday"},{emoji:"\u{1F332}",month:12,day:25,name:"Christmas"}];function li(){let e=new Date,t=e.getFullYear(),r=e.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});for(let a of Ar){let s=new Date(t,a.month-1,a.day),n=s.getTime()-e.getTime(),p=n/(1e3*60*60*24);if(p<=5&&p>=-2)return u(`Current date: ${r}, Selected emoji: ${a.emoji} (${a.name}), Days until holiday: ${Math.ceil(p)}`),a.emoji;if(p<-2&&(s=new Date(t+1,a.month-1,a.day),n=s.getTime()-e.getTime(),p=n/(1e3*60*60*24),p<=5&&p>=-2))return u(`Current date: ${r}, Selected emoji: ${a.emoji} (${a.name}), Days until holiday: ${Math.ceil(p)}`),a.emoji;if(p>5&&(s=new Date(t-1,a.month-1,a.day),n=s.getTime()-e.getTime(),p=n/(1e3*60*60*24),p<=5&&p>=-2))return u(`Current date: ${r}, Selected emoji: ${a.emoji} (${a.name}), Days until holiday: ${Math.ceil(p)}`),a.emoji}return u(`Current date: ${r}, No holiday emoji (not within range)`),null}var at=null,At=null,Br=500;function Pr(){return(!at||!document.body.contains(at))&&(at=document.createElement("div"),at.className="ytls-tooltip",document.body.appendChild(at)),at}function zr(e,t,r){let s=window.innerWidth,n=window.innerHeight,p=e.getBoundingClientRect(),l=p.width,x=p.height,T=t+10,E=r+10;T+l>s-10&&(T=t-l-10),E+x>n-10&&(E=r-x-10),T=Math.max(10,Math.min(T,s-l-10)),E=Math.max(10,Math.min(E,n-x-10)),e.style.left=`${T}px`,e.style.top=`${E}px`}function ci(e,t,r,a=!1){At&&(clearTimeout(At),At=null);let s=()=>{let n=Pr();if(typeof e=="string")n.textContent=e;else{for(;n.firstChild;)n.removeChild(n.firstChild);n.appendChild(e.cloneNode(!0))}n.classList.remove("ytls-tooltip-visible"),zr(n,t,r),requestAnimationFrame(()=>{n.classList.add("ytls-tooltip-visible")})};a?s():At=setTimeout(s,Br)}function Fr(){At&&(clearTimeout(At),At=null),at&&at.classList.remove("ytls-tooltip-visible")}function _e(e,t){let r=0,a=0;e.__tooltipGetText=t,e.__tooltipLastMouseX=r,e.__tooltipLastMouseY=a;let s=l=>{r=l.clientX,a=l.clientY,e.__tooltipLastMouseX=r,e.__tooltipLastMouseY=a;let x=typeof t=="function"?t():t;x&&ci(x,r,a)},n=l=>{r=l.clientX,a=l.clientY,e.__tooltipLastMouseX=r,e.__tooltipLastMouseY=a},p=()=>{Fr()};e.addEventListener("mouseenter",s),e.addEventListener("mousemove",n),e.addEventListener("mouseleave",p),e.__tooltipCleanup=()=>{e.removeEventListener("mouseenter",s),e.removeEventListener("mousemove",n),e.removeEventListener("mouseleave",p)}}function Kn(e){let t=e.__tooltipGetText;if(!t)return;let r=e.__tooltipLastMouseX??Math.floor(window.innerWidth/2),a=e.__tooltipLastMouseY??Math.floor(window.innerHeight/2),s=typeof t=="function"?t():t;if(!s)return;let n=at&&at.classList.contains("ytls-tooltip-visible");ci(s,r,a,!!n)}var Rr=(e,t)=>t.some(r=>e instanceof r),ui,di;function Or(){return ui||(ui=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Hr(){return di||(di=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}var mi=new WeakMap,xo=new WeakMap,fi=new WeakMap,wo=new WeakMap,Eo=new WeakMap;function $r(e){let t=new Promise((r,a)=>{let s=()=>{e.removeEventListener("success",n),e.removeEventListener("error",p)},n=()=>{r(st(e.result)),s()},p=()=>{a(e.error),s()};e.addEventListener("success",n),e.addEventListener("error",p)});return t.then(r=>{r instanceof IDBCursor&&mi.set(r,e)}).catch(()=>{}),Eo.set(t,e),t}function _r(e){if(xo.has(e))return;let t=new Promise((r,a)=>{let s=()=>{e.removeEventListener("complete",n),e.removeEventListener("error",p),e.removeEventListener("abort",p)},n=()=>{r(),s()},p=()=>{a(e.error||new DOMException("AbortError","AbortError")),s()};e.addEventListener("complete",n),e.addEventListener("error",p),e.addEventListener("abort",p)});xo.set(e,t)}var To={get(e,t,r){if(e instanceof IDBTransaction){if(t==="done")return xo.get(e);if(t==="objectStoreNames")return e.objectStoreNames||fi.get(e);if(t==="store")return r.objectStoreNames[1]?void 0:r.objectStore(r.objectStoreNames[0])}return st(e[t])},set(e,t,r){return e[t]=r,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function pi(e){To=e(To)}function Nr(e){return e===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...r){let a=e.call(Yn(this),t,...r);return fi.set(a,t.sort?t.sort():[t]),st(a)}:Hr().includes(e)?function(...t){return e.apply(Yn(this),t),st(mi.get(this))}:function(...t){return st(e.apply(Yn(this),t))}}function Gr(e){return typeof e=="function"?Nr(e):(e instanceof IDBTransaction&&_r(e),Rr(e,Or())?new Proxy(e,To):e)}function st(e){if(e instanceof IDBRequest)return $r(e);if(wo.has(e))return wo.get(e);let t=Gr(e);return t!==e&&(wo.set(e,t),Eo.set(t,e)),t}var Yn=e=>Eo.get(e);function gi(e,t,{blocked:r,upgrade:a,blocking:s,terminated:n}={}){let p=indexedDB.open(e,t),l=st(p);return a&&p.addEventListener("upgradeneeded",x=>{a(st(p.result),x.oldVersion,x.newVersion,st(p.transaction),x)}),r&&p.addEventListener("blocked",x=>r(x.oldVersion,x.newVersion,x)),l.then(x=>{n&&x.addEventListener("close",()=>n()),s&&x.addEventListener("versionchange",T=>s(T.oldVersion,T.newVersion,T))}).catch(()=>{}),l}var Ur=["get","getKey","getAll","getAllKeys","count"],Vr=["put","add","delete","clear"],ko=new Map;function hi(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(ko.get(t))return ko.get(t);let r=t.replace(/FromIndex$/,""),a=t!==r,s=Vr.includes(r);if(!(r in(a?IDBIndex:IDBObjectStore).prototype)||!(s||Ur.includes(r)))return;let n=async function(p,...l){let x=this.transaction(p,s?"readwrite":"readonly"),T=x.store;return a&&(T=T.index(l.shift())),(await Promise.all([T[r](...l),s&&x.done]))[0]};return ko.set(t,n),n}pi(e=>({...e,get:(t,r,a)=>hi(t,r)||e.get(t,r,a),has:(t,r)=>!!hi(t,r)||e.has(t,r)}));var yi="ytls-timestamps-db",jr=7,Zn=null;function Ne(){return Zn||(Zn=gi(yi,jr,{upgrade(e,t,r,a){if(t<1&&e.createObjectStore("timestamps",{keyPath:"video_id"}),t<2&&!e.objectStoreNames.contains("settings")&&e.createObjectStore("settings",{keyPath:"key"}),t<3){if(!e.objectStoreNames.contains("timestamps_v2")){let s=e.createObjectStore("timestamps_v2",{keyPath:"guid"});s.createIndex("video_id","video_id",{unique:!1}),s.createIndex("video_start",["video_id","start"],{unique:!1})}if(e.objectStoreNames.contains("timestamps")){try{let n=a.objectStore("timestamps").getAll();n.onsuccess=()=>{let p=n.result;if(p.length>0){let l=a.objectStore("timestamps_v2");p.forEach(x=>{Array.isArray(x.timestamps)&&x.timestamps.length>0&&x.timestamps.forEach(T=>{try{l.put({guid:T.guid||crypto.randomUUID(),video_id:x.video_id,start:T.start,comment:T.comment})}catch{}})})}}}catch{}try{e.deleteObjectStore("timestamps")}catch{}}}if(t<4&&!e.objectStoreNames.contains("video_metadata")){let s=e.createObjectStore("video_metadata",{keyPath:"video_id"});try{s.createIndex("published_at","published_at",{unique:!1})}catch{}try{s.createIndex("members","members",{unique:!1})}catch{}}}})),Zn}async function vi(e){return(await Ne()).getAll(e)}async function Xn(e,t){return(await Ne()).get(e,t)}async function bi(e,t){await(await Ne()).put(e,t)}async function wi(e){await(await Ne()).clear(e)}async function xi(e,t,r){let s=(await Ne()).transaction(e,t),n={};Array.isArray(e)?e.forEach(l=>{n[l]=s.objectStore(l)}):n[e]=s.objectStore(e);let p=await Promise.resolve(r(s,n));return await s.done,p}async function Ti(e){let t=await Ne();if(t.objectStoreNames.contains(e))return;let r=t.version;t.close(),await new Promise((a,s)=>{let n=indexedDB.open(yi,r+1);n.onupgradeneeded=()=>{let p=n.result;if(!p.objectStoreNames.contains(e)){let l=p.createObjectStore(e,{keyPath:"video_id"});if(e==="video_metadata"){try{l.createIndex("published_at","published_at",{unique:!1})}catch{}try{l.createIndex("members","members",{unique:!1})}catch{}}}},n.onsuccess=()=>{try{n.result.close()}catch{}a()},n.onerror=()=>s(n.error??new Error("Failed to ensure object store"))}),Zn=null}function ki(e){let t=[],r=/("(?:[^"]|"")*"|[^,]*)(,|$)/g,a;for(;(a=r.exec(e))!==null;){let s=a[1]??"";if(s.startsWith('"')&&s.endsWith('"')&&(s=s.slice(1,-1).replace(/""/g,'"')),t.push(s),a[0].length===0)break}return t}function qr(e){let t=e.split(/\r?\n/).filter(s=>s.trim().length>0);if(t.length===0)return[];let r=ki(t[0]).map(s=>s.trim()),a=[];for(let s=1;s<t.length;s++){let n=t[s],p=ki(n),l={};for(let x=0;x<r.length;x++)l[r[x]]=p[x]??"";a.push(l)}return a}async function Wr(e,t){let r=e.map(a=>({video_id:(a.video_id??a.videoId??"").trim(),title:(a.title??"").trim(),published_at:(a.published_at??a.publishedAt??"").trim(),thumbnail_url:(a.thumbnail_url??a.thumbnailUrl??"").trim(),members:String((a.members??"").trim()).toLowerCase()==="true"}));await wi(t.VIDEO_METADATA_STORE),r.length>0&&await xi(t.VIDEO_METADATA_STORE,"readwrite",async(a,s)=>{let n=s[t.VIDEO_METADATA_STORE];for(let p of r)p.video_id&&await n.put(p)}),t.log(`IndexedDB: updated ${r.length} video metadata records`);try{window.dispatchEvent(new CustomEvent("video_metadata_updated",{detail:{count:r.length}}))}catch{}}var Jn=new Map;async function Si(e){if(!e)return u("getVideoMetadata called with empty videoId"),null;if(Jn.has(e)){let t=Jn.get(e);return u("getVideoMetadata: cache hit for",e,t.title??""),t}try{let t=await Xn("video_metadata",e);return t?(Jn.set(e,t),u("getVideoMetadata: loaded from IDB for",e,t.title??""),t):(u("getVideoMetadata: no record found for",e),null)}catch(t){return u("getVideoMetadata: error fetching from IDB for",e,t,"warn"),null}}function So(){Jn.clear(),u("Cleared video metadata cache")}async function Kr(e){let t="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/metadata/videos.csv",r;try{let n=await e.loadGlobalSettings(e.VIDEOS_CSV_ETAG_KEY);typeof n=="string"&&(r=n)}catch(n){e.log("Failed to load stored videos CSV etag:",n,"warn")}let a=n=>{let p={};return n&&(p["If-None-Match"]=n),p.Accept="text/plain",p},s;try{s=await fetch(t,{headers:a(r),cache:"no-store"})}catch(n){e.log("Failed to fetch videos.csv:",n,"warn");return}if(s.status===304){e.log("videos.csv not modified (304)");return}if(s.status===200){let n=s.headers.get("etag"),p=await s.text(),l=async()=>{try{let x=qr(p);if(await Wr(x,e),n)try{await e.saveGlobalSettings(e.VIDEOS_CSV_ETAG_KEY,n),e.log("Saved videos.csv ETag to IndexedDB")}catch(T){e.log("Failed to save videos CSV etag:",T,"warn")}}catch(x){e.log("Failed to parse or store videos.csv contents:",x,"error")}};if(typeof window.requestIdleCallback=="function")try{window.requestIdleCallback(()=>{l()},{timeout:2e3})}catch{setTimeout(()=>{l()},0)}else setTimeout(()=>{l()},0)}else s.status===404?e.log("videos.csv not found at remote URL (404)","warn"):e.log(`Unexpected response fetching videos.csv: ${s.status} ${s.statusText}`,"warn")}async function Li(e){try{await Kr(e)}catch(t){e.log("Failed to initialize video metadata:",t,"warn")}}var Ii=`
  #ytls-pane {
    background: rgba(19, 19, 19, 0.8);
    text-align: left;
    position: fixed;
    bottom: 0;
    right: 0;
    padding: 0;
    margin: 0;
    border-radius: 12px; /* Add rounded corners */
    border: 1px solid rgba(85, 85, 85, 0.8); /* Add a thin grey border */
    opacity: 0.9;
    z-index: 5000;
    font-family: Arial, sans-serif;
    width: 300px;
    height: 90vh;
    min-width: 300px;
    max-width: 800px;
    min-height: 400px;
    max-height: 90vh;
    user-select: none; /* Prevent text selection in pane */
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
    cursor: auto; /* no visible corner cursor */
    z-index: 10;
    pointer-events: none; /* legacy handle inactive, corners handle events */
    background: transparent;
    margin: 0;
    padding: 0;
  }
  #ytls-resize-handle::before {
    display: none; /* remove the triangular corner indicator */
    content: none;
  }

  /* Corner handles for diagonal resize */
  #ytls-resize-tl,
  #ytls-resize-tr,
  #ytls-resize-bl,
  #ytls-resize-br {
    position: absolute;
    width: 20px;
    height: 20px;
    z-index: 11;
    background: transparent;
    pointer-events: auto;
  }
  #ytls-resize-tl { top: 0; left: 0; cursor: nwse-resize; }
  #ytls-resize-tr { top: 0; right: 0; cursor: nesw-resize; }
  #ytls-resize-bl { bottom: 0; left: 0; cursor: nesw-resize; }
  #ytls-resize-br { bottom: 0; right: 0; cursor: nwse-resize; }
  #ytls-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 0;
    box-sizing: border-box;
    position: relative;
  }
  #ytls-content ul {
    flex: 1 1 auto;
    overflow-y: auto;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    min-height: 0;
    z-index: 1;
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
    background: linear-gradient(0deg, #23272b 0%, #212121 100%);
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
    user-select: none; /* Prevent text selection in timestamp items */
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
  }
  #ytls-pane li:first-child {
    border-top: none;
  }
  #ytls-pane li.ytls-timestamp-highlight {
    background: rgb(31, 37, 29);
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
    flex-grow: 1; /* Allow the timestamp text to take up available space */
    max-width: 100%; /* Constrain the width to the parent container */
    text-align: left; /* Align the text to the left */
    overflow: hidden; /* Prevent overflow */
    text-overflow: ellipsis; /* Add ellipsis for long text */
    white-space: nowrap; /* Prevent wrapping */
  }
  #ytls-pane .ytls-marker {
    position: absolute;
    height: 100%;
    width: 2px;
    background-color: #ff0000;
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
    background: rgb(33, 33, 33);
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
    font-size: 24px;
    border: none;
    border-radius: 5px;
    padding: 5px;
    cursor: pointer;
    position: relative;
  }
  .ytls-main-button:hover {
    background: rgb(63, 63, 63);
  }
  .ytls-holiday-emoji {
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 0.25em;
    pointer-events: none;
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
    font-size:14px;
    color:#666;
    margin-left:auto;
    padding-right:5px;
    cursor:default;
  }
  #ytls-pane .ytls-google-user-display {
    font-size:12px;
    color:#4285f4;
    margin-left:8px;
    padding:2px 6px;
    cursor:default;
    background:rgba(66, 133, 244, 0.1);
    border-radius:4px;
  }
  #ytls-pane .ytls-backup-status-display {
    font-size:12px;
    color:#9acd32; /* yellowgreen */
    margin-left:8px;
    padding:2px 6px;
    cursor:default;
    background:rgba(154, 205, 50, 0.12);
    border-radius:4px;
  }
  #ytls-current-time {
    color:white;
    font-size:14px;
    cursor:pointer;
    position:relative;
  }

  /* Backup status indicator (colored dot) */
  .ytls-backup-indicator {
    display:inline-block;
    width:8px;
    height:8px;
    border-radius:50%;
    background-color:#666;
    cursor:help;
    flex-shrink:0;
  }

  /* Shared modal container styles */
  #ytls-settings-modal {
    position:fixed;
    top:50%;
    left:50%;
    transform:translate(-50%, -50%);
    background:#1a1a1a;
    padding:8px;
    border-radius:10px;
    z-index:10000;
    color:white;
    text-align:center;
    width:200px;
    box-shadow:0 0 10px rgba(0,0,0,0.5);
  }
  #ytls-save-modal,
  #ytls-load-modal,
  #ytls-delete-all-modal {
    position:fixed;
    top:50%;
    left:50%;
    transform:translate(-50%, -50%);
    background:#333;
    padding:8px;
    border-radius:10px;
    z-index:10000;
    color:white;
    text-align:center;
    width:fit-content;
    max-width:90vw;
    box-shadow:0 0 10px rgba(0,0,0,0.5);
  }

  /* Modal header with tabs and close button */
  .ytls-modal-header {
    display:flex;
    align-items:flex-end;
    margin-bottom:0;
    gap:10px;
  }

  /* Modal close button (X in header) */
  .ytls-modal-close-button {
    position:absolute;
    top:8px;
    right:8px;
    width:16px;
    height:16px;
    background:#ff4444;
    color:white;
    border:none;
    border-radius:3px;
    font-size:14px;
    font-weight:bold;
    cursor:pointer;
    display:flex;
    align-items:center;
    justify-content:center;
    line-height:1;
    padding:0;
    flex-shrink:0;
    z-index:1;
  }
  .ytls-modal-close-button:hover {
    background:#ff6666;
  }

  /* Styles for settings modal */
  #ytls-settings-content {
    display:flex;
    flex-direction:column;
    gap:10px;
    align-items:center;
    background:#2a2a2a;
    border:2px solid #3a3a3a;
    border-radius:0 4px 4px 4px;
    padding:10px;
    margin-top:-2px;
    position:relative;
    z-index:1;
  }

  /* Section heading */
  .ytls-section-heading {
    margin:0 0 10px 0;
    padding:0;
    font-size:16px;
    font-weight:bold;
    color:#fff;
    text-align:center;
  }

  /* Settings nav (tabs) */
  #ytls-settings-nav {
    display:flex;
    gap:6px;
    flex:0;
  }
  #ytls-settings-nav .ytls-settings-modal-button {
    flex:0;
    width:auto;
    height:24px;
    margin-bottom:0;
    background: #2a2a2a;
    font-size:13px;
    padding:0 8px;
    display:flex;
    align-items:center;
    justify-content:center;
    line-height:1;
    border:2px solid transparent;
    border-radius:4px 4px 0 0;
    border-bottom:2px solid transparent;
    white-space:nowrap;
    position:relative;
  }
  #ytls-settings-nav .ytls-settings-modal-button .ytls-tab-text {
    display:none;
  }
  #ytls-settings-nav .ytls-settings-modal-button.active .ytls-tab-text {
    display:inline;
  }
  #ytls-settings-nav .ytls-settings-modal-button:hover {
    background: #3a3a3a;
  }
  #ytls-settings-nav .ytls-settings-modal-button.active {
    background:#2a2a2a;
    border:2px solid #3a3a3a;
    border-bottom:2px solid #2a2a2a;
    z-index:2;
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
  }
  .ytls-settings-modal-button:hover {
    background: #777; /* Example hover effect */
  }

  /* Shared styles for modal copy */
  #ytls-save-modal p,
  #ytls-load-modal p,
  #ytls-delete-all-modal p {
    margin-bottom:15px;
    font-size:16px;
  }
  .ytls-save-modal-button {
    background:#555;
    color:white;
    padding:10px 20px;
    border:none;
    border-radius:5px;
    cursor:pointer;
    margin-right:10px; /* Applied to both JSON and Text buttons, last one will have extra margin if not overridden */
  }
  .ytls-save-modal-button:last-of-type { /* Remove margin from the last button of this type in the modal */
    margin-right:0;
  }
  .ytls-save-modal-cancel-button {
    background:#444;
    color:white;
    padding:10px 20px;
    border:none;
    border-radius:5px;
    cursor:pointer;
    margin-top:15px;
    display:block;
    width:100%;
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
    background: #777; /* Example hover effect */
  }

  .ytls-hidden-file-input {
    display:none;
  }

  #ytls-header-button {
    align-items:center;
    background:transparent;
    border:none;
    color:var(--yt-spec-text-primary, currentColor);
    cursor:pointer;
    display:inline-flex;
    font-size:20px;
    height:40px;
    margin-left:6px;
    padding:0 6px;
    text-decoration:none;
  }
  #ytls-header-button:hover {
    color:var(--yt-spec-call-to-action, #3ea6ff);
  }
  #ytls-header-button:focus-visible {
    outline:2px solid var(--yt-spec-call-to-action, #3ea6ff);
    outline-offset:2px;
  }
  #ytls-header-button img {
    display:block;
    height:32px;
    max-width:48px;
    pointer-events:none;
    width:auto;
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

  /* Video tooltip content (thumbnail + title) */
  .ytls-video-tooltip {
    display: flex;
    align-items: center;
    gap: 8px;
    max-width: 320px;
  }
  .ytls-video-thumb {
    width: 120px;
    height: 68px;
    object-fit: cover;
    border-radius: 3px;
    flex-shrink: 0;
    display: block;
  }

`;var xe=Uint8Array,Ge=Uint16Array,Ao=Int32Array,Bo=new xe([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Po=new xe([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Mi=new xe([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),zi=function(e,t){for(var r=new Ge(31),a=0;a<31;++a)r[a]=t+=1<<e[a-1];for(var s=new Ao(r[30]),a=1;a<30;++a)for(var n=r[a];n<r[a+1];++n)s[n]=n-r[a]<<5|a;return{b:r,r:s}},Fi=zi(Bo,2),Yr=Fi.b,Io=Fi.r;Yr[28]=258,Io[258]=28;var Ri=zi(Po,0),Oa=Ri.b,Ci=Ri.r,Mo=new Ge(32768);for(U=0;U<32768;++U)pt=(U&43690)>>1|(U&21845)<<1,pt=(pt&52428)>>2|(pt&13107)<<2,pt=(pt&61680)>>4|(pt&3855)<<4,Mo[U]=((pt&65280)>>8|(pt&255)<<8)>>1;var pt,U,hn=(function(e,t,r){for(var a=e.length,s=0,n=new Ge(t);s<a;++s)e[s]&&++n[e[s]-1];var p=new Ge(t);for(s=1;s<t;++s)p[s]=p[s-1]+n[s-1]<<1;var l;if(r){l=new Ge(1<<t);var x=15-t;for(s=0;s<a;++s)if(e[s])for(var T=s<<4|e[s],E=t-e[s],A=p[e[s]-1]++<<E,C=A|(1<<E)-1;A<=C;++A)l[Mo[A]>>x]=T}else for(l=new Ge(a),s=0;s<a;++s)e[s]&&(l[s]=Mo[p[e[s]-1]++]>>15-e[s]);return l}),Bt=new xe(288);for(U=0;U<144;++U)Bt[U]=8;var U;for(U=144;U<256;++U)Bt[U]=9;var U;for(U=256;U<280;++U)Bt[U]=7;var U;for(U=280;U<288;++U)Bt[U]=8;var U,Qn=new xe(32);for(U=0;U<32;++U)Qn[U]=5;var U,Zr=hn(Bt,9,0);var Xr=hn(Qn,5,0);var Oi=function(e){return(e+7)/8|0},Hi=function(e,t,r){return(t==null||t<0)&&(t=0),(r==null||r>e.length)&&(r=e.length),new xe(e.subarray(t,r))};var Jr=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],to=function(e,t,r){var a=new Error(t||Jr[e]);if(a.code=e,Error.captureStackTrace&&Error.captureStackTrace(a,to),!r)throw a;return a};var ht=function(e,t,r){r<<=t&7;var a=t/8|0;e[a]|=r,e[a+1]|=r>>8},fn=function(e,t,r){r<<=t&7;var a=t/8|0;e[a]|=r,e[a+1]|=r>>8,e[a+2]|=r>>16},Lo=function(e,t){for(var r=[],a=0;a<e.length;++a)e[a]&&r.push({s:a,f:e[a]});var s=r.length,n=r.slice();if(!s)return{t:_i,l:0};if(s==1){var p=new xe(r[0].s+1);return p[r[0].s]=1,{t:p,l:1}}r.sort(function(ge,ke){return ge.f-ke.f}),r.push({s:-1,f:25001});var l=r[0],x=r[1],T=0,E=1,A=2;for(r[0]={s:-1,f:l.f+x.f,l,r:x};E!=s-1;)l=r[r[T].f<r[A].f?T++:A++],x=r[T!=E&&r[T].f<r[A].f?T++:A++],r[E++]={s:-1,f:l.f+x.f,l,r:x};for(var C=n[0].s,a=1;a<s;++a)n[a].s>C&&(C=n[a].s);var O=new Ge(C+1),Z=Co(r[E-1],O,0);if(Z>t){var a=0,W=0,J=Z-t,ne=1<<J;for(n.sort(function(ke,ie){return O[ie.s]-O[ke.s]||ke.f-ie.f});a<s;++a){var N=n[a].s;if(O[N]>t)W+=ne-(1<<Z-O[N]),O[N]=t;else break}for(W>>=J;W>0;){var ue=n[a].s;O[ue]<t?W-=1<<t-O[ue]++-1:++a}for(;a>=0&&W;--a){var X=n[a].s;O[X]==t&&(--O[X],++W)}Z=t}return{t:new xe(O),l:Z}},Co=function(e,t,r){return e.s==-1?Math.max(Co(e.l,t,r+1),Co(e.r,t,r+1)):t[e.s]=r},Di=function(e){for(var t=e.length;t&&!e[--t];);for(var r=new Ge(++t),a=0,s=e[0],n=1,p=function(x){r[a++]=x},l=1;l<=t;++l)if(e[l]==s&&l!=t)++n;else{if(!s&&n>2){for(;n>138;n-=138)p(32754);n>2&&(p(n>10?n-11<<5|28690:n-3<<5|12305),n=0)}else if(n>3){for(p(s),--n;n>6;n-=6)p(8304);n>2&&(p(n-3<<5|8208),n=0)}for(;n--;)p(s);n=1,s=e[l]}return{c:r.subarray(0,a),n:t}},pn=function(e,t){for(var r=0,a=0;a<t.length;++a)r+=e[a]*t[a];return r},$i=function(e,t,r){var a=r.length,s=Oi(t+2);e[s]=a&255,e[s+1]=a>>8,e[s+2]=e[s]^255,e[s+3]=e[s+1]^255;for(var n=0;n<a;++n)e[s+n+4]=r[n];return(s+4+a)*8},Ai=function(e,t,r,a,s,n,p,l,x,T,E){ht(t,E++,r),++s[256];for(var A=Lo(s,15),C=A.t,O=A.l,Z=Lo(n,15),W=Z.t,J=Z.l,ne=Di(C),N=ne.c,ue=ne.n,X=Di(W),ge=X.c,ke=X.n,ie=new Ge(19),G=0;G<N.length;++G)++ie[N[G]&31];for(var G=0;G<ge.length;++G)++ie[ge[G]&31];for(var H=Lo(ie,7),ae=H.t,de=H.l,se=19;se>4&&!ae[Mi[se-1]];--se);var ze=T+5<<3,Te=pn(s,Bt)+pn(n,Qn)+p,Me=pn(s,C)+pn(n,W)+p+14+3*se+pn(ie,ae)+2*ie[16]+3*ie[17]+7*ie[18];if(x>=0&&ze<=Te&&ze<=Me)return $i(t,E,e.subarray(x,x+T));var je,me,Ce,ot;if(ht(t,E,1+(Me<Te)),E+=2,Me<Te){je=hn(C,O,0),me=C,Ce=hn(W,J,0),ot=W;var Yt=hn(ae,de,0);ht(t,E,ue-257),ht(t,E+5,ke-1),ht(t,E+10,se-4),E+=14;for(var G=0;G<se;++G)ht(t,E+3*G,ae[Mi[G]]);E+=3*se;for(var Fe=[N,ge],Re=0;Re<2;++Re)for(var De=Fe[Re],G=0;G<De.length;++G){var V=De[G]&31;ht(t,E,Yt[V]),E+=ae[V],V>15&&(ht(t,E,De[G]>>5&127),E+=De[G]>>12)}}else je=Zr,me=Bt,Ce=Xr,ot=Qn;for(var G=0;G<l;++G){var le=a[G];if(le>255){var V=le>>18&31;fn(t,E,je[V+257]),E+=me[V+257],V>7&&(ht(t,E,le>>23&31),E+=Bo[V]);var gt=le&31;fn(t,E,Ce[gt]),E+=ot[gt],gt>3&&(fn(t,E,le>>5&8191),E+=Po[gt])}else fn(t,E,je[le]),E+=me[le]}return fn(t,E,je[256]),E+me[256]},Qr=new Ao([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),_i=new xe(0),ea=function(e,t,r,a,s,n){var p=n.z||e.length,l=new xe(a+p+5*(1+Math.ceil(p/7e3))+s),x=l.subarray(a,l.length-s),T=n.l,E=(n.r||0)&7;if(t){E&&(x[0]=n.r>>3);for(var A=Qr[t-1],C=A>>13,O=A&8191,Z=(1<<r)-1,W=n.p||new Ge(32768),J=n.h||new Ge(Z+1),ne=Math.ceil(r/3),N=2*ne,ue=function(it){return(e[it]^e[it+1]<<ne^e[it+2]<<N)&Z},X=new Ao(25e3),ge=new Ge(288),ke=new Ge(32),ie=0,G=0,H=n.i||0,ae=0,de=n.w||0,se=0;H+2<p;++H){var ze=ue(H),Te=H&32767,Me=J[ze];if(W[Te]=Me,J[ze]=Te,de<=H){var je=p-H;if((ie>7e3||ae>24576)&&(je>423||!T)){E=Ai(e,x,0,X,ge,ke,G,ae,se,H-se,E),ae=ie=G=0,se=H;for(var me=0;me<286;++me)ge[me]=0;for(var me=0;me<30;++me)ke[me]=0}var Ce=2,ot=0,Yt=O,Fe=Te-Me&32767;if(je>2&&ze==ue(H-Fe))for(var Re=Math.min(C,je)-1,De=Math.min(32767,H),V=Math.min(258,je);Fe<=De&&--Yt&&Te!=Me;){if(e[H+Ce]==e[H+Ce-Fe]){for(var le=0;le<V&&e[H+le]==e[H+le-Fe];++le);if(le>Ce){if(Ce=le,ot=Fe,le>Re)break;for(var gt=Math.min(Fe,le-2),wn=0,me=0;me<gt;++me){var Pt=H-Fe+me&32767,so=W[Pt],Zt=Pt-so&32767;Zt>wn&&(wn=Zt,Me=Pt)}}}Te=Me,Me=W[Te],Fe+=Te-Me&32767}if(ot){X[ae++]=268435456|Io[Ce]<<18|Ci[ot];var xn=Io[Ce]&31,zt=Ci[ot]&31;G+=Bo[xn]+Po[zt],++ge[257+xn],++ke[zt],de=H+Ce,++ie}else X[ae++]=e[H],++ge[e[H]]}}for(H=Math.max(H,de);H<p;++H)X[ae++]=e[H],++ge[e[H]];E=Ai(e,x,T,X,ge,ke,G,ae,se,H-se,E),T||(n.r=E&7|x[E/8|0]<<3,E-=7,n.h=J,n.p=W,n.i=H,n.w=de)}else{for(var H=n.w||0;H<p+T;H+=65535){var Tt=H+65535;Tt>=p&&(x[E/8|0]=T,Tt=p),E=$i(x,E+1,e.subarray(H,Tt))}n.i=p}return Hi(l,0,a+Oi(E)+s)},ta=(function(){for(var e=new Int32Array(256),t=0;t<256;++t){for(var r=t,a=9;--a;)r=(r&1&&-306674912)^r>>>1;e[t]=r}return e})(),na=function(){var e=-1;return{p:function(t){for(var r=e,a=0;a<t.length;++a)r=ta[r&255^t[a]]^r>>>8;e=r},d:function(){return~e}}};var oa=function(e,t,r,a,s){if(!s&&(s={l:1},t.dictionary)){var n=t.dictionary.subarray(-32768),p=new xe(n.length+e.length);p.set(n),p.set(e,n.length),e=p,s.w=n.length}return ea(e,t.level==null?6:t.level,t.mem==null?s.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+t.mem,r,a,s)},Ni=function(e,t){var r={};for(var a in e)r[a]=e[a];for(var a in t)r[a]=t[a];return r};var we=function(e,t,r){for(;r;++t)e[t]=r,r>>>=8};function ia(e,t){return oa(e,t||{},0,0)}var Gi=function(e,t,r,a){for(var s in e){var n=e[s],p=t+s,l=a;Array.isArray(n)&&(l=Ni(a,n[1]),n=n[0]),n instanceof xe?r[p]=[n,l]:(r[p+="/"]=[new xe(0),l],Gi(n,p,r,a))}},Bi=typeof TextEncoder<"u"&&new TextEncoder,ra=typeof TextDecoder<"u"&&new TextDecoder,aa=0;try{ra.decode(_i,{stream:!0}),aa=1}catch{}function eo(e,t){if(t){for(var r=new xe(e.length),a=0;a<e.length;++a)r[a]=e.charCodeAt(a);return r}if(Bi)return Bi.encode(e);for(var s=e.length,n=new xe(e.length+(e.length>>1)),p=0,l=function(E){n[p++]=E},a=0;a<s;++a){if(p+5>n.length){var x=new xe(p+8+(s-a<<1));x.set(n),n=x}var T=e.charCodeAt(a);T<128||t?l(T):T<2048?(l(192|T>>6),l(128|T&63)):T>55295&&T<57344?(T=65536+(T&1047552)|e.charCodeAt(++a)&1023,l(240|T>>18),l(128|T>>12&63),l(128|T>>6&63),l(128|T&63)):(l(224|T>>12),l(128|T>>6&63),l(128|T&63))}return Hi(n,0,p)}var Do=function(e){var t=0;if(e)for(var r in e){var a=e[r].length;a>65535&&to(9),t+=a+4}return t},Pi=function(e,t,r,a,s,n,p,l){var x=a.length,T=r.extra,E=l&&l.length,A=Do(T);we(e,t,p!=null?33639248:67324752),t+=4,p!=null&&(e[t++]=20,e[t++]=r.os),e[t]=20,t+=2,e[t++]=r.flag<<1|(n<0&&8),e[t++]=s&&8,e[t++]=r.compression&255,e[t++]=r.compression>>8;var C=new Date(r.mtime==null?Date.now():r.mtime),O=C.getFullYear()-1980;if((O<0||O>119)&&to(10),we(e,t,O<<25|C.getMonth()+1<<21|C.getDate()<<16|C.getHours()<<11|C.getMinutes()<<5|C.getSeconds()>>1),t+=4,n!=-1&&(we(e,t,r.crc),we(e,t+4,n<0?-n-2:n),we(e,t+8,r.size)),we(e,t+12,x),we(e,t+14,A),t+=16,p!=null&&(we(e,t,E),we(e,t+6,r.attrs),we(e,t+10,p),t+=14),e.set(a,t),t+=x,A)for(var Z in T){var W=T[Z],J=W.length;we(e,t,+Z),we(e,t+2,J),e.set(W,t+4),t+=4+J}return E&&(e.set(l,t),t+=E),t},sa=function(e,t,r,a,s){we(e,t,101010256),we(e,t+8,r),we(e,t+10,r),we(e,t+12,a),we(e,t+16,s)};function Ui(e,t){t||(t={});var r={},a=[];Gi(e,"",r,t);var s=0,n=0;for(var p in r){var l=r[p],x=l[0],T=l[1],E=T.level==0?0:8,A=eo(p),C=A.length,O=T.comment,Z=O&&eo(O),W=Z&&Z.length,J=Do(T.extra);C>65535&&to(11);var ne=E?ia(x,T):x,N=ne.length,ue=na();ue.p(x),a.push(Ni(T,{size:x.length,crc:ue.d(),c:ne,f:A,m:Z,u:C!=p.length||Z&&O.length!=W,o:s,compression:E})),s+=30+C+J+N,n+=76+2*(C+J)+(W||0)+N}for(var X=new xe(n+22),ge=s,ke=n-s,ie=0;ie<a.length;++ie){var A=a[ie];Pi(X,A.o,A,A.f,A.u,A.c.length);var G=30+A.f.length+Do(A.extra);X.set(A.c,A.o+G),Pi(X,s,A,A.f,A.u,A.c.length,A.o,A.m),s+=16+G+(A.m?A.m.length:0)}return sa(X,s,a.length,ke,ge),X}var $={isSignedIn:!1,accessToken:null,userName:null,email:null},nt=!0,Ve=30,Ye=null,jt=!1,Vt=0,Ke=null,zo=null,be=null,j=null,no=null;function Wi(e){zo=e}function Ki(e){be=e}function Yi(e){j=e}function Fo(e){no=e}var Vi=!1;function Zi(){if(!Vi)try{let e=document.createElement("style");e.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(e),Vi=!0}catch{}}var Xi=null,gn=null,yn=null;function Ro(e){Xi=e}function io(e){gn=e}function ro(e){yn=e}var ji="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",la="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",ca="https://www.youtube.com/",ua=30*1e3,da=1800*1e3,qi=5,oo=null,Ue=null;async function Oo(){try{let e=await yn("googleAuthState");e&&typeof e=="object"&&($={...$,...e},bn(),$.isSignedIn&&$.accessToken&&await Kt(!0))}catch(e){u("Failed to load Google auth state:",e,"error")}}async function ao(){try{await gn("googleAuthState",$)}catch(e){u("Failed to save Google auth state:",e,"error")}}function bn(){zo&&(zo.style.display="none")}function Pe(e,t){if(j){if(j.style.fontWeight="bold",e==="authenticating"){for(Zi(),j.style.color="#ffa500";j.firstChild;)j.removeChild(j.firstChild);let r=document.createElement("span");r.className="tk-auth-spinner";let a=document.createTextNode(` ${t||"Authorizing with Google\u2026"}`);j.appendChild(r),j.appendChild(a);return}if(e==="error"){j.textContent=`\u274C ${t||"Authorization failed"}`,j.style.color="#ff4d4f",Wt();return}$.isSignedIn?(j.textContent="\u2705 Signed in",j.style.color="#52c41a",j.removeAttribute("title"),$.userName?(j.onmouseenter=()=>{j.textContent=`\u2705 Signed in as ${$.userName}`},j.onmouseleave=()=>{j.textContent="\u2705 Signed in"}):(j.onmouseenter=null,j.onmouseleave=null)):(j.textContent="\u274C Not signed in",j.style.color="#ff4d4f",j.removeAttribute("title"),j.onmouseenter=null,j.onmouseleave=null),Wt()}}function ma(){j&&(Zi(),j.classList.remove("tk-auth-blink"),j.offsetWidth,j.classList.add("tk-auth-blink"),setTimeout(()=>{j.classList.remove("tk-auth-blink")},1200))}function fa(e){return new Promise((t,r)=>{if(!e){u&&u("OAuth monitor: popup is null",null,"error"),r(new Error("Failed to open popup"));return}u&&u("OAuth monitor: starting to monitor popup for token");let a=Date.now(),s=300*1e3,n="timekeeper_oauth",p=null,l=null,x=null,T=()=>{if(p){try{p.close()}catch{}p=null}l&&(clearInterval(l),l=null),x&&(clearInterval(x),x=null)};try{p=new BroadcastChannel(n),u&&u("OAuth monitor: BroadcastChannel created successfully"),p.onmessage=C=>{if(u&&u("OAuth monitor: received BroadcastChannel message",C.data),C.data?.type==="timekeeper_oauth_token"&&C.data?.token){u&&u("OAuth monitor: token received via BroadcastChannel"),T();try{e.close()}catch{}t(C.data.token)}else if(C.data?.type==="timekeeper_oauth_error"){u&&u("OAuth monitor: error received via BroadcastChannel",C.data.error,"error"),T();try{e.close()}catch{}r(new Error(C.data.error||"OAuth failed"))}}}catch(C){u&&u("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",C)}u&&u("OAuth monitor: setting up IndexedDB polling");let E=Date.now();l=setInterval(async()=>{try{let C=indexedDB.open("ytls-timestamps-db",3);C.onsuccess=()=>{let O=C.result,J=O.transaction("settings","readonly").objectStore("settings").get("oauth_message");J.onsuccess=()=>{let ne=J.result;if(ne&&ne.value){let N=ne.value;if(N.timestamp&&N.timestamp>E){if(u&&u("OAuth monitor: received IndexedDB message",N),N.type==="timekeeper_oauth_token"&&N.token){u&&u("OAuth monitor: token received via IndexedDB"),T();try{e.close()}catch{}O.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),t(N.token)}else if(N.type==="timekeeper_oauth_error"){u&&u("OAuth monitor: error received via IndexedDB",N.error,"error"),T();try{e.close()}catch{}O.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),r(new Error(N.error||"OAuth failed"))}E=N.timestamp}}O.close()}}}catch(C){u&&u("OAuth monitor: IndexedDB polling error",C,"error")}},500),x=setInterval(()=>{if(Date.now()-a>s){u&&u("OAuth monitor: popup timed out after 5 minutes",null,"error"),T();try{e.close()}catch{}r(new Error("OAuth popup timed out"));return}},1e3)})}async function Ji(){if(!ji){Pe("error","Google Client ID not configured");return}try{u&&u("OAuth signin: starting OAuth flow"),Pe("authenticating","Opening authentication window...");let e=new URL("https://accounts.google.com/o/oauth2/v2/auth");e.searchParams.set("client_id",ji),e.searchParams.set("redirect_uri",ca),e.searchParams.set("response_type","token"),e.searchParams.set("scope",la),e.searchParams.set("include_granted_scopes","true"),e.searchParams.set("state","timekeeper_auth"),u&&u("OAuth signin: opening popup");let t=window.open(e.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!t){u&&u("OAuth signin: popup blocked by browser",null,"error"),Pe("error","Popup blocked. Please enable popups for YouTube.");return}u&&u("OAuth signin: popup opened successfully"),Pe("authenticating","Waiting for authentication...");try{let r=await fa(t),a=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${r}`}});if(a.ok){let s=await a.json();$.accessToken=r,$.isSignedIn=!0,$.userName=s.name,$.email=s.email,await ao(),bn(),Pe(),Ze(),await Kt(),u?u(`Successfully authenticated as ${s.name}`):console.log(`[Timekeeper] Successfully authenticated as ${s.name}`)}else throw new Error("Failed to fetch user info")}catch(r){let a=r instanceof Error?r.message:"Authentication failed";u?u("OAuth failed:",r,"error"):console.error("[Timekeeper] OAuth failed:",r),Pe("error",a);return}}catch(e){let t=e instanceof Error?e.message:"Sign in failed";u?u("Failed to sign in to Google:",e,"error"):console.error("[Timekeeper] Failed to sign in to Google:",e),Pe("error",`Failed to sign in: ${t}`)}}async function Qi(){if(!window.opener||window.opener===window)return!1;u&&u("OAuth popup: detected popup window, checking for OAuth response");let e=window.location.hash;if(!e||e.length<=1)return u&&u("OAuth popup: no hash params found"),!1;let t=e.startsWith("#")?e.substring(1):e,r=new URLSearchParams(t),a=r.get("state");if(u&&u("OAuth popup: hash params found, state="+a),a!=="timekeeper_auth")return u&&u("OAuth popup: not our OAuth flow (wrong state)"),!1;let s=r.get("error"),n=r.get("access_token"),p="timekeeper_oauth";if(s){try{let l=new BroadcastChannel(p);l.postMessage({type:"timekeeper_oauth_error",error:r.get("error_description")||s}),l.close()}catch{let x={type:"timekeeper_oauth_error",error:r.get("error_description")||s,timestamp:Date.now()},T=indexedDB.open("ytls-timestamps-db",3);T.onsuccess=()=>{let E=T.result;E.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:x}),E.close()}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(n){u&&u("OAuth popup: access token found, broadcasting to opener");try{let l=new BroadcastChannel(p);l.postMessage({type:"timekeeper_oauth_token",token:n}),l.close(),u&&u("OAuth popup: token broadcast via BroadcastChannel")}catch(l){u&&u("OAuth popup: BroadcastChannel failed, using IndexedDB",l);let x={type:"timekeeper_oauth_token",token:n,timestamp:Date.now()},T=indexedDB.open("ytls-timestamps-db",3);T.onsuccess=()=>{let E=T.result;E.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:x}),E.close()},u&&u("OAuth popup: token broadcast via IndexedDB")}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function er(){$={isSignedIn:!1,accessToken:null,userName:null,email:null},await ao(),bn(),Pe(),Ze()}async function tr(){if(!$.isSignedIn||!$.accessToken)return!1;try{let e=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${$.accessToken}`}});return e.status===401?(await nr({silent:!0}),!1):e.ok}catch(e){return u("Failed to verify auth state:",e,"error"),!1}}async function pa(e){let t={Authorization:`Bearer ${e}`},a=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,s=await fetch(a,{headers:t});if(s.status===401)throw new Error("unauthorized");if(!s.ok)throw new Error("drive search failed");let n=await s.json();if(Array.isArray(n.files)&&n.files.length>0)return n.files[0].id;let p=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...t,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(p.status===401)throw new Error("unauthorized");if(!p.ok)throw new Error("drive folder create failed");return(await p.json()).id}async function ha(e,t,r){let a=`name='${e}' and '${t}' in parents and trashed=false`,s=encodeURIComponent(a),n=await fetch(`https://www.googleapis.com/drive/v3/files?q=${s}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${r}`}});if(n.status===401)throw new Error("unauthorized");if(!n.ok)return null;let p=await n.json();return p.files&&p.files.length>0?p.files[0].id:null}function ga(e,t){let r=eo(e),a=t.replace(/\\/g,"/").replace(/^\/+/,"");return a.endsWith(".json")||(a+=".json"),Ui({[a]:[r,{level:6,mtime:new Date,os:0}]})}async function ya(e,t,r,a){let s=e.replace(/\.json$/,".zip"),n=await ha(s,r,a),p=new TextEncoder().encode(t).length,l=ga(t,e),x=l.length;u(`Compressing data: ${p} bytes -> ${x} bytes (${Math.round(100-x/p*100)}% reduction)`);let T="-------314159265358979",E=`\r
--${T}\r
`,A=`\r
--${T}--`,C=n?{name:s,mimeType:"application/zip"}:{name:s,mimeType:"application/zip",parents:[r]},O=8192,Z="";for(let X=0;X<l.length;X+=O){let ge=l.subarray(X,Math.min(X+O,l.length));Z+=String.fromCharCode.apply(null,Array.from(ge))}let W=btoa(Z),J=E+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify(C)+E+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+W+A,ne,N;n?(ne=`https://www.googleapis.com/upload/drive/v3/files/${n}?uploadType=multipart&fields=id,name`,N="PATCH"):(ne="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",N="POST");let ue=await fetch(ne,{method:N,headers:{Authorization:`Bearer ${a}`,"Content-Type":`multipart/related; boundary=${T}`},body:J});if(ue.status===401)throw new Error("unauthorized");if(!ue.ok)throw new Error("drive upload failed")}async function nr(e){u("Auth expired, clearing token",null,"warn"),$.isSignedIn=!1,$.accessToken=null,await ao(),Pe("error","Authorization expired. Please sign in again."),Ze()}async function va(e){if(!$.isSignedIn||!$.accessToken){e?.silent||Pe("error","Please sign in to Google Drive first");return}try{let{json:t,filename:r,totalVideos:a,totalTimestamps:s}=await Xi();if(s===0){e?.silent||u("Skipping export: no timestamps to back up");return}let n=await pa($.accessToken);await ya(r,t,n,$.accessToken),u(`Exported to Google Drive (${r}) with ${a} videos / ${s} timestamps.`)}catch(t){throw t.message==="unauthorized"?(await nr({silent:e?.silent}),t):(u("Drive export failed:",t,"error"),e?.silent||Pe("error","Failed to export to Google Drive."),t)}}async function or(){try{let e=await yn("autoBackupEnabled"),t=await yn("autoBackupIntervalMinutes"),r=await yn("lastAutoBackupAt");typeof e=="boolean"&&(nt=e),typeof t=="number"&&t>0&&(Ve=t),typeof r=="number"&&r>0&&(Ye=r)}catch(e){u("Failed to load auto backup settings:",e,"error")}}async function Ho(){try{await gn("autoBackupEnabled",nt),await gn("autoBackupIntervalMinutes",Ve),await gn("lastAutoBackupAt",Ye??0)}catch(e){u("Failed to save auto backup settings:",e,"error")}}function ba(){oo&&(clearInterval(oo),oo=null),Ue&&(clearTimeout(Ue),Ue=null)}function qt(e){try{let t=new Date(e),r=new Date,a=t.toDateString()===r.toDateString(),s=t.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return a?s:`${t.toLocaleDateString()} ${s}`}catch{return""}}function Ze(){if(!be)return;let e="",t="";if(!nt)e="\u{1F501} Backup: Off",be.onmouseenter=null,be.onmouseleave=null;else if(jt)e="\u{1F501} Backing up\u2026",be.onmouseenter=null,be.onmouseleave=null;else if(Ke&&Ke>0)e=`\u26A0\uFE0F Retry in ${Math.ceil(Ke/6e4)}m`,be.onmouseenter=null,be.onmouseleave=null;else if(Ye){e=`\u{1F5C4}\uFE0F Last backup: ${qt(Ye)}`;let r=Ye+Math.max(1,Ve)*60*1e3;t=`\u{1F5C4}\uFE0F Next backup: ${qt(r)}`,be.onmouseenter=()=>{be.textContent=t},be.onmouseleave=()=>{be.textContent=e}}else{e="\u{1F5C4}\uFE0F Last backup: never";let r=Date.now()+Math.max(1,Ve)*60*1e3;t=`\u{1F5C4}\uFE0F Next backup: ${qt(r)}`,be.onmouseenter=()=>{be.textContent=t},be.onmouseleave=()=>{be.textContent=e}}be.textContent=e,be.style.display=e?"inline":"none",Wt()}function Wt(){if(!no)return;let e="";nt?jt?e="#4285f4":Ke&&Ke>0?e="#ffa500":$.isSignedIn&&Ye?e="#52c41a":$.isSignedIn?e="#ffa500":e="#ff4d4f":e="#ff4d4f",no.style.backgroundColor=e,_e(no,()=>{let t="";if(!nt)t="Auto backup is disabled";else if(jt)t="Backup in progress";else if(Ke&&Ke>0)t=`Retrying backup in ${Math.ceil(Ke/6e4)}m`;else if($.isSignedIn&&Ye){let r=Ye+Math.max(1,Ve)*60*1e3,a=qt(r);t=`Last backup: ${qt(Ye)}
Next backup: ${a}`}else if($.isSignedIn){let r=Date.now()+Math.max(1,Ve)*60*1e3;t=`No backup yet
Next backup: ${qt(r)}`}else t="Not signed in to Google Drive";return t})}async function vn(e=!0){if(!$.isSignedIn||!$.accessToken){e||ma();return}if(Ue){u("Auto backup: backoff in progress, skipping scheduled run");return}if(!jt){jt=!0,Ze();try{await va({silent:e}),Ye=Date.now(),Vt=0,Ke=null,Ue&&(clearTimeout(Ue),Ue=null),await Ho()}catch(t){if(u("Auto backup failed:",t,"error"),t.message==="unauthorized")u("Auth error detected, clearing token and stopping retries",null,"warn"),$.isSignedIn=!1,$.accessToken=null,await ao(),Pe("error","Authorization expired. Please sign in again."),Ze(),Vt=0,Ke=null,Ue&&(clearTimeout(Ue),Ue=null);else if(Vt<qi){Vt+=1;let s=Math.min(ua*Math.pow(2,Vt-1),da);Ke=s,Ue&&clearTimeout(Ue),Ue=setTimeout(()=>{vn(!0)},s),u(`Scheduling backup retry ${Vt}/${qi} in ${Math.round(s/1e3)}s`),Ze()}else Ke=null}finally{jt=!1,Ze()}}}async function Kt(e=!1){if(ba(),!!nt&&!(!$.isSignedIn||!$.accessToken)){if(oo=setInterval(()=>{vn(!0)},Math.max(1,Ve)*60*1e3),!e){let t=Date.now(),r=Math.max(1,Ve)*60*1e3;(!Ye||t-Ye>=r)&&vn(!0)}Ze()}}async function ir(){nt=!nt,await Ho(),await Kt(),Ze()}async function rr(){let e=prompt("Set Auto Backup interval (minutes):",String(Ve));if(e===null)return;let t=Math.floor(Number(e));if(!Number.isFinite(t)||t<5||t>1440){alert("Please enter a number between 5 and 1440 minutes.");return}Ve=t,await Ho(),await Kt(),Ze()}var $o=window.location.hash;if($o&&$o.length>1){let e=new URLSearchParams($o.substring(1));if(e.get("state")==="timekeeper_auth"){let r=e.get("access_token");if(r){console.log("[Timekeeper] Auth token detected in URL, broadcasting token"),console.log("[Timekeeper] Token length:",r.length,"characters");try{let a=new BroadcastChannel("timekeeper_oauth"),s={type:"timekeeper_oauth_token",token:r};console.log("[Timekeeper] Sending auth message via BroadcastChannel:",{type:s.type,tokenLength:r.length}),a.postMessage(s),a.close(),console.log("[Timekeeper] Token broadcast via BroadcastChannel completed")}catch(a){console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",a);let s={type:"timekeeper_oauth_token",token:r,timestamp:Date.now()},n=indexedDB.open("ytls-timestamps-db",3);n.onsuccess=()=>{let p=n.result,l=p.transaction("settings","readwrite");l.objectStore("settings").put({key:"oauth_message",value:s}),l.oncomplete=()=>{console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",s.timestamp),p.close()}}}if(history.replaceState){let a=window.location.pathname+window.location.search;history.replaceState(null,"",a)}throw console.log("[Timekeeper] Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}(async function(){"use strict";if(window.top!==window.self)return;function e(o){return GM.getValue(`timekeeper_${o}`,void 0)}function t(o,i){return GM.setValue(`timekeeper_${o}`,JSON.stringify(i))}if(ro(e),io(t),await Qi()){u("OAuth popup detected, broadcasting token and closing");return}await Oo();let a=["/watch","/live"];function s(o=window.location.href){try{let i=new URL(o);return i.origin!=="https://www.youtube.com"?!1:a.some(c=>i.pathname===c||i.pathname.startsWith(`${c}/`))}catch(i){return u("Timekeeper failed to parse URL for support check:",i,"error"),!1}}let n=null,p=null,l=null,x=null,T=null,E=null,A=null,C=null,O=250,Z=null,W=!1;function J(){return n?n.getBoundingClientRect():null}function ne(o,i,c){o&&(Ae={x:Math.round(typeof i=="number"?i:o.left),y:Math.round(typeof c=="number"?c:o.top),width:Math.round(o.width),height:Math.round(o.height)})}function N(o=!0){if(!n)return;Ot();let i=J();i&&(i.width||i.height)&&(ne(i),o&&(dn("windowPosition",Ae),Xt({type:"window_position_updated",position:Ae,timestamp:Date.now()})))}function ue(){if(!n||!p||!x||!l)return;let o=40,i=ee();if(i.length>0)o=i[0].offsetHeight;else{let c=document.createElement("li");c.style.visibility="hidden",c.style.position="absolute",c.textContent="00:00 Example",l.appendChild(c),o=c.offsetHeight,l.removeChild(c)}O=p.offsetHeight+x.offsetHeight+o,n.style.minHeight=O+"px"}function X(){requestAnimationFrame(()=>{typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),ue(),N(!0)})}function ge(o=450){fe&&(clearTimeout(fe),fe=null),fe=setTimeout(()=>{H(),X(),fe=null},o)}function ke(){fe&&(clearTimeout(fe),fe=null)}function ie(){l&&(l.style.visibility="hidden",u("Hiding timestamps during show animation")),X(),ge()}function G(){H(),ke(),Xe&&(clearTimeout(Xe),Xe=null),Xe=setTimeout(()=>{n&&(n.style.display="none",ti(),Xe=null)},400)}function H(){if(!l){Oe&&(Oe(),Oe=null,lt=null,vt=null);return}if(!vt){l.style.visibility==="hidden"&&(l.style.visibility="",u("Restoring timestamp visibility (no deferred fragment)")),Oe&&(Oe(),Oe=null,lt=null);return}u("Appending deferred timestamps after animation"),l.appendChild(vt),vt=null,l.style.visibility==="hidden"&&(l.style.visibility="",u("Restoring timestamp visibility after append")),Oe&&(Oe(),Oe=null,lt=null),et(),Se(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea());let o=V(),i=o?Math.floor(o.getCurrentTime()):St();Number.isFinite(i)&&Rn(i,!1)}let ae=null,de=!1,se="ytls-timestamp-pending-delete",ze="ytls-timestamp-highlight",Te="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_64px_Indexed.png",Me="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_Eyebrow_64px_Indexed.png";function je(){let o=i=>{let c=new Image;c.src=i};o(Te),o(Me)}je();async function me(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(o=>setTimeout(o,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(o=>setTimeout(o,100));await new Promise(o=>setTimeout(o,200))}let Ce=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],ot=5e3,Yt=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function Fe(o){return Yt.has(o)}function Re(){return document.querySelector("video")}let De=null;function V(){if(De&&document.contains(De))return De;let o=document.getElementById("movie_player");return o&&document.contains(o)?o:null}function le(o){return Ce.every(i=>typeof o?.[i]=="function"?!0:Fe(i)?!!Re():!1)}function gt(o){return Ce.filter(i=>typeof o?.[i]=="function"?!1:Fe(i)?!Re():!0)}async function wn(o=ot){let i=Date.now();for(;Date.now()-i<o;){let d=V();if(le(d))return d;await new Promise(v=>setTimeout(v,100))}let c=V();return le(c),c}let Pt="timestampOffsetSeconds",so=-5,Zt="shiftClickTimeSkipSeconds",xn=10,zt=300,Tt=300,it=new BroadcastChannel("ytls_timestamp_channel");function Xt(o){try{it.postMessage(o)}catch(i){u("BroadcastChannel error, reopening:",i,"warn");try{it=new BroadcastChannel("ytls_timestamp_channel"),it.onmessage=_o,it.postMessage(o)}catch(c){u("Failed to reopen BroadcastChannel:",c,"error")}}}function _o(o){if(u("Received message from another tab:",o.data),!(!s()||!l||!n)&&o.data){if(o.data.type==="timestamps_updated"&&o.data.videoId===te)u("Debouncing timestamp load due to external update for video:",o.data.videoId),clearTimeout(Qt),Qt=setTimeout(()=>{u("Reloading timestamps due to external update for video:",o.data.videoId),Zo()},500);else if(o.data.type==="window_position_updated"&&n){let i=o.data.position;if(i&&typeof i.x=="number"&&typeof i.y=="number"){n.style.left=`${i.x}px`,n.style.top=`${i.y}px`,n.style.right="auto",n.style.bottom="auto",typeof i.width=="number"&&i.width>0&&(n.style.width=`${i.width}px`),typeof i.height=="number"&&i.height>0&&(n.style.height=`${i.height}px`);let c=n.getBoundingClientRect();Ae={x:Math.round(i.x),y:Math.round(i.y),width:Math.round(c.width),height:Math.round(c.height)};let d=document.documentElement.clientWidth,v=document.documentElement.clientHeight;(c.left<0||c.top<0||c.right>d||c.bottom>v)&&Ot()}}}}it.onmessage=_o;let Ft=await GM.getValue(Pt);(typeof Ft!="number"||Number.isNaN(Ft))&&(Ft=so,await GM.setValue(Pt,Ft));let Jt=await GM.getValue(Zt);(typeof Jt!="number"||Number.isNaN(Jt))&&(Jt=xn,await GM.setValue(Zt,Jt));let Qt=null,Et=new Map,Tn=!1,F=null,En=null,te=null,yt=null;function No(o){if(o)try{return o.replace(/maxresdefault/g,"hqdefault")}catch{return o}}async function lo(){try{let o=Ht();if(!o){yt=null,u("updateCurrentVideoMetadata: no video id found");return}u("updateCurrentVideoMetadata: looking up metadata for",o);let i=await Si(o);if(yt=i,i){if(u("updateCurrentVideoMetadata: metadata found for",o,i.title??""),i.thumbnail_url){let c=new Image;c.src=No(i.thumbnail_url)??""}}else u("updateCurrentVideoMetadata: no metadata found for",o);try{let c=document.getElementById("ytls-current-time");c&&Kn(c)}catch{}}catch(o){yt=null,u("updateCurrentVideoMetadata: error fetching metadata",o,"warn")}}window.addEventListener("video_metadata_updated",o=>{let i=o.detail?.count??null;u("video_metadata_updated event received",i!==null?`count=${i}`:""),So(),lo()});let Xe=null,fe=null,vt=null,lt=null,Oe=null,bt=null,kn=!1,Ae=null,co=!1,Sn=null,Ln=null,In=null,Mn=null,Cn=null,Dn=null,An=null,en=null,tn=null,nn=null,Je=null,Qe=null,Go=0,on=!1,kt=null,rn=null;function ee(){return l?Array.from(l.querySelectorAll("li")).filter(o=>!!o.querySelector("a[data-time]")):[]}function uo(){return ee().map(o=>{let i=o.querySelector("a[data-time]"),c=i?.dataset.time;if(!i||!c)return null;let d=Number.parseInt(c,10);if(!Number.isFinite(d))return null;let b=o.querySelector("input")?.value??"",m=o.dataset.guid??crypto.randomUUID();return o.dataset.guid||(o.dataset.guid=m),{start:d,comment:b,guid:m}}).filter(Vo)}function St(){if(rn!==null)return rn;let o=ee();return rn=o.length>0?Math.max(...o.map(i=>{let c=i.querySelector("a[data-time]")?.getAttribute("data-time");return c?Number.parseInt(c,10):0})):0,rn}function Bn(){rn=null}function ar(o){let i=o.querySelector(".time-diff");return i?(i.textContent?.trim()||"").startsWith("-"):!1}function sr(o,i){return o?i?"\u2514\u2500 ":"\u251C\u2500 ":""}function an(o){return o.startsWith("\u251C\u2500 ")||o.startsWith("\u2514\u2500 ")?1:0}function Uo(o){return o.replace(/^[├└]─\s/,"")}function lr(o){let i=ee();if(o>=i.length-1)return"\u2514\u2500 ";let c=i[o+1].querySelector("input");return c&&an(c.value)===1?"\u251C\u2500 ":"\u2514\u2500 "}function et(){if(!l)return;let o=ee(),i=!0,c=0,d=o.length;for(;i&&c<d;)i=!1,c++,o.forEach((v,b)=>{let m=v.querySelector("input");if(!m||!(an(m.value)===1))return;let M=!1;if(b<o.length-1){let _=o[b+1].querySelector("input");_&&(M=!(an(_.value)===1))}else M=!0;let k=Uo(m.value),D=`${sr(!0,M)}${k}`;m.value!==D&&(m.value=D,i=!0)})}function Lt(){if(l){for(;l.firstChild;)l.removeChild(l.firstChild);vt&&(vt=null),Oe&&(Oe(),Oe=null,lt=null)}}function sn(){if(!l||de||vt)return;Array.from(l.children).some(i=>!i.classList.contains("ytls-placeholder")&&!i.classList.contains("ytls-error-message"))||mo("No timestamps for this video")}function mo(o){if(!l)return;Lt();let i=document.createElement("li");i.className="ytls-placeholder",i.textContent=o,l.appendChild(i),l.style.overflowY="hidden"}function fo(){if(!l)return;let o=l.querySelector(".ytls-placeholder");o&&o.remove(),l.style.overflowY=""}function po(o){if(!(!n||!l)){if(de=o,o)n.style.display="",n.classList.remove("ytls-fade-out"),n.classList.add("ytls-fade-in"),mo("Loading timestamps...");else if(fo(),n.style.display="",n.classList.remove("ytls-fade-out"),n.classList.add("ytls-fade-in"),T){let i=V();if(i){let c=i.getCurrentTime(),d=Number.isFinite(c)?Math.max(0,Math.floor(c)):Math.max(0,St()),v=Math.floor(d/3600),b=Math.floor(d/60)%60,m=d%60,{isLive:g}=i.getVideoData()||{isLive:!1},M=l?ee().map(L=>{let D=L.querySelector("a[data-time]");return D?parseFloat(D.getAttribute("data-time")??"0"):0}):[],k="";if(M.length>0)if(g){let L=Math.max(1,d/60),D=M.filter(_=>_<=d);if(D.length>0){let _=(D.length/L).toFixed(2);parseFloat(_)>0&&(k=` (${_}/min)`)}}else{let L=i.getDuration(),D=Number.isFinite(L)&&L>0?L:0,_=Math.max(1,D/60),pe=(M.length/_).toFixed(1);parseFloat(pe)>0&&(k=` (${pe}/min)`)}T.textContent=`\u23F3${v?v+":"+String(b).padStart(2,"0"):b}:${String(m).padStart(2,"0")}${k}`}}!de&&l&&!l.querySelector(".ytls-error-message")&&sn(),ct()}}function Vo(o){return!!o&&Number.isFinite(o.start)&&typeof o.comment=="string"&&typeof o.guid=="string"}function Pn(o,i){o.textContent=xt(i),o.dataset.time=String(i),o.href=bo(i,window.location.href)}let zn=null,Fn=null,It=!1;function cr(o){if(!o||typeof o.getVideoData!="function"||!o.getVideoData()?.isLive)return!1;if(typeof o.getProgressState=="function"){let c=o.getProgressState(),d=Number(c?.seekableEnd??c?.liveHead??c?.head??c?.duration),v=Number(c?.current??o.getCurrentTime?.());if(Number.isFinite(d)&&Number.isFinite(v))return d-v>2}return!1}function Rn(o,i){if(!Number.isFinite(o))return;let c=On(o);ln(c,i)}function On(o){if(!Number.isFinite(o))return null;let i=ee();if(i.length===0)return null;let c=null,d=-1/0;for(let v of i){let m=v.querySelector("a[data-time]")?.dataset.time;if(!m)continue;let g=Number.parseInt(m,10);Number.isFinite(g)&&g<=o&&g>d&&(d=g,c=v)}return c}function ln(o,i=!1){if(!o)return;ee().forEach(d=>{d.classList.contains(se)||d.classList.remove(ze)}),o.classList.contains(se)||(o.classList.add(ze),i&&!Tn&&o.scrollIntoView({behavior:"smooth",block:"center"}))}function ur(o){if(!l||l.querySelector(".ytls-error-message")||!Number.isFinite(o)||o===0)return!1;let i=ee();if(i.length===0)return!1;let c=!1;return i.forEach(d=>{let v=d.querySelector("a[data-time]"),b=v?.dataset.time;if(!v||!b)return;let m=Number.parseInt(b,10);if(!Number.isFinite(m))return;let g=Math.max(0,m+o);g!==m&&(Pn(v,g),c=!0)}),c?(un(),et(),Se(),$n(te),kt=null,!0):!1}function jo(o,i={}){if(!Number.isFinite(o)||o===0)return!1;if(!ur(o)){if(i.alertOnNoChange){let m=i.failureMessage??"Offset did not change any timestamps.";alert(m)}return!1}let d=i.logLabel??"bulk offset";u(`Timestamps changed: Offset all timestamps by ${o>0?"+":""}${o} seconds (${d})`);let v=V(),b=v?Math.floor(v.getCurrentTime()):0;if(Number.isFinite(b)){let m=On(b);ln(m,!1)}return!0}function qo(o){if(!l||de)return;let i=o.target instanceof HTMLElement?o.target:null;if(i)if(i.dataset.time){o.preventDefault();let c=Number(i.dataset.time);if(Number.isFinite(c)){It=!0;let v=V();v&&v.seekTo(c),setTimeout(()=>{It=!1},500)}let d=i.closest("li");d&&(ee().forEach(v=>{v.classList.contains(se)||v.classList.remove(ze)}),d.classList.contains(se)||(d.classList.add(ze),d.scrollIntoView({behavior:"smooth",block:"center"})))}else if(i.dataset.increment){o.preventDefault();let d=i.parentElement?.querySelector("a[data-time]");if(!d||!d.dataset.time)return;let v=parseInt(d.dataset.time,10),b=parseInt(i.dataset.increment,10);if("shiftKey"in o&&o.shiftKey&&(b*=Jt),"altKey"in o?o.altKey:!1){jo(b,{logLabel:"Alt adjust"});return}let M=Math.max(0,v+b);u(`Timestamps changed: Timestamp time incremented from ${v} to ${M}`),Pn(d,M),Bn();let k=i.closest("li");if(Fn=M,zn&&clearTimeout(zn),It=!0,zn=setTimeout(()=>{if(Fn!==null){let L=V();L&&L.seekTo(Fn)}zn=null,Fn=null,setTimeout(()=>{It=!1},500)},500),un(),et(),Se(),k){let L=k.querySelector("input"),D=k.dataset.guid;L&&D&&(Rt(te,D,M,L.value),kt=D)}}else i.dataset.action==="clear"&&(o.preventDefault(),u("Timestamps changed: All timestamps cleared from UI"),l.textContent="",Bn(),Se(),Hn(),$n(te,{allowEmpty:!0}),kt=null,sn())}function cn(o,i="",c=!1,d=null,v=!0){if(!l)return null;let b=Math.max(0,o),m=d??crypto.randomUUID(),g=document.createElement("li"),M=document.createElement("div"),k=document.createElement("span"),L=document.createElement("span"),D=document.createElement("span"),_=document.createElement("a"),pe=document.createElement("span"),R=document.createElement("input"),ce=document.createElement("button");g.dataset.guid=m,M.className="time-row";let We=document.createElement("div");We.style.cssText="position:absolute;left:0;top:0;width:20px;height:100%;display:flex;align-items:center;justify-content:center;cursor:pointer;",_e(We,"Click to toggle indent");let Be=document.createElement("span");Be.style.cssText="color:#999;font-size:12px;pointer-events:none;display:none;";let rt=()=>{let Q=an(R.value);Be.textContent=Q===1?"\u25C0":"\u25B6"},$t=Q=>{Q.stopPropagation();let K=an(R.value),he=Uo(R.value),re=K===0?1:0,oe="";if(re===1){let tt=ee().indexOf(g);oe=lr(tt)}R.value=`${oe}${he}`,rt(),et();let ye=Number.parseInt(_.dataset.time??"0",10);Rt(te,m,ye,R.value)};We.onclick=$t,We.append(Be),g.style.cssText="position:relative;padding-left:20px;",g.addEventListener("mouseenter",()=>{rt(),Be.style.display="inline"}),g.addEventListener("mouseleave",()=>{Be.style.display="none"}),g.addEventListener("mouseleave",()=>{g.dataset.guid===kt&&ar(g)&&Wo()}),R.value=i||"",R.style.cssText="width:100%;margin-top:5px;display:block;",R.type="text",R.setAttribute("inputmode","text"),R.autocapitalize="off",R.autocomplete="off",R.spellcheck=!1,R.addEventListener("focusin",()=>{on=!1}),R.addEventListener("focusout",Q=>{let K=Q.relatedTarget,he=Date.now()-Go<250,re=!!K&&!!n&&n.contains(K);!he&&!re&&(on=!0,setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(R.focus({preventScroll:!0}),on=!1)},0))}),R.addEventListener("input",Q=>{let K=Q;if(K&&(K.isComposing||K.inputType==="insertCompositionText"))return;let he=Et.get(m);he&&clearTimeout(he);let re=setTimeout(()=>{let oe=Number.parseInt(_.dataset.time??"0",10);Rt(te,m,oe,R.value),Et.delete(m)},500);Et.set(m,re)}),R.addEventListener("compositionend",()=>{let Q=Number.parseInt(_.dataset.time??"0",10);setTimeout(()=>{Rt(te,m,Q,R.value)},50)}),k.textContent="\u2796",k.dataset.increment="-1",k.style.cursor="pointer",k.style.margin="0px",k.addEventListener("mouseenter",()=>{k.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),k.addEventListener("mouseleave",()=>{k.style.textShadow="none"}),D.textContent="\u2795",D.dataset.increment="1",D.style.cursor="pointer",D.style.margin="0px",D.addEventListener("mouseenter",()=>{D.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),D.addEventListener("mouseleave",()=>{D.style.textShadow="none"}),L.textContent="\u23FA\uFE0F",L.style.cursor="pointer",L.style.margin="0px",_e(L,"Set to current playback time"),L.addEventListener("mouseenter",()=>{L.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),L.addEventListener("mouseleave",()=>{L.style.textShadow="none"}),L.onclick=()=>{let Q=V(),K=Q?Math.floor(Q.getCurrentTime()):0;Number.isFinite(K)&&(u(`Timestamps changedset to current playback time ${K}`),Pn(_,K),un(),et(),Rt(te,m,K,R.value),kt=m)},Pn(_,b),Bn(),ce.textContent="\u{1F5D1}\uFE0F",ce.style.cssText="background:transparent;border:none;color:white;cursor:pointer;margin-left:5px;",ce.addEventListener("mouseenter",()=>{ce.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(255, 100, 100, 0.6)"}),ce.addEventListener("mouseleave",()=>{ce.style.textShadow="none"}),ce.onclick=()=>{let Q=null,K=null,he=null,re=()=>{try{g.removeEventListener("click",K,!0)}catch{}try{document.removeEventListener("click",K,!0)}catch{}if(l)try{l.removeEventListener("mouseleave",he)}catch{}Q&&(clearTimeout(Q),Q=null)};if(g.dataset.deleteConfirmed==="true"){u("Timestamps changed: Timestamp deleted");let oe=g.dataset.guid??"",ye=Et.get(oe);ye&&(clearTimeout(ye),Et.delete(oe)),re(),g.remove(),Bn(),un(),et(),Se(),Hn(),dr(te,oe),kt=null,sn()}else{g.dataset.deleteConfirmed="true",g.classList.add(se),g.classList.remove(ze);let oe=()=>{g.dataset.deleteConfirmed="false",g.classList.remove(se);let ye=V(),He=ye?ye.getCurrentTime():0,tt=Number.parseInt(g.querySelector("a[data-time]")?.dataset.time??"0",10);Number.isFinite(He)&&Number.isFinite(tt)&&He>=tt&&g.classList.add(ze),re()};K=ye=>{ye.target!==ce&&oe()},he=()=>{g.dataset.deleteConfirmed==="true"&&oe()},g.addEventListener("click",K,!0),document.addEventListener("click",K,!0),l&&l.addEventListener("mouseleave",he),Q=setTimeout(()=>{g.dataset.deleteConfirmed==="true"&&oe(),re()},5e3)}},pe.className="time-diff",pe.style.color="#888",pe.style.marginLeft="5px",M.append(k,L,D,_,pe,ce),g.append(We,M,R);let ut=Number.parseInt(_.dataset.time??"0",10);if(v){fo();let Q=!1,K=ee();for(let he=0;he<K.length;he++){let re=K[he],ye=re.querySelector("a[data-time]")?.dataset.time;if(!ye)continue;let He=Number.parseInt(ye,10);if(Number.isFinite(He)&&ut<He){l.insertBefore(g,re),Q=!0;let tt=K[he-1];if(tt){let Nt=tt.querySelector("a[data-time]")?.dataset.time;if(Nt){let dt=Number.parseInt(Nt,10);Number.isFinite(dt)&&(pe.textContent=xt(ut-dt))}}else pe.textContent="";let _t=re.querySelector(".time-diff");_t&&(_t.textContent=xt(He-ut));break}}if(!Q&&(l.appendChild(g),K.length>0)){let oe=K[K.length-1].querySelector("a[data-time]")?.dataset.time;if(oe){let ye=Number.parseInt(oe,10);Number.isFinite(ye)&&(pe.textContent=xt(ut-ye))}}g.scrollIntoView({behavior:"smooth",block:"center"}),Hn(),et(),Se(),c||(Rt(te,m,b,i),kt=m,ln(g,!1))}else R.__ytls_li=g;return R}function un(){if(!l||l.querySelector(".ytls-error-message"))return;let o=ee();o.forEach((i,c)=>{let d=i.querySelector(".time-diff");if(!d)return;let b=i.querySelector("a[data-time]")?.dataset.time;if(!b){d.textContent="";return}let m=Number.parseInt(b,10);if(!Number.isFinite(m)){d.textContent="";return}if(c===0){d.textContent="";return}let k=o[c-1].querySelector("a[data-time]")?.dataset.time;if(!k){d.textContent="";return}let L=Number.parseInt(k,10);if(!Number.isFinite(L)){d.textContent="";return}let D=m-L,_=D<0?"-":"";d.textContent=` ${_}${xt(Math.abs(D))}`})}function Wo(){if(!l||l.querySelector(".ytls-error-message")||de)return;let o=null;if(document.activeElement instanceof HTMLInputElement&&l.contains(document.activeElement)){let m=document.activeElement,M=m.closest("li")?.dataset.guid;if(M){let k=m.selectionStart??m.value.length,L=m.selectionEnd??k,D=m.scrollLeft;o={guid:M,start:k,end:L,scroll:D}}}let i=ee();if(i.length===0)return;let c=i.map(m=>m.dataset.guid),d=i.map(m=>{let g=m.querySelector("a[data-time]"),M=g?.dataset.time;if(!g||!M)return null;let k=Number.parseInt(M,10);if(!Number.isFinite(k))return null;let L=m.dataset.guid??"";return{time:k,guid:L,element:m}}).filter(m=>m!==null).sort((m,g)=>{let M=m.time-g.time;return M!==0?M:m.guid.localeCompare(g.guid)}),v=d.map(m=>m.guid),b=c.length!==v.length||c.some((m,g)=>m!==v[g]);for(;l.firstChild;)l.removeChild(l.firstChild);if(d.forEach(m=>{l.appendChild(m.element)}),un(),et(),Se(),o){let g=ee().find(M=>M.dataset.guid===o.guid)?.querySelector("input");if(g)try{g.focus({preventScroll:!0})}catch{}}b&&(u("Timestamps changed: Timestamps sorted"),$n(te))}function Hn(){if(!l||!n||!p||!x)return;let o=ee().length;typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea();let i=n.getBoundingClientRect(),c=p.getBoundingClientRect(),d=x.getBoundingClientRect(),v=Math.max(0,i.height-(c.height+d.height));o===0?(sn(),l.style.overflowY="hidden"):l.style.overflowY=l.scrollHeight>v?"auto":"hidden"}function Se(){if(!l)return;let o=Re(),i=document.querySelector(".ytp-progress-bar"),c=V(),d=c?c.getVideoData():null,v=!!d&&!!d.isLive;if(!o||!i||!isFinite(o.duration)||v)return;Yo(),ee().map(m=>{let g=m.querySelector("a[data-time]"),M=g?.dataset.time;if(!g||!M)return null;let k=Number.parseInt(M,10);if(!Number.isFinite(k))return null;let D=m.querySelector("input")?.value??"",_=m.dataset.guid??crypto.randomUUID();return m.dataset.guid||(m.dataset.guid=_),{start:k,comment:D,guid:_}}).filter(Vo).forEach(m=>{if(!Number.isFinite(m.start))return;let g=document.createElement("div");g.className="ytls-marker",g.style.position="absolute",g.style.height="100%",g.style.width="2px",g.style.backgroundColor="#ff0000",g.style.cursor="pointer",g.style.left=m.start/o.duration*100+"%",g.dataset.time=String(m.start),g.addEventListener("click",()=>{let M=V();M&&M.seekTo(m.start)}),i.appendChild(g)})}function $n(o,i={}){if(!l||l.querySelector(".ytls-error-message")||!o)return;if(de){u("Save blocked: timestamps are currently loading");return}et();let c=uo().sort((d,v)=>d.start-v.start);if(c.length===0&&!i.allowEmpty){u("Save skipped: no timestamps to save");return}Qo(o,c).then(()=>u(`Successfully saved ${c.length} timestamps for ${o} to IndexedDB`)).catch(d=>u(`Failed to save timestamps for ${o} to IndexedDB:`,d,"error")),Xt({type:"timestamps_updated",videoId:o,action:"saved"})}function Rt(o,i,c,d){if(!o||de)return;let v={guid:i,start:c,comment:d};u(`Saving timestamp: guid=${i}, start=${c}, comment="${d}"`),Er(o,v).catch(b=>u(`Failed to save timestamp ${i}:`,b,"error")),Xt({type:"timestamps_updated",videoId:o,action:"saved"})}function dr(o,i){!o||de||(u(`Deleting timestamp: guid=${i}`),kr(o,i).catch(c=>u(`Failed to delete timestamp ${i}:`,c,"error")),Xt({type:"timestamps_updated",videoId:o,action:"saved"}))}async function Ko(o){if(!l||l.querySelector(".ytls-error-message")){alert("Cannot export timestamps while displaying an error message.");return}let i=te;if(!i)return;u(`Exporting timestamps for video ID: ${i}`);let c=uo(),d=Math.max(St(),0),v=Wn();if(o==="json"){let b=new Blob([JSON.stringify(c,null,2)],{type:"application/json"}),m=URL.createObjectURL(b),g=document.createElement("a");g.href=m,g.download=`timestamps-${i}-${v}.json`,g.click(),URL.revokeObjectURL(m)}else if(o==="text"){let b=c.map(k=>{let L=xt(k.start,d),D=`${k.comment} <!-- guid:${k.guid} -->`.trimStart();return`${L} ${D}`}).join(`
`),m=new Blob([b],{type:"text/plain"}),g=URL.createObjectURL(m),M=document.createElement("a");M.href=g,M.download=`timestamps-${i}-${v}.txt`,M.click(),URL.revokeObjectURL(g)}}function ho(o){if(!n||!l){u("Timekeeper error:",o,"error");return}Lt();let i=document.createElement("li");i.textContent=o,i.classList.add("ytls-error-message"),i.style.color="#ff6b6b",i.style.fontWeight="bold",i.style.padding="8px",i.style.background="rgba(255, 0, 0, 0.1)",l.appendChild(i),Se()}function Yo(){document.querySelectorAll(".ytls-marker").forEach(o=>o.remove())}function Ot(){if(!n||!document.body.contains(n))return;let o=n.getBoundingClientRect(),i=document.documentElement.clientWidth,c=document.documentElement.clientHeight,d=o.width,v=o.height;if(o.left<0&&(n.style.left="0",n.style.right="auto"),o.right>i){let b=Math.max(0,i-d);n.style.left=`${b}px`,n.style.right="auto"}if(o.top<0&&(n.style.top="0",n.style.bottom="auto"),o.bottom>c){let b=Math.max(0,c-v);n.style.top=`${b}px`,n.style.bottom="auto"}}function mr(){if(Sn&&(document.removeEventListener("mousemove",Sn),Sn=null),Ln&&(document.removeEventListener("mouseup",Ln),Ln=null),en&&(document.removeEventListener("keydown",en),en=null),In&&(window.removeEventListener("resize",In),In=null),tn&&(document.removeEventListener("pointerdown",tn,!0),tn=null),nn&&(document.removeEventListener("pointerup",nn,!0),nn=null),Je){try{Je.disconnect()}catch{}Je=null}if(Qe){try{Qe.disconnect()}catch{}Qe=null}let o=Re();o&&(Mn&&(o.removeEventListener("timeupdate",Mn),Mn=null),Cn&&(o.removeEventListener("pause",Cn),Cn=null),Dn&&(o.removeEventListener("play",Dn),Dn=null),An&&(o.removeEventListener("seeking",An),An=null))}function fr(){Yo(),Et.forEach(i=>clearTimeout(i)),Et.clear(),Qt&&(clearTimeout(Qt),Qt=null),ae&&(clearInterval(ae),ae=null),Xe&&(clearTimeout(Xe),Xe=null),mr();try{it.close()}catch{}if(F&&F.parentNode===document.body&&document.body.removeChild(F),F=null,En=null,Tn=!1,te=null,Je){try{Je.disconnect()}catch{}Je=null}if(Qe){try{Qe.disconnect()}catch{}Qe=null}n&&n.parentNode&&n.remove();let o=document.getElementById("ytls-header-button");o&&o.parentNode&&o.remove(),bt=null,kn=!1,Ae=null,Lt(),n=null,p=null,l=null,x=null,T=null,E=null,A=null,De=null}async function pr(){let o=Ht();if(!o)return De=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let i=await wn();if(!le(i)){let c=gt(i),d=c.length?` Missing methods: ${c.join(", ")}.`:"",v=i?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return De=null,{ok:!1,message:`${v}${d} Try refreshing once playback is ready.`}}return De=i,{ok:!0,player:i,videoId:o}}async function Zo(){if(!n||!l)return;let o=l.scrollTop,i=!0,c=()=>{if(!l||!i)return;let d=Math.max(0,l.scrollHeight-l.clientHeight);l.scrollTop=Math.min(o,d)};try{let d=await pr();if(!d.ok){ho(d.message),Lt(),Se();return}let{videoId:v}=d,b=[];try{let m=await Sr(v);m?(b=m.map(g=>({...g,guid:g.guid||crypto.randomUUID()})),u(`Loaded ${b.length} timestamps from IndexedDB for ${v}`)):u(`No timestamps found in IndexedDB for ${v}`)}catch(m){u(`Failed to load timestamps from IndexedDB for ${v}:`,m,"error"),ho("Failed to load timestamps from IndexedDB. Try refreshing the page."),Se();return}if(b.length>0){b.sort((L,D)=>L.start-D.start),Lt(),fo();let m=document.createDocumentFragment();b.forEach(L=>{let _=cn(L.start,L.comment,!0,L.guid,!1).__ytls_li;_&&m.appendChild(_)}),n&&n.classList.contains("ytls-zoom-in")&&fe!=null?(u("Deferring timestamp DOM append until show animation completes"),vt=m,lt||(lt=new Promise(L=>{Oe=L})),await lt):l&&(l.appendChild(m),et(),Se(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea()));let M=V(),k=M?Math.floor(M.getCurrentTime()):St();Number.isFinite(k)&&(Rn(k,!1),i=!1)}else Lt(),mo("No timestamps for this video"),Se(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea())}catch(d){u("Unexpected error while loading timestamps:",d,"error"),ho("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{lt&&await lt,requestAnimationFrame(c),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea()),l&&!l.querySelector(".ytls-error-message")&&sn()}}function Ht(){let i=new URLSearchParams(location.search).get("v");if(i)return i;let c=document.querySelector('meta[itemprop="identifier"]');return c?.content?c.content:null}function hr(){let o=Re();if(!o)return;let i=()=>{if(!l)return;let m=V(),g=m?Math.floor(m.getCurrentTime()):0;if(!Number.isFinite(g))return;let M=On(g);ln(M,!1)},c=m=>{try{let g=new URL(window.location.href);m!==null&&Number.isFinite(m)?g.searchParams.set("t",`${Math.floor(m)}s`):g.searchParams.delete("t"),window.history.replaceState({},"",g.toString())}catch{}},d=()=>{let m=V(),g=m?Math.floor(m.getCurrentTime()):0;Number.isFinite(g)&&c(g)},v=()=>{c(null)},b=()=>{let m=Re();if(!m)return;let g=V(),M=g?Math.floor(g.getCurrentTime()):0;if(!Number.isFinite(M))return;m.paused&&c(M);let k=On(M);ln(k,!0)};Mn=i,Cn=d,Dn=v,An=b,o.addEventListener("timeupdate",i),o.addEventListener("pause",d),o.addEventListener("play",v),o.addEventListener("seeking",b)}let xa="ytls-timestamps-db",Ta=7,Ea="timestamps",qe="timestamps_v2",Xo="settings",gr="video_metadata",yr="videos_csv_etag";function vr(){return Ne()}async function Jo(){let o={},i=await ei(qe),c=new Map;for(let b of i){let m=b;c.has(m.video_id)||c.set(m.video_id,[]),c.get(m.video_id).push({guid:m.guid,start:m.start,comment:m.comment})}for(let[b,m]of c)o[`ytls-${b}`]={video_id:b,timestamps:m.sort((g,M)=>g.start-M.start)};return{json:JSON.stringify(o,null,2),filename:"timekeeper-data.json",totalVideos:c.size,totalTimestamps:i.length}}async function br(){try{let{json:o,filename:i,totalVideos:c,totalTimestamps:d}=await Jo(),v=new Blob([o],{type:"application/json"}),b=URL.createObjectURL(v),m=document.createElement("a");m.href=b,m.download=i,m.click(),URL.revokeObjectURL(b),u(`Exported ${c} videos with ${d} timestamps`)}catch(o){throw u("Failed to export data:",o,"error"),o}}async function wr(){let o=await ei(qe);if(!Array.isArray(o)||o.length===0){let k=`Tag,Timestamp,URL
`,L=`timestamps-${Wn()}.csv`;return{csv:k,filename:L,totalVideos:0,totalTimestamps:0}}let i=new Map;for(let k of o)i.has(k.video_id)||i.set(k.video_id,[]),i.get(k.video_id).push({start:k.start,comment:k.comment});let c=[];c.push("Tag,Timestamp,URL");let d=0,v=k=>`"${String(k).replace(/"/g,'""')}"`,b=k=>{let L=Math.floor(k/3600),D=Math.floor(k%3600/60),_=String(k%60).padStart(2,"0");return`${String(L).padStart(2,"0")}:${String(D).padStart(2,"0")}:${_}`},m=Array.from(i.keys()).sort();for(let k of m){let L=i.get(k).sort((D,_)=>D.start-_.start);for(let D of L){let _=D.comment,pe=b(D.start),R=bo(D.start,`https://www.youtube.com/watch?v=${k}`);c.push([v(_),v(pe),v(R)].join(",")),d++}}let g=c.join(`
`),M=`timestamps-${Wn()}.csv`;return{csv:g,filename:M,totalVideos:i.size,totalTimestamps:d}}async function xr(){try{let{csv:o,filename:i,totalVideos:c,totalTimestamps:d}=await wr(),v=new Blob([o],{type:"text/csv;charset=utf-8;"}),b=URL.createObjectURL(v),m=document.createElement("a");m.href=b,m.download=i,m.click(),URL.revokeObjectURL(b),u(`Exported ${c} videos with ${d} timestamps (CSV)`)}catch(o){throw u("Failed to export CSV data:",o,"error"),o}}async function Tr(o,i,c){let d=!1;for(;;){let v=await vr();try{return await new Promise((b,m)=>{let g;try{g=v.transaction(o,i)}catch(L){m(new Error(`Failed to create transaction for ${o}: ${L}`));return}let M=g.objectStore(o),k;try{k=c(M)}catch(L){m(new Error(`Failed to execute operation on ${o}: ${L}`));return}k&&(k.onsuccess=()=>b(k.result),k.onerror=()=>m(k.error??new Error(`IndexedDB ${i} operation failed`))),g.oncomplete=()=>{k||b(void 0)},g.onerror=()=>m(g.error??new Error("IndexedDB transaction failed")),g.onabort=()=>m(g.error??new Error("IndexedDB transaction aborted"))})}catch(b){let m=b?.name||"",g=String(b||"");if((m==="NotFoundError"||/object stores? was not found/i.test(g)||/NotFoundError/.test(g))&&!d){d=!0,u(`IndexedDB store ${o} not found; attempting to create the store and retrying transaction`);try{if(v)try{v.close()}catch{}await Ti(o)}catch(k){u("Failed to create missing object store during ensure step:",k,"warn")}continue}throw b}}}async function Qo(o,i){let d=(await Ne()).transaction(qe,"readwrite"),v=d.objectStore(qe);try{let b=await v.index("video_id").getAll(IDBKeyRange.only(o)),m=new Set(i.map(g=>g.guid));for(let g of b)m.has(g.guid)||v.delete(g.guid);for(let g of i)v.put({guid:g.guid,video_id:o,start:g.start,comment:g.comment});await d.done}catch(b){throw u("Error during save operation:",b,"error"),b}}async function Er(o,i){let d=(await Ne()).transaction(qe,"readwrite"),v=d.objectStore(qe);try{await v.put({guid:i.guid,video_id:o,start:i.start,comment:i.comment}),await d.done}catch(b){throw b??new Error("Failed to save single timestamp to IndexedDB")}}async function kr(o,i){u(`Deleting timestamp ${i} for video ${o}`);let d=(await Ne()).transaction(qe,"readwrite"),v=d.objectStore(qe);try{await v.delete(i),await d.done}catch(b){throw b??new Error("Failed to delete single timestamp from IndexedDB")}}async function Sr(o){try{let v=await(await Ne()).transaction(qe,"readonly").objectStore(qe).index("video_id").getAll(IDBKeyRange.only(o));return v.length>0?v.map(m=>({guid:m.guid,start:m.start,comment:m.comment})).sort((m,g)=>m.start-g.start):null}catch(i){return u("Failed to load timestamps from IndexedDB:",i,"warn"),null}}async function Lr(o){try{let c=(await Ne()).transaction(qe,"readwrite"),d=c.objectStore(qe),v=await d.index("video_id").getAll(IDBKeyRange.only(o));for(let b of v)await d.delete(b.guid);await c.done}catch(i){throw u("Error during remove operation:",i,"error"),i}}function ei(o){return vi(o)}function dn(o,i){return bi(Xo,{key:o,value:i}).catch(c=>{throw u(`Failed to save setting '${o}' to IndexedDB:`,c,"error"),c})}function _n(o){return Xn(Xo,o).then(i=>i?.value).catch(i=>{u(`Failed to load setting '${o}' from IndexedDB:`,i,"error")})}async function Ir(){try{await Li({loadGlobalSettings:_n,saveGlobalSettings:dn,executeTransaction:Tr,VIDEO_METADATA_STORE:gr,VIDEOS_CSV_ETAG_KEY:yr,log:u})}catch(o){u("Failed to initialize video metadata:",o,"warn")}}Ir().catch(o=>u("initVideoMetadata failed:",o,"warn"));function ti(){if(!n)return;let o=n.style.display!=="none";dn("uiVisible",o)}function ct(o){let i=typeof o=="boolean"?o:!!n&&n.style.display!=="none",c=document.getElementById("ytls-header-button");c instanceof HTMLButtonElement&&c.setAttribute("aria-pressed",String(i)),bt&&!kn&&bt.src!==Te&&(bt.src=Te)}function Mr(){n&&_n("uiVisible").then(o=>{let i=o;typeof i=="boolean"?(i?(n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in")):n.style.display="none",ct(i)):(n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),ct(!0))}).catch(o=>{u("Failed to load UI visibility state:",o,"error"),n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),ct(!0)})}function go(o){if(!n){u("ERROR: togglePaneVisibility called but pane is null");return}document.body.contains(n)||(u("Pane not in DOM during toggle, appending it"),document.querySelectorAll("#ytls-pane").forEach(v=>{v!==n&&v.remove()}),document.body.appendChild(n));let i=document.querySelectorAll("#ytls-pane");i.length>1&&(u(`ERROR: Multiple panes detected in togglePaneVisibility (${i.length}), cleaning up`),i.forEach(v=>{v!==n&&v.remove()})),Xe&&(clearTimeout(Xe),Xe=null);let c=n.style.display==="none";(typeof o=="boolean"?o:c)?(n.style.display="flex",n.classList.remove("ytls-fade-out"),n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),ct(!0),ti(),ie(),fe&&(clearTimeout(fe),fe=null),fe=setTimeout(()=>{H(),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),ue(),N(!0),fe=null},450)):(n.classList.remove("ytls-fade-in"),n.classList.remove("ytls-zoom-in"),n.classList.add("ytls-zoom-out"),ct(!1),G())}function ni(o){if(!l){u("UI is not initialized; cannot import timestamps.","warn");return}let i=!1;try{let c=JSON.parse(o),d=null;if(Array.isArray(c))d=c;else if(typeof c=="object"&&c!==null){let v=te;if(v){let b=`timekeeper-${v}`;c[b]&&Array.isArray(c[b].timestamps)&&(d=c[b].timestamps,u(`Found timestamps for current video (${v}) in export format`,"info"))}if(!d){let b=Object.keys(c).filter(m=>m.startsWith("ytls-"));if(b.length===1&&Array.isArray(c[b[0]].timestamps)){d=c[b[0]].timestamps;let m=c[b[0]].video_id;u(`Found timestamps for video ${m} in export format`,"info")}}}d&&Array.isArray(d)?d.every(b=>typeof b.start=="number"&&typeof b.comment=="string")?(d.forEach(b=>{if(b.guid){let m=ee().find(g=>g.dataset.guid===b.guid);if(m){let g=m.querySelector("input");g&&(g.value=b.comment)}else cn(b.start,b.comment,!1,b.guid)}else cn(b.start,b.comment,!1,crypto.randomUUID())}),i=!0):u("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):u("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!i){let c=o.split(`
`).map(d=>d.trim()).filter(d=>d);if(c.length>0){let d=!1;c.forEach(v=>{let b=v.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(b){d=!0;let m=parseInt(b[1])||0,g=parseInt(b[2]),M=parseInt(b[3]),k=m*3600+g*60+M,L=b[4]?b[4].trim():"",D=null,_=L,pe=L.match(/<!--\s*guid:([^>]+?)\s*-->/);pe&&(D=pe[1].trim(),_=L.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let R;if(D&&(R=ee().find(ce=>ce.dataset.guid===D)),!R&&!D&&(R=ee().find(ce=>{if(ce.dataset.guid)return!1;let Be=ce.querySelector("a[data-time]")?.dataset.time;if(!Be)return!1;let rt=Number.parseInt(Be,10);return Number.isFinite(rt)&&rt===k})),R){let ce=R.querySelector("input");ce&&(ce.value=_)}else cn(k,_,!1,D||crypto.randomUUID())}}),d&&(i=!0)}}i?(u("Timestamps changed: Imported timestamps from file/clipboard"),et(),$n(te),Se(),Hn()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function Cr(){if(co){u("Pane initialization already in progress, skipping duplicate call");return}if(!(n&&document.body.contains(n))){co=!0;try{let c=function(){if(de||It)return;let h=Re(),f=V();if(!h&&!f)return;let y=f?f.getCurrentTime():0,w=Number.isFinite(y)?Math.max(0,Math.floor(y)):Math.max(0,St()),I=Math.floor(w/3600),B=Math.floor(w/60)%60,S=w%60,{isLive:z}=f?f.getVideoData()||{isLive:!1}:{isLive:!1},P=f?cr(f):!1,Y=l?ee().map(q=>{let ve=q.querySelector("a[data-time]");return ve?parseFloat(ve.getAttribute("data-time")??"0"):0}):[],Le="";if(Y.length>0)if(z){let q=Math.max(1,w/60),ve=Y.filter(Ie=>Ie<=w);if(ve.length>0){let Ie=(ve.length/q).toFixed(2);parseFloat(Ie)>0&&(Le=` (${Ie}/min)`)}}else{let q=f?f.getDuration():0,ve=Number.isFinite(q)&&q>0?q:h&&Number.isFinite(h.duration)&&h.duration>0?h.duration:0,Ie=Math.max(1,ve/60),mt=(Y.length/Ie).toFixed(1);parseFloat(mt)>0&&(Le=` (${mt}/min)`)}T.textContent=`\u23F3${I?I+":"+String(B).padStart(2,"0"):B}:${String(S).padStart(2,"0")}${Le}`,T.style.color=P?"#ff4d4f":"",Y.length>0&&Rn(w,!1)},R=function(h,f,y){let w=document.createElement("button");return w.textContent=h,_e(w,f),w.classList.add("ytls-settings-modal-button"),w.onclick=y,w},ce=function(h="general"){if(F&&F.parentNode===document.body){let Ee=document.getElementById("ytls-save-modal"),wt=document.getElementById("ytls-load-modal"),ft=document.getElementById("ytls-delete-all-modal");Ee&&document.body.contains(Ee)&&document.body.removeChild(Ee),wt&&document.body.contains(wt)&&document.body.removeChild(wt),ft&&document.body.contains(ft)&&document.body.removeChild(ft),F.classList.remove("ytls-fade-in"),F.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(F)&&document.body.removeChild(F),F=null,document.removeEventListener("click",Be,!0),document.removeEventListener("keydown",We)},300);return}F=document.createElement("div"),F.id="ytls-settings-modal",F.classList.remove("ytls-fade-out"),F.classList.add("ytls-fade-in");let f=document.createElement("div");f.className="ytls-modal-header";let y=document.createElement("div");y.id="ytls-settings-nav";let w=document.createElement("button");w.className="ytls-modal-close-button",w.textContent="\u2715",_e(w,"Close"),w.onclick=()=>{if(F&&F.parentNode===document.body){let Ee=document.getElementById("ytls-save-modal"),wt=document.getElementById("ytls-load-modal"),ft=document.getElementById("ytls-delete-all-modal");Ee&&document.body.contains(Ee)&&document.body.removeChild(Ee),wt&&document.body.contains(wt)&&document.body.removeChild(wt),ft&&document.body.contains(ft)&&document.body.removeChild(ft),F.classList.remove("ytls-fade-in"),F.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(F)&&document.body.removeChild(F),F=null,document.removeEventListener("click",Be,!0),document.removeEventListener("keydown",We)},300)}};let I=document.createElement("div");I.id="ytls-settings-content";let B=document.createElement("h3");B.className="ytls-section-heading",B.textContent="General",B.style.display="none";let S=document.createElement("div"),z=document.createElement("div");z.className="ytls-button-grid";function P(Ee){S.style.display=Ee==="general"?"block":"none",z.style.display=Ee==="drive"?"block":"none",Y.classList.toggle("active",Ee==="general"),q.classList.toggle("active",Ee==="drive"),B.textContent=Ee==="general"?"General":"Google Drive"}let Y=document.createElement("button");Y.textContent="\u{1F6E0}\uFE0F";let Le=document.createElement("span");Le.className="ytls-tab-text",Le.textContent=" General",Y.appendChild(Le),_e(Y,"General settings"),Y.classList.add("ytls-settings-modal-button"),Y.onclick=()=>P("general");let q=document.createElement("button");q.textContent="\u2601\uFE0F";let ve=document.createElement("span");ve.className="ytls-tab-text",ve.textContent=" Backup",q.appendChild(ve),_e(q,"Google Drive sign-in and backup"),q.classList.add("ytls-settings-modal-button"),q.onclick=async()=>{$.isSignedIn&&await tr(),P("drive")},y.appendChild(Y),y.appendChild(q),f.appendChild(y),f.appendChild(w),F.appendChild(f),S.className="ytls-button-grid",S.appendChild(R("\u{1F4BE} Save","Save As...",rt.onclick)),S.appendChild(R("\u{1F4C2} Load","Load",$t.onclick)),S.appendChild(R("\u{1F4E4} Export All","Export All Data",ut.onclick)),S.appendChild(R("\u{1F4E5} Import All","Import All Data",Q.onclick)),S.appendChild(R("\u{1F4C4} Export All (CSV)","Export All Timestamps to CSV",async()=>{try{await xr()}catch{alert("Failed to export CSV: Could not read from database.")}}));let Ie=R($.isSignedIn?"\u{1F513} Sign Out":"\u{1F510} Sign In",$.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{$.isSignedIn?await er():await Ji(),Ie.textContent=$.isSignedIn?"\u{1F513} Sign Out":"\u{1F510} Sign In",_e(Ie,$.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive")});z.appendChild(Ie);let mt=R(nt?"\u{1F501} Auto Backup: On":"\u{1F501} Auto Backup: Off","Toggle Auto Backup",async()=>{await ir(),mt.textContent=nt?"\u{1F501} Auto Backup: On":"\u{1F501} Auto Backup: Off"});z.appendChild(mt);let Ct=R(`\u23F1\uFE0F Backup Interval: ${Ve}min`,"Set periodic backup interval (minutes)",async()=>{await rr(),Ct.textContent=`\u23F1\uFE0F Backup Interval: ${Ve}min`});z.appendChild(Ct),z.appendChild(R("\u{1F5C4}\uFE0F Backup Now","Run a backup immediately",async()=>{await vn(!1)}));let $e=document.createElement("div");$e.style.marginTop="15px",$e.style.paddingTop="10px",$e.style.borderTop="1px solid #555",$e.style.fontSize="12px",$e.style.color="#aaa";let Dt=document.createElement("div");Dt.style.marginBottom="8px",Dt.style.fontWeight="bold",$e.appendChild(Dt),Yi(Dt);let vo=document.createElement("div");vo.style.marginBottom="8px",Wi(vo),$e.appendChild(vo);let si=document.createElement("div");Ki(si),$e.appendChild(si),z.appendChild($e),Pe(),bn(),Ze(),I.appendChild(B),I.appendChild(S),I.appendChild(z),P(h),F.appendChild(I),document.body.appendChild(F),requestAnimationFrame(()=>{let Ee=F.getBoundingClientRect(),ft=(window.innerHeight-Ee.height)/2;F.style.top=`${Math.max(20,ft)}px`,F.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",Be,!0),document.addEventListener("keydown",We)},0)},We=function(h){if(h.key==="Escape"&&F&&F.parentNode===document.body){let f=document.getElementById("ytls-save-modal"),y=document.getElementById("ytls-load-modal"),w=document.getElementById("ytls-delete-all-modal");if(f||y||w)return;h.preventDefault(),f&&document.body.contains(f)&&document.body.removeChild(f),y&&document.body.contains(y)&&document.body.removeChild(y),w&&document.body.contains(w)&&document.body.removeChild(w),F.classList.remove("ytls-fade-in"),F.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(F)&&document.body.removeChild(F),F=null,document.removeEventListener("click",Be,!0),document.removeEventListener("keydown",We)},300)}},Be=function(h){if(En&&En.contains(h.target))return;let f=document.getElementById("ytls-save-modal"),y=document.getElementById("ytls-load-modal"),w=document.getElementById("ytls-delete-all-modal");f&&f.contains(h.target)||y&&y.contains(h.target)||w&&w.contains(h.target)||F&&F.contains(h.target)||(f&&document.body.contains(f)&&document.body.removeChild(f),y&&document.body.contains(y)&&document.body.removeChild(y),w&&document.body.contains(w)&&document.body.removeChild(w),F&&F.parentNode===document.body&&(F.classList.remove("ytls-fade-in"),F.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(F)&&document.body.removeChild(F),F=null,document.removeEventListener("click",Be,!0),document.removeEventListener("keydown",We)},300)))},K=function(){n&&(u("Loading window position from IndexedDB"),_n("windowPosition").then(h=>{if(h&&typeof h.x=="number"&&typeof h.y=="number"){let y=h;n.style.left=`${y.x}px`,n.style.top=`${y.y}px`,n.style.right="auto",n.style.bottom="auto",typeof y.width=="number"&&y.width>0?n.style.width=`${y.width}px`:(n.style.width=`${zt}px`,u(`No stored window width found, using default width ${zt}px`)),typeof y.height=="number"&&y.height>0?n.style.height=`${y.height}px`:(n.style.height=`${Tt}px`,u(`No stored window height found, using default height ${Tt}px`));let w=J();ne(w,y.x,y.y),u("Restored window position from IndexedDB:",Ae)}else u("No window position found in IndexedDB, applying default size and leaving default position"),n.style.width=`${zt}px`,n.style.height=`${Tt}px`,Ae=null;Ot();let f=J();f&&(f.width||f.height)&&ne(f),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea()}).catch(h=>{u("failed to load pane position from IndexedDB:",h,"warn"),Ot();let f=J();f&&(f.width||f.height)&&(Ae={x:Math.max(0,Math.round(f.left)),y:0,width:Math.round(f.width),height:Math.round(f.height)}),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea()}))},he=function(){if(!n)return;let h=J();if(!h)return;let f={x:Math.max(0,Math.round(h.left)),y:Math.max(0,Math.round(h.top)),width:Math.round(h.width),height:Math.round(h.height)};if(Ae&&Ae.x===f.x&&Ae.y===f.y&&Ae.width===f.width&&Ae.height===f.height){u("Skipping window position save; position and size unchanged");return}Ae={...f},u(`Saving window position and size to IndexedDB: x=${f.x}, y=${f.y}, width=${f.width}, height=${f.height}`),dn("windowPosition",f),Xt({type:"window_position_updated",position:f,timestamp:Date.now()})},Vn=function(h,f){h.addEventListener("dblclick",y=>{y.preventDefault(),y.stopPropagation(),n&&(n.style.width="300px",n.style.height="300px",he(),mn())}),h.addEventListener("mousedown",y=>{y.preventDefault(),y.stopPropagation(),dt=!0,Mt=f,ri=y.clientX,ai=y.clientY;let w=n.getBoundingClientRect();Gt=w.width,Ut=w.height,Gn=w.left,Un=w.top,f==="top-left"||f==="bottom-right"?document.body.style.cursor="nwse-resize":document.body.style.cursor="nesw-resize"})},mn=function(){if(n&&p&&x&&l){let h=n.getBoundingClientRect(),f=p.getBoundingClientRect(),y=x.getBoundingClientRect(),w=h.height-(f.height+y.height);l.style.maxHeight=w>0?w+"px":"0px",l.style.overflowY=w>0?"auto":"hidden"}};document.querySelectorAll("#ytls-pane").forEach(h=>h.remove()),n=document.createElement("div"),p=document.createElement("div"),l=document.createElement("ul"),x=document.createElement("div"),T=document.createElement("span"),E=document.createElement("style"),A=document.createElement("span"),C=document.createElement("span"),C.classList.add("ytls-backup-indicator"),C.style.cursor="pointer",C.style.backgroundColor="#666",C.onclick=h=>{h.stopPropagation(),ce("drive")},l.addEventListener("mouseenter",()=>{Tn=!0,on=!1}),l.addEventListener("mouseleave",()=>{if(Tn=!1,on)return;let h=V(),f=h?Math.floor(h.getCurrentTime()):St();Rn(f,!1);let y=null;if(document.activeElement instanceof HTMLInputElement&&l.contains(document.activeElement)&&(y=document.activeElement.closest("li")?.dataset.guid??null),Wo(),y){let I=ee().find(B=>B.dataset.guid===y)?.querySelector("input");if(I)try{I.focus({preventScroll:!0})}catch{}}}),n.id="ytls-pane",p.id="ytls-pane-header",p.addEventListener("dblclick",h=>{let f=h.target instanceof HTMLElement?h.target:null;f&&(f.closest("a")||f.closest("button")||f.closest("#ytls-current-time")||f.closest(".ytls-version-display")||f.closest(".ytls-backup-indicator"))||(h.preventDefault(),go(!1))});let o=GM_info.script.version;A.textContent=`v${o}`,A.classList.add("ytls-version-display");let i=document.createElement("span");i.style.display="inline-flex",i.style.alignItems="center",i.style.gap="6px",i.appendChild(A),i.appendChild(C),T.id="ytls-current-time",T.textContent="\u23F3",T.onclick=()=>{It=!0;let h=V();h&&h.seekToLiveHead(),setTimeout(()=>{It=!1},500)},_e(T,()=>{let h=te??Ht();if(!yt){if(!h)return"Current time";let B=document.createElement("div");B.className="ytls-video-tooltip";let S=document.createElement("a");S.href=`https://www.youtube.com/watch?v=${encodeURIComponent(h)}`,S.target="_blank",S.rel="noopener noreferrer",S.style.display="flex",S.style.alignItems="center",S.style.gap="8px",S.style.textDecoration="none",S.style.color="inherit";let z=document.createElement("div");z.className="ytls-video-thumb",z.style.background="linear-gradient(90deg,#444,#666)",z.style.width="120px",z.style.height="68px",z.style.borderRadius="3px",z.style.flexShrink="0";let P=document.createElement("div");return P.textContent="Loading video metadata...",P.style.maxWidth="260px",P.style.fontWeight="500",S.appendChild(z),S.appendChild(P),B.appendChild(S),B}let f=document.createElement("div");f.className="ytls-video-tooltip";let y=document.createElement("a");y.href=`https://www.youtube.com/watch?v=${encodeURIComponent(yt.video_id||(te??""))}`,y.target="_blank",y.rel="noopener noreferrer",y.style.display="flex",y.style.alignItems="center",y.style.gap="8px",y.style.textDecoration="none",y.style.color="inherit";let w=document.createElement("img");w.className="ytls-video-thumb",w.src=No(yt.thumbnail_url)??"",w.style.height="68px",w.style.objectFit="cover",w.style.borderRadius="3px",w.style.flexShrink="0";let I=document.createElement("div");return I.textContent=yt.title||"Unknown video",I.style.maxWidth="260px",I.style.fontWeight="500",y.appendChild(w),y.appendChild(I),f.appendChild(y),f}),c(),ae&&clearInterval(ae),ae=setInterval(c,1e3),x.id="ytls-buttons";let d=(h,f)=>()=>{h.classList.remove("ytls-fade-in"),h.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(h)&&document.body.removeChild(h),f&&f()},300)},v=h=>f=>{f.key==="Escape"&&(f.preventDefault(),f.stopPropagation(),h())},b=h=>{setTimeout(()=>{document.addEventListener("keydown",h)},0)},m=(h,f)=>y=>{h.contains(y.target)||f()},g=h=>{setTimeout(()=>{document.addEventListener("click",h,!0)},0)},_=[{label:"\u{1F423}",title:"Add timestamp",action:()=>{if(!l||l.querySelector(".ytls-error-message")||de)return;let h=typeof Ft<"u"?Ft:0,f=V(),y=f?Math.floor(f.getCurrentTime()+h):0;if(!Number.isFinite(y))return;let w=cn(y,"");w&&w.focus()}},{label:"\u2699\uFE0F",title:"Settings",action:()=>ce()},{label:"\u{1F4CB}",title:"Copy timestamps to clipboard",action:function(h){if(!l||l.querySelector(".ytls-error-message")||de){this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3);return}let f=uo(),y=Math.max(St(),0);if(f.length===0){this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3);return}let w=h.ctrlKey,I=f.map(B=>{let S=xt(B.start,y);return w?`${S} ${B.comment} <!-- guid:${B.guid} -->`.trimStart():`${S} ${B.comment}`}).join(`
`);navigator.clipboard.writeText(I).then(()=>{this.textContent="\u2705",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3)}).catch(B=>{u("Failed to copy timestamps: ",B,"error"),this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3)})}},{label:"\u23F1\uFE0F",title:"Offset all timestamps",action:()=>{if(!l||l.querySelector(".ytls-error-message")||de)return;if(ee().length===0){alert("No timestamps available to offset.");return}let f=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(f===null)return;let y=f.trim();if(y.length===0)return;let w=Number.parseInt(y,10);if(!Number.isFinite(w)){alert("Please enter a valid integer number of seconds.");return}w!==0&&jo(w,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{label:"\u{1F5D1}\uFE0F",title:"Delete all timestamps for current video",action:async()=>{let h=Ht();if(!h){alert("Unable to determine current video ID.");return}let f=document.createElement("div");f.id="ytls-delete-all-modal",f.classList.remove("ytls-fade-out"),f.classList.add("ytls-fade-in");let y=document.createElement("p");y.textContent="Hold the button to delete all timestamps for:",y.style.marginBottom="10px";let w=document.createElement("p");w.textContent=h,w.style.fontFamily="monospace",w.style.fontSize="12px",w.style.marginBottom="15px",w.style.color="#aaa";let I=document.createElement("button");I.classList.add("ytls-save-modal-button"),I.style.background="#d32f2f",I.style.position="relative",I.style.overflow="hidden";let B=null,S=0,z=null,P=document.createElement("div");P.style.position="absolute",P.style.left="0",P.style.top="0",P.style.height="100%",P.style.width="0%",P.style.background="#ff6b6b",P.style.transition="none",P.style.pointerEvents="none",I.appendChild(P);let Y=document.createElement("span");Y.textContent="Hold to Delete All",Y.style.position="relative",Y.style.zIndex="1",I.appendChild(Y);let Le=()=>{if(!S)return;let $e=Date.now()-S,Dt=Math.min($e/5e3*100,100);P.style.width=`${Dt}%`,Dt<100&&(z=requestAnimationFrame(Le))},q=()=>{B&&(clearTimeout(B),B=null),z&&(cancelAnimationFrame(z),z=null),S=0,P.style.width="0%",Y.textContent="Hold to Delete All"};I.onmousedown=()=>{S=Date.now(),Y.textContent="Deleting...",z=requestAnimationFrame(Le),B=setTimeout(async()=>{q(),f.classList.remove("ytls-fade-in"),f.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(f)&&document.body.removeChild(f);try{await Lr(h),yo()}catch($e){u("Failed to delete all timestamps:",$e,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},I.onmouseup=q,I.onmouseleave=q;let ve=null,Ie=null,mt=d(f,()=>{q(),ve&&document.removeEventListener("keydown",ve),Ie&&document.removeEventListener("click",Ie,!0)});ve=v(mt),Ie=m(f,mt);let Ct=document.createElement("button");Ct.textContent="Cancel",Ct.classList.add("ytls-save-modal-cancel-button"),Ct.onclick=mt,f.appendChild(y),f.appendChild(w),f.appendChild(I),f.appendChild(Ct),document.body.appendChild(f),b(ve),g(Ie)}}],pe=li();_.forEach(h=>{let f=document.createElement("button");if(f.textContent=h.label,_e(f,h.title),f.classList.add("ytls-main-button"),h.label==="\u{1F423}"&&pe){let y=document.createElement("span");y.textContent=pe,y.classList.add("ytls-holiday-emoji"),f.appendChild(y)}h.label==="\u{1F4CB}"?f.onclick=function(y){h.action.call(this,y)}:f.onclick=h.action,h.label==="\u2699\uFE0F"&&(En=f),x.appendChild(f)});let rt=document.createElement("button");rt.textContent="\u{1F4BE} Save",rt.classList.add("ytls-file-operation-button"),rt.onclick=()=>{let h=document.createElement("div");h.id="ytls-save-modal",h.classList.remove("ytls-fade-out"),h.classList.add("ytls-fade-in");let f=document.createElement("p");f.textContent="Save as:";let y=null,w=null,I=d(h,()=>{y&&document.removeEventListener("keydown",y),w&&document.removeEventListener("click",w,!0)});y=v(I),w=m(h,I);let B=document.createElement("button");B.textContent="JSON",B.classList.add("ytls-save-modal-button"),B.onclick=()=>{y&&document.removeEventListener("keydown",y),w&&document.removeEventListener("click",w,!0),d(h,()=>Ko("json"))()};let S=document.createElement("button");S.textContent="Plain Text",S.classList.add("ytls-save-modal-button"),S.onclick=()=>{y&&document.removeEventListener("keydown",y),w&&document.removeEventListener("click",w,!0),d(h,()=>Ko("text"))()};let z=document.createElement("button");z.textContent="Cancel",z.classList.add("ytls-save-modal-cancel-button"),z.onclick=I,h.appendChild(f),h.appendChild(B),h.appendChild(S),h.appendChild(z),document.body.appendChild(h),b(y),g(w)};let $t=document.createElement("button");$t.textContent="\u{1F4C2} Load",$t.classList.add("ytls-file-operation-button"),$t.onclick=()=>{let h=document.createElement("div");h.id="ytls-load-modal",h.classList.remove("ytls-fade-out"),h.classList.add("ytls-fade-in");let f=document.createElement("p");f.textContent="Load from:";let y=null,w=null,I=d(h,()=>{y&&document.removeEventListener("keydown",y),w&&document.removeEventListener("click",w,!0)});y=v(I),w=m(h,I);let B=document.createElement("button");B.textContent="File",B.classList.add("ytls-save-modal-button"),B.onclick=()=>{let P=document.createElement("input");P.type="file",P.accept=".json,.txt",P.classList.add("ytls-hidden-file-input"),P.onchange=Y=>{let Le=Y.target.files?.[0];if(!Le)return;y&&document.removeEventListener("keydown",y),w&&document.removeEventListener("click",w,!0),I();let q=new FileReader;q.onload=()=>{let ve=String(q.result).trim();ni(ve)},q.readAsText(Le)},P.click()};let S=document.createElement("button");S.textContent="Clipboard",S.classList.add("ytls-save-modal-button"),S.onclick=async()=>{y&&document.removeEventListener("keydown",y),w&&document.removeEventListener("click",w,!0),d(h,async()=>{try{let P=await navigator.clipboard.readText();P?ni(P.trim()):alert("Clipboard is empty.")}catch(P){u("Failed to read from clipboard: ",P,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let z=document.createElement("button");z.textContent="Cancel",z.classList.add("ytls-save-modal-cancel-button"),z.onclick=I,h.appendChild(f),h.appendChild(B),h.appendChild(S),h.appendChild(z),document.body.appendChild(h),b(y),g(w)};let ut=document.createElement("button");ut.textContent="\u{1F4E4} Export",ut.classList.add("ytls-file-operation-button"),ut.onclick=async()=>{try{await br()}catch{alert("Failed to export data: Could not read from database.")}};let Q=document.createElement("button");Q.textContent="\u{1F4E5} Import",Q.classList.add("ytls-file-operation-button"),Q.onclick=()=>{let h=document.createElement("input");h.type="file",h.accept=".json",h.classList.add("ytls-hidden-file-input"),h.onchange=f=>{let y=f.target.files?.[0];if(!y)return;let w=new FileReader;w.onload=()=>{try{let I=JSON.parse(String(w.result)),B=[];for(let S in I)if(Object.prototype.hasOwnProperty.call(I,S)&&S.startsWith("ytls-")){let z=S.substring(5),P=I[S];if(P&&typeof P.video_id=="string"&&Array.isArray(P.timestamps)){let Y=P.timestamps.map(q=>({...q,guid:q.guid||crypto.randomUUID()})),Le=Qo(z,Y).then(()=>u(`Imported ${z} to IndexedDB`)).catch(q=>u(`Failed to import ${z} to IndexedDB:`,q,"error"));B.push(Le)}else u(`Skipping key ${S} during import due to unexpected data format.`,"warn")}Promise.all(B).then(()=>{yo()}).catch(S=>{alert("An error occurred during import to IndexedDB. Check console for details."),u("Overall import error:",S,"error")})}catch(I){alert(`Failed to import data. Please ensure the file is in the correct format.
`+I.message),u("Import error:",I,"error")}},w.readAsText(y)},h.click()},E.textContent=Ii,l.onclick=h=>{qo(h)},l.ontouchstart=h=>{qo(h)},n.style.position="fixed",n.style.bottom="0",n.style.right="0",n.style.transition="none",K(),setTimeout(()=>Ot(),10);let re=!1,oe,ye,He=!1;n.addEventListener("mousedown",h=>{let f=h.target;f instanceof Element&&(f instanceof HTMLInputElement||f instanceof HTMLTextAreaElement||f!==p&&!p.contains(f)&&window.getComputedStyle(f).cursor==="pointer"||(re=!0,He=!1,oe=h.clientX-n.getBoundingClientRect().left,ye=h.clientY-n.getBoundingClientRect().top,n.style.transition="none"))}),document.addEventListener("mousemove",Sn=h=>{if(!re)return;He=!0;let f=h.clientX-oe,y=h.clientY-ye,w=n.getBoundingClientRect(),I=w.width,B=w.height,S=document.documentElement.clientWidth,z=document.documentElement.clientHeight;f=Math.max(0,Math.min(f,S-I)),y=Math.max(0,Math.min(y,z-B)),n.style.left=`${f}px`,n.style.top=`${y}px`,n.style.right="auto",n.style.bottom="auto"}),document.addEventListener("mouseup",Ln=()=>{if(!re)return;re=!1;let h=He;setTimeout(()=>{He=!1},50),Ot(),setTimeout(()=>{h&&he()},200)}),n.addEventListener("dragstart",h=>h.preventDefault());let tt=document.createElement("div"),_t=document.createElement("div"),Nn=document.createElement("div"),Nt=document.createElement("div");tt.id="ytls-resize-tl",_t.id="ytls-resize-tr",Nn.id="ytls-resize-bl",Nt.id="ytls-resize-br";let dt=!1,ri=0,ai=0,Gt=0,Ut=0,Gn=0,Un=0,Mt=null;Vn(tt,"top-left"),Vn(_t,"top-right"),Vn(Nn,"bottom-left"),Vn(Nt,"bottom-right"),document.addEventListener("mousemove",h=>{if(!dt||!n||!Mt)return;let f=h.clientX-ri,y=h.clientY-ai,w=Gt,I=Ut,B=Gn,S=Un,z=document.documentElement.clientWidth,P=document.documentElement.clientHeight;Mt==="bottom-right"?(w=Math.max(200,Math.min(800,Gt+f)),I=Math.max(250,Math.min(P,Ut+y))):Mt==="top-left"?(w=Math.max(200,Math.min(800,Gt-f)),B=Gn+f,I=Math.max(250,Math.min(P,Ut-y)),S=Un+y):Mt==="top-right"?(w=Math.max(200,Math.min(800,Gt+f)),I=Math.max(250,Math.min(P,Ut-y)),S=Un+y):Mt==="bottom-left"&&(w=Math.max(200,Math.min(800,Gt-f)),B=Gn+f,I=Math.max(250,Math.min(P,Ut+y))),B=Math.max(0,Math.min(B,z-w)),S=Math.max(0,Math.min(S,P-I)),n.style.width=`${w}px`,n.style.height=`${I}px`,n.style.left=`${B}px`,n.style.top=`${S}px`,n.style.right="auto",n.style.bottom="auto"}),document.addEventListener("mouseup",()=>{dt&&(dt=!1,Mt=null,document.body.style.cursor="",N(!0))});let jn=null;window.addEventListener("resize",In=()=>{jn&&clearTimeout(jn),jn=setTimeout(()=>{N(!0),jn=null},200)}),p.appendChild(T),p.appendChild(i);let qn=document.createElement("div");if(qn.id="ytls-content",qn.append(l),qn.append(x),n.append(p,qn,E,tt,_t,Nn,Nt),n.addEventListener("mousemove",h=>{try{if(re||dt)return;let f=n.getBoundingClientRect(),y=20,w=h.clientX,I=h.clientY,B=w-f.left<=y,S=f.right-w<=y,z=I-f.top<=y,P=f.bottom-I<=y,Y="";z&&B||P&&S?Y="nwse-resize":z&&S||P&&B?Y="nesw-resize":Y="",document.body.style.cursor=Y}catch{}}),n.addEventListener("mouseleave",()=>{!dt&&!re&&(document.body.style.cursor="")}),window.recalculateTimestampsArea=mn,setTimeout(()=>{if(mn(),n&&p&&x&&l){let h=40,f=ee();if(f.length>0)h=f[0].offsetHeight;else{let y=document.createElement("li");y.style.visibility="hidden",y.style.position="absolute",y.textContent="00:00 Example",l.appendChild(y),h=y.offsetHeight,l.removeChild(y)}O=p.offsetHeight+x.offsetHeight+h,n.style.minHeight=O+"px"}},0),window.addEventListener("resize",mn),Qe){try{Qe.disconnect()}catch{}Qe=null}Qe=new ResizeObserver(mn),Qe.observe(n),tn||document.addEventListener("pointerdown",tn=()=>{Go=Date.now()},!0),nn||document.addEventListener("pointerup",nn=()=>{},!0)}finally{co=!1}}}async function Dr(){if(!n)return;if(document.querySelectorAll("#ytls-pane").forEach(c=>{c!==n&&(u("Removing duplicate pane element from DOM"),c.remove())}),document.body.contains(n)){u("Pane already in DOM, skipping append");return}await Mr(),typeof Ro=="function"&&Ro(Jo),typeof io=="function"&&io(dn),typeof ro=="function"&&ro(_n),typeof Fo=="function"&&Fo(C),await Oo(),await or(),await Kt(),typeof Wt=="function"&&Wt();let i=document.querySelectorAll("#ytls-pane");if(i.length>0&&(u(`WARNING: Found ${i.length} existing pane(s) in DOM, removing all`),i.forEach(c=>c.remove())),document.body.contains(n)){u("ERROR: Pane already in body, aborting append");return}if(document.body.appendChild(n),u("Pane successfully appended to DOM"),ie(),fe&&(clearTimeout(fe),fe=null),fe=setTimeout(()=>{H(),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),ue(),N(!0),fe=null},450),Je){try{Je.disconnect()}catch{}Je=null}Je=new MutationObserver(()=>{let c=document.querySelectorAll("#ytls-pane");c.length>1&&(u(`CRITICAL: Multiple panes detected (${c.length}), removing duplicates`),c.forEach((d,v)=>{(v>0||n&&d!==n)&&d.remove()}))}),Je.observe(document.body,{childList:!0,subtree:!0})}function oi(o=0){if(document.getElementById("ytls-header-button")){ct();return}let i=document.querySelector("#logo");if(!i||!i.parentElement){o<10&&setTimeout(()=>oi(o+1),300);return}let c=document.createElement("button");c.id="ytls-header-button",c.type="button",c.className="ytls-header-button",_e(c,"Toggle Timekeeper UI"),c.setAttribute("aria-label","Toggle Timekeeper UI");let d=document.createElement("img");d.src=Te,d.alt="",d.decoding="async",c.appendChild(d),bt=d,c.addEventListener("mouseenter",()=>{bt&&(kn=!0,bt.src=Me)}),c.addEventListener("mouseleave",()=>{bt&&(kn=!1,ct())}),c.addEventListener("click",()=>{n&&!document.body.contains(n)&&(u("Pane not in DOM, re-appending before toggle"),document.body.appendChild(n)),go()}),i.insertAdjacentElement("afterend",c),ct(),u("Timekeeper header button added next to YouTube logo")}function ii(){if(W)return;W=!0;let o=history.pushState,i=history.replaceState;function c(){try{let d=new Event("locationchange");window.dispatchEvent(d)}catch{}}history.pushState=function(){let d=o.apply(this,arguments);return c(),d},history.replaceState=function(){let d=i.apply(this,arguments);return c(),d},window.addEventListener("popstate",c),window.addEventListener("locationchange",()=>{if(window.location.href!==Z){u("Location changed (locationchange event) \u2014 deferring UI update until navigation finish");let d=Ht();if(d!==te){u("Location change detected: video id changed, refreshing metadata early",{from:te,to:d});try{te=d,yt=null,So();try{let v=document.getElementById("ytls-current-time");v&&Kn(v)}catch{}lo().then(()=>{try{let v=document.getElementById("ytls-current-time");v&&Kn(v)}catch{}})}catch(v){u("Error while attempting early video metadata refresh",v,"warn")}}}})}async function yo(){if(!s()){fr();return}Z=window.location.href,document.querySelectorAll("#ytls-pane").forEach((i,c)=>{(c>0||n&&i!==n)&&i.remove()}),await me(),await Cr(),te=Ht();let o=document.title;u("Page Title:",o),u("Video ID:",te),u("Current URL:",window.location.href),po(!0),Lt(),Se(),await Zo(),Se(),po(!1),u("Timestamps loaded and UI unlocked for video:",te),await lo(),await Dr(),oi(),hr()}ii(),window.addEventListener("yt-navigate-start",()=>{u("Navigation started (yt-navigate-start event fired)"),s()&&n&&l&&(u("Locking UI and showing loading state for navigation"),po(!0))}),en=o=>{o.ctrlKey&&o.altKey&&o.shiftKey&&(o.key==="T"||o.key==="t")&&(o.preventDefault(),go(),u("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",en),window.addEventListener("yt-navigate-finish",()=>{u("Navigation finished (yt-navigate-finish event fired)"),window.location.href!==Z?yo():u("Navigation finished but URL already handled, skipping.")}),ii(),u("Timekeeper initialized and waiting for navigation events")})();})();

