'use client';

import React, { useState } from 'react';

export default function MindMapVisualizer() {
  const [collapsedNode, setCollapsedNode] = useState<Record<string, boolean>>({
    layouts: false,
    syntax: false,
  });

  const toggleNode = (node: string) => {
    setCollapsedNode((prev) => ({ ...prev, [node]: !prev[node] }));
  };

  return (
    <div className="w-full lg:w-[480px] bg-[#09090c] border border-zinc-800/60 rounded-2xl p-6 flex flex-col justify-center shrink-0">
      <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase block mb-3">Interactive Node Graph:</span>
      
      <div className="relative border border-zinc-900 bg-black/30 rounded-xl p-4 flex flex-col gap-3 font-mono text-[11px]">
        
        {/* Root Node */}
        <div className="flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 rounded-full bg-purple-600 border-2 border-white/20 shadow-md shadow-purple-500/20" />
          <span className="text-white font-bold text-xs bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md">slides.md Outline</span>
        </div>

        {/* Branch Connection Line 1 */}
        <div className="ml-6 border-l border-zinc-800 pl-4 flex flex-col gap-2 relative">
          
          {/* Node A (Collapsible) */}
          <div>
            <button 
              onClick={() => toggleNode("layouts")}
              className="flex items-center gap-2.5 text-zinc-300 hover:text-white transition-colors text-left cursor-pointer"
            >
              <span className={`w-2.5 h-2.5 rounded-full border transition-all ${
                collapsedNode.layouts ? 'bg-zinc-800 border-zinc-600' : 'bg-indigo-500 border-white/10'
              }`} />
              <span className="font-semibold select-none">Slide Layouts {collapsedNode.layouts ? '[+]' : '[-]'}</span>
            </button>
            
            {!collapsedNode.layouts && (
              <div className="ml-4 border-l border-zinc-800 pl-4 mt-2 space-y-1.5 text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  <span>Title layout (Headers only)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  <span>Split layout (Image text)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  <span>Code layout (Code block)</span>
                </div>
              </div>
            )}
          </div>

          {/* Node B (Collapsible) */}
          <div className="mt-2">
            <button 
              onClick={() => toggleNode("syntax")}
              className="flex items-center gap-2.5 text-zinc-300 hover:text-white transition-colors text-left cursor-pointer"
            >
              <span className={`w-2.5 h-2.5 rounded-full border transition-all ${
                collapsedNode.syntax ? 'bg-zinc-800 border-zinc-600' : 'bg-indigo-500 border-white/10'
              }`} />
              <span className="font-semibold select-none">Syntax Formatting {collapsedNode.syntax ? '[+]' : '[-]'}</span>
            </button>
            
            {!collapsedNode.syntax && (
              <div className="ml-4 border-l border-zinc-800 pl-4 mt-2 space-y-1.5 text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  <span>Separators (---)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  <span>Presenter Notes (Note: )</span>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
