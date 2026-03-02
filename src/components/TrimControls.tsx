import React from 'react';
import { TrimSettings } from '../types';

interface TrimControlsProps {
  trimSettings: TrimSettings;
  duration: number;
  onTrimChange: (trimSettings: TrimSettings) => void;
}

const TrimControls: React.FC<TrimControlsProps> = ({ trimSettings, duration, onTrimChange }) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTimeChange = (value: string) => {
    const startTime = parseFloat(value);
    if (startTime >= 0 && startTime < trimSettings.endTime) {
      onTrimChange({ ...trimSettings, startTime });
    }
  };

  const handleEndTimeChange = (value: string) => {
    const endTime = parseFloat(value);
    if (endTime > trimSettings.startTime && endTime <= duration) {
      onTrimChange({ ...trimSettings, endTime });
    }
  };

  const handleStartSliderChange = (value: string) => {
    const startTime = parseFloat(value);
    if (startTime < trimSettings.endTime) {
      onTrimChange({ ...trimSettings, startTime });
    }
  };

  const handleEndSliderChange = (value: string) => {
    const endTime = parseFloat(value);
    if (endTime > trimSettings.startTime) {
      onTrimChange({ ...trimSettings, endTime });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-800/50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Trim Video</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Start Time: {formatTime(trimSettings.startTime)}
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max={duration}
              step="0.1"
              value={trimSettings.startTime}
              onChange={(e) => handleStartSliderChange(e.target.value)}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="number"
              min="0"
              max={duration}
              step="0.1"
              value={trimSettings.startTime.toFixed(1)}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              className="w-20 px-2 py-1 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            End Time: {formatTime(trimSettings.endTime)}
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max={duration}
              step="0.1"
              value={trimSettings.endTime}
              onChange={(e) => handleEndSliderChange(e.target.value)}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="number"
              min="0"
              max={duration}
              step="0.1"
              value={trimSettings.endTime.toFixed(1)}
              onChange={(e) => handleEndTimeChange(e.target.value)}
              className="w-20 px-2 py-1 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-700">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Duration: {formatTime(trimSettings.endTime - trimSettings.startTime)}</span>
            <span>Total: {formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrimControls;
