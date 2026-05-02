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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    setImage(file);
    setStep("preview");
  };

  const analyzeImage = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await fetch("http://localhost:5000/api/ai/detect", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setResult(data);
      setStep("result");
    } catch (err) {
      console.error(err);
      alert("Failed to analyze image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white flex flex-col items-center p-4">
      {/* HEADER */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold">
          🌱 AI Disease Scanner
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Detect crop disease instantly using AI
        </p>
      </div>

      {/* STEP INDICATOR */}
      <div className="flex gap-3 mb-6 text-xs">
        {["camera", "preview", "result"].map((s, i) => (
          <div
            key={s}
            className={`px-3 py-1 rounded-full ${
              step === s
                ? "bg-green-500 text-white"
                : "bg-white/10 text-gray-400"
            }`}
          >
            {i + 1}. {s}
          </div>
        ))}
      </div>

      {/* MAIN CARD */}
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg">
        {/* CAMERA */}
        {step === "camera" && (
          <div className="text-center space-y-4">
            <CameraCapture onCapture={handleCapture} />

            <label className="block bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-lg cursor-pointer text-sm">
              📁 Upload from Gallery
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* PREVIEW */}
        {step === "preview" && (
          <ImagePreview
            image={image}
            onConfirm={analyzeImage}
            onRetake={() => setStep("camera")}
          />
        )}

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="h-10 w-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-400 text-sm">Analyzing your crop...</p>
          </div>
        )}

        {/* RESULT */}
        {step === "result" && (
          <div>
            <ResultCard result={result} image={image} />

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setStep("camera");
                  setImage(null);
                  setResult(null);
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-sm"
              >
                Scan Again
              </button>

              <button
                onClick={() =>
                  navigator.share?.({
                    title: "Crop Disease Result",
                    text: result?.solution,
                  })
                }
                className="flex-1 bg-green-500 hover:bg-green-600 py-2 rounded-lg text-sm"
              >
                Share
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER TIP */}
      <p className="text-xs text-gray-500 mt-6 text-center max-w-xs">
        Tip: Capture clear leaf images in good lighting for better accuracy
      </p>
    </div>
  );
}
