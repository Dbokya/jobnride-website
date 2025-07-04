import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Button, TextField, Avatar, CircularProgress, Typography, Box, Paper, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function UserProfile({ user, onLogout, onEdit, onClose }) {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchUser = async () => {
      setLoading(true);
      try {
        const db = getFirestore();
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
          setForm(userSnap.data());
        }
      } catch (e) {
        // handle error
      }
      setLoading(false);
    };
    fetchUser();
  }, [user]);

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => { setEditMode(false); setForm(userData); };
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = async () => {
    setSaving(true);
    try {
      const db = getFirestore();
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, form);
      setUserData(form);
      setEditMode(false);
    } catch (e) {
      // handle error
    }
    setSaving(false);
  };

  // Dynamically get all user fields except UID and fcmToken
  const userFields = userData ? Object.keys(userData).filter(f => f !== 'uid' && f !== 'fcmToken') : [];

  // Phone field (not editable)
  const phoneValue = user?.phoneNumber || userData?.phone || '';

  // Helper: format date fields to dd-mm-yy, including Firestore Timestamp objects
  function formatValue(field, value) {
    if (!value) return '';
    // Firestore Timestamp object
    if (typeof value === 'object' && value !== null && 'seconds' in value && 'nanoseconds' in value) {
      const d = new Date(value.seconds * 1000);
      if (!isNaN(d)) return d.toLocaleDateString('en-GB').replace(/\//g, '-');
      return '';
    }
    // Try to detect date fields by name or value
    if (typeof value === 'string' && (field.toLowerCase().includes('date') || /^\d{4}-\d{2}-\d{2}/.test(value))) {
      const d = new Date(value);
      if (!isNaN(d)) return d.toLocaleDateString('en-GB').replace(/\//g, '-');
    }
    if (typeof value === 'number' && (field.toLowerCase().includes('date') || String(value).length === 13)) {
      // Likely a timestamp
      const d = new Date(value);
      if (!isNaN(d)) return d.toLocaleDateString('en-GB').replace(/\//g, '-');
    }
    return value;
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      bgcolor: 'linear-gradient(135deg, #1A1024 0%, #9A02E2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: { xs: 1, sm: 2, md: 4 },
    }}>
      <Paper elevation={8} sx={{
        width: '100%',
        maxWidth: 540,
        minHeight: { xs: '90vh', md: 600 },
        p: { xs: 2, sm: 4 },
        borderRadius: 5,
        boxShadow: '0 8px 32px #9A02E244',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'rgba(18,18,18,0.98)',
      }}>
        <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
          <IconButton onClick={onClose} size="large" aria-label="Back" sx={{ color: '#9A02E2' }}>
            <ArrowBackIcon fontSize="inherit" />
          </IconButton>
        </Box>
        <Avatar sx={{ width: 96, height: 96, margin: '0 auto 18px', bgcolor: '#9A02E2', fontSize: 40, fontWeight: 700, boxShadow: '0 2px 12px #9A02E244' }}>
          {userData?.name?.[0]?.toUpperCase() || user?.phoneNumber?.[0] || '?'}
        </Avatar>
        <Typography sx={{ textAlign: 'center', fontWeight: 900, fontSize: 28, color: '#fff', letterSpacing: 1, mb: 0.5, mt: 1 }}>
          {userData?.name || ''}
        </Typography>
        <Typography sx={{ color: '#A400F1', fontWeight: 600, fontSize: 17, mb: 2 }}>{userData?.headline || ''}</Typography>
        <Box sx={{ width: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: 3, p: 2.5, mb: 3, boxShadow: '0 2px 12px #9A02E211' }}>
          <Typography variant="subtitle2" sx={{ color: '#A400F1', fontWeight: 800, mb: 2, textAlign: 'left', letterSpacing: 1, fontSize: 16 }}>Contact Info</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontWeight: 700, color: '#fff', minWidth: 90, textAlign: 'right', pr: 2 }}>Mobile:</Typography>
            <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: 16, textAlign: 'left', flex: 1 }}>{phoneValue}</Typography>
          </Box>
          {userFields.includes('email') && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontWeight: 700, color: '#fff', minWidth: 90, textAlign: 'right', pr: 2 }}>Email:</Typography>
              {!editMode ? (
                <Typography sx={{ color: '#fff', fontWeight: 500, textAlign: 'left', flex: 1 }}>{userData.email || ''}</Typography>
              ) : (
                <TextField
                  name="email"
                  value={form.email || ''}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  sx={{ input: { color: '#fff' }, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}
                />
              )}
            </Box>
          )}
        </Box>
        <Box sx={{ width: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: 3, p: 2.5, mb: 3, boxShadow: '0 2px 12px #9A02E211' }}>
          <Typography variant="subtitle2" sx={{ color: '#A400F1', fontWeight: 800, mb: 2, textAlign: 'left', letterSpacing: 1, fontSize: 16 }}>Profile Details</Typography>
          {userFields.filter(f => f !== 'email' && f !== 'phone' && f.toLowerCase() !== 'about').length === 0 && <div style={{ color: '#aaa', fontStyle: 'italic' }}>No profile data</div>}
          {userFields.filter(f => f !== 'email' && f !== 'phone' && f.toLowerCase() !== 'about').map(field => (
            <Box key={field} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, gap: 2, width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 120, justifyContent: 'flex-start', height: 44 }}>
                <Typography sx={{ fontWeight: 700, color: '#fff', textAlign: 'left', textTransform: 'capitalize', fontSize: 15, letterSpacing: 0.2 }}>
                  {field.replace(/([A-Z])/g, ' $1')}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', height: 'auto' }}>
                {!editMode ? (
                  <Box sx={{ background: 'rgba(154,2,226,0.10)', color: '#fff', borderRadius: 2, px: 2, py: 1, fontWeight: 600, fontSize: 15, textAlign: 'left', border: '1.5px solid #A400F1', minHeight: 44, minWidth: 300, maxWidth: 400, width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', wordBreak: 'break-word', whiteSpace: 'pre-line', overflowWrap: 'break-word' }}>
                    {formatValue(field, userData[field])}
                  </Box>
                ) : (
                  <TextField
                    name={field}
                    value={form[field] === undefined || form[field] === null ? '' : form[field]}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    multiline
                    minRows={1}
                    sx={{ input: { color: '#fff' }, textarea: { color: '#fff' }, background: 'rgba(255,255,255,0.08)', borderRadius: 2, minWidth: 300, maxWidth: 400, width: '100%' }}
                  />
                )}
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          {editMode ? (
            <>
              <Button onClick={handleCancel} disabled={saving} sx={{ fontWeight: 700, color: '#fff', borderColor: '#fff' }}>Cancel</Button>
              <Button onClick={handleSave} variant="contained" color="primary" disabled={saving} sx={{ fontWeight: 700, background: 'linear-gradient(90deg, #9A02E2 0%, #A400F1 100%)' }}>{saving ? 'Saving...' : 'Save'}</Button>
            </>
          ) : (
            <>
              <Button onClick={onLogout} sx={{ fontWeight: 700, color: '#fff' }}>Logout</Button>
              <Button onClick={handleEdit} variant="contained" color="primary" sx={{ fontWeight: 700, background: 'linear-gradient(90deg, #A400F1 0%, #9A02E2 100%)' }}>Edit</Button>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

export default UserProfile;
