import Link from "next/link";
import { listVerifications, VerificationStatusFilter } from "@/lib/services/verification";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  Th,
  Td,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";

interface PageProps {
  searchParams: Promise<{ page?: string; status?: string }>;
}

export const metadata = { title: "Verification Queue | Farmera Admin" };

export default async function VerificationQueuePage({ searchParams }: PageProps) {
  const { page: pageParam, status: statusParam } = await searchParams;

  const page = Math.max(1, parseInt(pageParam ?? "1", 10));
  const limit = 20;
  const status = (statusParam as VerificationStatusFilter | undefined) ?? "pending";

  const res = await listVerifications({ page, limit, status });
  const { data: items, pagination } = res.data;

  const statusOptions: { value: VerificationStatusFilter; label: string }[] = [
    { value: "pending", label: "Pending" },
    { value: "voted", label: "Voted" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Verification Queue</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Diary log entries assigned to you for blockchain verification.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        {statusOptions.map((opt) => (
          <Link
            key={opt.value}
            href={`/verification?status=${opt.value}&page=1`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              status === opt.value
                ? "bg-green-100 text-green-700"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {opt.label}
          </Link>
        ))}
        <span className="ml-auto text-sm text-gray-400">
          {pagination.totalItems} total
        </span>
      </div>

      {/* Table */}
      {items.length === 0 ? (
        <EmptyState
          icon={<HiOutlineClipboardDocumentCheck className="w-12 h-12" />}
          title="No items to review"
          description={
            status === "pending"
              ? "You have no pending verifications assigned to you."
              : "No voted verifications found."
          }
        />
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <Th>ID</Th>
                <Th>Type</Th>
                <Th>Log ID</Th>
                <Th>Assigned</Th>
                <Th>Deadline</Th>
                <Th>Status</Th>
                <Th className="text-right">Action</Th>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => {
                const isPending = item.voted_at === null;
                const isOverdue = !isPending && new Date(item.deadline) < new Date();

                return (
                  <TableRow key={item.id}>
                    <Td className="font-mono text-xs text-gray-500">#{item.id}</Td>
                    <Td>
                      <Badge variant="info" className="uppercase">
                        {item.type}
                      </Badge>
                    </Td>
                    <Td className="font-mono text-xs">#{item.log_id}</Td>
                    <Td>{formatDate(item.assigned_at)}</Td>
                    <Td>
                      <span className={isOverdue ? "text-red-600 font-medium" : ""}>
                        {formatDate(item.deadline)}
                      </span>
                    </Td>
                    <Td>
                      {isPending ? (
                        <Badge variant="warning">Pending</Badge>
                      ) : (
                        <Badge variant="success">Voted</Badge>
                      )}
                    </Td>
                    <Td className="text-right">
                      <Link
                        href={`/verification/${item.id}`}
                        className="text-sm font-medium text-green-700 hover:text-green-900 hover:underline"
                      >
                        {isPending ? "Review →" : "View →"}
                      </Link>
                    </Td>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <Pagination
            page={pagination.page}
            total={pagination.totalItems}
            limit={pagination.limit}
            basePath="/verification"
            searchParams={{ status }}
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
