import React, { useRef } from 'react';
import { MAX_FILE_SIZE, SUPPORTED_VIDEO_FORMATS, VideoFile } from '../types';

interface UploadSectionProps {
  onVideoUpload: (videoFile: VideoFile) => void;
  error: string | null;
  onError: (error: string | null) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onVideoUpload, error, onError }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onError(null);

    if (!SUPPORTED_VIDEO_FORMATS.includes(file.type)) {
      onError('Unsupported video format. Please upload MP4, WebM, or OGG files.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      onError('File size exceeds 200MB limit.');
      return;
    }

    try {
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.preload = 'metadata';

      await new Promise((resolve, reject) => {
        video.onloadedmetadata = resolve;
        video.onerror = reject;
        video.src = url;
      });

      const duration = video.duration;
      URL.revokeObjectURL(url);

      const videoFile: VideoFile = {
        file,
        url: URL.createObjectURL(file),
        duration,
      };

      onVideoUpload(videoFile);
    } catch (err) {
      onError('Failed to load video metadata. Please try a different file.');
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      const changeEvent = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(changeEvent);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors cursor-pointer bg-gray-800/50"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <div>
            <p className="text-lg font-medium text-white mb-2">
              Drop your video here or click to browse
            </p>
            <p className="text-sm text-gray-400">
              Supports MP4, WebM, OGG (Max 200MB)
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-900/50 border border-red-600 rounded-lg">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default UploadSection;
