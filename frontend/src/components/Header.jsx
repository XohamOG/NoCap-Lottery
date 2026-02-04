import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        ...styles.headerWrapper,
      }}
    >
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          ...styles.header,
          transform: isScrolled ? 'translateY(0.5rem)' : 'translateY(1rem)',
        }}
        className="animate-fade-in"
      >
        <div style={styles.container}>
          <div style={styles.logo} onClick={() => navigate('/')} className="cursor-pointer hover-lift">
            <motion.span
              animate={{ rotate: [0, -8, 8, -8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              style={styles.logoIcon}
            >
              🏆
            </motion.span>
            <span style={styles.logoText}>NOCAP!</span>
          </div>

          <nav style={styles.nav} className="nav-desktop">
            <button 
              onClick={() => navigate('/')} 
              style={{ 
                ...styles.navLink, 
                background: isActive('/') ? 'var(--marker-yellow)' : 'white',
                padding: '10px 20px',
                borderRadius: '12px',
                border: '3px solid var(--ink-black)',
                boxShadow: isActive('/') ? '4px 4px 0 var(--ink-black)' : '3px 3px 0 var(--ink-black)',
              }}
              className="btn-bounce"
            >
              🏠 HOME
            </button>
            <button 
              onClick={() => navigate('/pools')} 
              style={{ 
                ...styles.navLink,
                background: (isActive('/pools') || location.pathname.startsWith('/pools/')) ? 'var(--marker-cyan)' : 'white',
                padding: '10px 20px',
                borderRadius: '12px',
                border: '3px solid var(--ink-black)',
                boxShadow: (isActive('/pools') || location.pathname.startsWith('/pools/')) ? '4px 4px 0 var(--ink-black)' : '3px 3px 0 var(--ink-black)',
              }}
              className="btn-bounce"
            >
              🎮 PLAY GAME
            </button>
            <button 
              onClick={() => {
                const winnersSection = document.getElementById('winners');
                if (winnersSection) {
                  winnersSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate('/');
                  setTimeout(() => {
                    document.getElementById('winners')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }} 
              style={{ 
                ...styles.navLink,
                background: 'white',
                padding: '10px 20px',
                borderRadius: '12px',
                border: '3px solid var(--ink-black)',
                boxShadow: '3px 3px 0 var(--ink-black)',
              }}
              className="btn-bounce"
            >
              🏆 WINNERS
            </button>
          </nav>

          <div className="btn-bounce">
            <ConnectButton />
          </div>
        </div>
      </motion.div>
    </header>
  );
}

const styles = {
  headerWrapper: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    display: 'flex',
    justifyContent: 'center',
    padding: '0 1.5rem',
  },
  header: {
    width: '100%',
    maxWidth: '1200px',
    background: 'white',
    border: '4px solid var(--ink-black)',
    borderRadius: '20px',
    boxShadow: '6px 6px 0 var(--ink-black)',
    transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    backdropFilter: 'blur(10px)',
  },
  container: {
    padding: '1rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  logoIcon: {
    fontSize: '2rem',
    display: 'inline-block',
  },
  logoText: {
    color: 'var(--ink-black)',
    fontFamily: 'Fredoka, sans-serif',
    fontSize: '1.75rem',
    fontWeight: 900,
  },
  nav: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  navLink: {
    fontFamily: 'Fredoka, sans-serif',
    fontSize: '1rem',
    fontWeight: 700,
    textDecoration: 'none',
    transition: 'all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    color: 'var(--ink-black)',
    cursor: 'pointer',
  },
};
