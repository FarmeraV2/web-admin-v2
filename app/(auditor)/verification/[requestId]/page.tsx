import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getVerificationPackage,
  listVerifications,
} from "@/lib/services/verification";
import { Badge } from "@/components/ui/badge";
import { VotePanel } from "@/components/verification/vote-panel";
import {
  HiArrowLeft,
  HiMapPin,
  HiCube,
  HiCheckBadge,
  HiXCircle,
  HiExclamationTriangle,
} from "react-icons/hi2";

interface PageProps {
  params: Promise<{ requestId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { requestId } = await params;
  return { title: `Verification #${requestId} | Farmera Admin` };
}

export default async function VerificationDetailPage({ params }: PageProps) {
  const { requestId } = await params;
  const id = parseInt(requestId, 10);
  if (isNaN(id)) notFound();

  let pkg;
  try {
    const res = await getVerificationPackage(id);
    pkg = res.data;
  } catch {
    notFound();
  }

  // Fetch the assignment record to get voted_at / vote_transaction_hash
  let assignment;
  try {
    const listRes = await listVerifications({ limit: 100 });
    assignment = listRes.data.data.find((a) => a.id === id);
    // Also check voted items if not found in default (pending) list
    if (!assignment) {
      const votedRes = await listVerifications({ limit: 100, status: "voted" });
      assignment = votedRes.data.data.find((a) => a.id === id);
    }
  } catch {
    // non-critical
  }

  const alreadyVoted = assignment?.voted_at != null;
  const hashMatch =
    pkg.hash.on_chainHash && pkg.hash.current_hash
      ? pkg.hash.on_chainHash === pkg.hash.current_hash
      : null;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Back */}
      <Link
        href="/verification"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <HiArrowLeft className="w-4 h-4" />
        Back to queue
      </Link>

      {/* Page title */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Verification #{pkg.id}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Deadline:{" "}
            <span className="font-medium text-gray-700">
              {formatDateTime(pkg.deadline)}
            </span>
          </p>
        </div>
        {alreadyVoted ? (
          <Badge variant="success" className="text-sm px-3 py-1">
            Voted
          </Badge>
        ) : (
          <Badge variant="warning" className="text-sm px-3 py-1">
            Pending
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left column (2/3) */}
        <div className="col-span-2 space-y-6">
          {/* Farm info */}
          <Section title="Farm">
            <div className="flex items-center gap-3">
              {pkg.farm.avatar_url ? (
                <Image
                  src={pkg.farm.avatar_url}
                  alt={pkg.farm.farm_name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  unoptimized
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-700 font-bold text-lg">
                    {pkg.farm.farm_name[0]}
                  </span>
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900">{pkg.farm.farm_name}</p>
                <p className="text-xs text-gray-500">{pkg.farm.email}</p>
                <Badge variant="success" className="mt-1">
                  {pkg.farm.status}
                </Badge>
              </div>
            </div>
          </Section>

          {/* Log entry */}
          <Section title="Log Entry">
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Name
                </p>
                <p className="text-sm text-gray-900 font-medium">{pkg.log.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Description
                </p>
                <p className="text-sm text-gray-700">{pkg.log.description}</p>
              </div>
              {pkg.log.notes && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Notes
                  </p>
                  <p className="text-sm text-gray-700">{pkg.log.notes}</p>
                </div>
              )}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Created: {formatDateTime(pkg.log.created)}</span>
                {pkg.log.location && (
                  <span className="inline-flex items-center gap-1">
                    <HiMapPin className="w-3.5 h-3.5" />
                    {pkg.log.location.lat.toFixed(5)},{" "}
                    {pkg.log.location.lng.toFixed(5)}
                  </span>
                )}
              </div>
            </div>
          </Section>

          {/* Images */}
          {pkg.log.image_urls.length > 0 && (
            <Section title={`Images (${pkg.log.image_urls.length})`}>
              <div className="grid grid-cols-3 gap-2">
                {pkg.log.image_urls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noreferrer">
                    <Image
                      src={url}
                      alt={`Log image ${i + 1}`}
                      width={200}
                      height={150}
                      className="w-full h-36 object-cover rounded-lg border border-gray-200 hover:opacity-90 transition-opacity"
                      unoptimized
                    />
                  </a>
                ))}
              </div>
            </Section>
          )}

          {/* Videos */}
          {pkg.log.video_urls.length > 0 && (
            <Section title={`Videos (${pkg.log.video_urls.length})`}>
              <div className="space-y-1.5">
                {pkg.log.video_urls.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-sm text-blue-600 hover:underline truncate"
                  >
                    Video {i + 1}: {url}
                  </a>
                ))}
              </div>
            </Section>
          )}

          {/* AI Analysis */}
          {pkg.ai_analysis && (
            <Section title="AI Analysis">
              <div className="grid grid-cols-2 gap-4">
                <ScoreRow
                  label="Overall Score"
                  value={parseFloat(pkg.ai_analysis.overall_score)}
                />
                <ScoreRow
                  label="Manipulation Risk"
                  value={parseFloat(pkg.ai_analysis.manipulation_score)}
                  invert
                />
                <ScoreRow
                  label="Relevance"
                  value={parseFloat(pkg.ai_analysis.relevance_score)}
                />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Agricultural</p>
                  <Badge
                    variant={
                      pkg.ai_analysis.ai_analysis.is_agricultural
                        ? "success"
                        : "error"
                    }
                  >
                    {pkg.ai_analysis.ai_analysis.is_agricultural ? "Yes" : "No"}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Duplicate</p>
                  <Badge
                    variant={pkg.ai_analysis.is_duplicate ? "error" : "success"}
                  >
                    {pkg.ai_analysis.is_duplicate
                      ? "Duplicate detected"
                      : "Unique"}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Web/Stock Image</p>
                  <Badge
                    variant={
                      pkg.ai_analysis.ai_analysis.web_detection
                        .is_stock_or_web_image
                        ? "warning"
                        : "success"
                    }
                  >
                    {pkg.ai_analysis.ai_analysis.web_detection
                      .is_stock_or_web_image
                      ? "Possible"
                      : "No"}
                  </Badge>
                </div>
              </div>
            </Section>
          )}
        </div>

        {/* Right column (1/3) */}
        <div className="space-y-6">
          {/* Vote panel */}
          <VotePanel
            requestId={pkg.id}
            logId={pkg.log.id}
            alreadyVoted={alreadyVoted}
            voteTransactionHash={assignment?.vote_transaction_hash ?? null}
          />

          {/* Hash integrity */}
          <Section title="Data Integrity">
            <div className="space-y-3">
              {hashMatch === null ? (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <HiExclamationTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  On-chain hash unavailable
                </div>
              ) : hashMatch ? (
                <div className="flex items-center gap-2 text-xs text-green-700">
                  <HiCheckBadge className="w-4 h-4 flex-shrink-0" />
                  Hashes match — data intact
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-red-700">
                  <HiXCircle className="w-4 h-4 flex-shrink-0" />
                  Hash mismatch — data may be altered
                </div>
              )}
              <HashLine label="On-chain" value={pkg.hash.on_chainHash} />
              <HashLine label="Current" value={pkg.hash.current_hash} />
            </div>
          </Section>

          {/* Log on-chain hash */}
          {pkg.log.transaction_hash && (
            <Section title="Log Tx Hash">
              <p className="font-mono text-xs text-gray-600 break-all">
                {pkg.log.transaction_hash}
              </p>
            </Section>
          )}

          {/* Quick facts */}
          <Section title="Details">
            <dl className="space-y-1.5 text-xs">
              <Row label="Log ID" value={`#${pkg.log.id}`} />
              <Row label="Season Detail" value={`#${pkg.log.season_detail_id}`} />
              <Row
                label="Log Status"
                value={
                  <span className="inline-flex items-center gap-1">
                    <HiCube className="w-3 h-3" />
                    {pkg.log.verified ? "Verified" : "Unverified"}
                  </span>
                }
              />
            </dl>
          </Section>
        </div>
      </div>
    </div>
  );
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
        {title}
      </p>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-gray-400 shrink-0">{label}</dt>
      <dd className="text-gray-700 font-medium text-right">{value}</dd>
    </div>
  );
}

function HashLine({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      {value ? (
        <p className="font-mono text-xs text-gray-600 break-all">{value}</p>
      ) : (
        <p className="text-xs italic text-gray-400">—</p>
      )}
    </div>
  );
}

function ScoreRow({
  label,
  value,
  invert = false,
}: {
  label: string;
  value: number;
  invert?: boolean;
}) {
  const pct = Math.min(100, Math.round(value * 100));
  const good = invert ? value < 0.5 : value >= 0.5;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-500">{label}</span>
        <span className={good ? "text-green-700" : "text-red-600"}>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100">
        <div
          className={`h-1.5 rounded-full ${good ? "bg-green-500" : "bg-red-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
