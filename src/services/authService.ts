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

    async init(): Promise<void> {
        await this.loadUserFromStorage();
        this.setupTokenRefresh();
    }

    loginWithGoogleRedirect(): void {
        // Store current location to redirect back after login
        localStorage.setItem('preAuthUrl', window.location.pathname);
        window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
    }

    handleDirectOAuthResponse(authResponse: AuthTokens): void {
        this.setTokens(authResponse);
        this.extractUserFromToken();
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

        if (!this.tokens?.accessToken) {
            throw new Error('No access token available');
        }

        this.extractUserFromToken();

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


    // Extract user info from JWT token (fallback if no profile endpoint)
    private extractUserFromToken(): void {
        if (!this.tokens?.accessToken) throw new Error('No access token available');

        try {
            const payload = JSON.parse(atob(this.tokens.accessToken.split('.')[1]));

            const user: User = {
                id: payload.userId,
                email: payload.sub,
                name: payload.name,
                picture: payload.picture,
                provider: payload.provider,
            };

            this.setUser(user);
        } catch (error) {
            throw new Error('Error while getting user.')
        }
    }

    // Set user and notify listeners
    private setUser(user: User | null): void {
        this.user = user;
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
    private async loadUserFromStorage(): Promise<void> {
        try {
            // Load tokens
            const storedTokens = localStorage.getItem('tokens');
            if (storedTokens) {
                this.tokens = JSON.parse(storedTokens);
            }

            this.extractUserFromToken();

            if (this.user != null && this.tokens?.refreshToken) {
                // Also try to fetch fresh profile
                await this.refreshAccessToken();
                this.extractUserFromToken()
            }
        } catch (error) {
            //console.error('Error loading from storage:', error);
            this.clearStorage();
        }
    }

    // Clear all stored data
    private clearStorage(): void {
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

authService.init().catch((error) => {
    console.error('Error initializing AuthService:', error);
});