import BaseApi from "./base-api";
import { OntologySettings } from "./ontology-settings-api";

export default class OntologyApi extends BaseApi {
  private readonly uri_segment = "ontology";

  public async getOntology(): Promise<OntologySettings[]> {
    try {
      const response = await super
        .init()
        .get<OntologySettings[]>(`/${this.uri_segment}`);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async getObjectOntology(objId: string): Promise<OntologySettings> {
    try {
      const response = await super
        .init()
        .get<OntologySettings>(`/${this.uri_segment}/${objId}`);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }
}
