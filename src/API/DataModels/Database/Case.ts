export type CaseLinkedObjects = {
  phones: string[];
  requests: string[];
  usernames: string[];
  documents: string[];
  forms: string[];
  [key: string]: string[];
};

export enum CasePriority {
  Low = 1,
  Medium,
  High,
}

export enum CaseStatus {
  Initiated = 1,
  Active,
  Ended,
}

export enum CaseClassification {
  Public = 1,
  Restricted,
  Secret,
}

export type Case = {
  createdAt: number;
  createdBy: string;
  updatedAt: number;
  type: string;
  description: {
    value: string;
    createdAt: Date;
    createdBy: string;
  };
  employeesInvolved: any[];
  status: CaseStatus;
  targets: any[];
  associatedCases: any[];
  linkedObjects: CaseLinkedObjects;
  linkedAnalysisEvents: string[];
  isDeleted: boolean;
  id: string;
  name: string;
  subscribers: string[];
  parentGroup: string;
  supervisor: any;
  priority: CasePriority;
  classification: CaseClassification;
  chatRoomId: string;
  messageCount: number;
  alerts: {
    total: number;
    value: any[];
  };
  comments: any[];
  sharing: any[];
  requests: any[];
  events: {
    total: number;
    value: any[];
  };
  lists: {
    value: string;
    createdAt: Date;
    createdBy: string;
  };
  checkList: {
    value: any[];
    createdAt: Date;
    createdBy: string;
  };
  picture: {
    id: string;
    value: {
      title: string;
      path: string;
    };
  };
};
