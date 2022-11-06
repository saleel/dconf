# dconf

dconf is decentralized configuration management tool powered by [Internet Computer](https://internetcomputer.org/). 

You can set configurations required for your applications in dconf. Data is stored in IC canister and is highly available. All your data is owned by you and is tied to your [Internet Identity](https://internetcomputer.org/docs/current/tokenomics/identity-auth/what-is-ic-identity/)

You can define environments within your application (like staging, production) and set configuration values for each environment. dconf also support private configurations where the values are end to end encrypted.

You can used dconf SDKs in Javascript (NodeJS) and React to read configuration values in your application.

<br />

## NodeJS / Javascript SDK

Install using
```sh
npm install @dconf/sdk
```

Usage

```js
const dconfFactory = require('@dconf/sdk');

const dconf = dconfFactory('example', 'production', { 
  setProcessEnv: true, // Set all config values to process.env
  encryptionKey: 'password' // Used to decrypt private configurations
  // dconfCanisterId?: string,  // Override the canisterId of dconf deployed on IC network
  // host?: string,  // Override the host address of the IC
});

// Prints all config values as key-value pair
dconf.getConfigValues().then(console.log);

```
<br />

## React SDK

Install using
```sh
npm install @dconf/react
```

Usage

```js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { useDconf, DconfContextProvider } from '..';

const container = document.getElementById('root');
const root = createRoot(container);

function App() {
  // Returns all configurations, and isReady state indicating whether configurations are fetched
  const { configurations, isReady } = useDconf();

  // Can get value for one config using useDconf(key: string) syntax.
  console.log(useDconf('ANALYTICS_ID'));

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
  <DconfContextProvider 
    applicationId="example" 
    environmentId="production"
    dconfCanisterId="..." // Override the canisterId of dconf deployed on IC network
    host="http://127.0.0.1:8000" // Override the host address of the IC
  >
    <App />
  </DconfContextProvider>,
);


```