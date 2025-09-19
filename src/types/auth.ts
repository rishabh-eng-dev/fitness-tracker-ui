export interface User {
    id: string;
    email: string;
    name: string;
    picture?: string;
    provider?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface AuthContextType extends AuthState {
    loginOAuth: (type: string) => Promise<void>;
    loginEmailPassword: (email: string, password: string) => Promise<void>;
    logout: () => void;
    clearError: () => void;
    makeAuthenticatedRequest: (url: string, options?: RequestInit) => Promise<Response>;
    getAccessToken: () => string | null;
}
