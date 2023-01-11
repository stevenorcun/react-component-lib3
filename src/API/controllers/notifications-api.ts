import BaseApi from './base-api';

export type Notification = {
  title: string;
  message: string;
  entityType: string;
  entityId: string;
  triggeredUserId: string;
  belongsTo: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
  id: string;
};

export default class NotificationsApi extends BaseApi {
  private readonly uri_segment = 'notifications';

  public async listNotifications(): Promise<Notification[]> {
    try {
      const response = await super
        .init()
        .get<Notification[]>(`${this.uri_segment}`);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async getNotification(notifId: string): Promise<Notification> {
    try {
      const response = await super
        .init()
        .get<Notification>(`${this.uri_segment}`);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async markNotificationAsRead(notifId: string): Promise<Notification> {
    try {
      const response = await super
        .init()
        .patch<Notification>(`/${this.uri_segment}/${notifId}`, {
          is_read: true,
        });
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async archiveNotification(notifId: string): Promise<Notification> {
    try {
      const response = await super
        .init()
        .patch<Notification>(`/${this.uri_segment}/${notifId}`, {
          is_archived: true,
        });
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async markAllAsRead(): Promise<void> {
    try {
      const response = await super.init().put(`/${this.uri_segment}/read-all`);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async archiveAll(): Promise<void> {
    try {
      const response = await super
        .init()
        .put(`/${this.uri_segment}/archive-all`);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }
}
