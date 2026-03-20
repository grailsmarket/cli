import { Command } from 'commander';
import { registerListCommand } from './list.js';
import { registerMeCommand } from './me.js';
import { registerReclassifyCommand } from './reclassify.js';

export function registerPersonasCommands(program: Command) {
  const personas = program.command('personas').description('User persona operations');
  registerListCommand(personas);
  registerMeCommand(personas);
  registerReclassifyCommand(personas);
}
