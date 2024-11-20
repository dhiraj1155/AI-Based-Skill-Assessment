import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase'; // Ensure the correct import path for firebase
import { collection, query, where, getDocs } from 'firebase/firestore';
import Navbar from './Navbar';
import LeftPane from './LeftPane';
import 'bootstrap/dist/css/bootstrap.min.css';
import Quiz from './Quiz';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false); // State for LeftPane collapse
  const [username, setUsername] = useState(''); // State to store the username
  const [loading, setLoading] = useState(true); // Loading state for data fetch
  const [error, setError] = useState(null); // Error state for data fetch
  const [activeComponent, setActiveComponent] = useState('home'); // Track active component

  const handleProfileClick = () => {
    const userPrn = localStorage.getItem('userPRN'); // Retrieve PRN from localStorage

    if (userPrn) {
      navigate(`/profile/${userPrn}`);
    } else {
      alert('PRN not found. Please log in or register.');
    }
  };

  const toggleLeftPane = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Fetch user data from Firestore based on PRN
  const fetchUserData = async () => {
    const userPrn = localStorage.getItem('userPRN');
    if (userPrn) {
      try {
        const studentRef = collection(db, 'students');
        const q = query(studentRef, where('prn', '==', userPrn));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const studentData = querySnapshot.docs[0].data();
          setUsername(studentData.name); // Set the username from Firebase
        } else {
          setError('User not found.');
        }
      } catch (error) {
        setError('Error fetching user data.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Example course suggestions with updated images
  const courseSuggestions = [
    {
      image: 'https://images.unsplash.com/photo-1595225386386-79c3543adbd9?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'DSA Mastery',
      description: 'Learn Data Structures and Algorithms to ace coding interviews.',
      link: '/courses/dsa',
    },
    {
      image: 'https://plus.unsplash.com/premium_photo-1685086785054-d047cdc0e525?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Web Development Bootcamp',
      description: 'Master front-end and back-end technologies for full-stack development.',
      link: '/courses/web-development',
    },
    {
      image: 'https://images.unsplash.com/photo-1542744095-291d1f67b221?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fFVJX1VYfGVufDB8fHx8MTY5MDY3MjgwMg&ixlib=rb-1.2.1&q=80&w=800',
      title: 'UI/UX Design Fundamentals',
      description: 'Create stunning user interfaces with hands-on projects.',
      link: '/courses/ui-ux',
    },
  ];

  // Render content based on active component
  const renderContent = () => {
    switch (activeComponent) {
      case 'quiz':
        return <Quiz />;
      default:
        return (
          <div>
            {loading ? (
              <h2>Loading...</h2>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : (
              <h1>Welcome, {username || 'User'}!</h1>
            )}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                justifyContent: 'left',
                marginTop: '20px',
              }}
            >
              {courseSuggestions.map((course, index) => (
                <div className="card" style={{ width: '18rem' }} key={index}>
                  <img
                    className="card-img-top"
                    src={course.image}
                    alt={`${course.title} image`}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{course.title}</h5>
                    <p className="card-text">{course.description}</p>
                    <a href={course.link} className="btn btn-primary">
                      Explore Course
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Navbar at the top */}
      <Navbar onProfileClick={handleProfileClick} />

      <div style={{ display: 'flex', flex: 1 }}>
        {/* LeftPane occupying the left side */}
        <LeftPane
          isCollapsed={isCollapsed}
          toggleCollapse={toggleLeftPane}
          onMenuClick={setActiveComponent}
        />

        {/* Main content area */}
        <div
          style={{
            flex: 1,
            padding: '20px',
            marginLeft: isCollapsed ? '60px' : '250px', // Adjust margin dynamically
            transition: 'margin-left 0.3s ease',
          }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;