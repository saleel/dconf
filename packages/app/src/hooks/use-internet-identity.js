import React from 'react';
import { AuthClient } from '@dfinity/auth-client';

/**
 *
 * @returns { { identity: import("@dfinity/agent").Identity, login: () => {} } }
 */
export default function useInternetIdentity() {
  const [identity, setIdentity] = React.useState();

  async function login() {
    const authClient = await AuthClient.create();

    await new Promise((resolve, reject) => {
      authClient.login({
        onSuccess: resolve,
        onError: reject,
        identityProvider: process.env.DFX_NETWORK === 'ic'
          ? 'https://identity.ic0.app/#authorize'
          : `http://localhost:8000?canisterId=${process.env.LOCAL_II_CANISTER_ID}`,
      });
    });

    setIdentity(authClient.getIdentity());
  }

  async function logout() {
    const authClient = await AuthClient.create();

    await new Promise((resolve, reject) => {
      authClient.logout({
        onSuccess: resolve,
        onError: reject,
      });
    });

    setIdentity();
  }

  return { identity, login, logout };
}
