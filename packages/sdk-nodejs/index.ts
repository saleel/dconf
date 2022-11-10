import fetch from 'node-fetch';
import Utf8 from 'crypto-js/enc-utf8';
import AES from 'crypto-js/aes';
import { Actor, HttpAgent } from '@dfinity/agent';
// @ts-ignore
import { idlFactory } from './declarations/dconf/dconf.did.js';

type ConfigurationResponse = {
  key: string;
  value: string;
  valueType: { string?: null, boolean?: null, number?: null }
  isPrivate: boolean;
}

type SDKParams = {
  dconfCanisterId?: string,
  host?: string,
  setProcessEnv?: boolean,
  encryptionKey?: string,
}

// Defaults
const DCONF_HOST = 'https://ic0.app';
const DCONF_CANISTER_ID = '3izmc-5qaaa-aaaal-abjkq-cai';

function dconf(applicationId: string, environmentId: string, params: SDKParams = {}) {
  const canisterId = params.dconfCanisterId || DCONF_CANISTER_ID;

  const agent = new HttpAgent({
    host: params.host || DCONF_HOST,
    // @ts-ignore
    fetch: fetch
  });

  const isDevMode = params.host;

  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });

  let configValuesCache : Record<string, string | number | boolean>;

  async function getConfigValues() {
    if (configValuesCache) {
      return configValuesCache;
    }

    if (isDevMode) {
      await agent.fetchRootKey();
    }

    const response = await actor.getAllConfigValues(applicationId, environmentId)
      .then((r) => (r as unknown as { ok: ConfigurationResponse[] }).ok);

    // Convert to key value pair
    const configurations : Record<string, string | number | boolean> = {};

    for (const entry of response) {
      let formattedValue : string | boolean | number = entry.value;

      if (entry.isPrivate) {
        if (!params.encryptionKey) {
          console.error(`dconf: ${entry.key} is a private config, but the encryptionKey is not set.`);
          continue;
        }
        formattedValue = AES.decrypt(formattedValue, params.encryptionKey as string).toString(Utf8);

        if (!formattedValue) {
          throw new Error("dconf: invalid encryption key");
        }
      }

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
export default dconf;