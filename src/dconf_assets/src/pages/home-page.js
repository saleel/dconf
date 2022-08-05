import React from 'react';
import usePromise from '../hooks/use-promise';
import { getApplication, getAllConfigValues } from '../data-service';

function HomePage() {
  React.useEffect(() => {
    document.title = 'dconf';
  }, []);

  const [application, { isFetching, error }] = usePromise(() => getApplication("chainlook"));

  const [allConfigValues, { isFetching: isFetchingValues, error: errorValues }] = usePromise(
    () => getAllConfigValues(application), {
      conditions: [application],
      defaultValue: {},
    }
  );

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

        <div className="table-container mt-4">

          <table className="table">
            <thead>
              <tr>
                <th />
                {(environments).map((environment) => (
                  <th key={environment.id}>
                    {environment.name || environment.id}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {configurations.map((conf, i) => (
                <tr key={i}>
                  <td>{conf.key}</td>
                  {environments.map((env) => {
                    const value = allConfigValues[env.id]?.find(c => c.key === conf.key)?.value;

                    return (
                      <td key={env.id}>{value ?? ""}</td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}

export default HomePage;
