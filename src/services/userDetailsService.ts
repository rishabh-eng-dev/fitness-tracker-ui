import { authService } from "./authService";

export const userDetailsService = {
    async createUserDetails(formData: any): Promise<any> {
        try {
            const response = await authService.makeAuthenticatedRequest(`/api/v1/fitness/profile`, {
                method: "POST",
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                const error = new Error(`HTTP ${response.status}`);
                (error as any).status = response.status;
                throw error;
            }

            return await response.json();
        } catch (error) {
            console.error("Error saving user details:", error);
            throw error;
        }
    },
    async updateUserDetails(formData: any): Promise<any> {
        try {
            const response = await authService.makeAuthenticatedRequest(`/api/v1/fitness/profile`, {
                method: "PATCH",
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                const error = new Error(`HTTP ${response.status}`);
                (error as any).status = response.status;
                throw error;
            }

            return await response.json();
        } catch (error) {
            console.error("Error updating user details:", error);
            throw error;
        }
    },

    async getUserDetails(): Promise<any> {
        try {
            const response = await authService.makeAuthenticatedRequest(`/api/v1/fitness/profile`, {
                method: "GET",
            })

            if (!response.ok) {
                const error = new Error(`HTTP ${response.status}`);
                (error as any).status = response.status;
                throw error;
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },
};
