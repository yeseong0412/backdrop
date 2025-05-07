"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useLanguage } from "@/context/language-context";
import { VideoFile } from "@/types/video";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Upload, FileVideo, X } from "lucide-react";
import { useToast } from '@/components/ui/use-toast';

interface VideoUploaderProps {
  onVideoUploaded: (video: VideoFile) => void;
}

export function VideoUploader({ onVideoUploaded }: VideoUploaderProps) {
  const { t } = useLanguage();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError(t("upload.error.invalidType"));
      return;
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setError(t("upload.error.tooLarge"));
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Create video URL
      const videoUrl = URL.createObjectURL(file);

      // Simulate upload completion
      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(100);
        
        // Create video file object
        const video: VideoFile = {
          file,
          url: videoUrl,
          name: file.name,
          size: file.size,
          type: file.type,
          duration: 0, // Will be set when video is loaded
          width: 0, // Will be set when video is loaded
          height: 0, // Will be set when video is loaded
          format: file.type.split('/')[1] || 'mp4'
        };

        // Create video element to get duration
        const videoElement = document.createElement('video');
        videoElement.src = videoUrl;
        videoElement.onloadedmetadata = () => {
          video.duration = videoElement.duration;
          video.width = videoElement.videoWidth;
          video.height = videoElement.videoHeight;
          onVideoUploaded(video);
          setIsUploading(false);
        };
      }, 2000);
    } catch (err) {
      setError(t("upload.error.uploadFailed"));
      setIsUploading(false);
    }
  }, [t, onVideoUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': []
    },
    maxFiles: 1,
    disabled: isUploading
  });

  return (
    <Card className="p-4 md:p-6">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 md:p-8 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            {isUploading ? (
              <FileVideo className="h-6 w-6 text-primary" />
            ) : (
              <Upload className="h-6 w-6 text-primary" />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {isUploading ? t("upload.uploading") : t("upload.title")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("upload.description")}
            </p>
          </div>

          {!isUploading && (
            <Button variant="outline" className="mt-2">
              {t("upload.selectFile")}
            </Button>
          )}
        </div>

        {isUploading && (
          <div className="mt-4 space-y-2">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {uploadProgress}%
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md flex items-center justify-between">
            <span className="text-sm">{error}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setError(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}