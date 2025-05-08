"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/language-context";
import { VideoFile, Background } from "@/types/video";
import { Button } from "@/components/ui/button";
import { ExportModal } from "@/components/export-modal";
import {
  Play, 
  Pause, 
  RotateCcw, 
  Download,
  Minus,
  Plus
} from "lucide-react";

interface PreviewPanelProps {
  video: VideoFile;
  background: Background | null;
  onReset: () => void;
  isProcessed: boolean;
}

export function PreviewPanel({ 
  video, 
  background, 
  isProcessed
}: PreviewPanelProps) {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [videoSize, setVideoSize] = useState(75);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => {
      const progress = (videoElement.currentTime / videoElement.duration) * 100;
      setProgress(progress);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('ended', handleEnded);

    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleReset = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setProgress(0);
      setIsPlaying(false);
    }
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 50 && value <= 90) {
      setVideoSize(value);
    }
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const newTime = (percentage / 100) * videoRef.current.duration;
    
    videoRef.current.currentTime = newTime;
    setProgress(percentage);
  };

  const handleTimelineDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !videoRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    const newTime = (percentage / 100) * videoRef.current.duration;
    
    videoRef.current.currentTime = newTime;
    setProgress(percentage);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
        {/* Background Layer */}
        {background && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: background.type === 'blur' 
                ? 'none'
                : `url(${background.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: background.type === 'blur' ? `blur(${background.blurAmount}px)` : 'none',
              backgroundColor: background.type === 'blur' ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
            }}
          />
        )}
        
        {/* Video Layer */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div style={{ width: `${videoSize}%`, height: `${videoSize}%` }}>
            <video
              ref={videoRef}
              src={video.url}
              className="w-full h-full object-contain"
              playsInline
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4 bg-card rounded-lg shadow-sm">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">
              {t("preview.size")}
            </label>
            <span className="text-sm text-muted-foreground">
              {videoSize}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Minus className="h-4 w-4 text-muted-foreground" />
            <input
              type="range"
              min="50"
              max="90"
              value={videoSize}
              onChange={handleSizeChange}
              className="flex-1 h-2 bg-secondary rounded-full appearance-none cursor-pointer"
            />
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div 
          className="relative h-2 bg-secondary rounded-full cursor-pointer"
          onClick={handleTimelineClick}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleTimelineDrag}
        >
          <div 
            className="absolute h-full bg-primary rounded-full"
            style={{ width: `${progress}%` }}
          />
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full -ml-2"
            style={{ left: `${progress}%` }}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={togglePlay}
              className="h-9 w-9"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              className="h-9 w-9"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={() => setIsExportModalOpen(true)}
            disabled={!isProcessed}
            className="w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            {t("export.title")}
          </Button>
        </div>
      </div>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        video={video}
        processingOptions={{ 
          background, 
          quality: 'high',
          videoSize 
        }}
        isProcessed={isProcessed}
      />
    </div>
  );
}