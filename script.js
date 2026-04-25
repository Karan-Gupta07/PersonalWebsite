(function () {
  // Year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu
  var menuBtn = document.querySelector('.menu-btn');
  var mobileNav = document.querySelector('.sidebar-nav--mobile');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function () {
      menuBtn.classList.toggle('is-open');
      mobileNav.classList.toggle('is-open');
      document.body.style.overflow = mobileNav.classList.contains('is-open') ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menuBtn.classList.remove('is-open');
        mobileNav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Spotify Now Playing Widget ──────────────────────────────────────
  var SPOTIFY_API = '/api/spotify';
  var POLL_INTERVAL = 30000; // 30s

  var widget    = document.getElementById('spotify-widget');
  var dot       = document.getElementById('sp-dot');
  var statusTxt = document.getElementById('sp-status-text');
  var artWrap   = document.getElementById('sp-art-wrap');
  var titleEl   = document.getElementById('sp-title');
  var artistEl  = document.getElementById('sp-artist');

  function renderWidget(data) {
    if (!widget) return;

    // No data at all — hide
    if (!data || (!data.title && !data.isPlaying)) {
      widget.classList.add('hidden');
      return;
    }

    widget.classList.remove('hidden');

    // Status indicator
    if (data.isPlaying) {
      dot.classList.remove('offline');
      statusTxt.textContent = 'now playing';
    } else {
      dot.classList.add('offline');
      statusTxt.textContent = 'last played';
    }

    // Album art
    if (data.albumArt) {
      if (artWrap.tagName === 'IMG') {
        artWrap.src = data.albumArt;
      } else {
        var img = document.createElement('img');
        img.className = 'sp-art';
        img.id = 'sp-art-wrap';
        img.src = data.albumArt;
        img.alt = data.album || 'album art';
        artWrap.parentNode.replaceChild(img, artWrap);
        artWrap = img;
      }
    }

    // Title (linked to song)
    if (data.songUrl) {
      titleEl.innerHTML = '<a href="' + data.songUrl + '" target="_blank" rel="noopener">' +
        escHtml(data.title) + '</a>';
    } else {
      titleEl.textContent = data.title;
    }

    artistEl.textContent = data.artist || '';
  }

  function escHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function fetchNowPlaying() {
    fetch(SPOTIFY_API)
      .then(function(r) { return r.ok ? r.json() : null; })
      .then(renderWidget)
      .catch(function() { /* silently fail — don't break the page */ });
  }

  // Initial fetch + poll
  fetchNowPlaying();
  setInterval(fetchNowPlaying, POLL_INTERVAL);
})();
