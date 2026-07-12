'use client';

import React, { useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { ThemeId } from '../../app/types';
import { THEMES, getTheme } from '../../app/utils/themes';

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
  const selectedTheme = getTheme(themeId);
  const SelectedIcon = selectedTheme.icon;
  const rootRef = useRef<HTMLDivElement>(null);

  // Dismiss on outside click / Escape — a menu you can only close by
  // re-clicking the trigger is a keyboard dead end.
  useEffect(() => {
    if (!showThemeMenu) return;

    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setShowThemeMenu(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowThemeMenu(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [showThemeMenu, setShowThemeMenu]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        onClick={() => setShowThemeMenu(!showThemeMenu)}
        aria-haspopup="menu"
        aria-expanded={showThemeMenu}
        className="flex items-center gap-2 h-11 px-4 bg-surface hover:bg-surface-muted border border-border rounded-xl text-sm font-medium text-foreground-muted transition-colors duration-150 cursor-pointer"
      >
        <SelectedIcon className="w-4 h-4 text-primary" aria-hidden="true" />
        <span className="hidden md:inline">{selectedTheme.name}</span>
        <ChevronDown
          className={`w-4 h-4 opacity-60 transition-transform duration-150 ${showThemeMenu ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {showThemeMenu && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-50"
        >
          <div className="px-4 py-2.5 border-b border-border">
            <span className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider">
              Slide theme
            </span>
          </div>
          <div className="p-1.5 space-y-0.5">
            {THEMES.map((theme) => {
              const Icon = theme.icon;
              const isActive = themeId === theme.id;
              return (
                <button
                  key={theme.id}
                  role="menuitemradio"
                  aria-checked={isActive}
                  onClick={() => onThemeChange(theme.id)}
                  className={`w-full flex items-center gap-3 px-3 h-11 rounded-lg text-sm text-left transition-colors duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-primary text-on-primary font-semibold'
                      : 'text-foreground-muted hover:bg-surface-muted'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span className="flex-1 truncate">{theme.name}</span>
                  <span
                    className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                    style={{ background: theme.swatch }}
                    aria-hidden="true"
                  />
                  {isActive && <Check className="w-4 h-4 shrink-0" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
