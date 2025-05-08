import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLanguage } from "@/context/language-context";
import { VideoIcon } from "lucide-react";

export function Navbar() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <VideoIcon className="h-6 w-6" />
          <span className="text-xl font-bold">{t('common.title')}</span>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}