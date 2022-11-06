import { Actor, HttpAgent } from '@dfinity/agent';
import { useContext } from 'react';
// eslint-disable-next-line import/no-relative-packages
import { idlFactory } from '../declarations/dconf/dconf.did.js';
import { IdentityContext } from '../contexts/identity-context';

function sanitizeConfigurations(config) {
  return ({
    ...config,
    valueType: Object.keys(config.valueType)[0],
  });
}

export default function useCanister() {
  /** @type {{ identity: import("@dfinity/agent").Identity }} * */
  const { identity } = useContext(IdentityContext);

  const isDevMode = window.location.href.includes('localhost') || window.location.href.includes('127.0.0.1');

  async function getActor() {
    if (!identity) {
      throw new Error('Identity not set. Login required');
    }

    const agent = new HttpAgent({ identity });

    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: process.env.DCONF_CANISTER_ID,
    });

    // eslint-disable-next-line no-underscore-dangle
    if (isDevMode && !agent._rootKeyFetched) {
      await agent.fetchRootKey();
    }

    return actor;
  }

  async function getOwnedApplications() {
    const actor = await getActor();
    const response = await actor.getOwnedApplications();

    const applications = response.ok;

    return applications;
  }

  async function getApplication(applicationId) {
    const actor = await getActor();
    const response = await actor.getApplication(applicationId);
    const application = response.ok;

    if (!application) { return null; }

    application.configurations = application.configurations.map(sanitizeConfigurations);

    return application;
  }

  async function getAllConfigValues(application) {
    const actor = await getActor();
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
    const actor = await getActor();
    const response = await actor.setConfigValue(appId, envId, configKey, value);
    return response.ok;
  }

  async function createConfiguration(appId, { key, valueType, defaultValue }) {
    const actor = await getActor();
    const response = await actor.createConfiguration(appId, key, { [valueType]: null }, defaultValue);
    return response.ok;
  }

  async function createEnvironment(appId, { id, name }) {
    const actor = await getActor();
    const response = await actor.createEnvironment(appId, id, name);
    return response.ok;
  }

  async function createApplication({ id, name }) {
    const actor = await getActor();
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
