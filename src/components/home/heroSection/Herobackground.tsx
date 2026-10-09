const Herobackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[var(--color-bg-page)]">
      {/* Subtle dot grid — very faint, professional texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, var(--color-border-light) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
          opacity: 0.6,
        }}
      />
      {/* Single very soft blue glow in top-right to give visual direction */}
      <div className="absolute -top-40 -end-40 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-[140px]" />
    </div>
  );
};

export default Herobackground;

