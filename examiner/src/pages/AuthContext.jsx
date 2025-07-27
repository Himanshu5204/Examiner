import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:8000/api/auth/getUser', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(async (res) => {
          if (res.status === 401 || res.status === 403) {
            setUser(null);
            localStorage.removeItem('token');
            return;
          }
          const data = await res.json();
          if (data && (data.user || data._id)) {
            const userData = data.user || data;
            setUser({ ...userData, token });
          } else {
            setUser(null);
            localStorage.removeItem('token');
          }
        })
        .catch(() => {
          // Do not log out on network/server error, just keep user as is
        });
    }
  }, []);

  // login now only accepts token, fetches user info
  const login = async (token) => {
    localStorage.setItem('token', token);
    try {
      const res = await fetch('http://localhost:8000/api/auth/getUser', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.status === 401 || res.status === 403) {
        setUser(null);
        localStorage.removeItem('token');
        return false;
      }
      const data = await res.json();
      if (data && data.user) {
        setUser({ ...data.user, token });
        return true;
      } else {
        setUser(null);
        localStorage.removeItem('token');
        return false;
      }
    } catch {
      // Do not log out on network/server error, just keep user as is
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
