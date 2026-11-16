import React from "react";
import {
  Leaf,
  Activity,
  AlertTriangle,
  FlaskConical,
  ShieldCheck,
  Sprout,
  Database,
  CheckCircle2,
  Package,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

/* Helper: parse legacy AI text into sections if structured DB advisory is not attached */
const parseSolution = (text = "") => {
  const sections = {
    cause: "",
    treatment: "",
    organic: "",
    prevention: "",
  };

  const lines = text.split("\n");
  let current = null;

  lines.forEach((line) => {
    const l = line.toLowerCase().trim();

    if (l.includes("cause")) current = "cause";
    else if (l.includes("treatment")) current = "treatment";
    else if (l.includes("organic")) current = "organic";
    else if (l.includes("prevention")) current = "prevention";
    else if (current && line.trim() !== "") {
      sections[current] += line + "\n";
    }
  });

  return sections;
};

const getSeverityBadge = (severity = "") => {
  switch (severity.toLowerCase()) {
    case "critical":
      return "bg-rose-500/20 text-rose-300 border-rose-500/30";
    case "high":
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    case "medium":
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    case "low":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    case "none":
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    default:
      return "bg-white/10 text-gray-300 border-white/10";
  }
};

export default function ResultCard({
  result,
  image,
  otherCandidates = [],
  onSelectCandidate,
  onBackToConfirm,
}) {
  if (!result) return null;

  const advisory = result.advisory;
  const legacySections = parseSolution(result.solution);
  const symptoms =
    (advisory?.symptoms && advisory.symptoms.length > 0)
      ? advisory.symptoms
      : result.symptoms || [];

  return (
    <div className="p-2 sm:p-4 max-w-3xl mx-auto space-y-5">
      {/* CROP IMAGE */}
      {image && (
        <div className="relative rounded-2xl overflow-hidden border border-white/10 max-h-72 w-full bg-slate-900">
          <img
            src={typeof image === "string" ? image : URL.createObjectURL(image)}
            alt="Scanned leaf"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
              <Database size={13} /> Verified Database Advice
            </span>
          </div>

          {onBackToConfirm && (
            <button
              onClick={onBackToConfirm}
              className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-black/70 hover:bg-black/90 backdrop-blur-md text-gray-200 border border-white/20 transition"
            >
              <ArrowLeft size={13} /> Back to Confirm Diagnosis
            </button>
          )}
        </div>
      )}

      {/* MAIN RESULT CONTAINER */}
      <div className="bg-white/[0.03] border border-emerald-500/30 rounded-2xl p-4 sm:p-6 space-y-5 backdrop-blur-xl">
        {/* HEADER & SEVERITY */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Leaf size={22} />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                  {advisory?.name || result.displayName || result.disease}
                </h2>
                {(advisory?.scientificName || result.scientificName) && (
                  <p className="text-xs italic text-gray-400">
                    Pathogen: {advisory?.scientificName || result.scientificName}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
            {(advisory?.category || result.category) && (
              <span className="text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold bg-white/10 text-gray-200 border border-white/10">
                {advisory?.category || result.category}
              </span>
            )}
            {(advisory?.severity || result.severity) && (
              <span
                className={`text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-bold border ${getSeverityBadge(
                  advisory?.severity || result.severity
                )}`}
              >
                {(advisory?.severity || result.severity) === "none"
                  ? "Healthy"
                  : `${advisory?.severity || result.severity} Severity`}
              </span>
            )}
          </div>
        </div>

        {/* CONFIDENCE BAR (IF SCANNED VIA ML) */}
        {result.confidence !== undefined && (
          <div className="space-y-1.5 bg-black/20 p-3.5 rounded-xl border border-white/5">
            <div className="flex justify-between text-xs text-gray-300">
              <span className="flex items-center gap-1.5">
                <Activity size={14} className="text-emerald-400" />
                Diagnostic Confidence
              </span>
              <span className="font-bold text-emerald-400">
                {result.confidence}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, result.confidence)}%` }}
              />
            </div>
          </div>
        )}

        {/* SYMPTOMS SECTION */}
        {symptoms.length > 0 && (
          <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
              <CheckCircle2 size={16} /> Key Visual Symptoms
            </h3>
            <ul className="space-y-1.5 text-xs text-gray-300 list-disc list-inside leading-relaxed">
              {symptoms.map((symptom, idx) => (
                <li key={idx} className="marker:text-emerald-400">
                  {symptom}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* STRUCTURED DATABASE ADVISORY SECTIONS */}
        <div className="space-y-3.5">
          {/* 1. CAUSE */}
          <SectionCard
            icon={<AlertTriangle size={17} className="text-amber-400" />}
            title="Cause & Environmental Conditions"
            content={advisory?.cause || legacySections.cause}
            borderColor="border-amber-500/20"
            bgHeader="bg-amber-500/10 text-amber-300"
          />

          {/* 2. CHEMICAL TREATMENT & DOSAGE */}
          {(advisory?.chemicalTreatment || legacySections.treatment) && (
            <SectionCard
              icon={<FlaskConical size={17} className="text-rose-400" />}
              title="Curative Chemical Treatment & Dosages (Per 15L Spray Pump)"
              content={advisory?.chemicalTreatment || legacySections.treatment}
              borderColor="border-rose-500/20"
              bgHeader="bg-rose-500/10 text-rose-300"
            />
          )}

          {/* 3. ORGANIC SOLUTION */}
          {(advisory?.organicSolution || legacySections.organic) && (
            <SectionCard
              icon={<Sprout size={17} className="text-emerald-400" />}
              title="Organic Remedies & Bio-Control Measures"
              content={advisory?.organicSolution || legacySections.organic}
              borderColor="border-emerald-500/20"
              bgHeader="bg-emerald-500/10 text-emerald-300"
            />
          )}

          {/* 4. PREVENTION */}
          {(advisory?.prevention || legacySections.prevention) && (
            <SectionCard
              icon={<ShieldCheck size={17} className="text-sky-400" />}
              title="Preventive Agronomic Measures"
              content={advisory?.prevention || legacySections.prevention}
              borderColor="border-sky-500/20"
              bgHeader="bg-sky-500/10 text-sky-300"
            />
          )}
        </div>

        {/* RECOMMENDED PRODUCTS TABLE */}
        {advisory?.recommendedProducts && advisory.recommendedProducts.length > 0 && (
          <div className="bg-slate-900/80 border border-white/10 rounded-xl p-4 space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
              <Package size={16} className="text-teal-400" /> Recommended Agricultural Formulations & Dosages
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {advisory.recommendedProducts.map((p, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/5 rounded-xl p-3 space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-white truncate">
                      {p.name}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded uppercase font-semibold ${
                        p.productType === "organic"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : p.productType === "nutrient"
                          ? "bg-sky-500/20 text-sky-300"
                          : p.productType === "tool"
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-rose-500/20 text-rose-300"
                      }`}
                    >
                      {p.productType}
                    </span>
                  </div>
                  {p.dosage && (
                    <p className="text-xs text-emerald-300 font-medium">
                      Dose: {p.dosage}
                    </p>
                  )}
                  {p.applicationNotes && (
                    <p className="text-[11px] text-gray-400">
                      {p.applicationNotes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LIST OF OTHER DISEASES SHOWN ON CONFIRM DIAGNOSIS PAGE */}
        {otherCandidates && otherCandidates.length > 0 && (
          <div className="bg-black/30 border border-white/10 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <AlertTriangle size={15} className="text-amber-400" />
                  Other Probable Diseases Detected
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  These alternative diagnoses were detected during the confirm diagnosis step:
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {otherCandidates.map((cand, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 transition"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-white">
                        {cand.displayName || cand.disease}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {cand.confidence}% Match
                      </span>
                      {cand.severity && (
                        <span className="text-[10px] px-2 py-0.5 rounded uppercase font-bold bg-white/5 text-gray-300 border border-white/10">
                          {cand.severity}
                        </span>
                      )}
                    </div>
                    {cand.symptoms && cand.symptoms.length > 0 && (
                      <p className="text-[11px] text-gray-400 line-clamp-1">
                        Symptom: {cand.symptoms[0]}
                      </p>
                    )}
                  </div>

                  {onSelectCandidate && (
                    <button
                      onClick={() => onSelectCandidate(cand)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-medium transition shrink-0 self-end sm:self-center shadow-md shadow-emerald-600/15"
                    >
                      View Diagnosis & Treatment <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* Reusable section card */
const SectionCard = ({
  icon,
  title,
  content,
  borderColor = "border-white/10",
  bgHeader = "text-emerald-400",
}) => {
  if (!content || !content.trim()) return null;

  return (
    <div className={`bg-slate-900/70 border ${borderColor} rounded-xl p-4 space-y-2`}>
      <h3 className={`flex items-center gap-2 text-xs sm:text-sm font-semibold ${bgHeader}`}>
        {icon} {title}
      </h3>
      <p className="text-gray-300 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
        {content.trim()}
      </p>
    </div>
  );
};
