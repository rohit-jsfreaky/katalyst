import { apiClient, API_BASE_URL } from "./http";
import {
  clearAuthToken,
  readAuthToken,
  storeAuthToken,
} from "../utils/token.util";

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
  const token = readAuthToken();
  if (!token) {
    return {
      success: false,
      message: "Not authenticated",
      data: null,
    };
  }

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
  try {
    await apiClient.post("/api/auth/logout");
  } catch (error) {
    // ignore network issues on logout for stateless flow
  } finally {
    clearAuthToken();
  }
};

export const redirectToGoogleLogin = (): void => {
  window.location.href = `${API_BASE_URL}/api/auth/google`;
};

export const persistAuthToken = (token: string) => {
  storeAuthToken(token);
};