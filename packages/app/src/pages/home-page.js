import React from 'react';
import { Link } from 'react-router-dom';
import useCanister from '../hooks/use-canister';
import useInternetIdentity from '../hooks/use-internet-identity';
import usePromise from '../hooks/use-promise';

function HomePage() {
  const { identity, login } = useInternetIdentity();

  const { getOwnedApplications } = useCanister();

  const [applications, { isFetching, error }] = usePromise(() => getOwnedApplications(), {
    conditions: [identity],
    dependencies: [identity],
    defaultValue: [],
  });

  if (isFetching) {
    return (
      <div>
        Loading
      </div>
    );
  }

  console.log(applications);

  return (
    <div className="page home-page">

      <div className="section-title mb-5">
        Hello
      </div>

      {!identity && (
        <button
          type="button"
          onClick={async () => {
            await login();
          }}
        >Login
        </button>
      )}

      {applications.map((application) => (
        <div>
          <Link to={`/${application.id}`}>{application.name}</Link>
        </div>
      ))}

    </div>
  );
}

export default HomePage;
