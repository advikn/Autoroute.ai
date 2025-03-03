import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface InteractiveBackgroundProps {
  sensitivity?: number;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  timestamp: number;
}

const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({ 
  sensitivity = 0.05 
}) => {
  const { theme } = useTheme();
  const gradientRef = useRef<HTMLDivElement>(null);
  const rippleContainerRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleIdRef = useRef(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Handle mouse movement for cursor-following gradient
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      
      // Update mouse position state
      setMousePos({ x: clientX, y: clientY });
      
      // Move the gradient to follow the cursor
      if (gradientRef.current) {
        gradientRef.current.style.left = `${clientX}px`;
        gradientRef.current.style.top = `${clientY}px`;
      }
    };
    
    // Add mouse move event listener
    window.addEventListener('mousemove', handleMouseMove);
    
    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [sensitivity]);
  
  // Handle ripple effect on click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      
      // Create a new ripple
      const newRipple: Ripple = {
        id: rippleIdRef.current++,
        x: clientX,
        y: clientY,
        size: 0,
        opacity: 0.8,
        timestamp: Date.now()
      };
      
      setRipples(prev => [...prev, newRipple]);
    };
    
    // Add click event listener
    window.addEventListener('click', handleClick);
    
    // Clean up
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);
  
  // Animate ripples
  useEffect(() => {
    if (ripples.length === 0) return;
    
    const animateRipples = () => {
      const now = Date.now();
      
      setRipples(prev => 
        prev
          .map(ripple => {
            const age = now - ripple.timestamp;
            const maxAge = 2000; // 2 seconds lifetime
            
            // Calculate new size and opacity based on age
            const progress = Math.min(age / maxAge, 1);
            const newSize = Math.min(300, progress * 300); // Max size 300px
            const newOpacity = 0.8 * (1 - progress);
            
            return {
              ...ripple,
              size: newSize,
              opacity: newOpacity
            };
          })
          .filter(ripple => ripple.opacity > 0.01) // Remove faded ripples
      );
    };
    
    const animationFrame = requestAnimationFrame(animateRipples);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [ripples]);
  
  return (
    <div className="interactive-background">
      {/* Cursor-following gradient */}
      <div 
        ref={gradientRef} 
        className="cursor-gradient"
        style={{
          left: mousePos.x,
          top: mousePos.y
        }}
      ></div>
      
      {/* Ripple container */}
      <div ref={rippleContainerRef} className="ripple-container">
        {ripples.map(ripple => (
          <div
            key={ripple.id}
            className="ripple"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: `${ripple.size}px`,
              height: `${ripple.size}px`,
              opacity: ripple.opacity
            }}
          />
        ))}
      </div>
      
      <div className="noise-overlay"></div>
      <div className="grid-overlay"></div>
    </div>
  );
};

export default InteractiveBackground;