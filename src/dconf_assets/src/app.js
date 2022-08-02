import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/home-page';
import Layout from './components/layout';

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
      </Route>
    </Routes>
  );
}

export default App;
