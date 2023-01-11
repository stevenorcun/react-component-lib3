import { CustomizedActionsCallback, CustomizedActionsType, HttpMethod, ResponseFormat } from "@/constants/customization";
import BaseApi from "./base-api";

export type applicative_config = 'config' | 'external-apps' | 'custom-actions' | 'keybind' | 'personalization' | 'hooks';

export interface AppSettings {
    globalSettings: AppConfig;
    externalApps: ExternalApp[];
    actions: CustomAction[];
    keybinds: Keybind[];
    personalizations: TextPersonalization[];
}

export interface AppConfig {
    appTitle: string;
    mainThemeColor: string;
    dateFormat: string;
}

export interface DbConfig<T> {
    type: applicative_config;
    id: string;
    userId: string;
}

export interface ExternalApp {
    label: string;
    marquants?: string[];
    url: string;
    requireCase: boolean;
    active: boolean;
}

export interface CustomApiConfig {
    url: string;
    httpMethod: HttpMethod,
    headers: Map<string, string>;
    callback: CustomizedActionsCallback,
    responseFormat: ResponseFormat,
    responseMapping: string;
}

export interface CustomAction {
    label: string;
    marquants?: string[];
    objTypes: number[];
    action: CustomizedActionsType;
    active: boolean;
    api: CustomApiConfig;
}

export interface Keybind {
    marquants?: string[];
    module: string;
    action: string;
    keybind: string;
}

export interface TextPersonalization {
    marquants?: string[];
    content: any;
}

export interface Hooks {
    label: string;
    active: boolean;
    hookType: 1 | 2; // external api,  predefined
    anchor: 1 | 2 | 3; // update global settings, pre-search, post-search
    api: CustomApiConfig,
    marquants?: string[];

}

export default class ApplicativeApi extends BaseApi {
    private readonly uri_segment = 'applicative';

    public async getGlobalConfig(): Promise<AppSettings> {
        try {
            const response = await super.init().get<AppSettings>(`/${this.uri_segment}`);
            return response.data;
        } catch (err) {
            throw this.handleError(err);
        }
    }

    public async getConfig<T>(type: applicative_config): Promise<T> {
        try {
            const response = await super.init().get<T>(`/${this.uri_segment}/${type}`);
            return response.data;
        } catch (err) {
            throw this.handleError(err);
        }
    }

    public async createConfig<T>(type: applicative_config, data: T): Promise<DbConfig<T>> {
        try {
            const response = await super.init().post<DbConfig<T>>(`/${this.uri_segment}/${type}`, data);
            return response.data;
        } catch (err) {
            throw this.handleError(err);
        }
    }

    public async updateConfig<T>(type: applicative_config, data: DbConfig<T>): Promise<DbConfig<T>> {
        try {
            const response = await super.init().put<DbConfig<T>>(`/${this.uri_segment}/${type}/${data.id}`, data);
            return response.data;
        } catch (err) {
            throw this.handleError(err);
        }
    }

    public async deleteConfig<T>(type: applicative_config, data: DbConfig<T>): Promise<void> {
        try {
            const response = await super.init().delete<void>(`/${this.uri_segment}/${type}/${data.id}`);
            return response.data;
        } catch (err) {
            throw this.handleError(err);
        }
    }
}
