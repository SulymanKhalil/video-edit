import React from 'react';

interface ActionButtonsProps {
  onApplyChanges: () => void;
  onDownload: () => void;
  onNewUpload?: () => void;
  isProcessing: boolean;
  hasProcessedVideo: boolean;
  hasVideo: boolean;
  processingProgress: number;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onApplyChanges,
  onDownload,
  onNewUpload,
  isProcessing,
  hasProcessedVideo,
  hasVideo,
  processingProgress,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {onNewUpload && (
        <button
          onClick={onNewUpload}
          disabled={isProcessing}
          className={`
            w-full px-6 py-3 rounded-lg font-medium transition-all duration-200
            ${isProcessing
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800'
            }
          `}
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>Upload New Video</span>
          </div>
        </button>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onApplyChanges}
          disabled={!hasVideo || isProcessing}
          className={`
            flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 relative
            ${!hasVideo || isProcessing
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
            }
          `}
        >
          <div className="flex items-center justify-center space-x-2">
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing... {processingProgress.toFixed(1)}%</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Apply Changes</span>
              </>
            )}
          </div>
          
          {isProcessing && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600 rounded-b-lg overflow-hidden">
              <div
                className="h-full bg-blue-400 transition-all duration-300"
                style={{ width: `${processingProgress}%` }}
              />
            </div>
          )}
        </button>

        <button
          onClick={onDownload}
          disabled={!hasProcessedVideo || isProcessing}
          className={`
            flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200
            ${!hasProcessedVideo || isProcessing
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800'
            }
          `}
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download Video</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
