// src/components/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from '../context/firebase'; // Ensure firebase context is set up correctly
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css'; // Make sure the CSS file exists and is correctly imported

const LoginPage = () => {
  const [email, setEmail] = useState(''); // State for email input
  const [password, setPassword] = useState(''); // State for password input
  const [error, setError] = useState(''); // For error messages
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login/register
  const [isLoading, setIsLoading] = useState(false); // Loading state while making API calls
  const navigate = useNavigate();

  useEffect(() => {
    setError(''); // Clear errors when switching between login/register
  }, [isRegistering]);

  // Handles Login and Registration
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear error before attempting
    setIsLoading(true);

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Admin successfully registered!');
        setIsRegistering(false); // Automatically switch back to login after registration
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/admin/dashboard'); // Redirect to dashboard
      }
    } catch (err) {
      setError(err.message); // Display the error message
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  // Handles Google Sign-In
  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/admin/dashboard'); // Redirect to dashboard
    } catch (err) {
      setError(err.message); // Display the error message
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  // Handles Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Logged out successfully!');
      navigate('/'); // Redirect to home
    } catch (err) {
      setError(err.message); // Display the error message
    }
  };

  return (
    <div className="login-container">
      <h1>{isRegistering ? 'Register Admin' : 'Admin Login'}</h1>

      {/* Display error messages */}
      {error && <p className="error">{error}</p>}

      {/* Login/Registration Form */}
      <form onSubmit={handleFormSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading} // Disable during request
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading} // Disable during request
        />
        <button
          type="submit"
          className={isLoading ? 'disabled' : ''}
          disabled={isLoading}
        >
          {isLoading ? (isRegistering ? 'Registering...' : 'Logging in...') : isRegistering ? 'Register' : 'Login'}
        </button>
      </form>

      {/* Google Sign-In Button */}
      <button
        onClick={handleGoogleSignIn}
        className={`google-signin-button ${isLoading ? 'disabled' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Sign in with Google'}
      </button>

      {/* Logout Button (only visible when user is authenticated) */}
      {auth.currentUser && (
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      )}

      {/* Toggle between Login and Register */}
      <p className="toggle-form">
        {isRegistering ? 'Already an admin? ' : 'New admin? '}
        <span
          onClick={() => setIsRegistering(!isRegistering)}
          className="toggle-link"
        >
          {isRegistering ? 'Login' : 'Register'}
        </span>
      </p>
    </div>
  );
};

export default LoginPage; // Ensure default export
