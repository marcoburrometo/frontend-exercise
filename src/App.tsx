import { BrowserRouter, Route, Routes } from "react-router-dom";
import Card from "./components/Card/Card";
import Home from "./screens/Home/Home";
import PublicChart from "./screens/PublicChart/PublicChart";

function App() {
  return (
    <BrowserRouter>
      <div className="container mx-auto my-4">
        <h1 className="text-3xl font-bold mb-4">Food around Europe!</h1>
        <Card className="relative">
          <Routes>
            <Route path="/public-chart/:token" element={<PublicChart />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </Card>
      </div>
    </BrowserRouter>
  );
}

export default App;
