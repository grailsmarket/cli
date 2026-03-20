import { Command } from 'commander';
import { registerLoginCommand } from './login.js';
import { registerLogoutCommand } from './logout.js';
import { registerMeCommand } from './me.js';
import { registerStatusCommand } from './status.js';

export function registerAuthCommands(program: Command) {
  const auth = program.command('auth').description('Authentication operations');
  registerLoginCommand(auth);
  registerLogoutCommand(auth);
  registerMeCommand(auth);
  registerStatusCommand(auth);
}
