'use client';

import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Slide } from '../../app/types';

interface DeckSidebarProps {
  slides: Slide[];
  currentSlideIndex: number;
  setCurrentSlideIndex: (idx: number) => void;
}

export default function DeckSidebar({ slides, currentSlideIndex, setCurrentSlideIndex }: DeckSidebarProps) {
  return (
    <section className="w-80 flex flex-col border-r border-slate-200 bg-white overflow-hidden shrink-0 min-h-0">
      <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-purple-600" />
          <span>Slides Deck</span>
        </span>
        <span className="text-xs font-semibold font-mono text-slate-400">
          {slides.length} Items
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {slides.map((slide, idx) => {
          const mainHeading = slide.elements.find(el => el.type.startsWith('h'))?.content || `Slide ${slide.id}`;
          const isActive = currentSlideIndex === idx;
          return (
            <button
              key={slide.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`w-full text-left p-4 rounded-xl border transition-all relative overflow-hidden flex items-start gap-3 group cursor-pointer ${isActive
                  ? 'bg-purple-50 border-purple-400 shadow-sm shadow-purple-100'
                  : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100 hover:border-slate-350'
                }`}
            >
              <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md shrink-0 ${isActive ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                {slide.id}
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-800 truncate group-hover:text-purple-600 transition-colors">
                  {mainHeading}
                </h4>
                <span className="text-[10px] text-slate-450 uppercase tracking-wider font-semibold font-mono mt-1 block">
                  Layout: {slide.layout}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
