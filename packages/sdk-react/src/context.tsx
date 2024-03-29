import React from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
// @ts-ignore
import { idlFactory } from './declarations/dconf/dconf.did.js';

type ConfigurationResponse = {
  key: string;
  value: string;
  valueType: { string?: null, boolean?: null, number?: null }
}

type ProviderParams = {
  children: any,
  applicationId: string,
  environmentId: string,
  dconfCanisterId?: string,
  host?: string,
}

type ContextData = {
  configurations: Record<string, string | number | boolean>,
  isReady: boolean
}

export const DconfContext : React.Context<ContextData> = React.createContext({ configurations: {}, isReady: false } as ContextData);

// Defaults
const DCONF_HOST = 'https://ic0.app';
const DCONF_CANISTER_ID = '3izmc-5qaaa-aaaal-abjkq-cai';

export function DconfContextProvider({
  children, dconfCanisterId, applicationId, environmentId, host,
}: ProviderParams) {
  const [isFetching, setIsFetching] = React.useState(true);
  const [configValues, setConfigValues] = React.useState({});

  const isDevMode = !!host;

  const agent = new HttpAgent({
    host: host || DCONF_HOST,
  });

  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId: dconfCanisterId || DCONF_CANISTER_ID,
  });

  async function getConfigValues() {
    if (isDevMode) {
      await agent.fetchRootKey();
    }

    const response = await actor.getAllConfigValues(applicationId, environmentId)
      .then((r) => (r as unknown as { ok: ConfigurationResponse[] }).ok);

    // Convert to key value pair
    const configurations : Record<string, string | number | boolean> = {};

    for (const entry of response) {
      let formattedValue : string | boolean | number = entry.value;

      if (entry.valueType.boolean !== undefined) {
        formattedValue = formattedValue === 'true' ? true : formattedValue;
        formattedValue = formattedValue === 'false' ? false : formattedValue;
      } else if (entry.valueType.number !== undefined) {
        formattedValue = Number(formattedValue);
      }

      configurations[entry.key] = formattedValue;
    }

    return configurations;
  }

  let didCancel = false;

  React.useEffect(() => {
    setIsFetching(true);

    getConfigValues().
      then(res => {
        setIsFetching(false);
        if (!didCancel) {
          setConfigValues(res)
        }
      })
      .catch(error => {
        console.error("dconf: error fetching configurations ", error);
        setIsFetching(false);
      });

    return () => {
      didCancel = true;
    };
  }, [dconfCanisterId, applicationId, environmentId, host,]);


  return (
    <DconfContext.Provider value={{ configurations: configValues, isReady: !isFetching }}>
      {children}
    </DconfContext.Provider>
  );
}
