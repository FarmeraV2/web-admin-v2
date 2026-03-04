import Link from "next/link";
import { notFound } from "next/navigation";
import { getUserDetail } from "@/lib/services/users";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { StatusPanel } from "@/components/users/status-panel";
import {
  HiArrowLeft,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineStar,
} from "react-icons/hi2";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `User #${id} | Farmera Admin` };
}

const ROLE_BADGE: Record<string, { label: string; variant: "success" | "info" | "warning" | "neutral" | "error" }> = {
  FARMER: { label: "Farmer", variant: "success" },
  BUYER: { label: "Buyer", variant: "info" },
  AUDITOR: { label: "Auditor", variant: "warning" },
  ADMIN: { label: "Admin", variant: "error" },
};

export default async function UserDetailPage({ params }: PageProps) {
  const { id } = await params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) notFound();

  const userRes = await getUserDetail(userId).catch(() => null);
  if (!userRes) notFound();

  const user = userRes.data;
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
  const roleBadge = ROLE_BADGE[user.role];

  return (
    <div className="p-8 max-w-4xl">
      {/* Back link */}
      <Link
        href="/users"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <HiArrowLeft className="w-4 h-4" />
        Back to User Management
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        {user.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatar}
            alt={fullName}
            className="w-16 h-16 rounded-full object-cover flex-shrink-0 border border-gray-200"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <HiOutlineUser className="w-7 h-7 text-blue-500" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">
              {fullName || user.email}
            </h1>
            <StatusBadge status={user.status} />
            {roleBadge && (
              <Badge variant={roleBadge.variant}>{roleBadge.label}</Badge>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">{user.email}</p>
          <p className="text-xs text-gray-400 mt-1">
            ID: {user.id} · Joined {formatDate(user.created_at)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: profile details */}
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Profile Information
            </h2>
            <dl className="space-y-3">
              <InfoRow
                icon={<HiOutlineEnvelope className="w-4 h-4" />}
                label="Email"
                value={user.email}
              />
              <InfoRow
                icon={<HiOutlinePhone className="w-4 h-4" />}
                label="Phone"
                value={user.phone ?? "—"}
              />
              <InfoRow
                icon={<HiOutlineUser className="w-4 h-4" />}
                label="Gender"
                value={
                  user.gender === "MALE"
                    ? "Male"
                    : user.gender === "FEMALE"
                    ? "Female"
                    : "Not specified"
                }
              />
              {user.birthday && (
                <InfoRow
                  icon={<HiOutlineCalendar className="w-4 h-4" />}
                  label="Birthday"
                  value={formatDate(user.birthday)}
                />
              )}
              <InfoRow
                icon={<HiOutlineStar className="w-4 h-4" />}
                label="Points"
                value={String(user.points ?? 0)}
              />
              <InfoRow label="Last updated" value={formatDate(user.updated_at)} />
            </dl>
          </section>
        </div>

        {/* Right: status panel */}
        <div className="space-y-6">
          <StatusPanel userId={user.id} currentStatus={user.status} />
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      {icon && (
        <span className="text-gray-400 mt-0.5 flex-shrink-0">{icon}</span>
      )}
      <div className={icon ? "" : "ml-6"}>
        <dt className="text-xs text-gray-400">{label}</dt>
        <dd className="text-sm text-gray-900">{value}</dd>
      </div>
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
