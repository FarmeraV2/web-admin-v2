import { anvil, sepolia } from "viem/chains";

export const AUDITOR_REGISTRY_ADDRESSES: Record<number, `0x${string}`> = {
  [anvil.id]: "0x3B02fF1e626Ed7a8fd6eC5299e2C54e1421B626B",
  [sepolia.id]: "0x76038aE28113a192307031957A479d232a6361F9",
};

export const AUDITOR_REGISTRY_ABI = [
  {
    name: "verify",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "identifier", type: "bytes32" },
      { name: "id", type: "uint64" },
      { name: "isValid", type: "bool" },
    ],
    outputs: [],
  },
] as const;
