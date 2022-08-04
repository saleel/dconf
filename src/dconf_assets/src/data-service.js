import { dconf as canister } from '../../declarations/dconf'


export async function getApplication(applicationId) {
  const response = await canister.getApplication(applicationId);
  return response.ok;
}

