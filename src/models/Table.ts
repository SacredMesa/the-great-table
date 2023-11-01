interface TableColumn <RecordType> {
  title: string;
  dataIndex: Extract<keyof RecordType, string>;
  searchable: boolean;
  sort?: boolean;
}

interface TableSearchParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc' | undefined;
}

export type { TableColumn, TableSearchParams };
