type MusicBrainzFetchInit = RequestInit & {
  next?: { revalidate?: number };
};

let queue: Promise<void> = Promise.resolve();
let lastRequestAt = 0;

/**
 * MusicBrainz asks API clients to stay at or below one request per second.
 * This serializes outbound requests within a warm server instance. CDN caching
 * and client-side debounce further reduce request volume.
 */
export function musicBrainzFetch(url: string, init: MusicBrainzFetchInit) {
  const request = queue.then(async () => {
    const delay = Math.max(0, lastRequestAt + 1100 - Date.now());
    if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
    lastRequestAt = Date.now();
    return fetch(url, init);
  });

  queue = request.then(() => undefined, () => undefined);
  return request;
}
