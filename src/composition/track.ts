const TRACK_URL = "https://script.google.com/macros/s/AKfycbx9P8wqRYHKtZbCX6HxLEsLFbyakhEY6XVxuTFtcn-SyfPIkKN2jj64ahaucTOdd1bCdA/exec";
const TRACK_TOKEN = '54x4v654v53xz1v35xz1v35x41d6v5oiasoitya.,,o';
export type TrackPayload = Record<string, unknown>;

export const trackVisit = async (event: string, payload: TrackPayload = {}): Promise<void> => {
  const body = JSON.stringify({
    event,
    payload,
    timestamp: new Date().toISOString(),
  });

  // Prefer sendBeacon for reliability on page unload; fall back to fetch
  try {
    if (navigator?.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      const ok = navigator.sendBeacon(TRACK_URL, blob);
      if (ok) return;
    }
  } catch (_) {
    // ignore and fall through to fetch
  }

  try {
    await fetch(TRACK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TRACK_TOKEN}`,
      },
      body,
      keepalive: true,
    } as RequestInit);
  } catch (err) {
    console.warn('Tracking failed', err);
  }
};