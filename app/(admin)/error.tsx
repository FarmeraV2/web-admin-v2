"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <p className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</p>
      <p className="text-sm text-gray-500 mb-6 max-w-sm">{error.message}</p>
      <Button variant="secondary" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
