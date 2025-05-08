"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/language-context";
import { VideoFile, Background } from "@/types/video";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { ExportModal } from "@/components/export-modal";
import { cn } from "@/lib/utils";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Download,
  Maximize2,
  Minimize2,
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
  onReset,
  isProcessed 
}: PreviewPanelProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [videoSize, setVideoSize] = useState(75);

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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 50 && value <= 90) {
      setVideoSize(value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
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

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Minus className="h-4 w-4 text-muted-foreground" />
          <input
            type="range"
            min="50"
            max="90"
            value={videoSize}
            onChange={handleSizeChange}
            className="flex-1"
          />
          <Plus className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground w-12 text-right">
            {videoSize}%
          </span>
        </div>

        <Progress value={progress} className="h-2" />
        
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={togglePlay}
              className="h-8 w-8"
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
              className="h-8 w-8"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleFullscreen}
              className="h-8 w-8"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={() => setIsExportModalOpen(true)}
            disabled={!isProcessed}
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