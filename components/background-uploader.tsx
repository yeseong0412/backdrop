'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useLanguage } from '@/context/language-context';
import { Background } from '@/types/video';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Upload, Image, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface BackgroundUploaderProps {
  onBackgroundUploaded: (background: Background) => void;
}

export function BackgroundUploader({ onBackgroundUploaded }: BackgroundUploaderProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError(t("upload.error.invalidImageType"));
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError(t("upload.error.imageTooLarge"));
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Create image URL
      const imageUrl = URL.createObjectURL(file);

      // Create background object
      const background: Background = {
        id: `custom-${Date.now()}`,
        name: file.name,
        url: imageUrl,
        type: 'image'
      };

      onBackgroundUploaded(background);
      setIsUploading(false);
      toast({
        title: t("upload.success"),
        description: t("upload.backgroundUploaded"),
      });
    } catch (err) {
      setError(t("upload.error.uploadFailed"));
      setIsUploading(false);
    }
  }, [t, onBackgroundUploaded, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
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
              <Image className="h-6 w-6 text-primary" />
            ) : (
              <Upload className="h-6 w-6 text-primary" />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {isUploading ? t("upload.uploading") : t("upload.backgroundTitle")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("upload.backgroundDescription")}
            </p>
          </div>

          {!isUploading && (
            <Button variant="outline" className="mt-2">
              {t("upload.selectImage")}
            </Button>
          )}
        </div>

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