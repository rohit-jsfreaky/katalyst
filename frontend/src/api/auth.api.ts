import { apiClient, API_BASE_URL } from "./http";

export type GoogleUser = {
  id: string;
  email?: string;
  name?: string;
  picture?: string;
  googleId?: string;
};

type RawCurrentUserResponse = {
  success: boolean;
  message?: string;
  data: GoogleUser | null;
};

export const getCurrentUser = async (): Promise<RawCurrentUserResponse> => {
  try {
    const res = await apiClient.get<RawCurrentUserResponse>("/api/auth/me");
    return res.data;
  } catch (error: any) {
    if (error?.response?.data) {
      return error.response.data as RawCurrentUserResponse;
    }

    return {
      success: false,
      message: "Unable to fetch current user",
      data: null,
    };
  }
};

export const logout = async (): Promise<void> => {
  await apiClient.post("/api/auth/logout");
};

export const redirectToGoogleLogin = (): void => {
  window.location.href = `${API_BASE_URL}/api/auth/google`;
};