import { dconf as canister } from '../../declarations/dconf';

function sanitizeConfigurations(config) {
  return ({
    ...config,
    valueType: Object.keys(config.valueType)[0],
  });
}

export async function getApplication(applicationId) {
  const response = await canister.getApplication(applicationId);
  const application = response.ok;

  if (!application) { return null; }

  application.configurations = application.configurations.map(sanitizeConfigurations);

  return application;
}

export async function getAllConfigValues(application) {
  const allEnvs = await Promise.all(
    application.environments.map(
      (env) => canister.getAllConfigValues(application.id, env.id).then((r) => r.ok),
    ),
  );

  // Group by env key = { env: [ConfigValue] }
  return allEnvs.reduce((acc, res, index) => {
    acc[application.environments[index].id] = res;
    return acc;
  }, {});
}

export async function setConfigurationValue(appId, envId, configKey, value) {
  const response = await canister.setConfigValue(appId, envId, configKey, value);
  return response.ok;
}

export async function createConfiguration(appId, { key, valueType, defaultValue }) {
  const response = await canister.createConfiguration(appId, key, { [valueType]: null }, defaultValue);
  return response.ok;
}
