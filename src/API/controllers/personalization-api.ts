
import BaseApi from './base-api';

export default class PersonalizationApi extends BaseApi {
  private readonly uri_segment = 'personalization';

  public async getPersonalizations(): Promise<void> {
    try {
      const response = await super.init().get(`/${this.uri_segment}`);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }
}
