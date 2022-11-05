import Array "mo:base/Array";

module {
  public type EnvironmentList = [Environment];
  public type ConfigurationList = [Configuration];

  public type Application = {
    id: Text;
    name: Text;
    owner: Principal;
    environments: EnvironmentList;
    configurations: ConfigurationList;
  };

  public type Environment = {
    id: Text;
    name: Text;
  };

  public type Configuration = {
    key: Text;
    defaultValue: Text;
    valueType: ConfigurationTypes;
  };

  public type ConfigurationTypes = {
      #string;
      #number;
      #boolean;
  };

  // Type used as return for getAllConfigValues method
  public type ConfigurationValueForEnv = {
    key: Text;
    environmentId: Text;
    valueType: ConfigurationTypes;
    value: Text;
  };
};
