// pages/DiseaseScanner.jsx
import { useState } from "react";
import CameraCapture from "../components/CameraCapture";
import ImagePreview from "../components/ImagePreview";
import ResultCard from "../components/ResultCard";

export default function DiseaseScanner() {
  const [step, setStep] = useState("camera");
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCapture = (blob) => {
    setImage(blob);
    setStep("preview");
  };

  const analyzeImage = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    const res = await fetch("http://localhost:5000/api/ai/detect", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setResult(data);
    setStep("result");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <h1 className="text-2xl text-center p-4">🌱 AI Disease Scanner</h1>

      {step === "camera" && <CameraCapture onCapture={handleCapture} />}

      {step === "preview" && (
        <ImagePreview
          image={image}
          onConfirm={analyzeImage}
          onRetake={() => setStep("camera")}
        />
      )}

      {loading && (
        <p className="text-center mt-10 animate-pulse">Analyzing...</p>
      )}

      {step === "result" && <ResultCard result={result} />}
    </div>
  );
}
