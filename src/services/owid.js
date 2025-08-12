import Papa from 'papaparse';

export async function fetchOwidCsv(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
  const text = await res.text();
  const { data } = Papa.parse(text, { header: true, dynamicTyping: true });
  return data; // array of objects with columns from the CSV
}
