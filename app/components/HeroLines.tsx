"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

/**
 * Hero background lines — 3 paths that draw in on page load.
 */
export default function HeroLines() {
  const path1Ref = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);
  const path3Ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    const paths = [path1Ref.current, path2Ref.current, path3Ref.current];
    if (paths.some((p) => !p)) return;

    // Draw-in animation on page load
    paths.forEach((p, i) => {
      const len = p!.getTotalLength();
      gsap.set(p, {
        strokeDasharray: `${len}px, ${len}px`,
        strokeDashoffset: len,
        opacity: 0,
      });
      gsap.to(p, {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 1.4,
        delay: 0.15 * i,
        ease: "power2.out",
      });
    });
  }, []);

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      viewBox="0 0 1600 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <g clipPath="url(#heroClip)">
        <path
          ref={path1Ref}
          d="M-91.5468 769.517C356.607 586.549 636.509 243.179 583.556 -77.9399"
          stroke="url(#paint2_linear_hero)"
          strokeWidth="194.92"
          strokeLinecap="round"
        />
        <path
          ref={path2Ref}
          d="M133.075 225.078C138.706 -89.6086 539.908 -516.374 821.149 -261.042"
          stroke="url(#paint1_linear_hero)"
          strokeWidth="194.918"
          strokeLinecap="round"
        />
        <path
          ref={path3Ref}
          d="M1762.41 693.527C1691.06 468.293 1314.9 188.075 949.959 446.092C366.923 858.305 126.116 614.026 133.076 225.078"
          stroke="url(#paint0_linear_hero)"
          strokeWidth="194.918"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <linearGradient id="paint0_linear_hero" x1="1468.5" y1="1060" x2="228.498" y2="246.5" gradientUnits="userSpaceOnUse">
          <stop offset="0.0860566" stopColor="#E84200" />
          <stop offset="0.453349" stopColor="#FF6915" />
          <stop offset="0.759861" stopColor="#EE4C05" />
          <stop offset="1" stopColor="#FFD522" />
        </linearGradient>
        <linearGradient id="paint1_linear_hero" x1="96.9982" y1="758.504" x2="531.998" y2="-498.496" gradientUnits="userSpaceOnUse">
          <stop offset="0.471303" stopColor="#FFD522" />
          <stop offset="0.996873" stopColor="#FF6915" />
        </linearGradient>
        <linearGradient id="paint2_linear_hero" x1="491.987" y1="-156.845" x2="22.9089" y2="1182.16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD522" />
          <stop offset="0.447334" stopColor="#FF6915" />
          <stop offset="0.716346" stopColor="#FF6915" />
        </linearGradient>
        <clipPath id="heroClip">
          <rect width="1600" height="900" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
