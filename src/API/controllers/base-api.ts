import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  Method,
} from "axios";
import { SESSION_STORAGE_KEYS } from "@/constants/storage-keys";
import { LoginResponse } from "./auth-api";

export default class BaseApi {
  private readonly api_url: string;

  constructor(apiUrl?: string) {
    this.api_url =
      apiUrl || process.env?.REACT_APP_API_URL || "http://localhost";
  }

  protected initialize(
    headers: AxiosRequestConfig,
    apiUrl?: string
  ): AxiosInstance {
    const timeout = process.env?.REACT_APP_API_TIMEOUT;
    const client = axios.create({
      baseURL: apiUrl || this.api_url,
      timeout: (timeout && +timeout) || 10000,
      //@ts-ignore
      headers,
    });

    return client;
  }

  protected init(url?: string): AxiosInstance {
    const data: LoginResponse = JSON.parse(
      sessionStorage.getItem(SESSION_STORAGE_KEYS.token) || "null"
    );

    const headers: any = {
      Accept: "application/json",
    };
    if (data) {
      const accessToken = data.access_token;
      headers.Authorization = `Bearer ${accessToken}`;
    }

    return this.initialize(headers, url);
  }

  protected handleError(err: any | AxiosError, msg?: string) {
    msg = msg ? `${msg}\r\n` : "";

    if (err.response) {
      const { data } = err.response;
      const detail =
        data?.detail || data?.error_description || "Erreur inconnue";
      return new Error(`${msg}${detail}`, err);
    }

    return new Error(`${msg}${err.message}`, err);
  }

  public async request(method: Method, headers, data, callback) {
    const h = headers || {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    };
    try {
      const client = this.initialize(h);
      const response = await client.request({
        url: "",
        method,
        data,
      });
      if (callback) {
        return callback(response.status, response.data);
      }
      return response;
    } catch (err) {
      throw this.handleError(err);
    }
  }
}
