'use client';

import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface TreeNode {
  id: string;
  label: string;
  children: string[];
}

const NODES: TreeNode[] = [
  {
    id: 'layouts',
    label: 'Slide layouts',
    children: [
      'Title layout (headers only)',
      'Split layout (image + text)',
      'Code layout (code block)',
    ],
  },
  {
    id: 'syntax',
    label: 'Syntax formatting',
    children: ['Separators (---)', 'Presenter notes (Note:)'],
  },
];

export default function MindMapVisualizer() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleNode = (id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full lg:w-120 bg-surface-muted border border-border rounded-2xl p-6 flex flex-col justify-center shrink-0">
      <span className="text-[10px] font-bold tracking-wider text-foreground-subtle uppercase block mb-3">
        Interactive node graph
      </span>

      <div className="relative border border-border bg-surface shadow-sm rounded-xl p-4 flex flex-col gap-3 font-mono text-[11px]">

        {/* Root Node */}
        <div className="flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 rounded-full bg-primary border-2 border-white shadow-md shrink-0" />
          <span className="text-primary font-bold text-xs bg-primary-soft border border-primary-border px-2.5 py-1 rounded-md">
            slides.md
          </span>
        </div>

        <ul className="ml-6 border-l border-border pl-4 flex flex-col gap-1">
          {NODES.map((node) => {
            const isCollapsed = collapsed[node.id];
            return (
              <li key={node.id}>
                <button
                  onClick={() => toggleNode(node.id)}
                  aria-expanded={!isCollapsed}
                  className="flex items-center gap-2.5 h-11 text-foreground-muted hover:text-foreground transition-colors text-left cursor-pointer w-full"
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full border shrink-0 transition-colors ${
                      isCollapsed
                        ? 'bg-surface-muted border-border-strong'
                        : 'bg-primary border-white shadow-sm'
                    }`}
                  />
                  <span className="font-semibold select-none flex-1">{node.label}</span>
                  {isCollapsed ? (
                    <Plus className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  ) : (
                    <Minus className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  )}
                </button>

                {!isCollapsed && (
                  <ul className="ml-4 border-l border-border pl-4 pb-2 space-y-1.5 text-foreground-subtle">
                    {node.children.map((child) => (
                      <li key={child} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-border-strong shrink-0" />
                        <span>{child}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

      </div>
    </div>
  );
}
