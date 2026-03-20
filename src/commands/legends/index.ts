import { Command } from 'commander';
import { registerGetCommand } from './get.js';
import { registerDetailsCommand } from './details.js';

export function registerLegendsCommands(program: Command) {
  const legends = program.command('legends').description('Legend stats and mints');
  registerGetCommand(legends);
  registerDetailsCommand(legends);
}
