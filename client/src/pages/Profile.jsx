import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Ensure the correct path to firebase
import { collection, query, where, getDocs } from 'firebase/firestore';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
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

  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading profile...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <h1>Profile Information</h1>
          <p>PRN: {profileData.prn}</p>
          <p>Name: {profileData.name}</p>
          <p>College: {profileData.college}</p>
          <p>Department: {profileData.department}</p>
          <p>Email: {profileData.email}</p>
          {profileData.resumeFileUrl && (
            <a href={profileData.resumeFileUrl} target="_blank" rel="noopener noreferrer">View Resume</a>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
