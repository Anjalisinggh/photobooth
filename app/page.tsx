import TactileButton from "@/components/TactileButton";
import HeroBoothCard from "@/components/HeroBoothCard";
import {
  BowDoodle,
  BunnyDoodle,
  CatFaceDoodle,
  CoffeeCupDoodle,
  CroissantDoodle,
  SparkleDoodle,
  SpiralDoodle,
  TeddyBearDoodle,
} from "@/components/Doodles";

export default function LandingPage() {
  return (
    <main className="paper-bg relative flex min-h-screen flex-col overflow-hidden">
      {/* scattered moodboard doodles — thin maroon line-art tucked into the corners */}
      <CoffeeCupDoodle className="pointer-events-none absolute left-5 top-20 h-9 w-9 -rotate-6 text-cherry sm:left-12 sm:top-24 sm:h-11 sm:w-11" />
      <BowDoodle className="pointer-events-none absolute right-6 top-16 h-8 w-11 rotate-3 text-cherry sm:right-16 sm:top-20 sm:h-10 sm:w-14" />
      <SparkleDoodle className="pointer-events-none absolute left-10 top-40 hidden h-3.5 w-3.5 text-cherry/70 sm:block" />
      <SparkleDoodle className="pointer-events-none absolute right-14 top-52 hidden h-4 w-4 text-cherry/70 sm:block" />
      <CatFaceDoodle className="pointer-events-none absolute left-8 top-1/2 hidden h-9 w-9 -translate-y-1/2 -rotate-6 text-cherry/80 lg:block" />
      <SpiralDoodle className="pointer-events-none absolute right-10 top-[58%] hidden h-8 w-8 text-cherry/80 lg:block" />
      <span className="pointer-events-none absolute left-12 bottom-40 hidden -rotate-3 font-hand text-2xl text-cherry/80 lg:block">
        xoxo
      </span>
      <CroissantDoodle className="pointer-events-none absolute right-10 bottom-44 hidden h-8 w-11 rotate-6 text-cherry/80 lg:block" />
      <BunnyDoodle className="pointer-events-none absolute left-10 bottom-14 hidden h-9 w-9 -rotate-3 text-cherry/70 xl:block" />
      <TeddyBearDoodle className="pointer-events-none absolute bottom-4 right-6 h-16 w-16 rotate-3 text-cherry/70 sm:h-20 sm:w-20" />

      <nav className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-end px-6 py-7 sm:px-10">
        <TactileButton href="/photos" variant="ghost" className="!px-0 !py-0 normal-case tracking-normal">
          <span className="underline decoration-ink/30 decoration-2 underline-offset-4">My Photos</span>
        </TactileButton>
      </nav>

      <section className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-6 py-6 sm:px-10">
        <div className="animate-fade-up mx-auto flex max-w-xl flex-col items-center gap-1 text-center">
          <h1 className="font-script text-7xl leading-none text-ink sm:text-8xl">today&rsquo;s mood</h1>
          <p className="mt-4 font-label text-[11px] font-semibold uppercase tracking-[0.3em] text-ink/70">
            get your photobooth strip in here
          </p>
        </div>

        <HeroBoothCard />

        <div className="animate-fade-up flex flex-col items-center gap-3">
          <TactileButton href="/photobooth" variant="primary">
            Enter the booth
            <span aria-hidden>&rarr;</span>
          </TactileButton>
          <span className="max-w-xs text-center font-body text-xs leading-snug text-muted">
            No sign-up. No uploads. Just you, four frames, and a countdown.
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {[
            { n: "4", label: "frames a strip" },
            { n: "7", label: "film styles" },
            { n: "0", label: "photos uploaded" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="edge-imperfect-1 flex min-w-[104px] flex-col items-center gap-0.5 border-2 border-dashed border-ink/30 bg-paper/70 px-4 py-3 text-center"
            >
              <span className="font-display text-2xl font-semibold text-cherry">{stat.n}</span>
              <span className="font-label text-[10px] uppercase tracking-wide text-muted">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
