export type IPaginationFilter = {
  searchFor?: string;
  page?: number;
  perPage?: number;
  searchedValue?: string;
};

export type IPaginatedResponseMeta = {
  total: number;
  perPage: number;
  currentPage: number | null;
  lastPage: number | null;
  lastId: number | null;
};

export type ICurrentPaginatedResponse = {
  position: number;
  total: number;
  nextId: number | null;
  prevId: number | null;
};
