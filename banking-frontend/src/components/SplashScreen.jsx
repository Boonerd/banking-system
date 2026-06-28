import { useEffect } from 'react';

const BRAND_NAME = 'Horizon Bank';

function SplashScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="splash-frame">
      <div className="splash-content-wrapper">
        <h1 className="splash-wordmark">
          {BRAND_NAME.split('').map((char, i) => (
            <span
              key={i}
              className="splash-letter"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>
        <div className="splash-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;