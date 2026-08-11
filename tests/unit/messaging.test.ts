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
    // @types/chrome 0.2+ 中 runtime.lastError 为只读 const，测试中需通过可变形状修改 mock
    const runtime = chrome.runtime as unknown as { lastError: { message: string } | undefined };
    (chrome.runtime.sendMessage as ReturnType<typeof vi.fn>) = vi.fn(
      (_message: unknown, callback?: (response: unknown) => void) => {
        runtime.lastError = { message: 'Something went wrong' };
        callback?.(undefined);
        runtime.lastError = undefined;
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
      (_tabId: number, _message: unknown) => Promise.resolve(response),
    );

    await expect(sendTabMessage(1, { type: 'update_axes', axes: [0, 1] })).resolves.toEqual(
      response,
    );
  });

  it('resolves with undefined for non-injectable tabs', async () => {
    (chrome.tabs.sendMessage as ReturnType<typeof vi.fn>) = vi.fn(
      (_tabId: number, _message: unknown) =>
        Promise.reject(new Error('Could not establish connection')),
    );

    await expect(sendTabMessage(1, { type: 'update_axes', axes: [0, 1] })).resolves.toBeUndefined();
  });
});
