import { Command } from 'commander';
import { registerGetCommand } from './get.js';

export function registerGoogleMetricsCommands(program: Command) {
  const gm = program.command('google-metrics').description('Google search metrics for names');
  registerGetCommand(gm);
}
