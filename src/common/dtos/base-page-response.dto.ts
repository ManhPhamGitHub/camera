export class PaginateBaseDto<T> {
  public docs: T[];

  public totalPage: number;

  public size: number;

  public page: number;

  public total: number;
}
