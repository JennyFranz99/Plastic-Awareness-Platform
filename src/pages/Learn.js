// src/pages/Learn.js
import React from 'react';
import './Learn.css';

// Static universal statistics about plastic pollution.
const stats = [
  {
    title: 'Annual Production',
    value: '≈430 million tons of plastic are produced each year',
    icon: 'https://img.icons8.com/3d-fluency/94/factory.png',
  },
  {
    title: 'Recycling Rate',
    value: 'Only about 9% of plastic is recycled globally',
    icon: 'https://img.icons8.com/3d-fluency/94/recycle-bin.png',
  },
  {
    title: 'Ocean Pollution',
    value: '≈8 million tons enter the ocean annually',
    icon: 'https://img.icons8.com/3d-fluency/94/ocean.png',
  },
];

const Learn = () => (
    <div className="learn-container">
    <h1>Learn About Plastic Pollution</h1>
    <p>
      These global statistics highlight the scale of the
      plastic problem and how our actions matter.
    </p>
    <div className="learning-column">
      {stats.map((s) => (
        <div key={s.title} className="stat-card">
          <img src={s.icon} alt="" className="stat-icon" />
          <h3>{s.title}</h3>
          <p>{s.value}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Learn;
