import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import { ConnectionsGame } from './components/games/connections';
import { FaceMashGame } from './components/games/facemash';
import { PlotFusionGame } from './components/games/plotfusion';
import ConnectionsArchive from './components/games/connections/ConnectionsArchive';
import FaceMashArchive from './components/games/facemash/FaceMashArchive';
import PlotFusionArchive from './components/games/plotfusion/PlotFusionArchive';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/connections" element={<ConnectionsGame />} />
          <Route path="/connections/archive" element={<ConnectionsArchive />} />
          <Route path="/face-mash" element={<FaceMashGame />} />
          <Route path="/face-mash/archive" element={<FaceMashArchive />} />
          <Route path="/plot-fusion" element={<PlotFusionGame />} />
          <Route path="/plot-fusion/archive" element={<PlotFusionArchive />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
