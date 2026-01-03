// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      4.4.2
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

(()=>{function l(e,...i){let a="debug",s=[...i];i.length>0&&typeof i[i.length-1]=="string"&&["debug","info","warn","error"].includes(i[i.length-1])&&(a=s.pop());let n=`[Timekeeper v${GM_info.script.version}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[a](`${n} ${e}`,...s)}function vt(e,i=e){let a=Math.floor(e/3600),s=Math.floor(e%3600/60),p=String(e%60).padStart(2,"0");return i<3600?`${s<10?s:String(s).padStart(2,"0")}:${p}`:`${i>=36e3?String(a).padStart(2,"0"):a}:${String(s).padStart(2,"0")}:${p}`}function go(e,i=window.location.href){try{let a=new URL(i);return a.searchParams.set("t",`${e}s`),a.toString()}catch{return`https://www.youtube.com/watch?v=${i.search(/[?&]v=/)>=0?i.split(/[?&]v=/)[1].split(/&/)[0]:i.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${e}s`}}function dn(){let e=new Date;return e.getUTCFullYear()+"-"+String(e.getUTCMonth()+1).padStart(2,"0")+"-"+String(e.getUTCDate()).padStart(2,"0")+"--"+String(e.getUTCHours()).padStart(2,"0")+"-"+String(e.getUTCMinutes()).padStart(2,"0")+"-"+String(e.getUTCSeconds()).padStart(2,"0")}var or=[{emoji:"\u{1F942}",month:1,day:1,name:"New Year's Day"},{emoji:"\u{1F49D}",month:2,day:14,name:"Valentine's Day"},{emoji:"\u{1F986}",month:5,day:25,name:"Kanna's Debut Anniversary"},{emoji:"\u{1F383}",month:10,day:31,name:"Halloween"},{emoji:"\u{1F382}",month:9,day:15,name:"Kanna's Birthday"},{emoji:"\u{1F332}",month:12,day:25,name:"Christmas"}];function ei(){let e=new Date,i=e.getFullYear(),a=e.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});for(let s of or){let p=new Date(i,s.month-1,s.day),n=p.getTime()-e.getTime(),v=n/(1e3*60*60*24);if(v<=5&&v>=-2)return l(`Current date: ${a}, Selected emoji: ${s.emoji} (${s.name}), Days until holiday: ${Math.ceil(v)}`),s.emoji;if(v<-2&&(p=new Date(i+1,s.month-1,s.day),n=p.getTime()-e.getTime(),v=n/(1e3*60*60*24),v<=5&&v>=-2))return l(`Current date: ${a}, Selected emoji: ${s.emoji} (${s.name}), Days until holiday: ${Math.ceil(v)}`),s.emoji;if(v>5&&(p=new Date(i-1,s.month-1,s.day),n=p.getTime()-e.getTime(),v=n/(1e3*60*60*24),v<=5&&v>=-2))return l(`Current date: ${a}, Selected emoji: ${s.emoji} (${s.name}), Days until holiday: ${Math.ceil(v)}`),s.emoji}return l(`Current date: ${a}, No holiday emoji (not within range)`),null}var bt=null,_t=null,ir=500;function rr(){return(!bt||!document.body.contains(bt))&&(bt=document.createElement("div"),bt.className="ytls-tooltip",document.body.appendChild(bt)),bt}function ar(e,i,a){let p=window.innerWidth,n=window.innerHeight,v=e.getBoundingClientRect(),c=v.width,S=v.height,E=i+10,k=a+10;E+c>p-10&&(E=i-c-10),k+S>n-10&&(k=a-S-10),E=Math.max(10,Math.min(E,p-c-10)),k=Math.max(10,Math.min(k,n-S-10)),e.style.left=`${E}px`,e.style.top=`${k}px`}function sr(e,i,a){_t&&clearTimeout(_t),_t=setTimeout(()=>{let s=rr();s.textContent=e,s.classList.remove("ytls-tooltip-visible"),ar(s,i,a),requestAnimationFrame(()=>{s.classList.add("ytls-tooltip-visible")})},ir)}function yo(){_t&&(clearTimeout(_t),_t=null),bt&&bt.classList.remove("ytls-tooltip-visible")}function nt(e,i){let a=0,s=0,p=S=>{a=S.clientX,s=S.clientY;let E=typeof i=="function"?i():i;E&&sr(E,a,s)},n=S=>{a=S.clientX,s=S.clientY},v=()=>{yo()};e.addEventListener("mouseenter",p),e.addEventListener("mousemove",n),e.addEventListener("mouseleave",v);let c=new MutationObserver(()=>{try{if(!document.body.contains(e))yo();else{let S=window.getComputedStyle(e);(S.display==="none"||S.visibility==="hidden"||S.opacity==="0")&&yo()}}catch{}});try{c.observe(e,{attributes:!0,attributeFilter:["class","style"]}),c.observe(document.body,{childList:!0,subtree:!0})}catch{}e.__tooltipCleanup=()=>{e.removeEventListener("mouseenter",p),e.removeEventListener("mousemove",n),e.removeEventListener("mouseleave",v);try{c.disconnect()}catch{}delete e.__tooltipObserver},e.__tooltipObserver=c}var ti=`
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

`;var ke=Uint8Array,je=Uint16Array,Eo=Int32Array,ko=new ke([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),So=new ke([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),ni=new ke([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),li=function(e,i){for(var a=new je(31),s=0;s<31;++s)a[s]=i+=1<<e[s-1];for(var p=new Eo(a[30]),s=1;s<30;++s)for(var n=a[s];n<a[s+1];++n)p[n]=n-a[s]<<5|s;return{b:a,r:p}},ci=li(ko,2),lr=ci.b,bo=ci.r;lr[28]=258,bo[258]=28;var ui=li(So,0),Or=ui.b,oi=ui.r,wo=new je(32768);for(_=0;_<32768;++_)dt=(_&43690)>>1|(_&21845)<<1,dt=(dt&52428)>>2|(dt&13107)<<2,dt=(dt&61680)>>4|(dt&3855)<<4,wo[_]=((dt&65280)>>8|(dt&255)<<8)>>1;var dt,_,fn=(function(e,i,a){for(var s=e.length,p=0,n=new je(i);p<s;++p)e[p]&&++n[e[p]-1];var v=new je(i);for(p=1;p<i;++p)v[p]=v[p-1]+n[p-1]<<1;var c;if(a){c=new je(1<<i);var S=15-i;for(p=0;p<s;++p)if(e[p])for(var E=p<<4|e[p],k=i-e[p],M=v[e[p]-1]++<<k,D=M|(1<<k)-1;M<=D;++M)c[wo[M]>>S]=E}else for(c=new je(s),p=0;p<s;++p)e[p]&&(c[p]=wo[v[e[p]-1]++]>>15-e[p]);return c}),Dt=new ke(288);for(_=0;_<144;++_)Dt[_]=8;var _;for(_=144;_<256;++_)Dt[_]=9;var _;for(_=256;_<280;++_)Dt[_]=7;var _;for(_=280;_<288;++_)Dt[_]=8;var _,Wn=new ke(32);for(_=0;_<32;++_)Wn[_]=5;var _,cr=fn(Dt,9,0);var ur=fn(Wn,5,0);var di=function(e){return(e+7)/8|0},mi=function(e,i,a){return(i==null||i<0)&&(i=0),(a==null||a>e.length)&&(a=e.length),new ke(e.subarray(i,a))};var dr=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],Kn=function(e,i,a){var s=new Error(i||dr[e]);if(s.code=e,Error.captureStackTrace&&Error.captureStackTrace(s,Kn),!a)throw s;return s};var mt=function(e,i,a){a<<=i&7;var s=i/8|0;e[s]|=a,e[s+1]|=a>>8},mn=function(e,i,a){a<<=i&7;var s=i/8|0;e[s]|=a,e[s+1]|=a>>8,e[s+2]|=a>>16},vo=function(e,i){for(var a=[],s=0;s<e.length;++s)e[s]&&a.push({s,f:e[s]});var p=a.length,n=a.slice();if(!p)return{t:fi,l:0};if(p==1){var v=new ke(a[0].s+1);return v[a[0].s]=1,{t:v,l:1}}a.sort(function(ge,Ce){return ge.f-Ce.f}),a.push({s:-1,f:25001});var c=a[0],S=a[1],E=0,k=1,M=2;for(a[0]={s:-1,f:c.f+S.f,l:c,r:S};k!=p-1;)c=a[a[E].f<a[M].f?E++:M++],S=a[E!=k&&a[E].f<a[M].f?E++:M++],a[k++]={s:-1,f:c.f+S.f,l:c,r:S};for(var D=n[0].s,s=1;s<p;++s)n[s].s>D&&(D=n[s].s);var R=new je(D+1),Z=xo(a[k-1],R,0);if(Z>i){var s=0,W=0,X=Z-i,oe=1<<X;for(n.sort(function(Ce,ae){return R[ae.s]-R[Ce.s]||Ce.f-ae.f});s<p;++s){var G=n[s].s;if(R[G]>i)W+=oe-(1<<Z-R[G]),R[G]=i;else break}for(W>>=X;W>0;){var de=n[s].s;R[de]<i?W-=1<<i-R[de]++-1:++s}for(;s>=0&&W;--s){var J=n[s].s;R[J]==i&&(--R[J],++W)}Z=i}return{t:new ke(R),l:Z}},xo=function(e,i,a){return e.s==-1?Math.max(xo(e.l,i,a+1),xo(e.r,i,a+1)):i[e.s]=a},ii=function(e){for(var i=e.length;i&&!e[--i];);for(var a=new je(++i),s=0,p=e[0],n=1,v=function(S){a[s++]=S},c=1;c<=i;++c)if(e[c]==p&&c!=i)++n;else{if(!p&&n>2){for(;n>138;n-=138)v(32754);n>2&&(v(n>10?n-11<<5|28690:n-3<<5|12305),n=0)}else if(n>3){for(v(p),--n;n>6;n-=6)v(8304);n>2&&(v(n-3<<5|8208),n=0)}for(;n--;)v(p);n=1,p=e[c]}return{c:a.subarray(0,s),n:i}},pn=function(e,i){for(var a=0,s=0;s<i.length;++s)a+=e[s]*i[s];return a},pi=function(e,i,a){var s=a.length,p=di(i+2);e[p]=s&255,e[p+1]=s>>8,e[p+2]=e[p]^255,e[p+3]=e[p+1]^255;for(var n=0;n<s;++n)e[p+n+4]=a[n];return(p+4+s)*8},ri=function(e,i,a,s,p,n,v,c,S,E,k){mt(i,k++,a),++p[256];for(var M=vo(p,15),D=M.t,R=M.l,Z=vo(n,15),W=Z.t,X=Z.l,oe=ii(D),G=oe.c,de=oe.n,J=ii(W),ge=J.c,Ce=J.n,ae=new je(19),U=0;U<G.length;++U)++ae[G[U]&31];for(var U=0;U<ge.length;++U)++ae[ge[U]&31];for(var H=vo(ae,7),le=H.t,me=H.l,ce=19;ce>4&&!le[ni[ce-1]];--ce);var He=E+5<<3,Se=pn(p,Dt)+pn(n,Wn)+v,Be=pn(p,D)+pn(n,W)+v+14+3*ce+pn(ae,le)+2*ae[16]+3*ae[17]+7*ae[18];if(S>=0&&He<=Se&&He<=Be)return pi(i,k,e.subarray(S,S+E));var Ye,pe,ze,it;if(mt(i,k,1+(Be<Se)),k+=2,Be<Se){Ye=fn(D,R,0),pe=D,ze=fn(W,X,0),it=W;var Yt=fn(le,me,0);mt(i,k,de-257),mt(i,k+5,Ce-1),mt(i,k+10,ce-4),k+=14;for(var U=0;U<ce;++U)mt(i,k+3*U,le[ni[U]]);k+=3*ce;for(var Oe=[G,ge],Ne=0;Ne<2;++Ne)for(var Pe=Oe[Ne],U=0;U<Pe.length;++U){var q=Pe[U]&31;mt(i,k,Yt[q]),k+=le[q],q>15&&(mt(i,k,Pe[U]>>5&127),k+=Pe[U]>>12)}}else Ye=cr,pe=Dt,ze=ur,it=Wn;for(var U=0;U<c;++U){var ue=s[U];if(ue>255){var q=ue>>18&31;mn(i,k,Ye[q+257]),k+=pe[q+257],q>7&&(mt(i,k,ue>>23&31),k+=ko[q]);var pt=ue&31;mn(i,k,ze[pt]),k+=it[pt],pt>3&&(mn(i,k,ue>>5&8191),k+=So[pt])}else mn(i,k,Ye[ue]),k+=pe[ue]}return mn(i,k,Ye[256]),k+pe[256]},mr=new Eo([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),fi=new ke(0),pr=function(e,i,a,s,p,n){var v=n.z||e.length,c=new ke(s+v+5*(1+Math.ceil(v/7e3))+p),S=c.subarray(s,c.length-p),E=n.l,k=(n.r||0)&7;if(i){k&&(S[0]=n.r>>3);for(var M=mr[i-1],D=M>>13,R=M&8191,Z=(1<<a)-1,W=n.p||new je(32768),X=n.h||new je(Z+1),oe=Math.ceil(a/3),G=2*oe,de=function(Fe){return(e[Fe]^e[Fe+1]<<oe^e[Fe+2]<<G)&Z},J=new Eo(25e3),ge=new je(288),Ce=new je(32),ae=0,U=0,H=n.i||0,le=0,me=n.w||0,ce=0;H+2<v;++H){var He=de(H),Se=H&32767,Be=X[He];if(W[Se]=Be,X[He]=Se,me<=H){var Ye=v-H;if((ae>7e3||le>24576)&&(Ye>423||!E)){k=ri(e,S,0,J,ge,Ce,U,le,ce,H-ce,k),le=ae=U=0,ce=H;for(var pe=0;pe<286;++pe)ge[pe]=0;for(var pe=0;pe<30;++pe)Ce[pe]=0}var ze=2,it=0,Yt=R,Oe=Se-Be&32767;if(Ye>2&&He==de(H-Oe))for(var Ne=Math.min(D,Ye)-1,Pe=Math.min(32767,H),q=Math.min(258,Ye);Oe<=Pe&&--Yt&&Se!=Be;){if(e[H+ze]==e[H+ze-Oe]){for(var ue=0;ue<q&&e[H+ue]==e[H+ue-Oe];++ue);if(ue>ze){if(ze=ue,it=Oe,ue>Ne)break;for(var pt=Math.min(Oe,ue-2),bn=0,pe=0;pe<pt;++pe){var Mt=H-Oe+pe&32767,no=W[Mt],Kt=Mt-no&32767;Kt>bn&&(bn=Kt,Be=Mt)}}}Se=Be,Be=W[Se],Oe+=Se-Be&32767}if(it){J[le++]=268435456|bo[ze]<<18|oi[it];var wn=bo[ze]&31,At=oi[it]&31;U+=ko[wn]+So[At],++ge[257+wn],++Ce[At],me=H+ze,++ae}else J[le++]=e[H],++ge[e[H]]}}for(H=Math.max(H,me);H<v;++H)J[le++]=e[H],++ge[e[H]];k=ri(e,S,E,J,ge,Ce,U,le,ce,H-ce,k),E||(n.r=k&7|S[k/8|0]<<3,k-=7,n.h=X,n.p=W,n.i=H,n.w=me)}else{for(var H=n.w||0;H<v+E;H+=65535){var wt=H+65535;wt>=v&&(S[k/8|0]=E,wt=v),k=pi(S,k+1,e.subarray(H,wt))}n.i=v}return mi(c,0,s+di(k)+p)},fr=(function(){for(var e=new Int32Array(256),i=0;i<256;++i){for(var a=i,s=9;--s;)a=(a&1&&-306674912)^a>>>1;e[i]=a}return e})(),hr=function(){var e=-1;return{p:function(i){for(var a=e,s=0;s<i.length;++s)a=fr[a&255^i[s]]^a>>>8;e=a},d:function(){return~e}}};var gr=function(e,i,a,s,p){if(!p&&(p={l:1},i.dictionary)){var n=i.dictionary.subarray(-32768),v=new ke(n.length+e.length);v.set(n),v.set(e,n.length),e=v,p.w=n.length}return pr(e,i.level==null?6:i.level,i.mem==null?p.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+i.mem,a,s,p)},hi=function(e,i){var a={};for(var s in e)a[s]=e[s];for(var s in i)a[s]=i[s];return a};var Ee=function(e,i,a){for(;a;++i)e[i]=a,a>>>=8};function yr(e,i){return gr(e,i||{},0,0)}var gi=function(e,i,a,s){for(var p in e){var n=e[p],v=i+p,c=s;Array.isArray(n)&&(c=hi(s,n[1]),n=n[0]),n instanceof ke?a[v]=[n,c]:(a[v+="/"]=[new ke(0),c],gi(n,v,a,s))}},ai=typeof TextEncoder<"u"&&new TextEncoder,vr=typeof TextDecoder<"u"&&new TextDecoder,br=0;try{vr.decode(fi,{stream:!0}),br=1}catch{}function Yn(e,i){if(i){for(var a=new ke(e.length),s=0;s<e.length;++s)a[s]=e.charCodeAt(s);return a}if(ai)return ai.encode(e);for(var p=e.length,n=new ke(e.length+(e.length>>1)),v=0,c=function(k){n[v++]=k},s=0;s<p;++s){if(v+5>n.length){var S=new ke(v+8+(p-s<<1));S.set(n),n=S}var E=e.charCodeAt(s);E<128||i?c(E):E<2048?(c(192|E>>6),c(128|E&63)):E>55295&&E<57344?(E=65536+(E&1047552)|e.charCodeAt(++s)&1023,c(240|E>>18),c(128|E>>12&63),c(128|E>>6&63),c(128|E&63)):(c(224|E>>12),c(128|E>>6&63),c(128|E&63))}return mi(n,0,v)}var To=function(e){var i=0;if(e)for(var a in e){var s=e[a].length;s>65535&&Kn(9),i+=s+4}return i},si=function(e,i,a,s,p,n,v,c){var S=s.length,E=a.extra,k=c&&c.length,M=To(E);Ee(e,i,v!=null?33639248:67324752),i+=4,v!=null&&(e[i++]=20,e[i++]=a.os),e[i]=20,i+=2,e[i++]=a.flag<<1|(n<0&&8),e[i++]=p&&8,e[i++]=a.compression&255,e[i++]=a.compression>>8;var D=new Date(a.mtime==null?Date.now():a.mtime),R=D.getFullYear()-1980;if((R<0||R>119)&&Kn(10),Ee(e,i,R<<25|D.getMonth()+1<<21|D.getDate()<<16|D.getHours()<<11|D.getMinutes()<<5|D.getSeconds()>>1),i+=4,n!=-1&&(Ee(e,i,a.crc),Ee(e,i+4,n<0?-n-2:n),Ee(e,i+8,a.size)),Ee(e,i+12,S),Ee(e,i+14,M),i+=16,v!=null&&(Ee(e,i,k),Ee(e,i+6,a.attrs),Ee(e,i+10,v),i+=14),e.set(s,i),i+=S,M)for(var Z in E){var W=E[Z],X=W.length;Ee(e,i,+Z),Ee(e,i+2,X),e.set(W,i+4),i+=4+X}return k&&(e.set(c,i),i+=k),i},wr=function(e,i,a,s,p){Ee(e,i,101010256),Ee(e,i+8,a),Ee(e,i+10,a),Ee(e,i+12,s),Ee(e,i+16,p)};function yi(e,i){i||(i={});var a={},s=[];gi(e,"",a,i);var p=0,n=0;for(var v in a){var c=a[v],S=c[0],E=c[1],k=E.level==0?0:8,M=Yn(v),D=M.length,R=E.comment,Z=R&&Yn(R),W=Z&&Z.length,X=To(E.extra);D>65535&&Kn(11);var oe=k?yr(S,E):S,G=oe.length,de=hr();de.p(S),s.push(hi(E,{size:S.length,crc:de.d(),c:oe,f:M,m:Z,u:D!=v.length||Z&&R.length!=W,o:p,compression:k})),p+=30+D+X+G,n+=76+2*(D+X)+(W||0)+G}for(var J=new ke(n+22),ge=p,Ce=n-p,ae=0;ae<s.length;++ae){var M=s[ae];si(J,M.o,M,M.f,M.u,M.c.length);var U=30+M.f.length+To(M.extra);J.set(M.c,M.o+U),si(J,p,M,M.f,M.u,M.c.length,M.o,M.m),p+=16+U+(M.m?M.m.length:0)}return wr(J,p,s.length,Ce,ge),J}var O={isSignedIn:!1,accessToken:null,userName:null,email:null},ot=!0,We=30,Ze=null,jt=!1,qt=0,Ke=null,Lo=null,xe=null,j=null,Zn=null;function xi(e){Lo=e}function Ti(e){xe=e}function Ei(e){j=e}function Io(e){Zn=e}var vi=!1;function ki(){if(!vi)try{let e=document.createElement("style");e.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(e),vi=!0}catch{}}var Si=null,hn=null,gn=null;function Co(e){Si=e}function Xn(e){hn=e}function Qn(e){gn=e}var bi="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",xr="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",Tr="https://www.youtube.com/",Er=30*1e3,kr=1800*1e3,wi=5,Jn=null,Ve=null;async function Do(){try{let e=await gn("googleAuthState");e&&typeof e=="object"&&(O={...O,...e},vn(),O.isSignedIn&&O.accessToken&&await Wt(!0))}catch(e){l("Failed to load Google auth state:",e,"error")}}async function eo(){try{await hn("googleAuthState",O)}catch(e){l("Failed to save Google auth state:",e,"error")}}function vn(){Lo&&(Lo.style.display="none")}function Re(e,i){if(j){if(j.style.fontWeight="bold",e==="authenticating"){for(ki(),j.style.color="#ffa500";j.firstChild;)j.removeChild(j.firstChild);let a=document.createElement("span");a.className="tk-auth-spinner";let s=document.createTextNode(` ${i||"Authorizing with Google\u2026"}`);j.appendChild(a),j.appendChild(s);return}if(e==="error"){j.textContent=`\u274C ${i||"Authorization failed"}`,j.style.color="#ff4d4f",re();return}O.isSignedIn?(j.textContent="\u2705 Signed in",j.style.color="#52c41a",j.removeAttribute("title"),O.userName?(j.onmouseenter=()=>{j.textContent=`\u2705 Signed in as ${O.userName}`},j.onmouseleave=()=>{j.textContent="\u2705 Signed in"}):(j.onmouseenter=null,j.onmouseleave=null)):(j.textContent="\u274C Not signed in",j.style.color="#ff4d4f",j.removeAttribute("title"),j.onmouseenter=null,j.onmouseleave=null),re()}}function Sr(){j&&(ki(),j.classList.remove("tk-auth-blink"),j.offsetWidth,j.classList.add("tk-auth-blink"),setTimeout(()=>{j.classList.remove("tk-auth-blink")},1200))}function Lr(e){return new Promise((i,a)=>{if(!e){l&&l("OAuth monitor: popup is null",null,"error"),a(new Error("Failed to open popup"));return}l&&l("OAuth monitor: starting to monitor popup for token");let s=Date.now(),p=300*1e3,n="timekeeper_oauth",v=null,c=null,S=null,E=()=>{if(v){try{v.close()}catch{}v=null}c&&(clearInterval(c),c=null),S&&(clearInterval(S),S=null)};try{v=new BroadcastChannel(n),l&&l("OAuth monitor: BroadcastChannel created successfully"),v.onmessage=D=>{if(l&&l("OAuth monitor: received BroadcastChannel message",D.data),D.data?.type==="timekeeper_oauth_token"&&D.data?.token){l&&l("OAuth monitor: token received via BroadcastChannel"),E();try{e.close()}catch{}i(D.data.token)}else if(D.data?.type==="timekeeper_oauth_error"){l&&l("OAuth monitor: error received via BroadcastChannel",D.data.error,"error"),E();try{e.close()}catch{}a(new Error(D.data.error||"OAuth failed"))}}}catch(D){l&&l("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",D)}l&&l("OAuth monitor: setting up IndexedDB polling");let k=Date.now();c=setInterval(async()=>{try{let D=indexedDB.open("ytls-timestamps-db",3);D.onsuccess=()=>{let R=D.result,X=R.transaction("settings","readonly").objectStore("settings").get("oauth_message");X.onsuccess=()=>{let oe=X.result;if(oe&&oe.value){let G=oe.value;if(G.timestamp&&G.timestamp>k){if(l&&l("OAuth monitor: received IndexedDB message",G),G.type==="timekeeper_oauth_token"&&G.token){l&&l("OAuth monitor: token received via IndexedDB"),E();try{e.close()}catch{}R.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),i(G.token)}else if(G.type==="timekeeper_oauth_error"){l&&l("OAuth monitor: error received via IndexedDB",G.error,"error"),E();try{e.close()}catch{}R.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),a(new Error(G.error||"OAuth failed"))}k=G.timestamp}}R.close()}}}catch(D){l&&l("OAuth monitor: IndexedDB polling error",D,"error")}},500),S=setInterval(()=>{if(Date.now()-s>p){l&&l("OAuth monitor: popup timed out after 5 minutes",null,"error"),E();try{e.close()}catch{}a(new Error("OAuth popup timed out"));return}},1e3)})}async function Li(){if(!bi){Re("error","Google Client ID not configured");return}try{l&&l("OAuth signin: starting OAuth flow"),Re("authenticating","Opening authentication window...");let e=new URL("https://accounts.google.com/o/oauth2/v2/auth");e.searchParams.set("client_id",bi),e.searchParams.set("redirect_uri",Tr),e.searchParams.set("response_type","token"),e.searchParams.set("scope",xr),e.searchParams.set("include_granted_scopes","true"),e.searchParams.set("state","timekeeper_auth"),l&&l("OAuth signin: opening popup");let i=window.open(e.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!i){l&&l("OAuth signin: popup blocked by browser",null,"error"),Re("error","Popup blocked. Please enable popups for YouTube.");return}l&&l("OAuth signin: popup opened successfully"),Re("authenticating","Waiting for authentication...");try{let a=await Lr(i),s=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${a}`}});if(s.ok){let p=await s.json();O.accessToken=a,O.isSignedIn=!0,O.userName=p.name,O.email=p.email,await eo(),vn(),Re(),re(),await Wt(),l?l(`Successfully authenticated as ${p.name}`):console.log(`[Timekeeper] Successfully authenticated as ${p.name}`)}else throw new Error("Failed to fetch user info")}catch(a){let s=a instanceof Error?a.message:"Authentication failed";l?l("OAuth failed:",a,"error"):console.error("[Timekeeper] OAuth failed:",a),Re("error",s);return}}catch(e){let i=e instanceof Error?e.message:"Sign in failed";l?l("Failed to sign in to Google:",e,"error"):console.error("[Timekeeper] Failed to sign in to Google:",e),Re("error",`Failed to sign in: ${i}`)}}async function Ii(){if(!window.opener||window.opener===window)return!1;l&&l("OAuth popup: detected popup window, checking for OAuth response");let e=window.location.hash;if(!e||e.length<=1)return l&&l("OAuth popup: no hash params found"),!1;let i=e.startsWith("#")?e.substring(1):e,a=new URLSearchParams(i),s=a.get("state");if(l&&l("OAuth popup: hash params found, state="+s),s!=="timekeeper_auth")return l&&l("OAuth popup: not our OAuth flow (wrong state)"),!1;let p=a.get("error"),n=a.get("access_token"),v="timekeeper_oauth";if(p){try{let c=new BroadcastChannel(v);c.postMessage({type:"timekeeper_oauth_error",error:a.get("error_description")||p}),c.close()}catch{let S={type:"timekeeper_oauth_error",error:a.get("error_description")||p,timestamp:Date.now()},E=indexedDB.open("ytls-timestamps-db",3);E.onsuccess=()=>{let k=E.result;k.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:S}),k.close()}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(n){l&&l("OAuth popup: access token found, broadcasting to opener");try{let c=new BroadcastChannel(v);c.postMessage({type:"timekeeper_oauth_token",token:n}),c.close(),l&&l("OAuth popup: token broadcast via BroadcastChannel")}catch(c){l&&l("OAuth popup: BroadcastChannel failed, using IndexedDB",c);let S={type:"timekeeper_oauth_token",token:n,timestamp:Date.now()},E=indexedDB.open("ytls-timestamps-db",3);E.onsuccess=()=>{let k=E.result;k.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:S}),k.close()},l&&l("OAuth popup: token broadcast via IndexedDB")}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function Ci(){O={isSignedIn:!1,accessToken:null,userName:null,email:null},await eo(),vn(),Re(),re()}async function Di(){if(!O.isSignedIn||!O.accessToken)return!1;try{let e=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${O.accessToken}`}});return e.status===401?(await Mi({silent:!0}),!1):e.ok}catch(e){return l("Failed to verify auth state:",e,"error"),!1}}async function Ir(e){let i={Authorization:`Bearer ${e}`},s=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,p=await fetch(s,{headers:i});if(p.status===401)throw new Error("unauthorized");if(!p.ok)throw new Error("drive search failed");let n=await p.json();if(Array.isArray(n.files)&&n.files.length>0)return n.files[0].id;let v=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...i,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(v.status===401)throw new Error("unauthorized");if(!v.ok)throw new Error("drive folder create failed");return(await v.json()).id}async function Cr(e,i,a){let s=`name='${e}' and '${i}' in parents and trashed=false`,p=encodeURIComponent(s),n=await fetch(`https://www.googleapis.com/drive/v3/files?q=${p}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${a}`}});if(n.status===401)throw new Error("unauthorized");if(!n.ok)return null;let v=await n.json();return v.files&&v.files.length>0?v.files[0].id:null}function Dr(e,i){let a=Yn(e),s=i.replace(/\\/g,"/").replace(/^\/+/,"");return s.endsWith(".json")||(s+=".json"),yi({[s]:[a,{level:6,mtime:new Date,os:0}]})}async function Mr(e,i,a,s){let p=e.replace(/\.json$/,".zip"),n=await Cr(p,a,s),v=new TextEncoder().encode(i).length,c=Dr(i,e),S=c.length;l(`Compressing data: ${v} bytes -> ${S} bytes (${Math.round(100-S/v*100)}% reduction)`);let E="-------314159265358979",k=`\r
--${E}\r
`,M=`\r
--${E}--`,D=n?{name:p,mimeType:"application/zip"}:{name:p,mimeType:"application/zip",parents:[a]},R=8192,Z="";for(let J=0;J<c.length;J+=R){let ge=c.subarray(J,Math.min(J+R,c.length));Z+=String.fromCharCode.apply(null,Array.from(ge))}let W=btoa(Z),X=k+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify(D)+k+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+W+M,oe,G;n?(oe=`https://www.googleapis.com/upload/drive/v3/files/${n}?uploadType=multipart&fields=id,name`,G="PATCH"):(oe="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",G="POST");let de=await fetch(oe,{method:G,headers:{Authorization:`Bearer ${s}`,"Content-Type":`multipart/related; boundary=${E}`},body:X});if(de.status===401)throw new Error("unauthorized");if(!de.ok)throw new Error("drive upload failed")}async function Mi(e){l("Auth expired, clearing token",null,"warn"),O.isSignedIn=!1,O.accessToken=null,await eo(),Re("error","Authorization expired. Please sign in again."),re()}async function Ar(e){if(!O.isSignedIn||!O.accessToken){e?.silent||Re("error","Please sign in to Google Drive first");return}try{let{json:i,filename:a,totalVideos:s,totalTimestamps:p}=await Si();if(p===0){e?.silent||l("Skipping export: no timestamps to back up");return}let n=await Ir(O.accessToken);await Mr(a,i,n,O.accessToken),l(`Exported to Google Drive (${a}) with ${s} videos / ${p} timestamps.`)}catch(i){throw i.message==="unauthorized"?(await Mi({silent:e?.silent}),i):(l("Drive export failed:",i,"error"),e?.silent||Re("error","Failed to export to Google Drive."),i)}}async function Ai(){try{let e=await gn("autoBackupEnabled"),i=await gn("autoBackupIntervalMinutes"),a=await gn("lastAutoBackupAt");typeof e=="boolean"&&(ot=e),typeof i=="number"&&i>0&&(We=i),typeof a=="number"&&a>0&&(Ze=a)}catch(e){l("Failed to load auto backup settings:",e,"error")}}async function Mo(){try{await hn("autoBackupEnabled",ot),await hn("autoBackupIntervalMinutes",We),await hn("lastAutoBackupAt",Ze??0)}catch(e){l("Failed to save auto backup settings:",e,"error")}}function Br(){Jn&&(clearInterval(Jn),Jn=null),Ve&&(clearTimeout(Ve),Ve=null)}function Vt(e){try{let i=new Date(e),a=new Date,s=i.toDateString()===a.toDateString(),p=i.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return s?p:`${i.toLocaleDateString()} ${p}`}catch{return""}}function re(){if(!xe)return;let e="",i="";if(!ot)e="\u{1F501} Backup: Off",xe.onmouseenter=null,xe.onmouseleave=null;else if(jt)e="\u{1F501} Backing up\u2026",xe.onmouseenter=null,xe.onmouseleave=null;else if(Ke&&Ke>0)e=`\u26A0\uFE0F Retry in ${Math.ceil(Ke/6e4)}m`,xe.onmouseenter=null,xe.onmouseleave=null;else if(Ze){e=`\u{1F5C4}\uFE0F Last backup: ${Vt(Ze)}`;let a=Ze+Math.max(1,We)*60*1e3;i=`\u{1F5C4}\uFE0F Next backup: ${Vt(a)}`,xe.onmouseenter=()=>{xe.textContent=i},xe.onmouseleave=()=>{xe.textContent=e}}else{e="\u{1F5C4}\uFE0F Last backup: never";let a=Date.now()+Math.max(1,We)*60*1e3;i=`\u{1F5C4}\uFE0F Next backup: ${Vt(a)}`,xe.onmouseenter=()=>{xe.textContent=i},xe.onmouseleave=()=>{xe.textContent=e}}xe.textContent=e,xe.style.display=e?"inline":"none",to()}function to(){if(!Zn)return;let e="";ot?jt?e="#4285f4":Ke&&Ke>0?e="#ffa500":O.isSignedIn&&Ze?e="#52c41a":O.isSignedIn?e="#ffa500":e="#ff4d4f":e="#ff4d4f",Zn.style.backgroundColor=e,nt(Zn,()=>{let i="";if(!ot)i="Auto backup is disabled";else if(jt)i="Backup in progress";else if(Ke&&Ke>0)i=`Retrying backup in ${Math.ceil(Ke/6e4)}m`;else if(O.isSignedIn&&Ze){let a=Ze+Math.max(1,We)*60*1e3,s=Vt(a);i=`Last backup: ${Vt(Ze)}
Next backup: ${s}`}else if(O.isSignedIn){let a=Date.now()+Math.max(1,We)*60*1e3;i=`No backup yet
Next backup: ${Vt(a)}`}else i="Not signed in to Google Drive";return i})}async function yn(e=!0){if(!O.isSignedIn||!O.accessToken){e||Sr();return}if(Ve){l("Auto backup: backoff in progress, skipping scheduled run");return}if(!jt){jt=!0,re();try{await Ar({silent:e}),Ze=Date.now(),qt=0,Ke=null,Ve&&(clearTimeout(Ve),Ve=null),await Mo()}catch(i){if(l("Auto backup failed:",i,"error"),i.message==="unauthorized")l("Auth error detected, clearing token and stopping retries",null,"warn"),O.isSignedIn=!1,O.accessToken=null,await eo(),Re("error","Authorization expired. Please sign in again."),re(),qt=0,Ke=null,Ve&&(clearTimeout(Ve),Ve=null);else if(qt<wi){qt+=1;let p=Math.min(Er*Math.pow(2,qt-1),kr);Ke=p,Ve&&clearTimeout(Ve),Ve=setTimeout(()=>{yn(!0)},p),l(`Scheduling backup retry ${qt}/${wi} in ${Math.round(p/1e3)}s`),re()}else Ke=null}finally{jt=!1,re()}}}async function Wt(e=!1){if(Br(),!!ot&&!(!O.isSignedIn||!O.accessToken)){if(Jn=setInterval(()=>{yn(!0)},Math.max(1,We)*60*1e3),!e){let i=Date.now(),a=Math.max(1,We)*60*1e3;(!Ze||i-Ze>=a)&&yn(!0)}re()}}async function Bi(){ot=!ot,await Mo(),await Wt(),re()}async function zi(){let e=prompt("Set Auto Backup interval (minutes):",String(We));if(e===null)return;let i=Math.floor(Number(e));if(!Number.isFinite(i)||i<5||i>1440){alert("Please enter a number between 5 and 1440 minutes.");return}We=i,await Mo(),await Wt(),re()}var Ao=window.location.hash;if(Ao&&Ao.length>1){let e=new URLSearchParams(Ao.substring(1));if(e.get("state")==="timekeeper_auth"){let a=e.get("access_token");if(a){console.log("[Timekeeper] Auth token detected in URL, broadcasting token"),console.log("[Timekeeper] Token length:",a.length,"characters");try{let s=new BroadcastChannel("timekeeper_oauth"),p={type:"timekeeper_oauth_token",token:a};console.log("[Timekeeper] Sending auth message via BroadcastChannel:",{type:p.type,tokenLength:a.length}),s.postMessage(p),s.close(),console.log("[Timekeeper] Token broadcast via BroadcastChannel completed")}catch(s){console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",s);let p={type:"timekeeper_oauth_token",token:a,timestamp:Date.now()},n=indexedDB.open("ytls-timestamps-db",3);n.onsuccess=()=>{let v=n.result,c=v.transaction("settings","readwrite");c.objectStore("settings").put({key:"oauth_message",value:p}),c.oncomplete=()=>{console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",p.timestamp),v.close()}}}if(history.replaceState){let s=window.location.pathname+window.location.search;history.replaceState(null,"",s)}throw console.log("[Timekeeper] Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}(async function(){"use strict";if(window.top!==window.self)return;function e(t){return GM.getValue(`timekeeper_${t}`,void 0)}function i(t,o){return GM.setValue(`timekeeper_${t}`,JSON.stringify(o))}if(Qn(e),Xn(i),await Ii()){l("OAuth popup detected, broadcasting token and closing");return}await Do();let s=["/watch","/live"];function p(t=window.location.href){try{let o=new URL(t);return o.origin!=="https://www.youtube.com"?!1:s.some(r=>o.pathname===r||o.pathname.startsWith(`${r}/`))}catch(o){return l("Timekeeper failed to parse URL for support check:",o,"error"),!1}}let n=null,v=null,c=null,S=null,E=null,k=null,M=null,D=null,R=250,Z=null,W=!1;function X(){return n?n.getBoundingClientRect():null}function oe(t,o,r){t&&($e={x:Math.round(typeof o=="number"?o:t.left),y:Math.round(typeof r=="number"?r:t.top),width:Math.round(t.width),height:Math.round(t.height)})}function G(t=!0){if(!n)return;Pt();let o=X();o&&(o.width||o.height)&&(oe(o),t&&(Nn("windowPosition",$e),Zt({type:"window_position_updated",position:$e,timestamp:Date.now()})))}function de(){if(!n||!v||!S||!c)return;let t=40,o=te();if(o.length>0)t=o[0].offsetHeight;else{let r=document.createElement("li");r.style.visibility="hidden",r.style.position="absolute",r.textContent="00:00 Example",c.appendChild(r),t=r.offsetHeight,c.removeChild(r)}R=v.offsetHeight+S.offsetHeight+t,n.style.minHeight=R+"px"}function J(){requestAnimationFrame(()=>{typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),de(),G(!0)})}function ge(t=450){fe&&(clearTimeout(fe),fe=null),fe=setTimeout(()=>{H(),J(),fe=null},t)}function Ce(){fe&&(clearTimeout(fe),fe=null)}function ae(){c&&(c.style.visibility="hidden",l("Hiding timestamps during show animation")),J(),ge()}function U(){H(),Ce(),Je&&(clearTimeout(Je),Je=null),Je=setTimeout(()=>{n&&(n.style.display="none",Wo(),Je=null)},400)}function H(){if(!c){Ge&&(Ge(),Ge=null,rt=null,ft=null);return}if(!ft){c.style.visibility==="hidden"&&(c.style.visibility="",l("Restoring timestamp visibility (no deferred fragment)")),Ge&&(Ge(),Ge=null,rt=null);return}l("Appending deferred timestamps after animation"),c.appendChild(ft),ft=null,c.style.visibility==="hidden"&&(c.style.visibility="",l("Restoring timestamp visibility after append")),Ge&&(Ge(),Ge=null,rt=null),et(),De(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea());let t=q(),o=t?Math.floor(t.getCurrentTime()):Et();Number.isFinite(o)&&Fn(o,!1)}let le=null,me=!1,ce="ytls-timestamp-pending-delete",He="ytls-timestamp-highlight",Se="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_64px_Indexed.png",Be="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_Eyebrow_64px_Indexed.png";function Ye(){let t=o=>{let r=new Image;r.src=o};t(Se),t(Be)}Ye();async function pe(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(t=>setTimeout(t,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(t=>setTimeout(t,100));await new Promise(t=>setTimeout(t,200))}let ze=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],it=5e3,Yt=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function Oe(t){return Yt.has(t)}function Ne(){return document.querySelector("video")}let Pe=null;function q(){if(Pe&&document.contains(Pe))return Pe;let t=document.getElementById("movie_player");return t&&document.contains(t)?t:null}function ue(t){return ze.every(o=>typeof t?.[o]=="function"?!0:Oe(o)?!!Ne():!1)}function pt(t){return ze.filter(o=>typeof t?.[o]=="function"?!1:Oe(o)?!Ne():!0)}async function bn(t=it){let o=Date.now();for(;Date.now()-o<t;){let u=q();if(ue(u))return u;await new Promise(y=>setTimeout(y,100))}let r=q();return ue(r),r}let Mt="timestampOffsetSeconds",no=-5,Kt="shiftClickTimeSkipSeconds",wn=10,At=300,wt=300,Fe=null;function Bo(){try{return new URL(window.location.href).origin==="https://www.youtube.com"}catch{return!1}}function zo(){if(Bo()&&!Fe)try{Fe=new BroadcastChannel("ytls_timestamp_channel"),Fe.onmessage=Po}catch(t){l("Failed to create BroadcastChannel:",t,"warn"),Fe=null}}function Zt(t){if(!Bo()){l("Skipping BroadcastChannel message: not on https://www.youtube.com","warn");return}if(zo(),!Fe){l("No BroadcastChannel available to post message","warn");return}try{Fe.postMessage(t)}catch(o){l("BroadcastChannel error, reopening:",o,"warn");try{Fe=new BroadcastChannel("ytls_timestamp_channel"),Fe.onmessage=Po,Fe.postMessage(t)}catch(r){l("Failed to reopen BroadcastChannel:",r,"error")}}}function Po(t){if(l("Received message from another tab:",t.data),!(!p()||!c||!n)&&t.data){if(t.data.type==="timestamps_updated"&&t.data.videoId===ye)l("Debouncing timestamp load due to external update for video:",t.data.videoId),clearTimeout(Xt),Xt=setTimeout(()=>{l("Reloading timestamps due to external update for video:",t.data.videoId),_o()},500);else if(t.data.type==="window_position_updated"&&n){let o=t.data.position;if(o&&typeof o.x=="number"&&typeof o.y=="number"){n.style.left=`${o.x}px`,n.style.top=`${o.y}px`,n.style.right="auto",n.style.bottom="auto",typeof o.width=="number"&&o.width>0&&(n.style.width=`${o.width}px`),typeof o.height=="number"&&o.height>0&&(n.style.height=`${o.height}px`);let r=n.getBoundingClientRect();$e={x:Math.round(o.x),y:Math.round(o.y),width:Math.round(r.width),height:Math.round(r.height)};let u=document.documentElement.clientWidth,y=document.documentElement.clientHeight;(r.left<0||r.top<0||r.right>u||r.bottom>y)&&Pt()}}}}zo();let Bt=await GM.getValue(Mt);(typeof Bt!="number"||Number.isNaN(Bt))&&(Bt=no,await GM.setValue(Mt,Bt));let Jt=await GM.getValue(Kt);(typeof Jt!="number"||Number.isNaN(Jt))&&(Jt=wn,await GM.setValue(Kt,Jt));let Xt=null,xt=new Map,xn=!1,P=null,Tn=null,ye=null,Je=null,fe=null,ft=null,rt=null,Ge=null,ht=null,En=!1,$e=null,oo=!1,kn=null,Sn=null,Ln=null,In=null,Cn=null,Dn=null,Mn=null,Qt=null,en=null,tn=null,Xe=null,Qe=null,Fo=0,nn=!1,Tt=null,on=null;function te(){return c?Array.from(c.querySelectorAll("li")).filter(t=>!!t.querySelector("a[data-time]")):[]}function io(){return te().map(t=>{let o=t.querySelector("a[data-time]"),r=o?.dataset.time;if(!o||!r)return null;let u=Number.parseInt(r,10);if(!Number.isFinite(u))return null;let g=t.querySelector("input")?.value??"",d=t.dataset.guid??crypto.randomUUID();return t.dataset.guid||(t.dataset.guid=d),{start:u,comment:g,guid:d}}).filter(Ro)}function Et(){if(on!==null)return on;let t=te();return on=t.length>0?Math.max(...t.map(o=>{let r=o.querySelector("a[data-time]")?.getAttribute("data-time");return r?Number.parseInt(r,10):0})):0,on}function An(){on=null}function Pi(t){let o=t.querySelector(".time-diff");return o?(o.textContent?.trim()||"").startsWith("-"):!1}function Fi(t,o){return t?o?"\u2514\u2500 ":"\u251C\u2500 ":""}function rn(t){return t.startsWith("\u251C\u2500 ")||t.startsWith("\u2514\u2500 ")?1:0}function $o(t){return t.replace(/^[├└]─\s/,"")}function $i(t){let o=te();if(t>=o.length-1)return"\u2514\u2500 ";let r=o[t+1].querySelector("input");return r&&rn(r.value)===1?"\u251C\u2500 ":"\u2514\u2500 "}function et(){if(!c)return;let t=te(),o=!0,r=0,u=t.length;for(;o&&r<u;)o=!1,r++,t.forEach((y,g)=>{let d=y.querySelector("input");if(!d||!(rn(d.value)===1))return;let T=!1;if(g<t.length-1){let z=t[g+1].querySelector("input");z&&(T=!(rn(z.value)===1))}else T=!0;let x=$o(d.value),L=`${Fi(!0,T)}${x}`;d.value!==L&&(d.value=L,o=!0)})}function kt(){if(c){for(;c.firstChild;)c.removeChild(c.firstChild);ft&&(ft=null),Ge&&(Ge(),Ge=null,rt=null)}}function an(){if(!c||me||ft)return;Array.from(c.children).some(o=>!o.classList.contains("ytls-placeholder")&&!o.classList.contains("ytls-error-message"))||ro("No timestamps for this video")}function ro(t){if(!c)return;kt();let o=document.createElement("li");o.className="ytls-placeholder",o.textContent=t,c.appendChild(o),c.style.overflowY="hidden"}function ao(){if(!c)return;let t=c.querySelector(".ytls-placeholder");t&&t.remove(),c.style.overflowY=""}function so(t){if(!(!n||!c)){if(me=t,t)n.style.display="",n.classList.remove("ytls-fade-out"),n.classList.add("ytls-fade-in"),ro("Loading timestamps...");else if(ao(),n.style.display="",n.classList.remove("ytls-fade-out"),n.classList.add("ytls-fade-in"),E){let o=q();if(o){let r=o.getCurrentTime(),u=Number.isFinite(r)?Math.max(0,Math.floor(r)):Math.max(0,Et()),y=Math.floor(u/3600),g=Math.floor(u/60)%60,d=u%60,{isLive:h}=o.getVideoData()||{isLive:!1},T=c?te().map(I=>{let L=I.querySelector("a[data-time]");return L?parseFloat(L.getAttribute("data-time")??"0"):0}):[],x="";if(T.length>0)if(h){let I=Math.max(1,u/60),L=T.filter(z=>z<=u);if(L.length>0){let z=(L.length/I).toFixed(2);parseFloat(z)>0&&(x=` (${z}/min)`)}}else{let I=o.getDuration(),L=Number.isFinite(I)&&I>0?I:0,z=Math.max(1,L/60),Q=(T.length/z).toFixed(1);parseFloat(Q)>0&&(x=` (${Q}/min)`)}E.textContent=`\u23F3${y?y+":"+String(g).padStart(2,"0"):g}:${String(d).padStart(2,"0")}${x}`}}!me&&c&&!c.querySelector(".ytls-error-message")&&an(),at()}}function Ro(t){return!!t&&Number.isFinite(t.start)&&typeof t.comment=="string"&&typeof t.guid=="string"}function Bn(t,o){t.textContent=vt(o),t.dataset.time=String(o),t.href=go(o,window.location.href)}let zn=null,Pn=null,St=!1;function Ri(t){if(!t||typeof t.getVideoData!="function"||!t.getVideoData()?.isLive)return!1;if(typeof t.getProgressState=="function"){let r=t.getProgressState(),u=Number(r?.seekableEnd??r?.liveHead??r?.head??r?.duration),y=Number(r?.current??t.getCurrentTime?.());if(Number.isFinite(u)&&Number.isFinite(y))return u-y>2}return!1}function Fn(t,o){if(!Number.isFinite(t))return;let r=$n(t);sn(r,o)}function $n(t){if(!Number.isFinite(t))return null;let o=te();if(o.length===0)return null;let r=null,u=-1/0;for(let y of o){let d=y.querySelector("a[data-time]")?.dataset.time;if(!d)continue;let h=Number.parseInt(d,10);Number.isFinite(h)&&h<=t&&h>u&&(u=h,r=y)}return r}function sn(t,o=!1){if(!t)return;te().forEach(u=>{u.classList.contains(ce)||u.classList.remove(He)}),t.classList.contains(ce)||(t.classList.add(He),o&&!xn&&t.scrollIntoView({behavior:"smooth",block:"center"}))}function Hi(t){if(!c||c.querySelector(".ytls-error-message")||!Number.isFinite(t)||t===0)return!1;let o=te();if(o.length===0)return!1;let r=!1;return o.forEach(u=>{let y=u.querySelector("a[data-time]"),g=y?.dataset.time;if(!y||!g)return;let d=Number.parseInt(g,10);if(!Number.isFinite(d))return;let h=Math.max(0,d+t);h!==d&&(Bn(y,h),r=!0)}),r?(cn(),et(),De(),Hn(ye),Tt=null,!0):!1}function Ho(t,o={}){if(!Number.isFinite(t)||t===0)return!1;if(!Hi(t)){if(o.alertOnNoChange){let d=o.failureMessage??"Offset did not change any timestamps.";alert(d)}return!1}let u=o.logLabel??"bulk offset";l(`Timestamps changed: Offset all timestamps by ${t>0?"+":""}${t} seconds (${u})`);let y=q(),g=y?Math.floor(y.getCurrentTime()):0;if(Number.isFinite(g)){let d=$n(g);sn(d,!1)}return!0}function Oo(t){if(!c||me)return;let o=t.target instanceof HTMLElement?t.target:null;if(o)if(o.dataset.time){t.preventDefault();let r=Number(o.dataset.time);if(Number.isFinite(r)){St=!0;let y=q();y&&y.seekTo(r),setTimeout(()=>{St=!1},500)}let u=o.closest("li");u&&(te().forEach(y=>{y.classList.contains(ce)||y.classList.remove(He)}),u.classList.contains(ce)||(u.classList.add(He),u.scrollIntoView({behavior:"smooth",block:"center"})))}else if(o.dataset.increment){t.preventDefault();let u=o.parentElement?.querySelector("a[data-time]");if(!u||!u.dataset.time)return;let y=parseInt(u.dataset.time,10),g=parseInt(o.dataset.increment,10);if("shiftKey"in t&&t.shiftKey&&(g*=Jt),"altKey"in t?t.altKey:!1){Ho(g,{logLabel:"Alt adjust"});return}let T=Math.max(0,y+g);l(`Timestamps changed: Timestamp time incremented from ${y} to ${T}`),Bn(u,T),An();let x=o.closest("li");if(Pn=T,zn&&clearTimeout(zn),St=!0,zn=setTimeout(()=>{if(Pn!==null){let I=q();I&&I.seekTo(Pn)}zn=null,Pn=null,setTimeout(()=>{St=!1},500)},500),cn(),et(),De(),x){let I=x.querySelector("input"),L=x.dataset.guid;I&&L&&(zt(ye,L,T,I.value),Tt=L)}}else o.dataset.action==="clear"&&(t.preventDefault(),l("Timestamps changed: All timestamps cleared from UI"),c.textContent="",An(),De(),Rn(),Hn(ye,{allowEmpty:!0}),Tt=null,an())}function ln(t,o="",r=!1,u=null,y=!0){if(!c)return null;let g=Math.max(0,t),d=u??crypto.randomUUID(),h=document.createElement("li"),T=document.createElement("div"),x=document.createElement("span"),I=document.createElement("span"),L=document.createElement("span"),z=document.createElement("a"),Q=document.createElement("span"),F=document.createElement("input"),ne=document.createElement("button");h.dataset.guid=d,T.className="time-row";let ve=document.createElement("div");ve.style.cssText="position:absolute;left:0;top:0;width:20px;height:100%;display:flex;align-items:center;justify-content:center;cursor:pointer;",nt(ve,"Click to toggle indent");let Te=document.createElement("span");Te.style.cssText="color:#999;font-size:12px;pointer-events:none;display:none;";let Le=()=>{let ee=rn(F.value);Te.textContent=ee===1?"\u25C0":"\u25B6"},gt=ee=>{ee.stopPropagation();let Y=rn(F.value),he=$o(F.value),se=Y===0?1:0,ie="";if(se===1){let tt=te().indexOf(h);ie=$i(tt)}F.value=`${ie}${he}`,Le(),et();let be=Number.parseInt(z.dataset.time??"0",10);zt(ye,d,be,F.value)};ve.onclick=gt,ve.append(Te),h.style.cssText="position:relative;padding-left:20px;",h.addEventListener("mouseenter",()=>{Le(),Te.style.display="inline"}),h.addEventListener("mouseleave",()=>{Te.style.display="none"}),h.addEventListener("mouseleave",()=>{h.dataset.guid===Tt&&Pi(h)&&No()}),F.value=o||"",F.style.cssText="width:100%;margin-top:5px;display:block;",F.type="text",F.setAttribute("inputmode","text"),F.autocapitalize="off",F.autocomplete="off",F.spellcheck=!1,F.addEventListener("focusin",()=>{nn=!1}),F.addEventListener("focusout",ee=>{let Y=ee.relatedTarget,he=Date.now()-Fo<250,se=!!Y&&!!n&&n.contains(Y);!he&&!se&&(nn=!0,setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(F.focus({preventScroll:!0}),nn=!1)},0))}),F.addEventListener("input",ee=>{let Y=ee;if(Y&&(Y.isComposing||Y.inputType==="insertCompositionText"))return;let he=xt.get(d);he&&clearTimeout(he);let se=setTimeout(()=>{let ie=Number.parseInt(z.dataset.time??"0",10);zt(ye,d,ie,F.value),xt.delete(d)},500);xt.set(d,se)}),F.addEventListener("compositionend",()=>{let ee=Number.parseInt(z.dataset.time??"0",10);setTimeout(()=>{zt(ye,d,ee,F.value)},50)}),x.textContent="\u2796",x.dataset.increment="-1",x.style.cursor="pointer",x.style.margin="0px",x.addEventListener("mouseenter",()=>{x.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),x.addEventListener("mouseleave",()=>{x.style.textShadow="none"}),L.textContent="\u2795",L.dataset.increment="1",L.style.cursor="pointer",L.style.margin="0px",L.addEventListener("mouseenter",()=>{L.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),L.addEventListener("mouseleave",()=>{L.style.textShadow="none"}),I.textContent="\u23FA\uFE0F",I.style.cursor="pointer",I.style.margin="0px",nt(I,"Set to current playback time"),I.addEventListener("mouseenter",()=>{I.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(100, 200, 255, 0.6)"}),I.addEventListener("mouseleave",()=>{I.style.textShadow="none"}),I.onclick=()=>{let ee=q(),Y=ee?Math.floor(ee.getCurrentTime()):0;Number.isFinite(Y)&&(l(`Timestamps changedset to current playback time ${Y}`),Bn(z,Y),cn(),et(),zt(ye,d,Y,F.value),Tt=d)},Bn(z,g),An(),ne.textContent="\u{1F5D1}\uFE0F",ne.style.cssText="background:transparent;border:none;color:white;cursor:pointer;margin-left:5px;",ne.addEventListener("mouseenter",()=>{ne.style.textShadow="0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(255, 100, 100, 0.6)"}),ne.addEventListener("mouseleave",()=>{ne.style.textShadow="none"}),ne.onclick=()=>{let ee=null,Y=null,he=null,se=()=>{try{h.removeEventListener("click",Y,!0)}catch{}try{document.removeEventListener("click",Y,!0)}catch{}if(c)try{c.removeEventListener("mouseleave",he)}catch{}ee&&(clearTimeout(ee),ee=null)};if(h.dataset.deleteConfirmed==="true"){l("Timestamps changed: Timestamp deleted");let ie=h.dataset.guid??"",be=xt.get(ie);be&&(clearTimeout(be),xt.delete(ie)),se(),h.remove(),An(),cn(),et(),De(),Rn(),Oi(ye,ie),Tt=null,an()}else{h.dataset.deleteConfirmed="true",h.classList.add(ce),h.classList.remove(He);let ie=()=>{h.dataset.deleteConfirmed="false",h.classList.remove(ce);let be=q(),_e=be?be.getCurrentTime():0,tt=Number.parseInt(h.querySelector("a[data-time]")?.dataset.time??"0",10);Number.isFinite(_e)&&Number.isFinite(tt)&&_e>=tt&&h.classList.add(He),se()};Y=be=>{be.target!==ne&&ie()},he=()=>{h.dataset.deleteConfirmed==="true"&&ie()},h.addEventListener("click",Y,!0),document.addEventListener("click",Y,!0),c&&c.addEventListener("mouseleave",he),ee=setTimeout(()=>{h.dataset.deleteConfirmed==="true"&&ie(),se()},5e3)}},Q.className="time-diff",Q.style.color="#888",Q.style.marginLeft="5px",T.append(x,I,L,z,Q,ne),h.append(ve,T,F);let st=Number.parseInt(z.dataset.time??"0",10);if(y){ao();let ee=!1,Y=te();for(let he=0;he<Y.length;he++){let se=Y[he],be=se.querySelector("a[data-time]")?.dataset.time;if(!be)continue;let _e=Number.parseInt(be,10);if(Number.isFinite(_e)&&st<_e){c.insertBefore(h,se),ee=!0;let tt=Y[he-1];if(tt){let Nt=tt.querySelector("a[data-time]")?.dataset.time;if(Nt){let lt=Number.parseInt(Nt,10);Number.isFinite(lt)&&(Q.textContent=vt(st-lt))}}else Q.textContent="";let Ot=se.querySelector(".time-diff");Ot&&(Ot.textContent=vt(_e-st));break}}if(!ee&&(c.appendChild(h),Y.length>0)){let ie=Y[Y.length-1].querySelector("a[data-time]")?.dataset.time;if(ie){let be=Number.parseInt(ie,10);Number.isFinite(be)&&(Q.textContent=vt(st-be))}}h.scrollIntoView({behavior:"smooth",block:"center"}),Rn(),et(),De(),r||(zt(ye,d,g,o),Tt=d,sn(h,!1))}else F.__ytls_li=h;return F}function cn(){if(!c||c.querySelector(".ytls-error-message"))return;let t=te();t.forEach((o,r)=>{let u=o.querySelector(".time-diff");if(!u)return;let g=o.querySelector("a[data-time]")?.dataset.time;if(!g){u.textContent="";return}let d=Number.parseInt(g,10);if(!Number.isFinite(d)){u.textContent="";return}if(r===0){u.textContent="";return}let x=t[r-1].querySelector("a[data-time]")?.dataset.time;if(!x){u.textContent="";return}let I=Number.parseInt(x,10);if(!Number.isFinite(I)){u.textContent="";return}let L=d-I,z=L<0?"-":"";u.textContent=` ${z}${vt(Math.abs(L))}`})}function No(){if(!c||c.querySelector(".ytls-error-message")||me)return;let t=null;if(document.activeElement instanceof HTMLInputElement&&c.contains(document.activeElement)){let d=document.activeElement,T=d.closest("li")?.dataset.guid;if(T){let x=d.selectionStart??d.value.length,I=d.selectionEnd??x,L=d.scrollLeft;t={guid:T,start:x,end:I,scroll:L}}}let o=te();if(o.length===0)return;let r=o.map(d=>d.dataset.guid),u=o.map(d=>{let h=d.querySelector("a[data-time]"),T=h?.dataset.time;if(!h||!T)return null;let x=Number.parseInt(T,10);if(!Number.isFinite(x))return null;let I=d.dataset.guid??"";return{time:x,guid:I,element:d}}).filter(d=>d!==null).sort((d,h)=>{let T=d.time-h.time;return T!==0?T:d.guid.localeCompare(h.guid)}),y=u.map(d=>d.guid),g=r.length!==y.length||r.some((d,h)=>d!==y[h]);for(;c.firstChild;)c.removeChild(c.firstChild);if(u.forEach(d=>{c.appendChild(d.element)}),cn(),et(),De(),t){let h=te().find(T=>T.dataset.guid===t.guid)?.querySelector("input");if(h)try{h.focus({preventScroll:!0})}catch{}}g&&(l("Timestamps changed: Timestamps sorted"),Hn(ye))}function Rn(){if(!c||!n||!v||!S)return;let t=te().length;typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea();let o=n.getBoundingClientRect(),r=v.getBoundingClientRect(),u=S.getBoundingClientRect(),y=Math.max(0,o.height-(r.height+u.height));t===0?(an(),c.style.overflowY="hidden"):c.style.overflowY=c.scrollHeight>y?"auto":"hidden"}function De(){if(!c)return;let t=Ne(),o=document.querySelector(".ytp-progress-bar"),r=q(),u=r?r.getVideoData():null,y=!!u&&!!u.isLive;if(!t||!o||!isFinite(t.duration)||y)return;Uo(),te().map(d=>{let h=d.querySelector("a[data-time]"),T=h?.dataset.time;if(!h||!T)return null;let x=Number.parseInt(T,10);if(!Number.isFinite(x))return null;let L=d.querySelector("input")?.value??"",z=d.dataset.guid??crypto.randomUUID();return d.dataset.guid||(d.dataset.guid=z),{start:x,comment:L,guid:z}}).filter(Ro).forEach(d=>{if(!Number.isFinite(d.start))return;let h=document.createElement("div");h.className="ytls-marker",h.style.position="absolute",h.style.height="100%",h.style.width="2px",h.style.backgroundColor="#ff0000",h.style.cursor="pointer",h.style.left=d.start/t.duration*100+"%",h.dataset.time=String(d.start),h.addEventListener("click",()=>{let T=q();T&&T.seekTo(d.start)}),o.appendChild(h)})}function Hn(t,o={}){if(!c||c.querySelector(".ytls-error-message")||!t)return;if(me){l("Save blocked: timestamps are currently loading");return}et();let r=io().sort((u,y)=>u.start-y.start);if(r.length===0&&!o.allowEmpty){l("Save skipped: no timestamps to save");return}jo(t,r).then(()=>l(`Successfully saved ${r.length} timestamps for ${t} to IndexedDB`)).catch(u=>l(`Failed to save timestamps for ${t} to IndexedDB:`,u,"error")),Zt({type:"timestamps_updated",videoId:t,action:"saved"})}function zt(t,o,r,u){if(!t||me)return;let y={guid:o,start:r,comment:u};l(`Saving timestamp: guid=${o}, start=${r}, comment="${u}"`),Zi(t,y).catch(g=>l(`Failed to save timestamp ${o}:`,g,"error")),Zt({type:"timestamps_updated",videoId:t,action:"saved"})}function Oi(t,o){!t||me||(l(`Deleting timestamp: guid=${o}`),Ji(t,o).catch(r=>l(`Failed to delete timestamp ${o}:`,r,"error")),Zt({type:"timestamps_updated",videoId:t,action:"saved"}))}async function Go(t){if(!c||c.querySelector(".ytls-error-message")){alert("Cannot export timestamps while displaying an error message.");return}let o=ye;if(!o)return;l(`Exporting timestamps for video ID: ${o}`);let r=io(),u=Math.max(Et(),0),y=dn();if(t==="json"){let g=new Blob([JSON.stringify(r,null,2)],{type:"application/json"}),d=URL.createObjectURL(g),h=document.createElement("a");h.href=d,h.download=`timestamps-${o}-${y}.json`,h.click(),URL.revokeObjectURL(d)}else if(t==="text"){let g=r.map(x=>{let I=vt(x.start,u),L=`${x.comment} <!-- guid:${x.guid} -->`.trimStart();return`${I} ${L}`}).join(`
`),d=new Blob([g],{type:"text/plain"}),h=URL.createObjectURL(d),T=document.createElement("a");T.href=h,T.download=`timestamps-${o}-${y}.txt`,T.click(),URL.revokeObjectURL(h)}}function lo(t){if(!n||!c){l("Timekeeper error:",t,"error");return}kt();let o=document.createElement("li");o.textContent=t,o.classList.add("ytls-error-message"),o.style.color="#ff6b6b",o.style.fontWeight="bold",o.style.padding="8px",o.style.background="rgba(255, 0, 0, 0.1)",c.appendChild(o),De()}function Uo(){document.querySelectorAll(".ytls-marker").forEach(t=>t.remove())}function Pt(){if(!n||!document.body.contains(n))return;let t=n.getBoundingClientRect(),o=document.documentElement.clientWidth,r=document.documentElement.clientHeight,u=t.width,y=t.height;if(t.left<0&&(n.style.left="0",n.style.right="auto"),t.right>o){let g=Math.max(0,o-u);n.style.left=`${g}px`,n.style.right="auto"}if(t.top<0&&(n.style.top="0",n.style.bottom="auto"),t.bottom>r){let g=Math.max(0,r-y);n.style.top=`${g}px`,n.style.bottom="auto"}}function Ni(){if(kn&&(document.removeEventListener("mousemove",kn),kn=null),Sn&&(document.removeEventListener("mouseup",Sn),Sn=null),Qt&&(document.removeEventListener("keydown",Qt),Qt=null),Ln&&(window.removeEventListener("resize",Ln),Ln=null),en&&(document.removeEventListener("pointerdown",en,!0),en=null),tn&&(document.removeEventListener("pointerup",tn,!0),tn=null),Xe){try{Xe.disconnect()}catch{}Xe=null}if(Qe){try{Qe.disconnect()}catch{}Qe=null}let t=Ne();t&&(In&&(t.removeEventListener("timeupdate",In),In=null),Cn&&(t.removeEventListener("pause",Cn),Cn=null),Dn&&(t.removeEventListener("play",Dn),Dn=null),Mn&&(t.removeEventListener("seeking",Mn),Mn=null))}function Gi(){Uo(),xt.forEach(o=>clearTimeout(o)),xt.clear(),Xt&&(clearTimeout(Xt),Xt=null),le&&(clearInterval(le),le=null),Je&&(clearTimeout(Je),Je=null),Ni();try{Fe.close()}catch{}if(P&&P.parentNode===document.body&&document.body.removeChild(P),P=null,Tn=null,xn=!1,ye=null,Xe){try{Xe.disconnect()}catch{}Xe=null}if(Qe){try{Qe.disconnect()}catch{}Qe=null}n&&n.parentNode&&n.remove();let t=document.getElementById("ytls-header-button");t&&t.parentNode&&t.remove(),ht=null,En=!1,$e=null,kt(),n=null,v=null,c=null,S=null,E=null,k=null,M=null,Pe=null}async function Ui(){let t=co();if(!t)return Pe=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let o=await bn();if(!ue(o)){let r=pt(o),u=r.length?` Missing methods: ${r.join(", ")}.`:"",y=o?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return Pe=null,{ok:!1,message:`${y}${u} Try refreshing once playback is ready.`}}return Pe=o,{ok:!0,player:o,videoId:t}}async function _o(){if(!n||!c)return;let t=c.scrollTop,o=!0,r=()=>{if(!c||!o)return;let u=Math.max(0,c.scrollHeight-c.clientHeight);c.scrollTop=Math.min(t,u)};try{let u=await Ui();if(!u.ok){lo(u.message),kt(),De();return}let{videoId:y}=u,g=[];try{let d=await Xi(y);d?(g=d.map(h=>({...h,guid:h.guid||crypto.randomUUID()})),l(`Loaded ${g.length} timestamps from IndexedDB for ${y}`)):l(`No timestamps found in IndexedDB for ${y}`)}catch(d){l(`Failed to load timestamps from IndexedDB for ${y}:`,d,"error"),lo("Failed to load timestamps from IndexedDB. Try refreshing the page."),De();return}if(g.length>0){g.sort((I,L)=>I.start-L.start),kt(),ao();let d=document.createDocumentFragment();g.forEach(I=>{let z=ln(I.start,I.comment,!0,I.guid,!1).__ytls_li;z&&d.appendChild(z)}),n&&n.classList.contains("ytls-zoom-in")&&fe!=null?(l("Deferring timestamp DOM append until show animation completes"),ft=d,rt||(rt=new Promise(I=>{Ge=I})),await rt):c&&(c.appendChild(d),et(),De(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea()));let T=q(),x=T?Math.floor(T.getCurrentTime()):Et();Number.isFinite(x)&&(Fn(x,!1),o=!1)}else kt(),ro("No timestamps for this video"),De(),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea())}catch(u){l("Unexpected error while loading timestamps:",u,"error"),lo("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{rt&&await rt,requestAnimationFrame(r),typeof window.recalculateTimestampsArea=="function"&&requestAnimationFrame(()=>window.recalculateTimestampsArea()),c&&!c.querySelector(".ytls-error-message")&&an()}}function co(){let o=new URLSearchParams(location.search).get("v");if(o)return o;let r=document.querySelector('meta[itemprop="identifier"]');return r?.content?r.content:null}function _i(){let t=Ne();if(!t)return;let o=()=>{if(!c)return;let d=q(),h=d?Math.floor(d.getCurrentTime()):0;if(!Number.isFinite(h))return;let T=$n(h);sn(T,!1)},r=d=>{try{let h=new URL(window.location.href);d!==null&&Number.isFinite(d)?h.searchParams.set("t",`${Math.floor(d)}s`):h.searchParams.delete("t"),window.history.replaceState({},"",h.toString())}catch{}},u=()=>{let d=q(),h=d?Math.floor(d.getCurrentTime()):0;Number.isFinite(h)&&r(h)},y=()=>{r(null)},g=()=>{let d=Ne();if(!d)return;let h=q(),T=h?Math.floor(h.getCurrentTime()):0;if(!Number.isFinite(T))return;d.paused&&r(T);let x=$n(T);sn(x,!0)};In=o,Cn=u,Dn=y,Mn=g,t.addEventListener("timeupdate",o),t.addEventListener("pause",u),t.addEventListener("play",y),t.addEventListener("seeking",g)}let qi="ytls-timestamps-db",ji=3,Ft="timestamps",Ue="timestamps_v2",On="settings",$t=null,Rt=null;function Ht(){if($t)try{if($t.objectStoreNames.length>=0)return Promise.resolve($t)}catch(t){l("IndexedDB connection is no longer usable:",t,"warn"),$t=null}return Rt||(Rt=Ki().then(t=>($t=t,Rt=null,t.onclose=()=>{l("IndexedDB connection closed unexpectedly","warn"),$t=null},t.onerror=o=>{l("IndexedDB connection error:",o,"error")},t)).catch(t=>{throw Rt=null,t}),Rt)}async function qo(){let t={},o=await Vo(Ue),r=new Map;for(let g of o){let d=g;r.has(d.video_id)||r.set(d.video_id,[]),r.get(d.video_id).push({guid:d.guid,start:d.start,comment:d.comment})}for(let[g,d]of r)t[`ytls-${g}`]={video_id:g,timestamps:d.sort((h,T)=>h.start-T.start)};return{json:JSON.stringify(t,null,2),filename:"timekeeper-data.json",totalVideos:r.size,totalTimestamps:o.length}}async function Vi(){try{let{json:t,filename:o,totalVideos:r,totalTimestamps:u}=await qo(),y=new Blob([t],{type:"application/json"}),g=URL.createObjectURL(y),d=document.createElement("a");d.href=g,d.download=o,d.click(),URL.revokeObjectURL(g),l(`Exported ${r} videos with ${u} timestamps`)}catch(t){throw l("Failed to export data:",t,"error"),t}}async function Wi(){let t=await Vo(Ue);if(!Array.isArray(t)||t.length===0){let x=`Tag,Timestamp,URL
`,I=`timestamps-${dn()}.csv`;return{csv:x,filename:I,totalVideos:0,totalTimestamps:0}}let o=new Map;for(let x of t)o.has(x.video_id)||o.set(x.video_id,[]),o.get(x.video_id).push({start:x.start,comment:x.comment});let r=[];r.push("Tag,Timestamp,URL");let u=0,y=x=>`"${String(x).replace(/"/g,'""')}"`,g=x=>{let I=Math.floor(x/3600),L=Math.floor(x%3600/60),z=String(x%60).padStart(2,"0");return`${String(I).padStart(2,"0")}:${String(L).padStart(2,"0")}:${z}`},d=Array.from(o.keys()).sort();for(let x of d){let I=o.get(x).sort((L,z)=>L.start-z.start);for(let L of I){let z=L.comment,Q=g(L.start),F=go(L.start,`https://www.youtube.com/watch?v=${x}`);r.push([y(z),y(Q),y(F)].join(",")),u++}}let h=r.join(`
`),T=`timestamps-${dn()}.csv`;return{csv:h,filename:T,totalVideos:o.size,totalTimestamps:u}}async function Yi(){try{let{csv:t,filename:o,totalVideos:r,totalTimestamps:u}=await Wi(),y=new Blob([t],{type:"text/csv;charset=utf-8;"}),g=URL.createObjectURL(y),d=document.createElement("a");d.href=g,d.download=o,d.click(),URL.revokeObjectURL(g),l(`Exported ${r} videos with ${u} timestamps (CSV)`)}catch(t){throw l("Failed to export CSV data:",t,"error"),t}}function Ki(){return new Promise((t,o)=>{let r=indexedDB.open(qi,ji);r.onupgradeneeded=u=>{let y=u.target.result,g=u.oldVersion,d=u.target.transaction;if(g<1&&y.createObjectStore(Ft,{keyPath:"video_id"}),g<2&&!y.objectStoreNames.contains(On)&&y.createObjectStore(On,{keyPath:"key"}),g<3){if(y.objectStoreNames.contains(Ft)){l("Exporting backup before v2 migration...");let x=d.objectStore(Ft).getAll();x.onsuccess=()=>{let I=x.result;if(I.length>0)try{let L={},z=0;I.forEach(ve=>{if(Array.isArray(ve.timestamps)&&ve.timestamps.length>0){let Te=ve.timestamps.map(Le=>({guid:Le.guid||crypto.randomUUID(),start:Le.start,comment:Le.comment}));L[`ytls-${ve.video_id}`]={video_id:ve.video_id,timestamps:Te.sort((Le,gt)=>Le.start-gt.start)},z+=Te.length}});let Q=new Blob([JSON.stringify(L,null,2)],{type:"application/json"}),F=URL.createObjectURL(Q),ne=document.createElement("a");ne.href=F,ne.download=`timekeeper-data-${dn()}.json`,ne.click(),URL.revokeObjectURL(F),l(`Pre-migration backup exported: ${I.length} videos, ${z} timestamps`)}catch(L){l("Failed to export pre-migration backup:",L,"error")}}}let h=y.createObjectStore(Ue,{keyPath:"guid"});if(h.createIndex("video_id","video_id",{unique:!1}),h.createIndex("video_start",["video_id","start"],{unique:!1}),y.objectStoreNames.contains(Ft)){let x=d.objectStore(Ft).getAll();x.onsuccess=()=>{let I=x.result;if(I.length>0){let L=0;I.forEach(z=>{Array.isArray(z.timestamps)&&z.timestamps.length>0&&z.timestamps.forEach(Q=>{h.put({guid:Q.guid||crypto.randomUUID(),video_id:z.video_id,start:Q.start,comment:Q.comment}),L++})}),l(`Migrated ${L} timestamps from ${I.length} videos to v2 store`)}},y.deleteObjectStore(Ft),l("Deleted old timestamps store after migration to v2")}}},r.onsuccess=u=>{t(u.target.result)},r.onerror=u=>{let y=u.target.error;o(y??new Error("Failed to open IndexedDB"))}})}function uo(t,o,r){return Ht().then(u=>new Promise((y,g)=>{let d;try{d=u.transaction(t,o)}catch(x){g(new Error(`Failed to create transaction for ${t}: ${x}`));return}let h=d.objectStore(t),T;try{T=r(h)}catch(x){g(new Error(`Failed to execute operation on ${t}: ${x}`));return}T&&(T.onsuccess=()=>y(T.result),T.onerror=()=>g(T.error??new Error(`IndexedDB ${o} operation failed`))),d.oncomplete=()=>{T||y(void 0)},d.onerror=()=>g(d.error??new Error("IndexedDB transaction failed")),d.onabort=()=>g(d.error??new Error("IndexedDB transaction aborted"))}))}function jo(t,o){return Ht().then(r=>new Promise((u,y)=>{let g;try{g=r.transaction([Ue],"readwrite")}catch(x){y(new Error(`Failed to create transaction: ${x}`));return}let d=g.objectStore(Ue),T=d.index("video_id").getAll(IDBKeyRange.only(t));T.onsuccess=()=>{try{let x=T.result,I=new Set(o.map(L=>L.guid));x.forEach(L=>{I.has(L.guid)||d.delete(L.guid)}),o.forEach(L=>{d.put({guid:L.guid,video_id:t,start:L.start,comment:L.comment})})}catch(x){l("Error during save operation:",x,"error")}},T.onerror=()=>{y(T.error??new Error("Failed to get existing records"))},g.oncomplete=()=>u(),g.onerror=()=>y(g.error??new Error("Failed to save to IndexedDB")),g.onabort=()=>y(g.error??new Error("Transaction aborted during save"))}))}function Zi(t,o){return Ht().then(r=>new Promise((u,y)=>{let g;try{g=r.transaction([Ue],"readwrite")}catch(T){y(new Error(`Failed to create transaction: ${T}`));return}let h=g.objectStore(Ue).put({guid:o.guid,video_id:t,start:o.start,comment:o.comment});h.onerror=()=>{y(h.error??new Error("Failed to put timestamp"))},g.oncomplete=()=>u(),g.onerror=()=>y(g.error??new Error("Failed to save single timestamp to IndexedDB")),g.onabort=()=>y(g.error??new Error("Transaction aborted during single timestamp save"))}))}function Ji(t,o){return l(`Deleting timestamp ${o} for video ${t}`),Ht().then(r=>new Promise((u,y)=>{let g;try{g=r.transaction([Ue],"readwrite")}catch(T){y(new Error(`Failed to create transaction: ${T}`));return}let h=g.objectStore(Ue).delete(o);h.onerror=()=>{y(h.error??new Error("Failed to delete timestamp"))},g.oncomplete=()=>u(),g.onerror=()=>y(g.error??new Error("Failed to delete single timestamp from IndexedDB")),g.onabort=()=>y(g.error??new Error("Transaction aborted during timestamp deletion"))}))}function Xi(t){return Ht().then(o=>new Promise(r=>{let u;try{u=o.transaction([Ue],"readonly")}catch(h){l("Failed to create read transaction:",h,"warn"),r(null);return}let d=u.objectStore(Ue).index("video_id").getAll(IDBKeyRange.only(t));d.onsuccess=()=>{let h=d.result;if(h.length>0){let T=h.map(x=>({guid:x.guid,start:x.start,comment:x.comment})).sort((x,I)=>x.start-I.start);r(T)}else r(null)},d.onerror=()=>{l("Failed to load timestamps:",d.error,"warn"),r(null)},u.onabort=()=>{l("Transaction aborted during load:",u.error,"warn"),r(null)}}))}function Qi(t){return Ht().then(o=>new Promise((r,u)=>{let y;try{y=o.transaction([Ue],"readwrite")}catch(T){u(new Error(`Failed to create transaction: ${T}`));return}let g=y.objectStore(Ue),h=g.index("video_id").getAll(IDBKeyRange.only(t));h.onsuccess=()=>{try{h.result.forEach(x=>{g.delete(x.guid)})}catch(T){l("Error during remove operation:",T,"error")}},h.onerror=()=>{u(h.error??new Error("Failed to get records for removal"))},y.oncomplete=()=>r(),y.onerror=()=>u(y.error??new Error("Failed to remove timestamps")),y.onabort=()=>u(y.error??new Error("Transaction aborted during timestamp removal"))}))}function Vo(t){return uo(t,"readonly",o=>o.getAll()).then(o=>Array.isArray(o)?o:[])}function Nn(t,o){uo(On,"readwrite",r=>{r.put({key:t,value:o})}).catch(r=>{l(`Failed to save setting '${t}' to IndexedDB:`,r,"error")})}function mo(t){return uo(On,"readonly",o=>o.get(t)).then(o=>o?.value).catch(o=>{l(`Failed to load setting '${t}' from IndexedDB:`,o,"error")})}function Wo(){if(!n)return;let t=n.style.display!=="none";Nn("uiVisible",t)}function at(t){let o=typeof t=="boolean"?t:!!n&&n.style.display!=="none",r=document.getElementById("ytls-header-button");r instanceof HTMLButtonElement&&r.setAttribute("aria-pressed",String(o)),ht&&!En&&ht.src!==Se&&(ht.src=Se)}function er(){n&&mo("uiVisible").then(t=>{let o=t;typeof o=="boolean"?(o?(n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in")):n.style.display="none",at(o)):(n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),at(!0))}).catch(t=>{l("Failed to load UI visibility state:",t,"error"),n.style.display="flex",n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),at(!0)})}function po(t){if(!n){l("ERROR: togglePaneVisibility called but pane is null");return}document.body.contains(n)||(l("Pane not in DOM during toggle, appending it"),document.querySelectorAll("#ytls-pane").forEach(y=>{y!==n&&y.remove()}),document.body.appendChild(n));let o=document.querySelectorAll("#ytls-pane");o.length>1&&(l(`ERROR: Multiple panes detected in togglePaneVisibility (${o.length}), cleaning up`),o.forEach(y=>{y!==n&&y.remove()})),Je&&(clearTimeout(Je),Je=null);let r=n.style.display==="none";(typeof t=="boolean"?t:r)?(n.style.display="flex",n.classList.remove("ytls-fade-out"),n.classList.remove("ytls-zoom-out"),n.classList.add("ytls-zoom-in"),at(!0),Wo(),ae(),fe&&(clearTimeout(fe),fe=null),fe=setTimeout(()=>{H(),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),de(),G(!0),fe=null},450)):(n.classList.remove("ytls-fade-in"),n.classList.remove("ytls-zoom-in"),n.classList.add("ytls-zoom-out"),at(!1),U())}function Yo(t){if(!c){l("UI is not initialized; cannot import timestamps.","warn");return}let o=!1;try{let r=JSON.parse(t),u=null;if(Array.isArray(r))u=r;else if(typeof r=="object"&&r!==null){let y=ye;if(y){let g=`timekeeper-${y}`;r[g]&&Array.isArray(r[g].timestamps)&&(u=r[g].timestamps,l(`Found timestamps for current video (${y}) in export format`,"info"))}if(!u){let g=Object.keys(r).filter(d=>d.startsWith("ytls-"));if(g.length===1&&Array.isArray(r[g[0]].timestamps)){u=r[g[0]].timestamps;let d=r[g[0]].video_id;l(`Found timestamps for video ${d} in export format`,"info")}}}u&&Array.isArray(u)?u.every(g=>typeof g.start=="number"&&typeof g.comment=="string")?(u.forEach(g=>{if(g.guid){let d=te().find(h=>h.dataset.guid===g.guid);if(d){let h=d.querySelector("input");h&&(h.value=g.comment)}else ln(g.start,g.comment,!1,g.guid)}else ln(g.start,g.comment,!1,crypto.randomUUID())}),o=!0):l("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):l("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!o){let r=t.split(`
`).map(u=>u.trim()).filter(u=>u);if(r.length>0){let u=!1;r.forEach(y=>{let g=y.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(g){u=!0;let d=parseInt(g[1])||0,h=parseInt(g[2]),T=parseInt(g[3]),x=d*3600+h*60+T,I=g[4]?g[4].trim():"",L=null,z=I,Q=I.match(/<!--\s*guid:([^>]+?)\s*-->/);Q&&(L=Q[1].trim(),z=I.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let F;if(L&&(F=te().find(ne=>ne.dataset.guid===L)),!F&&!L&&(F=te().find(ne=>{if(ne.dataset.guid)return!1;let Te=ne.querySelector("a[data-time]")?.dataset.time;if(!Te)return!1;let Le=Number.parseInt(Te,10);return Number.isFinite(Le)&&Le===x})),F){let ne=F.querySelector("input");ne&&(ne.value=z)}else ln(x,z,!1,L||crypto.randomUUID())}}),u&&(o=!0)}}o?(l("Timestamps changed: Imported timestamps from file/clipboard"),et(),Hn(ye),De(),Rn()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function tr(){if(oo){l("Pane initialization already in progress, skipping duplicate call");return}if(!(n&&document.body.contains(n))){oo=!0;try{let r=function(){if(me||St)return;let f=Ne(),m=q();if(!f&&!m)return;let b=m?m.getCurrentTime():0,w=Number.isFinite(b)?Math.max(0,Math.floor(b)):Math.max(0,Et()),C=Math.floor(w/3600),B=Math.floor(w/60)%60,A=w%60,{isLive:N}=m?m.getVideoData()||{isLive:!1}:{isLive:!1},$=m?Ri(m):!1,K=c?te().map(V=>{let we=V.querySelector("a[data-time]");return we?parseFloat(we.getAttribute("data-time")??"0"):0}):[],Me="";if(K.length>0)if(N){let V=Math.max(1,w/60),we=K.filter(Ae=>Ae<=w);if(we.length>0){let Ae=(we.length/V).toFixed(2);parseFloat(Ae)>0&&(Me=` (${Ae}/min)`)}}else{let V=m?m.getDuration():0,we=Number.isFinite(V)&&V>0?V:f&&Number.isFinite(f.duration)&&f.duration>0?f.duration:0,Ae=Math.max(1,we/60),ct=(K.length/Ae).toFixed(1);parseFloat(ct)>0&&(Me=` (${ct}/min)`)}E.textContent=`\u23F3${C?C+":"+String(B).padStart(2,"0"):B}:${String(A).padStart(2,"0")}${Me}`,E.style.color=$?"#ff4d4f":"",K.length>0&&Fn(w,!1)},F=function(f,m,b){let w=document.createElement("button");return w.textContent=f,nt(w,m),w.classList.add("ytls-settings-modal-button"),w.onclick=b,w},ne=function(f="general"){if(P&&P.parentNode===document.body){let Ie=document.getElementById("ytls-save-modal"),yt=document.getElementById("ytls-load-modal"),ut=document.getElementById("ytls-delete-all-modal");Ie&&document.body.contains(Ie)&&document.body.removeChild(Ie),yt&&document.body.contains(yt)&&document.body.removeChild(yt),ut&&document.body.contains(ut)&&document.body.removeChild(ut),P.classList.remove("ytls-fade-in"),P.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(P)&&document.body.removeChild(P),P=null,document.removeEventListener("click",Te,!0),document.removeEventListener("keydown",ve)},300);return}P=document.createElement("div"),P.id="ytls-settings-modal",P.classList.remove("ytls-fade-out"),P.classList.add("ytls-fade-in");let m=document.createElement("div");m.className="ytls-modal-header";let b=document.createElement("div");b.id="ytls-settings-nav";let w=document.createElement("button");w.className="ytls-modal-close-button",w.textContent="\u2715",w.onclick=()=>{if(P&&P.parentNode===document.body){let Ie=document.getElementById("ytls-save-modal"),yt=document.getElementById("ytls-load-modal"),ut=document.getElementById("ytls-delete-all-modal");Ie&&document.body.contains(Ie)&&document.body.removeChild(Ie),yt&&document.body.contains(yt)&&document.body.removeChild(yt),ut&&document.body.contains(ut)&&document.body.removeChild(ut),P.classList.remove("ytls-fade-in"),P.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(P)&&document.body.removeChild(P),P=null,document.removeEventListener("click",Te,!0),document.removeEventListener("keydown",ve)},300)}};let C=document.createElement("div");C.id="ytls-settings-content";let B=document.createElement("h3");B.className="ytls-section-heading",B.textContent="General",B.style.display="none";let A=document.createElement("div"),N=document.createElement("div");N.className="ytls-button-grid";function $(Ie){A.style.display=Ie==="general"?"block":"none",N.style.display=Ie==="drive"?"block":"none",K.classList.toggle("active",Ie==="general"),V.classList.toggle("active",Ie==="drive"),B.textContent=Ie==="general"?"General":"Google Drive"}let K=document.createElement("button");K.textContent="\u{1F6E0}\uFE0F";let Me=document.createElement("span");Me.className="ytls-tab-text",Me.textContent=" General",K.appendChild(Me),nt(K,"General settings"),K.classList.add("ytls-settings-modal-button"),K.onclick=()=>$("general");let V=document.createElement("button");V.textContent="\u2601\uFE0F";let we=document.createElement("span");we.className="ytls-tab-text",we.textContent=" Backup",V.appendChild(we),nt(V,"Google Drive sign-in and backup"),V.classList.add("ytls-settings-modal-button"),V.onclick=async()=>{O.isSignedIn&&await Di(),$("drive")},b.appendChild(K),b.appendChild(V),m.appendChild(b),m.appendChild(w),P.appendChild(m),A.className="ytls-button-grid",A.appendChild(F("\u{1F4BE} Save","Save As...",Le.onclick)),A.appendChild(F("\u{1F4C2} Load","Load",gt.onclick)),A.appendChild(F("\u{1F4E4} Export All","Export All Data",st.onclick)),A.appendChild(F("\u{1F4E5} Import All","Import All Data",ee.onclick)),A.appendChild(F("\u{1F4C4} Export All (CSV)","Export All Timestamps to CSV",async()=>{try{await Yi()}catch{alert("Failed to export CSV: Could not read from database.")}}));let Ae=F(O.isSignedIn?"\u{1F513} Sign Out":"\u{1F510} Sign In",O.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{O.isSignedIn?await Ci():await Li(),Ae.textContent=O.isSignedIn?"\u{1F513} Sign Out":"\u{1F510} Sign In",nt(Ae,O.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),typeof re=="function"&&re()});N.appendChild(Ae);let ct=F(ot?"\u{1F501} Auto Backup: On":"\u{1F501} Auto Backup: Off","Toggle Auto Backup",async()=>{await Bi(),ct.textContent=ot?"\u{1F501} Auto Backup: On":"\u{1F501} Auto Backup: Off",typeof re=="function"&&re()});N.appendChild(ct);let It=F(`\u23F1\uFE0F Backup Interval: ${We}min`,"Set periodic backup interval (minutes)",async()=>{await zi(),It.textContent=`\u23F1\uFE0F Backup Interval: ${We}min`,typeof re=="function"&&re()});N.appendChild(It),N.appendChild(F("\u{1F5C4}\uFE0F Backup Now","Run a backup immediately",async()=>{await yn(!1),typeof re=="function"&&re()}));let qe=document.createElement("div");qe.style.marginTop="15px",qe.style.paddingTop="10px",qe.style.borderTop="1px solid #555",qe.style.fontSize="12px",qe.style.color="#aaa";let Ct=document.createElement("div");Ct.style.marginBottom="8px",Ct.style.fontWeight="bold",qe.appendChild(Ct),Ei(Ct);let ho=document.createElement("div");ho.style.marginBottom="8px",xi(ho),qe.appendChild(ho);let Qo=document.createElement("div");Ti(Qo),qe.appendChild(Qo),N.appendChild(qe),Re(),vn(),re(),C.appendChild(B),C.appendChild(A),C.appendChild(N),$(f),P.appendChild(C),document.body.appendChild(P),requestAnimationFrame(()=>{let Ie=P.getBoundingClientRect(),ut=(window.innerHeight-Ie.height)/2;P.style.top=`${Math.max(20,ut)}px`,P.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",Te,!0),document.addEventListener("keydown",ve)},0)},ve=function(f){if(f.key==="Escape"&&P&&P.parentNode===document.body){let m=document.getElementById("ytls-save-modal"),b=document.getElementById("ytls-load-modal"),w=document.getElementById("ytls-delete-all-modal");if(m||b||w)return;f.preventDefault(),m&&document.body.contains(m)&&document.body.removeChild(m),b&&document.body.contains(b)&&document.body.removeChild(b),w&&document.body.contains(w)&&document.body.removeChild(w),P.classList.remove("ytls-fade-in"),P.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(P)&&document.body.removeChild(P),P=null,document.removeEventListener("click",Te,!0),document.removeEventListener("keydown",ve)},300)}},Te=function(f){if(Tn&&Tn.contains(f.target))return;let m=document.getElementById("ytls-save-modal"),b=document.getElementById("ytls-load-modal"),w=document.getElementById("ytls-delete-all-modal");m&&m.contains(f.target)||b&&b.contains(f.target)||w&&w.contains(f.target)||P&&P.contains(f.target)||(m&&document.body.contains(m)&&document.body.removeChild(m),b&&document.body.contains(b)&&document.body.removeChild(b),w&&document.body.contains(w)&&document.body.removeChild(w),P&&P.parentNode===document.body&&(P.classList.remove("ytls-fade-in"),P.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(P)&&document.body.removeChild(P),P=null,document.removeEventListener("click",Te,!0),document.removeEventListener("keydown",ve)},300)))},Y=function(){n&&(l("Loading window position from IndexedDB"),mo("windowPosition").then(f=>{if(f&&typeof f.x=="number"&&typeof f.y=="number"){let b=f;n.style.left=`${b.x}px`,n.style.top=`${b.y}px`,n.style.right="auto",n.style.bottom="auto",typeof b.width=="number"&&b.width>0?n.style.width=`${b.width}px`:(n.style.width=`${At}px`,l(`No stored window width found, using default width ${At}px`)),typeof b.height=="number"&&b.height>0?n.style.height=`${b.height}px`:(n.style.height=`${wt}px`,l(`No stored window height found, using default height ${wt}px`));let w=X();oe(w,b.x,b.y),l("Restored window position from IndexedDB:",$e)}else l("No window position found in IndexedDB, applying default size and leaving default position"),n.style.width=`${At}px`,n.style.height=`${wt}px`,$e=null;Pt();let m=X();m&&(m.width||m.height)&&oe(m),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea()}).catch(f=>{l("failed to load pane position from IndexedDB:",f,"warn"),Pt();let m=X();m&&(m.width||m.height)&&($e={x:Math.max(0,Math.round(m.left)),y:0,width:Math.round(m.width),height:Math.round(m.height)}),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea()}))},he=function(){if(!n)return;let f=X();if(!f)return;let m={x:Math.max(0,Math.round(f.left)),y:Math.max(0,Math.round(f.top)),width:Math.round(f.width),height:Math.round(f.height)};if($e&&$e.x===m.x&&$e.y===m.y&&$e.width===m.width&&$e.height===m.height){l("Skipping window position save; position and size unchanged");return}$e={...m},l(`Saving window position and size to IndexedDB: x=${m.x}, y=${m.y}, width=${m.width}, height=${m.height}`),Nn("windowPosition",m),Zt({type:"window_position_updated",position:m,timestamp:Date.now()})},qn=function(f,m){f.addEventListener("dblclick",b=>{b.preventDefault(),b.stopPropagation(),n&&(n.style.width="300px",n.style.height="300px",he(),un())}),f.addEventListener("mousedown",b=>{b.preventDefault(),b.stopPropagation(),lt=!0,Lt=m,Jo=b.clientX,Xo=b.clientY;let w=n.getBoundingClientRect();Gt=w.width,Ut=w.height,Un=w.left,_n=w.top,m==="top-left"||m==="bottom-right"?document.body.style.cursor="nwse-resize":document.body.style.cursor="nesw-resize"})},un=function(){if(n&&v&&S&&c){let f=n.getBoundingClientRect(),m=v.getBoundingClientRect(),b=S.getBoundingClientRect(),w=f.height-(m.height+b.height);c.style.maxHeight=w>0?w+"px":"0px",c.style.overflowY=w>0?"auto":"hidden"}};document.querySelectorAll("#ytls-pane").forEach(f=>f.remove()),n=document.createElement("div"),v=document.createElement("div"),c=document.createElement("ul"),S=document.createElement("div"),E=document.createElement("span"),k=document.createElement("style"),M=document.createElement("span"),D=document.createElement("span"),D.classList.add("ytls-backup-indicator"),D.style.cursor="pointer",D.style.backgroundColor="#666",D.onclick=f=>{f.stopPropagation(),ne("drive")},c.addEventListener("mouseenter",()=>{xn=!0,nn=!1}),c.addEventListener("mouseleave",()=>{if(xn=!1,nn)return;let f=q(),m=f?Math.floor(f.getCurrentTime()):Et();Fn(m,!1);let b=null;if(document.activeElement instanceof HTMLInputElement&&c.contains(document.activeElement)&&(b=document.activeElement.closest("li")?.dataset.guid??null),No(),b){let C=te().find(B=>B.dataset.guid===b)?.querySelector("input");if(C)try{C.focus({preventScroll:!0})}catch{}}}),n.id="ytls-pane",v.id="ytls-pane-header",v.addEventListener("dblclick",f=>{let m=f.target instanceof HTMLElement?f.target:null;m&&(m.closest("a")||m.closest("button")||m.closest("#ytls-current-time")||m.closest(".ytls-version-display")||m.closest(".ytls-backup-indicator"))||(f.preventDefault(),po(!1))});let t=GM_info.script.version;M.textContent=`v${t}`,M.classList.add("ytls-version-display");let o=document.createElement("span");o.style.display="inline-flex",o.style.alignItems="center",o.style.gap="6px",o.appendChild(M),o.appendChild(D),E.id="ytls-current-time",E.textContent="\u23F3",E.onclick=()=>{St=!0;let f=q();f&&f.seekToLiveHead(),setTimeout(()=>{St=!1},500)},r(),le&&clearInterval(le),le=setInterval(r,1e3),S.id="ytls-buttons";let u=(f,m)=>()=>{f.classList.remove("ytls-fade-in"),f.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(f)&&document.body.removeChild(f),m&&m()},300)},y=f=>m=>{m.key==="Escape"&&(m.preventDefault(),m.stopPropagation(),f())},g=f=>{setTimeout(()=>{document.addEventListener("keydown",f)},0)},d=(f,m)=>b=>{f.contains(b.target)||m()},h=f=>{setTimeout(()=>{document.addEventListener("click",f,!0)},0)},z=[{label:"\u{1F423}",title:"Add timestamp",action:()=>{if(!c||c.querySelector(".ytls-error-message")||me)return;let f=typeof Bt<"u"?Bt:0,m=q(),b=m?Math.floor(m.getCurrentTime()+f):0;if(!Number.isFinite(b))return;let w=ln(b,"");w&&w.focus()}},{label:"\u2699\uFE0F",title:"Settings",action:()=>ne()},{label:"\u{1F4CB}",title:"Copy timestamps to clipboard",action:function(f){if(!c||c.querySelector(".ytls-error-message")||me){this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3);return}let m=io(),b=Math.max(Et(),0);if(m.length===0){this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3);return}let w=f.ctrlKey,C=m.map(B=>{let A=vt(B.start,b);return w?`${A} ${B.comment} <!-- guid:${B.guid} -->`.trimStart():`${A} ${B.comment}`}).join(`
`);navigator.clipboard.writeText(C).then(()=>{this.textContent="\u2705",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3)}).catch(B=>{l("Failed to copy timestamps: ",B,"error"),this.textContent="\u274C",setTimeout(()=>{this.textContent="\u{1F4CB}"},2e3)})}},{label:"\u23F1\uFE0F",title:"Offset all timestamps",action:()=>{if(!c||c.querySelector(".ytls-error-message")||me)return;if(te().length===0){alert("No timestamps available to offset.");return}let m=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(m===null)return;let b=m.trim();if(b.length===0)return;let w=Number.parseInt(b,10);if(!Number.isFinite(w)){alert("Please enter a valid integer number of seconds.");return}w!==0&&Ho(w,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{label:"\u{1F5D1}\uFE0F",title:"Delete all timestamps for current video",action:async()=>{let f=co();if(!f){alert("Unable to determine current video ID.");return}let m=document.createElement("div");m.id="ytls-delete-all-modal",m.classList.remove("ytls-fade-out"),m.classList.add("ytls-fade-in");let b=document.createElement("p");b.textContent="Hold the button to delete all timestamps for:",b.style.marginBottom="10px";let w=document.createElement("p");w.textContent=f,w.style.fontFamily="monospace",w.style.fontSize="12px",w.style.marginBottom="15px",w.style.color="#aaa";let C=document.createElement("button");C.classList.add("ytls-save-modal-button"),C.style.background="#d32f2f",C.style.position="relative",C.style.overflow="hidden";let B=null,A=0,N=null,$=document.createElement("div");$.style.position="absolute",$.style.left="0",$.style.top="0",$.style.height="100%",$.style.width="0%",$.style.background="#ff6b6b",$.style.transition="none",$.style.pointerEvents="none",C.appendChild($);let K=document.createElement("span");K.textContent="Hold to Delete All",K.style.position="relative",K.style.zIndex="1",C.appendChild(K);let Me=()=>{if(!A)return;let qe=Date.now()-A,Ct=Math.min(qe/5e3*100,100);$.style.width=`${Ct}%`,Ct<100&&(N=requestAnimationFrame(Me))},V=()=>{B&&(clearTimeout(B),B=null),N&&(cancelAnimationFrame(N),N=null),A=0,$.style.width="0%",K.textContent="Hold to Delete All"};C.onmousedown=()=>{A=Date.now(),K.textContent="Deleting...",N=requestAnimationFrame(Me),B=setTimeout(async()=>{V(),m.classList.remove("ytls-fade-in"),m.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(m)&&document.body.removeChild(m);try{await Qi(f),fo()}catch(qe){l("Failed to delete all timestamps:",qe,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},C.onmouseup=V,C.onmouseleave=V;let we=null,Ae=null,ct=u(m,()=>{V(),we&&document.removeEventListener("keydown",we),Ae&&document.removeEventListener("click",Ae,!0)});we=y(ct),Ae=d(m,ct);let It=document.createElement("button");It.textContent="Cancel",It.classList.add("ytls-save-modal-cancel-button"),It.onclick=ct,m.appendChild(b),m.appendChild(w),m.appendChild(C),m.appendChild(It),document.body.appendChild(m),g(we),h(Ae)}}],Q=ei();z.forEach(f=>{let m=document.createElement("button");if(m.textContent=f.label,nt(m,f.title),m.classList.add("ytls-main-button"),f.label==="\u{1F423}"&&Q){let b=document.createElement("span");b.textContent=Q,b.classList.add("ytls-holiday-emoji"),m.appendChild(b)}f.label==="\u{1F4CB}"?m.onclick=function(b){f.action.call(this,b)}:m.onclick=f.action,f.label==="\u2699\uFE0F"&&(Tn=m),S.appendChild(m)});let Le=document.createElement("button");Le.textContent="\u{1F4BE} Save",Le.classList.add("ytls-file-operation-button"),Le.onclick=()=>{let f=document.createElement("div");f.id="ytls-save-modal",f.classList.remove("ytls-fade-out"),f.classList.add("ytls-fade-in");let m=document.createElement("p");m.textContent="Save as:";let b=null,w=null,C=u(f,()=>{b&&document.removeEventListener("keydown",b),w&&document.removeEventListener("click",w,!0)});b=y(C),w=d(f,C);let B=document.createElement("button");B.textContent="JSON",B.classList.add("ytls-save-modal-button"),B.onclick=()=>{b&&document.removeEventListener("keydown",b),w&&document.removeEventListener("click",w,!0),u(f,()=>Go("json"))()};let A=document.createElement("button");A.textContent="Plain Text",A.classList.add("ytls-save-modal-button"),A.onclick=()=>{b&&document.removeEventListener("keydown",b),w&&document.removeEventListener("click",w,!0),u(f,()=>Go("text"))()};let N=document.createElement("button");N.textContent="Cancel",N.classList.add("ytls-save-modal-cancel-button"),N.onclick=C,f.appendChild(m),f.appendChild(B),f.appendChild(A),f.appendChild(N),document.body.appendChild(f),g(b),h(w)};let gt=document.createElement("button");gt.textContent="\u{1F4C2} Load",gt.classList.add("ytls-file-operation-button"),gt.onclick=()=>{let f=document.createElement("div");f.id="ytls-load-modal",f.classList.remove("ytls-fade-out"),f.classList.add("ytls-fade-in");let m=document.createElement("p");m.textContent="Load from:";let b=null,w=null,C=u(f,()=>{b&&document.removeEventListener("keydown",b),w&&document.removeEventListener("click",w,!0)});b=y(C),w=d(f,C);let B=document.createElement("button");B.textContent="File",B.classList.add("ytls-save-modal-button"),B.onclick=()=>{let $=document.createElement("input");$.type="file",$.accept=".json,.txt",$.classList.add("ytls-hidden-file-input"),$.onchange=K=>{let Me=K.target.files?.[0];if(!Me)return;b&&document.removeEventListener("keydown",b),w&&document.removeEventListener("click",w,!0),C();let V=new FileReader;V.onload=()=>{let we=String(V.result).trim();Yo(we)},V.readAsText(Me)},$.click()};let A=document.createElement("button");A.textContent="Clipboard",A.classList.add("ytls-save-modal-button"),A.onclick=async()=>{b&&document.removeEventListener("keydown",b),w&&document.removeEventListener("click",w,!0),u(f,async()=>{try{let $=await navigator.clipboard.readText();$?Yo($.trim()):alert("Clipboard is empty.")}catch($){l("Failed to read from clipboard: ",$,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let N=document.createElement("button");N.textContent="Cancel",N.classList.add("ytls-save-modal-cancel-button"),N.onclick=C,f.appendChild(m),f.appendChild(B),f.appendChild(A),f.appendChild(N),document.body.appendChild(f),g(b),h(w)};let st=document.createElement("button");st.textContent="\u{1F4E4} Export",st.classList.add("ytls-file-operation-button"),st.onclick=async()=>{try{await Vi()}catch{alert("Failed to export data: Could not read from database.")}};let ee=document.createElement("button");ee.textContent="\u{1F4E5} Import",ee.classList.add("ytls-file-operation-button"),ee.onclick=()=>{let f=document.createElement("input");f.type="file",f.accept=".json",f.classList.add("ytls-hidden-file-input"),f.onchange=m=>{let b=m.target.files?.[0];if(!b)return;let w=new FileReader;w.onload=()=>{try{let C=JSON.parse(String(w.result)),B=[];for(let A in C)if(Object.prototype.hasOwnProperty.call(C,A)&&A.startsWith("ytls-")){let N=A.substring(5),$=C[A];if($&&typeof $.video_id=="string"&&Array.isArray($.timestamps)){let K=$.timestamps.map(V=>({...V,guid:V.guid||crypto.randomUUID()})),Me=jo(N,K).then(()=>l(`Imported ${N} to IndexedDB`)).catch(V=>l(`Failed to import ${N} to IndexedDB:`,V,"error"));B.push(Me)}else l(`Skipping key ${A} during import due to unexpected data format.`,"warn")}Promise.all(B).then(()=>{fo()}).catch(A=>{alert("An error occurred during import to IndexedDB. Check console for details."),l("Overall import error:",A,"error")})}catch(C){alert(`Failed to import data. Please ensure the file is in the correct format.
`+C.message),l("Import error:",C,"error")}},w.readAsText(b)},f.click()},k.textContent=ti,c.onclick=f=>{Oo(f)},c.ontouchstart=f=>{Oo(f)},n.style.position="fixed",n.style.bottom="0",n.style.right="0",n.style.transition="none",Y(),setTimeout(()=>Pt(),10);let se=!1,ie,be,_e=!1;n.addEventListener("mousedown",f=>{let m=f.target;m instanceof Element&&(m instanceof HTMLInputElement||m instanceof HTMLTextAreaElement||m!==v&&!v.contains(m)&&window.getComputedStyle(m).cursor==="pointer"||(se=!0,_e=!1,ie=f.clientX-n.getBoundingClientRect().left,be=f.clientY-n.getBoundingClientRect().top,n.style.transition="none"))}),document.addEventListener("mousemove",kn=f=>{if(!se)return;_e=!0;let m=f.clientX-ie,b=f.clientY-be,w=n.getBoundingClientRect(),C=w.width,B=w.height,A=document.documentElement.clientWidth,N=document.documentElement.clientHeight;m=Math.max(0,Math.min(m,A-C)),b=Math.max(0,Math.min(b,N-B)),n.style.left=`${m}px`,n.style.top=`${b}px`,n.style.right="auto",n.style.bottom="auto"}),document.addEventListener("mouseup",Sn=()=>{if(!se)return;se=!1;let f=_e;setTimeout(()=>{_e=!1},50),Pt(),setTimeout(()=>{f&&he()},200)}),n.addEventListener("dragstart",f=>f.preventDefault());let tt=document.createElement("div"),Ot=document.createElement("div"),Gn=document.createElement("div"),Nt=document.createElement("div");tt.id="ytls-resize-tl",Ot.id="ytls-resize-tr",Gn.id="ytls-resize-bl",Nt.id="ytls-resize-br";let lt=!1,Jo=0,Xo=0,Gt=0,Ut=0,Un=0,_n=0,Lt=null;qn(tt,"top-left"),qn(Ot,"top-right"),qn(Gn,"bottom-left"),qn(Nt,"bottom-right"),document.addEventListener("mousemove",f=>{if(!lt||!n||!Lt)return;let m=f.clientX-Jo,b=f.clientY-Xo,w=Gt,C=Ut,B=Un,A=_n,N=document.documentElement.clientWidth,$=document.documentElement.clientHeight;Lt==="bottom-right"?(w=Math.max(200,Math.min(800,Gt+m)),C=Math.max(250,Math.min($,Ut+b))):Lt==="top-left"?(w=Math.max(200,Math.min(800,Gt-m)),B=Un+m,C=Math.max(250,Math.min($,Ut-b)),A=_n+b):Lt==="top-right"?(w=Math.max(200,Math.min(800,Gt+m)),C=Math.max(250,Math.min($,Ut-b)),A=_n+b):Lt==="bottom-left"&&(w=Math.max(200,Math.min(800,Gt-m)),B=Un+m,C=Math.max(250,Math.min($,Ut+b))),B=Math.max(0,Math.min(B,N-w)),A=Math.max(0,Math.min(A,$-C)),n.style.width=`${w}px`,n.style.height=`${C}px`,n.style.left=`${B}px`,n.style.top=`${A}px`,n.style.right="auto",n.style.bottom="auto"}),document.addEventListener("mouseup",()=>{lt&&(lt=!1,Lt=null,document.body.style.cursor="",G(!0))});let jn=null;window.addEventListener("resize",Ln=()=>{jn&&clearTimeout(jn),jn=setTimeout(()=>{G(!0),jn=null},200)}),v.appendChild(E),v.appendChild(o);let Vn=document.createElement("div");if(Vn.id="ytls-content",Vn.append(c),Vn.append(S),n.append(v,Vn,k,tt,Ot,Gn,Nt),n.addEventListener("mousemove",f=>{try{if(se||lt)return;let m=n.getBoundingClientRect(),b=20,w=f.clientX,C=f.clientY,B=w-m.left<=b,A=m.right-w<=b,N=C-m.top<=b,$=m.bottom-C<=b,K="";N&&B||$&&A?K="nwse-resize":N&&A||$&&B?K="nesw-resize":K="",document.body.style.cursor=K}catch{}}),n.addEventListener("mouseleave",()=>{!lt&&!se&&(document.body.style.cursor="")}),window.recalculateTimestampsArea=un,setTimeout(()=>{if(un(),n&&v&&S&&c){let f=40,m=te();if(m.length>0)f=m[0].offsetHeight;else{let b=document.createElement("li");b.style.visibility="hidden",b.style.position="absolute",b.textContent="00:00 Example",c.appendChild(b),f=b.offsetHeight,c.removeChild(b)}R=v.offsetHeight+S.offsetHeight+f,n.style.minHeight=R+"px"}},0),window.addEventListener("resize",un),Qe){try{Qe.disconnect()}catch{}Qe=null}Qe=new ResizeObserver(un),Qe.observe(n),en||document.addEventListener("pointerdown",en=()=>{Fo=Date.now()},!0),tn||document.addEventListener("pointerup",tn=()=>{},!0)}finally{oo=!1}}}async function nr(){if(!n)return;if(document.querySelectorAll("#ytls-pane").forEach(r=>{r!==n&&(l("Removing duplicate pane element from DOM"),r.remove())}),document.body.contains(n)){l("Pane already in DOM, skipping append");return}await er(),typeof Co=="function"&&Co(qo),typeof Xn=="function"&&Xn(Nn),typeof Qn=="function"&&Qn(mo),typeof Io=="function"&&Io(D),await Do(),await Ai(),await Wt(),typeof to=="function"&&to();let o=document.querySelectorAll("#ytls-pane");if(o.length>0&&(l(`WARNING: Found ${o.length} existing pane(s) in DOM, removing all`),o.forEach(r=>r.remove())),document.body.contains(n)){l("ERROR: Pane already in body, aborting append");return}if(document.body.appendChild(n),l("Pane successfully appended to DOM"),ae(),fe&&(clearTimeout(fe),fe=null),fe=setTimeout(()=>{H(),typeof window.recalculateTimestampsArea=="function"&&window.recalculateTimestampsArea(),de(),G(!0),fe=null},450),Xe){try{Xe.disconnect()}catch{}Xe=null}Xe=new MutationObserver(()=>{let r=document.querySelectorAll("#ytls-pane");r.length>1&&(l(`CRITICAL: Multiple panes detected (${r.length}), removing duplicates`),r.forEach((u,y)=>{(y>0||n&&u!==n)&&u.remove()}))}),Xe.observe(document.body,{childList:!0,subtree:!0})}function Ko(t=0){if(document.getElementById("ytls-header-button")){at();return}let o=document.querySelector("#logo");if(!o||!o.parentElement){t<10&&setTimeout(()=>Ko(t+1),300);return}let r=document.createElement("button");r.id="ytls-header-button",r.type="button",r.className="ytls-header-button",nt(r,"Toggle Timekeeper UI"),r.setAttribute("aria-label","Toggle Timekeeper UI");let u=document.createElement("img");u.src=Se,u.alt="",u.decoding="async",r.appendChild(u),ht=u,r.addEventListener("mouseenter",()=>{ht&&(En=!0,ht.src=Be)}),r.addEventListener("mouseleave",()=>{ht&&(En=!1,at())}),r.addEventListener("click",()=>{n&&!document.body.contains(n)&&(l("Pane not in DOM, re-appending before toggle"),document.body.appendChild(n)),po()}),o.insertAdjacentElement("afterend",r),at(),l("Timekeeper header button added next to YouTube logo")}function Zo(){if(W)return;W=!0;let t=history.pushState,o=history.replaceState;function r(){try{let u=new Event("locationchange");window.dispatchEvent(u)}catch{}}history.pushState=function(){let u=t.apply(this,arguments);return r(),u},history.replaceState=function(){let u=o.apply(this,arguments);return r(),u},window.addEventListener("popstate",r),window.addEventListener("locationchange",()=>{window.location.href!==Z&&l("Location changed (locationchange event) \u2014 deferring UI update until navigation finish")})}async function fo(){if(!p()){Gi();return}Z=window.location.href,document.querySelectorAll("#ytls-pane").forEach((o,r)=>{(r>0||n&&o!==n)&&o.remove()}),await pe(),await tr(),ye=co();let t=document.title;l("Page Title:",t),l("Video ID:",ye),l("Current URL:",window.location.href),so(!0),kt(),De(),await _o(),De(),so(!1),l("Timestamps loaded and UI unlocked for video:",ye),await nr(),Ko(),_i()}Zo(),window.addEventListener("yt-navigate-start",()=>{l("Navigation started (yt-navigate-start event fired)"),p()&&n&&c&&(l("Locking UI and showing loading state for navigation"),so(!0))}),Qt=t=>{t.ctrlKey&&t.altKey&&t.shiftKey&&(t.key==="T"||t.key==="t")&&(t.preventDefault(),po(),l("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",Qt),window.addEventListener("yt-navigate-finish",()=>{l("Navigation finished (yt-navigate-finish event fired)"),window.location.href!==Z?fo():l("Navigation finished but URL already handled, skipping.")}),Zo(),l("Timekeeper initialized and waiting for navigation events")})();})();

