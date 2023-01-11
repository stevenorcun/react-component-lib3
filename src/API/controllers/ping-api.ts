import BaseApi from './base-api';

export default class PingApi extends BaseApi {
  private readonly uri_segment = 'ping';

  public async ping(): Promise<boolean> {
    try {
      const response = await super.init().get(`/${this.uri_segment}`);
      const { message } = response.data;
      return message === 'pong';
    } catch (err) {
      throw this.handleError(err);
    }
  }
}
