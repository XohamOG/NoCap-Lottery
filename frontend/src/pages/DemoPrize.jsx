import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, DollarSign, Gift, Sparkles, TrendingUp } from 'lucide-react';
import { useDemoPrizePool } from '../hooks/useDemoPrizePool';
import { useLotteryPoolUSDC } from '../hooks/useLotteryPoolUSDC';
import { useUSDCBalance, useUSDCApproval, useUSDCAllowance } from '../hooks/useUSDCApproval';
import { Header } from '../components/Header';

const DEMO_PRIZE_POOL_ADDRESS = import.meta.env.VITE_USDC_DEMO;

/**
 * Demo Prize Pool Page
 * Allows funding of demo prizes and bonuses, and drawing demo winners
 * This is for testing purposes only
 */
export function DemoPrize() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();

  // Local state
  const [prizeAmount, setPrizeAmount] = useState('');
  const [bonusAmount, setBonusAmount] = useState('');
  const [drawRound, setDrawRound] = useState('');
  const [approvalType, setApprovalType] = useState(null); // Track what we're approving for
  const [isRefetching, setIsRefetching] = useState(false); // Track refetch state

  // Hooks
  const demoPool = useDemoPrizePool(address);
  const lottery = useLotteryPoolUSDC(address);
  const { balance: usdcBalance, refetch: refetchBalance } = useUSDCBalance(address);
  const { allowance, refetch: refetchAllowance } = useUSDCAllowance(address, DEMO_PRIZE_POOL_ADDRESS);
  const approval = useUSDCApproval(DEMO_PRIZE_POOL_ADDRESS);

  // Check if needs approval
  const needsPrizeApproval = parseFloat(prizeAmount) > allowance;
  const needsBonusApproval = parseFloat(bonusAmount) > allowance;

  // Handlers
  const handleApprovePrize = async () => {
    try {
      setApprovalType('prize');
      await approval.approve(prizeAmount);
    } catch (error) {
      console.error('Approval failed:', error);
      setApprovalType(null);
    }
  };

  const handleApproveBonus = async () => {
    try {
      setApprovalType('bonus');
      await approval.approve(bonusAmount);
    } catch (error) {
      console.error('Approval failed:', error);
      setApprovalType(null);
    }
  };

  const handleFundPrize = async () => {
    if (!prizeAmount || parseFloat(prizeAmount) <= 0) {
      alert('Please enter a valid prize amount');
      return;
    }

    if (parseFloat(prizeAmount) > usdcBalance) {
      alert('Insufficient USDC balance');
      return;
    }

    try {
      demoPool.fundDemoPrize(prizeAmount);
    } catch (error) {
      console.error('Fund prize failed:', error);
    }
  };

  const handleFundBonus = async () => {
    if (!bonusAmount || parseFloat(bonusAmount) <= 0) {
      alert('Please enter a valid bonus amount');
      return;
    }

    if (parseFloat(bonusAmount) > usdcBalance) {
      alert('Insufficient USDC balance');
      return;
    }

    try {
      demoPool.fundDemoBonus(bonusAmount);
    } catch (error) {
      console.error('Fund bonus failed:', error);
    }
  };

  const handleDrawWinner = async () => {
    const round = drawRound || lottery.currentRound;
    if (round === undefined || round === null) {
      alert('Please enter a valid round number');
      return;
    }

    try {
      demoPool.drawDemoWinner(round);
    } catch (error) {
      console.error('Draw winner failed:', error);
    }
  };

  // Effects for success notifications
  useEffect(() => {
    if (approval.isSuccess) {
      console.log('✅ Approval successful! Waiting for blockchain update...');
      // Wait for blockchain to update before refetching
      const timer = setTimeout(() => {
        console.log('🔄 Refetching allowance...');
        refetchAllowance();
        approval.reset(); // Reset approval state
        
        // Auto-fund after approval succeeds
        if (approvalType === 'prize') {
          console.log('🚀 Auto-funding prize...');
          handleFundPrize();
          setApprovalType(null);
        } else if (approvalType === 'bonus') {
          console.log('🚀 Auto-funding bonus...');
          handleFundBonus();
          setApprovalType(null);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [approval.isSuccess, refetchAllowance, approvalType]);

  useEffect(() => {
    if (demoPool.isFundPrizeSuccess) {
      console.log('✅ Prize funded successfully!');
      console.log('Current demo prize:', demoPool.demoPrize, 'Total pool:', demoPool.totalPoolAmount);
      
      setIsRefetching(true);
      
      // Immediate refetch
      refetchBalance();
      demoPool.refetchAll();
      
      // Additional refetches with longer delays for blockchain sync
      const timer1 = setTimeout(() => {
        console.log('🔄 Refetching after 2s...');
        refetchBalance();
        demoPool.refetchAll();
        console.log('After 2s - demo prize:', demoPool.demoPrize, 'Total pool:', demoPool.totalPoolAmount);
      }, 2000);
      
      const timer2 = setTimeout(() => {
        console.log('🔄 Refetching after 4s...');
        refetchBalance();
        demoPool.refetchAll();
        console.log('After 4s - demo prize:', demoPool.demoPrize, 'Total pool:', demoPool.totalPoolAmount);
      }, 4000);
      
      const timer3 = setTimeout(() => {
        console.log('🔄 Final refetch after 6s...');
        refetchBalance();
        demoPool.refetchAll();
        console.log('Final - demo prize:', demoPool.demoPrize, 'Total pool:', demoPool.totalPoolAmount);
        setPrizeAmount('');
        setIsRefetching(false);
      }, 6000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        setIsRefetching(false);
      };
    }
  }, [demoPool.isFundPrizeSuccess, refetchBalance]);

  useEffect(() => {
    if (demoPool.isFundBonusSuccess) {
      console.log('✅ Bonus funded successfully!');
      console.log('Current demo bonus:', demoPool.demoBonus, 'Total pool:', demoPool.totalPoolAmount);
      
      setIsRefetching(true);
      
      // Immediate refetch
      refetchBalance();
      demoPool.refetchAll();
      
      // Additional refetches with longer delays for blockchain sync
      const timer1 = setTimeout(() => {
        console.log('🔄 Refetching after 2s...');
        refetchBalance();
        demoPool.refetchAll();
        console.log('After 2s - demo bonus:', demoPool.demoBonus, 'Total pool:', demoPool.totalPoolAmount);
      }, 2000);
      
      const timer2 = setTimeout(() => {
        console.log('🔄 Refetching after 4s...');
        refetchBalance();
        demoPool.refetchAll();
        console.log('After 4s - demo bonus:', demoPool.demoBonus, 'Total pool:', demoPool.totalPoolAmount);
      }, 4000);
      
      const timer3 = setTimeout(() => {
        console.log('🔄 Final refetch after 6s...');
        refetchBalance();
        demoPool.refetchAll();
        console.log('Final - demo bonus:', demoPool.demoBonus, 'Total pool:', demoPool.totalPoolAmount);
        setBonusAmount('');
        setIsRefetching(false);
      }, 6000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        setIsRefetching(false);
      };
    }
  }, [demoPool.isFundBonusSuccess, refetchBalance]);

  useEffect(() => {
    if (demoPool.isDrawSuccess) {
      console.log('✅ Demo winner drawn!');
      const timer = setTimeout(() => {
        demoPool.refetchAll();
        lottery.refetchAll();
        setDrawRound('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [demoPool.isDrawSuccess]);

  if (!isConnected) {
    return (
      <div style={styles.container}>
        <Header />
        <div style={styles.content}>
          <motion.div
            style={styles.emptyState}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={styles.emptyIcon}>🔒</div>
            <h2 style={styles.emptyTitle}>CONNECT WALLET</h2>
            <p style={styles.emptyText}>Connect your wallet to access demo features</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Header />
      
      <div style={styles.content}>
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/dashboard')}
          style={styles.backButton}
          className="btn-bounce"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ArrowLeft size={16} />
          <span>BACK TO DASHBOARD</span>
        </motion.button>

        {/* Page Title */}
        <motion.div
          style={styles.titleSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 style={styles.title}>🎮 DEMO PRIZE POOL</h1>
          <p style={styles.subtitle}>Fund prizes, bonuses, and draw demo winners for testing</p>
        </motion.div>

        {/* Success Notifications */}
        {demoPool.isFundPrizeSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={styles.successNotification}
          >
            ✅ Prize funded successfully! Updating balance...
          </motion.div>
        )}
        {demoPool.isFundBonusSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={styles.successNotification}
          >
            ✅ Bonus funded successfully! Updating balance...
          </motion.div>
        )}
        {demoPool.isDrawSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={styles.successNotification}
          >
            ✅ Winner drawn successfully!
          </motion.div>
        )}

        {/* Demo Pool Status */}
        <motion.div
          style={styles.statusCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={styles.sectionTitle}>📊 CURRENT STATUS {isRefetching && <span style={{ fontSize: '0.875rem', color: 'var(--marker-cyan)' }}>  (Updating...)</span>}</h3>
            <motion.button
              onClick={() => {
                console.log('🔄 Manual refresh triggered');
                setIsRefetching(true);
                refetchBalance();
                demoPool.refetchAll();
                lottery.refetchAll();
                setTimeout(() => setIsRefetching(false), 2000);
              }}
              className="btn-bounce"
              style={{
                padding: '0.5rem 1rem',
                background: 'var(--marker-cyan)',
                border: '3px solid var(--ink-black)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '3px 3px 0 var(--ink-black)',
              }}
            >
              🔄 REFRESH
            </motion.button>
          </div>
          <div style={styles.statusGrid}>
            <div style={styles.statusItem}>
              <div style={styles.statusIcon}>💰</div>
              <div>
                <div style={styles.statusLabel}>Total Pool (USDC)</div>
                <div style={styles.statusValue}>${demoPool.demoPrize.toFixed(2)}</div>
              </div>
            </div>
            <div style={styles.statusItem}>
              <div style={styles.statusIcon}>🎁</div>
              <div>
                <div style={styles.statusLabel}>Demo Bonus</div>
                <div style={styles.statusValue}>${demoPool.demoBonus.toFixed(2)}</div>
              </div>
            </div>
            <div style={styles.statusItem}>
              <div style={styles.statusIcon}>🔄</div>
              <div>
                <div style={styles.statusLabel}>Last Round</div>
                <div style={styles.statusValue}>#{demoPool.lastDemoRound}</div>
              </div>
            </div>
            <div style={styles.statusItem}>
              <div style={styles.statusIcon}>💵</div>
              <div>
                <div style={styles.statusLabel}>Your Balance</div>
                <div style={styles.statusValue}>{usdcBalance.toFixed(2)} USDC</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fund Prize Section */}
        <motion.div
          style={styles.actionCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 style={styles.sectionTitle}>
            <DollarSign size={24} style={{ display: 'inline', marginRight: '8px' }} />
            FUND DEMO PRIZE
          </h3>
          <p style={styles.sectionSubtitle}>Add USDC to the demo prize pool</p>

          <div style={styles.inputGroup}>
            <div style={styles.inputHeader}>
              <span style={styles.inputLabel}>AMOUNT (USDC)</span>
              <span style={styles.balanceText}>BAL: {usdcBalance.toFixed(2)}</span>
            </div>
            <div style={styles.inputWrapper}>
              <input
                type="number"
                value={prizeAmount}
                onChange={(e) => setPrizeAmount(e.target.value)}
                placeholder="0.00"
                style={styles.input}
              />
              <button
                onClick={() => setPrizeAmount(usdcBalance.toString())}
                style={styles.maxButton}
              >
                MAX
              </button>
            </div>
          </div>

          {needsPrizeApproval ? (
            <motion.button
              onClick={handleApprovePrize}
              disabled={approval.isPending || !prizeAmount}
              className="btn-bounce"
              style={{
                ...styles.actionButton,
                background: '#00d4ff',
                opacity: (approval.isPending || !prizeAmount) ? 0.5 : 1,
              }}
            >
              {approval.isPending ? 'APPROVING...' : 'APPROVE & FUND PRIZE'}
            </motion.button>
          ) : (
            <motion.button
              onClick={handleFundPrize}
              disabled={demoPool.isFundPrizePending || !prizeAmount}
              className="btn-bounce"
              style={{
                ...styles.actionButton,
                background: '#06d6a0',
                opacity: (demoPool.isFundPrizePending || !prizeAmount) ? 0.5 : 1,
              }}
            >
              {demoPool.isFundPrizePending ? 'FUNDING...' : demoPool.isFundPrizeSuccess ? '✅ SUCCESS!' : 'FUND PRIZE'}
            </motion.button>
          )}
        </motion.div>

        {/* Fund Bonus Section */}
        <motion.div
          style={styles.actionCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 style={styles.sectionTitle}>
            <Gift size={24} style={{ display: 'inline', marginRight: '8px' }} />
            FUND DEMO BONUS
          </h3>
          <p style={styles.sectionSubtitle}>Add USDC to the demo bonus pool</p>

          <div style={styles.inputGroup}>
            <div style={styles.inputHeader}>
              <span style={styles.inputLabel}>AMOUNT (USDC)</span>
              <span style={styles.balanceText}>BAL: {usdcBalance.toFixed(2)}</span>
            </div>
            <div style={styles.inputWrapper}>
              <input
                type="number"
                value={bonusAmount}
                onChange={(e) => setBonusAmount(e.target.value)}
                placeholder="0.00"
                style={styles.input}
              />
              <button
                onClick={() => setBonusAmount(usdcBalance.toString())}
                style={styles.maxButton}
              >
                MAX
              </button>
            </div>
          </div>

          {needsBonusApproval ? (
            <motion.button
              onClick={handleApproveBonus}
              disabled={approval.isPending || !bonusAmount}
              className="btn-bounce"
              style={{
                ...styles.actionButton,
                background: '#00d4ff',
                opacity: (approval.isPending || !bonusAmount) ? 0.5 : 1,
              }}
            >
              {approval.isPending ? 'APPROVING...' : 'APPROVE & FUND BONUS'}
            </motion.button>
          ) : (
            <motion.button
              onClick={handleFundBonus}
              disabled={demoPool.isFundBonusPending || !bonusAmount}
              className="btn-bounce"
              style={{
                ...styles.actionButton,
                background: '#ffd23f',
                opacity: (demoPool.isFundBonusPending || !bonusAmount) ? 0.5 : 1,
              }}
            >
              {demoPool.isFundBonusPending ? 'FUNDING...' : demoPool.isFundBonusSuccess ? '✅ SUCCESS!' : 'FUND BONUS'}
            </motion.button>
          )}
        </motion.div>

        {/* Draw Winner Section */}
        <motion.div
          style={styles.actionCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 style={styles.sectionTitle}>
            <Sparkles size={24} style={{ display: 'inline', marginRight: '8px' }} />
            DRAW DEMO WINNER
          </h3>
          <p style={styles.sectionSubtitle}>Trigger a demo winner draw for a specific round</p>

          <div style={styles.inputGroup}>
            <div style={styles.inputHeader}>
              <span style={styles.inputLabel}>ROUND NUMBER</span>
              <span style={styles.balanceText}>Current: {lottery.currentRound}</span>
            </div>
            <input
              type="number"
              value={drawRound}
              onChange={(e) => setDrawRound(e.target.value)}
              placeholder={`${lottery.currentRound || '1'}`}
              style={styles.input}
            />
          </div>

          <motion.button
            onClick={handleDrawWinner}
            disabled={demoPool.isDrawPending}
            className="btn-bounce"
            style={{
              ...styles.actionButton,
              background: '#ff4d6d',
              opacity: demoPool.isDrawPending ? 0.5 : 1,
            }}
          >
            {demoPool.isDrawPending ? 'DRAWING...' : demoPool.isDrawSuccess ? '🎉 WINNER DRAWN!' : '🎲 DRAW WINNER'}
          </motion.button>
        </motion.div>

        {/* Latest Winner */}
        {demoPool.lastWinner && (
          <motion.div
            style={styles.winnerCard}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 style={styles.sectionTitle}>🏆 LATEST DEMO WINNER</h3>
            <div style={styles.winnerInfo}>
              <div style={styles.winnerIcon}>🎉</div>
              <div style={styles.winnerDetails}>
                <div style={styles.winnerLabel}>Winner Address</div>
                <div style={styles.winnerAddress}>{demoPool.lastWinner.winner}</div>
                <div style={styles.winnerStats}>
                  <div style={styles.winnerStat}>
                    <TrendingUp size={16} />
                    <span>Prize: ${demoPool.lastWinner.prize.toLocaleString()}</span>
                  </div>
                  {demoPool.lastWinner.bonus > 0 && (
                    <div style={styles.winnerStat}>
                      <Gift size={16} />
                      <span>Bonus: ${demoPool.lastWinner.bonus.toLocaleString()}</span>
                    </div>
                  )}
                  <div style={styles.winnerStat}>
                    <span>Round: #{demoPool.lastWinner.round}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#ffffff',
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '100px 40px 60px',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: '"Fredoka", sans-serif',
    fontSize: '14px',
    fontWeight: '700',
    color: '#1a1a1a',
    background: '#ffffff',
    border: '3px solid #1a1a1a',
    borderRadius: '10px',
    padding: '10px 16px',
    marginBottom: '24px',
    cursor: 'pointer',
    boxShadow: '4px 4px 0 #1a1a1a',
  },
  titleSection: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontFamily: '"Fredoka", sans-serif',
    fontSize: '48px',
    fontWeight: '900',
    color: '#1a1a1a',
    margin: '0 0 12px',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: '"Comic Neue", cursive',
    fontSize: '16px',
    fontWeight: '600',
    color: '#666',
    margin: 0,
  },
  statusCard: {
    background: '#ffffff',
    border: '5px solid #1a1a1a',
    borderRadius: '20px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '12px 12px 0 #1a1a1a',
  },
  sectionTitle: {
    fontFamily: '"Fredoka", sans-serif',
    fontSize: '24px',
    fontWeight: '900',
    color: '#1a1a1a',
    margin: '0 0 16px',
    textTransform: 'uppercase',
  },
  sectionSubtitle: {
    fontFamily: '"Comic Neue", cursive',
    fontSize: '14px',
    fontWeight: '600',
    color: '#666',
    marginBottom: '24px',
  },
  statusGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
  },
  statusItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: '#f5f5f5',
    borderRadius: '12px',
    border: '3px solid #1a1a1a',
  },
  statusIcon: {
    fontSize: '32px',
  },
  statusLabel: {
    fontFamily: '"Comic Neue", cursive',
    fontSize: '12px',
    fontWeight: '600',
    color: '#666',
    marginBottom: '4px',
  },
  statusValue: {
    fontFamily: '"Fredoka", sans-serif',
    fontSize: '18px',
    fontWeight: '900',
    color: '#1a1a1a',
  },
  actionCard: {
    background: '#ffffff',
    border: '5px solid #1a1a1a',
    borderRadius: '20px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '12px 12px 0 #1a1a1a',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  inputHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  inputLabel: {
    fontFamily: '"Comic Neue", cursive',
    fontSize: '13px',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  balanceText: {
    fontFamily: '"Comic Neue", cursive',
    fontSize: '12px',
    fontWeight: '600',
    color: '#666',
  },
  inputWrapper: {
    display: 'flex',
    gap: '8px',
  },
  input: {
    flex: 1,
    fontFamily: '"Fredoka", sans-serif',
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a1a1a',
    background: '#ffffff',
    border: '4px solid #1a1a1a',
    borderRadius: '12px',
    padding: '16px',
    outline: 'none',
  },
  maxButton: {
    fontFamily: '"Fredoka", sans-serif',
    fontSize: '14px',
    fontWeight: '900',
    color: '#1a1a1a',
    background: '#ffd23f',
    border: '4px solid #1a1a1a',
    borderRadius: '12px',
    padding: '0 20px',
    cursor: 'pointer',
    boxShadow: '4px 4px 0 #1a1a1a',
  },
  actionButton: {
    width: '100%',
    fontFamily: '"Fredoka", sans-serif',
    fontSize: '18px',
    fontWeight: '900',
    color: '#1a1a1a',
    border: '4px solid #1a1a1a',
    borderRadius: '12px',
    padding: '16px',
    cursor: 'pointer',
    boxShadow: '8px 8px 0 #1a1a1a',
    textTransform: 'uppercase',
  },
  winnerCard: {
    background: 'linear-gradient(135deg, #ffd23f 0%, #ff4d6d 100%)',
    border: '5px solid #1a1a1a',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '12px 12px 0 #1a1a1a',
  },
  winnerInfo: {
    display: 'flex',
    gap: '20px',
    padding: '24px',
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '16px',
    border: '4px solid #1a1a1a',
  },
  winnerIcon: {
    fontSize: '48px',
  },
  winnerDetails: {
    flex: 1,
  },
  winnerLabel: {
    fontFamily: '"Comic Neue", cursive',
    fontSize: '12px',
    fontWeight: '700',
    color: '#666',
    marginBottom: '4px',
  },
  winnerAddress: {
    fontFamily: '"Courier New", monospace',
    fontSize: '14px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '12px',
    wordBreak: 'break-all',
  },
  winnerStats: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
  },
  winnerStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: '"Comic Neue", cursive',
    fontSize: '13px',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  emptyState: {
    textAlign: 'center',
    padding: '100px 20px',
  },
  emptyIcon: {
    fontSize: '80px',
    marginBottom: '24px',
  },
  emptyTitle: {
    fontFamily: '"Fredoka", sans-serif',
    fontSize: '32px',
    fontWeight: '900',
    color: '#1a1a1a',
    marginBottom: '12px',
  },
  emptyText: {
    fontFamily: '"Comic Neue", cursive',
    fontSize: '16px',
    fontWeight: '600',
    color: '#666',
  },
  successNotification: {
    background: 'linear-gradient(135deg, #06d6a0 0%, #00d4ff 100%)',
    border: '4px solid var(--ink-black)',
    borderRadius: '12px',
    padding: '16px 24px',
    marginBottom: '20px',
    fontFamily: '"Fredoka", sans-serif',
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--ink-black)',
    boxShadow: '6px 6px 0 var(--ink-black)',
    textAlign: 'center',
  },
};

export default DemoPrize;
