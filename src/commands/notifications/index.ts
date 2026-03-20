import { Command } from 'commander';
import { registerListCommand } from './list.js';
import { registerUnreadCountCommand } from './unread-count.js';
import { registerMarkReadCommand } from './mark-read.js';
import { registerMarkAllReadCommand } from './mark-all-read.js';

export function registerNotificationsCommands(program: Command) {
  const notifications = program.command('notifications').description('Notification operations');
  registerListCommand(notifications);
  registerUnreadCountCommand(notifications);
  registerMarkReadCommand(notifications);
  registerMarkAllReadCommand(notifications);
}
