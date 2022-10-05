import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/home-page';
import ApplicationPage from './pages/application-page';
import Layout from './components/layout';

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Layout />}>

        <Route path="/" element={<HomePage />} />

        <Route path="application">
          <Route path=":applicationId" element={<ApplicationPage />} />
        </Route>

      </Route>
    </Routes>
  );
}

export default App;
