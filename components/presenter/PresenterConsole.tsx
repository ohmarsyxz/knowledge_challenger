'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  RotateCcw,
  Tv,
  ImageOff,
  Pause,
  Play
} from 'lucide-react';
import { parseMarkdownToSlides } from '../../app/utils/parser';
import { Slide, ThemeId, SyncMessage } from '../../app/types';
import { getTheme } from '../../app/utils/themes';
import { parseInlineMarkdown } from './SlideRenderer';

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
  // Moving to an index also has to tell the main window about it, so the two
  // always travel together.
  const goToSlide = useCallback((index: number) => {
    setCurrentSlideIndex(index);
    syncChannelRef.current?.postMessage({
      type: 'SLIDE_CHANGE',
      currentSlideIndex: index,
    });
  }, []);

  const prevSlide = useCallback(() => {
    goToSlide(Math.max(0, currentSlideIndex - 1));
  }, [currentSlideIndex, goToSlide]);

  const nextSlideAction = useCallback(() => {
    goToSlide(Math.min(slides.length - 1, currentSlideIndex + 1));
  }, [currentSlideIndex, slides.length, goToSlide]);

  // Listen to keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Spacebar is ' ' in KeyboardEvent.key — 'Space' is its .code and never matches.
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlideAction();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlideAction, prevSlide]);

  // --- Slide Render Utilities ---
  const renderSlideElements = (elements: Slide['elements']) => {
    return elements.map((el, i) => {
      switch (el.type) {
        case 'h1':
          return <h1 key={i} className="text-2xl font-black mb-2 leading-tight">{parseInlineMarkdown(el.content)}</h1>;
        case 'h2':
          return <h2 key={i} className="text-xl font-bold mb-2 opacity-95">{parseInlineMarkdown(el.content)}</h2>;
        case 'h3':
          return <h3 key={i} className="text-lg font-bold mb-1 opacity-90">{parseInlineMarkdown(el.content)}</h3>;
        case 'ul':
          return (
            <ul key={i} className="space-y-1 text-xs list-none pl-0 mb-2">
              {el.items?.map((item, idx) => {
                const leadingSpaces = item.match(/^(\s*)/)?.[1].length || 0;
                const cleanItem = item.trim();
                return (
                  <li
                    key={idx}
                    className="flex items-start gap-2 select-text"
                    style={{ paddingLeft: `${leadingSpaces * 8}px` }}
                  >
                    <span className="mt-1.5 w-1 h-1 rounded-full shrink-0 bg-slate-500" />
                    <span>{parseInlineMarkdown(cleanItem)}</span>
                  </li>
                );
              })}
            </ul>
          );
        case 'ol':
          return (
            <ol key={i} className="space-y-1 text-xs list-none pl-0 mb-2">
              {el.items?.map((item, idx) => {
                const leadingSpaces = item.match(/^(\s*)/)?.[1].length || 0;
                const cleanItem = item.trim();
                return (
                  <li
                    key={idx}
                    className="flex items-start gap-2 select-text"
                    style={{ paddingLeft: `${leadingSpaces * 8}px` }}
                  >
                    <span className="font-bold shrink-0 text-slate-500 font-mono">
                      {idx + 1}.
                    </span>
                    <span>{parseInlineMarkdown(cleanItem)}</span>
                  </li>
                );
              })}
            </ol>
          );
        case 'code':
          return (
            <pre key={i} className="bg-black/35 border border-white/10 p-3 rounded-lg overflow-x-auto text-[9px] font-mono leading-normal text-left max-w-full my-2">
              <code>{el.content}</code>
            </pre>
          );
        case 'image':
          return (
            <div
              key={i}
              className="flex items-center gap-2 bg-black/5 border border-current/10 rounded-lg px-3 py-2 text-[10px] opacity-70"
            >
              <ImageOff className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{el.alt || 'Image'}</span>
            </div>
          );
        case 'blockquote':
          return (
            <blockquote key={i} className="pl-3 border-l-2 border-purple-500 italic text-xs my-2">
              “{parseInlineMarkdown(el.content)}”
            </blockquote>
          );
        case 'paragraph':
        default:
          return <p key={i} className="text-xs opacity-75 mb-2">{parseInlineMarkdown(el.content)}</p>;
      }
    });
  };

  const selectedTheme = getTheme(themeId);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans overflow-hidden">

      {/* Top Banner Dashboard */}
      <header className="flex items-center justify-between gap-4 px-6 py-3 bg-surface border-b border-border z-10 shrink-0">
        <div className="flex items-center gap-3">
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${isConnected ? 'bg-accent animate-pulse' : 'bg-destructive'}`}
            aria-hidden="true"
          />
          <div>
            <h1 className="text-sm font-bold tracking-tight text-foreground">
              Presenter console
            </h1>
            {/* Connection state is announced, not just colour-coded */}
            <p
              className={`text-xs font-medium ${isConnected ? 'text-accent' : 'text-destructive'}`}
              role="status"
            >
              {isConnected ? 'Connected' : 'Waiting for presentation…'}
            </p>
          </div>
        </div>

        {/* Dynamic Slide Counter */}
        <div className="text-sm font-semibold font-mono bg-surface-muted border border-border px-3.5 py-2 rounded-xl text-foreground-muted tabular">
          {currentSlideIndex + 1} / {slides.length || 1}
        </div>

        {/* Running Timer */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 h-11 px-3.5 bg-surface-muted border border-border rounded-xl text-sm font-semibold font-mono text-foreground tabular">
            <Clock className="w-4 h-4 text-foreground-subtle" aria-hidden="true" />
            <span aria-label={`Elapsed time ${formatTime(timeElapsed)}`}>{formatTime(timeElapsed)}</span>
          </div>
          <button
            onClick={() => setIsTimerRunning((r) => !r)}
            aria-label={isTimerRunning ? 'Pause timer' : 'Resume timer'}
            className="flex items-center justify-center w-11 h-11 bg-surface hover:bg-surface-muted border border-border rounded-xl text-foreground-subtle hover:text-foreground transition-colors duration-150 cursor-pointer"
          >
            {isTimerRunning ? <Pause className="w-4 h-4" aria-hidden="true" /> : <Play className="w-4 h-4" aria-hidden="true" />}
          </button>
          <button
            onClick={() => setTimeElapsed(0)}
            aria-label="Reset timer"
            className="flex items-center justify-center w-11 h-11 bg-surface hover:bg-surface-muted border border-border rounded-xl text-foreground-subtle hover:text-foreground transition-colors duration-150 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

      </header>

      {/* Main Split Console Grid */}
      <main className="flex-1 grid grid-cols-12 gap-6 p-6 overflow-hidden min-h-0">
        
        {/* LEFT COLUMN (Slide Previews) */}
        <section className="col-span-8 flex flex-col gap-6 overflow-hidden min-h-0">
          
          {/* Active Preview */}
          <div className="flex-1 flex flex-col bg-surface border border-border rounded-2xl p-4 overflow-hidden min-h-0 relative shadow-sm">
            <span className="text-xs font-bold tracking-wider uppercase text-primary flex items-center gap-2 mb-2 shrink-0">
              <Tv className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Current slide</span>
            </span>
            
            <div className="flex-1 relative bg-surface-muted border border-border rounded-xl overflow-hidden">
              {activeSlide ? (
                <div
                  style={{
                    width: '960px',
                    height: '540px',
                    transform: 'translate(-50%, -50%) scale(0.6)',
                    left: '50%',
                    top: '50%',
                  }}
                  className={`absolute shrink-0 border border-slate-200/60 shadow-2xl rounded-2xl ${selectedTheme.className}`}
                >
                  {selectedTheme.id === 'cyberpunk' && (
                    <div className="absolute inset-0 cyberpunk-grid pointer-events-none opacity-40" />
                  )}
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 select-none text-left">
                    {renderSlideElements(activeSlide.elements)}
                  </div>
                </div>
              ) : (
                <div className="text-slate-400 text-xs flex items-center justify-center h-full">
                  No active slide content found.
                </div>
              )}
            </div>
          </div>

          {/* Up Next Preview */}
          <div className="h-56 flex flex-col bg-surface border border-border rounded-2xl p-4 overflow-hidden shrink-0 relative shadow-sm">
            <span className="text-xs font-bold tracking-wider uppercase text-foreground-subtle flex items-center gap-2 mb-2">
              <span>Up next</span>
            </span>
            
            <div className="flex-1 relative bg-surface-muted border border-border rounded-xl overflow-hidden">
              {nextSlide ? (
                <div
                  style={{
                    width: '960px',
                    height: '540px',
                    transform: 'translate(-50%, -50%) scale(0.3)',
                    left: '50%',
                    top: '50%',
                  }}
                  className={`absolute shrink-0 border border-border opacity-75 rounded-2xl ${selectedTheme.className}`}
                >
                  {selectedTheme.id === 'cyberpunk' && (
                    <div className="absolute inset-0 cyberpunk-grid pointer-events-none opacity-40" />
                  )}
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 select-none text-left">
                    {renderSlideElements(nextSlide.elements)}
                  </div>
                </div>
              ) : (
                <div className="text-foreground-subtle text-xs flex items-center justify-center h-full select-none">
                  End of presentation
                </div>
              )}
            </div>
          </div>

        </section>

        {/* RIGHT COLUMN (Presenter Notes & Controls) */}
        <section className="col-span-4 flex flex-col gap-6 overflow-hidden min-h-0">

          {/* Notes Container */}
          <div className="flex-1 flex flex-col bg-surface border border-border rounded-2xl p-5 overflow-hidden min-h-0 shadow-sm">
            <span className="text-xs font-bold tracking-wider uppercase text-foreground-subtle flex items-center gap-2 mb-3 shrink-0">
              <span>Speaker notes</span>
            </span>
            {/* Notes are the one thing the presenter reads at a glance — give them real size. */}
            <div className="flex-1 bg-surface-muted border border-border rounded-xl p-5 overflow-y-auto leading-relaxed text-base select-text text-foreground">
              {activeSlide?.notes ? (
                <p className="whitespace-pre-line">{activeSlide.notes}</p>
              ) : (
                <span className="italic text-foreground-subtle text-sm">No notes for this slide.</span>
              )}
            </div>
          </div>

          {/* Quick Click navigation bar */}
          <div className="bg-surface border border-border rounded-2xl p-4 shrink-0 flex items-center justify-between gap-3 shadow-sm">
            <button
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
              className="flex items-center justify-center gap-1 h-12 px-5 bg-surface-muted hover:bg-border border border-border disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-surface-muted text-foreground-muted rounded-xl text-sm font-semibold transition-colors duration-150 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              <span>Back</span>
            </button>

            <button
              onClick={nextSlideAction}
              disabled={currentSlideIndex === slides.length - 1}
              className="flex-1 flex items-center justify-center gap-1 h-12 px-6 bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary text-on-primary rounded-xl text-sm font-semibold transition-colors duration-150 cursor-pointer shadow-lg shadow-primary/20"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

        </section>

      </main>

    </div>
  );
}
