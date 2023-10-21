import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import {
  loginRequest,
  registerRequest,
  verifyTokenRequest,
} from "../controllers/Auth";

interface AuthProviderProps {
  children: ReactNode; // `children` must be ReactNode type
}

const AuthContext = createContext<{
  user: any;
  signup: (user: any) => void;
  signin: (user: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
  errors: string[];
  loading: boolean;
} | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  const registerErrors = context.errors || [];
  return { ...context, registerErrors };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const cookies = Cookies.get();
      if (!cookies?.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const res = await verifyTokenRequest();
        if (!res.data) return setIsAuthenticated(false);
        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  const signup = async (user: any) => {
    try {
      const res = await registerRequest(user);
      if (res.status === 200) {
        setUser(res.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      if (
        (error as { response: { data: { message: string } } }).response &&
        (error as { response: { data: { message: string } } }).response.data &&
        (error as { response: { data: { message: string } } }).response.data
          .message
      ) {
        setErrors([
          (error as { response: { data: { message: string } } }).response.data
            .message,
        ]);
      } else {
        setErrors([
          "An error occurred during signup. Please try again with another email account.",
        ]);
      }
    }
  };

  const signin = async (user: any) => {
    try {
      const res = await loginRequest(user);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        signin,
        logout,
        isAuthenticated,
        errors,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
