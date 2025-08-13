import Papa from 'papaparse';

const PROXY = 'https://cors.isomorphic-git.org/';

async function fetchText(url) {
  // primary try
  try {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error(`HTTP ${r.status} on ${url}`);
    return await r.text();
  } catch (e) {
    console.warn('Primary fetch failed, trying proxy:', e.message);
  }
  // proxy fallback (handles weird CORS/CDN hiccups)
  const r2 = await fetch(PROXY + url, { cache: 'no-store' });
  if (!r2.ok) throw new Error(`HTTP ${r2.status} on ${url} (via proxy)`);
  return await r2.text();
}

export async function fetchOwidCsv(url) {
  const text = await fetchText(url);
  const parsed = Papa.parse(text, { header: true, dynamicTyping: true });
  if (parsed.errors?.length) {
    // Papa rarely throws; surface parsing issues
    console.warn('CSV parse warnings:', parsed.errors.slice(0, 2));
  }
  const data = parsed.data?.filter(Boolean) ?? [];
  if (!data.length) throw new Error('CSV contained no rows');
  return data;

  
}
