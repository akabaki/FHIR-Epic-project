// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import TokenExchange from './components/TokenExchange';
import PatientDashboard from './components/PatientDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        {/* <Route path="/callback" component={TokenExchange} /> */}
        <Route path="/dashboard" component={<PatientDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
