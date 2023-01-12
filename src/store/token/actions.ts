import { TokenState } from "@/store/token/index";
import jwt_decode from "jwt-decode";
import { User } from "../../API/DataModels/Database/User";
import { SESSION_STORAGE_KEYS } from "../../constants/storage-keys";

export const getUserInfo = (tokenState: TokenState): User | undefined => {
  const data = getAccessToken(tokenState);
  if (data) {
    return jwt_decode(data);
  }
};

export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;

  const date: Date | null = getTokenExpirationDate(token);
  if (date === null) return false;

  return date.valueOf() < new Date().valueOf();
};

export const getTokenExpirationDate = (token: string): Date | null => {
  const decoded: { exp: number } = jwt_decode(token);
  if (decoded.exp === undefined) return null;

  const date = new Date(0);
  date.setUTCSeconds(decoded.exp);
  return date;
};

export const getAccessToken = (tokenState: TokenState): string | undefined => {
  return tokenState.token?.access_token;
};

export const getRefreshToken = (tokenState: TokenState): string | undefined => {
  return tokenState?.token?.refresh_token;
};

export const getToken = (tokenState: TokenState) => {
  const token = getAccessToken(tokenState);
  if (token) {
    const expired = isTokenExpired(token);
    if (!expired) {
      return token;
    }
  }
};

export const getTokenFromStorage = () => {
  let data = undefined;
  try {
    const strToken = sessionStorage.getItem(SESSION_STORAGE_KEYS.token);
    if (strToken) data = JSON.parse(strToken);
  } catch (e) {}
  return data;
};
