import React from 'react';
import { auth, provider, signInWithPopup } from '../firebase'; // Adjust path as needed
import { useNavigate } from 'react-router-dom'; // For handling redirects

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
    <div>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
}

export default SignIn;
