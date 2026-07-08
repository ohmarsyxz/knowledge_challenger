'use client';

import React, { useState } from 'react';
import { RotateCw, ChevronRight } from 'lucide-react';

interface MockFlashcard {
  category: string;
  question: string;
  answer: string;
}

const MOCK_FLASHCARDS: MockFlashcard[] = [
  {
    category: "Slides PRO Layouts",
    question: "What layout is automatically triggered when a slide contains exactly one image alongside text list items?",
    answer: "The Split Screen Layout! (It divides the canvas 50/50 showing the image on the left, and text elements on the right)."
  },
  {
    category: "Markdown Formatting",
    question: "How do you separate individual slides in a markdown file for the Slides PRO parser?",
    answer: "Using three dashes (---) on a line by itself, surrounded by blank lines."
  },
  {
    category: "Presenter Console Sync",
    question: "Which native browser API is used to synchronize page transitions between the main slides screen and the presenter view window?",
    answer: "The BroadcastChannel API, allowing sub-millisecond bidirectional communication across browser tabs."
  }
];

export default function FlashcardSimulator() {
  const [cardIdx, setCardIdx] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const handleNextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCardIdx((prev) => (prev + 1) % MOCK_FLASHCARDS.length);
    }, 200);
  };

  const activeCard = MOCK_FLASHCARDS[cardIdx];

  return (
    <div className="mt-8 flex flex-col items-center w-full">
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full h-44 cursor-pointer relative perspective"
      >
        <div className={`w-full h-full duration-500 preserve-3d absolute rounded-2xl border shadow-xl flex items-center justify-center p-6 text-center select-none ${isFlipped
            ? 'rotate-y-180 bg-gradient-to-tr from-[#1b1928] to-[#121217] border-purple-500/40 text-purple-200'
            : 'bg-gradient-to-tr from-[#14141e] to-[#0f0f15] border-zinc-850 text-zinc-100 hover:border-zinc-700'
          }`}>
          {/* Front Side */}
          <div className={`absolute flex flex-col items-center justify-center p-4 backface-hidden ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/25 mb-3">
              {activeCard.category}
            </span>
            <p className="text-sm font-semibold text-zinc-200 px-4 leading-relaxed">
              {activeCard.question}
            </p>
            <span className="text-[10px] text-zinc-500 mt-4 flex items-center gap-1">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Click card to reveal answer</span>
            </span>
          </div>

          {/* Back Side */}
          <div className={`absolute flex flex-col items-center justify-center p-4 rotate-y-180 backface-hidden ${isFlipped ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/25 mb-3">
              Recall Explanation
            </span>
            <p className="text-xs text-zinc-350 px-4 leading-relaxed">
              {activeCard.answer}
            </p>
          </div>
        </div>
      </div>

      {/* Deck Navigation */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Avoid triggering double flips
          handleNextCard();
        }}
        className="mt-4 flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-indigo-300 transition-colors cursor-pointer"
      >
        <span>Skip to Next Card</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
