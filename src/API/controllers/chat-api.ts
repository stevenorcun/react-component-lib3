import BaseApi from './base-api';

export type ChatRoom = {
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  history: any[];
  isDeleted: boolean;
  _id: string;
  members: string[];
};

export type ChatEntry = {
  from: string;
  time: string;
  body: string;
};

export default class ChatApi extends BaseApi {
  private readonly uri_segment = 'chat-rooms';

  public async listChatrooms(pageSize = 100, page = 1): Promise<ChatRoom[]> {
    const params = new URLSearchParams([
      ['pageSize', pageSize.toString()],
      ['pageNumber', page.toString()],
    ]);
    try {
      const response = await super
        .init()
        .get<ChatRoom[]>(`/${this.uri_segment}`, { params });
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async createChatroom(
    name: string,
    description: string,
    history: any[],
    isDeleted = false
  ): Promise<ChatRoom> {
    const chatroomInput = { name, description, history, isDeleted };
    try {
      const response = await super
        .init()
        .post<ChatRoom>(`/${this.uri_segment}`, chatroomInput);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async getChatroom(chatRoomId: string): Promise<ChatRoom> {
    try {
      const response = await super
        .init()
        .get<ChatRoom>(`${this.uri_segment}/${chatRoomId}`);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async deleteChatroom(chatRoomId: string): Promise<void> {
    try {
      const response = await super
        .init()
        .delete(`/${this.uri_segment}/${chatRoomId}`);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async joinCharoom(chatRoomId: string): Promise<ChatRoom> {
    try {
      const response = await super
        .init()
        .patch<ChatRoom>(`/${this.uri_segment}/${chatRoomId}/register`);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async leaveCharoom(chatRoomId: string): Promise<ChatRoom> {
    try {
      const response = await super
        .init()
        .patch<ChatRoom>(`/${this.uri_segment}/${chatRoomId}/leave`);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async getChatHistory(
    chatRoomId: string,
    pageSize = 100,
    page = 1
  ): Promise<ChatEntry[]> {
    const params = new URLSearchParams([
      ['pageSize', pageSize.toString()],
      ['pageNumber', page.toString()],
    ]);

    try {
      const response = await super
        .init()
        .get<ChatEntry[]>(`${this.uri_segment}/${chatRoomId}/history`, {
          params,
        });
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async updateChatroomName(chatRoomId: string, newName: string): Promise<ChatRoom> {
    const data = new URLSearchParams([
      ['name', newName],
    ]);
    try {
      const response = await super
        .init()
        .patch<ChatRoom>(`/${this.uri_segment}/${chatRoomId}/name`, data);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async updateChatroomDescription(chatRoomId: string, newDescription: string): Promise<ChatRoom> {
    const data = new URLSearchParams([
      ['description', newDescription],
    ]);
    try {
      const response = await super
        .init()
        .patch<ChatRoom>(`/${this.uri_segment}/${chatRoomId}/description`, data);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async getChatroomAttachments(chatRoomId: string, pageSize: number = 100, pageNumber: number = 1): Promise<string[]> {
    const params = new URLSearchParams([
      ['pageSize', pageSize.toString()],
      ['pageNumber', pageNumber.toString()],
    ]);

    try {
      const response = await super
        .init()
        .get<string[]>(`${this.uri_segment}/${chatRoomId}/attachments`, {
          params,
        });
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }
}
