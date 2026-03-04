"use client";

import { useState, useTransition } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { updateUserStatusAction } from "@/app/actions/users";
import { UserStatus } from "@/lib/types/auth";
import { HiCheckCircle, HiNoSymbol, HiXCircle } from "react-icons/hi2";

interface StatusPanelProps {
  userId: number;
  currentStatus: UserStatus;
}

type ActionType = "ACTIVE" | "SUSPENDED" | "BANNED";

const ACTION_CONFIG: Record<
  ActionType,
  { label: string; description: string; variant: "primary" | "secondary" | "danger"; icon: React.ReactNode }
> = {
  ACTIVE: {
    label: "Activate",
    description: "Re-enable this account. The user will regain full platform access.",
    variant: "primary",
    icon: <HiCheckCircle className="w-4 h-4" />,
  },
  SUSPENDED: {
    label: "Suspend",
    description: "Temporarily restrict this account. The user cannot log in until activated.",
    variant: "secondary",
    icon: <HiNoSymbol className="w-4 h-4" />,
  },
  BANNED: {
    label: "Ban",
    description: "Permanently restrict this account. This action should be used for serious violations.",
    variant: "danger",
    icon: <HiXCircle className="w-4 h-4" />,
  },
};

export function StatusPanel({ userId, currentStatus }: StatusPanelProps) {
  const [modal, setModal] = useState<ActionType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function openModal(action: ActionType) {
    setError(null);
    setModal(action);
  }

  function closeModal() {
    if (isPending) return;
    setModal(null);
    setError(null);
  }

  function handleConfirm() {
    if (!modal) return;
    startTransition(async () => {
      const result = await updateUserStatusAction(userId, modal);
      if (result.error) {
        setError(result.error);
      } else {
        setModal(null);
      }
    });
  }

  const availableActions: ActionType[] = (["ACTIVE", "SUSPENDED", "BANNED"] as ActionType[]).filter(
    (a) => a !== currentStatus
  );

  const config = modal ? ACTION_CONFIG[modal] : null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-3">Account Status</h2>
      <div className="mb-4">
        <StatusBadge status={currentStatus} />
      </div>

      <div className="flex flex-col gap-2">
        {availableActions.map((action) => {
          const ac = ACTION_CONFIG[action];
          return (
            <Button
              key={action}
              variant={ac.variant}
              onClick={() => openModal(action)}
              className="flex items-center gap-1.5 justify-center"
            >
              {ac.icon}
              {ac.label}
            </Button>
          );
        })}
      </div>

      <Modal
        open={modal !== null}
        onClose={closeModal}
        title={config ? `${config.label} User` : ""}
      >
        <div className="space-y-4">
          {config && (
            <p className="text-sm text-gray-600">{config.description}</p>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <Button
              variant={config?.variant ?? "primary"}
              loading={isPending}
              onClick={handleConfirm}
            >
              Confirm
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
