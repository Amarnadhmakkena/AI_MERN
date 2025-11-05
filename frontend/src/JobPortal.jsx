import React, { useState } from 'react';
import axios from 'axios';

export default function JobPortal() {
  const [view, setView] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Static username and password (for testing/demo purposes)
  const staticUsername = 'user';
  const staticPassword = '123';

  const signup = async () => {
    // Prevent signup with any credentials other than the static ones
    if (username === staticUsername && password === staticPassword) {
      alert('Account already exists with the static credentials.');
      setView('login');
    } else {
      alert('Signup only available with predefined credentials (static).');
    }
  };

  const login = async () => {
    // Clear any previous errors
    setErrorMessage('');

    // Check for static username and password
    if (username === staticUsername && password === staticPassword) {
      // Simulate a successful login response with a static token
      const fakeToken = 'fake-jwt-token';
      localStorage.setItem('token', fakeToken);
      setToken(fakeToken);
      setView('scanner');
    } else {
      setErrorMessage('Invalid username or password. Please try again.');
    }
  };

  const uploadResume = async (e) => {
    const file = e.target.files[0];
    const form = new FormData();
    form.append('resume', file);

    try {
      setLoading(true);

      // Simulate a successful resume upload response with static matched jobs
      const res = {
        data: {
          matchedJobs: [
            { title: 'Software Engineer' },
            { title: 'Frontend Developer' },
            { title: 'Backend Developer' }
          ]
        }
      };

      setMatchedJobs(res.data.matchedJobs);
    } catch (error) {
      setErrorMessage('Failed to upload resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {view === 'login' && (
        <>
          <h1>Job Portal</h1>
          <input
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <button onClick={login} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <p className="toggle" onClick={() => setView('signup')}>
            Don't have an account? Sign Up
          </p>
        </>
      )}

      {view === 'signup' && (
        <>
          <h1>Create Account</h1>
          <input
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <button onClick={signup} disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
          <p className="toggle" onClick={() => setView('login')}>
            Already have an account? Login
          </p>
        </>
      )}

      {view === 'scanner' && (
        <>
          <h2>Upload Resume</h2>
          <input type="file" onChange={uploadResume} />
          {loading && <p>Loading...</p>}
          <h2>Matched Jobs</h2>
          <ul className="jobs-list">
            {matchedJobs.map((job, i) => (
              <li key={i}>{job.title}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
