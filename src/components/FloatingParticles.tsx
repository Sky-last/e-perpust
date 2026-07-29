import { useEffect, useRef } from 'react';

interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

export default function FloatingParticles({ count = 30, className = '' }: FloatingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    type Particle = {
      x: number; y: number;
      vx: number; vy: number;
      size: number;
      opacity: number;
      hue: number;
      type: 'dot' | 'book' | 'star';
      angle: number; angleV: number;
    };

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.5 - 0.2,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.6 + 0.1,
      hue: Math.random() * 60 + 200, // blue to purple range
      type: Math.random() < 0.1 ? 'book' : Math.random() < 0.15 ? 'star' : 'dot',
      angle: Math.random() * Math.PI * 2,
      angleV: (Math.random() - 0.5) * 0.02,
    }));

    const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const px = x + Math.cos(angle) * size;
        const py = y + Math.sin(angle) * size;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    const drawBook = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      const w = size * 3;
      const h = size * 4;
      ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(-w / 2, -h / 2, w, h);
      // Pages line
      ctx.beginPath();
      ctx.moveTo(-w / 2 + 2, -h / 2);
      ctx.lineTo(-w / 2 + 2, h / 2);
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.stroke();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.angleV;

        // Wrap around edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        ctx.save();
        ctx.globalAlpha = p.opacity;

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        gradient.addColorStop(0, `hsla(${p.hue}, 80%, 70%, 1)`);
        gradient.addColorStop(1, `hsla(${p.hue}, 80%, 70%, 0)`);
        ctx.fillStyle = gradient;

        if (p.type === 'dot') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'star') {
          ctx.fillStyle = `hsla(${p.hue}, 90%, 75%, ${p.opacity})`;
          drawStar(ctx, p.x, p.y, p.size * 1.5);
          ctx.fill();
        } else if (p.type === 'book') {
          ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${p.opacity * 0.7})`;
          drawBook(ctx, p.x, p.y, p.size * 1.5, p.angle);
        }

        ctx.restore();
      });

      animFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ opacity: 0.7 }}
    />
  );
}
