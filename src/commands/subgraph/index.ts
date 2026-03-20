import { Command } from 'commander';
import { registerQueryCommand } from './query.js';

export function registerSubgraphCommands(program: Command) {
  const subgraph = program.command('subgraph').description('The Graph ENS subgraph proxy');
  registerQueryCommand(subgraph);
}
