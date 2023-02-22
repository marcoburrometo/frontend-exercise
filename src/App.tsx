import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Card from './components/Card/Card';
import Home from './screens/Home/Home';
import PublicChart from './screens/PublicChart/PublicChart';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="container mx-auto my-4">
          <h1 className="mb-4 text-3xl font-bold">Food around Europe!</h1>
          <Card className="relative">
            <Routes>
              <Route path="/public-chart/:token" element={<PublicChart />} />
              <Route path="/" element={<Home />} />
              <Route path="*" element={<div>Page not found</div>} />
            </Routes>
          </Card>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
