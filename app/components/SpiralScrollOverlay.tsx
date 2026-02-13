"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollLine() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const trigger = triggerRef.current;
    const path = pathRef.current;
    if (!trigger || !path) return;

    const len = path.getTotalLength();
    const state = {
      offset: -len,
      visible: 0,
      gap: 999999,
      width: 180,
    };

    function apply() {
      // Gap must always be >= path length so only one segment is ever visible
      const safeGap = Math.max(state.gap, len + 1);
      path!.style.strokeDashoffset = `${state.offset}`;
      path!.style.strokeDasharray = `${state.visible}px, ${safeGap}px`;
      path!.style.strokeWidth = `${state.width}px`;
    }

    apply();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: "top bottom",
        end: "bottom top",
        scrub: 2,
      },
    });

    // 0 → 50%: offset -2407 → 0, dasharray grows, width 180 → 1600
    tl.to(state, {
      offset: 0,
      visible: 3500,
      gap: 4,
      width: 1600,
      duration: 0.5,
      ease: "none",
      onUpdate: apply,
    }, 0);

    // 50 → 100%: offset stays 0, dasharray shrinks to 62/2345, width 1600 → 180
    tl.to(state, {
      offset: 0,
      visible: 0,
      gap: 999999,
      width: 180,
      duration: 0.5,
      ease: "none",
      onUpdate: apply,
    }, 0.5);

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <div ref={triggerRef} className="h-[400vh] w-full" aria-hidden />
      <svg
        className="pointer-events-none fixed inset-0 z-40 h-full w-full"
        viewBox="0 0 2450 1341"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          ref={pathRef}
          d="M-500 2000C200 1400 920.867 1039.41 1407.77 792.268C1762.26 612.337 2063.06 390.286 3000 -600"
          stroke="url(#paint0_linear_2050_344)"
          strokeLinecap="round"
          style={{
            opacity: 1,
            strokeDashoffset: -3200,
            strokeDasharray: "0px, 999999px",
            strokeWidth: "180px",
          }}
        />
        <defs>
          <linearGradient
            id="paint0_linear_2050_344"
            x1="2366.16"
            y1="-745.436"
            x2="320"
            y2="910.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F7CFA9" />
            <stop offset="0.617845" stopColor="#FFD522" />
            <stop offset="1" stopColor="#FF6915" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
}
