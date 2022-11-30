import { httpApi } from '@app/api/http.api';
import { UserModel } from '@app/domain/UserModel';
import { readRefreshToken } from '@app/services/localStorage.service';

export interface AuthData {
  email: string;
  password: string;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface SecurityCodePayload {
  code: string;
}

export interface NewPasswordData {
  newPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  tokens: {
    access: {
      token: string;
      expires: string;
    };
    refresh: {
      token: string;
      expires: string;
    };
  };
  user: UserModel;
}

export interface LoginGoogleRequest {
  idToken: string;
}

export const login = (loginPayload: LoginRequest): Promise<LoginResponse> =>
  httpApi.post<LoginResponse>('auth/login', { ...loginPayload }).then(({ data }) => data);

export const googleLogin = (loginPayload: LoginGoogleRequest): Promise<LoginResponse> =>
  httpApi.post<LoginResponse>('auth/google', { ...loginPayload }).then(({ data }) => data);

export const signUp = (signUpData: SignUpRequest): Promise<undefined> =>
  httpApi.post<undefined>('auth/register', { ...signUpData }).then(({ data }) => data);

export const resetPassword = (resetPasswordPayload: ResetPasswordRequest): Promise<undefined> =>
  httpApi.post<undefined>('auth/forgot-password', { ...resetPasswordPayload }).then(({ data }) => data);

export const verifySecurityCode = (securityCodePayload: SecurityCodePayload): Promise<undefined> =>
  httpApi.post<undefined>('verifySecurityCode', { ...securityCodePayload }).then(({ data }) => data);

export const setNewPassword = (newPasswordData: NewPasswordData): Promise<undefined> =>
  httpApi.post<undefined>('auth/reset-password', { ...newPasswordData }).then(({ data }) => data);

export const verifyEmail = (token: string): Promise<undefined> =>
  httpApi.post<undefined>('auth/verify-email', { token }).then(({ data }) => data);

export const logout = (): Promise<undefined> =>
  httpApi
    .post<undefined>('auth/logout', {
      refreshToken: readRefreshToken(),
    })
    .then(({ data }) => data);
