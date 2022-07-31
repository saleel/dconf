import List "mo:base/List";

module {
  public type Application = {
    id: Text;
    var title: Text;
    var owner: Principal;
    var environments: List.List<Environment>;
    var configurations: List.List<Configuration>;
  };

  public type Environment = {
    id: Text;
    title: Text;
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
