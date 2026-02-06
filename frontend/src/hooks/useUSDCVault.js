import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import USDCVault4626ABI from '../abis/USDCVault4626.json';

const VAULT_ADDRESS = import.meta.env.VITE_USDC_VAULT;

export function useUSDCVault() {
  // Read total assets in vault
  const { data: totalAssets, isLoading: isLoadingAssets, refetch: refetchAssets } = useReadContract({
    address: VAULT_ADDRESS,
    abi: USDCVault4626ABI,
    functionName: 'totalAssets',
  });

  // Read total supply (vault shares)
  const { data: totalSupply, refetch: refetchSupply } = useReadContract({
    address: VAULT_ADDRESS,
    abi: USDCVault4626ABI,
    functionName: 'totalSupply',
  });

  // Withdraw function
  const { data: withdrawHash, writeContract: withdraw, isPending: isWithdrawPending, error: withdrawError } = useWriteContract();

  const { isLoading: isWithdrawConfirming, isSuccess: isWithdrawSuccess } = useWaitForTransactionReceipt({
    hash: withdrawHash,
  });

  /**
   * Withdraw assets from vault
   * @param {string|number} amount - Amount in USDC (6 decimals)
   * @param {string} receiverAddress - Address to receive assets
   * @param {string} ownerAddress - Owner of the shares
   */
  const handleWithdraw = (amount, receiverAddress, ownerAddress) => {
    if (!amount || !receiverAddress || !ownerAddress) return;
    
    withdraw({
      address: VAULT_ADDRESS,
      abi: USDCVault4626ABI,
      functionName: 'withdraw',
      args: [parseUnits(amount.toString(), 6), receiverAddress, ownerAddress],
    });
  };

  /**
   * Get vault total assets in USDC
   * @returns {number} Total assets in vault (USDC)
   */
  const vaultTotalAssets = () => {
    return totalAssets ? Number(totalAssets) / 1e6 : 0;
  };

  /**
   * Convert USDC assets to vault shares (ERC4626 standard)
   * Note: This is a client-side calculation. For ERC4626, shares = assets * totalSupply / totalAssets
   * @param {string|number} assets - Amount of USDC assets (6 decimals)
   * @returns {number} Equivalent vault shares
   */
  const convertToShares = (assets) => {
    if (!totalAssets || !totalSupply || totalAssets === 0n) {
      // Initial case: 1:1 ratio
      return parseFloat(assets);
    }
    
    const assetsInWei = parseUnits(assets.toString(), 6);
    const shares = (assetsInWei * totalSupply) / totalAssets;
    return Number(shares) / 1e6;
  };

  /**
   * Convert vault shares to USDC assets (ERC4626 standard)
   * Note: This is a client-side calculation. For ERC4626, assets = shares * totalAssets / totalSupply
   * @param {string|number} shares - Amount of vault shares (6 decimals)
   * @returns {number} Equivalent USDC assets
   */
  const convertToAssets = (shares) => {
    if (!totalAssets || !totalSupply || totalSupply === 0n) {
      // Initial case: 1:1 ratio
      return parseFloat(shares);
    }
    
    const sharesInWei = parseUnits(shares.toString(), 6);
    const assets = (sharesInWei * totalAssets) / totalSupply;
    return Number(assets) / 1e6;
  };

  return {
    // Total assets
    totalAssets: totalAssets ? Number(totalAssets) / 1e6 : 0,
    vaultTotalAssets,
    isLoadingAssets,
    refetchAssets,
    
    // Total supply
    totalSupply: totalSupply ? Number(totalSupply) / 1e6 : 0,
    refetchSupply,
    
    // ERC4626 conversion functions
    convertToShares,
    convertToAssets,
    
    // Withdraw functions
    withdraw: handleWithdraw,
    isWithdrawPending: isWithdrawPending || isWithdrawConfirming,
    isWithdrawSuccess,
    withdrawError,
    withdrawHash,
  };
}
