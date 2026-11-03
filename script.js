/* ==========================================================================
   WONA OS — engine. You don't need to edit this file; customize config.js.

   FLOW
     1. Dark screen: "Enter the Wonaverse"  ->  profile + password
     2. Home screen appears (widgets + icons) -> update popup (can be closed)
     3. Quiet exploring -> memories popup -> quiet -> Messages notification
     4. Messages app -> your chat + birthday letter -> "version 23.0"
   Power button (bottom right) restarts at any time.
   ========================================================================== */
(() => {
  "use strict";
  const C = CONFIG;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  /* ------------------------------ elements ------------------------------ */
  const desk = $("#desk"), layer = $("#layer"), veil = $("#veil");
  const appEl = $("#app"), balloon = $("#balloon"), toastEl = $("#toast");

  /* ------------------------------- state -------------------------------- */
  const state = {
    popup: null,          // the current guided popup (if any)
    exploring: false,     // true during the quiet phases
    memoriesShown: false,
    taps: 0,              // how many things she has tapped while exploring
    song: 0, playing: false, progress: 0,
    chatRead: {}          // which conversations have finished
  };
  const audio = new Audio();
  let timers = [], toastTimer;

  /* ------------------------------ utilities ----------------------------- */
  const later = (fn, ms) => { timers.push(setTimeout(fn, ms)); };
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
  let chatTimers = [];                                   // typing animation only
  const chatLater = (fn, ms) => { chatTimers.push(setTimeout(fn, ms)); };
  const stopChat = () => { chatTimers.forEach(clearTimeout); chatTimers = []; };
  const hide = (el) => el.classList.add("is-hidden");
  const show = (el) => el.classList.remove("is-hidden");

  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2300);
  }

  /* The home screen is tappable only when nothing "modal" is on top of it.
     This is recalculated from what's actually on screen, so it can never get stuck. */
  function refreshLock() {
    const modalOpen = !veil.classList.contains("is-hidden")
      || !appEl.classList.contains("is-hidden")
      || layer.querySelector(".win:not(.explore)");
    desk.classList.toggle("locked", Boolean(modalOpen));
  }
  new MutationObserver(refreshLock).observe(layer, { childList: true });
  new MutationObserver(refreshLock).observe(appEl, { attributes: true, attributeFilter: ["class"] });
  new MutationObserver(refreshLock).observe(veil, { attributes: true, attributeFilter: ["class"] });

  /* ------------------------ windows & notifications --------------------- */
  function buildWindow({ title, icon, html, buttons = [], cls = "", closable = false, onClose = null }) {
    const w = document.createElement("div");
    w.className = "win " + cls;
    w.innerHTML = `<div class="bar"><span class="t">${sprite(icon)}${title}</span>
      <span class="wb"><i>_</i><i>□</i><i class="x">×</i></span></div>
      <div class="wbody">${html}</div><div class="btns"></div>`;
    w.querySelector(".x").onclick = () => {
      if (!closable) return toast("No closing! Follow the pop-ups.");
      w.remove();
      if (onClose) onClose();
    };
    buttons.forEach(([label, fn, kind]) => addButton(w, label, fn, kind));
    return w;
  }
  function addButton(w, label, fn, kind = "") {
    const b = document.createElement("button");
    b.className = "px " + kind;
    b.textContent = label;
    b.onclick = fn;
    w.querySelector(".btns").append(b);
    return b;
  }

  /** Guided popup: replaces the previous one and shows in the taskbar. */
  function showPopup(opts) {
    closePopup();
    hide(balloon);
    const w = buildWindow(opts);
    layer.append(w);
    state.popup = w;
    $("#task").innerHTML = `<span class="tbtn">${sprite(opts.icon)}${opts.title}</span>`;
    return w;
  }
  function closePopup() {
    if (state.popup) state.popup.remove();
    state.popup = null;
    $("#task").innerHTML = "";
  }
  /** Small closable window that stacks (used by desktop icons and the delete error). */
  function showSmallWindow(opts) {
    const w = buildWindow({ ...opts, closable: true });
    if (opts.cls === "explore") {
      w.style.translate = `${Math.round(Math.random() * 40 - 20)}px ${Math.round(Math.random() * 40 - 20)}px`;
    }
    layer.append(w);
    return w;
  }
  /** Phone-style banner at the top of the screen. */
  function notify(icon, title, text, onTap) {
    closePopup();
    balloon.innerHTML = `${sprite(icon)}<div><b>${title}</b>${text}</div>`;
    show(balloon);
    balloon.onclick = () => { hide(balloon); onTap(); };
    balloon.onkeydown = (e) => { if (e.key === "Enter") balloon.onclick(); };
  }

  /* ============================== FLOW ================================== */

  /* ---- Step 1: dark screen, "Enter the Wonaverse" ---- */
  function intro() {
    Object.assign(state, { exploring: false, memoriesShown: false, taps: 0, song: 0, playing: false, progress: 0, chatRead: {}, sought: false, liveUnlocked: false });
    show(veil); veil.classList.remove("fade");
    hide(appEl); hide(balloon);
    $$(".explore,.fall").forEach((el) => el.remove());
    renderPlayerAndReminders();
    showPopup({
      title: "wonaverse.exe", icon: "heart",
      html: `<h1 class="center">Enter the Wonaverse</h1><p class="center dim">Something is waiting for you.</p>`,
      buttons: [["Enter", profile, "pink"]]
    });
  }

  /* ---- Step 2: profile + password (still on the dark screen) ---- */
  function profile() {
    const P = C.profile;
    const avatar = P.photo ? `<img src="${P.photo}" alt="${P.name}">` : "YOUR<br>PHOTO";
    const w = showPopup({
      title: "profile.exe", icon: "folder",
      html: `
        <div class="prof"><div class="avatar">${avatar}</div><div><h1>${P.name}</h1><p class="dim">${P.title}</p></div></div>
        ${P.facts.map(([a, b]) => `<div class="row"><span class="dim">${a}</span><b>${b}</b></div>`).join("")}
        ${P.stats.map(([a, v]) => `<div class="lbl">${a}</div><div class="prog"><i style="width:${v}%"></i></div>`).join("")}
        <div class="lbl">ENTER PASSWORD</div>
        <input class="field" id="pw" type="password" autocomplete="off" aria-label="Password">
        <p class="msg-err" id="pw-msg"></p><p class="dim">Hint: ${C.passwordHint}</p>`
    });
    const check = () => {
      const field = $("#pw");
      if (field.value.trim().toLowerCase() === C.password.toLowerCase()) return revealHomeScreen();
      $("#pw-msg").textContent = "Wrong password. Try again, queen.";
      field.classList.remove("shake"); void field.offsetWidth; field.classList.add("shake"); field.select();
    };
    addButton(w, "OK", check, "pink");
    $("#pw").addEventListener("keydown", (e) => { if (e.key === "Enter") check(); });
    $("#pw").focus();
  }

  /* ---- Step 3: the dark lifts; the home screen is just there ---- */
  function revealHomeScreen() {
    closePopup();
    veil.classList.add("fade");
    setTimeout(() => hide(veil), 550);
    later(showUpdatePopup, C.timing.updatePopupDelay);
  }
  function showUpdatePopup() {
    showPopup({
      title: "wona_update.exe", icon: "computer",
      html: `<h1 class="center">Wona ${C.age}.0</h1><p class="center dim">A new version is available.<br>Estimated time: one more year.</p>`,
      buttons: [["Later", refuseDelay], ["Update", startExploring, "pink"]],
      closable: true, onClose: startExploring          // the × works too
    });
  }

  /* "Later" is refused: updates can't wait, just like birthdays. */
  function refuseDelay() {
    const err = showSmallWindow({ title: "error.exe", icon: "clock", cls: "err",
      html: `<h1>Sorry!</h1><p>Updates can't be delayed. Just like birthdays, no waiting.</p>` });
    addButton(err, "Okay, fine", () => { err.remove(); startExploring(); }, "pink");
  }

  /* ---- Step 4: quiet phase. She explores widgets + icons ---- */
  function startExploring() {
    closePopup();
    $("#tray-icon").innerHTML = sprite("computer");
    state.exploring = true;
    toast("Updating in the background. Have a look around.");
    later(showMemories, C.timing.memoriesFallback);
  }
  /** Called whenever she taps something while exploring. */
  function countTap() {
    if (!state.exploring || state.memoriesShown) return;
    if (++state.taps === C.timing.tapsBeforeMemories) later(showMemories, 2500);
  }

  /* ---- Step 5: "these memories can't be deleted" ---- */
  function showMemories() {
    if (state.memoriesShown) return;
    state.memoriesShown = true; state.exploring = false;
    hide(appEl);
    $$(".explore").forEach((el) => el.remove());
    let order = C.memories.map((_, i) => i);
    const w = showPopup({
      title: "memories", icon: "folder",
      html: `<h1>These memories can't be deleted</h1><p class="dim" id="pile-hint"></p><div class="pile" id="pile"></div>`,
      buttons: [["Delete all", tryDelete, "danger"], ["Keep forever", keepMemories, "pink"]]
    });
    const draw = () => {
      $("#pile-hint").textContent = `Tap the photos to flip through (${order[0] + 1}/${order.length})`;
      $("#pile").innerHTML = order.slice().reverse().map((i, k, all) => {
        const m = C.memories[i], onTop = k === all.length - 1;
        const photo = m.image ? `<img src="${m.image}" alt="${m.title}">` : "📷<br>YOUR PHOTO";
        return `<div class="card" style="--r:${onTop ? 0 : (k % 2 ? 4 : -5)}deg"><div class="ph">${photo}</div><b>${m.title}</b></div>`;
      }).join("");
    };
    draw();
    // Tap the photos to flip: the top card slides away and goes to the back of the pile.
    let flipping = false;
    $("#pile").onclick = () => {
      if (flipping || order.length < 2) return;
      flipping = true;
      $("#pile").lastElementChild.classList.add("flip");
      setTimeout(() => { order.push(order.shift()); draw(); flipping = false; }, 220);
    };

    function tryDelete() {
      const err = showSmallWindow({ title: "error.exe", icon: "trash", cls: "err", html: `<h1>Sorry!</h1><p>You can't delete these memories. They're permanent.</p>` });
      addButton(err, "OK", () => err.remove(), "pink");
    }
    function keepMemories() {
      closePopup();
      later(() => notify("chat", "Messages", `${C.people.you} sent you a message.`, () => openMessages(true)), C.timing.messageDelay);
    }
  }

  /* ---- Step 6: Messages app (a full screen, not a popup) ----
     Opened from the home-screen "Messages" icon (browse only: earlier messages) or from the
     notification (also unlocks your new messages + birthday letter). */
  function openMessages(unlockLive = false) {
    if (unlockLive) state.liveUnlocked = true;
    $("#task").innerHTML = `<span class="tbtn">${sprite("chat")}messages</span>`;
    show(appEl);
    showConversationList();
  }
  function closeMessages() {
    stopChat(); hide(appEl); $("#task").innerHTML = "";
  }
  function showConversationList() {
    stopChat();
    const lastText = (c) => { const list = c.history || c.messages || []; return list.length ? list[list.length - 1].text : ""; };
    $("#app").innerHTML = `<div class="app-bar"><span>${sprite("chat")}Messages</span><button class="back" id="home" style="margin-left:auto">Home</button></div><div class="convs">` +
      C.conversations.map((c, i) => {
        const fresh = c.priority && state.liveUnlocked;
        const unread = fresh && !state.chatRead[c.id];
        const preview = fresh ? C.birthdayLetter[0] : lastText(c);
        const initial = c.name.replace(/[\[\]]/g, "").charAt(0).toUpperCase();
        return `<button class="conv${unread ? " prio" : ""}" data-i="${i}"><span class="av">${initial}</span>
          <span class="cm"><b>${c.name}</b><span class="pv">${preview}</span></span>${unread ? '<em class="badge">1</em>' : ""}</button>`;
      }).join("") + `</div>`;
    $("#home").onclick = closeMessages;
    $$(".conv").forEach((b) => b.onclick = () => openConversation(Number(b.dataset.i)));
  }
  function openConversation(index) {
    stopChat();
    const c = C.conversations[index];
    $("#app").innerHTML = `<div class="app-bar"><button class="back" id="back">&lt; Back</button><span>${c.name}</span></div>
      <div class="chat" id="chat"></div><div class="app-foot" id="foot"><span class="fake">Type a message...</span></div>`;
    $("#back").onclick = showConversationList;
    const box = $("#chat");

    const bubble = (from, text, extra = "") => ({
      cls: (from === "wona" ? "me" : "") + extra,
      label: c.group && from !== "wona" ? (C.people[from] || from) : "",
      text
    });
    const addBubble = (b) => {
      const el = document.createElement("div");
      el.className = "b " + b.cls;
      el.innerHTML = (b.label ? `<small>${b.label}</small>` : "") + b.text;
      box.append(el); box.scrollTop = box.scrollHeight;
    };
    const letter = bubble("you", C.birthdayLetter.map((p) => `<p>${p}</p>`).join(""), " letter");

    // Earlier conversation: always shown instantly.
    (c.history || c.messages || []).forEach((m) => addBubble(bubble(m.from, m.text)));
    if (!c.priority || !state.liveUnlocked) return;     // before the notification: earlier messages only

    // Your conversation, after the notification: new messages arrive one by one (only from you), then the letter.
    const finish = () => {
      state.chatRead[c.id] = true;
      $("#foot").innerHTML = `<button class="px pink" id="next">Next</button>`;
      $("#next").onclick = showDone;
    };
    const queue = [...c.live.map((t) => bubble("you", t)), letter];
    if (state.chatRead[c.id]) { queue.forEach(addBubble); return finish(); }
    let i = 0;
    (function nextBubble() {
      if (i >= queue.length) return finish();
      const b = queue[i++];
      const dots = document.createElement("div");
      dots.className = "typing"; dots.textContent = "...";
      box.append(dots); box.scrollTop = box.scrollHeight;
      chatLater(() => { dots.remove(); addBubble(b); chatLater(nextBubble, b === letter ? 0 : C.timing.typingDelay); }, C.timing.typingDelay);
    })();
  }

  /* ---- Step 7: update complete ---- */
  function showDone() {
    clearTimers(); stopChat(); hide(appEl);
    showPopup({
      title: "update.exe", icon: "heart", closable: true,
      html: `<div class="center"><h1>Update complete</h1><div class="big">${C.age}.0</div>
        <p>System has been updated.<br>You are officially at version ${C.age}.0.</p>
        <p class="dim">Happy birthday, Jonalyn.</p><p class="dim">Press the power button below to restart.</p></div>`
    });
    $("#power").classList.add("pulse");
    for (let i = 0; i < 16; i++) {
      const f = document.createElement("span");
      f.className = "fall"; f.innerHTML = sprite(i % 2 ? "heart" : "star");
      f.style.left = Math.random() * 95 + "%";
      f.style.animationDuration = 4 + Math.random() * 4 + "s";
      f.style.animationDelay = Math.random() * 3 + "s";
      desk.append(f); setTimeout(() => f.remove(), 11000);
    }
  }

  /* ---- Power button: restart from the beginning, any time ---- */
  function restart() {
    clearTimers(); stopChat(); audio.pause();
    state.popup = null; layer.innerHTML = ""; $("#task").innerHTML = "";
    $("#tray-icon").innerHTML = sprite("chat");
    $("#power").classList.remove("pulse");
    toast("Restarting...");
    intro();
  }

  /* ========================= HOME SCREEN WIDGETS ======================== */

  function renderPlayerAndReminders() {
    if (spCtl) { try { spCtl.destroy(); } catch (e) { /* already gone */ } spCtl = null; }
    $("#widgets").innerHTML = `
      <div class="win wdg"><div class="bar"><span class="t">${sprite("cd")}player.wpl</span></div><div class="wbody">
        <div class="np"><div class="disc paused" id="disc">${sprite("cd")}</div>
          <div><b id="np-title"></b><span class="dim" id="np-artist"></span></div></div>
        <div class="prog"><i id="np-bar"></i></div>
        <div class="ctl">
          <button class="px" id="prev" aria-label="Previous song">|&lt;</button>
          <button class="px pink" id="play" aria-label="Play or pause">&gt;</button>
          <button class="px" id="skip" aria-label="Next song">&gt;|</button></div>
        <div class="sp-wrap is-hidden" id="sp-wrap"><div id="sp-embed"></div></div>
        <ol class="plist">${C.songs.map((s) => `<li>${s.title} <span class="dim">- ${s.artist}</span></li>`).join("")}</ol>
      </div></div>
      <div class="win wdg"><div class="bar"><span class="t">${sprite("clock")}reminders.exe</span></div><div class="wbody">
        ${C.reminders.map(([text, done]) => `<button class="rem"><span class="chk${done ? " on" : ""}"></span>${text}</button>`).join("")}
      </div></div>`;
    $("#prev").onclick = () => { setSong(state.song - 1); if (state.playing) startPlayback(); countTap(); };
    $("#skip").onclick = () => { setSong(state.song + 1); if (state.playing) startPlayback(); countTap(); };
    $("#play").onclick = () => { setPlaying(!state.playing); countTap(); };
    $$("#widgets .rem").forEach((b) => b.onclick = () => { b.querySelector(".chk").classList.toggle("on"); countTap(); });
    setSong(0); setPlaying(false);
  }
  /* ---- Song playback: a file (src) or a Spotify embed (spotify), each with optional start/end seconds ---- */
  let spApi = null, spCtl = null, spUri = "", spMaking = false;
  const audioProblem = (err) => {
    if (err && err.name === "AbortError") return;                       // just switched songs, not a real problem
    if (err && err.name === "NotAllowedError") return toast("Your browser blocked the sound. Tap play again.");
    toast(`Couldn't load "${currentSong().src}". Check the file name and that it's in the audio folder.`);
  };
  audio.addEventListener("error", () => audioProblem());
  const currentSong = () => C.songs[state.song];
  const usesSpotify = (s) => !s.src && s.spotify;                    // a file always wins over Spotify
  const spotifyUri = (v) => {                                        // accepts a track link, URI or bare ID
    const m = String(v).match(/track[/:]([A-Za-z0-9]{22})/) || String(v).match(/^([A-Za-z0-9]{22})$/);
    return m ? "spotify:track:" + m[1] : String(v);
  };

  function setSong(i) {
    state.song = (i + C.songs.length) % C.songs.length; state.progress = 0; state.sought = false;
    const s = currentSong();
    $("#np-title").textContent = s.title; $("#np-artist").textContent = s.artist; $("#np-bar").style.width = "0%";
    $$(".plist li").forEach((li, k) => li.classList.toggle("cur", k === state.song));
    $("#sp-wrap").classList.toggle("is-hidden", !usesSpotify(s));
    if (s.src) {
      if (spCtl) spCtl.pause();
      audio.src = s.src;
      audio.onloadedmetadata = () => { if (s.start) audio.currentTime = s.start; };
    } else audio.pause();
    if (usesSpotify(s)) loadSpotify(spotifyUri(s.spotify));
  }
  function startPlayback() {
    const s = currentSong();
    if (s.src) audio.play().catch(audioProblem);
    else if (usesSpotify(s)) setTimeout(() => { if (spCtl && state.playing) spCtl.resume(); }, 350);
  }
  function setPlaying(on) {
    state.playing = on;
    paintPlayButton(on);
    if (on) startPlayback(); else { audio.pause(); if (spCtl) spCtl.pause(); }
  }
  function paintPlayButton(on) {
    $("#play").textContent = on ? "||" : ">";
    $("#disc").classList.toggle("paused", !on);
  }
  const nextSong = () => { setSong(state.song + 1); if (state.playing) startPlayback(); };
  audio.addEventListener("ended", nextSong);

  /* Spotify embed (loaded only if a song uses it) */
  function loadSpotify(uri) {
    spUri = uri;
    if (spCtl) return spCtl.loadUri(uri);
    const make = () => {
      if (spMaking) return;
      spMaking = true;
      spApi.createController($("#sp-embed"), { uri: spUri, width: "100%", height: 80 }, (ctl) => {
        spCtl = ctl; spMaking = false;
        ctl.addListener("playback_update", onSpotifyUpdate);
        if (state.playing) ctl.resume();
      });
    };
    if (spApi) return make();
    window.onSpotifyIframeApiReady = (api) => { spApi = api; make(); };
    if (!document.getElementById("sp-api")) {
      const tag = document.createElement("script");
      tag.id = "sp-api"; tag.async = true; tag.src = "https://open.spotify.com/embed/iframe-api/v1";
      tag.onerror = () => { state.spFailed = true; toast("Spotify couldn't load. Use an audio file (src) for this song."); };
      document.body.append(tag);
    }
  }
  function onSpotifyUpdate(e) {
    const { position, duration, isPaused } = e.data;                 // milliseconds
    const s = currentSong(), start = (s.start || 0) * 1000, end = s.end ? s.end * 1000 : duration;
    if (!usesSpotify(s)) return;
    if (state.playing === isPaused) { state.playing = !isPaused; paintPlayButton(state.playing); }   // she used Spotify's own button
    if (!isPaused && !state.sought) {                                // jump to the start time once
      state.sought = true;
      if (start && position < start - 1500) return spCtl.seek(s.start);
    }
    if (!isPaused && end && position >= end) return nextSong();      // reached the end time
    state.progress = end > start ? ((position - start) / (end - start)) * 100 : 0;
    $("#np-bar").style.width = Math.max(0, Math.min(100, state.progress)) + "%";
  }

  // Progress bar for audio files (and a pretend timer for songs with neither file nor Spotify).
  setInterval(() => {
    const bar = $("#np-bar");
    if (!state.playing || !bar) return;
    const s = currentSong();
    if (usesSpotify(s) && !state.spFailed) return;                   // Spotify updates the bar itself
    if (s.src && audio.duration) {
      const start = s.start || 0, end = s.end || audio.duration;
      if (audio.currentTime >= end) return nextSong();
      state.progress = ((audio.currentTime - start) / (end - start)) * 100;
    } else state.progress += 1;
    if (state.progress >= 100 && !s.src) return nextSong();
    bar.style.width = Math.max(0, Math.min(100, state.progress)) + "%";
  }, 300);

  /* ======================= DESKTOP ICONS + TASKBAR ===================== */

  const opensMessages = (icon) => icon[3] === "messages" || String(icon[1]).toLowerCase() === "messages";
  $("#icons").innerHTML = C.desktopIcons.map(([sp, label], i) =>
    `<button class="icon" data-i="${i}">${sprite(sp)}<span>${label}</span></button>`).join("");
  $("#icons").addEventListener("click", (e) => {
    const b = e.target.closest(".icon"); if (!b) return;
    const icon = C.desktopIcons[b.dataset.i];
    if (opensMessages(icon)) { openMessages(); countTap(); return; }     // browse the Messages app
    const [sp, label, text] = icon;
    const w = showSmallWindow({ title: label, icon: sp, cls: "explore", html: `<p>${text}</p>` });
    addButton(w, "OK", () => w.remove());
    countTap();
  });

  $("#start").innerHTML = `${sprite("heart")}start`;
  $("#start").onclick = () => toast("Nice try. Follow the pop-ups.");
  $("#power").innerHTML = sprite("power");
  $("#power").onclick = restart;
  $("#tray-icon").innerHTML = sprite("chat");
  const updateClock = () => { $("#clock").textContent = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); };
  updateClock(); setInterval(updateClock, 20000);

  intro();   // go!
})();