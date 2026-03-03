interface ProductDetailPageProps {
  params: Promise<{ productId: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { productId } = await params;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900">Product Detail</h1>
      <p className="text-gray-500 mt-1">Product ID: {productId}</p>
    </div>
  );
}
