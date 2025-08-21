import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { fetchOwidCsv } from '../services/owid';
import './Dashboard.css';

const svgProps = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const GlobeIcon = () => (
  <svg {...svgProps}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="12" y1="2" x2="12" y2="22" />
  </svg>
);

const ChartIcon = () => (
  <svg {...svgProps}>
    <polyline points="3 17 9 11 13 15 21 7" />
    <polyline points="21 21 3 21 3 3" />
  </svg>
);

const RecycleIcon = () => (
  <svg {...svgProps}>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0114.13-3.36L23 10" />
    <path d="M1 14l5.37 4.36A9 9 0 0020.49 15" />
  </svg>
);

const CompassIcon = () => (
  <svg {...svgProps}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="12 8 8 16 16 12 12 8" />
  </svg>
);

const MedalIcon = () => (
  <svg {...svgProps}>
    <circle cx="12" cy="12" r="5" />
    <polyline points="9 17 7 21 12 19 17 21 15 17" />
  </svg>
);

const RefreshIcon = () => (
  <svg {...svgProps} width="20" height="20">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0114.13-3.36L23 10" />
    <path d="M1 14l5.37 4.36A9 9 0 0020.49 15" />
  </svg>
);

// pick the first numeric column (skips Entity/Code/Year)
const firstNumericKey = (row) => {
  if (!row) return null;
  const skip = new Set(['Entity', 'entity', 'Code', 'code', 'Year', 'year']);
  for (const k of Object.keys(row)) {
    if (!skip.has(k) && typeof row[k] === 'number' && !Number.isNaN(row[k])) {
      return k;
    }
  }
  return null;
};

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

// Our World in Data CSV endpoints for live dashboard data
const OWID_BASE = 'https://ourworldindata.org/grapher/';
const urls = {
 production: `${OWID_BASE}global-plastics-production.csv`,
  mismanaged: `${OWID_BASE}share-of-plastic-waste-that-is-mismanaged.csv`,
  perCapita: `${OWID_BASE}plastic-waste-per-capita.csv`,
};

const Card = ({ children }) => <div className="dashboard-card">{children}</div>;

export default function Dashboard() {
  const [production, setProduction] = useState([]);
  const [mismanaged, setMismanaged] = useState([]);
  const [perCapita, setPerCapita] = useState([]);
  const [country, setCountry] = useState('United States');
  const [year, setYear] = useState(null);
  const [state, setState] = useState('loading'); // loading | ready | error
  const [ts, setTs] = useState(null);
  const [prodChartType, setProdChartType] = useState('line');
  
   const loadData = useCallback(async () => {
    setState('loading');
    try {
      const [p, m, pc] = await Promise.all([
        fetchOwidCsv(urls.production, { cacheKey: 'owid_production' }),
        fetchOwidCsv(urls.mismanaged, { cacheKey: 'owid_mismanaged' }),
        fetchOwidCsv(urls.perCapita, { cacheKey: 'owid_percapita' }),
      ]);
      setProduction(p);
      setMismanaged(m);
      setPerCapita(pc);
      setTs(new Date());
      setState('ready');
    } catch (e) {
      console.error('Dashboard load failed:', e);
      setState('error');
    }
  }, []);
  
    useEffect(() => {
    loadData();
  }, [loadData]);

  const prodData = useMemo(() => {
    const rows = production.filter(
      (r) => (r.Entity ?? r.entity) === 'World' || (!r.Entity && !r.entity)
    );
    const years = rows.map((r) => r.Year ?? r.year);
    const col = firstNumericKey(rows[0]);
    const tonnes = rows.map((r) => (col ? r[col] : null));

    return {
      labels: years,
      datasets: [
        {
          label: 'Global plastics production (tonnes)',
          data: tonnes,
          tension: 0.3,
        },
      ],
    };
  }, [production]);
  
    // 2) Global mismanaged share (%)
    const misData = useMemo(() => {
    const rows = mismanaged.filter((r) => (r.Entity ?? r.entity) === 'World');
    const years = rows.map((r) => r.Year ?? r.year);
    const col = firstNumericKey(rows[0]);
    const share = rows.map((r) => (col ? r[col] : null));

    return {
      labels: years,
      datasets: [{ label: 'Global mismanaged plastic waste (%)', data: share }],
    };
  }, [mismanaged]);

// 3) Per-capita plastic waste, country picker
  const countries = useMemo(() => {
      const set = new Set(
      perCapita.map((r) => r.Entity ?? r.entity).filter(Boolean)
    );
    return Array.from(set).sort().slice(0, 200);
  }, [perCapita]);

  const years = useMemo(() => {
    const set = new Set(perCapita.map((r) => r.Year ?? r.year));
    return Array.from(set).sort((a, b) => a - b);
  }, [perCapita]);

  useEffect(() => {
    if (years.length && year == null) setYear(years[years.length - 1]);
  }, [years, year]);

  const perCapitaData = useMemo(() => {
    const rows = perCapita.filter((r) => (r.Entity ?? r.entity) === country);
    const labels = rows.map((r) => r.Year ?? r.year);
    const col = firstNumericKey(rows[0]);
    const values = rows.map((r) => (col ? r[col] : null));

    return { labels, datasets: [{ label: `${country}: kg/person/day`, data: values }] };
  }, [perCapita, country]);

  const topPerCapitaData = useMemo(() => {
    if (!year) return null;
    const col = firstNumericKey(perCapita[0]);
    const rows = perCapita
      .filter((r) => (r.Year ?? r.year) === year)
      .sort((a, b) => (b[col] ?? -Infinity) - (a[col] ?? -Infinity))
      .slice(0, 10);
    return {
      labels: rows.map((r) => r.Entity ?? r.entity),
      datasets: [
        { label: `${year} top 10 kg/person/day`, data: rows.map((r) => r[col]) },
      ],
    };
  }, [perCapita, year]);

  if (state === 'loading')
    return <p style={{ padding: '1rem' }}>⏳ Loading live data…</p>;
  if (state === 'error')
    return (
      <p style={{ padding: '1rem' }}>
        ⚠️ Couldn’t load the dataset. Please refresh.
      </p>
    );
	
	  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2 className="card-title">
          <GlobeIcon /> Live Plastics Dashboard
        </h2>
        <div className="card-actions">
          <small>Last updated: {ts?.toLocaleString()}</small>
          <button className="refresh-btn" onClick={loadData} aria-label="Refresh data">
            <RefreshIcon />
          </button>
        </div>
      </header>

      <Card>
	          <div className="card-actions">
          <h3 className="card-title">
            <ChartIcon /> Global Plastics Production
          </h3>
          <button onClick={() => setProdChartType(prodChartType === 'line' ? 'bar' : 'line')}>
            {prodChartType === 'line' ? 'Bar' : 'Line'} view
          </button>
        </div>
        <p className="card-subtext">
          Source: Our World in Data. Hover the {prodChartType === 'line' ? 'line' : 'bars'} to
          explore values by year.
        </p>
		        {prodChartType === 'line' ? (
          <Line data={prodData} options={{ responsive: true, plugins: { legend: { display: true } } }} />
        ) : (
          <Bar data={prodData} options={{ responsive: true, plugins: { legend: { display: true } } }} />
        )}
      </Card>
	  
	       <div className="card-grid">
        <Card>
		          <h3 className="card-title">
            <RecycleIcon /> Mismanaged Plastic Waste (Global %)
          </h3>
          <Line data={misData} options={{ responsive: true, plugins: { legend: { display: true } } }} />
        </Card>

        <Card>
		          <div className="card-actions">
            <h3 className="card-title">
              <CompassIcon /> Per-Capita Plastic Waste
            </h3>
            <select value={country} onChange={(e) => setCountry(e.target.value)}>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
		            <Bar
            data={perCapitaData}
            options={{
              responsive: true,
              plugins: { legend: { display: true } },
              scales: { x: { ticks: { maxRotation: 0 } } },
            }}
          />
        </Card>

        <Card>
          <div className="card-actions">
            <h3 className="card-title">
              <MedalIcon /> Top Per-Capita Plastic Waste
            </h3>
            <select value={year ?? ''} onChange={(e) => setYear(Number(e.target.value))}>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          {topPerCapitaData && (
            <Bar
              data={topPerCapitaData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
				                indexAxis: 'y',
              }}
            />
          )}
        </Card>
      </div>

      <footer className="dashboard-footer">
        Data courtesy of{' '}
        <a
          href="https://ourworldindata.org/plastic-pollution"
          target="_blank"
          rel="noreferrer"
        >
          Our World in Data
        </a>
        . This page auto-refreshes on reload; use the refresh button to fetch the latest data.
      </footer>
    </div>
  );
}