import { useState } from "react";
import {
  ScanLine,
  Upload,
  Sparkles,
  RefreshCcw,
  Share2,
  X,
} from "lucide-react";

import CameraCapture from "../components/CameraCapture";
import ImagePreview from "../components/ImagePreview";
import ResultCard from "../components/ResultCard";

export default function DiseaseScanner() {
  const [step, setStep] = useState("camera");
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);

  /* HANDLE CAMERA CAPTURE */
  const handleCapture = (blob) => {
    setImage(blob);
    setStep("preview");
  };

  /* HANDLE GALLERY UPLOAD */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (!file || !file.type.startsWith("image/")) return;

    setImage(file);
    setStep("preview");
  };

  /* ANALYZE IMAGE */
  const analyzeImage = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ai/detect`, {
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

  const steps = ["Capture", "Preview", "Result"];

  return (
    <div className="min-h-screen bg-[#07111f] text-white px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* HERO */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-4">
            <Sparkles size={16} />
            AI Powered Detection
          </div>

          <h1 className="text-4xl font-bold tracking-tight">
            Smart Crop Disease Scanner
          </h1>

          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            Upload or capture a crop image and instantly detect diseases with
            AI-powered analysis and treatment recommendations.
          </p>
        </div>

        {/* PROGRESS */}
        <div className="flex items-center justify-center mb-8 overflow-x-auto">
          {steps.map((item, i) => {
            const active =
              (step === "camera" && i === 0) ||
              (step === "preview" && i === 1) ||
              (step === "result" && i === 2);

            return (
              <div key={item} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border transition-all
                  ${
                    active
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-white/5 border-white/10 text-gray-400"
                  }`}
                >
                  {i + 1}
                </div>

                <span className="mx-3 text-sm text-gray-400 whitespace-nowrap">
                  {item}
                </span>

                {i !== steps.length - 1 && (
                  <div className="w-10 sm:w-16 h-[1px] bg-white/10" />
                )}
              </div>
            );
          })}
        </div>

        {/* MAIN CARD */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
          {/* CAMERA STEP */}
          {step === "camera" && (
            <div className="p-6 lg:p-10">
              <div className="max-w-2xl mx-auto">
                {/* TITLE */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
                    Scan Plant Disease
                  </h2>

                  <p className="text-gray-400 leading-relaxed">
                    Capture a clear image of the affected crop leaf for accurate
                    AI-powered disease detection.
                  </p>
                </div>

                {/* TIPS */}
                <div className="bg-black/20 border border-white/10 rounded-2xl p-5 mb-8">
                  <h3 className="font-medium mb-4 text-green-400">
                    Best Results Tips
                  </h3>

                  <div className="space-y-3 text-sm text-gray-300">
                    <div>✔ Use natural daylight</div>
                    <div>✔ Focus on affected area</div>
                    <div>✔ Avoid blurry images</div>
                    <div>✔ Keep leaf centered in frame</div>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="space-y-4">
                  {/* OPEN CAMERA */}
                  <button
                    onClick={() => setCameraOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-green-500 hover:bg-green-600 transition font-medium text-lg"
                  >
                    <ScanLine size={20} />
                    Open Camera
                  </button>
                </div>
              </div>
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
            <div className="py-20 flex flex-col items-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-green-500/20"></div>

                <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin"></div>
              </div>

              <h3 className="mt-6 text-lg font-semibold">
                Analyzing Crop Health
              </h3>

              <p className="text-gray-400 text-sm mt-2">
                AI is detecting disease patterns...
              </p>
            </div>
          )}

          {/* RESULT */}
          {step === "result" && (
            <div className="p-5 lg:p-8">
              <ResultCard result={result} image={image} />

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  onClick={() => {
                    setStep("camera");
                    setImage(null);
                    setResult(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/15 transition border border-white/10"
                >
                  <RefreshCcw size={18} />
                  Scan Again
                </button>

                <button
                  onClick={() =>
                    navigator.share?.({
                      title: "Crop Disease Result",
                      text: result?.solution,
                    })
                  }
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 hover:bg-green-600 transition font-medium"
                >
                  <Share2 size={18} />
                  Share Report
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Powered by AI crop intelligence system
        </div>
      </div>
      {/* CAMERA OVERLAY */}
      {/* CAMERA OVERLAY */}
      {cameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#07111f] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
              {" "}
              {/* HEADER */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h2 className="text-lg font-semibold">Capture Crop Image</h2>

                <button
                  onClick={() => setCameraOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center transition"
                >
                  <X size={18} />
                </button>
              </div>
              {/* CONTENT */}
              <div className="p-4">
                {/* CAMERA */}
                <CameraCapture
                  onCapture={(blob) => {
                    handleCapture(blob);
                    setCameraOpen(false);
                  }}
                />

                {/* GALLERY */}
                <label className="mt-4 flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/10 hover:bg-white/15 transition cursor-pointer border border-white/10 font-medium">
                  <Upload size={18} />
                  Upload From Gallery
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handleFileUpload(e);
                      setCameraOpen(false);
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}{" "}
    </div>
  );
}
