import BaseApi from "./base-api";
import jsonUsers from "./mock/data/users.json";

export interface NovaUser {
  id?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  markings?: string[];
}

export default class UsersApi extends BaseApi {
  // private readonly uri_segment = 'users';

  public async allUsers(): Promise<NovaUser[]> {
    try {
      return jsonUsers.listUsers;
      // const response = await super.init().get<NovaUser[]>(`/${this.uri_segment}`);
      // return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }
}
