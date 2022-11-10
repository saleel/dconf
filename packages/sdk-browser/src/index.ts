import { Actor, HttpAgent } from '@dfinity/agent';
// @ts-ignore
import { idlFactory } from './declarations/dconf/dconf.did.js';

// Defaults
const DCONF_HOST = 'http://127.0.0.1:8000';
const DCONF_CANISTER_ID = 'rrkah-fqaaa-aaaaa-aaaaq-cai';

type Params = {
  applicationId: string,
  environmentId: string,
  dconfCanisterId?: string,
  host?: string,
}

type ConfigurationResponse = {
  key: string;
  value: string;
  valueType: { string?: null, boolean?: null, number?: null }
}

export async function getConfigValues({ dconfCanisterId, applicationId, environmentId, host } : Params) {
  const isDevMode = !!host;

  const agent = new HttpAgent({
    host: host || DCONF_HOST,
  });

  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId: dconfCanisterId || DCONF_CANISTER_ID,
  });

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

export default getConfigValues;

// @ts-ignore
window.getConfigValues = getConfigValues;
