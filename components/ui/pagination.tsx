import Link from "next/link";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  /** Base path — search params will be appended */
  basePath: string;
  /** Existing search params to preserve alongside page */
  searchParams?: Record<string, string>;
}

export function Pagination({ page, total, limit, basePath, searchParams = {} }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (totalPages <= 1) return null;

  const buildHref = (p: number) => {
    const params = new URLSearchParams({ ...searchParams, page: String(p) });
    return `${basePath}?${params}`;
  };

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
      <p className="text-sm text-gray-500">
        Page <span className="font-medium">{page}</span> of{" "}
        <span className="font-medium">{totalPages}</span>
        {" · "}
        <span className="font-medium">{total}</span> total
      </p>

      <div className="flex gap-1">
        <Link
          href={hasPrev ? buildHref(page - 1) : "#"}
          aria-disabled={!hasPrev}
          className={`inline-flex items-center rounded-lg p-1.5 text-sm transition-colors ${
            hasPrev
              ? "text-gray-600 hover:bg-gray-100"
              : "text-gray-300 pointer-events-none"
          }`}
        >
          <HiChevronLeft className="w-5 h-5" />
        </Link>

        <Link
          href={hasNext ? buildHref(page + 1) : "#"}
          aria-disabled={!hasNext}
          className={`inline-flex items-center rounded-lg p-1.5 text-sm transition-colors ${
            hasNext
              ? "text-gray-600 hover:bg-gray-100"
              : "text-gray-300 pointer-events-none"
          }`}
        >
          <HiChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
