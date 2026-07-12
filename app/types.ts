import type { LucideIcon } from 'lucide-react';

export type ElementType =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'ul'
  | 'ol'
  | 'code'
  | 'image'
  | 'blockquote'
  | 'paragraph';

export interface SlideElement {
  type: ElementType;
  content: string; // Used for text, paragraphs, headings, etc.
  items?: string[]; // Used for list items
  language?: string; // Used for code block syntax highlighting
  src?: string; // Used for image source url
  alt?: string; // Used for image alt text
}

export type LayoutType = 'title' | 'split' | 'code' | 'default';

export interface Slide {
  id: number;
  raw: string;
  elements: SlideElement[];
  notes: string; // Speaker notes
  layout: LayoutType;
}

export type ThemeId = 'glass' | 'editorial' | 'cyberpunk' | 'monotone';

export interface Theme {
  id: ThemeId;
  name: string;
  className: string; // The root wrapper class for styling
  icon: LucideIcon;
  swatch: string; // Preview dot colour, shown alongside the label
}

export interface Template {
  id: string;
  name: string;
  description: string;
  markdown: string;
}

// Interface for messages sent via BroadcastChannel for presenter view syncing
export interface SyncMessage {
  type: 'SLIDE_CHANGE' | 'REQUEST_STATE' | 'SYNC_STATE';
  currentSlideIndex: number;
  markdown?: string;
  themeId?: ThemeId;
  totalSlides?: number;
}
