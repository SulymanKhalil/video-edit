# Video Editor

A modern video editing web application built with React + TypeScript that processes videos entirely in the browser using frontend-only technologies.

## Features

- **Video Upload**: Drag & drop or click to upload video files (MP4, WebM, OGG)
- **Video Preview**: Instant preview of uploaded videos
- **Trim Controls**: Select start and end times with sliders or manual input
- **Aspect Ratio Selection**: Choose from 16:9, 1:1, 9:16, or 4:3 ratios
- **Browser-based Processing**: No backend required - all processing happens in your browser
- **Download**: Export edited videos as WebM files

## Technical Implementation

### Core Technologies
- **React 18** with functional components and hooks
- **TypeScript** for type safety
- **Tailwind CSS** for modern dark UI styling
- **HTML5 Video API** for video playback
- **Canvas API** for video processing and aspect ratio conversion
- **MediaRecorder API** for recording processed video
- **Vite** for fast development and building

### Processing Pipeline
1. Video is loaded into HTML5 video element
2. Canvas is created with target aspect ratio dimensions
3. Video frames are drawn to canvas using `requestAnimationFrame`
4. Canvas stream is captured using `canvas.captureStream()`
5. MediaRecorder records the stream at 30fps
6. Recording stops when reaching the end time
7. Blob is created and made available for download

## Project Structure

```
src/
├── components/
│   ├── UploadSection.tsx     # File upload with drag & drop
│   ├── VideoPreview.tsx      # Video player with controls
│   ├── TrimControls.tsx      # Time range sliders
│   ├── RatioSelector.tsx     # Aspect ratio selection
│   ├── ActionButtons.tsx      # Apply/Download buttons
│   └── ProcessingStatus.tsx   # Progress indicator
├── types.ts                  # TypeScript type definitions
├── App.tsx                   # Main application with processing logic
├── main.tsx                  # Application entry point
└── index.css                 # Tailwind CSS imports
```

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Upload a Video**: Click the upload area or drag & drop a video file (max 200MB)
2. **Preview**: The video will appear with playback controls
3. **Trim**: Use the sliders to select the desired start and end times
4. **Select Aspect Ratio**: Choose your target aspect ratio from the dropdown or visual selector
5. **Apply Changes**: Click "Apply Changes" to process the video
6. **Download**: Once processing is complete, click "Download Video" to save your edited video

## Browser Compatibility

This application requires modern browser APIs:
- **MediaRecorder API**: Chrome 47+, Firefox 25+, Safari 14.1+
- **Canvas.captureStream()**: Chrome 51+, Firefox 43+, Safari 14.1+
- **HTML5 Video**: All modern browsers

## Limitations

- Maximum file size: 200MB
- Output format: WebM (VP9 codec)
- Processing speed depends on device performance
- Large videos may require significant memory

## Error Handling

The application includes comprehensive error handling for:
- Unsupported file formats
- File size limits
- Video metadata loading failures
- Processing errors
- Browser compatibility issues

## Performance Considerations

- Videos are processed at 30fps to balance quality and performance
- Canvas dimensions are optimized for common aspect ratios
- Memory usage is monitored during processing
- Large videos are chunked during processing to prevent browser crashes
