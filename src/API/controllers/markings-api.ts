import BaseApi from './base-api';

export interface Marking {
  id: string,
  color: string,
  label: string,
  type: number
}

export default class MarkingsApi extends BaseApi {
  private readonly uri_segment = 'markings';

  public async listMarkings(): Promise<Marking[]> {
    try {
      const response = await super.init().get<Marking[]>(`/${this.uri_segment}`);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async createMarkingSettings(data: Marking): Promise<Marking> {
    try {
      const response = await super.init().post<Marking>(`/${this.uri_segment}`, data);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async saveMarkingSettings(data: Marking): Promise<Marking> {
    try {
      const response = await super.init().put<Marking>(`/${this.uri_segment}/${data.id}`, data);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async deleteMarkingSettings(markingId: string): Promise<Marking> {
    try {
      const response = await super.init().delete<Marking>(`/${this.uri_segment}/${markingId}`);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }
}
