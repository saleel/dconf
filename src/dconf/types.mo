module {
  public type Application = {
    id: Text;
    name: Text;
    owner: Principal;
  };

  public type Environment = {
    id: Text;
    applicationId: Text;
    name: Text;
  };

    public type ConfigurationTypes = {
      #string;
      #number;
      #boolean;
  };

  public type Configuration = {
    key: Text;
    defaultValue: Text;
    valueType: ConfigurationTypes;
  };

  public type ConfigurationValue = {
    applicationId: Nat;
    environmentId: Nat;
    value: Text;
  };
};
