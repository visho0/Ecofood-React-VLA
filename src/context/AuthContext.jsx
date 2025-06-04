import { createContext, useContext } from "react";
import Login from "../pages/Login";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);



export const AuthProvider = ({ children }) => {
  const value = {
    
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};