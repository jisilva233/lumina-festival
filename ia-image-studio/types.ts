
export type Mode = 'create' | 'edit' | 'video';
export type CreateFunction = 'free' | 'sticker' | 'text' | 'comic';
export type EditFunction = 'add-remove' | 'retouch' | 'style' | 'compose' | 'photo-restoration' | 'background-removal';
export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
export type ImageStyle = 'none' | 'photo' | 'anime' | 'cartoon' | 'painting' | 'pixar';
export type ImageFilter = 'none' | 'vivid' | 'monochrome' | 'sepia';
export type VideoResolution = '720p' | '1080p';

export interface ImageFile {
  file: File;
  base64: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  imageUrl: string;
  prompt: string;
  createFunction: CreateFunction;
  aspectRatio: AspectRatio;
  style: ImageStyle;
}
