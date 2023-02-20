import { useRef } from "react";
import BarChart from "./components/BarChart";
import Card from "./components/Card";
import {
  useGetChartCommentThreadsQuery,
  useGetChartDataQuery,
} from "./store/queries/chart";

function App() {
  const { isLoading, data } = useGetChartDataQuery();
  const { data: commentsThreads } = useGetChartCommentThreadsQuery();

  const containerRef = useRef<HTMLDivElement>(null);

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
            data={
              data?.map((d) => ({
                label: d.country,
                values: [
                  {
                    x: "Burger",
                    y: d.burger,
                    counter: commentsThreads?.find(
                      (c) =>
                        c.chartDataPoint.feature === "burger" &&
                        c.chartDataPoint.country === d.country
                    )?.commentsCount,
                  },
                  {
                    x: "Donut",
                    y: d.donut,
                    counter: commentsThreads?.find(
                      (c) =>
                        c.chartDataPoint.feature === "donut" &&
                        c.chartDataPoint.country === d.country
                    )?.commentsCount,
                  },
                  {
                    x: "Fries",
                    y: d.fries,
                    counter: commentsThreads?.find(
                      (c) =>
                        c.chartDataPoint.feature === "fries" &&
                        c.chartDataPoint.country === d.country
                    )?.commentsCount,
                  },
                  {
                    x: "Hotdog",
                    y: d.hotdog,
                    counter: commentsThreads?.find(
                      (c) =>
                        c.chartDataPoint.feature === "hotdog" &&
                        c.chartDataPoint.country === d.country
                    )?.commentsCount,
                  },
                  {
                    x: "Kebab",
                    y: d.kebab,
                    counter: commentsThreads?.find(
                      (c) =>
                        c.chartDataPoint.feature === "kebab" &&
                        c.chartDataPoint.country === d.country
                    )?.commentsCount,
                  },
                  {
                    x: "Sandwich",
                    y: d.sandwich,
                    counter: commentsThreads?.find(
                      (c) =>
                        c.chartDataPoint.feature === "sandwich" &&
                        c.chartDataPoint.country === d.country
                    )?.commentsCount,
                  },
                ],
              })) || []
            }
          />
        )}
      </Card>
    </div>
  );
}

export default App;
