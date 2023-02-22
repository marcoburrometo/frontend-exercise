import React from "react";
import { useState } from "react";
import FoodChart from "../../components/FoodChart/FoodChart";
import ShareModal from "../../components/ShareModal/ShareModal";
import {
  useGetChartCommentThreadsQuery,
  useGetChartDataQuery,
} from "../../store/queries/chart";

function Home() {
  const [showShareModal, setShowShareModal] = useState(false);

  const { isLoading, data, isError } = useGetChartDataQuery();

  const { data: commentsThreads } = useGetChartCommentThreadsQuery();
  return (
    <div>
      {/* Share button */}
      <div className="absolute top-0 right-0 mt-4 mr-4">
        <button
          onClick={() => {
            setShowShareModal(true);
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Share
        </button>
      </div>
      <h3 className="text-xl font-bold mb-4">Chart</h3>
      <FoodChart
        data={data}
        commentsThreads={commentsThreads}
        isError={isError}
        isLoading={isLoading}
      />
      {showShareModal && (
        <ShareModal onClose={() => setShowShareModal(false)} />
      )}
    </div>
  );
}

export default Home;
