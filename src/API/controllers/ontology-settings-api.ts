
import BaseApi from './base-api';


export interface OntologySettingsBase {
    label: string,
    icon: string,
    color: string,
    objectType: number,
    marquants: string[];
    userId: string;
    id:string;
    name: string,
}

export interface OntologySettings extends OntologySettingsBase {
    objectId: string;
    properties: OntologySettingsBase[];
}

export default class OntologySettingsApi extends BaseApi {
    private readonly uri_segment = 'ontology_settings';

    public async getOntologySettings(): Promise<OntologySettings[]> {
        try {
            const response = await super.init().get<OntologySettings[]>(`/${this.uri_segment}`);
            return response.data;
        } catch (err) {
            throw this.handleError(err);
        }
    }

    public async createOntologySettings(data: OntologySettings): Promise<OntologySettings> {
        try {
            const response = await super.init().post<OntologySettings>(`/${this.uri_segment}`, data);
            return response.data;
        } catch (err) {
            throw this.handleError(err);
        }
    }

    public async updateOntologySettings(data: OntologySettings): Promise<OntologySettings> {
        try {
            const response = await super.init().put<OntologySettings>(`/${this.uri_segment}/${data.id}`);
            return response.data;
        } catch (err) {
            throw this.handleError(err);
        }
    }

    public async deleteOntologySettings(objId: string): Promise<void> {
        try {
            const response = await super.init().delete<void>(`/${this.uri_segment}/${objId}`);
            return response.data;
        } catch (err) {
            throw this.handleError(err);
        }
    }
}
