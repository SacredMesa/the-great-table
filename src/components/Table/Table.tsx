import {TableColumn} from '../../models/Table.ts';
import {useTableEffect} from './effects/useTableEffect.tsx';
import _ from 'lodash';
import Pagination from "./Pagination.tsx";

type PropsInterface<RecordType> = {
  columns: TableColumn<RecordType>[];
  data: RecordType[] | undefined;
  rowKey: string;
  selectRows?: (rows: RecordType[]) => void;
};

export default function Table<T>(props: PropsInterface<T>) {
  const {columns, data, rowKey, selectRows} = props;

  const {
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
  } = useTableEffect(columns, data, selectRows);

  return (
    <div>
      <input
        type="search"
        id="default-search"
        className="block w-[40%] mb-2 p-4 text-sm border border-gray-300 rounded-lg"
        placeholder="Search ..."
        onChange={(e) => {
          onPageSelect(1);
          setSearchText(e.target.value);
        }}
      />
      <div className="overflow-scroll max-h-[80%]">
        <table className="shadow-lg bg-white">
          <thead>
          <tr>
            {selectRows && <th className="sticky top-0 bg-blue-100 border text-left px-4 py-2"/>}
            {columns.map((col, i) => {
              return (
                <th
                  className="sticky top-0 bg-blue-100 border text-left px-4 py-2"
                  key={i}
                  onClick={() => onSort(col)}>
                  {col.title}
                  {sortDirection && sortedColumn?.title === col.title && (sortDirection === 'asc' ? '▲' : '▼')}
                </th>
              );
            })}
          </tr>
          </thead>
          <tbody className="overflow-y-auto">
          {isDataLoaded &&
            isDataContainingRecords &&
            tableData.map((item, i) => {
              return (
                <tr key={`row-${i}`}>
                  {selectRows && (
                    <td className="border px-4 py-4">
                      <input
                        checked={_.includes(selectedRows, item)}
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                        onChange={(e) => onRowSelect(e.target.checked, item)}
                      />
                    </td>
                  )}
                  {columns.map((col) => {
                    return (
                      <td className="border px-4 py-4" key={`${col.dataIndex}-${item[rowKey as keyof T]}`}>
                        {`${item[col.dataIndex]}` || ''}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          {isDataLoaded && !isDataContainingRecords && (
            <td rowSpan={columns.length} className="px-4 py-4">
              No Data
            </td>
          )}
          {!isDataLoaded && (
            <tr className="flex justify-center animate-pulse space-x-4">
              <td rowSpan={columns.length} className="px-4 py-4">
                Loading...
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>

      {isDataLoaded && (
        <Pagination
          totalPages={totalPages}
          setCurrentPage={onPageSelect}
          currentPage={currentPage}
          pageSize={pageSize}
          setPageSize={onPageSizeSelect}
        />
      )}
    </div>
  );
}
