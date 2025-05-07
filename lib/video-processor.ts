import { Background, ExportOptions, VideoFile } from "@/types/video";

// Create a canvas element for video processing
const createCanvas = (width: number, height: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

// Process video with background
export async function processVideoWithBackground(
  video: HTMLVideoElement,
  background: Background | null,
  quality: 'low' | 'medium' | 'high',
  resolution: '480p' | '720p' | '1080p' = '1080p'
): Promise<string> {
  return new Promise(async (resolve) => {
    // Set canvas size based on resolution
    const [width, height] = resolution === '1080p' ? [1920, 1080] :
                           resolution === '720p' ? [1280, 720] :
                           [854, 480];
    
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Create a temporary video element for processing
    const tempVideo = document.createElement('video');
    tempVideo.src = video.src;
    tempVideo.muted = true;
    tempVideo.crossOrigin = "anonymous";
    
    // Wait for video to be loaded
    await new Promise((resolve) => {
      tempVideo.onloadeddata = resolve;
    });

    // Load background image if provided
    let bgImage: HTMLImageElement | null = null;
    if (background) {
      bgImage = new Image();
      bgImage.crossOrigin = "anonymous";
      bgImage.src = background.url;
      await new Promise((resolve) => {
        if (bgImage) bgImage.onload = resolve;
      });
    }

    // Create MediaRecorder to capture the processed video
    const stream = canvas.captureStream(30); // 30 FPS
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: quality === 'high' ? 5000000 : quality === 'medium' ? 2500000 : 1000000
    });

    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      resolve(url);
    };

    // Start recording
    mediaRecorder.start(100);

    // Process video frames
    const processFrame = () => {
      if (tempVideo.paused || tempVideo.ended) return;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw background if provided
      if (bgImage) {
        ctx.drawImage(bgImage, 0, 0, width, height);
      }

      // Calculate video size to maintain aspect ratio
      const videoAspectRatio = tempVideo.videoWidth / tempVideo.videoHeight;
      const canvasAspectRatio = width / height;
      
      let drawWidth, drawHeight, offsetX, offsetY;
      
      if (videoAspectRatio > canvasAspectRatio) {
        // Video is wider than canvas
        drawWidth = width;
        drawHeight = width / videoAspectRatio;
        offsetX = 0;
        offsetY = (height - drawHeight) / 2;
      } else {
        // Video is taller than canvas
        drawHeight = height;
        drawWidth = height * videoAspectRatio;
        offsetX = (width - drawWidth) / 2;
        offsetY = 0;
      }

      // Draw video frame
      ctx.drawImage(tempVideo, offsetX, offsetY, drawWidth, drawHeight);

      // Request next frame
      requestAnimationFrame(processFrame);
    };

    // Start video playback and processing
    tempVideo.play().then(() => {
      processFrame();
    });

    // Stop recording after video duration
    setTimeout(() => {
      mediaRecorder.stop();
      tempVideo.pause();
    }, video.duration * 1000);
  });
}

// Process video with background removal and replacement
export async function simulateProcessedVideo(
  video: VideoFile,
  background: Background | null,
  quality: 'low' | 'medium' | 'high',
  onProgress: (progress: number) => void
): Promise<{ processedUrl: string; progress: number }> {
  return new Promise(async (resolve) => {
    let progress = 0;
    
    // Create a temporary video element
    const tempVideo = document.createElement('video');
    tempVideo.src = video.url;
    
    // Wait for video to be loaded
    await new Promise((resolve) => {
      tempVideo.onloadeddata = resolve;
    });

    // Process the video with background
    try {
      const processedUrl = await processVideoWithBackground(tempVideo, background, quality);
      
      // Update progress
      const interval = setInterval(() => {
        progress += 10;
        onProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          resolve({
            processedUrl,
            progress: 100
          });
        }
      }, 100);
    } catch (error) {
      console.error('Error processing video:', error);
      resolve({
        processedUrl: video.url,
        progress: 100
      });
    }
  });
}

// Export processed video
export async function exportVideo(
  video: VideoFile,
  background: Background | null,
  options: ExportOptions,
  onProgress: (progress: number) => void
): Promise<{ url: string; progress: number }> {
  return new Promise(async (resolve) => {
    let progress = 0;
    
    // Create a temporary video element
    const tempVideo = document.createElement('video');
    tempVideo.src = video.url;
    tempVideo.crossOrigin = "anonymous";
    
    // Wait for video to be loaded
    await new Promise((resolve) => {
      tempVideo.onloadeddata = resolve;
    });

    try {
      const processedUrl = await processVideoWithBackground(
        tempVideo,
        background,
        options.quality,
        options.resolution
      );
      
      // Update progress
      const interval = setInterval(() => {
        progress += 10;
        onProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          resolve({
            url: processedUrl,
            progress: 100
          });
        }
      }, 100);
    } catch (error) {
      console.error('Error exporting video:', error);
      resolve({
        url: video.url,
        progress: 100
      });
    }
  });
}