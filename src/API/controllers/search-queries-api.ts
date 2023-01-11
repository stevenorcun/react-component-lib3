import BaseApi from '@/API/controllers/base-api';
import { BrowserSearchTemplate, BrowserTabType } from '@/constants/browser-related';

export interface SearchQueryTemplateResponse {
  total: number;
  results: BrowserSearchTemplate[];
}

export default class SearchQueriesApi extends BaseApi {
  private readonly uri_segment = 'queries';

  public async getTemplates(
    page = 1,
    limit = 30,
    favorite: boolean | null = null,
    formType: BrowserTabType | null = null,
  ): Promise<SearchQueryTemplateResponse> {
    try {
      const params = new URLSearchParams();
      params.append('pageNumber', page.toString());
      params.append('pageSize', limit.toString());
      if (favorite !== null) params.append('favorite', favorite.toString());
      if (formType !== null) params.append('formType', formType.toString());
      const response = await super
        .init()
        .get<SearchQueryTemplateResponse>(`/${this.uri_segment}`, { params });
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async createTemplate(
    template: {
      query: BrowserSearchTemplate['query'],
      favorite: BrowserSearchTemplate['favorite'],
      type: BrowserSearchTemplate['type'],
      formType: BrowserSearchTemplate['formType'],
      title: BrowserSearchTemplate['title'],
      sort: BrowserSearchTemplate['sort'],
      form: BrowserSearchTemplate['form']
    }, // exclude id, created/updatedAt
  ): Promise<BrowserSearchTemplate> {
    try {
      const response = await super
        .init()
        .post<BrowserSearchTemplate>(`/${this.uri_segment}`, template);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async updateTemplate(
    query_id: string,
    template: BrowserSearchTemplate,
  ): Promise<BrowserSearchTemplate> {
    try {
      const response = await super
        .init()
        .put<BrowserSearchTemplate>(`/${this.uri_segment}/${query_id}`, template);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async delete(query_id: string): Promise<void> {
    try {
      const response = await super
        .init()
        .delete<void>(`/${this.uri_segment}/${query_id}`);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }
}
