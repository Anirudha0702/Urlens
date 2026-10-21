import { apiRequest, setAuthToken } from "../../lib/api-client";
import type {
  AuthSession,
  CompleteSignupPayload,
  RequestOtpPayload,
  RequestOtpResponse,
  SigninPayload,
  User,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from "./types";

export function requestSignupOtp(payload: RequestOtpPayload) {
  return apiRequest<RequestOtpResponse>("/auth/signup/request-otp", {
    method: "POST",
    body: payload,
  });
}

export function verifySignupOtp(payload: VerifyOtpPayload) {
  return apiRequest<VerifyOtpResponse>("/auth/signup/verify-otp", {
    method: "POST",
    body: payload,
  });
}

export async function completeSignup(
  payload: CompleteSignupPayload,
): Promise<AuthSession> {
  const session = await apiRequest<AuthSession>("/auth/signup", {
    method: "POST",
    body: payload,
  });
  setAuthToken(session.access_token);
  return session;
}

export async function signin(payload: SigninPayload): Promise<AuthSession> {
  const session = await apiRequest<AuthSession>("/auth/signin", {
    method: "POST",
    body: payload,
  });
  setAuthToken(session.access_token);
  return session;
}

export function fetchCurrentUser() {
  return apiRequest<User>("/auth/me", { method: "GET" });
}

export function signout() {
  return apiRequest<{ message: string }>("/auth/signout", { method: "POST" });
}
