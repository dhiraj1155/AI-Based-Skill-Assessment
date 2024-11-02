// Navbar.jsx
import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Form, FormControl, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = ({ onProfileClick }) => {
  return (
    <BootstrapNavbar bg="light" expand="lg">
      <Container fluid>
        {/* Navbar Brand: Home with Link to Dashboard */}
        <BootstrapNavbar.Brand as={Link} to="/dashboard">Home</BootstrapNavbar.Brand>
        
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
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
