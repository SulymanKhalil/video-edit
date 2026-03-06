import React, { useRef, useEffect, useState } from 'react';
import { VideoFile, AspectRatio, TrimSettings } from '../types';
import TrimControls from './TrimControls';

interface LivePreviewProps {
  videoFile: VideoFile;
  trimSettings: TrimSettings;
  aspectRatio: AspectRatio;
  onTrimChange: (trimSettings: TrimSettings) => void;
  videoRef?: React.RefObject<HTMLVideoElement>;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

const LivePreview: React.FC<LivePreviewProps> = ({
  videoFile,
  trimSettings,
  aspectRatio,
  onTrimChange,
  videoRef: externalVideoRef,
  canvasRef: externalCanvasRef,
}) => {
  const videoRef = externalVideoRef || useRef<HTMLVideoElement>(null);
  const animationRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });
  const [videoElementDimensions, setVideoElementDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const video = videoRef.current;
    if (video && videoFile) {
      video.src = videoFile.url;
      video.currentTime = trimSettings.startTime;
      
      const handleLoadedMetadata = () => {
        setVideoDimensions({ width: video.videoWidth, height: video.videoHeight });
      };

      const handleResize = () => {
        if (video.offsetWidth && video.offsetHeight) {
          setVideoElementDimensions({ width: video.offsetWidth, height: video.offsetHeight });
        }
      };
      
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('loadedmetadata', handleResize);
      video.addEventListener('resize', handleResize);
      
      handleResize();
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('loadedmetadata', handleResize);
        video.removeEventListener('resize', handleResize);
      };
    }
  }, [videoFile, trimSettings]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const drawFrame = () => {
      if (!video.paused && !video.ended) {
        animationRef.current = requestAnimationFrame(drawFrame);
      }
    };

    video.addEventListener('play', () => {
      setIsPlaying(true);
      drawFrame();
    });

    video.addEventListener('pause', () => {
      setIsPlaying(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handlePlay = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = trimSettings.startTime;
      video.play();
      
      const checkEndTime = setInterval(() => {
        if (video.currentTime >= trimSettings.endTime) {
          video.pause();
          video.currentTime = trimSettings.startTime;
          clearInterval(checkEndTime);
        }
      }, 100);
    }
  };

  const handlePause = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
    }
  };

  const getCropOverlayStyle = () => {
    if (!videoDimensions.width || !videoDimensions.height || !videoElementDimensions.width || !videoElementDimensions.height) {
      return { display: 'none' };
    }
    
    const videoAspectRatio = videoDimensions.width / videoDimensions.height;
    const targetAspectRatio = parseFloat(aspectRatio.split(':')[0]) / parseFloat(aspectRatio.split(':')[1]);
    
    let cropWidth, cropHeight;
    
    if (videoAspectRatio > targetAspectRatio) {
      cropHeight = videoElementDimensions.height;
      cropWidth = cropHeight * targetAspectRatio;
    } else {
      cropWidth = videoElementDimensions.width;
      cropHeight = cropWidth / targetAspectRatio;
    }
    
    const left = (videoElementDimensions.width - cropWidth) / 2;
    const top = (videoElementDimensions.height - cropHeight) / 2;
    
    return {
      width: `${cropWidth}px`,
      height: `${cropHeight}px`,
      left: `${left}px`,
      top: `${top}px`,
      display: 'block'
    };
  };

  return (
    <div className="space-y-4">
      <div className="relative bg-black overflow-hidden flex justify-center items-center" style={{ minHeight: '120px' }}>
        <div className="relative w-3/5">
          <video
            ref={videoRef}
            className="w-full h-auto object-contain"
            preload="metadata"
          />
          
          {/* Hidden canvas for processing */}
          <canvas
            ref={externalCanvasRef}
            className="hidden"
            style={{ display: 'none' }}
          />
          
          {videoDimensions.width > 0 && videoElementDimensions.width > 0 && (
            <>
              {/* Top overlay */}
              <div
                className="absolute bg-black pointer-events-none"
                style={{
                  top: 0,
                  left: 0,
                  right: 0,
                  height: `${getCropOverlayStyle().top || 0}px`,
                  opacity: 0.9
                }}
              />
              {/* Left overlay */}
              <div
                className="absolute bg-black pointer-events-none"
                style={{
                  top: `${getCropOverlayStyle().top || 0}px`,
                  left: 0,
                  width: `${getCropOverlayStyle().left || 0}px`,
                  height: `${getCropOverlayStyle().height || 0}px`,
                  opacity: 0.9
                }}
              />
              {/* Right overlay */}
              <div
                className="absolute bg-black pointer-events-none"
                style={{
                  top: `${getCropOverlayStyle().top || 0}px`,
                  right: 0,
                  width: `${getCropOverlayStyle().left || 0}px`,
                  height: `${getCropOverlayStyle().height || 0}px`,
                  opacity: 0.9
                }}
              />
              {/* Bottom overlay */}
              <div
                className="absolute bg-black pointer-events-none"
                style={{
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: `${getCropOverlayStyle().top || 0}px`,
                  opacity: 0.9
                }}
              />
              
              {/* Crop overlay border */}
              <div 
                className="absolute border-2 border-white shadow-lg pointer-events-none"
                style={getCropOverlayStyle()}
              >
                <div className="absolute inset-0 border border-white/30"></div>
              </div>
            </>
          )}
        </div>
        
        <div className="absolute bottom-4 left-4 right-4 flex items-center space-x-2">
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          <button
            onClick={handlePause}
            disabled={!isPlaying}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      <TrimControls
        trimSettings={trimSettings}
        duration={videoFile.duration}
        onTrimChange={onTrimChange}
      />
    </div>
  );
};

export default LivePreview;
