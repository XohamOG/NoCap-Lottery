import { useAccount, useDisconnect } from 'wagmi';
import { useEns } from '../hooks/useEns';
import { Copy, ExternalLink, LogOut, User } from 'lucide-react';
import { useState } from 'react';

export function CustomAccountModal({ isOpen, onClose }) {
  const { address } = useAccount();
  const { displayName, ensAvatar, hasEnsName, formattedAddress } = useEns(address);
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  const handleViewExplorer = () => {
    if (address) {
      window.open(`https://sepolia.etherscan.io/address/${address}`, '_blank');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        style={styles.backdrop}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>Account</h3>
          <button 
            onClick={onClose}
            style={styles.closeButton}
          >
            ✕
          </button>
        </div>

        <div style={styles.content}>
          {/* Avatar and Name */}
          <div style={styles.avatarSection}>
            <div style={styles.avatarContainer}>
              {ensAvatar ? (
                <img 
                  src={ensAvatar} 
                  alt="ENS Avatar" 
                  style={styles.avatarImage}
                />
              ) : (
                <User size={40} color="var(--ink-black)" />
              )}
            </div>
            <div style={styles.nameSection}>
              <div style={styles.displayName}>
                {displayName}
                {hasEnsName && (
                  <span style={styles.ensBadge}>ENS</span>
                )}
              </div>
              {hasEnsName && (
                <div style={styles.fullAddress}>{formattedAddress}</div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div style={styles.actions}>
            <button 
              onClick={handleCopy}
              style={styles.actionButton}
            >
              <Copy size={18} />
              {copied ? 'Copied!' : 'Copy Address'}
            </button>
            
            <button 
              onClick={handleViewExplorer}
              style={styles.actionButton}
            >
              <ExternalLink size={18} />
              View on Explorer
            </button>
          </div>

          {/* Disconnect Button */}
          <button 
            onClick={handleDisconnect}
            style={styles.disconnectButton}
          >
            <LogOut size={18} />
            Disconnect
          </button>
        </div>
      </div>
    </>
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    backdropFilter: 'blur(4px)',
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    borderRadius: '15px 5px 15px 5px / 5px 15px 5px 15px',
    border: '4px solid var(--ink-black)',
    boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)',
    padding: '1.5rem',
    maxWidth: '400px',
    width: '90%',
    zIndex: 1000,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  title: {
    fontFamily: 'Fredoka, sans-serif',
    fontWeight: 900,
    fontSize: '1.5rem',
    color: 'var(--ink-black)',
    margin: 0,
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: 'var(--ink-black)',
    padding: '0.25rem',
    lineHeight: 1,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: 'var(--bg-offwhite)',
    border: '3px solid var(--ink-black)',
    borderRadius: '12px',
  },
  avatarContainer: {
    width: '64px',
    height: '64px',
    background: 'var(--marker-cyan)',
    border: '3px solid var(--ink-black)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  nameSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    minWidth: 0,
  },
  displayName: {
    fontFamily: 'Fredoka, sans-serif',
    fontWeight: 900,
    fontSize: '1.25rem',
    color: 'var(--ink-black)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    wordBreak: 'break-all',
  },
  ensBadge: {
    fontFamily: 'Fredoka, sans-serif',
    fontSize: '0.7rem',
    fontWeight: '900',
    color: 'white',
    background: 'linear-gradient(135deg, #5298FF 0%, #3B7EEE 100%)',
    padding: '2px 8px',
    borderRadius: '6px',
    border: '2px solid var(--ink-black)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    flexShrink: 0,
  },
  fullAddress: {
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    color: 'rgba(0, 0, 0, 0.6)',
  },
  actions: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    background: 'white',
    border: '3px solid var(--ink-black)',
    borderRadius: '10px',
    fontFamily: 'Fredoka, sans-serif',
    fontWeight: 700,
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)',
  },
  disconnectButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.875rem',
    background: '#ff4d6d',
    color: 'white',
    border: '3px solid var(--ink-black)',
    borderRadius: '10px',
    fontFamily: 'Fredoka, sans-serif',
    fontWeight: 900,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
    width: '100%',
  },
};
