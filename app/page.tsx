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
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans relative overflow-hidden flex flex-col">
      
      {/* Decorative Background Light Glimmers */}
      <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[50%] rounded-full bg-purple-100/60 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[60%] h-[50%] rounded-full bg-indigo-100/50 blur-[130px] pointer-events-none" />

      {/* Hero Section */}
      <section className="text-center pt-20 pb-16 px-6 max-w-4xl mx-auto relative z-20 flex-shrink-0">
        <span className="text-xs font-bold tracking-widest text-purple-600 uppercase bg-purple-100 px-3.5 py-1.5 rounded-full border border-purple-200">
          Knowledge Challenger Suite
        </span>
        <h2 className="text-5xl md:text-6xl font-black tracking-tight mt-6 leading-tight select-none text-slate-900">
          Supercharge Your{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600">
            Markdown Workflow
          </span>
        </h2>
        <p className="text-slate-600 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed select-text">
          A premium suite of tools to convert local folders, documents, and outline lists into presentation slides, study flashcards, and mind maps instantly.
        </p>
      </section>

      {/* Features Showcase Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-8 pb-20 relative z-20 grid grid-cols-12 gap-8 items-stretch">
        
        {/* 1. SLIDES PRO CARD (Flagship Feature) */}
        <section className="col-span-12 lg:col-span-6 p-8 bg-white border border-slate-200 rounded-3xl flex flex-col justify-between hover:border-purple-300 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group duration-300 relative overflow-hidden shadow-xl shadow-slate-100">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
                <Tv className="w-6 h-6 text-purple-650" />
              </div>
              <span className="text-xs font-bold tracking-wider text-emerald-700 uppercase bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active Workspace</span>
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-purple-650 transition-colors">
              Slides PRO
            </h3>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              Instantly turn markdown presentations into beautiful slide decks. Features a real-time workspace watcher, dual-screen presenter view console, and gorgeous glassmorphic themes.
            </p>

            {/* Simulated Workspace Files Mini Panel */}
            <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
              <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-1">Local Presentation Files:</span>
              <div className="flex items-center justify-between text-xs text-slate-700 px-3 py-2.5 bg-white border border-slate-200/60 rounded-lg shadow-sm">
                <span className="font-mono font-medium">🚀 pitch-deck.md</span>
                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">Pitch Template</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-700 px-3 py-2.5 bg-white border border-slate-200/60 rounded-lg shadow-sm">
                <span className="font-mono font-medium">🛠️ tech-roadmap.md</span>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">Code Cards</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-700 px-3 py-2.5 bg-white border border-slate-200/60 rounded-lg shadow-sm">
                <span className="font-mono font-medium">🎨 creative-portfolio.md</span>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">Editorial Style</span>
              </div>
            </div>
          </div>

          <Link
            href="/slides"
            className="mt-8 flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-550 hover:to-indigo-550 text-white font-bold rounded-2xl transition shadow-lg shadow-purple-600/15 text-sm cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Launch Presentation Workspace</span>
          </Link>
        </section>

        {/* 2. FLASHCARD STUDIO CARD (Refactored Simulator Component) */}
        <section className="col-span-12 lg:col-span-6 p-8 bg-white border border-slate-200 rounded-3xl flex flex-col justify-between hover:border-indigo-300 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group duration-300 relative overflow-hidden shadow-xl shadow-slate-100">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-xs font-bold tracking-wider text-indigo-700 uppercase bg-indigo-55 px-2.5 py-1 rounded-md border border-indigo-200">
                Active Recall Simulator
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
              Flashcard Studio
            </h3>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              Convert outline files and study notes into 3D active-recall flashcard decks to challenge your knowledge. Try out the live interactive flashcard simulator below!
            </p>

            {/* Flashcard Simulator Component */}
            <FlashcardSimulator />
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 w-full py-3.5 border border-slate-200 bg-slate-50 text-slate-500 text-xs font-bold rounded-2xl select-none">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Simulator Active — Coming Soon in Workspace v2.0</span>
          </div>
        </section>

        {/* 3. MIND MAP OUTLINER CARD (Refactored Visualizer Component) */}
        <section className="col-span-12 p-8 bg-white border border-slate-200 rounded-3xl flex flex-col lg:flex-row gap-8 justify-between hover:border-purple-300 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 shadow-xl shadow-slate-100">
          
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
                  <Brain className="w-6 h-6 text-purple-650" />
                </div>
                <span className="text-xs font-bold tracking-wider text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                  Visual Nodes Generator
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900">
                Mind Map Visualizer
              </h3>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Transform outlines, nested lists, and documents into clean interactive mind map trees and data relations. Easily track connections and explore knowledge hierarchies.
              </p>

              {/* Features Lists */}
              <ul className="mt-6 grid grid-cols-2 gap-3 text-xs text-slate-600 font-semibold">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct Markdown Outline Parsing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Interactive Collapsible Nodes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Custom Color Tags & Anchors</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Figma & Canvas Exports</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 max-w-sm text-slate-400 text-xs font-bold font-mono">
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
