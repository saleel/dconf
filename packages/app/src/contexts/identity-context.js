import React from 'react';
import { AuthClient } from '@dfinity/auth-client';

// eslint-disable-next-line import/prefer-default-export
export const IdentityContext = React.createContext({
  identity: undefined,
});

export function IdentityContextProvider({ children }) {
  const [identity, setIdentity] = React.useState();

  async function login() {
    const authClient = await AuthClient.create();

    try {
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
    } catch (error) {
      console.error(error);
    }
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

  return (
    <IdentityContext.Provider value={{ identity, login, logout }}>
      {children}
    </IdentityContext.Provider>
  );
}
