export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const ConfigurationTypes = IDL.Variant({
    'string' : IDL.Null,
    'boolean' : IDL.Null,
    'number' : IDL.Null,
  });
  return IDL.Service({
    'createApplication' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'createConfiguration' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, ConfigurationTypes],
        [Result],
        [],
      ),
    'createEnvironment' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [Result],
        [],
      ),
    'getConfigValue' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [Result], []),
    'setConfigValue' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
