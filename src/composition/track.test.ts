import { beforeEach, describe, expect, it, vi } from 'vitest';
import { trackVisit } from './track';

declare global {
  // augment global for TypeScript
  interface Navigator {
    sendBeacon?: (url: string, data?: BodyInit | null) => boolean;
  }
}

const samplePayload = { foo: 'bar' };

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('trackVisit', () => {
  it('uses sendBeacon when available and successful', async () => {
    const sendBeacon = vi.fn().mockReturnValue(true);
    Object.defineProperty(global, 'navigator', { value: { sendBeacon }, configurable: true });

    const fetchSpy = vi.spyOn(global, 'fetch' as any).mockResolvedValue({ ok: true } as any);

    await trackVisit('event_beacon', samplePayload);

    expect(sendBeacon).toHaveBeenCalledTimes(1);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('falls back to fetch when sendBeacon is not available', async () => {
    Object.defineProperty(global, 'navigator', { value: {}, configurable: true });
    const fetchSpy = vi.spyOn(global, 'fetch' as any).mockResolvedValue({ ok: true } as any);

    await trackVisit('event_fetch', samplePayload);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const call = fetchSpy.mock.calls[0];
    expect(call[1]?.keepalive).toBe(true);
  });

  it('falls back to fetch when sendBeacon returns false', async () => {
    const sendBeacon = vi.fn().mockReturnValue(false);
    Object.defineProperty(global, 'navigator', { value: { sendBeacon }, configurable: true });

    const fetchSpy = vi.spyOn(global, 'fetch' as any).mockResolvedValue({ ok: true } as any);

    await trackVisit('event_fallback', samplePayload);

    expect(sendBeacon).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});


