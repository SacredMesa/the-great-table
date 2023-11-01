export default function Pagination({totalPages, setCurrentPage, currentPage, pageSize, setPageSize}: {
  totalPages: number;
  setCurrentPage: (page: number) => void;
  currentPage: number;
  pageSize: number
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
        value={pageSize}
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
