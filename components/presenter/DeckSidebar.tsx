'use client';

import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Slide } from '../../app/types';

interface DeckSidebarProps {
  slides: Slide[];
  currentSlideIndex: number;
  setCurrentSlideIndex: (idx: number) => void;
}

export default function DeckSidebar({
  slides,
  currentSlideIndex,
  setCurrentSlideIndex
}: Readonly<DeckSidebarProps>) {
  return (
    <nav
      aria-label="Slide deck"
      className="w-80 flex flex-col border-r border-border bg-surface overflow-hidden shrink-0 min-h-0"
    >
      <div className="px-5 py-4 border-b border-border flex items-center justify-between shrink-0">
        <span className="text-xs font-semibold tracking-wider text-foreground-subtle uppercase flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-primary" aria-hidden="true" />
          <span>Slides</span>
        </span>
        <span className="text-xs font-semibold font-mono text-foreground-subtle tabular">
          {slides.length}
        </span>
      </div>

      <ol className="flex-1 overflow-y-auto p-3 space-y-2">
        {slides.map((slide, idx) => {
          const mainHeading =
            slide.elements.find((el) => el.type.startsWith('h'))?.content ||
            `Slide ${slide.id}`;
          const isActive = currentSlideIndex === idx;
          return (
            <li key={slide.id}>
              <button
                onClick={() => setCurrentSlideIndex(idx)}
                aria-current={isActive ? 'true' : undefined}
                className={`w-full text-left p-3.5 rounded-xl border transition-colors duration-150 flex items-start gap-3 group cursor-pointer ${
                  isActive
                    ? 'bg-primary-soft border-primary'
                    : 'bg-surface border-border hover:bg-surface-muted hover:border-border-strong'
                }`}
              >
                <span
                  className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md shrink-0 tabular ${
                    isActive
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-muted text-foreground-subtle'
                  }`}
                >
                  {slide.id}
                </span>
                <span className="flex-1 min-w-0">
                  <span
                    className={`block text-sm font-semibold truncate transition-colors ${
                      isActive ? 'text-primary' : 'text-foreground group-hover:text-primary'
                    }`}
                  >
                    {mainHeading}
                  </span>
                  <span className="text-[10px] text-foreground-subtle uppercase tracking-wider font-semibold font-mono mt-1 block">
                    {slide.layout}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
