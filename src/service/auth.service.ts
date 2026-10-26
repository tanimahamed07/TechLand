import { API_URL } from "@/utils/api.utils";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth.types";

// Register new user account
export const register = async (
  data: RegisterPayload,
): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = (await response.json()) as AuthResponse;

  return result;
};

// Login with email and password
export const login = async (data: LoginPayload): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = (await response.json()) as AuthResponse;


  return result;
};
