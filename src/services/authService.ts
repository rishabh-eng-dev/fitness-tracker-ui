import { User } from '../types/auth';

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

    // --- LOGIN METHODS ---
    loginWithGoogleRedirect(type: string): void {
        localStorage.setItem('preAuthUrl', window.location.pathname);
        window.location.href = `${API_BASE_URL}/oauth2/authorization/${type}`;
    }

    async loginEmailPassword(email: string, password: string): Promise<void> {
        if (!email) throw new Error('Email is required');
        if (!password) throw new Error('Password is required');

        const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) throw new Error('Login failed');

        const newTokens: AuthTokens = await response.json();
        await this.setTokens(newTokens);
        await this.extractUserFromToken(); // ✅ will notify listeners
    }

    async handleDirectOAuthResponse(authResponse: AuthTokens): Promise<void> {
        await this.setTokens(authResponse);
        await this.extractUserFromToken(); // ✅ will notify listeners
    }

    // --- TOKEN & USER METHODS ---
    private async setTokens(authData: AuthTokens): Promise<void> {
        this.tokens = authData;
        localStorage.setItem('tokens', JSON.stringify(this.tokens));
    }

    private async extractUserFromToken(): Promise<void> {
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
            this.logout(); // if token invalid
            throw new Error('Failed to extract user from token');
        }
    }

    private setUser(user: User | null): void {
        this.user = user;
        this.notifyListeners();
    }

    private notifyListeners(): void {
        this.listeners.forEach((listener) => listener(this.user));
    }

    async refreshAccessToken(): Promise<void> {
        if (!this.tokens?.refreshToken) throw new Error('No refresh token available');

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/auth/refreshToken`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: this.user?.email,
                    token: this.tokens.refreshToken,
                }),
            });

            if (!response.ok) throw new Error('Failed to refresh token');

            const newTokens: AuthTokens = await response.json();
            await this.setTokens(newTokens);
            await this.extractUserFromToken();
        } catch {
            this.logout(); // force logout on refresh failure
        }
    }

    private setupTokenRefresh(): void {
        setInterval(() => {
            if (this.tokens?.accessToken && this.isTokenExpiringSoon()) {
                this.refreshAccessToken().catch(console.error);
            }
        }, 5 * 60 * 1000);
    }

    private isTokenExpiringSoon(): boolean {
        if (!this.tokens?.accessToken) return false;

        try {
            const payload = JSON.parse(atob(this.tokens.accessToken.split('.')[1]));
            const expiryTime = payload.exp * 1000;
            return expiryTime - Date.now() < 5 * 60 * 1000;
        } catch {
            return true; // assume expiring if decoding fails
        }
    }

    private async loadUserFromStorage(): Promise<void> {
        try {
            const storedTokens = localStorage.getItem('tokens');
            if (storedTokens) {
                this.tokens = JSON.parse(storedTokens);
                await this.extractUserFromToken();

                if (this.tokens?.refreshToken && this.isTokenExpiringSoon()) {
                    await this.refreshAccessToken();
                }
            }
        } catch {
            this.clearStorage();
            this.user = null;
            this.notifyListeners();
        }
    }

    private clearStorage(): void {
        localStorage.removeItem('tokens');
        localStorage.removeItem('preAuthUrl');
    }

    // --- LOGOUT ---
    logout(): void {
        this.setUser(null); // ✅ notifies listeners
        this.tokens = null;
        this.clearStorage();
    }

    // --- UTILITY METHODS ---
    getUser(): User | null {
        return this.user;
    }

    getAccessToken(): string | null {
        return this.tokens?.accessToken || null;
    }

    isAuthenticated(): boolean {
        return this.user !== null && !!this.tokens?.accessToken;
    }

    async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
        if (!this.tokens?.accessToken) throw new Error('No access token available');

        const authOptions = {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${this.tokens.accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        let response = await fetch(`${API_BASE_URL}${url}`, authOptions);

        if (response.status === 401) {
            try {
                await this.refreshAccessToken();
                authOptions.headers = {
                    ...authOptions.headers,
                    Authorization: `Bearer ${this.tokens.accessToken}`,
                };
                response = await fetch(`${API_BASE_URL}${url}`, authOptions);
            } catch {
                this.logout();
                throw new Error('Unauthorized');
            }
        }

        return response;
    }

    subscribe(listener: (user: User | null) => void): () => void {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter((l) => l !== listener);
        };
    }
}

// Singleton instance
export const authService = new AuthService();

authService.init().catch((error) => console.error('AuthService init error:', error));
