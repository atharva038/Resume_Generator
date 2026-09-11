import {createContext, useContext, useState, useEffect} from "react";
import {authAPI} from "@/api/api";
import {authStorage} from "@/utils/storage";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(() => {
    try {
      return authStorage.getUser();
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const checkAuth = async () => {
    const token = authStorage.getToken();
    if (token) {
      try {
        const response = await authAPI.getCurrentUser();
        setUser(response.data.user);
        authStorage.setUser(response.data.user);
      } catch (error) {
        console.error("Auth check failed:", error);
        const cachedUser = authStorage.getUser();
        if (import.meta.env.DEV && cachedUser) {
          setUser(cachedUser);
        } else {
          authStorage.clearAuth();
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({email, password});
      authStorage.setToken(response.data.token);
      authStorage.setUser(response.data.user);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      if (
        import.meta.env.DEV &&
        (!error.response ||
          error.code === "ERR_NETWORK" ||
          error.message?.includes("Network Error"))
      ) {
        console.warn("Dev mode offline auth fallback active");
        const mockUser = {
          _id: "dev_offline_user_1",
          name: email.split("@")[0] || "Dev User",
          email,
          subscription: { tier: "pro", status: "active" },
        };
        authStorage.setToken("dev_offline_token");
        authStorage.setUser(mockUser);
        setUser(mockUser);
        return { user: mockUser, token: "dev_offline_token" };
      }
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await authAPI.register({name, email, password});
      authStorage.setToken(response.data.token);
      authStorage.setUser(response.data.user);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      if (
        import.meta.env.DEV &&
        (!error.response ||
          error.code === "ERR_NETWORK" ||
          error.message?.includes("Network Error"))
      ) {
        console.warn("Dev mode offline auth fallback active");
        const mockUser = {
          _id: "dev_offline_user_1",
          name,
          email,
          subscription: { tier: "pro", status: "active" },
        };
        authStorage.setToken("dev_offline_token");
        authStorage.setUser(mockUser);
        setUser(mockUser);
        return { user: mockUser, token: "dev_offline_token" };
      }
      throw error;
    }
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
