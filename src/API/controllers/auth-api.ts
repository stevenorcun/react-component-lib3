import BaseApi from "./base-api";

export type LoginRequest = {
  identifier: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
};

export default class AuthApi extends BaseApi {
  public async login(request: LoginRequest): Promise<LoginResponse> {
    this.validateLoginRequest(request);

    try {
      const data = new URLSearchParams();
      data.append("username", request.identifier);
      data.append("password", request.password);
      data.append("grant_type", "password");

      const clientId =
        process.env?.REACT_APP_SSO_CLIENT_ID || "datawave-account";
      data.append("client_id", clientId);

      const ssoUrl = process.env.REACT_APP_SSO_TOKEN_ENDPOINT;
      if (!ssoUrl) {
        throw new Error("Missing auth URL configuration");
      }

      const response = await super.init(ssoUrl).post<LoginResponse>("", data);
      return response.data;
    } catch (err: any) {
      throw this.handleError(err);
    }
  }

  public async refreshToken(token: string): Promise<LoginResponse> {
    try {
      const data = new URLSearchParams();
      data.append("refresh_token", token);
      data.append("grant_type", "refresh_token");

      const clientId =
        process.env?.REACT_APP_SSO_CLIENT_ID || "datawave-account";
      data.append("client_id", clientId);

      const ssoUrl = process.env.REACT_APP_SSO_TOKEN_ENDPOINT;
      if (!ssoUrl) {
        throw new Error("Missing auth URL configuration");
      }

      const response = await super.init(ssoUrl).post<LoginResponse>("", data);

      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  protected validateLoginRequest = (request: LoginRequest): void => {
    if (!request.identifier || !request.password) {
      throw new Error("Identifiants manquants");
    }
  };
}
