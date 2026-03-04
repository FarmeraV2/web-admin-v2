import { createConfig, http } from "wagmi";
import { anvil } from "viem/chains";
import { injected } from "wagmi/connectors";

// Use the injected connector (MetaMask browser extension).
// No MetaMask SDK or WalletConnect required for local Anvil dev.
export const wagmiConfig = createConfig({
  chains: [anvil],
  connectors: [injected()],
  transports: {
    [anvil.id]: http("http://127.0.0.1:8545"),
  },
  ssr: true,
});
