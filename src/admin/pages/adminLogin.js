import React, { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // 👁 Professional icons
import '../admin.css';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false); // Optional: for loading state
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter email and password.');
      return;
    }

    try {
      setLoggingIn(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      navigate('/admin/dashboard');
      setLoggingIn(false); // Reset loading state
    } catch (err) {
      console.error('Login error:', err);
      alert('Invalid email or password. Please try again.');
      navigate('/admin/login'); // Redirect to login on error
      setLoggingIn(false); // Reset loading state
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Admin Login</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="login-input"
        />

        <div className="password-wrapper">
          <input
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="login-input password-input"
          />
          <span
            className="eye-icon"
            onClick={() => setShowPass(!showPass)}
            title={showPass ? 'Hide password' : 'Show password'}
          >
            {showPass ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button onClick={handleLogin} className="login-button" disabled={loggingIn}>{loggingIn ? 'Logging in...' : 'Login'}</button>

        <p className="login-note">Only authorized admins can access this panel.</p>
      </div>
    </div>
  );
}

export default AdminLogin;
