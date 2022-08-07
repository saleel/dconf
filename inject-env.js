const path = require('path');
const fs = require('fs');

function initCanisterEnv() {
  let localCanisters; let
    prodCanisters;
  try {
    localCanisters = require(path.resolve(
      '.dfx',
      'local',
      'canister_ids.json',
    ));
  } catch (error) {
    console.log('No local canister_ids.json found. Continuing production');
  }
  try {
    prodCanisters = require(path.resolve('canister_ids.json'));
  } catch (error) {
    console.log('No production canister_ids.json found. Continuing with local');
  }

  const network = process.env.DFX_NETWORK
    || (process.env.NODE_ENV === 'production' ? 'ic' : 'local');

  const canisterConfig = network === 'local' ? localCanisters : prodCanisters;

  return Object.entries(canisterConfig).reduce((prev, current) => {
    const [canisterName, canisterDetails] = current;
    const env = `${canisterName.toUpperCase()}_CANISTER_ID=${canisterDetails[network]}`;
    return `${prev}\n${env}`;
  }, 'NODE_ENV=development');
}
const canisterEnvVariables = initCanisterEnv();

fs.writeFileSync('./.env', canisterEnvVariables);
