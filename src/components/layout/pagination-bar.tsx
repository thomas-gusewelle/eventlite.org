import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { BiChevronsLeft, BiChevronsRight } from "react-icons/bi";
import { PaginateData } from "../../../types/paginate";
import { paginate } from "../../utils/paginate";

export const PaginationBar: React.FC<{
  setPageNum: Dispatch<SetStateAction<number>>;
  pageNum: number;
  paginateData: PaginateData<any>;
}> = ({ setPageNum, pageNum, paginateData }) => {
  const [pageNums, setPageNums] = useState<PaginateData<number[]>>();
  const [pageRow, setPageRow] = useState(1);

  useEffect(() => {
    //this creates a temp array with each available page in the array
    let tempArr: number[] = [];
    for (let i = 1; i <= paginateData.total_pages; i++) {
      tempArr.push(i);
    }

    // these paginate the avaliable pages and then find when the row of pages needs to be incremented
    let _paginate = paginate(tempArr, pageRow, 5);
    let firstPageInRow = _paginate.data[0];
    let lastElement = _paginate.data.slice(-1);
    let lastPageInRow = lastElement[0];

    if (lastPageInRow != undefined) {
      if (pageNum > lastPageInRow) {
        setPageRow(pageRow + 1);
      }
    }
    if (firstPageInRow) {
      if (pageNum < firstPageInRow && pageRow != 1) {
        setPageRow(pageRow - 1);
      }
    }
    // finally we set the pages to be displayed
    setPageNums(_paginate);
  }, [pageNum, pageRow, paginateData.total_pages]);

  const pageUp = () => {
    if (pageNum == paginateData.total_pages) return;
    setPageNum(pageNum + 1);
    window.scroll(0, 0)
  };

  const pageDown = () => {
    if (pageNum == 1) return;
    setPageNum(pageNum - 1);
    window.scroll(0, 0)
  };

  const rowUp = () => {
    if (pageRow == pageNums?.total_pages) return;
    setPageNum(5 * pageRow + 1);
    window.scrollTo(0, 0)
    // setPageRow(pageRow + 1);
  };
  const rowDown = () => {
    if (pageRow == 1) return;
    setPageNum(5 * (pageRow - 1));
    window.scrollTo(0, 0)
  };

  if (pageNums == undefined || paginateData.total_pages < 1) {
    return <div></div>;
  }

  return (
    <div className='bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6'>
      <div className='flex-1 flex flex-col items-center gap-2 sm:flex-row sm:justify-between'>
        <div>
          <p className='text-sm text-gray-700'>
            Showing <span className='font-medium'>{pageNum} </span> of
            <span className='font-medium'> {paginateData.total_pages} </span>
            pages
          </p>
        </div>
        <div>
          <nav
            className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'
            aria-label='Pagination'>
            {pageNums.total_pages > 1 && (
              <button
                onClick={() => rowDown()}
                className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'>
                <span className='sr-only'>Previous Row</span>
                <BiChevronsLeft className='h-5 w-5' aria-hidden='true' />
              </button>
            )}
            <button
              onClick={() => pageDown()}
              className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${pageNums.total_pages == 1 && "rounded-l-md"
                }`}>
              <span className='sr-only'>Previous Page</span>
              <MdChevronLeft className='h-5 w-5' aria-hidden='true' />
            </button>
            {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}
            {pageNums?.data.map((page) => (
              <button
                key={page}
                onClick={() => {
                  setPageNum(page)
                  window.scrollTo({ top: 0 });
                }}
                className={`${pageNum == page
                  ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  } relative inline-flex items-center px-4 py-2 border text-sm font-medium`}>
                {page}
              </button>
            ))}
            <button
              onClick={() => pageUp()}
              className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${pageNums.total_pages == 1 && "rounded-r-md"
                }`}>
              <span className='sr-only'>Next Page</span>
              <MdChevronRight className='h-5 w-5' aria-hidden='true' />
            </button>
            {pageNums.total_pages > 1 && (
              <button
                onClick={() => rowUp()}
                className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'>
                <span className='sr-only'>Next Row</span>
                <BiChevronsRight className='h-5 w-5' aria-hidden='true' />
              </button>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};
