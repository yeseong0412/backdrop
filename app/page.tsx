"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { VideoUploader } from "@/components/video-uploader";
import { BackgroundPanel } from "@/components/background-panel";
import { PreviewPanel } from "@/components/preview-panel";
import { ExportPanel } from "@/components/export-options";
import { useLanguage } from "@/context/language-context";
import { VideoFile, Background, ProcessingOptions } from "@/types/video";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

export default function Home() {
  const { t } = useLanguage();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activeTab, setActiveTab] = useState("upload");
  const [video, setVideo] = useState<VideoFile | null>(null);
  const [processingOptions, setProcessingOptions] = useState<ProcessingOptions>({
    background: null,
    quality: 'medium',
    videoSize: 75,
  });
  const [isProcessed, setIsProcessed] = useState(false);

  const handleVideoUploaded = (uploadedVideo: VideoFile) => {
    setVideo(uploadedVideo);
    if (!isMobile) {
      setActiveTab("backgrounds");
    }
  };

  const handleBackgroundChange = (background: Background | null) => {
    setProcessingOptions(prev => ({ ...prev, background }));
    setIsProcessed(true);
    if (!isMobile) {
      setActiveTab("preview");
    }
  };

  const handleQualityChange = (quality: "low" | "medium" | "high") => {
    setProcessingOptions(prev => ({ ...prev, quality }));
  };

  const handleProcessingComplete = () => {
    setIsProcessed(true);
    if (!isMobile) {
      setActiveTab("export");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container py-4 md:py-8 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center md:text-left">
            {t("common.title")}
          </h1>
          <p className="text-muted-foreground mb-6 md:mb-8 text-center md:text-left">
            {t("common.subtitle")}
          </p>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="space-y-4 md:space-y-6"
          >
            <TabsList className={cn(
              "grid w-full",
              isMobile ? "grid-cols-1 gap-2" : "grid-cols-3"
            )}>
              <TabsTrigger value="upload" className="w-full">
                {t("common.upload")}
              </TabsTrigger>
              <TabsTrigger 
                value="backgrounds" 
                disabled={!video}
                className="w-full"
              >
                {t("common.backgrounds")}
              </TabsTrigger>
              <TabsTrigger 
                value="preview" 
                disabled={!video}
                className="w-full"
              >
                {t("common.preview")}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4 md:space-y-6">
              <div className="w-full">
                <VideoUploader onVideoUploaded={handleVideoUploaded} />
              </div>
            </TabsContent>
            
            <TabsContent value="backgrounds" className="space-y-4 md:space-y-6">
              <div className="w-full">
                <BackgroundPanel
                  onBackgroundChange={handleBackgroundChange}
                  selectedBackground={processingOptions.background}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-4 md:space-y-6">
              <div className="w-full">
                <PreviewPanel
                  video={video!}
                  background={processingOptions.background}
                  onReset={() => setVideo(null)}
                  isProcessed={isProcessed}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="border-t py-4 md:py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Backdrop
          </p>
          <p className="text-sm text-muted-foreground">
            {t("common.subtitle")}
          </p>
        </div>
      </footer>
    </div>
  );
}