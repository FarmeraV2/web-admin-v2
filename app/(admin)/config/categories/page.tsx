import Link from "next/link";
import { listCategories, getCategoryWithSubs } from "@/lib/services/config";
import { CategoryTree } from "@/components/categories/category-tree";
import { EmptyState } from "@/components/ui/empty-state";
import { HiOutlineSquares2X2 } from "react-icons/hi2";

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export const metadata = { title: "Categories | Farmera Admin" };

const LIMIT = 20;

export default async function CategoriesPage({ searchParams }: PageProps) {
  const { page: pageParam, search: searchParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));
  const search = searchParam?.trim() || undefined;

  const res = await listCategories({ page, limit: LIMIT, search });
  const { data: items, pagination } = res.data;

  // Fetch subcategories for each category on the current page in parallel
  const categoriesWithSubs = await Promise.all(
    items.map(async (cat) => {
      try {
        const detail = await getCategoryWithSubs(cat.category_id);
        return detail.data;
      } catch {
        return cat;
      }
    })
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Manage product categories and subcategories used across the marketplace.
        </p>
      </div>

      {/* Search */}
      <form method="GET" action="/config/categories" className="flex items-center gap-2 mb-6">
        <input type="hidden" name="page" value="1" />
        <input
          type="search"
          name="search"
          defaultValue={search}
          placeholder="Search categories..."
          className="w-64 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
        >
          Search
        </button>
        {search && (
          <Link
            href="/config/categories?page=1"
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
          >
            Clear
          </Link>
        )}
      </form>

      {/* Content */}
      {categoriesWithSubs.length === 0 ? (
        <EmptyState
          icon={<HiOutlineSquares2X2 className="w-12 h-12" />}
          title="No categories found"
          description={
            search
              ? `No categories match "${search}".`
              : "No categories have been created yet."
          }
        />
      ) : (
        <CategoryTree categories={categoriesWithSubs} />
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
          <span>
            Page {pagination.page} of {pagination.totalPages} ({pagination.totalItems} total)
          </span>
          <div className="flex gap-2">
            {pagination.hasPreviousPage && (
              <Link
                href={`/config/categories?page=${page - 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Previous
              </Link>
            )}
            {pagination.hasNextPage && (
              <Link
                href={`/config/categories?page=${page + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
