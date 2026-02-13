import ScrollLine from "./components/SpiralScrollOverlay";
import HeroLines from "./components/HeroLines";
import ExpandSections from "./components/ExpandSections";
import PostSections from "./components/PostSections";
import Typewriter from "./components/Typewriter";

export default function Home() {
  return (
    <div className="relative bg-white text-zinc-900">
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-20 sm:px-8 md:px-12">
        {/* Hero background lines — draw in on page load */}
        <HeroLines />

        <div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
          <h1 className="flex items-center justify-center gap-4 text-6xl font-bold tracking-tight text-[#0f172a] sm:text-7xl md:text-8xl lg:text-9xl">
            Agent{" "}
            <img
              src="https://cdn.prod.website-files.com/68b46dd742e2b142ba3489bf/68c10254a24d3859ed8d8c5b_3-svg-1.webp"
              alt="3"
              width={170}
              height={217}
              className="inline-block h-[1.4em] w-auto"
            />
          </h1>
          <p className="mt-5 text-2xl font-medium text-[#0f172a] sm:text-3xl md:text-4xl">
            Autonomy for All.
          </p>
          <p className="mt-3 text-lg text-zinc-600 sm:text-xl md:text-2xl">
            10x more autonomous. Infinitely more possibilities.
          </p>
          <div
            className="mt-8 w-full max-w-xl rounded-3xl p-[3px]"
            style={{
              background:
                "linear-gradient(135deg, #FF6915, #FFD522, #E84200)",
            }}
          >
            <div className="rounded-[21px] bg-white px-6 pb-6 pt-5">
              <div className="min-h-[120px] text-left text-lg text-zinc-500 sm:text-xl">
                <Typewriter />
              </div>
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-full bg-[#FF6915] px-8 py-3.5 font-medium text-white transition hover:bg-[#E84200]"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Start building for free
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Orange gradient sweep on scroll */}
      <ScrollLine />

      {/* 3 sections: expand on enter, shrink on leave */}
      <ExpandSections />

      {/* Orange lines draw in → dark blue sweep over them → content */}
      <PostSections />
    </div>
  );
}
