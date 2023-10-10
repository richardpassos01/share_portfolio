type Data = {
  total_count: number;
};
export type MapperFunction = () => any;
type Results = any[];

export default class Pagination {
  public totalPages = 0;
  public totalItems = 0;
  public results: Results = [];

  constructor(
    public readonly currentPage: number,
    limit: number,
    data: Data[] = [],
    mapper: MapperFunction,
  ) {
    this.updateProps(limit, data, mapper);
  }

  private updateProps(limit: number, data: Data[], mapper: MapperFunction) {
    if (!data?.length) {
      return;
    }
    this.totalItems = Number(data[0].total_count);
    this.totalPages = Math.ceil(this.totalItems / limit);
    this.results = data.map(mapper);
  }
}
