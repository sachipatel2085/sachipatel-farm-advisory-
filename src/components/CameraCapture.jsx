import { useRef, useState, useEffect } from "react";
import { Aperture } from "lucide-react";

export default function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);

  useEffect(() => {
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
        },
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error(err);
      alert("Unable to access camera");
    }
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
      0.9,
    );
  };

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black aspect-[3/4]">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <button
        onClick={captureImage}
        className="mt-4 w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-green-500 hover:bg-green-600 transition font-medium"
      >
        <Aperture size={18} />
        Capture Image
      </button>
    </div>
  );
}
