import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import { ConnectionsGame } from './components/games/connections';
import { FaceMashGame } from './components/games/facemash';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/connections" element={<ConnectionsGame />} />
          <Route path="/face-mash" element={<FaceMashGame />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
