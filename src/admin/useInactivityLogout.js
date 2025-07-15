import { useEffect } from 'react';
import { auth } from '../firebase';

const useInactivityLogout = (timeout = 30 * 60 * 1000) => { // 30 mins

  useEffect(() => {

    const handleActivity = () => {
      clearTimeout(window.logoutTimer);
      window.logoutTimer = setTimeout(() => {
        auth.signOut().then(() => {
          window.location.href = '/admin/login';
        });
      }, timeout);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']

    events.forEach((event)=> {
        window.addEventListener(event, handleActivity);
    });
    handleActivity();



    return () => {
      events.forEach((event)=> {
        window.removeEventListener(event, handleActivity);
    }); 
    };
  }, [timeout]);
};

export default useInactivityLogout;
