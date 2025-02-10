import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import StatisticDetail from './pages/StatisticDetail';
import Setting from './pages/Setting';

function App() {
  const apiUrl = process.env.REACT_APP_API_URL;

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/home/:title/:stat_id" element={<StatisticDetail />} />
      <Route path="/home/:user_id/setting" element={<Setting />} />
      </Routes>
    </Router>
  );
}

export default App;
