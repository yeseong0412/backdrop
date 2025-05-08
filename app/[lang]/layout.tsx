import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/language-context';
import { Analytics } from "@vercel/analytics/react"
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const isKorean = params.lang === 'ko';
  
  return {
    title: isKorean ? '백드롭 - AI 비디오 배경 변경기' : 'Backdrop - AI Video Background Changer',
    description: isKorean 
      ? 'AI 기반 비디오 배경 제거 및 교체로 비디오를 변환하세요. 업로드, 배경 변경, 그리고 몇 초 만에 내보내기. 콘텐츠 제작자, 마케터, 전문가에게 완벽한 솔루션.'
      : 'Transform your videos with AI-powered background removal and replacement. Upload, change backgrounds, and export in seconds. Perfect for content creators, marketers, and professionals.',
    keywords: isKorean
      ? ['비디오 배경 변경', 'AI 비디오 편집기', '배경 제거', '비디오 편집', '콘텐츠 제작', '비디오 배경 교체', 'AI 비디오 처리']
      : ['video background changer', 'AI video editor', 'background removal', 'video editing', 'content creation', 'video background replacement', 'AI video processing'],
    authors: [{ name: 'Backdrop Team' }],
    creator: 'Backdrop',
    publisher: 'Backdrop',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://backdrop.app'),
    openGraph: {
      type: 'website',
      locale: isKorean ? 'ko_KR' : 'en_US',
      alternateLocale: isKorean ? 'en_US' : 'ko_KR',
      url: 'https://backdrop.app',
      title: isKorean ? '백드롭 - AI 비디오 배경 변경기' : 'Backdrop - AI Video Background Changer',
      description: isKorean
        ? 'AI 기반 비디오 배경 제거 및 교체로 비디오를 변환하세요. 업로드, 배경 변경, 그리고 몇 초 만에 내보내기.'
        : 'Transform your videos with AI-powered background removal and replacement. Upload, change backgrounds, and export in seconds.',
      siteName: 'Backdrop',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: isKorean ? '백드롭 - AI 비디오 배경 변경기' : 'Backdrop - AI Video Background Changer',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isKorean ? '백드롭 - AI 비디오 배경 변경기' : 'Backdrop - AI Video Background Changer',
      description: isKorean
        ? 'AI 기반 비디오 배경 제거 및 교체로 비디오를 변환하세요. 업로드, 배경 변경, 그리고 몇 초 만에 내보내기.'
        : 'Transform your videos with AI-powered background removal and replacement. Upload, change backgrounds, and export in seconds.',
      images: ['/twitter-image.jpg'],
      creator: '@backdrop',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-site-verification',
    },
    alternates: {
      languages: {
        'en-US': '/en',
        'ko-KR': '/ko',
      },
      canonical: 'https://backdrop.app',
    },
  };
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const isKorean = params.lang === 'ko';
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": isKorean ? "백드롭 - AI 비디오 배경 변경기" : "Backdrop - AI Video Background Changer",
    "description": isKorean
      ? "AI 기반 비디오 배경 제거 및 교체로 비디오를 변환하세요. 업로드, 배경 변경, 그리고 몇 초 만에 내보내기."
      : "Transform your videos with AI-powered background removal and replacement. Upload, change backgrounds, and export in seconds.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": isKorean
      ? [
          "AI 기반 비디오 배경 제거",
          "다양한 배경 옵션",
          "실시간 미리보기",
          "고품질 내보내기 옵션"
        ]
      : [
          "AI-powered video background removal",
          "Multiple background options",
          "Real-time preview",
          "High-quality export options"
        ],
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "permissions": "camera",
    "softwareVersion": "1.0.0",
    "inLanguage": isKorean ? "ko-KR" : "en-US"
  };

  return (
    <html lang={isKorean ? "ko" : "en"} suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://backdrop.app" />
        <link rel="alternate" hrefLang="en-US" href="https://backdrop.app/en" />
        <link rel="alternate" hrefLang="ko-KR" href="https://backdrop.app/ko" />
        <link rel="alternate" hrefLang="x-default" href="https://backdrop.app" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="Backdrop" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="application-name" content="Backdrop" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            {children}
            <Toaster />
            <Analytics />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 