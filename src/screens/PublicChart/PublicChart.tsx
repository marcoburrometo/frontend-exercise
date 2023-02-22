import React from 'react';
import { useParams } from 'react-router-dom';
import FoodChart from '../../components/FoodChart/FoodChart';
import {
  useGetChartCommentThreadsQuery,
  useGetSharedChartDataQuery
} from '../../store/queries/chart';

function PublicChart() {
  const { token } = useParams<{ token: string }>();
  const { isLoading, data, isError } = useGetSharedChartDataQuery(token || '');
  const { data: commentsThreads } = useGetChartCommentThreadsQuery();

  if (isError) {
    return <div className="mt-5 text-red-500">Invalid token 😤</div>;
  }

  return (
    <div>
      <h3 className="mb-4 text-xl font-bold">Chart</h3>
      <FoodChart
        data={data}
        commentsThreads={commentsThreads}
        isError={isError}
        isLoading={isLoading}
        isPublic
      />
    </div>
  );
}

export default PublicChart;
