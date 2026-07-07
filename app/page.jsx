'use client';

import NervEffects from '@/components/NervEffects';
import { Analytics } from '@vercel/analytics/react';

export default function Home() {
  return (
    <>
      <NervEffects />
      <Analytics />
      
      {/* CRT overlays */}
      <div className="crt-scanlines" aria-hidden="true"></div>
      <div className="crt-vignette" aria-hidden="true"></div>
      <div className="crt-flicker" aria-hidden="true"></div>
      <div className="scan-sweep" aria-hidden="true"></div>

      {/* CONDITION ONE banner */}
      <div className="condition-one" aria-hidden="true">
        <div className="c1-stripe" aria-hidden="true"></div>
        <div className="c1-body">
          <span className="c1-warn">WARNING</span>
          <span className="c1-mid">
            <span className="c1-jp eva-title">第一種戦闘配置</span>
            <span className="c1-en">BATTLE STATIONS — CONDITION ONE</span>
          </span>
          <span className="c1-warn">WARNING</span>
        </div>
        <div className="c1-stripe" aria-hidden="true"></div>
      </div>

      {/* BOOT OVERLAY */}
      <div id="boot">
        <div className="boot-inner">
          <pre className="boot-logo" aria-hidden="true">{`   _  __    _    ____      _    _   _
  | |/ /   / \\  |  _ \\    / \\  | \\ | |
  | ' /   / _ \\ | |_) |  / _ \\ |  \\| |
  | . \\  / ___ \\|  _ <  / ___ \\| |\\  |
  |_|\\_\\/_/   \\_\\_| \\_\\/_/   \\_\\_| \\_|`}</pre>
          <pre id="boot-log" aria-live="polite"></pre>
          <div className="boot-bar-track" role="progressbar" aria-label="Synchronization progress">
            <div id="boot-bar"></div>
          </div>
          <button id="boot-skip" type="button">SKIP ▶</button>
        </div>
      </div>

      {/* FIXED TOP NAV */}
      <nav id="nerv-nav">
        <a className="nav-brand" href="#nav-hub" aria-label="KARAN — home">
          <img src="/nerv-logo.svg" alt="KARAN" width="28" height="28" />
          <span className="brand-name">KARAN</span>
        </a>
        <ul className="nav-links">
          <li><a className="link-cyan" href="#dossier">DOSSIER</a></li>
          <li><a className="link-cyan" href="#synclog">SYNC LOG</a></li>
          <li><a className="link-cyan" href="#eva-units">EVA UNITS</a></li>
          <li><a className="link-cyan" href="#magi">MAGI</a></li>
          <li><a className="link-cyan" href="#commendations">COMMENDATIONS</a></li>
          <li><a className="link-cyan" href="#offline">OFFLINE</a></li>
          <li><a className="link-cyan" href="#transmission">TRANSMISSION</a></li>
        </ul>
        <div className="nav-utils">
          <time id="sys-clock" aria-label="System clock">--:--:--</time>
          <button id="crt-toggle" className="stamp" type="button" aria-label="CRT effects: minimal">CRT: MIN</button>
          <button id="emergency-toggle" className="stamp" type="button" aria-pressed="false">EMERGENCY</button>
        </div>
      </nav>

      <main>
        {/* NAV HUB */}
        <section id="nav-hub" className="section" data-reveal aria-label="Karan Gupta — MAGI navigation">
          <div className="magi-console">
            <div className="chevron-ladder" style={{top:'120px',bottom:'120px',left:'24px'}} aria-hidden="true"></div>
            <div className="chevron-ladder" style={{top:'120px',bottom:'120px',right:'24px'}} aria-hidden="true"></div>
            <div className="axis-ruler" style={{top:'130px',bottom:'130px',left:'96px'}} aria-hidden="true"></div>
            <div className="axis-ruler" style={{top:'130px',bottom:'130px',right:'96px'}} aria-hidden="true"></div>

            <div className="mc-readout">
              <h1 className="mc-ident eva-title">KARAN GUPTA</h1>
              <span className="mc-role">SOFTWARE ENGINEER</span>
              <span className="mc-rl">CURRENT:<span>SDE INTERN @ AMAZON</span></span>
              <span className="mc-rl">PREV:<span>SWE INTERN @ MANULIFE</span></span>
              <span className="mc-rl">PROGRAM:<span>COMPUTER ENG</span></span>
              <span className="mc-rl">MINOR:<span>ECONOMICS</span></span>
              <span className="mc-rl">SCHOOL:<span>UWATERLOO</span></span>
              <span className="mc-rl">GPA:<span>3.95 / 4.00</span></span>
              <span className="mc-rl">STATUS:<span className="dim">NOMINAL</span></span>
            </div>

            <div className="mc-kanji mc-kanji-right" aria-hidden="true">
              <div className="mc-rule"></div>
              <div className="mc-k jp">決議</div>
              <span className="mc-romaji">KETSUGI</span>
            </div>

            {/* Status box with Spotify */}
            <div className="mc-status" id="nav-status" data-state="idle" aria-hidden="true">
              <span className="mc-sb-k jp">情報</span>
              <span className="mc-sb-l">Information</span>
              <span className="mc-sb-code" id="spotify-track-code" style={{display:'flex',alignItems:'flex-start',gap:'6px',marginTop:'4px',textAlign:'left',lineHeight:'1.4'}}>
                <svg style={{flexShrink:0,marginTop:'2px'}} width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                <span id="spotify-text">STATUS: IDLE</span>
              </span>
            </div>

            <div className="mc-title">
              <span className="mc-t jp">MAGI</span>
              <span className="mc-sub">Navigation Array</span>
            </div>

            <nav className="mc-stage" aria-label="Primary section navigation">
              <div className="mc-diagram">
                <svg className="mc-wires" viewBox="0 0 640 470" preserveAspectRatio="none" aria-hidden="true">
                  <line id="mc-wire-top" className="mc-wire" x1="320" y1="120" x2="320" y2="196" stroke="#FF9830" strokeWidth="7" />
                  <line id="mc-wire-left" className="mc-wire" x1="150" y1="398" x2="292" y2="270" stroke="#FF9830" strokeWidth="7" />
                  <line id="mc-wire-right" className="mc-wire" x1="490" y1="398" x2="348" y2="270" stroke="#FF9830" strokeWidth="7" />
                </svg>

                <span className="mc-idx" style={{top:'-16px',left:'50%',transform:'translateX(-50%)'}}>01</span>
                <span className="mc-idx" style={{bottom:'64px',left:'2px'}}>02</span>
                <span className="mc-idx" style={{bottom:'64px',right:'2px'}}>03</span>

                <div className="mc-karan" aria-hidden="true">
                  <svg className="mc-shape" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polygon points="50,2 98,50 50,98 2,50" />
                  </svg>
                  <span className="mc-knm">KARAN</span>
                </div>

                {/* TOP node: PROJECTS */}
                <a className="mc-node mc-top" href="#eva-units" data-wire="mc-wire-top" data-dest="PROJECTS" aria-label="Projects — 5 units">
                  <svg className="mc-shape" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polygon points="6,2 94,2 98,62 50,98 2,62" />
                  </svg>
                  <span className="mc-inner mc-inner-top">
                    <span className="mc-n-code">EVA-UNITS</span>
                    <span className="mc-n-name">Projects</span>
                    <span className="mc-n-count">05 Units</span>
                  </span>
                </a>

                {/* LEFT node: EXPERIENCE */}
                <a className="mc-node mc-left" href="#synclog" data-wire="mc-wire-left" data-dest="EXPERIENCE" aria-label="Experience — 7 records">
                  <svg className="mc-shape" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polygon points="2,2 98,2 84,98 2,98" />
                  </svg>
                  <span className="mc-inner">
                    <span className="mc-n-code">SYNC-LOG</span>
                    <span className="mc-n-name">Experience</span>
                    <span className="mc-n-count">07 Records</span>
                  </span>
                </a>

                {/* RIGHT node: SKILLS */}
                <a className="mc-node mc-right" href="#magi" data-wire="mc-wire-right" data-dest="SKILLS" aria-label="Skills — 38 modules">
                  <svg className="mc-shape" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polygon points="2,2 98,2 98,98 16,98" />
                  </svg>
                  <span className="mc-inner">
                    <span className="mc-n-code">MAGI-CORE</span>
                    <span className="mc-n-name">Skills</span>
                    <span className="mc-n-count">38 Modules</span>
                  </span>
                </a>
              </div>
            </nav>

            <div className="mc-terminal">
              <span><span className="mc-ts-lbl">access code:</span> <span className="mc-dots">••••••••••</span></span>
              <span><span className="mc-ts-lbl">question:</span> <span className="mc-q" id="nav-q">select destination node</span><span className="mc-cursor blink" aria-hidden="true"></span></span>
            </div>

            <a className="mc-scroll link-cyan" href="#dossier" aria-label="Scroll to full dossier">SCROLL FOR FULL RECORD ▾</a>
          </div>
        </section>

        {/* PILOT DOSSIER */}
        <section id="dossier" className="section" data-reveal>
          <span className="section-index" aria-hidden="true">01</span>
          <div className="nerv-panel">
            <div className="panel-header">
              <span className="panel-label">PILOT DOSSIER</span>
              <span className="panel-code">SEC-01</span>
            </div>
            <h2><span className="eva-title">PILOT DOSSIER</span></h2>
            <div className="dossier-body">
              <div className="portrait-frame" aria-hidden="true">
                <span className="portrait-label">NO SIGNAL</span>
              </div>
              <div className="dossier-data">
                <p>Computer Engineering + Economics minor @ University of Waterloo · GPA 3.95</p>
                <div className="data-row"><span className="data-key">INSTITUTION</span><span className="data-value">University of Waterloo</span></div>
                <div className="data-row"><span className="data-key">PROGRAM</span><span className="data-value">Computer Engineering</span></div>
                <div className="data-row"><span className="data-key">MINOR</span><span className="data-value">Economics</span></div>
                <div className="data-row"><span className="data-key">GPA</span><span className="data-value">3.95</span></div>
                <div className="data-row"><span className="data-key">DESIGNATION</span><span className="data-value">Software Engineer</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* SYNC LOG (Experience) */}
        <section id="synclog" className="section" data-reveal>
          <span className="section-index" aria-hidden="true">02</span>
          <h2><span className="eva-title">SYNC LOG</span></h2>
          <ol className="synclog-timeline">
            {/* SYNC 01 - Amazon */}
            <li className="nerv-panel" data-reveal>
              <div className="panel-header"><span className="panel-label">Software Development Engineer Intern</span><span className="panel-code">SYNC 01</span></div>
              <p className="synclog-company">Amazon</p>
              <p className="synclog-dates">May 2026 – Present</p>
              <ul className="synclog-blurb" style={{paddingLeft:'1.5rem',listStyleType:'square',marginTop:'8px'}}>
                <li style={{marginBottom:'6px'}}>Reduced legacy service migration time by 98% (2 weeks → 1 hour per stage) by building multi-step AI agents using prompt chaining and CoT reasoning to automate Java architecture transformation across thousands of lines.</li>
                <li style={{marginBottom:'6px'}}>Architected an agentic RAG pipeline with few-shot prompting to achieve 92% translation accuracy across legacy API calls, algorithm structures, and AWS cloud deployment patterns into modernized service frameworks.</li>
                <li>Developed a pluggable natural language interface enabling on-demand algorithm adjustments during automated migration, allowing seamless integration with modern service handlers without manual intervention.</li>
              </ul>
            </li>
            {/* SYNC 02 - Wat.ai */}
            <li className="nerv-panel" data-reveal>
              <div className="panel-header"><span className="panel-label">AI Software Engineer, Evaluation Lead</span><span className="panel-code">SYNC 02</span></div>
              <p className="synclog-company">Wat.ai (TRACE Subteam)</p>
              <p className="synclog-dates">May 2026 – Present</p>
              <ul className="synclog-blurb" style={{paddingLeft:'1.5rem',listStyleType:'square',marginTop:'8px'}}>
                <li style={{marginBottom:'6px'}}>Engineered TRACE, an AI agent reliability engine that automates multi-step execution tracing and failure isolation, reducing root-cause diagnostic latency by 70% for complex RAG and tool-use workflows.</li>
                <li style={{marginBottom:'6px'}}>Eliminated 95% of runtime non-determinism across 4 downstream production applications by architecting a canonical verifier interface and Pydantic schemas to enforce strict data contracts over subjective LLM logic.</li>
                <li>Enforced 100% compliance for financial-action workflows by deploying a high-throughput, 7-check deterministic execution engine that intercepts policy violations and eliminates manual operational triage.</li>
              </ul>
            </li>
            {/* SYNC 03 - Manulife */}
            <li className="nerv-panel" data-reveal>
              <div className="panel-header"><span className="panel-label">Software Engineering Intern</span><span className="panel-code">SYNC 03</span></div>
              <p className="synclog-company">Manulife Financial Corporation</p>
              <p className="synclog-dates">Jan 2026 – Apr 2026</p>
              <ul className="synclog-blurb" style={{paddingLeft:'1.5rem',listStyleType:'square',marginTop:'8px'}}>
                <li style={{marginBottom:'6px'}}>Reduced system downtime risk by scripting a New Relic data exporter and architecting NRQL queries, enabling early detection of 3+ resource bottlenecks before system failure.</li>
                <li style={{marginBottom:'6px'}}>Designed a Python analysis script and SQL telemetry pipeline to process clickstream data, identifying 20+ suspicious user anomalies by applying mathematical modeling and cross-referencing behavioral logs.</li>
                <li>Implemented 15+ Salesforce features to automate data entry during document uploads for specialized lending workflows, reducing manual input for high-value client processing using Apex and LWC.</li>
              </ul>
            </li>
            {/* SYNC 04 - WARG */}
            <li className="nerv-panel" data-reveal>
              <div className="panel-header"><span className="panel-label">Autonomy Software Developer</span><span className="panel-code">SYNC 04</span></div>
              <p className="synclog-company">Waterloo Aerial Robotics Group</p>
              <p className="synclog-dates">Sep 2025 – Present</p>
              <ul className="synclog-blurb" style={{paddingLeft:'1.5rem',listStyleType:'square',marginTop:'8px'}}>
                <li style={{marginBottom:'6px'}}>Improved real-time signal detection accuracy by 13% using OpenCV2 computer vision algorithms through iterative parameter tuning and validation.</li>
                <li>Built multi-process telemetry and command systems in Python (PyMAVLink) to simulate UAV communication, reducing message latency by 30% across distributed processes.</li>
              </ul>
            </li>
            {/* SYNC 05 - C2C */}
            <li className="nerv-panel" data-reveal>
              <div className="panel-header"><span className="panel-label">Computer Support Specialist</span><span className="panel-code">SYNC 05</span></div>
              <p className="synclog-company">C2C Development Holdings</p>
              <p className="synclog-dates">May 2022 – Sep 2025</p>
              <ul className="synclog-blurb" style={{paddingLeft:'1.5rem',listStyleType:'square',marginTop:'8px'}}>
                <li style={{marginBottom:'6px'}}>Engineered a Python-based automation bot that auto-responded to Facebook Marketplace messages, improving response time by over 70% and automating 700+ customer interactions.</li>
                <li>Provided technical support in database management, hardware setup, and network troubleshooting.</li>
              </ul>
            </li>
            {/* SYNC 06 - Keyboards */}
            <li className="nerv-panel" data-reveal>
              <div className="panel-header"><span className="panel-label">Founder &amp; Operator</span><span className="panel-code">SYNC 06</span></div>
              <p className="synclog-company">Custom Gaming Keyboards</p>
              <p className="synclog-dates">Sep 2022 – Present</p>
              <ul className="synclog-blurb" style={{paddingLeft:'1.5rem',listStyleType:'square',marginTop:'8px'}}>
                <li>Designed and sold 35+ custom keyboards, generating $5,500+ in revenue, while building and maintaining an e-commerce platform for orders, client communication, and margin optimization.</li>
              </ul>
            </li>
            {/* SYNC 07 - FRC */}
            <li className="nerv-panel" data-reveal>
              <div className="panel-header"><span className="panel-label">Build &amp; Design Team Planner</span><span className="panel-code">SYNC 07</span></div>
              <p className="synclog-company">FRC Team 8089</p>
              <p className="synclog-dates">High School</p>
              <ul className="synclog-blurb" style={{paddingLeft:'1.5rem',listStyleType:'square',marginTop:'8px'}}>
                <li style={{marginBottom:'6px'}}>Planned and designed electrical engineering (EE) components and constrained the robot&#39;s physical build process.</li>
                <li>Collaborated with design and build sub-teams to define functional boundaries and integrate electronics efficiently.</li>
              </ul>
            </li>
          </ol>
        </section>

        {/* EVA UNITS (Projects) */}
        <section id="eva-units" className="section" data-reveal>
          <span className="section-index" aria-hidden="true">03</span>
          <h2><span className="eva-title">EVA UNITS</span></h2>
          <div className="eva-grid">
            <article className="eva-card nerv-panel" data-reveal>
              <div className="panel-header"><span className="panel-label">EVA-01</span><span className="panel-code"><span className="status-nominal">NOMINAL</span></span></div>
              <h3 className="eva-card-name">Reparo</h3>
              <p className="eva-card-desc">Won 1st place ($5,000) by building an Agentic AI system using Gemini vision models for product classification with 90%+ accuracy. Reduced search time by 70% and enabled access to 1,000+ real-time listings by integrating Shopify Storefront API and SerpAPI.</p>
              <ul className="tags"><li className="tag">Python</li><li className="tag">Gemini API</li><li className="tag">React</li><li className="tag">Node.js</li><li className="tag">Swift</li><li className="tag">PyTorch</li></ul>
              <a className="link-cyan" href="/project/reparo">DEPLOY ▶</a>
            </article>
            <article className="eva-card nerv-panel" data-reveal>
              <div className="panel-header"><span className="panel-label">EVA-02</span><span className="panel-code"><span className="status-nominal">NOMINAL</span></span></div>
              <h3 className="eva-card-name">DeliriumWatch</h3>
              <p className="eva-card-desc">Built a real-time Python monitoring pipeline with SQL-backed secure login and role-based access control for hospital staff, resulting in over 90% reduction in manual monitoring. Implemented OpenCV-based eye detection and live Flask web visualizations to flag abnormal conditions.</p>
              <ul className="tags"><li className="tag">Raspberry Pi</li><li className="tag">Arduino</li><li className="tag">Python</li><li className="tag">OpenCV</li><li className="tag">HTML</li><li className="tag">CSS</li><li className="tag">Flask</li><li className="tag">C/C++</li></ul>
              <a className="link-cyan" href="/project/deliriumwatch">DEPLOY ▶</a>
            </article>
            <article className="eva-card nerv-panel" data-reveal>
              <div className="panel-header"><span className="panel-label">EVA-03</span><span className="panel-code"><span className="status-nominal">NOMINAL</span></span></div>
              <h3 className="eva-card-name">AI Admissions Similarity Tool</h3>
              <p className="eva-card-desc">AI-driven tool to scrape admissions data and compute similarity scores (GPA, tests, interests). Applicant benchmarking with reach, target, and safety school classification.</p>
              <ul className="tags"><li className="tag">Python</li><li className="tag">PRAW</li><li className="tag">MongoDB</li></ul>
              <a className="link-cyan" href="/project/ai-admissions">DEPLOY ▶</a>
            </article>
            <article className="eva-card nerv-panel" data-reveal>
              <div className="panel-header"><span className="panel-label">EVA-04</span><span className="panel-code"><span className="status-nominal">NOMINAL</span></span></div>
              <h3 className="eva-card-name">TailorAI (Silhouette)</h3>
              <p className="eva-card-desc">Built a full-stack AI platform using computer vision and the MERN stack, processing 200+ images to automatically extract 10+ body measurements per user. Implemented Python CV pipeline with landmark normalization, improving measurement consistency by 40%. Designed scalable backend APIs, MongoDB schema, and responsive React frontend.</p>
              <ul className="tags"><li className="tag">Python</li><li className="tag">TensorFlow</li><li className="tag">scikit-learn</li><li className="tag">OpenCV</li><li className="tag">Node.js</li><li className="tag">React</li><li className="tag">MongoDB</li></ul>
              <a className="link-cyan" href="/project/silhouette">DEPLOY ▶</a>
            </article>
            <article className="eva-card nerv-panel" data-reveal>
              <div className="panel-header"><span className="panel-label">EVA-05</span><span className="panel-code"><span className="status-nominal">NOMINAL</span></span></div>
              <h3 className="eva-card-name">Spotify Pi Thing</h3>
              <p className="eva-card-desc">A standalone Raspberry Pi Spotify controller with a touchscreen UI acting like an in-car console. Uses FastAPI matching OAuth caching for independent boot-time kiosk playback.</p>
              <ul className="tags"><li className="tag">Raspberry Pi</li><li className="tag">Python 3</li><li className="tag">FastAPI</li><li className="tag">Spotipy</li><li className="tag">JS</li></ul>
              <a className="link-cyan" href="/project/spotify-pi">DEPLOY ▶</a>
            </article>
          </div>
        </section>

        {/* MAGI SYSTEM (Skills) */}
        <section id="magi" className="section" data-reveal>
          <span className="section-index" aria-hidden="true">04</span>
          <h2><span className="eva-title">MAGI SYSTEM</span></h2>
          <p className="stamp magi-caution">CAUTION — MAGI DELIBERATION IN PROGRESS</p>
          <div className="hazard-stripe magi-hazard" aria-hidden="true"></div>
          <p className="magi-central" aria-hidden="true">CENTRAL DOGMA</p>
          <div className="magi-grid">
            <article className="magi-unit" id="magi-melchior" data-reveal>
              <div className="magi-header"><span className="magi-name">MELCHIOR·1</span><span className="jp magi-gloss">科学者</span><span className="magi-role">Scientist</span></div>
              <div className="magi-status" aria-live="polite"><span className="status-nominal">NOMINAL</span></div>
              <div className="magi-body">
                <h3 className="magi-category">LANGUAGES</h3>
                <ul className="tags magi-tags">
                  <li className="tag">Python</li><li className="tag">Java</li><li className="tag">C</li><li className="tag">C++</li><li className="tag">Swift</li><li className="tag">TypeScript</li><li className="tag">JavaScript</li><li className="tag">SQL</li><li className="tag">Apex</li><li className="tag">HTML</li><li className="tag">CSS</li><li className="tag">VBA</li>
                </ul>
              </div>
            </article>
            <article className="magi-unit" id="magi-balthasar" data-reveal>
              <div className="magi-header"><span className="magi-name">BALTHASAR·2</span><span className="jp magi-gloss">母</span><span className="magi-role">Mother</span></div>
              <div className="magi-status" aria-live="polite"><span className="status-nominal">NOMINAL</span></div>
              <div className="magi-body">
                <h3 className="magi-category">FRAMEWORKS</h3>
                <ul className="tags magi-tags">
                  <li className="tag">PyTorch</li><li className="tag">TensorFlow</li><li className="tag">scikit-learn</li><li className="tag">RAG</li><li className="tag">React</li><li className="tag">Node.js</li><li className="tag">Flask</li><li className="tag">FastAPI</li><li className="tag">OpenCV2</li><li className="tag">REST API</li><li className="tag">PyMAVLink</li><li className="tag">NumPy</li><li className="tag">JUnit</li><li className="tag">Dagger</li>
                </ul>
              </div>
            </article>
            <article className="magi-unit" id="magi-casper" data-reveal>
              <div className="magi-header"><span className="magi-name">CASPER·3</span><span className="jp magi-gloss">女</span><span className="magi-role">Woman</span></div>
              <div className="magi-status" aria-live="polite"><span className="status-nominal">NOMINAL</span></div>
              <div className="magi-body">
                <h3 className="magi-category">TOOLS &amp; CLOUD</h3>
                <ul className="tags magi-tags">
                  <li className="tag">Git</li><li className="tag">GitHub</li><li className="tag">Docker</li><li className="tag">VS Code</li><li className="tag">AWS (S3, SQS, SNS)</li><li className="tag">Salesforce</li><li className="tag">Postman</li><li className="tag">Kubernetes</li><li className="tag">Xcode</li><li className="tag">MongoDB</li><li className="tag">SQL</li>
                </ul>
              </div>
            </article>
          </div>
          <button id="magi-run" type="button">DELIBERATE</button>
        </section>

        {/* COMMENDATIONS */}
        <section id="commendations" className="section" data-reveal>
          <span className="section-index" aria-hidden="true">05</span>
          <h2><span className="eva-title">COMMENDATIONS</span></h2>
          <ul className="commendations-grid">
            <li className="nerv-panel commendation" data-reveal>Valedictorian</li>
            <li className="nerv-panel commendation" data-reveal>1st — Euclid Math Contest (School Medal)</li>
            <li className="nerv-panel commendation" data-reveal>1st — Amazon Robotics Hackathon</li>
            <li className="nerv-panel commendation" data-reveal>Bronze — Chess AI Bot, Waterloo Tech Week</li>
            <li className="nerv-panel commendation" data-reveal>{"Governor General's Academic Award"}</li>
            <li className="nerv-panel commendation" data-reveal>1st — Hack Canada 2026, Reactiv Track ($5,000)</li>
            <li className="nerv-panel commendation" data-reveal>Shortlisted — Most Complex AI Hack, Hack Canada 2026</li>
          </ul>
        </section>

        {/* OFFLINE RECORDS */}
        <section id="offline" className="section" data-reveal>
          <span className="section-index" aria-hidden="true">06</span>
          <h2><span className="eva-title">OFFLINE RECORDS</span></h2>
          <div className="offline-grid">
            <article className="nerv-panel" data-reveal>
              <div className="panel-header"><span className="panel-label">FILM</span><span className="panel-code">REC-01</span></div>
              <p>Film enthusiast. Logs on <a className="link-cyan" href="https://letterboxd.com/Exoxeon/">Letterboxd</a>.</p>
            </article>
            <article className="nerv-panel" data-reveal>
              <div className="panel-header"><span className="panel-label">MUSIC</span><span className="panel-code">REC-02</span></div>
              <p>Into rage, EDM, Hyperpop. Charts on <a className="link-cyan" href="https://albumoftheyear.org/user/exoxoen/">AOTY</a>.</p>
            </article>
            <article className="nerv-panel" data-reveal>
              <div className="panel-header"><span className="panel-label">KEYBOARDS &amp; PC BUILDING</span><span className="panel-code">REC-03</span></div>
              <p>35+ custom boards.</p>
              <div className="data-row"><span className="data-key">CASE</span><span className="data-value">NZXT H6 Flow</span></div>
              <div className="data-row"><span className="data-key">CPU</span><span className="data-value">13600KF</span></div>
              <div className="data-row"><span className="data-key">GPU</span><span className="data-value">9070XT</span></div>
              <div className="data-row"><span className="data-key">MEMORY</span><span className="data-value">Vengeance 7000MHz CL34</span></div>
            </article>
            <article className="nerv-panel" data-reveal>
              <div className="panel-header"><span className="panel-label">MISC</span><span className="panel-code">REC-04</span></div>
              <p>Also into manga, martial arts, motorsports.</p>
            </article>
          </div>
        </section>

        {/* TRANSMISSION (Contact) */}
        <section id="transmission" className="section" data-reveal>
          <span className="section-index" aria-hidden="true">07</span>
          <h2><span className="eva-title">TRANSMISSION</span></h2>
          <div className="nerv-panel terminal" data-reveal>
            <div className="panel-header"><span className="panel-label">TERMINAL</span><span className="panel-code">CONTACT</span></div>
            <pre id="terminal-output" aria-live="polite">PILOT-EXO CONTACT TERMINAL // awaiting command...</pre>
            <div className="terminal-prompt">
              <span className="terminal-cursor">$ </span><span className="blink" aria-hidden="true">█</span>
            </div>
            <div className="terminal-commands">
              <button type="button" data-cmd="mail">mail</button>
              <button type="button" data-cmd="linkedin">open linkedin</button>
              <button type="button" data-cmd="github">open github</button>
              <button type="button" data-cmd="resume">open resume</button>
            </div>
          </div>
          <ul className="raw-links">
            <li><a className="link-cyan" href="mailto:k79gupta@uwaterloo.ca">k79gupta@uwaterloo.ca</a></li>
            <li><a className="link-cyan" href="https://linkedin.com/in/karan-gupta-2b72a735a/">LinkedIn</a></li>
            <li><a className="link-cyan" href="https://github.com/Karan-Gupta07">GitHub</a></li>
            <li><a className="link-cyan" href="/KaranGuptaResume.pdf">Resume</a></li>
            <li>Discord: <span className="data-value">exo1k</span></li>
          </ul>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <p>&copy; 2026 Karan Gupta · <span className="footer-brand">KARAN</span></p>
        <p className="footer-tagline">ADVANCING BEYOND</p>
      </footer>
    </>
  );
}
