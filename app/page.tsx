import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Play,
  Tv,
  BookOpen,
  CheckCircle,
  Brain,
  FileCode,
  Rocket,
  Palette
} from 'lucide-react';

import FlashcardSimulator from '../components/home/FlashcardSimulator';
import MindMapVisualizer from '../components/home/MindMapVisualizer';

const WORKSPACE_FILES = [
  { name: 'pitch-deck.md', tag: 'Pitch template', icon: Rocket },
  { name: 'tech-roadmap.md', tag: 'Code cards', icon: FileCode },
  { name: 'creative-portfolio.md', tag: 'Editorial', icon: Palette },
];

const MINDMAP_FEATURES = [
  'Markdown outline parsing',
  'Collapsible nodes',
  'Colour tags & anchors',
  'Figma & canvas export',
];

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-background text-foreground font-sans flex flex-col">

      {/* Hero Section */}
      <header className="text-center pt-20 pb-14 px-6 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-primary bg-primary-soft px-3 py-1.5 rounded-full border border-primary-border">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          Knowledge Challenger
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-6 leading-[1.1] text-foreground">
          Turn markdown into things you actually remember
        </h1>
        <p className="text-foreground-muted text-lg mt-5 leading-relaxed max-w-xl mx-auto">
          Point it at a folder of notes. Get presentation decks, active-recall
          flashcards, and mind maps — without leaving your editor.
        </p>
      </header>

      {/* Features Showcase Grid */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 pb-20 grid grid-cols-12 gap-6 items-stretch">

        {/* 1. SLIDES PRO CARD (Flagship Feature) */}
        <section className="col-span-12 lg:col-span-6 p-7 bg-surface border border-border rounded-2xl flex flex-col justify-between transition-shadow duration-200 hover:shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center justify-center w-11 h-11 bg-primary-soft rounded-xl border border-primary-border">
                <Tv className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent bg-accent-soft px-2.5 py-1 rounded-md border border-accent-border">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" aria-hidden="true" />
                Live
              </span>
            </div>

            <h2 className="text-xl font-bold text-foreground">Slides</h2>
            <p className="text-foreground-muted text-sm mt-2.5 leading-relaxed">
              Markdown in, slide deck out. Watches your folder in real time, with a
              dual-screen presenter console and four built-in themes.
            </p>

            {/* Workspace files preview */}
            <div className="mt-6 bg-surface-muted border border-border rounded-xl p-3 space-y-2">
              <span className="text-[10px] font-semibold tracking-wide text-foreground-subtle uppercase block px-1 pb-1">
                slides/
              </span>
              {WORKSPACE_FILES.map(({ name, tag, icon: Icon }) => (
                <div
                  key={name}
                  className="flex items-center justify-between gap-2 text-xs px-3 py-2.5 bg-surface border border-border rounded-lg"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <Icon className="w-3.5 h-3.5 text-foreground-subtle shrink-0" aria-hidden="true" />
                    <span className="font-mono text-foreground-muted truncate">{name}</span>
                  </span>
                  <span className="text-[10px] font-semibold text-foreground-subtle shrink-0">
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/slides"
            className="mt-7 flex items-center justify-center gap-2 w-full h-12 bg-primary hover:bg-primary-hover text-on-primary font-semibold rounded-xl transition-colors duration-150 shadow-lg shadow-primary/20 text-sm"
          >
            <Play className="w-4 h-4 fill-current" aria-hidden="true" />
            <span>Open workspace</span>
          </Link>
        </section>

        {/* 2. FLASHCARD STUDIO CARD */}
        <section className="col-span-12 lg:col-span-6 p-7 bg-surface border border-border rounded-2xl flex flex-col justify-between transition-shadow duration-200 hover:shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center justify-center w-11 h-11 bg-primary-soft rounded-xl border border-primary-border">
                <BookOpen className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <span className="text-xs font-semibold text-foreground-subtle bg-surface-muted px-2.5 py-1 rounded-md border border-border">
                Preview
              </span>
            </div>

            <h2 className="text-xl font-bold text-foreground">Flashcards</h2>
            <p className="text-foreground-muted text-sm mt-2.5 leading-relaxed">
              Turn notes into active-recall decks. Try the card below — click it,
              or focus it and press Enter.
            </p>

            <FlashcardSimulator />
          </div>

          <p className="mt-6 text-xs text-foreground-subtle text-center">
            Deck import lands in the workspace next.
          </p>
        </section>

        {/* 3. MIND MAP OUTLINER CARD */}
        <section className="col-span-12 p-7 bg-surface border border-border rounded-2xl flex flex-col lg:flex-row gap-8 justify-between transition-shadow duration-200 hover:shadow-lg">

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-11 h-11 bg-primary-soft rounded-xl border border-primary-border">
                  <Brain className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <span className="text-xs font-semibold text-foreground-subtle bg-surface-muted px-2.5 py-1 rounded-md border border-border">
                  Preview
                </span>
              </div>

              <h2 className="text-xl font-bold text-foreground">Mind maps</h2>
              <p className="text-foreground-muted text-sm mt-2.5 leading-relaxed max-w-md">
                Nested lists become navigable trees, so you can see how ideas connect
                instead of scrolling past them.
              </p>

              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-foreground-muted">
                {MINDMAP_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <MindMapVisualizer />

        </section>

      </main>

    </div>
  );
}
