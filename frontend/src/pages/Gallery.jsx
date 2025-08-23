import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ConstellationPreview from "../components/gallery/ConstellationPreview";
import ConstellationModal from "../components/gallery/ConstellationModal";
import StarfieldBackground from "../components/gallery/StarfieldBackground";

const Gallery = () => {
  const axiosPrivate = useAxiosPrivate();
  const [constellations, setConstellations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedConstellation, setSelectedConstellation] = useState(null);

  useEffect(() => {
    const fetchConstellations = async () => {
      try {
        const response = await axiosPrivate.get("/constellation");
        setConstellations(response.data.constellations || []);
      } catch (err) {
        console.error("Error fetching constellations:", err);
        setError(
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to load constellations. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchConstellations();
  }, [axiosPrivate]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white">
        Loading your constellations...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-red-400">
        {error}
      </div>
    );
  }

  return (
    <>
      <StarfieldBackground />

      <div className="p-6 bg-black min-h-screen text-white relative z-10">
        <h1 className="text-3xl font-bold mb-6 text-blue-400 text-center">
          My Constellations
        </h1>

        {constellations.length === 0 ? (
          <p className="text-gray-400 text-center">
            You haven’t saved any constellations yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {constellations.map((c) => (
              <div
                key={c._id}
                className="bg-gray-900 p-6 rounded-xl shadow-xl border border-gray-700 hover:border-blue-400 transition cursor-pointer flex flex-col items-center space-y-3"
                onClick={() => setSelectedConstellation(c)}
              >
                <h2 className="text-xl font-bold text-blue-400">{c.name}</h2>
                <ConstellationPreview
                  stars={c.stars}
                  connections={c.connections}
                  width={250}
                  height={150}
                />
                <p className="text-sm text-blue-300">Planet: {c.planet}</p>
                <p className="text-sm text-green-300">Stars: {c.stars.length}</p>
                <p className="text-xs text-gray-400">
                  Created at: {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConstellationModal
        isOpen={!!selectedConstellation}
        constellation={selectedConstellation}
        onClose={() => setSelectedConstellation(null)}
      />
    </>
  );
};

export default Gallery;
