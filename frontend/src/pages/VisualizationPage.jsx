import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import NightSkyStarMap from "../components/StarMap";
// import StarMap from "../components/StarMap2";

function VisualizationPage() {
  const { plName } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    console.log(plName);
    if (!plName) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosPrivate.get(
          `/visualization/exosky/${encodeURIComponent(plName)}`
        );
        // const response = await axiosPrivate.get("/visualization/exoplanets");
        console.log(response.data);

        setData(response.data);
      } catch (err) {
        console.error("Error fetching exosky:", err);
        setError(
          err.response?.data?.error || err.message || "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [plName]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-50">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center w-full h-64 bg-gray-100 rounded-lg shadow-md animate-pulse">
          <p className="text-gray-500 text-lg">Loading planet data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="w-full max-w-md p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md">
          <h2 className="font-semibold text-lg mb-2">Error fetching data</h2>
          <p>{error}</p>
        </div>
      )}

      {/* Data State */}
      {data && <NightSkyStarMap starData={data} />}
    </div>
  );
}

export default VisualizationPage;
