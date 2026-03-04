"use client";

import { useState, useTransition } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { approveFarmAction } from "@/app/actions/farms";
import { FarmStatus } from "@/lib/types/farm";
import { StatusBadge } from "@/components/ui/status-badge";
import { HiCheckCircle, HiXCircle } from "react-icons/hi2";

interface ApprovePanelProps {
  farmId: number;
  currentStatus: FarmStatus;
}

type ActionType = "APPROVED" | "REJECTED";

export function ApprovePanel({ farmId, currentStatus }: ApprovePanelProps) {
  const [modal, setModal] = useState<ActionType | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const canApprove = currentStatus === "PENDING_APPROVE";

  function openModal(type: ActionType) {
    setReason("");
    setError(null);
    setModal(type);
  }

  function closeModal() {
    if (isPending) return;
    setModal(null);
    setError(null);
    setReason("");
  }

  function handleConfirm() {
    if (!modal) return;
    startTransition(async () => {
      const result = await approveFarmAction(
        farmId,
        modal,
        reason.trim() || undefined
      );
      if (result.error) {
        setError(result.error);
      } else {
        setModal(null);
      }
    });
  }

  const isApproveModal = modal === "APPROVED";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-1">
        Farm Status
      </h2>
      <div className="flex items-center gap-3 mb-4">
        <StatusBadge status={currentStatus} />
        {!canApprove && (
          <p className="text-sm text-gray-500">
            {currentStatus === "APPROVED"
              ? "This farm has been approved."
              : currentStatus === "REJECTED"
              ? "This farm has been rejected."
              : currentStatus === "BLOCKED"
              ? "This farm is blocked."
              : currentStatus === "VERIFIED"
              ? "This farm is verified but awaiting admin approval."
              : "No approval action available."}
          </p>
        )}
      </div>

      {canApprove && (
        <>
          <p className="text-sm text-gray-600 mb-4">
            This farm is waiting for your review. You can approve or reject it.
          </p>
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={() => openModal("APPROVED")}
              className="flex items-center gap-1.5"
            >
              <HiCheckCircle className="w-4 h-4" />
              Approve
            </Button>
            <Button
              variant="danger"
              onClick={() => openModal("REJECTED")}
              className="flex items-center gap-1.5"
            >
              <HiXCircle className="w-4 h-4" />
              Reject
            </Button>
          </div>
        </>
      )}

      {/* Confirm modal */}
      <Modal
        open={modal !== null}
        onClose={closeModal}
        title={isApproveModal ? "Approve Farm" : "Reject Farm"}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {isApproveModal
              ? "Are you sure you want to approve this farm? The farmer will be able to list products."
              : "Are you sure you want to reject this farm? Please provide a reason."}
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason{isApproveModal ? " (optional)" : " *"}
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                isApproveModal
                  ? "Add a note (optional)..."
                  : "Explain why this farm is being rejected..."
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <Button
              variant={isApproveModal ? "primary" : "danger"}
              loading={isPending}
              disabled={!isApproveModal && !reason.trim()}
              onClick={handleConfirm}
            >
              {isApproveModal ? "Confirm Approval" : "Confirm Rejection"}
            </Button>
            <Button variant="secondary" onClick={closeModal} disabled={isPending}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
