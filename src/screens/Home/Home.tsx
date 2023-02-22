import React from 'react';
import { useState } from 'react';
import FoodChart from '../../components/FoodChart/FoodChart';
import ShareModal from '../../components/ShareModal/ShareModal';
import { useGetChartCommentThreadsQuery, useGetChartDataQuery } from '../../store/queries/chart';

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
          className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700">
          Share
        </button>
      </div>
      <h3 className="mb-4 text-xl font-bold">Chart</h3>
      <FoodChart
        data={data}
        commentsThreads={commentsThreads}
        isError={isError}
        isLoading={isLoading}
      />
      {showShareModal && <ShareModal onClose={() => setShowShareModal(false)} />}
    </div>
  );
}

export default Home;
