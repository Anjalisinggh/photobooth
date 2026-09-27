"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CameraPermissionError,
  CameraUnavailableError,
  isCameraSupported,
  startCameraStream,
  stopCameraStream,
} from "@/lib/camera";
import type { CameraFacing } from "@/types/photobooth";

export type CameraStatus = "idle" | "requesting" | "ready" | "denied" | "unavailable";

interface UseCameraResult {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  status: CameraStatus;
  errorMessage: string | null;
  facing: CameraFacing;
  isMirrored: boolean;
  /** The raw live stream, exposed so other elements (e.g. filter preview tiles) can mirror it. */
  stream: MediaStream | null;
  start: () => Promise<void>;
  stop: () => void;
  flipCamera: () => Promise<void>;
  canFlip: boolean;
}

/** Manages the camera stream lifecycle for a single <video> element. */
export function useCamera(): UseCameraResult {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraFacing>("user");
  const [canFlip, setCanFlip] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const attachStream = useCallback((nextStream: MediaStream) => {
    streamRef.current = nextStream;
    setStream(nextStream);
  }, []);

  // The <video> element only mounts once status becomes "ready", which happens
  // in the same update as `stream` being set — so it isn't in the DOM yet when
  // attachStream runs. Attach it here instead, once the element actually exists.
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const startWithFacing = useCallback(
    async (targetFacing: CameraFacing) => {
      if (!isCameraSupported()) {
        setStatus("unavailable");
        setErrorMessage("This browser doesn't support camera access.");
        return;
      }
      setStatus("requesting");
      setErrorMessage(null);
      try {
        stopCameraStream(streamRef.current);
        const stream = await startCameraStream({ facing: targetFacing });
        attachStream(stream);
        setStatus("ready");

        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          setCanFlip(devices.filter((d) => d.kind === "videoinput").length > 1);
        } catch {
          setCanFlip(false);
        }
      } catch (err) {
        if (err instanceof CameraPermissionError) {
          setStatus("denied");
          setErrorMessage(err.message);
        } else if (err instanceof CameraUnavailableError) {
          setStatus("unavailable");
          setErrorMessage(err.message);
        } else {
          setStatus("unavailable");
          setErrorMessage("Something went wrong starting the camera.");
        }
      }
    },
    [attachStream]
  );

  const start = useCallback(() => startWithFacing(facing), [startWithFacing, facing]);

  const stop = useCallback(() => {
    stopCameraStream(streamRef.current);
    streamRef.current = null;
    setStream(null);
    setStatus("idle");
  }, []);

  const flipCamera = useCallback(async () => {
    const next = facing === "user" ? "environment" : "user";
    setFacing(next);
    await startWithFacing(next);
  }, [facing, startWithFacing]);

  useEffect(() => {
    return () => stopCameraStream(streamRef.current);
  }, []);

  return {
    videoRef,
    status,
    errorMessage,
    facing,
    isMirrored: facing === "user",
    stream,
    start,
    stop,
    flipCamera,
    canFlip,
  };
}
