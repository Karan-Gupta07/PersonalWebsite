'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar({ menuOpen, setMenuOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState([
    { type: 'output', text: 'Type "help" for a list of available commands.' }
  ]);
  const [isDisabled, setIsDisabled] = useState(false);

  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  // Focus terminal input when clicking the terminal body
  const focusTerminal = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  // Scroll to bottom of terminal whenever history updates
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const val = inputValue.trim();
      const cmd = val.toLowerCase();

      if (!val) return;

      // Add typed command to history
      const newHistory = [...history];
      if (cmd !== 'clear') {
        newHistory.push({ type: 'prompt', text: val });
      }

      setInputValue('');

      let out = '';
      let isHtml = false;

      if (cmd === 'clear') {
        setHistory([]);
        return;
      } else if (cmd === 'whoami') {
        out = 'karan — swe @ amazon robotics / manulife';
      } else if (cmd === 'ls') {
        out = 'experience/  projects/  skills/  contact/';
      } else if (cmd.startsWith('cd ')) {
        const dir = cmd.split(' ')[1];
        if (dir) {
          const el = document.getElementById(dir);
          if (el) {
            if (pathname !== '/') {
              router.push(`/#${dir}`);
            } else {
              el.scrollIntoView({ behavior: 'smooth' });
            }
            out = `Navigating to ${dir}...`;
          } else {
            out = `cd: no such file or directory: ${dir}`;
          }
        } else {
          out = 'cd: missing destination directory';
        }
      } else if (cmd === 'resume') {
        window.open('/KaranGuptaResume.pdf');
        out = 'Downloading resume...';
      } else if (cmd === 'contact') {
        isHtml = true;
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
        isHtml = true;
        out = 'AniList: <a href="https://anilist.co/user/Exoxeon/" target="_blank" rel="noopener noreferrer">Exoxeon</a>';
      } else if (cmd === '!manga') {
        out = 'Fav manga: Homunculus or Vagabond';
      } else if (cmd === '!song') {
        out = 'Fav song: Long Time - Playboi Carti';
      } else if (cmd === '!socials') {
        isHtml = true;
        out = 'Links: <a href="https://github.com/Karan-Gupta07" target="_blank" rel="noopener noreferrer">GitHub</a> | <a href="https://www.linkedin.com/in/karan-gupta-2b72a735a/" target="_blank" rel="noopener noreferrer">LinkedIn</a>';
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
        const target = val.substring(5).trim();
        setIsDisabled(true);
        const lines = [
          'Initializing proxy network...',
          `Bypassing mainframe firewalls for ${escapeHtml(target)}...`,
          'Cracking RSA-2048 encryption keys...',
          'Injecting payloads...',
          'Access token intercepted.',
          'Routing through secondary subnets...',
          '<strong style="color:var(--accent)">Access granted.</strong>'
        ];

        setHistory(newHistory);

        let idx = 0;
        const runHack = () => {
          if (idx >= lines.length) {
            setIsDisabled(false);
            // Refocus after animation finishes
            setTimeout(() => {
              if (inputRef.current) inputRef.current.focus();
            }, 100);
            return;
          }
          setHistory((prev) => [
            ...prev,
            { type: 'output', text: lines[idx], html: true }
          ]);
          idx++;
          const delay = idx === lines.length - 1 ? 800 : 200 + Math.random() * 300;
          setTimeout(runHack, delay);
        };

        setTimeout(runHack, 100);
        return;
      } else if (cmd === 'help' || cmd === '!help') {
        out = 'whoami, ls, cd [dir], clear, resume, contact, !game, !movie, !artist, !pc, !keyboard, !anime, !manga, !song, !socials, !github';
      } else {
        out = `command not found: ${escapeHtml(val)}. Type help.`;
      }

      if (out) {
        newHistory.push({ type: 'output', text: out, html: isHtml });
      }

      setHistory(newHistory);
    }
  };

  const navLinks = [
    { label: 'experience', href: '/#experience' },
    { label: 'projects', href: '/#projects' },
    { label: 'skills', href: '/#skills' },
    { label: 'recently', href: '/#personal' },
    { label: 'connect', href: '/#connect' },
    { label: 'contact', href: '/#contact' }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <Link href="/" className="sidebar-logo">
          kg
        </Link>
        <nav className="sidebar-nav" aria-label="Main">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Sidebar Terminal */}
        <div 
          className="sidebar-terminal" 
          id="terminal" 
          onClick={focusTerminal}
          ref={terminalRef}
          style={{ overflowY: 'auto', maxHeight: '220px' }}
        >
          {history.map((line, idx) => (
            <span key={idx} className={`term-line ${line.type === 'output' ? 'term-output' : ''}`}>
              {line.type === 'prompt' && <span className="term-prompt">$</span>}
              {line.html ? (
                <span dangerouslySetInnerHTML={{ __html: line.text }} />
              ) : (
                line.text
              )}
            </span>
          ))}

          <div className="term-input-line">
            <span className="term-prompt">$</span>
            <input
              type="text"
              className="term-input"
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleCommand}
              disabled={isDisabled}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            {!isDisabled && <span className="term-cursor"></span>}
          </div>
        </div>
      </aside>

      {/* Mobile Nav Overlay */}
      <nav className={`sidebar-nav--mobile ${menuOpen ? 'is-open' : ''}`} aria-label="Mobile">
        {navLinks.map((link) => (
          <Link 
            key={link.label} 
            href={link.href}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
