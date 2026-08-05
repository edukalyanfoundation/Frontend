import React, { useEffect, useRef, useCallback } from 'react';
import { MousePointer2, Info, ArrowRight } from 'lucide-react';

// --- Types ---

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  angle: number; // For some organic oscillation
}

interface BackgroundParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
}

interface MouseState {
  x: number;
  y: number;
  isActive: boolean;
}

interface AntiGravityCanvasProps {
  className?: string;
}

// --- Configuration Constants ---

const PARTICLE_DENSITY = 0.00005; // Optimized particle density for smooth 120fps
const BG_PARTICLE_DENSITY = 0.00002; // Light background particles
const MOUSE_RADIUS = 150; // Radius of mouse influence
const RETURN_SPEED = 0.06; // Smooth spring return
const DAMPING = 0.92; // Friction (velocity decay)
const REPULSION_STRENGTH = 1.0; // Multiplier for mouse push force

// --- Helper Functions ---

const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

// --- Components ---

export const AntiGravityCanvas: React.FC<AntiGravityCanvasProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mutable state refs to avoid re-renders during animation loop
  const particlesRef = useRef<Particle[]>([]);
  const backgroundParticlesRef = useRef<BackgroundParticle[]>([]);
  const mouseRef = useRef<MouseState>({ x: -1000, y: -1000, isActive: false });
  const frameIdRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Initialize Particles
  const initParticles = useCallback((width: number, height: number) => {
    // 1. Main Interactive Particles
    const particleCount = Math.floor(width * height * PARTICLE_DENSITY);
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      
      newParticles.push({
        x: x,
        y: y,
        originX: x,
        originY: y,
        vx: 0,
        vy: 0,
        size: randomRange(1, 2.5), 
        color: Math.random() > 0.9 ? '#4285F4' : '#ffffff', 
        angle: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = newParticles;

    // 2. Background Ambient Particles (Stars/Dust)
    const bgCount = Math.floor(width * height * BG_PARTICLE_DENSITY);
    const newBgParticles: BackgroundParticle[] = [];
    
    for (let i = 0; i < bgCount; i++) {
      newBgParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2, // Very slow drift
        vy: (Math.random() - 0.5) * 0.2,
        size: randomRange(0.5, 1.5),
        alpha: randomRange(0.1, 0.4),
        phase: Math.random() * Math.PI * 2 // For twinkling offset
      });
    }
    backgroundParticlesRef.current = newBgParticles;
  }, []);

  // Animation Loop
  const animate = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    lastTimeRef.current = time;

    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- Background Effects ---
    
    // 1. Pulsating Radial Glow
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const pulseSpeed = 0.0008;
    // Oscillates between 0.05 and 0.12 opacity
    const pulseOpacity = Math.sin(time * pulseSpeed) * 0.035 + 0.085; 
    
    const gradient = ctx.createRadialGradient(
        centerX, centerY, 0, 
        centerX, centerY, Math.max(canvas.width, canvas.height) * 0.7
    );
    gradient.addColorStop(0, `rgba(66, 133, 244, ${pulseOpacity})`); // Faint Google Blue
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Background Particles (Drifting Stars)
    const bgParticles = backgroundParticlesRef.current;
    ctx.fillStyle = "#ffffff";
    
    for (let i = 0; i < bgParticles.length; i++) {
      const p = bgParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      
      // Wrap around screen
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Twinkle effect
      const twinkle = Math.sin(time * 0.002 + p.phase) * 0.5 + 0.5; // 0 to 1
      const currentAlpha = p.alpha * (0.3 + 0.7 * twinkle);

      ctx.globalAlpha = currentAlpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0; // Reset alpha for foreground

    // --- Main Foreground Physics ---

    const particles = particlesRef.current;
    const mouse = mouseRef.current;

    // Phase 1: Apply Forces (Mouse & Spring)
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // 1. Calculate Distance to Mouse
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // 2. Mouse Repulsion Force
      if (mouse.isActive && distance < MOUSE_RADIUS) {
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS; 
        
        const repulsion = force * REPULSION_STRENGTH;
        p.vx -= forceDirectionX * repulsion * 5; 
        p.vy -= forceDirectionY * repulsion * 5;
      }

      // 3. Spring Force (Return to Origin)
      const springDx = p.originX - p.x;
      const springDy = p.originY - p.y;
      
      p.vx += springDx * RETURN_SPEED;
      p.vy += springDy * RETURN_SPEED;
    }

    // Phase 3: Integration & Drawing
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Physics Update
      p.vx *= DAMPING;
      p.vy *= DAMPING;

      p.x += p.vx;
      p.y += p.vy;

      // Drawing
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      
      const velocity = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      const opacity = Math.min(0.3 + velocity * 0.1, 1); 
      
      ctx.fillStyle = p.color === '#ffffff' 
        ? `rgba(255, 255, 255, ${opacity})` 
        : p.color;
      
      ctx.fill();
    }

    frameIdRef.current = requestAnimationFrame(animate);
  }, []);

  // Resize Handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        // Set actual size in memory (scaled to account for extra pixel density)
        canvasRef.current.width = width * dpr;
        canvasRef.current.height = height * dpr;
        
        // Make it visible size
        canvasRef.current.style.width = `${width}px`;
        canvasRef.current.style.height = `${height}px`;

        // Normalize coordinate system to use CSS pixels
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);

        // Re-init particles for new dimensions
        initParticles(width, height);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener('resize', handleResize);
  }, [initParticles]);

  // Start Animation
  useEffect(() => {
    frameIdRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameIdRef.current);
  }, [animate]);

  // Global Window Mouse Handler for full-screen / background reactivity
  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isActive: true,
      };
    };

    const handleWindowMouseLeave = () => {
      mouseRef.current.isActive = false;
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseleave', handleWindowMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseleave', handleWindowMouseLeave);
    };
  }, []);

  // Mouse Handlers (for local container)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isActive: true,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.isActive = false;
  };

  return (
    <div 
      ref={containerRef} 
      className={className || "absolute inset-0 z-0 overflow-hidden bg-black cursor-crosshair"}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

const Navigation: React.FC = () => {
    return (
        <nav className="absolute top-0 left-0 w-full z-20 flex justify-between items-center p-6 md:p-8">
            <div className="flex items-center space-x-2">
                 <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="font-bold text-black text-lg">G</span>
                 </div>
                 <span className="text-white font-medium tracking-wide text-lg">Antigravity</span>
            </div>
            <div className="hidden md:flex space-x-8 text-sm font-medium text-white/70">
                <a href="#" className="hover:text-white transition-colors">Experiments</a>
                <a href="#" className="hover:text-white transition-colors">Case Studies</a>
                <a href="#" className="hover:text-white transition-colors">About</a>
            </div>
            <button className="text-white/80 hover:text-white transition-colors">
                <Info size={24} />
            </button>
        </nav>
    )
}

const HeroContent: React.FC = () => {
    return (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-4">
            <div className="max-w-4xl w-full text-center space-y-8">
                <div className="inline-block animate-fade-in-up">
                    <span className="py-1 px-3 border border-white/20 rounded-full text-xs font-mono text-white/60 tracking-widest uppercase bg-white/5 backdrop-blur-sm">
                        Experimental Interaction
                    </span>
                </div>
                
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 tracking-tighter mix-blend-difference">
                    Zero<br/>Gravity
                </h1>
                
                <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 font-light leading-relaxed">
                    Experience the fluidity of data. A WebGL-inspired particle simulation running entirely on 2D Canvas for maximum compatibility and performance.
                </p>

                <div className="pt-8 pointer-events-auto">
                    <button className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold tracking-wide overflow-hidden transition-transform hover:scale-105 active:scale-95">
                        <span className="relative z-10">Start Experience</span>
                        <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out opacity-10"></div>
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---

export default function App() {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden selection:bg-blue-500 selection:text-white">
      <AntiGravityCanvas />
      <Navigation />
      <HeroContent />
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-pulse pointer-events-none">
         <span className="text-[10px] uppercase tracking-[0.2em]">Interact</span>
         <MousePointer2 size={16} />
      </div>
    </div>
  );
}
