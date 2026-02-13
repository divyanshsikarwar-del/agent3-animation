"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CardsSection,
  VideoSection,
  SwitchSection,
  Footer,
} from "./SkeletonSections";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   Wraps the skeleton sections with two persistent
   vertical scroll-lines (orange + gray) that run
   behind every section and appear in the gaps.
   ───────────────────────────────────────────── */

export default function SectionsWithLines() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const lines = linesRef.current;
    if (!wrapper || !lines) return;

    // Reveal the lines top→bottom as the user scrolls
    const anim = gsap.fromTo(
      lines,
      { clipPath: "inset(0 0 100% 0)" },
      {
        clipPath: "inset(0 0 0% 0)",
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top 80%",
          end: "bottom 30%",
          scrub: 0.3,
        },
      }
    );

    return () => {
      anim.kill();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      {/* ── Vertical lines layer (behind sections) ── */}
      <div
        ref={linesRef}
        className="pointer-events-none absolute inset-0 z-0"
      >
        {/*
          Inner container matches section max-w-5xl + padding.
          Both lines at 4% (x=40 in viewBox 1000) — they overlap here
          and only diverge inside each section.
        */}
        <div className="mx-auto h-full max-w-5xl px-6 sm:px-10">
          <div className="relative h-full">
            {/* Orange line — far-left gutter (viewBox x=40/1000 = 4%) */}
            <div
              className="absolute h-full w-[2.5px] rounded-full bg-[#FF3C00]"
              style={{ left: "4%" }}
            />
            {/* Gray line — same start (overlapping, diverges inside sections) */}
            <div
              className="absolute h-full w-[2px] rounded-full bg-[#BEBBB9]"
              style={{ left: "4%" }}
            />
          </div>
        </div>
      </div>

      {/* ── Sections (z-10 + solid bg = lines hidden behind them) ── */}
      {/* Gap below FeaturesSection — lines visible */}
      <div className="h-36" />

      <CardsSection />

      {/* Gap — lines visible between cards & video */}
      <div className="h-36" />

      <VideoSection />

      {/* Gap — lines visible between video & switch */}
      <div className="h-36" />

      <SwitchSection />

      {/* Gap — lines visible between switch & footer */}
      <div className="h-36" />

      <Footer />
    </div>
  );
}
