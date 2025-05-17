// ==UserScript==
// @name         YouTube Timestamp Tool by Vat5aL
// @namespace    http://tampermonkey.net/
// @updateURL https://openuserjs.org/meta/Vat5aL/YouTube_Timestamp_Tool_by_Vat5aL.meta.js
// @downloadURL https://openuserjs.org/install/Vat5aL/YouTube_Timestamp_Tool_by_Vat5aL.user.js
// @version      1.1
// @description  Enhanced timestamp tool for YouTube videos
// @author       Vat5aL
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// ==/UserScript==

(function () {
  'use strict';

  function formatTime(e, t) {
    var n, a = Math.floor(t / 3600), o = Math.floor(t / 60) % 60, i = Math.floor(t) % 60;
    e.textContent = (a ? a + ":" + String(o).padStart(2, "0") : o) + ":" + String(i).padStart(2, "0");
    e.dataset.time = t;
    var vid = location.search.split(/.+v=|&/)[1] || location.href.split(/\/live\/|\/shorts\/|\?|&/)[1];
    e.href = "https://youtu.be/" + vid + "?t=" + t;
  }

  function parseTimeRange(str) {
    var matches = str.match(/(\d*:*\d+):(\d+)(?:\s*[-–]\s*)(\d*:*\d+):(\d+)/);
    if (!matches) return null;
    var startParts = matches[1].split(':').map(Number),
      startSec = parseInt(matches[2]),
      endParts = matches[3].split(':').map(Number),
      endSec = parseInt(matches[4]);
    var startMin = startParts.length === 1 ? startParts[0] : startParts[0] * 60 + startParts[1],
      endMin = endParts.length === 1 ? endParts[0] : endParts[0] * 60 + endParts[1];
    return { start: startMin * 60 + startSec, end: endMin * 60 + endSec };
  }

  function parseCopiedFormat(str) {
    var matches = str.match(/^(?:.*?\?v=[^&\s]+&.*?\s)?(\d*:*\d+:\d+)\s*-\s*(\d*:*\d+:\d+)\s*"(.+)"$/);
    if (!matches) return null;
    var startParts = matches[1].split(':').map(Number),
      endParts = matches[2].split(':').map(Number),
      comment = matches[3];
    var startMin = startParts.length === 2 ? startParts[0] : startParts[0] * 60 + startParts[1],
      startSec = startParts.length === 2 ? startParts[1] : startParts[2],
      endMin = endParts.length === 2 ? endParts[0] : endParts[0] * 60 + endParts[1],
      endSec = endParts.length === 2 ? endParts[1] : endParts[2];
    return { start: startMin * 60 + startSec, end: endMin * 60 + endSec, comment: comment };
  }

  function handleClick(e) {
    if (e.target.dataset.time) {
      e.preventDefault();
      document.querySelector("video").currentTime = e.target.dataset.time;
    } else if (e.target.dataset.increment) {
      e.preventDefault();
      var t = e.target.parentElement.querySelector('a[data-time]');
      var currTime = parseInt(t.dataset.time);
      formatTime(t, Math.max(0, currTime + parseInt(e.target.dataset.increment)));
    } else if (e.target.dataset.action === "clear") {
      e.preventDefault();
      list.textContent = "";
      updateSeekbarMarkers();
      updateScroll();
      saveTimestamps();
    }
  }

  function addTimestamp(e, t) {
    var li = document.createElement("li"), timeRow = document.createElement("div"), minus = document.createElement("span"),
      plus = document.createElement("span"), a = document.createElement("a"),
      commentInput = document.createElement("input"), del = document.createElement("button");

    timeRow.className = "time-row";
    minus.textContent = "➖"; minus.dataset.increment = -1; minus.style.cursor = "pointer";
    plus.textContent = "➕"; plus.dataset.increment = 1; plus.style.cursor = "pointer";
    formatTime(a, e);
    commentInput.value = t || "";
    commentInput.style = "width:200px;margin-top:5px;display:block;";
    commentInput.addEventListener("input", saveTimestamps); // Save timestamps on comment edit
    del.textContent = "🗑️"; del.style = "background:transparent;border:none;color:white;cursor:pointer;margin-left:5px;";
    del.onclick = () => { li.remove(); updateSeekbarMarkers(); updateScroll(); saveTimestamps(); };

    timeRow.append(minus, plus, a, del);
    li.append(timeRow, commentInput);
    li.style = "display:flex;flex-direction:column;gap:5px;padding:5px;background:rgba(255,255,255,0.05);border-radius:3px;";
    list.appendChild(li);
    updateScroll();
    updateSeekbarMarkers();
    saveTimestamps();
    return commentInput;
  }

  function updateScroll() {
    var tsCount = list.children.length;
    if (tsCount > 2) {
      list.style.maxHeight = "200px";
      list.style.overflowY = "auto";
    } else {
      list.style.maxHeight = "none";
      list.style.overflowY = "hidden";
    }
  }

  function updateSeekbarMarkers() {
    var video = document.querySelector("video");
    var progressBar = document.querySelector(".ytp-progress-bar");
    if (!video || !progressBar || !isFinite(video.duration)) return;

    var existingMarkers = document.querySelectorAll(".ytls-marker");
    existingMarkers.forEach(marker => marker.remove());

    var timestamps = Array.from(list.children).map(li => {
        var startLink = li.querySelector('a[data-time]');
        var comment = li.querySelector('input').value;
        var startTime = parseInt(startLink.dataset.time);
        return { start: startTime, comment: comment };
    });

    timestamps.forEach(ts => {
        if (ts.start) {
            var marker = document.createElement("div");
            marker.className = "ytls-marker";
            marker.style.position = "absolute";
            marker.style.height = "100%";
            marker.style.width = "2px";
            marker.style.backgroundColor = "#ff0000";
            marker.style.cursor = "pointer";
            marker.style.left = (ts.start / video.duration * 100) + "%";
            marker.dataset.time = ts.start;
            marker.addEventListener("click", () => video.currentTime = ts.start);
            progressBar.appendChild(marker);
        }
    });
  }

  function resetCopy() { isCopyList = true; copyBtn.textContent = "Copy List"; }

  function importTimestamps(text) {
    var lines = text.split("\n").map(line => line.trim()).filter(line => line);
    var i = 0;
    while (i < lines.length) {
      var copiedMatch = parseCopiedFormat(lines[i]);
      if (copiedMatch) {
        var start = copiedMatch.start, comment = copiedMatch.comment;
        addTimestamp(start, comment);
        i++;
      } else {
        var timeMatch = lines[i].match(/(\d*:*\d+:\d+)(?:\s*[-–]\s*)(\d*:*\d+:\d+)?/);
        if (timeMatch) {
          var timeRange = parseTimeRange(lines[i]);
          var start = timeRange ? timeRange.start : parseTime(lines[i]);
          var comment = "";
          i++;
          while (i < lines.length && !lines[i].match(/(\d*:*\d+:\d+)(?:\s*[-–]\s*)(\d*:*\d+:\d+)/) && !parseCopiedFormat(lines[i])) {
            comment += (comment ? " " : "") + lines[i];
            i++;
          }
          addTimestamp(start, comment);
        } else {
          i++;
        }
      }
    }
    updateScroll();
    updateSeekbarMarkers();
  }

  function saveTimestamps() {
    const videoId = getVideoId();
    if (!videoId) return;

    const timestamps = Array.from(list.children).map(li => {
        const startLink = li.querySelector('a[data-time]');
        const comment = li.querySelector('input').value;
        const startTime = parseInt(startLink.dataset.time);
        return { start: startTime, comment: comment };
    });

    localStorage.setItem(`ytls-${videoId}`, JSON.stringify(timestamps));
  }

  function loadTimestamps() {
    const videoId = getVideoId();
    if (!videoId) return;

    const savedTimestamps = localStorage.getItem(`ytls-${videoId}`);
    if (!savedTimestamps) return;

    const timestamps = JSON.parse(savedTimestamps);
    timestamps.forEach(ts => {
        addTimestamp(ts.start, ts.comment);
    });

    // Automatically open the tool if timestamps are loaded
    pane.classList.remove("minimized");
  }

  function getVideoId() {
    return document.querySelector('meta[itemprop="identifier"]').content;
  }

  if (!document.querySelector("#ytls-pane")) {
    var pane = document.createElement("div"), header = document.createElement("div"), close = document.createElement("span"),
      list = document.createElement("ul"), textarea = document.createElement("textarea"), btns = document.createElement("div"),
      importBtn = document.createElement("button"), addBtn = document.createElement("button"), isCopyList = true,
      copyBtn = document.createElement("button"), clearBtn = document.createElement("button"), timeDisplay = document.createElement("span"),
      credit = document.createElement("span"), style = document.createElement("style"), minimizeBtn = document.createElement("button");

    pane.id = "ytls-pane";
    pane.classList.add("minimized");
    header.style = "display:flex;justify-content:space-between;align-items:center;padding-bottom:5px;padding-left:20px;";
    timeDisplay.id = "ytls-current-time"; timeDisplay.textContent = "CT: "; timeDisplay.style = "color:white;font-size:14px;";
    close.textContent = "×"; close.style = "cursor:pointer;font-size:18px;margin-left:5px;";
    credit.textContent = "Made By Vat5aL"; credit.style = "color:white;font-size:12px;margin-left:5px;";
    minimizeBtn.textContent = "▶️"; minimizeBtn.style = "background:transparent;border:none;color:white;cursor:pointer;font-size:16px;position:absolute;top:5px;left:5px;";
    minimizeBtn.id = "ytls-minimize";
    function updateTime() {
      var v = document.querySelector("video");
      if (v) {
        var t = Math.floor(v.currentTime), h = Math.floor(t / 3600), m = Math.floor(t / 60) % 60, s = t % 60;
        timeDisplay.textContent = `CT: ${h ? h + ":" + String(m).padStart(2, "0") : m}:${String(s).padStart(2, "0")}`;
      }
      requestAnimationFrame(updateTime);
    }
    updateTime();
    textarea.id = "ytls-box";
    btns.id = "ytls-buttons";
    importBtn.textContent = "Import List";
    addBtn.textContent = "Add TS";
    copyBtn.textContent = "Copy List";
    clearBtn.textContent = "Clear"; clearBtn.dataset.action = "clear"; clearBtn.style = "background:#555;color:white;font-size:12px;padding:5px 10px;border:none;border-radius:5px;cursor:pointer;";
    style.textContent = "#ytls-pane{background:rgba(0,0,0,0.8);text-align:right;position:fixed;bottom:0;right:0;padding:10px;border-radius:10px 0 0 0;opacity:0.9;z-index:5000;font-family:Arial,sans-serif;width:300px;}#ytls-pane.minimized{width:30px;height:30px;overflow:hidden;background:rgba(0,0,0,0.8);padding:0;}#ytls-pane.minimized #ytls-content{display:none;}#ytls-pane.minimized #ytls-minimize{display:block;}#ytls-pane:hover{opacity:1;}#ytls-pane ul{list-style:none;padding:0;margin:0;}#ytls-pane li{display:flex;flex-direction:column;gap:5px;margin:5px 0;background:rgba(255,255,255,0.05);padding:5px;border-radius:3px;}#ytls-pane .time-row{display:flex;gap:5px;align-items:center;}#ytls-pane .ytls-marker{position:absolute;height:100%;width:2px;background-color:#ff0000;cursor:pointer;}#ytls-pane .ytls-marker.end{background-color:#00ff00;}#ytls-pane .ytls-ts-bar{position:absolute;height:100%;background-color:rgba(255,255,0,0.3);cursor:pointer;}#ytls-pane span,#ytls-pane a,#ytls-pane input{background:none;color:white;font-family:inherit;font-size:14px;text-decoration:none;border:none;outline:none;}#ytls-box{font-family:monospace;width:100%;display:block;padding:5px;border:none;outline:none;resize:none;background:rgba(255,255,255,0.1);color:white;border-radius:5px;}#ytls-buttons{display:flex;gap:5px;justify-content:space-between;margin-top:10px;}#ytls-buttons button{background:rgba(255,255,255,0.1);color:white;font-size:12px;padding:5px 10px;border:none;border-radius:5px;cursor:pointer;}#ytls-buttons button:hover{background:rgba(255,255,255,0.2);}";

    close.onclick = () => { if (confirm("Close timestamp tool?")) pane.remove(); };
    minimizeBtn.onclick = () => pane.classList.toggle("minimized");
    list.onclick = (e) => {
      handleClick(e);
      saveTimestamps();
    };
    list.ontouchstart = (e) => {
      handleClick(e);
      saveTimestamps();
    };
    importBtn.onclick = () => {
      var text = textarea.value;
      importTimestamps(text);
    };
    addBtn.onclick = () => {
      var timeStampBuffer = 2;
      var input = addTimestamp(Math.max(0, Math.floor(document.querySelector("video").currentTime - timeStampBuffer)));
      input.focus();
      saveTimestamps();
    };
    copyBtn.onclick = () => {
      var url = location.href;
      var text = url + "\n";
      if (isCopyList) {
        isCopyList = false; copyBtn.textContent = "Copy Links";
        setTimeout(resetCopy, 500);
        for (var i = 0; i < list.children.length; i++) {
          var start = list.children[i].querySelector('a[data-time]').textContent,
            comment = list.children[i].querySelector('input').value;
          text += (i ? "\n" : "") + `${start} "${comment}"`;
        }
      } else {
        resetCopy();
        for (var j = 0; j < list.children.length; j++) {
          var commentText = list.children[j].querySelector('input').value,
            tsUrl = list.children[j].querySelector('a[data-time]').href;
          text += (j ? "\n" : "") + `${commentText} ${tsUrl}`;
        }
      }
      textarea.value = text; textarea.select(); document.execCommand("copy");
    };

    header.append(timeDisplay, credit, close);
    var content = document.createElement("div"); content.id = "ytls-content";
    content.append(header, list, textarea, btns);
    pane.append(minimizeBtn, content, style);
    btns.append(importBtn, addBtn, copyBtn, clearBtn);
    document.body.appendChild(pane);
    loadTimestamps();
    updateSeekbarMarkers();
  }
})();
