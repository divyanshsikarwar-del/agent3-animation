"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   Skeleton placeholder sections for Agent-4 page
   ───────────────────────────────────────────── */

/* ── Shimmer pulse helper ── */
const shimmer = "animate-pulse bg-gray-200 rounded";

/* ── Projects icon — overlapping rotated frames ── */
function ProjectsIcon({ size = 80, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <rect x="12" y="18" width="38" height="38" rx="2" transform="rotate(-12 31 37)" />
      <rect x="20" y="24" width="26" height="26" rx="1.5" transform="rotate(-8 33 37)" />
      <rect x="28" y="30" width="14" height="14" rx="1" transform="rotate(-4 35 37)" />
      <rect x="18" y="14" width="5" height="5" rx="0.5" fill="currentColor" stroke="none" />
      <rect x="48" y="12" width="5" height="5" rx="0.5" fill="currentColor" stroke="none" />
      <rect x="52" y="42" width="5" height="5" rx="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ── Prompt pill icons ── */

function ChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}
function BulbIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6" /><path d="M10 22h4" />
      <path d="M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z" />
    </svg>
  );
}
function PresentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" /><path d="M12 17v4" />
    </svg>
  );
}
function MonitorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" /><path d="M12 17v4" />
    </svg>
  );
}
function CartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
    </svg>
  );
}

/* ── Showcase slide data ── */

interface ShowcaseSlide {
  image: string;
  prompts: { icon: React.ReactNode; text: string }[];
  title: string;
  desc: string;
}

const SHOWCASE_SLIDES: ShowcaseSlide[] = [
  {
    image: "https://images.pexels.com/photos/3585088/pexels-photo-3585088.jpeg?auto=compress&cs=tinysrgb&w=1200",
    prompts: [
      { icon: <ChatIcon />, text: "Build me a dictation app" },
      { icon: <BulbIcon />, text: "Turn my notes into story ideas" },
      { icon: <PresentIcon />, text: "I need a presentation for my editor" },
      { icon: <MonitorIcon />, text: "Create a website that promotes my book tour" },
      { icon: <CartIcon />, text: "Create a merch site for my fans" },
    ],
    title: "Seamless connection across applications",
    desc: "You can chat with any services connected with Replit, asking Agent to create Linear tickets, answer questions in Notion, analyze data in Excel or Snowflake, and more.",
  },
  {
    image: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1200",
    prompts: [
      { icon: <ChatIcon />, text: "Analyze my sales data" },
      { icon: <BulbIcon />, text: "Generate a weekly report" },
      { icon: <PresentIcon />, text: "Build a dashboard for my team" },
      { icon: <MonitorIcon />, text: "Connect my CRM to Slack" },
      { icon: <CartIcon />, text: "Set up an e-commerce store" },
    ],
    title: "Powerful automation at your fingertips",
    desc: "Automate repetitive workflows, connect your tools, and let Agent handle the heavy lifting so you can focus on what matters most.",
  },
  {
    image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200",
    prompts: [
      { icon: <ChatIcon />, text: "Prototype a mobile app" },
      { icon: <BulbIcon />, text: "Design a landing page" },
      { icon: <PresentIcon />, text: "Create an API integration" },
      { icon: <MonitorIcon />, text: "Build a real-time chat feature" },
      { icon: <CartIcon />, text: "Deploy to production" },
    ],
    title: "From idea to production in minutes",
    desc: "Describe what you need and watch it come to life. Agent builds, tests, and deploys — all from a single conversation.",
  },
];

/* ─── SVG line definitions for the Projects / Showcase section ─── */
/*
  ViewBox 1000 × 1300.  CRITICAL: lines must NEVER cross any content.

  Content zones to avoid (approximate SVG coords):
    Icon        : x ≈ 66–164,  y ≈  92–207
    Heading     : x ≈ 66–400,  y ≈ 265–337
    Subtitle    : x ≈ 66–530,  y ≈ 354–397
    Carousel    : x ≈   0–1000, y ≈ 478–1030   (full width — lines go BEHIND)
    Title+desc  : x ≈   0–590,  y ≈ 1060–1150
    Navigation  : x ≈ 846–1000, y ≈ 1060–1150

  Safe routing lanes:
    • Far-left gutter       x < 55   (before pl-16 indent)
    • Top padding           y < 80   (py-16 area, above icon)
    • Subtitle–carousel gap y 400–470
    • Right of subtitle     x > 550  for y < 470
    • Between desc & nav    x 600–840 for y > 1030
*/

interface SLineDef { id: string; d: string; stroke: string; sw: number; phase: 1 | 2 }

const S_LINES: SLineDef[] = [
  /* ── Phase 1 — draw early ── */

  // Orange: down left gutter → sharp right across top padding → sharp down
  //         right-center column → behind carousel → emerges below
  {
    id: "o-route",
    d: [
      "M40 0 L40 48",               // down left gutter
      "Q40 60 52 60",               // sharp right in top padding
      "L628 60",                    // across top (empty space above icon)
      "Q640 60 640 72",             // sharp down
      "L640 1300",                  // straight down (behind carousel, emerges below)
    ].join(" "),
    stroke: "#FF3C00",
    sw: 2.5,
    phase: 1,
  },

  // Gray: down left gutter (longer) → sharp right in subtitle–carousel gap
  //       → to right-center column → sharp down → behind carousel → emerges below
  {
    id: "g-route",
    d: [
      "M40 0 L40 428",              // down left gutter (past icon, heading, subtitle)
      "Q40 440 52 440",             // sharp right in the gap above carousel
      "L748 440",                   // across (right of subtitle, empty space)
      "Q760 440 760 452",           // sharp down
      "L760 1300",                  // straight down (behind carousel, emerges below)
    ].join(" "),
    stroke: "#BEBBB9",
    sw: 2,
    phase: 1,
  },
];

/* ═══════════════════════════════════════════════
   1.  SHOWCASE SECTION — "Projects" heading with
       scroll-synced SVG lines + image carousel
   ═══════════════════════════════════════════════ */

export function CardsSection() {
  const [current, setCurrent] = useState(0);
  const areaRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  const setPathRef = (i: number) => (el: SVGPathElement | null) => {
    pathRefs.current[i] = el;
  };

  /* ── Scroll-driven line animation ── */
  useEffect(() => {
    const area = areaRef.current;
    const paths = pathRefs.current.filter(Boolean) as SVGPathElement[];
    if (!area || paths.length === 0) return;

    paths.forEach((p) => {
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: area,
        start: "top 95%",
        end: "bottom 30%",
        scrub: 0.3,
      },
    });

    paths.forEach((p, i) => {
      const def = S_LINES[i];
      tl.to(
        p,
        { strokeDashoffset: 0, duration: def.phase === 1 ? 0.4 : 0.6, ease: "none" },
        def.phase === 1 ? 0 : 0.4,
      );
    });

    return () => { tl.kill(); };
  }, []);

  const maxIndex = SHOWCASE_SLIDES.length - 1;
  const slide = SHOWCASE_SLIDES[current];

  const prev = useCallback(() => setCurrent((s) => Math.max(0, s - 1)), []);
  const next = useCallback(() => setCurrent((s) => Math.min(maxIndex, s + 1)), [maxIndex]);

  return (
    <section className="relative z-10 bg-white">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        {/* ── Lines + content area ── */}
        <div ref={areaRef} className="relative" style={{ minHeight: 900 }}>
          {/* SVG lines layer */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 1000 1300"
            preserveAspectRatio="none"
            fill="none"
          >
            {S_LINES.map((line, i) => (
              <path
                key={line.id}
                ref={setPathRef(i)}
                d={line.d}
                stroke={line.stroke}
                strokeWidth={line.sw}
                strokeLinecap="round"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          {/* ── Content layer (sits above SVG) ── */}
          <div className="relative z-10 py-16">
            {/* Heading block — indented right of the vertical lines */}
            <div className="pl-16 sm:pl-20">
              <ProjectsIcon size={80} className="text-gray-900" />

              <h2 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Projects
              </h2>
              <p className="mt-3 max-w-md text-lg leading-relaxed text-gray-500 sm:text-xl">
                Build everything in the same project
              </p>
            </div>

            {/* ── Image showcase carousel ── */}
            <div className="mt-14 overflow-hidden rounded-2xl">
              <div className="relative aspect-[16/9] w-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-cover transition-opacity duration-500"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

                {/* Prompt pills — left side */}
                <div className="absolute left-6 top-1/2 flex -translate-y-1/2 flex-col gap-3 sm:left-10">
                  {slide.prompts.map((p, i) => (
                    <div
                      key={i}
                      className="flex w-fit items-center gap-2.5 rounded-full border border-white/30 bg-white/15 px-4 py-2 backdrop-blur-md transition-transform duration-300 hover:scale-[1.03]"
                    >
                      <span className="text-white/80">{p.icon}</span>
                      <span className="text-sm font-medium text-white">{p.text}</span>
                    </div>
                  ))}
                </div>

                {/* Pause button */}
                <button
                  type="button"
                  className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md transition-colors hover:bg-white/30"
                  aria-label="Pause"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="none">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* ── Title + description + navigation ── */}
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl">
                <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                  {slide.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500 sm:text-base">
                  {slide.desc}
                </p>
              </div>

              {/* Navigation */}
              <div className="flex shrink-0 items-center gap-4">
                <button
                  type="button"
                  onClick={prev}
                  disabled={current === 0}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-colors hover:border-gray-400 hover:text-gray-700 disabled:opacity-30"
                  aria-label="Previous"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                <div className="flex items-center gap-1.5">
                  {SHOWCASE_SLIDES.map((_, i) => (
                    <div
                      key={i}
                      className="h-1 rounded-full transition-all duration-300"
                      style={{
                        width: i === current ? 24 : 8,
                        backgroundColor: i === current ? "#FF3C00" : "#D1D5DB",
                      }}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={next}
                  disabled={current === maxIndex}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-colors hover:border-gray-400 hover:text-gray-700 disabled:opacity-30"
                  aria-label="Next"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   2.  VIDEO SECTION — hero-style video embed
   ═══════════════════════════════════════════════ */

export function VideoSection() {
  return (
    <section className="relative z-10 bg-gray-950 py-24">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        {/* Label + heading skeleton */}
        <div className="mb-10 flex flex-col items-center gap-3">
          <div className="h-5 w-20 rounded-full bg-white/10 animate-pulse" />
          <div className="h-8 w-64 rounded bg-white/10 animate-pulse" />
          <div className="h-4 w-96 rounded bg-white/10 animate-pulse" />
        </div>

        {/* Video player skeleton */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-white/5 animate-pulse">
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="white"
                opacity={0.5}
              >
                <polygon points="6,3 20,12 6,21" />
              </svg>
            </div>
          </div>

          {/* Bottom controls bar */}
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 px-5 py-4">
            <div className="h-1 flex-1 rounded-full bg-white/10" />
            <div className="h-3 w-12 rounded bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   3.  SWITCH / TOGGLE SECTION — settings-style
   ═══════════════════════════════════════════════ */

export function SwitchSection() {
  return (
    <section className="relative z-10 bg-white py-20">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* Left — copy skeleton */}
          <div className="flex flex-col gap-4">
            <div className={`${shimmer} h-7 w-40`} />
            <div className={`${shimmer} h-4 w-full max-w-sm`} />
            <div className={`${shimmer} h-4 w-5/6 max-w-sm`} />

            {/* Toggle rows */}
            <div className="mt-6 flex flex-col gap-5">
              {["w-48", "w-40", "w-52", "w-36"].map((w, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`${shimmer} h-9 w-9 !rounded-lg`} />
                    <div className={`${shimmer} h-4 ${w}`} />
                  </div>
                  {/* Toggle track */}
                  <div
                    className={`h-6 w-11 rounded-full ${
                      i % 2 === 0 ? "bg-[#FF3C00]/30" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className={`mt-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        i % 2 === 0 ? "translate-x-[22px]" : "translate-x-0.5"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — preview card skeleton */}
          <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <div className={`${shimmer} h-48 w-full !rounded-xl`} />
            <div className={`${shimmer} h-5 w-2/3`} />
            <div className={`${shimmer} h-3.5 w-full`} />
            <div className={`${shimmer} h-3.5 w-4/5`} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   4.  FOOTER
   ═══════════════════════════════════════════════ */

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-gray-950 py-16">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <div className="h-7 w-28 rounded bg-white/10 animate-pulse" />
            <div className="h-3.5 w-48 rounded bg-white/10 animate-pulse" />
            <div className="h-3.5 w-40 rounded bg-white/10 animate-pulse" />
          </div>

          {/* Link columns */}
          {["Product", "Resources", "Company"].map((title) => (
            <div key={title} className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
                {title}
              </span>
              {[0, 1, 2, 3].map((j) => (
                <div
                  key={j}
                  className="h-3.5 rounded bg-white/10 animate-pulse"
                  style={{ width: `${60 + j * 12}%`, maxWidth: 140 }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <div className="h-3.5 w-48 rounded bg-white/10 animate-pulse" />
          <div className="flex gap-4">
            {[0, 1, 2, 3].map((k) => (
              <div
                key={k}
                className="h-8 w-8 rounded-full bg-white/10 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
