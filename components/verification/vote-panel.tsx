"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { keccak256, toBytes } from "viem";
import { submitVoteAction } from "@/app/actions/verification";
import { AUDITOR_REGISTRY_ADDRESSES, AUDITOR_REGISTRY_ABI } from "@/lib/web3/contracts";

// keccak256(abi.encodePacked("log")) — matches the Solidity identifier
const LOG_IDENTIFIER = keccak256(toBytes("log"));

interface VotePanelProps {
  requestId: number;
  logId: number;
  alreadyVoted: boolean;
  voteTransactionHash: string | null;
}

export function VotePanel({
  requestId,
  logId,
  alreadyVoted,
  voteTransactionHash,
}: VotePanelProps) {
  const router = useRouter();
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingBackend, setIsSubmittingBackend] = useState(false);
  const [pendingVote, setPendingVote] = useState<boolean | null>(null);

  const {
    writeContract,
    data: txHash,
    isPending: isWritePending,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  // After on-chain confirmation, record tx hash in backend
  useEffect(() => {
    if (!isConfirmed || !txHash) return;
    setIsSubmittingBackend(true);
    submitVoteAction(requestId, txHash).then((result) => {
      setIsSubmittingBackend(false);
      if (result.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }, [isConfirmed, txHash, requestId, router]);

  // Surface contract write errors
  useEffect(() => {
    if (writeError) {
      setError(writeError.message.split("\n")[0]);
      setPendingVote(null);
    }
  }, [writeError]);

  function castVote(isValid: boolean) {
    setError(null);
    resetWrite();
    setPendingVote(isValid);
    writeContract({
      address: AUDITOR_REGISTRY_ADDRESSES[chainId],
      abi: AUDITOR_REGISTRY_ABI,
      functionName: "verify",
      args: [LOG_IDENTIFIER, BigInt(logId), isValid],
    });
  }

  if (alreadyVoted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-5">
        <p className="text-sm font-semibold text-green-800 mb-1">Vote Recorded</p>
        <p className="text-xs text-green-700">
          Your blockchain vote has been recorded for this verification.
        </p>
        {voteTransactionHash && (
          <p className="mt-2 font-mono text-xs text-green-700 break-all">
            Tx: {voteTransactionHash}
          </p>
        )}
      </div>
    );
  }

  const isBusy = isWritePending || isConfirming || isSubmittingBackend;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-sm font-semibold text-gray-900 mb-1">Submit Your Vote</p>

      {!isConnected ? (
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-3">
            Connect your auditor wallet to cast your vote on-chain.
          </p>
          <ConnectButton />
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
            Your vote is submitted directly to the smart contract. After
            confirmation, the result is recorded in the system.
          </p>

          {isWritePending && (
            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
              Confirm the transaction in your wallet…
            </div>
          )}
          {isConfirming && (
            <div className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-3">
              Transaction submitted — waiting for block confirmation…
            </div>
          )}
          {isSubmittingBackend && (
            <div className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-3">
              Recording vote in system…
            </div>
          )}
          {error && (
            <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3 break-words">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => castVote(true)}
              disabled={isBusy}
              className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 active:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBusy && pendingVote === true ? "…" : "Approve"}
            </button>
            <button
              onClick={() => castVote(false)}
              disabled={isBusy}
              className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 active:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBusy && pendingVote === false ? "…" : "Reject"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
