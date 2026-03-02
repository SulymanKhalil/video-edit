import React from 'react';
import { AspectRatio, ASPECT_RATIO_CONFIGS } from '../types';

interface RatioSelectorProps {
  aspectRatio: AspectRatio;
  onRatioChange: (ratio: AspectRatio) => void;
}

const RatioSelector: React.FC<RatioSelectorProps> = ({ aspectRatio, onRatioChange }) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-800/50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Aspect Ratio</h3>
      
      <div className="space-y-4">
        <select
          value={aspectRatio}
          onChange={(e) => onRatioChange(e.target.value as AspectRatio)}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          {Object.entries(ASPECT_RATIO_CONFIGS).map(([ratio, config]) => (
            <option key={ratio} value={ratio}>
              {config.label}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {Object.entries(ASPECT_RATIO_CONFIGS).map(([ratio]) => (
            <button
              key={ratio}
              onClick={() => onRatioChange(ratio as AspectRatio)}
              className={`p-4 rounded-lg border-2 transition-all ${
                aspectRatio === ratio
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
              }`}
            >
              <div className="aspect-square mb-2">
                <div
                  className="w-full h-full bg-gray-600 rounded"
                  style={{
                    aspectRatio: ratio,
                    maxWidth: '60px',
                    margin: '0 auto'
                  }}
                />
              </div>
              <p className="text-xs text-gray-300">{ratio}</p>
            </button>
          ))}
        </div>

        <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Selected ratio:</span>
            <span className="text-white font-medium">
              {ASPECT_RATIO_CONFIGS[aspectRatio].label}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-300">Output dimensions:</span>
            <span className="text-white font-medium">
              {ASPECT_RATIO_CONFIGS[aspectRatio].width} × {ASPECT_RATIO_CONFIGS[aspectRatio].height}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatioSelector;
