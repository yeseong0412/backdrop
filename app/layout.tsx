import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/language-context';
import { Analytics } from "@vercel/analytics/react"
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

const SITE_URL = 'https://backdrop-topaz.vercel.app';
const OG_IMAGE_URL = `${SITE_URL}/backdrop.png`;

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
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    alternateLocale: 'en_US',
    url: SITE_URL,
    title: 'Backdrop - AI Video Background Changer',
    description: 'Transform your videos with AI-powered background removal and replacement. Upload, change backgrounds, and export in seconds.',
    siteName: 'Backdrop',
    images: [
      {
        url: OG_IMAGE_URL,
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
    images: [OG_IMAGE_URL],
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
    canonical: SITE_URL,
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
        <link rel="canonical" href={SITE_URL} />
        <link rel="alternate" hrefLang="en-US" href={`${SITE_URL}/en`} />
        <link rel="alternate" hrefLang="ko-KR" href={`${SITE_URL}/ko`} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="Backdrop" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="application-name" content="Backdrop" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-TileImage" content={OG_IMAGE_URL} />
        <meta property="og:image" content={OG_IMAGE_URL} />
        <meta name="twitter:image" content={OG_IMAGE_URL} />
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