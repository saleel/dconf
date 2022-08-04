import List "mo:base/List";

module {
  public type EnvironmentList = List.List<Environment>;
  public type ConfigurationList = List.List<Configuration>;

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
};
