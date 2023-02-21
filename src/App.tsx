import { useMemo, useRef } from "react";
import BarChart from "./components/BarChart";
import Card from "./components/Card";
import {
  useGetChartCommentThreadsQuery,
  useGetChartDataQuery,
} from "./store/queries/chart";
import { ChartDataFeatureType } from "./types/data";

function App() {
  const { isLoading, data, isError } = useGetChartDataQuery();
  const { data: commentsThreads } = useGetChartCommentThreadsQuery();

  const containerRef = useRef<HTMLDivElement>(null);

  const chartData = useMemo(
    () =>
      data?.map((d) => ({
        label: d.country,
        values: Object.keys(d)
          .filter((d) => d !== "country")
          .map((k) => ({
            x: k,
            y: d[k as ChartDataFeatureType],
            counter: commentsThreads?.find(
              (c) =>
                c.chartDataPoint.feature === k &&
                c.chartDataPoint.country === d.country
            )?.commentsCount,
          })),
      })) || [],
    [data, commentsThreads]
  );

  if (isError) {
    return (
      <div className="container mx-auto my-4" ref={containerRef}>
        <h1 className="text-3xl font-bold mb-4">Food around Europe!</h1>
        <Card>
          <div className="h-96 w-full bg-gray-200 animate-pulse" />
          <div className="text-red-500 mt-5">Error loading data 😤</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-4" ref={containerRef}>
      <h1 className="text-3xl font-bold mb-4">Food around Europe!</h1>
      <Card>
        {isLoading ? (
          <div className="h-96 w-full bg-gray-200 animate-pulse" />
        ) : (
          <BarChart
            width={(containerRef.current?.clientWidth || 960) - 40}
            height={400}
            data={chartData}
          />
        )}
      </Card>
    </div>
  );
}

export default App;
