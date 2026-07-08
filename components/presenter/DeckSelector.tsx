'use client';

import React from 'react';
import { ChevronDown, FolderOpen, FileText } from 'lucide-react';

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
}: DeckSelectorProps) {
  if (files.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDeckMenu(!showDeckMenu)}
        className="flex items-center gap-2 px-4 py-2 bg-purple-950/20 hover:bg-purple-950/40 border border-purple-500/30 rounded-xl text-sm font-semibold text-purple-200 transition-all duration-200"
      >
        <FolderOpen className="w-4 h-4 text-purple-400" />
        <span>{activeFile || 'Select Deck'}</span>
        <ChevronDown className="w-4 h-4 opacity-60" />
      </button>
      {showDeckMenu && (
        <div className="absolute right-0 mt-2 w-64 bg-[#141419] border border-[#2e2e38] rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="p-2 border-b border-[#2e2e38]">
            <span className="text-xs font-semibold text-zinc-500 px-3 uppercase tracking-wider">Select Deck File</span>
          </div>
          <div className="p-1.5 space-y-1">
            {files.map((file) => (
              <button
                key={file}
                onClick={() => onDeckChange(file)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition-all ${
                  activeFile === file
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'hover:bg-[#1f1f27] text-zinc-300'
                }`}
              >
                <FileText className="w-4 h-4 shrink-0 opacity-70" />
                <span className="truncate">{file}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
