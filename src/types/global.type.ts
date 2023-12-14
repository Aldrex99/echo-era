export interface ISearchFields {
  field: string | ISearchFieldsElement;
}

interface ISearchFieldsElement {
  field: string;
  elemMatch: string;
}

export interface ISearchReportResult {
  _id: string;
  fromUser: {
    username: string;
    email: string;
    usernameOnDelete: string;
    emailOnDelete: string;
    previousNames: {
      username: string;
      date: Date;
    }[];
    previousEmail: {
      email: string;
      date: Date;
    }[];
  };
  toUser: {
    username: string;
    email: string;
    usernameOnDelete: string;
    emailOnDelete: string;
    previousNames: {
      username: string;
      date: Date;
    }[];
    previousEmail: {
      email: string;
      date: Date;
    }[];
  };
  reason: string;
  status: string;
  date: Date;
}

interface IEditHistory {
  date: Date;
  role: string;
  by: {
    _id: string;
    username: string;
  };
  content: string;
}

export interface IReportedMessage {
  _id: string;
  date: Date;
  deleted: boolean;
  sender: {
    _id: string;
    username: string;
  }
  chat: string;
  editHistory: IEditHistory[];
  readBy: {
    _id: string;
    username: string;
  }[];
  moderationStatus: string;
  moderationDate: Date;
  flaggedBy: string[];
  content: string;
  deletedBy: string[];
}
