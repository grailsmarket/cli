import { Command } from 'commander';
import { registerRolesCommand } from './roles.js';
import { registerCanManageCommand } from './can-manage.js';
import { registerManageableNamesCommand } from './manageable-names.js';

export function registerEnsRolesCommands(program: Command) {
  const ensRoles = program.command('ens-roles').description('ENS name roles and permissions');
  registerRolesCommand(ensRoles);
  registerCanManageCommand(ensRoles);
  registerManageableNamesCommand(ensRoles);
}
