import TactileButton from "@/components/TactileButton";
import { StarDoodle } from "@/components/Doodles";

export default function LandingPage() {
  return (
    <main className="paper-bg relative flex min-h-screen flex-col overflow-hidden">
      <nav className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-end px-6 py-7 sm:px-10">
        <TactileButton href="/photos" variant="ghost" className="!px-0 !py-0 normal-case tracking-normal">
          <span className="underline decoration-ink/30 decoration-2 underline-offset-4">My Photos</span>
        </TactileButton>
      </nav>

      {/* Centered in the background image's own clear middle — its corners already carry the decoration. */}
      <section className="relative z-10 flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
        <div className="animate-fade-up mx-auto flex max-w-xl flex-col items-center gap-1 text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-panel px-4 py-1.5 font-label text-[11px] font-semibold uppercase tracking-[0.2em] text-ink shadow-stamp-sm">
            <StarDoodle className="h-3.5 w-3.5" /> a little digital photobooth
          </p>

          <h1 className="font-display text-6xl font-semibold leading-[0.95] tracking-tight text-ink sm:text-7xl">
            Step inside.
          </h1>
          <p className="mt-5 font-display text-3xl font-medium text-cocoa/80">you + your camera roll ✦</p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <TactileButton href="/photobooth" variant="primary">
              Enter the booth
              <span aria-hidden>&rarr;</span>
            </TactileButton>
            <span className="max-w-xs font-body text-xs leading-snug text-muted">
              No sign-up. No uploads. Just you, four frames, and a countdown.
            </span>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
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
        </div>
      </section>
    </main>
  );
}
