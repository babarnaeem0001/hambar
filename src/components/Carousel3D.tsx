import React, { useState, useEffect, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Carousel3DProps {
  items: ReactNode[];
  autoPlay?: boolean;
  interval?: number;
}

export default function Carousel3D({ items, autoPlay = true, interval = 5000 }: Carousel3DProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, items.length]);

  const handlePrev = () => {
    setActiveIndex((current) => (current - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % items.length);
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="relative w-full max-w-6xl mx-auto h-[600px] flex items-center justify-center overflow-visible" style={{ perspective: '1200px' }}>
      <div className="w-full h-full relative flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
        {items.map((item, index) => {
          // Calculate relative position based on active index
          let offset = index - activeIndex;
          if (offset < -Math.floor(items.length / 2)) offset += items.length;
          if (offset > Math.floor(items.length / 2)) offset -= items.length;

          // Compute styles for fake 3D
          const MathAbsOffset = Math.abs(offset);
          const isActive = offset === 0;
          const rotateY = offset * -25;
          const translateZ = MathAbsOffset * -100;
          const translateX = offset * 50;
          
          let opacity = 1 - (MathAbsOffset * 0.3);
          if (opacity < 0) opacity = 0;
          
          const scale = isActive ? 1 : 1 - (MathAbsOffset * 0.15);
          const zIndex = items.length - MathAbsOffset;

          return (
            <div
              key={index}
              className="absolute w-full max-w-2xl transition-all duration-500 ease-out cursor-pointer"
              style={{
                transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity: opacity,
                zIndex: zIndex,
                filter: isActive ? 'blur(0px)' : 'blur(2px)',
                pointerEvents: isActive ? 'auto' : 'none'
              }}
              onClick={() => {
                if (!isActive) setActiveIndex(index);
              }}
            >
              <div className="w-full h-full">
                {item}
              </div>
            </div>
          );
        })}
      </div>

      {items.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-4 sm:left-12 z-50 p-3 rounded-full bg-white/80 hover:bg-white text-black shadow-lg transition-transform hover:scale-110 border border-neutral-200"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-4 sm:right-12 z-50 p-3 rounded-full bg-white/80 hover:bg-white text-black shadow-lg transition-transform hover:scale-110 border border-neutral-200"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  );
}
