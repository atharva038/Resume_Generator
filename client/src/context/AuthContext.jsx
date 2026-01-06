import {createContext, useContext, useState, useEffect} from "react";
import {authAPI} from "@/api/api";
import {authStorage} from "@/utils/storage";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = authStorage.getToken();
    if (token) {
      try {
        const response = await authAPI.getCurrentUser();
        setUser(response.data.user);
        authStorage.setUser(response.data.user);
      } catch (error) {
        console.error("Auth check failed:", error);
        authStorage.clearAuth();
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login({email, password});
    authStorage.setToken(response.data.token);
    authStorage.setUser(response.data.user);
    setUser(response.data.user);
    return response.data;
  };

  const register = async (name, email, password) => {
    const response = await authAPI.register({name, email, password});
    authStorage.setToken(response.data.token);
    authStorage.setUser(response.data.user);
    setUser(response.data.user);
    return response.data;
  };

  const logout = () => {
    authStorage.clearAuth();
    setUser(null);
  };

  // Set user directly (for OAuth callbacks)
  const setUserData = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{user, login, register, logout, loading, setUserData}}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
