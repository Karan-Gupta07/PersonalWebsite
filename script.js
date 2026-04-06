(function () {
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

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
  // Terminal Logic
  var termInput = document.getElementById('term-input');
  var termHistory = document.getElementById('term-history');
  
  if (termInput && termHistory) {
    document.getElementById('terminal').addEventListener('click', function() {
      termInput.focus();
    });

    termInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        var val = termInput.value.trim();
        var cmd = val.toLowerCase();
        
        if (val && val !== 'clear') {
          var cmdE = document.createElement('div');
          cmdE.className = 'term-line';
          cmdE.innerHTML = '<span class="term-prompt">$</span> ' + escapeHtml(val);
          termHistory.appendChild(cmdE);
        }

        termInput.value = '';

        var out = '';
        if (cmd === '') {
          // Do nothing
        } else if (cmd === 'whoami') {
          out = 'karan — swe @ amazon robotics / manulife';
        } else if (cmd === 'ls') {
          out = 'experience/  projects/  skills/  contact/';
        } else if (cmd.startsWith('cd ')) {
          var dir = cmd.split(' ')[1];
          var el = document.getElementById(dir);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            out = 'Navigating to ' + dir + '...';
          } else {
            out = 'cd: no such file or directory: ' + dir;
          }
        } else if (cmd === 'clear') {
          termHistory.innerHTML = '';
        } else if (cmd === 'resume') {
          window.open('KaranGuptaResume.pdf');
          out = 'Downloading resume...';
        } else if (cmd === 'contact') {
          out = 'Email: <a href="mailto:k79gupta@uwaterloo.ca">k79gupta@uwaterloo.ca</a>';
        } else if (cmd === '!game') {
          out = 'Fav game: Elden Ring';
        } else if (cmd === '!movie') {
          out = 'Fav movie: 2001: A Space Odyssey';
        } else if (cmd === '!artist') {
          out = 'Fav artist: Osamason';
        } else if (cmd === '!pc') {
          out = 'Rig: 9070 XT | 13600KF | Vengeance 7000MHz CL34 | NZXT H6 Flow';
        } else if (cmd === '!keyboard' || cmd === '!keeb') {
          out = 'Gaming: Wooting 60HE in PSD60 | Typing: GMMK Pro, Tangerine v3 stabs, Banana Splits, Blue Gamrui GMK';
        } else if (cmd === '!anime') {
          out = 'AniList: <a href="https://anilist.co/user/Exoxeon/" target="_blank" rel="noopener">Exoxeon</a>';
        } else if (cmd === '!manga') {
          out = 'Fav manga: Homunculus or Vagabond';
        } else if (cmd === '!song') {
          out = 'Fav song: Long Time - Playboi Carti';
        } else if (cmd === '!socials') {
          out = 'Links: <a href="https://github.com/Karan-Gupta07" target="_blank" rel="noopener">GitHub</a> | <a href="https://www.linkedin.com/in/karan-gupta-2b72a735a/" target="_blank" rel="noopener">LinkedIn</a>';
        } else if (cmd === '!github') {
          window.open('https://github.com/Karan-Gupta07', '_blank');
          out = 'Opening GitHub...';
        } else if (cmd.startsWith('sudo ')) {
          out = 'karan is not in the sudoers file. This incident will be reported.';
        } else if (cmd === 'rm -rf /') {
          out = 'Nice try. Deleting production database in 3... 2... 1...';
        } else if (cmd === 'vi' || cmd === 'vim') {
          out = "Bro this is a read-only terminal, I'm not trapped in vim again.";
        } else if (cmd === 'echo $path') {
          out = 'High School -> Custom Keyboards -> C2C -> Waterloo Aerial -> Manulife -> Amazon Robotics';
        } else if (cmd.startsWith('hack ')) {
          var target = val.substring(5).trim();
          termInput.disabled = true;
          var lines = [
            'Initializing proxy network...',
            'Bypassing mainframe firewalls for ' + escapeHtml(target) + '...',
            'Cracking RSA-2048 encryption keys...',
            'Injecting payloads...',
            'Access token intercepted.',
            'Routing through secondary subnets...',
            '<strong style="color:var(--accent)">Access granted.</strong>'
          ];
          out = '';
          (function runHack(idx) {
            if (idx >= lines.length) {
              termInput.disabled = false;
              termInput.focus();
              return;
            }
            var p = document.createElement('div');
            p.className = 'term-line term-output';
            p.innerHTML = lines[idx];
            termHistory.appendChild(p);
            var terminal = document.getElementById('terminal');
            terminal.scrollTop = terminal.scrollHeight;
            var delay = (idx === lines.length - 2) ? 800 : 200 + Math.random() * 300;
            setTimeout(function() { runHack(idx + 1); }, delay);
          })(0);
        } else if (cmd === 'help' || cmd === '!help') {
          out = 'whoami, ls, cd [dir], clear, resume, contact, !game, !movie, !artist, !pc, !keyboard, !anime, !manga, !song, !socials, !github';
        } else {
          out = 'command not found: ' + escapeHtml(val) + '. Type help.';
        }

        if (out) {
          var outE = document.createElement('div');
          outE.className = 'term-line term-output';
          outE.innerHTML = out;
          termHistory.appendChild(outE);
        }

        var terminal = document.getElementById('terminal');
        terminal.scrollTop = terminal.scrollHeight;
      }
    });

    function escapeHtml(unsafe) {
      return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
  }
})();
