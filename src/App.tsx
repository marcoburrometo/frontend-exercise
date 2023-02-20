import BarChart from "./components/BarChart";
import { useGetChartDataQuery } from "./store/queries/chart";

function App() {
  const { isLoading, data } = useGetChartDataQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      Here is a BarChart
      <BarChart
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
    </div>
  );
}

export default App;
