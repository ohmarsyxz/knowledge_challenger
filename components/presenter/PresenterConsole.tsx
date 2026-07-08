'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  RotateCcw,
  Tv,
  HelpCircle
} from 'lucide-react';
import { parseMarkdownToSlides } from '../../app/utils/parser';
import { Slide, ThemeId, Theme, SyncMessage } from '../../app/types';

const THEMES: Theme[] = [
  { id: 'glass', name: '🔮 Dark Glassmorphism', className: 'theme-glass' },
  { id: 'editorial', name: '🎨 Editorial Light', className: 'theme-editorial' },
  { id: 'cyberpunk', name: '⚡ Cyberpunk Accent', className: 'theme-cyberpunk' },
  { id: 'monotone', name: '🔳 Minimalist Monotone', className: 'theme-monotone' },
];

export default function PresenterConsole() {
  // --- States ---
  const [markdown, setMarkdown] = useState<string>('');
  const [themeId, setThemeId] = useState<ThemeId>('glass');
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Stopwatch timer state
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  const syncChannelRef = useRef<BroadcastChannel | null>(null);

  // --- Keyboard & Timer Control ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Broadcast Channel Sync ---
  useEffect(() => {
    document.title = "Presenter Console - Slides PRO";

    const channel = new BroadcastChannel('presentation_sync');
    syncChannelRef.current = channel;

    // 1. Request current state from the main page on mount
    channel.postMessage({ type: 'REQUEST_STATE', currentSlideIndex: 0 });

    // 2. Listen to state synchronization messages
    channel.onmessage = (event: MessageEvent<SyncMessage>) => {
      const msg = event.data;
      if (msg.type === 'SYNC_STATE') {
        setIsConnected(true);
        if (msg.markdown !== undefined) setMarkdown(msg.markdown);
        if (msg.themeId !== undefined) setThemeId(msg.themeId);
        if (msg.currentSlideIndex !== undefined) setCurrentSlideIndex(msg.currentSlideIndex);
      } else if (msg.type === 'SLIDE_CHANGE') {
        setCurrentSlideIndex(msg.currentSlideIndex);
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  const slides = useMemo(() => {
    return parseMarkdownToSlides(markdown);
  }, [markdown]);

  const activeSlide = slides[currentSlideIndex] || null;
  const nextSlide = slides[currentSlideIndex + 1] || null;

  // --- Navigation Action Controllers ---
  const prevSlide = () => {
    const prevIdx = Math.max(0, currentSlideIndex - 1);
    setCurrentSlideIndex(prevIdx);
    syncChannelRef.current?.postMessage({
      type: 'SLIDE_CHANGE',
      currentSlideIndex: prevIdx,
    });
  };

  const nextSlideAction = () => {
    const nextIdx = Math.min(slides.length - 1, currentSlideIndex + 1);
    setCurrentSlideIndex(nextIdx);
    syncChannelRef.current?.postMessage({
      type: 'SLIDE_CHANGE',
      currentSlideIndex: nextIdx,
    });
  };

  // Listen to keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        nextSlideAction();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, currentSlideIndex]);

  // --- Slide Render Utilities ---
  const renderSlideElements = (elements: Slide['elements']) => {
    return elements.map((el, i) => {
      switch (el.type) {
        case 'h1':
          return <h1 key={i} className="text-2xl font-black mb-2 leading-tight">{el.content}</h1>;
        case 'h2':
          return <h2 key={i} className="text-xl font-bold mb-2 opacity-95">{el.content}</h2>;
        case 'h3':
          return <h3 key={i} className="text-lg font-bold mb-1 opacity-90">{el.content}</h3>;
        case 'ul':
          return (
            <ul key={i} className="space-y-1 text-xs list-disc pl-4 mb-2">
              {el.items?.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          );
        case 'ol':
          return (
            <ol key={i} className="space-y-1 text-xs list-decimal pl-4 mb-2">
              {el.items?.map((item, idx) => <li key={idx}>{item}</li>)}
            </ol>
          );
        case 'code':
          return (
            <pre key={i} className="bg-black/30 border border-white/10 p-3 rounded-lg overflow-x-auto text-[9px] font-mono leading-normal text-left max-w-full my-2">
              <code>{el.content}</code>
            </pre>
          );
        case 'image':
          return (
            <div key={i} className="bg-black/20 border border-white/5 rounded-lg p-2 text-center text-[10px] text-zinc-400">
              🖼️ Image: {el.alt || 'No details'}
            </div>
          );
        case 'blockquote':
          return (
            <blockquote key={i} className="pl-3 border-l-2 border-purple-500 italic text-xs my-2">
              “{el.content}”
            </blockquote>
          );
        case 'paragraph':
        default:
          return <p key={i} className="text-xs opacity-75 mb-2">{el.content}</p>;
      }
    });
  };

  const selectedTheme = THEMES.find((t) => t.id === themeId) || THEMES[0];

  return (
    <div className="flex flex-col h-screen bg-[#07070a] text-zinc-200 font-sans overflow-hidden">

      {/* Top Banner Dashboard */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#0d0d12] border-b border-[#212128] z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              Presenter Console
              <span className="text-[10px] font-mono text-zinc-500">v1.0</span>
            </h1>
            <p className="text-[10px] text-zinc-400">
              {isConnected ? 'Connected to presentation page' : 'Waiting for connection...'}
            </p>
          </div>
        </div>

        {/* Dynamic Slide Counter */}
        <div className="text-sm font-semibold tracking-wider font-mono bg-zinc-800/40 border border-zinc-700/30 px-3 py-1 rounded-lg">
          Slide {currentSlideIndex + 1} of {slides.length || 1}
        </div>

        {/* Running Timer */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-mono text-emerald-400">
            <Clock className="w-4 h-4 opacity-75" />
            <span>{formatTime(timeElapsed)}</span>
          </div>
          <button
            onClick={() => setTimeElapsed(0)}
            className="p-1 hover:bg-zinc-850 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* Main Split Console Grid */}
      <main className="flex-1 grid grid-cols-12 gap-6 p-6 overflow-hidden min-h-0">

        {/* LEFT COLUMN (Slide Previews) */}
        <section className="col-span-8 flex flex-col gap-6 overflow-hidden min-h-0">

          {/* Active Preview */}
          <div className="flex-1 flex flex-col bg-[#0f0f15] border border-[#212128] rounded-xl p-4 overflow-hidden min-h-0 relative">
            <span className="text-xs font-semibold tracking-wider uppercase text-purple-400 flex items-center gap-2 mb-2 shrink-0">
              <Tv className="w-3.5 h-3.5" />
              <span>Current Slide Screen</span>
            </span>

            <div className="flex-1 relative bg-black/40 border border-white/5 rounded-lg overflow-hidden">
              {activeSlide ? (
                <div
                  style={{
                    width: '960px',
                    height: '540px',
                    transform: 'translate(-50%, -50%) scale(0.6)',
                    left: '50%',
                    top: '50%',
                  }}
                  className={`absolute shrink-0 border border-white/5 shadow-2xl rounded-2xl ${selectedTheme.className}`}
                >
                  {selectedTheme.id === 'cyberpunk' && (
                    <div className="absolute inset-0 cyberpunk-grid pointer-events-none opacity-40" />
                  )}
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 select-none text-left">
                    {renderSlideElements(activeSlide.elements)}
                  </div>
                </div>
              ) : (
                <div className="text-zinc-500 text-xs flex items-center justify-center h-full">
                  No active slide content found.
                </div>
              )}
            </div>
          </div>

          {/* Up Next Preview */}
          <div className="h-56 flex flex-col bg-[#0f0f15] border border-[#212128] rounded-xl p-4 overflow-hidden shrink-0 relative">
            <span className="text-xs font-semibold tracking-wider uppercase text-zinc-400 flex items-center gap-2 mb-2">
              <span>Up Next</span>
            </span>

            <div className="flex-1 relative bg-black/40 border border-white/5 rounded-lg overflow-hidden">
              {nextSlide ? (
                <div
                  style={{
                    width: '960px',
                    height: '540px',
                    transform: 'translate(-50%, -50%) scale(0.3)',
                    left: '50%',
                    top: '50%',
                  }}
                  className={`absolute shrink-0 border border-white/5 opacity-70 rounded-2xl ${selectedTheme.className}`}
                >
                  {selectedTheme.id === 'cyberpunk' && (
                    <div className="absolute inset-0 cyberpunk-grid pointer-events-none opacity-40" />
                  )}
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 select-none text-left">
                    {renderSlideElements(nextSlide.elements)}
                  </div>
                </div>
              ) : (
                <div className="text-zinc-500 text-xs flex items-center justify-center h-full select-none">
                  End of Presentation
                </div>
              )}
            </div>
          </div>

        </section>

        {/* RIGHT COLUMN (Presenter Notes & Controls) */}
        <section className="col-span-4 flex flex-col gap-6 overflow-hidden min-h-0">

          {/* Notes Container */}
          <div className="flex-1 flex flex-col bg-[#0f0f15] border border-[#212128] rounded-xl p-5 overflow-hidden min-h-0">
            <span className="text-xs font-semibold tracking-wider uppercase text-zinc-400 flex items-center gap-2 mb-3 shrink-0">
              <span>Speaker Notes</span>
            </span>
            <div className="flex-1 bg-black/20 border border-white/5 rounded-lg p-5 overflow-y-auto font-sans leading-relaxed text-sm select-text text-zinc-300">
              {activeSlide?.notes ? (
                <p className="whitespace-pre-line">{activeSlide.notes}</p>
              ) : (
                <span className="italic text-zinc-500 text-xs">No speaker notes provided for this slide.</span>
              )}
            </div>
          </div>

          {/* Quick Click navigation bar */}
          <div className="bg-[#0f0f15] border border-[#212128] rounded-xl p-4 shrink-0 flex items-center justify-between">
            <button
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
              className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={nextSlideAction}
              disabled={currentSlideIndex === slides.length - 1}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:hover:bg-purple-600 text-white rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer flex items-center gap-1 shadow-lg shadow-purple-950/20"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </section>

      </main>

    </div>
  );
}
export { THEMES };
