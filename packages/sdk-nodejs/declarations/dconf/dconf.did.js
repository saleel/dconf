export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const ConfigurationTypes = IDL.Variant({
    'string' : IDL.Null,
    'boolean' : IDL.Null,
    'number' : IDL.Null,
  });
  const ConfigurationValueForEnv = IDL.Record({
    'key' : IDL.Text,
    'value' : IDL.Text,
    'isPrivate' : IDL.Bool,
    'valueType' : ConfigurationTypes,
    'environmentId' : IDL.Text,
  });
  const Result_3 = IDL.Variant({
    'ok' : IDL.Vec(ConfigurationValueForEnv),
    'err' : IDL.Text,
  });
  const Configuration = IDL.Record({
    'key' : IDL.Text,
    'isPrivate' : IDL.Bool,
    'valueType' : ConfigurationTypes,
    'defaultValue' : IDL.Text,
  });
  const ConfigurationList = IDL.Vec(Configuration);
  const Environment = IDL.Record({ 'id' : IDL.Text, 'name' : IDL.Text });
  const EnvironmentList = IDL.Vec(Environment);
  const Application = IDL.Record({
    'id' : IDL.Text,
    'owner' : IDL.Principal,
    'name' : IDL.Text,
    'configurations' : ConfigurationList,
    'environments' : EnvironmentList,
  });
  const Result_2 = IDL.Variant({ 'ok' : Application, 'err' : IDL.Text });
  const Result_1 = IDL.Variant({
    'ok' : IDL.Vec(Application),
    'err' : IDL.Text,
  });
  return IDL.Service({
    'createApplication' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'createConfiguration' : IDL.Func(
        [IDL.Text, IDL.Text, ConfigurationTypes, IDL.Text, IDL.Bool],
        [Result],
        [],
      ),
    'createEnvironment' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [Result],
        [],
      ),
    'getAllConfigValues' : IDL.Func([IDL.Text, IDL.Text], [Result_3], []),
    'getApplication' : IDL.Func([IDL.Text], [Result_2], []),
    'getConfigValue' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [Result], []),
    'getOwnedApplications' : IDL.Func([], [Result_1], []),
    'removeApplication' : IDL.Func([IDL.Text], [Result], []),
    'removeConfiguration' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'removeEnvironment' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'setConfigValue' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
