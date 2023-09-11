
export interface IPaginatedList<TData> {
  data: TData[];
  nextPage: string | number;
  hasNextPage: boolean;
}

export class CursoredList<TData> implements IPaginatedList<TData> {
  public data: TData[];
  public nextPage: string;
  public hasNextPage: boolean;

  constructor(data: TData[], endCursor: string, hasNextPage: boolean) {
    this.data = data;
    this.nextPage = endCursor;
    this.hasNextPage = hasNextPage;
  }
}

export class PagedList<TData> implements IPaginatedList<TData> {
  public data: TData[];
  public nextPage: number;
  public hasNextPage: boolean;
  public page: number;
  public totalCount?: number;

  constructor(data: TData[], page: number, hasNextPage: boolean, totalCount?: number) {
    this.data = data;
    this.page = page;
    this.nextPage = page + 1;
    this.hasNextPage = hasNextPage;
    this.totalCount = totalCount;
  }
}