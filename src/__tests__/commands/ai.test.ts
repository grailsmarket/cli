import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  mockHttp, mockPrintOutput, mockHandleError,
  mockCreateHttpClient, resetMocks, runCommand,
} from '../helpers.js';

vi.mock('../../http.js', () => ({
  createHttpClient: mockCreateHttpClient,
}));
vi.mock('../../output.js', () => ({
  printOutput: mockPrintOutput,
}));
vi.mock('../../errors.js', () => ({
  handleError: mockHandleError,
}));

import { registerSemanticSearchCommand } from '../../commands/ai/semantic-search.js';
import { registerRelatedCommand } from '../../commands/ai/related.js';
import { registerRecommendationsCommand } from '../../commands/ai/recommendations.js';

describe('ai semantic-search', () => {
  beforeEach(() => resetMocks());

  it('calls GET /ai/search/semantic with params', async () => {
    await runCommand(registerSemanticSearchCommand, ['semantic-search', '-q', 'cool names', '--page', '1', '--sort-by', 'price']);
    expect(mockHttp.get).toHaveBeenCalledWith('/ai/search/semantic', expect.objectContaining({
      q: 'cool names', page: '1', sortBy: 'price',
    }));
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockHttp.get.mockRejectedValue(new Error('fail'));
    await runCommand(registerSemanticSearchCommand, ['semantic-search', '-q', 'test']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('ai related', () => {
  beforeEach(() => resetMocks());

  it('calls GET /ai/search/related with params', async () => {
    await runCommand(registerRelatedCommand, ['related', '-q', 'vitalik', '--limit', '5']);
    expect(mockHttp.get).toHaveBeenCalledWith('/ai/search/related', expect.objectContaining({
      q: 'vitalik', limit: '5',
    }));
    expect(mockPrintOutput).toHaveBeenCalled();
  });
});

describe('ai recommendations', () => {
  beforeEach(() => resetMocks());

  it('calls GET /ai-recommendations/:name', async () => {
    await runCommand(registerRecommendationsCommand, ['recommendations', 'test.eth']);
    expect(mockHttp.get).toHaveBeenCalledWith('/ai-recommendations/test.eth');
    expect(mockPrintOutput).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockHttp.get.mockRejectedValue(new Error('fail'));
    await runCommand(registerRecommendationsCommand, ['recommendations', 'test.eth']);
    expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
  });
});
