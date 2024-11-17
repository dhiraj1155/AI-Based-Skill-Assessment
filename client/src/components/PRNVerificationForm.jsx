import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PRNVerificationForm = () => {
  const [prn, setPrn] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePRNSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const email = localStorage.getItem('userEmail'); // Get the email of the logged-in user
      if (!email) {
        throw new Error('User email not found. Please sign in again.');
      }

      // Make a backend call to validate PRN
      const response = await axios.post('http://localhost:5000/api/verify-prn', { prn, email });

      // Handle success: PRN is valid and associated with the user
      if (response.data.success) {
        setError('');
        // Redirect to the dashboard
        navigate('/dashboard');
      } else {
        throw new Error('Invalid PRN or PRN not associated with this user.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="border p-4 rounded shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center">Verify PRN</h2>
        {error && <p className="text-danger">{error}</p>}
        <form onSubmit={handlePRNSubmit}>
          <div className="mb-3">
            <label htmlFor="prn" className="form-label">
              PRN:
            </label>
            <input
              type="text"
              name="prn"
              id="prn"
              className="form-control"
              value={prn}
              onChange={(e) => setPrn(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify PRN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PRNVerificationForm;
