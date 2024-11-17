import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import LeftPane from './LeftPane';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false); // State for LeftPane collapse

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

  // Example course suggestions (replace with dynamic data if needed)
  const courseSuggestions = [
    {
      image: 'https://via.placeholder.com/150',
      title: 'DSA Mastery',
      description: 'Learn Data Structures and Algorithms to ace coding interviews.',
      link: '/courses/dsa',
    },
    {
      image: 'https://via.placeholder.com/150',
      title: 'Web Development Bootcamp',
      description: 'Master front-end and back-end technologies for full-stack development.',
      link: '/courses/web-development',
    },
    {
      image: 'https://via.placeholder.com/150',
      title: 'UI/UX Design Fundamentals',
      description: 'Create stunning user interfaces with hands-on projects.',
      link: '/courses/ui-ux',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Navbar at the top */}
      <Navbar onProfileClick={handleProfileClick} />

      <div style={{ display: 'flex', flex: 1 }}>
        {/* LeftPane occupying the left side */}
        <LeftPane isCollapsed={isCollapsed} toggleCollapse={toggleLeftPane} />

        {/* Main content area */}
        <div
          style={{
            flex: 1,
            padding: '20px',
            marginLeft: isCollapsed ? '60px' : '250px', // Adjust margin dynamically
            transition: 'margin-left 0.3s ease',
          }}
        >
          <h1>Welcome "Username"!</h1>

          {/* Course Suggestions Section */}
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
      </div>
    </div>
  );
};

export default Dashboard;
