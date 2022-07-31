import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type ConfigurationTypes = { 'string' : null } |
  { 'boolean' : null } |
  { 'number' : null };
export type Result = { 'ok' : string } |
  { 'err' : string };
export interface _SERVICE {
  'createApplication' : ActorMethod<[string, string], string>,
  'createConfiguration' : ActorMethod<
    [string, string, string, ConfigurationTypes],
    string,
  >,
  'createEnvironment' : ActorMethod<[string, string, string], string>,
  'getConfigValue' : ActorMethod<[string, string, string], [] | [string]>,
  'setConfigValue' : ActorMethod<[string, string, string, string], Result>,
}
