import React from 'react';
import { ProcessingState } from '../types';

interface ProcessingStatusProps {
  processing: ProcessingState;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ processing }) => {
  if (!processing.isProcessing) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gray-800/50 rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">
              Processing Video
            </h3>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-300">
                {processing.status}
              </p>
              
              {processing.progress > 0 && (
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${processing.progress}%` }}
                  />
                </div>
              )}
              
              <p className="text-xs text-gray-400">
                {processing.progress.toFixed(1)}% complete
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
          <p className="text-sm text-blue-200">
            Please don't close this window while processing. The video is being processed in your browser.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;
