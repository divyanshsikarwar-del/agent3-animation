"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import FeaturesSection from "./FeaturesSection";
import SectionsWithLines from "./SectionsWithLines";

/*
  All lines in a single SVG (viewBox 1920×1080).
  The heading is independently centered at the viewport center,
  which maps to SVG coordinate (960, 540).

  TEXT ZONE (where ALL lines converge):
    x ∈ [640, 1280]   — left / right edges of the heading
    y ∈ [430,  650]   — top  / bottom edges (2-line heading at text-8xl)
*/

interface LineDef {
  id: string;
  d: string;
  stroke: string;
  sw: number;
  delay: number;
  dur: number;
}

const lines: LineDef[] = [
  // 15 lines from scattered random positions, straight segments + rounded corners
  { id: "1",  d: "M0 150 L400 150 C413 150 424 161 424 174 L424 436 C424 449 435 460 448 460 L640 460",                stroke: "#FF3C00", sw: 6.5, delay: 0.15, dur: 2.0 },
  { id: "2",  d: "M420 0 L420 406 C420 419 431 430 444 430 L700 430",                                                  stroke: "#BEBBB9", sw: 5.5, delay: 0.3,  dur: 1.6 },
  { id: "3",  d: "M1920 300 L1304 300 C1291 300 1280 311 1280 324 L1280 480",                                           stroke: "#FF3C00", sw: 6.5, delay: 0.1,  dur: 2.1 },
  { id: "4",  d: "M750 1080 L750 650",                                                                                  stroke: "#FF3C00", sw: 6.7, delay: 0.2,  dur: 1.8 },
  { id: "5",  d: "M0 550 L616 550 C629 550 640 541 640 540",                                                            stroke: "#BEBBB9", sw: 6,   delay: 0.05, dur: 2.2 },
  { id: "6",  d: "M1100 0 L1100 430",                                                                                   stroke: "#BEBBB9", sw: 5.8, delay: 0.35, dur: 1.7 },
  { id: "7",  d: "M1920 680 L1304 680 C1291 680 1280 669 1280 656 L1280 600",                                           stroke: "#FF3C00", sw: 7,   delay: 0.2,  dur: 2.0 },
  { id: "8",  d: "M350 1080 L350 604 C350 591 361 580 374 580 L640 580",                                                stroke: "#BEBBB9", sw: 5.5, delay: 0.25, dur: 2.0 },
  { id: "9",  d: "M0 920 L300 920 C313 920 324 909 324 896 L324 664 C324 651 335 640 348 640 L640 640",                 stroke: "#BEBBB9", sw: 6,   delay: 0.1,  dur: 2.3 },
  { id: "10", d: "M800 0 L800 430",                                                                                     stroke: "#FF3C00", sw: 6.7, delay: 0.4,  dur: 1.6 },
  { id: "11", d: "M1920 150 L1304 150 C1291 150 1280 161 1280 174 L1280 450",                                           stroke: "#FF3C00", sw: 6.5, delay: 0.08, dur: 2.3 },
  { id: "12", d: "M1500 1080 L1500 674 C1500 661 1489 650 1476 650 L1200 650",                                          stroke: "#BEBBB9", sw: 5.8, delay: 0.3,  dur: 2.0 },
  { id: "13", d: "M1400 0 L1400 406 C1400 419 1389 430 1376 430 L1150 430",                                             stroke: "#BEBBB9", sw: 6,   delay: 0.45, dur: 1.5 },
  { id: "14", d: "M0 700 L460 700 C473 700 484 689 484 676 L484 524 C484 511 495 500 508 500 L640 500",                 stroke: "#BEBBB9", sw: 5.5, delay: 0.12, dur: 2.3 },
  { id: "15", d: "M1920 900 L1600 900 C1587 900 1576 889 1576 876 L1576 574 C1576 561 1565 550 1552 550 L1280 550",     stroke: "#BEBBB9", sw: 6,   delay: 0.18, dur: 2.2 },
];

const GLOW_DELAY_MS = 2000;
const TRANSITION_DURATION = 1; // seconds

export default function Agent4() {
  const [glow, setGlow] = useState(false);
  // One-time transition: false → true on first scroll, never goes back
  const [transitioned, setTransitioned] = useState(false);
  // Allow page scrolling only after the transition animation finishes
  const [scrollable, setScrollable] = useState(false);

  // Glow timer
  useEffect(() => {
    const t = setTimeout(() => setGlow(true), GLOW_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  // Trigger transition on first scroll-down (wheel or touch)
  const triggerTransition = useCallback(() => {
    if (transitioned) return;
    setTransitioned(true);
  }, [transitioned]);

  useEffect(() => {
    if (transitioned) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        e.preventDefault();
        triggerTransition();
      }
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0].clientY < touchStartY - 20) {
        e.preventDefault();
        triggerTransition();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [transitioned, triggerTransition]);

  // After transition animation completes, unlock scrolling
  useEffect(() => {
    if (!transitioned) return;
    const t = setTimeout(
      () => setScrollable(true),
      (TRANSITION_DURATION + 0.4) * 1000
    );
    return () => clearTimeout(t);
  }, [transitioned]);

  return (
    <div
      className={`bg-black ${scrollable ? "overflow-y-auto" : "h-screen overflow-hidden"}`}
    >
      {/* ════════════════════════════════
          HERO SECTION (always 100vh)
      ════════════════════════════════ */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* ── Background video ── */}
        <motion.video
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 h-full w-full object-cover"
          src="https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4"
          autoPlay
          muted
          loop
          playsInline
        />

        {/* ── Dark overlay ── */}
        <motion.div
          className="absolute inset-0 bg-black"
          initial={{ opacity: 0.55 }}
          animate={{ opacity: transitioned ? 0.4 : 0.55 }}
          transition={{ duration: TRANSITION_DURATION, ease: "easeInOut" }}
        />

        {/* ── Lines SVG — fade to 0 on transition, never come back ── */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{ opacity: transitioned ? 0 : 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <svg
            className="h-full w-full"
            viewBox="0 0 1920 1080"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {lines.map((line) => (
              <motion.path
                key={line.id}
                d={line.d}
                stroke={line.stroke}
                strokeWidth={line.sw}
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: {
                    duration: line.dur,
                    delay: line.delay,
                    ease: "easeInOut",
                  },
                  opacity: { duration: 0.3, delay: line.delay },
                }}
              />
            ))}
          </svg>
        </motion.div>

        {/* ── Radial glow — pure CSS transitions (no Framer Motion) ── */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{
            opacity: transitioned ? 0 : 1,
            transition: "opacity 0.8s ease-out",
          }}
        >
          <div
            className="h-[30vh] w-[60vw] rounded-full"
            style={{
              opacity: glow ? 1 : 0,
              transition: "opacity 0.6s ease-out",
              background:
                "radial-gradient(ellipse, rgba(255,60,0,0.14) 0%, rgba(255,60,0,0.05) 40%, transparent 70%)",
              willChange: "opacity",
            }}
          />
        </div>

        {/* ══════════════════════════════════
            CONTENT: heading + subtitle + input
            Heading is in its OWN centering container so the hidden
            subtitle/input never shifts it away from the true center.
        ══════════════════════════════════ */}

        {/* ── Heading — always at dead-center, shifts up on transition ── */}
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
          <motion.div
            animate={{ y: transitioned ? -100 : 0 }}
            transition={{
              duration: TRANSITION_DURATION,
              ease: "easeInOut",
            }}
          >
            <div className="max-w-2xl text-center">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
              >
                {/* Glow is a pure CSS transition — no JS animation frames */}
                <span
                  className="text-white"
                  style={{
                    textShadow:
                      glow && !transitioned
                        ? "0 0 20px rgba(255,255,255,0.7), 0 0 40px rgba(255,60,0,0.5), 0 0 60px rgba(255,60,0,0.2)"
                        : "none",
                    transition: "text-shadow 0.8s ease-out",
                  }}
                >
                  Introducing Agent{" "}
                </span>
                <span
                  className="inline-block text-[#FF3C00]"
                  style={{
                    textShadow:
                      glow && !transitioned
                        ? "0 0 30px #FF3C00, 0 0 60px rgba(255,60,0,0.4)"
                        : "none",
                    transform:
                      glow && !transitioned ? "scale(1.06)" : "scale(1)",
                    transition:
                      "text-shadow 0.8s ease-out, transform 0.8s ease-out",
                  }}
                >
                  4
                </span>
              </motion.h1>
            </div>
          </motion.div>
        </div>

        {/* ── Subtitle + Input — separate container, appears on transition ── */}
        <motion.div
          className="absolute inset-x-0 z-10 flex justify-center px-4"
          style={{ top: "58%" }}
          initial={{ opacity: 0, y: 50 }}
          animate={
            transitioned
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 50 }
          }
          transition={{
            duration: TRANSITION_DURATION,
            delay: transitioned ? 0.25 : 0,
            ease: "easeOut",
          }}
        >
          <div className="flex w-full max-w-lg flex-col items-center text-center">
            <p className="mb-10 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Parallel agents. Precision design. Easier task
              management. It&apos;s a whole new way to build.
            </p>

            <div className="w-full rounded-2xl bg-white p-5 shadow-2xl">
              <textarea
                placeholder="I need a web app that..."
                rows={3}
                className="mb-4 w-full resize-none text-left text-base text-gray-900 placeholder-gray-400 outline-none sm:text-lg"
              />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  aria-label="Attach"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="rounded-lg bg-[#FF3C00] px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-[0.98] sm:px-6 sm:text-base"
                >
                  Try Agent 4 now
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════
          FEATURES SECTION — white bg, scroll-synced lines
      ════════════════════════════════ */}
      <FeaturesSection />
      <SectionsWithLines />
    </div>
  );
}
