export type PaginateData<T> = {
  page: number;
  per_page: number;
  prev_page: number | null;
  next_page: number | null;
  total: number;
  total_pages: number;
  data: T;
};
