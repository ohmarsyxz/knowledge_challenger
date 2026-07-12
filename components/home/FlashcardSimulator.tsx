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
      {/* A real <button> so the card flips with Enter/Space, not just a mouse. */}
      <button
        type="button"
        onClick={() => setIsFlipped(!isFlipped)}
        aria-pressed={isFlipped}
        aria-label={
          isFlipped
            ? 'Showing answer. Activate to show the question again.'
            : 'Showing question. Activate to reveal the answer.'
        }
        className="w-full h-44 cursor-pointer relative perspective text-left"
      >
        <div
          className={`w-full h-full duration-300 preserve-3d absolute rounded-2xl border shadow-lg flex items-center justify-center p-6 text-center ${
            isFlipped
              ? 'rotate-y-180 bg-primary-soft border-primary-border'
              : 'bg-surface border-border hover:border-border-strong hover:shadow-xl'
          }`}
        >
          {/* Front Side */}
          <div
            className={`absolute flex flex-col items-center justify-center p-4 backface-hidden transition-opacity duration-150 ${
              isFlipped ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary-soft px-2.5 py-1 rounded-full border border-primary-border mb-3">
              {activeCard.category}
            </span>
            <p className="text-sm font-semibold text-foreground px-4 leading-relaxed">
              {activeCard.question}
            </p>
            <span className="text-[10px] text-foreground-subtle mt-4 flex items-center gap-1">
              <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reveal answer</span>
            </span>
          </div>

          {/* Back Side */}
          <div
            className={`absolute flex flex-col items-center justify-center p-4 rotate-y-180 backface-hidden transition-opacity duration-150 ${
              isFlipped ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-surface px-2.5 py-1 rounded-full border border-primary-border mb-3">
              Answer
            </span>
            <p className="text-xs text-foreground-muted font-medium px-4 leading-relaxed">
              {activeCard.answer}
            </p>
          </div>
        </div>
      </button>

      {/* Deck Navigation */}
      <button
        type="button"
        onClick={handleNextCard}
        className="mt-3 flex items-center gap-1 h-11 px-3 text-xs font-semibold text-foreground-subtle hover:text-primary transition-colors duration-150 cursor-pointer"
      >
        <span>Next card</span>
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}
