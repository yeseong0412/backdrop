"use client";

import { useLanguage } from '@/context/language-context';
import { Background, presetBackgrounds, blurBackground } from '@/types/video';
import { BackgroundUploader } from '@/components/background-uploader';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BackgroundPanelProps {
  selectedBackground: Background | null;
  onBackgroundChange: (background: Background | null) => void;
}

export function BackgroundPanel({
  selectedBackground,
  onBackgroundChange,
}: BackgroundPanelProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t("backgrounds.title")}</h3>
      
      <BackgroundUploader onBackgroundUploaded={onBackgroundChange} />
      
      <ScrollArea className="h-[calc(100vh-16rem)] md:h-[calc(100vh-12rem)]">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-1">
          <button
            onClick={() => onBackgroundChange(null)}
            className={cn(
              "relative aspect-video rounded-lg overflow-hidden border-2 transition-all",
              !selectedBackground ? "border-primary" : "border-transparent hover:border-primary/50"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {t("background.none")}
              </span>
            </div>
          </button>

          <button
            onClick={() => onBackgroundChange(blurBackground)}
            className={cn(
              "relative aspect-video rounded-lg overflow-hidden border-2 transition-all",
              selectedBackground?.id === blurBackground.id ? "border-primary" : "border-transparent hover:border-primary/50"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {blurBackground.name}
              </span>
            </div>
          </button>

          {presetBackgrounds.map((background) => (
            <button
              key={background.id}
              onClick={() => onBackgroundChange(background)}
              className={cn(
                "relative aspect-video rounded-lg overflow-hidden border-2 transition-all",
                selectedBackground?.id === background.id ? "border-primary" : "border-transparent hover:border-primary/50"
              )}
            >
              <img
                src={background.url}
                alt={background.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {background.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
} 