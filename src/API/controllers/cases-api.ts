import { Case } from '@/API/DataModels/Database/Case';
import BaseApi from './base-api';

export default class CasesApi extends BaseApi {
  private readonly uri_segment = 'objects';

  public async getCase(caseId: string): Promise<Case> {
    try {
      const response = await super
        .init()
        .get<Case>(`/${this.uri_segment}/${caseId}`);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async listCases(
    pageSize: number,
    pageNumber: number
  ): Promise<Case[]> {
    const params = { pageSize, pageNumber };
    try {
      const response = await super
        .init()
        .get<Case[]>(`/${this.uri_segment}`, { params });
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async createCase(c: any): Promise<any> {
    try {
      const response = await super
        .init()
        .post<any>(`/${this.uri_segment}/`, c);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async updateCase(c: Case): Promise<Case> {
    try {
      const response = await super
        .init()
        .put<Case>(`/${this.uri_segment}/${c.id}`, { ...c });
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async deleteCase(caseId: string): Promise<void> {
    try {
      const response = await super
        .init()
        .delete(`/${this.uri_segment}/${caseId}`);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async attachObjectToCase(
    caseId: string,
    objectId: string,
    objectType: string
  ): Promise<Case> {
    try {
      const response = await super
        .init()
        .post<Case>(
          `/${this.uri_segment}/${caseId}/linked-objects/${objectType}/${objectId}`
        );
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async detacthObjectFromCase(
    caseId: string,
    objectId: string,
    objectType: string
  ): Promise<Case> {
    try {
      const response = await super
        .init()
        .delete<Case>(
          `/${this.uri_segment}/${caseId}/linked-objects/${objectType}/${objectId}`
        );
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async attachCaseToCase(
    caseId: string,
    associatedCaseId: string
  ): Promise<Case> {
    try {
      const response = await super
        .init()
        .post<Case>(
          `/${this.uri_segment}/${caseId}/associated-cases/${associatedCaseId}`
        );
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async detachCaseToCase(
    caseId: string,
    associatedCaseId: string
  ): Promise<Case> {
    try {
      const response = await super
        .init()
        .delete<Case>(
          `/${this.uri_segment}/${caseId}/associated-cases/${associatedCaseId}`
        );
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async attachAnalysisEventToCase(
    caseId: string,
    analysisEventId: string
  ): Promise<Case> {
    try {
      const response = await super
        .init()
        .post<Case>(
          `/${this.uri_segment}/${caseId}/associated-cases/${analysisEventId}`
        );
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async detachAnalysisEventToCase(
    caseId: string,
    analysisEventId: string
  ): Promise<Case> {
    try {
      const response = await super
        .init()
        .delete<Case>(
          `/${this.uri_segment}/${caseId}/associated-cases/${analysisEventId}`
        );
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }
}
