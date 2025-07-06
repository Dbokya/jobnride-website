import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';

const withAuthProtection = (WrappedComponent) => {
  return function AuthProtectedComponent(props) {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
            
            if (!firebaseUser) {
              navigate('/login')
            } 
          });
        return () => unsubscribe();
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuthProtection;
