import { useEffect, useState } from 'react';
import './ClickSpark.css';

const ClickSpark = () => {
  const [sparks, setSparks] = useState([]);

  useEffect(() => {
    const handleClick = (e) => {
      const spark = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };
      setSparks((prev) => [...prev, spark]);

      setTimeout(() => {
        setSparks((prev) => prev.filter((s) => s.id !== spark.id));
      }, 1000);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      {sparks.map((spark) => (
        <div
          key={spark.id}
          className="spark-container"
          style={{
            left: spark.x,
            top: spark.y,
          }}
        >
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="spark"
              style={{
                transform: `rotate(${i * 45}deg)`,
              }}
            />
          ))}
        </div>
      ))}
    </>
  );
};

export default ClickSpark;
