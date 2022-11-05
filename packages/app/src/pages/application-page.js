import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import usePromise from '../hooks/use-promise';
import EditConfigValueModal from '../components/edit-config-value-modal';
import CreateConfigModal from '../components/create-config-modal';
import CreateEnvironmentModal from '../components/create-env-modal';
import useCanister from '../hooks/use-canister';
import { IdentityContext } from '../context';

function ApplicationPage() {
  const { applicationId } = useParams();

  const { identity } = useContext(IdentityContext);
  const navigate = useNavigate();

  const [selectedConfig, setSelectedConfig] = React.useState({});
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isCreateConfigModalOpen, setIsCreateConfigModalOpen] = React.useState(false);
  const [isCreateEnvironmentModalOpen, setIsCreateEnvironmentModalOpen] = React.useState(false);

  const { getApplication, getAllConfigValues } = useCanister();
  const [application, { isFetching, error }] = usePromise(() => getApplication(applicationId), {
    conditions: [applicationId],
    dependencies: [applicationId],
  });

  const [allConfigValues, { isFetching: isFetchingValues, error: errorValues, reFetch }] = usePromise(() => getAllConfigValues(application), {
    conditions: [application],
  });

  React.useEffect(() => {
    if (application) {
      document.title = `${application.name} Configuration Management - dconf`;
    }
  }, [application]);

  // No logged in
  if (!identity) {
    // eslint-disable-next-line no-console
    console.log('Not logged in. Redirecting to home page');
    return navigate('/');
  }

  if (isFetching || isFetchingValues || !allConfigValues) {
    return (<div className="section loading" style={{ height: '200px' }} />);
  }

  if (error || errorValues) {
    return (<div className="section">{(error || errorValues).message}</div>);
  }

  if (!application) {
    return (<div>Application not found</div>);
  }

  const { name, environments = [], configurations = [] } = application;

  function renderNoConfigurationView() {
    return (
      <div className="section">
        <div className="section-title">Create first configuration</div>

        <p>
          You do not have any configurations defined under your application.
        </p>
        <p>
          Start by creating your first one.
        </p>

        <button type="button" className="button mt-2" onClick={() => { setIsCreateConfigModalOpen(true); }}>Create Configuration</button>
      </div>
    );
  }

  function renderNoEnvironmentView() {
    return (
      <div className="section">
        <div className="section-title">Create first environment</div>

        <p>
          You can define environments within your application like Staging, Production and have configuration values per environment.
        </p>
        <p>
          You need at-least one environment created to start creating configurations.
        </p>

        <button type="button" className="button mt-2" onClick={() => { setIsCreateEnvironmentModalOpen(true); }}>Create Environment</button>
      </div>
    );
  }

  return (
    <div className="page home-page">

      <div className="section-title">
        Configuration Management for {name}
      </div>

      {environments.length === 0 && renderNoEnvironmentView()}
      {configurations.length === 0 && renderNoConfigurationView()}

      {environments.length > 0 && configurations.length > 0 && (
        <div className="table-container">

          <table className="table config-table">
            <thead>
              <tr>
                <th>Config Key</th>
                {(environments).map((environment) => (
                  <th key={environment.id}>
                    {environment.name || environment.id}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {configurations.map((conf, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <tr key={i}>
                  <td>{conf.key}</td>
                  {environments.map((env) => {
                    const value = allConfigValues[env.id]?.find((c) => c.key === conf.key)?.value;

                    return (
                      <td key={env.id}>
                        {value ?? ''}

                        <button
                          type="button"
                          className="icon-button btn-edit-config"
                          onClick={() => {
                            setSelectedConfig({ environment: env, configuration: conf, currentValue: value });
                            setIsEditModalOpen(true);
                          }}
                        >
                          <i className="icon icon-pencil" />
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <button type="button" className="button mr-4" onClick={() => { setIsCreateEnvironmentModalOpen(true); }}>Create Environment</button>
          <button type="button" className="button" onClick={() => { setIsCreateConfigModalOpen(true); }}>Create Configuration</button>

        </div>
      )}

      {selectedConfig.configuration && (
        <EditConfigValueModal
          isOpen={isEditModalOpen}
          application={application}
          configuration={selectedConfig.configuration}
          environment={selectedConfig.environment}
          currentValue={selectedConfig.currentValue}
          onRequestClose={(isUpdated) => {
            setIsEditModalOpen(false);
            setSelectedConfig({});
            if (isUpdated) {
              reFetch();
            }
          }}
        />
      )}

      <CreateConfigModal
        isOpen={isCreateConfigModalOpen}
        application={application}
        onRequestClose={(isUpdated) => {
          setIsCreateConfigModalOpen(false);
          if (isUpdated) {
            reFetch();
          }
        }}
      />

      <CreateEnvironmentModal
        isOpen={isCreateEnvironmentModalOpen}
        application={application}
        onRequestClose={(isUpdated) => {
          setIsCreateEnvironmentModalOpen(false);
          if (isUpdated) {
            reFetch();
          }
        }}
      />

    </div>
  );
}

export default ApplicationPage;
