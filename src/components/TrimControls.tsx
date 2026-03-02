import React, { useState, useRef, useCallback } from 'react';
import { TrimSettings } from '../types';

interface TrimControlsProps {
  trimSettings: TrimSettings;
  duration: number;
  onTrimChange: (trimSettings: TrimSettings) => void;
}

const TrimControls: React.FC<TrimControlsProps> = ({ trimSettings, duration, onTrimChange }) => {
  const [isDragging, setIsDragging] = useState<'start' | 'end' | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const formatTimeWithDecimal = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    return `${mins.toString().padStart(2, '0')}:${secs.padStart(4, '0')}`;
  };

  const updateTrimValue = useCallback((clientX: number) => {
    if (!sliderRef.current || !duration || duration <= 0 || isDragging === null) return;

    try {
      const rect = sliderRef.current.getBoundingClientRect();
      if (rect.width <= 0) return;
      
      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const newValue = Math.round(percentage * duration * 10) / 10;

      // Create new trim settings with validation
      let newTrimSettings = { ...trimSettings };

      if (isDragging === 'start') {
        const newStartTime = Math.max(0, Math.min(newValue, trimSettings.endTime - 0.1));
        newTrimSettings = { ...trimSettings, startTime: newStartTime };
      } else if (isDragging === 'end') {
        const newEndTime = Math.max(trimSettings.startTime + 0.1, Math.min(newValue, duration));
        newTrimSettings = { ...trimSettings, endTime: newEndTime };
      }

      // Only update if values are valid
      if (newTrimSettings.startTime >= 0 && 
          newTrimSettings.endTime > newTrimSettings.startTime && 
          newTrimSettings.startTime < duration && 
          newTrimSettings.endTime <= duration) {
        onTrimChange(newTrimSettings);
      }
    } catch (error) {
      console.error('Trim slider error:', error);
      setIsDragging(null); // Stop dragging on error
    }
  }, [isDragging, duration, trimSettings.endTime, trimSettings.startTime, onTrimChange]);

  const handleMouseDown = (type: 'start' | 'end') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(type);
    updateTrimValue(e.clientX);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      try {
        updateTrimValue(e.clientX);
      } catch (error) {
        console.error('Mouse move error:', error);
        setIsDragging(null); // Stop dragging on error
      }
    }
  }, [isDragging, updateTrimValue]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Ensure valid trim settings
  const safeTrimSettings = {
    startTime: Math.max(0, Math.min(trimSettings.startTime, trimSettings.endTime - 0.1)),
    endTime: Math.max(trimSettings.startTime + 0.1, Math.min(trimSettings.endTime, duration || 0))
  };

  // Safe percentage calculations using safe trim settings
  const startPercentage = duration && duration > 0 && safeTrimSettings.startTime >= 0 ? 
    Math.max(0, Math.min(100, (safeTrimSettings.startTime / duration) * 100)) : 0;
  const endPercentage = duration && duration > 0 && safeTrimSettings.endTime <= duration ? 
    Math.max(0, Math.min(100, (safeTrimSettings.endTime / duration) * 100)) : 100;

  return (
    <div className="px-4 space-y-3">
      <div className="relative">
        <label className="block text-sm font-medium text-gray-300">
          Trim Range: {formatTimeWithDecimal(safeTrimSettings.startTime)} - {formatTimeWithDecimal(safeTrimSettings.endTime)}
        </label>
        
        {duration && duration > 0 ? (
          <div 
            ref={sliderRef}
            className="relative h-6 bg-gray-700 rounded-lg cursor-pointer select-none mt-2"
          >
            {/* Track background */}
            <div className="absolute inset-0 bg-gray-600 rounded-lg" />
            
            {/* Selected range */}
            <div 
              className="absolute h-full bg-blue-600 rounded-lg transition-all duration-150 ease-out"
              style={{
                left: `${startPercentage}%`,
                width: `${Math.max(0, endPercentage - startPercentage)}%`
              }}
            />
            
            {/* Start handle */}
            <div
              className={`absolute w-3 h-3 bg-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 top-1/2 transition-all duration-150 ${
                isDragging === 'start' 
                  ? 'scale-125 cursor-grabbing' 
                  : 'cursor-grab hover:scale-110'
              }`}
              style={{ left: `${startPercentage}%` }}
              onMouseDown={handleMouseDown('start')}
            />
            
            {/* End handle */}
            <div
              className={`absolute w-3 h-3 bg-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 top-1/2 transition-all duration-150 ${
                isDragging === 'end' 
                  ? 'scale-125 cursor-grabbing' 
                  : 'cursor-grab hover:scale-110'
              }`}
              style={{ left: `${endPercentage}%` }}
              onMouseDown={handleMouseDown('end')}
            />
          </div>
        ) : (
          <div className="h-6 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-sm mt-2">
            Loading video...
          </div>
        )}
      </div>

      <div className="flex justify-between text-xs text-gray-400">
        <span>Duration: {formatTimeWithDecimal(Math.max(0, safeTrimSettings.endTime - safeTrimSettings.startTime))}</span>
        <span>Total: {formatTimeWithDecimal(duration || 0)}</span>
      </div>
    </div>
  );
};

export default TrimControls;
