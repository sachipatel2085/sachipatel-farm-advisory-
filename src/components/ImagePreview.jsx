// components/ImagePreview.jsx
export default function ImagePreview({ image, onConfirm, onRetake }) {
  return (
    <div className="p-4 text-center">
      <img
        src={URL.createObjectURL(image)}
        alt="preview"
        className="rounded-xl mx-auto max-h-80"
      />

      <div className="flex gap-3 justify-center mt-4">
        <button onClick={onRetake} className="btn">
          Retake
        </button>
        <button onClick={onConfirm} className="btn-green">
          Analyze
        </button>
      </div>
    </div>
  );
}
