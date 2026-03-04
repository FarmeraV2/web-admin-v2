"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { HiPlus, HiChevronDown, HiChevronRight, HiTag, HiOutlineSquares2X2 } from "react-icons/hi2";
import { Category } from "@/lib/types/product";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { createCategoryAction, createSubcategoryAction } from "@/app/actions/config";

interface CategoryTreeProps {
  categories: Category[];
}

export function CategoryTree({ categories }: CategoryTreeProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [addSubFor, setAddSubFor] = useState<Category | null>(null);

  function toggleExpand(id: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{categories.length} categories</p>
        <Button
          size="sm"
          onClick={() => setShowCreateCategory(true)}
          className="gap-1.5"
        >
          <HiPlus className="w-4 h-4" />
          New Category
        </Button>
      </div>

      {/* Tree */}
      <div className="space-y-2">
        {categories.map((cat) => {
          const isOpen = expanded.has(cat.category_id);
          const subCount = cat.subcategories?.length ?? 0;
          return (
            <div
              key={cat.category_id}
              className="rounded-xl border border-gray-200 bg-white overflow-hidden"
            >
              {/* Category row */}
              <div className="flex items-center gap-3 px-4 py-3">
                <button
                  onClick={() => toggleExpand(cat.category_id)}
                  className="p-0.5 rounded text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={isOpen ? "Collapse" : "Expand"}
                >
                  {isOpen ? (
                    <HiChevronDown className="w-4 h-4" />
                  ) : (
                    <HiChevronRight className="w-4 h-4" />
                  )}
                </button>

                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <HiOutlineSquares2X2 className="w-4 h-4 text-green-700" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{cat.name}</p>
                    {cat.description && (
                      <p className="text-xs text-gray-400 truncate">{cat.description}</p>
                    )}
                  </div>
                </div>

                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {subCount} subcategories
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAddSubFor(cat);
                    if (!isOpen) setExpanded((prev) => new Set(prev).add(cat.category_id));
                  }}
                  className="gap-1 text-gray-500"
                >
                  <HiPlus className="w-3.5 h-3.5" />
                  Add sub
                </Button>
              </div>

              {/* Subcategories */}
              {isOpen && (
                <div className="border-t border-gray-100 bg-gray-50">
                  {subCount === 0 ? (
                    <p className="px-12 py-3 text-xs text-gray-400 italic">No subcategories yet.</p>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {cat.subcategories!.map((sub) => (
                        <li
                          key={sub.subcategory_id}
                          className="flex items-center gap-3 px-12 py-2.5"
                        >
                          <HiTag className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm text-gray-800 font-medium">{sub.name}</p>
                            {sub.description && (
                              <p className="text-xs text-gray-400 truncate">{sub.description}</p>
                            )}
                          </div>
                          <span className="ml-auto text-xs text-gray-400">
                            ID {sub.subcategory_id}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Category Modal */}
      <CreateCategoryModal
        open={showCreateCategory}
        onClose={() => setShowCreateCategory(false)}
        onSuccess={() => {
          setShowCreateCategory(false);
          router.refresh();
        }}
      />

      {/* Add Subcategory Modal */}
      {addSubFor && (
        <AddSubcategoryModal
          category={addSubFor}
          open={!!addSubFor}
          onClose={() => setAddSubFor(null)}
          onSuccess={() => {
            setAddSubFor(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

// ─── Create Category Modal ────────────────────────────────────────────────────

function CreateCategoryModal({
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
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleClose() {
    setName("");
    setDescription("");
    setError("");
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setError("");
    startTransition(async () => {
      const result = await createCategoryAction(
        name.trim(),
        description.trim() || undefined
      );
      if (result.error) {
        setError(result.error);
      } else {
        setName("");
        setDescription("");
        onSuccess();
      }
    });
  }

  return (
    <Modal open={open} onClose={handleClose} title="New Category">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rau củ quả"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Short description..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" loading={pending} disabled={!name.trim()}>
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Add Subcategory Modal ────────────────────────────────────────────────────

function AddSubcategoryModal({
  category,
  open,
  onClose,
  onSuccess,
}: {
  category: Category;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleClose() {
    setName("");
    setDescription("");
    setError("");
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setError("");
    startTransition(async () => {
      const result = await createSubcategoryAction(
        name.trim(),
        category.category_id,
        description.trim() || undefined
      );
      if (result.error) {
        setError(result.error);
      } else {
        setName("");
        setDescription("");
        onSuccess();
      }
    });
  }

  return (
    <Modal open={open} onClose={handleClose} title={`Add Subcategory — ${category.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rau lá"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Short description..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" loading={pending} disabled={!name.trim()}>
            Add Subcategory
          </Button>
        </div>
      </form>
    </Modal>
  );
}
