import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  baseSepolia,
  sepolia,
  arbitrumSepolia,
  optimismSepolia
} from 'wagmi/chains';
import { http } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'NoCap Lottery',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [
    // Testnets only (mainnet chains removed to avoid CORS issues during development)
    sepolia, // Primary - contracts deployed here
    baseSepolia,
    arbitrumSepolia,
    optimismSepolia,
  ],
  ssr: false,
  transports: {
    [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
    [baseSepolia.id]: http('https://base-sepolia.blockpi.network/v1/rpc/public'),
    [arbitrumSepolia.id]: http('https://arbitrum-sepolia.blockpi.network/v1/rpc/public'),
    [optimismSepolia.id]: http('https://optimism-sepolia.blockpi.network/v1/rpc/public'),
  },
});
