import { Command } from 'commander';
import { registerGetCommand } from './get.js';
import { registerByNameCommand } from './by-name.js';
import { registerByBuyerCommand } from './by-buyer.js';
import { registerByOwnerCommand } from './by-owner.js';

export function registerOffersCommands(program: Command) {
  const offers = program.command('offers').description('Offer operations');
  registerGetCommand(offers);
  registerByNameCommand(offers);
  registerByBuyerCommand(offers);
  registerByOwnerCommand(offers);
}
