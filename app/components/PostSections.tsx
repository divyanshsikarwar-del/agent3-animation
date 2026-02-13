"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";

/**
 * Combined animation after the 3 sections:
 *   Phase 1 – Three orange gradient SVG lines draw in (while Agent Gen shrinks)
 *   Phase 2 – Dark blue sweep enters from top-right OVER the orange lines
 *   Phase 3 – Dark blue bg fills in, content fades in
 *
 * Uses a fixed overlay so it renders on top of the shrinking section.
 * Visibility is toggled by scroll position.
 */
export default function PostSections() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const oPath1Ref = useRef<SVGPathElement>(null);
  const oPath2Ref = useRef<SVGPathElement>(null);
  const oPath3Ref = useRef<SVGPathElement>(null);
  const bluePathRef = useRef<SVGPathElement>(null);

  const [lengths, setLengths] = useState({ l1: 1583, l2: 2200, l3: 1400, blue: 2407.57 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const l1 = oPath1Ref.current?.getTotalLength() ?? 1583;
    const l2 = oPath2Ref.current?.getTotalLength() ?? 2200;
    const l3 = oPath3Ref.current?.getTotalLength() ?? 1400;
    const blue = bluePathRef.current?.getTotalLength() ?? 2407.57;
    setLengths({ l1, l2, l3, blue });
  }, []);

  const { scrollYProgress } = useScroll({
    target: triggerRef,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Toggle fixed overlay visibility
  useMotionValueEvent(smooth, "change", (v) => {
    // Show when animation starts (progress > 0.02), hide when past end
    setVisible(v > 0.02 && v < 0.98);
  });

  /* ================ ORANGE LINES (Phase 1: 0 → 0.35) ================ */

  // Path 1: draws from 0.02 → 0.15
  const o1Visible = useTransform(smooth, [0.02, 0.15], [0, lengths.l1]);
  const o1DashArray = useTransform(o1Visible, (v) => `${v}px, ${lengths.l1 + 1}px`);

  // Path 2: draws from 0.10 → 0.25
  const o2Visible = useTransform(smooth, [0.10, 0.25], [0, lengths.l2]);
  const o2DashArray = useTransform(o2Visible, (v) => `${v}px, ${lengths.l2 + 1}px`);

  // Path 3: draws from 0.18 → 0.35
  const o3Visible = useTransform(smooth, [0.18, 0.35], [0, lengths.l3]);
  const o3DashArray = useTransform(o3Visible, (v) => `${v}px, ${lengths.l3 + 1}px`);

  /* ================ DARK BLUE SWEEP (Phase 2: 0.38 → 0.65) ================ */

  const blueDashOffset = useTransform(smooth, [0.38, 0.65], [-lengths.blue, 0]);
  const blueDashVisible = useTransform(smooth, [0.38, 0.65], [0, 2500]);
  const blueDashGap = useTransform(smooth, [0.38, 0.65], [lengths.blue + 1, 4]);
  const blueStrokeWidth = useTransform(smooth, [0.38, 0.65], [320, 1600]);

  const blueDashArray = useTransform(
    [blueDashVisible, blueDashGap],
    ([v, g]) => `${v}px, ${Math.max(g as number, lengths.blue + 1)}px`,
  );

  // Blue SVG opacity: becomes visible at phase 2 start
  const blueOpacity = useTransform(smooth, [0.37, 0.38], [0, 1]);

  /* ================ BG + CONTENT (Phase 3: 0.60 → 0.80) ================ */

  const bgOpacity = useTransform(smooth, [0.60, 0.68], [0, 1]);
  const contentOpacity = useTransform(smooth, [0.70, 0.82], [0, 1]);
  const contentY = useTransform(smooth, [0.70, 0.82], [40, 0]);

  return (
    <>
      {/* Fixed full-screen overlay */}
      <div
        className="fixed inset-0 z-50 pointer-events-none"
        style={{ visibility: visible ? "visible" : "hidden" }}
      >
        {/* Orange gradient lines */}
        <svg
          className="absolute inset-0 z-10 h-full w-full"
          viewBox="0 0 1600 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <motion.path
            ref={oPath1Ref}
            d="M-275 451.744C204 120.743 804.11 413.759 454 1232.24"
            stroke="url(#paint2_post)"
            strokeWidth="297"
            strokeLinecap="round"
            style={{ strokeDasharray: o1DashArray, strokeDashoffset: 0 }}
          />
          <motion.path
            ref={oPath2Ref}
            d="M-197.5 1090.24C285 354.745 895.137 54.5628 1438 226.244C1633.39 288.038 1735.28 454.629 1769.86 661"
            stroke="url(#paint1_post)"
            strokeWidth="297"
            strokeLinecap="round"
            style={{ strokeDasharray: o2DashArray, strokeDashoffset: 0 }}
          />
          <motion.path
            ref={oPath3Ref}
            d="M904.743 1219.5C956.56 1009.15 1067.72 783.539 1244.5 588.745C1460.92 350.275 1699.45 202.34 2013.5 142.951"
            stroke="url(#paint0_post)"
            strokeWidth="297"
            strokeLinecap="round"
            style={{ strokeDasharray: o3DashArray, strokeDashoffset: 0 }}
          />
          <defs>
            <linearGradient id="paint0_post" x1="562.5" y1="2033.24" x2="3214" y2="44.7432" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E84200" />
              <stop offset="0.499201" stopColor="#FFD522" />
              <stop offset="1" stopColor="#FF6915" />
            </linearGradient>
            <linearGradient id="paint1_post" x1="-34.5" y1="612.745" x2="2901.5" y2="-286.756" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E84200" />
              <stop offset="0.794504" stopColor="#FFD522" />
              <stop offset="1" stopColor="#FF6915" />
            </linearGradient>
            <linearGradient id="paint2_post" x1="155" y1="953.744" x2="221.499" y2="-627.756" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E84200" />
              <stop offset="0.468723" stopColor="#FFD522" />
              <stop offset="1" stopColor="#FF6915" />
            </linearGradient>
          </defs>
        </svg>

        {/* Solid dark-blue background */}
        <motion.div
          className="absolute inset-0 z-20"
          style={{ backgroundColor: "#041A36", opacity: bgOpacity }}
        />

        {/* Dark blue sweep SVG — enters over the orange */}
        <motion.svg
          className="absolute inset-0 z-30 h-full w-full"
          viewBox="0 0 2450 1341"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          aria-hidden
          style={{ opacity: blueOpacity }}
        >
          <motion.path
            ref={bluePathRef}
            d="M160 1180.81C489.5 1180.81 920.867 1039.41 1407.77 792.268C1762.26 612.337 2063.06 390.286 2290 160.154"
            stroke="#041A36"
            strokeLinecap="round"
            style={{
              strokeDashoffset: blueDashOffset,
              strokeDasharray: blueDashArray,
              strokeWidth: blueStrokeWidth,
            }}
          />
        </motion.svg>

        {/* Content on dark blue bg */}
        <motion.div
          className="absolute inset-0 z-40 flex items-center justify-center px-8 pointer-events-auto"
          style={{ opacity: contentOpacity, y: contentY }}
        >
          <div className="max-w-3xl text-center text-white">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-400">
              What&apos;s next
            </p>
            <h2 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              The future of autonomous agents
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-blue-200/80">
              Pushing the boundaries of what agents can build, test, and deploy
              — all on their own.
            </p>
          </div>
        </motion.div>
      </div>

      {/* In-flow trigger div — scroll distance drives the animation */}
      <div ref={triggerRef} className="relative z-20 h-[400vh]" />
    </>
  );
}
