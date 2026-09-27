"use client";

import { useCallback, useRef, useState } from "react";
import { applyFilterToImage, composeStrip, loadImage } from "@/lib/photoProcessing";
import { saveSession as persistSession } from "@/lib/storage";
import { playCompletionChime, playShutterSound } from "@/lib/sound";
import {
  CapturedPhoto,
  FilterDefinition,
  FilterId,
  PHOTOS_PER_SESSION,
  PhotoboothSession,
  StripCustomization,
  defaultCustomization,
  getFilter,
} from "@/types/photobooth";

export type SessionStage =
  | "style-select"
  | "countdown"
  | "flash"
  | "captured"
  | "generating"
  | "reviewing"
  | "saved";

const COUNTDOWN_START = 3;
const TICK_MS = 750;
const FLASH_MS = 220;
const CAPTURED_PAUSE_MS = 650;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface UsePhotoboothArgs {
  captureFrame: (filter: FilterDefinition) => string;
}

interface UsePhotoboothResult {
  stage: SessionStage;
  countdown: number | null;
  photoIndex: number;
  totalPhotos: number;
  photos: CapturedPhoto[];
  filter: FilterId;
  setFilter: (id: FilterId) => void;
  customization: StripCustomization;
  updateCustomization: (patch: Partial<StripCustomization>) => void;
  stripDataUrl: string | null;
  isBusy: boolean;
  startSession: () => Promise<void>;
  retake: () => void;
  createAnother: () => void;
  regenerateStrip: (override?: StripCustomization) => Promise<void>;
  saveToLibrary: () => Promise<string | null>;
  savedSessionId: string | null;
  importPhotos: (files: File[]) => Promise<void>;
}

export function usePhotobooth({ captureFrame }: UsePhotoboothArgs): UsePhotoboothResult {
  const [stage, setStage] = useState<SessionStage>("style-select");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [filter, setFilter] = useState<FilterId>("original");
  const [customization, setCustomization] = useState<StripCustomization>(defaultCustomization());
  const [stripDataUrl, setStripDataUrl] = useState<string | null>(null);
  const [savedSessionId, setSavedSessionId] = useState<string | null>(null);

  const runTokenRef = useRef(0);

  const updateCustomization = useCallback((patch: Partial<StripCustomization>) => {
    setCustomization((prev) => ({ ...prev, ...patch }));
  }, []);

  const runSequence = useCallback(
    async (token: number) => {
      const captured: CapturedPhoto[] = [];
      const activeFilter = getFilter(filter);

      for (let i = 0; i < PHOTOS_PER_SESSION; i++) {
        if (runTokenRef.current !== token) return;
        setPhotoIndex(i);
        setStage("countdown");

        for (let n = COUNTDOWN_START; n >= 1; n--) {
          if (runTokenRef.current !== token) return;
          setCountdown(n);
          await delay(TICK_MS);
        }

        if (runTokenRef.current !== token) return;
        setCountdown(null);
        setStage("flash");
        playShutterSound();

        const dataUrl = captureFrame(activeFilter);
        captured.push({ id: crypto.randomUUID(), dataUrl, takenAt: Date.now() });
        setPhotos([...captured]);

        await delay(FLASH_MS);
        if (runTokenRef.current !== token) return;
        setStage("captured");
        await delay(CAPTURED_PAUSE_MS);
      }

      if (runTokenRef.current !== token) return;
      setStage("generating");
      const finalCustomization: StripCustomization = { ...customization, filter };
      setCustomization(finalCustomization);
      const strip = await composeStrip(
        captured.map((p) => p.dataUrl),
        finalCustomization
      );
      if (runTokenRef.current !== token) return;
      setStripDataUrl(strip);
      setStage("reviewing");
      playCompletionChime();
    },
    [captureFrame, customization, filter]
  );

  const startSession = useCallback(async () => {
    const token = ++runTokenRef.current;
    setPhotos([]);
    setStripDataUrl(null);
    setSavedSessionId(null);
    setPhotoIndex(0);
    await runSequence(token);
  }, [runSequence]);

  const retake = useCallback(() => {
    runTokenRef.current++;
    setStage("style-select");
    setPhotos([]);
    setStripDataUrl(null);
    setCountdown(null);
    setSavedSessionId(null);
    setPhotoIndex(0);
  }, []);

  const createAnother = useCallback(() => {
    runTokenRef.current++;
    setStage("style-select");
    setPhotos([]);
    setStripDataUrl(null);
    setCountdown(null);
    setSavedSessionId(null);
    setPhotoIndex(0);
    setCustomization(defaultCustomization());
  }, []);

  const importPhotos = useCallback(
    async (files: File[]) => {
      const selected = files.slice(0, PHOTOS_PER_SESSION);
      if (selected.length === 0) return;

      const token = ++runTokenRef.current;
      setPhotos([]);
      setStripDataUrl(null);
      setSavedSessionId(null);
      setPhotoIndex(0);
      setStage("generating");

      const activeFilter = getFilter(filter);
      const captured: CapturedPhoto[] = [];

      for (const file of selected) {
        if (runTokenRef.current !== token) return;
        const objectUrl = URL.createObjectURL(file);
        try {
          const img = await loadImage(objectUrl);
          if (runTokenRef.current !== token) return;
          const dataUrl = applyFilterToImage(img, activeFilter);
          captured.push({ id: crypto.randomUUID(), dataUrl, takenAt: Date.now() });
          setPhotos([...captured]);
        } finally {
          URL.revokeObjectURL(objectUrl);
        }
      }

      if (runTokenRef.current !== token || captured.length === 0) return;
      const finalCustomization: StripCustomization = { ...customization, filter };
      setCustomization(finalCustomization);
      const strip = await composeStrip(
        captured.map((p) => p.dataUrl),
        finalCustomization
      );
      if (runTokenRef.current !== token) return;
      setStripDataUrl(strip);
      setStage("reviewing");
      playCompletionChime();
    },
    [filter, customization]
  );

  const regenerateStrip = useCallback(
    async (override?: StripCustomization) => {
      if (photos.length === 0) return;
      const target = override ?? customization;
      const strip = await composeStrip(
        photos.map((p) => p.dataUrl),
        target
      );
      setStripDataUrl(strip);
    },
    [photos, customization]
  );

  const saveToLibrary = useCallback(async (): Promise<string | null> => {
    if (!stripDataUrl || photos.length === 0) return null;
    const session: PhotoboothSession = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      filter,
      layout: customization.layout,
      photos,
      stripDataUrl,
      customization,
    };
    try {
      await persistSession(session);
      setSavedSessionId(session.id);
      setStage("saved");
      return session.id;
    } catch {
      return null;
    }
  }, [stripDataUrl, photos, filter, customization]);

  return {
    stage,
    countdown,
    photoIndex,
    totalPhotos: PHOTOS_PER_SESSION,
    photos,
    filter,
    setFilter,
    customization,
    updateCustomization,
    stripDataUrl,
    isBusy: stage === "countdown" || stage === "flash" || stage === "generating",
    startSession,
    retake,
    createAnother,
    regenerateStrip,
    saveToLibrary,
    savedSessionId,
    importPhotos,
  };
}
