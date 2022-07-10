import Text "mo:base/Text";
import Map "mo:base/RBTree";
import Trie "mo:base/Trie";
import Principal "mo:base/Principal";

actor {
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

  let map = Map.RBTree<Text, Text>(Text.compare);

  private stable var applications : Trie.Trie<Text, Application> = Trie.empty();
  private stable var environments : Trie.Trie<Text, Environment> = Trie.empty();
  private stable var configurations : Trie.Trie<Text, Configuration> = Trie.empty();

  public shared(msg) func createApplication(id: Text, name: Text) : async Text {
    // Check if there is another app with same id
    let existingApp = getApplication(id);
    if (existingApp != null) return "";

    let appKey = getApplicationTrieKey(id);

    let application : Application = {
      id = id;
      name = name;
      owner = msg.caller;
    };

    applications := Trie.replace(
      applications,
      appKey,
      Text.equal,
      ?application,
    ).0;

    return id;
  };

  public shared(msg) func createEnvironment(id: Text, name: Text, appId: Text) : async Text {
    // Ensure app exist
    let existingApp = getApplication(id);
    if (existingApp == null) return "";

    // Check for existing env with same name
    let existingEnv = getEnvironment(appId, id);
    if (existingEnv != null) return "";

    let envKey = getEnvironmentTrieKey(appId, id);

    let environment : Environment = {
      id= id;
      applicationId= appId;
      name = name;
    };

    environments := Trie.replace(
      environments,
      envKey,
      Text.equal,
      ?environment,
    ).0;

    return id;
  };

  public shared(msg) func createConfiguration(id: Text, defaultValue: Text, appId: Text, valueType: ConfigurationTypes) : async Text {
    // Ensure app exist
    let existingApp = getApplication(appId);
    if (existingApp == null) return "";

     // Check for existing configuration with same key
    let existingConfig = getConfiguration(appId, id);
    if (existingConfig != null) return "";

    let configKey = getConfigurationTrieKey(appId, id);

    let configuration : Configuration = {
      key= id;
      applicationId= appId;
      defaultValue = defaultValue;
      valueType = valueType;
    };

    configurations := Trie.replace(
      configurations,
      configKey,
      Text.equal,
      ?configuration,
    ).0;

    return id;
  };

  public shared(msg) func set(key: Text, value: Text) : async () {
    map.put(key, value);
  };

  public func get(key : Text) : async ?Text {
    let value = map.get(key);

    return value;
  };

  private func getApplication(appId : Text) : ?Application {
    return Trie.find(applications, getApplicationTrieKey(appId), Text.equal);
  };

  private func getEnvironment(appId : Text, envId: Text) : ?Environment {
    return Trie.find(environments, getEnvironmentTrieKey(appId, envId), Text.equal);
  };

   private func getConfiguration(appId : Text, configKey: Text) : ?Configuration {
    return Trie.find(configurations, getConfigurationTrieKey(appId, configKey), Text.equal);
  };

  private func getApplicationTrieKey(appId : Text) : Trie.Key<Text> {
    return { hash = Text.hash appId; key = appId };
  };

  private func getEnvironmentTrieKey(appId: Text, envId: Text) : Trie.Key<Text> {
    let concatId : Text = Text.concat(appId, envId);
    return  { hash = Text.hash concatId; key = concatId };
  };

  private func getConfigurationTrieKey(appId: Text, configId: Text) : Trie.Key<Text> {
    let concatId : Text = Text.concat(appId, configId);
    return  { hash = Text.hash concatId; key = concatId };
  };
};
