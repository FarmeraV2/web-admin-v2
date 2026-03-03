interface FarmDetailPageProps {
  params: Promise<{ farmId: string }>;
}

export default async function FarmDetailPage({ params }: FarmDetailPageProps) {
  const { farmId } = await params;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900">Farm Detail</h1>
      <p className="text-gray-500 mt-1">Farm ID: {farmId}</p>
    </div>
  );
}
