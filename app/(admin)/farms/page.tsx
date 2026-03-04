import Link from "next/link";
import { listFarms } from "@/lib/services/farms";
import { FarmStatus } from "@/lib/types/farm";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  Th,
  Td,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

interface PageProps {
  searchParams: Promise<{ page?: string; status?: string }>;
}

export const metadata = { title: "Farm Management | Farmera Admin" };

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "", label: "All" },
  { value: "PENDING_APPROVE", label: "Pending Approval" },
  { value: "APPROVED", label: "Approved" },
  { value: "VERIFIED", label: "Verified" },
  { value: "REJECTED", label: "Rejected" },
  { value: "BLOCKED", label: "Blocked" },
];

export default async function FarmsPage({ searchParams }: PageProps) {
  const { page: pageParam, status: statusParam } = await searchParams;

  const page = Math.max(1, parseInt(pageParam ?? "1", 10));
  const limit = 20;
  const status = (statusParam as FarmStatus | undefined) || undefined;

  const res = await listFarms({ page, limit, status });
  const { data: items, pagination } = res.data;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Farm Management</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Review and approve farm registrations.
        </p>
      </div>

      {/* Status filters */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        {STATUS_FILTERS.map((opt) => (
          <Link
            key={opt.value}
            href={`/farms?status=${opt.value}&page=1`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              (statusParam ?? "") === opt.value
                ? "bg-green-100 text-green-700"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {opt.label}
          </Link>
        ))}
        <span className="ml-auto text-sm text-gray-400">
          {pagination.totalItems} farms
        </span>
      </div>

      {/* Table */}
      {items.length === 0 ? (
        <EmptyState
          icon={<HiOutlineBuildingOffice2 className="w-12 h-12" />}
          title="No farms found"
          description="No farms match the current filter."
        />
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <Th>Farm</Th>
                <Th>Status</Th>
                <Th>Registered</Th>
                <Th></Th>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((farm) => (
                <TableRow key={farm.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      {farm.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={farm.avatar_url}
                          alt={farm.farm_name}
                          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-green-700">
                            {farm.farm_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {farm.farm_name}
                        </p>
                        {farm.description && (
                          <p className="text-xs text-gray-400 truncate max-w-xs">
                            {farm.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <StatusBadge status={farm.status} />
                  </Td>
                  <Td>{formatDate(farm.created)}</Td>
                  <Td>
                    <Link
                      href={`/farms/${farm.id}`}
                      className="text-sm font-medium text-green-700 hover:text-green-900 hover:underline"
                    >
                      View →
                    </Link>
                  </Td>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            page={pagination.page}
            total={pagination.totalItems}
            limit={pagination.limit}
            basePath="/farms"
            searchParams={{ status: statusParam ?? "" }}
          />
        </>
      )}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
