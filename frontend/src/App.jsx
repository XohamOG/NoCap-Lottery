import { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { Wallet, Trophy, TrendingUp, Users, Clock } from 'lucide-react';
import './App.css';
import SplashScreen from './components/SplashScreen';
import AnimatedBackground from './components/AnimatedBackground';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [walletAddress, setWalletAddress] = useState('');
  const [selectedChain, setSelectedChain] = useState('Ethereum');
  const [depositAmount, setDepositAmount] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const chains = ['Ethereum', 'Arbitrum', 'Optimism', 'Base'];
  const rotatingWords = ['cap', 'loss', 'scam', 'stress', 'worries', 'risk'];
  
  const recentWinners = [
    { rank: '🥇', ens: 'vitalik.eth', address: '0x742d...b3f9', prize: '$12,450' },
    { rank: '🥈', ens: 'crypto.eth', address: '0x892a...c1e4', prize: '$8,320' },
    { rank: '🥉', ens: 'whale.eth', address: '0x123f...a8d2', prize: '$5,100' },
    { rank: '4', ens: 'defi.eth', address: '0x456b...c3e9', prize: '$2,750' },
    { rank: '5', ens: 'hodl.eth', address: '0x789c...d4f1', prize: '$1,380' }
  ];

  const stats = [
    { icon: TrendingUp, label: 'Total Deposits', value: '$2.4M' },
    { icon: Users, label: 'Active Users', value: '12,847' },
    { icon: Trophy, label: 'Prize Pool', value: '$125K' },
    { icon: Clock, label: 'Next Draw', value: '23:45:12' }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % rotatingWords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const handleDeposit = () => {
    if (!walletAddress) {
      alert('Please connect your wallet first');
      return;
    }
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert('Please enter a valid deposit amount');
      return;
    }
    console.log(`Depositing ${depositAmount} on ${selectedChain}`);
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="app">
      <AnimatedBackground />
      
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-logo">
            <Trophy className="logo-icon" />
            <span className="logo-text">NoCap Lottery</span>
          </div>
          <button 
            className={`connect-btn ${walletAddress ? 'connected' : ''}`}
            onClick={connectWallet}
          >
            <Wallet size={20} />
            {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to the Future of Fair Play
          </h1>
          <div className="hero-tagline">
            <span className="static-text">No </span>
            <span className="rotating-words">
              <span 
                className="rotating-word active" 
                key={rotatingWords[currentWordIndex]}
              >
                {rotatingWords[currentWordIndex]}
              </span>
            </span>
            <span className="static-text">. Just vibes.</span>
          </div>
          <p className="hero-description">
            Experience transparent, on-chain lottery draws with instant payouts.
            Your luck, your chain, your prize.
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-icon-wrapper">
                <Icon className="stat-icon" size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="main-grid">
        {/* Deposit Section */}
        <div className="section deposit-section">
          <h2 className="section-title">Make a Deposit</h2>
          <div className="deposit-form">
            <div className="form-group">
              <label className="form-label">Select Chain</label>
              <div className="chain-selector">
                {chains.map((chain) => (
                  <button
                    key={chain}
                    className={`chain-btn ${selectedChain === chain ? 'active' : ''}`}
                    onClick={() => setSelectedChain(chain)}
                  >
                    {chain}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Amount (ETH)</label>
              <input
                type="number"
                className="amount-input"
                placeholder="0.0"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </div>
            <button className="deposit-btn" onClick={handleDeposit}>
              Deposit Now
            </button>
          </div>
        </div>

        {/* Winners Section */}
        <div className="section winners-section">
          <h2 className="section-title">Recent Winners</h2>
          <div className="winners-list">
            {recentWinners.map((winner, index) => (
              <div key={index} className="winner-item">
                <span className="winner-rank">{winner.rank}</span>
                <div className="winner-info">
                  <div className="winner-ens">{winner.ens}</div>
                  <div className="winner-address">{winner.address}</div>
                </div>
                <div className="winner-prize">{winner.prize}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
