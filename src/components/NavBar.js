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
        <Link to="/dashboard" className="nav-link">
        Dashboard
      </Link>
    </nav>
  );
};

export default NavBar;