interface TableColumn <RecordType> {
  title: string;
  dataIndex: Extract<keyof RecordType, string>;
  searchable: boolean;
  sort?: boolean;
}

export type { TableColumn };
