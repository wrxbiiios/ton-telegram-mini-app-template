import React, { useRef, useState, useEffect } from 'react';

interface JoystickProps {
  onMove: (position: { x: number; y: number }) => void;
}

export function Joystick({ onMove }: JoystickProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleStart = (clientX: number, clientY: number) => {
    setIsActive(true);
    updatePosition(clientX, clientY);
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (isActive) {
      updatePosition(clientX, clientY);
    }
  };

  const handleEnd = () => {
    setIsActive(false);
    setPosition({ x: 0, y: 0 });
    onMove({ x: 0, y: 0 });
  };

  const updatePosition = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = 40;

    let x = deltaX;
    let y = deltaY;

    if (distance > maxDistance) {
      const angle = Math.atan2(deltaY, deltaX);
      x = Math.cos(angle) * maxDistance;
      y = Math.sin(angle) * maxDistance;
    }

    setPosition({ x, y });
    onMove({ x: x / maxDistance, y: y / maxDistance });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  useEffect(() => {
    const handleMouseUp = () => handleEnd();
    
    if (isActive) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isActive]);

  return (
    <div
      ref={containerRef}
      className="relative w-32 h-32 bg-gray-800 bg-opacity-50 rounded-full border-4 border-gray-600"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleEnd}
      onMouseDown={handleMouseDown}
      style={{ touchAction: 'none' }}
    >
      {/* Joystick knob */}
      <div
        className="absolute w-16 h-16 bg-cyan-500 bg-opacity-70 rounded-full border-2 border-cyan-300 transition-all"
        style={{
          left: `calc(50% - 32px + ${position.x}px)`,
          top: `calc(50% - 32px + ${position.y}px)`,
          boxShadow: isActive ? '0 0 20px #00ffff' : '0 0 10px #00ffff',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          🎮
        </div>
      </div>
      
      {/* Center indicator */}
      <div className="absolute left-1/2 top-1/2 w-2 h-2 bg-cyan-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}
