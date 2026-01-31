import { useState, useEffect } from 'react';

export function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--glow-color) 0%, transparent 70%)',
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 0,
        transition: 'left 0.1s ease-out, top 0.1s ease-out',
      }}
    />
  );
}
