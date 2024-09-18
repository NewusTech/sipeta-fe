import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-end p-2">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-primaryy">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px] text-primaryy">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 25, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4 text-primaryy" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4 text-primaryy" />
          </Button>
          {table.getPageCount() > 2 ? (
            <>
              {/* Button untuk halaman pertama */}
              <Button
                variant={
                  table.getState().pagination.pageIndex === 0
                    ? "default"
                    : "outline"
                }
                className={`${
                  table.getState().pagination.pageIndex === 0
                    ? "bg-primaryy"
                    : "text-primaryy"
                } transition-colors duration-300 ease-in-out h-8 w-8 p-0`}
                onClick={() => table.setPageIndex(0)}
              >
                1
              </Button>

              {/* Jika current page lebih besar dari 2, tampilkan ... */}
              {table.getState().pagination.pageIndex > 1 && (
                <Button variant="outline" className="h-8 w-8 p-0">
                  ...
                </Button>
              )}

              {/* Button untuk halaman current page */}
              {table.getState().pagination.pageIndex > 0 &&
                table.getState().pagination.pageIndex <
                  table.getPageCount() - 1 && (
                  <Button
                    variant="default"
                    className="bg-primaryy transition-colors duration-300 ease-in-out h-8 w-8 p-0"
                  >
                    {table.getState().pagination.pageIndex + 1}
                  </Button>
                )}

              {/* Jika current page bukan halaman terakhir, tampilkan ... */}
              {table.getState().pagination.pageIndex <
                table.getPageCount() - 2 && (
                <Button variant="outline" className="h-8 w-8 p-0">
                  ...
                </Button>
              )}

              {/* Button untuk halaman terakhir */}
              <Button
                variant={
                  table.getState().pagination.pageIndex ===
                  table.getPageCount() - 1
                    ? "default"
                    : "outline"
                }
                className={`${
                  table.getState().pagination.pageIndex ===
                  table.getPageCount() - 1
                    ? "bg-primaryy"
                    : "text-primaryy"
                } transition-colors duration-300 ease-in-out h-8 w-8 p-0`}
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              >
                {table.getPageCount()}
              </Button>
            </>
          ) : (
            Array(table.getPageCount())
              .fill(0)
              .map((_, pageIndex) => (
                <Button
                  key={pageIndex}
                  variant={
                    table.getState().pagination.pageIndex === pageIndex
                      ? "default"
                      : "outline"
                  }
                  className={`${
                    table.getState().pagination.pageIndex === pageIndex
                      ? "bg-primaryy"
                      : "text-primaryy"
                  } transition-colors duration-300 ease-in-out h-8 w-8 p-0`}
                  onClick={() => table.setPageIndex(pageIndex)}
                >
                  {pageIndex + 1}
                </Button>
              ))
          )}

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4 text-primaryy" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4 text-primaryy" />
          </Button>
        </div>
      </div>
    </div>
  );
}
