import { useState } from "react";
import {
  ScanLine,
  Upload,
  RefreshCcw,
  Share2,
  X,
  AlertTriangle,
  Database,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Activity,
  Stethoscope,
  Sparkles,
} from "lucide-react";

import CameraCapture from "../components/CameraCapture";
import ImagePreview from "../components/ImagePreview";
import ResultCard from "../components/ResultCard";

export default function DiseaseScanner() {
  // Steps: "camera" | "preview" | "confirm" | "diagnosis"
  const [step, setStep] = useState("camera");
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  /* HANDLE CAMERA CAPTURE */
  const handleCapture = (blob) => {
    setImage(blob);
    setErrorMsg(null);
    setStep("preview");
  };

  /* HANDLE GALLERY UPLOAD */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    setImage(file);
    setErrorMsg(null);
    setStep("preview");
  };

  /* ANALYZE IMAGE USING BACKEND & OUR OWN DATABASE */
  const analyzeImage = async () => {
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/ai/detect`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || data.details || "Disease detection failed"
        );
      }

      setResult(data);

      // Prepare probable diseases candidates list
      const candidates =
        data.probable_diseases && data.probable_diseases.length > 0
          ? data.probable_diseases
          : data.top_predictions && data.top_predictions.length > 0
          ? data.top_predictions
          : [
              {
                disease: data.disease,
                displayName: data.disease,
                confidence: data.confidence || 85,
                symptoms: data.advisory?.symptoms || [],
                advisory: data.advisory,
                solution: data.solution,
              },
            ];

      // Default the selected candidate to the primary predicted disease
      setSelectedCandidate(candidates[0]);

      // Move to Step 2: Confirm Diagnosis
      setStep("confirm");
    } catch (err) {
      console.error("Analysis error:", err);
      setErrorMsg(
        err.message ||
          "Failed to connect to image detection server. Please check connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* USER SELECTS A DIAGNOSIS FROM CONFIRM DIAGNOSIS STEP */
  const handleSelectDiagnosis = (candidate) => {
    setSelectedCandidate(candidate);
    setStep("diagnosis");
  };

  // Get list of probable candidates
  const candidatesList =
    result?.probable_diseases && result.probable_diseases.length > 0
      ? result.probable_diseases
      : result?.top_predictions && result.top_predictions.length > 0
      ? result.top_predictions
      : selectedCandidate
      ? [selectedCandidate]
      : [];

  // Filter out the currently selected candidate for the "other diseases" list
  const otherCandidates = candidatesList.filter(
    (c) =>
      (c.disease || c.displayName) !==
      (selectedCandidate?.disease || selectedCandidate?.displayName)
  );

  return (
    <div className="space-y-6 text-white w-full max-w-5xl mx-auto min-w-0 py-2 sm:py-4">
      {/* HERO SECTION */}
      <div className="text-center mb-5 sm:mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm mb-3 font-medium">
          <Stethoscope size={15} />
          Plant Doctor & Crop Health
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
          Plant Pests and Disease Detection
        </h1>

        <p className="text-gray-400 mt-2 text-xs sm:text-sm max-w-2xl mx-auto">
          Scan your infected crop leaf to identify diseases, compare symptoms, and get exact medicine spray mixtures per 15L water pump.
        </p>
      </div>

      {/* 3-STEP USER WORKFLOW GUIDE: Take Picture -> See Diagnosis -> Get Medicine */}
      <div className="bg-[#131d2e] border border-white/[0.08] rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-2xl mx-auto text-xs sm:text-sm">
          {/* Step 1: Take Picture */}
          <div
            onClick={() => {
              if (step === "preview" || step === "confirm" || step === "diagnosis") {
                setStep("camera");
                setImage(null);
                setResult(null);
                setSelectedCandidate(null);
              }
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
            title="Step 1: Take Picture"
          >
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step === "camera" || step === "preview"
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              }`}
            >
              1
            </div>
            <div>
              <p
                className={`font-semibold text-xs sm:text-sm ${
                  step === "camera" || step === "preview"
                    ? "text-emerald-400"
                    : "text-gray-300"
                }`}
              >
                Take Picture
              </p>
              <p className="text-[11px] text-gray-500 hidden sm:block">Camera or Gallery</p>
            </div>
          </div>

          <span className="text-gray-600 font-bold px-1 sm:px-3">→</span>

          {/* Step 2: Confirm Diagnosis */}
          <div
            onClick={() => {
              if (result && step === "diagnosis") {
                setStep("confirm");
              }
            }}
            className={`flex items-center gap-2.5 ${
              result ? "cursor-pointer" : "cursor-default opacity-50"
            }`}
            title="Step 2: Confirm Diagnosis"
          >
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step === "confirm"
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                  : step === "diagnosis"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-white/5 text-gray-400 border border-white/10"
              }`}
            >
              2
            </div>
            <div>
              <p
                className={`font-semibold text-xs sm:text-sm ${
                  step === "confirm" ? "text-emerald-400" : "text-gray-300"
                }`}
              >
                Confirm Symptoms
              </p>
              <p className="text-[11px] text-gray-500 hidden sm:block">Compare Symptoms</p>
            </div>
          </div>

          <span className="text-gray-600 font-bold px-1 sm:px-3">→</span>

          {/* Step 3: Get Medicine */}
          <div
            className={`flex items-center gap-2.5 ${
              step === "diagnosis" ? "opacity-100" : "opacity-50"
            }`}
            title="Step 3: Get Medicine & Treatment"
          >
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step === "diagnosis"
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                  : "bg-white/5 text-gray-400 border border-white/10"
              }`}
            >
              3
            </div>
            <div>
              <p
                className={`font-semibold text-xs sm:text-sm ${
                  step === "diagnosis" ? "text-emerald-400" : "text-gray-300"
                }`}
              >
                Get Medicine
              </p>
              <p className="text-[11px] text-gray-500 hidden sm:block">Spray & Dosages</p>
            </div>
          </div>
        </div>
      </div>

      {/* ERROR ALERT */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white">Detection Notice</h4>
              <p className="text-xs text-amber-200/90 mt-0.5">{errorMsg}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setErrorMsg(null);
              setStep("camera");
              setImage(null);
            }}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold rounded-lg transition shrink-0"
          >
            Try Again
          </button>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="bg-[#131d2e] border border-white/[0.08] rounded-2xl shadow-xl overflow-hidden">
        {/* ============================================================== */}
        {/* STEP 1: CAMERA CAPTURE / UPLOAD                                */}
        {/* ============================================================== */}
        {step === "camera" && (
          <div className="p-5 sm:p-8 lg:p-10">
            <div className="max-w-xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Take a Clear Photo of the Leaf
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  Hold your camera steady over the damaged or spotted crop leaf, or select a photo from your gallery.
                </p>
              </div>

              {/* PHOTOGRAPHY RECOMMENDATIONS */}
              <div className="bg-[#0b111e] border border-white/[0.06] rounded-xl p-4">
                <h3 className="font-semibold text-xs sm:text-sm mb-2.5 text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck size={16} /> Tips for Accurate Detection
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>Good natural daylight</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>Center the infected spot</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>Keep camera in focus</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>Check top & underside of leaf</span>
                  </div>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setCameraOpen(true)}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition font-semibold text-sm text-white shadow-md shadow-emerald-600/20 active:scale-[0.99]"
                >
                  <ScanLine size={18} />
                  Open Camera
                </button>

                <label className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1e2c45] hover:bg-[#253754] text-gray-200 transition cursor-pointer border border-white/10 font-medium text-sm active:scale-[0.99]">
                  <Upload size={18} />
                  Choose from Gallery
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1.5: IMAGE PREVIEW */}
        {step === "preview" && (
          <ImagePreview
            image={image}
            onConfirm={analyzeImage}
            onRetake={() => {
              setStep("camera");
              setImage(null);
              setErrorMsg(null);
            }}
          />
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="py-16 sm:py-20 flex flex-col items-center">
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-4 border-emerald-500/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
            </div>
            <h3 className="mt-5 text-sm sm:text-base font-semibold text-white">
              Checking Leaf Symptoms & Finding Probable Diseases...
            </h3>
            <p className="text-gray-400 text-xs mt-1.5 text-center max-w-sm px-4">
              Comparing visual patterns against our verified agricultural disease database.
            </p>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 2: CONFIRM DIAGNOSIS                                      */}
        {/* ============================================================== */}
        {step === "confirm" && !loading && (
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            {/* STEP HEADER */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <Stethoscope size={14} /> Step 2: Confirm Symptoms
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Which disease looks like your crop?
              </h2>
              <p className="text-xs sm:text-sm text-gray-300">
                Compare the symptoms below with your plant leaf, then click <strong>&quot;See Diagnosis & Medicine&quot;</strong> on the matching disease.
              </p>
            </div>

            {/* SCANNED LEAF PREVIEW BAR */}
            {image && (
              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#0b111e] border border-white/[0.08] max-w-2xl mx-auto">
                <img
                  src={typeof image === "string" ? image : URL.createObjectURL(image)}
                  alt="Scanned crop"
                  className="w-14 h-14 rounded-lg object-cover border border-white/10 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white">Your Scanned Leaf</p>
                  <p className="text-[11px] text-gray-400 truncate">
                    Found {candidatesList.length} possible matching conditions.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setStep("camera");
                    setImage(null);
                    setResult(null);
                    setSelectedCandidate(null);
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition shrink-0"
                >
                  Retake Photo
                </button>
              </div>
            )}

            {/* CANDIDATES LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {candidatesList.map((candidate, idx) => {
                const isTopMatch = idx === 0;
                const symptomsList =
                  candidate.symptoms && candidate.symptoms.length > 0
                    ? candidate.symptoms
                    : candidate.advisory?.symptoms || [
                        "Leaf discoloration and visible surface spots",
                        "Signs of plant stress or foliage decay",
                      ];

                return (
                  <div
                    key={candidate.disease || idx}
                    className={`rounded-xl p-5 border transition-all flex flex-col justify-between space-y-4 ${
                      isTopMatch
                        ? "bg-[#18263f] border-emerald-500/50 shadow-md shadow-emerald-950/40"
                        : "bg-[#0f172a] border-white/[0.08] hover:border-white/20"
                    }`}
                  >
                    <div className="space-y-3">
                      {/* CARD HEADER */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          {isTopMatch && (
                            <span className="inline-block text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-1.5">
                              Most Likely Match
                            </span>
                          )}
                          <h3 className="text-lg font-bold text-white tracking-wide">
                            {candidate.displayName || candidate.disease}
                          </h3>
                          {candidate.scientificName && (
                            <p className="text-xs italic text-gray-400">
                              {candidate.scientificName}
                            </p>
                          )}
                        </div>

                        {/* CONFIDENCE BADGE */}
                        <div className="text-right shrink-0">
                          <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                            {candidate.confidence}% Match
                          </span>
                        </div>
                      </div>

                      {/* CONFIDENCE BAR */}
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${Math.min(100, candidate.confidence)}%` }}
                        />
                      </div>

                      {/* SYMPTOMS SECTION */}
                      <div className="space-y-2 pt-1">
                        <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 size={14} /> Symptoms to look for:
                        </p>
                        <ul className="space-y-1 text-xs text-gray-300">
                          {symptomsList.slice(0, 3).map((sym, sIdx) => (
                            <li key={sIdx} className="flex items-start gap-1.5 leading-relaxed">
                              <span className="text-emerald-400 font-bold shrink-0">•</span>
                              <span>{sym}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* SELECT & SEE DIAGNOSIS BUTTON */}
                    <button
                      onClick={() => handleSelectDiagnosis(candidate)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 shadow-sm ${
                        isTopMatch
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                          : "bg-white/10 hover:bg-white/15 text-white border border-white/10"
                      }`}
                    >
                      <span>See Diagnosis & Get Medicine</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* HELPER FOOTER */}
            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  setStep("camera");
                  setImage(null);
                  setResult(null);
                }}
                className="text-xs text-gray-400 hover:text-white inline-flex items-center gap-1.5 transition"
              >
                <ArrowLeft size={13} />
                <span>Symptoms don&apos;t match? Take another photo</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 3: DIAGNOSIS & MEDICINE                                   */}
        {/* ============================================================== */}
        {step === "diagnosis" && !loading && (
          <div className="p-4 lg:p-6 space-y-4">
            <ResultCard
              result={selectedCandidate || result}
              image={image}
              otherCandidates={otherCandidates}
              onSelectCandidate={(cand) => setSelectedCandidate(cand)}
              onBackToConfirm={() => setStep("confirm")}
            />

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto pt-2">
              <button
                onClick={() => setStep("confirm")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition border border-white/10 text-xs sm:text-sm font-medium"
              >
                <ArrowLeft size={16} />
                Back to Confirm Diagnosis
              </button>

              <button
                onClick={() => {
                  setStep("camera");
                  setImage(null);
                  setResult(null);
                  setSelectedCandidate(null);
                  setErrorMsg(null);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition border border-white/10 text-xs sm:text-sm font-medium"
              >
                <RefreshCcw size={16} />
                Take Another Picture
              </button>

              <button
                onClick={() =>
                  navigator.share?.({
                    title: `${selectedCandidate?.displayName || selectedCandidate?.disease} Diagnosis`,
                    text:
                      selectedCandidate?.solution ||
                      selectedCandidate?.advisory?.chemicalTreatment ||
                      "Plant Pests and Disease Detection Report",
                  })
                }
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-600/20"
              >
                <Share2 size={16} />
                Share Report
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CAMERA OVERLAY */}
      {cameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#07111f] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h2 className="text-base font-semibold">Capture Crop Leaf</h2>
                <button
                  onClick={() => setCameraOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center transition"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-4">
                <CameraCapture
                  onCapture={(blob) => {
                    handleCapture(blob);
                    setCameraOpen(false);
                  }}
                />

                <label className="mt-3.5 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/15 transition cursor-pointer border border-white/10 font-medium text-xs">
                  <Upload size={16} />
                  Choose from Gallery
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
      )}
    </div>
  );
}
