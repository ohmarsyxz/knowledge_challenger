'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Play,
  Tv,
  ChevronLeft,
  ChevronRight,
  Minimize2,
  Sparkles,
  Sidebar,
  FileQuestionMark
} from 'lucide-react';
import Link from 'next/link';
import { parseMarkdownToSlides } from '../../app/utils/parser';
import { ThemeId, SyncMessage } from '../../app/types';
import { getTheme } from '../../app/utils/themes';

import SlideRenderer from './SlideRenderer';
import DeckSidebar from './DeckSidebar';
import ThemeSelector from './ThemeSelector';
import DeckSelector from './DeckSelector';

interface PresentationWorkspaceProps {
  initialFiles: string[];
  initialActiveFile: string;
  initialMarkdown: string;
}

export default function PresentationWorkspace({
  initialFiles,
  initialActiveFile,
  initialMarkdown
}: PresentationWorkspaceProps) {
  // --- States ---
  const [markdown, setMarkdown] = useState<string>(initialMarkdown);
  const [themeId, setThemeId] = useState<ThemeId>('glass');
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showThemeMenu, setShowThemeMenu] = useState<boolean>(false);
  const [showDeckMenu, setShowDeckMenu] = useState<boolean>(false);

  // Workspace File Sync states
  const [files, setFiles] = useState<string[]>(initialFiles);
  const [activeFile, setActiveFile] = useState<string>(initialActiveFile);
  const [lastMTime, setLastMTime] = useState<number>(0);

  const [showSidebar, setShowSidebar] = useState<boolean>(true);

  // Scaled dimensions state refs
  const containerRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const previewScaleRef = useRef<HTMLDivElement>(null);
  const [scaleFactor, setScaleFactor] = useState<number>(1);

  // Broadcast channel ref
  const syncChannelRef = useRef<BroadcastChannel | null>(null);

  // --- Workspace slides/ File Watcher (Polling) ---
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const url = activeFile ? `/api/slides?file=${activeFile}` : '/api/slides';
        const res = await fetch(url);
        if (!res.ok) throw new Error('API failed');
        const data = await res.json();

        if (data.files) setFiles(data.files);
        if (data.activeFile && !activeFile) {
          setActiveFile(data.activeFile);
        }

        // Trigger updates if file timestamp changed or we switched the active file
        if (data.activeFile !== activeFile || data.mtime !== lastMTime) {
          setMarkdown(data.markdown);
          setLastMTime(data.mtime);

          if (data.activeFile !== activeFile) {
            setActiveFile(data.activeFile);
            setCurrentSlideIndex(0); // Reset index on slide swap
          }
        }
      } catch (err) {
        console.error('Failed to sync slides:', err);
      }
    };

    fetchSlides(); // Initial fetch

    const interval = setInterval(fetchSlides, 1000);
    return () => clearInterval(interval);
  }, [activeFile, lastMTime]);

  // Load configuration from localstorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('presentation_theme');
    if (savedTheme) setThemeId(savedTheme as ThemeId);

    // Setup sync channel
    const channel = new BroadcastChannel('presentation_sync');
    syncChannelRef.current = channel;

    // Handle messages from Presenter View
    channel.onmessage = (event: MessageEvent<SyncMessage>) => {
      const msg = event.data;
      if (msg.type === 'SLIDE_CHANGE') {
        setCurrentSlideIndex(msg.currentSlideIndex);
      } else if (msg.type === 'REQUEST_STATE') {
        channel.postMessage({
          type: 'SYNC_STATE',
          currentSlideIndex: currentSlideIndex,
          markdown: markdown,
          themeId: themeId,
          totalSlides: parseMarkdownToSlides(markdown).length
        });
      }
    };

    return () => {
      channel.close();
    };
  }, [currentSlideIndex, markdown, themeId]);

  // Synchronize state when slide index or theme changes
  useEffect(() => {
    if (syncChannelRef.current) {
      syncChannelRef.current.postMessage({
        type: 'SYNC_STATE',
        currentSlideIndex,
        markdown,
        themeId,
        totalSlides: parseMarkdownToSlides(markdown).length
      });
    }
  }, [currentSlideIndex, markdown, themeId]);

  const handleThemeChange = (id: ThemeId) => {
    setThemeId(id);
    localStorage.setItem('presentation_theme', id);
    setShowThemeMenu(false);
  };

  const handleDeckChange = (filename: string) => {
    setActiveFile(filename);
    setLastMTime(0); // Forces immediate watch fetch
    setShowDeckMenu(false);
  };

  // --- Parser Hook ---
  const slides = useMemo(() => {
    return parseMarkdownToSlides(markdown);
  }, [markdown]);

  const activeSlide = slides[currentSlideIndex] || slides[0] || null;

  // --- Dynamic Slide Aspect Ratio Resizing ---
  useEffect(() => {
    const handleResize = () => {
      const activeContainer = isFullscreen ? fullscreenContainerRef.current : containerRef.current;
      if (!activeContainer) return;
      const containerWidth = activeContainer.clientWidth;
      const containerHeight = activeContainer.clientHeight;

      const baseWidth = 960;
      const baseHeight = 540;

      const widthScale = containerWidth / baseWidth;
      const heightScale = containerHeight / baseHeight;
      const scale = Math.min(widthScale, heightScale);

      setScaleFactor(isFullscreen ? scale : Math.min(scale, 0.95));
    };

    handleResize();

    const observer = new ResizeObserver(handleResize);
    const activeContainer = isFullscreen ? fullscreenContainerRef.current : containerRef.current;
    if (activeContainer) {
      observer.observe(activeContainer);
    }

    return () => observer.disconnect();
  }, [isFullscreen, slides, currentSlideIndex]);

  // --- Navigation Controls ---
  const prevSlide = () => {
    setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1));
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        if (isFullscreen) e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, isFullscreen]);

  // --- Presenter Window Launcher ---
  const launchPresenterWindow = () => {
    const width = 1000;
    const height = 650;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      '/presenter',
      'PresenterWindow',
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );
  };

  const selectedTheme = getTheme(themeId);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans no-print overflow-hidden">

      {/* --- Top Nav / Action Bar --- */}
      <header className="flex items-center justify-between gap-4 px-6 py-3 bg-surface border-b border-border z-40 shrink-0">

        {/* Brand */}
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-1.5 h-11 px-2 -ml-2 rounded-lg text-foreground-subtle hover:text-foreground hover:bg-surface-muted transition-colors cursor-pointer group"
          >
            <ChevronLeft className="w-5 h-5 shrink-0 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
            <span className="text-xs font-semibold">Home</span>
          </Link>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary shrink-0">
              <Sparkles className="w-5 h-5 text-on-primary" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold tracking-tight text-foreground flex items-center gap-1.5">
                Slides
                <span className="text-[10px] bg-primary-soft text-primary font-bold px-2 py-0.5 rounded-full border border-primary-border">
                  PRO
                </span>
              </h1>

              {/* Realtime watch status — icon + text, not colour alone */}
              <p className="flex items-center gap-1.5 text-xs text-accent font-medium mt-0.5 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" aria-hidden="true" />
                <span className="truncate font-mono">slides/{activeFile || 'loading…'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-3">

          {/* Deck Chooser Dropdown */}
          <DeckSelector
            files={files}
            activeFile={activeFile}
            showDeckMenu={showDeckMenu}
            setShowDeckMenu={setShowDeckMenu}
            onDeckChange={handleDeckChange}
          />

          {/* Theme Dropdown */}
          <ThemeSelector
            themeId={themeId}
            onThemeChange={handleThemeChange}
            showThemeMenu={showThemeMenu}
            setShowThemeMenu={setShowThemeMenu}
          />

          <div className="h-6 w-px bg-border" />

          <button
            onClick={launchPresenterWindow}
            className="flex items-center gap-2 h-11 px-3 bg-surface hover:bg-surface-muted border border-border text-foreground-muted rounded-xl text-sm font-semibold transition-colors duration-150 cursor-pointer"
          >
            <Tv className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-xs hidden md:inline">Presenter view</span>
          </button>

          {/* Present Mode Button — the one primary action on this screen */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="flex items-center gap-2 h-11 px-5 bg-primary hover:bg-primary-hover text-on-primary rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 transition-colors duration-150 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" aria-hidden="true" />
            <span>Present</span>
          </button>

        </div>

      </header>

      {/* --- Main Workspace (Split Screen: Sidebar & Preview Sandbox) --- */}
      <main className="flex flex-1 min-h-0 overflow-hidden">

        {/* LEFT PANEL: Slide List Sidebar index */}
        {showSidebar && (
          <DeckSidebar
            slides={slides}
            currentSlideIndex={currentSlideIndex}
            setCurrentSlideIndex={setCurrentSlideIndex}
          />
        )}

        {/* RIGHT PANEL: Live Presentation Preview Workspace */}
        <section className="flex-1 flex flex-col bg-surface-muted overflow-hidden min-h-0 relative">

          {/* Floating Sidebar Toggle button */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            aria-expanded={showSidebar}
            aria-label={showSidebar ? 'Hide slide list' : 'Show slide list'}
            className="absolute left-4 top-4 z-30 flex items-center justify-center w-11 h-11 bg-surface/90 hover:bg-surface border border-border text-foreground-subtle hover:text-foreground rounded-xl shadow-md backdrop-blur-sm transition-colors duration-150 cursor-pointer"
          >
            <Sidebar className="w-4 h-4" aria-hidden="true" />
          </button>

          {/* Preview Canvas Workspace */}
          <div
            ref={containerRef}
            className="flex-1 relative overflow-hidden"
          >
            {activeSlide ? (
              <div
                ref={previewScaleRef}
                style={{
                  width: '960px',
                  height: '540px',
                  transform: `translate(-50%, -50%) scale(${scaleFactor})`,
                  left: '50%',
                  top: '50%',
                  position: 'absolute',
                }}
                className={`slide-canvas flex items-center justify-center shrink-0 rounded-2xl border border-border shadow-2xl ${selectedTheme.className}`}
              >
                {selectedTheme.id === 'cyberpunk' && (
                  <div className="absolute inset-0 cyberpunk-grid pointer-events-none opacity-40" />
                )}
                <div className="w-full h-full relative z-10 flex flex-col items-center justify-center">
                  <SlideRenderer slide={activeSlide} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-surface border border-border mb-4">
                  <FileQuestionMark className="w-6 h-6 text-foreground-subtle" aria-hidden="true" />
                </div>
                <h2 className="text-base font-semibold text-foreground">No slides yet</h2>
                <p className="text-sm text-foreground-muted mt-1.5 max-w-sm leading-relaxed">
                  Drop a markdown file into the{' '}
                  <code className="font-mono text-xs bg-surface border border-border rounded px-1.5 py-0.5 text-primary">
                    slides/
                  </code>{' '}
                  folder and it appears here automatically.
                </p>
              </div>
            )}
          </div>

          {/* Preview Navigation timeline controls */}
          <div className="px-6 py-3 bg-surface border-t border-border flex items-center justify-between shrink-0">

            <button
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
              aria-label="Previous slide"
              className="flex items-center justify-center w-11 h-11 bg-surface hover:bg-surface-muted border border-border rounded-xl text-foreground-muted disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-surface transition-colors duration-150 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>

            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-semibold font-mono text-foreground-muted tabular">
                {currentSlideIndex + 1} / {slides.length}
              </span>
              {/* Each dot keeps a 44px hit area; only the bar inside is 6px tall. */}
              <div className="flex items-center">
                {slides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlideIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    aria-current={currentSlideIndex === idx ? 'true' : undefined}
                    className="group flex items-center justify-center h-11 px-1 cursor-pointer"
                  >
                    <span
                      className={`h-1.5 rounded-full transition-all duration-200 ${
                        currentSlideIndex === idx
                          ? 'w-6 bg-primary'
                          : 'w-1.5 bg-border-strong group-hover:bg-foreground-subtle'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={nextSlide}
              disabled={currentSlideIndex === slides.length - 1}
              aria-label="Next slide"
              className="flex items-center justify-center w-11 h-11 bg-surface hover:bg-surface-muted border border-border rounded-xl text-foreground-muted disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-surface transition-colors duration-150 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>

          </div>

        </section>

      </main>

      {/* --- FULLSCREEN PRESENTATION VIEWER OVERLAY --- */}
      {isFullscreen && activeSlide && (
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center slide-canvas ${selectedTheme.className}`}
          style={{ background: 'var(--slide-bg)' }}
        >
          {selectedTheme.id === 'cyberpunk' && (
            <div className="absolute inset-0 cyberpunk-grid pointer-events-none opacity-40" />
          )}

          <div
            ref={fullscreenContainerRef}
            className="w-full h-full flex items-center justify-center p-12 relative z-10"
          >
            <div
              style={{
                width: '960px',
                height: '540px',
                transform: `scale(${scaleFactor * 1.05})`,
                transformOrigin: 'center center',
              }}
              className="shrink-0 flex items-center justify-center"
            >
              <SlideRenderer slide={activeSlide} />
            </div>
          </div>

          {/* Controls fade in on hover, but focus-within keeps them reachable by keyboard. */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl z-20 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200 shadow-2xl">
            <button
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
              aria-label="Previous slide"
              className="flex items-center justify-center w-11 h-11 hover:bg-white/10 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            <span className="text-sm font-semibold font-mono text-white tabular">
              {currentSlideIndex + 1} / {slides.length}
            </span>
            <button
              onClick={nextSlide}
              disabled={currentSlideIndex === slides.length - 1}
              aria-label="Next slide"
              className="flex items-center justify-center w-11 h-11 hover:bg-white/10 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
            <div className="w-px h-5 bg-white/20" />
            <button
              onClick={() => setIsFullscreen(false)}
              className="flex items-center gap-1.5 h-11 px-3 hover:bg-white/10 text-white rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer"
            >
              <Minimize2 className="w-4 h-4" aria-hidden="true" />
              <span>Exit (Esc)</span>
            </button>
          </div>

        </div>
      )}

      {/* Printable Containers for PDF Generation */}
      <div className="hidden print-container print:block">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`print-slide ${selectedTheme.className}`}
            style={{
              pageBreakAfter: 'always',
              breakAfter: 'page',
            }}
          >
            {selectedTheme.id === 'cyberpunk' && (
              <div className="absolute inset-0 cyberpunk-grid pointer-events-none opacity-20" />
            )}
            <div className="print-slide-content w-full h-full flex flex-col justify-center items-center">
              <SlideRenderer slide={slide} />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
