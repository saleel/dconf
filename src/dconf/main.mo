import Text "mo:base/Text";
import Map "mo:base/RBTree";
import Trie "mo:base/Trie";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Types "./types";

actor {
  let map = Map.RBTree<Text, Text>(Text.compare);

  private stable var applications : Trie.Trie<Text, Types.Application> = Trie.empty();
  private stable var environments : Trie.Trie<Text, Types.Environment> = Trie.empty();
  private stable var configurations : Trie.Trie<Text, Types.Configuration> = Trie.empty();
  private stable var configurationValues : Trie.Trie<Text, Text> = Trie.empty();

  public shared(msg) func createApplication(id: Text, name: Text) : async Text {
    // Check if there is another app with same id
    let existingApp = getApplication(id);
    if (existingApp != null) return "";

    let appKey = getApplicationTrieKey(id);

    let application : Types.Application = {
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

    let environment : Types.Environment = {
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

  public shared(msg) func createConfiguration(id: Text, defaultValue: Text, appId: Text, valueType: Types.ConfigurationTypes) : async Text {
    // Ensure app exist
    let existingApp = getApplication(appId);
    if (existingApp == null) return "";

     // Check for existing configuration with same key
    let existingConfig = getConfiguration(appId, id);
    if (existingConfig != null) return "";

    let configKey = getConfigurationTrieKey(appId, id);

    let configuration : Types.Configuration = {
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

  public shared(msg) func setConfigValue(appId: Text, envId: Text, configId: Text, value: Text) : async Result.Result<Text, Text> {
    // Ensure app exist
    let existingApp = getApplication(appId);
    if (existingApp == null) return #err("App not found");

    // Ensure env exist
    let existingEnv = getEnvironment(appId, envId);
    if (existingEnv == null) return #err("Env not found");

    // Ensure env exist
    let existingConfig = getConfiguration(appId, configId);
    if (existingConfig == null) return #err("Config not found");

    let configurationValueTrieKey = getConfigurationValueTrieKey(appId, envId, configId);
    configurationValues := Trie.replace(
      configurationValues,
      configurationValueTrieKey,
      Text.equal,
      ?value,
    ).0;

    return #ok(configurationValueTrieKey.key);
  };

  public func getConfigValue(appId: Text, envId: Text, configId: Text) : async ?Text {
    // Ensure app exist
    let existingApp = getApplication(appId);
    if (existingApp == null) return null;

    // Ensure env exist
    let existingEnv = getEnvironment(appId, envId);
    if (existingEnv == null) return null;

    // Ensure env exist
    let existingConfig = getConfiguration(appId, configId);
    if (existingConfig == null) return null;

    let configurationValueTrieKey = getConfigurationValueTrieKey(appId, envId, configId);
    let result = Trie.get(configurationValues, configurationValueTrieKey, Text.equal);

    if (result != null) {
      return result;
    };

    return null;
  };

  private func getApplication(appId : Text) : ?Types.Application {
    return Trie.find(applications, getApplicationTrieKey(appId), Text.equal);
  };

  private func getEnvironment(appId : Text, envId: Text) : ?Types.Environment {
    return Trie.find(environments, getEnvironmentTrieKey(appId, envId), Text.equal);
  };

   private func getConfiguration(appId : Text, configKey: Text) : ?Types.Configuration {
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

   private func getConfigurationValueTrieKey(appId: Text, envId: Text, configId: Text) : Trie.Key<Text> {
    let concatId : Text = Text.concat(Text.concat(appId, envId), configId);
    return  { hash = Text.hash concatId; key = concatId };
  };
};
