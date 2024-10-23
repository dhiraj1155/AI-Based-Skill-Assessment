import React from 'react';
import { auth, provider, signInWithPopup } from '../firebase'; // Adjust path as needed
import { useNavigate } from 'react-router-dom'; // For handling redirects
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { FaGoogle } from 'react-icons/fa'; // Import Google icon from react-icons

function SignIn() {
  const navigate = useNavigate(); // Use the navigate hook from react-router-dom

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('User Info:', user);

      // Save user email in local storage
      localStorage.setItem('userEmail', user.email);

      // Redirect to the registration form
      navigate('/register'); // Update to your actual registration route
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <h2 className="mb-4">Sign In to AI based Skill Assessment</h2>
      <button
        onClick={signInWithGoogle}
        className="btn btn-light border shadow-sm d-flex align-items-center justify-content-center"
        style={{
          backgroundColor: '#fff',
          borderColor: '#ddd',
          borderRadius: '32px',
          padding: '10px 20px',
          fontWeight: 'bold',
          width: '250px',
        }}
      >
        <FaGoogle className="me-2" /> {/* Google icon */}
        Sign in with Google
      </button>
    </div>
  );
}

export default SignIn;
