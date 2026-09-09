import React, { useEffect, useRef } from 'react';
import { usePerformance } from '../context/PerformanceContext';

/**
 * HeroAgricultureCanvas:
 * Recreates the agricultural cinematic movement inspired by the Dribbble Agrovia reference:
 * - Multi-layered lush agricultural field with gentle breeze swaying organic crop stalks/wheat
 * - Morning ambient sunrays and floating organic spore/light particles
 * - Responsive to mouse sway and gentle harmonic wind physics
 * - Smooth 60fps canvas animation that is always active
 */
export const HeroAgricultureCanvas: React.FC = () => {
  const { isLiteMode } = usePerformance();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth || 1200);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const isMobileViewport = width < 768;

    // IntersectionObserver: Pause only when completely scrolled off-screen to save battery
    let observer: IntersectionObserver | null = null;
    if (containerRef.current && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            const wasVisible = isVisible;
            isVisible = entry.isIntersecting;
            if (!wasVisible && isVisible) {
              render();
            }
          });
        },
        { threshold: 0.01 }
      );
      observer.observe(containerRef.current);
    }

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 650;
      initStalks();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Mouse coordinates for gentle interactive sway
    let mouseX = width / 2;
    let targetMouseX = width / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Particle system (floating morning pollen / spores)
    interface Particle {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      alphaSpeed: number;
    }

    const particleCount = isLiteMode ? 14 : isMobileViewport ? 20 : 45;
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 1,
      vx: Math.random() * 0.4 - 0.15,
      vy: -(Math.random() * 0.5 + 0.25),
      alpha: Math.random() * 0.6 + 0.2,
      alphaSpeed: Math.random() * 0.01 + 0.005,
    }));

    // Crop / Wheat Stalk structures
    interface Stalk {
      x: number;
      baseY: number;
      height: number;
      bendOffset: number;
      phase: number;
      speed: number;
      color: string;
      earLength: number;
      layer: number;
    }

    let stalks: Stalk[] = [];

    const initStalks = () => {
      stalks = [];
      const spacing = isLiteMode ? 22 : isMobileViewport ? 18 : 14;
      const count = Math.max(15, Math.floor(width / spacing));

      for (let i = 0; i < count; i++) {
        const layer = i % 3;
        const x = i * spacing + (Math.random() * 8 - 4);
        const baseY = height + 10;

        let stalkHeight = 160 + Math.random() * 120;
        let color = '#22C55E';

        if (layer === 0) {
          stalkHeight = 110 + Math.random() * 80;
          color = '#86EFAC';
        } else if (layer === 1) {
          stalkHeight = 150 + Math.random() * 95;
          color = '#4ADE80';
        } else {
          stalkHeight = 190 + Math.random() * 105;
          color = '#16A34A';
        }

        stalks.push({
          x,
          baseY,
          height: stalkHeight,
          bendOffset: 0,
          phase: Math.random() * Math.PI * 2,
          speed: 0.02 + Math.random() * 0.015,
          color,
          earLength: 22 + Math.random() * 14,
          layer,
        });
      }
    };

    initStalks();

    let time = 0;

    const render = () => {
      if (!isVisible) {
        return;
      }

      time += 0.03;
      mouseX += (targetMouseX - mouseX) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle sunlight gradient background
      const skyGrad = ctx.createLinearGradient(0, 0, width, height);
      skyGrad.addColorStop(0, '#F0FDF4');
      skyGrad.addColorStop(0.5, '#ECFDF5');
      skyGrad.addColorStop(1, '#DCFCE7');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Atmospheric morning sun rays from top-right
      ctx.save();
      const sunGrad = ctx.createRadialGradient(
        width * 0.85,
        height * 0.1,
        10,
        width * 0.85,
        height * 0.1,
        width * 0.7
      );
      sunGrad.addColorStop(0, 'rgba(254, 240, 138, 0.38)');
      sunGrad.addColorStop(0.4, 'rgba(74, 222, 128, 0.14)');
      sunGrad.addColorStop(1, 'rgba(240, 253, 244, 0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // 3. Draw rolling organic field terraces
      ctx.save();
      ctx.fillStyle = '#BBF7D0';
      ctx.beginPath();
      ctx.moveTo(0, height - 70);
      ctx.bezierCurveTo(width * 0.3, height - 120, width * 0.7, height - 40, width, height - 85);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#86EFAC';
      ctx.beginPath();
      ctx.moveTo(0, height - 40);
      ctx.bezierCurveTo(width * 0.25, height - 20, width * 0.65, height - 80, width, height - 35);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 4. Render swaying agricultural stalks with harmonic wind physics
      const windForce = Math.sin(time * 0.7) * 20 + Math.cos(time * 0.3) * 10;
      const mouseInfluence = ((mouseX - width / 2) / width) * 25;

      for (const stalk of stalks) {
        ctx.save();
        const sway =
          Math.sin(time * stalk.speed * 40 + stalk.phase) * (14 + stalk.layer * 6) +
          windForce * (0.3 + stalk.layer * 0.2) +
          mouseInfluence * (0.2 + stalk.layer * 0.2);

        const tipX = stalk.x + sway;
        const tipY = stalk.baseY - stalk.height;
        const cpX = stalk.x + sway * 0.45;
        const cpY = stalk.baseY - stalk.height * 0.55;

        // Stalk stem
        ctx.beginPath();
        ctx.moveTo(stalk.x, stalk.baseY);
        ctx.quadraticCurveTo(cpX, cpY, tipX, tipY);
        ctx.strokeStyle = stalk.color;
        ctx.lineWidth = stalk.layer === 2 ? 2.5 : stalk.layer === 1 ? 2.0 : 1.4;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Crop grain head / wheat ear at tip
        ctx.beginPath();
        const angle = Math.atan2(tipY - cpY, tipX - cpX);
        const earX = tipX + Math.cos(angle) * stalk.earLength;
        const earY = tipY + Math.sin(angle) * stalk.earLength;

        ctx.moveTo(tipX, tipY);
        ctx.lineTo(earX, earY);
        ctx.strokeStyle = stalk.layer === 2 ? '#EAB308' : '#FACC15';
        ctx.lineWidth = stalk.layer === 2 ? 4.5 : 3.2;
        ctx.stroke();

        // Side awns
        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(tipX + Math.cos(angle + 0.4) * 8, tipY + Math.sin(angle + 0.4) * 8);
        ctx.moveTo(earX, earY);
        ctx.lineTo(earX + Math.cos(angle - 0.4) * 10, earY + Math.sin(angle - 0.4) * 10);
        ctx.strokeStyle = '#CA8A04';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
      }

      // 5. Render floating ambient light particles (golden morning spores)
      for (const p of particles) {
        p.x += p.vx + windForce * 0.02;
        p.y += p.vy;
        p.alpha += p.alphaSpeed;
        if (p.alpha > 0.8 || p.alpha < 0.2) p.alphaSpeed = -p.alphaSpeed;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 197, 94, ${p.alpha * 0.75})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (observer) observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isLiteMode]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#F8FFF9] via-[#F8FFF9]/70 to-transparent pointer-events-none" />
    </div>
  );
};
