// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import TokenExchange from './components/TokenExchange';
import PatientDashboard from './components/PatientDashboard';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={LoginPage} />
        <Route path="/callback" component={TokenExchange} />
        <Route path="/dashboard" component={PatientDashboard} />
      </Switch>
    </Router>
  );
};

export default App;
