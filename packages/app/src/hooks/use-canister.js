import { Actor, HttpAgent } from '@dfinity/agent';
import Utf8 from 'crypto-js/enc-utf8';
import AES from 'crypto-js/aes';
import { useContext } from 'react';
// eslint-disable-next-line import/no-relative-packages
import { idlFactory } from '../declarations/dconf/dconf.did.js';
import { IdentityContext } from '../contexts/identity-context';

let encryptionKey;

function getEncryptionKey() {
  if (!encryptionKey) {
    // eslint-disable-next-line no-alert
    encryptionKey = window.prompt('Please enter the encryption key for Private configurations', '');
  }

  return encryptionKey;
}

function encrypt(plaintext) {
  if (!plaintext) return null;
  const encrypted = AES.encrypt(plaintext, getEncryptionKey()).toString();
  return encrypted;
}

function decrypt(encryptedValue) {
  if (!encryptedValue) return null;
  const decrypted = AES.decrypt(encryptedValue, getEncryptionKey()).toString(Utf8);
  if (!decrypted) {
    throw new Error('dconf: invalid encryption key');
  }
  return decrypted;
}

function sanitizeConfigurations(config) {
  return ({
    ...config,
    valueType: Object.keys(config.valueType)[0],
  });
}

function decryptPrivateConfigurations(config) {
  if (!config.isPrivate) return config;

  return ({
    ...config,
    value: decrypt(config.value),
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

    application.configurations = application.configurations
      .map(decryptPrivateConfigurations)
      .map(sanitizeConfigurations);

    return application;
  }

  async function getAllConfigValues(application) {
    const actor = await getActor();
    if (application.environments.length === 0) {
      return {};
    }

    const allEnvs = await Promise.all(
      application.environments.map(
        (env) => actor.getAllConfigValues(application.id, env.id).then((r) => r.ok),
      ),
    );

    // Group by env key = { env: [ConfigValue] }
    return allEnvs.reduce((acc, res, index) => {
      acc[application.environments[index].id] = res
        .map(decryptPrivateConfigurations)
        .map(sanitizeConfigurations);

      return acc;
    }, {});
  }

  async function setConfigurationValue(appId, envId, config, value) {
    const actor = await getActor();
    const response = await actor.setConfigValue(appId, envId, config.key, config.isPrivate ? encrypt(value) : value);
    return response.ok;
  }

  async function createConfiguration(appId, {
    key, valueType, defaultValue, isPrivate,
  }) {
    const actor = await getActor();
    const defaultVal = isPrivate ? encrypt(defaultValue) : defaultValue;
    const response = await actor.createConfiguration(appId, key, { [valueType]: null }, defaultVal, isPrivate);
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

  async function removeApplication(id) {
    const actor = await getActor();
    const response = await actor.removeApplication(id);
    return response.ok;
  }

  async function removeEnvironment(appId, envId) {
    const actor = await getActor();
    const response = await actor.removeEnvironment(appId, envId);
    return response.ok;
  }

  async function removeConfiguration(appId, configKey) {
    const actor = await getActor();
    const response = await actor.removeConfiguration(appId, configKey);
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
    removeApplication,
    removeConfiguration,
    removeEnvironment,
  };
}
