import React from 'react';
import { useParams } from 'react-router-dom';
import usePromise from '../hooks/use-promise';
import EditConfigValueModal from '../components/edit-config-value-modal';
import { getApplication, getAllConfigValues } from '../data-service';
import CreateConfigModal from '../components/create-config-modal';
import CreateEnvironmentModal from '../components/create-env-modal';

function ApplicationPage() {
  const { applicationId } = useParams();

  const [selectedConfig, setSelectedConfig] = React.useState({});
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isCreateConfigModalOpen, setIsCreateConfigModalOpen] = React.useState(false);
  const [isCreateEnvironmentModalOpen, setIsCreateEnvironmentModalOpen] = React.useState(false);

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

  if (isFetching || isFetchingValues || !allConfigValues) {
    return (<div>Loading</div>);
  }

  if (error || errorValues) {
    return (<div>{(error || errorValues).message}</div>);
  }

  if (!application) {
    return (<div>Application not found</div>);
  }

  const { name, environments = [], configurations = [] } = application;

  return (
    <div className="page home-page">

      <div className="section-title mb-5">
        Configuration Management for {name}
      </div>

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

        <button type="button" className="link mr-4" onClick={() => { setIsCreateEnvironmentModalOpen(true); }}>Create Environment</button>
        <button type="button" className="link" onClick={() => { setIsCreateConfigModalOpen(true); }}>Create Configuration</button>

      </div>

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
