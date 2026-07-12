'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
import { useStoredTheme, setStoredTheme } from '../../app/utils/useStoredTheme';

import SlideRenderer from './SlideRenderer';
import DeckSidebar from './DeckSidebar';
import ThemeSelector from './ThemeSelector';
import DeckSelector from './DeckSelector';

interface PresentationWorkspaceProps {
  initialFiles: string[];
  initialActiveFile: string;
  initialMarkdown: string;
}

/** The list is sorted server-side, so positional comparison is sufficient. */
function sameFileList(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((name, i) => name === b[i]);
}

export default function PresentationWorkspace({
  initialFiles,
  initialActiveFile,
  initialMarkdown
}: Readonly<PresentationWorkspaceProps>) {
  // --- States ---
  const [markdown, setMarkdown] = useState<string>(initialMarkdown);
  const themeId = useStoredTheme();
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showThemeMenu, setShowThemeMenu] = useState<boolean>(false);
  const [showDeckMenu, setShowDeckMenu] = useState<boolean>(false);

  // Workspace File Sync states
  const [files, setFiles] = useState<string[]>(initialFiles);
  const [activeFile, setActiveFile] = useState<string>(initialActiveFile);

  // Watcher bookkeeping lives in refs, not state: it changes on every poll and
  // must never, by itself, trigger a render.
  const activeFileRef = useRef<string>(initialActiveFile);
  const lastMTimeRef = useRef<number>(0);

  const [showSidebar, setShowSidebar] = useState<boolean>(true);

  // Scaled dimensions state refs
  const containerRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const previewScaleRef = useRef<HTMLDivElement>(null);
  const [scaleFactor, setScaleFactor] = useState<number>(1);

  // Broadcast channel ref
  const syncChannelRef = useRef<BroadcastChannel | null>(null);

  // --- Workspace slides/ File Watcher ---
  // Pull the markdown body for one deck. Called on connect and whenever the
  // server signals that the file (or the active selection) changed.
  const fetchContent = useCallback(async (file: string) => {
    try {
      const res = await fetch(`/api/slides?file=${encodeURIComponent(file)}`);
      if (!res.ok) throw new Error('Slide content request failed');
      const data = await res.json();

      lastMTimeRef.current = data.mtime;
      setMarkdown(data.markdown);

      if (data.activeFile !== activeFileRef.current) {
        activeFileRef.current = data.activeFile;
        setActiveFile(data.activeFile);
        setCurrentSlideIndex(0); // Reset index on deck swap
      }
    } catch (err) {
      console.error('Failed to load slide content:', err);
    }
  }, []);

  // Subscribe to server-pushed change events (SSE). The server watches the
  // slides/ folder with fs.watch and only sends when something actually
  // changes, so an idle deck costs zero network traffic. EventSource also
  // reconnects on its own if the connection drops.
  useEffect(() => {
    const url = `/api/slides/stream?file=${encodeURIComponent(activeFile)}`;
    const source = new EventSource(url);

    source.addEventListener('slides', (event) => {
      try {
        const snap = JSON.parse((event as MessageEvent).data) as {
          files: string[];
          activeFile: string;
          mtime: number;
        };

        setFiles((prev) => (sameFileList(prev, snap.files) ? prev : snap.files));

        const fileChanged = snap.activeFile !== activeFileRef.current;
        const contentChanged = snap.mtime !== lastMTimeRef.current;
        if (fileChanged || contentChanged) {
          fetchContent(snap.activeFile);
        }
      } catch (err) {
        console.error('Malformed slides event:', err);
      }
    });

    return () => source.close();
  }, [activeFile, fetchContent]);

  // Latest state for the channel handler to read, so answering REQUEST_STATE
  // never requires rebuilding the channel itself.
  const stateRef = useRef({ currentSlideIndex, markdown, themeId });
  useEffect(() => {
    stateRef.current = { currentSlideIndex, markdown, themeId };
  }, [currentSlideIndex, markdown, themeId]);

  // The channel is a connection, not derived state: open it once per mount.
  // Keying it on slide/markdown/theme tore it down on every arrow-key press.
  useEffect(() => {
    const channel = new BroadcastChannel('presentation_sync');
    syncChannelRef.current = channel;

    channel.onmessage = (event: MessageEvent<SyncMessage>) => {
      const msg = event.data;
      if (msg.type === 'SLIDE_CHANGE') {
        setCurrentSlideIndex(msg.currentSlideIndex);
      } else if (msg.type === 'REQUEST_STATE') {
        const { currentSlideIndex: idx, markdown: md, themeId: theme } = stateRef.current;
        channel.postMessage({
          type: 'SYNC_STATE',
          currentSlideIndex: idx,
          markdown: md,
          themeId: theme,
          totalSlides: parseMarkdownToSlides(md).length
        });
      }
    };

    return () => {
      channel.close();
      syncChannelRef.current = null;
    };
  }, []);

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
    setStoredTheme(id); // Writes through to localStorage; the store re-renders us
    setShowThemeMenu(false);
  };

  const handleDeckChange = (filename: string) => {
    activeFileRef.current = filename;
    lastMTimeRef.current = 0; // Force a content pull once the stream reconnects
    setActiveFile(filename); // Reopens the SSE connection for the new file
    setCurrentSlideIndex(0);
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
  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1));
  }, [slides.length]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Spacebar is ' ' in KeyboardEvent.key — 'Space' is its .code and never matches.
      if (e.key === 'ArrowRight' || e.key === ' ') {
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
  }, [isFullscreen, nextSlide, prevSlide]);

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
        {slides.map((slide) => (
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
