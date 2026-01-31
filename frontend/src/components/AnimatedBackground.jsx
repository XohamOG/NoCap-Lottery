import { useEffect } from 'react';
import './AnimatedBackground.css';

const AnimatedBackground = () => {
  return (
    <div className="animated-bg">
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <div className="bg-orb bg-orb-3"></div>
      <div className="bg-grid"></div>
      <div className="bg-particles">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="bg-particle"
            style={{
              '--x': `${Math.random() * 100}%`,
              '--y': `${Math.random() * 100}%`,
              '--duration': `${15 + Math.random() * 10}s`,
              '--delay': `${Math.random() * 5}s`,
              '--size': `${2 + Math.random() * 3}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedBackground;
