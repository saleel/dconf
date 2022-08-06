import React from 'react';
import usePromise from '../hooks/use-promise';
import EditConfigValueModal from '../components/edit-config-value-modal';
import { getApplication, getAllConfigValues } from '../data-service';

function HomePage() {
  React.useEffect(() => {
    document.title = 'dconf';
  }, []);

  const [selectedConfig, setSelectedConfig] = React.useState({});
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const [application, { isFetching, error }] = usePromise(() => getApplication('chainlook'));

  const [allConfigValues, { isFetching: isFetchingValues, error: errorValues, reFetch }] = usePromise(() => getAllConfigValues(application), {
    conditions: [application],
    defaultValue: {},
  });

  console.log(allConfigValues);

  if (isFetching || isFetchingValues) {
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

      <div className="intro mb-5">
        Configuration Management for {name}
      </div>

      <div className="table-container mt-4">

        <table className="table">
          <thead>
            <tr>
              <th> </th>
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
                        onClick={() => {
                          setSelectedConfig({ environment: env, configuration: conf, currentValue: value });
                          setIsEditModalOpen(true);
                        }}
                      >
                        E
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {selectedConfig.configuration && (
      <EditConfigValueModal
        isOpen={isEditModalOpen}
        application={application}
        onRequestClose={() => { setIsEditModalOpen(false); setSelectedConfig({}); reFetch(); }}
        configuration={selectedConfig.configuration}
        environment={selectedConfig.environment}
        currentValue={selectedConfig.currentValue}
      />
      )}

    </div>
  );
}

export default HomePage;
