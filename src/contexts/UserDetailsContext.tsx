import React, { createContext, useState, useContext, useEffect } from "react";
import { userDetailsService } from "../services/userDetailsService";

export interface UserDetails {
  personalDetails: {
    weight: number;
    height: number;
    dateOfBirth: string;
  };
  goals: {
    targetWeight?: number;
    weeklyWorkoutFrequency?: number;
  };
  preferences: {
    units: {
      weight: string;
      distance: string;
      length: string;
    };
  };
}

interface UserDetailsContextProps {
  userDetails: UserDetails | null;
  setUserDetails: (details: UserDetails) => void;
  loading: boolean;
  error: string | null;
}

const UserDetailsContext = createContext<UserDetailsContextProps | undefined>(
  undefined
);

export const UserDetailsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await userDetailsService.getUserDetails();

        if (!cancelled) {
          setUserDetails(data);
        }
      } catch (err) {
        if (!cancelled) {
          // Check if it's a 404 (user details not found) vs actual error
          if (
            err &&
            typeof err === "object" &&
            "status" in err &&
            err.status === 404
          ) {
            // User details don't exist yet - this is okay
            setError(null);
            setUserDetails(null);
          } else {
            // Actual error occurred
            setError(
              err instanceof Error
                ? err.message
                : "Failed to fetch user details"
            );
            setUserDetails(null);
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchUserDetails();

    // Cleanup function
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <UserDetailsContext.Provider
      value={{
        userDetails,
        setUserDetails,
        loading,
        error,
      }}
    >
      {children}
    </UserDetailsContext.Provider>
  );
};

export const useUserDetails = () => {
  const context = useContext(UserDetailsContext);
  if (!context) {
    throw new Error("useUserDetails must be used within a UserDetailsProvider");
  }
  return context;
};
