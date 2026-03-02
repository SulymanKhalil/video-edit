export type AspectRatio = '16:9' | '1:1' | '9:16' | '4:3' | '2.39:1' | '4:5';

export interface VideoFile {
  file: File;
  url: string;
  duration: number;
}

export interface TrimSettings {
  startTime: number;
  endTime: number;
}

export interface ProcessingState {
  isProcessing: boolean;
  progress: number;
  status: string;
}

export interface VideoEditorState {
  videoFile: VideoFile | null;
  trimSettings: TrimSettings;
  aspectRatio: AspectRatio;
  processedBlob: Blob | null;
  processing: ProcessingState;
}

export interface AspectRatioConfig {
  label: string;
  width: number;
  height: number;
}

export const ASPECT_RATIO_CONFIGS: Record<AspectRatio, AspectRatioConfig> = {
  '16:9': { label: 'Widescreen (16:9)', width: 1920, height: 1080 },
  '1:1': { label: 'Square (1:1)', width: 1080, height: 1080 },
  '9:16': { label: 'Vertical Video (9:16)', width: 1080, height: 1920 },
  '4:3': { label: 'Standard (4:3)', width: 1440, height: 1080 },
  '2.39:1': { label: 'Cinematic (2.39:1)', width: 2560, height: 1070 },
  '4:5': { label: 'Instagram (4:5)', width: 1080, height: 1350 },
};

export const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB
export const SUPPORTED_VIDEO_FORMATS = ['video/mp4', 'video/webm', 'video/ogg'];
