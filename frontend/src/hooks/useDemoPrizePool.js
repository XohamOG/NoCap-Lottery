import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent } from 'wagmi';
import { useEffect, useState } from 'react';
import { parseUnits } from 'viem';
import DemoPrizePoolUSBCABI from '../abis/DemoPrizePoolUSDC.json';
import IERC20ABI from '../abis/IERC20.json';

const DEMO_PRIZE_POOL_ADDRESS = import.meta.env.VITE_USDC_DEMO;
const USDC_ADDRESS = import.meta.env.VITE_USDC_ADDRESS;

/**
 * Demo Prize Pool Hook - For testing and demonstration purposes
 * Allows funding prizes and bonuses, and drawing demo winners
 * @param {string} userAddress - User wallet address
 */
export function useDemoPrizePool(userAddress) {
  // State for storing winner events
  const [lastWinner, setLastWinner] = useState(null);
  const [winners, setWinners] = useState([]);

  // Read USDC balance of the demo prize pool contract
  // This serves as a proxy for total funds in the pool
  const { data: poolUSDCBalance, refetch: refetchPoolBalance } = useReadContract({
    address: USDC_ADDRESS,
    abi: IERC20ABI,
    functionName: 'balanceOf',
    args: [DEMO_PRIZE_POOL_ADDRESS],
  });

  // Calculate total pool amount from USDC balance
  const totalPoolAmount = poolUSDCBalance ? Number(poolUSDCBalance) / 1e6 : 0;

  // Read last demo round (this one exists in the contract)
  const { data: lastDemoRound, refetch: refetchLastDemoRound } = useReadContract({
    address: DEMO_PRIZE_POOL_ADDRESS,
    abi: DemoPrizePoolUSBCABI,
    functionName: 'lastRound',
  });

  // Fund Prize function
  const { 
    data: fundPrizeHash, 
    writeContract: fundPrizeFn, 
    isPending: isFundPrizePending, 
    error: fundPrizeError, 
    reset: resetFundPrize 
  } = useWriteContract();

  const { isLoading: isFundPrizeConfirming, isSuccess: isFundPrizeSuccess } = useWaitForTransactionReceipt({
    hash: fundPrizeHash,
  });

  /**
   * Fund the demo prize pool
   * @param {string|number} amount - Amount in USDC (will be converted to 6 decimals)
   */
  const handleFundPrize = (amount) => {
    if (!amount) return;

    fundPrizeFn({
      address: DEMO_PRIZE_POOL_ADDRESS,
      abi: DemoPrizePoolUSBCABI,
      functionName: 'fundPrize',
      args: [parseUnits(amount.toString(), 6)],
    });
  };

  // Fund Bonus function
  const { 
    data: fundBonusHash, 
    writeContract: fundBonusFn, 
    isPending: isFundBonusPending, 
    error: fundBonusError, 
    reset: resetFundBonus 
  } = useWriteContract();

  const { isLoading: isFundBonusConfirming, isSuccess: isFundBonusSuccess } = useWaitForTransactionReceipt({
    hash: fundBonusHash,
  });

  /**
   * Fund the demo bonus pool
   * @param {string|number} amount - Amount in USDC (will be converted to 6 decimals)
   */
  const handleFundBonus = (amount) => {
    if (!amount) return;

    fundBonusFn({
      address: DEMO_PRIZE_POOL_ADDRESS,
      abi: DemoPrizePoolUSBCABI,
      functionName: 'fundBonus',
      args: [parseUnits(amount.toString(), 6)],
    });
  };

  // Draw Demo Winner function
  const { 
    data: drawHash, 
    writeContract: drawWinnerFn, 
    isPending: isDrawPending, 
    error: drawError, 
    reset: resetDraw 
  } = useWriteContract();

  const { isLoading: isDrawConfirming, isSuccess: isDrawSuccess } = useWaitForTransactionReceipt({
    hash: drawHash,
  });

  /**
   * Draw a demo winner for a specific round
   * @param {number} round - Round number to draw winner for
   */
  const handleDrawDemoWinner = (round) => {
    if (round === undefined || round === null) return;

    drawWinnerFn({
      address: DEMO_PRIZE_POOL_ADDRESS,
      abi: DemoPrizePoolUSBCABI,
      functionName: 'drawDemoWinner',
      args: [BigInt(round)],
    });
  };

  // Watch for PrizeFunded events to trigger refetch
  useWatchContractEvent({
    address: DEMO_PRIZE_POOL_ADDRESS,
    abi: DemoPrizePoolUSBCABI,
    eventName: 'PrizeFunded',
    onLogs(logs) {
      logs.forEach((log) => {
        const { from, amount } = log.args;
        if (amount) {
          const addedAmount = Number(amount) / 1e6;
          console.log('💰 PrizeFunded event:', addedAmount, 'USDC from', from);
          // Refetch pool balance to reflect new amount
          setTimeout(() => {
            refetchPoolBalance();
            console.log('🔄 Refetched pool balance after PrizeFunded event');
          }, 1000);
        }
      });
    },
  });

  // Watch for BonusFunded events to trigger refetch
  useWatchContractEvent({
    address: DEMO_PRIZE_POOL_ADDRESS,
    abi: DemoPrizePoolUSBCABI,
    eventName: 'BonusFunded',
    onLogs(logs) {
      logs.forEach((log) => {
        const { from, amount } = log.args;
        if (amount) {
          const addedAmount = Number(amount) / 1e6;
          console.log('🎁 BonusFunded event:', addedAmount, 'USDC from', from);
          // Refetch pool balance to reflect new amount
          setTimeout(() => {
            refetchPoolBalance();
            console.log('🔄 Refetched pool balance after BonusFunded event');
          }, 1000);
        }
      });
    },
  });

  // Watch for DemoWinner events
  useWatchContractEvent({
    address: DEMO_PRIZE_POOL_ADDRESS,
    abi: DemoPrizePoolUSBCABI,
    eventName: 'DemoWinner',
    onLogs(logs) {
      logs.forEach((log) => {
        const { winner, prize, bonus, round } = log.args;
        const winnerData = {
          winner,
          prize: prize ? Number(prize) / 1e6 : 0,
          bonus: bonus ? Number(bonus) / 1e6 : 0,
          round: round ? Number(round) : 0,
          timestamp: Date.now(),
        };
        
        console.log('🏆 DemoWinner event:', winnerData);
        setLastWinner(winnerData);
        setWinners(prev => [winnerData, ...prev.slice(0, 9)]); // Keep last 10 winners
        // Refetch pool balance after winner is drawn (funds are distributed)
        setTimeout(() => {
          refetchPoolBalance();
          console.log('🔄 Refetched pool balance after DemoWinner event');
        }, 1000);
      });
    },
  });

  // Auto-refetch after successful transactions
  useEffect(() => {
    if (isFundPrizeSuccess || isFundBonusSuccess || isDrawSuccess) {
      const timer = setTimeout(() => {
        refetchAll();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isFundPrizeSuccess, isFundBonusSuccess, isDrawSuccess]);

  const refetchAll = () => {
    refetchLastDemoRound();
    refetchPoolBalance();
    console.log('🔄 Refetched lastDemoRound and pool balance. Total pool:', totalPoolAmount, 'USDC');
  };

  return {
    // Demo prize pool data (using USDC balance as total pool amount)
    demoPrize: totalPoolAmount, // Total USDC in the contract
    demoBonus: 0, // Not separately tracked
    totalPoolAmount, // Raw value
    lastDemoRound: lastDemoRound ? Number(lastDemoRound) : 0,

    // Fund Prize functions
    fundDemoPrize: handleFundPrize,
    fundPrize: handleFundPrize, // Alias
    isFundPrizePending: isFundPrizePending || isFundPrizeConfirming,
    isFundPrizeSuccess,
    fundPrizeError,
    fundPrizeHash,
    resetFundPrize,

    // Fund Bonus functions
    fundDemoBonus: handleFundBonus,
    fundBonus: handleFundBonus, // Alias
    isFundBonusPending: isFundBonusPending || isFundBonusConfirming,
    isFundBonusSuccess,
    fundBonusError,
    fundBonusHash,
    resetFundBonus,

    // Draw Winner functions
    drawDemoWinner: handleDrawDemoWinner,
    isDrawPending: isDrawPending || isDrawConfirming,
    isDrawSuccess,
    drawError,
    drawHash,
    resetDraw,

    // Winner events
    lastWinner,
    winners,

    // Refetch
    refetchAll,
  };
}
