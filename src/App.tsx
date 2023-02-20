import { useGetChartDataQuery } from "./store/queries/chart";

function App() {
  const { isLoading, data } = useGetChartDataQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>Start your solution here. Good luck! {data?.length}</div>;
}

export default App;
