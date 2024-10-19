// Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

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
      <h1>Hello, Welcome to the Dashboard!</h1>
      <button onClick={handleProfileClick}>Profile</button>
    </div>
  );
};

export default Dashboard;
