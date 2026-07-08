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
    <div className="w-full lg:w-[480px] bg-slate-50 border border-slate-205/80 rounded-2xl p-6 flex flex-col justify-center shrink-0">
      <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-3">Interactive Node Graph:</span>
      
      <div className="relative border border-slate-200 bg-white shadow-sm rounded-xl p-4 flex flex-col gap-3 font-mono text-[11px]">
        
        {/* Root Node */}
        <div className="flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 rounded-full bg-purple-600 border-2 border-white shadow-md shadow-purple-500/20" />
          <span className="text-purple-750 font-bold text-xs bg-purple-50 border border-purple-250/70 px-2.5 py-1 rounded-md">slides.md Outline</span>
        </div>

        {/* Branch Connection Line 1 */}
        <div className="ml-6 border-l border-slate-200 pl-4 flex flex-col gap-2 relative">
          
          {/* Node A (Collapsible) */}
          <div>
            <button 
              onClick={() => toggleNode("layouts")}
              className="flex items-center gap-2.5 text-slate-700 hover:text-slate-900 transition-colors text-left cursor-pointer"
            >
              <span className={`w-2.5 h-2.5 rounded-full border transition-all ${
                collapsedNode.layouts ? 'bg-slate-200 border-slate-350' : 'bg-indigo-650 border-white shadow-sm'
              }`} />
              <span className="font-semibold select-none">Slide Layouts {collapsedNode.layouts ? '[+]' : '[-]'}</span>
            </button>
            
            {!collapsedNode.layouts && (
              <div className="ml-4 border-l border-slate-150 pl-4 mt-2 space-y-1.5 text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Title layout (Headers only)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Split layout (Image text)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Code layout (Code block)</span>
                </div>
              </div>
            )}
          </div>

          {/* Node B (Collapsible) */}
          <div className="mt-2">
            <button 
              onClick={() => toggleNode("syntax")}
              className="flex items-center gap-2.5 text-slate-700 hover:text-slate-900 transition-colors text-left cursor-pointer"
            >
              <span className={`w-2.5 h-2.5 rounded-full border transition-all ${
                collapsedNode.syntax ? 'bg-slate-200 border-slate-350' : 'bg-indigo-650 border-white shadow-sm'
              }`} />
              <span className="font-semibold select-none">Syntax Formatting {collapsedNode.syntax ? '[+]' : '[-]'}</span>
            </button>
            
            {!collapsedNode.syntax && (
              <div className="ml-4 border-l border-slate-150 pl-4 mt-2 space-y-1.5 text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Separators (---)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
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
