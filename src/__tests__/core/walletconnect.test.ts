import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockInit = vi.fn();
const mockConnect = vi.fn();
const mockRequest = vi.fn();
const mockDisconnect = vi.fn();
const mockOn = vi.fn();
const mockSessionGetAll = vi.fn();

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
    });

    it('is idempotent — second call is a no-op', async () => {
      const { SignClient } = await import('@walletconnect/sign-client');
      vi.mocked(SignClient.init).mockClear();
      await walletConnect.initialize();
      expect(SignClient.init).not.toHaveBeenCalled();
    });
  });

  describe('connect', () => {
    it('returns uri and waitForApproval', async () => {
      const mockApproval = vi.fn().mockResolvedValue({
        topic: 'session-topic',
        namespaces: {
          eip155: { accounts: ['eip155:1:0xABC123'] },
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
      expect(session).toEqual({ topic: 'session-topic', address: '0xABC123' });
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
          namespaces: { eip155: { accounts: ['eip155:1:0xRestoredAddr'] } },
        },
      ]);

      await walletConnect.initialize();
      const result = walletConnect.restoreSession('existing-topic');
      expect(result).toEqual({ topic: 'existing-topic', address: '0xRestoredAddr' });
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
