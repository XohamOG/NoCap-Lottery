import { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    const timer2 = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <div className="splash-logo-wrapper">
          <div className="splash-logo">No Cap Lottery</div>
          <div className="splash-particles">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  '--delay': `${i * 0.1}s`,
                  '--angle': `${i * 18}deg`,
                }}
              />
            ))}
          </div>
        </div>
        <div className="splash-tagline">No loss. No scam. Just vibes.</div>
        <div className="splash-loader">
          <div className="loader-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
