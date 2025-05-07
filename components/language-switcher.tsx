"use client";

import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ko" : "en");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      className="fixed top-4 right-4"
    >
      <Globe className="h-4 w-4" />
      <span className="sr-only">
        {language === "en" ? "한국어로 전환" : "Switch to English"}
      </span>
    </Button>
  );
}