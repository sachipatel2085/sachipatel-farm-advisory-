import {
  Leaf,
  Activity,
  AlertTriangle,
  FlaskConical,
  ShieldCheck,
  Sprout,
} from "lucide-react";

/* 🔹 Helper: parse AI text into sections */
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
export default function ResultCard({ result, image }) {
  if (!result) return null;

  const sections = parseSolution(result.solution);

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      {/* IMAGE */}
      {image && (
        <img
          src={URL.createObjectURL(image)}
          alt="crop"
          className="rounded-xl max-h-60 w-full object-cover border border-white/10"
        />
      )}

      <div className="mt-5 bg-white/5 border border-green-500/30 rounded-2xl p-5 space-y-5">
        {/* DISEASE */}
        <div className="flex items-center gap-2 text-green-400">
          <Leaf size={20} />
          <h2 className="text-lg font-semibold">{result.disease}</h2>
        </div>

        {/* CONFIDENCE */}
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span className="flex items-center gap-1">
              <Activity size={14} /> Confidence
            </span>
            <span>{result.confidence}%</span>
          </div>

          <div className="w-full h-2 bg-white/10 rounded-full">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${result.confidence}%` }}
            />
          </div>
        </div>

        {/* TOP PREDICTIONS */}
        {result.top_predictions?.length > 1 && (
          <div>
            <p className="flex items-center gap-1 text-xs text-gray-400 mb-2">
              <AlertTriangle size={14} /> Other possibilities
            </p>

            <div className="space-y-2">
              {result.top_predictions.slice(1).map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between text-xs bg-white/5 px-3 py-2 rounded-lg border border-white/10"
                >
                  <span>{item.disease.replace(/_/g, " ")}</span>
                  <span className="text-gray-400">{item.confidence}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🔥 STRUCTURED SOLUTION */}
        <div className="space-y-4">
          {/* CAUSE */}
          {sections.cause && (
            <SectionCard
              icon={<AlertTriangle size={16} />}
              title="Cause"
              content={sections.cause}
            />
          )}

          {/* TREATMENT */}
          {sections.treatment && (
            <SectionCard
              icon={<FlaskConical size={16} />}
              title="Treatment"
              content={sections.treatment}
            />
          )}

          {/* ORGANIC */}
          {sections.organic && (
            <SectionCard
              icon={<Sprout size={16} />}
              title="Organic Solution"
              content={sections.organic}
            />
          )}

          {/* PREVENTION */}
          {sections.prevention && (
            <SectionCard
              icon={<ShieldCheck size={16} />}
              title="Prevention"
              content={sections.prevention}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* 🔹 Reusable section card */
const SectionCard = ({ icon, title, content }) => (
  <div className="bg-black/30 border border-white/10 rounded-lg p-3">
    <h3 className="flex items-center gap-2 text-green-400 text-sm font-medium mb-1">
      {icon} {title}
    </h3>
    <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
      {content.trim()}
    </p>
  </div>
);
