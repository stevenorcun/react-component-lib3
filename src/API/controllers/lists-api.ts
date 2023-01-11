import BaseApi from "./base-api";

export default class ListsApi extends BaseApi {
  public async allLists(): Promise<any[]> {
    try {
      const response = await super.init().get<[]>('lists');
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }
}
