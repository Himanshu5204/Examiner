import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("Auto logging");
    console.log(token);

    if (token) {
      console.log("fetching");
      fetch('http://localhost:8000/api/auth/getUser', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(async (res) => {
          console.log(res.status);
          if (res.status === 401 || res.status === 403) {
            setUser(null);
            localStorage.removeItem('token');
            return;
          }
          const data = await res.json();
          console.log("Fetched user data:", data.user); 
          if (data && (data.user || data._id)) {
            const userData = data.user;
            setUser({ ...userData, token });
            console.log(user , "<<<<<");
          } else {
            console.log("data and user not found");
            setUser(null);
            localStorage.removeItem('token');
          }
        })
        .catch((error) => {
          // Do not log out on network/server error, just keep user as is
          console.error(error);
        });
    } else {
      console.log("Not found token");
    }
  }, []);

  // login now only accepts token, fetches user info
  const login = async (token, role) => {
    localStorage.setItem('token', token);

    console.log(token, role);

    try {

      const res = await fetch(`http://localhost:8000/api/auth/getUser?role=${role}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.status === 401 || res.status === 403) {
        console.log("Error:401 inGetUser");
        setUser(null);
        localStorage.removeItem('token');
        return false;
      }

      const data = await res.json();

      console.log("Success" + data);

      if (data && data.user) {
        setUser({ ...data.user, token });
        setUser({ ...data.user, role });
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
