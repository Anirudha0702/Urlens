export interface User {
  id: string;
  email: string;
  name: string;
  email_verified: boolean;
  created_at?: string;
}

export interface AuthSession {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RequestOtpPayload {
  email: string;
}

export interface RequestOtpResponse {
  message: string;
  expires_in: number;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  message: string;
  verification_token: string;
}

export interface CompleteSignupPayload {
  email: string;
  name: string;
  password: string;
  verification_token: string;
}

export interface SigninPayload {
  email: string;
  password: string;
}
