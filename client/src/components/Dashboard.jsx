// Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    const userPrn = localStorage.getItem('userPRN'); // Retrieve PRN from localStorage

    if (userPrn) {
      navigate(`/profile/${userPrn}`);
    } else {
      alert('PRN not found. Please log in or register.');
    }
  };

  return (
    <div>
      <Navbar onProfileClick={handleProfileClick} /> {/* Pass the function to Navbar */}
      <h1>Hello, Welcome to the Dashboard!</h1>
      
    </div>
  );
};

export default Dashboard;
