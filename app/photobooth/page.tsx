"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Camera from "@/components/Camera";
import FilterSelector from "@/components/FilterSelector";
import PhotoPreview from "@/components/PhotoPreview";
import PhotoboothStrip from "@/components/PhotoboothStrip";
import PhotoControls from "@/components/PhotoControls";
import TactileButton from "@/components/TactileButton";
import { useCamera } from "@/hooks/useCamera";
import { usePhotobooth } from "@/hooks/usePhotobooth";
import { capturePhotoFromVideo, downloadDataUrl } from "@/lib/photoProcessing";
import type { FilterDefinition, StripCustomization } from "@/types/photobooth";

const STAGE_COPY: Record<string, string> = {
  "style-select": "pick a vibe, then step in ✦",
  countdown: "hold still…",
  flash: "FLASH!",
  captured: "one more…",
  generating: "developing your photos…",
  reviewing: "look what we made ✦",
  saved: "tucked safely into My Photos ✦",
};

export default function PhotoboothPage() {
  const camera = useCamera();
  const [flashEnabled, setFlashEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const captureFrame = useCallback(
    (filter: FilterDefinition) => {
      if (!camera.videoRef.current) throw new Error("Camera is not ready");
      return capturePhotoFromVideo(camera.videoRef.current, filter, camera.isMirrored);
    },
    [camera.videoRef, camera.isMirrored]
  );

  const booth = usePhotobooth({ captureFrame });

  useEffect(() => {
    void camera.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCustomize = useCallback(
    (patch: Partial<StripCustomization>) => {
      const merged = { ...booth.customization, ...patch };
      booth.updateCustomization(patch);
      void booth.regenerateStrip(merged);
    },
    [booth]
  );

  const handleDownload = useCallback(() => {
    if (!booth.stripDataUrl) return;
    downloadDataUrl(booth.stripDataUrl, `photobooth-strip-${Date.now()}.jpg`);
  }, [booth.stripDataUrl]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    await booth.saveToLibrary();
    setIsSaving(false);
  }, [booth]);

  const isResultStage = booth.stage === "reviewing" || booth.stage === "saved";
  const isSessionRunning =
    booth.stage === "countdown" || booth.stage === "flash" || booth.stage === "captured" || booth.stage === "generating";
  const latestPhotoUrl = booth.photos[booth.photos.length - 1]?.dataUrl;

  return (
    <main className="paper-bg min-h-screen pb-20">
      <div className="mx-auto max-w-5xl px-6 pt-8 sm:px-10">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-ink/45 transition hover:text-ink"
          >
            &larr; the photobooth
          </Link>
          <Link
            href="/photos"
            className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-ink/45 transition hover:text-ink"
          >
            My Photos
          </Link>
        </div>

        <p className="mb-6 text-center font-hand text-2xl text-cocoa/80">{STAGE_COPY[booth.stage]}</p>

        {!isResultStage && (
          <>
            <Camera
              videoRef={camera.videoRef}
              status={camera.status}
              errorMessage={camera.errorMessage}
              isMirrored={camera.isMirrored}
              onRetryPermission={() => void camera.start()}
              filter={booth.filter}
              canFlip={camera.canFlip}
              onFlip={() => void camera.flipCamera()}
              flashEnabled={flashEnabled}
              onToggleFlash={() => setFlashEnabled((v) => !v)}
              stage={booth.stage}
              countdown={booth.countdown}
              photoIndex={booth.photoIndex}
              totalPhotos={booth.totalPhotos}
              showCounter={isSessionRunning}
              latestPhotoUrl={latestPhotoUrl}
            />

            <div className="mx-auto mt-8 max-w-xl space-y-8">
              {isSessionRunning ? (
                <PhotoPreview photos={booth.photos} total={booth.totalPhotos} />
              ) : (
                camera.status === "ready" && (
                  <>
                    <div>
                      <h2 className="mb-3 text-center font-label text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">
                        pick a style
                      </h2>
                      <FilterSelector
                        value={booth.filter}
                        onChange={booth.setFilter}
                        stream={camera.stream}
                        mirror={camera.isMirrored}
                      />
                    </div>

                    <div className="flex justify-center">
                      <TactileButton onClick={() => void booth.startSession()} variant="primary">
                        Start session
                      </TactileButton>
                    </div>
                  </>
                )
              )}
            </div>
          </>
        )}

        {isResultStage && (
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-8 text-center font-display text-4xl font-semibold text-ink sm:text-5xl">
              Look what we made ✦
            </h1>
            <PhotoboothStrip
              stripDataUrl={booth.stripDataUrl}
              customization={booth.customization}
              onChange={handleCustomize}
              isBusy={false}
            />
            <PhotoControls
              onDownload={handleDownload}
              onSave={() => void handleSave()}
              onRetake={booth.retake}
              onCreateAnother={booth.createAnother}
              savedSessionId={booth.savedSessionId}
              isSaving={isSaving}
            />
          </div>
        )}
      </div>
    </main>
  );
}
