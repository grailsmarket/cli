import { Command } from 'commander';
import { registerCheckCommand } from './check.js';
import { registerReadyCommand } from './ready.js';

export function registerHealthCommands(program: Command) {
  const health = program.command('health').description('Health check operations');
  registerCheckCommand(health);
  registerReadyCommand(health);
}
