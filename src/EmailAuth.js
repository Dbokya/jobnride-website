import React, { useState } from 'react';
import { auth } from './firebase';
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import './App.css';

const actionCodeSettings = {
  // URL you want to redirect back to. This has to be whitelisted in the Firebase Console.
  url: window.location.origin + '/?emailSignIn',
  handleCodeInApp: true,
};

function EmailAuth({ onVerified }) {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState('');

  // Handle sign-in link if present in URL
  React.useEffect(() => {
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
    setLoading(true);
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
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
          <p className="auth-subtitle">Enter your Gmail address to receive a secure sign-in link.</p>
        </div>
        {step === 'email' && (
          <form onSubmit={handleSendLink} className="auth-form">
            <label htmlFor="email">Gmail Address</label>
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

export default EmailAuth;
