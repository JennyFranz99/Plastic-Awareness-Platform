// src/pages/Learn.js
import React, { useState } from 'react';
import './Learn.css';

// Simple inline SVG icons so we do not rely on external image hosts
const svgProps = {
  width: 60,
  height: 60,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: 'stat-icon',
};

const FactoryIcon = () => (
  <svg {...svgProps}>
    <rect x="3" y="10" width="18" height="11" />
    <polyline points="3 10 3 6 9 10" />
    <polyline points="9 10 9 6 15 10" />
    <rect x="17" y="3" width="2" height="7" />
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

const OceanIcon = () => (
  <svg {...svgProps}>
    <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0v6H2z" />
  </svg>
);

// Static universal statistics about plastic pollution.
const stats = [
  {
    title: 'Annual Production',
    value: '≈430 million tons of plastic are produced each year',
	    icon: <FactoryIcon />,
    detail:
      'Plastic production is projected to double by 2040 if current trends continue.',
  },
  {
    title: 'Recycling Rate',
    value: 'Only about 9% of plastic is recycled globally',
	    icon: <RecycleIcon />,
    detail: 'Increasing recycling by just 10% could significantly cut waste.',
  },
  {
    title: 'Ocean Pollution',
    value: '≈8 million tons enter the ocean annually',
	    icon: <OceanIcon />,
    detail:
      'Ocean plastic threatens marine life, ecosystems, and coastal economies.',
  },
];

const Learn = () => {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="learn-container">
	      <h1>Learn About Plastic Pollution</h1>
      <p>
        These global statistics highlight the scale of the plastic problem and
        how our actions matter.
      </p>
      <div className="learning-column">
        {stats.map((s, idx) => (
          <div
            key={s.title}
            className="stat-card"
            onClick={() => setExpanded(expanded === idx ? null : idx)}
          >
            {s.icon}
            <h3>{s.title}</h3>
            <p>{s.value}</p>
            {expanded === idx && <p className="stat-detail">{s.detail}</p>}
          </div>
        ))}
      </div>
    </div>
	  );
};

export default Learn;