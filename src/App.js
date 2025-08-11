// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Quiz from './pages/Quiz';
import Feedback from './pages/Feedback';
import Newsletter from './pages/Newsletter';
import Forum from './pages/Forum';

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/newsletter" element={<Newsletter />} />
        <Route path="/forum" element={<Forum />} />
      </Routes>
    </>
  );
}

export default App;