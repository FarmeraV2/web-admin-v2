"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  HiPlus,
  HiChevronRight,
  HiOutlineBeaker,
  HiOutlineClipboardDocumentList,
} from "react-icons/hi2";
import { Crop, CropType, PublicStep, StepType } from "@/lib/types/crop";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { createCropAction, createStepAction, loadCropStepsAction } from "@/app/actions/config";

const STEP_TYPE_LABELS: Record<StepType, string> = {
  PREPARE: "Preparation",
  PLANTING: "Planting",
  CARE: "Care",
  HARVEST: "Harvest",
  POST_HARVEST: "Post-Harvest",
};

const STEP_TYPE_COLORS: Record<StepType, string> = {
  PREPARE: "bg-blue-100 text-blue-700",
  PLANTING: "bg-green-100 text-green-700",
  CARE: "bg-amber-100 text-amber-700",
  HARVEST: "bg-orange-100 text-orange-700",
  POST_HARVEST: "bg-purple-100 text-purple-700",
};

const CROP_TYPE_LABELS: Record<CropType, string> = {
  SHORT_TERM: "Short-term",
  LONG_TERM: "Long-term",
};

interface CropStepManagerProps {
  crops: Crop[];
  totalCrops: number;
  page: number;
  limit: number;
}

export function CropStepManager({
  crops,
  totalCrops,
  page,
  limit,
}: CropStepManagerProps) {
  const router = useRouter();
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [steps, setSteps] = useState<PublicStep[]>([]);
  const [loadingSteps, setLoadingSteps] = useState(false);
  const [showCreateCrop, setShowCreateCrop] = useState(false);
  const [showCreateStep, setShowCreateStep] = useState(false);
  const totalPages = Math.ceil(totalCrops / limit);

  async function handleSelectCrop(crop: Crop) {
    setSelectedCrop(crop);
    setLoadingSteps(true);
    try {
      const res = await loadCropStepsAction(crop.id);
      setSteps(res.steps ?? []);
    } finally {
      setLoadingSteps(false);
    }
  }

  function handlePage(newPage: number) {
    const params = new URLSearchParams();
    params.set("page", String(newPage));
    params.set("limit", String(limit));
    router.push(`/config/steps?${params}`);
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Left panel — Crops */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">{totalCrops} crops</p>
          <Button size="sm" onClick={() => setShowCreateCrop(true)} className="gap-1.5">
            <HiPlus className="w-4 h-4" />
            New Crop
          </Button>
        </div>

        <div className="space-y-1.5">
          {crops.map((crop) => (
            <button
              key={crop.id}
              onClick={() => handleSelectCrop(crop)}
              className={`w-full text-left rounded-xl border px-4 py-3 transition-all flex items-center gap-3 ${
                selectedCrop?.id === crop.id
                  ? "border-green-500 bg-green-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <HiOutlineBeaker className="w-4.5 h-4.5 text-green-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{crop.name}</p>
                <p className="text-xs text-gray-400">{CROP_TYPE_LABELS[crop.crop_type]}</p>
              </div>
              <HiChevronRight
                className={`w-4 h-4 flex-shrink-0 transition-colors ${
                  selectedCrop?.id === crop.id ? "text-green-600" : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1}
              onClick={() => handlePage(page - 1)}
            >
              Prev
            </Button>
            <span className="text-xs text-gray-500">
              {page} / {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => handlePage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Right panel — Steps */}
      <div className="flex-1 min-w-0">
        {!selectedCrop ? (
          <div className="h-64 flex flex-col items-center justify-center text-center rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
            <HiOutlineClipboardDocumentList className="w-10 h-10 mb-3 opacity-40" />
            <p className="font-medium text-sm">Select a crop to view its steps</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{selectedCrop.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {CROP_TYPE_LABELS[selectedCrop.crop_type]}
                  {selectedCrop.description ? ` · ${selectedCrop.description.slice(0, 60)}…` : ""}
                </p>
              </div>
              <Button size="sm" onClick={() => setShowCreateStep(true)} className="gap-1.5">
                <HiPlus className="w-4 h-4" />
                Add Step
              </Button>
            </div>

            {loadingSteps ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : steps.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
                <p className="text-sm font-medium">No steps yet</p>
                <p className="text-xs mt-1">Add the first production step for this crop</p>
              </div>
            ) : (
              <div className="space-y-2">
                {steps
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((step, idx) => (
                    <div
                      key={step.id}
                      className="rounded-xl border border-gray-200 bg-white px-4 py-3 flex items-start gap-3"
                    >
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-gray-900">{step.name}</p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${STEP_TYPE_COLORS[step.type]}`}
                          >
                            {STEP_TYPE_LABELS[step.type]}
                          </span>
                          {step.is_optional && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                              Optional
                            </span>
                          )}
                          {step.repeated && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 font-medium">
                              Repeatable
                            </span>
                          )}
                        </div>
                        {step.description && (
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                            {step.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-400">Min logs</p>
                        <p className="text-sm font-semibold text-gray-700">{step.min_logs}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateCropModal
        open={showCreateCrop}
        onClose={() => setShowCreateCrop(false)}
        onSuccess={() => {
          setShowCreateCrop(false);
          router.refresh();
        }}
      />

      {selectedCrop && (
        <CreateStepModal
          crop={selectedCrop}
          open={showCreateStep}
          onClose={() => setShowCreateStep(false)}
          onSuccess={async () => {
            setShowCreateStep(false);
            // Reload steps for current crop
            if (selectedCrop) await handleSelectCrop(selectedCrop);
          }}
        />
      )}
    </div>
  );
}

// ─── Create Crop Modal ────────────────────────────────────────────────────────

function CreateCropModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cropType, setCropType] = useState<CropType>("SHORT_TERM");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleClose() {
    setName("");
    setDescription("");
    setCropType("SHORT_TERM");
    setError("");
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;
    setError("");
    startTransition(async () => {
      const result = await createCropAction({
        name: name.trim(),
        description: description.trim(),
        crop_type: cropType,
      });
      if (result.error) {
        setError(result.error);
      } else {
        handleClose();
        onSuccess();
      }
    });
  }

  return (
    <Modal open={open} onClose={handleClose} title="New Crop">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Bưởi, Cà phê"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Crop Type <span className="text-red-500">*</span>
          </label>
          <select
            value={cropType}
            onChange={(e) => setCropType(e.target.value as CropType)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="SHORT_TERM">Short-term</option>
            <option value="LONG_TERM">Long-term</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe the crop..."
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            loading={pending}
            disabled={!name.trim() || !description.trim()}
          >
            Create Crop
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Create Step Modal ────────────────────────────────────────────────────────

function CreateStepModal({
  crop,
  open,
  onClose,
  onSuccess,
}: {
  crop: Crop;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [type, setType] = useState<StepType>("PREPARE");
  const [order, setOrder] = useState("");
  const [minLogs, setMinLogs] = useState("1");
  const [isOptional, setIsOptional] = useState(false);
  const [repeated, setRepeated] = useState(false);
  const [minDays, setMinDays] = useState("");
  const [maxDays, setMaxDays] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleClose() {
    setName("");
    setDescription("");
    setNotes("");
    setType("PREPARE");
    setOrder("");
    setMinLogs("1");
    setIsOptional(false);
    setRepeated(false);
    setMinDays("");
    setMaxDays("");
    setError("");
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !order) return;
    setError("");
    startTransition(async () => {
      const result = await createStepAction({
        crop_id: crop.id,
        name: name.trim(),
        description: description.trim(),
        notes: notes.trim() || undefined,
        type,
        order: Number(order),
        min_logs: Number(minLogs),
        is_optional: isOptional,
        repeated,
        min_day_duration: minDays ? Number(minDays) : undefined,
        max_day_duration: maxDays ? Number(maxDays) : undefined,
      });
      if (result.error) {
        setError(result.error);
      } else {
        handleClose();
        onSuccess();
      }
    });
  }

  return (
    <Modal open={open} onClose={handleClose} title={`Add Step — ${crop.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chuẩn bị đất trồng"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Step Type <span className="text-red-500">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as StepType)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {(Object.keys(STEP_TYPE_LABELS) as StepType[]).map((t) => (
                <option key={t} value={t}>
                  {STEP_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              placeholder="e.g. 10, 20, 30"
              min={1}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="What does this step involve?"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Logs <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={minLogs}
              onChange={(e) => setMinLogs(e.target.value)}
              min={1}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (days)
            </label>
            <div className="flex gap-1.5 items-center">
              <input
                type="number"
                value={minDays}
                onChange={(e) => setMinDays(e.target.value)}
                min={1}
                placeholder="Min"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <span className="text-gray-400 text-xs">–</span>
              <input
                type="number"
                value={maxDays}
                onChange={(e) => setMaxDays(e.target.value)}
                min={1}
                placeholder="Max"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="col-span-2 flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
              <input
                type="checkbox"
                checked={isOptional}
                onChange={(e) => setIsOptional(e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              Optional step
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
              <input
                type="checkbox"
                checked={repeated}
                onChange={(e) => setRepeated(e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              Repeatable
            </label>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            loading={pending}
            disabled={!name.trim() || !description.trim() || !order}
          >
            Add Step
          </Button>
        </div>
      </form>
    </Modal>
  );
}
