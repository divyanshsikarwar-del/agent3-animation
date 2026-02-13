"use client";

import { useState, useCallback, useRef } from "react";

export interface Slide {
  image: string;
  prompt: string;
  title: string;
  desc: string;
}

export const DESIGN_SLIDES: Slide[] = [
  {
    image: "https://images.pexels.com/photos/3585088/pexels-photo-3585088.jpeg?auto=compress&cs=tinysrgb&w=800",
    prompt: "Make me a merch site",
    title: "Built-in flexibility",
    desc: "Design is built into every prompt, with the ability to make system-wide changes or tiny tweaks at every step.",
  },
  {
    image: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=800",
    prompt: "Build a dashboard",
    title: "Responsive layouts",
    desc: "Every component adapts seamlessly to any screen size, from mobile to ultra-wide displays.",
  },
  {
    image: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800",
    prompt: "Create a brand kit",
    title: "Component library",
    desc: "Access a rich set of pre-built, customizable components that accelerate every project.",
  },
  {
    image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800",
    prompt: "Design a portfolio",
    title: "Pixel-perfect output",
    desc: "Every detail is rendered with precision, from spacing and alignment to color and typography.",
  },
  {
    image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
    prompt: "Launch a blog",
    title: "Content-first design",
    desc: "Layouts that adapt to your content, not the other way around. Built for readability and engagement.",
  },
  {
    image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800",
    prompt: "Ship a SaaS app",
    title: "Production ready",
    desc: "From prototype to production in minutes. Clean, semantic code that scales with your business.",
  },
];

interface DesignCarouselProps {
  slides?: Slide[];
}

export default function DesignCarousel({ slides = DESIGN_SLIDES }: DesignCarouselProps) {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // Each card is 60% of container width; show ~1.6 cards at a time
  const CARD_WIDTH_PERCENT = 60;
  const GAP_PX = 16;
  const maxIndex = slides.length - 1;

  const prev = useCallback(
    () => setCurrent((s) => Math.max(0, s - 1)),
    []
  );
  const next = useCallback(
    () => setCurrent((s) => Math.min(maxIndex, s + 1)),
    [maxIndex]
  );

  const activeSlide = slides[current];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Horizontal image strip — multiple cards visible side by side */}
      <div className="relative flex-1 overflow-hidden rounded-xl">
        <div
          ref={trackRef}
          className="flex h-full transition-transform duration-500 ease-out"
          style={{
            gap: GAP_PX,
            transform: `translateX(calc(-${current} * (${CARD_WIDTH_PERCENT}% + ${GAP_PX}px)))`,
          }}
        >
          {slides.map((s, i) => (
            <div
              key={i}
              className="relative h-full shrink-0 overflow-hidden rounded-xl"
              style={{ width: `${CARD_WIDTH_PERCENT}%` }}
            >
              <img
                src={s.image}
                alt={s.title}
                className="h-full w-full object-cover"
              />
              {/* Overlay prompt pill */}
              <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-4 py-2 backdrop-blur-md">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
                <span className="text-sm font-medium text-white">{s.prompt}</span>
              </div>
              {/* Pause button */}
              <button
                type="button"
                className="absolute bottom-5 right-5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-md"
                aria-label="Pause"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="none">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Title + description — updates with active slide */}
      <div className="mt-5">
        <h4 className="text-base font-bold text-gray-900 sm:text-lg">
          {activeSlide.title}
        </h4>
        <p className="mt-1 text-sm leading-relaxed text-gray-500 sm:text-base">
          {activeSlide.desc}
        </p>
      </div>

      {/* Navigation */}
      <div className="mt-4 flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={prev}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-colors hover:border-gray-400 hover:text-gray-700 disabled:opacity-30"
          aria-label="Previous slide"
          disabled={current === 0}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
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
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-colors hover:border-gray-400 hover:text-gray-700 disabled:opacity-30"
          aria-label="Next slide"
          disabled={current === maxIndex}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
