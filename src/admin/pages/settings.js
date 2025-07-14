import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

export default function Settings({ user }) {
  const [name, setName] = useState(user.displayName);

  const save = async () => {
    await updateProfile(auth.currentUser, { displayName: name });
    await updateDoc(doc(db, 'users', user.uid), { name });
    alert('Profile updated');
  };

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
