import React, { useEffect, useMemo, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend } from 'chart.js';
import { fetchOwidCsv } from '../services/owid';


// pick the first numeric column (skips Entity/Code/Year)
const firstNumericKey = (row) => {
  if (!row) return null;
  const skip = new Set(['Entity','entity','Code','code','Year','year']);
  for (const k of Object.keys(row)) {
    if (!skip.has(k) && typeof row[k] === 'number' && !Number.isNaN(row[k])) {
      return k;
    }
  }
  return null;
};

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

const urls = {
  production: process.env.PUBLIC_URL + '/data/global-plastics-production.csv',
  mismanaged: process.env.PUBLIC_URL + '/data/share-of-plastic-waste-that-is-mismanaged.csv',
  perCapita: process.env.PUBLIC_URL + '/data/plastic-waste-per-capita.csv'
};

const Card = ({ children }) => (
  <div style={{
    background: '#ffffff',
    borderRadius: 16,
    padding: '1rem',
    boxShadow: '0 10px 24px rgba(0,0,0,.08)',
    border: '1px solid rgba(0,0,0,.06)'
  }}>
    {children}
  </div>
);

export default function Dashboard() {
  const [production, setProduction] = useState([]);
  const [mismanaged, setMismanaged] = useState([]);
  const [perCapita, setPerCapita] = useState([]);
  const [country, setCountry] = useState('United States'); // default selection
  const [year, setYear] = useState(null); // latest year once data loads
  const [state, setState] = useState('loading'); // loading | ready | error
  const [ts, setTs] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [p, m, pc] = await Promise.all([
          fetchOwidCsv(urls.production, { cacheKey: 'owid_production' }),
          fetchOwidCsv(urls.mismanaged, { cacheKey: 'owid_mismanaged' }),
          fetchOwidCsv(urls.perCapita,  { cacheKey: 'owid_percapita' }),
        ]);
        if (!alive) return;
        setProduction(p); setMismanaged(m); setPerCapita(pc);
        setTs(new Date());
        setState('ready');
      } catch (e) {
        console.error('Dashboard load failed:', e);
        if (alive) setState('error');
      }
    })();
    return () => { alive = false; };
  }, []);

 const prodData = useMemo(() => {
  const rows = production.filter(r => (r.Entity ?? r.entity) === 'World' || !r.Entity && !r.entity);
  const years = rows.map(r => r.Year ?? r.year);
  const col = firstNumericKey(rows[0]);          // <-- auto-pick the value column
  const tonnes = rows.map(r => (col ? r[col] : null));

  return {
    labels: years,
    datasets: [{
      label: 'Global plastics production (tonnes)',
      data: tonnes,
      tension: 0.3,
    }]
  };
}, [production]);

  // 2) Global mismanaged share (%)
const misData = useMemo(() => {
  const rows = mismanaged.filter(r => (r.Entity ?? r.entity) === 'World');
  const years = rows.map(r => r.Year ?? r.year);
  const col = firstNumericKey(rows[0]);
  const share = rows.map(r => (col ? r[col] : null));

  return {
    labels: years,
    datasets: [{ label: 'Global mismanaged plastic waste (%)', data: share }]
  };
}, [mismanaged]);

  // 3) Per-capita plastic waste, country picker
  const countries = useMemo(() => {
  const set = new Set(perCapita.map(r => r.Entity ?? r.entity).filter(Boolean));
  return Array.from(set).sort().slice(0, 200);
}, [perCapita]);

const years = useMemo(() => {
  const set = new Set(perCapita.map(r => r.Year ?? r.year));
  return Array.from(set).sort((a,b) => a - b);
}, [perCapita]);

useEffect(() => {
  if (years.length && year == null) setYear(years[years.length - 1]);
}, [years, year]);

const perCapitaData = useMemo(() => {
  const rows = perCapita.filter(r => (r.Entity ?? r.entity) === country);
  const labels = rows.map(r => r.Year ?? r.year);
  const col = firstNumericKey(rows[0]);
  const values = rows.map(r => (col ? r[col] : null));

  return { labels, datasets: [{ label: `${country}: kg/person/day`, data: values }] };
}, [perCapita, country]);

const topPerCapitaData = useMemo(() => {
  if (!year) return null;
  const col = firstNumericKey(perCapita[0]);
  const rows = perCapita.filter(r => (r.Year ?? r.year) === year)
    .sort((a,b) => (b[col] ?? -Infinity) - (a[col] ?? -Infinity))
    .slice(0, 10);
  return {
    labels: rows.map(r => r.Entity ?? r.entity),
    datasets: [{ label: `${year} top 10 kg/person/day`, data: rows.map(r => r[col]) }]
  };
}, [perCapita, year]);


  if (state === 'loading') return <p style={{padding:'1rem'}}>⏳ Loading live data…</p>;
  if (state === 'error')   return <p style={{padding:'1rem'}}>⚠️ Couldn’t load the dataset. Please refresh.</p>;

  return (
    <div style={{padding:'1rem', display:'grid', gap:'1rem'}}>
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2 style={{margin:0}}>🌍 Live Plastics Dashboard</h2>
        <small>Last updated: {ts?.toLocaleString()}</small>
      </header>

      <Card>
        <h3 style={{marginTop:0}}>📈 Global Plastics Production</h3>
        <p style={{marginTop:0, opacity:.8, fontSize:14}}>
          Source: Our World in Data. Hover the line to explore values by year.
        </p>
        <Line data={prodData} options={{responsive:true, plugins:{legend:{display:true}}}} />
      </Card>

      <div style={{display:'grid', gap:'1rem', gridTemplateColumns:'1fr',}}>
        <Card>
          <h3 style={{marginTop:0}}>♻️ Mismanaged Plastic Waste (Global %)</h3>
          <Line data={misData} options={{responsive:true, plugins:{legend:{display:true}}}} />
        </Card>

        <Card>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:'1rem'}}>
            <h3 style={{marginTop:0}}>🧭 Per-Capita Plastic Waste</h3>
            <select
              value={country}
              onChange={e => setCountry(e.target.value)}
              style={{padding:'.5rem', borderRadius:12, border:'1px solid #ddd'}}
            >
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Bar data={perCapitaData} options={{responsive:true, plugins:{legend:{display:true}}, scales:{x:{ticks:{maxRotation:0}}}}} />
        </Card>

         <Card>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:'1rem'}}>
            <h3 style={{marginTop:0}}>🏅 Top Per-Capita Plastic Waste</h3>
            <select
              value={year ?? ''}
              onChange={e => setYear(Number(e.target.value))}
              style={{padding:'.5rem', borderRadius:12, border:'1px solid #ddd'}}
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          {topPerCapitaData && (
            <Bar
              data={topPerCapitaData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                indexAxis: 'y'
              }}
            />
          )}
        </Card>
      </div>

      <footer style={{opacity:.8, fontSize:13}}>
        Data courtesy of <a href="https://ourworldindata.org/plastic-pollution" target="_blank" rel="noreferrer">Our World in Data</a>.  
        This page auto-refreshes on reload; if the API ever fails, we’ll add caching as a fallback.
      </footer>
    </div>
  );
}
