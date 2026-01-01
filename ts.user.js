// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      4.3.7
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

(()=>{function c(e,...i){let r="debug",s=[...i];i.length>0&&typeof i[i.length-1]=="string"&&["debug","info","warn","error"].includes(i[i.length-1])&&(r=s.pop());let n=`[Timekeeper v${GM_info.script.version}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[r](`${n} ${e}`,...s)}function vt(e,i=e){let r=Math.floor(e/3600),s=Math.floor(e%3600/60),f=String(e%60).padStart(2,"0");return i<3600?`${s<10?s:String(s).padStart(2,"0")}:${f}`:`${i>=36e3?String(r).padStart(2,"0"):r}:${String(s).padStart(2,"0")}:${f}`}function Yo(e,i=window.location.href){try{let r=new URL(i);return r.searchParams.set("t",`${e}s`),r.toString()}catch{return`https://www.youtube.com/watch?v=${i.search(/[?&]v=/)>=0?i.split(/[?&]v=/)[1].split(/&/)[0]:i.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${e}s`}}function ho(){let e=new Date;return e.getUTCFullYear()+"-"+String(e.getUTCMonth()+1).padStart(2,"0")+"-"+String(e.getUTCDate()).padStart(2,"0")+"--"+String(e.getUTCHours()).padStart(2,"0")+"-"+String(e.getUTCMinutes()).padStart(2,"0")+"-"+String(e.getUTCSeconds()).padStart(2,"0")}var Xi=[{emoji:"\u{1F942}",month:1,day:1,name:"New Year's Day"},{emoji:"\u{1F49D}",month:2,day:14,name:"Valentine's Day"},{emoji:"\u{1F986}",month:5,day:25,name:"Kanna's Debut Anniversary"},{emoji:"\u{1F383}",month:10,day:31,name:"Halloween"},{emoji:"\u{1F382}",month:9,day:15,name:"Kanna's Birthday"},{emoji:"\u{1F332}",month:12,day:25,name:"Christmas"}];function Zo(){let e=new Date,i=e.getFullYear(),r=e.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});for(let s of Xi){let f=new Date(i,s.month-1,s.day),n=f.getTime()-e.getTime(),v=n/(1e3*60*60*24);if(v<=5&&v>=-2)return c(`Current date: ${r}, Selected emoji: ${s.emoji} (${s.name}), Days until holiday: ${Math.ceil(v)}`),s.emoji;if(v<-2&&(f=new Date(i+1,s.month-1,s.day),n=f.getTime()-e.getTime(),v=n/(1e3*60*60*24),v<=5&&v>=-2))return c(`Current date: ${r}, Selected emoji: ${s.emoji} (${s.name}), Days until holiday: ${Math.ceil(v)}`),s.emoji;if(v>5&&(f=new Date(i-1,s.month-1,s.day),n=f.getTime()-e.getTime(),v=n/(1e3*60*60*24),v<=5&&v>=-2))return c(`Current date: ${r}, Selected emoji: ${s.emoji} (${s.name}), Days until holiday: ${Math.ceil(v)}`),s.emoji}return c(`Current date: ${r}, No holiday emoji (not within range)`),null}var bt=null,_t=null,Qi=500;function er(){return(!bt||!document.body.contains(bt))&&(bt=document.createElement("div"),bt.className="ytls-tooltip",document.body.appendChild(bt)),bt}function tr(e,i,r){let f=window.innerWidth,n=window.innerHeight,v=e.getBoundingClientRect(),l=v.width,S=v.height,E=i+10,w=r+10;E+l>f-10&&(E=i-l-10),w+S>n-10&&(w=r-S-10),E=Math.max(10,Math.min(E,f-l-10)),w=Math.max(10,Math.min(w,n-S-10)),e.style.left=`${E}px`,e.style.top=`${w}px`}function nr(e,i,r){_t&&clearTimeout(_t),_t=setTimeout(()=>{let s=er();s.textContent=e,s.classList.remove("ytls-tooltip-visible"),tr(s,i,r),requestAnimationFrame(()=>{s.classList.add("ytls-tooltip-visible")})},Qi)}function or(){_t&&(clearTimeout(_t),_t=null),bt&&bt.classList.remove("ytls-tooltip-visible")}function We(e,i){let r=0,s=0,f=l=>{r=l.clientX,s=l.clientY;let S=typeof i=="function"?i():i;S&&nr(S,r,s)},n=l=>{r=l.clientX,s=l.clientY},v=()=>{or()};e.addEventListener("mouseenter",f),e.addEventListener("mousemove",n),e.addEventListener("mouseleave",v),e.__tooltipCleanup=()=>{e.removeEventListener("mouseenter",f),e.removeEventListener("mousemove",n),e.removeEventListener("mouseleave",v)}}var Jo=`
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

`;var Ee=Uint8Array,Ue=Uint16Array,wo=Int32Array,To=new Ee([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Eo=new Ee([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Xo=new Ee([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),ii=function(e,i){for(var r=new Ue(31),s=0;s<31;++s)r[s]=i+=1<<e[s-1];for(var f=new wo(r[30]),s=1;s<30;++s)for(var n=r[s];n<r[s+1];++n)f[n]=n-r[s]<<5|s;return{b:r,r:f}},ri=ii(To,2),ir=ri.b,yo=ri.r;ir[28]=258,yo[258]=28;var ai=ii(Eo,0),Fr=ai.b,Qo=ai.r,vo=new Ue(32768);for(_=0;_<32768;++_)dt=(_&43690)>>1|(_&21845)<<1,dt=(dt&52428)>>2|(dt&13107)<<2,dt=(dt&61680)>>4|(dt&3855)<<4,vo[_]=((dt&65280)>>8|(dt&255)<<8)>>1;var dt,_,pn=(function(e,i,r){for(var s=e.length,f=0,n=new Ue(i);f<s;++f)e[f]&&++n[e[f]-1];var v=new Ue(i);for(f=1;f<i;++f)v[f]=v[f-1]+n[f-1]<<1;var l;if(r){l=new Ue(1<<i);var S=15-i;for(f=0;f<s;++f)if(e[f])for(var E=f<<4|e[f],w=i-e[f],D=v[e[f]-1]++<<w,M=D|(1<<w)-1;D<=M;++D)l[vo[D]>>S]=E}else for(l=new Ue(s),f=0;f<s;++f)e[f]&&(l[f]=vo[v[e[f]-1]++]>>15-e[f]);return l}),Mt=new Ee(288);for(_=0;_<144;++_)Mt[_]=8;var _;for(_=144;_<256;++_)Mt[_]=9;var _;for(_=256;_<280;++_)Mt[_]=7;var _;for(_=280;_<288;++_)Mt[_]=8;var _,Wn=new Ee(32);for(_=0;_<32;++_)Wn[_]=5;var _,rr=pn(Mt,9,0);var ar=pn(Wn,5,0);var si=function(e){return(e+7)/8|0},li=function(e,i,r){return(i==null||i<0)&&(i=0),(r==null||r>e.length)&&(r=e.length),new Ee(e.subarray(i,r))};var sr=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],Yn=function(e,i,r){var s=new Error(i||sr[e]);if(s.code=e,Error.captureStackTrace&&Error.captureStackTrace(s,Yn),!r)throw s;return s};var mt=function(e,i,r){r<<=i&7;var s=i/8|0;e[s]|=r,e[s+1]|=r>>8},mn=function(e,i,r){r<<=i&7;var s=i/8|0;e[s]|=r,e[s+1]|=r>>8,e[s+2]|=r>>16},go=function(e,i){for(var r=[],s=0;s<e.length;++s)e[s]&&r.push({s,f:e[s]});var f=r.length,n=r.slice();if(!f)return{t:ui,l:0};if(f==1){var v=new Ee(r[0].s+1);return v[r[0].s]=1,{t:v,l:1}}r.sort(function(he,Le){return he.f-Le.f}),r.push({s:-1,f:25001});var l=r[0],S=r[1],E=0,w=1,D=2;for(r[0]={s:-1,f:l.f+S.f,l,r:S};w!=f-1;)l=r[r[E].f<r[D].f?E++:D++],S=r[E!=w&&r[E].f<r[D].f?E++:D++],r[w++]={s:-1,f:l.f+S.f,l,r:S};for(var M=n[0].s,s=1;s<f;++s)n[s].s>M&&(M=n[s].s);var $=new Ue(M+1),Z=bo(r[w-1],$,0);if(Z>i){var s=0,W=0,X=Z-i,oe=1<<X;for(n.sort(function(Le,re){return $[re.s]-$[Le.s]||Le.f-re.f});s<f;++s){var G=n[s].s;if($[G]>i)W+=oe-(1<<Z-$[G]),$[G]=i;else break}for(W>>=X;W>0;){var ue=n[s].s;$[ue]<i?W-=1<<i-$[ue]++-1:++s}for(;s>=0&&W;--s){var J=n[s].s;$[J]==i&&(--$[J],++W)}Z=i}return{t:new Ee($),l:Z}},bo=function(e,i,r){return e.s==-1?Math.max(bo(e.l,i,r+1),bo(e.r,i,r+1)):i[e.s]=r},ei=function(e){for(var i=e.length;i&&!e[--i];);for(var r=new Ue(++i),s=0,f=e[0],n=1,v=function(S){r[s++]=S},l=1;l<=i;++l)if(e[l]==f&&l!=i)++n;else{if(!f&&n>2){for(;n>138;n-=138)v(32754);n>2&&(v(n>10?n-11<<5|28690:n-3<<5|12305),n=0)}else if(n>3){for(v(f),--n;n>6;n-=6)v(8304);n>2&&(v(n-3<<5|8208),n=0)}for(;n--;)v(f);n=1,f=e[l]}return{c:r.subarray(0,s),n:i}},fn=function(e,i){for(var r=0,s=0;s<i.length;++s)r+=e[s]*i[s];return r},ci=function(e,i,r){var s=r.length,f=si(i+2);e[f]=s&255,e[f+1]=s>>8,e[f+2]=e[f]^255,e[f+3]=e[f+1]^255;for(var n=0;n<s;++n)e[f+n+4]=r[n];return(f+4+s)*8},ti=function(e,i,r,s,f,n,v,l,S,E,w){mt(i,w++,r),++f[256];for(var D=go(f,15),M=D.t,$=D.l,Z=go(n,15),W=Z.t,X=Z.l,oe=ei(M),G=oe.c,ue=oe.n,J=ei(W),he=J.c,Le=J.n,re=new Ue(19),U=0;U<G.length;++U)++re[G[U]&31];for(var U=0;U<he.length;++U)++re[he[U]&31];for(var H=go(re,7),se=H.t,de=H.l,le=19;le>4&&!se[Xo[le-1]];--le);var $e=E+5<<3,ke=fn(f,Mt)+fn(n,Wn)+v,Ae=fn(f,M)+fn(n,W)+v+14+3*le+fn(re,se)+2*re[16]+3*re[17]+7*re[18];if(S>=0&&$e<=ke&&$e<=Ae)return ci(i,w,e.subarray(S,S+E));var je,me,Be,ot;if(mt(i,w,1+(Ae<ke)),w+=2,Ae<ke){je=pn(M,$,0),me=M,Be=pn(W,X,0),ot=W;var Yt=pn(se,de,0);mt(i,w,ue-257),mt(i,w+5,Le-1),mt(i,w+10,le-4),w+=14;for(var U=0;U<le;++U)mt(i,w+3*U,se[Xo[U]]);w+=3*le;for(var He=[G,he],Re=0;Re<2;++Re)for(var ze=He[Re],U=0;U<ze.length;++U){var q=ze[U]&31;mt(i,w,Yt[q]),w+=se[q],q>15&&(mt(i,w,ze[U]>>5&127),w+=ze[U]>>12)}}else je=rr,me=Mt,Be=ar,ot=Wn;for(var U=0;U<l;++U){var ce=s[U];if(ce>255){var q=ce>>18&31;mn(i,w,je[q+257]),w+=me[q+257],q>7&&(mt(i,w,ce>>23&31),w+=To[q]);var ft=ce&31;mn(i,w,Be[ft]),w+=ot[ft],ft>3&&(mn(i,w,ce>>5&8191),w+=Eo[ft])}else mn(i,w,je[ce]),w+=me[ce]}return mn(i,w,je[256]),w+me[256]},lr=new wo([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),ui=new Ee(0),cr=function(e,i,r,s,f,n){var v=n.z||e.length,l=new Ee(s+v+5*(1+Math.ceil(v/7e3))+f),S=l.subarray(s,l.length-f),E=n.l,w=(n.r||0)&7;if(i){w&&(S[0]=n.r>>3);for(var D=lr[i-1],M=D>>13,$=D&8191,Z=(1<<r)-1,W=n.p||new Ue(32768),X=n.h||new Ue(Z+1),oe=Math.ceil(r/3),G=2*oe,ue=function(it){return(e[it]^e[it+1]<<oe^e[it+2]<<G)&Z},J=new wo(25e3),he=new Ue(288),Le=new Ue(32),re=0,U=0,H=n.i||0,se=0,de=n.w||0,le=0;H+2<v;++H){var $e=ue(H),ke=H&32767,Ae=X[$e];if(W[ke]=Ae,X[$e]=ke,de<=H){var je=v-H;if((re>7e3||se>24576)&&(je>423||!E)){w=ti(e,S,0,J,he,Le,U,se,le,H-le,w),se=re=U=0,le=H;for(var me=0;me<286;++me)he[me]=0;for(var me=0;me<30;++me)Le[me]=0}var Be=2,ot=0,Yt=$,He=ke-Ae&32767;if(je>2&&$e==ue(H-He))for(var Re=Math.min(M,je)-1,ze=Math.min(32767,H),q=Math.min(258,je);He<=ze&&--Yt&&ke!=Ae;){if(e[H+Be]==e[H+Be-He]){for(var ce=0;ce<q&&e[H+ce]==e[H+ce-He];++ce);if(ce>Be){if(Be=ce,ot=He,ce>Re)break;for(var ft=Math.min(He,ce-2),bn=0,me=0;me<ft;++me){var Dt=H-He+me&32767,to=W[Dt],Zt=Dt-to&32767;Zt>bn&&(bn=Zt,Ae=Dt)}}}ke=Ae,Ae=W[ke],He+=ke-Ae&32767}if(ot){J[se++]=268435456|yo[Be]<<18|Qo[ot];var xn=yo[Be]&31,At=Qo[ot]&31;U+=To[xn]+Eo[At],++he[257+xn],++Le[At],de=H+Be,++re}else J[se++]=e[H],++he[e[H]]}}for(H=Math.max(H,de);H<v;++H)J[se++]=e[H],++he[e[H]];w=ti(e,S,E,J,he,Le,U,se,le,H-le,w),E||(n.r=w&7|S[w/8|0]<<3,w-=7,n.h=X,n.p=W,n.i=H,n.w=de)}else{for(var H=n.w||0;H<v+E;H+=65535){var xt=H+65535;xt>=v&&(S[w/8|0]=E,xt=v),w=ci(S,w+1,e.subarray(H,xt))}n.i=v}return li(l,0,s+si(w)+f)},ur=(function(){for(var e=new Int32Array(256),i=0;i<256;++i){for(var r=i,s=9;--s;)r=(r&1&&-306674912)^r>>>1;e[i]=r}return e})(),dr=function(){var e=-1;return{p:function(i){for(var r=e,s=0;s<i.length;++s)r=ur[r&255^i[s]]^r>>>8;e=r},d:function(){return~e}}};var mr=function(e,i,r,s,f){if(!f&&(f={l:1},i.dictionary)){var n=i.dictionary.subarray(-32768),v=new Ee(n.length+e.length);v.set(n),v.set(e,n.length),e=v,f.w=n.length}return cr(e,i.level==null?6:i.level,i.mem==null?f.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+i.mem,r,s,f)},di=function(e,i){var r={};for(var s in e)r[s]=e[s];for(var s in i)r[s]=i[s];return r};var Te=function(e,i,r){for(;r;++i)e[i]=r,r>>>=8};function fr(e,i){return mr(e,i||{},0,0)}var mi=function(e,i,r,s){for(var f in e){var n=e[f],v=i+f,l=s;Array.isArray(n)&&(l=di(s,n[1]),n=n[0]),n instanceof Ee?r[v]=[n,l]:(r[v+="/"]=[new Ee(0),l],mi(n,v,r,s))}},ni=typeof TextEncoder<"u"&&new TextEncoder,pr=typeof TextDecoder<"u"&&new TextDecoder,hr=0;try{pr.decode(ui,{stream:!0}),hr=1}catch{}function Kn(e,i){if(i){for(var r=new Ee(e.length),s=0;s<e.length;++s)r[s]=e.charCodeAt(s);return r}if(ni)return ni.encode(e);for(var f=e.length,n=new Ee(e.length+(e.length>>1)),v=0,l=function(w){n[v++]=w},s=0;s<f;++s){if(v+5>n.length){var S=new Ee(v+8+(f-s<<1));S.set(n),n=S}var E=e.charCodeAt(s);E<128||i?l(E):E<2048?(l(192|E>>6),l(128|E&63)):E>55295&&E<57344?(E=65536+(E&1047552)|e.charCodeAt(++s)&1023,l(240|E>>18),l(128|E>>12&63),l(128|E>>6&63),l(128|E&63)):(l(224|E>>12),l(128|E>>6&63),l(128|E&63))}return li(n,0,v)}var xo=function(e){var i=0;if(e)for(var r in e){var s=e[r].length;s>65535&&Yn(9),i+=s+4}return i},oi=function(e,i,r,s,f,n,v,l){var S=s.length,E=r.extra,w=l&&l.length,D=xo(E);Te(e,i,v!=null?33639248:67324752),i+=4,v!=null&&(e[i++]=20,e[i++]=r.os),e[i]=20,i+=2,e[i++]=r.flag<<1|(n<0&&8),e[i++]=f&&8,e[i++]=r.compression&255,e[i++]=r.compression>>8;var M=new Date(r.mtime==null?Date.now():r.mtime),$=M.getFullYear()-1980;if(($<0||$>119)&&Yn(10),Te(e,i,$<<25|M.getMonth()+1<<21|M.getDate()<<16|M.getHours()<<11|M.getMinutes()<<5|M.getSeconds()>>1),i+=4,n!=-1&&(Te(e,i,r.crc),Te(e,i+4,n<0?-n-2:n),Te(e,i+8,r.size)),Te(e,i+12,S),Te(e,i+14,D),i+=16,v!=null&&(Te(e,i,w),Te(e,i+6,r.attrs),Te(e,i+10,v),i+=14),e.set(s,i),i+=S,D)for(var Z in E){var W=E[Z],X=W.length;Te(e,i,+Z),Te(e,i+2,X),e.set(W,i+4),i+=4+X}return w&&(e.set(l,i),i+=w),i},gr=function(e,i,r,s,f){Te(e,i,101010256),Te(e,i+8,r),Te(e,i+10,r),Te(e,i+12,s),Te(e,i+16,f)};function fi(e,i){i||(i={});var r={},s=[];mi(e,"",r,i);var f=0,n=0;for(var v in r){var l=r[v],S=l[0],E=l[1],w=E.level==0?0:8,D=Kn(v),M=D.length,$=E.comment,Z=$&&Kn($),W=Z&&Z.length,X=xo(E.extra);M>65535&&Yn(11);var oe=w?fr(S,E):S,G=oe.length,ue=dr();ue.p(S),s.push(di(E,{size:S.length,crc:ue.d(),c:oe,f:D,m:Z,u:M!=v.length||Z&&$.length!=W,o:f,compression:w})),f+=30+M+X+G,n+=76+2*(M+X)+(W||0)+G}for(var J=new Ee(n+22),he=f,Le=n-f,re=0;re<s.length;++re){var D=s[re];oi(J,D.o,D,D.f,D.u,D.c.length);var U=30+D.f.length+xo(D.extra);J.set(D.c,D.o+U),oi(J,f,D,D.f,D.u,D.c.length,D.o,D.m),f+=16+U+(D.m?D.m.length:0)}return gr(J,f,s.length,Le,he),J}var O={isSignedIn:!1,accessToken:null,userName:null,email:null},nt=!0,qe=30,Ye=null,jt=!1,qt=0,Ke=null,ko=null,xe=null,j=null,Zn=null;function yi(e){ko=e}function vi(e){xe=e}function bi(e){j=e}function So(e){Zn=e}var pi=!1;function xi(){if(!pi)try{let e=document.createElement("style");e.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(e),pi=!0}catch{}}var wi=null,hn=null,gn=null;function Lo(e){wi=e}function Xn(e){hn=e}function Qn(e){gn=e}var hi="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",yr="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",vr="https://www.youtube.com/",br=30*1e3,xr=1800*1e3,gi=5,Jn=null,_e=null;async function Io(){try{let e=await gn("googleAuthState");e&&typeof e=="object"&&(O={...O,...e},vn(),O.isSignedIn&&O.accessToken&&await Kt(!0))}catch(e){c("Failed to load Google auth state:",e,"error")}}async function eo(){try{await hn("googleAuthState",O)}catch(e){c("Failed to save Google auth state:",e,"error")}}function vn(){ko&&(ko.style.display="none")}function Fe(e,i){if(j){if(j.style.fontWeight="bold",e==="authenticating"){for(xi(),j.style.color="#ffa500";j.firstChild;)j.removeChild(j.firstChild);let r=document.createElement("span");r.className="tk-auth-spinner";let s=document.createTextNode(` ${i||"Authorizing with Google\u2026"}`);j.appendChild(r),j.appendChild(s);return}if(e==="error"){j.textContent=`\u274C ${i||"Authorization failed"}`,j.style.color="#ff4d4f",Wt();return}O.isSignedIn?(j.textContent="\u2705 Signed in",j.style.color="#52c41a",j.removeAttribute("title"),O.userName?(j.onmouseenter=()=>{j.textContent=`\u2705 Signed in as ${O.userName}`},j.onmouseleave=()=>{j.textContent="\u2705 Signed in"}):(j.onmouseenter=null,j.onmouseleave=null)):(j.textContent="\u274C Not signed in",j.style.color="#ff4d4f",j.removeAttribute("title"),j.onmouseenter=null,j.onmouseleave=null),Wt()}}function wr(){j&&(xi(),j.classList.remove("tk-auth-blink"),j.offsetWidth,j.classList.add("tk-auth-blink"),setTimeout(()=>{j.classList.remove("tk-auth-blink")},1200))}function Tr(e){return new Promise((i,r)=>{if(!e){c&&c("OAuth monitor: popup is null",null,"error"),r(new Error("Failed to open popup"));return}c&&c("OAuth monitor: starting to monitor popup for token");let s=Date.now(),f=300*1e3,n="timekeeper_oauth",v=null,l=null,S=null,E=()=>{if(v){try{v.close()}catch{}v=null}l&&(clearInterval(l),l=null),S&&(clearInterval(S),S=null)};try{v=new BroadcastChannel(n),c&&c("OAuth monitor: BroadcastChannel created successfully"),v.onmessage=M=>{if(c&&c("OAuth monitor: received BroadcastChannel message",M.data),M.data?.type==="timekeeper_oauth_token"&&M.data?.token){c&&c("OAuth monitor: token received via BroadcastChannel"),E();try{e.close()}catch{}i(M.data.token)}else if(M.data?.type==="timekeeper_oauth_error"){c&&c("OAuth monitor: error received via BroadcastChannel",M.data.error,"error"),E();try{e.close()}catch{}r(new Error(M.data.error||"OAuth failed"))}}}catch(M){c&&c("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",M)}c&&c("OAuth monitor: setting up IndexedDB polling");let w=Date.now();l=setInterval(async()=>{try{let M=indexedDB.open("ytls-timestamps-db",3);M.onsuccess=()=>{let $=M.result,X=$.transaction("settings","readonly").objectStore("settings").get("oauth_message");X.onsuccess=()=>{let oe=X.result;if(oe&&oe.value){let G=oe.value;if(G.timestamp&&G.timestamp>w){if(c&&c("OAuth monitor: received IndexedDB message",G),G.type==="timekeeper_oauth_token"&&G.token){c&&c("OAuth monitor: token received via IndexedDB"),E();try{e.close()}catch{}$.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),i(G.token)}else if(G.type==="timekeeper_oauth_error"){c&&c("OAuth monitor: error received via IndexedDB",G.error,"error"),E();try{e.close()}catch{}$.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),r(new Error(G.error||"OAuth failed"))}w=G.timestamp}}$.close()}}}catch(M){c&&c("OAuth monitor: IndexedDB polling error",M,"error")}},500),S=setInterval(()=>{if(Date.now()-s>f){c&&c("OAuth monitor: popup timed out after 5 minutes",null,"error"),E();try{e.close()}catch{}r(new Error("OAuth popup timed out"));return}},1e3)})}async function Ti(){if(!hi){Fe("error","Google Client ID not configured");return}try{c&&c("OAuth signin: starting OAuth flow"),Fe("authenticating","Opening authentication window...");let e=new URL("https://accounts.google.com/o/oauth2/v2/auth");e.searchParams.set("client_id",hi),e.searchParams.set("redirect_uri",vr),e.searchParams.set("response_type","token"),e.searchParams.set("scope",yr),e.searchParams.set("include_granted_scopes","true"),e.searchParams.set("state","timekeeper_auth"),c&&c("OAuth signin: opening popup");let i=window.open(e.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!i){c&&c("OAuth signin: popup blocked by browser",null,"error"),Fe("error","Popup blocked. Please enable popups for YouTube.");return}c&&c("OAuth signin: popup opened successfully"),Fe("authenticating","Waiting for authentication...");try{let r=await Tr(i),s=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${r}`}});if(s.ok){let f=await s.json();O.accessToken=r,O.isSignedIn=!0,O.userName=f.name,O.email=f.email,await eo(),vn(),Fe(),Ze(),await Kt(),c?c(`Successfully authenticated as ${f.name}`):console.log(`[Timekeeper] Successfully authenticated as ${f.name}`)}else throw new Error("Failed to fetch user info")}catch(r){let s=r instanceof Error?r.message:"Authentication failed";c?c("OAuth failed:",r,"error"):console.error("[Timekeeper] OAuth failed:",r),Fe("error",s);return}}catch(e){let i=e instanceof Error?e.message:"Sign in failed";c?c("Failed to sign in to Google:",e,"error"):console.error("[Timekeeper] Failed to sign in to Google:",e),Fe("error",`Failed to sign in: ${i}`)}}async function Ei(){if(!window.opener||window.opener===window)return!1;c&&c("OAuth popup: detected popup window, checking for OAuth response");let e=window.location.hash;if(!e||e.length<=1)return c&&c("OAuth popup: no hash params found"),!1;let i=e.startsWith("#")?e.substring(1):e,r=new URLSearchParams(i),s=r.get("state");if(c&&c("OAuth popup: hash params found, state="+s),s!=="timekeeper_auth")return c&&c("OAuth popup: not our OAuth flow (wrong state)"),!1;let f=r.get("error"),n=r.get("access_token"),v="timekeeper_oauth";if(f){try{let l=new BroadcastChannel(v);l.postMessage({type:"timekeeper_oauth_error",error:r.get("error_description")||f}),l.close()}catch{let S={type:"timekeeper_oauth_error",error:r.get("error_description")||f,timestamp:Date.now()},E=indexedDB.open("ytls-timestamps-db",3);E.onsuccess=()=>{let w=E.result;w.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:S}),w.close()}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(n){c&&c("OAuth popup: access token found, broadcasting to opener");try{let l=new BroadcastChannel(v);l.postMessage({type:"timekeeper_oauth_token",token:n}),l.close(),c&&c("OAuth popup: token broadcast via BroadcastChannel")}catch(l){c&&c("OAuth popup: BroadcastChannel failed, using IndexedDB",l);let S={type:"timekeeper_oauth_token",token:n,timestamp:Date.now()},E=indexedDB.open("ytls-timestamps-db",3);E.onsuccess=()=>{let w=E.result;w.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:S}),w.close()},c&&c("OAuth popup: token broadcast via IndexedDB")}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function ki(){O={isSignedIn:!1,accessToken:null,userName:null,email:null},await eo(),vn(),Fe(),Ze()}async function Si(){if(!O.isSignedIn||!O.accessToken)return!1;try{let e=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${O.accessToken}`}});return e.status===401?(await Li({silent:!0}),!1):e.ok}catch(e){return c("Failed to verify auth state:",e,"error"),!1}}async function Er(e){let i={Authorization:`Bearer ${e}`},s=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,f=await fetch(s,{headers:i});if(f.status===401)throw new Error("unauthorized");if(!f.ok)throw new Error("drive search failed");let n=await f.json();if(Array.isArray(n.files)&&n.files.length>0)return n.files[0].id;let v=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...i,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(v.status===401)throw new Error("unauthorized");if(!v.ok)throw new Error("drive folder create failed");return(await v.json()).id}async function kr(e,i,r){let s=`name='${e}' and '${i}' in parents and trashed=false`,f=encodeURIComponent(s),n=await fetch(`https://www.googleapis.com/drive/v3/files?q=${f}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${r}`}});if(n.status===401)throw new Error("unauthorized");if(!n.ok)return null;let v=await n.json();return v.files&&v.files.length>0?v.files[0].id:null}function Sr(e,i){let r=Kn(e),s=i.replace(/\\/g,"/").replace(/^\/+/,"");return s.endsWith(".json")||(s+=".json"),fi({[s]:[r,{level:6,mtime:new Date,os:0}]})}async function Lr(e,i,r,s){let f=e.replace(/\.json$/,".zip"),n=await kr(f,r,s),v=new TextEncoder().encode(i).length,l=Sr(i,e),S=l.length;c(`Compressing data: ${v} bytes -> ${S} bytes (${Math.round(100-S/v*100)}% reduction)`);let E="-------314159265358979",w=`\r
--${E}\r
`,D=`\r
--${E}--`,M=n?{name:f,mimeType:"application/zip"}:{name:f,mimeType:"application/zip",parents:[r]},$=8192,Z="";for(let J=0;J<l.length;J+=$){let he=l.subarray(J,Math.min(J+$,l.length));Z+=String.fromCharCode.apply(null,Array.from(he))}let W=btoa(Z),X=w+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify(M)+w+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+W+D,oe,G;n?(oe=`https://www.googleapis.com/upload/drive/v3/files/${n}?uploadType=multipart&fields=id,name`,G="PATCH"):(oe="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",G="POST");let ue=await fetch(oe,{method:G,headers:{Authorization:`Bearer ${s}`,"Content-Type":`multipart/related; boundary=${E}`},body:X});if(ue.status===401)throw new Error("unauthorized");if(!ue.ok)throw new Error("drive upload failed")}async function Li(e){c("Auth expired, clearing token",null,"warn"),O.isSignedIn=!1,O.accessToken=null,await eo(),Fe("error","Authorization expired. Please sign in again."),Ze()}async function Ir(e){if(!O.isSignedIn||!O.accessToken){e?.silent||Fe("error","Please sign in to Google Drive first");return}try{let{json:i,filename:r,totalVideos:s,totalTimestamps:f}=await wi();if(f===0){e?.silent||c("Skipping export: no timestamps to back up");return}let n=await Er(O.accessToken);await Lr(r,i,n,O.accessToken),c(`Exported to Google Drive (${r}) with ${s} videos / ${f} timestamps.`)}catch(i){throw i.message==="unauthorized"?(await Li({silent:e?.silent}),i):(c("Drive export failed:",i,"error"),e?.silent||Fe("error","Failed to export to Google Drive."),i)}}async function Ii(){try{let e=await gn("autoBackupEnabled"),i=await gn("autoBackupIntervalMinutes"),r=await gn("lastAutoBackupAt");typeof e=="boolean"&&(nt=e),typeof i=="number"&&i>0&&(qe=i),typeof r=="number"&&r>0&&(Ye=r)}catch(e){c("Failed to load auto backup settings:",e,"error")}}async function Co(){try{await hn("autoBackupEnabled",nt),await hn("autoBackupIntervalMinutes",qe),await hn("lastAutoBackupAt",Ye??0)}catch(e){c("Failed to save auto backup settings:",e,"error")}}function Cr(){Jn&&(clearInterval(Jn),Jn=null),_e&&(clearTimeout(_e),_e=null)}function Vt(e){try{let i=new Date(e),r=new Date,s=i.toDateString()===r.toDateString(),f=i.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return s?f:`${i.toLocaleDateString()} ${f}`}catch{return""}}function Ze(){if(!xe)return;let e="",i="";if(!nt)e="\u{1F501} Backup: Off",xe.onmouseenter=null,xe.onmouseleave=null;else if(jt)e="\u{1F501} Backing up\u2026",xe.onmouseenter=null,xe.onmouseleave=null;else if(Ke&&Ke>0)e=`\u26A0\uFE0F Retry in ${Math.ceil(Ke/6e4)}m`,xe.onmouseenter=null,xe.onmouseleave=null;else if(Ye){e=`\u{1F5C4}\uFE0F Last backup: ${Vt(Ye)}`;let r=Ye+Math.max(1,qe)*60*1e3;i=`\u{1F5C4}\uFE0F Next backup: ${Vt(r)}`,xe.onmouseenter=()=>{xe.textContent=i},xe.onmouseleave=()=>{xe.textContent=e}}else{e="\u{1F5C4}\uFE0F Last backup: never";let r=Date.now()+Math.max(1,qe)*60*1e3;i=`\u{1F5C4}\uFE0F Next backup: ${Vt(r)}`,xe.onmouseenter=()=>{xe.textContent=i},xe.onmouseleave=()=>{xe.textContent=e}}xe.textContent=e,xe.style.display=e?"inline":"none",Wt()}function Wt(){if(!Zn)return;let e="";nt?jt?e="#4285f4":Ke&&Ke>0?e="#ffa500":O.isSignedIn&&Ye?e="#52c41a":O.isSignedIn?e="#ffa500":e="#ff4d4f":e="#ff4d4f",Zn.style.backgroundColor=e,We(Zn,()=>{let i="";if(!nt)i="Auto backup is disabled";else if(jt)i="Backup in progress";else if(Ke&&Ke>0)i=`Retrying backup in ${Math.ceil(Ke/6e4)}m`;else if(O.isSignedIn&&Ye){let r=Ye+Math.max(1,qe)*60*1e3,s=Vt(r);i=`Last backup: ${Vt(Ye)}
Next backup: ${s}`}else if(O.isSignedIn){let r=Date.now()+Math.max(1,qe)*60*1e3;i=`No backup yet
Next backup: ${Vt(r)}`}else i="Not signed in to Google Drive";return i})}async function yn(e=!0){if(!O.isSignedIn||!O.accessToken){e||wr();return}if(_e){c("Auto backup: backoff in progress, skipping scheduled run");return}if(!jt){jt=!0,Ze();try{await Ir({silent:e}),Ye=Date.now(),qt=0,Ke=null,_e&&(clearTimeout(_e),_e=null),await Co()}catch(i){if(c("Auto backup failed:",i,"error"),i.message==="unauthorized")c("Auth error detected, clearing token and stopping retries",null,"warn"),O.isSignedIn=!1,O.accessToken=null,await eo(),Fe("error","Authorization expired. Please sign in again."),Ze(),qt=0,Ke=null,_e&&(clearTimeout(_e),_e=null);else if(qt<gi){qt+=1;let f=Math.min(br*Math.pow(2,qt-1),xr);Ke=f,_e&&clearTimeout(_e),_e=setTimeout(()=>{yn(!0)},f),c(`Scheduling backup retry ${qt}/${gi} in ${Math.round(f/1e3)}s`),Ze()}else Ke=null}finally{jt=!1,Ze()}}}async function Kt(e=!1){if(Cr(),!!nt&&!(!O.isSignedIn||!O.accessToken)){if(Jn=setInterval(()=>{yn(!0)},Math.max(1,qe)*60*1e3),!e){let i=Date.now(),r=Math.max(1,qe)*60*1e3;(!Ye||i-Ye>=r)&&yn(!0)}Ze()}}async function Ci(){nt=!nt,await Co(),await Kt(),Ze()}async function Mi(){let e=prompt("Set Auto Backup interval (minutes):",String(qe));if(e===null)return;let i=Math.floor(Number(e));if(!Number.isFinite(i)||i<5||i>1440){alert("Please enter a number between 5 and 1440 minutes.");return}qe=i,await Co(),await Kt(),Ze()}var Mo=window.location.hash;if(Mo&&Mo.length>1){let e=new URLSearchParams(Mo.substring(1));if(e.get("state")==="timekeeper_auth"){let r=e.get("access_token");if(r){console.log("[Timekeeper] Auth token detected in URL, broadcasting token"),console.log("[Timekeeper] Token length:",r.length,"characters");try{let s=new BroadcastChannel("timekeeper_oauth"),f={type:"timekeeper_oauth_token",token:r};console.log("[Timekeeper] Sending auth message via BroadcastChannel:",{type:f.type,tokenLength:r.length}),s.postMessage(f),s.close(),console.log("[Timekeeper] Token broadcast via BroadcastChannel completed")}catch(s){console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",s);let f={type:"timekeeper_oauth_token",token:r,timestamp:Date.now()},n=indexedDB.open("ytls-timestamps-db",3);n.onsuccess=()=>{let v=n.result,l=v.transaction("settings","readwrite");l.objectStore("settings").put({key:"oauth_message",value:f}),l.oncomplete=()=>{console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",f.timestamp),v.close()}}}if(history.replaceState){let s=window.location.pathname+window.location.search;history.replaceState(null,"",s)}throw console.log("[Timekeeper] Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}(async function(){"use strict";if(window.top!==window.self)return;function e(t){return GM.getValue(`timekeeper_${t}`,void 0)}function i(t,o){return GM.setValue(`timekeeper_${t}`,JSON.stringify(o))}if(Qn(e),Xn(i),await Ei()){c("OAuth popup detected, broadcasting token and closing");return}await Io();let s=["/watch","/live"];function f(t=window.location.href){try{let o=new URL(t);return o.origin!=="https://www.youtube.com"?!1:s.some(a=>o.pathname===a||o.pathname.startsWith(`${a}/`))}catch(o){return c("Timekeeper failed to parse URL for support check:",o,"error"),!1}}let n=null,v=null,l=null,S=null,E=null,w=null,D=null,M=null,$=250,Z=null,W=!1;function X(){return n?n.getBoundingClientRect():null}function oe(t,o,a){t&&(Pe={x:Math.round(typeof o=="number"?o:t.left),y:Math.round(typeof a=="number"?a:t.top),width:Math.round(t.width),height:Math.round(t.height)})}function G(t=!0){if(!n)return;Pt();let o=X();o&&(o.width||o.height)&&(oe(o),t&&(Nn("windowPosition",Pe),Jt({type:"window_position_updated",position:Pe,timestamp:Date.now()})))}function ue(){if(!n||!v||!S||!l)return;let t=40,o=ee();if(o.length>0)t=o[0].offsetHeight;else{let a=document.createElement("li");a.style.visibility="hidden",a.style.position="absolute",a.textContent="00:00 Example",l.appendChild(a),t=a.offsetHeight,l.removeChild(a)}$=v.offsetHeight+S.offsetHeight+t,n.style.minHeight=$+"px"}function J(){requestAnimationFrame(()=>{typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),ue(),G(!0)})}function he(t=450){fe&&(clearTimeout(fe),fe=null),fe=setTimeout(()=>{H(),J(),fe=null},t)}function Le(){fe&&(clearTimeout(fe),fe=null)}function re(){l&&(l.style.visibility="hidden",c("Hiding timestamps during show animation")),J(),he()}function U(){H(),Le(),Je&&(clearTimeout(Je),Je=null),Je=setTimeout(()=>{n&&(n.style.display="none",Uo(),Je=null)},400)}function H(){if(!l){Oe&&(Oe(),Oe=null,rt=null,pt=null);return}if(!pt){l.style.visibility==="hidden"&&(l.style.visibility="",c("Restoring timestamp visibility (no deferred fragment)")),Oe&&(Oe(),Oe=null,rt=null);return}c("Appending deferred timestamps after animation"),l.appendChild(pt),pt=null,l.style.visibility==="hidden"&&(l.style.visibility="",c("Restoring timestamp visibility after append")),Oe&&(Oe(),Oe=null,rt=null),et(),Ie(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea());let t=q(),o=t?Math.floor(t.getCurrentTime()):Et();Number.isFinite(o)&&Fn(o,!1)}let se=null,de=!1,le="ytls-timestamp-pending-delete",$e="ytls-timestamp-highlight",ke="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_64px_Indexed.png",Ae="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_Eyebrow_64px_Indexed.png";function je(){let t=o=>{let a=new Image;a.src=o};t(ke),t(Ae)}je();async function me(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(t=>setTimeout(t,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(t=>setTimeout(t,100));await new Promise(t=>setTimeout(t,200))}let Be=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],ot=5e3,Yt=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function He(t){return Yt.has(t)}function Re(){return document.querySelector("video")}let ze=null;function q(){if(ze&&document.contains(ze))return ze;let t=document.getElementById("movie_player");return t&&document.contains(t)?t:null}function ce(t){return Be.every(o=>typeof t?.[o]=="function"?!0:He(o)?!!Re():!1)}function ft(t){return Be.filter(o=>typeof t?.[o]=="function"?!1:He(o)?!Re():!0)}async function bn(t=ot){let o=Date.now();for(;Date.now()-o<t;){let u=q();if(ce(u))return u;await new Promise(y=>setTimeout(y,100))}let a=q();return ce(a),a}let Dt="timestampOffsetSeconds",to=-5,Zt="shiftClickTimeSkipSeconds",xn=10,At=300,xt=300,it=new BroadcastChannel("ytls_timestamp_channel");function Jt(t){try{it.postMessage(t)}catch(o){c("BroadcastChannel error, reopening:",o,"warn");try{it=new BroadcastChannel("ytls_timestamp_channel"),it.onmessage=Do,it.postMessage(t)}catch(a){c("Failed to reopen BroadcastChannel:",a,"error")}}}function Do(t){if(c("Received message from another tab:",t.data),!(!f()||!l||!n)&&t.data){if(t.data.type==="timestamps_updated"&&t.data.videoId===ge)c("Debouncing timestamp load due to external update for video:",t.data.videoId),clearTimeout(Qt),Qt=setTimeout(()=>{c("Reloading timestamps due to external update for video:",t.data.videoId),Oo()},500);else if(t.data.type==="window_position_updated"&&n){let o=t.data.position;if(o&&typeof o.x=="number"&&typeof o.y=="number"){n.style.left=`${o.x}px`,n.style.top=`${o.y}px`,n.style.right="auto",n.style.bottom="auto",typeof o.width=="number"&&o.width>0&&(n.style.width=`${o.width}px`),typeof o.height=="number"&&o.height>0&&(n.style.height=`${o.height}px`);let a=n.getBoundingClientRect();Pe={x:Math.round(o.x),y:Math.round(o.y),width:Math.round(a.width),height:Math.round(a.height)};let u=document.documentElement.clientWidth,y=document.documentElement.clientHeight;(a.left<0||a.top<0||a.right>u||a.bottom>y)&&Pt()}}}}it.onmessage=Do;let Bt=await GM.getValue(Dt);(typeof Bt!="number"||Number.isNaN(Bt))&&(Bt=to,await GM.setValue(Dt,Bt));let Xt=await GM.getValue(Zt);(typeof Xt!="number"||Number.isNaN(Xt))&&(Xt=xn,await GM.setValue(Zt,Xt));let Qt=null,wt=new Map,wn=!1,z=null,Tn=null,ge=null,Je=null,fe=null,pt=null,rt=null,Oe=null,ht=null,En=!1,Pe=null,no=!1,kn=null,Sn=null,Ln=null,In=null,Cn=null,Mn=null,Dn=null,en=null,tn=null,nn=null,Xe=null,Qe=null,Ao=0,on=!1,Tt=null,rn=null;function ee(){return l?Array.from(l.querySelectorAll("li")).filter(t=>!!t.querySelector("a[data-time]")):[]}function oo(){return ee().map(t=>{let o=t.querySelector("a[data-time]"),a=o?.dataset.time;if(!o||!a)return null;let u=Number.parseInt(a,10);if(!Number.isFinite(u))return null;let g=t.querySelector("input")?.value??"",d=t.dataset.guid??crypto.randomUUID();return t.dataset.guid||(t.dataset.guid=d),{start:u,comment:g,guid:d}}).filter(zo)}function Et(){if(rn!==null)return rn;let t=ee();return rn=t.length>0?Math.max(...t.map(o=>{let a=o.querySelector("a[data-time]")?.getAttribute("data-time");return a?Number.parseInt(a,10):0})):0,rn}function An(){rn=null}function Di(t){let o=t.querySelector(".time-diff");return o?(o.textContent?.trim()||"").startsWith("-"):!1}function Ai(t,o){return t?o?"\u2514\u2500 ":"\u251C\u2500 ":""}function an(t){return t.startsWith("\u251C\u2500 ")||t.startsWith("\u2514\u2500 ")?1:0}function Bo(t){return t.replace(/^[├└]─\s/,"")}function Bi(t){let o=ee();if(t>=o.length-1)return"\u2514\u2500 ";let a=o[t+1].querySelector("input");return a&&an(a.value)===1?"\u251C\u2500 ":"\u2514\u2500 "}function et(){if(!l)return;let t=ee(),o=!0,a=0,u=t.length;for(;o&&a<u;)o=!1,a++,t.forEach((y,g)=>{let d=y.querySelector("input");if(!d||!(an(d.value)===1))return;let T=!1;if(g<t.length-1){let R=t[g+1].querySelector("input");R&&(T=!(an(R.value)===1))}else T=!0;let k=Bo(d.value),I=`${Ai(!0,T)}${k}`;d.value!==I&&(d.value=I,o=!0)})}function kt(){if(l){for(;l.firstChild;)l.removeChild(l.firstChild);pt&&(pt=null),Oe&&(Oe(),Oe=null,rt=null)}}function sn(){if(!l||de||pt)return;Array.from(l.children).some(o=>!o.classList.contains("ytls-placeholder")&&!o.classList.contains("ytls-error-message"))||io("No timestamps for this video")}function io(t){if(!l)return;kt();let o=document.createElement("li");o.className="ytls-placeholder",o.textContent=t,l.appendChild(o),l.style.overflowY="hidden"}function ro(){if(!l)return;let t=l.querySelector(".ytls-placeholder");t&&t.remove(),l.style.overflowY=""}function ao(t){if(!(!n||!l)){if(de=t,t)n.style.display="",n.classList.remove("ytls-fade-out"),n.classList.add("ytls-fade-in"),io("Loading timestamps...");else if(ro(),n.style.display="",n.classList.remove("ytls-fade-out"),n.classList.add("ytls-fade-in"),E){let o=q();if(o){let a=o.getCurrentTime(),u=Number.isFinite(a)?Math.max(0,Math.floor(a)):Math.max(0,Et()),y=Math.floor(u/3600),g=Math.floor(u/60)%60,d=u%60,{isLive:h}=o.getVideoData()||{isLive:!1},T=l?ee().map(L=>{let I=L.querySelector("a[data-time]");return I?parseFloat(I.getAttribute("data-time")??"0"):0}):[],k="";if(T.length>0)if(h){let L=Math.max(1,u/60),I=T.filter(R=>R<=u);if(I.length>0){let R=(I.length/L).toFixed(2);parseFloat(R)>0&&(k=` (${R}/min)`)}}else{let L=o.getDuration(),I=Number.isFinite(L)&&L>0?L:0,R=Math.max(1,I/60),ne=(T.length/R).toFixed(1);parseFloat(ne)>0&&(k=` (${ne}/min)`)}E.textContent=`\u23F3${y?y+":"+String(g).padStart(2,"0"):g}:${String(d).padStart(2,"0")}${k}`}}!de&&l&&!l.querySelector(".ytls-error-message")&&sn(),at()}}function zo(t){return!!t&&Number.isFinite(t.start)&&typeof t.comment=="string"&&typeof t.guid=="string"}function Bn(t,o){t.textContent=vt(o),t.dataset.time=String(o),t.href=Yo(o,window.location.href)}let zn=null,Pn=null,St=!1;function zi(t){if(!t||typeof t.getVideoData!="function"||!t.getVideoData()?.isLive)return!1;if(typeof t.getProgressState=="function"){let a=t.getProgressState(),u=Number(a?.seekableEnd??a?.liveHead??a?.head??a?.duration),y=Number(a?.current??t.getCurrentTime?.());if(Number.isFinite(u)&&Number.isFinite(y))return u-y>2}return!1}function Fn(t,o){if(!Number.isFinite(t))return;let a=$n(t);ln(a,o)}function $n(t){if(!Number.isFinite(t))return null;let o=ee();if(o.length===0)return null;let a=null,u=-1/0;for(let y of o){let d=y.querySelector("a[data-time]")?.dataset.time;if(!d)continue;let h=Number.parseInt(d,10);Number.isFinite(h)&&h<=t&&h>u&&(u=h,a=y)}return a}function ln(t,o=!1){if(!t)return;ee().forEach(u=>{u.classList.contains(le)||u.classList.remove($e)}),t.classList.contains(le)||(t.classList.add($e),o&&!wn&&t.scrollIntoView({behavior:"smooth",block:"center"}))}function Pi(t){if(!l||l.querySelector(".ytls-error-message")||!Number.isFinite(t)||t===0)return!1;let o=ee();if(o.length===0)return!1;let a=!1;return o.forEach(u=>{let y=u.querySelector("a[data-time]"),g=y?.dataset.time;if(!y||!g)return;let d=Number.parseInt(g,10);if(!Number.isFinite(d))return;let h=Math.max(0,d+t);h!==d&&(Bn(y,h),a=!0)}),a?(un(),et(),Ie(),Rn(ge),Tt=null,!0):!1}function Po(t,o={}){if(!Number.isFinite(t)||t===0)return!1;if(!Pi(t)){if(o.alertOnNoChange){let d=o.failureMessage??"Offset did not change any timestamps.";alert(d)}return!1}let u=o.logLabel??"bulk offset";c(`Timestamps changed: Offset all timestamps by ${t>0?"+":""}${t} seconds (${u})`);let y=q(),g=y?Math.floor(y.getCurrentTime()):0;if(Number.isFinite(g)){let d=$n(g);ln(d,!1)}return!0}function Fo(t){if(!l||de)return;let o=t.target instanceof HTMLElement?t.target:null;if(o)if(o.dataset.time){t.preventDefault();let a=Number(o.dataset.time);if(Number.isFinite(a)){St=!0;let y=q();y&&y.seekTo(a),setTimeout(()=>{St=!1},500)}let u=o.closest("li");u&&(ee().forEach(y=>{y.classList.contains(le)||y.classList.remove($e)}),u.classList.contains(le)||(u.classList.add($e),u.scrollIntoView({behavior:"smooth",block:"center"})))}else if(o.dataset.increment){t.preventDefault();let u=o.parentElement?.querySelector("a[data-time]");if(!u||!u.dataset.time)return;let y=parseInt(u.dataset.time,10),g=parseInt(o.dataset.increment,10);if("shiftKey"in t&&t.shiftKey&&(g*=Xt),"altKey"in t?t.altKey:!1){Po(g,{logLabel:"Alt adjust"});return}let T=Math.max(0,y+g);c(`Timestamps changed: Timestamp time incremented from ${y} to ${T}`),Bn(u,T),An();let k=o.closest("li");if(Pn=T,zn&&clearTimeout(zn),St=!0,zn=setTimeout(()=>{if(Pn!==null){let L=q();L&&L.seekTo(Pn)}zn=null,Pn=null,setTimeout(()=>{St=!1},500)},500),un(),et(),Ie(),k){let L=k.querySelector("input"),I=k.dataset.guid;L&&I&&(zt(ge,I,T,L.value),Tt=I)}}else o.dataset.action==="clear"&&(t.preventDefault(),c("Timestamps changed: All timestamps cleared from UI"),l.textContent="",An(),Ie(),Hn(),Rn(ge,{allowEmpty:!0}),Tt=null,sn())}function cn(t,o="",a=!1,u=null,y=!0){if(!l)return null;let g=Math.max(0,t),d=u??crypto.randomUUID(),h=document.createElement("li"),T=document.createElement("div"),k=document.createElement("span"),L=document.createElement("span"),I=document.createElement("span"),R=document.createElement("a"),ne=document.createElement("span"),F=document.createElement("input"),te=document.createElement("button");h.dataset.guid=d,T.className="time-row";let ye=document.createElement("div");ye.style.cssText="position:absolute;left:0;top:0;width:20px;height:100%;display:flex;align-items:center;justify-content:center;cursor:pointer;",We(ye,"Click to toggle indent");let we=document.createElement("span");we.style.cssText="color:#999;font-size:12px;pointer-events:none;display:none;";let Se=()=>{let Q=an(F.value);we.textContent=Q===1?"\u25C0":"\u25B6"},gt=Q=>{Q.stopPropagation();let K=an(F.value),pe=Bo(F.value),ae=K===0?1:0,ie="";if(ae===1){let tt=ee().indexOf(h);ie=Bi(tt)}F.value=`${ie}${pe}`,Se(),et();let ve=Number.parseInt(R.dataset.time??"0",10);zt(ge,d,ve,F.value)};ye.onclick=gt,ye.append(we),h.style.cssText="position:relative;padding-left:20px;",h.addEventListener("mouseenter",()=>{Se(),we.style.display="inline"}),h.addEventListener("mouseleave",()=>{we.style.display="none"}),h.addEventListener("mouseleave",()=>{h.dataset.guid===Tt&&Di(h)&&$o()}),F.value=o||"",F.style.cssText="width:100%;margin-top:5px;display:block;",F.type="text",F.setAttribute("inputmode","text"),F.autocapitalize="off",F.autocomplete="off",F.spellcheck=!1,F.addEventListener("focusin",()=>{on=!1}),F.addEventListener("focusout",Q=>{let K=Q.relatedTarget,pe=Date.now()-Ao<250,ae=!!K&&!!n&&n.contains(K);!pe&&!ae&&(on=!0,setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(F.focus({preventScroll:!0}),on=!1)},0))}),F.addEventListener("input",Q=>{let K=Q;if(K&&(K.isComposing||K.inputType==="insertCompositionText"))return;let pe=wt.get(d);pe&&clearTimeout(pe);let ae=setTimeout(()=>{let ie=Number.parseInt(R.dataset.time??"0",10);zt(ge,d,ie,F.value),wt.delete(d)},500);wt.set(d,ae)}),F.addEventListener("compositionend",()=>{let Q=Number.parseInt(R.dataset.time??"0",10);setTimeout(()=>{zt(ge,d,Q,F.value)},50)}),k.textContent="\u2796",k.dataset.increment="-1",k.style.cursor="pointer",k.style.margin="0px",k.addEventListener("mouseenter",()=>{k.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),k.addEventListener("mouseleave",()=>{k.style.textShadow="none"}),I.textContent="\u2795",I.dataset.increment="1",I.style.cursor="pointer",I.style.margin="0px",I.addEventListener("mouseenter",()=>{I.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),I.addEventListener("mouseleave",()=>{I.style.textShadow="none"}),L.textContent="\u23FA\uFE0F",L.style.cursor="pointer",L.style.margin="0px",We(L,"Set to current playback time"),L.addEventListener("mouseenter",()=>{L.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),L.addEventListener("mouseleave",()=>{L.style.textShadow="none"}),L.onclick=()=>{let Q=q(),K=Q?Math.floor(Q.getCurrentTime()):0;Number.isFinite(K)&&(c(`Timestamps changedset to current playback time ${K}`),Bn(R,K),un(),et(),zt(ge,d,K,F.value),Tt=d)},Bn(R,g),An(),te.textContent="\u{1F5D1}\uFE0F",te.style.cssText="background:transparent;border:none;color:white;cursor:pointer;margin-left:5px;",te.addEventListener("mouseenter",()=>{te.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(255, 100, 100, 0.6)"}),te.addEventListener("mouseleave",()=>{te.style.textShadow="none"}),te.onclick=()=>{let Q=null,K=null,pe=null,ae=()=>{try{h.removeEventListener("click",K,!0)}catch{}try{document.removeEventListener("click",K,!0)}catch{}if(l)try{l.removeEventListener("mouseleave",pe)}catch{}Q&&(clearTimeout(Q),Q=null)};if(h.dataset.deleteConfirmed==="true"){c("Timestamps changed: Timestamp deleted");let ie=h.dataset.guid??"",ve=wt.get(ie);ve&&(clearTimeout(ve),wt.delete(ie)),ae(),h.remove(),An(),un(),et(),Ie(),Hn(),Fi(ge,ie),Tt=null,sn()}else{h.dataset.deleteConfirmed="true",h.classList.add(le),h.classList.remove($e);let ie=()=>{h.dataset.deleteConfirmed="false",h.classList.remove(le);let ve=q(),Ne=ve?ve.getCurrentTime():0,tt=Number.parseInt(h.querySelector("a[data-time]")?.dataset.time??"0",10);Number.isFinite(Ne)&&Number.isFinite(tt)&&Ne>=tt&&h.classList.add($e),ae()};K=ve=>{ve.target!==te&&ie()},pe=()=>{h.dataset.deleteConfirmed==="true"&&ie()},h.addEventListener("click",K,!0),document.addEventListener("click",K,!0),l&&l.addEventListener("mouseleave",pe),Q=setTimeout(()=>{h.dataset.deleteConfirmed==="true"&&ie(),ae()},5e3)}},ne.className="time-diff",ne.style.color="#888",ne.style.marginLeft="5px",T.append(k,L,I,R,ne,te),h.append(ye,T,F);let st=Number.parseInt(R.dataset.time??"0",10);if(y){ro();let Q=!1,K=ee();for(let pe=0;pe<K.length;pe++){let ae=K[pe],ve=ae.querySelector("a[data-time]")?.dataset.time;if(!ve)continue;let Ne=Number.parseInt(ve,10);if(Number.isFinite(Ne)&&st<Ne){l.insertBefore(h,ae),Q=!0;let tt=K[pe-1];if(tt){let Nt=tt.querySelector("a[data-time]")?.dataset.time;if(Nt){let lt=Number.parseInt(Nt,10);Number.isFinite(lt)&&(ne.textContent=vt(st-lt))}}else ne.textContent="";let Ot=ae.querySelector(".time-diff");Ot&&(Ot.textContent=vt(Ne-st));break}}if(!Q&&(l.appendChild(h),K.length>0)){let ie=K[K.length-1].querySelector("a[data-time]")?.dataset.time;if(ie){let ve=Number.parseInt(ie,10);Number.isFinite(ve)&&(ne.textContent=vt(st-ve))}}h.scrollIntoView({behavior:"smooth",block:"center"}),Hn(),et(),Ie(),a||(zt(ge,d,g,o),Tt=d,ln(h,!1))}else F.__ytls_li=h;return F}function un(){if(!l||l.querySelector(".ytls-error-message"))return;let t=ee();t.forEach((o,a)=>{let u=o.querySelector(".time-diff");if(!u)return;let g=o.querySelector("a[data-time]")?.dataset.time;if(!g){u.textContent="";return}let d=Number.parseInt(g,10);if(!Number.isFinite(d)){u.textContent="";return}if(a===0){u.textContent="";return}let k=t[a-1].querySelector("a[data-time]")?.dataset.time;if(!k){u.textContent="";return}let L=Number.parseInt(k,10);if(!Number.isFinite(L)){u.textContent="";return}let I=d-L,R=I<0?"-":"";u.textContent=` ${R}${vt(Math.abs(I))}`})}function $o(){if(!l||l.querySelector(".ytls-error-message")||de)return;let t=null;if(document.activeElement instanceof HTMLInputElement&&l.contains(document.activeElement)){let d=document.activeElement,T=d.closest("li")?.dataset.guid;if(T){let k=d.selectionStart??d.value.length,L=d.selectionEnd??k,I=d.scrollLeft;t={guid:T,start:k,end:L,scroll:I}}}let o=ee();if(o.length===0)return;let a=o.map(d=>d.dataset.guid),u=o.map(d=>{let h=d.querySelector("a[data-time]"),T=h?.dataset.time;if(!h||!T)return null;let k=Number.parseInt(T,10);if(!Number.isFinite(k))return null;let L=d.dataset.guid??"";return{time:k,guid:L,element:d}}).filter(d=>d!==null).sort((d,h)=>{let T=d.time-h.time;return T!==0?T:d.guid.localeCompare(h.guid)}),y=u.map(d=>d.guid),g=a.length!==y.length||a.some((d,h)=>d!==y[h]);for(;l.firstChild;)l.removeChild(l.firstChild);if(u.forEach(d=>{l.appendChild(d.element)}),un(),et(),Ie(),t){let h=ee().find(T=>T.dataset.guid===t.guid)?.querySelector("input");if(h)try{h.focus({preventScroll:!0})}catch{}}g&&(c("Timestamps changed: Timestamps sorted"),Rn(ge))}function Hn(){if(!l||!n||!v||!S)return;let t=ee().length;typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea();let o=n.getBoundingClientRect(),a=v.getBoundingClientRect(),u=S.getBoundingClientRect(),y=Math.max(0,o.height-(a.height+u.height));t===0?(sn(),l.style.overflowY="hidden"):l.style.overflowY=l.scrollHeight>y?"auto":"hidden"}function Ie(){if(!l)return;let t=Re(),o=document.querySelector(".ytp-progress-bar"),a=q(),u=a?a.getVideoData():null,y=!!u&&!!u.isLive;if(!t||!o||!isFinite(t.duration)||y)return;Ro(),ee().map(d=>{let h=d.querySelector("a[data-time]"),T=h?.dataset.time;if(!h||!T)return null;let k=Number.parseInt(T,10);if(!Number.isFinite(k))return null;let I=d.querySelector("input")?.value??"",R=d.dataset.guid??crypto.randomUUID();return d.dataset.guid||(d.dataset.guid=R),{start:k,comment:I,guid:R}}).filter(zo).forEach(d=>{if(!Number.isFinite(d.start))return;let h=document.createElement("div");h.className="ytls-marker",h.style.position="absolute",h.style.height="100%",h.style.width="2px",h.style.backgroundColor="#ff0000",h.style.cursor="pointer",h.style.left=d.start/t.duration*100+"%",h.dataset.time=String(d.start),h.addEventListener("click",()=>{let T=q();T&&T.seekTo(d.start)}),o.appendChild(h)})}function Rn(t,o={}){if(!l||l.querySelector(".ytls-error-message")||!t)return;if(de){c("Save blocked: timestamps are currently loading");return}et();let a=oo().sort((u,y)=>u.start-y.start);if(a.length===0&&!o.allowEmpty){c("Save skipped: no timestamps to save");return}Go(t,a).then(()=>c(`Successfully saved ${a.length} timestamps for ${t} to IndexedDB`)).catch(u=>c(`Failed to save timestamps for ${t} to IndexedDB:`,u,"error")),Jt({type:"timestamps_updated",videoId:t,action:"saved"})}function zt(t,o,a,u){if(!t||de)return;let y={guid:o,start:a,comment:u};c(`Saving timestamp: guid=${o}, start=${a}, comment="${u}"`),qi(t,y).catch(g=>c(`Failed to save timestamp ${o}:`,g,"error")),Jt({type:"timestamps_updated",videoId:t,action:"saved"})}function Fi(t,o){!t||de||(c(`Deleting timestamp: guid=${o}`),ji(t,o).catch(a=>c(`Failed to delete timestamp ${o}:`,a,"error")),Jt({type:"timestamps_updated",videoId:t,action:"saved"}))}async function Ho(t){if(!l||l.querySelector(".ytls-error-message")){alert("Cannot export timestamps while displaying an error message.");return}let o=ge;if(!o)return;c(`Exporting timestamps for video ID: ${o}`);let a=oo(),u=Math.max(Et(),0),y=ho();if(t==="json"){let g=new Blob([JSON.stringify(a,null,2)],{type:"application/json"}),d=URL.createObjectURL(g),h=document.createElement("a");h.href=d,h.download=`timestamps-${o}-${y}.json`,h.click(),URL.revokeObjectURL(d)}else if(t==="text"){let g=a.map(k=>{let L=vt(k.start,u),I=`${k.comment} <!-- guid:${k.guid} -->`.trimStart();return`${L} ${I}`}).join(`
`),d=new Blob([g],{type:"text/plain"}),h=URL.createObjectURL(d),T=document.createElement("a");T.href=h,T.download=`timestamps-${o}-${y}.txt`,T.click(),URL.revokeObjectURL(h)}}function so(t){if(!n||!l){c("Timekeeper error:",t,"error");return}kt();let o=document.createElement("li");o.textContent=t,o.classList.add("ytls-error-message"),o.style.color="#ff6b6b",o.style.fontWeight="bold",o.style.padding="8px",o.style.background="rgba(255, 0, 0, 0.1)",l.appendChild(o),Ie()}function Ro(){document.querySelectorAll(".ytls-marker").forEach(t=>t.remove())}function Pt(){if(!n||!document.body.contains(n))return;let t=n.getBoundingClientRect(),o=document.documentElement.clientWidth,a=document.documentElement.clientHeight,u=t.width,y=t.height;if(t.left<0&&(n.style.left="0",n.style.right="auto"),t.right>o){let g=Math.max(0,o-u);n.style.left=`${g}px`,n.style.right="auto"}if(t.top<0&&(n.style.top="0",n.style.bottom="auto"),t.bottom>a){let g=Math.max(0,a-y);n.style.top=`${g}px`,n.style.bottom="auto"}}function $i(){if(kn&&(document.removeEventListener("mousemove",kn),kn=null),Sn&&(document.removeEventListener("mouseup",Sn),Sn=null),en&&(document.removeEventListener("keydown",en),en=null),Ln&&(window.removeEventListener("resize",Ln),Ln=null),tn&&(document.removeEventListener("pointerdown",tn,!0),tn=null),nn&&(document.removeEventListener("pointerup",nn,!0),nn=null),Xe){try{Xe.disconnect()}catch{}Xe=null}if(Qe){try{Qe.disconnect()}catch{}Qe=null}let t=Re();t&&(In&&(t.removeEventListener("timeupdate",In),In=null),Cn&&(t.removeEventListener("pause",Cn),Cn=null),Mn&&(t.removeEventListener("play",Mn),Mn=null),Dn&&(t.removeEventListener("seeking",Dn),Dn=null))}function Hi(){Ro(),wt.forEach(o=>clearTimeout(o)),wt.clear(),Qt&&(clearTimeout(Qt),Qt=null),se&&(clearInterval(se),se=null),Je&&(clearTimeout(Je),Je=null),$i();try{it.close()}catch{}if(z&&z.parentNode===document.body&&document.body.removeChild(z),z=null,Tn=null,wn=!1,ge=null,Xe){try{Xe.disconnect()}catch{}Xe=null}if(Qe){try{Qe.disconnect()}catch{}Qe=null}n&&n.parentNode&&n.remove();let t=document.getElementById("ytls-header-button");t&&t.parentNode&&t.remove(),ht=null,En=!1,Pe=null,kt(),n=null,v=null,l=null,S=null,E=null,w=null,D=null,ze=null}async function Ri(){let t=lo();if(!t)return ze=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let o=await bn();if(!ce(o)){let a=ft(o),u=a.length?` Missing methods: ${a.join(", ")}.`:"",y=o?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return ze=null,{ok:!1,message:`${y}${u} Try refreshing once playback is ready.`}}return ze=o,{ok:!0,player:o,videoId:t}}async function Oo(){if(!n||!l)return;let t=l.scrollTop,o=!0,a=()=>{if(!l||!o)return;let u=Math.max(0,l.scrollHeight-l.clientHeight);l.scrollTop=Math.min(t,u)};try{let u=await Ri();if(!u.ok){so(u.message),kt(),Ie();return}let{videoId:y}=u,g=[];try{let d=await Vi(y);d?(g=d.map(h=>({...h,guid:h.guid||crypto.randomUUID()})),c(`Loaded ${g.length} timestamps from IndexedDB for ${y}`)):c(`No timestamps found in IndexedDB for ${y}`)}catch(d){c(`Failed to load timestamps from IndexedDB for ${y}:`,d,"error"),so("Failed to load timestamps from IndexedDB. Try refreshing the page."),Ie();return}if(g.length>0){g.sort((L,I)=>L.start-I.start),kt(),ro();let d=document.createDocumentFragment();g.forEach(L=>{let R=cn(L.start,L.comment,!0,L.guid,!1).__ytls_li;R&&d.appendChild(R)}),n&&n.classList.contains("ytls-zoom-in")&&fe!=null?(c("Deferring timestamp DOM append until show animation completes"),pt=d,rt||(rt=new Promise(L=>{Oe=L})),await rt):l&&(l.appendChild(d),et(),Ie(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea()));let T=q(),k=T?Math.floor(T.getCurrentTime()):Et();Number.isFinite(k)&&(Fn(k,!1),o=!1)}else kt(),io("No timestamps for this video"),Ie(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea())}catch(u){c("Unexpected error while loading timestamps:",u,"error"),so("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{rt&&await rt,requestAnimationFrame(a),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea()),l&&!l.querySelector(".ytls-error-message")&&sn()}}function lo(){let o=new URLSearchParams(location.search).get("v");if(o)return o;let a=document.querySelector('meta[itemprop="identifier"]');return a?.content?a.content:null}function Oi(){let t=Re();if(!t)return;let o=()=>{if(!l)return;let d=q(),h=d?Math.floor(d.getCurrentTime()):0;if(!Number.isFinite(h))return;let T=$n(h);ln(T,!1)},a=d=>{try{let h=new URL(window.location.href);d!==null&&Number.isFinite(d)?h.searchParams.set("t",`${Math.floor(d)}s`):h.searchParams.delete("t"),window.history.replaceState({},"",h.toString())}catch{}},u=()=>{let d=q(),h=d?Math.floor(d.getCurrentTime()):0;Number.isFinite(h)&&a(h)},y=()=>{a(null)},g=()=>{let d=Re();if(!d)return;let h=q(),T=h?Math.floor(h.getCurrentTime()):0;if(!Number.isFinite(T))return;d.paused&&a(T);let k=$n(T);ln(k,!0)};In=o,Cn=u,Mn=y,Dn=g,t.addEventListener("timeupdate",o),t.addEventListener("pause",u),t.addEventListener("play",y),t.addEventListener("seeking",g)}let Ni="ytls-timestamps-db",Gi=3,Ft="timestamps",Ve="timestamps_v2",On="settings",$t=null,Ht=null;function Rt(){if($t)try{if($t.objectStoreNames.length>=0)return Promise.resolve($t)}catch(t){c("IndexedDB connection is no longer usable:",t,"warn"),$t=null}return Ht||(Ht=_i().then(t=>($t=t,Ht=null,t.onclose=()=>{c("IndexedDB connection closed unexpectedly","warn"),$t=null},t.onerror=o=>{c("IndexedDB connection error:",o,"error")},t)).catch(t=>{throw Ht=null,t}),Ht)}async function No(){let t={},o=await Ki(Ve),a=new Map;for(let g of o){let d=g;a.has(d.video_id)||a.set(d.video_id,[]),a.get(d.video_id).push({guid:d.guid,start:d.start,comment:d.comment})}for(let[g,d]of a)t[`ytls-${g}`]={video_id:g,timestamps:d.sort((h,T)=>h.start-T.start)};return{json:JSON.stringify(t,null,2),filename:"timekeeper-data.json",totalVideos:a.size,totalTimestamps:o.length}}async function Ui(){try{let{json:t,filename:o,totalVideos:a,totalTimestamps:u}=await No(),y=new Blob([t],{type:"application/json"}),g=URL.createObjectURL(y),d=document.createElement("a");d.href=g,d.download=o,d.click(),URL.revokeObjectURL(g),c(`Exported ${a} videos with ${u} timestamps`)}catch(t){throw c("Failed to export data:",t,"error"),t}}function _i(){return new Promise((t,o)=>{let a=indexedDB.open(Ni,Gi);a.onupgradeneeded=u=>{let y=u.target.result,g=u.oldVersion,d=u.target.transaction;if(g<1&&y.createObjectStore(Ft,{keyPath:"video_id"}),g<2&&!y.objectStoreNames.contains(On)&&y.createObjectStore(On,{keyPath:"key"}),g<3){if(y.objectStoreNames.contains(Ft)){c("Exporting backup before v2 migration...");let k=d.objectStore(Ft).getAll();k.onsuccess=()=>{let L=k.result;if(L.length>0)try{let I={},R=0;L.forEach(ye=>{if(Array.isArray(ye.timestamps)&&ye.timestamps.length>0){let we=ye.timestamps.map(Se=>({guid:Se.guid||crypto.randomUUID(),start:Se.start,comment:Se.comment}));I[`ytls-${ye.video_id}`]={video_id:ye.video_id,timestamps:we.sort((Se,gt)=>Se.start-gt.start)},R+=we.length}});let ne=new Blob([JSON.stringify(I,null,2)],{type:"application/json"}),F=URL.createObjectURL(ne),te=document.createElement("a");te.href=F,te.download=`timekeeper-data-${ho()}.json`,te.click(),URL.revokeObjectURL(F),c(`Pre-migration backup exported: ${L.length} videos, ${R} timestamps`)}catch(I){c("Failed to export pre-migration backup:",I,"error")}}}let h=y.createObjectStore(Ve,{keyPath:"guid"});if(h.createIndex("video_id","video_id",{unique:!1}),h.createIndex("video_start",["video_id","start"],{unique:!1}),y.objectStoreNames.contains(Ft)){let k=d.objectStore(Ft).getAll();k.onsuccess=()=>{let L=k.result;if(L.length>0){let I=0;L.forEach(R=>{Array.isArray(R.timestamps)&&R.timestamps.length>0&&R.timestamps.forEach(ne=>{h.put({guid:ne.guid||crypto.randomUUID(),video_id:R.video_id,start:ne.start,comment:ne.comment}),I++})}),c(`Migrated ${I} timestamps from ${L.length} videos to v2 store`)}},y.deleteObjectStore(Ft),c("Deleted old timestamps store after migration to v2")}}},a.onsuccess=u=>{t(u.target.result)},a.onerror=u=>{let y=u.target.error;o(y??new Error("Failed to open IndexedDB"))}})}function co(t,o,a){return Rt().then(u=>new Promise((y,g)=>{let d;try{d=u.transaction(t,o)}catch(k){g(new Error(`Failed to create transaction for ${t}: ${k}`));return}let h=d.objectStore(t),T;try{T=a(h)}catch(k){g(new Error(`Failed to execute operation on ${t}: ${k}`));return}T&&(T.onsuccess=()=>y(T.result),T.onerror=()=>g(T.error??new Error(`IndexedDB ${o} operation failed`))),d.oncomplete=()=>{T||y(void 0)},d.onerror=()=>g(d.error??new Error("IndexedDB transaction failed")),d.onabort=()=>g(d.error??new Error("IndexedDB transaction aborted"))}))}function Go(t,o){return Rt().then(a=>new Promise((u,y)=>{let g;try{g=a.transaction([Ve],"readwrite")}catch(k){y(new Error(`Failed to create transaction: ${k}`));return}let d=g.objectStore(Ve),T=d.index("video_id").getAll(IDBKeyRange.only(t));T.onsuccess=()=>{try{let k=T.result,L=new Set(o.map(I=>I.guid));k.forEach(I=>{L.has(I.guid)||d.delete(I.guid)}),o.forEach(I=>{d.put({guid:I.guid,video_id:t,start:I.start,comment:I.comment})})}catch(k){c("Error during save operation:",k,"error")}},T.onerror=()=>{y(T.error??new Error("Failed to get existing records"))},g.oncomplete=()=>u(),g.onerror=()=>y(g.error??new Error("Failed to save to IndexedDB")),g.onabort=()=>y(g.error??new Error("Transaction aborted during save"))}))}function qi(t,o){return Rt().then(a=>new Promise((u,y)=>{let g;try{g=a.transaction([Ve],"readwrite")}catch(T){y(new Error(`Failed to create transaction: ${T}`));return}let h=g.objectStore(Ve).put({guid:o.guid,video_id:t,start:o.start,comment:o.comment});h.onerror=()=>{y(h.error??new Error("Failed to put timestamp"))},g.oncomplete=()=>u(),g.onerror=()=>y(g.error??new Error("Failed to save single timestamp to IndexedDB")),g.onabort=()=>y(g.error??new Error("Transaction aborted during single timestamp save"))}))}function ji(t,o){return c(`Deleting timestamp ${o} for video ${t}`),Rt().then(a=>new Promise((u,y)=>{let g;try{g=a.transaction([Ve],"readwrite")}catch(T){y(new Error(`Failed to create transaction: ${T}`));return}let h=g.objectStore(Ve).delete(o);h.onerror=()=>{y(h.error??new Error("Failed to delete timestamp"))},g.oncomplete=()=>u(),g.onerror=()=>y(g.error??new Error("Failed to delete single timestamp from IndexedDB")),g.onabort=()=>y(g.error??new Error("Transaction aborted during timestamp deletion"))}))}function Vi(t){return Rt().then(o=>new Promise(a=>{let u;try{u=o.transaction([Ve],"readonly")}catch(h){c("Failed to create read transaction:",h,"warn"),a(null);return}let d=u.objectStore(Ve).index("video_id").getAll(IDBKeyRange.only(t));d.onsuccess=()=>{let h=d.result;if(h.length>0){let T=h.map(k=>({guid:k.guid,start:k.start,comment:k.comment})).sort((k,L)=>k.start-L.start);a(T)}else a(null)},d.onerror=()=>{c("Failed to load timestamps:",d.error,"warn"),a(null)},u.onabort=()=>{c("Transaction aborted during load:",u.error,"warn"),a(null)}}))}function Wi(t){return Rt().then(o=>new Promise((a,u)=>{let y;try{y=o.transaction([Ve],"readwrite")}catch(T){u(new Error(`Failed to create transaction: ${T}`));return}let g=y.objectStore(Ve),h=g.index("video_id").getAll(IDBKeyRange.only(t));h.onsuccess=()=>{try{h.result.forEach(k=>{g.delete(k.guid)})}catch(T){c("Error during remove operation:",T,"error")}},h.onerror=()=>{u(h.error??new Error("Failed to get records for removal"))},y.oncomplete=()=>a(),y.onerror=()=>u(y.error??new Error("Failed to remove timestamps")),y.onabort=()=>u(y.error??new Error("Transaction aborted during timestamp removal"))}))}function Ki(t){return co(t,"readonly",o=>o.getAll()).then(o=>Array.isArray(o)?o:[])}function Nn(t,o){co(On,"readwrite",a=>{a.put({key:t,value:o})}).catch(a=>{c(`Failed to save setting '${t}' to IndexedDB:`,a,"error")})}function uo(t){return co(On,"readonly",o=>o.get(t)).then(o=>o?.value).catch(o=>{c(`Failed to load setting '${t}' from IndexedDB:`,o,"error")})}function Uo(){if(!n)return;let t=n.style.display!=="none";Nn("uiVisible",t)}function at(t){let o=typeof t=="boolean"?t:!!n&&n.style.display!=="none",a=document.getElementById("ytls-header-button");a instanceof HTMLButtonElement&&a.setAttribute("aria-pressed",String(o)),ht&&!En&&ht.src!==ke&&(ht.src=ke)}function Yi(){n&&uo("uiVisible").then(t=>{let o=t;typeof o=="boolean"?(o?(n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in")):n.style.display="none",at(o)):(n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),at(!0))}).catch(t=>{c("Failed to load UI visibility state:",t,"error"),n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),at(!0)})}function mo(t){if(!n){c("ERROR: togglePaneVisibility called but pane is null");return}document.body.contains(n)||(c("Pane not in DOM during toggle, appending it"),document.querySelectorAll("#ytls-pane").forEach(y=>{y!==n&&y.remove()}),document.body.appendChild(n));let o=document.querySelectorAll("#ytls-pane");o.length>1&&(c(`ERROR: Multiple panes detected in togglePaneVisibility (${o.length}), cleaning up`),o.forEach(y=>{y!==n&&y.remove()})),Je&&(clearTimeout(Je),Je=null);let a=n.style.display==="none";(typeof t=="boolean"?t:a)?(n.style.display="flex",n.classList.remove("ytls-fade-out"),n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),at(!0),Uo(),re(),fe&&(clearTimeout(fe),fe=null),fe=setTimeout(()=>{H(),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),ue(),G(!0),fe=null},450)):(n.classList.remove("ytls-fade-in"),n.classList.remove("ytls-zoom-in"),n.classList.add("ytls-zoom-out"),at(!1),U())}function _o(t){if(!l){c("UI is not initialized; cannot import timestamps.","warn");return}let o=!1;try{let a=JSON.parse(t),u=null;if(Array.isArray(a))u=a;else if(typeof a=="object"&&a!==null){let y=ge;if(y){let g=`timekeeper-${y}`;a[g]&&Array.isArray(a[g].timestamps)&&(u=a[g].timestamps,c(`Found timestamps for current video (${y}) in export format`,"info"))}if(!u){let g=Object.keys(a).filter(d=>d.startsWith("ytls-"));if(g.length===1&&Array.isArray(a[g[0]].timestamps)){u=a[g[0]].timestamps;let d=a[g[0]].video_id;c(`Found timestamps for video ${d} in export format`,"info")}}}u&&Array.isArray(u)?u.every(g=>typeof g.start=="number"&&typeof g.comment=="string")?(u.forEach(g=>{if(g.guid){let d=ee().find(h=>h.dataset.guid===g.guid);if(d){let h=d.querySelector("input");h&&(h.value=g.comment)}else cn(g.start,g.comment,!1,g.guid)}else cn(g.start,g.comment,!1,crypto.randomUUID())}),o=!0):c("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):c("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!o){let a=t.split(`
`).map(u=>u.trim()).filter(u=>u);if(a.length>0){let u=!1;a.forEach(y=>{let g=y.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(g){u=!0;let d=parseInt(g[1])||0,h=parseInt(g[2]),T=parseInt(g[3]),k=d*3600+h*60+T,L=g[4]?g[4].trim():"",I=null,R=L,ne=L.match(/<!--\s*guid:([^>]+?)\s*-->/);ne&&(I=ne[1].trim(),R=L.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let F;if(I&&(F=ee().find(te=>te.dataset.guid===I)),!F&&!I&&(F=ee().find(te=>{if(te.dataset.guid)return!1;let we=te.querySelector("a[data-time]")?.dataset.time;if(!we)return!1;let Se=Number.parseInt(we,10);return Number.isFinite(Se)&&Se===k})),F){let te=F.querySelector("input");te&&(te.value=R)}else cn(k,R,!1,I||crypto.randomUUID())}}),u&&(o=!0)}}o?(c("Timestamps changed: Imported timestamps from file/clipboard"),et(),Rn(ge),Ie(),Hn()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function Zi(){if(no){c("Pane initialization already in progress, skipping duplicate call");return}if(!(n&&document.body.contains(n))){no=!0;try{let a=function(){if(de||St)return;let p=Re(),m=q();if(!p&&!m)return;let b=m?m.getCurrentTime():0,x=Number.isFinite(b)?Math.max(0,Math.floor(b)):Math.max(0,Et()),C=Math.floor(x/3600),A=Math.floor(x/60)%60,B=x%60,{isLive:N}=m?m.getVideoData()||{isLive:!1}:{isLive:!1},P=m?zi(m):!1,Y=l?ee().map(V=>{let be=V.querySelector("a[data-time]");return be?parseFloat(be.getAttribute("data-time")??"0"):0}):[],Ce="";if(Y.length>0)if(N){let V=Math.max(1,x/60),be=Y.filter(Me=>Me<=x);if(be.length>0){let Me=(be.length/V).toFixed(2);parseFloat(Me)>0&&(Ce=` (${Me}/min)`)}}else{let V=m?m.getDuration():0,be=Number.isFinite(V)&&V>0?V:p&&Number.isFinite(p.duration)&&p.duration>0?p.duration:0,Me=Math.max(1,be/60),ct=(Y.length/Me).toFixed(1);parseFloat(ct)>0&&(Ce=` (${ct}/min)`)}E.textContent=`\u23F3${C?C+":"+String(A).padStart(2,"0"):A}:${String(B).padStart(2,"0")}${Ce}`,E.style.color=P?"#ff4d4f":"",Y.length>0&&Fn(x,!1)},F=function(p,m,b){let x=document.createElement("button");return x.textContent=p,We(x,m),x.classList.add("ytls-settings-modal-button"),x.onclick=b,x},te=function(p="general"){if(z&&z.parentNode===document.body){let De=document.getElementById("ytls-save-modal"),yt=document.getElementById("ytls-load-modal"),ut=document.getElementById("ytls-delete-all-modal");De&&document.body.contains(De)&&document.body.removeChild(De),yt&&document.body.contains(yt)&&document.body.removeChild(yt),ut&&document.body.contains(ut)&&document.body.removeChild(ut),z.classList.remove("ytls-fade-in"),z.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(z)&&document.body.removeChild(z),z=null,document.removeEventListener("click",we,!0),document.removeEventListener("keydown",ye)},300);return}z=document.createElement("div"),z.id="ytls-settings-modal",z.classList.remove("ytls-fade-out"),z.classList.add("ytls-fade-in");let m=document.createElement("div");m.className="ytls-modal-header";let b=document.createElement("div");b.id="ytls-settings-nav";let x=document.createElement("button");x.className="ytls-modal-close-button",x.textContent="\u2715",We(x,"Close"),x.onclick=()=>{if(z&&z.parentNode===document.body){let De=document.getElementById("ytls-save-modal"),yt=document.getElementById("ytls-load-modal"),ut=document.getElementById("ytls-delete-all-modal");De&&document.body.contains(De)&&document.body.removeChild(De),yt&&document.body.contains(yt)&&document.body.removeChild(yt),ut&&document.body.contains(ut)&&document.body.removeChild(ut),z.classList.remove("ytls-fade-in"),z.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(z)&&document.body.removeChild(z),z=null,document.removeEventListener("click",we,!0),document.removeEventListener("keydown",ye)},300)}};let C=document.createElement("div");C.id="ytls-settings-content";let A=document.createElement("h3");A.className="ytls-section-heading",A.textContent="General",A.style.display="none";let B=document.createElement("div"),N=document.createElement("div");N.className="ytls-button-grid";function P(De){B.style.display=De==="general"?"block":"none",N.style.display=De==="drive"?"block":"none",Y.classList.toggle("active",De==="general"),V.classList.toggle("active",De==="drive"),A.textContent=De==="general"?"General":"Google Drive"}let Y=document.createElement("button");Y.textContent="\u{1F6E0}\uFE0F";let Ce=document.createElement("span");Ce.className="ytls-tab-text",Ce.textContent=" General",Y.appendChild(Ce),We(Y,"General settings"),Y.classList.add("ytls-settings-modal-button"),Y.onclick=()=>P("general");let V=document.createElement("button");V.textContent="\u2601\uFE0F";let be=document.createElement("span");be.className="ytls-tab-text",be.textContent=" Backup",V.appendChild(be),We(V,"Google Drive sign-in and backup"),V.classList.add("ytls-settings-modal-button"),V.onclick=async()=>{O.isSignedIn&&await Si(),P("drive")},b.appendChild(Y),b.appendChild(V),m.appendChild(b),m.appendChild(x),z.appendChild(m),B.className="ytls-button-grid",B.appendChild(F("\u{1F4BE} Save","Save As...",Se.onclick)),B.appendChild(F("\u{1F4C2} Load","Load",gt.onclick)),B.appendChild(F("\u{1F4E4} Export All","Export All Data",st.onclick)),B.appendChild(F("\u{1F4E5} Import All","Import All Data",Q.onclick));let Me=F(O.isSignedIn?"\u{1F513} Sign Out":"\u{1F510} Sign In",O.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{O.isSignedIn?await ki():await Ti(),Me.textContent=O.isSignedIn?"\u{1F513} Sign Out":"\u{1F510} Sign In",We(Me,O.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive")});N.appendChild(Me);let ct=F(nt?"\u{1F501} Auto Backup: On":"\u{1F501} Auto Backup: Off","Toggle Auto Backup",async()=>{await Ci(),ct.textContent=nt?"\u{1F501} Auto Backup: On":"\u{1F501} Auto Backup: Off"});N.appendChild(ct);let It=F(`\u23F1\uFE0F Backup Interval: ${qe}min`,"Set periodic backup interval (minutes)",async()=>{await Mi(),It.textContent=`\u23F1\uFE0F Backup Interval: ${qe}min`});N.appendChild(It),N.appendChild(F("\u{1F5C4}\uFE0F Backup Now","Run a backup immediately",async()=>{await yn(!1)}));let Ge=document.createElement("div");Ge.style.marginTop="15px",Ge.style.paddingTop="10px",Ge.style.borderTop="1px solid #555",Ge.style.fontSize="12px",Ge.style.color="#aaa";let Ct=document.createElement("div");Ct.style.marginBottom="8px",Ct.style.fontWeight="bold",Ge.appendChild(Ct),bi(Ct);let po=document.createElement("div");po.style.marginBottom="8px",yi(po),Ge.appendChild(po);let Ko=document.createElement("div");vi(Ko),Ge.appendChild(Ko),N.appendChild(Ge),Fe(),vn(),Ze(),C.appendChild(A),C.appendChild(B),C.appendChild(N),P(p),z.appendChild(C),document.body.appendChild(z),requestAnimationFrame(()=>{let De=z.getBoundingClientRect(),ut=(window.innerHeight-De.height)/2;z.style.top=`${Math.max(20,ut)}px`,z.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",we,!0),document.addEventListener("keydown",ye)},0)},ye=function(p){if(p.key==="Escape"&&z&&z.parentNode===document.body){let m=document.getElementById("ytls-save-modal"),b=document.getElementById("ytls-load-modal"),x=document.getElementById("ytls-delete-all-modal");if(m||b||x)return;p.preventDefault(),m&&document.body.contains(m)&&document.body.removeChild(m),b&&document.body.contains(b)&&document.body.removeChild(b),x&&document.body.contains(x)&&document.body.removeChild(x),z.classList.remove("ytls-fade-in"),z.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(z)&&document.body.removeChild(z),z=null,document.removeEventListener("click",we,!0),document.removeEventListener("keydown",ye)},300)}},we=function(p){if(Tn&&Tn.contains(p.target))return;let m=document.getElementById("ytls-save-modal"),b=document.getElementById("ytls-load-modal"),x=document.getElementById("ytls-delete-all-modal");m&&m.contains(p.target)||b&&b.contains(p.target)||x&&x.contains(p.target)||z&&z.contains(p.target)||(m&&document.body.contains(m)&&document.body.removeChild(m),b&&document.body.contains(b)&&document.body.removeChild(b),x&&document.body.contains(x)&&document.body.removeChild(x),z&&z.parentNode===document.body&&(z.classList.remove("ytls-fade-in"),z.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(z)&&document.body.removeChild(z),z=null,document.removeEventListener("click",we,!0),document.removeEventListener("keydown",ye)},300)))},K=function(){n&&(c("Loading window position from IndexedDB"),uo("windowPosition").then(p=>{if(p&&typeof p.x=="number"&&typeof p.y=="number"){let b=p;n.style.left=`${b.x}px`,n.style.top=`${b.y}px`,n.style.right="auto",n.style.bottom="auto",typeof b.width=="number"&&b.width>0?n.style.width=`${b.width}px`:(n.style.width=`${At}px`,c(`No stored window width found, using default width ${At}px`)),typeof b.height=="number"&&b.height>0?n.style.height=`${b.height}px`:(n.style.height=`${xt}px`,c(`No stored window height found, using default height ${xt}px`));let x=X();oe(x,b.x,b.y),c("Restored window position from IndexedDB:",Pe)}else c("No window position found in IndexedDB, applying default size and leaving default position"),n.style.width=`${At}px`,n.style.height=`${xt}px`,Pe=null;Pt();let m=X();m&&(m.width||m.height)&&oe(m),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea()}).catch(p=>{c("failed to load pane position from IndexedDB:",p,"warn"),Pt();let m=X();m&&(m.width||m.height)&&(Pe={x:Math.max(0,Math.round(m.left)),y:0,width:Math.round(m.width),height:Math.round(m.height)}),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea()}))},pe=function(){if(!n)return;let p=X();if(!p)return;let m={x:Math.max(0,Math.round(p.left)),y:Math.max(0,Math.round(p.top)),width:Math.round(p.width),height:Math.round(p.height)};if(Pe&&Pe.x===m.x&&Pe.y===m.y&&Pe.width===m.width&&Pe.height===m.height){c("Skipping window position save; position and size unchanged");return}Pe={...m},c(`Saving window position and size to IndexedDB: x=${m.x}, y=${m.y}, width=${m.width}, height=${m.height}`),Nn("windowPosition",m),Jt({type:"window_position_updated",position:m,timestamp:Date.now()})},qn=function(p,m){p.addEventListener("dblclick",b=>{b.preventDefault(),b.stopPropagation(),n&&(n.style.width="300px",n.style.height="300px",pe(),dn())}),p.addEventListener("mousedown",b=>{b.preventDefault(),b.stopPropagation(),lt=!0,Lt=m,Vo=b.clientX,Wo=b.clientY;let x=n.getBoundingClientRect();Gt=x.width,Ut=x.height,Un=x.left,_n=x.top,m==="top-left"||m==="bottom-right"?document.body.style.cursor="nwse-resize":document.body.style.cursor="nesw-resize"})},dn=function(){if(n&&v&&S&&l){let p=n.getBoundingClientRect(),m=v.getBoundingClientRect(),b=S.getBoundingClientRect(),x=p.height-(m.height+b.height);l.style.maxHeight=x>0?x+"px":"0px",l.style.overflowY=x>0?"auto":"hidden"}};document.querySelectorAll("#ytls-pane").forEach(p=>p.remove()),n=document.createElement("div"),v=document.createElement("div"),l=document.createElement("ul"),S=document.createElement("div"),E=document.createElement("span"),w=document.createElement("style"),D=document.createElement("span"),M=document.createElement("span"),M.classList.add("ytls-backup-indicator"),M.style.cursor="pointer",M.style.backgroundColor="#666",M.onclick=p=>{p.stopPropagation(),te("drive")},l.addEventListener("mouseenter",()=>{wn=!0,on=!1}),l.addEventListener("mouseleave",()=>{if(wn=!1,on)return;let p=q(),m=p?Math.floor(p.getCurrentTime()):Et();Fn(m,!1);let b=null;if(document.activeElement instanceof HTMLInputElement&&l.contains(document.activeElement)&&(b=document.activeElement.closest("li")?.dataset.guid??null),$o(),b){let C=ee().find(A=>A.dataset.guid===b)?.querySelector("input");if(C)try{C.focus({preventScroll:!0})}catch{}}}),n.id="ytls-pane",v.id="ytls-pane-header",v.addEventListener("dblclick",p=>{let m=p.target instanceof HTMLElement?p.target:null;m&&(m.closest("a")||m.closest("button")||m.closest("#ytls-current-time")||m.closest(".ytls-version-display")||m.closest(".ytls-backup-indicator"))||(p.preventDefault(),mo(!1))});let t=GM_info.script.version;D.textContent=`v${t}`,D.classList.add("ytls-version-display");let o=document.createElement("span");o.style.display="inline-flex",o.style.alignItems="center",o.style.gap="6px",o.appendChild(D),o.appendChild(M),E.id="ytls-current-time",E.textContent="\u23F3",E.onclick=()=>{St=!0;let p=q();p&&p.seekToLiveHead(),setTimeout(()=>{St=!1},500)},a(),se&&clearInterval(se),se=setInterval(a,1e3),S.id="ytls-buttons";let u=(p,m)=>()=>{p.classList.remove("ytls-fade-in"),p.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(p)&&document.body.removeChild(p),m&&m()},300)},y=p=>m=>{m.key==="Escape"&&(m.preventDefault(),m.stopPropagation(),p())},g=p=>{setTimeout(()=>{document.addEventListener("keydown",p)},0)},d=(p,m)=>b=>{p.contains(b.target)||m()},h=p=>{setTimeout(()=>{document.addEventListener("click",p,!0)},0)},R=[{label:"\u{1F423}",title:"Add timestamp",action:()=>{if(!l||l.querySelector(".ytls-error-message")||de)return;let p=typeof Bt<"u"?Bt:0,m=q(),b=m?Math.floor(m.getCurrentTime()+p):0;if(!Number.isFinite(b))return;let x=cn(b,"");x&&x.focus()}},{label:"\u2699\uFE0F",title:"Settings",action:()=>te()},{label:"\u{1F4CB}",title:"Copy timestamps to clipboard",action:function(p){if(!l||l.querySelector(".ytls-error-message")||de){this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3);return}let m=oo(),b=Math.max(Et(),0);if(m.length===0){this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3);return}let x=p.ctrlKey,C=m.map(A=>{let B=vt(A.start,b);return x?`${B} ${A.comment} <!-- guid:${A.guid} -->`.trimStart():`${B} ${A.comment}`}).join(`
`);navigator.clipboard.writeText(C).then(()=>{this.textContent="\u2705",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3)}).catch(A=>{c("Failed to copy timestamps: ",A,"error"),this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3)})}},{label:"\u23F1\uFE0F",title:"Offset all timestamps",action:()=>{if(!l||l.querySelector(".ytls-error-message")||de)return;if(ee().length===0){alert("No timestamps available to offset.");return}let m=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(m===null)return;let b=m.trim();if(b.length===0)return;let x=Number.parseInt(b,10);if(!Number.isFinite(x)){alert("Please enter a valid integer number of seconds.");return}x!==0&&Po(x,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{label:"\u{1F5D1}\uFE0F",title:"Delete all timestamps for current video",action:async()=>{let p=lo();if(!p){alert("Unable to determine current video ID.");return}let m=document.createElement("div");m.id="ytls-delete-all-modal",m.classList.remove("ytls-fade-out"),m.classList.add("ytls-fade-in");let b=document.createElement("p");b.textContent="Hold the button to delete all timestamps for:",b.style.marginBottom="10px";let x=document.createElement("p");x.textContent=p,x.style.fontFamily="monospace",x.style.fontSize="12px",x.style.marginBottom="15px",x.style.color="#aaa";let C=document.createElement("button");C.classList.add("ytls-save-modal-button"),C.style.background="#d32f2f",C.style.position="relative",C.style.overflow="hidden";let A=null,B=0,N=null,P=document.createElement("div");P.style.position="absolute",P.style.left="0",P.style.top="0",P.style.height="100%",P.style.width="0%",P.style.background="#ff6b6b",P.style.transition="none",P.style.pointerEvents="none",C.appendChild(P);let Y=document.createElement("span");Y.textContent="Hold to Delete All",Y.style.position="relative",Y.style.zIndex="1",C.appendChild(Y);let Ce=()=>{if(!B)return;let Ge=Date.now()-B,Ct=Math.min(Ge/5e3*100,100);P.style.width=`${Ct}%`,Ct<100&&(N=requestAnimationFrame(Ce))},V=()=>{A&&(clearTimeout(A),A=null),N&&(cancelAnimationFrame(N),N=null),B=0,P.style.width="0%",Y.textContent="Hold to Delete All"};C.onmousedown=()=>{B=Date.now(),Y.textContent="Deleting...",N=requestAnimationFrame(Ce),A=setTimeout(async()=>{V(),m.classList.remove("ytls-fade-in"),m.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(m)&&document.body.removeChild(m);try{await Wi(p),fo()}catch(Ge){c("Failed to delete all timestamps:",Ge,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},C.onmouseup=V,C.onmouseleave=V;let be=null,Me=null,ct=u(m,()=>{V(),be&&document.removeEventListener("keydown",be),Me&&document.removeEventListener("click",Me,!0)});be=y(ct),Me=d(m,ct);let It=document.createElement("button");It.textContent="Cancel",It.classList.add("ytls-save-modal-cancel-button"),It.onclick=ct,m.appendChild(b),m.appendChild(x),m.appendChild(C),m.appendChild(It),document.body.appendChild(m),g(be),h(Me)}}],ne=Zo();R.forEach(p=>{let m=document.createElement("button");if(m.textContent=p.label,We(m,p.title),m.classList.add("ytls-main-button"),p.label==="\u{1F423}"&&ne){let b=document.createElement("span");b.textContent=ne,b.classList.add("ytls-holiday-emoji"),m.appendChild(b)}p.label==="\u{1F4CB}"?m.onclick=function(b){p.action.call(this,b)}:m.onclick=p.action,p.label==="\u2699\uFE0F"&&(Tn=m),S.appendChild(m)});let Se=document.createElement("button");Se.textContent="\u{1F4BE} Save",Se.classList.add("ytls-file-operation-button"),Se.onclick=()=>{let p=document.createElement("div");p.id="ytls-save-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let m=document.createElement("p");m.textContent="Save as:";let b=null,x=null,C=u(p,()=>{b&&document.removeEventListener("keydown",b),x&&document.removeEventListener("click",x,!0)});b=y(C),x=d(p,C);let A=document.createElement("button");A.textContent="JSON",A.classList.add("ytls-save-modal-button"),A.onclick=()=>{b&&document.removeEventListener("keydown",b),x&&document.removeEventListener("click",x,!0),u(p,()=>Ho("json"))()};let B=document.createElement("button");B.textContent="Plain Text",B.classList.add("ytls-save-modal-button"),B.onclick=()=>{b&&document.removeEventListener("keydown",b),x&&document.removeEventListener("click",x,!0),u(p,()=>Ho("text"))()};let N=document.createElement("button");N.textContent="Cancel",N.classList.add("ytls-save-modal-cancel-button"),N.onclick=C,p.appendChild(m),p.appendChild(A),p.appendChild(B),p.appendChild(N),document.body.appendChild(p),g(b),h(x)};let gt=document.createElement("button");gt.textContent="\u{1F4C2} Load",gt.classList.add("ytls-file-operation-button"),gt.onclick=()=>{let p=document.createElement("div");p.id="ytls-load-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let m=document.createElement("p");m.textContent="Load from:";let b=null,x=null,C=u(p,()=>{b&&document.removeEventListener("keydown",b),x&&document.removeEventListener("click",x,!0)});b=y(C),x=d(p,C);let A=document.createElement("button");A.textContent="File",A.classList.add("ytls-save-modal-button"),A.onclick=()=>{let P=document.createElement("input");P.type="file",P.accept=".json,.txt",P.classList.add("ytls-hidden-file-input"),P.onchange=Y=>{let Ce=Y.target.files?.[0];if(!Ce)return;b&&document.removeEventListener("keydown",b),x&&document.removeEventListener("click",x,!0),C();let V=new FileReader;V.onload=()=>{let be=String(V.result).trim();_o(be)},V.readAsText(Ce)},P.click()};let B=document.createElement("button");B.textContent="Clipboard",B.classList.add("ytls-save-modal-button"),B.onclick=async()=>{b&&document.removeEventListener("keydown",b),x&&document.removeEventListener("click",x,!0),u(p,async()=>{try{let P=await navigator.clipboard.readText();P?_o(P.trim()):alert("Clipboard is empty.")}catch(P){c("Failed to read from clipboard: ",P,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let N=document.createElement("button");N.textContent="Cancel",N.classList.add("ytls-save-modal-cancel-button"),N.onclick=C,p.appendChild(m),p.appendChild(A),p.appendChild(B),p.appendChild(N),document.body.appendChild(p),g(b),h(x)};let st=document.createElement("button");st.textContent="\u{1F4E4} Export",st.classList.add("ytls-file-operation-button"),st.onclick=async()=>{try{await Ui()}catch{alert("Failed to export data: Could not read from database.")}};let Q=document.createElement("button");Q.textContent="\u{1F4E5} Import",Q.classList.add("ytls-file-operation-button"),Q.onclick=()=>{let p=document.createElement("input");p.type="file",p.accept=".json",p.classList.add("ytls-hidden-file-input"),p.onchange=m=>{let b=m.target.files?.[0];if(!b)return;let x=new FileReader;x.onload=()=>{try{let C=JSON.parse(String(x.result)),A=[];for(let B in C)if(Object.prototype.hasOwnProperty.call(C,B)&&B.startsWith("ytls-")){let N=B.substring(5),P=C[B];if(P&&typeof P.video_id=="string"&&Array.isArray(P.timestamps)){let Y=P.timestamps.map(V=>({...V,guid:V.guid||crypto.randomUUID()})),Ce=Go(N,Y).then(()=>c(`Imported ${N} to IndexedDB`)).catch(V=>c(`Failed to import ${N} to IndexedDB:`,V,"error"));A.push(Ce)}else c(`Skipping key ${B} during import due to unexpected data format.`,"warn")}Promise.all(A).then(()=>{fo()}).catch(B=>{alert("An error occurred during import to IndexedDB. Check console for details."),c("Overall import error:",B,"error")})}catch(C){alert(`Failed to import data. Please ensure the file is in the correct format.
`+C.message),c("Import error:",C,"error")}},x.readAsText(b)},p.click()},w.textContent=Jo,l.onclick=p=>{Fo(p)},l.ontouchstart=p=>{Fo(p)},n.style.position="fixed",n.style.bottom="0",n.style.right="0",n.style.transition="none",K(),setTimeout(()=>Pt(),10);let ae=!1,ie,ve,Ne=!1;n.addEventListener("mousedown",p=>{let m=p.target;m instanceof Element&&(m instanceof HTMLInputElement||m instanceof HTMLTextAreaElement||m!==v&&!v.contains(m)&&window.getComputedStyle(m).cursor==="pointer"||(ae=!0,Ne=!1,ie=p.clientX-n.getBoundingClientRect().left,ve=p.clientY-n.getBoundingClientRect().top,n.style.transition="none"))}),document.addEventListener("mousemove",kn=p=>{if(!ae)return;Ne=!0;let m=p.clientX-ie,b=p.clientY-ve,x=n.getBoundingClientRect(),C=x.width,A=x.height,B=document.documentElement.clientWidth,N=document.documentElement.clientHeight;m=Math.max(0,Math.min(m,B-C)),b=Math.max(0,Math.min(b,N-A)),n.style.left=`${m}px`,n.style.top=`${b}px`,n.style.right="auto",n.style.bottom="auto"}),document.addEventListener("mouseup",Sn=()=>{if(!ae)return;ae=!1;let p=Ne;setTimeout(()=>{Ne=!1},50),Pt(),setTimeout(()=>{p&&pe()},200)}),n.addEventListener("dragstart",p=>p.preventDefault());let tt=document.createElement("div"),Ot=document.createElement("div"),Gn=document.createElement("div"),Nt=document.createElement("div");tt.id="ytls-resize-tl",Ot.id="ytls-resize-tr",Gn.id="ytls-resize-bl",Nt.id="ytls-resize-br";let lt=!1,Vo=0,Wo=0,Gt=0,Ut=0,Un=0,_n=0,Lt=null;qn(tt,"top-left"),qn(Ot,"top-right"),qn(Gn,"bottom-left"),qn(Nt,"bottom-right"),document.addEventListener("mousemove",p=>{if(!lt||!n||!Lt)return;let m=p.clientX-Vo,b=p.clientY-Wo,x=Gt,C=Ut,A=Un,B=_n,N=document.documentElement.clientWidth,P=document.documentElement.clientHeight;Lt==="bottom-right"?(x=Math.max(200,Math.min(800,Gt+m)),C=Math.max(250,Math.min(P,Ut+b))):Lt==="top-left"?(x=Math.max(200,Math.min(800,Gt-m)),A=Un+m,C=Math.max(250,Math.min(P,Ut-b)),B=_n+b):Lt==="top-right"?(x=Math.max(200,Math.min(800,Gt+m)),C=Math.max(250,Math.min(P,Ut-b)),B=_n+b):Lt==="bottom-left"&&(x=Math.max(200,Math.min(800,Gt-m)),A=Un+m,C=Math.max(250,Math.min(P,Ut+b))),A=Math.max(0,Math.min(A,N-x)),B=Math.max(0,Math.min(B,P-C)),n.style.width=`${x}px`,n.style.height=`${C}px`,n.style.left=`${A}px`,n.style.top=`${B}px`,n.style.right="auto",n.style.bottom="auto"}),document.addEventListener("mouseup",()=>{lt&&(lt=!1,Lt=null,document.body.style.cursor="",G(!0))});let jn=null;window.addEventListener("resize",Ln=()=>{jn&&clearTimeout(jn),jn=setTimeout(()=>{G(!0),jn=null},200)}),v.appendChild(E),v.appendChild(o);let Vn=document.createElement("div");if(Vn.id="ytls-content",Vn.append(l),Vn.append(S),n.append(v,Vn,w,tt,Ot,Gn,Nt),n.addEventListener("mousemove",p=>{try{if(ae||lt)return;let m=n.getBoundingClientRect(),b=20,x=p.clientX,C=p.clientY,A=x-m.left<=b,B=m.right-x<=b,N=C-m.top<=b,P=m.bottom-C<=b,Y="";N&&A||P&&B?Y="nwse-resize":N&&B||P&&A?Y="nesw-resize":Y="",document.body.style.cursor=Y}catch{}}),n.addEventListener("mouseleave",()=>{!lt&&!ae&&(document.body.style.cursor="")}),window.recalculateTimestampsArea=dn,setTimeout(()=>{if(dn(),n&&v&&S&&l){let p=40,m=ee();if(m.length>0)p=m[0].offsetHeight;else{let b=document.createElement("li");b.style.visibility="hidden",b.style.position="absolute",b.textContent="00:00 Example",l.appendChild(b),p=b.offsetHeight,l.removeChild(b)}$=v.offsetHeight+S.offsetHeight+p,n.style.minHeight=$+"px"}},0),window.addEventListener("resize",dn),Qe){try{Qe.disconnect()}catch{}Qe=null}Qe=new ResizeObserver(dn),Qe.observe(n),tn||document.addEventListener("pointerdown",tn=()=>{Ao=Date.now()},!0),nn||document.addEventListener("pointerup",nn=()=>{},!0)}finally{no=!1}}}async function Ji(){if(!n)return;if(document.querySelectorAll("#ytls-pane").forEach(a=>{a!==n&&(c("Removing duplicate pane element from DOM"),a.remove())}),document.body.contains(n)){c("Pane already in DOM, skipping append");return}await Yi(),typeof Lo=="function"&&Lo(No),typeof Xn=="function"&&Xn(Nn),typeof Qn=="function"&&Qn(uo),typeof So=="function"&&So(M),await Io(),await Ii(),await Kt(),typeof Wt=="function"&&Wt();let o=document.querySelectorAll("#ytls-pane");if(o.length>0&&(c(`WARNING: Found ${o.length} existing pane(s) in DOM, removing all`),o.forEach(a=>a.remove())),document.body.contains(n)){c("ERROR: Pane already in body, aborting append");return}if(document.body.appendChild(n),c("Pane successfully appended to DOM"),re(),fe&&(clearTimeout(fe),fe=null),fe=setTimeout(()=>{H(),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),ue(),G(!0),fe=null},450),Xe){try{Xe.disconnect()}catch{}Xe=null}Xe=new MutationObserver(()=>{let a=document.querySelectorAll("#ytls-pane");a.length>1&&(c(`CRITICAL: Multiple panes detected (${a.length}), removing duplicates`),a.forEach((u,y)=>{(y>0||n&&u!==n)&&u.remove()}))}),Xe.observe(document.body,{childList:!0,subtree:!0})}function qo(t=0){if(document.getElementById("ytls-header-button")){at();return}let o=document.querySelector("#logo");if(!o||!o.parentElement){t<10&&setTimeout(()=>qo(t+1),300);return}let a=document.createElement("button");a.id="ytls-header-button",a.type="button",a.className="ytls-header-button",We(a,"Toggle Timekeeper UI"),a.setAttribute("aria-label","Toggle Timekeeper UI");let u=document.createElement("img");u.src=ke,u.alt="",u.decoding="async",a.appendChild(u),ht=u,a.addEventListener("mouseenter",()=>{ht&&(En=!0,ht.src=Ae)}),a.addEventListener("mouseleave",()=>{ht&&(En=!1,at())}),a.addEventListener("click",()=>{n&&!document.body.contains(n)&&(c("Pane not in DOM, re-appending before toggle"),document.body.appendChild(n)),mo()}),o.insertAdjacentElement("afterend",a),at(),c("Timekeeper header button added next to YouTube logo")}function jo(){if(W)return;W=!0;let t=history.pushState,o=history.replaceState;function a(){try{let u=new Event("locationchange");window.dispatchEvent(u)}catch{}}history.pushState=function(){let u=t.apply(this,arguments);return a(),u},history.replaceState=function(){let u=o.apply(this,arguments);return a(),u},window.addEventListener("popstate",a),window.addEventListener("locationchange",()=>{window.location.href!==Z&&c("Location changed (locationchange event) \u2014 deferring UI update until navigation finish")})}async function fo(){if(!f()){Hi();return}Z=window.location.href,document.querySelectorAll("#ytls-pane").forEach((o,a)=>{(a>0||n&&o!==n)&&o.remove()}),await me(),await Zi(),ge=lo();let t=document.title;c("Page Title:",t),c("Video ID:",ge),c("Current URL:",window.location.href),ao(!0),kt(),Ie(),await Oo(),Ie(),ao(!1),c("Timestamps loaded and UI unlocked for video:",ge),await Ji(),qo(),Oi()}jo(),window.addEventListener("yt-navigate-start",()=>{c("Navigation started (yt-navigate-start event fired)"),f()&&n&&l&&(c("Locking UI and showing loading state for navigation"),ao(!0))}),en=t=>{t.ctrlKey&&t.altKey&&t.shiftKey&&(t.key==="T"||t.key==="t")&&(t.preventDefault(),mo(),c("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",en),window.addEventListener("yt-navigate-finish",()=>{c("Navigation finished (yt-navigate-finish event fired)"),window.location.href!==Z?fo():c("Navigation finished but URL already handled, skipping.")}),jo(),c("Timekeeper initialized and waiting for navigation events")})();})();

