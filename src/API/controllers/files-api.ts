import BaseApi from "./base-api";

export default class FilesApi extends BaseApi {
    private readonly uri_segment = 'files';

    public async getFile(fileId: string): Promise<Blob> {
        try {
            const response = await super.init().get<Blob>(`/${this.uri_segment}/${fileId}`, { responseType: 'blob' });
            return response.data;
        } catch (err) {
            throw this.handleError(err);
        }
    }

    public async uploadFile(file: Blob): Promise<string> {
        try {
            const response = await super.init().post<string>(`/${this.uri_segment}`, { file });
            return response.data;
        } catch (err) {
            throw this.handleError(err);
        }
    }
}
