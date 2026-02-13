"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  {
    title: "Longer Run Time",
    description:
      "Run agents longer with more autonomy. Extended execution windows let your agents tackle complex, multi-step tasks without interruption.",
    bg: "bg-[#0D0D0D]",
    text: "text-white",
    accent: "text-amber-400",
  },
  {
    title: "Self-Testing",
    description:
      "Agents that verify and improve their own work. Built-in testing loops ensure quality output every time.",
    bg: "bg-[#1a1a2e]",
    text: "text-white",
    accent: "text-orange-400",
  },
  {
    title: "Agent Generation",
    description:
      "Build and iterate on autonomous agents. Create specialized agents that can spawn and coordinate sub-agents.",
    bg: "bg-[#0f172a]",
    text: "text-white",
    accent: "text-yellow-400",
  },
];

export default function ExpandSections() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const panels = sectionRefs.current.filter(Boolean) as HTMLDivElement[];

    panels.forEach((panel) => {
      ScrollTrigger.create({
        trigger: panel,
        start: "top bottom",
        end: "top top",
        scrub: 1,
        onUpdate: (self) => {
          const w = 60 + 40 * self.progress;
          panel.style.width = `${w}%`;
          panel.style.borderRadius = `${(1 - self.progress) * 24}px`;
        },
      });

      ScrollTrigger.create({
        trigger: panel,
        start: "bottom bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          if (self.progress > 0) {
            const w = 100 - 40 * self.progress;
            panel.style.width = `${w}%`;
            panel.style.borderRadius = `${self.progress * 24}px`;
          }
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative z-20">
      {sections.map((s, i) => (
        <div key={i} className="flex items-center justify-center py-4">
          <div
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
            className={`${s.bg} ${s.text} mx-auto flex min-h-screen flex-col items-center justify-center px-8 py-24 transition-none sm:px-12 md:px-16`}
            style={{ width: "60%", borderRadius: "24px", overflow: "hidden" }}
          >
            <div className="max-w-2xl text-center">
              <p
                className={`mb-3 text-sm font-semibold uppercase tracking-widest ${s.accent}`}
              >
                0{i + 1}
              </p>
              <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
                {s.title}
              </h2>
              <p className="mt-6 text-lg leading-relaxed opacity-80">
                {s.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
