import BaseApi from './base-api';

export default class FavoritesApi extends BaseApi {
    private readonly uri_segment = 'favorites';

    public async addFavorite(objectId: string): Promise<void> {
        try {
            const response = await super
                .init()
                .post<void>(`/${this.uri_segment}/${objectId}`);
            return response.data;
        } catch (err) {
            throw this.handleError(err);
        }
    }

    public async getFavorites(): Promise<string[]> {
        try {
            const response = await super
                .init()
                .get<string[]>(`${this.uri_segment}`);
            return response.data;
        } catch (err) {
            throw this.handleError(err);
        }
    }

    public async removeFavorite(objectId: string): Promise<void> {
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
