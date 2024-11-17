// Navbar.jsx
import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Form, FormControl, Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate from react-router-dom
import { getAuth, signOut } from 'firebase/auth'; // Import Firebase Authentication methods
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = ({ onProfileClick }) => {
  const navigate = useNavigate(); // Initialize useNavigate hook for redirection
  const auth = getAuth(); // Get Firebase Auth instance

  const handleLogout = async () => {
    try {
      // Sign out the user from Firebase
      await signOut(auth);

      // Clear localStorage or sessionStorage if any
      // localStorage.removeItem('userPRN'); // Adjust based on your auth data

      // Redirect to the homepage after logging out
      navigate('/');; // Redirect to the desired logout URL
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <BootstrapNavbar bg="light" expand="lg">
      <Container fluid>
        {/* Navbar Brand: Home with Link to Dashboard */}
        <BootstrapNavbar.Brand as={Link} to="/dashboard">AI Based Skill Assessment</BootstrapNavbar.Brand>
        
        {/* Toggler for mobile view */}
        <BootstrapNavbar.Toggle aria-controls="navbarScroll" />
        
        {/* Collapsible content */}
        <BootstrapNavbar.Collapse id="navbarScroll">
          {/* Left-aligned Nav items (if any) */}
          <Nav className="me-auto my-2 my-lg-0" navbarScroll />
          
          {/* Right-aligned Search bar and Profile button */}
          <Form className="d-flex">
            <FormControl
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>

          <Nav>
            <Nav.Link onClick={onProfileClick} className="ms-3"> {/* Call the function on click */}
              <Button variant="primary">Profile</Button>
            </Nav.Link>

            {/* Logout Button */}
            <Nav.Link onClick={handleLogout} className="ms-3">
              <Button variant="danger">Logout</Button>
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
