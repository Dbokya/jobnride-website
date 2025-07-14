import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; 

function AdminLogin() {
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const setupRecaptcha = () => {
    // ✅ Use getApp() to pass the Firebase app to RecaptchaVerifier
    window.recaptchaVerifier = new RecaptchaVerifier(
      'recaptcha',
      {
        'size': 'invisible',
        'callback': (response) => {
          console.log('reCAPTCHA solved');
        },
      },// ✅ Use app instead of auth or auth.app
      auth
    );
  };

  const sendOtp = async () => {
    if (!phone.startsWith('+91')) {
      alert('Please enter phone number in correct format (e.g. +91...)');
      return;
    }

    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
    } catch (err) {
      console.error("OTP sending error:", err);
      alert("Failed to send OTP: " + err.message);
    }
  };

  const verifyOtp = async () => {
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data().isAdmin) {
        navigate('/admin/dashboard');
      } else {
        alert("You are not authorized to access the admin panel.");
        auth.signOut();
      }
    } catch (err) {
      console.error("OTP verification failed", err);
      alert("Invalid OTP");
    }
  };

  return (
    <div className="admin-login">
      <h2>Admin Login</h2>
      {!otpSent ? (
        <>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91..."
          />
          <div id="recaptcha"></div>
          <button onClick={sendOtp}>Send OTP</button>
        </>
      ) : (
        <>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}
    </div>
  );
}

export default AdminLogin;
