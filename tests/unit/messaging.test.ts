import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { sendRuntimeMessage, sendTabMessage } from '../../src/shared/messaging.js';

describe('sendRuntimeMessage', () => {
  beforeEach(() => {
    globalThis.chrome = {
      runtime: {
        sendMessage: vi.fn(),
        lastError: undefined,
      },
      tabs: {
        sendMessage: vi.fn(),
      },
    } as unknown as typeof chrome;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('resolves with the response on success', async () => {
    const response = { status: 'ok' };
    (chrome.runtime.sendMessage as ReturnType<typeof vi.fn>) = vi.fn(
      (_message: unknown, callback?: (response: unknown) => void) => {
        callback?.(response);
      },
    );

    await expect(sendRuntimeMessage({ type: 'create_tab' })).resolves.toEqual(response);
  });

  it('rejects when chrome.runtime.lastError is set', async () => {
    (chrome.runtime.sendMessage as ReturnType<typeof vi.fn>) = vi.fn(
      (_message: unknown, callback?: (response: unknown) => void) => {
        chrome.runtime.lastError = { message: 'Something went wrong' };
        callback?.(undefined);
        chrome.runtime.lastError = undefined;
      },
    );

    await expect(sendRuntimeMessage({ type: 'create_tab' })).rejects.toThrow(
      'Something went wrong',
    );
  });
});

describe('sendTabMessage', () => {
  beforeEach(() => {
    globalThis.chrome = {
      runtime: {
        lastError: undefined,
      },
      tabs: {
        sendMessage: vi.fn(),
      },
    } as unknown as typeof chrome;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('resolves with the response on success', async () => {
    const response = { status: 'updated' };
    (chrome.tabs.sendMessage as ReturnType<typeof vi.fn>) = vi.fn(
      (_tabId: number, _message: unknown, callback?: (response: unknown) => void) => {
        callback?.(response);
      },
    );

    await expect(sendTabMessage(1, { type: 'update_axes', axes: [0, 1] })).resolves.toEqual(
      response,
    );
  });

  it('resolves with undefined for non-injectable tabs', async () => {
    (chrome.tabs.sendMessage as ReturnType<typeof vi.fn>) = vi.fn(
      (_tabId: number, _message: unknown, callback?: (response: unknown) => void) => {
        chrome.runtime.lastError = { message: 'Could not establish connection' };
        callback?.(undefined);
        chrome.runtime.lastError = undefined;
      },
    );

    await expect(sendTabMessage(1, { type: 'update_axes', axes: [0, 1] })).resolves.toBeUndefined();
  });
});
