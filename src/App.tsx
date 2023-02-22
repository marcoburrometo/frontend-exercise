import { useMemo, useRef, useState } from "react";
import BarChart from "./components/BarChart/BarChart";
import Card from "./components/Card/Card";
import ThreadForm, { ThreadFormData } from "./components/ThreadForm/ThreadForm";
import {
  useGetChartCommentThreadsQuery,
  useGetChartDataQuery,
} from "./store/queries/chart";
import { ChartDataFeatureType } from "./types/data";

function App() {
  const { isLoading, data, isError } = useGetChartDataQuery();
  const { data: commentsThreads } = useGetChartCommentThreadsQuery();
  const [formData, setFormData] = useState<ThreadFormData>();

  const containerRef = useRef<HTMLDivElement>(null);

  const chartData = useMemo(
    () =>
      data?.map((d) => ({
        label: d.country,
        values: Object.keys(d)
          .filter((d) => d !== "country")
          .map((k) => {
            const thread = commentsThreads?.find(
              (c) =>
                c.chartDataPoint.feature === k &&
                c.chartDataPoint.country === d.country
            );
            return {
              x: k,
              y: d[k as ChartDataFeatureType],
              counter: thread?.commentsCount,
              onClick: () => {
                setFormData({
                  commentThread: thread!,
                  chartDataPont: {
                    feature: k as ChartDataFeatureType,
                    country: d.country,
                  },
                });
              },
            };
          }),
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
      {formData && (
        <ThreadForm data={formData} onClose={() => setFormData(undefined)} />
      )}
    </div>
  );
}

export default App;
