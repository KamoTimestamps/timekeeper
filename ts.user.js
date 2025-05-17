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
// @run-at       document-end
// @license MIT
// ==/UserScript==

(function () {
  'use strict';

  function clearTimestampsDisplay() {
    while (list.firstChild) { // Clear the existing timestamps
      list.removeChild(list.firstChild);
    }
  }

  // Helper function to format time in HH:MM:SS
  function formatTimeString(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function formatTime(e, t) {
    e.textContent = formatTimeString(t);
    e.dataset.time = t;
    const vid = location.search.split(/.+v=|&/)[1] || location.href.split(/\/live\/|\/shorts\/|\?|&/)[1];
    e.href = "https://youtu.be/" + vid + "?t=" + t;
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

    // Insert the new timestamp in the correct order
    let inserted = false;
    for (let i = 0; i < list.children.length; i++) {
      const existingTime = parseInt(list.children[i].querySelector('a[data-time]').dataset.time);
      if (e < existingTime) {
        list.insertBefore(li, list.children[i]);
        inserted = true;
        break;
      }
    }
    if (!inserted) {
      list.appendChild(li); // Append to the end if no earlier timestamp is found
    }

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

  function saveTimestamps() {
    const videoId = getVideoId();
    if (!videoId) return;

    const timestamps = Array.from(list.children).map(li => {
      const startLink = li.querySelector('a[data-time]');
      const comment = li.querySelector('input').value;
      const startTime = parseInt(startLink.dataset.time);
      return { start: startTime, comment: comment };
    });

    if (timestamps.length === 0) {
      // If there are no timestamps, remove the local storage entry
      localStorage.removeItem(`ytls-${videoId}`);
    } else {
      // Otherwise, save the timestamps to local storage
      localStorage.setItem(`ytls-${videoId}`, JSON.stringify(timestamps));
    }
  }

  function saveTimestampsAs(format) {
    const videoId = getVideoId();
    if (!videoId) return;

    const timestamps = Array.from(list.children).map(li => {
      const startLink = li.querySelector('a[data-time]');
      const comment = li.querySelector('input').value;
      const startTime = parseInt(startLink.dataset.time);
      return { start: startTime, comment: comment };
    });

    if (format === "json") {
      const blob = new Blob([JSON.stringify(timestamps, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `timestamps-${videoId}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === "text") {
      const plainText = timestamps.map(ts => `${formatTimeString(ts.start)} ${ts.comment}`).join("\n");
      const blob = new Blob([plainText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `timestamps-${videoId}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  function loadTimestamps() {
    console.log(`loadTimestamps start`);
    const videoId = getVideoId();
    if (!videoId) return;
    console.log(`loadTimestamps for ${videoId}`);

    const savedTimestamps = localStorage.getItem(`ytls-${videoId}`);
    if (!savedTimestamps) return;

    const timestamps = JSON.parse(savedTimestamps);
    timestamps.forEach(ts => {
      addTimestamp(ts.start, ts.comment);
    });

    // Automatically open the tool if timestamps are loaded
    pane.classList.remove("minimized");
    updateSeekbarMarkers();
  }

  function getVideoId() {
    // Try to get the video ID from the URL first
    const urlParams = new URLSearchParams(location.search);
    const videoId = urlParams.get("v");
    if (videoId) {
      return videoId; // Return the video ID if found in the URL
    }

    // Fallback to the clip method using the meta property
    const clipIdMeta = document.querySelector('meta[itemprop="identifier"]');
    if (clipIdMeta) {
      return clipIdMeta.content; // Return the clip identifier if available
    }

    // Return null if no video ID or clip identifier is found
    return null;
  }

  if (!document.querySelector("#ytls-pane")) {
    var pane = document.createElement("div"), header = document.createElement("div"), close = document.createElement("span"),
      list = document.createElement("ul"), btns = document.createElement("div"),
      addBtn = document.createElement("button"),
      timeDisplay = document.createElement("span"),
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
    btns.id = "ytls-buttons";
    addBtn.textContent = " 🆕 Add TS";
    addBtn.style = "background:#555;color:white;font-size:12px;padding:5px 10px;border:none;border-radius:5px;cursor:pointer;";

    // Add a save button to the buttons section
    var saveBtn = document.createElement("button");
    saveBtn.textContent = "💾 Save";
    saveBtn.style = "background:#555;color:white;font-size:12px;padding:5px 10px;border:none;border-radius:5px;cursor:pointer;";
    saveBtn.onclick = () => {
      // Create a styled modal for the save format choice
      const modal = document.createElement("div");
      modal.style = "position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);background:#333;padding:20px;border-radius:10px;z-index:10000;color:white;text-align:center;width:300px;box-shadow:0 0 10px rgba(0,0,0,0.5);";

      const message = document.createElement("p");
      message.textContent = "Save as:";
      message.style = "margin-bottom:15px;font-size:16px;";

      const jsonButton = document.createElement("button");
      jsonButton.textContent = "JSON";
      jsonButton.style = "background:#555;color:white;padding:10px 20px;border:none;border-radius:5px;cursor:pointer;margin-right:10px;";
      jsonButton.onclick = () => {
        saveTimestampsAs("json");
        document.body.removeChild(modal);
      };

      const textButton = document.createElement("button");
      textButton.textContent = "Plain Text";
      textButton.style = "background:#555;color:white;padding:10px 20px;border:none;border-radius:5px;cursor:pointer;";
      textButton.onclick = () => {
        saveTimestampsAs("text");
        document.body.removeChild(modal);
      };

      const cancelButton = document.createElement("button");
      cancelButton.textContent = "Cancel";
      cancelButton.style = "background:#444;color:white;padding:10px 20px;border:none;border-radius:5px;cursor:pointer;margin-top:15px;display:block;width:100%;";
      cancelButton.onclick = () => {
        document.body.removeChild(modal);
      };

      modal.appendChild(message);
      modal.appendChild(jsonButton);
      modal.appendChild(textButton);
      modal.appendChild(cancelButton);
      document.body.appendChild(modal);
    };

    // Append the save button to the buttons section
    btns.appendChild(saveBtn);

    // Add a load button to the buttons section
    var loadBtn = document.createElement("button");
    loadBtn.textContent = "📂 Load";
    loadBtn.style = "background:#555;color:white;font-size:12px;padding:5px 10px;border:none;border-radius:5px;cursor:pointer;";
    loadBtn.onclick = () => {
      // Create a hidden file input element
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".json,.txt"; // Accept JSON and plain text files
      fileInput.style = "display:none;";

      fileInput.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
          const content = reader.result.trim();

          if (file.name.endsWith(".json")) {
            // Handle JSON input
            try {
              const timestamps = JSON.parse(content);
              if (Array.isArray(timestamps)) {
                clearTimestampsDisplay();
                updateSeekbarMarkers();
                timestamps.forEach(ts => addTimestamp(ts.start, ts.comment));
                saveTimestamps();
                updateSeekbarMarkers();
                updateScroll();
                alert("Timestamps loaded successfully!");
              } else {
                throw new Error("Invalid JSON format");
              }
            } catch (e) {
              alert("Failed to parse JSON file. Please ensure it is in the correct format.");
            }
          } else if (file.name.endsWith(".txt")) {
            // Handle plain text input
            const lines = content.split("\n").map(line => line.trim()).filter(line => line);
            if (lines.length > 0) {
              clearTimestampsDisplay();
              updateSeekbarMarkers();
              lines.forEach(line => {
                const match = line.match(/^(\d{2}:\d{2}:\d{2})\s+(.*)$/);
                if (match) {
                  const timeParts = match[1].split(":").map(Number);
                  const start = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
                  const comment = match[2];
                  addTimestamp(start, comment);
                }
              });
              saveTimestamps();
              updateSeekbarMarkers();
              updateScroll();
              alert("Timestamps loaded successfully!");
            } else {
              alert("The text file is empty or not in the correct format.");
            }
          } else {
            alert("Unsupported file type. Please upload a .json or .txt file.");
          }
        };

        reader.readAsText(file);
      };

      // Trigger the file input dialog
      fileInput.click();
    };

    // Append the load button to the buttons section
    btns.appendChild(loadBtn);

    style.textContent = "#ytls-pane{background:rgba(0,0,0,0.8);text-align:right;position:fixed;bottom:0;right:0;padding:10px;border-radius:10px 0 0 0;opacity:0.9;z-index:5000;font-family:Arial,sans-serif;width:300px;}#ytls-pane.minimized{width:30px;height:30px;overflow:hidden;background:rgba(0,0,0,0.8);padding:0;}#ytls-pane.minimized #ytls-content{display:none;}#ytls-pane.minimized #ytls-minimize{display:block;}#ytls-pane:hover{opacity:1;}#ytls-pane ul{list-style:none;padding:0;margin:0;}#ytls-pane li{display:flex;flex-direction:column;gap:5px;margin:5px 0;background:rgba(255,255,255,0.05);padding:5px;border-radius:3px;}#ytls-pane .time-row{display:flex;gap:5px;align-items:center;}#ytls-pane .ytls-marker{position:absolute;height:100%;width:2px;background-color:#ff0000;cursor:pointer;}#ytls-pane .ytls-marker.end{background-color:#00ff00;}#ytls-pane .ytls-ts-bar{position:absolute;height:100%;background-color:rgba(255,255,0,0.3);cursor:pointer;}#ytls-pane span,#ytls-pane a,#ytls-pane input{background:none;color:white;font-family:inherit;font-size:14px;text-decoration:none;border:none;outline:none;}#ytls-buttons{display:flex;gap:5px;justify-content:space-between;margin-top:10px;}#ytls-buttons button{background:rgba(255,255,255,0.1);color:white;font-size:12px;padding:5px 10px;border:none;border-radius:5px;cursor:pointer;}#ytls-buttons button:hover{background:rgba(255,255,255,0.2);}";

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
    addBtn.onclick = () => {
      var timeStampBuffer = 2;
      var input = addTimestamp(Math.max(0, Math.floor(document.querySelector("video").currentTime - timeStampBuffer)));
      input.focus();
      saveTimestamps();
    };


    header.append(timeDisplay, credit, close);
    var content = document.createElement("div"); content.id = "ytls-content";
    content.append(header, list, btns);
    pane.append(minimizeBtn, content, style);
    btns.append(addBtn);
    document.body.appendChild(pane);
    loadTimestamps();
    updateSeekbarMarkers();
  }

  // Add a function to handle URL changes
  const handleUrlChange = () => {
    const currentVideoId = getVideoId();
    const pageTitle = document.title; // Get the current page title
    console.log("Page Title:", pageTitle); // Log the page title
    console.log("Video ID:", currentVideoId); // Log the video ID
    console.log(window.location.href);

    clearTimestampsDisplay();
    updateSeekbarMarkers();

    if (currentVideoId) {
      const savedTimestamps = localStorage.getItem(`ytls-${currentVideoId}`);
      if (savedTimestamps) {
        console.log(`Found saved timestamps for ${currentVideoId}`);
        // If timestamps exist for the new video, load them
        if (!document.body.contains(pane)) {
          document.body.appendChild(pane); // Re-add the pane if it was removed
        }
        loadTimestamps(); // Load timestamps for the new video
        pane.classList.remove("minimized"); // Ensure the pane is not minimized
      } else {
        console.log(`No saved timestamps for ${currentVideoId}`);
        // If no timestamps exist, minimize the timestamper
        pane.classList.add("minimized");
      }
    } else {
      console.log(`No video id found`);
      // If no valid video ID is found, minimize the timestamper
      pane.classList.add("minimized");
    }
  };

  // Override `pushState` and `replaceState` to detect URL changes
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    handleUrlChange(); // Handle URL change
  };

  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    handleUrlChange(); // Handle URL change
  };

  // Listen for the `popstate` event (triggered by browser navigation)
  window.addEventListener("popstate", handleUrlChange);
  window.addEventListener("yt-navigate-finish", handleUrlChange);
  window.addEventListener("yt-navigate-start", handleUrlChange);

  // Use a MutationObserver to detect changes in the <title> element
  const titleObserver = new MutationObserver(() => {
    handleUrlChange(); // Handle URL change when the title changes
  });

  // Start observing the <title> element for changes
  titleObserver.observe(document.querySelector('title'), { childList: true });

  // Initial call to handle the current URL
  handleUrlChange();
})();
