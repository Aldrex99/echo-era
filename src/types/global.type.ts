export interface ISearchFields {
  field: string | ISearchFieldsElement;
}

interface ISearchFieldsElement {
  field: string;
  elemMatch: string;
}
