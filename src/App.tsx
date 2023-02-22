import { useMemo, useRef, useState } from "react";
import BarChart from "./components/BarChart/BarChart";
import Card from "./components/Card/Card";
import ThreadForm, { ThreadFormData } from "./components/ThreadForm/ThreadForm";
import {
  useGetChartCommentThreadsQuery,
  useGetChartDataQuery,
} from "./store/queries/chart";
import { ChartDataFeatureType } from "./types/data";
import { COLORS_SET } from "./utils/colors";

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
                  threadId: thread?.id,
                  dataPoint: {
                    country: d.country,
                    feature: k as ChartDataFeatureType,
                  },
                  title:
                    d.country + " - " + k + ": " + d[k as ChartDataFeatureType],
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
        <h3 className="text-xl font-bold mb-4">Chart</h3>

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
      {/* Legend */}
      <Card className="mt-8">
        <h3 className="text-xl font-bold mb-4">Legend</h3>
        <div className="flex flex-wrap">
          {chartData[0]?.values.map((d, i) => (
            <div
              key={d.x}
              className="flex items-center justify-between p-2 my-2 mr-4 bg-gray-200 rounded-lg shadow-sm"
            >
              <div className="flex items-center px-2">
                <div
                  className="w-4 h-4 mr-2 rounded-full"
                  style={{ backgroundColor: COLORS_SET[i] }}
                />
                <div>{d.x}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      {formData && (
        <ThreadForm {...formData} onClose={() => setFormData(undefined)} />
      )}
    </div>
  );
}

export default App;
