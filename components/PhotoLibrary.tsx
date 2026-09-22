"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { clearAllSessions, deleteSession, getAllSessions, isIndexedDbSupported } from "@/lib/storage";
import { downloadDataUrl } from "@/lib/photoProcessing";
import { getFilter, getLayout, type PhotoboothSession } from "@/types/photobooth";
import TactileButton from "@/components/TactileButton";

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

/** A small, stable hash so each card gets a consistent (not re-randomized on every render) tilt. */
function tiltFor(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) % 1000;
  return (hash % 9) - 4; // -4..4 degrees
}

export default function PhotoLibrary() {
  const [sessions, setSessions] = useState<PhotoboothSession[] | null>(null);
  const [openSession, setOpenSession] = useState<PhotoboothSession | null>(null);
  const [supported, setSupported] = useState(true);

  const refresh = useCallback(async () => {
    if (!isIndexedDbSupported()) {
      setSupported(false);
      setSessions([]);
      return;
    }
    const all = await getAllSessions();
    setSessions(all);
  }, []);

  useEffect(() => {
    // Loading the on-device session library on mount has no non-effect equivalent here —
    // there's no URL/props-derived source to read this from, only IndexedDB.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteSession(id);
      setOpenSession((cur) => (cur?.id === id ? null : cur));
      await refresh();
    },
    [refresh]
  );

  const handleClearAll = useCallback(async () => {
    if (!window.confirm("Delete every saved photobooth session from this device? This can't be undone.")) return;
    await clearAllSessions();
    setOpenSession(null);
    await refresh();
  }, [refresh]);

  return (
    <div className="space-y-10">
      {sessions && sessions.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleClearAll}
            className="rounded-full border-2 border-ink/15 px-4 py-1.5 font-label text-[10px] font-semibold uppercase tracking-wide text-ink/50 transition hover:border-cherry/40 hover:text-cherry"
          >
            Clear all
          </button>
        </div>
      )}

      {!supported && (
        <p className="rounded-xl bg-panel/60 px-4 py-3 font-body text-sm text-ink/70">
          Local photo storage isn&apos;t supported in this browser.
        </p>
      )}

      {sessions === null && <p className="font-hand text-lg text-muted">loading your memories…</p>}

      {sessions && sessions.length === 0 && supported && (
        <div className="edge-imperfect-2 border-2 border-dashed border-ink/25 bg-paper/60 px-6 py-16 text-center">
          <p className="font-display text-xl text-ink/70">No sessions yet</p>
          <p className="mt-1 font-hand text-lg text-muted">take a photobooth session and save it to see it here ✦</p>
        </div>
      )}

      {sessions && sessions.length > 0 && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {sessions.map((session) => {
            const tilt = tiltFor(session.id);
            return (
              <motion.button
                key={session.id}
                onClick={() => setOpenSession(session)}
                initial={{ rotate: tilt }}
                whileHover={{ rotate: 0, y: -8, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="group relative flex flex-col overflow-hidden rounded-sm border-2 border-white bg-white p-2 pb-4 text-left shadow-film"
              >
                <span
                  className="tape absolute left-1/2 top-[-8px] z-10 h-5 w-14 -translate-x-1/2 -rotate-2 rounded-sm"
                  aria-hidden
                />
                <div className="aspect-square w-full overflow-hidden bg-panel/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={session.stripDataUrl}
                    alt={`Session from ${formatDate(session.createdAt)}`}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="space-y-0.5 px-1 pt-2">
                  <p className="font-hand text-lg leading-tight text-ink">{formatDate(session.createdAt)}</p>
                  <p className="font-label text-[9px] uppercase tracking-wide text-ink/45">
                    {session.photos.length} frames · {getLayout(session.layout).tag} · {getFilter(session.filter).label}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      {openSession && (
        <SessionModal session={openSession} onClose={() => setOpenSession(null)} onDelete={handleDelete} />
      )}
    </div>
  );
}

function SessionModal({
  session,
  onClose,
  onDelete,
}: {
  session: PhotoboothSession;
  onClose: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-paper p-5 shadow-booth"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-hand text-xl text-ink">{formatDate(session.createdAt)}</p>
            <p className="font-label text-[10px] uppercase tracking-wide text-ink/45">
              {getLayout(session.layout).tag} · {getFilter(session.filter).label}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full border-2 border-ink/15 p-1.5 text-ink/60 hover:border-ink/40"
          >
            ✕
          </button>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={session.stripDataUrl} alt="Photobooth strip" className="mb-4 w-full rounded-lg border border-ink/10" />

        <div className="flex flex-wrap items-center gap-2">
          <TactileButton onClick={() => downloadDataUrl(session.stripDataUrl, `photobooth-strip-${session.id}.jpg`)}>
            Download strip
          </TactileButton>
          {session.photos.map((p, i) => (
            <button
              key={p.id}
              onClick={() => downloadDataUrl(p.dataUrl, `photobooth-photo-${i + 1}-${session.id}.jpg`)}
              className="rounded-full border-2 border-ink/20 px-4 py-2 font-label text-xs font-semibold uppercase text-ink transition hover:border-ink/50"
            >
              Photo {i + 1}
            </button>
          ))}
          <button
            onClick={() => onDelete(session.id)}
            className="ml-auto rounded-full border-2 border-cherry/40 px-4 py-2 font-label text-xs font-semibold uppercase text-cherry transition hover:bg-cherry hover:text-cream"
          >
            Delete session
          </button>
        </div>
      </motion.div>
    </div>
  );
}
