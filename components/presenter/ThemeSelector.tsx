'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { ThemeId, Theme } from '../../app/types';

const THEMES: Theme[] = [
  { id: 'glass', name: '🔮 Dark Glassmorphism', className: 'theme-glass' },
  { id: 'editorial', name: '🎨 Editorial Light', className: 'theme-editorial' },
  { id: 'cyberpunk', name: '⚡ Cyberpunk Accent', className: 'theme-cyberpunk' },
  { id: 'monotone', name: '🔳 Minimalist Monotone', className: 'theme-monotone' },
];

interface ThemeSelectorProps {
  themeId: ThemeId;
  onThemeChange: (id: ThemeId) => void;
  showThemeMenu: boolean;
  setShowThemeMenu: (show: boolean) => void;
}

export default function ThemeSelector({
  themeId,
  onThemeChange,
  showThemeMenu,
  setShowThemeMenu
}: ThemeSelectorProps) {
  const selectedTheme = THEMES.find((t) => t.id === themeId) || THEMES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setShowThemeMenu(!showThemeMenu)}
        className="flex items-center gap-2 px-4 py-2 bg-[#1b1b22] hover:bg-[#26262f] border border-[#2e2e38] rounded-xl text-sm font-medium transition-all duration-200"
      >
        <span>{selectedTheme.name}</span>
        <ChevronDown className="w-4 h-4 opacity-60" />
      </button>
      {showThemeMenu && (
        <div className="absolute right-0 mt-2 w-64 bg-[#141419] border border-[#2e2e38] rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="p-2 border-b border-[#2e2e38]">
            <span className="text-xs font-semibold text-zinc-500 px-3 uppercase tracking-wider">Themes</span>
          </div>
          <div className="p-1.5 space-y-1">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => onThemeChange(theme.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-left transition-all ${themeId === theme.id
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'hover:bg-[#1f1f27] text-zinc-300'
                  }`}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export { THEMES };
