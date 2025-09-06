import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth as useAuthContext } from "./useAuthContext";
import apiClient from "../utils/api";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "../types";

// Auth API functions
const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  },

  getProfile: async (): Promise<{
    success: boolean;
    message: string;
    data: User;
  }> => {
    const response = await apiClient.get("/auth/profile");
    return response.data;
  },
};

// Custom hooks
export const useLogin = () => {
  const { login } = useAuthContext();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data.success) {
        login(data.data.token, data.data.user);
      }
    },
  });
};

export const useRegister = () => {
  const { login } = useAuthContext();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      if (data.success) {
        login(data.data.token, data.data.user);
      }
    },
  });
};

export const useProfile = () => {
  const { isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey: ["profile"],
    queryFn: authApi.getProfile,
    enabled: isAuthenticated,
    select: (data) => data.data,
  });
};

export { useAuthContext as useAuth };
