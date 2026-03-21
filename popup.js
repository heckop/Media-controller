/* global browser */
const tablist = document.getElementById("tabs");
const template = document.getElementById("media-card-template");
let isDragging = false;
let activeCards = new Map();

async function refreshMedia() {
  const tabs = await browser.tabs.query({ status: "complete" });
  if (tablist.children.length === 0 || tablist.querySelector('#empty-state')) tablist.textContent = "";

  for (const tab of tabs) {
    try {
      const res = await browser.tabs.sendMessage(tab.id, { cmd: "query" });
      if (res && res.length > 0) {
        for (const e of res) {
          const cardId = `card-${tab.id}-${e.id}`;
          let card = document.getElementById(cardId);

          if (!card) {
            const cardObj = template.content.cloneNode(true);
            card = cardObj.querySelector('.media-card');
            card.id = cardId;
            card.querySelector('.favicon').src = tab.favIconUrl || "";
            card.querySelector('.site-title').textContent = new URL(tab.url).hostname;
            
            card.querySelector('.focus-btn').onclick = () => browser.tabs.highlight({ tabs: [tab.index] });
            card.querySelector('.pip-btn').onclick = async () => {
              const currentTab = await browser.tabs.get(tab.id);
              if (!currentTab.active) browser.tabs.sendMessage(tab.id, { cmd: "pip", id: e.id });
            };

            card.querySelector('.prev-btn').onclick = () => browser.tabs.sendMessage(tab.id, { cmd: "prevTrack", id: e.id });
            card.querySelector('.next-btn').onclick = () => browser.tabs.sendMessage(tab.id, { cmd: "nextTrack", id: e.id });
            
            card.querySelector('.mute-btn').onclick = async () => {
              const t = await browser.tabs.get(tab.id);
              browser.tabs.update(tab.id, { muted: !t.mutedInfo.muted });
            };

            card.querySelector('.play-pause-btn').onclick = () => {
              const cmd = card.querySelector('.play-pause-btn').textContent === "▶" ? "play" : "pause";
              browser.tabs.sendMessage(tab.id, { cmd: cmd, id: e.id });
            };

            const pb = card.querySelector('.progress-bar');
            pb.onmousedown = () => { isDragging = true; };
            pb.onmouseup = () => { isDragging = false; };
            pb.oninput = (evt) => browser.tabs.sendMessage(tab.id, { cmd: "currentTime", id: e.id, currentTime: parseFloat(evt.target.value) });

            const vb = card.querySelector('.volume-bar');
            vb.oninput = (evt) => browser.tabs.sendMessage(tab.id, { cmd: "volume", id: e.id, volume: evt.target.value / 100 });

            tablist.appendChild(card);
          }

          // Interpolation data
          activeCards.set(cardId, {
            playing: e.playing,
            currentTime: e.currentTime,
            duration: e.duration,
            lastUpdated: Date.now()
          });

          // Visuals
          const imgEl = card.querySelector('.cover-art');
          if (imgEl.src !== (e.poster || "audio.jpeg")) imgEl.src = e.poster || "audio.jpeg";
          if (e.bgcolor) card.style.background = `linear-gradient(135deg, rgba(${e.bgcolor.join(",")}, 0.35) 0%, #292a2d 100%)`;

          if (!isDragging) {
            const progressBar = card.querySelector('.progress-bar');
            progressBar.max = e.duration;
            progressBar.value = e.currentTime;
          }
          card.querySelector('.play-pause-btn').textContent = e.playing ? "⏸" : "▶";
          card.querySelector('.media-title').textContent = e.mediaTitle || tab.title;
          card.querySelector('.media-artist').textContent = e.mediaArtist || "";
          card.querySelector('.mute-btn').textContent = tab.mutedInfo.muted ? "🔇" : "🔊";
          card.querySelector('.volume-bar').value = e.volume * 100;
        }
      }
    } catch (err) {}
  }
}

function smoothUpdate() {
  if (isDragging) return;
  activeCards.forEach((state, cardId) => {
    const card = document.getElementById(cardId);
    if (card && state.playing) {
      const pb = card.querySelector('.progress-bar');
      const elapsed = (Date.now() - state.lastUpdated) / 1000;
      const newPos = state.currentTime + elapsed;
      if (newPos <= state.duration) pb.value = newPos;
    }
  });
}

refreshMedia();
setInterval(refreshMedia, 1000);
setInterval(smoothUpdate, 100);