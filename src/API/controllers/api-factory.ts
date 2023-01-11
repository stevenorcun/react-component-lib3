import { ApiStore } from '@/API/controllers/api-store';

export default class ApiFactory {
  public static create<T>(name: string, ...args: any[]): T {
    const instance = new (<T>ApiStore)[name](...args);
    return instance;
  }
}
