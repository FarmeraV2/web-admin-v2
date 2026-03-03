interface OrderDetailPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderId } = await params;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900">Order Detail</h1>
      <p className="text-gray-500 mt-1">Order ID: {orderId}</p>
    </div>
  );
}
