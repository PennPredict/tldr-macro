"use client";

import { useEffect, useRef } from "react";

const colors = { up: "#48dca0", down: "#ff7474", risk: "#f2a35f", caution: "#7cb9eb" };

export default function Sparkline({ points, tone }: { points: number[]; tone: keyof typeof colors }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const draw = () => {
      const rect = element.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      element.width = rect.width * ratio;
      element.height = rect.height * ratio;
      const context = element.getContext("2d");
      if (!context) return;
      context.scale(ratio, ratio);
      const width = rect.width;
      const height = rect.height;
      const pad = 4;
      const min = Math.min(...points);
      const max = Math.max(...points);
      const spread = max - min || 1;
      const coords = points.map((point, index) => ({
        x: pad + index * ((width - pad * 2) / (points.length - 1)),
        y: pad + ((max - point) / spread) * (height - pad * 2),
      }));

      context.setLineDash([3, 4]);
      context.strokeStyle = "rgba(129,147,162,.45)";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(0, coords[0].y);
      context.lineTo(width, coords[0].y);
      context.stroke();
      context.setLineDash([]);

      const gradient = context.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, `${colors[tone]}2b`);
      gradient.addColorStop(1, `${colors[tone]}00`);
      context.beginPath();
      context.moveTo(coords[0].x, height);
      coords.forEach(({ x, y }) => context.lineTo(x, y));
      context.lineTo(coords.at(-1)!.x, height);
      context.closePath();
      context.fillStyle = gradient;
      context.fill();

      context.beginPath();
      coords.forEach(({ x, y }, index) => index ? context.lineTo(x, y) : context.moveTo(x, y));
      context.strokeStyle = colors[tone];
      context.lineWidth = 2;
      context.lineJoin = "round";
      context.lineCap = "round";
      context.stroke();
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(element);
    return () => observer.disconnect();
  }, [points, tone]);

  return <canvas ref={canvas} className="sparkline" aria-hidden="true" />;
}
