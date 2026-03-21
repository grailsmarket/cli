import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

const mockInit = vi.fn();
const mockConnect = vi.fn();
const mockRequest = vi.fn();
const mockDisconnect = vi.fn();
const mockSessionGetAll = vi.fn();

// Store event handlers persistently so they survive vi.clearAllMocks()
const eventHandlers: Record<string, Function> = {};
const mockOn = vi.fn((event: string, handler: Function) => {
  eventHandlers[event] = handler;
});

const mockLoadConfig = vi.fn((): { apiUrl: string; wcSessionTopic?: string } => ({ apiUrl: 'https://api.test.com' }));
const mockSaveConfig = vi.fn();

vi.mock('../../config.js', () => ({
  loadConfig: () => mockLoadConfig(),
  saveConfig: (c: unknown) => mockSaveConfig(c),
}));

vi.mock('@walletconnect/sign-client', () => ({
  SignClient: {
    init: vi.fn(() => {
      mockInit();
      return {
        connect: mockConnect,
        request: mockRequest,
        disconnect: mockDisconnect,
        on: mockOn,
        session: { getAll: mockSessionGetAll },
      };
    }),
  },
}));

import { walletConnect } from '../../walletconnect.js';

// We need a fresh instance for each test since the module caches state
// Instead, we'll test the singleton and reset via initialize

describe('WalletConnectService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSessionGetAll.mockReturnValue([]);
  });

  describe('initialize', () => {
    it('initializes SignClient with correct config and sets up event listeners', async () => {
      await walletConnect.initialize();
      const { SignClient } = await import('@walletconnect/sign-client');
      expect(SignClient.init).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: expect.objectContaining({ name: 'Grails CLI' }),
          logger: 'error',
        }),
      );
      expect(mockOn).toHaveBeenCalledWith('session_delete', expect.any(Function));
      expect(mockOn).toHaveBeenCalledWith('session_expire', expect.any(Function));
      expect(mockOn).toHaveBeenCalledWith('session_update', expect.any(Function));
    });

    it('is idempotent — second call is a no-op', async () => {
      const { SignClient } = await import('@walletconnect/sign-client');
      vi.mocked(SignClient.init).mockClear();
      await walletConnect.initialize();
      expect(SignClient.init).not.toHaveBeenCalled();
    });
  });

  describe('session event handlers', () => {
    it('clears wcSessionTopic from config when session is deleted with matching topic', () => {
      mockLoadConfig.mockReturnValue({
        apiUrl: 'https://api.test.com',
        wcSessionTopic: 'deleted-topic',
      });

      eventHandlers['session_delete']({ topic: 'deleted-topic' });

      expect(mockSaveConfig).toHaveBeenCalledWith({ wcSessionTopic: undefined });
    });

    it('does not clear config when deleted topic does not match', () => {
      mockLoadConfig.mockReturnValue({
        apiUrl: 'https://api.test.com',
        wcSessionTopic: 'other-topic',
      });

      eventHandlers['session_delete']({ topic: 'different-topic' });

      expect(mockSaveConfig).not.toHaveBeenCalled();
    });

    it('clears wcSessionTopic from config when session expires with matching topic', () => {
      mockLoadConfig.mockReturnValue({
        apiUrl: 'https://api.test.com',
        wcSessionTopic: 'expired-topic',
      });

      eventHandlers['session_expire']({ topic: 'expired-topic' });

      expect(mockSaveConfig).toHaveBeenCalledWith({ wcSessionTopic: undefined });
    });
  });

  describe('connect', () => {
    it('returns uri and waitForApproval', async () => {
      const mockApproval = vi.fn().mockResolvedValue({
        topic: 'session-topic',
        namespaces: {
          eip155: { accounts: ['eip155:1:0xd8668ad8a4a9099578bfb734e83f4ac6570ffcb0'] },
        },
      });

      mockConnect.mockResolvedValue({
        uri: 'wc:abc123@2?relay-protocol=irn&symKey=xyz',
        approval: mockApproval,
      });

      await walletConnect.initialize();
      const result = await walletConnect.connect();

      expect(result.uri).toBe('wc:abc123@2?relay-protocol=irn&symKey=xyz');
      const session = await result.waitForApproval();
      expect(session).toEqual({ topic: 'session-topic', address: '0xd8668AD8A4A9099578bFb734E83f4Ac6570FFCb0' });
    });

    it('throws when no URI is generated', async () => {
      mockConnect.mockResolvedValue({ uri: undefined, approval: vi.fn() });

      await walletConnect.initialize();
      await expect(walletConnect.connect()).rejects.toThrow('Failed to generate pairing URI');
    });

    it('rejects on approval timeout', async () => {
      mockConnect.mockResolvedValue({
        uri: 'wc:test',
        approval: () => new Promise(() => {}), // never resolves
      });

      await walletConnect.initialize();
      const { waitForApproval } = await walletConnect.connect(50); // 50ms timeout
      await expect(waitForApproval()).rejects.toThrow('WalletConnect pairing timed out');
    });
  });

  describe('restoreSession', () => {
    it('returns session data when topic matches', async () => {
      mockSessionGetAll.mockReturnValue([
        {
          topic: 'existing-topic',
          namespaces: { eip155: { accounts: ['eip155:1:0x1234567890abcdef1234567890abcdef12345678'] } },
        },
      ]);

      await walletConnect.initialize();
      const result = walletConnect.restoreSession('existing-topic');
      expect(result).toEqual({ topic: 'existing-topic', address: '0x1234567890AbcdEF1234567890aBcdef12345678' });
    });

    it('returns null when topic not found', async () => {
      mockSessionGetAll.mockReturnValue([]);

      await walletConnect.initialize();
      const result = walletConnect.restoreSession('nonexistent-topic');
      expect(result).toBeNull();
    });
  });

  describe('signMessage', () => {
    it('sends personal_sign request with hex-encoded message', async () => {
      mockRequest.mockResolvedValue('0xsignature123');

      await walletConnect.initialize();
      const sig = await walletConnect.signMessage('topic-1', '0xAddr', 'Hello');

      expect(mockRequest).toHaveBeenCalledWith({
        topic: 'topic-1',
        chainId: 'eip155:1',
        request: {
          method: 'personal_sign',
          params: [
            `0x${Buffer.from('Hello', 'utf-8').toString('hex')}`,
            '0xAddr',
          ],
        },
      });
      expect(sig).toBe('0xsignature123');
    });
  });

  describe('disconnect', () => {
    it('calls signClient.disconnect with reason', async () => {
      await walletConnect.initialize();
      await walletConnect.disconnect('topic-1');

      expect(mockDisconnect).toHaveBeenCalledWith({
        topic: 'topic-1',
        reason: { code: 6000, message: 'User disconnected' },
      });
    });

    it('does not throw on disconnect failure', async () => {
      mockDisconnect.mockRejectedValue(new Error('network'));

      await walletConnect.initialize();
      await expect(walletConnect.disconnect('topic-1')).resolves.toBeUndefined();
    });
  });
});
