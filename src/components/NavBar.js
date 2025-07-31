import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  return (
      <nav className="navbar">
      <Link to="/" className="nav-home">
        <span role="img" aria-label="home" className="home-icon">🏠</span>
        Home
      </Link>
    </nav>
  );
};

export default NavBar;