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

    if (!file.type.startsWith('video/')) {
      setError(t("upload.error.invalidType"));
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setError(t("upload.error.tooLarge"));
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const videoUrl = URL.createObjectURL(file);

      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(100);
        
        const video: VideoFile = {
          file,
          url: videoUrl,
          name: file.name,
          size: file.size,
          type: file.type,
          duration: 0,
          width: 0,
          height: 0,
          format: file.type.split('/')[1] || 'mp4'
        };

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
    <Card className="p-2 md:p-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 md:p-6 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-3 md:gap-4">
          <div className="p-2 md:p-3 rounded-full bg-primary/10">
            {isUploading ? (
              <FileVideo className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            ) : (
              <Upload className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            )}
          </div>
          
          <div className="space-y-1 md:space-y-2">
            <h3 className="text-base md:text-lg font-semibold">
              {isUploading ? t("upload.uploading") : t("upload.title")}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              {t("upload.description")}
            </p>
          </div>

          {!isUploading && (
            <Button variant="outline" className="mt-1 md:mt-2 h-8 md:h-10 px-3 md:px-4 text-sm">
              {t("upload.selectFile")}
            </Button>
          )}
        </div>

        {isUploading && (
          <div className="mt-3 md:mt-4 space-y-1 md:space-y-2">
            <Progress value={uploadProgress} className="h-1 md:h-2" />
            <p className="text-xs md:text-sm text-muted-foreground">
              {uploadProgress}%
            </p>
          </div>
        )}

        {error && (
          <div className="mt-3 md:mt-4 p-2 md:p-3 bg-destructive/10 text-destructive rounded-md flex items-center justify-between">
            <span className="text-xs md:text-sm">{error}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 md:h-6 md:w-6"
              onClick={() => setError(null)}
            >
              <X className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}