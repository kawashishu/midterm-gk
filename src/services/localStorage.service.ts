import { UserModel } from '@app/domain/UserModel';

interface Tokens {
  access: {
    token: string;
    expires: string;
  };
  refresh: {
    token: string;
    expires: string;
  };
}

export interface Token {
  token: string;
  expires: string;
}
export const persistToken = (tokens: Tokens): void => {
  localStorage.setItem('accessToken', JSON.stringify(tokens.access));
  localStorage.setItem('refreshToken', JSON.stringify(tokens.refresh));
};

export const readToken = (): string => {
  const token = localStorage.getItem('accessToken');
  return token ? JSON.parse(token).token : '';
};

export const getToken = (): Token | null => {
  return localStorage.getItem('accessToken') ? JSON.parse(localStorage.getItem('accessToken') as string) : null;
};

export const readRefreshToken = (): string | undefined => {
  const token = localStorage.getItem('refreshToken');
  return token ? JSON.parse(token).token : undefined;
};

export const persistUser = (user: UserModel): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const readUser = (): UserModel | null => {
  const userStr = localStorage.getItem('user');

  return userStr ? JSON.parse(userStr) : null;
};

export const deleteToken = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};
export const deleteUser = (): void => localStorage.removeItem('user');
