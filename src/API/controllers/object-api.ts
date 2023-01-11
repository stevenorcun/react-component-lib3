import {
  File,
  NovaObject,
  NovaObjectRelation,
} from "@/API/DataModels/Database/NovaObject";
import BaseApi from "./base-api";

export interface NovaObjectRelated {
  links: any[];
  relations: any[];
}

export default class ObjectsApi extends BaseApi {
  public async getObjectRelations(
    objId: string,
    types?
  ): Promise<NovaObjectRelated> {
    try {
      const response = await super
        .init()
        .get<NovaObjectRelated>(`/object-relations/v2/${objId}`);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async getObject(objId: string): Promise<NovaObject> {
    try {
      const response = await super.init().get<NovaObject>(`/objects/${objId}`);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async updateObject(obj: NovaObject): Promise<NovaObject> {
    try {
      const response = await super
        .init()
        .put<NovaObject>(`/objects/${obj.id}`, { ...obj });
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async deleteObject(objId: string): Promise<void> {
    try {
      const response = await super.init().delete(`/objects/${objId}`);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async createObject(
    obj: Partial<NovaObject["_source"]>
  ): Promise<NovaObject["_source"]> {
    try {
      const response = await super
        .init()
        .post<NovaObject["_source"]>("/objects/", { ...obj });
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async mergeObjects(
    idFrom: string,
    idTo: string,
    data: NovaObject
  ): Promise<NovaObject> {
    try {
      const response = await super
        .init()
        .post<NovaObject>("/objects/merge", {
          fromId: idFrom,
          toId: idTo,
          ...data,
        });
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async attachFileToObject(objId: string, file: Blob): Promise<File> {
    try {
      const response = await super
        .init()
        .post<File>(`/objects/${objId}/attachments/`, { file });
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async getObjectFileAttachment(
    objId: string,
    fileId: string
  ): Promise<string> {
    try {
      const response = await super
        .init()
        .get<string>(`/objects/${objId}/attachments/${fileId}`);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  /** ******* DEPRECATED ********* */
  public async addObjectRelation(
    relationInfo: NovaObjectRelation
  ): Promise<NovaObjectRelation> {
    try {
      const response = await super
        .init()
        .post<NovaObjectRelation>("/object-relations", { ...relationInfo });
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async updateObjectRelation(
    relationInfo: NovaObjectRelation
  ): Promise<NovaObjectRelation> {
    try {
      const response = await super
        .init()
        .post<NovaObjectRelation>("/object-relations", { ...relationInfo });
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  public async deleteObjectRelation(
    relationId: NovaObjectRelation
  ): Promise<void> {
    try {
      const response = await super
        .init()
        .delete(`/object-relations/${relationId}`);
      return response.data;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  /** ******* END OF DEPRECATED ********* */
}
