'use client';

import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { Slide } from '../../app/types';

interface SlideRendererProps {
  slide: Slide;
}

function ImageWithFallback({ src, alt, borderVar }: { src: string; alt?: string; borderVar: string }) {
  const [error, setError] = useState(false);

  return (
    <div
      className="relative w-full h-full min-h-55 rounded-xl overflow-hidden border shadow-xl group flex items-center justify-center bg-surface-muted"
      style={{ borderColor: borderVar }}
    >
      {!error ? (
        // next/image is deliberately not used: src comes from arbitrary user
        // markdown, and next/image throws at runtime for any host absent from
        // remotePatterns. A lint warning beats a crash on someone's slide.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt || 'Slide image'}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          onError={() => setError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-surface-muted text-center select-none">
          <ImageOff className="w-8 h-8 mb-3 text-foreground-subtle" aria-hidden="true" />
          <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider">
            {alt || 'Image unavailable'}
          </span>
          <span className="text-[10px] text-foreground-subtle mt-1 truncate max-w-xs font-mono">
            {src}
          </span>
        </div>
      )}
      {!error && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      )}
    </div>
  );
}

export function parseInlineMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];

  const parts = text.split(/(\*\*.*?\*\*|`.*?`|\$.*?\$|\*.*?\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-extrabold" style={{ color: 'var(--slide-fg)' }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 border rounded text-[0.85em] font-mono mx-0.5"
          style={{
            backgroundColor: 'var(--slide-card-bg)',
            borderColor: 'var(--slide-border)',
            color: 'var(--slide-accent)',
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('$') && part.endsWith('$')) {
      return (
        <span
          key={index}
          className="font-mono px-1.5 py-0.5 rounded text-[0.85em] border mx-0.5 font-semibold"
          style={{
            backgroundColor: 'var(--slide-card-bg)',
            borderColor: 'var(--slide-border)',
            color: 'var(--slide-accent)',
          }}
        >
          {part.slice(1, -1)}
        </span>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={index} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}

export default function SlideRenderer({ slide }: SlideRendererProps) {
  if (!slide) return null;

  const renderSlideElements = (elList: typeof slide.elements) => {
    return elList.map((el, i) => {
      switch (el.type) {
        case 'h1':
          return (
            <h1
              key={i}
              className="text-5xl font-black tracking-tight mb-4 select-text leading-tight py-1"
              style={{ color: 'var(--slide-fg)' }}
            >
              {parseInlineMarkdown(el.content)}
            </h1>
          );
        case 'h2':
          return (
            <h2
              key={i}
              className="text-3xl font-extrabold mb-4 select-text"
              style={{ color: 'var(--slide-accent)' }}
            >
              {parseInlineMarkdown(el.content)}
            </h2>
          );
        case 'h3':
          return (
            <h3
              key={i}
              className="text-2xl font-bold mb-3 opacity-90 select-text"
              style={{ color: 'var(--slide-fg)' }}
            >
              {parseInlineMarkdown(el.content)}
            </h3>
          );
        case 'h4':
        case 'h5':
        case 'h6':
          return (
            <h4
              key={i}
              className="text-xl font-semibold mb-2 opacity-80 select-text"
              style={{ color: 'var(--slide-fg)' }}
            >
              {parseInlineMarkdown(el.content)}
            </h4>
          );
        case 'ul':
          return (
            <ul key={i} className="space-y-3 mb-4 list-none text-xl pl-0">
              {el.items?.map((item, idx) => {
                const leadingSpaces = item.match(/^(\s*)/)?.[1].length || 0;
                const cleanItem = item.trim();
                return (
                  <li
                    key={idx}
                    className="flex items-start gap-3 select-text"
                    style={{ paddingLeft: `${leadingSpaces * 12}px` }}
                  >
                    <span
                      className="mt-2.5 w-2 h-2 rounded-full shrink-0"
                      style={{
                        backgroundColor: 'var(--slide-accent)',
                        opacity: leadingSpaces > 0 ? 0.6 : 1,
                        transform: leadingSpaces > 0 ? 'scale(0.8)' : 'none',
                      }}
                    />
                    <span>{parseInlineMarkdown(cleanItem)}</span>
                  </li>
                );
              })}
            </ul>
          );
        case 'ol':
          return (
            <ol key={i} className="space-y-3 mb-4 list-none text-xl pl-0">
              {el.items?.map((item, idx) => {
                const leadingSpaces = item.match(/^(\s*)/)?.[1].length || 0;
                const cleanItem = item.trim();
                return (
                  <li
                    key={idx}
                    className="flex items-start gap-4 select-text"
                    style={{ paddingLeft: `${leadingSpaces * 12}px` }}
                  >
                    <span
                      className="font-bold shrink-0 text-lg font-mono"
                      style={{ color: 'var(--slide-accent)' }}
                    >
                      {idx + 1}.
                    </span>
                    <span>{parseInlineMarkdown(cleanItem)}</span>
                  </li>
                );
              })}
            </ol>
          );
        case 'code':
          return (
            <div
              key={i}
              className="rounded-xl border shadow-lg overflow-hidden my-4 text-left w-full max-w-full font-mono text-sm"
              style={{
                backgroundColor: 'var(--slide-card-bg)',
                borderColor: 'var(--slide-border)',
              }}
            >
              <div
                className="flex items-center justify-between px-4 py-2 border-b"
                style={{ borderColor: 'var(--slide-border)' }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs uppercase tracking-wider opacity-60 font-semibold select-none font-sans">
                  {el.language}
                </span>
              </div>
              <pre className="p-5 overflow-x-auto text-sm leading-relaxed select-text font-mono">
                <code style={{ color: 'var(--slide-fg)' }}>{el.content}</code>
              </pre>
            </div>
          );
        case 'image':
          return (
            <ImageWithFallback
              key={i}
              src={el.src || ''}
              alt={el.alt}
              borderVar="var(--slide-border)"
            />
          );
        case 'blockquote':
          return (
            <blockquote
              key={i}
              className="pl-6 border-l-4 my-6 italic text-2xl select-text"
              style={{
                borderColor: 'var(--slide-accent)',
                color: 'var(--slide-fg)',
              }}
            >
              “{parseInlineMarkdown(el.content)}”
            </blockquote>
          );
        case 'paragraph':
          return (
            <p
              key={i}
              className="text-lg opacity-80 leading-relaxed mb-4 select-text"
              style={{ color: 'var(--slide-fg)' }}
            >
              {parseInlineMarkdown(el.content)}
            </p>
          );
        default:
          return null;
      }
    });
  };

  switch (slide.layout) {
    case 'title':
      return (
        <div className="flex flex-col items-center justify-center text-center h-full max-w-2xl mx-auto px-6 slide-content-anim">
          {renderSlideElements(slide.elements)}
        </div>
      );

    case 'code': {
      const textElements = slide.elements.filter((el) => el.type !== 'code');
      const codeElement = slide.elements.find((el) => el.type === 'code');

      return (
        <div className="grid grid-cols-12 gap-8 items-center h-full w-full px-12 slide-content-anim">
          {codeElement && textElements.length > 0 ? (
            <>
              <div className="col-span-5 flex flex-col justify-center text-left">
                {textElements.map((el, idx) => (
                  <div key={idx}>{renderSlideElements([el])}</div>
                ))}
              </div>
              <div className="col-span-7 flex flex-col justify-center items-stretch h-full">
                {renderSlideElements([codeElement])}
              </div>
            </>
          ) : (
            <div className="col-span-12 flex flex-col justify-center items-center max-w-4xl mx-auto w-full">
              {renderSlideElements(slide.elements)}
            </div>
          )}
        </div>
      );
    }

    case 'split': {
      const imageElement = slide.elements.find((el) => el.type === 'image');
      const textElements = slide.elements.filter((el) => el.type !== 'image');

      return (
        <div className="grid grid-cols-2 gap-12 items-center h-full w-full px-12 slide-content-anim">
          {imageElement ? (
            <div className="h-[360px] flex items-stretch">
              {renderSlideElements([imageElement])}
            </div>
          ) : (
            <div className="bg-stone-300 rounded-xl animate-pulse" />
          )}
          <div className="flex flex-col justify-center text-left">
            {textElements.map((el, idx) => (
              <div key={idx}>{renderSlideElements([el])}</div>
            ))}
          </div>
        </div>
      );
    }

    case 'default':
    default: {
      const headers = slide.elements.filter((el) => el.type.startsWith('h'));
      const bodyContent = slide.elements.filter((el) => !el.type.startsWith('h'));

      return (
        <div className="flex flex-col justify-start text-left h-full w-full px-16 py-12 slide-content-anim">
          {headers.length > 0 && (
            <div className="border-b pb-4 mb-6 border-white/10" style={{ borderColor: 'var(--slide-border)' }}>
              {headers.map((el, idx) => (
                <div key={idx}>{renderSlideElements([el])}</div>
              ))}
            </div>
          )}
          <div className="flex-1 flex flex-col justify-center max-w-4xl">
            {bodyContent.map((el, idx) => (
              <div key={idx}>{renderSlideElements([el])}</div>
            ))}
          </div>
        </div>
      );
    }
  }
}
