import { useParams } from "react-router-dom";
import FoodChart from "../../components/FoodChart/FoodChart";
import {
  useGetChartCommentThreadsQuery,
  useGetSharedChartDataQuery,
} from "../../store/queries/chart";

function PublicChart() {
  const { token } = useParams<{ token: string }>();
  const { isLoading, data, isError } = useGetSharedChartDataQuery(token || "");
  const { data: commentsThreads } = useGetChartCommentThreadsQuery();

  if (isError) {
    return <div className="text-red-500 mt-5">Invalid token 😤</div>;
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Chart</h3>
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
