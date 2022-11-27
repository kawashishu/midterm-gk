import axios from 'axios';
import { AxiosError } from 'axios';
import { ApiError } from '@app/api/ApiError';
import {
  deleteToken,
  deleteUser,
  getToken,
  persistToken,
  readRefreshToken,
  readToken,
} from '@app/services/localStorage.service';

export const httpApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

httpApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    const expires = new Date(token.expires);
    const now = new Date();
    console.log(expires, now, expires < now);
    if (expires < now) {
      const refreshToken = readRefreshToken();
      if (refreshToken) {
        return axios
          .post(`${process.env.REACT_APP_API_URL}/auth/refresh-tokens`, { refreshToken })
          .then((response) => {
            persistToken(response.data);
            config.headers = { ...config.headers, Authorization: `Bearer ${readToken()}` };
            return config;
          })
          .catch((error) => {
            deleteToken();
            deleteUser();
            window.location.href = '/auth/login';
            return Promise.reject(error);
          });
      }
    } else {
      config.headers = { ...config.headers, Authorization: `Bearer ${readToken()}` };
    }
  } else {
    config.headers = { ...config.headers, Authorization: `Bearer ${readToken()}` };
  }

  return config;
});

httpApi.interceptors.response.use(undefined, (error: AxiosError) => {
  throw new ApiError<ApiErrorData>(error.response?.data.message || error.message, error.response?.data);
});

export interface ApiErrorData {
  message: string;
}
