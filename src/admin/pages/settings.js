import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

export default function Settings({ user }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setLoading(false);
    }
  }, [user]);

  const save = async () => {
    if (!auth.currentUser) return alert("User not logged in");

    await updateProfile(auth.currentUser, { displayName: name });
    await updateDoc(doc(db, 'users', user.uid), { name });
    alert('Profile updated');
  };

  if (loading) return <p>Loading user...</p>;

  return (
    <div>
      <h2>Settings</h2>
      <label>
        Display Name:
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <button onClick={save}>Save</button>
    </div>
  );
}
