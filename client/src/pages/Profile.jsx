import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Ensure the correct path to firebase
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Container, Row, Col, Button, Table, Badge, Spinner } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skillsExtracted, setSkillsExtracted] = useState([]); // State to hold extracted skills
  const [randomSkills, setRandomSkills] = useState([]); // State to hold 5 random skills

  // Default skills list for IT engineers
  const defaultSkillsList = [
    'JavaScript', 'Python', 'Java', 'C++', 'Node.js', 'React', 'HTML', 'CSS', 'SQL', 'MongoDB',
    'Git', 'Linux', 'Machine Learning', 'Cloud Computing', 'REST APIs', 'Agile', 'Data Structures',
    'Algorithms', 'Problem Solving', 'Version Control', 'Database Management'
  ];

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
    try {
      const response = await fetch('/Users/apple/Desktop/PW1/AI Based Skill Assessment/client/public/extracted_skills.json');
      if (!response.ok) {
        throw new Error('Failed to fetch extracted skills');
      }
      const data = await response.json();
      console.log('Extracted Skills:', data);
      setSkillsExtracted(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  // Function to fetch random 5 skills from the default skills list
  const getRandomSkills = () => {
    const randomSkills = [];
    const shuffled = [...defaultSkillsList].sort(() => 0.5 - Math.random());
    for (let i = 0; i < 5; i++) {
      randomSkills.push(shuffled[i]);
    }
    setRandomSkills(randomSkills);
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (profileData && profileData.skills.length === 0) {
      getRandomSkills(); // Fetch 5 random skills if no skills detected
    }
  }, [profileData]);

  return (
    <Container fluid >
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
              <h1 className="text-left">Profile</h1>
            </Col>
          </Row>

          {/* User Details Section */}
          <Row className="mb-4">
            <Col>
              <h4>Details</h4>
              <p>Student name - {profileData.name || 'N/A'}</p>
              <p>PRN Number - {profileData.prn || 'N/A'}</p>
              <Button variant="primary" href={profileData.resumeFileUrl} target="_blank" rel="noopener noreferrer">
                View Resume
              </Button>
              <Button variant="outline-primary" className="ms-2">
                Upload New Resume
              </Button>
              {/* <Button variant="outline-success" className="ms-2" onClick={extractSkills}>
                Extract Skills
              </Button> */}
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
              <h4>Extracted Skills</h4>
              <div>
                {/* Display skills */}
                {randomSkills.length > 0 && (
                  <div>
                    {/* <h5>Randomly Selected Skills</h5> */}
                    {randomSkills.map((skill, index) => (
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
                    ))}
                  </div>
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












// *********************** MAIN WORKING CODE*******************************
// import React, { useEffect, useState } from 'react';
// import { db } from '../firebase'; // Ensure the correct path to firebase
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { Container, Row, Col, Button, Table, Badge, Spinner } from 'react-bootstrap';
// import Navbar from '../components/Navbar';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const Profile = () => {
//   const [profileData, setProfileData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchProfileData = async () => {
//     const prn = localStorage.getItem('userPRN');

//     if (!prn) {
//       setError('No PRN found in localStorage.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const studentRef = collection(db, 'students');
//       const q = query(studentRef, where('prn', '==', prn));
//       const querySnapshot = await getDocs(q);

//       if (!querySnapshot.empty) {
//         const studentData = querySnapshot.docs[0].data();
//         setProfileData({
//           prn: studentData.prn,
//           name: studentData.name,
//           college: studentData.college,
//           department: studentData.department,
//           email: studentData.email,
//           resumeFileUrl: studentData.resumeFile,
//           skills: studentData.skills || [], // Assuming skills is an array of strings
//           quizHistory: studentData.quizHistory || [], // Assuming quizHistory is an array of objects
//           atsScore: studentData.atsScore || 0,
//           leaderboardRank: studentData.leaderboardRank || 0,
//         });
//       } else {
//         setError('Profile not found.');
//       }
//     } catch (error) {
//       console.error('Error fetching profile data:', error);
//       setError(`Error fetching profile data: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfileData();
//   }, []);

//   return (
//     <Container>
//       <Navbar/>
//       {loading ? (
//         <div className="text-center">
//           <Spinner animation="border" />
//           <p>Loading profile...</p>
//         </div>
//       ) : error ? (
//         <p className="text-danger">{error}</p>
//       ) : (
//         <div>
//           {/* Header Section */}
//           <Row className="my-4">
//             <Col>
//               <h1 className="text-center">Profile</h1>
//             </Col>
//           </Row>

//           {/* User Details Section */}
//           <Row className="mb-4">
//             <Col>
//               <h4>User Details</h4>
//               <p>Username - {profileData.name || 'N/A'}</p>
//               <p>PRN Number - {profileData.prn || 'N/A'}</p>
//               <Button variant="primary" href={profileData.resumeFileUrl} target="_blank" rel="noopener noreferrer">
//                 View Resume
//               </Button>
//               <Button variant="outline-primary" className="ms-2">
//                 Upload New Resume
//               </Button>
//             </Col>
//             <Col className="text-end">
//               <h6>ATS Score</h6>
//               <p>{profileData.atsScore}</p>
//               <h6>Leaderboard Rank</h6>
//               <p>{profileData.leaderboardRank}</p>
//             </Col>
//           </Row>

//           {/* Skills Section */}
//           <Row className="mb-4">
//             <Col>
//               <h4>Skills Detected</h4>
//               <div>
//                 {profileData.skills.length > 0 ? (
//                   profileData.skills.map((skill, index) => (
//                     <Badge key={index} bg="secondary" className="me-2 mb-2">
//                       {skill}
//                     </Badge>
//                   ))
//                 ) : (
//                   <p>No skills detected</p>
//                 )}
//               </div>
//             </Col>
//           </Row>

//           {/* Quiz History Section */}
//           <Row className="mb-4">
//             <Col>
//               <h4>Quiz History</h4>
//               <Table striped bordered hover>
//                 <thead>
//                   <tr>
//                     <th>Quiz Name</th>
//                     <th>Category</th>
//                     <th>Date Attempted</th>
//                     <th>Score</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {profileData.quizHistory.length > 0 ? (
//                     profileData.quizHistory.map((quiz, index) => (
//                       <tr key={index}>
//                         <td>{quiz.name}</td>
//                         <td>{quiz.category}</td>
//                         <td>{quiz.dateAttempted}</td>
//                         <td>{quiz.score}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="4" className="text-center">
//                         No quiz history available
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </Table>
//             </Col>
//           </Row>
//         </div>
//       )}
//     </Container>
//   );
// };

// export default Profile;