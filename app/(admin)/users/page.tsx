import Link from "next/link";
import { listUsers } from "@/lib/services/users";
import { UserRole } from "@/lib/types/auth";
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
import { HiOutlineUsers } from "react-icons/hi2";

interface PageProps {
  searchParams: Promise<{ page?: string; role?: string; search?: string }>;
}

export const metadata = { title: "User Management | Farmera Admin" };

const ROLE_FILTERS: { value: string; label: string }[] = [
  { value: "", label: "All Roles" },
  { value: "FARMER", label: "Farmers" },
  { value: "BUYER", label: "Buyers" },
  { value: "AUDITOR", label: "Auditors" },
  { value: "ADMIN", label: "Admins" },
];

const ROLE_BADGE: Record<string, { label: string; variant: "success" | "info" | "warning" | "neutral" | "error" }> = {
  FARMER: { label: "Farmer", variant: "success" },
  BUYER: { label: "Buyer", variant: "info" },
  AUDITOR: { label: "Auditor", variant: "warning" },
  ADMIN: { label: "Admin", variant: "error" },
};

export default async function UsersPage({ searchParams }: PageProps) {
  const { page: pageParam, role: roleParam, search: searchParam } = await searchParams;

  const page = Math.max(1, parseInt(pageParam ?? "1", 10));
  const limit = 20;
  const role = (roleParam as UserRole | undefined) || undefined;
  const search = searchParam?.trim() || undefined;

  const res = await listUsers({ page, limit, role, search });
  const { data: items, pagination } = res.data;

  const currentRole = roleParam ?? "";

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-500 mt-1 text-sm">
          View and manage all platform users.
        </p>
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-3 flex-wrap mb-4">
        {/* Role filter tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {ROLE_FILTERS.map((opt) => (
            <Link
              key={opt.value}
              href={`/users?role=${opt.value}&page=1${search ? `&search=${encodeURIComponent(search)}` : ""}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${currentRole === opt.value
                  ? "bg-green-100 text-green-700"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>

        {/* Search form */}
        <form method="GET" action="/users" className="ml-auto flex items-center gap-2">
          {role && <input type="hidden" name="role" value={role} />}
          <input type="hidden" name="page" value="1" />
          <input
            type="search"
            name="search"
            defaultValue={search}
            placeholder="Search by name or email..."
            className="w-56 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Search
          </button>
          {search && (
            <Link
              href={`/users?role=${currentRole}&page=1`}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
            >
              Clear
            </Link>
          )}
        </form>

        <span className="text-sm text-gray-400 whitespace-nowrap">
          {pagination.totalItems} users
        </span>
      </div>

      {/* Table */}
      {items.length === 0 ? (
        <EmptyState
          icon={<HiOutlineUsers className="w-12 h-12" />}
          title="No users found"
          description={
            search
              ? `No users match "${search}".`
              : "No users match the current filter."
          }
        />
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <Th>User</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th></Th>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((user) => {
                const fullName = [user.first_name, user.last_name]
                  .filter(Boolean)
                  .join(" ");
                const roleBadge = ROLE_BADGE[user.role];
                return (
                  <TableRow key={user.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={user.avatar}
                            alt={fullName}
                            className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-gray-200"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-blue-700">
                              {(fullName || user.email).charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {fullName || "—"}
                          </p>
                          <p className="text-xs text-gray-400 capitalize">
                            {user.gender?.toLowerCase() ?? ""}
                          </p>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <span className="text-sm text-gray-700">{user.email}</span>
                    </Td>
                    <Td>
                      {roleBadge ? (
                        <Badge variant={roleBadge.variant}>{roleBadge.label}</Badge>
                      ) : (
                        <span className="text-sm text-gray-500">{user.role}</span>
                      )}
                    </Td>
                    <Td>
                      <Link
                        href={`/users/${user.id}`}
                        className="text-sm font-medium text-green-700 hover:text-green-900 hover:underline"
                      >
                        View →
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
            basePath="/users"
            searchParams={{
              role: currentRole,
              ...(search ? { search } : {}),
            }}
          />
        </>
      )}
    </div>
  );
}
