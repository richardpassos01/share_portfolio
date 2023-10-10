type Data = {
  total_count: number;
};
export type MapperFunction = () => any;
type Results = any[];

export default class Pagination {
  private totalPages = 0;
  private results: Results = [];

  constructor(
    private readonly currentPage: number,
    limit: number,
    data: Data[] = [],
    mapper: MapperFunction,
  ) {
    this.updateProps(limit, data, mapper);
  }

  updateProps(limit: number, data: Data[], mapper: MapperFunction) {
    if (!data?.length) {
      return;
    }
    this.totalPages = Math.ceil(Number(data[0].total_count) / limit);
    this.results = data.map(mapper);
  }
}
