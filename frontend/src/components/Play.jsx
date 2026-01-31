import { useState } from 'react';
import { Wallet, ArrowDownCircle, ArrowUpCircle, Zap, Clock } from 'lucide-react';

const chains = [
  { id: 'ethereum', name: 'Ethereum', icon: '⟠' },
  { id: 'arbitrum', name: 'Arbitrum', icon: '🔷' },
  { id: 'optimism', name: 'Optimism', icon: '🔴' },
  { id: 'base', name: 'Base', icon: '🔵' }
];

export function Play() {
  const [selectedChain, setSelectedChain] = useState('ethereum');
  const [principalAmount] = useState('100'); // Fixed amount
  const [activeTab, setActiveTab] = useState('deposit');

  const handleDeposit = () => {
    console.log('Deposit', principalAmount, 'on', selectedChain);
    alert(`Depositing ${principalAmount} USDC on ${chains.find(c => c.id === selectedChain)?.name}`);
  };

  const handleWithdraw = () => {
    console.log('Withdraw with prize');
    alert('Withdrawing principal + prize!');
  };

  const handleInstantWithdraw = () => {
    console.log('Instant withdraw (no prize)');
    alert('Instant withdrawal: Principal returned, no prize.');
  };

  const handleSimulateWeek = () => {
    console.log('Simulating 1 week');
    alert('⚡ Fast-forwarding 1 week for hackathon demo...');
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '9rem 1.5rem 4rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '3rem',
      paddingBottom: '6rem'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        maxWidth: '900px'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '1.5rem',
          color: 'var(--foreground)',
          fontFamily: 'monospace',
          lineHeight: '1.3'
        }}>
          cross-chain. <span style={{ color: 'var(--primary)' }}>no-loss.</span> prize savings.
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: 'rgba(255, 255, 255, 0.7)',
          lineHeight: '1.8',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          Deposit stablecoins from any chain. Your principal goes into an Aave yield vault on Base Sepolia. 
          Only the <span style={{ color: 'var(--primary)', fontWeight: '600' }}>yield is distributed as prizes</span> — 
          your original deposit is always safe and withdrawable.
        </p>
      </div>

      {/* Main Play Interface */}
      <div style={{
        width: '100%',
        maxWidth: '600px',
        background: 'rgba(0, 0, 0, 0.5)',
        border: '1px solid var(--primary)',
        borderRadius: '12px',
        padding: '2rem',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          borderBottom: '1px solid rgba(0, 255, 157, 0.2)',
          paddingBottom: '1rem'
        }}>
          <button
            onClick={() => setActiveTab('deposit')}
            style={{
              background: activeTab === 'deposit' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'deposit' ? '#000' : 'var(--foreground)',
              border: 'none',
              padding: '0.5rem 1.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all 0.3s ease'
            }}
          >
            Deposit
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            style={{
              background: activeTab === 'withdraw' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'withdraw' ? '#000' : 'var(--foreground)',
              border: 'none',
              padding: '0.5rem 1.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all 0.3s ease'
            }}
          >
            Withdraw
          </button>
        </div>

        {/* Deposit Tab */}
        {activeTab === 'deposit' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Chain Selection */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.75rem',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Select Chain
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem'
              }}>
                {chains.map(chain => (
                  <button
                    key={chain.id}
                    onClick={() => setSelectedChain(chain.id)}
                    style={{
                      background: selectedChain === chain.id ? 'rgba(0, 255, 157, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: selectedChain === chain.id ? '2px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '1rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      transition: 'all 0.3s ease',
                      fontFamily: 'monospace',
                      color: 'var(--foreground)',
                      fontSize: '1rem'
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{chain.icon}</span>
                    <span>{chain.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Principal Amount Display */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.75rem',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Principal Amount (Protected in Aave Vault)
              </label>
              <div style={{
                background: 'rgba(0, 255, 157, 0.05)',
                border: '1px solid var(--primary)',
                borderRadius: '8px',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: 'monospace'
              }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--foreground)' }}>
                  {principalAmount}
                </span>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>USDC</span>
              </div>
              <p style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.5)',
                marginTop: '0.5rem',
                fontFamily: 'monospace'
              }}>
                🔒 Earning yield via Aave ERC-4626 • Principal always withdrawable
              </p>
            </div>

            {/* Deposit Button */}
            <button
              onClick={handleDeposit}
              style={{
                background: 'var(--primary)',
                color: '#000',
                border: 'none',
                padding: '1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontSize: '1rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
                marginTop: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.boxShadow = '0 0 20px rgba(0, 255, 157, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <ArrowDownCircle size={20} />
              Deposit Now
            </button>
          </div>
        )}

        {/* Withdraw Tab */}
        {activeTab === 'withdraw' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Your Balance */}
            <div style={{
              background: 'rgba(0, 255, 157, 0.1)',
              border: '1px solid var(--primary)',
              borderRadius: '8px',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Your Vault Balance
              </div>
              <div style={{
                fontSize: '2rem',
                fontWeight: '700',
                fontFamily: 'monospace',
                color: 'var(--primary)'
              }}>
                125.50 <span style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.6)' }}>USDC</span>
              </div>
              <div style={{
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                color: 'rgba(255, 255, 255, 0.6)',
                marginTop: '0.5rem'
              }}>
                Principal: 100 USDC | Yield Earned: +25.50 USDC
              </div>
              <div style={{
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                color: 'rgba(0, 255, 157, 0.8)',
                marginTop: '0.75rem',
                padding: '0.5rem',
                background: 'rgba(0, 255, 157, 0.05)',
                borderRadius: '4px'
              }}>
                💰 Yield enters prize pool • Principal guaranteed safe
              </div>
            </div>

            {/* Withdraw Options */}
            <button
              onClick={handleWithdraw}
              style={{
                background: 'var(--primary)',
                color: '#000',
                border: 'none',
                padding: '1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontSize: '1rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.boxShadow = '0 0 20px rgba(0, 255, 157, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <ArrowUpCircle size={20} />
              Withdraw with Prize
            </button>

            <button
              onClick={handleInstantWithdraw}
              style={{
                background: 'transparent',
                color: 'var(--foreground)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontSize: '1rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.color = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.color = 'var(--foreground)';
              }}
            >
              <Zap size={20} />
              Instant Withdraw (Principal Only)
            </button>
          </div>
        )}
      </div>

      {/* Demo Controls */}
      <div style={{
        width: '100%',
        maxWidth: '600px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '1.5rem',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          fontSize: '0.875rem',
          fontFamily: 'monospace',
          color: 'rgba(255, 255, 255, 0.6)',
          marginBottom: '1rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          🎮 Hackathon Demo Controls
        </div>
        <button
          onClick={handleSimulateWeek}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'var(--foreground)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease',
            width: '100%',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = 'var(--primary)';
            e.target.style.background = 'rgba(0, 255, 157, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <Clock size={16} />
          Simulate 1 Week
        </button>
      </div>
    </div>
  );
}
