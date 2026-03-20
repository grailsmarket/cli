import { Command } from 'commander';
import { registerListCommand } from './list.js';
import { registerGetCommand } from './get.js';
import { registerByNameCommand } from './by-name.js';
import { registerCreateCommand } from './create.js';
import { registerUpdateCommand } from './update.js';
import { registerDeleteCommand } from './delete.js';

export function registerListingsCommands(program: Command) {
  const listings = program.command('listings').description('Marketplace listing operations');
  registerListCommand(listings);
  registerGetCommand(listings);
  registerByNameCommand(listings);
  registerCreateCommand(listings);
  registerUpdateCommand(listings);
  registerDeleteCommand(listings);
}
