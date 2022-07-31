export const idlFactory = ({ IDL }) => {
  const List = IDL.Rec();
  const List_1 = IDL.Rec();
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const ConfigurationTypes = IDL.Variant({
    'string' : IDL.Null,
    'boolean' : IDL.Null,
    'number' : IDL.Null,
  });
  const Configuration = IDL.Record({
    'key' : IDL.Text,
    'valueType' : ConfigurationTypes,
    'defaultValue' : IDL.Text,
  });
  List.fill(IDL.Opt(IDL.Tuple(Configuration, List)));
  const ConfigurationList = IDL.Opt(IDL.Tuple(Configuration, List));
  const Environment = IDL.Record({ 'id' : IDL.Text, 'title' : IDL.Text });
  List_1.fill(IDL.Opt(IDL.Tuple(Environment, List_1)));
  const EnvironmentList = IDL.Opt(IDL.Tuple(Environment, List_1));
  const Application = IDL.Record({
    'id' : IDL.Text,
    'title' : IDL.Text,
    'owner' : IDL.Principal,
    'configurations' : ConfigurationList,
    'environments' : EnvironmentList,
  });
  const Result_1 = IDL.Variant({ 'ok' : Application, 'err' : IDL.Text });
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
    'getApplication' : IDL.Func([IDL.Text], [Result_1], []),
    'getConfigValue' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [Result], []),
    'setConfigValue' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
