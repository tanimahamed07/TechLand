import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

// Register new user account
export const register = async (
  data: RegisterPayload,
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = (await response.json()) as AuthResponse;

    if (!response.ok) {
      throw new Error(result.message || "Registration failed");
    }

    return result;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Login with email and password
export const login = async (data: LoginPayload): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = (await response.json()) as AuthResponse;

    if (!response.ok) {
      throw new Error(result.message || "Login failed");
    }

    return result;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
