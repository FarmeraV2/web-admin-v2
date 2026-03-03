interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900">User Detail</h1>
      <p className="text-gray-500 mt-1">User ID: {id}</p>
    </div>
  );
}
