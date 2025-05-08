export interface VideoFile {
  file: File;
  url: string;
  name: string;
  size: number;
  type: string;
  duration: number;
  width: number;
  height: number;
  format: string;
}

export interface Background {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'blur';
  blurAmount?: number;
}

export interface ProcessingOptions {
  background: Background | null;
  quality: 'low' | 'medium' | 'high';
  videoSize: number;
}

export interface ExportOptions {
  format: 'mp4' | 'gif';
  quality: 'low' | 'medium' | 'high';
  resolution: '480p' | '720p' | '1080p';
}

export interface Theme {
  id: string;
  name: string;
  backgrounds: Background[];
}

export const presetBackgrounds: Background[] = [
  {
    id: 'office',
    name: 'Office',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=900&fit=crop',
    type: 'image',
  },
  {
    id: 'living-room',
    name: 'Living Room',
    url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&h=900&fit=crop',
    type: 'image',
  },
  {
    id: 'studio',
    name: 'Studio',
    url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1600&h=900&fit=crop',
    type: 'image',
  },
  {
    id: 'beach',
    name: 'Beach',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&h=900&fit=crop',
    type: 'image',
  },
  {
    id: 'forest',
    name: 'Forest',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&h=900&fit=crop',
    type: 'image',
  },
  {
    id: 'mountain',
    name: 'Mountain',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&h=900&fit=crop',
    type: 'image',
  },
  {
    id: 'city',
    name: 'City',
    url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&h=900&fit=crop',
    type: 'image',
  },
  {
    id: 'space',
    name: 'Space',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&h=900&fit=crop',
    type: 'image',
  },
  {
    id: 'abstract',
    name: 'Abstract',
    url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&h=900&fit=crop',
    type: 'image',
  },
  {
    id: 'gradient',
    name: 'Gradient',
    url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1600&h=900&fit=crop',
    type: 'image',
  },
];

export const blurBackground: Background = {
  id: 'blur',
  name: 'Blur',
  url: '',
  type: 'blur',
  blurAmount: 10,
};