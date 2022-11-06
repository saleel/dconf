import fetch from 'node-fetch';
import { Actor, HttpAgent } from '@dfinity/agent';
// @ts-ignore
import { idlFactory } from './declarations/dconf/dconf.did.js';

if (global && !global.fetch) {
// @ts-ignore
  global.fetch = fetch;
}


type ConfigurationResponse = {
  key: string;
  value: string;
  valueType: { string?: null, boolean?: null, number?: null }
}

function dconf(applicationId: string, environmentId: string, params: { canisterId: string, setProcessEnv: string }) {
  const canisterId = params.canisterId || 'rrkah-fqaaa-aaaaa-aaaaq-cai';

  const agent = new HttpAgent({
    host: 'http://127.0.0.1:8000',
  });

  agent.fetchRootKey();

  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });

  let configValuesCache : Record<string, string | number | boolean>;

  async function getConfigValues() {
    if (configValuesCache) {
      return configValuesCache;
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

    configValuesCache = configurations;

    return configValuesCache;
  }

  async function setProcessEnv() {
    const configs = await getConfigValues();

    // @ts-ignore
    Object.keys(configs).forEach((key) => { process.env[key] = configs[key]; });
  }

  if (params.setProcessEnv) {
    setProcessEnv();
  }

  return {
    getConfigValues,
    setProcessEnv,
  };
}

// @ts-ignore
export = dconf;
