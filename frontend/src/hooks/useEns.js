import { useEnsName, useEnsAvatar, useChainId } from 'wagmi';
import { normalize } from 'viem/ens';
import { mainnet } from 'wagmi/chains';

/**
 * Custom hook to fetch ENS name and avatar for an address
 * ENS only works on Ethereum mainnet - disabled on testnets to avoid CORS issues
 */
export function useEns(address) {
  const chainId = useChainId();
  const isMainnet = chainId === mainnet.id;
  
  // Only enable ENS lookups on mainnet to avoid CORS errors on testnets
  const { data: ensName, isLoading: isLoadingName } = useEnsName({
    address,
    chainId: mainnet.id,
    enabled: !!address && isMainnet, // Only query ENS on mainnet
  });

  // Fetch ENS avatar (NFT or uploaded image)
  const { data: ensAvatar, isLoading: isLoadingAvatar } = useEnsAvatar({
    name: ensName ? normalize(ensName) : undefined,
    chainId: mainnet.id,
    enabled: !!ensName && isMainnet, // Only query ENS on mainnet
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
