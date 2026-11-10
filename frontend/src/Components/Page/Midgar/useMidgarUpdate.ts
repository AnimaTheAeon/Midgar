import { useEffect, useState } from 'react';

// Midgar: new versions are GitHub releases of AnimaTheAeon/Midgar.
const RELEASES_URL =
  'https://api.github.com/repos/AnimaTheAeon/Midgar/releases/latest';
const CHECK_EVERY_MS = 6 * 60 * 60 * 1000;

export interface MidgarUpdate {
  version: string;
  pageUrl: string;
  spkUrl?: string;
  installerUrl?: string;
}

interface ReleaseAsset {
  name: string;
  browser_download_url: string;
}

interface Release {
  tag_name: string;
  html_url: string;
  assets: ReleaseAsset[];
}

function parts(version: string) {
  return version
    .replace(/^v/i, '')
    .split(/[.-]/)
    .map((p) => parseInt(p))
    .filter((n) => !isNaN(n));
}

export function isNewer(candidate: string, current: string) {
  const a = parts(candidate);
  const b = parts(current);

  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const x = a[i] ?? 0;
    const y = b[i] ?? 0;

    if (x !== y) {
      return x > y;
    }
  }

  return false;
}

let cached: MidgarUpdate | null = null;
let lastCheck = 0;
const listeners = new Set<(value: MidgarUpdate | null) => void>();

async function check() {
  lastCheck = Date.now();

  try {
    const response = await fetch(RELEASES_URL, {
      headers: { Accept: 'application/vnd.github+json' },
    });

    if (!response.ok) {
      return;
    }

    const release = (await response.json()) as Release;
    const version = release.tag_name.replace(/^v/i, '');

    if (isNewer(version, window.Sonarr.appVersion || window.Sonarr.version)) {
      const find = (suffix: string) =>
        release.assets.find((a) => a.name.endsWith(suffix))
          ?.browser_download_url;

      cached = {
        version,
        pageUrl: release.html_url,
        spkUrl: find('.spk'),
        installerUrl: find('-setup.exe'),
      };
    } else {
      cached = null;
    }

    listeners.forEach((listener) => listener(cached));
  } catch {
    // Offline or rate limited: try again next time.
  }
}

// Returns the newer release if there is one.
export default function useMidgarUpdate() {
  const [update, setUpdate] = useState<MidgarUpdate | null>(cached);

  useEffect(() => {
    listeners.add(setUpdate);

    if (Date.now() - lastCheck > CHECK_EVERY_MS) {
      check();
    }

    const id = window.setInterval(check, CHECK_EVERY_MS);

    return () => {
      listeners.delete(setUpdate);
      window.clearInterval(id);
    };
  }, []);

  return update;
}
