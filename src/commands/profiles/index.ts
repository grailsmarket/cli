import { Command } from 'commander';
import { registerGetCommand } from './get.js';

export function registerProfilesCommands(program: Command) {
  const profiles = program.command('profiles').description('User/name profiles');
  registerGetCommand(profiles);
}
