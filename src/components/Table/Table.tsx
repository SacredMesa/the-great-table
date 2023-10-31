import { TableColumn } from '../../models/Table.ts';
import { useTableEffect } from './useTableEffect.tsx';
import _ from 'lodash';

type PropsInterface<RecordType> = {
  columns: TableColumn<RecordType>[];
  data: RecordType[] | undefined;
  rowKey: string;
  selectRows?: (rows: RecordType[]) => void;
};

export default function Table<T>(props: PropsInterface<T>) {
  const { columns, data, rowKey, selectRows } = props;

  const {
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
  } = useTableEffect(columns, data, selectRows);

  return (
    <div>
      <input
        type="search"
        id="default-search"
        className="block w-[40%] mb-2 p-4 text-sm border border-gray-300 rounded-lg"
        placeholder="Search ..."
        onChange={(e) => {
          setCurrentPage(1);
          setSearchText(e.target.value);
        }}
      />
      <div className="overflow-scroll max-h-[80%]">
        <table className="shadow-lg bg-white">
          <thead>
            <tr>
              {selectRows && <th className="sticky top-0 bg-blue-100 border text-left px-4 py-2" />}
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
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          setPageSize={setPageSize}
        />
      )}
    </div>
  );
}

function Pagination({
  totalPages,
  setCurrentPage,
  currentPage,
  setPageSize
}: {
  totalPages: number;
  setCurrentPage: (page: number) => void;
  currentPage: number;
  setPageSize: (size: number) => void;
}) {
  const pageNumberList = [...Array(totalPages).keys()].map((_, i) => i + 1);

  const isCurrentPageSelected = (buttonNumber: number) => buttonNumber === currentPage;

  return (
    <div>
      <ul className="inline-flex -space-x-px text-sm my-3">
        <li>
          <button
            className="flex items-center justify-center px-3 h-8 ml-0 leading-tight bg-white border border-gray-300 rounded-l-lg hover:bg-gray-300"
            onClick={() => {
              if (currentPage !== 1) setCurrentPage(currentPage - 1);
            }}>
            Previous
          </button>
        </li>
        {pageNumberList.map((pageIndex) => (
          <li key={`page-button-${pageIndex}`}>
            <button
              className={`
              ${isCurrentPageSelected(pageIndex) && 'font-bold bg-gray-300'} 
              flex items-center justify-center px-3 h-8 leading-tight bg-white border border-gray-300 hover:bg-gray-300`}
              onClick={() => setCurrentPage(pageIndex)}>
              {pageIndex}
            </button>
          </li>
        ))}
        <li>
          <button
            className="flex items-center justify-center px-3 h-8 ml-0 leading-tight bg-white border border-gray-300 rounded-r-lg hover:bg-gray-300"
            onClick={() => {
              if (currentPage !== totalPages) setCurrentPage(currentPage + 1);
            }}>
            Next
          </button>
        </li>
      </ul>

      <label className="ml-2">Rows per page: </label>
      <select
        className="px-3 h-8 border border-gray-300 rounded"
        onChange={(e) => setPageSize(parseInt(e.target.value))}>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    </div>
  );
}
