export const AUDITOR_REGISTRY_ADDRESS =
  "0x3B02fF1e626Ed7a8fd6eC5299e2C54e1421B626B" as const;

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
