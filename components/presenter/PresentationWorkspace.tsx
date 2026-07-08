'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Play,
  Tv,
  ChevronLeft,
  ChevronRight,
  Minimize2,
  Sparkles,
  Sidebar
} from 'lucide-react';
import Link from 'next/link';
import { parseMarkdownToSlides } from '../../app/utils/parser';
import { Slide, ThemeId, Theme, SyncMessage } from '../../app/types';

import SlideRenderer from './SlideRenderer';
import DeckSidebar from './DeckSidebar';
import ThemeSelector from './ThemeSelector';
import DeckSelector from './DeckSelector';

const THEMES: Theme[] = [
  { id: 'glass', name: '🔮 Dark Glassmorphism', className: 'theme-glass' },
  { id: 'editorial', name: '🎨 Editorial Light', className: 'theme-editorial' },
  { id: 'cyberpunk', name: '⚡ Cyberpunk Accent', className: 'theme-cyberpunk' },
  { id: 'monotone', name: '🔳 Minimalist Monotone', className: 'theme-monotone' },
];

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

  const selectedTheme = THEMES.find((t) => t.id === themeId) || THEMES[0];

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] text-slate-800 font-sans no-print overflow-hidden">

      {/* --- Top Nav / Action Bar --- */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 z-40 shrink-0">

        {/* Brand */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer group"
            title="Back to Home Hub"
          >
            <ChevronLeft className="w-5 h-5 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-xs font-semibold">Home</span>
          </Link>
          <div className="h-6 w-[1px] bg-slate-200" />
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-[0_4px_15px_rgba(124,58,237,0.2)]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                Slides <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full border border-purple-200">PRO</span>
              </h1>

              {/* Realtime Watch Sync Status Badge */}
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium select-none mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Syncing: slides/{activeFile || 'loading...'}</span>
              </div>
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

          <div className="h-6 w-[1px] bg-slate-200" />

          <button
            onClick={launchPresenterWindow}
            className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition cursor-pointer"
          >
            <Tv className="w-4 h-4 text-purple-600" />
            <span className="text-xs hidden md:inline">Presenter View</span>
          </button>

          {/* Present Mode Button */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-purple-600/15 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
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
        <section className="flex-1 flex flex-col bg-[#f1f5f9] overflow-hidden min-h-0 relative">

          {/* Floating Sidebar Toggle button */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="absolute left-4 top-4 z-30 p-2.5 bg-white/90 hover:bg-white border border-slate-200 text-slate-500 hover:text-slate-800 rounded-xl shadow-md transition cursor-pointer"
            title="Toggle Sidebar"
          >
            <Sidebar className="w-4 h-4" />
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
                className={`slide-canvas flex items-center justify-center shrink-0 rounded-2xl border border-slate-200/60 shadow-2xl ${selectedTheme.className}`}
              >
                {selectedTheme.id === 'cyberpunk' && (
                  <div className="absolute inset-0 cyberpunk-grid pointer-events-none opacity-40" />
                )}
                <div className="w-full h-full relative z-10 flex flex-col items-center justify-center">
                  <SlideRenderer slide={activeSlide} />
                </div>
              </div>
            ) : (
              <div className="text-zinc-500 text-sm flex items-center justify-center h-full">
                No slides to display. Add markdown files inside your local **slides/** folder.
              </div>
            )}
          </div>

          {/* Preview Navigation timeline controls */}
          <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">

            <button
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
              className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center gap-1.5">
              <span className="text-sm font-bold tracking-wider font-mono text-slate-800">
                Slide {currentSlideIndex + 1} / {slides.length}
              </span>
              <div className="flex gap-1">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${currentSlideIndex === idx ? 'w-6 bg-purple-600' : 'w-1.5 bg-slate-200 hover:bg-slate-400'
                      }`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={nextSlide}
              disabled={currentSlideIndex === slides.length - 1}
              className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
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

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl z-20 opacity-0 hover:opacity-100 transition-opacity duration-300 shadow-2xl">
            <button
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
              className="p-2 hover:bg-white/10 text-white rounded-lg disabled:opacity-40"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold font-mono text-zinc-200">
              {currentSlideIndex + 1} / {slides.length}
            </span>
            <button
              onClick={nextSlide}
              disabled={currentSlideIndex === slides.length - 1}
              className="p-2 hover:bg-white/10 text-white rounded-lg disabled:opacity-40"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="w-[1px] h-4 bg-white/20 mx-1" />
            <button
              onClick={() => setIsFullscreen(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition"
            >
              <Minimize2 className="w-4 h-4" />
              <span>Exit Play</span>
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
