import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { TokenService } from "./token-service";
import { BASE_URL } from "./base-urls";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = TokenService.getCookie();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      TokenService.removeCookie();
    }

    return Promise.reject(error);
  },
);

export const crudRequest = {
  GET: <R>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<R>> =>
    axiosInstance.get<R>(url, config),
  POST: <T, R>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<R>> => axiosInstance.post<R>(url, data, config),
  PATCH: <T, R>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<R>> => axiosInstance.patch<R>(url, data, config),
  PUT: <T, R>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<R>> => axiosInstance.put<R>(url, data, config),
  DELETE: <R>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<R>> =>
    axiosInstance.delete<R>(url, config),
};
