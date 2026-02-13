"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DesignCarousel from "./DesignCarousel";

gsap.registerPlugin(ScrollTrigger);

/* ─── Icon helpers ─── */

function GridIcon({ size = 48, className = "" }: { size?: number; className?: string }) {
  const cells = [
    [1,1,1,0,1],
    [1,0,1,1,0],
    [1,1,1,0,1],
    [0,1,0,1,0],
    [1,0,1,0,1],
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {cells.flatMap((row, r) =>
        row.map((on, c) =>
          on ? (
            <rect key={`${r}-${c}`} x={2 + c * 9} y={2 + r * 9} width="7" height="7" rx="1" fill="currentColor" />
          ) : null
        )
      )}
    </svg>
  );
}

function FrameIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6" y="6" width="36" height="36" rx="4" />
      <rect x="13" y="13" width="13" height="13" rx="2" />
      <circle cx="34" cy="14" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function DotsIcon({ size = 48 }: { size?: number }) {
  const angles = [0, 40, 80, 130, 180, 220, 270, 320];
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="currentColor">
      {angles.map((a, i) => {
        const r = 15;
        const cx = Math.round((24 + r * Math.cos((a * Math.PI) / 180)) * 100) / 100;
        const cy = Math.round((24 + r * Math.sin((a * Math.PI) / 180)) * 100) / 100;
        return <circle key={i} cx={cx} cy={cy} r={i % 2 === 0 ? 3 : 2.2} opacity={i % 3 === 0 ? 0.9 : 0.45} />;
      })}
    </svg>
  );
}

function CirclesIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="26" cy="24" r="6" />
      <circle cx="26" cy="24" r="12" />
      <path d="M26 6 A18 18 0 0 1 44 24" strokeWidth="1.6" />
      <circle cx="26" cy="24" r="18" opacity="0.3" />
    </svg>
  );
}

/* ─── SVG line definitions ─── */
/* All turns are steep 90° angles with a small rounded corner (Q bezier, r ≈ 12). */
/* Lines are split into phase-1 (card connections — draw early) and               */
/* phase-2 (extensions below the card — draw later).                              */

interface LineDef {
  id: string;
  d: string;
  stroke: string;
  sw: number;
  phase: 1 | 2;
}

const LINE_DEFS: LineDef[] = [
  /* ── Phase 1 — card-connecting lines ── */
  {
    // gray1: down → sharp right (top edge) → sharp down (right side) → sharp left (bottom-right corner)
    id: "gray1",
    d: "M90 0 L90 153 Q90 165 102 165 L820 165 Q832 165 832 177 L832 775 Q832 787 820 787 L800 787",
    stroke: "#BEBBB9", sw: 2, phase: 1,
  },
  {
    // orange1: down → sharp right turn → reach icon
    id: "orange1",
    d: "M90 0 L90 293 Q90 305 102 305 L198 305",
    stroke: "#FF3C00", sw: 2.5, phase: 1,
  },
  {
    // orange2: down → sharp right turn → reach heading
    id: "orange2",
    d: "M90 0 L90 358 Q90 370 102 370 L235 370",
    stroke: "#FF3C00", sw: 2.5, phase: 1,
  },
  {
    // gray2: down (left side) → sharp right (bottom edge) → sharp down (bottom-right corner)
    id: "gray2",
    d: "M90 0 L90 775 Q90 787 102 787 L820 787 Q832 787 832 799 L832 810",
    stroke: "#BEBBB9", sw: 2, phase: 1,
  },

  /* ── Phase 2 — extensions below the card (hidden behind it, then reappear) ── */
  {
    id: "orange1-ext",
    d: "M198 305 L198 1200",
    stroke: "#FF3C00", sw: 2.5, phase: 2,
  },
  {
    id: "gray2-ext",
    d: "M832 810 L832 1200",
    stroke: "#BEBBB9", sw: 2, phase: 2,
  },
];

/* ─── Main component ─── */

export default function FeaturesSection() {
  const areaRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  const setRef = (i: number) => (el: SVGPathElement | null) => {
    pathRefs.current[i] = el;
  };

  useEffect(() => {
    const area = areaRef.current;
    const paths = pathRefs.current.filter(Boolean) as SVGPathElement[];
    if (!area || paths.length !== LINE_DEFS.length) return;

    // Initialise each path fully hidden (dash = full length)
    paths.forEach((p) => {
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: area,
        start: "top 100%",   // begin as soon as area enters viewport
        end: "bottom 30%",
        scrub: 0.3,
      },
    });

    // Phase 1 (card connections): finish in first 35% of scroll range
    // Phase 2 (extensions below card): draw from 35% → 100%
    paths.forEach((p, i) => {
      const def = LINE_DEFS[i];
      if (def.phase === 1) {
        tl.to(p, { strokeDashoffset: 0, duration: 0.35, ease: "none" }, 0);
      } else {
        tl.to(p, { strokeDashoffset: 0, duration: 0.65, ease: "none" }, 0.35);
      }
    });

    return () => { tl.kill(); };
  }, []);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-10 sm:py-20">
        {/* ── Top feature bar ── */}
        <div className="flex items-start justify-between gap-4 sm:gap-8">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-extralight tracking-tight text-gray-900 sm:text-5xl">10x</span>
            <span className="mt-1 text-xs text-gray-400 sm:text-sm">Faster builds</span>
          </div>
          <div className="flex flex-col items-center text-gray-800">
            <GridIcon />
            <span className="mt-1 text-xs text-gray-400 sm:text-sm">Design</span>
          </div>
          <div className="flex flex-col items-center text-gray-800">
            <FrameIcon />
            <span className="mt-1 text-xs text-gray-400 sm:text-sm">Projects</span>
          </div>
          <div className="flex flex-col items-center text-gray-800">
            <DotsIcon />
            <span className="mt-1 text-xs text-gray-400 sm:text-sm">Teamwork</span>
          </div>
          <div className="flex flex-col items-center text-gray-800">
            <CirclesIcon />
            <span className="mt-1 text-xs text-gray-400 sm:text-sm">Multi-tasking</span>
          </div>
        </div>

        {/* ── Lines + Card area ── */}
        <div ref={areaRef} className="relative mt-4" style={{ height: 1150 }}>
          {/* SVG lines — viewBox 1000×1260 (taller to show lines below card) */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 1000 1260"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {LINE_DEFS.map((line, i) => (
              <path
                key={line.id}
                ref={setRef(i)}
                d={line.d}
                stroke={line.stroke}
                strokeWidth={line.sw}
                strokeLinecap="round"
                fill="none"
              />
            ))}
          </svg>

          {/* Card — solid bg hides lines passing behind it */}
          <div
            className="absolute z-10 flex flex-col rounded-2xl bg-white"
            style={{ left: "13%", right: "16.8%", top: 150, height: 567 }}
          >
            {/* Icon + heading (orange lines target) */}
            <div className="mb-5 flex items-center gap-4 px-8 pt-6 sm:px-10 sm:pt-8">
              <GridIcon size={52} className="shrink-0 text-gray-900" />
              <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">Design</h3>
            </div>

            {/* Carousel */}
            <div className="flex min-h-0 flex-1 pl-8 pb-6 sm:pl-10 sm:pb-8">
              <DesignCarousel />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
