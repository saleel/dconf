import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Application {
  'id' : string,
  'owner' : Principal,
  'name' : string,
  'configurations' : ConfigurationList,
  'environments' : EnvironmentList,
}
export interface Configuration {
  'key' : string,
  'isPrivate' : boolean,
  'valueType' : ConfigurationTypes,
  'defaultValue' : string,
}
export type ConfigurationList = Array<Configuration>;
export type ConfigurationTypes = { 'string' : null } |
  { 'boolean' : null } |
  { 'number' : null };
export interface ConfigurationValueForEnv {
  'key' : string,
  'value' : string,
  'isPrivate' : boolean,
  'valueType' : ConfigurationTypes,
  'environmentId' : string,
}
export interface Environment { 'id' : string, 'name' : string }
export type EnvironmentList = Array<Environment>;
export type Result = { 'ok' : string } |
  { 'err' : string };
export type Result_1 = { 'ok' : Array<Application> } |
  { 'err' : string };
export type Result_2 = { 'ok' : Application } |
  { 'err' : string };
export type Result_3 = { 'ok' : Array<ConfigurationValueForEnv> } |
  { 'err' : string };
export interface _SERVICE {
  'createApplication' : ActorMethod<[string, string], Result>,
  'createConfiguration' : ActorMethod<
    [string, string, ConfigurationTypes, string, boolean],
    Result,
  >,
  'createEnvironment' : ActorMethod<[string, string, string], Result>,
  'getAllConfigValues' : ActorMethod<[string, string], Result_3>,
  'getApplication' : ActorMethod<[string], Result_2>,
  'getConfigValue' : ActorMethod<[string, string, string], Result>,
  'getOwnedApplications' : ActorMethod<[], Result_1>,
  'setConfigValue' : ActorMethod<[string, string, string, string], Result>,
}
