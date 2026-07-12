'use client';

import React, { useEffect, useRef } from 'react';
import { ChevronDown, FolderOpen, FileText, Check } from 'lucide-react';

interface DeckSelectorProps {
  files: string[];
  activeFile: string;
  showDeckMenu: boolean;
  setShowDeckMenu: (show: boolean) => void;
  onDeckChange: (filename: string) => void;
}

export default function DeckSelector({
  files,
  activeFile,
  showDeckMenu,
  setShowDeckMenu,
  onDeckChange
}: Readonly<DeckSelectorProps>) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showDeckMenu) return;

    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setShowDeckMenu(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowDeckMenu(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [showDeckMenu, setShowDeckMenu]);

  if (files.length === 0) return null;

  return (
    <div className="relative" ref={rootRef}>
      <button
        onClick={() => setShowDeckMenu(!showDeckMenu)}
        aria-haspopup="menu"
        aria-expanded={showDeckMenu}
        className="flex items-center gap-2 h-11 px-4 bg-primary-soft hover:bg-primary-border/50 border border-primary-border rounded-xl text-sm font-semibold text-primary transition-colors duration-150 cursor-pointer max-w-60"
      >
        <FolderOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span className="truncate">{activeFile || 'Select deck'}</span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 opacity-70 transition-transform duration-150 ${showDeckMenu ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {showDeckMenu && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-72 bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-50"
        >
          <div className="px-4 py-2.5 border-b border-border">
            <span className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider">
              Decks in slides/
            </span>
          </div>
          <div className="p-1.5 space-y-0.5 max-h-72 overflow-y-auto">
            {files.map((file) => {
              const isActive = activeFile === file;
              return (
                <button
                  key={file}
                  role="menuitemradio"
                  aria-checked={isActive}
                  onClick={() => onDeckChange(file)}
                  className={`w-full flex items-center gap-2.5 px-3 h-11 rounded-lg text-sm text-left transition-colors duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-primary text-on-primary font-semibold'
                      : 'text-foreground-muted hover:bg-surface-muted'
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0 opacity-80" aria-hidden="true" />
                  <span className="flex-1 truncate font-mono text-xs">{file}</span>
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
