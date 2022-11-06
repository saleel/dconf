import React from 'react';
import { DconfContext } from './context';

function useDconf(keyName?: string) {
  const contextData = React.useContext(DconfContext);

  if (keyName) {
    return contextData.configurations[keyName];
  }

  return { configurations: contextData.configurations, isReady: contextData.isReady };
}

export default useDconf;
