import { beforeEach, describe, expect, it, vi } from 'vitest';
import { trackVisit } from './track';

const samplePayload = { foo: 'bar' };

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('trackVisit', () => {
  it('uses sendBeacon when available and successful', async () => {
    const sendBeacon = vi.fn<(url: string, data?: BodyInit | null) => boolean>().mockReturnValue(true);
    Object.defineProperty(globalThis, 'navigator', { value: { sendBeacon } as unknown as Navigator, configurable: true });

    const fetchSpy = vi.spyOn(globalThis as any, 'fetch').mockResolvedValue({ ok: true } as any);

    await trackVisit('event_beacon', samplePayload);

    expect(sendBeacon).toHaveBeenCalledTimes(1);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('falls back to fetch when sendBeacon is not available', async () => {
    Object.defineProperty(globalThis, 'navigator', { value: {} as Navigator, configurable: true });
    const fetchSpy = vi.spyOn(globalThis as any, 'fetch').mockResolvedValue({ ok: true } as any);

    await trackVisit('event_fetch', samplePayload);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const call = fetchSpy.mock.calls[0] as any;
    expect((call[1] as RequestInit)?.keepalive).toBe(true);
  });

  it('falls back to fetch when sendBeacon returns false', async () => {
    const sendBeacon = vi.fn<(url: string, data?: BodyInit | null) => boolean>().mockReturnValue(false);
    Object.defineProperty(globalThis, 'navigator', { value: { sendBeacon } as unknown as Navigator, configurable: true });

    const fetchSpy = vi.spyOn(globalThis as any, 'fetch').mockResolvedValue({ ok: true } as any);

    await trackVisit('event_fallback', samplePayload);

    expect(sendBeacon).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});


