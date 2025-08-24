import React, { useEffect, useRef } from 'react';

interface FireworksProps {
  isActive: boolean;
  duration?: number; // ms
  onComplete?: () => void;
}

const Fireworks: React.FC<FireworksProps> = ({ isActive, duration = 3500, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) return;
  const canvas = canvasRef.current;
  if (!canvas) return;
  const c = canvas as HTMLCanvasElement;
  const ctx = c.getContext('2d');
  if (!ctx) return;

  let width = (c.width = window.innerWidth);
  let height = (c.height = window.innerHeight);

  const colors = ['#ff6b6b', '#ffd93d', '#6bffb8', '#6bb3ff', '#d36bff', '#ff9ecb'];

  // Visual scaling: increase size/thickness by 200% as requested
  const SIZE_SCALE = 2; // 200%

  const particles: Array<any> = [];

    function resize() {
      width = c.width = window.innerWidth;
      height = c.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);

    const centerX = width / 2;
    const centerY = height / 2;

    function spawnBurst(strength = 6, count = 80) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 0.6 + 0.4) * (6 + strength);
        particles.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 100 + Math.random() * 50,
          ttl: 100 + Math.random() * 50,
          color: colors[Math.floor(Math.random() * colors.length)],
          // scale up the base size
          size: (1 + Math.random() * 3) * SIZE_SCALE,
        });
      }
    }

    // create a few staggered bursts at center
    spawnBurst(8, 140);
    const t1 = window.setTimeout(() => spawnBurst(6, 90), 250);
    const t2 = window.setTimeout(() => spawnBurst(4, 70), 500);

    const gravity = 0.12;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += gravity * (Math.random() * 0.6 + 0.7);
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1.5 + Math.random();

        const alpha = Math.max(0, p.life / p.ttl);

  // main particle
  ctx.beginPath();
  ctx.fillStyle = p.color;
  ctx.globalAlpha = alpha;
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  // trailing line (thicker for scaled particles)
  ctx.beginPath();
  ctx.strokeStyle = p.color;
  ctx.globalAlpha = alpha * 0.6;
  ctx.lineWidth = Math.max(1, p.size * 0.4); // thicker trail
  ctx.moveTo(p.x - p.vx * 0.2, p.y - p.vy * 0.2);
  ctx.lineTo(p.x, p.y);
  ctx.stroke();
  ctx.closePath();

        if (p.life <= 0) particles.splice(i, 1);
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    }

    draw();

    const endTimer = window.setTimeout(() => {
      // stop animation loop
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener('resize', resize);
      // allow a short fade-out before calling complete
      if (onComplete) onComplete();
    }, duration);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.clearTimeout(endTimer);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener('resize', resize);
    };
  }, [isActive, duration, onComplete]);

  if (!isActive) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default Fireworks;
