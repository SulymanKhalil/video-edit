import React, { useRef, useEffect, useState } from 'react';
import { VideoFile, AspectRatio, ASPECT_RATIO_CONFIGS } from '../types';

interface LivePreviewProps {
  videoFile: VideoFile;
  trimSettings: { startTime: number; endTime: number };
  aspectRatio: AspectRatio;
}

const LivePreview: React.FC<LivePreviewProps> = ({
  videoFile,
  trimSettings,
  aspectRatio
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width: outputWidth, height: outputHeight } = ASPECT_RATIO_CONFIGS[aspectRatio];
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    const drawFrame = () => {
      if (!video.paused && !video.ended) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, outputWidth, outputHeight);

        const videoAspectRatio = video.videoWidth / video.videoHeight;
        const targetAspectRatio = outputWidth / outputHeight;

        let drawWidth = outputWidth;
        let drawHeight = outputHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (videoAspectRatio > targetAspectRatio) {
          drawHeight = outputHeight;
          drawWidth = drawHeight * videoAspectRatio;
          offsetX = (outputWidth - drawWidth) / 2;
        } else {
          drawWidth = outputWidth;
          drawHeight = drawWidth / videoAspectRatio;
          offsetY = (outputHeight - drawHeight) / 2;
        }

        ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
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

    video.addEventListener('seeked', drawFrame);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [aspectRatio]);

  useEffect(() => {
    const video = videoRef.current;
    if (video && videoFile) {
      video.src = videoFile.url;
      video.currentTime = trimSettings.startTime;
    }
  }, [videoFile, trimSettings]);

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

  return (
    <div className="bg-gray-800/50 rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Live Preview</h3>
      </div>

      <div className="space-y-4">
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="hidden"
            preload="metadata"
          />
          <canvas
            ref={canvasRef}
            className="w-full h-auto max-h-[600px] object-contain"
          />
          
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

        <div className="text-sm text-gray-400">
          <p>Preview shows: {ASPECT_RATIO_CONFIGS[aspectRatio].label}</p>
          <p>Trim range: {trimSettings.startTime.toFixed(1)}s - {trimSettings.endTime.toFixed(1)}s</p>
          <p>Duration: {(trimSettings.endTime - trimSettings.startTime).toFixed(1)}s</p>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
