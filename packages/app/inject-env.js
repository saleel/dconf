/* eslint-disable no-console */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const path = require('path');
const fs = require('fs');

function initCanisterEnv() {
  /**
   * Checkout internet-identity locally and deploy using
   * `rm -rf .dfx/local`
   * `II_FETCH_ROOT_KEY=1 II_DUMMY_CAPTCHA=1  dfx deploy --no-wallet --argument '(null)'`
   *
   * Once deployed, get canister id using `dfx canister id internet_identity`
   */
  const localInternetIdentityCanisterId = 'rkp4c-7iaaa-aaaaa-aaaca-cai';

  if (!localInternetIdentityCanisterId) {
    throw new Error('localInternetIdentityCanisterId value not set in inject-env.js');
  }

  let localCanisters; let
    prodCanisters;
  try {
    localCanisters = require(path.resolve(
      '../../',
      '.dfx',
      'local',
      'canister_ids.json',
    ));
  } catch (error) {
    console.log('No local canister_ids.json found. Continuing production');
  }
  try {
    prodCanisters = require(path.resolve(
      '../../',
      'canister_ids.json',
    ));
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
  }, `NODE_ENV=development\nLOCAL_II_CANISTER_ID=${localInternetIdentityCanisterId}`);
}
const canisterEnvVariables = initCanisterEnv();

fs.writeFileSync('./.env', canisterEnvVariables);
