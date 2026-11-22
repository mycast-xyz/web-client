const videoPath = /^\/video\/[a-f0-9-]{36}\/watch$/;
export function uploadedVideoUrl(type: string, body: string): string | null {
  let candidate = body;
  try {
    if (type === 'link') candidate = JSON.parse(body).uri;
    else if (type === 'rich-text') candidate = JSON.parse(body).text;
    else if (type !== 'chat') return null;
    const url = new URL(candidate.trim());
    const trusted =
      url.origin === 'https://mycast.xyz:9011' ||
      (import.meta.env.DEV && url.origin === 'http://127.0.0.1:19010');
    return trusted &&
      videoPath.test(url.pathname) &&
      !url.search &&
      !url.hash &&
      !url.username &&
      !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}
