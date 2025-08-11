import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">
        <span role="img" aria-label="home" className="home-icon">🏠</span>
        Home
        </Link>
      <Link to="/dashboard" className="nav-link">Dashboard</Link>
      <Link to="/feedback" className="nav-link">Feedback</Link>
      <Link to="/newsletter" className="nav-link">Newsletter</Link>
      <Link to="/forum" className="nav-link">Forum</Link>
    </nav>
  );
};

export default NavBar;