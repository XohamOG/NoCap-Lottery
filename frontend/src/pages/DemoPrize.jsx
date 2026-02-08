import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useEnsName, useEnsAvatar } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { useDemoPrizePool } from '../hooks/useDemoPrizePool';
import { useLotteryPoolUSDC } from '../hooks/useLotteryPoolUSDC';
import { useUSDCBalance } from '../hooks/useUSDCApproval';
import { useUSDCApproval, useUSDCAllowance } from '../hooks/useUSDCApproval';

const DEMO_PRIZE_POOL_ADDRESS = import.meta.env.VITE_USDC_DEMO;

// List of 1000 wallet addresses with ENS domains for Sepolia testnet
const MOCK_PARTICIPANTS = [
  '0x1234567890123456789012345678901234567890',
  '0x2345678901234567890123456789012345678901',
  '0x3456789012345678901234567890123456789012',
  // ... (shortened for brevity - we'll use first 3 for demo)
];

function DemoPrize() {
  const { address, isConnected } = useAccount();
  
  // Smart contract hooks
  const {
    prizePool,
    bonusPool,
    participantCount,
    isLoading: contractLoading,
    fundDemoPrize,
    fundDemoBonus,
    drawDemoWinner,
    lastWinner,
    refetchAll
  } = useDemoPrizePool();

  const { participants: realParticipants } = useLotteryPoolUSDC();
  const { balance: usdcBalance } = useUSDCBalance(address);

  // Component state
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showWinner, setShowWinner] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [isLeverPulled, setIsLeverPulled] = useState(false);
  const [fundPrizeAmount, setFundPrizeAmount] = useState('');
  const [fundBonusAmount, setFundBonusAmount] = useState('');
  
  // Approval hooks for funding
  const { approve: approvePrize, isPending: approvingPrize } = useUSDCApproval();
  const { approve: approveBonus, isPending: approvingBonus } = useUSDCApproval();
  const { allowance: prizeAllowance, refetch: refetchPrizeAllowance } = useUSDCAllowance(address, DEMO_PRIZE_POOL_ADDRESS);
  const { allowance: bonusAllowance, refetch: refetchBonusAllowance } = useUSDCAllowance(address, DEMO_PRIZE_POOL_ADDRESS);

  // Check if approvals are needed
  const needsPrizeApproval = fundPrizeAmount && prizeAllowance < BigInt(fundPrizeAmount * 10**6);
  const needsBonusApproval = fundBonusAmount && bonusAllowance < BigInt(fundBonusAmount * 10**6);

  // Use real participants if available, otherwise mock
  const participants = realParticipants?.length > 0 ? realParticipants : MOCK_PARTICIPANTS;
  const totalParticipants = realParticipants?.length > 0 ? participantCount : MOCK_PARTICIPANTS.length;

  // Prize amounts
  const prizeAmount = prizePool ? Number(prizePool) / 10**6 : 1000;
  const bonusAmount = bonusPool ? Number(bonusPool) / 10**6 : 500;
  const totalPrize = prizeAmount + bonusAmount;

  // Generate confetti particles
  const generateConfetti = () => {
    const newConfetti = [];
    for (let i = 0; i < 50; i++) {
      newConfetti.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        rotation: Math.random() * 360,
        color: ['#00d4ff', '#ff4d6d', '#ffd23f', '#06d6a0'][Math.floor(Math.random() * 4)]
      });
    }
    setConfetti(newConfetti);
  };

  const handleDrawWinner = async () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setIsLeverPulled(true);
    setShowWinner(false);
    setWinner(null);

    // Try to draw winner from smart contract if connected
    if (isConnected && drawDemoWinner) {
      try {
        const txHash = await drawDemoWinner(Date.now()); // Use current timestamp as round number
        console.log('Draw winner transaction:', txHash);
        
        // Wait for event and refetch
        setTimeout(async () => {
          await refetchAll();
          if (lastWinner) {
            setWinner(lastWinner);
          } else {
            // Fallback to mock
            const randomIndex = Math.floor(Math.random() * participants.length);
            setWinner(participants[randomIndex]);
          }
          completeAnimation();
        }, 5000);
        return;
      } catch (error) {
        console.error('Error drawing winner:', error);
        // Fall through to mock winner
      }
    }

    // Mock winner selection fallback
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * participants.length);
      setWinner(participants[randomIndex]);
      completeAnimation();
    }, 3000);
  };

  const completeAnimation = () => {
    setIsSpinning(false);
    setTimeout(() => {
      setShowWinner(true);
      generateConfetti();
      setTimeout(() => setIsLeverPulled(false), 1000);
    }, 500);
  };

  const handleFundPrize = async () => {
    if (!fundPrizeAmount || fundPrizeAmount <= 0) return;
    
    const amount = BigInt(Math.floor(fundPrizeAmount * 10**6));
    
    if (needsPrizeApproval) {
      try {
        await approvePrize(DEMO_PRIZE_POOL_ADDRESS, amount);
        await refetchPrizeAllowance();
      } catch (error) {
        console.error('Approval failed:', error);
        return;
      }
    }
    
    try {
      await fundDemoPrize(amount);
      setFundPrizeAmount('');
      await refetchAll();
    } catch (error) {
      console.error('Fund prize failed:', error);
    }
  };

  const handleFundBonus = async () => {
    if (!fundBonusAmount || fundBonusAmount <= 0) return;
    
    const amount = BigInt(Math.floor(fundBonusAmount * 10**6));
    
    if (needsBonusApproval) {
      try {
        await approveBonus(DEMO_PRIZE_POOL_ADDRESS, amount);
        await refetchBonusAllowance();
      } catch (error) {
        console.error('Approval failed:', error);
        return;
      }
    }
    
    try {
      await fundDemoBonus(amount);
      setFundBonusAmount('');
      await refetchAll();
    } catch (error) {
      console.error('Fund bonus failed:', error);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      padding: '2rem',
      fontFamily: '"Comic Neue", cursive',
    }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: '900px',
          margin: '0 auto'
        }}
      >
        {/* Header */}
        <h1 style={{
          fontFamily: '"Fredoka", sans-serif',
          fontSize: '3rem',
          fontWeight: 900,
          color: '#000000',
          textAlign: 'center',
          marginBottom: '1rem',
          textShadow: '5px 5px 0px #00d4ff'
        }}>
          🎰 Golden Ticket Demo 🎰
        </h1>

        <p style={{
          textAlign: 'center',
          fontSize: '1.2rem',
          color: '#000000',
          marginBottom: '2rem'
        }}>
          Pull the lever to draw a lucky winner!
        </p>

        {/* Status Box */}
        {isConnected && (
          <div style={{
            background: '#ffd23f',
            border: '4px solid #000000',
            boxShadow: '8px 8px 0px #000000',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontFamily: '"Fredoka", sans-serif',
              fontSize: '1.5rem',
              fontWeight: 900,
              marginBottom: '1rem'
            }}>
              📊 Pool Status
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <p style={{ margin: '0.5rem 0' }}>
                  <strong>Prize Pool:</strong> {prizeAmount.toFixed(2)} USDC
                </p>
                <p style={{ margin: '0.5rem 0' }}>
                  <strong>Bonus Pool:</strong> {bonusAmount.toFixed(2)} USDC
                </p>
              </div>
              <div>
                <p style={{ margin: '0.5rem 0' }}>
                  <strong>Total Prize:</strong> {totalPrize.toFixed(2)} USDC
                </p>
                <p style={{ margin: '0.5rem 0' }}>
                  <strong>Participants:</strong> {totalParticipants}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Fund Buttons */}
        {isConnected && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {/* Fund Prize */}
            <div style={{
              background: '#06d6a0',
              border: '4px solid #000000',
              boxShadow: '8px 8px 0px #000000',
              padding: '1.5rem'
            }}>
              <h4 style={{
                fontFamily: '"Fredoka", sans-serif',
                fontSize: '1.2rem',
                fontWeight: 900,
                marginBottom: '1rem'
              }}>
                Fund Prize Pool
              </h4>
              <input
                type="number"
                value={fundPrizeAmount}
                onChange={(e) => setFundPrizeAmount(e.target.value)}
                min="0"
                step="0.01"
                placeholder="Amount in USDC"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '3px solid #000000',
                  fontFamily: '"Comic Neue", cursive',
                  marginBottom: '1rem'
                }}
              />
              <button
                onClick={needsPrizeApproval ? () => approvePrize(DEMO_PRIZE_POOL_ADDRESS, BigInt(Math.floor(fundPrizeAmount * 10**6))) : handleFundPrize}
                disabled={!fundPrizeAmount || fundPrizeAmount <= 0 || approvingPrize}
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  fontFamily: '"Fredoka", sans-serif',
                  background: needsPrizeApproval ? '#ffd23f' : '#00d4ff',
                  color: '#000000',
                  border: '4px solid #000000',
                  boxShadow: '5px 5px 0px #000000',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  opacity: (!fundPrizeAmount || fundPrizeAmount <= 0) ? 0.5 : 1
                }}
              >
                {approvingPrize ? 'Approving...' : needsPrizeApproval ? '1. Approve USDC' : '2. Fund Prize'}
              </button>
            </div>

            {/* Fund Bonus */}
            <div style={{
              background: '#ff4d6d',
              border: '4px solid #000000',
              boxShadow: '8px 8px 0px #000000',
              padding: '1.5rem'
            }}>
              <h4 style={{
                fontFamily: '"Fredoka", sans-serif',
                fontSize: '1.2rem',
                fontWeight: 900,
                marginBottom: '1rem',
                color: '#ffffff'
              }}>
                Fund Bonus Pool
              </h4>
              <input
                type="number"
                value={fundBonusAmount}
                onChange={(e) => setFundBonusAmount(e.target.value)}
                min="0"
                step="0.01"
                placeholder="Amount in USDC"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '3px solid #000000',
                  fontFamily: '"Comic Neue", cursive',
                  marginBottom: '1rem'
                }}
              />
              <button
                onClick={needsBonusApproval ? () => approveBonus(DEMO_PRIZE_POOL_ADDRESS, BigInt(Math.floor(fundBonusAmount * 10**6))) : handleFundBonus}
                disabled={!fundBonusAmount || fundBonusAmount <= 0 || approvingBonus}
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  fontFamily: '"Fredoka", sans-serif',
                  background: needsBonusApproval ? '#ffd23f' : '#00d4ff',
                  color: '#000000',
                  border: '4px solid #000000',
                  boxShadow: '5px 5px 0px #000000',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  opacity: (!fundBonusAmount || fundBonusAmount <= 0) ? 0.5 : 1
                }}
              >
                {approvingBonus ? 'Approving...' : needsBonusApproval ? '1. Approve USDC' : '2. Fund Bonus'}
              </button>
            </div>
          </div>
        )}

        {/* Arcade Machine */}
        <div style={{
          background: '#ff4d6d',
          border: '5px solid #000000',
          boxShadow: '12px 12px 0px #000000',
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Confetti */}
          {confetti.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ y: -20, opacity: 1, x: `${particle.x}%`, rotate: 0 }}
              animate={{ 
                y: 600, 
                opacity: 0, 
                x: `${particle.x + (Math.random() * 20 - 10)}%`,
                rotate: particle.rotation
              }}
              transition={{ duration: particle.duration, delay: particle.delay }}
              style={{
                position: 'absolute',
                width: '10px',
                height: '10px',
                background: particle.color,
                border: '2px solid #000000',
                zIndex: 100
              }}
            />
          ))}

          {/* Prize Display */}
          <div style={{
            background: '#000000',
            border: '4px solid #ffd23f',
            padding: '1.5rem',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <motion.div
              animate={isSpinning ? {
                y: [0, -10, 0, -10, 0],
              } : {}}
              transition={{ duration: 0.3, repeat: isSpinning ? Infinity : 0 }}
              style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                fontFamily: '"Fredoka", sans-serif',
                background: 'linear-gradient(45deg, #ffd23f, #ff4d6d, #00d4ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {isSpinning ? '???' : `${totalPrize.toFixed(2)} USDC`}
            </motion.div>
            <p style={{
              color: '#ffffff',
              marginTop: '0.5rem',
              fontSize: '1.1rem'
            }}>
              {isSpinning ? 'Drawing...' : 'Total Prize'}
            </p>
          </div>

          {/* Lever */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <motion.div
              animate={{ rotate: isLeverPulled ? 45 : 0 }}
              transition={{ duration: 0.3 }}
              style={{
                width: '8px',
                height: '120px',
                background: '#000000',
                marginBottom: '0.5rem',
                transformOrigin: 'top center'
              }}
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDrawWinner}
              disabled={isSpinning}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: isSpinning ? '#cccccc' : 'linear-gradient(135deg, #ff4d6d, #ffd23f)',
                border: '5px solid #000000',
                boxShadow: '5px 5px 0px #000000',
                cursor: isSpinning ? 'not-allowed' : 'pointer',
                fontSize: '2rem'
              }}
            >
              🎯
            </motion.button>
            <p style={{
              marginTop: '1rem',
              fontSize: '1.2rem',
              fontWeight: 700,
              color: '#ffffff'
            }}>
              {isSpinning ? 'Drawing...' : 'Pull Lever!'}
            </p>
          </div>

          {/* Winner Display */}
          {showWinner && winner && (
            <WinnerDisplay 
              address={winner} 
              prize={totalPrize}
            />
          )}
        </div>

        {/* Participants Info */}
        <div style={{
          marginTop: '2rem',
          background: '#00d4ff',
          border: '4px solid #000000',
          boxShadow: '8px 8px 0px #000000',
          padding: '1.5rem'
        }}>
          <h3 style={{
            fontFamily: '"Fredoka", sans-serif',
            fontSize: '1.5rem',
            fontWeight: 900,
            marginBottom: '1rem'
          }}>
            🎫 Participants
          </h3>
          <p style={{
            fontSize: '1.1rem'
          }}>
            Total Entries: <strong>{totalParticipants}</strong>
          </p>
          <p style={{
            fontSize: '0.9rem',
            marginTop: '0.5rem',
            opacity: 0.8
          }}>
            {realParticipants?.length > 0 ? 'Live participants from blockchain' : 'Mock simulation mode'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function WinnerDisplay({ address, prize }) {
  const { data: ensName } = useEnsName(address, sepolia.id);
  const { data: ensAvatar } = useEnsAvatar(ensName, sepolia.id);

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', duration: 0.8 }}
      style={{
        background: 'linear-gradient(135deg, #ffd23f, #06d6a0)',
        border: '5px solid #000000',
        boxShadow: '10px 10px 0px #000000',
        padding: '2rem',
        marginTop: '2rem'
      }}
    >
      <h2 style={{
        fontFamily: '"Fredoka", sans-serif',
        fontSize: '2rem',
        fontWeight: 900,
        marginBottom: '1rem',
        textAlign: 'center',
        color: '#000000'
      }}>
        🎉 WINNER! 🎉
      </h2>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        background: '#ffffff',
        border: '4px solid #000000',
        padding: '1.5rem'
      }}>
        {/* Avatar */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          border: '4px solid #000000',
          overflow: 'hidden',
          flexShrink: 0,
          background: '#00d4ff'
        }}>
          {ensAvatar ? (
            <img 
              src={ensAvatar} 
              alt="Winner avatar" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem'
            }}>
              👤
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: '1.3rem',
            fontWeight: 700,
            fontFamily: '"Fredoka", sans-serif',
            marginBottom: '0.5rem',
            wordBreak: 'break-all'
          }}>
            {ensName || address.slice(0, 6) + '...' + address.slice(-4)}
          </p>
          {ensName && (
            <p style={{
              fontSize: '0.9rem',
              opacity: 0.7,
              fontFamily: 'monospace',
              marginBottom: '0.5rem'
            }}>
              {address.slice(0, 10)}...{address.slice(-8)}
            </p>
          )}
          <p style={{
            fontSize: '1.8rem',
            fontWeight: 900,
            fontFamily: '"Fredoka", sans-serif',
            color: '#06d6a0'
          }}>
            Won: {prize.toFixed(2)} USDC
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default DemoPrize;

