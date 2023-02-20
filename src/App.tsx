import { useRef } from "react";
import BarChart from "./components/BarChart";
import Card from "./components/Card";
import { useGetChartDataQuery } from "./store/queries/chart";

function App() {
  const { isLoading, data } = useGetChartDataQuery();
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
                  { x: "Burger", y: d.burger },
                  { x: "Donut", y: d.donut },
                  { x: "Fries", y: d.fries },
                  { x: "Hotdog", y: d.hotdog },
                  { x: "Kebab", y: d.kebab },
                  { x: "Sandwich", y: d.sandwich },
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
