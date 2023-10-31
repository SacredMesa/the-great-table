import { useEffect, useState } from 'react';
import { TableColumn } from '../../models/Table.ts';
import _ from 'lodash';

interface UseTableEffect<RecordType> {
  isDataLoaded: boolean;
  isDataContainingRecords: boolean;
  tableData: RecordType[];
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  onSort: (column: TableColumn<RecordType>) => void;
  sortedColumn: TableColumn<RecordType> | undefined;
  sortDirection: 'asc' | 'desc' | undefined;
  setSearchText: (text: string) => void;
  onRowSelect: (isChecked: boolean, record: RecordType) => void;
  selectedRows: RecordType[];
}

export const useTableEffect = <RecordType,>(
  columns: TableColumn<RecordType>[],
  data: RecordType[] | undefined,
  rowSelectFunction?: (rows: RecordType[]) => void
): UseTableEffect<RecordType> => {
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [tableData, setTableData] = useState<RecordType[]>([]);
  const [sortedColumn, setSortedColumn] = useState<TableColumn<RecordType> | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | undefined>(undefined);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<RecordType[]>([]);

  const isDataLoaded = !!data;
  const isDataContainingRecords = !!data?.length;

  useEffect(() => {
    if (data) {
      const filteredData = _.filter(data, (row) => {
        const searchableFields = _.filter(columns, 'searchable').map((field) => field.dataIndex) as (keyof RecordType)[];
        for (const fieldName of searchableFields) {
          if (_.includes(String(row[fieldName]).toLowerCase(), searchText.toLowerCase())) return true;
        }
        return false;
      });

      const pageData = _.chain(filteredData)
        .thru((val) => {
          if (!sortedColumn || !sortDirection) return val;
          return _.orderBy(val, sortedColumn.dataIndex, sortDirection);
        })
        .slice((currentPage - 1) * pageSize, (currentPage - 1) * pageSize + pageSize)
        .value() as RecordType[];

      setTotalPages(Math.ceil(filteredData.length / pageSize));
      setTableData(pageData);
    }
  }, [data, currentPage, pageSize, sortedColumn, sortDirection, searchText]);

  const onSort = (column: TableColumn<RecordType>) => {
    if (sortedColumn !== column) {
      setSortedColumn(column);
      setSortDirection('asc');
    } else {
      setSortDirection((direction: 'asc' | 'desc' | undefined) => {
        switch (direction) {
          case undefined:
            return 'asc';
          case 'asc':
            return 'desc';
          case 'desc':
            return undefined;
        }
      });
    }
  };

  const onRowSelect = (isChecked: boolean, record: RecordType) => {
    if (isChecked) {
      setSelectedRows((curr) => [...curr, record]);
      if (rowSelectFunction) rowSelectFunction([...selectedRows, record]);
    } else {
      setSelectedRows((curr) => _.without(curr, record));
      if (rowSelectFunction) rowSelectFunction(_.without(selectedRows, record));
    }
  };

  return {
    isDataLoaded,
    isDataContainingRecords,
    tableData,
    totalPages,
    currentPage,
    setCurrentPage,
    setPageSize,
    onSort,
    sortedColumn,
    sortDirection,
    setSearchText,
    onRowSelect,
    selectedRows
  };
};
