import { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';

type ResponseTypPlaning<T> = {
  code: number;
  message: string;
  data: T;
};

type RequestConfigType = AxiosRequestConfig;
type ResponseType<T = unknown> = AxiosResponse<T> & ResponseTypPlaning<T>;
type ErrorType = AxiosError;

export type { RequestConfigType, ResponseType, ErrorType };
