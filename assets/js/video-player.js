(function () {
  var PLAY_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  var PAUSE_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';

  function init() {
    var players = Array.prototype.slice.call(document.querySelectorAll('.vid-player'));

    players.forEach(function (wrap) {
      var video = wrap.querySelector('video');
      if (!video) return;

      // Build and inject the play/pause button
      var btn = document.createElement('button');
      btn.className = 'vid-play-btn';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Play video');
      btn.innerHTML = PLAY_ICON;
      wrap.appendChild(btn);

      // Optional progress bar
      var progress = document.createElement('div');
      progress.className = 'vid-progress';
      var fill = document.createElement('div');
      fill.className = 'vid-progress-fill';
      progress.appendChild(fill);
      wrap.appendChild(progress);

      // Video should not autoplay or be muted, plays fresh from user click
      video.removeAttribute('autoplay');
      video.controls = false;

      function setPlaying(isPlaying) {
        wrap.classList.toggle('is-playing', isPlaying);
        btn.innerHTML = isPlaying ? PAUSE_ICON : PLAY_ICON;
        btn.setAttribute('aria-label', isPlaying ? 'Pause video' : 'Play video');
      }

      function togglePlay(e) {
        if (e) e.stopPropagation();
        if (video.paused || video.ended) {
          // Pause every other player on the page so only one plays with audio at a time
          players.forEach(function (other) {
            if (other !== wrap) {
              var ov = other.querySelector('video');
              if (ov && !ov.paused) ov.pause();
            }
          });
          video.muted = false;
          var p = video.play();
          if (p && p.catch) p.catch(function () {});
        } else {
          video.pause();
        }
      }

      wrap.addEventListener('click', togglePlay);
      video.addEventListener('play', function () { setPlaying(true); });
      video.addEventListener('pause', function () { setPlaying(false); });
      video.addEventListener('ended', function () { setPlaying(false); });
      video.addEventListener('timeupdate', function () {
        if (video.duration) {
          fill.style.width = (video.currentTime / video.duration * 100) + '%';
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
