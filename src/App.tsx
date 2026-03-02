import React, { useState, useRef, useCallback } from 'react';
import UploadSection from './components/UploadSection';
import LivePreview from './components/LivePreview';
import TrimControls from './components/TrimControls';
import RatioSelector from './components/RatioSelector';
import ActionButtons from './components/ActionButtons';
import { 
  VideoFile, 
  VideoEditorState, 
  AspectRatio, 
  ASPECT_RATIO_CONFIGS 
} from './types';

const App: React.FC = () => {
  const [state, setState] = useState<VideoEditorState>({
    videoFile: null,
    trimSettings: { startTime: 0, endTime: 10 },
    aspectRatio: '16:9',
    processedBlob: null,
    processing: { isProcessing: false, progress: 0, status: '' }
  });

  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleVideoUpload = useCallback((videoFile: VideoFile) => {
    setState(prev => ({
      ...prev,
      videoFile,
      trimSettings: { startTime: 0, endTime: Math.min(10, videoFile.duration) },
      processedBlob: null
    }));
    setError(null);
  }, []);

  const handleTrimChange = useCallback((trimSettings: VideoEditorState['trimSettings']) => {
    setState(prev => ({ ...prev, trimSettings }));
  }, []);

  const handleRatioChange = useCallback((aspectRatio: AspectRatio) => {
    setState(prev => ({ ...prev, aspectRatio }));
  }, []);

  const processVideo = useCallback(async () => {
    if (!state.videoFile || !videoRef.current || !canvasRef.current) return;

    setState(prev => ({
      ...prev,
      processing: { isProcessing: true, progress: 0, status: 'Initializing...' }
    }));

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      const { width: outputWidth, height: outputHeight } = ASPECT_RATIO_CONFIGS[state.aspectRatio];
      canvas.width = outputWidth;
      canvas.height = outputHeight;

      video.src = state.videoFile.url;
      video.load();

      await new Promise((resolve, reject) => {
        video.onloadeddata = resolve;
        video.onerror = reject;
      });

      video.currentTime = state.trimSettings.startTime;
      await new Promise(resolve => {
        const handleSeeked = () => {
          video.removeEventListener('seeked', handleSeeked);
          resolve(void 0);
        };
        video.addEventListener('seeked', handleSeeked);
      });

      const stream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm',
        videoBitsPerSecond: 2500000
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setState(prev => ({
          ...prev,
          processedBlob: blob,
          processing: { isProcessing: false, progress: 100, status: 'Complete!' }
        }));
      };

      setState(prev => ({
        ...prev,
        processing: { ...prev.processing, status: 'Recording...' }
      }));

      mediaRecorder.start();
      
      const duration = state.trimSettings.endTime - state.trimSettings.startTime;
      const startTime = performance.now();

      const drawFrame = () => {
        const elapsed = (performance.now() - startTime) / 1000;
        const currentTime = elapsed + state.trimSettings.startTime;
        
        if (currentTime >= state.trimSettings.endTime) {
          mediaRecorder.stop();
          return;
        }

        if (Math.abs(video.currentTime - currentTime) > 0.1) {
          video.currentTime = currentTime;
        }

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

        const progress = (elapsed / duration) * 100;
        setState(prev => ({
          ...prev,
          processing: { ...prev.processing, progress: Math.min(progress, 99) }
        }));

        requestAnimationFrame(drawFrame);
      };

      drawFrame();

    } catch (err) {
      console.error('Processing error:', err);
      setState(prev => ({
        ...prev,
        processing: { isProcessing: false, progress: 0, status: '' }
      }));
      setError('Processing failed. Please try again.');
    }
  }, [state.videoFile, state.trimSettings, state.aspectRatio]);

  const downloadVideo = useCallback(() => {
    if (!state.processedBlob) return;

    const url = URL.createObjectURL(state.processedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edited-video-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [state.processedBlob]);

  const handleNewUpload = useCallback(() => {
    setState(prev => ({
      ...prev,
      videoFile: null,
      processedBlob: null,
      processing: { isProcessing: false, progress: 0, status: '' }
    }));
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Video Editor</h1>
          <p className="text-gray-400">Edit your videos directly in the browser</p>
        </header>

        {!state.videoFile ? (
          <UploadSection
            onVideoUpload={handleVideoUpload}
            error={error}
            onError={setError}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <TrimControls
                trimSettings={state.trimSettings}
                duration={state.videoFile.duration}
                onTrimChange={handleTrimChange}
              />

              <RatioSelector
                aspectRatio={state.aspectRatio}
                onRatioChange={handleRatioChange}
              />
            </div>

            <div className="space-y-8">
              <LivePreview
                videoFile={state.videoFile}
                trimSettings={state.trimSettings}
                aspectRatio={state.aspectRatio}
              />
              
              <ActionButtons
                onApplyChanges={processVideo}
                onDownload={downloadVideo}
                onNewUpload={handleNewUpload}
                isProcessing={state.processing.isProcessing}
                hasProcessedVideo={!!state.processedBlob}
                hasVideo={!!state.videoFile}
                processingProgress={state.processing.progress}
              />
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          className="hidden"
          preload="auto"
        />
        <canvas
          ref={canvasRef}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default App;
