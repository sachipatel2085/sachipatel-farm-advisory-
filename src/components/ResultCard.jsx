// components/ResultCard.jsx
export default function ResultCard({ result }) {
  return (
    <div className="p-4">
      <div className="bg-white/5 border border-green-500 rounded-xl p-4">
        <h2 className="text-xl text-green-400 font-bold">
          🌿 {result.disease}
        </h2>

        <pre className="mt-3 text-sm whitespace-pre-wrap">
          {result.solution}
        </pre>
      </div>
    </div>
  );
}
