import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './pages/SignIn'; // Adjust path as needed
import RegistrationForm from './components/RegistrationForm'; // Adjust path as needed
import Dashboard from './components/Dashboard';
import Profile from './pages/Profile'
import PRNVerificationForm from './components/PRNVerificationForm';

function App() {
  return (
    <Router>
      <Routes>
     
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/verify-prn" element={<PRNVerificationForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile/:prn" element={<Profile />} />
       
      </Routes>
    </Router>
  );
}

export default App;
