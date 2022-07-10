export const idlFactory = ({ IDL }) => {
  const ConfigurationTypes = IDL.Variant({
    'string' : IDL.Null,
    'boolean' : IDL.Null,
    'number' : IDL.Null,
  });
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
    'get' : IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], []),
    'set' : IDL.Func([IDL.Text, IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
