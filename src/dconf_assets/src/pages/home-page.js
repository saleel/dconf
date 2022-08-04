import React from 'react';
import usePromise from '../hooks/use-promise';
import { getApplication } from '../data-service';

function HomePage() {
  React.useEffect(() => {
    document.title = 'dconf';
  }, []);

  const [application, { isFetching, error }] = usePromise(() => getApplication("chainlook"));

  console.log(application);


  if (isFetching) {
    return (<div>Loading</div>);
  }

  if (error) {
    return (<div>{error.message}</div>);
  }

  if (!application) {
    return (<div>Application not found</div>);
  }

  const { name, environments = [], configurations = [] } = application;

  return (
    <div className="page home-page">

      <div className="intro mb-5">

        Configuration Management for {name}

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
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
                  {environments.map((env) => {
                    return (
                      <td key={env.id}>{env.id} {conf.key}</td>
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
