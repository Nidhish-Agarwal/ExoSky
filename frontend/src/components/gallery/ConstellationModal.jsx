import ConstellationPreview from "./ConstellationPreview";

export default function ConstellationModal({ isOpen, onClose, constellation }) {
  if (!isOpen || !constellation) return null;

  const formattedDate = constellation.createdAt
    ? new Date(constellation.createdAt).toLocaleString()
    : "Unknown";

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl p-4 bg-gradient-to-b from-blue-900 to-black rounded-xl shadow-xl flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-xl font-bold hover:text-gray-300"
        >
          ✕
        </button>

        {/* Constellation name */}
        <h2 className="text-2xl font-bold text-white text-center mb-3">
          {constellation.name}
        </h2>

        {/* Constellation preview */}
        <ConstellationPreview
          stars={constellation.stars}
          connections={constellation.connections}
          width={500}
          height={300}
        />

        {/* Details section */}
        <div className="w-full text-center text-white text-sm mt-3 space-y-1">
          <p>
            <span className="text-blue-300 font-semibold">Planet:</span>{" "}
            {constellation.planet}
          </p>
          <p>
            <span className="text-blue-300 font-semibold">Stars:</span>{" "}
            {constellation.stars.length}
          </p>
          <p>
            <span className="text-blue-300 font-semibold">Connections:</span>{" "}
            {constellation.connections.length}
          </p>
          <p>
            <span className="text-blue-300 font-semibold">Created At:</span>{" "}
            {formattedDate}
          </p>
        </div>

        {/* Clickable link style button */}
        <button
          onClick={() => alert("Insights coming soon!")}
          className="mt-4 text-blue-400 font-semibold hover:text-blue-500 transition underline cursor-pointer text-sm"
        >
          Explore Insights
        </button>
      </div>
    </div>
  );
}
