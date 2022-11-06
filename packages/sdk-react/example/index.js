/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { useDconf, DconfContextProvider } from '..';

const container = document.getElementById('root');

const root = createRoot(container);

function App() {
  const { configurations, isReady } = useDconf();

  console.log(isReady, useDconf('ANALYTICS_ID'));

  return (
    <>
      <div>Configurations</div>
      {Object.keys(configurations).map((key) => (
        <div key={key}>
          <span>{key}</span> : <span>{configurations[key]}</span>
        </div>
      ))}
    </>
  );
}

root.render(
  <DconfContextProvider applicationId="example" environmentId="production" host="http://127.0.0.1:8000">
    <App />
  </DconfContextProvider>,
);
