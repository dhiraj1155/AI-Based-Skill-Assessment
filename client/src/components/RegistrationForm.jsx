//registration form

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    prn: '',
    name: '',
    college: '',
    department: '',
    resumeFile: null, // New field for the resume file
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      resumeFile: e.target.files[0], // Update resume file
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        throw new Error('User email not found. Please sign in again.');
      }

      // Create a form data object to include the resume file
      const formDataToSend = new FormData();
      formDataToSend.append('prn', formData.prn);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('college', formData.college);
      formDataToSend.append('department', formData.department);
      formDataToSend.append('email', email);
      formDataToSend.append('resumeFile', formData.resumeFile); // Attach resume file

      const response = await axios.post('http://localhost:5000/api/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set multipart for file upload
        },
      });

      setSuccess(response.data.message);
      setError('');

      // Redirect to the dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000); // Wait 2 seconds before redirecting
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred.');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-form">
      <h2>Complete Your Registration</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>PRN:</label>
          <input
            type="text"
            name="prn"
            value={formData.prn}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>College:</label>
          <input
            type="text"
            name="college"
            value={formData.college}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Department:</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Resume:</label>
          <input
            type="file"
            name="resumeFile"
            onChange={handleFileChange}
            accept=".pdf, .doc, .docx"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
