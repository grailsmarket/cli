import { Command } from 'commander';
import { registerSemanticSearchCommand } from './semantic-search.js';
import { registerRelatedCommand } from './related.js';
import { registerRecommendationsCommand } from './recommendations.js';

export function registerAiCommands(program: Command) {
  const ai = program.command('ai').description('AI-powered search and recommendations');
  registerSemanticSearchCommand(ai);
  registerRelatedCommand(ai);
  registerRecommendationsCommand(ai);
}
