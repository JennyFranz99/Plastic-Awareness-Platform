import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav style={{ padding: '1rem', background: '#e0f7fa' }}>
      <Link to="/" style={{ margin: '0 1rem' }}>Home</Link>
      <Link to="/dashboard" style={{ margin: '0 1rem' }}>Dashboard</Link>
      <Link to="/learn" style={{ margin: '0 1rem' }}>Learn</Link>
      <Link to="/quiz" style={{ margin: '0 1rem' }}>Quiz</Link>
      <Link to="/feedback" style={{ margin: '0 1rem' }}>Feedback</Link>
    </nav>
  );
};

export default NavBar;
