export default function ImagePreview({ image, onConfirm, onRetake }) {
  return (
    <div className="p-6 flex flex-col items-center">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 w-full max-w-md">
        <img
          src={image ? URL.createObjectURL(image) : ""}
          alt="preview"
          className="rounded-xl w-full max-h-80 object-cover"
        />

        <p className="text-center text-gray-400 text-sm mt-3">
          Check image before analysis
        </p>

        <div className="flex gap-3 mt-5">
          <button
            onClick={onRetake}
            className="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm"
          >
            Retake
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-sm font-medium"
          >
            Analyze 🌿
          </button>
        </div>
      </div>
    </div>
  );
}
