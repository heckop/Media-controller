/*global browser */
const mediaElements = new Map();

function getThumbnail(video) {
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  canvas.width = 100; canvas.height = 100;
  ctx.drawImage(video, 0, 0, 100, 100);
  let bgcolor = ctx.getImageData(50, 50, 1, 1).data;
  return { thumbnail: canvas.toDataURL(), bgcolor: [bgcolor[0], bgcolor[1], bgcolor[2]] };
}

function handleQuery() {
  const ret = [];
  const els = document.querySelectorAll("video,audio");
  let count = 1;
  let ms = ('mediaSession' in navigator && navigator.mediaSession.metadata) ? navigator.mediaSession.metadata : null;
  let posState = (navigator.mediaSession && navigator.mediaSession.getPositionState) ? navigator.mediaSession.getPositionState() : null;

  for (const el of els) {
    mediaElements.set(count, el); 
    if (el.readyState > 0) {
      let thumbData = el.tagName.toLowerCase() === "video" ? getThumbnail(el) : {thumbnail: "", bgcolor: [41,42,45]};
      let duration = (posState && posState.duration && posState.duration > 1) ? posState.duration : el.duration;
      let currentTime = (posState && posState.position) ? posState.position : el.currentTime;
      if (isNaN(duration) || duration < 1) duration = 100; 

      ret.push({
        poster: (ms && ms.artwork && ms.artwork.length) ? ms.artwork[ms.artwork.length-1].src : thumbData.thumbnail,
        mediaTitle: ms ? ms.title : "",
        mediaArtist: ms ? ms.artist : "",
        duration: duration,
        currentTime: currentTime,
        playing: !el.paused,
        volume: el.volume,
        id: count,
        bgcolor: thumbData.bgcolor
      });
    }
    count++;
  }
  return ret;
}

function simulateClick(selectors) {
  for (let selector of selectors) {
    let btn = document.querySelector(selector);
    if (btn) { btn.click(); return true; }
  }
  return false;
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.cmd === "query") { sendResponse(handleQuery()); return true; }
  
  (async () => {
    const el = mediaElements.get(request.id);
    switch (request.cmd) {
      case "play":
      case "pause":
        // Unified Click List: Spotify + YouTube
        const clicked = simulateClick([
          '[data-testid="control-button-playpause"]', 
          '.ytp-play-button', 
          'button[aria-label="Play"]', 
          'button[aria-label="Pause"]'
        ]);
        if (!clicked && el) { 
          request.cmd === "play" ? el.play() : el.pause(); 
        }
        break;
      case "volume": if(el) el.volume = request.volume; break;
      case "currentTime": if(el) el.currentTime = request.currentTime; break;
      case "pip": 
        const video = mediaElements.get(request.id);
        if (video && video.tagName === 'VIDEO') {
          try { document.pictureInPictureElement ? await document.exitPictureInPicture() : await video.requestPictureInPicture(); } catch (e) {}
        }
        break;
      case "nextTrack":
        simulateClick(['[data-testid="control-button-skip-forward"]', '.ytp-next-button', 'button[aria-label="Next"]']);
        break;
      case "prevTrack":
        simulateClick(['[data-testid="control-button-skip-back"]', '.ytp-prev-button', 'button[aria-label="Previous"]']);
        break;
    }
  })();
  sendResponse(true);
  return true;
});

setTimeout(() => {
  let s = document.createElement("script");
  s.src = browser.runtime.getURL("attach.js");
  document.head.appendChild(s);
}, 2000);