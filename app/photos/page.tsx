import Link from "next/link";
import PhotoLibrary from "@/components/PhotoLibrary";
import TactileButton from "@/components/TactileButton";

export default function PhotosPage() {
  return (
    <main className="paper-bg min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-ink/45 transition hover:text-ink"
            >
              &larr; the photobooth
            </Link>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
              The Wall ✦
            </h1>
            <p className="mt-1 font-hand text-lg text-muted">every little memory you’ve kept</p>
          </div>
          <TactileButton href="/photobooth" variant="primary" className="hidden sm:inline-flex">
            New Session
          </TactileButton>
        </div>

        <PhotoLibrary />
      </div>
    </main>
  );
}
