import { dconf as canister } from '../../declarations/dconf'


export async function getApplication(applicationId) {
  const response = await canister.getApplication(applicationId);
  return response.ok;
}

export async function getAllConfigValues(application) {
  const allEnvs = await Promise.all(
    application.environments.map(
      (env) => canister.getAllConfigValues(application.id, env.id).then(r => r.ok)
    )
  )
  
  // Group by env key = { env: [ConfigValue] }
  return allEnvs.reduce((acc, res, index) => {
    acc[application.environments[index].id] = res;
    return acc;
  }, {});
}

