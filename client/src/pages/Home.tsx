import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";

type RevealProps = { children: ReactNode; className?: string; delay?: number };

type Stat = { value: string; label: string };
type Project = { name: string; description: string; year: string; tag: string; repo: string; tone: string; image?: string };
type Skill = { name: string; status: "Comfortable" | "Learning" };

const navItems = [
  ["About", "about"],
  ["Skills", "skills"],
  ["Projects", "projects"],
  ["Education", "education"],
  ["Contact", "contact"],
] as const;

const stats: Stat[] = [
  { value: "2026", label: "Graduated, BIM" },
  { value: "2", label: "Projects featured" },
  { value: "3", label: "Languages learning" },
  { value: "HTML/CSS/JS", label: "Core stack" },
];

const capabilities = [
  ["Responsive layouts", "Mobile-first interfaces that hold up on every screen."],
  ["Clean, semantic code", "Readable HTML and CSS that's easy to maintain."],
  ["JavaScript interactivity", "Dynamic components built from scratch, no libraries."],
  ["Always learning", "Currently working through Node.js."],
];

const skills: Skill[] = [
  { name: "HTML", status: "Comfortable" },
  { name: "CSS", status: "Comfortable" },
  { name: "JavaScript", status: "Learning" },
  { name: "Responsive Design", status: "Comfortable" },
  { name: "Git & GitHub", status: "Comfortable" },
  { name: "Node.js", status: "Learning" },
  { name: "TypeScript", status: "Learning" },
];

const projects: Project[] = [
  { name: "SOULFUEL BITES", description: "A multi-page site for a food brand", year: "2025", tag: "web", repo: "soulfuel-bites", tone: "peach", image: "/soulfuel-bites.jpeg" },
  { name: "GREENERY", description: "An eco-travel journal for mindful adventures", year: "2025", tag: "web", repo: "greenery", tone: "sage", image: "/greenery-landing-page.jpeg" },
];

const education = [
  ["2022 — 2026", "Bachelor's in Information Management (BIM)", "Kanya Campus, Pokhara"],
  ["2019 — 2022", "+2 (Higher Secondary)", "Sainik Awasiya Mahavidyalaya, Pokhara"],
];

const beyond = [
  ["Puzzles", "The same itch as debugging, minus the stack trace."],
  ["Languages", "Currently learning Chinese, one character at a time."],
  ["Reading", "Books for the quiet hours."],
  ["Dramas", "Dramas for the plot twists and the company."],
  ["Teaching", "Explaining something is the fastest way to learn it properly."],
];

function useHeaderBorder(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

function useScrollReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

function useFocusTrap(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const container = ref.current;
    if (!container) return;
    const focusable = () => Array.from(container.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
    const first = focusable()[0];
    first?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;
      const current = document.activeElement;
      const index = items.indexOf(current as HTMLElement);
      if (event.shiftKey && (index <= 0 || current === container)) {
        event.preventDefault();
        items[items.length - 1].focus();
      } else if (!event.shiftKey && index === items.length - 1) {
        event.preventDefault();
        items[0].focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  return ref;
}

function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const { ref, visible } = useScrollReveal();
  return <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`} style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}>{children}</div>;
}

function Header({ onMenu }: { onMenu: () => void }) {
  const scrolled = useHeaderBorder();
  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container header-inner">
        <a className="wordmark" href="#top" aria-label="Rakshya Pathak home"><span className="mark" />RAKSHYA</a>
        <button className="menu-button" type="button" onClick={onMenu} aria-label="Open navigation menu" aria-haspopup="dialog">
          MENU <Menu size={16} strokeWidth={2.5} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const trapRef = useFocusTrap(open, onClose);
  if (!open) return null;
  return (
    <div className="nav-overlay" ref={trapRef} role="dialog" aria-modal="true" aria-label="Main navigation">
      <div className="container nav-overlay-inner">
        <div className="overlay-topline"><span>RAKSHYA PATHAK / INDEX</span><button className="close-button" type="button" onClick={onClose} aria-label="Close navigation menu"><X size={22} aria-hidden="true" /></button></div>
        <nav className="overlay-nav" aria-label="Overlay navigation">
          {navItems.map(([label, id], index) => <a href={`#${id}`} key={id} onClick={onClose}><span>0{index + 1}</span>{label}</a>)}
        </nav>
        <div className="overlay-footer"><span>BASED IN POKHARA, NEPAL</span><span>AVAILABLE FOR GOOD WORK</span></div>
      </div>
    </div>
  );
}

function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return <div className="section-label"><span>{index}</span><span>{children}</span></div>;
}

function Hero() {
  return (
    <section className="hero container" id="top" aria-labelledby="hero-title">
      <Reveal className="hero-intro">
        <p className="serif-kicker">Hey, I'm Rakshya,</p>
        <h1 id="hero-title" className="display display-hero">AN <em>ASPIRING</em><br />BACKEND<br />DEVELOPER</h1>
        <p className="hero-copy">Learning to build thoughtful backend systems with Node.js while keeping a strong foundation in HTML, CSS and JavaScript. I like problems that need untangling, whether that's a data flow or a layout bug.</p>
        <a className="pill-button" href="#contact">CONTACT ME <span className="button-icon"><ArrowUpRight size={15} aria-hidden="true" /></span></a>
      </Reveal>
      <Reveal className="portrait-wrap" delay={90}>
        <div className="portrait-placeholder has-image"><img className="portrait-image" src="/portfolio-img.png" alt="Illustrated portrait of Rakshya Pathak" /></div>
        <p className="image-caption">24 / WEB DEVELOPER / POKHARA</p>
      </Reveal>
      <Reveal className="stats-list" delay={150}>
        {stats.map((stat) => <div className="stat" key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
      </Reveal>
    </section>
  );
}

function CapabilityStrip() {
  return <Reveal className="container"><div className="capability-strip">{capabilities.map(([title, description], index) => <div className="capability" key={title}><span className="capability-index">0{index + 1}</span><strong>{title}</strong><p>{description}</p></div>)}</div></Reveal>;
}

function About() {
  return (
    <section className="section container" id="about" aria-labelledby="about-title">
      <Reveal><SectionLabel index="01" children="About" /><div className="about-grid"><h2 id="about-title" className="display section-heading">LEARNING,<br />BUILDING <span>&amp;</span><br /><em>figuring things out</em></h2><div className="about-copy"><p className="lead-copy">I'm Rakshya, a BIM student and web developer from Pokhara who enjoys turning static designs into things people can actually click.</p><p> I started with HTML, CSS and JavaScript, and I'm currently learning Node.js for the backend. I like teaching too — explaining a concept to someone else is how I check I actually understand it.</p><a className="text-link" href="#contact">Let's get in touch <ArrowRight size={17} aria-hidden="true" /></a></div></div></Reveal>
    </section>
  );
}

function Skills() {
  return (
    <section className="section container" id="skills" aria-labelledby="skills-title">
      <Reveal><SectionLabel index="02" children="Skills" /><div className="section-intro-row"><h2 id="skills-title" className="display section-heading compact">THE TOOLS<br /><em>in progress</em></h2><p className="muted-intro">A growing toolkit, built one small project at a time. Comfortable with the fundamentals, curious about everything next.</p></div><div className="skills-grid">{skills.map((skill, index) => <div className="skill-cell" key={skill.name}><span className="skill-number">0{index + 1}</span><strong>{skill.name}</strong><span className={`status ${skill.status === "Learning" ? "is-learning" : ""}`}>{skill.status}</span></div>)}</div></Reveal>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return <>
    <a className="project-card" href={`https://github.com/askdgsaf/${project.repo}`} target="_blank" rel="noreferrer">
      <div className="project-preview-scroll" tabIndex={0} role="region" aria-label={`${project.name} scrollable project preview`}>
        <div className={`project-image ${project.tone} ${project.image ? "has-image" : "scrollable-placeholder"}`}>
          {project.image ? <img src={project.image} alt={`${project.name} project preview`} /> : null}
          <span>project / 0{index + 1}</span>
          {!project.image ? <strong>{project.name.slice(0, 1)}</strong> : null}
        </div>
      </div>
      <div className="project-meta"><h3>{project.name}</h3><p>{project.description} <span>·</span> {project.year}</p><span className="project-tag">{project.tag}</span><ArrowUpRight className="project-arrow" size={19} aria-hidden="true" /></div>
    </a>
    {project.image ? <a className="project-full-link" href={project.image} target="_blank" rel="noreferrer">View full page <ArrowUpRight size={15} aria-hidden="true" /></a> : null}
  </>;
}

function Projects() {
  return (
    <section className="section container projects-section" id="projects" aria-labelledby="projects-title">
      <Reveal><SectionLabel index="03" children="Selected projects" /><div className="section-intro-row projects-intro"><h2 id="projects-title" className="display section-heading compact">PROJECTS</h2><p className="muted-intro">A few things I've built while learning — mostly front-end challenges and small apps.</p></div><div className="project-list">{projects.map((project, index) => <ProjectCard project={project} index={index} key={project.name} />)}</div><a className="text-link github-link" href="https://github.com/askdgsaf" target="_blank" rel="noreferrer">View all on GitHub <ArrowRight size={17} aria-hidden="true" /></a></Reveal>
    </section>
  );
}

function Education() {
  return <section className="section container" id="education" aria-labelledby="education-title"><Reveal><SectionLabel index="04" children="Education" /><h2 id="education-title" className="display section-heading compact education-title">THE LONGER<br /><em>version</em></h2><div className="education-list">{education.map(([years, qualification, institution]) => <div className="education-row" key={years}><span className="education-years">{years}</span><div><strong>{qualification}</strong><span>{institution}</span></div></div>)}</div></Reveal></section>;
}

function Beyond() {
  return <section className="section container beyond-section" aria-labelledby="beyond-title"><Reveal><SectionLabel index="05" children="Beyond the screen" /><h2 id="beyond-title" className="display section-heading compact">WHEN I'M NOT <em>coding</em></h2><div className="beyond-grid">{beyond.map(([title, description], index) => <div className="beyond-cell" key={title}><span>0{index + 1}</span><strong>{title}</strong><p>{description}</p></div>)}</div></Reveal></section>;
}

function Contact() {
  return <footer className="contact-section" id="contact"><div className="container"><Reveal><SectionLabel index="06" children="Contact" /><h2 className="display contact-heading">LET'S BUILD<br /><em>something</em><br />TOGETHER.</h2><a className="email-link" href="mailto:rakshapathak0612@gmail.com">rakshapathak0612@gmail.com <ArrowUpRight size={27} aria-hidden="true" /></a><div className="contact-links"><a href="https://github.com/askdgsaf" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} aria-hidden="true" /></a><a href="https://www.linkedin.com/in/rakshya-p-082954274/" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={15} aria-hidden="true" /></a><a href="mailto:rakshapathak0612@gmail.com">Email <ArrowUpRight size={15} aria-hidden="true" /></a></div><div className="footer-bottom"><span>© 2026 Rakshya Pathak</span><span>Pokhara, Nepal</span></div></Reveal></div></footer>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return <><Header onMenu={() => setMenuOpen(true)} /><MenuOverlay open={menuOpen} onClose={closeMenu} /><main><Hero /><CapabilityStrip /><About /><Skills /><Projects /><Education /><Beyond /></main><Contact /></>;
}

declare global {
  namespace React {
    interface CSSProperties { "--reveal-delay"?: string; }
  }
}
