import React from 'react';
import useCanister from '../hooks/use-canister';
import useInternetIdentity from '../hooks/use-internet-identity';

function HomePage() {
  const { identity, login } = useInternetIdentity();

  // const { getApplications } = useCanister();

  return (
    <div className="page home-page">

      <div className="section-title mb-5">
        Hello
      </div>

      <button
        type="button"
        onClick={async () => {
          await login();
        }}
      >Login
      </button>

    </div>
  );
}

export default HomePage;
