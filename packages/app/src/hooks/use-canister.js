import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../../canister/declarations/dconf/dconf.did.js';
import useInternetIdentity from './use-internet-identity';

function sanitizeConfigurations(config) {
  return ({
    ...config,
    valueType: Object.keys(config.valueType)[0],
  });
}

/**
 *
 * @param {import("@dfinity/agent").Identity} identity
 */
export default function useCanister() {
  const { identity } = useInternetIdentity();

  const agent = new HttpAgent({ identity });

  agent.fetchRootKey();

  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId: process.env.DCONF_CANISTER_ID,
  });

  async function getOwnedApplications() {
    const response = await actor.getOwnedApplications();
    const applications = response.ok;

    if (!applications) { return []; }

    return applications;
  }

  async function getApplication(applicationId) {
    const response = await actor.getApplication(applicationId);
    const application = response.ok;

    if (!application) { return null; }

    application.configurations = application.configurations.map(sanitizeConfigurations);

    return application;
  }

  async function getAllConfigValues(application) {
    const allEnvs = await Promise.all(
      application.environments.map(
        (env) => actor.getAllConfigValues(application.id, env.id).then((r) => r.ok),
      ),
    );

    // Group by env key = { env: [ConfigValue] }
    return allEnvs.reduce((acc, res, index) => {
      acc[application.environments[index].id] = res;
      return acc;
    }, {});
  }

  async function setConfigurationValue(appId, envId, configKey, value) {
    const response = await actor.setConfigValue(appId, envId, configKey, value);
    return response.ok;
  }

  async function createConfiguration(appId, { key, valueType, defaultValue }) {
    const response = await actor.createConfiguration(appId, key, { [valueType]: null }, defaultValue);
    return response.ok;
  }

  async function createEnvironment(appId, { id, name }) {
    const response = await actor.createEnvironment(appId, id, name);
    return response.ok;
  }

  async function createApplication({ id, name }) {
    const response = await actor.createApplication(id, name);
    return response.ok;
  }

  return {
    getOwnedApplications,
    createApplication,
    getApplication,
    getAllConfigValues,
    setConfigurationValue,
    createConfiguration,
    createEnvironment,
  };
}
