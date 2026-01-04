// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      4.4.39
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

(()=>{var dr=Object.defineProperty;var mr=(e,i)=>{for(var a in i)dr(e,a,{get:i[a],enumerable:!0})};function c(e,...i){let a="log",s=[...i];i.length>0&&typeof i[i.length-1]=="string"&&["debug","info","warn","error","log"].includes(i[i.length-1])&&(a=s.pop());let n=`[Timekeeper v${GM_info.script.version}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error,log:console.log})[a](`${n} ${e}`,...s)}function wt(e,i=e){let a=Math.floor(e/3600),s=Math.floor(e%3600/60),m=String(e%60).padStart(2,"0");return i<3600?`${s<10?s:String(s).padStart(2,"0")}:${m}`:`${i>=36e3?String(a).padStart(2,"0"):a}:${String(s).padStart(2,"0")}:${m}`}function To(e,i=window.location.href){try{let a=new URL(i);return a.searchParams.set("t",`${e}s`),a.toString()}catch{return`https://www.youtube.com/watch?v=${i.search(/[?&]v=/)>=0?i.split(/[?&]v=/)[1].split(/&/)[0]:i.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${e}s`}}function xn(){let e=new Date;return e.getUTCFullYear()+"-"+String(e.getUTCMonth()+1).padStart(2,"0")+"-"+String(e.getUTCDate()).padStart(2,"0")+"--"+String(e.getUTCHours()).padStart(2,"0")+"-"+String(e.getUTCMinutes()).padStart(2,"0")+"-"+String(e.getUTCSeconds()).padStart(2,"0")}var pr=[{emoji:"\u{1F942}",month:1,day:1,name:"New Year's Day"},{emoji:"\u{1F49D}",month:2,day:14,name:"Valentine's Day"},{emoji:"\u{1F986}",month:5,day:25,name:"Kanna's Debut Anniversary"},{emoji:"\u{1F383}",month:10,day:31,name:"Halloween"},{emoji:"\u{1F382}",month:9,day:15,name:"Kanna's Birthday"},{emoji:"\u{1F332}",month:12,day:25,name:"Christmas"}];function pi(){let e=new Date,i=e.getFullYear(),a=e.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});for(let s of pr){let m=new Date(i,s.month-1,s.day),n=m.getTime()-e.getTime(),v=n/(1e3*60*60*24);if(v<=5&&v>=-2)return c(`Current date: ${a}, Selected emoji: ${s.emoji} (${s.name}), Days until holiday: ${Math.ceil(v)}`),s.emoji;if(v<-2&&(m=new Date(i+1,s.month-1,s.day),n=m.getTime()-e.getTime(),v=n/(1e3*60*60*24),v<=5&&v>=-2))return c(`Current date: ${a}, Selected emoji: ${s.emoji} (${s.name}), Days until holiday: ${Math.ceil(v)}`),s.emoji;if(v>5&&(m=new Date(i-1,s.month-1,s.day),n=m.getTime()-e.getTime(),v=n/(1e3*60*60*24),v<=5&&v>=-2))return c(`Current date: ${a}, Selected emoji: ${s.emoji} (${s.name}), Days until holiday: ${Math.ceil(v)}`),s.emoji}return c(`Current date: ${a}, No holiday emoji (not within range)`),null}var Xe=null,Qt=null,fr=500,Bt=null,Tn=!1,xt=null;function hr(){return(!Xe||!document.body.contains(Xe))&&(Xe=document.createElement("div"),Xe.className="ytls-tooltip",Xe.style.pointerEvents="none",document.body.appendChild(Xe),window.addEventListener("scroll",fi,!0),window.addEventListener("resize",fi,!0)),Xe}function gr(e,i,a){let m=window.innerWidth,n=window.innerHeight,v=e.getBoundingClientRect(),l=v.width,S=v.height,x=i+10,T=a+10;x+l>m-10&&(x=i-l-10),T+S>n-10&&(T=a-S-10),x=Math.max(10,Math.min(x,m-l-10)),T=Math.max(10,Math.min(T,n-S-10)),e.style.left=`${x}px`,e.style.top=`${T}px`}function hi(e,i){let s=window.innerWidth,m=window.innerHeight,n=i.getBoundingClientRect(),v=e.getBoundingClientRect(),l=v.width,S=v.height,x=Math.round(n.right+8),T=Math.round(n.top);x+l>s-8&&(x=Math.round(n.left-l-8)),x=Math.max(8,Math.min(x,s-l-8)),T+S>m-8&&(T=Math.round(n.bottom-S)),T=Math.max(8,Math.min(T,m-S-8)),e.style.left=`${x}px`,e.style.top=`${T}px`}function fi(){if(!(!Xe||!Bt)&&Xe.classList.contains("ytls-tooltip-visible"))try{hi(Xe,Bt)}catch{}}function yr(e=50){xt&&(clearTimeout(xt),xt=null),!Tn&&(xt=setTimeout(()=>{Eo(),xt=null},e))}function vr(e,i,a,s){Qt&&clearTimeout(Qt),s&&(Bt=s,Tn=!0),Qt=setTimeout(()=>{let m=hr();m.textContent=e,m.classList.remove("ytls-tooltip-visible"),s?requestAnimationFrame(()=>{hi(m,s),requestAnimationFrame(()=>{m.classList.add("ytls-tooltip-visible")})}):(gr(m,i,a),requestAnimationFrame(()=>{m.classList.add("ytls-tooltip-visible")}))},fr)}function Eo(){Qt&&(clearTimeout(Qt),Qt=null),xt&&(clearTimeout(xt),xt=null),Xe&&Xe.classList.remove("ytls-tooltip-visible"),Bt=null,Tn=!1}function rt(e,i){let a=0,s=0,m=S=>{a=S.clientX,s=S.clientY,Tn=!0,Bt=e;let x=typeof i=="function"?i():i;x&&vr(x,a,s,e)},n=S=>{a=S.clientX,s=S.clientY},v=()=>{Tn=!1,yr()};e.addEventListener("mouseenter",m),e.addEventListener("mousemove",n),e.addEventListener("mouseleave",v);let l=new MutationObserver(()=>{try{if(!document.body.contains(e))Bt===e&&Eo();else{let S=window.getComputedStyle(e);(S.display==="none"||S.visibility==="hidden"||S.opacity==="0")&&Bt===e&&Eo()}}catch{}});try{l.observe(e,{attributes:!0,attributeFilter:["class","style"]}),l.observe(document.body,{childList:!0,subtree:!0})}catch{}e.__tooltipCleanup=()=>{e.removeEventListener("mouseenter",m),e.removeEventListener("mousemove",n),e.removeEventListener("mouseleave",v);try{l.disconnect()}catch{}delete e.__tooltipObserver},e.__tooltipObserver=l}var gi=`
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
    /* Use 16px click areas for corner resize handlers to match touch targets and reduce accidental drags */
    width: 16px;
    height: 16px;
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

`;var _o={};mr(_o,{authStatusDisplay:()=>W,autoBackupBackoffMs:()=>Ye,autoBackupEnabled:()=>Qe,autoBackupIntervalMinutes:()=>Oe,autoBackupRetryAttempts:()=>zt,backupStatusDisplay:()=>ce,backupStatusIndicator:()=>Ln,blinkAuthStatusDisplay:()=>$i,buildExportPayload:()=>Fo,exportAllTimestampsToGoogleDrive:()=>Oi,formatBackupTime:()=>Ht,googleAuthState:()=>H,googleUserDisplay:()=>ro,handleOAuthPopup:()=>$o,handleOAuthRedirect:()=>Ur,isAutoBackupRunning:()=>Ft,lastAutoBackupAt:()=>Ke,loadAutoBackupSettings:()=>No,loadGlobalSettings:()=>tn,loadGoogleAuthState:()=>ao,runAutoBackupOnce:()=>nn,saveAutoBackupSettings:()=>so,saveGlobalSettings:()=>en,saveGoogleAuthState:()=>Mn,scheduleAutoBackup:()=>$t,setAuthStatusDisplay:()=>zo,setAutoBackupIntervalPrompt:()=>Go,setBackupStatusDisplay:()=>Po,setBackupStatusIndicator:()=>Br,setBuildExportPayload:()=>Pr,setGoogleUserDisplay:()=>Bo,setLoadGlobalSettings:()=>Fr,setSaveGlobalSettings:()=>zr,signInToGoogle:()=>Ho,signOutFromGoogle:()=>Ro,toggleAutoBackup:()=>Uo,updateAuthStatusDisplay:()=>De,updateBackupStatusDisplay:()=>Be,updateBackupStatusIndicator:()=>Ui,updateGoogleUserDisplay:()=>on,verifySignedIn:()=>Oo});var Ee=Uint8Array,Ve=Uint16Array,Co=Int32Array,Ao=new Ee([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Do=new Ee([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),yi=new Ee([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Ei=function(e,i){for(var a=new Ve(31),s=0;s<31;++s)a[s]=i+=1<<e[s-1];for(var m=new Co(a[30]),s=1;s<30;++s)for(var n=a[s];n<a[s+1];++n)m[n]=n-a[s]<<5|s;return{b:a,r:m}},ki=Ei(Ao,2),br=ki.b,So=ki.r;br[28]=258,So[258]=28;var Si=Ei(Do,0),Qr=Si.b,vi=Si.r,Lo=new Ve(32768);for(V=0;V<32768;++V)pt=(V&43690)>>1|(V&21845)<<1,pt=(pt&52428)>>2|(pt&13107)<<2,pt=(pt&61680)>>4|(pt&3855)<<4,Lo[V]=((pt&65280)>>8|(pt&255)<<8)>>1;var pt,V,Sn=(function(e,i,a){for(var s=e.length,m=0,n=new Ve(i);m<s;++m)e[m]&&++n[e[m]-1];var v=new Ve(i);for(m=1;m<i;++m)v[m]=v[m-1]+n[m-1]<<1;var l;if(a){l=new Ve(1<<i);var S=15-i;for(m=0;m<s;++m)if(e[m])for(var x=m<<4|e[m],T=i-e[m],A=v[e[m]-1]++<<T,C=A|(1<<T)-1;A<=C;++A)l[Lo[A]>>S]=x}else for(l=new Ve(s),m=0;m<s;++m)e[m]&&(l[m]=Lo[v[e[m]-1]++]>>15-e[m]);return l}),Pt=new Ee(288);for(V=0;V<144;++V)Pt[V]=8;var V;for(V=144;V<256;++V)Pt[V]=9;var V;for(V=256;V<280;++V)Pt[V]=7;var V;for(V=280;V<288;++V)Pt[V]=8;var V,to=new Ee(32);for(V=0;V<32;++V)to[V]=5;var V,wr=Sn(Pt,9,0);var xr=Sn(to,5,0);var Li=function(e){return(e+7)/8|0},Mi=function(e,i,a){return(i==null||i<0)&&(i=0),(a==null||a>e.length)&&(a=e.length),new Ee(e.subarray(i,a))};var Tr=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],oo=function(e,i,a){var s=new Error(i||Tr[e]);if(s.code=e,Error.captureStackTrace&&Error.captureStackTrace(s,oo),!a)throw s;return s};var ft=function(e,i,a){a<<=i&7;var s=i/8|0;e[s]|=a,e[s+1]|=a>>8},En=function(e,i,a){a<<=i&7;var s=i/8|0;e[s]|=a,e[s+1]|=a>>8,e[s+2]|=a>>16},ko=function(e,i){for(var a=[],s=0;s<e.length;++s)e[s]&&a.push({s,f:e[s]});var m=a.length,n=a.slice();if(!m)return{t:Ci,l:0};if(m==1){var v=new Ee(a[0].s+1);return v[a[0].s]=1,{t:v,l:1}}a.sort(function(fe,Le){return fe.f-Le.f}),a.push({s:-1,f:25001});var l=a[0],S=a[1],x=0,T=1,A=2;for(a[0]={s:-1,f:l.f+S.f,l,r:S};T!=m-1;)l=a[a[x].f<a[A].f?x++:A++],S=a[x!=T&&a[x].f<a[A].f?x++:A++],a[T++]={s:-1,f:l.f+S.f,l,r:S};for(var C=n[0].s,s=1;s<m;++s)n[s].s>C&&(C=n[s].s);var $=new Ve(C+1),J=Mo(a[T-1],$,0);if(J>i){var s=0,K=0,ee=J-i,ie=1<<ee;for(n.sort(function(Le,re){return $[re.s]-$[Le.s]||Le.f-re.f});s<m;++s){var U=n[s].s;if($[U]>i)K+=ie-(1<<J-$[U]),$[U]=i;else break}for(K>>=ee;K>0;){var ue=n[s].s;$[ue]<i?K-=1<<i-$[ue]++-1:++s}for(;s>=0&&K;--s){var X=n[s].s;$[X]==i&&(--$[X],++K)}J=i}return{t:new Ee($),l:J}},Mo=function(e,i,a){return e.s==-1?Math.max(Mo(e.l,i,a+1),Mo(e.r,i,a+1)):i[e.s]=a},bi=function(e){for(var i=e.length;i&&!e[--i];);for(var a=new Ve(++i),s=0,m=e[0],n=1,v=function(S){a[s++]=S},l=1;l<=i;++l)if(e[l]==m&&l!=i)++n;else{if(!m&&n>2){for(;n>138;n-=138)v(32754);n>2&&(v(n>10?n-11<<5|28690:n-3<<5|12305),n=0)}else if(n>3){for(v(m),--n;n>6;n-=6)v(8304);n>2&&(v(n-3<<5|8208),n=0)}for(;n--;)v(m);n=1,m=e[l]}return{c:a.subarray(0,s),n:i}},kn=function(e,i){for(var a=0,s=0;s<i.length;++s)a+=e[s]*i[s];return a},Ii=function(e,i,a){var s=a.length,m=Li(i+2);e[m]=s&255,e[m+1]=s>>8,e[m+2]=e[m]^255,e[m+3]=e[m+1]^255;for(var n=0;n<s;++n)e[m+n+4]=a[n];return(m+4+s)*8},wi=function(e,i,a,s,m,n,v,l,S,x,T){ft(i,T++,a),++m[256];for(var A=ko(m,15),C=A.t,$=A.l,J=ko(n,15),K=J.t,ee=J.l,ie=bi(C),U=ie.c,ue=ie.n,X=bi(K),fe=X.c,Le=X.n,re=new Ve(19),G=0;G<U.length;++G)++re[U[G]&31];for(var G=0;G<fe.length;++G)++re[fe[G]&31];for(var R=ko(re,7),ae=R.t,de=R.l,se=19;se>4&&!ae[yi[se-1]];--se);var Ne=x+5<<3,ke=kn(m,Pt)+kn(n,to)+v,ze=kn(m,C)+kn(n,K)+v+14+3*se+kn(re,ae)+2*re[16]+3*re[17]+7*re[18];if(S>=0&&Ne<=ke&&Ne<=ze)return Ii(i,T,e.subarray(S,S+x));var Ze,me,Fe,st;if(ft(i,T,1+(ze<ke)),T+=2,ze<ke){Ze=Sn(C,$,0),me=C,Fe=Sn(K,ee,0),st=K;var rn=Sn(ae,de,0);ft(i,T,ue-257),ft(i,T+5,Le-1),ft(i,T+10,se-4),T+=14;for(var G=0;G<se;++G)ft(i,T+3*G,ae[yi[G]]);T+=3*se;for(var Ue=[U,fe],Ge=0;Ge<2;++Ge)for(var He=Ue[Ge],G=0;G<He.length;++G){var _=He[G]&31;ft(i,T,rn[_]),T+=ae[_],_>15&&(ft(i,T,He[G]>>5&127),T+=He[G]>>12)}}else Ze=wr,me=Pt,Fe=xr,st=to;for(var G=0;G<l;++G){var le=s[G];if(le>255){var _=le>>18&31;En(i,T,Ze[_+257]),T+=me[_+257],_>7&&(ft(i,T,le>>23&31),T+=Ao[_]);var ht=le&31;En(i,T,Fe[ht]),T+=st[ht],ht>3&&(En(i,T,le>>5&8191),T+=Do[ht])}else En(i,T,Ze[le]),T+=me[le]}return En(i,T,Ze[256]),T+me[256]},Er=new Co([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),Ci=new Ee(0),kr=function(e,i,a,s,m,n){var v=n.z||e.length,l=new Ee(s+v+5*(1+Math.ceil(v/7e3))+m),S=l.subarray(s,l.length-m),x=n.l,T=(n.r||0)&7;if(i){T&&(S[0]=n.r>>3);for(var A=Er[i-1],C=A>>13,$=A&8191,J=(1<<a)-1,K=n.p||new Ve(32768),ee=n.h||new Ve(J+1),ie=Math.ceil(a/3),U=2*ie,ue=function($e){return(e[$e]^e[$e+1]<<ie^e[$e+2]<<U)&J},X=new Co(25e3),fe=new Ve(288),Le=new Ve(32),re=0,G=0,R=n.i||0,ae=0,de=n.w||0,se=0;R+2<v;++R){var Ne=ue(R),ke=R&32767,ze=ee[Ne];if(K[ke]=ze,ee[Ne]=ke,de<=R){var Ze=v-R;if((re>7e3||ae>24576)&&(Ze>423||!x)){T=wi(e,S,0,X,fe,Le,G,ae,se,R-se,T),ae=re=G=0,se=R;for(var me=0;me<286;++me)fe[me]=0;for(var me=0;me<30;++me)Le[me]=0}var Fe=2,st=0,rn=$,Ue=ke-ze&32767;if(Ze>2&&Ne==ue(R-Ue))for(var Ge=Math.min(C,Ze)-1,He=Math.min(32767,R),_=Math.min(258,Ze);Ue<=He&&--rn&&ke!=ze;){if(e[R+Fe]==e[R+Fe-Ue]){for(var le=0;le<_&&e[R+le]==e[R+le-Ue];++le);if(le>Fe){if(Fe=le,st=Ue,le>Ge)break;for(var ht=Math.min(Ue,le-2),In=0,me=0;me<ht;++me){var Rt=R-Ue+me&32767,lo=K[Rt],an=Rt-lo&32767;an>In&&(In=an,ze=Rt)}}}ke=ze,ze=K[ke],Ue+=ke-ze&32767}if(st){X[ae++]=268435456|So[Fe]<<18|vi[st];var Cn=So[Fe]&31,Ot=vi[st]&31;G+=Ao[Cn]+Do[Ot],++fe[257+Cn],++Le[Ot],de=R+Fe,++re}else X[ae++]=e[R],++fe[e[R]]}}for(R=Math.max(R,de);R<v;++R)X[ae++]=e[R],++fe[e[R]];T=wi(e,S,x,X,fe,Le,G,ae,se,R-se,T),x||(n.r=T&7|S[T/8|0]<<3,T-=7,n.h=ee,n.p=K,n.i=R,n.w=de)}else{for(var R=n.w||0;R<v+x;R+=65535){var Tt=R+65535;Tt>=v&&(S[T/8|0]=x,Tt=v),T=Ii(S,T+1,e.subarray(R,Tt))}n.i=v}return Mi(l,0,s+Li(T)+m)},Sr=(function(){for(var e=new Int32Array(256),i=0;i<256;++i){for(var a=i,s=9;--s;)a=(a&1&&-306674912)^a>>>1;e[i]=a}return e})(),Lr=function(){var e=-1;return{p:function(i){for(var a=e,s=0;s<i.length;++s)a=Sr[a&255^i[s]]^a>>>8;e=a},d:function(){return~e}}};var Mr=function(e,i,a,s,m){if(!m&&(m={l:1},i.dictionary)){var n=i.dictionary.subarray(-32768),v=new Ee(n.length+e.length);v.set(n),v.set(e,n.length),e=v,m.w=n.length}return kr(e,i.level==null?6:i.level,i.mem==null?m.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+i.mem,a,s,m)},Ai=function(e,i){var a={};for(var s in e)a[s]=e[s];for(var s in i)a[s]=i[s];return a};var Te=function(e,i,a){for(;a;++i)e[i]=a,a>>>=8};function Ir(e,i){return Mr(e,i||{},0,0)}var Di=function(e,i,a,s){for(var m in e){var n=e[m],v=i+m,l=s;Array.isArray(n)&&(l=Ai(s,n[1]),n=n[0]),n instanceof Ee?a[v]=[n,l]:(a[v+="/"]=[new Ee(0),l],Di(n,v,a,s))}},xi=typeof TextEncoder<"u"&&new TextEncoder,Cr=typeof TextDecoder<"u"&&new TextDecoder,Ar=0;try{Cr.decode(Ci,{stream:!0}),Ar=1}catch{}function no(e,i){if(i){for(var a=new Ee(e.length),s=0;s<e.length;++s)a[s]=e.charCodeAt(s);return a}if(xi)return xi.encode(e);for(var m=e.length,n=new Ee(e.length+(e.length>>1)),v=0,l=function(T){n[v++]=T},s=0;s<m;++s){if(v+5>n.length){var S=new Ee(v+8+(m-s<<1));S.set(n),n=S}var x=e.charCodeAt(s);x<128||i?l(x):x<2048?(l(192|x>>6),l(128|x&63)):x>55295&&x<57344?(x=65536+(x&1047552)|e.charCodeAt(++s)&1023,l(240|x>>18),l(128|x>>12&63),l(128|x>>6&63),l(128|x&63)):(l(224|x>>12),l(128|x>>6&63),l(128|x&63))}return Mi(n,0,v)}var Io=function(e){var i=0;if(e)for(var a in e){var s=e[a].length;s>65535&&oo(9),i+=s+4}return i},Ti=function(e,i,a,s,m,n,v,l){var S=s.length,x=a.extra,T=l&&l.length,A=Io(x);Te(e,i,v!=null?33639248:67324752),i+=4,v!=null&&(e[i++]=20,e[i++]=a.os),e[i]=20,i+=2,e[i++]=a.flag<<1|(n<0&&8),e[i++]=m&&8,e[i++]=a.compression&255,e[i++]=a.compression>>8;var C=new Date(a.mtime==null?Date.now():a.mtime),$=C.getFullYear()-1980;if(($<0||$>119)&&oo(10),Te(e,i,$<<25|C.getMonth()+1<<21|C.getDate()<<16|C.getHours()<<11|C.getMinutes()<<5|C.getSeconds()>>1),i+=4,n!=-1&&(Te(e,i,a.crc),Te(e,i+4,n<0?-n-2:n),Te(e,i+8,a.size)),Te(e,i+12,S),Te(e,i+14,A),i+=16,v!=null&&(Te(e,i,T),Te(e,i+6,a.attrs),Te(e,i+10,v),i+=14),e.set(s,i),i+=S,A)for(var J in x){var K=x[J],ee=K.length;Te(e,i,+J),Te(e,i+2,ee),e.set(K,i+4),i+=4+ee}return T&&(e.set(l,i),i+=T),i},Dr=function(e,i,a,s,m){Te(e,i,101010256),Te(e,i+8,a),Te(e,i+10,a),Te(e,i+12,s),Te(e,i+16,m)};function Bi(e,i){i||(i={});var a={},s=[];Di(e,"",a,i);var m=0,n=0;for(var v in a){var l=a[v],S=l[0],x=l[1],T=x.level==0?0:8,A=no(v),C=A.length,$=x.comment,J=$&&no($),K=J&&J.length,ee=Io(x.extra);C>65535&&oo(11);var ie=T?Ir(S,x):S,U=ie.length,ue=Lr();ue.p(S),s.push(Ai(x,{size:S.length,crc:ue.d(),c:ie,f:A,m:J,u:C!=v.length||J&&$.length!=K,o:m,compression:T})),m+=30+C+ee+U,n+=76+2*(C+ee)+(K||0)+U}for(var X=new Ee(n+22),fe=m,Le=n-m,re=0;re<s.length;++re){var A=s[re];Ti(X,A.o,A,A.f,A.u,A.c.length);var G=30+A.f.length+Io(A.extra);X.set(A.c,A.o+G),Ti(X,m,A,A.f,A.u,A.c.length,A.o,A.m),m+=16+G+(A.m?A.m.length:0)}return Dr(X,m,s.length,Le,fe),X}var H={isSignedIn:!1,accessToken:null,userName:null,email:null},Qe=!0,Oe=30,Ke=null,Ft=!1,zt=0,Ye=null,ro=null,ce=null,W=null,Ln=null;function Bo(e){ro=e}function Po(e){ce=e}function zo(e){W=e}function Br(e){Ln=e}var Pi=!1;function Hi(){if(!Pi)try{let e=document.createElement("style");e.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(e),Pi=!0}catch{}}var Fo=null,en=null,tn=null;function Pr(e){Fo=e}function zr(e){en=e}function Fr(e){tn=e}var zi="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",Hr="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",$r="https://www.youtube.com/",Rr=30*1e3,Or=1800*1e3,Fi=5,io=null,We=null;async function ao(){try{let e=await tn("googleAuthState");e&&typeof e=="object"&&(H={...H,...e},on(),H.isSignedIn&&H.accessToken&&await $t(!0))}catch(e){c("Failed to load Google auth state:",e,"error")}}async function Mn(){try{await en("googleAuthState",H)}catch(e){c("Failed to save Google auth state:",e,"error")}}function on(){ro&&(ro.style.display="none")}function De(e,i){if(W){if(W.style.fontWeight="bold",e==="authenticating"){for(Hi(),W.style.color="#ffa500";W.firstChild;)W.removeChild(W.firstChild);let a=document.createElement("span");a.className="tk-auth-spinner";let s=document.createTextNode(` ${i||"Authorizing with Google\u2026"}`);W.appendChild(a),W.appendChild(s);return}if(e==="error"){W.textContent=`\u274C ${i||"Authorization failed"}`,W.style.color="#ff4d4f",Be();return}H.isSignedIn?(W.textContent="\u2705 Signed in",W.style.color="#52c41a",W.removeAttribute("title"),H.userName?(W.onmouseenter=()=>{W.textContent=`\u2705 Signed in as ${H.userName}`},W.onmouseleave=()=>{W.textContent="\u2705 Signed in"}):(W.onmouseenter=null,W.onmouseleave=null)):(W.textContent="\u274C Not signed in",W.style.color="#ff4d4f",W.removeAttribute("title"),W.onmouseenter=null,W.onmouseleave=null),Be()}}function $i(){W&&(Hi(),W.classList.remove("tk-auth-blink"),W.offsetWidth,W.classList.add("tk-auth-blink"),setTimeout(()=>{W.classList.remove("tk-auth-blink")},1200))}function Nr(e){return new Promise((i,a)=>{if(!e){c&&c("OAuth monitor: popup is null",null,"error"),a(new Error("Failed to open popup"));return}c&&c("OAuth monitor: starting to monitor popup for token");let s=Date.now(),m=300*1e3,n="timekeeper_oauth",v=null,l=null,S=null,x=()=>{if(v){try{v.close()}catch{}v=null}l&&(clearInterval(l),l=null),S&&(clearInterval(S),S=null)};try{v=new BroadcastChannel(n),c&&c("OAuth monitor: BroadcastChannel created successfully"),v.onmessage=C=>{if(c&&c("OAuth monitor: received BroadcastChannel message",C.data),C.data?.type==="timekeeper_oauth_token"&&C.data?.token){c&&c("OAuth monitor: token received via BroadcastChannel"),x();try{e.close()}catch{}i(C.data.token)}else if(C.data?.type==="timekeeper_oauth_error"){c&&c("OAuth monitor: error received via BroadcastChannel",C.data.error,"error"),x();try{e.close()}catch{}a(new Error(C.data.error||"OAuth failed"))}}}catch(C){c&&c("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",C)}c&&c("OAuth monitor: setting up IndexedDB polling");let T=Date.now();l=setInterval(async()=>{try{let C=indexedDB.open("ytls-timestamps-db",3);C.onsuccess=()=>{let $=C.result,ee=$.transaction("settings","readonly").objectStore("settings").get("oauth_message");ee.onsuccess=()=>{let ie=ee.result;if(ie&&ie.value){let U=ie.value;if(U.timestamp&&U.timestamp>T){if(c&&c("OAuth monitor: received IndexedDB message",U),U.type==="timekeeper_oauth_token"&&U.token){c&&c("OAuth monitor: token received via IndexedDB"),x();try{e.close()}catch{}$.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),i(U.token)}else if(U.type==="timekeeper_oauth_error"){c&&c("OAuth monitor: error received via IndexedDB",U.error,"error"),x();try{e.close()}catch{}$.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),a(new Error(U.error||"OAuth failed"))}T=U.timestamp}}$.close()}}}catch(C){c&&c("OAuth monitor: IndexedDB polling error",C,"error")}},500),S=setInterval(()=>{if(Date.now()-s>m){c&&c("OAuth monitor: popup timed out after 5 minutes",null,"error"),x();try{e.close()}catch{}a(new Error("OAuth popup timed out"));return}},1e3)})}async function Ho(){if(!zi){De("error","Google Client ID not configured");return}try{c&&c("OAuth signin: starting OAuth flow"),De("authenticating","Opening authentication window...");let e=new URL("https://accounts.google.com/o/oauth2/v2/auth");e.searchParams.set("client_id",zi),e.searchParams.set("redirect_uri",$r),e.searchParams.set("response_type","token"),e.searchParams.set("scope",Hr),e.searchParams.set("include_granted_scopes","true"),e.searchParams.set("state","timekeeper_auth"),c&&c("OAuth signin: opening popup");let i=window.open(e.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!i){c&&c("OAuth signin: popup blocked by browser",null,"error"),De("error","Popup blocked. Please enable popups for YouTube.");return}c&&c("OAuth signin: popup opened successfully"),De("authenticating","Waiting for authentication...");try{let a=await Nr(i),s=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${a}`}});if(s.ok){let m=await s.json();H.accessToken=a,H.isSignedIn=!0,H.userName=m.name,H.email=m.email,await Mn(),on(),De(),Be(),await $t(),c?c(`Successfully authenticated as ${m.name}`):console.log(`[Timekeeper] Successfully authenticated as ${m.name}`)}else throw new Error("Failed to fetch user info")}catch(a){let s=a instanceof Error?a.message:"Authentication failed";c?c("OAuth failed:",a,"error"):console.error("[Timekeeper] OAuth failed:",a),De("error",s);return}}catch(e){let i=e instanceof Error?e.message:"Sign in failed";c?c("Failed to sign in to Google:",e,"error"):console.error("[Timekeeper] Failed to sign in to Google:",e),De("error",`Failed to sign in: ${i}`)}}async function $o(){if(!window.opener||window.opener===window)return!1;c&&c("OAuth popup: detected popup window, checking for OAuth response");let e=window.location.hash;if(!e||e.length<=1)return c&&c("OAuth popup: no hash params found"),!1;let i=e.startsWith("#")?e.substring(1):e,a=new URLSearchParams(i),s=a.get("state");if(c&&c("OAuth popup: hash params found, state="+s),s!=="timekeeper_auth")return c&&c("OAuth popup: not our OAuth flow (wrong state)"),!1;let m=a.get("error"),n=a.get("access_token"),v="timekeeper_oauth";if(m){try{let l=new BroadcastChannel(v);l.postMessage({type:"timekeeper_oauth_error",error:a.get("error_description")||m}),l.close()}catch{let S={type:"timekeeper_oauth_error",error:a.get("error_description")||m,timestamp:Date.now()},x=indexedDB.open("ytls-timestamps-db",3);x.onsuccess=()=>{let T=x.result;T.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:S}),T.close()}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(n){c&&c("OAuth popup: access token found, broadcasting to opener");try{let l=new BroadcastChannel(v);l.postMessage({type:"timekeeper_oauth_token",token:n}),l.close(),c&&c("OAuth popup: token broadcast via BroadcastChannel")}catch(l){c&&c("OAuth popup: BroadcastChannel failed, using IndexedDB",l);let S={type:"timekeeper_oauth_token",token:n,timestamp:Date.now()},x=indexedDB.open("ytls-timestamps-db",3);x.onsuccess=()=>{let T=x.result;T.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:S}),T.close()},c&&c("OAuth popup: token broadcast via IndexedDB")}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function Ur(){return!1}async function Ro(){H={isSignedIn:!1,accessToken:null,userName:null,email:null},await Mn(),on(),De(),Be()}async function Oo(){if(!H.isSignedIn||!H.accessToken)return!1;try{let e=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${H.accessToken}`}});return e.status===401?(await Ri({silent:!0}),!1):e.ok}catch(e){return c("Failed to verify auth state:",e,"error"),!1}}async function Gr(e){let i={Authorization:`Bearer ${e}`},s=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,m=await fetch(s,{headers:i});if(m.status===401)throw new Error("unauthorized");if(!m.ok)throw new Error("drive search failed");let n=await m.json();if(Array.isArray(n.files)&&n.files.length>0)return n.files[0].id;let v=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...i,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(v.status===401)throw new Error("unauthorized");if(!v.ok)throw new Error("drive folder create failed");return(await v.json()).id}async function _r(e,i,a){let s=`name='${e}' and '${i}' in parents and trashed=false`,m=encodeURIComponent(s),n=await fetch(`https://www.googleapis.com/drive/v3/files?q=${m}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${a}`}});if(n.status===401)throw new Error("unauthorized");if(!n.ok)return null;let v=await n.json();return v.files&&v.files.length>0?v.files[0].id:null}function qr(e,i){let a=no(e),s=i.replace(/\\/g,"/").replace(/^\/+/,"");return s.endsWith(".json")||(s+=".json"),Bi({[s]:[a,{level:6,mtime:new Date,os:0}]})}async function jr(e,i,a,s){let m=e.replace(/\.json$/,".zip"),n=await _r(m,a,s),v=new TextEncoder().encode(i).length,l=qr(i,e),S=l.length;c(`Compressing data: ${v} bytes -> ${S} bytes (${Math.round(100-S/v*100)}% reduction)`);let x="-------314159265358979",T=`\r
--${x}\r
`,A=`\r
--${x}--`,C=n?{name:m,mimeType:"application/zip"}:{name:m,mimeType:"application/zip",parents:[a]},$=8192,J="";for(let X=0;X<l.length;X+=$){let fe=l.subarray(X,Math.min(X+$,l.length));J+=String.fromCharCode.apply(null,Array.from(fe))}let K=btoa(J),ee=T+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify(C)+T+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+K+A,ie,U;n?(ie=`https://www.googleapis.com/upload/drive/v3/files/${n}?uploadType=multipart&fields=id,name`,U="PATCH"):(ie="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",U="POST");let ue=await fetch(ie,{method:U,headers:{Authorization:`Bearer ${s}`,"Content-Type":`multipart/related; boundary=${x}`},body:ee});if(ue.status===401)throw new Error("unauthorized");if(!ue.ok)throw new Error("drive upload failed")}async function Ri(e){c("Auth expired, clearing token",null,"warn"),H.isSignedIn=!1,H.accessToken=null,await Mn(),De("error","Authorization expired. Please sign in again."),Be()}async function Oi(e){if(!H.isSignedIn||!H.accessToken){e?.silent||De("error","Please sign in to Google Drive first");return}try{let{json:i,filename:a,totalVideos:s,totalTimestamps:m}=await Fo();if(m===0){e?.silent||c("Skipping export: no timestamps to back up");return}let n=await Gr(H.accessToken);await jr(a,i,n,H.accessToken),c(`Exported to Google Drive (${a}) with ${s} videos / ${m} timestamps.`)}catch(i){throw i.message==="unauthorized"?(await Ri({silent:e?.silent}),i):(c("Drive export failed:",i,"error"),e?.silent||De("error","Failed to export to Google Drive."),i)}}async function No(){try{let e=await tn("autoBackupEnabled"),i=await tn("autoBackupIntervalMinutes"),a=await tn("lastAutoBackupAt");typeof e=="boolean"&&(Qe=e),typeof i=="number"&&i>0&&(Oe=i),typeof a=="number"&&a>0&&(Ke=a)}catch(e){c("Failed to load auto backup settings:",e,"error")}}async function so(){try{await en("autoBackupEnabled",Qe),await en("autoBackupIntervalMinutes",Oe),await en("lastAutoBackupAt",Ke??0)}catch(e){c("Failed to save auto backup settings:",e,"error")}}function Vr(){io&&(clearInterval(io),io=null),We&&(clearTimeout(We),We=null)}function Ht(e){try{let i=new Date(e),a=new Date,s=i.toDateString()===a.toDateString(),m=i.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return s?m:`${i.toLocaleDateString()} ${m}`}catch{return""}}function Ni(){return Qe?Ft?"#4285f4":Ye&&Ye>0?"#ffa500":H.isSignedIn&&Ke?"#52c41a":H.isSignedIn?"#ffa500":"#ff4d4f":"#ff4d4f"}function Be(){if(!ce)return;let e="",i="";if(!Qe)e="\u{1F501} Backup: Off",ce.onmouseenter=null,ce.onmouseleave=null;else if(Ft)e="\u{1F501} Backing up\u2026",ce.onmouseenter=null,ce.onmouseleave=null;else if(Ye&&Ye>0)e=`\u26A0\uFE0F Retry in ${Math.ceil(Ye/6e4)}m`,ce.onmouseenter=null,ce.onmouseleave=null;else if(Ke){e=`\u{1F5C4}\uFE0F Last backup: ${Ht(Ke)}`;let a=Ke+Math.max(1,Oe)*60*1e3;i=`\u{1F5C4}\uFE0F Next backup: ${Ht(a)}`,ce.onmouseenter=()=>{ce.textContent=i},ce.onmouseleave=()=>{ce.textContent=e}}else{e="\u{1F5C4}\uFE0F Last backup: never";let a=Date.now()+Math.max(1,Oe)*60*1e3;i=`\u{1F5C4}\uFE0F Next backup: ${Ht(a)}`,ce.onmouseenter=()=>{ce.textContent=i},ce.onmouseleave=()=>{ce.textContent=e}}ce.textContent=e,ce.style.display=e?"inline":"none";try{let a=Ni();ce.style.color=a}catch{}Ui()}function Ui(){if(!Ln)return;let e=Ni();Ln.style.backgroundColor=e,rt(Ln,()=>{let i="";if(!Qe)i="Auto backup is disabled";else if(Ft)i="Backup in progress";else if(Ye&&Ye>0)i=`Retrying backup in ${Math.ceil(Ye/6e4)}m`;else if(H.isSignedIn&&Ke){let a=Ke+Math.max(1,Oe)*60*1e3,s=Ht(a);i=`Last backup: ${Ht(Ke)}
Next backup: ${s}`}else if(H.isSignedIn){let a=Date.now()+Math.max(1,Oe)*60*1e3;i=`No backup yet
Next backup: ${Ht(a)}`}else i="Not signed in to Google Drive";return i})}async function nn(e=!0){if(!H.isSignedIn||!H.accessToken){e||$i();return}if(We){c("Auto backup: backoff in progress, skipping scheduled run");return}if(!Ft){Ft=!0,Be();try{await Oi({silent:e}),Ke=Date.now(),zt=0,Ye=null,We&&(clearTimeout(We),We=null),await so()}catch(i){if(c("Auto backup failed:",i,"error"),i.message==="unauthorized")c("Auth error detected, clearing token and stopping retries",null,"warn"),H.isSignedIn=!1,H.accessToken=null,await Mn(),De("error","Authorization expired. Please sign in again."),Be(),zt=0,Ye=null,We&&(clearTimeout(We),We=null);else if(zt<Fi){zt+=1;let m=Math.min(Rr*Math.pow(2,zt-1),Or);Ye=m,We&&clearTimeout(We),We=setTimeout(()=>{nn(!0)},m),c(`Scheduling backup retry ${zt}/${Fi} in ${Math.round(m/1e3)}s`),Be()}else Ye=null}finally{Ft=!1,Be()}}}async function $t(e=!1){if(Vr(),!!Qe&&!(!H.isSignedIn||!H.accessToken)){if(io=setInterval(()=>{nn(!0)},Math.max(1,Oe)*60*1e3),!e){let i=Date.now(),a=Math.max(1,Oe)*60*1e3;(!Ke||i-Ke>=a)&&nn(!0)}Be()}}async function Uo(){Qe=!Qe,await so(),await $t(),Be()}async function Go(){let e=prompt("Set Auto Backup interval (minutes):",String(Oe));if(e===null)return;let i=Math.floor(Number(e));if(!Number.isFinite(i)||i<5||i>1440){alert("Please enter a number between 5 and 1440 minutes.");return}Oe=i,await so(),await $t(),Be()}var Pe=_o,at=()=>window,qo=window.location.hash;if(qo&&qo.length>1){let e=new URLSearchParams(qo.substring(1));if(e.get("state")==="timekeeper_auth"){let a=e.get("access_token");if(a){console.log("[Timekeeper] Auth token detected in URL, broadcasting token"),console.log("[Timekeeper] Token length:",a.length,"characters");try{let s=new BroadcastChannel("timekeeper_oauth"),m={type:"timekeeper_oauth_token",token:a};console.log("[Timekeeper] Sending auth message via BroadcastChannel:",{type:m.type,tokenLength:a.length}),s.postMessage(m),s.close(),console.log("[Timekeeper] Token broadcast via BroadcastChannel completed")}catch(s){console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",s);let m={type:"timekeeper_oauth_token",token:a,timestamp:Date.now()},n=indexedDB.open("ytls-timestamps-db",3);n.onsuccess=()=>{let v=n.result,l=v.transaction("settings","readwrite");l.objectStore("settings").put({key:"oauth_message",value:m}),l.oncomplete=()=>{console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",m.timestamp),v.close()}}}if(history.replaceState){let s=window.location.pathname+window.location.search;history.replaceState(null,"",s)}throw console.log("[Timekeeper] Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}(async function(){"use strict";if(window.top!==window.self)return;function e(t){return GM.getValue(`timekeeper_${t}`,void 0)}function i(t,o){return GM.setValue(`timekeeper_${t}`,JSON.stringify(o))}if(Pe.setLoadGlobalSettings?.(e),Pe.setSaveGlobalSettings?.(i),await $o()){c("OAuth popup detected, broadcasting token and closing");return}await ao();let s=["/watch","/live"];function m(t=window.location.href){try{let o=new URL(t);return o.origin!=="https://www.youtube.com"?!1:s.some(r=>o.pathname===r||o.pathname.startsWith(`${r}/`))}catch(o){return c("Timekeeper failed to parse URL for support check:",o,"error"),!1}}let n=null,v=null,l=null,S=null,x=null,T=null,A=null,C=null,$=250,J=null,K=!1;function ee(){return n?n.getBoundingClientRect():null}function ie(t,o,r){t&&(Re={x:Math.round(typeof o=="number"?o:t.left),y:Math.round(typeof r=="number"?r:t.top),width:Math.round(t.width),height:Math.round(t.height)})}function U(t=!0){if(!n)return;Gt();let o=ee();o&&(o.width||o.height)&&(ie(o),t&&(Yn("windowPosition",Re),sn({type:"window_position_updated",position:Re,timestamp:Date.now()})))}function ue(){if(!n||!v||!S||!l)return;let t=40,o=ne();if(o.length>0)t=o[0].offsetHeight;else{let r=document.createElement("li");r.style.visibility="hidden",r.style.position="absolute",r.textContent="00:00 Example",l.appendChild(r),t=r.offsetHeight,l.removeChild(r)}$=v.offsetHeight+S.offsetHeight+t,n.style.minHeight=$+"px"}function X(){requestAnimationFrame(()=>{let t=at();typeof t.recalculateTimestampsArea=="function"&&t.recalculateTimestampsArea(),ue(),U(!0)})}function fe(t=450){pe&&(clearTimeout(pe),pe=null),pe=setTimeout(()=>{R(),X(),pe=null},t)}function Le(){pe&&(clearTimeout(pe),pe=null)}function re(){l&&(l.style.visibility="hidden",c("Hiding timestamps during show animation")),X(),fe()}function G(){R(),Le(),et&&(clearTimeout(et),et=null),et=setTimeout(()=>{n&&(n.style.display="none",ai(),et=null)},400)}function R(){if(!l){_e&&(_e(),_e=null,lt=null,gt=null);return}if(!gt){l.style.visibility==="hidden"&&(l.style.visibility="",c("Restoring timestamp visibility (no deferred fragment)")),_e&&(_e(),_e=null,lt=null);return}c("Appending deferred timestamps after animation"),l.appendChild(gt),gt=null,l.style.visibility==="hidden"&&(l.style.visibility="",c("Restoring timestamp visibility after append")),_e&&(_e(),_e=null,lt=null),ot(),Me();let t=at();typeof t.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>t.recalculateTimestampsArea());let o=_(),r=o?Math.floor(o.getCurrentTime()):St();Number.isFinite(r)&&It(r,!1)}let ae=null,de=!1,se="ytls-timestamp-pending-delete",Ne="ytls-timestamp-highlight",ke="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_64px_Indexed.png",ze="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_Eyebrow_64px_Indexed.png";function Ze(){let t=o=>{let r=new Image;r.src=o};t(ke),t(ze)}Ze();async function me(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(t=>setTimeout(t,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(t=>setTimeout(t,100));await new Promise(t=>setTimeout(t,200))}let Fe=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],st=5e3,rn=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function Ue(t){return rn.has(t)}function Ge(){return document.querySelector("video")}let He=null;function _(){if(He&&document.contains(He))return He;let t=document.getElementById("movie_player");return t&&document.contains(t)?t:null}function le(t){return Fe.every(o=>typeof t?.[o]=="function"?!0:Ue(o)?!!Ge():!1)}function ht(t){return Fe.filter(o=>typeof t?.[o]=="function"?!1:Ue(o)?!Ge():!0)}async function In(t=st){let o=Date.now();for(;Date.now()-o<t;){let d=_();if(le(d))return d;await new Promise(h=>setTimeout(h,100))}let r=_();return le(r),r}let Rt="timestampOffsetSeconds",lo=-5,an="shiftClickTimeSkipSeconds",Cn=10,Ot=300,Tt=300,$e=null;function jo(){try{return new URL(window.location.href).origin==="https://www.youtube.com"}catch{return!1}}function Vo(){if(jo()&&!$e)try{$e=new BroadcastChannel("ytls_timestamp_channel"),$e.onmessage=Wo}catch(t){c("Failed to create BroadcastChannel:",t,"warn"),$e=null}}function sn(t){if(!jo()){c("Skipping BroadcastChannel message: not on https://www.youtube.com","warn");return}if(Vo(),!$e){c("No BroadcastChannel available to post message","warn");return}try{$e.postMessage(t)}catch(o){c("BroadcastChannel error, reopening:",o,"warn");try{$e=new BroadcastChannel("ytls_timestamp_channel"),$e.onmessage=Wo,$e.postMessage(t)}catch(r){c("Failed to reopen BroadcastChannel:",r,"error")}}}function Wo(t){if(c("Received message from another tab:",t.data),!(!m()||!l||!n)&&t.data){if(t.data.type==="timestamps_updated"&&t.data.videoId===he)c("Debouncing timestamp load due to external update for video:",t.data.videoId),clearTimeout(cn),cn=setTimeout(()=>{c("Reloading timestamps due to external update for video:",t.data.videoId),ni()},500);else if(t.data.type==="window_position_updated"&&n){let o=t.data.position;if(o&&typeof o.x=="number"&&typeof o.y=="number"){n.style.left=`${o.x}px`,n.style.top=`${o.y}px`,n.style.right="auto",n.style.bottom="auto",typeof o.width=="number"&&o.width>0&&(n.style.width=`${o.width}px`),typeof o.height=="number"&&o.height>0&&(n.style.height=`${o.height}px`);let r=n.getBoundingClientRect();Re={x:Math.round(o.x),y:Math.round(o.y),width:Math.round(r.width),height:Math.round(r.height)};let d=document.documentElement.clientWidth,h=document.documentElement.clientHeight;(r.left<0||r.top<0||r.right>d||r.bottom>h)&&Gt()}}}}Vo();let Nt=await GM.getValue(Rt);(typeof Nt!="number"||Number.isNaN(Nt))&&(Nt=lo,await GM.setValue(Rt,Nt));let ln=await GM.getValue(an);(typeof ln!="number"||Number.isNaN(ln))&&(ln=Cn,await GM.setValue(an,ln));let cn=null,Et=new Map,An=!1,P=null,Dn=null,he=null,et=null,pe=null,gt=null,lt=null,_e=null,yt=null,Bn=!1,Re=null,co=!1,Pn=null,zn=null,Fn=null,Hn=null,$n=null,Rn=null,On=null,un=null,dn=null,mn=null,tt=null,nt=null,Yo=0,pn=!1,kt=null,fn=null;function ne(){return l?Array.from(l.querySelectorAll("li")).filter(t=>!!t.querySelector("a[data-time]")):[]}function uo(){return ne().map(t=>{let o=t.querySelector("a[data-time]"),r=o?.dataset.time;if(!o||!r)return null;let d=Number.parseInt(r,10);if(!Number.isFinite(d))return null;let g=t.querySelector("input")?.value??"",u=t.dataset.guid??crypto.randomUUID();return t.dataset.guid||(t.dataset.guid=u),{start:d,comment:g,guid:u}}).filter(Zo)}function St(){if(fn!==null)return fn;let t=ne();return fn=t.length>0?Math.max(...t.map(o=>{let r=o.querySelector("a[data-time]")?.getAttribute("data-time");return r?Number.parseInt(r,10):0})):0,fn}function Nn(){fn=null}function Gi(t){let o=t.querySelector(".time-diff");return o?(o.textContent?.trim()||"").startsWith("-"):!1}function _i(t,o){return t?o?"\u2514\u2500 ":"\u251C\u2500 ":""}function hn(t){return t.startsWith("\u251C\u2500 ")||t.startsWith("\u2514\u2500 ")?1:0}function Ko(t){return t.replace(/^[├└]─\s/,"")}function qi(t){let o=ne();if(t>=o.length-1)return"\u2514\u2500 ";let r=o[t+1].querySelector("input");return r&&hn(r.value)===1?"\u251C\u2500 ":"\u2514\u2500 "}function ot(){if(!l)return;let t=ne(),o=!0,r=0,d=t.length;for(;o&&r<d;)o=!1,r++,t.forEach((h,g)=>{let u=h.querySelector("input");if(!u||!(hn(u.value)===1))return;let E=!1;if(g<t.length-1){let z=t[g+1].querySelector("input");z&&(E=!(hn(z.value)===1))}else E=!0;let k=Ko(u.value),M=`${_i(!0,E)}${k}`;u.value!==M&&(u.value=M,o=!0)})}function Lt(){if(l){for(;l.firstChild;)l.removeChild(l.firstChild);gt&&(gt=null),_e&&(_e(),_e=null,lt=null)}}function gn(){if(!l||de||gt)return;Array.from(l.children).some(o=>!o.classList.contains("ytls-placeholder")&&!o.classList.contains("ytls-error-message"))||mo("No timestamps for this video")}function mo(t){if(!l)return;Lt();let o=document.createElement("li");o.className="ytls-placeholder",o.textContent=t,l.appendChild(o),l.style.overflowY="hidden"}function po(){if(!l)return;let t=l.querySelector(".ytls-placeholder");t&&t.remove(),l.style.overflowY=""}function fo(t){if(!(!n||!l)){if(de=t,t)n.style.display="",n.classList.remove("ytls-fade-out"),n.classList.add("ytls-fade-in"),mo("Loading timestamps...");else if(po(),n.style.display="",n.classList.remove("ytls-fade-out"),n.classList.add("ytls-fade-in"),x){let o=_();if(o){let r=o.getCurrentTime(),d=Number.isFinite(r)?Math.max(0,Math.floor(r)):Math.max(0,St()),h=Math.floor(d/3600),g=Math.floor(d/60)%60,u=d%60,{isLive:y}=o.getVideoData()||{isLive:!1},E=l?ne().map(L=>{let M=L.querySelector("a[data-time]");return M?parseFloat(M.getAttribute("data-time")??"0"):0}):[],k="";if(E.length>0)if(y){let L=Math.max(1,d/60),M=E.filter(z=>z<=d);if(M.length>0){let z=(M.length/L).toFixed(2);parseFloat(z)>0&&(k=` (${z}/min)`)}}else{let L=o.getDuration(),M=Number.isFinite(L)&&L>0?L:0,z=Math.max(1,M/60),oe=(E.length/z).toFixed(1);parseFloat(oe)>0&&(k=` (${oe}/min)`)}x.textContent=`\u23F3${h?h+":"+String(g).padStart(2,"0"):g}:${String(u).padStart(2,"0")}${k}`}}!de&&l&&!l.querySelector(".ytls-error-message")&&gn(),ct()}}function Zo(t){return!!t&&Number.isFinite(t.start)&&typeof t.comment=="string"&&typeof t.guid=="string"}function Un(t,o){t.textContent=wt(o),t.dataset.time=String(o),t.href=To(o,window.location.href)}let Gn=null,_n=null,Mt=!1;function ji(t){if(!t||typeof t.getVideoData!="function"||!t.getVideoData()?.isLive)return!1;if(typeof t.getProgressState=="function"){let r=t.getProgressState(),d=Number(r?.seekableEnd??r?.liveHead??r?.head??r?.duration),h=Number(r?.current??t.getCurrentTime?.());if(Number.isFinite(d)&&Number.isFinite(h))return d-h>2}return!1}function It(t,o){if(!Number.isFinite(t))return;let r=qn(t);yn(r,o)}function qn(t){if(!Number.isFinite(t))return null;let o=ne();if(o.length===0)return null;let r=null,d=-1/0;for(let h of o){let u=h.querySelector("a[data-time]")?.dataset.time;if(!u)continue;let y=Number.parseInt(u,10);Number.isFinite(y)&&y<=t&&y>d&&(d=y,r=h)}return r}function yn(t,o=!1){if(!t)return;if(ne().forEach(d=>{d.classList.contains(se)||d.classList.remove(Ne)}),!t.classList.contains(se)&&(t.classList.add(Ne),o&&!An))try{if(l instanceof HTMLElement){let d=t.getBoundingClientRect(),h=l.getBoundingClientRect();!(d.bottom<h.top||d.top>h.bottom)||t.scrollIntoView({behavior:"smooth",block:"center"})}else t.scrollIntoView({behavior:"smooth",block:"center"})}catch{try{t.scrollIntoView({behavior:"smooth",block:"center"})}catch{}}}function Vi(t){if(!l||l.querySelector(".ytls-error-message")||!Number.isFinite(t)||t===0)return!1;let o=ne();if(o.length===0)return!1;let r=!1;return o.forEach(d=>{let h=d.querySelector("a[data-time]"),g=h?.dataset.time;if(!h||!g)return;let u=Number.parseInt(g,10);if(!Number.isFinite(u))return;let y=Math.max(0,u+t);y!==u&&(Un(h,y),r=!0)}),r?(bn(),ot(),Me(),Vn(he),kt=null,!0):!1}function Jo(t,o={}){if(!Number.isFinite(t)||t===0)return!1;if(!Vi(t)){if(o.alertOnNoChange){let u=o.failureMessage??"Offset did not change any timestamps.";alert(u)}return!1}let d=o.logLabel??"bulk offset";c(`Timestamps changed: Offset all timestamps by ${t>0?"+":""}${t} seconds (${d})`);let h=_(),g=h?Math.floor(h.getCurrentTime()):0;if(Number.isFinite(g)){let u=qn(g);yn(u,!1)}return!0}function Xo(t){if(!l||de)return;let o=t.target instanceof HTMLElement?t.target:null;if(o)if(o.dataset.time){t.preventDefault();let r=Number(o.dataset.time);if(Number.isFinite(r)){Mt=!0;let h=_();h&&h.seekTo(r),setTimeout(()=>{Mt=!1},500)}let d=o.closest("li");d&&(ne().forEach(h=>{h.classList.contains(se)||h.classList.remove(Ne)}),d.classList.contains(se)||(d.classList.add(Ne),d.scrollIntoView({behavior:"smooth",block:"center"})))}else if(o.dataset.increment){t.preventDefault();let d=o.parentElement?.querySelector("a[data-time]");if(!d||!d.dataset.time)return;let h=parseInt(d.dataset.time,10),g=parseInt(o.dataset.increment,10);if("shiftKey"in t&&t.shiftKey&&(g*=ln),"altKey"in t?t.altKey:!1){Jo(g,{logLabel:"Alt adjust"});return}let E=Math.max(0,h+g);c(`Timestamps changed: Timestamp time incremented from ${h} to ${E}`),Un(d,E),Nn();let k=o.closest("li");if(_n=E,Gn&&clearTimeout(Gn),Mt=!0,Gn=setTimeout(()=>{if(_n!==null){let L=_();L&&L.seekTo(_n)}Gn=null,_n=null,setTimeout(()=>{Mt=!1},500)},500),bn(),ot(),Me(),k){let L=k.querySelector("input"),M=k.dataset.guid;L&&M&&(Ut(he,M,E,L.value),kt=M)}}else o.dataset.action==="clear"&&(t.preventDefault(),c("Timestamps changed: All timestamps cleared from UI"),l.textContent="",Nn(),Me(),jn(),Vn(he,{allowEmpty:!0}),kt=null,gn())}function vn(t,o="",r=!1,d=null,h=!0){if(!l)return null;let g=Math.max(0,t),u=d??crypto.randomUUID(),y=document.createElement("li"),E=document.createElement("div"),k=document.createElement("span"),L=document.createElement("span"),M=document.createElement("span"),z=document.createElement("a"),oe=document.createElement("span"),O=document.createElement("input"),q=document.createElement("button");y.dataset.guid=u,E.className="time-row";let Ie=document.createElement("div");Ie.style.cssText="position:absolute;left:0;top:0;width:20px;height:100%;display:flex;align-items:center;justify-content:center;cursor:pointer;",rt(Ie,"Click to toggle indent");let be=document.createElement("span");be.style.cssText="color:#999;font-size:12px;pointer-events:none;display:none;";let we=()=>{let te=hn(O.value);be.textContent=te===1?"\u25C0":"\u25B6"},vt=te=>{te.stopPropagation();let j=hn(O.value),ge=Ko(O.value),xe=j===0?1:0,Q="";if(xe===1){let Je=ne().indexOf(y);Q=qi(Je)}O.value=`${Q}${ge}`,we(),ot();let ye=Number.parseInt(z.dataset.time??"0",10);Ut(he,u,ye,O.value)};Ie.onclick=vt,Ie.append(be),y.style.cssText="position:relative;padding-left:20px;",y.addEventListener("mouseenter",()=>{we(),be.style.display="inline"}),y.addEventListener("mouseleave",()=>{be.style.display="none"}),y.addEventListener("mouseleave",()=>{y.dataset.guid===kt&&Gi(y)&&Qo()}),O.value=o||"",O.style.cssText="width:100%;margin-top:5px;display:block;",O.type="text",O.setAttribute("inputmode","text"),O.setAttribute("autocapitalize","off"),O.autocomplete="off",O.spellcheck=!1,O.addEventListener("focusin",()=>{pn=!1}),O.addEventListener("focusout",te=>{let j=te.relatedTarget,ge=Date.now()-Yo<250,xe=!!j&&!!n&&n.contains(j);!ge&&!xe&&(pn=!0,setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(O.focus({preventScroll:!0}),pn=!1)},0))}),O.addEventListener("input",te=>{let j=te;if(j&&(j.isComposing||j.inputType==="insertCompositionText"))return;let ge=Et.get(u);ge&&clearTimeout(ge);let xe=setTimeout(()=>{let Q=Number.parseInt(z.dataset.time??"0",10);Ut(he,u,Q,O.value),Et.delete(u)},500);Et.set(u,xe)}),O.addEventListener("compositionend",()=>{let te=Number.parseInt(z.dataset.time??"0",10);setTimeout(()=>{Ut(he,u,te,O.value)},50)}),k.textContent="\u2796",k.dataset.increment="-1",k.style.cursor="pointer",k.style.margin="0px",k.addEventListener("mouseenter",()=>{k.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),k.addEventListener("mouseleave",()=>{k.style.textShadow="none"}),M.textContent="\u2795",M.dataset.increment="1",M.style.cursor="pointer",M.style.margin="0px",M.addEventListener("mouseenter",()=>{M.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),M.addEventListener("mouseleave",()=>{M.style.textShadow="none"}),L.textContent="\u23FA\uFE0F",L.style.cursor="pointer",L.style.margin="0px",rt(L,"Set to current playback time"),L.addEventListener("mouseenter",()=>{L.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),L.addEventListener("mouseleave",()=>{L.style.textShadow="none"}),L.onclick=()=>{let te=_(),j=te?Math.floor(te.getCurrentTime()):0;Number.isFinite(j)&&(c(`Timestamps changedset to current playback time ${j}`),Un(z,j),bn(),ot(),Ut(he,u,j,O.value),kt=u)},Un(z,g),Nn(),q.textContent="\u{1F5D1}\uFE0F",q.style.cssText="background:transparent;border:none;color:white;cursor:pointer;margin-left:5px;",q.addEventListener("mouseenter",()=>{q.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(255, 100, 100, 0.6)"}),q.addEventListener("mouseleave",()=>{q.style.textShadow="none"}),q.onclick=()=>{let te=null,j=null,ge=null,xe=()=>{try{y.removeEventListener("click",j,!0)}catch{}try{document.removeEventListener("click",j,!0)}catch{}if(l)try{l.removeEventListener("mouseleave",ge)}catch{}te&&(clearTimeout(te),te=null)};if(y.dataset.deleteConfirmed==="true"){c("Timestamps changed: Timestamp deleted");let Q=y.dataset.guid??"",ye=Et.get(Q);ye&&(clearTimeout(ye),Et.delete(Q)),xe(),y.remove(),Nn(),bn(),ot(),Me(),jn(),Wi(he,Q),kt=null,gn()}else{y.dataset.deleteConfirmed="true",y.classList.add(se),y.classList.remove(Ne);let Q=()=>{y.dataset.deleteConfirmed="false",y.classList.remove(se);let ye=_(),it=ye?ye.getCurrentTime():0,Je=Number.parseInt(y.querySelector("a[data-time]")?.dataset.time??"0",10);Number.isFinite(it)&&Number.isFinite(Je)&&it>=Je&&y.classList.add(Ne),xe()};j=ye=>{ye.target!==q&&Q()},ge=()=>{y.dataset.deleteConfirmed==="true"&&Q()},y.addEventListener("click",j,!0),document.addEventListener("click",j,!0),l&&l.addEventListener("mouseleave",ge),te=setTimeout(()=>{y.dataset.deleteConfirmed==="true"&&Q(),xe()},5e3)}},oe.className="time-diff",oe.style.color="#888",oe.style.marginLeft="5px",E.append(k,L,M,z,oe,q),y.append(Ie,E,O);let ut=Number.parseInt(z.dataset.time??"0",10);if(h){po();let te=!1,j=ne();for(let ge=0;ge<j.length;ge++){let xe=j[ge],ye=xe.querySelector("a[data-time]")?.dataset.time;if(!ye)continue;let it=Number.parseInt(ye,10);if(Number.isFinite(it)&&ut<it){l.insertBefore(y,xe),te=!0;let Je=j[ge-1];if(Je){let Yt=Je.querySelector("a[data-time]")?.dataset.time;if(Yt){let Kt=Number.parseInt(Yt,10);Number.isFinite(Kt)&&(oe.textContent=wt(ut-Kt))}}else oe.textContent="";let Wt=xe.querySelector(".time-diff");Wt&&(Wt.textContent=wt(it-ut));break}}if(!te&&(l.appendChild(y),j.length>0)){let Q=j[j.length-1].querySelector("a[data-time]")?.dataset.time;if(Q){let ye=Number.parseInt(Q,10);Number.isFinite(ye)&&(oe.textContent=wt(ut-ye))}}y.scrollIntoView({behavior:"smooth",block:"center"}),jn(),ot(),Me(),r||(Ut(he,u,g,o),kt=u,yn(y,!1))}else O.__ytls_li=y;return O}function bn(){if(!l||l.querySelector(".ytls-error-message"))return;let t=ne();t.forEach((o,r)=>{let d=o.querySelector(".time-diff");if(!d)return;let g=o.querySelector("a[data-time]")?.dataset.time;if(!g){d.textContent="";return}let u=Number.parseInt(g,10);if(!Number.isFinite(u)){d.textContent="";return}if(r===0){d.textContent="";return}let k=t[r-1].querySelector("a[data-time]")?.dataset.time;if(!k){d.textContent="";return}let L=Number.parseInt(k,10);if(!Number.isFinite(L)){d.textContent="";return}let M=u-L,z=M<0?"-":"";d.textContent=` ${z}${wt(Math.abs(M))}`})}function Qo(){if(!l||l.querySelector(".ytls-error-message")||de)return;let t=null;if(document.activeElement instanceof HTMLInputElement&&l.contains(document.activeElement)){let u=document.activeElement,E=u.closest("li")?.dataset.guid;if(E){let k=u.selectionStart??u.value.length,L=u.selectionEnd??k,M=u.scrollLeft;t={guid:E,start:k,end:L,scroll:M}}}let o=ne();if(o.length===0)return;let r=o.map(u=>u.dataset.guid),d=o.map(u=>{let y=u.querySelector("a[data-time]"),E=y?.dataset.time;if(!y||!E)return null;let k=Number.parseInt(E,10);if(!Number.isFinite(k))return null;let L=u.dataset.guid??"";return{time:k,guid:L,element:u}}).filter(u=>u!==null).sort((u,y)=>{let E=u.time-y.time;return E!==0?E:u.guid.localeCompare(y.guid)}),h=d.map(u=>u.guid),g=r.length!==h.length||r.some((u,y)=>u!==h[y]);for(;l.firstChild;)l.removeChild(l.firstChild);if(d.forEach(u=>{l.appendChild(u.element)}),bn(),ot(),Me(),t){let y=ne().find(E=>E.dataset.guid===t.guid)?.querySelector("input");if(y)try{y.focus({preventScroll:!0})}catch{}}g&&(c("Timestamps changed: Timestamps sorted"),Vn(he))}function jn(){if(!l||!n||!v||!S)return;let t=ne().length,o=at();typeof o.recalculateTimestampsArea=="function"&&o.recalculateTimestampsArea();let r=n.getBoundingClientRect(),d=v.getBoundingClientRect(),h=S.getBoundingClientRect(),g=Math.max(0,r.height-(d.height+h.height));t===0?(gn(),l.style.overflowY="hidden"):l.style.overflowY=l.scrollHeight>g?"auto":"hidden"}function Me(){if(!l)return;let t=Ge(),o=document.querySelector(".ytp-progress-bar"),r=_(),d=r?r.getVideoData():null,h=!!d&&!!d.isLive;if(!t||!o||!isFinite(t.duration)||h)return;ti(),ne().map(u=>{let y=u.querySelector("a[data-time]"),E=y?.dataset.time;if(!y||!E)return null;let k=Number.parseInt(E,10);if(!Number.isFinite(k))return null;let M=u.querySelector("input")?.value??"",z=u.dataset.guid??crypto.randomUUID();return u.dataset.guid||(u.dataset.guid=z),{start:k,comment:M,guid:z}}).filter(Zo).forEach(u=>{if(!Number.isFinite(u.start))return;let y=document.createElement("div");y.className="ytls-marker",y.style.position="absolute",y.style.height="100%",y.style.width="2px",y.style.backgroundColor="#ff0000",y.style.cursor="pointer",y.style.left=u.start/t.duration*100+"%",y.dataset.time=String(u.start),y.addEventListener("click",()=>{let E=_();E&&E.seekTo(u.start)}),o.appendChild(y)})}function Vn(t,o={}){if(!l||l.querySelector(".ytls-error-message")||!t)return;if(de){c("Save blocked: timestamps are currently loading");return}ot();let r=uo().sort((d,h)=>d.start-h.start);if(r.length===0&&!o.allowEmpty){c("Save skipped: no timestamps to save");return}ii(t,r).then(()=>c(`Successfully saved ${r.length} timestamps for ${t} to IndexedDB`)).catch(d=>c(`Failed to save timestamps for ${t} to IndexedDB:`,d,"error")),sn({type:"timestamps_updated",videoId:t,action:"saved"})}function Ut(t,o,r,d){if(!t||de)return;let h={guid:o,start:r,comment:d};c(`Saving timestamp: guid=${o}, start=${r}, comment="${d}"`),ir(t,h).catch(g=>c(`Failed to save timestamp ${o}:`,g,"error")),sn({type:"timestamps_updated",videoId:t,action:"saved"})}function Wi(t,o){!t||de||(c(`Deleting timestamp: guid=${o}`),rr(t,o).catch(r=>c(`Failed to delete timestamp ${o}:`,r,"error")),sn({type:"timestamps_updated",videoId:t,action:"saved"}))}async function ei(t){if(!l||l.querySelector(".ytls-error-message")){alert("Cannot export timestamps while displaying an error message.");return}let o=he;if(!o)return;c(`Exporting timestamps for video ID: ${o}`);let r=uo(),d=Math.max(St(),0),h=xn();if(t==="json"){let g=new Blob([JSON.stringify(r,null,2)],{type:"application/json"}),u=URL.createObjectURL(g),y=document.createElement("a");y.href=u,y.download=`timestamps-${o}-${h}.json`,y.click(),URL.revokeObjectURL(u)}else if(t==="text"){let g=r.map(k=>{let L=wt(k.start,d),M=`${k.comment} <!-- guid:${k.guid} -->`.trimStart();return`${L} ${M}`}).join(`
`),u=new Blob([g],{type:"text/plain"}),y=URL.createObjectURL(u),E=document.createElement("a");E.href=y,E.download=`timestamps-${o}-${h}.txt`,E.click(),URL.revokeObjectURL(y)}}function ho(t){if(!n||!l){c("Timekeeper error:",t,"error");return}Lt();let o=document.createElement("li");o.textContent=t,o.classList.add("ytls-error-message"),o.style.color="#ff6b6b",o.style.fontWeight="bold",o.style.padding="8px",o.style.background="rgba(255, 0, 0, 0.1)",l.appendChild(o),Me()}function ti(){document.querySelectorAll(".ytls-marker").forEach(t=>t.remove())}function Gt(){if(!n||!document.body.contains(n))return;let t=n.getBoundingClientRect(),o=document.documentElement.clientWidth,r=document.documentElement.clientHeight,d=t.width,h=t.height;if(t.left<0&&(n.style.left="0",n.style.right="auto"),t.right>o){let g=Math.max(0,o-d);n.style.left=`${g}px`,n.style.right="auto"}if(t.top<0&&(n.style.top="0",n.style.bottom="auto"),t.bottom>r){let g=Math.max(0,r-h);n.style.top=`${g}px`,n.style.bottom="auto"}}function Yi(){if(Pn&&(document.removeEventListener("mousemove",Pn),Pn=null),zn&&(document.removeEventListener("mouseup",zn),zn=null),un&&(document.removeEventListener("keydown",un),un=null),Fn&&(window.removeEventListener("resize",Fn),Fn=null),dn&&(document.removeEventListener("pointerdown",dn,!0),dn=null),mn&&(document.removeEventListener("pointerup",mn,!0),mn=null),tt){try{tt.disconnect()}catch{}tt=null}if(nt){try{nt.disconnect()}catch{}nt=null}let t=Ge();t&&(Hn&&(t.removeEventListener("timeupdate",Hn),Hn=null),$n&&(t.removeEventListener("pause",$n),$n=null),Rn&&(t.removeEventListener("play",Rn),Rn=null),On&&(t.removeEventListener("seeking",On),On=null))}function Ki(){ti(),Et.forEach(o=>clearTimeout(o)),Et.clear(),cn&&(clearTimeout(cn),cn=null),ae&&(clearInterval(ae),ae=null),et&&(clearTimeout(et),et=null),Yi();try{$e.close()}catch{}if(P&&P.parentNode===document.body&&document.body.removeChild(P),P=null,Dn=null,An=!1,he=null,tt){try{tt.disconnect()}catch{}tt=null}if(nt){try{nt.disconnect()}catch{}nt=null}n&&n.parentNode&&n.remove();let t=document.getElementById("ytls-header-button");t&&t.parentNode&&t.remove(),yt=null,Bn=!1,Re=null,Lt(),n=null,v=null,l=null,S=null,x=null,T=null,A=null,He=null}async function Zi(){let t=go();if(!t)return He=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let o=await In();if(!le(o)){let r=ht(o),d=r.length?` Missing methods: ${r.join(", ")}.`:"",h=o?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return He=null,{ok:!1,message:`${h}${d} Try refreshing once playback is ready.`}}return He=o,{ok:!0,player:o,videoId:t}}async function ni(){if(!n||!l)return;let t=l.scrollTop,o=!0,r=()=>{if(!l||!o)return;let d=Math.max(0,l.scrollHeight-l.clientHeight);l.scrollTop=Math.min(t,d)};try{let d=await Zi();if(!d.ok){ho(d.message),Lt(),Me();return}let{videoId:h}=d,g=[];try{let u=await ar(h);u?(g=u.map(y=>({...y,guid:y.guid||crypto.randomUUID()})),c(`Loaded ${g.length} timestamps from IndexedDB for ${h}`)):c(`No timestamps found in IndexedDB for ${h}`)}catch(u){c(`Failed to load timestamps from IndexedDB for ${h}:`,u,"error"),ho("Failed to load timestamps from IndexedDB. Try refreshing the page."),Me();return}if(g.length>0){g.sort((L,M)=>L.start-M.start),Lt(),po();let u=document.createDocumentFragment();if(g.forEach(L=>{let z=vn(L.start,L.comment,!0,L.guid,!1).__ytls_li;z&&u.appendChild(z)}),n&&n.classList.contains("ytls-zoom-in")&&pe!=null)c("Deferring timestamp DOM append until show animation completes"),gt=u,lt||(lt=new Promise(L=>{_e=L})),await lt;else if(l){l.appendChild(u),ot(),Me();let L=at();typeof L.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>L.recalculateTimestampsArea())}let E=_(),k=E?Math.floor(E.getCurrentTime()):St();Number.isFinite(k)&&(It(k,!1),o=!1)}else{Lt(),mo("No timestamps for this video"),Me();let u=at();typeof u.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>u.recalculateTimestampsArea())}}catch(d){c("Unexpected error while loading timestamps:",d,"error"),ho("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{lt&&await lt,requestAnimationFrame(r);let d=at();typeof d.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>d.recalculateTimestampsArea()),l&&!l.querySelector(".ytls-error-message")&&gn()}}function go(){let o=new URLSearchParams(location.search).get("v");if(o)return o;let r=document.querySelector('meta[itemprop="identifier"]');return r?.content?r.content:null}function Ji(){let t=Ge();if(!t)return;let o=()=>{if(!l)return;let u=_(),y=u?Math.floor(u.getCurrentTime()):0;if(!Number.isFinite(y))return;let E=qn(y);yn(E,!1)},r=u=>{try{let y=new URL(window.location.href);u!==null&&Number.isFinite(u)?y.searchParams.set("t",`${Math.floor(u)}s`):y.searchParams.delete("t"),window.history.replaceState({},"",y.toString())}catch{}},d=()=>{let u=_(),y=u?Math.floor(u.getCurrentTime()):NaN;if(Number.isFinite(y)){r(y);try{It(y,!0)}catch(E){c("Failed to highlight nearest timestamp on pause:",E,"warn")}}},h=()=>{r(null);try{let u=_(),y=u?Math.floor(u.getCurrentTime()):NaN;Number.isFinite(y)&&It(y,!0)}catch(u){c("Failed to highlight nearest timestamp on play:",u,"warn")}},g=()=>{let u=Ge();if(!u)return;let y=_(),E=y?Math.floor(y.getCurrentTime()):0;if(!Number.isFinite(E))return;u.paused&&r(E);let k=qn(E);yn(k,!0)};Hn=o,$n=d,Rn=h,On=g,t.addEventListener("timeupdate",o),t.addEventListener("pause",d),t.addEventListener("play",h),t.addEventListener("seeking",g)}let Xi="ytls-timestamps-db",Qi=3,_t="timestamps",qe="timestamps_v2",Wn="settings",qt=null,jt=null;function Vt(){if(qt)try{if(qt.objectStoreNames.length>=0)return Promise.resolve(qt)}catch(t){c("IndexedDB connection is no longer usable:",t,"warn"),qt=null}return jt||(jt=or().then(t=>(qt=t,jt=null,t.onclose=()=>{c("IndexedDB connection closed unexpectedly","warn"),qt=null},t.onerror=o=>{c("IndexedDB connection error:",o,"error")},t)).catch(t=>{throw jt=null,t}),jt)}async function oi(){let t={},o=await ri(qe),r=new Map;for(let g of o){let u=g;r.has(u.video_id)||r.set(u.video_id,[]),r.get(u.video_id).push({guid:u.guid,start:u.start,comment:u.comment})}for(let[g,u]of r)t[`ytls-${g}`]={video_id:g,timestamps:u.sort((y,E)=>y.start-E.start)};return{json:JSON.stringify(t,null,2),filename:"timekeeper-data.json",totalVideos:r.size,totalTimestamps:o.length}}async function er(){try{let{json:t,filename:o,totalVideos:r,totalTimestamps:d}=await oi(),h=new Blob([t],{type:"application/json"}),g=URL.createObjectURL(h),u=document.createElement("a");u.href=g,u.download=o,u.click(),URL.revokeObjectURL(g),c(`Exported ${r} videos with ${d} timestamps`)}catch(t){throw c("Failed to export data:",t,"error"),t}}async function tr(){let t=await ri(qe);if(!Array.isArray(t)||t.length===0){let k=`Tag,Timestamp,URL
`,L=`timestamps-${xn()}.csv`;return{csv:k,filename:L,totalVideos:0,totalTimestamps:0}}let o=new Map;for(let k of t)o.has(k.video_id)||o.set(k.video_id,[]),o.get(k.video_id).push({start:k.start,comment:k.comment});let r=[];r.push("Tag,Timestamp,URL");let d=0,h=k=>`"${String(k).replace(/"/g,'""')}"`,g=k=>{let L=Math.floor(k/3600),M=Math.floor(k%3600/60),z=String(k%60).padStart(2,"0");return`${String(L).padStart(2,"0")}:${String(M).padStart(2,"0")}:${z}`},u=Array.from(o.keys()).sort();for(let k of u){let L=o.get(k).sort((M,z)=>M.start-z.start);for(let M of L){let z=M.comment,oe=g(M.start),O=To(M.start,`https://www.youtube.com/watch?v=${k}`);r.push([h(z),h(oe),h(O)].join(",")),d++}}let y=r.join(`
`),E=`timestamps-${xn()}.csv`;return{csv:y,filename:E,totalVideos:o.size,totalTimestamps:d}}async function nr(){try{let{csv:t,filename:o,totalVideos:r,totalTimestamps:d}=await tr(),h=new Blob([t],{type:"text/csv;charset=utf-8;"}),g=URL.createObjectURL(h),u=document.createElement("a");u.href=g,u.download=o,u.click(),URL.revokeObjectURL(g),c(`Exported ${r} videos with ${d} timestamps (CSV)`)}catch(t){throw c("Failed to export CSV data:",t,"error"),t}}function or(){return new Promise((t,o)=>{let r=indexedDB.open(Xi,Qi);r.onupgradeneeded=d=>{let h=d.target.result,g=d.oldVersion,u=d.target.transaction;if(g<1&&h.createObjectStore(_t,{keyPath:"video_id"}),g<2&&!h.objectStoreNames.contains(Wn)&&h.createObjectStore(Wn,{keyPath:"key"}),g<3){if(h.objectStoreNames.contains(_t)){c("Exporting backup before v2 migration...");let k=u.objectStore(_t).getAll();k.onsuccess=()=>{let L=k.result;if(L.length>0)try{let M={},z=0;L.forEach(Ie=>{if(Array.isArray(Ie.timestamps)&&Ie.timestamps.length>0){let be=Ie.timestamps.map(we=>({guid:we.guid||crypto.randomUUID(),start:we.start,comment:we.comment}));M[`ytls-${Ie.video_id}`]={video_id:Ie.video_id,timestamps:be.sort((we,vt)=>we.start-vt.start)},z+=be.length}});let oe=new Blob([JSON.stringify(M,null,2)],{type:"application/json"}),O=URL.createObjectURL(oe),q=document.createElement("a");q.href=O,q.download=`timekeeper-data-${xn()}.json`,q.click(),URL.revokeObjectURL(O),c(`Pre-migration backup exported: ${L.length} videos, ${z} timestamps`)}catch(M){c("Failed to export pre-migration backup:",M,"error")}}}let y=h.createObjectStore(qe,{keyPath:"guid"});if(y.createIndex("video_id","video_id",{unique:!1}),y.createIndex("video_start",["video_id","start"],{unique:!1}),h.objectStoreNames.contains(_t)){let k=u.objectStore(_t).getAll();k.onsuccess=()=>{let L=k.result;if(L.length>0){let M=0;L.forEach(z=>{Array.isArray(z.timestamps)&&z.timestamps.length>0&&z.timestamps.forEach(oe=>{y.put({guid:oe.guid||crypto.randomUUID(),video_id:z.video_id,start:oe.start,comment:oe.comment}),M++})}),c(`Migrated ${M} timestamps from ${L.length} videos to v2 store`)}},h.deleteObjectStore(_t),c("Deleted old timestamps store after migration to v2")}}},r.onsuccess=d=>{t(d.target.result)},r.onerror=d=>{let h=d.target.error;o(h??new Error("Failed to open IndexedDB"))}})}function yo(t,o,r){return Vt().then(d=>new Promise((h,g)=>{let u;try{u=d.transaction(t,o)}catch(k){g(new Error(`Failed to create transaction for ${t}: ${k}`));return}let y=u.objectStore(t),E;try{E=r(y)}catch(k){g(new Error(`Failed to execute operation on ${t}: ${k}`));return}E&&(E.onsuccess=()=>h(E.result),E.onerror=()=>g(E.error??new Error(`IndexedDB ${o} operation failed`))),u.oncomplete=()=>{E||h(void 0)},u.onerror=()=>g(u.error??new Error("IndexedDB transaction failed")),u.onabort=()=>g(u.error??new Error("IndexedDB transaction aborted"))}))}function ii(t,o){return Vt().then(r=>new Promise((d,h)=>{let g;try{g=r.transaction([qe],"readwrite")}catch(k){h(new Error(`Failed to create transaction: ${k}`));return}let u=g.objectStore(qe),E=u.index("video_id").getAll(IDBKeyRange.only(t));E.onsuccess=()=>{try{let k=E.result,L=new Set(o.map(M=>M.guid));k.forEach(M=>{L.has(M.guid)||u.delete(M.guid)}),o.forEach(M=>{u.put({guid:M.guid,video_id:t,start:M.start,comment:M.comment})})}catch(k){c("Error during save operation:",k,"error")}},E.onerror=()=>{h(E.error??new Error("Failed to get existing records"))},g.oncomplete=()=>d(),g.onerror=()=>h(g.error??new Error("Failed to save to IndexedDB")),g.onabort=()=>h(g.error??new Error("Transaction aborted during save"))}))}function ir(t,o){return Vt().then(r=>new Promise((d,h)=>{let g;try{g=r.transaction([qe],"readwrite")}catch(E){h(new Error(`Failed to create transaction: ${E}`));return}let y=g.objectStore(qe).put({guid:o.guid,video_id:t,start:o.start,comment:o.comment});y.onerror=()=>{h(y.error??new Error("Failed to put timestamp"))},g.oncomplete=()=>d(),g.onerror=()=>h(g.error??new Error("Failed to save single timestamp to IndexedDB")),g.onabort=()=>h(g.error??new Error("Transaction aborted during single timestamp save"))}))}function rr(t,o){return c(`Deleting timestamp ${o} for video ${t}`),Vt().then(r=>new Promise((d,h)=>{let g;try{g=r.transaction([qe],"readwrite")}catch(E){h(new Error(`Failed to create transaction: ${E}`));return}let y=g.objectStore(qe).delete(o);y.onerror=()=>{h(y.error??new Error("Failed to delete timestamp"))},g.oncomplete=()=>d(),g.onerror=()=>h(g.error??new Error("Failed to delete single timestamp from IndexedDB")),g.onabort=()=>h(g.error??new Error("Transaction aborted during timestamp deletion"))}))}function ar(t){return Vt().then(o=>new Promise(r=>{let d;try{d=o.transaction([qe],"readonly")}catch(y){c("Failed to create read transaction:",y,"warn"),r(null);return}let u=d.objectStore(qe).index("video_id").getAll(IDBKeyRange.only(t));u.onsuccess=()=>{let y=u.result;if(y.length>0){let E=y.map(k=>({guid:k.guid,start:k.start,comment:k.comment})).sort((k,L)=>k.start-L.start);r(E)}else r(null)},u.onerror=()=>{c("Failed to load timestamps:",u.error,"warn"),r(null)},d.onabort=()=>{c("Transaction aborted during load:",d.error,"warn"),r(null)}}))}function sr(t){return Vt().then(o=>new Promise((r,d)=>{let h;try{h=o.transaction([qe],"readwrite")}catch(E){d(new Error(`Failed to create transaction: ${E}`));return}let g=h.objectStore(qe),y=g.index("video_id").getAll(IDBKeyRange.only(t));y.onsuccess=()=>{try{y.result.forEach(k=>{g.delete(k.guid)})}catch(E){c("Error during remove operation:",E,"error")}},y.onerror=()=>{d(y.error??new Error("Failed to get records for removal"))},h.oncomplete=()=>r(),h.onerror=()=>d(h.error??new Error("Failed to remove timestamps")),h.onabort=()=>d(h.error??new Error("Transaction aborted during timestamp removal"))}))}function ri(t){return yo(t,"readonly",o=>o.getAll()).then(o=>Array.isArray(o)?o:[])}async function Yn(t,o){await yo(Wn,"readwrite",r=>{r.put({key:t,value:o})}).catch(r=>{c(`Failed to save setting '${t}' to IndexedDB:`,r,"error")})}function vo(t){return yo(Wn,"readonly",o=>o.get(t)).then(o=>o?.value).catch(o=>{c(`Failed to load setting '${t}' from IndexedDB:`,o,"error")})}function ai(){if(!n)return;let t=n.style.display!=="none";Yn("uiVisible",t)}function ct(t){let o=typeof t=="boolean"?t:!!n&&n.style.display!=="none",r=document.getElementById("ytls-header-button");r instanceof HTMLButtonElement&&r.setAttribute("aria-pressed",String(o)),yt&&!Bn&&yt.src!==ke&&(yt.src=ke)}function lr(){n&&vo("uiVisible").then(t=>{let o=t;typeof o=="boolean"?(o?(n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in")):n.style.display="none",ct(o)):(n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),ct(!0))}).catch(t=>{c("Failed to load UI visibility state:",t,"error"),n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),ct(!0)})}function bo(t){if(!n){c("ERROR: togglePaneVisibility called but pane is null");return}document.body.contains(n)||(c("Pane not in DOM during toggle, appending it"),document.querySelectorAll("#ytls-pane").forEach(h=>{h!==n&&h.remove()}),document.body.appendChild(n));let o=document.querySelectorAll("#ytls-pane");o.length>1&&(c(`ERROR: Multiple panes detected in togglePaneVisibility (${o.length}), cleaning up`),o.forEach(h=>{h!==n&&h.remove()})),et&&(clearTimeout(et),et=null);let r=n.style.display==="none";(typeof t=="boolean"?t:r)?(n.style.display="flex",n.classList.remove("ytls-fade-out"),n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),ct(!0),ai(),re(),pe&&(clearTimeout(pe),pe=null),pe=setTimeout(()=>{R();let h=at();typeof h.recalculateTimestampsArea=="function"&&h.recalculateTimestampsArea(),ue(),U(!0);try{let g=_(),u=g?Math.floor(g.getCurrentTime()):NaN;Number.isFinite(u)&&It(u,!0)}catch(g){c("Failed to scroll to nearest timestamp after toggle:",g,"warn")}pe=null},450)):(n.classList.remove("ytls-fade-in"),n.classList.remove("ytls-zoom-in"),n.classList.add("ytls-zoom-out"),ct(!1),G())}function si(t){if(!l){c("UI is not initialized; cannot import timestamps.","warn");return}let o=!1;try{let r=JSON.parse(t),d=null;if(Array.isArray(r))d=r;else if(typeof r=="object"&&r!==null){let h=he;if(h){let g=`timekeeper-${h}`;r[g]&&Array.isArray(r[g].timestamps)&&(d=r[g].timestamps,c(`Found timestamps for current video (${h}) in export format`,"info"))}if(!d){let g=Object.keys(r).filter(u=>u.startsWith("ytls-"));if(g.length===1&&Array.isArray(r[g[0]].timestamps)){d=r[g[0]].timestamps;let u=r[g[0]].video_id;c(`Found timestamps for video ${u} in export format`,"info")}}}d&&Array.isArray(d)?d.every(g=>typeof g.start=="number"&&typeof g.comment=="string")?(d.forEach(g=>{if(g.guid){let u=ne().find(y=>y.dataset.guid===g.guid);if(u){let y=u.querySelector("input");y&&(y.value=g.comment)}else vn(g.start,g.comment,!1,g.guid)}else vn(g.start,g.comment,!1,crypto.randomUUID())}),o=!0):c("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):c("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!o){let r=t.split(`
`).map(d=>d.trim()).filter(d=>d);if(r.length>0){let d=!1;r.forEach(h=>{let g=h.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(g){d=!0;let u=parseInt(g[1])||0,y=parseInt(g[2]),E=parseInt(g[3]),k=u*3600+y*60+E,L=g[4]?g[4].trim():"",M=null,z=L,oe=L.match(/<!--\s*guid:([^>]+?)\s*-->/);oe&&(M=oe[1].trim(),z=L.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let O;if(M&&(O=ne().find(q=>q.dataset.guid===M)),!O&&!M&&(O=ne().find(q=>{if(q.dataset.guid)return!1;let be=q.querySelector("a[data-time]")?.dataset.time;if(!be)return!1;let we=Number.parseInt(be,10);return Number.isFinite(we)&&we===k})),O){let q=O.querySelector("input");q&&(q.value=z)}else vn(k,z,!1,M||crypto.randomUUID())}}),d&&(o=!0)}}o?(c("Timestamps changed: Imported timestamps from file/clipboard"),ot(),Vn(he),Me(),jn()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function cr(){if(co){c("Pane initialization already in progress, skipping duplicate call");return}if(!(n&&document.body.contains(n))){co=!0;try{let d=function(){if(de||Mt)return;let p=Ge(),f=_();if(!p&&!f)return;let b=f?f.getCurrentTime():0,w=Number.isFinite(b)?Math.max(0,Math.floor(b)):Math.max(0,St()),I=Math.floor(w/3600),B=Math.floor(w/60)%60,D=w%60,{isLive:N}=f?f.getVideoData()||{isLive:!1}:{isLive:!1},F=f?ji(f):!1,Z=l?ne().map(Y=>{let ve=Y.querySelector("a[data-time]");return ve?parseFloat(ve.getAttribute("data-time")??"0"):0}):[],Ce="";if(Z.length>0)if(N){let Y=Math.max(1,w/60),ve=Z.filter(Ae=>Ae<=w);if(ve.length>0){let Ae=(ve.length/Y).toFixed(2);parseFloat(Ae)>0&&(Ce=` (${Ae}/min)`)}}else{let Y=f?f.getDuration():0,ve=Number.isFinite(Y)&&Y>0?Y:p&&Number.isFinite(p.duration)&&p.duration>0?p.duration:0,Ae=Math.max(1,ve/60),dt=(Z.length/Ae).toFixed(1);parseFloat(dt)>0&&(Ce=` (${dt}/min)`)}x.textContent=`\u23F3${I?I+":"+String(B).padStart(2,"0"):B}:${String(D).padStart(2,"0")}${Ce}`,x.style.color=F?"#ff4d4f":"",Z.length>0&&It(w,!1)},q=function(p,f,b){let w=document.createElement("button");return w.textContent=p,rt(w,f),w.classList.add("ytls-settings-modal-button"),w.onclick=b,w},Ie=function(p="general"){if(P&&P.parentNode===document.body){let Se=document.getElementById("ytls-save-modal"),bt=document.getElementById("ytls-load-modal"),mt=document.getElementById("ytls-delete-all-modal");Se&&document.body.contains(Se)&&document.body.removeChild(Se),bt&&document.body.contains(bt)&&document.body.removeChild(bt),mt&&document.body.contains(mt)&&document.body.removeChild(mt),P.classList.remove("ytls-fade-in"),P.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(P)&&document.body.removeChild(P),P=null,document.removeEventListener("click",we,!0),document.removeEventListener("keydown",be)},300);return}P=document.createElement("div"),P.id="ytls-settings-modal",P.classList.remove("ytls-fade-out"),P.classList.add("ytls-fade-in");let f=document.createElement("div");f.className="ytls-modal-header";let b=document.createElement("div");b.id="ytls-settings-nav";let w=document.createElement("button");w.className="ytls-modal-close-button",w.textContent="\u2715",w.onclick=()=>{if(P&&P.parentNode===document.body){let Se=document.getElementById("ytls-save-modal"),bt=document.getElementById("ytls-load-modal"),mt=document.getElementById("ytls-delete-all-modal");Se&&document.body.contains(Se)&&document.body.removeChild(Se),bt&&document.body.contains(bt)&&document.body.removeChild(bt),mt&&document.body.contains(mt)&&document.body.removeChild(mt),P.classList.remove("ytls-fade-in"),P.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(P)&&document.body.removeChild(P),P=null,document.removeEventListener("click",we,!0),document.removeEventListener("keydown",be)},300)}};let I=document.createElement("div");I.id="ytls-settings-content";let B=document.createElement("h3");B.className="ytls-section-heading",B.textContent="General",B.style.display="none";let D=document.createElement("div"),N=document.createElement("div");N.className="ytls-button-grid";function F(Se){D.style.display=Se==="general"?"block":"none",N.style.display=Se==="drive"?"block":"none",Z.classList.toggle("active",Se==="general"),Y.classList.toggle("active",Se==="drive"),B.textContent=Se==="general"?"General":"Google Drive"}let Z=document.createElement("button");Z.textContent="\u{1F6E0}\uFE0F";let Ce=document.createElement("span");Ce.className="ytls-tab-text",Ce.textContent=" General",Z.appendChild(Ce),rt(Z,"General settings"),Z.classList.add("ytls-settings-modal-button"),Z.onclick=()=>F("general");let Y=document.createElement("button");Y.textContent="\u2601\uFE0F";let ve=document.createElement("span");ve.className="ytls-tab-text",ve.textContent=" Backup",Y.appendChild(ve),rt(Y,"Google Drive sign-in and backup"),Y.classList.add("ytls-settings-modal-button"),Y.onclick=async()=>{H.isSignedIn&&await Oo(),F("drive")},b.appendChild(Z),b.appendChild(Y),f.appendChild(b),f.appendChild(w),P.appendChild(f),D.className="ytls-button-grid",D.appendChild(q("\u{1F4BE} Save","Save As...",vt.onclick)),D.appendChild(q("\u{1F4C2} Load","Load",ut.onclick)),D.appendChild(q("\u{1F4E4} Export All","Export All Data",te.onclick)),D.appendChild(q("\u{1F4E5} Import All","Import All Data",j.onclick)),D.appendChild(q("\u{1F4C4} Export All (CSV)","Export All Timestamps to CSV",async()=>{try{await nr()}catch{alert("Failed to export CSV: Could not read from database.")}}));let Ae=q(H.isSignedIn?"\u{1F513} Sign Out":"\u{1F510} Sign In",H.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{H.isSignedIn?await Ro():await Ho(),Ae.textContent=H.isSignedIn?"\u{1F513} Sign Out":"\u{1F510} Sign In",rt(Ae,H.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),Pe.updateBackupStatusDisplay?.()});N.appendChild(Ae);let dt=q(Qe?"\u{1F501} Auto Backup: On":"\u{1F501} Auto Backup: Off","Toggle Auto Backup",async()=>{await Uo(),dt.textContent=Qe?"\u{1F501} Auto Backup: On":"\u{1F501} Auto Backup: Off",Pe.updateBackupStatusDisplay?.()});N.appendChild(dt);let At=q(`\u23F1\uFE0F Backup Interval: ${Oe}min`,"Set periodic backup interval (minutes)",async()=>{await Go(),At.textContent=`\u23F1\uFE0F Backup Interval: ${Oe}min`,Pe.updateBackupStatusDisplay?.()});N.appendChild(At),N.appendChild(q("\u{1F5C4}\uFE0F Backup Now","Run a backup immediately",async()=>{await nn(!1),Pe.updateBackupStatusDisplay?.()}));let je=document.createElement("div");je.style.marginTop="15px",je.style.paddingTop="10px",je.style.borderTop="1px solid #555",je.style.fontSize="12px",je.style.color="#aaa";let Dt=document.createElement("div");Dt.style.marginBottom="8px",Dt.style.fontWeight="bold",je.appendChild(Dt),zo(Dt);let xo=document.createElement("div");xo.style.marginBottom="8px",Bo(xo),je.appendChild(xo);let mi=document.createElement("div");Po(mi),je.appendChild(mi),N.appendChild(je),De(),on(),Be(),I.appendChild(B),I.appendChild(D),I.appendChild(N),F(p),P.appendChild(I),document.body.appendChild(P),requestAnimationFrame(()=>{let Se=P.getBoundingClientRect(),mt=(window.innerHeight-Se.height)/2;P.style.top=`${Math.max(20,mt)}px`,P.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",we,!0),document.addEventListener("keydown",be)},0)},be=function(p){if(p.key==="Escape"&&P&&P.parentNode===document.body){let f=document.getElementById("ytls-save-modal"),b=document.getElementById("ytls-load-modal"),w=document.getElementById("ytls-delete-all-modal");if(f||b||w)return;p.preventDefault(),f&&document.body.contains(f)&&document.body.removeChild(f),b&&document.body.contains(b)&&document.body.removeChild(b),w&&document.body.contains(w)&&document.body.removeChild(w),P.classList.remove("ytls-fade-in"),P.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(P)&&document.body.removeChild(P),P=null,document.removeEventListener("click",we,!0),document.removeEventListener("keydown",be)},300)}},we=function(p){if(Dn&&Dn.contains(p.target))return;let f=document.getElementById("ytls-save-modal"),b=document.getElementById("ytls-load-modal"),w=document.getElementById("ytls-delete-all-modal");f&&f.contains(p.target)||b&&b.contains(p.target)||w&&w.contains(p.target)||P&&P.contains(p.target)||(f&&document.body.contains(f)&&document.body.removeChild(f),b&&document.body.contains(b)&&document.body.removeChild(b),w&&document.body.contains(w)&&document.body.removeChild(w),P&&P.parentNode===document.body&&(P.classList.remove("ytls-fade-in"),P.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(P)&&document.body.removeChild(P),P=null,document.removeEventListener("click",we,!0),document.removeEventListener("keydown",be)},300)))},ge=function(){n&&(c("Loading window position from IndexedDB"),vo("windowPosition").then(p=>{if(p&&typeof p.x=="number"&&typeof p.y=="number"){let w=p;n.style.left=`${w.x}px`,n.style.top=`${w.y}px`,n.style.right="auto",n.style.bottom="auto",typeof w.width=="number"&&w.width>0?n.style.width=`${w.width}px`:(n.style.width=`${Ot}px`,c(`No stored window width found, using default width ${Ot}px`)),typeof w.height=="number"&&w.height>0?n.style.height=`${w.height}px`:(n.style.height=`${Tt}px`,c(`No stored window height found, using default height ${Tt}px`));let I=ee();ie(I,w.x,w.y),c("Restored window position from IndexedDB:",Re)}else c("No window position found in IndexedDB, applying default size and leaving default position"),n.style.width=`${Ot}px`,n.style.height=`${Tt}px`,Re=null;Gt();let f=ee();f&&(f.width||f.height)&&ie(f);let b=at();typeof b.recalculateTimestampsArea=="function"&&b.recalculateTimestampsArea()}).catch(p=>{c("failed to load pane position from IndexedDB:",p,"warn"),Gt();let f=ee();f&&(f.width||f.height)&&(Re={x:Math.max(0,Math.round(f.left)),y:0,width:Math.round(f.width),height:Math.round(f.height)});let b=at();typeof b.recalculateTimestampsArea=="function"&&b.recalculateTimestampsArea()}))},xe=function(){if(!n)return;let p=ee();if(!p)return;let f={x:Math.max(0,Math.round(p.left)),y:Math.max(0,Math.round(p.top)),width:Math.round(p.width),height:Math.round(p.height)};if(Re&&Re.x===f.x&&Re.y===f.y&&Re.width===f.width&&Re.height===f.height){c("Skipping window position save; position and size unchanged");return}Re={...f},c(`Saving window position and size to IndexedDB: x=${f.x}, y=${f.y}, width=${f.width}, height=${f.height}`),Yn("windowPosition",f),sn({type:"window_position_updated",position:f,timestamp:Date.now()})},Xn=function(p,f){p.addEventListener("dblclick",b=>{b.preventDefault(),b.stopPropagation(),n&&(n.style.width="300px",n.style.height="300px",xe(),wn())}),p.addEventListener("mousedown",b=>{b.preventDefault(),b.stopPropagation(),Zt=!0,Ct=f,ui=b.clientX,di=b.clientY;let w=n.getBoundingClientRect();Jt=w.width,Xt=w.height,Zn=w.left,Jn=w.top,f==="top-left"||f==="bottom-right"?document.body.style.cursor="nwse-resize":document.body.style.cursor="nesw-resize"})},wn=function(){if(n&&v&&S&&l){let p=n.getBoundingClientRect(),f=v.getBoundingClientRect(),b=S.getBoundingClientRect(),w=p.height-(f.height+b.height);l.style.maxHeight=w>0?w+"px":"0px",l.style.overflowY=w>0?"auto":"hidden"}};document.querySelectorAll("#ytls-pane").forEach(p=>p.remove()),n=document.createElement("div"),v=document.createElement("div"),l=document.createElement("ul"),S=document.createElement("div"),x=document.createElement("span"),T=document.createElement("style"),A=document.createElement("span"),C=document.createElement("span"),C.classList.add("ytls-backup-indicator"),C.style.cursor="pointer",C.style.backgroundColor="#666",C.onclick=p=>{p.stopPropagation(),Ie("drive")},l.addEventListener("mouseenter",()=>{An=!0,pn=!1}),l.addEventListener("mouseleave",()=>{if(An=!1,pn)return;let p=_(),f=p?Math.floor(p.getCurrentTime()):St();It(f,!1);let b=null;if(document.activeElement instanceof HTMLInputElement&&l.contains(document.activeElement)&&(b=document.activeElement.closest("li")?.dataset.guid??null),Qo(),b){let I=ne().find(B=>B.dataset.guid===b)?.querySelector("input");if(I)try{I.focus({preventScroll:!0})}catch{}}}),n.id="ytls-pane",v.id="ytls-pane-header",v.addEventListener("dblclick",p=>{let f=p.target instanceof HTMLElement?p.target:null;f&&(f.closest("a")||f.closest("button")||f.closest("#ytls-current-time")||f.closest(".ytls-version-display")||f.closest(".ytls-backup-indicator"))||(p.preventDefault(),bo(!1))});let t=p=>{try{p.stopPropagation()}catch{}};["click","dblclick","mousedown","pointerdown","touchstart","wheel"].forEach(p=>{n.addEventListener(p,t)}),n.addEventListener("keydown",p=>{try{p.stopPropagation()}catch{}}),n.addEventListener("keyup",p=>{try{p.stopPropagation()}catch{}}),n.addEventListener("focus",p=>{try{p.stopPropagation()}catch{}},!0),n.addEventListener("blur",p=>{try{p.stopPropagation()}catch{}},!0);let o=GM_info.script.version;A.textContent=`v${o}`,A.classList.add("ytls-version-display");let r=document.createElement("span");r.style.display="inline-flex",r.style.alignItems="center",r.style.gap="6px",r.appendChild(A),r.appendChild(C),x.id="ytls-current-time",x.textContent="\u23F3",x.onclick=()=>{Mt=!0;let p=_();p&&p.seekToLiveHead(),setTimeout(()=>{Mt=!1},500)},d(),ae&&clearInterval(ae),ae=setInterval(d,1e3),S.id="ytls-buttons";let h=(p,f)=>()=>{p.classList.remove("ytls-fade-in"),p.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(p)&&document.body.removeChild(p),f&&f()},300)},g=p=>f=>{f.key==="Escape"&&(f.preventDefault(),f.stopPropagation(),p())},u=p=>{setTimeout(()=>{document.addEventListener("keydown",p)},0)},y=(p,f)=>b=>{p.contains(b.target)||f()},E=p=>{setTimeout(()=>{document.addEventListener("click",p,!0)},0)},oe=[{label:"\u{1F423}",title:"Add timestamp",action:()=>{if(!l||l.querySelector(".ytls-error-message")||de)return;let p=typeof Nt<"u"?Nt:0,f=_(),b=f?Math.floor(f.getCurrentTime()+p):0;if(!Number.isFinite(b))return;let w=vn(b,"");w&&w.focus()}},{label:"\u2699\uFE0F",title:"Settings",action:()=>Ie()},{label:"\u{1F4CB}",title:"Copy timestamps to clipboard",action:function(p){if(!l||l.querySelector(".ytls-error-message")||de){this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3);return}let f=uo(),b=Math.max(St(),0);if(f.length===0){this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3);return}let w=p.ctrlKey,I=f.map(B=>{let D=wt(B.start,b);return w?`${D} ${B.comment} <!-- guid:${B.guid} -->`.trimStart():`${D} ${B.comment}`}).join(`
`);navigator.clipboard.writeText(I).then(()=>{this.textContent="\u2705",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3)}).catch(B=>{c("Failed to copy timestamps: ",B,"error"),this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3)})}},{label:"\u23F1\uFE0F",title:"Offset all timestamps",action:()=>{if(!l||l.querySelector(".ytls-error-message")||de)return;if(ne().length===0){alert("No timestamps available to offset.");return}let f=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(f===null)return;let b=f.trim();if(b.length===0)return;let w=Number.parseInt(b,10);if(!Number.isFinite(w)){alert("Please enter a valid integer number of seconds.");return}w!==0&&Jo(w,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{label:"\u{1F5D1}\uFE0F",title:"Delete all timestamps for current video",action:async()=>{let p=go();if(!p){alert("Unable to determine current video ID.");return}let f=document.createElement("div");f.id="ytls-delete-all-modal",f.classList.remove("ytls-fade-out"),f.classList.add("ytls-fade-in");let b=document.createElement("p");b.textContent="Hold the button to delete all timestamps for:",b.style.marginBottom="10px";let w=document.createElement("p");w.textContent=p,w.style.fontFamily="monospace",w.style.fontSize="12px",w.style.marginBottom="15px",w.style.color="#aaa";let I=document.createElement("button");I.classList.add("ytls-save-modal-button"),I.style.background="#d32f2f",I.style.position="relative",I.style.overflow="hidden";let B=null,D=0,N=null,F=document.createElement("div");F.style.position="absolute",F.style.left="0",F.style.top="0",F.style.height="100%",F.style.width="0%",F.style.background="#ff6b6b",F.style.transition="none",F.style.pointerEvents="none",I.appendChild(F);let Z=document.createElement("span");Z.textContent="Hold to Delete All",Z.style.position="relative",Z.style.zIndex="1",I.appendChild(Z);let Ce=()=>{if(!D)return;let je=Date.now()-D,Dt=Math.min(je/5e3*100,100);F.style.width=`${Dt}%`,Dt<100&&(N=requestAnimationFrame(Ce))},Y=()=>{B&&(clearTimeout(B),B=null),N&&(cancelAnimationFrame(N),N=null),D=0,F.style.width="0%",Z.textContent="Hold to Delete All"};I.onmousedown=()=>{D=Date.now(),Z.textContent="Deleting...",N=requestAnimationFrame(Ce),B=setTimeout(async()=>{Y(),f.classList.remove("ytls-fade-in"),f.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(f)&&document.body.removeChild(f);try{await sr(p),wo()}catch(je){c("Failed to delete all timestamps:",je,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},I.onmouseup=Y,I.onmouseleave=Y;let ve=null,Ae=null,dt=h(f,()=>{Y(),ve&&document.removeEventListener("keydown",ve),Ae&&document.removeEventListener("click",Ae,!0)});ve=g(dt),Ae=y(f,dt);let At=document.createElement("button");At.textContent="Cancel",At.classList.add("ytls-save-modal-cancel-button"),At.onclick=dt,f.appendChild(b),f.appendChild(w),f.appendChild(I),f.appendChild(At),document.body.appendChild(f),u(ve),E(Ae)}}],O=pi();oe.forEach(p=>{let f=document.createElement("button");if(f.textContent=p.label,rt(f,p.title),f.classList.add("ytls-main-button"),p.label==="\u{1F423}"&&O){let b=document.createElement("span");b.textContent=O,b.classList.add("ytls-holiday-emoji"),f.appendChild(b)}p.label==="\u{1F4CB}"?f.onclick=function(b){p.action.call(this,b)}:f.onclick=p.action,p.label==="\u2699\uFE0F"&&(Dn=f),S.appendChild(f)});let vt=document.createElement("button");vt.textContent="\u{1F4BE} Save",vt.classList.add("ytls-file-operation-button"),vt.onclick=()=>{let p=document.createElement("div");p.id="ytls-save-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let f=document.createElement("p");f.textContent="Save as:";let b=null,w=null,I=h(p,()=>{b&&document.removeEventListener("keydown",b),w&&document.removeEventListener("click",w,!0)});b=g(I),w=y(p,I);let B=document.createElement("button");B.textContent="JSON",B.classList.add("ytls-save-modal-button"),B.onclick=()=>{b&&document.removeEventListener("keydown",b),w&&document.removeEventListener("click",w,!0),h(p,()=>ei("json"))()};let D=document.createElement("button");D.textContent="Plain Text",D.classList.add("ytls-save-modal-button"),D.onclick=()=>{b&&document.removeEventListener("keydown",b),w&&document.removeEventListener("click",w,!0),h(p,()=>ei("text"))()};let N=document.createElement("button");N.textContent="Cancel",N.classList.add("ytls-save-modal-cancel-button"),N.onclick=I,p.appendChild(f),p.appendChild(B),p.appendChild(D),p.appendChild(N),document.body.appendChild(p),u(b),E(w)};let ut=document.createElement("button");ut.textContent="\u{1F4C2} Load",ut.classList.add("ytls-file-operation-button"),ut.onclick=()=>{let p=document.createElement("div");p.id="ytls-load-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let f=document.createElement("p");f.textContent="Load from:";let b=null,w=null,I=h(p,()=>{b&&document.removeEventListener("keydown",b),w&&document.removeEventListener("click",w,!0)});b=g(I),w=y(p,I);let B=document.createElement("button");B.textContent="File",B.classList.add("ytls-save-modal-button"),B.onclick=()=>{let F=document.createElement("input");F.type="file",F.accept=".json,.txt",F.classList.add("ytls-hidden-file-input"),F.onchange=Z=>{let Ce=Z.target.files?.[0];if(!Ce)return;b&&document.removeEventListener("keydown",b),w&&document.removeEventListener("click",w,!0),I();let Y=new FileReader;Y.onload=()=>{let ve=String(Y.result).trim();si(ve)},Y.readAsText(Ce)},F.click()};let D=document.createElement("button");D.textContent="Clipboard",D.classList.add("ytls-save-modal-button"),D.onclick=async()=>{b&&document.removeEventListener("keydown",b),w&&document.removeEventListener("click",w,!0),h(p,async()=>{try{let F=await navigator.clipboard.readText();F?si(F.trim()):alert("Clipboard is empty.")}catch(F){c("Failed to read from clipboard: ",F,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let N=document.createElement("button");N.textContent="Cancel",N.classList.add("ytls-save-modal-cancel-button"),N.onclick=I,p.appendChild(f),p.appendChild(B),p.appendChild(D),p.appendChild(N),document.body.appendChild(p),u(b),E(w)};let te=document.createElement("button");te.textContent="\u{1F4E4} Export",te.classList.add("ytls-file-operation-button"),te.onclick=async()=>{try{await er()}catch{alert("Failed to export data: Could not read from database.")}};let j=document.createElement("button");j.textContent="\u{1F4E5} Import",j.classList.add("ytls-file-operation-button"),j.onclick=()=>{let p=document.createElement("input");p.type="file",p.accept=".json",p.classList.add("ytls-hidden-file-input"),p.onchange=f=>{let b=f.target.files?.[0];if(!b)return;let w=new FileReader;w.onload=()=>{try{let I=JSON.parse(String(w.result)),B=[];for(let D in I)if(Object.prototype.hasOwnProperty.call(I,D)&&D.startsWith("ytls-")){let N=D.substring(5),F=I[D];if(F&&typeof F.video_id=="string"&&Array.isArray(F.timestamps)){let Z=F.timestamps.map(Y=>({...Y,guid:Y.guid||crypto.randomUUID()})),Ce=ii(N,Z).then(()=>c(`Imported ${N} to IndexedDB`)).catch(Y=>c(`Failed to import ${N} to IndexedDB:`,Y,"error"));B.push(Ce)}else c(`Skipping key ${D} during import due to unexpected data format.`,"warn")}Promise.all(B).then(()=>{wo()}).catch(D=>{alert("An error occurred during import to IndexedDB. Check console for details."),c("Overall import error:",D,"error")})}catch(I){alert(`Failed to import data. Please ensure the file is in the correct format.
`+I.message),c("Import error:",I,"error")}},w.readAsText(b)},p.click()},T.textContent=gi,l.onclick=p=>{Xo(p)},l.ontouchstart=p=>{Xo(p)},n.style.position="fixed",n.style.bottom="0",n.style.right="0",n.style.transition="none",ge(),setTimeout(()=>Gt(),10);let Q=!1,ye,it,Je=!1;n.addEventListener("mousedown",p=>{let f=p.target;f instanceof Element&&(f instanceof HTMLInputElement||f instanceof HTMLTextAreaElement||f!==v&&!v.contains(f)&&window.getComputedStyle(f).cursor==="pointer"||(Q=!0,Je=!1,ye=p.clientX-n.getBoundingClientRect().left,it=p.clientY-n.getBoundingClientRect().top,n.style.transition="none"))}),document.addEventListener("mousemove",Pn=p=>{if(!Q)return;Je=!0;let f=p.clientX-ye,b=p.clientY-it,w=n.getBoundingClientRect(),I=w.width,B=w.height,D=document.documentElement.clientWidth,N=document.documentElement.clientHeight;f=Math.max(0,Math.min(f,D-I)),b=Math.max(0,Math.min(b,N-B)),n.style.left=`${f}px`,n.style.top=`${b}px`,n.style.right="auto",n.style.bottom="auto"}),document.addEventListener("mouseup",zn=()=>{if(!Q)return;Q=!1;let p=Je;setTimeout(()=>{Je=!1},50),Gt(),setTimeout(()=>{p&&xe()},200)}),n.addEventListener("dragstart",p=>p.preventDefault());let Wt=document.createElement("div"),Kn=document.createElement("div"),Yt=document.createElement("div"),Kt=document.createElement("div");Wt.id="ytls-resize-tl",Kn.id="ytls-resize-tr",Yt.id="ytls-resize-bl",Kt.id="ytls-resize-br";let Zt=!1,ui=0,di=0,Jt=0,Xt=0,Zn=0,Jn=0,Ct=null;Xn(Wt,"top-left"),Xn(Kn,"top-right"),Xn(Yt,"bottom-left"),Xn(Kt,"bottom-right"),document.addEventListener("mousemove",p=>{if(!Zt||!n||!Ct)return;let f=p.clientX-ui,b=p.clientY-di,w=Jt,I=Xt,B=Zn,D=Jn,N=document.documentElement.clientWidth,F=document.documentElement.clientHeight;Ct==="bottom-right"?(w=Math.max(200,Math.min(800,Jt+f)),I=Math.max(250,Math.min(F,Xt+b))):Ct==="top-left"?(w=Math.max(200,Math.min(800,Jt-f)),B=Zn+f,I=Math.max(250,Math.min(F,Xt-b)),D=Jn+b):Ct==="top-right"?(w=Math.max(200,Math.min(800,Jt+f)),I=Math.max(250,Math.min(F,Xt-b)),D=Jn+b):Ct==="bottom-left"&&(w=Math.max(200,Math.min(800,Jt-f)),B=Zn+f,I=Math.max(250,Math.min(F,Xt+b))),B=Math.max(0,Math.min(B,N-w)),D=Math.max(0,Math.min(D,F-I)),n.style.width=`${w}px`,n.style.height=`${I}px`,n.style.left=`${B}px`,n.style.top=`${D}px`,n.style.right="auto",n.style.bottom="auto"}),document.addEventListener("mouseup",()=>{Zt&&(Zt=!1,Ct=null,document.body.style.cursor="",U(!0))});let Qn=null;window.addEventListener("resize",Fn=()=>{Qn&&clearTimeout(Qn),Qn=setTimeout(()=>{U(!0),Qn=null},200)}),v.appendChild(x),v.appendChild(r);let eo=document.createElement("div");if(eo.id="ytls-content",eo.append(l),eo.append(S),n.append(v,eo,T,Wt,Kn,Yt,Kt),n.addEventListener("mousemove",p=>{try{if(Q||Zt)return;let f=n.getBoundingClientRect(),b=20,w=p.clientX,I=p.clientY,B=w-f.left<=b,D=f.right-w<=b,N=I-f.top<=b,F=f.bottom-I<=b,Z="";N&&B||F&&D?Z="nwse-resize":N&&D||F&&B?Z="nesw-resize":Z="",document.body.style.cursor=Z}catch{}}),n.addEventListener("mouseleave",()=>{!Zt&&!Q&&(document.body.style.cursor="")}),at().recalculateTimestampsArea=wn,setTimeout(()=>{if(wn(),n&&v&&S&&l){let p=40,f=ne();if(f.length>0)p=f[0].offsetHeight;else{let b=document.createElement("li");b.style.visibility="hidden",b.style.position="absolute",b.textContent="00:00 Example",l.appendChild(b),p=b.offsetHeight,l.removeChild(b)}$=v.offsetHeight+S.offsetHeight+p,n.style.minHeight=$+"px"}},0),window.addEventListener("resize",wn),nt){try{nt.disconnect()}catch{}nt=null}nt=new ResizeObserver(wn),nt.observe(n),dn||document.addEventListener("pointerdown",dn=()=>{Yo=Date.now()},!0),mn||document.addEventListener("pointerup",mn=()=>{},!0)}finally{co=!1}}}async function ur(){if(!n)return;if(document.querySelectorAll("#ytls-pane").forEach(r=>{r!==n&&(c("Removing duplicate pane element from DOM"),r.remove())}),document.body.contains(n)){c("Pane already in DOM, skipping append");return}await lr(),typeof Pe.setBuildExportPayload=="function"&&Pe.setBuildExportPayload?.(oi),typeof Pe.setSaveGlobalSettings=="function"&&Pe.setSaveGlobalSettings(Yn),typeof Pe.setLoadGlobalSettings=="function"&&Pe.setLoadGlobalSettings(vo),typeof Pe.setBackupStatusIndicator=="function"&&Pe.setBackupStatusIndicator(C),await ao(),await No(),await $t(),Pe.updateBackupStatusIndicator?.();let o=document.querySelectorAll("#ytls-pane");if(o.length>0&&(c(`WARNING: Found ${o.length} existing pane(s) in DOM, removing all`),o.forEach(r=>r.remove())),document.body.contains(n)){c("ERROR: Pane already in body, aborting append");return}if(document.body.appendChild(n),c("Pane successfully appended to DOM"),re(),pe&&(clearTimeout(pe),pe=null),pe=setTimeout(()=>{R();let r=at();typeof r.recalculateTimestampsArea=="function"&&r.recalculateTimestampsArea(),ue(),U(!0),pe=null},450),tt){try{tt.disconnect()}catch{}tt=null}tt=new MutationObserver(()=>{let r=document.querySelectorAll("#ytls-pane");r.length>1&&(c(`CRITICAL: Multiple panes detected (${r.length}), removing duplicates`),r.forEach((d,h)=>{(h>0||n&&d!==n)&&d.remove()}))}),tt.observe(document.body,{childList:!0,subtree:!0})}function li(t=0){if(document.getElementById("ytls-header-button")){ct();return}let o=document.querySelector("#logo");if(!o||!o.parentElement){t<10&&setTimeout(()=>li(t+1),300);return}let r=document.createElement("button");r.id="ytls-header-button",r.type="button",r.className="ytls-header-button",rt(r,"Toggle Timekeeper UI"),r.setAttribute("aria-label","Toggle Timekeeper UI");let d=document.createElement("img");d.src=ke,d.alt="",d.decoding="async",r.appendChild(d),yt=d,r.addEventListener("mouseenter",()=>{yt&&(Bn=!0,yt.src=ze)}),r.addEventListener("mouseleave",()=>{yt&&(Bn=!1,ct())}),r.addEventListener("click",()=>{n&&!document.body.contains(n)&&(c("Pane not in DOM, re-appending before toggle"),document.body.appendChild(n)),bo()}),o.insertAdjacentElement("afterend",r),ct(),c("Timekeeper header button added next to YouTube logo")}function ci(){if(K)return;K=!0;let t=history.pushState,o=history.replaceState;function r(){try{let d=new Event("locationchange");window.dispatchEvent(d)}catch{}}history.pushState=function(...d){let h=t.apply(this,d);return r(),h},history.replaceState=function(...d){let h=o.apply(this,d);return r(),h},window.addEventListener("popstate",r),window.addEventListener("locationchange",()=>{window.location.href!==J&&c("Location changed (locationchange event) \u2014 deferring UI update until navigation finish")})}async function wo(){if(!m()){Ki();return}J=window.location.href,document.querySelectorAll("#ytls-pane").forEach((o,r)=>{(r>0||n&&o!==n)&&o.remove()}),await me(),await cr(),he=go();let t=document.title;c("Page Title:",t),c("Video ID:",he),c("Current URL:",window.location.href),fo(!0),Lt(),Me(),await ni(),Me(),fo(!1),c("Timestamps loaded and UI unlocked for video:",he),await ur(),li(),Ji()}ci(),window.addEventListener("yt-navigate-start",()=>{c("Navigation started (yt-navigate-start event fired)"),m()&&n&&l&&(c("Locking UI and showing loading state for navigation"),fo(!0))}),un=t=>{t.ctrlKey&&t.altKey&&t.shiftKey&&(t.key==="T"||t.key==="t")&&(t.preventDefault(),bo(),c("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",un),window.addEventListener("yt-navigate-finish",()=>{c("Navigation finished (yt-navigate-finish event fired)"),window.location.href!==J?wo():c("Navigation finished but URL already handled, skipping.")}),ci(),c("Timekeeper initialized and waiting for navigation events")})();})();

