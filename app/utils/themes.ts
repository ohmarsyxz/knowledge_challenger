import { Gem, BookOpen, Zap, Contrast } from 'lucide-react';
import { Theme } from '../types';

/**
 * Single source of truth for slide themes. Previously duplicated across
 * PresentationWorkspace, ThemeSelector and PresenterConsole.
 */
export const THEMES: Theme[] = [
  {
    id: 'glass',
    name: 'Dark Glassmorphism',
    className: 'theme-glass',
    icon: Gem,
    swatch: '#a855f7',
  },
  {
    id: 'editorial',
    name: 'Editorial Light',
    className: 'theme-editorial',
    icon: BookOpen,
    swatch: '#c2410c',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Accent',
    className: 'theme-cyberpunk',
    icon: Zap,
    swatch: '#00ffcc',
  },
  {
    id: 'monotone',
    name: 'Minimalist Monotone',
    className: 'theme-monotone',
    icon: Contrast,
    swatch: '#000000',
  },
];

export const getTheme = (id: string): Theme =>
  THEMES.find((t) => t.id === id) ?? THEMES[0];
