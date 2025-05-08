import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/language-context';
import { Analytics } from "@vercel/analytics/react"
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Backdrop - AI Video Background Changer',
  description: 'Transform your videos with AI-powered background removal and replacement. Upload, change backgrounds, and export in seconds. Perfect for content creators, marketers, and professionals.',
  keywords: ['video background changer', 'AI video editor', 'background removal', 'video editing', 'content creation', 'video background replacement', 'AI video processing'],
  authors: [{ name: 'Backdrop Team' }],
  creator: 'Backdrop',
  publisher: 'Backdrop',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://backdrop.kro.kr'),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    alternateLocale: 'en_US',
    url: 'https://backdrop.kro.kr',
    title: 'Backdrop - AI Video Background Changer',
    description: 'Transform your videos with AI-powered background removal and replacement. Upload, change backgrounds, and export in seconds.',
    siteName: 'Backdrop',
    images: [
      {
        url: '/backdrop.png',
        width: 1200,
        height: 630,
        alt: 'Backdrop - AI Video Background Changer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Backdrop - AI Video Background Changer',
    description: 'Transform your videos with AI-powered background removal and replacement. Upload, change backgrounds, and export in seconds.',
    images: ['/backdrop.png'],
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
    canonical: 'https://backdrop.kro.kr',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Backdrop - AI Video Background Changer",
    "description": "Transform your videos with AI-powered background removal and replacement. Upload, change backgrounds, and export in seconds.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "AI-powered video background removal",
      "Multiple background options",
      "Real-time preview",
      "High-quality export options"
    ],
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "permissions": "camera",
    "softwareVersion": "1.0.0",
    "inLanguage": ["en-US", "ko-KR"]
  };

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://backdrop.kro.kr" />
        <link rel="alternate" hrefLang="en-US" href="https://backdrop.kro.kr/en" />
        <link rel="alternate" hrefLang="ko-KR" href="https://backdrop.kro.kr/ko" />
        <link rel="alternate" hrefLang="x-default" href="https://backdrop.kro.kr" />
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