'use client';
import { useState, useRef, useEffect } from 'react';

function escapeHtml(unsafe) {
  return (unsafe || '')
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default function Terminal() {
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState([
    { type: 'output', text: 'PILOT-EXO CONTACT TERMINAL // awaiting command...', html: false }
  ]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);
  const historyIndex = useRef(-1);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const focusTerminal = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCommand = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const newIndex = historyIndex.current < commandHistory.length - 1
        ? historyIndex.current + 1
        : historyIndex.current;
      historyIndex.current = newIndex;
      setInputValue(commandHistory[commandHistory.length - 1 - newIndex]);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex.current <= 0) {
        historyIndex.current = -1;
        setInputValue('');
        return;
      }
      historyIndex.current -= 1;
      setInputValue(commandHistory[commandHistory.length - 1 - historyIndex.current]);
      return;
    }

    if (e.key === 'Enter') {
      const val = inputValue.trim();
      const cmd = val.toLowerCase();

      if (!val) return;

      setCommandHistory((prev) => [...prev, val]);
      historyIndex.current = -1;

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
      } else if (cmd === 'resume') {
        window.open('/KaranGuptaResume.pdf');
        out = 'Downloading resume...';
      } else if (cmd === 'contact') {
        isHtml = true;
        out = 'Email: <a class="link-cyan" href="mailto:k79gupta@uwaterloo.ca">k79gupta@uwaterloo.ca</a>';
      } else if (cmd === '!game') {
        out = 'Fav game: Elden Ring';
      } else if (cmd === '!movie') {
        out = 'Fav movie: Evangelion 3.0+1.0 / 2001: A Space Odyssey';
      } else if (cmd === '!artist') {
        out = 'Fav artist: Osamason';
      } else if (cmd === '!pc') {
        out = 'Rig: 9070 XT | 13600KF | Vengeance 7000MHz CL34 | NZXT H6 Flow';
      } else if (cmd === '!keyboard' || cmd === '!keeb') {
        out = 'Gaming: Wooting 60HE in PSD60 | Typing: GMMK Pro, Tangerine v3 stabs, Banana Splits, Blue Gamrui GMK';
      } else if (cmd === '!anime') {
        isHtml = true;
        out = 'AniList: <a class="link-cyan" href="https://anilist.co/user/Exoxeon/" target="_blank" rel="noopener noreferrer">Exoxeon</a>';
      } else if (cmd === '!manga') {
        out = 'Fav manga: Homunculus or Vagabond';
      } else if (cmd === '!song') {
        out = 'Fav song: Long Time - Playboi Carti';
      } else if (cmd === '!socials') {
        isHtml = true;
        out = 'Links: <a class="link-cyan" href="https://github.com/Karan-Gupta07" target="_blank" rel="noopener noreferrer">GitHub</a> | <a class="link-cyan" href="https://www.linkedin.com/in/karan-gupta-2b72a735a/" target="_blank" rel="noopener noreferrer">LinkedIn</a>';
      } else if (cmd === '!github' || cmd === 'github') {
        window.open('https://github.com/Karan-Gupta07', '_blank');
        out = 'Opening GitHub...';
      } else if (cmd === '!linkedin' || cmd === 'linkedin') {
        window.open('https://www.linkedin.com/in/karan-gupta-2b72a735a/', '_blank');
        out = 'Opening LinkedIn...';
      } else if (cmd === 'mail') {
        window.location.href = 'mailto:k79gupta@uwaterloo.ca';
        out = 'Opening mail client...';
      } else if (cmd.startsWith('sudo ')) {
        out = 'pilot is not in the sudoers file. This incident will be reported to MAGI.';
      } else if (cmd === 'help' || cmd === '!help') {
        out = 'whoami, ls, clear, resume, contact, mail, github, linkedin, !game, !movie, !artist, !pc, !keyboard, !anime, !manga, !song, !socials';
      } else {
        out = `command not found: ${escapeHtml(val)}. Type help.`;
      }

      if (out) {
        newHistory.push({ type: 'output', text: out, html: isHtml });
      }

      setHistory(newHistory);
    }
  };

  return (
    <div 
      className="terminal-interactive" 
      onClick={focusTerminal}
      ref={terminalRef}
      style={{ overflowY: 'auto', maxHeight: '250px' }}
    >
      {history.map((line, idx) => (
        <div key={idx} className={`term-line ${line.type === 'output' ? 'term-output' : ''}`} style={{ marginBottom: '4px' }}>
          {line.type === 'prompt' && <span className="terminal-cursor">$ </span>}
          {line.html ? (
            <span dangerouslySetInnerHTML={{ __html: line.text }} />
          ) : (
            line.text
          )}
        </div>
      ))}

      <div className="terminal-prompt" style={{ marginTop: '4px', display: 'flex', alignItems: 'center' }}>
        <span className="terminal-cursor" style={{ marginRight: '8px' }}>$ </span>
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
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--wire-cyan)',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            outline: 'none',
            flexGrow: 1,
            caretColor: 'var(--wire-cyan)'
          }}
        />
      </div>
    </div>
  );
}
