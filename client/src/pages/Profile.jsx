import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Ensure the correct path to firebase
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Container, Row, Col, Button, Table, Badge, Spinner } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [skillsExtracted, setSkillsExtracted] = useState([]); // State for extracted skills
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfileData = async () => {
    const prn = localStorage.getItem('userPRN');

    if (!prn) {
      setError('No PRN found in localStorage.');
      setLoading(false);
      return;
    }

    try {
      const studentRef = collection(db, 'students');
      const q = query(studentRef, where('prn', '==', prn));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const studentData = querySnapshot.docs[0].data();
        setProfileData({
          prn: studentData.prn,
          name: studentData.name,
          college: studentData.college,
          department: studentData.department,
          email: studentData.email,
          resumeFileUrl: studentData.resumeFile,
          skills: studentData.skills || [], // Assuming skills is an array of strings
          quizHistory: studentData.quizHistory || [], // Assuming quizHistory is an array of objects
          atsScore: studentData.atsScore || 0,
          leaderboardRank: studentData.leaderboardRank || 0,
        });
      } else {
        setError('Profile not found.');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError(`Error fetching profile data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const extractSkills = async () => {
    if (!profileData?.prn) {
      console.error('PRN is missing or undefined.');
      return;
    }
  
    console.log('PRN being sent to backend:', profileData.prn); // Log the PRN being sent
  
    try {
      const response = await fetch('http://localhost:5000/api/extract-skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prn: profileData.prn }), // Pass the PRN to the backend
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.error || 'Failed to extract skills');
      }
  
      const { skills } = await response.json();
      console.log('Extracted Skills:', skills);
      setSkillsExtracted(skills); // Update the state with the extracted skills
    } catch (error) {
      console.error('Error fetching skills:', error.message);
    }
  };
  

  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <Container fluid>
      <Navbar />
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading profile...</p>
        </div>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <div>
          {/* Header Section */}
          <Row className="my-4">
            <Col>
              <h1 className="text-center">Profile</h1>
            </Col>
          </Row>

          {/* User Details Section */}
          <Row className="mb-4">
            <Col>
              <h4>User Details</h4>
              <p>Username - {profileData.name || 'N/A'}</p>
              <p>PRN Number - {profileData.prn || 'N/A'}</p>
              <Button
                variant="primary"
                href={profileData.resumeFileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Resume
              </Button>
              <Button variant="outline-primary" className="ms-2">
                Upload New Resume
              </Button>
                 {/* Extract Skills Button */}
              <Button
                variant="outline-success"
                className="ms-2"
                onClick={extractSkills} // Trigger skill extraction on click
              >
                Extract Skills
              </Button>
            </Col>
            <Col className="text-end">
              <h6>ATS Score</h6>
              <p>{profileData.atsScore}</p>
              <h6>Leaderboard Rank</h6>
              <p>{profileData.leaderboardRank}</p>
            </Col>
          </Row>
        

          {/* Skills Section */}
          <Row className="mb-4">
            <Col>
              <h4>Skills Detected</h4>
              <div>
                {profileData.skills.length > 0 ? (
                  profileData.skills.map((skill, index) => (
                    <Badge key={index} bg="secondary" className="me-2 mb-2 mt-1">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p></p>
                )}
              </div>
            </Col>
          </Row>

  

          {/* Extracted Skills Section */}
          <Row className="mb-4">
            <Col>
            <div>
      {skillsExtracted.length > 0 ? (
        skillsExtracted.slice(0, 10).map((skill, index) => (
          <Badge
            key={index}
            bg="dark"
            className="me-2 mb-2"
            style={{
              backgroundColor: 'dark',
              color: 'white',
              padding: '10px',
            }}
          >
            {skill}
          </Badge>
        ))
      ) : (
        <p></p>
      )}
    </div>
            </Col>
          </Row>

          {/* Quiz History Section */}
          <Row className="mb-4">
            <Col>
              <h4>Quiz History</h4>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Quiz Name</th>
                    <th>Category</th>
                    <th>Date Attempted</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {profileData.quizHistory.length > 0 ? (
                    profileData.quizHistory.map((quiz, index) => (
                      <tr key={index}>
                        <td>{quiz.name}</td>
                        <td>{quiz.category}</td>
                        <td>{quiz.dateAttempted}</td>
                        <td>{quiz.score}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No quiz history available
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
        </div>
      )}
    </Container>
  );
};

export default Profile;
