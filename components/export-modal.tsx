"use client";

import { useState } from "react";
import { useLanguage } from "@/context/language-context";
import { ExportOptions, VideoFile, ProcessingOptions } from "@/types/video";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Download,
  FileVideo,
  Loader2,
  Image,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { exportVideo } from "@/lib/video-processor";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: VideoFile | null;
  processingOptions: ProcessingOptions;
  isProcessed: boolean;
}

export function ExportModal({
  isOpen,
  onClose,
  video,
  processingOptions,
  isProcessed,
}: ExportModalProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "mp4",
    quality: "high",
    resolution: "1080p",
  });
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);

  const handleExport = async () => {
    if (!video || !isProcessed) return;

    setExporting(true);
    setExportProgress(0);
    setExportedUrl(null);

    try {
      const { url, progress } = await exportVideo(
        video,
        processingOptions.background,
        exportOptions,
        (progress) => {
          setExportProgress(progress);
        }
      );

      setExportedUrl(url);
      
      toast({
        title: t("export.downloadComplete"),
        description: exportOptions.format.toUpperCase(),
      });
    } catch (error) {
      console.error("Error exporting video:", error);
      toast({
        title: t("export.downloadFailed"),
        description: t("errors.general"),
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const handleDownload = async () => {
    if (!exportedUrl) return;

    try {
      // Fetch the video data
      const response = await fetch(exportedUrl);
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `backdrop-export-${Date.now()}.${exportOptions.format}`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: t("export.downloadComplete"),
        description: t("export.downloadSuccess"),
      });
    } catch (error) {
      console.error("Error downloading video:", error);
      toast({
        title: t("export.downloadFailed"),
        description: t("errors.download"),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("export.title")}</DialogTitle>
          <DialogDescription>
            {t("export.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">
              {t("export.format")}
            </label>
            <Select
              value={exportOptions.format}
              onValueChange={(value) =>
                setExportOptions({
                  ...exportOptions,
                  format: value as "mp4" | "gif",
                })
              }
              disabled={exporting}
            >
              <SelectTrigger>
                <SelectValue>
                  {exportOptions.format === "mp4" ? (
                    <div className="flex items-center">
                      <FileVideo className="h-4 w-4 mr-2" />
                      MP4
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Image className="h-4 w-4 mr-2" />
                      GIF
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mp4">
                  <div className="flex items-center">
                    <FileVideo className="h-4 w-4 mr-2" />
                    MP4
                  </div>
                </SelectItem>
                <SelectItem value="gif">
                  <div className="flex items-center">
                    <Image className="h-4 w-4 mr-2" />
                    GIF
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">
              {t("export.quality")}
            </label>
            <Select
              value={exportOptions.quality}
              onValueChange={(value) =>
                setExportOptions({
                  ...exportOptions,
                  quality: value as "low" | "medium" | "high",
                })
              }
              disabled={exporting}
            >
              <SelectTrigger>
                <SelectValue>{t(`export.${exportOptions.quality}`)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{t("export.low")}</SelectItem>
                <SelectItem value="medium">{t("export.medium")}</SelectItem>
                <SelectItem value="high">{t("export.high")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">
              {t("export.resolution")}
            </label>
            <Select
              value={exportOptions.resolution}
              onValueChange={(value) =>
                setExportOptions({
                  ...exportOptions,
                  resolution: value as "480p" | "720p" | "1080p",
                })
              }
              disabled={exporting}
            >
              <SelectTrigger>
                <SelectValue>{exportOptions.resolution}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="480p">480p</SelectItem>
                <SelectItem value="720p">720p</SelectItem>
                <SelectItem value="1080p">1080p</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {exporting && (
            <div className="grid gap-2 mt-2">
              <div className="flex justify-between text-sm">
                <span>{t("common.processing")}</span>
                <span>{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} className="h-2" />
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={!exportedUrl || exporting}
          >
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("export.exporting")}
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                {t("export.download")}
              </>
            )}
          </Button>
          <Button
            onClick={handleExport}
            disabled={!video || !isProcessed || exporting}
          >
            {exporting ? (
              <>
                <Progress value={exportProgress} className="w-24 mr-2" />
                {t("export.exporting")}
              </>
            ) : (
              <>
                <FileVideo className="h-4 w-4 mr-2" />
                {t("export.export")}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 