import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Application {
  'id' : string,
  'title' : string,
  'owner' : Principal,
  'configurations' : ConfigurationList,
  'environments' : EnvironmentList,
}
export interface Configuration {
  'key' : string,
  'valueType' : ConfigurationTypes,
  'defaultValue' : string,
}
export type ConfigurationList = [] | [[Configuration, List]];
export type ConfigurationTypes = { 'string' : null } |
  { 'boolean' : null } |
  { 'number' : null };
export interface Environment { 'id' : string, 'title' : string }
export type EnvironmentList = [] | [[Environment, List_1]];
export type List = [] | [[Configuration, List]];
export type List_1 = [] | [[Environment, List_1]];
export type Result = { 'ok' : string } |
  { 'err' : string };
export type Result_1 = { 'ok' : Application } |
  { 'err' : string };
export interface _SERVICE {
  'createApplication' : ActorMethod<[string, string], Result>,
  'createConfiguration' : ActorMethod<
    [string, string, ConfigurationTypes, string],
    Result,
  >,
  'createEnvironment' : ActorMethod<[string, string, string], Result>,
  'getApplication' : ActorMethod<[string], Result_1>,
  'getConfigValue' : ActorMethod<[string, string, string], Result>,
  'setConfigValue' : ActorMethod<[string, string, string, string], Result>,
}
