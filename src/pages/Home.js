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
    <section className="home-hero">
      <h1>See the Truth About Plastic</h1>
      <p>
        Explore real-time data on plastic waste, learn how it impacts our
        planet, and discover what you can do to help.
      </p>
      <Link to="/dashboard" className="cta-button">
        Start Exploring
      </Link>
    </section>
    <div className="features">
      {features.map((feature) => (
        <Link key={feature.path} to={feature.path} className="feature-card">
          <div className="feature-icon">{feature.icon}</div>
          <div>{feature.label}</div>
        </Link>
      ))}
    </div>
        <section className="platform-actions">
      <h2>What You Can Do on This Platform</h2>
      <div className="action-list">
        <div className="action-item">
          <h3>Visualize the Problem</h3>
          <p>
            View maps and charts that highlight plastic waste in your region and
            across the world.
          </p>
        </div>
        <div className="action-item">
          <h3>Learn with Interactive Modules</h3>
          <p>
            Discover the causes and effects of pollution through engaging stories
            and facts.
          </p>
        </div>
        <div className="action-item">
          <h3>Test Your Knowledge</h3>
          <p>
            Try short quizzes, then share what you've learned with friends and
            family.
          </p>
        </div>
      </div>
    </section>
  </div>
);

export default Home;