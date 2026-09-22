import type { CameraFacing } from "@/types/photobooth";

export class CameraUnavailableError extends Error {
  constructor(message = "Camera is not available in this browser.") {
    super(message);
    this.name = "CameraUnavailableError";
  }
}

export class CameraPermissionError extends Error {
  constructor(message = "Camera permission was denied.") {
    super(message);
    this.name = "CameraPermissionError";
  }
}

/** True when the browser exposes the MediaDevices camera API at all. */
export function isCameraSupported(): boolean {
  return (
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === "function"
  );
}

interface StartCameraOptions {
  facing: CameraFacing;
  deviceId?: string;
}

/**
 * Requests a camera stream. Throws CameraUnavailableError / CameraPermissionError
 * with human-readable messages so the UI can show the right empty/error state.
 */
export async function startCameraStream({ facing, deviceId }: StartCameraOptions): Promise<MediaStream> {
  if (!isCameraSupported()) {
    throw new CameraUnavailableError(
      "This browser doesn't support camera access. Try Chrome, Edge, or Safari on a device with a camera."
    );
  }

  const constraints: MediaStreamConstraints = {
    audio: false,
    video: deviceId
      ? { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 1280 } }
      : { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 1280 } },
  };

  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (err) {
    const name = err instanceof Error ? err.name : "";
    if (name === "NotAllowedError" || name === "SecurityError" || name === "PermissionDeniedError") {
      throw new CameraPermissionError(
        "Camera access was blocked. Allow camera permission in your browser's address bar and try again."
      );
    }
    if (name === "NotFoundError" || name === "DevicesNotFoundError") {
      throw new CameraUnavailableError("No camera was found on this device.");
    }
    if (name === "NotReadableError" || name === "TrackStartError") {
      throw new CameraUnavailableError("Your camera is already in use by another app.");
    }
    throw new CameraUnavailableError("Couldn't start the camera. Please try again.");
  }
}

export function stopCameraStream(stream: MediaStream | null | undefined): void {
  stream?.getTracks().forEach((track) => track.stop());
}

/** Lists available video input devices (populated best-effort, requires prior permission on most browsers). */
export async function listVideoDevices(): Promise<MediaDeviceInfo[]> {
  if (!isCameraSupported() || !navigator.mediaDevices.enumerateDevices) return [];
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((d) => d.kind === "videoinput");
}

/** Whether the current stream/browser looks like it can flip between front & back cameras. */
export async function supportsCameraFlip(): Promise<boolean> {
  const devices = await listVideoDevices();
  return devices.length > 1;
}
