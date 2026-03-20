import { Command } from 'commander';
import { registerStatsCommand } from './stats.js';
import { registerStatusCommand } from './status.js';
import { registerClaimCommand } from './claim.js';

export function registerPoapCommands(program: Command) {
  const poap = program.command('poap').description('POAP badge operations');
  registerStatsCommand(poap);
  registerStatusCommand(poap);
  registerClaimCommand(poap);
}
