import { User } from '../types/auth';

// Backend API Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

class AuthService {
    private user: User | null = null;
    private tokens: AuthTokens | null = null;
    private listeners: ((user: User | null) => void)[] = [];

    constructor() {
        this.loadUserFromStorage();
        this.setupTokenRefresh();
    }

    loginWithGoogleRedirect(): void {
        // Store current location to redirect back after login
        localStorage.setItem('preAuthUrl', window.location.pathname);
        window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
    }

    handleDirectOAuthResponse(authResponse: AuthTokens): void {
        this.setTokens(authResponse);
        this.fetchUserProfile().catch(() => {
            this.extractUserFromToken();
        });
    }

    // Set tokens and store in localStorage
    private setTokens(authData: AuthTokens): void {
        this.tokens = {
            accessToken: authData.accessToken,
            refreshToken: authData.refreshToken,
        };
        localStorage.setItem('tokens', JSON.stringify(this.tokens));
    }

    // Refresh access token using refresh token
    async refreshAccessToken(): Promise<void> {
        if (!this.tokens?.refreshToken) {
            throw new Error('No refresh token available');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/auth/refreshToken`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.user?.email,
                    token: this.tokens.refreshToken
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to refresh token');
            }

            const newTokens: AuthTokens = await response.json();
            this.setTokens(newTokens);
        } catch (error) {
            alert('logout automatic' + error)
            console.error('Token refresh error:', error);
            this.logout(); // Force logout if refresh fails
            throw error;
        }
    }

    // Setup automatic token refresh
    private setupTokenRefresh(): void {
        // Check token expiry every 5 minutes
        setInterval(() => {
            if (this.tokens?.accessToken && this.isTokenExpiringSoon()) {
                this.refreshAccessToken().catch(console.error);
            }
        }, 5 * 60 * 1000);
    }

    // Fetch user profile from backend using access token
    async fetchUserProfile(): Promise<void> {
        if (!this.tokens?.accessToken) {
            throw new Error('No access token available');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${this.tokens.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    alert('here 401')
                    await this.refreshAccessToken();
                    return this.fetchUserProfile(); // Retry with new token
                }
                throw new Error('Failed to fetch user profile');
            }

            const user: User = await response.json();
            this.setUser(user);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            // If we can't get user profile, try to extract from token
            this.extractUserFromToken();
        }
    }

    // Extract user info from JWT token (fallback if no profile endpoint)
    private extractUserFromToken(): void {
        if (!this.tokens?.accessToken) return;

        try {
            const payload = JSON.parse(atob(this.tokens.accessToken.split('.')[1]));

            const user: User = {
                id: payload.userId || '',
                email: payload.sub || '',
                name: payload.sub,
                picture: '',
                provider: 'UNKNOWN',
            };

            this.setUser(user);
        } catch (error) {
            console.error('Failed to extract user from token:', error);
        }
    }

    // Set user and notify listeners
    private setUser(user: User | null): void {
        this.user = user;
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
        this.notifyListeners();
    }

    // Check if token is expiring soon (within 5 minutes)
    private isTokenExpiringSoon(): boolean {
        if (!this.tokens?.accessToken) return false;

        try {
            // Decode JWT to check expiry
            const payload = JSON.parse(atob(this.tokens.accessToken.split('.')[1]));
            const expiryTime = payload.exp * 1000;
            const currentTime = Date.now();
            const fiveMinutes = 5 * 60 * 1000;

            return (expiryTime - currentTime) < fiveMinutes;
        } catch {
            return true; // Assume expiring if can't decode
        }
    }

    // Load user and tokens from localStorage
    private loadUserFromStorage(): void {
        try {
            // Load tokens
            const storedTokens = localStorage.getItem('tokens');
            if (storedTokens) {
                this.tokens = JSON.parse(storedTokens);
            }

            // Load user
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                this.user = JSON.parse(storedUser);
                this.notifyListeners();
            } else if (this.tokens?.accessToken) {
                // Also try to fetch fresh profile
                this.fetchUserProfile().catch(() => {
                    this.extractUserFromToken();
                });
            }
        } catch (error) {
            console.error('Error loading from storage:', error);
            this.clearStorage();
        }
    }

    // Clear all stored data
    private clearStorage(): void {
        localStorage.removeItem('user');
        localStorage.removeItem('tokens');
        localStorage.removeItem('preAuthUrl');
    }

    // Get current user
    getUser(): User | null {
        return this.user;
    }

    // Get access token for API calls
    getAccessToken(): string | null {
        return this.tokens?.accessToken || null;
    }

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return this.user !== null && this.tokens?.accessToken !== null;
    }

    // Logout
    logout(): void {
        // Call backend logout endpoint if available
        // if (this.tokens?.accessToken) {
        //     fetch(`${API_BASE_URL}/api/auth/logout`, {
        //         method: 'POST',
        //         headers: {
        //             'Authorization': `Bearer ${this.tokens.accessToken}`,
        //         },
        //     }).catch(console.error);
        // }

        this.setUser(null);
        this.tokens = null;
        this.clearStorage();
    }

    // Make authenticated API request
    async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
        if (!this.tokens?.accessToken) {
            throw new Error('No access token available');
        }

        const authOptions = {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${this.tokens.accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        let response = await fetch(`${API_BASE_URL}${url}`, authOptions);

        // If unauthorized, try to refresh token and retry
        if (response.status === 401) {
            try {
                await this.refreshAccessToken();
                authOptions.headers = {
                    ...authOptions.headers,
                    'Authorization': `Bearer ${this.tokens.accessToken}`,
                };
                response = await fetch(`${API_BASE_URL}${url}`, authOptions);
            } catch (error) {
                this.logout();
                throw error;
            }
        }

        return response;
    }

    // Subscribe to auth state changes
    subscribe(listener: (user: User | null) => void): () => void {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    // Notify all listeners
    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.user));
    }
}

// Create singleton instance
export const authService = new AuthService();