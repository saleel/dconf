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
