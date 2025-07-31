// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const features = [
  { path: '/dashboard', label: 'Dashboard', icon: '🧴' },
  { path: '/learn', label: 'Learn', icon: '🚮' },
  { path: '/quiz', label: 'Quiz', icon: '🥤' },
  { path: '/feedback', label: 'Feedback', icon: '🗑️' },
];

const Home = () => (
    <div className="home-container">
    <h1>Welcome to the Plastic Pollution Awareness Platform</h1>
     <p>
      This site offers real-time data, learning tools, and quizzes to promote
      environmental education.
    </p>
    <div className="features">
      {features.map((feature) => (
        <Link key={feature.path} to={feature.path} className="feature-card">
          <div className="feature-icon">{feature.icon}</div>
          <div>{feature.label}</div>
        </Link>
      ))}
    </div>
  </div>
);

export default Home;