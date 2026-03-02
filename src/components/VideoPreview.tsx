import React, { useRef, useEffect } from 'react';
import { VideoFile } from '../types';

interface VideoPreviewProps {
  videoFile: VideoFile;
  onLoadedMetadata: (duration: number) => void;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ videoFile, onLoadedMetadata }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video && videoFile) {
      video.src = videoFile.url;
      
      const handleLoadedMetadata = () => {
        onLoadedMetadata(video.duration);
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [videoFile, onLoadedMetadata]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
        <video
          ref={videoRef}
          controls
          className="w-full h-auto max-h-[500px] object-contain"
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
      </div>
      
      <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>File: {videoFile.file.name}</span>
          <span>Size: {(videoFile.file.size / (1024 * 1024)).toFixed(2)} MB</span>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
