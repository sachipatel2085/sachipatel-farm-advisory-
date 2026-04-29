// components/CameraCapture.jsx
import { useRef } from "react";

export default function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    videoRef.current.srcObject = stream;
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        onCapture(blob);
      },
      "image/jpeg",
      0.8,
    );
  };

  return (
    <div className="p-4">
      <video ref={videoRef} autoPlay className="rounded-xl w-full" />
      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-3 mt-3">
        <button onClick={startCamera} className="btn">
          Start Camera
        </button>
        <button onClick={captureImage} className="btn-green">
          Capture
        </button>
      </div>
    </div>
  );
}
