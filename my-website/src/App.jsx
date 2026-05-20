import React, { useCallback, useEffect, useId, useMemo, useState } from 'react';
import './App.scss';

const STORAGE_THEME = 'mowgo-portfolio-theme';
const STORAGE_FEED = 'mowgo-feed-count';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem(STORAGE_THEME);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getInitialFeed = () => {
  if (typeof window === 'undefined') return 0;
  const raw = localStorage.getItem(STORAGE_FEED);
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.min(n, 99999) : 0;
};

const SKILLS = [
  { name: 'HTML5', tag: '結構' },
  { name: 'CSS3', tag: '樣式' },
  { name: 'JavaScript', tag: '互動' },
  { name: 'React', tag: 'UI' },
  { name: 'Vite', tag: '工具' },
  { name: 'Git', tag: '協作' },
];

const ProjectCard = ({ title, description, tech, link, variant = 'default' }) => {
  const [feedCount, setFeedCount] = useState(getInitialFeed);
  const [bounceKey, setBounceKey] = useState(0);
  const [hearts, setHearts] = useState([]);
  const feedStatusId = useId();

  const isMowgo = variant === 'mowgo';
  const hasLink = Boolean(link?.trim());

  useEffect(() => {
    if (!isMowgo) return;
    localStorage.setItem(STORAGE_FEED, String(feedCount));
  }, [feedCount, isMowgo]);

  const fullness = useMemo(() => {
    if (!isMowgo) return 0;
    const cycle = feedCount % 10;
    return cycle === 0 && feedCount > 0 ? 100 : (cycle / 10) * 100;
  }, [feedCount, isMowgo]);

  const pushHeart = useCallback(() => {
    const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
    setHearts((h) => [...h, id]);
    window.setTimeout(() => setHearts((h) => h.filter((x) => x !== id)), 900);
  }, []);

  const handleFeed = () => {
    setFeedCount((n) => n + 1);
    setBounceKey((k) => k + 1);
    pushHeart();
  };

  const renderAction = () => {
    if (isMowgo) {
      return (
        <div className="project-card__actions">
          <div className="mowgo-stage" aria-hidden="true">
            <span key={bounceKey} className={`mowgo-face ${bounceKey > 0 ? 'mowgo-face--bounce' : ''}`} title="Mowgo">
              🐱
            </span>
            {hearts.map((id) => (
              <span key={id} className="mowgo-heart">
                💗
              </span>
            ))}
          </div>
          <div className="mowgo-meter" aria-label="飽食度">
            <div className="mowgo-meter__track">
              <div className="mowgo-meter__fill" style={{ width: `${fullness}%` }} />
            </div>
            <span className="mowgo-meter__label">本輪飽食度 · 每餵 10 次重新開胃</span>
          </div>
          <button type="button" className="project-btn project-btn--accent" onClick={handleFeed} aria-describedby={feedStatusId}>
            餵食 Mowgo
          </button>
          <p id={feedStatusId} className="feed-status" role="status" aria-live="polite">
            {feedCount > 0 ? `你已經餵食 Mowgo ${feedCount} 次了！` : '點擊按鈕，開始累積你的餵食紀錄'}
          </p>
        </div>
      );
    }

    if (hasLink) {
      return (
        <a className="project-btn" href={link} target="_blank" rel="noopener noreferrer">
          查看專案
          <span className="project-btn__arrow" aria-hidden="true">
            ↗
          </span>
        </a>
      );
    }

    return (
      <button type="button" className="project-btn" disabled title="連結尚未上架">
        連結準備中
      </button>
    );
  };

  return (
    <article className={`project-card ${isMowgo ? 'project-card--mowgo' : ''}`}>
      <div className="project-card__glow" aria-hidden="true" />
      <h3>{title}</h3>
      <p className="project-card__desc">{description}</p>
      {tech ? (
        <p className="tech">
          {tech.split('•').map((chunk, i, arr) => (
            <React.Fragment key={`${chunk}-${i}`}>
              <span className="tech-pill">{chunk.trim()}</span>
              {i < arr.length - 1 ? ' ' : null}
            </React.Fragment>
          ))}
        </p>
      ) : null}
      {renderAction()}
    </article>
  );
};

const App = () => {
  const [theme, setTheme] = useState(getInitialTheme);
  const [navOpen, setNavOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_THEME, theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 480);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  };

  const closeNav = () => setNavOpen(false);

  return (
    <div className="app" data-theme={theme}>
      <div className="app__bg" aria-hidden="true">
        <div className="app__grid" />
        <div className="app__orb app__orb--a" />
        <div className="app__orb app__orb--b" />
      </div>

      <a href="#main" className="skip-link">
        跳至主要內容
      </a>

      <nav className={`nav ${navOpen ? 'nav--open' : ''}`} aria-label="主要導覽">
        <a href="#" className="nav__brand" onClick={closeNav}>
          <span className="nav__logo">M</span>
          Mowgo Dev
        </a>
        <button
          type="button"
          className="nav__toggle"
          aria-expanded={navOpen}
          aria-controls="nav-menu"
          onClick={() => setNavOpen((o) => !o)}
        >
          <span className="nav__toggle-bar" />
          <span className="nav__toggle-bar" />
          <span className="nav__toggle-bar" />
          <span className="visually-hidden">{navOpen ? '關閉選單' : '開啟選單'}</span>
        </button>
        <div id="nav-menu" className="nav-links">
          <a href="#about" onClick={closeNav}>
            關於我
          </a>
          <a href="#skills" onClick={closeNav}>
            技能
          </a>
          <a href="#projects" onClick={closeNav}>
            作品
          </a>
          <a href="#contact" onClick={closeNav}>
            聯絡
          </a>
        </div>
        <button type="button" className="theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? '切換為淺色' : '切換為深色'}>
          <span className="theme-toggle__icon" aria-hidden="true">
            {theme === 'dark' ? '☀️' : '🌙'}
          </span>
          <span className="visually-hidden">切換主題</span>
        </button>
      </nav>

      <main id="main">
        <header className="hero">
          <p className="hero__eyebrow">Portfolio · 2026</p>
          <h1 className="hero__title">
            你好，我是 <span className="highlight">冠霖</span>
          </h1>
          <p className="hero__subtitle">前端開發者 / React 學習者</p>
          <p className="hero__lead">
            熱愛把想法變成可互動的網站，專注在元件化思考、無障礙細節與流暢動效，朝專業前端工程師前進。
          </p>
          <div className="hero__cta">
            <a href="#projects" className="hero-btn hero-btn--primary">
              查看作品
            </a>
            <a href="#contact" className="hero-btn hero-btn--ghost">
              聯絡我
            </a>
          </div>
          <dl className="hero__stats">
            <div>
              <dt>學習焦點</dt>
              <dd>React 生態</dd>
            </div>
            <div>
              <dt>所在地</dt>
              <dd>台南</dd>
            </div>
            <div>
              <dt>狀態</dt>
              <dd>開放交流</dd>
            </div>
          </dl>
        </header>

        <section id="about" className="section section--about" aria-labelledby="about-heading">
          <p className="section__eyebrow">About</p>
          <h2 id="about-heading" className="section__title">
            關於我
          </h2>
          <div className="prose">
            <p>
              我是冠霖，正在自學 <strong>React</strong>、<strong>JavaScript</strong> 與現代前端技術。喜歡做帶一點幽默感的互動（像是 Mowgo
              餵食小彩蛋），也認真看待版型、可讀性與使用體驗。
            </p>
            <p>希望透過作品展示學習軌跡，並在實務中持續累積除錯、重構與協作經驗。</p>
          </div>
        </section>

        <section id="skills" className="section" aria-labelledby="skills-heading">
          <p className="section__eyebrow">Stack</p>
          <h2 id="skills-heading" className="section__title">
            技術技能
          </h2>
          <ul className="skills-grid" role="list">
            {SKILLS.map((skill) => (
              <li key={skill.name} className="skill-item">
                <span className="skill-item__name">{skill.name}</span>
                <span className="skill-item__tag">{skill.tag}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="projects" className="section" aria-labelledby="projects-heading">
          <p className="section__eyebrow">Projects</p>
          <h2 id="projects-heading" className="section__title">
            作品展示
          </h2>
          <div className="projects">
            <ProjectCard
              variant="mowgo"
              title="Mowgo 餵食挑戰"
              description="第一個原生 JavaScript 小遊戲：用 DOM 操作與狀態管理完成互動，也是我把「好玩」跟「程式」連起來的起點。"
              tech="HTML • CSS • JavaScript"
            />
            <ProjectCard
              title="個人作品集（本頁）"
              description="使用 React 元件化版型、深色模式、響應式導覽與鍵盤友善流程，練習把一頁式網站做得像產品。"
              tech="React • Vite • CSS"
            />
          </div>
        </section>

        <section id="contact" className="section section--contact" aria-labelledby="contact-heading">
          <p className="section__eyebrow">Contact</p>
          <h2 id="contact-heading" className="section__title">
            聯絡我
          </h2>
          <p className="contact__intro">有工作機會、Side project 或技術交流，都歡迎來信。</p>
          <address className="contact-info">
            <a className="contact-card" href="mailto:你的信箱@gmail.com">
              <span className="contact-card__label">Email</span>
              <span className="contact-card__value">jk598207@gmail.com</span>
            </a>
            <a className="contact-card" href="https://github.com/你的帳號" target="_blank" rel="noopener noreferrer">
              <span className="contact-card__label">GitHub</span>
              <span className="contact-card__value">github.com/你的帳號 ↗</span>
            </a>
            <div className="contact-card contact-card--static">
              <span className="contact-card__label">所在地</span>
              <span className="contact-card__value">台南 · Taiwan</span>
            </div>
          </address>
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 冠霖 · Built with React + 熱情</p>
        <p className="footer__sub">設計與程式持續迭代中</p>
      </footer>

      <button
        type="button"
        className={`to-top ${showTop ? 'to-top--visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="回到頂部"
      >
        ↑
      </button>
    </div>
  );
};

export default App;
