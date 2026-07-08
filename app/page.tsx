import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Play,
  Tv,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Brain
} from 'lucide-react';

import FlashcardSimulator from '../components/home/FlashcardSimulator';
import MindMapVisualizer from '../components/home/MindMapVisualizer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans relative overflow-hidden flex flex-col">
      
      {/* Decorative Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="w-full px-8 py-5 flex items-center justify-between border-b border-zinc-900 bg-black/20 backdrop-blur-md relative z-30">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-[0_0_25px_rgba(147,51,234,0.3)]">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              Knowledge Challenger
              <span className="text-[9px] bg-purple-500/15 text-purple-300 font-semibold px-2 py-0.5 rounded-full border border-purple-500/20">Portal</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Local Node Engine Online</span>
          </div>
          <Link
            href="/slides"
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-600/10 transition-all cursor-pointer"
          >
            <span>Launch Slides</span>
            <ChevronRight className="w-4.5 h-4.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center pt-20 pb-16 px-6 max-w-4xl mx-auto relative z-20 flex-shrink-0">
        <span className="text-xs font-bold tracking-widest text-purple-400 uppercase bg-purple-500/10 px-3.5 py-1.5 rounded-full border border-purple-500/20">
          Knowledge Challenger Suite
        </span>
        <h2 className="text-5xl md:text-6xl font-black tracking-tight mt-6 leading-tight select-none">
          Supercharge Your{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-500">
            Markdown Workflow
          </span>
        </h2>
        <p className="text-zinc-400 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed select-text">
          A premium suite of tools to convert local folders, documents, and outline lists into presentation slides, study flashcards, and mind maps instantly.
        </p>
      </section>

      {/* Features Showcase Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-8 pb-20 relative z-20 grid grid-cols-12 gap-8 items-stretch">
        
        {/* 1. SLIDES PRO CARD (Flagship Feature) */}
        <section className="col-span-12 lg:col-span-6 p-8 bg-[#111116] border border-zinc-800/80 rounded-3xl flex flex-col justify-between hover:border-purple-500/30 transition-all group duration-300 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-2xl group-hover:bg-purple-600/10 transition-colors pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                <Tv className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-xs font-bold tracking-wider text-emerald-400 uppercase bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active Workspace</span>
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-white group-hover:text-purple-300 transition-colors">
              Slides PRO
            </h3>
            <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
              Instantly turn markdown presentations into beautiful slide decks. Features a real-time workspace watcher, dual-screen presenter view console, and gorgeous glassmorphic themes.
            </p>

            {/* Simulated Workspace Files Mini Panel */}
            <div className="mt-6 bg-[#09090c] border border-zinc-800/60 rounded-2xl p-4 space-y-2.5">
              <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase block mb-1">Local Presentation Files:</span>
              <div className="flex items-center justify-between text-xs text-zinc-300 px-3 py-2 bg-[#14141c] border border-zinc-800/40 rounded-lg">
                <span className="font-mono">🚀 pitch-deck.md</span>
                <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">Pitch Template</span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-300 px-3 py-2 bg-[#14141c] border border-zinc-800/40 rounded-lg">
                <span className="font-mono">🛠️ tech-roadmap.md</span>
                <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">Code Cards</span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-300 px-3 py-2 bg-[#14141c] border border-zinc-800/40 rounded-lg">
                <span className="font-mono">🎨 creative-portfolio.md</span>
                <span className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">Editorial Style</span>
              </div>
            </div>
          </div>

          <Link
            href="/slides"
            className="mt-8 flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition shadow-lg shadow-purple-950/20 text-sm cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Launch Presentation Workspace</span>
          </Link>
        </section>

        {/* 2. FLASHCARD STUDIO CARD (Refactored Simulator Component) */}
        <section className="col-span-12 lg:col-span-6 p-8 bg-[#111116] border border-zinc-800/80 rounded-3xl flex flex-col justify-between hover:border-indigo-500/30 transition-all group duration-300 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-2xl group-hover:bg-indigo-600/10 transition-colors pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                <BookOpen className="w-6 h-6 text-indigo-400" />
              </div>
              <span className="text-xs font-bold tracking-wider text-indigo-300 uppercase bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                Active Recall Simulator
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-white group-hover:text-indigo-300 transition-colors">
              Flashcard Studio
            </h3>
            <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
              Convert outline files and study notes into 3D active-recall flashcard decks to challenge your knowledge. Try out the live interactive flashcard simulator below!
            </p>

            {/* Flashcard Simulator Component */}
            <FlashcardSimulator />
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 w-full py-3.5 border border-zinc-800 bg-zinc-900/20 text-zinc-500 text-xs font-bold rounded-2xl select-none">
            <Sparkles className="w-4 h-4 opacity-50" />
            <span>Simulator Active — Coming Soon in Workspace v2.0</span>
          </div>
        </section>

        {/* 3. MIND MAP OUTLINER CARD (Refactored Visualizer Component) */}
        <section className="col-span-12 p-8 bg-[#111116] border border-zinc-800/80 rounded-3xl flex flex-col lg:flex-row gap-8 justify-between hover:border-purple-500/20 transition-all duration-300 shadow-2xl">
          
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-xs font-bold tracking-wider text-zinc-400 uppercase bg-zinc-500/10 px-2.5 py-1 rounded-md border border-zinc-500/20">
                  Visual Nodes Generator
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-white">
                Mind Map Visualizer
              </h3>
              <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
                Transform outlines, nested lists, and documents into clean interactive mind map trees and data relations. Easily track connections and explore knowledge hierarchies.
              </p>

              {/* Features Lists */}
              <ul className="mt-6 grid grid-cols-2 gap-3 text-xs text-zinc-400 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct Markdown Outline Parsing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Interactive Collapsible Nodes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Custom Color Tags & Anchors</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Figma & Canvas Exports</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 max-w-sm text-zinc-600 text-xs font-bold font-mono">
              STATUS: ARCHITECTURE COMPLETED / INTERACTIVE MOCK ONLINE
            </div>
          </div>

          {/* Mind Map Visualizer Component */}
          <MindMapVisualizer />

        </section>

      </main>

    </div>
  );
}
