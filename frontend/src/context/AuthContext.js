import React, { createContext, useReducer, useEffect, useState } from 'react';

// Create the context
export const AuthContext = createContext();

// Reducer function for handling authentication actions
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload.user, token: action.payload.token };
    case 'LOGOUT':
      return { user: null, token: null };
    default:
      return state;
  }
};

// AuthContextProvider component
const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null, token: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the token from localStorage
    const token = localStorage.getItem('token');
    
    setLoading(false);
  }, []);

  if (loading) {
    return null; // Show nothing or a loading spinner while verifying user
  }

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
