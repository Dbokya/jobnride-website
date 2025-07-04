import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import {
  fetchSignInMethodsForEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from 'firebase/auth';
import './App.css';

const actionCodeSettings = {
  url: window.location.origin + '/?emailSignIn', // Must be in Firebase authorized domains
  handleCodeInApp: true,
  // Optionally add iOS, android, linkDomain if you have mobile apps
};

function EmailLinkAuth({ onVerified }) {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState('');
  const [availableMethods, setAvailableMethods] = useState(null);

  // Handle sign-in link if present in URL
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let storedEmail = window.prompt('Please provide your email for confirmation');
      signInWithEmailLink(auth, storedEmail, window.location.href)
        .then(() => {
          setStep('verified');
          if (onVerified) onVerified();
        })
        .catch((err) => {
          setError('Invalid or expired sign-in link.');
        });
    }
  }, [onVerified]);

  const handleSendLink = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setAvailableMethods(null);
    setLoading(true);
    try {
      // Normalize email
      const normalizedEmail = email.trim().toLowerCase();
      // Check if user exists in Firebase Auth
      const methods = await fetchSignInMethodsForEmail(auth, normalizedEmail);
      setAvailableMethods(methods);
      if (!methods || methods.length === 0) {
        setError('No user exists. Please download the app.');
        setLoading(false);
        return;
      }
      // Check if email link sign-in is enabled for this user
      if (!methods.includes('emailLink')) {
        setError('This email is registered, but email link sign-in is not enabled. Available sign-in methods: ' + methods.join(', '));
        setLoading(false);
        return;
      }
      await sendSignInLinkToEmail(auth, normalizedEmail, actionCodeSettings);
      setInfo('A sign-in link has been sent to your email. Please check your inbox.');
      setStep('linkSent');
    } catch (err) {
      setError('Failed to send sign-in link. Please check the email address.');
    }
    setLoading(false);
  };

  return (
    <div className="email-auth-dialog pro-auth-dialog">
      <div className="auth-card glass-card">
        <div className="auth-header">
          <img src="/logo192.png" alt="JobNRide Logo" className="auth-logo" />
          <h2>Sign in with Email</h2>
          <p className="auth-subtitle">Enter your email to receive a secure sign-in link.</p>
        </div>
        {step === 'email' && (
          <form onSubmit={handleSendLink} className="auth-form">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="yourname@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="auth-input"
              autoFocus
            />
            <button type="submit" className="auth-btn" disabled={loading}>{loading ? 'Sending...' : 'Send Sign-In Link'}</button>
          </form>
        )}
        {availableMethods && (
          <div className="auth-info" style={{ marginTop: 8 }}>
            <strong>Available sign-in methods for this email:</strong>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {availableMethods.length === 0 ? (
                <li>None (not registered)</li>
              ) : (
                availableMethods.map((m) => <li key={m}>{m}</li>)
              )}
            </ul>
          </div>
        )}
        {step === 'linkSent' && (
          <div className="auth-info">{info}</div>
        )}
        {step === 'verified' && (
          <div className="auth-info">Email verified and signed in!</div>
        )}
        {error && <div className="auth-error">{error}</div>}
        <div className="auth-footer">
          <span>We never share your email. Verification is required for security.</span>
        </div>
      </div>
    </div>
  );
}

export default EmailLinkAuth;
