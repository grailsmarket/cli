import { Command } from 'commander';
import { registerHealthCommands } from './commands/health/index.js';
import { registerAuthCommands } from './commands/auth/index.js';
import { registerNamesCommands } from './commands/names/index.js';
import { registerListingsCommands } from './commands/listings/index.js';
import { registerOffersCommands } from './commands/offers/index.js';
import { registerSalesCommands } from './commands/sales/index.js';
import { registerSearchCommands } from './commands/search/index.js';
import { registerActivityCommands } from './commands/activity/index.js';
import { registerClubsCommands } from './commands/clubs/index.js';
import { registerTrendingCommands } from './commands/trending/index.js';
import { registerProfilesCommands } from './commands/profiles/index.js';

export function createProgram(): Command {
  const program = new Command()
    .name('grails')
    .version('0.1.0')
    .description('Grails ENS Marketplace CLI — designed for agent consumption')
    .option('--human', 'Human-readable output')
    .option('--quiet', 'Suppress non-data output');

  registerHealthCommands(program);
  registerAuthCommands(program);
  registerNamesCommands(program);
  registerListingsCommands(program);
  registerOffersCommands(program);
  registerSalesCommands(program);
  registerSearchCommands(program);
  registerActivityCommands(program);
  registerClubsCommands(program);
  registerTrendingCommands(program);
  registerProfilesCommands(program);

  return program;
}

const program = createProgram();
program.parseAsync(process.argv);
