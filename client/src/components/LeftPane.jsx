// LeftPane.jsx
import React from 'react';
import { FaTrophy, FaQuestionCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const LeftPane = ({ isCollapsed, toggleCollapse, onMenuClick }) => {
  return (
    <div
      style={{
        width: isCollapsed ? '60px' : '250px',
        height: '100vh',
        backgroundColor: '#f8f9fa',
        borderRight: '1px solid #ddd',
        position: 'fixed',
        transition: 'width 0.3s ease',
        padding: isCollapsed ? '10px' : '20px',
        overflow: 'hidden',
      }}
    >
      {/* Header with Collapse Toggle */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        {!isCollapsed && <h4>Home</h4>}
        <button
          className="btn btn-sm btn-light"
          onClick={toggleCollapse}
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {/* Menu Items */}
      <ListGroup variant="flush">
        <ListGroup.Item action onClick={() => onMenuClick('leaderboard')}>
          <FaTrophy className="me-2" />
          {!isCollapsed && 'Leaderboard'}
        </ListGroup.Item>
        <ListGroup.Item action onClick={() => onMenuClick('quiz')}>
          <FaQuestionCircle className="me-2" />
          {!isCollapsed && 'Quiz'}
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
};

export default LeftPane;