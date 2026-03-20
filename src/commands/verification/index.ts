import { Command } from 'commander';
import { registerEmailCommand } from './email.js';
import { registerResendCommand } from './resend.js';

export function registerVerificationCommands(program: Command) {
  const verification = program.command('verification').description('Email verification');
  registerEmailCommand(verification);
  registerResendCommand(verification);
}
