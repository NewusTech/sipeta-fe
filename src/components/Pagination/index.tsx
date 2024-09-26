import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
};

export const Pagination = ({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      // Tampilkan semua halaman jika total halaman <= 5
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`px-3 py-1 border rounded-md ${
              i === page
                ? "bg-primaryy text-white font-bold"
                : "hover:bg-gray-400"
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      // Jika total halaman > 5, gunakan ellipsis
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className={`px-3 py-1 border rounded-md ${
            page === 1
              ? "bg-primaryy text-white font-bold"
              : "hover:bg-gray-400"
          }`}
        >
          1
        </button>
      );

      if (page > 3) {
        pages.push(
          <span key="dots-left" className="px-3 py-1">
            ...
          </span>
        );
      }

      // Tampilkan 3 halaman di sekitar halaman yang aktif
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`px-3 py-1 border rounded-md ${
              i === page
                ? "bg-prmaryy text-white font-bold"
                : "hover:bg-gray-400"
            }`}
          >
            {i}
          </button>
        );
      }

      if (page < totalPages - 2) {
        pages.push(
          <span key="dots-right" className="px-3 py-1">
            ...
          </span>
        );
      }

      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`px-3 py-1 border rounded-md ${
            page === totalPages
              ? "bg-primaryy text-white font-bold"
              : "hover:bg-gray-400"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex justify-center space-x-2 mt-6">
      <button
        onClick={handlePrev}
        disabled={page === 1}
        className={`px-3 py-1 border rounded-md ${
          page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400"
        }`}
      >
        <ChevronLeftIcon className="h-4 w-4 text-primaryy" />
      </button>

      {renderPageNumbers()}

      <button
        onClick={handleNext}
        disabled={page === totalPages}
        className={`px-3 py-1 border rounded-md ${
          page === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-400"
        }`}
      >
        <ChevronRightIcon className="h-4 w-4 text-primaryy" />
      </button>
    </div>
  );
};
