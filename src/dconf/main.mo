import Array "mo:base/Array";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Trie "mo:base/Trie";
import Types "./types";

actor {
  // Map to store all applications: appId -> app
  private stable var applications : Trie.Trie<Text, Types.Application> = Trie.empty();

  // Map to store all config values: (appId, envId, configKey) -> value
  private stable var configurationValues : Trie.Trie<Text, Text> = Trie.empty();


  public shared(msg) func createApplication(id: Text, name: Text) : async Result.Result<Text, Text> {
    // Check for existing app with same id
     switch (_getApplication(id)) {
      case null {
        let appKey = _getApplicationTrieKey(id);

        let application : Types.Application = {
          id = id;
          name = name;
          owner = msg.caller;
          environments = [];
          configurations = [];
        };

        applications := Trie.replace(
          applications,
          appKey,
          Text.equal,
          ?application,
        ).0;

        return #ok(id);
      };
      case (?existingApp) #err("Another application exist with same id");
    };
  };

  public shared(msg) func createEnvironment(appId: Text, envId: Text, name: Text) : async Result.Result<Text, Text> {
     switch (_getApplication(appId)) {
        case null { return #err("Application not found") };
        case (?existingApp) {

          // Ensure caller is app owner
          if (msg.caller != existingApp.owner) {
              return #err("Not the owner of the application");
          };

          // Check for existing env with same name
          if (_getEnvironment(existingApp, envId) != null) {
              return #err("Another environment with same id already exist");
          };

          let environment : Types.Environment = {
            id = envId;
            name = name;
          };

          let newApplication : Types.Application = {
            id = existingApp.id;
            name = existingApp.name;
            owner = existingApp.owner;
            environments = Array.append(existingApp.environments, [environment]);
            configurations = existingApp.configurations;
          };

          applications := Trie.replace(
            applications,
            _getApplicationTrieKey(appId),
            Text.equal,
            ?newApplication,
          ).0;

          return #ok(envId);
        }
     };
  };

  public shared(msg) func createConfiguration(appId: Text, configKey: Text, valueType: Types.ConfigurationTypes, defaultValue: Text) : async Result.Result<Text, Text> {
    switch (_getApplication(appId)) {
        case null { return #err("Application not found") };
        case (?existingApp) {

          // Ensure caller is app owner
          if (msg.caller != existingApp.owner) {
              return #err("Not the owner of the application");
          };

          // Check for existing env with same name
          if (_getConfiguration(existingApp, configKey) != null) {
              return #err("Another configuration with same key already exist");
          };

          let configuration : Types.Configuration = {
            key= configKey;
            applicationId= appId;
            defaultValue = defaultValue;
            valueType = valueType;
          };

          let newApplication : Types.Application = {
            id = existingApp.id;
            name = existingApp.name;
            owner = existingApp.owner;
            environments = existingApp.environments;
            configurations = Array.append(existingApp.configurations, [configuration]);
          };

          applications := Trie.replace(
            applications,
            _getApplicationTrieKey(appId),
            Text.equal,
            ?newApplication,
          ).0;

          return #ok(configKey);
        }
     };
  };

  public shared(msg) func setConfigValue(appId: Text, envId: Text, configId: Text, value: Text) : async Result.Result<Text, Text> {
    switch (_getApplication(appId)) {
      case null #err("No Application found with given id");
      case (?existingApp) {
        
        // Ensure caller is app owner
        if (msg.caller != existingApp.owner) {
            return #err("Not the owner of the application");
        };

        // Ensure env exist
        let existingEnv = _getEnvironment(existingApp, envId);
        if (existingEnv == null) return #err("Env not found");

        // Ensure env exist
        let existingConfig = _getConfiguration(existingApp, configId);
        if (existingConfig == null) return #err("Config not found");

        let configurationValueTrieKey = _getConfigurationValueTrieKey(appId, envId, configId);
        configurationValues := Trie.replace(
          configurationValues,
          configurationValueTrieKey,
          Text.equal,
          ?value,
        ).0;

        return #ok(configurationValueTrieKey.key);
      }
    };
  };

  public func getConfigValue(appId: Text, envId: Text, configId: Text) : async Result.Result<Text, Text> {
    switch (_getApplication(appId)) {
      case null #err("No Application found with given id");
      case (?existingApp) {
        // Ensure env exist
        let existingEnv = _getEnvironment(existingApp, envId);
        if (existingEnv == null) return #err("No Environment found with given id");

        // Ensure configuration exist
        let existingConfig = _getConfiguration(existingApp, configId);
        if (existingConfig == null) return #err("No Configuration found with given id");

        let configurationValueTrieKey = _getConfigurationValueTrieKey(appId, envId, configId);
        let result = Trie.get(configurationValues, configurationValueTrieKey, Text.equal);

        switch (result) {
          // return the default value if a value is not found for requested env
          case null {
            switch(existingConfig) {
              case (?config) #ok(config.defaultValue);
              case null #err("No value or defaultValue");
            }
          };
          case (?resultValue) #ok(resultValue);
        }
      }
    };
  };

  public func getAllConfigValues(appId: Text, envId: Text) : async Result.Result<[Types.ConfigurationValueForEnv], Text> {
    switch (_getApplication(appId)) {
      case null #err("No Application found with given id");
      case (?existingApp) {
        // Ensure env exist
        let existingEnv = _getEnvironment(existingApp, envId);
        if (existingEnv == null) return #err("No Environment found with given id");

        // Use .map on configurations
        let allConfigValues = Array.mapEntries<Types.Configuration, Types.ConfigurationValueForEnv>(
          existingApp.configurations, 
          func (config: Types.Configuration, index: Nat) : Types.ConfigurationValueForEnv {
            let configurationValueTrieKey = _getConfigurationValueTrieKey(appId, envId, config.key);
            let result = Trie.get(configurationValues, configurationValueTrieKey, Text.equal);

            let configurationValueForEnv : Types.ConfigurationValueForEnv = {
              key = config.key;
              environmentId = envId;
              valueType = config.valueType;
              // return default value if specific config not found for this env
              value = switch (result) { case(null) { config.defaultValue }; case(?configVal) { configVal };  };
            };

            return configurationValueForEnv;
          }
        );

        return #ok(allConfigValues);
      }
    };
  };

  public shared(msg) func getApplication(id: Text) : async Result.Result<Types.Application, Text> {
    switch (_getApplication(id)) {
      case null #err("No Application found with given id");
      case (?existingApp) #ok(existingApp);
    };
  };

  private func _getApplication(appId : Text) : ?Types.Application {
    return Trie.find(applications, _getApplicationTrieKey(appId), Text.equal);
  };

  private func _getEnvironment(app : Types.Application, envId: Text) : ?Types.Environment {
    return Array.find(app.environments, func (e : Types.Environment) : Bool = e.id == envId);
  };

  private func _getConfiguration(app : Types.Application, configKey: Text) : ?Types.Configuration {
    return Array.find(app.configurations, func (e : Types.Configuration) : Bool = e.key == configKey)
  };

  private func _getApplicationTrieKey(appId : Text) : Trie.Key<Text> {
    return { hash = Text.hash appId; key = appId };
  };

  // Config values are stored as a map with key being appId+envId
  private func _getConfigurationValueTrieKey(appId: Text, envId: Text, configId: Text) : Trie.Key<Text> {
    let concatId : Text = Text.concat(Text.concat(appId, envId), configId);
    return  { hash = Text.hash concatId; key = concatId };
  };
};
