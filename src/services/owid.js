// src/services/owid.js
import Papa from 'papaparse';

/**
 * Fetch a CSV and return rows as objects (header:true)
 * Has good error messages, optional localStorage cache fallback.
 */
export async function fetchOwidCsv(url, { cacheKey } = {}) {
  // 1) Try network
  try {
    const res = await fetch(url, {
      headers: { Accept: 'text/csv' },
      // Important: do NOT set mode: 'no-cors' (it breaks reads)
      // OWID sends CORS headers so a normal fetch is fine.
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} for ${url}`);
    }

    const text = await res.text();
    const { data, errors } = Papa.parse(text, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });
    if (errors?.length) {
      // Papa returns parse warnings as errors array; surface the first one
      console.warn('CSV parse warnings:', errors.slice(0, 3));
    }

    // Cache latest successful payload (optional)
    if (cacheKey) {
      localStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), data }));
    }

    return data;
  } catch (netErr) {
    console.error('Network/parse error:', netErr);

    // 2) Try localStorage cache (if any)
    if (cacheKey) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const { data } = JSON.parse(cached);
          console.warn('Using cached dataset for', cacheKey);
          return data;
        } catch {}
      }
    }

    // 3) Final fallback: ship a small snapshot from /public (optional)
    // If you include a file like /owid-fallback/global-plastics-production.csv
    // you could:
    // const text = await (await fetch('/owid-fallback/global-plastics-production.csv')).text();
    // const { data } = Papa.parse(text, { header: true, dynamicTyping: true, skipEmptyLines: true });
    // return data;

    throw netErr; // bubble up if nothing worked
  }
}
