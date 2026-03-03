interface VerificationDetailPageProps {
  params: Promise<{ requestId: string }>;
}

export default async function VerificationDetailPage({ params }: VerificationDetailPageProps) {
  const { requestId } = await params;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900">Verification Package</h1>
      <p className="text-gray-500 mt-1">Request ID: {requestId}</p>
    </div>
  );
}
