import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChange, 
  signInUser, 
  signOutUser, 
  checkAdminStatus,
  isFirebaseConfigured 
} from '../firebase/config';

const AuthContext = createContext({
  user: null,
  isAdmin: false,
  loading: true,
  login: async () => {},
  logout: async () => {},
  loginDemoAdmin: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Check if logged in via demo session in preview mode
      const savedDemo = sessionStorage.getItem('school_demo_admin');
      if (savedDemo) {
        try {
          const parsed = JSON.parse(savedDemo);
          setUser(parsed);
          setIsAdmin(true);
        } catch {
          // ignore parse error
        }
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChange(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const adminFlag = await checkAdminStatus(currentUser);
          setIsAdmin(adminFlag);
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginDemoAdmin = (customEmail = 'admin@greenwood.edu') => {
    const demoUser = {
      uid: 'demo-admin-local-uid',
      email: customEmail,
      displayName: 'Administrator (Demo)',
    };
    setUser(demoUser);
    setIsAdmin(true);
    sessionStorage.setItem('school_demo_admin', JSON.stringify(demoUser));
    return { user: demoUser };
  };

  const login = async (email, password) => {
    if (!isFirebaseConfigured) {
      // Allow seamless login in demo mode
      return loginDemoAdmin(email);
    }

    const cred = await signInUser(email, password);
    const adminFlag = await checkAdminStatus(cred.user);
    setIsAdmin(adminFlag);
    return cred;
  };

  const logout = async () => {
    sessionStorage.removeItem('school_demo_admin');
    if (isFirebaseConfigured) {
      await signOutUser();
    }
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, logout, loginDemoAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
