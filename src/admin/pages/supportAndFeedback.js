import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function SupportAndFeedback() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'supportMessages'), snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  return (
    <div>
      <h2>Support & Feedback</h2>
      <ul>
        {messages.map(m => (
          <li key={m.id}>
            <strong>{m.email}</strong> &mdash; {m.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
