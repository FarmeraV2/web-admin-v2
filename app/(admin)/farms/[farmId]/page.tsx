import Link from "next/link";
import { notFound } from "next/navigation";
import { getFarmDetail, getFarmCertificates } from "@/lib/services/farms";
import { StatusBadge } from "@/components/ui/status-badge";
import { ApprovePanel } from "@/components/farms/approve-panel";
import { HiArrowLeft, HiOutlineUser, HiOutlineMapPin, HiOutlinePhone, HiOutlineEnvelope, HiOutlineDocumentText } from "react-icons/hi2";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ farmId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { farmId } = await params;
  return { title: `Farm #${farmId} | Farmera Admin` };
}

export default async function FarmDetailPage({ params }: PageProps) {
  const { farmId } = await params;

  const [farmRes, certRes] = await Promise.all([
    getFarmDetail(farmId).catch(() => null),
    getFarmCertificates(farmId).catch(() => null),
  ]);

  if (!farmRes) notFound();

  const farm = farmRes.data;
  const certificates = certRes?.data ?? [];

  const ownerName = [farm.owner.first_name, farm.owner.last_name]
    .filter(Boolean)
    .join(" ");

  const addressLine = [
    farm.address?.street,
    farm.address?.ward?.name,
    farm.address?.province?.name,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="p-8 max-w-5xl">
      {/* Back link */}
      <Link
        href="/farms"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <HiArrowLeft className="w-4 h-4" />
        Back to Farm Management
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        {farm.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={farm.avatar_url}
            alt={farm.farm_name}
            className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-gray-200"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-green-700">
              {farm.farm_name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">{farm.farm_name}</h1>
            <StatusBadge status={farm.status} />
          </div>
          {farm.description && (
            <p className="text-sm text-gray-500 mt-1">{farm.description}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            ID: {farm.farm_id} · Registered {formatDate(farm.created)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: farm info + certificates */}
        <div className="lg:col-span-2 space-y-6">
          {/* Farm Details */}
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Farm Information
            </h2>
            <dl className="space-y-3">
              <InfoRow
                icon={<HiOutlinePhone className="w-4 h-4" />}
                label="Phone"
                value={farm.phone || "—"}
              />
              <InfoRow
                icon={<HiOutlineEnvelope className="w-4 h-4" />}
                label="Email"
                value={farm.email || "—"}
              />
              <InfoRow
                icon={<HiOutlineDocumentText className="w-4 h-4" />}
                label="Tax Number"
                value={farm.tax_number || "—"}
              />
              <InfoRow
                icon={<HiOutlineMapPin className="w-4 h-4" />}
                label="Address"
                value={addressLine || "—"}
              />
              {farm.farm_size && (
                <InfoRow label="Farm Size" value={`${farm.farm_size} ha`} />
              )}
              {farm.establish && (
                <InfoRow label="Established" value={String(farm.establish)} />
              )}
              {farm.transparency_score && (
                <InfoRow
                  label="Transparency Score"
                  value={`${(farm.transparency_score.total * 100).toFixed(1)}%`}
                />
              )}
            </dl>
          </section>

          {/* Farm images */}
          {farm.profile_image_urls && farm.profile_image_urls.length > 0 && (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                Farm Images
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {farm.profile_image_urls.map((url, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={url}
                    alt={`${farm.farm_name} image ${i + 1}`}
                    className="w-full aspect-square object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Certificates */}
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Certificates
              <span className="ml-2 text-xs font-normal text-gray-400">
                ({certificates.length})
              </span>
            </h2>
            {certificates.length === 0 ? (
              <p className="text-sm text-gray-400">No certificates uploaded.</p>
            ) : (
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCertType(cert.type)}
                        </span>
                        <StatusBadge status={cert.status} />
                      </div>
                      {cert.issuer && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          Issuer: {cert.issuer}
                        </p>
                      )}
                      {cert.valid_until && (
                        <p className="text-xs text-gray-500">
                          Valid until: {formatDate(cert.valid_until)}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">
                        Uploaded {formatDate(cert.created)}
                      </p>
                    </div>
                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-green-700 hover:text-green-900 hover:underline flex-shrink-0"
                      >
                        View
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right column: owner + approval */}
        <div className="space-y-6">
          {/* Owner card */}
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Farm Owner
            </h2>
            <div className="flex items-center gap-3 mb-3">
              {farm.owner.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={farm.owner.avatar}
                  alt={ownerName}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <HiOutlineUser className="w-5 h-5 text-blue-500" />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {ownerName || "—"}
                </p>
                <p className="text-xs text-gray-500">{farm.owner.role}</p>
              </div>
            </div>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-xs text-gray-400">Email</dt>
                <dd className="text-gray-700">{farm.owner.email}</dd>
              </div>
            </dl>
            <Link
              href={`/users/${farm.owner.id}`}
              className="mt-4 inline-block text-xs font-medium text-green-700 hover:text-green-900 hover:underline"
            >
              View user profile →
            </Link>
          </section>

          {/* Approval panel */}
          <ApprovePanel farmId={farm.id} currentStatus={farm.status} />
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
      {icon && <span className="text-gray-400 mt-0.5 flex-shrink-0">{icon}</span>}
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

function formatCertType(type: string) {
  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
