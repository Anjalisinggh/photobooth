"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const galleryInputRef = useRef<HTMLInputElement>(null);

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

  const handleGalleryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      e.target.value = "";
      if (files.length > 0) void booth.importPhotos(files);
    },
    [booth]
  );

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

        {!isResultStage && (
          <p className="mb-6 text-center font-hand text-2xl text-cocoa/80">{STAGE_COPY[booth.stage]}</p>
        )}

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

                  <div className="flex flex-col items-center gap-3">
                    {camera.status === "ready" && (
                      <>
                        <TactileButton onClick={() => void booth.startSession()} variant="primary">
                          Start session
                        </TactileButton>
                        <span className="font-hand text-lg text-muted">or</span>
                      </>
                    )}
                    <TactileButton onClick={() => galleryInputRef.current?.click()} variant="secondary">
                      Upload from gallery
                    </TactileButton>
                    <span className="max-w-xs text-center font-body text-xs leading-snug text-muted">
                      Pick up to {booth.totalPhotos} photos already on your device.
                    </span>
                    <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleGalleryChange}
                    />
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {isResultStage && (
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 text-center">
              <h1 className="font-script text-6xl leading-none text-ink sm:text-7xl">
                {booth.stage === "saved" ? "tucked away safely" : "look what we made"}
              </h1>
              <p className="mt-3 font-label text-[11px] font-semibold uppercase tracking-[0.3em] text-ink/50">
                {booth.stage === "saved" ? "saved to my photos ✦" : "fresh out of the printer ✦"}
              </p>
            </div>
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
