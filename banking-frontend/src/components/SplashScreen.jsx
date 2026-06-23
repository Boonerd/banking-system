const BRAND_NAME = 'Horizon Bank';

function SplashScreen() {
  return (
    <div className="splash-screen">
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
  );
}

export default SplashScreen;