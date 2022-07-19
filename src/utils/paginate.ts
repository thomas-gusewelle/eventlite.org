export function paginate<T>(
  items: T[],
  currentPage: number = 1,
  perPageItems: number = 10
) {
  let page = currentPage;
  let perPage = perPageItems;
  let offset = (page - 1) * perPage;

  let paginatedItems = items.slice(offset).slice(0, perPageItems);
  let totalPages = Math.ceil(items.length / perPage);

  return {
    page: page,
    per_page: perPage,
    prev_page: page - 1 ? page - 1 : null,
    next_page: totalPages > page ? page + 1 : null,
    total: items.length,
    total_pages: totalPages,
    data: paginatedItems,
  };
}
