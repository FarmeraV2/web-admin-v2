import { listCrops } from "@/lib/services/config";
import { CropStepManager } from "@/components/crops/crop-step-manager";

interface Props {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export const metadata = { title: "Crop & Step Management — Farmera Admin" };

export default async function CropStepsPage({ searchParams }: Props) {
  const { page: pageStr, limit: limitStr } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);
  const limit = Number(limitStr) || 10;

  const res = await listCrops({ page, limit });
  const crops = res.data.data;
  const totalCrops = res.data.pagination.totalItems;

  return (
    <div className="p-8 flex flex-col gap-6 h-full">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Crop & Step Management</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Define crop templates and their production process steps.
        </p>
      </div>
      <CropStepManager
        crops={crops}
        totalCrops={totalCrops}
        page={page}
        limit={limit}
      />
    </div>
  );
}
