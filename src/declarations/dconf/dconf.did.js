export const idlFactory = ({ IDL }) => {
  const ConfigurationTypes = IDL.Variant({
    'string' : IDL.Null,
    'boolean' : IDL.Null,
    'number' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  return IDL.Service({
    'createApplication' : IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
    'createConfiguration' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, ConfigurationTypes],
        [IDL.Text],
        [],
      ),
    'createEnvironment' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [IDL.Text],
        [],
      ),
    'getConfigValue' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [IDL.Opt(IDL.Text)],
        [],
      ),
    'setConfigValue' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
