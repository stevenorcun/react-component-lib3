import BaseApi from './base-api';

export type SubscriptionResult = {
  subscribtedObjects: string[];
};

export default class SubscriptionsApi extends BaseApi {
  private readonly uri_segment = 'subscriptions';

  public async addSubscription(objectId: string): Promise<SubscriptionResult> {
    try {
      const response = await super
        .init()
        .post<SubscriptionResult>(`/${this.uri_segment}/${objectId}`);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async getSubscriptions(): Promise<SubscriptionResult> {
    try {
      const response = await super
        .init()
        .get<SubscriptionResult>(`${this.uri_segment}`);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async removeSubscription(objectId: string): Promise<void> {
    try {
      const response = await super
        .init()
        .delete(`/${this.uri_segment}/${objectId}`);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }
}
