// src/pages/Dashboard.js
import React, { useCallback, useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

// Open dataset providing plastic waste data.
// The structure of the returned JSON is expected to be an object whose keys
// represent years and values represent the metric to be charted. The previous
// Our World in Data endpoint began returning a 404; the URL below points to a
// copy of the dataset hosted on GitHub. A small local JSON file is used as a
// fallback if the remote request fails.
const DATA_URL =
  'https://raw.githubusercontent.com/owid/owid-datasets/master/datasets/Plastic%20waste%20generation/Plastic%20waste%20generation.json';
const FALLBACK_URL = '/plastic-waste-generation.json';

function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);


  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
            let response;
      try {
        response = await fetch(DATA_URL);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
      } catch (remoteErr) {
        response = await fetch(FALLBACK_URL);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
      }
      
      const json = await response.json();

      // Attempt to normalise the data into an array consumable by Recharts.
      let parsed = [];
      if (Array.isArray(json)) {
        parsed = json;
      } else if (Array.isArray(json.data)) {
        parsed = json.data;
      } else if (json.data && typeof json.data === 'object') {
        parsed = Object.entries(json.data).map(([year, value]) => ({
          year,
          value,
        }));
      }
      setData(parsed);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, [loadData]);

  return (
    <div>
      <h1>Global Plastic Waste Generation</h1>
      <p>Data sourced from Our World in Data.</p>
      <button type="button" onClick={loadData} disabled={loading}>
        Refresh
      </button>
      <p>Last updated: {lastUpdated || '—'}</p>
      {loading && <p>Loading…</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && data.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis dataKey="value" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default Dashboard;

