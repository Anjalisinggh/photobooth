"use client";

import TactileButton from "@/components/TactileButton";

interface PhotoControlsProps {
  onDownload: () => void;
  onSave: () => void;
  onRetake: () => void;
  onCreateAnother: () => void;
  savedSessionId: string | null;
  isSaving?: boolean;
}

export default function PhotoControls({
  onDownload,
  onSave,
  onRetake,
  onCreateAnother,
  savedSessionId,
  isSaving,
}: PhotoControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
      <TactileButton onClick={onDownload} variant="primary">
        Download
      </TactileButton>
      <TactileButton onClick={onSave} variant="secondary" disabled={isSaving || !!savedSessionId}>
        {savedSessionId ? "Saved ✦" : isSaving ? "Saving…" : "Save to My Photos"}
      </TactileButton>
      <button
        onClick={onRetake}
        className="font-hand text-lg text-ink/70 underline decoration-ink/30 underline-offset-4 transition hover:text-ink"
      >
        Retake
      </button>
      <button
        onClick={onCreateAnother}
        className="font-hand text-lg text-ink/70 underline decoration-ink/30 underline-offset-4 transition hover:text-ink"
      >
        Create Another
      </button>
    </div>
  );
}
