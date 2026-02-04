import { motion } from 'framer-motion';

export function FloatingCoins() {
  const coins = [
    { x: '10%', y: '20%', delay: 0, duration: 2.5 },
    { x: '85%', y: '15%', delay: 0.5, duration: 3 },
    { x: '20%', y: '70%', delay: 1, duration: 2.8 },
    { x: '75%', y: '65%', delay: 0.8, duration: 3.2 },
    { x: '50%', y: '40%', delay: 0.3, duration: 3.5 },
  ];

  return (
    <>
      {coins.map((coin, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 360],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: coin.duration,
            repeat: Infinity,
            delay: coin.delay,
            ease: "easeInOut",
          }}
          style={{
            position: 'absolute',
            left: coin.x,
            top: coin.y,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          <div className="gaming-coin" style={{ opacity: 0.25 }}>
            🪙
          </div>
        </motion.div>
      ))}
    </>
  );
}
