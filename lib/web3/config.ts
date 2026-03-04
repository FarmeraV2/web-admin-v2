import { anvil, sepolia } from "viem/chains";
import { createConfig, http, injected } from "wagmi";

// Use the injected connector (MetaMask browser extension).
// No MetaMask SDK or WalletConnect required for local Anvil dev.
export const wagmiConfig = createConfig({
  chains: [anvil, sepolia],
  connectors: [injected()],
  transports: {
    [anvil.id]: http("http://127.0.0.1:8545"),
    [sepolia.id]: http("/api/rpc/sepolia")
  },
  ssr: true,
});

// export const wagmiConfig = getDefaultConfig({
//   appName: "Farmera",
//   projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
//   chains: [anvil, sepolia],
//   ssr: true,
// });