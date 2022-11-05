import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import useCanister from '../hooks/use-canister';
import { IdentityContext } from '../context';
import usePromise from '../hooks/use-promise';
import CreateApplicationModal from '../components/create-application-modal';

function HomePage() {
  const [showCreateApplicationModal, setShowCreateApplicationModal] = useState();

  const { identity, login } = useContext(IdentityContext);

  const { getOwnedApplications } = useCanister();

  const [applications, { isFetching, error, reFetch }] = usePromise(() => getOwnedApplications(), {
    conditions: [identity],
    dependencies: [identity],
    defaultValue: [],
  });

  // console.log(applications);
  function renderLoginView() {
    return (
      <div className="section">
        <div className="section-title">Login with Internet Identity</div>

        <div>
          <p>
            <span>
              dconf use <a target="_blank" rel="noreferrer" href="https://internetcomputer.org/">Internet Computer</a>
            </span>
            <span> to store configuration data and </span>
            <a target="_blank" rel="noreferrer" href="https://internetcomputer.org/docs/current/tokenomics/identity-auth/what-is-ic-identity/">Internet Identity</a>
            <span> for authentication.</span>
          </p>
          <p>
            Configurations you create in dconf are tied to your Internet Identity account and only would be able to
            update and remove configuration values.
          </p>
          <p>
            Login with Internet Identity to continue.
          </p>
        </div>

        <button type="button" className="button mt-2" onClick={login}>Login</button>
      </div>
    );
  }

  function renderNoApplicationsView() {
    return (
      <div className="section">
        <div className="section-title">Create new application</div>

        <p>
          You do not have any Applications created yet. Create an application to start managing configuration values for it.
        </p>
        <p>
          You can also define environments under an application and have different value for each environment.
        </p>

        <button type="button" className="button mt-2" onClick={() => { setShowCreateApplicationModal(true); }}>Create Application</button>
      </div>
    );
  }

  function renderApplicationListView() {
    return (
      <div>
        <div className="section-title">Your Applications</div>

        {applications.map((application) => (
          <Link to={`/application/${application.id}`}>
            <div key={application.id} className="application-box">
              <div className="application-name">{application.name}</div>
              <div>
                <div>{application.environments.length} environments</div>
                <div>{application.configurations.length} configurations</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="section loading" />
    );
  }

  if (error) {
    return (
      <div className="section">
        <div className="section-title">Unexpected error occurred</div>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="page home-page">
      <div className="mt-5 mb-5">

        {!identity && renderLoginView()}

        {identity && applications.length === 0 && renderNoApplicationsView()}

        {identity && applications.length > 0 && renderApplicationListView()}

        <CreateApplicationModal
          isOpen={showCreateApplicationModal}
          onRequestClose={() => { setShowCreateApplicationModal(false); reFetch(); }}
        />

      </div>
    </div>
  );
}

export default HomePage;
