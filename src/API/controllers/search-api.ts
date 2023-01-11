import BaseApi from './base-api';

export interface SearchResponse {
  total: number;
  results: Array<{
    _id: string;
    _score: number;
    _index: string;
    _type: '_doc',
    _source: any; // <- where the actual data is contained
  }>;
}

export interface SearchResponse2 {
  events: any[];
  fields: string[];
  queryId: string;
  partialResults: boolean;
  pageNumber: number;
  hasResults: boolean;
}

export type AggregatedBucket = {
  key: string;
  count: number;
};

export type BucketResult = {
  groupBy: string;
  stats: AggregatedBucket[];
};

export interface SearchStatsResponse {
  results: BucketResult[];
}

export default class SearchApi extends BaseApi {
  private readonly uri_segment = 'search';

  public async search(
    query: string,
    page = 1,
    limit = 10,
  ): Promise<SearchResponse> {
    try {
      const params = new URLSearchParams();
      params.append('query', query);
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      const response = await super
        .init()
        .get<SearchResponse>(`/${this.uri_segment}`, { params });
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async search_v2(
    query: string,
    limit: number = 10,
    query_syntax: 'LUCENE' | 'JEXL' = 'LUCENE',
    sort?: any,
    save_query: boolean = false,
    begin: string = '19700102',
    end: string = '20370101',
  ): Promise<SearchResponse2> {
    try {
      const params = new URLSearchParams();
      params.append('query', query);
      params.append('limit', limit.toString());
      params.append('query_syntax', query_syntax.toString());
      params.append('save_query', save_query.toString());
      params.append('begin', begin.toString());
      params.append('end', end.toString());
      if (sort) {
        params.append('sort', JSON.stringify(sort));
      }
      const response = await super
        .init()
        .get<SearchResponse2>(`/${this.uri_segment}/v2`, { params });
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async search_v2_paginate(
    query_id: string,
    row_begin: number,
    row_end: number,
  ): Promise<SearchResponse2> {
    try {
      const params = new URLSearchParams();
      params.append('row_begin', row_begin.toString());
      params.append('row_end', row_end.toString());

      const response = await super
        .init()
        .get<SearchResponse2>(`/${this.uri_segment}/v2/${query_id}`, { params });
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async search_v2_close(queryId: string): Promise<void> {
    try {
      const response = await super.init().delete(`/${this.uri_segment}/v2/${queryId}`);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async search_links(objIds: Array<string>) {
    let request = '1=1';
    objIds.forEach((id) => {
      request += ` OR (ID_DEST: ${id} OR ID_SOURCE: ${id})`;
    });
    try {
      const response = await this.search_v2(request, 100, undefined, undefined, undefined);
      return response;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async search_objById(objId: string, type: string) {
    try {
      const response = await this.search_v2(`${type}: ${objId}`, 100, undefined, undefined, undefined);
      return response;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async search_v2_circle() {

  }

  public async search_v2_box() {

  }

  public async searchStats(query: string): Promise<SearchStatsResponse> {
    try {
      const params = new URLSearchParams();
      params.append('query', query);
      const response = await super
        .init()
        .get<SearchStatsResponse>(`/${this.uri_segment}/stats`, { params });
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }
}
