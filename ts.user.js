// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      4.4.9
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

(()=>{function c(e,...i){let a="debug",s=[...i];i.length>0&&typeof i[i.length-1]=="string"&&["debug","info","warn","error"].includes(i[i.length-1])&&(a=s.pop());let n=`[Timekeeper v${GM_info.script.version}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[a](`${n} ${e}`,...s)}function vt(e,i=e){let a=Math.floor(e/3600),s=Math.floor(e%3600/60),m=String(e%60).padStart(2,"0");return i<3600?`${s<10?s:String(s).padStart(2,"0")}:${m}`:`${i>=36e3?String(a).padStart(2,"0"):a}:${String(s).padStart(2,"0")}:${m}`}function wo(e,i=window.location.href){try{let a=new URL(i);return a.searchParams.set("t",`${e}s`),a.toString()}catch{return`https://www.youtube.com/watch?v=${i.search(/[?&]v=/)>=0?i.split(/[?&]v=/)[1].split(/&/)[0]:i.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${e}s`}}function hn(){let e=new Date;return e.getUTCFullYear()+"-"+String(e.getUTCMonth()+1).padStart(2,"0")+"-"+String(e.getUTCDate()).padStart(2,"0")+"--"+String(e.getUTCHours()).padStart(2,"0")+"-"+String(e.getUTCMinutes()).padStart(2,"0")+"-"+String(e.getUTCSeconds()).padStart(2,"0")}var ur=[{emoji:"\u{1F942}",month:1,day:1,name:"New Year's Day"},{emoji:"\u{1F49D}",month:2,day:14,name:"Valentine's Day"},{emoji:"\u{1F986}",month:5,day:25,name:"Kanna's Debut Anniversary"},{emoji:"\u{1F383}",month:10,day:31,name:"Halloween"},{emoji:"\u{1F382}",month:9,day:15,name:"Kanna's Birthday"},{emoji:"\u{1F332}",month:12,day:25,name:"Christmas"}];function ii(){let e=new Date,i=e.getFullYear(),a=e.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});for(let s of ur){let m=new Date(i,s.month-1,s.day),n=m.getTime()-e.getTime(),v=n/(1e3*60*60*24);if(v<=5&&v>=-2)return c(`Current date: ${a}, Selected emoji: ${s.emoji} (${s.name}), Days until holiday: ${Math.ceil(v)}`),s.emoji;if(v<-2&&(m=new Date(i+1,s.month-1,s.day),n=m.getTime()-e.getTime(),v=n/(1e3*60*60*24),v<=5&&v>=-2))return c(`Current date: ${a}, Selected emoji: ${s.emoji} (${s.name}), Days until holiday: ${Math.ceil(v)}`),s.emoji;if(v>5&&(m=new Date(i-1,s.month-1,s.day),n=m.getTime()-e.getTime(),v=n/(1e3*60*60*24),v<=5&&v>=-2))return c(`Current date: ${a}, Selected emoji: ${s.emoji} (${s.name}), Days until holiday: ${Math.ceil(v)}`),s.emoji}return c(`Current date: ${a}, No holiday emoji (not within range)`),null}var Ke=null,Wt=null,dr=500,Dt=null,gn=!1,bt=null;function mr(){return(!Ke||!document.body.contains(Ke))&&(Ke=document.createElement("div"),Ke.className="ytls-tooltip",Ke.style.pointerEvents="none",document.body.appendChild(Ke),window.addEventListener("scroll",ri,!0),window.addEventListener("resize",ri,!0)),Ke}function pr(e,i,a){let m=window.innerWidth,n=window.innerHeight,v=e.getBoundingClientRect(),l=v.width,S=v.height,x=i+10,T=a+10;x+l>m-10&&(x=i-l-10),T+S>n-10&&(T=a-S-10),x=Math.max(10,Math.min(x,m-l-10)),T=Math.max(10,Math.min(T,n-S-10)),e.style.left=`${x}px`,e.style.top=`${T}px`}function ai(e,i){let s=window.innerWidth,m=window.innerHeight,n=i.getBoundingClientRect(),v=e.getBoundingClientRect(),l=v.width,S=v.height,x=Math.round(n.right+8),T=Math.round(n.top);x+l>s-8&&(x=Math.round(n.left-l-8)),x=Math.max(8,Math.min(x,s-l-8)),T+S>m-8&&(T=Math.round(n.bottom-S)),T=Math.max(8,Math.min(T,m-S-8)),e.style.left=`${x}px`,e.style.top=`${T}px`}function ri(){if(!(!Ke||!Dt)&&Ke.classList.contains("ytls-tooltip-visible"))try{ai(Ke,Dt)}catch{}}function fr(e=50){bt&&(clearTimeout(bt),bt=null),!gn&&(bt=setTimeout(()=>{xo(),bt=null},e))}function hr(e,i,a,s){Wt&&clearTimeout(Wt),s&&(Dt=s,gn=!0),Wt=setTimeout(()=>{let m=mr();m.textContent=e,m.classList.remove("ytls-tooltip-visible"),s?requestAnimationFrame(()=>{ai(m,s),requestAnimationFrame(()=>{m.classList.add("ytls-tooltip-visible")})}):(pr(m,i,a),requestAnimationFrame(()=>{m.classList.add("ytls-tooltip-visible")}))},dr)}function xo(){Wt&&(clearTimeout(Wt),Wt=null),bt&&(clearTimeout(bt),bt=null),Ke&&Ke.classList.remove("ytls-tooltip-visible"),Dt=null,gn=!1}function ot(e,i){let a=0,s=0,m=S=>{a=S.clientX,s=S.clientY,gn=!0,Dt=e;let x=typeof i=="function"?i():i;x&&hr(x,a,s,e)},n=S=>{a=S.clientX,s=S.clientY},v=()=>{gn=!1,fr()};e.addEventListener("mouseenter",m),e.addEventListener("mousemove",n),e.addEventListener("mouseleave",v);let l=new MutationObserver(()=>{try{if(!document.body.contains(e))Dt===e&&xo();else{let S=window.getComputedStyle(e);(S.display==="none"||S.visibility==="hidden"||S.opacity==="0")&&Dt===e&&xo()}}catch{}});try{l.observe(e,{attributes:!0,attributeFilter:["class","style"]}),l.observe(document.body,{childList:!0,subtree:!0})}catch{}e.__tooltipCleanup=()=>{e.removeEventListener("mouseenter",m),e.removeEventListener("mousemove",n),e.removeEventListener("mouseleave",v);try{l.disconnect()}catch{}delete e.__tooltipObserver},e.__tooltipObserver=l}var si=`
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

`;var ke=Uint8Array,qe=Uint16Array,Io=Int32Array,Co=new ke([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Mo=new ke([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),li=new ke([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),fi=function(e,i){for(var a=new qe(31),s=0;s<31;++s)a[s]=i+=1<<e[s-1];for(var m=new Io(a[30]),s=1;s<30;++s)for(var n=a[s];n<a[s+1];++n)m[n]=n-a[s]<<5|s;return{b:a,r:m}},hi=fi(Co,2),gr=hi.b,Eo=hi.r;gr[28]=258,Eo[258]=28;var gi=fi(Mo,0),Wr=gi.b,ci=gi.r,ko=new qe(32768);for(V=0;V<32768;++V)dt=(V&43690)>>1|(V&21845)<<1,dt=(dt&52428)>>2|(dt&13107)<<2,dt=(dt&61680)>>4|(dt&3855)<<4,ko[V]=((dt&65280)>>8|(dt&255)<<8)>>1;var dt,V,bn=(function(e,i,a){for(var s=e.length,m=0,n=new qe(i);m<s;++m)e[m]&&++n[e[m]-1];var v=new qe(i);for(m=1;m<i;++m)v[m]=v[m-1]+n[m-1]<<1;var l;if(a){l=new qe(1<<i);var S=15-i;for(m=0;m<s;++m)if(e[m])for(var x=m<<4|e[m],T=i-e[m],D=v[e[m]-1]++<<T,M=D|(1<<T)-1;D<=M;++D)l[ko[D]>>S]=x}else for(l=new qe(s),m=0;m<s;++m)e[m]&&(l[m]=ko[v[e[m]-1]++]>>15-e[m]);return l}),At=new ke(288);for(V=0;V<144;++V)At[V]=8;var V;for(V=144;V<256;++V)At[V]=9;var V;for(V=256;V<280;++V)At[V]=7;var V;for(V=280;V<288;++V)At[V]=8;var V,Jn=new ke(32);for(V=0;V<32;++V)Jn[V]=5;var V,yr=bn(At,9,0);var vr=bn(Jn,5,0);var yi=function(e){return(e+7)/8|0},vi=function(e,i,a){return(i==null||i<0)&&(i=0),(a==null||a>e.length)&&(a=e.length),new ke(e.subarray(i,a))};var br=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],Qn=function(e,i,a){var s=new Error(i||br[e]);if(s.code=e,Error.captureStackTrace&&Error.captureStackTrace(s,Qn),!a)throw s;return s};var mt=function(e,i,a){a<<=i&7;var s=i/8|0;e[s]|=a,e[s+1]|=a>>8},yn=function(e,i,a){a<<=i&7;var s=i/8|0;e[s]|=a,e[s+1]|=a>>8,e[s+2]|=a>>16},To=function(e,i){for(var a=[],s=0;s<e.length;++s)e[s]&&a.push({s,f:e[s]});var m=a.length,n=a.slice();if(!m)return{t:wi,l:0};if(m==1){var v=new ke(a[0].s+1);return v[a[0].s]=1,{t:v,l:1}}a.sort(function(he,Ie){return he.f-Ie.f}),a.push({s:-1,f:25001});var l=a[0],S=a[1],x=0,T=1,D=2;for(a[0]={s:-1,f:l.f+S.f,l,r:S};T!=m-1;)l=a[a[x].f<a[D].f?x++:D++],S=a[x!=T&&a[x].f<a[D].f?x++:D++],a[T++]={s:-1,f:l.f+S.f,l,r:S};for(var M=n[0].s,s=1;s<m;++s)n[s].s>M&&(M=n[s].s);var $=new qe(M+1),J=So(a[T-1],$,0);if(J>i){var s=0,K=0,ee=J-i,ie=1<<ee;for(n.sort(function(Ie,ae){return $[ae.s]-$[Ie.s]||Ie.f-ae.f});s<m;++s){var G=n[s].s;if($[G]>i)K+=ie-(1<<J-$[G]),$[G]=i;else break}for(K>>=ee;K>0;){var ue=n[s].s;$[ue]<i?K-=1<<i-$[ue]++-1:++s}for(;s>=0&&K;--s){var X=n[s].s;$[X]==i&&(--$[X],++K)}J=i}return{t:new ke($),l:J}},So=function(e,i,a){return e.s==-1?Math.max(So(e.l,i,a+1),So(e.r,i,a+1)):i[e.s]=a},ui=function(e){for(var i=e.length;i&&!e[--i];);for(var a=new qe(++i),s=0,m=e[0],n=1,v=function(S){a[s++]=S},l=1;l<=i;++l)if(e[l]==m&&l!=i)++n;else{if(!m&&n>2){for(;n>138;n-=138)v(32754);n>2&&(v(n>10?n-11<<5|28690:n-3<<5|12305),n=0)}else if(n>3){for(v(m),--n;n>6;n-=6)v(8304);n>2&&(v(n-3<<5|8208),n=0)}for(;n--;)v(m);n=1,m=e[l]}return{c:a.subarray(0,s),n:i}},vn=function(e,i){for(var a=0,s=0;s<i.length;++s)a+=e[s]*i[s];return a},bi=function(e,i,a){var s=a.length,m=yi(i+2);e[m]=s&255,e[m+1]=s>>8,e[m+2]=e[m]^255,e[m+3]=e[m+1]^255;for(var n=0;n<s;++n)e[m+n+4]=a[n];return(m+4+s)*8},di=function(e,i,a,s,m,n,v,l,S,x,T){mt(i,T++,a),++m[256];for(var D=To(m,15),M=D.t,$=D.l,J=To(n,15),K=J.t,ee=J.l,ie=ui(M),G=ie.c,ue=ie.n,X=ui(K),he=X.c,Ie=X.n,ae=new qe(19),U=0;U<G.length;++U)++ae[G[U]&31];for(var U=0;U<he.length;++U)++ae[he[U]&31];for(var R=To(ae,7),se=R.t,de=R.l,le=19;le>4&&!se[li[le-1]];--le);var He=x+5<<3,Se=vn(m,At)+vn(n,Jn)+v,Be=vn(m,M)+vn(n,K)+v+14+3*le+vn(ae,se)+2*ae[16]+3*ae[17]+7*ae[18];if(S>=0&&He<=Se&&He<=Be)return bi(i,T,e.subarray(S,S+x));var We,me,ze,rt;if(mt(i,T,1+(Be<Se)),T+=2,Be<Se){We=bn(M,$,0),me=M,ze=bn(K,ee,0),rt=K;var Xt=bn(se,de,0);mt(i,T,ue-257),mt(i,T+5,Ie-1),mt(i,T+10,le-4),T+=14;for(var U=0;U<le;++U)mt(i,T+3*U,se[li[U]]);T+=3*le;for(var Oe=[G,he],Ne=0;Ne<2;++Ne)for(var Pe=Oe[Ne],U=0;U<Pe.length;++U){var _=Pe[U]&31;mt(i,T,Xt[_]),T+=se[_],_>15&&(mt(i,T,Pe[U]>>5&127),T+=Pe[U]>>12)}}else We=yr,me=At,ze=vr,rt=Jn;for(var U=0;U<l;++U){var ce=s[U];if(ce>255){var _=ce>>18&31;yn(i,T,We[_+257]),T+=me[_+257],_>7&&(mt(i,T,ce>>23&31),T+=Co[_]);var pt=ce&31;yn(i,T,ze[pt]),T+=rt[pt],pt>3&&(yn(i,T,ce>>5&8191),T+=Mo[pt])}else yn(i,T,We[ce]),T+=me[ce]}return yn(i,T,We[256]),T+me[256]},wr=new Io([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),wi=new ke(0),xr=function(e,i,a,s,m,n){var v=n.z||e.length,l=new ke(s+v+5*(1+Math.ceil(v/7e3))+m),S=l.subarray(s,l.length-m),x=n.l,T=(n.r||0)&7;if(i){T&&(S[0]=n.r>>3);for(var D=wr[i-1],M=D>>13,$=D&8191,J=(1<<a)-1,K=n.p||new qe(32768),ee=n.h||new qe(J+1),ie=Math.ceil(a/3),G=2*ie,ue=function(Fe){return(e[Fe]^e[Fe+1]<<ie^e[Fe+2]<<G)&J},X=new Io(25e3),he=new qe(288),Ie=new qe(32),ae=0,U=0,R=n.i||0,se=0,de=n.w||0,le=0;R+2<v;++R){var He=ue(R),Se=R&32767,Be=ee[He];if(K[Se]=Be,ee[He]=Se,de<=R){var We=v-R;if((ae>7e3||se>24576)&&(We>423||!x)){T=di(e,S,0,X,he,Ie,U,se,le,R-le,T),se=ae=U=0,le=R;for(var me=0;me<286;++me)he[me]=0;for(var me=0;me<30;++me)Ie[me]=0}var ze=2,rt=0,Xt=$,Oe=Se-Be&32767;if(We>2&&He==ue(R-Oe))for(var Ne=Math.min(M,We)-1,Pe=Math.min(32767,R),_=Math.min(258,We);Oe<=Pe&&--Xt&&Se!=Be;){if(e[R+ze]==e[R+ze-Oe]){for(var ce=0;ce<_&&e[R+ce]==e[R+ce-Oe];++ce);if(ce>ze){if(ze=ce,rt=Oe,ce>Ne)break;for(var pt=Math.min(Oe,ce-2),kn=0,me=0;me<pt;++me){var Bt=R-Oe+me&32767,ao=K[Bt],Qt=Bt-ao&32767;Qt>kn&&(kn=Qt,Be=Bt)}}}Se=Be,Be=K[Se],Oe+=Se-Be&32767}if(rt){X[se++]=268435456|Eo[ze]<<18|ci[rt];var Sn=Eo[ze]&31,zt=ci[rt]&31;U+=Co[Sn]+Mo[zt],++he[257+Sn],++Ie[zt],de=R+ze,++ae}else X[se++]=e[R],++he[e[R]]}}for(R=Math.max(R,de);R<v;++R)X[se++]=e[R],++he[e[R]];T=di(e,S,x,X,he,Ie,U,se,le,R-le,T),x||(n.r=T&7|S[T/8|0]<<3,T-=7,n.h=ee,n.p=K,n.i=R,n.w=de)}else{for(var R=n.w||0;R<v+x;R+=65535){var wt=R+65535;wt>=v&&(S[T/8|0]=x,wt=v),T=bi(S,T+1,e.subarray(R,wt))}n.i=v}return vi(l,0,s+yi(T)+m)},Tr=(function(){for(var e=new Int32Array(256),i=0;i<256;++i){for(var a=i,s=9;--s;)a=(a&1&&-306674912)^a>>>1;e[i]=a}return e})(),Er=function(){var e=-1;return{p:function(i){for(var a=e,s=0;s<i.length;++s)a=Tr[a&255^i[s]]^a>>>8;e=a},d:function(){return~e}}};var kr=function(e,i,a,s,m){if(!m&&(m={l:1},i.dictionary)){var n=i.dictionary.subarray(-32768),v=new ke(n.length+e.length);v.set(n),v.set(e,n.length),e=v,m.w=n.length}return xr(e,i.level==null?6:i.level,i.mem==null?m.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+i.mem,a,s,m)},xi=function(e,i){var a={};for(var s in e)a[s]=e[s];for(var s in i)a[s]=i[s];return a};var Ee=function(e,i,a){for(;a;++i)e[i]=a,a>>>=8};function Sr(e,i){return kr(e,i||{},0,0)}var Ti=function(e,i,a,s){for(var m in e){var n=e[m],v=i+m,l=s;Array.isArray(n)&&(l=xi(s,n[1]),n=n[0]),n instanceof ke?a[v]=[n,l]:(a[v+="/"]=[new ke(0),l],Ti(n,v,a,s))}},mi=typeof TextEncoder<"u"&&new TextEncoder,Lr=typeof TextDecoder<"u"&&new TextDecoder,Ir=0;try{Lr.decode(wi,{stream:!0}),Ir=1}catch{}function Xn(e,i){if(i){for(var a=new ke(e.length),s=0;s<e.length;++s)a[s]=e.charCodeAt(s);return a}if(mi)return mi.encode(e);for(var m=e.length,n=new ke(e.length+(e.length>>1)),v=0,l=function(T){n[v++]=T},s=0;s<m;++s){if(v+5>n.length){var S=new ke(v+8+(m-s<<1));S.set(n),n=S}var x=e.charCodeAt(s);x<128||i?l(x):x<2048?(l(192|x>>6),l(128|x&63)):x>55295&&x<57344?(x=65536+(x&1047552)|e.charCodeAt(++s)&1023,l(240|x>>18),l(128|x>>12&63),l(128|x>>6&63),l(128|x&63)):(l(224|x>>12),l(128|x>>6&63),l(128|x&63))}return vi(n,0,v)}var Lo=function(e){var i=0;if(e)for(var a in e){var s=e[a].length;s>65535&&Qn(9),i+=s+4}return i},pi=function(e,i,a,s,m,n,v,l){var S=s.length,x=a.extra,T=l&&l.length,D=Lo(x);Ee(e,i,v!=null?33639248:67324752),i+=4,v!=null&&(e[i++]=20,e[i++]=a.os),e[i]=20,i+=2,e[i++]=a.flag<<1|(n<0&&8),e[i++]=m&&8,e[i++]=a.compression&255,e[i++]=a.compression>>8;var M=new Date(a.mtime==null?Date.now():a.mtime),$=M.getFullYear()-1980;if(($<0||$>119)&&Qn(10),Ee(e,i,$<<25|M.getMonth()+1<<21|M.getDate()<<16|M.getHours()<<11|M.getMinutes()<<5|M.getSeconds()>>1),i+=4,n!=-1&&(Ee(e,i,a.crc),Ee(e,i+4,n<0?-n-2:n),Ee(e,i+8,a.size)),Ee(e,i+12,S),Ee(e,i+14,D),i+=16,v!=null&&(Ee(e,i,T),Ee(e,i+6,a.attrs),Ee(e,i+10,v),i+=14),e.set(s,i),i+=S,D)for(var J in x){var K=x[J],ee=K.length;Ee(e,i,+J),Ee(e,i+2,ee),e.set(K,i+4),i+=4+ee}return T&&(e.set(l,i),i+=T),i},Cr=function(e,i,a,s,m){Ee(e,i,101010256),Ee(e,i+8,a),Ee(e,i+10,a),Ee(e,i+12,s),Ee(e,i+16,m)};function Ei(e,i){i||(i={});var a={},s=[];Ti(e,"",a,i);var m=0,n=0;for(var v in a){var l=a[v],S=l[0],x=l[1],T=x.level==0?0:8,D=Xn(v),M=D.length,$=x.comment,J=$&&Xn($),K=J&&J.length,ee=Lo(x.extra);M>65535&&Qn(11);var ie=T?Sr(S,x):S,G=ie.length,ue=Er();ue.p(S),s.push(xi(x,{size:S.length,crc:ue.d(),c:ie,f:D,m:J,u:M!=v.length||J&&$.length!=K,o:m,compression:T})),m+=30+M+ee+G,n+=76+2*(M+ee)+(K||0)+G}for(var X=new ke(n+22),he=m,Ie=n-m,ae=0;ae<s.length;++ae){var D=s[ae];pi(X,D.o,D,D.f,D.u,D.c.length);var U=30+D.f.length+Lo(D.extra);X.set(D.c,D.o+U),pi(X,m,D,D.f,D.u,D.c.length,D.o,D.m),m+=16+U+(D.m?D.m.length:0)}return Cr(X,m,s.length,Ie,he),X}var H={isSignedIn:!1,accessToken:null,userName:null,email:null},it=!0,Ve=30,Je=null,Kt=!1,Yt=0,Ze=null,Do=null,fe=null,W=null,eo=null;function Ii(e){Do=e}function Ci(e){fe=e}function Mi(e){W=e}function Ao(e){eo=e}var ki=!1;function Di(){if(!ki)try{let e=document.createElement("style");e.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(e),ki=!0}catch{}}var Ai=null,wn=null,xn=null;function Bo(e){Ai=e}function no(e){wn=e}function oo(e){xn=e}var Si="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",Mr="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",Dr="https://www.youtube.com/",Ar=30*1e3,Br=1800*1e3,Li=5,to=null,je=null;async function zo(){try{let e=await xn("googleAuthState");e&&typeof e=="object"&&(H={...H,...e},En(),H.isSignedIn&&H.accessToken&&await Jt(!0))}catch(e){c("Failed to load Google auth state:",e,"error")}}async function io(){try{await wn("googleAuthState",H)}catch(e){c("Failed to save Google auth state:",e,"error")}}function En(){Do&&(Do.style.display="none")}function Re(e,i){if(W){if(W.style.fontWeight="bold",e==="authenticating"){for(Di(),W.style.color="#ffa500";W.firstChild;)W.removeChild(W.firstChild);let a=document.createElement("span");a.className="tk-auth-spinner";let s=document.createTextNode(` ${i||"Authorizing with Google\u2026"}`);W.appendChild(a),W.appendChild(s);return}if(e==="error"){W.textContent=`\u274C ${i||"Authorization failed"}`,W.style.color="#ff4d4f",re();return}H.isSignedIn?(W.textContent="\u2705 Signed in",W.style.color="#52c41a",W.removeAttribute("title"),H.userName?(W.onmouseenter=()=>{W.textContent=`\u2705 Signed in as ${H.userName}`},W.onmouseleave=()=>{W.textContent="\u2705 Signed in"}):(W.onmouseenter=null,W.onmouseleave=null)):(W.textContent="\u274C Not signed in",W.style.color="#ff4d4f",W.removeAttribute("title"),W.onmouseenter=null,W.onmouseleave=null),re()}}function zr(){W&&(Di(),W.classList.remove("tk-auth-blink"),W.offsetWidth,W.classList.add("tk-auth-blink"),setTimeout(()=>{W.classList.remove("tk-auth-blink")},1200))}function Pr(e){return new Promise((i,a)=>{if(!e){c&&c("OAuth monitor: popup is null",null,"error"),a(new Error("Failed to open popup"));return}c&&c("OAuth monitor: starting to monitor popup for token");let s=Date.now(),m=300*1e3,n="timekeeper_oauth",v=null,l=null,S=null,x=()=>{if(v){try{v.close()}catch{}v=null}l&&(clearInterval(l),l=null),S&&(clearInterval(S),S=null)};try{v=new BroadcastChannel(n),c&&c("OAuth monitor: BroadcastChannel created successfully"),v.onmessage=M=>{if(c&&c("OAuth monitor: received BroadcastChannel message",M.data),M.data?.type==="timekeeper_oauth_token"&&M.data?.token){c&&c("OAuth monitor: token received via BroadcastChannel"),x();try{e.close()}catch{}i(M.data.token)}else if(M.data?.type==="timekeeper_oauth_error"){c&&c("OAuth monitor: error received via BroadcastChannel",M.data.error,"error"),x();try{e.close()}catch{}a(new Error(M.data.error||"OAuth failed"))}}}catch(M){c&&c("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",M)}c&&c("OAuth monitor: setting up IndexedDB polling");let T=Date.now();l=setInterval(async()=>{try{let M=indexedDB.open("ytls-timestamps-db",3);M.onsuccess=()=>{let $=M.result,ee=$.transaction("settings","readonly").objectStore("settings").get("oauth_message");ee.onsuccess=()=>{let ie=ee.result;if(ie&&ie.value){let G=ie.value;if(G.timestamp&&G.timestamp>T){if(c&&c("OAuth monitor: received IndexedDB message",G),G.type==="timekeeper_oauth_token"&&G.token){c&&c("OAuth monitor: token received via IndexedDB"),x();try{e.close()}catch{}$.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),i(G.token)}else if(G.type==="timekeeper_oauth_error"){c&&c("OAuth monitor: error received via IndexedDB",G.error,"error"),x();try{e.close()}catch{}$.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),a(new Error(G.error||"OAuth failed"))}T=G.timestamp}}$.close()}}}catch(M){c&&c("OAuth monitor: IndexedDB polling error",M,"error")}},500),S=setInterval(()=>{if(Date.now()-s>m){c&&c("OAuth monitor: popup timed out after 5 minutes",null,"error"),x();try{e.close()}catch{}a(new Error("OAuth popup timed out"));return}},1e3)})}async function Bi(){if(!Si){Re("error","Google Client ID not configured");return}try{c&&c("OAuth signin: starting OAuth flow"),Re("authenticating","Opening authentication window...");let e=new URL("https://accounts.google.com/o/oauth2/v2/auth");e.searchParams.set("client_id",Si),e.searchParams.set("redirect_uri",Dr),e.searchParams.set("response_type","token"),e.searchParams.set("scope",Mr),e.searchParams.set("include_granted_scopes","true"),e.searchParams.set("state","timekeeper_auth"),c&&c("OAuth signin: opening popup");let i=window.open(e.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!i){c&&c("OAuth signin: popup blocked by browser",null,"error"),Re("error","Popup blocked. Please enable popups for YouTube.");return}c&&c("OAuth signin: popup opened successfully"),Re("authenticating","Waiting for authentication...");try{let a=await Pr(i),s=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${a}`}});if(s.ok){let m=await s.json();H.accessToken=a,H.isSignedIn=!0,H.userName=m.name,H.email=m.email,await io(),En(),Re(),re(),await Jt(),c?c(`Successfully authenticated as ${m.name}`):console.log(`[Timekeeper] Successfully authenticated as ${m.name}`)}else throw new Error("Failed to fetch user info")}catch(a){let s=a instanceof Error?a.message:"Authentication failed";c?c("OAuth failed:",a,"error"):console.error("[Timekeeper] OAuth failed:",a),Re("error",s);return}}catch(e){let i=e instanceof Error?e.message:"Sign in failed";c?c("Failed to sign in to Google:",e,"error"):console.error("[Timekeeper] Failed to sign in to Google:",e),Re("error",`Failed to sign in: ${i}`)}}async function zi(){if(!window.opener||window.opener===window)return!1;c&&c("OAuth popup: detected popup window, checking for OAuth response");let e=window.location.hash;if(!e||e.length<=1)return c&&c("OAuth popup: no hash params found"),!1;let i=e.startsWith("#")?e.substring(1):e,a=new URLSearchParams(i),s=a.get("state");if(c&&c("OAuth popup: hash params found, state="+s),s!=="timekeeper_auth")return c&&c("OAuth popup: not our OAuth flow (wrong state)"),!1;let m=a.get("error"),n=a.get("access_token"),v="timekeeper_oauth";if(m){try{let l=new BroadcastChannel(v);l.postMessage({type:"timekeeper_oauth_error",error:a.get("error_description")||m}),l.close()}catch{let S={type:"timekeeper_oauth_error",error:a.get("error_description")||m,timestamp:Date.now()},x=indexedDB.open("ytls-timestamps-db",3);x.onsuccess=()=>{let T=x.result;T.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:S}),T.close()}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(n){c&&c("OAuth popup: access token found, broadcasting to opener");try{let l=new BroadcastChannel(v);l.postMessage({type:"timekeeper_oauth_token",token:n}),l.close(),c&&c("OAuth popup: token broadcast via BroadcastChannel")}catch(l){c&&c("OAuth popup: BroadcastChannel failed, using IndexedDB",l);let S={type:"timekeeper_oauth_token",token:n,timestamp:Date.now()},x=indexedDB.open("ytls-timestamps-db",3);x.onsuccess=()=>{let T=x.result;T.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:S}),T.close()},c&&c("OAuth popup: token broadcast via IndexedDB")}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function Pi(){H={isSignedIn:!1,accessToken:null,userName:null,email:null},await io(),En(),Re(),re()}async function Fi(){if(!H.isSignedIn||!H.accessToken)return!1;try{let e=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${H.accessToken}`}});return e.status===401?(await $i({silent:!0}),!1):e.ok}catch(e){return c("Failed to verify auth state:",e,"error"),!1}}async function Fr(e){let i={Authorization:`Bearer ${e}`},s=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,m=await fetch(s,{headers:i});if(m.status===401)throw new Error("unauthorized");if(!m.ok)throw new Error("drive search failed");let n=await m.json();if(Array.isArray(n.files)&&n.files.length>0)return n.files[0].id;let v=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...i,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(v.status===401)throw new Error("unauthorized");if(!v.ok)throw new Error("drive folder create failed");return(await v.json()).id}async function $r(e,i,a){let s=`name='${e}' and '${i}' in parents and trashed=false`,m=encodeURIComponent(s),n=await fetch(`https://www.googleapis.com/drive/v3/files?q=${m}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${a}`}});if(n.status===401)throw new Error("unauthorized");if(!n.ok)return null;let v=await n.json();return v.files&&v.files.length>0?v.files[0].id:null}function Rr(e,i){let a=Xn(e),s=i.replace(/\\/g,"/").replace(/^\/+/,"");return s.endsWith(".json")||(s+=".json"),Ei({[s]:[a,{level:6,mtime:new Date,os:0}]})}async function Hr(e,i,a,s){let m=e.replace(/\.json$/,".zip"),n=await $r(m,a,s),v=new TextEncoder().encode(i).length,l=Rr(i,e),S=l.length;c(`Compressing data: ${v} bytes -> ${S} bytes (${Math.round(100-S/v*100)}% reduction)`);let x="-------314159265358979",T=`\r
--${x}\r
`,D=`\r
--${x}--`,M=n?{name:m,mimeType:"application/zip"}:{name:m,mimeType:"application/zip",parents:[a]},$=8192,J="";for(let X=0;X<l.length;X+=$){let he=l.subarray(X,Math.min(X+$,l.length));J+=String.fromCharCode.apply(null,Array.from(he))}let K=btoa(J),ee=T+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify(M)+T+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+K+D,ie,G;n?(ie=`https://www.googleapis.com/upload/drive/v3/files/${n}?uploadType=multipart&fields=id,name`,G="PATCH"):(ie="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",G="POST");let ue=await fetch(ie,{method:G,headers:{Authorization:`Bearer ${s}`,"Content-Type":`multipart/related; boundary=${x}`},body:ee});if(ue.status===401)throw new Error("unauthorized");if(!ue.ok)throw new Error("drive upload failed")}async function $i(e){c("Auth expired, clearing token",null,"warn"),H.isSignedIn=!1,H.accessToken=null,await io(),Re("error","Authorization expired. Please sign in again."),re()}async function Or(e){if(!H.isSignedIn||!H.accessToken){e?.silent||Re("error","Please sign in to Google Drive first");return}try{let{json:i,filename:a,totalVideos:s,totalTimestamps:m}=await Ai();if(m===0){e?.silent||c("Skipping export: no timestamps to back up");return}let n=await Fr(H.accessToken);await Hr(a,i,n,H.accessToken),c(`Exported to Google Drive (${a}) with ${s} videos / ${m} timestamps.`)}catch(i){throw i.message==="unauthorized"?(await $i({silent:e?.silent}),i):(c("Drive export failed:",i,"error"),e?.silent||Re("error","Failed to export to Google Drive."),i)}}async function Ri(){try{let e=await xn("autoBackupEnabled"),i=await xn("autoBackupIntervalMinutes"),a=await xn("lastAutoBackupAt");typeof e=="boolean"&&(it=e),typeof i=="number"&&i>0&&(Ve=i),typeof a=="number"&&a>0&&(Je=a)}catch(e){c("Failed to load auto backup settings:",e,"error")}}async function Po(){try{await wn("autoBackupEnabled",it),await wn("autoBackupIntervalMinutes",Ve),await wn("lastAutoBackupAt",Je??0)}catch(e){c("Failed to save auto backup settings:",e,"error")}}function Nr(){to&&(clearInterval(to),to=null),je&&(clearTimeout(je),je=null)}function Zt(e){try{let i=new Date(e),a=new Date,s=i.toDateString()===a.toDateString(),m=i.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return s?m:`${i.toLocaleDateString()} ${m}`}catch{return""}}function Hi(){return it?Kt?"#4285f4":Ze&&Ze>0?"#ffa500":H.isSignedIn&&Je?"#52c41a":H.isSignedIn?"#ffa500":"#ff4d4f":"#ff4d4f"}function re(){if(!fe)return;let e="",i="";if(!it)e="\u{1F501} Backup: Off",fe.onmouseenter=null,fe.onmouseleave=null;else if(Kt)e="\u{1F501} Backing up\u2026",fe.onmouseenter=null,fe.onmouseleave=null;else if(Ze&&Ze>0)e=`\u26A0\uFE0F Retry in ${Math.ceil(Ze/6e4)}m`,fe.onmouseenter=null,fe.onmouseleave=null;else if(Je){e=`\u{1F5C4}\uFE0F Last backup: ${Zt(Je)}`;let a=Je+Math.max(1,Ve)*60*1e3;i=`\u{1F5C4}\uFE0F Next backup: ${Zt(a)}`,fe.onmouseenter=()=>{fe.textContent=i},fe.onmouseleave=()=>{fe.textContent=e}}else{e="\u{1F5C4}\uFE0F Last backup: never";let a=Date.now()+Math.max(1,Ve)*60*1e3;i=`\u{1F5C4}\uFE0F Next backup: ${Zt(a)}`,fe.onmouseenter=()=>{fe.textContent=i},fe.onmouseleave=()=>{fe.textContent=e}}fe.textContent=e,fe.style.display=e?"inline":"none";try{let a=Hi();fe.style.color=a}catch{}ro()}function ro(){if(!eo)return;let e=Hi();eo.style.backgroundColor=e,ot(eo,()=>{let i="";if(!it)i="Auto backup is disabled";else if(Kt)i="Backup in progress";else if(Ze&&Ze>0)i=`Retrying backup in ${Math.ceil(Ze/6e4)}m`;else if(H.isSignedIn&&Je){let a=Je+Math.max(1,Ve)*60*1e3,s=Zt(a);i=`Last backup: ${Zt(Je)}
Next backup: ${s}`}else if(H.isSignedIn){let a=Date.now()+Math.max(1,Ve)*60*1e3;i=`No backup yet
Next backup: ${Zt(a)}`}else i="Not signed in to Google Drive";return i})}async function Tn(e=!0){if(!H.isSignedIn||!H.accessToken){e||zr();return}if(je){c("Auto backup: backoff in progress, skipping scheduled run");return}if(!Kt){Kt=!0,re();try{await Or({silent:e}),Je=Date.now(),Yt=0,Ze=null,je&&(clearTimeout(je),je=null),await Po()}catch(i){if(c("Auto backup failed:",i,"error"),i.message==="unauthorized")c("Auth error detected, clearing token and stopping retries",null,"warn"),H.isSignedIn=!1,H.accessToken=null,await io(),Re("error","Authorization expired. Please sign in again."),re(),Yt=0,Ze=null,je&&(clearTimeout(je),je=null);else if(Yt<Li){Yt+=1;let m=Math.min(Ar*Math.pow(2,Yt-1),Br);Ze=m,je&&clearTimeout(je),je=setTimeout(()=>{Tn(!0)},m),c(`Scheduling backup retry ${Yt}/${Li} in ${Math.round(m/1e3)}s`),re()}else Ze=null}finally{Kt=!1,re()}}}async function Jt(e=!1){if(Nr(),!!it&&!(!H.isSignedIn||!H.accessToken)){if(to=setInterval(()=>{Tn(!0)},Math.max(1,Ve)*60*1e3),!e){let i=Date.now(),a=Math.max(1,Ve)*60*1e3;(!Je||i-Je>=a)&&Tn(!0)}re()}}async function Oi(){it=!it,await Po(),await Jt(),re()}async function Ni(){let e=prompt("Set Auto Backup interval (minutes):",String(Ve));if(e===null)return;let i=Math.floor(Number(e));if(!Number.isFinite(i)||i<5||i>1440){alert("Please enter a number between 5 and 1440 minutes.");return}Ve=i,await Po(),await Jt(),re()}var Fo=window.location.hash;if(Fo&&Fo.length>1){let e=new URLSearchParams(Fo.substring(1));if(e.get("state")==="timekeeper_auth"){let a=e.get("access_token");if(a){console.log("[Timekeeper] Auth token detected in URL, broadcasting token"),console.log("[Timekeeper] Token length:",a.length,"characters");try{let s=new BroadcastChannel("timekeeper_oauth"),m={type:"timekeeper_oauth_token",token:a};console.log("[Timekeeper] Sending auth message via BroadcastChannel:",{type:m.type,tokenLength:a.length}),s.postMessage(m),s.close(),console.log("[Timekeeper] Token broadcast via BroadcastChannel completed")}catch(s){console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",s);let m={type:"timekeeper_oauth_token",token:a,timestamp:Date.now()},n=indexedDB.open("ytls-timestamps-db",3);n.onsuccess=()=>{let v=n.result,l=v.transaction("settings","readwrite");l.objectStore("settings").put({key:"oauth_message",value:m}),l.oncomplete=()=>{console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",m.timestamp),v.close()}}}if(history.replaceState){let s=window.location.pathname+window.location.search;history.replaceState(null,"",s)}throw console.log("[Timekeeper] Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}(async function(){"use strict";if(window.top!==window.self)return;function e(t){return GM.getValue(`timekeeper_${t}`,void 0)}function i(t,o){return GM.setValue(`timekeeper_${t}`,JSON.stringify(o))}if(oo(e),no(i),await zi()){c("OAuth popup detected, broadcasting token and closing");return}await zo();let s=["/watch","/live"];function m(t=window.location.href){try{let o=new URL(t);return o.origin!=="https://www.youtube.com"?!1:s.some(r=>o.pathname===r||o.pathname.startsWith(`${r}/`))}catch(o){return c("Timekeeper failed to parse URL for support check:",o,"error"),!1}}let n=null,v=null,l=null,S=null,x=null,T=null,D=null,M=null,$=250,J=null,K=!1;function ee(){return n?n.getBoundingClientRect():null}function ie(t,o,r){t&&($e={x:Math.round(typeof o=="number"?o:t.left),y:Math.round(typeof r=="number"?r:t.top),width:Math.round(t.width),height:Math.round(t.height)})}function G(t=!0){if(!n)return;$t();let o=ee();o&&(o.width||o.height)&&(ie(o),t&&(qn("windowPosition",$e),en({type:"window_position_updated",position:$e,timestamp:Date.now()})))}function ue(){if(!n||!v||!S||!l)return;let t=40,o=ne();if(o.length>0)t=o[0].offsetHeight;else{let r=document.createElement("li");r.style.visibility="hidden",r.style.position="absolute",r.textContent="00:00 Example",l.appendChild(r),t=r.offsetHeight,l.removeChild(r)}$=v.offsetHeight+S.offsetHeight+t,n.style.minHeight=$+"px"}function X(){requestAnimationFrame(()=>{typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),ue(),G(!0)})}function he(t=450){pe&&(clearTimeout(pe),pe=null),pe=setTimeout(()=>{R(),X(),pe=null},t)}function Ie(){pe&&(clearTimeout(pe),pe=null)}function ae(){l&&(l.style.visibility="hidden",c("Hiding timestamps during show animation")),X(),he()}function U(){R(),Ie(),Xe&&(clearTimeout(Xe),Xe=null),Xe=setTimeout(()=>{n&&(n.style.display="none",Jo(),Xe=null)},400)}function R(){if(!l){Ge&&(Ge(),Ge=null,at=null,ft=null);return}if(!ft){l.style.visibility==="hidden"&&(l.style.visibility="",c("Restoring timestamp visibility (no deferred fragment)")),Ge&&(Ge(),Ge=null,at=null);return}c("Appending deferred timestamps after animation"),l.appendChild(ft),ft=null,l.style.visibility==="hidden"&&(l.style.visibility="",c("Restoring timestamp visibility after append")),Ge&&(Ge(),Ge=null,at=null),tt(),Ce(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea());let t=_(),o=t?Math.floor(t.getCurrentTime()):Et();Number.isFinite(o)&&Lt(o,!1)}let se=null,de=!1,le="ytls-timestamp-pending-delete",He="ytls-timestamp-highlight",Se="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_64px_Indexed.png",Be="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_Eyebrow_64px_Indexed.png";function We(){let t=o=>{let r=new Image;r.src=o};t(Se),t(Be)}We();async function me(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(t=>setTimeout(t,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(t=>setTimeout(t,100));await new Promise(t=>setTimeout(t,200))}let ze=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],rt=5e3,Xt=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function Oe(t){return Xt.has(t)}function Ne(){return document.querySelector("video")}let Pe=null;function _(){if(Pe&&document.contains(Pe))return Pe;let t=document.getElementById("movie_player");return t&&document.contains(t)?t:null}function ce(t){return ze.every(o=>typeof t?.[o]=="function"?!0:Oe(o)?!!Ne():!1)}function pt(t){return ze.filter(o=>typeof t?.[o]=="function"?!1:Oe(o)?!Ne():!0)}async function kn(t=rt){let o=Date.now();for(;Date.now()-o<t;){let d=_();if(ce(d))return d;await new Promise(h=>setTimeout(h,100))}let r=_();return ce(r),r}let Bt="timestampOffsetSeconds",ao=-5,Qt="shiftClickTimeSkipSeconds",Sn=10,zt=300,wt=300,Fe=null;function $o(){try{return new URL(window.location.href).origin==="https://www.youtube.com"}catch{return!1}}function Ro(){if($o()&&!Fe)try{Fe=new BroadcastChannel("ytls_timestamp_channel"),Fe.onmessage=Ho}catch(t){c("Failed to create BroadcastChannel:",t,"warn"),Fe=null}}function en(t){if(!$o()){c("Skipping BroadcastChannel message: not on https://www.youtube.com","warn");return}if(Ro(),!Fe){c("No BroadcastChannel available to post message","warn");return}try{Fe.postMessage(t)}catch(o){c("BroadcastChannel error, reopening:",o,"warn");try{Fe=new BroadcastChannel("ytls_timestamp_channel"),Fe.onmessage=Ho,Fe.postMessage(t)}catch(r){c("Failed to reopen BroadcastChannel:",r,"error")}}}function Ho(t){if(c("Received message from another tab:",t.data),!(!m()||!l||!n)&&t.data){if(t.data.type==="timestamps_updated"&&t.data.videoId===ge)c("Debouncing timestamp load due to external update for video:",t.data.videoId),clearTimeout(nn),nn=setTimeout(()=>{c("Reloading timestamps due to external update for video:",t.data.videoId),Wo()},500);else if(t.data.type==="window_position_updated"&&n){let o=t.data.position;if(o&&typeof o.x=="number"&&typeof o.y=="number"){n.style.left=`${o.x}px`,n.style.top=`${o.y}px`,n.style.right="auto",n.style.bottom="auto",typeof o.width=="number"&&o.width>0&&(n.style.width=`${o.width}px`),typeof o.height=="number"&&o.height>0&&(n.style.height=`${o.height}px`);let r=n.getBoundingClientRect();$e={x:Math.round(o.x),y:Math.round(o.y),width:Math.round(r.width),height:Math.round(r.height)};let d=document.documentElement.clientWidth,h=document.documentElement.clientHeight;(r.left<0||r.top<0||r.right>d||r.bottom>h)&&$t()}}}}Ro();let Pt=await GM.getValue(Bt);(typeof Pt!="number"||Number.isNaN(Pt))&&(Pt=ao,await GM.setValue(Bt,Pt));let tn=await GM.getValue(Qt);(typeof tn!="number"||Number.isNaN(tn))&&(tn=Sn,await GM.setValue(Qt,tn));let nn=null,xt=new Map,Ln=!1,z=null,In=null,ge=null,Xe=null,pe=null,ft=null,at=null,Ge=null,ht=null,Cn=!1,$e=null,so=!1,Mn=null,Dn=null,An=null,Bn=null,zn=null,Pn=null,Fn=null,on=null,rn=null,an=null,Qe=null,et=null,Oo=0,sn=!1,Tt=null,ln=null;function ne(){return l?Array.from(l.querySelectorAll("li")).filter(t=>!!t.querySelector("a[data-time]")):[]}function lo(){return ne().map(t=>{let o=t.querySelector("a[data-time]"),r=o?.dataset.time;if(!o||!r)return null;let d=Number.parseInt(r,10);if(!Number.isFinite(d))return null;let y=t.querySelector("input")?.value??"",u=t.dataset.guid??crypto.randomUUID();return t.dataset.guid||(t.dataset.guid=u),{start:d,comment:y,guid:u}}).filter(Go)}function Et(){if(ln!==null)return ln;let t=ne();return ln=t.length>0?Math.max(...t.map(o=>{let r=o.querySelector("a[data-time]")?.getAttribute("data-time");return r?Number.parseInt(r,10):0})):0,ln}function $n(){ln=null}function Gi(t){let o=t.querySelector(".time-diff");return o?(o.textContent?.trim()||"").startsWith("-"):!1}function Ui(t,o){return t?o?"\u2514\u2500 ":"\u251C\u2500 ":""}function cn(t){return t.startsWith("\u251C\u2500 ")||t.startsWith("\u2514\u2500 ")?1:0}function No(t){return t.replace(/^[├└]─\s/,"")}function _i(t){let o=ne();if(t>=o.length-1)return"\u2514\u2500 ";let r=o[t+1].querySelector("input");return r&&cn(r.value)===1?"\u251C\u2500 ":"\u2514\u2500 "}function tt(){if(!l)return;let t=ne(),o=!0,r=0,d=t.length;for(;o&&r<d;)o=!1,r++,t.forEach((h,y)=>{let u=h.querySelector("input");if(!u||!(cn(u.value)===1))return;let E=!1;if(y<t.length-1){let P=t[y+1].querySelector("input");P&&(E=!(cn(P.value)===1))}else E=!0;let k=No(u.value),L=`${Ui(!0,E)}${k}`;u.value!==L&&(u.value=L,o=!0)})}function kt(){if(l){for(;l.firstChild;)l.removeChild(l.firstChild);ft&&(ft=null),Ge&&(Ge(),Ge=null,at=null)}}function un(){if(!l||de||ft)return;Array.from(l.children).some(o=>!o.classList.contains("ytls-placeholder")&&!o.classList.contains("ytls-error-message"))||co("No timestamps for this video")}function co(t){if(!l)return;kt();let o=document.createElement("li");o.className="ytls-placeholder",o.textContent=t,l.appendChild(o),l.style.overflowY="hidden"}function uo(){if(!l)return;let t=l.querySelector(".ytls-placeholder");t&&t.remove(),l.style.overflowY=""}function mo(t){if(!(!n||!l)){if(de=t,t)n.style.display="",n.classList.remove("ytls-fade-out"),n.classList.add("ytls-fade-in"),co("Loading timestamps...");else if(uo(),n.style.display="",n.classList.remove("ytls-fade-out"),n.classList.add("ytls-fade-in"),x){let o=_();if(o){let r=o.getCurrentTime(),d=Number.isFinite(r)?Math.max(0,Math.floor(r)):Math.max(0,Et()),h=Math.floor(d/3600),y=Math.floor(d/60)%60,u=d%60,{isLive:g}=o.getVideoData()||{isLive:!1},E=l?ne().map(I=>{let L=I.querySelector("a[data-time]");return L?parseFloat(L.getAttribute("data-time")??"0"):0}):[],k="";if(E.length>0)if(g){let I=Math.max(1,d/60),L=E.filter(P=>P<=d);if(L.length>0){let P=(L.length/I).toFixed(2);parseFloat(P)>0&&(k=` (${P}/min)`)}}else{let I=o.getDuration(),L=Number.isFinite(I)&&I>0?I:0,P=Math.max(1,L/60),oe=(E.length/P).toFixed(1);parseFloat(oe)>0&&(k=` (${oe}/min)`)}x.textContent=`\u23F3${h?h+":"+String(y).padStart(2,"0"):y}:${String(u).padStart(2,"0")}${k}`}}!de&&l&&!l.querySelector(".ytls-error-message")&&un(),st()}}function Go(t){return!!t&&Number.isFinite(t.start)&&typeof t.comment=="string"&&typeof t.guid=="string"}function Rn(t,o){t.textContent=vt(o),t.dataset.time=String(o),t.href=wo(o,window.location.href)}let Hn=null,On=null,St=!1;function qi(t){if(!t||typeof t.getVideoData!="function"||!t.getVideoData()?.isLive)return!1;if(typeof t.getProgressState=="function"){let r=t.getProgressState(),d=Number(r?.seekableEnd??r?.liveHead??r?.head??r?.duration),h=Number(r?.current??t.getCurrentTime?.());if(Number.isFinite(d)&&Number.isFinite(h))return d-h>2}return!1}function Lt(t,o){if(!Number.isFinite(t))return;let r=Nn(t);dn(r,o)}function Nn(t){if(!Number.isFinite(t))return null;let o=ne();if(o.length===0)return null;let r=null,d=-1/0;for(let h of o){let u=h.querySelector("a[data-time]")?.dataset.time;if(!u)continue;let g=Number.parseInt(u,10);Number.isFinite(g)&&g<=t&&g>d&&(d=g,r=h)}return r}function dn(t,o=!1){if(!t)return;if(ne().forEach(d=>{d.classList.contains(le)||d.classList.remove(He)}),!t.classList.contains(le)&&(t.classList.add(He),o&&!Ln))try{if(l instanceof HTMLElement){let d=t.getBoundingClientRect(),h=l.getBoundingClientRect();!(d.bottom<h.top||d.top>h.bottom)||t.scrollIntoView({behavior:"smooth",block:"center"})}else t.scrollIntoView({behavior:"smooth",block:"center"})}catch{try{t.scrollIntoView({behavior:"smooth",block:"center"})}catch{}}}function ji(t){if(!l||l.querySelector(".ytls-error-message")||!Number.isFinite(t)||t===0)return!1;let o=ne();if(o.length===0)return!1;let r=!1;return o.forEach(d=>{let h=d.querySelector("a[data-time]"),y=h?.dataset.time;if(!h||!y)return;let u=Number.parseInt(y,10);if(!Number.isFinite(u))return;let g=Math.max(0,u+t);g!==u&&(Rn(h,g),r=!0)}),r?(pn(),tt(),Ce(),Un(ge),Tt=null,!0):!1}function Uo(t,o={}){if(!Number.isFinite(t)||t===0)return!1;if(!ji(t)){if(o.alertOnNoChange){let u=o.failureMessage??"Offset did not change any timestamps.";alert(u)}return!1}let d=o.logLabel??"bulk offset";c(`Timestamps changed: Offset all timestamps by ${t>0?"+":""}${t} seconds (${d})`);let h=_(),y=h?Math.floor(h.getCurrentTime()):0;if(Number.isFinite(y)){let u=Nn(y);dn(u,!1)}return!0}function _o(t){if(!l||de)return;let o=t.target instanceof HTMLElement?t.target:null;if(o)if(o.dataset.time){t.preventDefault();let r=Number(o.dataset.time);if(Number.isFinite(r)){St=!0;let h=_();h&&h.seekTo(r),setTimeout(()=>{St=!1},500)}let d=o.closest("li");d&&(ne().forEach(h=>{h.classList.contains(le)||h.classList.remove(He)}),d.classList.contains(le)||(d.classList.add(He),d.scrollIntoView({behavior:"smooth",block:"center"})))}else if(o.dataset.increment){t.preventDefault();let d=o.parentElement?.querySelector("a[data-time]");if(!d||!d.dataset.time)return;let h=parseInt(d.dataset.time,10),y=parseInt(o.dataset.increment,10);if("shiftKey"in t&&t.shiftKey&&(y*=tn),"altKey"in t?t.altKey:!1){Uo(y,{logLabel:"Alt adjust"});return}let E=Math.max(0,h+y);c(`Timestamps changed: Timestamp time incremented from ${h} to ${E}`),Rn(d,E),$n();let k=o.closest("li");if(On=E,Hn&&clearTimeout(Hn),St=!0,Hn=setTimeout(()=>{if(On!==null){let I=_();I&&I.seekTo(On)}Hn=null,On=null,setTimeout(()=>{St=!1},500)},500),pn(),tt(),Ce(),k){let I=k.querySelector("input"),L=k.dataset.guid;I&&L&&(Ft(ge,L,E,I.value),Tt=L)}}else o.dataset.action==="clear"&&(t.preventDefault(),c("Timestamps changed: All timestamps cleared from UI"),l.textContent="",$n(),Ce(),Gn(),Un(ge,{allowEmpty:!0}),Tt=null,un())}function mn(t,o="",r=!1,d=null,h=!0){if(!l)return null;let y=Math.max(0,t),u=d??crypto.randomUUID(),g=document.createElement("li"),E=document.createElement("div"),k=document.createElement("span"),I=document.createElement("span"),L=document.createElement("span"),P=document.createElement("a"),oe=document.createElement("span"),O=document.createElement("input"),q=document.createElement("button");g.dataset.guid=u,E.className="time-row";let Me=document.createElement("div");Me.style.cssText="position:absolute;left:0;top:0;width:20px;height:100%;display:flex;align-items:center;justify-content:center;cursor:pointer;",ot(Me,"Click to toggle indent");let we=document.createElement("span");we.style.cssText="color:#999;font-size:12px;pointer-events:none;display:none;";let xe=()=>{let te=cn(O.value);we.textContent=te===1?"\u25C0":"\u25B6"},gt=te=>{te.stopPropagation();let j=cn(O.value),ye=No(O.value),Te=j===0?1:0,Q="";if(Te===1){let Ye=ne().indexOf(g);Q=_i(Ye)}O.value=`${Q}${ye}`,xe(),tt();let ve=Number.parseInt(P.dataset.time??"0",10);Ft(ge,u,ve,O.value)};Me.onclick=gt,Me.append(we),g.style.cssText="position:relative;padding-left:20px;",g.addEventListener("mouseenter",()=>{xe(),we.style.display="inline"}),g.addEventListener("mouseleave",()=>{we.style.display="none"}),g.addEventListener("mouseleave",()=>{g.dataset.guid===Tt&&Gi(g)&&qo()}),O.value=o||"",O.style.cssText="width:100%;margin-top:5px;display:block;",O.type="text",O.setAttribute("inputmode","text"),O.autocapitalize="off",O.autocomplete="off",O.spellcheck=!1,O.addEventListener("focusin",()=>{sn=!1}),O.addEventListener("focusout",te=>{let j=te.relatedTarget,ye=Date.now()-Oo<250,Te=!!j&&!!n&&n.contains(j);!ye&&!Te&&(sn=!0,setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(O.focus({preventScroll:!0}),sn=!1)},0))}),O.addEventListener("input",te=>{let j=te;if(j&&(j.isComposing||j.inputType==="insertCompositionText"))return;let ye=xt.get(u);ye&&clearTimeout(ye);let Te=setTimeout(()=>{let Q=Number.parseInt(P.dataset.time??"0",10);Ft(ge,u,Q,O.value),xt.delete(u)},500);xt.set(u,Te)}),O.addEventListener("compositionend",()=>{let te=Number.parseInt(P.dataset.time??"0",10);setTimeout(()=>{Ft(ge,u,te,O.value)},50)}),k.textContent="\u2796",k.dataset.increment="-1",k.style.cursor="pointer",k.style.margin="0px",k.addEventListener("mouseenter",()=>{k.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),k.addEventListener("mouseleave",()=>{k.style.textShadow="none"}),L.textContent="\u2795",L.dataset.increment="1",L.style.cursor="pointer",L.style.margin="0px",L.addEventListener("mouseenter",()=>{L.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),L.addEventListener("mouseleave",()=>{L.style.textShadow="none"}),I.textContent="\u23FA\uFE0F",I.style.cursor="pointer",I.style.margin="0px",ot(I,"Set to current playback time"),I.addEventListener("mouseenter",()=>{I.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),I.addEventListener("mouseleave",()=>{I.style.textShadow="none"}),I.onclick=()=>{let te=_(),j=te?Math.floor(te.getCurrentTime()):0;Number.isFinite(j)&&(c(`Timestamps changedset to current playback time ${j}`),Rn(P,j),pn(),tt(),Ft(ge,u,j,O.value),Tt=u)},Rn(P,y),$n(),q.textContent="\u{1F5D1}\uFE0F",q.style.cssText="background:transparent;border:none;color:white;cursor:pointer;margin-left:5px;",q.addEventListener("mouseenter",()=>{q.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(255, 100, 100, 0.6)"}),q.addEventListener("mouseleave",()=>{q.style.textShadow="none"}),q.onclick=()=>{let te=null,j=null,ye=null,Te=()=>{try{g.removeEventListener("click",j,!0)}catch{}try{document.removeEventListener("click",j,!0)}catch{}if(l)try{l.removeEventListener("mouseleave",ye)}catch{}te&&(clearTimeout(te),te=null)};if(g.dataset.deleteConfirmed==="true"){c("Timestamps changed: Timestamp deleted");let Q=g.dataset.guid??"",ve=xt.get(Q);ve&&(clearTimeout(ve),xt.delete(Q)),Te(),g.remove(),$n(),pn(),tt(),Ce(),Gn(),Vi(ge,Q),Tt=null,un()}else{g.dataset.deleteConfirmed="true",g.classList.add(le),g.classList.remove(He);let Q=()=>{g.dataset.deleteConfirmed="false",g.classList.remove(le);let ve=_(),nt=ve?ve.getCurrentTime():0,Ye=Number.parseInt(g.querySelector("a[data-time]")?.dataset.time??"0",10);Number.isFinite(nt)&&Number.isFinite(Ye)&&nt>=Ye&&g.classList.add(He),Te()};j=ve=>{ve.target!==q&&Q()},ye=()=>{g.dataset.deleteConfirmed==="true"&&Q()},g.addEventListener("click",j,!0),document.addEventListener("click",j,!0),l&&l.addEventListener("mouseleave",ye),te=setTimeout(()=>{g.dataset.deleteConfirmed==="true"&&Q(),Te()},5e3)}},oe.className="time-diff",oe.style.color="#888",oe.style.marginLeft="5px",E.append(k,I,L,P,oe,q),g.append(Me,E,O);let lt=Number.parseInt(P.dataset.time??"0",10);if(h){uo();let te=!1,j=ne();for(let ye=0;ye<j.length;ye++){let Te=j[ye],ve=Te.querySelector("a[data-time]")?.dataset.time;if(!ve)continue;let nt=Number.parseInt(ve,10);if(Number.isFinite(nt)&&lt<nt){l.insertBefore(g,Te),te=!0;let Ye=j[ye-1];if(Ye){let Ut=Ye.querySelector("a[data-time]")?.dataset.time;if(Ut){let _t=Number.parseInt(Ut,10);Number.isFinite(_t)&&(oe.textContent=vt(lt-_t))}}else oe.textContent="";let Gt=Te.querySelector(".time-diff");Gt&&(Gt.textContent=vt(nt-lt));break}}if(!te&&(l.appendChild(g),j.length>0)){let Q=j[j.length-1].querySelector("a[data-time]")?.dataset.time;if(Q){let ve=Number.parseInt(Q,10);Number.isFinite(ve)&&(oe.textContent=vt(lt-ve))}}g.scrollIntoView({behavior:"smooth",block:"center"}),Gn(),tt(),Ce(),r||(Ft(ge,u,y,o),Tt=u,dn(g,!1))}else O.__ytls_li=g;return O}function pn(){if(!l||l.querySelector(".ytls-error-message"))return;let t=ne();t.forEach((o,r)=>{let d=o.querySelector(".time-diff");if(!d)return;let y=o.querySelector("a[data-time]")?.dataset.time;if(!y){d.textContent="";return}let u=Number.parseInt(y,10);if(!Number.isFinite(u)){d.textContent="";return}if(r===0){d.textContent="";return}let k=t[r-1].querySelector("a[data-time]")?.dataset.time;if(!k){d.textContent="";return}let I=Number.parseInt(k,10);if(!Number.isFinite(I)){d.textContent="";return}let L=u-I,P=L<0?"-":"";d.textContent=` ${P}${vt(Math.abs(L))}`})}function qo(){if(!l||l.querySelector(".ytls-error-message")||de)return;let t=null;if(document.activeElement instanceof HTMLInputElement&&l.contains(document.activeElement)){let u=document.activeElement,E=u.closest("li")?.dataset.guid;if(E){let k=u.selectionStart??u.value.length,I=u.selectionEnd??k,L=u.scrollLeft;t={guid:E,start:k,end:I,scroll:L}}}let o=ne();if(o.length===0)return;let r=o.map(u=>u.dataset.guid),d=o.map(u=>{let g=u.querySelector("a[data-time]"),E=g?.dataset.time;if(!g||!E)return null;let k=Number.parseInt(E,10);if(!Number.isFinite(k))return null;let I=u.dataset.guid??"";return{time:k,guid:I,element:u}}).filter(u=>u!==null).sort((u,g)=>{let E=u.time-g.time;return E!==0?E:u.guid.localeCompare(g.guid)}),h=d.map(u=>u.guid),y=r.length!==h.length||r.some((u,g)=>u!==h[g]);for(;l.firstChild;)l.removeChild(l.firstChild);if(d.forEach(u=>{l.appendChild(u.element)}),pn(),tt(),Ce(),t){let g=ne().find(E=>E.dataset.guid===t.guid)?.querySelector("input");if(g)try{g.focus({preventScroll:!0})}catch{}}y&&(c("Timestamps changed: Timestamps sorted"),Un(ge))}function Gn(){if(!l||!n||!v||!S)return;let t=ne().length;typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea();let o=n.getBoundingClientRect(),r=v.getBoundingClientRect(),d=S.getBoundingClientRect(),h=Math.max(0,o.height-(r.height+d.height));t===0?(un(),l.style.overflowY="hidden"):l.style.overflowY=l.scrollHeight>h?"auto":"hidden"}function Ce(){if(!l)return;let t=Ne(),o=document.querySelector(".ytp-progress-bar"),r=_(),d=r?r.getVideoData():null,h=!!d&&!!d.isLive;if(!t||!o||!isFinite(t.duration)||h)return;Vo(),ne().map(u=>{let g=u.querySelector("a[data-time]"),E=g?.dataset.time;if(!g||!E)return null;let k=Number.parseInt(E,10);if(!Number.isFinite(k))return null;let L=u.querySelector("input")?.value??"",P=u.dataset.guid??crypto.randomUUID();return u.dataset.guid||(u.dataset.guid=P),{start:k,comment:L,guid:P}}).filter(Go).forEach(u=>{if(!Number.isFinite(u.start))return;let g=document.createElement("div");g.className="ytls-marker",g.style.position="absolute",g.style.height="100%",g.style.width="2px",g.style.backgroundColor="#ff0000",g.style.cursor="pointer",g.style.left=u.start/t.duration*100+"%",g.dataset.time=String(u.start),g.addEventListener("click",()=>{let E=_();E&&E.seekTo(u.start)}),o.appendChild(g)})}function Un(t,o={}){if(!l||l.querySelector(".ytls-error-message")||!t)return;if(de){c("Save blocked: timestamps are currently loading");return}tt();let r=lo().sort((d,h)=>d.start-h.start);if(r.length===0&&!o.allowEmpty){c("Save skipped: no timestamps to save");return}Ko(t,r).then(()=>c(`Successfully saved ${r.length} timestamps for ${t} to IndexedDB`)).catch(d=>c(`Failed to save timestamps for ${t} to IndexedDB:`,d,"error")),en({type:"timestamps_updated",videoId:t,action:"saved"})}function Ft(t,o,r,d){if(!t||de)return;let h={guid:o,start:r,comment:d};c(`Saving timestamp: guid=${o}, start=${r}, comment="${d}"`),or(t,h).catch(y=>c(`Failed to save timestamp ${o}:`,y,"error")),en({type:"timestamps_updated",videoId:t,action:"saved"})}function Vi(t,o){!t||de||(c(`Deleting timestamp: guid=${o}`),ir(t,o).catch(r=>c(`Failed to delete timestamp ${o}:`,r,"error")),en({type:"timestamps_updated",videoId:t,action:"saved"}))}async function jo(t){if(!l||l.querySelector(".ytls-error-message")){alert("Cannot export timestamps while displaying an error message.");return}let o=ge;if(!o)return;c(`Exporting timestamps for video ID: ${o}`);let r=lo(),d=Math.max(Et(),0),h=hn();if(t==="json"){let y=new Blob([JSON.stringify(r,null,2)],{type:"application/json"}),u=URL.createObjectURL(y),g=document.createElement("a");g.href=u,g.download=`timestamps-${o}-${h}.json`,g.click(),URL.revokeObjectURL(u)}else if(t==="text"){let y=r.map(k=>{let I=vt(k.start,d),L=`${k.comment} <!-- guid:${k.guid} -->`.trimStart();return`${I} ${L}`}).join(`
`),u=new Blob([y],{type:"text/plain"}),g=URL.createObjectURL(u),E=document.createElement("a");E.href=g,E.download=`timestamps-${o}-${h}.txt`,E.click(),URL.revokeObjectURL(g)}}function po(t){if(!n||!l){c("Timekeeper error:",t,"error");return}kt();let o=document.createElement("li");o.textContent=t,o.classList.add("ytls-error-message"),o.style.color="#ff6b6b",o.style.fontWeight="bold",o.style.padding="8px",o.style.background="rgba(255, 0, 0, 0.1)",l.appendChild(o),Ce()}function Vo(){document.querySelectorAll(".ytls-marker").forEach(t=>t.remove())}function $t(){if(!n||!document.body.contains(n))return;let t=n.getBoundingClientRect(),o=document.documentElement.clientWidth,r=document.documentElement.clientHeight,d=t.width,h=t.height;if(t.left<0&&(n.style.left="0",n.style.right="auto"),t.right>o){let y=Math.max(0,o-d);n.style.left=`${y}px`,n.style.right="auto"}if(t.top<0&&(n.style.top="0",n.style.bottom="auto"),t.bottom>r){let y=Math.max(0,r-h);n.style.top=`${y}px`,n.style.bottom="auto"}}function Wi(){if(Mn&&(document.removeEventListener("mousemove",Mn),Mn=null),Dn&&(document.removeEventListener("mouseup",Dn),Dn=null),on&&(document.removeEventListener("keydown",on),on=null),An&&(window.removeEventListener("resize",An),An=null),rn&&(document.removeEventListener("pointerdown",rn,!0),rn=null),an&&(document.removeEventListener("pointerup",an,!0),an=null),Qe){try{Qe.disconnect()}catch{}Qe=null}if(et){try{et.disconnect()}catch{}et=null}let t=Ne();t&&(Bn&&(t.removeEventListener("timeupdate",Bn),Bn=null),zn&&(t.removeEventListener("pause",zn),zn=null),Pn&&(t.removeEventListener("play",Pn),Pn=null),Fn&&(t.removeEventListener("seeking",Fn),Fn=null))}function Yi(){Vo(),xt.forEach(o=>clearTimeout(o)),xt.clear(),nn&&(clearTimeout(nn),nn=null),se&&(clearInterval(se),se=null),Xe&&(clearTimeout(Xe),Xe=null),Wi();try{Fe.close()}catch{}if(z&&z.parentNode===document.body&&document.body.removeChild(z),z=null,In=null,Ln=!1,ge=null,Qe){try{Qe.disconnect()}catch{}Qe=null}if(et){try{et.disconnect()}catch{}et=null}n&&n.parentNode&&n.remove();let t=document.getElementById("ytls-header-button");t&&t.parentNode&&t.remove(),ht=null,Cn=!1,$e=null,kt(),n=null,v=null,l=null,S=null,x=null,T=null,D=null,Pe=null}async function Ki(){let t=fo();if(!t)return Pe=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let o=await kn();if(!ce(o)){let r=pt(o),d=r.length?` Missing methods: ${r.join(", ")}.`:"",h=o?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return Pe=null,{ok:!1,message:`${h}${d} Try refreshing once playback is ready.`}}return Pe=o,{ok:!0,player:o,videoId:t}}async function Wo(){if(!n||!l)return;let t=l.scrollTop,o=!0,r=()=>{if(!l||!o)return;let d=Math.max(0,l.scrollHeight-l.clientHeight);l.scrollTop=Math.min(t,d)};try{let d=await Ki();if(!d.ok){po(d.message),kt(),Ce();return}let{videoId:h}=d,y=[];try{let u=await rr(h);u?(y=u.map(g=>({...g,guid:g.guid||crypto.randomUUID()})),c(`Loaded ${y.length} timestamps from IndexedDB for ${h}`)):c(`No timestamps found in IndexedDB for ${h}`)}catch(u){c(`Failed to load timestamps from IndexedDB for ${h}:`,u,"error"),po("Failed to load timestamps from IndexedDB. Try refreshing the page."),Ce();return}if(y.length>0){y.sort((I,L)=>I.start-L.start),kt(),uo();let u=document.createDocumentFragment();y.forEach(I=>{let P=mn(I.start,I.comment,!0,I.guid,!1).__ytls_li;P&&u.appendChild(P)}),n&&n.classList.contains("ytls-zoom-in")&&pe!=null?(c("Deferring timestamp DOM append until show animation completes"),ft=u,at||(at=new Promise(I=>{Ge=I})),await at):l&&(l.appendChild(u),tt(),Ce(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea()));let E=_(),k=E?Math.floor(E.getCurrentTime()):Et();Number.isFinite(k)&&(Lt(k,!1),o=!1)}else kt(),co("No timestamps for this video"),Ce(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea())}catch(d){c("Unexpected error while loading timestamps:",d,"error"),po("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{at&&await at,requestAnimationFrame(r),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea()),l&&!l.querySelector(".ytls-error-message")&&un()}}function fo(){let o=new URLSearchParams(location.search).get("v");if(o)return o;let r=document.querySelector('meta[itemprop="identifier"]');return r?.content?r.content:null}function Zi(){let t=Ne();if(!t)return;let o=()=>{if(!l)return;let u=_(),g=u?Math.floor(u.getCurrentTime()):0;if(!Number.isFinite(g))return;let E=Nn(g);dn(E,!1)},r=u=>{try{let g=new URL(window.location.href);u!==null&&Number.isFinite(u)?g.searchParams.set("t",`${Math.floor(u)}s`):g.searchParams.delete("t"),window.history.replaceState({},"",g.toString())}catch{}},d=()=>{let u=_(),g=u?Math.floor(u.getCurrentTime()):NaN;if(Number.isFinite(g)){r(g);try{Lt(g,!0)}catch(E){c("Failed to highlight nearest timestamp on pause:",E,"warn")}}},h=()=>{r(null);try{let u=_(),g=u?Math.floor(u.getCurrentTime()):NaN;Number.isFinite(g)&&Lt(g,!0)}catch(u){c("Failed to highlight nearest timestamp on play:",u,"warn")}},y=()=>{let u=Ne();if(!u)return;let g=_(),E=g?Math.floor(g.getCurrentTime()):0;if(!Number.isFinite(E))return;u.paused&&r(E);let k=Nn(E);dn(k,!0)};Bn=o,zn=d,Pn=h,Fn=y,t.addEventListener("timeupdate",o),t.addEventListener("pause",d),t.addEventListener("play",h),t.addEventListener("seeking",y)}let Ji="ytls-timestamps-db",Xi=3,Rt="timestamps",Ue="timestamps_v2",_n="settings",Ht=null,Ot=null;function Nt(){if(Ht)try{if(Ht.objectStoreNames.length>=0)return Promise.resolve(Ht)}catch(t){c("IndexedDB connection is no longer usable:",t,"warn"),Ht=null}return Ot||(Ot=nr().then(t=>(Ht=t,Ot=null,t.onclose=()=>{c("IndexedDB connection closed unexpectedly","warn"),Ht=null},t.onerror=o=>{c("IndexedDB connection error:",o,"error")},t)).catch(t=>{throw Ot=null,t}),Ot)}async function Yo(){let t={},o=await Zo(Ue),r=new Map;for(let y of o){let u=y;r.has(u.video_id)||r.set(u.video_id,[]),r.get(u.video_id).push({guid:u.guid,start:u.start,comment:u.comment})}for(let[y,u]of r)t[`ytls-${y}`]={video_id:y,timestamps:u.sort((g,E)=>g.start-E.start)};return{json:JSON.stringify(t,null,2),filename:"timekeeper-data.json",totalVideos:r.size,totalTimestamps:o.length}}async function Qi(){try{let{json:t,filename:o,totalVideos:r,totalTimestamps:d}=await Yo(),h=new Blob([t],{type:"application/json"}),y=URL.createObjectURL(h),u=document.createElement("a");u.href=y,u.download=o,u.click(),URL.revokeObjectURL(y),c(`Exported ${r} videos with ${d} timestamps`)}catch(t){throw c("Failed to export data:",t,"error"),t}}async function er(){let t=await Zo(Ue);if(!Array.isArray(t)||t.length===0){let k=`Tag,Timestamp,URL
`,I=`timestamps-${hn()}.csv`;return{csv:k,filename:I,totalVideos:0,totalTimestamps:0}}let o=new Map;for(let k of t)o.has(k.video_id)||o.set(k.video_id,[]),o.get(k.video_id).push({start:k.start,comment:k.comment});let r=[];r.push("Tag,Timestamp,URL");let d=0,h=k=>`"${String(k).replace(/"/g,'""')}"`,y=k=>{let I=Math.floor(k/3600),L=Math.floor(k%3600/60),P=String(k%60).padStart(2,"0");return`${String(I).padStart(2,"0")}:${String(L).padStart(2,"0")}:${P}`},u=Array.from(o.keys()).sort();for(let k of u){let I=o.get(k).sort((L,P)=>L.start-P.start);for(let L of I){let P=L.comment,oe=y(L.start),O=wo(L.start,`https://www.youtube.com/watch?v=${k}`);r.push([h(P),h(oe),h(O)].join(",")),d++}}let g=r.join(`
`),E=`timestamps-${hn()}.csv`;return{csv:g,filename:E,totalVideos:o.size,totalTimestamps:d}}async function tr(){try{let{csv:t,filename:o,totalVideos:r,totalTimestamps:d}=await er(),h=new Blob([t],{type:"text/csv;charset=utf-8;"}),y=URL.createObjectURL(h),u=document.createElement("a");u.href=y,u.download=o,u.click(),URL.revokeObjectURL(y),c(`Exported ${r} videos with ${d} timestamps (CSV)`)}catch(t){throw c("Failed to export CSV data:",t,"error"),t}}function nr(){return new Promise((t,o)=>{let r=indexedDB.open(Ji,Xi);r.onupgradeneeded=d=>{let h=d.target.result,y=d.oldVersion,u=d.target.transaction;if(y<1&&h.createObjectStore(Rt,{keyPath:"video_id"}),y<2&&!h.objectStoreNames.contains(_n)&&h.createObjectStore(_n,{keyPath:"key"}),y<3){if(h.objectStoreNames.contains(Rt)){c("Exporting backup before v2 migration...");let k=u.objectStore(Rt).getAll();k.onsuccess=()=>{let I=k.result;if(I.length>0)try{let L={},P=0;I.forEach(Me=>{if(Array.isArray(Me.timestamps)&&Me.timestamps.length>0){let we=Me.timestamps.map(xe=>({guid:xe.guid||crypto.randomUUID(),start:xe.start,comment:xe.comment}));L[`ytls-${Me.video_id}`]={video_id:Me.video_id,timestamps:we.sort((xe,gt)=>xe.start-gt.start)},P+=we.length}});let oe=new Blob([JSON.stringify(L,null,2)],{type:"application/json"}),O=URL.createObjectURL(oe),q=document.createElement("a");q.href=O,q.download=`timekeeper-data-${hn()}.json`,q.click(),URL.revokeObjectURL(O),c(`Pre-migration backup exported: ${I.length} videos, ${P} timestamps`)}catch(L){c("Failed to export pre-migration backup:",L,"error")}}}let g=h.createObjectStore(Ue,{keyPath:"guid"});if(g.createIndex("video_id","video_id",{unique:!1}),g.createIndex("video_start",["video_id","start"],{unique:!1}),h.objectStoreNames.contains(Rt)){let k=u.objectStore(Rt).getAll();k.onsuccess=()=>{let I=k.result;if(I.length>0){let L=0;I.forEach(P=>{Array.isArray(P.timestamps)&&P.timestamps.length>0&&P.timestamps.forEach(oe=>{g.put({guid:oe.guid||crypto.randomUUID(),video_id:P.video_id,start:oe.start,comment:oe.comment}),L++})}),c(`Migrated ${L} timestamps from ${I.length} videos to v2 store`)}},h.deleteObjectStore(Rt),c("Deleted old timestamps store after migration to v2")}}},r.onsuccess=d=>{t(d.target.result)},r.onerror=d=>{let h=d.target.error;o(h??new Error("Failed to open IndexedDB"))}})}function ho(t,o,r){return Nt().then(d=>new Promise((h,y)=>{let u;try{u=d.transaction(t,o)}catch(k){y(new Error(`Failed to create transaction for ${t}: ${k}`));return}let g=u.objectStore(t),E;try{E=r(g)}catch(k){y(new Error(`Failed to execute operation on ${t}: ${k}`));return}E&&(E.onsuccess=()=>h(E.result),E.onerror=()=>y(E.error??new Error(`IndexedDB ${o} operation failed`))),u.oncomplete=()=>{E||h(void 0)},u.onerror=()=>y(u.error??new Error("IndexedDB transaction failed")),u.onabort=()=>y(u.error??new Error("IndexedDB transaction aborted"))}))}function Ko(t,o){return Nt().then(r=>new Promise((d,h)=>{let y;try{y=r.transaction([Ue],"readwrite")}catch(k){h(new Error(`Failed to create transaction: ${k}`));return}let u=y.objectStore(Ue),E=u.index("video_id").getAll(IDBKeyRange.only(t));E.onsuccess=()=>{try{let k=E.result,I=new Set(o.map(L=>L.guid));k.forEach(L=>{I.has(L.guid)||u.delete(L.guid)}),o.forEach(L=>{u.put({guid:L.guid,video_id:t,start:L.start,comment:L.comment})})}catch(k){c("Error during save operation:",k,"error")}},E.onerror=()=>{h(E.error??new Error("Failed to get existing records"))},y.oncomplete=()=>d(),y.onerror=()=>h(y.error??new Error("Failed to save to IndexedDB")),y.onabort=()=>h(y.error??new Error("Transaction aborted during save"))}))}function or(t,o){return Nt().then(r=>new Promise((d,h)=>{let y;try{y=r.transaction([Ue],"readwrite")}catch(E){h(new Error(`Failed to create transaction: ${E}`));return}let g=y.objectStore(Ue).put({guid:o.guid,video_id:t,start:o.start,comment:o.comment});g.onerror=()=>{h(g.error??new Error("Failed to put timestamp"))},y.oncomplete=()=>d(),y.onerror=()=>h(y.error??new Error("Failed to save single timestamp to IndexedDB")),y.onabort=()=>h(y.error??new Error("Transaction aborted during single timestamp save"))}))}function ir(t,o){return c(`Deleting timestamp ${o} for video ${t}`),Nt().then(r=>new Promise((d,h)=>{let y;try{y=r.transaction([Ue],"readwrite")}catch(E){h(new Error(`Failed to create transaction: ${E}`));return}let g=y.objectStore(Ue).delete(o);g.onerror=()=>{h(g.error??new Error("Failed to delete timestamp"))},y.oncomplete=()=>d(),y.onerror=()=>h(y.error??new Error("Failed to delete single timestamp from IndexedDB")),y.onabort=()=>h(y.error??new Error("Transaction aborted during timestamp deletion"))}))}function rr(t){return Nt().then(o=>new Promise(r=>{let d;try{d=o.transaction([Ue],"readonly")}catch(g){c("Failed to create read transaction:",g,"warn"),r(null);return}let u=d.objectStore(Ue).index("video_id").getAll(IDBKeyRange.only(t));u.onsuccess=()=>{let g=u.result;if(g.length>0){let E=g.map(k=>({guid:k.guid,start:k.start,comment:k.comment})).sort((k,I)=>k.start-I.start);r(E)}else r(null)},u.onerror=()=>{c("Failed to load timestamps:",u.error,"warn"),r(null)},d.onabort=()=>{c("Transaction aborted during load:",d.error,"warn"),r(null)}}))}function ar(t){return Nt().then(o=>new Promise((r,d)=>{let h;try{h=o.transaction([Ue],"readwrite")}catch(E){d(new Error(`Failed to create transaction: ${E}`));return}let y=h.objectStore(Ue),g=y.index("video_id").getAll(IDBKeyRange.only(t));g.onsuccess=()=>{try{g.result.forEach(k=>{y.delete(k.guid)})}catch(E){c("Error during remove operation:",E,"error")}},g.onerror=()=>{d(g.error??new Error("Failed to get records for removal"))},h.oncomplete=()=>r(),h.onerror=()=>d(h.error??new Error("Failed to remove timestamps")),h.onabort=()=>d(h.error??new Error("Transaction aborted during timestamp removal"))}))}function Zo(t){return ho(t,"readonly",o=>o.getAll()).then(o=>Array.isArray(o)?o:[])}function qn(t,o){ho(_n,"readwrite",r=>{r.put({key:t,value:o})}).catch(r=>{c(`Failed to save setting '${t}' to IndexedDB:`,r,"error")})}function go(t){return ho(_n,"readonly",o=>o.get(t)).then(o=>o?.value).catch(o=>{c(`Failed to load setting '${t}' from IndexedDB:`,o,"error")})}function Jo(){if(!n)return;let t=n.style.display!=="none";qn("uiVisible",t)}function st(t){let o=typeof t=="boolean"?t:!!n&&n.style.display!=="none",r=document.getElementById("ytls-header-button");r instanceof HTMLButtonElement&&r.setAttribute("aria-pressed",String(o)),ht&&!Cn&&ht.src!==Se&&(ht.src=Se)}function sr(){n&&go("uiVisible").then(t=>{let o=t;typeof o=="boolean"?(o?(n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in")):n.style.display="none",st(o)):(n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),st(!0))}).catch(t=>{c("Failed to load UI visibility state:",t,"error"),n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),st(!0)})}function yo(t){if(!n){c("ERROR: togglePaneVisibility called but pane is null");return}document.body.contains(n)||(c("Pane not in DOM during toggle, appending it"),document.querySelectorAll("#ytls-pane").forEach(h=>{h!==n&&h.remove()}),document.body.appendChild(n));let o=document.querySelectorAll("#ytls-pane");o.length>1&&(c(`ERROR: Multiple panes detected in togglePaneVisibility (${o.length}), cleaning up`),o.forEach(h=>{h!==n&&h.remove()})),Xe&&(clearTimeout(Xe),Xe=null);let r=n.style.display==="none";(typeof t=="boolean"?t:r)?(n.style.display="flex",n.classList.remove("ytls-fade-out"),n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),st(!0),Jo(),ae(),pe&&(clearTimeout(pe),pe=null),pe=setTimeout(()=>{R(),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),ue(),G(!0);try{let h=_(),y=h?Math.floor(h.getCurrentTime()):NaN;Number.isFinite(y)&&Lt(y,!0)}catch(h){c("Failed to scroll to nearest timestamp after toggle:",h,"warn")}pe=null},450)):(n.classList.remove("ytls-fade-in"),n.classList.remove("ytls-zoom-in"),n.classList.add("ytls-zoom-out"),st(!1),U())}function Xo(t){if(!l){c("UI is not initialized; cannot import timestamps.","warn");return}let o=!1;try{let r=JSON.parse(t),d=null;if(Array.isArray(r))d=r;else if(typeof r=="object"&&r!==null){let h=ge;if(h){let y=`timekeeper-${h}`;r[y]&&Array.isArray(r[y].timestamps)&&(d=r[y].timestamps,c(`Found timestamps for current video (${h}) in export format`,"info"))}if(!d){let y=Object.keys(r).filter(u=>u.startsWith("ytls-"));if(y.length===1&&Array.isArray(r[y[0]].timestamps)){d=r[y[0]].timestamps;let u=r[y[0]].video_id;c(`Found timestamps for video ${u} in export format`,"info")}}}d&&Array.isArray(d)?d.every(y=>typeof y.start=="number"&&typeof y.comment=="string")?(d.forEach(y=>{if(y.guid){let u=ne().find(g=>g.dataset.guid===y.guid);if(u){let g=u.querySelector("input");g&&(g.value=y.comment)}else mn(y.start,y.comment,!1,y.guid)}else mn(y.start,y.comment,!1,crypto.randomUUID())}),o=!0):c("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):c("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!o){let r=t.split(`
`).map(d=>d.trim()).filter(d=>d);if(r.length>0){let d=!1;r.forEach(h=>{let y=h.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(y){d=!0;let u=parseInt(y[1])||0,g=parseInt(y[2]),E=parseInt(y[3]),k=u*3600+g*60+E,I=y[4]?y[4].trim():"",L=null,P=I,oe=I.match(/<!--\s*guid:([^>]+?)\s*-->/);oe&&(L=oe[1].trim(),P=I.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let O;if(L&&(O=ne().find(q=>q.dataset.guid===L)),!O&&!L&&(O=ne().find(q=>{if(q.dataset.guid)return!1;let we=q.querySelector("a[data-time]")?.dataset.time;if(!we)return!1;let xe=Number.parseInt(we,10);return Number.isFinite(xe)&&xe===k})),O){let q=O.querySelector("input");q&&(q.value=P)}else mn(k,P,!1,L||crypto.randomUUID())}}),d&&(o=!0)}}o?(c("Timestamps changed: Imported timestamps from file/clipboard"),tt(),Un(ge),Ce(),Gn()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function lr(){if(so){c("Pane initialization already in progress, skipping duplicate call");return}if(!(n&&document.body.contains(n))){so=!0;try{let d=function(){if(de||St)return;let p=Ne(),f=_();if(!p&&!f)return;let b=f?f.getCurrentTime():0,w=Number.isFinite(b)?Math.max(0,Math.floor(b)):Math.max(0,Et()),C=Math.floor(w/3600),B=Math.floor(w/60)%60,A=w%60,{isLive:N}=f?f.getVideoData()||{isLive:!1}:{isLive:!1},F=f?qi(f):!1,Z=l?ne().map(Y=>{let be=Y.querySelector("a[data-time]");return be?parseFloat(be.getAttribute("data-time")??"0"):0}):[],De="";if(Z.length>0)if(N){let Y=Math.max(1,w/60),be=Z.filter(Ae=>Ae<=w);if(be.length>0){let Ae=(be.length/Y).toFixed(2);parseFloat(Ae)>0&&(De=` (${Ae}/min)`)}}else{let Y=f?f.getDuration():0,be=Number.isFinite(Y)&&Y>0?Y:p&&Number.isFinite(p.duration)&&p.duration>0?p.duration:0,Ae=Math.max(1,be/60),ct=(Z.length/Ae).toFixed(1);parseFloat(ct)>0&&(De=` (${ct}/min)`)}x.textContent=`\u23F3${C?C+":"+String(B).padStart(2,"0"):B}:${String(A).padStart(2,"0")}${De}`,x.style.color=F?"#ff4d4f":"",Z.length>0&&Lt(w,!1)},q=function(p,f,b){let w=document.createElement("button");return w.textContent=p,ot(w,f),w.classList.add("ytls-settings-modal-button"),w.onclick=b,w},Me=function(p="general"){if(z&&z.parentNode===document.body){let Le=document.getElementById("ytls-save-modal"),yt=document.getElementById("ytls-load-modal"),ut=document.getElementById("ytls-delete-all-modal");Le&&document.body.contains(Le)&&document.body.removeChild(Le),yt&&document.body.contains(yt)&&document.body.removeChild(yt),ut&&document.body.contains(ut)&&document.body.removeChild(ut),z.classList.remove("ytls-fade-in"),z.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(z)&&document.body.removeChild(z),z=null,document.removeEventListener("click",xe,!0),document.removeEventListener("keydown",we)},300);return}z=document.createElement("div"),z.id="ytls-settings-modal",z.classList.remove("ytls-fade-out"),z.classList.add("ytls-fade-in");let f=document.createElement("div");f.className="ytls-modal-header";let b=document.createElement("div");b.id="ytls-settings-nav";let w=document.createElement("button");w.className="ytls-modal-close-button",w.textContent="\u2715",w.onclick=()=>{if(z&&z.parentNode===document.body){let Le=document.getElementById("ytls-save-modal"),yt=document.getElementById("ytls-load-modal"),ut=document.getElementById("ytls-delete-all-modal");Le&&document.body.contains(Le)&&document.body.removeChild(Le),yt&&document.body.contains(yt)&&document.body.removeChild(yt),ut&&document.body.contains(ut)&&document.body.removeChild(ut),z.classList.remove("ytls-fade-in"),z.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(z)&&document.body.removeChild(z),z=null,document.removeEventListener("click",xe,!0),document.removeEventListener("keydown",we)},300)}};let C=document.createElement("div");C.id="ytls-settings-content";let B=document.createElement("h3");B.className="ytls-section-heading",B.textContent="General",B.style.display="none";let A=document.createElement("div"),N=document.createElement("div");N.className="ytls-button-grid";function F(Le){A.style.display=Le==="general"?"block":"none",N.style.display=Le==="drive"?"block":"none",Z.classList.toggle("active",Le==="general"),Y.classList.toggle("active",Le==="drive"),B.textContent=Le==="general"?"General":"Google Drive"}let Z=document.createElement("button");Z.textContent="\u{1F6E0}\uFE0F";let De=document.createElement("span");De.className="ytls-tab-text",De.textContent=" General",Z.appendChild(De),ot(Z,"General settings"),Z.classList.add("ytls-settings-modal-button"),Z.onclick=()=>F("general");let Y=document.createElement("button");Y.textContent="\u2601\uFE0F";let be=document.createElement("span");be.className="ytls-tab-text",be.textContent=" Backup",Y.appendChild(be),ot(Y,"Google Drive sign-in and backup"),Y.classList.add("ytls-settings-modal-button"),Y.onclick=async()=>{H.isSignedIn&&await Fi(),F("drive")},b.appendChild(Z),b.appendChild(Y),f.appendChild(b),f.appendChild(w),z.appendChild(f),A.className="ytls-button-grid",A.appendChild(q("\u{1F4BE} Save","Save As...",gt.onclick)),A.appendChild(q("\u{1F4C2} Load","Load",lt.onclick)),A.appendChild(q("\u{1F4E4} Export All","Export All Data",te.onclick)),A.appendChild(q("\u{1F4E5} Import All","Import All Data",j.onclick)),A.appendChild(q("\u{1F4C4} Export All (CSV)","Export All Timestamps to CSV",async()=>{try{await tr()}catch{alert("Failed to export CSV: Could not read from database.")}}));let Ae=q(H.isSignedIn?"\u{1F513} Sign Out":"\u{1F510} Sign In",H.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{H.isSignedIn?await Pi():await Bi(),Ae.textContent=H.isSignedIn?"\u{1F513} Sign Out":"\u{1F510} Sign In",ot(Ae,H.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),typeof re=="function"&&re()});N.appendChild(Ae);let ct=q(it?"\u{1F501} Auto Backup: On":"\u{1F501} Auto Backup: Off","Toggle Auto Backup",async()=>{await Oi(),ct.textContent=it?"\u{1F501} Auto Backup: On":"\u{1F501} Auto Backup: Off",typeof re=="function"&&re()});N.appendChild(ct);let Ct=q(`\u23F1\uFE0F Backup Interval: ${Ve}min`,"Set periodic backup interval (minutes)",async()=>{await Ni(),Ct.textContent=`\u23F1\uFE0F Backup Interval: ${Ve}min`,typeof re=="function"&&re()});N.appendChild(Ct),N.appendChild(q("\u{1F5C4}\uFE0F Backup Now","Run a backup immediately",async()=>{await Tn(!1),typeof re=="function"&&re()}));let _e=document.createElement("div");_e.style.marginTop="15px",_e.style.paddingTop="10px",_e.style.borderTop="1px solid #555",_e.style.fontSize="12px",_e.style.color="#aaa";let Mt=document.createElement("div");Mt.style.marginBottom="8px",Mt.style.fontWeight="bold",_e.appendChild(Mt),Mi(Mt);let bo=document.createElement("div");bo.style.marginBottom="8px",Ii(bo),_e.appendChild(bo);let oi=document.createElement("div");Ci(oi),_e.appendChild(oi),N.appendChild(_e),Re(),En(),re(),C.appendChild(B),C.appendChild(A),C.appendChild(N),F(p),z.appendChild(C),document.body.appendChild(z),requestAnimationFrame(()=>{let Le=z.getBoundingClientRect(),ut=(window.innerHeight-Le.height)/2;z.style.top=`${Math.max(20,ut)}px`,z.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",xe,!0),document.addEventListener("keydown",we)},0)},we=function(p){if(p.key==="Escape"&&z&&z.parentNode===document.body){let f=document.getElementById("ytls-save-modal"),b=document.getElementById("ytls-load-modal"),w=document.getElementById("ytls-delete-all-modal");if(f||b||w)return;p.preventDefault(),f&&document.body.contains(f)&&document.body.removeChild(f),b&&document.body.contains(b)&&document.body.removeChild(b),w&&document.body.contains(w)&&document.body.removeChild(w),z.classList.remove("ytls-fade-in"),z.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(z)&&document.body.removeChild(z),z=null,document.removeEventListener("click",xe,!0),document.removeEventListener("keydown",we)},300)}},xe=function(p){if(In&&In.contains(p.target))return;let f=document.getElementById("ytls-save-modal"),b=document.getElementById("ytls-load-modal"),w=document.getElementById("ytls-delete-all-modal");f&&f.contains(p.target)||b&&b.contains(p.target)||w&&w.contains(p.target)||z&&z.contains(p.target)||(f&&document.body.contains(f)&&document.body.removeChild(f),b&&document.body.contains(b)&&document.body.removeChild(b),w&&document.body.contains(w)&&document.body.removeChild(w),z&&z.parentNode===document.body&&(z.classList.remove("ytls-fade-in"),z.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(z)&&document.body.removeChild(z),z=null,document.removeEventListener("click",xe,!0),document.removeEventListener("keydown",we)},300)))},ye=function(){n&&(c("Loading window position from IndexedDB"),go("windowPosition").then(p=>{if(p&&typeof p.x=="number"&&typeof p.y=="number"){let b=p;n.style.left=`${b.x}px`,n.style.top=`${b.y}px`,n.style.right="auto",n.style.bottom="auto",typeof b.width=="number"&&b.width>0?n.style.width=`${b.width}px`:(n.style.width=`${zt}px`,c(`No stored window width found, using default width ${zt}px`)),typeof b.height=="number"&&b.height>0?n.style.height=`${b.height}px`:(n.style.height=`${wt}px`,c(`No stored window height found, using default height ${wt}px`));let w=ee();ie(w,b.x,b.y),c("Restored window position from IndexedDB:",$e)}else c("No window position found in IndexedDB, applying default size and leaving default position"),n.style.width=`${zt}px`,n.style.height=`${wt}px`,$e=null;$t();let f=ee();f&&(f.width||f.height)&&ie(f),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea()}).catch(p=>{c("failed to load pane position from IndexedDB:",p,"warn"),$t();let f=ee();f&&(f.width||f.height)&&($e={x:Math.max(0,Math.round(f.left)),y:0,width:Math.round(f.width),height:Math.round(f.height)}),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea()}))},Te=function(){if(!n)return;let p=ee();if(!p)return;let f={x:Math.max(0,Math.round(p.left)),y:Math.max(0,Math.round(p.top)),width:Math.round(p.width),height:Math.round(p.height)};if($e&&$e.x===f.x&&$e.y===f.y&&$e.width===f.width&&$e.height===f.height){c("Skipping window position save; position and size unchanged");return}$e={...f},c(`Saving window position and size to IndexedDB: x=${f.x}, y=${f.y}, width=${f.width}, height=${f.height}`),qn("windowPosition",f),en({type:"window_position_updated",position:f,timestamp:Date.now()})},Yn=function(p,f){p.addEventListener("dblclick",b=>{b.preventDefault(),b.stopPropagation(),n&&(n.style.width="300px",n.style.height="300px",Te(),fn())}),p.addEventListener("mousedown",b=>{b.preventDefault(),b.stopPropagation(),qt=!0,It=f,ti=b.clientX,ni=b.clientY;let w=n.getBoundingClientRect();jt=w.width,Vt=w.height,Vn=w.left,Wn=w.top,f==="top-left"||f==="bottom-right"?document.body.style.cursor="nwse-resize":document.body.style.cursor="nesw-resize"})},fn=function(){if(n&&v&&S&&l){let p=n.getBoundingClientRect(),f=v.getBoundingClientRect(),b=S.getBoundingClientRect(),w=p.height-(f.height+b.height);l.style.maxHeight=w>0?w+"px":"0px",l.style.overflowY=w>0?"auto":"hidden"}};document.querySelectorAll("#ytls-pane").forEach(p=>p.remove()),n=document.createElement("div"),v=document.createElement("div"),l=document.createElement("ul"),S=document.createElement("div"),x=document.createElement("span"),T=document.createElement("style"),D=document.createElement("span"),M=document.createElement("span"),M.classList.add("ytls-backup-indicator"),M.style.cursor="pointer",M.style.backgroundColor="#666",M.onclick=p=>{p.stopPropagation(),Me("drive")},l.addEventListener("mouseenter",()=>{Ln=!0,sn=!1}),l.addEventListener("mouseleave",()=>{if(Ln=!1,sn)return;let p=_(),f=p?Math.floor(p.getCurrentTime()):Et();Lt(f,!1);let b=null;if(document.activeElement instanceof HTMLInputElement&&l.contains(document.activeElement)&&(b=document.activeElement.closest("li")?.dataset.guid??null),qo(),b){let C=ne().find(B=>B.dataset.guid===b)?.querySelector("input");if(C)try{C.focus({preventScroll:!0})}catch{}}}),n.id="ytls-pane",v.id="ytls-pane-header",v.addEventListener("dblclick",p=>{let f=p.target instanceof HTMLElement?p.target:null;f&&(f.closest("a")||f.closest("button")||f.closest("#ytls-current-time")||f.closest(".ytls-version-display")||f.closest(".ytls-backup-indicator"))||(p.preventDefault(),yo(!1))});let t=p=>{try{p.stopPropagation()}catch{}};["click","dblclick","mousedown","pointerdown","touchstart","wheel"].forEach(p=>{n.addEventListener(p,t)}),n.addEventListener("keydown",p=>{try{p.stopPropagation()}catch{}}),n.addEventListener("keyup",p=>{try{p.stopPropagation()}catch{}}),n.addEventListener("focus",p=>{try{p.stopPropagation()}catch{}},!0),n.addEventListener("blur",p=>{try{p.stopPropagation()}catch{}},!0);let o=GM_info.script.version;D.textContent=`v${o}`,D.classList.add("ytls-version-display");let r=document.createElement("span");r.style.display="inline-flex",r.style.alignItems="center",r.style.gap="6px",r.appendChild(D),r.appendChild(M),x.id="ytls-current-time",x.textContent="\u23F3",x.onclick=()=>{St=!0;let p=_();p&&p.seekToLiveHead(),setTimeout(()=>{St=!1},500)},d(),se&&clearInterval(se),se=setInterval(d,1e3),S.id="ytls-buttons";let h=(p,f)=>()=>{p.classList.remove("ytls-fade-in"),p.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(p)&&document.body.removeChild(p),f&&f()},300)},y=p=>f=>{f.key==="Escape"&&(f.preventDefault(),f.stopPropagation(),p())},u=p=>{setTimeout(()=>{document.addEventListener("keydown",p)},0)},g=(p,f)=>b=>{p.contains(b.target)||f()},E=p=>{setTimeout(()=>{document.addEventListener("click",p,!0)},0)},oe=[{label:"\u{1F423}",title:"Add timestamp",action:()=>{if(!l||l.querySelector(".ytls-error-message")||de)return;let p=typeof Pt<"u"?Pt:0,f=_(),b=f?Math.floor(f.getCurrentTime()+p):0;if(!Number.isFinite(b))return;let w=mn(b,"");w&&w.focus()}},{label:"\u2699\uFE0F",title:"Settings",action:()=>Me()},{label:"\u{1F4CB}",title:"Copy timestamps to clipboard",action:function(p){if(!l||l.querySelector(".ytls-error-message")||de){this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3);return}let f=lo(),b=Math.max(Et(),0);if(f.length===0){this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3);return}let w=p.ctrlKey,C=f.map(B=>{let A=vt(B.start,b);return w?`${A} ${B.comment} <!-- guid:${B.guid} -->`.trimStart():`${A} ${B.comment}`}).join(`
`);navigator.clipboard.writeText(C).then(()=>{this.textContent="\u2705",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3)}).catch(B=>{c("Failed to copy timestamps: ",B,"error"),this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3)})}},{label:"\u23F1\uFE0F",title:"Offset all timestamps",action:()=>{if(!l||l.querySelector(".ytls-error-message")||de)return;if(ne().length===0){alert("No timestamps available to offset.");return}let f=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(f===null)return;let b=f.trim();if(b.length===0)return;let w=Number.parseInt(b,10);if(!Number.isFinite(w)){alert("Please enter a valid integer number of seconds.");return}w!==0&&Uo(w,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{label:"\u{1F5D1}\uFE0F",title:"Delete all timestamps for current video",action:async()=>{let p=fo();if(!p){alert("Unable to determine current video ID.");return}let f=document.createElement("div");f.id="ytls-delete-all-modal",f.classList.remove("ytls-fade-out"),f.classList.add("ytls-fade-in");let b=document.createElement("p");b.textContent="Hold the button to delete all timestamps for:",b.style.marginBottom="10px";let w=document.createElement("p");w.textContent=p,w.style.fontFamily="monospace",w.style.fontSize="12px",w.style.marginBottom="15px",w.style.color="#aaa";let C=document.createElement("button");C.classList.add("ytls-save-modal-button"),C.style.background="#d32f2f",C.style.position="relative",C.style.overflow="hidden";let B=null,A=0,N=null,F=document.createElement("div");F.style.position="absolute",F.style.left="0",F.style.top="0",F.style.height="100%",F.style.width="0%",F.style.background="#ff6b6b",F.style.transition="none",F.style.pointerEvents="none",C.appendChild(F);let Z=document.createElement("span");Z.textContent="Hold to Delete All",Z.style.position="relative",Z.style.zIndex="1",C.appendChild(Z);let De=()=>{if(!A)return;let _e=Date.now()-A,Mt=Math.min(_e/5e3*100,100);F.style.width=`${Mt}%`,Mt<100&&(N=requestAnimationFrame(De))},Y=()=>{B&&(clearTimeout(B),B=null),N&&(cancelAnimationFrame(N),N=null),A=0,F.style.width="0%",Z.textContent="Hold to Delete All"};C.onmousedown=()=>{A=Date.now(),Z.textContent="Deleting...",N=requestAnimationFrame(De),B=setTimeout(async()=>{Y(),f.classList.remove("ytls-fade-in"),f.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(f)&&document.body.removeChild(f);try{await ar(p),vo()}catch(_e){c("Failed to delete all timestamps:",_e,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},C.onmouseup=Y,C.onmouseleave=Y;let be=null,Ae=null,ct=h(f,()=>{Y(),be&&document.removeEventListener("keydown",be),Ae&&document.removeEventListener("click",Ae,!0)});be=y(ct),Ae=g(f,ct);let Ct=document.createElement("button");Ct.textContent="Cancel",Ct.classList.add("ytls-save-modal-cancel-button"),Ct.onclick=ct,f.appendChild(b),f.appendChild(w),f.appendChild(C),f.appendChild(Ct),document.body.appendChild(f),u(be),E(Ae)}}],O=ii();oe.forEach(p=>{let f=document.createElement("button");if(f.textContent=p.label,ot(f,p.title),f.classList.add("ytls-main-button"),p.label==="\u{1F423}"&&O){let b=document.createElement("span");b.textContent=O,b.classList.add("ytls-holiday-emoji"),f.appendChild(b)}p.label==="\u{1F4CB}"?f.onclick=function(b){p.action.call(this,b)}:f.onclick=p.action,p.label==="\u2699\uFE0F"&&(In=f),S.appendChild(f)});let gt=document.createElement("button");gt.textContent="\u{1F4BE} Save",gt.classList.add("ytls-file-operation-button"),gt.onclick=()=>{let p=document.createElement("div");p.id="ytls-save-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let f=document.createElement("p");f.textContent="Save as:";let b=null,w=null,C=h(p,()=>{b&&document.removeEventListener("keydown",b),w&&document.removeEventListener("click",w,!0)});b=y(C),w=g(p,C);let B=document.createElement("button");B.textContent="JSON",B.classList.add("ytls-save-modal-button"),B.onclick=()=>{b&&document.removeEventListener("keydown",b),w&&document.removeEventListener("click",w,!0),h(p,()=>jo("json"))()};let A=document.createElement("button");A.textContent="Plain Text",A.classList.add("ytls-save-modal-button"),A.onclick=()=>{b&&document.removeEventListener("keydown",b),w&&document.removeEventListener("click",w,!0),h(p,()=>jo("text"))()};let N=document.createElement("button");N.textContent="Cancel",N.classList.add("ytls-save-modal-cancel-button"),N.onclick=C,p.appendChild(f),p.appendChild(B),p.appendChild(A),p.appendChild(N),document.body.appendChild(p),u(b),E(w)};let lt=document.createElement("button");lt.textContent="\u{1F4C2} Load",lt.classList.add("ytls-file-operation-button"),lt.onclick=()=>{let p=document.createElement("div");p.id="ytls-load-modal",p.classList.remove("ytls-fade-out"),p.classList.add("ytls-fade-in");let f=document.createElement("p");f.textContent="Load from:";let b=null,w=null,C=h(p,()=>{b&&document.removeEventListener("keydown",b),w&&document.removeEventListener("click",w,!0)});b=y(C),w=g(p,C);let B=document.createElement("button");B.textContent="File",B.classList.add("ytls-save-modal-button"),B.onclick=()=>{let F=document.createElement("input");F.type="file",F.accept=".json,.txt",F.classList.add("ytls-hidden-file-input"),F.onchange=Z=>{let De=Z.target.files?.[0];if(!De)return;b&&document.removeEventListener("keydown",b),w&&document.removeEventListener("click",w,!0),C();let Y=new FileReader;Y.onload=()=>{let be=String(Y.result).trim();Xo(be)},Y.readAsText(De)},F.click()};let A=document.createElement("button");A.textContent="Clipboard",A.classList.add("ytls-save-modal-button"),A.onclick=async()=>{b&&document.removeEventListener("keydown",b),w&&document.removeEventListener("click",w,!0),h(p,async()=>{try{let F=await navigator.clipboard.readText();F?Xo(F.trim()):alert("Clipboard is empty.")}catch(F){c("Failed to read from clipboard: ",F,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let N=document.createElement("button");N.textContent="Cancel",N.classList.add("ytls-save-modal-cancel-button"),N.onclick=C,p.appendChild(f),p.appendChild(B),p.appendChild(A),p.appendChild(N),document.body.appendChild(p),u(b),E(w)};let te=document.createElement("button");te.textContent="\u{1F4E4} Export",te.classList.add("ytls-file-operation-button"),te.onclick=async()=>{try{await Qi()}catch{alert("Failed to export data: Could not read from database.")}};let j=document.createElement("button");j.textContent="\u{1F4E5} Import",j.classList.add("ytls-file-operation-button"),j.onclick=()=>{let p=document.createElement("input");p.type="file",p.accept=".json",p.classList.add("ytls-hidden-file-input"),p.onchange=f=>{let b=f.target.files?.[0];if(!b)return;let w=new FileReader;w.onload=()=>{try{let C=JSON.parse(String(w.result)),B=[];for(let A in C)if(Object.prototype.hasOwnProperty.call(C,A)&&A.startsWith("ytls-")){let N=A.substring(5),F=C[A];if(F&&typeof F.video_id=="string"&&Array.isArray(F.timestamps)){let Z=F.timestamps.map(Y=>({...Y,guid:Y.guid||crypto.randomUUID()})),De=Ko(N,Z).then(()=>c(`Imported ${N} to IndexedDB`)).catch(Y=>c(`Failed to import ${N} to IndexedDB:`,Y,"error"));B.push(De)}else c(`Skipping key ${A} during import due to unexpected data format.`,"warn")}Promise.all(B).then(()=>{vo()}).catch(A=>{alert("An error occurred during import to IndexedDB. Check console for details."),c("Overall import error:",A,"error")})}catch(C){alert(`Failed to import data. Please ensure the file is in the correct format.
`+C.message),c("Import error:",C,"error")}},w.readAsText(b)},p.click()},T.textContent=si,l.onclick=p=>{_o(p)},l.ontouchstart=p=>{_o(p)},n.style.position="fixed",n.style.bottom="0",n.style.right="0",n.style.transition="none",ye(),setTimeout(()=>$t(),10);let Q=!1,ve,nt,Ye=!1;n.addEventListener("mousedown",p=>{let f=p.target;f instanceof Element&&(f instanceof HTMLInputElement||f instanceof HTMLTextAreaElement||f!==v&&!v.contains(f)&&window.getComputedStyle(f).cursor==="pointer"||(Q=!0,Ye=!1,ve=p.clientX-n.getBoundingClientRect().left,nt=p.clientY-n.getBoundingClientRect().top,n.style.transition="none"))}),document.addEventListener("mousemove",Mn=p=>{if(!Q)return;Ye=!0;let f=p.clientX-ve,b=p.clientY-nt,w=n.getBoundingClientRect(),C=w.width,B=w.height,A=document.documentElement.clientWidth,N=document.documentElement.clientHeight;f=Math.max(0,Math.min(f,A-C)),b=Math.max(0,Math.min(b,N-B)),n.style.left=`${f}px`,n.style.top=`${b}px`,n.style.right="auto",n.style.bottom="auto"}),document.addEventListener("mouseup",Dn=()=>{if(!Q)return;Q=!1;let p=Ye;setTimeout(()=>{Ye=!1},50),$t(),setTimeout(()=>{p&&Te()},200)}),n.addEventListener("dragstart",p=>p.preventDefault());let Gt=document.createElement("div"),jn=document.createElement("div"),Ut=document.createElement("div"),_t=document.createElement("div");Gt.id="ytls-resize-tl",jn.id="ytls-resize-tr",Ut.id="ytls-resize-bl",_t.id="ytls-resize-br";let qt=!1,ti=0,ni=0,jt=0,Vt=0,Vn=0,Wn=0,It=null;Yn(Gt,"top-left"),Yn(jn,"top-right"),Yn(Ut,"bottom-left"),Yn(_t,"bottom-right"),document.addEventListener("mousemove",p=>{if(!qt||!n||!It)return;let f=p.clientX-ti,b=p.clientY-ni,w=jt,C=Vt,B=Vn,A=Wn,N=document.documentElement.clientWidth,F=document.documentElement.clientHeight;It==="bottom-right"?(w=Math.max(200,Math.min(800,jt+f)),C=Math.max(250,Math.min(F,Vt+b))):It==="top-left"?(w=Math.max(200,Math.min(800,jt-f)),B=Vn+f,C=Math.max(250,Math.min(F,Vt-b)),A=Wn+b):It==="top-right"?(w=Math.max(200,Math.min(800,jt+f)),C=Math.max(250,Math.min(F,Vt-b)),A=Wn+b):It==="bottom-left"&&(w=Math.max(200,Math.min(800,jt-f)),B=Vn+f,C=Math.max(250,Math.min(F,Vt+b))),B=Math.max(0,Math.min(B,N-w)),A=Math.max(0,Math.min(A,F-C)),n.style.width=`${w}px`,n.style.height=`${C}px`,n.style.left=`${B}px`,n.style.top=`${A}px`,n.style.right="auto",n.style.bottom="auto"}),document.addEventListener("mouseup",()=>{qt&&(qt=!1,It=null,document.body.style.cursor="",G(!0))});let Kn=null;window.addEventListener("resize",An=()=>{Kn&&clearTimeout(Kn),Kn=setTimeout(()=>{G(!0),Kn=null},200)}),v.appendChild(x),v.appendChild(r);let Zn=document.createElement("div");if(Zn.id="ytls-content",Zn.append(l),Zn.append(S),n.append(v,Zn,T,Gt,jn,Ut,_t),n.addEventListener("mousemove",p=>{try{if(Q||qt)return;let f=n.getBoundingClientRect(),b=20,w=p.clientX,C=p.clientY,B=w-f.left<=b,A=f.right-w<=b,N=C-f.top<=b,F=f.bottom-C<=b,Z="";N&&B||F&&A?Z="nwse-resize":N&&A||F&&B?Z="nesw-resize":Z="",document.body.style.cursor=Z}catch{}}),n.addEventListener("mouseleave",()=>{!qt&&!Q&&(document.body.style.cursor="")}),window.recalculateTimestampsArea=fn,setTimeout(()=>{if(fn(),n&&v&&S&&l){let p=40,f=ne();if(f.length>0)p=f[0].offsetHeight;else{let b=document.createElement("li");b.style.visibility="hidden",b.style.position="absolute",b.textContent="00:00 Example",l.appendChild(b),p=b.offsetHeight,l.removeChild(b)}$=v.offsetHeight+S.offsetHeight+p,n.style.minHeight=$+"px"}},0),window.addEventListener("resize",fn),et){try{et.disconnect()}catch{}et=null}et=new ResizeObserver(fn),et.observe(n),rn||document.addEventListener("pointerdown",rn=()=>{Oo=Date.now()},!0),an||document.addEventListener("pointerup",an=()=>{},!0)}finally{so=!1}}}async function cr(){if(!n)return;if(document.querySelectorAll("#ytls-pane").forEach(r=>{r!==n&&(c("Removing duplicate pane element from DOM"),r.remove())}),document.body.contains(n)){c("Pane already in DOM, skipping append");return}await sr(),typeof Bo=="function"&&Bo(Yo),typeof no=="function"&&no(qn),typeof oo=="function"&&oo(go),typeof Ao=="function"&&Ao(M),await zo(),await Ri(),await Jt(),typeof ro=="function"&&ro();let o=document.querySelectorAll("#ytls-pane");if(o.length>0&&(c(`WARNING: Found ${o.length} existing pane(s) in DOM, removing all`),o.forEach(r=>r.remove())),document.body.contains(n)){c("ERROR: Pane already in body, aborting append");return}if(document.body.appendChild(n),c("Pane successfully appended to DOM"),ae(),pe&&(clearTimeout(pe),pe=null),pe=setTimeout(()=>{R(),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),ue(),G(!0),pe=null},450),Qe){try{Qe.disconnect()}catch{}Qe=null}Qe=new MutationObserver(()=>{let r=document.querySelectorAll("#ytls-pane");r.length>1&&(c(`CRITICAL: Multiple panes detected (${r.length}), removing duplicates`),r.forEach((d,h)=>{(h>0||n&&d!==n)&&d.remove()}))}),Qe.observe(document.body,{childList:!0,subtree:!0})}function Qo(t=0){if(document.getElementById("ytls-header-button")){st();return}let o=document.querySelector("#logo");if(!o||!o.parentElement){t<10&&setTimeout(()=>Qo(t+1),300);return}let r=document.createElement("button");r.id="ytls-header-button",r.type="button",r.className="ytls-header-button",ot(r,"Toggle Timekeeper UI"),r.setAttribute("aria-label","Toggle Timekeeper UI");let d=document.createElement("img");d.src=Se,d.alt="",d.decoding="async",r.appendChild(d),ht=d,r.addEventListener("mouseenter",()=>{ht&&(Cn=!0,ht.src=Be)}),r.addEventListener("mouseleave",()=>{ht&&(Cn=!1,st())}),r.addEventListener("click",()=>{n&&!document.body.contains(n)&&(c("Pane not in DOM, re-appending before toggle"),document.body.appendChild(n)),yo()}),o.insertAdjacentElement("afterend",r),st(),c("Timekeeper header button added next to YouTube logo")}function ei(){if(K)return;K=!0;let t=history.pushState,o=history.replaceState;function r(){try{let d=new Event("locationchange");window.dispatchEvent(d)}catch{}}history.pushState=function(){let d=t.apply(this,arguments);return r(),d},history.replaceState=function(){let d=o.apply(this,arguments);return r(),d},window.addEventListener("popstate",r),window.addEventListener("locationchange",()=>{window.location.href!==J&&c("Location changed (locationchange event) \u2014 deferring UI update until navigation finish")})}async function vo(){if(!m()){Yi();return}J=window.location.href,document.querySelectorAll("#ytls-pane").forEach((o,r)=>{(r>0||n&&o!==n)&&o.remove()}),await me(),await lr(),ge=fo();let t=document.title;c("Page Title:",t),c("Video ID:",ge),c("Current URL:",window.location.href),mo(!0),kt(),Ce(),await Wo(),Ce(),mo(!1),c("Timestamps loaded and UI unlocked for video:",ge),await cr(),Qo(),Zi()}ei(),window.addEventListener("yt-navigate-start",()=>{c("Navigation started (yt-navigate-start event fired)"),m()&&n&&l&&(c("Locking UI and showing loading state for navigation"),mo(!0))}),on=t=>{t.ctrlKey&&t.altKey&&t.shiftKey&&(t.key==="T"||t.key==="t")&&(t.preventDefault(),yo(),c("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",on),window.addEventListener("yt-navigate-finish",()=>{c("Navigation finished (yt-navigate-finish event fired)"),window.location.href!==J?vo():c("Navigation finished but URL already handled, skipping.")}),ei(),c("Timekeeper initialized and waiting for navigation events")})();})();

