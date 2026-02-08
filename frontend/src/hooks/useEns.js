import { useEnsName, useEnsAvatar } from 'wagmi';
import { normalize } from 'viem/ens';
import { sepolia } from 'wagmi/chains';

/**
 * Custom hook to fetch ENS name and avatar for an address
 * ENS configured for sepolia testnet
 */
export function useEns(address) {
  // Skip ENS lookups for invalid/demo addresses
  const isValidAddress = address && address.startsWith('0x') && address.length === 42;
  
  // Enable ENS lookups on sepolia testnet
  const { data: ensName, isLoading: isLoadingName } = useEnsName({
    address: isValidAddress ? address : undefined,
    chainId: sepolia.id,
    enabled: isValidAddress,
  });

  // Fetch ENS avatar (NFT or uploaded image)
  const { data: ensAvatar, isLoading: isLoadingAvatar } = useEnsAvatar({
    name: ensName ? normalize(ensName) : undefined,
    chainId: sepolia.id,
    enabled: !!ensName,
  });

  // Format address for display (0x1234...5678)
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Get display name (ENS name or formatted address)
  const displayName = ensName || formatAddress(address);

  return {
    ensName,
    ensAvatar,
    displayName,
    hasEnsName: !!ensName,
    isLoading: isLoadingName || isLoadingAvatar,
    formattedAddress: formatAddress(address),
  };
}

/**
 * Hook to check if current user has ENS name
 */
export function useUserEns(address) {
  const ens = useEns(address);
  
  return {
    ...ens,
    hasEns: !!ens.ensName,
    // Bonus: ENS holders get special badge in UI
    isPremiumUser: !!ens.ensName,
  };
}
