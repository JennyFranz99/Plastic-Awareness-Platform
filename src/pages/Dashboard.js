import React, { useEffect, useMemo, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend } from 'chart.js';
import { fetchOwidCsv } from '../services/owid';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

const urls = {
  production: 'https://ourworldindata.org/grapher/global-plastics-production.csv',
  mismanaged: 'https://ourworldindata.org/grapher/mismanaged-plastic-waste-global.csv',
  perCapita:  'https://ourworldindata.org/grapher/plastic-waste-per-capita.csv'
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
  const [state, setState] = useState('loading'); // loading | ready | error
  const [ts, setTs] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [p, m, pc] = await Promise.all([
          fetchOwidCsv(urls.production),
          fetchOwidCsv(urls.mismanaged),
          fetchOwidCsv(urls.perCapita),
        ]);
        if (!alive) return;
        setProduction(p); setMismanaged(m); setPerCapita(pc);
        setTs(new Date());
        setState('ready');
      } catch (e) {
        console.error(e);
        if (alive) setState('error');
      }
    })();
    return () => { alive = false; };
  }, []);

  // 1) Global production (year → tonnes)
  const prodData = useMemo(() => {
    const rows = production.filter(r => r.Entity === 'World' || r.entity === 'World' || !r.Entity && !r.entity); 
    // OWID varies columns between 'Entity'/'entity' and 'Year'/'year'
    const years = rows.map(r => r.Year ?? r.year);
    const tonnes = rows.map(r => r['Global plastics production (tonnes)'] ?? r.tonnes ?? r.value);
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
    const share = rows.map(r => r['Share of plastic waste that is mismanaged'] ?? r.value);
    return {
      labels: years,
      datasets: [{
        label: 'Global mismanaged plastic waste (%)',
        data: share
      }]
    };
  }, [mismanaged]);

  // 3) Per-capita plastic waste, country picker
  const countries = useMemo(() => {
    const set = new Set(perCapita.map(r => r.Entity ?? r.entity).filter(Boolean));
    return Array.from(set).sort().slice(0, 200);
  }, [perCapita]);

  const perCapitaData = useMemo(() => {
    const rows = perCapita.filter(r => (r.Entity ?? r.entity) === country);
    const years = rows.map(r => r.Year ?? r.year);
    const kg = rows.map(r => r['Plastic waste per capita (kg per person per day)'] ?? r.value);
    return {
      labels: years,
      datasets: [{
        label: `${country}: kg/person/day`,
        data: kg
      }]
    };
  }, [perCapita, country]);

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
      </div>

      <footer style={{opacity:.8, fontSize:13}}>
        Data courtesy of <a href="https://ourworldindata.org/plastic-pollution" target="_blank" rel="noreferrer">Our World in Data</a>.  
        This page auto-refreshes on reload; if the API ever fails, we’ll add caching as a fallback.
      </footer>
    </div>
  );
}
