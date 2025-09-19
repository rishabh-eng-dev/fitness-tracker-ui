import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, AuthState, User } from "../types/auth";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize auth state
    const user = authService.getUser();
    setAuthState({
      user,
      isAuthenticated: authService.isAuthenticated(),
      isLoading: false,
      error: null,
    });

    // Subscribe to auth state changes
    const unsubscribe = authService.subscribe((user: User | null) => {
      setAuthState((prevState) => ({
        ...prevState,
        user,
        isAuthenticated: user !== null,
        isLoading: false,
        error: null,
      }));
    });

    return unsubscribe;
  }, []);

  // Login - now redirects to backend (synchronous)
  const loginOAuth = async (type: string): Promise<void> => {
    try {
      setAuthState((prevState) => ({
        ...prevState,
        isLoading: true,
        error: null,
      }));

      // This will redirect to backend OAuth endpoint
      authService.loginWithGoogleRedirect(type);
      // Note: This function will redirect, so code after this won't execute
    } catch (error) {
      setAuthState((prevState) => ({
        ...prevState,
        isLoading: false,
        error: error instanceof Error ? error.message : "Login failed",
      }));
    }
  };

  const logout = (): void => {
    authService.logout();
    // Redirect to login page after logout
    navigate("/login");
  };

  const clearError = (): void => {
    setAuthState((prevState) => ({ ...prevState, error: null }));
  };

  // Helper method to make authenticated API calls
  const makeAuthenticatedRequest = async (
    url: string,
    options?: RequestInit
  ): Promise<Response> => {
    return authService.makeAuthenticatedRequest(url, options);
  };

  // Get access token for manual API calls
  const getAccessToken = (): string | null => {
    return authService.getAccessToken();
  };

  const loginEmailPassword = async (
    email: string,
    password: string
  ): Promise<void> => {
    await authService.loginEmailPassword(email, password);
    navigate("/dashboard");
  };

  const value: AuthContextType = {
    ...authState,
    loginOAuth,
    loginEmailPassword,
    logout,
    clearError,
    makeAuthenticatedRequest,
    getAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
