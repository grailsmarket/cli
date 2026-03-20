import { Command } from 'commander';
import { registerFeedCommand } from './feed.js';
import { registerByNameCommand } from './by-name.js';
import { registerByAddressCommand } from './by-address.js';

export function registerActivityCommands(program: Command) {
  const activity = program.command('activity').description('Activity history');
  registerFeedCommand(activity);
  registerByNameCommand(activity);
  registerByAddressCommand(activity);
}
