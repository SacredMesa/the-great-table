import {useEffect, useState} from 'react';
import {TableColumn} from '../../../models/Table.ts';
import _ from 'lodash';
import {useSearchParamsStateEffect} from "../../../common/effects/useSearchParamsStateEffect.tsx";

interface UseTableEffect<RecordType> {
  isDataLoaded: boolean;
  isDataContainingRecords: boolean;
  tableData: RecordType[];
  totalPages: number;
  currentPage: number;
  onPageSelect: (page: number) => void;
  pageSize: number;
  onPageSizeSelect: (pageSize: number) => void;
  onSort: (column: TableColumn<RecordType>) => void;
  sortedColumn: TableColumn<RecordType> | undefined;
  sortDirection: 'asc' | 'desc' | undefined;
  setSearchText: (text: string) => void;
  onRowSelect: (isChecked: boolean, record: RecordType) => void;
  selectedRows: RecordType[];
}

export const useTableEffect = <RecordType, >(
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

  const {searchParams, updateParams, deleteParams} = useSearchParamsStateEffect();

  // set states from query params on initial load
  useEffect(() => {
    for (const [param, value] of searchParams.entries()) {
      switch (param) {
        case 'page':
          setCurrentPage(parseInt(value))
          break;
        case 'pageSize':
          setPageSize(parseInt(value))
          break;
        case 'sortBy':
          setSortedColumn(_.find(columns, ['title', value]))
          break;
        case 'sortDirection':
          if (_.includes(['asc', 'desc', undefined], value)) setSortDirection(value as ('asc' | 'desc' | undefined));
          break;
      }
    }
  }, []);

  // process table data
  useEffect(() => {
    if (data) {
      // search through searchable columns for search input
      const filteredData = _.filter(data, (row) => {
        const searchableFields = _.filter(columns, 'searchable').map((field) => field.dataIndex) as (keyof RecordType)[];
        for (const fieldName of searchableFields) {
          if (_.includes(String(row[fieldName]).toLowerCase(), searchText.toLowerCase())) return true;
        }
        return false;
      });

      // slice data based on current page and page size
      const pageData = _.chain(filteredData)
        .thru((val) => {
          if (!sortedColumn || !sortDirection) return val;
          return _.orderBy(val, sortedColumn.dataIndex, sortDirection);
        })
        .slice((currentPage - 1) * pageSize, (currentPage - 1) * pageSize + pageSize)
        .value() as RecordType[];

      // determine total pages from filtered data
      setTotalPages(Math.ceil(filteredData.length / pageSize));
      setTableData(pageData);
    }
  }, [data, currentPage, pageSize, sortedColumn, sortDirection, searchText]);

  const onSort = (column: TableColumn<RecordType>) => {
    if (sortedColumn !== column) {
      setSortedColumn(column);
      setSortDirection('asc');

      updateParams({
        sortBy: column.title,
        sortDirection: 'asc'
      })
    } else {
      setSortDirection((direction: 'asc' | 'desc' | undefined) => {
        switch (direction) {
          case undefined:
            updateParams({sortDirection: 'asc'})
            return 'asc';
          case 'asc':
            updateParams({sortDirection: 'desc'})
            return 'desc';
          case 'desc':
            setSortedColumn(undefined);
            deleteParams(['sortBy', 'sortDirection'])
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

  const onPageSelect = (page: number) => {
    updateParams({page})
    setCurrentPage(page)
  }

  const onPageSizeSelect = (pageSize: number) => {
    updateParams({pageSize})
    setPageSize(pageSize)
    setCurrentPage(1)
  }

  return {
    isDataLoaded,
    isDataContainingRecords,
    tableData,
    totalPages,
    currentPage,
    onPageSelect,
    pageSize,
    onPageSizeSelect,
    onSort,
    sortedColumn,
    sortDirection,
    setSearchText,
    onRowSelect,
    selectedRows
  };
};
