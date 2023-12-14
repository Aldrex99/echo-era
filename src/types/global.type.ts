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
