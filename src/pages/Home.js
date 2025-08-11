// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

// Icons reference external 3D trash images

const features = [
{
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'https://img.icons8.com/?size=100&id=I78lT9Mk9Qg1&format=png&color=000000',
  },
  {
    path: '/learn',
    label: 'Learn',
    icon: 'https://img.icons8.com/?size=100&id=46939&format=png&color=000000',
  },
  {
    path: '/quiz',
    label: 'Quiz',
    icon: 'https://cdn-icons-png.flaticon.com/512/1161/1161624.png',
  },
  {
    path: '/feedback',
    label: 'Feedback',
    icon: 'https://img.icons8.com/?size=100&id=re07nkF6LjZq&format=png&color=000000',
  },
];

const Home = () => (
    <div className="home-container">
    <section className="home-hero">
      <h1 className="home-title">See the Truth About Plastic</h1>
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
         <img
            src={feature.icon}
            alt={`${feature.label} icon`}
            className="feature-icon"
          />
          <div className="feature-label">{feature.label}</div>
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